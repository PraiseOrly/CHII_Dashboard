"use client";
import { ChartCard, SectionHeader, InfoDot, Funnel, ChartTip, ChartLegend, BarList, useCountUp } from "@/components/ui/hent";
import { benchColor } from "@/theme/tokens";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar,
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Star, Zap, Briefcase } from "lucide-react";
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
function FilterSelect<T extends string>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: "1 1 130px" }}>
      <label style={{ fontSize: 9.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value as T)}
        style={{ width: "100%", fontSize: 12, border: "1px solid rgba(14,70,51,0.18)", borderRadius: 6, padding: "7px 9px", color: "#0E4633", backgroundColor: "white", cursor: "pointer" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

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
  const [hovered, setHovered] = useState<{ label: string; count: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const vh  = sessions.filter(s => s.scores[criterion] >= 4.5).length;
  const hi  = sessions.filter(s => s.scores[criterion] >= 3.8 && s.scores[criterion] < 4.5).length;
  const mo  = sessions.filter(s => s.scores[criterion] >= 3.0 && s.scores[criterion] < 3.8).length;
  const lo  = sessions.filter(s => s.scores[criterion] < 3.0).length;
  const tot = sessions.length || 1;
  const avg = sessions.length
    ? (sessions.reduce((s, m) => s + m.scores[criterion], 0) / sessions.length).toFixed(1) : " - ";
  const segs = [
    { key: "Very High", count: vh, color: RATING_COLORS["Very High"] },
    { key: "High",      count: hi, color: RATING_COLORS["High"] },
    { key: "Moderate",  count: mo, color: RATING_COLORS["Moderate"] },
    { key: "Low",       count: lo, color: RATING_COLORS["Low"] },
  ];
  return (
    <div className="relative flex items-center gap-3 mb-3 last:mb-0"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <div className="w-40 text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-5 bg-gray-100 rounded-sm overflow-hidden flex">
        {segs.map(s => (
          <div key={s.key} style={{ width: `${(s.count / tot) * 100}%`, backgroundColor: s.color, cursor: "pointer",
              opacity: hovered && hovered.label !== s.key ? 0.4 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovered({ label: s.key, count: s.count, color: s.color })} />
        ))}
      </div>
      <div className="w-10 text-[11px] text-gray-500 text-right flex-shrink-0 font-medium">{avg}/5</div>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hovered.color, left: pos.x, top: pos.y - 30, transform: "translateX(-50%)" }}>
          {hovered.label}: {hovered.count}
        </div>
      )}
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
    <div className="flex items-center gap-2 mb-2">
      <div className="w-36 text-[11px] text-gray-600 text-right flex-shrink-0">{label}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] w-5 font-bold flex-shrink-0" style={{ color: VIOLET_MC }}>F</span>
          <div className="flex-1 h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: VIOLET_MC + "20" }}>
            <div className="h-full rounded-sm" style={{ width: `${(fAvg / 5) * 100}%`, backgroundColor: VIOLET_MC }} />
          </div>
          <span className="text-[10px] text-gray-500 w-6">{fAvg.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] w-5 font-bold flex-shrink-0" style={{ color: SKY }}>M</span>
          <div className="flex-1 h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: SKY + "20" }}>
            <div className="h-full rounded-sm" style={{ width: `${(mAvg / 5) * 100}%`, backgroundColor: SKY }} />
          </div>
          <span className="text-[10px] text-gray-500 w-6">{mAvg.toFixed(1)}</span>
        </div>
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

function KpiTile({ label, num, displayFmt, sub, clr, pct, bench }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string; pct?: number; bench?: number;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(14,70,51,0.12)", borderLeft: "5px solid #2D6A4F", position: "relative", overflow: "visible" }}>
      <div className="flex items-center justify-center gap-1" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(14,70,51,0.55)" }}>{label}</p>
        {sub && <InfoDot tip={sub} />}
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: "#0E4633", lineHeight: 1 }}>{displayFmt(animated)}</p>
      <p style={{ fontSize: 9.5, color: "rgba(14,70,51,0.55)", marginTop: 4 }}>{sub}</p>
      {pct !== undefined ? (
        <div className="relative" style={{ marginTop: 10, height: 4, borderRadius: 4, backgroundColor: "rgba(14,70,51,0.12)" }} title={bench !== undefined ? `Benchmark: ${Math.round(bench)}%` : undefined}>
          <div style={{ height: "100%", width: `${Math.max(4, Math.min(100, pct))}%`, backgroundColor: bench !== undefined ? benchColor(pct, bench) : "#0E4633", borderRadius: 4 }} />
          {bench !== undefined && (
            <div className="absolute" style={{ top: -3, bottom: -3, width: 2, left: `${Math.min(100, bench)}%`, backgroundColor: "#0E4633", borderRadius: 1 }} />
          )}
        </div>
      ) : (
        <div style={{ marginTop: 10, height: 3, borderRadius: 999, backgroundColor: "rgba(14,70,51,0.12)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "100%", backgroundColor: "#0E4633", borderRadius: 999 }} />
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MasterclassesPage() {
  const [yearFilter,  setYearFilter]  = useState<"All"|"2023"|"2024"|"2025"|"2026">("All");
  const [topicFilter, setTopicFilter] = useState<"All"|MCTopic>("All");
  const [genderView,  setGenderView]  = useState<"All"|"Female"|"Male">("All");
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
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

  const genderTrend = [2023, 2024, 2025, 2026].map(yr => {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Masterclasses",     num: tot.sessions,    fmt: (n: number) => String(Math.round(n)),                   sub: "Sessions delivered",     clr: "#1E3A8A" },
            { label: "Total Attendees",          num: tot.attendees,   fmt: (n: number) => Math.round(n).toLocaleString(),          sub: "Across all sessions",    clr: "#14532D" },
            { label: "Ventures Represented",     num: tot.ventures,    fmt: (n: number) => Math.round(n).toLocaleString(),          sub: "Unique ventures",        clr: "#7C2D12" },
            { label: "Female-Led Ventures",      num: tot.femaleVent,  fmt: (n: number) => String(Math.round(n)),                   sub: `${tot.ventures > 0 ? Math.round((tot.femaleVent / tot.ventures) * 100) : 0}% of attending`, clr: "#6B21A8" },
            { label: "Avg Completion Rate",      num: tot.completion,  fmt: (n: number) => `${Math.round(n)}%`,                    sub: "Participants completing", clr: "#9D174D" },
          ].map(tile => (
            <KpiTile key={tile.label} label={tile.label} num={tile.num}
              displayFmt={tile.fmt} sub={tile.sub} clr={tile.clr}
              pct={tile.label === "Avg Completion Rate" ? tot.completion : undefined}
              bench={tile.label === "Avg Completion Rate" ? 85 : undefined} />
          ))}
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent="#0E4633"
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Ratings", value: "1" }, { label: "Demographics", value: "2" },
              { label: "Attendance", value: "3" }, { label: "Growth", value: "4" },
              { label: "Top Performers", value: "5" },
            ]}
          />

          <OutreachFilters
            accent="#0E4633"
            activeCount={filtersActive}
            onReset={() => { setYearFilter("All"); setTopicFilter("All"); setGenderView("All"); }}
          >
            <OFilterSelect label="Year" value={yearFilter} onChange={setYearFilter} accent="#0E4633"
              options={[{ value: "All" as const, label: "All Years" }, ...(["2023","2024","2025","2026"] as const).map(y => ({ value: y, label: y }))]} />
            <OFilterSelect label="Topic" value={topicFilter} onChange={setTopicFilter} accent="#0E4633"
              options={[{ value: "All" as const, label: "All Topics" }, ...MC_TOPICS.map(t => ({ value: t, label: t }))]} />
            <OFilterSelect label="Gender" value={genderView} onChange={setGenderView} accent="#0E4633"
              options={[{ value: "All" as const, label: "All Genders" }, { value: "Female" as const, label: "Female" }, { value: "Male" as const, label: "Male" }]} />
          </OutreachFilters>
        </div>

        {/* SECTION 1: RATINGS */}
        {show(1) && (
        <section>
          <SectionHeader title="Venture Ratings of Masterclasses"
            sub={`${filtered.length} sessions rated across Quality, Usefulness, Accessibility, Relevance`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High  ·  High  ·  Moderate  ·  Low  -  proportion of sessions per rating level">
              <div className="flex gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
                {(["Very High", "High", "Moderate", "Low"] as const).map(l => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RATING_COLORS[l] }} />{l}
                  </span>
                ))}
              </div>
              {RATING_CRITERIA.map(c => <RatingBar key={c} label={c} sessions={filtered} criterion={c} />)}
            </ChartCard>

            <ChartCard title="Ratings by Gender of Attendees"
              sub="Avg score per criterion  -  female-majority vs male-majority sessions"
              accent={VIOLET_MC}>
              <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: VIOLET_MC }}>F</span> Female-majority sessions</span>
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: SKY }}>M</span> Male-majority sessions</span>
              </div>
              {RATING_CRITERIA.map(c => (
                <GenderRatingBar key={c} label={c} fSessions={fSessions} mSessions={mSessions} criterion={c} />
              ))}
              <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                {(["Expose", "Build", "Scale"] as const).map((stage, si) => {
                  const ss = filtered.filter(m =>
                    stage === "Expose" ? m.byStage.Expose > m.byStage.Build + m.byStage.Scale
                    : stage === "Build" ? m.byStage.Build >= m.byStage.Scale
                    : m.byStage.Scale > m.byStage.Build
                  );
                  const avg = ss.length
                    ? RATING_CRITERIA.reduce((s, c) => s + ss.reduce((ss2, m) => ss2 + m.scores[c], 0) / ss.length, 0) / RATING_CRITERIA.length
                    : 0;
                  return (
                    <div key={stage}>
                      <p className="text-[10px] text-gray-400">{stage} Stage</p>
                      <p className="text-sm font-bold" style={{ color: [SKY, ACCENT, VIOLET_MC][si] }}>{avg.toFixed(1)}</p>
                      <p className="text-[9px] text-gray-400">avg score</p>
                    </div>
                  );
                })}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants"  value={tot.female}              pct={femalePct}      total={tot.attendees} color={VIOLET_MC}  />
            <ProfileCard label="Male Participants"    value={tot.attendees - tot.female} pct={100 - femalePct} total={tot.attendees} color={ACCENT}  />
            <ProfileCard label="Student Participants" value={tot.students}            pct={studentPct}     total={tot.attendees} color={EMERALD_MC} />
            <ProfileCard label="Alumni Participants"  value={alumniTot}               pct={100 - studentPct} total={tot.attendees} color={AMBER_MC} />
          </div>
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
              <div className="space-y-3 mt-2">
                {socialData.map((d, i) => {
                  const col = SOCIAL_COLORS[i % SOCIAL_COLORS.length];
                  return (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{d.name}</span>
                        <span className="font-medium" style={{ color: col }}>{d.value}</span>
                      </div>
                      <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: col + "1A" }}>
                        <div className="h-full"
                          style={{ width: `${tot.attendees > 0 ? (d.value / tot.attendees) * 100 : 0}%`, backgroundColor: col }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {tot.attendees > 0 ? Math.round((d.value / tot.attendees) * 100) : 0}% of attendees
                      </p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>
        )}

        {/* SECTION 3: ATTENDANCE TRENDS */}
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
                    axisLine={false} tickLine={false} />
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
              <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: VIOLET_MC }} />Female
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: SKY }} />Male
                </span>
              </div>
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

        {/* SECTION 4+6: GROWTH + COMPLETION  -  same row */}
        {show(4) && (
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
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={completionData} barCategoryGap="30%">
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

        {/* SECTION 5: TOP PERFORMING + MOST ENGAGED */}
        {show(5) && (
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
        <PortalFooter portal="hent" source="HENT Masterclasses M&amp;E" synced="28 May 2026, EAT" />

      </div>
    </div>
  );
}
