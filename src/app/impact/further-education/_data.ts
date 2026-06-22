/* ════════════════════════════════════════════════════════
   Further Education — synthetic dataset
   Deterministic (seeded) so SSR and CSR render identically.
═══════════════════════════════════════════════════════ */

export type Gender = "Female" | "Male" | "Other";

export interface FeStudent {
  id: number;
  gender: Gender;
  scholar: boolean;            // MCF scholar cohort
  qualification: string;
  field: string;
  funding: string;
  destination: string;
  relevance: string;
  year: number;                // year enrolled
  active: boolean;             // currently enrolled this cycle
}

export const GENDERS: Gender[] = ["Female", "Male", "Other"];
export const QUALIFICATIONS = ["Bachelor's top-up", "Postgraduate diploma", "Master's", "Doctorate", "Professional cert"];
export const FIELDS = ["Business & Management", "Engineering & Tech", "Public Health / Policy", "Education", "Sciences", "Arts / Other"];
export const FUNDING_SOURCES = ["Scholarship / funded", "Self-funded", "Employer", "Loan"];
export const DESTINATIONS = ["Within Africa", "Europe", "North America", "Asia / Other"];
export const RELEVANCE = ["Directly related", "Somewhat related", "Different field"];
export const YEARS = [2020, 2021, 2022, 2023, 2024];

/* mulberry32 */
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
  for (const [val, w] of weighted) { if ((x -= w) <= 0) return val; }
  return weighted[weighted.length - 1][0];
}

function build(n: number): FeStudent[] {
  const r = rng(54);
  const out: FeStudent[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: i + 1,
      gender: pick<Gender>(r, [["Female", 0.59], ["Male", 0.38], ["Other", 0.03]]),
      scholar: r() < 0.55,
      qualification: pick<string>(r, [
        ["Master's", 0.42], ["Postgraduate diploma", 0.21], ["Bachelor's top-up", 0.18],
        ["Professional cert", 0.12], ["Doctorate", 0.07],
      ]),
      field: pick<string>(r, [
        ["Business & Management", 0.28], ["Engineering & Tech", 0.24], ["Public Health / Policy", 0.18],
        ["Education", 0.13], ["Sciences", 0.1], ["Arts / Other", 0.07],
      ]),
      funding: pick<string>(r, [
        ["Scholarship / funded", 0.61], ["Self-funded", 0.23], ["Employer", 0.11], ["Loan", 0.05],
      ]),
      destination: pick<string>(r, [
        ["Within Africa", 0.59], ["Europe", 0.21], ["North America", 0.14], ["Asia / Other", 0.06],
      ]),
      relevance: pick<string>(r, [
        ["Directly related", 0.57], ["Somewhat related", 0.3], ["Different field", 0.13],
      ]),
      year: pick<number>(r, [[2020, 0.31], [2021, 0.14], [2022, 0.17], [2023, 0.19], [2024, 0.19]]),
      active: r() < 0.55,
    });
  }
  return out;
}

export const FE_STUDENTS: FeStudent[] = build(206);
