"use client";
// Binds the shared primitives to one portal's theme.
//
// A portal barrel (e.g. `components/ui/hent`) calls this once, and its pages then
// import ChartCard / SectionHeader / … with the portal's colours already applied —
// no accent props at the call site, and no PortalThemeProvider to wire up.
//
// Note the barrels deliberately IGNORE any `accent` a caller passes to ChartCard
// and SectionHeader. Pages historically passed `accent={SKY}` to their local
// ChartCard, which ignored it and always rendered the portal brand colour.
// Honouring it now would silently recolour ~60 card headers, so we preserve the
// existing behaviour and let those redundant props stay harmless.

import { getPortalTheme, type Portal } from "@/theme/portals";
import {
  ChartCard as BaseChartCard,
  SectionHeader as BaseSectionHeader,
  InfoDot as BaseInfoDot,
  Funnel as BaseFunnel,
  ChartTip as BaseChartTip,
  StatCard as BaseStatCard,
} from ".";

export function createPortalUi(portal: Portal) {
  const theme = getPortalTheme(portal);

  /** White card with the portal's brand header. Right-click downloads it. */
  function ChartCard(props: React.ComponentProps<typeof BaseChartCard>) {
    const { accent: _ignored, ...rest } = props;
    return <BaseChartCard {...rest} accent={theme.brand} />;
  }

  /** Section rule + uppercase title, in the portal's section colour. */
  function SectionHeader(props: React.ComponentProps<typeof BaseSectionHeader>) {
    const { accent: _ignored, ...rest } = props;
    return <BaseSectionHeader {...rest} accent={theme.section} />;
  }

  /** Hover "i" badge. An explicit `color` still wins (cards pass white). */
  function InfoDot(props: React.ComponentProps<typeof BaseInfoDot>) {
    return <BaseInfoDot {...props} color={props.color ?? theme.brand} />;
  }

  /** Conversion funnel. An explicit `accent` wins — funnels are often colour-coded. */
  function Funnel(props: React.ComponentProps<typeof BaseFunnel>) {
    return <BaseFunnel {...props} accent={props.accent ?? theme.deep} />;
  }

  /** Recharts tooltip in the portal's deep tone. */
  function ChartTip(props: any) {
    return <BaseChartTip {...props} accent={props.accent ?? theme.deep} />;
  }

  /** Filled KPI tile in the portal's brand colour. */
  function StatCard(props: React.ComponentProps<typeof BaseStatCard>) {
    return <BaseStatCard {...props} fill={props.fill ?? theme.brand} />;
  }

  return { theme, ChartCard, SectionHeader, InfoDot, Funnel, ChartTip, StatCard };
}
