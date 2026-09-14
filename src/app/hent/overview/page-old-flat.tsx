"use client";
import { InlineFilterSelect as FilterSelect } from "@/components/ui/hent";
import { ChartCard, SectionHeader, InfoDot, Funnel, ChartTip, ChartLegend, BarList, useCountUp } from "@/components/ui/hent";
import { benchColor } from "@/theme/tokens";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { DonutRing } from "@/components/charts/donut-chart";
import AfricaMap from "@/components/charts/africa-map";
import { type RadarSeries } from "@/components/charts/satisfaction-radar";
import SatisfactionBars from "@/components/charts/satisfaction-bars";
import BulletChart from "@/components/charts/bullet-chart";
import ProgressRing from "@/components/charts/progress-ring";
import { PALETTE } from "@/styles/palette";
import { studyTrips } from "@/data/study-trips";
import { founders } from "@/data/founders";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { pilotEngagements } from "@/data/pilot-engagements";
import { Award, Briefcase, Handshake, Heart, Lightbulb, MapPin, Presentation, Rocket, Sparkles, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";
import type { Stage, Sector, FundingStatus } from "@/types";

// Color palette
const PRIMARY = "#0B2D71";
const TEAL    = "#009CA6";
const PURPLE  = "#2D6A4F";
const AMBER   = "#3FA0D8";
const GREEN   = "#00A07A";
const INDIGO  = "#1B4332";
const ORANGE  = "#0B2D71";
const C_PURPLE = "#5C2D91";
const C_SKY    = "#3FA0D8";

const PROG: Record<string, string> = {
  Hackathons:    "#1B4332",
  Masterclasses: "#1F9E9E",
  "Study Trips": "#A6C13C",
  Mentorships:   "#BBD59B",
};

const PROG_YEAR_COLORS = [PROG.Hackathons, PROG.Masterclasses, PROG["Study Trips"], PROG.Mentorships] as const;
const DISTINCT = ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5"];

// Helpers
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n/1_000)}K` : `$${n}`;
}
function fmt$K(n: number) {
  // Input is in thousands, convert to actual dollars first
  const dollars = n * 1000;
  return fmt$(dollars);
}
function sg(s: string) {
  if (s === "Ideation" || s === "Validation") return "Expose";
  if (s === "Prototype/MVP" || s === "Early Growth") return "Build";
  return "Scale";
}
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// Cross-programme aggregates
const hackPart  = hackathons.reduce((s, h) => s + h.participants, 0);
const hackFem   = hackathons.reduce((s, h) => s + h.femaleCount, 0);
const hackStart = hackathons.reduce((s, h) => s + h.startupsCreated, 0);
const hackProjects = hackathons.reduce((s, h) => s + h.projects, 0);

const mcAtt   = masterclasses.reduce((s, m) => s + m.attendees, 0);
const mcFem   = masterclasses.reduce((s, m) => s + m.femaleAttendees, 0);
const mcComp  = Math.round(avg(masterclasses.map(m => m.completionRate)));
const mcSat   = parseFloat(avg(masterclasses.map(m => avg(Object.values(m.scores)))).toFixed(1));

const fvPart  = studyTrips.reduce((s, v) => s + v.participants, 0);
const fvFem   = studyTrips.reduce((s, v) => s + v.femaleParticipants, 0);
const fvComp  = Math.round(avg(studyTrips.map(v => v.completionRate)));
const fvSat   = parseFloat(avg(studyTrips.map(v => avg(Object.values(v.scores)))).toFixed(1));

const mfFel   = mentorshipPrograms.reduce((s, m) => m.fellows + s, 0);
const mfGrad  = mentorshipPrograms.reduce((s, m) => s + Math.round(m.fellows * (m.completionRate / 100)), 0);
const mfComp  = Math.round(avg(mentorshipPrograms.map(m => m.completionRate)));
const mfSat   = parseFloat(avg(mentorshipPrograms.map(m => avg(Object.values(m.scores)))).toFixed(1));

// HENT-specific metrics
const TOTAL_PART = hackPart + mcAtt + fvPart + mfFel;
const TOTAL_FEM = hackFem + mcFem + fvFem;
const FEMALE_PCT = TOTAL_PART ? Math.round((TOTAL_FEM / TOTAL_PART) * 100) : 0;
const TOTAL_JOBS = ALL_VENTURES.reduce((s, v) => s + v.jobsTotal, 0);
const TOTAL_JOBS_YOUTH = ALL_VENTURES.reduce((s, v) => s + v.jobsYouth, 0);
const TOTAL_FUNDING = ALL_VENTURES.reduce((s, v) => s + v.funding, 0);
const TOTAL_PSHIP = ALL_VENTURES.reduce((s, v) => s + v.partnerships, 0);
const TOTAL_PROGS = hackathons.length + masterclasses.length + mentorshipPrograms.length + studyTrips.length;

// Targets
const TARGETS = { ventures: 400, jobs: 2_000, funds: 910_904 } as const;
const ACTUAL_VENTURES = ALL_VENTURES.filter(v => v.status === "Active").length;
const ACTUAL_JOBS = TOTAL_JOBS;
const ACTUAL_FUNDS = TOTAL_FUNDING;

// NPS calculation
const npsScores = founders.map(f => f.npsScore);
const promoters = npsScores.filter(s => s >= 9).length;
const detractors = npsScores.filter(s => s <= 6).length;
const NPS_SCORE = npsScores.length ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0;

// Fund type breakdown
const fundsCharitable = ALL_VENTURES.filter(v => v.fundType === "Charitable").reduce((s, v) => s + v.funding, 0);
const fundsVentureF = ALL_VENTURES.filter(v => v.fundType === "Venture Fund").reduce((s, v) => s + v.funding, 0);
const fundsCatalytic = ALL_VENTURES.filter(v => v.fundType === "Catalytic").reduce((s, v) => s + v.funding, 0);

// Recommended ventures & accelerators
const recommendedVentures = ALL_VENTURES.filter(v => v.recommended).length;
const acceleratorVentures = ALL_VENTURES.filter(v => v.accelerator).length;
const acceleratorPct = ALL_VENTURES.length ? Math.round((acceleratorVentures / ALL_VENTURES.length) * 100) : 0;

// Demographic breakdown
const pwdCount = founders.filter(f => f.isPWD).length;
const refugeeCount = founders.filter(f => f.isRefugee).length;
const mcfCount = founders.filter(f => f.isMCFScholar).length;

// Data by cohort
const cohorts = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort((a, b) => a - b);
const venturesByYear = cohorts.map(c => ({
  year: String(c),
  ventures: ALL_VENTURES.filter(v => v.cohort === c && v.status === "Active").length,
}));

// Youth employment by year
const youthJobsByYear = cohorts.map(c => ({
  year: String(c),
  "Youth Jobs": ALL_VENTURES.filter(v => v.cohort === c).reduce((s, v) => s + v.jobsYouth, 0),
  "Other Jobs": ALL_VENTURES.filter(v => v.cohort === c).reduce((s, v) => s + (v.jobsTotal - v.jobsYouth), 0),
}));

// Fund types chart
const fundTypeData = [
  { name: "Charitable", value: fundsCharitable },
  { name: "Venture Fund", value: fundsVentureF },
  { name: "Catalytic", value: fundsCatalytic },
].filter(d => d.value > 0);

const fundTypeColors = ["#1B4332", "#1F9E9E", "#A6C13C"];

// Stage data
const stageData = [
  { name: "Expose", value: ALL_VENTURES.filter(v => sg(v.stage) === "Expose").length },
  { name: "Build", value: ALL_VENTURES.filter(v => sg(v.stage) === "Build").length },
  { name: "Scale", value: ALL_VENTURES.filter(v => sg(v.stage) === "Scale").length },
];

// Sector data
const sectorCounts: Record<string, number> = {};
ALL_VENTURES.forEach(v => {
  sectorCounts[v.sector] = (sectorCounts[v.sector] || 0) + 1;
});
const sectorData = Object.entries(sectorCounts)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value);

// Programme performance (from existing code)
const perfHeatmap = [
  {
    program: "Masterclasses",
    Quality: parseFloat(avg(masterclasses.map(m => avg(Object.values(m.scores)))).toFixed(1)),
    Usefulness: parseFloat(avg(masterclasses.map(m => avg(Object.values(m.scores)))).toFixed(1)),
    Accessibility: parseFloat(avg(masterclasses.map(m => avg(Object.values(m.scores)))).toFixed(1)),
    Relevance: parseFloat(avg(masterclasses.map(m => avg(Object.values(m.scores)))).toFixed(1)),
  },
  {
    program: "Study Trips",
    Quality: parseFloat(avg(studyTrips.map(v => avg(Object.values(v.scores)))).toFixed(1)),
    Usefulness: parseFloat(avg(studyTrips.map(v => avg(Object.values(v.scores)))).toFixed(1)),
    Accessibility: parseFloat(avg(studyTrips.map(v => avg(Object.values(v.scores)))).toFixed(1)),
    Relevance: parseFloat(avg(studyTrips.map(v => avg(Object.values(v.scores)))).toFixed(1)),
  },
  {
    program: "Mentorships",
    Quality: parseFloat(avg(mentorshipPrograms.map(p => avg(Object.values(p.scores)))).toFixed(1)),
    Usefulness: parseFloat(avg(mentorshipPrograms.map(p => avg(Object.values(p.scores)))).toFixed(1)),
    Accessibility: parseFloat(avg(mentorshipPrograms.map(p => avg(Object.values(p.scores)))).toFixed(1)),
    Relevance: parseFloat(avg(mentorshipPrograms.map(p => avg(Object.values(p.scores)))).toFixed(1)),
  },
];

const HEAT_COLS = ["Quality", "Usefulness", "Accessibility", "Relevance"] as const;
const radarSeries: RadarSeries[] = perfHeatmap.map(row => {
  const values = HEAT_COLS.reduce<Record<string, number>>((a, c) => { a[c] = row[c]; return a; }, {});
  const avgScore = parseFloat(avg(HEAT_COLS.map(c => row[c])).toFixed(1));
  return {
    name: row.program,
    color: PROG[row.program] || PRIMARY,
    dashed: row.program === "Mentorships",
    fillOpacity: row.program === "Mentorships" ? 0.06 : 0.08,
    values,
    avg: avgScore
  };
});

// Shared components
function PlainCard({ title, sub, chip, fill, children }: {
  title: string; sub?: string; chip?: React.ReactNode; fill?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden" style={{
      backgroundColor: PALETTE.surfaceCard, border: `1px solid ${PALETTE.border}`, borderRadius: 12,
      height: fill ? "100%" : undefined, display: fill ? "flex" : undefined, flexDirection: fill ? "column" : undefined,
    }}>
      <div className="flex items-center justify-between gap-3" style={{ backgroundColor: "#2D6A4F", padding: "12px 20px" }}>
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

function ExecCard({ label, value, sub, note, icon: Icon, center = false, tip }: {
  label: string; value: string | number; sub?: string; color?: string;
  note?: string; bg?: string; icon?: LucideIcon; center?: boolean; tip?: string;
}) {
  const GREEN_BRAND = "#2D6A4F";
  return (
    <div className="rounded-[10px]" style={{
      backgroundColor: "#ffffff",
      border: `1px solid ${GREEN_BRAND}`,
      padding: "13px 15px",
      display: "flex",
      flexDirection: center ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      textAlign: center ? "center" : "left",
      gap: center ? 6 : 11,
      position: "relative",
      overflow: "visible",
    }}>
      {Icon && (
        <span className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36 }}>
          <Icon size={20} style={{ color: GREEN_BRAND }} />
        </span>
      )}
      <div style={{ minWidth: 0 }}>
        <p className="tabular-nums" style={{ fontSize: 21, fontWeight: 800, color: GREEN_BRAND, lineHeight: 1.05 }}>{value}</p>
        <div className="flex items-center gap-1" style={{ justifyContent: center ? "center" : "flex-start", marginTop: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
          {tip && <InfoDot tip={tip} />}
        </div>
        {sub  && <p style={{ fontSize: 9, fontWeight: 500, color: "#9CA3AF", marginTop: 2 }}>{sub}</p>}
        {note && <p className="mt-1.5 pt-1.5" style={{ fontSize: 9, color: "#6B7280", borderTop: "1px solid rgba(0,33,71,0.10)" }}>{note}</p>}
      </div>
    </div>
  );
}

function KpiTile({ label, num, displayFmt, sub, clr, pct, bench, Icon, tip }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub?: string; clr: string; pct?: number; bench?: number; Icon?: LucideIcon; tip?: string;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(14,70,51,0.12)", borderLeft: "5px solid #2D6A4F", position: "relative", overflow: "visible" }}>
      <div className="flex items-center justify-center gap-1" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0E4633" }}>{label}</p>
        {tip && <InfoDot tip={tip} />}
      </div>
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon size={18} style={{ color: "#0E4633", opacity: 0.85, flexShrink: 0 }} />}
        <p style={{ fontSize: 24, fontWeight: 700, color: "#0E4633", lineHeight: 1 }}>{displayFmt(animated)}</p>
      </div>
      {sub && <p style={{ fontSize: 9.5, color: "rgba(14,70,51,0.55)", marginTop: 4 }}>{sub}</p>}
      {pct !== undefined && (
        <div className="relative" style={{ marginTop: 10, height: 4, borderRadius: 4, backgroundColor: "rgba(14,70,51,0.12)" }} title={bench !== undefined ? `Benchmark: ${Math.round(bench)}%` : undefined}>
          <div style={{ height: "100%", width: `${Math.max(4, Math.min(100, pct))}%`, backgroundColor: bench !== undefined ? benchColor(pct, bench) : "#0E4633", borderRadius: 4 }} />
          {bench !== undefined && (
            <div className="absolute" style={{ top: -3, bottom: -3, width: 2, left: `${Math.min(100, bench)}%`, backgroundColor: "#0E4633", borderRadius: 1 }} />
          )}
        </div>
      )}
    </div>
  );
}

function PerformanceTable({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr>
            <th className="text-left text-gray-400 font-bold pb-2 pr-3 uppercase tracking-wider text-[8px]">Metric</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">Unit</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">Target</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">Actual</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">% Achieved</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">Male</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">Female</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">PWD</th>
            <th className="text-center text-gray-400 font-bold pb-2 px-2 uppercase tracking-wider text-[8px]">Refugee</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="py-2 pr-3 text-left font-medium text-gray-700">{row.metric}</td>
              <td className="py-2 px-2 text-center text-gray-600">{row.unit}</td>
              <td className="py-2 px-2 text-center font-bold text-gray-700">{row.target}</td>
              <td className="py-2 px-2 text-center font-bold text-gray-900">{row.actual}</td>
              <td className="py-2 px-2 text-center font-bold text-blue-600">{row.pctAchieved}</td>
              <td className="py-2 px-2 text-center text-gray-600">{row.male}</td>
              <td className="py-2 px-2 text-center text-gray-600">{row.female}</td>
              <td className="py-2 px-2 text-center text-gray-600">{row.pwd}</td>
              <td className="py-2 px-2 text-center text-gray-600">{row.refugee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HENTOverview() {
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
  const [geoRegion, setGeoRegion] = useState("All Regions");
  const [geoCountry, setGeoCountry] = useState("All Countries");
  const [geoYear, setGeoYear] = useState("All Years");
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false, 3: false });

  const toggleGroup = (groupIdx: number) => {
    setExpandedGroups(prev => ({ ...prev, [groupIdx]: !prev[groupIdx] }));
  };

  const HeroMetric = ({ label, value, unit, color, Icon, isFormatted }: {
    label: string; value: string | number; unit: string; color: string; Icon: LucideIcon; isFormatted?: boolean;
  }) => {
    const num = typeof value === 'string' ? parseInt(value) : value;
    const animated = useCountUp(num);
    return (
      <div style={{ backgroundColor: "white", borderRadius: 12, border: `2px solid ${color}`, padding: "20px", textAlign: "center" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon size={24} style={{ color, opacity: 0.8 }} />
        </div>
        <p style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>
          {isFormatted ? value : Math.round(animated).toLocaleString()}
        </p>
        <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>{label}</p>
        <p style={{ fontSize: 11, color: "#9CA3AF" }}>{unit}</p>
      </div>
    );
  };

  const StatGroup = ({ title, idx, expanded, onToggle, cards }: {
    title: string; idx: number; expanded: boolean; onToggle: (n: number) => void;
    cards: Array<{ label: string; value: string | number; sub?: string; icon: LucideIcon; isFormatted?: boolean }>;
  }) => (
    <div style={{ backgroundColor: "white", borderRadius: 12, border: "1px solid rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
      <button
        onClick={() => onToggle(idx)}
        style={{
          width: "100%",
          padding: "14px 18px",
          backgroundColor: "#f9fafb",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid rgba(0, 0, 0, 0.06)" : "none",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#0E4633", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            {title}
          </p>
        </div>
        <span style={{ fontSize: 20, color: "#9CA3AF", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          ▼
        </span>
      </button>
      {expanded && (
        <div style={{ padding: "16px 18px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card, i) => (
              <div key={i} style={{
                backgroundColor: "#fafbfc",
                borderRadius: 8,
                border: "1px solid rgba(0, 0, 0, 0.04)",
                padding: "12px 14px",
                textAlign: "center",
              }}>
                <div className="flex items-center justify-center mb-2">
                  <card.icon size={16} style={{ color: "#0E4633", opacity: 0.7 }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0E4633", margin: 0, lineHeight: 1.2, marginBottom: 4 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.03em", margin: 0 }}>
                  {card.label}
                </p>
                {card.sub && <p style={{ fontSize: 8, color: "#9CA3AF", marginTop: 2, margin: 0 }}>{card.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const perfTableData = [
    { metric: "Ventures Supported", unit: "Ventures", target: TARGETS.ventures, actual: ACTUAL_VENTURES, pctAchieved: `${Math.round((ACTUAL_VENTURES / TARGETS.ventures) * 100)}%`, male: "—", female: "—", pwd: "—", refugee: "—" },
    { metric: "Jobs Created", unit: "Jobs", target: TARGETS.jobs.toLocaleString(), actual: ACTUAL_JOBS.toLocaleString(), pctAchieved: `${Math.round((ACTUAL_JOBS / TARGETS.jobs) * 100)}%`, male: "—", female: "—", pwd: "—", refugee: "—" },
    { metric: "Startup Funds Disbursed", unit: "USD", target: fmt$K(TARGETS.funds), actual: fmt$K(ACTUAL_FUNDS), pctAchieved: `${Math.round((ACTUAL_FUNDS / TARGETS.funds) * 100)}%`, male: "—", female: "—", pwd: "—", refugee: "—" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <PortalNav portal="hent" />

      {/* HEADER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#2D6A4F", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(14,70,51,0) 100%)" }} />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Overview</h1>
            <p className="text-[13px] sm:text-sm mt-2 font-medium" style={{ color: "#B9E5D7" }}>Programme delivery, participation, ventures and impact</p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px]" style={{ color: "rgba(255,255,255,0.85)" }}>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Data source:</span> HENT Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* HERO BAND — 4-6 primary metrics */}
      <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <HeroMetric label="Hackathon Participants" value={hackPart} unit="across 12 events" color="#1B4332" Icon={Users} />
        <HeroMetric label="Startups Created" value={hackStart} unit="from projects developed" color="#E76F51" Icon={Rocket} />
        <HeroMetric label="Jobs Created" value={TOTAL_JOBS} unit="by HENT ventures" color="#2D6A4F" Icon={Briefcase} />
        <HeroMetric label="Funding Deployed" value={fmt$K(TOTAL_FUNDING)} unit="across 3 fund types" color="#1F9E9E" Icon={Zap} isFormatted />
      </div>

      {/* NARRATIVE SUMMARY */}
      <div style={{ backgroundColor: "#f0f7f5", border: "1px solid rgba(45, 106, 79, 0.15)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "#1B4332", lineHeight: 1.6, margin: 0 }}>
          <span style={{ fontWeight: 600 }}>What this shows:</span> {TOTAL_JOBS > 1500 ? "Momentum is strong across all dimensions. " : "Good progress, with opportunities to accelerate. "}
          {Math.round((ACTUAL_VENTURES / TARGETS.ventures) * 100) > 50 ? `Active ventures are tracking well (${ACTUAL_VENTURES}/${TARGETS.ventures} target), ` : `Active ventures need acceleration (${ACTUAL_VENTURES}/${TARGETS.ventures} target), `}
          and founder engagement remains high ({NPS_SCORE} NPS). Focus areas this period: youth employment uptick and venture recommendations.
        </p>
      </div>

      {/* SECTION FILTER PILLS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {[{ n: 0, label: "All Sections" }, { n: 1, label: "Innovation & Learning" }, { n: 2, label: "Enterprise & Impact" }, { n: 3, label: "Youth Employment" }, { n: 4, label: "Funding Overview" }].map(({ n, label }) => {
          const on = n === 0 ? activeSection === "all" : activeSection === n;
          return (
            <button key={n} onClick={() => setActiveSection(n === 0 ? "all" : n)}
              style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer", border: `1px solid ${on ? "#0E4633" : "rgba(14,70,51,0.18)"}`, backgroundColor: on ? "#0E4633" : "white", color: on ? "white" : "#6B7280" }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* GROUPED SUPPORTING STATS */}
      <div className="space-y-6 mb-12">
        {/* Group 1: Innovation & Learning */}
        <StatGroup
          title="Innovation & Learning"
          idx={0}
          expanded={expandedGroups[0]}
          onToggle={toggleGroup}
          cards={[
            { label: "Hackathon Participants", value: hackPart.toLocaleString(), icon: Users },
            { label: "Projects Developed", value: hackProjects, icon: Lightbulb },
            { label: "Startups Created", value: hackStart, icon: Rocket },
            { label: "NPS Score", value: NPS_SCORE, sub: "Net Promoter Score", icon: TrendingUp },
            { label: "Study Trips", value: studyTrips.length, icon: MapPin },
            { label: "Masterclasses", value: masterclasses.length, icon: Presentation },
            { label: "Mentorships", value: mentorshipPrograms.length, icon: Users },
          ]}
        />

        {/* Group 2: Enterprise & Impact */}
        <StatGroup
          title="Enterprise & Impact"
          idx={1}
          expanded={expandedGroups[1]}
          onToggle={toggleGroup}
          cards={[
            { label: "Active Ventures", value: ALL_VENTURES.filter(v => v.status === "Active").length, icon: Rocket },
            { label: "Partnerships Built", value: TOTAL_PSHIP, icon: Handshake },
            { label: "Funding Deployed", value: fmt$K(TOTAL_FUNDING), icon: TrendingUp, isFormatted: true },
            { label: "Revenue Generated", value: fmt$K(ALL_VENTURES.reduce((s, v) => s + v.revenue, 0)), icon: Zap, isFormatted: true },
            { label: "Recommended Ventures", value: recommendedVentures, icon: Award },
            { label: "In Accelerators", value: `${acceleratorPct}%`, icon: Rocket },
            { label: "Female-Led Ventures", value: ALL_VENTURES.filter(v => v.teamGender === "Female").length, icon: Sparkles },
          ]}
        />

        {/* Group 3: Youth Employment */}
        <StatGroup
          title="Youth Employment"
          idx={2}
          expanded={expandedGroups[2]}
          onToggle={toggleGroup}
          cards={[
            { label: "Youth Jobs Created", value: TOTAL_JOBS_YOUTH.toLocaleString(), icon: Users },
            { label: "Youth Jobs %", value: `${Math.round((TOTAL_JOBS_YOUTH / TOTAL_JOBS) * 100)}%`, icon: TrendingUp },
            { label: "Avg per Venture", value: Math.round(TOTAL_JOBS_YOUTH / ALL_VENTURES.length), icon: Briefcase },
          ]}
        />

        {/* Group 4: Funding Breakdown */}
        <StatGroup
          title="Funding Overview"
          idx={3}
          expanded={expandedGroups[3]}
          onToggle={toggleGroup}
          cards={[
            { label: "Charitable Fund", value: fmt$K(fundsCharitable), icon: Heart, isFormatted: true },
            { label: "Venture Fund", value: fmt$K(fundsVentureF), icon: TrendingUp, isFormatted: true },
            { label: "Catalytic Fund", value: fmt$K(fundsCatalytic), icon: Zap, isFormatted: true },
            { label: "Ventures Funded", value: `${ALL_VENTURES.filter(v => v.funding > 0).length}/${ALL_VENTURES.length}`, icon: Briefcase },
          ]}
        />

        {/* Group 5: Participant Demographics */}
        <StatGroup
          title="Participant Reach"
          idx={4}
          expanded={false}
          onToggle={toggleGroup}
          cards={[
            { label: "Total Participants", value: TOTAL_PART.toLocaleString(), icon: Users },
            { label: "Female Participants", value: TOTAL_FEM.toLocaleString(), icon: Sparkles },
            { label: "PWD Participants", value: pwdCount, icon: Heart },
            { label: "Refugee Participants", value: refugeeCount, icon: Handshake },
            { label: "MCF Scholars", value: mcfCount, icon: Award },
          ]}
        />
      </div>
      </div>

      {/* CHART SECTIONS */}
      <div className="max-w-[1440px] mx-auto px-6" style={{ marginTop: 32 }}>

      {/* SECTION 1: INNOVATION & LEARNING */}
      {show(1) && (
      <section className="mb-12">
        <SectionHeader title="Innovation & Learning" sub="Hackathon innovation pipeline and learning satisfaction" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24, marginTop: 16 }}>
          <ChartCard title="Innovation Funnel" sub="Hackathon participants to portfolio ventures" accent={PRIMARY}>
            <Funnel steps={[
              { label: "Hackathon Participants", value: hackPart },
              { label: "Projects Developed", value: hackProjects },
              { label: "Startups Created", value: hackStart },
              { label: "Portfolio Ventures", value: ALL_VENTURES.length },
            ]} />
          </ChartCard>
          <PlainCard title="Learning Satisfaction" sub="Average score across programmes (1-5 scale)">
            <SatisfactionBars dimensions={HEAT_COLS} series={radarSeries} target={4.5} height={260} />
          </PlainCard>
        </div>
      </section>
      )}

      {/* SECTION 2: ENTERPRISE DEVELOPMENT & IMPACT */}
      {show(2) && (
      <section className="mb-12">
        <SectionHeader title="Enterprise Development & Impact" sub="Venture stage distribution, sector mix, and portfolio health" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24, marginTop: 16 }}>
          <ChartCard title="Venture Stage Pipeline" sub="Expose · Build · Scale distribution" accent={PRIMARY}>
            <DonutRing data={stageData} colors={DISTINCT} total={ALL_VENTURES.length} totalLabel="Ventures" height={280} legendPercent />
          </ChartCard>
          <ChartCard title="Sector Distribution" sub="Ventures by health sub-sector" accent={GREEN}>
            <DonutRing data={sectorData} colors={DISTINCT} total={ALL_VENTURES.length} totalLabel="Ventures" height={280} legendPercent />
          </ChartCard>
        </div>
      </section>
      )}

      {/* SECTION 3: YOUTH EMPLOYMENT OUTCOMES (renumbered from 4) */}
      {show(3) && (
      <section className="mb-12">
        <SectionHeader title="Youth Employment Outcomes" sub="Youth employment trends by venture cohort" />
        <div style={{ marginTop: 16 }}>
          {youthJobsByYear.length > 0 && (
          <ChartCard title="Youth Employment by Cohort" sub="Youth jobs created by venture cohort year" accent={AMBER}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={youthJobsByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="Youth Jobs" fill="#2D6A4F" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="Other Jobs" fill="#BBD59B" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          )}
        </div>
      </section>
      )}

      {/* SECTION 4: FUNDING OVERVIEW (renumbered from 5) */}
      {show(4) && (
      <section className="mb-12">
        <SectionHeader title="Funding Overview" sub="Capital deployed by fund type" />
        <div style={{ marginTop: 16 }}>
          {fundTypeData.length > 0 && (
          <ChartCard title="Funding Source Mix" sub="Capital deployed by fund type" accent={GREEN}>
            <DonutRing data={fundTypeData} colors={fundTypeColors} total={TOTAL_FUNDING} totalLabel="Total Deployed" height={280} legendPercent />
          </ChartCard>
          )}
        </div>
      </section>
      )}

      </div>

      {/* FOOTER */}
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <PortalFooter portal="hent" synced="01 Jun 2026, EAT" />
      </div>
    </div>
  );
}
