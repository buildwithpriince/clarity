from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Clarity API")
api_router = APIRouter(prefix="/api")


# ============================================================
# CREDIT SCORING MODEL — interpretable weighted-factor design
# Range: 300 - 900 (Indian bureau convention)
# ============================================================

# Each factor has a weight (sums to 1.0) and a mapping of answer_value -> normalized score 0..1
CREDIT_FACTORS: Dict[str, Dict[str, Any]] = {
    "utility_payments": {
        "label": "Utility bills on time",
        "weight": 0.18,
        "options": {
            "always": 1.00,
            "mostly": 0.75,
            "sometimes": 0.45,
            "rarely": 0.15,
        },
        "improvement": "Set utility bills on auto-pay to lift this signal quickly.",
    },
    "mobile_recharges": {
        "label": "Mobile recharge consistency",
        "weight": 0.10,
        "options": {
            "scheduled": 1.00,
            "on_expiry": 0.70,
            "when_needed": 0.45,
            "irregular": 0.20,
        },
        "improvement": "A steady monthly recharge cycle reads as reliable behavior.",
    },
    "upi_frequency": {
        "label": "UPI activity",
        "weight": 0.12,
        "options": {
            "daily": 1.00,
            "few_weekly": 0.80,
            "weekly": 0.55,
            "rarely": 0.25,
        },
        "improvement": "Regular UPI use builds a visible digital footprint.",
    },
    "rent_payments": {
        "label": "Rent / EMI punctuality",
        "weight": 0.20,
        "options": {
            "always": 1.00,
            "mostly": 0.75,
            "sometimes_late": 0.40,
            "often_late": 0.15,
        },
        "improvement": "Even a two-month streak of on-time rent moves this needle.",
    },
    "savings_habit": {
        "label": "Monthly savings habit",
        "weight": 0.12,
        "options": {
            "every_month": 1.00,
            "most_months": 0.75,
            "sometimes": 0.45,
            "rarely": 0.20,
        },
        "improvement": "A recurring auto-transfer of even ₹200 forms the habit signal.",
    },
    "income_stability": {
        "label": "Income stability",
        "weight": 0.12,
        "options": {
            "very_stable": 1.00,
            "mostly_stable": 0.75,
            "variable": 0.45,
            "irregular": 0.20,
        },
        "improvement": "Diversify inflows — a second small stream steadies the signal.",
    },
    "debt_burden": {
        "label": "Debt-to-income",
        "weight": 0.10,
        "options": {
            "none": 1.00,
            "under_20": 0.80,
            "20_to_40": 0.50,
            "over_40": 0.20,
        },
        "improvement": "Bringing debt below 20% of income has the strongest lift.",
    },
    "digital_footprint": {
        "label": "Digital payment tenure",
        "weight": 0.06,
        "options": {
            "5_plus": 1.00,
            "2_to_5": 0.75,
            "1_to_2": 0.55,
            "under_1": 0.30,
        },
        "improvement": "Time on record compounds — keep the accounts you have.",
    },
}


def compute_credit_score(answers: Dict[str, str]) -> Dict[str, Any]:
    """
    Interpretable weighted-factor scoring.
    Returns score (300-900), bucket, top_factors, improvement_tips, decision_path.
    """
    contributions = []
    total_weighted = 0.0
    total_weight = 0.0
    unknown_factors = []

    for key, spec in CREDIT_FACTORS.items():
        ans = answers.get(key)
        if ans is None or ans not in spec["options"]:
            unknown_factors.append(key)
            continue
        normalized = spec["options"][ans]  # 0..1
        weighted = normalized * spec["weight"]
        total_weighted += weighted
        total_weight += spec["weight"]
        contributions.append({
            "key": key,
            "label": spec["label"],
            "weight": spec["weight"],
            "normalized": normalized,
            "contribution": weighted,
            "answer": ans,
            "improvement": spec["improvement"],
        })

    if total_weight == 0:
        raise HTTPException(status_code=400, detail="No valid answers supplied.")

    # Renormalize when some factors missing (partial signal)
    factor_score = total_weighted / total_weight  # 0..1
    # Scale to 300..900
    score = round(300 + factor_score * 600)

    # Bucket
    if score >= 780:
        bucket = "EXCELLENT"
    elif score >= 700:
        bucket = "STRONG"
    elif score >= 620:
        bucket = "FAIR"
    elif score >= 540:
        bucket = "EMERGING"
    else:
        bucket = "THIN"

    # Top factors — those with highest contribution (best signals)
    sorted_contribs = sorted(contributions, key=lambda c: c["contribution"], reverse=True)
    top_factors = [
        {
            "label": c["label"],
            "weight_pct": round(c["weight"] * 100),
            "strength": round(c["normalized"] * 100),
        }
        for c in sorted_contribs
    ]

    # Improvement tips — lowest normalized factors
    weakest = sorted(contributions, key=lambda c: c["normalized"])[:3]
    improvement_tips = [
        {"label": c["label"], "tip": c["improvement"]}
        for c in weakest if c["normalized"] < 0.9
    ]

    # Decision path — simple interpretable branch narrative
    decision_path = _build_decision_path(answers, score, bucket)

    completeness = round((len(contributions) / len(CREDIT_FACTORS)) * 100)
    confidence = "high" if completeness == 100 else ("medium" if completeness >= 75 else "low")

    return {
        "score": score,
        "bucket": bucket,
        "top_factors": top_factors,
        "improvement_tips": improvement_tips,
        "decision_path": decision_path,
        "data_completeness": {
            "answered": len(contributions),
            "total": len(CREDIT_FACTORS),
            "percent": completeness,
            "confidence": confidence,
        },
    }


def _build_decision_path(answers: Dict[str, str], score: int, bucket: str) -> List[Dict[str, str]]:
    """A yes/no-style flowchart of the branches that produced the score."""
    path = []

    rent = answers.get("rent_payments", "")
    if rent in ("always", "mostly"):
        path.append({"question": "Rent / EMI paid on time?", "answer": "Yes", "effect": "+ major uplift"})
    else:
        path.append({"question": "Rent / EMI paid on time?", "answer": "No", "effect": "− pulls score down"})

    utility = answers.get("utility_payments", "")
    if utility in ("always", "mostly"):
        path.append({"question": "Utility bills reliable?", "answer": "Yes", "effect": "+ steady uplift"})
    else:
        path.append({"question": "Utility bills reliable?", "answer": "No", "effect": "− key signal missed"})

    debt = answers.get("debt_burden", "")
    if debt in ("none", "under_20"):
        path.append({"question": "Debt under 20% of income?", "answer": "Yes", "effect": "+ headroom shown"})
    else:
        path.append({"question": "Debt under 20% of income?", "answer": "No", "effect": "− capacity concern"})

    upi = answers.get("upi_frequency", "")
    if upi in ("daily", "few_weekly"):
        path.append({"question": "Active UPI footprint?", "answer": "Yes", "effect": "+ visible history"})
    else:
        path.append({"question": "Active UPI footprint?", "answer": "No", "effect": "− thinner record"})

    savings = answers.get("savings_habit", "")
    if savings in ("every_month", "most_months"):
        path.append({"question": "Recurring savings habit?", "answer": "Yes", "effect": "+ discipline signal"})
    else:
        path.append({"question": "Recurring savings habit?", "answer": "No", "effect": "− weaker cushion"})

    path.append({
        "question": "Resulting bucket",
        "answer": bucket,
        "effect": f"→ final score {score}",
    })
    return path


# ============================================================
# INVESTMENT PROJECTION — Real SIP compound-growth math
# FV = P × (((1+r)^n − 1) / r) × (1+r)
# ============================================================

RETURN_SCENARIOS = {
    "conservative": {"low": 0.06, "mid": 0.08, "high": 0.10},
    "balanced":     {"low": 0.08, "mid": 0.11, "high": 0.14},
    "growth":       {"low": 0.10, "mid": 0.14, "high": 0.18},
}

ALLOCATIONS = {
    "conservative": {"Debt / FD": 60, "Balanced Hybrid": 30, "Equity Index": 10},
    "balanced":     {"Debt / FD": 30, "Balanced Hybrid": 40, "Equity Index": 30},
    "growth":       {"Debt / FD": 15, "Balanced Hybrid": 30, "Equity Index": 55},
}


def _sip_future_value_series(monthly: float, annual_rate: float, years: int) -> List[Dict[str, float]]:
    """Month-by-month FV using the standard SIP formula (contribution at start of month)."""
    r = annual_rate / 12.0
    series = []
    total_months = years * 12
    for m in range(1, total_months + 1):
        if r == 0:
            fv = monthly * m
        else:
            fv = monthly * (((1 + r) ** m - 1) / r) * (1 + r)
        series.append({
            "month": m,
            "year": round(m / 12, 2),
            "invested": round(monthly * m, 2),
            "value": round(fv, 2),
        })
    return series


def compute_investment_plan(risk_bucket: str, monthly_amount: float, monthly_income: float, tenure_years: int) -> Dict[str, Any]:
    if risk_bucket not in RETURN_SCENARIOS:
        raise HTTPException(status_code=400, detail=f"Unknown risk bucket: {risk_bucket}")
    if monthly_amount <= 0 or tenure_years <= 0:
        raise HTTPException(status_code=400, detail="Monthly amount and tenure must be positive.")

    scenarios = RETURN_SCENARIOS[risk_bucket]
    projections = {
        name: _sip_future_value_series(monthly_amount, rate, tenure_years)
        for name, rate in scenarios.items()
    }

    total_invested = round(monthly_amount * tenure_years * 12, 2)

    # Sanity note on surplus (never punitive)
    surplus_note = None
    if monthly_income and monthly_income > 0:
        share = monthly_amount / monthly_income
        if share > 0.5:
            surplus_note = "This is a high share of income — a lower monthly amount may be more sustainable."
        elif share > 0.3:
            surplus_note = "This is on the higher side — comfortable, but worth revisiting yearly."
        else:
            surplus_note = "This sits comfortably within your monthly surplus."

    return {
        "risk_bucket": risk_bucket,
        "allocation": ALLOCATIONS[risk_bucket],
        "rates": {k: round(v * 100, 2) for k, v in scenarios.items()},
        "projections": projections,
        "summary": {
            "monthly_amount": monthly_amount,
            "monthly_income": monthly_income,
            "tenure_years": tenure_years,
            "tenure_months": tenure_years * 12,
            "total_invested": total_invested,
            "final_low": projections["low"][-1]["value"],
            "final_mid": projections["mid"][-1]["value"],
            "final_high": projections["high"][-1]["value"],
        },
        "surplus_note": surplus_note,
    }


def derive_risk_bucket(temperament: str, drop_reaction: str, primary_goal: str) -> str:
    """Score to a bucket from 3 signals."""
    score = 0
    score += {"safe": 0, "measured": 1, "swings": 2}.get(temperament, 1)
    score += {"sell": 0, "hold": 1, "buy_more": 2}.get(drop_reaction, 1)
    score += {"safety": 0, "specific": 1, "growth": 2}.get(primary_goal, 1)
    # 0-2 conservative, 3-4 balanced, 5-6 growth
    if score <= 2:
        return "conservative"
    if score <= 4:
        return "balanced"
    return "growth"


# ============================================================
# SAMPLE PROFILES — Chapter 02
# ============================================================

SAMPLE_PROFILES = [
    {
        "id": "p01",
        "name": "Meena Devi",
        "occupation": "Textile shop owner",
        "age": 42,
        "location": "Bhagalpur, Bihar",
        "score": 762,
        "label": "STRONG",
        "story": "Ten years of steady mobile recharges and never a late electricity bill — a full ledger with no bureau file.",
        "image": "https://images.unsplash.com/photo-1774437790995-9a8513532a25?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzaG9wa2VlcGVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0ODA0NjgzfDA&ixlib=rb-4.1.0&q=85",
    },
    {
        "id": "p02",
        "name": "Ram Singh",
        "occupation": "Farmer",
        "age": 58,
        "location": "Sitapur, Uttar Pradesh",
        "score": 684,
        "label": "FAIR",
        "story": "Seasonal income, but every rupee of the tractor loan repaid on time for four years running.",
        "image": "https://images.pexels.com/photos/32277759/pexels-photo-32277759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "p03",
        "name": "Sunita Kumari",
        "occupation": "Anganwadi worker",
        "age": 34,
        "location": "Ranchi, Jharkhand",
        "score": 811,
        "label": "EXCELLENT",
        "story": "A recurring deposit of ₹500 held without a break since 2019 — the discipline is the file.",
        "image": "https://images.pexels.com/photos/29601846/pexels-photo-29601846.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "p04",
        "name": "Arun Patel",
        "occupation": "Kirana store owner",
        "age": 47,
        "location": "Anand, Gujarat",
        "score": 728,
        "label": "STRONG",
        "story": "UPI ledger of eight thousand small transactions a year. Reads as reliable, once you know where to look.",
        "image": "https://images.unsplash.com/photo-1765644793546-f827f7534e89?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBzaG9wa2VlcGVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0ODA0NjgzfDA&ixlib=rb-4.1.0&q=85",
    },
    {
        "id": "p05",
        "name": "Harbhajan Kaur",
        "occupation": "Dairy cooperative member",
        "age": 51,
        "location": "Ludhiana, Punjab",
        "score": 655,
        "label": "FAIR",
        "story": "Milk-cheque income, but rent and school fees settled the first week of every month for a decade.",
        "image": "https://images.unsplash.com/photo-1722925407220-b22e1ced9ee9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBmYXJtZXIlMjBwb3J0cmFpdHxlbnwwfHx8fDE3ODQ4MDQ2ODN8MA&ixlib=rb-4.1.0&q=85",
    },
    {
        "id": "p06",
        "name": "Vijay Yadav",
        "occupation": "Auto driver",
        "age": 29,
        "location": "Varanasi, Uttar Pradesh",
        "score": 596,
        "label": "EMERGING",
        "story": "Two years of daily UPI fares and a spotless mobile recharge streak — the signal is only just becoming visible.",
        "image": "https://images.pexels.com/photos/36998122/pexels-photo-36998122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
]


# ============================================================
# Pydantic request models
# ============================================================

class ScoreRequest(BaseModel):
    answers: Dict[str, str] = Field(..., description="Map of factor key to answer key")


class InvestRequest(BaseModel):
    risk_bucket: Optional[str] = None  # conservative | balanced | growth
    temperament: Optional[str] = None  # safe | measured | swings
    drop_reaction: Optional[str] = None  # sell | hold | buy_more
    primary_goal: Optional[str] = None  # safety | growth | specific
    monthly_amount: float
    monthly_income: float = 0
    tenure_years: int = 10


# ============================================================
# Endpoints
# ============================================================

@api_router.get("/")
async def root():
    return {"service": "clarity", "status": "ok"}


@api_router.get("/factors")
async def get_factors():
    """Exposes the factor catalog so the frontend can render the questionnaire from a single source of truth."""
    return {
        "factors": [
            {
                "key": key,
                "label": spec["label"],
                "weight": spec["weight"],
                "options": [
                    {"value": v, "score": s} for v, s in spec["options"].items()
                ],
            }
            for key, spec in CREDIT_FACTORS.items()
        ]
    }


@api_router.post("/score/from-answers")
async def score_from_answers(req: ScoreRequest):
    result = compute_credit_score(req.answers)
    return result


@api_router.post("/invest/recommend")
async def invest_recommend(req: InvestRequest):
    bucket = req.risk_bucket
    if not bucket:
        if not (req.temperament and req.drop_reaction and req.primary_goal):
            raise HTTPException(status_code=400, detail="Provide risk_bucket or all three of temperament/drop_reaction/primary_goal.")
        bucket = derive_risk_bucket(req.temperament, req.drop_reaction, req.primary_goal)

    plan = compute_investment_plan(bucket, req.monthly_amount, req.monthly_income, req.tenure_years)
    plan["derived_from"] = {
        "temperament": req.temperament,
        "drop_reaction": req.drop_reaction,
        "primary_goal": req.primary_goal,
    }
    return plan


@api_router.get("/profiles")
async def get_profiles():
    return {"profiles": SAMPLE_PROFILES}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
