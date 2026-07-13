"use client";

// Filter controls in the style of the Executive Overview dashboard:
// small, light, inline selects that sit in a filter row — not a coloured bar.
// The label is embedded in the first option ("Year: All"), as the executive does.

export const EXEC_SELECT_STYLE: React.CSSProperties = {
  fontSize: 11,
  border: "1px solid rgba(0,33,71,0.12)",
  borderRadius: 5,
  padding: "3px 6px",
  color: "#374151",
  backgroundColor: "white",
  cursor: "pointer",
};

export function ExecSelect({ label, value, onChange, options, allLabel = "All" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** the "all" sentinel is options[0] */
  options: string[];
  allLabel?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={EXEC_SELECT_STYLE}>
      {options.map((o, i) => (
        <option key={o} value={o}>
          {i === 0 ? `${label}: ${allLabel}` : o}
        </option>
      ))}
    </select>
  );
}

/** Single-line filter row — wraps on narrow screens, as in the executive. */
export default function ExecFilterRow({ filters, onReset, dirty }: {
  filters: { label: string; value: string; onChange: (v: string) => void; options: string[]; allLabel?: string }[];
  onReset?: () => void;
  dirty?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      {filters.map((f) => (
        <ExecSelect key={f.label} label={f.label} value={f.value} onChange={f.onChange}
          options={f.options} allLabel={f.allLabel} />
      ))}
      {dirty && onReset && (
        <button onClick={onReset}
          style={{ ...EXEC_SELECT_STYLE, fontWeight: 600, color: "#6B7280" }}>
          Reset
        </button>
      )}
    </div>
  );
}
