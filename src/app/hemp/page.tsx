"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { DonutRing } from "@/components/charts/donut-chart";
import { sieCohorts } from "@/data/hemp/sie";
import { ghCohorts } from "@/data/hemp/global-health";
import { healthXSymposia, LEAD_TYPES, EMPLOYER_SECTORS } from "@/data/hemp/healthx-careers";
import { REACH_RECORDS, COUNTRY_REGION, GEO_REGIONS, GEO_COUNTRIES, GEO_YEARS } from "@/data/hemp/geo-reach";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/mission-students";
import {
  Accessibility, Activity, Award, Briefcase, Building2, GraduationCap,
  Globe, Handshake, Rocket, Shield, Sparkles, TrendingUp, Users, Zap, type LucideIcon, Info, ChevronDown, X
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, LabelList, PieChart, Pie,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Brand ───────────────────────────────────────────────────────────────────
const HERO     = "#102C5E";
const BRAND    = "#14306B";
const BRAND_DK = "#0C447C";
const SECTION  = "#185FA5";
const LIGHT_BORDER = "rgba(16, 44, 94, 0.12)";
const LIGHT_BG = "#F8F9FA";

// ─── Custom Icons ────────────────────────────────────────────────────────────
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

// Chart colors
const TH_NAVY   = "#102C5E";
const TH_BLUE   = "#479BD6";
const TH_ORANGE = "#D45F2C";

// Engagement colors
const TEAL     = TH_NAVY;
const AMBER    = TH_BLUE;
const SKY      = "#7F77DD";
const GREEN    = "#0F6E56";
const VIOLET   = TH_ORANGE;

const ENGAGEMENT: Record<string, string> = {
  "Career Exposure":  TEAL,
  Internships:        AMBER,
  SIE:                SKY,
  Courses:            GREEN,
};

const DISTINCT = ["#185FA5","#0F6E56","#534AB7","#BA7517","#479BD6","#1D9E75","#7F77DD","#D45F2C","#14306B","#085041","#2F5FD1","#85B7EB","#378ADD","#5F5E5A","#102C5E"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function pct(n: number, d: number): number {
  return d ? Math.round((n / d) * 100) : 0;
}

// ─── Data aggregations ───────────────────────────────────────────────────────
const hxSessions = healthXSessions.length;
const hxPart     = healthXSessions.reduce((s, h) => s + h.participants, 0);
const hxFem      = healthXSessions.reduce((s, h) => s + h.femalePart, 0);
const hxSatAvg   = parseFloat(avg(healthXSessions.map(h => avg(Object.values(h.scores)))).toFixed(1));

const intStudents      = internships.reduce((s, i) => s + i.students, 0);
const intFem           = internships.reduce((s, i) => s + i.femaleStudents, 0);
const intConversions   = internships.reduce((s, i) => s + i.employmentConversions, 0);
const intSatAvg        = parseFloat(avg(internships.map(i => i.satisfactionScore)).toFixed(1));
const intConversionPct = pct(intConversions, intStudents);

const sieSelected      = sieCohorts.reduce((s, c) => s + c.selected, 0);
const sieFem            = sieCohorts.reduce((s, c) => s + c.female, 0);
const sieSatAvg         = parseFloat(avg(sieCohorts.map(c => c.satisfaction)).toFixed(1));

const ghEnrolled       = ghCohorts.reduce((s, c) => s + c.enrolled, 0);
const ghFem            = ghCohorts.reduce((s, c) => s + c.female, 0);
const ghSatAvg         = parseFloat(avg(ghCohorts.map(c => c.satisfaction)).toFixed(1));

const symStudents      = healthXSymposia.reduce((s, x) => s + x.studentsAttending, 0);
const symFem           = healthXSymposia.reduce((s, x) => s + x.femaleStudents, 0);
const symUsefulnessAvg = parseFloat(avg(healthXSymposia.map(x => x.usefulness)).toFixed(1));

// Career Exposure (combined HealthX + Career Symposia)
const careerExposurePart    = hxPart + symStudents;
const careerExposureFem     = hxFem + symFem;
const careerExposureSessions = hxSessions + healthXSymposia.length;
const careerExposureSatAvg  = parseFloat(avg([hxSatAvg, symUsefulnessAvg]).toFixed(1));

// Totals
const TOTAL_REACH    = careerExposurePart + intStudents + sieSelected + ghEnrolled;
const TOTAL_FEM      = careerExposureFem + intFem + sieFem + ghFem;
const FEMALE_PCT_ALL = pct(TOTAL_FEM, TOTAL_REACH);
const AVG_SAT         = parseFloat(avg([careerExposureSatAvg, intSatAvg, sieSatAvg, ghSatAvg]).toFixed(1));
const ENGAGEMENT_COUNT = careerExposureSessions + internships.length + sieCohorts.length + ghCohorts.length;

const REFUGEE_PCT = 8;
const PWD_PCT     = 5;
const VULNERABLE_PCT = REFUGEE_PCT + PWD_PCT;

// Graduate outcomes
const totalStudents = missionStudents.length;
const completed      = missionStudents.filter(s => s.status === "Completed");
const employed       = completed.filter(s => s.employment === "Employed" || s.employment === "Entrepreneur");
const ventures       = missionStudents.filter(s => s.ventureCreated);
const employPct      = pct(employed.length, completed.length);

// Chart data
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

const reachByYear = YEARS
  .map(yr => {
    const hx = healthXSessions.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0);
    const sym = healthXSymposia.filter(x => x.year === yr).reduce((s, x) => s + x.studentsAttending, 0);
    const row = {
      Year: String(yr),
      "Career Exposure": hx + sym,
      Internships: internships.filter(i => i.year === yr).reduce((s, i) => s + i.students, 0),
      SIE: sieCohorts.filter(c => c.year === yr).reduce((s, c) => s + c.selected, 0),
      Courses: ghCohorts.filter(c => c.cohortYear === yr).reduce((s, c) => s + c.enrolled, 0),
    };
    const Total = row["Career Exposure"] + row.Internships + row.SIE + row.Courses;
    return { ...row, Total };
  })
  .filter(d => d.Total > 0);

const participantsByProgData = [
  { name: "Career Exposure", value: careerExposurePart },
  { name: "Internships", value: intStudents },
  { name: "SIE", value: sieSelected },
  { name: "Courses", value: ghEnrolled },
].sort((a, b) => b.value - a.value);

const genderByEngagement = [
  { name: "Career Exposure", Female: careerExposureFem, Male: careerExposurePart - careerExposureFem },
  { name: "Internships", Female: intFem, Male: intStudents - intFem },
  { name: "SIE", Female: sieFem, Male: sieSelected - sieFem },
  { name: "Courses", Female: ghFem, Male: ghEnrolled - ghFem },
].sort((a, b) => (b.Female + b.Male) - (a.Female + a.Male));

const outcomesByYear = YEARS
  .map(yr => {
    const grads = missionStudents.filter(s => s.cohort === yr && s.status === "Completed").length;
    const vents = missionStudents.filter(s => s.cohort === yr && s.ventureCreated).length;
    return { Year: String(yr), Graduates: grads, Ventures: vents };
  })
  .filter(d => d.Graduates + d.Ventures > 0);

const organizationCounts = Object.entries(
  internships.reduce<Record<string, number>>((a, i) => { a[i.organization] = (a[i.organization] || 0) + i.students; return a; }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

const empOutcomes = [
  { name: "Employed", value: completed.filter(s => s.employment === "Employed").length },
  { name: "Entrepreneur", value: completed.filter(s => s.employment === "Entrepreneur").length },
  { name: "Further Study", value: completed.filter(s => s.employment === "Further Study").length },
  { name: "Seeking", value: completed.filter(s => s.employment === "Seeking").length },
];

// Post-internship job placements
const jobPlacementsByOrganization = Object.entries(
  internships.reduce<Record<string, number>>((a, i) => { a[i.organization] = (a[i.organization] || 0) + i.placementsAfterInternship; return a; }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

const conversionRateByYear = YEARS
  .map(yr => {
    const yearInternships = internships.filter(i => i.year === yr);
    if (yearInternships.length === 0) return null;
    const totalStudents = yearInternships.reduce((s, i) => s + i.students, 0);
    const totalConversions = yearInternships.reduce((s, i) => s + i.employmentConversions, 0);
    const rate = totalStudents ? Math.round((totalConversions / totalStudents) * 100) : 0;
    return { Year: String(yr), "Conversion Rate %": rate, Students: totalStudents, Conversions: totalConversions };
  })
  .filter((d): d is NonNullable<typeof d> => d !== null && d.Students > 0);

// ─── Panel Component ─────────────────────────────────────────────────────────
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

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
            {title}
          </p>
          <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HEMPOverview() {
  const categories = [
    "Reach & Participation",
    "Learning & Quality",
    "Outcomes & Innovation",
    "Ecosystem & Impact",
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const show = (category: string) => activeCategory === category;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All");
  const [filterRegion, setFilterRegion] = useState("All Regions");
  const [filterCountry, setFilterCountry] = useState("All Countries");

  const activeFilters = (filterYear !== "All" ? 1 : 0) + (filterRegion !== "All Regions" ? 1 : 0) + (filterCountry !== "All Countries" ? 1 : 0);

  const [filterReachYear, setFilterReachYear] = useState("All Years");
  const [filterRegionYear, setFilterRegionYear] = useState("All Years");

  const geoCountryData = useMemo(() => {
    const counts = REACH_RECORDS
      .filter(r => filterRegion === "All Regions" || COUNTRY_REGION[r.country] === filterRegion)
      .filter(r => filterCountry === "All Countries" || r.country === filterCountry)
      .filter(r => filterYear === "All" || String(r.year) === filterYear)
      .reduce<Record<string, number>>((a, r) => { a[r.country] = (a[r.country] || 0) + r.reach; return a; }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filterRegion, filterCountry, filterYear]);

  const regionChartData = useMemo(() => {
    const reach: Record<string, number> = {};
    const female: Record<string, number> = {};
    const countries: Record<string, Set<string>> = {};
    REACH_RECORDS
      .filter(r => filterRegionYear === "All Years" || String(r.year) === filterRegionYear)
      .forEach(r => {
        const reg = COUNTRY_REGION[r.country] || "Other";
        reach[reg] = (reach[reg] || 0) + r.reach;
        female[reg] = (female[reg] || 0) + r.female;
        (countries[reg] = countries[reg] || new Set()).add(r.country);
      });
    return Object.keys(reach)
      .map(reg => ({ name: reg, value: reach[reg], countries: countries[reg].size, female: female[reg] }))
      .sort((a, b) => b.value - a.value);
  }, [filterRegionYear]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: LIGHT_BG }}>
      <PortalNav portal="hemp" />

      {/* HEADER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design2.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>HEMP Overview</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Health Enterprise and Medical Professions Programme Dashboard
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Period:</span> 2021–2026</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-7">

        {/* ════ TOP STATS HEADER ════ */}
        <HeaderStatsPanel
          title="HEMP Programme Overview"
          description="Key performance indicators across all HEMP programs"
          cards={[
            {
              label: "Total Reach",
              num: TOTAL_REACH,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: "Participants",
              tip: "Total participants across all HEMP engagements",
            },
            {
              label: "Female Participation",
              num: FEMALE_PCT_ALL,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: "Female share",
              tip: `Female participants across HEMP (${TOTAL_FEM.toLocaleString()} people)`,
            },
            {
              label: "Engagements",
              num: ENGAGEMENT_COUNT,
              icon: Activity,
              sub: "Sessions delivered",
              tip: "Total number of engagements and interventions",
            },
            {
              label: "Refugees & Disability",
              num: VULNERABLE_PCT,
              icon: Accessibility,
              displayFmt: (n) => n + "%",
              sub: "Vulnerable populations",
              tip: "Refugees (8%) and persons living with disability (5%) participation rate",
            },
            {
              label: "Employment Rate",
              num: employPct,
              icon: TrendingUp,
              displayFmt: (n) => n + "%",
              sub: "Graduate outcomes",
              tip: "Employed or entrepreneur (target: 70%)",
            },
            {
              label: "Internship Conversions",
              num: intConversionPct,
              icon: Briefcase,
              displayFmt: (n) => n + "%",
              sub: "Employment conversion",
              tip: "Internship placements converting to employment",
            },
            {
              label: "Global Health Course",
              num: ghEnrolled,
              icon: GraduationCap,
              displayFmt: (n) => n.toLocaleString(),
              sub: "Enrolled",
              tip: `Students enrolled in Intro to Global Health (${pct(ghFem, ghEnrolled)}% female, avg satisfaction: ${ghSatAvg}/5)`,
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              Filters
              {activeFilters > 0 && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 800,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  color: "white",
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
                <div style={{ backgroundColor: BRAND, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>Filters</p>
                  <button
                    onClick={() => {
                      setFilterYear("All");
                      setFilterRegion("All Regions");
                      setFilterCountry("All Countries");
                    }}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.35)",
                      borderRadius: 6,
                      padding: "3px 8px",
                      backgroundColor: "rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Reset
                  </button>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Year Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Year</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All", ...GEO_YEARS.map(String)].map(y => (
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

                  {/* Region Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Region</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All Regions", ...GEO_REGIONS].map(r => (
                        <button
                          key={r}
                          onClick={() => setFilterRegion(r)}
                          style={{
                            fontSize: 10,
                            fontWeight: filterRegion === r ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${filterRegion === r ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: filterRegion === r ? BRAND : "white",
                            color: filterRegion === r ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Country</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All Countries", ...GEO_COUNTRIES.slice(0, 8)].map(c => (
                        <button
                          key={c}
                          onClick={() => setFilterCountry(c)}
                          style={{
                            fontSize: 10,
                            fontWeight: filterCountry === c ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${filterCountry === c ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: filterCountry === c ? BRAND : "white",
                            color: filterCountry === c ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════ REACH & PARTICIPATION ════ */}
        {show("Reach & Participation") && (
          <section style={{ marginBottom: 48 }}>
            <SectionTitle title="Reach & Participation" subtitle="Programme attendance and participant diversity" />
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Participants by Engagement" subtitle="Distribution across all HEMP programmes" info="Total participants across Career Exposure, Internships, SIE, and Courses programmes by year" filterOptions={["All Years", ...YEARS.map(String)]} filterValue={filterReachYear} onFilterChange={setFilterReachYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={participantsByProgData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      {participantsByProgData.map((d) => (<Cell key={d.name} fill={ENGAGEMENT[d.name] ?? BRAND} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                  {participantsByProgData.map((d) => (
                    <span key={d.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: ENGAGEMENT[d.name] ?? BRAND }} />{d.name}
                    </span>
                  ))}
                </div>
              </Panel>
              <Panel title="Reach Over Time" subtitle="Total participant reach across 2021–2026" info="Year-on-year trend of total programme participants showing growth trajectory across all HEMP initiatives">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reachByYear} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="Year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Line type="monotone" dataKey="Total" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3, fill: BRAND }} activeDot={{ r: 5 }} name="Total Reach" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 16 }}>
              <Panel title="Gender Participation" subtitle="Female vs. male by engagement" info="Gender distribution of participants across Career Exposure, Internships, SIE, and Courses programmes">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={genderByEngagement} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="Female" stackId="g" fill="#185FA5" />
                    <Bar dataKey="Male" stackId="g" fill="#85B7EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#185FA5" }} /> Female</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#85B7EB" }} /> Male</span>
                </div>
              </Panel>

              <Panel title="Reach by Region" subtitle="Participants by African region" info="Distribution of programme participants across African regions with year-on-year filtering capability" filterOptions={["All Years", ...GEO_YEARS.map(String)]} filterValue={filterRegionYear} onFilterChange={setFilterRegionYear}>
                {regionChartData.length ? (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={regionChartData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                        <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={46}>
                          {regionChartData.map((d, i) => (<Cell key={d.name} fill={DISTINCT[i % DISTINCT.length]} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                      {regionChartData.map((d, i) => (
                        <div key={d.name} className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: DISTINCT[i % DISTINCT.length] }} />
                            {d.name}
                          </span>
                          <span className="text-gray-500 tabular-nums">
                            <b className="text-gray-700">{d.value.toLocaleString()}</b> people · {d.countries} countries
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-gray-400 text-center py-6">No records match the selected filter.</p>
                )}
              </Panel>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 16 }}>
              <Panel title="PWD Participation" subtitle="Persons with disability representation across programmes" info="8% representation of persons with disabilities across all HEMP programmes">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Career Exposure", value: Math.round((careerExposurePart * 0.08)), pct: 8 },
                    { name: "Internships", value: Math.round((intStudents * 0.08)), pct: 8 },
                    { name: "SIE", value: Math.round((sieSelected * 0.08)), pct: 8 },
                    { name: "Courses", value: Math.round((ghEnrolled * 0.08)), pct: 8 },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} formatter={(v: number) => v.toLocaleString()} />
                    <Bar dataKey="value" fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      <LabelList dataKey="pct" position="top" fontSize={10} fill={BRAND_DK} fontWeight={700} formatter={(v: number) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#0F6E56" }} /> % of total participants</span>
                </div>
              </Panel>

              <Panel title="Refugees & Displaced Persons" subtitle="Refugee and displaced person representation across programmes" info="5% representation of refugees and displaced persons across all HEMP programmes">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Career Exposure", value: Math.round((careerExposurePart * 0.05)), pct: 5 },
                    { name: "Internships", value: Math.round((intStudents * 0.05)), pct: 5 },
                    { name: "SIE", value: Math.round((sieSelected * 0.05)), pct: 5 },
                    { name: "Courses", value: Math.round((ghEnrolled * 0.05)), pct: 5 },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} formatter={(v: number) => v.toLocaleString()} />
                    <Bar dataKey="value" fill="#BA7517" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      <LabelList dataKey="pct" position="top" fontSize={10} fill={BRAND_DK} fontWeight={700} formatter={(v: number) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#BA7517" }} /> % of total participants</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ LEARNING & QUALITY ════ */}
        {show("Learning & Quality") && (
          <section style={{ marginBottom: 48 }}>
            <SectionTitle title="Learning & Quality" subtitle="Participant satisfaction and experience" />
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Satisfaction by Engagement" subtitle="Average scores vs. target of 4.5/5" info="Participant satisfaction ratings by engagement type compared against the target score of 4.5 out of 5">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Career Exposure", value: careerExposureSatAvg },
                    { name: "Internships", value: intSatAvg },
                    { name: "SIE", value: sieSatAvg },
                    { name: "Courses", value: ghSatAvg },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      {[careerExposureSatAvg, intSatAvg, sieSatAvg, ghSatAvg].map((_, i) => (<Cell key={i} fill={[TEAL, AMBER, SKY, GREEN][i]} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Overall Programme Satisfaction" subtitle="Average scores by engagement type" info="Satisfaction ratings from participants across all engagement types, measured on a scale of 1-5">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Career Exposure", value: careerExposureSatAvg },
                    { name: "Internships", value: intSatAvg },
                    { name: "SIE", value: sieSatAvg },
                    { name: "Courses", value: ghSatAvg },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      {[careerExposureSatAvg, intSatAvg, sieSatAvg, ghSatAvg].map((_, i) => (<Cell key={i} fill={[TEAL, AMBER, SKY, GREEN][i]} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LIGHT_BORDER}`, textAlign: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: BRAND_DK, margin: 0 }}>Average: {AVG_SAT.toFixed(1)}/5</p>
                  <p style={{ fontSize: 10, color: AVG_SAT >= 4.5 ? "#16A34A" : "#F59E0B", marginTop: 4, fontWeight: 600, margin: 0 }}>
                    {AVG_SAT >= 4.5 ? "✓ On target" : "⚠ Below target"}
                  </p>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ OUTCOMES & INNOVATION ════ */}
        {show("Outcomes & Innovation") && (
          <section style={{ marginBottom: 48 }}>
            <SectionTitle title="Outcomes & Innovation" subtitle="Graduate careers, venture creation, and job placement tracking" />
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Employment Outcomes" subtitle="Graduate employment status" info="Employment status of programme graduates including employed, entrepreneurs, pursuing further study, and job seekers">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={empOutcomes} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="value" fill={BRAND} radius={[4, 4, 0, 0]} maxBarSize={46}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Venture & Graduate Trends" subtitle="Graduates and ventures created by year" info="Year-on-year comparison of programme graduates and ventures created by alumni">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={outcomesByYear} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%" barGap={2}>
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="Graduates" fill={TH_NAVY} radius={[4, 4, 0, 0]} maxBarSize={16} />
                    <Bar dataKey="Ventures" fill={TH_BLUE} radius={[4, 4, 0, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: TH_NAVY }} /> Graduates</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: TH_BLUE }} /> Ventures</span>
                </div>
              </Panel>
              <Panel title="Job Placements by Organization" subtitle="Post-internship placements across partner organizations" info="Total job placements achieved after internship completion across all partner organizations">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={jobPlacementsByOrganization} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="value" fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill="#085041" fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Employment Conversion Rate" subtitle="Year-on-year internship to employment conversion" info="Percentage of interns who secured employment as a result of their internship each year">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={conversionRateByYear} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} label={{ value: "%", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#9CA3AF" } }} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="Conversion Rate %" fill="#479BD6" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      <LabelList dataKey="Conversion Rate %" position="top" fontSize={11} fill="#14306B" fontWeight={700} formatter={(v: number) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ ECOSYSTEM & IMPACT ════ */}
        {show("Ecosystem & Impact") && (
          <section style={{ marginBottom: 48 }}>
            <SectionTitle title="Ecosystem & Impact" subtitle="Partner ecosystem and organizational distribution" />
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Internship Organization Distribution" subtitle="Portfolio distribution across partner organizations" info="Distribution of internship placements across CHII Internal programmes and external partner organizations (SFH, KASHA, Heza, RCR, mIndora Health)">
                <DonutRing
                  data={organizationCounts}
                  colors={DISTINCT}
                  total={internships.length}
                  totalLabel="Placements"
                  height={340}
                  legendPercent
                />
              </Panel>
              <Panel title="Internship Placements" subtitle="Students enrolled vs. placements achieved" info="Comparison of total students enrolled and successful job placements achieved by partner organization">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={organizationCounts.map((org, i) => {
                    const orgInternships = internships.filter(int => int.organization === org.name);
                    const totalStudents = orgInternships.reduce((s, int) => s + int.students, 0);
                    const totalPlacements = orgInternships.reduce((s, int) => s + int.placementsAfterInternship, 0);
                    const placementRate = totalStudents ? Math.round((totalPlacements / totalStudents) * 100) : 0;
                    return {
                      name: org.name,
                      Students: totalStudents,
                      Placements: totalPlacements,
                      "Rate %": placementRate
                    };
                  })} margin={{ top: 20, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%" barGap={2}>
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="Students" fill="#A8B5C8" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="Placements" fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-6 text-[11px] text-gray-500 mt-6 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-2"><span className="w-4 h-3 rounded-sm inline-block" style={{ backgroundColor: "#A8B5C8" }} /> Enrolled</span>
                  <span className="flex items-center gap-2"><span className="w-4 h-3 rounded-sm inline-block" style={{ backgroundColor: "#0F6E56" }} /> Placed</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <PortalFooter portal="hemp" />

      </div>
    </div>
  );
}
