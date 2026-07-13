// Introduction to Global Health Course
// Healthcare Mission students come from different academic programmes but share a
// passion for improving healthcare. Alongside mentorship, ventures and research, we
// link them to opportunities in the health sector — including giving them COURSES in
// health. This is the foundational course: Introduction to Global Health.

export const GH_MODULES = [
  "Global Health Foundations",
  "Health Systems & Financing",
  "Epidemiology Basics",
  "Health Equity & Policy",
  "Innovation in Global Health",
] as const;
export type GHModule = typeof GH_MODULES[number];

/** Mission students come from a mix of academic programmes — the course is cross-disciplinary. */
export const GH_PROGRAMMES = [
  "Business & Entrepreneurship",
  "Computer Science",
  "Engineering",
  "Social Sciences",
  "International Business & Trade",
] as const;
export type GHProgramme = typeof GH_PROGRAMMES[number];

export interface GHCohort {
  id: string;
  cohortYear: number;
  enrolled: number;
  female: number;
  completed: number;
  certified: number;          // completed AND passed the assessment
  avgScore: number;           // mean assessment score, %
  satisfaction: number;       // out of 5
  /** Enrolment by the student's home academic programme */
  byProgramme: Record<GHProgramme, number>;
  /** Completion rate per module, % — reveals where learners drop off */
  moduleCompletion: Record<GHModule, number>;
  /** What the course led on to (the "link them to opportunities" goal) */
  progressedToVenture: number;
  progressedToResearch: number;
  progressedToInternship: number;
}

export const ghCohorts: GHCohort[] = [
  {
    id: "GH2022", cohortYear: 2022,
    enrolled: 34, female: 18, completed: 26, certified: 22,
    avgScore: 71, satisfaction: 4.0,
    byProgramme: {
      "Business & Entrepreneurship": 12, "Computer Science": 7, "Engineering": 5,
      "Social Sciences": 6, "International Business & Trade": 4,
    },
    moduleCompletion: {
      "Global Health Foundations": 97, "Health Systems & Financing": 88,
      "Epidemiology Basics": 74, "Health Equity & Policy": 81,
      "Innovation in Global Health": 76,
    },
    progressedToVenture: 5, progressedToResearch: 4, progressedToInternship: 9,
  },
  {
    id: "GH2023", cohortYear: 2023,
    enrolled: 48, female: 25, completed: 39, certified: 34,
    avgScore: 74, satisfaction: 4.2,
    byProgramme: {
      "Business & Entrepreneurship": 16, "Computer Science": 10, "Engineering": 7,
      "Social Sciences": 9, "International Business & Trade": 6,
    },
    moduleCompletion: {
      "Global Health Foundations": 98, "Health Systems & Financing": 91,
      "Epidemiology Basics": 78, "Health Equity & Policy": 85,
      "Innovation in Global Health": 82,
    },
    progressedToVenture: 8, progressedToResearch: 6, progressedToInternship: 14,
  },
  {
    id: "GH2024", cohortYear: 2024,
    enrolled: 61, female: 33, completed: 51, certified: 45,
    avgScore: 77, satisfaction: 4.4,
    byProgramme: {
      "Business & Entrepreneurship": 20, "Computer Science": 13, "Engineering": 9,
      "Social Sciences": 11, "International Business & Trade": 8,
    },
    moduleCompletion: {
      "Global Health Foundations": 99, "Health Systems & Financing": 93,
      "Epidemiology Basics": 82, "Health Equity & Policy": 88,
      "Innovation in Global Health": 86,
    },
    progressedToVenture: 11, progressedToResearch: 9, progressedToInternship: 19,
  },
  {
    id: "GH2025", cohortYear: 2025,
    enrolled: 72, female: 39, completed: 62, certified: 55,
    avgScore: 79, satisfaction: 4.5,
    byProgramme: {
      "Business & Entrepreneurship": 24, "Computer Science": 16, "Engineering": 10,
      "Social Sciences": 13, "International Business & Trade": 9,
    },
    moduleCompletion: {
      "Global Health Foundations": 99, "Health Systems & Financing": 95,
      "Epidemiology Basics": 85, "Health Equity & Policy": 90,
      "Innovation in Global Health": 89,
    },
    progressedToVenture: 14, progressedToResearch: 12, progressedToInternship: 24,
  },
  {
    id: "GH2026", cohortYear: 2026,
    enrolled: 58, female: 32, completed: 44, certified: 38,
    avgScore: 78, satisfaction: 4.5,
    byProgramme: {
      "Business & Entrepreneurship": 19, "Computer Science": 13, "Engineering": 8,
      "Social Sciences": 11, "International Business & Trade": 7,
    },
    moduleCompletion: {
      "Global Health Foundations": 97, "Health Systems & Financing": 90,
      "Epidemiology Basics": 79, "Health Equity & Policy": 84,
      "Innovation in Global Health": 81,
    },
    progressedToVenture: 9, progressedToResearch: 7, progressedToInternship: 16,
  },
];
