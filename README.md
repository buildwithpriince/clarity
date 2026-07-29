# Clarity — Credit-likelihood & micro-investment prototype

Editorial fintech prototype for financially underserved (Tier-2/3 Indian) users. Real behavioral credit-likelihood scoring + real SIP compound-growth projections, wrapped in a chapter-driven editorial UI.

## Stack

- **Frontend**: React 19 (CRA + craco), Tailwind CSS, Fraunces / IBM Plex Mono / Inter, recharts, framer-motion, shadcn/ui primitives.
- **Backend**: FastAPI, MongoDB (Motor), pydantic v2.

## Environment layout (Emergent platform)

This repository runs inside a supervisor-managed container. Do not run your own servers.

- Backend lives at `/app/backend/server.py`, bound to `0.0.0.0:8001`.
- All backend routes are prefixed with `/api` and reverse-proxied by the platform ingress.
- Frontend reads `REACT_APP_BACKEND_URL` from `frontend/.env`.

### Running locally (outside the platform)

Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

Frontend:
```bash
cd frontend
yarn install
yarn start
```

The original spec called for `uvicorn app.main:app --port 8000` and `npm`. On this platform the equivalent is `uvicorn server:app --port 8001` (routed through the `/api` ingress prefix) and `yarn` (npm is not permitted here).

## API

Base URL: `${REACT_APP_BACKEND_URL}/api`

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET  | `/factors` | Returns the 8 credit factors + option catalog (single source of truth for the questionnaire). |
| POST | `/score/from-answers` | `{ answers: { factor_key: option_value } }` → `{ score, bucket, top_factors, improvement_tips, decision_path, data_completeness }`. |
| POST | `/invest/recommend` | `{ risk_bucket \| (temperament, drop_reaction, primary_goal), monthly_amount, monthly_income, tenure_years }` → allocation, per-month projection arrays for low/mid/high scenarios, summary. |
| GET  | `/profiles` | Six composite sample user profiles (Chapter 02). |

### Scoring math

Interpretable weighted-factor model. Each factor `f` has a fixed weight and each answer maps to a normalized `0..1`. Score = `300 + 600 × Σ(weight · normalized) / Σ(weight)`, clamped and rounded. Missing factors renormalize the weights and lower the reported `confidence`.

Buckets: `EXCELLENT ≥ 780`, `STRONG ≥ 700`, `FAIR ≥ 620`, `EMERGING ≥ 540`, `THIN` otherwise.

### SIP math

Standard future-value of a monthly SIP:

```
FV = P × (((1 + r)^n − 1) / r) × (1 + r)
```

with `P = monthly_amount`, `r = annual_rate / 12`, `n = tenure_years × 12`. Three scenarios per risk bucket (low / mid / high). Endpoint returns the **full month-by-month array** so the chart can be scrubbed.

Return-rate scenarios:

| bucket        | low  | mid  | high |
| ------------- | ---- | ---- | ---- |
| conservative  | 6%   | 8%   | 10%  |
| balanced      | 8%   | 11%  | 14%  |
| growth        | 10%  | 14%  | 18%  |

## Standout product features

- **What-if score simulator** — post-reveal sliders re-hit `/score/from-answers` on drag with the merged answer set.
- **Explainability toggle** — Scorecard (weighted-factor bars) ↔ Decision-path (branch narrative) view.
- **Data completeness indicator** — "Based on X of 8 signals — high/medium/low confidence".
- **Month-by-month projection inspector** — hover the growth chart to inspect FV at any month.

## Responsible-AI posture

- Interpretable-by-design model, no black-box components.
- No protected-class or discriminatory attributes used.
- Synthetic data only in this prototype.
- Intent to align with India's DPDP Act 2023 in a production build.
- Calm financial disclaimer — not a bureau, not regulated advice.

URL : https://clarity-orcin-ten.vercel.app
