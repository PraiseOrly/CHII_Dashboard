"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Heart, Info, Download, Rocket, Star, Briefcase, ArrowUpRight, ArrowDownRight,
  Scale, Banknote, LifeBuoy, AlertTriangle,
} from "lucide-react";
import {
  VENTURES, GENDERS, STATUSES, FUNDING_SOURCES, STAGES, PIPELINE,
  type Gender,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";

/* ── palette (matches the rest of the dashboard) ─────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const PALETTE = ["#185FA5", "#1D9E75", "#7F77DD", "#E0A458", "#0C447C", "#D17A86", "#C5D2E0"];
const GENDER_COLOR: Record<Gender, string> = { Female: "#185FA5", Male: "#1D9E75", Other: "#7F77DD" };
const C_ACCENT = "#185FA5";

/* ── helpers ─────────────────────────────────────────── */
const fmt = (n: number) => Math.round(n).toLocaleString();
const usd = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${Math.round(n)}`);

/* ════════════════════════════════════════════════════════
   KPI card (icon + label + value + optional tooltip & trend)
═══════════════════════════════════════════════════════ */
function KpiCard({ label, value, caption, Icon, tooltip, delta }: {
  label: string; value: string; caption: string;
  Icon: typeof Users; tooltip: string; delta?: { v: number; unit: "%" | "pp" };
}) {
  const [tip, setTip] = useState(false);
  const up = (delta?.v ?? 0) >= 0;
  return (
    <div style={{ backgroundColor: NAVY, borderRadius: 10, padding: "16px 16px 14px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#B5D4F4" }}>{label}</p>
        <div style={{ position: "relative", cursor: "pointer", display: "flex" }}
          onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
          <Info size={11} color="rgba(181,212,244,0.7)" />
          {tip && (
            <div style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10.5, lineHeight: 1.5, padding: "8px 11px", borderRadius: 7, width: 190, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
              {tooltip}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
        <Icon size={22} color="#B5D4F4" style={{ opacity: 0.8, flexShrink: 0 }} />
        <p style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 }}>
        <p style={{ fontSize: 10, color: "rgba(181,212,244,0.7)" }}>{caption}</p>
        {delta && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: 9.5, fontWeight: 700, color: up ? "#5FD3A6" : "#E69AA4" }}>
            {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(delta.v)}{delta.unit}
          </span>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Panel wrapper (header strip + info tooltip + export)
═══════════════════════════════════════════════════════ */
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

/* ── empty / error state for panels with no data ─────── */
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

/* shared recharts tooltip */
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

/* currency tooltip */
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

/* ── donut with centre total + leader-line labels ────── */
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

/* ════════════════════════════════════════════════════════
   TAB CONFIG
═══════════════════════════════════════════════════════ */
type Tab = "Ventures" | "Jobs & Inclusion" | "Sectors & Capital" | "Outcomes & Support";
const TABS: { key: Tab; Icon: typeof Users }[] = [
  { key: "Ventures", Icon: Rocket },
  { key: "Jobs & Inclusion", Icon: Scale },
  { key: "Sectors & Capital", Icon: Banknote },
  { key: "Outcomes & Support", Icon: LifeBuoy },
];

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function EntrepreneurshipPage() {
  const [tab, setTab] = useState<Tab>("Ventures");

  /* ── KPIs ───────────────────────────────────────────── */
  const kpis = useMemo(() => {
    const female = VENTURES.filter(v => v.gender === "Female").length;
    const avgRating = VENTURES.reduce((s, v) => s + v.rating, 0) / VENTURES.length;
    const jobs = VENTURES.reduce((s, v) => s + v.jobsCreated, 0);
    return { female, avgRating, count: VENTURES.length, jobs };
  }, []);

  /* ── Ventures tab data ──────────────────────────────── */
  const v = useMemo(() => {
    const pipeline = PIPELINE.map(stage => ({
      name: stage, value: VENTURES.filter(x => x.stage === stage).length,
    }));

    const stageDist = STAGES.map(s => ({ name: s, value: VENTURES.filter(x => x.stage === s).length }))
      .sort((a, b) => b.value - a.value);

    const statusData = STATUSES.map(s => ({ name: s, value: VENTURES.filter(x => x.status === s).length }))
      .filter(d => d.value > 0);
    const statusTotal = statusData.reduce((s, d) => s + d.value, 0);

    const funding = FUNDING_SOURCES.map(f => ({ name: f, value: VENTURES.filter(x => x.fundingSource === f).length }))
      .sort((a, b) => b.value - a.value);

    const formalCount = VENTURES.filter(x => x.formal).length;
    const formal = [
      { name: "Formally registered", value: formalCount },
      { name: "Informal", value: VENTURES.length - formalCount },
    ];

    const gender = GENDERS.map(g => ({ name: g, value: VENTURES.filter(x => x.gender === g).length })).filter(d => d.value > 0);

    const enablerCount = VENTURES.filter(x => x.enablerSupport).length;
    const enabler = [
      { name: "With enabler support", value: enablerCount },
      { name: "No support", value: VENTURES.length - enablerCount },
    ];

    const years = [2020, 2021, 2022, 2023, 2024];
    const perYear = years.map(y => ({ name: `${y}`, value: VENTURES.filter(x => x.yearLaunched === y).length }));

    const survival = [
      { name: "Year 1", value: 100 },
      { name: "Year 3", value: 71 },
      { name: "Year 5", value: 48 },
    ];

    return { pipeline, stageDist, statusData, statusTotal, funding, formal, gender, enabler, perYear, survival };
  }, []);

  /* ── Jobs & Inclusion tab data ──────────────────────── */
  const ji = useMemo(() => {
    const totalJobs = VENTURES.reduce((s, x) => s + x.jobsCreated, 0);

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
    const trend = [2020, 2021, 2022, 2023, 2024].map((year, i) => {
      const Total = Math.round(baseT * (1 + i * 0.3));
      return { year, Total, Female: Math.round(Total * 0.45) };
    });

    return { composition, priority, byGender, byType, quality, trend };
  }, []);

  const C_FEMALE = "#1D9E75";

  /* ── Sectors & Capital tab data ─────────────────────── */
  const sc = useMemo(() => {
    const topSectors = [
      { name: "Agriculture", value: 96 },
      { name: "Retail / commerce", value: 84 },
      { name: "Education", value: 71 },
      { name: "Fintech", value: 63 },
      { name: "Healthcare", value: 54 },
      { name: "Technology", value: 48 },
      { name: "Manufacturing", value: 37 },
      { name: "Other", value: 47 },
    ].sort((a, b) => b.value - a.value);

    const industries = [
      { name: "Agri-processing", value: 58 },
      { name: "E-commerce", value: 49 },
      { name: "EdTech", value: 44 },
      { name: "Payments", value: 41 },
      { name: "Clean energy", value: 33 },
      { name: "Logistics", value: 28 },
      { name: "Health services", value: 26 },
      { name: "Creative / media", value: 22 },
    ].sort((a, b) => b.value - a.value);

    const scholar = {
      count: 208,
      femalePct: 52.9,
      gender: [
        { name: "Female", value: 110 },
        { name: "Male", value: 98 },
      ],
    };

    const capital = [
      { year: 2020, value: 420000 },
      { year: 2021, value: 760000 },
      { year: 2022, value: 1240000 },
      { year: 2023, value: 1880000 },
      { year: 2024, value: 2650000 },
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

  /* ── Outcomes & Support tab data ────────────────────── */
  const os = useMemo(() => {
    const indicators = [
      { name: "Reliable income", value: 68, pct: true },
      { name: "Good reputation", value: 84, pct: true },
      { name: "Respected at work", value: 88, pct: true },
      { name: "Sense of purpose", value: 87, pct: true },
    ];

    const income = [
      { name: "<$100", value: 38 },
      { name: "$100–300", value: 96 },
      { name: "$300–600", value: 121 },
      { name: "$600–1k", value: 88 },
      { name: "$1k–2k", value: 54 },
      { name: "$2k+", value: 27 },
    ];

    const household = [
      { name: "Financial stability", value: 176 },
      { name: "Family education", value: 148 },
      { name: "Healthcare access", value: 124 },
      { name: "Household well-being", value: 112 },
      { name: "Helped extended family", value: 89 },
      { name: "Better housing", value: 67 },
    ].sort((a, b) => b.value - a.value);

    // shared intervention order (sorted by uptake) so both panels align
    const interventionsRaw = [
      { name: "Mentorship", uptake: 184, help: 4.4 },
      { name: "Seed funding", uptake: 142, help: 4.6 },
      { name: "Incubation", uptake: 118, help: 4.1 },
      { name: "Training", uptake: 156, help: 4.0 },
      { name: "Network access", uptake: 131, help: 4.3 },
      { name: "Market linkages", uptake: 97, help: 3.8 },
      { name: "Legal / admin support", uptake: 64, help: 3.6 },
    ].sort((a, b) => b.uptake - a.uptake);
    const interventionUptake = interventionsRaw.map(x => ({ name: x.name, value: x.uptake }));
    const helpfulness = interventionsRaw.map(x => ({ name: x.name, value: x.help }));

    const supportQuality = [
      { name: "Excellent", value: 38 },
      { name: "Good", value: 41 },
      { name: "Fair", value: 15 },
      { name: "Poor", value: 6 },
    ];
    const supportTotal = supportQuality.reduce((s, d) => s + d.value, 0);

    const persistence = [
      { name: "Primary income source", value: 162 },
      { name: "Passion / purpose", value: 138 },
      { name: "Flexibility / independence", value: 109 },
      { name: "Community need", value: 84 },
      { name: "No alternative employment", value: 71 },
      { name: "Family business", value: 46 },
    ].sort((a, b) => b.value - a.value);

    return { indicators, income, household, interventionUptake, helpfulness, supportQuality, supportTotal, persistence };
  }, []);


  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>How healthy is the venture pipeline?</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Where ventures sit in their journey, how they&apos;re funded, and the venture and founder profile.</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-7">

        {/* ── KPI value cards ──────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          <KpiCard label="Female Entrepreneurs" value={fmt(kpis.female)} caption="women founders" Icon={Heart}
            tooltip="Number of ventures led by female founders." delta={{ v: 8, unit: "%" }} />
          <KpiCard label="Avg Rating" value={kpis.avgRating.toFixed(1)} caption="out of 5" Icon={Star}
            tooltip="Average venture health/quality score across the portfolio." />
          <KpiCard label="Ventures" value={fmt(kpis.count)} caption="launched" Icon={Rocket}
            tooltip="Total ventures launched by alumni." delta={{ v: 12, unit: "%" }} />
          <KpiCard label="Jobs Created" value={fmt(kpis.jobs)} caption="opportunities" Icon={Briefcase}
            tooltip="Jobs and opportunities created across all ventures." delta={{ v: 15, unit: "%" }} />
        </div>

        {/* ── Tab navigation ───────────────────────────── */}
        <div style={{ display: "flex", backgroundColor: "#EEF3F8", borderRadius: 9, padding: 4, gap: 4 }} className="ent-tabs">
          {TABS.map(({ key, Icon }) => {
            const active = key === tab;
            return (
              <button key={key} onClick={() => setTab(key)}
                style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "9px 6px", borderRadius: 7, border: "none", cursor: "pointer", lineHeight: 1.2,
                  backgroundColor: active ? NAVY : "transparent", color: active ? "white" : "#6B7280" }}>
                <Icon size={14} style={{ flexShrink: 0 }} />
                {key}
              </button>
            );
          })}
        </div>

        {/* ── Tab content region ───────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, alignItems: "start" }}>

          {tab === "Ventures" && (
            <>
              {/* Row 1 — pipeline funnel (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Venture pipeline funnel" subtitle="Ventures by pipeline stage"
                  info="How ventures progress through pipeline stages, from idea to scaling.">
                  {v.pipeline.every(d => d.value === 0) ? (
                    <EmptyState message="Pipeline data isn't available yet. Once venture stages are recorded, the funnel will appear here." />
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
              </div>

              {/* Row 2 — stage distribution + status */}
              <Panel title="Venture stage distribution" subtitle="Ventures per stage"
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

              <Panel title="Venture status" subtitle="Current operating status"
                info="Breakdown of ventures by current status, from pre-seed through to non-operational.">
                <Donut data={v.statusData} colors={PALETTE} total={v.statusTotal} totalLabel="Ventures" />
              </Panel>

              {/* Row 3 — funding sources + formal vs informal */}
              <Panel title="Funding sources" subtitle="How ventures are funded"
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

              <Panel title="Formal vs informal ventures" subtitle="Registration status"
                info="Share of ventures that are formally registered versus operating informally.">
                <Donut data={v.formal} colors={["#185FA5", "#C5D2E0"]} total={VENTURES.length} totalLabel="Ventures" />
              </Panel>

              {/* Row 4 — gender + enabler */}
              <Panel title="Entrepreneurs by gender" subtitle="Founder gender split"
                info="Gender distribution of venture founders.">
                <Donut data={v.gender} colors={GENDER_COLOR} total={VENTURES.length} totalLabel="Founders" />
              </Panel>

              <Panel title="Enabler vs absent ventures" subtitle="Support received"
                info="Ventures that received enabler/accelerator support versus those that did not.">
                <Donut data={v.enabler} colors={["#1D9E75", "#C5D2E0"]} total={VENTURES.length} totalLabel="Ventures" />
              </Panel>

              {/* Row 5 — per year + survival */}
              <Panel title="Ventures launched per year" subtitle="New ventures by year"
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

              <Panel title="Venture survival rate" subtitle="% surviving over time"
                info="Share of ventures still operating at year 1, 3, and 5 after launch.">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={v.survival} margin={{ top: 10, right: 16, bottom: 14, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                      label={{ value: "Years since launch", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                      label={{ value: "Surviving", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip content={<ChartTip />} />
                    <Line type="monotone" dataKey="value" name="Survival rate" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </>
          )}

          {tab === "Jobs & Inclusion" && (
            <>
              {/* Row 1 — composition + priority group */}
              <Panel title="Jobs composition" subtitle="By job category"
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

              <Panel title="Jobs by priority group" subtitle="Inclusive reach, ranked"
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

              {/* Row 2 — gender + employment type */}
              <Panel title="Jobs created by gender" subtitle="Male · Female · Other"
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

              <Panel title="Jobs by employment type" subtitle="Full-time · Part-time · Temporary"
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

              {/* Row 3 — quality breakdown + trend */}
              <Panel title="Venture jobs — quality breakdown" subtitle="Decent-work dimensions"
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

              <Panel title="Jobs created (trend)" subtitle="Total vs female, by year"
                info="Jobs created by year. Total is a solid line, female a dashed line; hover for per-year values.">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={ji.trend} margin={{ top: 10, right: 16, bottom: 14, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                      label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                      label={{ value: "Jobs", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip content={<ChartTip />} />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="Total" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </>
          )}

          {tab === "Sectors & Capital" && (
            <>
              {/* Row 1 — top sectors (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Top sectors" subtitle="Ventures by sector, ranked"
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
              </div>

              {/* Row 2 — industries + MCF/Scholar composite */}
              <Panel title="Ventures by industry" subtitle="Industries, ranked"
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

              <Panel title="MCF / Scholar entrepreneurs" subtitle="Scholar-led ventures"
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

              {/* Row 3 — capital secured (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Capital secured (USD)" subtitle="Total raised by year"
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
              </div>

              {/* Row 4 — top job-creating ventures (table, full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Top job-creating ventures" subtitle="Ranked by jobs created"
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
                          <tr key={row.name} className="ent-row"
                            style={{ backgroundColor: i % 2 ? "rgba(0,33,71,0.02)" : "transparent" }}>
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
              </div>
            </>
          )}

          {tab === "Outcomes & Support" && (
            <>
              {/* Row 1 — venture work indicators (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Venture work indicators" subtitle="Share of founders reporting each, %"
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
              </div>

              {/* Row 2 — monthly income + household improvements */}
              <Panel title="Monthly income from venture" subtitle="Founders per income band"
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

              <Panel title="Household improvements" subtitle="Reported impact areas, ranked"
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

              {/* Row 3 — intervention uptake + helpfulness (aligned order) */}
              <Panel title="Intervention uptake" subtitle="ALU support used, ranked"
                info="ALU support interventions founders used, sorted by uptake. Same order as the helpfulness panel for cross-reference.">
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

              <Panel title="Helpfulness rating (1–5)" subtitle="Same interventions, by score"
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

              {/* Row 4 — support quality donut + persistence reasons */}
              <Panel title="Overall support quality" subtitle="How founders rate ALU support"
                info="Founders' overall rating of ALU's support, from excellent to poor.">
                <Donut data={os.supportQuality} colors={PALETTE} total={os.supportTotal} totalLabel="Respondents" />
              </Panel>

              <Panel title="Reasons founders persist" subtitle="Why founders keep trading, ranked"
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
            </>
          )}

        </div>

        <FeaturedImpactStory footer />
      </div>

      <style>{`
        @media (max-width: 720px) {
          .ent-tabs { flex-wrap: wrap; }
          .ent-tabs button { flex: 1 1 44%; }
        }
        .ent-row { transition: background-color 0.12s ease; }
        .ent-row:hover { background-color: rgba(24,95,165,0.07) !important; }
      `}</style>
    </div>
  );
}
