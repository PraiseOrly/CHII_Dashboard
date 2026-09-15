"use client";
import { SlidersHorizontal } from "lucide-react";

// Color palette - HENT green
const BRAND = "#2D6A4F";
const BRAND_DK = "#0E4633";
const LIGHT_BORDER = "rgba(14, 70, 51, 0.12)";

export interface FilterButtonProps {
  activeFilterCount: number;
  onClick: () => void;
  isOpen: boolean;
}

/**
 * FilterButton - Standardized filter button for HENT pages
 *
 * Features:
 * - Green button with filter icon + "Filters" label
 * - Active filter count badge
 * - Toggle open/close state
 * - Matches Ventures page design
 *
 * Props:
 * - activeFilterCount: number of currently active filters
 * - onClick: handler to toggle filter dropdown
 * - isOpen: whether filter dropdown is currently open
 */
export function FilterButton({
  activeFilterCount,
  onClick,
  isOpen,
}: FilterButtonProps) {
  const isActive = activeFilterCount > 0;

  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "8px 14px",
        borderRadius: 20,
        border: `1px solid ${LIGHT_BORDER}`,
        borderLeft: `5px solid ${BRAND}`,
        backgroundColor: isActive ? BRAND : "white",
        color: isActive ? "white" : BRAND_DK,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
        textTransform: "uppercase",
        letterSpacing: "0.02em",
      }}
    >
      <SlidersHorizontal size={14} style={{ flexShrink: 0 }} />
      Filters
      {activeFilterCount > 0 && (
        <span style={{
          fontSize: 9,
          fontWeight: 800,
          backgroundColor: "rgba(255,255,255,0.25)",
          color: "white",
          borderRadius: 999,
          minWidth: 18,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}
