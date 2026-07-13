"use client";
import HEMPNav from "@/components/HEMPNav";
import HempFooter from "@/components/HempFooter";
import StatsKpiCard from "@/app/impact/StatsKpiCard";
import SectionPills from "@/components/SectionPills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/OutreachFilters";
import { ChartTip, ChartLegend, GRID_STROKE, AXIS_TICK, TIP_CURSOR } from "@/components/HempChart";
import { DonutRing } from "@/components/DonutChart";
import { ghCohorts, GH_MODULES, GH_PROGRAMMES } from "@/data/hemp/globalHealth";
import {
  Award, BookOpen, CheckCircle2, GraduationCap, Star, TrendingUp,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Theme (executive navy) ──────────────────────────────────────────────────
const HERO     = "#102C5E";
const BRAND    = "#14306B";
const SECTION  = "#185FA5";
const BRAND_DK = "#0C447C";

const PATH_HEX = { Internship: "#14306B", Venture: "#0F6E56", Research: "#534AB7" } as const;
const RAMP = ["#14306B", "#185FA5", "#479BD6", "#0F6E56", "#534AB7"];

function s(a: number[]) { return a.reduce((x, y) => x + y, 0); }
function avg(a: number[]) { return a.length ? s(a) / a.length : 0; }

const YEARS = ghCohorts.map(c => c.cohortYear);

// ─── Derivations (filter-aware) ──────────────────────────────────────────────
function derive(rows: typeof ghCohorts) {
  const enrolled   = s(rows.map(c => c.enrolled));
  const female     = s(rows.map(c => c.female));
  const completed  = s(rows.map(c => c.completed));
  const certified  = s(rows.map(c => c.certified));
  const toVenture    = s(rows.map(c => c.progressedToVenture));
  const toResearch   = s(rows.map(c => c.progressedToResearch));
  const toInternship = s(rows.map(c => c.progressedToInternship));
  const progressed = toVenture + toResearch + toInternship;

  return {
    enrolled, completed, certified, progressed,
    femalePct:     enrolled ? Math.round(female / enrolled * 100) : 0,
    completionPct: enrolled ? Math.round(completed / enrolled * 100) : 0,
    certifiedPct:  enrolled ? Math.round(certified / enrolled * 100) : 0,
    avgScore:      Math.round(avg(rows.map(c => c.avgScore))),
    satisfaction:  parseFloat(avg(rows.map(c => c.satisfaction)).toFixed(1)),

    // Enrol → complete → certify → progress on
    funnel: [
      { label: "Enrolled",            value: enrolled },
      { label: "Completed all modules", value: completed },
      { label: "Certified (passed)",  value: certified },
      { label: "Progressed onward",   value: progressed },
    ],

    // Average completion per module — where learners drop off
    byModule: GH_MODULES.map(m => ({
      name: m,
      value: Math.round(avg(rows.map(c => c.moduleCompletion[m]))),
    })),

    // Cross-disciplinary intake
    byProgramme: GH_PROGRAMMES
      .map(p => ({ name: p, value: s(rows.map(c => c.byProgramme[p])) }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value),

    // Where the course led, per cohort
    byYear: rows.map(c => ({
      Year: String(c.cohortYear),
      Internship: c.progressedToInternship,
      Venture: c.progressedToVenture,
      Research: c.progressedToResearch,
    })),

    // Onward destinations overall
    byPath: [
      { name: "Internship", value: toInternship },
      { name: "Venture",    value: toVenture },
      { name: "Research",   value: toResearch },
    ],

    // Score + satisfaction trend
    trend: rows.map(c => ({
      Year: String(c.cohortYear),
      "Avg Score": c.avgScore,
      Enrolled: c.enrolled,
    })),
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function InfoDot({ tip, color = BRAND }: { tip: string; color?: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: `${color}22`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color, lineHeight: 1, userSelect: "none" }}>i</span>
      {show && (
        <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", color: "#111827", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 200, boxShadow: "0 6px 20px rgba(0,0,0,0.22)", zIndex: 100, textAlign: "left", pointerEvents: "none", fontWeight: 400 }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: SECTION }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: SECTION }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, info, filters, children }: {
  title: string; sub?: string; info?: string; filters?: React.ReactNode; children: React.ReactNode;
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
    <div ref={cardRef} onContextMenu={(e) => { e.preventDefault(); handleDownload(); }}
      title="Right-click to download this chart"
      className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: BRAND, padding: "12px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
            {(info || sub) && <InfoDot tip={(info || sub)!} color="#FFFFFF" />}
          </div>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5">
        {filters && <div className="flex items-center justify-end mb-3">{filters}</div>}
        {children}
      </div>
    </div>
  );
}

function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = steps[0]?.value || 1;
  return (
    <div className="space-y-2.5">
      {steps.map((step, i) => {
        const pct = Math.max(8, Math.round((step.value / max) * 100));
        const conv = i > 0 && steps[i - 1].value > 0 ? Math.round((step.value / steps[i - 1].value) * 100) : null;
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-gray-700">{step.label}</span>
              <span className="font-bold tabular-nums" style={{ color: BRAND_DK }}>
                {step.value.toLocaleString()}{conv !== null && <span className="text-gray-400 font-medium"> · {conv}%</span>}
              </span>
            </div>
            <div className="h-6 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(20,48,107,0.08)" }}>
              <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: BRAND_DK, opacity: 1 - i * 0.15 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function GlobalHealthPage() {
  const [fYear, setFYear] = useState("All Years");

  const rows = useMemo(
    () => ghCohorts.filter(c => fYear === "All Years" || String(c.cohortYear) === fYear),
    [fYear]
  );
  const D = useMemo(() => derive(rows), [rows]);
  const dirty = fYear !== "All Years";

  const activeCount = fYear !== "All Years" ? 1 : 0;
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  const filterControls = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
      <SectionPills
        accent={BRAND}
        value={activeSection === "all" ? "all" : String(activeSection)}
        onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
        options={[
          { label: "All Sections", value: "all" },
          { label: "Enrolment to Certification", value: "1" },
          { label: "Where It Leads", value: "2" },
          { label: "Intake & Performance", value: "3" },
        ]}
      />
      <OutreachFilters
        accent={BRAND}
        activeCount={activeCount}
        onReset={() => setFYear("All Years")}
      >
        <OFilterSelect label="Year" value={fYear} onChange={setFYear} accent={BRAND}
          options={["All Years", ...YEARS.map(String)].map(o => ({ value: o, label: o }))} />
      </OutreachFilters>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <HEMPNav />

      {/* ── HEADER ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design2.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Introduction to Global Health Course</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
                The foundational health course linking mission students into ventures, research and internships
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Global Health Course M&amp;E</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{D.enrolled} enrolled · {D.certifiedPct}% certified</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatsKpiCard label="Enrolled"      num={D.enrolled}     sub={`${D.femalePct}% female`}         Icon={BookOpen}      tooltip="Mission students enrolled on the Introduction to Global Health course." />
          <StatsKpiCard label="Completed"     num={D.completed}    sub={`${D.completionPct}% completion`} Icon={CheckCircle2}  tooltip="Students who finished all five modules." />
          <StatsKpiCard label="Certified"     num={D.certified}    sub="Completed & passed"               Icon={GraduationCap} tooltip="Students who completed the course and passed the final assessment." />
          <StatsKpiCard label="Avg Score"     num={D.avgScore}     displayFmt={n => `${Math.round(n)}%`} sub="Assessment mean" Icon={Award} tooltip="Mean assessment score across certified students." />
          <StatsKpiCard label="Progressed On"  num={D.progressed}  sub="Venture · research · internship"  Icon={TrendingUp}    tooltip="Students who moved on to a venture, research project or internship — the point of the course is to open these doors." />
          <StatsKpiCard label="Satisfaction"  num={D.satisfaction} displayFmt={n => `${n.toFixed(1)}/5`} sub="Student-rated"   Icon={Star} tooltip="How students rate the course, out of 5." />
        </div>

        {filterControls}

        {/* ── SECTION 1: Completion ─── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SecHeader title="Enrolment to Certification"
            sub="How many students make it from enrolment through to a certificate — and which module is the hardest gate" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Course Funnel" sub="Enrolled → completed → certified → progressed onward"
              info="The drop between 'completed' and 'certified' is the assessment gate; the drop to 'progressed onward' shows how well the course actually converts into opportunity.">
              <Funnel steps={D.funnel} />
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {D.enrolled ? Math.round(D.certified / D.enrolled * 100) : 0}% of enrolled students earn a certificate
              </p>
            </ChartCard>

            <ChartCard title="Module Completion — Where Learners Drop Off" sub="Average completion rate per module"
              info="Epidemiology Basics is consistently the hardest gate. A low completion rate on a single module points at content or support, not at the students.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byModule} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="26%">
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: "#6B7280" }} axisLine={false} tickLine={false} width={140} interval={0} />
                  <Tooltip cursor={TIP_CURSOR} content={<ChartTip unit="%" />} />
                  <Bar dataKey="value" name="Completion" radius={[0, 4, 4, 0]} maxBarSize={22}>
                    {D.byModule.map(d => (
                      <Cell key={d.name} fill={d.value >= 90 ? "#0F6E56" : d.value >= 80 ? "#185FA5" : "#BA7517"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["≥90%", "#0F6E56"], ["80–89%", "#185FA5"], ["<80%", "#BA7517"]]} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: Where it leads ─── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SecHeader title="Where the Course Leads"
            sub="The course exists to link students into the health sector — these are the doors it opens" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Onward Destinations" sub="Internship, venture and research pathways taken after the course"
              info="Overall split of what students did next. Internships dominate — the course is most effective as a route into placement.">
              <DonutRing data={D.byPath} colors={[PATH_HEX.Internship, PATH_HEX.Venture, PATH_HEX.Research]}
                total={D.progressed} totalLabel="Progressed" height={300} legendPercent />
            </ChartCard>

            <ChartCard title="Progression per Cohort" sub="Students moving into internships, ventures and research each year"
              info="Progression growing faster than enrolment would mean the course is getting better at converting learners into participants.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="Year" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={26} allowDecimals={false} />
                  <Tooltip cursor={TIP_CURSOR} content={<ChartTip />} />
                  <Bar dataKey="Internship" fill={PATH_HEX.Internship} radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="Venture"    fill={PATH_HEX.Venture}    radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="Research"   fill={PATH_HEX.Research}   radius={[4, 4, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Internship", PATH_HEX.Internship], ["Venture", PATH_HEX.Venture], ["Research", PATH_HEX.Research]]} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: Intake & performance ─── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SecHeader title="Intake & Performance"
            sub="Mission students come from different academic programmes — this is the mix, and how the cohort performs" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Cross-Disciplinary Intake" sub="Enrolment by the student's home academic programme"
              info="Mission students are drawn from business, computing, engineering and the social sciences. A broad spread is the design intent — the course is not for clinicians.">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {D.byProgramme.map((row, i) => {
                  const col = RAMP[i % RAMP.length];
                  const max = D.byProgramme[0]?.value || 1;
                  return (
                    <div key={row.name} className="flex items-center gap-2.5">
                      <div className="w-[168px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                      <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
                        <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
                      </div>
                      <div className="text-[11px] font-bold w-8 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
                    </div>
                  );
                })}
                {!D.byProgramme.length && <p className="text-[11px] text-gray-400 text-center py-6">No cohorts match the selected filter.</p>}
              </div>
              <ChartLegend items={D.byProgramme.map((p, i) => [p.name, RAMP[i % RAMP.length]] as const)} />
            </ChartCard>

            <ChartCard title="Enrolment & Assessment Score by Cohort" sub="Cohort size against mean assessment score"
              info="Watch for score falling as enrolment grows — that would suggest the course is scaling faster than its teaching support.">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={D.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="Year" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="Enrolled"  stroke="#14306B" strokeWidth={2.5} dot={{ r: 4, fill: "#14306B", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Avg Score" stroke="#0F6E56" strokeWidth={2.5} dot={{ r: 4, fill: "#0F6E56", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Enrolled", "#14306B"], ["Avg Score (%)", "#0F6E56"]]} />
            </ChartCard>
          </div>
        </section>

        <HempFooter source="HEMP Global Health Course M&amp;E" />
      </div>
    </div>
  );
}
