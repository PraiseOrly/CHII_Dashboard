"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { internships, INTERNSHIP_ORGANIZATIONS, INTERNSHIP_DEPARTMENTS } from "@/data/hemp/internships";
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
  const categories = ["Growth & Outcomes", "Sector Mix", "Geography & Impact", "Quality & Placements"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterOrganization, setFilterOrganization] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterCohort, setFilterCohort] = useState("All");
  const [filterFemale, setFilterFemale] = useState("All");
  const [filterIDP, setFilterIDP] = useState("All");
  const [filterPLWD, setFilterPLWD] = useState("All");

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

  const [filterOutcomeYear, setFilterOutcomeYear] = useState("All Years");
  const [filterSectorYear, setFilterSectorYear] = useState("All Years");
  const [filterGeoYear, setFilterGeoYear] = useState("All Years");

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Internship Programme</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Placements, student outcomes and employment partnerships
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Period:</span> 2021–2025</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
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
              label: "Total Students",
              num: totalStudents,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Across ${filteredInternships.length} placements`,
              tip: "Total students placed in internships",
              pace: true,
              paceA: totalStudents,
              paceT: 200,
            },
            {
              label: "Female Participation",
              num: femalePct,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `${femaleStudents} female students`,
              tip: "Percentage of female interns",
              pace: true,
              paceA: femalePct,
              paceT: 50,
            },
            {
              label: "Employment Conversions",
              num: totalConversions,
              icon: Briefcase,
              displayFmt: (n) => n.toLocaleString(),
              sub: `${conversionRate}% conversion rate`,
              tip: "Students who secured employment after internship",
              pace: true,
              paceA: conversionRate,
              paceT: 100,
            },
            {
              label: "Satisfaction Score",
              num: avgSatisfaction,
              icon: TrendingUp,
              displayFmt: (n) => n.toFixed(1),
              sub: `Out of 5`,
              tip: "Average student satisfaction rating",
              pace: true,
              paceA: avgSatisfaction * 20,
              paceT: 100,
            },
            {
              label: "Mentorship Coverage",
              num: Math.round((mentorshipCount / filteredInternships.length) * 100),
              icon: Target,
              displayFmt: (n) => n + "%",
              sub: `${mentorshipCount} placements with mentors`,
              tip: "Percentage of placements with assigned mentors",
              pace: true,
              paceA: Math.round((mentorshipCount / filteredInternships.length) * 100),
              paceT: 100,
            },
            {
              label: "Avg Duration",
              num: avgDuration,
              icon: Briefcase,
              displayFmt: (n) => n + " weeks",
              sub: `Programme length`,
              tip: "Average internship duration in weeks",
              pace: true,
              paceA: avgDuration,
              paceT: 12,
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
              <Panel title="Employment Conversions" subtitle="Post-internship placements" info="Number of students securing employment after internship">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Employed", value: totalConversions },
                    { name: "Not Employed", value: totalStudents - totalConversions },
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
              <Panel title="Female Participation Trend" subtitle="Gender diversity over time" info="Female student participation trend across years">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={years.map(y => ({ year: String(y), female: filteredInternships.filter(i => i.year === y).reduce((s, i) => s + i.femaleStudents, 0) }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="female" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Female Students">
                      <LabelList dataKey="female" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Satisfaction Scores" subtitle="Student experience ratings by placement" info="Average satisfaction rating (out of 5) for each internship placement">
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
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={BRAND} barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Departments by Organization" subtitle="Department distribution across partner organizations" info="Number of internship placements by department within each organization">
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
                    <Legend wrapperStyle={{ fontSize: 9, paddingTop: 12 }} />
                    {Array.from(new Set(filteredInternships.map(i => i.department))).map((dept, idx) => (
                      <Bar key={dept} dataKey={dept} stackId="a" fill={BRAND_DK} opacity={0.6 + (idx * 0.05)} radius={idx === Array.from(new Set(filteredInternships.map(i => i.department))).length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Geography & Impact") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Geography & Impact
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Geographic distribution and regional outcomes</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Placements by Country" subtitle="Geographic distribution" info="Number of placements across countries" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGeoYear} onFilterChange={setFilterGeoYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.country))).map(c => ({
                    name: c,
                    value: filteredInternships.filter(i => i.country === c).length
                  })).sort((a, b) => b.value - a.value).slice(0, 8)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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
              <Panel title="Students by Country" subtitle="Reach across regions" info="Total students placed per country">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(filteredInternships.map(i => i.country))).map(c => ({
                    name: c,
                    value: filteredInternships.filter(i => i.country === c).reduce((s, i) => s + i.students, 0)
                  })).sort((a, b) => b.value - a.value).slice(0, 8)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#7FA5D6" barSize={46} radius={[4, 4, 0, 0]} name="Students">
                      <LabelList dataKey="value" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Student and Partner Feedback" subtitle="Feedback ratings by organization" info="Average feedback scores from students and partner organizations">
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
                    <Bar dataKey="Student Feedback" fill="#185FA5" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Partner Feedback" fill="#479BD6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Workplace Skills" subtitle="Employer assessment of core competencies" info="Average employer ratings for student workplace skills (1=Never, 5=Consistently)">
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
              </Panel>
              <Panel title="Health Sector Readiness" subtitle="Understanding and application of health context" info="Average employer ratings on health systems understanding and practical application (1=Not at all, 5=Extremely)">
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
              <Panel title="Employer Recommendation & Hiring" subtitle="Likelihood to recommend ALU and hire graduates" info="Employer likelihood to recommend ALU students (0-10 scale) and hire graduates">
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
          </section>
        )}

        <PortalFooter portal="hemp" synced="18 Jun 2026, EAT" />

      </div>
    </div>
  );
}
