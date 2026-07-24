import { useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { toast } from "sonner";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// ------------------ P2P ------------------
export function P2PPage() {
  const [contact, setContact] = useState("");
  const [amt, setAmt] = useState("");
  const [sent, setSent] = useState([]);
  const send = () => {
    if (!contact || !amt) return;
    setSent([{ contact, amt, ts: new Date().toLocaleTimeString() }, ...sent]);
    toast.success(`Sent ${fmtInr(+amt)} to ${contact}`);
    setContact(""); setAmt("");
  };
  return (
    <FeatureLayout chapterNum="09" category="Payments & Transfers" title="P2P transfers." tagline="Send money to a name or number. Prototype records the intent; no rupees move.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">To</div>
            <input placeholder="Name or UPI ID" value={contact} onChange={(e) => setContact(e.target.value)} className="editorial-input mb-6" style={{ fontSize: "1.6rem" }} data-testid="p2p-contact" />
            <div className="eyebrow opacity-60 mb-2">Amount</div>
            <div className="flex items-baseline gap-2 mb-6"><span className="font-display text-3xl opacity-60">₹</span><input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} className="editorial-input" data-testid="p2p-amt" /></div>
            <button className="pill-btn" onClick={send} data-testid="p2p-send">Send →</button>
          </div>
        }
        right={
          <FigPanel caption="Fig. 09a — Recent sends">
            {sent.length === 0 ? <div className="eyebrow opacity-50">No transfers yet</div> :
              <div className="w-full">
                {sent.map((s, i) => (
                  <div key={i} className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                    <span className="font-mono text-[10px] opacity-60">{s.ts}</span>
                    <span className="font-display text-base flex-1 ml-3">{s.contact}</span>
                    <span className="font-display text-lg" style={{ color: "var(--emerald-bright)" }}>{fmtInr(+s.amt)}</span>
                  </div>
                ))}
              </div>
            }
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ BILL PAYMENTS ------------------
const BILLS = [
  { id: 1, name: "MP Electricity Board", amt: 823, due: "Feb 25" },
  { id: 2, name: "Jio Recharge", amt: 299, due: "Feb 28" },
  { id: 3, name: "Aarti's Tuition", amt: 1200, due: "Mar 05" },
  { id: 4, name: "LPG Cylinder", amt: 895, due: "Mar 10" },
];
export function BillsPage() {
  const [paid, setPaid] = useState([]);
  const total = BILLS.filter((b) => !paid.includes(b.id)).reduce((a, b) => a + b.amt, 0);
  return (
    <FeatureLayout chapterNum="09" category="Payments & Transfers" title="Bill payments." tagline="Bills queue up in one place. Pay them, ignore them, defer them — the choice is quiet.">
      <TwoCol
        left={
          <div data-testid="bills-list">
            {BILLS.map((b) => {
              const done = paid.includes(b.id);
              return (
                <div key={b.id} className="flex items-baseline gap-4 py-4 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <div className="flex-1">
                    <div className="font-display text-lg" style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.5 : 1 }}>{b.name}</div>
                    <div className="font-mono text-[11px] opacity-60">due {b.due}</div>
                  </div>
                  <span className="font-display text-xl" style={{ opacity: done ? 0.4 : 1 }}>{fmtInr(b.amt)}</span>
                  <button className={`pill-btn ${done ? "ghost" : ""}`} onClick={() => setPaid(done ? paid.filter(x => x !== b.id) : [...paid, b.id])} data-testid={`bill-${b.id}`}>{done ? "Undo" : "Pay"}</button>
                </div>
              );
            })}
          </div>
        }
        right={
          <FigPanel caption="Fig. 09b — Balance owed">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Outstanding</div>
              <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="bills-total">{fmtInr(total)}</div>
              <div className="font-mono text-[11px] opacity-60 mb-8">{BILLS.length - paid.length} of {BILLS.length} bills pending</div>
              <p className="font-body opacity-80">Auto-pay would clear these on their due dates. Manual keeps you in the loop.</p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ SPLIT EXPENSES ------------------
export function SplitPage() {
  const [total, setTotal] = useState(1200);
  const [people, setPeople] = useState(["You", "Amit", "Rekha", "Devi"]);
  const [newP, setNewP] = useState("");
  const share = Math.round(total / people.length);
  return (
    <FeatureLayout chapterNum="09" category="Payments & Transfers" title="Split expenses." tagline="A dinner, a taxi, a shared cylinder. Enter the total, add the people, we do the fractions.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">Total</div>
            <div className="flex items-baseline gap-2 mb-8"><span className="font-display text-3xl opacity-60">₹</span><input type="number" value={total} onChange={(e) => setTotal(+e.target.value)} className="editorial-input" data-testid="split-total" /></div>
            <div className="eyebrow opacity-60 mb-3">People ({people.length})</div>
            <div className="flex flex-wrap gap-2 mb-4" data-testid="split-people">
              {people.map((p, i) => (
                <span key={i} className="pill-btn ghost" style={{ padding: "0.4rem 0.9rem" }}>{p} <button className="ml-2 opacity-60" onClick={() => setPeople(people.filter((_, k) => k !== i))}>✕</button></span>
              ))}
            </div>
            <div className="flex gap-2">
              <input placeholder="Add name" value={newP} onChange={(e) => setNewP(e.target.value)} className="editorial-input" style={{ fontSize: "1.2rem" }} data-testid="split-add-input" />
              <button className="nav-link" onClick={() => { if (newP) { setPeople([...people, newP]); setNewP(""); } }} data-testid="split-add">+ Add</button>
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 09c — Each pays">
            <div className="w-full">
              <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "var(--emerald-bright)" }} data-testid="split-each">{fmtInr(share)}</div>
              <div className="eyebrow opacity-60 mb-8">/ person, across {people.length}</div>
              {people.map((p, i) => (
                <div key={i} className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-display text-base">{p}</span>
                  <span className="font-mono text-[11px]">{fmtInr(share)}</span>
                </div>
              ))}
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ SCHEDULED ------------------
const SCHED_INIT = [
  { id: 1, name: "Rent to K. Sharma", amt: 8000, freq: "monthly", next: "Mar 01" },
  { id: 2, name: "SIP — Balanced fund", amt: 5000, freq: "monthly", next: "Mar 05" },
  { id: 3, name: "LIC premium", amt: 1420, freq: "quarterly", next: "Apr 15" },
];
export function ScheduledPage() {
  const [list, setList] = useState(SCHED_INIT);
  return (
    <FeatureLayout chapterNum="09" category="Payments & Transfers" title="Scheduled payments." tagline="Every recurring outflow, laid out. Turn any of them off with one tap.">
      <div className="border-t" style={{ borderColor: "var(--hairline-light)" }} data-testid="sched-list">
        {list.map((s) => (
          <div key={s.id} className="grid grid-cols-12 items-baseline py-4 border-b gap-4" style={{ borderColor: "var(--hairline-light)" }}>
            <span className="font-mono text-[10px] opacity-60 col-span-2">{s.freq}</span>
            <span className="font-display text-lg col-span-5">{s.name}</span>
            <span className="font-mono text-[11px] opacity-70 col-span-2">next {s.next}</span>
            <span className="font-display text-lg col-span-2 text-right">{fmtInr(s.amt)}</span>
            <button className="nav-link col-span-1 text-right" onClick={() => setList(list.filter((x) => x.id !== s.id))} data-testid={`sched-${s.id}`}>Stop</button>
          </div>
        ))}
      </div>
      {list.length === 0 && <div className="mt-6 eyebrow opacity-60">All scheduled payments cleared.</div>}
    </FeatureLayout>
  );
}

// ------------------ REMINDERS ------------------
const REM = [
  { id: 1, label: "Electricity bill", when: "Feb 25", on: true },
  { id: 2, label: "Jio recharge", when: "Feb 28", on: true },
  { id: 3, label: "Aarti's tuition", when: "Mar 05", on: false },
  { id: 4, label: "LIC premium", when: "Apr 15", on: true },
];
export function RemindersPage() {
  const [items, setItems] = useState(REM);
  return (
    <FeatureLayout chapterNum="09" category="Payments & Transfers" title="Payment reminders." tagline="A calm nudge, one day before. Set the ones you need; silence the rest.">
      <div className="grid gap-3" data-testid="rem-list">
        {items.map((r) => (
          <button key={r.id} onClick={() => setItems(items.map((x) => x.id === r.id ? { ...x, on: !x.on } : x))} className="text-left border py-4 px-5 transition flex items-baseline gap-4"
            style={{ borderColor: r.on ? "var(--emerald-bright)" : "var(--hairline-light)", background: r.on ? "rgba(47,143,91,0.05)" : "transparent" }}
            data-testid={`rem-${r.id}`}>
            <div className="w-5 h-5 rounded-full flex-none mt-1" style={{ background: r.on ? "var(--emerald-bright)" : "transparent", border: "1px solid " + (r.on ? "var(--emerald-bright)" : "var(--hairline-light)") }} />
            <div className="flex-1">
              <div className="font-display text-lg">{r.label}</div>
              <div className="font-mono text-[11px] opacity-60">One day before · {r.when}</div>
            </div>
            <span className="font-mono text-[10px] opacity-60">{r.on ? "ON" : "OFF"}</span>
          </button>
        ))}
      </div>
    </FeatureLayout>
  );
}
