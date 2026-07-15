"use client";
import { InlineFilterSelect as FilterSelect } from "@/components/ui/hent";
import { PortalThemeProvider, ChartCard, SectionHeader, InfoDot, Funnel, BarList, ChartTip, ChartLegend, useCountUp } from "@/components/ui";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import SectionPills from "@/components/filters/section-pills";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import { DonutRing } from "@/components/charts/donut-chart";
import {
  exposureEvents, EXPOSURE_TYPES, STAKEHOLDER_GROUPS,
  type ExposureType, type StakeholderGroup,
} from "@/data/exposure";
import { CalendarDays, Handshake, Link2, Mic, Star, Users, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ─── Theme (HENT green) ──────────────────────────────────────────────────────
const HERO     = "#2D6A4F";
const BRAND    = "#2D6A4F";
const BRAND_DK = "#0E4633";
const GREEN_RAMP = ["#1B4332","#1F9E9E","#A6C13C","#BBD59B","#2D6A4F","#4C8C8A","#6B8E5B","#8FA45A","#40916C","#C8DDB5"];
const DISTINCT   = ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5"];

const TYPE_HEX: Record<ExposureType, string> = {
  "Pitch Event":          "#1B4332",
  "Conference":           "#1F9E9E",
  "Investor Roundtable":  "#A6C13C",
  "Ecosystem Engagement": "#40916C",
  "Demo Day":             "#BBD59B",
};

function avg(a: number[]) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }
function sum(a: number[]) { return a.reduce((x, y) => x + y, 0); }

const YEARS = Array.from(new Set(exposureEvents.map(e => e.year))).sort();
const COUNTRIES = Array.from(new Set(exposureEvents.map(e => e.country))).sort();

// ─── Derivations (filter-aware) ──────────────────────────────────────────────
function derive(rows: typeof exposureEvents) {
  const events = rows.length;
  const founders = sum(rows.map(e => e.founders));
  const femaleFounders = sum(rows.map(e => e.femaleFounders));
  const femalePct = founders ? Math.round(femaleFounders / founders * 100) : 0;
  const ventures = sum(rows.map(e => e.ventures));
  const connections = sum(rows.map(e => e.connections));
  const followUps = sum(rows.map(e => e.followUps));
  const deals = sum(rows.map(e => e.dealsInitiated));
  const mous = sum(rows.map(e => e.mousSigned));
  const investors = sum(rows.map(e => e.stakeholders.Investors));
  const visibility = parseFloat(avg(rows.map(e => e.visibilityScore)).toFixed(1));

  // Relationship funnel — the core value chain of the intervention
  const funnel = [
    { label: "Connections made",      value: connections },
    { label: "Follow-up meetings",    value: followUps },
    { label: "Deals / partnerships opened", value: deals },
    { label: "Formal agreements signed",    value: mous },
  ];

  // Events + founders reached per year
  const byYear = YEARS.map(y => {
    const rs = rows.filter(e => e.year === y);
    return {
      Year: String(y),
      Events: rs.length,
      Founders: sum(rs.map(e => e.founders)),
      Connections: sum(rs.map(e => e.connections)),
    };
  }).filter(d => d.Events > 0);

  // Events by type
  const byType = EXPOSURE_TYPES.map(t => {
    const rs = rows.filter(e => e.type === t);
    return {
      name: t,
      value: rs.length,
      Events: rs.length,
      Founders: sum(rs.map(e => e.founders)),
      Connections: sum(rs.map(e => e.connections)),
      Deals: sum(rs.map(e => e.dealsInitiated)),
      // effectiveness: deals opened per event
      DealsPerEvent: rs.length ? parseFloat((sum(rs.map(e => e.dealsInitiated)) / rs.length).toFixed(1)) : 0,
      ConnPerFounder: sum(rs.map(e => e.founders))
        ? parseFloat((sum(rs.map(e => e.connections)) / sum(rs.map(e => e.founders))).toFixed(1))
        : 0,
    };
  }).filter(d => d.Events > 0);

  // Stakeholder mix — who founders are being connected to
  const byStakeholder = STAKEHOLDER_GROUPS.map(g => ({
    name: g,
    value: sum(rows.map(e => e.stakeholders[g as StakeholderGroup])),
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  // Geographic spread
  const byCountry = COUNTRIES.map(c => {
    const rs = rows.filter(e => e.country === c);
    return { name: c, value: rs.length, founders: sum(rs.map(e => e.founders)) };
  }).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  return {
    events, founders, femalePct, ventures, connections, followUps, deals, mous,
    investors, visibility, funnel, byYear, byType, byStakeholder, byCountry,
  };
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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ExposureNetworkingPage() {
  const [fYear, setFYear]       = useState("All Years");
  const [fType, setFType]       = useState("All Types");
  const [fCountry, setFCountry] = useState("All Countries");

  const filtered = useMemo(() => exposureEvents.filter(e =>
    (fYear === "All Years" || String(e.year) === fYear) &&
    (fType === "All Types" || e.type === fType) &&
    (fCountry === "All Countries" || e.country === fCountry)
  ), [fYear, fType, fCountry]);

  const D = useMemo(() => derive(filtered), [filtered]);
  const activeCount = (fYear !== "All Years" ? 1 : 0) + (fType !== "All Types" ? 1 : 0) + (fCountry !== "All Countries" ? 1 : 0);

  const [activeSection, setActiveSection] = useState<"all" | number>("all");
  const show = (n: number) => activeSection === "all" || activeSection === n;

  return (
    <PortalThemeProvider portal="hent">
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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Exposure &amp; Networking Opportunities</h1>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(190,228,214,0.78)" }}>
                Connecting founders with investors, partners, healthcare stakeholders, policy makers and peers
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(190,228,214,0.5)" }}>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Data source:</span> HENT Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(190,228,214,0.8)", fontWeight: 600 }}>Period:</span> {YEARS[0]}–{YEARS[YEARS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{D.events} events · {D.founders} founder placements</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiTile label="Events Held"        num={D.events}      displayFmt={n => String(Math.round(n))}          Icon={CalendarDays} sub="Pitch, conference & ecosystem"
            tip="Exposure platforms delivered — pitch events, conferences, investor roundtables, ecosystem engagements and demo days." />
          <KpiTile label="Founder Placements" num={D.founders}    displayFmt={n => Math.round(n).toLocaleString()} Icon={Users}        sub={`${D.femalePct}% female founders`}
            tip="Total founder seats across all events. A founder attending two events counts twice." />
          <KpiTile label="Investors Engaged"  num={D.investors}   displayFmt={n => Math.round(n).toLocaleString()} Icon={Mic}          sub="Across all events"
            tip="Investors present across all platforms — the capital side of the room founders are being put in front of." />
          <KpiTile label="Connections Made"   num={D.connections} displayFmt={n => Math.round(n).toLocaleString()} Icon={Link2}        sub="Introductions brokered"
            tip="Introductions brokered between founders and ecosystem stakeholders. This is the top of the relationship funnel." />
          <KpiTile label="Agreements Signed"  num={D.mous}        displayFmt={n => String(Math.round(n))}          Icon={Handshake}    sub={`from ${D.deals} deals opened`}
            tip="Formal agreements (MOUs, partnerships, investments) that resulted from these introductions — the end of the funnel." />
          <KpiTile label="Visibility Score"   num={D.visibility}  displayFmt={n => `${n.toFixed(1)}/5`}            Icon={Star}         sub="Founder-rated value"
            tip="How founders themselves rate the visibility and strategic value they gained, out of 5." />
        </div>

        {/* Section pills (left) + outreach-style filters popover (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SectionPills
            accent={BRAND}
            value={activeSection === "all" ? "all" : String(activeSection)}
            onChange={(v) => setActiveSection(v === "all" ? "all" : Number(v))}
            options={[
              { label: "All Sections", value: "all" },
              { label: "Connection to Commitment", value: "1" },
              { label: "Reach Over Time", value: "2" },
              { label: "Which Platforms Work", value: "3" },
            ]}
          />
          <OutreachFilters
            accent={BRAND}
            activeCount={activeCount}
            onReset={() => { setFYear("All Years"); setFType("All Types"); setFCountry("All Countries"); }}
          >
            <OFilterSelect label="Year" value={fYear} onChange={setFYear} accent={BRAND}
              options={["All Years", ...YEARS.map(String)].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Type" value={fType} onChange={setFType} accent={BRAND}
              options={["All Types", ...EXPOSURE_TYPES].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Country" value={fCountry} onChange={setFCountry} accent={BRAND}
              options={["All Countries", ...COUNTRIES].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        {/* ── SECTION 1: Relationship funnel ─── */}
        <section style={{ display: show(1) ? undefined : "none" }}>
          <SectionHeader title="From Connection to Commitment"
            sub="Whether the introductions made at these platforms actually convert into meetings, deals and formal agreements" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Relationship Funnel" sub="Connections → follow-ups → deals opened → agreements signed"
              info="The core value chain of this intervention: an introduction is only worth something if it becomes a meeting, then a deal, then a signed agreement. The drop-off between steps shows where relationships stall.">
              <Funnel steps={D.funnel} />
              <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
                {D.connections ? Math.round(D.mous / D.connections * 100) : 0}% of introductions convert into a formal agreement
              </p>
            </ChartCard>

            <ChartCard title="Stakeholder Mix" sub="Who founders are being connected to across all platforms"
              info="The make-up of the room across all events — investors, industry partners, healthcare stakeholders, policy makers and peer founders. Reveals whether founders are meeting capital, customers or regulators.">
              <DonutRing data={D.byStakeholder} colors={DISTINCT}
                total={D.byStakeholder.reduce((s, d) => s + d.value, 0)} totalLabel="Stakeholders"
                height={300} legendPercent />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 2: Reach over time ─── */}
        <section style={{ display: show(2) ? undefined : "none" }}>
          <SectionHeader title="Reach Over Time" sub="Events delivered, founders placed and connections brokered each year" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Events & Founder Placements per Year" sub="Delivery volume year on year"
              info="How many exposure platforms were delivered each year and how many founder seats they created.">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={D.byYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={34} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="Founders" fill="#1B4332" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="Events"   fill="#A6C13C" radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
                {([["Founders", "#1B4332"], ["Events", "#A6C13C"]] as const).map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Connections Brokered per Year" sub="Introductions made between founders and ecosystem stakeholders"
              info="Introductions made each year. Rising connections without rising agreements would suggest reach is growing faster than conversion.">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={D.byYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={34} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="Connections" stroke="#1F9E9E" strokeWidth={2.5}
                    dot={{ r: 4, fill: "#1F9E9E", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend items={[["Connections brokered", "#1F9E9E"]]} />
            </ChartCard>
          </div>
        </section>

        {/* ── SECTION 3: Which platforms work ─── */}
        <section style={{ display: show(3) ? undefined : "none" }}>
          <SectionHeader title="Which Platforms Work"
            sub="Comparing pitch events, conferences, roundtables, ecosystem engagements and demo days on the connections and deals they produce" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <ChartCard title="Deals Opened per Event, by Platform Type" sub="Higher is a more deal-productive format"
              info="Average number of deals or partnership conversations opened per event, by format. Use it to decide which formats deserve more investment.">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={D.byType} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={0} angle={-12} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip cursor={{ fill: "rgba(0,33,71,0.04)" }} content={<ChartTip />} />
                  <Bar dataKey="DealsPerEvent" name="Deals per event" radius={[4, 4, 0, 0]} maxBarSize={46}>
                    {D.byType.map(d => <Cell key={d.name} fill={TYPE_HEX[d.name as ExposureType]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend items={D.byType.map(t => [t.name, TYPE_HEX[t.name as ExposureType]] as const)} />
            </ChartCard>

            <ChartCard title="Platform Comparison" sub="Events, founders reached, connections and deals by format"
              info="Side-by-side view of each format. Connections-per-founder shows how densely a format networks each founder, regardless of how many attend.">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-4 uppercase tracking-wider text-[9px]">Format</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Events</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Founders</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Connections</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Conn./Founder</th>
                      <th className="text-center text-gray-400 font-bold pb-3 px-2 uppercase tracking-wider text-[9px]">Deals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {D.byType.map(t => (
                      <tr key={t.name} className="border-t border-gray-100">
                        <td className="py-2.5 pr-4 whitespace-nowrap">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_HEX[t.name as ExposureType] }} />
                            <span className="font-semibold text-gray-700">{t.name}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center tabular-nums text-gray-700">{t.Events}</td>
                        <td className="py-2.5 px-2 text-center tabular-nums text-gray-700">{t.Founders}</td>
                        <td className="py-2.5 px-2 text-center tabular-nums text-gray-700">{t.Connections}</td>
                        <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{t.ConnPerFounder}</td>
                        <td className="py-2.5 px-2 text-center font-bold tabular-nums" style={{ color: BRAND_DK }}>{t.Deals}</td>
                      </tr>
                    ))}
                    {!D.byType.length && (
                      <tr><td colSpan={6} className="text-center text-gray-400 py-6">No events match the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>

          <div className="mt-4">
            <ChartCard title="Geographic Spread" sub="Where founders are being exposed — events and founder placements by country"
              info="Which markets founders are being exposed to. Heavy concentration in one country may limit the breadth of the networks being built.">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {D.byCountry.map((row, i) => {
                  const col = GREEN_RAMP[i % GREEN_RAMP.length];
                  const max = D.byCountry[0]?.value || 1;
                  return (
                    <div key={row.name} className="flex items-center gap-2.5">
                      <div className="w-[96px] text-[11px] text-gray-600 text-right flex-shrink-0 truncate">{row.name}</div>
                      <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: col + "1A" }}>
                        <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: col }} />
                      </div>
                      <div className="text-[11px] text-gray-500 tabular-nums w-32 flex-shrink-0 text-right">
                        <b style={{ color: col }}>{row.value}</b> events · {row.founders} founders
                      </div>
                    </div>
                  );
                })}
                {!D.byCountry.length && <p className="text-[11px] text-gray-400 text-center py-6">No events match the selected filters.</p>}
              </div>
            </ChartCard>
          </div>
        </section>

        <PortalFooter portal="hent" />

      </div>
    </div>
    </PortalThemeProvider>
  );
}
