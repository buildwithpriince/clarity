import { useMemo, useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

// Aggregate synthetic across 12,481 users
const RISK_DATA = [
  { bucket: "Thin (<540)", users: 1421, defaultRate: 12.8 },
  { bucket: "Emerging (540-620)", users: 2934, defaultRate: 7.4 },
  { bucket: "Fair (620-700)", users: 3612, defaultRate: 3.1 },
  { bucket: "Strong (700-780)", users: 3208, defaultRate: 1.2 },
  { bucket: "Excellent (780+)", users: 1306, defaultRate: 0.3 },
];

export function AdminRiskBucketsPage() {
  const [metric, setMetric] = useState("users");
  const total = RISK_DATA.reduce((a, r) => a + r.users, 0);
  const weightedDefault = (RISK_DATA.reduce((a, r) => a + r.users * r.defaultRate, 0) / total).toFixed(2);
  return (
    <FeatureLayout chapterNum="16" category="Admin" title="Aggregate risk-bucket dashboard." tagline="Portfolio composition across all users, and the historical default rate per bucket." admin>
      <div className="flex gap-2 mb-8" data-testid="admin-metric">
        <button onClick={() => setMetric("users")} className={`pill-btn ${metric === "users" ? "" : "ghost"}`} data-testid="admin-metric-users">By users</button>
        <button onClick={() => setMetric("defaultRate")} className={`pill-btn ${metric === "defaultRate" ? "" : "ghost"}`} data-testid="admin-metric-default">By default rate</button>
      </div>
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-5">
          <div className="eyebrow opacity-60 mb-2">Portfolio</div>
          <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="admin-total-users">{total.toLocaleString("en-IN")}</div>
          <div className="eyebrow opacity-60 mb-6">total users scored</div>
          <div className="border-t pt-6" style={{ borderColor: "var(--hairline-dark)" }}>
            <div className="flex justify-between mb-3">
              <span className="font-mono text-[11px] opacity-70">Weighted default rate</span>
              <span className="font-display text-2xl" style={{ color: "var(--emerald-bright)" }}>{weightedDefault}%</span>
            </div>
            {RISK_DATA.map((r) => (
              <div key={r.bucket} className="flex justify-between py-2 border-b" style={{ borderColor: "var(--hairline-dark)" }}>
                <span className="font-mono text-[11px] opacity-80">{r.bucket}</span>
                <span className="font-mono text-[11px]">{r.users.toLocaleString("en-IN")} · {r.defaultRate}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="fig-caption mb-4">Fig. 16a — Distribution</div>
          <div className="preview-panel" style={{ minHeight: 420 }}>
            <div style={{ height: 380, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={RISK_DATA}>
                  <CartesianGrid stroke="rgba(247,243,233,0.08)" vertical={false} />
                  <XAxis dataKey="bucket" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "rgba(247,243,233,0.7)" }} stroke="rgba(247,243,233,0.4)" />
                  <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "rgba(247,243,233,0.7)" }} stroke="rgba(247,243,233,0.4)" />
                  <Tooltip contentStyle={{ background: "#0F1712", border: "1px solid rgba(247,243,233,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11, color: "#F7F3E9" }} />
                  <Bar dataKey={metric} fill="#2F8F5B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </FeatureLayout>
  );
}

const FRAUD_INIT = [
  { id: "FR-1044", severity: "High", user: "u_29812", detail: "8 UPI attempts in 90 seconds, all failed", flagged: "2026-02-23 09:14" },
  { id: "FR-1043", severity: "Medium", user: "u_11238", detail: "New device + 4x usual transaction size", flagged: "2026-02-22 22:07" },
  { id: "FR-1042", severity: "Low", user: "u_08841", detail: "Login from outside home district", flagged: "2026-02-22 15:33" },
  { id: "FR-1041", severity: "High", user: "u_45019", detail: "SIM swap suspected — 3 OTPs to new number", flagged: "2026-02-22 08:41" },
  { id: "FR-1040", severity: "Medium", user: "u_20017", detail: "Score jump of +140 in 48h", flagged: "2026-02-21 19:20" },
];

export function AdminFraudPage() {
  const [items, setItems] = useState(FRAUD_INIT);
  const [sevFilter, setSevFilter] = useState("All");
  const rows = items.filter((r) => sevFilter === "All" || r.severity === sevFilter);
  return (
    <FeatureLayout chapterNum="16" category="Admin" title="Fraud / anomaly flags." tagline="A live queue of accounts to review. Synthetic — no real user is at risk." admin>
      <div className="flex gap-2 mb-8" data-testid="fraud-sev">
        {["All", "High", "Medium", "Low"].map((s) => (
          <button key={s} onClick={() => setSevFilter(s)} className={`pill-btn ${sevFilter === s ? "" : "ghost"}`} data-testid={`fraud-sev-${s}`}>{s}</button>
        ))}
      </div>
      <div data-testid="fraud-list">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-12 items-baseline py-4 border-b gap-4" style={{ borderColor: "var(--hairline-dark)" }}>
            <span className="font-mono text-[11px] col-span-1">{r.id}</span>
            <span className="eyebrow col-span-2" style={{ color: r.severity === "High" ? "var(--emerald-bright)" : "inherit" }}>{r.severity}</span>
            <span className="font-mono text-[10px] opacity-70 col-span-2">{r.user}</span>
            <span className="font-body text-sm col-span-4">{r.detail}</span>
            <span className="font-mono text-[10px] opacity-60 col-span-2">{r.flagged}</span>
            <button className="col-span-1 text-right nav-link" onClick={() => setItems(items.filter((x) => x.id !== r.id))} data-testid={`fraud-dismiss-${r.id}`}>Dismiss</button>
          </div>
        ))}
      </div>
      {rows.length === 0 && <div className="eyebrow opacity-60 mt-8">Queue is empty.</div>}
    </FeatureLayout>
  );
}
