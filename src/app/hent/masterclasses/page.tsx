"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Star, Zap, Briefcase, SlidersHorizontal, X } from "lucide-react";
import HENTNav from "@/components/HENTNav";
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

const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" };

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

// Custom SVG donut  -  same as overview, guarantees hex fill colours
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

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MasterclassesPage() {
  const [yearFilter,  setYearFilter]  = useState<"All"|"2023"|"2024"|"2025"|"2026">("All");
  const [topicFilter, setTopicFilter] = useState<"All"|MCTopic>("All");
  const [genderView,  setGenderView]  = useState<"All"|"Female"|"Male">("All");
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
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
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Masterclasses</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Capacity-building sessions · 2023–2026 · {masterclasses.length} sessions tracked</p>
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

        {/* Section pills (left) + Filters dropdown (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[{ n: 0, label: "All Sections" }, { n: 1, label: "Ratings" }, { n: 2, label: "Demographics" }, { n: 3, label: "Attendance" }, { n: 4, label: "Growth" }, { n: 5, label: "Top Performers" }].map(({ n, label }) => {
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
                      <button onClick={() => { setYearFilter("All"); setTopicFilter("All"); setGenderView("All"); }} style={{ fontSize: 10, fontWeight: 600, color: "white", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, padding: "3px 8px", backgroundColor: "rgba(255,255,255,0.08)", cursor: "pointer" }}>Reset</button>
                    )}
                    <button onClick={() => setFiltersOpen(false)} title="Close" style={{ color: "white", display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}><X size={13} /></button>
                  </div>
                </div>
                <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <FilterSelect label="Year" value={yearFilter} onChange={setYearFilter}
                    options={[{ value: "All", label: "All Years" }, ...(["2023","2024","2025","2026"] as const).map(y => ({ value: y, label: y }))]} />
                  <FilterSelect label="Topic" value={topicFilter} onChange={setTopicFilter}
                    options={[{ value: "All", label: "All Topics" }, ...MC_TOPICS.map(t => ({ value: t, label: t }))]} />
                  <FilterSelect label="Gender" value={genderView} onChange={setGenderView}
                    options={[{ value: "All", label: "All Genders" }, { value: "Female", label: "Female" }, { value: "Male", label: "Male" }]} />
                </div>
                <div style={{ padding: "0 14px 12px", fontSize: 10.5, color: "#6B7280" }}>{filtered.length} of {masterclasses.length} sessions</div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: RATINGS */}
        {show(1) && (
        <section>
          <SecHeader title="Venture Ratings of Masterclasses"
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
          <SecHeader title="Participant Demographics"
            sub="Attendance breakdown by gender, age, stage, region, and social inclusion" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants"  value={tot.female}              pct={femalePct}      total={tot.attendees} color={VIOLET_MC}  />
            <ProfileCard label="Male Participants"    value={tot.attendees - tot.female} pct={100 - femalePct} total={tot.attendees} color={ACCENT}  />
            <ProfileCard label="Student Participants" value={tot.students}            pct={studentPct}     total={tot.attendees} color={EMERALD_MC} />
            <ProfileCard label="Alumni Participants"  value={alumniTot}               pct={100 - studentPct} total={tot.attendees} color={AMBER_MC} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <SecHeader title="Attendance Trends"
            sub="Session attendance and yearly gender breakdown" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Attendance by Session"
              sub="Attendees per masterclass in chronological order"
              accent={ORANGE_MC}>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={attendanceTrend.slice(0, 12)} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Session" tick={{ fontSize: 9, fill: "#9CA3AF" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} attendees`, "Attendees"]} />
                  <Bar dataKey="Attendees" fill={ORANGE_MC} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="Female" fill={VIOLET_MC} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Male"   fill={SKY}       radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
        )}

        {/* SECTION 4+6: GROWTH + COMPLETION  -  same row */}
        {show(4) && (
        <section>
          <SecHeader title="Growth &amp; Completion Analytics"
            sub="Cumulative reach and per-session completion rates across all masterclasses" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Cumulative Attendee Growth"
              sub="Running total of participants  -  shows programme reach expansion"
              accent={VIOLET_MC}>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="mcGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={VIOLET_MC} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={VIOLET_MC} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Period" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} total attendees`, "Cumulative Attendees"]} />
                  <Area type="monotone" dataKey="Cumulative Attendees"
                    stroke={VIOLET_MC} strokeWidth={2} fill="url(#mcGrowthGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Completion Rate by Session"
              sub="Percentage of registered attendees who completed each masterclass"
              accent={TEAL}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={completionData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Session" tick={{ fontSize: 9, fill: "#9CA3AF" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Completion"]} />
                  <Bar dataKey="Completion %" fill={TEAL} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div>
                  <p className="text-lg font-bold" style={{ color: VIOLET_MC }}>{tot.completion}%</p>
                  <p className="text-[9px] text-gray-400">Avg completion</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: EMERALD_MC }}>{filtered.filter(m => m.completionRate >= 90).length}</p>
                  <p className="text-[9px] text-gray-400">Sessions â‰¥90%</p>
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
          <SecHeader title="Top Performing Masterclasses & Most Engaged Ventures"
            sub="Ranked by attendee feedback and session participation" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Top Performing Masterclasses"
              sub="Ranked by average feedback score across all four rating criteria"
              accent={AMBER_MC}>
              <div className="space-y-3">
                {topSessions.map((m, i) => (
                  <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? ACCENT }}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <Stars score={m.avgScore} />
                        <span className="text-[10px] text-gray-400">{m.topic}</span>
                        <span className="text-[10px] text-gray-400">{m.attendees} attendees</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap mt-1.5">
                        {RATING_CRITERIA.map(c => (
                          <span key={c} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: RATING_COLORS[ratingLabel(m.scores[c])] + "22", color: RATING_COLORS[ratingLabel(m.scores[c])] }}>
                            {c.split(" ")[0]}: {m.scores[c].toFixed(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Most Engaged Ventures"
              sub="Ventures with highest masterclass session participation"
              accent={ACCENT}>
              <div className="space-y-3">
                {engagedVentures.map((v, i) => (
                  <div key={v.name} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? ACCENT }}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{v.name}</p>
                      <p className="text-[10px] text-gray-400">{v.sector}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: ACCENT }}>{v.sessions}</p>
                      <p className="text-[10px] text-gray-400">sessions</p>
                    </div>
                    <div className="w-16">
                      <div className="h-1.5 rounded-sm overflow-hidden" style={{ backgroundColor: ACCENT + "1A" }}>
                        <div className="h-full" style={{ width: `${v.engagement}%`, backgroundColor: ACCENT }} />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5 text-right">{v.engagement}% eng.</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>
        )}

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
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}><span style={{ color: "#7FD0B6", fontWeight: 600 }}>Source:</span> HENT Masterclasses M&amp;E</span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(190,228,214,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>Contact Analyst</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
