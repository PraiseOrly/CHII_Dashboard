"use client";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { AreaChart, BarChart, DonutChart, BarList } from "@tremor/react";
import { Download, FileText } from "lucide-react";
import HENTNav, { HENT_NAV_ITEMS, getActiveLabel } from "@/components/HENTNav";
import { useFilterStore } from "@/lib/store";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { filterVentures } from "@/lib/filter";
import { founders, PROGRAM_EVENTS_LIST } from "@/data/founders";
import { labVentures } from "@/data/ventureLabs";

// ─── constants ────────────────────────────────────────────────────────────────
const NAVY = "#002147";
const RED  = "#D4264A";
const PACE = 5 / 12;

const TARGETS = { ventures: 400, jobs: 2_000, funds: 5_000_000 } as const;
const ACTUALS = { ventures: 31,  jobs: 291,   funds: 485_000   } as const;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ALL_SECTORS = [
  "Digital Health","Medical Devices","Diagnostics","Health Logistics",
  "Pharma & Biotech","Mental Health","Maternal & Child Health",
  "Health Financing","Community Health","Health Data & AI",
] as const;

// ─── helpers ─────────────────────────────────────────────────────────────────
function sg(stage: string): "Expose" | "Build" | "Scale" {
  if (stage === "Ideation" || stage === "Validation") return "Expose";
  if (stage === "Prototype/MVP" || stage === "Early Growth") return "Build";
  return "Scale";
}

// Derived at module level (static data)
const MCF_IDS = new Set(
  founders.filter(f => f.isMCFScholar).map(f => parseInt(f.ventureId.slice(1)))
);
const STALLED_IDS = new Set(
  ALL_VENTURES.filter(v => v.status === "Stalled").map(v => v.id)
);

function paceColor(a: number, t: number): string {
  const r = a / t;
  return r >= PACE * 0.9 ? "#10b981" : r >= PACE * 0.5 ? "#f59e0b" : RED;
}
function fmt$(n: number): string {
  return n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${n}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-start gap-2.5 flex-shrink-0">
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0" style={{ backgroundColor: NAVY }} />
        <div>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em] leading-none">{title}</p>
          {sub && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{sub}</p>}
        </div>
      </div>
      <div className="p-5 min-h-0">{children}</div>
    </div>
  );
}

// Red/amber/green pace bar
function TBar({ a, t }: { a: number; t: number }) {
  return (
    <div className="h-1 bg-white/15 rounded-full relative mt-2.5 mb-0.5">
      <div className="h-full rounded-full"
        style={{ width: `${Math.min((a / t) * 100, 100)}%`, backgroundColor: paceColor(a, t) }} />
      <div className="absolute top-0 bottom-0 w-px bg-white/40"
        style={{ left: `${PACE * 100}%` }} />
    </div>
  );
}

// Blue representation bar
function RBar({ v, total }: { v: number; total: number }) {
  return (
    <div className="h-1 bg-gray-100 rounded-full mt-2 mb-0.5">
      <div className="h-full rounded-full bg-sky-500"
        style={{ width: `${total > 0 ? (v / total) * 100 : 0}%` }} />
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
      <div className="w-[3px] h-3 rounded-full flex-shrink-0" style={{ backgroundColor: NAVY }} />
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.12em]">{label}</p>
    </div>
  );
}

function MCard({
  label, big, denom, barType, bA, bT, bTotal,
  chips, sub, gap,
}: {
  label: string;
  big: string | number;
  denom?: string | number;
  barType: "T" | "R" | "none";
  bA?: number; bT?: number; bTotal?: number;
  chips?: { label: string; color: string }[];
  sub?: string;
  gap?: string;
}) {
  return (
    <div className="px-5 py-3.5 border-b border-gray-100 last:border-0">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.12em] leading-none">{label}</p>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-2xl font-black text-gray-900 tabular-nums leading-none">{big}</span>
        {denom !== undefined && (
          <span className="text-sm font-normal text-gray-400">/ {denom}</span>
        )}
      </div>
      {barType === "T" && bA !== undefined && bT !== undefined && (
        <div className="h-1 bg-gray-200 rounded-full relative mt-2 mb-0.5">
          <div className="h-full rounded-full"
            style={{ width: `${Math.min((bA / bT) * 100, 100)}%`, backgroundColor: paceColor(bA, bT) }} />
          <div className="absolute top-0 bottom-0 w-px bg-gray-500/40"
            style={{ left: `${PACE * 100}%` }} />
        </div>
      )}
      {barType === "R" && bA !== undefined && bTotal !== undefined && (
        <RBar v={bA} total={bTotal} />
      )}
      {barType === "none" && <div className="h-2" />}
      {sub && !gap && <p className="text-[10px] text-gray-400">{sub}</p>}
      {gap && <p className="text-[10px] text-amber-500 italic">{gap}</p>}
      {chips && chips.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-1.5">
          {chips.map(c => (
            <span key={c.label} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: c.color + "22", color: c.color }}>
              {c.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StackedHBar({ name, expose, build, scale, max }: {
  name: string; expose: number; build: number; scale: number; max: number;
}) {
  const w = (v: number) => `${max > 0 ? (v / max) * 100 : 0}%`;
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-32 text-[11px] text-gray-600 truncate text-right flex-shrink-0" title={name}>
        {name}
      </div>
      <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden flex">
        {expose > 0 && <div style={{ width: w(expose), backgroundColor: "#0ea5e9" }} title={`Expose: ${expose}`} />}
        {build  > 0 && <div style={{ width: w(build),  backgroundColor: "#3b82f6" }} title={`Build: ${build}`} />}
        {scale  > 0 && <div style={{ width: w(scale),  backgroundColor: NAVY     }} title={`Scale: ${scale}`} />}
      </div>
      <div className="w-6 text-[11px] text-gray-400 text-right flex-shrink-0">
        {expose + build + scale}
      </div>
    </div>
  );
}

function DivBar({ name, mcf, nm, max }: { name: string; mcf: number; nm: number; max: number }) {
  return (
    <div className="flex items-center gap-1 mb-1.5">
      <div className="w-20 text-[11px] text-gray-600 truncate text-right flex-shrink-0">{name}</div>
      <div className="w-24 flex justify-end flex-shrink-0">
        {mcf > 0 && (
          <div className="h-3 rounded-l-sm"
            style={{ width: `${(mcf / max) * 100}%`, backgroundColor: NAVY }}
            title={`MCF: ${mcf}`} />
        )}
      </div>
      <div className="w-px h-3 bg-gray-300 flex-shrink-0 mx-0.5" />
      <div className="w-24 flex-shrink-0">
        {nm > 0 && (
          <div className="h-3 rounded-r-sm"
            style={{ width: `${(nm / max) * 100}%`, backgroundColor: RED }}
            title={`Non-MCF: ${nm}`} />
        )}
      </div>
      <div className="w-6 text-[11px] text-gray-400 text-right flex-shrink-0">{mcf + nm}</div>
    </div>
  );
}

// ─── static derivations (computed once at module level, never re-run) ────────
const femCount    = founders.filter(f => f.gender   === "Female").length;
const mcfFounders = founders.filter(f => f.isMCFScholar).length;
const mcfFemCount = founders.filter(f => f.isMCFScholar && f.gender === "Female").length;
const pwdCount    = founders.filter(f => f.isPWD).length;
const refCount    = founders.filter(f => f.isRefugee).length;
const mcfVentures = ALL_VENTURES.filter(v => MCF_IDS.has(v.id));
const mcfFunding  = mcfVentures.reduce((s, v) => s + v.funding, 0);
const avgLabScore = Math.round(labVentures.reduce((s, v) => s + v.score, 0) / labVentures.length);
const totalFunding = ALL_VENTURES.reduce((s, v) => s + v.funding, 0);
const genderData  = [
  { name: "Male",   value: founders.length - femCount },
  { name: "Female", value: femCount },
];
const engData = MONTHS.map((month, i) => ({
  month,
  Founders: founders.filter(f => f.interventionMonth === i + 1).length,
}));
const qJobs = [
  { Q: "Q1", Jobs: ALL_VENTURES.slice(0,  24).reduce((s, v) => s + v.jobs6m, 0) },
  { Q: "Q2", Jobs: ALL_VENTURES.slice(24, 48).reduce((s, v) => s + v.jobs6m, 0) },
  { Q: "Q3", Jobs: ALL_VENTURES.slice(48, 72).reduce((s, v) => s + v.jobs6m, 0) },
  { Q: "Q4", Jobs: ALL_VENTURES.slice(72).reduce((s, v)     => s + v.jobs6m, 0) },
];
const evData = PROGRAM_EVENTS_LIST
  .map(ev => ({ name: ev, value: founders.filter(f => f.events.includes(ev)).length }))
  .sort((a, b) => b.value - a.value);

// ─── page ─────────────────────────────────────────────────────────────────────
export default function HENTPortfolio() {
  const pathname = usePathname();
  const { filters } = useFilterStore();
  const [stageFilter, setStageFilter] = useState<"All" | "Expose" | "Build" | "Scale">("All");
  const [nationFilter, setNationFilter] = useState<"ALL" | "MCF" | "NON-MCF" | "FLAGGED">("ALL");

  // ── filter-dependent derivations ─────────────────────────────────────────
  const fv = useMemo(() => {
    const base = filterVentures(ALL_VENTURES, filters);
    return base.filter(v => {
      if (stageFilter !== "All" && sg(v.stage) !== stageFilter) return false;
      if (nationFilter === "MCF"     && !MCF_IDS.has(v.id))     return false;
      if (nationFilter === "NON-MCF" &&  MCF_IDS.has(v.id))     return false;
      if (nationFilter === "FLAGGED" && !STALLED_IDS.has(v.id)) return false;
      return true;
    });
  }, [filters, stageFilter, nationFilter]);

  const expN  = useMemo(() => fv.filter(v => sg(v.stage) === "Expose").length, [fv]);
  const buildN = useMemo(() => fv.filter(v => sg(v.stage) === "Build").length,  [fv]);
  const scaleN = useMemo(() => fv.filter(v => sg(v.stage) === "Scale").length,  [fv]);

  const secData = useMemo(() => {
    const m: Record<string, number> = {};
    fv.forEach(v => { m[v.sector] = (m[v.sector] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [fv]);

  const { ctryData, ctryMax } = useMemo(() => {
    const m: Record<string, { mcf: number; nm: number }> = {};
    fv.forEach(v => {
      if (!m[v.country]) m[v.country] = { mcf: 0, nm: 0 };
      if (MCF_IDS.has(v.id)) m[v.country].mcf++; else m[v.country].nm++;
    });
    const data = Object.entries(m)
      .map(([name, { mcf, nm }]) => ({ name, mcf, nm, t: mcf + nm }))
      .sort((a, b) => b.t - a.t).slice(0, 10);
    return { ctryData: data, ctryMax: Math.max(...data.map(c => Math.max(c.mcf, c.nm)), 1) };
  }, [fv]);

  const jobsCtryData = useMemo(() => {
    const m: Record<string, number> = {};
    fv.forEach(v => { m[v.country] = (m[v.country] || 0) + v.jobsTotal; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [fv]);

  const { ssData, ssMax, ssByStage } = useMemo(() => {
    const byStage: Record<string, { Expose: number; Build: number; Scale: number }> = {};
    ALL_SECTORS.forEach(s => { byStage[s] = { Expose: 0, Build: 0, Scale: 0 }; });
    fv.forEach(v => { if (byStage[v.sector]) byStage[v.sector][sg(v.stage)]++; });
    const data = ALL_SECTORS
      .filter(s => byStage[s].Expose + byStage[s].Build + byStage[s].Scale > 0)
      .sort((a, b) => (byStage[b].Expose + byStage[b].Build + byStage[b].Scale) - (byStage[a].Expose + byStage[a].Build + byStage[a].Scale));
    const max = Math.max(...data.map(s => byStage[s].Expose + byStage[s].Build + byStage[s].Scale), 1);
    return { ssData: data, ssMax: max, ssByStage: byStage };
  }, [fv]);

  // ─── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>

      {/* ── NAV STRIP ───────────────────────────────────────────────────── */}
      <HENTNav />

      {/* ── TITLE + KPI (white bg, dark-navy tiles) ─────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">

          {/* Title row */}
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>
                {getActiveLabel(pathname)}
              </h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Data scope: 2026 Cohort · Updated 28 May 2026
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button
                className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-semibold text-white transition-colors shadow-sm"
                style={{ backgroundColor: RED }}
              >
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* KPI strip — tiles keep navy, float on white */}
          <div className="pb-5">
            <div className="grid grid-cols-2 lg:grid-cols-5 rounded-xl overflow-hidden shadow-md border border-gray-100">
              {/* Tile: Ventures */}
              <div className="px-5 py-4" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">
                  Health Ventures
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white tabular-nums">{ACTUALS.ventures}</span>
                  <span className="text-sm text-blue-200/40">/ {TARGETS.ventures}</span>
                </div>
                <TBar a={ACTUALS.ventures} t={TARGETS.ventures} />
                <p className="text-[10px] text-blue-200/30">Expected pace: {Math.round(PACE * 100)}%</p>
              </div>

              {/* Tile: Jobs */}
              <div className="px-5 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">
                  Jobs Created
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white tabular-nums">{ACTUALS.jobs}</span>
                  <span className="text-sm text-blue-200/40">/ {TARGETS.jobs.toLocaleString()}</span>
                </div>
                <TBar a={ACTUALS.jobs} t={TARGETS.jobs} />
                <p className="text-[10px] text-blue-200/30">Expected pace: {Math.round(PACE * 100)}%</p>
              </div>

              {/* Tile: Funds */}
              <div className="px-5 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">
                  Funds Deployed
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white tabular-nums">{fmt$(ACTUALS.funds)}</span>
                  <span className="text-sm text-blue-200/40">/ {fmt$(TARGETS.funds)}</span>
                </div>
                <TBar a={ACTUALS.funds} t={TARGETS.funds} />
                <p className="text-[10px] text-blue-200/30">Expected pace: {Math.round(PACE * 100)}%</p>
              </div>

              {/* Tile: Founders */}
              <div className="px-5 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">
                  Active Founders
                </p>
                <span className="text-3xl font-bold text-white tabular-nums">48</span>
                <div className="mt-3.5">
                  <p className="text-[10px] text-blue-200/30">
                    {Math.round((femCount / founders.length) * 100)}% female · {founders.length} total
                  </p>
                </div>
              </div>

              {/* Tile: Pace */}
              <div className="px-5 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">
                  Pace of Target
                </p>
                <span className="text-3xl font-bold text-white tabular-nums">5.5%</span>
                <div className="mt-3.5">
                  <p className="text-[10px] text-blue-200/30">Against {Math.round(PACE * 100)}% expected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-5">

        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Stage pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Show:</span>
            {(["All", "Expose", "Build", "Scale"] as const).map(s => (
              <button key={s} onClick={() => setStageFilter(s)}
                className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
                style={stageFilter === s
                  ? { backgroundColor: NAVY, color: "white" }
                  : { backgroundColor: "white", color: "#6b7280", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                }
              >
                {s === "All" ? "All Stages" : s}
              </button>
            ))}
          </div>
          {/* Nation tabs */}
          <div className="flex items-center gap-0.5 bg-white rounded-lg shadow-sm px-1 py-1">
            {(["ALL", "MCF", "NON-MCF", "FLAGGED"] as const).map(n => {
              const label = n === "ALL" ? "All Nations" : n === "MCF" ? "MCF Scholars" : n === "NON-MCF" ? "Non-MCF" : "Flagged";
              const active = nationFilter === n;
              return (
                <button key={n} onClick={() => setNationFilter(n)}
                  className="text-xs px-3 py-1 rounded font-medium transition-colors"
                  style={active
                    ? { color: RED, borderBottom: `2px solid ${RED}`, backgroundColor: "transparent" }
                    : { color: "#9ca3af", borderBottom: "2px solid transparent" }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main grid: sidebar + charts */}
        <div className="flex gap-5 items-start">

          {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
          <div className="w-64 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            <SectionLabel label="All Ventures" />
            <MCard label="Total Ventures" big={ACTUALS.ventures} denom={TARGETS.ventures}
              barType="T" bA={ACTUALS.ventures} bT={TARGETS.ventures}
              sub="↗ 11% YoY"
              chips={[
                { label: `Exp ${expN}`,   color: "#0ea5e9" },
                { label: `Bld ${buildN}`, color: "#3b82f6" },
                { label: `Scl ${scaleN}`, color: NAVY      },
              ]}
            />
            <MCard label="Active Founders" big={48}
              barType="none"
              sub="↗ 8% YoY"
              chips={[
                { label: `♀ ${Math.round((femCount / founders.length) * 100)}%`,                    color: "#7c3aed" },
                { label: `♂ ${Math.round(((founders.length - femCount) / founders.length) * 100)}%`, color: "#0ea5e9" },
              ]}
            />
            <MCard label="Total Jobs Created" big={ACTUALS.jobs} denom={TARGETS.jobs.toLocaleString()}
              barType="T" bA={ACTUALS.jobs} bT={TARGETS.jobs}
              sub="↗ 14% YoY"
            />

            <SectionLabel label="MCF Scholars" />
            <MCard label="MCF Scholar Ventures" big={mcfVentures.length} denom={ALL_VENTURES.length}
              barType="R" bA={mcfVentures.length} bTotal={ALL_VENTURES.length}
              sub={`${Math.round((mcfVentures.length / ALL_VENTURES.length) * 100)}% of portfolio`}
              chips={[
                { label: `♀ ${Math.round((mcfFemCount / Math.max(mcfFounders, 1)) * 100)}%`, color: "#7c3aed" },
              ]}
            />
            <MCard label="MCF Funding Deployed" big={fmt$(mcfFunding)}
              barType="R" bA={mcfFunding} bTotal={Math.max(ACTUALS.funds, 1)}
              sub={`${Math.round((mcfFunding / Math.max(ACTUALS.funds, 1)) * 100)}% of total deployed`}
            />

            <SectionLabel label="The Cohort" />
            <MCard label="Female Founders" big={femCount} denom={founders.length}
              barType="R" bA={femCount} bTotal={founders.length}
              sub={`${Math.round((femCount / founders.length) * 100)}% representation`}
            />
            <MCard label="PWD Founders" big={pwdCount}
              barType="none"
              gap={pwdCount === 0 ? "Data not yet captured" : undefined}
              sub={pwdCount > 0 ? `${Math.round((pwdCount / founders.length) * 100)}% representation` : undefined}
            />
            <MCard label="Refugee Founders" big={refCount}
              barType="none"
              gap={refCount === 0 ? "Data not yet captured" : undefined}
              sub={refCount > 0 ? `${Math.round((refCount / founders.length) * 100)}% representation` : undefined}
            />
            <MCard label="Venture Labs Cohort" big={labVentures.length} denom={ALL_VENTURES.length}
              barType="R" bA={labVentures.length} bTotal={ALL_VENTURES.length}
              chips={[{ label: `Avg ${avgLabScore}`, color: "#059669" }]}
            />

            <div className="px-4 py-3">
              <button className="w-full text-xs text-gray-400 border border-dashed border-gray-300 rounded py-2 hover:border-gray-400 hover:text-gray-600 transition-colors">
                + Add Metric Card
              </button>
            </div>
          </div>

          {/* ── CHART GRID (2 × 4) ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 grid grid-cols-2 gap-4">

            {/* Row 1L — Engagement Trend */}
            <ChartCard title="Engagement Trend" sub="Monthly founder onboarding · 2026">
              <AreaChart
                data={engData}
                index="month"
                categories={["Founders"]}
                colors={["sky"]}
                className="h-44"
                valueFormatter={(v: number) => `${v} founders`}
                showLegend={false}
                showAnimation={false}
              />
            </ChartCard>

            {/* Row 1R — Jobs Created */}
            <ChartCard title="Jobs Created" sub="Quarterly breakdown · 2026">
              <BarChart
                data={qJobs}
                index="Q"
                categories={["Jobs"]}
                colors={["emerald"]}
                className="h-44"
                valueFormatter={(v: number) => `${v} jobs`}
                showLegend={false}
                showAnimation={false}
              />
            </ChartCard>

            {/* Row 2L — Ventures by Sector */}
            <ChartCard title="Ventures by Sector" sub={`${fv.length} ventures · current filter`}>
              <BarList
                data={secData}
                color="sky"
                valueFormatter={(v: number) => `${v}`}
                className="text-sm"
              />
            </ChartCard>

            {/* Row 2R — Gender Distribution */}
            <ChartCard title="Gender Distribution" sub={`${founders.length} founders`}>
              <DonutChart
                data={genderData}
                category="value"
                index="name"
                className="h-44"
                colors={["sky", "violet"]}
                label={`${founders.length}`}
                valueFormatter={(v: number) => `${v} founders`}
                showAnimation
              />
            </ChartCard>

            {/* Row 3L — Country: MCF vs Non-MCF diverging */}
            <ChartCard title="Ventures by Country" sub="MCF (navy) vs Non-MCF (red)">
              <div className="flex gap-4 text-[10px] text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: NAVY }} /> MCF
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RED }} /> Non-MCF
                </span>
              </div>
              {ctryData.map(c => (
                <DivBar key={c.name} name={c.name} mcf={c.mcf} nm={c.nm} max={ctryMax} />
              ))}
            </ChartCard>

            {/* Row 3R — Jobs by Country */}
            <ChartCard title="Jobs by Country" sub="Total jobs created per country">
              <BarList
                data={jobsCtryData}
                color="rose"
                valueFormatter={(v: number) => `${v}`}
                className="text-sm"
              />
            </ChartCard>

            {/* Row 4L — Sector × Stage */}
            <ChartCard title="Sector × Stage" sub="Expose · Build · Scale breakdown">
              <div className="flex gap-4 text-[10px] text-gray-400 mb-3">
                {(["Expose", "Build", "Scale"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block"
                      style={{ backgroundColor: ["#0ea5e9", "#3b82f6", "#6366f1"][i] }} />
                    {l}
                  </span>
                ))}
              </div>
              <div className="space-y-0.5">
                {ssData.map(s => (
                  <StackedHBar key={s} name={s}
                    expose={ssByStage[s].Expose}
                    build={ssByStage[s].Build}
                    scale={ssByStage[s].Scale}
                    max={ssMax}
                  />
                ))}
              </div>
            </ChartCard>

            {/* Row 4R — Programme Events Attendance */}
            <ChartCard title="Programme Events Attendance" sub="Founders per event">
              <BarList
                data={evData}
                color="violet"
                valueFormatter={(v: number) => `${v} founders`}
                className="text-sm"
              />
            </ChartCard>

          </div>
        </div>

        {/* ── FOOTER STRIP ──────────────────────────────────────────────────── */}
        <div className="rounded-lg overflow-hidden shadow-sm" style={{ backgroundColor: NAVY }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: fmt$(totalFunding),                                      label: "Total Funding Raised"      },
              { value: `${Math.round((femCount / founders.length) * 100)}%`,    label: "Female Founders"           },
              { value: `${avgLabScore}/100`,                                     label: "Venture Labs Avg Score"    },
              { value: `${PROGRAM_EVENTS_LIST.length}`,                          label: "Programme Events Hosted"   },
            ].map(tile => (
              <div key={tile.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold text-white tabular-nums">{tile.value}</p>
                <p className="text-[11px] text-blue-200/50 mt-1 uppercase tracking-wider">{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">
              HENT · Catalyst for Change · 2026
            </p>
            <p className="text-[10px] text-blue-200/40">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
