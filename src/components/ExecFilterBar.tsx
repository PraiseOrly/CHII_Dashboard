"use client";

// Executive-style filter controls.
// Mirrors the dropdowns used inside the Impact dashboard's navy card headers:
// translucent white fill, white text, chevron drawn as an inline SVG background.

export function HeaderDropdown({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-1.5">
      <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.6)" }}>
        {label}
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-[9px] font-bold rounded border appearance-none cursor-pointer focus:outline-none pl-2 pr-5 py-[5px]"
        style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          color: "white",
          borderColor: "rgba(255,255,255,0.25)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-opacity='0.75' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center",
        }}>
        {options.map((o) => (
          <option key={o} value={o} style={{ color: "#111827", backgroundColor: "white" }}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function ExecFilterBar({ filters, onReset, dirty }: {
  filters: { label: string; value: string; onChange: (v: string) => void; options: string[] }[];
  onReset?: () => void;
  dirty?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2"
      style={{ backgroundColor: "#14306B", borderRadius: 10, padding: "11px 20px" }}>
      <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
      <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>
        Filters
      </p>
      {filters.map((f) => (
        <HeaderDropdown key={f.label} label={f.label} value={f.value} onChange={f.onChange} options={f.options} />
      ))}
      {dirty && onReset && (
        <button onClick={onReset}
          className="text-[9px] font-bold uppercase tracking-wide rounded border px-2.5 py-[5px] ml-auto transition-colors"
          style={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.10)" }}>
          Reset
        </button>
      )}
    </div>
  );
}
