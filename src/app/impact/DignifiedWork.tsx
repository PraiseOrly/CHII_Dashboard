"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
  reliableIncome: number;
  senseOfPurpose: number;
  reputation: number;
  respectWorkplace: number;
}

const BENCHMARKS = {
  reliableIncome:   64,
  senseOfPurpose:   71,
  reputation:       66,
  respectWorkplace: 69,
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
    reliableIncome:   r(1),
    senseOfPurpose:   r(2),
    reputation:       r(3),
    respectWorkplace: r(4),
  };
});

const METRICS: { key: keyof typeof BENCHMARKS; label: string; color: string; icon: string }[] = [
  { key: "reliableIncome",   label: "Reliable Income",          color: "#0F6E56", icon: "↑" },
  { key: "senseOfPurpose",   label: "Sense of Purpose",         color: "#185FA5", icon: "★" },
  { key: "reputation",       label: "Reputation",               color: "#7C3AED", icon: "◆" },
  { key: "respectWorkplace", label: "Respect in the Workplace", color: "#D97706", icon: "●" },
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
  const [cohort,   setCohort]   = useState<Cohort>("all");
  const [empType,  setEmpType]  = useState<EmpType>("all");

  const filtered = useMemo(() => RAW.filter(d =>
    (gender  === "all" || d.gender  === gender)  &&
    (age     === "all" || d.age     === age)      &&
    (country === "all" || d.country === country)  &&
    (cohort  === "all" || d.cohort  === cohort)   &&
    (empType === "all" || d.empType === empType)
  ), [gender, age, country, cohort, empType]);

  const scores = useMemo(() => {
    const n = filtered.length;
    if (!n) return null;
    return Object.fromEntries(
      METRICS.map(m => [m.key, avg(filtered.map(d => d[m.key]))])
    ) as Record<keyof typeof BENCHMARKS, number>;
  }, [filtered]);

  const chartData = useMemo(() => {
    if (!scores) return [];
    return METRICS.map(m => ({
      name: m.label,
      score: scores[m.key],
      benchmark: BENCHMARKS[m.key],
      color: m.color,
    }));
  }, [scores]);

  const BR2 = Bar as any;

  return (
    <div>
      {/* Filter row — single line, label embedded in first option */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14, alignItems: "center" }}>
        <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} style={SELECT_STYLE}>
          <option value="all">Gender: All</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>

        <select value={age} onChange={(e) => setAge(e.target.value as AgeGroup)} style={SELECT_STYLE}>
          <option value="all">Age: All</option>
          <option value="18-24">18–24</option>
          <option value="25-29">25–29</option>
          <option value="30-35">30–35</option>
        </select>

        <select value={cohort} onChange={(e) => setCohort(e.target.value as Cohort)} style={SELECT_STYLE}>
          <option value="all">Cohort: All</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        <select value={empType} onChange={(e) => setEmpType(e.target.value as EmpType)} style={SELECT_STYLE}>
          <option value="all">Type: All</option>
          <option value="Employed">Employed</option>
          <option value="Entrepreneur">Entrepreneur</option>
          <option value="Freelance">Freelance</option>
        </select>

        <select value={country} onChange={(e) => setCountry(e.target.value as Country)} style={SELECT_STYLE}>
          <option value="all">Country: All</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Kenya">Kenya</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Ghana">Ghana</option>
          <option value="Uganda">Uganda</option>
          <option value="Ethiopia">Ethiopia</option>
          <option value="South Africa">South Africa</option>
        </select>

        <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: "auto", flexShrink: 0 }}>
          n = <strong style={{ color: "#374151" }}>{filtered.length}</strong>
        </span>
      </div>

      {/* Score vs benchmark — horizontal bars */}
      {scores ? (
        <>
        <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 10 }}>Average score out of 100 — tick marks show the benchmark</p>
        <ResponsiveContainer width="100%" height={232}>
          <BarChart layout="vertical" data={chartData} barSize={20} barCategoryGap="28%" margin={{ top: 4, right: 44, bottom: 4, left: 4 }}>
            <CartesianGrid horizontal={false} stroke="rgba(0,33,71,0.08)" />
            <XAxis
              type="number" domain={[0, 100]} tickCount={6} allowDecimals={false}
              tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="name"
              tick={{ fontSize: 10, fill: "#374151" }}
              width={150} axisLine={false} tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,33,71,0.04)" }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const delta = d.score - d.benchmark;
                return (
                  <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <p style={{ fontWeight: 700, color: d.color, marginBottom: 4 }}>{d.name}</p>
                    <p style={{ color: "#374151" }}>Score <b>{d.score}</b>/100</p>
                    <p style={{ color: "#9CA3AF", fontSize: 9 }}>Benchmark {d.benchmark} · <span style={{ color: delta >= 0 ? "#0F6E56" : "#DC2626", fontWeight: 700 }}>{delta >= 0 ? "+" : ""}{delta}</span></p>
                  </div>
                );
              }}
            />
            <BR2
              dataKey="score" radius={[0, 3, 3, 0]} name="Score"
              label={(props: any) => {
                const { x, y, width, height: bh, index } = props;
                if (index == null || !chartData[index]) return null;
                const { score, benchmark } = chartData[index];
                // derive plot width from the score bar geometry, then place benchmark tick
                const bx = score > 0 ? x + (width * benchmark) / score : x;
                return (
                  <g>
                    <rect x={bx - 1} y={y - 3} width={2} height={bh + 6} rx={1} fill="#6B7280" />
                    <text x={x + width + 7} y={y + bh / 2 + 1} textAnchor="start" fontSize={10} fontWeight={700} fill="#374151" dominantBaseline="middle">
                      {score}
                    </text>
                  </g>
                );
              }}
            >
              {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </BR2>
          </BarChart>
        </ResponsiveContainer>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 13 }}>
          No data for selected filters
        </div>
      )}
    </div>
  );
}
