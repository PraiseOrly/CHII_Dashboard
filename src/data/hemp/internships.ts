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
  employmentConversions: number;
  satisfactionScore:     number;
  hasMentor:             boolean;

  /** Total placements after internship (employment outcomes captured post-internship). */
  placementsAfterInternship: number;
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
  { id:"i01", year:2021, organization:"SFH",           department:"Finance Hub",                       country:"Rwanda",       durationWeeks:8,  students:5, femaleStudents:3, employmentConversions:1, satisfactionScore:4.4, hasMentor:true,  placementsAfterInternship:1 },
  { id:"i02", year:2021, organization:"CHII Internal", department:"HEMP",                              country:"Rwanda",       durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.6, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i03", year:2021, organization:"RCR",          department:"One Health Research",                country:"Rwanda",       durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:1, satisfactionScore:4.2, hasMentor:false, placementsAfterInternship:1 },
  { id:"i04", year:2022, organization:"KASHA",        department:"Health Enterprise Operations",      country:"Kenya",        durationWeeks:12, students:7, femaleStudents:4, employmentConversions:2, satisfactionScore:4.5, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i05", year:2022, organization:"CHII Internal", department:"HENT",                              country:"Rwanda",       durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i06", year:2022, organization:"SFH",           department:"Data and Technology Hub",           country:"Kenya",        durationWeeks:8,  students:6, femaleStudents:4, employmentConversions:1, satisfactionScore:4.4, hasMentor:true,  placementsAfterInternship:1 },
  { id:"i07", year:2022, organization:"RCR",          department:"Projects Coordination",              country:"Kenya",        durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:0, satisfactionScore:4.0, hasMentor:false, placementsAfterInternship:0 },
  { id:"i08", year:2022, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:12, students:3, femaleStudents:2, employmentConversions:1, satisfactionScore:4.6, hasMentor:true,  placementsAfterInternship:1 },

  { id:"i09", year:2023, organization:"CHII Internal", department:"HEMP",                              country:"Tanzania",     durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.3, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i10", year:2023, organization:"SFH",           department:"IT and Digital Health",             country:"Kenya",        durationWeeks:8,  students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i11", year:2023, organization:"RCR",          department:"One Health Research",                country:"Rwanda",       durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i12", year:2023, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:12, students:5, femaleStudents:3, employmentConversions:3, satisfactionScore:4.8, hasMentor:true,  placementsAfterInternship:3 },
  { id:"i13", year:2023, organization:"CHII Internal", department:"HECO",                              country:"Tanzania",     durationWeeks:8,  students:3, femaleStudents:1, employmentConversions:0, satisfactionScore:3.9, hasMentor:false, placementsAfterInternship:0 },
  { id:"i14", year:2023, organization:"SFH",           department:"Clinical and Service Delivery",     country:"Uganda",       durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i15", year:2023, organization:"RCR",          department:"Operations",                         country:"Ghana",        durationWeeks:10, students:5, femaleStudents:3, employmentConversions:1, satisfactionScore:4.2, hasMentor:false, placementsAfterInternship:1 },

  { id:"i16", year:2024, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:14, students:6, femaleStudents:4, employmentConversions:3, satisfactionScore:4.8, hasMentor:true,  placementsAfterInternship:3 },
  { id:"i17", year:2024, organization:"CHII Internal", department:"HENT",                              country:"Kenya",        durationWeeks:10, students:7, femaleStudents:4, employmentConversions:3, satisfactionScore:4.6, hasMentor:true,  placementsAfterInternship:3 },
  { id:"i18", year:2024, organization:"SFH",           department:"Communication",                     country:"Kenya",        durationWeeks:8,  students:5, femaleStudents:4, employmentConversions:1, satisfactionScore:4.4, hasMentor:true,  placementsAfterInternship:1 },
  { id:"i19", year:2024, organization:"RCR",          department:"One Health Research",                country:"Ethiopia",     durationWeeks:12, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i20", year:2024, organization:"KASHA",        department:"Health Enterprise Operations",      country:"South Africa", durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i21", year:2024, organization:"CHII Internal", department:"HEMP",                              country:"Uganda",       durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:1, satisfactionScore:4.1, hasMentor:false, placementsAfterInternship:1 },
  { id:"i22", year:2024, organization:"SFH",           department:"Business Development",              country:"Rwanda",       durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.6, hasMentor:true,  placementsAfterInternship:2 },

  { id:"i23", year:2025, organization:"RCR",          department:"One Health Research",                country:"Kenya",        durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.3, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i24", year:2025, organization:"SFH",           department:"Finance Hub",                        country:"Uganda",       durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i25", year:2025, organization:"KASHA",        department:"Health Enterprise Operations",      country:"Nigeria",      durationWeeks:12, students:6, femaleStudents:4, employmentConversions:3, satisfactionScore:4.6, hasMentor:true,  placementsAfterInternship:3 },
  { id:"i26", year:2025, organization:"CHII Internal", department:"HENT",                              country:"Rwanda",       durationWeeks:12, students:7, femaleStudents:4, employmentConversions:4, satisfactionScore:4.8, hasMentor:true,  placementsAfterInternship:4 },
  { id:"i27", year:2025, organization:"mIndora Health",department:"Software Engineering & UX Design",  country:"Ethiopia",     durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:1, satisfactionScore:4.2, hasMentor:false, placementsAfterInternship:1 },
  { id:"i28", year:2025, organization:"CHII Internal", department:"HEMP",                              country:"Uganda",       durationWeeks:12, students:5, femaleStudents:3, employmentConversions:3, satisfactionScore:4.7, hasMentor:true,  placementsAfterInternship:3 },
  { id:"i29", year:2025, organization:"SFH",           department:"Data and Technology Hub",           country:"Nigeria",      durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.4, hasMentor:true,  placementsAfterInternship:2 },

  { id:"i30", year:2026, organization:"KASHA",        department:"Health Enterprise Operations",      country:"Rwanda",       durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.5, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i31", year:2026, organization:"RCR",          department:"Operations",                         country:"Ghana",        durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.6, hasMentor:true,  placementsAfterInternship:2 },
  { id:"i32", year:2026, organization:"CHII Internal", department:"HENT",                              country:"Kenya",        durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true,  placementsAfterInternship:2 },
];

