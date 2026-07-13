"use client";
import { benchColor } from "@/theme/tokens";
import { useCountUp } from "@/components/ui";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { DonutRing } from "@/components/charts/donut-chart";
import AfricaMap from "@/components/charts/africa-map";
import { type RadarSeries } from "@/components/charts/satisfaction-radar";
import SatisfactionBars from "@/components/charts/satisfaction-bars";
import BulletChart from "@/components/charts/bullet-chart";
import ProgressRing from "@/components/charts/progress-ring";
import { PALETTE } from "@/styles/palette";
import { studyTrips } from "@/data/study-trips";
import { founders } from "@/data/founders";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { Award, Briefcase, Handshake, Lightbulb, MapPin, Presentation, Rocket, Sparkles, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";
import type { Stage, Sector, FundingStatus } from "@/types";

// â"€â"€â"€ Color palette â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Cool-only palette sampled from design1.png (no warm tones)
const PRIMARY = "#0B2D71";
const TEAL    = "#009CA6";
const PURPLE  = "#2D6A4F"; // female gender bars (forest)
const AMBER   = "#3FA0D8";
const GREEN   = "#00A07A";
const INDIGO  = "#1B4332";
const ORANGE  = "#0B2D71";

const C_PURPLE = "#5C2D91";
const C_SKY    = "#3FA0D8";

// Per-programme identity colours — muted green family, distinct by hue
// (forest → dusty teal → olive → pale sage). Used consistently across all charts.
const PROG: Record<string, string> = {
  Hackathons:    "#1B4332",
  Masterclasses: "#1F9E9E",
  "Study Trips": "#A6C13C",
  Mentorships:   "#BBD59B",
};

// Series colour order for the year charts (Hackathons, Masterclasses, Study Trips, Mentorships)
const PROG_YEAR_COLORS = [PROG.Hackathons, PROG.Masterclasses, PROG["Study Trips"], PROG.Mentorships] as const;

// â"€â"€â"€ Helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n/1_000)}K` : `$${n}`;
}
function sg(s: string) {
  if (s === "Ideation" || s === "Validation") return "Expose";
  if (s === "Prototype/MVP" || s === "Early Growth") return "Build";
  return "Scale";
}
// Sequential satisfaction scale: deep green → light green → amber → red
const HEAT_VERY_HIGH = "#1B4332";
const HEAT_HIGH      = "#43AA8B";
const HEAT_MODERATE  = "#E9C46A";
const HEAT_LOW       = "#E63946";
function heatColor(v: number): string {
  if (v >= 4.5) return HEAT_VERY_HIGH;
  if (v >= 4.0) return HEAT_HIGH;
  if (v >= 3.5) return HEAT_MODERATE;
  return HEAT_LOW;
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

const fvPart  = studyTrips.reduce((s, v) => s + v.participants, 0);
const fvFem   = studyTrips.reduce((s, v) => s + v.femaleParticipants, 0);
const fvComp  = Math.round(avg(studyTrips.map(v => v.completionRate)));
const fvPship = studyTrips.reduce((s, v) => s + v.partnerships, 0);
const fvSat   = parseFloat(avg(studyTrips.map(v => avg(Object.values(v.scores)))).toFixed(1));

const mfFel   = mentorshipPrograms.reduce((s, p) => s + p.fellows, 0);
const mfFem   = mentorshipPrograms.reduce((s, p) => s + p.femaleFellows, 0);
const mfComp  = Math.round(avg(mentorshipPrograms.map(p => p.completionRate)));
const mfSat   = parseFloat(avg(mentorshipPrograms.map(p => avg(Object.values(p.scores)))).toFixed(1));
const mfGrad  = mentorshipPrograms.filter(p => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0);

const TOTAL_PART    = hackPart + mcAtt + fvPart + mfFel;
const TOTAL_FEM     = hackFem  + mcFem  + fvFem  + mfFem;
const FEMALE_PCT    = Math.round((TOTAL_FEM / TOTAL_PART) * 100);
const TOTAL_PROGS   = hackathons.length + masterclasses.length + studyTrips.length + mentorshipPrograms.length;
const TOTAL_PSHIP   = hackPship + fvPship;
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
    "Study Trips": studyTrips.filter(v => v.year === yr).length,
    Mentorships:   mentorshipPrograms.filter(p => p.year === yr).length,
  }))
  .filter(d => d.Hackathons + d.Masterclasses + d["Study Trips"] + d.Mentorships > 0);

const participantsByYear = YEARS
  .map(yr => ({
    Year:          String(yr),
    Hackathons:    hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0),
    Masterclasses: masterclasses.filter(m => m.year === yr).reduce((s, m) => s + m.attendees, 0),
    "Study Trips": studyTrips.filter(v => v.year === yr).reduce((s, v) => s + v.participants, 0),
    Mentorships:   mentorshipPrograms.filter(p => p.year === yr).reduce((s, p) => s + p.fellows, 0),
  }))
  .filter(d => d.Hackathons + d.Masterclasses + d["Study Trips"] + d.Mentorships > 0);

const genderByProg = [
  { label: "Hackathons",    femalePct: Math.round(hackFem / hackPart * 100), maleColor: ORANGE  },
  { label: "Masterclasses", femalePct: Math.round(mcFem   / mcAtt    * 100), maleColor: TEAL    },
  { label: "Study Trips",  femalePct: Math.round(fvFem   / fvPart   * 100), maleColor: AMBER   },
  { label: "Mentorships",   femalePct: Math.round(mfFem   / mfFel    * 100), maleColor: GREEN   },
];

const sectorCounts = ALL_VENTURES.reduce<Record<string, number>>((a, v) => {
  a[v.sector] = (a[v.sector] || 0) + 1; return a;
}, {});
const sectorData = Object.entries(sectorCounts)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value);

// Green-family ramp for categorical charts (sectors, countries) — distinct by hue/value
const GREEN_RAMP = ["#1B4332","#1F9E9E","#A6C13C","#BBD59B","#2D6A4F","#4C8C8A","#6B8E5B","#8FA45A","#40916C","#C8DDB5","#7FB9B7","#5A7D3F","#9DC3A0","#245C51","#D2E3BE"];
// Very distinct multi-hue palette for donut charts (no repeats)
const DISTINCT = ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5","#00BBF9","#BC6C25","#8AB17D","#D62828","#3D405B"];
const PALETTE_NEUTRAL = "#888780";
const SECTOR_HEX = GREEN_RAMP;

const stageData = [
  { name: "Expose", value: ALL_VENTURES.filter(v => sg(v.stage) === "Expose").length },
  { name: "Build",  value: ALL_VENTURES.filter(v => sg(v.stage) === "Build").length  },
  { name: "Scale",  value: ALL_VENTURES.filter(v => sg(v.stage) === "Scale").length  },
];
const STAGE_HEX = ["#1B4332", "#2D8A8A", "#A6C13C"];


const COUNTRY_HEX = GREEN_RAMP;

// Country → region grouping (used by the Geographic Reach filter)
const COUNTRY_REGION: Record<string, string> = {
  Kenya: "East Africa", Rwanda: "East Africa", Ethiopia: "East Africa", Uganda: "East Africa", Tanzania: "East Africa",
  Nigeria: "West Africa", Ghana: "West Africa", Senegal: "West Africa", "Côte d'Ivoire": "West Africa",
  "South Africa": "Southern Africa", Zimbabwe: "Southern Africa", Zambia: "Southern Africa",
};
const GEO_REGIONS = Array.from(new Set(Object.values(COUNTRY_REGION)));
const GEO_COUNTRIES = Array.from(new Set(ALL_VENTURES.map(v => v.country))).sort();
const GEO_YEARS = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort();

const satCompare = [
  { name: "Masterclasses", value: mcSat  },
  { name: "Study Trips",  value: fvSat  },
  { name: "Mentorships",   value: mfSat  },
];

const compCompare = [
  { name: "Masterclasses", value: mcComp },
  { name: "Study Trips",  value: fvComp },
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
    program:       "Study Trips",
    Quality:       parseFloat(avg(studyTrips.map(v => v.scores["Learning Experience"])).toFixed(1)),
    Usefulness:    parseFloat(avg(studyTrips.map(v => v.scores["Practical Knowledge Gained"])).toFixed(1)),
    Accessibility: parseFloat(avg(studyTrips.map(v => v.scores["Accessibility & Organisation"])).toFixed(1)),
    Relevance:     parseFloat(avg(studyTrips.map(v => v.scores["Relevance to Venture Growth"])).toFixed(1)),
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

// â"€â"€â"€ Programme Performance (radar / bullet / rings) â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Per-programme colour + line style, using the standardised palette
const PROG_STYLE: Record<string, { color: string; dashed: boolean; fillOpacity: number }> = {
  "Masterclasses": { color: PALETTE.masterclasses, dashed: false, fillOpacity: 0.08 },
  "Study Trips":  { color: PALETTE.studyTrips,   dashed: false, fillOpacity: 0.08 },
  "Mentorships":   { color: PALETTE.mentorships,   dashed: true,  fillOpacity: 0.06 },
};
const radarSeries: RadarSeries[] = perfHeatmap.map(row => {
  const values = HEAT_COLS.reduce<Record<string, number>>((a, c) => { a[c] = row[c]; return a; }, {});
  const avgScore = parseFloat(avg(HEAT_COLS.map(c => row[c])).toFixed(1));
  const st = PROG_STYLE[row.program];
  return { name: row.program, color: st.color, dashed: st.dashed, fillOpacity: st.fillOpacity, values, avg: avgScore };
});
// Auto-detect the weakest dimension (lowest average across programmes)
const weakestDim = [...HEAT_COLS]
  .map(c => ({ dim: c, score: avg(perfHeatmap.map(r => r[c])) }))
  .sort((a, b) => a.score - b.score)[0].dim;
const satBulletRows = satCompare.map(d => ({ name: d.name, value: d.value, color: PROG_STYLE[d.name].color }));
const compRingRows  = compCompare.map(d => ({ name: d.name, value: d.value, color: PROG_STYLE[d.name].color }));

// â"€â"€â"€ Derived data for the restructured (programme-lifecycle) overview â"€â"€â"€
const hackProjects = hackathons.reduce((s, h) => s + h.projects, 0);

// Hackathon innovation output per year (projects, startups, conversion rate)
const hackYearData = YEARS
  .map(yr => {
    const projects = hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.projects, 0);
    const startups = hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.startupsCreated, 0);
    return { Year: String(yr), Projects: projects, Startups: startups, Rate: projects ? Math.round((startups / projects) * 100) : 0 };
  })
  .filter(d => d.Projects + d.Startups > 0);
const INNO_COLORS = ["#2D6A4F", "#A6C13C"] as const; // Projects, Startups

const femaleLedVentures = ALL_VENTURES.filter(v => v.teamGender === "Female").length;
const scaleShare = Math.round((stageData.find(s => s.name === "Scale")?.value ?? 0) / ALL_VENTURES.length * 100);

const participantsByProgData = [
  { name: "Masterclasses", value: mcAtt },
  { name: "Study Trips",  value: fvPart },
  { name: "Mentorships",   value: mfFel },
  { name: "Hackathons",    value: hackPart },
].sort((a, b) => b.value - a.value);

// Programme comparison (hackathons have no satisfaction / completion data)
const PROG_COMPARE: { name: string; reach: number; sat: number | null; comp: number | null }[] = [
  { name: "Hackathons",    reach: hackPart, sat: null,  comp: null  },
  { name: "Masterclasses", reach: mcAtt,    sat: mcSat, comp: mcComp },
  { name: "Study Trips",  reach: fvPart,   sat: fvSat, comp: fvComp },
  { name: "Mentorships",   reach: mfFel,    sat: mfSat, comp: mfComp },
];

const _reachByProg = [
  { name: "Hackathons",    reach: hackPart },
  { name: "Masterclasses", reach: mcAtt },
  { name: "Study Trips",  reach: fvPart },
  { name: "Mentorships",   reach: mfFel },
];
const topReach = _reachByProg.reduce((a, b) => (b.reach > a.reach ? b : a));
const topSat   = satCompare.reduce((a, b) => (b.value > a.value ? b : a));
const topComp  = compCompare.reduce((a, b) => (b.value > a.value ? b : a));

const insights = [
  `${topReach.name} account for the largest share of participant reach (${topReach.reach.toLocaleString()} participants).`,
  `${topComp.name} have the highest completion rate at ${topComp.value}%.`,
  `${topSat.name} record the highest average satisfaction at ${topSat.value}/5.`,
  `${scaleShare}% of portfolio ventures have progressed to the Scale stage.`,
  `HENT-supported ventures have created ${TOTAL_JOBS.toLocaleString()} jobs and deployed ${fmt$(TOTAL_FUNDING)} in funding.`,
  `Female participation stands at ${FEMALE_PCT}% across all programmes — close to parity.`,
  `Hackathons have generated ${hackProjects} projects and ${hackStart} startups to date.`,
];

// â"€â"€â"€ Sub-components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

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

function ChartCard({ title, sub, accent = PRIMARY, info, children }: {
  title: string; sub?: string; accent?: string; info?: string; children: React.ReactNode;
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
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    handleDownload();
  }
  return (
    <div ref={cardRef} onContextMenu={handleContextMenu} title="Right-click to download this chart"
      className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#2D6A4F", padding: "12px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.8)" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
            {(info || sub) && <InfoDot tip={(info || sub)!} color="#FFFFFF" />}
          </div>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// White card with a green header bar
function PlainCard({ title, sub, chip, fill, children }: {
  title: string; sub?: string; chip?: React.ReactNode; fill?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden" style={{
      backgroundColor: PALETTE.surfaceCard, border: `1px solid ${PALETTE.border}`, borderRadius: 12,
      height: fill ? "100%" : undefined, display: fill ? "flex" : undefined, flexDirection: fill ? "column" : undefined,
    }}>
      <div className="flex items-center justify-between gap-3" style={{ backgroundColor: "#2D6A4F", padding: "12px 20px" }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1.2 }}>{title}</p>
          {sub && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{sub}</p>}
        </div>
        {chip}
      </div>
      <div style={{ padding: 20, flex: fill ? 1 : undefined, display: fill ? "flex" : undefined, flexDirection: fill ? "column" : undefined, justifyContent: fill ? "center" : undefined }}>
        {children}
      </div>
    </div>
  );
}

function ExecCard({ label, value, sub, note, icon: Icon, center = false, tip }: {
  label: string; value: string | number; sub?: string; color?: string;
  note?: string; bg?: string; icon?: LucideIcon; center?: boolean; tip?: string;
}) {
  const GREEN_BRAND = "#2D6A4F";
  return (
    <div className="rounded-[10px]" style={{
      backgroundColor: "#ffffff",
      border: `1px solid ${GREEN_BRAND}`,
      padding: "13px 15px",
      display: "flex",
      flexDirection: center ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      textAlign: center ? "center" : "left",
      gap: center ? 6 : 11,
      position: "relative",
      overflow: "visible",
    }}>
      {Icon && (
        <span className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36 }}>
          <Icon size={20} style={{ color: GREEN_BRAND }} />
        </span>
      )}
      <div style={{ minWidth: 0 }}>
        <p className="tabular-nums" style={{ fontSize: 21, fontWeight: 800, color: GREEN_BRAND, lineHeight: 1.05 }}>{value}</p>
        <div className="flex items-center gap-1" style={{ justifyContent: center ? "center" : "flex-start", marginTop: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
          {tip && <InfoDot tip={tip} />}
        </div>
        {sub  && <p style={{ fontSize: 9, fontWeight: 500, color: "#9CA3AF", marginTop: 2 }}>{sub}</p>}
        {note && <p className="mt-1.5 pt-1.5" style={{ fontSize: 9, color: "#6B7280", borderTop: "1px solid rgba(0,33,71,0.10)" }}>{note}</p>}
      </div>
    </div>
  );
}

// Custom multi-colour horizontal bar  -  replaces Tremor BarList
function ColorBarList({ data, colors, barHeight = 18, gap = 8 }: { data: { name: string; value: number }[]; colors: string[]; barHeight?: number; gap?: number }) {
  const max = data[0]?.value ?? 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {data.map((row, i) => {
        const col = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="w-[88px] text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight truncate">{row.name}</div>
            <div className="flex-1 rounded-sm overflow-hidden" style={{ height: barHeight, backgroundColor: col + "1A" }}>
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
    <div className="relative flex items-center gap-3 mb-4 last:mb-0"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setHovered(null)}>
      <div className="w-28 text-[11px] text-gray-600 text-right font-medium flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-8 rounded-sm overflow-hidden flex" style={{ backgroundColor: PURPLE + "15" }}>
        <div style={{ width: `${femalePct}%`, backgroundColor: PURPLE, cursor: "pointer",
            opacity: hovered && hovered.label !== "Female" ? 0.45 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Female", pct: femalePct, color: PURPLE })} />
        <div style={{ width: `${100 - femalePct}%`, backgroundColor: maleColor, cursor: "pointer",
            opacity: hovered && hovered.label !== "Male" ? 0.45 : 1, transition: "opacity 0.15s" }}
          onMouseEnter={() => setHovered({ label: "Male", pct: 100 - femalePct, color: maleColor })} />
      </div>
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
  ["Study Trips", PROG["Study Trips"]],
  ["Mentorships", PROG.Mentorships],
] as const;

function ChartLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
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

// â"€â"€â"€ Restructured-overview widgets â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = steps[0]?.value || 1;
  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const pct = Math.max(8, Math.round((s.value / max) * 100));
        const conv = i > 0 && steps[i - 1].value > 0 ? Math.round((s.value / steps[i - 1].value) * 100) : null;
        return (
          <div key={s.label}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-gray-700">{s.label}</span>
              <span className="font-bold tabular-nums" style={{ color: "#0E4633" }}>
                {s.value.toLocaleString()}{conv !== null && <span className="text-gray-400 font-medium"> · {conv}%</span>}
              </span>
            </div>
            <div className="h-6 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(14,70,51,0.08)" }}>
              <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, backgroundColor: "#0E4633", opacity: 1 - i * 0.13 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompareTable({ rows }: { rows: { name: string; reach: number; sat: number | null; comp: number | null }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr>
            <th className="text-left text-gray-400 font-bold pb-3 pr-6 uppercase tracking-wider text-[9px]">Programme</th>
            <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Reach</th>
            <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Satisfaction</th>
            <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Completion</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className="border-t border-gray-100">
              <td className="py-2.5 pr-6 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PROG[r.name] ?? "#0E4633" }} />
                  <span className="font-semibold text-gray-700">{r.name}</span>
                </span>
              </td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums text-gray-700">{r.reach.toLocaleString()}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: "#0E4633" }}>{r.sat !== null ? `${r.sat}/5` : "—"}</td>
              <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: "#0E4633" }}>{r.comp !== null ? `${r.comp}%` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

function InsightList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((t, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <span className="rounded-full flex-shrink-0 mt-1.5" style={{ width: 6, height: 6, backgroundColor: "#0E4633" }} />
          <p className="text-[12px] text-gray-700 leading-relaxed">{t}</p>
        </div>
      ))}
    </div>
  );
}

// â"€â"€â"€ Count-up animation â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

// Small "i" tooltip badge — mirrors the executive dashboard stat cards
function InfoDot({ tip, color = "#2D6A4F" }: { tip: string; color?: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: `${color}22`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color, lineHeight: 1, userSelect: "none" }}>i</span>
      {show && (
        <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", color: "#111827", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 190, boxShadow: "0 6px 20px rgba(0,0,0,0.22)", zIndex: 100, textAlign: "left", pointerEvents: "none", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function KpiTile({ label, num, displayFmt, sub, clr, pct, bench, Icon, tip }: {
  label: string; num: number; displayFmt: (n: number) => string;
  sub?: string; clr: string; pct?: number; bench?: number; Icon?: LucideIcon; tip?: string;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(14,70,51,0.12)", borderLeft: "5px solid #2D6A4F", position: "relative", overflow: "visible" }}>
      <div className="flex items-center justify-center gap-1" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(14,70,51,0.55)" }}>{label}</p>
        {tip && <InfoDot tip={tip} />}
      </div>
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon size={18} style={{ color: "#0E4633", opacity: 0.85, flexShrink: 0 }} />}
        <p style={{ fontSize: 24, fontWeight: 700, color: "#0E4633", lineHeight: 1 }}>{displayFmt(animated)}</p>
      </div>
      {sub && <p style={{ fontSize: 9.5, color: "rgba(14,70,51,0.55)", marginTop: 4 }}>{sub}</p>}
      {pct !== undefined && (
        <div className="relative" style={{ marginTop: 10, height: 4, borderRadius: 4, backgroundColor: "rgba(14,70,51,0.12)" }} title={bench !== undefined ? `Benchmark: ${Math.round(bench)}%` : undefined}>
          <div style={{ height: "100%", width: `${Math.max(4, Math.min(100, pct))}%`, backgroundColor: bench !== undefined ? benchColor(pct, bench) : "#0E4633", borderRadius: 4 }} />
          {bench !== undefined && (
            <div className="absolute" style={{ top: -3, bottom: -3, width: 2, left: `${Math.min(100, bench)}%`, backgroundColor: "#0E4633", borderRadius: 1 }} />
          )}
        </div>
      )}
    </div>
  );
}

// â"€â"€â"€ Executive-style chart tooltip (green swap of the impact ChartTip) â"€â"€â"€
const TIP_GREEN = "#0F4C3A";
function tipFmt(n: number) { return Math.round(n).toLocaleString(); }
function HentChartTip({ active, payload, label, hideLabel, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(14,70,51,0.12)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {!hideLabel && label != null && <p style={{ fontWeight: 700, color: TIP_GREEN, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5, margin: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill || p.stroke, display: "inline-block" }} />
          {p.name}: <b style={{ color: TIP_GREEN }}>{typeof p.value === "number" ? tipFmt(p.value) : p.value}{unit || ""}</b>
        </p>
      ))}
    </div>
  );
}

// â"€â"€â"€ Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function ExecutiveDashboard() {
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  // Geographic Reach filters
  const [geoRegion, setGeoRegion]   = useState("All Regions");
  const [geoCountry, setGeoCountry] = useState("All Countries");
  const [geoYear, setGeoYear]       = useState("All Years");
  const geoCountryData = useMemo(() => {
    const counts = ALL_VENTURES
      .filter(v => geoRegion === "All Regions" || COUNTRY_REGION[v.country] === geoRegion)
      .filter(v => geoCountry === "All Countries" || v.country === geoCountry)
      .filter(v => geoYear === "All Years" || String(v.cohort) === geoYear)
      .reduce<Record<string, number>>((a, v) => { a[v.country] = (a[v.country] || 0) + 1; return a; }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [geoRegion, geoCountry, geoYear]);
  // Reach by Region has its own independent year filter + richer detail
  const [regionYear, setRegionYear] = useState("All Years");
  const regionChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    const countries: Record<string, Set<string>> = {};
    const female: Record<string, number> = {};
    ALL_VENTURES
      .filter(v => regionYear === "All Years" || String(v.cohort) === regionYear)
      .forEach(v => {
        const r = COUNTRY_REGION[v.country] || "Other";
        counts[r] = (counts[r] || 0) + 1;
        (countries[r] = countries[r] || new Set()).add(v.country);
        if (v.teamGender === "Female") female[r] = (female[r] || 0) + 1;
      });
    return Object.keys(counts)
      .map(r => ({ name: r, value: counts[r], countries: countries[r].size, femaleLed: female[r] || 0 }))
      .sort((a, b) => b.value - a.value);
  }, [regionYear]);
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <PortalNav portal="hent" />

      {/* â"€â"€ EXECUTIVE HEADER â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#2D6A4F", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges (natural aspect ratio) */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay — keeps the title area solid & readable */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(14,70,51,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Overview</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Programme delivery, participation, ventures and impact</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span>{TOTAL_PROGS} programmes tracked</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* â"€â"€ MAIN CONTENT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* â"€â"€ KPI STRIP â"€â"€â"€ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiTile label="Total Reach"      num={TOTAL_PART}          displayFmt={n => Math.round(n).toLocaleString()} clr="#0EA5E9" Icon={Users}     tip="Total participants reached across all four HENT programme types." />
          <KpiTile label="Active Ventures"  num={ALL_VENTURES.length}  displayFmt={n => String(Math.round(n))}          clr="#7C3AED" Icon={Rocket}    tip="Ventures currently in the HENT portfolio." />
          <KpiTile label="Female Reach"     num={FEMALE_PCT}           displayFmt={n => `${Math.round(n)}%`}            clr="#EC4899" Icon={Sparkles}  tip={`Share of participants who are female (${TOTAL_FEM.toLocaleString()} people).`} />
          <KpiTile label="Partnerships"     num={TOTAL_PSHIP}          displayFmt={n => String(Math.round(n))}          clr="#F59E0B" Icon={Handshake} tip="Cross-sector partnership agreements formed through HENT programmes." />
          <KpiTile label="Jobs Created"     num={TOTAL_JOBS}           displayFmt={n => Math.round(n).toLocaleString()} clr="#4338CA" Icon={Briefcase} tip="Jobs created by HENT-supported ventures to date." />
        </div>

        {/* â"€â"€ SECTION 1: PROGRAMME ACTIVITY â"€â"€â"€ */}
        {/* Section pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[{ n: 0, label: "All Sections" }, { n: 1, label: "Delivery" }, { n: 2, label: "Participants" }, { n: 3, label: "Performance" }, { n: 4, label: "Innovation" }, { n: 5, label: "Ventures & Impact" }].map(({ n, label }) => {
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
          <SecHeader title="Programme Delivery"
            sub="How much programmes have we delivered across the four HENT programme types?" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <ExecCard label="Hackathons"    value={hackathons.length}         icon={Lightbulb} />
            <ExecCard label="Masterclasses" value={masterclasses.length}      icon={Presentation} />
            <ExecCard label="Mentorships"   value={mentorshipPrograms.length} icon={Users} />
            <ExecCard label="Study Trips"  value={studyTrips.length}        icon={MapPin} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Programmes per Year"
              sub="By programme type"
              accent={ORANGE}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activityByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<HentChartTip hideLabel />} />
                  {(["Hackathons","Masterclasses","Study Trips","Mentorships"] as const).map((cat, i) => (
                    <Bar key={cat} dataKey={cat} fill={PROG_YEAR_COLORS[i]} radius={[4, 4, 0, 0]} maxBarSize={16} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {(["Hackathons","Masterclasses","Study Trips","Mentorships"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PROG_YEAR_COLORS[i] }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Participants per Year"
              sub="By programme type"
              accent={TEAL}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={participantsByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<HentChartTip hideLabel />} />
                  {(["Hackathons","Masterclasses","Study Trips","Mentorships"] as const).map((cat, i) => (
                    <Line key={cat} type="monotone" dataKey={cat}
                      stroke={PROG_YEAR_COLORS[i]} strokeWidth={2.5}
                      dot={{ r: 4, fill: PROG_YEAR_COLORS[i], strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend />
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 2: PARTICIPATION & GENDER â"€â"€â"€ */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SecHeader title="Participant Reach"
            sub="Who are we reaching — gender distribution, programme reach, and geographic spread" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Gender Distribution"
              sub="Female vs male share by programme"
              accent={PURPLE}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={genderByProg.map(g => ({ name: g.label, Female: g.femalePct, Male: 100 - g.femalePct }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<HentChartTip unit="%" />} />
                  <Bar dataKey="Female" stackId="g" fill={PURPLE} radius={[0, 0, 0, 0]} maxBarSize={46} />
                  <Bar dataKey="Male"   stackId="g" fill="#A6C13C" radius={[4, 4, 0, 0]} maxBarSize={46} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-5 text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PURPLE }} /> Female
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#A6C13C" }} /> Male
                </span>
              </div>
            </ChartCard>

            <ChartCard title="Participants by Programme"
              sub="Reach by programme type"
              accent={C_SKY}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={participantsByProgData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<HentChartTip />} />
                  <Bar dataKey="value" name="Participants" radius={[4, 4, 0, 0]} maxBarSize={46}>
                    {participantsByProgData.map((d) => (
                      <Cell key={d.name} fill={PROG[d.name] ?? PALETTE_NEUTRAL} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {participantsByProgData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: PROG[d.name] ?? PALETTE_NEUTRAL }} />{d.name}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Geographic reach + region breakdown — 2-col row (executive layout) */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Geographic Reach"
              sub="Ventures by country"
              accent={GREEN}>
              <div className="flex flex-wrap gap-2 mb-4">
                <FilterSelect label="Country" value={geoCountry} onChange={setGeoCountry}
                  options={["All Countries", ...GEO_COUNTRIES]} />
                <FilterSelect label="Year" value={geoYear} onChange={setGeoYear}
                  options={["All Years", ...GEO_YEARS.map(String)]} />
              </div>
              {geoCountryData.length ? (
                <AfricaMap data={geoCountryData}
                  region={geoRegion} onRegionChange={setGeoRegion}
                  regions={["All Regions", ...GEO_REGIONS]} />
              ) : (
                <p className="text-[11px] text-gray-400 text-center py-6">No ventures match the selected filters.</p>
              )}
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {geoCountryData.reduce((s, d) => s + d.value, 0)} ventures · {geoCountryData.length} countries
              </p>
            </ChartCard>

            <ChartCard title="Reach by Region"
              sub="Ventures, countries and female-led split by African region"
              accent={C_SKY}>
              <div className="flex flex-wrap gap-2 mb-4">
                <FilterSelect label="Year" value={regionYear} onChange={setRegionYear}
                  options={["All Years", ...GEO_YEARS.map(String)]} />
              </div>
              {regionChartData.length ? (
                <>
                  <ResponsiveContainer width="100%" height={190}>
                    <BarChart data={regionChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<HentChartTip />} />
                      <Bar dataKey="value" name="Ventures" radius={[4, 4, 0, 0]} maxBarSize={46}>
                        {regionChartData.map((d, i) => (
                          <Cell key={d.name} fill={GREEN_RAMP[i % GREEN_RAMP.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {/* Per-region detail breakdown */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    {regionChartData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: GREEN_RAMP[i % GREEN_RAMP.length] }} />
                          {d.name}
                        </span>
                        <span className="text-gray-500 tabular-nums">
                          <b className="text-gray-700">{d.value}</b> ventures · {d.countries} countries · {Math.round(d.femaleLed / d.value * 100) || 0}% female-led
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-gray-400 text-center py-6">No ventures match the selected filter.</p>
              )}
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 3: PROGRAMME PERFORMANCE â"€â"€â"€ */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SecHeader title="Programme Performance"
            sub="Are programmes delivering a high-quality experience? Satisfaction and completion compared across types" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Chart 1 — Satisfaction by dimension (~67%) */}
            <div className="lg:col-span-8">
              <PlainCard title="Satisfaction by dimension" sub="Average score per dimension (out of 5)">
                <SatisfactionBars dimensions={HEAT_COLS} series={radarSeries} target={4.5} height={360} />
              </PlainCard>
            </div>

            {/* Charts 2 & 3 stacked (~33%) */}
            <div className="lg:col-span-4 flex flex-col gap-4 h-full">
              <PlainCard title="Satisfaction by programme" sub="Score vs. target of 4.5">
                <BulletChart rows={satBulletRows} target={4.5} />
              </PlainCard>

              <div className="flex-1">
                <PlainCard title="Completion by programme" sub="Share completed · target 90%" fill>
                  <div className="grid grid-cols-3" style={{ gap: 8 }}>
                    {compRingRows.map(r => (
                      <ProgressRing key={r.name} value={r.value} color={r.color} label={r.name} target={90} />
                    ))}
                  </div>
                </PlainCard>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ChartCard title="Programme Comparison" sub="Reach, satisfaction and completion" accent={PRIMARY}>
              <CompareTable rows={PROG_COMPARE} />
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 4: INNOVATION PIPELINE â"€â"€â"€ */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SecHeader title="Innovation Pipeline"
            sub="How hackathons convert participants into projects, startups and portfolio ventures" />

          {/* Innovation Output — stat cards in a row after the section title */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <ExecCard label="Hackathon Participants" value={hackPart.toLocaleString()}               icon={Users} />
            <ExecCard label="Projects Developed"     value={String(hackProjects)}                    icon={Lightbulb} />
            <ExecCard label="Startups Created"        value={String(hackStart)}                       icon={Rocket} />
            <ExecCard label="Project → Startup"       value={`${Math.round(hackStart / hackProjects * 100)}%`} icon={TrendingUp} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Innovation Funnel" sub="Participants to ventures" accent={PRIMARY}>
              <Funnel steps={[
                { label: "Hackathon Participants", value: hackPart },
                { label: "Projects Developed",     value: hackProjects },
                { label: "Startups Created",        value: hackStart },
                { label: "Portfolio Ventures",      value: ALL_VENTURES.length },
              ]} />
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {["Hackathon Participants","Projects Developed","Startups Created","Portfolio Ventures"].map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: "#0E4633", opacity: 1 - i * 0.13 }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

            {/* New chart 1 — Projects & Startups per Year */}
            <ChartCard title="Projects & Startups per Year" sub="Hackathon output by year" accent={GREEN}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hackYearData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<HentChartTip hideLabel />} />
                  <Bar dataKey="Projects" fill={INNO_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={16} />
                  <Bar dataKey="Startups" fill={INNO_COLORS[1]} radius={[4, 4, 0, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {(["Projects","Startups"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: INNO_COLORS[i] }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

            {/* New chart 2 — Startup Conversion Rate per Year */}
            <ChartCard title="Startup Conversion Rate" sub="Projects that became startups (%)" accent={TEAL}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={hackYearData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<HentChartTip hideLabel unit="%" />} />
                  <Line type="monotone" dataKey="Rate" name="Conversion rate" stroke={TEAL} strokeWidth={2.5}
                    dot={{ r: 4, fill: TEAL, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                Overall {Math.round(hackStart / hackProjects * 100)}% of hackathon projects convert to startups
              </p>
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ SECTION 5: VENTURE ECOSYSTEM â"€â"€â"€ */}
        <section style={{ display: show(5) ? undefined : "none" }}>
          <SecHeader title="Venture Ecosystem &amp; Impact"
            sub="Portfolio summary and the jobs, funding and partnerships HENT ventures have generated" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ExecCard label="Jobs Created"       value={TOTAL_JOBS.toLocaleString()} icon={Zap}        tip="Total jobs created across all portfolio ventures." />
            <ExecCard label="Partnerships Built" value={TOTAL_PSHIP}                 icon={Handshake}  tip="Cross-sector partnership agreements formed." />
            <ExecCard label="Funding Deployed"   value={fmt$(TOTAL_FUNDING)}         icon={TrendingUp} tip={`Total funding deployed across ${ALL_VENTURES.length} ventures.`} />
            <ExecCard label="Graduate Fellows"   value={mfGrad}                      icon={Award}      tip="Fellows who completed the 1-year fellowship track." />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Venture Stage Pipeline"
              sub="Expose · Build · Scale"
              accent={PRIMARY}>
              <DonutRing
                data={stageData}
                colors={DISTINCT}
                total={ALL_VENTURES.length}
                totalLabel="Ventures"
                height={300}
                legendPercent
              />
            </ChartCard>

            <ChartCard title="Sector Distribution"
              sub="Ventures by sector"
              accent={GREEN}>
              <DonutRing
                data={sectorData}
                colors={DISTINCT}
                total={ALL_VENTURES.length}
                totalLabel="Ventures"
                height={300}
                legendPercent
              />
            </ChartCard>
          </div>
        </section>

        {/* â"€â"€ KEY INSIGHTS (closing executive summary) â"€â"€â"€ */}
        <div>
          <SecHeader title="Key Insights"
            sub="Executive highlights across delivery, participation, quality, innovation and impact" />
          <ChartCard title="Programme Highlights" sub="Auto-generated from the latest programme data" accent={PRIMARY}>
            <InsightList items={insights} />
          </ChartCard>
        </div>

        {/* â"€â"€ FOOTER STRIP â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        <PortalFooter portal="hent" source="HENT Programmes M&amp;E" synced="01 Jun 2026, EAT" />

      </div>
    </div>
  );
}
