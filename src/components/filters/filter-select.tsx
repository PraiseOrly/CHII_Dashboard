"use client";
// The two select shapes used across the dashboards. Each was copy-pasted into 15
// page files, in navy and green variants that differed only by colour.
//
// They are NOT interchangeable — they sit in different places:
//   FilterSelect        stacked (label above), lives inside the filter popover panel
//   InlineFilterSelect  label beside the select, lives in a header filter bar
//
// Both take their colours from the portal barrel, so pages never pass a tint.

import { COLORS } from "@/theme/tokens";

/** Stacked label + select. Used in the two-column popover panel. */
export function FilterSelect<T extends string | number>({
  label, value, onChange, options, tint = COLORS.navy, basis = 140,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  /** Select text + border colour. Supplied by the portal barrel. */
  tint?: string;
  /** flex-basis in px — lets a 4-up row breathe differently from a 2-up one. */
  basis?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: `1 1 ${basis}px` }}>
      <label style={{ fontSize: 9.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <select
        value={String(value)}
        onChange={e => {
          // Round-trip through the option list so a numeric T stays a number.
          const match = options.find(o => String(o.value) === e.target.value);
          if (match) onChange(match.value);
        }}
        style={{ width: "100%", fontSize: 12, border: `1px solid ${tint}26`, borderRadius: 6, padding: "7px 9px", color: tint, backgroundColor: "white", cursor: "pointer" }}
      >
        {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    </div>
  );
}

/** Label beside the select, for the filter bar under a page header. */
export function InlineFilterSelect({
  label, value, onChange, options, tint = COLORS.navy, labelTint = COLORS.blue900,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  tint?: string;
  labelTint?: string;
}) {
  return (
    <label
      className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: `${labelTint}99` }}
    >
      {label}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-[11px] font-medium normal-case tracking-normal rounded-md px-2 py-1 outline-none cursor-pointer"
        style={{ color: tint, border: `1px solid ${labelTint}33`, backgroundColor: "white" }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
