"use client";

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { PALETTE } from "@/styles/palette";

export interface RadarSeries {
  name: string;
  color: string;
  dashed?: boolean;
  fillOpacity?: number;
  values: Record<string, number>;
  avg: number;
}

export default function SatisfactionRadar({
  dimensions, series, height = 340,
}: {
  dimensions: readonly string[];
  series: RadarSeries[];
  height?: number;
}) {
  // Recharts wants one row per axis with a key per series
  const data = dimensions.map(dim => {
    const row: Record<string, number | string> = { dimension: dim };
    series.forEach(s => { row[s.name] = s.values[dim]; });
    return row;
  });

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius="72%" margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          {/* Concentric rings — outer ring darker than inner rings */}
          <PolarGrid gridType="polygon" stroke={PALETTE.gridLine} />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: PALETTE.mutedText, fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6}
            tick={{ fill: PALETTE.neutralGray, fontSize: 10 }} axisLine={false}
            tickFormatter={(v: number) => (v >= 4 ? String(v) : "")} />
          {series.map(s => (
            <Radar key={s.name} name={s.name} dataKey={s.name}
              stroke={s.color} strokeWidth={2}
              strokeDasharray={s.dashed ? "5 4" : undefined}
              fill={s.color} fillOpacity={s.fillOpacity ?? 0.08}
              dot={{ r: 3, fill: s.color, strokeWidth: 0 }} isAnimationActive={false} />
          ))}
        </RadarChart>
      </ResponsiveContainer>

      {/* Bottom legend: dot + name + AVG (mono) */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-3 pt-3 border-t"
        style={{ borderColor: PALETTE.border }}>
        {series.map(s => (
          <span key={s.name} className="flex items-center gap-2" style={{ fontSize: 12, color: PALETTE.mutedText }}>
            <span style={{ display: "inline-block", width: 14, height: 0, borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.color}` }} />
            {s.name}
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 600, color: PALETTE.text }}>{s.avg.toFixed(1)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
