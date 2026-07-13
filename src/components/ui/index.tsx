"use client";
// Shared, portal-agnostic UI primitives.
//
// These were previously copy-pasted into every page file (ChartCard in 17,
// SecHeader in 18, useCountUp in 16, …). They now live here once and take an
// `accent` colour so each portal can theme them.

import { createContext, useContext, useEffect, useRef, useState, type ComponentType } from "react";
import { CHART, COLORS, TYPE } from "@/theme/tokens";
import { getPortalTheme, type Portal, type PortalTheme } from "@/theme/portals";

// ─── Portal theme context ────────────────────────────────────────────────────
// A page declares its portal once; every primitive below then picks up the right
// colours automatically, so call sites never pass an accent.

const PortalThemeContext = createContext<PortalTheme>(getPortalTheme("impact"));

export function PortalThemeProvider({ portal, children }: { portal: Portal; children: React.ReactNode }) {
  return (
    <PortalThemeContext.Provider value={getPortalTheme(portal)}>
      {children}
    </PortalThemeContext.Provider>
  );
}

export function usePortalTheme(): PortalTheme {
  return useContext(PortalThemeContext);
}

const DEFAULT_ACCENT = COLORS.blue900;

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Eases a number up from 0 on mount. */
export function useCountUp(target: number, duration = 750): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start: number | null = null;
    function tick(now: number) {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(target);
    }
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return value;
}

// ─── InfoDot ─────────────────────────────────────────────────────────────────

/** Small "i" badge that reveals an explanation on hover. */
export function InfoDot({ tip, color }: { tip: string; color?: string }) {
  const theme = usePortalTheme();
  const accent = color ?? theme.brand;
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: `${accent}22`, border: `1px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: accent, lineHeight: 1, userSelect: "none" }}>i</span>
      {open && (
        <span style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", backgroundColor: COLORS.surface, color: COLORS.ink, fontSize: 10.5, lineHeight: 1.55, padding: "9px 12px", borderRadius: 7, width: 200, boxShadow: "0 6px 20px rgba(0,0,0,0.22)", zIndex: 100, textAlign: "left", pointerEvents: "none", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
          {tip}
        </span>
      )}
    </span>
  );
}

// ─── SectionHeader ───────────────────────────────────────────────────────────

/** The rule + uppercase title that opens each dashboard section. */
export function SectionHeader({ title, sub, accent }: {
  title: string; sub?: string; accent?: string;
}) {
  const theme = usePortalTheme();
  const color = accent ?? theme.section;
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div>
        <p style={{ ...TYPE.sectionTitle, color }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

// ─── ChartCard ───────────────────────────────────────────────────────────────

/** White card with a coloured header. Right-click downloads it as a PNG. */
export function ChartCard({ title, sub, info, accent, headerRight, children }: {
  title: string;
  sub?: string;
  info?: string;
  accent?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  const theme = usePortalTheme();
  const headerColor = accent ?? theme.brand;
  const cardRef = useRef<HTMLDivElement>(null);

  async function download() {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const link = document.createElement("a");
    link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <div
      ref={cardRef}
      onContextMenu={(e) => { e.preventDefault(); download(); }}
      title="Right-click to download this chart"
      className="overflow-hidden"
      style={{ backgroundColor: COLORS.surface, borderRadius: 10, border: CHART.cardBorder }}
    >
      <div className="flex items-center gap-2.5" style={{ backgroundColor: headerColor, padding: "12px 20px" }}>
        <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: COLORS.pink }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p style={{ ...TYPE.cardTitle, color: "white", lineHeight: 1 }}>{title}</p>
            {(info || sub) && <InfoDot tip={(info || sub)!} color="#FFFFFF" />}
          </div>
          {sub && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</p>}
        </div>
        {headerRight}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

/** Filled KPI tile — the executive dashboard's stat card. */
export function StatCard({
  label, value, displayFmt = (n) => Math.round(n).toLocaleString(), sub, tooltip,
  icon: Icon, fill = DEFAULT_ACCENT, labelColor = "#B5D4F4",
}: {
  label: string;
  value: number;
  displayFmt?: (n: number) => string;
  sub?: string;
  tooltip?: string;
  icon?: ComponentType<any>;
  fill?: string;
  labelColor?: string;
}) {
  const animated = useCountUp(value);
  return (
    <div style={{ backgroundColor: fill, borderRadius: 10, padding: "14px 16px", textAlign: "center", position: "relative", overflow: "visible" }}>
      <div className="flex items-center justify-center gap-1" style={{ marginBottom: 8 }}>
        <p style={{ ...TYPE.kpiLabel, color: labelColor }}>{label}</p>
        {tooltip && <InfoDot tip={tooltip} color={labelColor} />}
      </div>
      <div className="flex items-center justify-center gap-2.5">
        {Icon && <Icon size={22} style={{ color: labelColor, flexShrink: 0, opacity: 0.8 }} />}
        <p style={{ ...TYPE.kpiValue, color: "white" }}>{displayFmt(animated)}</p>
      </div>
      {sub && <p style={{ fontSize: 9.5, color: labelColor, opacity: 0.75, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

// ─── Funnel ──────────────────────────────────────────────────────────────────

/** Stacked conversion funnel. Bars are scaled against the largest step, so
 *  steps measured in different units still produce a readable shape. */
export function Funnel({ steps, accent, showConversion = true }: {
  steps: { label: string; value: number }[];
  accent?: string;
  showConversion?: boolean;
}) {
  const theme = usePortalTheme();
  const color = accent ?? theme.deep;
  const max = Math.max(...steps.map(s => s.value), 1);
  return (
    <div className="space-y-2.5">
      {steps.map((step, i) => {
        const width = Math.max(6, Math.round((step.value / max) * 100));
        const conversion = showConversion && i > 0 && steps[i - 1].value > 0
          ? Math.round((step.value / steps[i - 1].value) * 100)
          : null;
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-gray-700">{step.label}</span>
              <span className="font-bold tabular-nums" style={{ color }}>
                {step.value.toLocaleString()}
                {conversion !== null && <span className="text-gray-400 font-medium"> · {conversion}%</span>}
              </span>
            </div>
            <div className="h-6 rounded-sm overflow-hidden" style={{ backgroundColor: `${color}14` }}>
              <div className="h-full rounded-sm" style={{ width: `${width}%`, backgroundColor: color, opacity: 1 - i * 0.13 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── BarList ─────────────────────────────────────────────────────────────────

/** Horizontal bar list — one colour per row. */
export function BarList({ data, colors, labelWidth = 96, formatValue = (n: number) => String(n) }: {
  data: { name: string; value: number }[];
  colors: readonly string[];
  labelWidth?: number;
  formatValue?: (n: number) => string;
}) {
  const max = data[0]?.value ?? 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((row, i) => {
        const color = colors[i % colors.length];
        return (
          <div key={row.name} className="flex items-center gap-2.5">
            <div className="text-[11px] text-gray-600 text-right flex-shrink-0 truncate" style={{ width: labelWidth }}>
              {row.name}
            </div>
            <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 18, backgroundColor: `${color}1A` }}>
              <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, backgroundColor: color }} />
            </div>
            <div className="text-[11px] font-bold flex-shrink-0 tabular-nums text-right" style={{ color, minWidth: 28 }}>
              {formatValue(row.value)}
            </div>
          </div>
        );
      })}
      {!data.length && <p className="text-[11px] text-gray-400 text-center py-6">No records match the selected filters.</p>}
    </div>
  );
}

// ─── Chart tooltip + legend ──────────────────────────────────────────────────

/** Recharts tooltip: white card, a colour swatch per series, accented figures. */
export function ChartTip({ active, payload, label, hideLabel, unit, accent = DEFAULT_ACCENT }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: COLORS.surface, border: "1px solid rgba(0,33,71,0.12)", borderRadius: 6, padding: "8px 11px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {!hideLabel && label != null && (
        <p style={{ fontWeight: 700, color: accent, marginBottom: 4 }}>{label}</p>
      )}
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 5, margin: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: entry.color || entry.fill || entry.stroke, display: "inline-block" }} />
          {entry.name}:{" "}
          <b style={{ color: accent }}>
            {typeof entry.value === "number" ? Math.round(entry.value).toLocaleString() : entry.value}{unit || ""}
          </b>
        </p>
      ))}
    </div>
  );
}

/** Centred swatch row beneath a chart. */
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
