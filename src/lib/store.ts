"use client";
import { create } from "zustand";
import type { GlobalFilters, Sector, Country, FundingStatus, Stage, InterventionType } from "@/types";

interface FilterStore {
  filters: GlobalFilters;
  setFilter: <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => void;
  resetFilters: () => void;
}

const DEFAULT: GlobalFilters = {
  cohort: null,
  sector: null,
  country: null,
  interventionType: null,
  fundingStatus: null,
  stage: null,
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: DEFAULT,
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: DEFAULT }),
}));

export function activeFilterCount(filters: GlobalFilters): number {
  return Object.values(filters).filter((v) => v !== null).length;
}
