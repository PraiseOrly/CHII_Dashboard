"use client";
import HEMPNav from "@/components/HEMPNav";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/missionStudents";
import {
  Activity,
  Award,
  Briefcase,
  Building2,
  Download, FileText,
  GraduationCap,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp, Users,
  Zap, type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";
import type { InternshipSector } from "@/data/hemp/internships";
import type { StudentTrack } from "@/data/hemp/missionStudents";

// â"€â"€â"€ Palette â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const VIOLET = "#7C3AED";
const TEAL   = "#0D9488";
const GREEN  = "#10B981";
const AMBER  = "#F59E0B";
const SKY    = "#0EA5E9";
const ROSE   = "#F43F5E";
const INDIGO = "#4338CA";
const ORANGE = "#EA580C";
const PURPLE = "#A855F7";

// â"€â"€â"€ Helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function heatColor(v: number): string {
  if (v >= 4.5) return TEAL;
  if (v >= 4.0) return VIOLET;
  if (v >= 3.5) return AMBER;
  return ROSE;
}

// â"€â"€â"€ Cross-programme aggregates â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const hxPart     = healthXSessions.reduce((s, h) => s + h.participants, 0);
const hxFem      = healthXSessions.reduce((s, h) => s + h.femalePart,   0);
const hxPship    = healthXSessions.reduce((s, h) => s + h.partnerships, 0);
const hxCompAvg  = Math.round(avg(healthXSessions.map(h => h.completionRate)));
const hxSatAvg   = parseFloat(avg(healthXSessions.map(h => avg(Object.values(h.scores)))).toFixed(1));

const intStudents    = internships.reduce((s, i) => s + i.students,              0);
const intFem         = internships.reduce((s, i) => s + i.femaleStudents,        0);
const intConversions = internships.reduce((s, i) => s + i.employmentConversions, 0);
const intSatAvg      = parseFloat(avg(internships.map(i => i.satisfactionScore)).toFixed(1));

const totalStudents = missionStudents.length;
const studentFem    = missionStudents.filter(s => s.gender === "Female").length;
const completed     = missionStudents.filter(s => s.status === "Completed");
const activeList    = missionStudents.filter(s => s.status === "Active");
const employed      = completed.filter(s => s.employment === "Employed" || s.employment === "Entrepreneur");
const ventures      = missionStudents.filter(s => s.ventureCreated);
const completionPct = Math.round(completed.length / totalStudents * 100);
const employPct     = completed.length ? Math.round(employed.length / completed.length * 100) : 0;

const FEMALE_PCT_HX  = Math.round(hxFem      / hxPart        * 100);
const FEMALE_PCT_IN  = Math.round(intFem     / intStudents    * 100);
const FEMALE_PCT_ST  = Math.round(studentFem / totalStudents  * 100);
const FEMALE_PCT_ALL = Math.round((hxFem + intFem + studentFem) / (hxPart + intStudents + totalStudents) * 100);
const AVG_SAT        = parseFloat(((hxSatAvg + intSatAvg) / 2).toFixed(1));

// â"€â"€â"€ Chart data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

const enrolmentByYear = YEARS.map(yr => ({
  Year:      String(yr),
  Completed: missionStudents.filter(s => s.cohort === yr && s.status === "Completed").length,
  Active:    missionStudents.filter(s => s.cohort === yr && s.status === "Active").length,
  Deferred:  missionStudents.filter(s => s.cohort === yr && s.status === "Deferred").length,
}));

const reachByYear = YEARS.map(yr => ({
  Year:         String(yr),
  HealthX:      healthXSessions.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
  Internships:  internships.filter(i => i.year === yr).reduce((s, i) => s + i.students,         0),
})).filter(d => d.HealthX + d.Internships > 0);

// Heatmap: session type Ã— score dimension
const HX_SESSION_TYPES = ["Health Facility Visit", "Innovation Challenge", "Field Exposure", "Industry Tour"] as const;
const SCORE_DIMS = ["Learning Experience", "Practical Relevance", "Accessibility", "Innovation Impact"] as const;

const hxHeatmap = HX_SESSION_TYPES.map(type => {
  const sessions = healthXSessions.filter(h => h.type === type);
  return {
    type,
    "Learning Experience":  parseFloat(avg(sessions.map(h => h.scores["Learning Experience"])).toFixed(1)),
    "Practical Relevance":  parseFloat(avg(sessions.map(h => h.scores["Practical Relevance"])).toFixed(1)),
    "Accessibility":        parseFloat(avg(sessions.map(h => h.scores["Accessibility"])).toFixed(1)),
    "Innovation Impact":    parseFloat(avg(sessions.map(h => h.scores["Innovation Impact"])).toFixed(1)),
  };
});

const hxSatByType = HX_SESSION_TYPES.map(type => {
  const sessions = healthXSessions.filter(h => h.type === type);
  return { name: type, value: parseFloat(avg(sessions.map(h => avg(Object.values(h.scores)))).toFixed(1)) };
}).sort((a, b) => b.value - a.value);

const TYPE_HEX: Record<string, string> = {
  "Health Facility Visit": TEAL,
  "Innovation Challenge":  VIOLET,
  "Field Exposure":        SKY,
  "Industry Tour":         AMBER,
};

const genderByProg = [
  { label: "HealthX",     femalePct: FEMALE_PCT_HX, maleColor: TEAL  },
  { label: "Internships", femalePct: FEMALE_PCT_IN, maleColor: AMBER },
  { label: "Students",    femalePct: FEMALE_PCT_ST, maleColor: SKY   },
];

const countryCounts = Object.entries(
  [
    ...healthXSessions.map(h => ({ country: h.country, n: h.participants })),
    ...internships.map(i    => ({ country: i.country,  n: i.students     })),
  ].reduce<Record<string, number>>((acc, { country, n }) => {
    acc[country] = (acc[country] || 0) + n;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
const COUNTRY_HEX = [VIOLET, TEAL, ORANGE, SKY, AMBER, GREEN, ROSE, INDIGO, PURPLE, "#EC4899"];

const trackCounts = (["Health Innovation", "Health Management", "Health Policy", "Digital Health"] as const).map(track => ({
  name:  track,
  value: missionStudents.filter(s => s.track === track).length,
}));
const TRACK_HEX = [VIOLET, TEAL, AMBER, SKY];

const empOutcomes = [
  { name: "Employed",      value: completed.filter(s => s.employment === "Employed").length      },
  { name: "Entrepreneur",  value: completed.filter(s => s.employment === "Entrepreneur").length  },
  { name: "Further Study", value: completed.filter(s => s.employment === "Further Study").length },
  { name: "Seeking",       value: completed.filter(s => s.employment === "Seeking").length       },
];
const EMP_HEX = [GREEN, VIOLET, SKY, AMBER];

const intSatBySector = Object.entries(
  internships.reduce<Record<string, number[]>>((acc, i) => {
    if (!acc[i.sector]) acc[i.sector] = [];
    acc[i.sector].push(i.satisfactionScore);
    return acc;
  }, {})
).map(([name, scores]) => ({ name, value: parseFloat(avg(scores).toFixed(1)) }))
  .sort((a, b) => b.value - a.value);
const SECTOR_HEX = [GREEN, VIOLET, TEAL, AMBER, SKY, ROSE];

// â"€â"€â"€ Sub-components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

// ─── Impact analytics constants ──────────────────────────────────────────────
const HMP_YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type HmpYearVal = typeof HMP_YEARS[number] | "all";
const HMP_SECTORS: InternshipSector[] = ["Hospital", "NGO", "Government", "MedTech", "Pharma", "Research"];
const HMP_TRACKS: StudentTrack[] = ["Health Innovation", "Health Management", "Health Policy", "Digital Health"];
const HMP_TRACK_COLORS = ["#0D9488", "#F59E0B", "#7C3AED", "#0EA5E9"];
const HMP_SECTOR_COLORS = ["#F43F5E", "#0D9488", "#4338CA", "#EA580C", "#7C3AED", "#10B981"];
const HMP_ALL_COUNTRIES = Array.from(new Set([
  ...healthXSessions.map(h => h.country),
  ...internships.map(i => i.country),
]));


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

// â"€â"€â"€ Derived data for the restructured (pipeline) overview â"€â"€â"€
const HEMP_COMPARE: { name: string; reach: number; sat: number | null; comp: number | null }[] = [
  { name: "HealthX",          reach: hxPart,        sat: hxSatAvg,  comp: hxCompAvg },
  { name: "Internships",      reach: intStudents,   sat: intSatAvg, comp: null },
  { name: "Mission Students", reach: totalStudents, sat: null,      comp: completionPct },
];

const pipelineSteps: { value: string; label: string }[] = [
  { value: String(totalStudents),    label: "Mission Students" },
  { value: hxPart.toLocaleString(),  label: "HealthX Experiences" },
  { value: String(intStudents),      label: "Internship Placements" },
  { value: String(intConversions),   label: "Employment Conversions" },
  { value: String(completed.length), label: "Graduates" },
  { value: `${employPct}%`,          label: "Employment Rate" },
  { value: String(ventures.length),  label: "Ventures Created" },
];

const hempInsights = [
  `HealthX has reached ${hxPart.toLocaleString()} participants across ${healthXSessions.length} sessions.`,
  `${intStudents > 0 ? Math.round(intConversions / intStudents * 100) : 0}% of internships convert into employment.`,
  `${employPct}% of graduates are employed or running ventures.`,
  `Female participation stands at ${FEMALE_PCT_ALL}% across all HEMP programmes.`,
  `Mission Students have launched ${ventures.length} ventures.`,
  `Programme completion among mission students stands at ${completionPct}%.`,
];

function QuickCard({ label, count, sub }: { label: string; count: number | string; sub: string }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(242,101,34,0.12)", borderLeft: "5px solid #F26522" }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(242,101,34,0.55)", marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#F26522", lineHeight: 1 }}>{count}</p>
      <p style={{ fontSize: 9.5, color: "rgba(242,101,34,0.55)", marginTop: 4 }}>{sub}</p>
    </div>
  );
}

function Pipeline({ steps }: { steps: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-stretch" style={{ flex: "1 1 110px" }}>
          <div className="flex-1 rounded-lg text-center px-2 py-3" style={{ border: "1px solid rgba(242,101,34,0.12)", borderTop: "3px solid #F26522" }}>
            <p className="font-black tabular-nums" style={{ fontSize: 20, color: "#F26522", lineHeight: 1 }}>{s.value}</p>
            <p className="text-[9px] text-gray-500 mt-1 font-medium leading-tight">{s.label}</p>
          </div>
          {i < steps.length - 1 && <div className="flex items-center px-0.5" style={{ color: "rgba(242,101,34,0.4)", fontSize: 16 }}>→</div>}
        </div>
      ))}
    </div>
  );
}

function CompareTable({ rows }: { rows: { name: string; reach: number; sat: number | null; comp: number | null }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead><tr>
          <th className="text-left text-gray-400 font-bold pb-3 pr-6 uppercase tracking-wider text-[9px]">Programme</th>
          <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Reach</th>
          <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Satisfaction</th>
          <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Completion</th>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className="border-t border-gray-100">
              <td className="py-2.5 pr-6 whitespace-nowrap"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#F26522" }} /><span className="font-semibold text-gray-700">{r.name}</span></span></td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums text-gray-700">{r.reach.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: "#F26522" }}>{r.sat !== null ? `${r.sat}/5` : "—"}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: "#F26522" }}>{r.comp !== null ? `${r.comp}%` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InsightList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((t, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <span className="rounded-full flex-shrink-0 mt-1.5" style={{ width: 6, height: 6, backgroundColor: "#F26522" }} />
          <p className="text-[12px] text-gray-700 leading-relaxed">{t}</p>
        </div>
      ))}
    </div>
  );
}

// Red → amber → green based on progress against benchmark
function benchColor(pct: number, bench: number): string {
  const r = bench > 0 ? pct / bench : 1;
  if (r >= 1)    return "#16A34A";
  if (r >= 0.95) return "#84CC16";
  if (r >= 0.8)  return "#F59E0B";
  return "#DC2626";
}

function KpiTile({ label, num, displayFmt, sub, clr, pct, bench, Icon }: {
  label: string; num: number; displayFmt: (n: number) => string; sub: string; clr: string;
  pct?: number; bench?: number; Icon?: LucideIcon;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(242,101,34,0.12)", borderLeft: "5px solid #F26522" }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(242,101,34,0.55)", marginBottom: 8 }}>{label}</p>
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon size={18} style={{ color: "#F26522", opacity: 0.85, flexShrink: 0 }} />}
        <p style={{ fontSize: 22, fontWeight: 700, color: "#F26522", lineHeight: 1 }}>{displayFmt(animated)}</p>
      </div>
      <p style={{ fontSize: 9.5, color: "rgba(242,101,34,0.55)", marginTop: 4 }}>{sub}</p>
      {pct !== undefined && (
        <div className="relative" style={{ marginTop: 10, height: 4, borderRadius: 4, backgroundColor: "rgba(242,101,34,0.12)" }} title={bench !== undefined ? `Benchmark: ${Math.round(bench)}%` : undefined}>
          <div style={{ height: "100%", width: `${Math.max(4, Math.min(100, pct))}%`, backgroundColor: bench !== undefined ? benchColor(pct, bench) : "#F26522", borderRadius: 4 }} />
          {bench !== undefined && (
            <div className="absolute" style={{ top: -3, bottom: -3, width: 2, left: `${Math.min(100, bench)}%`, backgroundColor: "#F26522", borderRadius: 1 }} />
          )}
        </div>
      )}
    </div>
  );
}

function ExecCard({ label, value, sub, color, note, icon: Icon }: {
  label: string; value: string | number; sub?: string; color: string; note?: string; icon?: LucideIcon;
}) {
  return (
    <div className="rounded border p-3 shadow-sm" style={{ backgroundColor: color, borderColor: color }}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-none"
          style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
        {Icon && (
          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
            <Icon size={11} style={{ color: "rgba(255,255,255,0.88)" }} />
          </div>
        )}
      </div>
      <p className="text-xl font-black tabular-nums leading-none text-white">{value}</p>
      {sub  && <p className="text-[9px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.68)" }}>{sub}</p>}
      {note && <p className="text-[9px] mt-1.5 pt-1.5" style={{ color: "rgba(255,255,255,0.55)", borderTop: "1px solid rgba(255,255,255,0.18)" }}>{note}</p>}
    </div>
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#D17A86" }} />
      <div>
        <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: "#F26522", letterSpacing: "0.01em" }}>{title}</h2>
        {sub && <p className="mt-0.5" style={{ fontSize: 11, color: "#6B7280" }}>{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = VIOLET, children }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  async function handleDownload() {
    if (!cardRef.current) return;
    const h2c = (await import("html2canvas")).default;
    const canvas = await h2c(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const a = document.createElement("a");
    a.download = title.replace(/[^a-z0-9]/gi, "_") + ".png";
    a.href = canvas.toDataURL();
    a.click();
  }
  return (
    <div ref={cardRef} className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#F26522", padding: "11px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
        </div>
        <button onClick={handleDownload} title="Download chart"
          style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}>
          <Download size={12} />
        </button>
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

function GenderBar({ label, femalePct, maleColor }: { label: string; femalePct: number; maleColor: string }) {
  const [hovered, setHovered] = useState<{ label: string; pct: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div className="relative flex items-center gap-3 mb-3 last:mb-0"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <div className="w-24 text-[11px] text-gray-600 text-right font-medium flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-5 rounded-sm overflow-hidden flex" style={{ backgroundColor: ROSE + "15" }}>
        <div style={{ width: `${femalePct}%`, backgroundColor: ROSE, cursor: "pointer",
            opacity: hovered && hovered.label !== "Female" ? 0.45 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Female", pct: femalePct, color: ROSE })} />
        <div style={{ width: `${100 - femalePct}%`, backgroundColor: maleColor, cursor: "pointer",
            opacity: hovered && hovered.label !== "Male" ? 0.45 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Male", pct: 100 - femalePct, color: maleColor })} />
      </div>
      <div className="text-[11px] font-bold w-8 flex-shrink-0 text-right" style={{ color: ROSE }}>{femalePct}%</div>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hovered.color, left: pos.x, top: pos.y - 30, transform: "translateX(-50%)" }}>
          {hovered.label}: {hovered.pct}%
        </div>
      )}
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

// â"€â"€â"€ Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function HEMPOverview() {
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <HEMPNav />

      {/* â"€â"€ HEADER + KPI STRIP â"€â"€â"€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#F26522", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/hempdesign.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
        <img src="/images/hempdesign.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(242,101,34,0) 0%, #F26522 34%, #F26522 66%, rgba(242,101,34,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Overview</h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Briefcase size={11} style={{ color: "#F59E0B" }} />
                <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#F59E0B" }}>HEMP</span>
              </span>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              HEMP Programme  ·  2021 - 2026  ·  {totalStudents} students  ·  {healthXSessions.length} HealthX sessions
            </p>
          </div>
        </div>
      </header>
      </div>

      {/* â"€â"€ KPI STRIP â"€â"€â"€ */}
      <div className="max-w-[1440px] mx-auto px-6 pt-5">
          <div className="pb-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <KpiTile label="Mission Students"    num={totalStudents}          displayFmt={n => String(Math.round(n))}         sub="Total enrolled"                  clr="#F26522" Icon={GraduationCap} />
              <KpiTile label="HealthX Sessions"    num={healthXSessions.length} displayFmt={n => String(Math.round(n))}         sub="Experiential sessions"           clr="#0F766E" Icon={Activity} />
              <KpiTile label="Female Reach"        num={FEMALE_PCT_ALL}         displayFmt={n => `${Math.round(n)}%`}           sub="Across all programmes"           clr="#9D174D" Icon={Sparkles} pct={FEMALE_PCT_ALL} bench={50} />
              <KpiTile label="Employment Rate"     num={employPct}              displayFmt={n => `${Math.round(n)}%`}           sub="Employed or entrepreneur"        clr="#065F46" Icon={Briefcase} pct={employPct} bench={70} />
              <KpiTile label="Internship Orgs"     num={internships.length}     displayFmt={n => String(Math.round(n))}         sub="Host organisations"              clr="#B45309" Icon={Building2} />
              <KpiTile label="Ventures Created"    num={ventures.length}        displayFmt={n => String(Math.round(n))}         sub="Student startups"                clr="#5B21B6" Icon={Rocket} />
              <KpiTile label="Internship Students" num={intStudents}            displayFmt={n => String(Math.round(n))}         sub="Total placements"                clr="#1E3A8A" Icon={Users} />
              <KpiTile label="Avg Satisfaction"    num={AVG_SAT}                displayFmt={n => `${n.toFixed(1)}/5`}          sub="HealthX &amp; internships"       clr="#881337" Icon={Star} pct={(AVG_SAT / 5) * 100} bench={80} />
            </div>
          </div>
      </div>

      {/* â"€â"€ BODY â"€â"€â"€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">


        {/* â"€â"€ SECTION 1: ENROLMENT & ACTIVITY â"€â"€â"€ */}
        {/* Section pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[{ n: 0, label: "All Sections" }, { n: 1, label: "Delivery" }, { n: 2, label: "Students" }, { n: 3, label: "Learning" }, { n: 4, label: "Outcomes" }, { n: 5, label: "Partnerships" }, { n: 6, label: "Insights" }].map(({ n, label }) => {
            const on = n === 0 ? activeSection === "all" : activeSection === n;
            return (
              <button key={n} onClick={() => setActiveSection(n === 0 ? "all" : n)}
                style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer", border: `1px solid ${on ? "#F26522" : "rgba(242,101,34,0.18)"}`, backgroundColor: on ? "#F26522" : "white", color: on ? "white" : "#6B7280" }}>
                {label}
              </button>
            );
          })}
        </div>

        <section style={{ display: show(1) ? undefined : "none" }}>
          <SecHeader title="Programme Delivery"
            sub="How much programming has HEMP delivered across cohorts, HealthX and internships?" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <QuickCard label="Mission Students" count={YEARS.length}          sub="Cohorts · 2021–2026" />
            <QuickCard label="HealthX"          count={healthXSessions.length} sub="Sessions" />
            <QuickCard label="Internships"      count={intStudents}            sub="Placements" />
            <QuickCard label="Internship Orgs"  count={internships.length}     sub="Host organisations" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Student Enrolment by Cohort"
              sub="Cohort status  -  Completed  ·  Active  ·  Deferred"
              accent={VIOLET}>
              <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                {[["Completed", GREEN], ["Active", VIOLET], ["Deferred", AMBER]].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c as string }} />{l}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={enrolmentByYear} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                  <Bar dataKey="Completed" fill={GREEN}  radius={[0,0,0,0]} />
                  <Bar dataKey="Active"    fill={VIOLET} radius={[0,0,0,0]} />
                  <Bar dataKey="Deferred"  fill={AMBER}  radius={[0,0,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Programme Reach by Year"
              sub="HealthX participants and internship placements  -  year on year"
              accent={TEAL}>
              <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                {[["HealthX", TEAL], ["Internships", AMBER]].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c as string }} />{l}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={208}>
                <AreaChart data={reachByYear}>
                  <defs>
                    {([[TEAL, "ag0"], [AMBER, "ag1"]] as [string, string][]).map(([hex, id]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={hex} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={hex} stopOpacity={0.03} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                  <Area type="monotone" dataKey="HealthX"     stroke={TEAL}  strokeWidth={2} fill="url(#ag0)" dot={false} />
                  <Area type="monotone" dataKey="Internships" stroke={AMBER} strokeWidth={2} fill="url(#ag1)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        </section>

        {/* â"€â"€ SECTION 2: DIVERSITY & REACH â"€â"€â"€ */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SecHeader title="Student Reach &amp; Diversity"
            sub="Gender representation, country coverage, and student track distribution" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <ChartCard title="Gender Representation by Programme"
              sub="Female (rose) vs Male  -  per programme type"
              accent={ROSE}>
              <div className="flex items-center gap-5 text-[10px] text-gray-400 mb-5">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: ROSE }} /> Female</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#60A5FA" }} /> Male</span>
                <span className="ml-auto font-bold" style={{ color: ROSE }}>Platform avg: {FEMALE_PCT_ALL}%</span>
              </div>
              {genderByProg.map(g => (
                <GenderBar key={g.label} label={g.label} femalePct={g.femalePct} maleColor={g.maleColor} />
              ))}
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {genderByProg.map(g => (
                  <div key={g.label}>
                    <p className="text-sm font-black" style={{ color: ROSE }}>{g.femalePct}%</p>
                    <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{g.label}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Country Coverage"
              sub="HealthX + internship reach by country"
              accent={SKY}>
              <ColorBarList data={countryCounts.slice(0, 9)} colors={COUNTRY_HEX} />
            </ChartCard>

            <ChartCard title="Student Track Distribution"
              sub="Mission students by programme track  ·  2021 - 2026"
              accent={VIOLET}>
              <CustomDonut
                data={trackCounts}
                colors={TRACK_HEX}
                className="h-44"
                label={`${totalStudents}`}
                valueFormatter={(v: number) => `${v} students`}
              />
              <div className="mt-3 space-y-1">
                {trackCounts.map((t, i) => (
                  <div key={t.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-600 truncate min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TRACK_HEX[i] }} />
                      <span className="truncate">{t.name}</span>
                    </span>
                    <span className="font-bold text-gray-700 ml-2 flex-shrink-0">
                      {t.value} ({Math.round(t.value / totalStudents * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* â"€â"€ SECTION 3: PERFORMANCE â"€â"€â"€ */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SecHeader title="Learning Experience"
            sub="HealthX satisfaction by session type and dimension  -  internship sector comparison" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="HealthX Satisfaction Heatmap  -  Type Ã— Dimension"
              sub="Avg score  ·  Teal â‰¥4.5  ·  Violet â‰¥4.0  ·  Amber â‰¥3.5  ·  Rose <3.5"
              accent={TEAL}>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-3 uppercase tracking-wider text-[9px]">Session Type</th>
                      {SCORE_DIMS.map(d => (
                        <th key={d} className="text-center text-gray-400 font-bold pb-3 px-1 min-w-[60px] uppercase tracking-wider text-[9px] leading-tight">{d}</th>
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
                          <td className="py-2.5 pr-3">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: TYPE_HEX[row.type] }} />
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
                <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400 flex-wrap">
                  {([["Very High (â‰¥4.5)", TEAL], ["High (â‰¥4.0)", VIOLET], ["Moderate (â‰¥3.5)", AMBER], ["Low (<3.5)", ROSE]] as const).map(([l, c]) => (
                    <span key={l} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                    </span>
                  ))}
                </div>
              </div>
            </ChartCard>

            <div className="space-y-4">
              <ChartCard title="HealthX Avg Satisfaction by Type"
                sub="Overall satisfaction rating (1 - 5) per session category"
                accent={VIOLET}>
                <div className="space-y-3">
                  {hxSatByType.map(d => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_HEX[d.name] }} />
                          {d.name}
                        </span>
                        <span className="font-bold tabular-nums" style={{ color: TYPE_HEX[d.name] }}>{d.value}/5</span>
                      </div>
                      <div className="h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: TYPE_HEX[d.name] + "18" }}>
                        <div className="h-full transition-all"
                          style={{ width: `${(d.value / 5) * 100}%`, backgroundColor: d.value >= 4.5 ? TEAL : d.value >= 4.0 ? VIOLET : AMBER }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Internship Satisfaction by Sector"
                sub="Average satisfaction score per placement sector"
                accent={AMBER}>
                <div className="space-y-3">
                  {intSatBySector.map((d, i) => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTOR_HEX[i % SECTOR_HEX.length] }} />
                          {d.name}
                        </span>
                        <span className="font-bold tabular-nums" style={{ color: SECTOR_HEX[i % SECTOR_HEX.length] }}>{d.value}/5</span>
                      </div>
                      <div className="h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: SECTOR_HEX[i % SECTOR_HEX.length] + "18" }}>
                        <div className="h-full transition-all"
                          style={{ width: `${(d.value / 5) * 100}%`, backgroundColor: d.value >= 4.5 ? GREEN : d.value >= 4.0 ? TEAL : AMBER }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

          </div>
          <div className="mt-4">
            <ChartCard title="Programme Comparison" sub="Reach, satisfaction and completion side by side — internships are not completion-tracked">
              <CompareTable rows={HEMP_COMPARE} />
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 4: GRADUATE OUTCOMES & INNOVATION â"€â"€â"€ */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SecHeader title="Graduate Outcomes &amp; Innovation"
            sub={`${completed.length} graduates  ·  ${ventures.length} ventures  ·  ${intConversions} internship-to-hire conversions`} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <ChartCard title="Graduate Employment Outcomes"
              sub="Employment status for all completed mission students"
              accent={GREEN}>
              <CustomDonut
                data={empOutcomes}
                colors={EMP_HEX}
                className="h-40"
                label={`${completed.length}`}
                valueFormatter={(v: number) => `${v} graduates`}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-center">
                {empOutcomes.map((e, i) => (
                  <div key={e.name}>
                    <p className="text-base font-black" style={{ color: EMP_HEX[i] }}>{e.value}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium leading-tight">{e.name}</p>
                    <p className="text-[9px] text-gray-400">{completed.length ? Math.round(e.value / completed.length * 100) : 0}%</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Key Programme Outcomes"
              sub="Cumulative impact across HEMP 2021 - 2026"
              accent={VIOLET}>
              <div className="space-y-3 mt-1">
                {([
                  { label: "HealthX Participants",   value: hxPart.toLocaleString(), color: TEAL,   sub: `${healthXSessions.length} sessions delivered`  },
                  { label: "Internship Conversions",  value: intConversions,          color: AMBER,  sub: `Of ${intStudents} total placements`             },
                  { label: "Student Ventures Created",value: ventures.length,         color: VIOLET, sub: "Startups from programme alumni"                 },
                  { label: "HealthX Partnerships",    value: hxPship,                 color: SKY,    sub: "Industry & facility collaborations"             },
                  { label: "Graduates",               value: completed.length,        color: GREEN,  sub: `${completionPct}% programme completion rate`   },
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

            <ChartCard title="Programme Scale Overview"
              sub="Sessions and reach across all HEMP programme types"
              accent={ORANGE}>
              <div className="space-y-4">
                {([
                  { label: "HealthX Sessions",   count: healthXSessions.length, reach: hxPart,      unit: "participants", color: TEAL   },
                  { label: "Internship Orgs",    count: internships.length,     reach: intStudents,  unit: "students",    color: AMBER  },
                  { label: "Mission Students",   count: YEARS.length,           reach: totalStudents,unit: "students",    color: VIOLET },
                ] as const).map(row => {
                  const total = hxPart + intStudents + totalStudents;
                  const pct = Math.round(row.reach / total * 100);
                  return (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                          {row.label}
                        </span>
                        <span className="text-gray-400 tabular-nums">
                          <span className="font-bold text-gray-700">{row.count}</span>{" "}
                          {row.label === "Mission Students" ? "cohorts" : "entries"}  · {" "}
                          <span className="font-bold" style={{ color: row.color }}>{row.reach.toLocaleString()}</span> {row.unit}
                        </span>
                      </div>
                      <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: row.color + "1A" }}>
                        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: row.color }} />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5 text-right">{pct}% of total reach</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* â"€â"€ SECTION 5: PARTNERSHIPS & ECOSYSTEM â"€â"€â"€ */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SecHeader title="Partnerships &amp; Ecosystem"
            sub={`${internships.length} internship organisations  ·  ${hxPship} HealthX partnerships  ·  ${countryCounts.length} countries`} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <QuickCard label="Internship Orgs"     count={internships.length} sub="Host partners" />
            <QuickCard label="HealthX Partnerships" count={hxPship}            sub="MOUs & collaborations" />
            <QuickCard label="Students Hosted"      count={intStudents}        sub="Internship placements" />
            <QuickCard label="Countries"            count={countryCounts.length} sub="Geographic reach" />
          </div>
          <ChartCard title="Partner Reach by Country" sub="Participants reached across HealthX and internships, by country">
            <ColorBarList data={countryCounts} colors={COUNTRY_HEX} />
          </ChartCard>
        </section>

        {/* â"€â"€ SECTION 6: KEY INSIGHTS â"€â"€â"€ */}
        <section style={{ display: show(6) ? undefined : "none" }}>
          <SecHeader title="Key Insights"
            sub="Executive highlights across delivery, students, learning, outcomes and partnerships" />
          <ChartCard title="Programme Highlights" sub="Auto-generated from the latest HEMP data">
            <InsightList items={hempInsights} />
          </ChartCard>
        </section>

        {/* -- FOOTER (executive style, HEMP violet header design) -- */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#F26522", minHeight: 116, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/hempdesign.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
          <img src="/images/hempdesign.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(242,101,34,0) 0%, #F26522 34%, #F26522 66%, rgba(242,101,34,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>Africa&apos;s Oasis for Health &amp; Education Transformation</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(255,237,213,0.85)" }}>
                <span style={{ color: "#FDBA74", fontWeight: 600 }}>Data Last Synced:</span> 04 Jun 2026, EAT
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,237,213,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(255,237,213,0.85)" }}>
                <span style={{ color: "#FDBA74", fontWeight: 600 }}>Source:</span> HEMP Programmes M&amp;E
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,237,213,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(255,237,213,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>
                Contact Analyst
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
