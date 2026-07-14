import type { Gender, ParticipantType } from "@/types";
export type { Gender, ParticipantType };
export { GENDERS } from "@/types";
/* ════════════════════════════════════════════════════════
   Youth in Work — synthetic dataset
   Deterministic (seeded) so SSR and CSR render identically.

   Tracks employment outcomes across the whole CHII ecosystem:
   current students, alumni, and people employed by supported
   ventures — plus the jobs those ventures create.
═══════════════════════════════════════════════════════ */

export type Program = "HEMP" | "HENT" | "HECO";

export type Pathway =
  | "Wage Employment"
  | "Internship"
  | "Enterprise"
  | "Wage & Venture"
  | "Further Education"
  | "Seeking Employment"
  | "Other";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "None";
export type EmployerType = "Startup" | "Corporate" | "Public Sector" | "NGO" | "Self-employed";

export interface Youth {
  id: number;
  participantType: ParticipantType;
  program: Program;
  gender: Gender;
  country: string;
  basedInAfrica: boolean;
  refugee: boolean;
  pwd: boolean;
  scholar: boolean;           // MCF scholar
  pathway: Pathway;
  year: number;               // year of latest recorded outcome
  cohort: number;             // graduation cohort year
  employmentType: EmploymentType;
  employerType: EmployerType;
  decentWork: boolean;        // meets dignified-work criteria
  permanent: boolean;         // permanent vs contract (employed only)
  leadership: boolean;        // holds a leadership / management role
  sector: string;
  primaryJob: boolean;
  secondaryJob: boolean;
  jobsCreated: number;        // > 0 for founders (positions their venture created)
}

/* A named venture supported by CHII, and the jobs it created. */
export interface Venture {
  name: string;
  program: Program;
  employees: number;
  studentEmployees: number;
  alumniEmployees: number;
}

export const PROGRAMS: Program[] = ["HEMP", "HENT", "HECO"];
export const PARTICIPANT_TYPES: ParticipantType[] = ["Student", "Alumni", "Venture Employee"];

export const PATHWAYS: Pathway[] = [
  "Wage Employment",
  "Internship",
  "Enterprise",
  "Wage & Venture",
  "Further Education",
  "Seeking Employment",
  "Other",
];

export const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Contract"];
export const EMPLOYER_TYPES: EmployerType[] = ["Startup", "Corporate", "Public Sector", "NGO", "Self-employed"];
export const WORK_CATEGORIES = ["Full-time", "Part-time", "Contract", "Internship", "Self-employed", "Enterprise"];
export const COHORTS = [2019, 2020, 2021, 2022, 2023, 2024];

export const COUNTRIES = [
  "Rwanda", "Kenya", "Nigeria", "Ghana", "Uganda",
  "South Africa", "Ethiopia", "Other Africa", "Diaspora",
];
const AFRICA_COUNTRIES = new Set(COUNTRIES.filter(c => c !== "Diaspora"));

export const SECTORS = [
  "Digital Health", "MedTech", "Biotech & Pharma", "Mental Health & Wellness",
  "Fitness & Preventive Health", "Healthcare Infrastructure & Operations",
  "Personalized & Precision Medicine", "Public Health & Accessibility",
  "Maternal Health", "Other",
];

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

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

/* employment & venture pathway sets (shared by the page) */
export const EMPLOYED_PATHWAYS: Pathway[] = ["Wage Employment", "Wage & Venture"];
export const VENTURE_PATHWAYS: Pathway[] = ["Enterprise", "Wage & Venture"];

function buildYouth(n: number): Youth[] {
  const r = rng(42);
  const out: Youth[] = [];
  for (let i = 0; i < n; i++) {
    const participantType = pick<ParticipantType>(r, [
      ["Student", 0.42], ["Alumni", 0.42], ["Venture Employee", 0.16],
    ]);
    const program = pick<Program>(r, [["HEMP", 0.4], ["HENT", 0.36], ["HECO", 0.24]]);
    const gender = pick<Gender>(r, [["Female", 0.55], ["Male", 0.42], ["Non-binary", 0.03]]);
    const scholar = r() < 0.4;

    // pathway depends on where someone is in their journey
    let pathway: Pathway;
    if (participantType === "Student") {
      pathway = pick<Pathway>(r, [
        ["Internship", 0.4], ["Wage Employment", 0.14], ["Enterprise", 0.12],
        ["Further Education", 0.12], ["Seeking Employment", 0.16], ["Other", 0.06],
      ]);
    } else if (participantType === "Alumni") {
      pathway = pick<Pathway>(r, [
        ["Wage Employment", 0.46], ["Enterprise", 0.16], ["Wage & Venture", 0.1],
        ["Further Education", 0.12], ["Seeking Employment", 0.1], ["Other", 0.06],
      ]);
    } else {
      // venture employees are, by definition, in wage work at a supported venture
      pathway = "Wage Employment";
    }

    const isFounder = pathway === "Enterprise" || pathway === "Wage & Venture";
    const jobsCreated = isFounder ? 1 + Math.floor(r() * 12) : 0;

    const employed = pathway === "Wage Employment" || pathway === "Wage & Venture" || participantType === "Venture Employee";
    const employmentType: EmploymentType = employed
      ? pick<EmploymentType>(r, [["Full-time", 0.62], ["Part-time", 0.22], ["Contract", 0.16]])
      : "None";

    const primaryJob = employed || pathway === "Enterprise";
    const secondaryJob = primaryJob && r() < 0.24;

    const country = pick<string>(r, [
      ["Rwanda", 0.2], ["Kenya", 0.16], ["Nigeria", 0.14], ["Ghana", 0.1],
      ["Uganda", 0.08], ["South Africa", 0.08], ["Ethiopia", 0.06],
      ["Other Africa", 0.1], ["Diaspora", 0.08],
    ]);

    const year = pick<number>(r, [[2020, 0.1], [2021, 0.13], [2022, 0.16], [2023, 0.19], [2024, 0.22], [2025, 0.2]]);

    const employerType: EmployerType = isFounder
      ? "Self-employed"
      : pick<EmployerType>(r, [
          ["Startup", 0.3], ["Corporate", 0.32], ["NGO", 0.18], ["Public Sector", 0.14], ["Self-employed", 0.06],
        ]);

    out.push({
      id: i + 1,
      participantType,
      program,
      gender,
      country,
      basedInAfrica: AFRICA_COUNTRIES.has(country),
      refugee: r() < 0.12,
      pwd: r() < 0.06,
      scholar,
      pathway,
      year,
      cohort: Math.max(2019, year - Math.floor(r() * 3)),
      employmentType,
      employerType,
      decentWork: primaryJob && r() < 0.72,
      permanent: employed ? r() < 0.64 : false,
      leadership: primaryJob && r() < 0.22,
      sector: primaryJob ? pick<string>(r, [
        ["Digital Health", 0.2], ["MedTech", 0.14], ["Biotech & Pharma", 0.1], ["Mental Health & Wellness", 0.1],
        ["Fitness & Preventive Health", 0.08], ["Healthcare Infrastructure & Operations", 0.1],
        ["Personalized & Precision Medicine", 0.07], ["Public Health & Accessibility", 0.09],
        ["Maternal Health", 0.07], ["Other", 0.05],
      ]) : "Other",
      primaryJob,
      secondaryJob,
      jobsCreated,
    });
  }
  return out;
}

export const YOUTH: Youth[] = buildYouth(820);

/* ── Named ventures supported by CHII (top job creators) ── */
function buildVentures(): Venture[] {
  const names: [string, Program][] = [
    ["Kasha Health", "HEMP"], ["AgriLink", "HECO"], ["MediTrack", "HEMP"],
    ["PaySmart", "HENT"], ["EduReach", "HECO"], ["SolarGrid", "HENT"],
    ["CareConnect", "HEMP"], ["FarmFlow", "HECO"], ["TradeBridge", "HENT"],
    ["ClinicOS", "HEMP"], ["LearnHub", "HECO"], ["FinPesa", "HENT"],
  ];
  const r = rng(91);
  return names.map(([name, program]) => {
    const employees = 6 + Math.floor(r() * 44);
    const studentEmployees = Math.round(employees * (0.2 + r() * 0.2));
    const alumniEmployees = Math.round(employees * (0.3 + r() * 0.2));
    return { name, program, employees, studentEmployees, alumniEmployees };
  }).sort((a, b) => b.employees - a.employees);
}

export const VENTURES: Venture[] = buildVentures();
