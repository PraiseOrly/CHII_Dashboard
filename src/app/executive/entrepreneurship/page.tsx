"use client";
import PortalFooter from "@/components/layout/portal-footer";
import { FilterSelect } from "@/components/ui/executive";
import { ChartTip } from "@/components/ui/executive";

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
} from "@/data/executive/entrepreneurship";
import FeaturedImpactStory from "@/components/layout/featured-impact-story";
import HeaderDesign from "@/components/layout/header-design";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import { DonutRing as Donut } from "@/components/charts/donut-chart";

/* ── palette ─────────────────────────────────────────── */
const NAVY = "#14306B";
const BAND = "#14306B";
const TICK = "#D17A86";
const PALETTE = ["#102C5E", "#479BD6", "#D45F2C", "#A81B2D", "#102C5E", "#D17A86", "#C5D2E0"];
const GENDER_COLOR: Record<Gender, string> = { Female: "#102C5E", Male: "#479BD6", "Non-binary": "#D45F2C" };
const C_ACCENT = "#102C5E";
const C_FEMALE = "#479BD6";

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();
const usd = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${Math.round(n)}`);

const YEARS = [2022, 2023, 2024, 2025, 2026];

/* female icon — matches the Outreach "Who Are We Reaching?" cards */
function WomanIcon({ size = 20, color, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color ?? "currentColor"} stroke={color ?? "currentColor"} style={style}>
      <circle cx="12" cy="3.4" r="3.25" stroke="none" />
      <path d="M8.3 7.1 L15.7 7.1 L14.24 12.2 L17.15 18.3 L6.85 18.3 L9.76 12.2 Z" stroke="none" />
      <path d="M8.98 7.5 C7.07 9.8 6.29 12.45 6.29 15.5" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15.02 7.5 C16.93 9.8 17.71 12.45 17.71 15.5" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10.21 18.3 L10.21 22.3" fill="none" strokeWidth="2.7" strokeLinecap="round" />
      <path d="M13.79 18.3 L13.79 22.3" fill="none" strokeWidth="2.7" strokeLinecap="round" />
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

/* white section KPI card — matches the "Jobs Created" cards in Youth in Work */
function SectionKpi({ Icon, label, num, displayFmt = (n) => Math.round(n).toLocaleString() }: {
  Icon: React.ComponentType<any>; label: string; num: number;
  displayFmt?: (n: number) => string; sub?: string; tooltip?: string;
}) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${C_ACCENT}`, padding: "13px 15px", display: "flex", alignItems: "center", justifyContent: "center", gap: 11 }}>
      <span style={{ width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={C_ACCENT} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 21, fontWeight: 800, color: NAVY, lineHeight: 1.05 }}>{displayFmt(num)}</p>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{label}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
const SECTIONS: { n: number; label: string }[] = [
  { n: 1, label: "Enterprise Portfolio" },
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

  /* ── Section 1: enterprise portfolio ──────────────────── */
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
    "Agriculture employs the largest number of youth across the enterprise portfolio.",
    `Female-led enterprises account for ${share(kpis.female, total)}% of all businesses.`,
    "CHII-supported enterprises create roughly 1.8× more jobs than unsupported ones.",
    "Formally registered businesses survive longer than informal businesses.",
  ];

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <HeaderDesign />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Entrepreneurship</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>The journey from founder to enterprise growth, jobs created, and long-term economic impact</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> CHII MELA Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span>{VENTURES.length} ventures tracked</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ OVERVIEW ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Entrepreneurs" num={1580} sub="founders tracked" Icon={Rocket}
              tooltip="Total entrepreneurs (founders) tracked across the portfolio." />
            <StatsKpiCard label="Active Enterprises" num={1386} sub="still operating" Icon={Activity}
              tooltip="Enterprises still trading (not closed or non-operational)." />
            <StatsKpiCard label="Jobs Created" num={54700} displayFmt={(n) => `${(n / 1000).toFixed(1)}K`} sub="opportunities" Icon={Briefcase}
              tooltip="Jobs and opportunities created across all enterprises." />
            <StatsKpiCard label="Female-led" num={62} displayFmt={(n) => `${Math.round(n)}%`} sub="of enterprises" Icon={WomanIcon}
              tooltip="Share of enterprises led by female founders." />
            <StatsKpiCard label="Capital Secured" num={7900000} displayFmt={(n) => `$${(n / 1000000).toFixed(1)}M`} sub="raised to date" Icon={Banknote}
              tooltip="Total capital raised by enterprises across the portfolio." />
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
          <SectionHeader title="Enterprise Portfolio" blurb="How large and healthy is the entrepreneurship portfolio?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <Panel title="Enterprise Stage Distribution" subtitle="Enterprises per stage"
              info="Number of enterprises in each stage, sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={v.stageDist} margin={{ top: 4, right: 36, bottom: 0, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={96} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Enterprises" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={22}>
                    <LabelList dataKey="value" position="right" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Enterprise Status" subtitle="Current operating status"
              info="Breakdown of enterprises by current status, from pre-seed through to non-operational.">
              <Donut data={v.statusData} colors={PALETTE} total={v.statusTotal} totalLabel="Enterprises" height={340} legendPercent />
            </Panel>
            <Panel title="Enterprises Started per Year" subtitle="New enterprises by year"
              info="Count of enterprises launched each year, in chronological order.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={v.perYear} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Enterprises" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={40}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Enterprise Survival Rate" subtitle="% surviving over time"
              info="Share of enterprises still operating at year 1, 3, and 5 after launch.">
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
            <Panel title="Formal vs Informal Enterprises" subtitle="Registration status"
              info="Share of enterprises that are formally registered versus operating informally.">
              <Donut data={v.formal} colors={["#102C5E", "#C5D2E0"]} total={total} totalLabel="Enterprises" height={340} legendPercent />
            </Panel>
            <Panel title="Founder Gender" subtitle="Founder gender split"
              info="Gender distribution of enterprise founders.">
              <Donut data={v.genderData} colors={GENDER_COLOR} total={total} totalLabel="Founders" height={340} legendPercent />
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 2 — BUSINESS GROWTH & SUSTAINABILITY ════ */}
        {show(2) && (
        <section className="space-y-4">
          <SectionHeader title="Business Growth & Sustainability" blurb="Are enterprises becoming sustainable businesses?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <SectionKpi label="Capital Secured" num={7900000} displayFmt={(n) => `$${(n / 1000000).toFixed(1)}M`} sub="raised to date" Icon={Banknote}
              tooltip="Total capital raised by enterprises across the portfolio." />
            <SectionKpi label="Revenue Growth" num={500} sub="enterprises growing revenue" Icon={TrendingUp}
              tooltip="Enterprises reporting year-on-year revenue growth." />
            <SectionKpi label="Market Expansion" num={400} sub="entered new markets" Icon={Globe}
              tooltip="Enterprises that expanded into new markets or geographies." />
          </div>
          <Panel title="Capital Raised Over Time" subtitle="Total raised by year (USD)"
            info="Total capital raised by enterprises each year, in USD. Hover a point for the exact amount.">
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
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Founders" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={34}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Funding Sources" subtitle="How enterprises are funded"
              info="Primary funding source per enterprise, sorted by magnitude.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={v.funding} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} height={40} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Enterprises" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={30}>
                    <LabelList dataKey="value" position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Enterprise Growth by Stage" subtitle="Enterprises across operating stages"
              info="Distribution of operating enterprises across stages, idea through scaling.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={growth.byStage} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} height={40} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Enterprises" fill={C_FEMALE} radius={[4, 4, 0, 0]} barSize={26}>
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
          <SectionHeader title="Employment Created" blurb="How much work are these enterprises creating?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <SectionKpi label="Total Jobs" num={ji.totalJobs} sub="opportunities created" Icon={Briefcase}
              tooltip="Total jobs and opportunities created across all enterprises." />
            <SectionKpi label="Avg Jobs / Enterprise" num={4} displayFmt={(n) => n.toFixed(1)} sub="per enterprise" Icon={Scale}
              tooltip="Average number of jobs created per enterprise." />
            <SectionKpi label="Full-time Jobs" num={ji.fullTime} sub="full-time roles" Icon={Briefcase}
              tooltip="Full-time jobs created by enterprises." />
            <SectionKpi label="Part-time Jobs" num={ji.partTime} sub="part-time roles" Icon={Briefcase}
              tooltip="Part-time jobs created by enterprises." />
            <SectionKpi label="Jobs for Women" num={ji.womenJobs} sub="held by women" Icon={WomanIcon}
              tooltip="Jobs created that are held by women." />
            <SectionKpi label="Jobs for Youth" num={ji.youthJobs} sub="held by youth" Icon={Users}
              tooltip="Jobs created that are held by youth." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          <Panel title="Jobs Created Over Time" subtitle="Total vs female, by year"
            info="Jobs created by year. Total is a solid line, female a dashed line; hover for per-year values.">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={ji.trend} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Total" stroke={C_ACCENT} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="Job Quality Indicators" subtitle="Decent-work dimensions"
            info="Quality of enterprise-created jobs across reliable income, reputation, respect, sense of purpose, and other.">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ji.quality} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                  <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <Panel title="Jobs by Employment Type" subtitle="Full-time · Part-time · Temporary"
              info="Contract-type split of jobs created by enterprises.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.byType} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Direct vs Indirect Jobs" subtitle="By job category"
              info="How enterprise-created jobs break down across direct, indirect/part-time, and secondary/seasonal roles.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.composition} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={48}>
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Jobs by Gender" subtitle="Male · Female · Non-binary"
              info="Gender distribution of jobs created by enterprises.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ji.byGender} margin={{ top: 18, right: 12, bottom: 0, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
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
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Jobs" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={20}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 4 — FOUNDER PROFILE & OUTCOMES ════ */}
        {show(4) && (
        <section className="space-y-4">
          <SectionHeader title="Founder Profile & Outcomes" blurb="Who are the entrepreneurs, and how has entrepreneurship changed their lives?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <SectionKpi label="Female Entrepreneurs" num={662} sub="female founders" Icon={WomanIcon}
              tooltip="Number of female enterprise founders tracked." />
            <SectionKpi label="Scholar Entrepreneurs" num={founders.scholar.count} sub="MCF scholar founders" Icon={Star}
              tooltip="Founders who are Mastercard Foundation scholars." />
            <SectionKpi label="Female Scholars" num={founders.scholar.gender[0].value} sub="female scholar founders" Icon={WomanIcon}
              tooltip="Female founders who are Mastercard Foundation scholars." />
            <SectionKpi label="Countries Represented" num={founders.countries.length} sub="countries" Icon={Globe}
              tooltip="Number of countries where founders are based." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Founder Gender" subtitle="Founder gender split"
              info="Gender distribution of enterprise founders.">
              <Donut data={founders.genderData} colors={GENDER_COLOR} total={total} totalLabel="Founders" height={340} legendPercent />
            </Panel>
            <Panel title="Scholar vs Non-scholar Founders" subtitle="Scholar share of founders"
              info="Enterprises led by Mastercard Foundation scholars versus other founders.">
              <Donut data={founders.scholarSplit} colors={["#102C5E", "#C5D2E0"]} total={total} totalLabel="Founders" height={340} legendPercent />
            </Panel>
            <Panel title="Scholar Founder Gender" subtitle="Female · Male"
              info="Gender split among scholar-led enterprises.">
              <Donut data={founders.scholar.gender} colors={GENDER_COLOR} total={founders.scholar.count} totalLabel="Scholars" height={340} legendPercent />
            </Panel>
          </div>
          <Panel title="Enterprise Work Indicators" subtitle="Share of founders reporting each, %"
            info="Share of founders reporting each decent-work indicator, on a fixed 0–100% scale.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={outcomes.indicators} margin={{ top: 20, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" name="Reporting" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={64}>
                  <LabelList dataKey="value" position="top" fontSize={11} fill="#374151" fontWeight={700} formatter={(val: number) => `${val}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Household Improvements" subtitle="Reported impact areas, ranked"
              info="How enterprise income improved founder households, sorted from most to least reported.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={outcomes.household} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={160} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Respondents" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={18}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Reasons Founders Continue" subtitle="Why founders keep trading, ranked"
              info="Top reasons founders continue running their enterprises, sorted from most to least cited.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={outcomes.persistence} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={170} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
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
          <SectionHeader title="Sectors & Innovation" blurb="Where are enterprises creating value?" />
          <Panel title="Enterprises by Sector" subtitle="Sectors, ranked"
            info="Sectors where enterprises concentrate, sorted from most to least.">
            <ResponsiveContainer width="100%" height={Math.max(240, sectors.topSectors.length * 34)}>
              <BarChart layout="vertical" data={sectors.topSectors} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" name="Enterprises" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={18}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Enterprises by Industry" subtitle="Industries, ranked"
              info="Finer-grained industry breakdown of enterprises, sorted from most to least.">
              <ResponsiveContainer width="100%" height={Math.max(240, sectors.industries.length * 32)}>
                <BarChart layout="vertical" data={sectors.industries} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={120} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Enterprises" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Technology vs Traditional" subtitle="Innovation profile of enterprises"
              info="Share of enterprises that are technology-enabled versus traditional businesses.">
              <Donut data={sectors.techVsTraditional} colors={["#102C5E", "#A81B2D"]} total={total} totalLabel="Enterprises" height={340} legendPercent />
            </Panel>
          </div>
        </section>

        )}

        {/* ════ SECTION 6 — CHII SUPPORT & ECOSYSTEM ════ */}
        {show(6) && (
        <section className="space-y-4">
          <SectionHeader title="CHII Support & Ecosystem" blurb="How is CHII helping founders succeed?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <SectionKpi label="Receiving Support" num={kpis.enablerCount} sub="enterprises supported" Icon={LifeBuoy}
              tooltip="Enterprises receiving CHII support or enabler services." />
            <SectionKpi label="Mentorship" num={184} sub="founders mentored" Icon={Users}
              tooltip="Founders who accessed mentorship support." />
            <SectionKpi label="Training" num={156} sub="founders trained" Icon={ShieldCheck}
              tooltip="Founders who accessed training support." />
            <SectionKpi label="Seed Funding" num={142} sub="founders funded" Icon={Star}
              tooltip="Founders who received seed funding." />
            <SectionKpi label="Incubated" num={118} sub="enterprises incubated" Icon={Rocket}
              tooltip="Enterprises that went through incubation." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <Panel title="Intervention Uptake" subtitle="CHII support used, ranked"
              info="CHII support interventions founders used, sorted by uptake. Same order as the helpfulness panel.">
              <ResponsiveContainer width="100%" height={Math.max(240, support.interventionUptake.length * 32)}>
                <BarChart layout="vertical" data={support.interventionUptake} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
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
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
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
            <Panel title="Support by Enterprise Stage" subtitle="Supported enterprises per stage"
              info="Number of CHII-supported enterprises at each operating stage.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={support.byStage} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} height={40} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="value" name="Supported enterprises" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={26}>
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
            <Panel title="Top Performing Enterprises" subtitle="By jobs created"
              info="The strongest job-creating enterprises in the portfolio.">
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
              info="Notable patterns observed across the enterprise portfolio.">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {insights.map((text, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: "rgba(224,164,88,0.16)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Lightbulb size={14} color="#A81B2D" />
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

        <PortalFooter portal="executive" />
      </div>

      <style>{`
        .ent-row { transition: background-color 0.12s ease; }
        .ent-row:hover { background-color: rgba(24,95,165,0.07) !important; }
      `}</style>
    </div>
  );
}
