"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, FileText } from "lucide-react";
import HEMPNav from "@/components/HEMPNav";
import { healthXSessions, HX_TYPES } from "@/data/hemp/healthx";

// ─── Palette ─────────────────────────────────────────────────────────────────
const NAVY   = "#002147";
const TEAL   = "#0D9488";
const VIOLET = "#7C3AED";
const SKY    = "#0EA5E9";
const AMBER  = "#F59E0B";
const GREEN  = "#10B981";
const ROSE   = "#F43F5E";
const INDIGO = "#4338CA";
const ORANGE = "#EA580C";
const PURPLE = "#A855F7";

const TYPE_COLOR: Record<string, string> = {
  "Health Facility Visit": TEAL,
  "Innovation Challenge":  VIOLET,
  "Field Exposure":        SKY,
  "Industry Tour":         AMBER,
};
const TYPE_HEX_LIST = [TEAL, VIOLET, SKY, AMBER];
const COUNTRY_HEX   = [TEAL, VIOLET, ORANGE, SKY, AMBER, GREEN, ROSE, INDIGO, PURPLE, "#EC4899"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function heatColor(v: number): string {
  if (v >= 4.5) return TEAL;
  if (v >= 4.0) return VIOLET;
  if (v >= 3.5) return AMBER;
  return ROSE;
}

// ─── Aggregates ──────────────────────────────────────────────────────────────
const total = {
  sessions:     healthXSessions.length,
  participants: healthXSessions.reduce((s, h) => s + h.participants, 0),
  female:       healthXSessions.reduce((s, h) => s + h.femalePart,   0),
  partnerships: healthXSessions.reduce((s, h) => s + h.partnerships, 0),
};
const femalePct = Math.round(total.female / total.participants * 100);
const malePct   = 100 - femalePct;
const avgComp   = Math.round(avg(healthXSessions.map(h => h.completionRate)));
const avgSat    = parseFloat(avg(healthXSessions.map(h => avg(Object.values(h.scores)))).toFixed(1));
const countries = Array.from(new Set(healthXSessions.map(h => h.country)));

const YEARS = Array.from(new Set(healthXSessions.map(h => h.year))).sort();

// Per-type stats
const typeStats = HX_TYPES.map(type => {
  const sessions = healthXSessions.filter(h => h.type === type);
  const part     = sessions.reduce((s, h) => s + h.participants, 0);
  const fem      = sessions.reduce((s, h) => s + h.femalePart,   0);
  return {
    type,
    count:    sessions.length,
    part,
    femPct:   part > 0 ? Math.round(fem / part * 100) : 0,
    avgSat:   parseFloat(avg(sessions.map(h => avg(Object.values(h.scores)))).toFixed(1)),
    avgComp:  Math.round(avg(sessions.map(h => h.completionRate))),
    pship:    sessions.reduce((s, h) => s + h.partnerships, 0),
  };
});

// Annual charts
const sessionsPerYear = YEARS.map(yr => ({
  Year:     String(yr),
  Sessions: healthXSessions.filter(h => h.year === yr).length,
}));

const participantsPerYear = YEARS.map(yr => ({
  Year:         String(yr),
  Participants: healthXSessions.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
}));

// Trend data: participants by year (female vs male stacked)
const trendFemale = YEARS.map(yr => {
  const events = healthXSessions.filter(h => h.year === yr);
  const fem    = events.reduce((s, h) => s + h.femalePart,                         0);
  const tot    = events.reduce((s, h) => s + h.participants,                        0);
  return { Year: String(yr), Female: fem, Male: tot - fem };
});

// Participants by type per year (stacked bar)
const participantsByTypeYear = YEARS.map(yr => {
  const row: Record<string, string | number> = { Year: String(yr) };
  for (const type of HX_TYPES) {
    const sessions = healthXSessions.filter(h => h.year === yr && h.type === type);
    row[type] = sessions.reduce((s, h) => s + h.participants, 0);
  }
  return row as { Year: string } & Record<typeof HX_TYPES[number], number>;
});

// Session type donut data
const typeData = HX_TYPES.map(type => ({
  name:  type,
  value: healthXSessions.filter(h => h.type === type).reduce((s, h) => s + h.participants, 0),
}));

// Country coverage
const countryData = Object.entries(
  healthXSessions.reduce<Record<string, number>>((acc, h) => {
    acc[h.country] = (acc[h.country] || 0) + h.participants;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

// Satisfaction heatmap: type × score dimension
const SCORE_DIMS = ["Learning Experience", "Practical Relevance", "Accessibility", "Innovation Impact"] as const;

const hxHeatmap = HX_TYPES.map(type => {
  const sessions = healthXSessions.filter(h => h.type === type);
  return {
    type,
    "Learning Experience":  parseFloat(avg(sessions.map(h => h.scores["Learning Experience"])).toFixed(1)),
    "Practical Relevance":  parseFloat(avg(sessions.map(h => h.scores["Practical Relevance"])).toFixed(1)),
    "Accessibility":        parseFloat(avg(sessions.map(h => h.scores["Accessibility"])).toFixed(1)),
    "Innovation Impact":    parseFloat(avg(sessions.map(h => h.scores["Innovation Impact"])).toFixed(1)),
  };
});

// KPI tiles
const KPI_TILES = [
  { label: "Total Sessions",    clr: "#0F766E" },
  { label: "Total Participants",clr: "#4C1D95" },
  { label: "Countries Visited", clr: "#1E3A8A" },
  { label: "Partnerships",      clr: "#065F46" },
  { label: "Avg Completion",    clr: "#B45309" },
  { label: "Avg Satisfaction",  clr: "#9D174D" },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 750): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start: number | null = null;
    function tick(now: number) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    }
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string; sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded border px-2 py-2.5 text-center" style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.1em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-lg font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.62)" }}>{sub}</p>
    </div>
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: TEAL }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: TEAL }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = TEAL, children }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5"
        style={{ backgroundColor: accent, borderBottomColor: accent }}>
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ColorBarList({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const max = data[0]?.value ?? 1;
  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const col = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="w-[88px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
            <div className="flex-1 h-[18px] rounded-sm overflow-hidden" style={{ backgroundColor: col + "1A" }}>
              <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
            </div>
            <div className="text-[11px] font-bold w-8 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function CustomDonut({ data, colors, label, valueFormatter = (v: number) => `${v}`, className = "" }: {
  data: { name: string; value: number }[];
  colors: string[];
  label?: string;
  valueFormatter?: (v: number) => string;
  className?: string;
}) {
  const tot = data.reduce((s, d) => s + d.value, 0);
  if (!tot) return null;
  const CX = 80, CY = 80, OR = 70, IR = 43;
  let theta = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / tot) * 2 * Math.PI;
    const t0 = theta, t1 = theta + sweep;
    theta = t1;
    const lg = sweep > Math.PI ? 1 : 0;
    const path = [
      `M ${CX + OR * Math.cos(t0)} ${CY + OR * Math.sin(t0)}`,
      `A ${OR} ${OR} 0 ${lg} 1 ${CX + OR * Math.cos(t1)} ${CY + OR * Math.sin(t1)}`,
      `L ${CX + IR * Math.cos(t1)} ${CY + IR * Math.sin(t1)}`,
      `A ${IR} ${IR} 0 ${lg} 0 ${CX + IR * Math.cos(t0)} ${CY + IR * Math.sin(t0)}`,
      "Z",
    ].join(" ");
    return { path, fill: colors[i % colors.length], name: d.name, value: d.value };
  });
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth="2.5">
            <title>{s.name}: {valueFormatter(s.value)}</title>
          </path>
        ))}
        {label && (
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#111827" fontSize="20" fontWeight="900"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">{label}</text>
        )}
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HealthXPage() {
  const [trendTab, setTrendTab] = useState<"participants" | "types">("participants");

  const trendData       = trendTab === "participants" ? trendFemale : participantsByTypeYear;
  const trendCats       = trendTab === "participants"
    ? (["Female", "Male"] as const)
    : HX_TYPES;
  const trendColors     = trendTab === "participants"
    ? [ROSE, SKY]
    : TYPE_HEX_LIST;

  const kpiValues = [
    { sub: `${YEARS[0]}–${YEARS[YEARS.length - 1]}`, num: total.sessions,      fmt: (n: number) => String(Math.round(n)) },
    { sub: "All sessions combined",                    num: total.participants,  fmt: (n: number) => n >= 1000 ? `${(Math.round(n)/1000).toFixed(1)}k` : String(Math.round(n)) },
    { sub: "Unique countries",                         num: countries.length,    fmt: (n: number) => String(Math.round(n)) },
    { sub: "Industry links",                           num: total.partnerships,  fmt: (n: number) => String(Math.round(n)) },
    { sub: "Programme completion",                     num: avgComp,             fmt: (n: number) => `${Math.round(n)}%` },
    { sub: "Satisfaction (1–5)",                       num: avgSat,              fmt: (n: number) => `${n.toFixed(1)}/5` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HEMPNav />

      {/* ── HEADER + KPIs ─── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-black" style={{ color: NAVY }}>HealthX</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Experiential learning sessions · {YEARS[0]}–{YEARS[YEARS.length - 1]} · {total.sessions} sessions tracked
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded font-semibold text-white transition-colors shadow-sm"
                style={{ backgroundColor: TEAL }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {KPI_TILES.map(({ label, clr }, i) => (
                <KpiTile key={label} label={label} num={kpiValues[i].num}
                  displayFmt={kpiValues[i].fmt} sub={kpiValues[i].sub} clr={clr} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── BODY ─── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* ── SECTION 1: SESSION PROFILES ─── */}
        <section>
          <SecHeader title="Session Type Profiles"
            sub={`${total.sessions} sessions · ${total.participants.toLocaleString()} participants across ${countries.length} countries`} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Type stat rows */}
            <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
              {typeStats.map((t, i) => (
                <div key={t.type} className={`px-4 py-3.5 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none"
                      style={{ color: TYPE_COLOR[t.type] + "AA" }}>{t.type}</p>
                    <p className="text-lg font-black tabular-nums leading-none"
                      style={{ color: TYPE_COLOR[t.type] }}>{t.count}</p>
                  </div>
                  <div className="h-1.5 rounded-sm overflow-hidden" style={{ backgroundColor: TYPE_COLOR[t.type] + "20" }}>
                    <div className="h-full" style={{ width: `${(t.count / total.sessions) * 100}%`, backgroundColor: TYPE_COLOR[t.type] }} />
                  </div>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-gray-400 tabular-nums">
                    <span>{t.part.toLocaleString()} participants</span>
                    <span className="ml-auto font-semibold" style={{ color: TYPE_COLOR[t.type] }}>sat {t.avgSat}/5</span>
                  </div>
                </div>
              ))}
            </div>

            <ChartCard title="Participants by Session Type"
              sub="Distribution of total participant reach across session categories"
              accent={VIOLET}>
              <CustomDonut
                data={typeData}
                colors={TYPE_HEX_LIST}
                className="h-44"
                label={String(total.participants)}
                valueFormatter={(v: number) => `${v} participants`}
              />
              <div className="flex justify-center flex-wrap gap-3 mt-3 text-[11px] text-gray-500">
                {HX_TYPES.map((t, i) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TYPE_HEX_LIST[i] }} />
                    {t.split(" ").slice(-1)[0]}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Gender &amp; Completion Overview"
              sub="Cross-session diversity and programme completion"
              accent={ROSE}>
              <div className="space-y-3">
                {([
                  { label: "Female Participants", value: total.female,                      pct: femalePct, color: ROSE   },
                  { label: "Male Participants",   value: total.participants - total.female, pct: malePct,   color: SKY    },
                ] as const).map(item => (
                  <div key={item.label} className="px-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none"
                        style={{ color: item.color + "AA" }}>{item.label}</p>
                      <p className="text-xl font-black tabular-nums leading-none"
                        style={{ color: item.color }}>{item.pct}%</p>
                    </div>
                    <div className="h-1.5 rounded-sm overflow-hidden" style={{ backgroundColor: item.color + "20" }}>
                      <div className="h-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 tabular-nums">
                      {item.value.toLocaleString()} / {total.participants.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Avg Completion</span>
                  <span className="font-black tabular-nums" style={{ color: GREEN }}>{avgComp}%</span>
                </div>
                <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: GREEN + "1A" }}>
                  <div className="h-full" style={{ width: `${avgComp}%`, backgroundColor: GREEN }} />
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-gray-500 font-medium">Avg Satisfaction</span>
                  <span className="font-black tabular-nums" style={{ color: VIOLET }}>{avgSat}/5</span>
                </div>
                <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: VIOLET + "1A" }}>
                  <div className="h-full" style={{ width: `${(avgSat / 5) * 100}%`, backgroundColor: VIOLET }} />
                </div>
              </div>
            </ChartCard>

          </div>
        </section>

        {/* ── SECTION 2: ANNUAL ACTIVITY ─── */}
        <section>
          <SecHeader title="Annual Activity"
            sub="Session frequency and participant reach year on year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Sessions Delivered per Year"
              sub="Count of HealthX sessions organised each calendar year"
              accent={TEAL}>
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={sessionsPerYear} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v} session${v !== 1 ? "s" : ""}`, "HealthX"]} />
                  <Bar dataKey="Sessions" fill={TEAL} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Participant Reach per Year"
              sub="Total participants across HealthX sessions — year-on-year growth"
              accent={VIOLET}>
              <ResponsiveContainer width="100%" height={192}>
                <AreaChart data={participantsPerYear}>
                  <defs>
                    <linearGradient id="hxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={VIOLET} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={VIOLET} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v.toLocaleString()} participants`, "Reach"]} />
                  <Area type="monotone" dataKey="Participants" stroke={VIOLET} strokeWidth={2} fill="url(#hxGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        </section>

        {/* ── SECTION 3: TRENDS ─── */}
        <section>
          <SecHeader title="Participation Trends"
            sub="Year-on-year breakdown by gender and session type" />

          <div className="flex gap-1 mb-4 bg-white rounded shadow-sm px-1 py-1 w-fit">
            {([["participants", "Gender Breakdown"], ["types", "By Session Type"]] as const).map(([tab, label]) => {
              const active = trendTab === tab;
              return (
                <button key={tab} onClick={() => setTrendTab(tab)}
                  className="text-xs px-4 py-1.5 rounded font-medium transition-colors"
                  style={active ? { backgroundColor: TEAL, color: "white" } : { color: "#6b7280" }}>
                  {label}
                </button>
              );
            })}
          </div>

          <ChartCard
            title={trendTab === "participants" ? "Participant Growth by Year — Gender" : "Participants by Session Type per Year"}
            sub={trendTab === "participants" ? "Female vs male participation trend" : "Session type contribution to participant reach"}
            accent={SKY}>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 mb-3">
              {trendCats.map((cat, i) => (
                <span key={cat} className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: trendColors[i] }} />{cat}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={208}>
              <BarChart data={trendData} barCategoryGap="30%" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                {trendCats.map((cat, i) => (
                  <Bar key={cat} dataKey={cat} fill={trendColors[i]} radius={[0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* ── SECTION 4: PERFORMANCE HEATMAP ─── */}
        <section>
          <SecHeader title="Satisfaction &amp; Performance"
            sub="Score breakdown by session type and evaluation dimension" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Satisfaction Heatmap — Type × Dimension"
              sub="Avg score · Teal ≥4.5 · Violet ≥4.0 · Amber ≥3.5 · Rose <3.5"
              accent={TEAL}>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-4 uppercase tracking-wider text-[9px]">Type</th>
                      {SCORE_DIMS.map(d => (
                        <th key={d} className="text-center text-gray-400 font-bold pb-3 px-1 min-w-[64px] uppercase tracking-wider text-[9px] leading-tight">{d}</th>
                      ))}
                      <th className="text-center text-gray-400 font-bold pb-3 px-1 uppercase tracking-wider text-[9px]">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hxHeatmap.map(row => {
                      const scores = SCORE_DIMS.map(d => row[d]);
                      const rowAvg = parseFloat(avg(scores).toFixed(1));
                      return (
                        <tr key={row.type} className="border-t border-gray-100">
                          <td className="py-2.5 pr-4">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLOR[row.type] }} />
                              <span className="font-semibold text-gray-700 text-[10px] leading-tight">{row.type}</span>
                            </span>
                          </td>
                          {SCORE_DIMS.map(d => (
                            <td key={d} className="py-2.5 px-1 text-center">
                              <span className="inline-block px-2 py-1 rounded text-white text-[10px] font-bold tabular-nums"
                                style={{ backgroundColor: heatColor(row[d]) }}>
                                {row[d].toFixed(1)}
                              </span>
                            </td>
                          ))}
                          <td className="py-2.5 px-1 text-center">
                            <span className="inline-block px-2 py-1 rounded text-white text-[10px] font-bold tabular-nums"
                              style={{ backgroundColor: INDIGO }}>
                              {rowAvg.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ChartCard>

            <ChartCard title="Geographic Reach"
              sub="Countries by total HealthX participant volume"
              accent={ORANGE}>
              <ColorBarList data={countryData} colors={COUNTRY_HEX} />
            </ChartCard>

          </div>
        </section>

        {/* ── FOOTER STRIP ─── */}
        <div className="rounded overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(total.participants), label: "Total Participants", clr: "#4C1D95" },
              { value: `${femalePct}%`,            label: "Female Reach",      clr: "#9D174D" },
              { value: String(total.partnerships), label: "Partnerships",      clr: "#065F46" },
              { value: `${avgSat}/5`,              label: "Avg Satisfaction",  clr: "#0F766E" },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-6 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}` }}>
                <p className="text-2xl font-black tabular-nums text-white">{tile.value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              HEMP · HealthX · {YEARS[0]}–{YEARS[YEARS.length - 1]}
            </p>
            <p className="text-[10px] text-gray-400">Last updated: 04 Jun 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
