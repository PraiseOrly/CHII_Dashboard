"use client";
import React, { useState, useEffect, useRef, type ComponentType } from "react";
import { Info, ChevronRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import HeaderDesign from "@/components/layout/header-design";
import FeaturedImpactStory from "@/components/layout/featured-impact-story";
import { OUTREACH_PARTICIPANTS } from "@/data/executive/outreach";
import { missionStudents } from "@/data/hemp/mission-students";
import { Users, BookOpen, Briefcase, TrendingUp, Zap, Target, Award, MessageCircle } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

/* ─ Colors ─ */
const HEADER_NAVY = "#102C5E"; // Primary brand navy (from header)
const RED_FEMALE = "#DC2626"; // Female red
const BLUE_MALE = "#479BD6"; // Male blue
const GREEN_UP = "#16A34A"; // Green for positive YoY
const RED_DOWN = "#DC2626"; // Red for negative YoY

/* ─ Country Coordinates ─ */
const COUNTRY_COORDS: Record<string, [number, number]> = {
  "Kenya": [-0.0236, 37.9062],
  "Uganda": [1.3733, 32.2903],
  "Tanzania": [-6.3690, 34.8888],
  "Rwanda": [-1.9536, 29.8739],
  "Nigeria": [9.0820, 8.6753],
  "Ghana": [5.6037, -0.1870],
  "Senegal": [14.4974, -14.4524],
  "Mali": [17.5707, -3.9962],
  "Ethiopia": [9.1450, 40.4897],
  "South Africa": [-22.9375, 24.2955],
  "Zambia": [-13.1339, 27.8493],
  "Zimbabwe": [-17.8252, 25.2637],
  "Botswana": [-22.3285, 24.6849],
  "Namibia": [-22.9596, 18.4904],
  "Mozambique": [-18.6657, 35.3291],
  "Malawi": [-13.2543, 34.3015],
  "Angola": [-11.2027, 17.8739],
  "Congo": [-4.0383, 21.7587],
  "DRC": [-4.0383, 21.7587],
  "Cameroon": [3.8480, 11.5021],
  "Ivory Coast": [7.5400, -5.5471],
  "Benin": [9.3077, 2.3158],
  "Niger": [17.6078, 8.6753],
  "Chad": [15.4542, 18.7322],
  "Sudan": [12.8628, 30.2176],
  "Egypt": [26.8206, 30.8025],
  "Liberia": [6.4281, -9.4295],
  "Sierra Leone": [8.4606, -11.7799],
  "Guinea": [9.9456, -9.6966],
  "Mauritania": [21.0079, -10.9408],
};

/* ─ Map Container Component ─ */
function MapContainer({
  mapContainer,
  map,
  countryData
}: {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<any>;
  countryData: Map<string, number>;
}) {
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; count: number; youthInWork: number; youthPct: number; wageEmployment: number; wagePct: number; entrepreneurs: number; entrepreneurPct: number; furtherEducation: number; educationPct: number; lng: number; lat: number } | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);

  const handleReset = () => {
    map.current?.flyTo({
      center: [20, 3],
      zoom: 2.6,
      duration: 1000
    });
    setSelectedCountry(null);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = () => {
      if (!mapContainer.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [20, 3],
        zoom: 2.6,
        attributionControl: false,
        cooperativeGestures: true
      });

      setTimeout(() => {
        map.current?.resize();
      }, 100);

      const resizeObserver = new ResizeObserver(() => {
        map.current?.resize();
      });
      resizeObserver.observe(mapContainer.current);

      map.current.on("load", () => {
        // Convert countryData to array and create markers with real coordinates
        const countries = Array.from(countryData.entries()).map(([country, count]) => {
          const coords = COUNTRY_COORDS[country] || [0, 0];
          return {
            country,
            count,
            lat: coords[0],
            lng: coords[1]
          };
        });

        countries.forEach(({ country, count, lat, lng }) => {
          // Create marker element with dynamic sizing
          const el = document.createElement("div");
          const size = Math.min(8 + Math.log(count) * 2, 16) * 2;

          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.borderRadius = "50%";
          el.style.background = "#479BD6";
          el.style.border = "3px solid white";
          el.style.cursor = "pointer";
          el.style.boxShadow = "0 2px 10px rgba(71, 155, 214, 0.5), 0 0 0 2px #479BD6";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.fontSize = "11px";
          el.style.fontWeight = "700";
          el.style.color = "white";
          el.style.transition = "all 200ms ease";
          el.style.pointerEvents = "auto";
          el.style.userSelect = "none";
          el.textContent = count.toString();

          // Calculate beneficiary breakdown
          const youthCount = Math.floor(count * 0.25);
          const wageCount = Math.floor(count * 0.35);
          const entrepreneurCount = Math.floor(count * 0.15);
          const educationCount = Math.floor(count * 0.25);

          const youthFemale = Math.floor(youthCount * 0.48);
          const wageFemale = Math.floor(wageCount * 0.52);
          const entrepreneurFemale = Math.floor(entrepreneurCount * 0.42);
          const educationFemale = Math.floor(educationCount * 0.58);

          const outcomes = {
            youthInWork: { count: youthCount, female: youthFemale },
            wageEmployment: { count: wageCount, female: wageFemale },
            entrepreneurs: { count: entrepreneurCount, female: entrepreneurFemale },
            furtherEducation: { count: educationCount, female: educationFemale }
          };

          const youthPct = outcomes.youthInWork.count > 0 ? Math.round((outcomes.youthInWork.female / outcomes.youthInWork.count) * 100) : 0;
          const wagePct = outcomes.wageEmployment.count > 0 ? Math.round((outcomes.wageEmployment.female / outcomes.wageEmployment.count) * 100) : 0;
          const entrepreneurPct = outcomes.entrepreneurs.count > 0 ? Math.round((outcomes.entrepreneurs.female / outcomes.entrepreneurs.count) * 100) : 0;
          const educationPct = outcomes.furtherEducation.count > 0 ? Math.round((outcomes.furtherEducation.female / outcomes.furtherEducation.count) * 100) : 0;

          const offsetY = Math.floor(-(size / 2 + 10));
          const popup = new mapboxgl.Popup({
            offset: [0, offsetY],
            closeButton: true,
            maxWidth: 320
          } as any);

          // Build HTML manually to avoid type issues
          const html = "<strong>" + country + "</strong><br><br>" +
            "Total: " + count + " beneficiaries<br><br>" +
            "Youth in Work: " + outcomes.youthInWork.count + " (" + youthPct + "% F)<br>" +
            "Wage Employment: " + outcomes.wageEmployment.count + " (" + wagePct + "% F)<br>" +
            "Entrepreneurs: " + outcomes.entrepreneurs.count + " (" + entrepreneurPct + "% F)<br>" +
            "Further Education: " + outcomes.furtherEducation.count + " (" + educationPct + "% F)";

          const marker = new mapboxgl.Marker({ element: el, draggable: false })
            .setLngLat([lng, lat])
            .addTo(map.current!);

          el.addEventListener("click", (e) => {
            e.stopPropagation();
            map.current!.flyTo({ center: [lng, lat], zoom: 4, duration: 1000 });

            // Calculate pixel position of the clicked location
            const canvas = map.current!.getCanvas();
            const point = map.current!.project([lng, lat]);

            setSelectedCountry({
              name: country,
              count,
              youthInWork: outcomes.youthInWork.count,
              youthPct,
              wageEmployment: outcomes.wageEmployment.count,
              wagePct,
              entrepreneurs: outcomes.entrepreneurs.count,
              entrepreneurPct,
              furtherEducation: outcomes.furtherEducation.count,
              educationPct,
              lng,
              lat
            });

            setPopupPos({
              top: point.y + 20,
              left: point.x + 20
            });
          });

          el.addEventListener("mouseenter", () => {
            el.style.opacity = "0.8";
            el.style.filter = "brightness(1.2)";
          });

          el.addEventListener("mouseleave", () => {
            el.style.opacity = "1";
            el.style.filter = "brightness(1)";
          });
        });
      });

      return () => {
        resizeObserver.disconnect();
      };
    };

    let resizeCleanup: (() => void) | void;
    resizeCleanup = initMap();

    return () => {
      resizeCleanup?.();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [countryData]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: 10, border: "1px solid var(--border-subtle)", overflow: "hidden", backgroundColor: "var(--bg-surface-raised)" }} />

      {selectedCountry && popupPos && (
        <div style={{ position: "absolute", top: popupPos.top, left: popupPos.left, backgroundColor: "var(--bg-surface)", borderRadius: 0, padding: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid var(--border-subtle)", width: 420, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--brand-secondary)" }}>{selectedCountry.name}</h2>
            <button onClick={() => { setSelectedCountry(null); setPopupPos(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--text-tertiary)", padding: 0, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 2 }}>Total</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-secondary)" }}>{selectedCountry.count}</div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-subtle)" }}>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "var(--text-secondary)", fontSize: 11 }}></th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "var(--text-secondary)", fontSize: 11 }}>Youth</th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "var(--text-secondary)", fontSize: 11 }}>Wage</th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "var(--text-secondary)", fontSize: 11 }}>Entrepreneurs</th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "var(--text-secondary)", fontSize: 11 }}>Further Education</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "4px 6px", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>Beneficiaries</td>
                  <td style={{ padding: "4px 6px", color: "var(--text-primary)", fontWeight: 500, fontSize: 11 }}>{selectedCountry.youthInWork}</td>
                  <td style={{ padding: "4px 6px", color: "var(--text-primary)", fontWeight: 500, fontSize: 11 }}>{selectedCountry.wageEmployment}</td>
                  <td style={{ padding: "4px 6px", color: "var(--text-primary)", fontWeight: 500, fontSize: 11 }}>{selectedCountry.entrepreneurs}</td>
                  <td style={{ padding: "4px 6px", color: "var(--text-primary)", fontWeight: 500, fontSize: 11 }}>{selectedCountry.furtherEducation}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 6px", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>Female %</td>
                  <td style={{ padding: "4px 6px", color: "var(--brand-secondary)", fontWeight: 600, fontSize: 11 }}>{selectedCountry.youthPct}%</td>
                  <td style={{ padding: "4px 6px", color: "var(--brand-secondary)", fontWeight: 600, fontSize: 11 }}>{selectedCountry.wagePct}%</td>
                  <td style={{ padding: "4px 6px", color: "var(--brand-secondary)", fontWeight: 600, fontSize: 11 }}>{selectedCountry.entrepreneurPct}%</td>
                  <td style={{ padding: "4px 6px", color: "var(--brand-secondary)", fontWeight: 600, fontSize: 11 }}>{selectedCountry.educationPct}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={handleReset}
        title="Reset map view"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 500,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11.5,
          fontWeight: 700,
          color: "var(--brand-primary)",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          padding: "6px 11px",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)"
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reset
      </button>
    </div>
  );
}

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
        backgroundColor: "var(--bg-surface-raised)",
        borderRadius: 10,
        border: "1px solid var(--border-subtle)",
        borderLeft: "5px solid var(--brand-secondary)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: 130,
        padding: "14px 16px",
        transition: "all 200ms ease",
        boxShadow: "var(--shadow-md)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-surface)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-surface-raised)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
    >
      {/* Row 1: Label + Info icon + Chevron */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 3, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3, flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-secondary)", lineHeight: 1.2 }}>{label}</p>
          {info && (
            <div style={{ position: "relative", flexShrink: 0, cursor: "pointer" }}>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ display: "flex", cursor: "pointer", background: "none", padding: 0, width: 11, height: 11, borderRadius: "50%", backgroundColor: "var(--border-subtle)", border: `1px solid var(--border-default)`, alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "var(--brand-secondary)", lineHeight: 1 }}
                aria-label={`${label} information`}
              >
                i
              </button>
              {showTooltip && (
                <div style={{position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 200, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid var(--border-subtle)", zIndex: 50, pointerEvents: "none", textAlign: "center"}}>
                  {info}
                </div>
              )}
            </div>
          )}
        </div>
        {href ? (
          <Link href={href} style={{ display: "flex", cursor: "pointer", flexShrink: 0, transition: "all 200ms ease" }}>
            <ChevronRight size={16} color="var(--brand-secondary)" style={{ flexShrink: 0 }} />
          </Link>
        ) : (
          <ChevronRight size={16} color="#D1D5DB" style={{ flexShrink: 0 }} />
        )}
      </div>

      {/* Row 2: Icon + value (centered, navy) */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, flex: 1 }}>
        {Icon && <Icon size={18} color="var(--brand-secondary)" style={{ flexShrink: 0, strokeWidth: 2 }} />}
        <p style={{ fontSize: 28, fontWeight: 800, color: "var(--brand-secondary)", lineHeight: 1 }}>
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
      <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border-subtle)", justifyContent: "center", alignItems: "center", minHeight: 16 }}>
        {femalePct !== undefined && malePct !== undefined ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={RED_FEMALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14v8M8 18h8" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{femalePct}%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BLUE_MALE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM9 11l5 9M14 20h-10" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{malePct}%</span>
            </div>
            {otherPct !== undefined && otherPct > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5M9 12h6" />
                </svg>
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{otherPct}%</span>
              </div>
            )}
          </>
        ) : (
          <p style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", lineHeight: 1 }}>
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
  const map = useRef<any>(null);
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

  /* ─ Country data aggregation for choropleth ─ */
  const countryData = new Map<string, number>();
  const outcomePoints: Array<{ id: string; country: string; lat: number; lng: number; count: number }> = [];

  missionStudents.forEach(student => {
    countryData.set(
      student.country,
      (countryData.get(student.country) || 0) + 1
    );
  });


  return (
    <div style={{ backgroundColor: `var(--bg-tint)`, minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-10 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "var(--brand-primary)", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <HeaderDesign />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>At a Glance</h1>
            </div>
            <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
              Where CHII is reaching, across HEMP, HENT &amp; HECO programs
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "210px minmax(0, 1fr) 210px", gap: 24, alignItems: "end", overflowX: "hidden" }}>

        {/* Left Column: Outreach & Access */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, color: HEADER_NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14, flexShrink: 0, textAlign: "center" }}>Outreach & Access</h2>
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
        <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
          <MapContainer mapContainer={mapContainer} map={map} countryData={countryData} />
        </div>

        {/* Right Column: Program Outcomes */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, color: HEADER_NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14, flexShrink: 0, textAlign: "center" }}>Program Outcomes</h2>
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

      {/* ── Insights Section (Merged Card Style) ──────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-10 py-0" style={{ marginTop: 5, marginBottom: 5 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 0,
          backgroundColor: "var(--bg-surface-raised)",
          borderRadius: 10,
          border: "1px solid var(--border-subtle)",
          padding: "20px 0",
          boxShadow: "var(--shadow-md)",
          transition: "all 200ms ease",
          overflow: "hidden",
          backgroundImage: "linear-gradient(to right, var(--brand-secondary) 0%, var(--brand-secondary) 25%, #16A34A 25%, #16A34A 50%, #9333EA 50%, #9333EA 75%, #EAB308 75%, #EAB308 100%)",
          backgroundSize: "100% 5px",
          backgroundPosition: "0 0",
          backgroundRepeat: "no-repeat"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--bg-surface)";
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--bg-surface-raised)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
        }}>
          {[
            {
              title: "Gender Balance",
              figure: "52%",
              detail: "Female participants (Target: 50%)",
              copy: "Strong gender parity across HEMP, HENT, and HECO programs. Consistent above target baseline.",
              accentColor: "var(--brand-secondary)"
            },
            {
              title: "Regional Growth",
              figure: "+28%",
              detail: "YoY expansion across 12 countries",
              copy: "Sub-Saharan Africa reach increased. East Africa leading with +38% growth. New West Africa hubs activated.",
              accentColor: "#16A34A"
            },
            {
              title: "Employment Success",
              figure: "76%",
              detail: "Graduate employment rate",
              copy: "Wage employment (39%), Self-employment (23%), Further education (14%). Exceeds regional benchmarks.",
              accentColor: "#9333EA"
            },
            {
              title: "Venture Momentum",
              figure: "18",
              detail: "New enterprises (↑22% YoY)",
              copy: "2,151 jobs created. Avg. revenue $52K. 8 ventures scaled to multi-year sustainability.",
              accentColor: "#EAB308"
            }
          ].map((insight, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "0 16px",
                position: "relative",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(20,48,107,0.1)" : "none"
              }}
            >

              {/* Hero figure */}
              <p style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, margin: 0, marginTop: 8 }}>
                {insight.figure}
              </p>

              {/* Label */}
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, margin: 0 }}>
                {insight.title}
              </p>

              {/* Detail line */}
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", lineHeight: 1.3, margin: 0 }}>
                {insight.detail}
              </p>

              {/* Supporting copy */}
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4, margin: 0, marginBottom: 8 }}>
                {insight.copy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer Section ─────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-10 py-10">
        <FeaturedImpactStory footer />
      </div>
    </div>
  );
}
