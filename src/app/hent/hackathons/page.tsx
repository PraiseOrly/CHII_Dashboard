"use client";
import { benchColor } from "@/theme/tokens";
import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar,
  AreaChart, Area, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Briefcase, Zap } from "lucide-react";
import PortalNav from "@/components/layout/portal-nav";
import { ChartTip, ChartLegend, useCountUp } from "@/components/ui";
import { CHART } from "@/theme/tokens";
import PortalFooter from "@/components/layout/portal-footer";
import SectionPills from "@/components/filters/section-pills";
import { DonutRing } from "@/components/charts/donut-chart";
import { hackathons, PROJECT_CATEGORIES } from "@/data/hackathons";

// â”€â”€â”€ palette (green family, distinct by hue) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY    = "#0F4C3A"; // footer bg only (brand green)
const ORANGE  = "#1B4332"; // primary series — pine
const SKY     = "#1F9E9E"; // teal
const VIOLET  = "#6B8E5B"; // moss
const TEAL    = "#2D8A8A"; // deep teal
const EMERALD = "#40916C"; // sea green
const PURPLE  = "#4C8C8A"; // dusty teal
const ROSE    = "#94A93B"; // olive-lime
const AMBER   = "#A6C13C"; // lime
const INDIGO  = "#2D6A4F"; // forest

// Project-category donut colours (green ramp, one per category)
const CAT_COLORS = ["#1B4332", "#1F9E9E", "#A6C13C", "#6B8E5B", "#40916C"];

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function fmt(n: number) {
  return n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n);
}

// â”€â”€â”€ derived totals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const total = {
  events:       hackathons.length,
  participants: hackathons.reduce((s, h) => s + h.participants,    0),
  female:       hackathons.reduce((s, h) => s + h.femaleCount,     0),
  students:     hackathons.reduce((s, h) => s + h.studentCount,    0),
  projects:     hackathons.reduce((s, h) => s + h.projects,        0),
  winningTeams: hackathons.reduce((s, h) => s + h.winningTeams,    0),
  startups:     hackathons.reduce((s, h) => s + h.startupsCreated, 0),
  partnerships: hackathons.reduce((s, h) => s + h.partnerships,    0),
};
const femalePct   = Math.round((total.female   / total.participants) * 100);
const malePct     = 100 - femalePct;
const studentPct  = Math.round((total.students / total.participants) * 100);
const alumniPct   = 100 - studentPct;
const alumniTotal = total.participants - total.students;

const YEARS = Array.from(new Set(hackathons.map(h => h.year))).sort();

// â”€â”€â”€ sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Donut — executive DonutRing (animated centre total, pop-out slice, bottom legend)
const DISTINCT = ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5","#00BBF9","#BC6C25","#8AB17D","#D62828","#3D405B"];
function CustomDonut({ data, className = "" }: {
  data: { name: string; value: number }[];
  colors?: string[];
  label?: string;
  valueFormatter?: (v: number) => string;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const height = className.includes("h-52") ? 300 : 260;
  return <DonutRing data={data} colors={DISTINCT} total={total} totalLabel="Total" height={height} legendPercent />;
}

// Multi-colour bar list  -  one colour per row
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

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: "#2D6A4F" }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "#2D6A4F" }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = ORANGE, children }: {
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
    <div ref={cardRef} onContextMenu={(e) => { e.preventDefault(); handleDownload(); }} title="Right-click to download this chart" className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#2D6A4F", padding: "12px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.8)" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
            {sub && <InfoDot tip={sub} color="#FFFFFF" />}
          </div>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ProfileCard({ label, value, pct, total: tot, color }: {
  label: string; value: number; pct: number; total: number; color: string;
}) {
  return (
    <div className="rounded border p-5 shadow-sm" style={{ backgroundColor: color + "0D", borderColor: color + "35" }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none" style={{ color: color + "AA" }}>{label}</p>
      <div className="flex items-baseline gap-0.5 mt-3">
        <p className="text-[2.25rem] font-black tabular-nums leading-none" style={{ color }}>{pct}</p>
        <p className="text-lg font-bold mb-0.5" style={{ color }}>%</p>
      </div>
      <p className="text-[11px] text-gray-400 mt-2 tabular-nums">{value.toLocaleString()} / {tot.toLocaleString()}</p>
      <div className="h-1.5 rounded-sm mt-3 overflow-hidden" style={{ backgroundColor: color + "20" }}>
        <div className="h-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function InfoDot({ tip, color = "#2D6A4F" }: { tip: string; color?: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: `${color}22`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color, lineHeight: 1, userSelect: "none" }}>i</span>
      {show && (
        <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", color: "#111827", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 190, boxShadow: "0 6px 20px rgba(0,0,0,0.22)", zIndex: 100, textAlign: "left", pointerEvents: "none", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{tip}</span>
      )}
    </span>
  );
}

function KpiTile({ label, num, displayFmt, sub, clr, pct, bench }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string; pct?: number; bench?: number;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(14,70,51,0.12)", borderLeft: "5px solid #2D6A4F", position: "relative", overflow: "visible" }}>
      <div className="flex items-center justify-center gap-1" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(14,70,51,0.55)" }}>{label}</p>
        {sub && <InfoDot tip={sub} />}
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: "#0E4633", lineHeight: 1 }}>{displayFmt(animated)}</p>
      <p style={{ fontSize: 9.5, color: "rgba(14,70,51,0.55)", marginTop: 4 }}>{sub}</p>
      {pct !== undefined ? (
        <div className="relative" style={{ marginTop: 10, height: 4, borderRadius: 4, backgroundColor: "rgba(14,70,51,0.12)" }} title={bench !== undefined ? `Benchmark: ${Math.round(bench)}%` : undefined}>
          <div style={{ height: "100%", width: `${Math.max(4, Math.min(100, pct))}%`, backgroundColor: bench !== undefined ? benchColor(pct, bench) : "#0E4633", borderRadius: 4 }} />
          {bench !== undefined && (
            <div className="absolute" style={{ top: -2, bottom: -2, width: 1.5, left: `${Math.min(100, bench)}%`, backgroundColor: "rgba(14,70,51,0.6)" }} />
          )}
        </div>
      ) : (
        <div style={{ marginTop: 10, height: 3, borderRadius: 999, backgroundColor: "rgba(14,70,51,0.12)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "100%", backgroundColor: "#0E4633", borderRadius: 999 }} />
        </div>
      )}
    </div>
  );
}

function GenderMiniBar({ year, female, male, fPct }: { year: string; female: number; male: number; fPct: number }) {
  const [hovered, setHovered] = useState<{ label: string; count: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div className="relative flex items-center gap-2 text-[11px]"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <span className="w-10 text-gray-500 flex-shrink-0">{year}</span>
      <div className="flex-1 h-3 rounded-sm overflow-hidden flex" style={{ backgroundColor: SKY + "1A" }}>
        <div style={{ width: `${fPct}%`, backgroundColor: VIOLET, cursor: "pointer",
            opacity: hovered && hovered.label !== "Female" ? 0.4 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Female", count: female, color: VIOLET })} />
        <div style={{ width: `${100 - fPct}%`, backgroundColor: SKY, cursor: "pointer",
            opacity: hovered && hovered.label !== "Male" ? 0.4 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Male", count: male, color: SKY })} />
      </div>
      <span className="text-gray-400 w-8 text-right">{female + male}</span>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hovered.color, left: pos.x, top: pos.y - 26, transform: "translateX(-50%)" }}>
          {hovered.label}: {hovered.count}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ KPI tile colour map (10 metrics) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const KPI_TILES = [
  { label: "Total Hackathons",   clr: "#C2410C" },  // orange  -  identity
  { label: "Participants",       clr: "#1E3A8A" },  // blue
  { label: "Winning Teams",      clr: "#D97706" },  // bright amber
  { label: "Projects Developed", clr: "#5B21B6" },  // violet
  { label: "Startups Created",   clr: "#064E3B" },  // emerald
  { label: "Partnerships",       clr: "#0891B2" },  // rust
] as const;

// â”€â”€â”€ page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HackathonsPage() {
  const [trendTab, setTrendTab] = useState<"participants" | "projects" | "winners" | "startups">("participants");
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  // â”€â”€ per-year trend data â”€â”€
  const participantsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const fem    = events.reduce((s, h) => s + h.femaleCount,   0);
    const tot    = events.reduce((s, h) => s + h.participants,  0);
    return { Year: String(yr), "Female": fem, "Male": tot - fem };
  });

  const projectsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const tot    = events.reduce((s, h) => s + h.participants, 0);
    const femR   = tot > 0 ? events.reduce((s, h) => s + h.femaleCount, 0) / tot : 0;
    const proj   = events.reduce((s, h) => s + h.projects, 0);
    return {
      Year: String(yr),
      "Female-led": Math.round(proj * femR),
      "Male-led":   Math.round(proj * (1 - femR)),
    };
  });

  const winnersTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const femW   = events.reduce((s, h) => s + h.femaleWinnerTeams, 0);
    const totW   = events.reduce((s, h) => s + h.winningTeams,      0);
    return { Year: String(yr), "Female-led": femW, "Male-led": totW - femW };
  });

  const startupsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const femS   = events.reduce((s, h) => s + h.femaleStartups,   0);
    const totS   = events.reduce((s, h) => s + h.startupsCreated,  0);
    return { Year: String(yr), "Female-founded": femS, "Male-founded": totS - femS };
  });

  const trendData = trendTab === "participants" ? participantsTrend
                  : trendTab === "projects"     ? projectsTrend
                  : trendTab === "winners"      ? winnersTrend
                  :                              startupsTrend;

  const trendCategories: [string, string] =
      trendTab === "participants" ? ["Female",        "Male"]
    : trendTab === "startups"    ? ["Female-founded", "Male-founded"]
    :                              ["Female-led",     "Male-led"];

  const trendFormatter = (v: number) =>
      trendTab === "participants" ? `${v} participants`
    : trendTab === "projects"    ? `${v} projects`
    : trendTab === "winners"     ? `${v} teams`
    : `${v} startups`;

  // â”€â”€ hackathons per year â”€â”€
  const hackPerYear = YEARS.map(yr => ({
    Year: String(yr),
    Hackathons: hackathons.filter(h => h.year === yr).length,
  }));

  // â”€â”€ participant reach per year â”€â”€
  const reachPerYear = YEARS.map(yr => ({
    Year: String(yr),
    Participants: hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
  }));

  // â”€â”€ project categories â”€â”€
  const catTotals = PROJECT_CATEGORIES.map(cat => ({
    name: cat,
    value: hackathons.reduce((s, h) => s + h.categories[cat], 0),
  })).sort((a, b) => b.value - a.value);

  // â”€â”€ gender breakdown for bar list â”€â”€
  const genderBreakdown = [
    { name: "Female Participants", value: total.female },
    { name: "Male Participants",   value: total.participants - total.female },
  ];

  // â”€â”€ KPI tile values (positionally aligned with KPI_TILES) â”€â”€
  const kpiValues = [
    { sub: `${YEARS[0]} - ${YEARS[YEARS.length - 1]}`, num: total.events,       fmt: (n: number) => String(Math.round(n)) },
    { sub: "Across all events",                        num: total.participants, fmt: (n: number) => Math.round(n) >= 1000 ? `${(Math.round(n) / 1000).toFixed(1)}k` : String(Math.round(n)) },
    { sub: "Total prize winners",                      num: total.winningTeams, fmt: (n: number) => String(Math.round(n)) },
    { sub: "Across all hackathons",                    num: total.projects,     fmt: (n: number) => String(Math.round(n)) },
    { sub: "Ventures from hacks",                      num: total.startups,     fmt: (n: number) => String(Math.round(n)) },
    { sub: "Sponsors & partners",                      num: total.partnerships, fmt: (n: number) => String(Math.round(n)) },
  ];

  // â”€â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <PortalNav portal="hent" />

      {/* â”€â”€ TITLE + KPI STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#2D6A4F", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(14,70,51,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Hackathons</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Innovation events, participation and the projects and startups they generate</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
              <span aria-hidden="true">·</span>
              <span>{total.events} hackathons tracked</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ MAIN CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {KPI_TILES.map(({ label, clr }, i) => (
            <KpiTile key={label} label={label} num={kpiValues[i].num}
              displayFmt={kpiValues[i].fmt} sub={kpiValues[i].sub} clr={clr} />
          ))}
        </div>

        {/* â”€â”€ SECTION 1: PARTICIPANT PROFILES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* Section pills (HENT Overview design) */}
        <SectionPills
          accent="#0E4633"
          value={activeSection === "all" ? "all" : String(activeSection)}
          onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
          options={[
            { label: "All Sections", value: "all" },
            { label: "Profiles", value: "1" }, { label: "Per Year", value: "2" },
            { label: "Trends", value: "3" }, { label: "Categories", value: "4" },
            { label: "Lifecycle", value: "5" },
          ]}
        />

        <section style={{ display: show(1) ? undefined : "none" }}>
          <SecHeader title="Participant Profiles"
            sub={`${total.participants.toLocaleString()} participants across all hackathons`} />

          {/* Participant profile stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {([
              { label: "Female Participants",  value: total.female,                       pct: femalePct,  color: VIOLET  },
              { label: "Male Participants",    value: total.participants - total.female,  pct: malePct,    color: SKY     },
              { label: "Student Participants", value: total.students,                     pct: studentPct, color: EMERALD },
              { label: "Alumni Participants",  value: alumniTotal,                        pct: alumniPct,  color: AMBER   },
            ] as const).map((item) => (
              <div key={item.label} className="rounded-[10px]"
                style={{ backgroundColor: "#ffffff", border: "1px solid #2D6A4F", padding: "13px 15px" }}>
                <p className="tabular-nums" style={{ fontSize: 21, fontWeight: 800, color: "#2D6A4F", lineHeight: 1.05 }}>{item.pct}%</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{item.label}</p>
                <p className="tabular-nums" style={{ fontSize: 9, fontWeight: 500, color: "#9CA3AF", marginTop: 2 }}>
                  {item.value.toLocaleString()} / {total.participants.toLocaleString()}
                </p>
                <div className="rounded-sm mt-2 overflow-hidden" style={{ height: 5, backgroundColor: item.color + "20" }}>
                  <div className="h-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Gender Composition"
              sub="Distribution of participants by gender across all events"
              accent={VIOLET}>
              <CustomDonut
                data={[
                  { name: "Male Participants",   value: total.participants - total.female },
                  { name: "Female Participants", value: total.female },
                ]}
                colors={[SKY, VIOLET]}
                className="h-44"
                label={`${total.participants}`}
                valueFormatter={(v: number) => `${v} participants`}
              />
              <div className="flex justify-center gap-5 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SKY }}    /> Male</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: VIOLET }} /> Female</span>
              </div>
            </ChartCard>

            <ChartCard title="Student vs Alumni Participation"
              sub="Breakdown of participants by academic status"
              accent={ROSE}>
              <CustomDonut
                data={[
                  { name: "Student Participants", value: total.students },
                  { name: "Alumni Participants",  value: alumniTotal    },
                ]}
                colors={[SKY, ROSE]}
                className="h-44"
                label={`${total.participants}`}
                valueFormatter={(v: number) => `${v} participants`}
              />
              <div className="flex justify-center gap-5 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SKY }}  /> Students</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ROSE }} /> Alumni</span>
              </div>
            </ChartCard>

          </div>
        </section>

        {/* â”€â”€ SECTION 2: HACKATHONS PER YEAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SecHeader title="Hackathons Conducted Per Year"
            sub="Event frequency and participant reach by year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Annual Hackathon Frequency"
              sub="Count of hackathons organised per calendar year"
              accent={ORANGE}>
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={hackPerYear} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Hackathons" fill={ORANGE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Hackathons held", ORANGE]]} />
            </ChartCard>

            <ChartCard title="Participant Reach per Year"
              sub="Total participants across all hackathons  -  year-on-year growth"
              accent={TEAL}>
              <ResponsiveContainer width="100%" height={192}>
                <LineChart data={reachPerYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Line type="monotone" dataKey="Participants"
                    stroke={TEAL} strokeWidth={2.5} dot={{ r: 4, fill: TEAL, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Participants", TEAL]]} />
            </ChartCard>
          </div>
        </section>

        {/* â”€â”€ SECTION 3: HACKATHON TRENDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SecHeader title="Hackathon Trends"
            sub="Year-on-year trends with male vs female comparison" />

          {/* Tab filters — pill style matching the section filters */}
          <div style={{ marginBottom: 16 }}>
            <SectionPills
              accent="#0E4633"
              value={trendTab}
              onChange={setTrendTab}
              options={[
                { label: "Participants",       value: "participants" },
                { label: "Projects Developed", value: "projects" },
                { label: "Winning Teams",      value: "winners" },
                { label: "Startups Created",   value: "startups" },
              ]}
            />
          </div>

          <ChartCard
            title={
                trendTab === "participants" ? "Participant Growth by Year"
              : trendTab === "projects"    ? "Projects Developed by Year"
              : trendTab === "winners"     ? "Winning Teams by Year"
              :                              "Startups Created from Hackathons by Year"
            }
            sub={`${
                trendTab === "participants" ? "Female vs male participation"
              : trendTab === "projects"    ? "Female-led vs male-led project teams"
              : trendTab === "winners"     ? "Female-led vs male-led winning teams"
              :                              "Female-founded vs male-founded startups"
            }  ·  by year`}
            accent={SKY}>
            <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: SKY }} />
                {trendCategories[1]}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: VIOLET }} />
                {trendCategories[0]}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={208}>
              <BarChart data={trendData} barCategoryGap="30%" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={25} />
                <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                <Bar dataKey={trendCategories[1]} fill={SKY}    radius={[4, 4, 0, 0]} />
                <Bar dataKey={trendCategories[0]} fill={VIOLET} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ChartLegend items={[[trendCategories[1], SKY], [trendCategories[0], VIOLET]]} />
          </ChartCard>
        </section>

        {/* â”€â”€ SECTION 4: PARTICIPATION & PROJECT CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SecHeader title="Participation & Project Categories"
            sub={`${total.participants.toLocaleString()} participants  ·  ${total.projects} projects`} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Participation by Gender"
              sub="Total female and male participants across all hackathon events"
              accent={VIOLET}>
              <p className="text-[11px] text-gray-500 mb-4">
                Total of {total.participants.toLocaleString()} participants across {total.events} events
              </p>
              <ColorBarList data={genderBreakdown} colors={[VIOLET, SKY]} />

              {/* Per-year gender breakdown mini-bars */}
              <div className="mt-5 space-y-1.5">
                {participantsTrend.map(row => {
                  const tot = row.Female + row.Male;
                  const fPct = tot > 0 ? Math.round((row.Female / tot) * 100) : 0;
                  return (
                    <GenderMiniBar key={row.Year} year={row.Year} female={row.Female} male={row.Male} fPct={fPct} />
                  );
                })}
                <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: VIOLET }} /> Female</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: SKY }}    /> Male</span>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Projects by Category"
              sub="Distribution of hackathon projects across focus areas"
              accent={TEAL}>
              <CustomDonut
                data={catTotals}
                colors={CAT_COLORS}
                className="h-52"
                valueFormatter={(v: number) => `${v} projects`}
              />
              <div className="mt-3 space-y-1.5">
                {catTotals.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-[11px] text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span style={{ display:"inline-block", width:"12px", height:"8px", borderRadius:"2px", backgroundColor: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0 }} />
                      {cat.name}
                    </span>
                    <span className="font-medium tabular-nums" style={{ color: CAT_COLORS[i % CAT_COLORS.length] }}>
                      {cat.value} ({Math.round((cat.value / total.projects) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* â”€â”€ SECTION 5: INNOVATION LIFECYCLE â”€â”€â”€ */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SecHeader title="Hackathon Innovation Lifecycle"
            sub="The full SOP pipeline — from participant recruitment and team formation through prototyping and pitching, to the ventures and partnerships that survive it" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Lifecycle Conversion Funnel"
              sub="How many participants make it through each stage of the hackathon pipeline">
              <div className="space-y-2.5">
                {(() => {
                  const steps = [
                    { label: "Participants recruited",   value: total.participants },
                    { label: "Projects developed",        value: total.projects },
                    { label: "Winning teams selected",    value: total.winningTeams },
                    { label: "Startups created",          value: total.startups },
                    { label: "Partnerships secured",      value: total.partnerships },
                  ];
                  const max = steps[0].value || 1;
                  return steps.map((s, i) => {
                    const pct = Math.max(6, Math.round((s.value / max) * 100));
                    const conv = i > 0 && steps[i - 1].value > 0
                      ? Math.round((s.value / steps[i - 1].value) * 100) : null;
                    return (
                      <div key={s.label}>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-gray-700">{s.label}</span>
                          <span className="font-bold tabular-nums" style={{ color: "#0E4633" }}>
                            {s.value.toLocaleString()}
                            {conv !== null && <span className="text-gray-400 font-medium"> · {conv}%</span>}
                          </span>
                        </div>
                        <div className="h-6 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(14,70,51,0.08)" }}>
                          <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: "#0E4633", opacity: 1 - i * 0.14 }} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {total.projects ? Math.round(total.startups / total.projects * 100) : 0}% of hackathon projects go on to become startups
              </p>
            </ChartCard>

            <ChartCard title="Idea-to-Venture Conversion per Year"
              sub="Projects developed vs startups created, and the conversion rate achieved each year">
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={YEARS.map(yr => {
                  const hs = hackathons.filter(h => h.year === yr);
                  const projects = hs.reduce((s, h) => s + h.projects, 0);
                  const startups = hs.reduce((s, h) => s + h.startupsCreated, 0);
                  return {
                    Year: String(yr), Projects: projects, Startups: startups,
                    Rate: projects ? Math.round((startups / projects) * 100) : 0,
                  };
                })} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <YAxis yAxisId="r" orientation="right" unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar yAxisId="l" dataKey="Projects" fill="#1B4332" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar yAxisId="l" dataKey="Startups" fill="#A6C13C" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Line yAxisId="r" type="monotone" dataKey="Rate" name="Conversion rate" stroke="#1F9E9E" strokeWidth={2.5}
                    dot={{ r: 4, fill: "#1F9E9E", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {([["Projects", "#1B4332"], ["Startups", "#A6C13C"], ["Conversion rate", "#1F9E9E"]] as const).map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* â”€â”€ FOOTER STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <PortalFooter portal="hent" source="HENT Hackathons M&amp;E" synced="28 May 2026, EAT" />

      </div>
    </div>
  );
}
