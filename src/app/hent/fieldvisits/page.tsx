"use client";
import { useState, useMemo } from "react";
import { AreaChart, BarChart, DonutChart, BarList } from "@tremor/react";
import { Download, FileText, Star, MapPin, Camera, Users, Handshake } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import {
  fieldVisits, VISIT_TYPES, FV_CRITERIA, FV_REGIONS,
  type VisitType, type FVRegion,
} from "@/data/fieldVisits";

const NAVY = "#002147";
const RED  = "#D4264A";
const RATING_COLORS: Record<string, string> = {
  "Very High": "#10b981", High: "#3b82f6", Moderate: "#f59e0b", Low: "#ef4444",
};

function ratingLabel(s: number): string {
  return s >= 4.5 ? "Very High" : s >= 3.8 ? "High" : s >= 3.0 ? "Moderate" : "Low";
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

function RatingBar({ label, visits, criterion }: {
  label: string; visits: typeof fieldVisits; criterion: typeof FV_CRITERIA[number];
}) {
  const vh  = visits.filter(v => v.scores[criterion] >= 4.5).length;
  const hi  = visits.filter(v => v.scores[criterion] >= 3.8 && v.scores[criterion] < 4.5).length;
  const mo  = visits.filter(v => v.scores[criterion] >= 3.0 && v.scores[criterion] < 3.8).length;
  const lo  = visits.filter(v => v.scores[criterion] <  3.0).length;
  const tot = visits.length || 1;
  const avg = visits.length
    ? (visits.reduce((s, v) => s + v.scores[criterion], 0) / visits.length).toFixed(1) : "—";
  return (
    <div className="flex items-center gap-3 mb-2.5 last:mb-0">
      <div className="w-44 text-[10px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-4 bg-gray-100 rounded-sm overflow-hidden flex">
        <div style={{ width:`${(vh/tot)*100}%`, backgroundColor: RATING_COLORS["Very High"] }} title={`Very High: ${vh}`} />
        <div style={{ width:`${(hi/tot)*100}%`, backgroundColor: RATING_COLORS.High }}         title={`High: ${hi}`} />
        <div style={{ width:`${(mo/tot)*100}%`, backgroundColor: RATING_COLORS.Moderate }}     title={`Moderate: ${mo}`} />
        <div style={{ width:`${(lo/tot)*100}%`, backgroundColor: RATING_COLORS.Low }}          title={`Low: ${lo}`} />
      </div>
      <div className="w-10 text-[11px] text-gray-500 text-right flex-shrink-0 font-medium">{avg}/5</div>
    </div>
  );
}

function GenderRatingBar({ label, fVisits, mVisits, criterion }: {
  label: string; fVisits: typeof fieldVisits; mVisits: typeof fieldVisits;
  criterion: typeof FV_CRITERIA[number];
}) {
  const fAvg = fVisits.length ? fVisits.reduce((s,v) => s + v.scores[criterion], 0) / fVisits.length : 0;
  const mAvg = mVisits.length ? mVisits.reduce((s,v) => s + v.scores[criterion], 0) / mVisits.length : 0;
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-40 text-[10px] text-gray-600 text-right flex-shrink-0 leading-tight">{label}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-violet-600 w-5 font-bold">F</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-violet-500" style={{ width:`${(fAvg/5)*100}%` }} />
          </div>
          <span className="text-[10px] text-gray-500 w-6">{fAvg.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-blue-600 w-5 font-bold">M</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-blue-500" style={{ width:`${(mAvg/5)*100}%` }} />
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

export default function FieldVisitsPage() {
  const [yearFilter,   setYearFilter]   = useState<"All"|"2022"|"2023"|"2024"|"2025"|"2026">("All");
  const [typeFilter,   setTypeFilter]   = useState<"All"|VisitType>("All");
  const [regionFilter, setRegionFilter] = useState<"All"|FVRegion>("All");
  const [genderView,   setGenderView]   = useState<"All"|"Female"|"Male">("All");

  const filtered = useMemo(() => fieldVisits.filter(v => {
    if (yearFilter   !== "All" && v.year   !== Number(yearFilter)) return false;
    if (typeFilter   !== "All" && v.type   !== typeFilter)         return false;
    if (regionFilter !== "All" && v.region !== regionFilter)       return false;
    if (genderView === "Female" && v.femaleParticipants <= v.participants / 2) return false;
    if (genderView === "Male"   && v.femaleParticipants >  v.participants / 2) return false;
    return true;
  }), [yearFilter, typeFilter, regionFilter, genderView]);

  const tot = {
    visits:       filtered.length,
    participants: filtered.reduce((s,v) => s + v.participants,        0),
    female:       filtered.reduce((s,v) => s + v.femaleParticipants,  0),
    students:     filtered.reduce((s,v) => s + v.studentParticipants, 0),
    ventures:     filtered.reduce((s,v) => s + v.venturesRepresented, 0),
    orgs:         Array.from(new Set(filtered.map(v => v.organization))).length,
    partnerships: filtered.reduce((s,v) => s + v.partnerships,        0),
    completion:   filtered.length
      ? Math.round(filtered.reduce((s,v) => s + v.completionRate, 0) / filtered.length) : 0,
  };
  const avgAtt      = filtered.length ? Math.round(tot.participants / filtered.length) : 0;
  const femalePct   = tot.participants ? Math.round((tot.female   / tot.participants) * 100) : 0;
  const studentPct  = tot.participants ? Math.round((tot.students / tot.participants) * 100) : 0;
  const alumniTotal = tot.participants - tot.students;

  const fVisits = filtered.filter(v => v.femaleParticipants >  v.participants / 2);
  const mVisits = filtered.filter(v => v.femaleParticipants <= v.participants / 2);

  const byAge    = { "18-25":0, "26-35":0, "36-45":0, "46+":0 };
  const byStage  = { Expose:0, Build:0, Scale:0 };
  const bySocial = { "MCF Scholars":0, PWD:0, "Refugee-Displaced":0 };
  filtered.forEach(v => {
    (Object.keys(v.byAge)    as (keyof typeof byAge)[]).forEach(k    => { byAge[k]    += v.byAge[k]; });
    (Object.keys(v.byStage)  as (keyof typeof byStage)[]).forEach(k  => { byStage[k]  += v.byStage[k]; });
    (Object.keys(v.bySocial) as (keyof typeof bySocial)[]).forEach(k => { bySocial[k] += v.bySocial[k]; });
  });
  const ageData   = Object.entries(byAge).map(([name,value]) => ({name,value}));
  const stageData = Object.entries(byStage).map(([name,value]) => ({name,value}));
  const socialData = Object.entries(bySocial).map(([name,value]) => ({name,value}));

  const regionCounts: Record<string,{visits:number;participants:number}> = {};
  filtered.forEach(v => {
    if (!regionCounts[v.region]) regionCounts[v.region] = {visits:0,participants:0};
    regionCounts[v.region].visits++;
    regionCounts[v.region].participants += v.participants;
  });
  const countryCounts: Record<string,number> = {};
  filtered.forEach(v => { countryCounts[v.country] = (countryCounts[v.country]||0) + 1; });
  const countryData = Object.entries(countryCounts)
    .map(([name,value]) => ({name,value})).sort((a,b) => b.value - a.value);

  const typeCount: Record<string,number> = {};
  filtered.forEach(v => { typeCount[v.type] = (typeCount[v.type]||0) + 1; });
  const typeData = Object.entries(typeCount).map(([name,value]) => ({name,value})).sort((a,b) => b.value - a.value);

  const attendanceTrend = [...filtered].sort((a,b) => a.date.localeCompare(b.date))
    .map(v => ({ Visit: v.organization.length>20?v.organization.slice(0,20)+"…":v.organization, Participants: v.participants }));

  let cum = 0;
  const growthData = [...filtered].sort((a,b) => a.date.localeCompare(b.date))
    .map(v => { cum += v.participants; return { Period:`${v.year}-${String(v.month).padStart(2,"0")}`, "Cumulative Participants":cum }; });

  const YEARS = [2022,2023,2024,2025,2026];
  const genderTrend = YEARS.map(yr => {
    const yv = filtered.filter(v => v.year === yr);
    return {
      Year: String(yr),
      Female: yv.reduce((s,v) => s + v.femaleParticipants, 0),
      Male:   yv.reduce((s,v) => s + (v.participants - v.femaleParticipants), 0),
    };
  });

  const topVisits = [...filtered]
    .map(v => ({ ...v, avgScore: FV_CRITERIA.reduce((s,c) => s + v.scores[c], 0) / FV_CRITERIA.length }))
    .sort((a,b) => b.avgScore - a.avgScore).slice(0,6);

  const orgFreq: Record<string,{type:string;count:number;participants:number;avgScore:number;location:string}> = {};
  filtered.forEach(v => {
    const base = v.organization.replace(/ — .*/,"");
    if (!orgFreq[base]) orgFreq[base] = {type:v.type,count:0,participants:0,avgScore:0,location:`${v.city}, ${v.country}`};
    orgFreq[base].count++;
    orgFreq[base].participants += v.participants;
    orgFreq[base].avgScore += FV_CRITERIA.reduce((s,c) => s + v.scores[c], 0) / FV_CRITERIA.length;
  });
  const frequentOrgs = Object.entries(orgFreq)
    .map(([name,d]) => ({name, ...d, avgScore: d.avgScore / d.count}))
    .sort((a,b) => b.count - a.count || b.participants - a.participants).slice(0,6);

  const partnershipsTrend = YEARS.map(yr => ({
    Year: String(yr),
    Partnerships: filtered.filter(v => v.year === yr).reduce((s,v) => s + v.partnerships, 0),
  }));

  const RANK_BG = ["#f59e0b","#9ca3af","#d97706"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <HENTNav />

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>Field Visits</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Industry excursions · 2022–2026 · {fieldVisits.length} visits tracked
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

          {/* 7 stat tiles */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 rounded-xl overflow-hidden shadow-md border border-gray-100">
              {[
                { label:"Total Field Visits",     value:tot.visits,                      sub:"Excursions conducted" },
                { label:"Total Participants",      value:tot.participants.toLocaleString(),sub:"Across all visits"   },
                { label:"Ventures Participating",  value:tot.ventures.toLocaleString(),   sub:"Unique ventures"     },
                { label:"Organisations Visited",   value:tot.orgs,                        sub:"Distinct host sites" },
                { label:"Female Participants",     value:`${femalePct}%`,                 sub:`${tot.female} people`},
                { label:"Avg Attendance / Visit",  value:avgAtt,                          sub:"Per excursion"       },
                { label:"Avg Completion Rate",     value:`${tot.completion}%`,            sub:"Participants completing"},
              ].map((tile,i) => (
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

            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Year</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value as typeof yearFilter)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[120px] shadow-sm">
                <option value="All">All Years</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Visit Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visit Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[190px] shadow-sm">
                <option value="All">All Types</option>
                {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Region */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Region</label>
              <select value={regionFilter} onChange={e => setRegionFilter(e.target.value as typeof regionFilter)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[190px] shadow-sm">
                <option value="All">All Regions</option>
                {FV_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
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
                {filtered.length} of {fieldVisits.length} visit{fieldVisits.length !== 1 ? "s" : ""}
              </span>
              {(yearFilter !== "All" || typeFilter !== "All" || regionFilter !== "All" || genderView !== "All") && (
                <button
                  onClick={() => { setYearFilter("All"); setTypeFilter("All"); setRegionFilter("All"); setGenderView("All"); }}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors">
                  Clear filters
                </button>
              )}
            </div>

          </div>
        </div>

        {/* RATINGS */}
        <section>
          <SecHeader title="Participant Ratings & Feedback"
            sub={`${filtered.length} visits rated across six experience dimensions`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Rating Distribution by Criterion"
              sub="Very High · High · Moderate · Low — proportion of visits per level">
              <div className="flex gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
                {(["Very High","High","Moderate","Low"] as const).map(l => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{backgroundColor:RATING_COLORS[l]}} />{l}
                  </span>
                ))}
              </div>
              {FV_CRITERIA.map(c => <RatingBar key={c} label={c} visits={filtered} criterion={c} />)}
            </ChartCard>

            <ChartCard title="Ratings by Gender of Participants"
              sub="Average score per dimension — female vs male majority visits">
              <div className="flex gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="text-violet-600 font-bold">F</span> Female-majority visits</span>
                <span className="flex items-center gap-1"><span className="text-blue-600 font-bold">M</span> Male-majority visits</span>
              </div>
              {FV_CRITERIA.map(c => (
                <GenderRatingBar key={c} label={c} fVisits={fVisits} mVisits={mVisits} criterion={c} />
              ))}
              <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                {(["Expose","Build","Scale"] as const).map(stage => {
                  const sv = filtered.filter(v =>
                    stage==="Expose" ? v.byStage.Expose > v.byStage.Build + v.byStage.Scale
                    : stage==="Build" ? v.byStage.Build >= v.byStage.Scale
                    : v.byStage.Scale > v.byStage.Build
                  );
                  const avg = sv.length
                    ? FV_CRITERIA.reduce((s,c) => s + sv.reduce((ss,v) => ss+v.scores[c], 0)/sv.length, 0) / FV_CRITERIA.length
                    : 0;
                  return (
                    <div key={stage}>
                      <p className="text-[10px] text-gray-400">{stage}</p>
                      <p className="text-sm font-bold" style={{color:NAVY}}>{avg.toFixed(1)}</p>
                      <p className="text-[9px] text-gray-400">avg score</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* DEMOGRAPHICS */}
        <section>
          <SecHeader title="Participant Demographics"
            sub="Breakdown by gender, age, venture stage, and social inclusion" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants"  value={tot.female}               pct={femalePct}      total={tot.participants} color="#7c3aed" />
            <ProfileCard label="Male Participants"    value={tot.participants-tot.female} pct={100-femalePct} total={tot.participants} color="#1d4ed8" />
            <ProfileCard label="Student Participants" value={tot.students}              pct={studentPct}     total={tot.participants} color="#059669" />
            <ProfileCard label="Alumni Participants"  value={alumniTotal}              pct={100-studentPct} total={tot.participants} color="#d97706" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ChartCard title="Age Group Distribution" sub="Participants by age bracket">
              <DonutChart data={ageData} category="value" index="name" className="h-36"
                colors={["sky","blue","violet","rose"]} valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Venture Stage Representation" sub="Attendees by development stage">
              <DonutChart data={stageData} category="value" index="name" className="h-36"
                colors={["sky","blue","indigo"]} valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Visit Type Breakdown" sub="Organisations by sector category">
              <DonutChart data={typeData} category="value" index="name" className="h-36"
                colors={["sky","emerald","violet","amber","rose","teal","orange"]}
                valueFormatter={(v:number)=>`${v}`} showAnimation={false} />
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
                        style={{width:`${tot.participants>0?(d.value/tot.participants)*100:0}%`}} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {tot.participants>0?Math.round((d.value/tot.participants)*100):0}% of participants
                    </p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* GEOGRAPHIC */}
        <section>
          <SecHeader title="Geographic Reach & Location Insights"
            sub="Countries and regions covered across all field excursions" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Visits by Country" sub="Number of excursions conducted per country">
              <BarList data={countryData} color="sky"
                valueFormatter={(v:number) => `${v} visit${v!==1?"s":""}`} className="text-sm" />
            </ChartCard>
            <ChartCard title="Regional Distribution" sub="Visit count and participant reach by African region">
              <div className="space-y-4">
                {Object.entries(regionCounts).sort((a,b) => b[1].visits - a[1].visits).map(([region,data]) => {
                  const pct = filtered.length > 0 ? Math.round((data.visits/filtered.length)*100) : 0;
                  return (
                    <div key={region}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">{region}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <span className="text-sm font-bold" style={{color:NAVY}}>{data.visits} visit{data.visits!==1?"s":""}</span>
                          <span className="text-xs text-gray-400 ml-2">· {data.participants} participants</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${pct}%`, backgroundColor:NAVY}} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{pct}% of all visits</p>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ATTENDANCE TRENDS */}
        <section>
          <SecHeader title="Attendance & Participation Trends"
            sub="Visit-level attendance and yearly gender breakdown" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Participants per Field Visit"
              sub="Attendance count for each excursion in chronological order">
              <BarChart data={attendanceTrend.slice(0,12)} index="Visit" categories={["Participants"]}
                colors={["sky"]} className="h-52"
                valueFormatter={(v:number) => `${v} participants`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Participation by Gender per Year"
              sub="Female vs male participants across all visits per year">
              <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-violet-500" />Female</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-sky-500" />Male</span>
              </div>
              <BarChart data={genderTrend} index="Year" categories={["Female","Male"]}
                colors={["violet","sky"]} className="h-44"
                valueFormatter={(v:number) => `${v}`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
          </div>
        </section>

        {/* GROWTH */}
        <section>
          <SecHeader title="Participation Growth Over Time"
            sub="Cumulative participants reached through field excursions" />
          <ChartCard title="Cumulative Participant Reach"
            sub="Running total across all visits — shows programme exposure growth">
            <AreaChart data={growthData} index="Period"
              categories={["Cumulative Participants"]} colors={["emerald"]} className="h-52"
              valueFormatter={(v:number) => `${v} participants`}
              showLegend={false} showAnimation={false} />
          </ChartCard>
        </section>

        {/* MOST IMPACTFUL + FREQUENTLY VISITED */}
        <section>
          <SecHeader title="Most Impactful Visits & Frequently Visited Organisations"
            sub="Ranked by participant feedback scores and repeat-visit frequency" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Most Impactful Field Visits"
              sub="Ranked by average participant feedback across all six dimensions">
              <div className="space-y-3">
                {topVisits.map((v,i) => (
                  <div key={v.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{backgroundColor: RANK_BG[i] ?? NAVY}}>{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{v.organization}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <Stars score={v.avgScore} />
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin size={9}/>{v.city}, {v.country}
                        </span>
                        <span className="text-[10px] text-gray-400">{v.participants} participants</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 italic leading-tight">{v.highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Frequently Visited Organisations"
              sub="Host sites visited most often across cohort years">
              <div className="space-y-3">
                {frequentOrgs.map((org,i) => (
                  <div key={org.name} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{backgroundColor: RANK_BG[i] ?? NAVY}}>{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{org.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-blue-100 text-blue-700">{org.type}</span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin size={9}/>{org.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{color:NAVY}}>{org.count}x</p>
                      <p className="text-[10px] text-gray-400">{org.participants} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* PARTNERSHIPS */}
        <section>
          <SecHeader title="Partnerships & Collaborations Established"
            sub={`${tot.partnerships} new partnerships forged through field excursions`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Partnerships Established per Year"
              sub="New organisational relationships formed through visit engagement">
              <BarChart data={partnershipsTrend} index="Year" categories={["Partnerships"]}
                colors={["emerald"]} className="h-44"
                valueFormatter={(v:number) => `${v} partnerships`}
                showLegend={false} showAnimation={false} />
            </ChartCard>
            <ChartCard title="Partnership Outcomes by Visit"
              sub="Visits with highest collaboration results">
              <div className="space-y-2.5">
                {[...filtered].sort((a,b) => b.partnerships - a.partnerships).slice(0,8).map(v => (
                  <div key={v.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Handshake size={12} className="text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700 tabular-nums w-4">{v.partnerships}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gray-800 truncate">{v.organization}</p>
                      <p className="text-[10px] text-gray-400">{v.city} · {v.year}</p>
                    </div>
                    <div className="w-20 flex-shrink-0">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full bg-emerald-500"
                          style={{width:`${(v.partnerships/8)*100}%`}} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* MEDIA HIGHLIGHTS */}
        <section>
          <SecHeader title="Visit Highlights & Field Notes"
            sub="Key takeaways and learning moments from recent excursions" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...filtered].sort((a,b) => b.date.localeCompare(a.date)).slice(0,6).map((v,i) => {
              const bgPalette = ["#002147","#1d4ed8","#0891b2","#059669","#7c3aed","#d97706"];
              const iconList  = [Camera, Users, MapPin, Handshake, Star, Camera];
              const Icon = iconList[i % iconList.length];
              const bg   = bgPalette[i % bgPalette.length];
              return (
                <div key={v.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-20 flex items-center justify-center" style={{backgroundColor:bg+"18"}}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor:bg+"25"}}>
                      <Icon size={22} style={{color:bg}} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-blue-100 text-blue-700">{v.type}</span>
                      <span className="text-[10px] text-gray-400">{v.year}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{v.organization}</p>
                    <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                      <MapPin size={9}/>{v.city}, {v.country}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{v.highlight}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-500">
                        <Users size={9} className="inline mr-1"/>{v.participants} participants
                      </span>
                      <Stars score={FV_CRITERIA.reduce((s,c) => s + v.scores[c], 0) / FV_CRITERIA.length} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPLETION ANALYTICS */}
        <section>
          <SecHeader title="Attendance & Completion Analytics"
            sub="Engagement and completion rates across all field visits" />
          <ChartCard title="Completion Rate by Field Visit"
            sub="Percentage of registered participants completing each excursion">
            <BarChart
              data={[...filtered].sort((a,b) => a.date.localeCompare(b.date)).map(v => ({
                Visit: v.organization.length>18 ? v.organization.slice(0,18)+"…" : v.organization,
                "Completion %": v.completionRate,
              }))}
              index="Visit" categories={["Completion %"]} colors={["emerald"]} className="h-52"
              valueFormatter={(v:number) => `${v}%`} showLegend={false} showAnimation={false} />
            <div className="mt-3 grid grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-center">
              {[
                { value:`${tot.completion}%`, color:NAVY,      label:"Avg completion"      },
                { value:String(filtered.filter(v=>v.completionRate>=95).length), color:"#10b981", label:"Visits ≥95%" },
                { value:String(filtered.filter(v=>v.completionRate<90).length),  color:"#f59e0b", label:"Visits <90%" },
                { value:String(tot.partnerships), color:"#0891b2", label:"Partnerships formed" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold" style={{color:s.color}}>{s.value}</p>
                  <p className="text-[10px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* FOOTER */}
        <div className="rounded-lg overflow-hidden shadow-sm" style={{backgroundColor:NAVY}}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value:String(tot.visits),               label:"Field Visits"            },
              { value:tot.participants.toLocaleString(), label:"Total Participants"      },
              { value:`${femalePct}%`,                  label:"Female Participation"    },
              { value:String(tot.partnerships),          label:"Partnerships Established"},
            ].map(tile => (
              <div key={tile.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold text-white tabular-nums">{tile.value}</p>
                <p className="text-[11px] text-blue-200/50 mt-1 uppercase tracking-wider">{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">
              HENT · Field Visits · 2022–2026
            </p>
            <p className="text-[10px] text-blue-200/40">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
