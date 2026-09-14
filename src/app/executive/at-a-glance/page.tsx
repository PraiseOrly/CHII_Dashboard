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

/* ─ KPI Card Component (Navy fill, like Outreach StatsKpiCard) ─ */
function KPICard({
  label,
  value,
  yoy,
  femalePct,
  malePct,
  otherPct,
  info,
  Icon,
  href,
  secondaryText,
}: {
  label: string;
  value: number | string;
  yoy?: number | null;
  femalePct?: number;
  malePct?: number;
  otherPct?: number;
  info?: string;
  Icon?: ComponentType<any>;
  href?: string;
  secondaryText?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const LIGHT_BLUE = "#B5D4F4";

  return (
    <div
      style={{
        backgroundColor: "#F3F7FF",
        borderRadius: 10,
        border: "1px solid #E0ECFF",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: 130,
        padding: "14px 16px",
        transition: "all 200ms ease",
        boxShadow: "0 2px 4px rgba(16, 44, 94, 0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#ECEFFF";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 44, 94, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#F3F7FF";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(16, 44, 94, 0.08)";
      }}
    >
      {/* Row 1: Label + Info icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#14306B", lineHeight: 1.2 }}>{label}</p>
        {info && (
          <div style={{ position: "relative", flexShrink: 0, cursor: "pointer" }}>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              style={{ display: "flex", cursor: "pointer", background: "none", padding: 0, width: 11, height: 11, borderRadius: "50%", backgroundColor: "#E0ECFF", border: "1px solid #B5D4F4", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#14306B", lineHeight: 1 }}
              aria-label={`${label} information`}
            >
              i
            </button>
            {showTooltip && (
              <div style={{position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#021D38", color: "white", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 200, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", zIndex: 50, pointerEvents: "none", textAlign: "center"}}>
                {info}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Row 2: Icon + value (centered, navy) */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, flex: 1 }}>
        {Icon && <Icon size={18} color="#14306B" style={{ flexShrink: 0, strokeWidth: 2 }} />}
        <p style={{ fontSize: 28, fontWeight: 800, color: "#14306B", lineHeight: 1 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Row 3: YoY trend (color-coded: green up, red down) */}
      {yoy !== undefined && yoy !== null && (
        <p style={{ fontSize: 10, fontWeight: 600, color: yoy >= 0 ? GREEN_UP : RED_DOWN, lineHeight: 1, marginBottom: 8 }}>
          {yoy >= 0 ? "↑" : "↓"} {Math.abs(yoy)}% YoY
        </p>
      )}

      {/* Row 4: Gender split or secondary text */}
      <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(16, 44, 94, 0.1)", justifyContent: "center", alignItems: "center", minHeight: 16 }}>
        {femalePct !== undefined && malePct !== undefined ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={RED_FEMALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14v8M8 18h8" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#4B5563" }}>{femalePct}%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BLUE_MALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM9 11l5 9M14 20h-10" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#4B5563" }}>{malePct}%</span>
            </div>
            {otherPct !== undefined && otherPct > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5M9 12h6" />
                </svg>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#4B5563" }}>{otherPct}%</span>
              </div>
            )}
          </>
        ) : (
          <p style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", lineHeight: 1 }}>
            {secondaryText || "—"}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AtAGlancePage() {
  const [responsive, setResponsive] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const countries = new Set(missionStudents.map(s => s.country)).size;

  /* ─ Left rail metrics with gender splits ─ */
  const totalBeneficiaries = OUTREACH_PARTICIPANTS.length;
  const totalFemale = OUTREACH_PARTICIPANTS.filter(p => p.gender === "Female").length;
  const femaleShare = Math.round((totalFemale / totalBeneficiaries) * 100);
  const maleShare = 100 - femaleShare;

  const currentlyEnrolled = OUTREACH_PARTICIPANTS.filter(p => p.status === "Active").length;
  const enrolledFemale = OUTREACH_PARTICIPANTS.filter(p => p.status === "Active" && p.gender === "Female").length;
  const enrolledFemalePct = Math.round((enrolledFemale / currentlyEnrolled) * 100) || 0;

  const graduates = OUTREACH_PARTICIPANTS.filter(p => p.status === "Completed").length;
  const graduatesFemale = OUTREACH_PARTICIPANTS.filter(p => p.status === "Completed" && p.gender === "Female").length;
  const graduatesFemalePct = Math.round((graduatesFemale / graduates) * 100) || 0;

  const youthDisability = OUTREACH_PARTICIPANTS.filter(p => p.pwd).length;
  const disabilityFemale = OUTREACH_PARTICIPANTS.filter(p => p.pwd && p.gender === "Female").length;
  const disabilityFemalePct = Math.round((disabilityFemale / youthDisability) * 100) || 0;

  const refugeeIdp = OUTREACH_PARTICIPANTS.filter(p => p.refugee).length;
  const refugeeFemale = OUTREACH_PARTICIPANTS.filter(p => p.refugee && p.gender === "Female").length;
  const refugeeFemalePct = Math.round((refugeeFemale / refugeeIdp) * 100) || 0;

  const mcfScholars = OUTREACH_PARTICIPANTS.filter(p => p.institution === "ALU").length;
  const mcfFemale = OUTREACH_PARTICIPANTS.filter(p => p.institution === "ALU" && p.gender === "Female").length;
  const mcfFemalePct = Math.round((mcfFemale / mcfScholars) * 100) || 0;

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
            <KPICard label="Total Beneficiaries" value={totalBeneficiaries} femalePct={femaleShare} malePct={maleShare} info="Total individuals reached across all CHII outreach programs." Icon={Users} href="/executive/outreach" />
            <KPICard label="Currently Enrolled" value={currentlyEnrolled} femalePct={enrolledFemalePct} malePct={100 - enrolledFemalePct} info="Participants currently active in outreach programs." Icon={BookOpen} href="/executive/outreach" />
            <KPICard label="Graduates" value={graduates} femalePct={graduatesFemalePct} malePct={100 - graduatesFemalePct} info="Participants who completed outreach programs." Icon={Award} href="/executive/outreach" />
            <KPICard label="Youth w/ Disability" value={youthDisability} femalePct={disabilityFemalePct} malePct={100 - disabilityFemalePct} info="Youth with disability reached through outreach." Icon={Users} href="/executive/outreach" />
            <KPICard label="Refugee / IDP" value={refugeeIdp} femalePct={refugeeFemalePct} malePct={100 - refugeeFemalePct} info="Refugees and internally displaced persons reached." Icon={Users} href="/executive/outreach" />
            <KPICard label="MCF Scholars" value={mcfScholars} femalePct={mcfFemalePct} malePct={100 - mcfFemalePct} info="Mastercard Foundation scholars reached." Icon={Award} href="/executive/outreach" />
            <KPICard label="CSAT Score" value="4.2/5" info="Customer satisfaction rating for programs." Icon={MessageCircle} href="/executive/outreach" secondaryText="n = 240 respondents" />
            <KPICard label="Employer Rating" value="4.6/5" info="Employer satisfaction with graduate preparedness." Icon={Award} href="/executive/outreach" secondaryText="n = 156 respondents" />
          </div>
        </div>

        {/* Center Column: Map */}
        <div ref={mapContainer} style={{ borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden", minHeight: 0 }} />

        {/* Right Column: Program Outcomes */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, color: HEADER_NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14, flexShrink: 0 }}>Program Outcomes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            <KPICard label="Youth in Work" value={131} yoy={8} info="Participants employed or running enterprises." Icon={Briefcase} href="/executive/youth-in-work" secondaryText="Active workforce" />
            <KPICard label="Wage Employment" value={51} yoy={12} info="Participants in paid employment." Icon={Briefcase} href="/executive/wage-employment" secondaryText="Employed" />
            <KPICard label="Entrepreneurs" value={21} yoy={5} info="Participants running their own enterprise." Icon={TrendingUp} href="/executive/entrepreneurship" secondaryText="Business owners" />
            <KPICard label="Jobs Created" value="2,151" yoy={18} info="Total jobs created across all enterprises." Icon={Zap} href="/executive/entrepreneurship" secondaryText="Direct employment" />
            <KPICard label="Enterprises" value={18} yoy={22} info="New enterprises started by participants." Icon={Target} href="/executive/entrepreneurship" secondaryText="Active ventures" />
            <KPICard label="Freelancers" value={12} yoy={-3} info="Participants in freelance or gig work." Icon={Briefcase} href="/executive/youth-in-work" secondaryText="Self-employed" />
            <KPICard label="Job Seeking" value={47} yoy={-15} info="Participants actively seeking employment." Icon={Users} href="/executive/youth-in-work" secondaryText="In transition" />
            <KPICard label="Further Education" value={206} yoy={11} info="Participants pursuing further study." Icon={BookOpen} href="/executive/further-education" secondaryText="Continuing studies" />
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
