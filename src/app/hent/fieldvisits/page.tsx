"use client";
import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, FileText, Star, MapPin, Users, Handshake } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  fieldVisits, VISIT_TYPES, FV_CRITERIA, FV_REGIONS,
  type VisitType, type FVRegion,
} from "@/data/fieldVisits";

// â”€â”€â”€ palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY    = "#002147"; // footer bg only
const RED     = "#D4264A";
const ACCENT  = "#059669"; // page identity â€” field visits = emerald/green
const SKY     = "#0EA5E9";
const VIOLET  = "#8B5CF6";
const TEAL    = "#14B8A6";
const EMERALD = "#10B981";
const INDIGO  = "#4338CA";
const AMBER   = "#F59E0B";
const ROSE    = "#F43F5E";
const PRIMARY = "#2F6FED";

const BAR_COLORS = [SKY, TEAL, ACCENT, VIOLET, AMBER, ROSE, INDIGO, PRIMARY];

const RATING_COLORS: Record<string, string> = {
  "Very High": EMERALD, High: PRIMARY, Moderate: AMBER, Low: ROSE,
};
const RANK_BG = [AMBER, "#9CA3AF", "#D97706"];

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
    <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
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
    ? (visits.reduce((s, v) => s + v.scores[criterion], 0) / visits.length).toFixed(1) : "â€”";
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

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded border px-2 py-2.5 text-center"
      style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.1em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-[1.1rem] font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.62)" }}>{sub}</p>
    </div>
  );
}

// â”€â”€â”€ KPI tile map (7 metrics) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const KPI_TILES = [
  { label: "Total Field Visits",      clr: "#065F46" },  // emerald  â€” page identity
  { label: "Total Participants",      clr: "#1E3A8A" },  // deep blue
  { label: "Ventures Participating",  clr: "#6D28D9" },  // violet
  { label: "Organisations Visited",   clr: "#0E7490" },  // cyan
  { label: "Avg Attendance / Visit",  clr: "#C2410C" },  // orange
  { label: "Avg Completion Rate",     clr: "#3730A3" },  // indigo
] as const;

// â”€â”€â”€ page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function FieldVisitsPage() {
  const [yearFilter,   setYearFilter]   = useState<"All"|"2022"|"2023"|"2024"|"2025"|"2026">("All");
  const [typeFilter,   setTypeFilter]   = useState<"All"|VisitType>("All");
  const [regionFilter, setRegionFilter] = useState<"All"|FVRegion>("All");
  const [genderView,   setGenderView]   = useState<"All"|"Female"|"Male">("All");

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
    const base = v.organization.replace(/ â€” .*/, "");
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
      <header className="bg-white border-b border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-end justify-between py-5">
            <div>
              <h1 className="text-[1.6rem] font-black text-gray-900 leading-none">Field Visits</h1>
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Industry excursions Â· 2022â€“2026 Â· {fieldVisits.length} visits tracked
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-2 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Report
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded font-semibold text-white shadow-sm transition-colors"
                style={{ backgroundColor: RED }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* KPI strip â€” 7 distinct tinted tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {KPI_TILES.map(({ label, clr }, i) => (
                <KpiTile key={label} label={label} num={kpiValues[i].num}
                  displayFmt={kpiValues[i].fmt} sub={kpiValues[i].sub} clr={clr} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* â”€â”€ MAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* FILTERS */}
        <div className="bg-white rounded shadow-sm border border-gray-100 px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Year</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value as "All"|"2022"|"2023"|"2024"|"2025"|"2026")}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                <option value="All">All Years</option>
                {(["2022","2023","2024","2025","2026"] as const).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as "All" | VisitType)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm min-w-[160px]">
                <option value="All">All Types</option>
                {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Region</label>
              <select value={regionFilter} onChange={e => setRegionFilter(e.target.value as "All" | FVRegion)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm min-w-[150px]">
                <option value="All">All Regions</option>
                {FV_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Gender</label>
              <select value={genderView} onChange={e => setGenderView(e.target.value as "All" | "Female" | "Male")}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                <option value="All">All Genders</option>
                <option value="Female">Female-majority</option>
                <option value="Male">Male-majority</option>
              </select>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <span className="text-[10px] text-gray-400">
                {filtered.length} of {fieldVisits.length} visits
              </span>
              {(yearFilter !== "All" || typeFilter !== "All" || regionFilter !== "All" || genderView !== "All") && (
                <button
                  onClick={() => { setYearFilter("All"); setTypeFilter("All"); setRegionFilter("All"); setGenderView("All"); }}
                  className="text-[10px] font-medium underline underline-offset-2 transition-colors"
                  style={{ color: ACCENT }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RATINGS */}
        <section>
          <SecHeader title="Participant Ratings & Feedback"
            sub={`${filtered.length} visits rated across six experience dimensions`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High Â· High Â· Moderate Â· Low â€” proportion of visits per level"
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
              sub="Average score per dimension â€” female vs male majority visits"
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
        <section>
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
        <section>
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
                          <span className="text-xs text-gray-400 ml-2">Â· {data.participants} participants</span>
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
        <section>
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
        <section>
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
        <section>
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
                      <p className="text-[10px] text-gray-400">{v.city} Â· {v.year}</p>
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
        <section>
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
        <section>
          <SecHeader title="Participation Growth & Completion Analytics"
            sub="Cumulative reach over time and completion rates across all field visits" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Cumulative Participant Reach"
            sub="Running total across all visits â€” shows programme exposure growth"
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
        <div className="rounded overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { icon: MapPin,    value: String(tot.visits),               label: "Field Visits",             clr: "#065F46" },  // emerald â€” page identity
              { icon: Users,     value: tot.participants.toLocaleString(), label: "Total Participants",       clr: "#1E3A8A" },  // deep blue
              { icon: Star,      value: `${femalePct}%`,                  label: "Female Participation",     clr: "#9D174D" },  // rose
              { icon: Handshake, value: String(tot.partnerships),          label: "Partnerships Established", clr: "#C2410C" },  // orange
            ] as const).map(({ icon: Icon, value, label, clr }) => (
              <div key={label} className="px-5 py-5 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${clr}` }}>
                <Icon size={15} className="mx-auto mb-2" style={{ color: "rgba(255,255,255,0.72)" }} />
                <p className="text-2xl font-black tabular-nums text-white">{value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">HENT Â· Field Visits Â· 2022â€“2026</p>
            <p className="text-[10px] text-gray-400">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
