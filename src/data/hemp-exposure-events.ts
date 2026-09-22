function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export interface ExposureEvent {
  id: string;
  year: number;
  title: string;
  date: string;
  country: string;
  participants: number;
  femaleParticipants: number;
  avgRating: number;
  completionRate: number;
  sector: string;
}

const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana', 'Senegal', 'Mali', 'Ethiopia', 'South Africa'];
const SECTORS = ['Healthcare', 'Technology', 'Finance', 'NGO', 'Government', 'Education', 'Research'];
const EVENT_TITLES = ['Health Leadership Summit', 'Career Fair', 'Networking Breakfast', 'Industry Panel', 'Mentoring Session', 'Job Fair', 'Sector Exchange'];

export const exposureEvents: ExposureEvent[] = [];

for (let i = 0; i < 23; i++) {
  const country = COUNTRIES[Math.floor(seededRandom(i * 2) * COUNTRIES.length)];
  const participants = Math.floor(seededRandom(i * 3) * 100) + 20;
  const femaleParticipants = Math.floor(participants * (seededRandom(i * 4) > 0.5 ? 0.58 : 0.42));

  exposureEvents.push({
    id: `EXP-${String(i + 1).padStart(3, '0')}`,
    year: 2022 + Math.floor(i / 8),
    title: EVENT_TITLES[Math.floor(seededRandom(i * 5) * EVENT_TITLES.length)],
    date: new Date(2022, i % 12, Math.floor(seededRandom(i * 6) * 28) + 1).toISOString().split('T')[0],
    country,
    participants,
    femaleParticipants,
    avgRating: Math.round((seededRandom(i * 7) * 1 + 3.5) * 10) / 10,
    completionRate: Math.round((seededRandom(i * 8) * 0.2 + 0.88) * 100),
    sector: SECTORS[Math.floor(seededRandom(i * 9) * SECTORS.length)]
  });
}

export function getExposureEventStats() {
  const totalParticipants = exposureEvents.reduce((sum, e) => sum + e.participants, 0);
  const eventCount = exposureEvents.length;
  const femaleParticipants = exposureEvents.reduce((sum, e) => sum + e.femaleParticipants, 0);
  const avgRating = (exposureEvents.reduce((sum, e) => sum + e.avgRating, 0) / eventCount).toFixed(1);
  
  const sectors = new Set(exposureEvents.map(e => e.sector));
  const countries = new Set(exposureEvents.map(e => e.country));
  const avgParticipantsPerEvent = Math.round(totalParticipants / eventCount);

  return {
    totalParticipants,
    eventCount,
    femaleParticipants,
    maleParticipants: totalParticipants - femaleParticipants,
    avgRating,
    sectorCount: sectors.size,
    countryCount: countries.size,
    avgParticipantsPerEvent,
    avgCompletionRate: Math.round(exposureEvents.reduce((sum, e) => sum + e.completionRate, 0) / eventCount)
  };
}
