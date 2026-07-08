"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Star, MapPin, Users, Handshake, Zap, Briefcase, SlidersHorizontal, X } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  fieldVisits, VISIT_TYPES, FV_CRITERIA, FV_REGIONS,
  type VisitType, type FVRegion,
} from "@/data/fieldVisits";

// â”€â”€â”€ palette (green family, distinct by hue) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY    = "#0F4C3A"; // footer bg only (brand green)
const ACCENT  = "#A6C13C"; // page identity — field visits = lime
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
    <div className="flex items-center gap-2.5 mb-4">
      <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#A6C13C" }} />
      <div>
        <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: "#111827", letterSpacing: "0.01em" }}>{title}</h2>
        {sub && <p className="mt-0.5" style={{ fontSize: 11, color: "#6B7280" }}>{sub}</p>}
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
    <div ref={cardRef} className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#FFFFFF", padding: "12px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#A6C13C" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold uppercase leading-none" style={{ letterSpacing: "0.04em", color: "#111827" }}>{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "#5F5E5A" }}>{sub}</p>}
        </div>
        <button onClick={handleDownload} title="Download chart"
          style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#111827"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}>
          <Download size={12} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ProfileCard({ label, value, pct, total: tot, color }: {
  label: string; value: number; pct: number; total: number; color: string;
}) {
  return (
    <div className="rounded border p-5 shadow-sm" style={{ backgroundColor: color + "0D", borderColor: color + "35" }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none" style={{ color: color + "AA" }}>{label}</p>
      <div className="flex items-baseline gap-0.5 mt-3">
        <p className="text-[2.25rem] font-black tabular-nums leading-none" style={{ color }}>{pct}</p>
        <p className="text-lg font-bold mb-0.5" style={{ color }}>%</p>
      </div>
      <p className="text-[11px] text-gray-400 mt-2 tabular-nums">{value.toLocaleString()} / {tot.toLocaleString()}</p>
      <div className="h-1.5 rounded-sm mt-3 overflow-hidden" style={{ backgroundColor: color + "20" }}>
        <div className="h-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RatingBar({ label, visits, criterion }: {
  label: string; visits: typeof fieldVisits; criterion: typeof FV_CRITERIA[number];
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
  label: string; fVisits: typeof fieldVisits; mVisits: typeof fieldVisits;
  criterion: typeof FV_CRITERIA[number];
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

// â”€â”€â”€ Count-up animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// Red → amber → green based on progress against benchmark
function benchColor(pct: number, bench: number): string {
  const r = bench > 0 ? pct / bench : 1;
  if (r >= 1)    return "#16A34A";
  if (r >= 0.95) return "#84CC16";
  if (r >= 0.8)  return "#F59E0B";
  return "#DC2626";
}

function KpiTile({ label, num, displayFmt, sub, clr, pct, bench }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string; pct?: number; bench?: number;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(14,70,51,0.12)", borderLeft: "5px solid #0E4633" }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(14,70,51,0.55)", marginBottom: 8 }}>{label}</p>
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
  { label: "Total Field Visits",      clr: "#065F46" },  // emerald   -  page identity
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
  const [typeFilter,   setTypeFilter]   = useState<"All"|VisitType>("All");
  const [regionFilter, setRegionFilter] = useState<"All"|FVRegion>("All");
  const [genderView,   setGenderView]   = useState<"All"|"Female"|"Male">("All");
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersActive = (yearFilter !== "All" ? 1 : 0) + (typeFilter !== "All" ? 1 : 0) + (regionFilter !== "All" ? 1 : 0) + (genderView !== "All" ? 1 : 0);

  const filtered = useMemo(() => fieldVisits.filter(v => {
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
    .map(v => ({ ...v, avgScore: FV_CRITERIA.reduce((s, c) => s + v.scores[c], 0) / FV_CRITERIA.length }))
    .sort((a, b) => b.avgScore - a.avgScore).slice(0, 3);

  const orgFreq: Record<string, { type: string; count: number; participants: number; avgScore: number; location: string }> = {};
  filtered.forEach(v => {
    const base = v.organization.replace(/  -  .*/, "");
    if (!orgFreq[base]) orgFreq[base] = { type: v.type, count: 0, participants: 0, avgScore: 0, location: `${v.city}, ${v.country}` };
    orgFreq[base].count++;
    orgFreq[base].participants += v.participants;
    orgFreq[base].avgScore += FV_CRITERIA.reduce((s, c) => s + v.scores[c], 0) / FV_CRITERIA.length;
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

  const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <HENTNav />

      {/* â”€â”€ HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#0E4633", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #0E4633 34%, #0E4633 66%, rgba(14,70,51,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Field Visits</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Industry excursions · 2022–2026 · {fieldVisits.length} visits tracked</p>
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
        {/* Section pills (left) + Filters dropdown (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[{ n: 0, label: "All Sections" }, { n: 1, label: "Ratings" }, { n: 2, label: "Demographics" }, { n: 3, label: "Geography" }, { n: 4, label: "Attendance" }, { n: 5, label: "Impactful Visits" }, { n: 6, label: "Partnerships" }, { n: 7, label: "Highlights" }, { n: 8, label: "Growth" }].map(({ n, label }) => {
              const on = n === 0 ? activeSection === "all" : activeSection === n;
              return (
                <button key={n} onClick={() => setActiveSection(n === 0 ? "all" : n)}
                  style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer", border: `1px solid ${on ? "#0E4633" : "rgba(14,70,51,0.18)"}`, backgroundColor: on ? "#0E4633" : "white", color: on ? "white" : "#6B7280" }}>
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => setFiltersOpen(o => !o)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer", border: `1px solid ${filtersActive || filtersOpen ? "#0E4633" : "rgba(14,70,51,0.18)"}`, backgroundColor: filtersOpen ? "#0E4633" : "white", color: filtersOpen ? "white" : "#374151" }}>
              <SlidersHorizontal size={13} />
              Filters
              {filtersActive > 0 && (
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: filtersOpen ? "rgba(255,255,255,0.25)" : "#0E4633", borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{filtersActive}</span>
              )}
            </button>
            {filtersOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50, width: 320, backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(14,70,51,0.14)", boxShadow: "0 10px 30px rgba(0,0,0,0.14)", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#0E4633", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filters</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {filtersActive > 0 && (
                      <button onClick={() => { setYearFilter("All"); setTypeFilter("All"); setRegionFilter("All"); setGenderView("All"); }} style={{ fontSize: 10, fontWeight: 600, color: "white", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, padding: "3px 8px", backgroundColor: "rgba(255,255,255,0.08)", cursor: "pointer" }}>Reset</button>
                    )}
                    <button onClick={() => setFiltersOpen(false)} title="Close" style={{ color: "white", display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}><X size={13} /></button>
                  </div>
                </div>
                <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <FilterSelect label="Year" value={yearFilter} onChange={setYearFilter}
                    options={[{ value: "All", label: "All Years" }, ...(["2022","2023","2024","2025","2026"] as const).map(y => ({ value: y, label: y }))]} />
                  <FilterSelect label="Type" value={typeFilter} onChange={setTypeFilter}
                    options={[{ value: "All", label: "All Types" }, ...VISIT_TYPES.map(t => ({ value: t, label: t }))]} />
                  <FilterSelect label="Region" value={regionFilter} onChange={setRegionFilter}
                    options={[{ value: "All", label: "All Regions" }, ...FV_REGIONS.map(r => ({ value: r, label: r }))]} />
                  <FilterSelect label="Gender" value={genderView} onChange={setGenderView}
                    options={[{ value: "All", label: "All Genders" }, { value: "Female", label: "Female-majority" }, { value: "Male", label: "Male-majority" }]} />
                </div>
                <div style={{ padding: "0 14px 12px", fontSize: 10.5, color: "#6B7280" }}>{filtered.length} of {fieldVisits.length} visits</div>
              </div>
            )}
          </div>
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
              {FV_CRITERIA.map(c => <RatingBar key={c} label={c} visits={filtered} criterion={c} />)}
            </ChartCard>

            <ChartCard title="Ratings by Gender of Participants"
              sub="Average score per dimension  -  female vs male majority visits"
              accent={VIOLET}>
              <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: VIOLET }}>F</span> Female-majority visits</span>
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: SKY }}>M</span> Male-majority visits</span>
              </div>
              {FV_CRITERIA.map(c => (
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
                    ? FV_CRITERIA.reduce((s, c) => s + sv.reduce((ss, v) => ss + v.scores[c], 0) / sv.length, 0) / FV_CRITERIA.length : 0;
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
            <ChartCard title="Participants per Field Visit"
              sub="Attendance count for each excursion in chronological order"
              accent={SKY}>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={attendanceTrend.slice(0, 12)} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Visit" tick={{ fontSize: 9, fill: "#9CA3AF" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} participants`, "Participants"]} />
                  <Bar dataKey="Participants" fill={SKY} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="Female" fill={VIOLET} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Male"   fill={SKY}    radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>


        {/* MOST IMPACTFUL + FREQUENTLY VISITED */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SecHeader title="Most Impactful Visits & Frequently Visited Organisations"
            sub="Ranked by participant feedback scores and repeat-visit frequency" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Most Impactful Field Visits"
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} partnerships`, "Partnerships"]} />
                  <Bar dataKey="Partnerships" fill={EMERALD} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                      <Stars score={FV_CRITERIA.reduce((s, c) => s + v.scores[c], 0) / FV_CRITERIA.length} />
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
            sub="Cumulative reach over time and completion rates across all field visits" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Cumulative Participant Reach"
            sub="Running total across all visits  -  shows programme exposure growth"
            accent={EMERALD}>
            <ResponsiveContainer width="100%" height={208}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="cumGradFV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={EMERALD} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={EMERALD} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="Period" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} participants`, "Cumulative Participants"]} />
                <Area type="monotone" dataKey="Cumulative Participants" stroke={EMERALD} strokeWidth={2} fill="url(#cumGradFV)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Completion Rate by Field Visit"
            sub="Percentage of registered participants completing each excursion"
            accent={EMERALD}>
            <ResponsiveContainer width="100%" height={208}>
              <BarChart
                data={[...filtered].sort((a, b) => a.date.localeCompare(b.date)).map(v => ({
                  Visit: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][v.month - 1]} '${String(v.year).slice(2)}`,
                  "Completion %": v.completionRate,
                }))}
                barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="Visit" tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Completion"]} />
                <Bar dataKey="Completion %" fill={EMERALD} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-center">
              {[
                { value: `${tot.completion}%`,                                           color: INDIGO,   label: "Avg completion"       },
                { value: String(filtered.filter(v => v.completionRate >= 95).length),    color: EMERALD,  label: "Visits â‰¥95%"          },
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
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#0E4633", minHeight: 116, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #0E4633 34%, #0E4633 66%, rgba(14,70,51,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>Africa&apos;s Oasis for Health &amp; Education Transformation</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}><span style={{ color: "#7FD0B6", fontWeight: 600 }}>Data Last Synced:</span> 28 May 2026, EAT</span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}><span style={{ color: "#7FD0B6", fontWeight: 600 }}>Source:</span> HENT Field Visits M&amp;E</span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(190,228,214,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>Contact Analyst</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
