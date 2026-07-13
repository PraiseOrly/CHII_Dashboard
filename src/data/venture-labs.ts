export interface LabVenture {
  id: string;
  name: string;
  sector: string;
  stage: string;
  score: number;
  mcfStatus: boolean;
  academicIssue: boolean;
  disciplinaryIssue: boolean;
  financialIssue: boolean;
  flagged: boolean;
}

export const labVentures: LabVenture[] = [
  { id: "L01", name: "MediConnect Rwanda",    sector: "Digital Health",  stage: "Scale",  score: 91, mcfStatus: true,  academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L02", name: "ImmuneCare Uganda",      sector: "Vaccines",        stage: "Scale",  score: 88, mcfStatus: true,  academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L03", name: "MedDevice Kenya",        sector: "MedTech",         stage: "Scale",  score: 85, mcfStatus: true,  academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L04", name: "SafeBirth Solutions",    sector: "Maternal Health", stage: "Build",  score: 84, mcfStatus: false, academicIssue: true,  disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L05", name: "MentalSpace Rwanda",     sector: "Mental Health",   stage: "Build",  score: 81, mcfStatus: true,  academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L06", name: "CleanWater AI",          sector: "WASH",            stage: "Build",  score: 79, mcfStatus: true,  academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L07", name: "PharmTrack Africa",      sector: "Pharmaceuticals", stage: "Build",  score: 76, mcfStatus: false, academicIssue: false, disciplinaryIssue: false, financialIssue: true,  flagged: false },
  { id: "L08", name: "DiabetesCare Senegal",   sector: "NCD Management",  stage: "Build",  score: 73, mcfStatus: true,  academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L09", name: "NutriSense Uganda",      sector: "Nutrition",       stage: "Expose", score: 72, mcfStatus: true,  academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L10", name: "PharmaLink Zambia",      sector: "Pharmaceuticals", stage: "Build",  score: 69, mcfStatus: false, academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L11", name: "HealthBridge Nigeria",   sector: "Digital Health",  stage: "Build",  score: 68, mcfStatus: false, academicIssue: false, disciplinaryIssue: true,  financialIssue: false, flagged: false },
  { id: "L12", name: "TeleDoc Ghana",          sector: "Digital Health",  stage: "Build",  score: 65, mcfStatus: false, academicIssue: true,  disciplinaryIssue: false,  financialIssue: true,  flagged: true  },
  { id: "L13", name: "BioScan Cameroon",       sector: "MedTech",         stage: "Expose", score: 62, mcfStatus: false, academicIssue: true,  disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L14", name: "VaxChain Ethiopia",      sector: "Vaccines",        stage: "Expose", score: 58, mcfStatus: false, academicIssue: false, disciplinaryIssue: false, financialIssue: false, flagged: false },
  { id: "L15", name: "AgriNutrition Tanzania", sector: "Nutrition",       stage: "Expose", score: 55, mcfStatus: false, academicIssue: false, disciplinaryIssue: true,  financialIssue: false, flagged: true  },
];
