import type {
  Venture,
  Stage,
  Sector,
  Country,
  FundingStatus,
  TeamGender,
  InterventionType,
  StageHistoryEntry,
} from "@/types";

const VENTURE_NAMES = [
  // Cohort 2022 – 18 ventures (indices 0–17)
  "HealthLink Africa", "MediTrack Kenya", "RwandaCare Solutions", "DiagnosAI",
  "MamaHealth Nigeria", "SafiraMed", "BioTrace Rwanda", "CommuniHealth Ghana",
  "NeuroPulse", "PharmaFlow Africa", "LifeSync Ethiopia", "CareChain Uganda",
  "MedConnect Tanzania", "AfriHealth Hub", "WellnessPath", "TeleMed Africa",
  "BioScan Labs", "DrugNet Kenya",
  // Cohort 2023 – 20 ventures (18–37)
  "HealthVault", "ClinPath Ghana", "NutriCare Africa", "MalariaTech",
  "TBSolutions Nigeria", "HIV360 Kenya", "VaccineTrack", "MobileMed Ghana",
  "HealthData AI", "CareAI Rwanda", "MedLogix", "BioPulse Africa",
  "SafeDeliv Kenya", "MamaCare Ethiopia", "NeonatalTech", "BirthLink Nigeria",
  "PostNatal Care", "MentalSpace", "MindBridge Africa", "WellMind Kenya",
  // Cohort 2024 – 20 ventures (38–57)
  "CalmHealth Ghana", "NeuroCare Africa", "FinHealth", "MicroInsure Kenya",
  "HealthSave Ethiopia", "MedCredit", "WellFund Africa", "CommHealth",
  "VillageDoc Kenya", "RuralMed Rwanda", "CHEWConnect", "HealthWorker Plus",
  "DataHealth AI", "HealthAnalytics", "ClinicalAI Kenya", "PatientPath",
  "EHRConnect", "DrugTrack Nigeria", "PharmaSafe", "MedSupply Chain",
  // Cohort 2025 – 20 ventures (58–77)
  "DrugChain Africa", "PharmConnect Kenya", "DiagLab Rwanda", "PointCare",
  "RapidTest Africa", "MobiLab Ghana", "AfriDiag", "ColdChain Kenya",
  "VaccineLog", "MedShip Africa", "HealthLog Ethiopia", "LastMile Med",
  "GenomicsAI Africa", "BioResearch Kenya", "ClinTrial Connect", "MolecuPath",
  "DNAHealth Africa", "TeenHealth Kenya", "YouthCare Ghana", "AdolescentMed",
  // Cohort 2026 – 18 ventures (78–95)
  "SchoolHealth Rwanda", "SportsMed Africa", "AgriHealth Kenya", "FarmerCare",
  "RuralNutrition", "OcularCare Kenya", "DentalLink Africa", "HearingPath",
  "SkinHealth Kenya", "OrthoTech Africa", "EmergencyLink", "AmbulanceAI Kenya",
  "TraumaCare Nigeria", "ChronicCare", "DiabetesTech Africa", "HyperPath Kenya",
  "CancerLink Africa", "ImmunoPath",
];

const SECTORS: Sector[] = [
  "Digital Health", "Medical Devices", "Diagnostics", "Health Logistics",
  "Pharma & Biotech", "Mental Health", "Maternal & Child Health",
  "Health Financing", "Community Health", "Health Data & AI",
];

const COUNTRIES: Country[] = [
  "Nigeria", "Kenya", "Rwanda", "Ghana", "Ethiopia", "Uganda",
  "Tanzania", "South Africa", "Senegal", "Côte d'Ivoire", "Zimbabwe", "Zambia",
];

const STAGES: Stage[] = [
  "Ideation", "Validation", "Prototype/MVP", "Early Growth", "Scaling", "Investment/Funding",
];

const FUNDING_STATUSES: FundingStatus[] = [
  "Bootstrapped", "Grant", "Angel", "VC", "Revenue-Based", "None",
];

const GENDERS: TeamGender[] = ["Male", "Female", "Mixed"];

const INTERVENTIONS: InterventionType[] = [
  "Hackathon", "Masterclass", "Fellowship", "Mentorship Program",
  "Funding Initiative", "Innovation Challenge", "Incubation",
  "Acceleration", "Field Study Trip", "Research Intervention",
];

/** Seeded deterministic value in [min, max] */
function d(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  const r = x - Math.floor(x);
  return Math.round(r * (max - min) + min);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[d(seed, 0, arr.length - 1)];
}

function cohortOf(i: number): number {
  if (i < 18) return 2022;
  if (i < 38) return 2023;
  if (i < 58) return 2024;
  if (i < 78) return 2025;
  return 2026;
}

function stageForVenture(i: number, cohort: number): { stage: Stage; stageIndex: number } {
  // Older cohorts are further along; add some variance
  const base = cohort - 2022; // 0–4
  const variance = d(i * 7 + 3, -1, 2);
  const si = Math.max(0, Math.min(5, base + variance));
  return { stage: STAGES[si], stageIndex: si };
}

function buildStageHistory(i: number, stageIndex: number, cohort: number): StageHistoryEntry[] {
  const history: StageHistoryEntry[] = [];
  let year = cohort;
  let month = d(i, 1, 6);
  let day = d(i + 99, 1, 28);

  for (let s = 0; s < stageIndex; s++) {
    const dur = d(i * 13 + s * 7, 60, 240);
    history.push({
      stage: STAGES[s],
      enteredOn: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      durationDays: dur,
    });
    const totalDays = dur;
    const addMonths = Math.floor(totalDays / 30);
    month += addMonths;
    while (month > 12) { month -= 12; year++; }
  }
  return history;
}

function computeHealth(
  founderEngagement: number,
  milestoneRate: number,
  stageIndex: number,
  mentorshipHrs: number,
  funding: number,
): number {
  const s = Math.round(
    founderEngagement * 0.25 +
    milestoneRate * 0.25 +
    (stageIndex / 5) * 100 * 0.20 +
    Math.min(mentorshipHrs / 200, 1) * 100 * 0.15 +
    Math.min(funding / 500, 1) * 100 * 0.15,
  );
  return Math.max(5, Math.min(100, s));
}

function computePSuccess(
  healthScore: number,
  stageIndex: number,
  founderEngagement: number,
  partnerships: number,
): number {
  const s = Math.round(
    healthScore * 0.40 +
    (stageIndex / 5) * 100 * 0.25 +
    founderEngagement * 0.20 +
    Math.min(partnerships / 10, 1) * 100 * 0.15,
  );
  return Math.max(5, Math.min(98, s));
}

function pickInterventions(i: number, cohort: number): InterventionType[] {
  const count = Math.min(d(i * 11, 2, 6), INTERVENTIONS.length);
  const pool = [...INTERVENTIONS];
  const result: InterventionType[] = [];
  for (let k = 0; k < count; k++) {
    const idx = d(i * 17 + k * 5 + cohort, 0, pool.length - 1);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

function buildVenture(i: number): Venture {
  const cohort = cohortOf(i);
  const { stage, stageIndex } = stageForVenture(i, cohort);
  const sector = SECTORS[d(i * 3 + 1, 0, SECTORS.length - 1)];
  const country = COUNTRIES[d(i * 5 + 2, 0, COUNTRIES.length - 1)];
  const teamGender = pick(GENDERS, i * 7 + 3);
  const founders = d(i * 11, 1, 4);
  const stageHistory = buildStageHistory(i, stageIndex, cohort);
  const daysInCurrentStage = d(i * 13, 15, 300);
  const milestonesTotal = d(i * 17, 5, 20);
  const milestonesDone = Math.min(milestonesTotal, d(i * 19, 0, milestonesTotal));
  const milestoneRate = Math.round((milestonesDone / milestonesTotal) * 100);
  const funding = stageIndex >= 3 ? d(i * 23, 50, 2000) : d(i * 23, 0, 200);
  const fundingStatus = FUNDING_STATUSES[d(i * 29, 0, FUNDING_STATUSES.length - 1)];
  const jobs6m = d(i * 31, 0, 12);
  const jobsTotal = jobs6m + d(i * 37, 0, 30);
  const jobsWomen = Math.min(jobsTotal, d(i * 41, 0, jobsTotal));
  const mentorshipHrs = d(i * 43, 20, 350);
  const founderEngagement = d(i * 47, 35, 98);
  const partnerships = d(i * 53, 0, 12);
  const accelerator = d(i * 59, 0, 3) === 0;
  const revenue = stageIndex >= 3 ? d(i * 61, 5, 150) : d(i * 61, 0, 30);
  const healthScore = computeHealth(founderEngagement, milestoneRate, stageIndex, mentorshipHrs, funding);
  const pSuccess = computePSuccess(healthScore, stageIndex, founderEngagement, partnerships);

  const statusRoll = d(i * 67, 0, 9);
  const status = statusRoll <= 6 ? "Active" : statusRoll <= 8 ? "Dormant" : "Stalled";

  return {
    id: i + 1,
    name: VENTURE_NAMES[i],
    cohort,
    sector,
    country,
    teamGender,
    founders,
    stage,
    stageIndex,
    status,
    stageHistory,
    daysInCurrentStage,
    milestonesTotal,
    milestonesDone,
    milestoneRate,
    funding,
    fundingStatus,
    jobs6m,
    jobsTotal,
    jobsWomen,
    mentorshipHrs,
    founderEngagement,
    partnerships,
    accelerator,
    revenue,
    healthScore,
    pSuccess,
    interventions: pickInterventions(i, cohort),
  };
}

export const ventures: Venture[] = Array.from({ length: 96 }, (_, i) => buildVenture(i));
