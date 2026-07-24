"""
Backend API tests for Clarity fintech prototype.
Covers: root health, profiles, credit scoring (/api/score/from-answers), investment
recommendations (/api/invest/recommend) including SIP math and risk-bucket derivation.
"""
import os
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ------------------------------------------------------------
# Root & Profiles
# ------------------------------------------------------------
class TestRoot:
    def test_root_ok(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "clarity"
        assert data.get("status") == "ok"


class TestProfiles:
    def test_profiles_returns_six(self, api_client):
        r = api_client.get(f"{API}/profiles")
        assert r.status_code == 200
        data = r.json()
        profiles = data["profiles"]
        assert isinstance(profiles, list)
        assert len(profiles) == 6
        required_fields = {"name", "score", "label", "image", "story"}
        for p in profiles:
            missing = required_fields - set(p.keys())
            assert not missing, f"Profile missing fields {missing}: {p}"
            assert isinstance(p["score"], int)
            assert 300 <= p["score"] <= 900
            assert p["image"].startswith("http")


# ------------------------------------------------------------
# Credit scoring
# ------------------------------------------------------------
HIGH_QUALITY_ANSWERS = {
    "utility_payments": "always",
    "mobile_recharges": "scheduled",
    "upi_frequency": "daily",
    "rent_payments": "always",
    "savings_habit": "every_month",
    "income_stability": "very_stable",
    "debt_burden": "none",
    "digital_footprint": "5_plus",
}

LOW_QUALITY_ANSWERS = {
    "utility_payments": "rarely",
    "mobile_recharges": "irregular",
    "upi_frequency": "rarely",
    "rent_payments": "often_late",
    "savings_habit": "rarely",
    "income_stability": "irregular",
    "debt_burden": "over_40",
    "digital_footprint": "under_1",
}


class TestCreditScore:
    def test_full_answers_high_quality(self, api_client):
        r = api_client.post(f"{API}/score/from-answers", json={"answers": HIGH_QUALITY_ANSWERS})
        assert r.status_code == 200
        data = r.json()
        assert 300 <= data["score"] <= 900
        assert data["bucket"] in {"EXCELLENT", "STRONG", "FAIR", "EMERGING", "THIN"}
        assert isinstance(data["top_factors"], list) and len(data["top_factors"]) > 0
        assert isinstance(data["improvement_tips"], list)
        assert isinstance(data["decision_path"], list) and len(data["decision_path"]) > 0
        dc = data["data_completeness"]
        assert dc["answered"] == 8
        assert dc["total"] == 8
        assert dc["percent"] == 100
        assert dc["confidence"] == "high"

    def test_low_quality_less_than_high(self, api_client):
        r_high = api_client.post(f"{API}/score/from-answers", json={"answers": HIGH_QUALITY_ANSWERS})
        r_low = api_client.post(f"{API}/score/from-answers", json={"answers": LOW_QUALITY_ANSWERS})
        assert r_high.status_code == 200 and r_low.status_code == 200
        assert r_low.json()["score"] < r_high.json()["score"]

    def test_partial_answers_lower_confidence(self, api_client):
        partial = {k: v for i, (k, v) in enumerate(HIGH_QUALITY_ANSWERS.items()) if i < 4}
        r = api_client.post(f"{API}/score/from-answers", json={"answers": partial})
        assert r.status_code == 200
        data = r.json()
        assert 300 <= data["score"] <= 900
        assert data["data_completeness"]["confidence"] != "high"
        assert data["data_completeness"]["answered"] == 4

    def test_empty_answers_rejected(self, api_client):
        r = api_client.post(f"{API}/score/from-answers", json={"answers": {}})
        assert r.status_code == 400


# ------------------------------------------------------------
# Investment recommendations
# ------------------------------------------------------------
class TestInvestRecommend:
    def test_risk_bucket_growth(self, api_client):
        r = api_client.post(f"{API}/invest/recommend", json={
            "temperament": "swings",
            "drop_reaction": "buy_more",
            "primary_goal": "growth",
            "monthly_amount": 5000,
            "monthly_income": 30000,
            "tenure_years": 10,
        })
        assert r.status_code == 200
        data = r.json()
        assert data["risk_bucket"] == "growth"

    def test_risk_bucket_conservative(self, api_client):
        r = api_client.post(f"{API}/invest/recommend", json={
            "temperament": "safe",
            "drop_reaction": "sell",
            "primary_goal": "safety",
            "monthly_amount": 5000,
            "monthly_income": 30000,
            "tenure_years": 10,
        })
        assert r.status_code == 200
        assert r.json()["risk_bucket"] == "conservative"

    def test_risk_bucket_balanced(self, api_client):
        r = api_client.post(f"{API}/invest/recommend", json={
            "temperament": "measured",
            "drop_reaction": "hold",
            "primary_goal": "specific",
            "monthly_amount": 5000,
            "monthly_income": 30000,
            "tenure_years": 10,
        })
        assert r.status_code == 200
        assert r.json()["risk_bucket"] == "balanced"

    def test_projection_lengths(self, api_client):
        r = api_client.post(f"{API}/invest/recommend", json={
            "risk_bucket": "balanced",
            "monthly_amount": 5000,
            "monthly_income": 30000,
            "tenure_years": 10,
        })
        assert r.status_code == 200
        data = r.json()
        expected = 10 * 12
        assert len(data["projections"]["low"]) == expected
        assert len(data["projections"]["mid"]) == expected
        assert len(data["projections"]["high"]) == expected

    def test_sip_math_5000_11pct_10yr(self, api_client):
        """FV = P * (((1+r)^n - 1)/r) * (1+r), r = 0.11/12, n = 120, P=5000
           ≈ 1,094,936 — must match within 1%."""
        r = api_client.post(f"{API}/invest/recommend", json={
            "risk_bucket": "balanced",  # mid rate = 0.11
            "monthly_amount": 5000,
            "monthly_income": 30000,
            "tenure_years": 10,
        })
        assert r.status_code == 200
        data = r.json()
        mid_last = data["projections"]["mid"][-1]["value"]

        rate = 0.11 / 12
        expected = 5000 * (((1 + rate) ** 120 - 1) / rate) * (1 + rate)
        assert abs(mid_last - expected) / expected < 0.01, (
            f"Expected ~{expected:.2f}, got {mid_last}"
        )
        # Also sanity-check against the ~1,094,936 target
        assert abs(mid_last - 1_094_936) / 1_094_936 < 0.01

    def test_allocation_sums_to_100(self, api_client):
        for bucket in ("conservative", "balanced", "growth"):
            r = api_client.post(f"{API}/invest/recommend", json={
                "risk_bucket": bucket,
                "monthly_amount": 1000,
                "monthly_income": 10000,
                "tenure_years": 5,
            })
            assert r.status_code == 200
            alloc = r.json()["allocation"]
            assert sum(alloc.values()) == 100, f"Allocation for {bucket} sums to {sum(alloc.values())}"

    def test_missing_signals_rejected(self, api_client):
        r = api_client.post(f"{API}/invest/recommend", json={
            "temperament": "safe",  # missing others
            "monthly_amount": 1000,
            "monthly_income": 10000,
            "tenure_years": 5,
        })
        assert r.status_code == 400

    def test_negative_monthly_amount_rejected(self, api_client):
        r = api_client.post(f"{API}/invest/recommend", json={
            "risk_bucket": "balanced",
            "monthly_amount": -100,
            "monthly_income": 10000,
            "tenure_years": 5,
        })
        assert r.status_code == 400

    def test_total_invested_and_summary_shape(self, api_client):
        r = api_client.post(f"{API}/invest/recommend", json={
            "risk_bucket": "balanced",
            "monthly_amount": 5000,
            "monthly_income": 30000,
            "tenure_years": 10,
        })
        data = r.json()
        s = data["summary"]
        assert s["total_invested"] == 5000 * 10 * 12
        assert s["tenure_months"] == 120
        assert "final_low" in s and "final_mid" in s and "final_high" in s
        assert s["final_low"] < s["final_mid"] < s["final_high"]
