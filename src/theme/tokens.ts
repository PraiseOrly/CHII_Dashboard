// Design tokens — the single source of truth for colour, chart chrome and type.
// Nothing in the app should hard-code a hex value; import from here instead.

// ─── Executive palette (the canonical CHII scale) ────────────────────────────
export const COLORS = {
  // Blue
  blue50:  "#E6F1FB",
  blue200: "#85B7EB",
  blue400: "#378ADD",
  blue500: "#2F5FD1",
  blue600: "#185FA5",
  blue800: "#0C447C",
  blue900: "#14306B",
  navy:    "#102C5E",

  // Teal
  teal50:  "#E1F5EE",
  teal400: "#1D9E75",
  teal600: "#0F6E56",
  teal800: "#085041",

  // Green (HENT)
  green100: "#BBD59B",
  green300: "#A6C13C",
  green400: "#40916C",
  green500: "#1F9E9E",
  green600: "#2D6A4F",
  green800: "#1B4332",
  green900: "#0E4633",

  // Accent
  amber:   "#BA7517",
  indigo:  "#534AB7",
  indigo400: "#7F77DD",
  orange:  "#D45F2C",
  pink:    "#D17A86", // the executive card-header pip
  skyBlue: "#479BD6",

  // Neutrals
  ink:      "#111827",
  text:     "#374151",
  textMuted:"#6B7280",
  textFaint:"#9CA3AF",
  gray:     "#5F5E5A",
  border:   "#E5E7EB",
  surface:  "#FFFFFF",
  pageBg:   "#F8F9FA",
} as const;

// ─── Semantic status colours — never used as a chart series ──────────────────
export const STATUS = {
  good:    "#16A34A",
  ok:      "#84CC16",
  warn:    "#F59E0B",
  bad:     "#DC2626",
} as const;

/** Red → amber → green against a benchmark. */
export function benchColor(pct: number, benchmark: number): string {
  const ratio = benchmark > 0 ? pct / benchmark : 1;
  if (ratio >= 1)    return STATUS.good;
  if (ratio >= 0.95) return STATUS.ok;
  if (ratio >= 0.8)  return STATUS.warn;
  return STATUS.bad;
}

// ─── Chart chrome — identical across every chart in the app ──────────────────
export const CHART = {
  gridStroke:  "rgba(0,33,71,0.06)",
  cardBorder:  "1px solid rgba(0,33,71,0.08)",
  axisTick:    { fontSize: 11, fill: COLORS.textMuted },
  tipCursor:   { fill: "rgba(0,33,71,0.04)" },
  barRadius:   [4, 4, 0, 0] as [number, number, number, number],
  barRadiusH:  [0, 4, 4, 0] as [number, number, number, number],
  lineWidth:   2.5,
  dotRadius:   4,
  activeDotRadius: 6,
} as const;

// ─── Type scale ──────────────────────────────────────────────────────────────
export const TYPE = {
  cardTitle:    { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" },
  sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" },
  kpiLabel:     { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  kpiValue:     { fontSize: 24, fontWeight: 700, lineHeight: 1 },
  body:         { fontSize: 11 },
  caption:      { fontSize: 10 },
} as const;
