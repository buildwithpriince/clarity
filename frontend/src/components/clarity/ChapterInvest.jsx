import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import RupeeNote from "./RupeeNote";
import { useClarity, useLocalStorage, clearLocalStorage } from "@/state/ClarityContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const QUESTIONS = [
  {
    key: "temperament", type: "choice",
    q: "When you think of investing, what feels right?",
    options: [
      { v: "safe", l: "Keep it safe" },
      { v: "measured", l: "A measured mix" },
      { v: "swings", l: "I'll accept swings for higher returns" },
    ],
  },
  { key: "monthly_amount", type: "number", q: "How much can you invest each month?", prefix: "₹", min: 100, placeholder: "e.g. 2500" },
  { key: "monthly_income", type: "number", q: "What's your monthly income, roughly?", prefix: "₹", min: 0, placeholder: "e.g. 25000", note: "For context only. Never shown or used punitively." },
  { key: "tenure_years", type: "number", q: "How many years do you want to stay invested?", suffix: "years", min: 1, max: 30, placeholder: "e.g. 10" },
  {
    key: "drop_reaction", type: "choice",
    q: "If your investment fell 10% overnight, what would you do?",
    options: [
      { v: "sell", l: "Sell — protect what's left" },
      { v: "hold", l: "Hold and wait it out" },
      { v: "buy_more", l: "Buy more at the lower price" },
    ],
  },
  {
    key: "primary_goal", type: "choice",
    q: "What's the primary goal of investing?",
    options: [
      { v: "safety", l: "Safety and preservation" },
      { v: "specific", l: "A specific goal (education, home, wedding)" },
      { v: "growth", l: "Long-term growth" },
    ],
  },
];

export default function ChapterInvest() {
  const { investResult, setInvestResult, setInvestAnswers } = useClarity();
  const [answers, setAnswers] = useLocalStorage("clarity_investment_assessment_progress_answers", {});
  const [current, setCurrent] = useLocalStorage("clarity_investment_assessment_progress_current", 0);
  const [plan, setPlan] = useState(() => investResult);
  const [hoverMonth, setHoverMonth] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setPlan(investResult); }, [investResult]);

  const q = QUESTIONS[current];
  const done = Object.keys(answers).length >= QUESTIONS.length;

  const submit = async (finalAnswers) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/invest/recommend`, {
        temperament: finalAnswers.temperament,
        drop_reaction: finalAnswers.drop_reaction,
        primary_goal: finalAnswers.primary_goal,
        monthly_amount: Number(finalAnswers.monthly_amount),
        monthly_income: Number(finalAnswers.monthly_income),
        tenure_years: Number(finalAnswers.tenure_years),
      });
      setPlan(data);
      setInvestResult(data);
      setInvestAnswers(finalAnswers);
      clearLocalStorage("clarity_investment_assessment_progress_answers");
      clearLocalStorage("clarity_investment_assessment_progress_current");
    } finally {
      setLoading(false);
    }
  };

  const proceed = (value) => {
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    if (current + 1 < QUESTIONS.length) setCurrent(current + 1);
    else submit(next);
  };

  const [tempNum, setTempNum] = useState("");
  useEffect(() => setTempNum(""), [current]);

  const chartData = useMemo(() => {
    if (!plan) return [];
    const lows = plan.projections.low;
    const mids = plan.projections.mid;
    const highs = plan.projections.high;
    // Sample by month for smoothness (all months, recharts can handle 120-360 points)
    return lows.map((row, i) => ({
      month: row.month,
      year: row.year,
      invested: row.invested,
      low: row.value,
      mid: mids[i].value,
      high: highs[i].value,
    }));
  }, [plan]);

  const activeMonth = hoverMonth ?? (chartData.length ? chartData[chartData.length - 1] : null);

  const reset = () => {
    setAnswers({}); setCurrent(0); setPlan(null); setHoverMonth(null);
    setInvestResult(null); setInvestAnswers(null);
    clearLocalStorage("clarity_investment_assessment_progress_answers");
    clearLocalStorage("clarity_investment_assessment_progress_current");
  };

  const fmtInr = (n) => "₹" + Math.round(n).toLocaleString('en-IN');

  return (
    <section id="invest" className="dark-section" data-testid="chapter-invest">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="chapter-marker reveal">
          <span className="num">Chapter 03</span>
          <span className="desc" style={{color: 'var(--bone)'}}>— The Compass</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          {/* LEFT — questions / plan summary */}
          <div className="md:col-span-6 reveal delay-1">
            <h2 className="font-display leading-none mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              A plan you can <span className="italic-emerald">hold</span>.
            </h2>

            {!plan ? (
              <div data-testid="invest-question-card">
                <div className="flex items-baseline justify-between mb-6">
                  <span className="eyebrow">Question {String(current + 1).padStart(2, '0')} / {QUESTIONS.length}</span>
                  <button className="nav-link" disabled={current === 0} onClick={() => setCurrent(current - 1)} data-testid="inv-back">
                    ← Back
                  </button>
                </div>
                <h3 className="font-display text-3xl md:text-4xl leading-tight mb-8">{q.q}</h3>

                {q.type === "choice" && (
                  <div className="grid gap-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => proceed(opt.v)}
                        className="text-left border py-4 px-5 transition hover:bg-[rgba(247,243,233,0.06)] group"
                        style={{ borderColor: 'var(--hairline-dark)' }}
                        data-testid={`inv-opt-${q.key}-${opt.v}`}
                      >
                        <span className="font-display text-xl">{opt.l}</span>
                        <span className="float-right opacity-40 group-hover:opacity-100 transition" style={{color: 'var(--emerald-bright)'}}>→</span>
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "number" && (
                  <div>
                    <div className="flex items-baseline gap-3">
                      {q.prefix && <span className="font-display text-4xl opacity-60">{q.prefix}</span>}
                      <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={tempNum}
                      onChange={(e) => setTempNum(e.target.value.replace(/\D/g, ""))}
                      placeholder={q.placeholder}
                      className="editorial-input"
                      data-testid={`inv-input-${q.key}`}
                      autoFocus
                      />
                      {q.suffix && <span className="font-display text-2xl opacity-60">{q.suffix}</span>}
                    </div>
                    {q.note && <p className="font-mono text-[11px] opacity-60 mt-3">{q.note}</p>}
                    <button
                      className="pill-btn mt-8"
                      onClick={() => tempNum && proceed(tempNum)}
                      disabled={!tempNum}
                      data-testid={`inv-next-${q.key}`}
                    >
                      Continue →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <PlanSummary plan={plan} activeMonth={activeMonth} fmt={fmtInr} onReset={reset} />
            )}
          </div>

          {/* RIGHT — awaiting inputs OR growth chart */}
          <div className="md:col-span-6 reveal delay-2">
            <div className="fig-caption mb-4">
              Fig. 02 — {plan ? `${plan.summary.tenure_years}-Year Projection` : 'Ten-Year Projection'}
            </div>

            <div className="preview-panel" style={{ borderColor: 'var(--hairline-dark)', minHeight: 560 }}>
              {!plan ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <RupeeNote />
                  <div className="eyebrow opacity-60 mt-8">Awaiting inputs</div>
                  <div className="font-mono text-[11px] opacity-40 mt-2">{Object.keys(answers).length} / {QUESTIONS.length} answered</div>
                </div>
              ) : (
                <div className="w-full flex-1 flex flex-col">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="eyebrow" style={{color: 'var(--emerald-bright)'}}>
                      {plan.risk_bucket} bucket
                    </span>
                    <span className="font-mono text-[10px] opacity-60">
                      {plan.rates.low}% · {plan.rates.mid}% · {plan.rates.high}% annual
                    </span>
                  </div>
                  <div className="font-display leading-none mb-1" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'var(--emerald-bright)' }} data-testid="plan-final-mid">
                    {fmtInr(activeMonth?.mid ?? plan.summary.final_mid)}
                  </div>
                  <div className="font-mono text-[11px] opacity-60 mb-4">
                    projected at month {activeMonth?.month ?? plan.summary.tenure_months} · mid scenario
                  </div>

                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        onMouseMove={(state) => {
                          if (state && state.activePayload && state.activePayload[0]) {
                            setHoverMonth(state.activePayload[0].payload);
                          }
                        }}
                        onMouseLeave={() => setHoverMonth(null)}
                      >
                        <CartesianGrid stroke="rgba(247,243,233,0.08)" vertical={false} />
                        <XAxis
                          dataKey="year"
                          type="number"
                          domain={[0, plan.summary.tenure_years]}
                          ticks={Array.from({length: plan.summary.tenure_years + 1}, (_, k) => k)}
                          stroke="rgba(247,243,233,0.4)"
                          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10 }}
                        />
                        <YAxis
                          stroke="rgba(247,243,233,0.4)"
                          tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10 }}
                          tickFormatter={(v) => v >= 100000 ? `${(v/100000).toFixed(1)}L` : `${(v/1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#0F1712',
                            border: '1px solid rgba(247,243,233,0.25)',
                            fontFamily: 'IBM Plex Mono',
                            fontSize: 11,
                            color: '#F7F3E9',
                          }}
                          labelFormatter={(v) => `Year ${v}`}
                          formatter={(v, name) => [fmtInr(v), name]}
                        />
                        <Line type="monotone" dataKey="low" stroke="rgba(47,143,91,0.35)" dot={false} strokeWidth={1.2} name="Low" />
                        <Line type="monotone" dataKey="mid" stroke="#2F8F5B" dot={false} strokeWidth={2} name="Mid" />
                        <Line type="monotone" dataKey="high" stroke="rgba(47,143,91,0.7)" dot={false} strokeWidth={1.2} strokeDasharray="4 4" name="High" />
                        <Line type="monotone" dataKey="invested" stroke="rgba(247,243,233,0.3)" dot={false} strokeWidth={1} name="Invested" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4" style={{ borderColor: 'var(--hairline-dark)' }}>
                    <Stat label="Low" val={fmtInr(activeMonth?.low ?? plan.summary.final_low)} />
                    <Stat label="Mid" val={fmtInr(activeMonth?.mid ?? plan.summary.final_mid)} highlight />
                    <Stat label="High" val={fmtInr(activeMonth?.high ?? plan.summary.final_high)} />
                  </div>
                  <div className="font-mono text-[10px] opacity-50 mt-3">
                    Hover the chart to inspect any month · Invested: {fmtInr(activeMonth?.invested ?? plan.summary.total_invested)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, val, highlight }) {
  return (
    <div>
      <div className="eyebrow opacity-60 mb-1">{label}</div>
      <div className="font-display text-2xl" style={{ color: highlight ? 'var(--emerald-bright)' : 'inherit' }}>{val}</div>
    </div>
  );
}

function PlanSummary({ plan, activeMonth, fmt, onReset }) {
  return (
    <div data-testid="plan-summary">
      <div className="mb-6">
        <div className="eyebrow opacity-70 mb-2">Allocation</div>
        {Object.entries(plan.allocation).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-4 py-2">
            <div className="w-40 font-mono text-[11px] opacity-80">{k}</div>
            <div className="flex-1 h-[3px] relative" style={{ background: 'var(--hairline-dark)' }}>
              <div className="absolute h-[3px]" style={{ width: `${v}%`, background: 'var(--emerald-bright)' }} />
            </div>
            <div className="font-mono text-[11px] opacity-90 w-10 text-right">{v}%</div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--hairline-dark)' }}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="eyebrow opacity-60 mb-1">Invest / month</div>
            <div className="font-display text-2xl">{fmt(plan.summary.monthly_amount)}</div>
          </div>
          <div>
            <div className="eyebrow opacity-60 mb-1">Over</div>
            <div className="font-display text-2xl">{plan.summary.tenure_years} yrs</div>
          </div>
          <div>
            <div className="eyebrow opacity-60 mb-1">Total invested</div>
            <div className="font-display text-2xl">{fmt(plan.summary.total_invested)}</div>
          </div>
          <div>
            <div className="eyebrow opacity-60 mb-1">Projected (mid)</div>
            <div className="font-display text-2xl" style={{color: 'var(--emerald-bright)'}}>{fmt(plan.summary.final_mid)}</div>
          </div>
        </div>
        {plan.surplus_note && (
          <p className="font-mono text-[11px] opacity-70 mt-6" data-testid="surplus-note">
            {plan.surplus_note}
          </p>
        )}
      </div>

      <button className="nav-link mt-8" onClick={onReset} data-testid="invest-reset">↻ Recalculate</button>
    </div>
  );
}
