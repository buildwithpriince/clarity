import { useMemo, useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";

const BITES = [
  { title: "What is a credit score, really?", body: "It's a number, 300 to 900, that guesses how reliably you'll pay back what you borrow. Higher is safer. Nothing more mysterious than that." },
  { title: "SIP: the smallest investment that works", body: "A Systematic Investment Plan is a monthly contribution — ₹500 or ₹5,000, it doesn't matter — that quietly compounds. Skip a month, add extra another month, both are fine." },
  { title: "Why UPI activity matters for your score", body: "Regular UPI use creates a digital record. That record shows discipline. Discipline reads as risk-lightness to a lender. UPI helps you be seen." },
  { title: "Term insurance in one sentence", body: "You pay a small annual amount, and your family receives a large one if you die during the term. That is the whole product." },
  { title: "The Rule of 72", body: "Divide 72 by your interest rate. That's roughly how many years it takes your money to double. At 8%: nine years. At 12%: six." },
];

export function BitesPage() {
  const [i, setI] = useState(0);
  return (
    <FeatureLayout chapterNum="13" category="Education & Literacy" title="Bite-sized content." tagline="A single idea at a time. Read one, close the tab. Come back tomorrow.">
      <div className="preview-panel" style={{ minHeight: 400, maxWidth: 720 }} data-testid="bites-card">
        <div className="w-full">
          <div className="eyebrow opacity-60 mb-3">Card {i + 1} of {BITES.length}</div>
          <h2 className="font-display text-4xl leading-tight mb-6">{BITES[i].title}</h2>
          <p className="font-body opacity-85 leading-relaxed text-lg">{BITES[i].body}</p>
          <div className="flex justify-between items-baseline mt-10 pt-6 border-t" style={{ borderColor: "var(--hairline-light)" }}>
            <button className="pill-btn ghost" onClick={() => setI((i - 1 + BITES.length) % BITES.length)} data-testid="bites-prev">← Previous</button>
            <span className="font-mono text-[11px] opacity-60">{String(i + 1).padStart(2, "0")} / {String(BITES.length).padStart(2, "0")}</span>
            <button className="pill-btn" onClick={() => setI((i + 1) % BITES.length)} data-testid="bites-next">Next →</button>
          </div>
        </div>
      </div>
    </FeatureLayout>
  );
}

const GLOSSARY = [
  ["APR", "Annual Percentage Rate — the yearly cost of borrowing, including interest and fees."],
  ["Compound interest", "Interest on interest. Each period's earnings become next period's principal."],
  ["Credit bureau", "An agency that stores your borrowing history and issues formal credit reports (in India: CIBIL, Equifax, Experian, CRIF)."],
  ["Debt-to-income", "The share of your monthly income that goes to repaying debt. Lower is safer."],
  ["EMI", "Equated Monthly Installment. The fixed monthly payment on a loan."],
  ["FD", "Fixed Deposit. Money locked with a bank for a set term at a set rate."],
  ["KYC", "Know Your Customer. The verification a financial provider does before opening an account for you."],
  ["Liquidity", "How quickly an asset can be turned into cash without loss of value."],
  ["Mutual fund", "A managed pool of many people's money, invested according to a stated strategy."],
  ["NAV", "Net Asset Value. The per-unit price of a mutual fund on any given day."],
  ["Principal", "The original amount borrowed or invested, before interest."],
  ["Rupee cost averaging", "The natural benefit of investing a fixed amount regularly, which buys more units when prices are low."],
  ["SIP", "Systematic Investment Plan. A monthly, automatic contribution to a mutual fund."],
  ["Term insurance", "Pure life cover for a fixed period; pays out only if you die during the term."],
  ["UPI", "Unified Payments Interface. India's real-time bank-to-bank payment rail."],
];

export function GlossaryPage() {
  const [q, setQ] = useState("");
  const filtered = GLOSSARY.filter(([k, v]) => (k + v).toLowerCase().includes(q.toLowerCase()));
  return (
    <FeatureLayout chapterNum="13" category="Education & Literacy" title="Glossary." tagline="Every word we use, defined in one line. No jargon smuggled in.">
      <input placeholder="Search a term…" value={q} onChange={(e) => setQ(e.target.value)} className="editorial-input mb-8 max-w-md" style={{ fontSize: "1.4rem" }} data-testid="glossary-search" />
      <div className="grid gap-4 max-w-3xl" data-testid="glossary-list">
        {filtered.map(([k, v]) => (
          <div key={k} className="grid grid-cols-12 gap-4 border-b pb-4" style={{ borderColor: "var(--hairline-light)" }}>
            <div className="col-span-3 font-display text-xl">{k}</div>
            <div className="col-span-9 font-body opacity-85">{v}</div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="eyebrow opacity-50 mt-8">No matches.</div>}
    </FeatureLayout>
  );
}

const QUIZ = [
  { q: "Higher credit score means…", options: ["Higher interest rate", "Lower interest rate", "No difference"], a: 1 },
  { q: "In SIP, ₹1000 per month for 10 years at 12% is roughly…", options: ["₹1.2 lakh", "₹2.3 lakh", "₹2.3 lakh + interest"], a: 2 },
  { q: "Term insurance pays out…", options: ["Only if you die during the term", "At retirement", "On any hospital claim"], a: 0 },
  { q: "The Rule of 72 helps you estimate…", options: ["Loan EMI", "Time to double money", "Score buckets"], a: 1 },
];

export function QuizzesPage() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const done = i >= QUIZ.length;
  return (
    <FeatureLayout chapterNum="13" category="Education & Literacy" title="Quizzes." tagline="A short check-in — four questions on the ideas you've just read.">
      <div className="preview-panel max-w-2xl" style={{ minHeight: 340 }} data-testid="quiz-card">
        {!done ? (
          <div className="w-full">
            <div className="eyebrow opacity-60 mb-4">Question {i + 1} of {QUIZ.length}</div>
            <h3 className="font-display text-2xl mb-6">{QUIZ[i].q}</h3>
            <div className="grid gap-2">
              {QUIZ[i].options.map((o, idx) => {
                const isPicked = picked === idx;
                const isRight = idx === QUIZ[i].a;
                let color = "var(--hairline-light)";
                if (picked !== null) color = isRight ? "var(--emerald-bright)" : (isPicked ? "#a04d3f" : "var(--hairline-light)");
                return (
                  <button key={idx} disabled={picked !== null} onClick={() => { setPicked(idx); if (idx === QUIZ[i].a) setScore(s => s + 1); }}
                    className="text-left border py-3 px-5 transition" style={{ borderColor: color }} data-testid={`quiz-opt-${idx}`}>
                    <span className="font-display text-lg">{o}</span>
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <button className="pill-btn mt-6" onClick={() => { setPicked(null); setI(i + 1); }} data-testid="quiz-next">Next →</button>
            )}
          </div>
        ) : (
          <div className="w-full">
            <div className="eyebrow opacity-60 mb-3">Result</div>
            <div className="font-display leading-none mb-4" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "var(--emerald-bright)" }} data-testid="quiz-score">{score} / {QUIZ.length}</div>
            <button className="pill-btn" onClick={() => { setI(0); setScore(0); setPicked(null); }} data-testid="quiz-retake">↻ Retake</button>
          </div>
        )}
      </div>
    </FeatureLayout>
  );
}

export function ExplainersPage() {
  const [profile, setProfile] = useState("emerging");
  const CONTENT = {
    emerging: { title: "You are just starting out.", body: "Focus on visibility first. A recurring recharge, a small monthly deposit, on-time utility bills. These form the raw material a score can even read." },
    fair: { title: "You have a foundation.", body: "The signals are readable but modest. Two habits move the score next: reduce debt below 20% of income, and add a small SIP so a savings signal exists." },
    strong: { title: "You are on the right side of the ledger.", body: "Most levers are already pulled. The next opportunity is diversification — a small equity investment, not to earn more, but to be seen holding one." },
    excellent: { title: "You are a template.", body: "There is little left to do for the score. The next question is how to protect what you've built — an emergency fund three months deep, and a modest term policy." },
  };
  return (
    <FeatureLayout chapterNum="13" category="Education & Literacy" title="Personalized explainers." tagline="The same idea, told the way your profile needs to hear it.">
      <div className="flex gap-2 mb-8 flex-wrap" data-testid="explainer-tabs">
        {Object.keys(CONTENT).map((k) => (
          <button key={k} onClick={() => setProfile(k)} className={`pill-btn ${profile === k ? "" : "ghost"}`} data-testid={`explainer-${k}`}>{k}</button>
        ))}
      </div>
      <div className="preview-panel max-w-3xl" style={{ minHeight: 300 }}>
        <div className="w-full">
          <div className="eyebrow opacity-60 mb-3">For a {profile} profile</div>
          <h2 className="font-display text-4xl leading-tight mb-6" data-testid="explainer-title">{CONTENT[profile].title}</h2>
          <p className="font-body opacity-85 leading-relaxed text-lg">{CONTENT[profile].body}</p>
        </div>
      </div>
    </FeatureLayout>
  );
}
