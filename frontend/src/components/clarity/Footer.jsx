export default function Footer() {
  const now = new Date();
  return (
    <footer className="dark-section" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-6">
        {/* Colophon rows */}
        <div className="grid md:grid-cols-12 gap-8 pb-16 border-b" style={{ borderColor: 'var(--hairline-dark)' }}>
          <div className="md:col-span-4">
            <div className="eyebrow mb-3 opacity-70">Colophon</div>
            <p className="font-body text-sm opacity-80 max-w-xs leading-relaxed">
              Set in Fraunces and IBM Plex Mono. Bone paper. Ink. A single emerald dot, held quiet.
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="eyebrow mb-3 opacity-70">Chapters</div>
            <ul className="grid gap-2">
              {[
                ["00", "Hero ", "hero"],
                ["01", "The Fog", "score"],
                ["02", "The Portrait", "profiles"],
                ["03", "The Compass", "invest"],
                ["04", "The Disclosures", "disclosures"],
              ].map(([n, t, id]) => (
                <li key={id}>
                  <button
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="nav-link"
                    data-testid={`footer-link-${id}`}
                  >
                    ({n}) {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="eyebrow mb-3 opacity-70">Prototype</div>
            <ul className="grid gap-2">
              <li className="font-mono text-[11px] opacity-80">Model — Weighted-factor + decision-path</li>
              <li className="font-mono text-[11px] opacity-80">Data — Synthetic, non-personal</li>
              <li className="font-mono text-[11px] opacity-80">Advisor — Not SEBI-registered</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="eyebrow mb-3 opacity-70">Contact</div>
            <ul className="grid gap-2">
              <li className="font-mono text-[11px] opacity-80">hello@clarity.in</li>
              <li className="font-mono text-[11px] opacity-80">Bengaluru · New Delhi</li>
            </ul>
          </div>
        </div>

        {/* Enormous wordmark */}
        <div className="pt-16 pb-6 select-none cursor-default text-center">
          <div className="wordmark leading-none inline-block" data-testid="colophon-wordmark">
            clarity<span className="dot">.</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 pt-6 border-t" style={{ borderColor: 'var(--hairline-dark)' }}>
          <div className="font-mono text-[10px] opacity-60">
            © {now.getFullYear()} Clarity Labs · Prototype for financially underserved India
          </div>
          <div className="font-mono text-[10px] opacity-60">
            v0.1 · edition 00
          </div>
        </div>
      </div>
    </footer>
  );
}
