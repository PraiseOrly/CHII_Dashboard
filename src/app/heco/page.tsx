"use client";
import { PortalThemeProvider, Funnel, BarList, ChartTip } from "@/components/ui";
import { HeaderStatsPanel } from "@/components/ui/hemp";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { DonutRing } from "@/components/charts/donut-chart";
import { fellows, craHackathons, researchPartnerships, CRA_PILLARS } from "@/data/heco/cra";
import { Banknote, BookOpen, GraduationCap, Handshake, Rocket, Users, Info, ChevronDown, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Theme (executive navy) ──────────────────────────────────────────────────
const HERO     = "#102C5E";
const BRAND    = "#14306B";
const BRAND_DK = "#0C447C";
const SECTION  = "#185FA5";
const LIGHT_BORDER = "rgba(20, 48, 107, 0.12)";
const LIGHT_BG = "#F8F9FA";

// ─── Sections ─────────────────────────────────────────────────────────────────
const HECO_SECTIONS = [
  { n: 1, label: "The Three Pillars" },
  { n: 2, label: "Activity Over Time" },
  { n: 3, label: "Geographic Reach" },
];

const PILLAR_HEX: Record<string, string> = {
  "Public Sector Fellowship": "#14306B",
  "Student Hackathons":       "#0F6E56",
  "Public Health Research":   "#D45F2C",
};
const RAMP = ["#14306B","#185FA5","#2F5FD1","#378ADD","#479BD6","#85B7EB","#0F6E56","#1D9E75"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function s(a: number[]) { return a.reduce((x, y) => x + y, 0); }
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${n}`;
}

// ─── Panel Component ─────────────────────────────────────────────────────────
function Panel({ title, subtitle, info, children, filterOptions, filterValue, onFilterChange }: { title: string; subtitle: string; info?: string; children: React.ReactNode; filterOptions?: string[]; filterValue?: string; onFilterChange?: (v: string) => void }) {
  const [tip, setTip] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
      <div style={{ backgroundColor: BRAND, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, minWidth: 0, flex: 1 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#FF8C42", flexShrink: 0 }} />
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
      <div style={{ padding: "12px 18px 18px", backgroundColor: "white" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
            {title}
          </p>
          <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

const YEARS = Array.from(new Set([
  ...fellows.map(f => f.cohort),
  ...craHackathons.map(h => h.year),
  ...researchPartnerships.map(p => p.yearEstablished),
])).sort();
const COUNTRIES = Array.from(new Set([
  ...fellows.map(f => f.country),
  ...craHackathons.map(h => h.country),
  ...researchPartnerships.map(p => p.country),
])).sort();

// ─── Derivations (filter-aware) ──────────────────────────────────────────────
function derive(
  fl: typeof fellows,
  hk: typeof craHackathons,
  rp: typeof researchPartnerships,
) {
  const funding      = s(fl.map(f => f.funding));
  const participants = s(hk.map(h => h.participants));
  const ventures     = s(hk.map(h => h.venturesIncubated));
  const studies      = s(rp.map(p => p.studies));
  const adoptions    = s(rp.map(p => p.policyAdoptions));

  // How many people / institutions each pillar touches
  const reachByPillar = [
    { name: "Public Sector Fellowship", value: fl.length },
    { name: "Student Hackathons",       value: participants },
    { name: "Public Health Research",   value: rp.length },
  ].filter(d => d.value > 0);

  // Each pillar's own primary output (different units — read as three scorecards)
  const outputByPillar = [
    { name: "Public Sector Fellowship", Output: s(fl.map(f => f.publications)) },
    { name: "Student Hackathons",       Output: ventures },
    { name: "Public Health Research",   Output: studies },
  ];

  const byYear = YEARS.map(y => ({
    Year: String(y),
    Fellows:  fl.filter(f => f.cohort === y).length,
    Ventures: s(hk.filter(h => h.year === y).map(h => h.venturesIncubated)),
    Studies:  s(rp.filter(p => p.yearEstablished === y).map(p => p.studies)),
  })).filter(d => d.Fellows + d.Ventures + d.Studies > 0);

  const byCountry = COUNTRIES.map(c => ({
    name: c,
    value: fl.filter(f => f.country === c).length
         + hk.filter(h => h.country === c).length
         + rp.filter(p => p.country === c).length,
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  // The mandate as a chain: fellows → mentorship → ventures → research → policy
  const chain = [
    { label: "Executives upskilled (Fellows)", value: fl.length },
    { label: "Students reached (Hackathons)",  value: participants },
    { label: "Ventures incubated",             value: ventures },
    { label: "Research studies run",           value: studies },
    { label: "Adopted into policy",            value: adoptions },
  ];

  return {
    fellows: fl.length, funding, participants, ventures, studies, adoptions,
    partnerships: rp.length,
    reachByPillar, outputByPillar, byYear, byCountry, chain,
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HecoOverviewPage() {
  const [fYear, setFYear]       = useState("All Years");
  const [fCountry, setFCountry] = useState("All Countries");

  const fl = useMemo(() => fellows.filter(f =>
    (fYear === "All Years" || String(f.cohort) === fYear) &&
    (fCountry === "All Countries" || f.country === fCountry)
  ), [fYear, fCountry]);
  const hk = useMemo(() => craHackathons.filter(h =>
    (fYear === "All Years" || String(h.year) === fYear) &&
    (fCountry === "All Countries" || h.country === fCountry)
  ), [fYear, fCountry]);
  const rp = useMemo(() => researchPartnerships.filter(p =>
    (fYear === "All Years" || String(p.yearEstablished) === fYear) &&
    (fCountry === "All Countries" || p.country === fCountry)
  ), [fYear, fCountry]);

  const D = useMemo(() => derive(fl, hk, rp), [fl, hk, rp]);
  const activeCount = (fYear !== "All Years" ? 1 : 0) + (fCountry !== "All Countries" ? 1 : 0);

  const [activeSection, setActiveSection] = useState<number>(1);
  const show = (n: number) => activeSection === n;
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: LIGHT_BG }}>
      <PortalNav portal="heco" />

      {/* ── HEADER ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design2.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>HECO Overview</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Health Ecosystem for Clinical Outcomes - Fellowship, Student Hackathons and Research Partnerships
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Data source:</span> HECO Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(215,225,245,0.8)", fontWeight: 600 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-7">

        {/* ════ TOP STATS HEADER ════ */}
        <HeaderStatsPanel
          title="HECO Ecosystem Overview"
          description="Key performance indicators across all HECO programmes"
          cards={[
            {
              label: "Fellows",
              num: D.fellows,
              icon: GraduationCap,
              sub: "Healthcare executives",
              tip: "Healthcare executives upskilled through the Public Sector Fellowship — Pillar 1",
            },
            {
              label: "Funding Awarded",
              num: D.funding,
              icon: Banknote,
              displayFmt: (n) => fmt$(n),
              sub: "Operational funding",
              tip: "Total funding awarded to fellows to support their work and initiatives",
            },
            {
              label: "Students Reached",
              num: D.participants,
              icon: Users,
              sub: "Via hackathons",
              tip: "Students who participated in Fellow-mentored hackathons — Pillar 2",
            },
            {
              label: "Ventures Incubated",
              num: D.ventures,
              icon: Rocket,
              sub: "From hackathons",
              tip: "Student ventures incubated from hackathons with Fellow mentorship",
            },
            {
              label: "Research Studies",
              num: D.studies,
              icon: BookOpen,
              sub: "Health authority partnerships",
              tip: "Public health studies run with regional health authorities — Pillar 3",
            },
            {
              label: "Policy Adoptions",
              num: D.adoptions,
              icon: Handshake,
              sub: "Research into practice",
              tip: "Research findings adopted into policy and practice by partner institutions",
            },
          ]}
        />

        {/* ════ SECTION FILTER PILLS + FILTERS BUTTON ════ */}
        <div style={{ marginBottom: 32, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flex: 1 }}>
            {HECO_SECTIONS.map(cat => (
              <button
                key={cat.n}
                onClick={() => setActiveSection(cat.n)}
                style={{
                  fontSize: 11,
                  fontWeight: activeSection === cat.n ? 700 : 600,
                  padding: "8px 14px",
                  borderRadius: 20,
                  border: `1px solid ${activeSection === cat.n ? BRAND : LIGHT_BORDER}`,
                  backgroundColor: activeSection === cat.n ? BRAND : "white",
                  color: activeSection === cat.n ? "white" : BRAND_DK,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 20,
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                backgroundColor: activeCount > 0 ? BRAND : "white",
                color: activeCount > 0 ? "white" : BRAND_DK,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 800,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  color: "white",
                  borderRadius: 999,
                  minWidth: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {activeCount}
                </span>
              )}
            </button>
            {filtersOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                backgroundColor: "white",
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 20,
                minWidth: 300,
                overflow: "hidden",
              }}>
                <div style={{ backgroundColor: BRAND, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>Filters</p>
                  <button
                    onClick={() => {
                      setFYear("All Years");
                      setFCountry("All Countries");
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
                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Year Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Year</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All Years", ...YEARS.map(String)].map(y => (
                        <button
                          key={y}
                          onClick={() => setFYear(y)}
                          style={{
                            fontSize: 10,
                            fontWeight: fYear === y ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${fYear === y ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: fYear === y ? BRAND : "white",
                            color: fYear === y ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: BRAND_DK, margin: "0 0 6px 0" }}>Country</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["All Countries", ...COUNTRIES].map(c => (
                        <button
                          key={c}
                          onClick={() => setFCountry(c)}
                          style={{
                            fontSize: 10,
                            fontWeight: fCountry === c ? 700 : 500,
                            padding: "4px 10px",
                            borderRadius: 10,
                            border: `1px solid ${fCountry === c ? BRAND : LIGHT_BORDER}`,
                            backgroundColor: fCountry === c ? BRAND : "white",
                            color: fCountry === c ? "white" : BRAND_DK,
                            cursor: "pointer",
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════ THE THREE PILLARS ════ */}
        {show(1) && (
          <section style={{ marginBottom: 48 }}>
            <SectionTitle title="The Three Pillars" subtitle="How the Centre advances its ecosystem mandate through fellowship, hackathons, and research partnerships" />
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Reach by Pillar" subtitle="Fellows, hackathon students and research partnerships" info="How many people or institutions each pillar touches. The hackathon pillar reaches the most people; the fellowship reaches the most senior ones.">
                <DonutRing data={D.reachByPillar} colors={D.reachByPillar.map(d => PILLAR_HEX[d.name])}
                  total={D.reachByPillar.reduce((n, d) => n + d.value, 0)} totalLabel="Reached"
                  height={280} legendPercent />
              </Panel>

              <Panel title="The Ecosystem Chain" subtitle="Executives → students → ventures → research → policy" info="The mandate is a chain, not three separate programmes: Fellows are upskilled, they mentor students, students build ventures, and research partnerships push findings into policy.">
                <Funnel steps={D.chain} />
                <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                  <span>Each pillar feeds the next — Fellows mentor hackathons that incubate ventures</span>
                </div>
              </Panel>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 16 }}>
              <Panel title="Headline Output per Pillar" subtitle="Publications · ventures · studies" info="Each pillar's own primary output. These are different units, so read them as three separate scorecards rather than a like-for-like comparison.">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={D.outputByPillar} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="Output" radius={[4, 4, 0, 0]} maxBarSize={46}>
                      {D.outputByPillar.map(d => <Cell key={d.name} fill={PILLAR_HEX[d.name]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                  {CRA_PILLARS.map((p) => (
                    <span key={p} className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PILLAR_HEX[p] }} />{p}
                    </span>
                  ))}
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ ACTIVITY OVER TIME ════ */}
        {show(2) && (
          <section style={{ marginBottom: 48 }}>
            <SectionTitle title="Activity Over Time" subtitle="How the three pillars have scaled year on year" />
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <Panel title="Pillar Activity per Year" subtitle="Fellows enrolled, ventures incubated and studies run" info="All three pillars growing together is the healthy pattern — the fellowship should lead, since Fellows are the mentors who make the hackathons work.">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={D.byYear} margin={{ top: 6, right: 10, bottom: 0, left: -16 }} barCategoryGap="28%" barGap={2}>
                    <CartesianGrid vertical={false} stroke={LIGHT_BORDER} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(20, 48, 107, 0.04)" }} />
                    <Bar dataKey="Fellows"  fill={PILLAR_HEX["Public Sector Fellowship"]} radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="Ventures" fill={PILLAR_HEX["Student Hackathons"]}       radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="Studies"  fill={PILLAR_HEX["Public Health Research"]}   radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PILLAR_HEX["Public Sector Fellowship"] }} /> Fellows</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PILLAR_HEX["Student Hackathons"] }} /> Ventures</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PILLAR_HEX["Public Health Research"] }} /> Studies</span>
                </div>
              </Panel>

              <Panel title="Cumulative Ecosystem Output" subtitle="Ventures incubated and research studies, running total" info="The compounding effect of the mandate. A flattening line means the ecosystem is delivering less each year, not more.">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={D.byYear.map((d, i, arr) => ({
                    Year: d.Year,
                    Ventures: arr.slice(0, i + 1).reduce((n, x) => n + x.Ventures, 0),
                    Studies:  arr.slice(0, i + 1).reduce((n, x) => n + x.Studies, 0),
                  }))} margin={{ top: 6, right: 14, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_BORDER} />
                    <XAxis dataKey="Year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Line type="monotone" dataKey="Ventures" stroke={PILLAR_HEX["Student Hackathons"]} strokeWidth={2.5}
                      dot={{ r: 3, fill: PILLAR_HEX["Student Hackathons"] }} activeDot={{ r: 5 }} name="Cumulative ventures" />
                    <Line type="monotone" dataKey="Studies" stroke={PILLAR_HEX["Public Health Research"]} strokeWidth={2.5}
                      dot={{ r: 3, fill: PILLAR_HEX["Public Health Research"] }} activeDot={{ r: 5 }} name="Cumulative studies" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PILLAR_HEX["Student Hackathons"] }} /> Cumulative ventures</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PILLAR_HEX["Public Health Research"] }} /> Cumulative studies</span>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {/* ════ GEOGRAPHIC REACH ════ */}
        {show(3) && (
          <section style={{ marginBottom: 48 }}>
            <SectionTitle title="Geographic Reach" subtitle="Where the ecosystem mandate is active — fellows, hackathons and research partnerships by country" />
            <div style={{ marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              <Panel title="Ecosystem Footprint by Country" subtitle="Combined count of fellows, hackathons and research partnerships" info="Concentration in one country limits the 'ecosystem' claim. Breadth across health authorities is what makes the research pillar structural rather than local.">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {D.byCountry.map((row, i) => {
                    const col = RAMP[i % RAMP.length];
                    const max = D.byCountry[0]?.value || 1;
                    return (
                      <div key={row.name} className="flex items-center gap-2.5">
                        <div className="w-[110px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                        <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
                          <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
                        </div>
                        <div className="text-[11px] font-bold w-6 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
                      </div>
                    );
                  })}
                  {!D.byCountry.length && <p className="text-[11px] text-gray-400 text-center py-6">No records match the selected filters.</p>}
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                  {D.byCountry.slice(0, 6).map((c, i) => (
                    <span key={c.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RAMP[i % RAMP.length] }} />{c.name}
                    </span>
                  ))}
                </div>
              </Panel>
            </div>
          </section>
        )}

        <PortalFooter portal="heco" />
      </div>
    </div>
  );
}
