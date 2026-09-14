"use client";
import { ChartTip } from "@/components/ui/hent";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { founders } from "@/data/founders";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { Briefcase, Rocket, Target, TrendingUp, Users, Zap, Info, type LucideIcon, ChevronDown } from "lucide-react";

// Color palette - HENT green (matching overview)
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

function sg(s: string) {
  if (s === "Ideation" || s === "Validation") return "Expose";
  if (s === "Prototype/MVP" || s === "Early Growth") return "Build";
  return "Scale";
}

function paceColor(a: number, t: number): string {
  const pace = 5 / 12;
  const r = t > 0 ? (a / t) / pace : 1;
  if (r >= 1) return "#16A34A";
  if (r >= 0.95) return "#84CC16";
  if (r >= 0.8) return "#F59E0B";
  return "#DC2626";
}

// Constants
const PACE = 5 / 12;
const TARGETS = { ventures: 400, jobs: 2_000, funds: 910_904 } as const;
const ACTUALS = {
  ventures: ALL_VENTURES.filter(v => v.status === "Active").length,
  jobs: ALL_VENTURES.reduce((s, v) => s + v.jobsTotal, 0),
  funds: ALL_VENTURES.reduce((s, v) => s + v.funding, 0)
};

const VENTURE_YEARS = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort((a, b) => a - b);

// Stats Panel Component
function StatsPanel({
  title,
  description,
  cards
}: {
  title: string
  description?: string
  cards: Array<{ label: string; num: number; sub?: string; icon: LucideIcon; displayFmt?: (n: number) => string; tip?: string; pace?: boolean; paceA?: number; paceT?: number }>
}) {
  return (
    <div>
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
              borderRadius: 10,
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
              {card.pace && card.paceA !== undefined && card.paceT !== undefined && (
                <div style={{ height: 4, borderRadius: 2, backgroundColor: LIGHT_BORDER, marginTop: 8, position: "relative" }}>
                  <div style={{
                    height: "100%",
                    borderRadius: 2,
                    width: `${Math.min((card.paceA / card.paceT) * 100, 100)}%`,
                    backgroundColor: paceColor(card.paceA, card.paceT)
                  }} />
                  <div style={{ position: "absolute", top: -2, bottom: -2, width: 2, left: `${PACE * 100}%`, backgroundColor: BRAND_DK, borderRadius: 1 }} />
                </div>
              )}
              {card.sub && <p style={{ fontSize: 9.5, color: `rgba(14, 70, 51, 0.55)`, marginTop: 4 }}>{card.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Panel Component for Charts
function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void }) {
  const [tip, setTip] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
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
                borderRadius: 10,
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

export default function HENTVentures() {
  const categories = ["Growth & Jobs", "Portfolio Composition", "Geography & Engagement", "Portfolio Health"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const show = (category: string) => activeCategory === category;

  // Year filters for each chart
  const [filterGrowthYear, setFilterGrowthYear] = useState("All Years");
  const [filterCompYear, setFilterCompYear] = useState("All Years");
  const [filterGeoYear, setFilterGeoYear] = useState("All Years");
  const [filterHealthYear, setFilterHealthYear] = useState("All Years");

  // Aggregations
  const years = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort();
  const femaleVentures = ALL_VENTURES.filter(v => v.teamGender === "Female").length;
  const activeVentures = ALL_VENTURES.filter(v => v.status === "Active").length;
  const retentionRate = ALL_VENTURES.length ? Math.round((ALL_VENTURES.filter(v => v.status !== "Stalled").length / ALL_VENTURES.length) * 100) : 0;
  const acceleratorVentures = ALL_VENTURES.filter(v => v.accelerator).length;
  const acceleratorPct = ALL_VENTURES.length ? Math.round((acceleratorVentures / ALL_VENTURES.length) * 100) : 0;
  const venturesFunded = ALL_VENTURES.filter(v => v.funding > 0).length;
  const totalPartnerships = ALL_VENTURES.reduce((s, v) => s + v.partnerships, 0);
  const avgJobsPerVenture = ALL_VENTURES.length ? Math.round(ACTUALS.jobs / ALL_VENTURES.length) : 0;
  const totalRevenue = ALL_VENTURES.reduce((s, v) => s + v.revenue, 0);

  return (
    <div style={{ backgroundColor: LIGHT_BG, minHeight: "100vh" }}>
      <PortalNav portal="hent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(45,106,79,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(45,106,79,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Ventures Portfolio</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>
                Portfolio ventures, founders and the jobs, funding and impact they generate
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

        {/* ════ TOP STATS HEADER ════ */}
        <div style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: "14px 16px",
            textAlign: "center",
            border: `1px solid ${LIGHT_BORDER}`,
            borderLeft: `5px solid ${BRAND}`,
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: BRAND_DK, marginBottom: 8 }}>Active Ventures</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: BRAND_DK, margin: 0 }}>{ACTUALS.ventures}</p>
            <p style={{ fontSize: 9, color: BRAND_DK, marginTop: 4 }}>/ {TARGETS.ventures}</p>
            <div style={{ height: 4, borderRadius: 2, backgroundColor: LIGHT_BORDER, marginTop: 8, position: "relative" }}>
              <div style={{
                height: "100%",
                borderRadius: 2,
                width: `${Math.min((ACTUALS.ventures / TARGETS.ventures) * 100, 100)}%`,
                backgroundColor: paceColor(ACTUALS.ventures, TARGETS.ventures)
              }} />
              <div style={{ position: "absolute", top: -1, bottom: -1, width: 2, left: `${PACE * 100}%`, backgroundColor: BRAND_DK, borderRadius: 1 }} />
            </div>
          </div>
          <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: "14px 16px",
            textAlign: "center",
            border: `1px solid ${LIGHT_BORDER}`,
            borderLeft: `5px solid ${BRAND}`,
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: BRAND_DK, marginBottom: 8 }}>Jobs Created</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: BRAND_DK, margin: 0 }}>{ACTUALS.jobs.toLocaleString()}</p>
            <p style={{ fontSize: 9, color: BRAND_DK, marginTop: 4 }}>/ {TARGETS.jobs.toLocaleString()}</p>
            <div style={{ height: 4, borderRadius: 2, backgroundColor: LIGHT_BORDER, marginTop: 8, position: "relative" }}>
              <div style={{
                height: "100%",
                borderRadius: 2,
                width: `${Math.min((ACTUALS.jobs / TARGETS.jobs) * 100, 100)}%`,
                backgroundColor: paceColor(ACTUALS.jobs, TARGETS.jobs)
              }} />
              <div style={{ position: "absolute", top: -1, bottom: -1, width: 2, left: `${PACE * 100}%`, backgroundColor: BRAND_DK, borderRadius: 1 }} />
            </div>
          </div>
          <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: "14px 16px",
            textAlign: "center",
            border: `1px solid ${LIGHT_BORDER}`,
            borderLeft: `5px solid ${BRAND}`,
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: BRAND_DK, marginBottom: 8 }}>Funds Deployed</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: BRAND_DK, margin: 0 }}>{fmt$(Math.round(ACTUALS.funds))}</p>
            <p style={{ fontSize: 9, color: BRAND_DK, marginTop: 4 }}>/ {fmt$(TARGETS.funds)}</p>
            <div style={{ height: 4, borderRadius: 2, backgroundColor: LIGHT_BORDER, marginTop: 8, position: "relative" }}>
              <div style={{
                height: "100%",
                borderRadius: 2,
                width: `${Math.min((ACTUALS.funds / TARGETS.funds) * 100, 100)}%`,
                backgroundColor: paceColor(ACTUALS.funds, TARGETS.funds)
              }} />
              <div style={{ position: "absolute", top: -1, bottom: -1, width: 2, left: `${PACE * 100}%`, backgroundColor: BRAND_DK, borderRadius: 1 }} />
            </div>
          </div>
          <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: "14px 16px",
            textAlign: "center",
            border: `1px solid ${LIGHT_BORDER}`,
            borderLeft: `5px solid ${BRAND}`,
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: BRAND_DK, marginBottom: 8 }}>Active Founders</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: BRAND_DK, margin: 0 }}>{Math.round(founders.length * 0.65)}</p>
            <p style={{ fontSize: 9, color: BRAND_DK, marginTop: 4 }}>Of {founders.length} total</p>
            <div style={{ height: 4, borderRadius: 2, backgroundColor: LIGHT_BORDER, marginTop: 8 }} />
          </div>
          <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: "14px 16px",
            textAlign: "center",
            border: `1px solid ${LIGHT_BORDER}`,
            borderLeft: `5px solid ${BRAND}`,
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: BRAND_DK, marginBottom: 8 }}>Pace of Target</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: BRAND_DK, margin: 0 }}>5.5%</p>
            <p style={{ fontSize: 9, color: BRAND_DK, marginTop: 4 }}>Against 42% expected</p>
            <div style={{ height: 4, borderRadius: 2, backgroundColor: LIGHT_BORDER, marginTop: 8 }} />
          </div>
        </div>

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

        {/* ════ GROWTH & JOBS ════ */}
        {show("Growth & Jobs") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Growth & Jobs"
              description="Venture pipeline and employment outcomes"
              cards={[
                { label: "Ventures Funded", num: venturesFunded, sub: "Have received capital", icon: Briefcase },
                { label: "Avg Jobs per Venture", num: avgJobsPerVenture, sub: "Employment intensity", icon: Users },
                { label: "Partnerships Built", num: totalPartnerships, sub: "Cross-sector", icon: TrendingUp },
                { label: "Revenue Generated", num: totalRevenue, displayFmt: (n) => fmt$(Math.round(n)), sub: "Venture revenue", icon: Zap },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Ventures by Stage" subtitle="Expose · Build · Scale distribution" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGrowthYear} onFilterChange={setFilterGrowthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Expose", value: ALL_VENTURES.filter(v => sg(v.stage) === "Expose").length },
                    { name: "Build", value: ALL_VENTURES.filter(v => sg(v.stage) === "Build").length },
                    { name: "Scale", value: ALL_VENTURES.filter(v => sg(v.stage) === "Scale").length },
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
              <Panel title="Jobs Trend" subtitle="Employment growth over time" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGrowthYear} onFilterChange={setFilterGrowthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), jobs: ALL_VENTURES.filter(v => v.cohort === y).reduce((s, v) => s + v.jobsTotal, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
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

        {/* ════ PORTFOLIO COMPOSITION ════ */}
        {show("Portfolio Composition") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Portfolio Composition"
              description="Sector mix and founder characteristics"
              cards={[
                { label: "Total Ventures", num: ALL_VENTURES.length, sub: "Portfolio size", icon: Rocket },
                { label: "Sectors Represented", num: Array.from(new Set(ALL_VENTURES.map(v => v.sector))).length, sub: "Different sectors", icon: Briefcase },
                { label: "Female Founders", num: Math.round((founders.filter(f => f.gender === "Female").length / founders.length) * 100), displayFmt: (n) => `${n}%`, sub: "Of total founders", icon: TrendingUp },
                { label: "MCF Scholars", num: founders.filter(f => f.isMCFScholar).length, sub: "Mission scholars", icon: Users },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Ventures by Sector" subtitle="Distribution across sectors" filterOptions={["All Years", ...years.map(String)]} filterValue={filterCompYear} onFilterChange={setFilterCompYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(ALL_VENTURES.map(v => v.sector))).map(s => ({
                    name: s,
                    value: ALL_VENTURES.filter(v => v.sector === s).length
                  })).sort((a, b) => b.value - a.value).slice(0, 5)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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
              <Panel title="Gender Distribution" subtitle="Founder diversity metrics">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="vertical" data={[{
                    name: "Founders",
                    Male: founders.filter(f => f.gender !== "Female").length,
                    Female: founders.filter(f => f.gender === "Female").length
                  }]} margin={{ top: 4, right: 36, bottom: 0, left: 8 }} barSize={16} barCategoryGap="20%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={104} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Male" fill={GREEN_RAMP[0]} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Female" fill={GREEN_RAMP[1]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ GEOGRAPHY & ENGAGEMENT ════ */}
        {show("Geography & Engagement") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Geography & Engagement"
              description="Geographic distribution and regional performance"
              cards={[
                { label: "Countries Represented", num: Array.from(new Set(ALL_VENTURES.map(v => v.country))).length, sub: "Portfolio reach", icon: TrendingUp },
                { label: "Jobs by Region", num: ACTUALS.jobs, displayFmt: (n) => n.toLocaleString(), sub: "Cross-border", icon: Briefcase },
                { label: "Funding Distributed", num: ACTUALS.funds, displayFmt: (n) => fmt$(Math.round(n)), sub: "Regional capital", icon: Zap },
                { label: "Top Region Ventures", num: Array.from(new Set(ALL_VENTURES.map(v => v.country))).length > 0 ? Math.max(...Array.from(new Set(ALL_VENTURES.map(v => v.country))).map(c => ALL_VENTURES.filter(v => v.country === c).length)) : 0, sub: "Highest concentration", icon: Rocket },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Funding by Country" subtitle="Capital distribution across regions" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGeoYear} onFilterChange={setFilterGeoYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(ALL_VENTURES.map(v => v.country))).map(c => ({
                    name: c,
                    value: ALL_VENTURES.filter(v => v.country === c).reduce((s, v) => s + v.funding, 0)
                  })).sort((a, b) => b.value - a.value).slice(0, 8)} layout="vertical" margin={{ top: 4, right: 36, bottom: 0, left: 60 }} barSize={16} barCategoryGap="20%">
                    <CartesianGrid horizontal={false} stroke={LIGHT_BORDER} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9CA3AF" }} tickFormatter={(v) => fmt$(v)} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={50} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} cursor={{ fill: "rgba(14, 70, 51, 0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill={GREEN} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Ventures by Country" subtitle="Portfolio distribution" filterOptions={["All Years", ...years.map(String)]} filterValue={filterGeoYear} onFilterChange={setFilterGeoYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.from(new Set(ALL_VENTURES.map(v => v.country))).map(c => ({
                    name: c,
                    value: ALL_VENTURES.filter(v => v.country === c).length
                  })).sort((a, b) => b.value - a.value).slice(0, 8)} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
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

        {/* ════ PORTFOLIO HEALTH ════ */}
        {show("Portfolio Health") && (
          <section style={{ marginBottom: 48 }}>
            <StatsPanel
              title="Portfolio Health"
              description="Venture retention and expansion outcomes"
              cards={[
                { label: "Ventures Supported", num: activeVentures, sub: "Active ventures", icon: Rocket },
                { label: "Retention Rate", num: retentionRate, displayFmt: (n) => `${n}%`, sub: "Not stalled", icon: TrendingUp },
                { label: "In Accelerators", num: acceleratorVentures, sub: `${acceleratorPct}% of portfolio`, icon: Target },
                { label: "Revenue Generated", num: totalRevenue, displayFmt: (n) => fmt$(Math.round(n)), sub: "Venture revenue", icon: Zap },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Panel title="Funding Trend" subtitle="Capital deployment over time" filterOptions={["All Years", ...years.map(String)]} filterValue={filterHealthYear} onFilterChange={setFilterHealthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), funding: ALL_VENTURES.filter(v => v.cohort === y && v.funding > 0).reduce((s, v) => s + v.funding, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="funding" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Funding Deployed" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel title="Revenue Trend" subtitle="Growth over time" filterOptions={["All Years", ...years.map(String)]} filterValue={filterHealthYear} onFilterChange={setFilterHealthYear}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={years.map(y => ({ year: String(y), revenue: ALL_VENTURES.filter(v => v.cohort === y).reduce((s, v) => s + v.revenue, 0) }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={v => fmt$(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                    <Line type="monotone" dataKey="revenue" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue Generated" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </section>
        )}

        <PortalFooter portal="hent" synced="18 Jun 2026, EAT" />

      </div>
    </div>
  );
}
