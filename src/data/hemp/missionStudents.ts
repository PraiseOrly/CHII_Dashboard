export type StudentTrack =
  | "Health Innovation"
  | "Health Management"
  | "Health Policy"
  | "Digital Health";

export type CompletionStatus = "Active" | "Completed" | "Deferred";
export type EmploymentStatus = "Employed" | "Entrepreneur" | "Further Study" | "Seeking";

export interface MissionStudent {
  id:             string;
  cohort:         number;
  country:        string;
  gender:         "Male" | "Female";
  track:          StudentTrack;
  status:         CompletionStatus;
  gpa:            number;
  hasInternship:  boolean;
  hasHealthX:     boolean;
  ventureCreated: boolean;
  employment:     EmploymentStatus | null;
}

export const STUDENT_TRACKS: StudentTrack[] = [
  "Health Innovation", "Health Management", "Health Policy", "Digital Health",
];

const COUNTRIES = [
  "Rwanda", "Kenya", "Uganda", "Tanzania", "Ghana", "Nigeria",
  "Ethiopia", "South Africa", "Senegal", "Cameroon", "Mozambique", "Zambia",
];
const TRACKS: StudentTrack[]  = ["Health Innovation", "Health Management", "Health Policy", "Digital Health"];
const EMP: EmploymentStatus[] = ["Employed", "Entrepreneur", "Further Study", "Seeking"];

function sd(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function pick<T>(arr: T[], s: number): T { return arr[Math.floor(sd(s) * arr.length)]; }
function chance(s: number, p: number): boolean { return sd(s) < p; }
function gpaVal(s: number): number {
  return parseFloat((2.8 + sd(s) * 1.2).toFixed(2));
}

const COHORTS = [
  { year: 2021, count: 18 },
  { year: 2022, count: 21 },
  { year: 2023, count: 24 },
  { year: 2024, count: 25 },
  { year: 2025, count: 25 },
  { year: 2026, count: 20 },
];

let _idx = 0;

export const missionStudents: MissionStudent[] = COHORTS.flatMap(({ year, count }) =>
  Array.from({ length: count }, () => {
    const id  = ++_idx;
    const sid = id * 17 + year;
    const cohortAge = 2026 - year;

    let status: CompletionStatus;
    if      (cohortAge >= 3) status = chance(sid + 1, 0.95) ? "Completed" : "Deferred";
    else if (cohortAge >= 2) status = chance(sid + 1, 0.80) ? "Completed" : "Active";
    else if (cohortAge >= 1) status = chance(sid + 1, 0.45) ? "Completed" : "Active";
    else                     status = chance(sid + 1, 0.10) ? "Completed" : "Active";

    const gender: "Male" | "Female" = chance(sid + 3, 0.55) ? "Female" : "Male";
    const track   = pick(TRACKS,    sid + 5);
    const country = pick(COUNTRIES, sid + 7);
    const gpa     = gpaVal(sid + 9);

    const hasInternship  = chance(sid + 11, cohortAge >= 2 ? 0.82 : 0.50);
    const hasHealthX     = chance(sid + 13, 0.76);
    const ventureCreated = status !== "Active" && chance(sid + 15, 0.20);

    let employment: EmploymentStatus | null = null;
    if (status !== "Active") {
      const probs = ventureCreated
        ? [0.12, 0.68, 0.10, 0.10]
        : [0.58, 0.14, 0.18, 0.10];
      const r = sd(sid + 17);
      let cum = 0;
      for (let j = 0; j < EMP.length; j++) {
        cum += probs[j];
        if (r < cum) { employment = EMP[j]; break; }
      }
      if (!employment) employment = "Employed";
    }

    return {
      id: `ms${String(id).padStart(3, "0")}`,
      cohort: year,
      country,
      gender,
      track,
      status,
      gpa,
      hasInternship,
      hasHealthX,
      ventureCreated,
      employment,
    };
  })
);
