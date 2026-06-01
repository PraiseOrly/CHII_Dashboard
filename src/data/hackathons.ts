export const PROJECT_CATEGORIES = [
  "AI/Technology", "Health", "Business", "Sustainability", "Other",
] as const;
export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

export interface Hackathon {
  id: string;
  name: string;
  year: number;
  location: string;
  participants: number;
  femaleCount: number;
  studentCount: number;
  projects: number;
  winningTeams: number;
  femaleWinnerTeams: number;
  startupsCreated: number;
  femaleStartups: number;
  partnerships: number;
  categories: Record<ProjectCategory, number>;
}

export const hackathons: Hackathon[] = [
  {
    id: "H01", name: "ALU Health Hackathon I", year: 2020, location: "Kigali, Rwanda",
    participants: 48,  femaleCount: 20, studentCount: 31,
    projects: 10, winningTeams: 3, femaleWinnerTeams: 1,
    startupsCreated: 2, femaleStartups: 1, partnerships: 3,
    categories: { "AI/Technology": 12, Health: 17, Business: 9, Sustainability: 6, Other: 4 },
  },
  {
    id: "H02", name: "ALU Health Hackathon II", year: 2021, location: "Lagos, Nigeria",
    participants: 56,  femaleCount: 24, studentCount: 37,
    projects: 12, winningTeams: 3, femaleWinnerTeams: 1,
    startupsCreated: 3, femaleStartups: 1, partnerships: 4,
    categories: { "AI/Technology": 14, Health: 20, Business: 11, Sustainability: 7, Other: 4 },
  },
  {
    id: "H03", name: "CHII Innovation Sprint", year: 2022, location: "Nairobi, Kenya",
    participants: 68,  femaleCount: 29, studentCount: 43,
    projects: 14, winningTeams: 3, femaleWinnerTeams: 1,
    startupsCreated: 4, femaleStartups: 2, partnerships: 5,
    categories: { "AI/Technology": 17, Health: 24, Business: 13, Sustainability: 9, Other: 5 },
  },
  {
    id: "H04", name: "AfriHealth Challenge", year: 2022, location: "Accra, Ghana",
    participants: 42,  femaleCount: 18, studentCount: 27,
    projects: 9,  winningTeams: 3, femaleWinnerTeams: 1,
    startupsCreated: 2, femaleStartups: 1, partnerships: 3,
    categories: { "AI/Technology": 10, Health: 15, Business: 8, Sustainability: 6, Other: 3 },
  },
  {
    id: "H05", name: "HENT Hack 2023", year: 2023, location: "Kigali, Rwanda",
    participants: 78,  femaleCount: 33, studentCount: 50,
    projects: 16, winningTeams: 4, femaleWinnerTeams: 2,
    startupsCreated: 6, femaleStartups: 3, partnerships: 6,
    categories: { "AI/Technology": 20, Health: 28, Business: 15, Sustainability: 10, Other: 5 },
  },
  {
    id: "H06", name: "AfriHealth Hack 2024", year: 2024, location: "Addis Ababa, Ethiopia",
    participants: 92,  femaleCount: 40, studentCount: 58,
    projects: 19, winningTeams: 4, femaleWinnerTeams: 2,
    startupsCreated: 7, femaleStartups: 3, partnerships: 8,
    categories: { "AI/Technology": 23, Health: 33, Business: 18, Sustainability: 11, Other: 7 },
  },
  {
    id: "H07", name: "HENT Impact Hack 2025", year: 2025, location: "Kigali, Rwanda",
    participants: 104, femaleCount: 45, studentCount: 66,
    projects: 21, winningTeams: 5, femaleWinnerTeams: 2,
    startupsCreated: 9, femaleStartups: 4, partnerships: 9,
    categories: { "AI/Technology": 26, Health: 37, Business: 20, Sustainability: 13, Other: 8 },
  },
  {
    id: "H08", name: "HENT Hack 2026", year: 2026, location: "Kigali, Rwanda",
    participants: 88,  femaleCount: 38, studentCount: 55,
    projects: 18, winningTeams: 4, femaleWinnerTeams: 2,
    startupsCreated: 8, femaleStartups: 4, partnerships: 7,
    categories: { "AI/Technology": 22, Health: 32, Business: 17, Sustainability: 11, Other: 6 },
  },
];
