"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { missionStudents, STUDENT_TRACKS } from "@/data/hemp/mission-students";
import { targets2030 } from "@/data/hemp-participation";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { Briefcase, Target, TrendingUp, Users, Info, type LucideIcon, ChevronDown, Award } from "lucide-react";

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

export default function MissionStudentsPage() {
  const categories = ["Enrollment & Progress", "Career Outcomes", "Venture Metrics"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterCohort, setFilterCohort] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = [filterYear !== "All Years", filterCohort !== "All", filterStatus !== "All"].filter(Boolean).length;

  const years = Array.from(new Set(missionStudents.map(s => s.cohort))).sort();
  const cohorts = Array.from(new Set(missionStudents.map(s => {
    const cohortNum = Math.ceil((years.indexOf(s.cohort) + 1));
    return cohortNum;
  }))).sort((a, b) => a - b);

  const filteredStudents = useMemo(() => {
    return missionStudents.filter(s => {
      if (filterYear !== "All Years" && s.cohort !== parseInt(filterYear)) return false;
      if (filterCohort !== "All") {
        const cohortNum = Math.ceil((years.indexOf(s.cohort) + 1));
        if (cohortNum !== parseInt(filterCohort)) return false;
      }
      if (filterStatus !== "All" && s.status !== filterStatus) return false;
      return true;
    });
  }, [filterYear, filterCohort, filterStatus]);

  const totalEnrolled = filteredStudents.length;
  const completed = filteredStudents.filter(s => s.status === "Completed").length;
  const completionRate = totalEnrolled ? Math.round((completed / totalEnrolled) * 100) : 0;
  const femaleStudents = filteredStudents.filter(s => s.gender === "Female").length;
  const femalePct = totalEnrolled ? Math.round((femaleStudents / totalEnrolled) * 100) : 0;
  const avgGPA = filteredStudents.length ? parseFloat((filteredStudents.reduce((s, st) => s + st.gpa, 0) / filteredStudents.length).toFixed(2)) : 0;
  const employed = filteredStudents.filter(s => s.employment === "Employed").length;
  const completedStudents = filteredStudents.filter(s => s.status === "Completed");
  const employmentRate = completedStudents.length ? Math.round((employed / completedStudents.length) * 100) : 0;
  const venturesCreated = filteredStudents.filter(s => s.ventureCreated).length;
  const internshipRate = totalEnrolled ? Math.round((filteredStudents.filter(s => s.hasInternship).length / totalEnrolled) * 100) : 0;

  const [filterProgressYear, setFilterProgressYear] = useState("All Years");
  const [filterOutcomeYear, setFilterOutcomeYear] = useState("All Years");
  const [filterVentureYear, setFilterVentureYear] = useState("All Years");

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Mission Students Programme</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Enrollment, academic performance and career outcomes
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(120,180,240,0.8)", fontWeight: 600 }}>Period:</span> 2021–2026</span>
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
              label: "Total Enrolled",
              num: totalEnrolled,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: ${targets2030.missionStudents.toLocaleString()} by 2030`,
              tip: "Total mission students enrolled toward 2030 target",
              pace: true,
              paceA: totalEnrolled,
              paceT: targets2030.missionStudents,
            },
            {
              label: "Completion Rate",
              num: completionRate,
              icon: TrendingUp,
              displayFmt: (n) => n + "%",
              sub: `Goal: 100% | ${completed} completed`,
              tip: "Percentage of students who have completed the programme",
              pace: true,
              paceA: completionRate,
              paceT: 100,
            },
            {
              label: "Female Participation",
              num: femalePct,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `Goal: 60% | ${femaleStudents} female students`,
              tip: "Percentage of female students in the programme",
              pace: true,
              paceA: femalePct,
              paceT: 60,
            },
            {
              label: "Average GPA",
              num: avgGPA,
              icon: Award,
              displayFmt: (n) => n.toFixed(2),
              sub: `Goal: 3.5+ | Out of 4.0`,
              tip: "Average cumulative GPA across all students",
              pace: true,
              paceA: avgGPA * 25,
              paceT: 87.5,
            },
            {
              label: "Employment Rate",
              num: employmentRate,
              icon: Briefcase,
              displayFmt: (n) => n + "%",
              sub: `Goal: 70% | ${employed} employed`,
              tip: "Percentage of completed students who are employed",
              pace: true,
              paceA: employmentRate,
              paceT: 70,
            },
            {
              label: "Ventures Created",
              num: venturesCreated,
              icon: Target,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Entrepreneurship outcomes`,
              tip: "Number of students who have created ventures",
              pace: true,
              paceA: Math.min(venturesCreated * 5, 100),
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
                setFilterCohort("All");
                setFilterStatus("All");
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", ...years.map(String)] },
                { label: "Cohort", value: filterCohort, setValue: setFilterCohort, options: ["All", ...cohorts.map(c => `Cohort ${c}`)] },
                { label: "Status", value: filterStatus, setValue: setFilterStatus, options: ["All", "Active", "Completed", "Deferred"] },
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

        {show("Enrollment & Progress") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Enrollment & Progress
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Student enrollment and completion progress</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Enrollment Trend" subtitle="Student enrollment over time" info="Annual trend of students enrolled in mission programme" filterOptions={["All Years", ...years.map(String)]} filterValue={filterProgressYear} onFilterChange={setFilterProgressYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), enrolled: missionStudents.filter(s => s.cohort === y).length }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="enrolled" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Enrolled" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Completion Status" subtitle="Student progression through programme" info="Distribution of students across completion statuses">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Active", value: filteredStudents.filter(s => s.status === "Active").length },
                    { name: "Completed", value: filteredStudents.filter(s => s.status === "Completed").length },
                    { name: "Deferred", value: filteredStudents.filter(s => s.status === "Deferred").length },
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
              <Panel title="Female Participation Trend" subtitle="Gender diversity over time" info="Female student participation trend across years">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={years.map(y => ({ year: String(y), female: missionStudents.filter(s => s.cohort === y && s.gender === "Female").length }))} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="female" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Female Students">
                      <LabelList dataKey="female" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Female Students</span>
                </div>
              </Panel>
              <Panel title="Internship Participation" subtitle="Students engaged in internships" info="Percentage of students with internship experience">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "With Internship", value: filteredStudents.filter(s => s.hasInternship).length },
                    { name: "No Internship", value: filteredStudents.filter(s => !s.hasInternship).length },
                  ]} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="value" fill="#7FA5D6" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#7FA5D6" }} /> Count</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

{show("Career Outcomes") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Career Outcomes
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Post-graduation employment and career progression</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Employment Status" subtitle="Post-graduation employment outcomes" info="Distribution of completed students by employment status" filterOptions={["All Years", ...years.map(String)]} filterValue={filterOutcomeYear} onFilterChange={setFilterOutcomeYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Employed", value: completedStudents.filter(s => s.employment === "Employed").length },
                    { name: "Entrepreneur", value: completedStudents.filter(s => s.employment === "Entrepreneur").length },
                    { name: "Further Study", value: completedStudents.filter(s => s.employment === "Further Study").length },
                    { name: "Seeking", value: completedStudents.filter(s => s.employment === "Seeking").length },
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
              <Panel title="Employment by Track" subtitle="Career placement rate by study programme" info="Percentage employed for each study track">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={STUDENT_TRACKS.map(track => {
                    const trackCompleted = completedStudents.filter(s => s.track === track);
                    const trackEmployed = trackCompleted.filter(s => s.employment === "Employed");
                    return {
                      name: track,
                      rate: trackCompleted.length ? Math.round((trackEmployed.length / trackCompleted.length) * 100) : 0
                    };
                  }).sort((a, b) => b.rate - a.rate)} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="rate" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Employment %">
                      <LabelList dataKey="rate" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Employment %</span>
                </div>
              </Panel>
              <Panel title="Employment Trend" subtitle="Career outcomes over time" info="Employment outcomes by cohort year">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={years.map(y => {
                    const yearCompleted = missionStudents.filter(s => s.cohort === y && s.status === "Completed");
                    const yearEmployed = yearCompleted.filter(s => s.employment === "Employed");
                    return {
                      year: String(y),
                      employed: yearCompleted.length ? Math.round((yearEmployed.length / yearCompleted.length) * 100) : 0
                    };
                  })} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="employed" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]} name="Employment %">
                      <LabelList dataKey="employed" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Employment %</span>
                </div>
              </Panel>
              <Panel title="Internship Impact" subtitle="Career outcomes with internship experience" info="Employment rate comparison for students with and without internship">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    {
                      name: "With Internship",
                      value: (() => {
                        const withIntern = completedStudents.filter(s => s.hasInternship);
                        return withIntern.length ? Math.round((withIntern.filter(s => s.employment === "Employed").length / withIntern.length) * 100) : 0;
                      })()
                    },
                    {
                      name: "Without Internship",
                      value: (() => {
                        const noIntern = completedStudents.filter(s => !s.hasInternship);
                        return noIntern.length ? Math.round((noIntern.filter(s => s.employment === "Employed").length / noIntern.length) * 100) : 0;
                      })()
                    },
                  ]} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="value" fill="#7FA5D6" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#7FA5D6" }} /> Count</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {show("Venture Metrics") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Venture Metrics
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Entrepreneurship outcomes and venture creation</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Venture Creation Trend" subtitle="Entrepreneurship outcomes over time" info="Number of ventures created by cohort" filterOptions={["All Years", ...years.map(String)]} filterValue={filterVentureYear} onFilterChange={setFilterVentureYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={years.map(y => ({
                    year: String(y),
                    ventures: missionStudents.filter(s => s.cohort === y && s.ventureCreated).length
                  }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="ventures" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]} name="Ventures Created">
                      <LabelList dataKey="ventures" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: BRAND }} /> Ventures Created</span>
                </div>
              </Panel>
              <Panel title="Venture Creation by Track" subtitle="Entrepreneurship outcomes by study programme" info="Number of ventures created per study track">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={STUDENT_TRACKS.map(track => ({
                    name: track,
                    value: filteredStudents.filter(s => s.track === track && s.ventureCreated).length
                  })).sort((a, b) => b.value - a.value)} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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
              <Panel title="Venture Creation Rate" subtitle="Percentage of completed students creating ventures" info="Entrepreneur ratio among completed cohorts">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={years.map(y => {
                    const yearCompleted = missionStudents.filter(s => s.cohort === y && s.status === "Completed");
                    const yearVentures = yearCompleted.filter(s => s.ventureCreated);
                    return {
                      year: String(y),
                      rate: yearCompleted.length ? Math.round((yearVentures.length / yearCompleted.length) * 100) : 0
                    };
                  })} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="rate" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]} name="Venture Rate %">
                      <LabelList dataKey="rate" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Venture by Employment Status" subtitle="Entrepreneurship among employed graduates" info="Venture creation rate by employment category">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    {
                      name: "Entrepreneurs",
                      value: completedStudents.filter(s => s.employment === "Entrepreneur").length
                    },
                    {
                      name: "Employed (Non-Venture)",
                      value: completedStudents.filter(s => s.employment === "Employed").length
                    },
                    {
                      name: "Further Study",
                      value: completedStudents.filter(s => s.employment === "Further Study").length
                    },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#7FA5D6" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
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
