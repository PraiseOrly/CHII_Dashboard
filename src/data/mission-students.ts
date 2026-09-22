export interface MissionStudent {
  id: string;
  email: string;
  fullName: string;
  enrollmentStatus: 'active' | 'completed' | 'inactive';
  gender: string;
  yearGroup: number;
  primaryAcademicProgram: string;
  nationality: string;
  countryOfResidence: string;
  cityOfResidence: string;
  academicStanding: 'excellent' | 'good' | 'at-risk';
  financialStanding: 'good' | 'at-risk' | 'need-support';
  humanitarianStatus: string;
  disability: string;
  areaOfInterestInHealth: string;
  interestedInNetworking: boolean;
  interestedInGroups: boolean;
  hasHealthVenture: boolean;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const COUNTRIES = [
  'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana',
  'Senegal', 'Mali', 'Ethiopia', 'South Africa', 'Zambia', 'Zimbabwe',
  'Botswana', 'Namibia', 'Mozambique'
];

const ACADEMIC_PROGRAMS = [
  'Medicine', 'Nursing', 'Public Health', 'Pharmacy', 'Medical Technology',
  'Health Administration', 'Dentistry', 'Physiotherapy', 'Nutrition'
];

const HEALTH_INTERESTS = [
  'Primary Healthcare', 'Mental Health', 'Maternal & Child Health',
  'Infectious Diseases', 'Non-Communicable Diseases', 'Health Systems',
  'Medical Research', 'Health Technology', 'Community Health'
];

function generateRandomStudent(id: number): MissionStudent {
  const academicStandings = ['excellent', 'good', 'at-risk'] as const;
  const financialStandings = ['good', 'at-risk', 'need-support'] as const;
  const enrollmentStatuses = ['active', 'completed', 'inactive'] as const;
  const genders = ['Male', 'Female', 'Other'];

  const randomCountry = COUNTRIES[Math.floor(seededRandom(id * 1) * COUNTRIES.length)];
  const isRefugee = seededRandom(id * 2) > 0.88; // 12% refugee
  const isPWD = seededRandom(id * 3) > 0.82; // 18% PWD

  return {
    id: `MS-${String(id).padStart(4, '0')}`,
    email: `student${id}@healthmissions.org`,
    fullName: `Student ${id}`,
    enrollmentStatus: enrollmentStatuses[Math.floor(seededRandom(id * 4) * enrollmentStatuses.length)],
    gender: genders[Math.floor(seededRandom(id * 5) * genders.length)],
    yearGroup: Math.floor(seededRandom(id * 6) * 4) + 1,
    primaryAcademicProgram: ACADEMIC_PROGRAMS[Math.floor(seededRandom(id * 7) * ACADEMIC_PROGRAMS.length)],
    nationality: randomCountry,
    countryOfResidence: randomCountry,
    cityOfResidence: `City ${Math.floor(seededRandom(id * 8) * 100)}`,
    academicStanding: academicStandings[Math.floor(seededRandom(id * 9) * academicStandings.length)],
    financialStanding: financialStandings[Math.floor(seededRandom(id * 10) * financialStandings.length)],
    humanitarianStatus: isRefugee ? 'Refugee' : 'Non-refugee',
    disability: isPWD ? 'Yes' : 'No',
    areaOfInterestInHealth: HEALTH_INTERESTS[Math.floor(seededRandom(id * 11) * HEALTH_INTERESTS.length)],
    interestedInNetworking: seededRandom(id * 12) > 0.3,
    interestedInGroups: seededRandom(id * 13) > 0.35,
    hasHealthVenture: seededRandom(id * 14) > 0.95,
  };
}

export const missionStudents: MissionStudent[] = Array.from(
  { length: 2450 },
  (_, i) => generateRandomStudent(i + 1)
);
