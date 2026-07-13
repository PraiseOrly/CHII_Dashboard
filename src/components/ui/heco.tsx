"use client";
// HECO UI barrel — the shared primitives, pre-bound to the HECO theme.
// Pages import from here and never pass an accent.

import { createPortalUi } from "./create-portal-ui";

export const { theme, ChartCard, SectionHeader, InfoDot, Funnel, ChartTip, StatCard } =
  createPortalUi("heco");

// Primitives that need no theming are re-exported so pages have one import site.
export { ChartLegend, BarList, useCountUp } from ".";
