import type { VentureEvent, InterventionType, Sector, Country } from "@/types";
import { ventures } from "./ventures";

const INTERVENTIONS: InterventionType[] = [
  "Hackathon", "Masterclass", "Fellowship", "Mentorship Program",
  "Funding Initiative", "Innovation Challenge", "Incubation",
  "Acceleration", "Field Study Trip", "Research Intervention",
];

function d(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  const r = x - Math.floor(x);
  return Math.round(r * (max - min) + min);
}

function eventDate(cohort: number, seed: number): string {
  const year = cohort + d(seed, 0, 1);
  const month = d(seed + 7, 1, 12);
  const day = d(seed + 13, 1, 28);
  return `${Math.min(year, 2026)}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildEventsForVenture(
  ventureId: number,
  ventureName: string,
  cohort: number,
  sector: Sector,
  country: Country,
  interventions: InterventionType[],
  startId: number,
): VentureEvent[] {
  const count = interventions.length;
  return interventions.map((intervention, k) => {
    const seed = ventureId * 100 + k * 17;
    return {
      id: startId + k,
      ventureId,
      ventureName,
      intervention,
      cohort,
      sector,
      country,
      date: eventDate(cohort, seed),
      satisfaction: d(seed + 3, 55, 98),
      hours: INTERVENTIONS_HOURS[intervention] ?? d(seed + 5, 4, 40),
    };
  });
}

const INTERVENTIONS_HOURS: Record<InterventionType, number> = {
  Hackathon:              48,
  Masterclass:             8,
  Fellowship:            240,
  "Mentorship Program":   60,
  "Funding Initiative":   16,
  "Innovation Challenge": 32,
  Incubation:            480,
  Acceleration:          360,
  "Field Study Trip":     40,
  "Research Intervention": 80,
};

let idCounter = 1;
const allEvents: VentureEvent[] = [];

for (const v of ventures) {
  const evs = buildEventsForVenture(
    v.id, v.name, v.cohort, v.sector, v.country, v.interventions, idCounter,
  );
  allEvents.push(...evs);
  idCounter += evs.length;
}

// Pad to ~430 events by adding extra programme-level events
const PROGRAMME_EVENTS: { intervention: InterventionType; cohort: number }[] = [
  { intervention: "Hackathon",              cohort: 2022 },
  { intervention: "Hackathon",              cohort: 2023 },
  { intervention: "Hackathon",              cohort: 2024 },
  { intervention: "Hackathon",              cohort: 2025 },
  { intervention: "Hackathon",              cohort: 2026 },
  { intervention: "Innovation Challenge",   cohort: 2022 },
  { intervention: "Innovation Challenge",   cohort: 2023 },
  { intervention: "Innovation Challenge",   cohort: 2024 },
  { intervention: "Innovation Challenge",   cohort: 2025 },
  { intervention: "Innovation Challenge",   cohort: 2026 },
  { intervention: "Masterclass",            cohort: 2022 },
  { intervention: "Masterclass",            cohort: 2023 },
  { intervention: "Masterclass",            cohort: 2024 },
  { intervention: "Masterclass",            cohort: 2025 },
  { intervention: "Masterclass",            cohort: 2026 },
  { intervention: "Field Study Trip",       cohort: 2023 },
  { intervention: "Field Study Trip",       cohort: 2024 },
  { intervention: "Field Study Trip",       cohort: 2025 },
  { intervention: "Funding Initiative",     cohort: 2022 },
  { intervention: "Funding Initiative",     cohort: 2023 },
  { intervention: "Funding Initiative",     cohort: 2024 },
  { intervention: "Research Intervention",  cohort: 2023 },
  { intervention: "Research Intervention",  cohort: 2024 },
  { intervention: "Research Intervention",  cohort: 2025 },
];

for (let i = 0; i < PROGRAMME_EVENTS.length; i++) {
  const { intervention, cohort } = PROGRAMME_EVENTS[i];
  const v = ventures[d(i * 31, 0, ventures.length - 1)];
  allEvents.push({
    id: idCounter++,
    ventureId: v.id,
    ventureName: v.name,
    intervention,
    cohort,
    sector: v.sector,
    country: v.country,
    date: eventDate(cohort, i * 71 + 13),
    satisfaction: d(i * 71 + 3, 60, 95),
    hours: INTERVENTIONS_HOURS[intervention] ?? 16,
  });
}

// Fill remainder to reach exactly 430
while (allEvents.length < 430) {
  const si = allEvents.length;
  const v = ventures[d(si * 37, 0, ventures.length - 1)];
  const iv = INTERVENTIONS[d(si * 13, 0, INTERVENTIONS.length - 1)];
  allEvents.push({
    id: idCounter++,
    ventureId: v.id,
    ventureName: v.name,
    intervention: iv,
    cohort: v.cohort,
    sector: v.sector,
    country: v.country,
    date: eventDate(v.cohort, si * 53),
    satisfaction: d(si * 53 + 3, 55, 98),
    hours: INTERVENTIONS_HOURS[iv] ?? 16,
  });
}

export const events: VentureEvent[] = allEvents.slice(0, 430);
