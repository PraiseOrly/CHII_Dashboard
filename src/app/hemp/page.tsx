"use client";
import { sieCohorts } from "@/data/hemp/sie";
import { ghCohorts } from "@/data/hemp/global-health";
import { healthXSymposia } from "@/data/hemp/healthx-careers";
import { InlineFilterSelect as FilterSelect } from "@/components/ui/hemp";
import { ChartCard, SectionHeader, InfoDot, Funnel, ChartTip, ChartLegend, BarList, useCountUp } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import PortalFooter from "@/components/layout/portal-footer";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import { DonutRing } from "@/components/charts/donut-chart";
import AfricaMap from "@/components/charts/africa-map";
import { type RadarSeries } from "@/components/charts/satisfaction-radar";
import SatisfactionBars from "@/components/charts/satisfaction-bars";
import BulletChart from "@/components/charts/bullet-chart";
import ProgressRing from "@/components/charts/progress-ring";
import { PALETTE } from "@/styles/palette";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/mission-students";
import {
  Activity, Award, Briefcase, Building2, GraduationCap, Handshake,
  Rocket, Sparkles, Star, TrendingUp, Users, Zap, type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Brand ───────────────────────────────────────────────────────────────────
// Blue/navy theme mirrored from the CHII Executive (Impact) Dashboard.
const HERO     = "#102C5E"; // page header + footer hero fill
const BRAND    = "#14306B"; // chart-card headers, pills, borders
const SECTION  = "#185FA5"; // section bars + section titles
const BRAND_DK = "#0C447C"; // deep blue for value text
// Executive chart-series palette (bars & trend series)
const TH_NAVY   = "#102C5E";
const TH_BLUE   = "#479BD6";
const TH_ORANGE = "#D45F2C";

const TEAL     = TH_NAVY;   // HealthX
const AMBER    = TH_BLUE;   // Internships
const VIOLET   = TH_ORANGE; // Mission Students
const SKY      = "#7F77DD"; // indigo 400 (4th session type)
const GREEN    = "#0F6E56"; // teal 600
const ROSE     = "#BA7517"; // amber 400 (attention only)

// Per-programme identity colours — the executive's chart-series hues.
const PROG: Record<string, string> = {
  HealthX:            TEAL,
  Internships:        AMBER,
  "Mission Students": VIOLET,
};
const PROG_YEAR_COLORS = [PROG.HealthX, PROG.Internships, PROG["Mission Students"]] as const;

// Donut palette — executive design tokens only, ordered for maximum hue separation
const DISTINCT = ["#185FA5","#0F6E56","#534AB7","#BA7517","#479BD6","#1D9E75","#7F77DD","#D45F2C","#14306B","#085041","#2F5FD1","#85B7EB","#378ADD","#5F5E5A","#102C5E"];
// Blue-family ramp for categorical charts (countries, regions, sectors)
const WARM_RAMP = ["#14306B","#185FA5","#2F5FD1","#378ADD","#479BD6","#85B7EB","#0C447C","#102C5E","#0F6E56","#1D9E75","#534AB7","#7F77DD","#BA7517","#D45F2C","#5F5E5A"];
const PALETTE_NEUTRAL = "#5F5E5A"; // executive gray 600

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// ─── Cross-programme aggregates ──────────────────────────────────────────────
const hxSessions = healthXSessions.length;
const hxPart     = healthXSessions.reduce((s, h) => s + h.participants, 0);
const hxFem      = healthXSessions.reduce((s, h) => s + h.femalePart,   0);
const hxPship    = healthXSessions.reduce((s, h) => s + h.partnerships, 0);
const hxCompAvg  = Math.round(avg(healthXSessions.map(h => h.completionRate)));
const hxSatAvg   = parseFloat(avg(healthXSessions.map(h => avg(Object.values(h.scores)))).toFixed(1));

const intOrgs        = internships.length;
const intStudents    = internships.reduce((s, i) => s + i.students,              0);
const intFem         = internships.reduce((s, i) => s + i.femaleStudents,        0);
const intConversions = internships.reduce((s, i) => s + i.employmentConversions, 0);
const intSatAvg      = parseFloat(avg(internships.map(i => i.satisfactionScore)).toFixed(1));

const totalStudents = missionStudents.length;
const studentFem    = missionStudents.filter(s => s.gender === "Female").length;
const completed     = missionStudents.filter(s => s.status === "Completed");
const employed      = completed.filter(s => s.employment === "Employed" || s.employment === "Entrepreneur");
const ventures      = missionStudents.filter(s => s.ventureCreated);
const completionPct = Math.round(completed.length / totalStudents * 100);
const employPct     = completed.length ? Math.round(employed.length / completed.length * 100) : 0;

// SIE, Intro to Global Health and the HealthX careers symposia are HEMP
// programmes too. They were missing from the pillar rollup, so HEMP's headline
// reach under-reported its own delivery.
const sieSelected  = sieCohorts.reduce((s, c) => s + c.selected, 0);
const sieFem       = sieCohorts.reduce((s, c) => s + c.female,   0);

const ghEnrolled   = ghCohorts.reduce((s, c) => s + c.enrolled, 0);
const ghFem        = ghCohorts.reduce((s, c) => s + c.female,   0);

const symStudents  = healthXSymposia.reduce((s, x) => s + x.studentsAttending, 0);
const symFem       = healthXSymposia.reduce((s, x) => s + x.femaleStudents,    0);

const FEMALE_PCT_HX  = Math.round(hxFem      / hxPart       * 100);
const FEMALE_PCT_IN  = Math.round(intFem     / intStudents   * 100);
const FEMALE_PCT_ST  = Math.round(studentFem / totalStudents * 100);

const TOTAL_REACH    = hxPart + intStudents + totalStudents + sieSelected + ghEnrolled + symStudents;
const TOTAL_FEM      = hxFem  + intFem      + studentFem    + sieFem      + ghFem      + symFem;
const FEMALE_PCT_ALL = Math.round(TOTAL_FEM / TOTAL_REACH * 100);
const AVG_SAT        = parseFloat(((hxSatAvg + intSatAvg) / 2).toFixed(1));
const TOTAL_PSHIP    = hxPship + intOrgs;

// ─── Chart data ──────────────────────────────────────────────────────────────
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

const activityByYear = YEARS
  .map(yr => ({
    Year:              String(yr),
    HealthX:           healthXSessions.filter(h => h.year === yr).length,
    Internships:       internships.filter(i => i.year === yr).length,
    "Mission Students":missionStudents.filter(s => s.cohort === yr).length ? 1 : 0,
  }))
  .filter(d => d.HealthX + d.Internships + d["Mission Students"] > 0);

const participantsByYear = YEARS
  .map(yr => ({
    Year:              String(yr),
    HealthX:           healthXSessions.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
    Internships:       internships.filter(i => i.year === yr).reduce((s, i) => s + i.students, 0),
    "Mission Students":missionStudents.filter(s => s.cohort === yr).length,
  }))
  .filter(d => d.HealthX + d.Internships + d["Mission Students"] > 0);

const genderByProg = [
  { label: "HealthX",            femalePct: FEMALE_PCT_HX },
  { label: "Internships",        femalePct: FEMALE_PCT_IN },
  { label: "Mission Students",   femalePct: FEMALE_PCT_ST },
];

const participantsByProgData = [
  { name: "HealthX",            value: hxPart },
  { name: "Internships",        value: intStudents },
  { name: "Mission Students",   value: totalStudents },
  { name: "SIE",                value: sieSelected },
  { name: "Global Health",      value: ghEnrolled },
  { name: "Career Symposia",    value: symStudents },
].sort((a, b) => b.value - a.value);

// ─── Geographic reach ────────────────────────────────────────────────────────
type ReachRec = { country: string; year: number; reach: number; female: number };
const REACH_RECORDS: ReachRec[] = [
  ...healthXSessions.map(h => ({ country: h.country, year: h.year,   reach: h.participants, female: h.femalePart })),
  ...internships.map(i    => ({ country: i.country,  year: i.year,   reach: i.students,     female: i.femaleStudents })),
  ...missionStudents.map(s => ({ country: s.country, year: s.cohort, reach: 1,              female: s.gender === "Female" ? 1 : 0 })),
];
const COUNTRY_REGION: Record<string, string> = {
  Rwanda: "East Africa", Kenya: "East Africa", Uganda: "East Africa", Tanzania: "East Africa", Ethiopia: "East Africa",
  Ghana: "West Africa", Nigeria: "West Africa", Senegal: "West Africa",
  "South Africa": "Southern Africa", Malawi: "Southern Africa", Mozambique: "Southern Africa", Zambia: "Southern Africa",
  Cameroon: "Central Africa",
};
const GEO_REGIONS   = Array.from(new Set(Object.values(COUNTRY_REGION)));
const GEO_COUNTRIES = Array.from(new Set(REACH_RECORDS.map(r => r.country))).sort();
const GEO_YEARS     = Array.from(new Set(REACH_RECORDS.map(r => r.year))).sort();

// ─── Programme performance (radar / bullet / rings) ──────────────────────────
const HX_SESSION_TYPES = ["Health Facility Visit", "Innovation Challenge", "Field Exposure", "Industry Tour"] as const;
const SCORE_DIMS = ["Learning Experience", "Practical Relevance", "Accessibility", "Innovation Impact"] as const;

const TYPE_STYLE: Record<string, { color: string; dashed: boolean; fillOpacity: number }> = {
  "Health Facility Visit": { color: TEAL,   dashed: false, fillOpacity: 0.08 },
  "Innovation Challenge":  { color: VIOLET, dashed: false, fillOpacity: 0.08 },
  "Field Exposure":        { color: SKY,    dashed: true,  fillOpacity: 0.06 },
  "Industry Tour":         { color: AMBER,  dashed: true,  fillOpacity: 0.06 },
};
const radarSeries: RadarSeries[] = HX_SESSION_TYPES.map(type => {
  const sessions = healthXSessions.filter(h => h.type === type);
  const values = SCORE_DIMS.reduce<Record<string, number>>((a, d) => {
    a[d] = parseFloat(avg(sessions.map(h => h.scores[d])).toFixed(1)); return a;
  }, {});
  const avgScore = parseFloat(avg(SCORE_DIMS.map(d => values[d])).toFixed(1));
  const st = TYPE_STYLE[type];
  return { name: type, color: st.color, dashed: st.dashed, fillOpacity: st.fillOpacity, values, avg: avgScore };
});

const satBulletRows = [
  { name: "HealthX",     value: hxSatAvg,  color: TEAL  },
  { name: "Internships", value: intSatAvg, color: AMBER },
];
const compRingRows = [
  { name: "HealthX",          value: hxCompAvg,     color: TEAL   },
  { name: "Mission Students", value: completionPct, color: VIOLET },
];

const HEMP_COMPARE: { name: string; reach: number; sat: number | null; comp: number | null }[] = [
  { name: "HealthX",          reach: hxPart,        sat: hxSatAvg,  comp: hxCompAvg },
  { name: "Internships",      reach: intStudents,   sat: intSatAvg, comp: null },
  { name: "Mission Students", reach: totalStudents, sat: null,      comp: completionPct },
];

// ─── Outcomes & innovation ───────────────────────────────────────────────────
const empOutcomes = [
  { name: "Employed",      value: completed.filter(s => s.employment === "Employed").length      },
  { name: "Entrepreneur",  value: completed.filter(s => s.employment === "Entrepreneur").length  },
  { name: "Further Study", value: completed.filter(s => s.employment === "Further Study").length },
  { name: "Seeking",       value: completed.filter(s => s.employment === "Seeking").length       },
];

const outcomesByYear = YEARS
  .map(yr => {
    const grads = missionStudents.filter(s => s.cohort === yr && s.status === "Completed").length;
    const vents = missionStudents.filter(s => s.cohort === yr && s.ventureCreated).length;
    return { Year: String(yr), Graduates: grads, Ventures: vents, Rate: grads ? Math.round((vents / grads) * 100) : 0 };
  })
  .filter(d => d.Graduates + d.Ventures > 0);
const OUT_COLORS = [TH_NAVY, TH_BLUE] as const; // Graduates, Ventures

// ─── Ecosystem ───────────────────────────────────────────────────────────────
const trackCounts = (["Health Innovation", "Health Management", "Health Policy", "Digital Health"] as const)
  .map(track => ({ name: track, value: missionStudents.filter(s => s.track === track).length }));

const sectorCounts = Object.entries(
  internships.reduce<Record<string, number>>((a, i) => { a[i.sector] = (a[i.sector] || 0) + i.students; return a; }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

// ─── Insights ────────────────────────────────────────────────────────────────
const topReach = participantsByProgData[0];
const insights = [
  `${topReach.name} account for the largest share of participant reach (${topReach.value.toLocaleString()} people).`,
  `HealthX has reached ${hxPart.toLocaleString()} participants across ${hxSessions} experiential sessions.`,
  `${intStudents > 0 ? Math.round(intConversions / intStudents * 100) : 0}% of internship placements convert into employment.`,
  `${employPct}% of graduates are employed or running ventures.`,
  `Female participation stands at ${FEMALE_PCT_ALL}% across all HEMP programmes.`,
  `Mission Students have launched ${ventures.length} ventures to date.`,
  `Programme completion among mission students stands at ${completionPct}%.`,
];

function PlainCard({ title, sub, chip, fill, children }: {
  title: string; sub?: string; chip?: React.ReactNode; fill?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden" style={{
      backgroundColor: "#fff", border: `1px solid ${PALETTE.border}`, borderRadius: 12,
      height: fill ? "100%" : undefined, display: fill ? "flex" : undefined, flexDirection: fill ? "column" : undefined,
    }}>
      <div className="flex items-center justify-between gap-3" style={{ backgroundColor: BRAND, padding: "12px 20px" }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1.2 }}>{title}</p>
          {sub && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{sub}</p>}
        </div>
        {chip}
      </div>
      <div style={{ padding: 20, flex: fill ? 1 : undefined, display: fill ? "flex" : undefined, flexDirection: fill ? "column" : undefined, justifyContent: fill ? "center" : undefined }}>
        {children}
      </div>
    </div>
  );
}

// Executive stat card. `value` may already be formatted ("42%", "1,204", "$1.2M"),
// so animate the numeric part and re-apply the original formatting.
function ExecCard({ label, value, sub, note, icon: Icon, tip }: {
  label: string; value: string | number; sub?: string; note?: string; icon?: LucideIcon; center?: boolean; tip?: string;
}) {
  const isNum = typeof value === "number";
  const numeric = isNum ? value : parseFloat(String(value).replace(/[^0-9.\-]/g, "")) || 0;
  const isPct = !isNum && String(value).trim().endsWith("%");
  const fmt = isNum
    ? (n: number) => Math.round(n).toLocaleString()
    : isPct
      ? (n: number) => `${Math.round(n)}%`
      : () => String(value);
  return (
    <StatsKpiCard
      label={label}
      num={numeric}
      displayFmt={fmt}
      sub={sub ?? note ?? ""}
      Icon={Icon ?? Activity}
      tooltip={tip ?? label}
    />
  );
}

function KpiTile({ label, num, displayFmt, sub, pct, bench, Icon, tip }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub?: string; pct?: number; bench?: number; Icon?: LucideIcon; tip?: string;
}) {
  return (
    <StatsKpiCard
      label={label}
      num={num}
      displayFmt={displayFmt}
      sub={sub ?? ""}
      pct={pct}
      bench={bench}
      Icon={Icon ?? Activity}
      tooltip={tip ?? label}
    />
  );
}

// ─── Chart tooltip ───────────────────────────────────────────────────────────
function tipFmt(n: number) { return Math.round(n).toLocaleString(); }
function ColorBarList({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const max = data[0]?.value ?? 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((row, i) => {
        const col = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="w-[104px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
            <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
              <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
            </div>
            <div className="text-[11px] font-bold w-8 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
          </div>
        );
      })}
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
              <td className="py-2.5 pr-6 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PROG[r.name] ?? BRAND }} />
                  <span className="font-semibold text-gray-700">{r.name}</span>
                </span>
              </td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums text-gray-700">{r.reach.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{r.sat !== null ? `${r.sat}/5` : "—"}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{r.comp !== null ? `${r.comp}%` : "—"}</td>
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
          <span className="rounded-full flex-shrink-0 mt-1.5" style={{ width: 6, height: 6, backgroundColor: BRAND }} />
          <p className="text-[12px] text-gray-700 leading-relaxed">{t}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HEMPOverview() {
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  // Geographic reach filters
  const [geoCountry, setGeoCountry] = useState("All Countries");
  const [geoYear, setGeoYear]       = useState("All Years");
  const [geoRegion, setGeoRegion]   = useState("All Regions");
  const geoCountryData = useMemo(() => {
    const counts = REACH_RECORDS
      .filter(r => geoRegion === "All Regions" || COUNTRY_REGION[r.country] === geoRegion)
      .filter(r => geoCountry === "All Countries" || r.country === geoCountry)
      .filter(r => geoYear === "All Years" || String(r.year) === geoYear)
      .reduce<Record<string, number>>((a, r) => { a[r.country] = (a[r.country] || 0) + r.reach; return a; }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [geoRegion, geoCountry, geoYear]);

  const [regionYear, setRegionYear] = useState("All Years");
  const regionChartData = useMemo(() => {
    const reach: Record<string, number> = {};
    const female: Record<string, number> = {};
    const countries: Record<string, Set<string>> = {};
    REACH_RECORDS
      .filter(r => regionYear === "All Years" || String(r.year) === regionYear)
      .forEach(r => {
        const reg = COUNTRY_REGION[r.country] || "Other";
        reach[reg] = (reach[reg] || 0) + r.reach;
        female[reg] = (female[reg] || 0) + r.female;
        (countries[reg] = countries[reg] || new Set()).add(r.country);
      });
    return Object.keys(reach)
      .map(reg => ({ name: reg, value: reach[reg], countries: countries[reg].size, female: female[reg] }))
      .sort((a, b) => b.value - a.value);
  }, [regionYear]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <PortalNav portal="hemp" />

      {/* ── EXECUTIVE HEADER ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design2.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Overview</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.82)" }}>Mission students, HealthX, internships and graduate impact</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.85)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.85)", fontWeight: 600 }}>Period:</span> 2021–2026</span>
              <span aria-hidden="true">·</span>
              <span>{totalStudents} students · {hxSessions} HealthX sessions</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.85)", fontWeight: 600 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* ── KPI STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiTile label="Total Reach"     num={TOTAL_REACH}   displayFmt={n => Math.round(n).toLocaleString()} Icon={Users}        tip="Total people reached across mission students, HealthX, internships, SIE, Intro to Global Health and the HealthX career symposia." />
          <KpiTile label="Mission Students" num={totalStudents} displayFmt={n => String(Math.round(n))}          Icon={GraduationCap} tip="Students enrolled in the HEMP mission programme." />
          <KpiTile label="Female Reach"    num={FEMALE_PCT_ALL} displayFmt={n => `${Math.round(n)}%`}            Icon={Sparkles}     pct={FEMALE_PCT_ALL} bench={50} tip={`Share of participants who are female (${TOTAL_FEM.toLocaleString()} people).`} />
          <KpiTile label="Partnerships"    num={TOTAL_PSHIP}    displayFmt={n => String(Math.round(n))}          Icon={Handshake}    tip="HealthX partnerships plus internship host organisations." />
          <KpiTile label="Employment Rate" num={employPct}     displayFmt={n => `${Math.round(n)}%`}            Icon={Briefcase}    pct={employPct} bench={70} tip="Graduates employed or running a venture." />
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Delivery", value: "1" },
              { label: "Participants", value: "2" },
              { label: "Performance", value: "3" },
              { label: "Outcomes", value: "4" },
              { label: "Ecosystem & Impact", value: "5" },
            ]}
          />
          <OutreachFilters
            accent={BRAND}
            activeCount={(geoCountry !== "All Countries" ? 1 : 0) + (geoYear !== "All Years" ? 1 : 0) + (geoRegion !== "All Regions" ? 1 : 0)}
            onReset={() => { setGeoCountry("All Countries"); setGeoYear("All Years"); setGeoRegion("All Regions"); }}
          >
            <OFilterSelect label="Country" value={geoCountry} onChange={setGeoCountry} accent={BRAND}
              options={["All Countries", ...GEO_COUNTRIES].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Year" value={geoYear} onChange={setGeoYear} accent={BRAND}
              options={["All Years", ...GEO_YEARS.map(String)].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Region" value={geoRegion} onChange={setGeoRegion} accent={BRAND}
              options={["All Regions", ...GEO_REGIONS].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        {/* ── SECTION 1: PROGRAMME DELIVERY ── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SectionHeader title="Programme Delivery" sub="How much programming has HEMP delivered across HealthX, internships and mission cohorts?" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <ExecCard label="HealthX Sessions" value={hxSessions}     icon={Activity} />
            <ExecCard label="Internship Orgs"  value={intOrgs}        icon={Building2} />
            <ExecCard label="Mission Cohorts"  value={YEARS.length}   icon={GraduationCap} />
            <ExecCard label="Countries"        value={GEO_COUNTRIES.length} icon={Users} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Delivery per Year" sub="Sessions & internship placements by year">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activityByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip hideLabel />} />
                  <Bar dataKey="HealthX"     fill={PROG.HealthX}     radius={[4, 4, 0, 0]} maxBarSize={16} />
                  <Bar dataKey="Internships" fill={PROG.Internships} radius={[4, 4, 0, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {(["HealthX","Internships"] as const).map((l) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PROG[l] }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Participants per Year" sub="Reach by programme type">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={participantsByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<ChartTip hideLabel />} />
                  {(["HealthX","Internships","Mission Students"] as const).map((cat, i) => (
                    <Line key={cat} type="monotone" dataKey={cat} stroke={PROG_YEAR_COLORS[i]} strokeWidth={2.5}
                      dot={{ r: 4, fill: PROG_YEAR_COLORS[i], strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {(["HealthX","Internships","Mission Students"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PROG_YEAR_COLORS[i] }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: PARTICIPANT REACH ── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SectionHeader title="Participant Reach" sub="Who are we reaching — gender distribution, programme reach, and geographic spread" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Gender Distribution" sub="Female vs male share by programme">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={genderByProg.map(g => ({ name: g.label, Female: g.femalePct, Male: 100 - g.femalePct }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip unit="%" />} />
                  <Bar dataKey="Female" stackId="g" fill="#185FA5"  maxBarSize={46} />
                  <Bar dataKey="Male"   stackId="g" fill="#85B7EB" radius={[4, 4, 0, 0]} maxBarSize={46} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#185FA5" }} /> Female</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#85B7EB" }} /> Male</span>
              </div>
            </ChartCard>

            <ChartCard title="Participants by Programme" sub="Reach by programme type">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={participantsByProgData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="value" name="Participants" radius={[4, 4, 0, 0]} maxBarSize={46}>
                    {participantsByProgData.map((d) => (<Cell key={d.name} fill={PROG[d.name] ?? PALETTE_NEUTRAL} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {participantsByProgData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PROG[d.name] ?? PALETTE_NEUTRAL }} />{d.name}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Geographic Reach" sub="Participants reached by country">
              <div className="flex flex-wrap gap-2 mb-4">
                <FilterSelect label="Country" value={geoCountry} onChange={setGeoCountry} options={["All Countries", ...GEO_COUNTRIES]} />
                <FilterSelect label="Year" value={geoYear} onChange={setGeoYear} options={["All Years", ...GEO_YEARS.map(String)]} />
              </div>
              {geoCountryData.length ? (
                <AfricaMap data={geoCountryData} region={geoRegion} onRegionChange={setGeoRegion} regions={["All Regions", ...GEO_REGIONS]}
                  lightColor="#C7DFFE" deepColor="#185FA5" tooltipColor="#042C53" />
              ) : (
                <p className="text-[11px] text-gray-400 text-center py-6">No records match the selected filters.</p>
              )}
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {geoCountryData.reduce((s, d) => s + d.value, 0).toLocaleString()} people · {geoCountryData.length} countries
              </p>
            </ChartCard>

            <ChartCard title="Reach by Region" sub="Participants, countries and female share by African region">
              <div className="flex flex-wrap gap-2 mb-4">
                <FilterSelect label="Year" value={regionYear} onChange={setRegionYear} options={["All Years", ...GEO_YEARS.map(String)]} />
              </div>
              {regionChartData.length ? (
                <>
                  <ResponsiveContainer width="100%" height={190}>
                    <BarChart data={regionChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                      <Bar dataKey="value" name="Participants" radius={[4, 4, 0, 0]} maxBarSize={46}>
                        {regionChartData.map((d, i) => (<Cell key={d.name} fill={WARM_RAMP[i % WARM_RAMP.length]} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    {regionChartData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: WARM_RAMP[i % WARM_RAMP.length] }} />
                          {d.name}
                        </span>
                        <span className="text-gray-500 tabular-nums">
                          <b className="text-gray-700">{d.value.toLocaleString()}</b> people · {d.countries} countries · {Math.round(d.female / d.value * 100) || 0}% female
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-gray-400 text-center py-6">No records match the selected filter.</p>
              )}
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: PROGRAMME PERFORMANCE ── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SectionHeader title="Programme Performance" sub="Are programmes delivering a high-quality experience? Satisfaction and completion compared across types" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <PlainCard title="HealthX satisfaction by dimension" sub="Average score per dimension (out of 5), by session type">
                <SatisfactionBars dimensions={SCORE_DIMS} series={radarSeries} target={4.5} height={360} />
              </PlainCard>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4 h-full">
              <PlainCard title="Satisfaction by programme" sub="Score vs. target of 4.5">
                <BulletChart rows={satBulletRows} target={4.5} />
              </PlainCard>
              <div className="flex-1">
                <PlainCard title="Completion by programme" sub="Share completed · target 90%" fill>
                  <div className="grid grid-cols-2" style={{ gap: 8 }}>
                    {compRingRows.map(r => (
                      <ProgressRing key={r.name} value={r.value} color={r.color} label={r.name} target={90} />
                    ))}
                  </div>
                </PlainCard>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ChartCard title="Programme Comparison" sub="Reach, satisfaction and completion side by side — internships are not completion-tracked">
              <CompareTable rows={HEMP_COMPARE} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 4: GRADUATE OUTCOMES ── */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SectionHeader title="Graduate Outcomes & Innovation" sub="How mission students convert into graduates, employment and ventures" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <ExecCard label="Graduates"              value={completed.length}  icon={GraduationCap} />
            <ExecCard label="Employment Conversions" value={intConversions}    icon={TrendingUp} />
            <ExecCard label="Ventures Created"       value={ventures.length}   icon={Rocket} />
            <ExecCard label="Employment Rate"        value={`${employPct}%`}   icon={Briefcase} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Talent Pipeline" sub="Students to employment">
              <Funnel steps={[
                { label: "Mission Students",      value: totalStudents },
                { label: "HealthX Experiences",   value: hxPart },
                { label: "Internship Placements", value: intStudents },
                { label: "Graduates",             value: completed.length },
                { label: "Employed / Venture",    value: employed.length },
              ]} />
              <div className="flex flex-wrap justify-center gap-3 text-[10px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {["Mission Students","HealthX Experiences","Internship Placements","Graduates","Employed / Venture"].map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND, opacity: 1 - i * 0.13 }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Graduate Employment Outcomes" sub="Employment status for all completed students">
              <DonutRing data={empOutcomes} colors={DISTINCT} total={completed.length} totalLabel="Graduates" height={300} legendPercent />
            </ChartCard>

            <ChartCard title="Graduates & Ventures per Year" sub="Programme output by cohort">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={outcomesByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip hideLabel />} />
                  <Bar dataKey="Graduates" fill={OUT_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={16} />
                  <Bar dataKey="Ventures"  fill={OUT_COLORS[1]} radius={[4, 4, 0, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {(["Graduates","Ventures"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: OUT_COLORS[i] }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 5: ECOSYSTEM & IMPACT ── */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SectionHeader title="Ecosystem & Impact" sub="Partner network, student tracks and internship sector distribution" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ExecCard label="Internship Orgs"      value={intOrgs}   icon={Building2}  tip="Host organisations offering internship placements." />
            <ExecCard label="HealthX Partnerships" value={hxPship}   icon={Handshake}  tip="MOUs and facility collaborations formed through HealthX." />
            <ExecCard label="Students Hosted"       value={intStudents} icon={Users}    tip="Total internship placements across all host organisations." />
            <ExecCard label="Ventures Created"      value={ventures.length} icon={Zap}  tip="Startups launched by HEMP mission-student alumni." />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Student Track Distribution" sub="Mission students by programme track">
              <DonutRing data={trackCounts} colors={DISTINCT} total={totalStudents} totalLabel="Students" height={300} legendPercent />
            </ChartCard>
            <ChartCard title="Internship Sector Distribution" sub="Placements by host sector">
              <DonutRing data={sectorCounts} colors={DISTINCT} total={intStudents} totalLabel="Students" height={300} legendPercent />
            </ChartCard>
          </div>
          <div className="mt-4">
            <ChartCard title="Partner Reach by Country" sub="Participants reached across HealthX and internships, by country">
              <ColorBarList data={geoCountryData} colors={WARM_RAMP} />
            </ChartCard>
          </div>
        </section>

        {/* ── KEY INSIGHTS ── */}
        <div>
          <SectionHeader title="Key Insights" sub="Executive highlights across delivery, participation, quality, outcomes and impact" />
          <ChartCard title="Programme Highlights" sub="Auto-generated from the latest HEMP data">
            <InsightList items={insights} />
          </ChartCard>
        </div>

        {/* ── FOOTER STRIP ── */}
        <PortalFooter portal="hemp" />

      </div>
    </div>
  );
}
