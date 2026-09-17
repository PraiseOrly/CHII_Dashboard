"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { sieCohorts, SIE_DISCIPLINES, SIE_EXPOSURE_AREAS } from "@/data/hemp/sie";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { Briefcase, Target, TrendingUp, Users, Info, type LucideIcon, ChevronDown } from "lucide-react";

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

const HERO = "#102C5E";
const BRAND = "#14306B";
const BRAND_DK = "#0C447C";
const LIGHT_BORDER = "rgba(16, 44, 94, 0.12)";
const LIGHT_BG = "#F8F9FA";

function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange, filterContent }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void; filterContent?: React.ReactNode }) {
  const [tip, setTip] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
      <div style={{ backgroundColor: BRAND, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, minWidth: 0, flex: 1 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#479BD6", flexShrink: 0 }} />
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
      {(filterOptions || filterContent) && filterValue && onFilterChange && (
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
                zIndex: 50,
                width: 280,
                backgroundColor: "white",
                borderRadius: 10,
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
                overflow: "hidden",
              }}>
                <div style={{ backgroundColor: BRAND, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>Filters</p>
                  <button
                    onClick={() => {
                      onFilterChange("reset");
                      setFilterOpen(false);
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
                <div style={{ padding: "12px 14px" }}>
                  {filterContent ? (
                    filterContent
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {filterOptions?.map(opt => {
                        const isSelected = filterValue === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              onFilterChange(opt);
                              setFilterOpen(false);
                            }}
                            style={{
                              fontSize: 10,
                              fontWeight: isSelected ? 700 : 500,
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: `1px solid ${isSelected ? BRAND : LIGHT_BORDER}`,
                              backgroundColor: isSelected ? BRAND : "white",
                              color: isSelected ? "white" : BRAND_DK,
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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

export default function HEMPSie() {
  const categories = ["Programme Reach", "Exposure & Outcomes", "Geography & Engagement", "Participant Profile", "Quality & Feedback"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterCountry, setFilterCountry] = useState("All Countries");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = [filterYear !== "All Years", filterCountry !== "All Countries"].filter(Boolean).length;

  const years = Array.from(new Set(sieCohorts.map(i => i.year))).sort();
  const countries = Array.from(new Set(sieCohorts.map(i => i.country))).sort();

  const filteredCohorts = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterYear !== "All Years" && c.year !== parseInt(filterYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      return true;
    });
  }, [filterYear, filterCountry]);

  const totalSelected = filteredCohorts.reduce((s, c) => s + c.selected, 0);
  const totalCompleted = filteredCohorts.reduce((s, c) => s + c.completedProgramme, 0);
  const femaleParticipants = filteredCohorts.reduce((s, c) => s + c.female, 0);
  const femalePct = totalSelected ? Math.round((femaleParticipants / totalSelected) * 100) : 0;
  const avgSatisfaction = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.satisfaction, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const totalEmploymentLeads = filteredCohorts.reduce((s, c) => s + c.employmentLeads, 0);
  const totalProjectsAdopted = filteredCohorts.reduce((s, c) => s + c.projectsAdopted, 0);
  const avgExposure = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + (c.exposure["Health System Function"] + c.exposure["Innovation in Practice"] + c.exposure["Employment Pathways"]) / 3, 0) / filteredCohorts.length).toFixed(1)) : 0;

  const [filterOutcomeYear, setFilterOutcomeYear] = useState("All Years");
  const [filterExposureYear, setFilterExposureYear] = useState("All Years");
  const [filterGeoYear, setFilterGeoYear] = useState("All Years");
  const [filterFunnelYear, setFilterFunnelYear] = useState("All Years");
  const [filterFunnelCohort, setFilterFunnelCohort] = useState("All Cohorts");

  const avgRelevance = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.relevance, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgQuality = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.quality, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgUsefulness = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.usefulness, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgConfidence = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.confidence, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgNPS = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.nps, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgCompletion = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.completionFullProgramme, 0) / filteredCohorts.length).toFixed(1)) : 0;

  const funnelFilteredCohorts = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterFunnelYear !== "All Years" && c.year !== parseInt(filterFunnelYear)) return false;
      if (filterFunnelCohort !== "All Cohorts" && c.name !== filterFunnelCohort) return false;
      return true;
    });
  }, [filterFunnelYear, filterFunnelCohort]);

  const cohortNames = Array.from(new Set(sieCohorts.map(c => c.name))).sort();

  return (
    <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
      <PortalNav portal="hemp" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>SIE Programme</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Signature Immersive Experience — student outcomes and healthcare exposure
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(120,180,240,0.8)", fontWeight: 600 }}>Period:</span> 2024–2026</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(120,180,240,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-7">

        <HeaderStatsPanel
          title="Programme Overview"
          cards={[
            {
              label: "Participants Selected",
              num: totalSelected,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Across ${filteredCohorts.length} cohorts`,
              tip: "Total participants selected for the programme",
              pace: true,
              paceA: totalSelected,
              paceT: 100,
            },
            {
              label: "Completion Rate",
              num: totalSelected ? Math.round((totalCompleted / totalSelected) * 100) : 0,
              icon: Target,
              displayFmt: (n) => n + "%",
              sub: `${totalCompleted} completed programme`,
              tip: "Percentage who completed the full SIE programme",
              pace: true,
              paceA: totalSelected ? Math.round((totalCompleted / totalSelected) * 100) : 0,
              paceT: 100,
            },
            {
              label: "Female Participation",
              num: femalePct,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `${femaleParticipants} female participants`,
              tip: "Percentage of female participants",
              pace: true,
              paceA: femalePct,
              paceT: 50,
            },
            {
              label: "Avg Exposure Score",
              num: avgExposure,
              icon: Briefcase,
              displayFmt: (n) => n.toFixed(1),
              sub: `Out of 5`,
              tip: "Average self-reported exposure gain across areas",
              pace: true,
              paceA: avgExposure * 20,
              paceT: 100,
            },
            {
              label: "Employment Leads",
              num: totalEmploymentLeads,
              icon: TrendingUp,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Generated from programme`,
              tip: "Number of employment opportunities identified",
              pace: true,
              paceA: totalEmploymentLeads,
              paceT: 50,
            },
            {
              label: "Satisfaction Score",
              num: avgSatisfaction,
              icon: Briefcase,
              displayFmt: (n) => n.toFixed(1),
              sub: `Out of 5`,
              tip: "Average participant satisfaction rating",
              pace: true,
              paceA: avgSatisfaction * 20,
              paceT: 100,
            },
          ]}
        />

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
                setFilterCountry("All Countries");
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", ...years.map(String)] },
                { label: "Country", value: filterCountry, setValue: setFilterCountry, options: ["All Countries", ...countries] },
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

        {show("Programme Reach") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Programme Reach
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Recruitment funnel and participation trends</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Recruitment Funnel" subtitle="Application to completion journey" info="The progression from applications through to programme completion">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohorts.map((c, i) => ({
                    name: c.name.substring(0, 12),
                    applied: c.applied,
                    selected: c.selected,
                    completed: c.completedProgramme,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="applied" fill="#A8C5E6" barSize={30} name="Applied" />
                    <Bar dataKey="selected" fill="#479BD6" barSize={30} name="Selected" />
                    <Bar dataKey="completed" fill={BRAND} barSize={30} name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Selection Rate Trend" subtitle="Percentage of applicants selected over time" info="Selection rate as a percentage of total applicants per cohort" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohorts.map(c => ({ year: String(c.year), rate: Math.round((c.selected / c.applied) * 100) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="rate" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Selection Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Gender Distribution" subtitle="Female and male participant breakdown" info="Gender diversity across selected participants">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Female", value: femaleParticipants },
                    { name: "Male", value: totalSelected - femaleParticipants },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Participation Trend" subtitle="Growth in total selected participants over time" info="Annual trend in participant selection">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohorts.map(c => ({ year: String(c.year), selected: c.selected }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="selected" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Selected" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Exposure & Outcomes") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Exposure & Outcomes
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Learning outcomes and career opportunities generated</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Exposure Area Scores" subtitle="Self-reported learning outcomes (1-5)" info="Average exposure gain across three key learning areas" filterOptions={["All Years", ...years.map(String)]} filterValue={filterExposureYear} onFilterChange={setFilterExposureYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={SIE_EXPOSURE_AREAS.map(area => ({
                    name: area,
                    score: filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.exposure[area], 0) / filteredCohorts.length).toFixed(1)) : 0,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="score" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Exposure Score">
                      <LabelList dataKey="score" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Employment & Project Outcomes" subtitle="Career opportunities and innovation adoption" info="Employment leads and partner projects adopted by host organisations">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Employment Leads", value: totalEmploymentLeads },
                    { name: "Projects Adopted", value: totalProjectsAdopted },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Geography & Engagement") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Geography & Engagement
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Geographic expansion and partner engagement</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Participants by Country" subtitle="Geographic distribution of cohorts" info="Total participants per implementation country" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGeoYear} onFilterChange={setFilterGeoYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={countries.map(c => ({
                    name: c,
                    value: filteredCohorts.filter(co => co.country === c).reduce((s, co) => s + co.selected, 0),
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Participants">
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Partner Engagement" subtitle="Number of partner organizations per cohort" info="Host organizations and site visits across cohorts">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohorts.map(c => ({
                    name: c.name.substring(0, 12),
                    orgs: c.partnerOrgs,
                    visits: c.siteVisits,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="orgs" fill={BRAND} barSize={30} name="Partner Orgs" />
                    <Bar dataKey="visits" fill="#7FA5D6" barSize={30} name="Site Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Participant Profile") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Participant Profile
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Academic discipline and satisfaction insights</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Participants by Discipline" subtitle="Academic background distribution" info="Number of participants from each academic discipline">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={SIE_DISCIPLINES.map(disc => ({
                    name: disc,
                    count: filteredCohorts.length ? filteredCohorts.reduce((s, c) => s + c.disciplines[disc], 0) : 0,
                  })).sort((a, b) => b.count - a.count)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="count" fill={BRAND} barSize={40} radius={[4, 4, 0, 0]} name="Participants">
                      <LabelList dataKey="count" position="top" fontSize={10} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Satisfaction Trend" subtitle="Programme satisfaction over time" info="Average satisfaction rating (1-5) by cohort">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohorts.map(c => ({ year: String(c.year), satisfaction: c.satisfaction }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="satisfaction" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Satisfaction" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Quality & Feedback") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Quality & Feedback
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Participant experience and programme quality ratings</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel
                title="Programme Completion Funnel"
                subtitle="Participation journey through all phases"
                info="Progression from selected participants through virtual and in-country completion"
                filterValue={`${filterFunnelYear} / ${filterFunnelCohort}`}
                onFilterChange={(v) => {
                  if (v === "reset") {
                    setFilterFunnelYear("All Years");
                    setFilterFunnelCohort("All Cohorts");
                  }
                }}
                filterContent={
                  <div style={{ marginBottom: -6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: BRAND_DK, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>Year</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {["All Years", ...years.map(String)].map(opt => {
                          const isSelected = filterFunnelYear === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => setFilterFunnelYear(opt)}
                              style={{
                                fontSize: 10,
                                fontWeight: isSelected ? 700 : 500,
                                padding: "5px 10px",
                                borderRadius: 6,
                                border: `1px solid ${isSelected ? BRAND : LIGHT_BORDER}`,
                                backgroundColor: isSelected ? BRAND : "white",
                                color: isSelected ? "white" : BRAND_DK,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: BRAND_DK, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>Cohort</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {["All Cohorts", ...cohortNames].map(opt => {
                          const isSelected = filterFunnelCohort === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => setFilterFunnelCohort(opt)}
                              style={{
                                fontSize: 10,
                                fontWeight: isSelected ? 700 : 500,
                                padding: "5px 10px",
                                borderRadius: 6,
                                border: `1px solid ${isSelected ? BRAND : LIGHT_BORDER}`,
                                backgroundColor: isSelected ? BRAND : "white",
                                color: isSelected ? "white" : BRAND_DK,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                }
              >
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { stage: "Selected", participants: funnelFilteredCohorts.reduce((s, c) => s + c.selected, 0) },
                    { stage: "Completed Virtual", participants: funnelFilteredCohorts.reduce((s, c) => s + c.completedVirtual, 0) },
                    { stage: "Travelled In-Country", participants: funnelFilteredCohorts.reduce((s, c) => s + c.travelledInCountry, 0) },
                    { stage: "Full Completion", participants: funnelFilteredCohorts.reduce((s, c) => s + c.completedProgramme, 0) },
                  ]} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="participants" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]} name="Participants">
                      <LabelList dataKey="participants" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Quality Ratings" subtitle="Programme content assessment (1-5 scale)" info="Average ratings for relevance, quality, and usefulness">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { metric: "Relevance", rating: avgRelevance },
                    { metric: "Quality", rating: avgQuality },
                    { metric: "Usefulness", rating: avgUsefulness },
                  ]} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="rating" fill="#7FA5D6" barSize={46} radius={[4, 4, 0, 0]} name="Rating">
                      <LabelList dataKey="rating" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Skill Confidence & NPS" subtitle="Learning confidence and recommendation likelihood" info="5-point confidence scale and 0-10 Net Promoter Score">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Confidence", value: avgConfidence, metric: "confidence" },
                    { name: "NPS (÷2)", value: avgNPS / 2, metric: "nps" },
                  ]} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Score">
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} formatter={(v: number) => v.toFixed(1)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Full Programme Completion Rate" subtitle="% who completed both virtual and in-person phases" info="Participants who successfully completed the full immersion experience">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohorts.map(c => ({
                    name: c.name.substring(0, 18),
                    completion: c.completionFullProgramme,
                  }))} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => `${v}%`} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="completion" fill="#A8BFD6" barSize={46} radius={[4, 4, 0, 0]} name="Completion %">
                      <LabelList dataKey="completion" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} formatter={(v: any) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        <PortalFooter portal="hemp" synced="18 Jun 2026, EAT" />

      </div>
    </div>
  );
}
