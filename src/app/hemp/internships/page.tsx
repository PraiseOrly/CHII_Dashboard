"use client";
import HEMPNav from "@/components/HEMPNav";
import { INTERNSHIP_SECTORS, internships, type InternshipCohort } from "@/data/hemp/internships";
import { Briefcase, Download, FileText } from "lucide-react";
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

// â”€â”€â”€ Palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAVY   = "#002147";
const AMBER  = "#F59E0B";
const VIOLET = "#7C3AED";
const TEAL   = "#0D9488";
const GREEN  = "#10B981";
const SKY    = "#0EA5E9";
const ROSE   = "#F43F5E";
const INDIGO = "#4338CA";
const ORANGE = "#EA580C";
const PURPLE = "#A855F7";

const SECTOR_COLOR: Record<string, string> = {
  Hospital:    TEAL,
  NGO:         VIOLET,
  Government:  SKY,
  MedTech:     ORANGE,
  Pharma:      GREEN,
  Research:    INDIGO,
};
const SECTOR_HEX_LIST = [TEAL, VIOLET, SKY, ORANGE, GREEN, INDIGO];
const COUNTRY_HEX = [AMBER, TEAL, VIOLET, ORANGE, SKY, GREEN, ROSE, INDIGO, PURPLE, "#EC4899"];

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

// Per-sector stats
const sectorStats = INTERNSHIP_SECTORS.map(sector => {
  const orgs = internships.filter(i => i.sector === sector);
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

// Sector donut
const sectorData = INTERNSHIP_SECTORS.map(sector => ({
  name:  sector,
  value: internships.filter(i => i.sector === sector).reduce((s, i) => s + i.students, 0),
})).sort((a, b) => b.value - a.value);

// Annual trends
const placementsPerYear = YEARS.map(yr => {
  const yrInts = internships.filter(i => i.year === yr);
  return {
    Year:        String(yr),
    Orgs:        yrInts.length,
    Students:    yrInts.reduce((s, i) => s + i.students,              0),
    Conversions: yrInts.reduce((s, i) => s + i.employmentConversions, 0),
  };
});

// Gender trend
const genderTrend = YEARS.map(yr => {
  const yrInts = internships.filter(i => i.year === yr);
  const fem    = yrInts.reduce((s, i) => s + i.femaleStudents, 0);
  const tot    = yrInts.reduce((s, i) => s + i.students,       0);
  return { Year: String(yr), Female: fem, Male: tot - fem };
});

// Satisfaction by sector
const satBySector = sectorStats.map(s => ({ name: s.sector, value: s.avgSat })).sort((a, b) => b.value - a.value);

// Conversion rate by sector
const convBySector = sectorStats.map(s => ({ name: s.sector, value: s.convPct })).sort((a, b) => b.value - a.value);

// Country distribution
const countryData = Object.entries(
  internships.reduce<Record<string, number>>((acc, i) => {
    acc[i.country] = (acc[i.country] || 0) + i.students;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

// KPI tiles
const KPI_TILES = [
  { label: "Host Organisations", clr: "#B45309" },
  { label: "Students Placed",    clr: "#4C1D95" },
  { label: "Employment Conv.",   clr: "#065F46" },
  { label: "Countries",          clr: "#1E3A8A" },
  { label: "Mentor-led Orgs",    clr: "#0F766E" },
  { label: "Avg Satisfaction",   clr: "#9D174D" },
] as const;

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string; sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded border px-2 py-2.5 text-center" style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.1em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-lg font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.62)" }}>{sub}</p>
    </div>
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: AMBER }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: AMBER }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
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
  return (
    <div ref={cardRef} className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5"
        style={{ backgroundColor: accent, borderBottomColor: accent }}>
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
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HEMPNav />

      {/* â”€â”€ HEADER + KPIs â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design1.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Internships</h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Briefcase size={11} style={{ color: "#F59E0B" }} />
                <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#F59E0B" }}>HEMP</span>
              </span>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              Workplace placements  ·  {YEARS[0]} - {YEARS[YEARS.length - 1]}  ·  {total.orgs} organisations  ·  {total.students} students placed
            </p>
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
              Internal: "#F59E0B", // amber
              SFH: "#7C3AED", // violet
              WAG: "#0D9488", // teal
              KASHA: "#10B981", // green
            };

            const cohortTotals = COHORTS.map(c => {
              const row = internships.filter(i => i.cohort === c);
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
              internships
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
                    clr="#1E3A8A"
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
                    accent="#7C3AED"
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
                    accent="#F59E0B"
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
                    accent="#0EA5E9"
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
                    accent="#065F46"
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
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#10B981" }} />
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
        <div className="rounded overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(total.students),    label: "Students Placed",         clr: "#4C1D95" },
              { value: `${femalePct}%`,           label: "Female Students",         clr: "#9D174D" },
              { value: String(total.conversions), label: "Employment Conversions",  clr: "#065F46" },
              { value: `${avgSat}/5`,             label: "Avg Satisfaction",        clr: "#B45309" },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-6 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}` }}>
                <p className="text-2xl font-black tabular-nums text-white">{tile.value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              HEMP  ·  Internships  ·  {YEARS[0]} - {YEARS[YEARS.length - 1]}
            </p>
            <p className="text-[10px] text-gray-400">Last updated: 04 Jun 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
