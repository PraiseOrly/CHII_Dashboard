"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
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
   Panel wrapper — optional SAMPLE badge + info + export
═══════════════════════════════════════════════════════ */
function Panel({ title, subtitle, info, sample, children }: {
  title: string; subtitle: string; info?: string; sample?: boolean; children: React.ReactNode;
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
              {sample && (
                <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.08em", color: "#FCE2A0", backgroundColor: "rgba(252,226,160,0.15)", border: "1px solid rgba(252,226,160,0.35)", borderRadius: 4, padding: "1px 5px" }}>SAMPLE</span>
              )}
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

/* ── donut with centre total ─────────────────────────── */
function Donut({ data, colors, total, totalLabel }: {
  data: { name: string; value: number }[];
  colors: Record<string, string> | string[];
  total: number; totalLabel: string;
}) {
  const colorFor = (name: string, i: number) =>
    Array.isArray(colors) ? colors[i % colors.length] : colors[name];
  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={84} paddingAngle={2} stroke="none">
            {data.map((d, i) => <Cell key={d.name} fill={colorFor(d.name, i)} />)}
          </Pie>
          <Tooltip content={<ChartTip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", top: "40%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(total)}</p>
        <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{totalLabel}</p>
      </div>
    </div>
  );
}

/* ── empty scaffold ──────────────────────────────────── */
function ComingSoon({ note }: { note: string }) {
  return (
    <div style={{ gridColumn: "1 / -1", backgroundColor: "white", borderRadius: 10, border: "1px dashed rgba(0,33,71,0.18)", padding: "44px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Coming soon</p>
      <p style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 6, maxWidth: 460, marginInline: "auto", lineHeight: 1.6 }}>{note}</p>
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
    q: "How is employment changing, and where?",
    e: "Employment trends over time and breakdowns by sector and industry.",
  },
  "Programs": {
    q: "Which programs drive employment outcomes?",
    e: "Per-program employment conversion and outcome comparisons.",
  },
  "Quality & Impact": {
    q: "Is the work decent and well-paid?",
    e: "Decent-work, income, and satisfaction indicators for alumni in wage employment.",
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
              <Panel title="Role Level" subtitle="Seniority ranked by volume" sample
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

              <Panel title="Working Arrangement" subtitle="Remote · On-site · Hybrid" sample
                info="How employed alumni work — remote, on-site, or hybrid.">
                <Donut data={arrData} colors={ARR_COLOR} total={arrTotal} totalLabel="Employed" />
              </Panel>

              {/* Row 3 — org type donut + time to employment bar */}
              <Panel title="Organisation Type" subtitle="Where alumni are employed" sample
                info="Type of organisation employing alumni — private, public, government, NGO, startup, or multinational.">
                <Donut data={orgData} colors={ORG_PALETTE} total={orgTotal} totalLabel="Employed" />
              </Panel>

              <Panel title="Time to Employment" subtitle="Months from graduation to first job" sample
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
                <Panel title="Monthly Salary Range (USD)" subtitle="Distribution of alumni across pay bands" sample
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
            <ComingSoon note="Employment trends over time and sector/industry breakdowns will populate here — conversion over cohort years and the industries alumni enter." />
          )}

          {tab === "Programs" && (
            <ComingSoon note="Per-program employment outcomes will populate here — conversion rates and earnings by program." />
          )}

          {tab === "Quality & Impact" && (
            <ComingSoon note="Decent-work, income, and satisfaction/impact indicators will populate here for alumni in wage employment." />
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
