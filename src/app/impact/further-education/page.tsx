"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Heart, Info, Download, GraduationCap, BookOpen, Wallet,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";

/* ── palette (matches the rest of the dashboard) ─────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const PALETTE = ["#185FA5", "#1D9E75", "#7F77DD", "#E0A458", "#0C447C", "#D17A86", "#C5D2E0"];
const GENDER_COLOR: Record<string, string> = { Female: "#185FA5", Male: "#1D9E75", Other: "#7F77DD" };
const C_ACCENT = "#185FA5";

/* ── helpers ─────────────────────────────────────────── */
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
   Panel wrapper (header strip + info tooltip + export)
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
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill || p.stroke, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{fmt(p.value)}{p.payload?.pct ? "%" : ""}</b>
        </p>
      ))}
    </div>
  );
}

/* ── donut with centre total + leader-line labels ────── */
function Donut({ data, colors, total, totalLabel }: {
  data: { name: string; value: number }[];
  colors: Record<string, string> | string[];
  total: number; totalLabel: string;
}) {
  const colorFor = (name: string, i: number) =>
    Array.isArray(colors) ? colors[i % colors.length] : colors[name];
  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={54} outerRadius={84} paddingAngle={2} stroke="none"
            label={({ name, percent }: any) => `${name} ${Math.round(percent * 100)}%`} labelLine>
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
   PAGE — Further Education (single view, no sub-tabs)
═══════════════════════════════════════════════════════ */
const TOTAL = 206;

export default function FurtherEducationPage() {
  const data = useMemo(() => {
    const gender = [
      { name: "Female", value: 122 },
      { name: "Male", value: 78 },
      { name: "Other", value: 6 },
    ];

    const cohortRate = [
      { name: "All Talents", value: 7, pct: true },
      { name: "Scholars", value: 17, pct: true },
    ];

    const qualification = [
      { name: "Bachelor's top-up", value: 38 },
      { name: "Postgraduate diploma", value: 44 },
      { name: "Master's", value: 86 },
      { name: "Doctorate", value: 14 },
      { name: "Professional cert", value: 24 },
    ];

    const field = [
      { name: "Business & Management", value: 58 },
      { name: "Engineering & Tech", value: 49 },
      { name: "Public Health / Policy", value: 38 },
      { name: "Education", value: 27 },
      { name: "Sciences", value: 21 },
      { name: "Arts / Other", value: 13 },
    ].sort((a, b) => b.value - a.value);

    const funding = [
      { name: "Scholarship / funded", value: 126 },
      { name: "Self-funded", value: 48 },
      { name: "Employer", value: 22 },
      { name: "Loan", value: 10 },
    ];

    const destination = [
      { name: "Within Africa", value: 121 },
      { name: "Europe", value: 44 },
      { name: "North America", value: 28 },
      { name: "Asia / Other", value: 13 },
    ].sort((a, b) => b.value - a.value);

    const relevance = [
      { name: "Directly related", value: 118 },
      { name: "Somewhat related", value: 62 },
      { name: "Different field", value: 26 },
    ];

    const trend = [
      { year: 2020, value: 64 },
      { year: 2021, value: 92 },
      { year: 2022, value: 128 },
      { year: 2023, value: 168 },
      { year: 2024, value: 206 },
    ];

    return { gender, cohortRate, qualification, field, funding, destination, relevance, trend };
  }, []);

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Further Education</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>How ALU graduates continue learning beyond their degree</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-7">

        {/* ── KPI value cards ──────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          <KpiCard label="In Further Education" value={fmt(TOTAL)} caption="graduates" Icon={GraduationCap}
            tooltip="Graduates currently enrolled in further education." delta={{ v: 5, unit: "%" }} />
          <KpiCard label="Currently Enrolled" value="113" caption="active students" Icon={BookOpen}
            tooltip="Graduates with an active further-education enrolment this cycle." />
          <KpiCard label="Female Share" value="59%" caption="of cohort" Icon={Heart}
            tooltip="Share of further-education graduates who are female." />
          <KpiCard label="Scholarship / Funded" value="61%" caption="funded share" Icon={Wallet}
            tooltip="Share of further-education graduates on a scholarship or funded place." />
        </div>

        {/* ── Section intro ────────────────────────────── */}
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>How do ALU graduates continue learning?</p>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
            A view of who advances to further study, the qualifications and fields they pursue, how it&apos;s funded, and where they study.
          </p>
        </div>

        {/* ── 2-column content grid ────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, alignItems: "start" }}>

          {/* Row 1 — gender donut + cohort rate */}
          <Panel title="Gender split" subtitle="Female · Male · Other"
            info="Gender distribution of graduates in further education.">
            <Donut data={data.gender} colors={GENDER_COLOR} total={TOTAL} totalLabel="Graduates" />
          </Panel>

          <Panel title="Further education rate: talents vs scholars" subtitle="% advancing to further study"
            info="Share of each cohort that advances to further education, on a percentage scale.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.cohortRate} margin={{ top: 20, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Further education rate" fill={C_ACCENT} radius={[4, 4, 0, 0]} barSize={56}>
                  <LabelList position="top" fontSize={11} fill="#374151" fontWeight={700} formatter={(v: number) => `${v}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* Row 2 — qualification donut + field of study */}
          <Panel title="Qualification level" subtitle="Type of qualification pursued"
            info="Qualification level graduates are pursuing in further education.">
            <Donut data={data.qualification} colors={PALETTE} total={TOTAL} totalLabel="Graduates" />
          </Panel>

          <Panel title="Field of study" subtitle="Disciplines, ranked"
            info="Fields of study graduates pursue, sorted from most to least common.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={data.field} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={150} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Graduates" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* Row 3 — funding donut + study destination */}
          <Panel title="Funding source" subtitle="How further study is paid for"
            info="How graduates fund their further education.">
            <Donut data={data.funding} colors={PALETTE} total={TOTAL} totalLabel="Graduates" />
          </Panel>

          <Panel title="Study destination" subtitle="Where graduates study, ranked"
            info="Regions where graduates pursue further education, sorted from most to least.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={data.destination} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={130} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Graduates" fill={C_ACCENT} radius={[0, 4, 4, 0]} barSize={20}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* Row 4 — relevance donut + enrolment trend */}
          <Panel title="Relevance to ALU degree" subtitle="How further study relates to the degree"
            info="How closely graduates' further study relates to their ALU degree.">
            <Donut data={data.relevance} colors={PALETTE} total={TOTAL} totalLabel="Graduates" />
          </Panel>

          <Panel title="Further education enrolment trend" subtitle="Enrolments by year"
            info="Further-education enrolments over time. Hover a point for the per-year value.">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.trend} margin={{ top: 10, right: 16, bottom: 14, left: 0 }}>
                <defs>
                  <linearGradient id="feFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C_ACCENT} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={C_ACCENT} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false}
                  label={{ value: "Year", position: "insideBottom", offset: -8, fontSize: 10, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                  label={{ value: "Enrolments", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9CA3AF" }} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="value" name="Enrolments" stroke={C_ACCENT} strokeWidth={2.5} fill="url(#feFill)" dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

        </div>
      </div>
    </div>
  );
}
