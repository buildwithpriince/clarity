import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

// Small floating "Index" pill fixed to the bottom-right, appears after scrolling past hero.
export default function FloatingIndex({ onOpen }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > Math.max(300, window.innerHeight * 0.7));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={onOpen}
      className="fixed z-30 bottom-6 right-6 md:bottom-8 md:right-8 pill-btn"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        background: "var(--emerald)",
        color: "var(--bone)",
        boxShadow: "0 8px 32px rgba(15, 23, 18, 0.35)",
        padding: "0.7rem 1.3rem",
      }}
      aria-label="Open index"
      data-testid="floating-index"
    >
      <Menu size={14} />
      <span className="italic-emerald" style={{ color: "var(--bone)", fontStyle: "italic", fontFamily: "Fraunces, serif", letterSpacing: 0, textTransform: "none", fontSize: "1.05rem" }}>Index</span>
    </button>
  );
}
