// HealthX: Explore What's Next
// A multi-institutional career exposure platform / symposium. It combines
// PRE-EVENT CAREER READINESS SESSIONS with a HEALTH CAREERS EXHIBITION, connecting
// students directly with employers to generate INTERNSHIP, EMPLOYMENT and
// PROJECT-BASED leads, and to strengthen INSTITUTIONAL PARTNERSHIPS.

/** The three lead types the symposium exists to generate. */
export const LEAD_TYPES = ["Internship", "Employment", "Project-Based"] as const;
export type LeadType = typeof LEAD_TYPES[number];

/** Pre-event readiness sessions run ahead of the exhibition. */
export const READINESS_TOPICS = [
  "CV & Portfolio Clinic",
  "Interview Preparation",
  "Career Pathways in Health",
  "Networking & Personal Brand",
] as const;
export type ReadinessTopic = typeof READINESS_TOPICS[number];

/** Employer categories exhibiting at the careers fair. */
export const EMPLOYER_SECTORS = [
  "Hospitals & Clinics",
  "Health Startups",
  "Pharma & Manufacturing",
  "NGOs & Global Health",
  "Government & Regulators",
  "Research Institutes",
] as const;
export type EmployerSector = typeof EMPLOYER_SECTORS[number];

export interface HealthXSymposium {
  id: string;
  name: string;
  year: number;
  country: string;
  city: string;
  /** Multi-institutional: how many universities/colleges took part */
  institutions: number;
  studentsAttending: number;
  femaleStudents: number;
  /** Pre-event career readiness phase */
  readinessSessions: number;
  readinessAttendees: number;
  readinessCompletion: number; // % of registered students who completed readiness
  /** The exhibition itself */
  employersExhibiting: number;
  employersBySector: Record<EmployerSector, number>;
  /** Leads generated, by type — the core output of the platform */
  leads: Record<LeadType, number>;
  /** Leads that actually converted into a confirmed placement/hire/engagement */
  conversions: Record<LeadType, number>;
  /** Institutional partnerships strengthened or newly formed */
  partnershipsFormed: number;
  partnershipsRenewed: number;
  /** Student-rated usefulness of the symposium, out of 5 */
  usefulness: number;
}

export const healthXSymposia: HealthXSymposium[] = [
  {
    id: "HX01", name: "HealthX 2023 — Explore What's Next", year: 2023,
    country: "Rwanda", city: "Kigali",
    institutions: 3, studentsAttending: 180, femaleStudents: 92,
    readinessSessions: 4, readinessAttendees: 124, readinessCompletion: 69,
    employersExhibiting: 14,
    employersBySector: {
      "Hospitals & Clinics": 4, "Health Startups": 4, "Pharma & Manufacturing": 2,
      "NGOs & Global Health": 2, "Government & Regulators": 1, "Research Institutes": 1,
    },
    leads: { Internship: 46, Employment: 18, "Project-Based": 12 },
    conversions: { Internship: 21, Employment: 6, "Project-Based": 5 },
    partnershipsFormed: 5, partnershipsRenewed: 2,
    usefulness: 4.1,
  },
  {
    id: "HX02", name: "HealthX 2024 — Explore What's Next", year: 2024,
    country: "Rwanda", city: "Kigali",
    institutions: 5, studentsAttending: 265, femaleStudents: 139,
    readinessSessions: 6, readinessAttendees: 198, readinessCompletion: 75,
    employersExhibiting: 21,
    employersBySector: {
      "Hospitals & Clinics": 5, "Health Startups": 6, "Pharma & Manufacturing": 3,
      "NGOs & Global Health": 3, "Government & Regulators": 2, "Research Institutes": 2,
    },
    leads: { Internship: 72, Employment: 29, "Project-Based": 21 },
    conversions: { Internship: 35, Employment: 11, "Project-Based": 9 },
    partnershipsFormed: 7, partnershipsRenewed: 4,
    usefulness: 4.3,
  },
  {
    id: "HX03", name: "HealthX 2025 — Explore What's Next", year: 2025,
    country: "Rwanda", city: "Kigali",
    institutions: 7, studentsAttending: 340, femaleStudents: 181,
    readinessSessions: 8, readinessAttendees: 271, readinessCompletion: 80,
    employersExhibiting: 28,
    employersBySector: {
      "Hospitals & Clinics": 6, "Health Startups": 8, "Pharma & Manufacturing": 4,
      "NGOs & Global Health": 4, "Government & Regulators": 3, "Research Institutes": 3,
    },
    leads: { Internship: 98, Employment: 41, "Project-Based": 33 },
    conversions: { Internship: 49, Employment: 17, "Project-Based": 15 },
    partnershipsFormed: 9, partnershipsRenewed: 6,
    usefulness: 4.5,
  },
  {
    id: "HX04", name: "HealthX 2026 — Explore What's Next", year: 2026,
    country: "Kenya", city: "Nairobi",
    institutions: 9, studentsAttending: 412, femaleStudents: 223,
    readinessSessions: 10, readinessAttendees: 348, readinessCompletion: 84,
    employersExhibiting: 34,
    employersBySector: {
      "Hospitals & Clinics": 7, "Health Startups": 10, "Pharma & Manufacturing": 5,
      "NGOs & Global Health": 5, "Government & Regulators": 4, "Research Institutes": 3,
    },
    leads: { Internship: 124, Employment: 56, "Project-Based": 44 },
    conversions: { Internship: 64, Employment: 24, "Project-Based": 21 },
    partnershipsFormed: 11, partnershipsRenewed: 8,
    usefulness: 4.6,
  },
];

/** Attendance / completion of each pre-event readiness topic. */
export interface ReadinessSession {
  id: string;
  symposiumId: string;
  year: number;
  topic: ReadinessTopic;
  registered: number;
  attended: number;
  rating: number; // out of 5
}

export const readinessSessions: ReadinessSession[] = [
  { id: "R01", symposiumId: "HX01", year: 2023, topic: "CV & Portfolio Clinic",      registered: 44, attended: 34, rating: 4.2 },
  { id: "R02", symposiumId: "HX01", year: 2023, topic: "Interview Preparation",      registered: 41, attended: 31, rating: 4.0 },
  { id: "R03", symposiumId: "HX01", year: 2023, topic: "Career Pathways in Health",  registered: 48, attended: 35, rating: 4.3 },
  { id: "R04", symposiumId: "HX01", year: 2023, topic: "Networking & Personal Brand",registered: 38, attended: 24, rating: 3.8 },

  { id: "R05", symposiumId: "HX02", year: 2024, topic: "CV & Portfolio Clinic",      registered: 68, attended: 55, rating: 4.4 },
  { id: "R06", symposiumId: "HX02", year: 2024, topic: "Interview Preparation",      registered: 64, attended: 50, rating: 4.2 },
  { id: "R07", symposiumId: "HX02", year: 2024, topic: "Career Pathways in Health",  registered: 71, attended: 57, rating: 4.5 },
  { id: "R08", symposiumId: "HX02", year: 2024, topic: "Networking & Personal Brand",registered: 59, attended: 36, rating: 4.0 },

  { id: "R09", symposiumId: "HX03", year: 2025, topic: "CV & Portfolio Clinic",      registered: 92, attended: 76, rating: 4.5 },
  { id: "R10", symposiumId: "HX03", year: 2025, topic: "Interview Preparation",      registered: 88, attended: 71, rating: 4.4 },
  { id: "R11", symposiumId: "HX03", year: 2025, topic: "Career Pathways in Health",  registered: 96, attended: 79, rating: 4.6 },
  { id: "R12", symposiumId: "HX03", year: 2025, topic: "Networking & Personal Brand",registered: 79, attended: 45, rating: 4.1 },

  { id: "R13", symposiumId: "HX04", year: 2026, topic: "CV & Portfolio Clinic",      registered: 118, attended: 101, rating: 4.6 },
  { id: "R14", symposiumId: "HX04", year: 2026, topic: "Interview Preparation",      registered: 112, attended: 95,  rating: 4.5 },
  { id: "R15", symposiumId: "HX04", year: 2026, topic: "Career Pathways in Health",  registered: 124, attended: 106, rating: 4.7 },
  { id: "R16", symposiumId: "HX04", year: 2026, topic: "Networking & Personal Brand",registered: 101, attended: 46,  rating: 4.2 },
];
