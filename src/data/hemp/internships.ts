export type InternshipOrganization = "CHII Internal" | "SFH" | "KASHA" | "Heza" | "RCR" | "mIndora Health";

export type InternshipDepartment =
  | "HEMP"
  | "HENT"
  | "HECO"
  | "Finance Hub"
  | "Data and Technology Hub"
  | "IT and Digital Health"
  | "Clinical and Service Delivery"
  | "Communication"
  | "Business Development"
  | "Health Enterprise Operations"
  | "One Health Research"
  | "Projects Coordination"
  | "Operations"
  | "Communications & Partnerships"
  | "Business Development & Finance"
  | "Software Engineering & UX Design"
  | "Monitoring, Evaluation and Digital Systems";

export interface Internship {
  id:                    string;
  year:                  number;
  organization:          InternshipOrganization;
  department:            InternshipDepartment;
  country:               string;
  durationWeeks:         number;
  students:              number;
  femaleStudents:        number;
  idpParticipants:       number;
  plwdParticipants:      number;
  employmentConversions: number;
  satisfactionScore:     number;
  studentFeedbackScore:  number;
  partnerFeedbackScore:  number;
  hasMentor:             boolean;

  /** Total placements after internship (employment outcomes captured post-internship). */
  placementsAfterInternship: number;

  /** Employer Feedback Metrics (from ALU Employer Feedback Form) */
  // Workplace Skills (5-point scale: 1=Never, 5=Consistently)
  asksClarifyingQuestions: number;
  communicatesProfessionally: number;
  meetsDeadlines: number;
  worksInTeams: number;

  // Health Sector Readiness (5-point scale: 1=Not at all, 5=Extremely)
  healthSystemsUnderstanding: number;
  appliesToHealthProblems: number;

  // Comparative Performance (5-point scale: 1=Strongly Disagree, 5=Strongly Agree)
  performanceBetterThanNonALU: number;

  // Likelihood to Recommend ALU students (0-10 scale)
  recommendationScore: number;

  // Likelihood to Hire ALU graduate (5-point scale: 1=Very Unlikely, 5=Very Likely)
  likelyToHire: number;

  /** Student/Intern Feedback Metrics (from ALU Intern Feedback Form) */
  // Internship Quality & Relevance (5-point scale: 1=Poor/Not relevant, 5=Excellent/Extremely relevant)
  relevanceToCareer: number;
  overallQuality: number;
  clarityOfRole: number;
  supportSupervision: number;

  // Learning & Growth (5-point scale: 1=Not at all, 5=Very great extent)
  skillApplicationToRealWorld: number;

  // NPS-style recommendation (0-10 scale)
  internRecommendationScore: number;

  // Completion status (percentage of interns who completed)
  completionRate: number;
}

export const INTERNSHIP_ORGANIZATIONS: InternshipOrganization[] = [
  "CHII Internal",
  "SFH",
  "KASHA",
  "Heza",
  "RCR",
  "mIndora Health",
];

export const INTERNSHIP_DEPARTMENTS: InternshipDepartment[] = [
  "HEMP",
  "HENT",
  "HECO",
  "Finance Hub",
  "Data and Technology Hub",
  "IT and Digital Health",
  "Clinical and Service Delivery",
  "Communication",
  "Business Development",
  "Health Enterprise Operations",
  "One Health Research",
  "Projects Coordination",
  "Operations",
  "Communications & Partnerships",
  "Business Development & Finance",
  "Software Engineering & UX Design",
  "Monitoring, Evaluation and Digital Systems",
];

export const internships: Internship[] = [
  { id:"i01", year:2021, organization:"SFH",           department:"Finance Hub",                       country:"Rwanda",       durationWeeks:8,  students:5, femaleStudents:3, idpParticipants:1, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.4, studentFeedbackScore:4.3, partnerFeedbackScore:4.2, hasMentor:true,  placementsAfterInternship:1, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i02", year:2021, organization:"CHII Internal", department:"HEMP",                              country:"Rwanda",       durationWeeks:10, students:6, femaleStudents:4, idpParticipants:0, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.6, studentFeedbackScore:4.5, partnerFeedbackScore:4.4, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:5, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:5, healthSystemsUnderstanding:4, appliesToHealthProblems:5, performanceBetterThanNonALU:5, recommendationScore:9, likelyToHire:5, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:9, completionRate:100 },
  { id:"i03", year:2021, organization:"RCR",          department:"One Health Research",                country:"Rwanda",       durationWeeks:8,  students:4, femaleStudents:2, idpParticipants:1, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.2, studentFeedbackScore:4.1, partnerFeedbackScore:4.0, hasMentor:false, placementsAfterInternship:1, asksClarifyingQuestions:4, communicatesProfessionally:3, meetsDeadlines:4, worksInTeams:3, healthSystemsUnderstanding:3, appliesToHealthProblems:3, performanceBetterThanNonALU:3, recommendationScore:7, likelyToHire:3, relevanceToCareer:3, overallQuality:3, clarityOfRole:3, supportSupervision:3, skillApplicationToRealWorld:3, internRecommendationScore:6, completionRate:75 },
  { id:"i04", year:2022, organization:"KASHA",        department:"Health Enterprise Operations",      country:"Kenya",        durationWeeks:12, students:7, femaleStudents:4, idpParticipants:1, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.5, studentFeedbackScore:4.4, partnerFeedbackScore:4.3, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i05", year:2022, organization:"CHII Internal", department:"HENT",                              country:"Rwanda",       durationWeeks:10, students:5, femaleStudents:3, idpParticipants:0, plwdParticipants:0, employmentConversions:2, satisfactionScore:4.7, studentFeedbackScore:4.6, partnerFeedbackScore:4.5, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:5, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:5, healthSystemsUnderstanding:5, appliesToHealthProblems:5, performanceBetterThanNonALU:5, recommendationScore:9, likelyToHire:5, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:9, completionRate:100 },
  { id:"i06", year:2022, organization:"SFH",           department:"Data and Technology Hub",           country:"Kenya",        durationWeeks:8,  students:6, femaleStudents:4, idpParticipants:1, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.4, studentFeedbackScore:4.3, partnerFeedbackScore:4.2, hasMentor:true,  placementsAfterInternship:1, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i07", year:2022, organization:"RCR",          department:"Projects Coordination",              country:"Kenya",        durationWeeks:8,  students:4, femaleStudents:2, idpParticipants:0, plwdParticipants:1, employmentConversions:0, satisfactionScore:4.0, studentFeedbackScore:3.9, partnerFeedbackScore:3.8, hasMentor:false, placementsAfterInternship:0, asksClarifyingQuestions:3, communicatesProfessionally:3, meetsDeadlines:3, worksInTeams:3, healthSystemsUnderstanding:3, appliesToHealthProblems:2, performanceBetterThanNonALU:2, recommendationScore:6, likelyToHire:2, relevanceToCareer:2, overallQuality:3, clarityOfRole:2, supportSupervision:2, skillApplicationToRealWorld:2, internRecommendationScore:5, completionRate:50 },
  { id:"i08", year:2022, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:12, students:3, femaleStudents:2, idpParticipants:0, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.6, studentFeedbackScore:4.5, partnerFeedbackScore:4.4, hasMentor:true,  placementsAfterInternship:1, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },

  { id:"i09", year:2023, organization:"CHII Internal", department:"HEMP",                              country:"Tanzania",     durationWeeks:10, students:6, femaleStudents:4, idpParticipants:1, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.3, studentFeedbackScore:4.2, partnerFeedbackScore:4.1, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:3, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:7, completionRate:100 },
  { id:"i10", year:2023, organization:"SFH",           department:"IT and Digital Health",             country:"Kenya",        durationWeeks:8,  students:5, femaleStudents:3, idpParticipants:1, plwdParticipants:0, employmentConversions:2, satisfactionScore:4.5, studentFeedbackScore:4.4, partnerFeedbackScore:4.3, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i11", year:2023, organization:"RCR",          department:"One Health Research",                country:"Rwanda",       durationWeeks:12, students:4, femaleStudents:3, idpParticipants:0, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.7, studentFeedbackScore:4.6, partnerFeedbackScore:4.5, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:5, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:5, performanceBetterThanNonALU:4, recommendationScore:9, likelyToHire:4, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:9, completionRate:100 },
  { id:"i12", year:2023, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:12, students:5, femaleStudents:3, idpParticipants:1, plwdParticipants:0, employmentConversions:3, satisfactionScore:4.8, studentFeedbackScore:4.7, partnerFeedbackScore:4.6, hasMentor:true,  placementsAfterInternship:3, asksClarifyingQuestions:5, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:5, healthSystemsUnderstanding:5, appliesToHealthProblems:5, performanceBetterThanNonALU:5, recommendationScore:10, likelyToHire:5, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:10, completionRate:100 },
  { id:"i13", year:2023, organization:"CHII Internal", department:"HECO",                              country:"Tanzania",     durationWeeks:8,  students:3, femaleStudents:1, idpParticipants:0, plwdParticipants:0, employmentConversions:0, satisfactionScore:3.9, studentFeedbackScore:3.8, partnerFeedbackScore:3.7, hasMentor:false, placementsAfterInternship:0, asksClarifyingQuestions:3, communicatesProfessionally:3, meetsDeadlines:3, worksInTeams:2, healthSystemsUnderstanding:2, appliesToHealthProblems:2, performanceBetterThanNonALU:2, recommendationScore:5, likelyToHire:2, relevanceToCareer:2, overallQuality:3, clarityOfRole:2, supportSupervision:2, skillApplicationToRealWorld:2, internRecommendationScore:4, completionRate:33 },
  { id:"i14", year:2023, organization:"SFH",           department:"Clinical and Service Delivery",     country:"Uganda",       durationWeeks:12, students:4, femaleStudents:3, idpParticipants:1, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.5, studentFeedbackScore:4.4, partnerFeedbackScore:4.3, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i15", year:2023, organization:"RCR",          department:"Operations",                         country:"Ghana",        durationWeeks:10, students:5, femaleStudents:3, idpParticipants:1, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.2, studentFeedbackScore:4.1, partnerFeedbackScore:4.0, hasMentor:false, placementsAfterInternship:1, asksClarifyingQuestions:4, communicatesProfessionally:3, meetsDeadlines:4, worksInTeams:3, healthSystemsUnderstanding:3, appliesToHealthProblems:3, performanceBetterThanNonALU:3, recommendationScore:7, likelyToHire:3, relevanceToCareer:3, overallQuality:3, clarityOfRole:3, supportSupervision:3, skillApplicationToRealWorld:3, internRecommendationScore:6, completionRate:80 },

  { id:"i16", year:2024, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:14, students:6, femaleStudents:4, idpParticipants:1, plwdParticipants:1, employmentConversions:3, satisfactionScore:4.8, studentFeedbackScore:4.7, partnerFeedbackScore:4.6, hasMentor:true,  placementsAfterInternship:3, asksClarifyingQuestions:5, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:5, healthSystemsUnderstanding:5, appliesToHealthProblems:5, performanceBetterThanNonALU:5, recommendationScore:10, likelyToHire:5, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:10, completionRate:100 },
  { id:"i17", year:2024, organization:"CHII Internal", department:"HENT",                              country:"Kenya",        durationWeeks:10, students:7, femaleStudents:4, idpParticipants:0, plwdParticipants:1, employmentConversions:3, satisfactionScore:4.6, studentFeedbackScore:4.5, partnerFeedbackScore:4.4, hasMentor:true,  placementsAfterInternship:3, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i18", year:2024, organization:"SFH",           department:"Communication",                     country:"Kenya",        durationWeeks:8,  students:5, femaleStudents:4, idpParticipants:1, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.4, studentFeedbackScore:4.3, partnerFeedbackScore:4.2, hasMentor:true,  placementsAfterInternship:1, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:3, appliesToHealthProblems:3, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i19", year:2024, organization:"RCR",          department:"One Health Research",                country:"Ethiopia",     durationWeeks:12, students:5, femaleStudents:3, idpParticipants:1, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.5, studentFeedbackScore:4.4, partnerFeedbackScore:4.3, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i20", year:2024, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:12, students:4, femaleStudents:3, idpParticipants:0, plwdParticipants:0, employmentConversions:2, satisfactionScore:4.7, studentFeedbackScore:4.6, partnerFeedbackScore:4.5, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:9, likelyToHire:4, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:9, completionRate:100 },
  { id:"i21", year:2024, organization:"CHII Internal", department:"HEMP",                              country:"Uganda",       durationWeeks:8,  students:4, femaleStudents:2, idpParticipants:1, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.1, studentFeedbackScore:4.0, partnerFeedbackScore:3.9, hasMentor:false, placementsAfterInternship:1, asksClarifyingQuestions:3, communicatesProfessionally:3, meetsDeadlines:4, worksInTeams:3, healthSystemsUnderstanding:3, appliesToHealthProblems:3, performanceBetterThanNonALU:3, recommendationScore:6, likelyToHire:3, relevanceToCareer:3, overallQuality:3, clarityOfRole:3, supportSupervision:3, skillApplicationToRealWorld:3, internRecommendationScore:6, completionRate:75 },
  { id:"i22", year:2024, organization:"SFH",           department:"Business Development",              country:"Rwanda",       durationWeeks:10, students:5, femaleStudents:3, idpParticipants:0, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.6, studentFeedbackScore:4.5, partnerFeedbackScore:4.4, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },

  { id:"i23", year:2025, organization:"RCR",          department:"One Health Research",                country:"Kenya",        durationWeeks:10, students:6, femaleStudents:4, idpParticipants:1, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.3, studentFeedbackScore:4.2, partnerFeedbackScore:4.1, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:3, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:7, completionRate:100 },
  { id:"i24", year:2025, organization:"SFH",           department:"Finance Hub",                        country:"Uganda",       durationWeeks:10, students:5, femaleStudents:3, idpParticipants:1, plwdParticipants:0, employmentConversions:2, satisfactionScore:4.5, studentFeedbackScore:4.4, partnerFeedbackScore:4.3, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i25", year:2025, organization:"KASHA",        department:"Health Enterprise Operations",      country:"Nigeria",      durationWeeks:12, students:6, femaleStudents:4, idpParticipants:0, plwdParticipants:1, employmentConversions:3, satisfactionScore:4.6, studentFeedbackScore:4.5, partnerFeedbackScore:4.4, hasMentor:true,  placementsAfterInternship:3, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i26", year:2025, organization:"CHII Internal", department:"HENT",                              country:"Rwanda",       durationWeeks:12, students:7, femaleStudents:4, idpParticipants:1, plwdParticipants:1, employmentConversions:4, satisfactionScore:4.8, studentFeedbackScore:4.7, partnerFeedbackScore:4.6, hasMentor:true,  placementsAfterInternship:4, asksClarifyingQuestions:5, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:5, healthSystemsUnderstanding:5, appliesToHealthProblems:5, performanceBetterThanNonALU:5, recommendationScore:10, likelyToHire:5, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:10, completionRate:100 },
  { id:"i27", year:2025, organization:"mIndora Health",department:"Software Engineering & UX Design",  country:"Ethiopia",     durationWeeks:8,  students:4, femaleStudents:2, idpParticipants:1, plwdParticipants:0, employmentConversions:1, satisfactionScore:4.2, studentFeedbackScore:4.1, partnerFeedbackScore:4.0, hasMentor:false, placementsAfterInternship:1, asksClarifyingQuestions:3, communicatesProfessionally:3, meetsDeadlines:3, worksInTeams:3, healthSystemsUnderstanding:3, appliesToHealthProblems:3, performanceBetterThanNonALU:2, recommendationScore:6, likelyToHire:3, relevanceToCareer:3, overallQuality:3, clarityOfRole:3, supportSupervision:3, skillApplicationToRealWorld:3, internRecommendationScore:6, completionRate:75 },
  { id:"i28", year:2025, organization:"CHII Internal", department:"HEMP",                              country:"Uganda",       durationWeeks:12, students:5, femaleStudents:3, idpParticipants:0, plwdParticipants:1, employmentConversions:3, satisfactionScore:4.7, studentFeedbackScore:4.6, partnerFeedbackScore:4.5, hasMentor:true,  placementsAfterInternship:3, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i29", year:2025, organization:"SFH",           department:"Data and Technology Hub",           country:"Nigeria",      durationWeeks:10, students:5, femaleStudents:3, idpParticipants:1, plwdParticipants:0, employmentConversions:2, satisfactionScore:4.4, studentFeedbackScore:4.3, partnerFeedbackScore:4.2, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },

  { id:"i30", year:2026, organization:"KASHA",        department:"Health Enterprise Operations",      country:"Rwanda",       durationWeeks:10, students:6, femaleStudents:4, idpParticipants:1, plwdParticipants:1, employmentConversions:2, satisfactionScore:4.5, studentFeedbackScore:4.4, partnerFeedbackScore:4.3, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i31", year:2026, organization:"RCR",          department:"Operations",                         country:"Ghana",        durationWeeks:10, students:5, femaleStudents:3, idpParticipants:0, plwdParticipants:0, employmentConversions:2, satisfactionScore:4.6, studentFeedbackScore:4.5, partnerFeedbackScore:4.4, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:4, meetsDeadlines:4, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:8, likelyToHire:4, relevanceToCareer:4, overallQuality:4, clarityOfRole:4, supportSupervision:4, skillApplicationToRealWorld:4, internRecommendationScore:8, completionRate:100 },
  { id:"i32", year:2026, organization:"CHII Internal", department:"HENT",                              country:"Kenya",        durationWeeks:12, students:4, femaleStudents:3, idpParticipants:1, plwdParticipants:0, employmentConversions:2, satisfactionScore:4.7, studentFeedbackScore:4.6, partnerFeedbackScore:4.5, hasMentor:true,  placementsAfterInternship:2, asksClarifyingQuestions:4, communicatesProfessionally:5, meetsDeadlines:5, worksInTeams:4, healthSystemsUnderstanding:4, appliesToHealthProblems:4, performanceBetterThanNonALU:4, recommendationScore:9, likelyToHire:4, relevanceToCareer:5, overallQuality:5, clarityOfRole:5, supportSupervision:5, skillApplicationToRealWorld:5, internRecommendationScore:9, completionRate:100 },
];

