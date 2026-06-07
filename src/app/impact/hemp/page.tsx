"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  Award, Download, Globe, Star,
} from "lucide-react";

import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/missionStudents";
import type { InternshipSector } from "@/data/hemp/internships";
import type { StudentTrack } from "@/data/hemp/missionStudents";

import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Palette ─────────────────────────────────────────────────────────────────
const VIOLET = "#7C3AED";
const TEAL   = "#0D9488";
const GREEN  = "#10B981";
const AMBER  = "#F59E0B";
const SKY    = "#0EA5E9";
const ROSE   = "#F43F5E";
const INDIGO = "#4338CA";
const ORANGE = "#EA580C";
const EXEC_BG = "#f8fafc";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function fmt(n: number) { return Math.round(n).toLocaleString(); }
function pct(n: number) { return `${Math.round(n)}%`; }

function useCountUp(target: number, duration = 800): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const id = requestAnimationFrame(function tick(now) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    });
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

// ─── Filter components ────────────────────────────────────────────────────────
type Opt<T> = { label: string; value: T };

function PillGroup<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full gap-px p-0.5" style={{ backgroundColor: "rgba(0,0,0,0.18)" }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[9px] font-bold px-2.5 py-[3px] rounded-full transition-all whitespace-nowrap leading-none"
            style={{ backgroundColor: active ? "rgba(255,255,255,0.95)" : "transparent", color: active ? "#111827" : "rgba(255,255,255,0.72)" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function HeaderDropdown<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}
      className="text-[9px] font-bold rounded border appearance-none cursor-pointer focus:outline-none pl-2 pr-5 py-[5px]"
      style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        color: "white",
        borderColor: "rgba(255,255,255,0.25)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-opacity='0.75' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 6px center",
      }}>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ color: "#111827", backgroundColor: "white" }}>{o.label}</option>
      ))}
    </select>
  );
}

function SegTab<T extends string>({ options, value, onChange, accent }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  accent: string;
}) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[10px] font-semibold px-3 py-1.5 transition-all whitespace-nowrap border-r border-gray-200 last:border-0"
            style={{ backgroundColor: active ? accent : "white", color: active ? "white" : "#6B7280" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── UI atoms ─────────────────────────────────────────────────────────────────
function SecHeader({ title, sub, accent = TEAL }: { title: string; sub?: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: accent }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = TEAL, children, headerRight }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode; headerRight?: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  async function handleDownload() {
    if (!cardRef.current) return;
    const h2c = (await import("html2canvas")).default;
    const canvas = await h2c(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const a = document.createElement("a");
    a.download = title.replace(/[^a-z0-9]/gi, "_") + ".png";
    a.href = canvas.toDataURL();
    a.click();
  }
  return (
    <div ref={cardRef} className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 flex items-start justify-between gap-3" style={{ backgroundColor: accent }}>
        <div className="flex items-start gap-2.5">
          <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
            {sub && <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {headerRight}
          <button onClick={handleDownload} title="Download chart"
            style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}>
            <Download size={12} />
          </button>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string; sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded-lg border px-3 py-3 text-center transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-[1.1rem] font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.58)" }}>{sub}</p>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />{label}</span>
      <span className="font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
        <span className="font-medium truncate pr-2">{label}</span>
        <span className="font-bold tabular-nums flex-shrink-0" style={{ color }}>{fmt(value)}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: color + "22" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

const SECTORS: InternshipSector[] = ["Hospital", "NGO", "Government", "MedTech", "Pharma", "Research"];
const TRACKS: StudentTrack[] = ["Health Innovation", "Health Management", "Health Policy", "Digital Health"];
const TRACK_COLORS = [TEAL, AMBER, VIOLET, SKY];
const SECTOR_COLORS = [ROSE, TEAL, INDIGO, ORANGE, VIOLET, GREEN];

const HX_COUNTRIES = Array.from(new Set(healthXSessions.map((h) => h.country)));
const INT_COUNTRIES = Array.from(new Set(internships.map((i) => i.country)));
const ALL_COUNTRIES_HEMP = Array.from(new Set([...HX_COUNTRIES, ...INT_COUNTRIES]));

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HEMPImpactPage() {
  const [yearFilter,    setYearFilter]    = useState<YearVal>("all");
  const [trackFilter,   setTrackFilter]   = useState<StudentTrack | "all">("all");
  const [sectorFilter,  setSectorFilter]  = useState<InternshipSector | "all">("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  // Analytical drill-down states
  const [internView,    setInternView]    = useState<"volume" | "rate">("volume");
  const [cohortGender,  setCohortGender]  = useState<"all" | "female" | "male">("all");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "Employed" | "Entrepreneur" | "Further Study" | "Seeking">("all");

  const D = useMemo(() => {
    const yr = yearFilter;
    const ctry = countryFilter;

    const hx  = healthXSessions.filter((h) =>
      (yr === "all" || h.year === yr) &&
      (ctry === "all" || h.country === ctry));

    const int = internships.filter((i) =>
      (yr === "all" || i.year === yr) &&
      (ctry === "all" || i.country === ctry) &&
      (sectorFilter === "all" || i.sector === sectorFilter));

    const ms  = missionStudents.filter((s) =>
      (yr === "all" || s.cohort === yr) &&
      (trackFilter === "all" || s.track === trackFilter));

    // HealthX
    const hxPart     = hx.reduce((s, h) => s + h.participants, 0);
    const hxFem      = hx.reduce((s, h) => s + h.femalePart, 0);
    const hxPartners = hx.reduce((s, h) => s + h.partnerships, 0);
    const hxAvgCompl = Math.round(avg(hx.map((h) => h.completionRate)));
    const hxAvgSat   = parseFloat(avg(hx.map((h) => avg(Object.values(h.scores)))).toFixed(1));
    const hxFemalePct = hxPart > 0 ? Math.round((hxFem / hxPart) * 100) : 0;

    // HX by type
    const hxTypes = (["Health Facility Visit", "Innovation Challenge", "Field Exposure", "Industry Tour"] as const);
    const hxByType = hxTypes.map((t) => ({
      name: t, value: hx.filter((h) => h.type === t).reduce((s, h) => s + h.participants, 0),
    }));

    // HX year trend
    const hxByYear = YEARS.map((y) => ({
      Year: String(y),
      Participants: healthXSessions.filter((h) =>
        h.year === y && (ctry === "all" || h.country === ctry)).reduce((s, h) => s + h.participants, 0),
    }));

    // Internships
    const intStudents = int.reduce((s, i) => s + i.students, 0);
    const intFem      = int.reduce((s, i) => s + i.femaleStudents, 0);
    const intConv     = int.reduce((s, i) => s + i.employmentConversions, 0);
    const intPlace    = int.reduce((s, i) => s + i.placementsAfterInternship, 0);
    const intAvgSat   = parseFloat(avg(int.map((i) => i.satisfactionScore)).toFixed(1));

    // Internships by sector
    const intBySector = SECTORS.map((sec) => {
      const filtered = int.filter((i) => i.sector === sec);
      return {
        name: sec,
        Students: filtered.reduce((s, i) => s + i.students, 0),
        Placements: filtered.reduce((s, i) => s + i.placementsAfterInternship, 0),
      };
    }).filter((s) => s.Students > 0);

    // Internship year trend — supports volume and conversion-rate views
    const intByYear = YEARS.map((y) => {
      const base = internships.filter((i) => i.year === y && (ctry === "all" || i.country === ctry) && (sectorFilter === "all" || i.sector === sectorFilter));
      const students    = base.reduce((s, i) => s + i.students, 0);
      const placements  = base.reduce((s, i) => s + i.placementsAfterInternship, 0);
      const conversions = base.reduce((s, i) => s + i.employmentConversions, 0);
      return {
        Year: String(y),
        Students:   students,
        Placements: placements,
        "Conversion Rate %":  students > 0 ? Math.round((conversions / students) * 100) : 0,
        "Placement Rate %":   students > 0 ? Math.round((placements / students) * 100) : 0,
      };
    }).filter((d) => d.Students > 0);

    // Mission Students
    const msTotal    = ms.length;
    const msFem      = ms.filter((s) => s.gender === "Female").length;
    const msCompleted = ms.filter((s) => s.status === "Completed");
    const msEmployed  = msCompleted.filter((s) => s.employment === "Employed" || s.employment === "Entrepreneur");
    const msVentures  = ms.filter((s) => s.ventureCreated).length;
    const msCompPct   = msTotal > 0 ? Math.round((msCompleted.length / msTotal) * 100) : 0;
    const msFemPct    = msTotal > 0 ? Math.round((msFem / msTotal) * 100) : 0;

    // Mission by cohort — supports gender breakdown (analytical: is female enrollment growing?)
    const msByCohort = YEARS.map((y) => {
      const pool = missionStudents.filter((s) => s.cohort === y && (trackFilter === "all" || s.track === trackFilter));
      return {
        Year: String(y),
        Students: cohortGender === "all" ? pool.length
          : cohortGender === "female" ? pool.filter((s) => s.gender === "Female").length
          : pool.filter((s) => s.gender === "Male").length,
        Total: pool.length,
      };
    }).filter((d) => d.Total > 0);

    // Mission by track
    const msByTrack = TRACKS.map((t) => ({
      name: t.replace("Health ", ""),
      value: missionStudents.filter((s) => s.track === t && (yr === "all" || s.cohort === yr)).length,
    }));

    // Employment by track — supports outcome type drill-down
    const empByTrack = TRACKS.map((t, i) => {
      const completed = missionStudents.filter((s) =>
        s.track === t && s.status === "Completed" &&
        (yr === "all" || s.cohort === yr));
      const matchOutcome = (emp: string | null) => {
        if (outcomeFilter === "all") return emp === "Employed" || emp === "Entrepreneur";
        return emp === outcomeFilter;
      };
      const employed = completed.filter((s) => matchOutcome(s.employment));
      return {
        name: t.replace("Health ", ""),
        Completed: completed.length,
        Employed: employed.length,
        color: TRACK_COLORS[i],
      };
    });

    // Totals
    const total = hxPart + intStudents + msTotal;
    const totalFem = hxFem + intFem + msFem;
    const femalePct = total > 0 ? Math.round((totalFem / total) * 100) : 0;
    const avgSat = parseFloat(avg([hxAvgSat, intAvgSat].filter((x) => x > 0)).toFixed(1));

    const countries = Array.from(new Set([
      ...hx.map((h) => h.country),
      ...int.map((i) => i.country),
    ])).filter(Boolean);

    return {
      hx, int, ms,
      hxPart, hxFem, hxPartners, hxAvgCompl, hxAvgSat, hxFemalePct, hxByType, hxByYear,
      intStudents, intFem, intConv, intPlace, intAvgSat, intBySector, intByYear,
      msTotal, msFem, msCompleted, msEmployed, msVentures, msCompPct, msFemPct,
      msByCohort, msByTrack, empByTrack,
      total, totalFem, femalePct, avgSat, countries,
    };
  }, [yearFilter, trackFilter, sectorFilter, countryFilter, cohortGender, outcomeFilter]);

  const yearOpts: Opt<YearVal>[] = [{ label: "All Years", value: "all" }, ...YEARS.map((y) => ({ label: String(y), value: y as YearVal }))];
  const trackOpts: Opt<StudentTrack | "all">[] = [{ label: "All Tracks", value: "all" }, ...TRACKS.map((t) => ({ label: t.replace("Health ", ""), value: t }))];
  const sectorOpts: Opt<InternshipSector | "all">[] = [{ label: "All Sectors", value: "all" }, ...SECTORS.map((s) => ({ label: s, value: s }))];
  const countryOpts: Opt<string>[] = [{ label: "All Countries", value: "all" }, ...ALL_COUNTRIES_HEMP.map((c) => ({ label: c, value: c }))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: EXEC_BG }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-start justify-between py-5 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-none">HEMP Impact Analytics</h1>
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Employment Pillar · HealthX · Internships · Mission Students · {D.countries.length} countries
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={String(yearFilter)} onChange={(e) => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)}
                className="text-xs font-medium border border-gray-200 text-gray-700 bg-white px-3 py-2 rounded appearance-none cursor-pointer hover:border-gray-400 focus:outline-none transition-colors pr-7"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                <option value="all">All Years</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}
                className="text-xs font-medium border border-gray-200 text-gray-700 bg-white px-3 py-2 rounded appearance-none cursor-pointer hover:border-gray-400 focus:outline-none transition-colors pr-7"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                {countryOpts.slice(0, 8).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 gap-2">
              <KpiTile label="Total Reach"          num={D.total}          displayFmt={fmt}  sub="All HEMP"             clr={TEAL}   />
              <KpiTile label="HealthX Part."         num={D.hxPart}        displayFmt={fmt}  sub={`${D.hx.length} sessions`} clr="#0F766E" />
              <KpiTile label="Internship Students"   num={D.intStudents}   displayFmt={fmt}  sub={`${D.int.length} placements`} clr={AMBER} />
              <KpiTile label="Emp. Conversions"      num={D.intConv}       displayFmt={fmt}  sub="Post-internship"      clr={GREEN}  />
              <KpiTile label="Mission Students"      num={D.msTotal}       displayFmt={fmt}  sub={`${D.ms.length} enrolled`} clr={VIOLET} />
              <KpiTile label="Mission Completions"   num={D.msCompPct}     displayFmt={pct}  sub="Completion rate"      clr={INDIGO} />
              <KpiTile label="Ventures Created"      num={D.msVentures}    displayFmt={fmt}  sub="By mission students"  clr={ORANGE} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-10">

        {/* ── HealthX ──────────────────────────────────────────────────────── */}
        <section>
          <SecHeader title="HealthX Experiential Learning" sub="Health facility visits, innovation challenges, field exposure, and industry tours" accent={TEAL} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="HealthX Participation Trend" sub="Participants per year" accent={TEAL}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={D.hxByYear.filter((d) => d.Participants > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="Participants" fill={TEAL} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded border p-3 text-center" style={{ backgroundColor: TEAL + "10", borderColor: TEAL + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Avg completion</p>
                  <p className="text-lg font-black tabular-nums" style={{ color: TEAL }}>{D.hxAvgCompl}%</p>
                </div>
                <div className="rounded border p-3 text-center" style={{ backgroundColor: SKY + "10", borderColor: SKY + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Avg satisfaction</p>
                  <p className="text-lg font-black tabular-nums" style={{ color: SKY }}>{D.hxAvgSat}/5</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Session Types" sub="Participants by HealthX experience type" accent={TEAL}>
              <div className="space-y-3 mt-2">
                {D.hxByType.filter((t) => t.value > 0).map((t, i) => {
                  const tc = [TEAL, SKY, VIOLET, ORANGE];
                  const maxVal = Math.max(...D.hxByType.map((x) => x.value), 1);
                  return <HBar key={t.name} label={t.name} value={t.value} max={maxVal} color={tc[i % tc.length]} />;
                })}
              </div>
              <div className="mt-4 space-y-2 pt-3 border-t border-gray-100">
                <StatRow label="Total sessions"   value={D.hx.length}     color={TEAL}  />
                <StatRow label="Partnerships"      value={D.hxPartners}   color={GREEN} />
                <StatRow label="Female participants" value={pct(D.hxFemalePct)} color={ROSE} />
              </div>
            </ChartCard>

            <ChartCard title="HealthX Quality Scores" sub="Session evaluation breakdown" accent={SKY}>
              <div className="space-y-3 mt-1">
                {(["Learning Experience", "Practical Relevance", "Accessibility", "Innovation Impact"] as const).map((score, i) => {
                  const sc = [TEAL, VIOLET, AMBER, ORANGE];
                  const val = parseFloat(avg(D.hx.map((h) => h.scores[score])).toFixed(1));
                  return (
                    <div key={score}>
                      <div className="flex items-center justify-between text-[10px] text-gray-700 mb-1">
                        <span className="font-medium">{score}</span>
                        <span className="font-black tabular-nums" style={{ color: sc[i] }}>{val}/5</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: sc[i] + "20" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(val / 5) * 100}%`, backgroundColor: sc[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded border p-3 flex items-center gap-2" style={{ backgroundColor: SKY + "08", borderColor: SKY + "22" }}>
                <Star size={14} color={SKY} />
                <p className="text-[10px] font-bold text-gray-600">Overall HealthX satisfaction</p>
                <p className="text-sm font-black tabular-nums ml-auto" style={{ color: SKY }}>{D.hxAvgSat}/5</p>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── Internships ───────────────────────────────────────────────────── */}
        <section>
          <SecHeader title="Internship & Placement Analytics" sub="Workplace training, employment conversions, and sector-level outcomes" accent={AMBER} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ChartCard
                title="Students & Placements by Year"
                sub={internView === "volume" ? "Enrolment vs post-programme placements" : "Conversion & placement rates — % of students achieving outcomes"}
                accent={AMBER}
                headerRight={
                  <PillGroup
                    options={[{ label: "Volume", value: "volume" }, { label: "Conversion Rate", value: "rate" }]}
                    value={internView} onChange={setInternView} />
                }>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={D.intByYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28}
                      tickFormatter={internView === "rate" ? (v) => `${v}%` : undefined} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      formatter={internView === "rate" ? (v: number, name: string) => [`${v}%`, name] : undefined}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    {internView === "volume" ? (
                      <>
                        <Bar dataKey="Students"   fill={AMBER} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Placements" fill={TEAL}  radius={[4, 4, 0, 0]} />
                      </>
                    ) : (
                      <>
                        <Bar dataKey="Conversion Rate %" fill={TEAL}  radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Placement Rate %"  fill={GREEN} radius={[4, 4, 0, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Students",     value: D.intStudents, color: AMBER  },
                    { label: "Conversions",  value: D.intConv,     color: TEAL   },
                    { label: "Placements",   value: D.intPlace,    color: GREEN  },
                    { label: "Satisfaction", value: `${D.intAvgSat}/5`, color: SKY },
                  ].map((r) => (
                    <div key={r.label} className="rounded border p-2.5" style={{ backgroundColor: r.color + "10", borderColor: r.color + "22" }}>
                      <p className="text-[9px] font-bold uppercase text-gray-500">{r.label}</p>
                      <p className="text-base font-black tabular-nums mt-0.5" style={{ color: r.color }}>{typeof r.value === "number" ? fmt(r.value) : r.value}</p>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Students by Sector" sub={sectorFilter === "all" ? "All sectors" : sectorFilter} accent={AMBER}
              headerRight={<HeaderDropdown options={sectorOpts} value={sectorFilter} onChange={setSectorFilter} />}>
              <div className="space-y-2 mt-1">
                {D.intBySector.map((s, i) => {
                  const maxVal = Math.max(...D.intBySector.map((x) => x.Students), 1);
                  const isActive = sectorFilter === "all" || sectorFilter === SECTORS[SECTORS.indexOf(s.name as InternshipSector)];
                  return (
                    <div key={s.name} style={{ opacity: isActive ? 1 : 0.35, transition: "opacity 0.2s" }}>
                      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                        <span className="font-medium">{s.name}</span>
                        <span className="flex gap-2">
                          <span className="font-bold tabular-nums" style={{ color: SECTOR_COLORS[i % SECTOR_COLORS.length] }}>{fmt(s.Students)}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-bold tabular-nums" style={{ color: TEAL }}>{fmt(s.Placements)}</span>
                        </span>
                      </div>
                      <div className="flex gap-1 h-1.5">
                        <div className="rounded-full" style={{ width: `${(s.Students / maxVal) * 100}%`, backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] + "99" }} />
                        <div className="rounded-full" style={{ width: `${(s.Placements / maxVal) * 100}%`, backgroundColor: TEAL + "CC" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full" style={{ backgroundColor: AMBER + "99" }} />Students</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full" style={{ backgroundColor: TEAL + "CC" }} />Placements</span>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── Mission Students ─────────────────────────────────────────────── */}
        <section>
          <SecHeader title="Mission Students Outcomes" sub="Cohort progression, track distribution, employment, and venture creation" accent={VIOLET} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Cohort Enrolment"
              sub={cohortGender === "all" ? "Total enrolment per intake year" : `${cohortGender === "female" ? "Female" : "Male"} enrolment trend by cohort`}
              accent={VIOLET}
              headerRight={
                <PillGroup
                  options={[{ label: "All", value: "all" }, { label: "Female", value: "female" }, { label: "Male", value: "male" }]}
                  value={cohortGender} onChange={setCohortGender} />
              }>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={D.msByCohort}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="Students" fill={VIOLET} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded border p-3 text-center" style={{ backgroundColor: VIOLET + "10", borderColor: VIOLET + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Completion rate</p>
                  <p className="text-xl font-black tabular-nums" style={{ color: VIOLET }}>{D.msCompPct}%</p>
                </div>
                <div className="rounded border p-3 text-center" style={{ backgroundColor: ROSE + "10", borderColor: ROSE + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Female</p>
                  <p className="text-xl font-black tabular-nums" style={{ color: ROSE }}>{D.msFemPct}%</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Track Distribution" sub="Students by programme track" accent={VIOLET}
              headerRight={<HeaderDropdown options={trackOpts} value={trackFilter} onChange={setTrackFilter} />}>
              <div className="space-y-3 mt-1">
                {D.msByTrack.map((t, i) => {
                  const max = Math.max(...D.msByTrack.map((x) => x.value), 1);
                  const isActive = trackFilter === "all" || TRACKS[i].replace("Health ", "") === t.name;
                  return (
                    <div key={t.name} style={{ opacity: isActive ? 1 : 0.35, transition: "opacity 0.2s" }}>
                      <div className="flex items-center justify-between text-[10px] text-gray-700 mb-1">
                        <span className="font-medium">{t.name}</span>
                        <span className="font-bold tabular-nums" style={{ color: TRACK_COLORS[i] }}>{fmt(t.value)}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: TRACK_COLORS[i] + "20" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(t.value / max) * 100}%`, backgroundColor: TRACK_COLORS[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1.5 pt-3 border-t border-gray-100">
                <StatRow label="Employed / Entrepreneur" value={fmt(D.msEmployed.length)}  color={GREEN}  />
                <StatRow label="Ventures created"        value={fmt(D.msVentures)}         color={ORANGE} />
                <StatRow label="Total completions"       value={fmt(D.msCompleted.length)} color={VIOLET} />
              </div>
            </ChartCard>

            <ChartCard title="Employment by Track"
              sub={outcomeFilter === "all" ? "Employed or entrepreneur — by programme track" : `${outcomeFilter} outcomes by track`}
              accent={GREEN}
              headerRight={
                <HeaderDropdown
                  options={[
                    { label: "Employed / Entrep.", value: "all" },
                    { label: "Employed", value: "Employed" },
                    { label: "Entrepreneur", value: "Entrepreneur" },
                    { label: "Further Study", value: "Further Study" },
                    { label: "Seeking", value: "Seeking" },
                  ]}
                  value={outcomeFilter} onChange={setOutcomeFilter} />
              }>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={D.empByTrack.filter((t) => t.Completed > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={26} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Completed" fill={VIOLET} radius={[4, 4, 0, 0]} opacity={0.5} />
                  <Bar dataKey="Employed"  fill={GREEN}  radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 rounded border p-3 flex items-center gap-2" style={{ backgroundColor: GREEN + "08", borderColor: GREEN + "22" }}>
                <Award size={14} color={GREEN} />
                <p className="text-[10px] font-bold text-gray-600">{outcomeFilter === "all" ? "Mission employment rate" : `${outcomeFilter} rate`}</p>
                <p className="text-sm font-black tabular-nums ml-auto" style={{ color: GREEN }}>
                  {D.msCompleted.length > 0 ? pct(Math.round((D.msEmployed.length / D.msCompleted.length) * 100)) : "—"}
                </p>
              </div>
            </ChartCard>
          </div>
        </section>

        <footer className="border-t border-gray-200 pt-6 pb-10">
          <p className="text-[10px] text-gray-400">
            HEMP Impact · {yearFilter === "all" ? "2021–2026" : String(yearFilter)} · {fmt(D.total)} participants · {D.countries.length} countries
          </p>
        </footer>
      </div>
    </div>
  );
}
