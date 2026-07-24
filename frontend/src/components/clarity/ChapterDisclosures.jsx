const NOTES = [
  {
    n: "01",
    title: "Responsible AI",
    body: "The scoring model is interpretable by design — a weighted-factor system that a human can read line by line, not a black box. Every score is delivered with the specific reasons that produced it. The model uses only behavioral and financial signals; no protected-class or discriminatory attributes (caste, religion, gender, region-of-origin) are used, gathered, or inferred.",
  },
  {
    n: "02",
    title: "Data & Privacy",
    body: "This prototype uses synthetic data only. A production version would collect signals with explicit, informed consent, minimize the data it holds to what is strictly necessary, and honor requests to correct or delete personal data. Clarity intends to align its data practices with India's Digital Personal Data Protection Act 2023 framework.",
  },
  {
    n: "03",
    title: "Financial Note",
    body: "Simulated projections shown here are for educational purposes only. Clarity is not a credit bureau, does not issue a bureau report, and does not provide regulated financial advice. Historical return assumptions are illustrative — actual returns will vary. Please consult a SEBI-registered advisor before making investment decisions.",
  },
];

export default function ChapterDisclosures() {
  return (
    <section id="disclosures" data-testid="chapter-disclosures">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="chapter-marker reveal">
          <span className="num">Chapter 04</span>
          <span className="desc">— The Disclosures</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4 reveal delay-1">
            <h2 className="font-display leading-none mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Quietly<br/>
              <span className="italic-emerald">stated</span>.
            </h2>
            <p className="font-body max-w-sm opacity-80">
              A prototype ought to be honest about what it is. Read these before drawing conclusions from any number on this page.
            </p>
          </div>

          <div className="md:col-span-8">
            {NOTES.map((n, i) => (
              <div key={n.n} className={`reveal delay-${i + 2} py-8 border-b`} style={{ borderColor: 'var(--hairline-light)' }}>
                <div className="grid md:grid-cols-12 gap-6 items-baseline">
                  <div className="md:col-span-1 font-mono text-[11px] opacity-50">{n.n}</div>
                  <div className="md:col-span-3">
                    <div className="font-display text-2xl">{n.title}</div>
                  </div>
                  <div className="md:col-span-8">
                    <p className="font-body text-sm md:text-base opacity-85 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
