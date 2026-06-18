/* ════════════════════════════════════════════════════════
   Youth in Work — synthetic dataset
   Deterministic (seeded) so SSR and CSR render identically.
═══════════════════════════════════════════════════════ */

export type Cohort = "Scholar" | "Non-Scholar";
export type Gender = "Female" | "Male" | "Non-binary";
export type Pathway =
  | "Wage Employment"
  | "Ventures"
  | "Wage & Ventures"
  | "Further Education"
  | "Other";

export interface Talent {
  id: number;
  gender: Gender;
  cohort: Cohort;
  basedInAfrica: boolean;
  refugee: boolean;
  pwd: boolean;
  primaryJob: boolean;   // holds a primary job
  secondaryJob: boolean; // holds a secondary job (in addition to primary)
  pathway: Pathway;
  incomeUSD: number;     // monthly income, USD
  satisfaction: number;  // 1–5 self-reported
}

export const PATHWAYS: Pathway[] = [
  "Wage Employment",
  "Ventures",
  "Wage & Ventures",
  "Further Education",
  "Other",
];

export const GENDERS: Gender[] = ["Female", "Male", "Non-binary"];

/* mulberry32 — small deterministic PRNG */
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(r: () => number, weighted: [T, number][]): T {
  const total = weighted.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [val, w] of weighted) {
    if ((x -= w) <= 0) return val;
  }
  return weighted[weighted.length - 1][0];
}

function buildTalents(n: number): Talent[] {
  const r = rng(42);
  const out: Talent[] = [];
  for (let i = 0; i < n; i++) {
    const gender = pick<Gender>(r, [["Female", 0.55], ["Male", 0.42], ["Non-binary", 0.03]]);
    const cohort = pick<Cohort>(r, [["Scholar", 0.4], ["Non-Scholar", 0.6]]);
    const pathway = pick<Pathway>(r, [
      ["Wage Employment", 0.44],
      ["Ventures", 0.18],
      ["Wage & Ventures", 0.1],
      ["Further Education", 0.16],
      ["Other", 0.12],
    ]);

    // a "primary job" exists for the work pathways
    const primaryJob =
      pathway === "Wage Employment" ||
      pathway === "Ventures" ||
      pathway === "Wage & Ventures" ||
      (pathway === "Other" && r() < 0.3);

    const secondaryJob = primaryJob && r() < 0.28;

    out.push({
      id: i + 1,
      gender,
      cohort,
      basedInAfrica: r() < 0.82,
      refugee: r() < 0.12,
      pwd: r() < 0.06,
      primaryJob,
      secondaryJob,
      pathway,
      incomeUSD: Math.round(220 + r() * 1400),
      satisfaction: 1 + Math.round(r() * 4),
    });
  }
  return out;
}

export const TALENTS: Talent[] = buildTalents(640);
