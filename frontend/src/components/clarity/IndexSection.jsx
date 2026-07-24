import { useNavigate, useLocation } from "react-router-dom";
import { CATEGORIES, ADMIN, HOME_CHAPTERS } from "@/pages/registry";

// Editorial-style "Index" section — a full table of contents printed at the
// end of every page. Chapters 00-04 scroll into place on Home; categories
// 05-16 navigate to individual routes.
export default function IndexSection() {
  const nav = useNavigate();
  const loc = useLocation();
  const isHome = loc.pathname === "/";

  const jumpHome = (id) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      nav("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 200);
    }
  };

  return (
    <section
      className="dark-section"
      data-testid="index-section"
      style={{ borderTop: "1px solid var(--hairline-dark)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="chapter-marker">
          <span className="num">Index</span>
          <span className="desc" style={{ color: "var(--bone)" }}>— THE FULL CONTENTS</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-16">
          <div className="md:col-span-4">
            <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Everything, in <span className="italic-emerald">one</span> place.
            </h2>
            <p className="font-body opacity-80 mt-6 max-w-sm">
              A quiet table of contents. Chapters 00–04 are the narrative; 05 onward is the working product.
            </p>
          </div>

          <div className="md:col-span-8">
            {/* Home chapters — jump within page */}
            <div className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--hairline-dark)" }}>
              <div className="eyebrow opacity-60 mb-4">Home · The narrative</div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {HOME_CHAPTERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => jumpHome(c.id)}
                    className="text-left py-2 hover:opacity-100 opacity-80 transition group flex items-baseline gap-3"
                    data-testid={`index-home-${c.id}`}
                  >
                    <span className="font-mono text-[10px] opacity-50 w-6">{c.num}</span>
                    <span className="font-display text-lg group-hover:text-[color:var(--emerald-bright)] transition-colors">{c.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories 05-15 */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} data-testid={`index-cat-${cat.key}`}>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-mono text-[10px] opacity-50">{cat.num}</span>
                    <h3 className="font-display text-xl">{cat.title}</h3>
                  </div>
                  <ul className="grid gap-1 pl-8">
                    {cat.items.map((it) => (
                      <li key={it.slug}>
                        <button
                          onClick={() => nav(it.path)}
                          className="text-left w-full py-1 opacity-75 hover:opacity-100 transition group flex items-baseline gap-2"
                          data-testid={`index-item-${cat.key}-${it.slug}`}
                        >
                          <span className="opacity-50 group-hover:opacity-100 group-hover:text-[color:var(--emerald-bright)] transition-colors">·</span>
                          <span className="font-body text-sm group-hover:text-[color:var(--emerald-bright)] transition-colors">
                            {it.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Admin — visually distinct */}
            <div
              className="mt-12 pt-8"
              style={{ borderTop: "1px solid var(--hairline-dark)" }}
              data-testid="index-admin"
            >
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] opacity-50">{ADMIN.num}</span>
                  <h3 className="font-display text-xl">{ADMIN.title}</h3>
                </div>
                <span
                  className="eyebrow px-2 py-1"
                  style={{ color: "var(--emerald-bright)", border: "1px solid var(--emerald-bright)" }}
                >
                  Internal
                </span>
              </div>
              <ul className="grid gap-1 pl-8">
                {ADMIN.items.map((it) => (
                  <li key={it.slug}>
                    <button
                      onClick={() => nav(it.path)}
                      className="text-left w-full py-1 opacity-75 hover:opacity-100 transition group flex items-baseline gap-2"
                      data-testid={`index-item-${ADMIN.key}-${it.slug}`}
                    >
                      <span className="opacity-50 group-hover:opacity-100 group-hover:text-[color:var(--emerald-bright)] transition-colors">·</span>
                      <span className="font-body text-sm group-hover:text-[color:var(--emerald-bright)] transition-colors">
                        {it.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
