"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, FileText } from "lucide-react";
import HEMPNav from "@/components/HEMPNav";
import { missionStudents, STUDENT_TRACKS } from "@/data/hemp/missionStudents";

// ─── Palette ─────────────────────────────────────────────────────────────────
const NAVY   = "#002147";
const VIOLET = "#7C3AED";
const TEAL   = "#0D9488";
const GREEN  = "#10B981";
const AMBER  = "#F59E0B";
const SKY    = "#0EA5E9";
const ROSE   = "#F43F5E";
const INDIGO = "#4338CA";
const ORANGE = "#EA580C";
const PURPLE = "#A855F7";

const TRACK_COLOR: Record<string, string> = {
  "Health Innovation":  VIOLET,
  "Health Management":  TEAL,
  "Health Policy":      AMBER,
  "Digital Health":     SKY,
};
const TRACK_HEX   = [VIOLET, TEAL, AMBER, SKY];
const EMP_HEX     = [GREEN, VIOLET, SKY, AMBER];
const COUNTRY_HEX = [VIOLET, TEAL, ORANGE, SKY, AMBER, GREEN, ROSE, INDIGO, PURPLE, "#EC4899"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// ─── Aggregates ──────────────────────────────────────────────────────────────
const total = {
  students:     missionStudents.length,
  female:       missionStudents.filter(s => s.gender === "Female").length,
  completed:    missionStudents.filter(s => s.status === "Completed").length,
  active:       missionStudents.filter(s => s.status === "Active").length,
  deferred:     missionStudents.filter(s => s.status === "Deferred").length,
  entrepreneurs:missionStudents.filter(s => s.employment === "Entrepreneur").length,
  employed:     missionStudents.filter(s => s.employment === "Employed").length,
  ventures:     missionStudents.filter(s => s.ventureCreated).length,
  internship:   missionStudents.filter(s => s.hasInternship).length,
  healthx:      missionStudents.filter(s => s.hasHealthX).length,
};
const femalePct    = Math.round(total.female   / total.students   * 100);
const completedArr = missionStudents.filter(s => s.status === "Completed");
const employRate   = completedArr.length
  ? Math.round((total.employed + total.entrepreneurs) / completedArr.length * 100)
  : 0;
const ventureRate  = completedArr.length
  ? Math.round(total.ventures / completedArr.length * 100)
  : 0;
const avgGpa       = parseFloat(avg(missionStudents.map(s => s.gpa)).toFixed(2));

const COHORTS = Array.from(new Set(missionStudents.map(s => s.cohort))).sort();

// Cohort overview
const cohortData = COHORTS.map(yr => ({
  Year:      String(yr),
  Completed: missionStudents.filter(s => s.cohort === yr && s.status === "Completed").length,
  Active:    missionStudents.filter(s => s.cohort === yr && s.status === "Active").length,
  Deferred:  missionStudents.filter(s => s.cohort === yr && s.status === "Deferred").length,
}));

// Gender by cohort
const genderByCohort = COHORTS.map(yr => {
  const fem = missionStudents.filter(s => s.cohort === yr && s.gender === "Female").length;
  const tot = missionStudents.filter(s => s.cohort === yr).length;
  return { Year: String(yr), Female: fem, Male: tot - fem };
});

// Track distribution
const trackData = STUDENT_TRACKS.map(track => ({
  name:  track,
  value: missionStudents.filter(s => s.track === track).length,
}));

// Employment outcomes
const empOutcomes = [
  { name: "Employed",      value: total.employed                                                          },
  { name: "Entrepreneur",  value: total.entrepreneurs                                                     },
  { name: "Further Study", value: completedArr.filter(s => s.employment === "Further Study").length       },
  { name: "Seeking",       value: completedArr.filter(s => s.employment === "Seeking").length             },
];

// Track × employment outcomes (for completed students)
const trackEmpData = STUDENT_TRACKS.map(track => {
  const students = completedArr.filter(s => s.track === track);
  return {
    track,
    Employed:     students.filter(s => s.employment === "Employed").length,
    Entrepreneur: students.filter(s => s.employment === "Entrepreneur").length,
    "Further Study": students.filter(s => s.employment === "Further Study").length,
    Seeking:      students.filter(s => s.employment === "Seeking").length,
  };
});

// Country distribution
const countryData = Object.entries(
  missionStudents.reduce<Record<string, number>>((acc, s) => {
    acc[s.country] = (acc[s.country] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

// Internship + HealthX engagement by cohort
const engagementData = COHORTS.map(yr => ({
  Year:       String(yr),
  Internship: missionStudents.filter(s => s.cohort === yr && s.hasInternship).length,
  HealthX:    missionStudents.filter(s => s.cohort === yr && s.hasHealthX).length,
}));

// KPI tiles
const KPI_TILES = [
  { label: "Total Students",   clr: "#4C1D95" },
  { label: "Active Students",  clr: "#0F766E" },
  { label: "Graduates",        clr: "#065F46" },
  { label: "Female Students",  clr: "#9D174D" },
  { label: "Entrepreneurs",    clr: "#B45309" },
  { label: "Ventures Created", clr: "#5B21B6" },
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
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: VIOLET }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: VIOLET }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = VIOLET, children }: {
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
            <div className="text-[11px] font-bold w-6 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
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
  const [hovered, setHovered] = useState<{ name: string; value: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
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
    <div className={`relative flex items-center justify-center ${className}`}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}>
      <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth="2.5"
            style={{ cursor: "pointer", opacity: hovered && hovered.name !== s.name ? 0.45 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovered({ name: s.name, value: s.value, color: s.fill })}
            onMouseLeave={() => setHovered(null)} />
        ))}
        {label && (
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#111827" fontSize="20" fontWeight="900"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">{label}</text>
        )}
      </svg>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hovered.color, left: pos.x, top: pos.y - 34, transform: "translateX(-50%)" }}>
          {hovered.name}: {valueFormatter(hovered.value)}
        </div>
      )}
    </div>
  );
}

function GenderMiniBar({ year, female, male }: { year: string; female: number; male: number }) {
  const tot  = female + male;
  const fPct = tot > 0 ? Math.round((female / tot) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-10 text-gray-500 flex-shrink-0">{year}</span>
      <div className="flex-1 h-3 rounded-sm overflow-hidden flex" style={{ backgroundColor: SKY + "1A" }}>
        <div style={{ width: `${fPct}%`, backgroundColor: ROSE }} />
        <div style={{ width: `${100 - fPct}%`, backgroundColor: SKY }} />
      </div>
      <span className="text-gray-400 w-6 text-right tabular-nums">{tot}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MissionStudentsPage() {
  const [statusTab, setStatusTab] = useState<"status" | "gender" | "engagement">("status");

  const cohortChartData =
    statusTab === "status"     ? cohortData :
    statusTab === "gender"     ? genderByCohort :
                                 engagementData;

  const cohortCats =
    statusTab === "status"     ? (["Completed", "Active", "Deferred"] as const) :
    statusTab === "gender"     ? (["Female", "Male"]                  as const) :
                                 (["HealthX", "Internship"]           as const);

  const cohortColors =
    statusTab === "status"     ? [GREEN,  VIOLET, AMBER] :
    statusTab === "gender"     ? [ROSE,   SKY           ] :
                                 [TEAL,   AMBER          ];

  const kpiValues = [
    { sub: `Across ${COHORTS.length} cohorts`,  num: total.students,     fmt: (n: number) => String(Math.round(n)) },
    { sub: "Currently enrolled",                 num: total.active,       fmt: (n: number) => String(Math.round(n)) },
    { sub: "Programme completers",               num: total.completed,    fmt: (n: number) => String(Math.round(n)) },
    { sub: `${femalePct}% of total`,             num: total.female,       fmt: (n: number) => String(Math.round(n)) },
    { sub: "Launched own ventures",              num: total.entrepreneurs,fmt: (n: number) => String(Math.round(n)) },
    { sub: "Student startups",                   num: total.ventures,     fmt: (n: number) => String(Math.round(n)) },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HEMPNav />

      {/* ── HEADER + KPIs ─── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-black" style={{ color: NAVY }}>Mission Students</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                HEMP programme cohorts · {COHORTS[0]}–{COHORTS[COHORTS.length-1]} · {total.students} students across {COHORTS.length} cohorts
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded font-semibold text-white transition-colors shadow-sm"
                style={{ backgroundColor: VIOLET }}>
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

        {/* ── SECTION 1: COHORT OVERVIEW ─── */}
        <section>
          <SecHeader title="Cohort Overview"
            sub={`${total.students} students enrolled across ${COHORTS.length} cohorts · ${total.completed} completed · ${total.active} active`} />

          <div className="flex gap-1 mb-4 bg-white rounded shadow-sm px-1 py-1 w-fit">
            {([["status", "Completion Status"], ["gender", "Gender Breakdown"], ["engagement", "Programme Engagement"]] as const).map(([tab, label]) => {
              const active = statusTab === tab;
              return (
                <button key={tab} onClick={() => setStatusTab(tab)}
                  className="text-xs px-4 py-1.5 rounded font-medium transition-colors"
                  style={active ? { backgroundColor: VIOLET, color: "white" } : { color: "#6b7280" }}>
                  {label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard
              title={statusTab === "status" ? "Students by Cohort — Status Breakdown" : statusTab === "gender" ? "Students by Cohort — Gender Breakdown" : "Programme Engagement by Cohort"}
              sub={statusTab === "status" ? "Completed · Active · Deferred per cohort" : statusTab === "gender" ? "Female vs male students per cohort" : "HealthX and internship participation per cohort"}
              accent={VIOLET}>
              <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                {cohortCats.map((cat, i) => (
                  <span key={cat} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: cohortColors[i] }} />{cat}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={cohortChartData} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                  {cohortCats.map((cat, i) => (
                    <Bar key={cat} dataKey={cat} fill={cohortColors[i]} radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Cohort gender mini-bars + stats */}
            <ChartCard title="Gender by Cohort"
              sub="Male/female ratio per cohort year"
              accent={ROSE}>
              <div className="space-y-2 mb-4">
                {genderByCohort.map(row => (
                  <GenderMiniBar key={row.Year} year={row.Year} female={row.Female} male={row.Male} />
                ))}
                <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: ROSE }} /> Female</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: SKY }}  /> Male</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-black" style={{ color: ROSE }}>{femalePct}%</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Female avg</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: GREEN }}>{Math.round(total.completed / total.students * 100)}%</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Completion</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: VIOLET }}>{avgGpa}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Avg GPA</p>
                </div>
              </div>
            </ChartCard>

          </div>
        </section>

        {/* ── SECTION 2: TRACK DISTRIBUTION ─── */}
        <section>
          <SecHeader title="Track Distribution &amp; Outcomes"
            sub="Student programme tracks and employment outcomes per track" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Track stat rows */}
            <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
              {trackData.map((t, i) => (
                <div key={t.name} className={`px-4 py-3.5 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none"
                      style={{ color: TRACK_COLOR[t.name] + "AA" }}>{t.name}</p>
                    <p className="text-lg font-black tabular-nums leading-none"
                      style={{ color: TRACK_COLOR[t.name] }}>{t.value}</p>
                  </div>
                  <div className="h-1.5 rounded-sm overflow-hidden" style={{ backgroundColor: TRACK_COLOR[t.name] + "20" }}>
                    <div className="h-full" style={{ width: `${(t.value / total.students) * 100}%`, backgroundColor: TRACK_COLOR[t.name] }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 tabular-nums">
                    {Math.round(t.value / total.students * 100)}% of cohort
                  </p>
                </div>
              ))}
            </div>

            <ChartCard title="Track Distribution"
              sub="Mission students by programme specialisation"
              accent={VIOLET}>
              <CustomDonut
                data={trackData}
                colors={TRACK_HEX}
                className="h-44"
                label={String(total.students)}
                valueFormatter={(v: number) => `${v} students`}
              />
              <div className="mt-3 space-y-1">
                {trackData.map((t, i) => (
                  <div key={t.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-600 truncate min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TRACK_HEX[i] }} />
                      <span className="truncate">{t.name}</span>
                    </span>
                    <span className="font-bold text-gray-700 ml-2 flex-shrink-0">
                      {t.value} ({Math.round(t.value / total.students * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Employment by Track"
              sub="Graduate outcomes per programme track — completed students"
              accent={GREEN}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trackEmpData} barCategoryGap="25%" barGap={1} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="track" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={72}
                    tickFormatter={v => v.split(" ").slice(-1)[0]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                  <Bar dataKey="Employed"      fill={GREEN}  radius={[0,0,0,0]} stackId="a" />
                  <Bar dataKey="Entrepreneur"  fill={VIOLET} radius={[0,0,0,0]} stackId="a" />
                  <Bar dataKey="Further Study" fill={SKY}    radius={[0,0,0,0]} stackId="a" />
                  <Bar dataKey="Seeking"       fill={AMBER}  radius={[0,0,0,0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-gray-400">
                {[["Employed", GREEN], ["Entrepreneur", VIOLET], ["Further Study", SKY], ["Seeking", AMBER]].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: c as string }} />{l}</span>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* ── SECTION 3: EMPLOYMENT OUTCOMES ─── */}
        <section>
          <SecHeader title="Employment Outcomes"
            sub={`${completedArr.length} graduates · ${employRate}% employment/entrepreneurship rate`} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <ChartCard title="Graduate Employment Status"
              sub="Employment status breakdown — all completed students"
              accent={GREEN}>
              <CustomDonut
                data={empOutcomes}
                colors={EMP_HEX}
                className="h-40"
                label={String(completedArr.length)}
                valueFormatter={(v: number) => `${v} graduates`}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-center">
                {empOutcomes.map((e, i) => (
                  <div key={e.name}>
                    <p className="text-base font-black" style={{ color: EMP_HEX[i] }}>{e.value}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium leading-tight">{e.name}</p>
                    <p className="text-[9px] text-gray-400">
                      {completedArr.length ? Math.round(e.value / completedArr.length * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Key Student Metrics"
              sub="Academic, engagement, and outcome indicators"
              accent={VIOLET}>
              <div className="space-y-3 mt-1">
                {([
                  { label: "With Internship",   value: total.internship,    color: AMBER,   sub: `${Math.round(total.internship / total.students * 100)}% of enrolled` },
                  { label: "Attended HealthX",  value: total.healthx,       color: TEAL,    sub: `${Math.round(total.healthx    / total.students * 100)}% of enrolled` },
                  { label: "Ventures Created",  value: total.ventures,      color: VIOLET,  sub: `${ventureRate}% of graduates`                                       },
                  { label: "Employed/Founders", value: total.employed + total.entrepreneurs, color: GREEN, sub: `${employRate}% graduate employment rate`             },
                  { label: "Avg GPA",           value: avgGpa,              color: INDIGO,  sub: "Across all active & completed"                                     },
                ] as const).map(m => (
                  <div key={m.label} className="flex items-center gap-3 p-3 rounded border-l-2"
                    style={{ backgroundColor: m.color + "0E", borderColor: m.color }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: m.color + "AA" }}>{m.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{m.sub}</p>
                    </div>
                    <p className="text-xl font-black tabular-nums flex-shrink-0" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Country distribution */}
            <ChartCard title="Student Countries of Origin"
              sub="Mission students by home country"
              accent={ORANGE}>
              <ColorBarList data={countryData.slice(0, 10)} colors={COUNTRY_HEX} />
            </ChartCard>

          </div>
        </section>

        {/* ── FOOTER STRIP ─── */}
        <div className="rounded overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(total.students),   label: "Mission Students",      clr: "#4C1D95" },
              { value: `${femalePct}%`,           label: "Female Students",       clr: "#9D174D" },
              { value: `${employRate}%`,          label: "Employment Rate",       clr: "#065F46" },
              { value: String(total.ventures),    label: "Ventures Created",      clr: "#5B21B6" },
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
              HEMP · Mission Students · {COHORTS[0]}–{COHORTS[COHORTS.length - 1]}
            </p>
            <p className="text-[10px] text-gray-400">Last updated: 04 Jun 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
