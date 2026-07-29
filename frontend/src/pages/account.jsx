import { useState, useMemo, useEffect } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const EMERALD = ["#2F8F5B", "#1F4D3D", "rgba(47,143,91,0.55)", "rgba(31,77,61,0.4)", "rgba(47,143,91,0.25)"];

// ------------------ NET WORTH OVERVIEW ------------------
export function NetWorthPage() {
  const [assets, setAssets] = useState({ Savings: 48000, "Gold": 25000, "Livestock": 40000, "Fixed Deposit": 60000 });
  const [liabs, setLiabs] = useState({ "Gold loan": 15000, "Kirana credit": 8000 });
  const totalA = Object.values(assets).reduce((a, b) => a + b, 0);
  const totalL = Object.values(liabs).reduce((a, b) => a + b, 0);
  const net = totalA - totalL;
  const chart = [...Object.entries(assets).map(([k, v]) => ({ name: k, value: v })), ...Object.entries(liabs).map(([k, v]) => ({ name: k, value: -v }))];

  return (
    <FeatureLayout chapterNum="06" category="Account & Dashboard" title="Net worth overview." tagline="Everything you own, minus everything you owe. Edit the numbers — the total moves with them.">
      <TwoCol
        left={
          <div>
            <EditableList title="Assets" data={assets} setData={setAssets} testid="assets" />
            <div className="mt-8" />
            <EditableList title="Liabilities" data={liabs} setData={setLiabs} testid="liabs" />
          </div>
        }
        right={
          <FigPanel caption="Fig. 06a — Net position">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Net worth</div>
              <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="net-worth-total">{fmtInr(net)}</div>
              <div className="font-mono text-[11px] opacity-60 mb-6">Assets {fmtInr(totalA)} − Liabilities {fmtInr(totalL)}</div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chart.map(d => ({ ...d, value: Math.abs(d.value) }))} innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                      {chart.map((_, i) => <Cell key={i} fill={EMERALD[i % EMERALD.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} formatter={(v) => fmtInr(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

function EditableRow({ k, v, data, setData, testid }) {
  const [text, setText] = useState(String(v));

  useEffect(() => {
    setText(String(v));
  }, [v]);

  const handleChange = (e) => {
    // Strip anything that isn't a digit, so there's no native
    // number-input behavior to fight with at all.
    const digitsOnly = e.target.value.replace(/[^\d]/g, "");
    // Drop leading zeros as the user types (but allow a single "0").
    const cleaned = digitsOnly.replace(/^0+(?=\d)/, "");
    setText(cleaned);
  };

  const commit = () => {
    const parsed = Number(text);
    const next = text.trim() === "" || Number.isNaN(parsed) ? 0 : parsed;
    setText(String(next));
    setData({ ...data, [k]: next });
  };

  return (
    <div className="flex items-baseline gap-3 py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
      <span className="font-display text-lg flex-1">{k}</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
        className="editorial-input w-32 text-right"
        style={{ fontSize: "1.25rem" }}
        data-testid={`${testid}-${k}`}
      />
      <button onClick={() => { const c = { ...data }; delete c[k]; setData(c); }} className="nav-link">✕</button>
    </div>
  );
}

function EditableList({ title, data, setData, testid }) {
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");
  return (
    <div>
      <div className="eyebrow mb-3">{title}</div>
      {Object.entries(data).map(([k, v]) => (
        <EditableRow key={k} k={k} v={v} data={data} setData={setData} testid={testid} />
      ))}
      <div className="flex items-baseline gap-3 pt-3">
        <input placeholder="Add row…" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="editorial-input flex-1" style={{ fontSize: "1rem" }} />
        <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="₹" value={newVal} onChange={(e) => setNewVal(e.target.value.replace(/\D/g, ""))} className="editorial-input w-32 text-right" style={{ fontSize: "1rem" }} />
        <button className="nav-link" onClick={() => { if (newKey && newVal) { setData({ ...data, [newKey]: Number(newVal) }); setNewKey(""); setNewVal(""); } }} data-testid={`${testid}-add`}>+ Add</button>
      </div>
    </div>
  );
}

// ------------------ TRANSACTION HISTORY ------------------
const TX = [
  { d: "2026-02-20", cat: "Grocery", merchant: "Rathi Kirana", amount: -1240 },
  { d: "2026-02-19", cat: "Salary", merchant: "Rekha Textiles Pvt", amount: 26000 },
  { d: "2026-02-18", cat: "Utilities", merchant: "MP Electricity Board", amount: -820 },
  { d: "2026-02-17", cat: "Transfer", merchant: "Ashok (brother)", amount: -3000 },
  { d: "2026-02-15", cat: "Mobile", merchant: "Jio recharge", amount: -299 },
  { d: "2026-02-14", cat: "Grocery", merchant: "Amul Milk Booth", amount: -560 },
  { d: "2026-02-12", cat: "Transport", merchant: "Auto — Rana Pratap Chowk", amount: -140 },
  { d: "2026-02-10", cat: "Rent", merchant: "Owner (K. Sharma)", amount: -8000 },
  { d: "2026-02-08", cat: "Grocery", merchant: "Reliance Fresh", amount: -1685 },
  { d: "2026-02-05", cat: "Fuel", merchant: "HP Petrol Pump", amount: -450 },
  { d: "2026-02-02", cat: "Salary", merchant: "Freelance UPI", amount: 4200 },
  { d: "2026-01-28", cat: "Grocery", merchant: "Rathi Kirana", amount: -1120 },
];
export function TransactionsPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(TX.map((t) => t.cat)))];
  const rows = TX.filter((t) => filter === "All" || t.cat === filter);
  return (
    <FeatureLayout chapterNum="06" category="Account & Dashboard" title="Transaction history." tagline="A quiet ledger of the last month — filter by category, watch the totals settle.">
      <div className="flex gap-2 mb-8 flex-wrap" data-testid="tx-filters">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`pill-btn ${filter === c ? "" : "ghost"}`} data-testid={`tx-filter-${c}`}>{c}</button>
        ))}
      </div>
      <div className="border-t" style={{ borderColor: "var(--hairline-light)" }}>
        {rows.map((t, i) => (
          <div key={i} className="grid grid-cols-12 items-baseline py-3 border-b gap-4" style={{ borderColor: "var(--hairline-light)" }}>
            <span className="font-mono text-[11px] opacity-60 col-span-2">{t.d}</span>
            <span className="eyebrow col-span-2 opacity-70">{t.cat}</span>
            <span className="font-display text-lg col-span-5">{t.merchant}</span>
            <span className={`font-display text-lg col-span-3 text-right`} style={{ color: t.amount > 0 ? "var(--emerald-bright)" : "inherit" }}>
              {t.amount > 0 ? "+" : ""}{fmtInr(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </FeatureLayout>
  );
}

// ------------------ SPENDING BREAKDOWN ------------------
export function SpendingPage() {
  const buckets = useMemo(() => {
    const map = {};
    TX.filter((t) => t.amount < 0).forEach((t) => { map[t.cat] = (map[t.cat] || 0) + Math.abs(t.amount); });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, []);
  const total = buckets.reduce((a, b) => a + b.value, 0);
  return (
    <FeatureLayout chapterNum="06" category="Account & Dashboard" title="Spending breakdown." tagline="Every rupee sorted by category. Read where it actually goes, not where you think it goes.">
      <TwoCol
        left={
          <div data-testid="spend-list">
            {buckets.map((b, i) => (
              <div key={b.name} className="mb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-display text-lg">{b.name}</span>
                  <span className="font-mono text-[11px]">{fmtInr(b.value)} · {Math.round((b.value / total) * 100)}%</span>
                </div>
                <div className="relative h-[3px]" style={{ background: "var(--hairline-light)" }}>
                  <div className="absolute h-[3px]" style={{ width: `${(b.value / total) * 100}%`, background: EMERALD[i % EMERALD.length] }} />
                </div>
              </div>
            ))}
          </div>
        }
        right={
          <FigPanel caption="Fig. 06c — Category slice">
            <div style={{ height: 320, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={buckets} innerRadius={70} outerRadius={110} dataKey="value" paddingAngle={2}>
                    {buckets.map((_, i) => <Cell key={i} fill={EMERALD[i % EMERALD.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} formatter={(v) => fmtInr(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ FINANCIAL DIGEST ------------------
export function DigestPage() {
  const inflow = TX.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const outflow = TX.filter((t) => t.amount < 0).reduce((a, b) => a - b.amount, 0);
  return (
    <FeatureLayout chapterNum="06" category="Account & Dashboard" title="Financial summary digest." tagline="Your month, condensed to a single card. Written the way a good letter is — plain and generous.">
      <div className="preview-panel" style={{ minHeight: 480, maxWidth: 720 }} data-testid="digest-card">
        <div className="w-full">
          <div className="eyebrow opacity-60 mb-3">Digest · February 2026</div>
          <h2 className="font-display text-4xl leading-tight mb-8">
            You earned <span style={{ color: "var(--emerald-bright)" }}>{fmtInr(inflow)}</span> and spent <span>{fmtInr(outflow)}</span> — a surplus of <em className="italic-emerald">{fmtInr(inflow - outflow)}</em>.
          </h2>
          <p className="font-body opacity-80 leading-relaxed mb-6">
            Grocery is the largest slice this month, followed by rent. Your salary landed on the 19th as usual, and you sent ₹3,000 to Ashok on the 17th — a familiar rhythm.
          </p>
          <p className="font-body opacity-80 leading-relaxed">
            Your credit signal ticks up quietly this month: utility and rent both paid on time, mobile recharge on schedule.
          </p>
        </div>
      </div>
    </FeatureLayout>
  );
}

function BudgetRow({ k, v, budget, setBudget, actual }) {
  const [text, setText] = useState(String(v));

  useEffect(() => {
    setText(String(v));
  }, [v]);

  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/[^\d]/g, "");
    const cleaned = digitsOnly.replace(/^0+(?=\d)/, "");
    setText(cleaned);
  };

  const commit = () => {
    const parsed = Number(text);
    const next = text.trim() === "" || Number.isNaN(parsed) ? 0 : parsed;
    setText(String(next));
    setBudget({ ...budget, [k]: next });
  };

  return (
    <div className="flex items-baseline gap-3 py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
      <span className="font-display text-lg flex-1">{k}</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
        className="editorial-input w-32 text-right"
        style={{ fontSize: "1.2rem" }}
        data-testid={`budget-${k}`}
      />
      <span className="font-mono text-[11px] opacity-70 w-24 text-right">actual {fmtInr(actual)}</span>
    </div>
  );
}

// ------------------ BUDGET VS ACTUAL ------------------
export function BudgetPage() {
  const [budget, setBudget] = useState({ Grocery: 5000, Rent: 8000, Utilities: 1000, Mobile: 500, Transport: 800, Fuel: 1000 });
  const actual = useMemo(() => {
    const m = {};
    TX.filter((t) => t.amount < 0).forEach((t) => { m[t.cat] = (m[t.cat] || 0) + Math.abs(t.amount); });
    return m;
  }, []);
  const data = Object.keys(budget).map((k) => ({ name: k, budget: budget[k], actual: actual[k] || 0 }));
  return (
    <FeatureLayout chapterNum="06" category="Account & Dashboard" title="Budget vs actual." tagline="What you said. What actually happened. The gap is where the plan needs to breathe.">
      <TwoCol
        left={
          <div data-testid="budget-form">
            {Object.entries(budget).map(([k, v]) => (
              <BudgetRow key={k} k={k} v={v} budget={budget} setBudget={setBudget} actual={actual[k] || 0} />
            ))}
          </div>
        }
        right={
          <FigPanel caption="Fig. 06e — Comparison">
            <div style={{ height: 340, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <CartesianGrid stroke="rgba(27,38,32,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
                  <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} formatter={(v) => fmtInr(v)} />
                  <Bar dataKey="budget" fill="rgba(31,77,61,0.35)" />
                  <Bar dataKey="actual" fill="#2F8F5B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}
