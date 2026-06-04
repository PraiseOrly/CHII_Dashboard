"use client";
import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, FileText, Star } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  masterclasses,
  MC_TOPICS, RATING_CRITERIA,
  type MCTopic,
} from "@/data/masterclasses";
import { ventures as ALL_VENTURES } from "@/data/ventures";

// ─── Palette ─────────────────────────────────────────────────────────────────
const NAVY      = "#002147";
const RED       = "#D4264A";
const ACCENT    = "#2563EB";   // blue
const VIOLET_MC = "#7C3AED";   // violet
const EMERALD_MC = "#059669";  // emerald
const AMBER_MC  = "#D97706";   // amber
const SKY       = "#0EA5E9";   // sky
const ORANGE_MC = "#EA580C";   // orange
const TEAL      = "#0D9488";   // teal
const ROSE      = "#E11D48";   // rose

// Donut palettes — each set spans distinct hues across the colour wheel
const AGE_COLORS    = [ACCENT, ORANGE_MC, "#16A34A", ROSE];                       // blue, orange, green, rose
const REGION_COLORS = [TEAL, "#16A34A", ACCENT, VIOLET_MC, AMBER_MC];             // teal, green, blue, violet, amber
const STAGE_COLORS  = [SKY, ORANGE_MC, VIOLET_MC];                                // sky, orange, violet
const SOCIAL_COLORS = [ACCENT, EMERALD_MC, AMBER_MC];                             // blue, green, amber

const RATING_COLORS: Record<string, string> = {
  "Very High": EMERALD_MC, High: ACCENT, Moderate: AMBER_MC, Low: ROSE,
};

const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ratingLabel(score: number): string {
  if (score >= 4.5) return "Very High";
  if (score >= 3.8) return "High";
  if (score >= 3.0) return "Moderate";
  return "Low";
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: ACCENT }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = ACCENT, children }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5"
        style={{
          backgroundColor: accent,
          borderBottomColor: accent,
        }}>
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

// Custom SVG donut — same as overview, guarantees hex fill colours
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
            fontFamily="ui-sans-serif,system-ui,sans-serif">{label}</text>
        )}
      </svg>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded-lg px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
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
            <div className="flex-1 h-[18px] rounded-full overflow-hidden" style={{ backgroundColor: col + "1A" }}>
              <div className="h-full rounded-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
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
    <div className="rounded-xl border p-5 shadow-sm" style={{ backgroundColor: color + "0D", borderColor: color + "35" }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none" style={{ color: color + "AA" }}>{label}</p>
      <div className="flex items-baseline gap-0.5 mt-3">
        <p className="text-[2.25rem] font-black tabular-nums leading-none" style={{ color }}>{pct}</p>
        <p className="text-lg font-bold mb-0.5" style={{ color }}>%</p>
      </div>
      <p className="text-[11px] text-gray-400 mt-2 tabular-nums">{value.toLocaleString()} / {tot.toLocaleString()}</p>
      <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ backgroundColor: color + "20" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
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
    ? (sessions.reduce((s, m) => s + m.scores[criterion], 0) / sessions.length).toFixed(1) : "—";
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
        <div className="absolute pointer-events-none z-20 rounded-lg px-2 py-0.5 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
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
          <span className="text-[10px] w-5 font-bold flex-shrink-0" style={{ color: VIOLET_MC }}>♀</span>
          <div className="flex-1 h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: VIOLET_MC + "20" }}>
            <div className="h-full rounded-sm" style={{ width: `${(fAvg / 5) * 100}%`, backgroundColor: VIOLET_MC }} />
          </div>
          <span className="text-[10px] text-gray-500 w-6">{fAvg.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] w-5 font-bold flex-shrink-0" style={{ color: SKY }}>♂</span>
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

// ─── Count-up animation ───────────────────────────────────────────────────────
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

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded-xl border px-2 py-2.5 text-center"
      style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-wider mb-1.5 leading-tight"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-lg font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.62)" }}>{sub}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MasterclassesPage() {
  const [yearFilter,  setYearFilter]  = useState<"All"|"2023"|"2024"|"2025"|"2026">("All");
  const [topicFilter, setTopicFilter] = useState<"All"|MCTopic>("All");
  const [genderView,  setGenderView]  = useState<"All"|"Female"|"Male">("All");

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

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-black" style={{ color: NAVY }}>Masterclasses</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Capacity-building sessions · 2023–2026 · {masterclasses.length} sessions tracked
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-semibold text-white shadow-sm"
                style={{ backgroundColor: RED }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                { label: "Total Masterclasses",     num: tot.sessions,    fmt: (n: number) => String(Math.round(n)),                   sub: "Sessions delivered",     clr: "#1E3A8A" },  // deep blue
                { label: "Total Attendees",          num: tot.attendees,   fmt: (n: number) => Math.round(n).toLocaleString(),          sub: "Across all sessions",    clr: "#14532D" },  // deep green
                { label: "Ventures Represented",     num: tot.ventures,    fmt: (n: number) => Math.round(n).toLocaleString(),          sub: "Unique ventures",        clr: "#7C2D12" },  // deep orange
                { label: "Female-Led Ventures",      num: tot.femaleVent,  fmt: (n: number) => String(Math.round(n)),                   sub: `${tot.ventures > 0 ? Math.round((tot.femaleVent / tot.ventures) * 100) : 0}% of attending`, clr: "#6B21A8" },  // deep violet
                { label: "Avg Completion Rate",      num: tot.completion,  fmt: (n: number) => `${Math.round(n)}%`,                    sub: "Participants completing", clr: "#9D174D" },  // deep rose
              ].map(tile => (
                <KpiTile key={tile.label} label={tile.label} num={tile.num}
                  displayFmt={tile.fmt} sub={tile.sub} clr={tile.clr} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Year</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value as typeof yearFilter)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                <option value="All">All Years</option>
                {(["2023","2024","2025","2026"] as const).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Topic</label>
              <select value={topicFilter} onChange={e => setTopicFilter(e.target.value as typeof topicFilter)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm min-w-[160px]">
                <option value="All">All Topics</option>
                {MC_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Gender</label>
              <select value={genderView} onChange={e => setGenderView(e.target.value as typeof genderView)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                <option value="All">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <span className="text-[10px] text-gray-400">
                {filtered.length} of {masterclasses.length} sessions
              </span>
              {(yearFilter !== "All" || topicFilter !== "All" || genderView !== "All") && (
                <button
                  onClick={() => { setYearFilter("All"); setTopicFilter("All"); setGenderView("All"); }}
                  className="text-[10px] font-medium underline underline-offset-2 transition-colors"
                  style={{ color: ACCENT }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: RATINGS */}
        <section>
          <SecHeader title="Venture Ratings of Masterclasses"
            sub={`${filtered.length} sessions rated across Quality, Usefulness, Accessibility, Relevance`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High · High · Moderate · Low — proportion of sessions per rating level">
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
              sub="Avg score per criterion — female-majority vs male-majority sessions"
              accent={VIOLET_MC}>
              <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: VIOLET_MC }}>♀</span> Female-majority sessions</span>
                <span className="flex items-center gap-1"><span className="font-bold" style={{ color: SKY }}>♂</span> Male-majority sessions</span>
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

        {/* SECTION 2: DEMOGRAPHICS */}
        <section>
          <SecHeader title="Participant Demographics"
            sub="Attendance breakdown by gender, age, stage, region, and social inclusion" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants"  value={tot.female}              pct={femalePct}      total={tot.attendees} color={VIOLET_MC}  />
            <ProfileCard label="Male Participants"    value={tot.attendees - tot.female} pct={100 - femalePct} total={tot.attendees} color={ACCENT}  />
            <ProfileCard label="Student Participants" value={tot.students}            pct={studentPct}     total={tot.attendees} color={EMERALD_MC} />
            <ProfileCard label="Alumni Participants"  value={alumniTot}               pct={100 - studentPct} total={tot.attendees} color={AMBER_MC} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: col + "1A" }}>
                        <div className="h-full rounded-full"
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

        {/* SECTION 3: ATTENDANCE TRENDS */}
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
                  <Bar dataKey="Attendees" fill={ORANGE_MC} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Attendance by Gender per Year"
              sub="Female vs male participants — yearly comparison"
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
                  <Bar dataKey="Female" fill={VIOLET_MC} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Male"   fill={SKY}       radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>

        {/* SECTION 4+6: GROWTH + COMPLETION — same row */}
        <section>
          <SecHeader title="Growth &amp; Completion Analytics"
            sub="Cumulative reach and per-session completion rates across all masterclasses" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Cumulative Attendee Growth"
              sub="Running total of participants — shows programme reach expansion"
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
                  <Bar dataKey="Completion %" fill={TEAL} radius={[3, 3, 0, 0]} />
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

        {/* SECTION 5: TOP PERFORMING + MOST ENGAGED */}
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
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: ACCENT + "1A" }}>
                        <div className="h-full rounded-full" style={{ width: `${v.engagement}%`, backgroundColor: ACCENT }} />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5 text-right">{v.engagement}% eng.</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* FOOTER */}
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(tot.sessions),            label: "Sessions Delivered",   clr: "#1E3A8A" },
              { value: tot.attendees.toLocaleString(),   label: "Total Attendees",      clr: "#14532D" },
              { value: `${femalePct}%`,                  label: "Female Participation", clr: "#9D174D" },
              { value: `${tot.completion}%`,             label: "Avg Completion Rate",  clr: "#134E4A" },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-6 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}` }}>
                <p className="text-2xl font-black tabular-nums text-white">{tile.value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">HENT · Masterclasses · 2023–2026</p>
            <p className="text-[10px] text-gray-400">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
