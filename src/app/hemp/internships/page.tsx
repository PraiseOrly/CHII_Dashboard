"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import HeaderDesign from "@/components/layout/header-design";
import { internships, INTERNSHIP_ORGANIZATIONS, INTERNSHIP_DEPARTMENTS } from "@/data/hemp/internships";
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

function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void }) {
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

export default function HEMPInternships() {
  const categories = ["Growth & Outcomes", "Sector Mix", "Quality & Placements"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [expandedSections, setExpandedSections] = useState({ employer: true, student: true });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterOrganization, setFilterOrganization] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterCohort, setFilterCohort] = useState("All");
  const [filterFemale, setFilterFemale] = useState("All");
  const [filterIDP, setFilterIDP] = useState("All");
  const [filterPLWD, setFilterPLWD] = useState("All");
  const [filterOutcomeYear, setFilterOutcomeYear] = useState("All Years");
  const [filterSectorYear, setFilterSectorYear] = useState("All Years");
  const [filterHealthInterestYear, setFilterHealthInterestYear] = useState("All Years");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = [filterYear !== "All Years", filterOrganization !== "All", filterDepartment !== "All", filterCohort !== "All", filterFemale !== "All", filterIDP !== "All", filterPLWD !== "All"].filter(Boolean).length;

  const years = Array.from(new Set(internships.map(i => i.year))).sort();
  const cohorts = Array.from(new Set(internships.map(i => {
    const cohortNum = parseInt(i.id.substring(1));
    return Math.ceil(cohortNum / 5);
  }))).sort((a, b) => a - b);

  const filteredInternships = useMemo(() => {
    return internships.filter(i => {
      if (filterYear !== "All Years" && i.year !== parseInt(filterYear)) return false;
      if (filterOrganization !== "All" && i.organization !== filterOrganization) return false;
      if (filterDepartment !== "All" && i.department !== filterDepartment) return false;
      if (filterCohort !== "All") {
        const cohortNum = Math.ceil(parseInt(i.id.substring(1)) / 5);
        if (cohortNum !== parseInt(filterCohort)) return false;
      }
      if (filterFemale === "Yes" && i.femaleStudents === 0) return false;
      if (filterIDP === "Yes" && i.idpParticipants === 0) return false;
      if (filterPLWD === "Yes" && i.plwdParticipants === 0) return false;
      return true;
    });
  }, [filterYear, filterOrganization, filterDepartment, filterCohort, filterFemale, filterIDP, filterPLWD]);

  const totalStudents = filteredInternships.reduce((s, i) => s + i.students, 0);
  const femaleStudents = filteredInternships.reduce((s, i) => s + i.femaleStudents, 0);
  const femalePct = totalStudents ? Math.round((femaleStudents / totalStudents) * 100) : 0;
  const avgSatisfaction = filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.satisfactionScore, 0) / filteredInternships.length).toFixed(1)) : 0;
  const totalConversions = filteredInternships.reduce((s, i) => s + i.employmentConversions, 0);
  const conversionRate = totalStudents ? Math.round((totalConversions / totalStudents) * 100) : 0;
  const mentorshipCount = filteredInternships.filter(i => i.hasMentor).length;
  const avgDuration = filteredInternships.length ? Math.round(filteredInternships.reduce((s, i) => s + i.durationWeeks, 0) / filteredInternships.length) : 0;

  const filteredInternshipsForHealthInterest = useMemo(() => {
    return internships.filter(i => {
      if (filterHealthInterestYear !== "All Years" && i.year !== parseInt(filterHealthInterestYear)) return false;
      return true;
    });
  }, [filterHealthInterestYear]);

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Internships</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Placements, student outcomes and employment partnerships
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
              label: "Total Participants",
              num: totalStudents,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: ${targets2030.internships.toLocaleString()} by 2030 | ${msTotalEnrolled} mission students`,
              tip: "Total students placed in internships toward 2030 target",
              pace: true,
              paceA: totalStudents,
              paceT: targets2030.internships,
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
              label: "Employment Conversions",
              num: conversionRate,
              icon: Briefcase,
              displayFmt: (n) => n + "%",
              sub: `Goal: 65% | ${conversionRate}% mission students`,
              tip: "Percentage securing employment after internship",
              pace: true,
              paceA: conversionRate,
              paceT: 65,
            },
            {
              label: "Completion Rate",
              num: msCompletionRate,
              icon: Target,
              displayFmt: (n) => n + "%",
              sub: `Goal: 80% | ${msCompletionRate}% mission students`,
              tip: "Percentage of mission students who completed internship",
              pace: true,
              paceA: msCompletionRate,
              paceT: 80,
            },
            {
              label: "Satisfaction Score",
              num: avgSatisfaction,
              icon: TrendingUp,
              displayFmt: (n) => n.toFixed(1),
              sub: `Goal: 4.5+ | Out of 5`,
              tip: "Average student satisfaction rating",
              pace: true,
              paceA: avgSatisfaction * 20,
              paceT: 90,
            },
            {
              label: "Inclusion Reach",
              num: 19,
              icon: Users,
              displayFmt: (n) => n + "%",
              sub: `Goal: 19% | PWD: ${Math.round(totalStudents * 0.12)} | Refugee: ${Math.round(totalStudents * 0.07)}`,
              tip: "Percentage of students with disabilities and refugee background",
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
                setFilterOrganization("All");
                setFilterDepartment("All");
                setFilterCohort("All");
                setFilterFemale("All");
                setFilterIDP("All");
                setFilterPLWD("All");
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", ...years.map(String)] },
                { label: "Organization", value: filterOrganization, setValue: setFilterOrganization, options: ["All", ...INTERNSHIP_ORGANIZATIONS] },
                { label: "Department", value: filterDepartment, setValue: setFilterDepartment, options: ["All", ...INTERNSHIP_DEPARTMENTS] },
                { label: "Cohort", value: filterCohort, setValue: setFilterCohort, options: ["All", ...cohorts.map(c => `Cohort ${c}`)] },
                { label: "Female", value: filterFemale, setValue: setFilterFemale, options: ["All", "Yes"] },
                { label: "IDP", value: filterIDP, setValue: setFilterIDP, options: ["All", "Yes"] },
                { label: "PLWD", value: filterPLWD, setValue: setFilterPLWD, options: ["All", "Yes"] },
              ].map(filter => (
                <div key={filter.label} style={{ marginBottom: 12, minWidth: 140 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: BRAND_DK, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                    {filter.label}
                  </p>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setValue(e.target.value)}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "6px 8px",
                      borderRadius: 6,
                      border: `1px solid ${LIGHT_BORDER}`,
                      backgroundColor: "white",
                      color: BRAND_DK,
                      cursor: "pointer",
                      width: "100%",
                      fontFamily: "inherit",
                    }}
                  >
                    {filter.options.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </FilterDropdown>
          </div>
        </div>

        {show("Growth & Outcomes") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Growth & Outcomes
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Student participation and employment outcomes</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Participants by Academic Programmes" subtitle="Participant distribution across programmes" info="Internship participants by primary academic programme" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { programme: "BSc (Hons) Software Engineering", count: 142 },
                      { programme: "BSc (Hons) Entrepreneurial Leadership", count: 138 },
                      { programme: "ALURW - International Business and Trade", count: 58 },
                      { programme: "Teach-out - ALURW - Global Challenges", count: 12 },
                      { programme: "ALCHE - Entrepreneurial Leadership", count: 8 },
                      { programme: "ALCHE - Software Engineering", count: 2 },
                      { programme: "Teach out - ALURW - Computer Science", count: 1 },
                    ]} layout="vertical" margin={{ top: 6, right: 50, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="programme" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 500 }} axisLine={false} tickLine={false} width={210} />
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
              <Panel title="Students Trend" subtitle="Participation growth over time" info="Annual trend of students placed in internships" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), students: filteredInternships.filter(i => i.year === y).reduce((s, i) => s + i.students, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="students" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Students" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Employment Conversions" subtitle="Post-internship placements" info="Number of students securing employment after internship" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Employed", value: totalConversions },
                    { name: "Not Employed", value: totalStudents - totalConversions },
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
<Panel title="Satisfaction Scores" subtitle="Student experience ratings by placement" info="Average satisfaction rating (out of 5) for each internship placement" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={filteredInternships.slice(0, 10).map(i => ({ name: i.organization.substring(0, 20), value: i.satisfactionScore }))} layout="vertical" margin={{ top: 6, right: 40, bottom: 6, left: 140 }} barCategoryGap="20%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151", fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#7FA5D6" barSize={20} radius={[0, 4, 4, 0]} name="Satisfaction">
                      <LabelList dataKey="value" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Sector Mix") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Sector Mix
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Industry distribution and sector characteristics</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Placements by Organization" subtitle="Distribution across partner organizations" info="Number of placements across different organizations" filterOptions={["All Years", ...years.map(String)]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.organization))).map(o => ({
                    name: o,
                    value: filteredInternships.filter(i => i.organization === o).length
                  })).sort((a, b) => b.value - a.value)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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
              <Panel title="Departments by Organization" subtitle="Department distribution across partner organizations" info="Number of internship placements by department within each organization" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.organization))).sort().map(o => {
                    const orgInternships = filteredInternships.filter(i => i.organization === o);
                    const deptCounts: Record<string, number> = {};
                    orgInternships.forEach(i => {
                      deptCounts[i.department] = (deptCounts[i.department] || 0) + 1;
                    });
                    return { organization: o, ...deptCounts };
                  })} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 120 }} barCategoryGap="12%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <YAxis dataKey="organization" type="category" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    {Array.from(new Set(filteredInternships.map(i => i.department))).map((dept, idx) => (
                      <Bar key={dept} dataKey={dept} stackId="a" fill={BRAND_DK} opacity={0.6 + (idx * 0.05)} radius={idx === Array.from(new Set(filteredInternships.map(i => i.department))).length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND_DK }} /> Departments</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

{show("Quality & Placements") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Quality & Placements
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Programme quality and placement outcomes</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 32 }} />

<div style={{ marginTop: 40, marginBottom: 28 }}>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, employer: !prev.employer }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  marginBottom: 12
                }}
              >
                <span style={{ width: 2, height: 14, borderRadius: 999, backgroundColor: "#185FA5", flexShrink: 0 }} />
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#185FA5", lineHeight: 1.2, margin: 0 }}>
                  Employer Feedback
                </p>
                <ChevronDown size={14} color="#185FA5" style={{ marginLeft: 4, transform: expandedSections.employer ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
              </button>
            </div>
            {expandedSections.employer && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 40 }}>
              <Panel title="Student and Partner Feedback" subtitle="Feedback ratings by organization" info="Average feedback scores from students and partner organizations" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.organization))).sort().map(o => {
                    const orgInternships = filteredInternships.filter(i => i.organization === o);
                    const avgStudentFeedback = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.studentFeedbackScore, 0) / orgInternships.length).toFixed(1)) : 0;
                    const avgPartnerFeedback = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.partnerFeedbackScore, 0) / orgInternships.length).toFixed(1)) : 0;
                    return { name: o, "Student Feedback": avgStudentFeedback, "Partner Feedback": avgPartnerFeedback };
                  })} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 120 }} barCategoryGap="12%" barGap={2}>
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={true} domain={[3.5, 5]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 9, paddingTop: 12 }} />
                    <Bar dataKey="Student Feedback" fill="#185FA5" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="Student Feedback" position="right" fontSize={9} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                    <Bar dataKey="Partner Feedback" fill="#479BD6" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="Partner Feedback" position="right" fontSize={9} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Workplace Skills" subtitle="Employer assessment of core competencies" info="Average employer ratings for student workplace skills (1=Never, 5=Consistently)" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    {
                      skill: "Asks Clarifying Questions",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.asksClarifyingQuestions, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                    {
                      skill: "Professional Communication",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.communicatesProfessionally, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                    {
                      skill: "Meets Deadlines",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.meetsDeadlines, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                    {
                      skill: "Works Effectively in Teams",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.worksInTeams, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                  ]} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 160 }} barCategoryGap="12%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="skill" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={150} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="score" fill="#14306B" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="score" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#14306B" }} /> Score</span>
                </div>
              </Panel>
              <Panel title="Health Sector Readiness" subtitle="Understanding and application of health context" info="Average employer ratings on health systems understanding and practical application (1=Not at all, 5=Extremely)" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.organization))).sort().map(o => {
                    const orgInternships = filteredInternships.filter(i => i.organization === o);
                    const avgUnderstanding = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.healthSystemsUnderstanding, 0) / orgInternships.length).toFixed(1)) : 0;
                    const avgApplication = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.appliesToHealthProblems, 0) / orgInternships.length).toFixed(1)) : 0;
                    return { name: o, "Systems Understanding": avgUnderstanding, "Practical Application": avgApplication };
                  })} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 120 }} barCategoryGap="12%" barGap={2}>
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 9, paddingTop: 12 }} />
                    <Bar dataKey="Systems Understanding" fill="#0F6E56" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Practical Application" fill="#6BBE9C" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Employer Recommendation & Hiring" subtitle="Likelihood to recommend ALU and hire graduates" info="Employer likelihood to recommend ALU students (0-10 scale) and hire graduates" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.organization))).sort().map(o => {
                    const orgInternships = filteredInternships.filter(i => i.organization === o);
                    const avgRecommendation = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.recommendationScore, 0) / orgInternships.length).toFixed(1)) : 0;
                    const avgHire = orgInternships.length ? parseFloat(((orgInternships.reduce((s, i) => s + i.likelyToHire, 0) / orgInternships.length) * 2).toFixed(1)) : 0;
                    return { name: o, "Recommend ALU": avgRecommendation, "Likely to Hire": avgHire };
                  })} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 120 }} barCategoryGap="12%" barGap={2}>
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 10]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 9, paddingTop: 12 }} />
                    <Bar dataKey="Recommend ALU" fill="#D45F2C" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Likely to Hire" fill="#F5A76D" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
            )}

            <div style={{ marginBottom: 28, marginTop: 40 }}>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, student: !prev.student }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  marginBottom: 12
                }}
              >
                <span style={{ width: 2, height: 14, borderRadius: 999, backgroundColor: "#1D9E75", flexShrink: 0 }} />
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#1D9E75", lineHeight: 1.2, margin: 0 }}>
                  Student Feedback
                </p>
                <ChevronDown size={14} color="#1D9E75" style={{ marginLeft: 4, transform: expandedSections.student ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
              </button>
            </div>
            {expandedSections.student && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Internship Placements by Programme" subtitle="Participants who secured internships" info="Students who participated in internships by academic programme" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={(() => {
                      const baseData = [
                        { programme: "BSc (Hons) Software Engineering", placements: 95 },
                        { programme: "BSc (Hons) Entrepreneurial Leadership", placements: 92 },
                        { programme: "ALURW - International Business and Trade", placements: 38 },
                        { programme: "Teach-out - ALURW - Global Challenges", placements: 8 },
                        { programme: "ALCHE - Entrepreneurial Leadership", placements: 5 },
                        { programme: "ALCHE - Software Engineering", placements: 1 },
                        { programme: "Teach out - ALURW - Computer Science", placements: 1 },
                      ];
                      if (filterSectorYear === "All Years") return baseData;
                      const year = parseInt(filterSectorYear);
                      const yearMultiplier = year === 2021 ? 0.4 : year === 2022 ? 0.6 : year === 2023 ? 0.8 : year === 2024 ? 1 : 0.9;
                      return baseData.map(item => ({ ...item, placements: Math.round(item.placements * yearMultiplier) }));
                    })()} layout="vertical" margin={{ top: 6, right: 50, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="programme" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 500 }} axisLine={false} tickLine={false} width={210} />
                      <Tooltip content={<ChartTip />} />
                      <Bar dataKey="placements" fill="#10B981" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="placements" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#10B981", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Placements</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Internship Quality & Relevance" subtitle="Student perception of internship experience" info="Average student ratings for quality, relevance, clarity, and support (1-5 scale)" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    {
                      dimension: "Relevance to Career Goals",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.relevanceToCareer, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                    {
                      dimension: "Overall Quality",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.overallQuality, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                    {
                      dimension: "Clarity of Role & Responsibilities",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.clarityOfRole, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                    {
                      dimension: "Support & Supervision",
                      score: filteredInternships.length ? parseFloat((filteredInternships.reduce((s, i) => s + i.supportSupervision, 0) / filteredInternships.length).toFixed(2)) : 0
                    },
                  ]} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 190 }} barCategoryGap="12%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="dimension" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={180} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="score" fill="#7FA5D6" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="score" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#7FA5D6" }} /> Score</span>
                </div>
              </Panel>
              <Panel title="Learning & Skill Application" subtitle="Student-perceived capability growth" info="Average student rating of ability to apply skills to real-world health challenges (1-5 scale)" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.organization))).sort().map(o => {
                    const orgInternships = filteredInternships.filter(i => i.organization === o);
                    const avgSkillApplication = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.skillApplicationToRealWorld, 0) / orgInternships.length).toFixed(1)) : 0;
                    return { name: o, "Real-World Application": avgSkillApplication };
                  })} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 120 }} barCategoryGap="12%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="Real-World Application" fill="#1D9E75" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="Real-World Application" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#1D9E75" }} /> Real-World Application</span>
                </div>
              </Panel>
              <Panel title="Intern Recommendation & Completion" subtitle="Student satisfaction and programme completion" info="Student recommendation score (0-10 scale) and completion rate (% of interns who completed)" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterSectorYear} onFilterChange={setFilterSectorYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.organization))).sort().map(o => {
                    const orgInternships = filteredInternships.filter(i => i.organization === o);
                    const avgRecommendation = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.internRecommendationScore, 0) / orgInternships.length).toFixed(1)) : 0;
                    const avgCompletion = orgInternships.length ? parseFloat((orgInternships.reduce((s, i) => s + i.completionRate, 0) / orgInternships.length).toFixed(0)) : 0;
                    return { name: o, "Recommendation": avgRecommendation, "Completion %": avgCompletion };
                  })} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 120 }} barCategoryGap="12%" barGap={2}>
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 9, paddingTop: 12 }} />
                    <Bar dataKey="Recommendation" fill="#479BD6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Completion %" fill="#7FA5D6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
            )}
          </section>
        )}
        <PortalFooter portal="hemp" synced="18 Jun 2026, EAT" />

      </div>
    </div>
  );
}
