"use client";
import React from "react";

// Color palette - HENT green
const BRAND = "#2D6A4F";
const BRAND_DK = "#0E4633";
const LIGHT_BORDER = "rgba(14, 70, 51, 0.12)";

export interface FilterOption {
  label: string;
  value: string | number;
  options: (string | number)[];
  onValueChange: (value: string | number) => void;
  currentValue: string | number;
}

export interface FilterDropdownProps {
  isOpen: boolean;
  filters?: FilterOption[];
  onResetFilters: () => void;
  children?: React.ReactNode;
}

/**
 * FilterDropdown - Standardized filter dropdown for HENT pages
 *
 * Features:
 * - White background (respects CSS variables)
 * - Green header bar with Reset button
 * - Filter option buttons with selected state
 * - Matches Ventures page design
 * - Accepts both FilterOption array or custom children
 *
 * Props:
 * - isOpen: whether dropdown is visible
 * - filters: array of FilterOption objects for standard rendering
 * - onResetFilters: callback to reset all filters
 * - children: optional custom content instead of filters array
 */
export function FilterDropdown({
  isOpen,
  filters,
  onResetFilters,
  children,
}: FilterDropdownProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "absolute",
      top: "calc(100% + 4px)",
      right: 0,
      zIndex: 50,
      width: 280,
      backgroundColor: "var(--bg-surface, white)",
      borderRadius: 10,
      border: `1px solid ${LIGHT_BORDER}`,
      borderLeft: `5px solid ${BRAND}`,
      boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
      overflow: "hidden",
    }}>
      {/* Header with Reset button */}
      <div style={{ backgroundColor: BRAND, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Filters
        </p>
        <button
          onClick={onResetFilters}
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "white",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 6,
            padding: "3px 8px",
            backgroundColor: "rgba(255,255,255,0.08)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Reset
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px" }}>
        {children ? (
          children
        ) : filters ? (
          // Default rendering of FilterOption array
          filters.map(filter => (
            <div key={String(filter.label)} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: BRAND_DK, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {filter.label}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {filter.options.map(opt => {
                  const isSelected = filter.currentValue === opt;
                  return (
                    <button
                      key={String(opt)}
                      onClick={() => filter.onValueChange(opt)}
                      style={{
                        fontSize: 10,
                        fontWeight: isSelected ? 700 : 500,
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: `1px solid ${isSelected ? BRAND : LIGHT_BORDER}`,
                        backgroundColor: isSelected ? BRAND : "white",
                        color: isSelected ? "white" : BRAND_DK,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}
