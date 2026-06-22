"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Users, Building2, GraduationCap,
  SlidersHorizontal, X, Layers, BookOpen, Shield, Accessibility,
} from "lucide-react";
import {
  OUTREACH_PARTICIPANTS, INSTITUTIONS, PILLARS, INTERVENTIONS,
  INTERVENTIONS_BY_PILLAR, GENDERS, STATUSES, TREND_YEARS,
  type OutreachParticipant, type Pillar, type Gender,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";
import StatsKpiCard from "../StatsKpiCard";
import { DonutRing as Donut } from "@/components/DonutChart";

/* ── palette ─────────────────────────────────────────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const C_FEMALE = "#185FA5";
const C_MALE = "#1D9E75";
const C_NB = "#7F77DD";

const PILLAR_COLOR: Record<Pillar, string> = { HEMP: "#185FA5", HENT: "#0F6E56", HECO: "#BA7517" };
const GENDER_COLOR: Record<Gender, string> = { Female: C_FEMALE, Male: C_MALE, "Non-binary": C_NB };
/* Reach & Participation reports gender as Female / Male only */
const REACH_GENDERS: Gender[] = ["Female", "Male"];
/* outreach reporting years: 2022 → 2026 */
const OA_YEARS = [2022, 2023, 2024, 2025, 2026];

/* Student-population reference data (academic programmes) */
const POP_SUMMARY = [
  { name: "All Students", value: 6482 },
  { name: "MCF Scholars", value: 1643 },
  { name: "Fee-Paying", value: 4839 },
];
const POP_BY_PROGRAM = [
  { name: "BSc Software Eng", Graduated: 820, "Not graduated": 540 },
  { name: "Computer Science", Graduated: 760, "Not graduated": 480 },
  { name: "Entrepreneurial Leadership", Graduated: 690, "Not graduated": 520 },
  { name: "International Business & Trade", Graduated: 610, "Not graduated": 430 },
  { name: "Global Challenges", Graduated: 470, "Not graduated": 360 },
];
const POP_GENDER_BY_PROGRAM = [
  { name: "BSc Software Eng", Female: 612, Male: 748 },
  { name: "Computer Science", Female: 560, Male: 680 },
  { name: "Entrepreneurial Leadership", Female: 640, Male: 570 },
  { name: "International Business & Trade", Female: 540, Male: 500 },
  { name: "Global Challenges", Female: 430, Male: 400 },
];
const STATUS_COLOR: Record<string, string> = {
  Completed: "#0F6E56", Active: "#185FA5", "In-progress": "#85B7EB", Dropped: "#C5D2E0",
};

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();

const PILLAR_OF: Record<string, Pillar> = Object.fromEntries(
  (Object.entries(INTERVENTIONS_BY_PILLAR) as [Pillar, string[]][])
    .flatMap(([p, list]) => list.map(i => [i, p]))
);

type ProgramFilter = "All" | Pillar;
type PopulationFilter = "all" | "mission" | "non";

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

/* serialize the panel's chart SVG and download it as a PNG */
function downloadChart(container: HTMLElement, name: string) {
  const svg = container.querySelector("svg") as SVGSVGElement | null;
  if (!svg) return;
  const w = svg.clientWidth || 600;
  const h = svg.clientHeight || 360;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = w * 2; canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(2, 2);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(b => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `${name.replace(/[^\w]+/g, "-").toLowerCase()}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      <div style={{ backgroundColor: BAND, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: TICK, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
          <p style={{ fontSize: 9.5, color: "rgba(181,212,244,0.7)", marginTop: 1 }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}
        onContextMenu={(e) => { e.preventDefault(); downloadChart(e.currentTarget as HTMLElement, title); }}
        title="Right-click to download as PNG">
        {children}
      </div>
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

/* labeled select for the filter bar */
function FilterSelect<T extends string | number>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: "1 1 150px" }}>
      <label style={{ fontSize: 9.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <select value={String(value)} onChange={e => {
        const raw = e.target.value;
        const match = options.find(o => String(o.value) === raw);
        if (match) onChange(match.value);
      }}
        style={{ width: "100%", fontSize: 12, border: "1px solid rgba(0,33,71,0.15)", borderRadius: 6, padding: "7px 9px", color: NAVY, backgroundColor: "white", cursor: "pointer" }}>
        {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ♀ woman / female symbol icon (lucide has no female glyph in this version) */
function WomanIcon({ size = 20, color, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v8M9 18h6" />
    </svg>
  );
}

/* small inline KPI used inside demographic sections — white card, blue border */
function MiniKpi({ Icon, label, value }: { Icon: React.ComponentType<any>; label: string; value: string }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${C_FEMALE}`, padding: "13px 15px", display: "flex", alignItems: "center", gap: 11 }}>
      <span style={{ width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={C_FEMALE} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 21, fontWeight: 800, color: NAVY, lineHeight: 1.05 }}>{value}</p>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      </div>
    </div>
  );
}

const OA_SECTIONS: { n: number; label: string }[] = [
  { n: 1, label: "Reach & Participation" },
  { n: 2, label: "Who Are We Reaching?" },
  { n: 3, label: "Student Population" },
  { n: 4, label: "Engagement Outcomes" },
];

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function OutreachPage() {
  const [program, setProgram] = useState<ProgramFilter>("All");
  const [institution, setInstitution] = useState<string>("all");
  const [population, setPopulation] = useState<PopulationFilter>("all");
  const [year, setYear] = useState<"all" | number>("all");
  const [intervention, setIntervention] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<number | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const show = (n: number) => activeSection === "all" || activeSection === n;

  const scope = useMemo(() =>
    OUTREACH_PARTICIPANTS.filter(p => {
      if (program !== "All" && p.pillar !== program) return false;
      if (institution !== "all" && p.institution !== institution) return false;
      if (population === "mission" && !p.missionStudent) return false;
      if (population === "non" && p.missionStudent) return false;
      if (year !== "all" && p.yearEngaged !== year) return false;
      if (intervention !== "all" && p.intervention !== intervention) return false;
      return true;
    }),
  [program, institution, population, year, intervention]);

  /* ── KPIs ─────────────────────────────────────────── */
  const kpis = useMemo(() => {
    const total = scope.length;
    const female = scope.filter(s => s.gender === "Female").length;
    const mission = scope.filter(s => s.missionStudent).length;
    const completed = scope.filter(s => s.status === "Completed").length;
    const interventionCount = new Set(scope.map(s => s.intervention)).size;
    const institutionCount = new Set(scope.map(s => s.institution)).size;
    return {
      total, femalePct: share(female, total), missionPct: share(mission, total),
      interventionCount, institutionCount, completionPct: share(completed, total),
    };
  }, [scope]);

  /* ── Section 2: reach ──────────────────────────────── */
  // Participants by program, stacked by gender
  const byProgram = useMemo(() =>
    PILLARS.map(p => {
      const rows = scope.filter(s => s.pillar === p);
      const rec: Record<string, number | string> = { program: p, total: rows.length };
      REACH_GENDERS.forEach(g => { rec[g] = rows.filter(s => s.gender === g).length; });
      return rec;
    }),
  [scope]);

  // Participation by intervention, coloured by program
  const byIntervention = useMemo(() =>
    INTERVENTIONS.map(name => ({
      name, value: scope.filter(s => s.intervention === name).length, pillar: PILLAR_OF[name],
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value),
  [scope]);

  // Participation trend — from 2022 onward
  // Annual = participants first engaged that year; Cumulative = total reached by that year.
  const trend = useMemo(() => OA_YEARS.map(y => ({
    year: y,
    Cumulative: scope.filter(s => s.yearEngaged <= y).length,
    Annual: scope.filter(s => s.yearEngaged === y).length,
  })), [scope]);

  /* ── Section 3: demographics ───────────────────────── */
  const genderData = useMemo(() =>
    REACH_GENDERS.map(g => ({ name: g, value: scope.filter(s => s.gender === g).length })).filter(d => d.value > 0),
  [scope]);
  const genderTotal = genderData.reduce((s, d) => s + d.value, 0);

  const inclusion = useMemo(() => {
    const t = scope.length;
    return {
      female: share(scope.filter(s => s.gender === "Female").length, t),
      refugee: share(scope.filter(s => s.refugee).length, t),
      pwd: share(scope.filter(s => s.pwd).length, t),
      mission: share(scope.filter(s => s.missionStudent).length, t),
    };
  }, [scope]);

  // Inclusion by program — grouped (metric rows × program series)
  const inclusionByProgram = useMemo(() => {
    const metrics: { key: string; pick: (s: OutreachParticipant) => boolean }[] = [
      { key: "Female", pick: s => s.gender === "Female" },
      { key: "Refugee / IDP", pick: s => s.refugee },
      { key: "PwD", pick: s => s.pwd },
      { key: "Non-binary", pick: s => s.gender === "Non-binary" },
    ];
    return metrics.map(m => {
      const rec: Record<string, number | string> = { metric: m.key };
      PILLARS.forEach(p => {
        const rows = scope.filter(s => s.pillar === p);
        rec[p] = share(rows.filter(m.pick).length, rows.length);
      });
      return rec;
    });
  }, [scope]);

  /* ── Section 5: engagement ─────────────────────────── */
  const byStatus = useMemo(() =>
    INTERVENTIONS.map(name => {
      const rows = scope.filter(s => s.intervention === name);
      const rec: Record<string, number | string> = { name, total: rows.length };
      STATUSES.forEach(st => { rec[st] = rows.filter(s => s.status === st).length; });
      return rec;
    }).filter(d => (d.total as number) > 0).sort((a, b) => (b.total as number) - (a.total as number)),
  [scope]);

  const completionByProgram = useMemo(() =>
    PILLARS.map(p => {
      const rows = scope.filter(s => s.pillar === p);
      return { program: p, rate: share(rows.filter(s => s.status === "Completed").length, rows.length) };
    }),
  [scope]);

  const byInstitution = useMemo(() =>
    INTERVENTIONS.map(name => {
      const rows = scope.filter(s => s.intervention === name);
      const rec: Record<string, number | string> = { name, total: rows.length };
      INSTITUTIONS.forEach(inst => { rec[inst] = rows.filter(s => s.institution === inst).length; });
      return rec;
    }).filter(d => (d.total as number) > 0).sort((a, b) => (b.total as number) - (a.total as number)),
  [scope]);

  const activeCount = [program !== "All", institution !== "all", population !== "all", year !== "all", intervention !== "all"].filter(Boolean).length;
  const reset = () => { setProgram("All"); setInstitution("all"); setPopulation("all"); setYear("all"); setIntervention("all"); };

  /* compact filters dropdown (button + popover), placed in the section-pills row */
  const renderFilters = () => (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setFiltersOpen(o => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
          border: `1px solid ${activeCount || filtersOpen ? NAVY : "rgba(0,33,71,0.15)"}`,
          backgroundColor: filtersOpen ? NAVY : "white", color: filtersOpen ? "white" : "#374151" }}>
        <SlidersHorizontal size={13} />
        Filters
        {activeCount > 0 && (
          <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: filtersOpen ? "rgba(255,255,255,0.25)" : C_FEMALE, borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>
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
              options={[{ value: "All", label: "All Programs" }, ...PILLARS.map(p => ({ value: p, label: p }))]} />
            <FilterSelect label="Institution" value={institution} onChange={setInstitution}
              options={[{ value: "all", label: "All Institutions" }, ...INSTITUTIONS.map(c => ({ value: c, label: c }))]} />
            <FilterSelect label="Student Population" value={population} onChange={setPopulation}
              options={[{ value: "all", label: "All Students" }, { value: "mission", label: "Mission Students" }, { value: "non", label: "Non-mission" }]} />
            <FilterSelect label="Year" value={year} onChange={setYear}
              options={[{ value: "all", label: "All Years" }, ...OA_YEARS.map(y => ({ value: y, label: String(y) }))]} />
            <FilterSelect label="Intervention" value={intervention} onChange={setIntervention}
              options={[{ value: "all", label: "All Interventions" }, ...INTERVENTIONS.map(i => ({ value: i, label: i }))]} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.45), rgba(4,44,83,0.15))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Outreach &amp; Access</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Outreach interventions across CHII&apos;s HEMP · HENT · HECO programs</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ SECTION 1 — EXECUTIVE OVERVIEW ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Total Participants" num={kpis.total} sub="People reached in scope" Icon={Users}
              tooltip="Unique participants engaged across CHII outreach interventions within the current filters." />
            <StatsKpiCard label="Interventions" num={kpis.interventionCount} sub="Active outreach programs" Icon={Layers}
              tooltip="Distinct outreach interventions in scope (HealthX, Masterclasses, Mentorship, Hackathons, and more)." />
            <StatsKpiCard label="Institutions" num={kpis.institutionCount} sub="Partner institutions reached" Icon={Building2}
              tooltip="Number of partner institutions (ALU, ALX, ALCHE, Other) represented in the current scope." />
            <StatsKpiCard label="Female Share" num={kpis.femalePct} displayFmt={(n) => `${Math.round(n)}%`} sub="Of participants" Icon={WomanIcon}
              tooltip="Share of female participants across outreach interventions in scope." />
            <StatsKpiCard label="Mission Students" num={kpis.missionPct} displayFmt={(n) => `${Math.round(n)}%`} sub="Also degree / mission students" Icon={BookOpen}
              tooltip="Share of participants who are also mission (degree) students." />
            <StatsKpiCard label="Completion Rate" num={kpis.completionPct} displayFmt={(n) => `${Math.round(n)}%`} sub="Completed engagement" Icon={GraduationCap}
              tooltip="Participants who completed their outreach engagement as a share of those in scope." />
          </div>

          {/* Section pills (left) + compact filters dropdown (right) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{ n: 0, label: "All Sections" }, ...OA_SECTIONS].map(({ n, label }) => {
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
            {renderFilters()}
          </div>
        </section>

        {/* ════ SECTION 2 — REACH & PARTICIPATION ════ */}
        {show(1) && (
        <section className="space-y-4">
          <SectionHeader title="Reach & Participation" blurb="How many people did we reach, and where did participation come from?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Participants by Program" subtitle="HEMP · HENT · HECO, split by gender">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byProgram} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                  <CartesianGrid vertical={false} stroke="rgba(0,33,71,0.08)" />
                  <XAxis dataKey="program" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {REACH_GENDERS.map((g, i) => (
                    <Bar key={g} dataKey={g} stackId="g" fill={GENDER_COLOR[g]} barSize={46}
                      radius={i === REACH_GENDERS.length - 1 ? [4, 4, 0, 0] : undefined} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Participation by Intervention" subtitle="Reach per outreach program, coloured by pillar">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={byIntervention} margin={{ top: 4, right: 36, bottom: 0, left: 8 }} barSize={16} barCategoryGap="20%">
                  <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={104} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Participants" radius={[0, 4, 4, 0]}
                    label={{ position: "right", fontSize: 10, fill: "#374151", fontWeight: 700 }}>
                    {byIntervention.map((d, i) => <Cell key={i} fill={PILLAR_COLOR[d.pillar]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                {PILLARS.map(p => (
                  <span key={p} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: PILLAR_COLOR[p] }} />{p}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <Panel title="Participation Trend" subtitle="Annual (engaged that year) vs cumulative (total reached by year), 2022–2026">
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={trend} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                <Line type="monotone" dataKey="Cumulative" stroke={C_FEMALE} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Annual" stroke={C_MALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        )}

        {/* ════ SECTION 3 — WHO ARE WE REACHING ════ */}
        {show(2) && (
        <section className="space-y-4">
          <SectionHeader title="Who Are We Reaching?" blurb="The demographics and inclusion profile of participants." />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.45fr) minmax(0, 0.55fr)", gap: 16, alignItems: "stretch" }} className="oa-grid">
            <Panel title="Gender Distribution" subtitle="Female · Male">
              <Donut data={genderData} colors={GENDER_COLOR} total={genderTotal} totalLabel="Total" height={360} legendPercent />
            </Panel>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                <MiniKpi Icon={WomanIcon} label="Female" value={`${inclusion.female}%`} />
                <MiniKpi Icon={Shield} label="Refugee / IDP" value={`${inclusion.refugee}%`} />
                <MiniKpi Icon={Accessibility} label="Persons w/ Disability" value={`${inclusion.pwd}%`} />
                <MiniKpi Icon={BookOpen} label="Mission Students" value={`${inclusion.mission}%`} />
              </div>

              <Panel title="Inclusion by Program" subtitle="Share of each group within HEMP · HENT · HECO">
                <ResponsiveContainer width="100%" height={330}>
                  <BarChart layout="vertical" data={inclusionByProgram} margin={{ top: 4, right: 36, bottom: 0, left: 8 }} barCategoryGap="26%">
                    <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
                    <XAxis type="number" domain={[0, 100]} tickCount={6} tick={{ fontSize: 9, fill: "#9CA3AF" }} tickFormatter={(v: number) => `${v}%`} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="metric" tick={{ fontSize: 10, fill: "#374151" }} width={92} axisLine={false} tickLine={false} />
                    <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    {PILLARS.map(p => (
                      <Bar key={p} dataKey={p} fill={PILLAR_COLOR[p]} barSize={11} radius={[0, 3, 3, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </div>
        </section>

        )}

        {/* ════ SECTION 4 — STUDENT POPULATION PROFILE ════ */}
        {show(3) && (
        <section className="space-y-4">
          <SectionHeader title="Student Population Profile" blurb="The wider student body outreach draws from." />

          <Panel title="Population Summary" subtitle="Total enrolment by student population">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={POP_SUMMARY} margin={{ top: 18, right: 10, bottom: 0, left: -8 }} barCategoryGap="42%">
                <CartesianGrid vertical={false} stroke="rgba(0,33,71,0.08)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Students" barSize={56} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" fontSize={11} fill={NAVY} fontWeight={700} />
                  {POP_SUMMARY.map((d, i) => <Cell key={d.name} fill={["#0C447C", "#185FA5", "#1D9E75"][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 10.5, color: "#9CA3AF", marginTop: 8 }}>MCF Scholars: V1 = 1,224 · V2 = 419</p>
          </Panel>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Population by Program — Graduation Status" subtitle="Graduated vs current students per programme">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={POP_BY_PROGRAM} margin={{ top: 4, right: 28, bottom: 0, left: 8 }} barCategoryGap="26%">
                  <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Graduated" stackId="p" fill="#0F6E56" barSize={16} />
                  <Bar dataKey="Not graduated" stackId="p" fill="#C5D2E0" barSize={16} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Population by Program — Gender Split" subtitle="Female vs male per programme">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={POP_GENDER_BY_PROGRAM} margin={{ top: 4, right: 28, bottom: 0, left: 8 }} barCategoryGap="26%">
                  <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Female" stackId="g" fill={C_FEMALE} barSize={16} />
                  <Bar dataKey="Male" stackId="g" fill={C_MALE} barSize={16} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 5 — ENGAGEMENT OUTCOMES ════ */}
        {show(4) && (
        <section className="space-y-4">
          <SectionHeader title="Engagement Outcomes" blurb="What happened after people participated." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Engagement Status by Intervention" subtitle="Completed · Active · In-progress · Dropped">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={byStatus} margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} width={104} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {STATUSES.map((st, i) => (
                    <Bar key={st} dataKey={st} stackId="s" barSize={15}
                      fill={STATUS_COLOR[st]}
                      radius={i === STATUSES.length - 1 ? [0, 4, 4, 0] : undefined} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Completion Rate by Program" subtitle="Completed engagements as a share of each pillar">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={completionByProgram} margin={{ top: 16, right: 10, bottom: 0, left: -16 }} barCategoryGap="34%">
                  <CartesianGrid vertical={false} stroke="rgba(0,33,71,0.08)" />
                  <XAxis dataKey="program" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={(v: number) => `${v}%`} axisLine={false} tickLine={false} />
                  <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="rate" name="Completion" barSize={52} radius={[4, 4, 0, 0]}
                    label={{ position: "top", fontSize: 11, fill: NAVY, fontWeight: 700, formatter: (v: number) => `${v}%` }}>
                    {completionByProgram.map(d => <Cell key={d.program} fill={PILLAR_COLOR[d.program as Pillar]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          <Panel title="Intervention by Institution" subtitle="ALU · ALX · ALCHE · Other">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={byInstitution} margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
                <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} width={104} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {INSTITUTIONS.map((inst, i) => (
                  <Bar key={inst} dataKey={inst} stackId="i" barSize={15}
                    fill={["#0C447C", "#185FA5", "#1D9E75", "#C5D2E0"][i]}
                    radius={i === INSTITUTIONS.length - 1 ? [0, 4, 4, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </section>
        )}

        <FeaturedImpactStory footer />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .oa-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
