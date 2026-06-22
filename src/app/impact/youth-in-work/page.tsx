"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Heart, Briefcase, Accessibility, Shield, ShieldCheck, Layers,
  Download, Info, Hammer, GraduationCap, Rocket, Globe, SlidersHorizontal, X,
} from "lucide-react";
import {
  YOUTH, VENTURES, PATHWAYS, PROGRAMS, PARTICIPANT_TYPES, GENDERS, COUNTRIES, SECTORS,
  EMPLOYER_TYPES, WORK_CATEGORIES, YEARS, COHORTS, EMPLOYED_PATHWAYS, VENTURE_PATHWAYS,
  type Pathway, type Program, type ParticipantType, type Gender, type Youth,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";
import StatsKpiCard from "../StatsKpiCard";
import { DonutRing as Donut } from "@/components/DonutChart";

/* ── palette ──────────────────────────────────────────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const C_BLUE = "#185FA5";
const C_GREEN = "#1D9E75";
const C_VIOLET = "#7F77DD";
const C_AMBER = "#E0A458";

const PROGRAM_COLOR: Record<Program, string> = { HEMP: "#185FA5", HENT: "#0F6E56", HECO: "#BA7517" };
const GENDER_COLOR: Record<Gender, string> = { Female: "#185FA5", Male: "#1D9E75", "Non-binary": "#7F77DD" };
const PATHWAY_COLOR: Record<Pathway, string> = {
  "Wage Employment": "#185FA5", "Internship": "#3FA7E0", "Venture Founder": "#1D9E75",
  "Wage & Venture": "#7F77DD", "Further Education": "#E0A458", "Seeking Employment": "#D17A86", "Other": "#C5D2E0",
};
const OUTCOME_COLOR: Record<string, string> = { Employment: C_BLUE, Internships: "#3FA7E0", Ventures: C_GREEN };
const WORKCAT_COLOR: Record<string, string> = {
  "Full-time": "#185FA5", "Part-time": "#1D9E75", "Contract": "#7F77DD",
  "Internship": "#3FA7E0", "Self-employed": "#E0A458", "Founder": "#0F6E56",
  "Permanent": "#185FA5", "Freelance": "#1D9E75",
};
const EMPLOYER_PALETTE = ["#185FA5", "#1D9E75", "#7F77DD", "#E0A458", "#0C447C"];

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();

const isEmployed = (y: Youth) => EMPLOYED_PATHWAYS.includes(y.pathway) || y.participantType === "Venture Employee";
const isInternship = (y: Youth) => y.pathway === "Internship";
const isVenture = (y: Youth) => VENTURE_PATHWAYS.includes(y.pathway);

/* derived work category (jobs-by-category view) */
function workCategory(y: Youth): string | null {
  if (isVenture(y)) return "Founder";
  if (isInternship(y)) return "Internship";
  if (y.participantType === "Venture Employee" || isEmployed(y)) {
    if (y.employmentType === "Part-time") return "Part-time";
    if (y.employmentType === "Contract") return "Contract";
    return "Full-time";
  }
  return null;
}
/* derived employment type (quality view) */
function qualityType(y: Youth): string | null {
  if (isVenture(y)) return "Founder";
  if (isInternship(y)) return "Internship";
  if (y.participantType === "Venture Employee" || isEmployed(y)) {
    if (y.employmentType === "Part-time") return "Freelance";
    if (y.employmentType === "Contract") return "Contract";
    return y.permanent ? "Permanent" : "Contract";
  }
  return null;
}
const QUALITY_TYPES = ["Permanent", "Contract", "Internship", "Freelance", "Founder"];

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
        <button title="Export" style={{ flexShrink: 0, color: "rgba(181,212,244,0.75)", display: "flex", padding: 3 }}>
          <Download size={13} />
        </button>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>{children}</div>
    </div>
  );
}

/* white KPI card: blue border, consistent icon, info tooltip */
function WhiteKpi({ Icon, label, value, tooltip }: {
  Icon: typeof Users; label: string; value: string; tooltip: string;
}) {
  const [tip, setTip] = useState(false);
  const ACCENT = "#185FA5";
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${ACCENT}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: `${ACCENT}1A`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} color={ACCENT} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1.05 }}>{value}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
          <span style={{ position: "relative", cursor: "pointer", display: "flex", flexShrink: 0 }}
            onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
            <Info size={10} color="#9CA3AF" />
            {tip && (
              <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0, lineHeight: 1.5, padding: "7px 10px", borderRadius: 6, width: 180, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
                {tooltip}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

/* light section KPI strip card */
function MiniKpi({ Icon, label, value }: { Icon: typeof Users; label: string; value: string }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${C_BLUE}`, padding: "13px 15px", display: "flex", alignItems: "center", gap: 11 }}>
      <span style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: `${C_BLUE}1A`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color={C_BLUE} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 21, fontWeight: 800, color: NAVY, lineHeight: 1.05 }}>{value}</p>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{label}</p>
      </div>
    </div>
  );
}

function ChartTip({ active, payload, label, pct }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{fmt(p.value)}{pct ? "%" : ""}</b>
        </p>
      ))}
    </div>
  );
}
const PctTip = (props: any) => <ChartTip {...props} pct />;

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

const YIW_SECTIONS: { n: number; label: string }[] = [
  { n: 1, label: "Work Pathways" },
  { n: 2, label: "Jobs Created" },
  { n: 3, label: "Inclusion" },
  { n: 4, label: "Quality of Work" },
];

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function YouthInWorkPage() {
  const [program, setProgram] = useState<"all" | Program>("all");
  const [ptype, setPtype] = useState<"all" | ParticipantType>("all");
  const [gender, setGender] = useState<"all" | Gender>("all");
  const [country, setCountry] = useState<string>("all");
  const [cohort, setCohort] = useState<"all" | number>("all");
  const [pathway, setPathway] = useState<"all" | Pathway>("all");
  const [activeSection, setActiveSection] = useState<number | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const show = (n: number) => activeSection === "all" || activeSection === n;

  const scope = useMemo(() =>
    YOUTH.filter(y => {
      if (program !== "all" && y.program !== program) return false;
      if (ptype !== "all" && y.participantType !== ptype) return false;
      if (gender !== "all" && y.gender !== gender) return false;
      if (country !== "all" && y.country !== country) return false;
      if (cohort !== "all" && y.cohort !== cohort) return false;
      if (pathway !== "all" && y.pathway !== pathway) return false;
      return true;
    }),
  [program, ptype, gender, country, cohort, pathway]);

  /* ── Executive snapshot KPIs ───────────────────────── */
  const kpis = useMemo(() => {
    const total = scope.length;
    const employed = scope.filter(isEmployed).length;
    const interns = scope.filter(isInternship).length;
    const founders = scope.filter(isVenture).length;
    const jobsCreated = scope.reduce((s, y) => s + y.jobsCreated, 0);
    return {
      total, employed, interns, founders, jobsCreated,
      femalePct: share(scope.filter(y => y.gender === "Female").length, total),
      africaPct: share(scope.filter(y => y.basedInAfrica).length, total),
    };
  }, [scope]);

  /* ── Section 1: work pathways ──────────────────────── */
  const pathwayDist = useMemo(() =>
    PATHWAYS.map(p => ({ name: p, value: scope.filter(y => y.pathway === p).length })).filter(d => d.value > 0),
  [scope]);

  const participantCompare = useMemo(() => {
    const groups: { name: string; rows: Youth[] }[] = [
      { name: "Students", rows: scope.filter(y => y.participantType === "Student") },
      { name: "Alumni", rows: scope.filter(y => y.participantType === "Alumni") },
      { name: "Scholars", rows: scope.filter(y => y.scholar) },
    ];
    const metrics: { metric: string; pick: (y: Youth) => boolean }[] = [
      { metric: "Female", pick: y => y.gender === "Female" },
      { metric: "In Africa", pick: y => y.basedInAfrica },
      { metric: "Employment", pick: isEmployed },
      { metric: "Internships", pick: isInternship },
      { metric: "Ventures", pick: isVenture },
      { metric: "Further Ed.", pick: y => y.pathway === "Further Education" },
    ];
    return metrics.map(m => {
      const rec: Record<string, number | string> = { metric: m.metric };
      groups.forEach(g => { rec[g.name] = share(g.rows.filter(m.pick).length, g.rows.length); });
      return rec;
    });
  }, [scope]);

  const byProgram = useMemo(() =>
    PROGRAMS.map(p => {
      const rows = scope.filter(y => y.program === p);
      return {
        program: p,
        Employment: rows.filter(isEmployed).length,
        Internships: rows.filter(isInternship).length,
        Ventures: rows.filter(isVenture).length,
      };
    }),
  [scope]);

  const pathwayTrend = useMemo(() =>
    YEARS.map(yr => {
      const rows = scope.filter(y => y.year === yr);
      return {
        year: yr,
        Employment: rows.filter(isEmployed).length,
        Internships: rows.filter(isInternship).length,
        Ventures: rows.filter(isVenture).length,
        "Further Ed.": rows.filter(y => y.pathway === "Further Education").length,
      };
    }),
  [scope]);

  /* ── Section 2: jobs created ───────────────────────── */
  const jobs = useMemo(() => {
    const primary = scope.filter(y => y.primaryJob).length;
    const secondary = scope.filter(y => y.secondaryJob).length;
    const jobsCreated = scope.reduce((s, y) => s + y.jobsCreated, 0);
    const scopedVentures = program === "all" ? VENTURES : VENTURES.filter(v => v.program === program);
    const youthEmployed = scopedVentures.reduce((s, v) => s + v.studentEmployees + v.alumniEmployees, 0);
    const primarySecondary = [
      { name: "Primary jobs", value: primary },
      { name: "Secondary jobs", value: secondary },
    ];
    const byCategory = WORK_CATEGORIES.map(c => ({ name: c, value: scope.filter(y => workCategory(y) === c).length })).filter(d => d.value > 0);
    const createdByProgram = PROGRAMS.map(p => ({ program: p, jobs: scope.filter(y => y.program === p).reduce((s, y) => s + y.jobsCreated, 0) }));
    const topVentures = scopedVentures.slice(0, 8).map(v => ({ name: v.name, value: v.employees, program: v.program }));
    const trend = YEARS.map(yr => {
      const rows = scope.filter(y => y.year === yr);
      return {
        year: yr,
        Employment: rows.filter(isEmployed).length,
        Internships: rows.filter(isInternship).length,
        "Jobs Created": rows.reduce((s, y) => s + y.jobsCreated, 0),
      };
    });
    return { primary, secondary, jobsCreated, youthEmployed, primarySecondary, byCategory, createdByProgram, topVentures, trend };
  }, [scope, program]);

  /* ── Section 3: inclusion ──────────────────────────── */
  const inclusion = useMemo(() => {
    const t = scope.length;
    const cards = {
      female: share(scope.filter(y => y.gender === "Female").length, t),
      refugee: share(scope.filter(y => y.refugee).length, t),
      pwd: share(scope.filter(y => y.pwd).length, t),
      scholar: share(scope.filter(y => y.scholar).length, t),
      africa: share(scope.filter(y => y.basedInAfrica).length, t),
    };
    const employed = scope.filter(isEmployed);
    const priorityGroups = [
      { name: "Women", value: employed.filter(y => y.gender === "Female").length },
      { name: "Refugees / IDPs", value: employed.filter(y => y.refugee).length },
      { name: "Persons w/ disability", value: employed.filter(y => y.pwd).length },
      { name: "Scholars", value: employed.filter(y => y.scholar).length },
    ].sort((a, b) => b.value - a.value);
    const genderByPathway = [
      { name: "Employment", rows: employed },
      { name: "Internships", rows: scope.filter(isInternship) },
      { name: "Ventures", rows: scope.filter(isVenture) },
    ].map(g => {
      const rec: Record<string, number | string> = { pathway: g.name };
      GENDERS.forEach(gd => { rec[gd] = share(g.rows.filter(y => y.gender === gd).length, g.rows.length); });
      return rec;
    });
    const africaSplit = [
      { name: "Based in Africa", value: scope.filter(y => y.basedInAfrica).length },
      { name: "Outside Africa", value: scope.filter(y => !y.basedInAfrica).length },
    ];
    const topCountries = COUNTRIES.map(c => ({ name: c === "Diaspora" ? "Diaspora / Outside" : c, value: scope.filter(y => y.country === c).length })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    const byProgram = PROGRAMS.map(p => {
      const rows = scope.filter(y => y.program === p);
      return {
        program: p,
        Female: share(rows.filter(y => y.gender === "Female").length, rows.length),
        "Refugee / IDP": share(rows.filter(y => y.refugee).length, rows.length),
        PwD: share(rows.filter(y => y.pwd).length, rows.length),
      };
    });
    return { cards, priorityGroups, genderByPathway, africaSplit, topCountries, byProgram };
  }, [scope]);

  /* ── Section 4: quality of work ────────────────────── */
  const quality = useMemo(() => {
    const working = scope.filter(y => qualityType(y) !== null);
    const empType = QUALITY_TYPES.map(c => ({ name: c, value: scope.filter(y => qualityType(y) === c).length })).filter(d => d.value > 0);
    const indicators = [
      { name: "Living wage", value: 68 }, { name: "Job security", value: 74 },
      { name: "Benefits", value: 61 }, { name: "Skills match", value: 83 }, { name: "Career progression", value: 77 },
    ];
    const accessing = scope.filter(y => y.decentWork).length;
    const dignified = [
      { name: "Accessing dignified work", value: accessing },
      { name: "Progressing toward it", value: working.length - accessing },
    ];
    const beforeAfter = [
      { metric: "Employed", Before: 28, After: share(scope.filter(isEmployed).length, scope.length) },
      { metric: "Decent work", Before: 19, After: share(accessing, working.length) },
      { metric: "Leadership", Before: 8, After: share(working.filter(y => y.leadership).length, working.length) },
    ];
    const sectors = SECTORS.map(s => ({ name: s, value: scope.filter(y => y.primaryJob && y.sector === s).length })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    const employers = EMPLOYER_TYPES.map(e => ({ name: e, value: scope.filter(y => y.primaryJob && y.employerType === e).length })).filter(d => d.value > 0);
    return { empType, indicators, dignified, dignifiedTotal: working.length, beforeAfter, sectors, employers };
  }, [scope]);

  const activeCount = [program, ptype, gender, country, cohort, pathway].filter(v => v !== "all").length;
  const reset = () => { setProgram("all"); setPtype("all"); setGender("all"); setCountry("all"); setCohort("all"); setPathway("all"); };

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Youth in Work</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>How are CHII participants accessing and creating meaningful work?</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ EXECUTIVE SNAPSHOT ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Participants" num={kpis.total} sub="students + alumni" Icon={Users}
              tooltip="Total youth tracked across the CHII ecosystem." />
            <StatsKpiCard label="In Employment" num={kpis.employed} sub="primary employment" Icon={Briefcase}
              tooltip="Youth in wage employment, including those at supported ventures." />
            <StatsKpiCard label="In Internships" num={kpis.interns} sub="active internships" Icon={GraduationCap}
              tooltip="Youth currently in internship placements." />
            <StatsKpiCard label="Venture Founders" num={kpis.founders} sub="running ventures" Icon={Rocket}
              tooltip="Participants founding or co-running a venture." />
            <StatsKpiCard label="Jobs Created" num={kpis.jobsCreated} sub="by supported ventures" Icon={Hammer}
              tooltip="Positions created by ventures CHII participants founded." />
            <StatsKpiCard label="Female" num={kpis.femalePct} displayFmt={(n) => `${Math.round(n)}%`} sub="of participants" Icon={Heart}
              tooltip="Share of female participants." />
            <StatsKpiCard label="Based in Africa" num={kpis.africaPct} displayFmt={(n) => `${Math.round(n)}%`} sub="on the continent" Icon={Globe}
              tooltip="Share of youth currently based in Africa." />
          </div>

          {/* Section pills (left) + compact filters dropdown (right) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{ n: 0, label: "All Sections" }, ...YIW_SECTIONS].map(({ n, label }) => {
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
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: filtersOpen ? "rgba(255,255,255,0.25)" : C_BLUE, borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>
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
                    <FilterSelect label="Program" value={program} onChange={setProgram}
                      options={[{ value: "all" as const, label: "All Programs" }, ...PROGRAMS.map(p => ({ value: p, label: p }))]} />
                    <FilterSelect label="Participant Type" value={ptype} onChange={setPtype}
                      options={[{ value: "all" as const, label: "All Types" }, ...PARTICIPANT_TYPES.map(p => ({ value: p, label: p }))]} />
                    <FilterSelect label="Gender" value={gender} onChange={setGender}
                      options={[{ value: "all" as const, label: "All Genders" }, ...GENDERS.map(g => ({ value: g, label: g }))]} />
                    <FilterSelect label="Country" value={country} onChange={setCountry}
                      options={[{ value: "all", label: "All Countries" }, ...COUNTRIES.map(c => ({ value: c, label: c }))]} />
                    <FilterSelect label="Cohort" value={cohort} onChange={setCohort}
                      options={[{ value: "all" as const, label: "All Cohorts" }, ...COHORTS.map(c => ({ value: c, label: String(c) }))]} />
                    <FilterSelect label="Employment Status" value={pathway} onChange={setPathway}
                      options={[{ value: "all" as const, label: "All Pathways" }, ...PATHWAYS.map(p => ({ value: p, label: p }))]} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════ SECTION 1 — WORK PATHWAYS ════ */}
        {show(1) && (
        <section className="space-y-4">
          <SectionHeader title="Work Pathways" blurb="How are participants progressing into work?" />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(380px, 540px) minmax(0, 1fr)", gap: 16, alignItems: "stretch" }} className="yiw-grid">
            <Panel title="Work Pathway Distribution" subtitle="Where are our youth today?"
              info="The mix of pathways youth follow: wage employment, internships, ventures, further education, and more.">
              <Donut data={pathwayDist} colors={PATHWAY_COLOR} total={kpis.total} totalLabel="Youth" height={400} legendPercent />
            </Panel>
            <Panel title="Participant Group Comparison" subtitle="Students · Alumni · Scholars across key metrics"
              info="Each metric shows the % within that group. Scholars overlap with students and alumni.">
              <ResponsiveContainer width="100%" height={430}>
                <BarChart data={participantCompare} margin={{ top: 16, right: 10, bottom: 0, left: -16 }} barGap={3} barCategoryGap="22%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fontSize: 9.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {[["Students", C_BLUE], ["Alumni", C_GREEN], ["Scholars", C_VIOLET]].map(([k, c]) => (
                    <Bar key={k} dataKey={k as string} fill={c as string} radius={[3, 3, 0, 0]} barSize={13} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <Panel title="Employment Outcomes by Program" subtitle="Employment · Internships · Ventures across HEMP · HENT · HECO"
            info="Participant counts for each work outcome, stacked within each program.">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={byProgram} margin={{ top: 10, right: 12, bottom: 0, left: -12 }} barCategoryGap="34%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="program" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {(["Employment", "Internships", "Ventures"] as const).map((k, i) => (
                  <Bar key={k} dataKey={k} stackId="o" fill={OUTCOME_COLOR[k]} barSize={70} radius={i === 2 ? [4, 4, 0, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="Employment Pathway Trend" subtitle="How work pathways change over time"
            info="Annual trajectory of each pathway, by recorded year.">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={pathwayTrend} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Employment" stroke={C_BLUE} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Internships" stroke="#3FA7E0" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Ventures" stroke={C_GREEN} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Further Ed." stroke={C_AMBER} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </section>
        )}

        {/* ════ SECTION 2 — JOBS CREATED ════ */}
        {show(2) && (
        <section className="space-y-4">
          <SectionHeader title="Jobs Created" blurb="How many work opportunities are being created across the ecosystem?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <MiniKpi Icon={Briefcase} label="Primary Jobs" value={fmt(jobs.primary)} />
            <MiniKpi Icon={Layers} label="Secondary Jobs" value={fmt(jobs.secondary)} />
            <MiniKpi Icon={Hammer} label="Jobs by Ventures" value={fmt(jobs.jobsCreated)} />
            <MiniKpi Icon={Users} label="Youth Employed by Ventures" value={fmt(jobs.youthEmployed)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Panel title="Primary vs Secondary Jobs" subtitle="Job multiplicity across the workforce"
              info="Primary jobs are someone's main role; secondary jobs are additional income streams.">
              <Donut data={jobs.primarySecondary} colors={[C_BLUE, C_GREEN]} total={jobs.primary + jobs.secondary} totalLabel="Jobs" height={340} legendPercent />
            </Panel>
            <Panel title="Jobs by Category" subtitle="Full-time · Part-time · Contract · Internship · Founder"
              info="How work breaks down across employment categories.">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={jobs.byCategory} margin={{ top: 16, right: 10, bottom: 0, left: -16 }} barCategoryGap="26%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Youth" radius={[4, 4, 0, 0]} barSize={34}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                    {jobs.byCategory.map(d => <Cell key={d.name} fill={WORKCAT_COLOR[d.name] || BAND} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs Created by Program" subtitle="Positions attributable to each program's ventures"
              info="Total jobs created by ventures, grouped by the founder's program.">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={jobs.createdByProgram} margin={{ top: 16, right: 10, bottom: 0, left: -16 }} barCategoryGap="38%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="program" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="jobs" name="Jobs created" barSize={48} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="jobs" position="top" fontSize={10.5} fill={NAVY} fontWeight={700} />
                    {jobs.createdByProgram.map(d => <Cell key={d.program} fill={PROGRAM_COLOR[d.program as Program]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <Panel title="Top Ventures Creating Jobs" subtitle="Supported ventures ranked by positions created"
            info="The supported ventures employing the most people. Coloured by the founder's program.">
            <ResponsiveContainer width="100%" height={Math.max(240, jobs.topVentures.length * 34)}>
              <BarChart layout="vertical" data={jobs.topVentures} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={110} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Employees" radius={[0, 4, 4, 0]} barSize={18}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  {jobs.topVentures.map(d => <Cell key={d.name} fill={PROGRAM_COLOR[d.program as Program]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
              {PROGRAMS.map(p => (
                <span key={p} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: PROGRAM_COLOR[p] }} />{p}
                </span>
              ))}
            </div>
          </Panel>
          <Panel title="Employment & Jobs Created Trend" subtitle="Employment · Internships · Jobs Created over time"
            info="Combined annual trajectory of jobs secured and jobs generated.">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={jobs.trend} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Employment" stroke={C_BLUE} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Internships" stroke="#3FA7E0" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Jobs Created" stroke={C_GREEN} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </section>
        )}

        {/* ════ SECTION 3 — INCLUSION ════ */}
        {show(3) && (
        <section className="space-y-4">
          <SectionHeader title="Inclusion" blurb="Who is accessing work opportunities?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12 }}>
            <MiniKpi Icon={Heart} label="Female" value={`${inclusion.cards.female}%`} />
            <MiniKpi Icon={Shield} label="Refugee / IDP" value={`${inclusion.cards.refugee}%`} />
            <MiniKpi Icon={Accessibility} label="Persons w/ Disability" value={`${inclusion.cards.pwd}%`} />
            <MiniKpi Icon={GraduationCap} label="Scholars" value={`${inclusion.cards.scholar}%`} />
            <MiniKpi Icon={Globe} label="Based in Africa" value={`${inclusion.cards.africa}%`} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Employment by Priority Group" subtitle="Employed participants in each group"
              info="Number of employed participants who are women, refugees/IDPs, persons with disability, or scholars.">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart layout="vertical" data={inclusion.priorityGroups} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={140} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Employed" fill={C_BLUE} radius={[0, 4, 4, 0]} barSize={20}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Gender Across Work Pathways" subtitle="Female · Male · Non-binary within each pathway"
              info="Gender composition within Employment, Internships, and Ventures (each on a 0–100% scale).">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={inclusion.genderByPathway} margin={{ top: 16, right: 10, bottom: 0, left: -16 }} barGap={4} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="pathway" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {GENDERS.map(g => <Bar key={g} dataKey={g} fill={GENDER_COLOR[g]} radius={[3, 3, 0, 0]} barSize={20} />)}
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)", gap: 16, alignItems: "start" }} className="yiw-grid">
            <Panel title="Geographic Distribution" subtitle="Africa vs outside Africa"
              info="Share of participants based in Africa versus the diaspora.">
              <Donut data={inclusion.africaSplit} colors={[C_GREEN, "#C5D2E0"]} total={kpis.total} totalLabel="Youth" height={340} legendPercent />
            </Panel>
            <Panel title="Top Countries" subtitle="Participants by country, ranked"
              info="Where participants are based, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(220, inclusion.topCountries.length * 28)}>
                <BarChart layout="vertical" data={inclusion.topCountries} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={120} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Youth" fill={BAND} radius={[0, 4, 4, 0]} barSize={15}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <Panel title="Inclusion by Program" subtitle="Priority-group share within HEMP · HENT · HECO"
            info="Share of each priority group within each program (0–100% scale).">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inclusion.byProgram} margin={{ top: 16, right: 12, bottom: 0, left: -12 }} barGap={5} barCategoryGap="34%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="program" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {([["Female", C_BLUE], ["Refugee / IDP", C_AMBER], ["PwD", C_VIOLET]] as const).map(([k, c]) => (
                  <Bar key={k} dataKey={k} fill={c} radius={[3, 3, 0, 0]} barSize={24} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </section>
        )}

        {/* ════ SECTION 4 — QUALITY OF WORK ════ */}
        {show(4) && (
        <section className="space-y-4">
          <SectionHeader title="Quality of Work" blurb="Are participants accessing meaningful and sustainable work?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Panel title="Employment Type" subtitle="Permanent · Contract · Internship · Freelance · Founder"
              info="Composition of how working participants are engaged.">
              <Donut data={quality.empType} colors={WORKCAT_COLOR} total={quality.empType.reduce((s, d) => s + d.value, 0)} totalLabel="Working" height={340} legendPercent />
            </Panel>
            <Panel title="Decent Work Indicators" subtitle="Share reporting each, %"
              info="Share of working participants reporting each decent-work indicator (0–100%).">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart layout="vertical" data={quality.indicators} margin={{ top: 4, right: 38, bottom: 0, left: 8 }}>
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={130} axisLine={false} tickLine={false} />
                  <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Reporting" fill={C_GREEN} radius={[0, 4, 4, 0]} barSize={18}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} formatter={(v: number) => `${v}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Panel title="Employment Before vs After CHII" subtitle="Change in outcomes following CHII engagement"
              info="Share of participants meeting each outcome before versus after engaging with CHII.">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={quality.beforeAfter} margin={{ top: 16, right: 10, bottom: 0, left: -16 }} barGap={6} barCategoryGap="34%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Before" fill="#C5D2E0" radius={[3, 3, 0, 0]} barSize={26}>
                    <LabelList dataKey="Before" position="top" fontSize={9.5} fill="#374151" formatter={(v: number) => `${v}%`} />
                  </Bar>
                  <Bar dataKey="After" fill={C_BLUE} radius={[3, 3, 0, 0]} barSize={26}>
                    <LabelList dataKey="After" position="top" fontSize={9.5} fill="#374151" formatter={(v: number) => `${v}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Dignified Work Status" subtitle="Accessing vs progressing"
              info="Working participants accessing dignified work versus those still progressing toward it.">
              <Donut data={quality.dignified} colors={[C_BLUE, "#C5D2E0"]} total={quality.dignifiedTotal} totalLabel="Working" height={340} legendPercent />
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Panel title="Employment Sector" subtitle="Where working participants are placed"
              info="Distribution of primary jobs across sectors, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(220, quality.sectors.length * 30)}>
                <BarChart layout="vertical" data={quality.sectors} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Youth" fill={BAND} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Employer Type" subtitle="Startup · Corporate · Public · NGO · Self-employed"
              info="Type of employer for working participants.">
              <Donut data={quality.employers} colors={EMPLOYER_PALETTE} total={quality.employers.reduce((s, d) => s + d.value, 0)} totalLabel="Working" height={340} legendPercent />
            </Panel>
          </div>
        </section>
        )}

        <FeaturedImpactStory footer />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .yiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
