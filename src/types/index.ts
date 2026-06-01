export type Stage =
  | "Ideation"
  | "Validation"
  | "Prototype/MVP"
  | "Early Growth"
  | "Scaling"
  | "Investment/Funding";

export const STAGES: Stage[] = [
  "Ideation",
  "Validation",
  "Prototype/MVP",
  "Early Growth",
  "Scaling",
  "Investment/Funding",
];

export type Sector =
  | "Digital Health"
  | "Medical Devices"
  | "Diagnostics"
  | "Health Logistics"
  | "Pharma & Biotech"
  | "Mental Health"
  | "Maternal & Child Health"
  | "Health Financing"
  | "Community Health"
  | "Health Data & AI";

export const SECTORS: Sector[] = [
  "Digital Health",
  "Medical Devices",
  "Diagnostics",
  "Health Logistics",
  "Pharma & Biotech",
  "Mental Health",
  "Maternal & Child Health",
  "Health Financing",
  "Community Health",
  "Health Data & AI",
];

export type VentureStatus = "Active" | "Dormant" | "Stalled";

export type FundingStatus =
  | "Bootstrapped"
  | "Grant"
  | "Angel"
  | "VC"
  | "Revenue-Based"
  | "None";

export type TeamGender = "Male" | "Female" | "Mixed";

export const COUNTRIES = [
  "Nigeria",
  "Kenya",
  "Rwanda",
  "Ghana",
  "Ethiopia",
  "Uganda",
  "Tanzania",
  "South Africa",
  "Senegal",
  "Côte d'Ivoire",
  "Zimbabwe",
  "Zambia",
] as const;

export type Country = (typeof COUNTRIES)[number];

export type InterventionType =
  | "Hackathon"
  | "Masterclass"
  | "Fellowship"
  | "Mentorship Program"
  | "Funding Initiative"
  | "Innovation Challenge"
  | "Incubation"
  | "Acceleration"
  | "Field Study Trip"
  | "Research Intervention";

export const INTERVENTION_TYPES: InterventionType[] = [
  "Hackathon",
  "Masterclass",
  "Fellowship",
  "Mentorship Program",
  "Funding Initiative",
  "Innovation Challenge",
  "Incubation",
  "Acceleration",
  "Field Study Trip",
  "Research Intervention",
];

export interface StageHistoryEntry {
  stage: Stage;
  enteredOn: string;
  durationDays: number;
}

export interface Venture {
  id: number;
  name: string;
  cohort: number;
  sector: Sector;
  country: Country;
  teamGender: TeamGender;
  founders: number;
  stage: Stage;
  stageIndex: number;
  status: VentureStatus;
  stageHistory: StageHistoryEntry[];
  daysInCurrentStage: number;
  milestonesTotal: number;
  milestonesDone: number;
  milestoneRate: number;
  funding: number;
  fundingStatus: FundingStatus;
  jobs6m: number;
  jobsTotal: number;
  jobsWomen: number;
  mentorshipHrs: number;
  founderEngagement: number;
  partnerships: number;
  accelerator: boolean;
  revenue: number;
  healthScore: number;
  pSuccess: number;
  interventions: InterventionType[];
}

export interface VentureEvent {
  id: number;
  ventureId: number;
  ventureName: string;
  intervention: InterventionType;
  cohort: number;
  sector: Sector;
  country: Country;
  date: string;
  satisfaction: number;
  hours: number;
}

export type FrameworkLevel =
  | "Interventions"
  | "Immediate Outcomes"
  | "Intermediate Outcomes"
  | "Long Term Outcome";

export const FRAMEWORK_LEVELS: FrameworkLevel[] = [
  "Interventions",
  "Immediate Outcomes",
  "Intermediate Outcomes",
  "Long Term Outcome",
];

export interface FrameworkIndicator {
  id: number;
  level: FrameworkLevel;
  group: string;
  statement: string;
  code: string;
  indicator: string;
  dataSource: string;
  users: string;
  timing: string;
  gesi: boolean;
  flagged: boolean;
  reviewerNote: string;
}

export interface GlobalFilters {
  cohort: number | null;
  sector: Sector | null;
  country: Country | null;
  interventionType: InterventionType | null;
  fundingStatus: FundingStatus | null;
  stage: Stage | null;
}
