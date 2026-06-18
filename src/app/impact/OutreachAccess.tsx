"use client";
import { useState, useMemo } from "react";
import { missionStudents } from "@/data/hemp/missionStudents";
import { masterclasses } from "@/data/masterclasses";
import { fieldVisits } from "@/data/fieldVisits";
import { mentorshipPrograms } from "@/data/mentorships";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

function fmt(n: number) { return Math.round(n).toLocaleString(); }

const SEL: React.CSSProperties = {
  fontSize: 10, border: "1px solid rgba(0,33,71,0.12)", borderRadius: 5,
  padding: "2px 6px", color: "#374151", backgroundColor: "white", cursor: "pointer",
};

export default function OutreachAccess() {
  const [year, setYear] = useState<YearVal>("all");

  const stackData = useMemo(() => {
    const ms = missionStudents.filter(s => year === "all" || s.cohort === year);
    const mc = year === "all" ? masterclasses       : masterclasses.filter(m => m.year === year);
    const fv = year === "all" ? fieldVisits         : fieldVisits.filter(v => v.year === year);
    const mf = year === "all" ? mentorshipPrograms  : mentorshipPrograms.filter(p => p.year === year);

    const enrolled_f = ms.filter(s => s.status === "Active"    && s.gender === "Female").length;
    const enrolled_m = ms.filter(s => s.status === "Active"    && s.gender === "Male"  ).length;
    const grad_f     = ms.filter(s => s.status === "Completed" && s.gender === "Female").length;
    const grad_m     = ms.filter(s => s.status === "Completed" && s.gender === "Male"  ).length;

    const mcT = mc.reduce((s, m) => s + m.attendees, 0);
    const fvT = fv.reduce((s, v) => s + v.participants, 0);
    const mfT = mf.reduce((s, p) => s + p.fellows, 0);
    const mcFR = mcT > 0 ? mc.reduce((s, m) => s + m.femaleAttendees,    0) / mcT : 0.5;
    const fvFR = fvT > 0 ? fv.reduce((s, v) => s + v.femaleParticipants, 0) / fvT : 0.5;
    const mfFR = mfT > 0 ? mf.reduce((s, p) => s + p.femaleFellows,      0) / mfT : 0.5;

    const sumFemEst = (k: "MCF Scholars" | "PWD" | "Refugee-Displaced") => Math.round(
      mc.reduce((s, m) => s + m.bySocial[k], 0) * mcFR +
      fv.reduce((s, v) => s + v.bySocial[k], 0) * fvFR +
      mf.reduce((s, p) => s + p.bySocial[k], 0) * mfFR
    );
    const sumTotal = (k: "MCF Scholars" | "PWD" | "Refugee-Displaced") =>
      mc.reduce((s, m) => s + m.bySocial[k], 0) +
      fv.reduce((s, v) => s + v.bySocial[k], 0) +
      mf.reduce((s, p) => s + p.bySocial[k], 0);

    const mcf_t = sumTotal("MCF Scholars"),      mcf_f = sumFemEst("MCF Scholars");
    const pwd_t = sumTotal("PWD"),               pwd_f = sumFemEst("PWD");
    const ref_t = sumTotal("Refugee-Displaced"), ref_f = sumFemEst("Refugee-Displaced");

    return [
      { name: "MCF Scholars",          female: mcf_f,     male: mcf_t - mcf_f,           total: mcf_t },
      { name: "Youth with Disability", female: pwd_f,     male: pwd_t - pwd_f,           total: pwd_t },
      { name: "Graduates",             female: grad_f,    male: grad_m,                  total: grad_f + grad_m },
      { name: "Refugees & Displaced",  female: ref_f,     male: ref_t - ref_f,           total: ref_t },
      { name: "Currently Enrolled",    female: enrolled_f,male: enrolled_m,              total: enrolled_f + enrolled_m },
    ].sort((a, b) => b.total - a.total);
  }, [year]);

  const maxVal = Math.max(...stackData.map(d => d.total), 1);
  const BR2 = Bar as any;

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: "#042C53", flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#042C53" }}>Outreach &amp; Access</p>
        </div>
        <select value={String(year)} onChange={e => setYear(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)} style={SEL}>
          <option value="all">All years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 14, marginLeft: 12 }}>Audience segments by gender — sorted by total reach</p>
      <ResponsiveContainer width="100%" height={238}>
        <BarChart layout="vertical" data={stackData} barSize={18} margin={{ top: 4, right: 52, bottom: 4, left: 4 }}>
          <XAxis
            type="number"
            domain={[0, Math.ceil(maxVal * 1.18)]}
            tick={{ fontSize: 9, fill: "#9CA3AF" }}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category" dataKey="name"
            tick={{ fontSize: 10, fill: "#374151" }}
            width={136} axisLine={false} tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,33,71,0.04)" }}
            content={({ active, payload }: any) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <p style={{ fontWeight: 700, color: "#185FA5", marginBottom: 4 }}>{d.name}</p>
                  <p style={{ color: "#185FA5" }}>Women <b>{fmt(d.female)}</b> <span style={{ color: "#9CA3AF", fontSize: 9 }}>({Math.round(d.female / d.total * 100)}%)</span></p>
                  <p style={{ color: "#85B7EB" }}>Men <b style={{ color: "#374151" }}>{fmt(d.male)}</b> <span style={{ color: "#9CA3AF", fontSize: 9 }}>({Math.round(d.male / d.total * 100)}%)</span></p>
                  <p style={{ color: "#9CA3AF", fontSize: 9, marginTop: 3, borderTop: "1px solid rgba(0,33,71,0.06)", paddingTop: 3 }}>Total {fmt(d.total)}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="female" stackId="g" fill="#185FA5" name="Women" />
          <BR2
            dataKey="male" stackId="g" fill="#85B7EB" radius={[0, 3, 3, 0]} name="Men"
            label={(props: any) => {
              const { x, y, width, height: bh, index } = props;
              if (index == null || !stackData[index]) return null;
              const total = stackData[index].total;
              return (
                <text x={x + width + 7} y={y + bh / 2 + 1} textAnchor="start" fontSize={10} fontWeight={700} fill="#374151" dominantBaseline="middle">
                  {fmt(total)}
                </text>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: "#185FA5" }} />
          Women
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: "#85B7EB" }} />
          Men
        </span>
      </div>
    </div>
  );
}
