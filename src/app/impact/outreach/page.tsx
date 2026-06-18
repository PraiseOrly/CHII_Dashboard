"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Users, Heart, Shield, Building2, GraduationCap, Accessibility,
  Download, Info, ArrowUpRight, ArrowDownRight, SlidersHorizontal, X,
} from "lucide-react";
import {
  OUTREACH_STUDENTS, CAMPUSES, PROGRAMS_ACTIVE, PROGRAMS_TEACHOUT,
  GENDERS, STATUSES, TREND_YEARS,
  type OutreachStudent, type Segment, type Gender,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";

/* ── palette ─────────────────────────────────────────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const C_FEMALE = "#185FA5";
const C_MALE = "#1D9E75";
const C_NB = "#7F77DD";
const C_GRAD = "#1D9E75";
const C_NOTGRAD = "#C5D2E0";
const C_ANNUAL = "#185FA5";
const C_INYEAR = "#1D9E75";
const GENDER_COLOR: Record<Gender, string> = { Female: C_FEMALE, Male: C_MALE, "Non-binary": C_NB };

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();

type SegTab = "All Students" | "Scholars" | "Fee-Paying Students";

function scopeBy(students: OutreachStudent[], campus: string, seg: SegTab): OutreachStudent[] {
  return students.filter(s => {
    if (campus !== "all" && s.campus !== campus) return false;
    if (seg === "Scholars" && s.segment !== "Scholar") return false;
    if (seg === "Fee-Paying Students" && s.segment !== "Fee-Paying") return false;
    return true;
  });
}

/* ════════════════════════════════════════════════════════
   KPI card
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
   Panel wrapper (navy band header + white body)
═══════════════════════════════════════════════════════ */
function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      <div style={{ backgroundColor: BAND, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: TICK, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
            <p style={{ fontSize: 9.5, color: "rgba(181,212,244,0.7)", marginTop: 1 }}>{subtitle}</p>
          </div>
        </div>
        <button title="Download" style={{ flexShrink: 0, color: "rgba(181,212,244,0.75)", display: "flex", padding: 3 }}>
          <Download size={13} />
        </button>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>{children}</div>
    </div>
  );
}

/* ── segment summary card ────────────────────────────── */
function StatRow({ Icon, label, value }: { Icon: typeof Users; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
      <Icon size={13} color="#6B7280" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: "#6B7280", flex: 1 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{value}</span>
    </div>
  );
}

function SegmentCard({ title, rows, pills }: {
  title: string;
  rows: { Icon: typeof Users; label: string; value: string }[];
  pills?: { label: string; value: number }[];
}) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 9, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#EEF3F8", padding: "8px 14px", borderBottom: "1px solid rgba(0,33,71,0.06)" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.03em" }}>{title}</p>
      </div>
      <div style={{ padding: "8px 14px 12px" }}>
        {rows.map(r => <StatRow key={r.label} {...r} />)}
        {pills && (
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {pills.map(p => (
              <span key={p.label} style={{ fontSize: 9.5, fontWeight: 600, color: BAND, backgroundColor: "rgba(12,68,124,0.08)", borderRadius: 6, padding: "3px 8px" }}>
                {p.label}: <b>{p.value}</b>
              </span>
            ))}
          </div>
        )}
      </div>
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

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function OutreachPage() {
  const [campus, setCampus] = useState<string>("all");
  const [tab, setTab] = useState<SegTab>("All Students");

  const scope = useMemo(() => scopeBy(OUTREACH_STUDENTS, campus, tab), [campus, tab]);
  // campus-only scope for the three comparison cards
  const campusScope = useMemo(() => scopeBy(OUTREACH_STUDENTS, campus, "All Students"), [campus]);

  /* KPIs */
  const kpis = useMemo(() => {
    const total = scope.length;
    const female = scope.filter(s => s.gender === "Female").length;
    const refugee = scope.filter(s => s.refugee).length;
    const grad = scope.filter(s => s.status === "Graduated").length;
    const campusCount = campus === "all" ? CAMPUSES.length : 1;

    // deltas: latest enrolled cohort (2024) vs prior (2023)
    const cy = scope.filter(s => s.yearEnrolled === 2024);
    const py = scope.filter(s => s.yearEnrolled === 2023);
    const totalDelta = py.length ? Math.round(((cy.length - py.length) / py.length) * 100) : 0;
    const femDelta = share(cy.filter(s => s.gender === "Female").length, cy.length) - share(py.filter(s => s.gender === "Female").length, py.length);
    const refDelta = share(cy.filter(s => s.refugee).length, cy.length) - share(py.filter(s => s.refugee).length, py.length);

    return {
      total, femalePct: share(female, total), refugeePct: share(refugee, total),
      campusCount, gradRate: share(grad, total),
      totalDelta, femDelta, refDelta,
    };
  }, [scope, campus]);

  /* trends */
  const enrollTrend = useMemo(() => TREND_YEARS.map(y => ({
    year: y,
    Annual: scope.filter(s => s.yearEnrolled <= y).length,
    "In-Year": scope.filter(s => s.yearEnrolled === y).length,
  })), [scope]);

  const gradTrend = useMemo(() => TREND_YEARS.map(y => ({
    year: y,
    Annual: scope.filter(s => s.yearGraduated != null && s.yearGraduated <= y).length,
    "In-Year": scope.filter(s => s.yearGraduated === y).length,
  })), [scope]);

  /* status funnel */
  const statusData = useMemo(() =>
    STATUSES.map(st => ({ name: st, value: scope.filter(s => s.status === st).length }))
      .sort((a, b) => b.value - a.value),
  [scope]);

  /* gender donut */
  const genderData = useMemo(() =>
    GENDERS.map(g => ({ name: g, value: scope.filter(s => s.gender === g).length })).filter(d => d.value > 0),
  [scope]);
  const genderTotal = genderData.reduce((s, d) => s + d.value, 0);

  /* program graduation + gender splits */
  const progGrad = (type: "active" | "teach-out", list: readonly string[]) =>
    list.map(p => {
      const rows = scope.filter(s => s.programType === type && s.program === p);
      const graduated = rows.filter(s => s.status === "Graduated").length;
      return { name: p, Graduated: graduated, "Not Graduated": rows.length - graduated, total: rows.length };
    }).sort((a, b) => b.total - a.total);

  const progGender = (type: "active" | "teach-out", list: readonly string[]) =>
    list.map(p => {
      const rows = scope.filter(s => s.programType === type && s.program === p);
      return {
        name: p,
        Female: rows.filter(s => s.gender === "Female").length,
        Male: rows.filter(s => s.gender === "Male").length,
        "Non-binary": rows.filter(s => s.gender === "Non-binary").length,
        total: rows.length,
      };
    }).sort((a, b) => b.total - a.total);

  const activeGrad = useMemo(() => progGrad("active", PROGRAMS_ACTIVE), [scope]);
  const teachGrad = useMemo(() => progGrad("teach-out", PROGRAMS_TEACHOUT), [scope]);
  const activeGender = useMemo(() => progGender("active", PROGRAMS_ACTIVE), [scope]);
  const teachGender = useMemo(() => progGender("teach-out", PROGRAMS_TEACHOUT), [scope]);

  /* segment summary cards (campus-scoped) */
  const segSummary = (seg: Segment | "all") => {
    const rows = campusScope.filter(s => seg === "all" || s.segment === seg);
    const t = rows.length;
    return {
      total: t,
      femalePct: share(rows.filter(s => s.gender === "Female").length, t),
      refugeePct: share(rows.filter(s => s.refugee).length, t),
      pwdPct: share(rows.filter(s => s.pwd).length, t),
      y1: rows.filter(s => s.scholarYear === 1).length,
      y2: rows.filter(s => s.scholarYear === 2).length,
    };
  };
  const allSum = segSummary("all");
  const schSum = segSummary("Scholar");
  const feeSum = segSummary("Fee-Paying");

  const isFiltered = campus !== "all" || tab !== "All Students";

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.45), rgba(4,44,83,0.15))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Outreach &amp; Access</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Reach and inclusion across CHII&apos;s HEMP &amp; HENT programs</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 14:30 GMT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-8">

        {/* ── Hero KPI strip ───────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
          <KpiCard label="Total Reached" value={fmt(kpis.total)} caption="students" Icon={Users}
            tooltip="Total students reached in the current campus and segment scope." delta={{ v: kpis.totalDelta, unit: "%" }} />
          <KpiCard label="Female Share" value={`${kpis.femalePct}%`} caption="of cohort" Icon={Heart}
            tooltip="Share of female students. ALU targets gender parity across campuses." delta={{ v: kpis.femDelta, unit: "pp" }} />
          <KpiCard label="Refugee / IDP" value={`${kpis.refugeePct}%`} caption="equity inclusion" Icon={Shield}
            tooltip="Share of refugee and internally-displaced students reached." delta={{ v: kpis.refDelta, unit: "pp" }} />
          <KpiCard label="Active Campuses" value={fmt(kpis.campusCount)} caption="locations" Icon={Building2}
            tooltip="Number of campuses included in the current scope." />
          <KpiCard label="Graduation Rate" value={`${kpis.gradRate}%`} caption="completion" Icon={GraduationCap}
            tooltip="Graduated students as a share of those in scope." />
        </div>

        {/* ── Two-column body ──────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(250px, 280px) minmax(0, 1fr)", gap: 16, alignItems: "start" }} className="oa-grid">

          {/* LEFT RAIL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Filter panel */}
            <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
              <div style={{ backgroundColor: BAND, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <SlidersHorizontal size={13} color="white" />
                <p style={{ fontSize: 12, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filters</p>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Campus</label>
                <select value={campus} onChange={e => setCampus(e.target.value)}
                  style={{ width: "100%", marginTop: 5, fontSize: 12, border: "1px solid rgba(0,33,71,0.15)", borderRadius: 6, padding: "7px 9px", color: NAVY, backgroundColor: "white", cursor: "pointer" }}>
                  <option value="all">All Campuses</option>
                  {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(0,33,71,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <p style={{ fontSize: 10, color: "#9CA3AF", lineHeight: 1.5 }}>
                    Current filter:<br/>
                    <span style={{ color: NAVY, fontWeight: 600 }}>Campus: {campus === "all" ? "All" : campus}</span><br/>
                    <span style={{ color: NAVY, fontWeight: 600 }}>Segment: {tab}</span>
                  </p>
                  {isFiltered && (
                    <button onClick={() => { setCampus("all"); setTab("All Students"); }}
                      style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: "#8B2232", border: "1px solid rgba(139,34,50,0.3)", borderRadius: 6, padding: "4px 8px", backgroundColor: "white", cursor: "pointer" }}>
                      <X size={10} /> Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Segment tabs */}
            <div style={{ display: "flex", backgroundColor: "#EEF3F8", borderRadius: 8, padding: 3, gap: 3 }}>
              {(["All Students", "Scholars", "Fee-Paying Students"] as SegTab[]).map(t => {
                const active = t === tab;
                return (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ flex: 1, fontSize: 9.5, fontWeight: 700, padding: "6px 4px", borderRadius: 6, border: "none", cursor: "pointer", lineHeight: 1.2,
                      backgroundColor: active ? NAVY : "transparent", color: active ? "white" : "#6B7280" }}>
                    {t === "Fee-Paying Students" ? "Fee-Paying" : t === "All Students" ? "All" : "Scholars"}
                  </button>
                );
              })}
            </div>

            {/* Segment summary cards */}
            <SegmentCard title="All Students" rows={[
              { Icon: Users, label: "Total", value: fmt(allSum.total) },
              { Icon: Heart, label: "Female", value: `${allSum.femalePct}%` },
              { Icon: Shield, label: "Refugee / IDP", value: `${allSum.refugeePct}%` },
              { Icon: Accessibility, label: "PwD", value: `${allSum.pwdPct}%` },
            ]} />
            <SegmentCard title="MCF Scholars" rows={[
              { Icon: Users, label: "Total", value: fmt(schSum.total) },
              { Icon: Heart, label: "Female", value: `${schSum.femalePct}%` },
              { Icon: Shield, label: "Refugee / IDP", value: `${schSum.refugeePct}%` },
              { Icon: Accessibility, label: "PwD", value: `${schSum.pwdPct}%` },
            ]} pills={[{ label: "Year 1", value: schSum.y1 }, { label: "Year 2", value: schSum.y2 }]} />
            <SegmentCard title="Fee-Paying Students" rows={[
              { Icon: Users, label: "Total", value: fmt(feeSum.total) },
              { Icon: Heart, label: "Female", value: `${feeSum.femalePct}%` },
            ]} />
          </div>

          {/* MAIN AREA */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>

            {/* Row 1 — trends */}
            <Panel title="Enrollment Trend" subtitle="Annual vs in-year enrollment">
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={enrollTrend} margin={{ top: 6, right: 10, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                  <Line type="monotone" dataKey="Annual" stroke={C_ANNUAL} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="In-Year" stroke={C_INYEAR} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Graduates Trend" subtitle="Annual vs in-year graduations">
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={gradTrend} margin={{ top: 6, right: 10, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />
                  <Line type="monotone" dataKey="Annual" stroke={C_ANNUAL} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="In-Year" stroke={C_INYEAR} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            {/* Row 2 — status + gender */}
            <Panel title="Enrollment Status" subtitle="Pipeline stages by volume">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart layout="vertical" data={statusData} margin={{ top: 4, right: 28, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={108} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Students" fill={BAND} radius={[0, 4, 4, 0]} barSize={16}
                    label={{ position: "right", fontSize: 10, fill: "#374151", fontWeight: 700 }} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Gender Distribution" subtitle="Female · Male · Non-binary">
              <div style={{ position: "relative" }}>
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
                      {genderData.map(d => <Cell key={d.name} fill={GENDER_COLOR[d.name as Gender]} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "42%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(genderTotal)}</p>
                  <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</p>
                </div>
              </div>
            </Panel>

            {/* Row 3 — program graduation */}
            <Panel title="Active Programs – Graduation" subtitle="Graduated vs not graduated">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart layout="vertical" data={activeGrad} margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} width={132} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Graduated" stackId="g" fill={C_GRAD} barSize={15} />
                  <Bar dataKey="Not Graduated" stackId="g" fill={C_NOTGRAD} radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Teach-out Programs – Graduation" subtitle="Graduated vs not graduated">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart layout="vertical" data={teachGrad} margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} width={132} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Graduated" stackId="g" fill={C_GRAD} barSize={15} />
                  <Bar dataKey="Not Graduated" stackId="g" fill={C_NOTGRAD} radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* Row 4 — program gender */}
            <Panel title="Active Programs – Gender" subtitle="Female · Male · Non-binary by program">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart layout="vertical" data={activeGender} margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} width={132} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Female" stackId="g" fill={C_FEMALE} barSize={15} />
                  <Bar dataKey="Male" stackId="g" fill={C_MALE} barSize={15} />
                  <Bar dataKey="Non-binary" stackId="g" fill={C_NB} radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Teach-out Programs – Gender" subtitle="Female · Male · Non-binary by program">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart layout="vertical" data={teachGender} margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#374151" }} width={132} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Female" stackId="g" fill={C_FEMALE} barSize={15} />
                  <Bar dataKey="Male" stackId="g" fill={C_MALE} barSize={15} />
                  <Bar dataKey="Non-binary" stackId="g" fill={C_NB} radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

          </div>
        </div>

        <FeaturedImpactStory />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .oa-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
