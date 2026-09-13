"use client";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import { ChartCard, SectionHeader } from "@/components/ui/hemp";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import AfricaMap from "@/components/charts/africa-map";
import { REACH_RECORDS, COUNTRY_REGION, GEO_REGIONS, GEO_COUNTRIES, GEO_YEARS } from "@/data/hemp/geo-reach";
import { useMemo, useState } from "react";

const HERO  = "#102C5E";
const BRAND = "#14306B";

export default function AtAGlancePage() {
  const [geoCountry, setGeoCountry] = useState("All Countries");
  const [geoYear, setGeoYear]       = useState("All Years");
  const [geoRegion, setGeoRegion]   = useState("All Regions");

  const geoCountryData = useMemo(() => {
    const counts = REACH_RECORDS
      .filter(r => geoRegion === "All Regions" || COUNTRY_REGION[r.country] === geoRegion)
      .filter(r => geoCountry === "All Countries" || r.country === geoCountry)
      .filter(r => geoYear === "All Years" || String(r.year) === geoYear)
      .reduce<Record<string, number>>((a, r) => { a[r.country] = (a[r.country] || 0) + r.reach; return a; }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [geoRegion, geoCountry, geoYear]);

  return (
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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>At a Glance</h1>
              <p className="text-[13px] sm:text-sm mt-2 font-medium" style={{ color: "#85B7EB" }}>
                Where HEMP is reaching, by country and region
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Period:</span> {GEO_YEARS[0]}–{GEO_YEARS[GEO_YEARS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{GEO_COUNTRIES.length} countries reached</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ── BODY ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <OutreachFilters
            accent={BRAND}
            activeCount={(geoCountry !== "All Countries" ? 1 : 0) + (geoYear !== "All Years" ? 1 : 0) + (geoRegion !== "All Regions" ? 1 : 0)}
            onReset={() => { setGeoCountry("All Countries"); setGeoYear("All Years"); setGeoRegion("All Regions"); }}
          >
            <OFilterSelect label="Country" value={geoCountry} onChange={setGeoCountry} accent={BRAND}
              options={["All Countries", ...GEO_COUNTRIES].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Year" value={geoYear} onChange={setGeoYear} accent={BRAND}
              options={["All Years", ...GEO_YEARS.map(String)].map(o => ({ value: o, label: o }))} />
            <OFilterSelect label="Region" value={geoRegion} onChange={setGeoRegion} accent={BRAND}
              options={["All Regions", ...GEO_REGIONS].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        <div>
          <SectionHeader title="Geographic Reach" sub="Where HEMP's participants come from, across HealthX, internships, SIE and career symposia" />
          <ChartCard title="Geographic Reach" sub="Participants reached by country">
            {geoCountryData.length ? (
              <AfricaMap data={geoCountryData} region={geoRegion} onRegionChange={setGeoRegion} regions={["All Regions", ...GEO_REGIONS]}
                lightColor="#C7DFFE" deepColor="#185FA5" tooltipColor="#042C53" />
            ) : (
              <p className="text-[11px] text-gray-400 text-center py-6">No records match the selected filters.</p>
            )}
            <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 text-center">
              {geoCountryData.reduce((s, d) => s + d.value, 0).toLocaleString()} people · {geoCountryData.length} countries
            </p>
          </ChartCard>
        </div>

        <PortalFooter portal="hemp" />

      </div>
    </div>
  );
}
