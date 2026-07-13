"use client";
// HENT UI barrel — the shared primitives, pre-bound to the HENT theme.
// Pages import from here and never pass an accent.

import { createPortalUi } from "./create-portal-ui";

export const { theme, ChartCard, SectionHeader, InfoDot, Funnel, ChartTip, StatCard, FilterSelect, InlineFilterSelect } =
  createPortalUi("hent");

// Primitives that need no theming are re-exported so pages have one import site.
export { ChartLegend, BarList, useCountUp } from ".";
