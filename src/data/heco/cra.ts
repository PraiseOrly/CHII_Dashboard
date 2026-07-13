// CRA Programme — Centre for Research & Advancement
// The Centre advances its ecosystem mandate through THREE CORE PILLARS:
//   1. Public Sector Fellowship — upskilling healthcare executives with operational
//      funding, research training and guidance in academic publication.
//   2. Student Hackathons — supported by the Fellows through mentorship, to incubate
//      student ventures.
//   3. Public Health Research — accelerating context-specific research via structural
//      partnerships with regional health authorities.

export const CRA_PILLARS = [
  "Public Sector Fellowship",
  "Student Hackathons",
  "Public Health Research",
] as const;
export type CraPillar = typeof CRA_PILLARS[number];

// ─── PILLAR 1: Public Sector Fellowship ──────────────────────────────────────

/** The three things the fellowship provides, per the mandate. */
export const FELLOWSHIP_SUPPORTS = [
  "Operational Funding",
  "Research Training",
  "Publication Guidance",
] as const;
export type FellowshipSupport = typeof FELLOWSHIP_SUPPORTS[number];

export const EXEC_ROLES = [
  "Hospital Director",
  "Ministry Official",
  "District Health Officer",
  "Public Health Programme Lead",
  "Regulatory Officer",
] as const;
export type ExecRole = typeof EXEC_ROLES[number];

export type PublicationStage = "In Progress" | "Under Review" | "Published";

export interface Fellow {
  id: string;
  name: string;
  cohort: number;
  country: string;
  institution: string;
  role: ExecRole;
  gender: "Male" | "Female";
  /** Operational funding awarded, USD */
  funding: number;
  /** Research-training hours completed */
  trainingHours: number;
  /** Publication pipeline */
  publicationStage: PublicationStage;
  publications: number;
  /** Pillar 2 link: fellows mentor student hackathon teams */
  hackathonTeamsMentored: number;
  mentorshipHours: number;
  completed: boolean;
}

export const fellows: Fellow[] = [
  { id: "F01", name: "Dr. Amina Nkurunziza", cohort: 2023, country: "Rwanda",       institution: "King Faisal Hospital",        role: "Hospital Director",           gender: "Female", funding: 18000, trainingHours: 96,  publicationStage: "Published",    publications: 2, hackathonTeamsMentored: 3, mentorshipHours: 42, completed: true },
  { id: "F02", name: "Dr. Joseph Mwangi",     cohort: 2023, country: "Kenya",        institution: "Ministry of Health Kenya",    role: "Ministry Official",           gender: "Male",   funding: 16500, trainingHours: 88,  publicationStage: "Published",    publications: 1, hackathonTeamsMentored: 2, mentorshipHours: 30, completed: true },
  { id: "F03", name: "Dr. Grace Achieng",     cohort: 2023, country: "Kenya",        institution: "Kisumu County Health",        role: "District Health Officer",     gender: "Female", funding: 14000, trainingHours: 72,  publicationStage: "Under Review", publications: 0, hackathonTeamsMentored: 2, mentorshipHours: 24, completed: true },
  { id: "F04", name: "Dr. Samuel Osei",       cohort: 2023, country: "Ghana",        institution: "Ghana Health Service",        role: "Public Health Programme Lead",gender: "Male",   funding: 15000, trainingHours: 80,  publicationStage: "Published",    publications: 1, hackathonTeamsMentored: 1, mentorshipHours: 18, completed: true },
  { id: "F05", name: "Dr. Fatima Bello",      cohort: 2023, country: "Nigeria",      institution: "NAFDAC",                      role: "Regulatory Officer",          gender: "Female", funding: 13500, trainingHours: 64,  publicationStage: "In Progress",  publications: 0, hackathonTeamsMentored: 1, mentorshipHours: 12, completed: false },

  { id: "F06", name: "Dr. Peter Kamau",       cohort: 2024, country: "Kenya",        institution: "Kenyatta National Hospital",  role: "Hospital Director",           gender: "Male",   funding: 20000, trainingHours: 104, publicationStage: "Published",    publications: 2, hackathonTeamsMentored: 4, mentorshipHours: 56, completed: true },
  { id: "F07", name: "Dr. Claudine Uwase",    cohort: 2024, country: "Rwanda",       institution: "Rwanda Biomedical Centre",    role: "Public Health Programme Lead",gender: "Female", funding: 18500, trainingHours: 92,  publicationStage: "Published",    publications: 2, hackathonTeamsMentored: 3, mentorshipHours: 44, completed: true },
  { id: "F08", name: "Dr. Emmanuel Tetteh",   cohort: 2024, country: "Ghana",        institution: "Korle Bu Teaching Hospital",  role: "Hospital Director",           gender: "Male",   funding: 17000, trainingHours: 84,  publicationStage: "Under Review", publications: 1, hackathonTeamsMentored: 2, mentorshipHours: 32, completed: true },
  { id: "F09", name: "Dr. Naledi Molefe",     cohort: 2024, country: "South Africa", institution: "Gauteng Dept. of Health",     role: "Ministry Official",           gender: "Female", funding: 16000, trainingHours: 76,  publicationStage: "Under Review", publications: 0, hackathonTeamsMentored: 2, mentorshipHours: 26, completed: true },
  { id: "F10", name: "Dr. Ibrahim Sesay",     cohort: 2024, country: "Uganda",       institution: "Mulago Hospital",             role: "District Health Officer",     gender: "Male",   funding: 14500, trainingHours: 68,  publicationStage: "In Progress",  publications: 0, hackathonTeamsMentored: 1, mentorshipHours: 14, completed: false },
  { id: "F11", name: "Dr. Zainab Hassan",     cohort: 2024, country: "Tanzania",     institution: "Muhimbili National Hospital", role: "Public Health Programme Lead",gender: "Female", funding: 15500, trainingHours: 72,  publicationStage: "Published",    publications: 1, hackathonTeamsMentored: 2, mentorshipHours: 28, completed: true },

  { id: "F12", name: "Dr. Thomas Banda",      cohort: 2025, country: "Zambia",       institution: "Zambia Ministry of Health",   role: "Ministry Official",           gender: "Male",   funding: 22000, trainingHours: 112, publicationStage: "Published",    publications: 2, hackathonTeamsMentored: 4, mentorshipHours: 60, completed: true },
  { id: "F13", name: "Dr. Ruth Wanjiku",      cohort: 2025, country: "Kenya",        institution: "Pharmacy & Poisons Board",    role: "Regulatory Officer",          gender: "Female", funding: 19000, trainingHours: 96,  publicationStage: "Published",    publications: 1, hackathonTeamsMentored: 3, mentorshipHours: 48, completed: true },
  { id: "F14", name: "Dr. Eric Habimana",     cohort: 2025, country: "Rwanda",       institution: "Ministry of Health Rwanda",   role: "Ministry Official",           gender: "Male",   funding: 20500, trainingHours: 100, publicationStage: "Under Review", publications: 1, hackathonTeamsMentored: 3, mentorshipHours: 40, completed: true },
  { id: "F15", name: "Dr. Adaeze Okonkwo",    cohort: 2025, country: "Nigeria",      institution: "Lagos State Health Service",  role: "District Health Officer",     gender: "Female", funding: 17500, trainingHours: 88,  publicationStage: "Under Review", publications: 0, hackathonTeamsMentored: 2, mentorshipHours: 34, completed: true },
  { id: "F16", name: "Dr. Kwame Boateng",     cohort: 2025, country: "Ghana",        institution: "Ghana Health Service",        role: "Public Health Programme Lead",gender: "Male",   funding: 16500, trainingHours: 80,  publicationStage: "In Progress",  publications: 0, hackathonTeamsMentored: 2, mentorshipHours: 22, completed: false },

  { id: "F17", name: "Dr. Miriam Chirwa",     cohort: 2026, country: "Malawi",       institution: "Queen Elizabeth Hospital",    role: "Hospital Director",           gender: "Female", funding: 24000, trainingHours: 120, publicationStage: "Under Review", publications: 1, hackathonTeamsMentored: 4, mentorshipHours: 52, completed: false },
  { id: "F18", name: "Dr. Daniel Ochieng",    cohort: 2026, country: "Kenya",        institution: "Ministry of Health Kenya",    role: "Ministry Official",           gender: "Male",   funding: 23000, trainingHours: 116, publicationStage: "In Progress",  publications: 0, hackathonTeamsMentored: 3, mentorshipHours: 44, completed: false },
  { id: "F19", name: "Dr. Sofia Mensah",      cohort: 2026, country: "Ghana",        institution: "Ghana FDA",                   role: "Regulatory Officer",          gender: "Female", funding: 21500, trainingHours: 104, publicationStage: "In Progress",  publications: 0, hackathonTeamsMentored: 3, mentorshipHours: 38, completed: false },
  { id: "F20", name: "Dr. Patrick Nsubuga",   cohort: 2026, country: "Uganda",       institution: "Uganda Ministry of Health",   role: "Public Health Programme Lead",gender: "Male",   funding: 20000, trainingHours: 96,  publicationStage: "In Progress",  publications: 0, hackathonTeamsMentored: 2, mentorshipHours: 30, completed: false },
];

// ─── PILLAR 2: Student Hackathons (Fellow-mentored, venture-incubating) ──────

export interface CraHackathon {
  id: string;
  name: string;
  year: number;
  country: string;
  participants: number;
  femaleParticipants: number;
  teams: number;
  /** Fellows from Pillar 1 who mentored teams at this hackathon */
  fellowMentors: number;
  mentorshipHours: number;
  /** Ventures incubated out of the hackathon */
  venturesIncubated: number;
  venturesStillActive: number;
}

export const craHackathons: CraHackathon[] = [
  { id: "CH01", name: "CRA Health Systems Hackathon I",  year: 2023, country: "Rwanda", participants: 52,  femaleParticipants: 23, teams: 11, fellowMentors: 4, mentorshipHours: 68,  venturesIncubated: 3, venturesStillActive: 2 },
  { id: "CH02", name: "CRA Public Health Challenge",     year: 2024, country: "Kenya",  participants: 74,  femaleParticipants: 34, teams: 15, fellowMentors: 6, mentorshipHours: 112, venturesIncubated: 5, venturesStillActive: 4 },
  { id: "CH03", name: "CRA Digital Health Hackathon",    year: 2024, country: "Ghana",  participants: 61,  femaleParticipants: 27, teams: 13, fellowMentors: 5, mentorshipHours: 94,  venturesIncubated: 4, venturesStillActive: 3 },
  { id: "CH04", name: "CRA Health Equity Hackathon",     year: 2025, country: "Rwanda", participants: 88,  femaleParticipants: 42, teams: 18, fellowMentors: 8, mentorshipHours: 148, venturesIncubated: 6, venturesStillActive: 5 },
  { id: "CH05", name: "CRA Regional Systems Hackathon",  year: 2025, country: "Kenya",  participants: 95,  femaleParticipants: 47, teams: 20, fellowMentors: 9, mentorshipHours: 166, venturesIncubated: 7, venturesStillActive: 6 },
  { id: "CH06", name: "CRA Continental Hackathon",       year: 2026, country: "Kenya",  participants: 112, femaleParticipants: 56, teams: 23, fellowMentors: 11, mentorshipHours: 204, venturesIncubated: 8, venturesStillActive: 7 },
];

// ─── PILLAR 3: Public Health Research (regional-authority partnerships) ──────

export const RESEARCH_THEMES = [
  "Health Systems Strengthening",
  "Maternal & Child Health",
  "Infectious Disease",
  "Health Financing",
  "Digital Health & Data",
] as const;
export type ResearchTheme = typeof RESEARCH_THEMES[number];

export type PartnershipType = "Regional Health Authority" | "Ministry of Health" | "Research Institute" | "County / District Authority";

export interface ResearchPartnership {
  id: string;
  authority: string;
  type: PartnershipType;
  country: string;
  yearEstablished: number;
  theme: ResearchTheme;
  /** Studies run under the partnership */
  studies: number;
  publications: number;
  policyBriefs: number;
  /** Whether a formal data-sharing agreement is in place — the structural part */
  dataAgreement: boolean;
  /** Research that has been cited in, or adopted into, policy */
  policyAdoptions: number;
}

export const researchPartnerships: ResearchPartnership[] = [
  { id: "RP01", authority: "Rwanda Biomedical Centre",        type: "Regional Health Authority",    country: "Rwanda",       yearEstablished: 2023, theme: "Health Systems Strengthening", studies: 5, publications: 4, policyBriefs: 3, dataAgreement: true,  policyAdoptions: 2 },
  { id: "RP02", authority: "Ministry of Health Kenya",         type: "Ministry of Health",           country: "Kenya",        yearEstablished: 2023, theme: "Health Financing",             studies: 4, publications: 3, policyBriefs: 2, dataAgreement: true,  policyAdoptions: 2 },
  { id: "RP03", authority: "Ghana Health Service",             type: "Regional Health Authority",    country: "Ghana",        yearEstablished: 2023, theme: "Maternal & Child Health",      studies: 3, publications: 2, policyBriefs: 2, dataAgreement: true,  policyAdoptions: 1 },
  { id: "RP04", authority: "Kisumu County Health Dept.",       type: "County / District Authority",  country: "Kenya",        yearEstablished: 2024, theme: "Infectious Disease",           studies: 4, publications: 3, policyBriefs: 1, dataAgreement: true,  policyAdoptions: 1 },
  { id: "RP05", authority: "KEMRI",                            type: "Research Institute",           country: "Kenya",        yearEstablished: 2024, theme: "Infectious Disease",           studies: 6, publications: 5, policyBriefs: 2, dataAgreement: true,  policyAdoptions: 2 },
  { id: "RP06", authority: "Gauteng Dept. of Health",          type: "Regional Health Authority",    country: "South Africa", yearEstablished: 2024, theme: "Digital Health & Data",        studies: 3, publications: 2, policyBriefs: 1, dataAgreement: false, policyAdoptions: 0 },
  { id: "RP07", authority: "Uganda Ministry of Health",        type: "Ministry of Health",           country: "Uganda",       yearEstablished: 2025, theme: "Health Systems Strengthening", studies: 4, publications: 2, policyBriefs: 2, dataAgreement: true,  policyAdoptions: 1 },
  { id: "RP08", authority: "Muhimbili National Hospital",      type: "Research Institute",           country: "Tanzania",     yearEstablished: 2025, theme: "Maternal & Child Health",      studies: 3, publications: 2, policyBriefs: 1, dataAgreement: true,  policyAdoptions: 1 },
  { id: "RP09", authority: "Zambia Ministry of Health",        type: "Ministry of Health",           country: "Zambia",       yearEstablished: 2025, theme: "Health Financing",             studies: 3, publications: 1, policyBriefs: 2, dataAgreement: true,  policyAdoptions: 1 },
  { id: "RP10", authority: "Lagos State Health Service",       type: "County / District Authority",  country: "Nigeria",      yearEstablished: 2025, theme: "Digital Health & Data",        studies: 2, publications: 1, policyBriefs: 1, dataAgreement: false, policyAdoptions: 0 },
  { id: "RP11", authority: "Malawi Ministry of Health",        type: "Ministry of Health",           country: "Malawi",       yearEstablished: 2026, theme: "Health Systems Strengthening", studies: 2, publications: 0, policyBriefs: 1, dataAgreement: true,  policyAdoptions: 0 },
  { id: "RP12", authority: "Amref Health Africa",              type: "Research Institute",           country: "Kenya",        yearEstablished: 2026, theme: "Maternal & Child Health",      studies: 3, publications: 1, policyBriefs: 1, dataAgreement: true,  policyAdoptions: 0 },
];
