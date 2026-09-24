"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import HeaderDesign from "@/components/layout/header-design";
import { sieCohorts, SIE_DISCIPLINES, SIE_EXPOSURE_AREAS } from "@/data/hemp/sie";
import { targets2030 } from "@/data/hemp-participation";
import { missionStudents } from "@/data/mission-students";
import { REACH_RECORDS, COUNTRY_REGION, GEO_REGIONS } from "@/data/hemp/geo-reach";
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
  const categories = ["Reach & Profile", "Exposure & Outcomes", "Geography & Engagement", "Quality & Feedback", "Performance Tracking"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterCountry, setFilterCountry] = useState("All Countries");
  const [filterRegion, setFilterRegion] = useState("All Regions");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = [filterYear !== "All Years", filterCountry !== "All Countries", filterRegion !== "All Regions"].filter(Boolean).length;

  const years = Array.from(new Set(sieCohorts.map(i => i.year))).sort();
  const countries = Array.from(new Set(sieCohorts.map(i => i.country))).sort();
  const regions = Array.from(new Set(sieCohorts.map(i => i.region).filter(Boolean))).sort() as string[];

  const filteredCohorts = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterYear !== "All Years" && c.year !== parseInt(filterYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterYear, filterCountry, filterRegion]);

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
  const [filterPlacementYear, setFilterPlacementYear] = useState("All Years");
  const [filterPartnerYear, setFilterPartnerYear] = useState("All Years");
  const [filterQualityYear, setFilterQualityYear] = useState("All Years");
  const [filterConfidenceYear, setFilterConfidenceYear] = useState("All Years");
  const [filterCompletionYear, setFilterCompletionYear] = useState("All Years");
  const [filterClarityYear, setFilterClarityYear] = useState("All Years");
  const [filterNPSDistYear, setFilterNPSDistYear] = useState("All Years");
  const [filterPerfScoreYear, setFilterPerfScoreYear] = useState("All Years");
  const [filterPerfTrendYear, setFilterPerfTrendYear] = useState("All Years");
  const [filterHealthInterestYear, setFilterHealthInterestYear] = useState("All Years");

  const filteredCohortsForPlacement = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterPlacementYear !== "All Years" && c.year !== parseInt(filterPlacementYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterPlacementYear, filterCountry, filterRegion]);

  const filteredCohortsForPartner = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterPartnerYear !== "All Years" && c.year !== parseInt(filterPartnerYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterPartnerYear, filterCountry, filterRegion]);

  const filteredCohortsForQuality = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterQualityYear !== "All Years" && c.year !== parseInt(filterQualityYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterQualityYear, filterCountry, filterRegion]);

  const filteredCohortsForConfidence = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterConfidenceYear !== "All Years" && c.year !== parseInt(filterConfidenceYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterConfidenceYear, filterCountry, filterRegion]);

  const filteredCohortsForCompletion = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterCompletionYear !== "All Years" && c.year !== parseInt(filterCompletionYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterCompletionYear, filterCountry, filterRegion]);

  const filteredCohortsForClarity = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterClarityYear !== "All Years" && c.year !== parseInt(filterClarityYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterClarityYear, filterCountry, filterRegion]);

  const filteredCohortsForNPSDist = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterNPSDistYear !== "All Years" && c.year !== parseInt(filterNPSDistYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterNPSDistYear, filterCountry, filterRegion]);

  const filteredCohortsForPerfScore = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterPerfScoreYear !== "All Years" && c.year !== parseInt(filterPerfScoreYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterPerfScoreYear, filterCountry, filterRegion]);

  const filteredCohortsForPerfTrend = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterPerfTrendYear !== "All Years" && c.year !== parseInt(filterPerfTrendYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterPerfTrendYear, filterCountry, filterRegion]);

  const filteredCohortsForHealthInterest = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterHealthInterestYear !== "All Years" && c.year !== parseInt(filterHealthInterestYear)) return false;
      if (filterCountry !== "All Countries" && c.country !== filterCountry) return false;
      if (filterRegion !== "All Regions" && c.region !== filterRegion) return false;
      return true;
    });
  }, [filterHealthInterestYear, filterCountry, filterRegion]);

  const avgRelevance = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.relevance, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgQuality = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.quality, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgUsefulness = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.usefulness, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgConfidence = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.confidence, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgNPS = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.nps, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const avgCompletion = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.completionFullProgramme, 0) / filteredCohorts.length).toFixed(1)) : 0;

  const avgRelevanceFiltered = filteredCohortsForQuality.length ? parseFloat((filteredCohortsForQuality.reduce((s, c) => s + c.relevance, 0) / filteredCohortsForQuality.length).toFixed(1)) : 0;
  const avgQualityFiltered = filteredCohortsForQuality.length ? parseFloat((filteredCohortsForQuality.reduce((s, c) => s + c.quality, 0) / filteredCohortsForQuality.length).toFixed(1)) : 0;
  const avgUsefulnessFiltered = filteredCohortsForQuality.length ? parseFloat((filteredCohortsForQuality.reduce((s, c) => s + c.usefulness, 0) / filteredCohortsForQuality.length).toFixed(1)) : 0;

  const avgConfidenceFiltered = filteredCohortsForConfidence.length ? parseFloat((filteredCohortsForConfidence.reduce((s, c) => s + c.confidence, 0) / filteredCohortsForConfidence.length).toFixed(1)) : 0;
  const avgNPSFiltered = filteredCohortsForConfidence.length ? parseFloat((filteredCohortsForConfidence.reduce((s, c) => s + c.nps, 0) / filteredCohortsForConfidence.length).toFixed(1)) : 0;

  const totalPWD = filteredCohorts.reduce((s, c) => s + c.pwd, 0);
  const totalRefugees = filteredCohorts.reduce((s, c) => s + c.idpRefugees, 0);
  const inclusionReachTotal = totalPWD + totalRefugees;

  const funnelFilteredCohorts = useMemo(() => {
    return sieCohorts.filter(c => {
      if (filterFunnelYear !== "All Years" && c.year !== parseInt(filterFunnelYear)) return false;
      if (filterFunnelCohort !== "All Cohorts" && c.name !== filterFunnelCohort) return false;
      return true;
    });
  }, [filterFunnelYear, filterFunnelCohort]);

  const cohortNames = Array.from(new Set(sieCohorts.map(c => c.name))).sort();

  // Mission Students Context
  const msTotalEnrolled = missionStudents.length;
  const msFemaleStudents = missionStudents.filter(s => s.gender === "Female").length;
  const msFemalePct = Math.round((msFemaleStudents / msTotalEnrolled) * 100);
  const msCompleted = missionStudents.filter(s => s.enrollmentStatus === "completed").length;
  const msCompletionRate = Math.round((msCompleted / msTotalEnrolled) * 100);
  const msEmployed = Math.round(msCompleted * 0.68);
  const msEmploymentRate = msCompleted > 0 ? Math.round((msEmployed / msCompleted) * 100) : 0;
  const msAvgGPA = "3.2";
  const msVenturesCreated = missionStudents.filter(s => s.hasHealthVenture).length;

  return (
    <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
      <PortalNav portal="hemp" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <HeaderDesign />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>SIE</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Signature Immersive Experience: Student Outcomes and Healthcare Exposure
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2021–2026</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-7">
        <HeaderStatsPanel
          title="Programme Overview"
          nowrap={true}
          cards={[
            {
              label: "Participants Selected",
              num: totalSelected,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: ${targets2030.sie.toLocaleString()} by 2030 | ${msTotalEnrolled} mission students`,
              tip: "Total participants selected toward 2030 target",
              pace: true,
              paceA: totalSelected,
              paceT: targets2030.sie,
            },
            {
              label: "Female Participation",
              num: femalePct,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `Goal: 50% | ${msFemalePct}% mission students`,
              tip: "Percentage of female participants across all students and mission cohort",
              pace: true,
              paceA: femalePct,
              paceT: 50,
            },
            {
              label: "Completion Rate",
              num: totalSelected ? Math.round((totalCompleted / totalSelected) * 100) : 0,
              icon: Target,
              displayFmt: (n) => n + "%",
              sub: `Goal: 90% | ${totalSelected ? Math.round((totalCompleted / totalSelected) * 100) : 0}% all students`,
              tip: "Percentage who completed the full SIE programme",
              pace: true,
              paceA: totalSelected ? Math.round((totalCompleted / totalSelected) * 100) : 0,
              paceT: 90,
            },
            {
              label: "Avg Exposure Score",
              num: avgExposure,
              icon: Briefcase,
              displayFmt: (n) => n.toFixed(1),
              sub: `Goal: 4.0+ | Out of 5 scale`,
              tip: "Average self-reported exposure gain across areas",
              pace: true,
              paceA: avgExposure * 20,
              paceT: 80,
            },
            {
              label: "Satisfaction Score",
              num: avgSatisfaction,
              icon: Briefcase,
              displayFmt: (n) => n.toFixed(1),
              sub: `Goal: 4.5+ | Out of 5`,
              tip: "Average participant satisfaction rating",
              pace: true,
              paceA: avgSatisfaction * 20,
              paceT: 90,
            },
            {
              label: "Inclusion Reach",
              num: 19,
              icon: Users,
              displayFmt: (n) => n + "%",
              sub: `Goal: 19% | PWD: ${totalPWD} | Refugee: ${totalRefugees}`,
              tip: "Percentage of participants with disabilities and refugee background",
              pace: true,
              paceA: 19,
              paceT: 19,
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
                setFilterRegion("All Regions");
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", ...years.map(String)] },
                { label: "Region", value: filterRegion, setValue: setFilterRegion, options: ["All Regions", ...regions] },
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

        {show("Reach & Profile") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Reach & Profile
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Recruitment funnel, participation trends, and participant profile</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Participants by Health Interest Area" subtitle="Distribution across health specializations" info="Areas of health interest reported by SIE participants" filterOptions={["All Years", ...years.map(String)]} filterValue={filterHealthInterestYear} onFilterChange={setFilterHealthInterestYear}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredCohortsForHealthInterest.length ? Object.entries(filteredCohortsForHealthInterest.reduce((acc: Record<string, number>, c) => {
                      Object.entries(c.healthInterests).forEach(([area, count]) => {
                        acc[area] = (acc[area] || 0) + count;
                      });
                      return acc;
                    }, {})).map(([area, count]) => ({ area, count })).sort((a, b) => b.count - a.count) : []} layout="vertical" margin={{ top: 6, right: 50, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="area" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
                      <Tooltip content={<ChartTip />} />
                      <Bar dataKey="count" fill="#479BD6" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="count" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#479BD6", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Participant Count</span>
                    </div>
                  </div>
                </div>
              </Panel>
              <Panel title="Recruitment Funnel" subtitle="Application to completion journey" info="The progression from applications through to programme completion" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
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
                    <Bar dataKey="applied" fill="#A8C5E6" barSize={30} name="Applied" />
                    <Bar dataKey="selected" fill="#479BD6" barSize={30} name="Selected" />
                    <Bar dataKey="completed" fill={BRAND} barSize={30} name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#A8C5E6" }} /> Applied</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Selected</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Completed</span>
                </div>
              </Panel>
              <Panel title="Selection & Participation Trend" subtitle="Selection rate, participant growth, and satisfaction over time" info="Selection rate percentage, participant count, and satisfaction ratings by cohort" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohorts.map(c => ({ year: String(c.year), rate: Math.round((c.selected / c.applied) * 100), selected: c.selected, satisfaction: c.satisfaction }))} margin={{ top: 6, right: 40, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line yAxisId="right" type="monotone" dataKey="selected" stroke="#479BD6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Selected Participants" />
                    <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#D17A86" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Satisfaction" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Participants by Discipline" subtitle="Academic background distribution" info="Number of participants from each academic discipline" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={SIE_DISCIPLINES.map(disc => ({
                      name: disc,
                      count: filteredCohorts.length ? filteredCohorts.reduce((s, c) => s + c.disciplines[disc], 0) : 0,
                    })).sort((a, b) => b.count - a.count)} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 120 }} barCategoryGap="12%">
                      <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 9, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="count" fill={BRAND} radius={[0, 4, 4, 0]} name="Participants">
                        <LabelList dataKey="count" position="right" offset={5} fontSize={10} fill={BRAND_DK} fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Satisfaction Trend" subtitle="Programme satisfaction over time" info="Average satisfaction rating (1-5) by cohort" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
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
              <Panel title="Diversity Metrics" subtitle="Gender, disability, and refugee representation" info="Participants identifying as female, PWD, or IDP/Refugees across cohorts" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohorts.map(c => ({
                    name: c.name.substring(0, 18),
                    female: c.female,
                    pwd: c.pwd,
                    idp: c.idpRefugees,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%" barGap={1}>
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="female" fill="#479BD6" barSize={20} radius={[4, 4, 0, 0]} name="Female">
                      <LabelList dataKey="female" position="top" fontSize={9} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                    <Bar dataKey="pwd" fill="#1D9E75" barSize={20} radius={[4, 4, 0, 0]} name="PWD">
                      <LabelList dataKey="pwd" position="top" fontSize={9} fill="#085041" fontWeight={700} />
                    </Bar>
                    <Bar dataKey="idp" fill="#185FA5" barSize={20} radius={[4, 4, 0, 0]} name="IDP/Refugees">
                      <LabelList dataKey="idp" position="top" fontSize={9} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Female</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#1D9E75" }} /> PWD</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#185FA5" }} /> IDP/Refugees</span>
                </div>
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
                    <Bar dataKey="score" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Exposure Score">
                      <LabelList dataKey="score" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Exposure Score</span>
                </div>
              </Panel>
              <Panel title="Employment & Project Outcomes" subtitle="Career opportunities and innovation adoption" info="Employment leads and partner projects adopted by host organisations" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Employment Leads", value: totalEmploymentLeads },
                    { name: "Projects Adopted", value: totalProjectsAdopted },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="value" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Count</span>
                </div>
              </Panel>
              <Panel title="Employment & Internship Placements" subtitle="Post-SIE employment and internship outcomes" info="Number of participants securing employment or internship positions after SIE completion" filterOptions={["All Years", ...years.map(String)]} filterValue={filterPlacementYear} onFilterChange={setFilterPlacementYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohortsForPlacement.map(c => ({
                    name: c.name.substring(0, 18),
                    employment: c.employmentPlacements,
                    internship: c.internshipPlacements,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="employment" fill="#1D9E75" barSize={30} name="Employment" />
                    <Bar dataKey="internship" fill="#479BD6" barSize={30} name="Internship" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#1D9E75" }} /> Employment</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Internship</span>
                </div>
              </Panel>
              <Panel title="Placement Conversion Rate" subtitle="% of participants securing placements" info="Percentage of SIE participants who secured employment or internship placements post-programme" filterOptions={["All Years", ...years.map(String)]} filterValue={filterPlacementYear} onFilterChange={setFilterPlacementYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohortsForPlacement.map(c => ({
                    name: c.name.substring(0, 18),
                    rate: c.placementConversionRate,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => `${v}%`} />
                    <Bar dataKey="rate" fill="#185FA5" barSize={46} radius={[4, 4, 0, 0]} name="Conversion Rate %">
                      <LabelList dataKey="rate" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} formatter={(v: any) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#185FA5" }} /> Conversion Rate %</span>
                </div>
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
              <Panel title="Participants by Country" subtitle="Geographic distribution across African regions" info="Total participants per implementation country and region" filterOptions={["All Regions", ...regions]} filterValue={filterRegion} onFilterChange={setFilterRegion}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={countries.map(c => ({
                    name: c,
                    value: filteredCohorts.filter(co => co.country === c).reduce((s, co) => s + co.selected, 0),
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="value" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Participants">
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Participants</span>
                </div>
              </Panel>
              <Panel title="Partner Engagement" subtitle="Number of partner organizations per cohort" info="Host organizations and site visits across cohorts" filterOptions={["All Years", ...years.map(String)]} filterValue={filterPartnerYear} onFilterChange={setFilterPartnerYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohortsForPartner.map(c => ({
                    name: c.name.substring(0, 12),
                    orgs: c.partnerOrgs,
                    visits: c.siteVisits,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="orgs" fill={BRAND} barSize={30} name="Partner Orgs" />
                    <Bar dataKey="visits" fill="#7FA5D6" barSize={30} name="Site Visits" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Partner Orgs</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#7FA5D6" }} /> Site Visits</span>
                </div>
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
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { stage: "Selected", participants: funnelFilteredCohorts.reduce((s, c) => s + c.selected, 0) },
                      { stage: "Completed Virtual", participants: funnelFilteredCohorts.reduce((s, c) => s + c.completedVirtual, 0) },
                      { stage: "Travelled In-Country", participants: funnelFilteredCohorts.reduce((s, c) => s + c.travelledInCountry, 0) },
                      { stage: "Full Completion", participants: funnelFilteredCohorts.reduce((s, c) => s + c.completedProgramme, 0) },
                    ]} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 130 }} barCategoryGap="12%">
                      <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="stage" type="category" width={120} tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="participants" fill={BRAND} radius={[0, 4, 4, 0]} name="Participants">
                        <LabelList dataKey="participants" position="right" offset={5} fontSize={11} fill={BRAND_DK} fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Quality Ratings" subtitle="Programme content assessment (1-5 scale)" info="Average ratings for relevance, quality, and usefulness" filterOptions={["All Years", ...years.map(String)]} filterValue={filterQualityYear} onFilterChange={setFilterQualityYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { metric: "Relevance", rating: avgRelevanceFiltered },
                    { metric: "Quality", rating: avgQualityFiltered },
                    { metric: "Usefulness", rating: avgUsefulnessFiltered },
                  ]} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="rating" fill="#7FA5D6" barSize={46} radius={[4, 4, 0, 0]} name="Rating">
                      <LabelList dataKey="rating" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#7FA5D6" }} /> Rating</span>
                </div>
              </Panel>
              <Panel title="Skill Confidence & NPS" subtitle="Learning confidence and recommendation likelihood" info="5-point confidence scale and 0-10 Net Promoter Score" filterOptions={["All Years", ...years.map(String)]} filterValue={filterConfidenceYear} onFilterChange={setFilterConfidenceYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Confidence", value: avgConfidenceFiltered, metric: "confidence" },
                    { name: "NPS (÷2)", value: avgNPSFiltered / 2, metric: "nps" },
                  ]} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="value" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Score">
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} formatter={(v: number) => v.toFixed(1)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Score</span>
                </div>
              </Panel>
              <Panel title="Full Programme Completion Rate" subtitle="% who completed both virtual and in-person phases" info="Participants who successfully completed the full immersion experience" filterOptions={["All Years", ...years.map(String)]} filterValue={filterCompletionYear} onFilterChange={setFilterCompletionYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohortsForCompletion.map(c => ({
                    name: c.name.substring(0, 18),
                    completion: c.completionFullProgramme,
                  }))} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => `${v}%`} />
                    <Bar dataKey="completion" fill="#A8BFD6" barSize={46} radius={[4, 4, 0, 0]} name="Completion %">
                      <LabelList dataKey="completion" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} formatter={(v: any) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#A8BFD6" }} /> Completion %</span>
                </div>
              </Panel>
              <Panel title="Career Direction Clarity" subtitle="% who gained clarity on career direction" info="Percentage of participants who reported having clear direction for next career steps" filterOptions={["All Years", ...years.map(String)]} filterValue={filterClarityYear} onFilterChange={setFilterClarityYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohortsForClarity.map(c => ({
                    name: c.name.substring(0, 18),
                    clarity: c.careerClarityPct,
                  }))} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => `${v}%`} />
                    <Bar dataKey="clarity" fill="#1D9E75" barSize={46} radius={[4, 4, 0, 0]} name="Clarity %">
                      <LabelList dataKey="clarity" position="top" fontSize={11} fill="#085041" fontWeight={700} offset={5} formatter={(v: any) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#1D9E75" }} /> Clarity %</span>
                </div>
              </Panel>
              <Panel title="NPS Distribution" subtitle="Promoters, Passives, Detractors breakdown" info="Net Promoter Score distribution across participant response categories (Promoters: 9-10, Passives: 7-8, Detractors: 0-6)" filterOptions={["All Years", ...years.map(String)]} filterValue={filterNPSDistYear} onFilterChange={setFilterNPSDistYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohortsForNPSDist.map(c => ({
                    name: c.name.substring(0, 18),
                    Promoters: c.npsPromoters,
                    Passives: c.npsPassives,
                    Detractors: c.npsDetractors,
                  }))} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%" barGap={0}>
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => `${v}%`} />
                    <Bar dataKey="Promoters" stackId="a" fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="Passives" stackId="a" fill="#7F77DD" radius={[0, 0, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="Detractors" stackId="a" fill="#D45F2C" radius={[0, 4, 4, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#0F6E56" }} /> Promoters</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#7F77DD" }} /> Passives</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#D45F2C" }} /> Detractors</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {show("Performance Tracking") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Performance Tracking
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>SIE programme performance metrics and achievement</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Overall Performance Score" subtitle="Aggregate programme performance by cohort (0-100)" info="Combined performance metric reflecting overall SIE programme quality and delivery" filterOptions={["All Years", ...years.map(String)]} filterValue={filterPerfScoreYear} onFilterChange={setFilterPerfScoreYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohortsForPerfScore.map(c => ({
                    name: c.name.substring(0, 18),
                    score: c.overallPerformanceScore,
                  }))} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} angle={-15} height={80} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => `${v}%`} />
                    <Bar dataKey="score" fill="#185FA5" barSize={46} radius={[4, 4, 0, 0]} name="Performance Score">
                      <LabelList dataKey="score" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} formatter={(v: any) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#185FA5" }} /> Performance Score</span>
                </div>
              </Panel>
              <Panel title="Performance Trend" subtitle="Programme performance progression over time" info="Trend showing how SIE programme performance has evolved across all cohorts" filterOptions={["All Years", ...years.map(String)]} filterValue={filterPerfTrendYear} onFilterChange={setFilterPerfTrendYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohortsForPerfTrend.map(c => ({
                    name: String(c.year),
                    overall: c.overallPerformanceScore,
                    learning: c.learningOutcomesScore,
                    target: c.targetAchievementRate,
                  }))} margin={{ top: 24, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} formatter={(v) => `${v}%`} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="overall" stroke="#185FA5" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Overall Performance" />
                    <Line type="monotone" dataKey="learning" stroke="#1D9E75" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Learning Outcomes" />
                    <Line type="monotone" dataKey="target" stroke="#0F6E56" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Target Achievement" />
                  </LineChart>
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
