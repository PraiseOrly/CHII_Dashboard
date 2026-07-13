"use client";

// Executive-style filter controls, ported from the Impact dashboard.
//   HeaderDropdown — compact select, sits on a coloured (dark) bar
//   ExecFilterBar  — the coloured bar itself, holding a row of dropdowns
//   SegTab         — segmented tabs for white card bodies / section switching
//   PillGroup      — pill segmented control for coloured (dark) card headers
// `accent` lets each portal theme them: navy #14306B (HEMP/Impact), green #2D6A4F (HENT).

const DEFAULT_ACCENT = "#14306B";

export function HeaderDropdown({ label, value, onChange, options }: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-1.5">
      {label && (
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.6)" }}>
          {label}
        </span>
      )}
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

// Segmented tabs — for white card bodies and section switching.
export function SegTab<T extends string>({ options, value, onChange, accent = DEFAULT_ACCENT }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  accent?: string;
}) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[10px] font-semibold px-3 py-1.5 transition-all whitespace-nowrap border-r border-gray-200 last:border-0"
            style={{ backgroundColor: active ? accent : "white", color: active ? "white" : "#6B7280" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// Pill group — sits inside coloured (dark) card headers.
export function PillGroup<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full gap-px p-0.5" style={{ backgroundColor: "rgba(0,0,0,0.18)" }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[9px] font-bold px-2.5 py-[3px] rounded-full transition-all whitespace-nowrap leading-none"
            style={{
              backgroundColor: active ? "rgba(255,255,255,0.95)" : "transparent",
              color: active ? "#111827" : "rgba(255,255,255,0.72)",
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ExecFilterBar({ filters, onReset, dirty, accent = DEFAULT_ACCENT, children }: {
  filters: { label: string; value: string; onChange: (v: string) => void; options: string[] }[];
  onReset?: () => void;
  dirty?: boolean;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2"
      style={{ backgroundColor: accent, borderRadius: 10, padding: "11px 20px" }}>
      <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
      <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>
        Filters
      </p>
      {filters.map((f) => (
        <HeaderDropdown key={f.label} label={f.label} value={f.value} onChange={f.onChange} options={f.options} />
      ))}
      {children}
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
