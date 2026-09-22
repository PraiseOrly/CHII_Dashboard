export interface CareerExposureSession {
  id: string;
  year: number;
  type: 'Workshop' | 'Event';
  title: string;
  date: string;
  country: string;
  participants: number;
  femaleParticipants: number;
  facilitators: string[];
  avgRating: number;
  completionRate: number;
  sector: string;
}

export interface CareerOutcome {
  studentId: string;
  outcome: 'Employed' | 'Venture' | 'Education' | 'Exploring';
  timeToOutcome?: number; // months
  yearsAfter?: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana', 'Senegal', 'Mali', 'Ethiopia', 'South Africa', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mozambique'];
const SECTORS = ['Healthcare', 'Technology', 'Finance', 'NGO/Non-profit', 'Government', 'Education', 'Research', 'Consulting'];
const WORKSHOP_TITLES = ['Career Pathways in Medicine', 'Health Tech Innovation', 'Leadership Essentials', 'Entrepreneurship 101', 'Networking Skills', 'Resume Building', 'Interview Prep'];

export const careerExposureSessions: CareerExposureSession[] = [];

for (let i = 0; i < 48; i++) {
  const isWorkshop = seededRandom(i * 1) > 0.5;
  const country = COUNTRIES[Math.floor(seededRandom(i * 2) * COUNTRIES.length)];
  const participants = Math.floor(seededRandom(i * 3) * 80) + 10;
  const femaleParticipants = Math.floor(participants * (seededRandom(i * 4) > 0.5 ? 0.6 : 0.4));

  careerExposureSessions.push({
    id: `CES-${String(i + 1).padStart(3, '0')}`,
    year: 2022 + Math.floor(i / 12),
    type: isWorkshop ? 'Workshop' : 'Event',
    title: WORKSHOP_TITLES[Math.floor(seededRandom(i * 5) * WORKSHOP_TITLES.length)],
    date: new Date(2022, i % 12, Math.floor(seededRandom(i * 6) * 28) + 1).toISOString().split('T')[0],
    country,
    participants,
    femaleParticipants,
    facilitators: [`Facilitator ${i % 10}`],
    avgRating: Math.round((seededRandom(i * 7) * 1 + 3.5) * 10) / 10,
    completionRate: Math.round((seededRandom(i * 8) * 0.2 + 0.85) * 100),
    sector: SECTORS[Math.floor(seededRandom(i * 9) * SECTORS.length)]
  });
}

export function getCareerExposureStats() {
  const totalParticipants = careerExposureSessions.reduce((sum, s) => sum + s.participants, 0);
  const workshopCount = careerExposureSessions.filter(s => s.type === 'Workshop').length;
  const eventCount = careerExposureSessions.filter(s => s.type === 'Event').length;
  const femaleParticipants = careerExposureSessions.reduce((sum, s) => sum + s.femaleParticipants, 0);
  const avgRating = (careerExposureSessions.reduce((sum, s) => sum + s.avgRating, 0) / careerExposureSessions.length).toFixed(1);
  
  const sectors = new Set(careerExposureSessions.map(s => s.sector));
  const countries = new Set(careerExposureSessions.map(s => s.country));
  const partners = new Set(careerExposureSessions.map(s => s.facilitators[0]));

  return {
    totalParticipants,
    workshopCount,
    eventCount,
    femaleParticipants,
    malParticipants: totalParticipants - femaleParticipants,
    avgRating,
    sectorCount: sectors.size,
    countryCount: countries.size,
    partnerCount: partners.size,
    avgParticipantsPerSession: Math.round(totalParticipants / careerExposureSessions.length),
    avgCompletionRate: Math.round(careerExposureSessions.reduce((sum, s) => sum + s.completionRate, 0) / careerExposureSessions.length)
  };
}

export const careerOutcomes: CareerOutcome[] = [];

for (let i = 1; i <= 1600; i++) {
  const rand = seededRandom(i * 100);
  let outcome: 'Employed' | 'Venture' | 'Education' | 'Exploring';
  
  if (rand < 0.16) {
    outcome = 'Employed';
  } else if (rand < 0.19) {
    outcome = 'Venture';
  } else if (rand < 0.23) {
    outcome = 'Education';
  } else {
    outcome = 'Exploring';
  }

  careerOutcomes.push({
    studentId: `MS-${String(i).padStart(4, '0')}`,
    outcome,
    timeToOutcome: outcome === 'Employed' ? Math.floor(seededRandom(i * 101) * 8) + 1 : undefined,
    yearsAfter: 1
  });
}
