export const MENTORSHIP_TYPES = [
  "One-on-One Mentorship", "Group Mentorship", "Peer Mentorship",
  "Advisory Program", "Fellowship", "One-Year Fellowship",
] as const;
export type MentorshipType = typeof MENTORSHIP_TYPES[number];

export const MF_CRITERIA = [
  "Quality of Support", "Usefulness",
  "Accessibility", "Relevance to Venture Growth",
] as const;
export type MFCriterion = typeof MF_CRITERIA[number];

export const MF_QUAL_AREAS = [
  "Program Content", "Delivery Approach", "Mentorship Quality",
  "Networking Opportunities", "Applicability to Ventures",
] as const;
export type MFQualArea = typeof MF_QUAL_AREAS[number];

export const MF_REGIONS = [
  "East Africa", "West Africa", "Southern Africa", "North Africa & Horn",
] as const;
export type MFRegion = typeof MF_REGIONS[number];

export interface MFTestimonial {
  author: string;
  role: string;
  venture?: string;
  quote: string;
}

export interface MentorshipProgram {
  id: string;
  name: string;
  type: MentorshipType;
  isFellowship: boolean;
  isOneYearFellowship: boolean;
  year: number;
  month: number;
  date: string;
  mentors: number;
  fellows: number;
  femaleFellows: number;
  studentFellows: number;
  graduateFellows: number;         // programme graduates enrolled as fellows
  venturesRepresented: number;
  femaleLedVentures: number;
  completionRate: number;          // 0-100
  highSatisfactionPct: number;     // % rating High or Very High overall
  scores: Record<MFCriterion, number>;
  qualScores: Record<MFQualArea, number>;
  byAge: Record<"18-25" | "26-35" | "36-45" | "46+", number>;
  byRegion: Record<MFRegion, number>;
  byStage: Record<"Expose" | "Build" | "Scale", number>;
  bySocial: Record<"MCF Scholars" | "PWD" | "Refugee-Displaced", number>;
  testimonial?: MFTestimonial;
}

export const mentorshipPrograms: MentorshipProgram[] = [

  // ── 2022 ─────────────────────────────────────────────────────────────────
  {
    id: "MP01", name: "CHII Venture Mentorship — Cohort 1",
    type: "One-on-One Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2022, month: 3, date: "2022-03-01",
    mentors: 8, fellows: 24, femaleFellows: 10, studentFellows: 14,
    graduateFellows: 10, venturesRepresented: 20, femaleLedVentures: 8,
    completionRate: 83, highSatisfactionPct: 71,
    scores: { "Quality of Support": 4.0, "Usefulness": 4.1, "Accessibility": 3.7, "Relevance to Venture Growth": 4.2 },
    qualScores: { "Program Content": 3.9, "Delivery Approach": 3.8, "Mentorship Quality": 4.1, "Networking Opportunities": 3.7, "Applicability to Ventures": 4.1 },
    byAge: { "18-25": 10, "26-35": 10, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 14, "West Africa": 6, "Southern Africa": 2, "North Africa & Horn": 2 },
    byStage: { Expose: 10, Build: 9, Scale: 5 },
    bySocial: { "MCF Scholars": 8, PWD: 1, "Refugee-Displaced": 0 },
  },
  {
    id: "MP02", name: "CHII Health Innovation Fellowship 2022",
    type: "Fellowship", isFellowship: true, isOneYearFellowship: false,
    year: 2022, month: 7, date: "2022-07-01",
    mentors: 6, fellows: 18, femaleFellows: 8, studentFellows: 9,
    graduateFellows: 12, venturesRepresented: 15, femaleLedVentures: 6,
    completionRate: 89, highSatisfactionPct: 78,
    scores: { "Quality of Support": 4.2, "Usefulness": 4.3, "Accessibility": 3.9, "Relevance to Venture Growth": 4.4 },
    qualScores: { "Program Content": 4.1, "Delivery Approach": 4.0, "Mentorship Quality": 4.3, "Networking Opportunities": 4.0, "Applicability to Ventures": 4.3 },
    byAge: { "18-25": 7, "26-35": 8, "36-45": 2, "46+": 1 },
    byRegion: { "East Africa": 10, "West Africa": 5, "Southern Africa": 2, "North Africa & Horn": 1 },
    byStage: { Expose: 7, Build: 7, Scale: 4 },
    bySocial: { "MCF Scholars": 7, PWD: 1, "Refugee-Displaced": 1 },
    testimonial: {
      author: "Amara Diallo", role: "Founder", venture: "HealthBridge Africa",
      quote: "The fellowship connected me with mentors who understood both the health sector and the realities of building a venture in West Africa. The guidance was practical, relevant, and transformative.",
    },
  },

  // ── 2023 ─────────────────────────────────────────────────────────────────
  {
    id: "MP03", name: "MCF Scholars Mentorship Track 2023",
    type: "Group Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2023, month: 2, date: "2023-02-01",
    mentors: 7, fellows: 21, femaleFellows: 10, studentFellows: 14,
    graduateFellows: 7, venturesRepresented: 18, femaleLedVentures: 8,
    completionRate: 85, highSatisfactionPct: 73,
    scores: { "Quality of Support": 4.1, "Usefulness": 4.2, "Accessibility": 4.0, "Relevance to Venture Growth": 4.1 },
    qualScores: { "Program Content": 4.0, "Delivery Approach": 3.9, "Mentorship Quality": 4.2, "Networking Opportunities": 3.9, "Applicability to Ventures": 4.1 },
    byAge: { "18-25": 9, "26-35": 9, "36-45": 2, "46+": 1 },
    byRegion: { "East Africa": 12, "West Africa": 6, "Southern Africa": 2, "North Africa & Horn": 1 },
    byStage: { Expose: 9, Build: 8, Scale: 4 },
    bySocial: { "MCF Scholars": 14, PWD: 1, "Refugee-Displaced": 1 },
  },
  {
    id: "MP04", name: "CHII Venture Mentorship — Cohort 2",
    type: "One-on-One Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2023, month: 5, date: "2023-05-01",
    mentors: 10, fellows: 30, femaleFellows: 13, studentFellows: 18,
    graduateFellows: 12, venturesRepresented: 26, femaleLedVentures: 10,
    completionRate: 87, highSatisfactionPct: 76,
    scores: { "Quality of Support": 4.3, "Usefulness": 4.4, "Accessibility": 3.8, "Relevance to Venture Growth": 4.5 },
    qualScores: { "Program Content": 4.2, "Delivery Approach": 4.1, "Mentorship Quality": 4.4, "Networking Opportunities": 4.0, "Applicability to Ventures": 4.4 },
    byAge: { "18-25": 13, "26-35": 12, "36-45": 4, "46+": 1 },
    byRegion: { "East Africa": 17, "West Africa": 8, "Southern Africa": 3, "North Africa & Horn": 2 },
    byStage: { Expose: 12, Build: 12, Scale: 6 },
    bySocial: { "MCF Scholars": 11, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "MP05", name: "Women in Health Tech Fellowship 2023",
    type: "Fellowship", isFellowship: true, isOneYearFellowship: false,
    year: 2023, month: 7, date: "2023-07-01",
    mentors: 8, fellows: 22, femaleFellows: 18, studentFellows: 12,
    graduateFellows: 14, venturesRepresented: 19, femaleLedVentures: 16,
    completionRate: 91, highSatisfactionPct: 83,
    scores: { "Quality of Support": 4.4, "Usefulness": 4.5, "Accessibility": 4.1, "Relevance to Venture Growth": 4.6 },
    qualScores: { "Program Content": 4.3, "Delivery Approach": 4.2, "Mentorship Quality": 4.5, "Networking Opportunities": 4.3, "Applicability to Ventures": 4.5 },
    byAge: { "18-25": 9, "26-35": 10, "36-45": 2, "46+": 1 },
    byRegion: { "East Africa": 12, "West Africa": 6, "Southern Africa": 3, "North Africa & Horn": 1 },
    byStage: { Expose: 8, Build: 9, Scale: 5 },
    bySocial: { "MCF Scholars": 9, PWD: 2, "Refugee-Displaced": 1 },
    testimonial: {
      author: "Fatima Kamara", role: "Co-Founder", venture: "MedConnect Sierra Leone",
      quote: "As a female founder in a male-dominated space, this fellowship gave me the confidence, connections, and competencies I needed. The mentors genuinely invested in our success.",
    },
  },
  {
    id: "MP06", name: "Leadership Accelerator Program 2023",
    type: "Advisory Program", isFellowship: false, isOneYearFellowship: false,
    year: 2023, month: 10, date: "2023-10-01",
    mentors: 5, fellows: 15, femaleFellows: 6, studentFellows: 8,
    graduateFellows: 9, venturesRepresented: 13, femaleLedVentures: 5,
    completionRate: 80, highSatisfactionPct: 69,
    scores: { "Quality of Support": 3.9, "Usefulness": 4.0, "Accessibility": 3.6, "Relevance to Venture Growth": 4.0 },
    qualScores: { "Program Content": 3.8, "Delivery Approach": 3.7, "Mentorship Quality": 4.0, "Networking Opportunities": 3.8, "Applicability to Ventures": 4.0 },
    byAge: { "18-25": 5, "26-35": 7, "36-45": 2, "46+": 1 },
    byRegion: { "East Africa": 8, "West Africa": 4, "Southern Africa": 2, "North Africa & Horn": 1 },
    byStage: { Expose: 5, Build: 6, Scale: 4 },
    bySocial: { "MCF Scholars": 6, PWD: 1, "Refugee-Displaced": 0 },
  },

  // ── 2024 ─────────────────────────────────────────────────────────────────
  {
    id: "MP07", name: "Digital Health Mentorship Network 2024",
    type: "Peer Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2024, month: 1, date: "2024-01-01",
    mentors: 12, fellows: 28, femaleFellows: 12, studentFellows: 16,
    graduateFellows: 12, venturesRepresented: 24, femaleLedVentures: 9,
    completionRate: 84, highSatisfactionPct: 74,
    scores: { "Quality of Support": 4.1, "Usefulness": 4.2, "Accessibility": 3.9, "Relevance to Venture Growth": 4.2 },
    qualScores: { "Program Content": 4.0, "Delivery Approach": 4.0, "Mentorship Quality": 4.1, "Networking Opportunities": 4.2, "Applicability to Ventures": 4.2 },
    byAge: { "18-25": 12, "26-35": 12, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 16, "West Africa": 7, "Southern Africa": 3, "North Africa & Horn": 2 },
    byStage: { Expose: 11, Build: 11, Scale: 6 },
    bySocial: { "MCF Scholars": 10, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "MP08", name: "CHII Venture Mentorship — Cohort 3",
    type: "One-on-One Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2024, month: 4, date: "2024-04-01",
    mentors: 12, fellows: 36, femaleFellows: 16, studentFellows: 20,
    graduateFellows: 16, venturesRepresented: 31, femaleLedVentures: 12,
    completionRate: 88, highSatisfactionPct: 79,
    scores: { "Quality of Support": 4.4, "Usefulness": 4.5, "Accessibility": 4.0, "Relevance to Venture Growth": 4.6 },
    qualScores: { "Program Content": 4.3, "Delivery Approach": 4.2, "Mentorship Quality": 4.5, "Networking Opportunities": 4.1, "Applicability to Ventures": 4.5 },
    byAge: { "18-25": 16, "26-35": 14, "36-45": 5, "46+": 1 },
    byRegion: { "East Africa": 20, "West Africa": 9, "Southern Africa": 4, "North Africa & Horn": 3 },
    byStage: { Expose: 14, Build: 14, Scale: 8 },
    bySocial: { "MCF Scholars": 13, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "MP09", name: "CHII One-Year Health Innovation Fellowship 2024",
    type: "One-Year Fellowship", isFellowship: true, isOneYearFellowship: true,
    year: 2024, month: 6, date: "2024-06-01",
    mentors: 10, fellows: 25, femaleFellows: 11, studentFellows: 10,
    graduateFellows: 22, venturesRepresented: 22, femaleLedVentures: 9,
    completionRate: 92, highSatisfactionPct: 85,
    scores: { "Quality of Support": 4.5, "Usefulness": 4.6, "Accessibility": 4.2, "Relevance to Venture Growth": 4.7 },
    qualScores: { "Program Content": 4.4, "Delivery Approach": 4.3, "Mentorship Quality": 4.6, "Networking Opportunities": 4.4, "Applicability to Ventures": 4.6 },
    byAge: { "18-25": 10, "26-35": 11, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 14, "West Africa": 6, "Southern Africa": 3, "North Africa & Horn": 2 },
    byStage: { Expose: 8, Build: 10, Scale: 7 },
    bySocial: { "MCF Scholars": 10, PWD: 2, "Refugee-Displaced": 2 },
    testimonial: {
      author: "Kofi Mensah", role: "CEO & Founder", venture: "DiaCare Ghana",
      quote: "The year-long fellowship gave me unparalleled depth of mentorship. Monthly advisory sessions, investor connections, and a cohort of driven health innovators accelerated our venture by 10x.",
    },
  },
  {
    id: "MP10", name: "Women in Health Leadership Fellowship 2024",
    type: "Fellowship", isFellowship: true, isOneYearFellowship: false,
    year: 2024, month: 9, date: "2024-09-01",
    mentors: 9, fellows: 26, femaleFellows: 22, studentFellows: 12,
    graduateFellows: 16, venturesRepresented: 23, femaleLedVentures: 20,
    completionRate: 92, highSatisfactionPct: 86,
    scores: { "Quality of Support": 4.5, "Usefulness": 4.6, "Accessibility": 4.2, "Relevance to Venture Growth": 4.7 },
    qualScores: { "Program Content": 4.4, "Delivery Approach": 4.3, "Mentorship Quality": 4.6, "Networking Opportunities": 4.4, "Applicability to Ventures": 4.6 },
    byAge: { "18-25": 11, "26-35": 11, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 14, "West Africa": 7, "Southern Africa": 3, "North Africa & Horn": 2 },
    byStage: { Expose: 9, Build: 11, Scale: 6 },
    bySocial: { "MCF Scholars": 10, PWD: 3, "Refugee-Displaced": 2 },
    testimonial: {
      author: "Nadia Hassan", role: "Founder", venture: "MamaHealth Ethiopia",
      quote: "This fellowship addressed the specific challenges female health innovators face — from building investor confidence to navigating regulation. Every session was invaluable.",
    },
  },

  // ── 2025 ─────────────────────────────────────────────────────────────────
  {
    id: "MP11", name: "MCF Scholars Mentorship Track 2025",
    type: "Group Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2025, month: 2, date: "2025-02-01",
    mentors: 9, fellows: 27, femaleFellows: 13, studentFellows: 18,
    graduateFellows: 9, venturesRepresented: 23, femaleLedVentures: 10,
    completionRate: 86, highSatisfactionPct: 77,
    scores: { "Quality of Support": 4.3, "Usefulness": 4.3, "Accessibility": 4.1, "Relevance to Venture Growth": 4.3 },
    qualScores: { "Program Content": 4.2, "Delivery Approach": 4.1, "Mentorship Quality": 4.4, "Networking Opportunities": 4.1, "Applicability to Ventures": 4.3 },
    byAge: { "18-25": 12, "26-35": 11, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 15, "West Africa": 7, "Southern Africa": 3, "North Africa & Horn": 2 },
    byStage: { Expose: 11, Build: 11, Scale: 5 },
    bySocial: { "MCF Scholars": 18, PWD: 2, "Refugee-Displaced": 1 },
  },
  {
    id: "MP12", name: "CHII Venture Mentorship — Cohort 4",
    type: "One-on-One Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2025, month: 4, date: "2025-04-01",
    mentors: 15, fellows: 45, femaleFellows: 20, studentFellows: 26,
    graduateFellows: 19, venturesRepresented: 39, femaleLedVentures: 15,
    completionRate: 90, highSatisfactionPct: 82,
    scores: { "Quality of Support": 4.5, "Usefulness": 4.6, "Accessibility": 4.1, "Relevance to Venture Growth": 4.7 },
    qualScores: { "Program Content": 4.4, "Delivery Approach": 4.3, "Mentorship Quality": 4.6, "Networking Opportunities": 4.2, "Applicability to Ventures": 4.6 },
    byAge: { "18-25": 20, "26-35": 18, "36-45": 6, "46+": 1 },
    byRegion: { "East Africa": 25, "West Africa": 11, "Southern Africa": 5, "North Africa & Horn": 4 },
    byStage: { Expose: 17, Build: 18, Scale: 10 },
    bySocial: { "MCF Scholars": 17, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "MP13", name: "CHII One-Year Health Innovation Fellowship 2025",
    type: "One-Year Fellowship", isFellowship: true, isOneYearFellowship: true,
    year: 2025, month: 6, date: "2025-06-01",
    mentors: 12, fellows: 30, femaleFellows: 14, studentFellows: 11,
    graduateFellows: 27, venturesRepresented: 27, femaleLedVentures: 11,
    completionRate: 93, highSatisfactionPct: 88,
    scores: { "Quality of Support": 4.6, "Usefulness": 4.7, "Accessibility": 4.3, "Relevance to Venture Growth": 4.8 },
    qualScores: { "Program Content": 4.5, "Delivery Approach": 4.4, "Mentorship Quality": 4.7, "Networking Opportunities": 4.5, "Applicability to Ventures": 4.7 },
    byAge: { "18-25": 13, "26-35": 13, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 17, "West Africa": 7, "Southern Africa": 4, "North Africa & Horn": 2 },
    byStage: { Expose: 9, Build: 12, Scale: 9 },
    bySocial: { "MCF Scholars": 12, PWD: 3, "Refugee-Displaced": 2 },
    testimonial: {
      author: "Blessing Okonkwo", role: "Founder & CEO", venture: "PharmaTrak Nigeria",
      quote: "Structured learning combined with one-on-one mentorship from seasoned health investors gave our venture the strategic clarity and credibility to raise our first round.",
    },
  },
  {
    id: "MP14", name: "Scale-Up Advisory Program 2025",
    type: "Advisory Program", isFellowship: false, isOneYearFellowship: false,
    year: 2025, month: 9, date: "2025-09-01",
    mentors: 8, fellows: 20, femaleFellows: 8, studentFellows: 6,
    graduateFellows: 14, venturesRepresented: 18, femaleLedVentures: 7,
    completionRate: 88, highSatisfactionPct: 80,
    scores: { "Quality of Support": 4.4, "Usefulness": 4.5, "Accessibility": 4.0, "Relevance to Venture Growth": 4.6 },
    qualScores: { "Program Content": 4.3, "Delivery Approach": 4.2, "Mentorship Quality": 4.4, "Networking Opportunities": 4.3, "Applicability to Ventures": 4.5 },
    byAge: { "18-25": 6, "26-35": 10, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 11, "West Africa": 5, "Southern Africa": 3, "North Africa & Horn": 1 },
    byStage: { Expose: 4, Build: 9, Scale: 7 },
    bySocial: { "MCF Scholars": 8, PWD: 2, "Refugee-Displaced": 1 },
  },

  // ── 2026 ─────────────────────────────────────────────────────────────────
  {
    id: "MP15", name: "CHII Venture Mentorship — Cohort 5",
    type: "One-on-One Mentorship", isFellowship: false, isOneYearFellowship: false,
    year: 2026, month: 1, date: "2026-01-01",
    mentors: 16, fellows: 48, femaleFellows: 21, studentFellows: 28,
    graduateFellows: 20, venturesRepresented: 42, femaleLedVentures: 16,
    completionRate: 91, highSatisfactionPct: 84,
    scores: { "Quality of Support": 4.5, "Usefulness": 4.6, "Accessibility": 4.2, "Relevance to Venture Growth": 4.7 },
    qualScores: { "Program Content": 4.4, "Delivery Approach": 4.3, "Mentorship Quality": 4.6, "Networking Opportunities": 4.3, "Applicability to Ventures": 4.6 },
    byAge: { "18-25": 21, "26-35": 20, "36-45": 6, "46+": 1 },
    byRegion: { "East Africa": 26, "West Africa": 12, "Southern Africa": 6, "North Africa & Horn": 4 },
    byStage: { Expose: 18, Build: 19, Scale: 11 },
    bySocial: { "MCF Scholars": 18, PWD: 4, "Refugee-Displaced": 2 },
  },
  {
    id: "MP16", name: "Women in Health Tech Fellowship 2026",
    type: "Fellowship", isFellowship: true, isOneYearFellowship: false,
    year: 2026, month: 2, date: "2026-02-01",
    mentors: 10, fellows: 30, femaleFellows: 25, studentFellows: 14,
    graduateFellows: 20, venturesRepresented: 27, femaleLedVentures: 24,
    completionRate: 94, highSatisfactionPct: 89,
    scores: { "Quality of Support": 4.6, "Usefulness": 4.7, "Accessibility": 4.3, "Relevance to Venture Growth": 4.8 },
    qualScores: { "Program Content": 4.5, "Delivery Approach": 4.4, "Mentorship Quality": 4.7, "Networking Opportunities": 4.5, "Applicability to Ventures": 4.7 },
    byAge: { "18-25": 13, "26-35": 13, "36-45": 3, "46+": 1 },
    byRegion: { "East Africa": 17, "West Africa": 8, "Southern Africa": 3, "North Africa & Horn": 2 },
    byStage: { Expose: 10, Build: 13, Scale: 7 },
    bySocial: { "MCF Scholars": 12, PWD: 3, "Refugee-Displaced": 2 },
  },
  {
    id: "MP17", name: "CHII One-Year Health Innovation Fellowship 2026",
    type: "One-Year Fellowship", isFellowship: true, isOneYearFellowship: true,
    year: 2026, month: 3, date: "2026-03-01",
    mentors: 14, fellows: 35, femaleFellows: 16, studentFellows: 12,
    graduateFellows: 32, venturesRepresented: 32, femaleLedVentures: 13,
    completionRate: 94, highSatisfactionPct: 91,
    scores: { "Quality of Support": 4.7, "Usefulness": 4.8, "Accessibility": 4.4, "Relevance to Venture Growth": 4.9 },
    qualScores: { "Program Content": 4.6, "Delivery Approach": 4.5, "Mentorship Quality": 4.8, "Networking Opportunities": 4.6, "Applicability to Ventures": 4.8 },
    byAge: { "18-25": 15, "26-35": 15, "36-45": 4, "46+": 1 },
    byRegion: { "East Africa": 19, "West Africa": 9, "Southern Africa": 5, "North Africa & Horn": 2 },
    byStage: { Expose: 10, Build: 14, Scale: 11 },
    bySocial: { "MCF Scholars": 14, PWD: 4, "Refugee-Displaced": 3 },
  },
  {
    id: "MP18", name: "Digital Health Innovation Fellowship 2026",
    type: "Fellowship", isFellowship: true, isOneYearFellowship: false,
    year: 2026, month: 5, date: "2026-05-01",
    mentors: 11, fellows: 32, femaleFellows: 14, studentFellows: 15,
    graduateFellows: 22, venturesRepresented: 29, femaleLedVentures: 11,
    completionRate: 91, highSatisfactionPct: 86,
    scores: { "Quality of Support": 4.5, "Usefulness": 4.6, "Accessibility": 4.2, "Relevance to Venture Growth": 4.7 },
    qualScores: { "Program Content": 4.4, "Delivery Approach": 4.3, "Mentorship Quality": 4.5, "Networking Opportunities": 4.4, "Applicability to Ventures": 4.6 },
    byAge: { "18-25": 14, "26-35": 13, "36-45": 4, "46+": 1 },
    byRegion: { "East Africa": 18, "West Africa": 8, "Southern Africa": 4, "North Africa & Horn": 2 },
    byStage: { Expose: 10, Build: 13, Scale: 9 },
    bySocial: { "MCF Scholars": 13, PWD: 3, "Refugee-Displaced": 2 },
    testimonial: {
      author: "Samuel Kariuki", role: "CTO & Co-Founder", venture: "LabConnect Kenya",
      quote: "The digital health fellowship exposed us to regulatory frameworks and health data standards we had overlooked. Our entire product roadmap was transformed by the mentorship we received.",
    },
  },
];
