"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Info, Briefcase, Cpu, ShieldCheck,
  ArrowUpRight, Clock, SlidersHorizontal, X,
} from "lucide-react";
import {
  WORKERS, GENDERS, EMPLOYMENT_TYPES, ROLE_LEVELS, ARRANGEMENTS, ORG_TYPES,
  SECTORS, COUNTRIES, YEARS, COHORTS, PROGRAMS, PROGRAM_NAMES,
  type Gender, type Worker, type ParticipantType,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";
import HeaderDesign from "@/components/HeaderDesign";
import StatsKpiCard from "../StatsKpiCard";
import { DonutRing as Donut } from "@/components/DonutChart";

/* ── palette ──────────────────────────────────────────── */
const NAVY = "#14306B";
const BAND = "#14306B";
const TICK = "#D17A86";
const C_TOTAL = "#102C5E";
const C_FEMALE = "#479BD6";

const GENDER_COLOR: Record<Gender, string> = { Female: "#102C5E", Male: "#479BD6", Other: "#D45F2C" };
const EMP_COLOR: Record<string, string> = {
  "Full-time": "#102C5E", "Part-time": "#479BD6", "Temporary": "#A81B2D", "Contract": "#D45F2C",
};
const ARR_COLOR: Record<string, string> = { Remote: "#102C5E", "On-site": "#479BD6", Hybrid: "#D45F2C" };

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const median = (arr: number[]) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/* ♀ woman / female symbol icon */
function WomanIcon({ size = 20, color, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color ?? "currentColor"} stroke={color ?? "currentColor"} style={style}>
      <circle cx="12" cy="4.3" r="2.9" stroke="none" />
      <path d="M8.7 7.6 L15.3 7.6 L14 12.2 L16.6 17.6 L7.4 17.6 L10 12.2 Z" stroke="none" />
      <path d="M9.3 8 C7.6 10 6.9 12.4 6.9 15.1" fill="none" strokeWidth="2" strokeLinecap="round" />
      <path d="M14.7 8 C16.4 10 17.1 12.4 17.1 15.1" fill="none" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.4 17.6 L10.4 21.7" fill="none" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M13.6 17.6 L13.6 21.7" fill="none" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   Shared UI
═══════════════════════════════════════════════════════ */
function SectionHeader({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
      <span style={{ width: 4, height: 16, borderRadius: 999, backgroundColor: TICK, flexShrink: 0, alignSelf: "center" }} />
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: NAVY, letterSpacing: "0.01em" }}>{title}</h2>
        <p style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{blurb}</p>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, info, children }: {
  title: string; subtitle: string; info?: string; children: React.ReactNode;
}) {
  const [tip, setTip] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      <div style={{ backgroundColor: BAND, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: TICK, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
              {info && (
                <span style={{ position: "relative", display: "flex", cursor: "pointer" }}
                  onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
                  <Info size={11} color="rgba(181,212,244,0.85)" />
                  {tip && (
                    <span style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10.5, fontWeight: 400, textTransform: "none", letterSpacing: 0, lineHeight: 1.5, padding: "8px 11px", borderRadius: 7, width: 210, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
                      {info}
                    </span>
                  )}
                </span>
              )}
            </div>
            <p style={{ fontSize: 9.5, color: "rgba(181,212,244,0.7)", marginTop: 1 }}>{subtitle}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>{children}</div>
    </div>
  );
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{fmt(p.value)}</b>
        </p>
      ))}
    </div>
  );
}
function MoneyTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.stroke, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{usd(p.value)}</b>
        </p>
      ))}
    </div>
  );
}
function PctTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{Math.round(p.value)}%</b>
        </p>
      ))}
    </div>
  );
}

/* axis tick that wraps a long label onto up to two centred lines */
function WrapTick({ x, y, payload }: any) {
  const words = String(payload?.value ?? "").replace("BSc ", "").split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 16) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return (
    <g transform={`translate(${x},${y + 8})`}>
      {lines.slice(0, 2).map((ln, i) => (
        <text key={i} x={0} y={i * 11} textAnchor="middle" fontSize={9} fill="#374151">{ln}</text>
      ))}
    </g>
  );
}

function FilterSelect<T extends string | number>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: "1 1 140px" }}>
      <label style={{ fontSize: 9.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <select value={String(value)} onChange={e => {
        const match = options.find(o => String(o.value) === e.target.value);
        if (match) onChange(match.value);
      }}
        style={{ width: "100%", fontSize: 12, border: "1px solid rgba(0,33,71,0.15)", borderRadius: 6, padding: "7px 9px", color: NAVY, backgroundColor: "white", cursor: "pointer" }}>
        {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    </div>
  );
}

const WE_SECTIONS: { n: number; label: string }[] = [
  { n: 1, label: "Workforce Profile" },
  { n: 2, label: "Employment Trends & Sectors" },
  { n: 3, label: "Program Outcomes" },
  { n: 4, label: "Quality & Impact" },
];

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function WageEmploymentPage() {
  const [year, setYear] = useState<"all" | number>("all");
  const [program, setProgram] = useState<string>("all");
  const [ptype, setPtype] = useState<"all" | ParticipantType>("all");
  const [gender, setGender] = useState<"all" | Gender>("all");
  const [country, setCountry] = useState<string>("all");
  const [cohort, setCohort] = useState<"all" | number>("all");
  const [activeSection, setActiveSection] = useState<number | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const show = (n: number) => activeSection === "all" || activeSection === n;

  const scope = useMemo(() =>
    WORKERS.filter(w => {
      if (year !== "all" && w.year !== year) return false;
      if (program !== "all" && w.program !== program) return false;
      if (ptype !== "all" && w.participantType !== ptype) return false;
      if (gender !== "all" && w.gender !== gender) return false;
      if (country !== "all" && w.country !== country) return false;
      if (cohort !== "all" && w.cohort !== cohort) return false;
      return true;
    }),
  [year, program, ptype, gender, country, cohort]);

  const total = scope.length;

  /* ── Section 1: workforce snapshot ─────────────────── */
  const kpis = useMemo(() => {
    const female = scope.filter(w => w.gender === "Female").length;
    const decent = scope.filter(w => w.decentWork).length;
    const tech = scope.filter(w => w.inTech).length;
    const placed = scope.filter(w => w.timeToEmployment <= 12).length;
    const medMonths = median(scope.map(w => w.timeToEmployment));
    return {
      female, femalePct: share(female, total),
      decentPct: share(decent, total), techPct: share(tech, total),
      placePct: share(placed, total), medMonths: Math.round(medMonths),
    };
  }, [scope, total]);

  /* ── Section 2: workforce profile ──────────────────── */
  const genderData = useMemo(() => (["Female", "Male"] as Gender[]).map(g => ({ name: g, value: scope.filter(w => w.gender === g).length })).filter(d => d.value > 0), [scope]);
  const roleData = useMemo(() => ROLE_LEVELS.map(rl => ({ name: rl, value: scope.filter(w => w.roleLevel === rl).length })).sort((a, b) => b.value - a.value), [scope]);
  const empTypeData = useMemo(() => EMPLOYMENT_TYPES.map(e => ({ name: e, value: scope.filter(w => w.employmentType === e).length })).filter(d => d.value > 0), [scope]);
  // employer type cross-tabbed by working arrangement (single combined chart)
  const orgByArr = useMemo(() =>
    ORG_TYPES.map(o => {
      const rows = scope.filter(w => w.orgType === o);
      const rec: Record<string, number | string> = { name: o, total: rows.length };
      ARRANGEMENTS.forEach(a => { rec[a] = rows.filter(w => w.arrangement === a).length; });
      return rec;
    }).filter(d => (d.total as number) > 0).sort((a, b) => (b.total as number) - (a.total as number)),
  [scope]);

  /* ── Section 3: employment trends (computed by year) ─ */
  const trends = useMemo(() => {
    const TREND_YEARS = [2022, 2023, 2024, 2025, 2026];
    const yearly = TREND_YEARS.map(yr => {
      const rows = scope.filter(w => w.year === yr);
      const fem = rows.filter(w => w.gender === "Female");
      const placed = rows.filter(w => w.timeToEmployment <= 12);
      const placedFem = fem.filter(w => w.timeToEmployment <= 12);
      const avg = (a: Worker[]) => a.length ? Math.round(a.reduce((s, w) => s + w.salaryUSD, 0) / a.length) : 0;
      const rec: Record<string, number> = { year: yr };
      EMPLOYMENT_TYPES.forEach(t => { rec[t] = rows.filter(w => w.employmentType === t).length; });
      return {
        year: yr,
        Total: rows.length,
        Female: fem.length,
        placeTotal: share(placed.length, rows.length),
        placeFemale: share(placedFem.length, fem.length),
        incomeTotal: avg(rows),
        incomeFemale: avg(fem),
        ...rec,
      };
    });
    return yearly;
  }, [scope]);

  /* ── Section 4: employment landscape ───────────────── */
  const sectorData = useMemo(() => SECTORS.map(s => ({ name: s, value: scope.filter(w => w.sector === s).length })).filter(d => d.value > 0).sort((a, b) => b.value - a.value), [scope]);
  const geoData = useMemo(() => COUNTRIES.map(c => ({ name: c === "Diaspora" ? "Diaspora / Outside Africa" : c, value: scope.filter(w => w.country === c).length })).filter(d => d.value > 0).sort((a, b) => b.value - a.value), [scope]);

  /* ── Section 5: program outcomes ───────────────────── */
  const programOutcomes = useMemo(() => {
    const rows = PROGRAMS.map(meta => {
      const ps = scope.filter(w => w.program === meta.name);
      return {
        name: meta.name,
        employmentRate: meta.employmentRate,
        decent: share(ps.filter(w => w.decentWork).length, ps.length),
        placement: share(ps.filter(w => w.timeToEmployment <= 12).length, ps.length),
        avgIncome: ps.length ? Math.round(ps.reduce((s, w) => s + w.salaryUSD, 0) / ps.length) : 0,
        typeMix: Object.fromEntries(EMPLOYMENT_TYPES.map(t => [t, ps.filter(w => w.employmentType === t).length])),
      };
    });
    const rateData = [...rows].sort((a, b) => b.employmentRate - a.employmentRate).map(p => ({ name: p.name, value: p.employmentRate }));
    const typeData = [...rows].sort((a, b) => b.employmentRate - a.employmentRate).map(p => ({ name: p.name, ...p.typeMix }));
    const qualityData = [...rows].sort((a, b) => b.employmentRate - a.employmentRate).map(p => ({
      name: p.name, "Employment Rate": p.employmentRate, "Decent Work": p.decent, "12-Mo Placement": p.placement,
    }));
    return { rateData, typeData, qualityData, count: rows.length };
  }, [scope]);

  /* ── Section 6: quality & impact (survey-style) ────── */
  const quality = useMemo(() => {
    const indicators = [
      { name: "Reliable income", value: 71 },
      { name: "Good reputation", value: 89 },
      { name: "Respected at work", value: 91 },
      { name: "Sense of purpose", value: 90 },
    ];
    const accessing = scope.filter(w => w.decentWork).length;
    const status = [
      { name: "Accessing dignified work", value: accessing },
      { name: "Progressing toward dignified work", value: total - accessing },
    ];
    const career = [
      { name: "New role / was unemployed", value: Math.round(total * 0.46) },
      { name: "Additional income stream", value: Math.round(total * 0.3) },
      { name: "Improved conditions", value: total - Math.round(total * 0.46) - Math.round(total * 0.3) },
    ];
    const careerTotal = career.reduce((s, d) => s + d.value, 0);
    const household = [
      { name: "Financial stability", value: 184 },
      { name: "Family education", value: 156 },
      { name: "Healthcare access", value: 131 },
      { name: "Household well-being", value: 118 },
      { name: "Support to extended family", value: 94 },
    ].sort((a, b) => b.value - a.value);
    const contribution = [
      { name: "Strongly agree", value: 148 },
      { name: "Agree", value: 172 },
      { name: "Neutral", value: 61 },
      { name: "Disagree", value: 24 },
      { name: "Strongly disagree", value: 9 },
    ];
    const helpfulness = [1, 2, 3, 4, 5].map(rt => ({ name: `${rt}`, value: [6, 14, 48, 168, 178][rt - 1] }));
    return { indicators, status, career, careerTotal, household, contribution, helpfulness };
  }, [scope, total]);

  const STATUS_COLOR = ["#102C5E", "#479BD6"];
  const CAREER_COLOR = ["#102C5E", "#479BD6", "#D45F2C"];
  const QUALITY_COLORS: Record<string, string> = { "Employment Rate": C_TOTAL, "Decent Work": C_FEMALE, "12-Mo Placement": "#D45F2C" };

  const activeCount = [year, program, ptype, gender, country, cohort].filter(v => v !== "all").length;
  const reset = () => { setYear("all"); setProgram("all"); setPtype("all"); setGender("all"); setCountry("all"); setCohort("all"); };

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <HeaderDesign />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Wage Employment</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Employment outcomes across CHII participants — job characteristics, employment trends, program performance, and work quality</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ SECTION 1 — WORKFORCE SNAPSHOT ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Wage Employed" num={total} sub="participants in work" Icon={Briefcase}
              tooltip="Total CHII participants currently in wage employment within the active filters." />
            <StatsKpiCard label="Female Wage Employed" num={kpis.female} sub={`${kpis.femalePct}% of employed`} Icon={WomanIcon}
              tooltip="Number and share of female participants in wage employment." />
            <StatsKpiCard label="12-Month Placement" num={kpis.placePct} displayFmt={(n) => `${Math.round(n)}%`} sub="employed within 12 months" Icon={ArrowUpRight}
              tooltip="Share of participants placed into wage employment within twelve months." />
            <StatsKpiCard label="Decent Work Rate" num={kpis.decentPct} displayFmt={(n) => `${Math.round(n)}%`} sub="of employed" Icon={ShieldCheck}
              tooltip="Share of employed participants in roles meeting decent-work criteria." />
            <StatsKpiCard label="Tech Roles" num={kpis.techPct} displayFmt={(n) => `${Math.round(n)}%`} sub="of employed" Icon={Cpu}
              tooltip="Share of employed participants working in technology roles." />
            <StatsKpiCard label="Median Time to Job" num={kpis.medMonths} displayFmt={(n) => `${Math.round(n)} mo`} sub="to first job" Icon={Clock}
              tooltip="Median number of months from completing a program to first wage employment." />
          </div>

          {/* Section pills (left) + compact filters dropdown (right) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{ n: 0, label: "All Sections" }, ...WE_SECTIONS].map(({ n, label }) => {
                const on = n === 0 ? activeSection === "all" : activeSection === n;
                return (
                  <button key={n} onClick={() => setActiveSection(n === 0 ? "all" : n)}
                    style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
                      border: `1px solid ${on ? NAVY : "rgba(0,33,71,0.15)"}`,
                      backgroundColor: on ? NAVY : "white", color: on ? "white" : "#6B7280" }}>
                    {label}
                  </button>
                );
              })}
            </div>

            <div style={{ position: "relative", flexShrink: 0 }}>
              <button onClick={() => setFiltersOpen(o => !o)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
                  border: `1px solid ${activeCount || filtersOpen ? NAVY : "rgba(0,33,71,0.15)"}`,
                  backgroundColor: filtersOpen ? NAVY : "white", color: filtersOpen ? "white" : "#374151" }}>
                <SlidersHorizontal size={13} />
                Filters
                {activeCount > 0 && (
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: filtersOpen ? "rgba(255,255,255,0.25)" : C_TOTAL, borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>
                )}
              </button>
              {filtersOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50, width: 320, backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.12)", boxShadow: "0 10px 30px rgba(0,0,0,0.14)", overflow: "hidden" }}>
                  <div style={{ backgroundColor: BAND, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filters</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {activeCount > 0 && (
                        <button onClick={reset} style={{ fontSize: 10, fontWeight: 600, color: "white", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, padding: "3px 8px", backgroundColor: "rgba(255,255,255,0.08)", cursor: "pointer" }}>Reset</button>
                      )}
                      <button onClick={() => setFiltersOpen(false)} title="Close" style={{ color: "white", display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}><X size={13} /></button>
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <FilterSelect label="Year" value={year} onChange={setYear}
                      options={[{ value: "all" as const, label: "All Years" }, ...YEARS.map(y => ({ value: y, label: String(y) }))]} />
                    <FilterSelect label="Program" value={program} onChange={setProgram}
                      options={[{ value: "all", label: "All Programs" }, ...PROGRAM_NAMES.map(p => ({ value: p, label: p }))]} />
                    <FilterSelect label="Participant Type" value={ptype} onChange={setPtype}
                      options={[{ value: "all" as const, label: "All Types" }, { value: "Alumni" as const, label: "Alumni" }, { value: "Student" as const, label: "Student" }]} />
                    <FilterSelect label="Gender" value={gender} onChange={setGender}
                      options={[{ value: "all" as const, label: "All Genders" }, ...(["Female", "Male"] as Gender[]).map(g => ({ value: g, label: g }))]} />
                    <FilterSelect label="Country" value={country} onChange={setCountry}
                      options={[{ value: "all", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c, label: c }))]} />
                    <FilterSelect label="Graduation Cohort" value={cohort} onChange={setCohort}
                      options={[{ value: "all" as const, label: "All Cohorts" }, ...COHORTS.map(c => ({ value: c, label: String(c) }))]} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════ SECTION 2 — WORKFORCE PROFILE ════ */}
        {show(1) && (
        <section className="space-y-4">
          <SectionHeader title="Workforce Profile" blurb="Who is employed?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }} className="we-two">
            <style>{`@media (max-width: 720px){ .we-two{ grid-template-columns: 1fr !important; } }`}</style>
            <Panel title="Gender Distribution" subtitle="Female · Male · Other"
              info="Distribution of employed participants by gender.">
              <Donut data={genderData} colors={GENDER_COLOR} total={total} totalLabel="Employed" height={340} legendPercent />
            </Panel>
            <Panel title="Role Level" subtitle="Seniority ranked by volume"
              info="Employed participants grouped by seniority, from most to least common.">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart layout="vertical" data={roleData} margin={{ top: 4, right: 28, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={96} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Employed" fill={C_TOTAL} radius={[0, 4, 4, 0]} barSize={16}
                    label={{ position: "right", fontSize: 10, fill: "#374151", fontWeight: 700 }} />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </Panel>
            <Panel title="Contract Type" subtitle="Full-time · Part-time · Temporary · Contract"
              info="Contract-type split across the employed population.">
              <Donut data={empTypeData} colors={EMP_COLOR} total={total} totalLabel="Employed" height={340} legendPercent />
            </Panel>
            <Panel title="Employer Type & Working Arrangement" subtitle="Employer type, broken down by on-site · hybrid · remote"
              info="Each employer type split by working arrangement, so you can see both where participants are employed and how they work in a single view.">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart layout="vertical" data={orgByArr} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.06)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {ARRANGEMENTS.map((a, i) => (
                    <Bar key={a} dataKey={a} stackId="ar" fill={ARR_COLOR[a]} barSize={18}
                      radius={i === ARRANGEMENTS.length - 1 ? [0, 4, 4, 0] : undefined} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 3 — EMPLOYMENT TRENDS ════ */}
        {show(2) && (
        <section className="space-y-4">
          <SectionHeader title="Employment Trends & Sectors" blurb="How is wage employment growing, and where?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          <Panel title="Yearly Wage Jobs Trend" subtitle="Total vs female, by year"
            info="Wage jobs recorded each year; total is solid, female dashed.">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Total" stroke={C_TOTAL} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="Job Type Evolution" subtitle="Contract-type composition by year"
            info="How employment composition shifts each year — full-time, part-time, temporary, and contract.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trends} margin={{ top: 10, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                {EMPLOYMENT_TYPES.map((t, i) => (
                  <Bar key={t} dataKey={t} stackId="e" fill={EMP_COLOR[t]} barSize={48}
                    radius={i === EMPLOYMENT_TYPES.length - 1 ? [4, 4, 0, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="12-Month Placement Rate" subtitle="Total vs female, % placed within 12 months"
              info="Share employed within twelve months of graduating, by year.">
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={trends} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<PctTip />} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="placeTotal" name="Overall" stroke={C_TOTAL} strokeWidth={2.5} dot={{ r: 3.5 }} />
                  <Line type="monotone" dataKey="placeFemale" name="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Average Monthly Income" subtitle="Total vs female, USD"
              info="Average monthly income by year, in USD.">
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={trends} margin={{ top: 10, right: 16, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={usd} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={56} />
                  <Tooltip content={<MoneyTip />} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="incomeTotal" name="Overall" stroke={C_TOTAL} strokeWidth={2.5} dot={{ r: 3.5 }} />
                  <Line type="monotone" dataKey="incomeFemale" name="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Top Employment Sectors" subtitle="Sectors employing participants, ranked"
              info="Sectors employing participants, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(240, sectorData.length * 32)}>
                <BarChart layout="vertical" data={sectorData} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Employed" fill={BAND} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Employer Geography" subtitle="Where participants work, ranked"
              info="Locations where employed participants are based, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(240, geoData.length * 32)}>
                <BarChart layout="vertical" data={geoData} margin={{ top: 4, right: 44, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Employed" fill={C_FEMALE} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 5 — PROGRAM OUTCOMES ════ */}
        {show(3) && (
        <section className="space-y-4">
          <SectionHeader title="Program Outcomes" blurb="Which programs lead to the strongest employment?" />
          <Panel title="Employment Rate by Program" subtitle="Share employed, ranked"
            info="Employment rate for each academic program, sorted highest to lowest.">
            <ResponsiveContainer width="100%" height={Math.max(240, programOutcomes.count * 44)}>
              <BarChart layout="vertical" data={programOutcomes.rateData} margin={{ top: 4, right: 44, bottom: 4, left: 8 }}>
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={190} axisLine={false} tickLine={false} />
                <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" name="Employment rate" fill={BAND} radius={[0, 4, 4, 0]} barSize={22}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} formatter={(v: number) => `${v}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }} className="we-two">
          <Panel title="Employment Type by Program" subtitle="Contract mix per program (100%)"
            info="Contract-type composition within each program, normalised to 100%. Same program order as above.">
            <ResponsiveContainer width="100%" height={Math.max(240, programOutcomes.count * 44)}>
              <BarChart layout="vertical" data={programOutcomes.typeData} stackOffset="expand" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <XAxis type="number" domain={[0, 1]} tickFormatter={(v: number) => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={190} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {EMPLOYMENT_TYPES.map((t, i) => (
                  <Bar key={t} dataKey={t} stackId="t" fill={EMP_COLOR[t]} barSize={22}
                    radius={i === EMPLOYMENT_TYPES.length - 1 ? [0, 4, 4, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="Employment Quality by Program" subtitle="Employment Rate · Decent Work · 12-Month Placement"
            info="Side-by-side comparison of program performance across three quality metrics (all %).">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={programOutcomes.qualityData} margin={{ top: 16, right: 12, bottom: 8, left: -10 }} barGap={3} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={<WrapTick />} axisLine={false} tickLine={false} interval={0} height={52} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {(["Employment Rate", "Decent Work", "12-Mo Placement"] as const).map(k => (
                  <Bar key={k} dataKey={k} fill={QUALITY_COLORS[k]} radius={[3, 3, 0, 0]} barSize={16} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 6 — QUALITY & IMPACT ════ */}
        {show(4) && (
        <section className="space-y-4">
          <SectionHeader title="Employment Quality & Impact" blurb="Is the work dignified, and is it improving lives?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Panel title="Dignified Work Status" subtitle="Accessing vs progressing"
              info="Participants accessing dignified work versus those progressing toward it.">
              <Donut data={quality.status} colors={STATUS_COLOR} total={total} totalLabel="Employed" height={340} legendPercent />
            </Panel>
            <Panel title="Work vs Before Joining CHII" subtitle="How participants' work changed"
              info="How current work compares to participants' situation before joining CHII — a new role, an additional income stream, or improved conditions.">
              <Donut data={quality.career} colors={CAREER_COLOR} total={quality.careerTotal} totalLabel="Respondents" height={340} legendPercent />
            </Panel>
          </div>
          <Panel title="Household Impact" subtitle="Reported impact areas, ranked"
            info="How wage employment improved participants' households, sorted from most to least reported.">
            <ResponsiveContainer width="100%" height={Math.max(220, quality.household.length * 40)}>
              <BarChart layout="vertical" data={quality.household} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={200} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" name="Respondents" fill={BAND} radius={[0, 4, 4, 0]} barSize={20}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Panel title="CHII Support Assessment" subtitle="“CHII's support contributed to my employment” — agreement"
              info="How participants rate the statement that CHII's support contributed to their employment outcomes.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={quality.contribution} margin={{ top: 16, right: 10, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Respondents" fill={C_FEMALE} radius={[4, 4, 0, 0]} barSize={40}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Support Helpfulness (1–5)" subtitle="Rating distribution"
              info="Distribution of participant ratings of CHII's support on a 1–5 scale.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={quality.helpfulness} margin={{ top: 16, right: 10, bottom: 14, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0}
                    label={{ value: "Rating", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Respondents" fill={BAND} radius={[4, 4, 0, 0]} barSize={40}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>
        )}

        <FeaturedImpactStory footer />
      </div>
    </div>
  );
}
