export const MC_TOPICS = [
  "Business Development", "Finance & Funding", "Health Innovation",
  "Technology", "Operations", "Leadership",
] as const;
export type MCTopic = typeof MC_TOPICS[number];

export const RATING_CRITERIA = [
  "Quality of Content", "Usefulness", "Accessibility", "Relevance of Support",
] as const;
export type RatingCriterion = typeof RATING_CRITERIA[number];

export type RatingLevel = "Very High" | "High" | "Moderate" | "Low";

export interface Masterclass {
  id: string;
  name: string;
  topic: MCTopic;
  date: string;       // YYYY-MM-DD
  year: number;
  month: number;
  attendees: number;
  femaleAttendees: number;
  studentAttendees: number;
  completionRate: number; // 0-100
  venturesRepresented: number;
  femaleLedVentures: number;
  scores: Record<RatingCriterion, number>; // 1.0–5.0
  byAge: Record<"18-25" | "26-35" | "36-45" | "46+", number>;
  byRegion: Record<"East Africa" | "West Africa" | "South Africa" | "North Africa" | "Other", number>;
  byStage: Record<"Expose" | "Build" | "Scale", number>;
  bySocial: Record<"MCF Scholars" | "PWD" | "Refugee-Displaced", number>;
}

export const masterclasses: Masterclass[] = [
  {
    id: "M00a", name: "Intro to Health Entrepreneurship",
    topic: "Business Development", date: "2022-05-17", year: 2022, month: 5,
    attendees: 24, femaleAttendees: 10, studentAttendees: 18, completionRate: 79,
    venturesRepresented: 19, femaleLedVentures: 7,
    scores: { "Quality of Content": 3.9, "Usefulness": 4.1, "Accessibility": 3.7, "Relevance of Support": 3.8 },
    byAge: { "18-25": 11, "26-35": 9, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 13, "West Africa": 6, "South Africa": 3, "North Africa": 1, Other: 1 },
    byStage: { Expose: 13, Build: 8, Scale: 3 },
    bySocial: { "MCF Scholars": 8, PWD: 1, "Refugee-Displaced": 1 },
  },
  {
    id: "M00b", name: "Validating a Health Venture Idea",
    topic: "Health Innovation", date: "2022-09-28", year: 2022, month: 9,
    attendees: 27, femaleAttendees: 12, studentAttendees: 19, completionRate: 84,
    venturesRepresented: 22, femaleLedVentures: 8,
    scores: { "Quality of Content": 4.1, "Usefulness": 4.2, "Accessibility": 3.6, "Relevance of Support": 4.0 },
    byAge: { "18-25": 12, "26-35": 11, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 15, "West Africa": 7, "South Africa": 3, "North Africa": 1, Other: 1 },
    byStage: { Expose: 14, Build: 9, Scale: 4 },
    bySocial: { "MCF Scholars": 9, PWD: 1, "Refugee-Displaced": 1 },
  },
  {
    id: "M01", name: "Business Model Canvas Workshop",
    topic: "Business Development", date: "2023-02-10", year: 2023, month: 2,
    attendees: 32, femaleAttendees: 14, studentAttendees: 21, completionRate: 88,
    venturesRepresented: 28, femaleLedVentures: 10,
    scores: { "Quality of Content": 4.2, "Usefulness": 4.4, "Accessibility": 3.8, "Relevance of Support": 4.1 },
    byAge: { "18-25": 12, "26-35": 14, "36-45": 4, "46+": 2 },
    byRegion: { "East Africa": 18, "West Africa": 8, "South Africa": 3, "North Africa": 2, Other: 1 },
    byStage: { Expose: 14, Build: 12, Scale: 6 },
    bySocial: { "MCF Scholars": 11, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "M02", name: "Financial Planning for Health Startups",
    topic: "Finance & Funding", date: "2023-04-18", year: 2023, month: 4,
    attendees: 28, femaleAttendees: 12, studentAttendees: 18, completionRate: 82,
    venturesRepresented: 25, femaleLedVentures: 9,
    scores: { "Quality of Content": 4.0, "Usefulness": 4.5, "Accessibility": 3.6, "Relevance of Support": 4.3 },
    byAge: { "18-25": 10, "26-35": 13, "36-45": 4, "46+": 1 },
    byRegion: { "East Africa": 16, "West Africa": 7, "South Africa": 2, "North Africa": 2, Other: 1 },
    byStage: { Expose: 10, Build: 12, Scale: 6 },
    bySocial: { "MCF Scholars": 9, PWD: 1, "Refugee-Displaced": 1 },
  },
  {
    id: "M03", name: "Design Thinking for Health Innovation",
    topic: "Health Innovation", date: "2023-06-22", year: 2023, month: 6,
    attendees: 40, femaleAttendees: 18, studentAttendees: 26, completionRate: 91,
    venturesRepresented: 35, femaleLedVentures: 14,
    scores: { "Quality of Content": 4.6, "Usefulness": 4.5, "Accessibility": 4.1, "Relevance of Support": 4.7 },
    byAge: { "18-25": 16, "26-35": 17, "36-45": 5, "46+": 2 },
    byRegion: { "East Africa": 22, "West Africa": 10, "South Africa": 4, "North Africa": 2, Other: 2 },
    byStage: { Expose: 16, Build: 15, Scale: 9 },
    bySocial: { "MCF Scholars": 14, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M04", name: "Digital Marketing for Health Ventures",
    topic: "Technology", date: "2023-09-14", year: 2023, month: 9,
    attendees: 35, femaleAttendees: 15, studentAttendees: 22, completionRate: 85,
    venturesRepresented: 31, femaleLedVentures: 11,
    scores: { "Quality of Content": 4.1, "Usefulness": 4.2, "Accessibility": 3.9, "Relevance of Support": 4.0 },
    byAge: { "18-25": 14, "26-35": 15, "36-45": 4, "46+": 2 },
    byRegion: { "East Africa": 19, "West Africa": 9, "South Africa": 4, "North Africa": 2, Other: 1 },
    byStage: { Expose: 14, Build: 13, Scale: 8 },
    bySocial: { "MCF Scholars": 12, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "M05", name: "Legal & Intellectual Property for Startups",
    topic: "Operations", date: "2024-01-25", year: 2024, month: 1,
    attendees: 30, femaleAttendees: 13, studentAttendees: 18, completionRate: 78,
    venturesRepresented: 27, femaleLedVentures: 9,
    scores: { "Quality of Content": 3.8, "Usefulness": 4.0, "Accessibility": 3.5, "Relevance of Support": 3.9 },
    byAge: { "18-25": 10, "26-35": 14, "36-45": 4, "46+": 2 },
    byRegion: { "East Africa": 16, "West Africa": 8, "South Africa": 3, "North Africa": 2, Other: 1 },
    byStage: { Expose: 10, Build: 13, Scale: 7 },
    bySocial: { "MCF Scholars": 10, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "M06", name: "Fundraising & Investment Readiness",
    topic: "Finance & Funding", date: "2024-03-19", year: 2024, month: 3,
    attendees: 45, femaleAttendees: 20, studentAttendees: 28, completionRate: 93,
    venturesRepresented: 40, femaleLedVentures: 15,
    scores: { "Quality of Content": 4.7, "Usefulness": 4.8, "Accessibility": 4.2, "Relevance of Support": 4.6 },
    byAge: { "18-25": 18, "26-35": 19, "36-45": 6, "46+": 2 },
    byRegion: { "East Africa": 25, "West Africa": 11, "South Africa": 5, "North Africa": 2, Other: 2 },
    byStage: { Expose: 15, Build: 18, Scale: 12 },
    bySocial: { "MCF Scholars": 16, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M07", name: "Operations & Supply Chain Management",
    topic: "Operations", date: "2024-05-30", year: 2024, month: 5,
    attendees: 33, femaleAttendees: 14, studentAttendees: 20, completionRate: 80,
    venturesRepresented: 29, femaleLedVentures: 10,
    scores: { "Quality of Content": 3.9, "Usefulness": 4.1, "Accessibility": 3.7, "Relevance of Support": 3.8 },
    byAge: { "18-25": 12, "26-35": 15, "36-45": 4, "46+": 2 },
    byRegion: { "East Africa": 18, "West Africa": 8, "South Africa": 4, "North Africa": 2, Other: 1 },
    byStage: { Expose: 11, Build: 14, Scale: 8 },
    bySocial: { "MCF Scholars": 11, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "M08", name: "Data Analytics & AI for Health Ventures",
    topic: "Technology", date: "2024-07-16", year: 2024, month: 7,
    attendees: 38, femaleAttendees: 16, studentAttendees: 24, completionRate: 87,
    venturesRepresented: 34, femaleLedVentures: 12,
    scores: { "Quality of Content": 4.4, "Usefulness": 4.3, "Accessibility": 3.8, "Relevance of Support": 4.2 },
    byAge: { "18-25": 15, "26-35": 17, "36-45": 4, "46+": 2 },
    byRegion: { "East Africa": 21, "West Africa": 10, "South Africa": 4, "North Africa": 2, Other: 1 },
    byStage: { Expose: 13, Build: 15, Scale: 10 },
    bySocial: { "MCF Scholars": 13, PWD: 2, "Refugee-Displaced": 2 },
  },
  {
    id: "M09", name: "Leadership & High-Performance Team Building",
    topic: "Leadership", date: "2024-09-11", year: 2024, month: 9,
    attendees: 42, femaleAttendees: 19, studentAttendees: 25, completionRate: 90,
    venturesRepresented: 37, femaleLedVentures: 14,
    scores: { "Quality of Content": 4.5, "Usefulness": 4.4, "Accessibility": 4.0, "Relevance of Support": 4.3 },
    byAge: { "18-25": 16, "26-35": 18, "36-45": 6, "46+": 2 },
    byRegion: { "East Africa": 23, "West Africa": 11, "South Africa": 5, "North Africa": 2, Other: 1 },
    byStage: { Expose: 14, Build: 16, Scale: 12 },
    bySocial: { "MCF Scholars": 15, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M10", name: "Customer Discovery & Market Validation",
    topic: "Business Development", date: "2024-11-06", year: 2024, month: 11,
    attendees: 36, femaleAttendees: 16, studentAttendees: 22, completionRate: 84,
    venturesRepresented: 32, femaleLedVentures: 12,
    scores: { "Quality of Content": 4.2, "Usefulness": 4.5, "Accessibility": 3.9, "Relevance of Support": 4.4 },
    byAge: { "18-25": 14, "26-35": 15, "36-45": 5, "46+": 2 },
    byRegion: { "East Africa": 20, "West Africa": 9, "South Africa": 4, "North Africa": 2, Other: 1 },
    byStage: { Expose: 12, Build: 14, Scale: 10 },
    bySocial: { "MCF Scholars": 12, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "M11", name: "Scaling Your Health Venture",
    topic: "Business Development", date: "2025-01-29", year: 2025, month: 1,
    attendees: 50, femaleAttendees: 22, studentAttendees: 30, completionRate: 92,
    venturesRepresented: 44, femaleLedVentures: 17,
    scores: { "Quality of Content": 4.6, "Usefulness": 4.7, "Accessibility": 4.3, "Relevance of Support": 4.5 },
    byAge: { "18-25": 20, "26-35": 21, "36-45": 7, "46+": 2 },
    byRegion: { "East Africa": 28, "West Africa": 12, "South Africa": 6, "North Africa": 2, Other: 2 },
    byStage: { Expose: 15, Build: 20, Scale: 15 },
    bySocial: { "MCF Scholars": 18, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M12", name: "Partnership & Collaboration Models",
    topic: "Operations", date: "2025-03-20", year: 2025, month: 3,
    attendees: 44, femaleAttendees: 19, studentAttendees: 27, completionRate: 88,
    venturesRepresented: 39, femaleLedVentures: 15,
    scores: { "Quality of Content": 4.3, "Usefulness": 4.2, "Accessibility": 4.0, "Relevance of Support": 4.1 },
    byAge: { "18-25": 17, "26-35": 19, "36-45": 6, "46+": 2 },
    byRegion: { "East Africa": 24, "West Africa": 11, "South Africa": 5, "North Africa": 2, Other: 2 },
    byStage: { Expose: 14, Build: 17, Scale: 13 },
    bySocial: { "MCF Scholars": 15, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M13", name: "Impact Measurement & MEL Frameworks",
    topic: "Operations", date: "2025-05-08", year: 2025, month: 5,
    attendees: 48, femaleAttendees: 21, studentAttendees: 29, completionRate: 90,
    venturesRepresented: 42, femaleLedVentures: 16,
    scores: { "Quality of Content": 4.4, "Usefulness": 4.3, "Accessibility": 4.1, "Relevance of Support": 4.5 },
    byAge: { "18-25": 19, "26-35": 20, "36-45": 7, "46+": 2 },
    byRegion: { "East Africa": 26, "West Africa": 12, "South Africa": 6, "North Africa": 2, Other: 2 },
    byStage: { Expose: 15, Build: 18, Scale: 15 },
    bySocial: { "MCF Scholars": 17, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M14", name: "AI & Technology Integration for Health",
    topic: "Technology", date: "2025-07-23", year: 2025, month: 7,
    attendees: 55, femaleAttendees: 24, studentAttendees: 33, completionRate: 91,
    venturesRepresented: 48, femaleLedVentures: 18,
    scores: { "Quality of Content": 4.8, "Usefulness": 4.7, "Accessibility": 4.2, "Relevance of Support": 4.6 },
    byAge: { "18-25": 22, "26-35": 23, "36-45": 7, "46+": 3 },
    byRegion: { "East Africa": 30, "West Africa": 14, "South Africa": 6, "North Africa": 3, Other: 2 },
    byStage: { Expose: 17, Build: 21, Scale: 17 },
    bySocial: { "MCF Scholars": 19, PWD: 4, "Refugee-Displaced": 2 },
  },
  {
    id: "M15", name: "Navigating Health Regulation in Africa",
    topic: "Health Innovation", date: "2025-09-17", year: 2025, month: 9,
    attendees: 46, femaleAttendees: 20, studentAttendees: 27, completionRate: 86,
    venturesRepresented: 41, femaleLedVentures: 15,
    scores: { "Quality of Content": 4.3, "Usefulness": 4.4, "Accessibility": 3.9, "Relevance of Support": 4.4 },
    byAge: { "18-25": 18, "26-35": 20, "36-45": 6, "46+": 2 },
    byRegion: { "East Africa": 25, "West Africa": 12, "South Africa": 5, "North Africa": 2, Other: 2 },
    byStage: { Expose: 14, Build: 18, Scale: 14 },
    bySocial: { "MCF Scholars": 16, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M16", name: "Investor Pitch & Storytelling for Impact",
    topic: "Finance & Funding", date: "2026-01-28", year: 2026, month: 1,
    attendees: 52, femaleAttendees: 23, studentAttendees: 31, completionRate: 94,
    venturesRepresented: 46, femaleLedVentures: 18,
    scores: { "Quality of Content": 4.8, "Usefulness": 4.9, "Accessibility": 4.4, "Relevance of Support": 4.7 },
    byAge: { "18-25": 21, "26-35": 22, "36-45": 7, "46+": 2 },
    byRegion: { "East Africa": 29, "West Africa": 13, "South Africa": 6, "North Africa": 2, Other: 2 },
    byStage: { Expose: 16, Build: 20, Scale: 16 },
    bySocial: { "MCF Scholars": 18, PWD: 4, "Refugee-Displaced": 2 },
  },
  {
    id: "M17", name: "Health Systems Strengthening for Entrepreneurs",
    topic: "Health Innovation", date: "2026-03-12", year: 2026, month: 3,
    attendees: 44, femaleAttendees: 19, studentAttendees: 26, completionRate: 87,
    venturesRepresented: 39, femaleLedVentures: 14,
    scores: { "Quality of Content": 4.3, "Usefulness": 4.2, "Accessibility": 4.0, "Relevance of Support": 4.3 },
    byAge: { "18-25": 17, "26-35": 19, "36-45": 6, "46+": 2 },
    byRegion: { "East Africa": 24, "West Africa": 11, "South Africa": 5, "North Africa": 2, Other: 2 },
    byStage: { Expose: 13, Build: 17, Scale: 14 },
    bySocial: { "MCF Scholars": 15, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "M18", name: "Alumni Mentorship & Ecosystem Building",
    topic: "Leadership", date: "2026-05-22", year: 2026, month: 5,
    attendees: 48, femaleAttendees: 21, studentAttendees: 28, completionRate: 89,
    venturesRepresented: 43, femaleLedVentures: 16,
    scores: { "Quality of Content": 4.4, "Usefulness": 4.3, "Accessibility": 4.2, "Relevance of Support": 4.4 },
    byAge: { "18-25": 19, "26-35": 21, "36-45": 6, "46+": 2 },
    byRegion: { "East Africa": 27, "West Africa": 12, "South Africa": 5, "North Africa": 2, Other: 2 },
    byStage: { Expose: 14, Build: 18, Scale: 16 },
    bySocial: { "MCF Scholars": 17, PWD: 3, "Refugee-Displaced": 2 },
  },
];
