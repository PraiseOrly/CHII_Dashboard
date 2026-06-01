"use client";
import { useState } from "react";
import { BarChart, BarList, DonutChart } from "@tremor/react";
import { Download, FileText } from "lucide-react";
import HENTNav from "@/components/HENTNav";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { founders } from "@/data/founders";

// ─── constants ────────────────────────────────────────────────────────────────
const NAVY  = "#002147";
const RED   = "#D4264A";
const BLUE  = "#1d4ed8";
const CYAN  = "#0891b2";

const COHORTS = [2022, 2023, 2024, 2025, 2026] as const;

function fmt$(n: number) {
  return n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${n}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: NAVY }} />
      <div>
        <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{title}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-2.5" style={{ backgroundColor: NAVY }}>
        <p className="text-[11px] font-bold text-white uppercase tracking-widest">{title}</p>
        {sub && <p className="text-[10px] text-blue-200/50 mt-0.5">{sub}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatCard({ label, value, sub, color = NAVY }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="px-5 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
      <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums leading-none">{value}</p>
      {sub && <p className="text-[10px] text-blue-200/30 mt-2">{sub}</p>}
    </div>
  );
}

function RBar({ value, total, color = BLUE }: { value: number; total: number; color?: string }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full mt-2">
      <div className="h-full rounded-full" style={{ width: `${total > 0 ? (value / total) * 100 : 0}%`, backgroundColor: color }} />
    </div>
  );
}

function ProfileCard({ label, value, pct, total, color }: {
  label: string; value: number; pct: number; total: number; color: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-bold mt-1 tabular-nums" style={{ color }}>{pct}%</p>
      <p className="text-xs text-gray-400 mt-0.5">{value.toLocaleString()} of {total.toLocaleString()}</p>
      <RBar value={value} total={total} color={color} />
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function VenturesPage() {
  const [trendTab, setTrendTab] = useState<"jobs" | "capital" | "survival">("jobs");

  // ── stats ──
  const femFounders  = founders.filter(f => f.gender === "Female").length;
  const femPct       = Math.round((femFounders / founders.length) * 100);
  const malePct      = 100 - femPct;
  const alumniCount  = founders.filter(f => f.status === "Alumni").length;
  const studentCount = founders.filter(f => f.status === "Student").length;

  const femaleLed    = ALL_VENTURES.filter(v => v.teamGender === "Female");
  const totalJobs    = ALL_VENTURES.reduce((s, v) => s + v.jobsTotal, 0);
  const avgJobs      = Math.round(totalJobs / ALL_VENTURES.length);
  const revenueCount = ALL_VENTURES.filter(v => v.revenue > 20).length;
  const expansionCt  = ALL_VENTURES.filter(v => v.partnerships >= 5).length;
  const formalCount  = ALL_VENTURES.filter(v => v.stageIndex >= 2).length;
  const informalCount = ALL_VENTURES.length - formalCount;

  // ── ventures per year ──
  const venturesPerYear = COHORTS.map(year => ({
    Year: String(year),
    Ventures: ALL_VENTURES.filter(v => v.cohort === year).length,
  }));

  // ── trend data ──
  const jobsTrend = COHORTS.map(year => {
    const cv = ALL_VENTURES.filter(v => v.cohort === year);
    return {
      Year: String(year),
      "Male-led":   cv.filter(v => v.teamGender === "Male").reduce((s, v)   => s + v.jobsTotal, 0),
      "Female-led": cv.filter(v => v.teamGender === "Female").reduce((s, v) => s + v.jobsTotal, 0),
    };
  });

  const capitalTrend = COHORTS.map(year => {
    const cv = ALL_VENTURES.filter(v => v.cohort === year);
    return {
      Year: String(year),
      "Male-led":   cv.filter(v => v.teamGender === "Male").reduce((s, v)   => s + v.funding, 0),
      "Female-led": cv.filter(v => v.teamGender === "Female").reduce((s, v) => s + v.funding, 0),
    };
  });

  const survivalTrend = COHORTS.map(year => {
    const cv    = ALL_VENTURES.filter(v => v.cohort === year);
    const maleV = cv.filter(v => v.teamGender === "Male");
    const femV  = cv.filter(v => v.teamGender === "Female");
    return {
      Year: String(year),
      "Male-led":   maleV.length > 0 ? Math.round((maleV.filter(v => v.status === "Active").length / maleV.length) * 100) : 0,
      "Female-led": femV.length  > 0 ? Math.round((femV.filter(v => v.status === "Active").length  / femV.length)  * 100) : 0,
    };
  });

  const activeTrendData = trendTab === "jobs" ? jobsTrend : trendTab === "capital" ? capitalTrend : survivalTrend;
  const trendFormatter  = trendTab === "jobs"    ? (v: number) => `${v} jobs`
                        : trendTab === "capital" ? (v: number) => fmt$(v)
                        :                         (v: number) => `${v}%`;

  // ── jobs section ──
  const jobsByGender = [
    { name: "Male-led",   value: ALL_VENTURES.filter(v => v.teamGender === "Male").reduce((s, v)   => s + v.jobsTotal, 0) },
    { name: "Female-led", value: ALL_VENTURES.filter(v => v.teamGender === "Female").reduce((s, v) => s + v.jobsTotal, 0) },
    { name: "Mixed team", value: ALL_VENTURES.filter(v => v.teamGender === "Mixed").reduce((s, v)  => s + v.jobsTotal, 0) },
  ];

  const empTypes = ALL_VENTURES.reduce(
    (acc, v) => {
      const ft  = Math.round(v.jobsTotal * 0.55);
      const pt  = Math.round(v.jobsTotal * 0.25);
      const sea = Math.round(v.jobsTotal * 0.12);
      const unc = v.jobsTotal - ft - pt - sea;
      return { ft: acc.ft + ft, pt: acc.pt + pt, sea: acc.sea + sea, unc: acc.unc + unc };
    },
    { ft: 0, pt: 0, sea: 0, unc: 0 },
  );
  const empTypeData = [
    { name: "Full-time",      value: empTypes.ft  },
    { name: "Part-time",      value: empTypes.pt  },
    { name: "Seasonal",       value: empTypes.sea },
    { name: "Uncategorized",  value: empTypes.unc },
  ];

  // ── student vs alumni ──
  const originData = [
    { name: "Student Founders", value: studentCount },
    { name: "Alumni Founders",  value: alumniCount  },
  ];

  // ─── render ────────────────────────────────────────────────────────────────
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
              <h1 className="text-xl font-bold" style={{ color: NAVY }}>Ventures</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Entrepreneurship data · 2026 Cohort · {ALL_VENTURES.length} ventures tracked
              </p>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button className="flex items-center gap-1.5 text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:border-gray-400 hover:text-gray-800 transition-colors">
                <Download size={11} /> Export Data
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium text-white transition-colors"
                style={{ backgroundColor: RED }}>
                <FileText size={11} /> Custom Report
              </button>
            </div>
          </div>

          {/* Stats tiles — 8 metrics */}
          <div className="pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 rounded-xl overflow-hidden shadow-md border border-gray-100">
              <div className="px-4 py-4" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Entrepreneurs</p>
                <p className="text-2xl font-bold text-white tabular-nums">{founders.length}</p>
                <p className="text-[10px] text-blue-200/30 mt-2">Total founders</p>
              </div>
              <div className="px-4 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Female Founders</p>
                <p className="text-2xl font-bold text-white tabular-nums">{femPct}%</p>
                <p className="text-[10px] text-blue-200/30 mt-2">{femFounders} of {founders.length}</p>
              </div>
              <div className="px-4 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Total Ventures</p>
                <p className="text-2xl font-bold text-white tabular-nums">{ALL_VENTURES.length}</p>
                <p className="text-[10px] text-blue-200/30 mt-2">Across all cohorts</p>
              </div>
              <div className="px-4 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Female-Led</p>
                <p className="text-2xl font-bold text-white tabular-nums">{femaleLed.length}</p>
                <p className="text-[10px] text-blue-200/30 mt-2">{Math.round((femaleLed.length / ALL_VENTURES.length) * 100)}% of portfolio</p>
              </div>
              <div className="px-4 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Avg Jobs / Venture</p>
                <p className="text-2xl font-bold text-white tabular-nums">{avgJobs}</p>
                <p className="text-[10px] text-blue-200/30 mt-2">{totalJobs.toLocaleString()} total jobs</p>
              </div>
              <div className="px-4 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Revenue Growth</p>
                <p className="text-2xl font-bold text-white tabular-nums">{revenueCount}</p>
                <p className="text-[10px] text-blue-200/30 mt-2">Enterprises with revenue</p>
              </div>
              <div className="px-4 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Market Expansion</p>
                <p className="text-2xl font-bold text-white tabular-nums">{expansionCt}</p>
                <p className="text-[10px] text-blue-200/30 mt-2">5+ active partnerships</p>
              </div>
              <div className="px-4 py-4 border-l border-white/10" style={{ backgroundColor: NAVY }}>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-wider mb-2">Alumni Ventures</p>
                <p className="text-2xl font-bold text-white tabular-nums">{alumniCount}</p>
                <p className="text-[10px] text-blue-200/30 mt-2">{Math.round((alumniCount / founders.length) * 100)}% of founders</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">

        {/* ── SECTION 1: FOUNDER PROFILES ──────────────────────────────── */}
        <section>
          <SecHeader title="Founder Profiles" sub={`${founders.length} founders across all cohorts`} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ProfileCard label="Female Founders" value={femFounders} pct={femPct} total={founders.length} color="#7c3aed" />
            <ProfileCard label="Male Founders" value={founders.length - femFounders} pct={malePct} total={founders.length} color={BLUE} />
            <ProfileCard label="Formally Registered" value={formalCount} pct={Math.round((formalCount / ALL_VENTURES.length) * 100)} total={ALL_VENTURES.length} color="#059669" />
            <ProfileCard label="Informal Ventures" value={informalCount} pct={Math.round((informalCount / ALL_VENTURES.length) * 100)} total={ALL_VENTURES.length} color="#d97706" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Gender Composition" sub="Distribution of founders by gender">
              <DonutChart
                data={[
                  { name: "Male Founders",   value: founders.length - femFounders },
                  { name: "Female Founders", value: femFounders },
                ]}
                category="value"
                index="name"
                className="h-44"
                colors={["blue", "violet"]}
                label={`${founders.length}`}
                valueFormatter={(v: number) => `${v} founders`}
                showAnimation={false}
              />
            </ChartCard>

            <ChartCard title="Student vs Alumni Founders" sub="Origin of founders by academic status">
              <DonutChart
                data={originData}
                category="value"
                index="name"
                className="h-44"
                colors={["cyan", "indigo"]}
                label={`${founders.length}`}
                valueFormatter={(v: number) => `${v} founders`}
                showAnimation={false}
              />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: VENTURES PER YEAR ─────────────────────────────── */}
        <section>
          <SecHeader title="Ventures Developed Per Year" sub="Number of new ventures by cohort year" />
          <ChartCard title="Venture Pipeline by Cohort Year" sub="Total ventures launched per year">
            <BarChart
              data={venturesPerYear}
              index="Year"
              categories={["Ventures"]}
              colors={["blue"]}
              className="h-52"
              valueFormatter={(v: number) => `${v} ventures`}
              showLegend={false}
              showAnimation={false}
            />
          </ChartCard>
        </section>

        {/* ── SECTION 3: ENTREPRENEURSHIP TRENDS ───────────────────────── */}
        <section>
          <SecHeader title="Entrepreneurship Trends" sub="Male-led vs female-led comparison by cohort" />

          {/* Tab filters */}
          <div className="flex gap-1 mb-4 bg-white rounded-lg shadow-sm px-1 py-1 w-fit">
            {(["jobs", "capital", "survival"] as const).map(tab => {
              const label = tab === "jobs" ? "Jobs Created" : tab === "capital" ? "Capital Secured" : "Survival Rate";
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
            title={trendTab === "jobs" ? "Jobs Created by Cohort" : trendTab === "capital" ? "Capital Secured by Cohort" : "Active Venture Survival Rate by Cohort"}
            sub="Male-led (blue) vs Female-led (red) · comparison by cohort year"
          >
            <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-blue-600" /> Male-led</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: RED }} /> Female-led</span>
            </div>
            <BarChart
              data={activeTrendData}
              index="Year"
              categories={["Male-led", "Female-led"]}
              colors={["blue", "red"]}
              className="h-52"
              valueFormatter={trendFormatter}
              showLegend={false}
              showAnimation={false}
            />
          </ChartCard>
        </section>

        {/* ── SECTION 4: JOBS ──────────────────────────────────────────── */}
        <section>
          <SecHeader title="Employment Impact" sub={`${totalJobs.toLocaleString()} total jobs across all ventures`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Jobs Created by Gender of Founder" sub="Total jobs attributed to each founder group">
              <BarList
                data={jobsByGender}
                color="blue"
                valueFormatter={(v: number) => `${v.toLocaleString()} jobs`}
                className="text-sm"
              />
            </ChartCard>

            <ChartCard title="Jobs by Employment Type" sub="Breakdown across full-time, part-time, seasonal and uncategorized">
              <DonutChart
                data={empTypeData}
                category="value"
                index="name"
                className="h-52"
                colors={["blue", "cyan", "indigo", "slate"]}
                valueFormatter={(v: number) => `${v.toLocaleString()} jobs`}
                showAnimation={false}
              />
            </ChartCard>

          </div>
        </section>

        {/* ── FOOTER STRIP ──────────────────────────────────────────────── */}
        <div className="rounded-lg overflow-hidden shadow-sm" style={{ backgroundColor: NAVY }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: `${femPct}%`,                               label: "Female Founders" },
              { value: `${formalCount}`,                           label: "Formally Registered Ventures" },
              { value: `${totalJobs.toLocaleString()}`,            label: "Total Jobs Created" },
              { value: `${Math.round((alumniCount / founders.length) * 100)}%`, label: "Alumni-Founded" },
            ].map(tile => (
              <div key={tile.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-bold text-white tabular-nums">{tile.value}</p>
                <p className="text-[11px] text-blue-200/50 mt-1 uppercase tracking-wider">{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">HENT · Ventures · 2026</p>
            <p className="text-[10px] text-blue-200/40">Last updated: 28 May 2026 EAT</p>
          </div>
        </div>

      </div>
    </div>
  );
}
