"use client";
import { FilterSelect } from "@/components/ui/executive";
import { ChartTip } from "@/components/ui/executive";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Info, GraduationCap, BookOpen, Wallet,
  SlidersHorizontal, X, Globe, MapPin, TrendingUp,
} from "lucide-react";
import {
  FE_STUDENTS, GENDERS, QUALIFICATIONS, FIELDS, FUNDING_SOURCES, DESTINATIONS,
  RELEVANCE, COUNTRIES, PROGRAMMES, YEARS,
  type Gender,
} from "@/data/executive/further-education";
import FeaturedImpactStory from "@/components/layout/featured-impact-story";
import HeaderDesign from "@/components/layout/header-design";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import { DonutRing as Donut } from "@/components/charts/donut-chart";

/* ── palette ─────────────────────────────────────────── */
const NAVY = "#14306B";
const BAND = "#14306B";
const TICK = "#D17A86";
const PALETTE = ["#102C5E", "#479BD6", "#D45F2C", "#A81B2D", "#102C5E", "#D17A86", "#C5D2E0"];
const GENDER_COLOR: Record<string, string> = { Female: "#102C5E", Male: "#479BD6", "Non-binary": "#D45F2C" };
const C_ACCENT = "#102C5E";
const FUNDING_COLOR: Record<string, string> = {
  "Scholarship / funded": "#102C5E", "Self-funded": "#479BD6", "Employer": "#D45F2C", "Loan": "#A81B2D",
};

/* ── helpers ─────────────────────────────────────────── */
const fmt = (n: number) => Math.round(n).toLocaleString();
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const countBy = (rows: { [k: string]: any }[], key: string, order: string[]) =>
  order.map(name => ({ name, value: rows.filter(r => r[key] === name).length })).filter(d => d.value > 0);

/* ♀ woman / female symbol icon — matches the Entrepreneurship page */
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

/* ════════════════════════════════════════════════════════
   Shared UI
═══════════════════════════════════════════════════════ */
function SectionHeader({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
      <span style={{ width: 4, height: 16, borderRadius: 999, backgroundColor: TICK, flexShrink: 0, alignSelf: "center" }} />
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: NAVY, letterSpacing: "0.01em" }}>{title}</h2>
        <p style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{blurb}</p>
      </div>
    </div>
  );
}


/* light section KPI strip card — white, blue border */
function MiniKpi({ Icon, label, value, center }: { Icon: React.ComponentType<any>; label: string; value: string; center?: boolean }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${C_ACCENT}`, padding: "13px 15px", display: "flex", flexDirection: center ? "column" : "row", alignItems: "center", justifyContent: "center", gap: center ? 7 : 11, textAlign: center ? "center" : "left" }}>
      <span style={{ width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={C_ACCENT} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 21, fontWeight: 800, color: NAVY, lineHeight: 1.05 }}>{value}</p>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, info, children }: {
  title: string; subtitle: string; info?: string; children: React.ReactNode;
}) {
  const [tip, setTip] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      <div style={{ backgroundColor: BAND, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: TICK, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
              {info && (
                <span style={{ position: "relative", display: "flex", cursor: "pointer" }}
                  onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
                  <Info size={11} color="rgba(181,212,244,0.85)" />
                  {tip && (
                    <span style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10.5, fontWeight: 400, textTransform: "none", letterSpacing: 0, lineHeight: 1.5, padding: "8px 11px", borderRadius: 7, width: 210, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
                      {info}
                    </span>
                  )}
                </span>
              )}
            </div>
            <p style={{ fontSize: 9.5, color: "rgba(181,212,244,0.7)", marginTop: 1 }}>{subtitle}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>{children}</div>
    </div>
  );
}


function RankBar({ data, color = BAND, width = 130, legend = false }: { data: { name: string; value: number }[]; color?: string; width?: number; legend?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 32) + (legend ? 24 : 0)}>
      <BarChart layout="vertical" data={data} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={width} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
        {legend && <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />}
        <Bar dataKey="value" name="Graduates" fill={color} radius={[0, 4, 4, 0]} barSize={16}>
          <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function FurtherEducationPage() {
  const [gender, setGender] = useState<"all" | Gender>("all");
  const [scholar, setScholar] = useState<"all" | "scholar" | "non">("all");
  const [qualification, setQualification] = useState<string>("all");
  const [field, setField] = useState<string>("all");
  const [funding, setFunding] = useState<string>("all");
  const [destination, setDestination] = useState<string>("all");
  const [year, setYear] = useState<"all" | number>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const scope = useMemo(() =>
    FE_STUDENTS.filter(s => {
      if (gender !== "all" && s.gender !== gender) return false;
      if (scholar === "scholar" && !s.scholar) return false;
      if (scholar === "non" && s.scholar) return false;
      if (qualification !== "all" && s.qualification !== qualification) return false;
      if (field !== "all" && s.field !== field) return false;
      if (funding !== "all" && s.funding !== funding) return false;
      if (destination !== "all" && s.destination !== destination) return false;
      if (year !== "all" && s.year !== year) return false;
      return true;
    }),
  [gender, scholar, qualification, field, funding, destination, year]);

  const TOTAL = scope.length;
  const activeCount = [gender, scholar, qualification, field, funding, destination, year].filter(v => v !== "all").length;
  const reset = () => { setGender("all"); setScholar("all"); setQualification("all"); setField("all"); setFunding("all"); setDestination("all"); setYear("all"); };

  const d = useMemo(() => {
    const enrolled = scope.filter(s => s.active).length;
    const within = scope.filter(s => s.destination === "Within Africa").length;
    const countriesOfStudy = new Set(scope.map(s => s.countryOfStudy)).size;

    const genderData = countBy(scope, "gender", ["Female", "Male"]);
    const cohortRate = [
      { name: "All Talents", value: 7, pct: true },
      { name: "Scholars", value: 17, pct: true },
    ];
    const activeCompleted = [
      { name: "Active", value: enrolled },
      { name: "Completed", value: TOTAL - enrolled },
    ];
    const origin = countBy(scope, "country", COUNTRIES).sort((a, b) => b.value - a.value);
    const programme = countBy(scope, "programme", PROGRAMMES).sort((a, b) => b.value - a.value);
    const qualification = countBy(scope, "qualification", QUALIFICATIONS.filter(q => q !== "Bachelor's top-up"));
    const fieldData = countBy(scope, "field", FIELDS).sort((a, b) => b.value - a.value);
    const relevance = countBy(scope, "relevance", RELEVANCE);
    const region = countBy(scope, "destination", DESTINATIONS);
    const countryStudy = Object.entries(
      scope.reduce((acc: Record<string, number>, s) => { acc[s.countryOfStudy] = (acc[s.countryOfStudy] || 0) + 1; return acc; }, {})
    ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const fundingData = countBy(scope, "funding", FUNDING_SOURCES);
    const fundingByQual = QUALIFICATIONS.map(q => {
      const rows = scope.filter(s => s.qualification === q);
      const rec: Record<string, number | string> = { name: q };
      FUNDING_SOURCES.forEach(f => { rec[f] = rows.filter(s => s.funding === f).length; });
      return rec;
    }).filter(r => FUNDING_SOURCES.some(f => (r[f] as number) > 0));
    const qualByProgramme = PROGRAMMES.map(p => {
      const rows = scope.filter(s => s.programme === p);
      const rec: Record<string, number | string> = { name: p };
      QUALIFICATIONS.forEach(q => { rec[q] = rows.filter(s => s.qualification === q).length; });
      return rec;
    });
    let cum = 0;
    const trend = YEARS.map(yr => { cum += scope.filter(s => s.year === yr).length; return { year: yr, value: cum }; });

    return {
      enrolled, within, abroad: TOTAL - within, countriesOfStudy,
      femalePct: share(scope.filter(s => s.gender === "Female").length, TOTAL),
      malePct: share(scope.filter(s => s.gender === "Male").length, TOTAL),
      fundedPct: share(scope.filter(s => s.funding === "Scholarship / funded").length, TOTAL),
      scholars: scope.filter(s => s.scholar).length,
      talents: scope.filter(s => !s.scholar).length,
      fundedCount: scope.filter(s => s.funding === "Scholarship / funded").length,
      selfFunded: scope.filter(s => s.funding === "Self-funded").length,
      employer: scope.filter(s => s.funding === "Employer").length,
      countriesRepresented: new Set(scope.map(s => s.country)).size,
      genderData, cohortRate, activeCompleted, origin, programme, qualification, fieldData,
      relevance, region, countryStudy, fundingData, fundingByQual, qualByProgramme, trend,
    };
  }, [scope, TOTAL]);

  const renderFilters = () => (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setFiltersOpen(o => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
          border: `1px solid ${activeCount || filtersOpen ? NAVY : "rgba(0,33,71,0.15)"}`,
          backgroundColor: filtersOpen ? NAVY : "white", color: filtersOpen ? "white" : "#374151" }}>
        <SlidersHorizontal size={13} />
        Filters
        {activeCount > 0 && (
          <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: filtersOpen ? "rgba(255,255,255,0.25)" : C_ACCENT, borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>
        )}
      </button>
      {filtersOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50, width: 320, backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.12)", boxShadow: "0 10px 30px rgba(0,0,0,0.14)", overflow: "hidden" }}>
          <div style={{ backgroundColor: BAND, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filters</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {activeCount > 0 && (
                <button onClick={reset} style={{ fontSize: 10, fontWeight: 600, color: "white", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, padding: "3px 8px", backgroundColor: "rgba(255,255,255,0.08)", cursor: "pointer" }}>Reset</button>
              )}
              <button onClick={() => setFiltersOpen(false)} title="Close" style={{ color: "white", display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}><X size={13} /></button>
            </div>
          </div>
          <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FilterSelect label="Gender" value={gender} onChange={setGender}
              options={[{ value: "all" as const, label: "All Genders" }, ...(["Female", "Male"] as Gender[]).map(g => ({ value: g, label: g }))]} />
            <FilterSelect label="Cohort" value={scholar} onChange={setScholar}
              options={[{ value: "all" as const, label: "All Cohorts" }, { value: "scholar" as const, label: "Scholars" }, { value: "non" as const, label: "Non-scholar" }]} />
            <FilterSelect label="Qualification" value={qualification} onChange={setQualification}
              options={[{ value: "all", label: "All Qualifications" }, ...QUALIFICATIONS.map(q => ({ value: q, label: q }))]} />
            <FilterSelect label="Field" value={field} onChange={setField}
              options={[{ value: "all", label: "All Fields" }, ...FIELDS.map(f => ({ value: f, label: f }))]} />
            <FilterSelect label="Funding" value={funding} onChange={setFunding}
              options={[{ value: "all", label: "All Funding" }, ...FUNDING_SOURCES.map(f => ({ value: f, label: f }))]} />
            <FilterSelect label="Destination" value={destination} onChange={setDestination}
              options={[{ value: "all", label: "All Destinations" }, ...DESTINATIONS.map(ds => ({ value: ds, label: ds }))]} />
            <FilterSelect label="Year" value={year} onChange={setYear}
              options={[{ value: "all" as const, label: "All Years" }, ...YEARS.map(y => ({ value: y, label: String(y) }))]} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <HeaderDesign />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Further Study</h1>
            </div>
            <p className="text-[13px] sm:text-sm mt-2 font-medium" style={{ color: "#85B7EB" }}>Further Education, Study Pathways, and Lifelong Learning</p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> CHII MELA Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span>{FE_STUDENTS.length} students tracked</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ OVERVIEW ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="In Further Study" num={TOTAL} sub="graduates" Icon={GraduationCap}
              tooltip="Graduates in further education within the current filters." />
            <StatsKpiCard label="Currently Enrolled" num={d.enrolled} sub="active students" Icon={BookOpen}
              tooltip="Graduates with an active further-education enrolment this cycle." />
            <StatsKpiCard label="Further Study Rate" num={5} displayFmt={(n) => `${Math.round(n)}%`} sub="of all graduates" Icon={TrendingUp}
              tooltip="Share of CHII graduates who progress to further study." />
            <StatsKpiCard label="Female Share" num={d.femalePct} displayFmt={(n) => `${Math.round(n)}%`} sub="of cohort" Icon={WomanIcon}
              tooltip="Share of further-education graduates who are female." />
            <StatsKpiCard label="Scholarship / Funded" num={d.fundedPct} displayFmt={(n) => `${Math.round(n)}%`} sub="funded share" Icon={Wallet}
              tooltip="Share on a scholarship or otherwise funded place." />
            <StatsKpiCard label="Countries of Study" num={d.countriesOfStudy} sub="destinations" Icon={Globe}
              tooltip="Distinct countries where graduates pursue further study." />
          </div>

          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
            {renderFilters()}
          </div>
        </section>

        {/* ════ PARTICIPATION ════ */}
        <section className="space-y-4">
          <SectionHeader title="Participation" blurb="Who continues to further education?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Active vs Completed Programmes" subtitle="Current enrolment status"
              info="Graduates with an active enrolment versus those who have completed their programme.">
              <Donut data={d.activeCompleted} colors={["#102C5E", "#C5D2E0"]} total={TOTAL} totalLabel="Graduates" height={340} legendPercent />
            </Panel>
          </div>
          <Panel title="Enrolment Trend by Year" subtitle="Cumulative enrolments over time"
            info="Further-education enrolments accumulating over time.">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={d.trend} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="feFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C_ACCENT} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={C_ACCENT} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="value" name="Enrolments" stroke={C_ACCENT} strokeWidth={2.5} fill="url(#feFill)" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        {/* ════ STUDENT PROFILE ════ */}
        <section className="space-y-4">
          <SectionHeader title="Student Profile" blurb="Who are the learners?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Gender Distribution" subtitle="Female · Male · Non-binary"
              info="Gender distribution of graduates in further education.">
              <Donut data={d.genderData} colors={GENDER_COLOR} total={TOTAL} totalLabel="Graduates" height={340} legendPercent />
            </Panel>
            <Panel title="Country of Origin" subtitle="Where graduates are from, ranked"
              info="Graduates' countries of origin, sorted from most to least.">
              <RankBar data={d.origin} width={110} />
            </Panel>
          </div>
        </section>

        {/* ════ ACADEMIC PATHWAYS ════ */}
        <section className="space-y-4">
          <SectionHeader title="Academic Pathways" blurb="What qualifications are graduates pursuing?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Qualification Level" subtitle="Type of qualification pursued"
              info="Qualification level graduates are pursuing.">
              <Donut data={d.qualification} colors={PALETTE} total={TOTAL} totalLabel="Graduates" height={340} legendPercent />
            </Panel>
            <Panel title="Field of Study" subtitle="Disciplines, ranked"
              info="Fields of study graduates pursue, sorted from most to least.">
              <RankBar data={d.fieldData} width={150} legend />
            </Panel>
          </div>
          <Panel title="Relevance to ALU Degree" subtitle="How further study relates to the degree"
            info="How closely graduates' further study relates to their ALU degree.">
            <Donut data={d.relevance} colors={["#102C5E", "#479BD6", "#C5D2E0"]} total={TOTAL} totalLabel="Graduates" height={340} legendPercent />
          </Panel>
        </section>

        {/* ════ OUTCOMES & ALIGNMENT ════ */}
        <section className="space-y-4">
          <SectionHeader title="Outcomes & Alignment" blurb="How does further study build on graduates' ALU experience?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Relevance to ALU Degree" subtitle="Directly · Somewhat · Different field"
              info="How closely further study aligns with the ALU degree.">
              <Donut data={d.relevance} colors={["#102C5E", "#479BD6", "#C5D2E0"]} total={TOTAL} totalLabel="Graduates" height={340} legendPercent />
            </Panel>
            <Panel title="Qualification by Degree Programme" subtitle="Qualification mix per programme"
              info="What qualifications graduates from each ALU programme pursue.">
              <ResponsiveContainer width="100%" height={Math.max(240, d.qualByProgramme.length * 44)}>
                <BarChart layout="vertical" data={d.qualByProgramme} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.06)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {QUALIFICATIONS.map((q, i) => (
                    <Bar key={q} dataKey={q} stackId="q" fill={PALETTE[i % PALETTE.length]} barSize={18}
                      radius={i === QUALIFICATIONS.length - 1 ? [0, 4, 4, 0] : undefined} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        <FeaturedImpactStory footer />
      </div>
    </div>
  );
}
