import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Simplified header per spec:
// Left  : hamburger only
// Center: enlarged Fraunces "clarity." wordmark
// Right : Sign in / Signed in · Begin (home only)
// Sticky at all scroll positions.
export default function Header({ onOpenAuth, signedIn, onOpenDrawer }) {
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const isHome = loc.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id) => {
    if (!isHome) {
      nav("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goHome = () => {
    if (!isHome) nav("/");
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 w-full transition-colors duration-500 ${
        scrolled ? "bg-bone/95 backdrop-blur-sm" : "bg-bone"
      }`}
      style={{ borderBottom: "1px solid var(--hairline-light)" }}
      data-testid="site-header"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-24 grid grid-cols-3 items-center">
        {/* Left */}
        <div className="flex items-center justify-start">
          <button
            className="p-1 -ml-1 hover:opacity-70 transition"
            onClick={onOpenDrawer}
            aria-label="Menu"
            data-testid="menu-toggle"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Center — enlarged wordmark */}
        <div className="flex items-center justify-center">
          <button
            onClick={goHome}
            className="flex items-baseline hover:opacity-80 transition"
            data-testid="header-wordmark"
            aria-label="Home"
          >
            <span
              className="font-display"
              style={{
                fontSize: "clamp(2.15rem, 4.2vw, 3.4rem)",
                letterSpacing: "-0.035em",
                fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 420',
                lineHeight: 1,
              }}
            >
              clarity<span style={{ color: "var(--emerald-bright)" }}>.</span>
            </span>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-4">
          <button
            className="nav-link hidden sm:block"
            onClick={onOpenAuth}
            data-testid="header-sign-in"
          >
            {signedIn ? "Signed in" : "Sign in"}
          </button>
          {isHome && (
            <button
              className="pill-btn"
              onClick={() => jump("score")}
              data-testid="header-begin-btn"
            >
              Begin <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
