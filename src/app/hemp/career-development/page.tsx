"use client";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import HeaderDesign from "@/components/layout/header-design";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import { missionStudents } from "@/data/mission-students";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { Users, Target, TrendingUp, Briefcase, type LucideIcon, ChevronDown, Search, Info } from "lucide-react";

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

function CustomBar(props: any) {
  const { fill, x, y, width, height, payload } = props;
  const barFill = payload?.fill || fill || "#14306B";
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={barFill}
      rx={4}
      ry={4}
    />
  );
}

// Mock Career Workshops data
const SESSIONS_DATA = [
  { year: 2021, sessions: 2, students: 177, goal: 400 },
  { year: 2022, sessions: 3, students: 350, goal: 700 },
  { year: 2023, sessions: 5, students: 753, goal: 1100 },
  { year: 2024, sessions: 5, students: 1359, goal: 1500 },
  { year: 2025, sessions: 3, students: 1978, goal: 1900 },
  { year: 2026, sessions: 2, students: 2359, goal: 2359 },
];

const SESSION_TYPES = [
  { name: "Format A", sessions: 7, avgAttendance: 118 },
  { name: "Format B", sessions: 5, avgAttendance: 95 },
  { name: "Format C", sessions: 5, avgAttendance: 108 },
  { name: "Format D", sessions: 3, avgAttendance: 78 },
];

const PARTNERS_BY_TYPE = [
  { type: "Health facility", count: 18 },
  { type: "NGO", count: 15 },
  { type: "Private sector", count: 12 },
  { type: "Government", count: 10 },
  { type: "Academic", count: 8 },
];

const PARTNERS = [
  { name: "Hospital partner", type: "Health facility", sessions: 8, year: 2023, topics: "Clinical career paths" },
  { name: "Health centre partner", type: "Health facility", sessions: 5, year: 2024, topics: "Facility visit" },
  { name: "NGO partner", type: "NGO", sessions: 6, year: 2023, topics: "Community health roles" },
  { name: "NGO partner 2", type: "NGO", sessions: 4, year: 2024, topics: "Session topic" },
  { name: "Health-tech company", type: "Private sector", sessions: 3, year: 2025, topics: "Innovation exposure" },
  { name: "Pharma company", type: "Private sector", sessions: 4, year: 2024, topics: "CV and interview skills" },
  { name: "Ministry of Health", type: "Government", sessions: 5, year: 2023, topics: "Public sector careers" },
  { name: "University partner", type: "Academic", sessions: 6, year: 2024, topics: "Further study" },
];

const QUALITY_BY_TYPE = [
  { type: "Format A", score: 4.1 },
  { type: "Format B", score: 3.9 },
  { type: "Format C", score: 4.2 },
  { type: "Format D", score: 3.8 },
];

const RATING_DIST = [
  { rating: 5, percent: 35 },
  { rating: 4, percent: 42 },
  { rating: 3, percent: 18 },
  { rating: 2, percent: 4 },
  { rating: 1, percent: 1 },
];

export default function CareerWorkshopsPage() {
  const categories = ["Programme Reach", "Quality & Experience", "Partners"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterSessionType, setFilterSessionType] = useState("All Types");
  const [filterPartner, setFilterPartner] = useState("All 63 Partners");
  const [partnerSearch, setPartnerSearch] = useState("");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = [filterYear !== "All Years", filterSessionType !== "All Types", filterPartner !== "All 63 Partners"].filter(Boolean).length;

  const filteredPartners = useMemo(() => {
    return PARTNERS.filter(p => {
      const matchPartner = filterPartner === "All 63 Partners" || p.name === filterPartner;
      const matchSearch = p.name.toLowerCase().includes(partnerSearch.toLowerCase());
      return matchPartner && matchSearch;
    });
  }, [filterPartner, partnerSearch]);

  const totalParticipants = 2359;
  const totalPWD = Math.round(totalParticipants * 0.12);
  const totalRefugees = Math.round(totalParticipants * 0.07);
  const inclusionReachTotal = totalPWD + totalRefugees;

  return (
    <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
      <PortalNav portal="hemp" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <HeaderDesign />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Career Workshops</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Student engagement through professional development and career exposure
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
              num: 2359,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: 1,500 by 2030 | 157% of goal`,
              tip: "Total participants in career workshops",
              pace: true,
              paceA: 2359,
              paceT: 1500,
            },
            {
              label: "Sessions Held",
              num: 20,
              icon: Briefcase,
              displayFmt: (n) => n.toString(),
              sub: `Goal: 50 | 40% of target`,
              tip: "Number of sessions held to date",
              pace: true,
              paceA: 20,
              paceT: 50,
            },
            {
              label: "Female Participation",
              num: 46,
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `Goal: 50% | 35% mission students`,
              tip: "Percentage of female participants across all students and mission cohort",
              pace: true,
              paceA: 46,
              paceT: 50,
            },
            {
              label: "Partner Organizations",
              num: 63,
              icon: TrendingUp,
              displayFmt: (n) => n.toString(),
              sub: `Goal: 100 by 2030 | 63% of target`,
              tip: "Number of partner organizations",
              pace: true,
              paceA: 63,
              paceT: 100,
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
            {
              label: "Quality Score",
              num: 4.0,
              icon: Briefcase,
              displayFmt: (n) => n.toFixed(1),
              sub: `Goal: 4.0+ | Out of 5`,
              tip: "Average participant satisfaction rating",
              pace: true,
              paceA: 80,
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
                setFilterSessionType("All Types");
                setFilterPartner("All 63 Partners");
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", "2021", "2022", "2023", "2024", "2025", "2026"] },
                { label: "Session Type", value: filterSessionType, setValue: setFilterSessionType, options: ["All Types", "Format A", "Format B", "Format C", "Format D"] },
                { label: "Partner", value: filterPartner, setValue: setFilterPartner, options: ["All 63 Partners", ...PARTNERS.map(p => p.name)] },
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
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Cumulative growth and demographic breakdown</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Cumulative Growth" subtitle="Participants vs 2030 goal & Session trends" info="Total participants growth trajectory and session count over time">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={SESSIONS_DATA} margin={{ top: 6, right: 60, bottom: 0, left: -12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Line yAxisId="left" type="monotone" dataKey="students" stroke="#479BD6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Students" />
                      <Line yAxisId="left" type="monotone" dataKey="goal" stroke="#10B981" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }} activeDot={{ r: 5 }} name="2030 Goal" />
                      <Line yAxisId="right" type="monotone" dataKey="sessions" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Sessions" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 2, backgroundColor: "#479BD6", borderRadius: 1 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Students</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 2, backgroundColor: "#10B981", borderRadius: 1, backgroundImage: "repeating-linear-gradient(90deg, #10B981 0px, #10B981 5px, transparent 5px, transparent 10px)" }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>2030 Goal</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 2, backgroundColor: BRAND, borderRadius: 1 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Sessions</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Inclusion Reach" subtitle="Participant demographics" info="Breakdown across gender, disability and refugee status">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { category: "Female", value: 1094, percentage: 46, fill: "#EC4899" },
                      { category: "Male", value: 1265, percentage: 54, fill: "#0EA5E9" },
                      { category: "PWD", value: 118, percentage: 5, fill: "#F97316" },
                      { category: "Refugee", value: 71, percentage: 3, fill: "#8B5CF6" },
                    ]} layout="vertical" margin={{ top: 6, right: 14, bottom: 0, left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={75} />
                      <Tooltip content={<ChartTip />} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} shape={<CustomBar />}>
                        <LabelList dataKey="percentage" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} formatter={(v: number) => `${v}%`} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#EC4899", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Female</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#0EA5E9", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Male</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#F97316", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>PWD</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#8B5CF6", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Refugee</span>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

          </section>
        )}

        {show("Quality & Experience") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Quality & Experience
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Participant satisfaction and programme quality</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Rating Distribution" subtitle="Participant satisfaction scores" info="Average rating 4.0/5">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={RATING_DIST} margin={{ top: 6, right: 10, bottom: 0, left: -16 }}>
                      <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                      <XAxis dataKey="rating" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => `${v}%`} />
                      <Bar dataKey="percent" fill="#479BD6" radius={[4, 4, 0, 0]} name="Percentage">
                        <LabelList dataKey="percent" position="top" fontSize={10} fill={BRAND_DK} fontWeight={700} formatter={(v: number) => `${v}%`} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#479BD6", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Satisfaction %</span>
                    </div>
                  </div>
                </div>
              </Panel>
              <Panel title="Quality Dimensions" subtitle="Multi-dimensional participant feedback ratings" info="Ratings across relevance, quality and usefulness (0-5 scale)">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { metric: "Relevance", rating: 4.25, color: "#EC4899" },
                    { metric: "Quality", rating: 4.6, color: "#F97316" },
                    { metric: "Usefulness", rating: 4.4, color: "#8B5CF6" },
                  ]} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => typeof v === 'number' ? v.toFixed(2) : v} />
                    <Bar dataKey="rating" fill="#479BD6" barSize={46} radius={[4, 4, 0, 0]} name="Rating">
                      <LabelList dataKey="rating" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} offset={5} formatter={(v: number) => v.toFixed(2)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 10, color: "#6B7280", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LIGHT_BORDER}`, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 8, backgroundColor: "#479BD6", borderRadius: 2 }} />Rating (0-5)</span>
                </div>
              </Panel>

              <Panel title="Recommendation & Confidence" subtitle="NPS and skill confidence assessment" info="Net Promoter Score (0-10) and confidence level (0-5)">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Confidence", value: 4.2, metric: "confidence" },
                    { name: "NPS (÷2)", value: 3.9, metric: "nps" },
                  ]} margin={{ top: 24, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} formatter={(v) => typeof v === 'number' ? v.toFixed(1) : v} />
                    <Bar dataKey="value" fill="#10B981" barSize={46} radius={[4, 4, 0, 0]} name="Score">
                      <LabelList dataKey="value" position="top" fontSize={11} fill="#085041" fontWeight={700} offset={5} formatter={(v: number) => v.toFixed(1)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 10, color: "#6B7280", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LIGHT_BORDER}`, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 8, backgroundColor: "#10B981", borderRadius: 2 }} />Score</span>
                </div>
              </Panel>

              <Panel title="Satisfaction Trend" subtitle="Quality metrics progression by session type" info="Average satisfaction ratings tracked across different session formats">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[
                      { type: "Format A", relevance: 4.1, quality: 4.0, usefulness: 4.2 },
                      { type: "Format B", relevance: 4.0, quality: 4.3, usefulness: 4.1 },
                      { type: "Format C", relevance: 4.4, quality: 4.5, usefulness: 4.4 },
                      { type: "Format D", relevance: 4.2, quality: 4.4, usefulness: 4.3 },
                    ]} margin={{ top: 24, right: 14, bottom: 0, left: -12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                      <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} formatter={(v) => (v as number).toFixed(1)} />
                      <Line type="monotone" dataKey="relevance" stroke="#EC4899" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Relevance" />
                      <Line type="monotone" dataKey="quality" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Quality" />
                      <Line type="monotone" dataKey="usefulness" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Usefulness" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 2, backgroundColor: "#EC4899", borderRadius: 1 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Relevance</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 2, backgroundColor: "#F97316", borderRadius: 1 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Quality</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 2, backgroundColor: "#8B5CF6", borderRadius: 1 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Usefulness</span>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {show("Partners") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Partners
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Organisation diversity and engagement</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Panel title="Partner Breakdown" subtitle="By organisation type" info="Distribution across partner types">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={PARTNERS_BY_TYPE} layout="vertical" margin={{ top: 6, right: 14, bottom: 0, left: 130 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} vertical={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="type" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={120} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                      <Bar dataKey="count" fill="#479BD6" radius={[0, 4, 4, 0]} name="Partners">
                        <LabelList dataKey="count" position="right" offset={5} fontSize={10} fill={BRAND_DK} fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, backgroundColor: "#479BD6", borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: "#6B7280" }}>Partners</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Partner Directory" subtitle="Complete list of organisations" info="63 active partner organisations">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <Search size={16} style={{ position: "absolute", left: 12, top: 10, color: "#9CA3AF", pointerEvents: "none" }} />
                    <input
                      type="text"
                      placeholder="Search partners"
                      value={partnerSearch}
                      onChange={(e) => setPartnerSearch(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px 8px 36px", fontSize: 12, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 6, outline: "none" }}
                    />
                  </div>
                  <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                    {filteredPartners.map((p, idx) => (
                      <div key={idx} style={{ padding: "10px 12px", backgroundColor: LIGHT_BG, borderRadius: 8, borderLeft: `3px solid ${BRAND}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                          <p style={{ fontWeight: 600, color: BRAND, margin: 0, fontSize: 12 }}>{p.name}</p>
                          <span style={{ fontSize: 9, fontWeight: 600, color: "white", backgroundColor: BRAND, padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>{p.type}</span>
                        </div>
                        <div style={{ display: "flex", gap: 10, color: "#6B7280", fontSize: 10 }}>
                          <span>📅 {p.year}</span>
                          <span>🎯 {p.sessions} sessions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>
          </section>
        )}
      </div>

      <PortalFooter portal="hemp" />
    </div>
  );
}

