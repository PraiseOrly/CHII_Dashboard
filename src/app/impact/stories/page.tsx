"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Info, ChevronDown, FileText, Video, MapPin, Film, BookOpen } from "lucide-react";
import {
  STORIES, SUMMARY, PROGRAMS, MISSION_AREAS, HUMANITARIAN, NATIONALITIES, DISABILITY, GENDERS,
  type Story,
} from "./_data";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";
import HeaderDesign from "@/components/HeaderDesign";
import StatsKpiCard from "../StatsKpiCard";

const StoriesMap = dynamic(() => import("./StoriesMap"), { ssr: false, loading: () =>
  <div style={{ width: "100%", height: "100%", minHeight: 480, borderRadius: 10, backgroundColor: "#E9EEF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 12 }}>Loading map…</div>
});

/* ── palette ─────────────────────────────────────────── */
const NAVY = "#14306B";
const BAND = "#14306B";
const TICK = "#D17A86";

/* ── KPI strip card ──────────────────────────────────── */
function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ backgroundColor: NAVY, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
      <p style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(181,212,244,0.75)", marginTop: 6 }}>{label}</p>
    </div>
  );
}

/* ── panel (header strip + body) ─────────────────────── */
function Panel({ title, info, collapsible, collapsed, onToggle, children }: {
  title: string; info?: boolean; collapsible?: boolean; collapsed?: boolean; onToggle?: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      <div onClick={collapsible ? onToggle : undefined}
        style={{ backgroundColor: BAND, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, cursor: collapsible ? "pointer" : "default" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: TICK, flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>{title}</p>
          {info && <Info size={11} color="rgba(181,212,244,0.85)" />}
        </div>
        {collapsible && <ChevronDown size={15} color="white" style={{ transform: collapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s" }} />}
      </div>
      {!collapsed && <div style={{ padding: "14px 16px 16px" }}>{children}</div>}
    </div>
  );
}

/* ── filter dropdown ─────────────────────────────────── */
function Dropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", marginTop: 4, fontSize: 11.5, color: NAVY, backgroundColor: "white", border: "1px solid rgba(0,33,71,0.15)", borderRadius: 6, padding: "7px 8px", cursor: "pointer", lineHeight: 1.3, minHeight: 34, whiteSpace: "normal" }}>
        <option value="All">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function ImpactStoriesPage() {
  const [selected, setSelected] = useState<Story | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [cluster, setCluster] = useState(true);
  const [nameQuery, setNameQuery] = useState("");

  const [type, setType] = useState("All");
  const [program, setProgram] = useState("All");
  const [mission, setMission] = useState("All");
  const [humanitarian, setHumanitarian] = useState("All");
  const [nationality, setNationality] = useState("All");
  const [disability, setDisability] = useState("All");
  const [gender, setGender] = useState("All");

  const filtered = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return STORIES.filter(s =>
      (type === "All" || s.type === type) &&
      (program === "All" || s.program === program) &&
      (mission === "All" || s.missionArea === mission) &&
      (humanitarian === "All" || s.humanitarianStatus === humanitarian) &&
      (nationality === "All" || s.nationality === nationality) &&
      (disability === "All" || s.disabilityStatus === disability) &&
      (gender === "All" || s.gender === gender) &&
      (!q || s.name.toLowerCase().includes(q))
    );
  }, [type, program, mission, humanitarian, nationality, disability, gender, nameQuery]);

  /* clear detail if the selected story is filtered out */
  const visibleSelected = selected && filtered.some(s => s.id === selected.id) ? selected : null;
  useEffect(() => {
    if (selected && !filtered.some(s => s.id === selected.id)) setSelected(null);
  }, [filtered, selected]);

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Banner + KPI strip ─────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <HeaderDesign />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Impact stories</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.8)" }}>Graduate journeys and enterprise spotlights across Africa</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7">

        {/* ── Stats row ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12, marginBottom: 16 }}>
          <StatsKpiCard label="Stories" num={SUMMARY.stories} sub="Total impact stories" Icon={BookOpen}
            tooltip="Total number of published impact stories across all programmes." />
          <StatsKpiCard label="Countries" num={SUMMARY.countries} sub="Represented" Icon={MapPin}
            tooltip="Number of countries represented across the impact stories." />
          <StatsKpiCard label="Video Stories" num={SUMMARY.video} sub="Filmed journeys" Icon={Video}
            tooltip="Impact stories told through video." />
          <StatsKpiCard label="Written Stories" num={SUMMARY.written} sub="Written features" Icon={FileText}
            tooltip="Impact stories told through written features." />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)", gap: 16, alignItems: "stretch" }} className="stories-grid">

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Story detail */}
            <Panel title="Story detail" info>
              {visibleSelected ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    {visibleSelected.type === "Video story"
                      ? <Film size={14} color="#7C3AED" />
                      : <FileText size={14} color="#102C5E" />}
                    <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280" }}>{visibleSelected.type}</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>{visibleSelected.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, color: "#6B7280" }}>
                    <MapPin size={12} /><span style={{ fontSize: 11 }}>{visibleSelected.location}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 9 }}>
                    {[visibleSelected.program, visibleSelected.missionArea, visibleSelected.gender].map(t => (
                      <span key={t} style={{ fontSize: 9.5, fontWeight: 600, color: "#102C5E", backgroundColor: "rgba(24,95,165,0.1)", border: "1px solid rgba(24,95,165,0.2)", borderRadius: 5, padding: "2px 7px" }}>{t}</span>
                    ))}
                  </div>

                  {visibleSelected.type === "Video story" && visibleSelected.videoUrl ? (
                    <div style={{ marginTop: 12, position: "relative", paddingTop: "56.25%", borderRadius: 8, overflow: "hidden", backgroundColor: "#000" }}>
                      <iframe src={visibleSelected.videoUrl} title={visibleSelected.name} allowFullScreen
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
                    </div>
                  ) : null}

                  <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, marginTop: 12 }}>{visibleSelected.body}</p>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "26px 12px" }}>
                  <MapPin size={26} color="#C5D2E0" />
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, marginTop: 10 }}>Select a story</p>
                  <p style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 4, lineHeight: 1.55 }}>Click on a map marker to view the story.</p>
                </div>
              )}
            </Panel>

            {/* Filters */}
            <Panel title="Filter stories" collapsible collapsed={!filtersOpen} onToggle={() => setFiltersOpen(o => !o)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Dropdown label="Story type" value={type} options={["Text story", "Video story"]} onChange={setType} />
                <Dropdown label="Academic program" value={program} options={PROGRAMS} onChange={setProgram} />
                <Dropdown label="Mission areas" value={mission} options={MISSION_AREAS} onChange={setMission} />
                <Dropdown label="Humanitarian status" value={humanitarian} options={HUMANITARIAN} onChange={setHumanitarian} />
                <Dropdown label="Nationality" value={nationality} options={NATIONALITIES} onChange={setNationality} />
                <Dropdown label="Disability status" value={disability} options={DISABILITY} onChange={setDisability} />
                <Dropdown label="Gender" value={gender} options={["Female", "Male"]} onChange={setGender} />
              </div>

              <label style={{ display: "block", marginTop: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>Search by name:</span>
                <input value={nameQuery} onChange={e => setNameQuery(e.target.value)} placeholder="e.g., Peter"
                  style={{ width: "100%", marginTop: 4, fontSize: 11.5, color: NAVY, backgroundColor: "white", border: "1px solid rgba(0,33,71,0.15)", borderRadius: 6, padding: "7px 9px", outline: "none" }} />
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={cluster} onChange={e => setCluster(e.target.checked)} />
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 600 }}>Cluster markers</span>
              </label>

              {/* legend */}
              <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,33,71,0.07)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#374151" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: "#102C5E", display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={11} color="white" /></span>
                  Text story
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#374151" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 5, backgroundColor: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}><Video size={11} color="white" /></span>
                  Video story
                </span>
              </div>
            </Panel>
          </div>

          {/* RIGHT COLUMN — map */}
          <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden", minHeight: 520 }}>
            <div style={{ height: "100%", minHeight: 520 }}>
              <StoriesMap stories={filtered} cluster={cluster} onSelect={setSelected} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <FeaturedImpactStory footer />
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .stories-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
