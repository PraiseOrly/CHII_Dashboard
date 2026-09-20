"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hent";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import HeaderDesign from "@/components/layout/header-design";
import { studyTrips } from "@/data/study-trips";
import { founders } from "@/data/founders";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { Award, Briefcase, Handshake, Lightbulb, MapPin, Presentation, Rocket, TrendingUp, Users, Zap, Info, type LucideIcon, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, LabelList, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// Female icon - matches Executive dashboard
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

// Color palette - HENT green (matching venture-funding page)
const HERO = "#2D6A4F";
const BRAND = "#2D6A4F";
const BRAND_DK = "#0E4633";
const GREEN = "#2D6A4F";
const LIGHT_GREEN = "#E8F5F2";
const LIGHT_BORDER = "rgba(14, 70, 51, 0.12)";
const LIGHT_BG = "#F8F9FA";
const GREEN_RAMP = ["#1B4332","#2D6A4F","#40916C","#5BB4A0","#8ECCC4"];
const CHART_COLOR_1 = "#2D6A4F";
const CHART_COLOR_2 = "#00BCD4";
const CHART_COLOR_3 = "#FF5722";
const CHART_COLOR_4 = "#26A69A";

// Helpers
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n/1_000)}K` : `$${n}`;
}
function fmt$K(n: number) {
  const dollars = n * 1000;
  return fmt$(dollars);
}
function sg(s: string) {
  if (s === "Ideation" || s === "Validation") return "Expose";
  if (s === "Prototype/MVP" || s === "Early Growth") return "Build";
  return "Scale";
}
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// Note: StatsPanel moved to HeaderStatsPanel in @/components/ui/hent

// ──────────────────────────────────────────────────────────
// Panel Component for Charts
// ──────────────────────────────────────────────────────────

function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void }) {
  const [tip, setTip] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
      <div style={{ backgroundColor: BRAND, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, minWidth: 0, flex: 1 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#FF8C42", flexShrink: 0 }} />
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
      <div style={{ padding: "12px 18px 18px", backgroundColor: "white" }}>
        {children}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────────────────────

export default function HENTOverview() {
  const categories = [
    "Reach & Participation",
    "Innovation Pipeline",
    "Ventures & Enterprise",
    "Funding",
    "Employment Outcomes",
    "Quality & Satisfaction"
  ];

  // Section filter state (local state instead of URL params for immediate reactivity)
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const show = (category: string) => activeCategory === category;

  // Filter panel state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const activeFilters = (filterYear !== "All" ? 1 : 0) + (filterStage !== "All" ? 1 : 0) + (filterGender !== "All" ? 1 : 0) + (filterStatus !== "All" ? 1 : 0);

  // Chart filter states (independent per chart)
  const [filterReachYear, setFilterReachYear] = useState("All Years");
  const [filterReachGenderYear, setFilterReachGenderYear] = useState("All Years");
  const [filterInnovationYear, setFilterInnovationYear] = useState("All Years");
  const [filterInnovationFunnelYear, setFilterInnovationFunnelYear] = useState("All Years");
  const [filterVenturesYear, setFilterVenturesYear] = useState("All Years");
  const [filterVenturesFemaleYear, setFilterVenturesFemaleYear] = useState("All Years");
  const [filterFundingYear, setFilterFundingYear] = useState("All Years");
  const [filterFundingTrendYear, setFilterFundingTrendYear] = useState("All Years");
  const [filterEmploymentYear, setFilterEmploymentYear] = useState("All Years");
  const [filterEmploymentTrendYear, setFilterEmploymentTrendYear] = useState("All Years");
  const [filterQualityYear, setFilterQualityYear] = useState("All Years");
  const [filterQualityInclusionYear, setFilterQualityInclusionYear] = useState("All Years");

  // Aggregations
  const hackPart = hackathons.reduce((s, h) => s + h.participants, 0);
  const hackStart = hackathons.reduce((s, h) => s + h.startupsCreated, 0);
  const hackProjects = hackathons.reduce((s, h) => s + h.projects, 0);

  const TOTAL_PART = hackPart + masterclasses.reduce((s, m) => s + m.attendees, 0) +
                     studyTrips.reduce((s, v) => s + v.participants, 0) +
                     mentorshipPrograms.reduce((s, m) => s + m.fellows, 0);
  const TOTAL_FEM = hackathons.reduce((s, h) => s + h.femaleCount, 0) +
                    masterclasses.reduce((s, m) => s + m.femaleAttendees, 0) +
                    studyTrips.reduce((s, v) => s + v.femaleParticipants, 0);
  const FEMALE_PCT = TOTAL_PART ? Math.round((TOTAL_FEM / TOTAL_PART) * 100) : 0;

  const TOTAL_JOBS = ALL_VENTURES.reduce((s, v) => s + v.jobsTotal, 0);
  const TOTAL_JOBS_YOUTH = ALL_VENTURES.reduce((s, v) => s + v.jobsYouth, 0);
  const TOTAL_FUNDING = ALL_VENTURES.reduce((s, v) => s + v.funding, 0);
  const TOTAL_PSHIP = ALL_VENTURES.reduce((s, v) => s + v.partnerships, 0);

  const npsScores = founders.map(f => f.npsScore);
  const promoters = npsScores.filter(s => s >= 9).length;
  const detractors = npsScores.filter(s => s <= 6).length;
  const NPS_SCORE = npsScores.length ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0;

  const fundsCharitable = ALL_VENTURES.filter(v => v.fundType === "Charitable").reduce((s, v) => s + v.funding, 0);
  const fundsVentureF = ALL_VENTURES.filter(v => v.fundType === "Venture Fund").reduce((s, v) => s + v.funding, 0);
  const fundsCatalytic = ALL_VENTURES.filter(v => v.fundType === "Catalytic").reduce((s, v) => s + v.funding, 0);

  const recommendedVentures = ALL_VENTURES.filter(v => v.recommended).length;
  const acceleratorVentures = ALL_VENTURES.filter(v => v.accelerator).length;
  const acceleratorPct = ALL_VENTURES.length ? Math.round((acceleratorVentures / ALL_VENTURES.length) * 100) : 0;

  const pwdCount = founders.filter(f => f.isPWD).length;
  const refugeeCount = founders.filter(f => f.isRefugee).length;
  const mcfCount = founders.filter(f => f.isMCFScholar).length;

  const femaleVentures = ALL_VENTURES.filter(v => v.teamGender === "Female").length;
  const activeVentures = ALL_VENTURES.filter(v => v.status === "Active").length;
  const venturesFunded = ALL_VENTURES.filter(v => v.funding > 0).length;

  // Charts data
  const cohorts = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort((a, b) => a - b);
  const years = Array.from(new Set(hackathons.map(h => h.year))).sort();

  const femaleAndYouthJobsByYear = cohorts.map(c => {
    const femaleVentures = ALL_VENTURES.filter(v => v.cohort === c && v.teamGender === "Female");
    const femaleJobs = femaleVentures.reduce((s, v) => s + v.jobsTotal, 0);
    const youthJobs = ALL_VENTURES.filter(v => v.cohort === c).reduce((s, v) => s + v.jobsYouth, 0);
    return {
      year: String(c),
      "Female-Led Jobs": femaleJobs,
      "Youth Jobs": youthJobs,
    };
  });

  const stageData = [
    { name: "Expose", value: ALL_VENTURES.filter(v => sg(v.stage) === "Expose").length },
    { name: "Build", value: ALL_VENTURES.filter(v => sg(v.stage) === "Build").length },
    { name: "Scale", value: ALL_VENTURES.filter(v => sg(v.stage) === "Scale").length },
  ];

  const programData = [
    { name: "Hackathons", value: hackPart, fill: GREEN_RAMP[0] },
    { name: "Masterclasses", value: masterclasses.reduce((s, m) => s + m.attendees, 0), fill: GREEN_RAMP[1] },
    { name: "Study Trips", value: studyTrips.reduce((s, v) => s + v.participants, 0), fill: GREEN_RAMP[2] },
    { name: "Mentorship", value: mentorshipPrograms.reduce((s, m) => s + m.fellows, 0), fill: GREEN_RAMP[3] },
  ];

  const fundTypeData = [
    { name: "Charitable", value: fundsCharitable, fill: GREEN_RAMP[0] },
    { name: "Venture Fund", value: fundsVentureF, fill: GREEN_RAMP[1] },
    { name: "Catalytic", value: fundsCatalytic, fill: GREEN_RAMP[2] },
  ];

  const npsData = [
    { range: "Promoters (9-10)", count: promoters, fill: CHART_COLOR_1 },
    { range: "Passives (7-8)", count: npsScores.filter(s => s >= 7 && s <= 8).length, fill: CHART_COLOR_2 },
    { range: "Detractors (0-6)", count: detractors, fill: CHART_COLOR_3 },
  ];

  return (
    <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>HENT Overview</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>
                Health Entrepreneurship Programme Dashboard
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(190,228,214,0.5)" }}>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-7">

        {/* ════ TOP STATS HEADER ════ */}
        <HeaderStatsPanel
          title="HENT Programme Overview"
          description="Key performance indicators across all HENT programs"
          cards={[
            {
              label: "Total Participants",
              num: TOTAL_PART,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: "All programmes",
              tip: "Cumulative participants across all HENT programmes (masterclasses, hackathons, mentorship, study trips)",
            },
            {
              label: "Female Share",
              num: FEMALE_PCT,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: "Female participants",
              tip: "Percentage of female participants across all programmes",
            },
            {
              label: "Active Ventures",
              num: ALL_VENTURES.length,
              icon: Briefcase,
              sub: "Active ventures",
              tip: "Portfolio ventures currently active in the HENT portfolio",
            },
            {
              label: "Jobs Created",
              num: TOTAL_JOBS,
              icon: TrendingUp,
              displayFmt: (n) => n.toLocaleString(),
              sub: "Total employment",
              tip: "Total employment opportunities created by HENT ventures",
            },
            {
              label: "Total Funding",
              num: TOTAL_FUNDING,
              icon: Zap,
              displayFmt: fmt$,
              sub: "Capital deployed",
              tip: "Cumulative capital deployed to HENT ventures",
            },
            {
              label: "Female-Led",
              num: femaleVentures,
              icon: WomanIcon,
              sub: "Ventures",
              tip: "Number of ventures with female founder or co-founder",
            },
            {
              label: "NPS Score",
              num: NPS_SCORE,
              icon: Award,
              sub: "Satisfaction",
              tip: "Net Promoter Score - measure of participant satisfaction (average 0-10 scale)",
            },
          ]}
        />

        {/* ════ SECTION FILTER PILLS + FILTERS BUTTON ════ */}
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
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 20,
                border: `1px solid ${LIGHT_BORDER}`,
              borderLeft: `5px solid ${BRAND}`,
                backgroundColor: activeFilters > 0 ? BRAND : "white",
                color: activeFilters > 0 ? "white" : BRAND_DK,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              <SlidersHorizontal size={14} color={BRAND_DK} />
              Filters
              {activeFilters > 0 && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 800,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  color: activeFilters > 0 ? "white" : BRAND_DK,
                  borderRadius: 999,
                  minWidth: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {activeFilters}
                </span>
              )}
            </button>
            {filtersOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                backgroundColor: "white",
                border: `1px solid ${LIGHT_BORDER}`,
              borderLeft: `5px solid ${BRAND}`,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 20,
                minWidth: 300,
                overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${LIGHT_BORDER}` }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: BRAND_DK, margin: 0 }}>Filters</p>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    style={{
                      background: "none",
                      border: `1px solid ${LIGHT_BORDER}`,
              borderLeft: `5px solid ${BRAND}`,
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={16} color={BRAND_DK} />
                  </button>
                </div>
                <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Year Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Year</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All", ...years.map(String)].map(y => (
                        <button
                          key={y}
                          onClick={() => setFilterYear(y)}
                          style={{
                            fontSize: 10,
                            fontWeight: filterYear === y ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${filterYear === y ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: filterYear === y ? BRAND : "white",
                            color: filterYear === y ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stage Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Stage</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All", "Expose", "Build", "Scale"].map(s => (
                        <button
                          key={s}
                          onClick={() => setFilterStage(s)}
                          style={{
                            fontSize: 10,
                            fontWeight: filterStage === s ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${filterStage === s ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: filterStage === s ? BRAND : "white",
                            color: filterStage === s ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Gender</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All", "Male", "Female"].map(g => (
                        <button
                          key={g}
                          onClick={() => setFilterGender(g)}
                          style={{
                            fontSize: 10,
                            fontWeight: filterGender === g ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${filterGender === g ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: filterGender === g ? BRAND : "white",
                            color: filterGender === g ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Status</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All", "Active", "Stalled"].map(st => (
                        <button
                          key={st}
                          onClick={() => setFilterStatus(st)}
                          style={{
                            fontSize: 10,
                            fontWeight: filterStatus === st ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${filterStatus === st ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: filterStatus === st ? BRAND : "white",
                            color: filterStatus === st ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  {activeFilters > 0 && (
                    <button
                      onClick={() => {
                        setFilterYear("All");
                        setFilterStage("All");
                        setFilterGender("All");
                        setFilterStatus("All");
                      }}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: 10,
                        border: `1px solid ${LIGHT_BORDER}`,
              borderLeft: `5px solid ${BRAND}`,
                        backgroundColor: "transparent",
                        color: BRAND_DK,
                        cursor: "pointer",
                        marginTop: 4,
                      }}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════ REACH & PARTICIPATION ════ */}
        {show("Reach & Participation") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Reach & Participation
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Programme attendance and participant diversity</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Participants by Programme" subtitle="Distribution across programme types" info="Distribution of participants across masterclasses, hackathons, mentorship, and study trips" filterOptions={["All Years", ...years.map(String)]} filterValue={filterReachYear} onFilterChange={setFilterReachYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={programData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={CHART_COLOR_1} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Participants by Programme" subtitle="Distribution across programme types" info="Distribution of participants across masterclasses, hackathons, mentorship, and study trips" filterOptions={["All Years", ...years.map(String)]} filterValue={filterReachYear} onFilterChange={setFilterReachYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={programData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={CHART_COLOR_2} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ INNOVATION PIPELINE ════ */}
        {show("Innovation Pipeline") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Innovation Pipeline
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Hackathon funnel and venture progression</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Innovation Funnel" subtitle="Hackathon participants through to ventures" info="Conversion of participants through hackathons to startups to portfolio ventures" filterOptions={["All Years", ...years.map(String)]} filterValue={filterInnovationFunnelYear} onFilterChange={setFilterInnovationFunnelYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Participants", value: hackPart },
                    { name: "Projects", value: hackProjects },
                    { name: "Startups", value: hackStart },
                    { name: "Portfolio", value: ALL_VENTURES.length },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={CHART_COLOR_1} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Ventures by Stage" subtitle="Development stage distribution" info="Distribution of ventures across development stages (Expose, Build, Scale)" filterOptions={["All Years", ...years.map(String)]} filterValue={filterInnovationYear} onFilterChange={setFilterInnovationYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={CHART_COLOR_4} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ VENTURES & ENTERPRISE ════ */}
        {show("Ventures & Enterprise") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Ventures & Enterprise
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Portfolio size and venture characteristics</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Venture Stage Pipeline" subtitle="Distribution across Expose · Build · Scale" info="Distribution of ventures across development stages (Expose, Build, Scale)" filterOptions={["All Years", ...years.map(String)]} filterValue={filterVenturesYear} onFilterChange={setFilterVenturesYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={CHART_COLOR_1} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Female-Led Ventures Trend" subtitle="Year-over-year progress" info="Annual trend of ventures with female founders or co-founders" filterOptions={["All Years", ...years.map(String)]} filterValue={filterVenturesFemaleYear} onFilterChange={setFilterVenturesFemaleYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cohorts.map(c => ({ year: String(c), count: ALL_VENTURES.filter(v => v.cohort === c && v.teamGender === "Female").length }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="count" stroke={CHART_COLOR_2} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Female-Led" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ FUNDING ════ */}
        {show("Funding") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Funding Overview
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Capital deployment across fund types, stages, and efficiency metrics</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />

            {/* Funding KPI Strip */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24 }}>
                  <div style={{ borderRight: `1px solid ${LIGHT_BORDER}`, paddingRight: 20 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280", margin: "0 0 6px 0", letterSpacing: "0.02em" }}>Total Funding Deployed</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: BRAND_DK, margin: 0 }}>{fmt$(TOTAL_FUNDING)}</p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, margin: "4px 0 0 0" }}>To {venturesFunded} ventures</p>
                  </div>
                  <div style={{ borderRight: `1px solid ${LIGHT_BORDER}`, paddingRight: 20 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280", margin: "0 0 6px 0", letterSpacing: "0.02em" }}>Average Ticket Size</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: BRAND_DK, margin: 0 }}>{fmt$(venturesFunded > 0 ? Math.round(TOTAL_FUNDING / venturesFunded) : 0)}</p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, margin: "4px 0 0 0" }}>Per venture</p>
                  </div>
                  <div style={{ borderRight: `1px solid ${LIGHT_BORDER}`, paddingRight: 20 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280", margin: "0 0 6px 0", letterSpacing: "0.02em" }}>Cost per Job</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: BRAND_DK, margin: 0 }}>{fmt$(TOTAL_JOBS > 0 ? Math.round(TOTAL_FUNDING / TOTAL_JOBS) : 0)}</p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, margin: "4px 0 0 0" }}>Capital per job created</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#6B7280", margin: "0 0 6px 0", letterSpacing: "0.02em" }}>Ventures Funded</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: BRAND_DK, margin: 0 }}>{venturesFunded}</p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, margin: "4px 0 0 0" }}>{Math.round((venturesFunded / ALL_VENTURES.length) * 100)}% of portfolio</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Capital by Fund Type" subtitle="Charitable, Venture, and Catalytic distribution" info="Funding distribution across Charitable, Venture Fund, and Catalytic sources" filterOptions={["All Years", ...years.map(String)]} filterValue={filterFundingYear} onFilterChange={setFilterFundingYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart layout="vertical" data={fundTypeData} margin={{ top: 4, right: 36, bottom: 0, left: 8 }} barSize={16} barCategoryGap="20%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9CA3AF" }} tickFormatter={(v) => fmt$(v)} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={104} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={CHART_COLOR_2} radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="value" position="right" fontSize={10} fill="var(--chart-label)" fontWeight={700} formatter={(v: number) => fmt$(v)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Funding Trend" subtitle="Capital deployed annually" info="Annual funding disbursement to ventures showing acceleration or sustainability" filterOptions={["All Years", ...years.map(String)]} filterValue={filterFundingTrendYear} onFilterChange={setFilterFundingTrendYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={cohorts.map(c => ({ year: String(c), funding: ALL_VENTURES.filter(v => v.cohort === c && v.funding > 0).reduce((s, v) => s + v.funding, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="funding" stroke={CHART_COLOR_4} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Funding Deployed" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            <div style={{ marginTop: 16 }}>
              <Panel title="Funding by Venture Stage" subtitle="Capital distribution across Expose, Build, and Scale stages" info="How capital flows to ventures at different stages of development, from initial exposure through scaling">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={cohorts.map(c => {
                    const exposeVentures = ALL_VENTURES.filter(v => v.cohort === c && sg(v.stage) === "Expose");
                    const buildVentures = ALL_VENTURES.filter(v => v.cohort === c && sg(v.stage) === "Build");
                    const scaleVentures = ALL_VENTURES.filter(v => v.cohort === c && sg(v.stage) === "Scale");
                    return {
                      year: String(c),
                      "Expose": exposeVentures.reduce((s, v) => s + v.funding, 0),
                      "Build": buildVentures.reduce((s, v) => s + v.funding, 0),
                      "Scale": scaleVentures.reduce((s, v) => s + v.funding, 0),
                    };
                  })} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Expose" stackId="stage" fill={GREEN_RAMP[0]} barSize={26} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Build" stackId="stage" fill={GREEN_RAMP[2]} barSize={26} />
                    <Bar dataKey="Scale" stackId="stage" fill={GREEN_RAMP[4]} barSize={26} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ EMPLOYMENT OUTCOMES ════ */}
        {show("Employment Outcomes") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Employment Outcomes
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Jobs created and youth employment focus</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Female-Led & Youth Jobs" subtitle="Employment by female-led ventures and youth" info="Annual employment opportunities created by female-led ventures and jobs for youth" filterOptions={["All Years", ...years.map(String)]} filterValue={filterEmploymentYear} onFilterChange={setFilterEmploymentYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={femaleAndYouthJobsByYear} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Female-Led Jobs" stackId="jobs" fill={GREEN_RAMP[0]} barSize={26} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Youth Jobs" stackId="jobs" fill={GREEN_RAMP[2]} barSize={26} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Job Creation Trend" subtitle="Growth over time" info="Annual trend of employment opportunities created" filterOptions={["All Years", ...years.map(String)]} filterValue={filterEmploymentTrendYear} onFilterChange={setFilterEmploymentTrendYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cohorts.map(c => ({ year: String(c), jobs: ALL_VENTURES.filter(v => v.cohort === c).reduce((s, v) => s + v.jobsTotal, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="jobs" stroke={CHART_COLOR_3} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Jobs Created" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ QUALITY & SATISFACTION ════ */}
        {show("Quality & Satisfaction") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Quality & Satisfaction
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Founder engagement and programme quality</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="NPS Distribution" subtitle="Founder satisfaction breakdown" info="Breakdown of founder satisfaction scores (Promoters, Passives, Detractors)" filterOptions={["All Years", ...years.map(String)]} filterValue={filterQualityYear} onFilterChange={setFilterQualityYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={npsData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Bar dataKey="count" barSize={46} radius={[4, 4, 0, 0]}>
                      {npsData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.fill} />)}
                      <LabelList dataKey="count" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LIGHT_BORDER}`, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
                  {npsData.map((d) => (
                    <span key={d.range} style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 6, borderRadius: 2, display: "inline-block", backgroundColor: d.fill }} /> {d.range}</span>
                  ))}
                </div>
              </Panel>
              <Panel title="Founder Satisfaction Breakdown" subtitle="NPS distribution" info="Breakdown of founder satisfaction scores (Promoters, Passives, Detractors)" filterOptions={["All Years", ...years.map(String)]} filterValue={filterQualityYear} onFilterChange={setFilterQualityYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={npsData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="count" barSize={46} radius={[4, 4, 0, 0]}>
                      {npsData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.fill} />)}
                      <LabelList dataKey="count" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <PortalFooter portal="hent" synced="01 Jun 2026, EAT" />

      </div>
    </div>
  );
}
