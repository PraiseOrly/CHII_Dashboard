"use client";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { ChartLegend } from "@/components/ui";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import { DonutRing } from "@/components/charts/donut-chart";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { Banknote, CheckCircle2, Rocket, Target, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { Stage } from "@/types";

// ─── Theme (HENT green) ──────────────────────────────────────────────────────
const HERO    = "#2D6A4F";
const BRAND   = "#2D6A4F";
const BRAND_DK = "#0E4633";
const GREEN_RAMP = ["#1B4332","#1F9E9E","#A6C13C","#BBD59B","#2D6A4F","#4C8C8A","#6B8E5B","#8FA45A","#40916C","#C8DDB5"];
const DISTINCT = ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5"];

// ─── Milestone purposes ──────────────────────────────────────────────────────
// Catalytic funding is released against milestones. Map each venture's stage to
// the milestone the tranche is funding, per the intervention definition.
const MILESTONES = [
  "Solution Validation",
  "Prototype Development",
  "Customer Discovery",
  "Pilot Implementation",
  "Early Venture Growth",
] as const;
type Milestone = typeof MILESTONES[number];

function milestoneFor(stage: Stage): Milestone {
  switch (stage) {
    case "Ideation":
    case "Validation":          return "Solution Validation";
    case "Prototype/MVP":       return "Prototype Development";
    case "Early Growth":        return "Customer Discovery";
    case "Scaling":             return "Pilot Implementation";
    case "Investment/Funding":  return "Early Venture Growth";
  }
}

const MILESTONE_HEX: Record<Milestone, string> = {
  "Solution Validation":   "#1B4332",
  "Prototype Development": "#1F9E9E",
  "Customer Discovery":    "#40916C",
  "Pilot Implementation":  "#A6C13C",
  "Early Venture Growth":  "#BBD59B",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${n}`;
}
function avg(a: number[]) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }

const COHORTS = Array.from(new Set(ALL_VENTURES.map(v => v.cohort))).sort();
const ALL_SECTORS = Array.from(new Set(ALL_VENTURES.map(v => v.sector))).sort();

// ─── Derivations (filter-aware) ──────────────────────────────────────────────
function derive(rows: typeof ALL_VENTURES) {
  const funded = rows.filter(v => v.funding > 0);
  const totalFunding = funded.reduce((s, v) => s + v.funding, 0);
  const avgTicket = funded.length ? Math.round(totalFunding / funded.length) : 0;
  const jobs = funded.reduce((s, v) => s + v.jobsTotal, 0);
  const milestoneRate = Math.round(avg(funded.map(v => v.milestoneRate)));
  const milestonesDone = funded.reduce((s, v) => s + v.milestonesDone, 0);
  const progressed = funded.filter(v => v.stage === "Scaling" || v.stage === "Investment/Funding").length;

  // Funding + venture count per milestone purpose
  const byMilestone = MILESTONES.map(m => {
    const rs = funded.filter(v => milestoneFor(v.stage) === m);
    return {
      name: m,
      Funding: rs.reduce((s, v) => s + v.funding, 0),
      Ventures: rs.length,
      value: rs.reduce((s, v) => s + v.funding, 0),
    };
  });

  // Funding deployed per cohort + cumulative
  let running = 0;
  const byCohort = COHORTS.map(c => {
    const rs = funded.filter(v => v.cohort === c);
    const amt = rs.reduce((s, v) => s + v.funding, 0);
    running += amt;
    return { Year: String(c), Deployed: amt, Ventures: rs.length, Cumulative: running };
  });

  // Funding instrument mix
  const byStatus = Array.from(new Set(funded.map(v => v.fundingStatus)))
    .map(st => ({ name: st, value: funded.filter(v => v.fundingStatus === st).length }))
    .sort((a, b) => b.value - a.value);

  // Capital by sector
  const bySector = ALL_SECTORS
    .map(s => ({ name: s, value: funded.filter(v => v.sector === s).reduce((x, v) => x + v.funding, 0) }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Milestone delivery vs capital — top funded ventures
  const topFunded = [...funded].sort((a, b) => b.funding - a.funding).slice(0, 8)
    .map(v => ({
      name: v.name, funding: v.funding, stage: v.stage,
      milestone: milestoneFor(v.stage),
      done: v.milestonesDone, total: v.milestonesTotal, rate: v.milestoneRate,
    }));

  // Catalytic funnel
  const funnel = [
    { label: "Ventures in portfolio",   value: rows.length },
    { label: "Received catalytic funding", value: funded.length },
    { label: "Milestones met (≥50%)",   value: funded.filter(v => v.milestoneRate >= 50).length },
    { label: "Progressed to Scale",     value: progressed },
  ];

  return { funded, totalFunding, avgTicket, jobs, milestoneRate, milestonesDone, progressed, byMilestone, byCohort, byStatus, bySector, topFunded, funnel };
}

// Small "i" badge revealing an explanation on hover.
function InfoDot({ tip, color = BRAND }: { tip: string; color?: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: `${color}22`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color, lineHeight: 1, userSelect: "none" }}>i</span>
      {show && (
        <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", color: "#111827", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 200, boxShadow: "0 6px 20px rgba(0,0,0,0.22)", zIndex: 100, textAlign: "left", pointerEvents: "none", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function KpiTile({ label, num, displayFmt, sub, Icon, tip }: {
  label: string; num: number; displayFmt: (n: number) => string; sub?: string; Icon: LucideIcon; tip?: string;
}) {
  const animated = useCountUp(num);
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(14,70,51,0.12)", borderLeft: `5px solid ${BRAND}`, position: "relative", overflow: "visible" }}>
      <div className="flex items-center justify-center gap-1" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(14,70,51,0.55)" }}>{label}</p>
        {tip && <InfoDot tip={tip} />}
      </div>
      <div className="flex items-center justify-center gap-2">
        <Icon size={18} style={{ color: BRAND_DK, opacity: 0.85, flexShrink: 0 }} />
        <p style={{ fontSize: 24, fontWeight: 700, color: BRAND_DK, lineHeight: 1 }}>{displayFmt(animated)}</p>
      </div>
      {sub && <p style={{ fontSize: 9.5, color: "rgba(14,70,51,0.55)", marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: BRAND }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, info, children }: { title: string; sub?: string; info?: string; children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  async function handleDownload() {
    if (!cardRef.current) return;
    const h2c = (await import("html2canvas")).default;
    const canvas = await h2c(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const a = document.createElement("a");
    a.download = title.replace(/[^a-z0-9]/gi, "_") + ".png";
    a.href = canvas.toDataURL();
    a.click();
  }
  return (
    <div ref={cardRef} onContextMenu={(e) => { e.preventDefault(); handleDownload(); }}
      title="Right-click to download this chart"
      className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
      <div className="flex items-center gap-2.5" style={{ backgroundColor: BRAND, padding: "12px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.8)" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>{title}</p>
            {(info || sub) && <InfoDot tip={(info || sub)!} color="#FFFFFF" />}
          </div>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ChartTip({ active, payload, label, money }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(14,70,51,0.12)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label != null && <p style={{ fontWeight: 700, color: BRAND_DK, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5, margin: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: BRAND_DK }}>{money && /fund|deploy|cumul/i.test(String(p.name)) ? fmt$(p.value) : p.value.toLocaleString()}</b>
        </p>
      ))}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(14,70,51,0.6)" }}>
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="cursor-pointer focus:outline-none"
        style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(0,33,71,0.12)", fontSize: 11, color: "#374151", backgroundColor: "white" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = steps[0]?.value || 1;
  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const pct = Math.max(8, Math.round((s.value / max) * 100));
        const conv = i > 0 && steps[i - 1].value > 0 ? Math.round((s.value / steps[i - 1].value) * 100) : null;
        return (
          <div key={s.label}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-gray-700">{s.label}</span>
              <span className="font-bold tabular-nums" style={{ color: BRAND_DK }}>
                {s.value.toLocaleString()}{conv !== null && <span className="text-gray-400 font-medium"> · {conv}%</span>}
              </span>
            </div>
            <div className="h-6 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(14,70,51,0.08)" }}>
              <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: BRAND_DK, opacity: 1 - i * 0.15 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function VentureFundingPage() {
  const [fCohort, setFCohort] = useState("All Cohorts");
  const [fSector, setFSector] = useState("All Sectors");
  const [fStatus, setFStatus] = useState("All Instruments");

  const ALL_STATUSES = useMemo(
    () => Array.from(new Set(ALL_VENTURES.filter(v => v.funding > 0).map(v => v.fundingStatus))).sort(),
    []
  );

  const filtered = useMemo(() => ALL_VENTURES.filter(v =>
    (fCohort === "All Cohorts" || String(v.cohort) === fCohort) &&
    (fSector === "All Sectors" || v.sector === fSector) &&
    (fStatus === "All Instruments" || v.fundingStatus === fStatus)
  ), [fCohort, fSector, fStatus]);

  const D = useMemo(() => derive(filtered), [filtered]);
  const activeCount = (fCohort !== "All Cohorts" ? 1 : 0) + (fSector !== "All Sectors" ? 1 : 0) + (fStatus !== "All Instruments" ? 1 : 0);

  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <PortalNav portal="hent" />

      {/* ── HEADER ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(14,70,51,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Venture Funding</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>
                Catalytic, milestone-based funding for promising student ventures
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(190,228,214,0.5)" }}>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Data source:</span> HENT Venture Portfolio</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Period:</span> {COHORTS[0]}–{COHORTS[COHORTS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{D.funded.length} ventures funded · {fmt$(D.totalFunding)} deployed</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiTile label="Capital Deployed"  num={D.totalFunding}   displayFmt={fmt$}                                Icon={Banknote}    sub="Across all tranches"
            tip="Total catalytic funding disbursed to ventures across every milestone tranche." />
          <KpiTile label="Ventures Funded"   num={D.funded.length}  displayFmt={n => String(Math.round(n))}          Icon={Rocket}      sub={`of ${filtered.length} in portfolio`}
            tip="Ventures that have received at least one tranche of catalytic funding." />
          <KpiTile label="Milestone Rate"    num={D.milestoneRate}  displayFmt={n => `${Math.round(n)}%`}            Icon={CheckCircle2} sub={`${D.milestonesDone} milestones met`}
            tip="Average share of agreed milestones delivered by funded ventures — funding is released against these." />
          <KpiTile label="Progressed to Scale" num={D.progressed}   displayFmt={n => String(Math.round(n))}          Icon={TrendingUp}  sub="Scaling or investment-ready"
            tip="Funded ventures that have advanced to the Scaling or Investment/Funding stage." />
          <KpiTile label="Jobs Created"      num={D.jobs}           displayFmt={n => Math.round(n).toLocaleString()} Icon={Users}       sub="By funded ventures"
            tip="Total jobs created to date by ventures that received catalytic funding." />
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Milestone Deployment", value: "1" },
              { label: "Over Time", value: "2" },
              { label: "Instruments & Delivery", value: "3" },
            ]}
          />
          <OutreachFilters
            accent={BRAND}
            activeCount={activeCount}
            onReset={() => { setFCohort("All Cohorts"); setFSector("All Sectors"); setFStatus("All Instruments"); }}
          >
            <OFilterSelect label="Cohort" value={fCohort} onChange={setFCohort} accent={BRAND}
              options={["All Cohorts", ...COHORTS.map(String)].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Sector" value={fSector} onChange={setFSector} accent={BRAND}
              options={["All Sectors", ...ALL_SECTORS].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Instrument" value={fStatus} onChange={setFStatus} accent={BRAND}
              options={["All Instruments", ...ALL_STATUSES].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        {/* ── SECTION 1: Milestone-based deployment ─── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SecHeader title="Milestone-Based Deployment"
            sub="What each tranche of catalytic funding is buying — validation, prototyping, customer discovery, pilots and early growth" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Capital by Milestone" sub="Funding deployed against each milestone purpose"
              info="Every tranche of catalytic funding is released against a milestone. This shows how much capital each milestone purpose — validation, prototyping, customer discovery, pilots, early growth — has absorbed.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byMilestone} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="24%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={fmt$} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={128} interval={0} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip money />} />
                  <Bar dataKey="Funding" radius={[0, 4, 4, 0]} maxBarSize={22}>
                    {D.byMilestone.map(d => <Cell key={d.name} fill={MILESTONE_HEX[d.name as Milestone]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                {D.byMilestone.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: MILESTONE_HEX[d.name as Milestone] }} />
                      {d.name}
                    </span>
                    <span className="text-gray-500 tabular-nums">
                      <b className="text-gray-700">{fmt$(d.Funding)}</b> · {d.Ventures} ventures
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Catalytic Funding Funnel" sub="From portfolio to funded, milestone-delivering and scaling ventures"
              info="How the portfolio narrows: how many ventures win catalytic funding, how many then deliver at least half their milestones, and how many go on to reach the Scale stage.">
              <Funnel steps={D.funnel} />
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {filtered.length ? Math.round(D.funded.length / filtered.length * 100) : 0}% of the portfolio has received catalytic funding
              </p>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: Deployment over time ─── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SecHeader title="Deployment Over Time" sub="Capital deployed per cohort and the cumulative catalytic investment" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Capital Deployed per Cohort" sub="Amount disbursed and ventures funded each year"
              info="Catalytic funding disbursed to each venture cohort. Useful for spotting whether recent cohorts are being funded at the same rate as earlier ones.">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={D.byCohort} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={44} tickFormatter={fmt$} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip money />} />
                  <Bar dataKey="Deployed" fill="#1B4332" radius={[4, 4, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Capital deployed", "#1B4332"]]} />
            </ChartCard>

            <ChartCard title="Cumulative Capital Deployed" sub="Running total of catalytic funding across cohorts"
              info="Running total of all catalytic capital deployed to date. A steepening line means funding is accelerating.">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={D.byCohort} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={44} tickFormatter={fmt$} />
                  <Tooltip content={<ChartTip money />} />
                  <Line type="monotone" dataKey="Cumulative" stroke="#1F9E9E" strokeWidth={2.5}
                    dot={{ r: 4, fill: "#1F9E9E", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Cumulative capital", "#1F9E9E"]]} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: Instruments, sectors, delivery ─── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SecHeader title="Instruments, Sectors & Milestone Delivery"
            sub="How capital is structured, where it lands, and whether funded ventures are hitting their milestones" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Funding Instrument Mix" sub="Ventures by funding instrument"
              info="How funded ventures are capitalised — grant, angel, VC, revenue-based or bootstrapped. Shows whether catalytic funding is crowding in other capital.">
              <DonutRing data={D.byStatus} colors={DISTINCT} total={D.funded.length} totalLabel="Funded" height={300} legendPercent />
            </ChartCard>

            <ChartCard title="Capital by Sector" sub="Catalytic funding deployed per health sector"
              info="Where catalytic capital lands across health sectors. Highlights concentration and any under-funded sectors.">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {D.bySector.map((row, i) => {
                  const col = GREEN_RAMP[i % GREEN_RAMP.length];
                  const max = D.bySector[0]?.value || 1;
                  return (
                    <div key={row.name} className="flex items-center gap-2.5">
                      <div className="w-[112px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                      <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
                        <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
                      </div>
                      <div className="text-[11px] font-bold w-12 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{fmt$(row.value)}</div>
                    </div>
                  );
                })}
                {!D.bySector.length && <p className="text-[11px] text-gray-400 text-center py-6">No funded ventures match the selected filters.</p>}
              </div>
            </ChartCard>
          </div>

          <div className="mt-4">
            <ChartCard title="Milestone Delivery — Top Funded Ventures" sub="Largest tranches and the milestone progress achieved against them"
              info="The largest recipients of catalytic funding and how much of their agreed milestone plan they have actually delivered. Low progress against a large tranche is a flag.">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-6 uppercase tracking-wider text-[9px]">Venture</th>
                      <th className="text-left text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Milestone Funded</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Capital</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Milestones</th>
                      <th className="text-left text-gray-400 font-bold pb-3 pl-2 uppercase tracking-wider text-[9px]">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {D.topFunded.map(v => (
                      <tr key={v.name} className="border-t border-gray-100">
                        <td className="py-2.5 pr-6 whitespace-nowrap font-semibold text-gray-700">{v.name}</td>
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: MILESTONE_HEX[v.milestone] }} />
                            {v.milestone}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{fmt$(v.funding)}</td>
                        <td className="py-2.5 px-2 text-center tabular-nums text-gray-600">{v.done}/{v.total}</td>
                        <td className="py-2.5 pl-2" style={{ minWidth: 120 }}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(14,70,51,0.10)" }}>
                              <div className="h-full" style={{ width: `${v.rate}%`, backgroundColor: v.rate >= 75 ? "#1B4332" : v.rate >= 50 ? "#A6C13C" : "#E9C46A" }} />
                            </div>
                            <span className="tabular-nums font-bold text-gray-600 w-8 text-right">{v.rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!D.topFunded.length && (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-6">No funded ventures match the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </section>

        <PortalFooter portal="hent" source="HENT Venture Portfolio" />

      </div>
    </div>
  );
}
