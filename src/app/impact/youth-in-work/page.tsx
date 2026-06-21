"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  Users, Heart, Briefcase, Accessibility, Shield, ShieldCheck, Layers,
  Download, Info, Hammer, SlidersHorizontal, X,
} from "lucide-react";
import {
  YOUTH, PATHWAYS, PROGRAMS, PARTICIPANT_TYPES, GENDERS, COUNTRIES, SECTORS,
  EMPLOYMENT_TYPES, YEARS, EMPLOYED_PATHWAYS, VENTURE_PATHWAYS,
  type Pathway, type Program, type ParticipantType, type Youth,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";
import StatsKpiCard from "../StatsKpiCard";

/* ── palette ──────────────────────────────────────────── */
const NAVY = "#042C53";
const BAND = "#0C447C";
const TICK = "#D17A86";
const C_BLUE = "#185FA5";
const C_GREEN = "#1D9E75";
const C_VIOLET = "#7F77DD";
const C_AMBER = "#E0A458";

const PROGRAM_COLOR: Record<Program, string> = { HEMP: "#185FA5", HENT: "#0F6E56", HECO: "#BA7517" };
const PATHWAY_COLOR: Record<Pathway, string> = {
  "Wage Employment": "#185FA5",
  "Internship": "#3FA7E0",
  "Venture Founder": "#1D9E75",
  "Wage & Venture": "#7F77DD",
  "Further Education": "#E0A458",
  "Seeking Employment": "#D17A86",
  "Other": "#C5D2E0",
};
const OUTCOME_COLOR: Record<string, string> = {
  Employment: C_BLUE, Internships: "#3FA7E0", Ventures: C_GREEN,
};

/* ── helpers ─────────────────────────────────────────── */
const share = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const fmt = (n: number) => Math.round(n).toLocaleString();

const isEmployed = (y: Youth) =>
  EMPLOYED_PATHWAYS.includes(y.pathway) || y.participantType === "Venture Employee";
const isInternship = (y: Youth) => y.pathway === "Internship";
const isVenture = (y: Youth) => VENTURE_PATHWAYS.includes(y.pathway);

/* ════════════════════════════════════════════════════════
   Shared UI
═══════════════════════════════════════════════════════ */
function SectionHeader({ n, title, blurb }: { n: number; title: string; blurb: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: "white", backgroundColor: NAVY, borderRadius: 999, width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: NAVY, letterSpacing: "0.01em" }}>{title}</h2>
        <p style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{blurb}</p>
      </div>
    </div>
  );
}

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

/* white KPI card: blue border, consistent icon, info tooltip */
function WhiteKpi({ Icon, label, value, tooltip }: {
  Icon: typeof Users; label: string; value: string; tooltip: string;
}) {
  const [tip, setTip] = useState(false);
  const ACCENT = "#185FA5";
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${ACCENT}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: `${ACCENT}1A`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} color={ACCENT} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1.05 }}>{value}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
          <span style={{ position: "relative", cursor: "pointer", display: "flex", flexShrink: 0 }}
            onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
            <Info size={10} color="#9CA3AF" />
            {tip && (
              <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0, lineHeight: 1.5, padding: "7px 10px", borderRadius: 6, width: 180, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", pointerEvents: "none" }}>
                {tooltip}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function ChartTip({ active, payload, label, pct }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: NAVY }}>{fmt(p.value)}{pct ? "%" : ""}</b>
        </p>
      ))}
    </div>
  );
}
const PctTip = (props: any) => <ChartTip {...props} pct />;

function FilterSelect<T extends string | number>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: "1 1 150px" }}>
      <label style={{ fontSize: 9.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <select value={String(value)} onChange={e => {
        const match = options.find(o => String(o.value) === e.target.value);
        if (match) onChange(match.value);
      }}
        style={{ width: "100%", fontSize: 12, border: "1px solid rgba(0,33,71,0.15)", borderRadius: 6, padding: "7px 9px", color: NAVY, backgroundColor: "white", cursor: "pointer" }}>
        {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* simple comparison table */
function CompareTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={h} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#6B7280", textAlign: i === 0 ? "left" : "right", borderBottom: "2px solid rgba(0,33,71,0.1)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "10px 12px", textAlign: ci === 0 ? "left" : "right", fontWeight: ci === 0 ? 700 : 400, color: ci === 0 ? NAVY : "#374151", borderBottom: "1px solid rgba(0,33,71,0.06)" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function YouthInWorkPage() {
  const [program, setProgram] = useState<"all" | Program>("all");
  const [ptype, setPtype] = useState<"all" | ParticipantType>("all");
  const [country, setCountry] = useState<string>("all");
  const [year, setYear] = useState<"all" | number>("all");
  const [pathway, setPathway] = useState<"all" | Pathway>("all");

  const scope = useMemo(() =>
    YOUTH.filter(y => {
      if (program !== "all" && y.program !== program) return false;
      if (ptype !== "all" && y.participantType !== ptype) return false;
      if (country !== "all" && y.country !== country) return false;
      if (year !== "all" && y.year !== year) return false;
      if (pathway !== "all" && y.pathway !== pathway) return false;
      return true;
    }),
  [program, ptype, country, year, pathway]);

  /* ── Section 1: workforce snapshot ─────────────────── */
  const kpis = useMemo(() => {
    const total = scope.length;
    const employed = scope.filter(isEmployed).length;
    const interns = scope.filter(isInternship).length;
    const founders = scope.filter(y => y.pathway === "Venture Founder" || y.pathway === "Wage & Venture").length;
    const jobsCreated = scope.reduce((s, y) => s + y.jobsCreated, 0);
    const female = scope.filter(y => y.gender === "Female").length;
    const africa = scope.filter(y => y.basedInAfrica).length;
    const refugee = scope.filter(y => y.refugee).length;
    const pwd = scope.filter(y => y.pwd).length;
    const inWork = scope.filter(y => y.primaryJob || y.secondaryJob);
    const decent = inWork.filter(y => y.permanent).length;
    return {
      total, employed, interns, founders, jobsCreated,
      femalePct: share(female, total), africaPct: share(africa, total),
      refugeePct: share(refugee, total), pwdPct: share(pwd, total),
      decentPct: share(decent, inWork.length),
    };
  }, [scope]);

  /* ── Section 2: work pathway distribution ──────────── */
  const pathwayDist = useMemo(() =>
    PATHWAYS.map(p => ({ name: p, value: scope.filter(y => y.pathway === p).length })).filter(d => d.value > 0),
  [scope]);

  /* ── Section 3: who is working (by participant type) ─ */
  const whoTable = useMemo(() => {
    const headers = ["Participant Group", "In Work", "Internships", "Ventures", "Jobs Created"];
    const rows = PARTICIPANT_TYPES.map(pt => {
      const rows_ = scope.filter(y => y.participantType === pt);
      return [
        pt === "Venture Employee" ? "Venture Employees" : pt + "s",
        fmt(rows_.filter(isEmployed).length),
        fmt(rows_.filter(isInternship).length),
        fmt(rows_.filter(isVenture).length),
        fmt(rows_.reduce((s, y) => s + y.jobsCreated, 0)),
      ];
    });
    return { headers, rows };
  }, [scope]);

  /* ── Section 4: employment by program ──────────────── */
  const byProgram = useMemo(() =>
    PROGRAMS.map(p => {
      const rows = scope.filter(y => y.program === p);
      return {
        program: p,
        Employment: rows.filter(isEmployed).length,
        Internships: rows.filter(isInternship).length,
        Ventures: rows.filter(isVenture).length,
      };
    }),
  [scope]);

  /* ── Section 5: jobs created through ventures ──────── */
  const venture = useMemo(() => {
    const founders = scope.filter(y => y.jobsCreated > 0);
    const jobsTotal = founders.reduce((s, y) => s + y.jobsCreated, 0);
    const byProg = PROGRAMS.map(p => ({
      program: p,
      jobs: scope.filter(y => y.program === p).reduce((s, y) => s + y.jobsCreated, 0),
    }));
    const overTime = YEARS.map(yr => ({
      year: yr,
      Jobs: scope.filter(y => y.year === yr).reduce((s, y) => s + y.jobsCreated, 0),
    }));
    return {
      venturesSupported: founders.length,
      jobsTotal,
      studentEmployees: Math.round(jobsTotal * 0.34),
      alumniEmployees: Math.round(jobsTotal * 0.41),
      externalEmployees: jobsTotal - Math.round(jobsTotal * 0.34) - Math.round(jobsTotal * 0.41),
      byProg, overTime,
    };
  }, [scope]);

  /* ── Section 6: cohort comparison ──────────────────── */
  const cohortCompare = useMemo(() => {
    const groups: { name: string; rows: Youth[] }[] = [
      { name: "Students", rows: scope.filter(y => y.participantType === "Student") },
      { name: "Alumni", rows: scope.filter(y => y.participantType === "Alumni") },
      { name: "Scholars", rows: scope.filter(y => y.scholar) },
    ];
    const headers = ["Metric", ...groups.map(g => g.name)];
    const metric = (pickFn: (y: Youth) => boolean) =>
      groups.map(g => `${share(g.rows.filter(pickFn).length, g.rows.length)}%`);
    const rows: (string | number)[][] = [
      ["Female", ...metric(y => y.gender === "Female")],
      ["In employment", ...metric(isEmployed)],
      ["Internships", ...metric(isInternship)],
      ["Ventures", ...metric(isVenture)],
      ["Based in Africa", ...metric(y => y.basedInAfrica)],
    ];
    return { headers, rows };
  }, [scope]);

  /* ── Section 7: inclusion ──────────────────────────── */
  const inclusion = useMemo(() => {
    const t = scope.length;
    const kpiCards = {
      female: share(scope.filter(y => y.gender === "Female").length, t),
      refugee: share(scope.filter(y => y.refugee).length, t),
      pwd: share(scope.filter(y => y.pwd).length, t),
      scholar: share(scope.filter(y => y.scholar).length, t),
    };
    const byPathway = [
      { name: "Employment", rows: scope.filter(isEmployed) },
      { name: "Internships", rows: scope.filter(isInternship) },
      { name: "Ventures", rows: scope.filter(isVenture) },
    ].map(g => ({
      pathway: g.name,
      Female: share(g.rows.filter(y => y.gender === "Female").length, g.rows.length),
      "Refugee / IDP": share(g.rows.filter(y => y.refugee).length, g.rows.length),
      PwD: share(g.rows.filter(y => y.pwd).length, g.rows.length),
    }));
    return { kpiCards, byPathway };
  }, [scope]);

  /* ── Section 8: employment quality ─────────────────── */
  const quality = useMemo(() => {
    const employed = scope.filter(isEmployed);
    const primary = scope.filter(y => y.primaryJob).length;
    const secondary = scope.filter(y => y.secondaryJob).length;
    const jobMix = [
      { name: "Primary jobs", value: primary },
      { name: "Secondary jobs", value: secondary },
    ];
    const empType = EMPLOYMENT_TYPES.map(t => ({
      name: t, value: employed.filter(y => y.employmentType === t).length,
    }));
    const sectors = SECTORS.map(s => ({
      name: s, value: scope.filter(y => y.primaryJob && y.sector === s).length,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    const leadershipPct = share(employed.filter(y => y.leadership).length, employed.length);
    const permanentPct = share(employed.filter(y => y.permanent).length, employed.length);
    return { jobMix, empType, sectors, leadershipPct, permanentPct };
  }, [scope]);

  /* ── Section 9: trends ─────────────────────────────── */
  const trend = useMemo(() =>
    YEARS.map(yr => {
      const rows = scope.filter(y => y.year === yr);
      return {
        year: yr,
        Employment: rows.filter(isEmployed).length,
        Internships: rows.filter(isInternship).length,
        Ventures: rows.filter(isVenture).length,
        "Jobs Created": rows.reduce((s, y) => s + y.jobsCreated, 0),
      };
    }),
  [scope]);

  const isFiltered = program !== "all" || ptype !== "all" || country !== "all" || year !== "all" || pathway !== "all";
  const reset = () => { setProgram("all"); setPtype("all"); setCountry("all"); setYear("all"); setPathway("all"); };

  const EMP_TYPE_COLOR = [C_BLUE, C_GREEN, C_VIOLET];

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Youth in Work</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Tracking employment, internships, entrepreneurship, and jobs created across CHII programs</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* ════ SECTION 1 — WORKFORCE SNAPSHOT ════ */}
        <section className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12 }}>
            <StatsKpiCard label="Youth Tracked" num={kpis.total} sub="students + alumni" Icon={Users}
              tooltip="Total youth tracked across the CHII ecosystem — current students, alumni, and venture employees." />
            <StatsKpiCard label="In Employment" num={kpis.employed} sub="in wage employment" Icon={Briefcase}
              tooltip="Youth in wage employment, including those at supported ventures." />
            <StatsKpiCard label="Female" num={kpis.femalePct} displayFmt={(n) => `${Math.round(n)}%`} sub="of participants" Icon={Heart}
              tooltip="Share of female participants across the tracked workforce." />
            <StatsKpiCard label="Refugee / IDP" num={kpis.refugeePct} displayFmt={(n) => `${Math.round(n)}%`} sub="of participants" Icon={Shield}
              tooltip="Share of participants who are refugees or internally displaced." />
            <StatsKpiCard label="Persons with Disability" num={kpis.pwdPct} displayFmt={(n) => `${Math.round(n)}%`} sub="of participants" Icon={Accessibility}
              tooltip="Share of participants who are persons with disabilities." />
            <StatsKpiCard label="Decent Work" num={kpis.decentPct} displayFmt={(n) => `${Math.round(n)}%`} sub="of those in work" Icon={ShieldCheck}
              tooltip="Share of working youth in roles meeting decent-work criteria (permanent / stable employment)." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <WhiteKpi Icon={Briefcase} label="Primary Jobs" value={fmt(5627)} tooltip="Youth whose venture or wage role is their primary source of income." />
            <WhiteKpi Icon={Heart} label="Female Primary" value={fmt(2985)} tooltip="Female youth holding a primary job." />
            <WhiteKpi Icon={Layers} label="Secondary Jobs" value={fmt(54657)} tooltip="Additional / secondary income-generating roles held alongside a primary activity." />
            <WhiteKpi Icon={Heart} label="Female Secondary" value={fmt(27941)} tooltip="Female youth holding a secondary job." />
            <WhiteKpi Icon={Shield} label="Refugee / IDP Primary" value={fmt(4200)} tooltip="Refugee or internally displaced youth holding a primary job." />
            <WhiteKpi Icon={Accessibility} label="PwD Primary" value={fmt(2100)} tooltip="Youth with disabilities holding a primary job." />
          </div>
        </section>

        {/* ════ SECTION 2 — WORK PATHWAYS ════ */}
        <section className="space-y-4">
          <SectionHeader n={1} title="Work Pathways" blurb="Where are our youth today?" />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 420px) minmax(0, 1fr)", gap: 16, alignItems: "start" }} className="yiw-grid">
            <Panel title="Work Pathway Distribution" subtitle="How youth split across pathways"
              info="The mix of pathways youth follow: wage employment, internships, ventures, further education, and more.">
              <div style={{ position: "relative" }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pathwayDist} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={58} outerRadius={90} paddingAngle={2} stroke="none">
                      {pathwayDist.map(d => <Cell key={d.name} fill={PATHWAY_COLOR[d.name as Pathway]} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "38%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{fmt(kpis.total)}</p>
                  <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Youth</p>
                </div>
              </div>
            </Panel>

            <Panel title="Who Is Working?" subtitle="Outcomes by participant group"
              info="How outcomes differ by where someone is in their journey: students, alumni, and people employed at supported ventures.">
              <CompareTable headers={whoTable.headers} rows={whoTable.rows} />
              <p style={{ fontSize: 10.5, color: "#9CA3AF", marginTop: 10 }}>
                Students gain internships and early work; alumni move into employment or ventures; ventures in turn employ others.
              </p>
            </Panel>
          </div>
        </section>

        {/* ════ SECTION 3 — EMPLOYMENT BY PROGRAM ════ */}
        <section className="space-y-4">
          <SectionHeader n={2} title="Employment by Program" blurb="Which programs drive each outcome?" />
          <Panel title="Outcomes by Program" subtitle="Employment · Internships · Ventures across HEMP · HENT · HECO"
            info="Participant counts for each work outcome, grouped by program, so leadership can see which program contributes most.">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byProgram} margin={{ top: 16, right: 12, bottom: 0, left: -12 }} barGap={6} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="program" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {(["Employment", "Internships", "Ventures"] as const).map(k => (
                  <Bar key={k} dataKey={k} fill={OUTCOME_COLOR[k]} radius={[3, 3, 0, 0]} barSize={34}>
                    <LabelList dataKey={k} position="top" fontSize={9.5} fill="#374151" fontWeight={700} />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        {/* ════ SECTION 4 — JOBS CREATED THROUGH VENTURES ════ */}
        <section className="space-y-4">
          <SectionHeader n={3} title="Jobs Created Through Ventures" blurb="The indirect impact: ventures creating opportunities for others." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <Panel title="Jobs Created by Program" subtitle="Positions attributable to each program's ventures"
              info="Total jobs created by ventures, grouped by the founder's program.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={venture.byProg} margin={{ top: 16, right: 12, bottom: 0, left: -12 }} barCategoryGap="36%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="program" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="jobs" name="Jobs created" barSize={52} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="jobs" position="top" fontSize={11} fill={NAVY} fontWeight={700} />
                    {venture.byProg.map(d => <Cell key={d.program} fill={PROGRAM_COLOR[d.program as Program]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Jobs Created Over Time" subtitle="Annual jobs generated by supported ventures"
              info="How many jobs ventures created each year.">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={venture.overTime} margin={{ top: 10, right: 16, bottom: 0, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="Jobs" stroke={C_GREEN} strokeWidth={2.5} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </section>

        {/* ════ SECTION 5 — COHORT COMPARISON ════ */}
        <section className="space-y-4">
          <SectionHeader n={4} title="Cohort Comparison" blurb="How the populations CHII serves compare." />
          <Panel title="Students vs Alumni vs Scholars" subtitle="Shared metrics, three groups"
            info="Each metric shows the % within that group. Scholars overlap with students and alumni.">
            <CompareTable headers={cohortCompare.headers} rows={cohortCompare.rows} />
          </Panel>
        </section>

        {/* ════ SECTION 6 — INCLUSION ════ */}
        <section className="space-y-4">
          <SectionHeader n={5} title="Inclusion" blurb="Who is accessing work opportunities?" />
          <Panel title="Inclusion by Work Pathway" subtitle="Priority-group share within Employment · Internships · Ventures"
            info="Share of each priority group within each work pathway, on a fixed 0–100% scale.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inclusion.byPathway} margin={{ top: 16, right: 12, bottom: 0, left: -12 }} barGap={5} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                <XAxis dataKey="pathway" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<PctTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {([["Female", C_BLUE], ["Refugee / IDP", C_AMBER], ["PwD", C_VIOLET]] as const).map(([k, c]) => (
                  <Bar key={k} dataKey={k} fill={c} radius={[3, 3, 0, 0]} barSize={26} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        {/* ════ SECTION 7 — EMPLOYMENT QUALITY ════ */}
        <section className="space-y-4">
          <SectionHeader n={6} title="Employment Quality" blurb="Not just how many jobs — what kind of work." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Panel title="Primary vs Secondary Jobs" subtitle="Job multiplicity across the workforce"
              info="Primary jobs are someone's main role; secondary jobs are additional income streams held alongside.">
              <div style={{ position: "relative" }}>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={quality.jobMix} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={54} outerRadius={84} paddingAngle={2} stroke="none">
                      {quality.jobMix.map((d, i) => <Cell key={d.name} fill={[C_BLUE, C_GREEN][i]} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Employment Type" subtitle="Full-time · Part-time · Contract"
              info="Composition of how employed youth are engaged.">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={quality.empType} margin={{ top: 16, right: 12, bottom: 0, left: -12 }} barCategoryGap="34%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                  <Bar dataKey="value" name="Youth" barSize={48} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="top" fontSize={10.5} fill="#374151" fontWeight={700} />
                    {quality.empType.map((d, i) => <Cell key={d.name} fill={EMP_TYPE_COLOR[i % EMP_TYPE_COLOR.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 18, marginTop: 8, justifyContent: "center" }}>
                <span style={{ fontSize: 10.5, color: "#6B7280" }}>Permanent roles: <b style={{ color: NAVY }}>{quality.permanentPct}%</b></span>
                <span style={{ fontSize: 10.5, color: "#6B7280" }}>Leadership roles: <b style={{ color: NAVY }}>{quality.leadershipPct}%</b></span>
              </div>
            </Panel>
          </div>

          <Panel title="Sector of Employment" subtitle="Where working youth are placed"
            info="Distribution of primary jobs across sectors, sorted from most to least.">
            <ResponsiveContainer width="100%" height={Math.max(220, quality.sectors.length * 34)}>
              <BarChart layout="vertical" data={quality.sectors} margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} width={120} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
                <Bar dataKey="value" name="Youth" fill={BAND} radius={[0, 4, 4, 0]} barSize={18}>
                  <LabelList dataKey="value" position="right" fontSize={10} fill="#374151" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        {/* ════ SECTION 8 — TRENDS ════ */}
        <section className="space-y-4">
          <SectionHeader n={7} title="Trends" blurb="Are CHII's workforce outcomes growing over time?" />
          <Panel title="Workforce Outcomes Over Time" subtitle="Employment · Internships · Ventures · Jobs Created"
            info="Annual trajectory of each outcome, by recorded year.">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend} margin={{ top: 10, right: 16, bottom: 8, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Employment" stroke={C_BLUE} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Internships" stroke="#3FA7E0" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Ventures" stroke={C_GREEN} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Jobs Created" stroke={C_AMBER} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        <FeaturedImpactStory footer />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .yiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
