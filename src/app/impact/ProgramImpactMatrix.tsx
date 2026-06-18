"use client";
import { useState, useMemo } from "react";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/missionStudents";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { fieldVisits } from "@/data/fieldVisits";
import { mentorshipPrograms } from "@/data/mentorships";
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

function avg(arr: number[]): number { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function fmt(n: number) { return Math.round(n).toLocaleString(); }

const SEL: React.CSSProperties = {
  fontSize: 10, border: "1px solid rgba(0,33,71,0.12)", borderRadius: 5,
  padding: "2px 6px", color: "#374151", backgroundColor: "white", cursor: "pointer",
};

export default function ProgramImpactMatrix() {
  const [year, setYear] = useState<YearVal>("all");

  const bubbleData = useMemo(() => {
    const hx2 = healthXSessions.filter(h => year === "all" || h.year === year);
    const int2 = internships.filter(i => year === "all" || i.year === year);
    const ms2  = missionStudents.filter(s => year === "all" || s.cohort === year);
    const hak2 = hackathons.filter(h => year === "all" || h.year === year);
    const mc2  = masterclasses.filter(m => year === "all" || m.year === year);
    const fv2  = fieldVisits.filter(v => year === "all" || v.year === year);
    const mf2  = mentorshipPrograms.filter(p => year === "all" || p.year === year);

    const hxPart      = hx2.reduce((s, h) => s + h.participants, 0);
    const hxAvgCompl  = Math.round(avg(hx2.map(h => h.completionRate)));
    const intStudents = int2.reduce((s, i) => s + i.students, 0);
    const intConv     = int2.reduce((s, i) => s + i.employmentConversions, 0);
    const comp2       = ms2.filter(s => s.status === "Completed");
    const msTotal     = ms2.length;
    const msCompPct   = msTotal ? Math.round((comp2.length / msTotal) * 100) : 0;
    const msEmployed  = comp2.filter(s => s.employment === "Employed" || s.employment === "Entrepreneur");
    const hakPart     = hak2.reduce((s, h) => s + h.participants, 0);
    const hakStart    = hak2.reduce((s, h) => s + h.startupsCreated, 0);
    const mcAtt       = mc2.reduce((s, m) => s + m.attendees, 0);
    const mcAvgCompl  = Math.round(avg(mc2.map(m => m.completionRate)));
    const fvPart      = fv2.reduce((s, v) => s + v.participants, 0);
    const fvAvgCompl  = Math.round(avg(fv2.map(v => v.completionRate)));
    const mfFel       = mf2.reduce((s, p) => s + p.fellows, 0);
    const mfGrad      = mf2.filter(p => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0);

    return [
      { name: "HealthX",       x: hxPart,     y: hxAvgCompl,                                                 z: Math.max(hxPart * 0.4, 20),         color: "#378ADD" },
      { name: "Internships",   x: intStudents, y: intStudents > 0 ? Math.round(intConv / intStudents * 100) : 0, z: Math.max(intConv * 18, 20),      color: "#0C447C" },
      { name: "Mission",       x: msTotal,     y: msCompPct,                                                  z: Math.max(msEmployed.length * 15, 20), color: "#185FA5" },
      { name: "Hackathons",    x: hakPart,     y: hakPart > 0 ? Math.round(hakStart / hakPart * 100) : 0,    z: Math.max(hakStart * 25, 20),         color: "#0F6E56" },
      { name: "Masterclasses", x: mcAtt,       y: mcAvgCompl,                                                 z: Math.max(mcAtt * 0.6, 20),           color: "#1D9E75" },
      { name: "Field Visits",  x: fvPart,      y: fvAvgCompl,                                                 z: Math.max(fvPart * 0.5, 20),          color: "#085041" },
      { name: "Mentorship",    x: mfFel,       y: mfFel > 0 ? Math.round(mfGrad / mfFel * 100) : 0,          z: Math.max(mfGrad * 12, 20),           color: "#7F77DD" },
    ];
  }, [year]);

  const zMax = Math.max(...bubbleData.map(b => b.z));
  const SC = Scatter as any;

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: "#042C53", flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#042C53" }}>Program Impact Matrix</p>
        </div>
        <select value={String(year)} onChange={e => setYear(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)} style={SEL}>
          <option value="all">All years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 8, marginLeft: 12 }}>Scale vs. outcome rate — bubble size reflects economic weight</p>
      <ResponsiveContainer width="100%" height={196}>
        <ScatterChart margin={{ top: 10, right: 16, bottom: 28, left: -4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.05)" />
          <XAxis
            type="number" dataKey="x" name="Participants"
            tick={{ fontSize: 9, fill: "#9CA3AF" }}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            label={{ value: "Participants", position: "insideBottom", offset: -16, fontSize: 9, fill: "#9CA3AF" }}
          />
          <YAxis
            type="number" dataKey="y" name="Outcome Rate" domain={[0, 110]}
            tick={{ fontSize: 9, fill: "#9CA3AF" }}
            tickFormatter={(v: number) => `${v}%`}
            label={{ value: "Outcome %", angle: -90, position: "insideLeft", offset: 14, fontSize: 9, fill: "#9CA3AF" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(0,33,71,0.12)" }}
            content={({ active, payload }: any) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <p style={{ fontWeight: 700, color: d.color, marginBottom: 3 }}>{d.name}</p>
                  <p style={{ color: "#6B7280" }}>Participants: <b style={{ color: "#042C53" }}>{fmt(d.x)}</b></p>
                  <p style={{ color: "#6B7280" }}>Outcome rate: <b style={{ color: "#042C53" }}>{d.y}%</b></p>
                </div>
              );
            }}
          />
          <SC
            data={bubbleData}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const r = 8 + (payload.z / zMax) * 26;
              const label = payload.name.length > 9 ? payload.name.slice(0, 8) + "…" : payload.name;
              return (
                <g>
                  <circle cx={cx} cy={cy} r={r} fill={payload.color} fillOpacity={0.18} stroke={payload.color} strokeWidth={1.5} />
                  <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={7.5} fill={payload.color} fontWeight={700}>
                    {label}
                  </text>
                </g>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
        {([
          { label: "Employment", color: "#0C447C" },
          { label: "Enterprise", color: "#0F6E56" },
          { label: "Education",  color: "#378ADD" },
          { label: "Mentorship", color: "#7F77DD" },
        ] as { label: string; color: string }[]).map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c.color, opacity: 0.8 }} />
            <span style={{ fontSize: 9, color: "#6B7280" }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
