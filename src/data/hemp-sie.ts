export interface SIERecord {
  id: string;
  year: number;
  studentCount: number;
  partner: string;
  country: string;
  communitySize: number;
  servicesDelivered: number;
  satisfaction: number;
  studentSatisfaction: number;
  lifeChanging: boolean;
  skillsGained: string[];
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const PARTNERS = ['Red Cross', 'WHO Partner Clinic', 'Community Health Center', 'Rural Hospital', 'Mobile Clinic', 'Health NGO', 'Local Health Unit', 'Medical School', 'Teaching Hospital', 'Health Ministry', 'Private Practice', 'Community Organization'];
const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria'];
const SKILLS = ['Clinical Skills', 'Leadership', 'Communication', 'Community Engagement', 'Problem Solving', 'Teamwork', 'Cultural Competency', 'Research'];

export const sieRecords: SIERecord[] = [];

for (let i = 1; i <= 89; i++) {
  const year = 2021 + Math.floor((i - 1) / 18);
  const studentCount = Math.floor(seededRandom(i * 1) * 4) + 7;
  const partner = PARTNERS[Math.floor(seededRandom(i * 2) * PARTNERS.length)];
  const country = COUNTRIES[Math.floor(seededRandom(i * 3) * COUNTRIES.length)];
  const communitySize = Math.floor(seededRandom(i * 4) * 150) + 20;
  const servicesDelivered = Math.floor(seededRandom(i * 5) * 200) + 100;

  sieRecords.push({
    id: `SIE-${String(i).padStart(3, '0')}`,
    year,
    studentCount,
    partner,
    country,
    communitySize,
    servicesDelivered,
    satisfaction: Math.round((seededRandom(i * 6) * 0.3 + 4.5) * 10) / 10,
    studentSatisfaction: Math.round((seededRandom(i * 7) * 0.2 + 4.6) * 10) / 10,
    lifeChanging: seededRandom(i * 8) > 0.06,
    skillsGained: SKILLS.slice(0, Math.floor(seededRandom(i * 9) * 5) + 3)
  });
}

export function getSIEStats() {
  const totalPlaced = sieRecords.length;
  const totalStudents = sieRecords.reduce((sum, r) => sum + r.studentCount, 0);
  const totalServed = sieRecords.reduce((sum, r) => sum + r.communitySize, 0);
  const totalServices = sieRecords.reduce((sum, r) => sum + r.servicesDelivered, 0);
  const uniquePartners = new Set(sieRecords.map(r => r.partner)).size;
  const uniqueCountries = new Set(sieRecords.map(r => r.country)).size;
  const lifeChangingCount = sieRecords.filter(r => r.lifeChanging).length;
  const avgStudentSatisfaction = (sieRecords.reduce((sum, r) => sum + r.studentSatisfaction, 0) / totalPlaced).toFixed(1);

  return {
    totalPlaced,
    totalStudents,
    totalServed,
    totalServices,
    uniquePartners,
    uniqueCountries,
    lifeChangingCount,
    avgStudentSatisfaction,
    placementRate: Math.round((totalPlaced / 200) * 100),
    communityBuyin: 92
  };
}
