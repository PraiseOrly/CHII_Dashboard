// Portal themes — the one place a portal's identity is defined.
// Nav, footer, cards, pills and filters are all driven from this map, so the
// three portals share components and differ only by the theme they're handed.

import { COLORS } from "./tokens";

export const PORTALS = ["hent", "hemp", "heco", "impact"] as const;
export type Portal = typeof PORTALS[number];

export interface PortalTheme {
  /** Page header + footer hero fill. */
  hero: string;
  /** Chart-card headers, pills, filter bars. */
  brand: string;
  /** Section bars and section titles. */
  section: string;
  /** Deep tone for figures and value text. */
  deep: string;
  /** Metadata text on the hero/footer. */
  heroText: string;
  /** Accent for hero/footer metadata labels. */
  heroAccent: string;
  /** Ordered series colours for multi-series charts. */
  series: readonly string[];
  /** Maximally distinct hues for donuts / categorical charts. */
  distinct: readonly string[];
  /** Sequential ramp for country / region lists. */
  ramp: readonly string[];
  /** Choropleth scale: light (low) → deep (high). */
  map: { light: string; deep: string; tooltip: string };
}

const GREEN: PortalTheme = {
  hero:       COLORS.green600,
  brand:      COLORS.green600,
  section:    COLORS.green600,
  deep:       COLORS.green900,
  heroText:   "rgba(190,228,214,0.85)",
  heroAccent: "#7FD0B6",
  series:     [COLORS.green800, COLORS.green500, COLORS.green300, COLORS.green100],
  distinct:   ["#2E7D5B","#E76F51","#2A6F97","#E9C46A","#6A4C93","#E63946","#43AA8B","#F4A261","#577590","#9B5DE5"],
  ramp:       [COLORS.green800, COLORS.green500, COLORS.green300, COLORS.green100, COLORS.green600, "#4C8C8A", "#6B8E5B", "#8FA45A", COLORS.green400, "#C8DDB5"],
  map:        { light: "#C8DDB5", deep: COLORS.green800, tooltip: "#0F4C3A" },
};

const NAVY: PortalTheme = {
  hero:       COLORS.navy,
  brand:      COLORS.blue900,
  section:    COLORS.blue600,
  deep:       COLORS.blue800,
  heroText:   "rgba(181,212,244,0.85)",
  heroAccent: COLORS.blue200,
  series:     [COLORS.navy, COLORS.skyBlue, COLORS.orange],
  distinct:   [COLORS.blue600, COLORS.teal600, COLORS.indigo, COLORS.amber, COLORS.skyBlue, COLORS.teal400, COLORS.indigo400, COLORS.orange, COLORS.blue900, COLORS.teal800],
  ramp:       [COLORS.blue900, COLORS.blue600, COLORS.blue500, COLORS.blue400, COLORS.skyBlue, COLORS.blue200, COLORS.teal600, COLORS.teal400],
  map:        { light: "#C7DFFE", deep: COLORS.blue600, tooltip: "#042C53" },
};

/** HEMP, HECO and the Executive dashboard all use the executive navy. */
export const PORTAL_THEMES: Record<Portal, PortalTheme> = {
  hent:   GREEN,
  hemp:   NAVY,
  heco:   NAVY,
  impact: NAVY,
};

export function getPortalTheme(portal: Portal): PortalTheme {
  return PORTAL_THEMES[portal];
}
