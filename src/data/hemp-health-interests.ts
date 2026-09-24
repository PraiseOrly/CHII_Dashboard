// Health Interest Areas tracking across HEMP programmes
// Based on participant responses about their areas of interest in health

export const HEALTH_INTEREST_AREAS = [
  "Mental Health",
  "Digital Health",
  "Health Equity, Advocacy and Leadership",
  "Nutrition",
  "Disease Prevention and Control",
  "Maternal and Child Health",
  "Sexual and Reproductive Health",
  "One Health",
  "Biomedical Engineering",
  "Public Health",
  "Dental Health",
  "Radiology",
  "Oncology",
  "Skincare",
  "Emergency Medical Services",
  "Healthcare Entrepreneurship",
  "Health Systems Strengthening",
] as const;

export type HealthInterestArea = typeof HEALTH_INTEREST_AREAS[number];

// Seeded random function for consistent data generation
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Distribution weights for health interest areas (reflects the user's data)
const INTEREST_WEIGHTS: Record<HealthInterestArea, number> = {
  "Digital Health": 0.18,
  "Mental Health": 0.16,
  "Health Equity, Advocacy and Leadership": 0.14,
  "Nutrition": 0.10,
  "Disease Prevention and Control": 0.10,
  "Maternal and Child Health": 0.08,
  "Sexual and Reproductive Health": 0.06,
  "One Health": 0.04,
  "Biomedical Engineering": 0.02,
  "Public Health": 0.03,
  "Dental Health": 0.02,
  "Radiology": 0.02,
  "Oncology": 0.02,
  "Skincare": 0.02,
  "Emergency Medical Services": 0.02,
  "Healthcare Entrepreneurship": 0.02,
  "Health Systems Strengthening": 0.01,
};

export function generateHealthInterests(count: number, seed: number): HealthInterestArea[] {
  const interests: HealthInterestArea[] = [];

  for (let i = 0; i < count; i++) {
    const rand = seededRandom(seed + i);
    let cumulative = 0;

    for (const area of HEALTH_INTEREST_AREAS) {
      cumulative += INTEREST_WEIGHTS[area];
      if (rand <= cumulative) {
        interests.push(area);
        break;
      }
    }
  }

  return interests;
}

export function getHealthInterestDistribution(
  interests: HealthInterestArea[]
): Record<HealthInterestArea, number> {
  const distribution: Record<HealthInterestArea, number> = {} as Record<
    HealthInterestArea,
    number
  >;

  HEALTH_INTEREST_AREAS.forEach(area => {
    distribution[area] = 0;
  });

  interests.forEach(interest => {
    distribution[interest]++;
  });

  return distribution;
}

export function getTopHealthInterests(
  distribution: Record<HealthInterestArea, number>,
  count: number = 10
): Array<[HealthInterestArea, number]> {
  return Object.entries(distribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count) as Array<[HealthInterestArea, number]>;
}
