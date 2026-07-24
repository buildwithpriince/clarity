import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ChapterProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    axios.get(`${API}/profiles`).then((r) => setProfiles(r.data.profiles || []));
  }, []);

  if (!profiles.length) {
    return (
      <section id="profiles" data-testid="chapter-profiles">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="chapter-marker reveal">
            <span className="num">Chapter 02</span>
            <span className="desc">— The Portrait</span>
          </div>
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-5 reveal delay-1">
              <h2 className="font-display leading-none mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                Six <span className="italic-emerald">composites</span>.<br/>
                Not files. <br/>
                Lives.
              </h2>
              <p className="font-body max-w-md opacity-80">
                Loading portraits…
              </p>
            </div>
            <div className="md:col-span-7 reveal delay-2">
              <div className="fig-caption mb-4">Fig. 02 — Loading</div>
              <div className="preview-panel" style={{ minHeight: 520 }} data-testid="chapter-profiles-loading" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const p = profiles[i];

  return (
    <section id="profiles" data-testid="chapter-profiles">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="chapter-marker reveal">
          <span className="num">Chapter 02</span>
          <span className="desc">— The Portrait</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5 reveal delay-1">
            <h2 className="font-display leading-none mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              Six <span className="italic-emerald">composites</span>.<br/>
              Not files. <br/>
              Lives.
            </h2>
            <p className="font-body max-w-md opacity-80">
              Every score here comes from a portrait built out of real behavioral signals — recharges, remittances, rent — from users who don&apos;t yet exist in any bureau file. Names and images are composites.
            </p>
          </div>

          <div className="md:col-span-7 reveal delay-2">
            <div className="fig-caption mb-4">Fig. 0{String(i + 2).padStart(1, '')} — {p.label}</div>
            <div className="preview-panel" style={{ minHeight: 520 }}>
              <div className="grid md:grid-cols-5 gap-6 flex-1">
                <div className="md:col-span-2">
                  <div className="aspect-[4/5] overflow-hidden" style={{ background: 'var(--hairline-light)' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      style={{ filter: 'grayscale(15%) contrast(1.03)' }}
                      data-testid="profile-image"
                    />
                  </div>
                </div>
                <div className="md:col-span-3 flex flex-col justify-between">
                  <div>
                    <div className="eyebrow mb-3" style={{color: 'var(--emerald-bright)'}}>{p.label}</div>
                    <div className="font-display text-6xl leading-none mb-1" data-testid="profile-score">{p.score}</div>
                    <div className="font-mono text-[11px] opacity-60 mb-8">/ 900</div>
                    <div className="font-display text-3xl mb-1" data-testid="profile-name">{p.name}</div>
                    <div className="font-mono text-[11px] opacity-70">
                      {p.occupation} · {p.age} · {p.location}
                    </div>
                  </div>
                  <p className="font-body text-sm md:text-base opacity-90 mt-8 leading-relaxed">
                    &ldquo;{p.story}&rdquo;
                  </p>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-6 pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--hairline-light)' }}>
                <span className="font-mono text-[11px] opacity-70" data-testid="profile-counter">
                  {String(i + 1).padStart(2, '0')} / {String(profiles.length).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  <button
                    className="pill-btn ghost"
                    onClick={() => setI((i - 1 + profiles.length) % profiles.length)}
                    data-testid="profile-prev"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    className="pill-btn"
                    onClick={() => setI((i + 1) % profiles.length)}
                    data-testid="profile-next"
                    aria-label="Next"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
