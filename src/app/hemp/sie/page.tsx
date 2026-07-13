"use client";
import { PortalThemeProvider, ChartCard, SectionHeader, InfoDot, Funnel, BarList, ChartTip, ChartLegend } from "@/components/ui";
import PortalNav from "@/components/layout/portal-nav";
import StatsKpiCard from "@/components/ui/stat-kpi-card";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import PortalFooter from "@/components/layout/portal-footer";
import { DonutRing } from "@/components/charts/donut-chart";
import {
  sieCohorts, sieSiteVisits,
  SIE_ACTIVITIES, SIE_EXPOSURE_AREAS, SIE_DISCIPLINES, SIE_PHASES,
  type SieExposureArea, type SieDiscipline, type SiePhase,
} from "@/data/hemp/sie";
import {
  Building2, Globe2, GraduationCap, Laptop, Plane, Star, Users, type LucideIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Theme (HEMP navy, mirroring the executive) ──────────────────────────────
const HERO     = "#102C5E";
const BRAND    = "#14306B";
const SECTION  = "#185FA5";
const BRAND_DK = "#0C447C";

const PHASE_HEX: Record<SiePhase, string> = {
  "Virtual Phase":        "#479BD6",
  "In-Country Immersion": "#102C5E",
};
const EXPOSURE_HEX: Record<SieExposureArea, string> = {
  "Health System Function": "#185FA5",
  "Innovation in Practice": "#0F6E56",
  "Employment Pathways":    "#D45F2C",
};
const DISTINCT = ["#185FA5","#0F6E56","#534AB7","#BA7517","#479BD6","#1D9E75","#7F77DD","#D45F2C","#14306B","#085041"];
const RAMP     = ["#14306B","#185FA5","#2F5FD1","#378ADD","#479BD6","#85B7EB","#0F6E56","#1D9E75"];

function sum(a: number[]) { return a.reduce((x, y) => x + y, 0); }
function avg(a: number[]) { return a.length ? sum(a) / a.length : 0; }

const YEARS     = Array.from(new Set(sieCohorts.map(c => c.year))).sort();
const COUNTRIES = Array.from(new Set(sieCohorts.map(c => c.country))).sort();

// ─── Derivations (filter-aware) ──────────────────────────────────────────────
function derive(cohorts: typeof sieCohorts, visits: typeof sieSiteVisits) {
  const selected   = sum(cohorts.map(c => c.selected));
  const completed  = sum(cohorts.map(c => c.completedProgramme));
  const female     = sum(cohorts.map(c => c.female));
  const femalePct  = selected ? Math.round(female / selected * 100) : 0;
  const partners   = sum(cohorts.map(c => c.partnerOrgs));
  const projects   = sum(cohorts.map(c => c.partnerProjects));
  const adopted    = sum(cohorts.map(c => c.projectsAdopted));
  const leads      = sum(cohorts.map(c => c.employmentLeads));
  const siteVisits = sum(cohorts.map(c => c.siteVisits));
  const satisfaction = parseFloat(avg(cohorts.map(c => c.satisfaction)).toFixed(1));

  // Hybrid delivery: hours split between the virtual phase and the in-country immersion
  const byPhase = SIE_PHASES.map(p => ({
    name: p,
    value: sum(cohorts.map(c => c.hours[p])),
  }));

  // Participation funnel — application through to completion, incl. the travel step
  const funnel = [
    { label: "Applied",                 value: sum(cohorts.map(c => c.applied)) },
    { label: "Selected",                value: selected },
    { label: "Completed virtual phase", value: sum(cohorts.map(c => c.completedVirtual)) },
    { label: "Travelled in-country",    value: sum(cohorts.map(c => c.travelledInCountry)) },
    { label: "Completed programme",     value: completed },
  ];

  // The three things the immersion is designed to expose students to
  const byExposure = SIE_EXPOSURE_AREAS.map(a => ({
    name: a,
    value: parseFloat(avg(cohorts.map(c => c.exposure[a])).toFixed(1)),
  }));

  // Interdisciplinary, non-clinical intake
  const byDiscipline = SIE_DISCIPLINES.map(d => ({
    name: d,
    value: sum(cohorts.map(c => c.disciplines[d])),
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  // Three activity pillars — volume delivered
  const byActivity = [
    { name: "Site Visits",           value: siteVisits },
    { name: "Partner Projects",      value: projects },
    { name: "Structured Reflection", value: sum(cohorts.map(c => c.reflectionSessions)) },
  ];

  // Cohort-on-cohort growth
  const byYear = cohorts.map(c => ({
    Year: String(c.year),
    Selected: c.selected,
    Completed: c.completedProgramme,
    "Site Visits": c.siteVisits,
    Leads: c.employmentLeads,
  }));

  // Site visits by host type — where students are actually taken
  const byHostType = Array.from(new Set(visits.map(v => v.hostType)))
    .map(t => ({ name: t, value: visits.filter(v => v.hostType === t).length }))
    .sort((a, b) => b.value - a.value);

  // Highest-rated site visits
  const topVisits = [...visits].sort((a, b) => b.insightScore - a.insightScore).slice(0, 8);

  return {
    selected, completed, femalePct, partners, projects, adopted, leads, siteVisits, satisfaction,
    byPhase, funnel, byExposure, byDiscipline, byActivity, byYear, byHostType, topVisits,
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function SiePage() {
  const [fYear, setFYear]       = useState("All Years");
  const [fCountry, setFCountry] = useState("All Countries");

  const cohorts = useMemo(() => sieCohorts.filter(c =>
    (fYear === "All Years" || String(c.year) === fYear) &&
    (fCountry === "All Countries" || c.country === fCountry)
  ), [fYear, fCountry]);

  const visits = useMemo(() => sieSiteVisits.filter(v =>
    (fYear === "All Years" || String(v.year) === fYear) &&
    (fCountry === "All Countries" || v.country === fCountry)
  ), [fYear, fCountry]);

  const D = useMemo(() => derive(cohorts, visits), [cohorts, visits]);
  const activeCount = (fYear !== "All Years" ? 1 : 0) + (fCountry !== "All Countries" ? 1 : 0);
  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  return (
    <PortalThemeProvider portal="hemp">
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <PortalNav portal="hemp" />

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Signature Immersive Experience (SIE)</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
                A hybrid virtual + in-country immersion for non-clinical Health Missions students
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HEMP SIE Programme M&amp;E</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{D.selected} students selected · {D.siteVisits} site visits</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>2026 cohort:</span> Kenya</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatsKpiCard label="Students Selected"  num={D.selected}     sub={`${D.femalePct}% female`}                Icon={Users}         tooltip="Non-clinical Health Missions students selected onto the immersive programme." />
          <StatsKpiCard label="Completed Programme" num={D.completed}   sub="Both phases finished"                    Icon={GraduationCap} tooltip="Students who completed both the virtual phase and the in-country immersion." />
          <StatsKpiCard label="Site Visits"        num={D.siteVisits}   sub="Hospitals, startups, regulators"         Icon={Building2}     tooltip="Site visits delivered during the in-country immersion — the primary exposure mechanism." />
          <StatsKpiCard label="Partner Projects"   num={D.projects}     sub={`${D.adopted} adopted by hosts`}         Icon={Globe2}        tooltip="Partner-defined projects students worked on. 'Adopted' means the host organisation took the work forward." />
          <StatsKpiCard label="Employment Leads"   num={D.leads}        sub="Generated via immersion"                 Icon={Plane}         tooltip="Employment pathways opened for students as a direct result of the immersion." />
          <StatsKpiCard label="Satisfaction"       num={D.satisfaction} displayFmt={n => `${n.toFixed(1)}/5`} sub="Student-rated" Icon={Star} tooltip="How students rate the overall immersive experience, out of 5." />
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Hybrid Model", value: "1" },
              { label: "Exposure", value: "2" },
              { label: "Intake & Delivery", value: "3" },
              { label: "Cohort Growth", value: "4" },
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

        {/* ── SECTION 1: The hybrid model ─── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SectionHeader title="The Hybrid Model"
            sub="How the programme splits between a virtual phase and the in-country immersion, and how many students make it all the way through" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Delivery Hours by Phase" sub="Virtual phase vs in-country immersion"
              info="The programme is deliberately hybrid: a virtual phase builds context and prepares students, then the in-country immersion delivers direct exposure. This shows how the contact hours are split.">
              <DonutRing data={D.byPhase} colors={[PHASE_HEX["Virtual Phase"], PHASE_HEX["In-Country Immersion"]]}
                total={sum(D.byPhase.map(p => p.value))} totalLabel="Hours" height={300} legendPercent />
            </ChartCard>

            <ChartCard title="Participation Funnel" sub="Applied → selected → virtual → travelled → completed"
              info="Where students drop out. The travel step is the programme's biggest logistical risk — a large gap between 'completed virtual' and 'travelled in-country' points to visa, funding or scheduling failure.">
              <Funnel steps={D.funnel} />
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {D.selected ? Math.round(D.completed / D.selected * 100) : 0}% of selected students complete the full programme
              </p>
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: What students are exposed to ─── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SectionHeader title="What Students Are Exposed To"
            sub="The three things the immersion is designed to deliver — how health systems function, how innovation is applied, and what employment pathways exist" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Exposure Gain by Area" sub="Student-rated exposure, out of 5"
              info="Self-reported exposure gain against the programme's three stated aims. A low score on Employment Pathways would mean students are seeing the system but not seeing a route into it.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byExposure} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={132} interval={0} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="value" name="Exposure score" radius={[0, 4, 4, 0]} maxBarSize={26}>
                    {D.byExposure.map(d => <Cell key={d.name} fill={EXPOSURE_HEX[d.name as SieExposureArea]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={SIE_EXPOSURE_AREAS.map(a => [a, EXPOSURE_HEX[a]] as const)} />
            </ChartCard>

            <ChartCard title="Site Visits by Host Type" sub="Where students are actually taken"
              info="The mix of hosts determines what students see. Referral hospitals show how the system functions; startups show innovation in practice; regulators and manufacturers reveal employment pathways.">
              <DonutRing data={D.byHostType} colors={DISTINCT}
                total={sum(D.byHostType.map(h => h.value))} totalLabel="Visits" height={300} legendPercent />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: Interdisciplinary intake & delivery ─── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SectionHeader title="Interdisciplinary Intake & Delivery"
            sub="The programme is explicitly for non-clinical students — this is the mix of disciplines it draws, and the activity pillars it delivers" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Participants by Discipline" sub="Non-clinical, interdisciplinary intake"
              info="SIE is designed for non-clinical students. A healthy spread across business, engineering, computing and policy is the point — concentration in one discipline would undercut the interdisciplinary design.">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {D.byDiscipline.map((row, i) => {
                  const col = RAMP[i % RAMP.length];
                  const max = D.byDiscipline[0]?.value || 1;
                  return (
                    <div key={row.name} className="flex items-center gap-2.5">
                      <div className="w-[132px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                      <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
                        <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
                      </div>
                      <div className="text-[11px] font-bold w-6 flex-shrink-0 tabular-nums text-right" style={{ color: col }}>{row.value}</div>
                    </div>
                  );
                })}
                {!D.byDiscipline.length && <p className="text-[11px] text-gray-400 text-center py-6">No cohorts match the selected filters.</p>}
              </div>
            </ChartCard>

            <ChartCard title="Activity Pillars Delivered" sub="Site visits · partner projects · structured reflection"
              info="The three delivery mechanisms named in the programme design. Reflection sessions are what convert raw exposure into articulated learning — a low count here means students are seeing a lot but processing little.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byActivity} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="value" name="Delivered" radius={[4, 4, 0, 0]} maxBarSize={56}>
                    {D.byActivity.map((d, i) => <Cell key={d.name} fill={["#185FA5", "#0F6E56", "#534AB7"][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={SIE_ACTIVITIES.map((a, i) => [a, ["#185FA5", "#0F6E56", "#534AB7"][i]] as const)} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 4: Cohort growth & top visits ─── */}
        <section style={{ display: show(4) ? undefined : "none" }}>
          <SectionHeader title="Cohort Growth & Highest-Value Visits"
            sub="How the programme has scaled cohort on cohort, and which site visits students rated most valuable" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Cohort Growth" sub="Students selected, completed and employment leads per cohort"
              info="Cohort-on-cohort scale. Employment leads growing faster than intake would mean the programme is getting better at converting exposure into opportunity.">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={D.byYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="Selected"  fill="#14306B" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="Completed" fill="#479BD6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="Leads"     fill="#D45F2C" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Selected", "#14306B"], ["Completed", "#479BD6"], ["Employment Leads", "#D45F2C"]]} />
            </ChartCard>

            <ChartCard title="Highest-Rated Site Visits" sub="Which hosts students found most valuable"
              info="Student-rated insight value of each site visit, out of 5. Use it to decide which hosts to prioritise for the next cohort.">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-4 uppercase tracking-wider text-[9px]">Host</th>
                      <th className="text-left text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Focus</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Students</th>
                      <th className="text-center text-gray-400 font-bold pb-3 pl-2 uppercase tracking-wider text-[9px]">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {D.topVisits.map(v => (
                      <tr key={v.id} className="border-t border-gray-100">
                        <td className="py-2.5 pr-4 whitespace-nowrap font-semibold text-gray-700">{v.host}</td>
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: EXPOSURE_HEX[v.focus] }} />
                            {v.focus}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center tabular-nums text-gray-600">{v.students}</td>
                        <td className="py-2.5 pl-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{v.insightScore}/5</td>
                      </tr>
                    ))}
                    {!D.topVisits.length && (
                      <tr><td colSpan={4} className="text-center text-gray-400 py-6">No site visits match the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </section>

        <PortalFooter portal="hemp" source="HEMP SIE Programme M&amp;E" />

      </div>
    </div>
  );
}
