"use client";

// Section filter pills — the rounded design used on the HENT Overview.
// Fully-rounded (999px) pills: filled with the accent when active, white with a
// faint accent border when not. `accent` themes it per portal.

export default function SectionPills<T extends string>({
  options, value, onChange, accent = "#0E4633",
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            style={{
              fontSize: 11.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
              border: `1px solid ${on ? accent : "rgba(14,70,51,0.18)"}`,
              backgroundColor: on ? accent : "white",
              color: on ? "white" : "#6B7280",
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
