"use client";
import { useState, useMemo } from "react";
import { AreaChart, BarChart, DonutChart } from "@tremor/react";
import { Download, FileText, Star } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  masterclasses,
  MC_TOPICS, RATING_CRITERIA,
  type MCTopic,
} from "@/data/masterclasses";
import { ventures as ALL_VENTURES } from "@/data/ventures";

const NAVY   = "#002147";
const RED    = "#D4264A";
const ACCENT = "#2563EB"; // blue — masterclasses module identity
const VIOLET_MC = "#7C3AED";
const EMERALD_MC = "#10B981";
const AMBER_MC = "#F59E0B";

function ratingLabel(score: number): string {
  if (score >= 4.5) return "Very High";
  if (score >= 3.8) return "High";
  if (score >= 3.0) return "Moderate";
  return "Low";
}

const RATING_COLORS: Record<string, string> = {
  "Very High": "#10b981", High: "#3b82f6", Moderate: "#f59e0b", Low: "#ef4444",
};

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: ACCENT }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = ACCENT, children }: {
  title: string; sub?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-start gap-2.5"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(0,0,0,0.08) 100%), ${accent}`,
          borderBottomColor: accent,
        }}>
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

function ProfileCard({ label, value, pct, total: tot, color }: {
  label: string; value: number; pct: number; total: number; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.12em] leading-none">{label}</p>
      <div className="flex items-baseline gap-0.5 mt-3">
        <p className="text-[2.25rem] font-black tabular-nums leading-none" style={{ color }}>{pct}</p>
        <p className="text-lg font-bold mb-0.5" style={{ color }}>%</p>
      </div>
      <p className="text-[11px] text-gray-400 mt-2 tabular-nums">{value.toLocaleString()} / {tot.toLocaleString()}</p>
      <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct,100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RatingBar({ label, sessions, criterion }: {
  label: string;
  sessions: typeof masterclasses;
  criterion: typeof RATING_CRITERIA[number];
}) {
  const vh  = sessions.filter(s => s.scores[criterion] >= 4.5).length;
  const hi  = sessions.filter(s => s.scores[criterion] >= 3.8 && s.scores[criterion] < 4.5).length;
  const mo  = sessions.filter(s => s.scores[criterion] >= 3.0 && s.scores[criterion] < 3.8).length;
  const lo  = sessions.filter(s => s.scores[criterion] <  3.0).length;
  const tot = sessions.length || 1;
  const avg = sessions.length
    ? (sessions.reduce((s, m) => s + m.scores[criterion], 0) / sessions.length).toFixed(1)
    : "—";
  return (
    <div className="flex items-center gap-3 mb-3 last:mb-0">
      <div className="w-40 text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-5 bg-gray-100 rounded-sm overflow-hidden flex">
        <div style={{ width: `${(vh/tot)*100}%`, backgroundColor: RATING_COLORS["Very High"] }} title={`Very High: ${vh}`} />
        <div style={{ width: `${(hi/tot)*100}%`, backgroundColor: RATING_COLORS["High"] }}      title={`High: ${hi}`} />
        <div style={{ width: `${(mo/tot)*100}%`, backgroundColor: RATING_COLORS["Moderate"] }}  title={`Moderate: ${mo}`} />
        <div style={{ width: `${(lo/tot)*100}%`, backgroundColor: RATING_COLORS["Low"] }}       title={`Low: ${lo}`} />
      </div>
      <div className="w-10 text-[11px] text-gray-500 text-right flex-shrink-0 font-medium">{avg}/5</div>
    </div>
  );
}

function GenderRatingBar({ label, fSessions, mSessions, criterion }: {
  label: string;
  fSessions: typeof masterclasses;
  mSessions: typeof masterclasses;
  criterion: typeof RATING_CRITERIA[number];
}) {
  const fAvg = fSessions.length ? fSessions.reduce((s, m) => s + m.scores[criterion], 0) / fSessions.length : 0;
  const mAvg = mSessions.length ? mSessions.reduce((s, m) => s + m.scores[criterion], 0) / mSessions.length : 0;
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-36 text-[11px] text-gray-600 text-right flex-shrink-0">{label}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-violet-600 w-5 flex-shrink-0">♀</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-violet-500" style={{ width: `${(fAvg/5)*100}%` }} />
          </div>
          <span className="text-[10px] text-gray-500 w-6">{fAvg.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-blue-600 w-5 flex-shrink-0">♂</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-blue-500" style={{ width: `${(mAvg/5)*100}%` }} />
          </div>
          <span className="text-[10px] text-gray-500 w-6">{mAvg.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

function Stars({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10}
          className={i <= Math.floor(score) ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
      ))}
      <span className="text-[10px] text-gray-500 ml-1">{score.toFixed(1)}</span>
    </span>
  );
}

export default function MasterclassesPage() {
  const [yearFilter,  setYearFilter]  = useState<"All"|"2023"|"2024"|"2025"|"2026">("All");
  const [topicFilter, setTopicFilter] = useState<"All"|MCTopic>("All");
  const [genderView,  setGenderView]  = useState<"All"|"Female"|"Male">("All");

  const filtered = useMemo(() => masterclasses.filter(m => {
    if (yearFilter  !== "All" && m.year  !== Number(yearFilter))                    return false;
    if (topicFilter !== "All" && m.topic !== topicFilter)                           return false;
    if (genderView  === "Female" && m.femaleAttendees <= m.attendees / 2)           return false;
    if (genderView  === "Male"   && m.femaleAttendees >  m.attendees / 2)           return false;
    return true;
  }), [yearFilter, topicFilter, genderView]);

  const tot = {
    sessions:   filtered.length,
    attendees:  filtered.reduce((s, m) => s + m.attendees,          0),
    female:     filtered.reduce((s, m) => s + m.femaleAttendees,     0),
    students:   filtered.reduce((s, m) => s + m.studentAttendees,    0),
    ventures:   filtered.reduce((s, m) => s + m.venturesRepresented, 0),
    femaleVent: filtered.reduce((s, m) => s + m.femaleLedVentures,   0),
    completion: filtered.length
      ? Math.round(filtered.reduce((s, m) => s + m.completionRate, 0) / filtered.length) : 0,
  };
  const avgAtt     = filtered.length ? Math.round(tot.attendees / filtered.length) : 0;
  const femalePct  = tot.attendees ? Math.round((tot.female   / tot.attendees) * 100) : 0;
  const studentPct = tot.attendees ? Math.round((tot.students / tot.attendees) * 100) : 0;
  const alumniTot  = tot.attendees - tot.students;

  const fSessions = filtered.filter(m => m.femaleAttendees > m.attendees / 2);
  const mSessions = filtered.filter(m => m.femaleAttendees <= m.attendees / 2);

  const byAge    = { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 };
  const byRegion = { "East Africa": 0, "West Africa": 0, "South Africa": 0, "North Africa": 0, Other: 0 };
  const byStage  = { Expose: 0, Build: 0, Scale: 0 };
  const bySocial = { "MCF Scholars": 0, PWD: 0, "Refugee-Displaced": 0 };

  filtered.forEach(m => {
    (Object.keys(m.byAge)    as (keyof typeof byAge)[]).forEach(k    => { byAge[k]    += m.byAge[k]; });
    (Object.keys(m.byRegion) as (keyof typeof byRegion)[]).forEach(k => { byRegion[k] += m.byRegion[k]; });
    (Object.keys(m.byStage)  as (keyof typeof byStage)[]).forEach(k  => { byStage[k]  += m.byStage[k]; });
    (Object.keys(m.bySocial) as (keyof typeof bySocial)[]).forEach(k => { bySocial[k] += m.bySocial[k]; });
  });

  const ageData    = Object.entries(byAge).map(([name,value]) => ({name,value}));
  const regionData = Object.entries(byRegion).map(([name,value]) => ({name,value}));
  const stageData  = Object.entries(byStage).map(([name,value]) => ({name,value}));
  const socialData = Object.entries(bySocial).map(([name,value]) => ({name,value}));

  const attendanceTrend = [...filtered]
    .sort((a,b) => a.date.localeCompare(b.date))
    .map(m => ({
      Session: m.name.length > 22 ? m.name.slice(0,22)+"…" : m.name,
      Attendees: m.attendees,
    }));

  let cum = 0;
  const growthData = [...filtered]
    .sort((a,b) => a.date.localeCompare(b.date))
    .map(m => { cum += m.attendees; return { Period: `${m.year}-${String(m.month).padStart(2,"0")}`, "Cumulative Attendees": cum }; });

  const topSessions = [...filtered]
    .map(m => ({ ...m, avgScore: RATING_CRITERIA.reduce((s,c) => s + m.scores[c], 0) / RATING_CRITERIA.length }))
    .sort((a,b) => b.avgScore - a.avgScore)
    .slice(0,6);

  const engagedVentures = [...ALL_VENTURES]
    .sort((a,b) => b.founderEngagement - a.founderEngagement)
    .slice(0,6)
    .map((v,i) => ({ name: v.name, sector: v.sector, sessions: Math.max(1, filtered.length - i*2), engagement: v.founderEngagement }));

  const genderTrend = [2023,2024,2025,2026].map(yr => {
    const yms = filtered.filter(m => m.year === yr);
    return { Year: String(yr), Female: yms.reduce((s,m) => s+m.femaleAttendees,0), Male: yms.reduce((s,m) => s+(m.attendees-m.femaleAttendees),0) };
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>Masterclasses</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Capacity-building sessions · 2023–2026 · {masterclasses.length} sessions tracked
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-semibold text-white shadow-sm"
                style={{ backgroundColor: RED }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* 6 stat tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                { label: "Total Masterclasses",      value: tot.sessions,                                    sub: "Sessions delivered",     bg: "#EFF6FF", clr: "#1E40AF" },
                { label: "Total Attendees",           value: tot.attendees.toLocaleString(),                  sub: "Across all sessions",    bg: "#F5F3FF", clr: "#4C1D95" },
                { label: "Ventures Represented",      value: tot.ventures.toLocaleString(),                   sub: "Unique ventures",        bg: "#EEF2FF", clr: "#3730A3" },
                { label: "Female-Led Ventures",       value: tot.femaleVent,                                  sub: `${tot.ventures>0?Math.round((tot.femaleVent/tot.ventures)*100):0}% of attending`, bg: "#FAF5FF", clr: "#6B21A8" },
                { label: "Avg Attendance / Session",  value: avgAtt,                                          sub: "Per masterclass",        bg: "#E0F2FE", clr: "#0C4A6E" },
                { label: "Avg Completion Rate",       value: `${tot.completion}%`,                            sub: "Participants completing", bg: "#ECFEFF", clr: "#155E75" },
              ].map((tile) => (
                <div key={tile.label} className="rounded-xl border px-4 py-4"
                  style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}`, borderColor: tile.clr }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-2 leading-tight"
                    style={{ color: "rgba(255,255,255,0.68)" }}>{tile.label}</p>
                  <p className="text-2xl font-bold tabular-nums leading-none text-white">{tile.value}</p>
                  <p className="text-[9px] mt-1.5" style={{ color: "rgba(255,255,255,0.62)" }}>{tile.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
          <div className="flex flex-wrap items-end gap-5">

            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Year</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value as typeof yearFilter)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[120px] shadow-sm">
                <option value="All">All Years</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Topic */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Topic</label>
              <select value={topicFilter} onChange={e => setTopicFilter(e.target.value as typeof topicFilter)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[190px] shadow-sm">
                <option value="All">All Topics</option>
                {MC_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gender</label>
              <select value={genderView} onChange={e => setGenderView(e.target.value as typeof genderView)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[140px] shadow-sm">
                <option value="All">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Active state + clear */}
            <div className="flex items-end gap-3 ml-auto pb-0.5">
              <span className="text-[11px] text-gray-400">
                {filtered.length} of {masterclasses.length} session{masterclasses.length !== 1 ? "s" : ""}
              </span>
              {(yearFilter !== "All" || topicFilter !== "All" || genderView !== "All") && (
                <button
                  onClick={() => { setYearFilter("All"); setTopicFilter("All"); setGenderView("All"); }}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors">
                  Clear filters
                </button>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 1: RATINGS */}
        <section>
          <SecHeader title="Venture Ratings of Masterclasses"
            sub={`${filtered.length} sessions rated across Quality, Usefulness, Accessibility, Relevance`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High · High · Moderate · Low — proportion of sessions per rating level">
              <div className="flex gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
                {(["Very High","High","Moderate","Low"] as const).map(l => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{backgroundColor:RATING_COLORS[l]}} />{l}
                  </span>
                ))}
              </div>
              {RATING_CRITERIA.map(c => <RatingBar key={c} label={c} sessions={filtered} criterion={c} />)}
            </ChartCard>

            <ChartCard title="Ratings by Gender of Attendees"
              sub="Avg score per criterion — female-majority vs male-majority sessions"
              accent={VIOLET_MC}>
              <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="text-violet-600">♀</span> Female-majority sessions</span>
                <span className="flex items-center gap-1"><span className="text-blue-600">♂</span> Male-majority sessions</span>
              </div>
              {RATING_CRITERIA.map(c => (
                <GenderRatingBar key={c} label={c} fSessions={fSessions} mSessions={mSessions} criterion={c} />
              ))}
              <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                {(["Expose","Build","Scale"] as const).map(stage => {
                  const ss = filtered.filter(m =>
                    stage==="Expose" ? m.byStage.Expose > m.byStage.Build+m.byStage.Scale
                    : stage==="Build" ? m.byStage.Build >= m.byStage.Scale
                    : m.byStage.Scale > m.byStage.Build
                  );
                  const avg = ss.length
                    ? RATING_CRITERIA.reduce((s,c) => s + ss.reduce((ss2,m) => ss2+m.scores[c],0)/ss.length,0)/RATING_CRITERIA.length
                    : 0;
                  return (
                    <div key={stage}>
                      <p className="text-[10px] text-gray-400">{stage} Stage</p>
                      <p className="text-sm font-bold" style={{color:NAVY}}>{avg.toFixed(1)}</p>
                      <p className="text-[9px] text-gray-400">avg score</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* SECTION 2: DEMOGRAPHICS */}
        <section>
          <SecHeader title="Participant Demographics"
            sub="Attendance breakdown by gender, age, stage, region, and social inclusion" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants"  value={tot.female}   pct={femalePct}        total={tot.attendees} color="#7c3aed" />
            <ProfileCard label="Male Participants"    value={tot.attendees-tot.female} pct={100-femalePct} total={tot.attendees} color="#1d4ed8" />
            <ProfileCard label="Student Participants" value={tot.students} pct={studentPct}        total={tot.attendees} color="#059669" />
            <ProfileCard label="Alumni Participants"  value={alumniTot}   pct={100-studentPct}    total={tot.attendees} color="#d97706" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ChartCard title="Age Group Distribution" sub="Participants by age bracket">
              <DonutChart data={ageData} category="value" index="name" className="h-36"
                colors={["sky","blue","violet","rose"]} valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Geographic Region" sub="Participants by region of origin">
              <DonutChart data={regionData} category="value" index="name" className="h-36"
                colors={["emerald","teal","blue","violet","rose"]} valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Venture Stage" sub="Attendees by venture development stage">
              <DonutChart data={stageData} category="value" index="name" className="h-36"
                colors={["sky","blue","indigo"]} valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Social Inclusion Groups" sub="MCF scholars, PWD, refugee-displaced">
              <div className="space-y-3 mt-2">
                {socialData.map(d => (
                  <div key={d.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{d.name}</span>
                      <span className="font-medium text-gray-900">{d.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full rounded-full bg-blue-600"
                        style={{width:`${tot.attendees>0?(d.value/tot.attendees)*100:0}%`}} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {tot.attendees>0?Math.round((d.value/tot.attendees)*100):0}% of attendees
                    </p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* SECTION 3: ATTENDANCE TRENDS */}
        <section>
          <SecHeader title="Attendance Trends"
            sub="Session attendance and yearly gender breakdown" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Attendance by Session"
              sub="Attendees per masterclass in chronological order">
              <BarChart data={attendanceTrend.slice(0,12)} index="Session" categories={["Attendees"]}
                colors={["sky"]} className="h-52" valueFormatter={(v:number)=>`${v} attendees`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Attendance by Gender per Year"
              sub="Female vs male participants — yearly comparison"
              accent={VIOLET_MC}>
              <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-violet-500"/>Female</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-sky-500"/>Male</span>
              </div>
              <BarChart data={genderTrend} index="Year" categories={["Female","Male"]}
                colors={["violet","sky"]} className="h-44" valueFormatter={(v:number)=>`${v}`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
          </div>
        </section>

        {/* SECTION 4: GROWTH */}
        <section>
          <SecHeader title="Participation Growth Over Time"
            sub="Cumulative attendees across all masterclass sessions" />
          <ChartCard title="Cumulative Attendee Growth"
            sub="Running total of participants — shows programme reach expansion"
            accent={EMERALD_MC}>
            <AreaChart data={growthData} index="Period" categories={["Cumulative Attendees"]}
              colors={["emerald"]} className="h-52"
              valueFormatter={(v:number)=>`${v} total attendees`}
              showLegend={false} showAnimation={false} />
          </ChartCard>
        </section>

        {/* SECTION 5: TOP PERFORMING + MOST ENGAGED */}
        <section>
          <SecHeader title="Top Performing Masterclasses & Most Engaged Ventures"
            sub="Ranked by attendee feedback and session participation" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Top Performing Masterclasses"
              sub="Ranked by average feedback score across all four rating criteria"
              accent={AMBER_MC}>
              <div className="space-y-3">
                {topSessions.map((m,i) => (
                  <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{backgroundColor:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#d97706":NAVY}}>
                      {i+1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <Stars score={m.avgScore} />
                        <span className="text-[10px] text-gray-400">{m.topic}</span>
                        <span className="text-[10px] text-gray-400">{m.attendees} attendees</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap mt-1.5">
                        {RATING_CRITERIA.map(c => (
                          <span key={c} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{backgroundColor:RATING_COLORS[ratingLabel(m.scores[c])]+"22",color:RATING_COLORS[ratingLabel(m.scores[c])]}}>
                            {c.split(" ")[0]}: {m.scores[c].toFixed(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Most Engaged Ventures"
              sub="Ventures with highest masterclass session participation">
              <div className="space-y-3">
                {engagedVentures.map((v,i) => (
                  <div key={v.name} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{backgroundColor:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#d97706":NAVY}}>
                      {i+1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{v.name}</p>
                      <p className="text-[10px] text-gray-400">{v.sector}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{color:NAVY}}>{v.sessions}</p>
                      <p className="text-[10px] text-gray-400">sessions</p>
                    </div>
                    <div className="w-16">
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full bg-blue-600" style={{width:`${v.engagement}%`}} />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5 text-right">{v.engagement}% eng.</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* SECTION 6: COMPLETION ANALYTICS */}
        <section>
          <SecHeader title="Session Completion Analytics"
            sub="Participation and completion rates across all masterclass sessions" />
          <ChartCard title="Completion Rate by Session"
            sub="Percentage of registered attendees who completed each masterclass"
            accent={EMERALD_MC}>
            <BarChart
              data={[...filtered]
                .sort((a,b) => a.date.localeCompare(b.date))
                .map(m => ({ Session: m.name.length>20?m.name.slice(0,20)+"…":m.name, "Completion %": m.completionRate }))}
              index="Session" categories={["Completion %"]} colors={["emerald"]} className="h-52"
              valueFormatter={(v:number)=>`${v}%`} showLegend={false} showAnimation={false} />
            <div className="mt-3 grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 text-center">
              <div>
                <p className="text-xl font-bold" style={{color:NAVY}}>{tot.completion}%</p>
                <p className="text-[10px] text-gray-400">Avg completion rate</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-600">{filtered.filter(m=>m.completionRate>=90).length}</p>
                <p className="text-[10px] text-gray-400">Sessions ≥90% completion</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-500">{filtered.filter(m=>m.completionRate<80).length}</p>
                <p className="text-[10px] text-gray-400">Sessions &lt;80% completion</p>
              </div>
            </div>
          </ChartCard>
        </section>

        {/* FOOTER */}
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {([
              { value: String(tot.sessions),           label: "Sessions Delivered",   bg: "#EFF6FF", clr: "#1E40AF" },
              { value: tot.attendees.toLocaleString(),  label: "Total Attendees",      bg: "#F5F3FF", clr: "#4C1D95" },
              { value: `${femalePct}%`,                label: "Female Participation", bg: "#FAF5FF", clr: "#6B21A8" },
              { value: `${tot.completion}%`,           label: "Avg Completion Rate",  bg: "#EEF2FF", clr: "#3730A3" },
            ] as const).map(tile => (
              <div key={tile.label} className="px-6 py-6 text-center"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.10) 100%), ${tile.clr}` }}>
                <p className="text-2xl font-black tabular-nums text-white">{tile.value}</p>
                <p className="text-[10px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">HENT · Masterclasses · 2023–2026</p>
            <p className="text-[10px] text-gray-400">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
