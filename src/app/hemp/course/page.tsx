"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import HeaderDesign from "@/components/layout/header-design";
import { ghCohorts, GH_MODULES, GH_PROGRAMMES } from "@/data/hemp/global-health";
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

export default function HEMPCourses() {
  const categories = ["Enrolment & Outcomes", "Academic Performance", "Progression Pathways"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = filterYear !== "All Years" ? 1 : 0;

  const years = Array.from(new Set(ghCohorts.map(c => c.cohortYear))).sort();

  const filteredCohorts = useMemo(() => {
    return ghCohorts.filter(c => {
      if (filterYear !== "All Years" && c.cohortYear !== parseInt(filterYear)) return false;
      return true;
    });
  }, [filterYear]);

  const totalEnrolled = filteredCohorts.reduce((s, c) => s + c.enrolled, 0);
  const totalCompleted = filteredCohorts.reduce((s, c) => s + c.completed, 0);
  const totalCertified = filteredCohorts.reduce((s, c) => s + c.certified, 0);
  const femaleStudents = filteredCohorts.reduce((s, c) => s + c.female, 0);
  const femalePct = totalEnrolled ? Math.round((femaleStudents / totalEnrolled) * 100) : 0;
  const avgScore = filteredCohorts.length ? Math.round(filteredCohorts.reduce((s, c) => s + c.avgScore, 0) / filteredCohorts.length) : 0;
  const avgSatisfaction = filteredCohorts.length ? parseFloat((filteredCohorts.reduce((s, c) => s + c.satisfaction, 0) / filteredCohorts.length).toFixed(1)) : 0;
  const totalVentureProgression = filteredCohorts.reduce((s, c) => s + c.progressedToVenture, 0);

  const [filterOutcomeYear, setFilterOutcomeYear] = useState("All Years");
  const [filterProgrammeYear, setFilterProgrammeYear] = useState("All Years");

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Courses</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Foundational course for healthcare professionals — enrolment, completion and career progression
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
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                Mission Students Context
              </p>
              <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Programme baseline and student outcomes</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { label: "Total Enrolled", value: msTotalEnrolled.toLocaleString(), sub: "Mission Students" },
              { label: "Completion Rate", value: msCompletionRate + "%", sub: "Programme completion" },
              { label: "Female Participation", value: msFemalePct + "%", sub: msFemaleStudents.toLocaleString() + " female students" },
              { label: "Employment Rate", value: msEmploymentRate + "%", sub: "Graduates employed" },
              { label: "Average GPA", value: msAvgGPA, sub: "Out of 4.0" },
              { label: "Ventures Created", value: msVenturesCreated.toLocaleString(), sub: "Health ventures" },
            ].map((card, i) => (
              <div key={i} style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid " + LIGHT_BORDER, borderLeft: "5px solid " + BRAND, padding: "14px 16px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 8px 0" }}>{card.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: BRAND_DK, margin: "0 0 6px 0" }}>{card.value}</p>
                <p style={{ fontSize: 9, color: "#6B7280", margin: 0 }}>{card.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <HeaderStatsPanel
          title="Programme Overview"
          cards={[
            {
              label: "Total Enrolled",
              num: totalEnrolled,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: ${targets2030.courses.toLocaleString()} by 2030`,
              tip: "Total students enrolled toward 2030 target",
              pace: true,
              paceA: totalEnrolled,
              paceT: targets2030.courses,
            },
            {
              label: "Completion Rate",
              num: totalEnrolled ? Math.round((totalCompleted / totalEnrolled) * 100) : 0,
              icon: Target,
              displayFmt: (n) => n + "%",
              sub: `Goal: 85% | ${totalCompleted} completed the course`,
              tip: "Percentage of enrolled students who completed the course",
              pace: true,
              paceA: totalEnrolled ? Math.round((totalCompleted / totalEnrolled) * 100) : 0,
              paceT: 85,
            },
            {
              label: "Certification Rate",
              num: totalCompleted ? Math.round((totalCertified / totalCompleted) * 100) : 0,
              icon: Briefcase,
              displayFmt: (n) => n + "%",
              sub: `Goal: 80% | ${totalCertified} passed assessment`,
              tip: "Percentage of completers who passed the assessment",
              pace: true,
              paceA: totalCompleted ? Math.round((totalCertified / totalCompleted) * 100) : 0,
              paceT: 80,
            },
            {
              label: "Female Participation",
              num: femalePct,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `${femaleStudents} female students`,
              tip: "Percentage of female participants",
              pace: true,
              paceA: femalePct,
              paceT: 50,
            },
            {
              label: "Average Score",
              num: avgScore,
              icon: Briefcase,
              displayFmt: (n) => n + "%",
              sub: `Assessment performance`,
              tip: "Average assessment score across cohorts",
              pace: true,
              paceA: avgScore,
              paceT: 100,
            },
            {
              label: "Satisfaction",
              num: avgSatisfaction,
              icon: TrendingUp,
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
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", ...years.map(String)] },
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

        {show("Enrolment & Outcomes") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Enrolment & Outcomes
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Student participation and completion trends</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Enrolment Funnel" subtitle="Applied to completion journey" info="The progression from enrolment through to certification">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohorts.map((c, i) => ({
                    name: String(c.cohortYear),
                    enrolled: c.enrolled,
                    completed: c.completed,
                    certified: c.certified,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="enrolled" fill="#A8C5E6" barSize={30} name="Enrolled" />
                    <Bar dataKey="completed" fill="#479BD6" barSize={30} name="Completed" />
                    <Bar dataKey="certified" fill={BRAND} barSize={30} name="Certified" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#A8C5E6" }} /> Enrolled</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Completed</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Certified</span>
                </div>
              </Panel>
              <Panel title="Gender Distribution" subtitle="Female and male participation" info="Gender diversity across enrolled students" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Female", value: femaleStudents },
                    { name: "Male", value: totalEnrolled - femaleStudents },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="value" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Count</span>
                </div>
              </Panel>
              <Panel title="Enrolment Trend" subtitle="Growth in student enrollment over time" info="Annual trend in course enrolment">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohorts.map(c => ({ year: String(c.cohortYear), enrolled: c.enrolled }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="enrolled" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Enrolled" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Completion Rate Trend" subtitle="Percentage of students completing the course over time" info="Annual completion rate trend">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohorts.map(c => ({
                    year: String(c.cohortYear),
                    rate: c.enrolled ? Math.round((c.completed / c.enrolled) * 100) : 0
                  }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="rate" stroke="#479BD6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Completion %" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Academic Performance") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Academic Performance
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Assessment scores and module completion rates</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Average Score Trend" subtitle="Assessment performance over time" info="Average assessment score by cohort" filterOptions={["All Years", ...years.map(String)]} filterValue={filterProgrammeYear} onFilterChange={setFilterProgrammeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCohorts.map(c => ({ year: String(c.cohortYear), score: c.avgScore }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="score" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Score %" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Module Completion by Cohort" subtitle="Completion rates across course modules" info="Average completion rate across all modules per cohort">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohorts.map(c => ({
                    name: String(c.cohortYear),
                    modules: GH_MODULES.length ? Math.round(Object.values(c.moduleCompletion).reduce((a, b) => a + b, 0) / GH_MODULES.length) : 0,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="modules" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Avg Completion %">
                      <LabelList dataKey="modules" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Avg Completion %</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {show("Progression Pathways") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Progression Pathways
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Next steps after course completion — ventures, research, and internships</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Progression to Ventures" subtitle="Students who started ventures" info="Number of students who progressed to venture creation">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredCohorts.map(c => ({
                    name: String(c.cohortYear),
                    ventures: c.progressedToVenture,
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="ventures" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]} name="Ventures">
                      <LabelList dataKey="ventures" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Ventures</span>
                </div>
              </Panel>
              <Panel title="Overall Progression" subtitle="Students advancing to next steps" info="Total students progressing to ventures, research, and internships">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Ventures", value: totalVentureProgression },
                    { name: "Research", value: filteredCohorts.reduce((s, c) => s + c.progressedToResearch, 0) },
                    { name: "Internships", value: filteredCohorts.reduce((s, c) => s + c.progressedToInternship, 0) },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="value" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Count</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* Programme Reach Section */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Programme Reach</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Geographic Reach */}
            <Panel title="Geographic Coverage" subtitle="Participants by region">
              {(() => {
                const geoData = REACH_RECORDS.filter(r => r.year >= 2024)
                  .reduce((acc, r) => {
                    const region = COUNTRY_REGION[r.country] || "Other";
                    const existing = acc.find(x => x.region === region);
                    if (existing) {
                      existing.reach += r.reach;
                      existing.female += r.female;
                    } else {
                      acc.push({ region, reach: r.reach, female: r.female });
                    }
                    return acc;
                  }, [] as Array<{ region: string; reach: number; female: number }>)
                  .sort((a, b) => b.reach - a.reach);

                return (
                  <div className="space-y-3">
                    {geoData.length > 0 ? (
                      geoData.map(item => (
                        <div key={item.region} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{item.region}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900">{item.reach}</span>
                            <span className="text-xs text-gray-500">({item.female} female)</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No data available</p>
                    )}
                  </div>
                );
              })()}
            </Panel>

            {/* Gender Distribution */}
            <Panel title="Gender Distribution" subtitle="Participant demographics">
              {(() => {
                const genderData = REACH_RECORDS.filter(r => r.year >= 2024)
                  .reduce((acc, r) => ({ total: acc.total + r.reach, female: acc.female + r.female }), { total: 0, female: 0 });

                const maleCount = genderData.total - genderData.female;
                const femalePercent = genderData.total > 0 ? Math.round((genderData.female / genderData.total) * 100) : 0;
                const malePercent = 100 - femalePercent;

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Total Participants</span>
                      <span className="text-lg font-semibold text-gray-900">{genderData.total}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Female</span>
                        <span className="font-medium text-gray-900">{genderData.female} ({femalePercent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${femalePercent}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Male</span>
                        <span className="font-medium text-gray-900">{maleCount} ({malePercent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${malePercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Panel>

            {/* Participant Satisfaction */}
            <Panel title="Participant Satisfaction" subtitle="Programme feedback ratings">
              {(() => {
                const avgSatisfaction = ghCohorts.length > 0
                  ? (ghCohorts.reduce((sum, c) => sum + c.satisfaction, 0) / ghCohorts.length).toFixed(1)
                  : "N/A";
                const satisfactionPercent = parseFloat(avgSatisfaction as string) * 20; // out of 5, convert to percentage

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Average Rating</span>
                      <span className="text-lg font-semibold text-gray-900">{avgSatisfaction}/5.0</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: `${satisfactionPercent}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">Based on participant feedback</p>
                    </div>
                  </div>
                );
              })()}
            </Panel>
          </div>
        </section>

        <PortalFooter portal="hemp" synced="18 Jun 2026, EAT" />

      </div>
    </div>
  );
}
