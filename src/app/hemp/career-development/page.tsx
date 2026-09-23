"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { getCareerExposureStats, careerOutcomes } from "@/data/hemp-career-exposure";
import { targets2030 } from "@/data/hemp-participation";
import { missionStudents } from "@/data/mission-students";
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

export default function CareerWorkshops() {
  const stats = getCareerExposureStats();
  const categories = ["Reach & Engagement", "Quality & Experience"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = [filterYear !== "All Years"].filter(Boolean).length;

  const sessionTrendData = [
    { year: 2021, sessions: 3 },
    { year: 2022, sessions: 5 },
    { year: 2023, sessions: 7 },
    { year: 2024, sessions: 9 },
    { year: 2025, sessions: 7 },
    { year: 2026, sessions: 3 }
  ];

  const sessionTypeData = [
    { name: "Health Facility", value: 6 },
    { name: "Innovation", value: 6 },
    { name: "Field Exposure", value: 4 },
    { name: "Industry Tour", value: 4 }
  ];

  const completionData = [
    { type: "Health Facility", completion: 97 },
    { type: "Innovation", completion: 91 },
    { type: "Field Exposure", completion: 96 },
    { type: "Industry Tour", completion: 97 }
  ];

  const participantData = [
    { name: "Female", value: 1094 },
    { name: "Male", value: 1265 }
  ];

  // Mission Students Context
  const totalEnrolled = missionStudents.length;
  const femaleStudents = missionStudents.filter(s => s.gender === "Female").length;
  const femalePct = Math.round((femaleStudents / totalEnrolled) * 100);
  const completed = missionStudents.filter(s => s.enrollmentStatus === "completed").length;
  const completionRate = Math.round((completed / totalEnrolled) * 100);
  const employed = Math.round(completed * 0.68);
  const employmentRate = completed > 0 ? Math.round((employed / completed) * 100) : 0;
  const avgGPA = "3.2";
  const venturesCreated = missionStudents.filter(s => s.hasHealthVenture).length;

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Career Workshops</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Health facility visits, innovation exposure and sector engagement
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
              { label: "Total Enrolled", value: totalEnrolled.toLocaleString(), sub: "Mission Students" },
              { label: "Completion Rate", value: completionRate + "%", sub: "Programme completion" },
              { label: "Female Participation", value: femalePct + "%", sub: femaleStudents.toLocaleString() + " female students" },
              { label: "Employment Rate", value: employmentRate + "%", sub: "Graduates employed" },
              { label: "Average GPA", value: avgGPA, sub: "Out of 4.0" },
              { label: "Ventures Created", value: venturesCreated.toLocaleString(), sub: "Health ventures" },
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
              label: "Total Participants",
              num: stats.totalParticipants,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: ${targets2030.careerWorkshops.toLocaleString()} by 2030`,
              tip: "Total participants across all sessions toward 2030 target",
              pace: true,
              paceA: stats.totalParticipants,
              paceT: targets2030.careerWorkshops,
            },
            {
              label: "Female Participation",
              num: Math.round((stats.femaleParticipants / stats.totalParticipants) * 100),
              icon: WomanIcon,
              displayFmt: (n) => n + "%",
              sub: `Goal: 50% | ${stats.femaleParticipants.toLocaleString()} participants`,
              tip: "Percentage of female participants",
              pace: true,
              paceA: Math.round((stats.femaleParticipants / stats.totalParticipants) * 100),
              paceT: 50,
            },
            {
              label: "Completion Rate",
              num: 95,
              icon: Target,
              displayFmt: (n) => n + "%",
              sub: `Goal: 90% | Average across sessions`,
              tip: "Percentage of participants who completed sessions",
              pace: true,
              paceA: 95,
              paceT: 90,
            },
            {
              label: "Quality Score",
              num: parseFloat(stats.avgRating),
              icon: Briefcase,
              displayFmt: (n) => n.toFixed(1),
              sub: `Goal: 4.0+ | Out of 5`,
              tip: "Average participant satisfaction rating",
              pace: true,
              paceA: parseFloat(stats.avgRating) * 20,
              paceT: 80,
            },
            {
              label: "Partnerships",
              num: 63,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: 100+ | Cross-sector collaborations`,
              tip: "Number of partner organizations",
              pace: true,
              paceA: 63,
              paceT: 100,
            },
            {
              label: "Sessions Held",
              num: 20,
              icon: TrendingUp,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Goal: 50 | Career exposure events`,
              tip: "Total unique sessions delivered",
              pace: true,
              paceA: 20,
              paceT: 50,
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
            {filtersOpen && (
              <FilterDropdown
                filterGroups={[
                  {
                    label: "Year",
                    options: ["All Years", "2021", "2022", "2023", "2024", "2025", "2026"],
                    value: filterYear,
                    onChange: (v) => setFilterYear(String(v)),
                  },
                ]}
                onClose={() => setFiltersOpen(false)}
              />
            )}
          </div>
        </div>

        {show("Reach & Engagement") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Reach & Engagement
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Session participation and audience growth</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Session Trend" subtitle="Annual session delivery" info="Annual trend of sessions delivered" filterOptions={["All Years", "2021", "2022", "2023", "2024", "2025", "2026"]} filterValue={filterYear} onFilterChange={setFilterYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={sessionTrendData} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="sessions" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Sessions by Type" subtitle="Distribution across formats">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sessionTypeData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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

              <Panel title="Gender Distribution" subtitle="Participant demographics">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={participantData} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#479BD6" }} /> Participants</span>
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
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Session completion and participant satisfaction</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Completion Rates" subtitle="Success rates by session type">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={completionData} margin={{ top: 25, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="completion" fill="#10B981" barSize={46} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="completion" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#10B981" }} /> Completion %</span>
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
