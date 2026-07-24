import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { CATEGORIES, ADMIN, HOME_CHAPTERS } from "@/pages/registry";

export default function SideDrawer({ open, onClose, onOpenAuth }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [expanded, setExpanded] = useState(null); // one category open at a time

  // Auto-expand the category matching the current route
  useEffect(() => {
    if (!open) return;
    const match = [...CATEGORIES, ADMIN].find((c) =>
      c.items.some((it) => it.path === loc.pathname)
    );
    setExpanded(match?.key ?? null);
  }, [open, loc.pathname]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const go = (path) => {
    onClose();
    nav(path);
  };

  const goHome = (id) => {
    onClose();
    if (loc.pathname !== "/") {
      nav("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(15, 23, 18, 0.55)" }}
        onClick={onClose}
        data-testid="drawer-backdrop"
      />
      {/* Panel */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-[92vw] max-w-[380px] dark-section transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: open ? "10px 0 40px rgba(0,0,0,0.4)" : "none" }}
        data-testid="side-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "var(--hairline-dark)" }}>
            <div className="flex items-center gap-2">
              <span className="emerald-dot" />
              <span className="font-display text-xl">clarity<span style={{ color: "var(--emerald-bright)" }}>.</span></span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition"
              data-testid="drawer-close"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-6" data-testid="drawer-body">
            {/* Home chapters */}
            <div className="mb-6">
              <div className="eyebrow opacity-60 mb-3">Home</div>
              <div className="grid gap-2">
                {HOME_CHAPTERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => goHome(c.id)}
                    className="flex items-baseline gap-3 text-left hover:opacity-70 transition py-1"
                    data-testid={`drawer-home-${c.id}`}
                  >
                    <span className="font-mono text-[10px] opacity-50 w-6">{c.num}</span>
                    <span className="font-display text-lg">{c.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px my-4" style={{ background: "var(--hairline-dark)" }} />

            {/* Categories */}
            {CATEGORIES.map((cat) => (
              <CategoryGroup
                key={cat.key}
                cat={cat}
                expanded={expanded === cat.key}
                onToggle={() => setExpanded((v) => (v === cat.key ? null : cat.key))}
                onSelect={go}
                currentPath={loc.pathname}
              />
            ))}

            {/* Admin — visually distinct */}
            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: "var(--hairline-dark)" }}
              data-testid="drawer-admin-section"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="eyebrow" style={{ color: "var(--emerald-bright)" }}>Internal</span>
                <span className="font-mono text-[9px] opacity-50">restricted</span>
              </div>
              <CategoryGroup
                cat={ADMIN}
                expanded={expanded === ADMIN.key}
                onToggle={() => setExpanded((v) => (v === ADMIN.key ? null : ADMIN.key))}
                onSelect={go}
                currentPath={loc.pathname}
                admin
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: "var(--hairline-dark)" }}>
            <button className="nav-link" onClick={() => { onClose(); onOpenAuth(); }} data-testid="drawer-signin">
              Sign in
            </button>
            <span className="font-mono text-[10px] opacity-40">v0.1 · edition 00</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function CategoryGroup({ cat, expanded, onToggle, onSelect, currentPath, admin }) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-baseline gap-3 text-left py-3 hover:opacity-80 transition"
        data-testid={`drawer-cat-${cat.key}`}
      >
        <span className="font-mono text-[10px] opacity-50 w-6">{cat.num}</span>
        <span className="font-display text-lg flex-1">{cat.title}</span>
        <ChevronRight
          size={14}
          className="transition-transform"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", opacity: 0.5 }}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-9 pb-2 grid gap-1">
          {cat.items.map((it) => {
            const active = currentPath === it.path;
            return (
              <button
                key={it.slug}
                onClick={() => onSelect(it.path)}
                className={`text-left py-2 font-body text-sm transition ${
                  active ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
                style={{ color: active ? "var(--emerald-bright)" : "inherit" }}
                data-testid={`drawer-item-${cat.key}-${it.slug}`}
              >
                {admin ? <span className="opacity-50 mr-1">·</span> : null}
                {it.title}
                {active && <span className="ml-2 opacity-60">←</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
