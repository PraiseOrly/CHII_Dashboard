"use client";

// Shared HEMP chart primitives, matching the Executive dashboard's chart design:
// navy-tinted grid, muted axis ticks, a white tooltip with a colour swatch per
// series, and a centred legend under the plot.

const TIP_NAVY = "#0C447C";

function tipFmt(n: number) { return Math.round(n).toLocaleString(); }

/** Executive-style tooltip. */
export function ChartTip({ active, payload, label, hideLabel, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(20,48,107,0.12)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {!hideLabel && label != null && (
        <p style={{ fontWeight: 700, color: TIP_NAVY, marginBottom: 4 }}>{label}</p>
      )}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5, margin: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill || p.stroke, display: "inline-block" }} />
          {p.name}: <b style={{ color: TIP_NAVY }}>{typeof p.value === "number" ? tipFmt(p.value) : p.value}{unit || ""}</b>
        </p>
      ))}
    </div>
  );
}

/** Executive-style legend: centred swatch row under the chart, above a hairline. */
export function ChartLegend({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100">
      {items.map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

export const GRID_STROKE = "rgba(0,33,71,0.06)";
export const AXIS_TICK = { fontSize: 11, fill: "#6B7280" } as const;
export const TIP_CURSOR = { fill: "rgba(0,33,71,0.04)" } as const;
