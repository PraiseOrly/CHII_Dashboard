"use client";
import { useState, useMemo } from "react";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { masterclasses } from "@/data/masterclasses";
import { fieldVisits } from "@/data/fieldVisits";
import { mentorshipPrograms } from "@/data/mentorships";

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

function avg(arr: number[]): number { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

const SEL: React.CSSProperties = {
  fontSize: 10, border: "1px solid rgba(0,33,71,0.12)", borderRadius: 5,
  padding: "2px 6px", color: "#374151", backgroundColor: "white", cursor: "pointer",
};

export default function ProgramQuality() {
  const [year, setYear] = useState<YearVal>("all");

  const programQuality = useMemo(() => {
    const hx2 = healthXSessions.filter(h => year === "all" || h.year === year);
    const int2 = internships.filter(i => year === "all" || i.year === year);
    const mc2  = masterclasses.filter(m => year === "all" || m.year === year);
    const fv2  = fieldVisits.filter(v => year === "all" || v.year === year);
    const mf2  = mentorshipPrograms.filter(p => year === "all" || p.year === year);
    return [
      { name: "HealthX",       sat: parseFloat(avg(hx2.map(h  => avg(Object.values(h.scores)))).toFixed(1)),  compl: Math.round(avg(hx2.map(h  => h.completionRate))),  color: "#1D9E75" },
      { name: "Internships",   sat: parseFloat(avg(int2.map(i => i.satisfactionScore)).toFixed(1)),            compl: 100,                                              color: "#BA7517" },
      { name: "Masterclasses", sat: parseFloat(avg(mc2.map(m  => avg(Object.values(m.scores)))).toFixed(1)),   compl: Math.round(avg(mc2.map(m  => m.completionRate))),  color: "#85B7EB" },
      { name: "Field Visits",  sat: parseFloat(avg(fv2.map(v  => avg(Object.values(v.scores)))).toFixed(1)),   compl: Math.round(avg(fv2.map(v  => v.completionRate))),  color: "#7F77DD" },
      { name: "Mentorship",    sat: parseFloat(avg(mf2.map(p  => avg(Object.values(p.scores)))).toFixed(1)),   compl: Math.round(avg(mf2.map(p  => p.completionRate))),  color: "#534AB7" },
    ];
  }, [year]);

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "24px 28px", border: "1px solid rgba(0,33,71,0.08)", minHeight: 400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: "#7F77DD", flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#7F77DD" }}>Program Quality</p>
        </div>
        <select value={String(year)} onChange={e => setYear(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)} style={SEL}>
          <option value="all">All years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {programQuality.map((p, i) => (
        <div key={p.name} style={{ marginBottom: i < programQuality.length - 1 ? 22 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{p.name}</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.sat.toFixed(1)}/5</p>
          </div>
          <div style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(0,33,71,0.06)", marginBottom: 4 }}>
            <div style={{ height: "100%", borderRadius: 4, backgroundColor: p.color, width: `${p.compl}%`, transition: "width 0.5s ease" }} />
          </div>
          <p style={{ fontSize: 10, color: "#9CA3AF" }}>{p.compl}% completion rate</p>
        </div>
      ))}
    </div>
  );
}
