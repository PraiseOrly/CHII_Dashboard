"use client";

import { useState, useMemo } from "react";

type Gender   = "all" | "female" | "male";
type AgeGroup = "all" | "18-24" | "25-29" | "30-35";
type Country  = "all" | "Rwanda" | "Kenya" | "Nigeria" | "Ghana" | "Uganda" | "Ethiopia" | "South Africa";
type Program  = "all" | "HENT" | "HEMP";
type Cohort   = "all" | "2021" | "2022" | "2023" | "2024";
type EmpType  = "all" | "employed" | "entrepreneur" | "freelance";

interface DataPoint {
  gender: "female" | "male";
  age: "18-24" | "25-29" | "30-35";
  country: Country;
  program: "HENT" | "HEMP";
  cohort: "2021" | "2022" | "2023" | "2024";
  empType: "employed" | "entrepreneur" | "freelance";
  jobSatisfaction: number;   // 0-100
  incomeImprovement: number;
  skillsUtilization: number;
  workStability: number;
  careerProgression: number;
  confidenceAgency: number;
}

const BENCHMARKS = {
  jobSatisfaction:   72,
  incomeImprovement: 60,
  skillsUtilization: 68,
  workStability:     65,
  careerProgression: 58,
  confidenceAgency:  70,
};

function seed(x: number): number {
  const s = Math.sin(x * 12.9898 + 78.233) * 43758.5453123;
  return s - Math.floor(s);
}

const COUNTRIES: Country[] = ["Rwanda", "Kenya", "Nigeria", "Ghana", "Uganda", "Ethiopia", "South Africa"];
const PROGRAMS:  ("HENT" | "HEMP")[]  = ["HENT", "HEMP"];
const COHORTS:   ("2021" | "2022" | "2023" | "2024")[] = ["2021", "2022", "2023", "2024"];
const EMP_TYPES: ("employed" | "entrepreneur" | "freelance")[] = ["employed", "entrepreneur", "freelance"];
const GENDERS:   ("female" | "male")[] = ["female", "male"];
const AGES:      ("18-24" | "25-29" | "30-35")[] = ["18-24", "25-29", "30-35"];

const RAW: DataPoint[] = Array.from({ length: 300 }, (_, i) => {
  const r = (offset: number) => Math.round(50 + seed(i * 7 + offset) * 45);
  return {
    gender:            GENDERS[Math.floor(seed(i * 2) * 2)],
    age:               AGES[Math.floor(seed(i * 3) * 3)],
    country:           COUNTRIES[Math.floor(seed(i * 5) * COUNTRIES.length)] as Country,
    program:           PROGRAMS[Math.floor(seed(i * 11) * 2)],
    cohort:            COHORTS[Math.floor(seed(i * 13) * 4)],
    empType:           EMP_TYPES[Math.floor(seed(i * 17) * 3)],
    jobSatisfaction:   r(1),
    incomeImprovement: r(2),
    skillsUtilization: r(3),
    workStability:     r(4),
    careerProgression: r(5),
    confidenceAgency:  r(6),
  };
});

const METRICS: { key: keyof typeof BENCHMARKS; label: string; color: string; icon: string }[] = [
  { key: "jobSatisfaction",   label: "Job Satisfaction",    color: "#185FA5", icon: "★" },
  { key: "incomeImprovement", label: "Income Improvement",  color: "#0F6E56", icon: "↑" },
  { key: "skillsUtilization", label: "Skills Utilization",  color: "#7C3AED", icon: "◆" },
  { key: "workStability",     label: "Work Stability",      color: "#D97706", icon: "▲" },
  { key: "careerProgression", label: "Career Progression",  color: "#0891B2", icon: "→" },
  { key: "confidenceAgency",  label: "Confidence & Agency", color: "#DB2777", icon: "●" },
];

function avg(arr: number[]): number {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
}

const CHIP = (label: string, active: boolean, onClick: () => void, color = "#185FA5") => (
  <button
    key={label}
    onClick={onClick}
    style={{
      padding: "3px 10px",
      borderRadius: 20,
      border: `1px solid ${active ? color : "rgba(0,33,71,0.12)"}`,
      backgroundColor: active ? color : "transparent",
      color: active ? "white" : "#4B5563",
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.15s",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </button>
);

export default function DignifiedWork() {
  const [gender,   setGender]   = useState<Gender>("all");
  const [age,      setAge]      = useState<AgeGroup>("all");
  const [country,  setCountry]  = useState<Country>("all");
  const [program,  setProgram]  = useState<Program>("all");
  const [cohort,   setCohort]   = useState<Cohort>("all");
  const [empType,  setEmpType]  = useState<EmpType>("all");

  const filtered = useMemo(() => RAW.filter(d =>
    (gender  === "all" || d.gender  === gender)  &&
    (age     === "all" || d.age     === age)      &&
    (country === "all" || d.country === country)  &&
    (program === "all" || d.program === program)  &&
    (cohort  === "all" || d.cohort  === cohort)   &&
    (empType === "all" || d.empType === empType)
  ), [gender, age, country, program, cohort, empType]);

  const scores = useMemo(() => {
    const n = filtered.length;
    if (!n) return null;
    return Object.fromEntries(
      METRICS.map(m => [m.key, avg(filtered.map(d => d[m.key]))])
    ) as Record<keyof typeof BENCHMARKS, number>;
  }, [filtered]);

  const n = filtered.length;
  const hasFilters = gender !== "all" || age !== "all" || country !== "all" ||
                     program !== "all" || cohort !== "all" || empType !== "all";

  return (
    <div>
      {/* Filter row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>

        {/* Gender */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 2 }}>Gender</span>
          {(["all", "female", "male"] as Gender[]).map(v =>
            CHIP(v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1), gender === v, () => setGender(v))
          )}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: "#E5E7EB", alignSelf: "center" }} />

        {/* Age */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 2 }}>Age</span>
          {(["all", "18-24", "25-29", "30-35"] as AgeGroup[]).map(v =>
            CHIP(v === "all" ? "All" : v, age === v, () => setAge(v), "#7C3AED")
          )}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: "#E5E7EB", alignSelf: "center" }} />

        {/* Program */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 2 }}>Program</span>
          {(["all", "HENT", "HEMP"] as Program[]).map(v =>
            CHIP(v === "all" ? "All" : v, program === v, () => setProgram(v), "#0F6E56")
          )}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: "#E5E7EB", alignSelf: "center" }} />

        {/* Cohort */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 2 }}>Cohort</span>
          {(["all", "2021", "2022", "2023", "2024"] as Cohort[]).map(v =>
            CHIP(v === "all" ? "All" : v, cohort === v, () => setCohort(v), "#0891B2")
          )}
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: "#E5E7EB", alignSelf: "center" }} />

        {/* Employment Type */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 2 }}>Type</span>
          {(["all", "employed", "entrepreneur", "freelance"] as EmpType[]).map(v =>
            CHIP(v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1), empType === v, () => setEmpType(v), "#D97706")
          )}
        </div>

      </div>

      {/* Country filter — separate row */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", marginBottom: 18 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 2 }}>Country</span>
        {(["all", ...COUNTRIES] as Country[]).map(v =>
          CHIP(v === "all" ? "All Countries" : v, country === v, () => setCountry(v), "#DB2777")
        )}
      </div>

      {/* Sample count */}
      <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 16 }}>
        Showing <strong style={{ color: "#374151" }}>{n}</strong> respondents
        {hasFilters && <> · <button onClick={() => { setGender("all"); setAge("all"); setCountry("all"); setProgram("all"); setCohort("all"); setEmpType("all"); }} style={{ background: "none", border: "none", color: "#185FA5", fontSize: 10, cursor: "pointer", fontWeight: 600, padding: 0 }}>Clear filters</button></>}
      </p>

      {/* Scorecard grid */}
      {scores ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {METRICS.map(m => {
            const score = scores[m.key];
            const benchmark = BENCHMARKS[m.key];
            const delta = score - benchmark;
            const pct = Math.min(score, 100);
            const bPct = Math.min(benchmark, 100);

            return (
              <div key={m.key} style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: "14px 16px",
                border: "1px solid rgba(0,33,71,0.07)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: m.color, lineHeight: 1 }}>{m.icon}</span>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#1F2937", flex: 1 }}>{m.label}</p>
                  <div style={{
                    display: "flex", alignItems: "baseline", gap: 2,
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: m.color, lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>/100</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ position: "relative", height: 8, borderRadius: 4, backgroundColor: "#F3F4F6", marginBottom: 8 }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, height: "100%",
                    width: `${pct}%`,
                    borderRadius: 4,
                    backgroundColor: m.color,
                    opacity: 0.85,
                    transition: "width 0.4s ease",
                  }} />
                  {/* Benchmark tick */}
                  <div style={{
                    position: "absolute",
                    left: `${bPct}%`,
                    top: -3,
                    width: 2,
                    height: 14,
                    backgroundColor: "#6B7280",
                    borderRadius: 1,
                    transform: "translateX(-50%)",
                  }} />
                </div>

                {/* Delta vs benchmark */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "#9CA3AF" }}>
                    Benchmark: {benchmark}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    color: delta >= 0 ? "#0F6E56" : "#DC2626",
                    backgroundColor: delta >= 0 ? "#ECFDF5" : "#FEF2F2",
                    padding: "1px 6px", borderRadius: 10,
                  }}>
                    {delta >= 0 ? "+" : ""}{delta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 13 }}>
          No data for selected filters
        </div>
      )}
    </div>
  );
}
