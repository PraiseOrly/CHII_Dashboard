// Synthetic Outreach dataset — seeded so values are stable across renders.

export type Gender = "Female" | "Male" | "Non-binary";
export type Segment = "Scholar" | "Fee-Paying";
export type EnrollStatus =
  | "Enrolled"
  | "Graduated"
  | "Pending Graduation"
  | "In-progress"
  | "Failed";

export interface OutreachStudent {
  id: string;
  campus: string;
  segment: Segment;
  gender: Gender;
  refugee: boolean;       // Refugee / IDP
  pwd: boolean;           // Person with disability
  status: EnrollStatus;
  program: string;
  programType: "active" | "teach-out";
  yearEnrolled: number;
  yearGraduated: number | null;
  scholarYear: 1 | 2 | null;  // current year-of-study for active scholars
}

export const CAMPUSES = ["Rwanda", "Mauritius"] as const;

export const PROGRAMS_ACTIVE = [
  "Entrepreneurial Leadership",
  "Computer Science",
  "Software Engineering",
  "International Business & Trade",
  "Global Challenges",
] as const;

export const PROGRAMS_TEACHOUT = [
  "Social Sciences",
  "Mechatronic Engineering",
] as const;

export const GENDERS: Gender[] = ["Female", "Male", "Non-binary"];
export const STATUSES: EnrollStatus[] = [
  "Enrolled", "Graduated", "Pending Graduation", "In-progress", "Failed",
];

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024] as const;

function sd(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.floor(sd(s) * arr.length)]; }
function chance(s: number, p: number): boolean { return sd(s) < p; }

function makeStudents(): OutreachStudent[] {
  const out: OutreachStudent[] = [];
  const N = 940;
  for (let i = 0; i < N; i++) {
    const campus = pick(CAMPUSES, i * 3 + 1);
    const segment: Segment = chance(i * 5 + 2, 0.36) ? "Scholar" : "Fee-Paying";

    // Gender — ~52% F, ~2.5% non-binary, rest male
    const g = sd(i * 7 + 3);
    const gender: Gender = g < 0.52 ? "Female" : g < 0.975 ? "Male" : "Non-binary";

    // Equity flags — higher among scholars
    const refugee = chance(i * 11 + 4, segment === "Scholar" ? 0.24 : 0.05);
    const pwd     = chance(i * 13 + 5, segment === "Scholar" ? 0.09 : 0.04);

    const yearEnrolled = pick(YEARS, i * 17 + 6);
    const isTeachOut = chance(i * 19 + 7, 0.16);
    const program = isTeachOut
      ? pick(PROGRAMS_TEACHOUT, i * 23 + 8)
      : pick(PROGRAMS_ACTIVE, i * 23 + 8);

    // Status — older cohorts more likely graduated
    const age = 2024 - yearEnrolled;
    const r = sd(i * 29 + 9);
    let status: EnrollStatus;
    if (age >= 3) {
      status = r < 0.82 ? "Graduated" : r < 0.9 ? "Pending Graduation" : r < 0.96 ? "Failed" : "In-progress";
    } else if (age === 2) {
      status = r < 0.35 ? "Graduated" : r < 0.5 ? "Pending Graduation" : r < 0.95 ? "In-progress" : "Failed";
    } else {
      status = r < 0.92 ? "Enrolled" : r < 0.97 ? "In-progress" : "Failed";
    }

    const yearGraduated = status === "Graduated" ? Math.min(yearEnrolled + 3, 2024) : null;
    const scholarYear: 1 | 2 | null =
      segment === "Scholar" && (status === "Enrolled" || status === "In-progress")
        ? (chance(i * 31 + 10, 0.55) ? 1 : 2)
        : null;

    out.push({
      id: `OUT-${1000 + i}`,
      campus, segment, gender, refugee, pwd,
      status, program, programType: isTeachOut ? "teach-out" : "active",
      yearEnrolled, yearGraduated, scholarYear,
    });
  }
  return out;
}

export const OUTREACH_STUDENTS: OutreachStudent[] = makeStudents();
export const TREND_YEARS = YEARS;
