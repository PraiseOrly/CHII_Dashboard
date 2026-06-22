"use client";

import { useEffect, useRef, useState } from "react";
import {
  PieChart, Pie, Cell, Sector, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ════════════════════════════════════════════════════════
   DonutChart — interactive ring chart
   • card wrapper (white body + coloured header bar + badge)
   • centre total (counts up in sync with the load sweep)
   • clockwise draw-on-load from 12 o'clock (runs once)
   • hover: active slice brightens + pops out, others dim
   • leader labels + horizontal legend + share tooltip
═══════════════════════════════════════════════════════ */

export interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  segments: DonutSegment[];
  /** label shown under the centre total */
  totalLabel?: string;
  /** optional override for the centre number (defaults to the sum of values) */
  total?: number;
  /** optional badge shown on the right of the header bar */
  badge?: string;
  /** header bar colour */
  headerColor?: string;
  /** chart height in px */
  height?: number;
  /** load-sweep duration in ms (800–1200 recommended) */
  duration?: number;
}

const NAVY = "#042C53";

/* count-up hook — eases 0 → target once, in sync with the sweep */
function useCountUp(target: number, duration: number, run: boolean): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, run]);
  return val;
}

/* active-slice renderer: same wedge nudged outward for a radial pop-out */
function ActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 7}
        startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={2} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 9} outerRadius={outerRadius + 11}
        startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.35} />
    </g>
  );
}

export default function DonutChart({
  title, segments, totalLabel = "Total", total, badge,
  headerColor = "#0C447C", height = 280, duration = 1000,
}: Props) {
  const sum = total ?? segments.reduce((s, d) => s + d.value, 0);
  const [active, setActive] = useState<number | null>(null);
  const [animating, setAnimating] = useState(true);
  const startedRef = useRef(false);

  /* run the load animation exactly once */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const t = setTimeout(() => setAnimating(false), duration + 80);
    return () => clearTimeout(t);
  }, [duration]);

  const centre = useCountUp(sum, duration, true);

  /* leader label pointing outward from each slice */
  const renderLabel = ({ cx, cy, midAngle, outerRadius, name }: any) => {
    const RAD = Math.PI / 180;
    const r = outerRadius + 16;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="#374151" fontSize={10.5} fontWeight={600}
        textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">{name}</text>
    );
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
      {/* header bar */}
      <div style={{ backgroundColor: headerColor, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2 }}>{title}</p>
        </div>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 700, color: "white", backgroundColor: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "3px 9px", flexShrink: 0 }}>{badge}</span>
        )}
      </div>

      {/* chart body */}
      <div style={{ padding: "14px 18px 16px" }}>
        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="80%"
                paddingAngle={1.5}
                stroke="none"
                /* draw clockwise from 12 o'clock */
                startAngle={90}
                endAngle={-270}
                isAnimationActive={animating}
                animationBegin={0}
                animationDuration={duration}
                animationEasing="ease-out"
                activeIndex={active ?? undefined}
                activeShape={ActiveShape}
                label={renderLabel}
                labelLine={{ stroke: "rgba(0,33,71,0.25)" }}
                onMouseEnter={(_: any, i: number) => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="donut-pie"
              >
                {segments.map((d, i) => (
                  <Cell key={d.name} fill={d.color}
                    fillOpacity={active == null ? 1 : i === active ? 1 : 0.4} />
                ))}
              </Pie>
              <Tooltip content={<ShareTip total={sum} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* centre total */}
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{Math.round(centre).toLocaleString()}</p>
            <p style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 3 }}>{totalLabel}</p>
          </div>
        </div>

        {/* legend */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", marginTop: 10 }}>
          {segments.map((d, i) => (
            <button key={d.name} type="button"
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0,
                opacity: active == null || active === i ? 1 : 0.45, transition: "opacity 180ms ease" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>{d.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* smooth hover transitions on the SVG sectors */}
      <style>{`
        .donut-pie .recharts-sector { transition: fill-opacity 180ms ease; }
      `}</style>
    </div>
  );
}

/* tooltip: name + raw value + % share of the total */
function ShareTip({ active, payload, total }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const pct = total ? Math.round((p.value / total) * 100) : 0;
  const swatch = p.payload?.color || p.color || p.payload?.fill || "#9CA3AF";
  return (
    <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
      <p style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280" }}>
        <span style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: swatch, display: "inline-block" }} />
        <b style={{ color: NAVY }}>{p.name}</b>
      </p>
      <p style={{ color: "#6B7280", marginTop: 3 }}>
        <b style={{ color: NAVY, fontSize: 13 }}>{Number(p.value).toLocaleString()}</b>
        <span style={{ marginLeft: 6, color: "#9CA3AF" }}>{pct}% of total</span>
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   DonutRing — card-less variant for dropping inside existing
   Panels. Same behaviour (draw-on-load once, hover dim + pop-out,
   share tooltip, centre total), with the legend below.
═══════════════════════════════════════════════════════ */
export function DonutRing({
  data, colors, total, totalLabel, height = 230, labels = false,
  innerRadius = 56, outerRadius = 86, labelOffset = 14,
}: {
  data: { name: string; value: number }[];
  colors: Record<string, string> | string[];
  total: number; totalLabel: string;
  height?: number; labels?: boolean; innerRadius?: number; outerRadius?: number;
  /** how far leader labels (and their lines) extend past the ring */
  labelOffset?: number;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [firstRun, setFirstRun] = useState(true);
  useEffect(() => { const t = setTimeout(() => setFirstRun(false), 1080); return () => clearTimeout(t); }, []);
  const counted = useCountUp(total, 1000, firstRun);
  const centre = firstRun ? counted : total;
  const colorFor = (name: string, i: number) => Array.isArray(colors) ? colors[i % colors.length] : colors[name];

  const renderLabel = labels
    ? ({ cx, cy, midAngle, outerRadius: or, name }: any) => {
        const RAD = Math.PI / 180;
        const r = or + labelOffset;
        const x = cx + r * Math.cos(-midAngle * RAD);
        const y = cy + r * Math.sin(-midAngle * RAD);
        return (
          <text x={x} y={y} fill="#374151" fontSize={10} fontWeight={600}
            textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">{name}</text>
        );
      }
    : undefined;

  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="48%"
            innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} stroke="none"
            startAngle={90} endAngle={-270}
            isAnimationActive={firstRun} animationBegin={0} animationDuration={1000} animationEasing="ease-out"
            activeIndex={active ?? undefined} activeShape={ActiveShape}
            label={renderLabel} labelLine={labels ? { stroke: "rgba(0,33,71,0.25)" } : false}
            onMouseEnter={(_: any, i: number) => setActive(i)} onMouseLeave={() => setActive(null)}
            className="donut-pie">
            {data.map((d, i) => (
              <Cell key={d.name} fill={colorFor(d.name, i)}
                fillOpacity={active == null ? 1 : i === active ? 1 : 0.4} />
            ))}
          </Pie>
          <Tooltip content={<ShareTip total={total} />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", top: "40%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{Math.round(centre).toLocaleString()}</p>
        <p style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{totalLabel}</p>
      </div>
      <style>{`.donut-pie .recharts-sector { transition: fill-opacity 180ms ease; }`}</style>
    </div>
  );
}
