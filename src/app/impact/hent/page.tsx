"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award, Globe, Star, TrendingUp,
} from "lucide-react";

import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { fieldVisits } from "@/data/fieldVisits";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures } from "@/data/ventures";
import type { Stage, Sector, FundingStatus } from "@/types";

import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
  RadialBar, RadialBarChart,
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

// ─── Contextual filter components ────────────────────────────────────────────
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
            style={{
              backgroundColor: active ? "rgba(255,255,255,0.95)" : "transparent",
              color: active ? "#111827" : "rgba(255,255,255,0.72)",
            }}>
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

// ─── UI atoms ─────────────────────────────────────────────────────────────────
function SecHeader({ title, sub, accent = VIOLET }: { title: string; sub?: string; accent?: string }) {
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

function ChartCard({ title, sub, accent = VIOLET, children, headerRight }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode; headerRight?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 flex items-start justify-between gap-3" style={{ backgroundColor: accent }}>
        <div className="flex items-start gap-2.5">
          <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
            {sub && <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
          </div>
        </div>
        {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
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

function HBar({ label, value, max, color, dimmed = false }: { label: string; value: number; max: number; color: string; dimmed?: boolean }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-2.5 last:mb-0" style={{ opacity: dimmed ? 0.4 : 1, transition: "opacity 0.2s" }}>
      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{fmt(value)}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: color + "22" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const YEARS = [2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

const HENT_PROGRAMS = ["Hackathons", "Masterclasses", "Field Visits", "Mentorship"] as const;
type ProgramVal = typeof HENT_PROGRAMS[number] | "all";

const VENTURE_STAGES: Stage[] = ["Ideation", "Validation", "Prototype/MVP", "Early Growth", "Scaling", "Investment/Funding"];
const VENTURE_SECTORS: Sector[] = ["Digital Health", "Medical Devices", "Diagnostics", "Health Logistics", "Pharma & Biotech", "Mental Health", "Maternal & Child Health", "Health Financing", "Community Health", "Health Data & AI"];
const STAGE_COLORS = [AMBER, ORANGE, TEAL, SKY, VIOLET, GREEN];
const SECTOR_COLORS = [TEAL, VIOLET, ORANGE, SKY, ROSE, GREEN, AMBER, INDIGO, "#8B5CF6", "#06B6D4"];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HENTImpactPage() {
  const [yearFilter,    setYearFilter]    = useState<YearVal>("all");
  const [programFilter, setProgramFilter] = useState<ProgramVal>("all");
  const [stageFilter,   setStageFilter]   = useState<Stage | "all">("all");
  const [sectorFilter,  setSectorFilter]  = useState<Sector | "all">("all");
  // Analytical drill-down states
  const [growthMetric,    setGrowthMetric]    = useState<"participants" | "projects" | "startups">("participants");
  const [fundingStage,    setFundingStage]    = useState<Stage | "all">("all");
  const [portfolioGender, setPortfolioGender] = useState<"all" | "female" | "male" | "mixed">("all");

  const D = useMemo(() => {
    const yr = yearFilter;
    const hak = hackathons.filter((h) => yr === "all" || h.year === yr);
    const mc  = masterclasses.filter((m) => yr === "all" || m.year === yr);
    const fv  = fieldVisits.filter((v) => yr === "all" || v.year === yr);
    const mf  = mentorshipPrograms.filter((p) => yr === "all" || p.year === yr);
    const vc  = ventures.filter((v) => (yr === "all" || v.cohort === yr) && (stageFilter === "all" || v.stage === stageFilter) && (sectorFilter === "all" || v.sector === sectorFilter));
    const vcAll = ventures.filter((v) => yr === "all" || v.cohort === yr);

    const hakPart    = hak.reduce((s, h) => s + h.participants, 0);
    const hakFem     = hak.reduce((s, h) => s + h.femaleCount, 0);
    const hakProj    = hak.reduce((s, h) => s + h.projects, 0);
    const hakStart   = hak.reduce((s, h) => s + h.startupsCreated, 0);
    const hakPart_   = hak.reduce((s, h) => s + h.partnerships, 0);
    const hakAvgSat  = 4.3; // static for hackathons (no scores field)

    const mcAtt      = mc.reduce((s, m) => s + m.attendees, 0);
    const mcFem      = mc.reduce((s, m) => s + m.femaleAttendees, 0);
    const mcCompl    = Math.round(avg(mc.map((m) => m.completionRate)));
    const mcSat      = parseFloat(avg(mc.map((m) => avg(Object.values(m.scores)))).toFixed(1));

    const fvPart     = fv.reduce((s, v) => s + v.participants, 0);
    const fvFem      = fv.reduce((s, v) => s + v.femaleParticipants, 0);
    const fvCompl    = Math.round(avg(fv.map((v) => v.completionRate)));
    const fvSat      = parseFloat(avg(fv.map((v) => avg(Object.values(v.scores)))).toFixed(1));
    const fvPart_    = fv.reduce((s, v) => s + v.partnerships, 0);

    const mfFel      = mf.reduce((s, p) => s + p.fellows, 0);
    const mfFem      = mf.reduce((s, p) => s + p.femaleFellows, 0);
    const mfCompl    = Math.round(avg(mf.map((p) => p.completionRate)));
    const mfSat      = parseFloat(avg(mf.map((p) => avg(Object.values(p.scores)))).toFixed(1));
    const mfGrad     = mf.filter((p) => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0);

    const totalPart  = hakPart + mcAtt + fvPart + mfFel;
    const totalFem   = hakFem + mcFem + fvFem + mfFem;
    const femalePct  = totalPart > 0 ? Math.round((totalFem / totalPart) * 100) : 0;
    const avgSat     = parseFloat(avg([mcSat, fvSat, mfSat].filter((x) => x > 0)).toFixed(1));

    // Venture analytics
    const stageDist = VENTURE_STAGES.map((s) => ({ name: s, value: vcAll.filter((v) => v.stage === s).length }));
    const sectorDist = VENTURE_SECTORS.map((s) => ({
      name: s.length > 16 ? s.slice(0, 14) + "…" : s, full: s,
      value: vcAll.filter((v) => v.sector === s).length,
    }));
    const fundingDist: { name: FundingStatus; value: number }[] = [
      "Bootstrapped", "Grant", "Angel", "VC", "Revenue-Based", "None",
    ].map((f) => ({ name: f as FundingStatus, value: vcAll.filter((v) => v.fundingStatus === f).length }));

    const countries = Array.from(new Set([
      ...hak.map((h) => h.location.split(", ").pop() ?? ""),
      ...fv.map((v) => v.country),
    ])).filter(Boolean);

    // Programme volume by year — supports metric switching (participants / projects / startups)
    const volByYear = YEARS.map((y) => ({
      Year: String(y),
      Hackathons:    hackathons.filter((h) => h.year === y).reduce((s, h) => s + h.participants, 0),
      Masterclasses: masterclasses.filter((m) => m.year === y).reduce((s, m) => s + m.attendees, 0),
      "Field Visits": fieldVisits.filter((v) => v.year === y).reduce((s, v) => s + v.participants, 0),
      Mentorship:    mentorshipPrograms.filter((p) => p.year === y).reduce((s, p) => s + p.fellows, 0),
      // Innovation output metrics (for metric toggle)
      Projects:  hackathons.filter((h) => h.year === y).reduce((s, h) => s + h.projects, 0),
      Startups:  hackathons.filter((h) => h.year === y).reduce((s, h) => s + h.startupsCreated, 0),
    }));

    // Funding breakdown filtered by stage (analytical: which funding types do ventures at each stage use?)
    const fundingByStage: { name: FundingStatus; value: number }[] = (["Bootstrapped", "Grant", "Angel", "VC", "Revenue-Based", "None"] as FundingStatus[]).map((f) => ({
      name: f,
      value: vcAll.filter((v) => (fundingStage === "all" || v.stage === fundingStage) && v.fundingStatus === f).length,
    }));

    // Gender lens on stage distribution (analytical: which stages have most female-led ventures?)
    const stageDistGender = VENTURE_STAGES.map((s) => {
      const pool = vcAll.filter((v) => v.stage === s);
      const filtered = portfolioGender === "all" ? pool
        : portfolioGender === "female" ? pool.filter((v) => v.teamGender === "Female")
        : portfolioGender === "male"   ? pool.filter((v) => v.teamGender === "Male")
        : pool.filter((v) => v.teamGender === "Mixed");
      return { name: s, value: filtered.length, total: pool.length };
    });

    // Quality scores
    const qualityRows = [
      { name: "Masterclasses",  sat: mcSat,  compl: mcCompl,  color: SKY    },
      { name: "Field Visits",   sat: fvSat,  compl: fvCompl,  color: INDIGO },
      { name: "Mentorship",     sat: mfSat,  compl: mfCompl,  color: VIOLET },
    ];

    // Active programme visibility
    const show = (p: typeof HENT_PROGRAMS[number]) =>
      programFilter === "all" || programFilter === p;

    return {
      hak, mc, fv, mf, vc, vcAll,
      hakPart, hakFem, hakProj, hakStart, hakPart_, hakAvgSat,
      mcAtt, mcFem, mcCompl, mcSat,
      fvPart, fvFem, fvCompl, fvSat, fvPart_,
      mfFel, mfFem, mfCompl, mfSat, mfGrad,
      totalPart, totalFem, femalePct, avgSat,
      stageDist, sectorDist, fundingDist,
      fundingByStage, stageDistGender,
      countries, volByYear, qualityRows, show,
    };
  }, [yearFilter, programFilter, stageFilter, sectorFilter, fundingStage, portfolioGender]);

  const yearOpts: Opt<YearVal>[] = [{ label: "All Years", value: "all" }, ...YEARS.map((y) => ({ label: String(y), value: y as YearVal }))];
  const programOpts: Opt<ProgramVal>[] = [{ label: "All", value: "all" }, ...HENT_PROGRAMS.map((p) => ({ label: p, value: p }))];
  const stageOpts: Opt<Stage | "all">[] = [{ label: "All Stages", value: "all" }, ...VENTURE_STAGES.map((s) => ({ label: s, value: s }))];
  const sectorOpts: Opt<Sector | "all">[] = [{ label: "All Sectors", value: "all" }, ...VENTURE_SECTORS.slice(0, 5).map((s) => ({ label: s.split(" ")[0], value: s }))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: EXEC_BG }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-start justify-between py-5 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-none">HENT Impact Analytics</h1>
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Entrepreneurship Pillar · Ventures · Hackathons · Masterclasses · Field Visits · Mentorship & Fellowships · {D.countries.length} countries
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={String(yearFilter)} onChange={(e) => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)}
                className="text-xs font-medium border border-gray-200 text-gray-700 bg-white px-3 py-2 rounded appearance-none cursor-pointer hover:border-gray-400 focus:outline-none transition-colors pr-7"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                <option value="all">All Years</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              <KpiTile label="Portfolio Ventures"   num={D.vc.length}      displayFmt={fmt}  sub="Filtered cohorts"    clr={VIOLET}  />
              <KpiTile label="Hackathon Participants" num={D.hakPart}       displayFmt={fmt}  sub="Sprint innovators"  clr={ORANGE}  />
              <KpiTile label="Projects Built"        num={D.hakProj}       displayFmt={fmt}  sub="Designed solutions" clr={AMBER}   />
              <KpiTile label="Startups Created"      num={D.hakStart}      displayFmt={fmt}  sub="From hackathons"    clr={ROSE}    />
              <KpiTile label="Masterclass Attendees" num={D.mcAtt}         displayFmt={fmt}  sub={`Avg compl ${D.mcCompl}%`} clr={SKY} />
              <KpiTile label="Field Visit Part."     num={D.fvPart}        displayFmt={fmt}  sub="Site exposures"     clr={INDIGO}  />
              <KpiTile label="Fellowship Fellows"    num={D.mfFel}         displayFmt={fmt}  sub={`Grads ${D.mfGrad}`} clr={TEAL}  />
              <KpiTile label="Avg Satisfaction"      num={D.avgSat * 10}   displayFmt={(n) => `${(n / 10).toFixed(1)}/5`} sub="Programmes" clr={GREEN} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-10">

        {/* ── Venture Portfolio ────────────────────────────────────────────── */}
        <section>
          <SecHeader title="Venture Portfolio Analytics" sub="Stage progression, sector distribution, and funding status of HENT ventures" accent={VIOLET} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Stage Distribution"
              sub={portfolioGender === "all" ? `${D.vc.length} ventures — all team types` : `${portfolioGender}-led ventures by stage`}
              accent={VIOLET}
              headerRight={
                <div className="flex flex-col items-end gap-1.5">
                  <PillGroup
                    options={[{ label: "All", value: "all" }, { label: "Female", value: "female" }, { label: "Male", value: "male" }, { label: "Mixed", value: "mixed" }]}
                    value={portfolioGender} onChange={setPortfolioGender} />
                  <HeaderDropdown options={stageOpts} value={stageFilter} onChange={(v) => setStageFilter(v)} />
                </div>
              }>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={D.stageDistGender} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
                    formatter={(v: number, _: string, props: { payload?: { total: number } }) => [
                      portfolioGender === "all" ? v : `${v} of ${props.payload?.total ?? v} total`,
                      portfolioGender === "all" ? "Ventures" : `${portfolioGender}-led`,
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {D.stageDistGender.map((_, i) => (
                      <Cell key={i} fill={stageFilter === "all" || stageFilter === VENTURE_STAGES[i] ? STAGE_COLORS[i] : "#E5E7EB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sector Distribution" sub="Ventures by health sector focus" accent={TEAL}
              headerRight={<HeaderDropdown options={sectorOpts} value={sectorFilter} onChange={(v) => setSectorFilter(v)} />}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={D.sectorDist.filter((s) => s.value > 0)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    content={({ active, payload }) => active && payload?.length ? (
                      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[11px] shadow">
                        <p className="font-bold">{(payload[0].payload as { full: string }).full}</p>
                        <p style={{ color: TEAL }}>{payload[0].value} ventures</p>
                      </div>
                    ) : null}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {D.sectorDist.filter((s) => s.value > 0).map((s, i) => (
                      <Cell key={i} fill={sectorFilter === "all" || sectorFilter === s.full ? SECTOR_COLORS[i % SECTOR_COLORS.length] : "#E5E7EB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Funding Status"
              sub={fundingStage === "all" ? "Funding type across all venture stages" : `Funding profile for ${fundingStage} ventures`}
              accent={GREEN}
              headerRight={<HeaderDropdown options={[{ label: "All Stages", value: "all" }, ...VENTURE_STAGES.map((s) => ({ label: s, value: s }))]} value={fundingStage} onChange={setFundingStage} />}>
              <div className="space-y-3 mt-1">
                {D.fundingByStage.filter((f) => f.value > 0).map((f, i) => {
                  const fc = [AMBER, TEAL, SKY, VIOLET, GREEN, "#9CA3AF"];
                  const maxVal = Math.max(...D.fundingByStage.map((x) => x.value), 1);
                  return <HBar key={f.name} label={f.name} value={f.value} max={maxVal} color={fc[i % fc.length]} />;
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded border p-3 text-center" style={{ backgroundColor: TEAL + "10", borderColor: TEAL + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Total jobs created</p>
                  <p className="text-xl font-black tabular-nums" style={{ color: TEAL }}>
                    {fmt(D.vcAll.reduce((s, v) => s + v.jobsTotal, 0))}
                  </p>
                </div>
                <div className="rounded border p-3 text-center" style={{ backgroundColor: VIOLET + "10", borderColor: VIOLET + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Avg health score</p>
                  <p className="text-xl font-black tabular-nums" style={{ color: VIOLET }}>
                    {Math.round(avg(D.vcAll.map((v) => v.healthScore)))}
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── Programme Volume ─────────────────────────────────────────────── */}
        <section>
          <SecHeader title="Programme Participation Over Time" sub="Year-on-year reach per HENT initiative" accent={ORANGE} />

          <ChartCard
            title="HENT Programme Growth"
            sub={growthMetric === "participants" ? "Participant reach by programme — 2022 to 2026"
              : growthMetric === "projects" ? "Hackathon projects built per year"
              : "Hackathon startups created per year"}
            accent={ORANGE}
            headerRight={
              <div className="flex items-center gap-1.5">
                <PillGroup
                  options={[{ label: "Reach", value: "participants" }, { label: "Projects", value: "projects" }, { label: "Startups", value: "startups" }]}
                  value={growthMetric} onChange={setGrowthMetric} />
                {growthMetric === "participants" && (
                  <PillGroup
                    options={[{ label: "All", value: "all" }, ...HENT_PROGRAMS.map((p) => ({ label: p.split(" ")[0], value: p }))]}
                    value={programFilter} onChange={setProgramFilter} />
                )}
              </div>
            }>
            <ResponsiveContainer width="100%" height={260}>
              {growthMetric === "participants" ? (
                <BarChart data={D.volByYear} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  {(["Hackathons", "Masterclasses", "Field Visits", "Mentorship"] as const).map((prog, i) => {
                    const pc = [ORANGE, SKY, INDIGO, VIOLET];
                    const isVisible = programFilter === "all" || programFilter === prog;
                    return <Bar key={prog} dataKey={prog} fill={isVisible ? pc[i] : "#E5E7EB"} radius={[4, 4, 0, 0]} opacity={isVisible ? 1 : 0.3} />;
                  })}
                </BarChart>
              ) : (
                <BarChart data={D.volByYear} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey={growthMetric === "projects" ? "Projects" : "Startups"}
                    fill={growthMetric === "projects" ? ORANGE : ROSE} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* ── Programme Quality ────────────────────────────────────────────── */}
        <section>
          <SecHeader title="Programme Quality & Outcomes" sub="Satisfaction scores, completion rates, and fellowship outcomes" accent={SKY} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Satisfaction & Completion" sub="Quality benchmarks per HENT programme" accent={SKY}>
              <div className="space-y-4">
                {D.qualityRows.map((q) => {
                  const dim = programFilter !== "all" && !q.name.toLowerCase().includes(programFilter.toLowerCase().replace("s", ""));
                  return (
                    <div key={q.name} style={{ opacity: dim ? 0.4 : 1, transition: "opacity 0.2s" }}>
                      <p className="text-[10px] font-bold text-gray-700 mb-2">{q.name}</p>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1">
                            <span>Satisfaction</span><span style={{ color: q.color }}>{q.sat}/5</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ backgroundColor: q.color + "20" }}>
                            <div className="h-full rounded-full" style={{ width: `${(q.sat / 5) * 100}%`, backgroundColor: q.color }} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1">
                            <span>Completion</span><span style={{ color: q.color }}>{q.compl}%</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ backgroundColor: q.color + "20" }}>
                            <div className="h-full rounded-full" style={{ width: `${q.compl}%`, backgroundColor: q.color }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded border p-3 flex items-center gap-2" style={{ backgroundColor: SKY + "08", borderColor: SKY + "22" }}>
                <Award size={14} color={SKY} />
                <p className="text-[10px] font-bold text-gray-600">Avg HENT satisfaction</p>
                <p className="text-sm font-black tabular-nums ml-auto" style={{ color: SKY }}>{D.avgSat}/5</p>
              </div>
            </ChartCard>

            <ChartCard title="Hackathon Innovation Output" sub="Projects, startups, and female participation" accent={ORANGE}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total projects",     value: D.hakProj,  color: ORANGE },
                    { label: "Startups created",   value: D.hakStart, color: AMBER  },
                    { label: "Female participants",value: D.hakFem,   color: ROSE   },
                    { label: "Partnerships",        value: D.hakPart_, color: GREEN  },
                  ].map((r) => (
                    <div key={r.label} className="rounded border p-3 text-center" style={{ backgroundColor: r.color + "10", borderColor: r.color + "22" }}>
                      <p className="text-[9px] font-bold uppercase text-gray-500">{r.label}</p>
                      <p className="text-lg font-black tabular-nums mt-1" style={{ color: r.color }}>{fmt(r.value)}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded border p-3">
                  <p className="text-[10px] font-bold text-gray-600 mb-2">Category breakdown</p>
                  {(["AI/Technology", "Health", "Business", "Sustainability", "Other"] as const).map((cat, i) => {
                    const cc = [TEAL, ROSE, VIOLET, GREEN, AMBER];
                    const val = D.hak.reduce((s, h) => s + (h.categories[cat] ?? 0), 0);
                    const max = D.hak.reduce((s, h) => s + (h.categories["Health"] ?? 0), 0) || 1;
                    return <HBar key={cat} label={cat} value={val} max={max} color={cc[i]} />;
                  })}
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Fellowship & Field Impact" sub="Mentorship outcomes and field visit metrics" accent={INDIGO}>
              <div className="space-y-4">

                {/* Fellowship KPIs */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border p-3 text-center" style={{ backgroundColor: VIOLET + "10", borderColor: VIOLET + "22" }}>
                    <p className="text-[9px] font-bold uppercase text-gray-500">Total fellows</p>
                    <p className="text-xl font-black tabular-nums" style={{ color: VIOLET }}>{fmt(D.mfFel)}</p>
                  </div>
                  <div className="rounded border p-3 text-center" style={{ backgroundColor: TEAL + "10", borderColor: TEAL + "22" }}>
                    <p className="text-[9px] font-bold uppercase text-gray-500">Graduate fellows</p>
                    <p className="text-xl font-black tabular-nums" style={{ color: TEAL }}>{fmt(D.mfGrad)}</p>
                  </div>
                </div>

                {/* Fellowship progress bars */}
                <div className="rounded border p-3 space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400">Fellowship</p>
                  {[
                    { label: "Completion rate",  value: D.mfCompl,            max: 100,            color: VIOLET, suffix: "%" },
                    { label: "Satisfaction",      value: D.mfSat * 20,         max: 100,            color: SKY,    suffix: `/5 (${D.mfSat})` },
                    { label: "Graduation rate",   value: D.mfFel > 0 ? Math.round((D.mfGrad / D.mfFel) * 100) : 0, max: 100, color: TEAL, suffix: "%" },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                        <span className="font-medium">{r.label}</span>
                        <span className="font-bold tabular-nums" style={{ color: r.color }}>
                          {r.suffix.startsWith("/") ? `${r.value / 20}${r.suffix}` : `${r.value}${r.suffix}`}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: r.color + "20" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(r.value, 100)}%`, backgroundColor: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Field visits progress bars */}
                <div className="rounded border p-3 space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400">Field Visits</p>
                  {[
                    { label: "Completion rate",   value: D.fvCompl,       max: 100, color: INDIGO, display: `${D.fvCompl}%` },
                    { label: "Satisfaction",       value: D.fvSat * 20,    max: 100, color: TEAL,   display: `${D.fvSat}/5`  },
                    { label: "Female participants",value: D.fvPart > 0 ? Math.round((D.fvFem / D.fvPart) * 100) : 0, max: 100, color: ROSE, display: `${D.fvPart > 0 ? Math.round((D.fvFem / D.fvPart) * 100) : 0}%` },
                    { label: "Partnerships built", value: Math.min(D.fvPart_, 100), max: 100, color: GREEN, display: String(D.fvPart_) },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                        <span className="font-medium">{r.label}</span>
                        <span className="font-bold tabular-nums" style={{ color: r.color }}>{r.display}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: r.color + "20" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(r.value, 100)}%`, backgroundColor: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Countries footer */}
                <div className="rounded border p-3" style={{ backgroundColor: TEAL + "08", borderColor: TEAL + "18" }}>
                  <div className="flex items-center gap-2">
                    <Globe size={14} color={TEAL} />
                    <p className="text-[10px] font-bold text-gray-600">Countries reached</p>
                    <p className="text-sm font-black tabular-nums ml-auto" style={{ color: TEAL }}>{D.countries.length}</p>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </section>

        <footer className="border-t border-gray-200 pt-6 pb-10">
          <p className="text-[10px] text-gray-400">
            HENT Impact · {yearFilter === "all" ? "2022–2026" : String(yearFilter)} · {D.vcAll.length} portfolio ventures · {fmt(D.totalPart)} programme participants
          </p>
        </footer>
      </div>
    </div>
  );
}
