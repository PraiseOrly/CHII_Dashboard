"use client";
import HENTNav from "@/components/HENTNav";
import { fieldVisits } from "@/data/fieldVisits";
import { founders } from "@/data/founders";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { Award, Briefcase, Download, Handshake, Target, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";
import type { Stage, Sector, FundingStatus } from "@/types";

// â"€â"€â"€ Color palette â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Cool-only palette sampled from design1.png (no warm tones)
const NAVY    = "#0B2D71";
const PRIMARY = "#0B2D71";
const TEAL    = "#009CA6";
const PURPLE  = "#5C2D91";
const AMBER   = "#3FA0D8";
const GREEN   = "#00A07A";
const INDIGO  = "#5C2D91";
const ORANGE  = "#0B2D71";

const C_PURPLE = "#5C2D91";
const C_SKY    = "#3FA0D8";

// Per-programme identity colours (used consistently across all charts)
const PROG: Record<string, string> = {
  Hackathons:    ORANGE,
  Masterclasses: TEAL,
  "Field Visits": C_PURPLE,
  Mentorships:   C_SKY,
};

// â"€â"€â"€ Helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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
  return PURPLE;
}
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// â"€â"€â"€ Cross-programme aggregates â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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

// â"€â"€â"€ Chart data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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

// â"€â"€â"€ Sub-components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#D17A86" }} />
      <div>
        <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: "#0E4633", letterSpacing: "0.01em" }}>{title}</h2>
        {sub && <p className="mt-0.5" style={{ fontSize: 11, color: "#6B7280" }}>{sub}</p>}
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
    <div ref={cardRef} className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#0E4633", padding: "11px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
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
    <div className="rounded-[10px] p-3.5 text-center" style={{
      backgroundColor: "#ffffff",
      border: `1px solid ${color}`,
    }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.06em] leading-none" style={{ color: "#6B7280" }}>{label}</p>
        {Icon && (
          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}1A` }}>
            <Icon size={11} style={{ color }} />
          </div>
        )}
      </div>
      <p className="text-xl font-black tabular-nums leading-none" style={{ color: NAVY }}>{value}</p>
      {/* progress / underline bar */}
      <div className="mt-2 mb-1" style={{ height: 3, borderRadius: 999, backgroundColor: `${color}26`, overflow: "hidden" }}>
        <div style={{ height: "100%", width: "100%", backgroundColor: color, borderRadius: 999 }} />
      </div>
      {sub  && <p className="text-[9px] mt-1 font-medium" style={{ color: "#9CA3AF" }}>{sub}</p>}
      {note && <p className="text-[9px] mt-1.5 pt-1.5" style={{ color: "#6B7280", borderTop: "1px solid rgba(0,33,71,0.10)" }}>{note}</p>}
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

// â"€â"€â"€ Chart legend â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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

// â"€â"€â"€ Count-up animation â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// ─── Impact analytics constants ──────────────────────────────────────────────
const IMP_YEARS = [2022, 2023, 2024, 2025, 2026] as const;
type ImpYearVal = typeof IMP_YEARS[number] | "all";
const IMP_PROGRAMS = ["Hackathons", "Masterclasses", "Field Visits", "Mentorship"] as const;
type ImpProgVal = typeof IMP_PROGRAMS[number] | "all";
const VENTURE_STAGES: Stage[] = ["Ideation", "Validation", "Prototype/MVP", "Early Growth", "Scaling", "Investment/Funding"];
const VENTURE_SECTORS: Sector[] = ["Digital Health", "Medical Devices", "Diagnostics", "Health Logistics", "Pharma & Biotech", "Mental Health", "Maternal & Child Health", "Health Financing", "Community Health", "Health Data & AI"];
const IMP_STAGE_COLORS  = ["#F59E0B", "#EA580C", "#0D9488", "#0EA5E9", "#7C3AED", "#10B981"];
const IMP_SECTOR_COLORS = ["#0D9488", "#7C3AED", "#EA580C", "#0EA5E9", "#F43F5E", "#10B981", "#F59E0B", "#4338CA", "#8B5CF6", "#06B6D4"];

function ImpPillGroup<T extends string>({ options, value, onChange }: {
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

function ImpDropdown<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}
      className="text-[9px] font-bold rounded border appearance-none cursor-pointer focus:outline-none pl-2 pr-5 py-[5px]"
      style={{
        backgroundColor: "rgba(255,255,255,0.15)", color: "white",
        borderColor: "rgba(255,255,255,0.25)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-opacity='0.75' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center",
      }}>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ color: "#111827", backgroundColor: "white" }}>{o.label}</option>
      ))}
    </select>
  );
}

function ImpHBar({ label, value, max, color, dimmed = false }: { label: string; value: number; max: number; color: string; dimmed?: boolean }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-2.5 last:mb-0" style={{ opacity: dimmed ? 0.4 : 1, transition: "opacity 0.2s" }}>
      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{Math.round(value).toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: color + "22" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ImpChartCard({ title, sub, accent = PRIMARY, children, headerRight }: {
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
    <div ref={cardRef} className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center justify-between gap-3" style={{ backgroundColor: "#0E4633", padding: "11px 20px" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
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

function HENTImpactAnalytics() {
  const VIO = "#7C3AED"; const TEA = "#0D9488"; const GRN = "#10B981";
  const AMB = "#F59E0B"; const SKY = "#0EA5E9"; const ROS = "#F43F5E";
  const IND = "#4338CA"; const ONG = "#EA580C";

  const [yearFilter,      setYearFilter]      = useState<ImpYearVal>("all");
  const [programFilter,   setProgramFilter]   = useState<ImpProgVal>("all");
  const [stageFilter,     setStageFilter]     = useState<Stage | "all">("all");
  const [sectorFilter,    setSectorFilter]    = useState<Sector | "all">("all");
  const [growthMetric,    setGrowthMetric]    = useState<"participants" | "projects" | "startups">("participants");
  const [fundingStage,    setFundingStage]    = useState<Stage | "all">("all");
  const [portfolioGender, setPortfolioGender] = useState<"all" | "female" | "male" | "mixed">("all");

  function iAvg(arr: number[]) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
  function iFmt(n: number) { return Math.round(n).toLocaleString(); }

  const D = useMemo(() => {
    const yr = yearFilter;
    const hak = hackathons.filter(h => yr === "all" || h.year === yr);
    const mc  = masterclasses.filter(m => yr === "all" || m.year === yr);
    const fv  = fieldVisits.filter(v => yr === "all" || v.year === yr);
    const mf  = mentorshipPrograms.filter(p => yr === "all" || p.year === yr);
    const vcAll = ALL_VENTURES.filter(v => yr === "all" || v.cohort === yr);
    const vc    = vcAll.filter(v =>
      (stageFilter === "all" || v.stage === stageFilter) &&
      (sectorFilter === "all" || v.sector === sectorFilter));

    const hakPart  = hak.reduce((s, h) => s + h.participants, 0);
    const hakFem   = hak.reduce((s, h) => s + h.femaleCount, 0);
    const hakProj  = hak.reduce((s, h) => s + h.projects, 0);
    const hakStart = hak.reduce((s, h) => s + h.startupsCreated, 0);
    const hakPship = hak.reduce((s, h) => s + h.partnerships, 0);
    const mcAtt    = mc.reduce((s, m) => s + m.attendees, 0);
    const mcFem    = mc.reduce((s, m) => s + m.femaleAttendees, 0);
    const mcCompl  = Math.round(iAvg(mc.map(m => m.completionRate)));
    const mcSat    = parseFloat(iAvg(mc.map(m => iAvg(Object.values(m.scores)))).toFixed(1));
    const fvPart   = fv.reduce((s, v) => s + v.participants, 0);
    const fvFem    = fv.reduce((s, v) => s + v.femaleParticipants, 0);
    const fvCompl  = Math.round(iAvg(fv.map(v => v.completionRate)));
    const fvSat    = parseFloat(iAvg(fv.map(v => iAvg(Object.values(v.scores)))).toFixed(1));
    const fvPship  = fv.reduce((s, v) => s + v.partnerships, 0);
    const mfFel    = mf.reduce((s, p) => s + p.fellows, 0);
    const mfFem    = mf.reduce((s, p) => s + p.femaleFellows, 0);
    const mfCompl  = Math.round(iAvg(mf.map(p => p.completionRate)));
    const mfSat    = parseFloat(iAvg(mf.map(p => iAvg(Object.values(p.scores)))).toFixed(1));
    const mfGrad   = mf.filter(p => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0);

    const totalPart = hakPart + mcAtt + fvPart + mfFel;
    const totalFem  = hakFem + mcFem + fvFem + mfFem;
    const avgSat    = parseFloat(iAvg([mcSat, fvSat, mfSat].filter(x => x > 0)).toFixed(1));

    const stageDist  = VENTURE_STAGES.map(s => ({ name: s, value: vcAll.filter(v => v.stage === s).length }));
    const sectorDist = VENTURE_SECTORS.map(s => ({
      name: s.length > 16 ? s.slice(0, 14) + "…" : s, full: s,
      value: vcAll.filter(v => v.sector === s).length,
    }));
    const fundingByStage = (["Bootstrapped", "Grant", "Angel", "VC", "Revenue-Based", "None"] as FundingStatus[]).map(f => ({
      name: f, value: vcAll.filter(v => (fundingStage === "all" || v.stage === fundingStage) && v.fundingStatus === f).length,
    }));
    const stageDistGender = VENTURE_STAGES.map(s => {
      const pool = vcAll.filter(v => v.stage === s);
      const filtered = portfolioGender === "all" ? pool
        : portfolioGender === "female" ? pool.filter(v => v.teamGender === "Female")
        : portfolioGender === "male"   ? pool.filter(v => v.teamGender === "Male")
        : pool.filter(v => v.teamGender === "Mixed");
      return { name: s, value: filtered.length, total: pool.length };
    });
    const volByYear = IMP_YEARS.map(y => ({
      Year: String(y),
      Hackathons:     hackathons.filter(h => h.year === y).reduce((s, h) => s + h.participants, 0),
      Masterclasses:  masterclasses.filter(m => m.year === y).reduce((s, m) => s + m.attendees, 0),
      "Field Visits": fieldVisits.filter(v => v.year === y).reduce((s, v) => s + v.participants, 0),
      Mentorship:     mentorshipPrograms.filter(p => p.year === y).reduce((s, p) => s + p.fellows, 0),
      Projects:       hackathons.filter(h => h.year === y).reduce((s, h) => s + h.projects, 0),
      Startups:       hackathons.filter(h => h.year === y).reduce((s, h) => s + h.startupsCreated, 0),
    }));
    const qualityRows = [
      { name: "Masterclasses", sat: mcSat,  compl: mcCompl, color: SKY },
      { name: "Field Visits",  sat: fvSat,  compl: fvCompl, color: IND },
      { name: "Mentorship",    sat: mfSat,  compl: mfCompl, color: VIO },
    ];
    const countries = Array.from(new Set([
      ...hak.map(h => h.location.split(", ").pop() ?? ""),
      ...fv.map(v => v.country),
    ])).filter(Boolean);

    return {
      hak, mc, fv, mf, vc, vcAll,
      hakPart, hakFem, hakProj, hakStart, hakPship,
      mcAtt, mcFem, mcCompl, mcSat,
      fvPart, fvFem, fvCompl, fvSat, fvPship,
      mfFel, mfFem, mfCompl, mfSat, mfGrad,
      totalPart, totalFem, avgSat,
      stageDist, sectorDist, fundingByStage, stageDistGender,
      volByYear, qualityRows, countries,
    };
  }, [yearFilter, programFilter, stageFilter, sectorFilter, fundingStage, portfolioGender]);

  const stageOpts  = [{ label: "All Stages",  value: "all" as Stage | "all" }, ...VENTURE_STAGES.map(s => ({ label: s, value: s as Stage | "all" }))];
  const sectorOpts = [{ label: "All Sectors", value: "all" as Sector | "all" }, ...VENTURE_SECTORS.slice(0, 5).map(s => ({ label: s.split(" ")[0], value: s as Sector | "all" }))];
  const fsOpts     = [{ label: "All Stages",  value: "all" as Stage | "all" }, ...VENTURE_STAGES.map(s => ({ label: s, value: s as Stage | "all" }))];

  return (
    <div className="space-y-10">
      {/* KPI + year filter banner */}
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 flex items-center justify-between gap-4" style={{ backgroundColor: VIO }}>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-white">HENT Impact Analytics</p>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.70)" }}>
              Ventures · Hackathons · Masterclasses · Field Visits · Mentorship · {D.countries.length} countries
            </p>
          </div>
          <select value={String(yearFilter)}
            onChange={e => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value) as ImpYearVal)}
            className="text-xs font-medium border border-gray-200 text-gray-700 bg-white px-3 py-1.5 rounded appearance-none cursor-pointer focus:outline-none pr-7"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
            <option value="all">All Years</option>
            {IMP_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {([
              { label: "Portfolio Ventures",    num: D.vc.length,   fmt: iFmt, sub: "Filtered",            clr: VIO },
              { label: "Hackathon Part.",        num: D.hakPart,     fmt: iFmt, sub: "Sprint innovators",   clr: ONG },
              { label: "Projects Built",         num: D.hakProj,     fmt: iFmt, sub: "Designed solutions",  clr: AMB },
              { label: "Startups Created",       num: D.hakStart,    fmt: iFmt, sub: "From hackathons",     clr: ROS },
              { label: "Masterclass Attendees",  num: D.mcAtt,       fmt: iFmt, sub: `Compl ${D.mcCompl}%`, clr: SKY },
              { label: "Field Visit Part.",      num: D.fvPart,      fmt: iFmt, sub: "Site exposures",      clr: IND },
              { label: "Fellowship Fellows",     num: D.mfFel,       fmt: iFmt, sub: `Grads ${D.mfGrad}`,  clr: TEA },
              { label: "Avg Satisfaction",       num: D.avgSat * 10, fmt: (n: number) => `${(n / 10).toFixed(1)}/5`, sub: "Programmes", clr: GRN },
            ] as const).map(({ label, num, fmt, sub, clr }) => (
              <div key={label} className="rounded-lg border px-3 py-3 text-center" style={{ backgroundColor: clr, borderColor: clr }}>
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-tight mb-1.5" style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
                <p className="text-[1rem] font-black tabular-nums leading-none text-white">{fmt(num)}</p>
                <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.58)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venture Portfolio */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: VIO }} />
          <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: VIO }}>Venture Portfolio Analytics</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ImpChartCard title="Stage Distribution"
            sub={portfolioGender === "all" ? `${D.vc.length} ventures` : `${portfolioGender}-led by stage`}
            accent={VIO}
            headerRight={
              <div className="flex flex-col items-end gap-1.5">
                <ImpPillGroup
                  options={[{ label: "All", value: "all" }, { label: "Female", value: "female" }, { label: "Male", value: "male" }, { label: "Mixed", value: "mixed" }]}
                  value={portfolioGender} onChange={setPortfolioGender} />
                <ImpDropdown options={stageOpts} value={stageFilter} onChange={v => setStageFilter(v)} />
              </div>
            }>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={D.stageDistGender} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
                  formatter={(v: number, _: string, props: { payload?: { total: number } }) => [
                    portfolioGender === "all" ? v : `${v} of ${props.payload?.total ?? v} total`,
                    portfolioGender === "all" ? "Ventures" : `${portfolioGender}-led`,
                  ]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {D.stageDistGender.map((_, i) => (
                    <Cell key={i} fill={stageFilter === "all" || stageFilter === VENTURE_STAGES[i] ? IMP_STAGE_COLORS[i] : "#E5E7EB"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ImpChartCard>

          <ImpChartCard title="Sector Distribution" sub="Ventures by health sector focus" accent={TEA}
            headerRight={<ImpDropdown options={sectorOpts} value={sectorFilter} onChange={v => setSectorFilter(v)} />}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={D.sectorDist.filter(s => s.value > 0)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[11px] shadow">
                    <p className="font-bold">{(payload[0].payload as { full: string }).full}</p>
                    <p style={{ color: TEA }}>{payload[0].value} ventures</p>
                  </div>
                ) : null} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {D.sectorDist.filter(s => s.value > 0).map((s, i) => (
                    <Cell key={i} fill={sectorFilter === "all" || sectorFilter === s.full ? IMP_SECTOR_COLORS[i % IMP_SECTOR_COLORS.length] : "#E5E7EB"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ImpChartCard>

          <ImpChartCard title="Funding Status"
            sub={fundingStage === "all" ? "All venture stages" : `${fundingStage} ventures`}
            accent={GRN}
            headerRight={<ImpDropdown options={fsOpts} value={fundingStage} onChange={v => setFundingStage(v)} />}>
            <div className="space-y-3 mt-1">
              {D.fundingByStage.filter(f => f.value > 0).map((f, i) => {
                const fc = [AMB, TEA, SKY, VIO, GRN, "#9CA3AF"];
                const maxV = Math.max(...D.fundingByStage.map(x => x.value), 1);
                return <ImpHBar key={f.name} label={f.name} value={f.value} max={maxV} color={fc[i % fc.length]} />;
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded border p-3 text-center" style={{ backgroundColor: TEA + "10", borderColor: TEA + "22" }}>
                <p className="text-[9px] font-bold uppercase text-gray-500">Jobs created</p>
                <p className="text-xl font-black tabular-nums" style={{ color: TEA }}>{iFmt(D.vcAll.reduce((s, v) => s + v.jobsTotal, 0))}</p>
              </div>
              <div className="rounded border p-3 text-center" style={{ backgroundColor: VIO + "10", borderColor: VIO + "22" }}>
                <p className="text-[9px] font-bold uppercase text-gray-500">Avg health score</p>
                <p className="text-xl font-black tabular-nums" style={{ color: VIO }}>{Math.round(D.vcAll.reduce((s, v) => s + v.healthScore, 0) / (D.vcAll.length || 1))}</p>
              </div>
            </div>
          </ImpChartCard>
        </div>
      </section>

      {/* Programme Volume */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: ONG }} />
          <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: ONG }}>Programme Participation Over Time</p>
        </div>
        <ImpChartCard
          title="HENT Programme Growth"
          sub={growthMetric === "participants" ? "Participant reach · 2022–2026"
            : growthMetric === "projects" ? "Hackathon projects built per year"
            : "Hackathon startups created per year"}
          accent={ONG}
          headerRight={
            <div className="flex items-center gap-1.5">
              <ImpPillGroup
                options={[{ label: "Reach", value: "participants" }, { label: "Projects", value: "projects" }, { label: "Startups", value: "startups" }]}
                value={growthMetric} onChange={setGrowthMetric} />
              {growthMetric === "participants" && (
                <ImpPillGroup
                  options={[{ label: "All", value: "all" }, ...IMP_PROGRAMS.map(p => ({ label: p.split(" ")[0], value: p }))]}
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
                  const pc = [ONG, SKY, IND, VIO];
                  const visible = programFilter === "all" || programFilter === prog;
                  return <Bar key={prog} dataKey={prog} fill={visible ? pc[i] : "#E5E7EB"} radius={[4, 4, 0, 0]} opacity={visible ? 1 : 0.3} />;
                })}
              </BarChart>
            ) : (
              <BarChart data={D.volByYear} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Bar dataKey={growthMetric === "projects" ? "Projects" : "Startups"}
                  fill={growthMetric === "projects" ? ONG : ROS} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ImpChartCard>
      </section>

      {/* Programme Quality */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: SKY }} />
          <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: SKY }}>Programme Quality &amp; Outcomes</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ImpChartCard title="Satisfaction &amp; Completion" sub="Quality benchmarks per HENT programme" accent={SKY}>
            <div className="space-y-4">
              {D.qualityRows.map(q => (
                <div key={q.name}>
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
              ))}
              <div className="mt-2 rounded border p-3 flex items-center gap-2" style={{ backgroundColor: SKY + "08", borderColor: SKY + "22" }}>
                <p className="text-[10px] font-bold text-gray-600">Avg HENT satisfaction</p>
                <p className="text-sm font-black tabular-nums ml-auto" style={{ color: SKY }}>{D.avgSat}/5</p>
              </div>
            </div>
          </ImpChartCard>

          <ImpChartCard title="Hackathon Innovation Output" sub="Projects, startups, female participation" accent={ONG}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total projects",      value: D.hakProj,  color: ONG },
                  { label: "Startups created",    value: D.hakStart, color: AMB },
                  { label: "Female participants", value: D.hakFem,   color: ROS },
                  { label: "Partnerships",        value: D.hakPship, color: GRN },
                ].map(r => (
                  <div key={r.label} className="rounded border p-3 text-center" style={{ backgroundColor: r.color + "10", borderColor: r.color + "22" }}>
                    <p className="text-[9px] font-bold uppercase text-gray-500">{r.label}</p>
                    <p className="text-lg font-black tabular-nums mt-1" style={{ color: r.color }}>{iFmt(r.value)}</p>
                  </div>
                ))}
              </div>
              <div className="rounded border p-3">
                <p className="text-[10px] font-bold text-gray-600 mb-2">Category breakdown</p>
                {(["AI/Technology", "Health", "Business", "Sustainability", "Other"] as const).map((cat, i) => {
                  const cc = [TEA, ROS, VIO, GRN, AMB];
                  const val = D.hak.reduce((s, h) => s + (h.categories[cat] ?? 0), 0);
                  const mx  = D.hak.reduce((s, h) => s + (h.categories["Health"] ?? 0), 0) || 1;
                  return <ImpHBar key={cat} label={cat} value={val} max={mx} color={cc[i]} />;
                })}
              </div>
            </div>
          </ImpChartCard>

          <ImpChartCard title="Fellowship &amp; Field Impact" sub="Mentorship outcomes and field visit metrics" accent={IND}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border p-3 text-center" style={{ backgroundColor: VIO + "10", borderColor: VIO + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Total fellows</p>
                  <p className="text-xl font-black tabular-nums" style={{ color: VIO }}>{iFmt(D.mfFel)}</p>
                </div>
                <div className="rounded border p-3 text-center" style={{ backgroundColor: TEA + "10", borderColor: TEA + "22" }}>
                  <p className="text-[9px] font-bold uppercase text-gray-500">Graduate fellows</p>
                  <p className="text-xl font-black tabular-nums" style={{ color: TEA }}>{iFmt(D.mfGrad)}</p>
                </div>
              </div>
              <div className="rounded border p-3 space-y-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400">Fellowship</p>
                {[
                  { label: "Completion rate",  bar: D.mfCompl,                                                      color: VIO, display: `${D.mfCompl}%` },
                  { label: "Satisfaction",      bar: D.mfSat * 20,                                                   color: SKY, display: `${D.mfSat}/5`  },
                  { label: "Graduation rate",   bar: D.mfFel > 0 ? Math.round((D.mfGrad / D.mfFel) * 100) : 0,    color: TEA, display: `${D.mfFel > 0 ? Math.round((D.mfGrad / D.mfFel) * 100) : 0}%` },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                      <span className="font-medium">{r.label}</span>
                      <span className="font-bold tabular-nums" style={{ color: r.color }}>{r.display}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: r.color + "20" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(r.bar, 100)}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded border p-3 space-y-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400">Field Visits</p>
                {[
                  { label: "Completion rate",    bar: D.fvCompl,                                                                 color: IND, display: `${D.fvCompl}%` },
                  { label: "Satisfaction",        bar: D.fvSat * 20,                                                             color: TEA, display: `${D.fvSat}/5`  },
                  { label: "Female participants", bar: D.fvPart > 0 ? Math.round((D.fvFem / D.fvPart) * 100) : 0,              color: ROS, display: `${D.fvPart > 0 ? Math.round((D.fvFem / D.fvPart) * 100) : 0}%` },
                  { label: "Partnerships built",  bar: Math.min(D.fvPship, 100),                                                color: GRN, display: String(D.fvPship) },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                      <span className="font-medium">{r.label}</span>
                      <span className="font-bold tabular-nums" style={{ color: r.color }}>{r.display}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: r.color + "20" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(r.bar, 100)}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ImpChartCard>
        </div>
      </section>
    </div>
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

function KpiTile({ label, num, displayFmt, sub, clr, pct }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub: string; clr: string; pct?: number;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(14,70,51,0.12)", borderLeft: "5px solid #0E4633" }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(14,70,51,0.55)", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, color: "#0E4633", lineHeight: 1 }}>{displayFmt(animated)}</p>
      <p style={{ fontSize: 9.5, color: "rgba(14,70,51,0.55)", marginTop: 4 }}>{sub}</p>
      {/* progress / underline bar */}
      <div style={{ marginTop: 10, height: 3, borderRadius: 999, backgroundColor: "rgba(14,70,51,0.12)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.max(8, Math.min(100, pct ?? 100))}%`, backgroundColor: "#0E4633", borderRadius: 999 }} />
      </div>
    </div>
  );
}

// â"€â"€â"€ Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function ExecutiveDashboard() {
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <HENTNav />

      {/* â"€â"€ EXECUTIVE HEADER â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#0E4633", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges (natural aspect ratio) */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay — keeps the title area solid & readable */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #0E4633 34%, #0E4633 66%, rgba(14,70,51,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Overview</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>HENT executive summary — programme delivery, participation, ventures and impact</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>All programmes · 2022–2026 · {TOTAL_PROGS} programmes tracked · Updated June 2026</p>
          </div>
        </div>
      </header>
      </div>

      {/* â"€â"€ MAIN CONTENT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* â"€â"€ KPI STRIP â"€â"€â"€ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          <KpiTile label="Total Reach"      num={TOTAL_PART}          displayFmt={n => Math.round(n).toLocaleString()} sub="Participants"                              clr="#0EA5E9" />
          <KpiTile label="Active Ventures"  num={ALL_VENTURES.length}  displayFmt={n => String(Math.round(n))}          sub="In portfolio"                            clr="#7C3AED" />
          <KpiTile label="Female Reach"     num={FEMALE_PCT}           displayFmt={n => `${Math.round(n)}%`}            sub={`${TOTAL_FEM.toLocaleString()} people`}  clr="#EC4899" pct={FEMALE_PCT} />
          <KpiTile label="Programmes"       num={TOTAL_PROGS}          displayFmt={n => String(Math.round(n))}          sub="Delivered"                               clr="#EA580C" />
          <KpiTile label="Avg Satisfaction" num={AVG_SAT}              displayFmt={n => `${n.toFixed(1)}/5`}           sub="Rated progs"                             clr="#14B8A6" pct={(AVG_SAT / 5) * 100} />
          <KpiTile label="Avg Completion"   num={AVG_COMP}             displayFmt={n => `${Math.round(n)}%`}            sub="Completion"                              clr="#22C55E" pct={AVG_COMP} />
          <KpiTile label="Partnerships"     num={TOTAL_PSHIP}          displayFmt={n => String(Math.round(n))}          sub="Cross-sector"                            clr="#F59E0B" />
          <KpiTile label="1-Yr Fellows"     num={mfGrad}               displayFmt={n => String(Math.round(n))}          sub="Grad fellows"                            clr="#4338CA" />
        </div>

        {/* â"€â"€ HERO EXEC CARDS â"€â"€â"€ */}
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

        {/* â"€â"€ SECTION 1: PROGRAMME ACTIVITY â"€â"€â"€ */}
        {/* Section pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[{ n: 0, label: "All Sections" }, { n: 1, label: "Delivery" }, { n: 2, label: "Participation" }, { n: 3, label: "Performance" }, { n: 4, label: "Ventures" }, { n: 5, label: "Impact" }].map(({ n, label }) => {
            const on = n === 0 ? activeSection === "all" : activeSection === n;
            return (
              <button key={n} onClick={() => setActiveSection(n === 0 ? "all" : n)}
                style={{ fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer", border: `1px solid ${on ? "#0E4633" : "rgba(14,70,51,0.18)"}`, backgroundColor: on ? "#0E4633" : "white", color: on ? "white" : "#6B7280" }}>
                {label}
              </button>
            );
          })}
        </div>

        <section style={{ display: show(1) ? undefined : "none" }}>
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

        {/* â"€â"€ SECTION 2: PARTICIPATION & GENDER â"€â"€â"€ */}
        <section style={{ display: show(2) ? undefined : "none" }}>
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

        {/* â"€â"€ SECTION 3: PROGRAMME PERFORMANCE â"€â"€â"€ */}
        <section style={{ display: show(3) ? undefined : "none" }}>
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

        {/* â"€â"€ SECTION 4: VENTURE ECOSYSTEM â"€â"€â"€ */}
        <section style={{ display: show(4) ? undefined : "none" }}>
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

        {/* ── IMPACT ANALYTICS (from Impact Dashboard) ─────────────────── */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <HENTImpactAnalytics />
        </section>

        {/* â"€â"€ FOOTER STRIP â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
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
                <span style={{ color: "#7FD0B6", fontWeight: 600 }}>Data Last Synced:</span> 01 Jun 2026, EAT
              </span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}>
                <span style={{ color: "#7FD0B6", fontWeight: 600 }}>Source:</span> HENT Programmes M&amp;E
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
