"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award, Briefcase, Download, FileText,
  Globe, Handshake, Star, Target, TrendingUp,
  Zap,
} from "lucide-react";

import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/missionStudents";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { fieldVisits } from "@/data/fieldVisits";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures } from "@/data/ventures";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Legend, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

// â"€â"€â"€ Palette â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const VIOLET = "#7C3AED";
const TEAL   = "#0D9488";
const GREEN  = "#10B981";
const AMBER  = "#F59E0B";
const SKY    = "#0EA5E9";
const ROSE   = "#F43F5E";
const INDIGO = "#4338CA";
const ORANGE = "#EA580C";
const NAVY   = "#002147";
const EXEC_BG = "#f8fafc";

// â"€â"€â"€ Helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function fmt(n: number) { return Math.round(n).toLocaleString(); }
function pct(n: number) { return `${Math.round(n)}%`; }

function useCountUp(target: number, duration = 800): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const id = requestAnimationFrame(function tick(now) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    });
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

// â"€â"€â"€ Contextual filter components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

// Pill group  -  sits in coloured card headers (dark background)
function PillGroup<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full gap-px p-0.5" style={{ backgroundColor: "rgba(0,0,0,0.18)" }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[9px] font-bold px-2.5 py-[3px] rounded-full transition-all whitespace-nowrap leading-none"
            style={{
              backgroundColor: active ? "rgba(255,255,255,0.95)" : "transparent",
              color: active ? "#111827" : "rgba(255,255,255,0.72)",
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// Dropdown  -  compact select for coloured card headers (dark background)
function HeaderDropdown<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}
      className="text-[9px] font-bold rounded border appearance-none cursor-pointer focus:outline-none pl-2 pr-5 py-[5px]"
      style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        color: "white",
        borderColor: "rgba(255,255,255,0.25)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-opacity='0.75' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 6px center",
      }}>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ color: "#111827", backgroundColor: "white" }}>{o.label}</option>
      ))}
    </select>
  );
}

// Segmented tab  -  sits inside white card bodies (light background)
function SegTab<T extends string>({ options, value, onChange, accent }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  accent: string;
}) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[10px] font-semibold px-3 py-1.5 transition-all whitespace-nowrap border-r border-gray-200 last:border-0"
            style={{ backgroundColor: active ? accent : "white", color: active ? "white" : "#6B7280" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// â"€â"€â"€ UI atoms â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function SecHeader({ title, sub, accent = VIOLET }: { title: string; sub?: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: accent }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = VIOLET, children, filter }: {
  title: string; sub?: string; accent?: string;
  children: React.ReactNode; filter?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 flex items-start justify-between gap-3" style={{ backgroundColor: accent }}>
        <div className="flex items-start gap-2.5">
          <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
            {sub && <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
          </div>
        </div>
        {filter && <div className="flex-shrink-0">{filter}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string; sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded-lg border px-3 py-3 text-center transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-[1.15rem] font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.58)" }}>{sub}</p>
    </div>
  );
}

function InsightCard({ label, value, sub, note, color, icon: Icon }: {
  label: string; value: string | number; sub?: string; note?: string;
  color: string; icon?: typeof TrendingUp;
}) {
  return (
    <div className="rounded-lg border p-4 shadow-sm transition-transform hover:scale-[1.01]"
      style={{ backgroundColor: color, borderColor: color }}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-none"
          style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
            <Icon size={13} style={{ color: "rgba(255,255,255,0.9)" }} />
          </div>
        )}
      </div>
      <p className="text-2xl font-black tabular-nums leading-none text-white">{value}</p>
      {sub  && <p className="text-[9px] mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.72)" }}>{sub}</p>}
      {note && <p className="text-[9px] mt-2 pt-2 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.52)", borderTop: "1px solid rgba(255,255,255,0.16)" }}>{note}</p>}
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />{label}
      </span>
      <span className="font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{fmt(value)}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: color + "22" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function CustomDonut({ data, colors, label, valueFormatter = String, size = 160 }: {
  data: { name: string; value: number }[];
  colors: string[]; label?: string; valueFormatter?: (v: number) => string; size?: number;
}) {
  const [hov, setHov] = useState<{ name: string; value: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const CX = size / 2, CY = size / 2, OR = size * 0.43, IR = size * 0.265;
  let theta = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const t0 = theta; const t1 = theta + sweep; theta = t1;
    const lg = sweep > Math.PI ? 1 : 0;
    const path = [
      `M ${CX + OR * Math.cos(t0)} ${CY + OR * Math.sin(t0)}`,
      `A ${OR} ${OR} 0 ${lg} 1 ${CX + OR * Math.cos(t1)} ${CY + OR * Math.sin(t1)}`,
      `L ${CX + IR * Math.cos(t1)} ${CY + IR * Math.sin(t1)}`,
      `A ${IR} ${IR} 0 ${lg} 0 ${CX + IR * Math.cos(t0)} ${CY + IR * Math.sin(t0)}`, "Z",
    ].join(" ");
    return { path, fill: colors[i % colors.length], name: d.name, value: d.value };
  });
  return (
    <div className="relative flex items-center justify-center w-full h-full"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", height: "100%" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth="2"
            style={{ cursor: "pointer", opacity: hov && hov.name !== s.name ? 0.4 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={() => setHov({ name: s.name, value: s.value, color: s.fill })}
            onMouseLeave={() => setHov(null)} />
        ))}
        {label && (
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#111827" fontSize={size * 0.125} fontWeight="900" fontFamily="Inter, sans-serif">
            {label}
          </text>
        )}
      </svg>
      {hov && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hov.color, left: pos.x, top: pos.y - 34, transform: "translateX(-50%)" }}>
          {hov.name}: {valueFormatter(hov.value)}
        </div>
      )}
    </div>
  );
}

// â"€â"€â"€ Constants â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

const HACK_CATS = ["AI/Technology", "Health", "Business", "Sustainability", "Other"] as const;
type HackCat = typeof HACK_CATS[number] | "all";

const SECTORS_HEMP = ["Hospital", "NGO", "Government", "MedTech", "Pharma", "Research"] as const;

type PeriodVal = "all" | "q1" | "q2" | "q3" | "q4" | "h1" | "h2";

const PERIOD_MONTHS: Record<PeriodVal, number[]> = {
  all: [],
  q1:  [1, 2, 3],
  q2:  [4, 5, 6],
  q3:  [7, 8, 9],
  q4:  [10, 11, 12],
  h1:  [1, 2, 3, 4, 5, 6],
  h2:  [7, 8, 9, 10, 11, 12],
};

const MONTH_ABBR: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4,  May: 5,  Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

const PERIOD_LABELS: Record<PeriodVal, string> = {
  all: "Annual",
  q1: "Q1 - Jan to Mar", q2: "Q2 - Apr to Jun",
  q3: "Q3 - Jul to Sep", q4: "Q4 - Oct to Dec",
  h1: "H1 - Jan to Jun", h2: "H2 - Jul to Dec",
};

// â"€â"€â"€ Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function ImpactDashboard() {
  // â"€â"€ Filter state â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const [yearFilter,   setYearFilter]   = useState<YearVal>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodVal>("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "female" | "male">("all");
  const [catFilter,    setCatFilter]    = useState<HackCat>("all");
  const [streamFilter, setStreamFilter] = useState<"all" | "hemp" | "hent">("all");
  // Analytical drill-down states
  const [growthView,    setGrowthView]    = useState<"participation" | "quality">("participation");
  const [pipelineSector, setPipelineSector] = useState("all");

  // â"€â"€ Filtered data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const D = useMemo(() => {
    const yr    = yearFilter;
    const months = PERIOD_MONTHS[periodFilter]; // empty array = no month filter

    const inPeriod = (month: number) => months.length === 0 || months.includes(month);
    const inPeriodStr = (monthStr: string) => {
      if (months.length === 0) return true;
      const m = MONTH_ABBR[monthStr];
      return m !== undefined && months.includes(m);
    };

    const hx  = healthXSessions.filter((h) => (yr === "all" || h.year === yr) && inPeriodStr(h.month));
    const int = internships.filter((i) => yr === "all" || i.year === yr);          // year-level only
    const ms  = missionStudents.filter((s) => yr === "all" || s.cohort === yr);    // cohort-level only
    const hak = hackathons.filter((h) => yr === "all" || h.year === yr);           // year-level only
    const mc  = masterclasses.filter((m) => (yr === "all" || m.year === yr) && inPeriod(m.month));
    const fv  = fieldVisits.filter((v) => (yr === "all" || v.year === yr) && inPeriod(v.month));
    const mf  = mentorshipPrograms.filter((p) => (yr === "all" || p.year === yr) && inPeriod(p.month));
    const vc  = ventures.filter((v) => yr === "all" || v.cohort === yr);

    // HEMP
    const hxPart      = hx.reduce((s, h) => s + h.participants, 0);
    const hxFem       = hx.reduce((s, h) => s + h.femalePart, 0);
    const hxPartners  = hx.reduce((s, h) => s + h.partnerships, 0);
    const hxAvgCompl  = Math.round(avg(hx.map((h) => h.completionRate)));
    const hxAvgSat    = parseFloat(avg(hx.map((h) => avg(Object.values(h.scores)))).toFixed(1));

    const intStudents  = int.reduce((s, i) => s + i.students, 0);
    const intFem       = int.reduce((s, i) => s + i.femaleStudents, 0);
    const intConv      = int.reduce((s, i) => s + i.employmentConversions, 0);
    const intAvgSat    = parseFloat(avg(int.map((i) => i.satisfactionScore)).toFixed(1));
    const intPlace     = int.reduce((s, i) => s + i.placementsAfterInternship, 0);

    const msTotal     = ms.length;
    const msFem       = ms.filter((s) => s.gender === "Female").length;
    const msCompleted = ms.filter((s) => s.status === "Completed");
    const msEmployed  = msCompleted.filter((s) => s.employment === "Employed" || s.employment === "Entrepreneur");
    const msVentures  = ms.filter((s) => s.ventureCreated).length;
    const msCompPct   = msTotal ? Math.round((msCompleted.length / msTotal) * 100) : 0;

    // HENT
    const hakPart    = hak.reduce((s, h) => s + h.participants, 0);
    const hakFem     = hak.reduce((s, h) => s + h.femaleCount, 0);
    const hakProj    = hak.reduce((s, h) => s + h.projects, 0);
    const hakStart   = hak.reduce((s, h) => s + h.startupsCreated, 0);
    const hakPartners = hak.reduce((s, h) => s + h.partnerships, 0);

    const mcAtt      = mc.reduce((s, m) => s + m.attendees, 0);
    const mcFem      = mc.reduce((s, m) => s + m.femaleAttendees, 0);
    const mcAvgCompl = Math.round(avg(mc.map((m) => m.completionRate)));
    const mcAvgSat   = parseFloat(avg(mc.map((m) => avg(Object.values(m.scores)))).toFixed(1));

    const fvPart     = fv.reduce((s, v) => s + v.participants, 0);
    const fvFem      = fv.reduce((s, v) => s + v.femaleParticipants, 0);
    const fvAvgCompl = Math.round(avg(fv.map((v) => v.completionRate)));
    const fvAvgSat   = parseFloat(avg(fv.map((v) => avg(Object.values(v.scores)))).toFixed(1));
    const fvPartners = fv.reduce((s, v) => s + v.partnerships, 0);

    const mfFel      = mf.reduce((s, p) => s + p.fellows, 0);
    const mfFem      = mf.reduce((s, p) => s + p.femaleFellows, 0);
    const mfAvgCompl = Math.round(avg(mf.map((p) => p.completionRate)));
    const mfAvgSat   = parseFloat(avg(mf.map((p) => avg(Object.values(p.scores)))).toFixed(1));
    const mfGrad     = mf.filter((p) => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0);

    // Unified
    const totalFem  = hxFem + intFem + msFem + hakFem + mcFem + fvFem + mfFem;
    const hempTotal = hxPart + intStudents + msTotal;
    const hentTotal = hakPart + mcAtt + fvPart + mfFel;
    const grandTotal = hempTotal + hentTotal;
    const femalePct = grandTotal ? Math.round((totalFem / grandTotal) * 100) : 0;

    const totalPartners = hxPartners + hakPartners + fvPartners;
    const venturesTotal = vc.length + msVentures + hakStart;
    const employmentOut = intConv + msEmployed.length;
    const avgSat        = parseFloat(avg([hxAvgSat, intAvgSat, mcAvgSat, fvAvgSat, mfAvgSat].filter((x) => x > 0)).toFixed(1));
    const avgCompl      = Math.round(avg([hxAvgCompl, mcAvgCompl, fvAvgCompl, mfAvgCompl, msCompPct].filter((x) => x > 0)));

    // Category-filtered hackathon totals
    const filteredHakProj = catFilter === "all"
      ? hakProj
      : hak.reduce((s, h) => s + (h.categories[catFilter as keyof typeof h.categories] ?? 0), 0);

    const hakCatTotals = HACK_CATS.map((cat) => ({
      name: cat,
      value: hak.reduce((s, h) => s + (h.categories[cat as keyof typeof h.categories] ?? 0), 0),
    }));

    // Countries
    const allCountries = Array.from(new Set([
      ...hx.map((h) => h.country),
      ...int.map((i) => i.country),
      ...hak.map((h) => h.location.split(", ").pop() ?? ""),
      ...fv.map((v) => v.country),
    ])).filter(Boolean);

    // Stream distribution (applying streamFilter)
    const streamDist = streamFilter === "hemp"
      ? [{ name: "HealthX", value: hxPart }, { name: "Internships", value: intStudents }, { name: "Mission", value: msTotal }]
      : streamFilter === "hent"
      ? [{ name: "Hackathons", value: hakPart }, { name: "Masterclasses", value: mcAtt }, { name: "Field Visits", value: fvPart }, { name: "Mentorship", value: mfFel }]
      : [
          { name: "Health Education", value: hxPart + mcAtt + fvPart },
          { name: "Workforce Dev.", value: intStudents + msTotal },
          { name: "Innovation", value: hakPart },
          { name: "Leadership", value: mfFel },
        ];

    // Gender-filtered display values
    const displayFem = genderFilter === "male" ? 0 : totalFem;
    const displayMale = genderFilter === "female" ? 0 : Math.max(grandTotal - totalFem, 0);
    const displayTotal = genderFilter === "all" ? grandTotal : genderFilter === "female" ? totalFem : Math.max(grandTotal - totalFem, 0);

    // Quality comparison
    const programQuality = [
      { name: "HealthX",      sat: hxAvgSat,   compl: hxAvgCompl,  color: TEAL   },
      { name: "Internships",  sat: intAvgSat,  compl: 100,         color: AMBER  },
      { name: "Masterclasses",sat: mcAvgSat,   compl: mcAvgCompl,  color: SKY    },
      { name: "Field Visits", sat: fvAvgSat,   compl: fvAvgCompl,  color: INDIGO },
      { name: "Mentorship",   sat: mfAvgSat,   compl: mfAvgCompl,  color: VIOLET },
    ];

    return {
      // raw filtered slices for charts
      hx, int: int, ms, hak, mc, fv, mf, vc,
      // HEMP
      hxPart, hxFem, hxPartners, hxAvgCompl, hxAvgSat,
      intStudents, intFem, intConv, intAvgSat, intPlace,
      msTotal, msFem, msCompleted, msEmployed, msVentures, msCompPct,
      // HENT
      hakPart, hakFem, hakProj, hakStart, hakPartners,
      mcAtt, mcFem, mcAvgCompl, mcAvgSat,
      fvPart, fvFem, fvAvgCompl, fvAvgSat, fvPartners,
      mfFel, mfFem, mfAvgCompl, mfAvgSat, mfGrad,
      // Unified
      totalFem, hempTotal, hentTotal, grandTotal, femalePct,
      totalPartners, venturesTotal, employmentOut, avgSat, avgCompl,
      filteredHakProj, hakCatTotals, allCountries, streamDist,
      displayFem, displayMale, displayTotal, programQuality,
    };
  }, [yearFilter, periodFilter, genderFilter, catFilter, streamFilter]);

  // â"€â"€ Year trend data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const growthByYear = useMemo(() =>
    YEARS.map((yr) => {
      const hemp =
        healthXSessions.filter((h) => h.year === yr).reduce((s, h) => s + h.participants, 0) +
        internships.filter((i) => i.year === yr).reduce((s, i) => s + i.students, 0) +
        missionStudents.filter((s) => s.cohort === yr).length;
      const hent =
        hackathons.filter((h) => h.year === yr).reduce((s, h) => s + h.participants, 0) +
        masterclasses.filter((m) => m.year === yr).reduce((s, m) => s + m.attendees, 0) +
        fieldVisits.filter((v) => v.year === yr).reduce((s, v) => s + v.participants, 0) +
        mentorshipPrograms.filter((p) => p.year === yr).reduce((s, p) => s + p.fellows, 0);
      // Quality metrics by year (for quality view)
      const yrHx = healthXSessions.filter((h) => h.year === yr);
      const yrMc = masterclasses.filter((m) => m.year === yr);
      const yrFv = fieldVisits.filter((v) => v.year === yr);
      const yrMf = mentorshipPrograms.filter((p) => p.year === yr);
      const complVals = [
        avg(yrHx.map((h) => h.completionRate)),
        avg(yrMc.map((m) => m.completionRate)),
        avg(yrFv.map((v) => v.completionRate)),
        avg(yrMf.map((p) => p.completionRate)),
      ].filter((v) => v > 0);
      const satVals = [
        avg(yrHx.map((h) => avg(Object.values(h.scores)))),
        avg(yrMc.map((m) => avg(Object.values(m.scores)))),
        avg(yrFv.map((v) => avg(Object.values(v.scores)))),
        avg(yrMf.map((p) => avg(Object.values(p.scores)))),
      ].filter((v) => v > 0);
      return {
        Year: String(yr),
        "Health Ed.": hemp,
        "Venture Eco.": hent,
        Total: hemp + hent,
        "Completion %": complVals.length ? Math.round(avg(complVals)) : 0,
        "Satisfaction Ã—20": satVals.length ? Math.round(avg(satVals) * 20) : 0,
      };
    }).filter((d) => d.Total > 0),
  [yearFilter]);

  // Sector-level conversion rate analysis (analytical: reveals which sectors drive outcomes)
  const sectorConversionRates = useMemo(() =>
    SECTORS_HEMP.map((sec) => {
      const secInterns = internships.filter((i) => i.sector === sec);
      const students   = secInterns.reduce((s, i) => s + i.students, 0);
      const converted  = secInterns.reduce((s, i) => s + i.employmentConversions, 0);
      const placed     = secInterns.reduce((s, i) => s + i.placementsAfterInternship, 0);
      return {
        Sector: sec,
        "Conv. Rate %": students > 0 ? Math.round((converted / students) * 100) : 0,
        "Placement Rate %": students > 0 ? Math.round((placed / students) * 100) : 0,
        students,
      };
    }).filter((d) => d.students > 0).sort((a, b) => b["Conv. Rate %"] - a["Conv. Rate %"]),
  []);

  const outcomesByYear = useMemo(() =>
    YEARS.map((yr) => {
      const base = pipelineSector === "all"
        ? internships.filter((i) => i.year === yr)
        : internships.filter((i) => i.year === yr && i.sector === pipelineSector);
      return {
        Year: String(yr),
        Placed:    base.reduce((s, i) => s + i.placementsAfterInternship, 0),
        Converted: base.reduce((s, i) => s + i.employmentConversions, 0),
      };
    }).filter((d) => d.Placed + d.Converted > 0),
  [pipelineSector]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: EXEC_BG }}>
      {/* â"€â"€ Page header â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <header className="bg-white border-b border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between py-5 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-none">CHII Ecosystem Impact</h1>
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Consolidated analytics  *  {D.allCountries.length} countries  *  {D.grandTotal.toLocaleString()} participants reached
              </p>
            </div>

            {/* Year + period dropdowns + actions  -  inline row */}
            <div className="flex items-center gap-2">
              <select
                value={String(yearFilter)}
                onChange={(e) => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)}
                className="text-xs font-medium border border-gray-200 text-gray-700 bg-white px-3 py-2 rounded appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:border-gray-400 transition-colors pr-7"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
              >
                <option value="all">All Years</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value as PeriodVal)}
                className="text-xs font-medium border border-gray-200 text-gray-700 bg-white px-3 py-2 rounded appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:border-gray-400 transition-colors pr-7"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
              >
                {(Object.entries(PERIOD_LABELS) as [PeriodVal, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-2 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded font-semibold text-white shadow-sm"
                style={{ backgroundColor: NAVY }}>
                <FileText size={11} /> Report
              </button>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              <KpiTile label="People Reached"       num={D.grandTotal}       displayFmt={fmt}  sub={periodFilter === "all" ? (yearFilter === "all" ? "All years" : String(yearFilter)) : PERIOD_LABELS[periodFilter].split("  *  ")[0]} clr={TEAL}   />
              <KpiTile label="Countries"            num={D.allCountries.length} displayFmt={fmt} sub="Geographic reach"  clr={INDIGO} />
              <KpiTile label="Female"               num={D.femalePct}        displayFmt={pct}  sub={`${fmt(D.totalFem)} participants`} clr={ROSE}   />
              <KpiTile label="Ventures & Startups"  num={D.venturesTotal}    displayFmt={fmt}  sub="Innovation outputs" clr={VIOLET} />
              <KpiTile label="Employment Outcomes"  num={D.employmentOut}    displayFmt={fmt}  sub="Converted & placed" clr={GREEN}  />
              <KpiTile label="Partnerships"         num={D.totalPartners}    displayFmt={fmt}  sub="Collaborations"     clr={AMBER}  />
              <KpiTile label="Avg Satisfaction"     num={D.avgSat * 10}      displayFmt={(n) => `${(n / 10).toFixed(1)}/5`} sub="All streams" clr={ORANGE} />
              <KpiTile label="Avg Completion"       num={D.avgCompl}         displayFmt={pct}  sub="All programmes"    clr={SKY}    />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-10">

        {/* â"€â"€ Executive insight cards â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightCard label="Overall Satisfaction"  value={`${D.avgSat}/5`}
            sub="Avg across all programme streams"
            note={`HealthX ${D.hxAvgSat}  *  Internships ${D.intAvgSat}  *  Masterclasses ${D.mcAvgSat}`}
            color={TEAL} icon={Star} />
          <InsightCard label="Completion Momentum"   value={pct(D.avgCompl)}
            sub="Programme completion average"
            note={`HealthX ${D.hxAvgCompl}%  *  Masterclasses ${D.mcAvgCompl}%  *  Mission ${D.msCompPct}%`}
            color={VIOLET} icon={Target} />
          <InsightCard label="Innovation Ecosystem"  value={fmt(D.venturesTotal)}
            sub="Ventures, startups & projects"
            note={`Portfolio ${D.vc.length}  *  Mission ${D.msVentures}  *  Hackathons ${D.hakStart}`}
            color={ORANGE} icon={Zap} />
          <InsightCard label="Workforce Impact"      value={fmt(D.employmentOut)}
            sub="People employed or converted"
            note={`Internship conversions ${D.intConv}  *  Mission employed ${D.msEmployed.length}`}
            color={GREEN} icon={Briefcase} />
        </div>

        {/* â"€â"€ SECTION 1: Scale & Reach â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <section>
          <SecHeader title="Scale & Collective Reach" sub="Participation growth and programme stream distribution" accent={TEAL} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ChartCard title="Participation Growth"
                sub={growthView === "participation" ? "Year-on-year reach by programme stream" : "Avg completion % and satisfaction score trend by year"}
                accent={VIOLET}
                filter={
                  <PillGroup
                    options={[{ label: "Reach", value: "participation" }, { label: "Quality", value: "quality" }]}
                    value={growthView} onChange={setGrowthView} />
                }>
                <ResponsiveContainer width="100%" height={240}>
                  {growthView === "participation" ? (
                    <AreaChart data={growthByYear}>
                      <defs>
                        <linearGradient id="gHE" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={TEAL} stopOpacity={0.28} />
                          <stop offset="95%" stopColor={TEAL} stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gVE" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={VIOLET} stopOpacity={0.28} />
                          <stop offset="95%" stopColor={VIOLET} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={0} />
                      <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={34} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Area type="monotone" dataKey="Health Ed."   stroke={TEAL}   strokeWidth={2} fill="url(#gHE)" dot={false} />
                      <Area type="monotone" dataKey="Venture Eco." stroke={VIOLET} strokeWidth={2} fill="url(#gVE)" dot={false} />
                    </AreaChart>
                  ) : (
                    <LineChart data={growthByYear}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={0} />
                      <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={34} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                        formatter={(v: number, name: string) =>
                          name === "Satisfaction Ã—20" ? [`${(v / 20).toFixed(1)}/5`, "Avg Satisfaction"] : [`${v}%`, name]
                        }
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Line type="monotone" dataKey="Completion %" stroke={GREEN} strokeWidth={2} dot={{ r: 3, fill: GREEN }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Satisfaction Ã—20" stroke={SKY} strokeWidth={2} dot={{ r: 3, fill: SKY }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <ChartCard title="Stream Distribution" sub="Share of reach by engagement type" accent={INDIGO}
              filter={
                <PillGroup
                  options={[{ label: "All", value: "all" }, { label: "Health Ed.", value: "hemp" }, { label: "Venture", value: "hent" }]}
                  value={streamFilter} onChange={setStreamFilter} />
              }>
              <div className="h-[190px]">
                <CustomDonut
                  data={D.streamDist}
                  colors={[TEAL, AMBER, VIOLET, SKY, ORANGE, ROSE]}
                  label={fmt(D.grandTotal)}
                  valueFormatter={fmt}
                />
              </div>
              <div className="mt-3 space-y-1.5">
                {D.streamDist.map((s, i) => {
                  const cc = [TEAL, AMBER, VIOLET, SKY, ORANGE, ROSE];
                  const t = D.streamDist.reduce((x, d) => x + d.value, 0);
                  return (
                    <div key={s.name} className="flex items-center justify-between text-[11px] text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cc[i] }} />{s.name}
                      </span>
                      <span className="font-bold tabular-nums" style={{ color: cc[i] }}>
                        {fmt(s.value)} ({t > 0 ? Math.round((s.value / t) * 100) : 0}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 2: Gender Equity â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <section>
          <SecHeader title="Gender Equity & Diversity" sub="Disaggregated participation across all programme streams" accent={ROSE} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Overall Gender Split" sub="Female vs male across all programmes" accent={ROSE}>
              <div className="flex justify-center mb-4">
                <SegTab
                  options={[{ label: "All", value: "all" }, { label: "Female", value: "female" }, { label: "Male", value: "male" }]}
                  value={genderFilter} onChange={setGenderFilter} accent={ROSE} />
              </div>
              <div className="h-[160px]">
                <CustomDonut
                  data={[
                    { name: "Female", value: D.displayFem },
                    { name: "Male",   value: D.displayMale },
                  ].filter((d) => d.value > 0)}
                  colors={[ROSE, "#60A5FA"]}
                  label={pct(D.femalePct)}
                  valueFormatter={fmt}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                <div className="rounded border py-3" style={{ backgroundColor: ROSE + "12", borderColor: ROSE + "33" }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Female</p>
                  <p className="text-xl font-black text-gray-900 mt-1 tabular-nums">{fmt(D.totalFem)}</p>
                </div>
                <div className="rounded border py-3" style={{ backgroundColor: "#60A5FA22", borderColor: "#60A5FA44" }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Male</p>
                  <p className="text-xl font-black text-gray-900 mt-1 tabular-nums">{fmt(Math.max(D.grandTotal - D.totalFem, 0))}</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Female % by Programme" sub="Progress toward gender parity per stream" accent={ROSE}>
              <div className="space-y-3 pt-1">
                {[
                  { label: "HealthX",      fem: D.hxFem,    total: D.hxPart,      color: TEAL   },
                  { label: "Internships",  fem: D.intFem,   total: D.intStudents,  color: AMBER  },
                  { label: "Mission",      fem: D.msFem,    total: D.msTotal,      color: VIOLET },
                  { label: "Hackathons",   fem: D.hakFem,   total: D.hakPart,      color: ORANGE },
                  { label: "Masterclasses",fem: D.mcFem,    total: D.mcAtt,        color: SKY    },
                  { label: "Field Visits", fem: D.fvFem,    total: D.fvPart,       color: INDIGO },
                  { label: "Mentorship",   fem: D.mfFem,    total: D.mfFel,        color: VIOLET },
                ].map((row) => {
                  const p = row.total > 0 ? Math.round((row.fem / row.total) * 100) : 0;
                  return (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                        <span className="font-medium">{row.label}</span>
                        <span className="font-bold" style={{ color: row.color }}>{p}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: row.color + "20" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p}%`, backgroundColor: row.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            <ChartCard title="Students vs Alumni" sub="Current learners vs programme graduates" accent={INDIGO}>
              {(() => {
                const studentPart = D.intStudents + D.msTotal +
                  D.mc.reduce((s, m) => s + m.studentAttendees, 0) +
                  D.hak.reduce((s, h) => s + h.studentCount, 0) +
                  D.fv.reduce((s, v) => s + v.studentParticipants, 0);
                const alumniPart = D.msEmployed.length + D.mfGrad + D.intPlace;
                return (
                  <>
                    <div className="h-[180px]">
                      <CustomDonut
                        data={[{ name: "Students", value: studentPart }, { name: "Alumni", value: alumniPart }]}
                        colors={[INDIGO, TEAL]} label={fmt(studentPart)} valueFormatter={fmt} />
                    </div>
                    <div className="mt-3 space-y-2">
                      <StatRow label="Active students"    value={fmt(studentPart)} color={INDIGO} />
                      <StatRow label="Alumni / Graduates" value={fmt(alumniPart)}  color={TEAL}   />
                    </div>
                  </>
                );
              })()}
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 3: Innovation â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <section>
          <SecHeader title="Innovation & Entrepreneurship Output" sub="Venture creation, hackathon projects, and startup ecosystem" accent={ORANGE} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Venture Ecosystem" sub="Portfolio + mission-led + hackathon startups" accent={VIOLET}>
              <div className="rounded border p-4 mb-4" style={{ backgroundColor: VIOLET + "10", borderColor: VIOLET + "22" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Total innovation outputs</p>
                    <p className="text-3xl font-black tabular-nums text-gray-900 mt-2">{fmt(D.venturesTotal)}</p>
                  </div>
                  <div className="w-10 h-10 rounded bg-white border flex items-center justify-center" style={{ borderColor: VIOLET + "22" }}>
                    <TrendingUp size={18} color={VIOLET} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Portfolio", value: D.vc.length, color: VIOLET },
                  { label: "Mission",   value: D.msVentures, color: TEAL },
                  { label: "Hackathon", value: D.hakStart,   color: ORANGE },
                ].map((r) => (
                  <div key={r.label} className="rounded border p-3 text-center" style={{ backgroundColor: r.color + "10", borderColor: r.color + "22" }}>
                    <p className="text-[9px] font-bold uppercase text-gray-500">{r.label}</p>
                    <p className="text-lg font-black tabular-nums mt-1" style={{ color: r.color }}>{r.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded border p-3">
                <p className="text-[10px] font-bold text-gray-600 mb-2">
                  {catFilter === "all" ? "All hackathon categories" : `Category: ${catFilter}`}
                </p>
                {D.hakCatTotals.map((c, i) => {
                  const cc = [TEAL, ROSE, VIOLET, GREEN, AMBER];
                  const isHighlighted = catFilter === "all" || catFilter === c.name;
                  return (
                    <HBar key={c.name} label={c.name} value={c.value}
                      max={D.hakCatTotals[0].value}
                      color={isHighlighted ? cc[i] : "#D1D5DB"} />
                  );
                })}
              </div>
            </ChartCard>

            <ChartCard title="Innovation Projects Timeline" sub={catFilter === "all" ? "All projects by year" : `${catFilter}  -  by year`} accent={ORANGE}
              filter={
                <HeaderDropdown
                  options={[{ label: "All categories", value: "all" }, ...HACK_CATS.map((c) => ({ label: c, value: c as HackCat }))]}
                  value={catFilter} onChange={setCatFilter} />
              }>
              <div className="rounded border p-4 mb-4" style={{ backgroundColor: ORANGE + "10", borderColor: ORANGE + "22" }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  {catFilter === "all" ? "Total projects built" : `${catFilter} projects`}
                </p>
                <p className="text-3xl font-black tabular-nums text-gray-900 mt-1">{fmt(D.filteredHakProj)}</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[2022, 2023, 2024, 2025, 2026].map((yr) => {
                  const yrHaks = hackathons.filter((h) => h.year === yr);
                  const val = catFilter === "all"
                    ? yrHaks.reduce((s, h) => s + h.projects, 0)
                    : yrHaks.reduce((s, h) => s + (h.categories[catFilter as keyof typeof h.categories] ?? 0), 0);
                  return { Year: String(yr), Projects: val };
                })}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={26} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="Projects" fill={ORANGE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Partnerships & Reach" sub="Institutional collaborations and geographic footprint" accent={GREEN}>
              <div className="rounded border p-4 mb-4" style={{ backgroundColor: GREEN + "10", borderColor: GREEN + "22" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Total partnerships</p>
                    <p className="text-3xl font-black tabular-nums text-gray-900 mt-1">{fmt(D.totalPartners)}</p>
                  </div>
                  <div className="w-10 h-10 rounded bg-white border flex items-center justify-center" style={{ borderColor: GREEN + "22" }}>
                    <Handshake size={18} color={GREEN} />
                  </div>
                </div>
              </div>
              <div className="rounded border p-3 mb-3">
                <StatRow label="HealthX partnerships"   value={D.hxPartners}   color={TEAL}   />
                <StatRow label="Hackathon partnerships" value={D.hakPartners} color={ORANGE} />
                <StatRow label="Field visit links"      value={D.fvPartners}   color={INDIGO} />
              </div>
              <div className="rounded border p-4" style={{ backgroundColor: TEAL + "08", borderColor: TEAL + "18" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TEAL + "20" }}>
                    <Globe size={16} color={TEAL} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">Geographic footprint</p>
                    <p className="text-xl font-black tabular-nums" style={{ color: TEAL }}>{D.allCountries.length} countries</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{D.allCountries.slice(0, 6).join("  *  ")}</p>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 4: Workforce Outcomes â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <section>
          <SecHeader title="Workforce Development & People Outcomes" sub="Employment conversions, post-programme placements, and leadership pipeline" accent={AMBER} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ChartCard title="Employment & Placement Pipeline"
                sub={pipelineSector === "all" ? "All sectors  -  conversions and placements by year" : `${pipelineSector} sector  -  conversion and placement trend`}
                accent={AMBER}
                filter={
                  <HeaderDropdown
                    options={[{ label: "All Sectors", value: "all" }, ...SECTORS_HEMP.map((s) => ({ label: s, value: s }))]}
                    value={pipelineSector} onChange={setPipelineSector} />
                }>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={outcomesByYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Placed"    fill={AMBER} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Converted" fill={TEAL}  radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Internship students",  value: D.intStudents,           color: AMBER  },
                    { label: "Emp. conversions",      value: D.intConv,               color: TEAL   },
                    { label: "Post-prog. placed",     value: D.intPlace,              color: GREEN  },
                    { label: "Mission employed",      value: D.msEmployed.length,     color: VIOLET },
                  ].map((r) => (
                    <div key={r.label} className="rounded border p-3" style={{ backgroundColor: r.color + "10", borderColor: r.color + "22" }}>
                      <p className="text-[9px] font-bold uppercase text-gray-500">{r.label}</p>
                      <p className="text-lg font-black tabular-nums mt-1" style={{ color: r.color }}>{fmt(r.value)}</p>
                    </div>
                  ))}
                </div>
                {/* Sector conversion rate insight  -  visible when a sector is selected */}
                {pipelineSector !== "all" && (() => {
                  const row = sectorConversionRates.find((s) => s.Sector === pipelineSector);
                  if (!row) return null;
                  return (
                    <div className="mt-3 rounded border p-3" style={{ backgroundColor: AMBER + "08", borderColor: AMBER + "22" }}>
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 mb-2">{pipelineSector}  -  conversion insight</p>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[8px] text-gray-400">Emp. conversion rate</p>
                          <p className="text-lg font-black tabular-nums" style={{ color: TEAL }}>{row["Conv. Rate %"]}%</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-400">Placement rate</p>
                          <p className="text-lg font-black tabular-nums" style={{ color: AMBER }}>{row["Placement Rate %"]}%</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-[8px] text-gray-400 mb-1">vs all-sector avg ({sectorConversionRates.length > 0 ? Math.round(sectorConversionRates.reduce((s, r) => s + r["Conv. Rate %"], 0) / sectorConversionRates.length) : 0}%)</p>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: TEAL + "20" }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(row["Conv. Rate %"], 100)}%`, backgroundColor: TEAL }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </ChartCard>
            </div>

            <ChartCard title="Leadership Pipeline" sub="Programme completions, fellows graduated, and ventures created" accent={VIOLET}>
              <div className="rounded border p-4 mb-4" style={{ backgroundColor: VIOLET + "08", borderColor: VIOLET + "18" }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">Leaders developed</p>
                <p className="text-3xl font-black tabular-nums mt-1" style={{ color: VIOLET }}>
                  {fmt(D.msCompleted.length + D.mfGrad)}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">Completions + fellowship graduates</p>
              </div>
              <StatRow label="Mission completions"   value={fmt(D.msCompleted.length)} color={VIOLET} />
              <StatRow label="Mission completion %"  value={pct(D.msCompPct)}          color={GREEN}  />
              <StatRow label="Fellowship graduates"  value={fmt(D.mfGrad)}             color={SKY}    />
              <StatRow label="Mentorship fellows"    value={fmt(D.mfFel)}              color={INDIGO} />
              <StatRow label="Ventures created"      value={fmt(D.msVentures)}         color={ORANGE} />
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 5: Programme Quality â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <section>
          <SecHeader title="Programme Quality & Learning Engagement" sub="Satisfaction and completion benchmarks across all CHII programme streams" accent={SKY} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Satisfaction Scores" sub="Average participant satisfaction (out of 5) per stream" accent={SKY}>
              <div className="space-y-3 pt-1">
                {D.programQuality.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-[11px] text-gray-700 mb-1.5">
                      <span className="font-semibold">{p.name}</span>
                      <span className="font-black tabular-nums" style={{ color: p.color }}>{p.sat}/5</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: p.color + "20" }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(p.sat / 5) * 100}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded border p-3 flex items-center gap-2" style={{ backgroundColor: SKY + "08", borderColor: SKY + "22" }}>
                <Star size={14} color={SKY} />
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-600">Overall average</p>
                <p className="text-sm font-black tabular-nums ml-auto" style={{ color: SKY }}>{D.avgSat}/5</p>
              </div>
            </ChartCard>

            <ChartCard title="Completion Rates" sub="% of participants completing each programme stream" accent={GREEN}>
              <div className="space-y-3 pt-1">
                {[
                  ...D.programQuality.filter((p) => p.compl < 100),
                  { name: "Mission Students", sat: 0, compl: D.msCompPct, color: VIOLET },
                ].map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-[11px] text-gray-700 mb-1.5">
                      <span className="font-semibold">{p.name}</span>
                      <span className="font-black tabular-nums" style={{ color: p.color }}>{p.compl}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: p.color + "20" }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.compl}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded border p-3 flex items-center gap-2" style={{ backgroundColor: GREEN + "08", borderColor: GREEN + "22" }}>
                <Award size={14} color={GREEN} />
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-600">Overall average</p>
                <p className="text-sm font-black tabular-nums ml-auto" style={{ color: GREEN }}>{pct(D.avgCompl)}</p>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ Footer â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <footer className="border-t border-gray-200 pt-6 pb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">CHII  *  Centre for Health Innovation & Impact</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {yearFilter === "all" ? "2021 - 2026" : String(yearFilter)}{periodFilter !== "all" ? `  *  ${PERIOD_LABELS[periodFilter]}` : ""}  *  {D.allCountries.length} countries  *  {fmt(D.grandTotal)} participants
              </p>
            </div>
            <p className="text-[10px] text-gray-300">Switch programme view using the tabs above</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
