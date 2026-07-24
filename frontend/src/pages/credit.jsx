import { useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// ------------------ SCORE HISTORY ------------------
const HISTORY = [
  { m: "Aug '25", score: 596 },
  { m: "Sep '25", score: 604 },
  { m: "Oct '25", score: 618 },
  { m: "Nov '25", score: 641 },
  { m: "Dec '25", score: 662 },
  { m: "Jan '26", score: 681 },
  { m: "Feb '26", score: 704 },
];

export function ScoreHistoryPage() {
  return (
    <FeatureLayout chapterNum="07" category="Credit & Scoring" title="Score history & trend." tagline="Six months, quietly moving. The bureau file that never existed, now visible.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-3">Latest</div>
            <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "var(--emerald-bright)" }} data-testid="hist-latest">
              {HISTORY[HISTORY.length - 1].score}
            </div>
            <div className="eyebrow mb-8">STRONG · +108 in six months</div>
            <div className="border-t pt-6" style={{ borderColor: "var(--hairline-light)" }}>
              <div className="eyebrow opacity-60 mb-3">Month-by-month</div>
              {HISTORY.map((h, i) => (
                <div key={h.m} className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-mono text-[11px] opacity-70">{h.m}</span>
                  <span className="font-display text-lg">{h.score}</span>
                  <span className="font-mono text-[10px] opacity-50 w-12 text-right">{i === 0 ? "—" : `${h.score - HISTORY[i - 1].score > 0 ? "+" : ""}${h.score - HISTORY[i - 1].score}`}</span>
                </div>
              ))}
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 07c — Trend">
            <div style={{ height: 380, width: "100%" }}>
              <ResponsiveContainer>
                <LineChart data={HISTORY}>
                  <CartesianGrid stroke="rgba(27,38,32,0.08)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <YAxis domain={[300, 900]} tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} />
                  <Line type="monotone" dataKey="score" stroke="#2F8F5B" strokeWidth={2} dot={{ r: 4, fill: "#2F8F5B" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ SCORE ALERTS ------------------
const ALERT_RULES = [
  { key: "any", label: "Any change to my score", detail: "Every up or down movement, however small." },
  { key: "big", label: "Score moves by 20+ points", detail: "Only material shifts, not day-to-day noise." },
  { key: "bucket", label: "Bucket changes", detail: "Emerging → Fair, Fair → Strong, and so on." },
  { key: "weekly", label: "Weekly digest", detail: "A quiet Sunday summary, no alerts in between." },
  { key: "lender", label: "A lender pulls the score", detail: "Notify me when someone requests my report." },
];
export function ScoreAlertsPage() {
  const [rules, setRules] = useState({ big: true, bucket: true });
  return (
    <FeatureLayout chapterNum="07" category="Credit & Scoring" title="Score change alerts." tagline="Choose what warrants a notification. The default is calm — big moves only, weekly summaries.">
      <TwoCol
        left={
          <div className="grid gap-2" data-testid="alerts-list">
            {ALERT_RULES.map((r) => {
              const on = !!rules[r.key];
              return (
                <button key={r.key} onClick={() => setRules({ ...rules, [r.key]: !on })} className="text-left border py-4 px-5 transition flex items-baseline gap-4" style={{ borderColor: on ? "var(--emerald-bright)" : "var(--hairline-light)", background: on ? "rgba(47,143,91,0.05)" : "transparent" }} data-testid={`alert-${r.key}`}>
                  <div className="w-5 h-5 rounded-full border flex-none mt-1" style={{ borderColor: on ? "var(--emerald-bright)" : "var(--hairline-light)", background: on ? "var(--emerald-bright)" : "transparent" }} />
                  <div className="flex-1">
                    <div className="font-display text-lg">{r.label}</div>
                    <div className="font-body text-sm opacity-70">{r.detail}</div>
                  </div>
                </button>
              );
            })}
          </div>
        }
        right={
          <FigPanel caption="Fig. 07d — Delivery channels">
            <div className="w-full space-y-4">
              {[["SMS", "+91 98••• •••23"], ["Email", "you@clarity.in"], ["In-app", "Push notifications"]].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between py-3 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-display text-lg">{k}</span>
                  <span className="font-mono text-[11px] opacity-70">{v}</span>
                </div>
              ))}
              <p className="font-body text-sm opacity-70 mt-6">
                {Object.values(rules).filter(Boolean).length} rule{Object.values(rules).filter(Boolean).length === 1 ? "" : "s"} active.
              </p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ LOAN ELIGIBILITY ------------------
export function LoanEligibilityPage() {
  const [score, setScore] = useState(704);
  const [income, setIncome] = useState(25000);
  const [debt, setDebt] = useState(3000);
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(24);

  const dti = ((debt / income) * 100).toFixed(1);
  const emiFor = (p, y, m) => { const r = y / 100 / 12; return (p * r * (1 + r) ** m) / ((1 + r) ** m - 1); };
  const rate = score >= 750 ? 11 : score >= 680 ? 14 : score >= 620 ? 18 : 24;
  const emi = emiFor(amount, rate, tenure);
  const capacity = (income * 0.4) - debt;
  const eligible = score >= 620 && emi <= capacity;

  return (
    <FeatureLayout chapterNum="07" category="Credit & Scoring" title="Loan eligibility pre-check." tagline="A quiet look before you formally apply. No hit to your record, no commitment.">
      <TwoCol
        left={
          <div>
            <Field label="Your score" value={score} setValue={setScore} min={300} max={900} testid="loan-score" />
            <Field label="Monthly income" prefix="₹" value={income} setValue={setIncome} testid="loan-income" />
            <Field label="Existing monthly debt" prefix="₹" value={debt} setValue={setDebt} testid="loan-debt" />
            <Field label="Loan wanted" prefix="₹" value={amount} setValue={setAmount} testid="loan-amount" />
            <Field label="Tenure" suffix="months" value={tenure} setValue={setTenure} min={3} max={120} testid="loan-tenure" />
          </div>
        }
        right={
          <FigPanel caption="Fig. 07e — Decision">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Provisional</div>
              <div className="font-display leading-none mb-2" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: eligible ? "var(--emerald-bright)" : "inherit" }} data-testid="loan-decision">
                {eligible ? "Eligible." : "Not yet."}
              </div>
              <div className="border-t pt-6 mt-4 space-y-3" style={{ borderColor: "var(--hairline-light)" }}>
                <Row k="Rate offered" v={`${rate}%`} />
                <Row k="Estimated EMI" v={fmtInr(emi)} />
                <Row k="Debt-to-income" v={`${dti}%`} />
                <Row k="Monthly capacity" v={fmtInr(capacity)} />
              </div>
              {!eligible && (
                <p className="font-body text-sm opacity-70 mt-6">
                  {score < 620 ? "Score is below the threshold — improve utility/rent punctuality first." : "EMI would exceed your monthly capacity — try a longer tenure or a smaller amount."}
                </p>
              )}
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

function Field({ label, prefix, suffix, value, setValue, testid, min = 0, max }) {
  return (
    <div className="mb-6">
      <div className="eyebrow opacity-60 mb-2">{label}</div>
      <div className="flex items-baseline gap-3">
        {prefix && <span className="font-display text-2xl opacity-60">{prefix}</span>}
        <input type="number" value={value} min={min} max={max} onChange={(e) => setValue(Number(e.target.value) || 0)} className="editorial-input" style={{ fontSize: "2rem" }} data-testid={testid} />
        {suffix && <span className="font-display text-xl opacity-60">{suffix}</span>}
      </div>
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-[11px] opacity-70">{k}</span>
      <span className="font-display text-lg">{v}</span>
    </div>
  );
}
