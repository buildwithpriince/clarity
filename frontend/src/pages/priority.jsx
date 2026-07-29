import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { Slider } from "@/components/ui/slider";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar,
} from "recharts";
import { useClarity } from "@/state/ClarityContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEFAULT_ANSWERS = {
  utility_payments: "mostly",
  mobile_recharges: "on_expiry",
  upi_frequency: "few_weekly",
  rent_payments: "mostly",
  savings_habit: "most_months",
  income_stability: "mostly_stable",
  debt_burden: "under_20",
  digital_footprint: "2_to_5",
};

const FACTOR_LABELS = {
  utility_payments: "Utility bills on time",
  mobile_recharges: "Mobile recharge consistency",
  upi_frequency: "UPI activity",
  rent_payments: "Rent / EMI punctuality",
  savings_habit: "Monthly savings habit",
  income_stability: "Income stability",
  debt_burden: "Debt-to-income",
  digital_footprint: "Digital payment tenure",
};

const OPTIONS = {
  utility_payments: ["rarely", "sometimes", "mostly", "always"],
  mobile_recharges: ["irregular", "when_needed", "on_expiry", "scheduled"],
  upi_frequency: ["rarely", "weekly", "few_weekly", "daily"],
  rent_payments: ["often_late", "sometimes_late", "mostly", "always"],
  savings_habit: ["rarely", "sometimes", "most_months", "every_month"],
  income_stability: ["irregular", "variable", "mostly_stable", "very_stable"],
  debt_burden: ["over_40", "20_to_40", "under_20", "none"],
  digital_footprint: ["under_1", "1_to_2", "2_to_5", "5_plus"],
};

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// ============================================================
// 1. SCORE FACTOR BREAKDOWN — /credit/factors
// ============================================================
export function ScoreFactorBreakdownPage() {
  const { creditResult, creditAnswers } = useClarity();
  const isPersonal = !!creditResult;
  const [result, setResult] = useState(creditResult);
  useEffect(() => {
    if (creditResult) { setResult(creditResult); return; }
    axios.post(`${API}/score/from-answers`, { answers: DEFAULT_ANSWERS })
      .then((r) => setResult(r.data));
  }, [creditResult]);
  return (
    <FeatureLayout
      chapterNum="07"
      category="Credit & Scoring"
      title="Score factor breakdown."
      tagline={isPersonal
        ? "Your score, unpacked. The weight of each signal and how much it lifted or lowered the number."
        : "A sample profile, for reference. Complete the Chapter 01 assessment to see your own factors here."}
    >
      <TwoCol
        left={
          <div data-testid="factor-list">
            {result ? (
              <>
                <div className="eyebrow opacity-60 mb-4">
                  {isPersonal ? "Your factors, ordered by strength" : "Sample factors — synthetic profile"}
                </div>
                {result.top_factors.map((f, i) => (
                  <div key={i} className="mb-5">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-display text-lg">{f.label}</span>
                      <span className="font-mono text-[10px] opacity-60">weight {f.weight_pct}%</span>
                    </div>
                    <div className="relative h-[3px]" style={{ background: "var(--hairline-light)" }}>
                      <div className="absolute h-[3px]" style={{ width: `${f.strength}%`, background: "var(--emerald-bright)" }} />
                    </div>
                    <div className="font-mono text-[10px] opacity-60 mt-1">strength {f.strength} / 100</div>
                  </div>
                ))}
              </>
            ) : (
              <div className="eyebrow opacity-50">Loading…</div>
            )}
          </div>
        }
        right={
          <FigPanel caption={isPersonal ? "Fig. 07a — Your score" : "Fig. 07a — Sample profile score"}>
            {result && (
              <div>
                <div className="eyebrow opacity-60 mb-2">
                  {isPersonal ? "Your score" : "Sample score"}
                </div>
                <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "var(--emerald-bright)" }} data-testid="factor-score">
                  {result.score}
                </div>
                <div className="eyebrow mb-6">{result.bucket}</div>
                {isPersonal && result.data_completeness && (
                  <div className="font-mono text-[11px] opacity-70 mb-6">
                    Based on {result.data_completeness.answered} of {result.data_completeness.total} signals — {result.data_completeness.confidence} confidence
                  </div>
                )}
                <div className="mt-8">
                  <div className="eyebrow opacity-60 mb-3">Improvement paths</div>
                  {result.improvement_tips.slice(0, 3).map((t, i) => (
                    <div key={i} className="mb-3">
                      <div className="font-display text-base">{t.label}</div>
                      <div className="font-body text-sm opacity-80">{t.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ============================================================
// 2. WHAT-IF SIMULATOR — /credit/whatif-simulator
// ============================================================
export function WhatIfSimulatorPage() {
  const { creditAnswers } = useClarity();
  const isPersonal = !!creditAnswers;
  const initial = creditAnswers || DEFAULT_ANSWERS;
  const [answers, setAnswers] = useState(initial);
  const [baseline, setBaseline] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const base = creditAnswers || DEFAULT_ANSWERS;
    setAnswers(base);
    axios.post(`${API}/score/from-answers`, { answers: base })
      .then((r) => { setBaseline(r.data); setResult(r.data); });
  }, [creditAnswers]);

  useEffect(() => {
    const t = setTimeout(() => {
      axios.post(`${API}/score/from-answers`, { answers }).then((r) => setResult(r.data));
    }, 180);
    return () => clearTimeout(t);
  }, [answers]);

  const delta = result && baseline ? result.score - baseline.score : 0;

  return (
    <FeatureLayout
      chapterNum="07"
      category="Credit & Scoring"
      title="What if..."
      tagline="Drag any signal. Watch the score respond in real time. The math is the same interpretable engine — no invented numbers."
    >
      <TwoCol
        left={
          <div data-testid="whatif-controls">
            {Object.keys(OPTIONS).map((k) => {
              const idx = OPTIONS[k].indexOf(answers[k]);
              return (
                <div key={k} className="mb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-mono text-[11px]">{FACTOR_LABELS[k]}</span>
                    <span className="font-mono text-[10px] opacity-60">{answers[k].replace(/_/g, " ")}</span>
                  </div>
                  <Slider
                    value={[idx]}
                    min={0}
                    max={OPTIONS[k].length - 1}
                    step={1}
                    onValueChange={([v]) => setAnswers((a) => ({ ...a, [k]: OPTIONS[k][v] }))}
                    data-testid={`whatif-slider-${k}`}
                  />
                </div>
              );
            })}
          </div>
        }
        right={
          <FigPanel caption="Fig. 07b — Live score">
            {result && (
              <div>
                <div className="eyebrow opacity-60 mb-2">Score</div>
                <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "var(--emerald-bright)" }} data-testid="whatif-score">
                  {result.score}
                </div>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="eyebrow">{result.bucket}</span>
                  <span className="font-mono text-[11px] opacity-70" data-testid="whatif-delta">
                    {delta === 0 ? "baseline" : `${delta > 0 ? "+" : ""}${delta} vs baseline`}
                  </span>
                </div>
                <div className="relative h-1 mb-8" style={{ background: "var(--hairline-light)" }}>
                  <div className="absolute h-1" style={{ width: `${(result.score - 300) / 6}%`, background: "var(--emerald-bright)" }} />
                </div>
                <div className="eyebrow opacity-60 mb-3">Baseline</div>
                <div className="font-mono text-[11px] opacity-80">
                  {baseline?.score} · {baseline?.bucket}
                </div>
              </div>
            )}
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ============================================================
// 3. SIP CALCULATOR — /investments/sip-calculator
// ============================================================
export function SIPCalculatorPage() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const arr = [];
    for (let m = 1; m <= n; m++) {
      const fv = r === 0 ? monthly * m : monthly * (((1 + r) ** m - 1) / r) * (1 + r);
      arr.push({ month: m, year: +(m / 12).toFixed(2), invested: monthly * m, value: Math.round(fv) });
    }
    return arr;
  }, [monthly, rate, years]);

  const final = data[data.length - 1] || { invested: 0, value: 0 };

  return (
    <FeatureLayout
      chapterNum="08"
      category="Investments"
      title="SIP calculator."
      tagline="Systematic investment — one amount, one rate, one horizon. See exactly what it grows to."
    >
      <TwoCol
        left={
          <div>
            <NumberField label="Monthly amount" prefix="₹" value={monthly} onChange={setMonthly} testid="sip-monthly" />
            <NumberField label="Expected annual return" suffix="%" value={rate} onChange={setRate} testid="sip-rate" step={0.5} />
            <NumberField label="Tenure" suffix="years" value={years} onChange={setYears} testid="sip-years" min={1} max={40} />

            <div className="mt-10 pt-6 border-t grid grid-cols-3 gap-4" style={{ borderColor: "var(--hairline-light)" }}>
              <Stat label="Invested" value={fmtInr(final.invested)} testid="sip-invested" />
              <Stat label="Projected" value={fmtInr(final.value)} highlight testid="sip-final" />
              <Stat label="Gains" value={fmtInr(final.value - final.invested)} testid="sip-gains" />
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 08a — Growth over time" minHeight={460}>
            <div style={{ height: 380, width: "100%" }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid stroke="rgba(27,38,32,0.08)" vertical={false} />
                  <XAxis dataKey="year" type="number" domain={[0, years]} ticks={Array.from({ length: years + 1 }, (_, i) => i)} tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <YAxis tickFormatter={(v) => (v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${(v / 1000).toFixed(0)}k`)} tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} formatter={(v) => fmtInr(v)} labelFormatter={(v) => `Year ${v}`} />
                  <Line type="monotone" dataKey="value" stroke="#2F8F5B" strokeWidth={2} dot={false} name="Value" />
                  <Line type="monotone" dataKey="invested" stroke="rgba(27,38,32,0.35)" strokeWidth={1} dot={false} name="Invested" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ============================================================
// 4. EMI CALCULATOR — /lending/emi-calculator
// ============================================================
export function EMICalculatorPage() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(11);
  const [months, setMonths] = useState(36);

  const { emi, total, interest, schedule } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = months;
    const emi = r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    let balance = principal;
    const schedule = [];
    for (let m = 1; m <= n; m++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance -= principalPart;
      schedule.push({
        month: m,
        principal: Math.round(principalPart),
        interest: Math.round(interestPart),
        balance: Math.max(0, Math.round(balance)),
      });
    }
    return { emi: Math.round(emi), total: Math.round(emi * n), interest: Math.round(emi * n - principal), schedule };
  }, [principal, rate, months]);

  const yearlyData = useMemo(() => {
    const groups = {};
    schedule.forEach((r) => {
      const y = Math.ceil(r.month / 12);
      if (!groups[y]) groups[y] = { year: y, principal: 0, interest: 0 };
      groups[y].principal += r.principal;
      groups[y].interest += r.interest;
    });
    return Object.values(groups);
  }, [schedule]);

  return (
    <FeatureLayout
      chapterNum="11"
      category="Lending & Credit Products"
      title="EMI calculator."
      tagline="Loan amount, rate, tenure — the monthly obligation, laid out honestly, month by month."
    >
      <TwoCol
        left={
          <div>
            <NumberField label="Loan amount" prefix="₹" value={principal} onChange={setPrincipal} testid="emi-principal" />
            <NumberField label="Interest rate" suffix="%" value={rate} onChange={setRate} testid="emi-rate" step={0.25} />
            <NumberField label="Tenure" suffix="months" value={months} onChange={setMonths} testid="emi-months" min={3} max={360} />

            <div className="mt-10 pt-6 border-t grid grid-cols-3 gap-4" style={{ borderColor: "var(--hairline-light)" }}>
              <Stat label="Monthly EMI" value={fmtInr(emi)} highlight testid="emi-monthly" />
              <Stat label="Total interest" value={fmtInr(interest)} testid="emi-interest" />
              <Stat label="Total payable" value={fmtInr(total)} testid="emi-total" />
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 11a — Principal vs interest, per year" minHeight={460}>
            <div style={{ height: 380, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={yearlyData}>
                  <CartesianGrid stroke="rgba(27,38,32,0.08)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <YAxis tickFormatter={(v) => (v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${(v / 1000).toFixed(0)}k`)} tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} formatter={(v) => fmtInr(v)} labelFormatter={(v) => `Year ${v}`} />
                  <Bar dataKey="principal" stackId="a" fill="#2F8F5B" />
                  <Bar dataKey="interest" stackId="a" fill="rgba(31,77,61,0.55)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ============================================================
// 5. RISK PROFILING QUIZ — /investments/risk-quiz
// ============================================================
const RISK_Q = [
  { key: "horizon", q: "For how long can you stay invested?", options: [
    { v: 1, l: "Less than 2 years" }, { v: 2, l: "2 to 5 years" }, { v: 3, l: "5 to 10 years" }, { v: 4, l: "More than 10 years" },
  ]},
  { key: "drop", q: "Your portfolio drops 15% in a month. You…", options: [
    { v: 1, l: "Sell immediately" }, { v: 2, l: "Wait and see" }, { v: 3, l: "Hold quietly" }, { v: 4, l: "Buy more at the discount" },
  ]},
  { key: "goal", q: "What matters most?", options: [
    { v: 1, l: "Preserving what I have" }, { v: 2, l: "Steady, modest growth" }, { v: 3, l: "Long-term wealth" }, { v: 4, l: "Maximum growth" },
  ]},
  { key: "income", q: "Your income is…", options: [
    { v: 1, l: "Irregular" }, { v: 2, l: "Variable" }, { v: 3, l: "Mostly stable" }, { v: 4, l: "Very stable" },
  ]},
  { key: "experience", q: "Prior investing experience?", options: [
    { v: 1, l: "None" }, { v: 2, l: "A little" }, { v: 3, l: "Some" }, { v: 4, l: "A lot" },
  ]},
];

export function RiskProfilingQuizPage() {
  const [answers, setAnswers] = useState({});
  const [i, setI] = useState(0);
  const done = Object.keys(answers).length === RISK_Q.length;

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const max = RISK_Q.length * 4;
  const bucket = score <= max * 0.4 ? "Conservative" : score <= max * 0.7 ? "Balanced" : "Growth";

  const select = (v) => {
    const next = { ...answers, [RISK_Q[i].key]: v };
    setAnswers(next);
    if (i + 1 < RISK_Q.length) setI(i + 1);
  };

  return (
    <FeatureLayout
      chapterNum="08"
      category="Investments"
      title="Risk profiling quiz."
      tagline="Five short questions to place your investing temperament — Conservative, Balanced, or Growth."
    >
      <TwoCol
        left={
          !done ? (
            <div data-testid="risk-quiz-card">
              <div className="eyebrow mb-4">Question {String(i + 1).padStart(2, "0")} / {RISK_Q.length}</div>
              <h3 className="font-display text-3xl leading-tight mb-8">{RISK_Q[i].q}</h3>
              <div className="grid gap-3">
                {RISK_Q[i].options.map((o) => (
                  <button key={o.v} onClick={() => select(o.v)} className="text-left border py-4 px-5 hover:bg-[rgba(27,38,32,0.04)] transition"
                    style={{ borderColor: "var(--hairline-light)" }}
                    data-testid={`risk-opt-${RISK_Q[i].key}-${o.v}`}
                  >
                    <span className="font-display text-lg">{o.l}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div data-testid="risk-quiz-result">
              <div className="eyebrow opacity-60 mb-3">Your bucket</div>
              <div className="font-display text-6xl mb-6" style={{ color: "var(--emerald-bright)" }} data-testid="risk-bucket">{bucket}</div>
              <p className="font-body opacity-80 max-w-md mb-6">
                {bucket === "Conservative" && "Debt-heavy allocation, modest equity slice. Steady, seldom surprising."}
                {bucket === "Balanced" && "A measured mix of debt and equity. Reasonable growth, tolerable swings."}
                {bucket === "Growth" && "Equity-weighted portfolio. Higher expected return, and higher expected turbulence."}
              </p>
              <button className="pill-btn" onClick={() => { setAnswers({}); setI(0); }} data-testid="risk-retake">↻ Retake</button>
            </div>
          )
        }
        right={
          <FigPanel caption="Fig. 08b — Score buildup">
            <div className="space-y-3">
              {RISK_Q.map((q) => (
                <div key={q.key} className="flex items-baseline justify-between border-b py-2" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-mono text-[11px] opacity-70">{q.q}</span>
                  <span className="font-display text-lg">{answers[q.key] ? `+${answers[q.key]}` : "—"}</span>
                </div>
              ))}
              <div className="flex items-baseline justify-between pt-3">
                <span className="eyebrow">Total</span>
                <span className="font-display text-4xl" style={{ color: "var(--emerald-bright)" }}>{score} / {max}</span>
              </div>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ============================================================
// 6. EXPLAINABILITY PANEL — /trust/explainability
// ============================================================
export function ExplainabilityPanelPage() {
  const { creditResult, creditAnswers } = useClarity();
  const isPersonal = !!creditResult;
  const [result, setResult] = useState(creditResult);
  useEffect(() => {
    if (creditResult) { setResult(creditResult); return; }
    axios.post(`${API}/score/from-answers`, { answers: DEFAULT_ANSWERS }).then((r) => setResult(r.data));
  }, [creditResult]);
  return (
    <FeatureLayout
      chapterNum="14"
      category="Trust & Transparency"
      title="Explainability."
      tagline="Every score has a paper trail. Here it is — the model, the reasons, the branches."
    >
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-5">
          <div className="eyebrow opacity-60 mb-3">Model</div>
          <p className="font-body opacity-85 mb-6 leading-relaxed">
            An interpretable weighted-factor system. Eight signals, each with a fixed weight and a scaled 0-100 strength. A weighted average, mapped to the 300-900 range. No neural network, no hidden layers, no opaque decision.
          </p>
          <div className="eyebrow opacity-60 mb-3">What is not used</div>
          <p className="font-body opacity-85 mb-6 leading-relaxed">
            Caste, religion, gender, region of origin. No protected-class attributes, no proxies. The model reads behavior, not identity.
          </p>
          <div className="eyebrow opacity-60 mb-3">Right to explanation</div>
          <p className="font-body opacity-85 leading-relaxed">
            Every score returns with its top factors, its improvement paths, and its decision path. If a signal is missing, the report says so and lowers its own confidence.
          </p>
        </div>
        <div className="md:col-span-7">
          <FigPanel caption={isPersonal ? "Fig. 14a — Your decision path" : "Fig. 14a — Decision path for a sample profile"} minHeight={520}>
            {result && (
              <div className="grid gap-2 w-full" data-testid="decision-path-list">
                {result.decision_path.map((n, i) => (
                  <div key={i} className="flex items-baseline gap-3 py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                    <span className="font-mono text-[10px] opacity-50 w-6">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-base flex-1">{n.question}</span>
                    <span className="font-mono text-[11px]" style={{ color: n.answer === "Yes" ? "var(--emerald-bright)" : "inherit" }}>{n.answer}</span>
                    <span className="font-mono text-[10px] opacity-60 w-32 text-right">{n.effect}</span>
                  </div>
                ))}
              </div>
            )}
          </FigPanel>
        </div>
      </div>
    </FeatureLayout>
  );
}

// Small shared bits
function NumberField({ label, prefix, suffix, value, onChange, testid, min = 0, max, step = 1 }) {
  return (
    <div className="mb-6">
      <div className="eyebrow opacity-60 mb-2">{label}</div>
      <div className="flex items-baseline gap-3">
        {prefix && <span className="font-display text-3xl opacity-60">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            let n = raw === "" ? 0 : Number(raw);
            if (max !== undefined) n = Math.min(n, max);
            onChange(n);
          }}
          className="editorial-input"
          style={{ fontSize: "2.5rem" }}
          data-testid={testid}
        />
        {suffix && <span className="font-display text-2xl opacity-60">{suffix}</span>}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight, testid }) {
  return (
    <div>
      <div className="eyebrow opacity-60 mb-1">{label}</div>
      <div className="font-display text-2xl" style={{ color: highlight ? "var(--emerald-bright)" : "inherit" }} data-testid={testid}>{value}</div>
    </div>
  );
}
