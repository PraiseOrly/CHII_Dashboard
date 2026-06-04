"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Download, FileText, Users, BookOpen, Package,
  CheckCircle2, AlertTriangle, Mic, GraduationCap,
} from "lucide-react";
import HEMPNav from "@/components/HEMPNav";
import { missionStudents } from "@/data/hemp/missionStudents";

// ─── Palette ──────────────────────────────────────────────────────────────────
// Page identity (header KPIs only): purple/violet
// Section A – Mentorship:    indigo
// Section B – Guest Faculty: teal + sky
// Section C – Curator:       orange + green + amber
// Section D – Survey:        rose
// Amber: all flags and data gaps (unchanged)
const VIOLET      = "#7C3AED";
const VIOLET_MID  = "#6D28D9";
const VIOLET_DARK = "#4C1D95";
const INDIGO      = "#4338CA";
const INDIGO_MID  = "#4F46E5";   // indigo-600
const INDIGO_LITE = "#818CF8";   // indigo-400
const TEAL        = "#0D9488";
const SKY         = "#0EA5E9";
const PURPLE_MED  = "#9333EA";   // faculty disagg
const ORANGE      = "#EA580C";
const GREEN       = "#10B981";
const AMBER       = "#F59E0B";
const ROSE_900    = "#9D174D";
const AMBER_BG    = "#FEF3C7";
const AMBER_TEXT  = "#92400E";
const NAVY        = "#002147";

// ─── Program operation data (2021–2026) ──────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sm(arr: number[]): number { return arr.reduce((a, b) => a + b, 0); }
function avg(arr: number[]): number { return arr.length ? sm(arr) / arr.length : 0; }

// ─── Aggregates ───────────────────────────────────────────────────────────────
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

// ─── Chart data ───────────────────────────────────────────────────────────────
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

// ─── Survey checklist ────────────────────────────────────────────────────────
const SURVEY_ITEMS = [
  { label: "Mentorship feedback survey",                        status: "complete" as const, note: null },
  { label: "Student + guest faculty feedback survey",           status: "complete" as const, note: null },
  { label: "Student feedback survey — mission curator",         status: "complete" as const, note: null },
  { label: "Event registration + 1-on-1 session data ownership",
    status: "warning" as const,
    note:   "Mission curator may not be tracking these resources consistently." },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function SecHeader({ title, sub, accent }: { title: string; sub?: string; accent: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: accent }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function Card({ accent, title, sub, children }: {
  accent: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 flex items-start gap-2.5" style={{ backgroundColor: accent }}>
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MissionStudentsPage() {
  const animActive  = useCountUp(activeMission);
  const animCourses = useCountUp(totalCourses);
  const animRes     = useCountUp(totalCuratorRes);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HEMPNav />

      {/* ── HEADER ─── */}
      <header className="bg-white border-b border-gray-200"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="max-w-[1440px] mx-auto px-6">

          <div className="flex items-end justify-between py-5">
            <div>
              <h1 className="text-[1.55rem] font-black leading-none" style={{ color: NAVY }}>
                Mission Students
              </h1>
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Mentorship · Guest Faculty · Mission Curator — three pillars of student support in HEMP
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-2 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded font-semibold text-white shadow-sm"
                style={{ backgroundColor: VIOLET }}>
                <FileText size={11} /> Report
              </button>
            </div>
          </div>

          {/* ── THREE HEADLINE KPIs — page-identity purple ─── */}
          <div className="pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: VIOLET_DARK, borderColor: VIOLET_DARK }}>
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
              style={{ backgroundColor: VIOLET_MID, borderColor: VIOLET_MID }}>
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
                  Across all cohorts · 2021–2026
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-5 flex items-center gap-4"
              style={{ backgroundColor: VIOLET, borderColor: VIOLET }}>
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
                  Events · courses · 1-on-1 sessions
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* ══ SECTION A: MENTORSHIP — indigo identity ══════════════════════════ */}
        <section>
          <SecHeader
            accent={INDIGO}
            title="Mentorship Program"
            sub={`${totalMentors} mentors recruited · ${totalEnrolled} students enrolled · ${avgFeedbackPct}% avg feedback rate`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Mentorship activity bar chart — 3/5 cols */}
            <div className="lg:col-span-3">
              <Card accent={INDIGO} title="Mentorship Activity by Year"
                sub="Mentors recruited · students enrolled · feedback collected per cohort year">
                <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                  {[["Mentors", INDIGO], ["Enrolled", INDIGO_LITE], ["Feedback", GREEN]].map(([l, c]) => (
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
                    <Bar dataKey="Mentors"  fill={INDIGO}      radius={[0,0,0,0]} />
                    <Bar dataKey="Enrolled" fill={INDIGO_LITE} radius={[0,0,0,0]} />
                    <Bar dataKey="Feedback" fill={GREEN}       radius={[0,0,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Mentorship indicators card — 2/5 cols */}
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
                    Note: enrollment ≠ active participation — secondary source required.
                  </p>
                </div>

                {/* Breakdown summary */}
                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Enrolled",  value: totalEnrolled,  color: INDIGO_LITE },
                    { label: "Feedback",  value: totalFeedbackM, color: GREEN       },
                    { label: "Mentors",   value: totalMentors,   color: INDIGO      },
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

        {/* ══ SECTION B: GUEST FACULTY — teal + sky identity ═══════════════════ */}
        <section>
          <SecHeader
            accent={TEAL}
            title="Guest Faculty &amp; Sessions"
            sub={`${totalSessions} lectures held · ${feedbackGPct}% feedback collected · ${disaggPct}% feedback disaggregated`}
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
                sub="Sessions delivered 2021–2026"
              />

              {/* Feedback collected — sky */}
              <div className="bg-white rounded border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Student Feedback Collected</p>
                  <p className="text-lg font-black tabular-nums" style={{ color: SKY }}>{feedbackGPct}%</p>
                </div>
                <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                  <div className="h-full rounded-full" style={{ width: `${feedbackGPct}%`, backgroundColor: SKY }} />
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 tabular-nums">
                  {totalFeedbackG} of {totalSessions} sessions · survey submitted
                </p>
              </div>

              {/* Feedback disaggregated — purple-medium */}
              <div className="bg-white rounded border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Feedback Disaggregated</p>
                  <p className="text-lg font-black tabular-nums"
                    style={{ color: disaggPct >= 70 ? PURPLE_MED : AMBER }}>{disaggPct}%</p>
                </div>
                <div className="h-[10px] rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${disaggPct}%`, backgroundColor: disaggPct >= 70 ? PURPLE_MED : AMBER }} />
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 tabular-nums">
                  {totalDisagg} of {totalSessions} sessions · by gender &amp; cohort
                </p>
              </div>

            </div>

            {/* Guest faculty bar chart — 2/3 cols */}
            <div className="lg:col-span-2">
              <Card accent={TEAL} title="Guest Faculty Sessions per Year"
                sub="Sessions held · feedback collected · feedback disaggregated — annual comparison">
                <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                  {[["Sessions", TEAL], ["Feedback", SKY], ["Disaggregated", PURPLE_MED]].map(([l, c]) => (
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
                    <Bar dataKey="Sessions"      fill={TEAL}       radius={[0,0,0,0]} />
                    <Bar dataKey="Feedback"      fill={SKY}        radius={[0,0,0,0]} />
                    <Bar dataKey="Disaggregated" fill={PURPLE_MED} radius={[0,0,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

          </div>
        </section>

        {/* ══ SECTION C: CURATOR RESOURCES — orange + green + amber identity ═══ */}
        <section>
          <SecHeader
            accent={ORANGE}
            title="Mission Curator Resources"
            sub={`${totalCareerEvt} career events · ${totalTraining} training courses · ${totalOneOnOne} one-on-one sessions`}
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
                  Mission Curator records — event registration, feedback forms.
                </p>
              </div>

            </div>

            {/* Two charts — 2/3 cols */}
            <div className="lg:col-span-2 space-y-4">

              <Card accent={ORANGE} title="Curator Resources Delivered per Year"
                sub="Career events · training courses · 1-on-1 sessions — stacked by type">
                <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 mb-4">
                  {[["Career Events", ORANGE], ["Training", GREEN], ["1-on-1", AMBER]].map(([l, c]) => (
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
                    <Bar dataKey="Career Events" fill={ORANGE} radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="Training"       fill={GREEN}  radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="1-on-1"         fill={AMBER}  radius={[4,4,0,0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card accent={GREEN} title="Courses Completed per Year"
                sub="Canvas / Coursera module completions — cumulative annual total">
                <ResponsiveContainer width="100%" height={128}>
                  <AreaChart data={coursesChartData}>
                    <defs>
                      <linearGradient id="courseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={GREEN} stopOpacity={0.30} />
                        <stop offset="95%" stopColor={GREEN} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 6px rgba(0,0,0,.05)" }}
                      formatter={(v: number) => [`${v} courses`, "Completed"]} />
                    <Area type="monotone" dataKey="Completed" stroke={GREEN} strokeWidth={2} fill="url(#courseGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

            </div>

          </div>
        </section>

        {/* ══ SECTION D: SURVEY STATUS — rose identity ════════════════════════ */}
        <section>
          <SecHeader
            accent={ROSE_900}
            title="Survey &amp; Data Status"
            sub="Checklist of active feedback mechanisms — amber items require attention"
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
                        ⚠ Flag
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER STRIP — one tile per section, each its own hue ─── */}
        <div className="rounded overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(activeMission),  label: "Active Students",      clr: VIOLET_DARK },
              { value: String(totalMentors),   label: "Mentors Recruited",    clr: INDIGO      },
              { value: String(totalSessions),  label: "Guest Lectures",       clr: TEAL        },
              { value: String(totalCourses),   label: "Courses Completed",    clr: GREEN       },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-6 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}` }}>
                <p className="text-2xl font-black tabular-nums text-white">{tile.value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.65)" }}>{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              HEMP · Mission Students · 2021–2026
            </p>
            <p className="text-[10px] text-gray-400">Last updated: 04 Jun 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
