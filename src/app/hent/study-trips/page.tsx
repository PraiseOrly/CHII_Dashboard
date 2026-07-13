"use client";
import { benchColor } from "@/theme/tokens";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Star, MapPin, Users, Handshake, Zap, Briefcase } from "lucide-react";
import PortalNav from "@/components/layout/portal-nav";
import { ChartTip, ChartLegend, useCountUp } from "@/components/ui";
import { CHART } from "@/theme/tokens";
import PortalFooter from "@/components/layout/portal-footer";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import { DonutRing } from "@/components/charts/donut-chart";
import {
  studyTrips, TRIP_TYPES, TRIP_CRITERIA, TRIP_REGIONS,
  type TripType, type TripRegion,
} from "@/data/study-trips";

// â”€â”€â”€ palette (green family, distinct by hue) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY    = "#0F4C3A"; // footer bg only (brand green)
const ACCENT  = "#A6C13C"; // page identity — study trips = lime
const SKY     = "#1F9E9E"; // teal
const VIOLET  = "#6B8E5B"; // moss
const TEAL    = "#2D8A8A"; // deep teal
const EMERALD = "#40916C"; // sea green
const INDIGO  = "#2D6A4F"; // forest
const AMBER   = "#A6C13C"; // lime
const ROSE    = "#94A93B"; // olive
const PRIMARY = "#2D8A8A"; // deep teal

const BAR_COLORS = ["#1B4332", "#1F9E9E", "#A6C13C", "#6B8E5B", "#40916C"];

const RATING_COLORS: Record<string, string> = {
  "Very High": "#1B4332", High: "#40916C", Moderate: "#A6C13C", Low: "#C44536",
};
const RANK_BG = ["#C9A227", "#9CA3AF", "#CD7F32"];

function ratingLabel(s: number): string {
  return s >= 4.5 ? "Very High" : s >= 3.8 ? "High" : s >= 3.0 ? "Moderate" : "Low";
}

// â”€â”€â”€ shared components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: "#2D6A4F" }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "#2D6A4F" }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = ACCENT, children }: {
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
    <div ref={cardRef} onContextMenu={(e) => { e.preventDefault(); handleDownload(); }} title="Right-click to download this chart" className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#2D6A4F", padding: "12px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.8)" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
            {sub && <InfoDot tip={sub} color="#FFFFFF" />}
          </div>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</p>}
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
    <div className="rounded-[10px]" style={{ backgroundColor: "#ffffff", border: "1px solid #2D6A4F", padding: "14px 16px" }}>
      <p className="tabular-nums" style={{ fontSize: 30, fontWeight: 800, color: "#2D6A4F", lineHeight: 1.05 }}>{pct}%</p>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 4 }}>{label}</p>
      <p className="tabular-nums" style={{ fontSize: 9, fontWeight: 500, color: "#9CA3AF", marginTop: 2 }}>{value.toLocaleString()} / {tot.toLocaleString()}</p>
      <div className="rounded-sm mt-3 overflow-hidden" style={{ height: 6, backgroundColor: color + "20" }}>
        <div className="h-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RatingBar({ label, visits, criterion }: {
  label: string; visits: typeof studyTrips; criterion: typeof TRIP_CRITERIA[number];
}) {
  const [hovered, setHovered] = useState<{ label: string; count: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const vh  = visits.filter(v => v.scores[criterion] >= 4.5).length;
  const hi  = visits.filter(v => v.scores[criterion] >= 3.8 && v.scores[criterion] < 4.5).length;
  const mo  = visits.filter(v => v.scores[criterion] >= 3.0 && v.scores[criterion] < 3.8).length;
  const lo  = visits.filter(v => v.scores[criterion] < 3.0).length;
  const tot = visits.length || 1;
  const avg = visits.length
    ? (visits.reduce((s, v) => s + v.scores[criterion], 0) / visits.length).toFixed(1) : " - ";
  const segs = [
    { key: "Very High", count: vh, color: RATING_COLORS["Very High"] },
    { key: "High",      count: hi, color: RATING_COLORS.High },
    { key: "Moderate",  count: mo, color: RATING_COLORS.Moderate },
    { key: "Low",       count: lo, color: RATING_COLORS.Low },
  ];
  return (
    <div className="relative flex items-center gap-3 mb-2.5 last:mb-0"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <div className="w-44 text-[10px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-4 bg-gray-100 rounded-sm overflow-hidden flex">
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

function GenderRatingBar({ label, fVisits, mVisits, criterion }: {
  label: string; fVisits: typeof studyTrips; mVisits: typeof studyTrips;
  criterion: typeof TRIP_CRITERIA[number];
}) {
  const fAvg = fVisits.length ? fVisits.reduce((s, v) => s + v.scores[criterion], 0) / fVisits.length : 0;
  const mAvg = mVisits.length ? mVisits.reduce((s, v) => s + v.scores[criterion], 0) / mVisits.length : 0;
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-40 text-[10px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] w-5 font-bold flex-shrink-0" style={{ color: VIOLET }}>F</span>
          <div className="flex-1 h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: VIOLET + "20" }}>
            <div className="h-full rounded-sm" style={{ width: `${(fAvg / 5) * 100}%`, backgroundColor: VIOLET }} />
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

function InfoDot({ tip, color = "#2D6A4F" }: { tip: string; color?: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: `${color}22`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color, lineHeight: 1, userSelect: "none" }}>i</span>
      {show && (
        <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", color: "#111827", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 190, boxShadow: "0 6px 20px rgba(0,0,0,0.22)", zIndex: 100, textAlign: "left", pointerEvents: "none", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{tip}</span>
      )}
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

// â”€â”€â”€ KPI tile map (7 metrics) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const KPI_TILES = [
  { label: "Total Study Trips",      clr: "#065F46" },  // emerald   -  page identity
  { label: "Total Participants",      clr: "#1E3A8A" },  // deep blue
  { label: "Ventures Participating",  clr: "#6D28D9" },  // violet
  { label: "Organisations Visited",   clr: "#0E7490" },  // cyan
  { label: "Avg Attendance / Visit",  clr: "#C2410C" },  // orange
  { label: "Avg Completion Rate",     clr: "#3730A3" },  // indigo
] as const;

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

// â”€â”€â”€ page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function FieldVisitsPage() {
  const [yearFilter,   setYearFilter]   = useState<"All"|"2022"|"2023"|"2024"|"2025"|"2026">("All");
  const [typeFilter,   setTypeFilter]   = useState<"All"|TripType>("All");
  const [regionFilter, setRegionFilter] = useState<"All"|TripRegion>("All");
  const [genderView,   setGenderView]   = useState<"All"|"Female"|"Male">("All");
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
  const filtersActive = (yearFilter !== "All" ? 1 : 0) + (typeFilter !== "All" ? 1 : 0) + (regionFilter !== "All" ? 1 : 0) + (genderView !== "All" ? 1 : 0);

  const filtered = useMemo(() => studyTrips.filter(v => {
    if (yearFilter   !== "All" && v.year   !== Number(yearFilter)) return false;
    if (typeFilter   !== "All" && v.type   !== typeFilter)         return false;
    if (regionFilter !== "All" && v.region !== regionFilter)       return false;
    if (genderView === "Female" && v.femaleParticipants <= v.participants / 2) return false;
    if (genderView === "Male"   && v.femaleParticipants >  v.participants / 2) return false;
    return true;
  }), [yearFilter, typeFilter, regionFilter, genderView]);

  const tot = {
    visits:       filtered.length,
    participants: filtered.reduce((s, v) => s + v.participants,        0),
    female:       filtered.reduce((s, v) => s + v.femaleParticipants,  0),
    students:     filtered.reduce((s, v) => s + v.studentParticipants, 0),
    ventures:     filtered.reduce((s, v) => s + v.venturesRepresented, 0),
    orgs:         Array.from(new Set(filtered.map(v => v.organization))).length,
    partnerships: filtered.reduce((s, v) => s + v.partnerships,        0),
    completion:   filtered.length
      ? Math.round(filtered.reduce((s, v) => s + v.completionRate, 0) / filtered.length) : 0,
  };
  const avgAtt      = filtered.length ? Math.round(tot.participants / filtered.length) : 0;
  const femalePct   = tot.participants ? Math.round((tot.female   / tot.participants) * 100) : 0;
  const studentPct  = tot.participants ? Math.round((tot.students / tot.participants) * 100) : 0;
  const alumniTotal = tot.participants - tot.students;

  const fVisits = filtered.filter(v => v.femaleParticipants >  v.participants / 2);
  const mVisits = filtered.filter(v => v.femaleParticipants <= v.participants / 2);

  const byAge    = { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 };
  const byStage  = { Expose: 0, Build: 0, Scale: 0 };
  const bySocial = { "MCF Scholars": 0, PWD: 0, "Refugee-Displaced": 0 };
  filtered.forEach(v => {
    (Object.keys(v.byAge)    as (keyof typeof byAge)[]).forEach(k    => { byAge[k]    += v.byAge[k]; });
    (Object.keys(v.byStage)  as (keyof typeof byStage)[]).forEach(k  => { byStage[k]  += v.byStage[k]; });
    (Object.keys(v.bySocial) as (keyof typeof bySocial)[]).forEach(k => { bySocial[k] += v.bySocial[k]; });
  });
  const ageData    = Object.entries(byAge).map(([name, value]) => ({ name, value }));
  const stageData  = Object.entries(byStage).map(([name, value]) => ({ name, value }));
  const socialData = Object.entries(bySocial).map(([name, value]) => ({ name, value }));
  const SOCIAL_COLORS = [ACCENT, EMERALD, AMBER];

  const regionCounts: Record<string, { visits: number; participants: number }> = {};
  filtered.forEach(v => {
    if (!regionCounts[v.region]) regionCounts[v.region] = { visits: 0, participants: 0 };
    regionCounts[v.region].visits++;
    regionCounts[v.region].participants += v.participants;
  });
  const REGION_COLORS = [TEAL, EMERALD, SKY, ACCENT];

  const countryCounts: Record<string, number> = {};
  filtered.forEach(v => { countryCounts[v.country] = (countryCounts[v.country] || 0) + 1; });
  const countryData = Object.entries(countryCounts)
    .map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const typeCount: Record<string, number> = {};
  filtered.forEach(v => { typeCount[v.type] = (typeCount[v.type] || 0) + 1; });
  const typeData = Object.entries(typeCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const TYPE_COLORS = [SKY, EMERALD, VIOLET, AMBER, ROSE, TEAL, PRIMARY];

  const attendanceTrend = [...filtered].sort((a, b) => a.date.localeCompare(b.date))
    .map(v => ({ Visit: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][v.month - 1]} '${String(v.year).slice(2)}`, Participants: v.participants }));

  let cum = 0;
  const growthData = [...filtered].sort((a, b) => a.date.localeCompare(b.date))
    .map(v => { cum += v.participants; return { Period: `${v.year}-${String(v.month).padStart(2, "0")}`, "Cumulative Participants": cum }; });

  const YEARS = [2022, 2023, 2024, 2025, 2026];
  const genderTrend = YEARS.map(yr => {
    const yv = filtered.filter(v => v.year === yr);
    return {
      Year: String(yr),
      Female: yv.reduce((s, v) => s + v.femaleParticipants, 0),
      Male:   yv.reduce((s, v) => s + (v.participants - v.femaleParticipants), 0),
    };
  });

  const topVisits = [...filtered]
    .map(v => ({ ...v, avgScore: TRIP_CRITERIA.reduce((s, c) => s + v.scores[c], 0) / TRIP_CRITERIA.length }))
    .sort((a, b) => b.avgScore - a.avgScore).slice(0, 3);

  const orgFreq: Record<string, { type: string; count: number; participants: number; avgScore: number; location: string }> = {};
  filtered.forEach(v => {
    const base = v.organization.replace(/  -  .*/, "");
    if (!orgFreq[base]) orgFreq[base] = { type: v.type, count: 0, participants: 0, avgScore: 0, location: `${v.city}, ${v.country}` };
    orgFreq[base].count++;
    orgFreq[base].participants += v.participants;
    orgFreq[base].avgScore += TRIP_CRITERIA.reduce((s, c) => s + v.scores[c], 0) / TRIP_CRITERIA.length;
  });
  const frequentOrgs = Object.entries(orgFreq)
    .map(([name, d]) => ({ name, ...d, avgScore: d.avgScore / d.count }))
    .sort((a, b) => b.count - a.count || b.participants - a.participants).slice(0, 3);

  const partnershipsTrend = YEARS.map(yr => ({
    Year: String(yr),
    Partnerships: filtered.filter(v => v.year === yr).reduce((s, v) => s + v.partnerships, 0),
  }));

  const BASE = "?auto=format&fit=crop&w=600&h=360&q=80";
  const FV_IMAGES: Record<string, string> = {
    FV01: `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d${BASE}`,  // hospital corridor / clinical staff
    FV02: `https://images.unsplash.com/photo-1551076805-e1869033e919${BASE}`,      // medical device / health tech
    FV03: `https://images.unsplash.com/photo-1524758631624-e2822132a628${BASE}`,   // modern innovation workspace
    FV04: `https://images.unsplash.com/photo-1559757148-5c350d0d3c56${BASE}`,      // hospital exterior / facility
    FV05: `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae${BASE}`,   // pharmacy / medicine dispensing
    FV06: `https://images.unsplash.com/photo-1583947215259-5d1d7b14df19${BASE}`,   // medical team / institutional
    FV07: `https://images.unsplash.com/photo-1579684385127-1571b5f1cc84${BASE}`,   // doctor consultation / private hospital
    FV08: `https://images.unsplash.com/photo-1532187863486-abf9dbad1b69${BASE}`,   // research lab / NGO health
    FV09: `https://images.unsplash.com/photo-1516549655669-df28c2a37e48${BASE}`,   // digital health / data lab
    FV10: `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d${BASE}`,   // EHR / health startup
    FV11: `https://images.unsplash.com/photo-1538108149393-dbada5a3f2ba${BASE}`,   // public health / government lab
    FV12: `https://images.unsplash.com/photo-1532187863486-abf9dbad1b69${BASE}`,   // Africa health research lab
    FV13: `https://images.unsplash.com/photo-1551076805-e1869033e919${BASE}`,      // health startup / delivery tech
    FV14: `https://images.unsplash.com/photo-1516549655669-df28c2a37e48${BASE}`,   // iHub / health innovation hub
    FV15: `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae${BASE}`,   // pharmaceutical / access to medicine
    FV16: `https://images.unsplash.com/photo-1559757148-5c350d0d3c56${BASE}`,      // innovation city / modern facility
  };

  const kpiValues = [
    { sub: "Excursions conducted",   num: tot.visits,        fmt: (n: number) => String(Math.round(n)) },
    { sub: "Across all visits",      num: tot.participants,   fmt: (n: number) => Math.round(n).toLocaleString() },
    { sub: "Unique ventures",        num: tot.ventures,       fmt: (n: number) => Math.round(n).toLocaleString() },
    { sub: "Distinct host sites",    num: tot.orgs,           fmt: (n: number) => String(Math.round(n)) },
    { sub: "Per excursion",          num: avgAtt,             fmt: (n: number) => String(Math.round(n)) },
    { sub: "Participants completing", num: tot.completion,    fmt: (n: number) => `${Math.round(n)}%` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
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
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Study Trips</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Industry excursions, participation and learning experience</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span>{studyTrips.length} visits tracked</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ MAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {KPI_TILES.map(({ label, clr }, i) => (
            <KpiTile key={label} label={label} num={kpiValues[i].num}
              displayFmt={kpiValues[i].fmt} sub={kpiValues[i].sub} clr={clr}
              pct={label === "Avg Completion Rate" ? tot.completion : undefined}
              bench={label === "Avg Completion Rate" ? 85 : undefined} />
          ))}
        </div>


        {/* RATINGS */}
        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent="#0E4633"
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Ratings", value: "1" }, { label: "Demographics", value: "2" },
              { label: "Geography", value: "3" }, { label: "Attendance", value: "4" },
              { label: "Impactful Visits", value: "5" }, { label: "Partnerships", value: "6" },
              { label: "Highlights", value: "7" }, { label: "Growth", value: "8" },
            ]}
          />

          <OutreachFilters
            accent="#0E4633"
            activeCount={filtersActive}
            onReset={() => { setYearFilter("All"); setTypeFilter("All"); setRegionFilter("All"); setGenderView("All"); }}
          >
            <OFilterSelect label="Year" value={yearFilter} onChange={setYearFilter} accent="#0E4633"
              options={[{ value: "All" as const, label: "All Years" }, ...(["2022","2023","2024","2025","2026"] as const).map(y => ({ value: y, label: y }))]} />
            <OFilterSelect label="Type" value={typeFilter} onChange={setTypeFilter} accent="#0E4633"
              options={[{ value: "All" as const, label: "All Types" }, ...TRIP_TYPES.map(t => ({ value: t, label: t }))]} />
            <OFilterSelect label="Region" value={regionFilter} onChange={setRegionFilter} accent="#0E4633"
              options={[{ value: "All" as const, label: "All Regions" }, ...TRIP_REGIONS.map(r => ({ value: r, label: r }))]} />
            <OFilterSelect label="Gender" value={genderView} onChange={setGenderView} accent="#0E4633"
              options={[{ value: "All" as const, label: "All Genders" }, { value: "Female" as const, label: "Female-majority" }, { value: "Male" as const, label: "Male-majority" }]} />
          </OutreachFilters>
        </div>

        <section style={{ display: show(1) ? undefined : "none" }}>
          <SecHeader title="Participant Ratings & Feedback"
            sub={`${filtered.length} visits rated across six experience dimensions`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High  ·  High  ·  Moderate  ·  Low  -  proportion of visits per level"
              accent={TEAL}>
              <div className="flex gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
                {(["Very High","High","Moderate","Low"] as const).map(l => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RATING_COLORS[l] }} />{l}
                  </span>
                ))}
              </div>
              {TRIP_CRITERIA.map(c => <RatingBar key={c} label={c} visits={filtered} criterion={c} />)}
            </ChartCard>

            <ChartCard title="Ratings by Gender of Participants"
              sub="Average score per dimension  -  female vs male majority visits"
              accent={VIOLET}>
              <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: VIOLET }}>F</span> Female-majority visits</span>
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: SKY }}>M</span> Male-majority visits</span>
              </div>
              {TRIP_CRITERIA.map(c => (
                <GenderRatingBar key={c} label={c} fVisits={fVisits} mVisits={mVisits} criterion={c} />
              ))}
              <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                {(["Expose","Build","Scale"] as const).map((stage, si) => {
                  const sv = filtered.filter(v =>
                    stage === "Expose" ? v.byStage.Expose > v.byStage.Build + v.byStage.Scale
                    : stage === "Build" ? v.byStage.Build >= v.byStage.Scale
                    : v.byStage.Scale > v.byStage.Build
                  );
                  const avg = sv.length
                    ? TRIP_CRITERIA.reduce((s, c) => s + sv.reduce((ss, v) => ss + v.scores[c], 0) / sv.length, 0) / TRIP_CRITERIA.length : 0;
                  return (
                    <div key={stage}>
                      <p className="text-[10px] text-gray-400">{stage}</p>
                      <p className="text-sm font-bold" style={{ color: [SKY, PRIMARY, INDIGO][si] }}>{avg.toFixed(1)}</p>
                      <p className="text-[9px] text-gray-400">avg score</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* DEMOGRAPHICS */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SecHeader title="Participant Demographics"
            sub="Breakdown by gender, age, venture stage, and social inclusion" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants"  value={tot.female}                  pct={femalePct}        total={tot.participants} color={VIOLET}  />
            <ProfileCard label="Male Participants"    value={tot.participants - tot.female} pct={100 - femalePct} total={tot.participants} color={SKY}     />
            <ProfileCard label="Student Participants" value={tot.students}                pct={studentPct}       total={tot.participants} color={EMERALD} />
            <ProfileCard label="Alumni Participants"  value={alumniTotal}                 pct={100 - studentPct} total={tot.participants} color={AMBER}   />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ChartCard title="Age Group Distribution" sub="Participants by age bracket" accent={SKY}>
              <CustomDonut data={ageData} colors={[SKY, PRIMARY, VIOLET, ROSE]} className="h-36" valueFormatter={(v) => `${v}`} />
              <div className="mt-2 space-y-0.5">
                {ageData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: [SKY, PRIMARY, VIOLET, ROSE][i] }} />{d.name}
                    </span>
                    <span className="font-medium" style={{ color: [SKY, PRIMARY, VIOLET, ROSE][i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Visit Type Breakdown" sub="Excursions by sector category" accent={TEAL}>
              <CustomDonut data={typeData} colors={TYPE_COLORS} className="h-36" valueFormatter={(v) => `${v}`} />
              <div className="mt-2 space-y-0.5">
                {typeData.slice(0, 4).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-gray-500 truncate min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[i] }} />
                      <span className="truncate">{d.name}</span>
                    </span>
                    <span className="font-medium ml-1 flex-shrink-0" style={{ color: TYPE_COLORS[i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Venture Stage" sub="Attendees by development stage" accent={INDIGO}>
              <CustomDonut data={stageData} colors={[SKY, PRIMARY, INDIGO]} className="h-36" valueFormatter={(v) => `${v}`} />
              <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-gray-100 text-center">
                {stageData.map((d, i) => (
                  <div key={d.name}>
                    <p className="text-sm font-black" style={{ color: [SKY, PRIMARY, INDIGO][i] }}>{d.value}</p>
                    <p className="text-[9px] text-gray-400">{d.name}</p>
                  </div>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Social Inclusion Groups" sub="MCF scholars, PWD, refugee-displaced" accent={AMBER}>
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
                          style={{ width: `${tot.participants > 0 ? (d.value / tot.participants) * 100 : 0}%`, backgroundColor: col }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {tot.participants > 0 ? Math.round((d.value / tot.participants) * 100) : 0}% of participants
                      </p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* GEOGRAPHIC */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SecHeader title="Geographic Reach & Location Insights"
            sub="Countries and regions covered across all field excursions" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Visits by Country" sub="Number of excursions conducted per country" accent={SKY}>
              <ColorBarList data={countryData} colors={BAR_COLORS} />
            </ChartCard>
            <ChartCard title="Regional Distribution" sub="Visit count and participant reach by African region" accent={EMERALD}>
              <div className="space-y-4">
                {Object.entries(regionCounts).sort((a, b) => b[1].visits - a[1].visits).map(([region, data], ri) => {
                  const pct = filtered.length > 0 ? Math.round((data.visits / filtered.length) * 100) : 0;
                  const col = REGION_COLORS[ri % REGION_COLORS.length];
                  return (
                    <div key={region}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">{region}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <span className="text-sm font-bold" style={{ color: col }}>{data.visits} visit{data.visits !== 1 ? "s" : ""}</span>
                          <span className="text-xs text-gray-400 ml-2"> ·  {data.participants} participants</span>
                        </div>
                      </div>
                      <div className="h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: col + "1A" }}>
                        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: col }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{pct}% of all visits</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ATTENDANCE TRENDS */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SecHeader title="Attendance & Participation Trends"
            sub="Visit-level attendance and yearly gender breakdown" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Participants per Study Trip"
              sub="Attendance count for each excursion in chronological order"
              accent={SKY}>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={attendanceTrend.slice(0, 12)} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Visit" tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Participants" fill={SKY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Participants", SKY]]} />
            </ChartCard>
            <ChartCard title="Participation by Gender per Year"
              sub="Female vs male participants across all visits per year"
              accent={VIOLET}>
              <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: VIOLET }}/>Female</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: SKY }}/>Male</span>
              </div>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={genderTrend} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Female" fill={VIOLET} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Male"   fill={SKY}    radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Female", VIOLET], ["Male", SKY]]} />
            </ChartCard>
          </div>
        </section>


        {/* MOST IMPACTFUL + FREQUENTLY VISITED */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SecHeader title="Most Impactful Visits & Frequently Visited Organisations"
            sub="Ranked by participant feedback scores and repeat-visit frequency" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Most Impactful Study Trips"
              sub="Ranked by average participant feedback across all six dimensions"
              accent={AMBER}>
              <div className="space-y-3">
                {topVisits.map((v, i) => (
                  <div key={v.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? ACCENT }}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{v.organization}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <Stars score={v.avgScore} />
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin size={9}/>{v.city}, {v.country}
                        </span>
                        <span className="text-[10px] text-gray-400">{v.participants} participants</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 italic leading-tight">{v.highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Frequently Visited Organisations"
              sub="Host sites visited most often across cohort years"
              accent={TEAL}>
              <div className="space-y-3">
                {frequentOrgs.map((org, i) => (
                  <div key={org.name} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? ACCENT }}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{org.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: TEAL + "15", color: TEAL }}>{org.type}</span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin size={9}/>{org.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: TEAL }}>{org.count}x</p>
                      <p className="text-[10px] text-gray-400">{org.participants} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* PARTNERSHIPS */}
        <section style={{ display: show(6) ? undefined : "none" }}>
          <SecHeader title="Partnerships & Collaborations Established"
            sub={`${tot.partnerships} new partnerships forged through field excursions`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Partnerships Established per Year"
              sub="New organisational relationships formed through visit engagement"
              accent={EMERALD}>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={partnershipsTrend} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Partnerships" fill={EMERALD} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Partnerships", EMERALD]]} />
            </ChartCard>
            <ChartCard title="Partnership Outcomes by Visit"
              sub="Visits with highest collaboration results"
              accent={TEAL}>
              <div className="space-y-2.5">
                {[...filtered].sort((a, b) => b.partnerships - a.partnerships).slice(0, 8).map(v => (
                  <div key={v.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Handshake size={12} style={{ color: EMERALD }} />
                      <span className="text-sm font-bold tabular-nums w-4" style={{ color: EMERALD }}>{v.partnerships}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gray-800 truncate">{v.organization}</p>
                      <p className="text-[10px] text-gray-400">{v.city}  ·  {v.year}</p>
                    </div>
                    <div className="w-20 flex-shrink-0">
                      <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: EMERALD + "20" }}>
                        <div className="h-full" style={{ width: `${(v.partnerships / 8) * 100}%`, backgroundColor: EMERALD }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* MEDIA HIGHLIGHTS */}
        <section style={{ display: show(7) ? undefined : "none" }}>
          <SecHeader title="Visit Highlights & Field Notes"
            sub="Key takeaways and learning moments from recent excursions" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map((v) => {
              return (
                <div key={v.id} className="bg-white rounded shadow-sm overflow-hidden">
                  <div className="h-44 overflow-hidden">
                    <img
                      src={FV_IMAGES[v.id] ?? `https://picsum.photos/seed/${v.id}/600/360`}
                      alt={v.organization}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: TEAL + "15", color: TEAL }}>{v.type}</span>
                      <span className="text-[10px] text-gray-400">{v.year}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{v.organization}</p>
                    <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                      <MapPin size={9}/>{v.city}, {v.country}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{v.highlight}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-500">
                        <Users size={9} className="inline mr-1"/>{v.participants} participants
                      </span>
                      <Stars score={TRIP_CRITERIA.reduce((s, c) => s + v.scores[c], 0) / TRIP_CRITERIA.length} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GROWTH + COMPLETION ANALYTICS */}
        <section style={{ display: show(8) ? undefined : "none" }}>
          <SecHeader title="Participation Growth & Completion Analytics"
            sub="Cumulative reach over time and completion rates across all study trips" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Cumulative Participant Reach"
            sub="Running total across all visits  -  shows programme exposure growth"
            accent={EMERALD}>
            <ResponsiveContainer width="100%" height={208}>
              <LineChart data={growthData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="Period" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                <Line type="monotone" dataKey="Cumulative Participants" stroke={EMERALD} strokeWidth={2.5} dot={{ r: 4, fill: EMERALD, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
              <ChartLegend items={[["Cumulative participants", EMERALD]]} />
          </ChartCard>
          <ChartCard title="Completion Rate by Study Trip"
            sub="Percentage of registered participants completing each excursion"
            accent={EMERALD}>
            <ResponsiveContainer width="100%" height={208}>
              <BarChart
                data={[...filtered].sort((a, b) => a.date.localeCompare(b.date)).map(v => ({
                  Visit: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][v.month - 1]} '${String(v.year).slice(2)}`,
                  "Completion %": v.completionRate,
                }))}
                barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="Visit" tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                <Bar dataKey="Completion %" fill={EMERALD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-center">
              {[
                { value: `${tot.completion}%`,                                           color: INDIGO,   label: "Avg completion"       },
                { value: String(filtered.filter(v => v.completionRate >= 95).length),    color: EMERALD,  label: "Visits ≥95%"          },
                { value: String(filtered.filter(v => v.completionRate < 90).length),     color: AMBER,    label: "Visits <90%"          },
                { value: String(tot.partnerships),                                        color: TEAL,     label: "Partnerships formed"   },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </ChartCard>
          </div>
        </section>

        {/* FOOTER */}
        <PortalFooter portal="hent" source="HENT Study Trips M&amp;E" synced="28 May 2026, EAT" />

      </div>
    </div>
  );
}
