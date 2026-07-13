"use client";

import { PALETTE } from "@/styles/palette";

// Single completion ring with a target tick + delta chip.
// target defaults to 90 (TODO: wire real target from API when available).
export default function ProgressRing({
  value, color, label, target = 90, size = 90, stroke = 8,
}: {
  value: number;
  color: string;
  label: string;
  target?: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  const filled = Math.max(0, Math.min(1, value / 100));

  // target tick position (angle from top, clockwise)
  const tAng = (target / 100) * 2 * Math.PI - Math.PI / 2;
  const t1 = { x: cx + (r - stroke / 2 - 1) * Math.cos(tAng), y: cy + (r - stroke / 2 - 1) * Math.sin(tAng) };
  const t2 = { x: cx + (r + stroke / 2 + 1) * Math.cos(tAng), y: cy + (r + stroke / 2 + 1) * Math.sin(tAng) };

  const delta = Math.round(value - target);
  const atTarget = delta >= 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={PALETTE.gridLine} strokeWidth={stroke} />
        {/* filled arc, from top clockwise */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${c * filled} ${c}`}
          transform={`rotate(-90 ${cx} ${cy})`} />
        {/* target tick */}
        <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke="#111827" strokeWidth={2} />
        {/* centered percentage */}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fontSize={18} fontWeight={600} fill="#111827">{Math.round(value)}%</text>
      </svg>
      <p style={{ fontSize: 11, color: PALETTE.mutedText, marginTop: 8 }}>{label}</p>
      <p style={{ fontSize: 11, fontWeight: 600, marginTop: 2, color: atTarget ? PALETTE.successGreen : PALETTE.amber }}>
        {atTarget ? "+" : "−"}{Math.abs(delta)} vs target
      </p>
    </div>
  );
}
