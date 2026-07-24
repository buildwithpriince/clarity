import { useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { toast } from "sonner";
import { useLocalStorage, clearLocalStorage } from "@/state/ClarityContext";

// ------------------ KYC FLOW ------------------
export function KYCPage() {
  const [step, setStep] = useLocalStorage("clarity_kyc_progress_step", 0);
  const [data, setData] = useLocalStorage("clarity_kyc_progress_data", { pan: "", aadhaar_last4: "", address: "" });
  const steps = [
    { key: "pan", label: "PAN number", placeholder: "ABCDE1234F", maxLength: 10 },
    { key: "aadhaar_last4", label: "Aadhaar (last 4 digits)", placeholder: "1234", maxLength: 4 },
    { key: "address", label: "Address (line 1)", placeholder: "Village / street" },
  ];
  const done = step >= steps.length;
  const finish = () => {
    // Clear in-progress persistence once completed
    clearLocalStorage("clarity_kyc_progress_step");
    clearLocalStorage("clarity_kyc_progress_data");
  };
  const restart = () => {
    setStep(0);
    setData({ pan: "", aadhaar_last4: "", address: "" });
  };
  return (
    <FeatureLayout chapterNum="05" category="Onboarding & Identity" title="KYC flow." tagline="A three-step, low-friction identity check. Synthetic only — nothing is submitted anywhere.">
      <TwoCol
        left={
          !done ? (
            <div data-testid="kyc-step">
              <div className="eyebrow mb-4">Step {step + 1} of {steps.length}</div>
              <label className="font-display text-2xl block mb-3">{steps[step].label}</label>
              <input
                className="editorial-input"
                placeholder={steps[step].placeholder}
                maxLength={steps[step].maxLength}
                value={data[steps[step].key]}
                onChange={(e) => setData({ ...data, [steps[step].key]: e.target.value })}
                data-testid={`kyc-input-${steps[step].key}`}
              />
              <button
                className="pill-btn mt-8"
                onClick={() => { const ns = step + 1; setStep(ns); if (ns >= steps.length) finish(); }}
                disabled={!data[steps[step].key]}
                data-testid="kyc-next"
              >
                {step + 1 === steps.length ? "Finish →" : "Continue →"}
              </button>
            </div>
          ) : (
            <div data-testid="kyc-done">
              <div className="eyebrow opacity-60 mb-3">Complete</div>
              <div className="font-display text-5xl mb-4" style={{ color: "var(--emerald-bright)" }}>Verified.</div>
              <p className="font-body opacity-80 mb-6">Your profile is ready. In production this step would call a real e-KYC provider under DPDP-compliant consent.</p>
              <button className="pill-btn" onClick={restart} data-testid="kyc-restart">↻ Restart</button>
            </div>
          )
        }
        right={
          <FigPanel caption="Fig. 05a — Progress">
            <div className="w-full">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-baseline gap-4 py-3 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-mono text-[10px] opacity-50">0{i + 1}</span>
                  <span className="font-display text-lg flex-1">{s.label}</span>
                  <span className="font-mono text-[11px]" style={{ color: data[s.key] ? "var(--emerald-bright)" : "inherit", opacity: data[s.key] ? 1 : 0.4 }}>
                    {data[s.key] ? "✓" : "—"}
                  </span>
                </div>
              ))}
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ OTP VERIFICATION ------------------
export function OTPPage() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const filled = otp.every((c) => c);

  const send = () => { if (phone.length === 10) { setSent(true); toast.success("Synthetic OTP: 428193"); } };
  const verify = () => { if (filled) setVerified(true); };

  return (
    <FeatureLayout chapterNum="05" category="Onboarding & Identity" title="OTP verification." tagline="Send a code, receive a code. Prototype simulates the round-trip; the demo OTP is 428193.">
      <TwoCol
        left={
          verified ? (
            <div data-testid="otp-verified">
              <div className="font-display text-5xl mb-4" style={{ color: "var(--emerald-bright)" }}>Verified.</div>
              <p className="opacity-80">Phone <span className="font-mono">+91 {phone}</span> is now bound to your profile.</p>
            </div>
          ) : !sent ? (
            <div>
              <div className="eyebrow opacity-60 mb-2">Phone</div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl opacity-60">+91</span>
                <input className="editorial-input" placeholder="10-digit number" value={phone} maxLength={10} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} data-testid="otp-phone" />
              </div>
              <button className="pill-btn mt-8" onClick={send} disabled={phone.length !== 10} data-testid="otp-send">Send code →</button>
            </div>
          ) : (
            <div>
              <div className="eyebrow opacity-60 mb-4">Enter 6-digit code</div>
              <div className="flex gap-2" data-testid="otp-inputs">
                {otp.map((c, i) => (
                  <input key={i} value={c} maxLength={1} onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    const next = [...otp]; next[i] = v; setOtp(next);
                    if (v && i < 5) document.querySelector(`[data-testid='otp-cell-${i + 1}']`)?.focus();
                  }} data-testid={`otp-cell-${i}`} className="w-12 h-14 text-center font-display text-2xl border-b outline-none" style={{ borderColor: "var(--hairline-light)", background: "transparent" }} />
                ))}
              </div>
              <button className="pill-btn mt-8" onClick={verify} disabled={!filled} data-testid="otp-verify">Verify →</button>
              <button className="nav-link ml-4" onClick={() => setSent(false)} data-testid="otp-resend">Resend</button>
            </div>
          )
        }
        right={
          <FigPanel caption="Fig. 05b — Delivery log">
            <div className="w-full space-y-3">
              <LogRow ts="now" label="Prototype OTP generated" val={sent ? "428193" : "—"} />
              <LogRow ts={sent ? "just now" : "—"} label="Sent to phone" val={sent ? `+91 ${phone}` : "—"} />
              <LogRow ts={verified ? "just now" : "—"} label="Verified" val={verified ? "✓" : "pending"} />
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

function LogRow({ ts, label, val }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] opacity-50 w-16">{ts}</span>
        <span className="font-body text-sm">{label}</span>
      </div>
      <span className="font-mono text-[11px]" style={{ color: "var(--emerald-bright)" }}>{val}</span>
    </div>
  );
}

// ------------------ PROGRESSIVE PROFILING ------------------
const PROFILE_FIELDS = [
  { key: "occupation", label: "What do you do?", placeholder: "e.g. Shopkeeper, farmer, tailor" },
  { key: "monthly_income", label: "Monthly income", placeholder: "e.g. 25000", prefix: "₹" },
  { key: "dependents", label: "How many people rely on your income?", placeholder: "e.g. 4" },
  { key: "goal", label: "One financial goal for this year", placeholder: "e.g. child's school fees" },
  { key: "years_in_town", label: "Years in current town / village", placeholder: "e.g. 12" },
];
export function ProgressiveProfilingPage() {
  const [data, setData] = useLocalStorage("clarity_progressive_profiling_data", {});
  const filled = PROFILE_FIELDS.filter((f) => data[f.key]);
  return (
    <FeatureLayout chapterNum="05" category="Onboarding & Identity" title="Progressive profiling." tagline="Five questions, only when you want to answer them. Every field is optional; every field unlocks a better plan.">
      <TwoCol
        left={
          <div className="grid gap-6" data-testid="profiling-form">
            {PROFILE_FIELDS.map((f) => (
              <div key={f.key}>
                <div className="eyebrow opacity-60 mb-2">{f.label}</div>
                <div className="flex items-baseline gap-2">
                  {f.prefix && <span className="font-display text-2xl opacity-60">{f.prefix}</span>}
                  <input className="editorial-input" placeholder={f.placeholder} value={data[f.key] || ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} data-testid={`prof-${f.key}`} style={{ fontSize: "1.6rem" }} />
                </div>
              </div>
            ))}
          </div>
        }
        right={
          <FigPanel caption="Fig. 05c — Profile completeness">
            <div className="w-full">
              <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="prof-completeness">
                {Math.round((filled.length / PROFILE_FIELDS.length) * 100)}%
              </div>
              <div className="eyebrow opacity-60 mb-6">{filled.length} / {PROFILE_FIELDS.length} answered</div>
              <div className="relative h-1 mb-6" style={{ background: "var(--hairline-light)" }}>
                <div className="absolute h-1" style={{ width: `${(filled.length / PROFILE_FIELDS.length) * 100}%`, background: "var(--emerald-bright)" }} />
              </div>
              <p className="font-body text-sm opacity-70 leading-relaxed">
                Every question you answer lifts your data-completeness confidence. Skipping is allowed — you can return any time.
              </p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ MULTI-LANGUAGE ------------------
const LANGS = [
  { code: "en", label: "English", copy: "Time is money, why not save both." },
  { code: "hi", label: "हिन्दी", copy: "समय ही पैसा है, दोनों क्यों न बचाएँ।" },
  { code: "bn", label: "বাংলা", copy: "সময়ই টাকা — দুটোই বাঁচাও, তাই না?" },
  { code: "ta", label: "தமிழ்", copy: "நேரம் என்பது பணம் — இரண்டையும் ஏன் சேமிக்கக் கூடாது?" },
  { code: "te", label: "తెలుగు", copy: "సమయమే డబ్బు — రెండింటినీ ఎందుకు ఆదా చేయకూడదు?" },
  { code: "mr", label: "मराठी", copy: "वेळ हाच पैसा — दोन्ही का वाचवू नये?" },
  { code: "gu", label: "ગુજરાતી", copy: "સમય એ પૈસો છે — બંને શા માટે ન બચાવવા?" },
  { code: "pa", label: "ਪੰਜਾਬੀ", copy: "ਸਮਾਂ ਹੀ ਪੈਸਾ ਹੈ — ਦੋਹਾਂ ਨੂੰ ਕਿਉਂ ਨਾ ਬਚਾਈਏ?" },
];
export function MultiLanguagePage() {
  const [pick, setPick] = useState("en");
  const chosen = LANGS.find((l) => l.code === pick);
  return (
    <FeatureLayout chapterNum="05" category="Onboarding & Identity" title="Multi-language onboarding." tagline="Choose the language you think in. The whole product will follow you into it — prototype shows the hero line here.">
      <TwoCol
        left={
          <div className="grid grid-cols-2 gap-3" data-testid="lang-grid">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setPick(l.code)} className={`text-left border py-4 px-5 transition ${pick === l.code ? "" : "hover:bg-[rgba(27,38,32,0.03)]"}`} style={{ borderColor: pick === l.code ? "var(--emerald-bright)" : "var(--hairline-light)", background: pick === l.code ? "rgba(47,143,91,0.08)" : "transparent" }} data-testid={`lang-${l.code}`}>
                <div className="font-mono text-[10px] opacity-50 mb-1">{l.code.toUpperCase()}</div>
                <div className="font-display text-xl">{l.label}</div>
              </button>
            ))}
          </div>
        }
        right={
          <FigPanel caption={`Fig. 05d — Sample in ${chosen.label}`} minHeight={340}>
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-3">Hero line</div>
              <div className="font-display text-3xl leading-tight" style={{ color: "var(--ink)" }} data-testid="lang-sample">
                {chosen.copy}
              </div>
              <p className="font-body text-sm opacity-70 mt-8">
                A production build would ship 12+ languages, with numerals and units localized per region.
              </p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}
