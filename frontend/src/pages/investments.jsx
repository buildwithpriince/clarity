import { useMemo, useState } from "react";
import FeatureLayout, { TwoCol, FigPanel } from "@/components/clarity/FeatureLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const fmtInr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const EMERALD = ["#2F8F5B", "#1F4D3D", "rgba(47,143,91,0.55)", "rgba(31,77,61,0.4)"];

// ------------------ GOAL-BASED INVESTING ------------------
export function GoalsPage() {
  const [goals, setGoals] = useState([
    { name: "Daughter's school fees", target: 120000, months: 24, saved: 32000 },
    { name: "Two-wheeler", target: 80000, months: 18, saved: 12000 },
    { name: "Emergency fund", target: 60000, months: 12, saved: 21000 },
  ]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState(50000);
  const [months, setMonths] = useState(12);
  return (
    <FeatureLayout chapterNum="08" category="Investments" title="Goal-based investing." tagline="Name what you're saving for, and how long you have. The monthly commitment lands on its own.">
      <TwoCol
        left={
          <div>
            {goals.map((g, i) => {
              const monthly = (g.target - g.saved) / g.months;
              const pct = Math.min(100, (g.saved / g.target) * 100);
              return (
                <div key={i} className="mb-5 border-b pb-4" style={{ borderColor: "var(--hairline-light)" }} data-testid={`goal-${i}`}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-display text-xl">{g.name}</span>
                    <button className="nav-link" onClick={() => setGoals(goals.filter((_, k) => k !== i))}>Remove</button>
                  </div>
                  <div className="font-mono text-[11px] opacity-70 mb-2">{fmtInr(g.saved)} of {fmtInr(g.target)} · {g.months} months · save ~{fmtInr(monthly)}/mo</div>
                  <div className="relative h-[3px]" style={{ background: "var(--hairline-light)" }}>
                    <div className="absolute h-[3px]" style={{ width: `${pct}%`, background: "var(--emerald-bright)" }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-4">
              <input placeholder="New goal name" value={name} onChange={(e) => setName(e.target.value)} className="editorial-input mb-3" style={{ fontSize: "1.4rem" }} data-testid="goal-name" />
              <div className="flex gap-3 items-baseline mb-4">
                <span className="font-display text-lg opacity-60">₹</span>
                <input type="number" value={target} onChange={(e) => setTarget(+e.target.value)} className="editorial-input" style={{ fontSize: "1.4rem" }} data-testid="goal-target" />
                <input type="number" value={months} onChange={(e) => setMonths(+e.target.value)} className="editorial-input w-24" style={{ fontSize: "1.4rem" }} data-testid="goal-months" />
                <span className="font-display text-lg opacity-60">mo</span>
              </div>
              <button className="pill-btn" onClick={() => { if (name && target && months) { setGoals([...goals, { name, target, months, saved: 0 }]); setName(""); } }} data-testid="goal-add">+ Add goal</button>
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 08c — Combined monthly">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Total monthly commitment</div>
              <div className="font-display leading-none mb-6" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }} data-testid="goals-total">
                {fmtInr(goals.reduce((a, g) => a + (g.target - g.saved) / g.months, 0))}
              </div>
              {goals.map((g, i) => (
                <div key={i} className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-body text-sm">{g.name}</span>
                  <span className="font-mono text-[11px]">{fmtInr((g.target - g.saved) / g.months)} / mo</span>
                </div>
              ))}
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ PORTFOLIO ALLOCATION ------------------
export function PortfolioPage() {
  const [alloc, setAlloc] = useState({ Debt: 30, "Balanced Hybrid": 40, "Equity Index": 25, Gold: 5 });
  const total = Object.values(alloc).reduce((a, b) => a + b, 0);
  const data = Object.entries(alloc).map(([name, value]) => ({ name, value }));
  return (
    <FeatureLayout chapterNum="08" category="Investments" title="Portfolio allocation." tagline="Slide each asset to what you want it to be. The pie moves with you; the total stays honest.">
      <TwoCol
        left={
          <div data-testid="alloc-sliders">
            {Object.entries(alloc).map(([k, v]) => (
              <div key={k} className="mb-5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display text-lg">{k}</span>
                  <span className="font-mono text-[11px]">{v}%</span>
                </div>
                <input type="range" min={0} max={100} value={v} onChange={(e) => setAlloc({ ...alloc, [k]: +e.target.value })} className="w-full" data-testid={`alloc-${k}`} />
              </div>
            ))}
            <div className="mt-6 font-mono text-[11px] opacity-70">Sum {total}%{total !== 100 && ` — should be 100`}</div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 08d — Live pie">
            <div style={{ height: 340, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} innerRadius={70} outerRadius={120} paddingAngle={2} dataKey="value">
                    {data.map((_, i) => <Cell key={i} fill={EMERALD[i % EMERALD.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ GROWTH PROJECTIONS (light) ------------------
export function GrowthProjectionsPage() {
  const [scenarios] = useState([
    { name: "Conservative", rate: 8, color: "rgba(31,77,61,0.6)" },
    { name: "Balanced", rate: 11, color: "#2F8F5B" },
    { name: "Growth", rate: 14, color: "rgba(47,143,91,0.5)" },
  ]);
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(15);
  const data = useMemo(() => {
    const n = years;
    const out = [];
    for (let y = 0; y <= n; y++) {
      const row = { year: y };
      scenarios.forEach((s) => {
        const r = s.rate / 100 / 12;
        const m = y * 12;
        row[s.name] = m === 0 ? 0 : Math.round(monthly * (((1 + r) ** m - 1) / r) * (1 + r));
      });
      out.push(row);
    }
    return out;
  }, [monthly, years, scenarios]);
  return (
    <FeatureLayout chapterNum="08" category="Investments" title="Growth projections." tagline="Three plausible futures for the same monthly contribution — conservative, balanced, growth.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">Monthly amount</div>
            <div className="flex items-baseline gap-2 mb-6"><span className="font-display text-3xl opacity-60">₹</span><input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="editorial-input" data-testid="proj-monthly" /></div>
            <div className="eyebrow opacity-60 mb-2">Years</div>
            <div className="flex items-baseline gap-2"><input type="number" value={years} min={1} max={40} onChange={(e) => setYears(+e.target.value)} className="editorial-input" data-testid="proj-years" /><span className="font-display text-2xl opacity-60">years</span></div>
            <div className="mt-8 space-y-3">
              {scenarios.map((s) => (
                <div key={s.name} className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-display text-lg">{s.name} · {s.rate}%</span>
                  <span className="font-display text-xl" style={{ color: s.name === "Balanced" ? "var(--emerald-bright)" : "inherit" }}>{fmtInr(data[data.length - 1][s.name])}</span>
                </div>
              ))}
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 08e — Three futures">
            <div style={{ height: 380, width: "100%" }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid stroke="rgba(27,38,32,0.08)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <YAxis tickFormatter={(v) => v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${(v / 1000).toFixed(0)}k`} tick={{ fontFamily: "IBM Plex Mono", fontSize: 10 }} stroke="rgba(27,38,32,0.5)" />
                  <Tooltip contentStyle={{ background: "#F7F3E9", border: "1px solid rgba(27,38,32,0.25)", fontFamily: "IBM Plex Mono", fontSize: 11 }} formatter={(v) => fmtInr(v)} />
                  {scenarios.map((s) => <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={s.name === "Balanced" ? 2 : 1.2} dot={false} />)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ AUTO REBALANCING ------------------
export function RebalancePage() {
  const target = { Debt: 30, Equity: 55, Gold: 15 };
  const [current, setCurrent] = useState({ Debt: 24, Equity: 63, Gold: 13 });
  const [threshold, setThreshold] = useState(5);
  const drift = Object.keys(target).map((k) => ({ k, d: current[k] - target[k] }));
  const flagged = drift.filter((d) => Math.abs(d.d) >= threshold);
  return (
    <FeatureLayout chapterNum="08" category="Investments" title="Auto-rebalancing." tagline="Set a drift threshold. If any slice wanders further, we quietly nudge it back.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">Trigger threshold</div>
            <div className="flex items-baseline gap-3 mb-8">
              <input type="range" min={1} max={20} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="flex-1" data-testid="rebal-threshold" />
              <span className="font-display text-2xl">{threshold}%</span>
            </div>
            <div className="eyebrow opacity-60 mb-3">Current vs target</div>
            {Object.keys(target).map((k) => (
              <div key={k} className="mb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-display text-lg">{k}</span>
                  <span className="font-mono text-[11px]">{current[k]}% now · {target[k]}% target</span>
                </div>
                <input type="range" min={0} max={100} value={current[k]} onChange={(e) => setCurrent({ ...current, [k]: +e.target.value })} className="w-full" data-testid={`rebal-${k}`} />
              </div>
            ))}
          </div>
        }
        right={
          <FigPanel caption="Fig. 08f — Drift status">
            <div className="w-full">
              {flagged.length === 0 ? (
                <div>
                  <div className="font-display text-4xl mb-3" style={{ color: "var(--emerald-bright)" }} data-testid="rebal-status">All within tolerance.</div>
                  <p className="font-body opacity-80">No rebalancing action needed at the current threshold.</p>
                </div>
              ) : (
                <div>
                  <div className="font-display text-4xl mb-3" data-testid="rebal-status">Rebalance suggested.</div>
                  <p className="font-body opacity-80 mb-4">These slices drift beyond your {threshold}% threshold.</p>
                  {flagged.map((f) => (
                    <div key={f.k} className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                      <span className="font-display text-lg">{f.k}</span>
                      <span className="font-mono text-[11px]">{f.d > 0 ? "+" : ""}{f.d}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ WATCHLISTS ------------------
export function WatchlistsPage() {
  const [list, setList] = useState([
    { s: "NIFTYBEES", n: "Nippon India ETF Nifty 50 BeES", p: 234.5, d: +1.2 },
    { s: "GOLDBEES", n: "Nippon India ETF Gold BeES", p: 61.2, d: -0.3 },
    { s: "ITBEES", n: "Nippon India ETF IT BeES", p: 42.9, d: +2.1 },
    { s: "BHARAT-22", n: "Bharat 22 ETF", p: 108.4, d: +0.5 },
  ]);
  const [input, setInput] = useState("");
  return (
    <FeatureLayout chapterNum="08" category="Investments" title="Watchlists." tagline="A quiet corner for tickers you're following. Synthetic prices; real intent.">
      <TwoCol
        left={
          <div data-testid="watchlist">
            {list.map((r, i) => (
              <div key={r.s} className="flex items-baseline justify-between py-3 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                <div>
                  <div className="font-display text-lg">{r.s}</div>
                  <div className="font-mono text-[10px] opacity-60">{r.n}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg">₹{r.p}</div>
                  <div className="font-mono text-[11px]" style={{ color: r.d > 0 ? "var(--emerald-bright)" : "#a04d3f" }}>{r.d > 0 ? "+" : ""}{r.d}%</div>
                </div>
                <button className="nav-link ml-4" onClick={() => setList(list.filter((_, k) => k !== i))}>✕</button>
              </div>
            ))}
            <div className="flex items-baseline gap-3 pt-4">
              <input placeholder="Add ticker" value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} className="editorial-input" style={{ fontSize: "1.2rem" }} data-testid="watch-input" />
              <button className="nav-link" onClick={() => { if (input) { setList([...list, { s: input, n: "Synthetic entry", p: +(Math.random() * 500 + 20).toFixed(1), d: +((Math.random() - 0.5) * 4).toFixed(2) }]); setInput(""); } }} data-testid="watch-add">+ Add</button>
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 08g — Summary">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Watched</div>
              <div className="font-display leading-none mb-6" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--emerald-bright)" }}>{list.length}</div>
              <p className="font-body opacity-80">Watchlists never charge, never notify unless you ask. Just a place to keep an eye on things.</p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}

// ------------------ ROUND-UP INVESTING ------------------
const RU_TX = [
  { d: "Feb 20", m: "Kirana", amt: 62 }, { d: "Feb 20", m: "Chai stall", amt: 20 },
  { d: "Feb 19", m: "Auto ride", amt: 47 }, { d: "Feb 19", m: "Mobile top-up", amt: 149 },
  { d: "Feb 18", m: "Sabzi", amt: 34 }, { d: "Feb 18", m: "Petrol", amt: 246 },
  { d: "Feb 17", m: "Milk booth", amt: 28 }, { d: "Feb 17", m: "Kirana", amt: 173 },
  { d: "Feb 16", m: "Bus ticket", amt: 15 }, { d: "Feb 15", m: "Kirana", amt: 91 },
];
export function RoundUpPage() {
  const [rule, setRule] = useState(10);
  const rows = RU_TX.map((t) => ({ ...t, roundUp: rule - (t.amt % rule) === rule ? 0 : rule - (t.amt % rule) }));
  const total = rows.reduce((a, r) => a + r.roundUp, 0);
  return (
    <FeatureLayout chapterNum="08" category="Investments" title="Round-up investing." tagline="Every purchase rounded up to the nearest ₹10 or ₹50. The change quietly invests itself.">
      <TwoCol
        left={
          <div>
            <div className="eyebrow opacity-60 mb-2">Round up to</div>
            <div className="flex gap-3 mb-8">
              {[5, 10, 50, 100].map((r) => (
                <button key={r} onClick={() => setRule(r)} className={`pill-btn ${rule === r ? "" : "ghost"}`} data-testid={`ru-rule-${r}`}>₹{r}</button>
              ))}
            </div>
            <div className="border-t" style={{ borderColor: "var(--hairline-light)" }} data-testid="ru-list">
              {rows.map((t, i) => (
                <div key={i} className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: "var(--hairline-light)" }}>
                  <span className="font-mono text-[10px] opacity-60 w-14">{t.d}</span>
                  <span className="font-display text-base flex-1">{t.m}</span>
                  <span className="font-mono text-[11px] w-14 text-right opacity-70">₹{t.amt}</span>
                  <span className="font-mono text-[11px] w-14 text-right" style={{ color: "var(--emerald-bright)" }}>+₹{t.roundUp}</span>
                </div>
              ))}
            </div>
          </div>
        }
        right={
          <FigPanel caption="Fig. 08h — This week's spare change">
            <div className="w-full">
              <div className="eyebrow opacity-60 mb-2">Invested</div>
              <div className="font-display leading-none mb-1" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "var(--emerald-bright)" }} data-testid="ru-total">₹{total}</div>
              <div className="font-mono text-[11px] opacity-60 mb-8">across {rows.length} transactions this week</div>
              <p className="font-body opacity-80">At this pace, spare change alone contributes about ₹{Math.round(total * 4.3)} per month.</p>
            </div>
          </FigPanel>
        }
      />
    </FeatureLayout>
  );
}
