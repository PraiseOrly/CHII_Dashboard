"use client";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Briefcase, Download, FileText, MapPin, Handshake, Users } from "lucide-react";
import HEMPNav from "@/components/HEMPNav";
import { healthXSessions, ORG_TYPES } from "@/data/hemp/healthx";

// â”€â”€â”€ Color language â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Primary: teal (partnership / field theme)
// Supporting: blue
// Warning: amber
const TEAL        = "#1B4332"; // forest (HealthX primary, mirrors overview)
const TEAL_MID    = "#2D6A4F";
const TEAL_DEEP   = "#0E4633";
const BLUE        = "#40916C"; // supporting green
const BLUE_LIGHT  = "#52B788";
const AMBER       = "#F59E0B";
const NAVY        = "#002147";
const GREEN       = "#10B981";
const INDIGO      = "#1F9E9E"; // dusty teal-green (avg badge)
const ROSE        = "#F43F5E";
const VIOLET      = "#A6C13C"; // olive (distinct category accent)

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

const COUNTRY_HEX = [TEAL, BLUE_LIGHT, AMBER, VIOLET, GREEN, INDIGO, ROSE, "#A855F7", "#EC4899", "#6B7280"];

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(14,70,51,0.6)" }}>
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-[11px] font-medium normal-case tracking-normal rounded-md px-2 py-1 outline-none cursor-pointer"
        style={{ color: "#0E4633", border: "1px solid rgba(14,70,51,0.2)", backgroundColor: "white" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function useCountUp(target: number, duration = 750): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start: number | null = null;
    function tick(now: number) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    }
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

function heatColor(v: number): string {
  if (v >= 4.5) return TEAL;
  if (v >= 4.0) return BLUE;
  if (v >= 3.5) return AMBER;
  return ROSE;
}

function SecHeader({ title, sub }: { title: string; sub?: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#2D6A4F" }} />
      <div>
        <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: "#2D6A4F", letterSpacing: "0.01em" }}>{title}</h2>
        {sub && <p className="mt-0.5" style={{ fontSize: 11, color: "#6B7280" }}>{sub}</p>}
      </div>
    </div>
  );
}

function Card({ title, sub, children }: {
  accent?: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#2D6A4F", padding: "11px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.8)" }} />
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

  // â”€â”€ Animate headline numbers â”€â”€
  const animVisits  = useCountUp(visitsCompleted);
  const animPships  = useCountUp(totalPships);
  const animPart    = useCountUp(hxPart);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HEMPNav />

      {/* â”€â”€ HEADER â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#2D6A4F", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/hempdesign.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
        <img src="/images/hempdesign.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(45,106,79,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(45,106,79,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>HealthX</h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Briefcase size={11} style={{ color: "#B7E4C7" }} />
                <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#B7E4C7" }}>HEMP</span>
              </span>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(214,236,224,0.82)" }}>
              Field-based learning  ·  {YEARS[0]} - {YEARS[YEARS.length - 1]}  ·  {visitsCompleted} sessions  ·  {countries.length} countries
            </p>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ THREE HEADLINE METRICS â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 pt-6">

          {/* â”€â”€ THREE HEADLINE METRICS â”€â”€â”€ */}
          <div className="pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: TEAL, borderColor: TEAL }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <MapPin size={18} style={{ color: "rgba(255,255,255,0.9)" }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "rgba(255,255,255,0.65)" }}>Health Hub Visits Completed</p>
                <p className="text-3xl font-black tabular-nums leading-none text-white mt-1">
                  {Math.round(animVisits)}
                </p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {YEARS[0]} - {YEARS[YEARS.length - 1]}  ·  {countries.length} countries
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: TEAL_MID, borderColor: TEAL_MID }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <Handshake size={18} style={{ color: "rgba(255,255,255,0.9)" }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "rgba(255,255,255,0.65)" }}>Active Partnerships (MOUs Signed)</p>
                <p className="text-3xl font-black tabular-nums leading-none text-white mt-1">
                  {Math.round(animPships)}
                </p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {mouSigned} org sites with formal agreements
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: BLUE, borderColor: BLUE }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <Users size={18} style={{ color: "rgba(255,255,255,0.9)" }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "rgba(255,255,255,0.65)" }}>Students with Field Exposure</p>
                <p className="text-3xl font-black tabular-nums leading-none text-white mt-1">
                  {Math.round(animPart).toLocaleString()}
                </p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {femalePct}% female  ·  {avgComp}% avg completion
                </p>
              </div>
            </div>

          </div>
      </div>

      {/* â”€â”€ BODY â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* â”€â”€ FILTER BAR â”€â”€â”€ */}
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg px-4 py-3 border" style={{ borderColor: "rgba(14,70,51,0.12)" }}>
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#2D6A4F" }}>Filters</span>
          <FilterSelect label="Year"    value={fYear}    onChange={setFYear}    options={["All Years", ...YEARS.map(String)]} />
          <FilterSelect label="Country" value={fCountry} onChange={setFCountry} options={["All Countries", ...ALL_COUNTRIES]} />
          <FilterSelect label="Type"    value={fType}    onChange={setFType}    options={["All Types", ...HX_SESSION_TYPES]} />
          {(fYear !== "All Years" || fCountry !== "All Countries" || fType !== "All Types") && (
            <button onClick={() => { setFYear("All Years"); setFCountry("All Countries"); setFType("All Types"); }}
              className="text-[10px] font-semibold uppercase tracking-wide ml-auto" style={{ color: "rgba(14,70,51,0.6)" }}>
              Reset
            </button>
          )}
        </div>

        {/* â”€â”€ SECTION 1: PIPELINE + FEEDBACK â”€â”€â”€ */}
        <section>
          <SecHeader title="Partnership Pipeline &amp; Student Feedback"
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
        <section>
          <SecHeader title="Visits by Organisation Type"
            sub="Count of HealthX sessions per host organisation category  -  absolute numbers" accent={BLUE} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card accent={BLUE} title="Sessions by Organisation Type"
              sub="Blue fill bars  -  absolute session counts per org category">
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
                  const tealShades = [TEAL, TEAL_MID, TEAL_DEEP, "#08331F"];
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
                  const tealShades = [TEAL, TEAL_MID, TEAL_DEEP, "#08331F"];
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
        <section>
          <SecHeader title="Annual Activity" sub="Session frequency and student reach year on year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card accent={TEAL} title="Sessions Delivered per Year"
              sub="Count of HealthX sessions per calendar year">
              <ResponsiveContainer width="100%" height={188}>
                <BarChart data={sessionsPerYear} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v} session${v !== 1 ? "s" : ""}`, "HealthX"]} />
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
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v.toLocaleString()} students`, "Reach"]} />
                  <Area type="monotone" dataKey="Participants" stroke={BLUE_LIGHT} strokeWidth={2} fill="url(#hxGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

          </div>
        </section>

        {/* â”€â”€ SECTION 4: PERFORMANCE & GEOGRAPHY â”€â”€â”€ */}
        <section>
          <SecHeader title="Satisfaction &amp; Geographic Reach"
            sub="Score breakdown by session type  ·  country coverage by participant volume" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card accent={TEAL_MID} title="Satisfaction Heatmap  -  Session Type Ã— Dimension"
              sub="Avg score  ·  Teal â‰¥4.5  ·  Blue â‰¥4.0  ·  Amber â‰¥3.5">
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

        {/* â”€â”€ FOOTER STRIP â”€â”€â”€ */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#2D6A4F", minHeight: 116, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/hempdesign.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
          <img src="/images/hempdesign.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(45,106,79,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(45,106,79,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>Africa&apos;s Oasis for Health &amp; Education Transformation</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(214,236,224,0.85)" }}><span style={{ color: "#B7E4C7", fontWeight: 600 }}>Data Last Synced:</span> 04 Jun 2026, EAT</span>
              <span style={{ fontSize: 11, color: "rgba(214,236,224,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(214,236,224,0.85)" }}><span style={{ color: "#B7E4C7", fontWeight: 600 }}>Source:</span> HEMP HealthX M&amp;E</span>
              <span style={{ fontSize: 11, color: "rgba(214,236,224,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(214,236,224,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>Contact Analyst</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
