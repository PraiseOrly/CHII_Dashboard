"use client";
import { useState, useMemo } from "react";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/missionStudents";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { fieldVisits } from "@/data/fieldVisits";
import { mentorshipPrograms } from "@/data/mentorships";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

function fmt(n: number) { return Math.round(n).toLocaleString(); }

/* round an axis max up to a clean 1/2/5 × 10^n step */
function niceCeil(n: number): number {
  if (n <= 0) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(n)));
  const f = n / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * pow;
}

const SEL: React.CSSProperties = {
  fontSize: 10, border: "1px solid rgba(0,33,71,0.12)", borderRadius: 5,
  padding: "2px 6px", color: "#374151", backgroundColor: "white", cursor: "pointer",
};

/* Outcome pathways — these are the headline goals on the stats cards */
const WAGE = "#185FA5";   // Wage Employment
const ENT  = "#0F6E56";   // Entrepreneurs
const EDU  = "#7F77DD";   // Further Education

/* per-program conversion to an outcome + how those outcomes split across pathways */
const PROFILE: Record<string, { conv: number; wage: number; ent: number; edu: number }> = {
  "HealthX":       { conv: 0.55, wage: 0.62, ent: 0.20, edu: 0.18 },
  "Internships":   { conv: 0.78, wage: 0.80, ent: 0.10, edu: 0.10 },
  "Mission":       { conv: 0.70, wage: 0.55, ent: 0.25, edu: 0.20 },
  "Hackathons":    { conv: 0.40, wage: 0.25, ent: 0.65, edu: 0.10 },
  "Masterclasses": { conv: 0.45, wage: 0.58, ent: 0.27, edu: 0.15 },
  "Field Visits":  { conv: 0.42, wage: 0.45, ent: 0.25, edu: 0.30 },
  "Mentorship":    { conv: 0.60, wage: 0.35, ent: 0.55, edu: 0.10 },
};

export default function ProgramImpactMatrix() {
  const [year, setYear] = useState<YearVal>("all");

  const chartData = useMemo(() => {
    const hx2 = healthXSessions.filter(h => year === "all" || h.year === year);
    const int2 = internships.filter(i => year === "all" || i.year === year);
    const ms2  = missionStudents.filter(s => year === "all" || s.cohort === year);
    const hak2 = hackathons.filter(h => year === "all" || h.year === year);
    const mc2  = masterclasses.filter(m => year === "all" || m.year === year);
    const fv2  = fieldVisits.filter(v => year === "all" || v.year === year);
    const mf2  = mentorshipPrograms.filter(p => year === "all" || p.year === year);

    const scale: Record<string, number> = {
      "HealthX":       hx2.reduce((s, h) => s + h.participants, 0),
      "Internships":   int2.reduce((s, i) => s + i.students, 0),
      "Mission":       ms2.length,
      "Hackathons":    hak2.reduce((s, h) => s + h.participants, 0),
      "Masterclasses": mc2.reduce((s, m) => s + m.attendees, 0),
      "Field Visits":  fv2.reduce((s, v) => s + v.participants, 0),
      "Mentorship":    mf2.reduce((s, p) => s + p.fellows, 0),
    };

    return Object.entries(PROFILE).map(([name, p]) => {
      const outcomes = scale[name] * p.conv;
      const wage  = Math.round(outcomes * p.wage);
      const ent   = Math.round(outcomes * p.ent);
      const edu   = Math.round(outcomes * p.edu);
      return { name, wage, ent, edu, total: wage + ent + edu };
    }).sort((a, b) => b.total - a.total);
  }, [year]);

  const maxVal = Math.max(...chartData.map(d => d.total), 1);
  const niceMax = niceCeil(maxVal * 1.1);
  const BR2 = Bar as any;

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      {/* Navy heading band */}
      <div style={{ backgroundColor: "#14306B", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>Program Impact Matrix</p>
      </div>
      <div style={{ padding: "16px 24px 20px" }}>
      {/* Description + filter row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: 10, color: "#9CA3AF" }}>Youth-in-work outcomes each program delivers — by pathway</p>
        <select value={String(year)} onChange={e => setYear(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)} style={SEL}>
          <option value="all">All years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart layout="vertical" data={chartData} barSize={20} barCategoryGap="24%" margin={{ top: 4, right: 48, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
          <XAxis
            type="number" domain={[0, niceMax]} tickCount={6} allowDecimals={false}
            tick={{ fontSize: 9, fill: "#9CA3AF" }}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category" dataKey="name"
            tick={{ fontSize: 10, fill: "#374151" }}
            width={104} axisLine={false} tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,33,71,0.04)" }}
            content={({ active, payload }: any) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <p style={{ fontWeight: 700, color: "#14306B", marginBottom: 4 }}>{d.name}</p>
                  <p style={{ color: WAGE }}>Wage Employment <b>{fmt(d.wage)}</b></p>
                  <p style={{ color: ENT }}>Entrepreneurs <b>{fmt(d.ent)}</b></p>
                  <p style={{ color: EDU }}>Further Education <b>{fmt(d.edu)}</b></p>
                  <p style={{ color: "#9CA3AF", fontSize: 9, marginTop: 3, borderTop: "1px solid rgba(0,33,71,0.06)", paddingTop: 3 }}>Youth in work {fmt(d.total)}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="wage" stackId="o" fill={WAGE} name="Wage Employment" />
          <Bar dataKey="ent"  stackId="o" fill={ENT}  name="Entrepreneurs" />
          <BR2
            dataKey="edu" stackId="o" fill={EDU} radius={[0, 3, 3, 0]} name="Further Education"
            label={(props: any) => {
              const { x, y, width, height: bh, index } = props;
              if (index == null || !chartData[index]) return null;
              return (
                <text x={x + width + 7} y={y + bh / 2 + 1} textAnchor="start" fontSize={10} fontWeight={700} fill="#374151" dominantBaseline="middle">
                  {fmt(chartData[index].total)}
                </text>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
        {([
          { label: "Wage Employment", color: WAGE },
          { label: "Entrepreneurs",   color: ENT },
          { label: "Further Education", color: EDU },
        ] as { label: string; color: string }[]).map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: c.color }} />
            <span style={{ fontSize: 10, color: "#6B7280" }}>{c.label}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
