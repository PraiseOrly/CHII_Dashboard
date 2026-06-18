/* ════════════════════════════════════════════════════════
   Wage Employment — synthetic dataset
   Deterministic (seeded) so SSR and CSR render identically.
═══════════════════════════════════════════════════════ */

export type Gender = "Female" | "Male" | "Other";
export type EmploymentType = "Full-time" | "Part-time" | "Temporary" | "Unemployed";
export type RoleLevel = "Entry" | "Mid" | "Senior" | "Lead/Manager" | "Exec";
export type Arrangement = "Remote" | "On-site" | "Hybrid";
export type OrgType =
  | "Private company"
  | "Public sector"
  | "Government"
  | "NGO/Nonprofit"
  | "Startup"
  | "Multinational";
export type TimeBucket = "<3 months" | "3–6" | "6–12" | "12–18" | "18–24+";

export interface Worker {
  id: number;
  gender: Gender;
  employmentType: EmploymentType;
  roleLevel: RoleLevel;
  arrangement: Arrangement;
  orgType: OrgType;
  timeToEmployment: TimeBucket;
  inTech: boolean;
  decentWork: boolean;
  salaryUSD: number; // monthly
}

export const GENDERS: Gender[] = ["Female", "Male", "Other"];
export const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Temporary", "Unemployed"];
export const ROLE_LEVELS: RoleLevel[] = ["Entry", "Mid", "Senior", "Lead/Manager", "Exec"];
export const ARRANGEMENTS: Arrangement[] = ["Remote", "On-site", "Hybrid"];
export const ORG_TYPES: OrgType[] = ["Private company", "Public sector", "Government", "NGO/Nonprofit", "Startup", "Multinational"];
export const TIME_BUCKETS: TimeBucket[] = ["<3 months", "3–6", "6–12", "12–18", "18–24+"];

export const SALARY_BANDS: { label: string; min: number; max: number }[] = [
  { label: "<300", min: 0, max: 300 },
  { label: "300–600", min: 300, max: 600 },
  { label: "600–900", min: 600, max: 900 },
  { label: "900–1.2k", min: 900, max: 1200 },
  { label: "1.2k–1.6k", min: 1200, max: 1600 },
  { label: "1.6k–2k", min: 1600, max: 2000 },
  { label: "2k+", min: 2000, max: Infinity },
];

/* mulberry32 — small deterministic PRNG */
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(r: () => number, weighted: [T, number][]): T {
  const total = weighted.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [val, w] of weighted) {
    if ((x -= w) <= 0) return val;
  }
  return weighted[weighted.length - 1][0];
}

function buildWorkers(n: number): Worker[] {
  const r = rng(73);
  const out: Worker[] = [];
  for (let i = 0; i < n; i++) {
    const employmentType = pick<EmploymentType>(r, [
      ["Full-time", 0.58], ["Part-time", 0.16], ["Temporary", 0.14], ["Unemployed", 0.12],
    ]);
    const employed = employmentType !== "Unemployed";
    out.push({
      id: i + 1,
      gender: pick<Gender>(r, [["Female", 0.54], ["Male", 0.43], ["Other", 0.03]]),
      employmentType,
      roleLevel: pick<RoleLevel>(r, [
        ["Entry", 0.4], ["Mid", 0.3], ["Senior", 0.17], ["Lead/Manager", 0.09], ["Exec", 0.04],
      ]),
      arrangement: pick<Arrangement>(r, [["On-site", 0.46], ["Hybrid", 0.32], ["Remote", 0.22]]),
      orgType: pick<OrgType>(r, [
        ["Private company", 0.32], ["Startup", 0.2], ["NGO/Nonprofit", 0.16],
        ["Multinational", 0.13], ["Government", 0.1], ["Public sector", 0.09],
      ]),
      timeToEmployment: pick<TimeBucket>(r, [
        ["<3 months", 0.28], ["3–6", 0.31], ["6–12", 0.23], ["12–18", 0.12], ["18–24+", 0.06],
      ]),
      inTech: r() < 0.38,
      decentWork: employed && r() < 0.74,
      salaryUSD: employed ? Math.round(250 + Math.pow(r(), 1.7) * 2200) : 0,
    });
  }
  return out;
}

export const WORKERS: Worker[] = buildWorkers(620);
