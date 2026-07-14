"use client";
// The Introduction to Global Health course, as a section of Mission Students.
//
// It used to be its own route (/hemp/global-health). It is the foundational
// course mission students take, so it belongs alongside them rather than as a
// sibling programme — the old URL now redirects here.
//
// Takes the host page's year filter so the section moves with the rest of the
// page rather than carrying a second, conflicting filter.

import { ChartCard, SectionHeader, Funnel, ChartTip, ChartLegend } from "@/components/ui";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import { CHART } from "@/theme/tokens";
import { DonutRing } from "@/components/charts/donut-chart";
import { ghCohorts, GH_MODULES, GH_PROGRAMMES } from "@/data/hemp/global-health";
import { Award, BookOpen, CheckCircle2, GraduationCap, Star, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const PATH_HEX = { Internship: "#14306B", Venture: "#0F6E56", Research: "#534AB7" } as const;
const RAMP = ["#14306B", "#185FA5", "#479BD6", "#0F6E56", "#534AB7"];

function s(a: number[]) { return a.reduce((x, y) => x + y, 0); }
function avg(a: number[]) { return a.length ? s(a) / a.length : 0; }

export const GH_YEARS = ghCohorts.map(c => c.cohortYear);

function derive(rows: typeof ghCohorts) {
  const enrolled     = s(rows.map(c => c.enrolled));
  const female       = s(rows.map(c => c.female));
  const completed    = s(rows.map(c => c.completed));
  const certified    = s(rows.map(c => c.certified));
  const toVenture    = s(rows.map(c => c.progressedToVenture));
  const toResearch   = s(rows.map(c => c.progressedToResearch));
  const toInternship = s(rows.map(c => c.progressedToInternship));
  const progressed   = toVenture + toResearch + toInternship;

  return {
    enrolled, completed, certified, progressed,
    femalePct:     enrolled ? Math.round(female / enrolled * 100) : 0,
    completionPct: enrolled ? Math.round(completed / enrolled * 100) : 0,
    certifiedPct:  enrolled ? Math.round(certified / enrolled * 100) : 0,
    avgScore:      Math.round(avg(rows.map(c => c.avgScore))),
    satisfaction:  parseFloat(avg(rows.map(c => c.satisfaction)).toFixed(1)),

    funnel: [
      { label: "Enrolled",              value: enrolled },
      { label: "Completed all modules", value: completed },
      { label: "Certified (passed)",    value: certified },
      { label: "Progressed onward",     value: progressed },
    ],

    byModule: GH_MODULES.map(m => ({
      name: m,
      value: Math.round(avg(rows.map(c => c.moduleCompletion[m]))),
    })),

    byProgramme: GH_PROGRAMMES
      .map(p => ({ name: p, value: s(rows.map(c => c.byProgramme[p])) }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value),

    byYear: rows.map(c => ({
      Year: String(c.cohortYear),
      Internship: c.progressedToInternship,
      Venture: c.progressedToVenture,
      Research: c.progressedToResearch,
    })),

    byPath: [
      { name: "Internship", value: toInternship },
      { name: "Venture",    value: toVenture },
      { name: "Research",   value: toResearch },
    ],

    trend: rows.map(c => ({
      Year: String(c.cohortYear),
      "Avg Score": c.avgScore,
      Enrolled: c.enrolled,
    })),
  };
}

export default function GlobalHealthSection({ year = "All Years" }: { year?: string }) {
  const rows = useMemo(
    () => ghCohorts.filter(c => year === "All Years" || String(c.cohortYear) === year),
    [year],
  );
  const D = useMemo(() => derive(rows), [rows]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Introduction to Global Health"
        sub="The foundational course mission students take — and the doors it opens into ventures, research and internships"
      />

      {/* Course KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsKpiCard label="Enrolled"      num={D.enrolled}     sub={`${D.femalePct}% female`}         Icon={BookOpen}      tooltip="Mission students enrolled on the Introduction to Global Health course." />
        <StatsKpiCard label="Completed"     num={D.completed}    sub={`${D.completionPct}% completion`} Icon={CheckCircle2}  tooltip="Students who finished all five modules." />
        <StatsKpiCard label="Certified"     num={D.certified}    sub="Completed &amp; passed"           Icon={GraduationCap} tooltip="Students who completed the course and passed the final assessment." />
        <StatsKpiCard label="Avg Score"     num={D.avgScore}     displayFmt={n => `${Math.round(n)}%`}  sub="Assessment mean" Icon={Award} tooltip="Mean assessment score across certified students." />
        <StatsKpiCard label="Progressed On" num={D.progressed}   sub="Venture · research · internship"  Icon={TrendingUp}    tooltip="Students who moved on to a venture, research project or internship — the point of the course is to open these doors." />
        <StatsKpiCard label="Satisfaction"  num={D.satisfaction} displayFmt={n => `${n.toFixed(1)}/5`}  sub="Student-rated"   Icon={Star} tooltip="How students rate the course, out of 5." />
      </div>

      {/* Enrolment → certification */}
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
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={CHART.axisTick} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: "#6B7280" }} axisLine={false} tickLine={false} width={140} interval={0} />
              <Tooltip cursor={CHART.tipCursor} content={<ChartTip unit="%" />} />
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

      {/* Where the course leads */}
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
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} vertical={false} />
              <XAxis dataKey="Year" tick={CHART.axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={CHART.axisTick} axisLine={false} tickLine={false} width={26} allowDecimals={false} />
              <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
              <Bar dataKey="Internship" fill={PATH_HEX.Internship} radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar dataKey="Venture"    fill={PATH_HEX.Venture}    radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar dataKey="Research"   fill={PATH_HEX.Research}   radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
          <ChartLegend items={[["Internship", PATH_HEX.Internship], ["Venture", PATH_HEX.Venture], ["Research", PATH_HEX.Research]]} />
        </ChartCard>
      </div>

      {/* Intake & performance */}
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

        <ChartCard title="Enrolment &amp; Assessment Score by Cohort" sub="Cohort size against mean assessment score"
          info="Watch for score falling as enrolment grows — that would suggest the course is scaling faster than its teaching support.">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={D.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} vertical={false} />
              <XAxis dataKey="Year" tick={CHART.axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={CHART.axisTick} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="Enrolled"  stroke="#14306B" strokeWidth={2.5} dot={{ r: 4, fill: "#14306B", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Avg Score" stroke="#0F6E56" strokeWidth={2.5} dot={{ r: 4, fill: "#0F6E56", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <ChartLegend items={[["Enrolled", "#14306B"], ["Avg Score (%)", "#0F6E56"]]} />
        </ChartCard>
      </div>
    </div>
  );
}
