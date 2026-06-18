/* ════════════════════════════════════════════════════════
   Entrepreneurship — synthetic dataset
   Deterministic (seeded) so SSR and CSR render identically.
═══════════════════════════════════════════════════════ */

export type Gender = "Female" | "Male" | "Other";
export type Stage = "Idea" | "Pre-seed" | "Seed" | "Early-stage" | "Growth" | "Scaling" | "Mature" | "Closed";
export type Status = "Pre-seed" | "Seed" | "Early-stage" | "Growth" | "Scaling" | "Closed" | "Non-operational";
export type FundingSource = "Personal / bootstrap" | "Grant" | "Angel / investor" | "Accelerator" | "Loan";

export interface Venture {
  id: number;
  gender: Gender;          // founder gender
  stage: Stage;
  status: Status;
  fundingSource: FundingSource;
  formal: boolean;         // formally registered
  enablerSupport: boolean; // received enabler/accelerator support
  yearLaunched: number;
  jobsCreated: number;
  rating: number;          // 1–5
}

export const GENDERS: Gender[] = ["Female", "Male", "Other"];
export const STAGES: Stage[] = ["Idea", "Pre-seed", "Seed", "Early-stage", "Growth", "Scaling", "Mature", "Closed"];
export const STATUSES: Status[] = ["Pre-seed", "Seed", "Early-stage", "Growth", "Scaling", "Closed", "Non-operational"];
export const FUNDING_SOURCES: FundingSource[] = ["Personal / bootstrap", "Grant", "Angel / investor", "Accelerator", "Loan"];

/* pipeline funnel order (descending) */
export const PIPELINE: Stage[] = ["Idea", "Pre-seed", "Seed", "Early-stage", "Growth", "Scaling"];

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

function buildVentures(n: number): Venture[] {
  const r = rng(91);
  const out: Venture[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: i + 1,
      gender: pick<Gender>(r, [["Female", 0.44], ["Male", 0.53], ["Other", 0.03]]),
      stage: pick<Stage>(r, [
        ["Idea", 0.2], ["Pre-seed", 0.22], ["Seed", 0.18], ["Early-stage", 0.15],
        ["Growth", 0.1], ["Scaling", 0.06], ["Mature", 0.04], ["Closed", 0.05],
      ]),
      status: pick<Status>(r, [
        ["Pre-seed", 0.24], ["Seed", 0.2], ["Early-stage", 0.18], ["Growth", 0.12],
        ["Scaling", 0.08], ["Closed", 0.1], ["Non-operational", 0.08],
      ]),
      fundingSource: pick<FundingSource>(r, [
        ["Personal / bootstrap", 0.42], ["Grant", 0.2], ["Angel / investor", 0.16],
        ["Accelerator", 0.13], ["Loan", 0.09],
      ]),
      formal: r() < 0.58,
      enablerSupport: r() < 0.47,
      yearLaunched: pick<number>(r, [[2020, 0.12], [2021, 0.16], [2022, 0.2], [2023, 0.24], [2024, 0.28]]),
      jobsCreated: Math.round(Math.pow(r(), 1.6) * 9),
      rating: 1 + Math.round(r() * 4),
    });
  }
  return out;
}

export const VENTURES: Venture[] = buildVentures(500);
