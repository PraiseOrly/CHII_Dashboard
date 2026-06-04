"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, FileText } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import { hackathons, PROJECT_CATEGORIES } from "@/data/hackathons";

// ─── palette ─────────────────────────────────────────────────────────────────
const NAVY   = "#002147"; // footer bg only
const RED    = "#D4264A";
const ORANGE = "#EA580C";
const SKY    = "#0EA5E9";
const VIOLET = "#8B5CF6";
const TEAL   = "#0D9488";
const EMERALD = "#10B981";
const PURPLE = "#7C3AED";
const ROSE   = "#F43F5E";
const AMBER  = "#F59E0B";
const INDIGO = "#4338CA";

// Project-category donut colours (one per category)
const CAT_COLORS = [SKY, EMERALD, VIOLET, AMBER, ROSE];

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n);
}

// ─── derived totals ───────────────────────────────────────────────────────────
const total = {
  events:       hackathons.length,
  participants: hackathons.reduce((s, h) => s + h.participants,    0),
  female:       hackathons.reduce((s, h) => s + h.femaleCount,     0),
  students:     hackathons.reduce((s, h) => s + h.studentCount,    0),
  projects:     hackathons.reduce((s, h) => s + h.projects,        0),
  winningTeams: hackathons.reduce((s, h) => s + h.winningTeams,    0),
  startups:     hackathons.reduce((s, h) => s + h.startupsCreated, 0),
  partnerships: hackathons.reduce((s, h) => s + h.partnerships,    0),
};
const femalePct   = Math.round((total.female   / total.participants) * 100);
const malePct     = 100 - femalePct;
const studentPct  = Math.round((total.students / total.participants) * 100);
const alumniPct   = 100 - studentPct;
const alumniTotal = total.participants - total.students;

const YEARS = Array.from(new Set(hackathons.map(h => h.year))).sort();

// ─── sub-components ───────────────────────────────────────────────────────────

// Custom SVG donut — inline fill bypasses Tremor/Tailwind JIT colour lookup
function CustomDonut({
  data, colors, label,
  valueFormatter = (v: number) => `${v}`,
  className = "",
}: {
  data: { name: string; value: number }[];
  colors: string[];
  label?: string;
  valueFormatter?: (v: number) => string;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const CX = 80, CY = 80, OR = 70, IR = 43;
  let theta = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
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
            fontFamily="ui-sans-serif,system-ui,sans-serif">
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

// Multi-colour bar list — one colour per row
function ColorBarList({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const max = data[0]?.value ?? 1;
  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const col = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="w-[88px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
            <div className="flex-1 h-[18px] rounded-full overflow-hidden" style={{ backgroundColor: col + "1A" }}>
              <div className="h-full rounded-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
            </div>
            <div className="text-[11px] font-bold w-6 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: ORANGE }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: ORANGE }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = ORANGE, children }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5"
        style={{
          backgroundColor: accent,
          borderBottomColor: accent,
        }}>
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

function ProfileCard({ label, value, pct, total: tot, color }: {
  label: string; value: number; pct: number; total: number; color: string;
}) {
  return (
    <div className="rounded-xl border p-5 shadow-sm" style={{ backgroundColor: color + "0D", borderColor: color + "35" }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none" style={{ color: color + "AA" }}>{label}</p>
      <div className="flex items-baseline gap-0.5 mt-3">
        <p className="text-[2.25rem] font-black tabular-nums leading-none" style={{ color }}>{pct}</p>
        <p className="text-lg font-bold mb-0.5" style={{ color }}>%</p>
      </div>
      <p className="text-[11px] text-gray-400 mt-2 tabular-nums">{value.toLocaleString()} / {tot.toLocaleString()}</p>
      <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ backgroundColor: color + "20" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Count-up animation ───────────────────────────────────────────────────────
function useCountUp(target: number, duration = 750): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start: number | null = null;
    function tick(now: number) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    }
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded-xl border px-2 py-2.5 text-center"
      style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.1em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-lg font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.62)" }}>{sub}</p>
    </div>
  );
}

function GenderMiniBar({ year, female, male, fPct }: { year: string; female: number; male: number; fPct: number }) {
  const [hovered, setHovered] = useState<{ label: string; count: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div className="relative flex items-center gap-2 text-[11px]"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <span className="w-10 text-gray-500 flex-shrink-0">{year}</span>
      <div className="flex-1 h-3 rounded-sm overflow-hidden flex" style={{ backgroundColor: SKY + "1A" }}>
        <div style={{ width: `${fPct}%`, backgroundColor: VIOLET, cursor: "pointer",
            opacity: hovered && hovered.label !== "Female" ? 0.4 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Female", count: female, color: VIOLET })} />
        <div style={{ width: `${100 - fPct}%`, backgroundColor: SKY, cursor: "pointer",
            opacity: hovered && hovered.label !== "Male" ? 0.4 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Male", count: male, color: SKY })} />
      </div>
      <span className="text-gray-400 w-8 text-right">{female + male}</span>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded-lg px-2 py-0.5 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hovered.color, left: pos.x, top: pos.y - 26, transform: "translateX(-50%)" }}>
          {hovered.label}: {hovered.count}
        </div>
      )}
    </div>
  );
}

// ─── KPI tile colour map (10 metrics) ────────────────────────────────────────
const KPI_TILES = [
  { label: "Total Hackathons",   clr: "#C2410C" },  // orange — identity
  { label: "Participants",       clr: "#1E3A8A" },  // blue
  { label: "Winning Teams",      clr: "#D97706" },  // bright amber
  { label: "Projects Developed", clr: "#5B21B6" },  // violet
  { label: "Startups Created",   clr: "#064E3B" },  // emerald
  { label: "Partnerships",       clr: "#0891B2" },  // rust
] as const;

// ─── page ─────────────────────────────────────────────────────────────────────
export default function HackathonsPage() {
  const [trendTab, setTrendTab] = useState<"participants" | "projects" | "winners" | "startups">("participants");

  // ── per-year trend data ──
  const participantsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const fem    = events.reduce((s, h) => s + h.femaleCount,   0);
    const tot    = events.reduce((s, h) => s + h.participants,  0);
    return { Year: String(yr), "Female": fem, "Male": tot - fem };
  });

  const projectsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const tot    = events.reduce((s, h) => s + h.participants, 0);
    const femR   = tot > 0 ? events.reduce((s, h) => s + h.femaleCount, 0) / tot : 0;
    const proj   = events.reduce((s, h) => s + h.projects, 0);
    return {
      Year: String(yr),
      "Female-led": Math.round(proj * femR),
      "Male-led":   Math.round(proj * (1 - femR)),
    };
  });

  const winnersTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const femW   = events.reduce((s, h) => s + h.femaleWinnerTeams, 0);
    const totW   = events.reduce((s, h) => s + h.winningTeams,      0);
    return { Year: String(yr), "Female-led": femW, "Male-led": totW - femW };
  });

  const startupsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const femS   = events.reduce((s, h) => s + h.femaleStartups,   0);
    const totS   = events.reduce((s, h) => s + h.startupsCreated,  0);
    return { Year: String(yr), "Female-founded": femS, "Male-founded": totS - femS };
  });

  const trendData = trendTab === "participants" ? participantsTrend
                  : trendTab === "projects"     ? projectsTrend
                  : trendTab === "winners"      ? winnersTrend
                  :                              startupsTrend;

  const trendCategories: [string, string] =
      trendTab === "participants" ? ["Female",        "Male"]
    : trendTab === "startups"    ? ["Female-founded", "Male-founded"]
    :                              ["Female-led",     "Male-led"];

  const trendFormatter = (v: number) =>
      trendTab === "participants" ? `${v} participants`
    : trendTab === "projects"    ? `${v} projects`
    : trendTab === "winners"     ? `${v} teams`
    : `${v} startups`;

  // ── hackathons per year ──
  const hackPerYear = YEARS.map(yr => ({
    Year: String(yr),
    Hackathons: hackathons.filter(h => h.year === yr).length,
  }));

  // ── participant reach per year ──
  const reachPerYear = YEARS.map(yr => ({
    Year: String(yr),
    Participants: hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
  }));

  // ── project categories ──
  const catTotals = PROJECT_CATEGORIES.map(cat => ({
    name: cat,
    value: hackathons.reduce((s, h) => s + h.categories[cat], 0),
  })).sort((a, b) => b.value - a.value);

  // ── gender breakdown for bar list ──
  const genderBreakdown = [
    { name: "Female Participants", value: total.female },
    { name: "Male Participants",   value: total.participants - total.female },
  ];

  // ── KPI tile values (positionally aligned with KPI_TILES) ──
  const kpiValues = [
    { sub: `${YEARS[0]}–${YEARS[YEARS.length - 1]}`, num: total.events,       fmt: (n: number) => String(Math.round(n)) },
    { sub: "Across all events",                        num: total.participants, fmt: (n: number) => Math.round(n) >= 1000 ? `${(Math.round(n) / 1000).toFixed(1)}k` : String(Math.round(n)) },
    { sub: "Total prize winners",                      num: total.winningTeams, fmt: (n: number) => String(Math.round(n)) },
    { sub: "Across all hackathons",                    num: total.projects,     fmt: (n: number) => String(Math.round(n)) },
    { sub: "Ventures from hacks",                      num: total.startups,     fmt: (n: number) => String(Math.round(n)) },
    { sub: "Sponsors & partners",                      num: total.partnerships, fmt: (n: number) => String(Math.round(n)) },
  ];

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* ── TITLE + KPI STRIP ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">

          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-black" style={{ color: NAVY }}>Hackathons</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Innovation events · {YEARS[0]}–{YEARS[YEARS.length - 1]} · {total.events} hackathons tracked
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-semibold text-white transition-colors shadow-sm"
                style={{ backgroundColor: RED }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* KPI strip — 10 distinct tinted tiles */}
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

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* ── SECTION 1: PARTICIPANT PROFILES ─────────────────────────────── */}
        <section>
          <SecHeader title="Participant Profiles"
            sub={`${total.participants.toLocaleString()} participants across all hackathons`} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Participant profile stats — stacked column */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {([
                { label: "Female Participants",  value: total.female,                       pct: femalePct,  color: VIOLET  },
                { label: "Male Participants",    value: total.participants - total.female,  pct: malePct,    color: SKY     },
                { label: "Student Participants", value: total.students,                     pct: studentPct, color: EMERALD },
                { label: "Alumni Participants",  value: alumniTotal,                        pct: alumniPct,  color: AMBER   },
              ] as const).map((item, i) => (
                <div key={item.label} className={`px-4 py-3.5 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none"
                      style={{ color: item.color + "AA" }}>{item.label}</p>
                    <p className="text-xl font-black tabular-nums leading-none"
                      style={{ color: item.color }}>{item.pct}%</p>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: item.color + "20" }}>
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 tabular-nums">
                    {item.value.toLocaleString()} / {total.participants.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <ChartCard title="Gender Composition"
              sub="Distribution of participants by gender across all events"
              accent={VIOLET}>
              <CustomDonut
                data={[
                  { name: "Male Participants",   value: total.participants - total.female },
                  { name: "Female Participants", value: total.female },
                ]}
                colors={[SKY, VIOLET]}
                className="h-44"
                label={`${total.participants}`}
                valueFormatter={(v: number) => `${v} participants`}
              />
              <div className="flex justify-center gap-5 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SKY }}    /> Male</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: VIOLET }} /> Female</span>
              </div>
            </ChartCard>

            <ChartCard title="Student vs Alumni Participation"
              sub="Breakdown of participants by academic status"
              accent={ROSE}>
              <CustomDonut
                data={[
                  { name: "Student Participants", value: total.students },
                  { name: "Alumni Participants",  value: alumniTotal    },
                ]}
                colors={[SKY, ROSE]}
                className="h-44"
                label={`${total.participants}`}
                valueFormatter={(v: number) => `${v} participants`}
              />
              <div className="flex justify-center gap-5 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SKY }}  /> Students</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ROSE }} /> Alumni</span>
              </div>
            </ChartCard>

          </div>
        </section>

        {/* ── SECTION 2: HACKATHONS PER YEAR ──────────────────────────────── */}
        <section>
          <SecHeader title="Hackathons Conducted Per Year"
            sub="Event frequency and participant reach by year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Annual Hackathon Frequency"
              sub="Count of hackathons organised per calendar year"
              accent={ORANGE}>
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={hackPerYear} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v} event${v !== 1 ? "s" : ""}`, "Hackathons"]}
                  />
                  <Bar dataKey="Hackathons" fill={ORANGE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Participant Reach per Year"
              sub="Total participants across all hackathons — year-on-year growth"
              accent={TEAL}>
              <ResponsiveContainer width="100%" height={192}>
                <AreaChart data={reachPerYear}>
                  <defs>
                    <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={TEAL} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={TEAL} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v.toLocaleString()} participants`, "Reach"]}
                  />
                  <Area type="monotone" dataKey="Participants"
                    stroke={TEAL} strokeWidth={2} fill="url(#reachGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: HACKATHON TRENDS ─────────────────────────────────── */}
        <section>
          <SecHeader title="Hackathon Trends"
            sub="Year-on-year trends with male vs female comparison" />

          {/* Tab filters */}
          <div className="flex gap-1 mb-4 bg-white rounded-lg shadow-sm px-1 py-1 w-fit">
            {(["participants", "projects", "winners", "startups"] as const).map(tab => {
              const label = tab === "participants" ? "Participants"
                          : tab === "projects"     ? "Projects Developed"
                          : tab === "winners"      ? "Winning Teams"
                          :                          "Startups Created";
              const active = trendTab === tab;
              return (
                <button key={tab} onClick={() => setTrendTab(tab)}
                  className="text-xs px-4 py-1.5 rounded font-medium transition-colors"
                  style={active
                    ? { backgroundColor: ORANGE, color: "white" }
                    : { color: "#6b7280" }}>
                  {label}
                </button>
              );
            })}
          </div>

          <ChartCard
            title={
                trendTab === "participants" ? "Participant Growth by Year"
              : trendTab === "projects"    ? "Projects Developed by Year"
              : trendTab === "winners"     ? "Winning Teams by Year"
              :                              "Startups Created from Hackathons by Year"
            }
            sub={`${
                trendTab === "participants" ? "Female vs male participation"
              : trendTab === "projects"    ? "Female-led vs male-led project teams"
              : trendTab === "winners"     ? "Female-led vs male-led winning teams"
              :                              "Female-founded vs male-founded startups"
            } · by year`}
            accent={SKY}>
            <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: SKY }} />
                {trendCategories[1]}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: VIOLET }} />
                {trendCategories[0]}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={208}>
              <BarChart data={trendData} barCategoryGap="30%" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                  formatter={(v: number, name: string) => [trendFormatter(v), name]}
                />
                <Bar dataKey={trendCategories[1]} fill={SKY}    radius={[3, 3, 0, 0]} />
                <Bar dataKey={trendCategories[0]} fill={VIOLET} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* ── SECTION 4: PARTICIPATION & PROJECT CATEGORIES ───────────────── */}
        <section>
          <SecHeader title="Participation & Project Categories"
            sub={`${total.participants.toLocaleString()} participants · ${total.projects} projects`} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Participation by Gender"
              sub="Total female and male participants across all hackathon events"
              accent={VIOLET}>
              <p className="text-[11px] text-gray-500 mb-4">
                Total of {total.participants.toLocaleString()} participants across {total.events} events
              </p>
              <ColorBarList data={genderBreakdown} colors={[VIOLET, SKY]} />

              {/* Per-year gender breakdown mini-bars */}
              <div className="mt-5 space-y-1.5">
                {participantsTrend.map(row => {
                  const tot = row.Female + row.Male;
                  const fPct = tot > 0 ? Math.round((row.Female / tot) * 100) : 0;
                  return (
                    <GenderMiniBar key={row.Year} year={row.Year} female={row.Female} male={row.Male} fPct={fPct} />
                  );
                })}
                <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: VIOLET }} /> Female</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: SKY }}    /> Male</span>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Projects by Category"
              sub="Distribution of hackathon projects across focus areas"
              accent={TEAL}>
              <CustomDonut
                data={catTotals}
                colors={CAT_COLORS}
                className="h-52"
                valueFormatter={(v: number) => `${v} projects`}
              />
              <div className="mt-3 space-y-1.5">
                {catTotals.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CAT_COLORS[i % CAT_COLORS.length] }} />
                      {cat.name}
                    </span>
                    <span className="font-medium tabular-nums" style={{ color: CAT_COLORS[i % CAT_COLORS.length] }}>
                      {cat.value} ({Math.round((cat.value / total.projects) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* ── FOOTER STRIP ────────────────────────────────────────────────── */}
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(total.participants), label: "Total Participants",    clr: "#1E3A8A" },
              { value: `${femalePct}%`,            label: "Female Participation", clr: "#9D174D" },
              { value: String(total.startups),     label: "Startups Created",     clr: "#064E3B" },
              { value: String(total.partnerships), label: "Partnerships Secured", clr: "#0891B2" },
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
              HENT · Hackathons · {YEARS[0]}–{YEARS[YEARS.length - 1]}
            </p>
            <p className="text-[10px] text-gray-400">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
