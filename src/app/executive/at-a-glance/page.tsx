"use client";
import { useState, useEffect, useRef, type ComponentType } from "react";
import { Info, ChevronRight } from "lucide-react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import HeaderDesign from "@/components/layout/header-design";
import FeaturedImpactStory from "@/components/layout/featured-impact-story";
import { OUTREACH_PARTICIPANTS } from "@/data/executive/outreach";
import { missionStudents } from "@/data/hemp/mission-students";
import { Users, BookOpen, Briefcase, TrendingUp, Zap, Target, Award, MessageCircle } from "lucide-react";

/* ─ Colors ─ */
const HEADER_NAVY = "#102C5E"; // Primary brand navy (from header)
const RED_FEMALE = "#DC2626"; // Female red
const BLUE_MALE = "#479BD6"; // Male blue
const GREEN_UP = "#16A34A"; // Green for positive YoY
const RED_DOWN = "#DC2626"; // Red for negative YoY

/* ─ KPI Card Component (Compact, clean white with strong brand icons) ─ */
function KPICard({
  label,
  value,
  yoy,
  femalePct,
  malePct,
  info,
  Icon,
  href,
}: {
  label: string;
  value: number | string;
  yoy?: number | null;
  femalePct?: number;
  malePct?: number;
  info?: string;
  Icon?: ComponentType<any>;
  href?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{
        backgroundColor: `rgba(16, 44, 94, 0.06)`,
        borderRadius: 8,
        border: `1px solid rgba(16, 44, 94, 0.16)`,
        padding: 14,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: 130,
        boxShadow: "0 1px 3px rgba(16, 44, 94, 0.1)",
        transition: "all 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `rgba(16, 44, 94, 0.10)`;
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(16, 44, 94, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `rgba(16, 44, 94, 0.06)`;
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(16, 44, 94, 0.1)";
      }}
    >
      {/* Row 1: Label + Info icon + Chevron */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: HEADER_NAVY, lineHeight: 1.2 }}>{label}</p>
          {info && (
            <div style={{ position: "relative", flexShrink: 0, marginTop: 1 }}>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                aria-label={`${label} information`}
              >
                <Info size={11} color="#9CA3AF" />
              </button>
              {showTooltip && (
                <div style={{position: "absolute", top: "calc(100% + 4px)", left: 0, backgroundColor: "#1F2937", color: "white", fontSize: 11, padding: "6px 8px", borderRadius: 6, width: 160, zIndex: 50, pointerEvents: "none", lineHeight: 1.3}}>
                  {info}
                </div>
              )}
            </div>
          )}
        </div>
        {href ? (
          <Link href={href} style={{ display: "flex", cursor: "pointer", flexShrink: 0 }}>
            <ChevronRight size={14} color="#B0BAD0" />
          </Link>
        ) : (
          <ChevronRight size={14} color="#B0BAD0" style={{ flexShrink: 0 }} />
        )}
      </div>

      {/* Row 2: Icon + value (inline, left-aligned, in header navy) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flex: 1 }}>
        {Icon && <Icon size={20} color={HEADER_NAVY} style={{ flexShrink: 0, strokeWidth: 2.5 }} />}
        <p style={{ fontSize: 30, fontWeight: 800, color: HEADER_NAVY, lineHeight: 1 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Row 3: YoY trend (color-coded: green up, red down) */}
      {yoy !== undefined && yoy !== null && (
        <p style={{ fontSize: 10, fontWeight: 600, color: yoy >= 0 ? GREEN_UP : RED_DOWN, lineHeight: 1 }}>
          {yoy >= 0 ? "↑" : "↓"} {Math.abs(yoy)}% YoY
        </p>
      )}

      {/* Row 4: Gender split (if present) */}
      {femalePct !== undefined && malePct !== undefined && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, paddingTop: 8, borderTop: `1px solid rgba(16, 44, 94, 0.12)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={RED_FEMALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14v8M8 18h8" />
            </svg>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#4B5563" }}>{femalePct}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BLUE_MALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM9 11l5 9M14 20h-10" />
            </svg>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#4B5563" }}>{100 - femalePct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AtAGlancePage() {
  const [responsive, setResponsive] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const countries = new Set(missionStudents.map(s => s.country)).size;

  /* ─ Left rail metrics ─ */
  const mcfScholars = OUTREACH_PARTICIPANTS.filter(p => p.institution === "ALU").length;
  const youthDisability = OUTREACH_PARTICIPANTS.filter(p => p.pwd).length;
  const graduates = OUTREACH_PARTICIPANTS.filter(p => p.status === "Completed").length;
  const refugeeIdp = OUTREACH_PARTICIPANTS.filter(p => p.refugee).length;
  const currentlyEnrolled = OUTREACH_PARTICIPANTS.filter(p => p.status === "Active").length;

  const totalBeneficiaries = OUTREACH_PARTICIPANTS.length;
  const femaleShare = Math.round(
    (OUTREACH_PARTICIPANTS.filter(p => p.gender === "Female").length / totalBeneficiaries) * 100
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [20, 10],
      zoom: 3,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: `rgba(16, 44, 94, 0.02)`, minHeight: "100vh" }}>

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
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> CHII MELA Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span>{countries} countries active</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* ── Stats Cards Section ─────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-10 py-7">
        {/* Three-Column Grid: Left (210px) | Center (1fr) | Right (210px) */}
        <div style={{ display: "grid", gridTemplateColumns: "210px minmax(0, 1fr) 210px", gap: 24, alignItems: "stretch", overflowX: "hidden" }}>

        {/* Left Column: Outreach & Access */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, color: HEADER_NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14, flexShrink: 0 }}>Outreach & Access</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            <KPICard label="Total Beneficiaries" value={totalBeneficiaries} femalePct={femaleShare} malePct={100 - femaleShare} info="Total individuals reached across all CHII outreach programs." Icon={Users} href="/executive/outreach" />
            <KPICard label="Currently Enrolled" value={currentlyEnrolled} info="Participants currently active in outreach programs." Icon={BookOpen} href="/executive/outreach" />
            <KPICard label="Graduates" value={graduates} info="Participants who completed outreach programs." Icon={Award} href="/executive/outreach" />
            <KPICard label="Youth w/ Disability" value={youthDisability} info="Youth with disability reached through outreach." Icon={Users} href="/executive/outreach" />
            <KPICard label="Refugee / IDP" value={refugeeIdp} info="Refugees and internally displaced persons reached." Icon={Users} href="/executive/outreach" />
            <KPICard label="MCF Scholars" value={mcfScholars} info="Mastercard Foundation scholars reached." Icon={Award} href="/executive/outreach" />
            <KPICard label="CSAT Score" value="4.2/5" info="Customer satisfaction rating for programs." Icon={MessageCircle} href="/executive/outreach" />
            <KPICard label="Employer Rating" value="4.6/5" info="Employer satisfaction with graduate preparedness." Icon={Award} href="/executive/outreach" />
          </div>
        </div>

        {/* Center Column: Map */}
        <div ref={mapContainer} style={{ borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden", minHeight: 0 }} />

        {/* Right Column: Program Outcomes */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, color: HEADER_NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14, flexShrink: 0 }}>Program Outcomes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            <KPICard label="Youth in Work" value={131} yoy={8} info="Participants employed or running enterprises." Icon={Briefcase} href="/executive/youth-in-work" />
            <KPICard label="Wage Employment" value={51} yoy={12} info="Participants in paid employment." Icon={Briefcase} href="/executive/wage-employment" />
            <KPICard label="Entrepreneurs" value={21} yoy={5} info="Participants running their own enterprise." Icon={TrendingUp} href="/executive/entrepreneurship" />
            <KPICard label="Jobs Created" value="2,151" yoy={18} info="Total jobs created across all enterprises." Icon={Zap} href="/executive/entrepreneurship" />
            <KPICard label="Enterprises" value={18} yoy={22} info="New enterprises started by participants." Icon={Target} href="/executive/entrepreneurship" />
            <KPICard label="Freelancers" value={12} yoy={-3} info="Participants in freelance or gig work." Icon={Briefcase} href="/executive/youth-in-work" />
            <KPICard label="Job Seeking" value={47} yoy={-15} info="Participants actively seeking employment." Icon={Users} href="/executive/youth-in-work" />
            <KPICard label="Further Education" value={206} yoy={11} info="Participants pursuing further study." Icon={BookOpen} href="/executive/further-education" />
          </div>
        </div>
        </div>
      </div>

      {/* ── Footer Section ─────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-10 py-10" style={{ marginTop: 20 }}>
        <FeaturedImpactStory footer />
      </div>
    </div>
  );
}
