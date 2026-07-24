import { useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";

const CONSENTS = [
  { key: "utility", label: "Utility bill payment history", desc: "Read on-time / late signals from electricity, water, LPG providers.", on: true },
  { key: "upi", label: "UPI activity metadata", desc: "Volume and frequency only — never individual transaction contents.", on: true },
  { key: "mobile", label: "Mobile recharge cadence", desc: "Read how consistently you keep your line active.", on: true },
  { key: "sms", label: "Bank SMS parsing", desc: "Read salary and rent SMSes to detect income stability.", on: false },
  { key: "location", label: "Location", desc: "Optional — used only for local branch suggestions.", on: false },
  { key: "contacts", label: "Contacts", desc: "Never. Not asked for, ever.", on: false, locked: true },
];

export function ConsentPage() {
  const [items, setItems] = useState(CONSENTS);
  return (
    <FeatureLayout chapterNum="14" category="Trust & Transparency" title="Data consent dashboard." tagline="Every signal Clarity reads is here. Turn any of them off. We honor deletion the same day.">
      <div className="grid gap-3" data-testid="consent-list">
        {items.map((c) => (
          <button key={c.key} onClick={() => !c.locked && setItems(items.map((x) => x.key === c.key ? { ...x, on: !x.on } : x))}
            className="text-left border py-4 px-5 flex items-baseline gap-4" style={{ borderColor: c.on ? "var(--emerald-bright)" : "var(--hairline-light)", background: c.on ? "rgba(47,143,91,0.05)" : "transparent", opacity: c.locked ? 0.6 : 1, cursor: c.locked ? "not-allowed" : "pointer" }}
            data-testid={`consent-${c.key}`} disabled={c.locked}>
            <div className="w-5 h-5 rounded-full flex-none mt-1" style={{ background: c.on ? "var(--emerald-bright)" : "transparent", border: "1px solid " + (c.on ? "var(--emerald-bright)" : "var(--hairline-light)") }} />
            <div className="flex-1">
              <div className="font-display text-lg">{c.label}</div>
              <div className="font-body text-sm opacity-70">{c.desc}</div>
            </div>
            <span className="font-mono text-[10px] opacity-60">{c.locked ? "NEVER" : c.on ? "ON" : "OFF"}</span>
          </button>
        ))}
      </div>
    </FeatureLayout>
  );
}

const DISC_TOPICS = [
  { key: "score", label: "Credit score number", text: "This score is a Clarity-computed likelihood signal, not a bureau report. It does not affect your CIBIL record." },
  { key: "projection", label: "Growth projection chart", text: "Simulated projections use illustrative historical return ranges. Actual returns will vary; past performance is not a guarantee." },
  { key: "loan", label: "Loan eligibility figure", text: "Provisional — a lender's decision may differ based on their own underwriting policies." },
  { key: "insurance", label: "Insurance comparison", text: "Products shown are indicative composites. Consult an IRDAI-licensed agent before purchase." },
  { key: "investment", label: "Investment advice", text: "This tool is not registered as an investment adviser. Consult a SEBI-registered adviser for personal recommendations." },
];

export function DisclaimersPage() {
  const [pick, setPick] = useState("score");
  const cur = DISC_TOPICS.find(x => x.key === pick);
  return (
    <FeatureLayout chapterNum="14" category="Trust & Transparency" title="Contextual disclaimers." tagline="Every number this product shows carries a footnote. Read them by topic here.">
      <TwoCol
        left={
          <div className="grid gap-2" data-testid="disc-topics">
            {DISC_TOPICS.map((d) => (
              <button key={d.key} onClick={() => setPick(d.key)} className={`text-left py-3 border-b transition ${pick === d.key ? "" : "opacity-70 hover:opacity-100"}`} style={{ borderColor: "var(--hairline-light)", color: pick === d.key ? "var(--emerald-bright)" : "inherit" }} data-testid={`disc-${d.key}`}>
                <span className="font-display text-lg">{d.label}</span>
              </button>
            ))}
          </div>
        }
        right={
          <FigPanel caption="Fig. 14b — Note">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-3">{cur.label}</div>
              <p className="font-body opacity-85 leading-relaxed text-lg" data-testid="disc-body">{cur.text}</p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

const AUDIT = [
  { ts: "2026-02-23 11:42", act: "Score computed", meta: "8 signals, confidence high" },
  { ts: "2026-02-23 11:41", act: "Consent granted", meta: "utility, UPI, mobile" },
  { ts: "2026-02-22 09:15", act: "Profile updated", meta: "monthly_income = ₹25,000" },
  { ts: "2026-02-20 20:03", act: "Score computed", meta: "8 signals, confidence high" },
  { ts: "2026-02-18 07:11", act: "Data source revoked", meta: "SMS parsing" },
  { ts: "2026-02-15 14:29", act: "Login", meta: "device: Android 13" },
];

export function AuditPage() {
  return (
    <FeatureLayout chapterNum="14" category="Trust & Transparency" title="Audit trail." tagline="Every action the product ever took on your behalf. Ordered by time. Nothing hidden.">
      <div className="max-w-3xl" data-testid="audit-list">
        {AUDIT.map((r, i) => (
          <div key={i} className="grid grid-cols-12 border-b py-3 gap-4" style={{ borderColor: "var(--hairline-light)" }}>
            <span className="font-mono text-[10px] opacity-60 col-span-3">{r.ts}</span>
            <span className="font-display text-lg col-span-4">{r.act}</span>
            <span className="font-mono text-[11px] opacity-70 col-span-5">{r.meta}</span>
          </div>
        ))}
      </div>
    </FeatureLayout>
  );
}
