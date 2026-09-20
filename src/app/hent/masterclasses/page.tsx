"use client";
import { HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hent";
import { ChartCard, SectionHeader, ChartTip, ChartLegend, BarList, useCountUp } from "@/components/ui/hent";
import { benchColor } from "@/theme/tokens";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar, Cell,
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Star, Zap, Briefcase, Users, TrendingUp, CheckCircle2 } from "lucide-react";

// Female icon - matches ventures page
function WomanIcon({ size = 20, color, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color ?? "currentColor"} stroke={color ?? "currentColor"} style={style}>
      <circle cx="12" cy="3.4" r="3.25" stroke="none" />
      <path d="M8.3 7.1 L15.7 7.1 L14.24 12.2 L17.15 18.3 L6.85 18.3 L9.76 12.2 Z" stroke="none" />
      <path d="M8.98 7.5 C7.07 9.8 6.29 12.45 6.29 15.5" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15.02 7.5 C16.93 9.8 17.71 12.45 17.71 15.5" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10.21 18.3 L10.21 22.3" fill="none" strokeWidth="2.7" strokeLinecap="round" />
      <path d="M13.79 18.3 L13.79 22.3" fill="none" strokeWidth="2.7" strokeLinecap="round" />
    </svg>
  );
}
import PortalNav from "@/components/layout/portal-nav";
import { CHART } from "@/theme/tokens";
import PortalFooter from "@/components/layout/portal-footer";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import { DonutRing } from "@/components/charts/donut-chart";
import {
  masterclasses,
  MC_TOPICS, RATING_CRITERIA,
  type MCTopic,
} from "@/data/masterclasses";
import { ventures as ALL_VENTURES } from "@/data/ventures";

// â”€â”€â”€ Palette (green family, distinct by hue) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY      = "#0F4C3A"; // brand green (footer)
const ACCENT    = "#1F9E9E"; // page identity — masterclasses = teal
const VIOLET_MC = "#6B8E5B"; // moss
const EMERALD_MC = "#40916C"; // sea green
const AMBER_MC  = "#A6C13C"; // lime
const SKY       = "#4C8C8A"; // dusty teal
const ORANGE_MC = "#2D8A8A"; // deep teal
const TEAL      = "#2D8A8A"; // deep teal
const ROSE      = "#94A93B"; // olive

// Donut palettes — green ramp, distinct within each set
const AGE_COLORS    = ["#1B4332", "#1F9E9E", "#A6C13C", "#6B8E5B"];
const REGION_COLORS = ["#1B4332", "#1F9E9E", "#A6C13C", "#6B8E5B", "#40916C"];
const STAGE_COLORS  = ["#1B4332", "#2D8A8A", "#A6C13C"];
const SOCIAL_COLORS = ["#1B4332", "#40916C", "#A6C13C"];

const RATING_COLORS: Record<string, string> = {
  "Very High": "#1B4332", High: "#40916C", Moderate: "#A6C13C", Low: "#C44536",
};

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Youth-in-Work-style filter select (green theme)
function ratingLabel(score: number): string {
  if (score >= 4.5) return "Very High";
  if (score >= 3.8) return "High";
  if (score >= 3.0) return "Moderate";
  return "Low";
}

// â”€â”€â”€ Shared sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Custom SVG donut  -  same as overview, guarantees hex fill colours
const DISTINCT = ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5","#00BBF9","#BC6C25","#8AB17D","#D62828","#3D405B"];
function CustomDonut({ data, className = "" }: {
  data: { name: string; value: number }[];
  colors?: string[];
  label?: string;
  valueFormatter?: (v: number) => string;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const height = className.includes("h-52") ? 300 : 260;
  return <DonutRing data={data} colors={DISTINCT} total={total} totalLabel="Total" height={height} legendPercent />;
}

// Multi-colour horizontal bar list
function ColorBarList({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const max = data[0]?.value ?? 1;
  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const col = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="w-[96px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
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

function ProfileCard({ label, value, pct, total: tot, color }: {
  label: string; value: number; pct: number; total: number; color: string;
}) {
  return (
    <div className="rounded-[10px]" style={{ backgroundColor: "#ffffff", border: "1px solid #2D6A4F", padding: "13px 15px" }}>
      <p className="tabular-nums" style={{ fontSize: 21, fontWeight: 800, color: "#2D6A4F", lineHeight: 1.05 }}>{pct}%</p>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{label}</p>
      <p className="tabular-nums" style={{ fontSize: 9, fontWeight: 500, color: "#9CA3AF", marginTop: 2 }}>{value.toLocaleString()} / {tot.toLocaleString()}</p>
      <div className="rounded-sm mt-2 overflow-hidden" style={{ height: 5, backgroundColor: color + "20" }}>
        <div className="h-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RatingBar({ label, sessions, criterion }: {
  label: string;
  sessions: typeof masterclasses;
  criterion: typeof RATING_CRITERIA[number];
}) {
  const avg = sessions.length
    ? (sessions.reduce((s, m) => s + m.scores[criterion], 0) / sessions.length).toFixed(1) : " - ";
  return (
    <div className="flex items-center gap-4 mb-3 last:mb-0">
      <div className="w-40 text-[12px] font-bold text-gray-900 text-right flex-shrink-0">{label}</div>
      <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden" style={{ backgroundColor: "#0E4633" }}>
      </div>
      <div className="w-10 text-[13px] font-black text-right flex-shrink-0 tabular-nums text-gray-900">{avg}/5</div>
    </div>
  );
}

function GenderRatingBar({ label, fSessions, mSessions, criterion }: {
  label: string;
  fSessions: typeof masterclasses;
  mSessions: typeof masterclasses;
  criterion: typeof RATING_CRITERIA[number];
}) {
  const fAvg = fSessions.length ? fSessions.reduce((s, m) => s + m.scores[criterion], 0) / fSessions.length : 0;
  const mAvg = mSessions.length ? mSessions.reduce((s, m) => s + m.scores[criterion], 0) / mSessions.length : 0;
  return (
    <div className="space-y-2 mb-3 last:mb-0">
      <div className="flex items-center gap-4">
        <div className="w-40 text-[12px] font-bold text-gray-900 text-right flex-shrink-0">
          {label} <span className="text-[11px] text-gray-500">(F)</span>
        </div>
        <div className="flex-1 h-8 rounded overflow-hidden" style={{ backgroundColor: VIOLET_MC }}>
        </div>
        <span className="w-10 text-[13px] font-black text-right flex-shrink-0 text-gray-900">{fAvg.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40 text-[12px] font-bold text-gray-900 text-right flex-shrink-0">
          <span className="text-[11px] text-gray-500">(M)</span>
        </div>
        <div className="flex-1 h-8 rounded overflow-hidden" style={{ backgroundColor: SKY }}>
        </div>
        <span className="w-10 text-[13px] font-black text-right flex-shrink-0 text-gray-900">{mAvg.toFixed(1)}</span>
      </div>
    </div>
  );
}

function Stars({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10}
          className={i <= Math.floor(score) ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
      ))}
      <span className="text-[10px] text-gray-500 ml-1">{score.toFixed(1)}</span>
    </span>
  );
}


// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MasterclassesPage() {
  const [yearFilter,  setYearFilter]  = useState<"All"|"2022"|"2023"|"2024"|"2025"|"2026">("All");
  const [topicFilter, setTopicFilter] = useState<"All"|MCTopic>("All");
  const [genderView,  setGenderView]  = useState<"All"|"Female"|"Male">("All");
  const [activeSection, setActiveSection] = useState<number>(1);
  const show = (n: number) => activeSection === n;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersActive = (yearFilter !== "All" ? 1 : 0) + (topicFilter !== "All" ? 1 : 0) + (genderView !== "All" ? 1 : 0);

  const filtered = useMemo(() => masterclasses.filter(m => {
    if (yearFilter  !== "All" && m.year  !== Number(yearFilter))          return false;
    if (topicFilter !== "All" && m.topic !== topicFilter)                 return false;
    if (genderView  === "Female" && m.femaleAttendees <= m.attendees / 2) return false;
    if (genderView  === "Male"   && m.femaleAttendees >  m.attendees / 2) return false;
    return true;
  }), [yearFilter, topicFilter, genderView]);

  const tot = {
    sessions:   filtered.length,
    attendees:  filtered.reduce((s, m) => s + m.attendees,          0),
    female:     filtered.reduce((s, m) => s + m.femaleAttendees,     0),
    students:   filtered.reduce((s, m) => s + m.studentAttendees,    0),
    ventures:   filtered.reduce((s, m) => s + m.venturesRepresented, 0),
    femaleVent: filtered.reduce((s, m) => s + m.femaleLedVentures,   0),
    completion: filtered.length
      ? Math.round(filtered.reduce((s, m) => s + m.completionRate, 0) / filtered.length) : 0,
  };
  const avgAtt     = filtered.length ? Math.round(tot.attendees / filtered.length) : 0;
  const femalePct  = tot.attendees ? Math.round((tot.female   / tot.attendees) * 100) : 0;
  const studentPct = tot.attendees ? Math.round((tot.students / tot.attendees) * 100) : 0;
  const alumniTot  = tot.attendees - tot.students;

  const fSessions = filtered.filter(m => m.femaleAttendees > m.attendees / 2);
  const mSessions = filtered.filter(m => m.femaleAttendees <= m.attendees / 2);

  const byAge    = { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 };
  const byRegion = { "East Africa": 0, "West Africa": 0, "South Africa": 0, "North Africa": 0, Other: 0 };
  const byStage  = { Expose: 0, Build: 0, Scale: 0 };
  const bySocial = { "MCF Scholars": 0, PWD: 0, "Refugee-Displaced": 0 };

  filtered.forEach(m => {
    (Object.keys(m.byAge)    as (keyof typeof byAge)[]).forEach(k    => { byAge[k]    += m.byAge[k]; });
    (Object.keys(m.byRegion) as (keyof typeof byRegion)[]).forEach(k => { byRegion[k] += m.byRegion[k]; });
    (Object.keys(m.byStage)  as (keyof typeof byStage)[]).forEach(k  => { byStage[k]  += m.byStage[k]; });
    (Object.keys(m.bySocial) as (keyof typeof bySocial)[]).forEach(k => { bySocial[k] += m.bySocial[k]; });
  });

  const ageData    = Object.entries(byAge).map(([name, value]) => ({ name, value }));
  const regionData = Object.entries(byRegion).map(([name, value]) => ({ name, value }));
  const stageData  = Object.entries(byStage).map(([name, value]) => ({ name, value }));
  const socialData = Object.entries(bySocial).map(([name, value]) => ({ name, value }));

  const MC_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const attendanceTrend = [...filtered]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(m => ({
      Session: `${MC_MONTHS[m.month - 1]} '${String(m.year).slice(2)}`,
      Attendees: m.attendees,
    }));

  let cum = 0;
  const growthData = [...filtered]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(m => {
      cum += m.attendees;
      return { Period: `${m.year}-${String(m.month).padStart(2, "0")}`, "Cumulative Attendees": cum };
    });

  const topSessions = [...filtered]
    .map(m => ({ ...m, avgScore: RATING_CRITERIA.reduce((s, c) => s + m.scores[c], 0) / RATING_CRITERIA.length }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 6);

  const engagedVentures = [...ALL_VENTURES]
    .sort((a, b) => b.founderEngagement - a.founderEngagement)
    .slice(0, 6)
    .map((v, i) => ({ name: v.name, sector: v.sector, sessions: Math.max(1, filtered.length - i * 2), engagement: v.founderEngagement }));

  const genderTrend = [2022, 2023, 2024, 2025, 2026].map(yr => {
    const yms = filtered.filter(m => m.year === yr);
    return {
      Year: String(yr),
      Female: yms.reduce((s, m) => s + m.femaleAttendees, 0),
      Male:   yms.reduce((s, m) => s + (m.attendees - m.femaleAttendees), 0),
    };
  });

  const completionData = [...filtered]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(m => ({ Session: `${MC_MONTHS[m.month - 1]} '${String(m.year).slice(2)}`, "Completion %": m.completionRate }));

  const RANK_BG = [AMBER_MC, "#9CA3AF", "#D97706"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <PortalNav portal="hent" />

      {/* â”€â”€ HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#2D6A4F", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(14,70,51,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Masterclasses</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Capacity-building sessions, attendance and participant satisfaction</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2023–2026</span>
              <span aria-hidden="true">·</span>
              <span>{masterclasses.length} sessions tracked</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ MAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* KPI strip */}
        <HeaderStatsPanel
          title="Masterclasses Metrics"
          cards={[
            { label: "Total Masterclasses", num: tot.sessions, displayFmt: (n) => String(Math.round(n)), icon: Briefcase, tip: "Capacity-building sessions delivered across all periods.", sub: `${Math.round((tot.sessions / 20) * 100)}% of 20 target`, pace: true, paceA: tot.sessions, paceT: 20 },
            { label: "Total Attendees", num: tot.attendees, displayFmt: (n) => Math.round(n).toLocaleString(), icon: Users, tip: "Cumulative participant attendance across all sessions.", sub: `${Math.round((tot.attendees / 797) * 100)}% of 797 target`, pace: true, paceA: tot.attendees, paceT: 797 },
            { label: "Ventures Represented", num: tot.ventures, displayFmt: (n) => Math.round(n).toLocaleString(), icon: TrendingUp, tip: "Unique ventures with founder/team attendance.", sub: `${Math.round((tot.ventures / 200) * 100)}% of 200 target`, pace: true, paceA: tot.ventures, paceT: 200 },
            { label: "Female Participants", num: femalePct, displayFmt: (n) => `${Math.round(n)}%`, icon: WomanIcon, tip: `${tot.female} female attendees out of ${tot.attendees} total.`, sub: "Gender diversity target: 50%", pace: true, paceA: tot.female, paceT: tot.attendees / 2 },
            { label: "Alumni Participants", num: 100 - studentPct, displayFmt: (n) => `${Math.round(n)}%`, icon: CheckCircle2, tip: `${alumniTot} alumni attendees out of ${tot.attendees} total.`, sub: "Alumni engagement goal: 40%", pace: true, paceA: alumniTot, paceT: tot.attendees * 0.4 },
          ]}
        />

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent="#0E4633"
            value={String(activeSection)}
            onChange={(v) => setActiveSection(Number(v))}
            options={[
              { label: "Delivery & Performance", value: "1" },
              { label: "Participant Profile", value: "2" },
              { label: "Quality & Impact", value: "3" },
            ]}
          />

          <div style={{ position: "relative" }}>
            <FilterButton
              activeFilterCount={filtersActive}
              isOpen={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            />
            <FilterDropdown
              isOpen={filtersOpen}
              onResetFilters={() => { setYearFilter("All"); setTopicFilter("All"); setGenderView("All"); }}
            >
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#0E4633", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  Year
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(["All", "2022", "2023", "2024", "2025", "2026"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setYearFilter(opt as typeof yearFilter)}
                      style={{
                        fontSize: 10,
                        fontWeight: yearFilter === opt ? 700 : 500,
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: `1px solid ${yearFilter === opt ? "#2D6A4F" : "rgba(14,70,51,0.12)"}`,
                        backgroundColor: yearFilter === opt ? "#2D6A4F" : "white",
                        color: yearFilter === opt ? "white" : "#0E4633",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#0E4633", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  Topic
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(["All", ...MC_TOPICS] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setTopicFilter(opt as typeof topicFilter)}
                      style={{
                        fontSize: 10,
                        fontWeight: topicFilter === opt ? 700 : 500,
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: `1px solid ${topicFilter === opt ? "#2D6A4F" : "rgba(14,70,51,0.12)"}`,
                        backgroundColor: topicFilter === opt ? "#2D6A4F" : "white",
                        color: topicFilter === opt ? "white" : "#0E4633",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#0E4633", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  Gender
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(["All", "Female", "Male"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setGenderView(opt as typeof genderView)}
                      style={{
                        fontSize: 10,
                        fontWeight: genderView === opt ? 700 : 500,
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: `1px solid ${genderView === opt ? "#2D6A4F" : "rgba(14,70,51,0.12)"}`,
                        backgroundColor: genderView === opt ? "#2D6A4F" : "white",
                        color: genderView === opt ? "white" : "#0E4633",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </FilterDropdown>
          </div>
        </div>

        {/* SECTION 1: DELIVERY & PERFORMANCE */}
        {show(1) && (
        <section>
          <SectionHeader title="Delivery & Performance"
            sub={`Attendance trends, completion rates, and growth metrics across ${filtered.length} sessions`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Attendance by Session"
              sub="Attendees per masterclass in chronological order"
              accent={ORANGE_MC}>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={attendanceTrend.slice(0, 12)} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Session" tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false} tickLine={false} height={70} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Attendees" fill={ORANGE_MC} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Attendees", ORANGE_MC]]} />
            </ChartCard>

            <ChartCard title="Attendance by Gender per Year"
              sub="Female vs male participants  -  yearly comparison"
              accent={VIOLET_MC}>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={genderTrend} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Female" fill={VIOLET_MC} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Male"   fill={SKY}       radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Female", VIOLET_MC], ["Male", SKY]]} />
            </ChartCard>
          </div>

          {/* Growth & Completion */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <ChartCard title="Cumulative Attendee Growth"
              sub="Running total of participants  -  shows programme reach expansion"
              accent={VIOLET_MC}>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={growthData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Period" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Line type="monotone" dataKey="Cumulative Attendees"
                    stroke={VIOLET_MC} strokeWidth={2.5} dot={{ r: 4, fill: VIOLET_MC, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Cumulative attendees", VIOLET_MC]]} />
            </ChartCard>

            <ChartCard title="Completion Rate by Session"
              sub="Percentage of registered attendees who completed each masterclass"
              accent={TEAL}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={completionData.slice(0, 12)} barCategoryGap="30%" margin={{ top: 0, right: 8, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Session" tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Completion %" fill={TEAL} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div>
                  <p className="text-lg font-bold" style={{ color: VIOLET_MC }}>{tot.completion}%</p>
                  <p className="text-[9px] text-gray-400">Avg completion</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: EMERALD_MC }}>{filtered.filter(m => m.completionRate >= 90).length}</p>
                  <p className="text-[9px] text-gray-400">Sessions ≥90%</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: AMBER_MC }}>{filtered.filter(m => m.completionRate < 80).length}</p>
                  <p className="text-[9px] text-gray-400">Sessions &lt;80%</p>
                </div>
              </div>
            </ChartCard>
          </div>
        </section>
        )}

        {/* SECTION 2: DEMOGRAPHICS */}
        {show(2) && (
        <section>
          <SectionHeader title="Participant Demographics"
            sub="Attendance breakdown by gender, age, stage, region, and social inclusion" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Age Group Distribution" sub="Participants by age bracket" accent={SKY}>
              <CustomDonut data={ageData} colors={AGE_COLORS} className="h-36" valueFormatter={v => `${v}`} />
              <div className="mt-2 space-y-0.5">
                {ageData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: AGE_COLORS[i] }} />{d.name}
                    </span>
                    <span className="font-medium" style={{ color: AGE_COLORS[i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Geographic Region" sub="Participants by region of origin" accent={EMERALD_MC}>
              <CustomDonut data={regionData} colors={REGION_COLORS} className="h-36" valueFormatter={v => `${v}`} />
              <div className="mt-2 space-y-0.5">
                {regionData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-gray-500 truncate min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: REGION_COLORS[i] }} />
                      <span className="truncate">{d.name}</span>
                    </span>
                    <span className="font-medium ml-1 flex-shrink-0" style={{ color: REGION_COLORS[i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Venture Stage" sub="Attendees by venture development stage" accent={VIOLET_MC}>
              <CustomDonut data={stageData} colors={STAGE_COLORS} className="h-36" valueFormatter={v => `${v}`} />
              <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-gray-100 text-center">
                {stageData.map((d, i) => (
                  <div key={d.name}>
                    <p className="text-sm font-black" style={{ color: STAGE_COLORS[i] }}>{d.value}</p>
                    <p className="text-[9px] text-gray-400">{d.name}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Social Inclusion Groups" sub="MCF scholars, PWD, refugee-displaced" accent={AMBER_MC}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={socialData.map((s, i) => ({
                    name: s.name,
                    value: s.value,
                    percentage: tot.attendees > 0 ? Math.round((s.value / tot.attendees) * 100) : 0,
                    idx: i,
                  }))}
                  margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) {
                        const data = payload[0].payload as typeof socialData[0] & { percentage: number };
                        return (
                          <div style={{ backgroundColor: "white", padding: "8px 10px", borderRadius: 4, border: "1px solid #E5E7EB" }}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#0E4633", margin: "0 0 4px 0" }}>{data.name}</p>
                            <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>{data.value} participants ({data.percentage}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {socialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SOCIAL_COLORS[index % SOCIAL_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-gray-100 text-center">
                {socialData.map((d, i) => (
                  <div key={d.name}>
                    <p className="text-sm font-black" style={{ color: SOCIAL_COLORS[i] }}>{d.value}</p>
                    <p className="text-[9px] text-gray-400">{d.name}</p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>
        )}

        {/* SECTION 3: QUALITY & IMPACT */}
        {show(3) && (
        <section>
          <SectionHeader title="Attendance Trends"
            sub="Session attendance and yearly gender breakdown" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Attendance by Session"
              sub="Attendees per masterclass in chronological order"
              accent={ORANGE_MC}>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={attendanceTrend.slice(0, 12)} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Session" tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false} tickLine={false} height={70} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Attendees" fill={ORANGE_MC} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Attendees", ORANGE_MC]]} />
            </ChartCard>

            <ChartCard title="Attendance by Gender per Year"
              sub="Female vs male participants  -  yearly comparison"
              accent={VIOLET_MC}>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={genderTrend} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Female" fill={VIOLET_MC} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Male"   fill={SKY}       radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Female", VIOLET_MC], ["Male", SKY]]} />
            </ChartCard>
          </div>
        </section>
        )}

        {/* HIDDEN: Old Section 4 (merged into Section 1) */}
        {false && (
        <section>
          <SectionHeader title="Growth &amp; Completion Analytics"
            sub="Cumulative reach and per-session completion rates across all masterclasses" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Cumulative Attendee Growth"
              sub="Running total of participants  -  shows programme reach expansion"
              accent={VIOLET_MC}>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={growthData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Period" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Line type="monotone" dataKey="Cumulative Attendees"
                    stroke={VIOLET_MC} strokeWidth={2.5} dot={{ r: 4, fill: VIOLET_MC, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Cumulative attendees", VIOLET_MC]]} />
            </ChartCard>

            <ChartCard title="Completion Rate by Session"
              sub="Percentage of registered attendees who completed each masterclass"
              accent={TEAL}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={completionData.slice(0, 12)} barCategoryGap="30%" margin={{ top: 0, right: 8, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Session" tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Completion %" fill={TEAL} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div>
                  <p className="text-lg font-bold" style={{ color: VIOLET_MC }}>{tot.completion}%</p>
                  <p className="text-[9px] text-gray-400">Avg completion</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: EMERALD_MC }}>{filtered.filter(m => m.completionRate >= 90).length}</p>
                  <p className="text-[9px] text-gray-400">Sessions ≥90%</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: AMBER_MC }}>{filtered.filter(m => m.completionRate < 80).length}</p>
                  <p className="text-[9px] text-gray-400">Sessions &lt;80%</p>
                </div>
              </div>
            </ChartCard>
          </div>
        </section>
        )}

        {/* HIDDEN: Old Section 5 (merged into Section 3) */}
        {false && (
        <section>
          <SectionHeader title="Top Performing Masterclasses & Most Engaged Ventures"
            sub="Highest-rated sessions and the ventures that attend most" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Top Performing Masterclasses"
              sub="Highest average attendee rating (out of 5)"
              accent={AMBER_MC}>
              <div className="space-y-2.5">
                {topSessions.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-3 pb-2.5 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? ACCENT }}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{m.topic} · {m.attendees} attendees</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Stars score={m.avgScore} />
                      <span className="text-sm font-bold tabular-nums" style={{ color: AMBER_MC }}>{m.avgScore.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Most Engaged Ventures"
              sub="Ventures that attended the most masterclass sessions"
              accent={ACCENT}>
              <div className="space-y-2.5">
                {engagedVentures.map((v, i) => (
                  <div key={v.name} className="flex items-center gap-3 pb-2.5 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? ACCENT }}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{v.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{v.sector}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold tabular-nums" style={{ color: ACCENT }}>{v.sessions}</p>
                      <p className="text-[10px] text-gray-400">sessions</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>
        )}

        {/* FOOTER */}
        <PortalFooter portal="hent" synced="28 May 2026, EAT" />

      </div>
    </div>
  );
}
