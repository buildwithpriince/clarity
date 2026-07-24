import { useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { toast } from "sonner";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export function ReferralPage() {
  const code = "CLARITY-M8K3";
  const [count, setCount] = useState(3);
  const bonus = count * 100;
  return (
    <FeatureLayout chapterNum="15" category="Community" title="Referral program." tagline="Bring a friend into the ledger. Both of you receive a small nudge on your first month.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">Your code</div>
            <div className="flex items-baseline gap-4 mb-6">
              <div className="font-display text-4xl">{code}</div>
              <button className="nav-link" onClick={() => { navigator.clipboard?.writeText(code); toast.success("Copied"); }} data-testid="ref-copy">Copy</button>
            </div>
            <p className="font-body opacity-80 mb-8 max-w-md">Share the code by any channel. When they complete their first assessment, we credit both of you ₹100 into your savings pot.</p>
            <button className="pill-btn" onClick={() => setCount(count + 1)} data-testid="ref-simulate">Simulate a new signup →</button>
          </div>
        }
        right={
          <FigPanel caption="Fig. 15a — Bonus earned">
            <div className="w-full">
              <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="ref-bonus">{fmtInr(bonus)}</div>
              <div className="eyebrow opacity-60 mb-8">from {count} referrals</div>
              <p className="font-body opacity-80">The bonus lands in your Diwali gifts pot by default; you can redirect it any time.</p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

const LEADERS = [
  { name: "Sunita K.", city: "Ranchi", streak: 178, saved: 42000 },
  { name: "Arun P.", city: "Anand", streak: 121, saved: 38400 },
  { name: "Meena D.", city: "Bhagalpur", streak: 96, saved: 29800 },
  { name: "You", city: "—", streak: 21, saved: 3800, self: true },
  { name: "Ram S.", city: "Sitapur", streak: 14, saved: 2100 },
  { name: "Vijay Y.", city: "Varanasi", streak: 9, saved: 1250 },
];

export function LeaderboardsPage() {
  const [metric, setMetric] = useState("streak");
  const sorted = [...LEADERS].sort((a, b) => b[metric] - a[metric]);
  return (
    <FeatureLayout chapterNum="15" category="Community" title="Savings leaderboards." tagline="Anonymous in production; named here for the demo. Compare, quietly, without competing loudly.">
      <div className="flex gap-2 mb-8" data-testid="leader-metrics">
        <button onClick={() => setMetric("streak")} className={`pill-btn ${metric === "streak" ? "" : "ghost"}`} data-testid="leader-metric-streak">By streak</button>
        <button onClick={() => setMetric("saved")} className={`pill-btn ${metric === "saved" ? "" : "ghost"}`} data-testid="leader-metric-saved">By amount saved</button>
      </div>
      <div className="max-w-2xl" data-testid="leader-list">
        {sorted.map((r, i) => (
          <div key={r.name} className="grid grid-cols-12 items-baseline py-4 border-b gap-4" style={{ borderColor: "var(--hairline-light)", background: r.self ? "rgba(47,143,91,0.05)" : "transparent" }}>
            <span className="font-display text-2xl col-span-1" style={{ color: i < 3 ? "var(--emerald-bright)" : "inherit" }}>{i + 1}</span>
            <span className="font-display text-lg col-span-4">{r.name}</span>
            <span className="font-mono text-[11px] opacity-70 col-span-3">{r.city}</span>
            <span className="font-mono text-[11px] col-span-2 text-right">{r.streak} days</span>
            <span className="font-display text-lg col-span-2 text-right">{fmtInr(r.saved)}</span>
          </div>
        ))}
      </div>
    </FeatureLayout>
  );
}

const FAMILY_INIT = [
  { name: "You", role: "Head", access: "full", balance: 42000 },
  { name: "Rekha (wife)", role: "Partner", access: "view + spend", balance: 8000 },
  { name: "Aarti (daughter)", role: "Child", access: "view only", balance: 1200 },
  { name: "Papa", role: "Elder", access: "view only", balance: 3000 },
];

export function FamilyPage() {
  const [members, setMembers] = useState(FAMILY_INIT);
  const total = members.reduce((a, m) => a + m.balance, 0);
  const [name, setName] = useState("");
  return (
    <FeatureLayout chapterNum="15" category="Community" title="Shared family accounts." tagline="One household, distinct roles. See balances together; keep autonomy separately.">
      <TwoCol
        left={
          <div data-testid="family-list">
            {members.map((m, i) => (
              <div key={i} className="flex items-baseline gap-3 py-3 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                <div className="flex-1">
                  <div className="font-display text-lg">{m.name}</div>
                  <div className="font-mono text-[10px] opacity-70">{m.role} · {m.access}</div>
                </div>
                <span className="font-display text-lg">{fmtInr(m.balance)}</span>
                {i > 0 && <button className="nav-link" onClick={() => setMembers(members.filter((_, k) => k !== i))}>Remove</button>}
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <input placeholder="Add family member" value={name} onChange={(e) => setName(e.target.value)} className="editorial-input" style={{ fontSize: "1.2rem" }} data-testid="family-name" />
              <button className="nav-link" onClick={() => { if (name) { setMembers([...members, { name, role: "Member", access: "view only", balance: 0 }]); setName(""); } }} data-testid="family-add">+ Add</button>
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 15b — Household total">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Combined balance</div>
              <div className="font-display leading-none mb-2" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="family-total">{fmtInr(total)}</div>
              <div className="eyebrow opacity-60 mb-8">across {members.length} accounts</div>
              <p className="font-body opacity-80">A household view — no forced merging, no visibility a member hasn't granted.</p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}
