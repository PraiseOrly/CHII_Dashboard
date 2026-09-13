"use client";
import HeaderDesign from "@/components/layout/header-design";
import FeaturedImpactStory from "@/components/layout/featured-impact-story";
import AfricaChoropleth from "@/components/executive/africa-choropleth";
import { missionStudents } from "@/data/hemp/mission-students";

export default function AtAGlancePage() {
  const countries = new Set(missionStudents.map(s => s.country)).size;

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <HeaderDesign />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>At a Glance</h1>
            </div>
            <p className="text-[13px] sm:text-sm mt-2 font-medium" style={{ color: "#85B7EB" }}>
              Where CHII is reaching, across HEMP, HENT &amp; HECO programs
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px]" style={{ color: "rgba(255,255,255,0.85)" }}>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Data source:</span> CHII MELA Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(255,255,255,0.98)", fontWeight: 700 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
          <div style={{ backgroundColor: "#14306B", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>Geographic Reach</p>
          </div>
          <div style={{ padding: "16px 24px 20px" }}>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 14 }}>
              Mission student enrollment, graduation and employment outcomes across {countries} countries
            </p>
            <AfricaChoropleth />
          </div>
        </div>

        {/* Footer */}
        <FeaturedImpactStory footer />

      </div>
    </div>
  );
}
