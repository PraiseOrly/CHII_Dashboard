import type { Venture, VentureEvent, FrameworkIndicator, GlobalFilters } from "@/types";

export function filterVentures(ventures: Venture[], f: GlobalFilters): Venture[] {
  return ventures.filter((v) => {
    if (f.cohort !== null && v.cohort !== f.cohort) return false;
    if (f.sector !== null && v.sector !== f.sector) return false;
    if (f.country !== null && v.country !== f.country) return false;
    if (f.stage !== null && v.stage !== f.stage) return false;
    if (f.fundingStatus !== null && v.fundingStatus !== f.fundingStatus) return false;
    if (f.interventionType !== null && !v.interventions.includes(f.interventionType)) return false;
    return true;
  });
}

export function filterEvents(events: VentureEvent[], f: GlobalFilters): VentureEvent[] {
  return events.filter((e) => {
    if (f.cohort !== null && e.cohort !== f.cohort) return false;
    if (f.sector !== null && e.sector !== f.sector) return false;
    if (f.country !== null && e.country !== f.country) return false;
    if (f.interventionType !== null && e.intervention !== f.interventionType) return false;
    return true;
  });
}

export function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function groupBy<T, K extends string | number>(
  arr: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
