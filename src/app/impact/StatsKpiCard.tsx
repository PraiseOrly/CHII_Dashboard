"use client";
import { useState, useEffect, type ComponentType } from "react";

function useCountUp(target: number, duration = 1000): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const id = requestAnimationFrame(function tick(now) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    });
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

interface Props {
  label: string;
  num: number;
  displayFmt?: (n: number) => string;
  sub: string;
  fill?: string;
  lbl?: string;
  numColor?: string;
  border?: string;
  Icon: ComponentType<any>;
  tooltip: string;
}

export default function StatsKpiCard({
  label,
  num,
  displayFmt = (n) => Math.round(n).toLocaleString(),
  sub,
  fill = "#14306B",
  lbl = "#B5D4F4",
  numColor = "#FFFFFF",
  border = "none",
  Icon,
  tooltip,
}: Props) {
  const animated = useCountUp(num);
  const [showTip, setShowTip] = useState(false);

  return (
    <div style={{
      backgroundColor: fill,
      border,
      borderRadius: 10,
      padding: "14px 16px",
      textAlign: "center",
      position: "relative",
      overflow: "visible",
    }}>
      {/* Label row: title + inline i tooltip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: lbl }}>
          {label}
        </p>
        <div
          style={{ position: "relative", flexShrink: 0, cursor: "pointer" }}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          <div style={{
            width: 11, height: 11, borderRadius: "50%",
            backgroundColor: `${lbl}2E`,
            border: `1px solid ${lbl}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, fontWeight: 800, color: lbl,
            lineHeight: 1, userSelect: "none",
          }}>i</div>

          {showTip && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              color: "#14306B",
              fontSize: 10.5,
              lineHeight: 1.55,
              padding: "9px 12px",
              borderRadius: 7,
              width: 200,
              boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
              zIndex: 100,
              textAlign: "left",
              pointerEvents: "none",
            }}>
              <div style={{
                position: "absolute", top: -4, left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: 8, height: 8,
                backgroundColor: "white",
              }} />
              {tooltip}
              {sub && (
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(4,44,83,0.12)", color: "#185FA5" }}>
                  {sub}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animated number + Icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Icon size={22} style={{ color: lbl, flexShrink: 0, opacity: 0.8 }} />
        <p style={{ fontSize: 24, fontWeight: 700, color: numColor, lineHeight: 1 }}>
          {displayFmt(animated)}
        </p>
      </div>
    </div>
  );
}
