import { useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

const POLICIES = [
  { name: "SafeHome Term", cover: 500000, premium: 4200, tenure: 20, notes: "Straight term life, no frills" },
  { name: "SafeHome Term+", cover: 1000000, premium: 8100, tenure: 20, notes: "Term + accident rider" },
  { name: "Sampoorna Plus", cover: 500000, premium: 6300, tenure: 20, notes: "Term + critical illness" },
  { name: "Family Shield", cover: 300000, premium: 2800, tenure: 15, notes: "Family floater health" },
];

export function InsuranceComparePage() {
  const [selected, setSelected] = useState(new Set(["SafeHome Term", "Sampoorna Plus"]));
  return (
    <FeatureLayout chapterNum="12" category="Insurance" title="Policy comparison." tagline="Select up to three policies. Their differences appear beneath, side by side.">
      <div className="grid gap-3 mb-8" data-testid="policies-grid">
        {POLICIES.map((p) => {
          const on = selected.has(p.name);
          return (
            <button key={p.name} onClick={() => { const s = new Set(selected); on ? s.delete(p.name) : s.add(p.name); setSelected(s); }}
              className="text-left border py-4 px-5 flex items-baseline gap-4 transition"
              style={{ borderColor: on ? "var(--emerald-bright)" : "var(--hairline-light)", background: on ? "rgba(47,143,91,0.05)" : "transparent" }}
              data-testid={`policy-${p.name}`}>
              <div className="w-5 h-5 rounded-full flex-none mt-1" style={{ background: on ? "var(--emerald-bright)" : "transparent", border: "1px solid " + (on ? "var(--emerald-bright)" : "var(--hairline-light)") }} />
              <div className="flex-1">
                <div className="font-display text-lg">{p.name}</div>
                <div className="font-mono text-[11px] opacity-70">{p.notes}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg">{fmtInr(p.cover)}</div>
                <div className="font-mono text-[10px] opacity-60">{fmtInr(p.premium)}/yr</div>
              </div>
            </button>
          );
        })}
      </div>
      {selected.size > 0 && (
        <FigPanel caption="Fig. 12a — Comparison" minHeight={280}>
          <table className="w-full font-mono text-[11px]">
            <thead><tr className="border-b" style={{ borderColor: "var(--hairline-light)" }}>
              <th className="text-left py-2 opacity-60">Property</th>
              {[...selected].map((n) => <th key={n} className="text-right py-2 font-display text-base">{n}</th>)}
            </tr></thead>
            <tbody>
              {["cover", "premium", "tenure", "notes"].map((k) => (
                <tr key={k} className="border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <td className="py-3 opacity-70 uppercase">{k}</td>
                  {[...selected].map((n) => {
                    const p = POLICIES.find(x => x.name === n);
                    return <td key={n} className="text-right py-3">{k === "cover" || k === "premium" ? fmtInr(p[k]) : p[k]}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </FigPanel>
      )}
    </FeatureLayout>
  );
}

const CLAIMS = [
  { id: "CL-8821", policy: "Family Shield", stage: 3, amt: 12400, opened: "Jan 12" },
  { id: "CL-9101", policy: "SafeHome Term+", stage: 1, amt: 300000, opened: "Feb 04" },
];
const STAGES = ["Submitted", "Under review", "Documents received", "Approved", "Disbursed"];

export function ClaimsPage() {
  return (
    <FeatureLayout chapterNum="12" category="Insurance" title="Claim tracking." tagline="An honest status timeline. Whether it's a small medical bill or a life-cover payout — the same clarity.">
      <div className="grid gap-6" data-testid="claims-list">
        {CLAIMS.map((c) => (
          <div key={c.id} className="preview-panel" style={{ minHeight: 200 }}>
            <div className="w-full">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="eyebrow opacity-60">{c.id} · opened {c.opened}</div>
                  <div className="font-display text-2xl">{c.policy}</div>
                </div>
                <div className="font-display text-2xl" style={{ color: "var(--emerald-bright)" }}>{fmtInr(c.amt)}</div>
              </div>
              <div className="flex items-center gap-1 mt-6" data-testid={`claim-${c.id}`}>
                {STAGES.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div className="h-1" style={{ background: i <= c.stage ? "var(--emerald-bright)" : "var(--hairline-light)" }} />
                    <div className="font-mono text-[9px] mt-2" style={{ opacity: i <= c.stage ? 0.9 : 0.4 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </FeatureLayout>
  );
}

const PREMIUMS = [
  { policy: "SafeHome Term", due: "2026-03-14", amt: 4200 },
  { policy: "Family Shield", due: "2026-05-02", amt: 2800 },
  { policy: "Sampoorna Plus", due: "2026-08-19", amt: 6300 },
];

export function PremiumRemindersPage() {
  const today = new Date();
  const withDays = PREMIUMS.map((p) => ({ ...p, days: Math.ceil((new Date(p.due) - today) / 86400000) }));
  return (
    <FeatureLayout chapterNum="12" category="Insurance" title="Premium reminders." tagline="Every premium up ahead, ordered by when it's due. Never surprised, never lapsed.">
      <div className="grid gap-3" data-testid="premium-list">
        {withDays.map((p, i) => (
          <div key={i} className="flex items-baseline gap-6 py-4 border-b" style={{ borderColor: "var(--hairline-light)" }}>
            <div className="font-display leading-none" style={{ fontSize: "3rem", color: "var(--emerald-bright)" }}>{p.days}</div>
            <div className="flex-1">
              <div className="font-display text-lg">{p.policy}</div>
              <div className="font-mono text-[11px] opacity-70">due {p.due} · {fmtInr(p.amt)}</div>
            </div>
            <button className="pill-btn ghost" data-testid={`premium-remind-${i}`}>Remind 3 days before</button>
          </div>
        ))}
      </div>
    </FeatureLayout>
  );
}
