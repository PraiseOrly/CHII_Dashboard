"use client";
import { Select, SelectItem, Button } from "@tremor/react";
import { useFilterStore, activeFilterCount } from "@/lib/store";
import { SECTORS, STAGES, INTERVENTION_TYPES, COUNTRIES } from "@/types";
import type { Sector, Country, Stage, InterventionType, FundingStatus } from "@/types";

const COHORTS = [2022, 2023, 2024, 2025, 2026];
const FUNDING_STATUSES = ["Bootstrapped", "Grant", "Angel", "VC", "Revenue-Based", "None"];

export default function GlobalFilterBar() {
  const { filters, setFilter, resetFilters } = useFilterStore();
  const active = activeFilterCount(filters);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Cohort */}
      <div className="w-28">
        <Select
          placeholder="Cohort"
          value={filters.cohort ? String(filters.cohort) : ""}
          onValueChange={(v) => setFilter("cohort", v ? Number(v) : null)}
          enableClear
        >
          {COHORTS.map((c) => (
            <SelectItem key={c} value={String(c)}>{c}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Sector */}
      <div className="w-44">
        <Select
          placeholder="Sector"
          value={filters.sector ?? ""}
          onValueChange={(v) => setFilter("sector", (v as Sector) || null)}
          enableClear
        >
          {SECTORS.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Country */}
      <div className="w-36">
        <Select
          placeholder="Country"
          value={filters.country ?? ""}
          onValueChange={(v) => setFilter("country", (v || null) as typeof filters.country)}
          enableClear
        >
          {COUNTRIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Stage */}
      <div className="w-40">
        <Select
          placeholder="Stage"
          value={filters.stage ?? ""}
          onValueChange={(v) => setFilter("stage", (v || null) as typeof filters.stage)}
          enableClear
        >
          {STAGES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Intervention */}
      <div className="w-44">
        <Select
          placeholder="Intervention"
          value={filters.interventionType ?? ""}
          onValueChange={(v) =>
            setFilter("interventionType", (v || null) as typeof filters.interventionType)
          }
          enableClear
        >
          {INTERVENTION_TYPES.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Funding status */}
      <div className="w-36">
        <Select
          placeholder="Funding"
          value={filters.fundingStatus ?? ""}
          onValueChange={(v) =>
            setFilter("fundingStatus", (v || null) as typeof filters.fundingStatus)
          }
          enableClear
        >
          {FUNDING_STATUSES.map((f) => (
            <SelectItem key={f} value={f}>{f}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Reset */}
      {active > 0 && (
        <Button
          size="xs"
          variant="secondary"
          onClick={resetFilters}
          className="whitespace-nowrap"
        >
          Clear {active} filter{active !== 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}
