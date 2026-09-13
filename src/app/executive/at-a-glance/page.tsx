"use client";
import { useState, type ComponentType } from "react";
import { Info, ChevronRight } from "lucide-react";
import Link from "next/link";
import HeaderDesign from "@/components/layout/header-design";
import FeaturedImpactStory from "@/components/layout/featured-impact-story";
import { OUTREACH_PARTICIPANTS } from "@/data/executive/outreach";
import { missionStudents } from "@/data/hemp/mission-students";
import { Users, BookOpen, Briefcase, TrendingUp, Zap, Target, Award, MessageCircle } from "lucide-react";

/* ─ Colors (from Outreach page) ─ */
const NAVY = "#14306B"; // Outreach navy
const BLUE_HERO = "#14306B"; // Outreach navy for values (darker blue)
const RED_FEMALE = "#DC2626"; // Female red
const BLUE_MALE = "#479BD6"; // Outreach male blue

/* ─ KPI Card Component (Outreach header style) ─ */
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
        backgroundColor: "white",
        borderRadius: 10,
        border: "1px solid #E5E7EB",
        padding: "14px 16px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      className="transition-transform hover:scale-[1.01]"
    >
      {/* Row 1: Label + Info icon + Chevron */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, minHeight: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5, flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: NAVY, lineHeight: 1.2 }}>{label}</p>
          {info && (
            <div style={{ position: "relative", flexShrink: 0, marginTop: 1 }}>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                aria-label={`${label} information`}
              >
                <Info size={11} color="#CBD5E1" />
              </button>
              {showTooltip && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    backgroundColor: "#1F2937",
                    color: "white",
                    fontSize: 11,
                    padding: "6px 8px",
                    borderRadius: 6,
                    width: 160,
                    zIndex: 50,
                    pointerEvents: "none",
                    lineHeight: 1.3,
                  }}
                >
                  {info}
                </div>
              )}
            </div>
          )}
        </div>
        {href ? (
          <Link href={href} style={{ display: "flex", cursor: "pointer", marginTop: 1, flexShrink: 0 }}>
            <ChevronRight size={14} color="#D1D5DB" />
          </Link>
        ) : (
          <ChevronRight size={14} color="#D1D5DB" style={{ flexShrink: 0, marginTop: 1 }} />
        )}
      </div>

      {/* Row 2: Icon + Large value (centered) */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
        {Icon && <Icon size={18} color="#B5D4F4" style={{ flexShrink: 0 }} />}
        <p style={{ fontSize: 20, fontWeight: 700, color: BLUE_HERO, lineHeight: 1 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Row 3: YoY trend */}
      {yoy !== undefined && yoy !== null && (
        <p style={{ fontSize: 10, fontWeight: 600, color: BLUE_HERO, marginBottom: 8 }}>
          {yoy >= 0 ? "↑" : "↓"} {Math.abs(yoy)}% YoY
        </p>
      )}

      {/* Row 4: Gender split (footer zone) */}
      {femalePct !== undefined && malePct !== undefined && (
        <div style={{ display: "flex", gap: 12, marginTop: "auto", paddingTop: 6, borderTop: "1px solid #F3F4F6" }}>
          {/* Female */}
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={RED_FEMALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14v8M8 18h8" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#1F2937" }}>{femalePct}%</span>
          </div>

          {/* Male */}
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE_MALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM9 11l5 9M14 20h-10" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#1F2937" }}>{100 - femalePct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AtAGlancePage() {
  const [responsive, setResponsive] = useState(false);
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

      {/* ── KPI Grid Layout ─────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-6">

        {/* Outreach & Access */}
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>Outreach & Access</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <KPICard label="Total Beneficiaries" value={totalBeneficiaries} femalePct={femaleShare} malePct={100 - femaleShare} info="Total individuals reached across all CHII outreach programs." Icon={Users} href="/executive/outreach" />
            <KPICard label="Currently Enrolled" value={currentlyEnrolled} info="Participants currently active in outreach programs." Icon={BookOpen} href="/executive/outreach" />
            <KPICard label="Graduates" value={graduates} info="Participants who completed outreach programs." Icon={Award} href="/executive/outreach" />
            <KPICard label="Youth w/ Disability" value={youthDisability} info="Youth with disability reached through outreach." Icon={Users} href="/executive/outreach" />
            <KPICard label="Refugee / IDP" value={refugeeIdp} info="Refugees and internally displaced persons reached." Icon={Users} href="/executive/outreach" />
            <KPICard label="MCF Scholars" value={mcfScholars} info="Mastercard Foundation scholars reached." Icon={Award} href="/executive/outreach" />
            <KPICard label="CSAT Score" value="4.2/5" info="Customer satisfaction rating for programs." Icon={MessageCircle} href="/executive/outreach" />
            <KPICard label="Employer Rating" value="4.6/5" info="Employer satisfaction with graduate preparedness." Icon={Award} href="/executive/outreach" />
          </div>
        </section>

        {/* Program Outcomes */}
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>Program Outcomes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <KPICard label="Youth in Work" value={131} yoy={8} info="Participants employed or running enterprises." Icon={Briefcase} href="/executive/youth-in-work" />
            <KPICard label="Wage Employment" value={51} yoy={12} info="Participants in paid employment." Icon={Briefcase} href="/executive/wage-employment" />
            <KPICard label="Entrepreneurs" value={21} yoy={5} info="Participants running their own enterprise." Icon={TrendingUp} href="/executive/entrepreneurship" />
            <KPICard label="Jobs Created" value="2,151" yoy={18} info="Total jobs created across all enterprises." Icon={Zap} href="/executive/entrepreneurship" />
            <KPICard label="Enterprises" value={18} yoy={22} info="New enterprises started by participants." Icon={Target} href="/executive/entrepreneurship" />
            <KPICard label="Freelancers" value={12} yoy={-3} info="Participants in freelance or gig work." Icon={Briefcase} href="/executive/youth-in-work" />
            <KPICard label="Job Seeking" value={47} yoy={-15} info="Participants actively seeking employment." Icon={Users} href="/executive/youth-in-work" />
            <KPICard label="Further Education" value={206} yoy={11} info="Participants pursuing further study." Icon={BookOpen} href="/executive/further-education" />
          </div>
        </section>

      </div>

      {/* ── Footer ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7">
        <FeaturedImpactStory footer />
      </div>
    </div>
  );
}
