"use client";
import { ChartTip } from "@/components/ui/hent";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import HeaderDesign from "@/components/layout/header-design";
import { studyTrips } from "@/data/study-trips";
import { founders } from "@/data/founders";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { Award, Briefcase, Handshake, Heart, Lightbulb, MapPin, Presentation, Rocket, Sparkles, TrendingUp, Users, Zap, Info, type LucideIcon, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, LabelList, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// Color palette - HENT green (matching venture-funding page)
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
function fmt$K(n: number) {
  const dollars = n * 1000;
  return fmt$(dollars);
}
function sg(s: string) {
  if (s === "Ideation" || s === "Validation") return "Expose";
  if (s === "Prototype/MVP" || s === "Early Growth") return "Build";
  return "Scale";
}
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// ──────────────────────────────────────────────────────────
// Stats Panel Component
// ──────────────────────────────────────────────────────────

function StatsPanel({
  title,
  description,
  cards
}: {
  title: string
  description?: string
  cards: Array<{ label: string; num: number; sub?: string; icon: LucideIcon; displayFmt?: (n: number) => string; tip?: string }>
}) {
  return (
    <div>
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
              {title}
            </p>
            {description && <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>{description}</p>}
          </div>
        </div>
      </div>

      {/* Horizontal Card Row - single row, flex, no wrap */}
      <div style={{
        display: "flex",
        gap: 12,
        overflowX: cards.length > 6 ? "auto" : "visible",
        overflowY: "hidden",
        paddingBottom: cards.length > 6 ? 8 : 0,
        marginBottom: 24,
      }}>
        {cards.map((card, idx) => (
          <div key={idx} style={{
            flex: cards.length <= 6 ? "1 1 0" : "0 0 auto",
            minWidth: cards.length > 6 ? 180 : 0,
            minHeight: 0,
          }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: 6,
              padding: "14px 16px",
              textAlign: "center",
              border: `1px solid ${LIGHT_BORDER}`,
              borderLeft: `5px solid ${BRAND}`,
              position: "relative",
              overflow: "visible",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: BRAND_DK }}>
                  {card.label}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <card.icon size={18} style={{ color: BRAND_DK, opacity: 0.85, flexShrink: 0 }} />
                <p style={{ fontSize: 24, fontWeight: 700, color: BRAND_DK, lineHeight: 1 }}>
                  {card.displayFmt ? card.displayFmt(card.num) : Math.round(card.num).toLocaleString()}
                </p>
              </div>
              {card.sub && <p style={{ fontSize: 9.5, color: `rgba(14, 70, 51, 0.55)`, marginTop: 4 }}>{card.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Panel Component for Charts
// ──────────────────────────────────────────────────────────

function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void }) {
  const [tip, setTip] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 6, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
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
                borderRadius: 6,
                border: `1px solid ${LIGHT_BORDER}`,
                backgroundColor: LIGHT_GREEN,
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
                borderRadius: 6,
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
                      border: "none",
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

// ──────────────────────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────────────────────

export default function HENTOverview() {
  const categories = [
    "Reach & Participation",
    "Innovation Pipeline",
    "Ventures & Enterprise",
    "Funding",
    "Employment Outcomes",
    "Quality & Satisfaction"
  ];

  // Section filter state (local state instead of URL params for immediate reactivity)
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const show = (category: string) => activeCategory === category;

  // Chart filter states (independent per chart)
  const [filterReachYear, setFilterReachYear] = useState("All Years");
  const [filterReachGenderYear, setFilterReachGenderYear] = useState("All Years");
  const [filterInnovationYear, setFilterInnovationYear] = useState("All Years");
  const [filterInnovationFunnelYear, setFilterInnovationFunnelYear] = useState("All Years");
  const [filterVenturesYear, setFilterVenturesYear] = useState("All Years");
  const [filterVenturesFemaleYear, setFilterVenturesFemaleYear] = useState("All Years");
  const [filterFundingYear, setFilterFundingYear] = useState("All Years");
  const [filterFundingTrendYear, setFilterFundingTrendYear] = useState("All Years");
  const [filterEmploymentYear, setFilterEmploymentYear] = useState("All Years");
  const [filterEmploymentTrendYear, setFilterEmploymentTrendYear] = useState("All Years");
  const [filterQualityYear, setFilterQualityYear] = useState("All Years");
  const [filterQualityInclusionYear, setFilterQualityInclusionYear] = useState("All Years");

  // Aggregations
  const hackPart = hackathons.reduce((s, h) => s + h.participants, 0);
  const hackStart = hackathons.reduce((s, h) => s + h.startupsCreated, 0);
  const hackProjects = hackathons.reduce((s, h) => s + h.projects, 0);

  const TOTAL_PART = hackPart + masterclasses.reduce((s, m) => s + m.attendees, 0) +
                     studyTrips.reduce((s, v) => s + v.participants, 0) +
                     mentorshipPrograms.reduce((s, m) => s + m.fellows, 0);
  const TOTAL_FEM = hackathons.reduce((s, h) => s + h.femaleCount, 0) +
                    masterclasses.reduce((s, m) => s + m.femaleAttendees, 0) +
                    studyTrips.reduce((s, v) => s + v.femaleParticipants, 0);
  const FEMALE_PCT = TOTAL_PART ? Math.round((TOTAL_FEM / TOTAL_PART) * 100) : 0;

  const TOTAL_JOBS = ALL_VENTURES.reduce((s, v) => s + v.jobsTotal, 0);
  const TOTAL_JOBS_YOUTH = ALL_VENTURES.reduce((s, v) => s + v.jobsYouth, 0);
  const TOTAL_FUNDING = ALL_VENTURES.reduce((s, v) => s + v.funding, 0);
  const TOTAL_PSHIP = ALL_VENTURES.reduce((s, v) => s + v.partnerships, 0);

  const npsScores = founders.map(f => f.npsScore);
  const promoters = npsScores.filter(s => s >= 9).length;
  const detractors = npsScores.filter(s => s <= 6).length;
  const NPS_SCORE = npsScores.length ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0;

  const fundsCharitable = ALL_VENTURES.filter(v => v.fundType === "Charitable").reduce((s, v) => s + v.funding, 0);
  const fundsVentureF = ALL_VENTURES.filter(v => v.fundType === "Venture Fund").reduce((s, v) => s + v.funding, 0);
  const fundsCatalytic = ALL_VENTURES.filter(v => v.fundType === "Catalytic").reduce((s, v) => s + v.funding, 0);

  const recommendedVentures = ALL_VENTURES.filter(v => v.recommended).length;
  const acceleratorVentures = ALL_VENTURES.filter(v => v.accelerator).length;
  const acceleratorPct = ALL_VENTURES.length ? Math.round((acceleratorVentures / ALL_VENTURES.length) * 100) : 0;

  const pwdCount = founders.filter(f => f.isPWD).length;
  const refugeeCount = founders.filter(f => f.isRefugee).length;
  const mcfCount = founders.filter(f => f.isMCFScholar).length;

  const femaleVentures = ALL_VENTURES.filter(v => v.teamGender === "Female").length;
  const activeVentures = ALL_VENTURES.filter(v => v.status === "Active").length;
  const venturesFunded = ALL_VENTURES.filter(v => v.funding > 0).length;

  // Charts data
  const cohorts = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort((a, b) => a - b);
  const years = Array.from(new Set(hackathons.map(h => h.year))).sort();

  const femaleAndYouthJobsByYear = cohorts.map(c => {
    const femaleVentures = ALL_VENTURES.filter(v => v.cohort === c && v.teamGender === "Female");
    const femaleJobs = femaleVentures.reduce((s, v) => s + v.jobsTotal, 0);
    const youthJobs = ALL_VENTURES.filter(v => v.cohort === c).reduce((s, v) => s + v.jobsYouth, 0);
    return {
      year: String(c),
      "Female-Led Jobs": femaleJobs,
      "Youth Jobs": youthJobs,
    };
  });

  const stageData = [
    { name: "Expose", value: ALL_VENTURES.filter(v => sg(v.stage) === "Expose").length },
    { name: "Build", value: ALL_VENTURES.filter(v => sg(v.stage) === "Build").length },
    { name: "Scale", value: ALL_VENTURES.filter(v => sg(v.stage) === "Scale").length },
  ];

  const programData = [
    { name: "Hackathons", value: hackPart, fill: GREEN_RAMP[0] },
    { name: "Masterclasses", value: masterclasses.reduce((s, m) => s + m.attendees, 0), fill: GREEN_RAMP[1] },
    { name: "Study Trips", value: studyTrips.reduce((s, v) => s + v.participants, 0), fill: GREEN_RAMP[2] },
    { name: "Mentorship", value: mentorshipPrograms.reduce((s, m) => s + m.fellows, 0), fill: GREEN_RAMP[3] },
  ];

  const fundTypeData = [
    { name: "Charitable", value: fundsCharitable, fill: GREEN_RAMP[0] },
    { name: "Venture Fund", value: fundsVentureF, fill: GREEN_RAMP[1] },
    { name: "Catalytic", value: fundsCatalytic, fill: GREEN_RAMP[2] },
  ];

  const npsData = [
    { range: "Promoters (9-10)", count: promoters, fill: GREEN_RAMP[0] },
    { range: "Passives (7-8)", count: npsScores.filter(s => s >= 7 && s <= 8).length, fill: GREEN_RAMP[2] },
    { range: "Detractors (0-6)", count: detractors, fill: "#EF4444" },
  ];

  return (
    <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
      <PortalNav portal="hent" />

      {/* HEADER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 8, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(45,106,79,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(45,106,79,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>HENT Overview</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>
                Health Entrepreneurship Programme Dashboard
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

        {/* ════ SECTION FILTER PILLS ════ */}
        <div style={{ marginBottom: 32, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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

        {/* ════ REACH & PARTICIPATION ════ */}
        {show("Reach & Participation") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Reach & Participation"
              description="Programme attendance and participant diversity"
              cards={[
                { label: "Total Participants", num: TOTAL_PART, sub: "Across 4 programmes", icon: Users, tip: "Total participants reached across hackathons, masterclasses, study trips, and mentorship programs." },
                { label: "Female Participants", num: FEMALE_PCT, displayFmt: (n) => `${Math.round(n)}%`, sub: "Of total reach", icon: Sparkles, tip: `${TOTAL_FEM.toLocaleString()} female participants.` },
                { label: "MCF Scholars", num: mcfCount, sub: "Mission students", icon: Award, tip: "Mission (degree) student participants in HENT programmes." },
                { label: "PWD Participants", num: pwdCount, sub: "Persons with disability", icon: Heart, tip: "Programme participants with disabilities." },
                { label: "Refugee Participants", num: refugeeCount, sub: "Refugees & IDPs", icon: Handshake, tip: "Refugee and internally displaced person participants." },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Participants by Programme" subtitle="Distribution across programme types" filterOptions={["All Years", ...years.map(String)]} filterValue={filterReachYear} onFilterChange={setFilterReachYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={programData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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
              <Panel title="Participants by Programme" subtitle="Distribution across programme types" filterOptions={["All Years", ...years.map(String)]} filterValue={filterReachYear} onFilterChange={setFilterReachYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={programData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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

        {/* ════ INNOVATION PIPELINE ════ */}
        {show("Innovation Pipeline") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Innovation Pipeline"
              description="Hackathon funnel and venture progression"
              cards={[
                { label: "Projects Developed", num: hackProjects, sub: "From hackathons", icon: Lightbulb, tip: "Projects created through hackathon initiatives." },
                { label: "Startups Created", num: hackStart, sub: "From projects", icon: Rocket, tip: "Startups spun out of hackathon projects." },
                { label: "Recommended Ventures", num: recommendedVentures, sub: "High-performing", icon: Award, tip: "Ventures meeting performance and stage criteria for investment readiness." },
                { label: "In Accelerators", num: acceleratorPct, displayFmt: (n) => `${Math.round(n)}%`, sub: `${acceleratorVentures} ventures`, icon: Rocket, tip: "Share of portfolio ventures in external accelerator programs." },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Innovation Funnel" subtitle="Hackathon participants through to ventures" filterOptions={["All Years", ...years.map(String)]} filterValue={filterInnovationFunnelYear} onFilterChange={setFilterInnovationFunnelYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Participants", value: hackPart },
                    { name: "Projects", value: hackProjects },
                    { name: "Startups", value: hackStart },
                    { name: "Portfolio", value: ALL_VENTURES.length },
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
              <Panel title="Ventures by Stage" subtitle="Development stage distribution" filterOptions={["All Years", ...years.map(String)]} filterValue={filterInnovationYear} onFilterChange={setFilterInnovationYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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

        {/* ════ VENTURES & ENTERPRISE ════ */}
        {show("Ventures & Enterprise") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Ventures & Enterprise"
              description="Portfolio size and venture characteristics"
              cards={[
                { label: "Active Ventures", num: activeVentures, sub: "In portfolio", icon: Rocket, tip: "Number of ventures currently active in the HENT portfolio." },
                { label: "Ventures Funded", num: venturesFunded, sub: `of ${ALL_VENTURES.length} total`, icon: Briefcase, tip: "Ventures that have received HENT funding." },
                { label: "Female-Led Ventures", num: femaleVentures, sub: "Female-founded", icon: Sparkles, tip: "Ventures with female-identified founders or co-founders." },
                { label: "Partnerships Built", num: TOTAL_PSHIP, sub: "Cross-sector", icon: Handshake, tip: "Partnership agreements formed by HENT ventures." },
                { label: "Avg Jobs per Venture", num: Math.round(TOTAL_JOBS / ALL_VENTURES.length), sub: "Employment intensity", icon: Briefcase },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Venture Stage Pipeline" subtitle="Distribution across Expose · Build · Scale" filterOptions={["All Years", ...years.map(String)]} filterValue={filterVenturesYear} onFilterChange={setFilterVenturesYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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
              <Panel title="Female-Led Ventures Trend" subtitle="Year-over-year progress" filterOptions={["All Years", ...years.map(String)]} filterValue={filterVenturesFemaleYear} onFilterChange={setFilterVenturesFemaleYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cohorts.map(c => ({ year: String(c), count: ALL_VENTURES.filter(v => v.cohort === c && v.teamGender === "Female").length }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="count" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Female-Led" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ FUNDING ════ */}
        {show("Funding") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Funding"
              description="Capital deployment across fund types"
              cards={[
                { label: "Funding Deployed", num: TOTAL_FUNDING, displayFmt: (n) => fmt$K(Math.round(n)), sub: "Total capital", icon: Zap, tip: "Total funding deployed across ventures." },
                { label: "Revenue Generated", num: ALL_VENTURES.reduce((s, v) => s + v.revenue, 0), displayFmt: (n) => fmt$K(Math.round(n)), sub: "Venture revenue", icon: Zap },
                { label: "Charitable Fund", num: fundsCharitable, displayFmt: (n) => fmt$K(Math.round(n)), sub: "Charitable capital", icon: Heart },
                { label: "Venture Fund", num: fundsVentureF, displayFmt: (n) => fmt$K(Math.round(n)), sub: "VC-style capital", icon: Rocket },
                { label: "Catalytic Fund", num: fundsCatalytic, displayFmt: (n) => fmt$K(Math.round(n)), sub: "Catalytic capital", icon: TrendingUp },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Capital by Fund Type" subtitle="Charitable, Venture, and Catalytic" filterOptions={["All Years", ...years.map(String)]} filterValue={filterFundingYear} onFilterChange={setFilterFundingYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart layout="vertical" data={fundTypeData} margin={{ top: 4, right: 36, bottom: 0, left: 8 }} barSize={16} barCategoryGap="20%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9CA3AF" }} tickFormatter={(v) => fmt$(v)} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={104} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={GREEN} radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} formatter={(v: number) => fmt$(v)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Funding Trend" subtitle="Capital deployed over time" filterOptions={["All Years", ...years.map(String)]} filterValue={filterFundingTrendYear} onFilterChange={setFilterFundingTrendYear}>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={cohorts.map(c => ({ year: String(c), funding: ALL_VENTURES.filter(v => v.cohort === c && v.funding > 0).reduce((s, v) => s + v.funding, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="funding" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Funding Deployed" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ EMPLOYMENT OUTCOMES ════ */}
        {show("Employment Outcomes") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Employment Outcomes"
              description="Jobs created and youth employment focus"
              cards={[
                { label: "Jobs Created", num: TOTAL_JOBS, sub: "By all ventures", icon: Briefcase, tip: "Total employment generated by HENT-supported ventures." },
                { label: "Youth Jobs Created", num: TOTAL_JOBS_YOUTH, sub: "For youth participants", icon: Users, tip: "Jobs specifically created for youth (≤35 years)." },
                { label: "Youth Jobs %", num: TOTAL_JOBS > 0 ? Math.round((TOTAL_JOBS_YOUTH / TOTAL_JOBS) * 100) : 0, displayFmt: (n) => `${Math.round(n)}%`, sub: "Of total jobs", icon: TrendingUp, tip: `${TOTAL_JOBS_YOUTH} of ${TOTAL_JOBS} total jobs.` },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Female-Led & Youth Jobs" subtitle="Employment by female-led ventures and youth" filterOptions={["All Years", ...years.map(String)]} filterValue={filterEmploymentYear} onFilterChange={setFilterEmploymentYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={femaleAndYouthJobsByYear} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Female-Led Jobs" stackId="jobs" fill={GREEN_RAMP[0]} barSize={26} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Youth Jobs" stackId="jobs" fill={GREEN_RAMP[2]} barSize={26} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Job Creation Trend" subtitle="Growth over time" filterOptions={["All Years", ...years.map(String)]} filterValue={filterEmploymentTrendYear} onFilterChange={setFilterEmploymentTrendYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cohorts.map(c => ({ year: String(c), jobs: ALL_VENTURES.filter(v => v.cohort === c).reduce((s, v) => s + v.jobsTotal, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="jobs" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Jobs Created" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ QUALITY & SATISFACTION ════ */}
        {show("Quality & Satisfaction") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Quality & Satisfaction"
              description="Founder engagement and programme quality"
              cards={[
                { label: "NPS Score", num: NPS_SCORE, displayFmt: (n) => String(Math.round(n)), sub: "Founder satisfaction", icon: TrendingUp, tip: "Net Promoter Score from founder satisfaction surveys (2022-2026)." },
                { label: "Promoters", num: promoters, sub: "Score 9-10", icon: Award, tip: `${promoters} founders are promoters (NPS 9-10).` },
                { label: "Passives", num: npsScores.filter(s => s >= 7 && s <= 8).length, sub: "Score 7-8", icon: Heart },
                { label: "Detractors", num: detractors, sub: "Score 0-6", icon: Handshake, tip: `${detractors} founders are detractors (NPS 0-6).` },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="NPS Distribution" subtitle="Founder satisfaction breakdown" filterOptions={["All Years", ...years.map(String)]} filterValue={filterQualityYear} onFilterChange={setFilterQualityYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={npsData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="count" barSize={46} radius={[4, 4, 0, 0]}>
                      {npsData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.fill} />)}
                      <LabelList dataKey="count" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Founder Satisfaction Breakdown" subtitle="NPS distribution" filterOptions={["All Years", ...years.map(String)]} filterValue={filterQualityYear} onFilterChange={setFilterQualityYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={npsData} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="count" barSize={46} radius={[4, 4, 0, 0]}>
                      {npsData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.fill} />)}
                      <LabelList dataKey="count" position="top" fontSize={11} fill={BRAND_DK} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <PortalFooter portal="hent" synced="01 Jun 2026, EAT" />

      </div>
    </div>
  );
}
