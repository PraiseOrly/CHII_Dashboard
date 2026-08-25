"use client";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import OutreachFilters, { FilterSelect as OFilterSelect } from "@/components/filters/filter-popover";
import GlobalHealthSection, { GH_YEARS } from "@/components/hemp/global-health-section";
import { ghCohorts } from "@/data/hemp/global-health";
import { useMemo, useState } from "react";

const HERO = "#102C5E";
const BRAND = "#14306B";

export default function CoursePage() {
  const [fYear, setFYear] = useState("All Years");

  const totalEnrolled = useMemo(
    () => ghCohorts.reduce((sum, c) => sum + c.enrolled, 0),
    [],
  );

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
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Introduction to Global Health</h1>
              <p className="text-[13px] sm:text-sm mt-2 font-medium" style={{ color: "#85B7EB" }}>
                The foundational course mission students take, and the doors it opens into ventures, research and internships
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Period:</span> {GH_YEARS[0]}–{GH_YEARS[GH_YEARS.length - 1]}</span>
                <span aria-hidden="true">·</span>
                <span>{totalEnrolled} students enrolled</span>
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
            activeCount={fYear !== "All Years" ? 1 : 0}
            onReset={() => setFYear("All Years")}
          >
            <OFilterSelect label="Year" value={fYear} onChange={setFYear} accent={BRAND}
              options={["All Years", ...GH_YEARS.map(String)].map(o => ({ value: o, label: o }))} />
          </OutreachFilters>
        </div>

        <GlobalHealthSection year={fYear} />

        <PortalFooter portal="hemp" />

      </div>
    </div>
  );
}
