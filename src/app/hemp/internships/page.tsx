"use client";
import HEMPNav from "@/components/HEMPNav";
import ExecFilterBar from "@/components/ExecFilterBar";
import StatsKpiCard from "@/app/impact/StatsKpiCard";
import { INTERNSHIP_SECTORS, internships, type InternshipCohort } from "@/data/hemp/internships";
import { Briefcase, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
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

// â”€â”€â”€ Palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY   = "#14306B";
const AMBER  = "#BA7517";
const VIOLET = "#534AB7";
const TEAL   = "#185FA5";
const GREEN  = "#1D9E75";
const SKY    = "#479BD6";
const ROSE   = "#7F77DD";
const INDIGO = "#0F6E56";
const ORANGE = "#D45F2C";
const PURPLE = "#85B7EB";

const SECTOR_COLOR: Record<string, string> = {
  Hospital:    TEAL,
  NGO:         VIOLET,
  Government:  SKY,
  MedTech:     ORANGE,
  Pharma:      GREEN,
  Research:    INDIGO,
};
const SECTOR_HEX_LIST = [TEAL, VIOLET, SKY, ORANGE, GREEN, INDIGO];
const COUNTRY_HEX = [AMBER, TEAL, VIOLET, ORANGE, SKY, GREEN, ROSE, INDIGO, PURPLE, "#2F5FD1"];

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// â”€â”€â”€ Aggregates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const total = {
  orgs:        internships.length,
  students:    internships.reduce((s, i) => s + i.students,              0),
  female:      internships.reduce((s, i) => s + i.femaleStudents,        0),
  conversions: internships.reduce((s, i) => s + i.employmentConversions, 0),
  mentored:    internships.filter(i => i.hasMentor).length,
};
const femalePct  = Math.round(total.female      / total.students    * 100);
const malePct    = 100 - femalePct;
const convRate   = Math.round(total.conversions  / total.students    * 100);
const mentorPct  = Math.round(total.mentored     / total.orgs        * 100);
const avgSat     = parseFloat(avg(internships.map(i => i.satisfactionScore)).toFixed(1));
const countries  = Array.from(new Set(internships.map(i => i.country)));

const YEARS = Array.from(new Set(internships.map(i => i.year))).sort();
const ALL_COUNTRIES = Array.from(new Set(internships.map(i => i.country))).sort();

// Derive every chart dataset from a (possibly filtered) set of internship rows.
function derive(rows: typeof internships) {
  const total = {
    orgs:        rows.length,
    students:    rows.reduce((s, i) => s + i.students,              0),
    female:      rows.reduce((s, i) => s + i.femaleStudents,        0),
    conversions: rows.reduce((s, i) => s + i.employmentConversions, 0),
    mentored:    rows.filter(i => i.hasMentor).length,
  };
  const femalePct = total.students ? Math.round(total.female      / total.students * 100) : 0;
  const malePct   = 100 - femalePct;
  const convRate  = total.students ? Math.round(total.conversions / total.students * 100) : 0;
  const mentorPct = total.orgs     ? Math.round(total.mentored    / total.orgs     * 100) : 0;
  const avgSat    = parseFloat(avg(rows.map(i => i.satisfactionScore)).toFixed(1));
  const countries = Array.from(new Set(rows.map(i => i.country)));

  const sectorStats = INTERNSHIP_SECTORS.map(sector => {
    const orgs = rows.filter(i => i.sector === sector);
    const stu  = orgs.reduce((s, i) => s + i.students, 0);
    const conv = orgs.reduce((s, i) => s + i.employmentConversions, 0);
    return {
      sector,
      count:    orgs.length,
      students: stu,
      convPct:  stu > 0 ? Math.round(conv / stu * 100) : 0,
      avgSat:   parseFloat(avg(orgs.map(i => i.satisfactionScore)).toFixed(1)),
    };
  }).sort((a, b) => b.students - a.students);

  const sectorData = INTERNSHIP_SECTORS.map(sector => ({
    name:  sector,
    value: rows.filter(i => i.sector === sector).reduce((s, i) => s + i.students, 0),
  })).sort((a, b) => b.value - a.value);

  const placementsPerYear = YEARS.map(yr => {
    const yrInts = rows.filter(i => i.year === yr);
    return {
      Year:        String(yr),
      Orgs:        yrInts.length,
      Students:    yrInts.reduce((s, i) => s + i.students,              0),
      Conversions: yrInts.reduce((s, i) => s + i.employmentConversions, 0),
    };
  });

  const genderTrend = YEARS.map(yr => {
    const yrInts = rows.filter(i => i.year === yr);
    const fem    = yrInts.reduce((s, i) => s + i.femaleStudents, 0);
    const tot    = yrInts.reduce((s, i) => s + i.students,       0);
    return { Year: String(yr), Female: fem, Male: tot - fem };
  });

  const satBySector  = sectorStats.map(s => ({ name: s.sector, value: s.avgSat  })).sort((a, b) => b.value - a.value);
  const convBySector = sectorStats.map(s => ({ name: s.sector, value: s.convPct })).sort((a, b) => b.value - a.value);

  const countryData = Object.entries(
    rows.reduce<Record<string, number>>((acc, i) => {
      acc[i.country] = (acc[i.country] || 0) + i.students;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return {
    total, femalePct, malePct, convRate, mentorPct, avgSat, countries,
    sectorStats, sectorData, placementsPerYear, genderTrend, satBySector, convBySector, countryData,
  };
}

// KPI tiles
const KPI_TILES = [
  { label: "Host Organisations", clr: "#BA7517" },
  { label: "Students Placed",    clr: "#14306B" },
  { label: "Employment Conv.",   clr: "#0F6E56" },
  { label: "Countries",          clr: "#185FA5" },
  { label: "Mentor-led Orgs",    clr: "#085041" },
  { label: "Avg Satisfaction",   clr: "#D45F2C" },
] as const;

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(20,48,107,0.6)" }}>
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-[11px] font-medium normal-case tracking-normal rounded-md px-2 py-1 outline-none cursor-pointer"
        style={{ color: "#0C447C", border: "1px solid rgba(20,48,107,0.2)", backgroundColor: "white" }}>
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

// Red → amber → green based on progress against benchmark
function benchColor(pct: number, bench: number): string {
  const r = bench > 0 ? pct / bench : 1;
  if (r >= 1)    return "#16A34A";
  if (r >= 0.95) return "#84CC16";
  if (r >= 0.8)  return "#BA7517";
  return "#DC2626";
}

function KpiTile({ label, num, displayFmt, sub, Icon }: {
  label: string; num: number; displayFmt: (n: number) => string; sub: string; clr?: string;
  pct?: number; bench?: number; Icon?: LucideIcon;
}) {
  return (
    <StatsKpiCard
      label={label}
      num={num}
      displayFmt={displayFmt}
      sub={sub}
      Icon={Icon ?? Briefcase}
      tooltip={label}
    />
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#185FA5" }} />
      <div>
        <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: "#185FA5", letterSpacing: "0.01em" }}>{title}</h2>
        {sub && <p className="mt-0.5" style={{ fontSize: 11, color: "#6B7280" }}>{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = AMBER, children }: {
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
  function handleContextMenu(e: React.MouseEvent) { e.preventDefault(); handleDownload(); }
  return (
    <div ref={cardRef} onContextMenu={handleContextMenu} title="Right-click to download this chart"
      className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#14306B", padding: "11px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

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

function CustomDonut({ data, colors, label, valueFormatter = (v: number) => `${v}`, className = "" }: {
  data: { name: string; value: number }[];
  colors: string[];
  label?: string;
  valueFormatter?: (v: number) => string;
  className?: string;
}) {
  const tot = data.reduce((s, d) => s + d.value, 0);
  if (!tot) return null;
  const CX = 80, CY = 80, OR = 70, IR = 43;
  let theta = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / tot) * 2 * Math.PI;
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
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">{label}</text>
        )}
      </svg>
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function InternshipsPage() {
  const [trendTab, setTrendTab] = useState<"students" | "conversions">("students");

  // ── Filters ──
  const [fYear, setFYear]       = useState("All Years");
  const [fCountry, setFCountry] = useState("All Countries");
  const [fSector, setFSector]   = useState("All Sectors");
  const filtered = useMemo(() => internships.filter(i =>
    (fYear === "All Years" || String(i.year) === fYear) &&
    (fCountry === "All Countries" || i.country === fCountry) &&
    (fSector === "All Sectors" || i.sector === fSector)
  ), [fYear, fCountry, fSector]);
  const {
    total, femalePct, malePct, convRate, mentorPct, avgSat, countries,
    sectorStats, sectorData, placementsPerYear, genderTrend, satBySector, convBySector, countryData,
  } = useMemo(() => derive(filtered), [filtered]);

  // ── SOP lifecycle metrics ──
  // Students placed with a host that provides a named supervisor/mentor.
  const mentorLedStudents = useMemo(
    () => filtered.filter(i => i.hasMentor).reduce((s, i) => s + i.students, 0),
    [filtered]
  );
  // Post-internship placements captured at close-out (the SOP's M&E step).
  const placementsAfter = useMemo(
    () => filtered.reduce((s, i) => s + i.placementsAfterInternship, 0),
    [filtered]
  );
  // "Completed & evaluated" — placements with a satisfaction score on record.
  const evaluated = useMemo(
    () => filtered.filter(i => i.satisfactionScore > 0).reduce((s, i) => s + i.students, 0),
    [filtered]
  );
  const supervisedPct = total.students ? Math.round(mentorLedStudents / total.students * 100) : 0;
  const placementPct  = total.students ? Math.round(placementsAfter / total.students * 100) : 0;

  const trendData  = trendTab === "students"
    ? genderTrend
    : placementsPerYear.map(d => ({ Year: d.Year, Conversions: d.Conversions, Students: d.Students }));
  const trendCats  = trendTab === "students"
    ? (["Female", "Male"] as const)
    : (["Students", "Conversions"] as const);
  const trendColors = trendTab === "students" ? [ROSE, SKY] : [VIOLET, GREEN];

  const kpiValues = [
    { sub: `${YEARS[0]} - ${YEARS[YEARS.length-1]}`, num: total.orgs,        fmt: (n: number) => String(Math.round(n)) },
    { sub: "Total placed",                           num: total.students,   fmt: (n: number) => String(Math.round(n)) },
    { sub: "Placement to hire",                      num: total.conversions,fmt: (n: number) => String(Math.round(n)) },
    { sub: "Unique countries",                        num: countries.length, fmt: (n: number) => String(Math.round(n)) },
    { sub: `${mentorPct}% of organisations`,          num: total.mentored,   fmt: (n: number) => String(Math.round(n)) },
    { sub: "Satisfaction (1 - 5)",                      num: avgSat,           fmt: (n: number) => `${n.toFixed(1)}/5`   },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <HEMPNav />

      {/* â”€â”€ HEADER + KPIs â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design2.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Internship</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              Workplace placements, host organisations and employment conversion
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Internships M&amp;E</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
              <span aria-hidden="true">·</span>
              <span>{total.orgs} organisations · {total.students} students placed</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ KPI STRIP â”€â”€â”€ */}
      <div className="max-w-[1400px] mx-auto px-6 pt-5">
          <div className="pb-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {KPI_TILES.map(({ label, clr }, i) => (
                <KpiTile key={label} label={label} num={kpiValues[i].num}
                  displayFmt={kpiValues[i].fmt} sub={kpiValues[i].sub} clr={clr} />
              ))}
            </div>
          </div>
      </div>

      {/* â”€â”€ BODY â”€â”€â”€ */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* â”€â”€ FILTER BAR â”€â”€â”€ */}
        <ExecFilterBar
          filters={[
            { label: "Year",    value: fYear,    onChange: setFYear,    options: ["All Years", ...YEARS.map(String)] },
            { label: "Country", value: fCountry, onChange: setFCountry, options: ["All Countries", ...ALL_COUNTRIES] },
            { label: "Sector",  value: fSector,  onChange: setFSector,  options: ["All Sectors", ...INTERNSHIP_SECTORS] },
          ]}
          dirty={fYear !== "All Years" || fCountry !== "All Countries" || fSector !== "All Sectors"}
          onReset={() => { setFYear("All Years"); setFCountry("All Countries"); setFSector("All Sectors"); }}
        />

        {/* â”€â”€ SECTION 1: SECTOR PROFILES â”€â”€â”€ */}
        <section>
          <SecHeader title="Sector Profiles"
            sub={`${total.students} students across ${total.orgs} organisations in ${countries.length} countries`} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Sector stat rows */}
            <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
              {sectorStats.map((s, i) => (
                <div key={s.sector} className={`px-4 py-3.5 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none"
                      style={{ color: SECTOR_COLOR[s.sector] + "AA" }}>{s.sector}</p>
                    <p className="text-lg font-black tabular-nums leading-none"
                      style={{ color: SECTOR_COLOR[s.sector] }}>{s.students}</p>
                  </div>
                  <div className="h-1.5 rounded-sm overflow-hidden" style={{ backgroundColor: SECTOR_COLOR[s.sector] + "20" }}>
                    <div className="h-full" style={{ width: `${(s.students / total.students) * 100}%`, backgroundColor: SECTOR_COLOR[s.sector] }} />
                  </div>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-gray-400 tabular-nums">
                    <span>{s.count} orgs  ·  sat {s.avgSat}/5</span>
                    <span className="ml-auto font-semibold" style={{ color: SECTOR_COLOR[s.sector] }}>{s.convPct}% conv.</span>
                  </div>
                </div>
              ))}
            </div>

            <ChartCard title="Students by Sector"
              sub="Distribution of placed students across health sectors"
              accent={VIOLET}>
              <CustomDonut
                data={sectorData}
                colors={SECTOR_HEX_LIST}
                className="h-44"
                label={String(total.students)}
                valueFormatter={(v: number) => `${v} students`}
              />
              <div className="mt-3 space-y-1">
                {sectorData.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SECTOR_HEX_LIST[i % SECTOR_HEX_LIST.length] }} />
                      {s.name}
                    </span>
                    <span className="font-bold text-gray-700 ml-2">
                      {s.value} ({Math.round(s.value / total.students * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Diversity &amp; Mentoring"
              sub="Gender breakdown and mentor-supported placements"
              accent={ROSE}>
              <div className="space-y-4">
                {([
                  { label: "Female Students",  value: total.female,              pct: femalePct, color: ROSE   },
                  { label: "Male Students",    value: total.students - total.female, pct: malePct, color: SKY    },
                  { label: "Mentor-led Orgs",  value: total.mentored,             pct: mentorPct, color: TEAL   },
                  { label: "Conversion Rate",  value: total.conversions,          pct: convRate,  color: GREEN  },
                ] as const).map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="font-black tabular-nums" style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: item.color + "1A" }}>
                      <div className="h-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1 tabular-nums">{item.value} / {item.label.includes("Rate") ? total.students : item.label.includes("Org") ? total.orgs : total.students}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* â”€â”€ SECTION 2: ANNUAL TRENDS â”€â”€â”€ */}
        <section>
          <SecHeader title="Annual Placement Trends"
            sub="Organisation and student placement volume year on year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">


            <ChartCard title="Organisations per Year"
              sub="Count of host organisations hosting interns each year"
              accent={AMBER}>
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={placementsPerYear} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v} org${v !== 1 ? "s" : ""}`, "Internships"]} />
                  <Bar dataKey="Orgs" fill={AMBER} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Students Placed per Year"
              sub="Total intern students placed year-on-year"
              accent={VIOLET}>
              <ResponsiveContainer width="100%" height={192}>
                <AreaChart data={placementsPerYear}>
                  <defs>
                    <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={VIOLET} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={VIOLET} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                    formatter={(v: number) => [`${v} students`, "Placed"]} />
                  <Area type="monotone" dataKey="Students" stroke={VIOLET} strokeWidth={2} fill="url(#intGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        </section>

        {/* â”€â”€ SECTION 3: TRENDS & ANALYSIS â”€â”€â”€ */}
        <section>
          <SecHeader title="Placement Outcomes"
            sub="Employment conversion and gender trend analysis" />

          <div className="flex gap-1 mb-4 bg-white rounded shadow-sm px-1 py-1 w-fit">
            {([["students", "Gender Breakdown"], ["conversions", "Students vs Conversions"]] as const).map(([tab, label]) => {
              const active = trendTab === tab;
              return (
                <button key={tab} onClick={() => setTrendTab(tab)}
                  className="text-xs px-4 py-1.5 rounded font-medium transition-colors"
                  style={active ? { backgroundColor: AMBER, color: "white" } : { color: "#6b7280" }}>
                  {label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard
              title={trendTab === "students" ? "Students by Gender per Year" : "Placements vs Employment Conversions"}
              sub={trendTab === "students" ? "Female vs male intern placements trend" : "Students placed vs employment conversion outcomes"}
              accent={trendTab === "students" ? ROSE : GREEN}>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 mb-3">
                {trendCats.map((cat, i) => (
                  <span key={cat} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: trendColors[i] }} />{cat}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={trendData} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                  {trendCats.map((cat, i) => (
                    <Bar key={cat} dataKey={cat} fill={trendColors[i]} radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <div className="space-y-4">
              <ChartCard title="Satisfaction by Sector"
                sub="Average satisfaction score per sector (1 - 5)"
                accent={TEAL}>
                <div className="space-y-3">
                  {satBySector.map((d, i) => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTOR_COLOR[d.name] }} />
                          {d.name}
                        </span>
                        <span className="font-bold tabular-nums" style={{ color: SECTOR_COLOR[d.name] }}>{d.value}/5</span>
                      </div>
                      <div className="h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: SECTOR_COLOR[d.name] + "18" }}>
                        <div className="h-full" style={{ width: `${(d.value / 5) * 100}%`, backgroundColor: d.value >= 4.5 ? GREEN : d.value >= 4.0 ? TEAL : AMBER }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Conversion Rate by Sector"
                sub="Employment conversion rate  -  placements resulting in a hire"
                accent={GREEN}>
                <div className="space-y-3">
                  {convBySector.map((d, i) => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTOR_COLOR[d.name] }} />
                          {d.name}
                        </span>
                        <span className="font-bold tabular-nums" style={{ color: SECTOR_COLOR[d.name] }}>{d.value}%</span>
                      </div>
                      <div className="h-2.5 rounded-sm overflow-hidden" style={{ backgroundColor: SECTOR_COLOR[d.name] + "18" }}>
                        <div className="h-full" style={{ width: `${d.value}%`, backgroundColor: d.value >= 50 ? GREEN : d.value >= 30 ? TEAL : AMBER }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

          </div>
        </section>

        {/* â”€â”€ SECTION 5: COHORT OUTCOMES (HEMP) â”€â”€â”€ */}
        <section>
          <SecHeader
            title="Cohort Outcomes (Internal  ·  SFH  ·  WAG  ·  KASHA)"
            sub="Internship participation + post-internship placement outcomes" />

          {(() => {
            const COHORTS: InternshipCohort[] = ["Internal", "SFH", "WAG", "KASHA"];
            const COHORT_COLORS: Record<InternshipCohort, string> = {
              Internal: "#BA7517", // amber
              SFH: "#534AB7", // violet
              WAG: "#185FA5", // teal
              KASHA: "#1D9E75", // green
            };

            const cohortTotals = COHORTS.map(c => {
              const row = filtered.filter(i => i.cohort === c);
              const interns = row.reduce((s, i) => s + i.students, 0);
              const placements = row.reduce((s, i) => s + i.placementsAfterInternship, 0);
              return {
                cohort: c,
                interns,
                placements,
                share: total.students ? Math.round((interns / total.students) * 100) : 0,
                placementRate: interns ? Math.round((placements / interns) * 100) : 0,
              };
            }).sort((a, b) => b.interns - a.interns);

            const totalPlacementsAfter = cohortTotals.reduce((s, r) => s + r.placements, 0);
            const internshipToPlacementRate = total.students ? Math.round((totalPlacementsAfter / total.students) * 100) : 0;

            const cohortBarData = COHORTS.map(c => {
              const row = cohortTotals.find(x => x.cohort === c)!;
              return { name: c, Interns: row.interns };
            });

            const cohortDonutData = cohortTotals.map(r => ({ name: r.cohort, value: r.interns }));
            const COHORT_COLOR_LIST = COHORTS.map(c => COHORT_COLORS[c]);

            const yearlyCohort = YEARS.map(yr => {
              const byCohort: Record<InternshipCohort, number> = {
                Internal: 0,
                SFH: 0,
                WAG: 0,
                KASHA: 0,
              };
              filtered
                .filter(i => i.year === Number(yr) && i.cohort)
                .forEach(i => {
                  byCohort[i.cohort] += i.students;
                });
              return {
                Year: String(yr),
                ...byCohort,
              };
            });

            const placedNotPlaced = cohortTotals.map(r => {
              const notPlaced = Math.max(r.interns - r.placements, 0);
              return { cohort: r.cohort, placed: r.placements, notPlaced };
            });

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <KpiTile
                    label="Total interns"
                    num={total.students}
                    displayFmt={(n) => String(Math.round(n))}
                    sub={`${YEARS[0]} - ${YEARS[YEARS.length - 1]}`}
                    clr="#185FA5"
                  />
                  {(["Internal", "SFH", "WAG", "KASHA"] as const).map((c) => {
                    const row = cohortTotals.find(x => x.cohort === c)!;
                    return (
                      <KpiTile
                        key={c}
                        label={`${c} interns`}
                        num={row.interns}
                        displayFmt={(n) => String(Math.round(n))}
                        sub={`${row.share}% share  ·  ${row.placementRate}% rate`}
                        clr={COHORT_COLORS[c]}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ChartCard
                    title="Interns by Cohort"
                    sub="Participation volume comparison"
                    accent="#534AB7"
                  >
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={cohortBarData} barCategoryGap="30%" barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={0} />
                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                        {COHORTS.map((c) => (
                          <Bar
                            key={c}
                            dataKey="Interns"
                            fill={COHORT_COLORS[c]}
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={false}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2 text-[11px] text-gray-600">
                      {cohortTotals.map((r) => (
                        <div key={r.cohort} className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COHORT_COLORS[r.cohort] }} />
                            {r.cohort}
                          </span>
                          <span className="font-bold text-gray-700 tabular-nums">
                            {r.interns} ({r.share}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </ChartCard>

                  <ChartCard
                    title="Cohort Distribution"
                    sub="Share of total interns across cohorts"
                    accent="#BA7517"
                  >
                    <CustomDonut
                      data={cohortDonutData}
                      colors={COHORT_COLOR_LIST}
                      className="h-44"
                      label={`${total.students}`}
                      valueFormatter={(v: number) => `${v} interns`}
                    />
                    <div className="mt-3 space-y-1">
                      {cohortTotals.map((r, i) => (
                        <div key={r.cohort} className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COHORT_COLOR_LIST[i] }} />
                            {r.cohort}
                          </span>
                          <span className="font-bold text-gray-700 ml-2">
                            {r.interns} ({r.share}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ChartCard
                    title="Yearly Cohort Growth"
                    sub="Intern participation by cohort per year"
                    accent="#479BD6"
                  >
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={yearlyCohort} barGap={1}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                        {COHORTS.map((c) => (
                          <Bar
                            key={c}
                            dataKey={c}
                            fill={COHORT_COLORS[c]}
                            radius={[0, 0, 0, 0]}
                            stackId="coh"
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-4 mt-4 text-[11px] text-gray-600">
                      {COHORTS.map((c) => (
                        <span key={c} className="flex items-center gap-1.5">
                          <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: COHORT_COLORS[c] }} />{c}
                        </span>
                      ))}
                    </div>
                  </ChartCard>

                  <ChartCard
                    title="Placement Conversion"
                    sub={`Placement share across cohorts  ·  Internship-to-placement rate: ${internshipToPlacementRate}%`}
                    accent="#0F6E56"
                  >
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={placedNotPlaced} barCategoryGap="30%" barGap={0}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="cohort" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                        {COHORTS.map((c) => (
                          <Bar
                            key={c + "-placed"}
                            dataKey="placed"
                            fill={COHORT_COLORS[c]}
                            stackId="place"
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                        <Bar dataKey="notPlaced" fill="#E5E7EB" stackId="place" radius={[0, 0, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#1D9E75" }} />
                        <span>Placed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-200" />
                        <span>Not placed</span>
                      </div>
                      <div className="font-bold text-gray-800 tabular-nums">
                        Total placements: {totalPlacementsAfter}
                      </div>
                    </div>
                  </ChartCard>
                </div>

              </div>
            );
          })()}
        </section>

        {/* â”€â”€ SECTION: PROGRAMME LIFECYCLE (SOP) â”€â”€â”€ */}
        <section>
          <SecHeader title="Internship Programme Lifecycle"
            sub="The full SOP pipeline — partnership engagement, recruitment and eligibility screening, matching, pre-internship training, onboarding, supervision, M&amp;E and close-out" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Placement Lifecycle Funnel"
              sub="From host partnerships engaged through to employment conversion">
              {(() => {
                const steps = [
                  { label: "Host partnerships engaged",  value: total.orgs },
                  { label: "Students placed",            value: total.students },
                  { label: "Supervised (mentor-led org)", value: mentorLedStudents },
                  { label: "Completed & evaluated",      value: evaluated },
                  { label: "Employment conversions",     value: total.conversions },
                ];
                const max = steps[0].value || 1;
                // Orgs and students live on very different scales, so scale each bar
                // against the largest value in the funnel for a readable shape.
                const barMax = Math.max(...steps.map(s => s.value)) || 1;
                return (
                  <div className="space-y-2.5">
                    {steps.map((s, i) => {
                      const pct = Math.max(6, Math.round((s.value / barMax) * 100));
                      const conv = i > 1 && steps[i - 1].value > 0
                        ? Math.round((s.value / steps[i - 1].value) * 100) : null;
                      return (
                        <div key={s.label}>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-gray-700">{s.label}</span>
                            <span className="font-bold tabular-nums" style={{ color: "#0C447C" }}>
                              {s.value.toLocaleString()}
                              {conv !== null && <span className="text-gray-400 font-medium"> · {conv}%</span>}
                            </span>
                          </div>
                          <div className="h-6 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(20,48,107,0.08)" }}>
                            <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: "#14306B", opacity: 1 - i * 0.13 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {total.students ? Math.round(total.conversions / total.students * 100) : 0}% of placements convert into employment
              </p>
            </ChartCard>

            <ChartCard title="Institutional Capacity — Supervision Coverage"
              sub="Share of host organisations providing a named supervisor / mentor, the SOP's core quality control">
              <div className="space-y-4">
                {([
                  { label: "Mentor-led organisations",  value: total.mentored,                    pct: mentorPct,   color: "#185FA5", denom: total.orgs },
                  { label: "Unsupervised placements",   value: total.orgs - total.mentored,       pct: 100 - mentorPct, color: "#BA7517", denom: total.orgs },
                  { label: "Students under supervision",value: mentorLedStudents,                 pct: supervisedPct, color: "#0F6E56", denom: total.students },
                  { label: "Post-internship placements",value: placementsAfter,                   pct: placementPct, color: "#534AB7", denom: total.students },
                ] as const).map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="font-black tabular-nums" style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: item.color + "1A" }}>
                      <div className="h-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1 tabular-nums">{item.value} / {item.denom}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                Supervision is the SOP&apos;s main lever on quality — unsupervised placements carry the highest drop-off risk.
              </p>
            </ChartCard>
          </div>
        </section>

        {/* â”€â”€ SECTION 4: GEOGRAPHIC COVERAGE â”€â”€â”€ */}
        <section>


          <SecHeader title="Geographic Coverage"
            sub={`Internship placements across ${countries.length} countries`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Students Placed by Country"
              sub="Total intern students placed in each host country"
              accent={ORANGE}>
              <ColorBarList data={countryData} colors={COUNTRY_HEX} />
            </ChartCard>

            <ChartCard title="Country Placement Distribution"
              sub="Donut view of intern student distribution by country"
              accent={INDIGO}>
              <CustomDonut
                data={countryData.slice(0, 8)}
                colors={COUNTRY_HEX}
                className="h-52"
                valueFormatter={(v: number) => `${v} students`}
              />
              <div className="mt-3 space-y-1">
                {countryData.slice(0, 5).map((c, i) => (
                  <div key={c.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COUNTRY_HEX[i % COUNTRY_HEX.length] }} />
                      {c.name}
                    </span>
                    <span className="font-bold text-gray-700 ml-2">
                      {c.value} ({Math.round(c.value / total.students * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>



        {/* â”€â”€ FOOTER STRIP â”€â”€â”€ */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#102C5E", minHeight: 116, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design2.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>Africa&apos;s Oasis for Health &amp; Education Transformation</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.85)" }}><span style={{ color: "#85B7EB", fontWeight: 600 }}>Data Last Synced:</span> 04 Jun 2026, EAT</span>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.85)" }}><span style={{ color: "#85B7EB", fontWeight: 600 }}>Source:</span> HEMP Internships M&amp;E</span>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(181,212,244,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>Contact Analyst</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
