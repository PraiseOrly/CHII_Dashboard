"use client";
import HENTNav from "@/components/HENTNav";
import { fieldVisits } from "@/data/fieldVisits";
import { founders } from "@/data/founders";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { Award, Download, FileText, Handshake, Target, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";

// â”€â”€â”€ Color palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY    = "#002147";
const PRIMARY = "#2F6FED";
const TEAL    = "#14B8A6";
const PURPLE  = "#7C3AED";
const AMBER   = "#F59E0B";
const GREEN   = "#22C55E";
const INDIGO  = "#4338CA";
const ORANGE  = "#EA580C";

// Tremor-matched hex values for chart colours (purple-500, sky-500)
const C_PURPLE = "#A855F7";
const C_SKY    = "#0EA5E9";

// Per-programme identity colours (used consistently across all charts)
const PROG: Record<string, string> = {
  Hackathons:    ORANGE,
  Masterclasses: TEAL,
  "Field Visits": C_PURPLE,
  Mentorships:   C_SKY,
};

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n/1_000)}K` : `$${n}`;
}
function sg(s: string) {
  if (s === "Ideation" || s === "Validation") return "Expose";
  if (s === "Prototype/MVP" || s === "Early Growth") return "Build";
  return "Scale";
}
function heatColor(v: number): string {
  if (v >= 4.5) return TEAL;
  if (v >= 4.0) return PRIMARY;
  if (v >= 3.5) return AMBER;
  return "#EF4444";
}
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// â”€â”€â”€ Cross-programme aggregates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const hackPart  = hackathons.reduce((s, h) => s + h.participants, 0);
const hackFem   = hackathons.reduce((s, h) => s + h.femaleCount, 0);
const hackStart = hackathons.reduce((s, h) => s + h.startupsCreated, 0);
const hackPship = hackathons.reduce((s, h) => s + h.partnerships, 0);

const mcAtt   = masterclasses.reduce((s, m) => s + m.attendees, 0);
const mcFem   = masterclasses.reduce((s, m) => s + m.femaleAttendees, 0);
const mcComp  = Math.round(avg(masterclasses.map(m => m.completionRate)));
const mcSat   = parseFloat(avg(masterclasses.map(m => avg(Object.values(m.scores)))).toFixed(1));

const fvPart  = fieldVisits.reduce((s, v) => s + v.participants, 0);
const fvFem   = fieldVisits.reduce((s, v) => s + v.femaleParticipants, 0);
const fvComp  = Math.round(avg(fieldVisits.map(v => v.completionRate)));
const fvPship = fieldVisits.reduce((s, v) => s + v.partnerships, 0);
const fvSat   = parseFloat(avg(fieldVisits.map(v => avg(Object.values(v.scores)))).toFixed(1));

const mfFel   = mentorshipPrograms.reduce((s, p) => s + p.fellows, 0);
const mfFem   = mentorshipPrograms.reduce((s, p) => s + p.femaleFellows, 0);
const mfComp  = Math.round(avg(mentorshipPrograms.map(p => p.completionRate)));
const mfSat   = parseFloat(avg(mentorshipPrograms.map(p => avg(Object.values(p.scores)))).toFixed(1));
const mfGrad  = mentorshipPrograms.filter(p => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0);

const TOTAL_PART    = hackPart + mcAtt + fvPart + mfFel;
const TOTAL_FEM     = hackFem  + mcFem  + fvFem  + mfFem;
const FEMALE_PCT    = Math.round((TOTAL_FEM / TOTAL_PART) * 100);
const TOTAL_PROGS   = hackathons.length + masterclasses.length + fieldVisits.length + mentorshipPrograms.length;
const TOTAL_PSHIP   = hackPship + fvPship;
const AVG_COMP      = Math.round(avg([mcComp, fvComp, mfComp]));
const AVG_SAT       = parseFloat(avg([mcSat, fvSat, mfSat]).toFixed(1));
const TOTAL_FUNDING = ALL_VENTURES.reduce((s, v) => s + v.funding, 0);
const TOTAL_JOBS    = ALL_VENTURES.reduce((s, v) => s + v.jobsTotal, 0);
const FOUNDER_FEM   = Math.round(founders.filter(f => f.gender === "Female").length / founders.length * 100);

// â”€â”€â”€ Chart data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const YEARS = [2022, 2023, 2024, 2025, 2026];

const activityByYear = YEARS
  .map(yr => ({
    Year:          String(yr),
    Hackathons:    hackathons.filter(h => h.year === yr).length,
    Masterclasses: masterclasses.filter(m => m.year === yr).length,
    "Field Visits": fieldVisits.filter(v => v.year === yr).length,
    Mentorships:   mentorshipPrograms.filter(p => p.year === yr).length,
  }))
  .filter(d => d.Hackathons + d.Masterclasses + d["Field Visits"] + d.Mentorships > 0);

const participantsByYear = YEARS
  .map(yr => ({
    Year:          String(yr),
    Hackathons:    hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
    Masterclasses: masterclasses.filter(m => m.year === yr).reduce((s, m) => s + m.attendees, 0),
    "Field Visits": fieldVisits.filter(v => v.year === yr).reduce((s, v) => s + v.participants, 0),
    Mentorships:   mentorshipPrograms.filter(p => p.year === yr).reduce((s, p) => s + p.fellows, 0),
  }))
  .filter(d => d.Hackathons + d.Masterclasses + d["Field Visits"] + d.Mentorships > 0);

const genderByProg = [
  { label: "Hackathons",    femalePct: Math.round(hackFem / hackPart * 100), maleColor: ORANGE  },
  { label: "Masterclasses", femalePct: Math.round(mcFem   / mcAtt    * 100), maleColor: TEAL    },
  { label: "Field Visits",  femalePct: Math.round(fvFem   / fvPart   * 100), maleColor: AMBER   },
  { label: "Mentorships",   femalePct: Math.round(mfFem   / mfFel    * 100), maleColor: GREEN   },
];

const sectorCounts = ALL_VENTURES.reduce<Record<string, number>>((a, v) => {
  a[v.sector] = (a[v.sector] || 0) + 1; return a;
}, {});
const sectorData = Object.entries(sectorCounts)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value);

const SECTOR_HEX = ["#3B82F6","#14B8A6","#D946EF","#F59E0B","#10B981","#F43F5E","#F97316","#A855F7","#06B6D4","#EC4899"];

const stageData = [
  { name: "Expose", value: ALL_VENTURES.filter(v => sg(v.stage) === "Expose").length },
  { name: "Build",  value: ALL_VENTURES.filter(v => sg(v.stage) === "Build").length  },
  { name: "Scale",  value: ALL_VENTURES.filter(v => sg(v.stage) === "Scale").length  },
];
const STAGE_HEX = [PRIMARY, "#10B981", "#D946EF"];

const countryData = Object.entries(
  ALL_VENTURES.reduce<Record<string, number>>((a, v) => {
    a[v.country] = (a[v.country] || 0) + 1; return a;
  }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

const COUNTRY_HEX = [PRIMARY, TEAL, ORANGE, C_PURPLE, AMBER, GREEN, C_SKY, "#EC4899", "#10B981", "#F43F5E"];

const satCompare = [
  { name: "Masterclasses", value: mcSat  },
  { name: "Field Visits",  value: fvSat  },
  { name: "Mentorships",   value: mfSat  },
];

const compCompare = [
  { name: "Masterclasses", value: mcComp },
  { name: "Field Visits",  value: fvComp },
  { name: "Mentorships",   value: mfComp },
];

const perfHeatmap = [
  {
    program:       "Masterclasses",
    Quality:       parseFloat(avg(masterclasses.map(m => m.scores["Quality of Content"])).toFixed(1)),
    Usefulness:    parseFloat(avg(masterclasses.map(m => m.scores["Usefulness"])).toFixed(1)),
    Accessibility: parseFloat(avg(masterclasses.map(m => m.scores["Accessibility"])).toFixed(1)),
    Relevance:     parseFloat(avg(masterclasses.map(m => m.scores["Relevance of Support"])).toFixed(1)),
  },
  {
    program:       "Field Visits",
    Quality:       parseFloat(avg(fieldVisits.map(v => v.scores["Learning Experience"])).toFixed(1)),
    Usefulness:    parseFloat(avg(fieldVisits.map(v => v.scores["Practical Knowledge Gained"])).toFixed(1)),
    Accessibility: parseFloat(avg(fieldVisits.map(v => v.scores["Accessibility & Organisation"])).toFixed(1)),
    Relevance:     parseFloat(avg(fieldVisits.map(v => v.scores["Relevance to Venture Growth"])).toFixed(1)),
  },
  {
    program:       "Mentorships",
    Quality:       parseFloat(avg(mentorshipPrograms.map(p => p.scores["Quality of Support"])).toFixed(1)),
    Usefulness:    parseFloat(avg(mentorshipPrograms.map(p => p.scores["Usefulness"])).toFixed(1)),
    Accessibility: parseFloat(avg(mentorshipPrograms.map(p => p.scores["Accessibility"])).toFixed(1)),
    Relevance:     parseFloat(avg(mentorshipPrograms.map(p => p.scores["Relevance to Venture Growth"])).toFixed(1)),
  },
];
const HEAT_COLS = ["Quality", "Usefulness", "Accessibility", "Relevance"] as const;

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: PRIMARY }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: PRIMARY }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
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
    <div ref={cardRef} className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5"
        style={{
          backgroundColor: accent,
          borderBottomColor: accent,
        }}>
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
        </div>
        <button onClick={handleDownload} title="Download chart"
          style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}>
          <Download size={12} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ExecCard({ label, value, sub, color, note, icon: Icon, bg = "#ffffff" }: {
  label: string; value: string | number; sub?: string; color: string;
  note?: string; bg?: string; icon?: LucideIcon;
}) {
  return (
    <div className="rounded border p-3 shadow-sm text-center" style={{
      backgroundColor: color,
      borderColor: color,
    }}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-none" style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
        {Icon && (
          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
            <Icon size={11} style={{ color: "rgba(255,255,255,0.88)" }} />
          </div>
        )}
      </div>
      <p className="text-xl font-black tabular-nums leading-none text-white">{value}</p>
      {sub  && <p className="text-[9px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.68)" }}>{sub}</p>}
      {note && <p className="text-[9px] mt-1.5 pt-1.5" style={{ color: "rgba(255,255,255,0.55)", borderTop: "1px solid rgba(255,255,255,0.18)" }}>{note}</p>}
    </div>
  );
}

// Custom multi-colour horizontal bar  -  replaces Tremor BarList
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
            <div className="text-[11px] font-bold w-5 flex-shrink-0 tabular-nums" style={{ color: col }}>{row.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function GenderBar({ label, femalePct, maleColor }: { label: string; femalePct: number; maleColor: string }) {
  const [hovered, setHovered] = useState<{ label: string; pct: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div className="relative flex items-center gap-3 mb-3 last:mb-0"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <div className="w-28 text-[11px] text-gray-600 text-right font-medium flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-5 rounded-sm overflow-hidden flex" style={{ backgroundColor: PURPLE + "15" }}>
        <div style={{ width: `${femalePct}%`, backgroundColor: PURPLE, cursor: "pointer",
            opacity: hovered && hovered.label !== "Female" ? 0.45 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Female", pct: femalePct, color: PURPLE })} />
        <div style={{ width: `${100 - femalePct}%`, backgroundColor: maleColor, cursor: "pointer",
            opacity: hovered && hovered.label !== "Male" ? 0.45 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Male", pct: 100 - femalePct, color: maleColor })} />
      </div>
      <div className="text-[11px] font-bold w-8 flex-shrink-0 text-right" style={{ color: PURPLE }}>{femalePct}%</div>
      {hovered && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hovered.color, left: pos.x, top: pos.y - 30, transform: "translateX(-50%)" }}>
          {hovered.label}: {hovered.pct}%
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Chart legend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PROG_LEGEND = [
  ["Hackathons", PROG.Hackathons],
  ["Masterclasses", PROG.Masterclasses],
  ["Field Visits", PROG["Field Visits"]],
  ["Mentorships", PROG.Mentorships],
] as const;

function ChartLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
      {PROG_LEGEND.map(([l, c]) => (
        <span key={l} className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
        </span>
      ))}
    </div>
  );
}

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
    const t0 = theta;
    const t1 = theta + sweep;
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
    <div className={`relative flex items-center justify-center ${className}`}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}>
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

// â”€â”€â”€ Count-up animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useCountUp(target: number, duration = 750): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start: number | null = null;
    function tick(now: number) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    }
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded border px-2 py-2.5 text-center"
      style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-[1.1rem] font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.62)" }}>{sub}</p>
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ExecutiveDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <HENTNav />

      {/* â”€â”€ EXECUTIVE HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className="bg-white border-b border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="max-w-[1440px] mx-auto px-6">

          <div className="flex items-end justify-between py-5">
            <div>
              <h1 className="text-[1.6rem] font-black text-gray-900 leading-none">Overview</h1>
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                All programmes  ·  2022 - 2026  ·  {TOTAL_PROGS} programmes tracked  ·  Updated June 2026
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-2 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Report
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded font-semibold text-white shadow-sm transition-colors"
                style={{ backgroundColor: PRIMARY }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* â”€â”€ KPI STRIP â”€â”€â”€ */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
              <KpiTile label="Total Reach"      num={TOTAL_PART}          displayFmt={n => Math.round(n).toLocaleString()} sub="Participants"                              clr="#075985" />
              <KpiTile label="Active Ventures"  num={ALL_VENTURES.length}  displayFmt={n => String(Math.round(n))}          sub="In portfolio"                            clr="#5B21B6" />
              <KpiTile label="Female Reach"     num={FEMALE_PCT}           displayFmt={n => `${Math.round(n)}%`}            sub={`${TOTAL_FEM.toLocaleString()} people`}  clr="#9D174D" />
              <KpiTile label="Programmes"       num={TOTAL_PROGS}          displayFmt={n => String(Math.round(n))}          sub="Delivered"                               clr="#9A3412" />
              <KpiTile label="Avg Satisfaction" num={AVG_SAT}              displayFmt={n => `${n.toFixed(1)}/5`}           sub="Rated progs"                             clr="#115E59" />
              <KpiTile label="Avg Completion"   num={AVG_COMP}             displayFmt={n => `${Math.round(n)}%`}            sub="Completion"                              clr="#065F46" />
              <KpiTile label="Partnerships"     num={TOTAL_PSHIP}          displayFmt={n => String(Math.round(n))}          sub="Cross-sector"                            clr="#92400E" />
              <KpiTile label="1-Yr Fellows"     num={mfGrad}               displayFmt={n => String(Math.round(n))}          sub="Grad fellows"                            clr="#3730A3" />
            </div>
          </div>
        </div>
      </header>

      {/* â”€â”€ MAIN CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* â”€â”€ HERO EXEC CARDS â”€â”€â”€ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ExecCard label="Avg Programme Rating" value={`${AVG_SAT}/5`}
            sub="Quality, Usefulness, Accessibility, Relevance"
            note={`Masterclasses ${mcSat}  ·  Field Visits ${fvSat}  ·  Mentorships ${mfSat}`}
            color={PRIMARY} icon={Award} bg="#BAE6FD" />
          <ExecCard label="Avg Completion Rate" value={`${AVG_COMP}%`}
            sub="Participants completing all sessions"
            note={`MC ${mcComp}%  ·  FV ${fvComp}%  ·  MF ${mfComp}%`}
            color={TEAL} icon={Target} bg="#99F6E4" />
          <ExecCard label="Mentorship Fellows" value={mfFel.toLocaleString()}
            sub={`Across ${mentorshipPrograms.length} programmes  ·  ${mfGrad} in 1-yr track`}
            note={`${Math.round(mfFem/mfFel*100)}% female  ·  ${mentorshipPrograms.filter(p=>p.isFellowship).length} fellowships`}
            color={PURPLE} icon={Users} bg="#DDD6FE" />
          <ExecCard label="Funding Deployed" value={fmt$(TOTAL_FUNDING)}
            sub={`${ALL_VENTURES.length} ventures  ·  ${TOTAL_JOBS.toLocaleString()} jobs created`}
            note={`Founder gender parity: ${FOUNDER_FEM}% female`}
            color={GREEN} icon={TrendingUp} bg="#A7F3D0" />
        </div>

        {/* â”€â”€ SECTION 1: PROGRAMME ACTIVITY â”€â”€â”€ */}
        <section>
          <SecHeader title="Programme Delivery Timeline"
            sub="Activity count and participant volume across all programme types" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Programmes Delivered per Year"
              sub="Count of sessions / events by programme type"
              accent={ORANGE}>
              <ChartLegend />
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={activityByYear} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                  {(["Hackathons","Masterclasses","Field Visits","Mentorships"] as const).map((cat, i) => (
                    <Bar key={cat} dataKey={cat} fill={[ORANGE, TEAL, C_PURPLE, C_SKY][i]} radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Participant Volume per Year"
              sub="Total participants across all programme types  -  year by year"
              accent={TEAL}>
              <ChartLegend />
              <ResponsiveContainer width="100%" height={208}>
                <AreaChart data={participantsByYear}>
                  <defs>
                    {([ORANGE, TEAL, C_PURPLE, C_SKY] as const).map((hex, i) => (
                      <linearGradient key={i} id={`ag${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={hex} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={hex} stopOpacity={0.03} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                  {(["Hackathons","Masterclasses","Field Visits","Mentorships"] as const).map((cat, i) => (
                    <Area key={cat} type="monotone" dataKey={cat}
                      stroke={[ORANGE, TEAL, C_PURPLE, C_SKY][i]} strokeWidth={2}
                      fill={`url(#ag${i})`} dot={false} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>

        {/* â”€â”€ SECTION 2: PARTICIPATION & GENDER â”€â”€â”€ */}
        <section>
          <SecHeader title="Participation &amp; Diversity"
            sub="Gender representation, geographic reach, and social inclusion across programmes" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <ChartCard title="Gender Parity by Programme"
              sub="Female (purple) vs Male proportion per programme"
              accent={PURPLE}>
              <div className="flex items-center gap-5 text-[10px] text-gray-400 mb-5">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PURPLE }} /> Female
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#60A5FA" }} /> Male
                </span>
                <span className="ml-auto font-bold" style={{ color: PURPLE }}>Platform avg: {FEMALE_PCT}%</span>
              </div>
              {genderByProg.map(g => (
                <GenderBar key={g.label} label={g.label} femalePct={g.femalePct} maleColor={g.maleColor} />
              ))}
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-4 gap-2 text-center">
                {genderByProg.map(g => (
                  <div key={g.label}>
                    <p className="text-sm font-black" style={{ color: PURPLE }}>{g.femalePct}%</p>
                    <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{g.label}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Ventures by Country"
              sub="Geographic distribution of portfolio ventures"
              accent={C_SKY}>
              <ColorBarList data={countryData} colors={COUNTRY_HEX} />
            </ChartCard>

            <ChartCard title="Sector Distribution"
              sub="Venture portfolio breakdown by health sector"
              accent={GREEN}>
              <CustomDonut
                data={sectorData}
                colors={SECTOR_HEX}
                className="h-44"
                valueFormatter={(v: number) => `${v}`}
              />
              <div className="mt-3 space-y-1">
                {sectorData.slice(0, 5).map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-600 truncate min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SECTOR_HEX[i] }} />
                      <span className="truncate">{s.name}</span>
                    </span>
                    <span className="font-bold text-gray-700 ml-2 flex-shrink-0">
                      {s.value} ({Math.round(s.value / ALL_VENTURES.length * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* â”€â”€ SECTION 3: PROGRAMME PERFORMANCE â”€â”€â”€ */}
        <section>
          <SecHeader title="Programme Performance Analysis"
            sub="Satisfaction scores across quality dimensions  -  compared across programme types" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Satisfaction Heatmap  -  Programme Ã— Dimension"
              sub="Avg score per dimension  ·  Teal â‰¥4.5  ·  Blue â‰¥4.0  ·  Amber â‰¥3.5  ·  Red <3.5"
              accent={TEAL}>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-6 uppercase tracking-wider text-[9px]">Programme</th>
                      {HEAT_COLS.map(c => (
                        <th key={c} className="text-center text-gray-400 font-bold pb-3 px-2 min-w-[80px] uppercase tracking-wider text-[9px]">{c}</th>
                      ))}
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfHeatmap.map(row => {
                      const scores = HEAT_COLS.map(c => row[c]);
                      const rowAvg = parseFloat(avg(scores).toFixed(1));
                      return (
                        <tr key={row.program} className="border-t border-gray-100">
                          <td className="py-2.5 pr-6 whitespace-nowrap">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: PROG[row.program] }} />
                              <span className="font-semibold text-gray-700">{row.program}</span>
                            </span>
                          </td>
                          {HEAT_COLS.map(c => (
                            <td key={c} className="py-2.5 px-2 text-center">
                              <span className="inline-block px-2.5 py-1 rounded text-white text-[10px] font-bold tabular-nums"
                                style={{ backgroundColor: heatColor(row[c]) }}>
                                {row[c].toFixed(1)}
                              </span>
                            </td>
                          ))}
                          <td className="py-2.5 px-2 text-center">
                            <span className="inline-block px-2.5 py-1 rounded text-white text-[10px] font-bold tabular-nums"
                              style={{ backgroundColor: INDIGO }}>
                              {rowAvg.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400 flex-wrap">
                  {([["Very High (â‰¥4.5)", TEAL],["High (â‰¥4.0)", PRIMARY],["Moderate (â‰¥3.5)", AMBER],["Low (<3.5)", "#EF4444"]] as const).map(([l, c]) => (
                    <span key={l} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                    </span>
                  ))}
                </div>
              </div>
            </ChartCard>

            <div className="space-y-4">
              <ChartCard title="Avg Satisfaction by Programme"
                sub="Overall satisfaction rating (1 - 5) across key rated programmes"
                accent={PRIMARY}>
                <div className="space-y-3">
                  {satCompare.map(d => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PROG[d.name] }} />
                          {d.name}
                        </span>
                        <span className="font-bold tabular-nums" style={{ color: PROG[d.name] }}>{d.value}/5</span>
                      </div>
                      <div className="h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: PROG[d.name] + "18" }}>
                        <div className="h-full transition-all"
                          style={{ width: `${(d.value / 5) * 100}%`, backgroundColor: d.value >= 4.5 ? TEAL : d.value >= 4.0 ? PRIMARY : AMBER }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Completion Rate by Programme"
                sub="Percentage of enrolled participants who completed each programme type"
                accent={GREEN}>
                <div className="space-y-3">
                  {compCompare.map(d => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PROG[d.name] }} />
                          {d.name}
                        </span>
                        <span className="font-bold tabular-nums" style={{ color: PROG[d.name] }}>{d.value}%</span>
                      </div>
                      <div className="h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: PROG[d.name] + "18" }}>
                        <div className="h-full transition-all"
                          style={{ width: `${d.value}%`, backgroundColor: d.value >= 90 ? GREEN : d.value >= 80 ? TEAL : AMBER }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>
        </section>

        {/* â”€â”€ SECTION 4: VENTURE ECOSYSTEM â”€â”€â”€ */}
        <section>
          <SecHeader title="Venture Ecosystem"
            sub={`${ALL_VENTURES.length} ventures  ·  ${TOTAL_JOBS.toLocaleString()} jobs created  ·  ${fmt$(TOTAL_FUNDING)} deployed`} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <ChartCard title="Venture Stage Pipeline"
              sub="Distribution across Expose  ·  Build  ·  Scale development stages"
              accent={PRIMARY}>
              <CustomDonut
                data={stageData}
                colors={STAGE_HEX}
                className="h-40"
                label={`${ALL_VENTURES.length}`}
                valueFormatter={(v: number) => `${v} ventures`}
              />
              <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                {stageData.map((s, i) => (
                  <div key={s.name}>
                    <p className="text-xl font-black" style={{ color: STAGE_HEX[i] }}>{s.value}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium">{s.name}</p>
                    <p className="text-[9px] text-gray-400">{Math.round(s.value / ALL_VENTURES.length * 100)}%</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Startups &amp; Outcomes"
              sub="Key output metrics from hackathons and venture support"
              accent={GREEN}>
              <div className="space-y-3 mt-1">
                {([
                  { label: "Startups Created",      value: hackStart,                   color: GREEN,   sub: "From hackathons"  },
                  { label: "Jobs Created",           value: TOTAL_JOBS.toLocaleString(), color: TEAL,    sub: "Across portfolio" },
                  { label: "Funding Deployed",       value: fmt$(TOTAL_FUNDING),         color: PRIMARY, sub: "Total raised"     },
                  { label: "Partnership Agreements", value: TOTAL_PSHIP,                 color: AMBER,   sub: "Cross-sector"     },
                  { label: "1-Yr Fellowship Grads",  value: mfGrad,                      color: PURPLE,  sub: "Flagship track"   },
                ] as const).map(m => (
                  <div key={m.label} className="flex items-center gap-3 p-3 rounded border-l-2"
                    style={{ backgroundColor: m.color + "0E", borderColor: m.color }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: m.color + "AA" }}>{m.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{m.sub}</p>
                    </div>
                    <p className="text-xl font-black tabular-nums flex-shrink-0" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Programme Scale Overview"
              sub="At-a-glance programme counts and reach per type"
              accent={ORANGE}>
              <div className="space-y-4">
                {([
                  { label: "Hackathons",    count: hackathons.length,         reach: hackPart, pct: Math.round(hackPart / TOTAL_PART * 100), color: ORANGE   },
                  { label: "Masterclasses", count: masterclasses.length,      reach: mcAtt,    pct: Math.round(mcAtt    / TOTAL_PART * 100), color: TEAL     },
                  { label: "Field Visits",  count: fieldVisits.length,        reach: fvPart,   pct: Math.round(fvPart   / TOTAL_PART * 100), color: C_PURPLE },
                  { label: "Mentorships",   count: mentorshipPrograms.length, reach: mfFel,    pct: Math.round(mfFel    / TOTAL_PART * 100), color: C_SKY    },
                ] as const).map(row => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-1.5 font-medium text-gray-700">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                        {row.label}
                      </span>
                      <span className="text-gray-400 tabular-nums">
                        <span className="font-bold text-gray-700">{row.count}</span> events  · {" "}
                        <span className="font-bold" style={{ color: row.color }}>{row.reach.toLocaleString()}</span> participants
                      </span>
                    </div>
                    <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: row.color + "1A" }}>
                      <div className="h-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-0.5 text-right">{row.pct}% of total reach</p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* â”€â”€ FOOTER STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="rounded overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-gray-100">
            {([
              { icon: Users,      value: TOTAL_PART.toLocaleString(), label: "Total Reach",         bg: "#BAE6FD", clr: "#075985" },
              { icon: Zap,        value: String(TOTAL_PROGS),          label: "Programmes Delivered", bg: "#99F6E4", clr: "#115E59" },
              { icon: Award,      value: `${AVG_SAT}/5`,               label: "Avg Satisfaction",     bg: "#DDD6FE", clr: "#5B21B6" },
              { icon: Target,     value: `${AVG_COMP}%`,               label: "Avg Completion",       bg: "#A7F3D0", clr: "#065F46" },
              { icon: Handshake,  value: String(TOTAL_PSHIP),          label: "Partnerships",         bg: "#FED7AA", clr: "#9A3412" },
              { icon: TrendingUp, value: fmt$(TOTAL_FUNDING),          label: "Funding Deployed",     bg: "#BBF7D0", clr: "#166534" },
            ] as const).map(({ icon: Icon, value, label, bg, clr }) => (
              <div key={label} className="px-5 py-5 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${clr}` }}>
                <Icon size={15} className="mx-auto mb-2" style={{ color: "rgba(255,255,255,0.72)" }} />
                <p className="text-2xl font-black tabular-nums text-white">{value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              HENT . OVERVIEW  ·  2023 - 2026
            </p>
            <p className="text-[10px] text-gray-400">Last updated: 01 Jun 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
