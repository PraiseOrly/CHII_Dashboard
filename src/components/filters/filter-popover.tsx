"use client";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

// Filter design ported from the Executive "Outreach & Access" dashboard:
// a pill button carrying an active-filter count badge, which opens a popover
// with a coloured band header (Reset + close) and a 2-column grid of
// labelled selects. `accent` themes it per portal (navy for Impact, green for HENT).

/* labeled select for the filter panel */
export function FilterSelect<T extends string | number>({ label, value, onChange, options, accent = "#14306B" }: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: "1 1 150px" }}>
      <label style={{ fontSize: 9.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <select
        value={String(value)}
        onChange={(e) => {
          const raw = e.target.value;
          const match = options.find(o => String(o.value) === raw);
          if (match) onChange(match.value);
        }}
        style={{ width: "100%", fontSize: 12, border: "1px solid rgba(0,33,71,0.15)", borderRadius: 6, padding: "7px 9px", color: accent, backgroundColor: "white", cursor: "pointer" }}
      >
        {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* compact filters dropdown (button + popover) — sits in the section-tabs row */
export default function OutreachFilters({
  activeCount, onReset, accent = "#14306B", badgeColor, children,
}: {
  /** number of non-default filters currently applied — drives the badge */
  activeCount: number;
  onReset: () => void;
  accent?: string;
  badgeColor?: string;
  /** the <FilterSelect> controls to render inside the panel */
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const badge = badgeColor ?? accent;

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
          border: `1px solid ${activeCount || open ? accent : "rgba(0,33,71,0.15)"}`,
          backgroundColor: open ? accent : "white", color: open ? "white" : "#374151" }}>
        <SlidersHorizontal size={13} />
        Filters
        {activeCount > 0 && (
          <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", backgroundColor: open ? "rgba(255,255,255,0.25)" : badge, borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50, width: 320, backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.12)", boxShadow: "0 10px 30px rgba(0,0,0,0.14)", overflow: "hidden" }}>
          <div style={{ backgroundColor: accent, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filters</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {activeCount > 0 && (
                <button onClick={onReset}
                  style={{ fontSize: 10, fontWeight: 600, color: "white", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, padding: "3px 8px", backgroundColor: "rgba(255,255,255,0.08)", cursor: "pointer" }}>
                  Reset
                </button>
              )}
              <button onClick={() => setOpen(false)} title="Close"
                style={{ color: "white", display: "flex", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                <X size={13} />
              </button>
            </div>
          </div>
          <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
