import { useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// ------------------ SAVINGS POTS ------------------
export function PotsPage() {
  const [pots, setPots] = useState([
    { name: "Diwali gifts", target: 8000, saved: 3200 },
    { name: "Winter clothes", target: 4000, saved: 4000 },
    { name: "Aarti's cycle", target: 3500, saved: 900 },
  ]);
  const add = (i, amt) => setPots(pots.map((p, k) => k === i ? { ...p, saved: Math.min(p.target, p.saved + amt) } : p));
  return (
    <FeatureLayout chapterNum="10" category="Savings & Goals" title="Goal-based savings pots." tagline="A named jar for every intention. Add small amounts; the pots fill quietly.">
      <div className="grid md:grid-cols-2 gap-6" data-testid="pots-list">
        {pots.map((p, i) => {
          const pct = Math.round((p.saved / p.target) * 100);
          return (
            <div key={i} className="preview-panel" style={{ minHeight: 220 }}>
              <div className="w-full">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="font-display text-2xl">{p.name}</div>
                  <div className="eyebrow" style={{ color: pct >= 100 ? "var(--emerald-bright)" : "inherit" }}>{pct}%</div>
                </div>
                <div className="relative h-1 mb-3" style={{ background: "var(--hairline-light)" }}>
                  <div className="absolute h-1" style={{ width: `${pct}%`, background: "var(--emerald-bright)" }} />
                </div>
                <div className="font-mono text-[11px] opacity-70 mb-4">{fmtInr(p.saved)} of {fmtInr(p.target)}</div>
                <div className="flex gap-2">
                  {[100, 500, 1000].map((v) => (
                    <button key={v} onClick={() => add(i, v)} className="pill-btn ghost" style={{ padding: "0.4rem 0.9rem" }} data-testid={`pot-${i}-add-${v}`}>+ ₹{v}</button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureLayout>
  );
}

// ------------------ AUTO-SAVE RULES ------------------
export function AutoSavePage() {
  const [rules, setRules] = useState([
    { key: "roundup", label: "Round every purchase up to nearest ₹10", on: true },
    { key: "payday", label: "Move 10% of income on the 1st of every month", on: true },
    { key: "surplus", label: "Sweep any balance above ₹5,000 on Sunday nights", on: false },
    { key: "streak", label: "Add ₹50 for every 7-day saving streak", on: true },
    { key: "windfall", label: "Save 50% of any incoming amount over ₹5,000", on: false },
  ]);
  return (
    <FeatureLayout chapterNum="10" category="Savings & Goals" title="Auto-save rules." tagline="Turn on the rules that suit your rhythm. Turn them off when the rhythm changes.">
      <div className="grid gap-3" data-testid="autosave-rules">
        {rules.map((r) => (
          <button key={r.key} onClick={() => setRules(rules.map(x => x.key === r.key ? { ...x, on: !x.on } : x))}
            className="text-left border py-4 px-5 transition flex items-baseline gap-4"
            style={{ borderColor: r.on ? "var(--emerald-bright)" : "var(--hairline-light)", background: r.on ? "rgba(47,143,91,0.05)" : "transparent" }}
            data-testid={`autosave-${r.key}`}>
            <div className="w-5 h-5 rounded-full flex-none mt-1" style={{ background: r.on ? "var(--emerald-bright)" : "transparent", border: "1px solid " + (r.on ? "var(--emerald-bright)" : "var(--hairline-light)") }} />
            <span className="font-display text-lg flex-1">{r.label}</span>
            <span className="font-mono text-[10px] opacity-60">{r.on ? "ON" : "OFF"}</span>
          </button>
        ))}
      </div>
    </FeatureLayout>
  );
}

// ------------------ SAVING STREAKS ------------------
export function StreaksPage() {
  const days = Array.from({ length: 30 }, (_, i) => i);
  const [saved, setSaved] = useState(new Set(days.filter(d => d < 21)));
  const streak = 21;
  return (
    <FeatureLayout chapterNum="10" category="Savings & Goals" title="Saving streaks." tagline="A day, a day, a day. Small enough to keep, big enough to matter.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">Current streak</div>
            <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "var(--emerald-bright)" }} data-testid="streak-days">{streak}</div>
            <div className="eyebrow mb-8">days</div>
            <p className="font-body opacity-80">Adding at least ₹10 to any pot counts as a saving day. Missing a day resets the streak — but a fresh streak begins the next morning.</p>
          </div>
        }
        right={
          <FigPanel caption="Fig. 10a — Last 30 days">
            <div className="grid grid-cols-10 gap-2 w-full" data-testid="streak-grid">
              {days.map((d) => {
                const on = saved.has(d);
                return (
                  <button key={d} onClick={() => { const s = new Set(saved); on ? s.delete(d) : s.add(d); setSaved(s); }}
                    className="aspect-square" style={{ background: on ? "var(--emerald-bright)" : "var(--hairline-light)" }} data-testid={`streak-day-${d}`} />
                );
              })}
            </div>
            <div className="font-mono text-[11px] opacity-60 mt-4">{saved.size} of 30 days saved</div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}
