// Shared geographic-reach rollup — used by the Overview page (Reach by Region,
// Partner & Opportunity Reach) and the At a Glance page (Geographic Reach map).
// One source of truth so both stay in sync.
import { healthXSessions } from "./healthx";
import { internships } from "./internships";
import { sieCohorts } from "./sie";
import { healthXSymposia } from "./healthx-careers";

export type ReachRecord = { country: string; year: number; reach: number; female: number };

export const REACH_RECORDS: ReachRecord[] = [
  ...healthXSessions.map(h => ({ country: h.country, year: h.year, reach: h.participants,     female: h.femalePart })),
  ...internships.map(i    => ({ country: i.country,  year: i.year, reach: i.students,         female: i.femaleStudents })),
  ...sieCohorts.map(c     => ({ country: c.country,  year: c.year, reach: c.selected,          female: c.female })),
  ...healthXSymposia.map(x => ({ country: x.country, year: x.year, reach: x.studentsAttending, female: x.femaleStudents })),
];

export const COUNTRY_REGION: Record<string, string> = {
  Rwanda: "East Africa", Kenya: "East Africa", Uganda: "East Africa", Tanzania: "East Africa", Ethiopia: "East Africa",
  Ghana: "West Africa", Nigeria: "West Africa", Senegal: "West Africa",
  "South Africa": "Southern Africa", Malawi: "Southern Africa", Mozambique: "Southern Africa", Zambia: "Southern Africa",
  Cameroon: "Central Africa",
};

export const GEO_REGIONS   = Array.from(new Set(Object.values(COUNTRY_REGION)));
export const GEO_COUNTRIES = Array.from(new Set(REACH_RECORDS.map(r => r.country))).sort();
export const GEO_YEARS     = Array.from(new Set(REACH_RECORDS.map(r => r.year))).sort();
