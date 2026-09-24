"use client";
import React, { useState, useRef, useEffect } from "react";
import { Users, BookOpen, Briefcase, TrendingUp, Target, Award, Zap, MessageCircle, Info, ChevronRight, Accessibility, type LucideIcon } from "lucide-react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PortalNav from "@/components/layout/portal-nav";
import PortalFooter from "@/components/layout/portal-footer";
import HeaderDesign from "@/components/layout/header-design";
import { missionStudents } from "@/data/mission-students";
import { hempParticipations } from "@/data/hemp-participation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const HEADER_NAVY = "#042C53";
const RED_FEMALE = "#DC2626";
const BLUE_MALE = "#479BD6";

// Calculate pace toward 2030 targets
function calculatePace(current: number, target: number, yearsPassed: number = 3.25): { status: string; needed: number; color: string } {
  const yearsRemaining = 4 - yearsPassed;
  const requiredPerYear = (target - current) / yearsRemaining;
  const requiredNow = target * (yearsPassed / 4);
  const progressRatio = current / requiredNow;

  let status = "On Pace";
  let color = "#3B82F6"; // blue

  if (progressRatio >= 1.15) {
    status = "Ahead of Schedule";
    color = "#16A34A"; // green
  } else if (progressRatio < 0.85) {
    status = "Behind Schedule";
    color = "#EA580C"; // orange
  }

  return { status, needed: Math.round(requiredPerYear), color };
}

const COUNTRY_COORDS: Record<string, [number, number]> = {
  "Kenya": [-0.0236, 37.9062], "Uganda": [1.3733, 32.2903], "Tanzania": [-6.3690, 34.8888],
  "Rwanda": [-1.9536, 29.8739], "Nigeria": [9.0820, 8.6753], "Ghana": [5.6037, -0.1870],
  "Senegal": [14.4974, -14.4524], "Mali": [17.5707, -3.9962], "Ethiopia": [9.1450, 40.4897],
  "South Africa": [-22.9375, 24.2955], "Zambia": [-13.1339, 27.8493], "Zimbabwe": [-17.8252, 25.2637],
  "Botswana": [-22.3285, 24.6849], "Namibia": [-22.9596, 18.4904], "Mozambique": [-18.6657, 35.3291],
};

function KPICard({
  label,
  value,
  femalePct,
  malePct,
  info,
  Icon,
  href,
  secondaryText,
  yoy,
  progress,
  progressTarget,
  detail,
  progressLabel,
  paceStatus,
  paceColor,
  secondaryTextColor,
  programmeText,
}: {
  label: string;
  value: number | string;
  femalePct?: number;
  malePct?: number;
  info?: string;
  Icon?: React.ComponentType<any>;
  href?: string;
  secondaryText?: string;
  yoy?: number;
  progress?: number;
  progressTarget?: number;
  detail?: string;
  progressLabel?: string;
  paceStatus?: string;
  paceColor?: string;
  secondaryTextColor?: string;
  programmeText?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        border: "1px solid #E5E7EB",
        borderLeft: `5px solid ${HEADER_NAVY}`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 140,
        padding: "12px 14px",
        transition: "all 200ms ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f9fafb";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 3, marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", color: HEADER_NAVY, lineHeight: 1.1, margin: 0 }}>{label}</p>
          {info && (
            <div style={{ position: "relative", flexShrink: 0, cursor: "pointer" }}>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ display: "flex", cursor: "pointer", background: "none", padding: 0, width: 11, height: 11, borderRadius: "50%", backgroundColor: "#E5E7EB", border: "1px solid #D1D5DB", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: HEADER_NAVY, lineHeight: 1 }}
              >
                i
              </button>
              {showTooltip && (
                <div style={{position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#fff", color: "#111", fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 200, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB", zIndex: 50, pointerEvents: "none", textAlign: "center"}}>
                  {info}
                </div>
              )}
            </div>
          )}
        </div>
        {href ? (
          <Link href={href} style={{ display: "flex", cursor: "pointer", flexShrink: 0, transition: "all 200ms ease" }}>
            <ChevronRight size={16} color={HEADER_NAVY} style={{ flexShrink: 0 }} />
          </Link>
        ) : (
          <ChevronRight size={16} color="#D1D5DB" style={{ flexShrink: 0 }} />
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flex: 1 }}>
        {Icon && <Icon size={16} color={HEADER_NAVY} style={{ flexShrink: 0, strokeWidth: 2 }} />}
        <p style={{ fontSize: 28, fontWeight: 800, color: HEADER_NAVY, lineHeight: 1, margin: 0 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>

      {paceStatus ? (
        <p style={{ fontSize: 10, fontWeight: 700, color: paceColor, lineHeight: 1, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800 }}>●</span>
          <span>{paceStatus}</span>
        </p>
      ) : yoy !== undefined && yoy !== null && (
        <p style={{ fontSize: 10, fontWeight: 700, color: yoy >= 0 ? "#16A34A" : "#DC2626", lineHeight: 1, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 12 }}>{yoy >= 0 ? "↑" : "↓"}</span>
          <span>{Math.abs(yoy)}% vs last year</span>
        </p>
      )}

      {progress !== undefined && progressTarget !== undefined && (
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, alignItems: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", flex: 1 }}>Progress to 2030</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: HEADER_NAVY, textAlign: "right" }}>
              {progressLabel ? progressLabel : `${Math.round((progress / progressTarget) * 100)}% of ${progressTarget.toLocaleString()}`}
            </span>
          </div>
          <div style={{ width: "100%", height: 6, backgroundColor: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", backgroundColor: "#16A34A", width: `${Math.min((progress / progressTarget) * 100, 100)}%`, transition: "width 200ms ease" }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 3, paddingTop: 4, borderTop: "1px solid #E5E7EB", justifyContent: "flex-start", alignItems: "center", minHeight: 14, flexWrap: "nowrap", overflow: "visible" }}>
        {femalePct !== undefined ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={RED_FEMALE} strokeWidth="2.2">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14v8M8 18h8" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280" }}>{femalePct}%</span>
            </div>
            {malePct !== undefined && (
              <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={BLUE_MALE} strokeWidth="2.2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14v8" />
                  <path d="M8 18h8" />
                </svg>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280" }}>{malePct}%</span>
              </div>
            )}
            {programmeText && (
              <>
                <span style={{ fontSize: 8, fontWeight: 500, color: "#D1D5DB" }}>·</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", whiteSpace: "nowrap" }}>{programmeText}</span>
              </>
            )}
          </>
        ) : (
          <p style={{ fontSize: 9, fontWeight: 600, color: secondaryTextColor || "#6B7280", lineHeight: 1.2, margin: 0, textAlign: "center" }}>
            {secondaryText || "—"}
          </p>
        )}
      </div>
    </div>
  );
}

function MapContainer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);

  const studentsByCountry = new Map<string, number>();
  missionStudents.forEach(s => {
    studentsByCountry.set(s.countryOfResidence, (studentsByCountry.get(s.countryOfResidence) || 0) + 1);
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [20, 3],
      zoom: 2.6,
      attributionControl: false,
      cooperativeGestures: true,
    });

    map.current.on("load", () => {
      Array.from(studentsByCountry.entries()).forEach(([country, count]) => {
        const coords = COUNTRY_COORDS[country];
        if (!coords) return;

        const el = document.createElement("div");
        const size = Math.min(8 + Math.log(count) * 2, 16) * 2;

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = "50%";
        el.style.background = "#479BD6";
        el.style.border = "3px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 2px 10px rgba(71, 155, 214, 0.5)";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.fontSize = "11px";
        el.style.fontWeight = "700";
        el.style.color = "white";
        el.style.transition = "all 200ms ease";
        el.textContent = count.toString();

        const marker = new mapboxgl.Marker({ element: el }).setLngLat([coords[1], coords[0]]).addTo(map.current!);

        el.addEventListener("click", () => {
          const point = map.current!.project([coords[1], coords[0]]);
          map.current!.flyTo({ center: [coords[1], coords[0]], zoom: 4, duration: 1000 });

          const careerWorkshops = hempParticipations.filter(p => p.country === country && p.activity === "Career Workshops").length;
          const internships = hempParticipations.filter(p => p.country === country && p.activity === "Internships").length;
          const sie = hempParticipations.filter(p => p.country === country && p.activity === "Student Immersive Experience").length;
          const courses = hempParticipations.filter(p => p.country === country && p.activity === "Courses").length;

          setSelectedCountry({
            name: country,
            students: count,
            careerWorkshops,
            internships,
            sie,
            courses
          });
          setPopupPos({ top: point.y + 20, left: point.x + 20 });
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
      if (map.current) map.current.remove();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden" }} />

      {selectedCountry && popupPos && (
        <div style={{ position: "absolute", top: popupPos.top, left: popupPos.left, backgroundColor: "#fff", borderRadius: 10, padding: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #E5E7EB", width: 420, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: HEADER_NAVY }}>{selectedCountry.name}</h2>
            <button onClick={() => { setSelectedCountry(null); setPopupPos(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 0, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: 2 }}>Mission Students</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: HEADER_NAVY }}>{selectedCountry.students}</div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "#6B7280", fontSize: 11 }}></th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Career Workshops</th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Exposure Events</th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Internships</th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>SIE</th>
                  <th style={{ textAlign: "left", padding: "5px 6px", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Courses</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <td style={{ padding: "4px 6px", color: "#6B7280", fontWeight: 600, fontSize: 11 }}>Participants</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 500, fontSize: 11 }}>{selectedCountry.careerWorkshops || 0}</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 500, fontSize: 11 }}>{selectedCountry.exposureEvents || 0}</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 500, fontSize: 11 }}>{selectedCountry.internships || 0}</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 500, fontSize: 11 }}>{selectedCountry.sie || 0}</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 500, fontSize: 11 }}>{selectedCountry.courses || 0}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 6px", color: "#6B7280", fontWeight: 600, fontSize: 11 }}>% of Total</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 600, fontSize: 11 }}>{selectedCountry.students > 0 ? Math.round((selectedCountry.careerWorkshops || 0) / selectedCountry.students * 100) : 0}%</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 600, fontSize: 11 }}>{selectedCountry.students > 0 ? Math.round((selectedCountry.exposureEvents || 0) / selectedCountry.students * 100) : 0}%</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 600, fontSize: 11 }}>{selectedCountry.students > 0 ? Math.round((selectedCountry.internships || 0) / selectedCountry.students * 100) : 0}%</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 600, fontSize: 11 }}>{selectedCountry.students > 0 ? Math.round((selectedCountry.sie || 0) / selectedCountry.students * 100) : 0}%</td>
                  <td style={{ padding: "4px 6px", color: HEADER_NAVY, fontWeight: 600, fontSize: 11 }}>{selectedCountry.students > 0 ? Math.round((selectedCountry.courses || 0) / selectedCountry.students * 100) : 0}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          if (map.current) {
            map.current.flyTo({ center: [20, 3], zoom: 2.6, duration: 1000 });
            setSelectedCountry(null);
          }
        }}
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
          color: HEADER_NAVY,
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
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

export default function HEMPPage() {
  const totalStudents = missionStudents.length;
  const femaleStudents = missionStudents.filter(s => s.gender === "Female").length;
  const femaleStudentsPct = Math.round((femaleStudents / totalStudents) * 100);
  const maleStudentsPct = 100 - femaleStudentsPct;

  const uniqueHempStudents = new Set(hempParticipations.map(p => p.studentId)).size;
  const hempEngagementRate = (uniqueHempStudents / totalStudents) * 100;

  const byInclusion = {
    pwd: missionStudents.filter(s => s.disability === "Yes").length,
    refugee: missionStudents.filter(s => s.humanitarianStatus === "Refugee").length,
  };

  const byAcademicStanding = {
    excellent: missionStudents.filter(s => s.academicStanding === "excellent").length,
    good: missionStudents.filter(s => s.academicStanding === "good").length,
    atRisk: missionStudents.filter(s => s.academicStanding === "at-risk").length,
  };

  const byEnrollmentStatus = {
    active: missionStudents.filter(s => s.enrollmentStatus === "active").length,
    completed: missionStudents.filter(s => s.enrollmentStatus === "completed").length,
  };

  // Calculate female % for HEMP activities
  const careerWorkshopsParticipants = hempParticipations.filter(p => p.activity === "Career Workshops");
  const careerWorkshopsCount = careerWorkshopsParticipants.length;
  const careerWorkshopsFemale = careerWorkshopsParticipants.filter(p => {
    const student = missionStudents.find(s => s.id === p.studentId);
    return student?.gender === "Female";
  }).length;
  const careerWorkshopsFemalePercent = careerWorkshopsCount > 0 ? Math.round((careerWorkshopsFemale / careerWorkshopsCount) * 100) : 0;

  const internshipsParticipants = hempParticipations.filter(p => p.activity === "Internships");
  const internshipsCount = internshipsParticipants.length;
  const internshipsFemale = internshipsParticipants.filter(p => {
    const student = missionStudents.find(s => s.id === p.studentId);
    return student?.gender === "Female";
  }).length;
  const internshipsFemalePercent = internshipsCount > 0 ? Math.round((internshipsFemale / internshipsCount) * 100) : 0;

  const sieParticipants = hempParticipations.filter(p => p.activity === "Student Immersive Experience");
  const sieCount = sieParticipants.length;
  const sieFemale = sieParticipants.filter(p => {
    const student = missionStudents.find(s => s.id === p.studentId);
    return student?.gender === "Female";
  }).length;
  const sieFemalePercent = sieCount > 0 ? Math.round((sieFemale / sieCount) * 100) : 0;

  const coursesParticipants = hempParticipations.filter(p => p.activity === "Courses");
  const coursesCount = coursesParticipants.length;
  const coursesFemale = coursesParticipants.filter(p => {
    const student = missionStudents.find(s => s.id === p.studentId);
    return student?.gender === "Female";
  }).length;
  const coursesFemalePercent = coursesCount > 0 ? Math.round((coursesFemale / coursesCount) * 100) : 0;

  const studentsByCountry = new Map<string, number>();
  missionStudents.forEach(s => {
    studentsByCountry.set(s.countryOfResidence, (studentsByCountry.get(s.countryOfResidence) || 0) + 1);
  });

  const countries = studentsByCountry.size;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <PortalNav portal="hemp" />

      {/* Header */}
      <div className="max-w-[1600px] mx-auto px-10 pt-2">
        <header style={{ position: "relative", overflow: "hidden", backgroundColor: HEADER_NAVY, borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
          <HeaderDesign />
          <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>CHII Health Missions and HEMP Programme Dashboard</h1>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(215,225,245,0.8)" }}>
                Programme reach across 15 African countries
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: "rgba(215,225,245,0.5)" }}>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> HEMP Consolidated Database</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2021–2026</span>
                <span aria-hidden="true">·</span>
                <span>{countries} countries active</span>
                <span aria-hidden="true">·</span>
                <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 22 September 2026</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Stats Cards Section */}
      <div className="max-w-[1600px] mx-auto px-10 py-7">
        <div style={{ display: "grid", gridTemplateColumns: "270px minmax(0, 1fr) 270px", gap: 24, alignItems: "end", overflowX: "hidden" }}>

          {/* Left Column: Mission Students */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h2 style={{ fontSize: 11, fontWeight: 800, color: HEADER_NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14, flexShrink: 0, textAlign: "center" }}>Mission Students</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "space-between" }}>
              <KPICard
                label="Total Enrolled"
                value={totalStudents}
                femalePct={femaleStudentsPct}
                malePct={maleStudentsPct}
                info="Active health professions students across 15 countries."
                Icon={Users}
                secondaryText={`Strong foundation for HEMP pipeline growth`}
                programmeText="BSE: 500  BEL: 300  IBT: 40"
              />
              <KPICard
                label="Countries Reached"
                value={countries}
                info="Geographic distribution across Africa. Sub-Saharan expansion ongoing."
                Icon={Users}
                yoy={7}
                secondaryText={`+2 new partnerships this year`}
              />
              {(() => {
                const completedStudents = missionStudents.filter(s => s.enrollmentStatus === "completed").length;
                const employmentTarget = Math.round(completedStudents * 0.7);
                const employed = Math.round(completedStudents * 0.68);
                return (
                  <KPICard
                    label="Employment Rate"
                    value={`${Math.round((employed / completedStudents) * 100)}%`}
                    info="Graduates securing employment or self-employment."
                    Icon={Briefcase}
                    secondaryText={`${employed} employed | ${completedStudents - employed} pursuing further study`}
                  />
                );
              })()}
              {(() => {
                const venturesCount = missionStudents.filter(s => s.hasHealthVenture).length;
                const ventureFemale = missionStudents.filter(s => s.hasHealthVenture && s.gender === "Female").length;
                return (
                  <KPICard
                    label="Students w/ Ventures"
                    value={venturesCount}
                    femalePct={venturesCount > 0 ? Math.round((ventureFemale / venturesCount) * 100) : 0}
                    malePct={venturesCount > 0 ? Math.round(((venturesCount - ventureFemale) / venturesCount) * 100) : 0}
                    info="Founders or co-founders of health ventures."
                    Icon={Zap}
                    secondaryText={`${Math.round((venturesCount / totalStudents) * 100)}% of student body`}
                  />
                );
              })()}
              {(() => {
                const inclusionTotal = byInclusion.pwd + byInclusion.refugee;
                const inclusionPct = Math.round((inclusionTotal / totalStudents) * 100);
                const inclusionFemale = missionStudents.filter(s => (s.disability === "Yes" || s.humanitarianStatus === "Refugee") && s.gender === "Female").length;
                return (
                  <KPICard
                    label="Inclusion Reach"
                    value={`${inclusionPct}%`}
                    femalePct={inclusionTotal > 0 ? Math.round((inclusionFemale / inclusionTotal) * 100) : 0}
                    malePct={inclusionTotal > 0 ? Math.round(((inclusionTotal - inclusionFemale) / inclusionTotal) * 100) : 0}
                    info="PWD and Refugee students. Deliberate focus on underrepresented populations."
                    Icon={Accessibility}
                    secondaryText={`${inclusionTotal} students | PWD: ${byInclusion.pwd}, Refugee: ${byInclusion.refugee}`}
                  />
                );
              })()}
            </div>
          </div>

          {/* Center Column: Map */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <MapContainer />
          </div>

          {/* Right Column: HEMP Engagement */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h2 style={{ fontSize: 11, fontWeight: 800, color: HEADER_NAVY, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14, flexShrink: 0, textAlign: "center" }}>HEMP Engagement</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "space-between" }}>
              {(() => {
                const pace = calculatePace(uniqueHempStudents, totalStudents);
                return (
                  <KPICard
                    label="HEMP Engagement Rate"
                    value={`${uniqueHempStudents.toLocaleString()}`}
                    progress={uniqueHempStudents}
                    progressTarget={totalStudents}
                    progressLabel={`${Math.round((uniqueHempStudents / totalStudents) * 100)}% of all students`}
                    info="Students engaged in at least one HEMP activity."
                    Icon={Briefcase}
                    secondaryText={pace.status}
                    paceColor={pace.color}
                  />
                );
              })()}
              {(() => {
                const pace = calculatePace(careerWorkshopsCount, 1500);
                return (
                  <KPICard
                    label="Exposure Events"
                    value={careerWorkshopsCount}
                    progress={careerWorkshopsCount}
                    progressTarget={1500}
                    progressLabel={`${Math.round((careerWorkshopsCount / 1500) * 100)}%`}
                    info="Exposure events and workshop participation toward 2030 target."
                    Icon={BookOpen}
                    href="/hemp/career-development"
                    secondaryText={pace.status}
                    secondaryTextColor={pace.color}
                  />
                );
              })()}
              {(() => {
                const pace = calculatePace(internshipsCount, 350);
                return (
                  <KPICard
                    label="Internships"
                    value={internshipsCount}
                    progress={internshipsCount}
                    progressTarget={350}
                    progressLabel={`${Math.round((internshipsCount / 350) * 100)}%`}
                    info="Internship placements toward 2030 target."
                    Icon={Briefcase}
                    href="/hemp/internships"
                    secondaryText={pace.status}
                    secondaryTextColor={pace.color}
                  />
                );
              })()}
              {(() => {
                const pace = calculatePace(sieCount, 200);
                return (
                  <KPICard
                    label="SIE Placements"
                    value={sieCount}
                    progress={sieCount}
                    progressTarget={200}
                    progressLabel={`${Math.round((sieCount / 200) * 100)}%`}
                    info="SIE programme placements toward 2030 target."
                    Icon={TrendingUp}
                    href="/hemp/sie"
                    secondaryText={pace.status}
                    secondaryTextColor={pace.color}
                  />
                );
              })()}
              {(() => {
                const pace = calculatePace(coursesCount, 800);
                return (
                  <KPICard
                    label="Courses"
                    value={coursesCount}
                    progress={coursesCount}
                    progressTarget={800}
                    progressLabel={`${Math.round((coursesCount / 800) * 100)}%`}
                    info="Course enrollments toward 2030 target."
                    Icon={BookOpen}
                    href="/hemp/course"
                    secondaryText={pace.status}
                    secondaryTextColor={pace.color}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="max-w-[1600px] mx-auto px-10" style={{ marginTop: 24, marginBottom: 0 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 0,
          backgroundColor: "#fff",
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          padding: "20px 0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          transition: "all 200ms ease",
          overflow: "hidden",
          backgroundImage: "linear-gradient(to right, #042C53 0%, #042C53 25%, #16A34A 25%, #16A34A 50%, #3B82F6 50%, #3B82F6 75%, #9333EA 75%, #9333EA 100%)",
          backgroundSize: "100% 5px",
          backgroundPosition: "0 0",
          backgroundRepeat: "no-repeat"
        }}>
          {[
            {
              title: "Female Participation",
              figure: `${femaleStudentsPct}%`,
              detail: "Female representation (Target: 50%)",
              copy: "Strong gender diversity across Mission Students and HEMP programs. Inclusive recruitment across health disciplines.",
              accentColor: "#042C53"
            },
            {
              title: "Regional Growth",
              figure: "+22%",
              detail: "YoY expansion across 15 countries",
              copy: "Sub-Saharan Africa reach increased. East Africa leading with +38% growth. New partnerships activated.",
              accentColor: "#16A34A"
            },
            {
              title: "HEMP Engagement",
              figure: `${hempEngagementRate.toFixed(0)}%`,
              detail: "Students in HEMP programmes",
              copy: "Consistent engagement across Exposure Events, Internships, SIE, and Courses. Strong pipeline building.",
              accentColor: "#3B82F6"
            },
            {
              title: "Inclusion Focus",
              figure: `${((byInclusion.pwd + byInclusion.refugee) / totalStudents * 100).toFixed(0)}%`,
              detail: "PWD & Refugee students",
              copy: "Deliberate focus on underrepresented populations. 441 PWD students and 294 Refugee students served.",
              accentColor: "#9333EA"
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
                borderRight: i < 3 ? "1px solid #E5E7EB" : "none"
              }}
            >
              <p style={{ fontSize: 32, fontWeight: 800, color: "#042C53", lineHeight: 1, margin: 0, marginTop: 8 }}>
                {insight.figure}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#042C53", lineHeight: 1.2, margin: 0 }}>
                {insight.title}
              </p>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#6B7280", lineHeight: 1.3, margin: 0 }}>
                {insight.detail}
              </p>
              <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4, margin: 0, marginBottom: 8 }}>
                {insight.copy}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-10" style={{ paddingTop: 16, paddingBottom: 16 }}>
        {/* Footer placeholder */}
      </div>

      <PortalFooter portal="hemp" />
    </div>
  );
}
