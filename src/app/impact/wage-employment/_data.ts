/* ════════════════════════════════════════════════════════
   Wage Employment — synthetic dataset
   Deterministic (seeded) so SSR and CSR render identically.

   Scope: participants currently in WAGE EMPLOYMENT only.
   (No "Unemployed" category — this dashboard profiles the
   employed population: who they are, what work they do, which
   programs produced them, and whether the work is meaningful.)
═══════════════════════════════════════════════════════ */

export type Gender = "Female" | "Male" | "Other";
export type EmploymentType = "Full-time" | "Part-time" | "Temporary" | "Contract";
export type RoleLevel = "Entry" | "Mid" | "Senior" | "Lead/Manager" | "Exec";
export type Arrangement = "Remote" | "On-site" | "Hybrid";
export type ParticipantType = "Alumni" | "Student";
export type OrgType =
  | "Private company"
  | "Startup"
  | "NGO/Nonprofit"
  | "Government"
  | "Public sector"
  | "Multinational";

export interface Worker {
  id: number;
  gender: Gender;
  participantType: ParticipantType;
  program: string;          // academic program of study
  employmentType: EmploymentType;
  roleLevel: RoleLevel;
  arrangement: Arrangement;
  orgType: OrgType;
  sector: string;
  country: string;
  year: number;             // year the employment was recorded
  cohort: number;           // graduation cohort year
  timeToEmployment: number; // months from graduation to first job
  inTech: boolean;
  decentWork: boolean;
  salaryUSD: number;        // monthly
}

export const GENDERS: Gender[] = ["Female", "Male", "Other"];
export const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Temporary", "Contract"];
export const ROLE_LEVELS: RoleLevel[] = ["Entry", "Mid", "Senior", "Lead/Manager", "Exec"];
export const ARRANGEMENTS: Arrangement[] = ["Remote", "On-site", "Hybrid"];
export const PARTICIPANT_TYPES: ParticipantType[] = ["Alumni", "Student"];
export const ORG_TYPES: OrgType[] = ["Private company", "Startup", "NGO/Nonprofit", "Government", "Public sector", "Multinational"];

export const SECTORS = [
  "Digital Health", "MedTech", "Mental Health & Wellness", "Public Health & Accessibility",
  "Healthcare Infrastructure & Operations", "Biotech & Pharma", "Maternal Health",
  "Fitness & Preventive Health", "Personalized & Precision Medicine", "Other",
];

export const COUNTRIES = [
  "Rwanda", "Kenya", "Nigeria", "South Africa",
  "Ghana", "Uganda", "Other Africa", "Diaspora",
];

export const YEARS = [2021, 2022, 2023, 2024, 2025];
export const COHORTS = [2019, 2020, 2021, 2022, 2023, 2024];

export interface ProgramMeta { name: string; employmentRate: number; }
export const PROGRAMS: ProgramMeta[] = [
  { name: "BSc Software Eng", employmentRate: 88 },
  { name: "Computer Science", employmentRate: 85 },
  { name: "Entrepreneurial Leadership", employmentRate: 80 },
  { name: "International Business & Trade", employmentRate: 77 },
];
export const PROGRAM_NAMES = PROGRAMS.map(p => p.name);

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
    const sector = pick<string>(r, [
      ["Digital Health", 0.20], ["MedTech", 0.14], ["Mental Health & Wellness", 0.10],
      ["Public Health & Accessibility", 0.10], ["Healthcare Infrastructure & Operations", 0.10],
      ["Biotech & Pharma", 0.10], ["Maternal Health", 0.08], ["Fitness & Preventive Health", 0.07],
      ["Personalized & Precision Medicine", 0.06], ["Other", 0.05],
    ]);
    const cohort = pick<number>(r, [[2019, 0.12], [2020, 0.14], [2021, 0.17], [2022, 0.19], [2023, 0.2], [2024, 0.18]]);
    const year = Math.min(2025, cohort + Math.floor(r() * 3));

    out.push({
      id: i + 1,
      gender: pick<Gender>(r, [["Female", 0.54], ["Male", 0.43], ["Other", 0.03]]),
      participantType: pick<ParticipantType>(r, [["Alumni", 0.82], ["Student", 0.18]]),
      program: pick<string>(r, [
        ["BSc Software Eng", 0.3], ["Computer Science", 0.26], ["Entrepreneurial Leadership", 0.24],
        ["International Business & Trade", 0.2],
      ]),
      employmentType: pick<EmploymentType>(r, [
        ["Full-time", 0.62], ["Part-time", 0.16], ["Temporary", 0.12], ["Contract", 0.1],
      ]),
      roleLevel: pick<RoleLevel>(r, [
        ["Entry", 0.4], ["Mid", 0.3], ["Senior", 0.17], ["Lead/Manager", 0.09], ["Exec", 0.04],
      ]),
      arrangement: pick<Arrangement>(r, [["On-site", 0.46], ["Hybrid", 0.32], ["Remote", 0.22]]),
      orgType: pick<OrgType>(r, [
        ["Private company", 0.32], ["Startup", 0.2], ["NGO/Nonprofit", 0.16],
        ["Multinational", 0.13], ["Government", 0.1], ["Public sector", 0.09],
      ]),
      sector,
      country: pick<string>(r, [
        ["Rwanda", 0.2], ["Kenya", 0.18], ["Nigeria", 0.15], ["South Africa", 0.1],
        ["Ghana", 0.08], ["Uganda", 0.07], ["Other Africa", 0.13], ["Diaspora", 0.09],
      ]),
      year,
      cohort,
      timeToEmployment: 1 + Math.floor(Math.pow(r(), 1.6) * 22),
      inTech: sector === "Digital Health",
      decentWork: r() < 0.74,
      salaryUSD: Math.round(250 + Math.pow(r(), 1.7) * 2200),
    });
  }
  return out;
}

export const WORKERS: Worker[] = buildWorkers(640);
