"use client";
import { HeaderStatsPanel, FilterButton, FilterDropdown } from "@/components/ui/hent";
import { PortalThemeProvider, ChartCard, SectionHeader, Funnel, ChartTip, ChartLegend, useCountUp } from "@/components/ui";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import { DonutRing } from "@/components/charts/donut-chart";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { Banknote, CheckCircle2, ChevronDown, Rocket, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { Stage } from "@/types";

// ─── Theme (HENT green) ──────────────────────────────────────────────────────
const HERO    = "#2D6A4F";
const BRAND   = "#2D6A4F";
const BRAND_DK = "#0E4633";
const LIGHT_BORDER = "rgba(14, 70, 51, 0.12)";
const GREEN_RAMP = ["#1B4332","#1F9E9E","#A6C13C","#BBD59B","#2D6A4F","#4C8C8A","#6B8E5B","#8FA45A","#40916C","#C8DDB5"];
const DISTINCT = ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5"];

// ─── Milestone purposes ──────────────────────────────────────────────────────
// Catalytic funding is released against milestones. Map each venture's stage to
// the milestone the tranche is funding, per the intervention definition.
const MILESTONES = [
  "Solution Validation",
  "Prototype Development",
  "Customer Discovery",
  "Pilot Implementation",
  "Early Venture Growth",
] as const;
type Milestone = typeof MILESTONES[number];

function milestoneFor(stage: Stage): Milestone {
  switch (stage) {
    case "Ideation":
    case "Validation":          return "Solution Validation";
    case "Prototype/MVP":       return "Prototype Development";
    case "Early Growth":        return "Customer Discovery";
    case "Scaling":             return "Pilot Implementation";
    case "Investment/Funding":  return "Early Venture Growth";
  }
}

const MILESTONE_HEX: Record<Milestone, string> = {
  "Solution Validation":   "#1B4332",
  "Prototype Development": "#1F9E9E",
  "Customer Discovery":    "#40916C",
  "Pilot Implementation":  "#A6C13C",
  "Early Venture Growth":  "#BBD59B",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${n}`;
}
function avg(a: number[]) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }

const COHORTS = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort();
const ALL_SECTORS = Array.from(new Set(ALL_VENTURES.map(v => v.sector))).sort();

// ─── Derivations (filter-aware) ──────────────────────────────────────────────
function derive(rows: typeof ALL_VENTURES) {
  const funded = rows.filter(v => v.funding > 0);
  const totalFunding = funded.reduce((s, v) => s + v.funding, 0);
  const avgTicket = funded.length ? Math.round(totalFunding / funded.length) : 0;
  const jobs = funded.reduce((s, v) => s + v.jobsTotal, 0);
  const milestoneRate = Math.round(avg(funded.map(v => v.milestoneRate)));
  const milestonesDone = funded.reduce((s, v) => s + v.milestonesDone, 0);
  const progressed = funded.filter(v => v.stage === "Scaling" || v.stage === "Investment/Funding").length;

  // Funding + venture count per milestone purpose
  const byMilestone = MILESTONES.map(m => {
    const rs = funded.filter(v => milestoneFor(v.stage) === m);
    return {
      name: m,
      Funding: rs.reduce((s, v) => s + v.funding, 0),
      Ventures: rs.length,
      value: rs.reduce((s, v) => s + v.funding, 0),
    };
  });

  // Funding deployed per cohort + cumulative
  let running = 0;
  const byCohort = COHORTS.map(c => {
    const rs = funded.filter(v => v.cohort === c);
    const amt = rs.reduce((s, v) => s + v.funding, 0);
    running += amt;
    return { Year: String(c), Deployed: amt, Ventures: rs.length, Cumulative: running };
  });

  // Funding instrument mix
  const byStatus = Array.from(new Set(funded.map(v => v.fundingStatus)))
    .map(st => ({ name: st, value: funded.filter(v => v.fundingStatus === st).length }))
    .sort((a, b) => b.value - a.value);

  // Capital by sector
  const bySector = ALL_SECTORS
    .map(s => ({ name: s, value: funded.filter(v => v.sector === s).reduce((x, v) => x + v.funding, 0) }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Milestone delivery vs capital — top funded ventures
  const topFunded = [...funded].sort((a, b) => b.funding - a.funding).slice(0, 8)
    .map(v => ({
      name: v.name, funding: v.funding, stage: v.stage,
      milestone: milestoneFor(v.stage),
      done: v.milestonesDone, total: v.milestonesTotal, rate: v.milestoneRate,
    }));

  // Catalytic funnel
  const funnel = [
    { label: "Ventures in portfolio",   value: rows.length },
    { label: "Received catalytic funding", value: funded.length },
    { label: "Milestones met (≥50%)",   value: funded.filter(v => v.milestoneRate >= 50).length },
    { label: "Progressed to Scale",     value: progressed },
  ];

  return { funded, totalFunding, avgTicket, jobs, milestoneRate, milestonesDone, progressed, byMilestone, byCohort, byStatus, bySector, topFunded, funnel };
}


// ─── Page ────────────────────────────────────────────────────────────────────
export default function VentureFundingPage() {
  const [fCohort, setFCohort] = useState("All Cohorts");
  const [fSector, setFSector] = useState("All Sectors");
  const [fStatus, setFStatus] = useState("All Instruments");
  const [chartYear, setChartYear] = useState("All years");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [capChartFilterOpen, setCapChartFilterOpen] = useState(false);

  const ALL_STATUSES = useMemo(
    () => Array.from(new Set(ALL_VENTURES.filter(v => v.funding > 0).map(v => v.fundingStatus))).sort(),
    []
  );

  const filtered = useMemo(() => ALL_VENTURES.filter(v =>
    (fCohort === "All Cohorts" || String(v.cohort) === fCohort) &&
    (fSector === "All Sectors" || v.sector === fSector) &&
    (fStatus === "All Instruments" || v.fundingStatus === fStatus)
  ), [fCohort, fSector, fStatus]);

  const D = useMemo(() => derive(filtered), [filtered]);
  const activeCount = (fCohort !== "All Cohorts" ? 1 : 0) + (fSector !== "All Sectors" ? 1 : 0) + (fStatus !== "All Instruments" ? 1 : 0);

  // Chart year + sector filtering
  const chartYears = useMemo(() =>
    Array.from(new Set(D.funded.map(v => v.cohort))).sort((a, b) => b - a).map(String),
    [D.funded]
  );

  const venturesByYear = useMemo(() => {
    if (chartYear === "All years") return D.funded;
    return D.funded.filter(v => String(v.cohort) === chartYear);
  }, [D.funded, chartYear]);

  const bySectorByYear = useMemo(() => {
    const byS = ALL_SECTORS.map(s => {
      const rs = venturesByYear.filter(v => v.sector === s);
      return {
        name: s,
        value: rs.reduce((sum, v) => sum + v.funding, 0),
        count: rs.length,
      };
    }).sort((a, b) => b.value - a.value);
    return byS;
  }, [venturesByYear]);

  const venturesInSelectedSector = useMemo(() => {
    if (!selectedSector) return venturesByYear;
    return venturesByYear.filter(v => v.sector === selectedSector)
      .sort((a, b) => b.funding - a.funding);
  }, [venturesByYear, selectedSector]);

  const totalDeployedByYear = useMemo(() =>
    venturesByYear.reduce((sum, v) => sum + v.funding, 0),
    [venturesByYear]
  );

  const selectedSectorData = useMemo(() => {
    if (!selectedSector) return null;
    const total = bySectorByYear.find(s => s.name === selectedSector)?.value || 0;
    return { name: selectedSector, total, count: venturesInSelectedSector.length };
  }, [selectedSector, bySectorByYear, venturesInSelectedSector]);

  const [activeSection, setActiveSection] = useState<number>(1);
  const show = (n: number) => activeSection === n;
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <PortalThemeProvider portal="hent">
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <PortalNav portal="hent" />

      {/* ── HEADER ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(14,70,51,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Venture Funding</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>
                Catalytic, milestone-based funding for promising student ventures
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(190,228,214,0.5)" }}>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Period:</span> {COHORTS[0]}–{COHORTS[COHORTS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{D.funded.length} ventures funded · {fmt$(D.totalFunding)} deployed</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <HeaderStatsPanel
          title="Venture Funding Metrics"
          cards={[
            {
              label: "Capital Deployed",
              num: D.totalFunding,
              displayFmt: fmt$,
              icon: Banknote,
              sub: `${Math.round((D.totalFunding / 910_904) * 100)}% of $910.9K target`,
              pace: true,
              paceA: D.totalFunding,
              paceT: 910_904,
              tip: "Total catalytic funding disbursed to ventures across every milestone tranche."
            },
            {
              label: "Ventures Funded",
              num: D.funded.length,
              displayFmt: (n) => String(Math.round(n)),
              icon: Rocket,
              sub: `${Math.round((D.funded.length / 400) * 100)}% of 400 target`,
              pace: true,
              paceA: D.funded.length,
              paceT: 400,
              tip: "Ventures that have received at least one tranche of catalytic funding."
            },
            {
              label: "Milestone Rate",
              num: D.milestoneRate,
              displayFmt: (n) => `${Math.round(n)}%`,
              icon: CheckCircle2,
              sub: `Average delivery · ${D.funded.length} funded ventures`,
              pace: true,
              paceA: D.milestoneRate,
              paceT: 100,
              tip: "Average share of agreed milestones delivered by funded ventures — funding is released against these."
            },
            {
              label: "Progressed to Scale",
              num: D.progressed,
              displayFmt: (n) => String(Math.round(n)),
              icon: TrendingUp,
              sub: `${D.funded.length > 0 ? Math.round((D.progressed / D.funded.length) * 100) : 0}% of funded ventures`,
              pace: true,
              paceA: D.progressed,
              paceT: Math.max(D.funded.length > 0 ? Math.round(D.funded.length * 0.5) : 1, 1),
              tip: "Funded ventures that have advanced to the Scaling or Investment/Funding stage."
            },
            {
              label: "Jobs Created",
              num: D.jobs,
              displayFmt: (n) => Math.round(n).toLocaleString(),
              icon: Users,
              sub: `${Math.round((D.jobs / 2_000) * 100)}% of 2,000 target`,
              pace: true,
              paceA: D.jobs,
              paceT: 2_000,
              tip: "Total jobs created to date by ventures that received catalytic funding."
            },
          ]}
        />

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={String(activeSection)}
            onChange={(v) => setActiveSection(Number(v))}
            options={[
              { label: "Catalytic Capital & Milestones", value: "1" },
              { label: "Funding Growth & Sustainability", value: "2" },
              { label: "Capital Instruments & Venture Outcomes", value: "3" },
            ]}
          />
          <div style={{ position: "relative" }}>
            <FilterButton
              activeFilterCount={activeCount}
              isOpen={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            />
            <FilterDropdown
              isOpen={filtersOpen}
              onResetFilters={() => { setFCohort("All Cohorts"); setFSector("All Sectors"); setFStatus("All Instruments"); }}
            >
              {[
                { label: "Cohort", value: fCohort, setValue: setFCohort, options: ["All Cohorts", ...COHORTS.map(String)] },
                { label: "Sector", value: fSector, setValue: setFSector, options: ["All Sectors", ...ALL_SECTORS] },
                { label: "Instrument", value: fStatus, setValue: setFStatus, options: ["All Instruments", ...ALL_STATUSES] },
              ].map(filter => (
                <div key={filter.label} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#0E4633", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
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
                          border: `1px solid ${filter.value === opt ? "#2D6A4F" : "rgba(14,70,51,0.12)"}`,
                          backgroundColor: filter.value === opt ? "#2D6A4F" : "white",
                          color: filter.value === opt ? "white" : "#0E4633",
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

        {/* ── SECTION 1: Catalytic Capital & Milestones ─── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SectionHeader title="Catalytic Capital & Milestones"
            sub="How catalytic funding is deployed against venture milestones — from validation through early growth — and the funnel from portfolio to scaling ventures" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Capital by Milestone" sub="Funding deployed against each milestone purpose"
              info="Every tranche of catalytic funding is released against a milestone. This shows how much capital each milestone purpose — validation, prototyping, customer discovery, pilots, early growth — has absorbed.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byMilestone} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="24%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={fmt$} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={128} interval={0} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip money />} />
                  <Bar dataKey="Funding" radius={[0, 4, 4, 0]} maxBarSize={22}>
                    {D.byMilestone.map(d => <Cell key={d.name} fill={MILESTONE_HEX[d.name as Milestone]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {D.byMilestone.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: MILESTONE_HEX[d.name as Milestone] }} />
                    <span className="text-gray-700 font-medium">{d.name.split(" ").map(w => w[0]).join("")}</span>
                    <span className="text-gray-500">{d.Ventures}v</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Catalytic Funding" sub="Portfolio distribution across catalytic funding milestones"
              info="Distribution of ventures across catalytic funding journey stages.">
              <DonutRing
                data={D.funnel.map(f => ({ name: f.label, value: f.value }))}
                colors={{
                  "Ventures in portfolio": "#1B4332",
                  "Received catalytic funding": "#2D6A4F",
                  "Milestones met (≥50%)": "#40916C",
                  "Progressed to Scale": "#5BB4A0"
                }}
                total={filtered.length}
                totalLabel="Ventures"
                height={340}
                legendPercent
              />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: Funding Growth & Sustainability ─── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SectionHeader title="Funding Growth & Sustainability" sub="Capital deployment trends per cohort, cumulative funding trajectory, and whether funding is accelerating or sustainable" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Capital Deployed per Cohort" sub="Amount disbursed and ventures funded each year"
              info="Catalytic funding disbursed to each venture cohort. Useful for spotting whether recent cohorts are being funded at the same rate as earlier ones.">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={D.byCohort} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={44} tickFormatter={fmt$} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip money />} />
                  <Bar dataKey="Deployed" fill="#1B4332" radius={[4, 4, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Capital deployed", "#1B4332"]]} />
            </ChartCard>

            <ChartCard title="Cumulative Capital Deployed" sub="Running total of catalytic funding across cohorts"
              info="Running total of all catalytic capital deployed to date. A steepening line means funding is accelerating.">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={D.byCohort} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={44} tickFormatter={fmt$} />
                  <Tooltip content={<ChartTip money />} />
                  <Line type="monotone" dataKey="Cumulative" stroke="#1F9E9E" strokeWidth={2.5}
                    dot={{ r: 4, fill: "#1F9E9E", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Cumulative capital", "#1F9E9E"]]} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: Capital Instruments & Venture Outcomes ─── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SectionHeader title="Capital Instruments & Venture Outcomes"
            sub="Mix of funding instruments, capital distribution by sector, and milestone delivery performance to show the relationship between capital type and venture outcomes" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Funding Instrument Mix" sub="Ventures by funding instrument"
              info="How funded ventures are capitalised — grant, angel, VC, revenue-based or bootstrapped. Shows whether catalytic funding is crowding in other capital.">
              <DonutRing data={D.byStatus} colors={DISTINCT} total={D.funded.length} totalLabel="Funded" height={300} legendPercent />
            </ChartCard>

            <ChartCard title="Capital by Sector" sub="Catalytic funding deployed per health sector"
              info="Where catalytic capital lands across health sectors. Highlights concentration and any under-funded sectors.">
              <div style={{ paddingBottom: 12, display: "flex", justifyContent: "flex-end" }}>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setCapChartFilterOpen(!capChartFilterOpen)}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "5px 10px",
                      borderRadius: 10,
                      border: `1px solid rgba(14,70,51,0.12)`,
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
                    {selectedSector ? selectedSector : chartYear} <ChevronDown size={12} />
                  </button>
                  {capChartFilterOpen && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    backgroundColor: "white",
                    border: `1px solid rgba(14,70,51,0.12)`,
                    borderLeft: `5px solid ${BRAND}`,
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 10,
                    minWidth: 300,
                    overflow: "hidden",
                    padding: "12px 0",
                  }}>
                    {/* Reset button */}
                    {(chartYear !== "All years" || selectedSector) && (
                    <div style={{ padding: "0 12px 8px", borderBottom: "1px solid rgba(14,70,51,0.08)" }}>
                      <button
                        onClick={() => { setChartYear("All years"); setSelectedSector(null); setCapChartFilterOpen(false); }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "center",
                          padding: "6px 8px",
                          fontSize: 10,
                          fontWeight: 600,
                          color: BRAND,
                          backgroundColor: "rgba(45,106,79,0.08)",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Reset filters
                      </button>
                    </div>
                    )}

                    {/* Year section */}
                    <div style={{ padding: "0 12px 12px", borderBottom: "1px solid rgba(14,70,51,0.08)" }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: BRAND_DK, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>Year</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {["All years", ...chartYears].map(yr => (
                          <button
                            key={yr}
                            onClick={() => { setChartYear(yr); }}
                            style={{
                              fontSize: 9,
                              fontWeight: chartYear === yr ? 700 : 500,
                              padding: "4px 8px",
                              borderRadius: 4,
                              border: `1px solid ${chartYear === yr ? BRAND : "rgba(14,70,51,0.12)"}`,
                              backgroundColor: chartYear === yr ? BRAND : "white",
                              color: chartYear === yr ? "white" : BRAND_DK,
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sector section */}
                    <div style={{ padding: "12px" }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: BRAND_DK, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>Sector</p>
                      <button
                        onClick={() => setSelectedSector(null)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 8px",
                          fontSize: 10,
                          fontWeight: !selectedSector ? 700 : 500,
                          backgroundColor: !selectedSector ? "rgba(45,106,79,0.1)" : "transparent",
                          color: BRAND_DK,
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          marginBottom: 4,
                        }}
                      >
                        All sectors
                      </button>
                      <div style={{ maxHeight: 200, overflowY: "auto" }}>
                        {bySectorByYear.map(sector => (
                          <button
                            key={sector.name}
                            onClick={() => setSelectedSector(sector.name)}
                            style={{
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              padding: "6px 8px",
                              fontSize: 10,
                              fontWeight: selectedSector === sector.name ? 700 : 500,
                              backgroundColor: selectedSector === sector.name ? "rgba(45,106,79,0.1)" : "transparent",
                              color: BRAND_DK,
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              marginBottom: 2,
                            }}
                            title={sector.name}
                          >
                            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>{sector.name}</span>
                              <span style={{ fontSize: 9, color: BRAND, fontWeight: 600 }}>{sector.count}v</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ventures section */}
                    <div style={{ padding: "12px 12px 0", borderTop: "1px solid rgba(14,70,51,0.08)" }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: BRAND_DK, margin: "12px 0 8px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                        {selectedSector ? `${selectedSector} Ventures` : "All Ventures"}
                      </p>
                      <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                        {venturesInSelectedSector.length > 0 ? (
                          venturesInSelectedSector.map(v => {
                            const pct = selectedSectorData ? Math.round((v.funding / selectedSectorData.total) * 100) : 0;
                            return (
                              <div key={v.id} style={{ fontSize: 9, padding: "4px 8px", backgroundColor: "rgba(14,70,51,0.04)", borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: BRAND_DK, fontWeight: 500, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={v.name}>{v.name}</span>
                                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
                                  <span style={{ color: BRAND, fontWeight: 700 }}>{fmt$(v.funding)}</span>
                                  {selectedSector && <span style={{ color: "#6B7280", fontWeight: 600, minWidth: 25, textAlign: "right" }}>{pct}%</span>}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p style={{ fontSize: 9, color: "#9CA3AF", textAlign: "center", padding: "8px 0" }}>No ventures</p>
                        )}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Sector bars */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: BRAND_DK, margin: "0 0 12px 0" }}>
                  Total: {fmt$(totalDeployedByYear)} across {bySectorByYear.filter(s => s.value > 0).length} sectors
                </p>
                <ResponsiveContainer width="100%" height={bySectorByYear.length * 32 + 40}>
                  <BarChart
                    data={bySectorByYear.map((s, i) => ({
                      name: s.name,
                      value: s.value,
                      selected: selectedSector === s.name,
                      idx: i,
                    }))}
                    layout="vertical"
                    margin={{ top: 8, right: 16, bottom: 0, left: 140 }}
                    barCategoryGap="24%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={fmt$} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#6B7280" }}
                      axisLine={false}
                      tickLine={false}
                      width={135}
                      interval={0}
                    />
                    <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip money />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22} onClick={(data: any) => {
                      setSelectedSector(data.selected ? null : data.name);
                      setCapChartFilterOpen(false);
                    }} style={{ cursor: "pointer" }}>
                      {bySectorByYear.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={GREEN_RAMP[idx % GREEN_RAMP.length]}
                          opacity={selectedSector && selectedSector !== entry.name ? 0.35 : 1}
                          stroke={selectedSector === entry.name ? GREEN_RAMP[idx % GREEN_RAMP.length] : "none"}
                          strokeWidth={selectedSector === entry.name ? 3 : 0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="mt-4">
            <ChartCard title="Milestone Delivery — Top Funded Ventures" sub="Largest tranches and the milestone progress achieved against them"
              info="The largest recipients of catalytic funding and how much of their agreed milestone plan they have actually delivered. Low progress against a large tranche is a flag.">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-6 uppercase tracking-wider text-[9px]">Venture</th>
                      <th className="text-left text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Milestone Funded</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Capital</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Milestones</th>
                      <th className="text-left text-gray-400 font-bold pb-3 pl-2 uppercase tracking-wider text-[9px]">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {D.topFunded.map(v => (
                      <tr key={v.name} style={{ borderTop: `1px solid ${LIGHT_BORDER}` }}>
                        <td className="py-2.5 pr-6 whitespace-nowrap font-semibold text-gray-700">{v.name}</td>
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: MILESTONE_HEX[v.milestone] }} />
                            {v.milestone}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{fmt$(v.funding)}</td>
                        <td className="py-2.5 px-2 text-center tabular-nums text-gray-600">{v.done}/{v.total}</td>
                        <td className="py-2.5 pl-2" style={{ minWidth: 120 }}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(14,70,51,0.10)" }}>
                              <div className="h-full" style={{ width: `${v.rate}%`, backgroundColor: v.rate >= 75 ? "#1B4332" : v.rate >= 50 ? "#A6C13C" : "#E9C46A" }} />
                            </div>
                            <span className="tabular-nums font-bold text-gray-600 w-8 text-right">{v.rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!D.topFunded.length && (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-6">No funded ventures match the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </section>

        <PortalFooter portal="hent" />

      </div>
    </div>
    </PortalThemeProvider>
  );
}
