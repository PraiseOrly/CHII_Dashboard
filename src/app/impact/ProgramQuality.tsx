"use client";
import { useState, useMemo } from "react";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { masterclasses } from "@/data/masterclasses";
import { studyTrips } from "@/data/study-trips";
import { mentorshipPrograms } from "@/data/mentorships";

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

function avg(arr: number[]): number { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

const SEL: React.CSSProperties = {
  fontSize: 10, border: "1px solid rgba(0,33,71,0.12)", borderRadius: 5,
  padding: "2px 6px", color: "#374151", backgroundColor: "white", cursor: "pointer",
};

/* Weighted blend of outcome-linked sub-metrics → one Effectiveness score (0-100).
   Weights favour the goals on the stats cards: conversion + retention carry the most. */
const WEIGHTS = { completion: 0.20, conversion: 0.35, retention: 0.30, satisfaction: 0.15 };
const SUBS = [
  { key: "completion",   label: "Completion" },
  { key: "conversion",   label: "Conversion" },
  { key: "retention",    label: "Retention" },
  { key: "satisfaction", label: "Satisfaction" },
] as const;

/* program-level conversion strength (share of completers reaching an outcome) */
const CONV: Record<string, number> = {
  "HealthX": 0.71, "Internships": 0.86, "Masterclasses": 0.58, "Field Visits": 0.54, "Mentorship": 0.74,
};

function scoreColor(s: number): string {
  if (s >= 80) return "#102C5E";
  if (s >= 70) return "#479BD6";
  if (s >= 60) return "#D45F2C";
  return "#A81B2D";
}

export default function ProgramQuality() {
  const [year, setYear] = useState<YearVal>("all");
  const [hover, setHover] = useState<string | null>(null);

  const programs = useMemo(() => {
    const hx2 = healthXSessions.filter(h => year === "all" || h.year === year);
    const int2 = internships.filter(i => year === "all" || i.year === year);
    const mc2  = masterclasses.filter(m => year === "all" || m.year === year);
    const fv2  = studyTrips.filter(v => year === "all" || v.year === year);
    const mf2  = mentorshipPrograms.filter(p => year === "all" || p.year === year);

    const rows = [
      { name: "HealthX",       sat: avg(hx2.map(h  => avg(Object.values(h.scores)))),  compl: Math.round(avg(hx2.map(h  => h.completionRate))) },
      { name: "Internships",   sat: avg(int2.map(i => i.satisfactionScore)),            compl: 100 },
      { name: "Masterclasses", sat: avg(mc2.map(m  => avg(Object.values(m.scores)))),   compl: Math.round(avg(mc2.map(m  => m.completionRate))) },
      { name: "Field Visits",  sat: avg(fv2.map(v  => avg(Object.values(v.scores)))),   compl: Math.round(avg(fv2.map(v  => v.completionRate))) },
      { name: "Mentorship",    sat: avg(mf2.map(p  => avg(Object.values(p.scores)))),   compl: Math.round(avg(mf2.map(p  => p.completionRate))) },
    ];

    return rows.map(r => {
      const completion = r.compl;
      const conversion = Math.round((CONV[r.name] ?? 0.6) * 100);
      const retention = Math.round(conversion * 0.88);
      const satisfaction = Math.round((r.sat || 0) / 5 * 100);
      const subs = { completion, conversion, retention, satisfaction };
      const index = Math.round(
        completion * WEIGHTS.completion +
        conversion * WEIGHTS.conversion +
        retention * WEIGHTS.retention +
        satisfaction * WEIGHTS.satisfaction
      );
      return { name: r.name, index, satRaw: parseFloat((r.sat || 0).toFixed(1)), subs };
    }).sort((a, b) => b.index - a.index);
  }, [year]);

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", minHeight: 400, overflow: "hidden" }}>
      {/* Navy heading band */}
      <div style={{ backgroundColor: "#14306B", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>Program Quality</p>
      </div>
      <div style={{ padding: "16px 28px 22px" }}>
      {/* Description + filter row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 10, color: "#9CA3AF" }}>Effectiveness Index — how well each program drives the headline goals</p>
        <select value={String(year)} onChange={e => setYear(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)} style={SEL}>
          <option value="all">All years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {programs.map((p, i) => {
        const clr = scoreColor(p.index);
        return (
          <div
            key={p.name}
            onMouseEnter={() => setHover(p.name)}
            onMouseLeave={() => setHover(null)}
            style={{ marginBottom: i < programs.length - 1 ? 16 : 0, position: "relative" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <p style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{p.name}</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: clr }}>{p.index}<span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600 }}>/100</span></p>
            </div>
            <div style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(0,33,71,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, backgroundColor: clr, width: `${Math.min(p.index, 100)}%`, transition: "width 0.5s ease" }} />
            </div>

            {/* sub-metric breakdown on hover */}
            {hover === p.name && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 20,
                backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 7,
                padding: "9px 12px", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", minWidth: 168,
              }}>
                {SUBS.map(s => (
                  <div key={s.key} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#6B7280" }}>{s.label}</span>
                    <b style={{ color: "#14306B" }}>{s.key === "satisfaction" ? `${p.satRaw}/5` : `${p.subs[s.key]}%`}</b>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
