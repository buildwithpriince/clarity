import { useState, useMemo } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// ------------------ MICRO-LOAN ELIGIBILITY ------------------
export function MicroLoanPage() {
  const [income, setIncome] = useState(15000);
  const [score, setScore] = useState(662);
  const [tenure, setTenure] = useState(6);
  const maxLoan = Math.min(50000, income * 3 * (score / 900));
  const rate = score >= 720 ? 15 : score >= 640 ? 20 : 26;
  const r = rate / 100 / 12;
  const emi = Math.round((maxLoan * r * (1 + r) ** tenure) / ((1 + r) ** tenure - 1));
  return (
    <FeatureLayout chapterNum="11" category="Lending & Credit Products" title="Micro-loan eligibility." tagline="Small, short-term loans — for tools, seeds, textbooks. What you might qualify for today.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">Monthly income</div>
            <div className="flex items-baseline gap-2 mb-6"><span className="font-display text-3xl opacity-60">₹</span><input type="text" inputMode="numeric" pattern="[0-9]*" value={income === 0 ? "" : income} onChange={(e) => setIncome(Number(e.target.value.replace(/\D/g, "")) || 0)} className="editorial-input" data-testid="micro-income" /></div>
            <div className="eyebrow opacity-60 mb-2">Your Clarity score</div>
            <input type="range" min={300} max={900} value={score} onChange={(e) => setScore(+e.target.value)} className="w-full mb-2" data-testid="micro-score" />
            <div className="font-mono text-[11px] opacity-70 mb-6">{score} / 900</div>
            <div className="eyebrow opacity-60 mb-2">Tenure</div>
            <div className="flex items-baseline gap-2"><input type="text" inputMode="numeric" pattern="[0-9]*" value={tenure === 0 ? "" : tenure} onChange={(e) => setTenure(Math.min(24, Number(e.target.value.replace(/\D/g, "")) || 0))} className="editorial-input" data-testid="micro-tenure" /><span className="font-display text-xl opacity-60">months</span></div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 11b — Offer">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Up to</div>
              <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="micro-max">{fmtInr(maxLoan)}</div>
              <div className="eyebrow opacity-60 mb-8">at {rate}% per annum · {tenure} months</div>
              <div className="border-t pt-6 space-y-3" style={{ borderColor: "var(--hairline-light)" }}>
                <div className="flex justify-between"><span className="font-mono text-[11px] opacity-70">Monthly EMI</span><span className="font-display text-lg">{fmtInr(emi)}</span></div>
                <div className="flex justify-between"><span className="font-mono text-[11px] opacity-70">Total repayable</span><span className="font-display text-lg">{fmtInr(emi * tenure)}</span></div>
                <div className="flex justify-between"><span className="font-mono text-[11px] opacity-70">Interest cost</span><span className="font-display text-lg">{fmtInr(emi * tenure - maxLoan)}</span></div>
              </div>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ REPAYMENT TRACKER ------------------
export function RepaymentTrackerPage() {
  const schedule = useMemo(() => {
    const p = 40000, y = 18, n = 12;
    const r = y / 100 / 12;
    const emi = (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    let bal = p;
    return Array.from({ length: n }, (_, i) => {
      const ip = bal * r;
      const pp = emi - ip;
      bal -= pp;
      return { month: i + 1, emi: Math.round(emi), principal: Math.round(pp), interest: Math.round(ip), balance: Math.max(0, Math.round(bal)) };
    });
  }, []);
  const [paidUpTo, setPaidUpTo] = useState(4);
  return (
    <FeatureLayout chapterNum="11" category="Lending & Credit Products" title="Repayment tracker." tagline="A ₹40,000 loan at 18%, over 12 months. Watch the balance shrink, month by month.">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="eyebrow opacity-60">Paid up to month</span>
        <input type="range" min={0} max={schedule.length} value={paidUpTo} onChange={(e) => setPaidUpTo(+e.target.value)} className="flex-1" data-testid="repay-slider" />
        <span className="font-display text-xl">{paidUpTo} / {schedule.length}</span>
      </div>
      <div className="grid grid-cols-12 border-b py-2 font-mono text-[10px] opacity-60" style={{ borderColor: "var(--hairline-light)" }}>
        <span className="col-span-1">Mo</span><span className="col-span-2 text-right">EMI</span><span className="col-span-3 text-right">Principal</span><span className="col-span-3 text-right">Interest</span><span className="col-span-3 text-right">Balance</span>
      </div>
      {schedule.map((r) => {
        const done = r.month <= paidUpTo;
        return (
          <div key={r.month} className="grid grid-cols-12 border-b py-2 items-baseline" style={{ borderColor: "var(--hairline-light)", opacity: done ? 0.5 : 1 }}>
            <span className="col-span-1 font-mono text-[11px]">{r.month}</span>
            <span className="col-span-2 text-right font-display text-base">{fmtInr(r.emi)}</span>
            <span className="col-span-3 text-right font-mono text-[11px]">{fmtInr(r.principal)}</span>
            <span className="col-span-3 text-right font-mono text-[11px]">{fmtInr(r.interest)}</span>
            <span className="col-span-3 text-right font-display text-base" style={{ color: done ? "inherit" : "var(--emerald-bright)" }}>{fmtInr(r.balance)}</span>
          </div>
        );
      })}
    </FeatureLayout>
  );
}
