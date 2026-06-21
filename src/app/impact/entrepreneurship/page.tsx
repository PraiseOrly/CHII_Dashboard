"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Heart, Info, Download, Rocket, Star, Briefcase,
  Scale, LifeBuoy, AlertTriangle, SlidersHorizontal, X,
} from "lucide-react";
import {
  VENTURES, GENDERS, STATUSES, FUNDING_SOURCES, STAGES, PIPELINE,
  type Gender, type Stage, type Status, type FundingSource,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";
import StatsKpiCard from "../StatsKpiCard";

/* ── palette (matches the rest of the dashboard) ─────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const PALETTE = ["#185FA5", "#1D9E75", "#7F77DD", "#E0A458", "#0C447C", "#D17A86", "#C5D2E0"];
const GENDER_COLOR: Record<Gender, string> = { Female: "#185FA5", Male: "#1D9E75", Other: "#7F77DD" };
const C_ACCENT = "#185FA5";
const C_FEMALE = "#1D9E75";

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();
const usd = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${Math.round(n)}`);

const YEARS = [2020, 2021, 2022, 2023, 2024];

/* ════════════════════════════════════════════════════════
   Shared UI
═══════════════════════════════════════════════════════ */
function SectionHeader({ n, title, blurb }: { n: number; title: string; blurb: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: "white", backgroundColor: NAVY, borderRadius: 999, width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "36px 24px", minHeight: 160 }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(209,122,134,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <AlertTriangle size={20} color={TICK} />
      </div>
      <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>No data to display</p>
      <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, maxWidth: 360, lineHeight: 1.6 }}>{message}</p>
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
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill || p.stroke, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{Number.isInteger(p.value) ? fmt(p.value) : p.value}{p.payload?.pct ? "%" : ""}</b>
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
          {p.name}: <b style={{ color: NAVY }}>${fmt(p.value)}</b>
        </p>
      ))}
    </div>
  );
}

function Donut({ data, colors, total, totalLabel, height = 250, labels = true, innerRadius = 54, outerRadius = 84 }: {
  data: { name: string; value: number }[];
  colors: Record<string, string> | string[];
  total: number; totalLabel: string; height?: number; labels?: boolean; innerRadius?: number; outerRadius?: number;
}) {
  const colorFor = (name: string, i: number) =>
    Array.isArray(colors) ? colors[i % colors.length] : colors[name];
  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} stroke="none"
            label={labels ? (({ name, percent }: any) => `${name} ${Math.round(percent * 100)}%`) : undefined} labelLine={labels}>
            {data.map((d, i) => <Cell key={d.name} fill={colorFor(d.name, i)} />)}
          </Pie>
          <Tooltip content={<ChartTip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", top: "38%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(total)}</p>
        <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{totalLabel}</p>
      </div>
    </div>
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

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function EntrepreneurshipPage() {
  const [year, setYear] = useState<"all" | number>("all");
  const [gender, setGender] = useState<"all" | Gender>("all");
  const [stage, setStage] = useState<"all" | Stage>("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [funding, setFunding] = useState<"all" | FundingSource>("all");

  const scope = useMemo(() =>
    VENTURES.filter(x => {
      if (year !== "all" && x.yearLaunched !== year) return false;
      if (gender !== "all" && x.gender !== gender) return false;
      if (stage !== "all" && x.stage !== stage) return false;
      if (status !== "all" && x.status !== status) return false;
      if (funding !== "all" && x.fundingSource !== funding) return false;
      return true;
    }),
  [year, gender, stage, status, funding]);

  const total = scope.length;

  /* ── Executive snapshot ────────────────────────────── */
  const kpis = useMemo(() => {
    const female = scope.filter(v => v.gender === "Female").length;
    const avgRating = total ? scope.reduce((s, v) => s + v.rating, 0) / total : 0;
    const jobs = scope.reduce((s, v) => s + v.jobsCreated, 0);
    const formal = scope.filter(v => v.formal).length;
    const enabler = scope.filter(v => v.enablerSupport).length;
    return {
      female, femalePct: share(female, total), avgRating, count: total, jobs,
      formalPct: share(formal, total), enablerPct: share(enabler, total),
    };
  }, [scope, total]);

  /* ── Section 1: venture pipeline ───────────────────── */
  const v = useMemo(() => {
    const pipeline = PIPELINE.map(s => ({ name: s, value: scope.filter(x => x.stage === s).length }));
    const stageDist = STAGES.map(s => ({ name: s, value: scope.filter(x => x.stage === s).length })).sort((a, b) => b.value - a.value);
    const statusData = STATUSES.map(s => ({ name: s, value: scope.filter(x => x.status === s).length })).filter(d => d.value > 0);
    const statusTotal = statusData.reduce((s, d) => s + d.value, 0);
    const funding = FUNDING_SOURCES.map(f => ({ name: f, value: scope.filter(x => x.fundingSource === f).length })).sort((a, b) => b.value - a.value);
    const formalCount = scope.filter(x => x.formal).length;
    const formal = [
      { name: "Formally registered", value: formalCount },
      { name: "Informal", value: total - formalCount },
    ];
    const genderData = GENDERS.map(g => ({ name: g, value: scope.filter(x => x.gender === g).length })).filter(d => d.value > 0);
    const enablerCount = scope.filter(x => x.enablerSupport).length;
    const enabler = [
      { name: "With enabler support", value: enablerCount },
      { name: "No support", value: total - enablerCount },
    ];
    const perYear = YEARS.map(y => ({ name: `${y}`, value: scope.filter(x => x.yearLaunched === y).length }));
    const survival = [
      { name: "Year 1", value: 100 },
      { name: "Year 3", value: 71 },
      { name: "Year 5", value: 48 },
    ];
    return { pipeline, stageDist, statusData, statusTotal, funding, formal, genderData, enabler, perYear, survival };
  }, [scope, total]);

  /* ── Section 2: jobs & inclusion ───────────────────── */
  const ji = useMemo(() => {
    const totalJobs = scope.reduce((s, x) => s + x.jobsCreated, 0);
    const composition = [
      { name: "Direct jobs", value: Math.round(totalJobs * 0.56) },
      { name: "Indirect / part-time", value: Math.round(totalJobs * 0.30) },
      { name: "Secondary / seasonal", value: Math.round(totalJobs * 0.14) },
    ];
    const priority = [
      { name: "Women", value: Math.round(totalJobs * 0.41) },
      { name: "Youth", value: Math.round(totalJobs * 0.52) },
      { name: "Refugees / displaced", value: Math.round(totalJobs * 0.14) },
      { name: "Persons w/ disability", value: Math.round(totalJobs * 0.07) },
    ].sort((a, b) => b.value - a.value);
    const byGender = [
      { name: "Male", value: Math.round(totalJobs * 0.52) },
      { name: "Female", value: Math.round(totalJobs * 0.45) },
      { name: "Other", value: Math.round(totalJobs * 0.03) },
    ];
    const byType = [
      { name: "Full-time", value: Math.round(totalJobs * 0.54) },
      { name: "Part-time", value: Math.round(totalJobs * 0.30) },
      { name: "Temporary", value: Math.round(totalJobs * 0.16) },
    ];
    const quality = [
      { name: "Reliable income", value: Math.round(totalJobs * 0.62) },
      { name: "Reputation", value: Math.round(totalJobs * 0.71) },
      { name: "Respected", value: Math.round(totalJobs * 0.74) },
      { name: "Sense of purpose", value: Math.round(totalJobs * 0.69) },
      { name: "Other", value: Math.round(totalJobs * 0.21) },
    ];
    const baseT = Math.round(totalJobs * 0.4);
    const trend = YEARS.map((year, i) => {
      const Total = Math.round(baseT * (1 + i * 0.3));
      return { year, Total, Female: Math.round(Total * 0.45) };
    });
    return { composition, priority, byGender, byType, quality, trend };
  }, [scope]);

  /* ── Section 3: sectors & capital (survey / portfolio data) ── */
  const sc = useMemo(() => {
    const topSectors = [
      { name: "Agriculture", value: 96 }, { name: "Retail / commerce", value: 84 },
      { name: "Education", value: 71 }, { name: "Fintech", value: 63 },
      { name: "Healthcare", value: 54 }, { name: "Technology", value: 48 },
      { name: "Manufacturing", value: 37 }, { name: "Other", value: 47 },
    ].sort((a, b) => b.value - a.value);
    const industries = [
      { name: "Agri-processing", value: 58 }, { name: "E-commerce", value: 49 },
      { name: "EdTech", value: 44 }, { name: "Payments", value: 41 },
      { name: "Clean energy", value: 33 }, { name: "Logistics", value: 28 },
      { name: "Health services", value: 26 }, { name: "Creative / media", value: 22 },
    ].sort((a, b) => b.value - a.value);
    const scholar = {
      count: 208, femalePct: 52.9,
      gender: [{ name: "Female", value: 110 }, { name: "Male", value: 98 }],
    };
    const capital = [
      { year: 2020, value: 420000 }, { year: 2021, value: 760000 }, { year: 2022, value: 1240000 },
      { year: 2023, value: 1880000 }, { year: 2024, value: 2650000 },
    ];
    const topVentures = [
      { name: "GreenHarvest Agritech", jobs: 64, sector: "Agriculture", country: "Kenya" },
      { name: "PayLink Africa", jobs: 52, sector: "Fintech", country: "Nigeria" },
      { name: "EduBridge Learning", jobs: 47, sector: "Education", country: "Rwanda" },
      { name: "MediReach Clinics", jobs: 41, sector: "Healthcare", country: "Ghana" },
      { name: "SokoMarket", jobs: 38, sector: "Retail / commerce", country: "Kenya" },
      { name: "SolarNest Energy", jobs: 33, sector: "Clean energy", country: "South Africa" },
      { name: "FreightFlow", jobs: 29, sector: "Logistics", country: "Nigeria" },
      { name: "CraftCollective", jobs: 24, sector: "Creative / media", country: "Uganda" },
      { name: "AgroLink Co-op", jobs: 21, sector: "Agri-processing", country: "Rwanda" },
      { name: "HealthPoint Mobile", jobs: 18, sector: "Health services", country: "Tanzania" },
    ].sort((a, b) => b.jobs - a.jobs);
    return { topSectors, industries, scholar, capital, topVentures };
  }, []);

  /* ── Section 4: outcomes & support (survey data) ───── */
  const os = useMemo(() => {
    const indicators = [
      { name: "Reliable income", value: 68, pct: true },
      { name: "Good reputation", value: 84, pct: true },
      { name: "Respected at work", value: 88, pct: true },
      { name: "Sense of purpose", value: 87, pct: true },
    ];
    const income = [
      { name: "<$100", value: 38 }, { name: "$100–300", value: 96 }, { name: "$300–600", value: 121 },
      { name: "$600–1k", value: 88 }, { name: "$1k–2k", value: 54 }, { name: "$2k+", value: 27 },
    ];
    const household = [
      { name: "Financial stability", value: 176 }, { name: "Family education", value: 148 },
      { name: "Healthcare access", value: 124 }, { name: "Household well-being", value: 112 },
      { name: "Helped extended family", value: 89 }, { name: "Better housing", value: 67 },
    ].sort((a, b) => b.value - a.value);
    const interventionsRaw = [
      { name: "Mentorship", uptake: 184, help: 4.4 }, { name: "Seed funding", uptake: 142, help: 4.6 },
      { name: "Incubation", uptake: 118, help: 4.1 }, { name: "Training", uptake: 156, help: 4.0 },
      { name: "Network access", uptake: 131, help: 4.3 }, { name: "Market linkages", uptake: 97, help: 3.8 },
      { name: "Legal / admin support", uptake: 64, help: 3.6 },
    ].sort((a, b) => b.uptake - a.uptake);
    const interventionUptake = interventionsRaw.map(x => ({ name: x.name, value: x.uptake }));
    const helpfulness = interventionsRaw.map(x => ({ name: x.name, value: x.help }));
    const supportQuality = [
      { name: "Excellent", value: 38 }, { name: "Good", value: 41 }, { name: "Fair", value: 15 }, { name: "Poor", value: 6 },
    ];
    const supportTotal = supportQuality.reduce((s, d) => s + d.value, 0);
    const persistence = [
      { name: "Primary income source", value: 162 }, { name: "Passion / purpose", value: 138 },
      { name: "Flexibility / independence", value: 109 }, { name: "Community need", value: 84 },
      { name: "No alternative employment", value: 71 }, { name: "Family business", value: 46 },
    ].sort((a, b) => b.value - a.value);
    return { indicators, income, household, interventionUptake, helpfulness, supportQuality, supportTotal, persistence };
  }, []);

  const isFiltered = year !== "all" || gender !== "all" || stage !== "all" || status !== "all" || funding !== "all";
  const reset = () => { setYear("all"); setGender("all"); setStage("all"); setStatus("all"); setFunding("all"); };

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Entrepreneurship</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>The venture pipeline, the jobs it creates, and whether founders are building meaningful, sustainable businesses</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ EXECUTIVE SNAPSHOT ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Ventures" num={kpis.count} sub="launched" Icon={Rocket}
              tooltip="Total ventures launched by CHII participants within the active filters." />
            <StatsKpiCard label="Female Founders" num={kpis.female} sub={`${kpis.femalePct}% of founders`} Icon={Heart}
              tooltip="Number and share of ventures led by female founders." />
            <StatsKpiCard label="Jobs Created" num={kpis.jobs} sub="opportunities" Icon={Briefcase}
              tooltip="Jobs and opportunities created across all ventures in scope." />
            <StatsKpiCard label="Avg Rating" num={kpis.avgRating} displayFmt={(n) => n.toFixed(1)} sub="out of 5" Icon={Star}
              tooltip="Average venture health / quality score across the portfolio." />
            <StatsKpiCard label="Formally Registered" num={kpis.formalPct} displayFmt={(n) => `${Math.round(n)}%`} sub="of ventures" Icon={Scale}
              tooltip="Share of ventures that are formally registered." />
            <StatsKpiCard label="With Enabler Support" num={kpis.enablerPct} displayFmt={(n) => `${Math.round(n)}%`} sub="received support" Icon={LifeBuoy}
              tooltip="Share of ventures that received enabler / accelerator support." />
          </div>
        </section>

        {/* ════ SECTION 1 — VENTURE PIPELINE ════ */}
        <section className="space-y-4">
          <SectionHeader n={1} title="Venture Pipeline" blurb="How healthy is the venture pipeline?" />
          <Panel title="Venture Pipeline Funnel" subtitle="Ventures by pipeline stage"
            info="How ventures progress through pipeline stages, from idea to scaling.">
            {v.pipeline.every(d => d.value === 0) ? (
              <EmptyState message="No ventures match the current filters. Adjust the filters to see the pipeline." />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={v.pipeline} margin={{ top: 4, right: 36, bottom: 4, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={96} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Ventures" fill={BAND} radius={[0, 4, 4, 0]} barSize={22}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Panel>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Venture Stage Distribution" subtitle="Ventures per stage"
              info="Number of ventures in each stage, sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={v.stageDist} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={42} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Ventures" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={26}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Venture Status" subtitle="Current operating status"
              info="Breakdown of ventures by current status, from pre-seed through to non-operational.">
              <Donut data={v.statusData} colors={PALETTE} total={v.statusTotal} totalLabel="Ventures" />
            </Panel>
            <Panel title="Funding Sources" subtitle="How ventures are funded"
              info="Primary funding source per venture, sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={v.funding} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={48} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Ventures" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={30}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Formal vs Informal Ventures" subtitle="Registration status"
              info="Share of ventures that are formally registered versus operating informally.">
              <Donut data={v.formal} colors={["#185FA5", "#C5D2E0"]} total={total} totalLabel="Ventures" />
            </Panel>
            <Panel title="Entrepreneurs by Gender" subtitle="Founder gender split"
              info="Gender distribution of venture founders.">
              <Donut data={v.genderData} colors={GENDER_COLOR} total={total} totalLabel="Founders" />
            </Panel>
            <Panel title="Enabler vs Absent Ventures" subtitle="Support received"
              info="Ventures that received enabler / accelerator support versus those that did not.">
              <Donut data={v.enabler} colors={["#1D9E75", "#C5D2E0"]} total={total} totalLabel="Ventures" />
            </Panel>
            <Panel title="Ventures Launched per Year" subtitle="New ventures by year"
              info="Count of ventures launched each year, in chronological order.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={v.perYear} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Ventures" fill={BAND} radius={[4, 4, 0, 0]} barSize={40}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Venture Survival Rate" subtitle="% surviving over time"
              info="Share of ventures still operating at year 1, 3, and 5 after launch.">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={v.survival} margin={{ top: 10, right: 16, bottom: 14, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                    label={{ value: "Years since launch", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="value" name="Survival rate" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        {/* ════ SECTION 2 — JOBS & INCLUSION ════ */}
        <section className="space-y-4">
          <SectionHeader n={2} title="Jobs & Inclusion" blurb="What work do ventures create, and for whom?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Jobs Composition" subtitle="By job category"
              info="How venture-created jobs break down across direct, indirect/part-time, and secondary/seasonal roles.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.composition} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs by Priority Group" subtitle="Inclusive reach, ranked"
              info="Jobs reaching priority groups — women, youth, refugees/displaced, and persons with disability. Sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={ji.priority} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Jobs" fill={BAND} radius={[0, 4, 4, 0]} barSize={20}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs Created by Gender" subtitle="Male · Female · Other"
              info="Gender distribution of jobs created by ventures.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.byGender} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs by Employment Type" subtitle="Full-time · Part-time · Temporary"
              info="Contract-type split of jobs created by ventures.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.byType} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Venture Jobs — Quality Breakdown" subtitle="Decent-work dimensions"
              info="Quality of venture-created jobs across reliable income, reputation, respect, sense of purpose, and other.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.quality} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={46} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={30}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs Created (Trend)" subtitle="Total vs female, by year"
              info="Jobs created by year. Total is a solid line, female a dashed line; hover for per-year values.">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ji.trend} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="Total" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        {/* ════ SECTION 3 — SECTORS & CAPITAL ════ */}
        <section className="space-y-4">
          <SectionHeader n={3} title="Sectors & Capital" blurb="Where do ventures operate, and how are they funded?" />
          <Panel title="Top Sectors" subtitle="Ventures by sector, ranked"
            info="Sectors where ventures concentrate, sorted from most to least.">
            <ResponsiveContainer width="100%" height={Math.max(240, sc.topSectors.length * 34)}>
              <BarChart layout="vertical" data={sc.topSectors} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Ventures" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Ventures by Industry" subtitle="Industries, ranked"
              info="Finer-grained industry breakdown of ventures, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(240, sc.industries.length * 32)}>
                <BarChart layout="vertical" data={sc.industries} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={120} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Ventures" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="MCF / Scholar Entrepreneurs" subtitle="Scholar-led ventures"
              info="Ventures led by Mastercard Foundation scholars, including the female share and gender split.">
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
                <div style={{ flex: "1 1 150px", minWidth: 140 }}>
                  <p style={{ fontSize: 34, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(sc.scholar.count)}</p>
                  <p style={{ fontSize: 10.5, color: "#6B7280", marginTop: 4 }}>Scholar entrepreneurs</p>
                  <div style={{ marginTop: 14, backgroundColor: "rgba(24,95,165,0.08)", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: C_ACCENT, lineHeight: 1 }}>{sc.scholar.femalePct}%</p>
                    <p style={{ fontSize: 10, color: "#6B7280", marginTop: 3 }}>Female majority of scholar ventures</p>
                  </div>
                </div>
                <div style={{ flex: "1 1 180px", minWidth: 170 }}>
                  <Donut data={sc.scholar.gender} colors={GENDER_COLOR} total={sc.scholar.count} totalLabel="Scholars"
                    height={190} labels={false} innerRadius={46} outerRadius={70} />
                </div>
              </div>
            </Panel>
          </div>

          <Panel title="Capital Secured (USD)" subtitle="Total raised by year"
            info="Total capital raised by ventures each year, in USD. Hover a point for the exact amount.">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={sc.capital} margin={{ top: 10, right: 16, bottom: 14, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                  label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                <YAxis tickFormatter={usd} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<MoneyTip />} />
                <Line type="monotone" dataKey="value" name="Capital secured" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Top Job-Creating Ventures" subtitle="Ranked by jobs created"
            info="Ventures creating the most jobs, with sector and country. Sorted by jobs, descending.">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, tableLayout: "fixed" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,33,71,0.12)" }}>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", width: "34%" }}>Venture</th>
                    <th style={{ textAlign: "right", padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", width: "14%" }}>Jobs</th>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", width: "30%" }}>Sector / activity</th>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", width: "22%" }}>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {sc.topVentures.map((row, i) => (
                    <tr key={row.name} className="ent-row" style={{ backgroundColor: i % 2 ? "rgba(0,33,71,0.02)" : "transparent" }}>
                      <td title={row.name} style={{ padding: "8px 10px", color: NAVY, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.name}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: NAVY, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmt(row.jobs)}</td>
                      <td style={{ padding: "8px 10px", color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.sector}</td>
                      <td style={{ padding: "8px 10px", color: "#6B7280" }}>{row.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 9.5, color: "#9CA3AF", marginTop: 10, fontStyle: "italic" }}>
              Jobs include direct and part-time roles reported by the venture in the latest survey cycle.
            </p>
          </Panel>
        </section>

        {/* ════ SECTION 4 — OUTCOMES & SUPPORT ════ */}
        <section className="space-y-4">
          <SectionHeader n={4} title="Outcomes & Support" blurb="Are ventures improving lives, and is CHII support helping?" />
          <Panel title="Venture Work Indicators" subtitle="Share of founders reporting each, %"
            info="Share of founders reporting each decent-work indicator, on a fixed 0–100% scale.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={os.indicators} margin={{ top: 20, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Reporting" fill={BAND} radius={[4, 4, 0, 0]} barSize={64}>
                  <LabelList dataKey="value" position="top" fontSize={11} fill="#374151" fontWeight={700} formatter={(v: number) => `${v}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Monthly Income from Venture" subtitle="Founders per income band"
              info="Distribution of founders across monthly income bands, ascending from lowest to highest.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={os.income} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Founders" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={34}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Household Improvements" subtitle="Reported impact areas, ranked"
              info="How venture income improved founder households, sorted from most to least reported.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={os.household} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={160} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Respondents" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Intervention Uptake" subtitle="CHII support used, ranked"
              info="CHII support interventions founders used, sorted by uptake. Same order as the helpfulness panel for cross-reference.">
              <ResponsiveContainer width="100%" height={Math.max(240, os.interventionUptake.length * 32)}>
                <BarChart layout="vertical" data={os.interventionUptake} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Founders" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Helpfulness Rating (1–5)" subtitle="Same interventions, by score"
              info="Average helpfulness score (1–5) for each intervention. Row order matches the uptake panel for cross-reference.">
              <ResponsiveContainer width="100%" height={Math.max(240, os.helpfulness.length * 32)}>
                <BarChart layout="vertical" data={os.helpfulness} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Score" fill={C_FEMALE} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Overall Support Quality" subtitle="How founders rate CHII support"
              info="Founders' overall rating of CHII's support, from excellent to poor.">
              <Donut data={os.supportQuality} colors={PALETTE} total={os.supportTotal} totalLabel="Respondents" />
            </Panel>
            <Panel title="Reasons Founders Persist" subtitle="Why founders keep trading, ranked"
              info="Top reasons founders continue running their ventures, sorted from most to least cited.">
              <ResponsiveContainer width="100%" height={Math.max(240, os.persistence.length * 34)}>
                <BarChart layout="vertical" data={os.persistence} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={170} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Founders" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        <FeaturedImpactStory footer />
      </div>

      <style>{`
        .ent-row { transition: background-color 0.12s ease; }
        .ent-row:hover { background-color: rgba(24,95,165,0.07) !important; }
      `}</style>
    </div>
  );
}
