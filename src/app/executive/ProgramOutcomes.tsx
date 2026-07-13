"use client";
import { useState, useMemo } from "react";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/mission-students";
import { hackathons } from "@/data/hackathons";
import { ventures } from "@/data/ventures";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";
type Gender  = "all" | "Female" | "Male";

function fmt(n: number) { return Math.round(n).toLocaleString(); }

const SEL: React.CSSProperties = {
  fontSize: 10, border: "1px solid rgba(0,33,71,0.12)", borderRadius: 5,
  padding: "2px 6px", color: "#374151", backgroundColor: "white", cursor: "pointer",
};

export default function ProgramOutcomes() {
  const [year,   setYear]   = useState<YearVal>("all");
  const [gender, setGender] = useState<Gender>("all");

  const outcomeData = useMemo(() => {
    const int2 = internships.filter(i => year === "all" || i.year === year);
    const ms2  = missionStudents.filter(s =>
      (year   === "all" || s.cohort === year) &&
      (gender === "all" || s.gender === gender)
    );
    const hak2 = hackathons.filter(h => year === "all" || h.year === year);
    const vc2  = ventures.filter(v => year === "all" || v.cohort === year);

    const comp2      = ms2.filter(s => s.status === "Completed");
    const intConv2   = int2.reduce((s, i) => s + i.employmentConversions, 0);
    const msWageOnly = comp2.filter(s => s.employment === "Employed").length;
    const msEntOnly  = comp2.filter(s => s.employment === "Entrepreneur").length;
    const msFurther  = comp2.filter(s => s.employment === "Further Study").length;
    const hakStart   = hak2.reduce((s, h) => s + h.startupsCreated, 0);
    const employed   = comp2.filter(s => s.employment === "Employed" || s.employment === "Entrepreneur").length;
    const employmentOut = intConv2 + employed;
    const jobsFromVC    = vc2.reduce((s, v) => s + (v.jobsTotal ?? v.jobs6m ?? 0), 0);

    return ([
      { name: "Youth in Work",     value: employmentOut,           color: "#102C5E" },
      { name: "Jobs Created",      value: jobsFromVC,              color: "#479BD6" },
      { name: "Wage Employment",   value: msWageOnly + intConv2,   color: "#D45F2C" },
      { name: "Entrepreneurs",     value: msEntOnly + hakStart,    color: "#A81B2D" },
      { name: "Further Education", value: msFurther,               color: "#85B7EB" },
    ] as { name: string; value: number; color: string }[]).sort((a, b) => b.value - a.value);
  }, [year, gender]);

  const maxVal = Math.max(...outcomeData.map(d => d.value), 1);
  const BR = Bar as any;

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      {/* Navy heading band */}
      <div style={{ backgroundColor: "#14306B", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>Program Outcomes</p>
      </div>
      <div style={{ padding: "16px 24px 20px" }}>
      {/* Description + filter row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{ fontSize: 10, color: "#9CA3AF" }}>Cumulative outcome totals across all programs</p>
        <div style={{ display: "flex", gap: 6 }}>
          <select value={gender} onChange={e => setGender(e.target.value as Gender)} style={SEL}>
            <option value="all">Gender: All</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          <select value={String(year)} onChange={e => setYear(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)} style={SEL}>
            <option value="all">All years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={238}>
        <BarChart data={outcomeData} margin={{ top: 22, right: 10, bottom: 8, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,33,71,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 9, fill: "#374151" }}
            axisLine={false} tickLine={false}
            interval={0} height={30}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "#9CA3AF" }}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            axisLine={false} tickLine={false}
            domain={[0, Math.ceil(maxVal * 1.18)]}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,33,71,0.04)" }}
            content={({ active, payload }: any) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <p style={{ fontWeight: 700, color: d.color, marginBottom: 2 }}>{d.name}</p>
                  <p style={{ color: "#14306B", fontWeight: 600 }}>{fmt(d.value)}</p>
                  <p style={{ color: "#9CA3AF", fontSize: 9, marginTop: 1 }}>{Math.round(d.value / maxVal * 100)}% of largest outcome</p>
                </div>
              );
            }}
          />
          <BR
            dataKey="value"
            shape={(props: any) => {
              const { x, y, width, height: bh, payload } = props;
              if (!bh || bh <= 0) return <g />;
              return (
                <g>
                  <rect x={x + 3} y={y} width={Math.max(width - 6, 4)} height={bh} fill={payload.color} fillOpacity={0.88} rx={4} ry={4} />
                  <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#374151">
                    {fmt(payload.value)}
                  </text>
                </g>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        {outcomeData.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "#374151" }}>{d.name}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
