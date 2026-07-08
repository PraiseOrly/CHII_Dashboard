"use client";

import { PALETTE } from "@/styles/palette";

export interface BulletRow {
  name: string;
  value: number;
  color: string;
}

// Qualitative satisfaction bullet chart on a 3.0–5.0 scale.
// target defaults to 4.5 (TODO: wire real target from API when available).
export default function BulletChart({
  rows, target = 4.5, min = 3, max = 5,
}: {
  rows: BulletRow[];
  target?: number;
  min?: number;
  max?: number;
}) {
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const bands: { from: number; to: number; fill: string }[] = [
    { from: 3.5, to: 4.0, fill: "#F1EFE8" },
    { from: 4.0, to: 4.5, fill: "#E1DDD1" },
    { from: 4.5, to: 5.0, fill: "#CFC9B7" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {rows.map(r => (
        <div key={r.name} className="flex items-center gap-3">
          <div style={{ width: 82, fontSize: 11, fontWeight: 500, color: PALETTE.mutedText, flexShrink: 0 }}>{r.name}</div>

          {/* Track with bands + value bar + target tick */}
          <div className="relative flex-1" style={{ height: 14 }}>
            {/* qualitative bands */}
            {bands.map(b => (
              <div key={b.from} className="absolute top-0" style={{
                left: pct(b.from), width: `${((b.to - b.from) / (max - min)) * 100}%`,
                height: 14, backgroundColor: b.fill, borderRadius: 1,
              }} />
            ))}
            {/* value bar (6px, centered) */}
            <div className="absolute" style={{
              left: 0, top: 4, height: 6, width: pct(r.value),
              backgroundColor: r.color, borderRadius: 2,
            }} />
            {/* target tick */}
            <div className="absolute" style={{
              left: pct(target), top: -3, height: 20, width: 2, backgroundColor: "#111827",
            }} />
          </div>

          <div style={{ width: 30, textAlign: "right", fontSize: 12, fontWeight: 700, color: PALETTE.text, flexShrink: 0 }}>{r.value.toFixed(1)}</div>
        </div>
      ))}

      {/* Band legend */}
      <div className="flex items-center gap-3" style={{ paddingLeft: 94, paddingRight: 42 }}>
        <div className="relative flex-1" style={{ height: 14, fontSize: 9.5, color: PALETTE.neutralGray }}>
          <span className="absolute" style={{ left: pct(3.6) }}>Fair</span>
          <span className="absolute" style={{ left: pct(4.1) }}>Good</span>
          <span className="absolute" style={{ left: pct(4.55) }}>Excellent · target {target}</span>
        </div>
        <div style={{ width: 30, flexShrink: 0 }} />
      </div>
    </div>
  );
}
