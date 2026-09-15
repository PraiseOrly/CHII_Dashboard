"use client";
import { useState } from "react";
import { Info, type LucideIcon } from "lucide-react";

// Color palette - HENT green
const BRAND = "#2D6A4F";
const BRAND_DK = "#0E4633";
const LIGHT_BORDER = "rgba(14, 70, 51, 0.12)";

export interface HeaderStatCard {
  label: string;
  num: number;
  sub?: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  displayFmt?: (n: number) => string;
  tip?: string;
  pace?: boolean;
  paceA?: number;
  paceT?: number;
}

export interface HeaderStatsPanelProps {
  title: string;
  description?: string;
  cards: HeaderStatCard[];
}

const PACE = 5 / 12;

function paceColor(a: number, t: number): string {
  const pace = PACE;
  const r = t > 0 ? (a / t) / pace : 1;
  if (r >= 1) return "#16A34A";
  if (r >= 0.95) return "#84CC16";
  if (r >= 0.8) return "#F59E0B";
  return "#DC2626";
}

/**
 * HeaderStatsPanel - Standardized header statistics cards for HENT pages
 *
 * Features:
 * - White background cards with green left border
 * - Optional info tooltips on hover
 * - Optional progress bars with pace indicators
 * - Customizable number formatting
 * - Responsive layout (flex with auto-wrap)
 *
 * Props:
 * - title: section title
 * - description: optional section description
 * - cards: array of HeaderStatCard objects with label, num, icon, optional tip/sub/displayFmt
 */
export function HeaderStatsPanel({
  title,
  description,
  cards
}: HeaderStatsPanelProps) {
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);

  return (
    <div>
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 999, backgroundColor: BRAND, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: BRAND_DK, lineHeight: 1.2, margin: 0 }}>
              {title}
            </p>
            {description && <p style={{ fontSize: 11, color: "#6B7280", marginTop: 3, margin: 0 }}>{description}</p>}
          </div>
        </div>
      </div>

      {/* Cards Grid - flex row with auto-wrap and gap */}
      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 24,
      }}>
        {cards.map((card, idx) => (
          <div key={idx} style={{
            flex: "1 1 auto",
            minWidth: 160,
            minHeight: 0,
          }}>
            <div
              style={{
                backgroundColor: "var(--bg-surface, white)",
                borderRadius: 10,
                padding: "14px 16px",
                textAlign: "center",
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                position: "relative",
                overflow: "visible",
                transition: "all 0.2s ease",
                boxShadow: hoveredCardIdx === idx ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
              onMouseEnter={() => setHoveredCardIdx(idx)}
              onMouseLeave={() => setHoveredCardIdx(null)}
            >
              {/* Label with optional tooltip */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: BRAND_DK, margin: 0 }}>
                  {card.label}
                </p>
                {card.tip && (
                  <span style={{ position: "relative", display: "flex", cursor: "pointer" }}>
                    <Info size={12} color={BRAND_DK} opacity={0.5} />
                    {hoveredCardIdx === idx && (
                      <span style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "white",
                        color: BRAND_DK,
                        fontSize: 9,
                        fontWeight: 400,
                        textTransform: "none",
                        letterSpacing: 0,
                        lineHeight: 1.4,
                        padding: "7px 10px",
                        borderRadius: 6,
                        width: 140,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        border: `1px solid ${LIGHT_BORDER}`,
                        zIndex: 100,
                        textAlign: "center",
                        pointerEvents: "none",
                        whiteSpace: "normal",
                      }}>
                        {card.tip}
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Icon + Number */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <card.icon size={18} style={{ color: BRAND_DK, opacity: 0.85, flexShrink: 0 }} />
                <p style={{ fontSize: 24, fontWeight: 700, color: BRAND_DK, lineHeight: 1, margin: 0 }}>
                  {card.displayFmt ? card.displayFmt(card.num) : Math.round(card.num).toLocaleString()}
                </p>
              </div>

              {/* Optional Progress Bar (with pace indicator) */}
              {card.pace && card.paceA !== undefined && card.paceT !== undefined && (
                <div style={{ height: 4, borderRadius: 2, backgroundColor: LIGHT_BORDER, marginTop: 8, position: "relative" }}>
                  <div style={{
                    height: "100%",
                    borderRadius: 2,
                    width: `${Math.min((card.paceA / card.paceT) * 100, 100)}%`,
                    backgroundColor: paceColor(card.paceA, card.paceT)
                  }} />
                  <div style={{ position: "absolute", top: -2, bottom: -2, width: 2, left: `${PACE * 100}%`, backgroundColor: BRAND_DK, borderRadius: 1 }} />
                </div>
              )}

              {/* Optional Sub-text */}
              {card.sub && <p style={{ fontSize: 9.5, color: `rgba(14, 70, 51, 0.55)`, marginTop: 4, margin: 0 }}>{card.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
