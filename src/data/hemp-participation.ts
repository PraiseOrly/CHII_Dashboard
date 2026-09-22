export type HempActivityType = 'Career Workshops' | 'Exposure Events' | 'Internships' | 'Student Immersive Experience' | 'Courses';
export type OutcomeType = 'Employed' | 'Venture' | 'Further Education' | 'Exploring';

export interface HempParticipation {
  studentId: string;
  activity: HempActivityType;
  year: number;
  country: string;
  completed: boolean;
  satisfaction: number;
  outcome?: OutcomeType;
  outcomeSalary?: number;
  durationMonths?: number;
}

const COUNTRIES = [
  'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana',
  'Senegal', 'Mali', 'Ethiopia', 'South Africa', 'Zambia', 'Zimbabwe',
  'Botswana', 'Namibia', 'Mozambique'
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateRandomParticipation(studentId: string, index: number): HempParticipation[] {
  const activities: HempActivityType[] = [
    'Career Workshops',
    'Exposure Events',
    'Internships',
    'Student Immersive Experience',
    'Courses'
  ];

  const participations: HempParticipation[] = [];

  // 61% of students engage in at least one HEMP activity
  if (seededRandom(index * 1) > 0.39) {
    // Randomly select 1-3 activities
    const numActivities = Math.floor(seededRandom(index * 2) * 3) + 1;
    const selectedActivities = activities
      .sort(() => seededRandom(index * 3) - 0.5)
      .slice(0, numActivities);

    selectedActivities.forEach((activity, actIdx) => {
      const completed = seededRandom(index * 4 + actIdx) > 0.1;
      const satisfaction = Math.floor(seededRandom(index * 5 + actIdx) * 2) + 3.5;

      let participation: HempParticipation = {
        studentId,
        activity,
        year: 2024,
        country: COUNTRIES[Math.floor(seededRandom(index * 6 + actIdx) * COUNTRIES.length)],
        completed,
        satisfaction,
      };

      if (completed) {
        const outcomes: OutcomeType[] = ['Employed', 'Venture', 'Further Education', 'Exploring'];
        const weights = [0.16, 0.03, 0.04, 0.77];
        const rand = seededRandom(index * 7 + actIdx);
        let outcome: OutcomeType = 'Exploring';

        if (rand < 0.16) outcome = 'Employed';
        else if (rand < 0.19) outcome = 'Venture';
        else if (rand < 0.23) outcome = 'Further Education';

        participation.outcome = outcome;

        if (outcome === 'Employed') {
          const baseSalary = 600;
          const variance = Math.floor(seededRandom(index * 8 + actIdx) * 600) - 300;
          participation.outcomeSalary = baseSalary + variance;
          participation.durationMonths = Math.floor(seededRandom(index * 9 + actIdx) * 6) + 2;
        }

        if (activity === 'Internships') {
          participation.durationMonths = 4;
        } else if (activity === 'Student Immersive Experience') {
          participation.durationMonths = 6;
        } else if (activity === 'Courses') {
          participation.durationMonths = Math.floor(seededRandom(index * 10 + actIdx) * 3) + 1;
        }
      }

      participations.push(participation);
    });
  }

  return participations;
}

const allParticipations: HempParticipation[] = [];
for (let i = 1; i <= 2450; i++) {
  const studentId = `MS-${String(i).padStart(4, '0')}`;
  allParticipations.push(...generateRandomParticipation(studentId, i));
}

export const hempParticipations = allParticipations;

export function getHempStats() {
  const totalParticipations = hempParticipations.length;
  const uniqueStudents = new Set(hempParticipations.map(p => p.studentId)).size;
  const engagementRate = (uniqueStudents / 2450) * 100;

  const byActivity = {
    'Career Workshops': hempParticipations.filter(p => p.activity === 'Career Workshops').length,
    'Exposure Events': hempParticipations.filter(p => p.activity === 'Exposure Events').length,
    'Internships': hempParticipations.filter(p => p.activity === 'Internships').length,
    'Student Immersive Experience': hempParticipations.filter(p => p.activity === 'Student Immersive Experience').length,
    'Courses': hempParticipations.filter(p => p.activity === 'Courses').length,
  };

  const byCountry = hempParticipations.reduce((acc, p) => {
    acc[p.country] = (acc[p.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const outcomes = {
    employed: hempParticipations.filter(p => p.outcome === 'Employed').length,
    venture: hempParticipations.filter(p => p.outcome === 'Venture').length,
    education: hempParticipations.filter(p => p.outcome === 'Further Education').length,
    exploring: hempParticipations.filter(p => p.outcome === 'Exploring').length,
  };

  const completionRate = hempParticipations.filter(p => p.completed).length / totalParticipations * 100;
  const avgSatisfaction = hempParticipations.reduce((sum, p) => sum + p.satisfaction, 0) / totalParticipations;

  return {
    totalParticipations,
    uniqueStudents,
    engagementRate,
    byActivity,
    byCountry,
    outcomes,
    completionRate,
    avgSatisfaction,
  };
}

export const targets2030 = {
  missionStudents: 5000,
  careerWorkshops: 1500,
  exposureEvents: 2000,
  internships: 350,
  sie: 200,
  courses: 800,
  healthVentures: 100,
};
