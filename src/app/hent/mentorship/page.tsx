"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Star, Award, Users, Target } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  mentorshipPrograms, MF_CRITERIA, MF_QUAL_AREAS,
  type MFCriterion, type MFQualArea,
} from "@/data/mentorships";

// â”€â”€â”€ palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY    = "#002147"; // footer bg + testimonial border only
const ACCENT  = "#7C3AED"; // page identity  -  mentorship/fellowship = purple
const SKY     = "#0EA5E9";
const VIOLET  = "#8B5CF6";
const TEAL    = "#14B8A6";
const EMERALD = "#10B981";
const INDIGO  = "#4338CA";
const AMBER   = "#F59E0B";
const ROSE    = "#F43F5E";
const PRIMARY = "#2F6FED";

const BAR_COLORS = [PRIMARY, TEAL, ACCENT, AMBER, EMERALD, ROSE, INDIGO, SKY];

const RATING_COLORS: Record<string, string> = {
  "Very High": EMERALD, High: PRIMARY, Moderate: AMBER, Low: ROSE,
};
const RANK_BG = [AMBER, "#9CA3AF", "#D97706"];

function ratingLabel(s: number): string {
  return s >= 4.5 ? "Very High" : s >= 3.8 ? "High" : s >= 3.0 ? "Moderate" : "Low";
}
function heatBg(s: number): string {
  if (s >= 4.5) return EMERALD;
  if (s >= 4.0) return PRIMARY;
  if (s >= 3.5) return AMBER;
  return ROSE;
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

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#D17A86" }} />
      <div>
        <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: NAVY, letterSpacing: "0.01em" }}>{title}</h2>
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
    <div ref={cardRef} className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5"
        style={{
          backgroundColor: "#0C447C",
          borderBottomColor: "#0C447C",
        }}>
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0"
          style={{ backgroundColor: "#D17A86" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
        </div>
        <button onClick={handleDownload} title="Download chart"
          style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}>
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
    <div style={{ backgroundColor: NAVY, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#B5D4F4", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1 }}>{displayFmt(animated)}</p>
      <p style={{ fontSize: 9.5, color: "rgba(181,212,244,0.7)", marginTop: 4 }}>{sub}</p>
      <div style={{ marginTop: 10, height: 3, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: "100%", backgroundColor: clr, borderRadius: 999 }} />
      </div>
    </div>
  );
}

// â”€â”€â”€ KPI tile map (4 metrics) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MentorshipPage() {
  const [yearFilter,  setYearFilter]  = useState<YearVal>("All");
  const [typeFilter,  setTypeFilter]  = useState<TypeVal>("All");
  const [genderView,  setGenderView]  = useState<GenderVal>("All");

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

  const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* â”€â”€ HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,33,71,0.62), rgba(0,33,71,0.28))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Mentorship &amp; Fellowships</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Capacity-building &amp; fellowship tracks · 2022–2026 · {mentorshipPrograms.length} programmes tracked</p>
          </div>
        </div>
      </header>

      {/* â”€â”€ MAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {KPI_TILES.map(({ label, clr }, i) => (
            <KpiTile key={label} label={label} num={kpiValues[i].num}
              displayFmt={kpiValues[i].fmt} sub={kpiValues[i].sub} clr={clr} />
          ))}
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded shadow-sm border border-gray-100 px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Year</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value as YearVal)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                <option value="All">All Years</option>
                {(["2022","2023","2024","2025","2026"] as const).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as TypeVal)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm min-w-[160px]">
                <option value="All">All Types</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Fellowship">Fellowship</option>
                <option value="One-Year Fellowship">One-Year Fellowship</option>
                <option value="Advisory">Advisory Program</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Gender</label>
              <select value={genderView} onChange={e => setGenderView(e.target.value as GenderVal)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                <option value="All">All Genders</option>
                <option value="Female">Female-majority</option>
                <option value="Male">Male-majority</option>
              </select>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <span className="text-[10px] text-gray-400">
                {filtered.length} of {mentorshipPrograms.length} programmes
              </span>
              {isFiltered && (
                <button onClick={() => { setYearFilter("All"); setTypeFilter("All"); setGenderView("All"); }}
                  className="text-[10px] font-medium underline underline-offset-2 transition-colors"
                  style={{ color: ACCENT }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* S1: VENTURE RATINGS */}
        <section>
          <SecHeader title="Venture Ratings of Mentorship &amp; Fellowship Support"
            sub={`${filtered.length} programmes rated across Quality, Usefulness, Accessibility, Relevance`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High  ·  High  ·  Moderate  ·  Low  -  proportion of programmes per level"
              accent={ACCENT}>
              <div className="flex gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
                {(["Very High","High","Moderate","Low"] as const).map(l => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RATING_COLORS[l] }} />{l}
                  </span>
                ))}
              </div>
              {MF_CRITERIA.map(c => <RatingBar key={c} label={c} programs={filtered} criterion={c} />)}
            </ChartCard>

            <ChartCard title="Ratings by Gender of Participants"
              sub="Avg score per criterion  -  female-majority vs male-majority programmes"
              accent={VIOLET}>
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
            </ChartCard>
          </div>
        </section>

        {/* S2: SATISFACTION */}
        <section>
          <SecHeader title="Fellow Satisfaction &amp; Qualitative Feedback"
            sub={`${avgHighSat}% average high/very-high satisfaction across filtered programmes`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="% Rating High or Very High by Criterion"
              sub="Proportion of programmes where criterion avg score â‰¥ 3.8 (High)"
              accent={EMERALD}>
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
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold" style={{ color: ACCENT }}>{avgHighSat}%</p>
                  <p className="text-[10px] text-gray-400">Avg high satisfaction</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: EMERALD }}>{filtered.filter(p => p.highSatisfactionPct >= 85).length}</p>
                  <p className="text-[10px] text-gray-400">Programmes â‰¥85%</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: AMBER }}>{filtered.filter(p => p.highSatisfactionPct < 70).length}</p>
                  <p className="text-[10px] text-gray-400">Programmes &lt;70%</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Qualitative Feedback by Area"
              sub="Average programme score across five qualitative feedback dimensions (1 - 5)"
              accent={SKY}>
              <ColorBarList data={qualAvgData} colors={BAR_COLORS} />
              <div className="mt-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Feedback Themes</p>
                <div className="flex flex-wrap gap-1.5">
                  {themeData.map(t => {
                    const big = t.count >= 12, med = t.count >= 7;
                    return (
                      <span key={t.text}
                        className={`rounded-full border font-medium transition-colors ${big ? "text-xs px-3 py-1.5" : med ? "text-[11px] px-2.5 py-1" : "text-[10px] px-2 py-0.5"}`}
                        style={big
                          ? { borderColor: ACCENT + "60", backgroundColor: ACCENT + "10", color: ACCENT }
                          : med
                          ? { borderColor: ACCENT + "40", backgroundColor: ACCENT + "08", color: ACCENT + "CC" }
                          : { borderColor: "#E5E7EB", backgroundColor: "#F9FAFB", color: "#9CA3AF" }}>
                        {t.text} <span className="opacity-60 ml-0.5">{t.count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* S3: DEMOGRAPHICS */}
        <section>
          <SecHeader title="Participant Demographics"
            sub="Attendance breakdown by gender, age, stage, region, and social inclusion" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Fellows"  value={tot.female}               pct={femalePct}        total={tot.fellows} color={VIOLET}  />
            <ProfileCard label="Male Fellows"    value={tot.fellows - tot.female} pct={100 - femalePct}  total={tot.fellows} color={SKY}     />
            <ProfileCard label="Student Fellows" value={studentSum}               pct={studentPct}       total={tot.fellows} color={EMERALD} />
            <ProfileCard label="Alumni Fellows"  value={alumniTotal}              pct={100 - studentPct} total={tot.fellows} color={AMBER}   />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ChartCard title="Age Group Distribution" sub="Fellows by age bracket" accent={SKY}>
              <CustomDonut data={ageData} colors={[ACCENT, "#C2410C", "#059669", ROSE]} className="h-36" valueFormatter={(v) => `${v}`} />
              <div className="mt-2 space-y-0.5">
                {ageData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: [ACCENT,"#C2410C","#059669",ROSE][i] }} />{d.name}
                    </span>
                    <span className="font-medium" style={{ color: [ACCENT,"#C2410C","#059669",ROSE][i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Geographic Region" sub="Fellows by region of origin" accent={EMERALD}>
              <CustomDonut data={regionData} colors={[EMERALD, TEAL, "#C2410C", VIOLET]} className="h-36" valueFormatter={(v) => `${v}`} />
              <div className="mt-2 space-y-0.5">
                {regionData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-gray-500 truncate min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: [EMERALD,TEAL,"#C2410C",VIOLET][i] }} />
                      <span className="truncate">{d.name}</span>
                    </span>
                    <span className="font-medium ml-1 flex-shrink-0" style={{ color: [EMERALD,TEAL,"#C2410C",VIOLET][i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Venture Stage" sub="Fellows by venture development stage" accent={ACCENT}>
              <CustomDonut data={stageData} colors={[SKY, "#C2410C", VIOLET]} className="h-36" valueFormatter={(v) => `${v}`} />
              <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-gray-100 text-center">
                {stageData.map((d, i) => (
                  <div key={d.name}>
                    <p className="text-sm font-black" style={{ color: [SKY,"#C2410C",VIOLET][i] }}>{d.value}</p>
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
                          style={{ width: `${tot.fellows > 0 ? (d.value / tot.fellows) * 100 : 0}%`, backgroundColor: col }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {tot.fellows > 0 ? Math.round((d.value / tot.fellows) * 100) : 0}% of fellows
                      </p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* S4: HEATMAP */}
        <section>
          <SecHeader title="Satisfaction Heatmap"
            sub="Score per criterion across top-rated programmes" />
          <ChartCard title="Programme Ã— Criterion Satisfaction Matrix"
            sub="Top 10 programmes by avg score  ·  Green â‰¥4.5  ·  Blue â‰¥4.0  ·  Amber â‰¥3.5  ·  Red <3.5"
            accent={TEAL}>
            {heatmapRows.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No programmes match the current filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-500 font-medium pb-2 pr-4 min-w-[180px]">Programme</th>
                      {MF_CRITERIA.map(c => (
                        <th key={c} className="text-center text-gray-500 font-medium pb-2 px-1 min-w-[90px] leading-tight">{c}</th>
                      ))}
                      <th className="text-center text-gray-500 font-medium pb-2 px-1 min-w-[70px]">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapRows.map(p => (
                      <tr key={p.id} className="border-t border-gray-50">
                        <td className="py-1.5 pr-4 text-gray-700 leading-tight">
                          {p.name.length > 28 ? p.name.slice(0, 28) + "â€¦" : p.name}
                          <span className="text-[9px] text-gray-400 ml-1">({p.year})</span>
                        </td>
                        {MF_CRITERIA.map(c => (
                          <td key={c} className="py-1.5 px-1 text-center">
                            <span className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-bold tabular-nums"
                              style={{ backgroundColor: heatBg(p.scores[c]) }}>
                              {p.scores[c].toFixed(1)}
                            </span>
                          </td>
                        ))}
                        <td className="py-1.5 px-1 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-bold tabular-nums"
                            style={{ backgroundColor: INDIGO }}>
                            {p.avgScore.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500 flex-wrap">
                  {[[`Very High`, EMERALD,"â‰¥4.5"],[`High`,PRIMARY,"â‰¥4.0"],[`Moderate`,AMBER,"â‰¥3.5"],[`Low`,ROSE,"<3.5"]].map(([l, c, r]) => (
                    <span key={l} className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c }} />{l} ({r})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </section>

        {/* S5: TRENDS */}
        <section>
          <SecHeader title="Participation &amp; Engagement Trends"
            sub="Fellow counts, gender breakdown, venture-stage distribution, and cumulative growth" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ChartCard title="Fellows per Programme"
              sub="Attendance per programme in chronological order"
              accent={SKY}>
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={attendanceTrend.slice(0, 14)} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Program" tick={{ fontSize: 9, fill: "#9CA3AF" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} fellows`, "Fellows"]} />
                  <Bar dataKey="Fellows" fill={SKY} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Participation by Gender per Year"
              sub="Female vs male fellows  -  yearly comparison"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Venture-Stage Distribution per Year"
              sub="Expose  ·  Build  ·  Scale fellow counts by cohort year"
              accent={INDIGO}>
              <div className="flex gap-4 text-[11px] text-gray-500 mb-3">
                {(["Expose","Build","Scale"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: [SKY, PRIMARY, INDIGO][i] }} />{l}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={stageTrend} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="Expose" fill={SKY}    radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Build"  fill={PRIMARY} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Scale"  fill={INDIGO}  radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Cumulative Fellow Growth"
              sub="Running total of fellows  -  shows programme reach expansion over time"
              accent={EMERALD}>
              <ResponsiveContainer width="100%" height={176}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="cumGradMF" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={EMERALD} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={EMERALD} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Period" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} total fellows`, "Cumulative Fellows"]} />
                  <Area type="monotone" dataKey="Cumulative Fellows" stroke={EMERALD} strokeWidth={2} fill="url(#cumGradMF)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>

        {/* S6: TOP + TESTIMONIALS */}
        <section>
          <SecHeader title="Top Rated Programmes &amp; Success Stories"
            sub="Ranked by average fellow feedback  -  voices from the field" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Top Rated Mentorship &amp; Fellowship Programmes"
              sub="Ranked by average score across all four rating criteria"
              accent={AMBER}>
              <div className="space-y-3">
                {topPrograms.map((p, i) => (
                  <div key={p.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? ACCENT }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <Stars score={p.avgScore} />
                        <span className="text-[10px] text-gray-400">{p.type}</span>
                        <span className="text-[10px] text-gray-400">{p.fellows} fellows</span>
                        <span className="text-[10px] text-gray-400">{p.year}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap mt-1.5">
                        {MF_CRITERIA.map(c => (
                          <span key={c} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: RATING_COLORS[ratingLabel(p.scores[c])] + "22", color: RATING_COLORS[ratingLabel(p.scores[c])] }}>
                            {c.split(" ")[0]}: {p.scores[c].toFixed(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <div className="space-y-4">
              {testimonials.length > 0
                ? testimonials.map(p => {
                  const t = p.testimonial!;
                  return (
                    <div key={p.id} className="bg-white rounded shadow-sm p-4 border-l-4 flex gap-3"
                      style={{ borderLeftColor: ACCENT }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                        style={{ backgroundColor: ACCENT }}>
                        {t.author.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-600 italic leading-relaxed">"{t.quote}"</p>
                        <div className="mt-2">
                          <p className="text-xs font-bold text-gray-900">{t.author}</p>
                          <p className="text-[10px] text-gray-400">{t.role}{t.venture ? `  ·  ${t.venture}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: ACCENT + "15", color: ACCENT }}>{p.type}</span>
                          <span className="text-[9px] text-gray-400">{p.year}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
                : (
                  <div className="bg-white rounded shadow-sm p-8 text-center">
                    <Award size={28} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No testimonials available for the current filter selection.</p>
                  </div>
                )
              }
            </div>
          </div>
        </section>

        {/* S7: FELLOWSHIP OUTCOMES */}
        <section>
          <SecHeader title="Fellowship Outcomes &amp; Impact"
            sub="One-year fellowship graduate participation, mentor ratios, and partnership outcomes" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Graduates in One-Year Fellowship by Year"
              sub="Programme graduates enrolled as fellows in the flagship one-year track"
              accent={EMERALD}>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={graduateTrend} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} graduates`, "Graduates"]} />
                  <Bar dataKey="Graduates" fill={EMERALD} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-4 gap-3 pt-3 border-t border-gray-100 text-center">
                {[
                  { value: String(tot.grad1yr),        color: ACCENT,   label: "Total graduates enrolled"  },
                  { value: String(oneYearProgs.length), color: EMERALD,  label: "One-year cohorts"          },
                  { value: fellowshipMentorRatio,       color: VIOLET,   label: "Mentor-to-fellow ratio"    },
                  { value: `${oneYearProgs.length > 0 ? Math.round(oneYearProgs.reduce((s,p)=>s+p.completionRate,0)/oneYearProgs.length) : 0}%`,
                    color: AMBER, label: "1-yr completion rate" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Mentor-to-Fellow Engagement Analytics"
              sub="Mentorship intensity and programme engagement metrics across filtered programmes"
              accent={ACCENT}>
              <div className="space-y-4">
                {[
                  { icon: Users,  label: "Total Mentor Engagements",  value: String(tot.mentors),           sub: "Mentor slots across filtered programmes",      color: PRIMARY  },
                  { icon: Target, label: "Mentor-to-Fellow Ratio",     value: mentorRatio,                   sub: "Mentors per fellow (lower = more intensive)",  color: ACCENT   },
                  { icon: Award,  label: "Avg High Satisfaction",      value: `${avgHighSat}%`,              sub: "Fellows rating quality/usefulness as High+",   color: EMERALD  },
                  { icon: Target, label: "Venture Participation",      value: tot.ventures.toLocaleString(), sub: "Ventures represented across programmes",       color: TEAL     },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="flex items-center gap-4 p-3 rounded border-l-2"
                      style={{ backgroundColor: m.color + "0E", borderColor: m.color }}>
                      <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: m.color + "18" }}>
                        <Icon size={16} style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: m.color + "AA" }}>{m.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{m.sub}</p>
                      </div>
                      <p className="text-xl font-bold tabular-nums flex-shrink-0" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* S8: COMPLETION */}
        <section>
          <SecHeader title="Participation &amp; Completion Analytics"
            sub="Engagement and completion rates across all mentorship and fellowship programmes" />
          <ChartCard title="Completion Rate by Programme"
            sub="Percentage of enrolled fellows who completed each programme"
            accent={EMERALD}>
            <ResponsiveContainer width="100%" height={208}>
              <BarChart
                data={[...filtered].sort((a, b) => a.date.localeCompare(b.date)).map(p => ({
                  Programme: `${MF_MONTHS[p.month - 1]} '${String(p.year).slice(2)}`,
                  "Completion %": p.completionRate,
                }))}
                barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="Programme" tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Completion"]} />
                <Bar dataKey="Completion %" fill={EMERALD} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-center">
              {[
                { value: `${tot.completion}%`, color: INDIGO,  label: "Avg completion rate"       },
                { value: String(filtered.filter(p => p.completionRate >= 92).length), color: EMERALD, label: "Programmes â‰¥92%" },
                { value: String(filtered.filter(p => p.completionRate < 85).length),  color: AMBER,   label: "Programmes <85%" },
                { value: String(filtered.filter(p => p.highSatisfactionPct >= 85).length), color: ACCENT, label: "High satisfaction (â‰¥85%)" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* FOOTER */}
        <div className="rounded overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(tot.programs + tot.fellowships), label: "Programmes Delivered", clr: "#6D28D9" },
              { value: tot.fellows.toLocaleString(),            label: "Total Fellows",        clr: "#1E3A8A" },
              { value: `${femalePct}%`,                         label: "Female Participation", clr: "#9D174D" },
              { value: `${tot.completion}%`,                    label: "Avg Completion Rate",  clr: "#059669" },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-6 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}` }}>
                <p className="text-2xl font-black tabular-nums text-white">{tile.value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">HENT  ·  Mentorship &amp; Fellowships  ·  2022 - 2026</p>
            <p className="text-[10px] text-gray-400">Last updated: 01 Jun 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
