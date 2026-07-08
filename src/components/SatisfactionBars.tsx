"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from "recharts";
import { PALETTE } from "@/styles/palette";
import type { RadarSeries } from "./SatisfactionRadar";

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(14,70,51,0.12)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <p style={{ fontWeight: 700, color: PALETTE.text, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: "#6B7280", display: "flex", alignItems: "center", gap: 5, margin: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color || p.fill, display: "inline-block" }} />
          {p.name}: <b style={{ color: PALETTE.text }}>{Number(p.value).toFixed(1)}</b>
        </p>
      ))}
    </div>
  );
}

// Grouped horizontal bars — one group per dimension, one bar per programme.
export default function SatisfactionBars({
  dimensions, series, target = 4.5, height = 320,
}: {
  dimensions: readonly string[];
  series: RadarSeries[];
  target?: number;
  height?: number;
}) {
  const data = dimensions.map(dim => {
    const row: Record<string, number | string> = { dimension: dim };
    series.forEach(s => { row[s.name] = s.values[dim]; });
    return row;
  });

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" barCategoryGap="26%" barGap={2}
          margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" horizontal={false} />
          <XAxis type="number" domain={[3, 5]} ticks={[3, 3.5, 4, 4.5, 5]}
            tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="dimension" width={92}
            tick={{ fontSize: 12, fill: PALETTE.mutedText }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: "rgba(0,33,71,0.04)" }} />
          {series.map(s => (
            <Bar key={s.name} dataKey={s.name} name={s.name} fill={s.color} radius={[0, 3, 3, 0]} maxBarSize={12}>
              {data.map((_, i) => <Cell key={i} fill={s.color} />)}
            </Bar>
          ))}
          {/* target reference line for context — drawn on top of the bars */}
          <ReferenceLine x={target} stroke="#111827" strokeWidth={2} strokeDasharray="4 3" ifOverflow="extendDomain"
            label={{ value: `target ${target}`, position: "insideTopRight", fontSize: 9.5, fontWeight: 700, fill: "#111827" }} />
        </BarChart>
      </ResponsiveContainer>

      {/* Bottom legend: dot swatch + name + AVG (mono) */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-3 pt-3 border-t"
        style={{ borderColor: PALETTE.border }}>
        {series.map(s => (
          <span key={s.name} className="flex items-center gap-2" style={{ fontSize: 12, color: PALETTE.mutedText }}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, backgroundColor: s.color }} />
            {s.name}
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 600, color: PALETTE.text }}>{s.avg.toFixed(1)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
