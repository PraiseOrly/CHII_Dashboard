"use client";
import { HeaderStatsPanel, FilterButton, FilterDropdown, ChartTip } from "@/components/ui/hent";
import { ChartLegend } from "@/components/ui/hent";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList,
} from "recharts";
import { Star, Award, Users, Target, Zap, Briefcase, TrendingUp, CheckCircle2, Info, ChevronDown } from "lucide-react";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { DonutRing } from "@/components/charts/donut-chart";
import {
  mentorshipPrograms, MF_CRITERIA, MF_QUAL_AREAS,
  type MFCriterion, type MFQualArea,
} from "@/data/mentorships";

// Color palette - HENT green (matching ventures)
const HERO = "#2D6A4F";
const BRAND = "#2D6A4F";
const BRAND_DK = "#0E4633";
const LIGHT_BORDER = "rgba(14, 70, 51, 0.12)";
const LIGHT_BG = "#f8fafc";
const GREEN_RAMP = ["#1B4332", "#2D6A4F", "#40916C", "#5BB4A0", "#8ECCC4"];

const ACCENT  = "#2D6A4F";
const SKY     = "#1F9E9E";
const VIOLET  = "#6B8E5B";
const TEAL    = "#2D8A8A";
const EMERALD = "#40916C";
const INDIGO  = "#2D6A4F";
const AMBER   = "#A6C13C";
const ROSE    = "#94A93B";
const PRIMARY = "#1B4332";

const BAR_COLORS = ["#1B4332", "#1F9E9E", "#A6C13C", "#6B8E5B", "#40916C"];

const RATING_COLORS: Record<string, string> = {
  "Very High": "#1B4332", High: "#40916C", Moderate: "#A6C13C", Low: "#C44536",
};

// Panel Component for Charts (matching ventures page)
function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void }) {
  const [tip, setTip] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
      <div style={{ backgroundColor: BRAND, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, minWidth: 0, flex: 1 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D4AF87", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
              {info && (
                <span style={{ position: "relative", display: "flex", cursor: "pointer" }}
                  onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
                  <Info size={12} color="white" opacity={0.6} />
                  {tip && (
                    <span style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", color: BRAND_DK, fontSize: 10.5, fontWeight: 400, textTransform: "none", letterSpacing: 0, lineHeight: 1.5, padding: "8px 11px", borderRadius: 7, width: 210, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: `1px solid ${LIGHT_BORDER}`, zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
                      {info}
                    </span>
                  )}
                </span>
              )}
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>{subtitle}</p>
          </div>
        </div>
      </div>
      {filterOptions && filterValue && onFilterChange && (
        <div style={{ padding: "8px 18px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "5px 10px",
                borderRadius: 10,
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                backgroundColor: "white",
                color: BRAND_DK,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                whiteSpace: "nowrap",
              }}
            >
              {filterValue} <ChevronDown size={12} />
            </button>
            {filterOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                backgroundColor: "white",
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 10,
                minWidth: 140,
                overflow: "hidden",
              }}>
                {filterOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      onFilterChange(opt);
                      setFilterOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: 11,
                      fontWeight: opt === filterValue ? 700 : 500,
                      backgroundColor: opt === filterValue ? BRAND : "white",
                      color: opt === filterValue ? "white" : BRAND_DK,
                      border: `1px solid ${LIGHT_BORDER}`,
                      borderLeft: `5px solid ${BRAND}`,
                      cursor: "pointer",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{ padding: "12px 18px 18px" }}>
        {children}
      </div>
    </div>
  );
}

function ratingLabel(s: number): string {
  return s >= 4.5 ? "Very High" : s >= 3.8 ? "High" : s >= 3.0 ? "Moderate" : "Low";
}
function heatBg(s: number): string {
  if (s >= 4.5) return EMERALD;
  if (s >= 4.0) return PRIMARY;
  if (s >= 3.5) return AMBER;
  return ROSE;
}

// â"€â"€â"€ shared components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

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
            <div className="w-[96px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
            <div className="flex-1 h-[18px] rounded-sm overflow-hidden" style={{ backgroundColor: col + "1A" }}>
              <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
            </div>
            <div className="text-[11px] font-bold w-8 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
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

function RatingBar({ label, programs, criterion }: {
  label: string; programs: typeof mentorshipPrograms; criterion: MFCriterion;
}) {
  const [hovered, setHovered] = useState<{ label: string; count: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const vh  = programs.filter(p => p.scores[criterion] >= 4.5).length;
  const hi  = programs.filter(p => p.scores[criterion] >= 3.8 && p.scores[criterion] < 4.5).length;
  const mo  = programs.filter(p => p.scores[criterion] >= 3.0 && p.scores[criterion] < 3.8).length;
  const lo  = programs.filter(p => p.scores[criterion] < 3.0).length;
  const tot = programs.length || 1;
  const avg = programs.length
    ? (programs.reduce((s, p) => s + p.scores[criterion], 0) / programs.length).toFixed(1) : " - ";
  const segs = [
    { key: "Very High", count: vh, color: RATING_COLORS["Very High"] },
    { key: "High",      count: hi, color: RATING_COLORS.High },
    { key: "Moderate",  count: mo, color: RATING_COLORS.Moderate },
    { key: "Low",       count: lo, color: RATING_COLORS.Low },
  ];
  return (
    <div className="relative flex items-center gap-3 mb-3 last:mb-0"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <div className="w-44 text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
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

function GenderRatingBar({ label, fPrograms, mPrograms, criterion }: {
  label: string; fPrograms: typeof mentorshipPrograms; mPrograms: typeof mentorshipPrograms;
  criterion: MFCriterion;
}) {
  const fAvg = fPrograms.length ? fPrograms.reduce((s, p) => s + p.scores[criterion], 0) / fPrograms.length : 0;
  const mAvg = mPrograms.length ? mPrograms.reduce((s, p) => s + p.scores[criterion], 0) / mPrograms.length : 0;
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-40 text-[10px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] w-5 font-bold flex-shrink-0" style={{ color: VIOLET }}>F</span>
          <div className="flex-1 h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: VIOLET + "20" }}>
            <div className="h-full rounded-sm" style={{ width: `${(fAvg / 5) * 100}%`, backgroundColor: VIOLET }} />
          </div>
          <span className="text-[10px] text-gray-500 w-7">{fAvg.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] w-5 font-bold flex-shrink-0" style={{ color: SKY }}>M</span>
          <div className="flex-1 h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: SKY + "20" }}>
            <div className="h-full rounded-sm" style={{ width: `${(mAvg / 5) * 100}%`, backgroundColor: SKY }} />
          </div>
          <span className="text-[10px] text-gray-500 w-7">{mAvg.toFixed(1)}</span>
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


// â"€â"€â"€ KPI tile map (4 metrics) â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const KPI_TILES = [
  { label: "Total Fellows",       clr: "#1E3A8A" },  // deep blue
  { label: "Mentor Engagements",  clr: "#C2410C" },  // orange
  { label: "Female Fellows",      clr: "#9D174D" },  // rose
  { label: "Avg Completion Rate", clr: "#134E4A" },  // teal
] as const;

const QUAL_THEMES: { text: string; area: MFQualArea; threshold: number }[] = [
  { text: "Expert Mentors",     area: "Mentorship Quality",        threshold: 4.3 },
  { text: "Highly Relevant",    area: "Applicability to Ventures", threshold: 4.3 },
  { text: "Well-Structured",    area: "Program Content",           threshold: 4.2 },
  { text: "Practical Approach", area: "Delivery Approach",         threshold: 4.2 },
  { text: "Strong Networks",    area: "Networking Opportunities",  threshold: 4.2 },
  { text: "Clear Guidance",     area: "Mentorship Quality",        threshold: 4.0 },
  { text: "Accessible Format",  area: "Delivery Approach",         threshold: 4.0 },
  { text: "Impactful Content",  area: "Program Content",           threshold: 4.0 },
  { text: "Career-Changing",    area: "Applicability to Ventures", threshold: 3.9 },
  { text: "Inspiring Peers",    area: "Networking Opportunities",  threshold: 3.9 },
  { text: "Good Value",         area: "Delivery Approach",         threshold: 3.9 },
  { text: "Transformative",     area: "Mentorship Quality",        threshold: 3.8 },
];
const YEARS_LIST = [2022, 2023, 2024, 2025, 2026];

type YearVal  = "All" | "2022" | "2023" | "2024" | "2025" | "2026";
type TypeVal  = "All" | "Mentorship" | "Fellowship" | "One-Year Fellowship" | "Advisory";
type GenderVal = "All" | "Female" | "Male";

export default function MentorshipPage() {
  const categories = ["Program Delivery & Performance", "Participant Profile", "Learning & Outcomes"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [yearFilter,  setYearFilter]  = useState<YearVal>("All");
  const [typeFilter,  setTypeFilter]  = useState<TypeVal>("All");
  const [genderView,  setGenderView]  = useState<GenderVal>("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const show = (category: string) => activeCategory === category;
  const filtersActive = (yearFilter !== "All" ? 1 : 0) + (typeFilter !== "All" ? 1 : 0) + (genderView !== "All" ? 1 : 0);

  const filtered = useMemo(() => mentorshipPrograms.filter(p => {
    if (yearFilter !== "All" && p.year !== Number(yearFilter)) return false;
    if (typeFilter === "Mentorship"          && (p.isFellowship || p.type === "Advisory Program")) return false;
    if (typeFilter === "Fellowship"          && (!p.isFellowship || p.isOneYearFellowship))        return false;
    if (typeFilter === "One-Year Fellowship" && !p.isOneYearFellowship)                            return false;
    if (typeFilter === "Advisory"            && p.type !== "Advisory Program")                     return false;
    if (genderView === "Female" && p.femaleFellows <= p.fellows / 2) return false;
    if (genderView === "Male"   && p.femaleFellows >  p.fellows / 2) return false;
    return true;
  }), [yearFilter, typeFilter, genderView]);

  const studentSum = filtered.reduce((s, p) => s + p.studentFellows, 0);
  const tot = {
    programs:    filtered.filter(p => !p.isFellowship).length,
    fellowships: filtered.filter(p => p.isFellowship).length,
    fellows:     filtered.reduce((s, p) => s + p.fellows, 0),
    mentors:     filtered.reduce((s, p) => s + p.mentors, 0),
    ventures:    filtered.reduce((s, p) => s + p.venturesRepresented, 0),
    grad1yr:     filtered.filter(p => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0),
    female:      filtered.reduce((s, p) => s + p.femaleFellows, 0),
    completion:  filtered.length
      ? Math.round(filtered.reduce((s, p) => s + p.completionRate, 0) / filtered.length) : 0,
  };
  const femalePct   = tot.fellows ? Math.round((tot.female  / tot.fellows) * 100) : 0;
  const studentPct  = tot.fellows ? Math.round((studentSum  / tot.fellows) * 100) : 0;
  const alumniTotal = tot.fellows - studentSum;
  const mentorRatio = tot.fellows ? (tot.mentors / tot.fellows).toFixed(2) : " - ";
  const avgHighSat  = filtered.length
    ? Math.round(filtered.reduce((s, p) => s + p.highSatisfactionPct, 0) / filtered.length) : 0;

  const byAge    = { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 };
  const byRegion = { "East Africa": 0, "West Africa": 0, "Southern Africa": 0, "North Africa & Horn": 0 };
  const byStage  = { Expose: 0, Build: 0, Scale: 0 };
  const bySocial = { "MCF Scholars": 0, PWD: 0, "Refugee-Displaced": 0 };
  filtered.forEach(p => {
    (Object.keys(p.byAge)    as (keyof typeof byAge)[]).forEach(k    => { byAge[k]    += p.byAge[k]; });
    (Object.keys(p.byRegion) as (keyof typeof byRegion)[]).forEach(k => { byRegion[k] += p.byRegion[k]; });
    (Object.keys(p.byStage)  as (keyof typeof byStage)[]).forEach(k  => { byStage[k]  += p.byStage[k]; });
    (Object.keys(p.bySocial) as (keyof typeof bySocial)[]).forEach(k => { bySocial[k] += p.bySocial[k]; });
  });
  const ageData    = Object.entries(byAge).map(([name, value]) => ({ name, value }));
  const regionData = Object.entries(byRegion).map(([name, value]) => ({ name, value }));
  const stageData  = Object.entries(byStage).map(([name, value]) => ({ name, value }));
  const socialData = Object.entries(bySocial).map(([name, value]) => ({ name, value }));
  const SOCIAL_COLORS = [ACCENT, EMERALD, AMBER];

  const fProgs = filtered.filter(p => p.femaleFellows >  p.fellows / 2);
  const mProgs = filtered.filter(p => p.femaleFellows <= p.fellows / 2);

  const highSatData = MF_CRITERIA.map(c => ({
    name: c,
    value: filtered.length
      ? Math.round(filtered.filter(p => p.scores[c] >= 3.8).length / filtered.length * 100) : 0,
  }));
  const qualAvgData = MF_QUAL_AREAS.map(a => ({
    name: a,
    value: filtered.length
      ? parseFloat((filtered.reduce((s, p) => s + p.qualScores[a], 0) / filtered.length).toFixed(1)) : 0,
  })).sort((a, b) => b.value - a.value);
  const themeData = QUAL_THEMES
    .map(t => ({ text: t.text, count: filtered.filter(p => p.qualScores[t.area] >= t.threshold).length }))
    .filter(t => t.count > 0).sort((a, b) => b.count - a.count);

  const MF_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const attendanceTrend = [...filtered]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(p => ({ Program: `${MF_MONTHS[p.month - 1]} '${String(p.year).slice(2)}`, Fellows: p.fellows }));

  let cum = 0;
  const growthData = [...filtered]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(p => { cum += p.fellows; return { Period: `${p.year}-${String(p.month).padStart(2, "0")}`, "Cumulative Fellows": cum }; });

  const genderTrend = YEARS_LIST.map(yr => {
    const yp = filtered.filter(p => p.year === yr);
    return { Year: String(yr), Female: yp.reduce((s, p) => s + p.femaleFellows, 0), Male: yp.reduce((s, p) => s + (p.fellows - p.femaleFellows), 0) };
  });
  const stageTrend = YEARS_LIST.map(yr => {
    const yp = filtered.filter(p => p.year === yr);
    return { Year: String(yr), Expose: yp.reduce((s, p) => s + p.byStage.Expose, 0), Build: yp.reduce((s, p) => s + p.byStage.Build, 0), Scale: yp.reduce((s, p) => s + p.byStage.Scale, 0) };
  });

  const topPrograms = [...filtered]
    .map(p => ({ ...p, avgScore: MF_CRITERIA.reduce((s, c) => s + p.scores[c], 0) / MF_CRITERIA.length }))
    .sort((a, b) => b.avgScore - a.avgScore).slice(0, 6);
  const testimonials = filtered.filter(p => p.testimonial).sort((a, b) => b.year - a.year).slice(0, 4);
  const heatmapRows = [...filtered]
    .map(p => ({ ...p, avgScore: MF_CRITERIA.reduce((s, c) => s + p.scores[c], 0) / MF_CRITERIA.length }))
    .sort((a, b) => b.avgScore - a.avgScore).slice(0, 10);

  const oneYearProgs = filtered.filter(p => p.isOneYearFellowship);
  const graduateTrend = YEARS_LIST.map(yr => ({
    Year: String(yr),
    Graduates: filtered.filter(p => p.isOneYearFellowship && p.year === yr).reduce((s, p) => s + p.graduateFellows, 0),
  }));
  const fellowshipMentorRatio = oneYearProgs.length && oneYearProgs.reduce((s, p) => s + p.fellows, 0) > 0
    ? (oneYearProgs.reduce((s, p) => s + p.mentors, 0) / oneYearProgs.reduce((s, p) => s + p.fellows, 0)).toFixed(2) : " - ";

  const isFiltered = yearFilter !== "All" || typeFilter !== "All" || genderView !== "All";

  const kpiValues = [
    { sub: "Across all programmes",   num: tot.fellows,    fmt: (n: number) => Math.round(n).toLocaleString() },
    { sub: "Mentor slots deployed",   num: tot.mentors,    fmt: (n: number) => String(Math.round(n)) },
    { sub: `${tot.female} people`,    num: femalePct,      fmt: (n: number) => `${Math.round(n)}%` },
    { sub: "Participants completing", num: tot.completion, fmt: (n: number) => `${Math.round(n)}%` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <PortalNav portal="hent" />

      {/* HEADER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(45,106,79,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(45,106,79,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Mentorship &amp; Fellowships</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>Fellowship tracks, fellows supported and completion outcomes</p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(190,228,214,0.5)" }}>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
                <span aria-hidden="true">·</span>
                <span>{mentorshipPrograms.length} programmes tracked</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* MAIN */}
      <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
      <div className="max-w-[1440px] mx-auto px-6 py-7">

        {/* KPI strip */}
        <HeaderStatsPanel
          title="Mentorship & Fellowship Metrics"
          cards={[
            { label: "Total Fellows", num: tot.fellows, displayFmt: (n) => Math.round(n).toLocaleString(), icon: Users, sub: `${Math.round((tot.fellows / 1000) * 100)}% of 1,000`, pace: true, paceA: tot.fellows, paceT: 1000, tip: "Participants in mentorship and fellowship programs." },
            { label: "Mentor Engagements", num: tot.mentors, displayFmt: (n) => String(Math.round(n)), icon: Award, sub: `${Math.round((tot.mentors / 500) * 100)}% of 500`, pace: true, paceA: tot.mentors, paceT: 500, tip: "Mentorship slots deployed across programs." },
            { label: "Female Fellows", num: femalePct, displayFmt: (n) => `${Math.round(n)}%`, icon: Star, sub: `${femalePct}% · ${tot.female}/${tot.fellows}`, pace: true, paceA: femalePct, paceT: 50, tip: "Percentage of female participation across all programs." },
            { label: "Avg Completion Rate", num: tot.completion, displayFmt: (n) => `${Math.round(n)}%`, icon: CheckCircle2, sub: `${tot.completion}% target`, pace: true, paceA: tot.completion, paceT: 85, tip: "Average completion rate across all programs." },
          ]}
        />


        {/* Category navigation */}
        <div style={{ marginBottom: 32, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flex: 1 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: 11,
                  fontWeight: activeCategory === cat ? 700 : 600,
                  padding: "8px 14px",
                  borderRadius: 20,
                  border: `1px solid ${activeCategory === cat ? BRAND : LIGHT_BORDER}`,
                  backgroundColor: activeCategory === cat ? BRAND : "white",
                  color: activeCategory === cat ? "white" : BRAND_DK,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: "relative" }}>
            <FilterButton
              activeFilterCount={filtersActive}
              isOpen={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            />
            <FilterDropdown
              isOpen={filtersOpen}
              onResetFilters={() => { setYearFilter("All"); setTypeFilter("All"); setGenderView("All"); }}
            >
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#0E4633", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  Year
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(["All", "2022", "2023", "2024", "2025", "2026"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setYearFilter(opt as YearVal)}
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
                  Type
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(["All", "Mentorship", "Fellowship", "One-Year Fellowship", "Advisory"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setTypeFilter(opt as TypeVal)}
                      style={{
                        fontSize: 10,
                        fontWeight: typeFilter === opt ? 700 : 500,
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: `1px solid ${typeFilter === opt ? "#2D6A4F" : "rgba(14,70,51,0.12)"}`,
                        backgroundColor: typeFilter === opt ? "#2D6A4F" : "white",
                        color: typeFilter === opt ? "white" : "#0E4633",
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
                      onClick={() => setGenderView(opt as GenderVal)}
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

        {/* SECTION 1: Program Delivery & Performance */}
        {show("Program Delivery & Performance") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Program Delivery & Performance
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Top-rated programs and satisfaction metrics</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Rating Distribution by Criterion"
                subtitle="Proportion of programmes per rating level">
                <div className="flex gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
                  {(["Very High","High","Moderate","Low"] as const).map(l => (
                    <span key={l} className="flex items-center gap-1">
                      <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RATING_COLORS[l] }} />{l}
                    </span>
                  ))}
                </div>
                {MF_CRITERIA.map(c => <RatingBar key={c} label={c} programs={filtered} criterion={c} />)}
              </Panel>

              <Panel title="Ratings by Gender of Participants"
                subtitle="Avg score per criterion - female vs male programs">
                <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><span style={{ color: VIOLET }}>F</span> Female-majority programmes</span>
                  <span className="flex items-center gap-1"><span style={{ color: SKY }}>M</span> Male-majority programmes</span>
                </div>
                {MF_CRITERIA.map(c => (
                  <GenderRatingBar key={c} label={c} fPrograms={fProgs} mPrograms={mProgs} criterion={c} />
                ))}
                <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                  {(["Expose","Build","Scale"] as const).map((stage, si) => {
                    const sp = filtered.filter(p =>
                      stage === "Expose" ? p.byStage.Expose > p.byStage.Build + p.byStage.Scale
                      : stage === "Build" ? p.byStage.Build >= p.byStage.Scale
                      : p.byStage.Scale > p.byStage.Build
                    );
                    const avg = sp.length
                      ? MF_CRITERIA.reduce((s, c) => s + sp.reduce((ss, p) => ss + p.scores[c], 0) / sp.length, 0) / MF_CRITERIA.length : 0;
                    return (
                      <div key={stage}>
                        <p className="text-[10px] text-gray-400">{stage} Stage</p>
                        <p className="text-sm font-bold" style={{ color: [SKY, PRIMARY, INDIGO][si] }}>{avg.toFixed(1)}</p>
                        <p className="text-[9px] text-gray-400">avg score</p>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* SECTION 2: Participant Profile */}
        {show("Participant Profile") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Participant Profile
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Demographics and participant distribution</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <ProfileCard label="Female Fellows"  value={tot.female}               pct={femalePct}        total={tot.fellows} color={VIOLET}  />
              <ProfileCard label="Male Fellows"    value={tot.fellows - tot.female} pct={100 - femalePct}  total={tot.fellows} color={SKY}     />
              <ProfileCard label="Student Fellows" value={studentSum}               pct={studentPct}       total={tot.fellows} color={EMERALD} />
              <ProfileCard label="Alumni Fellows"  value={alumniTotal}              pct={100 - studentPct} total={tot.fellows} color={AMBER}   />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Age Group Distribution"
                subtitle="Fellows by age bracket">
                <CustomDonut data={ageData} className="h-36" />
                <div className="mt-2 space-y-0.5">
                  {ageData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: GREEN_RAMP[i % GREEN_RAMP.length] }} />{d.name}
                      </span>
                      <span className="font-medium" style={{ color: GREEN_RAMP[i % GREEN_RAMP.length] }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Geographic Region"
                subtitle="Fellows by region of origin">
                <CustomDonut data={regionData} className="h-36" />
                <div className="mt-2 space-y-0.5">
                  {regionData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5 text-gray-500 truncate min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: GREEN_RAMP[i % GREEN_RAMP.length] }} />
                        <span className="truncate">{d.name}</span>
                      </span>
                      <span className="font-medium ml-1 flex-shrink-0" style={{ color: GREEN_RAMP[i % GREEN_RAMP.length] }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Venture Stage Distribution"
                subtitle="Fellows by development stage">
                <CustomDonut data={stageData} className="h-36" />
                <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-gray-100 text-center">
                  {stageData.map((d, i) => (
                    <div key={d.name}>
                      <p className="text-sm font-black" style={{ color: GREEN_RAMP[i % GREEN_RAMP.length] }}>{d.value}</p>
                      <p className="text-[9px] text-gray-400">{d.name}</p>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Social Inclusion Groups"
                subtitle="MCF scholars, PWD, refugee-displaced">
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
                            style={{ width: `${tot.fellows > 0 ? (d.value / tot.fellows) * 100 : 0}%`, backgroundColor: col }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {tot.fellows > 0 ? Math.round((d.value / tot.fellows) * 100) : 0}% of fellows
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* SECTION 3: Learning & Outcomes */}
        {show("Learning & Outcomes") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Learning & Outcomes
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Engagement trends, satisfaction, and impact metrics</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Satisfaction by Criterion"
                subtitle="Proportion rated High or Very High">
                <div className="space-y-3">
                  {highSatData.map(d => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium">{d.name}</span>
                        <span className="font-bold" style={{ color: d.value >= 80 ? EMERALD : d.value >= 60 ? PRIMARY : AMBER }}>{d.value}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
                        <div className="h-full transition-all"
                          style={{ width: `${d.value}%`, backgroundColor: d.value >= 80 ? EMERALD : d.value >= 60 ? PRIMARY : AMBER }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold" style={{ color: ACCENT }}>{avgHighSat}%</p>
                    <p className="text-[10px] text-gray-400">Avg high satisfaction</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold" style={{ color: EMERALD }}>{filtered.filter(p => p.highSatisfactionPct >= 85).length}</p>
                    <p className="text-[10px] text-gray-400">Programmes ≥85%</p>
                  </div>
                </div>
              </Panel>

              <Panel title="Gender Participation Trend"
                subtitle="Female vs male fellows by year">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={genderTrend} barCategoryGap="30%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: LIGHT_BORDER }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Female" fill={VIOLET} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Male"   fill={SKY}    radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Venture Stage Distribution"
                subtitle="Expose, Build, Scale by cohort year">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageTrend} barCategoryGap="30%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: LIGHT_BORDER }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Expose" fill={SKY}    radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Build"  fill={PRIMARY} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Scale"  fill={INDIGO}  radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Cumulative Fellow Growth"
                subtitle="Running total expansion over time">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={growthData} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="Period" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="Cumulative Fellows" stroke={EMERALD} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Cumulative fellows" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Completion Rate by Program"
                subtitle="Percentage of enrolled fellows completing">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[...filtered].sort((a, b) => a.date.localeCompare(b.date)).map(p => ({
                      Programme: `${MF_MONTHS[p.month - 1]} '${String(p.year).slice(2)}`,
                      "Completion %": p.completionRate,
                    }))}
                    barCategoryGap="30%"
                    margin={{ top: 6, right: 10, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} vertical={false} />
                    <XAxis dataKey="Programme" tick={{ fontSize: 11, fill: "#6B7280" }}
                      axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: LIGHT_BORDER }} />
                    <Bar dataKey="Completion %" fill={EMERALD} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <PortalFooter portal="hent" synced="18 Jun 2026, EAT" />

      </div>
      </div>
    </div>
  );
}
