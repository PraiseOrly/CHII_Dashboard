"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Banknote, Briefcase, Download, Info, Rocket, SlidersHorizontal, Target, Users, X, Zap, type LucideIcon } from "lucide-react";
import HENTNav, { getActiveLabel } from "@/components/HENTNav";
import { useFilterStore } from "@/lib/store";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { filterVentures } from "@/lib/filter";
import { founders, PROGRAM_EVENTS_LIST } from "@/data/founders";
import { labVentures } from "@/data/ventureLabs";

// â”€â”€â”€ palette (green family, distinct by hue) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const D1_NAVY    = "#1B4332"; // pine
const D1_TEAL    = "#1F9E9E"; // teal
const D1_PURPLE  = "#6B8E5B"; // moss
const D1_GREEN   = "#40916C"; // sea green
const D1_SKY     = "#A6C13C"; // lime

const NAVY    = "#0F4C3A";  // footer only (brand green)
const RED     = "#C44536";  // negative / alert
const PRIMARY = D1_NAVY;
const TEAL    = D1_TEAL;
const PURPLE  = D1_PURPLE;
const GREEN   = D1_GREEN;
const INDIGO  = "#2D6A4F";
const ORANGE  = D1_TEAL;
const SKY     = D1_SKY;
const EMERALD = D1_GREEN;
const AMBER   = D1_SKY;
const VIOLET  = D1_PURPLE;

// Standardised green series order
const BAR_COLORS = ["#1B4332", "#1F9E9E", "#A6C13C", "#6B8E5B", "#40916C"];

// â”€â”€â”€ constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PACE    = 5 / 12;
const TARGETS = { ventures: 400, jobs: 2_000, funds: 5_000_000 } as const;
const ACTUALS = { ventures: 31,  jobs: 291,   funds: 485_000   } as const;
const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ALL_SECTORS = [
  "Digital Health","Medical Devices","Diagnostics","Health Logistics",
  "Pharma & Biotech","Mental Health","Maternal & Child Health",
  "Health Financing","Community Health","Health Data & AI",
] as const;

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function sg(stage: string): "Expose" | "Build" | "Scale" {
  if (stage === "Ideation" || stage === "Validation") return "Expose";
  if (stage === "Prototype/MVP" || stage === "Early Growth") return "Build";
  return "Scale";
}
// Red → amber → green based on progress against the expected pace (benchmark)
function paceColor(a: number, t: number): string {
  const r = t > 0 ? (a / t) / PACE : 1;
  if (r >= 1)    return "#16A34A"; // green  - on or ahead of pace
  if (r >= 0.95) return "#84CC16"; // lime
  if (r >= 0.8)  return "#F59E0B"; // amber
  return "#DC2626";                // red    - behind pace
}
function fmt$(n: number): string {
  return n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${n}`;
}

// â”€â”€â”€ static module-level derivations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Interactive donut — hover dims other slices and shows a colour tooltip
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
  const [hovered, setHovered] = useState<{ name: string; value: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
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
    <div
      className={`relative flex items-center justify-center ${className}`}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
    >
      <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth="2.5"
            style={{ cursor: "pointer", opacity: hovered && hovered.name !== s.name ? 0.45 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovered({ name: s.name, value: s.value, color: s.fill })}
            onMouseLeave={() => setHovered(null)} />
        ))}
        {label && (
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#111827" fontSize="20" fontWeight="900"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">{label}</text>
        )}
      </svg>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hovered.color, left: pos.x, top: pos.y - 34, transform: "translateX(-50%)" }}>
          {hovered.name}: {valueFormatter(hovered.value)}
        </div>
      )}
    </div>
  );
}

// Custom multi-colour bar list  -  one colour per row
function ColorBarList({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const max = data[0]?.value ?? 1;
  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const col = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="w-[88px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
            <div className="flex-1 h-[18px] rounded-sm overflow-hidden" style={{ backgroundColor: col + "1A" }}>
              <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
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
    <div ref={cardRef} className="overflow-hidden flex flex-col" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5 flex-shrink-0" style={{ backgroundColor: "#FFFFFF", padding: "12px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#A6C13C" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold uppercase leading-none" style={{ letterSpacing: "0.04em", color: "#111827" }}>{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "#5F5E5A" }}>{sub}</p>}
        </div>
        <button onClick={handleDownload} title="Download chart"
          style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#111827"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}>
          <Download size={12} />
        </button>
      </div>
      <div className="p-5 min-h-0">{children}</div>
    </div>
  );
}

// Pace bar designed for light tinted backgrounds
function LightPaceBar({ a, t, clr: _clr }: { a: number; t: number; clr: string }) {
  return (
    <div className="h-1 rounded-sm relative mt-2.5 mb-0.5" style={{ backgroundColor: "rgba(14,70,51,0.12)" }}>
      <div className="h-full"
        style={{ width: `${Math.min((a / t) * 100, 100)}%`, backgroundColor: paceColor(a, t) }} />
      <div className="absolute" style={{ top: -3, bottom: -3, width: 2, left: `${PACE * 100}%`, backgroundColor: "#0E4633", borderRadius: 1 }} />
    </div>
  );
}

// â”€â”€â”€ Count-up animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useCountUp(target: number, duration = 750): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start: number | null = null;
    function tick(now: number) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic  -  fast start, smooth landing
      setVal(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    }
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

function KpiTile({ label, num, displayFmt, denom, sub, clr, pace, paceA, paceT, Icon }: {
  label: string;
  num: number;
  displayFmt: (n: number) => string;
  denom?: string | number;
  sub: string;
  clr: string;
  pace: boolean;
  paceA?: number;
  paceT?: number;
  Icon?: LucideIcon;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded-[10px] px-4 py-3 text-center"
      style={{ backgroundColor: "white", border: "1px solid rgba(14,70,51,0.12)", borderLeft: "5px solid #0E4633" }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] leading-tight mb-1.5"
        style={{ color: "rgba(14,70,51,0.55)" }}>{label}</p>
      <div className="flex items-center gap-2 justify-center">
        {Icon && <Icon size={18} style={{ color: "#0E4633", opacity: 0.85, flexShrink: 0 }} />}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black tabular-nums leading-none" style={{ color: "#0E4633" }}>{displayFmt(animated)}</span>
          {denom !== undefined && (
            <span className="text-[10px] font-normal" style={{ color: "rgba(14,70,51,0.45)" }}>/ {denom}</span>
          )}
        </div>
      </div>
      {pace && <LightPaceBar a={paceA!} t={paceT!} clr={clr} />}
      {!pace && <div className="mt-1.5" />}
      <p className="text-[8px] font-medium" style={{ color: "rgba(14,70,51,0.55)" }}>{sub}</p>
    </div>
  );
}

// Pace bar for white sidebar backgrounds
function RBar({ v, total }: { v: number; total: number }) {
  return (
    <div className="h-1 bg-gray-100 rounded-sm mt-2 mb-0.5">
      <div className="h-full bg-sky-500"
        style={{ width: `${total > 0 ? (v / total) * 100 : 0}%` }} />
    </div>
  );
}

function SectionLabel({ label, color = PRIMARY }: { label: string; color?: string }) {
  return (
    <div className="px-4 py-2.5 flex items-center gap-2 border-b"
      style={{
        backgroundColor: color,
        borderBottomColor: color,
      }}>
      <div className="w-[3px] h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white">{label}</p>
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
        <div className="h-1 bg-gray-200 rounded-sm relative mt-2 mb-0.5">
          <div className="h-full"
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
        {expose > 0 && <div style={{ width: w(expose), backgroundColor: SKY   }} title={`Expose: ${expose}`} />}
        {build  > 0 && <div style={{ width: w(build),  backgroundColor: AMBER }} title={`Build: ${build}`} />}
        {scale  > 0 && <div style={{ width: w(scale),  backgroundColor: PURPLE }} title={`Scale: ${scale}`} />}
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

// â”€â”€â”€ Youth-in-Work-style structural components (green theme) â”€â”€â”€
const G_BAND = "#0E4633";
const G_HEAD = "#0E4633";
const G_TICK = "#A6C13C";

function SectionHeader({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
      <span style={{ width: 4, height: 16, borderRadius: 999, backgroundColor: G_TICK, flexShrink: 0, alignSelf: "center" }} />
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: G_HEAD, letterSpacing: "0.01em" }}>{title}</h2>
        <p style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{blurb}</p>
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
      <div style={{ backgroundColor: G_BAND, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: G_TICK, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
              {info && (
                <span style={{ position: "relative", display: "flex", cursor: "pointer" }}
                  onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
                  <Info size={11} color="rgba(190,228,214,0.85)" />
                  {tip && (
                    <span style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#04241A", color: "white", fontSize: 10.5, fontWeight: 400, textTransform: "none", letterSpacing: 0, lineHeight: 1.5, padding: "8px 11px", borderRadius: 7, width: 210, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
                      {info}
                    </span>
                  )}
                </span>
              )}
            </div>
            <p style={{ fontSize: 9.5, color: "rgba(190,228,214,0.7)", marginTop: 1 }}>{subtitle}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>{children}</div>
    </div>
  );
}

const VEN_SECTIONS = [
  { n: 1, label: "Growth & Jobs" },
  { n: 2, label: "Portfolio Composition" },
  { n: 3, label: "Geography & Engagement" },
] as const;

// â”€â”€â”€ page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HENTPortfolio() {
  const pathname = usePathname();
  const { filters } = useFilterStore();
  const [stageFilter, setStageFilter] = useState<"All" | "Expose" | "Build" | "Scale">("All");
  const [nationFilter, setNationFilter] = useState<"ALL" | "MCF" | "NON-MCF" | "FLAGGED">("ALL");
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const show = (n: number) => activeSection === "all" || activeSection === n;
  const filtersActive = (stageFilter !== "All" ? 1 : 0) + (nationFilter !== "ALL" ? 1 : 0);

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

  // â”€â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* â”€â”€ TITLE + KPI strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#0E4633", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #0E4633 34%, #0E4633 66%, rgba(14,70,51,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>{getActiveLabel(pathname)}</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Data scope: 2026 Cohort · Updated 28 May 2026</p>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ MAIN CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-5">

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <KpiTile
                label="Health Ventures"
                num={ACTUALS.ventures}
                displayFmt={n => String(Math.round(n))}
                denom={TARGETS.ventures}
                sub="Scout 9 ventures/qtr to close gap"
                Icon={Rocket}
                clr="#0C4A6E" pace paceA={ACTUALS.ventures} paceT={TARGETS.ventures} />
              <KpiTile
                label="Jobs Created"
                num={ACTUALS.jobs}
                displayFmt={n => String(Math.round(n))}
                denom={TARGETS.jobs.toLocaleString()}
                sub="Prioritise scale-stage ventures"
                Icon={Briefcase}
                clr="#14532D" pace paceA={ACTUALS.jobs} paceT={TARGETS.jobs} />
              <KpiTile
                label="Funds Deployed"
                num={ACTUALS.funds}
                displayFmt={n => fmt$(Math.round(n))}
                denom={fmt$(TARGETS.funds)}
                sub="Review grant disbursement pipeline"
                Icon={Banknote}
                clr="#164E63" pace paceA={ACTUALS.funds} paceT={TARGETS.funds} />
              <KpiTile
                label="Active Founders"
                num={48}
                displayFmt={n => String(Math.round(n))}
                sub={`${Math.round((femCount / founders.length) * 100)}% female  ·  ${founders.length} total`}
                Icon={Users}
                clr="#155E75" pace={false} />
              <KpiTile
                label="Pace of Target"
                num={5.5}
                displayFmt={n => `${n.toFixed(1)}%`}
                sub={`Against ${Math.round(PACE * 100)}% expected`}
                Icon={Target}
                clr="#134E4A" pace={false} />
        </div>

        {/* Section pills (left) + Filters dropdown (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[{ n: 0, label: "All Sections" }, ...VEN_SECTIONS].map(({ n, label }) => {
              const on = n === 0 ? activeSection === "all" : activeSection === n;
              return (
                <button key={n} onClick={() => setActiveSection(n === 0 ? "all" : n)}
                  style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
                    border: `1px solid ${on ? G_HEAD : "rgba(14,70,51,0.18)"}`,
                    backgroundColor: on ? G_HEAD : "white", color: on ? "white" : "#6B7280" }}>
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => setFiltersOpen(o => !o)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
                border: `1px solid ${filtersActive || filtersOpen ? G_HEAD : "rgba(14,70,51,0.18)"}`,
                backgroundColor: filtersOpen ? G_HEAD : "white", color: filtersOpen ? "white" : "#374151" }}>
              <SlidersHorizontal size={13} />
              Filters
              {filtersActive > 0 && (
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: filtersOpen ? "rgba(255,255,255,0.25)" : G_HEAD, borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{filtersActive}</span>
              )}
            </button>
            {filtersOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50, width: 300, backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(14,70,51,0.14)", boxShadow: "0 10px 30px rgba(0,0,0,0.14)", overflow: "hidden" }}>
                <div style={{ backgroundColor: G_BAND, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filters</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {filtersActive > 0 && (
                      <button onClick={() => { setStageFilter("All"); setNationFilter("ALL"); }} style={{ fontSize: 10, fontWeight: 600, color: "white", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, padding: "3px 8px", backgroundColor: "rgba(255,255,255,0.08)", cursor: "pointer" }}>Reset</button>
                    )}
                    <button onClick={() => setFiltersOpen(false)} title="Close" style={{ color: "white", display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}><X size={13} /></button>
                  </div>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Stage</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(["All", "Expose", "Build", "Scale"] as const).map(s => (
                        <button key={s} onClick={() => setStageFilter(s)}
                          style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 7, cursor: "pointer",
                            border: `1px solid ${stageFilter === s ? G_HEAD : "rgba(14,70,51,0.18)"}`,
                            backgroundColor: stageFilter === s ? G_HEAD : "white", color: stageFilter === s ? "white" : "#6B7280" }}>
                          {s === "All" ? "All Stages" : s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Cohort</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(["ALL", "MCF", "NON-MCF", "FLAGGED"] as const).map(n => {
                        const label = n === "ALL" ? "All" : n === "MCF" ? "MCF Scholars" : n === "NON-MCF" ? "Non-MCF" : "Flagged";
                        return (
                          <button key={n} onClick={() => setNationFilter(n)}
                            style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 7, cursor: "pointer",
                              border: `1px solid ${nationFilter === n ? G_HEAD : "rgba(14,70,51,0.18)"}`,
                              backgroundColor: nationFilter === n ? G_HEAD : "white", color: nationFilter === n ? "white" : "#6B7280" }}>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {show(1) && (
        <section className="space-y-3">
          <SectionHeader title="Growth & Jobs" blurb="Founder onboarding momentum and jobs created through 2026" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Engagement Trend */}
            <ChartCard title="Engagement Trend" sub="Monthly founder onboarding  ·  2026" accent={SKY}>
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
            <ChartCard title="Jobs Created" sub="Quarterly breakdown  ·  2026" accent={EMERALD}>
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

          </div>
        </section>
        )}

        {show(2) && (
        <section className="space-y-3">
          <SectionHeader title="Portfolio Composition" blurb="Sector mix and founder gender across the portfolio" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ventures by Sector */}
            <ChartCard title="Ventures by Sector" sub={`${fv.length} ventures  ·  current filter`} accent={PRIMARY}>
              <ColorBarList data={secData} colors={[TEAL]} />
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
              <div className="flex flex-wrap justify-center gap-4 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span style={{ display:"inline-block", width:"12px", height:"8px", borderRadius:"2px", backgroundColor: SKY, flexShrink: 0 }} />
                  Male
                </span>
                <span className="flex items-center gap-1.5">
                  <span style={{ display:"inline-block", width:"12px", height:"8px", borderRadius:"2px", backgroundColor: PURPLE, flexShrink: 0 }} />
                  Female
                </span>
              </div>
            </ChartCard>

          </div>
        </section>
        )}

        {show(3) && (
        <section className="space-y-3">
          <SectionHeader title="Geography & Engagement" blurb="Geographic spread, jobs by country, stage mix, and event participation" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ventures by Country  -  MCF vs Non-MCF diverging */}
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
              <ColorBarList data={jobsCtryData} colors={[TEAL]} />
            </ChartCard>

            {/* Sector Ã— Stage */}
            <ChartCard title="Sector Ã— Stage" sub="Expose  ·  Build  ·  Scale breakdown" accent={INDIGO}>
              <div className="flex gap-4 text-[10px] text-gray-400 mb-3">
                {(["Expose","Build","Scale"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block"
                      style={{ backgroundColor: [SKY, AMBER, PURPLE][i] }} />
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
              <ColorBarList data={evData} colors={[TEAL]} />
            </ChartCard>

          </div>
        </section>
        )}

        {/* â”€â”€ FOOTER (executive style, HENT green header design) â”€â”€â”€ */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#0E4633", minHeight: 116, display: "flex", alignItems: "center" }}>

          {/* Faint triangle pattern */}
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

          {/* Design elements anchored to the left & right edges */}
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

          {/* Center overlay */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #0E4633 34%, #0E4633 66%, rgba(14,70,51,0) 100%)" }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>Africa&apos;s Oasis for Health &amp; Education Transformation</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}>
                <span style={{ color: "#7FD0B6", fontWeight: 600 }}>Data Last Synced:</span> 28 May 2026, EAT
              </span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}>
                <span style={{ color: "#7FD0B6", fontWeight: 600 }}>Source:</span> HENT Ventures M&amp;E
              </span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(190,228,214,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>
                Contact Analyst
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
