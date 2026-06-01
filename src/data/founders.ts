function d(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  const r = x - Math.floor(x);
  return Math.round(r * (max - min) + min);
}

const NATIONALITIES = [
  "Rwanda", "Kenya", "Nigeria", "Ghana", "Uganda",
  "Ethiopia", "Senegal", "Tanzania", "Cameroon", "Côte d'Ivoire",
  "Zimbabwe", "Zambia", "Mozambique", "South Africa",
];

export const PROGRAM_EVENTS_LIST = [
  "AFYAFEST",
  "Africa Health Tech Summit",
  "HENT Venture Fund",
  "ALX Venture Academy",
  "AIMS Workshop",
  "1-on-1 Coaching",
];

export interface Founder {
  id: string;
  ventureId: string;
  gender: "Female" | "Male";
  institution: "ALU" | "ALX";
  status: "Student" | "Alumni";
  nationality: string;
  isPWD: boolean;
  isRefugee: boolean;
  isMCFScholar: boolean;
  events: string[];
  interventionMonth: number;
}

export const founders: Founder[] = Array.from({ length: 96 }, (_, i) => {
  const s = i + 2000;
  const evCount = d(s + 5, 1, 4);
  const evIndices: number[] = [];
  for (let j = 0; j < 20 && evIndices.length < evCount; j++) {
    const idx = d(s + j * 17 + 100, 0, PROGRAM_EVENTS_LIST.length - 1);
    if (!evIndices.includes(idx)) evIndices.push(idx);
  }
  return {
    id: `F${String(i + 1).padStart(3, "0")}`,
    ventureId: `V${String(i + 1).padStart(3, "0")}`,
    gender: d(s + 1, 0, 99) < 43 ? "Female" : "Male",
    institution: d(s + 2, 0, 99) < 60 ? "ALU" : "ALX",
    status: d(s + 3, 0, 99) < 55 ? "Student" : "Alumni",
    nationality: NATIONALITIES[d(s + 4, 0, NATIONALITIES.length - 1)],
    isPWD: d(s + 6, 0, 99) < 8,
    isRefugee: d(s + 7, 0, 99) < 5,
    isMCFScholar: d(s + 8, 0, 99) < 35,
    events: evIndices.map((idx) => PROGRAM_EVENTS_LIST[idx]),
    interventionMonth: d(s + 10, 1, 12),
  };
});
