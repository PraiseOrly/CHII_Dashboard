"use client";
import { useState, useMemo } from "react";
import { AreaChart, BarChart, DonutChart, BarList } from "@tremor/react";
import { Download, FileText, Star, Award, Users, Target } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  mentorshipPrograms, MF_CRITERIA, MF_QUAL_AREAS,
  type MFCriterion, type MFQualArea,
} from "@/data/mentorships";

const NAVY = "#002147";
const RED  = "#D4264A";

const RATING_COLORS: Record<string, string> = {
  "Very High": "#10b981", High: "#3b82f6", Moderate: "#f59e0b", Low: "#ef4444",
};

function ratingLabel(s: number): string {
  return s >= 4.5 ? "Very High" : s >= 3.8 ? "High" : s >= 3.0 ? "Moderate" : "Low";
}

function heatBg(s: number): string {
  if (s >= 4.5) return "#10b981";
  if (s >= 4.0) return "#3b82f6";
  if (s >= 3.5) return "#f59e0b";
  return "#ef4444";
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: NAVY }} />
      <div>
        <p className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.1em]">{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-start gap-2.5">
        <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0" style={{ backgroundColor: NAVY }} />
        <div>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em] leading-none">{title}</p>
          {sub && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{sub}</p>}
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

function RatingBar({ label, programs, criterion }: {
  label: string; programs: typeof mentorshipPrograms; criterion: MFCriterion;
}) {
  const vh  = programs.filter(p => p.scores[criterion] >= 4.5).length;
  const hi  = programs.filter(p => p.scores[criterion] >= 3.8 && p.scores[criterion] < 4.5).length;
  const mo  = programs.filter(p => p.scores[criterion] >= 3.0 && p.scores[criterion] < 3.8).length;
  const lo  = programs.filter(p => p.scores[criterion] <  3.0).length;
  const tot = programs.length || 1;
  const avg = programs.length
    ? (programs.reduce((s, p) => s + p.scores[criterion], 0) / programs.length).toFixed(1) : "—";
  return (
    <div className="flex items-center gap-3 mb-3 last:mb-0">
      <div className="w-44 text-[11px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-5 bg-gray-100 rounded-sm overflow-hidden flex">
        <div style={{ width: `${(vh/tot)*100}%`, backgroundColor: RATING_COLORS["Very High"] }} title={`Very High: ${vh}`} />
        <div style={{ width: `${(hi/tot)*100}%`, backgroundColor: RATING_COLORS.High }}         title={`High: ${hi}`} />
        <div style={{ width: `${(mo/tot)*100}%`, backgroundColor: RATING_COLORS.Moderate }}     title={`Moderate: ${mo}`} />
        <div style={{ width: `${(lo/tot)*100}%`, backgroundColor: RATING_COLORS.Low }}          title={`Low: ${lo}`} />
      </div>
      <div className="w-10 text-[11px] text-gray-500 text-right flex-shrink-0 font-medium">{avg}/5</div>
    </div>
  );
}

function GenderRatingBar({ label, fPrograms, mPrograms, criterion }: {
  label: string; fPrograms: typeof mentorshipPrograms; mPrograms: typeof mentorshipPrograms;
  criterion: MFCriterion;
}) {
  const fAvg = fPrograms.length ? fPrograms.reduce((s,p) => s + p.scores[criterion], 0) / fPrograms.length : 0;
  const mAvg = mPrograms.length ? mPrograms.reduce((s,p) => s + p.scores[criterion], 0) / mPrograms.length : 0;
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-40 text-[10px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-violet-600 w-5 font-bold flex-shrink-0">♀</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-violet-500" style={{ width: `${(fAvg/5)*100}%` }} />
          </div>
          <span className="text-[10px] text-gray-500 w-7">{fAvg.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-blue-600 w-5 font-bold flex-shrink-0">♂</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-blue-500" style={{ width: `${(mAvg/5)*100}%` }} />
          </div>
          <span className="text-[10px] text-gray-500 w-7">{mAvg.toFixed(1)}</span>
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

// ── Page ──────────────────────────────────────────────────────────────────────

type YearVal = "All" | "2022" | "2023" | "2024" | "2025" | "2026";
type TypeVal = "All" | "Mentorship" | "Fellowship" | "One-Year Fellowship" | "Advisory";
type GenderVal = "All" | "Female" | "Male";

const QUAL_THEMES: { text: string; area: MFQualArea; threshold: number }[] = [
  { text: "Expert Mentors",     area: "Mentorship Quality",        threshold: 4.3 },
  { text: "Highly Relevant",    area: "Applicability to Ventures", threshold: 4.3 },
  { text: "Well-Structured",    area: "Program Content",           threshold: 4.2 },
  { text: "Practical Approach", area: "Delivery Approach",         threshold: 4.2 },
  { text: "Strong Networks",    area: "Networking Opportunities",  threshold: 4.2 },
  { text: "Clear Guidance",     area: "Mentorship Quality",        threshold: 4.0 },
  { text: "Accessible Format",  area: "Delivery Approach",         threshold: 4.0 },
  { text: "Impactful Content",  area: "Program Content",           threshold: 4.0 },
  { text: "Career-Changing",    area: "Applicability to Ventures", threshold: 3.9 },
  { text: "Inspiring Peers",    area: "Networking Opportunities",  threshold: 3.9 },
  { text: "Good Value",         area: "Delivery Approach",         threshold: 3.9 },
  { text: "Transformative",     area: "Mentorship Quality",        threshold: 3.8 },
];

const YEARS_LIST = [2022, 2023, 2024, 2025, 2026];
const RANK_BG    = ["#f59e0b", "#9ca3af", "#d97706"];

export default function MentorshipPage() {
  const [yearFilter, setYearFilter] = useState<YearVal>("All");
  const [typeFilter, setTypeFilter] = useState<TypeVal>("All");
  const [genderView, setGenderView] = useState<GenderVal>("All");

  const filtered = useMemo(() => mentorshipPrograms.filter(p => {
    if (yearFilter !== "All" && p.year !== Number(yearFilter)) return false;
    if (typeFilter === "Mentorship"         && (p.isFellowship || p.type === "Advisory Program")) return false;
    if (typeFilter === "Fellowship"         && (!p.isFellowship || p.isOneYearFellowship))        return false;
    if (typeFilter === "One-Year Fellowship"&& !p.isOneYearFellowship)                            return false;
    if (typeFilter === "Advisory"           && p.type !== "Advisory Program")                     return false;
    if (genderView === "Female" && p.femaleFellows <= p.fellows / 2) return false;
    if (genderView === "Male"   && p.femaleFellows >  p.fellows / 2) return false;
    return true;
  }), [yearFilter, typeFilter, genderView]);

  // ── aggregates ────────────────────────────────────────────────────────────
  const studentSum = filtered.reduce((s,p) => s + p.studentFellows, 0);
  const tot = {
    programs:    filtered.filter(p => !p.isFellowship).length,
    fellowships: filtered.filter(p => p.isFellowship).length,
    fellows:     filtered.reduce((s,p) => s + p.fellows, 0),
    mentors:     filtered.reduce((s,p) => s + p.mentors, 0),
    ventures:    filtered.reduce((s,p) => s + p.venturesRepresented, 0),
    grad1yr:     filtered.filter(p => p.isOneYearFellowship).reduce((s,p) => s + p.graduateFellows, 0),
    female:      filtered.reduce((s,p) => s + p.femaleFellows, 0),
    completion:  filtered.length
      ? Math.round(filtered.reduce((s,p) => s + p.completionRate, 0) / filtered.length) : 0,
  };
  const femalePct   = tot.fellows ? Math.round((tot.female   / tot.fellows) * 100) : 0;
  const studentPct  = tot.fellows ? Math.round((studentSum   / tot.fellows) * 100) : 0;
  const alumniTotal = tot.fellows - studentSum;
  const mentorRatio = tot.fellows ? (tot.mentors / tot.fellows).toFixed(2) : "—";
  const avgHighSat  = filtered.length
    ? Math.round(filtered.reduce((s,p) => s + p.highSatisfactionPct, 0) / filtered.length) : 0;

  // ── demographics ──────────────────────────────────────────────────────────
  const byAge    = { "18-25":0, "26-35":0, "36-45":0, "46+":0 };
  const byRegion = { "East Africa":0, "West Africa":0, "Southern Africa":0, "North Africa & Horn":0 };
  const byStage  = { Expose:0, Build:0, Scale:0 };
  const bySocial = { "MCF Scholars":0, PWD:0, "Refugee-Displaced":0 };
  filtered.forEach(p => {
    (Object.keys(p.byAge)    as (keyof typeof byAge)[]).forEach(k    => { byAge[k]    += p.byAge[k]; });
    (Object.keys(p.byRegion) as (keyof typeof byRegion)[]).forEach(k => { byRegion[k] += p.byRegion[k]; });
    (Object.keys(p.byStage)  as (keyof typeof byStage)[]).forEach(k  => { byStage[k]  += p.byStage[k]; });
    (Object.keys(p.bySocial) as (keyof typeof bySocial)[]).forEach(k => { bySocial[k] += p.bySocial[k]; });
  });
  const ageData    = Object.entries(byAge).map(([name,value]) => ({name,value}));
  const regionData = Object.entries(byRegion).map(([name,value]) => ({name,value}));
  const stageData  = Object.entries(byStage).map(([name,value]) => ({name,value}));
  const socialData = Object.entries(bySocial).map(([name,value]) => ({name,value}));

  // ── gender splits ─────────────────────────────────────────────────────────
  const fProgs = filtered.filter(p => p.femaleFellows >  p.fellows / 2);
  const mProgs = filtered.filter(p => p.femaleFellows <= p.fellows / 2);

  // ── high-satisfaction by criterion ────────────────────────────────────────
  const highSatData = MF_CRITERIA.map(c => ({
    name: c,
    value: filtered.length
      ? Math.round(filtered.filter(p => p.scores[c] >= 3.8).length / filtered.length * 100)
      : 0,
  }));

  // ── qualitative avg scores ────────────────────────────────────────────────
  const qualAvgData = MF_QUAL_AREAS.map(a => ({
    name: a,
    value: filtered.length
      ? parseFloat((filtered.reduce((s,p) => s + p.qualScores[a], 0) / filtered.length).toFixed(1))
      : 0,
  })).sort((a,b) => b.value - a.value);

  // ── feedback keyword themes ───────────────────────────────────────────────
  const themeData = QUAL_THEMES
    .map(t => ({ text: t.text, count: filtered.filter(p => p.qualScores[t.area] >= t.threshold).length }))
    .filter(t => t.count > 0)
    .sort((a,b) => b.count - a.count);

  // ── participation trend ───────────────────────────────────────────────────
  const attendanceTrend = [...filtered]
    .sort((a,b) => a.date.localeCompare(b.date))
    .map(p => ({
      Program: p.name.length > 22 ? p.name.slice(0,22)+"…" : p.name,
      Fellows: p.fellows,
    }));

  let cum = 0;
  const growthData = [...filtered]
    .sort((a,b) => a.date.localeCompare(b.date))
    .map(p => { cum += p.fellows; return { Period: `${p.year}-${String(p.month).padStart(2,"0")}`, "Cumulative Fellows": cum }; });

  const genderTrend = YEARS_LIST.map(yr => {
    const yp = filtered.filter(p => p.year === yr);
    return { Year: String(yr), Female: yp.reduce((s,p) => s+p.femaleFellows,0), Male: yp.reduce((s,p) => s+(p.fellows-p.femaleFellows),0) };
  });

  const stageTrend = YEARS_LIST.map(yr => {
    const yp = filtered.filter(p => p.year === yr);
    return { Year: String(yr), Expose: yp.reduce((s,p) => s+p.byStage.Expose,0), Build: yp.reduce((s,p) => s+p.byStage.Build,0), Scale: yp.reduce((s,p) => s+p.byStage.Scale,0) };
  });

  // ── top programs ──────────────────────────────────────────────────────────
  const topPrograms = [...filtered]
    .map(p => ({ ...p, avgScore: MF_CRITERIA.reduce((s,c) => s+p.scores[c],0) / MF_CRITERIA.length }))
    .sort((a,b) => b.avgScore - a.avgScore)
    .slice(0, 6);

  // ── testimonials ──────────────────────────────────────────────────────────
  const testimonials = filtered
    .filter(p => p.testimonial)
    .sort((a,b) => b.year - a.year)
    .slice(0, 3);

  // ── heatmap (top 10 programs by avg score) ────────────────────────────────
  const heatmapRows = [...filtered]
    .map(p => ({ ...p, avgScore: MF_CRITERIA.reduce((s,c) => s+p.scores[c],0) / MF_CRITERIA.length }))
    .sort((a,b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  // ── fellowship outcomes ───────────────────────────────────────────────────
  const oneYearProgs = filtered.filter(p => p.isOneYearFellowship);
  const graduateTrend = YEARS_LIST.map(yr => ({
    Year: String(yr),
    Graduates: filtered.filter(p => p.isOneYearFellowship && p.year === yr).reduce((s,p) => s+p.graduateFellows,0),
  }));
  const fellowshipMentorRatio = oneYearProgs.length && oneYearProgs.reduce((s,p) => s+p.fellows,0) > 0
    ? (oneYearProgs.reduce((s,p) => s+p.mentors,0) / oneYearProgs.reduce((s,p) => s+p.fellows,0)).toFixed(2)
    : "—";

  const isFiltered = yearFilter !== "All" || typeFilter !== "All" || genderView !== "All";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>Mentorship &amp; Fellowships</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Capacity-building &amp; fellowship tracks · 2022–2026 · {mentorshipPrograms.length} programmes tracked
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

          {/* 8 stat tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 rounded-xl overflow-hidden shadow-md border border-gray-100">
              {[
                { label: "Mentorship Programs", value: tot.programs,                          sub: "Active cohorts"          },
                { label: "Fellowship Programs",  value: tot.fellowships,                       sub: "Incl. one-year tracks"   },
                { label: "Total Fellows",         value: tot.fellows.toLocaleString(),          sub: "Across all programmes"   },
                { label: "Mentor Engagements",    value: tot.mentors,                           sub: "Mentor slots deployed"   },
                { label: "Ventures Involved",     value: tot.ventures.toLocaleString(),         sub: "Participating ventures"  },
                { label: "1-Yr Fellowship Grads", value: tot.grad1yr,                           sub: "Graduates enrolled"      },
                { label: "Female Fellows",         value: `${femalePct}%`,                      sub: `${tot.female} people`    },
                { label: "Avg Completion Rate",   value: `${tot.completion}%`,                  sub: "Participants completing" },
              ].map((tile, i) => (
                <div key={tile.label}
                  className={i > 0 ? "px-3 py-4 border-l border-white/10" : "px-3 py-4"}
                  style={{ backgroundColor: NAVY }}>
                  <p className="text-[9px] font-bold text-blue-200/50 uppercase tracking-wider mb-2 leading-tight">{tile.label}</p>
                  <p className="text-xl font-bold text-white tabular-nums leading-none">{tile.value}</p>
                  <p className="text-[9px] text-blue-200/30 mt-1.5">{tile.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
          <div className="flex flex-wrap items-end gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Year / Cohort</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value as YearVal)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[130px] shadow-sm">
                <option value="All">All Years</option>
                {(["2022","2023","2024","2025","2026"] as const).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Programme Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as TypeVal)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[200px] shadow-sm">
                <option value="All">All Types</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Fellowship">Fellowship</option>
                <option value="One-Year Fellowship">One-Year Fellowship</option>
                <option value="Advisory">Advisory Program</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gender</label>
              <select value={genderView} onChange={e => setGenderView(e.target.value as GenderVal)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[140px] shadow-sm">
                <option value="All">All Genders</option>
                <option value="Female">Female-majority</option>
                <option value="Male">Male-majority</option>
              </select>
            </div>

            <div className="flex items-end gap-3 ml-auto pb-0.5">
              <span className="text-[11px] text-gray-400">
                {filtered.length} of {mentorshipPrograms.length} programme{mentorshipPrograms.length !== 1 ? "s" : ""}
              </span>
              {isFiltered && (
                <button onClick={() => { setYearFilter("All"); setTypeFilter("All"); setGenderView("All"); }}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors">
                  Clear filters
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ── SECTION 1: VENTURE RATINGS ── */}
        <section>
          <SecHeader title="Venture Ratings of Mentorship &amp; Fellowship Support"
            sub={`${filtered.length} programmes rated across Quality, Usefulness, Accessibility, Relevance`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High · High · Moderate · Low — proportion of programmes per level">
              <div className="flex gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
                {(["Very High","High","Moderate","Low"] as const).map(l => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RATING_COLORS[l] }} />{l}
                  </span>
                ))}
              </div>
              {MF_CRITERIA.map(c => <RatingBar key={c} label={c} programs={filtered} criterion={c} />)}
            </ChartCard>

            <ChartCard title="Ratings by Gender of Participants"
              sub="Avg score per criterion — female-majority vs male-majority programmes">
              <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="text-violet-600">♀</span> Female-majority programmes</span>
                <span className="flex items-center gap-1"><span className="text-blue-600">♂</span> Male-majority programmes</span>
              </div>
              {MF_CRITERIA.map(c => (
                <GenderRatingBar key={c} label={c} fPrograms={fProgs} mPrograms={mProgs} criterion={c} />
              ))}
              <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                {(["Expose","Build","Scale"] as const).map(stage => {
                  const sp = filtered.filter(p =>
                    stage === "Expose" ? p.byStage.Expose > p.byStage.Build + p.byStage.Scale
                    : stage === "Build" ? p.byStage.Build >= p.byStage.Scale
                    : p.byStage.Scale > p.byStage.Build
                  );
                  const avg = sp.length
                    ? MF_CRITERIA.reduce((s,c) => s + sp.reduce((ss,p) => ss+p.scores[c],0)/sp.length,0)/MF_CRITERIA.length
                    : 0;
                  return (
                    <div key={stage}>
                      <p className="text-[10px] text-gray-400">{stage} Stage</p>
                      <p className="text-sm font-bold" style={{ color: NAVY }}>{avg.toFixed(1)}</p>
                      <p className="text-[9px] text-gray-400">avg score</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: FELLOW SATISFACTION ── */}
        <section>
          <SecHeader title="Fellow Satisfaction &amp; Qualitative Feedback"
            sub={`${avgHighSat}% average high/very-high satisfaction across filtered programmes`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="% Rating High or Very High by Criterion"
              sub="Proportion of programmes where criterion avg score ≥ 3.8 (High)">
              <div className="space-y-3">
                {highSatData.map(d => (
                  <div key={d.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">{d.name}</span>
                      <span className="font-bold" style={{ color: NAVY }}>{d.value}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${d.value}%`, backgroundColor: d.value >= 80 ? "#10b981" : d.value >= 60 ? "#3b82f6" : "#f59e0b" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold" style={{ color: NAVY }}>{avgHighSat}%</p>
                  <p className="text-[10px] text-gray-400">Avg high satisfaction</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">{filtered.filter(p=>p.highSatisfactionPct>=85).length}</p>
                  <p className="text-[10px] text-gray-400">Programmes ≥85%</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-500">{filtered.filter(p=>p.highSatisfactionPct<70).length}</p>
                  <p className="text-[10px] text-gray-400">Programmes &lt;70%</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Qualitative Feedback by Area"
              sub="Average programme score across five qualitative feedback dimensions (1–5)">
              <BarList
                data={qualAvgData.map(d => ({ name: d.name, value: d.value }))}
                color="sky"
                valueFormatter={(v: number) => `${v}/5`}
                className="text-sm"
              />
              <div className="mt-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Feedback Themes</p>
                <div className="flex flex-wrap gap-1.5">
                  {themeData.map(t => {
                    const big = t.count >= 12, med = t.count >= 7;
                    return (
                      <span key={t.text}
                        className={`rounded-full border font-medium transition-colors ${big ? "text-xs px-3 py-1.5 border-blue-300 bg-blue-50 text-blue-700" : med ? "text-[11px] px-2.5 py-1 border-blue-200 bg-blue-50/70 text-blue-600" : "text-[10px] px-2 py-0.5 border-gray-200 bg-gray-50 text-gray-500"}`}>
                        {t.text} <span className="opacity-60 ml-0.5">{t.count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: DEMOGRAPHICS ── */}
        <section>
          <SecHeader title="Participant Demographics"
            sub="Attendance breakdown by gender, age, stage, region, and social inclusion" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Fellows"    value={tot.female}               pct={femalePct}      total={tot.fellows} color="#7c3aed" />
            <ProfileCard label="Male Fellows"      value={tot.fellows - tot.female}  pct={100-femalePct}  total={tot.fellows} color="#1d4ed8" />
            <ProfileCard label="Student Fellows"   value={studentSum}               pct={studentPct}     total={tot.fellows} color="#059669" />
            <ProfileCard label="Alumni Fellows"    value={alumniTotal}               pct={100-studentPct} total={tot.fellows} color="#d97706" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ChartCard title="Age Group Distribution" sub="Fellows by age bracket">
              <DonutChart data={ageData} category="value" index="name" className="h-36"
                colors={["sky","blue","violet","rose"]} valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Geographic Region" sub="Fellows by region of origin">
              <DonutChart data={regionData} category="value" index="name" className="h-36"
                colors={["emerald","teal","blue","violet"]} valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Venture Stage" sub="Fellows by venture development stage">
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
                        style={{ width: `${tot.fellows > 0 ? (d.value/tot.fellows)*100 : 0}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {tot.fellows > 0 ? Math.round((d.value/tot.fellows)*100) : 0}% of fellows
                    </p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 4: SATISFACTION HEATMAP ── */}
        <section>
          <SecHeader title="Satisfaction Heatmap"
            sub="Score per criterion across top-rated programmes — colour = rating level" />
          <ChartCard title="Programme × Criterion Satisfaction Matrix"
            sub="Top 10 programmes by avg score · Green ≥4.5 · Blue ≥4.0 · Amber ≥3.5 · Red <3.5">
            {heatmapRows.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No programmes match the current filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-500 font-medium pb-2 pr-4 min-w-[180px]">Programme</th>
                      {MF_CRITERIA.map(c => (
                        <th key={c} className="text-center text-gray-500 font-medium pb-2 px-1 min-w-[90px] leading-tight">{c}</th>
                      ))}
                      <th className="text-center text-gray-500 font-medium pb-2 px-1 min-w-[70px]">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapRows.map(p => (
                      <tr key={p.id} className="border-t border-gray-50">
                        <td className="py-1.5 pr-4 text-gray-700 leading-tight">
                          {p.name.length > 28 ? p.name.slice(0,28)+"…" : p.name}
                          <span className="text-[9px] text-gray-400 ml-1">({p.year})</span>
                        </td>
                        {MF_CRITERIA.map(c => (
                          <td key={c} className="py-1.5 px-1 text-center">
                            <span className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-bold tabular-nums"
                              style={{ backgroundColor: heatBg(p.scores[c]) }}>
                              {p.scores[c].toFixed(1)}
                            </span>
                          </td>
                        ))}
                        <td className="py-1.5 px-1 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-bold tabular-nums"
                            style={{ backgroundColor: NAVY }}>
                            {p.avgScore.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500 flex-wrap">
                  {[["Very High", "#10b981","≥4.5"], ["High","#3b82f6","≥4.0"], ["Moderate","#f59e0b","≥3.5"], ["Low","#ef4444","<3.5"]].map(([l,c,r]) => (
                    <span key={l} className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c }} />
                      {l} ({r})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </section>

        {/* ── SECTION 5: PARTICIPATION TRENDS ── */}
        <section>
          <SecHeader title="Participation &amp; Engagement Trends"
            sub="Fellow counts, gender breakdown, venture-stage distribution, and cumulative growth" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ChartCard title="Fellows per Programme"
              sub="Attendance per programme in chronological order">
              <BarChart data={attendanceTrend.slice(0,14)} index="Program" categories={["Fellows"]}
                colors={["sky"]} className="h-52" valueFormatter={(v:number)=>`${v} fellows`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Participation by Gender per Year"
              sub="Female vs male fellows — yearly comparison">
              <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-violet-500"/>Female</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-sky-500"/>Male</span>
              </div>
              <BarChart data={genderTrend} index="Year" categories={["Female","Male"]}
                colors={["violet","sky"]} className="h-44" valueFormatter={(v:number)=>`${v}`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Venture-Stage Distribution per Year"
              sub="Expose · Build · Scale fellow counts by cohort year">
              <div className="flex gap-4 text-[11px] text-gray-500 mb-3">
                {(["Expose","Build","Scale"] as const).map((l,i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: ["#0ea5e9","#3b82f6","#6366f1"][i] }} />{l}
                  </span>
                ))}
              </div>
              <BarChart data={stageTrend} index="Year" categories={["Expose","Build","Scale"]}
                colors={["sky","blue","indigo"]} className="h-44" valueFormatter={(v:number)=>`${v}`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Cumulative Fellow Growth"
              sub="Running total of fellows — shows programme reach expansion over time">
              <AreaChart data={growthData} index="Period" categories={["Cumulative Fellows"]}
                colors={["emerald"]} className="h-44"
                valueFormatter={(v:number)=>`${v} total fellows`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 6: TOP PROGRAMMES + TESTIMONIALS ── */}
        <section>
          <SecHeader title="Top Rated Programmes &amp; Success Stories"
            sub="Ranked by average fellow feedback — voices from the field" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Top Rated Mentorship &amp; Fellowship Programmes"
              sub="Ranked by average score across all four rating criteria">
              <div className="space-y-3">
                {topPrograms.map((p,i) => (
                  <div key={p.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ backgroundColor: RANK_BG[i] ?? NAVY }}>
                      {i+1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <Stars score={p.avgScore} />
                        <span className="text-[10px] text-gray-400">{p.type}</span>
                        <span className="text-[10px] text-gray-400">{p.fellows} fellows</span>
                        <span className="text-[10px] text-gray-400">{p.year}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap mt-1.5">
                        {MF_CRITERIA.map(c => (
                          <span key={c} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: RATING_COLORS[ratingLabel(p.scores[c])]+"22", color: RATING_COLORS[ratingLabel(p.scores[c])] }}>
                            {c.split(" ")[0]}: {p.scores[c].toFixed(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <div className="space-y-4">
              {testimonials.length > 0
                ? testimonials.map(p => {
                    const t = p.testimonial!;
                    return (
                      <div key={p.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 flex gap-3"
                        style={{ borderLeftColor: NAVY }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                          style={{ backgroundColor: NAVY }}>
                          {t.author.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-600 italic leading-relaxed">"{t.quote}"</p>
                          <div className="mt-2">
                            <p className="text-xs font-bold text-gray-900">{t.author}</p>
                            <p className="text-[10px] text-gray-400">{t.role}{t.venture ? ` · ${t.venture}` : ""}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-medium text-blue-700 bg-blue-100">{p.type}</span>
                            <span className="text-[9px] text-gray-400">{p.year}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <Award size={28} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No testimonials available for the current filter selection.</p>
                    </div>
                  )
              }
            </div>
          </div>
        </section>

        {/* ── SECTION 7: FELLOWSHIP OUTCOMES & IMPACT ── */}
        <section>
          <SecHeader title="Fellowship Outcomes &amp; Impact"
            sub="One-year fellowship graduate participation, mentor ratios, and partnership outcomes" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Graduates in One-Year Fellowship by Year"
              sub="Programme graduates enrolled as fellows in the flagship one-year track">
              <BarChart data={graduateTrend} index="Year" categories={["Graduates"]}
                colors={["emerald"]} className="h-44" valueFormatter={(v:number)=>`${v} graduates`}
                showLegend={false} showAnimation={false} />
              <div className="mt-3 grid grid-cols-4 gap-3 pt-3 border-t border-gray-100 text-center">
                {[
                  { value: String(tot.grad1yr),     color: NAVY,      label: "Total graduates enrolled" },
                  { value: String(oneYearProgs.length), color: "#059669", label: "One-year cohorts" },
                  { value: fellowshipMentorRatio,   color: "#7c3aed", label: "Mentor-to-fellow ratio" },
                  { value: `${oneYearProgs.length > 0 ? Math.round(oneYearProgs.reduce((s,p)=>s+p.completionRate,0)/oneYearProgs.length) : 0}%`, color: "#d97706", label: "1-yr completion rate" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Mentor-to-Fellow Engagement Analytics"
              sub="Mentorship intensity and programme engagement metrics across filtered programmes">
              <div className="space-y-4">
                {[
                  { icon: Users,  label: "Total Mentor Engagements",     value: String(tot.mentors),          sub: "Mentor slots across filtered programmes",        color: NAVY      },
                  { icon: Target, label: "Mentor-to-Fellow Ratio",        value: mentorRatio,                  sub: "Mentors per fellow (lower = more intensive)",    color: "#7c3aed" },
                  { icon: Award,  label: "Avg High Satisfaction",         value: `${avgHighSat}%`,             sub: "Fellows rating quality/usefulness as High+",     color: "#059669" },
                  { icon: Target, label: "Venture Participation",         value: tot.ventures.toLocaleString(), sub: "Ventures represented across programmes",        color: "#0891b2" },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: m.color+"18" }}>
                        <Icon size={16} style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{m.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{m.sub}</p>
                      </div>
                      <p className="text-xl font-bold tabular-nums flex-shrink-0" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 8: COMPLETION ANALYTICS ── */}
        <section>
          <SecHeader title="Participation &amp; Completion Analytics"
            sub="Engagement and completion rates across all mentorship and fellowship programmes" />
          <ChartCard title="Completion Rate by Programme"
            sub="Percentage of enrolled fellows who completed each programme">
            <BarChart
              data={[...filtered].sort((a,b) => a.date.localeCompare(b.date)).map(p => ({
                Programme: p.name.length > 22 ? p.name.slice(0,22)+"…" : p.name,
                "Completion %": p.completionRate,
              }))}
              index="Programme" categories={["Completion %"]}
              colors={["emerald"]} className="h-52"
              valueFormatter={(v:number)=>`${v}%`} showLegend={false} showAnimation={false} />
            <div className="mt-3 grid grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-center">
              {[
                { value: `${tot.completion}%`, color: NAVY,      label: "Avg completion rate"    },
                { value: String(filtered.filter(p=>p.completionRate>=92).length), color:"#10b981", label: "Programmes ≥92%" },
                { value: String(filtered.filter(p=>p.completionRate<85).length),  color:"#f59e0b", label: "Programmes <85%" },
                { value: String(filtered.filter(p=>p.highSatisfactionPct>=85).length), color:"#7c3aed", label: "High satisfaction (≥85%)" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* ── FOOTER ── */}
        <div className="rounded-lg overflow-hidden shadow-sm" style={{ backgroundColor: NAVY }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: String(tot.programs + tot.fellowships), label: "Programmes Delivered"   },
              { value: tot.fellows.toLocaleString(),            label: "Total Fellows"          },
              { value: `${femalePct}%`,                         label: "Female Participation"   },
              { value: `${tot.completion}%`,                    label: "Avg Completion Rate"    },
            ].map(tile => (
              <div key={tile.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold text-white tabular-nums">{tile.value}</p>
                <p className="text-[11px] text-blue-200/50 mt-1 uppercase tracking-wider">{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">
              HENT · Mentorship &amp; Fellowships · 2022–2026
            </p>
            <p className="text-[10px] text-blue-200/40">Last updated: 01 Jun 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
