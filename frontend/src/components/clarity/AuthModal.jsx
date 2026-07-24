import { useState } from "react";
import { X } from "lucide-react";

export default function AuthModal({ open, onClose, onSignIn }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    onSignIn(name || email || "you");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15, 23, 18, 0.55)" }}
      data-testid="auth-modal"
    >
      <div
        className="relative w-full max-w-md bg-bone text-ink"
        style={{ border: "1px solid var(--hairline-light)" }}
      >
        <button
          className="absolute top-4 right-4 p-1 hover:opacity-60 transition"
          onClick={onClose}
          data-testid="auth-close"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="p-8 md:p-10">
          <div className="eyebrow mb-4" style={{ color: 'var(--emerald-bright)' }}>
            {mode === "signin" ? "welcome back" : "join clarity"}
          </div>
          <h2 className="font-display text-4xl leading-none mb-6">
            {mode === "signin" ? (
              <>Come <span className="italic-emerald">back</span> in.</>
            ) : (
              <>Begin <span className="italic-emerald">quietly</span>.</>
            )}
          </h2>

          <form onSubmit={submit} className="grid gap-4">
            {mode === "signup" && (
              <div>
                <label className="eyebrow block mb-2 opacity-70">Name</label>
                <input
                  data-testid="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b outline-none pb-2 font-display text-xl"
                  style={{ borderColor: 'var(--hairline-light)' }}
                />
              </div>
            )}
            <div>
              <label className="eyebrow block mb-2 opacity-70">Email</label>
              <input
                type="email"
                data-testid="auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b outline-none pb-2 font-display text-xl"
                style={{ borderColor: 'var(--hairline-light)' }}
              />
            </div>
            <div>
              <label className="eyebrow block mb-2 opacity-70">Password</label>
              <input
                type="password"
                data-testid="auth-password"
                className="w-full bg-transparent border-b outline-none pb-2 font-display text-xl"
                style={{ borderColor: 'var(--hairline-light)' }}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                className="nav-link"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                data-testid="auth-toggle-mode"
              >
                {mode === "signin" ? "Create account" : "Have an account? Sign in"}
              </button>
              <button type="submit" className="pill-btn" data-testid="auth-submit">
                {mode === "signin" ? "Sign in →" : "Sign up →"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--hairline-light)' }}>
            <button
              className="nav-link"
              onClick={() => onSignIn("guest")}
              data-testid="auth-guest"
            >
              Continue as guest →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
