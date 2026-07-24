export default function ChapterHero() {
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center"
      data-testid="chapter-hero"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 w-full">
        <div className="chapter-marker reveal">
          <span className="num">Chapter 00</span>
          <span className="desc">— The Overture</span>
        </div>

        <h1 className="font-display reveal delay-1"
          style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}
        >
          Time is money,<br />
          <span>why not </span>
          <span className="italic-emerald">save </span>
          <span>both.</span>
        </h1>

        <div className="grid md:grid-cols-12 gap-10 mt-16">
          <div className="md:col-span-5 reveal delay-2">
            <p className="font-body text-base md:text-lg leading-relaxed max-w-md" style={{ color: 'var(--ink)' }}>
              Half a billion Indians hold a full decade of financial discipline that
              no bureau can see — steady recharges, patient repayments, quiet UPI ledgers.
              Clarity translates that record into a score you can read, and a plan you can hold.
            </p>
            <div className="flex items-center gap-6 mt-10">
              <button
                className="pill-btn"
                onClick={() => jump("score")}
                data-testid="hero-begin-btn"
              >
                Begin the assessment →
              </button>
              <button
                className="nav-link"
                onClick={() => jump("profiles")}
                data-testid="hero-read-on"
              >
                Read on ↓
              </button>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8 reveal delay-3">
            <div className="fig-caption mb-4">Fig. 00 — The Ledger, Unseen</div>
            <div
              className="preview-panel"
              style={{ minHeight: 340 }}
            >
              <div className="flex-1 flex flex-col justify-between">
                {[
                  { label: "Electricity", meta: "on time · 48 mo streak" },
                  { label: "Mobile recharge", meta: "monthly · uninterrupted" },
                  { label: "UPI activity", meta: "3,214 tx / year" },
                  { label: "Rent", meta: "first of the month · 6 yrs" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between border-b py-3"
                    style={{ borderColor: 'var(--hairline-light)' }}
                  >
                    <span className="font-display text-xl">{row.label}</span>
                    <span className="font-mono text-[11px] opacity-70">{row.meta}</span>
                  </div>
                ))}
                <div className="flex items-baseline justify-between pt-4">
                  <span className="eyebrow" style={{color: 'var(--emerald-bright)'}}>Bureau file</span>
                  <span className="font-mono text-[11px] opacity-70">— none —</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
