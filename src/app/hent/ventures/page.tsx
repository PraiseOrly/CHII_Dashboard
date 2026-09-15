"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hent";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { DonutRing } from "@/components/charts/donut-chart";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { founders } from "@/data/founders";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { Briefcase, Target, TrendingUp, Users, Info, type LucideIcon, ChevronDown, DollarSign } from "lucide-react";

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

// Color palette - HENT green (matching overview)
const HERO = "#2D6A4F";
const BRAND = "#2D6A4F";
const BRAND_DK = "#0E4633";
const GREEN = "#2D6A4F";
const LIGHT_GREEN = "#E8F5F2";
const LIGHT_BORDER = "rgba(14, 70, 51, 0.12)";
const LIGHT_BG = "#f8fafc";
const GREEN_RAMP = ["#1B4332","#2D6A4F","#40916C","#5BB4A0","#8ECCC4"];

// Helpers
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n/1_000)}K` : `$${n}`;
}

function sg(s: string) {
  if (s === "Ideation" || s === "Validation") return "Expose";
  if (s === "Prototype/MVP" || s === "Early Growth") return "Build";
  return "Scale";
}

function paceColor(a: number, t: number): string {
  const pace = 5 / 12;
  const r = t > 0 ? (a / t) / pace : 1;
  if (r >= 1) return "#16A34A";
  if (r >= 0.95) return "#84CC16";
  if (r >= 0.8) return "#F59E0B";
  return "#DC2626";
}

// Constants
const PACE = 5 / 12;
const TARGETS = { ventures: 400, jobs: 2_000, funds: 910_904 } as const;
const ACTUALS = {
  ventures: ALL_VENTURES.filter(v => v.status === "Active").length,
  jobs: ALL_VENTURES.reduce((s, v) => s + v.jobsTotal, 0),
  funds: ALL_VENTURES.reduce((s, v) => s + v.funding, 0)
};

const VENTURE_YEARS = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort((a, b) => a - b);

// Note: StatsPanel moved to HeaderStatsPanel in @/components/ui/hent

// Panel Component for Charts
function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void }) {
  const [tip, setTip] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
      <div style={{ backgroundColor: BRAND, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, minWidth: 0, flex: 1 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D4AF87", flexShrink: 0 }} />
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
      <div style={{ padding: "12px 18px 18px" }}>
        {children}
      </div>
    </div>
  );
}

export default function HENTVentures() {
  const categories = ["Growth & Jobs", "Portfolio Composition", "Geography & Engagement", "Portfolio Health"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  // Global filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterStage, setFilterStage] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const show = (category: string) => activeCategory === category;

  const activeFilterCount = [filterYear !== "All Years", filterStage !== "All", filterGender !== "All", filterStatus !== "All"].filter(Boolean).length;

  // Year filters for each chart
  const [filterGrowthYear, setFilterGrowthYear] = useState("All Years");
  const [filterCompYear, setFilterCompYear] = useState("All Years");
  const [filterGeoYear, setFilterGeoYear] = useState("All Years");
  const [filterHealthYear, setFilterHealthYear] = useState("All Years");

  // Filtered ventures based on global filters
  const filteredVentures = useMemo(() => {
    return ALL_VENTURES.filter(v => {
      if (filterYear !== "All Years" && v.cohort !== parseInt(filterYear)) return false;
      if (filterStage !== "All" && sg(v.stage) !== filterStage) return false;
      if (filterGender !== "All") {
        const ventureId = `V${String(v.id).padStart(3, "0")}`;
        const founder = founders.find(f => f.ventureId === ventureId);
        const gender = founder?.gender || "Unknown";
        if (filterGender === "Female" && gender !== "Female") return false;
        if (filterGender === "Male" && gender !== "Male") return false;
      }
      if (filterStatus !== "All" && v.status !== filterStatus) return false;
      return true;
    });
  }, [filterYear, filterStage, filterGender, filterStatus]);

  // Aggregations
  const years = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort();
  const femaleVentures = filteredVentures.filter(v => v.teamGender === "Female").length;
  const activeVentures = filteredVentures.filter(v => v.status === "Active").length;
  const retentionRate = filteredVentures.length ? Math.round((filteredVentures.filter(v => v.status !== "Stalled").length / filteredVentures.length) * 100) : 0;
  const acceleratorVentures = filteredVentures.filter(v => v.accelerator).length;
  const acceleratorPct = filteredVentures.length ? Math.round((acceleratorVentures / filteredVentures.length) * 100) : 0;
  const venturesFunded = filteredVentures.filter(v => v.funding > 0).length;
  const totalPartnerships = filteredVentures.reduce((s, v) => s + v.partnerships, 0);
  const filteredActuals = {
    ventures: filteredVentures.filter(v => v.status === "Active").length,
    jobs: filteredVentures.reduce((s, v) => s + v.jobsTotal, 0),
    funds: filteredVentures.reduce((s, v) => s + v.funding, 0)
  };
  const avgJobsPerVenture = filteredVentures.length ? Math.round(filteredActuals.jobs / filteredVentures.length) : 0;
  const totalRevenue = filteredVentures.reduce((s, v) => s + v.revenue, 0);

  return (
    <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
      <PortalNav portal="hent" />

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Ventures Portfolio</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>
                Portfolio ventures, founders and the jobs, funding and impact they generate
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(190,228,214,0.5)" }}>
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
          title="Portfolio Overview"
          cards={[
            {
              label: "Portfolio Size",
              num: filteredActuals.ventures,
              icon: Briefcase,
              sub: `${Math.round((filteredActuals.ventures / TARGETS.ventures) * 100)}% of ${TARGETS.ventures}`,
              pace: true,
              paceA: filteredActuals.ventures,
              paceT: TARGETS.ventures,
              tip: "Number of active ventures in the HENT portfolio",
            },
            {
              label: "Employment Impact",
              num: filteredActuals.jobs,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `${Math.round((filteredActuals.jobs / TARGETS.jobs) * 100)}% of target · Avg ${avgJobsPerVenture}/venture`,
              pace: true,
              paceA: filteredActuals.jobs,
              paceT: TARGETS.jobs,
              tip: "Average jobs created per venture from the filtered portfolio",
            },
            {
              label: "Capital Deployed",
              num: filteredActuals.funds,
              icon: DollarSign,
              displayFmt: fmt$,
              sub: `${Math.round((filteredActuals.funds / TARGETS.funds) * 100)}% of target · ${venturesFunded} funded`,
              pace: true,
              paceA: filteredActuals.funds,
              paceT: TARGETS.funds,
              tip: "Average funding amount per venture",
            },
            {
              label: "Portfolio Health",
              num: retentionRate,
              icon: TrendingUp,
              displayFmt: (n) => n + "%",
              sub: `Retention · ${activeVentures} active`,
              pace: true,
              paceA: retentionRate,
              paceT: 100,
              tip: "Percentage of ventures still active (not stalled)",
            },
            {
              label: "Founder Diversity",
              num: filteredVentures.length > 0 ? Math.round((femaleVentures / filteredVentures.length) * 100) : 0,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `Female-led · ${femaleVentures} of ${filteredVentures.length} ventures`,
              pace: true,
              paceA: filteredVentures.length > 0 ? Math.round((femaleVentures / filteredVentures.length) * 100) : 0,
              paceT: 50,
              tip: "Percentage of ventures with female founder",
            },
            {
              label: "Revenue Generated",
              num: totalRevenue,
              icon: DollarSign,
              displayFmt: fmt$,
              sub: `${filteredVentures.length > 0 ? fmt$(Math.round(totalRevenue / filteredVentures.length)) : "$0"}/venture avg`,
              tip: "Average revenue per venture",
            },
          ]}
        />

        {/* ════ SECTION FILTER PILLS + FILTER BUTTON ════ */}
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
            <FilterButton
              activeFilterCount={activeFilterCount}
              isOpen={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            />
            <FilterDropdown
              isOpen={filtersOpen}
              onResetFilters={() => {
                setFilterYear("All Years");
                setFilterStage("All");
                setFilterGender("All");
                setFilterStatus("All");
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", ...years.map(String)] },
                { label: "Stage", value: filterStage, setValue: setFilterStage, options: ["All", "Expose", "Build", "Scale"] },
                { label: "Gender", value: filterGender, setValue: setFilterGender, options: ["All", "Male", "Female"] },
                { label: "Status", value: filterStatus, setValue: setFilterStatus, options: ["All", "Active", "Stalled"] },
              ].map(filter => (
                <div key={filter.label} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: BRAND_DK, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                    {filter.label}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {filter.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => filter.setValue(opt)}
                        style={{
                          fontSize: 10,
                          fontWeight: filter.value === opt ? 700 : 500,
                          padding: "5px 10px",
                          borderRadius: 6,
                          border: `1px solid ${filter.value === opt ? BRAND : LIGHT_BORDER}`,
                          backgroundColor: filter.value === opt ? BRAND : "white",
                          color: filter.value === opt ? "white" : BRAND_DK,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </FilterDropdown>
          </div>
        </div>

        {/* ════ GROWTH & JOBS ════ */}
        {show("Growth & Jobs") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Growth & Jobs
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Venture pipeline and employment outcomes</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Ventures Funded" subtitle="Ventures that have received capital" info="Number of ventures that have received capital vs unfunded">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Funded", value: venturesFunded },
                    { name: "Unfunded", value: filteredVentures.length - venturesFunded },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#2D6A4F" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Avg Jobs per Venture" subtitle="Employment intensity by stage" info="Average employment impact across different venture stages">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Expose", value: Math.round(filteredVentures.filter(v => sg(v.stage) === "Expose").reduce((s, v) => s + v.jobsTotal, 0) / Math.max(filteredVentures.filter(v => sg(v.stage) === "Expose").length, 1)) },
                    { name: "Build", value: Math.round(filteredVentures.filter(v => sg(v.stage) === "Build").reduce((s, v) => s + v.jobsTotal, 0) / Math.max(filteredVentures.filter(v => sg(v.stage) === "Build").length, 1)) },
                    { name: "Scale", value: Math.round(filteredVentures.filter(v => sg(v.stage) === "Scale").reduce((s, v) => s + v.jobsTotal, 0) / Math.max(filteredVentures.filter(v => sg(v.stage) === "Scale").length, 1)) },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#26A69A" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Partnerships Built" subtitle="Cross-sector partnerships trend" info="Cross-sector partnerships built by ventures over time">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), partnerships: filteredVentures.filter(v => v.cohort === y && v.partnerships > 0).reduce((s, v) => s + v.partnerships, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="partnerships" stroke="#FF5722" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Partnerships" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Revenue Generated" subtitle="Venture revenue trend over time" info="Total venture revenue generated over time">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), revenue: filteredVentures.filter(v => v.cohort === y).reduce((s, v) => s + v.revenue, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="revenue" stroke="#26A69A" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Ventures by Stage" subtitle="Expose · Build · Scale distribution" info="Distribution of ventures across development stages" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGrowthYear} onFilterChange={setFilterGrowthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Expose", value: filteredVentures.filter(v => sg(v.stage) === "Expose").length },
                    { name: "Build", value: filteredVentures.filter(v => sg(v.stage) === "Build").length },
                    { name: "Scale", value: filteredVentures.filter(v => sg(v.stage) === "Scale").length },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={GREEN} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Jobs Trend" subtitle="Employment growth over time" info="Annual trend of employment opportunities created" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGrowthYear} onFilterChange={setFilterGrowthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), jobs: filteredVentures.filter(v => v.cohort === y).reduce((s, v) => s + v.jobsTotal, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="jobs" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Jobs Created" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Performance Against Targets" subtitle="Current progress vs annual targets" info="Current progress vs annual targets for ventures, jobs, and funds">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Ventures", actual: filteredActuals.ventures, target: TARGETS.ventures },
                    { name: "Jobs", actual: Math.round(filteredActuals.jobs / 100), target: Math.round(TARGETS.jobs / 100) },
                    { name: "Funds", actual: Math.round(filteredActuals.funds / 10000), target: Math.round(TARGETS.funds / 10000) },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="actual" fill="#2D6A4F" barSize={40} radius={[4, 4, 0, 0]} name="Actual" />
                    <Bar dataKey="target" fill="#26A69A" barSize={40} radius={[4, 4, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Female-Led & Accelerator Status" subtitle="Ventures breakdown by characteristics" info="Breakdown of ventures by female leadership and accelerator participation">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Female-Led", value: filteredVentures.filter(v => v.teamGender === "Female").length },
                    { name: "In Accelerators", value: filteredVentures.filter(v => v.accelerator).length },
                    { name: "Active & Female-Led", value: filteredVentures.filter(v => v.status === "Active" && v.teamGender === "Female").length },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#FF5722" barSize={40} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ PORTFOLIO COMPOSITION ════ */}
        {show("Portfolio Composition") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Portfolio Composition
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Sector mix and founder characteristics</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Ventures by Sector" subtitle="Distribution across sectors" info="Distribution of portfolio ventures by business sector" filterOptions={["All Years", ...years.map(String)]} filterValue={filterCompYear} onFilterChange={setFilterCompYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(filteredVentures.map(v => v.sector))).map(s => ({
                    name: s,
                    value: filteredVentures.filter(v => v.sector === s).length
                  })).sort((a, b) => b.value - a.value).slice(0, 5)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={GREEN} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Gender Distribution" subtitle="Founder diversity metrics" info="Founder diversity metrics across gender">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="vertical" data={[{
                    name: "Founders",
                    Male: founders.filter(f => f.gender !== "Female").length,
                    Female: founders.filter(f => f.gender === "Female").length
                  }]} margin={{ top: 4, right: 36, bottom: 0, left: 8 }} barSize={16} barCategoryGap="20%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={104} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Male" fill={GREEN_RAMP[0]} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Female" fill={GREEN_RAMP[1]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Sector Distribution" subtitle="Portfolio composition by sector" info="Portfolio composition by business sector">
                <DonutRing
                  data={Array.from(new Set(filteredVentures.map(v => v.sector))).map(s => ({
                    name: s,
                    value: filteredVentures.filter(v => v.sector === s).length
                  }))}
                  colors={GREEN_RAMP}
                  total={filteredVentures.length}
                  totalLabel="Sectors"
                  height={250}
                  legendPercent
                />
              </Panel>
              <Panel title="Ventures by Cohort" subtitle="Portfolio distribution by entry year" info="Portfolio distribution across entry years">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={VENTURE_YEARS.map(y => ({ year: String(y), count: filteredVentures.filter(v => v.cohort === y).length }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="count" fill="#26A69A" barSize={40} radius={[4, 4, 0, 0]} name="Ventures">
                      <LabelList dataKey="count" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ GEOGRAPHY & ENGAGEMENT ════ */}
        {show("Geography & Engagement") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Geography & Engagement
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Geographic distribution and regional performance</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Funding by Country" subtitle="Capital distribution across regions" info="Capital distribution across regions and countries" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGeoYear} onFilterChange={setFilterGeoYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(filteredVentures.map(v => v.country))).map(c => ({
                    name: c,
                    value: filteredVentures.filter(v => v.country === c).reduce((s, v) => s + v.funding, 0)
                  })).sort((a, b) => b.value - a.value).slice(0, 8)} layout="vertical" margin={{ top: 4, right: 36, bottom: 0, left: 60 }} barSize={16} barCategoryGap="20%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9CA3AF" }} tickFormatter={(v) => fmt$(v)} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={50} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={GREEN} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Ventures by Country" subtitle="Portfolio distribution" info="Portfolio distribution across regions and countries" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGeoYear} onFilterChange={setFilterGeoYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(filteredVentures.map(v => v.country))).map(c => ({
                    name: c,
                    value: filteredVentures.filter(v => v.country === c).length
                  })).sort((a, b) => b.value - a.value).slice(0, 8)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={GREEN} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ PORTFOLIO HEALTH ════ */}
        {show("Portfolio Health") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Portfolio Health
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Venture retention and expansion outcomes</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Funding Trend" subtitle="Capital deployment over time" info="Annual capital deployment to ventures over time" filterOptions={["All Years", ...years.map(String)]} filterValue={filterHealthYear} onFilterChange={setFilterHealthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), funding: filteredVentures.filter(v => v.cohort === y && v.funding > 0).reduce((s, v) => s + v.funding, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="funding" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Funding Deployed" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Revenue Trend" subtitle="Growth over time" info="Annual venture revenue growth over time" filterOptions={["All Years", ...years.map(String)]} filterValue={filterHealthYear} onFilterChange={setFilterHealthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), revenue: filteredVentures.filter(v => v.cohort === y).reduce((s, v) => s + v.revenue, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="revenue" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue Generated" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        <PortalFooter portal="hent" synced="18 Jun 2026, EAT" />

      </div>
    </div>
  );
}
