"use client";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import { ChartTip, ChartLegend } from "@/components/ui";
import { CHART } from "@/theme/tokens";
import { DonutRing } from "@/components/charts/donut-chart";
import { fellows, craHackathons, researchPartnerships, CRA_PILLARS } from "@/data/heco/cra";
import { Banknote, BookOpen, GraduationCap, Handshake, Rocket, Users } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Theme (executive navy) ──────────────────────────────────────────────────
const HERO     = "#102C5E";
const BRAND    = "#14306B";
const SECTION  = "#185FA5";
const BRAND_DK = "#0C447C";

const PILLAR_HEX: Record<string, string> = {
  "Public Sector Fellowship": "#14306B",
  "Student Hackathons":       "#0F6E56",
  "Public Health Research":   "#D45F2C",
};
const RAMP = ["#14306B","#185FA5","#2F5FD1","#378ADD","#479BD6","#85B7EB","#0F6E56","#1D9E75"];

function s(a: number[]) { return a.reduce((x, y) => x + y, 0); }
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${n}`;
}

const YEARS = Array.from(new Set([
  ...fellows.map(f => f.cohort),
  ...craHackathons.map(h => h.year),
  ...researchPartnerships.map(p => p.yearEstablished),
])).sort();
const COUNTRIES = Array.from(new Set([
  ...fellows.map(f => f.country),
  ...craHackathons.map(h => h.country),
  ...researchPartnerships.map(p => p.country),
])).sort();

// ─── Derivations (filter-aware) ──────────────────────────────────────────────
function derive(
  fl: typeof fellows,
  hk: typeof craHackathons,
  rp: typeof researchPartnerships,
) {
  const funding      = s(fl.map(f => f.funding));
  const participants = s(hk.map(h => h.participants));
  const ventures     = s(hk.map(h => h.venturesIncubated));
  const studies      = s(rp.map(p => p.studies));
  const adoptions    = s(rp.map(p => p.policyAdoptions));

  // How many people / institutions each pillar touches
  const reachByPillar = [
    { name: "Public Sector Fellowship", value: fl.length },
    { name: "Student Hackathons",       value: participants },
    { name: "Public Health Research",   value: rp.length },
  ].filter(d => d.value > 0);

  // Each pillar's own primary output (different units — read as three scorecards)
  const outputByPillar = [
    { name: "Public Sector Fellowship", Output: s(fl.map(f => f.publications)) },
    { name: "Student Hackathons",       Output: ventures },
    { name: "Public Health Research",   Output: studies },
  ];

  const byYear = YEARS.map(y => ({
    Year: String(y),
    Fellows:  fl.filter(f => f.cohort === y).length,
    Ventures: s(hk.filter(h => h.year === y).map(h => h.venturesIncubated)),
    Studies:  s(rp.filter(p => p.yearEstablished === y).map(p => p.studies)),
  })).filter(d => d.Fellows + d.Ventures + d.Studies > 0);

  const byCountry = COUNTRIES.map(c => ({
    name: c,
    value: fl.filter(f => f.country === c).length
         + hk.filter(h => h.country === c).length
         + rp.filter(p => p.country === c).length,
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  // The mandate as a chain: fellows → mentorship → ventures → research → policy
  const chain = [
    { label: "Executives upskilled (Fellows)", value: fl.length },
    { label: "Students reached (Hackathons)",  value: participants },
    { label: "Ventures incubated",             value: ventures },
    { label: "Research studies run",           value: studies },
    { label: "Adopted into policy",            value: adoptions },
  ];

  return {
    fellows: fl.length, funding, participants, ventures, studies, adoptions,
    partnerships: rp.length,
    reachByPillar, outputByPillar, byYear, byCountry, chain,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function InfoDot({ tip, color = BRAND }: { tip: string; color?: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: `${color}22`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color, lineHeight: 1, userSelect: "none" }}>i</span>
      {show && (
        <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", color: "#111827", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 210, boxShadow: "0 6px 20px rgba(0,0,0,0.22)", zIndex: 100, textAlign: "left", pointerEvents: "none", fontWeight: 400 }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function SecHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: SECTION }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: SECTION }}>{title}</p>
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
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
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

/** Values across the chain differ hugely in scale, so bars are sized against the max. */
function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const barMax = Math.max(...steps.map(x => x.value)) || 1;
  return (
    <div className="space-y-2.5">
      {steps.map((step, i) => {
        const pct = Math.max(6, Math.round((step.value / barMax) * 100));
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-gray-700">{step.label}</span>
              <span className="font-bold tabular-nums" style={{ color: BRAND_DK }}>{step.value.toLocaleString()}</span>
            </div>
            <div className="h-6 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(20,48,107,0.08)" }}>
              <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: BRAND_DK, opacity: 1 - i * 0.13 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HecoOverviewPage() {
  const [fYear, setFYear]       = useState("All Years");
  const [fCountry, setFCountry] = useState("All Countries");

  const fl = useMemo(() => fellows.filter(f =>
    (fYear === "All Years" || String(f.cohort) === fYear) &&
    (fCountry === "All Countries" || f.country === fCountry)
  ), [fYear, fCountry]);
  const hk = useMemo(() => craHackathons.filter(h =>
    (fYear === "All Years" || String(h.year) === fYear) &&
    (fCountry === "All Countries" || h.country === fCountry)
  ), [fYear, fCountry]);
  const rp = useMemo(() => researchPartnerships.filter(p =>
    (fYear === "All Years" || String(p.yearEstablished) === fYear) &&
    (fCountry === "All Countries" || p.country === fCountry)
  ), [fYear, fCountry]);

  const D = useMemo(() => derive(fl, hk, rp), [fl, hk, rp]);
  const activeCount = (fYear !== "All Years" ? 1 : 0) + (fCountry !== "All Countries" ? 1 : 0);

  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <PortalNav portal="heco" />

      {/* ── HEADER ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HERO, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design2.png" alt="" aria-hidden="true"
            style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Overview</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
                The ecosystem mandate across its three core pillars — fellowship, hackathons and public health research
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HECO Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>3 pillars tracked</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 04 Jun 2026, 16:30 EAT</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatsKpiCard label="Fellows"            num={D.fellows}      sub="Healthcare executives"                Icon={GraduationCap} tooltip="Healthcare executives upskilled through the Public Sector Fellowship — Pillar 1." />
          <StatsKpiCard label="Funding Awarded"    num={D.funding}      displayFmt={fmt$} sub="Operational funding" Icon={Banknote}      tooltip="Operational funding awarded to fellows to run their work." />
          <StatsKpiCard label="Students Reached"   num={D.participants} sub="Via CRA hackathons"                   Icon={Users}         tooltip="Students who took part in the Fellow-mentored hackathons — Pillar 2." />
          <StatsKpiCard label="Ventures Incubated" num={D.ventures}     sub="From student hackathons"              Icon={Rocket}        tooltip="Student ventures incubated out of the hackathons, with Fellow mentorship." />
          <StatsKpiCard label="Research Studies"   num={D.studies}      sub={`${D.adoptions} adopted into policy`} Icon={BookOpen}      tooltip="Context-specific public health studies run with regional health authorities — Pillar 3." />
          <StatsKpiCard label="Partnerships"       num={D.partnerships} sub="Regional health authorities"          Icon={Handshake}     tooltip="Structural partnerships underpinning the research pillar." />
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "The Three Pillars", value: "1" },
              { label: "Activity Over Time", value: "2" },
              { label: "Geographic Reach", value: "3" },
            ]}
          />
          <OutreachFilters
            accent={BRAND}
            activeCount={activeCount}
            onReset={() => { setFYear("All Years"); setFCountry("All Countries"); }}
          >
            <OFilterSelect label="Year" value={fYear} onChange={setFYear} accent={BRAND}
              options={["All Years", ...YEARS.map(String)].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Country" value={fCountry} onChange={setFCountry} accent={BRAND}
              options={["All Countries", ...COUNTRIES].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        {/* ── SECTION 1: The three pillars ─── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SecHeader title="The Three Pillars"
            sub="The Centre advances its ecosystem mandate through the Public Sector Fellowship, Fellow-mentored student hackathons, and public health research partnerships" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Reach by Pillar" sub="Fellows, hackathon students and research partnerships"
              info="How many people or institutions each pillar touches. The hackathon pillar reaches the most people; the fellowship reaches the most senior ones.">
              <DonutRing data={D.reachByPillar} colors={D.reachByPillar.map(d => PILLAR_HEX[d.name])}
                total={D.reachByPillar.reduce((n, d) => n + d.value, 0)} totalLabel="Reached"
                height={300} legendPercent />
            </ChartCard>

            <ChartCard title="The Ecosystem Chain" sub="Executives upskilled → students reached → ventures incubated → research → policy"
              info="The mandate is a chain, not three separate programmes: Fellows are upskilled, they mentor students, students build ventures, and research partnerships push findings into policy.">
              <Funnel steps={D.chain} />
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                Each pillar feeds the next — Fellows mentor the hackathons that incubate the ventures
              </p>
            </ChartCard>
          </div>

          <div className="mt-4">
            <ChartCard title="Headline Output per Pillar" sub="Publications (fellowship) · ventures (hackathons) · studies (research)"
              info="Each pillar's own primary output. These are different units, so read them as three separate scorecards rather than a like-for-like comparison.">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={D.outputByPillar} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="34%">
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={CHART.axisTick} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Output" name="Output" radius={[4, 4, 0, 0]} maxBarSize={64}>
                    {D.outputByPillar.map(d => <Cell key={d.name} fill={PILLAR_HEX[d.name]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={CRA_PILLARS.map(p => [p, PILLAR_HEX[p]] as const)} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: Activity over time ─── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SecHeader title="Activity Over Time" sub="How the three pillars have scaled year on year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Pillar Activity per Year" sub="Fellows enrolled, ventures incubated and studies run"
              info="All three pillars growing together is the healthy pattern — the fellowship should lead, since Fellows are the mentors who make the hackathons work.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} vertical={false} />
                  <XAxis dataKey="Year" tick={CHART.axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART.axisTick} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Fellows"  fill={PILLAR_HEX["Public Sector Fellowship"]} radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="Ventures" fill={PILLAR_HEX["Student Hackathons"]}       radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="Studies"  fill={PILLAR_HEX["Public Health Research"]}   radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[
                ["Fellows", PILLAR_HEX["Public Sector Fellowship"]],
                ["Ventures", PILLAR_HEX["Student Hackathons"]],
                ["Studies", PILLAR_HEX["Public Health Research"]],
              ]} />
            </ChartCard>

            <ChartCard title="Cumulative Ecosystem Output" sub="Ventures incubated and research studies, running total"
              info="The compounding effect of the mandate. A flattening line means the ecosystem is delivering less each year, not more.">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={D.byYear.map((d, i, arr) => ({
                  Year: d.Year,
                  Ventures: arr.slice(0, i + 1).reduce((n, x) => n + x.Ventures, 0),
                  Studies:  arr.slice(0, i + 1).reduce((n, x) => n + x.Studies, 0),
                }))} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} vertical={false} />
                  <XAxis dataKey="Year" tick={CHART.axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART.axisTick} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="Ventures" stroke={PILLAR_HEX["Student Hackathons"]} strokeWidth={2.5}
                    dot={{ r: 4, fill: PILLAR_HEX["Student Hackathons"], strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Studies" stroke={PILLAR_HEX["Public Health Research"]} strokeWidth={2.5}
                    dot={{ r: 4, fill: PILLAR_HEX["Public Health Research"], strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[
                ["Cumulative ventures", PILLAR_HEX["Student Hackathons"]],
                ["Cumulative studies", PILLAR_HEX["Public Health Research"]],
              ]} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: Geographic reach ─── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SecHeader title="Geographic Reach"
            sub="Where the ecosystem mandate is active — fellows, hackathons and research partnerships by country" />
          <ChartCard title="Ecosystem Footprint by Country" sub="Combined count of fellows, hackathons and research partnerships"
            info="Concentration in one country limits the 'ecosystem' claim. Breadth across health authorities is what makes the research pillar structural rather than local.">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {D.byCountry.map((row, i) => {
                const col = RAMP[i % RAMP.length];
                const max = D.byCountry[0]?.value || 1;
                return (
                  <div key={row.name} className="flex items-center gap-2.5">
                    <div className="w-[110px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                    <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
                      <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
                    </div>
                    <div className="text-[11px] font-bold w-6 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
                  </div>
                );
              })}
              {!D.byCountry.length && <p className="text-[11px] text-gray-400 text-center py-6">No records match the selected filters.</p>}
            </div>
            <ChartLegend items={D.byCountry.map((c, i) => [c.name, RAMP[i % RAMP.length]] as const)} />
          </ChartCard>
        </section>

        <PortalFooter portal="heco" source="HECO Consolidated Database" />
      </div>
    </div>
  );
}
