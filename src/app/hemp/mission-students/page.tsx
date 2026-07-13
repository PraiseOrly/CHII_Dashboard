"use client";
import HEMPNav from "@/components/HEMPNav";
import ExecFilterBar from "@/components/ExecFilterBar";
import StatsKpiCard from "@/app/impact/StatsKpiCard";
import { missionStudents } from "@/data/hemp/missionStudents";
import { ghCohorts, GH_MODULES, GH_PROGRAMMES } from "@/data/hemp/globalHealth";

// ── Introduction to Global Health course derivations ──
const GH = (() => {
  const s = (a: number[]) => a.reduce((x, y) => x + y, 0);
  const enrolled   = s(ghCohorts.map(c => c.enrolled));
  const female     = s(ghCohorts.map(c => c.female));
  const completed  = s(ghCohorts.map(c => c.completed));
  const certified  = s(ghCohorts.map(c => c.certified));
  const progressed = s(ghCohorts.map(c => c.progressedToVenture + c.progressedToResearch + c.progressedToInternship));

  return {
    enrolled, completed, certified, progressed,
    femalePct:     enrolled ? Math.round(female / enrolled * 100) : 0,
    completionPct: enrolled ? Math.round(completed / enrolled * 100) : 0,
    certifiedPct:  enrolled ? Math.round(certified / enrolled * 100) : 0,
    avgScore:      Math.round(s(ghCohorts.map(c => c.avgScore)) / (ghCohorts.length || 1)),
    satisfaction:  parseFloat((s(ghCohorts.map(c => c.satisfaction)) / (ghCohorts.length || 1)).toFixed(1)),

    // Average completion per module — reveals the hardest gate
    byModule: GH_MODULES.map(m => ({
      name: m,
      value: Math.round(s(ghCohorts.map(c => c.moduleCompletion[m])) / (ghCohorts.length || 1)),
    })),

    // Cross-disciplinary intake
    byProgramme: GH_PROGRAMMES
      .map(p => ({ name: p, value: s(ghCohorts.map(c => c.byProgramme[p])) }))
      .sort((a, b) => b.value - a.value),

    // What the course led on to, per cohort
    byYear: ghCohorts.map(c => ({
      Year: String(c.cohortYear),
      Internship: c.progressedToInternship,
      Venture: c.progressedToVenture,
      Research: c.progressedToResearch,
    })),
  };
})();
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Download, FileText,
  GraduationCap,
  Mic,
  Package,
  Users,
  Briefcase,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";

// â”€â”€â”€ Palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Page identity (header KPIs only): purple/violet
// Keep section header accents as-is for brand consistency.
const VIOLET      = "#14306B"; // page identity now navy (mirrors exec theme)
const VIOLET_MID  = "#2F5FD1";
const VIOLET_DARK = "#0C447C";
const NAVY        = "#14306B";

// Section header accents
const INDIGO      = "#14306B";
const INDIGO_MID  = "#2F5FD1";
const TEAL        = "#185FA5";
const SKY         = "#7F77DD";
const PURPLE_MED  = "#534AB7";
const ORANGE      = "#D45F2C";
const GREEN       = "#1D9E75";
const AMBER       = "#BA7517";
const ROSE_900    = "#D45F2C";
const AMBER_BG    = "#FEF3C7";
const AMBER_TEXT  = "#92400E";

// â”€â”€â”€ Distinct series colours (for Mission Students visualizations) â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Using a dedicated palette per chart so categories are visually distinct.
const MS = {
  // Mentorship series: mentors / enrolled / feedback
  MENTORS:  "#14306B", // indigo-700
  ENROLLED: "#479BD6", // violet
  FEEDBACK: "#1D9E75", // emerald-500

  // Guest faculty series: sessions / feedback / disaggregated
  FAC_SESSIONS:      "#185FA5", // teal
  FAC_FEEDBACK:      "#7F77DD", // sky
  FAC_DISAGGREGATED: "#BA7517", // amber

  // Curator series: career events / training / 1-on-1
  CUR_CAREER: "#D45F2C", // orange
  CUR_TRAIN: "#085041", // green-500 (distinct from amber/emerald)
  CUR_ONEON1: "#534AB7", // purple

  // Courses completed line
  COURSES_COMPLETED: "#1D9E75", // emerald

  // Tooltip/markers use bright variants if needed (kept simple here)
} as const;


// â”€â”€â”€ Program operation data (2021 - 2026) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const mentorData = [
  { year: 2021, mentors:  8, enrolled: 14, feedback: 11, feedbackPct: 79 },
  { year: 2022, mentors: 10, enrolled: 18, feedback: 15, feedbackPct: 83 },
  { year: 2023, mentors: 14, enrolled: 22, feedback: 19, feedbackPct: 86 },
  { year: 2024, mentors: 16, enrolled: 24, feedback: 21, feedbackPct: 88 },
  { year: 2025, mentors: 12, enrolled: 22, feedback: 18, feedbackPct: 82 },
  { year: 2026, mentors:  4, enrolled: 12, feedback:  8, feedbackPct: 67 },
];

const guestData = [
  { year: 2021, sessions: 4, feedbackCollected: 3, disaggregated: 2 },
  { year: 2022, sessions: 6, feedbackCollected: 5, disaggregated: 4 },
  { year: 2023, sessions: 8, feedbackCollected: 7, disaggregated: 6 },
  { year: 2024, sessions: 9, feedbackCollected: 8, disaggregated: 7 },
  { year: 2025, sessions: 8, feedbackCollected: 7, disaggregated: 5 },
  { year: 2026, sessions: 5, feedbackCollected: 3, disaggregated: 2 },
];

const curatorData = [
  { year: 2021, careerEvents: 2, training: 2, oneOnOne:  8, coursesCompleted:  38 },
  { year: 2022, careerEvents: 3, training: 3, oneOnOne: 10, coursesCompleted:  52 },
  { year: 2023, careerEvents: 5, training: 3, oneOnOne: 14, coursesCompleted:  74 },
  { year: 2024, careerEvents: 6, training: 4, oneOnOne: 16, coursesCompleted:  89 },
  { year: 2025, careerEvents: 6, training: 4, oneOnOne: 16, coursesCompleted:  95 },
  { year: 2026, careerEvents: 2, training: 2, oneOnOne:  6, coursesCompleted:  39 },
];

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function sm(arr: number[]): number { return arr.reduce((a, b) => a + b, 0); }
function avg(arr: number[]): number { return arr.length ? sm(arr) / arr.length : 0; }

// â”€â”€â”€ Filter option list â”€â”€â”€
const YEARS = mentorData.map(d => d.year);

// Derive every aggregate + chart dataset from (possibly year-filtered) operational rows.
function derive(
  mRows: typeof mentorData,
  gRows: typeof guestData,
  cRows: typeof curatorData,
) {
  const totalMentors   = sm(mRows.map(d => d.mentors));
  const totalEnrolled  = sm(mRows.map(d => d.enrolled));
  const totalFeedbackM = sm(mRows.map(d => d.feedback));
  const avgFeedbackPct = Math.round(avg(mRows.map(d => d.feedbackPct)));

  const totalSessions  = sm(gRows.map(d => d.sessions));
  const totalFeedbackG = sm(gRows.map(d => d.feedbackCollected));
  const totalDisagg    = sm(gRows.map(d => d.disaggregated));
  const feedbackGPct   = totalSessions ? Math.round(totalFeedbackG / totalSessions * 100) : 0;
  const disaggPct      = totalSessions ? Math.round(totalDisagg    / totalSessions * 100) : 0;

  const totalCareerEvt = sm(cRows.map(d => d.careerEvents));
  const totalTraining  = sm(cRows.map(d => d.training));
  const totalOneOnOne  = sm(cRows.map(d => d.oneOnOne));
  const totalCourses   = sm(cRows.map(d => d.coursesCompleted));
  const totalCuratorRes = totalCareerEvt + totalTraining + totalOneOnOne;

  const mentorChartData = mRows.map(d => ({
    Year: String(d.year), Mentors: d.mentors, Enrolled: d.enrolled, Feedback: d.feedback,
  }));
  const guestChartData = gRows.map(d => ({
    Year: String(d.year), Sessions: d.sessions,
    Feedback: d.feedbackCollected, Disaggregated: d.disaggregated,
  }));
  const curatorChartData = cRows.map(d => ({
    Year: String(d.year),
    "Career Events": d.careerEvents,
    Training: d.training,
    "1-on-1": d.oneOnOne,
  }));
  const coursesChartData = cRows.map(d => ({
    Year: String(d.year), Completed: d.coursesCompleted,
  }));

  return {
    totalMentors, totalEnrolled, totalFeedbackM, avgFeedbackPct,
    totalSessions, totalFeedbackG, totalDisagg, feedbackGPct, disaggPct,
    totalCareerEvt, totalTraining, totalOneOnOne, totalCourses, totalCuratorRes,
    mentorChartData, guestChartData, curatorChartData, coursesChartData,
  };
}

// â”€â”€â”€ Survey checklist â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SURVEY_ITEMS = [
  { label: "Mentorship feedback survey",                        status: "complete" as const, note: null },
  { label: "Student + guest faculty feedback survey",           status: "complete" as const, note: null },
  { label: "Student feedback survey  -  mission curator",         status: "complete" as const, note: null },
  { label: "Event registration + 1-on-1 session data ownership",
    status: "warning" as const,
    note:   "Mission curator may not be tracking these resources consistently." },
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

function SecHeader({ title, sub }: { title: string; sub?: string; accent?: string }) {
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

function Card({ title, sub, children }: {
  accent?: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
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

function MetricBar({ label, value, displayValue, max, color }: {
  label: string; value: number; displayValue: string; max: number; color: string;
}) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[11px] font-semibold text-gray-700">{label}</p>
        <p className="text-[11px] font-black tabular-nums" style={{ color }}>{displayValue}</p>
      </div>
      <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub }: {
  icon: ComponentType<any>; iconBg?: string; iconColor?: string;
  label: string; value: string | number; valueColor?: string; sub: string;
}) {
  const numeric = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.\-]/g, "")) || 0;
  return (
    <StatsKpiCard
      label={label}
      num={numeric}
      displayFmt={typeof value === "number" ? undefined : () => String(value)}
      sub={sub}
      Icon={Icon}
      tooltip={label}
    />
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MissionStudentsPage() {
  // â”€â”€ Filters â”€â”€
  const [fYear, setFYear] = useState("All Years");
  const byYear = <T extends { year: number }>(rows: T[]) =>
    fYear === "All Years" ? rows : rows.filter(d => String(d.year) === fYear);
  const mRows = useMemo(() => byYear(mentorData),  [fYear]);
  const gRows = useMemo(() => byYear(guestData),   [fYear]);
  const cRows = useMemo(() => byYear(curatorData), [fYear]);
  const {
    totalMentors, totalEnrolled, totalFeedbackM, avgFeedbackPct,
    totalSessions, totalFeedbackG, totalDisagg, feedbackGPct, disaggPct,
    totalCareerEvt, totalTraining, totalOneOnOne, totalCourses, totalCuratorRes,
    mentorChartData, guestChartData, curatorChartData, coursesChartData,
  } = useMemo(() => derive(mRows, gRows, cRows), [mRows, gRows, cRows]);
  const activeMission = useMemo(() => missionStudents.filter(ms =>
    ms.status === "Active" && (fYear === "All Years" || String(ms.cohort) === fYear)
  ).length, [fYear]);


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <HEMPNav />

      {/* â”€â”€ HEADER â”€â”€â”€ */}
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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Mission Students</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              Mentorship, guest faculty and mission curator — three pillars of student support
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Mission Students M&amp;E</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
              <span aria-hidden="true">·</span>
              <span>{activeMission} students active</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ THREE HEADLINE KPIs â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 pt-6">

          {/* â”€â”€ THREE HEADLINE KPIs â”€â”€â”€ */}
          <div className="pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsKpiCard
              label="Health Mission Students Active"
              num={activeMission}
              sub="Currently enrolled in mission pillars"
              Icon={Users}
              tooltip="Mission students currently active across the three support pillars."
            />
            <StatsKpiCard
              label="Courses Completed (Canvas / Coursera)"
              num={totalCourses}
              sub="Across all cohorts  ·  2021 - 2026"
              Icon={BookOpen}
              tooltip="Online courses completed by mission students on Canvas and Coursera."
            />
            <StatsKpiCard
              label="Resources by Mission Curators"
              num={totalCuratorRes}
              sub="Events  ·  courses  ·  1-on-1 sessions"
              Icon={Package}
              tooltip="Career events, training courses and 1-on-1 sessions delivered by mission curators."
            />
          </div>
      </div>

      {/* â”€â”€ BODY â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* FILTER BAR */}
        <ExecFilterBar
          filters={[
            { label: "Year", value: fYear, onChange: setFYear, options: ["All Years", ...YEARS.map(String)] },
          ]}
          dirty={fYear !== "All Years"}
          onReset={() => setFYear("All Years")}
        />

        {/* â•â• SECTION A: MENTORSHIP  -  indigo identity â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section>
          <SecHeader
            accent={INDIGO}
            title="Mentorship Program"
            sub={`${totalMentors} mentors recruited  ·  ${totalEnrolled} students enrolled  ·  ${avgFeedbackPct}% avg feedback rate`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Mentorship activity bar chart  -  3/5 cols */}
            <div className="lg:col-span-3">
              <Card accent={INDIGO} title="Mentorship Activity by Year"
                sub="Mentors recruited  ·  students enrolled  ·  feedback collected per cohort year">
                <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                  {[["Mentors", MS.MENTORS], ["Enrolled", MS.ENROLLED], ["Feedback", MS.FEEDBACK]].map(([l, c]) => (
                    <span key={l} className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c as string }} />{l}
                    </span>
                  ))}

                </div>
                <ResponsiveContainer width="100%" height={208}>
                  <BarChart data={mentorChartData} barCategoryGap="28%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={22} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                    <Bar dataKey="Mentors"  fill={MS.MENTORS}      radius={[0,0,0,0]} />
                    <Bar dataKey="Enrolled" fill={MS.ENROLLED}    radius={[0,0,0,0]} />
                    <Bar dataKey="Feedback" fill={MS.FEEDBACK}    radius={[0,0,0,0]} />

                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Mentorship indicators card  -  2/5 cols */}
            <div className="lg:col-span-2">
              <Card accent={INDIGO_MID} title="Mentorship Program Indicators"
                sub="Recruitment reach and programme engagement quality">

                <div className="space-y-5 py-1">
                  <MetricBar
                    label="Mentors Recruited"
                    value={totalMentors}
                    displayValue={String(totalMentors)}
                    max={80}
                    color={INDIGO}
                  />
                  <MetricBar
                    label="Program Feedback Collected"
                    value={avgFeedbackPct}
                    displayValue={`${avgFeedbackPct}%`}
                    max={100}
                    color={GREEN}
                  />
                </div>

                {/* Amber flag note */}
                <div className="flex items-start gap-2 p-2.5 rounded mt-5"
                  style={{ backgroundColor: AMBER_BG, borderLeft: `2px solid ${AMBER}` }}>
                  <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" style={{ color: AMBER }} />
                  <p className="text-[10px] font-medium leading-relaxed" style={{ color: AMBER_TEXT }}>
                    Note: enrollment â‰  active participation  -  secondary source required.
                  </p>
                </div>

                {/* Breakdown summary */}
                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Enrolled",  value: totalEnrolled,  color: MS.ENROLLED },
                    { label: "Feedback",  value: totalFeedbackM, color: MS.FEEDBACK },
                    { label: "Mentors",   value: totalMentors,   color: MS.MENTORS },
                  ].map(m => (

                    <div key={m.label}>
                      <p className="text-lg font-black tabular-nums" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5 font-medium">{m.label}</p>
                    </div>
                  ))}
                </div>

              </Card>
            </div>

          </div>
        </section>

        {/* â•â• SECTION B: GUEST FACULTY  -  teal + sky identity â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section>
          <SecHeader
            accent={TEAL}
            title="Guest Faculty &amp; Sessions"
            sub={`${totalSessions} lectures held  ·  ${feedbackGPct}% feedback collected  ·  ${disaggPct}% feedback disaggregated`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Three metric stat tiles */}
            <div className="space-y-3">

              <StatTile
                icon={Mic}
                iconBg="#E1F5EE"
                iconColor={TEAL}
                label="Lectures Held"
                value={totalSessions}
                valueColor={TEAL}
                sub="Sessions delivered 2021 - 2026"
              />

              {/* Feedback collected  -  sky */}
              <div className="bg-white rounded border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Student Feedback Collected</p>
                  <p className="text-lg font-black tabular-nums" style={{ color: SKY }}>{feedbackGPct}%</p>
                </div>
                <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                  <div className="h-full rounded-full" style={{ width: `${feedbackGPct}%`, backgroundColor: SKY }} />
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 tabular-nums">
                  {totalFeedbackG} of {totalSessions} sessions  ·  survey submitted
                </p>
              </div>

              {/* Feedback disaggregated  -  purple-medium */}
              <div className="bg-white rounded border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Feedback Disaggregated</p>
                  <p className="text-lg font-black tabular-nums"
                    style={{ color: disaggPct >= 70 ? MS.FAC_DISAGGREGATED : AMBER }}>{disaggPct}%</p>

                </div>
                <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                    <div className="h-full rounded-full"
                    style={{ width: `${disaggPct}%`, backgroundColor: disaggPct >= 70 ? MS.FAC_DISAGGREGATED : AMBER }} />

                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 tabular-nums">
                  {totalDisagg} of {totalSessions} sessions  ·  by gender &amp; cohort
                </p>
              </div>

            </div>

            {/* Guest faculty bar chart  -  2/3 cols */}
            <div className="lg:col-span-2">
              <Card accent={TEAL} title="Guest Faculty Sessions per Year"
                sub="Sessions held  ·  feedback collected  ·  feedback disaggregated  -  annual comparison">
                <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                  {[["Sessions", MS.FAC_SESSIONS], ["Feedback", MS.FAC_FEEDBACK], ["Disaggregated", MS.FAC_DISAGGREGATED]].map(([l, c]) => (
                    <span key={l} className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c as string }} />{l}
                    </span>
                  ))}

                </div>
                <ResponsiveContainer width="100%" height={208}>
                  <BarChart data={guestChartData} barCategoryGap="28%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={22} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                    <Bar dataKey="Sessions"      fill={MS.FAC_SESSIONS}       radius={[0,0,0,0]} />
                    <Bar dataKey="Feedback"      fill={MS.FAC_FEEDBACK}       radius={[0,0,0,0]} />
                    <Bar dataKey="Disaggregated" fill={MS.FAC_DISAGGREGATED}  radius={[0,0,0,0]} />

                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

          </div>
        </section>

        {/* â•â• SECTION C: CURATOR RESOURCES  -  orange + green + amber identity â•â•â• */}
        <section>
          <SecHeader
            accent={ORANGE}
            title="Mission Curator Resources"
            sub={`${totalCareerEvt} career events  ·  ${totalTraining} training courses  ·  ${totalOneOnOne} one-on-one sessions`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Three resource tiles + source note */}
            <div className="space-y-3">

              <StatTile
                icon={GraduationCap}
                iconBg="#FEF3C7"
                iconColor={ORANGE}
                label="Career Centre Events"
                value={totalCareerEvt}
                valueColor={ORANGE}
                sub="Panel sessions &amp; employer fairs"
              />

              <StatTile
                icon={BookOpen}
                iconBg="#E1F5EE"
                iconColor={GREEN}
                label="Training Courses"
                value={totalTraining}
                valueColor={GREEN}
                sub="Canvas / Coursera modules"
              />

              <StatTile
                icon={Users}
                iconBg="#FEF3C7"
                iconColor={AMBER}
                label="1-on-1 Sessions"
                value={totalOneOnOne}
                valueColor={AMBER}
                sub="Individual student support"
              />

              {/* Source note */}
              <div className="bg-white rounded border border-gray-100 shadow-sm px-4 py-3 flex items-start gap-2">
                <div className="rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: "#9CA3AF", width: "3px", minWidth: "3px", height: "36px" }} />
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Mission Curator records  -  event registration, feedback forms.
                </p>
              </div>

            </div>

            {/* Two charts  -  2/3 cols */}
            <div className="lg:col-span-2 space-y-4">

              <Card accent={ORANGE} title="Curator Resources Delivered per Year"
                sub="Career events  ·  training courses  ·  1-on-1 sessions  -  stacked by type">
                <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                  {[["Career Events", MS.CUR_CAREER], ["Training", MS.CUR_TRAIN], ["1-on-1", MS.CUR_ONEON1]].map(([l, c]) => (

                    <span key={l} className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c as string }} />{l}
                    </span>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={168}>
                  <BarChart data={curatorChartData} barCategoryGap="30%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={22} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }} />
                    <Bar dataKey="Career Events" fill={MS.CUR_CAREER} radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="Training"       fill={MS.CUR_TRAIN}  radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="1-on-1"         fill={MS.CUR_ONEON1}  radius={[4,4,0,0]} stackId="a" />


                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card accent={GREEN} title="Courses Completed per Year"
                sub="Canvas / Coursera module completions  -  cumulative annual total">
                <ResponsiveContainer width="100%" height={128}>
                  <AreaChart data={coursesChartData}>
                    <defs>
                      <linearGradient id="courseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={MS.COURSES_COMPLETED} stopOpacity={0.30} />
                        <stop offset="95%" stopColor={MS.COURSES_COMPLETED} stopOpacity={0.03} />

                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 4px 6px rgba(0,0,0,.05)",
                      }}
                      formatter={(v: number) => [`${v} courses`, "Completed"]}
                    />

                    <Area type="monotone" dataKey="Completed" stroke={MS.COURSES_COMPLETED} strokeWidth={2} fill="url(#courseGrad)" dot={false} />

                  </AreaChart>
                </ResponsiveContainer>
              </Card>

            </div>

          </div>
        </section>

        {/* â•â• SECTION D: SURVEY STATUS  -  rose identity â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section>
          <SecHeader
            accent={ROSE_900}
            title="Survey &amp; Data Status"
            sub="Checklist of active feedback mechanisms  -  amber items require attention"
          />

          <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 flex items-center gap-2.5" style={{ backgroundColor: ROSE_900 }}>
              <div className="w-[3px] h-[14px] rounded-full flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
              <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">
                Survey Coverage Checklist
              </p>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.85)" }}>
                {SURVEY_ITEMS.filter(i => i.status === "complete").length}/{SURVEY_ITEMS.length} complete
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {SURVEY_ITEMS.map((item, i) => (
                <div key={i}
                  className="px-5 py-4 flex items-start gap-4"
                  style={item.status === "warning" ? { backgroundColor: AMBER_BG } : {}}>

                  {item.status === "complete"
                    ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: GREEN }} />
                    : <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: AMBER }} />}

                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold leading-snug"
                      style={{ color: item.status === "warning" ? AMBER_TEXT : "#111827" }}>
                      {item.label}
                    </p>
                    {item.note && (
                      <p className="text-[10px] mt-1 leading-relaxed" style={{ color: AMBER_TEXT }}>
                        {item.note}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {item.status === "complete" ? (
                      <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: GREEN + "18", color: GREEN }}>
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: AMBER_BG, color: AMBER_TEXT, border: `1px solid ${AMBER}` }}>
                        âš  Flag
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* â•â• SECTION: INTRODUCTION TO GLOBAL HEALTH COURSE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section>
          <SecHeader
            title="Introduction to Global Health Course"
            sub={`Mission students come from different academic programmes but share a passion for improving healthcare. This foundational course is one of the ways we link them into the health sector — ${GH.enrolled} enrolled · ${GH.certifiedPct}% certified`}
          />

          {/* Course KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <StatsKpiCard label="Enrolled"          num={GH.enrolled}     sub={`${GH.femalePct}% female`}          Icon={BookOpen}      tooltip="Mission students enrolled on the Introduction to Global Health course across all cohorts." />
            <StatsKpiCard label="Completed"         num={GH.completed}    sub={`${GH.completionPct}% completion`}  Icon={CheckCircle2}  tooltip="Students who finished all five modules of the course." />
            <StatsKpiCard label="Certified"         num={GH.certified}    sub="Completed & passed"                 Icon={GraduationCap} tooltip="Students who completed the course and passed the final assessment." />
            <StatsKpiCard label="Avg Score"         num={GH.avgScore}     displayFmt={n => `${Math.round(n)}%`} sub="Assessment mean" Icon={Award} tooltip="Mean assessment score across all certified students." />
            <StatsKpiCard label="Progressed On"     num={GH.progressed}   sub="Venture · research · internship"    Icon={TrendingUp}    tooltip="Students who went on to a venture, a research project or an internship after the course — the point of the course is to open these doors." />
            <StatsKpiCard label="Satisfaction"      num={GH.satisfaction} displayFmt={n => `${n.toFixed(1)}/5`} sub="Student-rated" Icon={Star} tooltip="How students rate the course, out of 5." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card title="Module Completion — Where Learners Drop Off"
              sub="Average completion rate per module. Epidemiology is consistently the hardest gate.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={GH.byModule} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="26%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: "#6B7280" }} axisLine={false} tickLine={false} width={140} interval={0} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="value" name="Completion" radius={[0, 4, 4, 0]} maxBarSize={22}>
                    {GH.byModule.map(d => (
                      <Cell key={d.name} fill={d.value >= 90 ? "#0F6E56" : d.value >= 80 ? "#185FA5" : "#BA7517"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {([["≥90%", "#0F6E56"], ["80–89%", "#185FA5"], ["<80%", "#BA7517"]] as const).map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Where the Course Leads"
              sub="Students progressing into ventures, research and internships after the course, per cohort">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={GH.byYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={26} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="Internship" fill="#14306B" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="Venture"    fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="Research"   fill="#534AB7" radius={[4, 4, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {([["Internship", "#14306B"], ["Venture", "#0F6E56"], ["Research", "#534AB7"]] as const).map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-4">
            <Card title="Cross-Disciplinary Intake"
              sub="Mission students come from different academic programmes — this is the mix enrolling on the course">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {GH.byProgramme.map((row, i) => {
                  const col = ["#14306B", "#185FA5", "#479BD6", "#0F6E56", "#534AB7"][i % 5];
                  const max = GH.byProgramme[0]?.value || 1;
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
              </div>
            </Card>
          </div>
        </section>

        {/* â”€â”€ FOOTER STRIP  -  one tile per section, each its own hue â”€â”€â”€ */}
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
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.85)" }}><span style={{ color: "#85B7EB", fontWeight: 600 }}>Source:</span> HEMP Mission Students M&amp;E</span>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(181,212,244,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>Contact Analyst</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
