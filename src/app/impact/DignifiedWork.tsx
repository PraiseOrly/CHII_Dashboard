"use client";

import { useState, useMemo } from "react";

type Gender   = "all" | "Female" | "Male";
type AgeGroup = "all" | "18-24" | "25-29" | "30-35";
type Country  = "all" | "Rwanda" | "Kenya" | "Nigeria" | "Ghana" | "Uganda" | "Ethiopia" | "South Africa";
type Program  = "all" | "HENT" | "HEMP";
type Cohort   = "all" | "2021" | "2022" | "2023" | "2024";
type EmpType  = "all" | "Employed" | "Entrepreneur" | "Freelance";

interface DataPoint {
  gender: "Female" | "Male";
  age: "18-24" | "25-29" | "30-35";
  country: Country;
  program: "HENT" | "HEMP";
  cohort: "2021" | "2022" | "2023" | "2024";
  empType: "Employed" | "Entrepreneur" | "Freelance";
  jobSatisfaction: number;
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
const EMP_TYPES: ("Employed" | "Entrepreneur" | "Freelance")[] = ["Employed", "Entrepreneur", "Freelance"];
const GENDERS:   ("Female" | "Male")[] = ["Female", "Male"];
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

const SELECT_STYLE: React.CSSProperties = {
  fontSize: 11,
  border: "1px solid rgba(0,33,71,0.12)",
  borderRadius: 5,
  padding: "3px 6px",
  color: "#374151",
  backgroundColor: "white",
  cursor: "pointer",
  outline: "none",
};

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

  return (
    <div>
      {/* Dropdown filter row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, alignItems: "center" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Gender</span>
          <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} style={SELECT_STYLE}>
            <option value="all">All</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Age</span>
          <select value={age} onChange={(e) => setAge(e.target.value as AgeGroup)} style={SELECT_STYLE}>
            <option value="all">All</option>
            <option value="18-24">18-24</option>
            <option value="25-29">25-29</option>
            <option value="30-35">30-35</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Program</span>
          <select value={program} onChange={(e) => setProgram(e.target.value as Program)} style={SELECT_STYLE}>
            <option value="all">All</option>
            <option value="HENT">HENT</option>
            <option value="HEMP">HEMP</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cohort</span>
          <select value={cohort} onChange={(e) => setCohort(e.target.value as Cohort)} style={SELECT_STYLE}>
            <option value="all">All</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Type</span>
          <select value={empType} onChange={(e) => setEmpType(e.target.value as EmpType)} style={SELECT_STYLE}>
            <option value="all">All</option>
            <option value="Employed">Employed</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Country</span>
          <select value={country} onChange={(e) => setCountry(e.target.value as Country)} style={SELECT_STYLE}>
            <option value="all">All Countries</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Kenya">Kenya</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Uganda">Uganda</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="South Africa">South Africa</option>
          </select>
        </div>

        <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: "auto" }}>
          n = <strong style={{ color: "#374151" }}>{filtered.length}</strong>
        </span>
      </div>

      {/* Scorecard */}
      {scores ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {METRICS.map(m => {
            const score = scores[m.key];
            const benchmark = BENCHMARKS[m.key];
            const delta = score - benchmark;

            return (
              <div key={m.key} style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: "12px 14px",
                border: "1px solid rgba(0,33,71,0.07)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: m.color }}>{m.icon}</span>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#1F2937", flex: 1, lineHeight: 1.2 }}>{m.label}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: m.color, lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: 9, color: "#9CA3AF" }}>/100</span>
                  </div>
                </div>

                <div style={{ position: "relative", height: 6, borderRadius: 3, backgroundColor: "#F3F4F6", marginBottom: 6 }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, height: "100%",
                    width: `${Math.min(score, 100)}%`,
                    borderRadius: 3,
                    backgroundColor: m.color,
                    opacity: 0.8,
                    transition: "width 0.4s ease",
                  }} />
                  <div style={{
                    position: "absolute",
                    left: `${Math.min(benchmark, 100)}%`,
                    top: -2, width: 2, height: 10,
                    backgroundColor: "#6B7280",
                    borderRadius: 1,
                    transform: "translateX(-50%)",
                  }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "#9CA3AF" }}>Benchmark: {benchmark}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    color: delta >= 0 ? "#0F6E56" : "#DC2626",
                    backgroundColor: delta >= 0 ? "#ECFDF5" : "#FEF2F2",
                    padding: "1px 5px", borderRadius: 8,
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
