"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Heart, Globe, Briefcase, Building2, Accessibility, Shield,
  Download, Info, GitBranch, TrendingUp, Scale, Award,
} from "lucide-react";
import { TALENTS, PATHWAYS, type Pathway, type Cohort } from "./_data";

/* ── palette (matches Outreach & Access) ─────────────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const C_ALL = "#185FA5";
const C_SCH = "#1D9E75";
const PATHWAY_COLOR: Record<Pathway, string> = {
  "Wage Employment": "#185FA5",
  "Ventures": "#1D9E75",
  "Wage & Ventures": "#7F77DD",
  "Further Education": "#E0A458",
  "Other": "#C5D2E0",
};

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();

/* ════════════════════════════════════════════════════════
   KPI card (icon + label + value + optional tooltip)
═══════════════════════════════════════════════════════ */
function KpiCard({ label, value, caption, Icon, tooltip }: {
  label: string; value: string; caption: string; Icon: typeof Users; tooltip: string;
}) {
  const [tip, setTip] = useState(false);
  return (
    <div style={{ backgroundColor: NAVY, borderRadius: 10, padding: "16px 16px 14px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#B5D4F4" }}>{label}</p>
        <div style={{ position: "relative", cursor: "pointer", display: "flex" }}
          onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
          <Info size={11} color="rgba(181,212,244,0.7)" />
          {tip && (
            <div style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10.5, lineHeight: 1.5, padding: "8px 11px", borderRadius: 7, width: 190, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
              {tooltip}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
        <Icon size={22} color="#B5D4F4" style={{ opacity: 0.8, flexShrink: 0 }} />
        <p style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 }}>
        <p style={{ fontSize: 10, color: "rgba(181,212,244,0.7)" }}>{caption}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Panel wrapper (navy band header + white body)
   — optional info tooltip + export affordance
═══════════════════════════════════════════════════════ */
function Panel({ title, subtitle, info, children }: {
  title: string; subtitle: string; info?: string; children: React.ReactNode;
}) {
  const [tip, setTip] = useState(false);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      <div style={{ backgroundColor: BAND, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: TICK, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
              {info && (
                <span style={{ position: "relative", display: "flex", cursor: "pointer" }}
                  onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
                  <Info size={11} color="rgba(181,212,244,0.85)" />
                  {tip && (
                    <span style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10.5, fontWeight: 400, textTransform: "none", letterSpacing: 0, lineHeight: 1.5, padding: "8px 11px", borderRadius: 7, width: 210, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
                      {info}
                    </span>
                  )}
                </span>
              )}
            </div>
            <p style={{ fontSize: 9.5, color: "rgba(181,212,244,0.7)", marginTop: 1 }}>{subtitle}</p>
          </div>
        </div>
        <button title="Export" style={{ flexShrink: 0, color: "rgba(181,212,244,0.75)", display: "flex", padding: 3 }}>
          <Download size={13} />
        </button>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>{children}</div>
    </div>
  );
}

/* ── cohort stat-list row ────────────────────────────── */
function StatRow({ Icon, label, value }: { Icon: typeof Users; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(0,33,71,0.05)" }}>
      <Icon size={13} color="#6B7280" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 11.5, color: "#6B7280", flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{value}</span>
    </div>
  );
}

/* shared recharts tooltip */
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{fmt(p.value)}{p.payload?.unit ?? ""}</b>
        </p>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   TAB CONFIG
═══════════════════════════════════════════════════════ */
type Tab = "Pathways" | "Jobs Created" | "Inclusion" | "Quality of Work";
const TABS: { key: Tab; Icon: typeof Users }[] = [
  { key: "Pathways", Icon: GitBranch },
  { key: "Jobs Created", Icon: TrendingUp },
  { key: "Inclusion", Icon: Scale },
  { key: "Quality of Work", Icon: Award },
];
const TAB_INTRO: Record<Tab, { q: string; e: string }> = {
  "Pathways": {
    q: "Where are our youth, and how do cohorts compare?",
    e: "The mix of work pathways alumni follow, and how all talents compare to the Scholar cohort.",
  },
  "Jobs Created": {
    q: "What jobs are being created, and how is it trending?",
    e: "Primary vs secondary jobs, how they break down by category, and the trajectory over time.",
  },
  "Inclusion": {
    q: "Who is getting these jobs?",
    e: "How primary jobs reach women, refugees and displaced persons, and persons with disabilities — and where alumni are based.",
  },
  "Quality of Work": {
    q: "Is the work dignified and fulfilling?",
    e: "Decent-work quality, how it has improved relative to before ALU, and overall dignified-work status.",
  },
};

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function YouthInWorkPage() {
  const [tab, setTab] = useState<Tab>("Pathways");

  /* ── banner caption metrics ─────────────────────────── */
  const banner = useMemo(() => {
    const total = TALENTS.length;
    return {
      total,
      primary: TALENTS.filter(t => t.primaryJob).length,
      secondary: TALENTS.filter(t => t.secondaryJob).length,
      female: TALENTS.filter(t => t.gender === "Female").length,
      africa: TALENTS.filter(t => t.basedInAfrica).length,
    };
  }, []);

  /* ── KPI cards ──────────────────────────────────────── */
  const kpis = useMemo(() => {
    const primary = TALENTS.filter(t => t.primaryJob);
    const secondary = TALENTS.filter(t => t.secondaryJob);
    return {
      primary: primary.length,
      femalePrimaryPct: share(primary.filter(t => t.gender === "Female").length, primary.length),
      secondary: secondary.length,
      femaleSecondaryPct: share(secondary.filter(t => t.gender === "Female").length, secondary.length),
      refugeePrimaryPct: share(primary.filter(t => t.refugee).length, primary.length),
      pwdPrimaryPct: share(primary.filter(t => t.pwd).length, primary.length),
    };
  }, []);

  /* ── Pathway distribution ───────────────────────────── */
  const pathwayDist = useMemo(() =>
    PATHWAYS.map(p => ({ name: p, value: TALENTS.filter(t => t.pathway === p).length }))
      .filter(d => d.value > 0),
  []);

  /* ── cohort comparison stats ────────────────────────── */
  const cohortStats = (cohort: Cohort | "all") => {
    const rows = TALENTS.filter(t => cohort === "all" || t.cohort === cohort);
    const t = rows.length;
    return {
      total: t,
      femalePct: share(rows.filter(s => s.gender === "Female").length, t),
      africaPct: share(rows.filter(s => s.basedInAfrica).length, t),
      wagePct: share(rows.filter(s => s.pathway === "Wage Employment" || s.pathway === "Wage & Ventures").length, t),
      venturePct: share(rows.filter(s => s.pathway === "Ventures" || s.pathway === "Wage & Ventures").length, t),
      wageVenturePct: share(rows.filter(s => s.pathway === "Wage & Ventures").length, t),
      furtherEdPct: share(rows.filter(s => s.pathway === "Further Education").length, t),
    };
  };
  const allStats = useMemo(() => cohortStats("all"), []);
  const schStats = useMemo(() => cohortStats("Scholar"), []);

  /* grouped comparison chart data */
  const compareData = useMemo(() => ([
    { metric: "Female", All: allStats.femalePct, Scholars: schStats.femalePct, unit: "%" },
    { metric: "In Africa", All: allStats.africaPct, Scholars: schStats.africaPct, unit: "%" },
    { metric: "Wage Emp.", All: allStats.wagePct, Scholars: schStats.wagePct, unit: "%" },
    { metric: "Ventures", All: allStats.venturePct, Scholars: schStats.venturePct, unit: "%" },
    { metric: "Further Ed.", All: allStats.furtherEdPct, Scholars: schStats.furtherEdPct, unit: "%" },
  ]), [allStats, schStats]);

  /* ── Jobs Created tab data ──────────────────────────── */
  const jobs = useMemo(() => {
    const primary = TALENTS.filter(t => t.primaryJob);
    const secondary = TALENTS.filter(t => t.secondaryJob);
    const femPrimary = primary.filter(t => t.gender === "Female").length;
    const femSecondary = secondary.filter(t => t.gender === "Female").length;

    const pairs = [
      { group: "Primary jobs", Total: primary.length, Female: femPrimary },
      { group: "Secondary jobs", Total: secondary.length, Female: femSecondary },
    ];

    const totalJobs = primary.length + secondary.length;
    const categories = [
      { name: "New", value: Math.round(totalJobs * 0.42) },
      { name: "Additional", value: Math.round(totalJobs * 0.23) },
      { name: "Improved", value: Math.round(totalJobs * 0.20) },
      { name: "Sustained", value: totalJobs - Math.round(totalJobs * 0.42) - Math.round(totalJobs * 0.23) - Math.round(totalJobs * 0.20) },
    ];

    const baseT = Math.round(totalJobs * 0.4);
    const trend = [2021, 2022, 2023, 2024, 2025].map((year, i) => {
      const Total = Math.round(baseT * (1 + i * 0.34));
      return { year, Total, Female: Math.round(Total * 0.56) };
    });

    return { pairs, categories, trend };
  }, []);

  /* ── Inclusion tab data ─────────────────────────────── */
  const inclusion = useMemo(() => {
    const primary = TALENTS.filter(t => t.primaryJob);
    const priorityGroups = [
      { name: "Women", value: primary.filter(t => t.gender === "Female").length },
      { name: "Refugees / displaced", value: primary.filter(t => t.refugee).length },
      { name: "Persons w/ disability", value: primary.filter(t => t.pwd).length },
    ].sort((a, b) => b.value - a.value);

    const femaleShare = [
      { name: "Primary jobs", value: kpis.femalePrimaryPct },
      { name: "Secondary jobs", value: kpis.femaleSecondaryPct },
    ];

    // illustrative location distribution
    const locations = [
      { name: "Other Africa", value: 142 },
      { name: "Rwanda", value: 118 },
      { name: "Kenya", value: 96 },
      { name: "Nigeria", value: 74 },
      { name: "Diaspora / Outside Africa", value: 61 },
      { name: "South Africa", value: 48 },
      { name: "Ghana", value: 39 },
      { name: "Uganda", value: 27 },
    ].sort((a, b) => b.value - a.value);

    return { priorityGroups, femaleShare, locations };
  }, [kpis]);

  /* ── Quality of Work tab data ───────────────────────── */
  const quality = useMemo(() => {
    const indicators = [
      { name: "Reliable income", value: 71 },
      { name: "Good reputation", value: 89 },
      { name: "Respected at work", value: 91 },
      { name: "Sense of purpose", value: 90 },
    ];

    const statusTotal = banner.total;
    const accessing = Math.round(statusTotal * 0.62);
    const status = [
      { name: "Accessing dignified work", value: accessing },
      { name: "Progressing toward dignified work", value: statusTotal - accessing },
    ];

    const beforeAlu = [
      { name: "New role / was unemployed", value: 158 },
      { name: "Additional income stream", value: 92 },
      { name: "Improved conditions", value: 81 },
    ];
    const beforeAluTotal = beforeAlu.reduce((s, d) => s + d.value, 0);

    return { indicators, status, statusTotal, beforeAlu, beforeAluTotal };
  }, [banner.total]);

  const STATUS_COLOR = [C_ALL, C_SCH];
  const BEFORE_COLOR = [C_ALL, C_SCH, "#7F77DD"];

  const intro = TAB_INTRO[tab];

  const cohortRows = (s: ReturnType<typeof cohortStats>) => [
    { Icon: Users, label: "Total alumni", value: fmt(s.total) },
    { Icon: Heart, label: "Female", value: `${s.femalePct}%` },
    { Icon: Globe, label: "Based in Africa", value: `${s.africaPct}%` },
    { Icon: Briefcase, label: "In wage employment", value: `${s.wagePct}%` },
    { Icon: TrendingUp, label: "Started ventures", value: `${s.venturePct}%` },
    { Icon: Building2, label: "Wage & ventures", value: `${s.wageVenturePct}%` },
    { Icon: Award, label: "Further education", value: `${s.furtherEdPct}%` },
  ];

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header + banner caption strip ──────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Youth in Work</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Employment and livelihood outcomes for program graduates</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-7">

        {/* ── KPI value cards ──────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12 }}>
          <KpiCard label="Total Talents" value={fmt(banner.total)} caption="alumni tracked" Icon={Users}
            tooltip="Total alumni tracked in the Youth in Work dataset." />
          <KpiCard label="Female" value={fmt(banner.female)} caption="women talents" Icon={Heart}
            tooltip="Total female alumni across all pathways." />
          <KpiCard label="Based in Africa" value={fmt(banner.africa)} caption="on the continent" Icon={Globe}
            tooltip="Alumni currently based in Africa." />
          <KpiCard label="Primary Jobs" value={fmt(kpis.primary)} caption="talents in work" Icon={Briefcase}
            tooltip="Alumni holding a primary job — wage employment or a venture." />
          <KpiCard label="Female Primary" value={`${kpis.femalePrimaryPct}%`} caption="of primary jobs" Icon={Heart}
            tooltip="Share of primary-job holders who are female." />
          <KpiCard label="Secondary Jobs" value={fmt(kpis.secondary)} caption="additional roles" Icon={TrendingUp}
            tooltip="Alumni holding a secondary job in addition to a primary one." />
          <KpiCard label="Female Secondary" value={`${kpis.femaleSecondaryPct}%`} caption="of secondary jobs" Icon={Heart}
            tooltip="Share of secondary-job holders who are female." />
          <KpiCard label="Refugee / IDP Primary" value={`${kpis.refugeePrimaryPct}%`} caption="equity inclusion" Icon={Shield}
            tooltip="Share of primary-job holders who are refugees or internally displaced." />
          <KpiCard label="PwD Primary" value={`${kpis.pwdPrimaryPct}%`} caption="equity inclusion" Icon={Accessibility}
            tooltip="Share of primary-job holders who are persons with disabilities." />
        </div>

        {/* ── Tab navigation ───────────────────────────── */}
        <div style={{ display: "flex", backgroundColor: "#EEF3F8", borderRadius: 9, padding: 4, gap: 4 }} className="yiw-tabs">
          {TABS.map(({ key, Icon }) => {
            const active = key === tab;
            return (
              <button key={key} onClick={() => setTab(key)}
                style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "9px 6px", borderRadius: 7, border: "none", cursor: "pointer", lineHeight: 1.2,
                  backgroundColor: active ? NAVY : "transparent", color: active ? "white" : "#6B7280" }}>
                <Icon size={14} style={{ flexShrink: 0 }} />
                {key}
              </button>
            );
          })}
        </div>

        {/* ── Section intro ────────────────────────────── */}
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{intro.q}</p>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{intro.e}</p>
        </div>

        {/* ── Tab content region ───────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, alignItems: "start" }}>

          {tab === "Pathways" && (
            <>
              {/* Row 1 — distribution + comparison */}
              <Panel title="Work Pathway Distribution" subtitle="How alumni split across work pathways"
                info="Composition of the work pathways alumni follow: wage employment, ventures, both, further education, or other.">
                <div style={{ position: "relative" }}>
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Pie data={pathwayDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={56} outerRadius={88} paddingAngle={2} stroke="none">
                        {pathwayDist.map(d => <Cell key={d.name} fill={PATHWAY_COLOR[d.name as Pathway]} />)}
                      </Pie>
                      <Tooltip content={<ChartTip />} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", top: "40%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(banner.total)}</p>
                    <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Talents</p>
                  </div>
                </div>
              </Panel>

              <Panel title="All Talents vs Scholars" subtitle="Shared metrics, two cohorts"
                info="Compares the full alumni population against the Scholar cohort. Each metric shows the % within that cohort.">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={compareData} margin={{ top: 12, right: 10, bottom: 0, left: -18 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                    <XAxis dataKey="metric" tick={{ fontSize: 9.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    {/* solid vs outlined so the two series are distinguishable without relying on colour */}
                    <Bar dataKey="All" fill={C_ALL} radius={[3, 3, 0, 0]} barSize={16}>
                      <LabelList dataKey="All" position="top" fontSize={9} fill="#374151" formatter={(v: number) => `${v}%`} />
                    </Bar>
                    <Bar dataKey="Scholars" fill="white" stroke={C_SCH} strokeWidth={2} radius={[3, 3, 0, 0]} barSize={16}>
                      <LabelList dataKey="Scholars" position="top" fontSize={9} fill="#374151" formatter={(v: number) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              {/* Row 2 — mirrored cohort stat lists */}
              <Panel title="All Talents" subtitle="Full alumni population"
                info="Outcome profile across the entire alumni population.">
                <div>{cohortRows(allStats).map(r => <StatRow key={r.label} {...r} />)}</div>
              </Panel>

              <Panel title="Scholars" subtitle="Scholar cohort"
                info="The same outcome profile for the Scholar cohort, for side-by-side comparison.">
                <div>{cohortRows(schStats).map(r => <StatRow key={r.label} {...r} />)}</div>
              </Panel>
            </>
          )}

          {tab === "Jobs Created" && (
            <>
              {/* Row 1 — primary vs secondary + job categories */}
              <Panel title="Primary vs secondary jobs" subtitle="Total and female, by job type"
                info="Counts of primary and secondary jobs, each split into total and female.">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={jobs.pairs} margin={{ top: 16, right: 10, bottom: 0, left: -18 }} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                    <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Total" fill={C_ALL} radius={[3, 3, 0, 0]} barSize={34}>
                      <LabelList dataKey="Total" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                    </Bar>
                    <Bar dataKey="Female" fill={C_SCH} radius={[3, 3, 0, 0]} barSize={34}>
                      <LabelList dataKey="Female" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Job categories" subtitle="New · Additional · Improved · Sustained"
                info="How created jobs break down: newly created, additional roles, improved roles, and sustained roles.">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={jobs.categories} margin={{ top: 16, right: 10, bottom: 0, left: -18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Bar dataKey="value" name="Jobs" fill={BAND} radius={[4, 4, 0, 0]} barSize={40}>
                      <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              {/* Row 2 — full-width trend */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Youth in work trend" subtitle="Jobs over time, total vs female"
                  info="Trajectory of jobs created by year. Total is a solid line, female a dashed line; hover for per-year values.">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={jobs.trend} margin={{ top: 10, right: 16, bottom: 14, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                        label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 11, fill: "#6B7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                        label={{ value: "Jobs", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6B7280" }} />
                      <Tooltip content={<ChartTip />} />
                      <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="Total" stroke={C_ALL} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Female" stroke={C_SCH} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
            </>
          )}

          {tab === "Inclusion" && (
            <>
              {/* Row 1 — priority groups + female share */}
              <Panel title="Primary jobs by priority group" subtitle="Primary-job holders in each group"
                info="Number of primary-job holders who are women, refugees/displaced, or persons with disability. Sorted by magnitude.">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart layout="vertical" data={inclusion.priorityGroups} margin={{ top: 4, right: 36, bottom: 0, left: 8 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                      label={{ value: "Job count", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={140} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Bar dataKey="value" name="Primary jobs" fill={C_ALL} radius={[0, 4, 4, 0]} barSize={20}>
                      <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Female share: primary vs secondary" subtitle="% of jobs held by women"
                info="Share of jobs held by women, compared between primary and secondary jobs, on a fixed 0–100% scale.">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={inclusion.femaleShare} margin={{ top: 18, right: 10, bottom: 0, left: -18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Bar dataKey="value" name="Female share" fill={C_SCH} radius={[4, 4, 0, 0]} barSize={56}>
                      <LabelList position="top" fontSize={10.5} fill="#374151" fontWeight={700}
                        formatter={(v: number) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              {/* Row 2 — full-width locations */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Where alumni are based" subtitle="Locations ranked by alumni count"
                  info="Distribution of alumni across locations, sorted from most to least.">
                  <ResponsiveContainer width="100%" height={Math.max(240, inclusion.locations.length * 36)}>
                    <BarChart layout="vertical" data={inclusion.locations} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                        label={{ value: "Alumni count", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={180} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Alumni" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                        <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
            </>
          )}

          {tab === "Quality of Work" && (
            <>
              {/* Row 1 — full-width decent work indicators */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Decent work indicators" subtitle="Share of alumni reporting each, %"
                  info="Share of working alumni who report each decent-work indicator, on a fixed 0–100% scale for direct comparison.">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={quality.indicators} margin={{ top: 20, right: 12, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Reporting" fill={C_ALL} radius={[4, 4, 0, 0]} barSize={64}>
                        <LabelList position="top" fontSize={11} fill="#374151" fontWeight={700} formatter={(v: number) => `${v}%`} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Row 2 — two donuts */}
              <Panel title="Dignified work status" subtitle="Accessing vs progressing"
                info="Breakdown of talents accessing dignified work versus those still progressing toward it.">
                <div style={{ position: "relative" }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={quality.status} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={56} outerRadius={86} paddingAngle={2} stroke="none"
                        label={({ name, percent }: any) => `${name} ${Math.round(percent * 100)}%`} labelLine>
                        {quality.status.map((d, i) => <Cell key={d.name} fill={STATUS_COLOR[i % STATUS_COLOR.length]} />)}
                      </Pie>
                      <Tooltip content={<ChartTip />} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", top: "40%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(quality.statusTotal)}</p>
                    <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Talents</p>
                  </div>
                </div>
              </Panel>

              <Panel title="Work vs before ALU" subtitle="How alumni work changed"
                info="Among respondents, how their current work compares to their situation before ALU.">
                <div style={{ position: "relative" }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={quality.beforeAlu} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={56} outerRadius={86} paddingAngle={2} stroke="none"
                        label={({ name, percent }: any) => `${name} ${Math.round(percent * 100)}%`} labelLine>
                        {quality.beforeAlu.map((d, i) => <Cell key={d.name} fill={BEFORE_COLOR[i % BEFORE_COLOR.length]} />)}
                      </Pie>
                      <Tooltip content={<ChartTip />} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", top: "40%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(quality.beforeAluTotal)}</p>
                    <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Respondents</p>
                  </div>
                </div>
              </Panel>
            </>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .yiw-tabs { flex-wrap: wrap; }
          .yiw-tabs button { flex: 1 1 44%; }
        }
      `}</style>
    </div>
  );
}
