"use client";
import { sieCohorts } from "@/data/hemp/sie";
import { ghCohorts } from "@/data/hemp/global-health";
import { healthXSymposia, LEAD_TYPES, EMPLOYER_SECTORS } from "@/data/hemp/healthx-careers";
import { InlineFilterSelect as FilterSelect } from "@/components/ui/hemp";
import { ChartCard, SectionHeader, Funnel, ChartTip } from "@/components/ui/hemp";
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
  Accessibility, Activity, AlertTriangle, Award, Briefcase, Building2, CheckCircle2, GraduationCap,
  Globe, Handshake, Rocket, Shield, Sparkles, TrendingUp, Users, Zap, type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
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

const TEAL   = TH_NAVY;   // HealthX
const AMBER  = TH_BLUE;   // Internships
const SKY    = "#7F77DD"; // indigo — SIE
const GREEN  = "#0F6E56"; // teal 600 — Courses (Intro to Global Health)
const VIOLET = TH_ORANGE; // Career Symposia
const ROSE   = "#BA7517"; // amber 400 — attention only

// Per-engagement identity colours — the executive's chart-series hues.
const ENGAGEMENT: Record<string, string> = {
  HealthX:            TEAL,
  Internships:        AMBER,
  SIE:                SKY,
  Courses:            GREEN,
  "Career Symposia":  VIOLET,
};

// Donut palette — executive design tokens only, ordered for maximum hue separation
const DISTINCT = ["#185FA5","#0F6E56","#534AB7","#BA7517","#479BD6","#1D9E75","#7F77DD","#D45F2C","#14306B","#085041","#2F5FD1","#85B7EB","#378ADD","#5F5E5A","#102C5E"];
// Blue-family ramp for categorical charts (countries, regions, sectors)
const WARM_RAMP = ["#14306B","#185FA5","#2F5FD1","#378ADD","#479BD6","#85B7EB","#0C447C","#102C5E","#0F6E56","#1D9E75","#534AB7","#7F77DD","#BA7517","#D45F2C","#5F5E5A"];
const PALETTE_NEUTRAL = "#5F5E5A"; // executive gray 600

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function pct(n: number, d: number): number {
  return d ? Math.round((n / d) * 100) : 0;
}

// ─── HealthX (experiential sessions) ─────────────────────────────────────────
const HX_SESSION_TYPES = ["Health Facility Visit", "Innovation Challenge", "Field Exposure", "Industry Tour"] as const;
const SCORE_DIMS = ["Learning Experience", "Practical Relevance", "Accessibility", "Innovation Impact"] as const;

const hxSessions = healthXSessions.length;
const hxPart     = healthXSessions.reduce((s, h) => s + h.participants, 0);
const hxFem      = healthXSessions.reduce((s, h) => s + h.femalePart,   0);
const hxPship    = healthXSessions.reduce((s, h) => s + h.partnerships, 0);
const hxCompAvg  = Math.round(avg(healthXSessions.map(h => h.completionRate)));
const hxSatAvg   = parseFloat(avg(healthXSessions.map(h => avg(Object.values(h.scores)))).toFixed(1));

const hxDimAvg: Record<string, number> = Object.fromEntries(
  SCORE_DIMS.map(d => [d, parseFloat(avg(healthXSessions.map(h => h.scores[d])).toFixed(1))]),
);
const dimEntries = SCORE_DIMS.map(d => ({ dim: d, value: hxDimAvg[d] }));
const strongestDim = dimEntries.reduce((a, b) => (b.value > a.value ? b : a));
const weakestDim   = dimEntries.reduce((a, b) => (b.value < a.value ? b : a));

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

// ─── Internships ──────────────────────────────────────────────────────────────
const intOrgs          = internships.length;
const intStudents      = internships.reduce((s, i) => s + i.students,              0);
const intFem           = internships.reduce((s, i) => s + i.femaleStudents,        0);
const intConversions   = internships.reduce((s, i) => s + i.employmentConversions, 0);
const intSatAvg        = parseFloat(avg(internships.map(i => i.satisfactionScore)).toFixed(1));
const intConversionPct = pct(intConversions, intStudents);

// ─── SIE ──────────────────────────────────────────────────────────────────────
const sieCohortCount   = sieCohorts.length;
const sieSelected      = sieCohorts.reduce((s, c) => s + c.selected,           0);
const sieFem            = sieCohorts.reduce((s, c) => s + c.female,             0);
const sieCompletedP     = sieCohorts.reduce((s, c) => s + c.completedProgramme, 0);
const sieLeads          = sieCohorts.reduce((s, c) => s + c.employmentLeads,    0);
const sieSatAvg          = parseFloat(avg(sieCohorts.map(c => c.satisfaction)).toFixed(1));
const sieCompletionPct   = pct(sieCompletedP, sieSelected);
const sieLeadRate        = pct(sieLeads, sieSelected);

// ─── Courses (Introduction to Global Health) ─────────────────────────────────
const ghCohortCount    = ghCohorts.length;
const ghEnrolled       = ghCohorts.reduce((s, c) => s + c.enrolled,  0);
const ghFem             = ghCohorts.reduce((s, c) => s + c.female,    0);
const ghCompleted       = ghCohorts.reduce((s, c) => s + c.completed, 0);
const ghSatAvg           = parseFloat(avg(ghCohorts.map(c => c.satisfaction)).toFixed(1));
const ghCompletionPct    = pct(ghCompleted, ghEnrolled);
const ghProgressed       = ghCohorts.reduce((s, c) => s + c.progressedToVenture + c.progressedToResearch + c.progressedToInternship, 0);
const ghProgressionPct   = pct(ghProgressed, ghEnrolled);

// ─── Career Symposia ("HealthX: Explore What's Next") ────────────────────────
const symCount               = healthXSymposia.length;
const symStudents            = healthXSymposia.reduce((s, x) => s + x.studentsAttending, 0);
const symFem                  = healthXSymposia.reduce((s, x) => s + x.femaleStudents,    0);
const symReadinessCompletionAvg = Math.round(avg(healthXSymposia.map(x => x.readinessCompletion)));
const symUsefulnessAvg        = parseFloat(avg(healthXSymposia.map(x => x.usefulness)).toFixed(1));
const symLeadsTotal          = healthXSymposia.reduce((s, x) => s + LEAD_TYPES.reduce((a, t) => a + x.leads[t], 0), 0);
const symConversionsTotal    = healthXSymposia.reduce((s, x) => s + LEAD_TYPES.reduce((a, t) => a + x.conversions[t], 0), 0);
const symConversionRate      = pct(symConversionsTotal, symLeadsTotal);
const symPartnerships        = healthXSymposia.reduce((s, x) => s + x.partnershipsFormed + x.partnershipsRenewed, 0);
const symSectorTotals = EMPLOYER_SECTORS
  .map(sec => ({ name: sec, value: healthXSymposia.reduce((s, x) => s + x.employersBySector[sec], 0) }))
  .sort((a, b) => b.value - a.value);

// ─── Mission Students (graduate cohort — feeds Section 05 only) ─────────────
const totalStudents = missionStudents.length;
const completed      = missionStudents.filter(s => s.status === "Completed");
const employed        = completed.filter(s => s.employment === "Employed" || s.employment === "Entrepreneur");
const ventures         = missionStudents.filter(s => s.ventureCreated);
const completionPct    = pct(completed.length, totalStudents);
const employPct         = pct(employed.length, completed.length);

// ─── Cross-engagement rollups (Reach section) ────────────────────────────────
// Reach is engagement-based: how far HEMP reaches through what it delivers.
// Mission students are the cohort who move through these engagements, not a
// sixth engagement themselves, so they aren't counted again here.
const FEMALE_PCT_HX  = pct(hxFem,  hxPart);
const FEMALE_PCT_IN  = pct(intFem, intStudents);
const FEMALE_PCT_SIE = pct(sieFem, sieSelected);
const FEMALE_PCT_GH  = pct(ghFem,  ghEnrolled);
const FEMALE_PCT_SYM = pct(symFem, symStudents);

const TOTAL_REACH    = hxPart + intStudents + sieSelected + ghEnrolled + symStudents;
const TOTAL_FEM      = hxFem  + intFem      + sieFem      + ghFem      + symFem;
const FEMALE_PCT_ALL = pct(TOTAL_FEM, TOTAL_REACH);
const TOTAL_PSHIP    = hxPship + intOrgs;
const ENGAGEMENT_COUNT = hxSessions + intOrgs + sieCohortCount + ghCohortCount + symCount;
const AVG_SAT = parseFloat(avg([hxSatAvg, intSatAvg, sieSatAvg, ghSatAvg, symUsefulnessAvg]).toFixed(1));

// Neither field exists in the underlying HEMP datasets yet — these are
// illustrative placeholders, not measured figures. Swap in a real rollup
// once refugee/disability status is captured per participant.
const REFUGEE_PCT = 8;
const PWD_PCT     = 5;

// ─── Chart data ──────────────────────────────────────────────────────────────
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

const reachByYear = YEARS
  .map(yr => {
    const row = {
      Year:              String(yr),
      HealthX:           healthXSessions.filter(h => h.year === yr).reduce((s, h) => s + h.participants,     0),
      Internships:       internships.filter(i => i.year === yr).reduce((s, i) => s + i.students,             0),
      SIE:               sieCohorts.filter(c => c.year === yr).reduce((s, c) => s + c.selected,              0),
      Courses:           ghCohorts.filter(c => c.cohortYear === yr).reduce((s, c) => s + c.enrolled,         0),
      "Career Symposia": healthXSymposia.filter(x => x.year === yr).reduce((s, x) => s + x.studentsAttending, 0),
    };
    const Total = row.HealthX + row.Internships + row.SIE + row.Courses + row["Career Symposia"];
    return { ...row, Total };
  })
  .filter(d => d.Total > 0);

const participantsByProgData = [
  { name: "HealthX",           value: hxPart },
  { name: "Internships",       value: intStudents },
  { name: "SIE",               value: sieSelected },
  { name: "Courses",           value: ghEnrolled },
  { name: "Career Symposia",   value: symStudents },
].sort((a, b) => b.value - a.value);

const genderByEngagement = [
  { name: "HealthX",           Female: hxFem,  Male: hxPart - hxFem },
  { name: "Internships",       Female: intFem, Male: intStudents - intFem },
  { name: "SIE",               Female: sieFem, Male: sieSelected - sieFem },
  { name: "Courses",           Female: ghFem,  Male: ghEnrolled - ghFem },
  { name: "Career Symposia",   Female: symFem, Male: symStudents - symFem },
].sort((a, b) => (b.Female + b.Male) - (a.Female + a.Male));

const satByEngagementRows = [
  { name: "HealthX",          value: hxSatAvg,         color: ENGAGEMENT.HealthX },
  { name: "Internships",      value: intSatAvg,        color: ENGAGEMENT.Internships },
  { name: "SIE",              value: sieSatAvg,        color: ENGAGEMENT.SIE },
  { name: "Courses",          value: ghSatAvg,         color: ENGAGEMENT.Courses },
  { name: "Career Symposia",  value: symUsefulnessAvg, color: ENGAGEMENT["Career Symposia"] },
];

// ─── Geographic reach ────────────────────────────────────────────────────────
type ReachRec = { country: string; year: number; reach: number; female: number };
const REACH_RECORDS: ReachRec[] = [
  ...healthXSessions.map(h => ({ country: h.country, year: h.year, reach: h.participants,     female: h.femalePart })),
  ...internships.map(i    => ({ country: i.country,  year: i.year, reach: i.students,         female: i.femaleStudents })),
  ...sieCohorts.map(c     => ({ country: c.country,  year: c.year, reach: c.selected,          female: c.female })),
  ...healthXSymposia.map(x => ({ country: x.country, year: x.year, reach: x.studentsAttending, female: x.femaleStudents })),
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

// ─── Programme performance ────────────────────────────────────────────────────
const PERFORMANCE_ROWS: {
  name: string; reach: number; sat: number | null; completion: number | null;
  outcome: number | null; outcomeLabel: string;
}[] = [
  { name: "HealthX",          reach: hxPart,      sat: hxSatAvg,         completion: hxCompAvg,                outcome: null,             outcomeLabel: "—" },
  { name: "Internships",      reach: intStudents, sat: intSatAvg,        completion: null,                     outcome: intConversionPct, outcomeLabel: "Employment" },
  { name: "SIE",              reach: sieSelected, sat: sieSatAvg,        completion: sieCompletionPct,         outcome: sieLeadRate,      outcomeLabel: "Employment leads" },
  { name: "Career Symposia",  reach: symStudents, sat: symUsefulnessAvg, completion: symReadinessCompletionAvg,outcome: symConversionRate,outcomeLabel: "Lead conversion" },
  { name: "Courses",          reach: ghEnrolled,  sat: ghSatAvg,         completion: ghCompletionPct,          outcome: ghProgressionPct, outcomeLabel: "Progression" },
];

const targetRingRows = [
  { name: "HealthX Completion",     value: hxCompAvg,        target: 90, color: ENGAGEMENT.HealthX },
  { name: "Female Participation",   value: FEMALE_PCT_ALL,   target: 50, color: ENGAGEMENT.SIE },
  { name: "Employment / Outcome",   value: employPct,        target: 70, color: ENGAGEMENT.Courses },
  { name: "Internship Conversion",  value: intConversionPct, target: 50, color: ENGAGEMENT.Internships },
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
    return { Year: String(yr), Graduates: grads, Ventures: vents };
  })
  .filter(d => d.Graduates + d.Ventures > 0);
const OUT_COLORS = [TH_NAVY, TH_BLUE] as const; // Graduates, Ventures

// ─── Ecosystem ───────────────────────────────────────────────────────────────
const sectorCounts = Object.entries(
  internships.reduce<Record<string, number>>((a, i) => { a[i.sector] = (a[i.sector] || 0) + i.students; return a; }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

// ─── Insights ────────────────────────────────────────────────────────────────
const topReach = participantsByProgData[0];
const insights = [
  `HEMP has reached ${TOTAL_REACH.toLocaleString()} participants across ${GEO_COUNTRIES.length} countries through ${ENGAGEMENT_COUNT} engagements and interventions.`,
  `Participants report an average learning experience of ${AVG_SAT}/5, ${AVG_SAT >= 4.5 ? "meeting" : "just below"} the programme target of 4.5.`,
  `Female participation stands at ${FEMALE_PCT_ALL}% across HEMP engagements, ${FEMALE_PCT_ALL >= 50 ? "exceeding" : "trailing"} the 50% target.`,
  `${employPct}% of tracked graduates are employed or running ventures, ${employPct >= 70 ? "exceeding" : "trailing"} the 70% target.`,
  `HEMP participants have contributed to ${ventures.length} ventures created, with ${intConversions} internship placements converting into employment.`,
  `${topReach.name} accounts for the largest share of engagement reach, at ${topReach.value.toLocaleString()} participants.`,
];

const ATTENTION_TARGETS: { label: string; value: number; target: number; unit: "%" | "/5" }[] = [
  { label: "Overall learning experience",      value: AVG_SAT,          target: 4.5, unit: "/5" },
  { label: "HealthX satisfaction",             value: hxSatAvg,         target: 4.5, unit: "/5" },
  { label: "Internship satisfaction",          value: intSatAvg,        target: 4.5, unit: "/5" },
  { label: "SIE satisfaction",                 value: sieSatAvg,        target: 4.5, unit: "/5" },
  { label: "Course satisfaction",              value: ghSatAvg,         target: 4.5, unit: "/5" },
  { label: "Career symposia usefulness",       value: symUsefulnessAvg, target: 4.5, unit: "/5" },
  { label: "HealthX completion",               value: hxCompAvg,        target: 90,  unit: "%" },
  { label: "Female participation",             value: FEMALE_PCT_ALL,   target: 50,  unit: "%" },
  { label: "Employment / venture outcome rate",value: employPct,        target: 70,  unit: "%" },
  { label: "Internship employment conversion", value: intConversionPct, target: 50,  unit: "%" },
];
const attentionItems = ATTENTION_TARGETS
  .filter(t => t.value < t.target)
  .map(t => `${t.label} is at ${t.value}${t.unit}, below the ${t.target}${t.unit} target.`);

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

// ─── Big hero score card (Learning Experience) ───────────────────────────────
function BigScoreCard({ label, value, target, sub }: {
  label: string; value: number; target: number; sub: string;
}) {
  const good = value >= target;
  return (
    <div style={{
      backgroundColor: BRAND, borderRadius: 12, padding: "22px 26px",
      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
    }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#B5D4F4" }}>{label}</p>
        <p style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginTop: 6, lineHeight: 1 }}>
          {value.toFixed(1)}<span style={{ fontSize: 16, color: "#B5D4F4", fontWeight: 600 }}> / 5</span>
        </p>
        <p style={{ fontSize: 12, color: "#B5D4F4", marginTop: 6 }}>{sub}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#B5D4F4", textTransform: "uppercase", letterSpacing: "0.05em" }}>Target</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginTop: 2 }}>{target.toFixed(1)}</p>
        <p style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: good ? "#7BE0B8" : "#F3B39A" }}>
          {good ? "On target" : "Below target"}
        </p>
      </div>
    </div>
  );
}

function DimensionCallout({ label, dim, value, tone }: {
  label: string; dim: string; value: number; tone: "up" | "down";
}) {
  const color = tone === "up" ? GREEN : ROSE;
  return (
    <div style={{ flex: 1, backgroundColor: color + "0D", border: `1px solid ${color}33`, borderRadius: 10, padding: "16px 18px" }}>
      <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: BRAND_DK, marginTop: 6 }}>{dim}</p>
      <p style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>{value.toFixed(1)} / 5 average score across HealthX sessions</p>
    </div>
  );
}

// ─── Chart tooltip ───────────────────────────────────────────────────────────
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

function PerformanceTable({ rows }: { rows: typeof PERFORMANCE_ROWS }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead><tr>
          <th className="text-left text-gray-400 font-bold pb-3 pr-6 uppercase tracking-wider text-[9px]">Programme</th>
          <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Reach</th>
          <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Satisfaction</th>
          <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Completion</th>
          <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Employment / Outcome</th>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className="border-t border-gray-100">
              <td className="py-2.5 pr-6 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ENGAGEMENT[r.name] ?? BRAND }} />
                  <span className="font-semibold text-gray-700">{r.name}</span>
                </span>
              </td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums text-gray-700">{r.reach.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{r.sat !== null ? `${r.sat}/5` : "—"}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{r.completion !== null ? `${r.completion}%` : "—"}</td>
              <td className="py-2.5 px-2 text-center">
                {r.outcome !== null ? (
                  <>
                    <span className="font-bold tabular-nums" style={{ color: BRAND_DK }}>{r.outcome}%</span>
                    <span className="block text-[9px] text-gray-400 mt-0.5">{r.outcomeLabel}</span>
                  </>
                ) : <span className="text-gray-400">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InsightList({ items, dotColor }: { items: string[]; dotColor?: string }) {
  return (
    <div className="space-y-2.5">
      {items.map((t, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <span className="rounded-full flex-shrink-0 mt-1.5" style={{ width: 6, height: 6, backgroundColor: dotColor ?? BRAND }} />
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
            <p className="text-[13px] sm:text-sm mt-2 font-medium" style={{ color: "#85B7EB" }}>
              Programme outcomes across reach, learning experience, participation, employment and ecosystem impact
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px]" style={{ color: "rgba(255,255,255,0.85)" }}>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Data source:</span> HEMP Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Period:</span> 2021–2026</span>
              <span aria-hidden="true">·</span>
              <span>{ENGAGEMENT_COUNT} engagements · {GEO_COUNTRIES.length} countries</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* ── KPI STRIP ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <KpiTile label="Total Reach"            num={TOTAL_REACH}        displayFmt={n => Math.round(n).toLocaleString()} Icon={Users}     sub="Participants across HEMP engagements" tip="Total people reached across HealthX, internships, SIE, courses and the HealthX career symposia." />
          <KpiTile label="Interns / Placements"   num={intStudents}        displayFmt={n => String(Math.round(n))}          Icon={Briefcase} sub={`Students placed across ${intOrgs} organisations`} tip="Total internship placements across all host organisations." />
          <KpiTile label="Female Participation"   num={FEMALE_PCT_ALL}     displayFmt={n => `${Math.round(n)}%`}            Icon={Sparkles}  sub="Across HEMP engagements" tip={`Share of participants who are female (${TOTAL_FEM.toLocaleString()} people).`} />
          <KpiTile label="Employment Conversion"  num={intConversionPct}   displayFmt={n => `${Math.round(n)}%`}            Icon={TrendingUp} sub="Internship placements converting to employment" tip="Internship placements that converted into employment." />
          <KpiTile label="Refugee Participation"  num={REFUGEE_PCT} displayFmt={n => `${Math.round(n)}%`} Icon={Shield}        sub="Illustrative estimate — not yet tracked" tip="Refugee status is not currently captured in the HEMP dataset; shown as an illustrative estimate." />
          <KpiTile label="PWD Participation"      num={PWD_PCT}     displayFmt={n => `${Math.round(n)}%`} Icon={Accessibility} sub="Illustrative estimate — not yet tracked" tip="Disability status is not currently captured in the HEMP dataset; shown as an illustrative estimate." />
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Reach", value: "1" },
              { label: "Learning Experience", value: "2" },
              { label: "Participation", value: "3" },
              { label: "Performance", value: "4" },
              { label: "Outcomes", value: "5" },
              { label: "Ecosystem", value: "6" },
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

        {/* ── SECTION 01: REACH ── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SectionHeader title="Reach" sub="How far is HEMP reaching through its engagements and interventions?" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Reach by Engagement" sub="Participants reached across HealthX, internships, SIE, courses and career symposia">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={participantsByProgData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="value" name="Participants" radius={[4, 4, 0, 0]} maxBarSize={46}>
                    {participantsByProgData.map((d) => (<Cell key={d.name} fill={ENGAGEMENT[d.name] ?? PALETTE_NEUTRAL} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {participantsByProgData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: ENGAGEMENT[d.name] ?? PALETTE_NEUTRAL }} />{d.name}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Reach Over Time" sub="Total participant reach across 2021–2026">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={reachByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<ChartTip hideLabel />} />
                  <Line type="monotone" dataKey="Total" name="Total Reach" stroke={BRAND} strokeWidth={2.5}
                    dot={{ r: 4, fill: BRAND, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                Combined reach across HealthX, internships, SIE, courses and career symposia, by year
              </p>
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

        {/* ── SECTION 02: LEARNING EXPERIENCE ── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SectionHeader title="Learning Experience" sub="What learning experience are participants receiving through HEMP?" />

          <div className="mb-4">
            <BigScoreCard label="Learning Experience Score" value={AVG_SAT} target={4.5}
              sub="Average satisfaction across HealthX, internships, SIE, courses and career symposia" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <PlainCard title="Learning Dimensions" sub="HealthX satisfaction by dimension, by session type — the only engagement with dimension-level survey data">
                <SatisfactionBars dimensions={SCORE_DIMS} series={radarSeries} target={4.5} height={320} />
              </PlainCard>
            </div>
            <div className="lg:col-span-4">
              <PlainCard title="Satisfaction by Engagement" sub="Score vs. target of 4.5" fill>
                <BulletChart rows={satByEngagementRows} target={4.5} />
              </PlainCard>
            </div>
          </div>

          <div className="mt-4">
            <SectionHeader title="Participant Experience" sub="Strongest and weakest HealthX learning dimensions" accent={SECTION} />
            <div className="flex flex-col sm:flex-row gap-4">
              <DimensionCallout label="Strongest Dimension" dim={strongestDim.dim} value={strongestDim.value} tone="up" />
              <DimensionCallout label="Area for Improvement" dim={weakestDim.dim} value={weakestDim.value} tone="down" />
            </div>
          </div>
        </section>

        {/* ── SECTION 03: PARTICIPATION ── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SectionHeader title="Participation" sub="Who participates and how are learners engaging with HEMP opportunities?" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Gender Participation" sub="Female vs. male headcount by engagement">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={genderByEngagement} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="Female" stackId="g" fill="#185FA5" maxBarSize={46} />
                  <Bar dataKey="Male"   stackId="g" fill="#85B7EB" radius={[4, 4, 0, 0]} maxBarSize={46} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#185FA5" }} /> Female</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#85B7EB" }} /> Male</span>
              </div>
            </ChartCard>

            <ChartCard title="Participation Trends" sub="Participation by year and engagement">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={reachByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<ChartTip hideLabel />} />
                  {(["HealthX", "Internships", "SIE", "Courses", "Career Symposia"] as const).map((cat) => (
                    <Line key={cat} type="monotone" dataKey={cat} stroke={ENGAGEMENT[cat]} strokeWidth={2}
                      dot={{ r: 3, fill: ENGAGEMENT[cat], strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {(["HealthX", "Internships", "SIE", "Courses", "Career Symposia"] as const).map((l) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: ENGAGEMENT[l] }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>

          <div className="mt-4">
            <SectionHeader title="Engagement & Completion" sub="Registered → Participated → Completed, where the full funnel is tracked" accent={SECTION} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="SIE Funnel" sub="Signature Immersive Experience — application to completion">
                <Funnel steps={[
                  { label: "Applied",              value: sieCohorts.reduce((s, c) => s + c.applied, 0) },
                  { label: "Selected",             value: sieSelected },
                  { label: "Completed Virtual",    value: sieCohorts.reduce((s, c) => s + c.completedVirtual, 0) },
                  { label: "Completed Programme",  value: sieCompletedP },
                ]} accent={ENGAGEMENT.SIE} />
              </ChartCard>
              <ChartCard title="Course Funnel" sub="Introduction to Global Health — enrolment to certification">
                <Funnel steps={[
                  { label: "Enrolled",   value: ghEnrolled },
                  { label: "Completed",  value: ghCompleted },
                  { label: "Certified",  value: ghCohorts.reduce((s, c) => s + c.certified, 0) },
                ]} accent={ENGAGEMENT.Courses} />
              </ChartCard>
            </div>
          </div>
        </section>

        {/* ── SECTION 04: PROGRAMME PERFORMANCE ── */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SectionHeader title="Programme Performance" sub="How well are HEMP programmes performing against their targets?" />
          <div className="mb-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            <ExecCard label="Satisfaction"          value={`${AVG_SAT}/5`}         icon={Award}        tip="Average satisfaction across all engagements." />
            <ExecCard label="Completion"            value={`${hxCompAvg}%`}        icon={CheckCircle2} sub="HealthX" />
            <ExecCard label="Employment Conversion" value={`${intConversionPct}%`} icon={TrendingUp}   sub="Internships" />
            <ExecCard label="Female Participation"  value={`${FEMALE_PCT_ALL}%`}   icon={Sparkles} />
            <ExecCard label="Outcome Rate"          value={`${employPct}%`}        icon={Briefcase}    sub="Graduate employment / venture" />
          </div>

          <ChartCard title="Performance by Programme" sub="Reach, satisfaction, completion and employment/outcome side by side">
            <PerformanceTable rows={PERFORMANCE_ROWS} />
          </ChartCard>

          <div className="mt-4">
            <SectionHeader title="Performance Against Targets" sub="Actual vs. target for the key HEMP indicators" accent={SECTION} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5">
                <PlainCard title="Overall Satisfaction" sub="Score vs. target of 4.5" fill>
                  <BulletChart rows={[{ name: "Satisfaction", value: AVG_SAT, color: BRAND }]} target={4.5} />
                </PlainCard>
              </div>
              <div className="lg:col-span-7">
                <PlainCard title="Rate Indicators vs. Target" sub="Completion, participation and outcome rates" fill>
                  <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 8 }}>
                    {targetRingRows.map(r => (
                      <ProgressRing key={r.name} value={r.value} color={r.color} label={r.name} target={r.target} />
                    ))}
                  </div>
                </PlainCard>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 05: GRADUATE OUTCOMES & INNOVATION ── */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SectionHeader title="Graduate Outcomes & Innovation" sub="What happens to participants after their HEMP experience?" />
          <div className="mb-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            <ExecCard label="Graduates"                     value={completed.length}       icon={GraduationCap} />
            <ExecCard label="Employment / Venture Outcomes" value={employed.length}         icon={TrendingUp} />
            <ExecCard label="Employment / Venture Rate"     value={`${employPct}%`}         icon={Briefcase} />
            <ExecCard label="Ventures Created"              value={ventures.length}         icon={Rocket} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Employment Conversion" sub="Participants → Graduates → Employment / Entrepreneurship">
              <Funnel steps={[
                { label: "Mission Students",      value: totalStudents },
                { label: "HealthX Experiences",   value: missionStudents.filter(s => s.hasHealthX).length },
                { label: "Internship Placements", value: missionStudents.filter(s => s.hasInternship).length },
                { label: "Graduates",             value: completed.length },
                { label: "Employed / Venture",    value: employed.length },
              ]} />
              <div className="flex flex-wrap justify-center gap-3 text-[10px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {["Mission Students", "HealthX Experiences", "Internship Placements", "Graduates", "Employed / Venture"].map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND, opacity: 1 - i * 0.13 }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Graduate Outcomes" sub="Employment status for all completed students">
              <DonutRing data={empOutcomes} colors={DISTINCT} total={completed.length} totalLabel="Graduates" height={300} legendPercent />
            </ChartCard>

            <ChartCard title="Graduate & Venture Trends" sub="Graduates and ventures created by year, 2021–2026">
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
                {(["Graduates", "Ventures"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: OUT_COLORS[i] }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 06: ECOSYSTEM & IMPACT ── */}
        <section style={{ display: show(6) ? undefined : "none" }}>
          <SectionHeader title="Ecosystem & Impact" sub="What ecosystem is HEMP building to create learning and employment opportunities?" />
          <div className="mb-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            <ExecCard label="Partnerships"          value={TOTAL_PSHIP}       icon={Handshake} tip="HealthX partnerships plus internship host organisations." />
            <ExecCard label="HealthX Partnerships"  value={hxPship}           icon={Zap}       tip="MOUs and facility collaborations formed through HealthX." />
            <ExecCard label="Internship Orgs"       value={intOrgs}           icon={Building2} tip="Host organisations offering internship placements." />
            <ExecCard label="Students Hosted"       value={intStudents}      icon={Users}     tip="Total internship placements across all host organisations." />
            <ExecCard label="Countries"             value={GEO_COUNTRIES.length} icon={Globe} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Partner Ecosystem" sub="Employers exhibiting at HealthX career symposia, by sector">
              <DonutRing data={symSectorTotals} colors={DISTINCT} total={symSectorTotals.reduce((s, d) => s + d.value, 0)} totalLabel="Employers" height={300} legendPercent />
            </ChartCard>
            <ChartCard title="Internship Sector Distribution" sub="Placements by host sector">
              <DonutRing data={sectorCounts} colors={DISTINCT} total={intStudents} totalLabel="Students" height={300} legendPercent />
            </ChartCard>
          </div>
          <div className="mt-4">
            <ChartCard title="Partner & Opportunity Reach" sub="Participants reached across HealthX, internships, SIE and career symposia, by country">
              <ColorBarList data={geoCountryData} colors={WARM_RAMP} />
            </ChartCard>
          </div>
          <div className="mt-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            <ExecCard label="Ventures Created"       value={ventures.length}    icon={Rocket}   tip="Startups launched by HEMP mission-student alumni." />
            <ExecCard label="Employment Conversions" value={intConversions}     icon={Briefcase} tip="Internship placements that converted into employment." />
            <ExecCard label="Continued Education"    value={ghProgressed}       icon={GraduationCap} tip="Course graduates who progressed into a venture, research or an internship." />
            <ExecCard label="Industry Connections"   value={symPartnerships}    icon={Handshake} tip="Partnerships formed or renewed through the HealthX career symposia." />
          </div>
        </section>

        {/* ── SECTION 07: KEY OUTCOMES & INSIGHTS (part of the Outcomes pill) ── */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SectionHeader title="Key Outcomes & Insights" sub="What is HEMP achieving?" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Programme Highlights" sub="Auto-generated from the latest HEMP data">
              <InsightList items={insights} />
            </ChartCard>
            <ChartCard title="Areas Requiring Attention" sub="Indicators currently below target" accent={ROSE}
              headerRight={attentionItems.length
                ? <AlertTriangle size={16} color="white" />
                : <CheckCircle2 size={16} color="white" />}>
              {attentionItems.length
                ? <InsightList items={attentionItems} dotColor={ROSE} />
                : <p className="text-[12px] text-gray-700 leading-relaxed">All key indicators are currently meeting or exceeding target.</p>}
            </ChartCard>
          </div>
        </section>

        {/* ── FOOTER STRIP ── */}
        <PortalFooter portal="hemp" />

      </div>
    </div>
  );
}
