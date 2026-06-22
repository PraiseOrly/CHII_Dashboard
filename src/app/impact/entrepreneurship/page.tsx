"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Info, Rocket, Star, Briefcase,
  Scale, LifeBuoy, Activity, ShieldCheck, Globe, TrendingUp, Lightbulb, Banknote,
  SlidersHorizontal, X,
} from "lucide-react";
import {
  VENTURES, STATUSES, FUNDING_SOURCES, STAGES,
  type Gender, type Stage, type Status, type FundingSource,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";
import StatsKpiCard from "../StatsKpiCard";
import { DonutRing as Donut } from "@/components/DonutChart";

/* ── palette ─────────────────────────────────────────── */
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

const YEARS = [2022, 2023, 2024, 2025, 2026];

/* female icon — matches the Outreach "Who Are We Reaching?" cards */
function WomanIcon({ size = 20, color, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v8M9 18h6" />
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
const SECTIONS: { n: number; label: string }[] = [
  { n: 1, label: "Venture Portfolio" },
  { n: 2, label: "Business Growth" },
  { n: 3, label: "Employment Created" },
  { n: 4, label: "Founder Profile & Outcomes" },
  { n: 5, label: "Sectors & Innovation" },
  { n: 6, label: "CHII Support" },
  { n: 8, label: "Insights & Leaders" },
];

export default function EntrepreneurshipPage() {
  const [year, setYear] = useState<"all" | number>("all");
  const [gender, setGender] = useState<"all" | Gender>("all");
  const [stage, setStage] = useState<"all" | Stage>("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [funding, setFunding] = useState<"all" | FundingSource>("all");
  const [active, setActive] = useState<number | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const show = (n: number) => active === "all" || active === n;

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

  const activeCount = [year, gender, stage, status, funding].filter(v => v !== "all").length;
  const reset = () => { setYear("all"); setGender("all"); setStage("all"); setStatus("all"); setFunding("all"); };

  /* ── Overview KPIs ─────────────────────────────────── */
  const kpis = useMemo(() => {
    const female = scope.filter(v => v.gender === "Female").length;
    const active = scope.filter(v => v.status !== "Closed" && v.status !== "Non-operational").length;
    const jobs = scope.reduce((s, v) => s + v.jobsCreated, 0);
    const formal = scope.filter(v => v.formal).length;
    const enabler = scope.filter(v => v.enablerSupport).length;
    const avgRating = total ? scope.reduce((s, v) => s + v.rating, 0) / total : 0;
    const newThisYear = scope.filter(v => v.yearLaunched === 2024).length;
    return {
      count: total, active, female, jobs, formalPct: share(formal, total),
      enablerPct: share(enabler, total), survivalPct: share(active, total),
      avgRating, enablerCount: enabler, newThisYear,
    };
  }, [scope, total]);

  /* ── Section 1: venture portfolio ──────────────────── */
  const v = useMemo(() => {
    const stageDist = STAGES.map(s => ({ name: s, value: scope.filter(x => x.stage === s).length })).sort((a, b) => b.value - a.value);
    const statusData = STATUSES.map(s => ({ name: s, value: scope.filter(x => x.status === s).length })).filter(d => d.value > 0);
    const statusTotal = statusData.reduce((s, d) => s + d.value, 0);
    const funding = FUNDING_SOURCES.map(f => ({ name: f, value: scope.filter(x => x.fundingSource === f).length })).sort((a, b) => b.value - a.value);
    const formalCount = scope.filter(x => x.formal).length;
    const formal = [{ name: "Formally registered", value: formalCount }, { name: "Informal", value: total - formalCount }];
    const genderData = (["Female", "Male"] as Gender[]).map(g => ({ name: g, value: scope.filter(x => x.gender === g).length })).filter(d => d.value > 0);
    const perYear = YEARS.map(y => ({ name: `${y}`, value: scope.filter(x => x.yearLaunched === y).length }));
    const survival = [{ name: "Year 1", value: 100 }, { name: "Year 3", value: 71 }, { name: "Year 5", value: 48 }];
    return { stageDist, statusData, statusTotal, funding, formal, genderData, perYear, survival };
  }, [scope, total]);

  /* ── Section 2: growth & sustainability ────────────── */
  const growth = useMemo(() => {
    const income = [
      { name: "<$100", value: 38 }, { name: "$100–300", value: 96 }, { name: "$300–600", value: 121 },
      { name: "$600–1k", value: 88 }, { name: "$1k–2k", value: 54 }, { name: "$2k+", value: 27 },
    ];
    const capital = [
      { year: 2022, value: 420000 }, { year: 2023, value: 760000 }, { year: 2024, value: 1240000 },
      { year: 2025, value: 1880000 }, { year: 2026, value: 2650000 },
    ];
    const byStage = STAGES.filter(s => s !== "Closed").map(s => ({ name: s, value: scope.filter(x => x.stage === s).length }));
    return { income, capital, byStage };
  }, [scope]);

  /* ── Section 3: employment created ─────────────────── */
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
      { name: "Female", value: Math.round(totalJobs * 0.46) },
      { name: "Male", value: Math.round(totalJobs * 0.54) },
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
    return {
      totalJobs, composition, priority, byGender, byType, quality, trend, topVentures,
      fullTime: byType[0].value, partTime: byType[1].value,
      womenJobs: byGender[1].value, youthJobs: priority.find(p => p.name === "Youth")!.value,
    };
  }, [scope]);

  /* ── Section 4: founder profile ────────────────────── */
  const founders = useMemo(() => {
    const genderData = (["Female", "Male"] as Gender[]).map(g => ({ name: g, value: scope.filter(x => x.gender === g).length })).filter(d => d.value > 0);
    const scholar = { count: 208, femalePct: 52.9, gender: [{ name: "Female", value: 110 }, { name: "Male", value: 98 }] };
    const scholarSplit = [
      { name: "Scholar founders", value: scholar.count },
      { name: "Non-scholar founders", value: total - scholar.count },
    ];
    const countries = [
      { name: "Kenya", value: 118 }, { name: "Nigeria", value: 96 }, { name: "Rwanda", value: 84 },
      { name: "Ghana", value: 57 }, { name: "South Africa", value: 49 }, { name: "Uganda", value: 38 },
      { name: "Tanzania", value: 31 }, { name: "Other", value: 27 },
    ].sort((a, b) => b.value - a.value);
    return { genderData, scholar, scholarSplit, countries };
  }, [scope, total]);

  /* ── Section 5: sectors & innovation ───────────────── */
  const sectors = useMemo(() => {
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
    const techVsTraditional = [
      { name: "Technology-enabled", value: 214 },
      { name: "Traditional", value: 286 },
    ];
    return { topSectors, industries, techVsTraditional };
  }, []);

  /* ── Section 6: CHII support ───────────────────────── */
  const support = useMemo(() => {
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
    const byStage = ["Pre-seed", "Seed", "Early-stage", "Growth", "Scaling"].map(s => ({
      name: s, value: scope.filter(x => x.status === s && x.enablerSupport).length,
    }));
    return { interventionUptake, helpfulness, supportQuality, supportTotal, byStage };
  }, [scope]);

  /* ── Section 7: founder outcomes ───────────────────── */
  const outcomes = useMemo(() => {
    const indicators = [
      { name: "Reliable income", value: 68 }, { name: "Good reputation", value: 84 },
      { name: "Respected at work", value: 88 }, { name: "Sense of purpose", value: 87 },
    ];
    const household = [
      { name: "Financial stability", value: 176 }, { name: "Family education", value: 148 },
      { name: "Healthcare access", value: 124 }, { name: "Household well-being", value: 112 },
      { name: "Helped extended family", value: 89 }, { name: "Better housing", value: 67 },
    ].sort((a, b) => b.value - a.value);
    const persistence = [
      { name: "Primary income source", value: 162 }, { name: "Passion / purpose", value: 138 },
      { name: "Flexibility / independence", value: 109 }, { name: "Community need", value: 84 },
      { name: "No alternative employment", value: 71 }, { name: "Family business", value: 46 },
    ].sort((a, b) => b.value - a.value);
    return { indicators, household, persistence };
  }, []);

  const insights = [
    "Agriculture employs the largest number of youth across the venture portfolio.",
    `Female-led ventures account for ${share(kpis.female, total)}% of all businesses.`,
    "CHII-supported ventures create roughly 1.8× more jobs than unsupported ones.",
    "Formally registered businesses survive longer than informal businesses.",
  ];

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Entrepreneurship</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>The journey from founder to venture growth, jobs created, and long-term economic impact</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ OVERVIEW ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Entrepreneurs" num={1580} sub="founders tracked" Icon={Rocket}
              tooltip="Total entrepreneurs (founders) tracked across the portfolio." />
            <StatsKpiCard label="Active Ventures" num={1386} sub="still operating" Icon={Activity}
              tooltip="Ventures still trading (not closed or non-operational)." />
            <StatsKpiCard label="Jobs Created" num={54700} displayFmt={(n) => `${(n / 1000).toFixed(1)}K`} sub="opportunities" Icon={Briefcase}
              tooltip="Jobs and opportunities created across all ventures." />
            <StatsKpiCard label="Female-led" num={62} displayFmt={(n) => `${Math.round(n)}%`} sub="of ventures" Icon={WomanIcon}
              tooltip="Share of ventures led by female founders." />
            <StatsKpiCard label="Capital Secured" num={7900000} displayFmt={(n) => `$${(n / 1000000).toFixed(1)}M`} sub="raised to date" Icon={Banknote}
              tooltip="Total capital raised by ventures across the portfolio." />
          </div>

          {/* Section pills (left) + compact filters dropdown (right) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{ n: 0, label: "All Sections" }, ...SECTIONS].map(({ n, label }) => {
                const on = n === 0 ? active === "all" : active === n;
                return (
                  <button key={n} onClick={() => setActive(n === 0 ? "all" : n)}
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
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: filtersOpen ? "rgba(255,255,255,0.25)" : C_ACCENT, borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>
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
                    <FilterSelect label="Year Launched" value={year} onChange={setYear}
                      options={[{ value: "all" as const, label: "All Years" }, ...YEARS.map(y => ({ value: y, label: String(y) }))]} />
                    <FilterSelect label="Founder Gender" value={gender} onChange={setGender}
                      options={[{ value: "all" as const, label: "All Genders" }, ...(["Female", "Male"] as Gender[]).map(g => ({ value: g, label: g }))]} />
                    <FilterSelect label="Stage" value={stage} onChange={setStage}
                      options={[{ value: "all" as const, label: "All Stages" }, ...STAGES.map(s => ({ value: s, label: s }))]} />
                    <FilterSelect label="Status" value={status} onChange={setStatus}
                      options={[{ value: "all" as const, label: "All Statuses" }, ...STATUSES.map(s => ({ value: s, label: s }))]} />
                    <FilterSelect label="Funding Source" value={funding} onChange={setFunding}
                      options={[{ value: "all" as const, label: "All Sources" }, ...FUNDING_SOURCES.map(f => ({ value: f, label: f }))]} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════ SECTION 1 — VENTURE PORTFOLIO ════ */}
        {show(1) && (
        <section className="space-y-4">
          <SectionHeader title="Venture Portfolio" blurb="How large and healthy is the entrepreneurship portfolio?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <Panel title="Venture Stage Distribution" subtitle="Ventures per stage"
              info="Number of ventures in each stage, sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={v.stageDist} margin={{ top: 4, right: 36, bottom: 0, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={96} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Ventures" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={22}>
                    <LabelList dataKey="value" position="right" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Venture Status" subtitle="Current operating status"
              info="Breakdown of ventures by current status, from pre-seed through to non-operational.">
              <Donut data={v.statusData} colors={PALETTE} total={v.statusTotal} totalLabel="Ventures" height={340} legendPercent />
            </Panel>
            <Panel title="Ventures Started per Year" subtitle="New ventures by year"
              info="Count of ventures launched each year, in chronological order.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={v.perYear} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
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
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="value" name="Survival rate" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Formal vs Informal Ventures" subtitle="Registration status"
              info="Share of ventures that are formally registered versus operating informally.">
              <Donut data={v.formal} colors={["#185FA5", "#C5D2E0"]} total={total} totalLabel="Ventures" height={340} legendPercent />
            </Panel>
            <Panel title="Founder Gender" subtitle="Founder gender split"
              info="Gender distribution of venture founders.">
              <Donut data={v.genderData} colors={GENDER_COLOR} total={total} totalLabel="Founders" height={340} legendPercent />
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 2 — BUSINESS GROWTH & SUSTAINABILITY ════ */}
        {show(2) && (
        <section className="space-y-4">
          <SectionHeader title="Business Growth & Sustainability" blurb="Are ventures becoming sustainable businesses?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Capital Secured" num={7900000} displayFmt={(n) => `$${(n / 1000000).toFixed(1)}M`} sub="raised to date" Icon={Banknote}
              tooltip="Total capital raised by ventures across the portfolio." />
            <StatsKpiCard label="Revenue Growth" num={500} sub="ventures growing revenue" Icon={TrendingUp}
              tooltip="Ventures reporting year-on-year revenue growth." />
            <StatsKpiCard label="Market Expansion" num={400} sub="entered new markets" Icon={Globe}
              tooltip="Ventures that expanded into new markets or geographies." />
          </div>
          <Panel title="Capital Raised Over Time" subtitle="Total raised by year (USD)"
            info="Total capital raised by ventures each year, in USD. Hover a point for the exact amount.">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={growth.capital} margin={{ top: 10, right: 16, bottom: 14, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                  label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                <YAxis tickFormatter={usd} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<MoneyTip />} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="value" name="Capital raised" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Monthly Income Distribution" subtitle="Founders per income band"
              info="Distribution of founders across monthly income bands, ascending from lowest to highest.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={growth.income} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Founders" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={34}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Funding Sources" subtitle="How ventures are funded"
              info="Primary funding source per venture, sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={v.funding} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} height={40} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Ventures" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={30}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Venture Growth by Stage" subtitle="Ventures across operating stages"
              info="Distribution of operating ventures across stages, idea through scaling.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={growth.byStage} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} height={40} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Ventures" fill={C_FEMALE} radius={[4, 4, 0, 0]} barSize={26}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 3 — EMPLOYMENT CREATED ════ */}
        {show(3) && (
        <section className="space-y-4">
          <SectionHeader title="Employment Created" blurb="How much work are these ventures creating?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Total Jobs" num={ji.totalJobs} sub="opportunities created" Icon={Briefcase}
              tooltip="Total jobs and opportunities created across all ventures." />
            <StatsKpiCard label="Avg Jobs / Venture" num={4} displayFmt={(n) => n.toFixed(1)} sub="per venture" Icon={Scale}
              tooltip="Average number of jobs created per venture." />
            <StatsKpiCard label="Full-time Jobs" num={ji.fullTime} sub="full-time roles" Icon={Briefcase}
              tooltip="Full-time jobs created by ventures." />
            <StatsKpiCard label="Part-time Jobs" num={ji.partTime} sub="part-time roles" Icon={Briefcase}
              tooltip="Part-time jobs created by ventures." />
            <StatsKpiCard label="Jobs for Women" num={ji.womenJobs} sub="held by women" Icon={WomanIcon}
              tooltip="Jobs created that are held by women." />
            <StatsKpiCard label="Jobs for Youth" num={ji.youthJobs} sub="held by youth" Icon={Users}
              tooltip="Jobs created that are held by youth." />
          </div>
          <Panel title="Jobs Created Over Time" subtitle="Total vs female, by year"
            info="Jobs created by year. Total is a solid line, female a dashed line; hover for per-year values.">
            <ResponsiveContainer width="100%" height={260}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Jobs by Employment Type" subtitle="Full-time · Part-time · Temporary"
              info="Contract-type split of jobs created by ventures.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.byType} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Direct vs Indirect Jobs" subtitle="By job category"
              info="How venture-created jobs break down across direct, indirect/part-time, and secondary/seasonal roles.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.composition} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs by Gender" subtitle="Male · Female · Other"
              info="Gender distribution of jobs created by ventures.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.byGender} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs by Priority Groups" subtitle="Inclusive reach, ranked"
              info="Jobs reaching priority groups — women, youth, refugees/displaced, and persons with disability. Sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={ji.priority} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Jobs" fill={BAND} radius={[0, 4, 4, 0]} barSize={20}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <Panel title="Job Quality Indicators" subtitle="Decent-work dimensions"
            info="Quality of venture-created jobs across reliable income, reputation, respect, sense of purpose, and other.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ji.quality} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
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
        </section>

        )}

        {/* ════ SECTION 4 — FOUNDER PROFILE & OUTCOMES ════ */}
        {show(4) && (
        <section className="space-y-4">
          <SectionHeader title="Founder Profile & Outcomes" blurb="Who are the entrepreneurs, and how has entrepreneurship changed their lives?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Female Entrepreneurs" num={662} sub="female founders" Icon={WomanIcon}
              tooltip="Number of female venture founders tracked." />
            <StatsKpiCard label="Scholar Entrepreneurs" num={founders.scholar.count} sub="MCF scholar founders" Icon={Star}
              tooltip="Founders who are Mastercard Foundation scholars." />
            <StatsKpiCard label="Female Scholars" num={founders.scholar.gender[0].value} sub="female scholar founders" Icon={WomanIcon}
              tooltip="Female founders who are Mastercard Foundation scholars." />
            <StatsKpiCard label="Countries Represented" num={founders.countries.length} sub="countries" Icon={Globe}
              tooltip="Number of countries where founders are based." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Founder Gender" subtitle="Founder gender split"
              info="Gender distribution of venture founders.">
              <Donut data={founders.genderData} colors={GENDER_COLOR} total={total} totalLabel="Founders" height={340} legendPercent />
            </Panel>
            <Panel title="Scholar vs Non-scholar Founders" subtitle="Scholar share of founders"
              info="Ventures led by Mastercard Foundation scholars versus other founders.">
              <Donut data={founders.scholarSplit} colors={["#185FA5", "#C5D2E0"]} total={total} totalLabel="Founders" height={340} legendPercent />
            </Panel>
            <Panel title="Scholar Founder Gender" subtitle="Female · Male"
              info="Gender split among scholar-led ventures.">
              <Donut data={founders.scholar.gender} colors={GENDER_COLOR} total={founders.scholar.count} totalLabel="Scholars" height={340} legendPercent />
            </Panel>
            <Panel title="Founders by Country" subtitle="Where founders are based, ranked"
              info="Countries where founders are based, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(240, founders.countries.length * 30)}>
                <BarChart layout="vertical" data={founders.countries} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Founders" fill={BAND} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <Panel title="Venture Work Indicators" subtitle="Share of founders reporting each, %"
            info="Share of founders reporting each decent-work indicator, on a fixed 0–100% scale.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={outcomes.indicators} margin={{ top: 20, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" name="Reporting" fill={BAND} radius={[4, 4, 0, 0]} barSize={64}>
                  <LabelList dataKey="value" position="top" fontSize={11} fill="#374151" fontWeight={700} formatter={(val: number) => `${val}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Household Improvements" subtitle="Reported impact areas, ranked"
              info="How venture income improved founder households, sorted from most to least reported.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={outcomes.household} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={160} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Respondents" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Reasons Founders Continue" subtitle="Why founders keep trading, ranked"
              info="Top reasons founders continue running their ventures, sorted from most to least cited.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={outcomes.persistence} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={170} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Founders" fill={C_FEMALE} radius={[0, 4, 4, 0]} barSize={18}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 5 — SECTORS & INNOVATION ════ */}
        {show(5) && (
        <section className="space-y-4">
          <SectionHeader title="Sectors & Innovation" blurb="Where are ventures creating value?" />
          <Panel title="Ventures by Sector" subtitle="Sectors, ranked"
            info="Sectors where ventures concentrate, sorted from most to least.">
            <ResponsiveContainer width="100%" height={Math.max(240, sectors.topSectors.length * 34)}>
              <BarChart layout="vertical" data={sectors.topSectors} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" name="Ventures" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Ventures by Industry" subtitle="Industries, ranked"
              info="Finer-grained industry breakdown of ventures, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(240, sectors.industries.length * 32)}>
                <BarChart layout="vertical" data={sectors.industries} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={120} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Ventures" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Technology vs Traditional" subtitle="Innovation profile of ventures"
              info="Share of ventures that are technology-enabled versus traditional businesses.">
              <Donut data={sectors.techVsTraditional} colors={["#185FA5", "#E0A458"]} total={total} totalLabel="Ventures" height={340} legendPercent />
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 6 — CHII SUPPORT & ECOSYSTEM ════ */}
        {show(6) && (
        <section className="space-y-4">
          <SectionHeader title="CHII Support & Ecosystem" blurb="How is CHII helping founders succeed?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Receiving Support" num={kpis.enablerCount} sub="ventures supported" Icon={LifeBuoy}
              tooltip="Ventures receiving CHII support or enabler services." />
            <StatsKpiCard label="Mentorship" num={184} sub="founders mentored" Icon={Users}
              tooltip="Founders who accessed mentorship support." />
            <StatsKpiCard label="Training" num={156} sub="founders trained" Icon={ShieldCheck}
              tooltip="Founders who accessed training support." />
            <StatsKpiCard label="Seed Funding" num={142} sub="founders funded" Icon={Star}
              tooltip="Founders who received seed funding." />
            <StatsKpiCard label="Incubated" num={118} sub="ventures incubated" Icon={Rocket}
              tooltip="Ventures that went through incubation." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Intervention Uptake" subtitle="CHII support used, ranked"
              info="CHII support interventions founders used, sorted by uptake. Same order as the helpfulness panel.">
              <ResponsiveContainer width="100%" height={Math.max(240, support.interventionUptake.length * 32)}>
                <BarChart layout="vertical" data={support.interventionUptake} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Founders" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Helpfulness Ratings (1–5)" subtitle="Same interventions, by score"
              info="Average helpfulness score (1–5) for each intervention. Row order matches the uptake panel.">
              <ResponsiveContainer width="100%" height={Math.max(240, support.helpfulness.length * 32)}>
                <BarChart layout="vertical" data={support.helpfulness} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Helpfulness" fill={C_FEMALE} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Overall Support Rating" subtitle="How founders rate CHII support"
              info="Founders' overall rating of CHII's support, from excellent to poor.">
              <Donut data={support.supportQuality} colors={PALETTE} total={support.supportTotal} totalLabel="Respondents" height={340} legendPercent />
            </Panel>
            <Panel title="Support by Venture Stage" subtitle="Supported ventures per stage"
              info="Number of CHII-supported ventures at each operating stage.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={support.byStage} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} height={40} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Supported ventures" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={26}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 8 — INSIGHTS & LEADERS ════ */}
        {show(8) && (
        <section className="space-y-4">
          <SectionHeader title="Insights & Leaders" blurb="Standout performance and emerging trends." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Top Performing Ventures" subtitle="By jobs created"
              info="The strongest job-creating ventures in the portfolio.">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ji.topVentures.slice(0, 6).map((row, i) => (
                  <div key={row.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: `${C_ACCENT}1A`, color: C_ACCENT, fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 12, color: NAVY, fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.name}</span>
                    <span style={{ fontSize: 10.5, color: "#9CA3AF" }}>{row.sector}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: NAVY, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>{fmt(row.jobs)}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Emerging Insights" subtitle="Key trends from the portfolio"
              info="Notable patterns observed across the venture portfolio.">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {insights.map((text, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: "rgba(224,164,88,0.16)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Lightbulb size={14} color="#E0A458" />
                    </span>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{text}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>
        )}

        <FeaturedImpactStory footer />
      </div>

      <style>{`
        .ent-row { transition: background-color 0.12s ease; }
        .ent-row:hover { background-color: rgba(24,95,165,0.07) !important; }
      `}</style>
    </div>
  );
}
