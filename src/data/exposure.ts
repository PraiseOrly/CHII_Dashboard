// Exposure & Networking Opportunities
// Platforms that connect founders with investors, partners, healthcare stakeholders,
// policy makers and peers through pitch events, conferences and ecosystem engagements.

export const EXPOSURE_TYPES = [
  "Pitch Event",
  "Conference",
  "Investor Roundtable",
  "Ecosystem Engagement",
  "Demo Day",
] as const;
export type ExposureType = typeof EXPOSURE_TYPES[number];

export const STAKEHOLDER_GROUPS = [
  "Investors",
  "Industry Partners",
  "Healthcare Stakeholders",
  "Policy Makers",
  "Peer Founders",
] as const;
export type StakeholderGroup = typeof STAKEHOLDER_GROUPS[number];

export interface ExposureEvent {
  id: string;
  name: string;
  year: number;
  type: ExposureType;
  country: string;
  city: string;
  /** Founders who attended */
  founders: number;
  femaleFounders: number;
  /** Ventures represented on stage / at booths */
  ventures: number;
  /** Stakeholders present, by group */
  stakeholders: Record<StakeholderGroup, number>;
  /** Relationship funnel */
  connections: number;      // introductions made
  followUps: number;        // follow-up meetings secured
  dealsInitiated: number;   // investment / partnership conversations opened
  mousSigned: number;       // formal agreements resulting
  /** Founder-rated value of the exposure, out of 5 */
  visibilityScore: number;
}

export const exposureEvents: ExposureEvent[] = [
  {
    id: "EX01", name: "Africa Health Innovation Pitch Night", year: 2022, type: "Pitch Event",
    country: "Rwanda", city: "Kigali",
    founders: 24, femaleFounders: 10, ventures: 12,
    stakeholders: { Investors: 9, "Industry Partners": 6, "Healthcare Stakeholders": 5, "Policy Makers": 2, "Peer Founders": 18 },
    connections: 64, followUps: 21, dealsInitiated: 6, mousSigned: 1, visibilityScore: 4.2,
  },
  {
    id: "EX02", name: "HealthTech Africa Summit", year: 2022, type: "Conference",
    country: "Kenya", city: "Nairobi",
    founders: 31, femaleFounders: 13, ventures: 16,
    stakeholders: { Investors: 14, "Industry Partners": 12, "Healthcare Stakeholders": 11, "Policy Makers": 5, "Peer Founders": 27 },
    connections: 98, followUps: 30, dealsInitiated: 9, mousSigned: 2, visibilityScore: 4.4,
  },
  {
    id: "EX03", name: "HENT Cohort Demo Day 2022", year: 2022, type: "Demo Day",
    country: "Rwanda", city: "Kigali",
    founders: 18, femaleFounders: 8, ventures: 18,
    stakeholders: { Investors: 11, "Industry Partners": 7, "Healthcare Stakeholders": 4, "Policy Makers": 3, "Peer Founders": 12 },
    connections: 57, followUps: 24, dealsInitiated: 8, mousSigned: 2, visibilityScore: 4.5,
  },
  {
    id: "EX04", name: "Ministry of Health Innovation Dialogue", year: 2023, type: "Ecosystem Engagement",
    country: "Rwanda", city: "Kigali",
    founders: 20, femaleFounders: 9, ventures: 14,
    stakeholders: { Investors: 3, "Industry Partners": 8, "Healthcare Stakeholders": 15, "Policy Makers": 12, "Peer Founders": 10 },
    connections: 71, followUps: 26, dealsInitiated: 5, mousSigned: 4, visibilityScore: 4.3,
  },
  {
    id: "EX05", name: "West Africa Investor Roundtable", year: 2023, type: "Investor Roundtable",
    country: "Ghana", city: "Accra",
    founders: 14, femaleFounders: 6, ventures: 9,
    stakeholders: { Investors: 18, "Industry Partners": 4, "Healthcare Stakeholders": 3, "Policy Makers": 1, "Peer Founders": 8 },
    connections: 52, followUps: 28, dealsInitiated: 12, mousSigned: 3, visibilityScore: 4.6,
  },
  {
    id: "EX06", name: "Africa Health ExCon", year: 2023, type: "Conference",
    country: "Nigeria", city: "Lagos",
    founders: 36, femaleFounders: 16, ventures: 21,
    stakeholders: { Investors: 16, "Industry Partners": 19, "Healthcare Stakeholders": 14, "Policy Makers": 6, "Peer Founders": 33 },
    connections: 124, followUps: 39, dealsInitiated: 11, mousSigned: 3, visibilityScore: 4.1,
  },
  {
    id: "EX07", name: "HENT Cohort Demo Day 2023", year: 2023, type: "Demo Day",
    country: "Rwanda", city: "Kigali",
    founders: 22, femaleFounders: 10, ventures: 20,
    stakeholders: { Investors: 13, "Industry Partners": 9, "Healthcare Stakeholders": 5, "Policy Makers": 3, "Peer Founders": 15 },
    connections: 68, followUps: 29, dealsInitiated: 10, mousSigned: 3, visibilityScore: 4.5,
  },
  {
    id: "EX08", name: "Global Health Startup Showcase", year: 2024, type: "Pitch Event",
    country: "South Africa", city: "Cape Town",
    founders: 27, femaleFounders: 12, ventures: 15,
    stakeholders: { Investors: 15, "Industry Partners": 10, "Healthcare Stakeholders": 7, "Policy Makers": 3, "Peer Founders": 21 },
    connections: 89, followUps: 34, dealsInitiated: 13, mousSigned: 4, visibilityScore: 4.4,
  },
  {
    id: "EX09", name: "East Africa Health Financing Forum", year: 2024, type: "Ecosystem Engagement",
    country: "Kenya", city: "Nairobi",
    founders: 25, femaleFounders: 11, ventures: 17,
    stakeholders: { Investors: 10, "Industry Partners": 13, "Healthcare Stakeholders": 18, "Policy Makers": 14, "Peer Founders": 16 },
    connections: 96, followUps: 33, dealsInitiated: 8, mousSigned: 5, visibilityScore: 4.2,
  },
  {
    id: "EX10", name: "Pan-African Investor Roundtable", year: 2024, type: "Investor Roundtable",
    country: "Rwanda", city: "Kigali",
    founders: 17, femaleFounders: 8, ventures: 11,
    stakeholders: { Investors: 22, "Industry Partners": 5, "Healthcare Stakeholders": 3, "Policy Makers": 2, "Peer Founders": 9 },
    connections: 63, followUps: 35, dealsInitiated: 16, mousSigned: 5, visibilityScore: 4.7,
  },
  {
    id: "EX11", name: "HENT Cohort Demo Day 2024", year: 2024, type: "Demo Day",
    country: "Rwanda", city: "Kigali",
    founders: 26, femaleFounders: 12, ventures: 20,
    stakeholders: { Investors: 17, "Industry Partners": 11, "Healthcare Stakeholders": 6, "Policy Makers": 4, "Peer Founders": 18 },
    connections: 82, followUps: 36, dealsInitiated: 13, mousSigned: 4, visibilityScore: 4.6,
  },
  {
    id: "EX12", name: "Africa Tech & Health Week", year: 2025, type: "Conference",
    country: "Kenya", city: "Nairobi",
    founders: 42, femaleFounders: 19, ventures: 24,
    stakeholders: { Investors: 21, "Industry Partners": 22, "Healthcare Stakeholders": 16, "Policy Makers": 8, "Peer Founders": 38 },
    connections: 148, followUps: 47, dealsInitiated: 15, mousSigned: 5, visibilityScore: 4.3,
  },
  {
    id: "EX13", name: "Diagnostics Innovation Pitch Day", year: 2025, type: "Pitch Event",
    country: "Ethiopia", city: "Addis Ababa",
    founders: 21, femaleFounders: 9, ventures: 13,
    stakeholders: { Investors: 12, "Industry Partners": 9, "Healthcare Stakeholders": 8, "Policy Makers": 4, "Peer Founders": 15 },
    connections: 74, followUps: 27, dealsInitiated: 9, mousSigned: 2, visibilityScore: 4.2,
  },
  {
    id: "EX14", name: "Regional Health Regulators Exchange", year: 2025, type: "Ecosystem Engagement",
    country: "Uganda", city: "Kampala",
    founders: 19, femaleFounders: 9, ventures: 12,
    stakeholders: { Investors: 4, "Industry Partners": 10, "Healthcare Stakeholders": 17, "Policy Makers": 16, "Peer Founders": 11 },
    connections: 78, followUps: 29, dealsInitiated: 6, mousSigned: 6, visibilityScore: 4.4,
  },
  {
    id: "EX15", name: "HENT Cohort Demo Day 2025", year: 2025, type: "Demo Day",
    country: "Rwanda", city: "Kigali",
    founders: 29, femaleFounders: 14, ventures: 20,
    stakeholders: { Investors: 19, "Industry Partners": 12, "Healthcare Stakeholders": 7, "Policy Makers": 4, "Peer Founders": 20 },
    connections: 91, followUps: 40, dealsInitiated: 15, mousSigned: 5, visibilityScore: 4.7,
  },
  {
    id: "EX16", name: "Continental Health Investment Summit", year: 2026, type: "Investor Roundtable",
    country: "Rwanda", city: "Kigali",
    founders: 23, femaleFounders: 11, ventures: 15,
    stakeholders: { Investors: 26, "Industry Partners": 8, "Healthcare Stakeholders": 5, "Policy Makers": 3, "Peer Founders": 12 },
    connections: 87, followUps: 44, dealsInitiated: 19, mousSigned: 7, visibilityScore: 4.8,
  },
  {
    id: "EX17", name: "Health Innovation Founders Assembly", year: 2026, type: "Conference",
    country: "Ghana", city: "Accra",
    founders: 34, femaleFounders: 16, ventures: 19,
    stakeholders: { Investors: 15, "Industry Partners": 17, "Healthcare Stakeholders": 12, "Policy Makers": 7, "Peer Founders": 30 },
    connections: 112, followUps: 38, dealsInitiated: 12, mousSigned: 4, visibilityScore: 4.4,
  },
  {
    id: "EX18", name: "HENT Cohort Demo Day 2026", year: 2026, type: "Demo Day",
    country: "Rwanda", city: "Kigali",
    founders: 25, femaleFounders: 12, ventures: 18,
    stakeholders: { Investors: 18, "Industry Partners": 11, "Healthcare Stakeholders": 6, "Policy Makers": 4, "Peer Founders": 17 },
    connections: 85, followUps: 37, dealsInitiated: 14, mousSigned: 5, visibilityScore: 4.6,
  },
];
