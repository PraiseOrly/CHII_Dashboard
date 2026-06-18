"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Heart, Info, Download, Briefcase, Cpu, ShieldCheck,
  ArrowUpRight, ArrowDownRight, LineChart as LineIcon, Layers, Award,
} from "lucide-react";
import {
  WORKERS, GENDERS, EMPLOYMENT_TYPES, ROLE_LEVELS, ARRANGEMENTS, ORG_TYPES,
  TIME_BUCKETS, SALARY_BANDS,
  type Gender,
} from "./_data";

/* ── palette (matches Outreach & Access) ─────────────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";

const GENDER_COLOR: Record<Gender, string> = { Female: "#185FA5", Male: "#1D9E75", Other: "#7F77DD" };
const EMP_COLOR: Record<string, string> = {
  "Full-time": "#185FA5", "Part-time": "#1D9E75", "Temporary": "#E0A458", "Unemployed": "#C5D2E0",
};
const ARR_COLOR: Record<string, string> = { Remote: "#185FA5", "On-site": "#1D9E75", Hybrid: "#7F77DD" };
const ORG_PALETTE = ["#185FA5", "#1D9E75", "#7F77DD", "#E0A458", "#0C447C", "#C5D2E0"];

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

/* ════════════════════════════════════════════════════════
   KPI card (icon + label + value + optional tooltip & trend)
═══════════════════════════════════════════════════════ */
function KpiCard({ label, value, caption, Icon, tooltip, delta }: {
  label: string; value: string; caption: string;
  Icon: typeof Users; tooltip: string; delta?: { v: number; unit: "%" | "pp" };
}) {
  const [tip, setTip] = useState(false);
  const up = (delta?.v ?? 0) >= 0;
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
        {delta && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: 9.5, fontWeight: 700, color: up ? "#5FD3A6" : "#E69AA4" }}>
            {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(delta.v)}{delta.unit}
          </span>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Panel wrapper — optional info + export
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

/* shared recharts tooltip */
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{fmt(p.value)}</b>
        </p>
      ))}
    </div>
  );
}

/* currency tooltip (income series) */
function MoneyTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.stroke, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{usd(p.value)}</b>
        </p>
      ))}
    </div>
  );
}

/* percentage tooltip */
function PctTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{p.value}%</b>
        </p>
      ))}
    </div>
  );
}

/* ── donut with centre total ─────────────────────────── */
function Donut({ data, colors, total, totalLabel, height = 220, labels = false }: {
  data: { name: string; value: number }[];
  colors: Record<string, string> | string[];
  total: number; totalLabel: string; height?: number; labels?: boolean;
}) {
  const colorFor = (name: string, i: number) =>
    Array.isArray(colors) ? colors[i % colors.length] : colors[name];
  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={54} outerRadius={84} paddingAngle={2} stroke="none"
            label={labels ? (({ name, percent }: any) => `${name} ${Math.round(percent * 100)}%`) : undefined} labelLine={labels}>
            {data.map((d, i) => <Cell key={d.name} fill={colorFor(d.name, i)} />)}
          </Pie>
          <Tooltip content={<ChartTip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", top: "38%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(total)}</p>
        <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{totalLabel}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   TAB CONFIG
═══════════════════════════════════════════════════════ */
type Tab = "Employment" | "Trends & Sectors" | "Programs" | "Quality & Impact";
const TABS: { key: Tab; Icon: typeof Users }[] = [
  { key: "Employment", Icon: Briefcase },
  { key: "Trends & Sectors", Icon: LineIcon },
  { key: "Programs", Icon: Layers },
  { key: "Quality & Impact", Icon: Award },
];
const TAB_INTRO: Record<Tab, { q: string; e: string }> = {
  "Employment": {
    q: "Who is employed, and in what kind of work?",
    e: "The shape of alumni employment — gender, contract type, seniority, arrangement, pay, and how fast they got there.",
  },
  "Trends & Sectors": {
    q: "How is wage employment growing, and where?",
    e: "Jobs, placement, and income over time; the sectors hiring alumni, and where employers are based.",
  },
  "Programs": {
    q: "Which programs lead to employment?",
    e: "Employment rates and contract mix by academic program.",
  },
  "Quality & Impact": {
    q: "Is the work dignified, and is it improving lives?",
    e: "Decent-work quality, how roles compare to life before ALU, household impact, and how ALU's support is rated.",
  },
};

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function WageEmploymentPage() {
  const [tab, setTab] = useState<Tab>("Employment");

  const total = WORKERS.length;

  /* ── KPIs ───────────────────────────────────────────── */
  const kpis = useMemo(() => {
    const employed = WORKERS.filter(w => w.employmentType !== "Unemployed");
    const femaleEmployed = employed.filter(w => w.gender === "Female").length;
    return {
      femaleEmployed,
      improvement: employed.length - Math.round(employed.length * 0.88), // illustrative YoY gain
      decentPct: share(WORKERS.filter(w => w.decentWork).length, employed.length),
      techPct: share(employed.filter(w => w.inTech).length, employed.length),
    };
  }, []);

  /* ── distributions ──────────────────────────────────── */
  const genderData = useMemo(() =>
    GENDERS.map(g => ({ name: g, value: WORKERS.filter(w => w.gender === g).length })).filter(d => d.value > 0), []);

  const empTypeData = useMemo(() =>
    EMPLOYMENT_TYPES.map(e => ({ name: e, value: WORKERS.filter(w => w.employmentType === e).length })).filter(d => d.value > 0), []);

  const roleData = useMemo(() =>
    ROLE_LEVELS.map(r => ({ name: r, value: WORKERS.filter(w => w.roleLevel === r).length }))
      .sort((a, b) => b.value - a.value), []);

  const arrData = useMemo(() =>
    ARRANGEMENTS.map(a => ({ name: a, value: WORKERS.filter(w => w.arrangement === a).length })).filter(d => d.value > 0), []);

  const orgData = useMemo(() =>
    ORG_TYPES.map(o => ({ name: o, value: WORKERS.filter(w => w.orgType === o).length })).filter(d => d.value > 0), []);

  const timeData = useMemo(() =>
    TIME_BUCKETS.map(b => ({ name: b, value: WORKERS.filter(w => w.employmentType !== "Unemployed" && w.timeToEmployment === b).length })), []);

  const salaryData = useMemo(() =>
    SALARY_BANDS.map(b => ({
      name: b.label,
      value: WORKERS.filter(w => w.salaryUSD > 0 && w.salaryUSD >= b.min && w.salaryUSD < b.max).length,
    })), []);

  const arrTotal = arrData.reduce((s, d) => s + d.value, 0);
  const orgTotal = orgData.reduce((s, d) => s + d.value, 0);

  /* ── Trends & Sectors tab data ──────────────────────── */
  const trends = useMemo(() => {
    const years = [2021, 2022, 2023, 2024, 2025];
    const employed = WORKERS.filter(w => w.employmentType !== "Unemployed").length;
    const baseT = Math.round(employed * 0.5);

    const yearlyJobs = years.map((year, i) => {
      const Total = Math.round(baseT * (1 + i * 0.3));
      return { year, Total, Female: Math.round(Total * 0.54) };
    });

    const jobTypeEvolution = years.map((year, i) => {
      const grow = 1 + i * 0.28;
      return {
        year,
        "Full-time": Math.round(120 * grow),
        "Part-time": Math.round(40 * grow),
        "Temporary": Math.round(32 * grow),
        "Unemployed": Math.round(28 / (1 + i * 0.22)),
      };
    });

    const placementRate = years.map((year, i) => ({
      year, Total: Math.min(95, 58 + i * 7), Female: Math.min(93, 54 + i * 7),
    }));

    const avgIncome = years.map((year, i) => ({
      year, Total: 520 + i * 120, Female: 480 + i * 110,
    }));

    const topSectors = [
      { name: "Technology", value: 168 },
      { name: "Finance", value: 121 },
      { name: "Consulting", value: 98 },
      { name: "Education", value: 84 },
      { name: "Healthcare", value: 73 },
      { name: "Manufacturing", value: 57 },
      { name: "Retail", value: 44 },
      { name: "Public sector", value: 38 },
    ].sort((a, b) => b.value - a.value);

    const employerGeography = [
      { name: "Kenya", value: 134 },
      { name: "Rwanda", value: 112 },
      { name: "Nigeria", value: 89 },
      { name: "South Africa", value: 71 },
      { name: "Ghana", value: 52 },
      { name: "Other Africa", value: 96 },
      { name: "Diaspora / Outside Africa", value: 64 },
      { name: "Uganda", value: 31 },
    ].sort((a, b) => b.value - a.value);

    return { yearlyJobs, jobTypeEvolution, placementRate, avgIncome, topSectors, employerGeography };
  }, []);

  const EMP_ORDER = ["Full-time", "Part-time", "Temporary", "Unemployed"] as const;
  const C_TOTAL = "#185FA5";
  const C_FEMALE = "#1D9E75";

  /* ── Programs tab data ──────────────────────────────── */
  const programs = useMemo(() => {
    // each program: employment rate + contract mix (sums to 100)
    const list = [
      { name: "BSc Software Eng", rate: 88, ft: 72, pt: 10, tmp: 6, un: 12 },
      { name: "Computer Science", rate: 85, ft: 68, pt: 12, tmp: 8, un: 12 },
      { name: "BSc Entrepreneurial Leadership", rate: 80, ft: 60, pt: 16, tmp: 9, un: 15 },
      { name: "International Business & Trade", rate: 77, ft: 62, pt: 14, tmp: 9, un: 15 },
      { name: "Global Challenges", rate: 72, ft: 55, pt: 18, tmp: 9, un: 18 },
      { name: "BSc Mechatronic Eng", rate: 69, ft: 58, pt: 14, tmp: 10, un: 18 },
    ].sort((a, b) => b.rate - a.rate);

    const rateData = list.map(p => ({ name: p.name, value: p.rate }));
    const typeData = list.map(p => ({
      name: p.name,
      "Full-time": p.ft, "Part-time": p.pt, "Temporary": p.tmp, "Unemployed": p.un,
    }));
    return { rateData, typeData, count: list.length };
  }, []);

  /* ── Quality & Impact tab data ──────────────────────── */
  const quality = useMemo(() => {
    const indicators = [
      { name: "Reliable income", value: 71 },
      { name: "Good reputation", value: 89 },
      { name: "Respected at work", value: 91 },
      { name: "Sense of purpose", value: 90 },
    ];

    const statusTotal = 58669;
    const accessing = Math.round(statusTotal * 0.66);
    const status = [
      { name: "Accessing dignified work", value: accessing },
      { name: "Progressing toward dignified work", value: statusTotal - accessing },
    ];

    const beforeAlu = [
      { name: "New role / was unemployed", value: 142 },
      { name: "Additional income stream", value: 86 },
      { name: "Improved conditions", value: 72 },
    ];
    const beforeAluTotal = beforeAlu.reduce((s, d) => s + d.value, 0);

    const household = [
      { name: "Dependents / financial stability", value: 184 },
      { name: "Family education", value: 156 },
      { name: "Healthcare access", value: 131 },
      { name: "Household well-being", value: 118 },
      { name: "Helped extended family", value: 94 },
    ].sort((a, b) => b.value - a.value);

    const supportAssessed = [
      { name: "Strongly agree", value: 148 },
      { name: "Agree", value: 172 },
      { name: "Neutral", value: 61 },
      { name: "Disagree", value: 24 },
      { name: "Strongly disagree", value: 9 },
    ];

    const helpfulness = [1, 2, 3, 4, 5].map(r => ({
      name: `${r}`,
      value: [6, 14, 48, 168, 178][r - 1],
    }));

    return { indicators, status, statusTotal, beforeAlu, beforeAluTotal, household, supportAssessed, helpfulness };
  }, []);

  const STATUS_COLOR = ["#185FA5", "#1D9E75"];
  const BEFORE_COLOR = ["#185FA5", "#1D9E75", "#7F77DD"];

  const intro = TAB_INTRO[tab];

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Wage Employment</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Formal employment conversions and earnings progression</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-7">

        {/* ── KPI value cards ──────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          <KpiCard label="Female Wage-Employed" value={fmt(kpis.femaleEmployed)} caption="women in work" Icon={Heart}
            tooltip="Number of female alumni currently in wage employment." />
          <KpiCard label="Improvement YoY" value={`+${fmt(kpis.improvement)}`} caption="vs prior year" Icon={ArrowUpRight}
            tooltip="Net change in wage-employed alumni versus the prior year." delta={{ v: 12, unit: "%" }} />
          <KpiCard label="Accessing Decent Work" value={`${kpis.decentPct}%`} caption="of employed" Icon={ShieldCheck}
            tooltip="Share of employed alumni in roles meeting decent-work criteria." delta={{ v: 4, unit: "pp" }} />
          <KpiCard label="In-Tech Roles" value={`${kpis.techPct}%`} caption="of employed" Icon={Cpu}
            tooltip="Share of employed alumni working in technology roles." delta={{ v: 6, unit: "pp" }} />
        </div>

        {/* ── Tab navigation ───────────────────────────── */}
        <div style={{ display: "flex", backgroundColor: "#EEF3F8", borderRadius: 9, padding: 4, gap: 4 }} className="we-tabs">
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

          {tab === "Employment" && (
            <>
              {/* Row 1 — gender + employment type donuts */}
              <Panel title="Gender Breakdown" subtitle="Female · Male · Other"
                info="Distribution of alumni by gender across the wage-employment population.">
                <Donut data={genderData} colors={GENDER_COLOR} total={total} totalLabel="Total" />
              </Panel>

              <Panel title="Employment Type" subtitle="Full-time · Part-time · Temporary · Unemployed"
                info="Contract type split across the same population.">
                <Donut data={empTypeData} colors={EMP_COLOR} total={total} totalLabel="Total" />
              </Panel>

              {/* Row 2 — role level bar + arrangement donut */}
              <Panel title="Role Level" subtitle="Seniority ranked by volume"
                info="Alumni grouped by seniority level, sorted from most to least common.">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart layout="vertical" data={roleData} margin={{ top: 4, right: 28, bottom: 0, left: 8 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={96} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Bar dataKey="value" name="Alumni" fill={BAND} radius={[0, 4, 4, 0]} barSize={16}
                      label={{ position: "right", fontSize: 10, fill: "#374151", fontWeight: 700 }} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Working Arrangement" subtitle="Remote · On-site · Hybrid"
                info="How employed alumni work — remote, on-site, or hybrid.">
                <Donut data={arrData} colors={ARR_COLOR} total={arrTotal} totalLabel="Employed" />
              </Panel>

              {/* Row 3 — org type donut + time to employment bar */}
              <Panel title="Organisation Type" subtitle="Where alumni are employed"
                info="Type of organisation employing alumni — private, public, government, NGO, startup, or multinational.">
                <Donut data={orgData} colors={ORG_PALETTE} total={orgTotal} totalLabel="Employed" />
              </Panel>

              <Panel title="Time to Employment" subtitle="Months from graduation to first job"
                info="How quickly alumni were hired after graduating, in month buckets. Hover a bar for the exact count.">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={timeData} margin={{ top: 8, right: 10, bottom: 0, left: -18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Bar dataKey="value" name="Alumni" fill="#1D9E75" radius={[4, 4, 0, 0]} barSize={26} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              {/* Row 4 — full-width salary histogram */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Monthly Salary Range (USD)" subtitle="Distribution of alumni across pay bands"
                  info="Number of employed alumni in each monthly salary band, ascending from lowest to highest pay.">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={salaryData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Alumni" fill={BAND} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
            </>
          )}

          {tab === "Trends & Sectors" && (
            <>
              {/* Row 1 — yearly wage jobs trend (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Yearly wage jobs trend" subtitle="Total vs female, by year"
                  info="Wage jobs held by year. Total is a solid line, female a dashed line; hover for per-year counts.">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={trends.yearlyJobs} margin={{ top: 10, right: 16, bottom: 14, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                        label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 11, fill: "#6B7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                        label={{ value: "Jobs", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6B7280" }} />
                      <Tooltip content={<ChartTip />} />
                      <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="Total" stroke={C_TOTAL} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Row 2 — job type evolution (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Job type evolution" subtitle="Employment type composition by year"
                  info="Composition of employment types each year — full-time, part-time, temporary, and unemployed.">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={trends.jobTypeEvolution} margin={{ top: 10, right: 12, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                      {EMP_ORDER.map((t, i) => (
                        <Bar key={t} dataKey={t} stackId="e" fill={EMP_COLOR[t]} barSize={48}
                          radius={i === EMP_ORDER.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Row 3 — placement rate + average income */}
              <Panel title="6-month placement rate" subtitle="Total vs female, % placed within 6 months"
                info="Share of graduates placed within six months, by year, on a fixed 0–100% scale.">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trends.placementRate} margin={{ top: 10, right: 16, bottom: 14, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                      label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 11, fill: "#6B7280" }} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="Total" stroke={C_TOTAL} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Average yearly income" subtitle="Total vs female, monthly USD"
                info="Average monthly income by year, in USD. Total is a solid line, female a dashed line.">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trends.avgIncome} margin={{ top: 10, right: 16, bottom: 14, left: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                      label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 11, fill: "#6B7280" }} />
                    <YAxis tickFormatter={usd} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={56} />
                    <Tooltip content={<MoneyTip />} />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="Total" stroke={C_TOTAL} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Female" stroke={C_FEMALE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>

              {/* Row 4 — top sectors (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Top sectors" subtitle="Sectors hiring alumni, ranked"
                  info="Sectors employing alumni, sorted from most to least. Hover a bar for the exact count.">
                  <ResponsiveContainer width="100%" height={Math.max(240, trends.topSectors.length * 34)}>
                    <BarChart layout="vertical" data={trends.topSectors} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                        label={{ value: "Alumni count", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={120} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Alumni" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                        <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Row 5 — employer geography (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Employer geography" subtitle="Where employers are based, ranked"
                  info="Locations where alumni employers are based, sorted from most to least.">
                  <ResponsiveContainer width="100%" height={Math.max(240, trends.employerGeography.length * 34)}>
                    <BarChart layout="vertical" data={trends.employerGeography} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                        label={{ value: "Employer count", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={180} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Employers" fill="#1D9E75" radius={[0, 4, 4, 0]} barSize={18}>
                        <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
            </>
          )}

          {tab === "Programs" && (
            <>
              {/* Panel 1 — employment rate by program (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Employment rate by program" subtitle="Share employed, ranked by program"
                  info="Employment rate for each academic program, sorted from highest to lowest. Hover a bar for the exact rate.">
                  <ResponsiveContainer width="100%" height={Math.max(240, programs.count * 46)}>
                    <BarChart layout="vertical" data={programs.rateData} margin={{ top: 4, right: 44, bottom: 4, left: 8 }}>
                      <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                        label={{ value: "Employment rate", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={190} axisLine={false} tickLine={false} />
                      <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Employment rate" fill={BAND} radius={[0, 4, 4, 0]} barSize={22}>
                        <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} formatter={(v: number) => `${v}%`} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Panel 2 — employment type by program (100% stacked, full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Employment type by program" subtitle="Contract mix per program (100%)"
                  info="Contract-type composition within each program, normalised to 100%. Same program order as above for cross-reference.">
                  <ResponsiveContainer width="100%" height={Math.max(240, programs.count * 46)}>
                    <BarChart layout="vertical" data={programs.typeData} stackOffset="expand" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                      <XAxis type="number" domain={[0, 1]} tickFormatter={(v: number) => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={190} axisLine={false} tickLine={false} />
                      <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      {EMP_ORDER.map((t, i) => (
                        <Bar key={t} dataKey={t} stackId="t" fill={EMP_COLOR[t]} barSize={22}
                          radius={i === EMP_ORDER.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
            </>
          )}

          {tab === "Quality & Impact" && (
            <>
              {/* Row 1 — decent work indicators (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Decent work indicators" subtitle="Share of alumni reporting each, %"
                  info="Share of working alumni who report each decent-work indicator, on a fixed 0–100% scale.">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={quality.indicators} margin={{ top: 20, right: 12, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                      <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Reporting" fill={BAND} radius={[4, 4, 0, 0]} barSize={64}>
                        <LabelList position="top" fontSize={11} fill="#374151" fontWeight={700} formatter={(v: number) => `${v}%`} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Row 2 — two donuts */}
              <Panel title="Dignified work status" subtitle="Accessing vs progressing"
                info="Talents accessing dignified work versus those still progressing toward it.">
                <Donut data={quality.status} colors={STATUS_COLOR} total={quality.statusTotal} totalLabel="Respondents" height={250} labels />
              </Panel>

              <Panel title="Work vs before ALU" subtitle="How alumni work changed"
                info="Among respondents, how their current work compares to their situation before ALU.">
                <Donut data={quality.beforeAlu} colors={BEFORE_COLOR} total={quality.beforeAluTotal} totalLabel="Respondents" height={250} labels />
              </Panel>

              {/* Row 3 — household improvements (full width) */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Panel title="Household improvements" subtitle="Reported impact areas, ranked"
                  info="How wage employment improved alumni households, sorted from most to least reported.">
                  <ResponsiveContainer width="100%" height={Math.max(220, quality.household.length * 40)}>
                    <BarChart layout="vertical" data={quality.household} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                        label={{ value: "Respondents", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={210} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                      <Bar dataKey="value" name="Respondents" fill={BAND} radius={[0, 4, 4, 0]} barSize={20}>
                        <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Row 4 — support assessed + helpfulness */}
              <Panel title="ALU support assessed" subtitle="“ALU's support helped me” — agreement"
                info="How alumni rate the statement that ALU's support helped them reach their current work.">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={quality.supportAssessed} margin={{ top: 16, right: 10, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: "#374151" }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Bar dataKey="value" name="Respondents" fill="#1D9E75" radius={[4, 4, 0, 0]} barSize={40}>
                      <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel title="Support helpfulness (1–5)" subtitle="Rating distribution"
                info="Distribution of alumni ratings of ALU's support on a 1–5 scale.">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={quality.helpfulness} margin={{ top: 16, right: 10, bottom: 14, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} interval={0}
                      label={{ value: "Rating", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                    <Bar dataKey="value" name="Respondents" fill={BAND} radius={[4, 4, 0, 0]} barSize={40}>
                      <LabelList dataKey="value" position="top" fontSize={10} fill="#374151" fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .we-tabs { flex-wrap: wrap; }
          .we-tabs button { flex: 1 1 44%; }
        }
      `}</style>
    </div>
  );
}
