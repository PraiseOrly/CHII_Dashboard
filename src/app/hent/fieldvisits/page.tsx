"use client";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, FileText, Star, MapPin, Camera, Users, Handshake } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  fieldVisits, VISIT_TYPES, FV_CRITERIA, FV_REGIONS,
  type VisitType, type FVRegion,
} from "@/data/fieldVisits";

// ─── palette ─────────────────────────────────────────────────────────────────
const NAVY    = "#002147"; // footer bg only
const RED     = "#D4264A";
const ACCENT  = "#059669"; // page identity — field visits = emerald/green
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

// ─── shared components ────────────────────────────────────────────────────────

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
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth="2.5">
            <title>{s.name}: {valueFormatter(s.value)}</title>
          </path>
        ))}
        {label && (
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#111827" fontSize="20" fontWeight="900"
            fontFamily="ui-sans-serif,system-ui,sans-serif">{label}</text>
        )}
      </svg>
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

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
      <div>
        <p className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.1em]">{title}</p>
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
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-start gap-2.5">
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0" style={{ backgroundColor: accent }} />
        <div>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em] leading-none">{title}</p>
          {sub && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{sub}</p>}
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

function RatingBar({ label, visits, criterion }: {
  label: string; visits: typeof fieldVisits; criterion: typeof FV_CRITERIA[number];
}) {
  const vh  = visits.filter(v => v.scores[criterion] >= 4.5).length;
  const hi  = visits.filter(v => v.scores[criterion] >= 3.8 && v.scores[criterion] < 4.5).length;
  const mo  = visits.filter(v => v.scores[criterion] >= 3.0 && v.scores[criterion] < 3.8).length;
  const lo  = visits.filter(v => v.scores[criterion] < 3.0).length;
  const tot = visits.length || 1;
  const avg = visits.length
    ? (visits.reduce((s, v) => s + v.scores[criterion], 0) / visits.length).toFixed(1) : "—";
  return (
    <div className="flex items-center gap-3 mb-2.5 last:mb-0">
      <div className="w-44 text-[10px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-4 bg-gray-100 rounded-sm overflow-hidden flex">
        <div style={{ width: `${(vh / tot) * 100}%`, backgroundColor: RATING_COLORS["Very High"] }} title={`Very High: ${vh}`} />
        <div style={{ width: `${(hi / tot) * 100}%`, backgroundColor: RATING_COLORS.High }}        title={`High: ${hi}`} />
        <div style={{ width: `${(mo / tot) * 100}%`, backgroundColor: RATING_COLORS.Moderate }}    title={`Moderate: ${mo}`} />
        <div style={{ width: `${(lo / tot) * 100}%`, backgroundColor: RATING_COLORS.Low }}         title={`Low: ${lo}`} />
      </div>
      <div className="w-10 text-[11px] text-gray-500 text-right flex-shrink-0 font-medium">{avg}/5</div>
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

// ─── KPI tile map (7 metrics) ─────────────────────────────────────────────────
const KPI_TILES = [
  { label: "Total Field Visits",      bg: "#E0F2FE", clr: "#0369A1" },
  { label: "Total Participants",      bg: "#ECFDF5", clr: "#059669" },
  { label: "Ventures Participating",  bg: "#E6FFFA", clr: "#0D9488" },
  { label: "Organisations Visited",   bg: "#FFF7ED", clr: "#C2410C" },
  { label: "Female Participants",     bg: "#F3E8FF", clr: "#7C3AED" },
  { label: "Avg Attendance / Visit",  bg: "#FFFBEB", clr: "#B45309" },
  { label: "Avg Completion Rate",     bg: "#EEF2FF", clr: "#4338CA" },
] as const;

// ─── page ─────────────────────────────────────────────────────────────────────
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
    .map(v => ({ Visit: v.organization.length > 20 ? v.organization.slice(0, 20) + "…" : v.organization, Participants: v.participants }));

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
    .sort((a, b) => b.avgScore - a.avgScore).slice(0, 6);

  const orgFreq: Record<string, { type: string; count: number; participants: number; avgScore: number; location: string }> = {};
  filtered.forEach(v => {
    const base = v.organization.replace(/ — .*/, "");
    if (!orgFreq[base]) orgFreq[base] = { type: v.type, count: 0, participants: 0, avgScore: 0, location: `${v.city}, ${v.country}` };
    orgFreq[base].count++;
    orgFreq[base].participants += v.participants;
    orgFreq[base].avgScore += FV_CRITERIA.reduce((s, c) => s + v.scores[c], 0) / FV_CRITERIA.length;
  });
  const frequentOrgs = Object.entries(orgFreq)
    .map(([name, d]) => ({ name, ...d, avgScore: d.avgScore / d.count }))
    .sort((a, b) => b.count - a.count || b.participants - a.participants).slice(0, 6);

  const partnershipsTrend = YEARS.map(yr => ({
    Year: String(yr),
    Partnerships: filtered.filter(v => v.year === yr).reduce((s, v) => s + v.partnerships, 0),
  }));

  const MEDIA_PALETTE = [INDIGO, PRIMARY, TEAL, ACCENT, VIOLET, AMBER];
  const MEDIA_ICONS   = [Camera, Users, MapPin, Handshake, Star, Camera];

  const kpiValues = [
    { value: String(tot.visits),               sub: "Excursions conducted"   },
    { value: tot.participants.toLocaleString(), sub: "Across all visits"      },
    { value: tot.ventures.toLocaleString(),     sub: "Unique ventures"        },
    { value: String(tot.orgs),                  sub: "Distinct host sites"    },
    { value: `${femalePct}%`,                   sub: `${tot.female} people`   },
    { value: String(avgAtt),                    sub: "Per excursion"          },
    { value: `${tot.completion}%`,              sub: "Participants completing" },
  ];

  const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>Field Visits</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Industry excursions · 2022–2026 · {fieldVisits.length} visits tracked
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

          {/* KPI strip — 7 distinct tinted tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {KPI_TILES.map(({ label, bg, clr }, i) => (
                <div key={label} className="rounded-xl border px-3 py-3.5"
                  style={{ backgroundColor: bg, borderColor: clr + "40" }}>
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] leading-tight mb-2"
                    style={{ color: clr + "B0" }}>{label}</p>
                  <p className="text-xl font-black tabular-nums leading-none" style={{ color: clr }}>{kpiValues[i].value}</p>
                  <p className="text-[8.5px] mt-1.5 font-medium" style={{ color: clr + "80" }}>{kpiValues[i].sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
          <div className="flex flex-wrap items-end gap-5">
            {[
              { label: "Year", value: yearFilter, set: setYearFilter, opts: [["All","All Years"],["2022","2022"],["2023","2023"],["2024","2024"],["2025","2025"],["2026","2026"]], w: "min-w-[120px]" },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{f.label}</label>
                <select value={f.value} onChange={e => (f.set as (v: string) => void)(e.target.value)}
                  className={`text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 cursor-pointer shadow-sm ${f.w}`}>
                  {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visit Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as "All" | VisitType)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 cursor-pointer min-w-[190px] shadow-sm">
                <option value="All">All Types</option>
                {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Region</label>
              <select value={regionFilter} onChange={e => setRegionFilter(e.target.value as "All" | FVRegion)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 cursor-pointer min-w-[190px] shadow-sm">
                <option value="All">All Regions</option>
                {FV_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gender</label>
              <select value={genderView} onChange={e => setGenderView(e.target.value as "All" | "Female" | "Male")}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 cursor-pointer min-w-[140px] shadow-sm">
                <option value="All">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="flex items-end gap-3 ml-auto pb-0.5">
              <span className="text-[11px] text-gray-400">
                {filtered.length} of {fieldVisits.length} visit{fieldVisits.length !== 1 ? "s" : ""}
              </span>
              {(yearFilter !== "All" || typeFilter !== "All" || regionFilter !== "All" || genderView !== "All") && (
                <button
                  onClick={() => { setYearFilter("All"); setTypeFilter("All"); setRegionFilter("All"); setGenderView("All"); }}
                  className="text-[11px] font-medium underline underline-offset-2 transition-colors"
                  style={{ color: ACCENT }}>
                  Clear filters
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
              sub="Very High · High · Moderate · Low — proportion of visits per level"
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
              sub="Average score per dimension — female vs male majority visits"
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants"  value={tot.female}                pct={femalePct}      total={tot.participants} color={VIOLET}  />
            <ProfileCard label="Male Participants"    value={tot.participants-tot.female} pct={100-femalePct} total={tot.participants} color={SKY}     />
            <ProfileCard label="Student Participants" value={tot.students}               pct={studentPct}     total={tot.participants} color={EMERALD} />
            <ProfileCard label="Alumni Participants"  value={alumniTotal}               pct={100-studentPct} total={tot.participants} color={AMBER}   />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ChartCard title="Age Group Distribution" sub="Participants by age bracket" accent={SKY}>
              <CustomDonut data={ageData} colors={[SKY, PRIMARY, VIOLET, ROSE]} className="h-36" valueFormatter={(v) => `${v}`} />
            </ChartCard>
            <ChartCard title="Venture Stage Representation" sub="Attendees by development stage" accent={INDIGO}>
              <CustomDonut data={stageData} colors={[SKY, PRIMARY, INDIGO]} className="h-36" valueFormatter={(v) => `${v}`} />
            </ChartCard>
            <ChartCard title="Visit Type Breakdown" sub="Organisations by sector category" accent={TEAL}>
              <CustomDonut data={typeData} colors={TYPE_COLORS} className="h-36" valueFormatter={(v) => `${v}`} />
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
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: col + "1A" }}>
                        <div className="h-full rounded-full"
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
                          <span className="text-xs text-gray-400 ml-2">· {data.participants} participants</span>
                        </div>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: col + "1A" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: col }} />
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
                  <XAxis dataKey="Visit" tick={{ fontSize: 9, fill: "#9CA3AF" }} angle={-35} textAnchor="end"
                    axisLine={false} tickLine={false} height={50} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} participants`, "Participants"]} />
                  <Bar dataKey="Participants" fill={SKY} radius={[3, 3, 0, 0]} />
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
                  <Bar dataKey="Female" fill={VIOLET} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Male"   fill={SKY}    radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>

        {/* GROWTH */}
        <section>
          <SecHeader title="Participation Growth Over Time"
            sub="Cumulative participants reached through field excursions" />
          <ChartCard title="Cumulative Participant Reach"
            sub="Running total across all visits — shows programme exposure growth"
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
                  <Bar dataKey="Partnerships" fill={EMERALD} radius={[4, 4, 0, 0]} />
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
                      <p className="text-[10px] text-gray-400">{v.city} · {v.year}</p>
                    </div>
                    <div className="w-20 flex-shrink-0">
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: EMERALD + "20" }}>
                        <div className="h-full rounded-full" style={{ width: `${(v.partnerships / 8) * 100}%`, backgroundColor: EMERALD }} />
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
            {[...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((v, i) => {
              const bg   = MEDIA_PALETTE[i % MEDIA_PALETTE.length];
              const Icon = MEDIA_ICONS[i % MEDIA_ICONS.length];
              return (
                <div key={v.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-20 flex items-center justify-center" style={{ backgroundColor: bg + "18" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: bg + "25" }}>
                      <Icon size={22} style={{ color: bg }} />
                    </div>
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

        {/* COMPLETION ANALYTICS */}
        <section>
          <SecHeader title="Attendance & Completion Analytics"
            sub="Engagement and completion rates across all field visits" />
          <ChartCard title="Completion Rate by Field Visit"
            sub="Percentage of registered participants completing each excursion"
            accent={EMERALD}>
            <ResponsiveContainer width="100%" height={208}>
              <BarChart
                data={[...filtered].sort((a, b) => a.date.localeCompare(b.date)).map(v => ({
                  Visit: v.organization.length > 18 ? v.organization.slice(0, 18) + "…" : v.organization,
                  "Completion %": v.completionRate,
                }))}
                barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="Visit" tick={{ fontSize: 9, fill: "#9CA3AF" }} angle={-35} textAnchor="end"
                  axisLine={false} tickLine={false} height={50} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Completion"]} />
                <Bar dataKey="Completion %" fill={EMERALD} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-center">
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
        </section>

        {/* FOOTER */}
        <div className="rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: NAVY }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {([
              { value: String(tot.visits),               label: "Field Visits",             accent: "#60A5FA" },
              { value: tot.participants.toLocaleString(), label: "Total Participants",       accent: "#4ADE80" },
              { value: `${femalePct}%`,                  label: "Female Participation",     accent: "#A78BFA" },
              { value: String(tot.partnerships),          label: "Partnerships Established", accent: "#FCD34D" },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold tabular-nums" style={{ color: tile.accent }}>{tile.value}</p>
                <p className="text-[11px] text-blue-200/50 mt-1 uppercase tracking-wider">{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">HENT · Field Visits · 2022–2026</p>
            <p className="text-[10px] text-blue-200/40">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
