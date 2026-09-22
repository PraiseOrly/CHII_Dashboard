export interface InternshipRecord {
  id: string;
  studentId: string;
  country: string;
  sector: string;
  completed: boolean;
  satisfaction: number;
  outcome?: 'Employed' | 'Venture' | 'Education' | 'Exploring';
  durationMonths: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana', 'Senegal', 'Mali', 'Ethiopia', 'South Africa', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mozambique'];
const SECTORS = ['Healthcare', 'Technology', 'Finance', 'NGO', 'Government', 'Education', 'Research', 'Consulting'];
const DROPOUT_REASONS = ['Academic Conflict', 'Financial', 'Personal', 'Other'];

export const internshipRecords: InternshipRecord[] = [];

for (let i = 1; i <= 420; i++) {
  const isCompleted = seededRandom(i * 1) > 0.19;
  const country = COUNTRIES[Math.floor(seededRandom(i * 2) * COUNTRIES.length)];
  const sector = SECTORS[Math.floor(seededRandom(i * 3) * SECTORS.length)];

  let outcome: 'Employed' | 'Venture' | 'Education' | 'Exploring' | undefined;
  
  if (isCompleted) {
    const rand = seededRandom(i * 4);
    if (rand < 0.40) outcome = 'Employed';
    else if (rand < 0.45) outcome = 'Venture';
    else if (rand < 0.55) outcome = 'Education';
    else outcome = 'Exploring';
  }

  internshipRecords.push({
    id: `INT-${String(i).padStart(4, '0')}`,
    studentId: `MS-${String(i).padStart(4, '0')}`,
    country,
    sector,
    completed: isCompleted,
    satisfaction: isCompleted ? Math.round((seededRandom(i * 5) * 1.5 + 3.5) * 10) / 10 : 0,
    outcome,
    durationMonths: 4
  });
}

export function getInternshipStats() {
  const total = internshipRecords.length;
  const completed = internshipRecords.filter(r => r.completed).length;
  const accepted = Math.floor(total * 0.43);
  const shortlisted = Math.floor(total * 0.67);
  const interviewed = Math.floor(shortlisted * 0.96);
  const dropped = total - completed;

  const outcomes = {
    employed: internshipRecords.filter(r => r.outcome === 'Employed').length,
    venture: internshipRecords.filter(r => r.outcome === 'Venture').length,
    education: internshipRecords.filter(r => r.outcome === 'Education').length,
    exploring: internshipRecords.filter(r => r.outcome === 'Exploring').length,
  };

  const avgSatisfaction = completed > 0
    ? (internshipRecords.filter(r => r.completed).reduce((sum, r) => sum + r.satisfaction, 0) / completed).toFixed(1)
    : 0;

  return {
    total,
    accepted,
    shortlisted,
    interviewed,
    completed,
    dropped,
    completionRate: Math.round((completed / total) * 100),
    acceptanceRate: Math.round((accepted / total) * 100),
    shortlistRate: Math.round((shortlisted / total) * 100),
    interviewRate: Math.round((interviewed / shortlisted) * 100),
    avgSatisfaction,
    outcomes
  };
}
