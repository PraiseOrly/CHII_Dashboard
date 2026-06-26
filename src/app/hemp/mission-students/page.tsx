"use client";
import HEMPNav from "@/components/HEMPNav";
import { missionStudents } from "@/data/hemp/missionStudents";
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
} from "lucide-react";
import { useEffect, useState } from "react";
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

// â”€â”€â”€ Palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Page identity (header KPIs only): purple/violet
// Keep section header accents as-is for brand consistency.
const VIOLET      = "#7C3AED";
const VIOLET_MID  = "#6D28D9";
const VIOLET_DARK = "#4C1D95";
const NAVY        = "#002147";

// Section header accents
const INDIGO      = "#4338CA";
const INDIGO_MID  = "#4F46E5";
const TEAL        = "#0D9488";
const SKY         = "#0EA5E9";
const PURPLE_MED  = "#9333EA";
const ORANGE      = "#EA580C";
const GREEN       = "#10B981";
const AMBER       = "#F59E0B";
const ROSE_900    = "#9D174D";
const AMBER_BG    = "#FEF3C7";
const AMBER_TEXT  = "#92400E";

// â”€â”€â”€ Distinct series colours (for Mission Students visualizations) â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Using a dedicated palette per chart so categories are visually distinct.
const MS = {
  // Mentorship series: mentors / enrolled / feedback
  MENTORS:  "#4338CA", // indigo-700
  ENROLLED: "#A855F7", // violet
  FEEDBACK: "#10B981", // emerald-500

  // Guest faculty series: sessions / feedback / disaggregated
  FAC_SESSIONS:      "#0D9488", // teal
  FAC_FEEDBACK:      "#0EA5E9", // sky
  FAC_DISAGGREGATED: "#F59E0B", // amber

  // Curator series: career events / training / 1-on-1
  CUR_CAREER: "#EA580C", // orange
  CUR_TRAIN: "#22C55E", // green-500 (distinct from amber/emerald)
  CUR_ONEON1: "#9333EA", // purple

  // Courses completed line
  COURSES_COMPLETED: "#10B981", // emerald

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

// â”€â”€â”€ Aggregates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const activeMission  = missionStudents.filter(ms => ms.status === "Active").length;
const totalMentors   = sm(mentorData.map(d => d.mentors));
const totalEnrolled  = sm(mentorData.map(d => d.enrolled));
const totalFeedbackM = sm(mentorData.map(d => d.feedback));
const avgFeedbackPct = Math.round(avg(mentorData.map(d => d.feedbackPct)));

const totalSessions  = sm(guestData.map(d => d.sessions));
const totalFeedbackG = sm(guestData.map(d => d.feedbackCollected));
const totalDisagg    = sm(guestData.map(d => d.disaggregated));
const feedbackGPct   = Math.round(totalFeedbackG / totalSessions * 100);
const disaggPct      = Math.round(totalDisagg    / totalSessions * 100);

const totalCareerEvt = sm(curatorData.map(d => d.careerEvents));
const totalTraining  = sm(curatorData.map(d => d.training));
const totalOneOnOne  = sm(curatorData.map(d => d.oneOnOne));
const totalCourses   = sm(curatorData.map(d => d.coursesCompleted));
const totalCuratorRes = totalCareerEvt + totalTraining + totalOneOnOne;

// â”€â”€â”€ Chart data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const mentorChartData = mentorData.map(d => ({
  Year: String(d.year), Mentors: d.mentors, Enrolled: d.enrolled, Feedback: d.feedback,
}));

const guestChartData = guestData.map(d => ({
  Year: String(d.year), Sessions: d.sessions,
  Feedback: d.feedbackCollected, Disaggregated: d.disaggregated,
}));

const curatorChartData = curatorData.map(d => ({
  Year: String(d.year),
  "Career Events": d.careerEvents,
  Training: d.training,
  "1-on-1": d.oneOnOne,
}));

const coursesChartData = curatorData.map(d => ({
  Year: String(d.year), Completed: d.coursesCompleted,
}));

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
      <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#D17A86" }} />
      <div>
        <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: "#4C1D95", letterSpacing: "0.01em" }}>{title}</h2>
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
      <div className="flex items-center gap-2.5" style={{ backgroundColor: "#4C1D95", padding: "11px 20px" }}>
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

function StatTile({ icon: Icon, iconBg, iconColor, label, value, valueColor, sub }: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  label: string; value: string | number; valueColor: string; sub: string;
}) {
  return (
    <div className="bg-white rounded border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}>
        <Icon size={17} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">{label}</p>
        <p className="text-2xl font-black tabular-nums leading-none mt-0.5" style={{ color: valueColor }}>
          {value}
        </p>
        <p className="text-[9px] text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MissionStudentsPage() {
  const animActive  = useCountUp(activeMission);
  const animCourses = useCountUp(totalCourses);
  const animRes     = useCountUp(totalCuratorRes);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HEMPNav />

      {/* â”€â”€ HEADER â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#4C1D95", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>

        {/* Faint triangle pattern across the whole header */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

        {/* Full design elements anchored to the left & right edges */}
        <img src="/images/hempdesign.png" alt="" aria-hidden="true"
          style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
        <img src="/images/hempdesign.png" alt="" aria-hidden="true"
          style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />

        {/* Center overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(76,29,149,0) 0%, #4C1D95 34%, #4C1D95 66%, rgba(76,29,149,0) 100%)" }} />

        {/* Content */}
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Mission Students</h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Briefcase size={11} style={{ color: "#F59E0B" }} />
                <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#F59E0B" }}>HEMP</span>
              </span>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              Mentorship  ·  Guest Faculty  ·  Mission Curator  -  three pillars of student support in HEMP
            </p>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ THREE HEADLINE KPIs â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 pt-6">

          {/* â”€â”€ THREE HEADLINE KPIs  -  distinct stat card colours â”€â”€â”€ */}
          <div className="pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: MS.MENTORS, borderColor: MS.MENTORS }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <Users size={18} style={{ color: "rgba(255,255,255,0.9)" }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "rgba(255,255,255,0.65)" }}>Health Mission Students Active</p>
                <p className="text-3xl font-black tabular-nums leading-none text-white mt-1">
                  {Math.round(animActive)}
                </p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Currently enrolled in mission pillars
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: MS.ENROLLED, borderColor: MS.ENROLLED }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <BookOpen size={18} style={{ color: "rgba(255,255,255,0.9)" }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "rgba(255,255,255,0.65)" }}>Courses Completed (Canvas / Coursera)</p>
                <p className="text-3xl font-black tabular-nums leading-none text-white mt-1">
                  {Math.round(animCourses)}
                </p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Across all cohorts  ·  2021 - 2026
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: MS.CUR_CAREER, borderColor: MS.CUR_CAREER }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <Package size={18} style={{ color: "rgba(255,255,255,0.9)" }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: "rgba(255,255,255,0.65)" }}>Resources by Mission Curators</p>
                <p className="text-3xl font-black tabular-nums leading-none text-white mt-1">
                  {Math.round(animRes)}
                </p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Events  ·  courses  ·  1-on-1 sessions
                </p>
              </div>
            </div>

          </div>
      </div>

      {/* â”€â”€ BODY â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

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
                iconBg="#CCFBF1"
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
                iconBg="#D1FAE5"
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

        {/* â”€â”€ FOOTER STRIP  -  one tile per section, each its own hue â”€â”€â”€ */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#4C1D95", minHeight: 116, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/hempdesign.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
          <img src="/images/hempdesign.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none", opacity: 0.55 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(76,29,149,0) 0%, #4C1D95 34%, #4C1D95 66%, rgba(76,29,149,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>Africa&apos;s Oasis for Health &amp; Education Transformation</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(221,214,254,0.85)" }}><span style={{ color: "#C4B5FD", fontWeight: 600 }}>Data Last Synced:</span> 04 Jun 2026, EAT</span>
              <span style={{ fontSize: 11, color: "rgba(221,214,254,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(221,214,254,0.85)" }}><span style={{ color: "#C4B5FD", fontWeight: 600 }}>Source:</span> HEMP Mission Students M&amp;E</span>
              <span style={{ fontSize: 11, color: "rgba(221,214,254,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(221,214,254,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>Contact Analyst</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
