import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Slider } from "@/components/ui/slider";
import { useClarity, useLocalStorage, clearLocalStorage } from "@/state/ClarityContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const QUESTIONS = [
  {
    key: "utility_payments",
    q: "How often are utility bills paid on time?",
    options: [
      { v: "always", l: "Always, on the day" },
      { v: "mostly", l: "Mostly on time" },
      { v: "sometimes", l: "Sometimes late" },
      { v: "rarely", l: "Rarely on time" },
    ],
  },
  {
    key: "mobile_recharges",
    q: "How consistent are your mobile recharges?",
    options: [
      { v: "scheduled", l: "On a schedule, every month" },
      { v: "on_expiry", l: "Right when the plan expires" },
      { v: "when_needed", l: "Only when I need it" },
      { v: "irregular", l: "Irregular" },
    ],
  },
  {
    key: "upi_frequency",
    q: "How often do you use UPI in a typical week?",
    options: [
      { v: "daily", l: "Daily" },
      { v: "few_weekly", l: "A few times a week" },
      { v: "weekly", l: "About once a week" },
      { v: "rarely", l: "Rarely" },
    ],
  },
  {
    key: "rent_payments",
    q: "How reliable are your rent or EMI payments?",
    options: [
      { v: "always", l: "Always on time" },
      { v: "mostly", l: "Mostly on time" },
      { v: "sometimes_late", l: "Sometimes late" },
      { v: "often_late", l: "Often late" },
    ],
  },
  {
    key: "savings_habit",
    q: "Do you set aside money each month?",
    options: [
      { v: "every_month", l: "Every month, without fail" },
      { v: "most_months", l: "Most months" },
      { v: "sometimes", l: "Sometimes" },
      { v: "rarely", l: "Rarely" },
    ],
  },
  {
    key: "income_stability",
    q: "How stable is your monthly income?",
    options: [
      { v: "very_stable", l: "Very stable, salaried" },
      { v: "mostly_stable", l: "Mostly stable" },
      { v: "variable", l: "It varies month to month" },
      { v: "irregular", l: "Irregular / seasonal" },
    ],
  },
  {
    key: "debt_burden",
    q: "How much of your income goes to repaying debt?",
    options: [
      { v: "none", l: "None" },
      { v: "under_20", l: "Under 20%" },
      { v: "20_to_40", l: "Between 20% and 40%" },
      { v: "over_40", l: "Over 40%" },
    ],
  },
  {
    key: "digital_footprint",
    q: "How long have you been using digital payments?",
    options: [
      { v: "5_plus", l: "5 years or more" },
      { v: "2_to_5", l: "2 to 5 years" },
      { v: "1_to_2", l: "1 to 2 years" },
      { v: "under_1", l: "Less than a year" },
    ],
  },
];

// What-if slider factors (a subset the user can toggle post-reveal)
const WHATIF = [
  { key: "utility_payments", label: "Utility bills on time", options: ["rarely", "sometimes", "mostly", "always"] },
  { key: "rent_payments", label: "Rent / EMI punctuality", options: ["often_late", "sometimes_late", "mostly", "always"] },
  { key: "debt_burden", label: "Debt-to-income", options: ["over_40", "20_to_40", "under_20", "none"] },
];

export default function ChapterScore() {
  const { creditResult, setCreditResult, setCreditAnswers } = useClarity();
  // In-progress state persisted to localStorage
  const [answers, setAnswers] = useLocalStorage("clarity_credit_assessment_progress_answers", {});
  const [current, setCurrent] = useLocalStorage("clarity_credit_assessment_progress_current", 0);
  // Once completed, we hydrate from context (creditResult) — no separate 'result' state on mount if the user is signed-in-equivalent
  const [result, setResult] = useState(() => creditResult);
  const [view, setView] = useState("scorecard"); // scorecard | decision
  const [whatIf, setWhatIf] = useState({});
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Keep local result in sync with context (e.g. cleared elsewhere)
  useEffect(() => { setResult(creditResult); }, [creditResult]);

  const answeredCount = Object.keys(answers).length;
  const progress = answeredCount / QUESTIONS.length;

  const submit = async (finalAnswers) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/score/from-answers`, { answers: finalAnswers });
      setResult(data);
      setCreditResult(data);
      setCreditAnswers(finalAnswers);
      setWhatIf({
        utility_payments: finalAnswers.utility_payments,
        rent_payments: finalAnswers.rent_payments,
        debt_burden: finalAnswers.debt_burden,
      });
      // Clear in-progress persistence — the "completed" result now lives in context
      clearLocalStorage("clarity_credit_assessment_progress_answers");
      clearLocalStorage("clarity_credit_assessment_progress_current");
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.status, error.response.data);
      } else {
        console.error("Error setting up request:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const answer = (opt) => {
    const q = QUESTIONS[current];
    const next = { ...answers, [q.key]: opt };
    setAnswers(next);
    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
    } else {
      submit(next);
    }
  };

  // Live what-if recalc (debounced by setTimeout)
  useEffect(() => {
    if (!result) return;
    const merged = { ...answers, ...whatIf };
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.post(`${API}/score/from-answers`, { answers: merged });
        setSimResult(data);
      } catch (error) {
        if (error.response) {
          console.error("What-if calculation error:", error.response.status, error.response.data);
        } else {
          console.error("Error setting up what-if request:", error.message);
        }
      }
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [whatIf]);

  const reset = () => {
    setAnswers({});
    setCurrent(0);
    setResult(null);
    setSimResult(null);
    setWhatIf({});
    setCreditResult(null);
    setCreditAnswers(null);
    clearLocalStorage("clarity_credit_assessment_progress_answers");
    clearLocalStorage("clarity_credit_assessment_progress_current");
  };

  const provisional = useMemo(() => 300 + Math.round(progress * 600 * 0.85), [progress]);
  const displayScore = simResult?.score ?? result?.score;
  const displayBucket = simResult?.bucket ?? result?.bucket;

  return (
    <section id="score" className="dark-section" data-testid="chapter-score">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="chapter-marker reveal">
          <span className="num">Chapter 01</span>
          <span className="desc" style={{color: 'var(--bone)'}}>— THE FOG</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          {/* LEFT — questions or reveal */}
          <div className="md:col-span-6 reveal delay-1">
            <h2 className="font-display leading-none mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              You <span className="italic-emerald">don&apos;t</span> know<br/>
              where it all goes.
            </h2>
            <p className="font-body max-w-md opacity-80 mb-12">
              Eight quiet questions. Each one reads a signal a bureau can&apos;t. Nothing here is stored.
            </p>

            {!result ? (
              <div data-testid="question-card">
                <div className="flex items-baseline justify-between mb-6">
                  <span className="eyebrow">Question {String(current + 1).padStart(2, '0')} / {QUESTIONS.length}</span>
                  <button className="nav-link" onClick={() => current > 0 && setCurrent(current - 1)} disabled={current === 0} data-testid="q-back">
                    ← Back
                  </button>
                </div>
                <h3 className="font-display text-3xl md:text-4xl leading-tight mb-8">
                  {QUESTIONS[current].q}
                </h3>
                <div className="grid gap-3">
                  {QUESTIONS[current].options.map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => answer(opt.v)}
                      className="text-left border py-4 px-5 transition hover:bg-[rgba(247,243,233,0.06)] group"
                      style={{ borderColor: 'var(--hairline-dark)' }}
                      data-testid={`q-opt-${QUESTIONS[current].key}-${opt.v}`}
                    >
                      <span className="font-display text-xl">{opt.l}</span>
                      <span className="float-right opacity-40 group-hover:opacity-100 transition" style={{color: 'var(--emerald-bright)'}}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ScoreReveal
                result={simResult ?? result}
                originalResult={result}
                view={view}
                setView={setView}
                whatIf={whatIf}
                setWhatIf={setWhatIf}
                onReset={reset}
              />
            )}
          </div>

          {/* RIGHT — instrument preview panel */}
          <div className="md:col-span-6 reveal delay-2">
            <div className="fig-caption mb-4">Fig. 01 — The Instrument</div>
            <div className="preview-panel" style={{ borderColor: 'var(--hairline-dark)' }}>
              <div>
                <div className="flex items-baseline justify-between mb-6">
                  <span className="eyebrow">Signal</span>
                  <span className="font-mono text-[11px] opacity-70" data-testid="signal-progress">
                    {answeredCount} of {QUESTIONS.length} answered
                    {answeredCount < QUESTIONS.length && ' — provisional signal building'}
                  </span>
                </div>

                <div className="font-display leading-none mb-4"
                  style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: result ? 'var(--emerald-bright)' : 'inherit' }}
                  data-testid="score-display"
                >
                  {loading ? '···' : (result ? displayScore : (answeredCount > 0 ? provisional : '—'))}
                </div>
                <div className="eyebrow opacity-80 mb-8">
                  {result ? displayBucket : (answeredCount > 0 ? 'PROVISIONAL' : 'AWAITING SIGNAL')}
                </div>

                {/* Score bar 300-900 */}
                <div className="relative h-1 mb-2" style={{ background: 'var(--hairline-dark)' }}>
                  <div
                    className="absolute top-0 left-0 h-1 transition-all duration-500"
                    style={{
                      width: `${((result ? displayScore : (answeredCount > 0 ? provisional : 300)) - 300) / 6}%`,
                      background: 'var(--emerald-bright)'
                    }}
                    data-testid="score-bar"
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] opacity-50">
                  <span>300</span>
                  <span>600</span>
                  <span>900</span>
                </div>
              </div>

              {result && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--hairline-dark)' }}>
                  <div className="eyebrow opacity-60 mb-2">Confidence</div>
                  <p className="font-mono text-sm" data-testid="confidence-note">
                    Based on {result.data_completeness.answered} of {result.data_completeness.total} signals — {result.data_completeness.confidence} confidence
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreReveal({ result, originalResult, view, setView, whatIf, setWhatIf, onReset }) {
  const delta = result.score - originalResult.score;
  return (
    <div data-testid="score-reveal">
      <div className="flex items-center gap-2 mb-6">
        <button
          className={`pill-btn ${view === 'scorecard' ? '' : 'ghost'}`}
          onClick={() => setView('scorecard')}
          data-testid="view-scorecard"
        >
          Scorecard
        </button>
        <button
          className={`pill-btn ${view === 'decision' ? '' : 'ghost'}`}
          onClick={() => setView('decision')}
          data-testid="view-decision"
        >
          Decision path
        </button>
      </div>

      {view === 'scorecard' && (
        <div className="grid gap-3 mb-8" data-testid="scorecard-view">
          {result.top_factors.map((f) => (
            <div key={f.label} className="flex items-baseline gap-4">
              <div className="w-40 font-mono text-[11px] opacity-70">{f.label}</div>
              <div className="flex-1 h-[3px] relative" style={{ background: 'var(--hairline-dark)' }}>
                <div
                  className="absolute h-[3px] transition-all duration-500"
                  style={{ width: `${f.strength}%`, background: 'var(--emerald-bright)' }}
                />
              </div>
              <div className="w-12 text-right font-mono text-[11px] opacity-70">{f.strength}</div>
            </div>
          ))}
        </div>
      )}

      {view === 'decision' && (
        <div className="mb-8 grid gap-2" data-testid="decision-view">
          {result.decision_path.map((n, i) => (
            <div key={i} className="flex items-baseline gap-3 py-2 border-b" style={{ borderColor: 'var(--hairline-dark)' }}>
              <span className="font-mono text-[10px] opacity-50 w-6">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-lg flex-1">{n.question}</span>
              <span className="font-mono text-[11px] opacity-90" style={{color: n.answer === 'Yes' ? 'var(--emerald-bright)' : 'var(--bone)'}}>
                {n.answer}
              </span>
              <span className="font-mono text-[10px] opacity-60 w-28 text-right">{n.effect}</span>
            </div>
          ))}
        </div>
      )}

      {/* What-if simulator */}
      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--hairline-dark)' }}>
        <div className="flex items-baseline justify-between mb-4">
          <span className="eyebrow" style={{color: 'var(--emerald-bright)'}}>What if</span>
          <span className="font-mono text-[11px] opacity-70" data-testid="whatif-delta">
            {delta === 0 ? 'no change' : `${delta > 0 ? '+' : ''}${delta} vs actual`}
          </span>
        </div>

        {WHATIF.map((wf) => {
          const idx = wf.options.indexOf(whatIf[wf.key] ?? wf.options[0]);
          return (
            <div key={wf.key} className="mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-mono text-[11px] opacity-80">{wf.label}</span>
                <span className="font-mono text-[10px] opacity-60">{wf.options[idx].replace(/_/g,' ')}</span>
              </div>
              <Slider
                value={[idx]}
                onValueChange={([v]) => setWhatIf((p) => ({ ...p, [wf.key]: wf.options[v] }))}
                min={0}
                max={wf.options.length - 1}
                step={1}
                data-testid={`whatif-${wf.key}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--hairline-dark)' }}>
        <div className="eyebrow mb-3">Next steps</div>
        {result.improvement_tips.slice(0, 3).map((tip, i) => (
          <div key={i} className="mb-3 flex items-baseline gap-3">
            <span className="font-mono text-[10px]" style={{color: 'var(--emerald-bright)'}}>0{i+1}</span>
            <div>
              <span className="font-display text-lg">{tip.label}. </span>
              <span className="font-body text-sm opacity-80">{tip.tip}</span>
            </div>
          </div>
        ))}
        <button className="nav-link mt-4" onClick={onReset} data-testid="score-reset">↻ Retake assessment</button>
      </div>
    </div>
  );
}