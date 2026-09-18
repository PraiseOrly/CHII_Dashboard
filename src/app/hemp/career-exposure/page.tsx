"use client";
import { ChartTip, HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { healthXSessions, HX_TYPES, ORG_TYPES } from "@/data/hemp/healthx";
import { healthXSymposia } from "@/data/hemp/healthx-careers";
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

export default function HEMPCareerExposure() {
  const categories = ["Reach & Engagement", "Quality & Experience", "Partnerships & Expansion"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterType, setFilterType] = useState("All");

  const show = (category: string) => activeCategory === category;
  const activeFilterCount = [filterYear !== "All Years", filterType !== "All"].filter(Boolean).length;

  const years = Array.from(new Set(healthXSessions.map(i => i.year))).sort();

  const filteredSessions = useMemo(() => {
    return healthXSessions.filter(s => {
      if (filterYear !== "All Years" && s.year !== parseInt(filterYear)) return false;
      if (filterType !== "All" && s.type !== filterType) return false;
      return true;
    });
  }, [filterYear, filterType]);

  const totalParticipants = filteredSessions.reduce((s, h) => s + h.participants, 0);
  const femaleParticipants = filteredSessions.reduce((s, h) => s + h.femalePart, 0);
  const femalePct = totalParticipants ? Math.round((femaleParticipants / totalParticipants) * 100) : 0;
  const avgCompletion = filteredSessions.length ? Math.round(filteredSessions.reduce((s, h) => s + h.completionRate, 0) / filteredSessions.length) : 0;
  const totalPartnerships = filteredSessions.reduce((s, h) => s + h.partnerships, 0);
  const avgScore = filteredSessions.length ? parseFloat((filteredSessions.reduce((s, h) => {
    const scores = Object.values(h.scores);
    return s + scores.reduce((a, b) => a + b, 0) / scores.length;
  }, 0) / filteredSessions.length).toFixed(1)) : 0;

  const [filterEngageYear, setFilterEngageYear] = useState("All Years");
  const [filterQualityYear, setFilterQualityYear] = useState("All Years");

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Career Exposure</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Health facility visits, innovation exposure and sector engagement
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(120,180,240,0.8)", fontWeight: 600 }}>Period:</span> 2021–2025</span>
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
              label: "Total Participants",
              num: totalParticipants,
              icon: Users,
              displayFmt: (n) => n.toLocaleString(),
              sub: `From ${filteredSessions.length} sessions`,
              tip: "Total students reached through Career Exposure sessions",
              pace: true,
              paceA: totalParticipants,
              paceT: 500,
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
              label: "Completion Rate",
              num: avgCompletion,
              icon: Target,
              displayFmt: (n) => n + "%",
              sub: `Average across sessions`,
              tip: "Average session completion rate",
              pace: true,
              paceA: avgCompletion,
              paceT: 100,
            },
            {
              label: "Learning Quality",
              num: avgScore,
              icon: Briefcase,
              displayFmt: (n) => n.toFixed(1),
              sub: `Out of 5`,
              tip: "Average satisfaction/quality score",
              pace: true,
              paceA: avgScore * 20,
              paceT: 100,
            },
            {
              label: "Partnerships Built",
              num: totalPartnerships,
              icon: TrendingUp,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Cross-sector collaborations`,
              tip: "Total partnerships built through sessions",
              pace: true,
              paceA: totalPartnerships,
              paceT: 80,
            },
            {
              label: "Sessions Held",
              num: filteredSessions.length,
              icon: Briefcase,
              displayFmt: (n) => n.toLocaleString(),
              sub: `Unique Career Exposure events`,
              tip: "Number of Career Exposure sessions organised",
              pace: true,
              paceA: filteredSessions.length,
              paceT: 40,
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
                setFilterType("All");
              }}
            >
              {[
                { label: "Year", value: filterYear, setValue: setFilterYear, options: ["All Years", ...years.map(String)] },
                { label: "Session Type", value: filterType, setValue: setFilterType, options: ["All", ...HX_TYPES] },
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
              <Panel title="Participants per Year" subtitle="Annual participation trend" info="Total students reached through Career Exposure sessions by year" filterOptions={["All Years", ...years.map(String)]} filterValue={filterEngageYear} onFilterChange={setFilterEngageYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), participants: filteredSessions.filter(s => s.year === y).reduce((t, s) => t + s.participants, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="participants" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Participants" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Sessions by Type" subtitle="Distribution across session formats" info="Number of sessions by type (facility visits, challenges, etc.)">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={HX_TYPES.map(t => ({
                      name: t,
                      count: filteredSessions.filter(s => s.type === t).length,
                    })).sort((a, b) => b.count - a.count)} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 100 }} barCategoryGap="12%">
                      <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                      <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                      <Bar dataKey="count" fill={BRAND} radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="count" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} offset={5} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Gender Breakdown" subtitle="Female and male participation" info="Percentage of female vs male participants">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Female", value: femaleParticipants },
                    { name: "Male", value: totalParticipants - femaleParticipants },
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
              <Panel title="Sessions per Year" subtitle="Session delivery frequency" info="Number of Career Exposure sessions held each year">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={years.map(y => ({ year: String(y), sessions: filteredSessions.filter(s => s.year === y).length }))} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="sessions" fill="#7FA5D6" barSize={46} radius={[4, 4, 0, 0]} name="Sessions">
                      <LabelList dataKey="sessions" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Learning outcomes and participant satisfaction</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Completion Rates" subtitle="Session completion by type" info="Average completion rate by session type (1-5)" filterOptions={["All Years", ...years.map(String)]} filterValue={filterQualityYear} onFilterChange={setFilterQualityYear}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={HX_TYPES.map(t => ({
                    name: t,
                    completion: filteredSessions.filter(s => s.type === t).length ? Math.round(filteredSessions.filter(s => s.type === t).reduce((a, s) => a + s.completionRate, 0) / filteredSessions.filter(s => s.type === t).length) : 0,
                  })).sort((a, b) => b.completion - a.completion)} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 100 }} barCategoryGap="12%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="completion" fill="#479BD6" radius={[0, 4, 4, 0]} name="Completion %">
                      <LabelList dataKey="completion" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Session Quality Trend" subtitle="Average satisfaction over time" info="Average learning experience and practical relevance scores">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({
                    year: String(y),
                    score: filteredSessions.filter(s => s.year === y).length ? parseFloat((filteredSessions.filter(s => s.year === y).reduce((a, s) => {
                      const scores = Object.values(s.scores);
                      return a + scores.reduce((x, z) => x + z, 0) / scores.length;
                    }, 0) / filteredSessions.filter(s => s.year === y).length).toFixed(1)) : 0
                  }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="score" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Quality Score" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Career Exposure Quality Ratings" subtitle="Participant perception of programme quality" info="Average ratings for relevance, quality, and usefulness (1-5 scale)">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { dimension: "Relevance", score: healthXSymposia.length ? parseFloat((healthXSymposia.reduce((s, h) => s + h.relevanceScore, 0) / healthXSymposia.length).toFixed(2)) : 0 },
                    { dimension: "Quality", score: healthXSymposia.length ? parseFloat((healthXSymposia.reduce((s, h) => s + h.qualityScore, 0) / healthXSymposia.length).toFixed(2)) : 0 },
                    { dimension: "Usefulness", score: healthXSymposia.length ? parseFloat((healthXSymposia.reduce((s, h) => s + h.usefulnessScore, 0) / healthXSymposia.length).toFixed(2)) : 0 },
                  ]} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="dimension" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 5]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Bar dataKey="score" fill="#1D9E75" barSize={40} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="score" position="top" fontSize={10} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Confidence & Recommendation" subtitle="Participant confidence and likelihood to recommend" info="Confidence in applying skills (1-5) and recommendation score (0-10)">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={years.map(y => {
                    const yearSymposia = healthXSymposia.filter(s => s.year === y);
                    return {
                      year: String(y),
                      confidence: yearSymposia.length ? parseFloat((yearSymposia.reduce((s, h) => s + h.confidenceScore, 0) / yearSymposia.length).toFixed(1)) : 0,
                      recommendation: yearSymposia.length ? parseFloat((yearSymposia.reduce((s, h) => s + h.recommendationScore, 0) / yearSymposia.length).toFixed(1)) : 0,
                    };
                  })} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%" barGap={2}>
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 10]} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 9, paddingTop: 12 }} />
                    <Bar dataKey="confidence" fill="#479BD6" radius={[4, 4, 0, 0]} maxBarSize={20} name="Confidence (1-5)" />
                    <Bar dataKey="recommendation" fill="#7FA5D6" radius={[4, 4, 0, 0]} maxBarSize={20} name="Recommend (0-10)" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {show("Partnerships & Expansion") && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
                    Partnerships & Expansion
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>Partner engagement and collaboration growth</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Partnerships by Organization Type" subtitle="Distribution across partner types" info="Number of partnerships built with different organization types">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ORG_TYPES.map(t => ({
                      name: t,
                      count: filteredSessions.filter(s => s.orgType === t).reduce((a, s) => a + s.partnerships, 0),
                    })).sort((a, b) => b.count - a.count)} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 150 }} barCategoryGap="12%">
                      <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} width={140} />
                      <Tooltip content={<ChartTip hideLabel />} cursor={{ fill: "rgba(16, 44, 94, 0.04)" }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="count" fill={BRAND} radius={[0, 4, 4, 0]} name="Partnerships">
                        <LabelList dataKey="count" position="right" fontSize={10} fill={BRAND_DK} fontWeight={700} offset={5} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Partnership Growth" subtitle="Cumulative partnerships over time" info="Year-on-year partnership development trend">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), partnerships: filteredSessions.filter(s => s.year === y).reduce((a, s) => a + s.partnerships, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="partnerships" stroke="#479BD6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Partnerships" />
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
