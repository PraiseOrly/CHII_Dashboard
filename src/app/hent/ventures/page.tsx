"use client";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, FileText } from "lucide-react";
import HENTNav, { getActiveLabel } from "@/components/HENTNav";
import { useFilterStore } from "@/lib/store";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { filterVentures } from "@/lib/filter";
import { founders, PROGRAM_EVENTS_LIST } from "@/data/founders";
import { labVentures } from "@/data/ventureLabs";

// ─── palette ─────────────────────────────────────────────────────────────────
const NAVY    = "#002147"; // footer only
const RED     = "#D4264A";
const PRIMARY = "#2F6FED";
const TEAL    = "#14B8A6";
const PURPLE  = "#7C3AED";
const GREEN   = "#22C55E";
const INDIGO  = "#6366F1";
const ORANGE  = "#EA580C";
const SKY     = "#0EA5E9";
const EMERALD = "#10B981";
const AMBER   = "#F59E0B";
const VIOLET  = "#8B5CF6";

const BAR_COLORS = [PRIMARY, TEAL, ORANGE, PURPLE, AMBER, GREEN, INDIGO, "#EC4899", SKY, EMERALD];

// ─── constants ────────────────────────────────────────────────────────────────
const PACE    = 5 / 12;
const TARGETS = { ventures: 400, jobs: 2_000, funds: 5_000_000 } as const;
const ACTUALS = { ventures: 31,  jobs: 291,   funds: 485_000   } as const;
const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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
function paceColor(a: number, t: number): string {
  const r = a / t;
  return r >= PACE * 0.9 ? EMERALD : r >= PACE * 0.5 ? AMBER : RED;
}
function fmt$(n: number): string {
  return n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${n}`;
}

// ─── static module-level derivations ─────────────────────────────────────────
const MCF_IDS = new Set(
  founders.filter(f => f.isMCFScholar).map(f => parseInt(f.ventureId.slice(1)))
);
const STALLED_IDS = new Set(
  ALL_VENTURES.filter(v => v.status === "Stalled").map(v => v.id)
);

const femCount    = founders.filter(f => f.gender === "Female").length;
const mcfFounders = founders.filter(f => f.isMCFScholar).length;
const mcfFemCount = founders.filter(f => f.isMCFScholar && f.gender === "Female").length;
const pwdCount    = founders.filter(f => f.isPWD).length;
const refCount    = founders.filter(f => f.isRefugee).length;
const mcfVentures = ALL_VENTURES.filter(v => MCF_IDS.has(v.id));
const mcfFunding  = mcfVentures.reduce((s, v) => s + v.funding, 0);
const avgLabScore = Math.round(labVentures.reduce((s, v) => s + v.score, 0) / labVentures.length);
const totalFunding = ALL_VENTURES.reduce((s, v) => s + v.funding, 0);

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

// ─── sub-components ───────────────────────────────────────────────────────────

// Custom donut using inline SVG fill — bypasses Tremor JIT class issue
function CustomDonut({
  data, colors, label,
  valueFormatter = (v: number) => `${v}`,
  className = "",
}: {
  data: { name: string; value: number }[];
  colors: string[];
  label?: string;
  valueFormatter?: (v: number) => string;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const CX = 80, CY = 80, OR = 70, IR = 43;
  let theta = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const t0 = theta, t1 = theta + sweep;
    theta = t1;
    const lg = sweep > Math.PI ? 1 : 0;
    const path = [
      `M ${CX + OR * Math.cos(t0)} ${CY + OR * Math.sin(t0)}`,
      `A ${OR} ${OR} 0 ${lg} 1 ${CX + OR * Math.cos(t1)} ${CY + OR * Math.sin(t1)}`,
      `L ${CX + IR * Math.cos(t1)} ${CY + IR * Math.sin(t1)}`,
      `A ${IR} ${IR} 0 ${lg} 0 ${CX + IR * Math.cos(t0)} ${CY + IR * Math.sin(t0)}`,
      "Z",
    ].join(" ");
    return { path, fill: colors[i % colors.length], name: d.name, value: d.value };
  });
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth="2.5">
            <title>{s.name}: {valueFormatter(s.value)}</title>
          </path>
        ))}
        {label && (
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#111827" fontSize="20" fontWeight="900"
            fontFamily="ui-sans-serif,system-ui,sans-serif">
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

// Custom multi-colour bar list — one colour per row
function ColorBarList({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const max = data[0]?.value ?? 1;
  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const col = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="w-[88px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
            <div className="flex-1 h-[18px] rounded-full overflow-hidden" style={{ backgroundColor: col + "1A" }}>
              <div className="h-full rounded-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
            </div>
            <div className="text-[11px] font-bold w-6 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function ChartCard({ title, sub, accent = PRIMARY, children }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5 flex-shrink-0"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(0,0,0,0.08) 100%), ${accent}`,
          borderBottomColor: accent,
        }}>
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5 min-h-0">{children}</div>
    </div>
  );
}

// Pace bar designed for light tinted backgrounds
function LightPaceBar({ a, t, clr: _clr }: { a: number; t: number; clr: string }) {
  return (
    <div className="h-1 rounded-full relative mt-2.5 mb-0.5" style={{ backgroundColor: "rgba(255,255,255,0.22)" }}>
      <div className="h-full rounded-full"
        style={{ width: `${Math.min((a / t) * 100, 100)}%`, backgroundColor: paceColor(a, t) }} />
      <div className="absolute top-0 bottom-0 w-px" style={{ left: `${PACE * 100}%`, backgroundColor: "rgba(255,255,255,0.55)" }} />
    </div>
  );
}

// Pace bar for white sidebar backgrounds
function RBar({ v, total }: { v: number; total: number }) {
  return (
    <div className="h-1 bg-gray-100 rounded-full mt-2 mb-0.5">
      <div className="h-full rounded-full bg-sky-500"
        style={{ width: `${total > 0 ? (v / total) * 100 : 0}%` }} />
    </div>
  );
}

function SectionLabel({ label, color = PRIMARY }: { label: string; color?: string }) {
  return (
    <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
      <div className="w-[3px] h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: color + "CC" }}>{label}</p>
    </div>
  );
}

function MCard({
  label, big, denom, barType, bA, bT, bTotal,
  chips, sub, gap, color = "#111827",
}: {
  label: string;
  big: string | number;
  denom?: string | number;
  barType: "T" | "R" | "none";
  bA?: number; bT?: number; bTotal?: number;
  chips?: { label: string; color: string }[];
  sub?: string;
  gap?: string;
  color?: string;
}) {
  return (
    <div className="px-5 py-3.5 border-b border-gray-100 last:border-0">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.12em] leading-none">{label}</p>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-2xl font-black tabular-nums leading-none" style={{ color }}>{big}</span>
        {denom !== undefined && (
          <span className="text-sm font-normal text-gray-400">/ {denom}</span>
        )}
      </div>
      {barType === "T" && bA !== undefined && bT !== undefined && (
        <div className="h-1 bg-gray-200 rounded-full relative mt-2 mb-0.5">
          <div className="h-full rounded-full"
            style={{ width: `${Math.min((bA / bT) * 100, 100)}%`, backgroundColor: paceColor(bA, bT) }} />
          <div className="absolute top-0 bottom-0 w-px bg-gray-400/40"
            style={{ left: `${PACE * 100}%` }} />
        </div>
      )}
      {barType === "R" && bA !== undefined && bTotal !== undefined && (
        <RBar v={bA} total={bTotal} />
      )}
      {barType === "none" && <div className="h-2" />}
      {sub  && !gap && <p className="text-[10px] text-gray-400">{sub}</p>}
      {gap  && <p className="text-[10px] text-amber-500 italic">{gap}</p>}
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
      <div className="w-32 text-[11px] text-gray-600 truncate text-right flex-shrink-0" title={name}>{name}</div>
      <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden flex">
        {expose > 0 && <div style={{ width: w(expose), backgroundColor: SKY    }} title={`Expose: ${expose}`} />}
        {build  > 0 && <div style={{ width: w(build),  backgroundColor: PRIMARY }} title={`Build: ${build}`} />}
        {scale  > 0 && <div style={{ width: w(scale),  backgroundColor: INDIGO  }} title={`Scale: ${scale}`} />}
      </div>
      <div className="w-6 text-[11px] text-gray-400 text-right flex-shrink-0">{expose + build + scale}</div>
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
            style={{ width: `${(mcf / max) * 100}%`, backgroundColor: PRIMARY }}
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

// ─── page ─────────────────────────────────────────────────────────────────────
export default function HENTPortfolio() {
  const pathname = usePathname();
  const { filters } = useFilterStore();
  const [stageFilter, setStageFilter] = useState<"All" | "Expose" | "Build" | "Scale">("All");
  const [nationFilter, setNationFilter] = useState<"ALL" | "MCF" | "NON-MCF" | "FLAGGED">("ALL");

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

  const expN   = useMemo(() => fv.filter(v => sg(v.stage) === "Expose").length, [fv]);
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

  const genderData = [
    { name: "Male",   value: founders.length - femCount },
    { name: "Female", value: femCount },
  ];

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* ── TITLE + KPI strip ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">

          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>{getActiveLabel(pathname)}</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">Data scope: 2026 Cohort · Updated 28 May 2026</p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-semibold text-white transition-colors shadow-sm"
                style={{ backgroundColor: RED }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* KPI strip — 5 distinct tinted tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {([
                { label: "Health Ventures", value: ACTUALS.ventures, denom: TARGETS.ventures,               sub: `Expected pace: ${Math.round(PACE * 100)}%`, bg: "#E0F2FE", clr: "#0C4A6E", pace: true,  a: ACTUALS.ventures, t: TARGETS.ventures  },
                { label: "Jobs Created",    value: ACTUALS.jobs,     denom: TARGETS.jobs.toLocaleString(),   sub: `Expected pace: ${Math.round(PACE * 100)}%`, bg: "#F0FDF4", clr: "#14532D", pace: true,  a: ACTUALS.jobs,     t: TARGETS.jobs      },
                { label: "Funds Deployed",  value: fmt$(ACTUALS.funds), denom: fmt$(TARGETS.funds),          sub: `Expected pace: ${Math.round(PACE * 100)}%`, bg: "#CFFAFE", clr: "#164E63", pace: true,  a: ACTUALS.funds,    t: TARGETS.funds     },
                { label: "Active Founders", value: 48,               denom: undefined,                      sub: `${Math.round((femCount / founders.length) * 100)}% female · ${founders.length} total`,  bg: "#ECFEFF", clr: "#155E75", pace: false },
                { label: "Pace of Target",  value: "5.5%",           denom: undefined,                      sub: `Against ${Math.round(PACE * 100)}% expected`, bg: "#F0FDFA", clr: "#134E4A", pace: false },
              ] as const).map(tile => (
                <div key={tile.label} className="rounded-xl border px-5 py-4"
                  style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}`, borderColor: tile.clr }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-tight mb-2"
                    style={{ color: "rgba(255,255,255,0.68)" }}>{tile.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black tabular-nums leading-none text-white">{tile.value}</span>
                    {tile.denom !== undefined && (
                      <span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.52)" }}>/ {tile.denom}</span>
                    )}
                  </div>
                  {tile.pace && (
                    <LightPaceBar a={tile.a!} t={tile.t!} clr={tile.clr} />
                  )}
                  {!tile.pace && <div className="mt-3" />}
                  <p className="text-[9px] font-medium" style={{ color: "rgba(255,255,255,0.62)" }}>{tile.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-5">

        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Show:</span>
            {(["All", "Expose", "Build", "Scale"] as const).map(s => (
              <button key={s} onClick={() => setStageFilter(s)}
                className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
                style={stageFilter === s
                  ? { backgroundColor: PRIMARY, color: "white" }
                  : { backgroundColor: "white", color: "#6b7280", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }}>
                {s === "All" ? "All Stages" : s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5 bg-white rounded-lg shadow-sm px-1 py-1">
            {(["ALL", "MCF", "NON-MCF", "FLAGGED"] as const).map(n => {
              const label = n === "ALL" ? "All Nations" : n === "MCF" ? "MCF Scholars" : n === "NON-MCF" ? "Non-MCF" : "Flagged";
              const active = nationFilter === n;
              return (
                <button key={n} onClick={() => setNationFilter(n)}
                  className="text-xs px-3 py-1 rounded font-medium transition-colors"
                  style={active
                    ? { color: RED, borderBottom: `2px solid ${RED}`, backgroundColor: "transparent" }
                    : { color: "#9ca3af", borderBottom: "2px solid transparent" }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main grid: sidebar + charts */}
        <div className="flex gap-5 items-start">

          {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
          <div className="w-64 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            <SectionLabel label="All Ventures" color={PRIMARY} />
            <MCard label="Total Ventures" big={ACTUALS.ventures} denom={TARGETS.ventures}
              barType="T" bA={ACTUALS.ventures} bT={TARGETS.ventures}
              color={PRIMARY} sub="↗ 11% YoY"
              chips={[
                { label: `Exp ${expN}`,   color: SKY    },
                { label: `Bld ${buildN}`, color: PRIMARY },
                { label: `Scl ${scaleN}`, color: INDIGO  },
              ]}
            />
            <MCard label="Active Founders" big={48}
              barType="none" color={ORANGE} sub="↗ 8% YoY"
              chips={[
                { label: `♀ ${Math.round((femCount / founders.length) * 100)}%`,                     color: PURPLE  },
                { label: `♂ ${Math.round(((founders.length - femCount) / founders.length) * 100)}%`, color: SKY     },
              ]}
            />
            <MCard label="Total Jobs Created" big={ACTUALS.jobs} denom={TARGETS.jobs.toLocaleString()}
              barType="T" bA={ACTUALS.jobs} bT={TARGETS.jobs}
              color={GREEN} sub="↗ 14% YoY"
            />

            <SectionLabel label="MCF Scholars" color={PURPLE} />
            <MCard label="MCF Scholar Ventures" big={mcfVentures.length} denom={ALL_VENTURES.length}
              barType="R" bA={mcfVentures.length} bTotal={ALL_VENTURES.length}
              color={PURPLE}
              sub={`${Math.round((mcfVentures.length / ALL_VENTURES.length) * 100)}% of portfolio`}
              chips={[
                { label: `♀ ${Math.round((mcfFemCount / Math.max(mcfFounders, 1)) * 100)}%`, color: PURPLE },
              ]}
            />
            <MCard label="MCF Funding Deployed" big={fmt$(mcfFunding)}
              barType="R" bA={mcfFunding} bTotal={Math.max(ACTUALS.funds, 1)}
              color={VIOLET}
              sub={`${Math.round((mcfFunding / Math.max(ACTUALS.funds, 1)) * 100)}% of total deployed`}
            />

            <SectionLabel label="The Cohort" color={TEAL} />
            <MCard label="Female Founders" big={femCount} denom={founders.length}
              barType="R" bA={femCount} bTotal={founders.length}
              color="#BE185D"
              sub={`${Math.round((femCount / founders.length) * 100)}% representation`}
            />
            <MCard label="PWD Founders" big={pwdCount}
              barType="none" color={TEAL}
              gap={pwdCount === 0 ? "Data not yet captured" : undefined}
              sub={pwdCount > 0 ? `${Math.round((pwdCount / founders.length) * 100)}% representation` : undefined}
            />
            <MCard label="Refugee Founders" big={refCount}
              barType="none" color={AMBER}
              gap={refCount === 0 ? "Data not yet captured" : undefined}
              sub={refCount > 0 ? `${Math.round((refCount / founders.length) * 100)}% representation` : undefined}
            />
            <MCard label="Venture Labs Cohort" big={labVentures.length} denom={ALL_VENTURES.length}
              barType="R" bA={labVentures.length} bTotal={ALL_VENTURES.length}
              color={EMERALD}
              chips={[{ label: `Avg ${avgLabScore}`, color: EMERALD }]}
            />

            <div className="px-4 py-3">
              <button className="w-full text-xs text-gray-400 border border-dashed border-gray-300 rounded py-2 hover:border-gray-400 hover:text-gray-600 transition-colors">
                + Add Metric Card
              </button>
            </div>
          </div>

          {/* ── CHART GRID (2 × 4) ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 grid grid-cols-2 gap-4">

            {/* Engagement Trend */}
            <ChartCard title="Engagement Trend" sub="Monthly founder onboarding · 2026" accent={SKY}>
              <ResponsiveContainer width="100%" height={176}>
                <AreaChart data={engData}>
                  <defs>
                    <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={SKY} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={SKY} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Area type="monotone" dataKey="Founders" stroke={SKY} strokeWidth={2} fill="url(#engGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Jobs Created */}
            <ChartCard title="Jobs Created" sub="Quarterly breakdown · 2026" accent={EMERALD}>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={qJobs} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Q" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="Jobs" fill={EMERALD} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Ventures by Sector */}
            <ChartCard title="Ventures by Sector" sub={`${fv.length} ventures · current filter`} accent={PRIMARY}>
              <ColorBarList data={secData} colors={BAR_COLORS} />
            </ChartCard>

            {/* Gender Distribution */}
            <ChartCard title="Gender Distribution" sub={`${founders.length} founders`} accent={PURPLE}>
              <CustomDonut
                data={genderData}
                colors={[SKY, PURPLE]}
                className="h-44"
                label={`${founders.length}`}
                valueFormatter={(v: number) => `${v} founders`}
              />
              <div className="flex justify-center gap-5 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SKY }} /> Male</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PURPLE }} /> Female</span>
              </div>
            </ChartCard>

            {/* Ventures by Country — MCF vs Non-MCF diverging */}
            <ChartCard title="Ventures by Country" sub="MCF (blue) vs Non-MCF (red)" accent={PRIMARY}>
              <div className="flex gap-4 text-[10px] text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PRIMARY }} /> MCF
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RED }} /> Non-MCF
                </span>
              </div>
              {ctryData.map(c => (
                <DivBar key={c.name} name={c.name} mcf={c.mcf} nm={c.nm} max={ctryMax} />
              ))}
            </ChartCard>

            {/* Jobs by Country */}
            <ChartCard title="Jobs by Country" sub="Total jobs created per country" accent="#F43F5E">
              <ColorBarList data={jobsCtryData} colors={BAR_COLORS} />
            </ChartCard>

            {/* Sector × Stage */}
            <ChartCard title="Sector × Stage" sub="Expose · Build · Scale breakdown" accent={INDIGO}>
              <div className="flex gap-4 text-[10px] text-gray-400 mb-3">
                {(["Expose","Build","Scale"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block"
                      style={{ backgroundColor: [SKY, PRIMARY, INDIGO][i] }} />
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
                    max={ssMax} />
                ))}
              </div>
            </ChartCard>

            {/* Programme Events Attendance */}
            <ChartCard title="Programme Events Attendance" sub="Founders per event" accent={VIOLET}>
              <ColorBarList data={evData} colors={BAR_COLORS} />
            </ChartCard>

          </div>
        </div>

        {/* ── FOOTER STRIP ────────────────────────────────────────────────── */}
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: fmt$(totalFunding),                                      label: "Total Funding Raised",    bg: "#F0FDF4", clr: "#14532D" },
              { value: `${Math.round((femCount / founders.length) * 100)}%`,    label: "Female Founders",         bg: "#CFFAFE", clr: "#164E63" },
              { value: `${avgLabScore}/100`,                                     label: "Venture Labs Avg Score",  bg: "#ECFEFF", clr: "#155E75" },
              { value: `${PROGRAM_EVENTS_LIST.length}`,                          label: "Programme Events Hosted", bg: "#E0F2FE", clr: "#0C4A6E" },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-6 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}` }}>
                <p className="text-2xl font-black tabular-nums text-white">{tile.value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">HENT · Catalyst for Change · 2026</p>
            <p className="text-[10px] text-gray-400">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
