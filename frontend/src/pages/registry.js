// Central navigation registry — single source of truth for the side drawer and the router.
// Chapters (01)-(04) live on the home page (/). Categories (05)-(16) are separate routes.

export const CATEGORIES = [
  {
    num: "05", key: "onboarding", title: "Onboarding & Identity",
    items: [
      { slug: "kyc", title: "KYC flow", path: "/onboarding/kyc" },
      { slug: "otp", title: "OTP verification", path: "/onboarding/otp" },
      { slug: "progressive", title: "Progressive profiling", path: "/onboarding/progressive-profiling" },
      { slug: "language", title: "Multi-language onboarding", path: "/onboarding/language" },
    ],
  },
  {
    num: "06", key: "account", title: "Account & Dashboard",
    items: [
      { slug: "net-worth", title: "Net worth overview", path: "/account/net-worth" },
      { slug: "transactions", title: "Transaction history", path: "/account/transactions" },
      { slug: "spending", title: "Spending breakdown", path: "/account/spending" },
      { slug: "digest", title: "Financial summary digest", path: "/account/digest" },
      { slug: "budget", title: "Budget vs actual", path: "/account/budget" },
    ],
  },
  {
    num: "07", key: "credit", title: "Credit & Scoring",
    items: [
      { slug: "history", title: "Score history & trend", path: "/credit/history" },
      { slug: "factors", title: "Score factor breakdown", path: "/credit/factors" },
      { slug: "whatif", title: "What-if simulator", path: "/credit/whatif-simulator" },
      { slug: "alerts", title: "Score change alerts", path: "/credit/alerts" },
      { slug: "loan-eligibility", title: "Loan eligibility pre-check", path: "/credit/loan-eligibility" },
    ],
  },
  {
    num: "08", key: "investments", title: "Investments",
    items: [
      { slug: "goals", title: "Goal-based investing", path: "/investments/goals" },
      { slug: "sip", title: "SIP calculator", path: "/investments/sip-calculator" },
      { slug: "risk-quiz", title: "Risk profiling quiz", path: "/investments/risk-quiz" },
      { slug: "portfolio", title: "Portfolio allocation", path: "/investments/portfolio" },
      { slug: "growth", title: "Growth projections", path: "/investments/growth-projections" },
      { slug: "rebalance", title: "Auto-rebalancing", path: "/investments/auto-rebalancing" },
      { slug: "watchlists", title: "Watchlists", path: "/investments/watchlists" },
      { slug: "roundup", title: "Round-up investing", path: "/investments/round-up" },
    ],
  },
  {
    num: "09", key: "payments", title: "Payments & Transfers",
    items: [
      { slug: "p2p", title: "P2P transfers", path: "/payments/p2p" },
      { slug: "bills", title: "Bill payments", path: "/payments/bills" },
      { slug: "split", title: "Split expenses", path: "/payments/split" },
      { slug: "scheduled", title: "Scheduled payments", path: "/payments/scheduled" },
      { slug: "reminders", title: "Payment reminders", path: "/payments/reminders" },
    ],
  },
  {
    num: "10", key: "savings", title: "Savings & Goals",
    items: [
      { slug: "pots", title: "Goal-based savings pots", path: "/savings/pots" },
      { slug: "auto-save", title: "Auto-save rules", path: "/savings/auto-save" },
      { slug: "streaks", title: "Saving streaks", path: "/savings/streaks" },
    ],
  },
  {
    num: "11", key: "lending", title: "Lending & Credit Products",
    items: [
      { slug: "micro-loan", title: "Micro-loan eligibility", path: "/lending/micro-loan" },
      { slug: "emi", title: "EMI calculator", path: "/lending/emi-calculator" },
      { slug: "repayment", title: "Repayment tracker", path: "/lending/repayment-tracker" },
    ],
  },
  {
    num: "12", key: "insurance", title: "Insurance",
    items: [
      { slug: "compare", title: "Policy comparison", path: "/insurance/compare" },
      { slug: "claims", title: "Claim tracking", path: "/insurance/claims" },
      { slug: "premium", title: "Premium reminders", path: "/insurance/premium-reminders" },
    ],
  },
  {
    num: "13", key: "education", title: "Education & Literacy",
    items: [
      { slug: "bites", title: "Bite-sized content", path: "/education/bites" },
      { slug: "glossary", title: "Glossary", path: "/education/glossary" },
      { slug: "quizzes", title: "Quizzes", path: "/education/quizzes" },
      { slug: "explainers", title: "Personalized explainers", path: "/education/explainers" },
    ],
  },
  {
    num: "14", key: "trust", title: "Trust & Transparency",
    items: [
      { slug: "explainability", title: "Explainability panel", path: "/trust/explainability" },
      { slug: "consent", title: "Data consent dashboard", path: "/trust/consent" },
      { slug: "disclaimers", title: "Contextual disclaimers", path: "/trust/disclaimers" },
      { slug: "audit", title: "Audit trail", path: "/trust/audit" },
    ],
  },
  {
    num: "15", key: "community", title: "Community",
    items: [
      { slug: "referral", title: "Referral program", path: "/community/referral" },
      { slug: "leaderboards", title: "Savings leaderboards", path: "/community/leaderboards" },
      { slug: "family", title: "Shared family accounts", path: "/community/family" },
    ],
  },
];

export const ADMIN = {
  num: "16", key: "admin", title: "Admin",
  items: [
    { slug: "risk-buckets", title: "Aggregate risk-bucket dashboard", path: "/admin/risk-buckets" },
    { slug: "fraud", title: "Fraud / anomaly flags", path: "/admin/fraud" },
  ],
};

export const HOME_CHAPTERS = [
  { num: "00", title: "Hero", id: "hero" },
  { num: "01", title: "The Fog", id: "score" },
  { num: "02", title: "The Portrait", id: "profiles" },
  { num: "03", title: "The Compass", id: "invest" },
  { num: "04", title: "The Disclosures", id: "disclosures" },
];
