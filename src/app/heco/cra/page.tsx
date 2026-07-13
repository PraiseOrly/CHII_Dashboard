"use client";
import { PortalThemeProvider, ChartCard, SectionHeader, InfoDot, Funnel, BarList, ChartTip, ChartLegend } from "@/components/ui";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import { CHART } from "@/theme/tokens";
import { DonutRing } from "@/components/charts/donut-chart";
import {
  fellows, craHackathons, researchPartnerships,
  FELLOWSHIP_SUPPORTS, EXEC_ROLES, RESEARCH_THEMES,
  type ResearchTheme, type ExecRole,
} from "@/data/heco/cra";
import {
  Banknote, BookOpen, Building2, FileText, GraduationCap,
  Handshake, Lightbulb, Rocket, Users, type LucideIcon,
} from "lucide-react";
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

/** One colour per pillar, used consistently across the page. */
const PILLAR_HEX = {
  "Public Sector Fellowship": "#14306B",
  "Student Hackathons":       "#0F6E56",
  "Public Health Research":   "#D45F2C",
} as const;

const PUB_HEX = { Published: "#0F6E56", "Under Review": "#185FA5", "In Progress": "#BA7517" } as const;
const DISTINCT = ["#185FA5","#0F6E56","#534AB7","#BA7517","#479BD6","#1D9E75","#7F77DD","#D45F2C","#14306B","#085041"];
const RAMP     = ["#14306B","#185FA5","#2F5FD1","#378ADD","#479BD6","#85B7EB","#0F6E56","#1D9E75"];

function s(a: number[]) { return a.reduce((x, y) => x + y, 0); }
function fmt$(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${n}`;
}

const COHORTS   = Array.from(new Set(fellows.map(f => f.cohort))).sort();
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
  // Pillar 1 — Public Sector Fellowship
  const funding      = s(fl.map(f => f.funding));
  const trainingHrs  = s(fl.map(f => f.trainingHours));
  const publications = s(fl.map(f => f.publications));
  const femalePct    = fl.length ? Math.round(fl.filter(f => f.gender === "Female").length / fl.length * 100) : 0;

  // Pillar 2 — Student Hackathons (Fellow-mentored)
  const participants = s(hk.map(h => h.participants));
  const ventures     = s(hk.map(h => h.venturesIncubated));
  const activeVents  = s(hk.map(h => h.venturesStillActive));
  const mentorHours  = s(hk.map(h => h.mentorshipHours));

  // Pillar 3 — Public Health Research
  const studies      = s(rp.map(p => p.studies));
  const researchPubs = s(rp.map(p => p.publications));
  const policyBriefs = s(rp.map(p => p.policyBriefs));
  const adoptions    = s(rp.map(p => p.policyAdoptions));
  const dataAgreements = rp.filter(p => p.dataAgreement).length;

  // The three supports the fellowship provides
  const bySupport = [
    { name: "Operational Funding",  value: funding },
    { name: "Research Training",    value: trainingHrs },
    { name: "Publication Guidance", value: publications },
  ];

  // Publication pipeline — the fellowship's academic output
  const byPubStage = (["In Progress", "Under Review", "Published"] as const)
    .map(st => ({ name: st, value: fl.filter(f => f.publicationStage === st).length }))
    .filter(d => d.value > 0);

  // Which executive roles the fellowship is reaching
  const byRole = EXEC_ROLES
    .map(r => ({ name: r, value: fl.filter(f => f.role === r).length }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Fellowship growth per cohort
  const byCohort = COHORTS.map(c => {
    const rows = fl.filter(f => f.cohort === c);
    return {
      Year: String(c),
      Fellows: rows.length,
      Funding: s(rows.map(f => f.funding)),
      Publications: s(rows.map(f => f.publications)),
    };
  }).filter(d => d.Fellows > 0);

  // Pillar 1 → Pillar 2 link: Fellows mentoring student hackathon teams
  const hackByYear = hk.map(h => ({
    Year: String(h.year),
    Participants: h.participants,
    "Fellow Mentors": h.fellowMentors,
    Ventures: h.venturesIncubated,
  }));

  // The venture incubation funnel
  const ventureFunnel = [
    { label: "Hackathon participants", value: participants },
    { label: "Teams formed",           value: s(hk.map(h => h.teams)) },
    { label: "Ventures incubated",     value: ventures },
    { label: "Ventures still active",  value: activeVents },
  ];

  // Pillar 3 — research by theme
  const byTheme = RESEARCH_THEMES
    .map(t => ({
      name: t,
      value: s(rp.filter(p => p.theme === t).map(p => p.studies)),
      Publications: s(rp.filter(p => p.theme === t).map(p => p.publications)),
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Research → policy translation funnel
  const researchFunnel = [
    { label: "Studies run",        value: studies },
    { label: "Publications",       value: researchPubs },
    { label: "Policy briefs",      value: policyBriefs },
    { label: "Adopted into policy", value: adoptions },
  ];

  // Partnerships by authority type — the "structural" part of the mandate
  const byPartnerType = Array.from(new Set(rp.map(p => p.type)))
    .map(t => ({ name: t, value: rp.filter(p => p.type === t).length }))
    .sort((a, b) => b.value - a.value);

  return {
    fellows: fl.length, funding, trainingHrs, publications, femalePct,
    participants, ventures, activeVents, mentorHours,
    studies, researchPubs, policyBriefs, adoptions, dataAgreements, partnerships: rp.length,
    bySupport, byPubStage, byRole, byCohort, hackByYear, ventureFunnel,
    byTheme, researchFunnel, byPartnerType,
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CraPage() {
  const [fCohort, setFCohort]   = useState("All Cohorts");
  const [fCountry, setFCountry] = useState("All Countries");

  const fl = useMemo(() => fellows.filter(f =>
    (fCohort === "All Cohorts" || String(f.cohort) === fCohort) &&
    (fCountry === "All Countries" || f.country === fCountry)
  ), [fCohort, fCountry]);

  const hk = useMemo(() => craHackathons.filter(h =>
    (fCohort === "All Cohorts" || String(h.year) === fCohort) &&
    (fCountry === "All Countries" || h.country === fCountry)
  ), [fCohort, fCountry]);

  const rp = useMemo(() => researchPartnerships.filter(p =>
    (fCohort === "All Cohorts" || String(p.yearEstablished) === fCohort) &&
    (fCountry === "All Countries" || p.country === fCountry)
  ), [fCohort, fCountry]);

  const D = useMemo(() => derive(fl, hk, rp), [fl, hk, rp]);
  const activeCount = (fCohort !== "All Cohorts" ? 1 : 0) + (fCountry !== "All Countries" ? 1 : 0);

  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  return (
    <PortalThemeProvider portal="heco">
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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>CRA Programme</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
                Three pillars — Public Sector Fellowship, Fellow-mentored student hackathons, and public health research partnerships
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HECO CRA Programme M&amp;E</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {COHORTS[0]}–{COHORTS[COHORTS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{D.fellows} fellows · {D.ventures} ventures · {D.partnerships} partnerships</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatsKpiCard label="Fellows"            num={D.fellows}      sub={`${D.femalePct}% female executives`} Icon={GraduationCap} tooltip="Healthcare executives upskilled through the Public Sector Fellowship." />
          <StatsKpiCard label="Operational Funding" num={D.funding}     displayFmt={fmt$} sub="Awarded to fellows"  Icon={Banknote}     tooltip="Operational funding awarded to fellows to run their work — one of the fellowship's three supports." />
          <StatsKpiCard label="Publications"       num={D.publications + D.researchPubs} sub="Fellowship + research" Icon={FileText}   tooltip="Academic publications produced by fellows and through research partnerships." />
          <StatsKpiCard label="Ventures Incubated" num={D.ventures}     sub={`${D.activeVents} still active`}      Icon={Rocket}       tooltip="Student ventures incubated out of the Fellow-mentored hackathons." />
          <StatsKpiCard label="Research Studies"   num={D.studies}      sub={`${D.adoptions} adopted into policy`} Icon={BookOpen}     tooltip="Context-specific public health studies run with regional health authorities." />
          <StatsKpiCard label="Partnerships"       num={D.partnerships} sub={`${D.dataAgreements} with data agreements`} Icon={Handshake} tooltip="Structural partnerships with regional health authorities, ministries and research institutes." />
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Public Sector Fellowship", value: "1" },
              { label: "Student Hackathons", value: "2" },
              { label: "Public Health Research", value: "3" },
            ]}
          />
          <OutreachFilters
            accent={BRAND}
            activeCount={activeCount}
            onReset={() => { setFCohort("All Cohorts"); setFCountry("All Countries"); }}
          >
            <OFilterSelect label="Cohort" value={fCohort} onChange={setFCohort} accent={BRAND}
              options={["All Cohorts", ...COHORTS.map(String)].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Country" value={fCountry} onChange={setFCountry} accent={BRAND}
              options={["All Countries", ...COUNTRIES].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        {/* ══ PILLAR 1: PUBLIC SECTOR FELLOWSHIP ══════════════════════════════ */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SectionHeader title="Pillar 1 — Public Sector Fellowship"
            sub="Upskilling healthcare executives through operational funding, research training and guidance in academic publication" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Publication Pipeline" sub="Where fellows' academic work has reached"
              info="Publication guidance is one of the fellowship's three supports. A pipeline stuck at 'In Progress' means fellows are being trained but not getting published.">
              <DonutRing data={D.byPubStage} colors={D.byPubStage.map(d => PUB_HEX[d.name as keyof typeof PUB_HEX])}
                total={D.byPubStage.reduce((n, d) => n + d.value, 0)} totalLabel="Fellows" height={300} legendPercent />
            </ChartCard>

            <ChartCard title="Executive Roles Reached" sub="The seniority and function of fellows"
              info="The fellowship targets healthcare executives. A spread across hospital directors, ministry officials and regulators means the programme is reaching real decision-makers.">
              <BarList data={D.byRole} colors={RAMP} labelWidth={172} />
              <ChartLegend items={D.byRole.map((r, i) => [r.name, RAMP[i % RAMP.length]] as const)} />
            </ChartCard>
          </div>

          <div className="mt-4">
            <ChartCard title="Fellowship Growth per Cohort" sub="Fellows enrolled, operational funding awarded and publications produced"
              info="Watch whether publications keep pace with fellow numbers — if intake grows but publications flatten, the publication-guidance support is the bottleneck.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byCohort} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} vertical={false} />
                  <XAxis dataKey="Year" tick={CHART.axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART.axisTick} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Fellows"      fill="#14306B" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="Publications" fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Fellows", "#14306B"], ["Publications", "#0F6E56"]]} />
            </ChartCard>
          </div>
        </section>

        {/* ══ PILLAR 2: STUDENT HACKATHONS ════════════════════════════════════ */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SectionHeader title="Pillar 2 — Student Hackathons"
            sub="Hackathons supported by the Fellows through mentorship, to incubate student ventures — this is where Pillar 1 feeds Pillar 2" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Venture Incubation Funnel" sub="Participants → teams → ventures incubated → still active"
              info="The survival step matters most: ventures incubated is a delivery number, ventures still active is an impact number.">
              <Funnel steps={D.ventureFunnel} color={PILLAR_HEX["Student Hackathons"]} />
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {D.ventures ? Math.round(D.activeVents / D.ventures * 100) : 0}% of incubated ventures are still active
              </p>
            </ChartCard>

            <ChartCard title="Fellow Mentorship Driving Ventures" sub="Participants, Fellow mentors and ventures incubated per hackathon"
              info="The link between the two pillars: Fellows from the Public Sector Fellowship mentor the student teams. More Fellow mentors should track with more ventures incubated.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.hackByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="26%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} vertical={false} />
                  <XAxis dataKey="Year" tick={CHART.axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART.axisTick} axisLine={false} tickLine={false} width={34} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="Participants"   fill="#85B7EB" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="Fellow Mentors" fill="#14306B" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="Ventures"       fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Participants", "#85B7EB"], ["Fellow mentors", "#14306B"], ["Ventures incubated", "#0F6E56"]]} />
            </ChartCard>
          </div>
        </section>

        {/* ══ PILLAR 3: PUBLIC HEALTH RESEARCH ════════════════════════════════ */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SectionHeader title="Pillar 3 — Public Health Research"
            sub="Accelerating context-specific research through structural partnerships with regional health authorities" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Research-to-Policy Funnel" sub="Studies → publications → policy briefs → adopted into policy"
              info="Research only counts as ecosystem impact if it reaches policy. The final step — adoption by a health authority — is the one that matters.">
              <Funnel steps={D.researchFunnel} color={PILLAR_HEX["Public Health Research"]} />
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {D.studies ? Math.round(D.adoptions / D.studies * 100) : 0}% of studies have been adopted into policy
              </p>
            </ChartCard>

            <ChartCard title="Partner Authorities by Type" sub="Who the structural partnerships are with"
              info="'Structural' means formal, standing partnerships with the bodies that set health policy — not one-off research collaborations.">
              <DonutRing data={D.byPartnerType} colors={DISTINCT}
                total={D.byPartnerType.reduce((n, d) => n + d.value, 0)} totalLabel="Partners" height={300} legendPercent />
            </ChartCard>
          </div>

          <div className="mt-4">
            <ChartCard title="Research by Theme" sub="Studies and publications per context-specific research theme"
              info="Where the research effort is concentrated. Themes with studies but no publications are where the acceleration mandate is falling short.">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={D.byTheme} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="24%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.gridStroke} horizontal={false} />
                  <XAxis type="number" tick={CHART.axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: "#6B7280" }} axisLine={false} tickLine={false} width={160} interval={0} />
                  <Tooltip cursor={CHART.tipCursor} content={<ChartTip />} />
                  <Bar dataKey="value"        name="Studies"      fill="#D45F2C" radius={[0, 4, 4, 0]} maxBarSize={16} />
                  <Bar dataKey="Publications" name="Publications" fill="#0F6E56" radius={[0, 4, 4, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Studies", "#D45F2C"], ["Publications", "#0F6E56"]]} />
            </ChartCard>
          </div>
        </section>

        <PortalFooter portal="heco" source="HECO CRA Programme M&amp;E" />
      </div>
    </div>
  );
}
