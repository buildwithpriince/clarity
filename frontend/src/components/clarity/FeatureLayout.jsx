import { Link, useNavigate } from "react-router-dom";

export default function FeatureLayout({
  chapterNum,
  category,
  title,
  tagline,
  children,
  admin = false,
}) {
  const nav = useNavigate();
  return (
    <div
      className={`min-h-screen ${admin ? "dark-section" : "bg-bone text-ink"}`}
      data-testid={`feature-page-${admin ? "admin-" : ""}${chapterNum}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="flex items-baseline justify-between mb-8">
          <button
            onClick={() => nav(-1)}
            className="nav-link"
            data-testid="feature-back-btn"
          >
            ← Back
          </button>
          <Link to="/" className="nav-link" data-testid="feature-home-link">
            <span className="emerald-dot mr-2" />
            clarity<span style={{ color: "var(--emerald-bright)" }}>.</span>
          </Link>
        </div>

        <div className="chapter-marker flex items-baseline gap-4">
          <span className="num">Chapter {chapterNum}</span>
          <span className="desc">— {category?.toUpperCase()}</span>
          {admin && (
            <span
              className="ml-auto eyebrow px-2 py-1"
              style={{ color: "var(--emerald-bright)", border: "1px solid var(--emerald-bright)" }}
              data-testid="admin-badge"
            >
              Internal
            </span>
          )}
        </div>

        <h1
          className="font-display leading-none mb-6"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          data-testid="feature-title"
        >
          {title}
        </h1>
        {tagline && (
          <p className="font-body max-w-2xl opacity-80 mb-12 md:mb-16" data-testid="feature-tagline">
            {tagline}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

export function TwoCol({ left, right }) {
  return (
    <div className="grid md:grid-cols-12 gap-10 md:gap-16">
      <div className="md:col-span-6">{left}</div>
      <div className="md:col-span-6">{right}</div>
    </div>
  );
}

export function FigPanel({ caption, children, minHeight = 400 }) {
  return (
    <div>
      <div className="fig-caption mb-4">{caption}</div>
      <div className="preview-panel" style={{ minHeight }}>
        {children}
      </div>
    </div>
  );
}
