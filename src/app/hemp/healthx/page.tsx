"use client";
import { ChartCard, SectionHeader, InfoDot, Funnel, ChartTip, ChartLegend, BarList, useCountUp } from "@/components/ui/hemp";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Briefcase, Building2, Download, FileText, Link2, MapPin, Handshake, TrendingUp, Users } from "lucide-react";
import PortalNav from "@/components/layout/portal-nav";
import { CHART } from "@/theme/tokens";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import PortalFooter from "@/components/layout/portal-footer";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import { healthXSessions, ORG_TYPES } from "@/data/hemp/healthx";
import {
  healthXSymposia, readinessSessions,
  LEAD_TYPES, READINESS_TOPICS, EMPLOYER_SECTORS,
  type LeadType, type ReadinessTopic, type EmployerSector,
} from "@/data/hemp/healthx-careers";

// ── Career-exposure platform derivations ("Explore What's Next") ──
function deriveCareers(symposia: typeof healthXSymposia, readiness: typeof readinessSessions) {
  const s = (a: number[]) => a.reduce((x, y) => x + y, 0);

  const institutions = s(symposia.map(x => x.institutions));
  const students     = s(symposia.map(x => x.studentsAttending));
  const femaleStu    = s(symposia.map(x => x.femaleStudents));
  const femalePct    = students ? Math.round(femaleStu / students * 100) : 0;
  const employers    = s(symposia.map(x => x.employersExhibiting));

  const totalLeads       = s(symposia.flatMap(x => LEAD_TYPES.map(t => x.leads[t])));
  const totalConversions = s(symposia.flatMap(x => LEAD_TYPES.map(t => x.conversions[t])));
  const conversionPct    = totalLeads ? Math.round(totalConversions / totalLeads * 100) : 0;

  const partnerships = s(symposia.map(x => x.partnershipsFormed));
  const renewed      = s(symposia.map(x => x.partnershipsRenewed));

  const byLeadType = LEAD_TYPES.map(t => ({
    name: t,
    Leads: s(symposia.map(x => x.leads[t])),
    Converted: s(symposia.map(x => x.conversions[t])),
  }));

  const byEmployerSector = EMPLOYER_SECTORS
    .map(sec => ({ name: sec, value: s(symposia.map(x => x.employersBySector[sec])) }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const byReadinessTopic = READINESS_TOPICS.map(t => {
    const rs = readiness.filter(r => r.topic === t);
    return {
      name: t,
      Registered: s(rs.map(r => r.registered)),
      Attended: s(rs.map(r => r.attended)),
    };
  });

  const byYear = symposia.map(x => ({
    Year: String(x.year),
    Students: x.studentsAttending,
    Employers: x.employersExhibiting,
    Leads: LEAD_TYPES.reduce((n, t) => n + x.leads[t], 0),
  }));

  return {
    institutions, students, femalePct, employers,
    totalLeads, totalConversions, conversionPct, partnerships, renewed,
    byLeadType, byEmployerSector, byReadinessTopic, byYear,
  };
}
const CX = deriveCareers(healthXSymposia, readinessSessions);

// â”€â”€â”€ Color language â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Primary: teal (partnership / field theme)
// Supporting: blue
// Warning: amber
const TEAL        = "#185FA5"; // blue 600 (HealthX primary, mirrors overview)
const TEAL_MID    = "#14306B";
const TEAL_DEEP   = "#0C447C";
const BLUE        = "#2F5FD1"; // supporting blue
const BLUE_LIGHT  = "#378ADD";
const AMBER       = "#BA7517";
const NAVY        = "#14306B";
const GREEN       = "#1D9E75";
const INDIGO      = "#534AB7"; // indigo 600 (avg badge)
const ROSE        = "#D45F2C";
const VIOLET      = "#0F6E56"; // teal 600 (distinct category accent)

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// â”€â”€â”€ Module-level aggregates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const YEARS         = Array.from(new Set(healthXSessions.map(h => h.year))).sort();
const ALL_COUNTRIES = Array.from(new Set(healthXSessions.map(h => h.country))).sort();

// â”€â”€ Satisfaction heatmap (type Ã— dimension) â”€â”€
const HX_SESSION_TYPES = [
  "Health Facility Visit",
  "Innovation Challenge",
  "Field Exposure",
  "Industry Tour",
] as const;
const SCORE_DIMS = [
  "Learning Experience",
  "Practical Relevance",
  "Accessibility",
  "Innovation Impact",
] as const;

const HIGH_SAT = 4.5;

// Derive every chart dataset from a (possibly filtered) set of HealthX sessions.
function derive(rows: typeof healthXSessions) {
  const hxPart      = rows.reduce((s, h) => s + h.participants, 0);
  const hxFem       = rows.reduce((s, h) => s + h.femalePart,   0);
  const totalPships = rows.reduce((s, h) => s + h.partnerships, 0);
  const femalePct   = hxPart ? Math.round(hxFem / hxPart * 100) : 0;
  const avgComp     = Math.round(avg(rows.map(h => h.completionRate)));
  const avgSat      = parseFloat(avg(rows.map(h => avg(Object.values(h.scores)))).toFixed(1));
  const countries   = Array.from(new Set(rows.map(h => h.country)));

  const visitsCompleted   = rows.length;
  const feedbackCollected = rows.filter(h => h.completionRate >= 90).length;
  const mouSigned         = rows.filter(h => h.partnerships >= 2 && h.completionRate >= 93).length;

  const feedbackBars = [
    { label: "Quality of experience",  dim: "Learning Experience"  as const },
    { label: "Relevance to career",    dim: "Practical Relevance"  as const },
    { label: "Usefulness of exposure", dim: "Innovation Impact"    as const },
  ].map(m => ({
    label: m.label,
    pct: rows.length ? Math.round(rows.filter(h => h.scores[m.dim] >= HIGH_SAT).length / rows.length * 100) : 0,
  }));

  const orgTypeData = ORG_TYPES.map(type => ({
    name:  type,
    value: rows.filter(h => h.orgType === type).length,
  })).sort((a, b) => b.value - a.value);
  const orgTypeMax = orgTypeData[0]?.value ?? 1;

  const sessionsPerYear = YEARS.map(yr => ({
    Year:     String(yr),
    Sessions: rows.filter(h => h.year === yr).length,
  }));
  const participantsPerYear = YEARS.map(yr => ({
    Year:         String(yr),
    Participants: rows.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
  }));

  const hxHeatmap = HX_SESSION_TYPES.map(type => {
    const sessions = rows.filter(h => h.type === type);
    return {
      type,
      "Learning Experience":  parseFloat(avg(sessions.map(h => h.scores["Learning Experience"])).toFixed(1)),
      "Practical Relevance":  parseFloat(avg(sessions.map(h => h.scores["Practical Relevance"])).toFixed(1)),
      "Accessibility":        parseFloat(avg(sessions.map(h => h.scores["Accessibility"])).toFixed(1)),
      "Innovation Impact":    parseFloat(avg(sessions.map(h => h.scores["Innovation Impact"])).toFixed(1)),
    };
  });

  const countryData = Object.entries(
    rows.reduce<Record<string, number>>((acc, h) => {
      acc[h.country] = (acc[h.country] || 0) + h.participants;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return {
    hxPart, hxFem, totalPships, femalePct, avgComp, avgSat, countries,
    visitsCompleted, feedbackCollected, mouSigned, feedbackBars,
    orgTypeData, orgTypeMax, sessionsPerYear, participantsPerYear, hxHeatmap, countryData,
  };
}

const TYPE_COLOR: Record<string, string> = {
  "Health Facility Visit": TEAL,
  "Innovation Challenge":  VIOLET,
  "Field Exposure":        BLUE_LIGHT,
  "Industry Tour":         AMBER,
};

const COUNTRY_HEX = [TEAL, BLUE_LIGHT, AMBER, VIOLET, GREEN, INDIGO, ROSE, "#7F77DD", "#2F5FD1", "#5F5E5A"];

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(20,48,107,0.6)" }}>
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-[11px] font-medium normal-case tracking-normal rounded-md px-2 py-1 outline-none cursor-pointer"
        style={{ color: "#0C447C", border: "1px solid rgba(20,48,107,0.2)", backgroundColor: "white" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function heatColor(v: number): string {
  if (v >= 4.5) return TEAL;
  if (v >= 4.0) return BLUE;
  if (v >= 3.5) return AMBER;
  return ROSE;
}

function Card({ title, sub, children }: {
  accent?: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#14306B", padding: "11px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HealthXPage() {

  // â”€â”€ Filters â”€â”€
  const [fYear, setFYear]       = useState("All Years");
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
  const [fCountry, setFCountry] = useState("All Countries");
  const [fType, setFType]       = useState("All Types");
  const filtered = useMemo(() => healthXSessions.filter(h =>
    (fYear === "All Years" || String(h.year) === fYear) &&
    (fCountry === "All Countries" || h.country === fCountry) &&
    (fType === "All Types" || h.type === fType)
  ), [fYear, fCountry, fType]);
  const {
    hxPart, totalPships, femalePct, avgComp, avgSat, countries,
    visitsCompleted, feedbackCollected, mouSigned, feedbackBars,
    orgTypeData, orgTypeMax, sessionsPerYear, participantsPerYear, hxHeatmap, countryData,
  } = useMemo(() => derive(filtered), [filtered]);


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <PortalNav portal="hemp" />

      {/* â”€â”€ HEADER â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design2.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>HealthX: Explore What&apos;s Next</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              A multi-institutional career exposure platform — readiness sessions, a health careers exhibition, and the leads it generates
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HEMP HealthX M&amp;E</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
              <span aria-hidden="true">·</span>
              <span>{visitsCompleted} sessions · {countries.length} countries</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ THREE HEADLINE METRICS â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 pt-6">

          {/* â”€â”€ THREE HEADLINE METRICS â”€â”€â”€ */}
          <div className="pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsKpiCard
              label="Health Hub Visits Completed"
              num={visitsCompleted}
              sub={`${YEARS[0]} - ${YEARS[YEARS.length - 1]}  ·  ${countries.length} countries`}
              Icon={MapPin}
              tooltip="HealthX field sessions delivered with host organisations."
            />
            <StatsKpiCard
              label="Active Partnerships (MOUs Signed)"
              num={totalPships}
              sub={`${mouSigned} org sites with formal agreements`}
              Icon={Handshake}
              tooltip="Partnership agreements formed through HealthX field visits."
            />
            <StatsKpiCard
              label="Students with Field Exposure"
              num={hxPart}
              sub={`${femalePct}% female  ·  ${avgComp}% avg completion`}
              Icon={Users}
              tooltip="Students who took part in a HealthX experiential session."
            />
          </div>
      </div>

      {/* â”€â”€ BODY â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* â”€â”€ FILTER BAR â”€â”€â”€ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent="#14306B"
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Pipeline & Feedback", value: "1" },
              { label: "Org Types", value: "2" },
              { label: "Annual Activity", value: "3" },
              { label: "Satisfaction & Reach", value: "4" },
              { label: "Career Exposure", value: "5" },
            ]}
          />
          <OutreachFilters
            accent="#14306B"
            activeCount={(fYear !== "All Years" ? 1 : 0) + (fCountry !== "All Countries" ? 1 : 0) + (fType !== "All Types" ? 1 : 0)}
            onReset={() => { setFYear("All Years"); setFCountry("All Countries"); setFType("All Types"); }}
          >
            <OFilterSelect label="Year" value={fYear} onChange={setFYear} accent="#14306B"
              options={["All Years", ...YEARS.map(String)].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Country" value={fCountry} onChange={setFCountry} accent="#14306B"
              options={["All Countries", ...ALL_COUNTRIES].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Type" value={fType} onChange={setFType} accent="#14306B"
              options={["All Types", ...HX_SESSION_TYPES].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        {/* â”€â”€ SECTION 1: PIPELINE + FEEDBACK â”€â”€â”€ */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SectionHeader title="Partnership Pipeline &amp; Student Feedback"
            sub="Visit-to-MOU conversion funnel alongside student experience quality ratings" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Partnership pipeline funnel  -  3 cols */}
            <div className="lg:col-span-3">
              <Card accent={TEAL_DEEP} title="Partnership Pipeline"
                sub="Org progression from first visit to formal MOU  -  2021 - 2026">

                <div className="space-y-3 py-1">

                  {/* Stage 1 */}
                  <div>
                    <div className="h-14 w-full rounded flex items-center px-5 justify-between"
                      style={{ backgroundColor: TEAL }}>
                      <div>
                        <p className="text-white text-[11px] font-bold">Visit completed</p>
                        <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                          {visitsCompleted} orgs received a student field visit
                        </p>
                      </div>
                      <p className="text-white text-2xl font-black tabular-nums">{visitsCompleted}</p>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex items-center gap-2 px-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: TEAL + "40" }} />
                    <p className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                      {Math.round(feedbackCollected / visitsCompleted * 100)}% advanced
                    </p>
                    <div className="flex-1 h-px" style={{ backgroundColor: TEAL + "40" }} />
                  </div>

                  {/* Stage 2 */}
                  <div className="px-6">
                    <div className="h-14 rounded flex items-center px-5 justify-between"
                      style={{ backgroundColor: TEAL_MID }}>
                      <div>
                        <p className="text-white text-[11px] font-bold">Student feedback collected</p>
                        <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                          Completion rate â‰¥ 90%  -  survey submitted
                        </p>
                      </div>
                      <p className="text-white text-2xl font-black tabular-nums">{feedbackCollected}</p>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex items-center gap-2 px-12">
                    <div className="flex-1 h-px" style={{ backgroundColor: TEAL + "40" }} />
                    <p className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                      {Math.round(mouSigned / feedbackCollected * 100)}% signed MOU
                    </p>
                    <div className="flex-1 h-px" style={{ backgroundColor: TEAL + "40" }} />
                  </div>

                  {/* Stage 3 */}
                  <div className="px-12">
                    <div className="h-14 rounded flex items-center px-5 justify-between"
                      style={{ backgroundColor: TEAL_DEEP }}>
                      <div>
                        <p className="text-white text-[11px] font-bold">MOU / Partnership signed</p>
                        <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                          Formal agreement  ·  â‰¥ 2 partnerships per site
                        </p>
                      </div>
                      <p className="text-white text-2xl font-black tabular-nums">{mouSigned}</p>
                    </div>
                  </div>

                </div>

                {/* Summary strip */}
                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Total MOUs",       value: totalPships, color: TEAL   },
                    { label: "Avg per Session",  value: parseFloat((totalPships / visitsCompleted).toFixed(1)), color: TEAL_MID },
                    { label: "Conversion Rate",  value: `${Math.round(mouSigned / visitsCompleted * 100)}%`,     color: TEAL_DEEP },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-lg font-black tabular-nums" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5 font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

              </Card>
            </div>

            {/* Student feedback bars  -  2 cols */}
            <div className="lg:col-span-2">
              <Card accent={BLUE} title="Student Feedback"
                sub="Positive response rate per experience dimension  -  field survey">

                <div className="space-y-5 py-1">
                  {feedbackBars.map(m => {
                    const barColor = m.pct >= 70 ? TEAL : m.pct >= 50 ? AMBER : ROSE;
                    return (
                      <div key={m.label}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-semibold text-gray-700">{m.label}</p>
                          <p className="text-[11px] font-black tabular-nums"
                            style={{ color: barColor }}>{m.pct}%</p>
                        </div>
                        {/* 10px bar */}
                        <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${m.pct}%`, backgroundColor: barColor }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[10px] text-gray-400 mt-5 pt-4 border-t border-gray-100">
                  Positive response rate  -  student survey. Score â‰¥ 4.5 / 5 classified as positive.
                </p>

                {/* Threshold legend */}
                <div className="flex gap-4 mt-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: TEAL }} />
                    â‰¥ 70%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: AMBER }} />
                    50 - 69%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: ROSE }} />
                    &lt; 50%
                  </span>
                </div>

                {/* Supporting stats */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Avg Satisfaction</span>
                      <span className="font-bold tabular-nums" style={{ color: TEAL }}>{avgSat}/5</span>
                    </div>
                    <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                      <div className="h-full rounded-full" style={{ width: `${(avgSat / 5) * 100}%`, backgroundColor: TEAL }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Avg Completion Rate</span>
                      <span className="font-bold tabular-nums" style={{ color: BLUE }}>{avgComp}%</span>
                    </div>
                    <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                      <div className="h-full rounded-full" style={{ width: `${avgComp}%`, backgroundColor: BLUE }} />
                    </div>
                  </div>
                </div>

              </Card>
            </div>

          </div>
        </section>

        {/* â”€â”€ SECTION 2: VISITS BY ORG TYPE â”€â”€â”€ */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SectionHeader title="Visits by Organisation Type"
            sub="Count of HealthX sessions per host organisation category  -  absolute numbers" accent={BLUE} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card accent={BLUE} title="Sessions by Organisation Type"
              sub="Absolute session counts per org category">
              <div className="space-y-4 py-1">
                {orgTypeData.map(row => (
                  <div key={row.name} className="flex items-center gap-3">
                    <div className="w-36 text-[11px] text-gray-600 text-right flex-shrink-0 font-medium">{row.name}</div>
                    <div className="flex-1 h-8 rounded overflow-hidden" style={{ backgroundColor: BLUE_LIGHT + "18" }}>
                      <div className="h-full rounded flex items-center px-3 transition-all"
                        style={{ width: `${(row.value / orgTypeMax) * 100}%`, backgroundColor: BLUE_LIGHT }}>
                        {row.value > 0 && (
                          <span className="text-white text-[11px] font-bold tabular-nums">{row.value}</span>
                        )}
                      </div>
                    </div>
                    <div className="w-6 text-[11px] font-bold tabular-nums text-right flex-shrink-0"
                      style={{ color: BLUE }}>{row.value}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                {visitsCompleted} total sessions  ·  {countries.length} countries  ·  values are session counts not percentages
              </p>
            </Card>

            {/* Org type proportional breakdown */}
            <Card accent={TEAL} title="Participant Reach by Org Type"
              sub="Total students reached per organisation category">
              <div className="space-y-4 py-1">
                {ORG_TYPES.map((type, i) => {
                  const sessions = filtered.filter(h => h.orgType === type);
                  const part     = sessions.reduce((s, h) => s + h.participants, 0);
                  const pct      = Math.round(part / hxPart * 100);
                  const tealShades = [TEAL, TEAL_MID, TEAL_DEEP, "#081F3F"];
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-gray-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tealShades[i] }} />
                          {type}
                        </span>
                        <span className="tabular-nums text-gray-400">
                          <span className="font-bold" style={{ color: tealShades[i] }}>
                            {part.toLocaleString()}
                          </span> students  ·  {pct}%
                        </span>
                      </div>
                      <div className="h-[10px] rounded-sm overflow-hidden" style={{ backgroundColor: tealShades[i] + "18" }}>
                        <div className="h-full rounded-sm"
                          style={{ width: `${pct}%`, backgroundColor: tealShades[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-4 gap-2 text-center">
                {ORG_TYPES.map((type, i) => {
                  const count = filtered.filter(h => h.orgType === type).length;
                  const tealShades = [TEAL, TEAL_MID, TEAL_DEEP, "#081F3F"];
                  return (
                    <div key={type}>
                      <p className="text-sm font-black" style={{ color: tealShades[i] }}>{count}</p>
                      <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{type.split(" ")[0]}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>
        </section>

        {/* â”€â”€ SECTION 3: ANNUAL ACTIVITY â”€â”€â”€ */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SectionHeader title="Annual Activity" sub="Session frequency and student reach year on year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card accent={TEAL} title="Sessions Delivered per Year"
              sub="Count of HealthX sessions per calendar year">
              <ResponsiveContainer width="100%" height={188}>
                <BarChart data={sessionsPerYear} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Sessions" fill={TEAL} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card accent={BLUE} title="Student Reach per Year"
              sub="Total students across HealthX sessions  -  year-on-year growth">
              <ResponsiveContainer width="100%" height={188}>
                <AreaChart data={participantsPerYear}>
                  <defs>
                    <linearGradient id="hxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={BLUE_LIGHT} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={BLUE_LIGHT} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Area type="monotone" dataKey="Participants" stroke={BLUE_LIGHT} strokeWidth={2} fill="url(#hxGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

          </div>
        </section>

        {/* â”€â”€ SECTION 4: PERFORMANCE & GEOGRAPHY â”€â”€â”€ */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SectionHeader title="Satisfaction &amp; Geographic Reach"
            sub="Score breakdown by session type  ·  country coverage by participant volume" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card accent={TEAL_MID} title="Satisfaction Heatmap  -  Session Type Ã— Dimension"
              sub="Avg score  ·  Navy â‰¥4.5  ·  Blue â‰¥4.0  ·  Amber â‰¥3.5  ·  Orange below">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-3 uppercase tracking-wider text-[9px]">Type</th>
                      {SCORE_DIMS.map(d => (
                        <th key={d} className="text-center text-gray-400 font-bold pb-3 px-1 min-w-[60px] uppercase tracking-wider text-[9px] leading-tight">{d}</th>
                      ))}
                      <th className="text-center text-gray-400 font-bold pb-3 px-1 uppercase tracking-wider text-[9px]">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hxHeatmap.map(row => {
                      const scores = SCORE_DIMS.map(d => row[d]);
                      const rowAvg = parseFloat(avg(scores).toFixed(1));
                      return (
                        <tr key={row.type} className="border-t border-gray-100">
                          <td className="py-2.5 pr-3">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLOR[row.type] }} />
                              <span className="font-semibold text-gray-700 text-[10px] leading-tight">{row.type}</span>
                            </span>
                          </td>
                          {SCORE_DIMS.map(d => (
                            <td key={d} className="py-2.5 px-1 text-center">
                              <span className="inline-block px-2 py-1 rounded text-white text-[10px] font-bold tabular-nums"
                                style={{ backgroundColor: heatColor(row[d]) }}>
                                {row[d].toFixed(1)}
                              </span>
                            </td>
                          ))}
                          <td className="py-2.5 px-1 text-center">
                            <span className="inline-block px-2 py-1 rounded text-white text-[10px] font-bold tabular-nums"
                              style={{ backgroundColor: INDIGO }}>
                              {rowAvg.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card accent={BLUE} title="Country Reach"
              sub="Countries by total student participant volume">
              <div className="space-y-2">
                {countryData.map((row, i) => {
                  const col = COUNTRY_HEX[i % COUNTRY_HEX.length];
                  return (
                    <div key={row.name} className="flex items-center gap-2.5">
                      <div className="w-[88px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                      <div className="flex-1 h-[18px] rounded-sm overflow-hidden" style={{ backgroundColor: col + "1A" }}>
                        <div className="h-full" style={{ width: `${(row.value / countryData[0].value) * 100}%`, backgroundColor: col }} />
                      </div>
                      <div className="text-[11px] font-bold w-8 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>
        </section>

        {/* ══ CAREER EXPOSURE PLATFORM — "Explore What's Next" ══════════════ */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SectionHeader title="Career Exposure Platform — Explore What&apos;s Next"
            sub="The multi-institutional symposium: pre-event readiness sessions, the health careers exhibition, and the internship, employment and project leads it generates" />

          {/* Symposium KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <StatsKpiCard label="Institutions"      num={CX.institutions}     sub="Universities & colleges"          Icon={Building2}  tooltip="Institutions taking part — the platform is explicitly multi-institutional, not a single-campus event." />
            <StatsKpiCard label="Students Reached"  num={CX.students}         sub={`${CX.femalePct}% female`}        Icon={Users}      tooltip="Students attending the careers exhibition across all participating institutions." />
            <StatsKpiCard label="Employers"         num={CX.employers}        sub="Exhibiting at the fair"           Icon={Briefcase}  tooltip="Employers exhibiting — the supply of real opportunities students are put in front of." />
            <StatsKpiCard label="Leads Generated"   num={CX.totalLeads}       sub="Internship · employment · project" Icon={Link2}     tooltip="Total leads generated across all three types. This is the platform's core output." />
            <StatsKpiCard label="Leads Converted"   num={CX.totalConversions} sub={`${CX.conversionPct}% conversion`} Icon={TrendingUp} tooltip="Leads that became a confirmed placement, hire or project engagement." />
            <StatsKpiCard label="Partnerships"      num={CX.partnerships}     sub={`${CX.renewed} renewed`}          Icon={Handshake}  tooltip="Institutional partnerships formed or renewed through the symposium." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card title="Leads Generated vs Converted"
              sub="Internship, employment and project-based leads — and how many became real">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={CX.byLeadType} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Leads"     fill="#185FA5" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Converted" fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {([["Leads generated", "#185FA5"], ["Converted", "#0F6E56"]] as const).map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Employers by Sector"
              sub="The mix of career pathways students are exposed to at the exhibition">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CX.byEmployerSector.map((row, i) => {
                  const col = COUNTRY_HEX[i % COUNTRY_HEX.length];
                  const max = CX.byEmployerSector[0]?.value || 1;
                  return (
                    <div key={row.name} className="flex items-center gap-2.5">
                      <div className="w-[136px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                      <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
                        <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
                      </div>
                      <div className="text-[11px] font-bold w-6 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

            <Card title="Pre-Event Readiness Sessions"
              sub="Registered vs attended per topic — readiness is what makes the exhibition pay off">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={CX.byReadinessTopic} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="26%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} angle={-12} textAnchor="end" height={52} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Registered" fill="#85B7EB" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="Attended"   fill="#14306B" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {([["Registered", "#85B7EB"], ["Attended", "#14306B"]] as const).map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Symposium Growth"
              sub="Institutions, students, employers and leads — year on year">
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={CX.byYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={34} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Line type="monotone" dataKey="Students"  stroke="#14306B" strokeWidth={2.5} dot={{ r: 4, fill: "#14306B", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Leads"     stroke="#0F6E56" strokeWidth={2.5} dot={{ r: 4, fill: "#0F6E56", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Employers" stroke="#D45F2C" strokeWidth={2.5} dot={{ r: 4, fill: "#D45F2C", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {([["Students", "#14306B"], ["Leads", "#0F6E56"], ["Employers", "#D45F2C"]] as const).map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* â”€â”€ FOOTER STRIP â”€â”€â”€ */}
        <PortalFooter portal="hemp" source="HEMP HealthX M&amp;E" synced="04 Jun 2026, EAT" />

      </div>
    </div>
  );
}
