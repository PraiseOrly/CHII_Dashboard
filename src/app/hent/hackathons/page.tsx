"use client";
import { useState } from "react";
import { BarChart, BarList, DonutChart } from "@tremor/react";
import { Download, FileText } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import { hackathons, PROJECT_CATEGORIES } from "@/data/hackathons";

// ─── constants ────────────────────────────────────────────────────────────────
const NAVY = "#002147";
const RED  = "#D4264A";
const BLUE = "#1d4ed8";

function fmt(n: number) {
  return n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n);
}

// ─── derived totals ───────────────────────────────────────────────────────────
const total = {
  events:       hackathons.length,
  participants: hackathons.reduce((s, h) => s + h.participants,    0),
  female:       hackathons.reduce((s, h) => s + h.femaleCount,     0),
  students:     hackathons.reduce((s, h) => s + h.studentCount,    0),
  projects:     hackathons.reduce((s, h) => s + h.projects,        0),
  winningTeams: hackathons.reduce((s, h) => s + h.winningTeams,    0),
  startups:     hackathons.reduce((s, h) => s + h.startupsCreated, 0),
  partnerships: hackathons.reduce((s, h) => s + h.partnerships,    0),
};
const femalePct  = Math.round((total.female   / total.participants) * 100);
const malePct    = 100 - femalePct;
const studentPct = Math.round((total.students / total.participants) * 100);
const alumniPct  = 100 - studentPct;
const alumniTotal = total.participants - total.students;

// Unique years for per-year charts
const YEARS = Array.from(new Set(hackathons.map(h => h.year))).sort();

// ─── sub-components ───────────────────────────────────────────────────────────
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

function ChartCard({ title, sub, children }: {
  title: string; sub?: string; children: React.ReactNode;
}) {
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

// ─── page ─────────────────────────────────────────────────────────────────────
export default function HackathonsPage() {
  const [trendTab, setTrendTab] = useState<"participants" | "projects" | "winners" | "startups">("participants");

  // ── per-year trend data ──
  const participantsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const fem    = events.reduce((s, h) => s + h.femaleCount,                       0);
    const tot    = events.reduce((s, h) => s + h.participants,                      0);
    return { Year: String(yr), "Female": fem, "Male": tot - fem };
  });

  const projectsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const tot    = events.reduce((s, h) => s + h.participants, 0);
    const femR   = tot > 0 ? events.reduce((s, h) => s + h.femaleCount, 0) / tot : 0;
    const proj   = events.reduce((s, h) => s + h.projects, 0);
    return {
      Year: String(yr),
      "Female-led": Math.round(proj * femR),
      "Male-led":   Math.round(proj * (1 - femR)),
    };
  });

  const winnersTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const femW   = events.reduce((s, h) => s + h.femaleWinnerTeams,             0);
    const totW   = events.reduce((s, h) => s + h.winningTeams,                  0);
    return { Year: String(yr), "Female-led": femW, "Male-led": totW - femW };
  });

  const startupsTrend = YEARS.map(yr => {
    const events = hackathons.filter(h => h.year === yr);
    const femS   = events.reduce((s, h) => s + h.femaleStartups,                0);
    const totS   = events.reduce((s, h) => s + h.startupsCreated,               0);
    return { Year: String(yr), "Female-founded": femS, "Male-founded": totS - femS };
  });

  const trendData = trendTab === "participants" ? participantsTrend
                  : trendTab === "projects"     ? projectsTrend
                  : trendTab === "winners"      ? winnersTrend
                  :                              startupsTrend;

  const trendCategories: [string, string] =
    trendTab === "participants" ? ["Female",       "Male"]
  : trendTab === "startups"    ? ["Female-founded","Male-founded"]
  :                              ["Female-led",    "Male-led"];

  const trendFormatter = (v: number) =>
    trendTab === "participants" ? `${v} participants`
  : trendTab === "projects"    ? `${v} projects`
  : trendTab === "winners"     ? `${v} teams`
  : `${v} startups`;

  // ── hackathons per year ──
  const hackPerYear = YEARS.map(yr => ({
    Year: String(yr),
    Hackathons: hackathons.filter(h => h.year === yr).length,
  }));

  // ── project categories (summed across all hackathons) ──
  const catTotals = PROJECT_CATEGORIES.map(cat => ({
    name: cat,
    value: hackathons.reduce((s, h) => s + h.categories[cat], 0),
  }));

  // ── participation by gender (per-event breakdown as BarList) ──
  const genderBreakdown = [
    { name: "Female Participants", value: total.female },
    { name: "Male Participants",   value: total.participants - total.female },
  ];

  // ─── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <HENTNav />

      {/* ── TITLE + STATS HEADER ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">

          {/* Title row */}
          <div className="flex items-end justify-between py-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>Hackathons</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Innovation events · {YEARS[0]}–{YEARS[YEARS.length - 1]} · {total.events} hackathons tracked
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-semibold text-white transition-colors shadow-sm"
                style={{ backgroundColor: RED }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* Stats tiles — 10 metrics */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 rounded-xl overflow-hidden shadow-md border border-gray-100">
              {[
                { label: "Total Hackathons",    value: total.events,                        sub: `${YEARS[0]}–${YEARS[YEARS.length-1]}` },
                { label: "Participants",         value: fmt(total.participants),              sub: "Across all events"      },
                { label: "Female Participants",  value: `${femalePct}%`,                     sub: `${total.female} people` },
                { label: "Male Participants",    value: `${malePct}%`,                       sub: `${total.participants - total.female} people` },
                { label: "Winning Teams",        value: total.winningTeams,                  sub: "Total prize winners"    },
                { label: "Projects Developed",   value: total.projects,                      sub: "Across all hackathons"  },
                { label: "Student Participants", value: fmt(total.students),                 sub: `${studentPct}% of total` },
                { label: "Alumni Participants",  value: fmt(alumniTotal),                    sub: `${alumniPct}% of total`  },
                { label: "Startups Created",     value: total.startups,                      sub: "Ventures from hacks"    },
                { label: "Partnerships",         value: total.partnerships,                  sub: "Sponsors & partners"    },
              ].map((tile, i) => (
                <div key={tile.label}
                  className={i > 0 ? "px-3 py-4 border-l border-white/10" : "px-3 py-4"}
                  style={{ backgroundColor: NAVY }}>
                  <p className="text-[9px] font-bold text-blue-200/50 uppercase tracking-wider mb-2 leading-tight">
                    {tile.label}
                  </p>
                  <p className="text-xl font-bold text-white tabular-nums leading-none">{tile.value}</p>
                  <p className="text-[9px] text-blue-200/30 mt-1.5">{tile.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* ── SECTION 1: PARTICIPANT PROFILES ──────────────────────────── */}
        <section>
          <SecHeader
            title="Participant Profiles"
            sub={`${total.participants.toLocaleString()} participants across all hackathons`}
          />

          {/* 4 profile cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Participants" value={total.female}
              pct={femalePct} total={total.participants} color="#7c3aed" />
            <ProfileCard label="Male Participants" value={total.participants - total.female}
              pct={malePct} total={total.participants} color={BLUE} />
            <ProfileCard label="Student Participants" value={total.students}
              pct={studentPct} total={total.participants} color="#059669" />
            <ProfileCard label="Alumni Participants" value={alumniTotal}
              pct={alumniPct} total={total.participants} color="#d97706" />
          </div>

          {/* Gender donut + Student vs Alumni donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Gender Composition" sub="Distribution of participants by gender across all events">
              <DonutChart
                data={[
                  { name: "Male Participants",   value: total.participants - total.female },
                  { name: "Female Participants", value: total.female },
                ]}
                category="value" index="name"
                className="h-44"
                colors={["sky", "violet"]}
                label={`${total.participants}`}
                valueFormatter={(v: number) => `${v} participants`}
                showAnimation={false}
              />
            </ChartCard>

            <ChartCard title="Student vs Alumni Participation" sub="Breakdown of participants by academic status">
              <DonutChart
                data={[
                  { name: "Student Participants", value: total.students  },
                  { name: "Alumni Participants",  value: alumniTotal     },
                ]}
                category="value" index="name"
                className="h-44"
                colors={["sky", "rose"]}
                label={`${total.participants}`}
                valueFormatter={(v: number) => `${v} participants`}
                showAnimation={false}
              />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: HACKATHONS PER YEAR ───────────────────────────── */}
        <section>
          <SecHeader title="Hackathons Conducted Per Year" sub="Number of hackathon events held each year" />
          <ChartCard title="Annual Hackathon Frequency" sub="Count of hackathons organised per calendar year">
            <BarChart
              data={hackPerYear}
              index="Year"
              categories={["Hackathons"]}
              colors={["sky"]}
              className="h-48"
              valueFormatter={(v: number) => `${v} event${v !== 1 ? "s" : ""}`}
              showLegend={false}
              showAnimation={false}
            />
          </ChartCard>
        </section>

        {/* ── SECTION 3: HACKATHON TRENDS ──────────────────────────────── */}
        <section>
          <SecHeader
            title="Hackathon Trends"
            sub="Year-on-year trends with male vs female comparison"
          />

          {/* Tab filters */}
          <div className="flex gap-1 mb-4 bg-white rounded-lg shadow-sm px-1 py-1 w-fit">
            {(["participants", "projects", "winners", "startups"] as const).map(tab => {
              const label = tab === "participants" ? "Participants"
                          : tab === "projects"     ? "Projects Developed"
                          : tab === "winners"      ? "Winning Teams"
                          :                          "Startups Created";
              return (
                <button key={tab} onClick={() => setTrendTab(tab)}
                  className="text-xs px-4 py-1.5 rounded font-medium transition-colors"
                  style={trendTab === tab
                    ? { backgroundColor: NAVY, color: "white" }
                    : { color: "#6b7280" }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <ChartCard
            title={
              trendTab === "participants" ? "Participant Growth by Year"
            : trendTab === "projects"    ? "Projects Developed by Year"
            : trendTab === "winners"     ? "Winning Teams by Year"
            :                              "Startups Created from Hackathons by Year"
            }
            sub={`${
              trendTab === "participants" ? "Female vs male participation"
            : trendTab === "projects"    ? "Female-led vs male-led project teams"
            : trendTab === "winners"     ? "Female-led vs male-led winning teams"
            :                              "Female-founded vs male-founded startups"
            } · by year`}
          >
            <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm inline-block bg-sky-500" />
                {trendCategories[1]}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm inline-block bg-violet-500" />
                {trendCategories[0]}
              </span>
            </div>
            <BarChart
              data={trendData}
              index="Year"
              categories={[trendCategories[1], trendCategories[0]]}
              colors={["sky", "violet"]}
              className="h-52"
              valueFormatter={trendFormatter}
              showLegend={false}
              showAnimation={false}
            />
          </ChartCard>
        </section>

        {/* ── SECTION 4: PARTICIPATION & PROJECT CATEGORIES ────────────── */}
        <section>
          <SecHeader
            title="Participation & Project Categories"
            sub={`${total.participants.toLocaleString()} participants · ${total.projects} projects`}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard
              title="Participation by Gender"
              sub="Total female and male participants across all hackathon events"
            >
              <div className="mb-3 text-[11px] text-gray-500">
                Total of {total.participants.toLocaleString()} participants across {total.events} events
              </div>
              <BarList
                data={genderBreakdown}
                color="sky"
                valueFormatter={(v: number) => `${v.toLocaleString()} (${Math.round((v / total.participants) * 100)}%)`}
                className="text-sm"
              />
              <div className="mt-4 space-y-1.5">
                {participantsTrend.map(row => {
                  const tot = row.Female + row.Male;
                  const fPct = tot > 0 ? Math.round((row.Female / tot) * 100) : 0;
                  return (
                    <div key={row.Year} className="flex items-center gap-2 text-[11px]">
                      <span className="w-10 text-gray-500 flex-shrink-0">{row.Year}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden flex">
                        <div style={{ width: `${fPct}%`, backgroundColor: "#8b5cf6" }} title={`Female: ${row.Female}`} />
                        <div style={{ width: `${100 - fPct}%`, backgroundColor: "#0ea5e9" }} title={`Male: ${row.Male}`} />
                      </div>
                      <span className="text-gray-400 w-8 text-right">{tot}</span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block bg-violet-500" /> Female</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block bg-sky-500" /> Male</span>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Projects by Category"
              sub="Distribution of hackathon projects across focus areas"
            >
              <DonutChart
                data={catTotals}
                category="value"
                index="name"
                className="h-52"
                colors={["sky", "emerald", "violet", "amber", "rose"]}
                valueFormatter={(v: number) => `${v} projects`}
                showAnimation={false}
              />
              <div className="mt-3 space-y-1.5">
                {catTotals.sort((a, b) => b.value - a.value).map(cat => (
                  <div key={cat.name} className="flex items-center justify-between text-xs text-gray-600">
                    <span>{cat.name}</span>
                    <span className="font-medium text-gray-900">
                      {cat.value} ({Math.round((cat.value / total.projects) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

          </div>
        </section>

        {/* ── FOOTER STRIP ──────────────────────────────────────────────── */}
        <div className="rounded-lg overflow-hidden shadow-sm" style={{ backgroundColor: NAVY }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: String(total.participants), label: "Total Participants"    },
              { value: `${femalePct}%`,            label: "Female Participation" },
              { value: String(total.startups),     label: "Startups Created"     },
              { value: String(total.partnerships), label: "Partnerships Secured" },
            ].map(tile => (
              <div key={tile.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold text-white tabular-nums">{tile.value}</p>
                <p className="text-[11px] text-blue-200/50 mt-1 uppercase tracking-wider">{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">
              HENT · Hackathons · {YEARS[0]}–{YEARS[YEARS.length - 1]}
            </p>
            <p className="text-[10px] text-blue-200/40">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
