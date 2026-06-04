export type InternshipSector =
  | "Hospital"
  | "NGO"
  | "Government"
  | "MedTech"
  | "Pharma"
  | "Research";

export interface Internship {
  id:                    string;
  year:                  number;
  organization:          string;
  sector:                InternshipSector;
  country:               string;
  durationWeeks:         number;
  students:              number;
  femaleStudents:        number;
  employmentConversions: number;
  satisfactionScore:     number;
  hasMentor:             boolean;
}

export const INTERNSHIP_SECTORS: InternshipSector[] = [
  "Hospital", "NGO", "Government", "MedTech", "Pharma", "Research",
];

export const internships: Internship[] = [
  { id:"i01", year:2021, organization:"King Faisal Hospital",                  sector:"Hospital",   country:"Rwanda",       durationWeeks:8,  students:5, femaleStudents:3, employmentConversions:1, satisfactionScore:4.4, hasMentor:true  },
  { id:"i02", year:2021, organization:"Partners in Health",                    sector:"NGO",        country:"Rwanda",       durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.6, hasMentor:true  },
  { id:"i03", year:2021, organization:"Rwanda Biomedical Centre",              sector:"Government", country:"Rwanda",       durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:1, satisfactionScore:4.2, hasMentor:false },
  { id:"i04", year:2022, organization:"Aga Khan Hospital",                     sector:"Hospital",   country:"Kenya",        durationWeeks:12, students:7, femaleStudents:4, employmentConversions:2, satisfactionScore:4.5, hasMentor:true  },
  { id:"i05", year:2022, organization:"Zipline Africa",                        sector:"MedTech",    country:"Rwanda",       durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true  },
  { id:"i06", year:2022, organization:"AMREF Health Africa",                   sector:"NGO",        country:"Kenya",        durationWeeks:8,  students:6, femaleStudents:4, employmentConversions:1, satisfactionScore:4.4, hasMentor:true  },
  { id:"i07", year:2022, organization:"Kenya Ministry of Health",              sector:"Government", country:"Kenya",        durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:0, satisfactionScore:4.0, hasMentor:false },
  { id:"i08", year:2022, organization:"UCT Medical Research",                  sector:"Research",   country:"South Africa", durationWeeks:12, students:3, femaleStudents:2, employmentConversions:1, satisfactionScore:4.6, hasMentor:true  },
  { id:"i09", year:2023, organization:"Muhimbili National Hospital",           sector:"Hospital",   country:"Tanzania",     durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.3, hasMentor:true  },
  { id:"i10", year:2023, organization:"Matibabu Foundation",                   sector:"MedTech",    country:"Kenya",        durationWeeks:8,  students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true  },
  { id:"i11", year:2023, organization:"Global Fund",                           sector:"NGO",        country:"Rwanda",       durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true  },
  { id:"i12", year:2023, organization:"Novartis Africa",                       sector:"Pharma",     country:"South Africa", durationWeeks:12, students:5, femaleStudents:3, employmentConversions:3, satisfactionScore:4.8, hasMentor:true  },
  { id:"i13", year:2023, organization:"Tanzania Ministry of Health",           sector:"Government", country:"Tanzania",     durationWeeks:8,  students:3, femaleStudents:1, employmentConversions:0, satisfactionScore:3.9, hasMentor:false },
  { id:"i14", year:2023, organization:"EA Health Research Commission",         sector:"Research",   country:"Uganda",       durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true  },
  { id:"i15", year:2023, organization:"Korle Bu Teaching Hospital",            sector:"Hospital",   country:"Ghana",        durationWeeks:10, students:5, femaleStudents:3, employmentConversions:1, satisfactionScore:4.2, hasMentor:false },
  { id:"i16", year:2024, organization:"Roche Africa",                          sector:"Pharma",     country:"South Africa", durationWeeks:14, students:6, femaleStudents:4, employmentConversions:3, satisfactionScore:4.8, hasMentor:true  },
  { id:"i17", year:2024, organization:"Safaricom Health",                      sector:"MedTech",    country:"Kenya",        durationWeeks:10, students:7, femaleStudents:4, employmentConversions:3, satisfactionScore:4.6, hasMentor:true  },
  { id:"i18", year:2024, organization:"Nairobi Women's Hospital",              sector:"Hospital",   country:"Kenya",        durationWeeks:8,  students:5, femaleStudents:4, employmentConversions:1, satisfactionScore:4.4, hasMentor:true  },
  { id:"i19", year:2024, organization:"PATH International",                    sector:"NGO",        country:"Ethiopia",     durationWeeks:12, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true  },
  { id:"i20", year:2024, organization:"WITS Health Consortium",                sector:"Research",   country:"South Africa", durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true  },
  { id:"i21", year:2024, organization:"Uganda Ministry of Health",             sector:"Government", country:"Uganda",       durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:1, satisfactionScore:4.1, hasMentor:false },
  { id:"i22", year:2024, organization:"Hewa Tele",                             sector:"MedTech",    country:"Rwanda",       durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.6, hasMentor:true  },
  { id:"i23", year:2025, organization:"Kenyatta National Hospital",            sector:"Hospital",   country:"Kenya",        durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.3, hasMentor:true  },
  { id:"i24", year:2025, organization:"Living Goods",                          sector:"NGO",        country:"Uganda",       durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.5, hasMentor:true  },
  { id:"i25", year:2025, organization:"Biopharma Africa",                      sector:"Pharma",     country:"Nigeria",      durationWeeks:12, students:6, femaleStudents:4, employmentConversions:3, satisfactionScore:4.6, hasMentor:true  },
  { id:"i26", year:2025, organization:"AI Health Rwanda",                      sector:"MedTech",    country:"Rwanda",       durationWeeks:12, students:7, femaleStudents:4, employmentConversions:4, satisfactionScore:4.8, hasMentor:true  },
  { id:"i27", year:2025, organization:"Ethiopian Public Health Institute",     sector:"Government", country:"Ethiopia",     durationWeeks:8,  students:4, femaleStudents:2, employmentConversions:1, satisfactionScore:4.2, hasMentor:false },
  { id:"i28", year:2025, organization:"Makerere Infectious Diseases Research", sector:"Research",   country:"Uganda",       durationWeeks:12, students:5, femaleStudents:3, employmentConversions:3, satisfactionScore:4.7, hasMentor:true  },
  { id:"i29", year:2025, organization:"PharmAccess Africa",                    sector:"NGO",        country:"Nigeria",      durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.4, hasMentor:true  },
  { id:"i30", year:2026, organization:"Rwanda Military Hospital",              sector:"Hospital",   country:"Rwanda",       durationWeeks:10, students:6, femaleStudents:4, employmentConversions:2, satisfactionScore:4.5, hasMentor:true  },
  { id:"i31", year:2026, organization:"MicroEnsure Health",                    sector:"MedTech",    country:"Ghana",        durationWeeks:10, students:5, femaleStudents:3, employmentConversions:2, satisfactionScore:4.6, hasMentor:true  },
  { id:"i32", year:2026, organization:"Wellcome Trust Africa",                 sector:"Research",   country:"Kenya",        durationWeeks:12, students:4, femaleStudents:3, employmentConversions:2, satisfactionScore:4.7, hasMentor:true  },
];
