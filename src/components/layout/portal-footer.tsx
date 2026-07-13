"use client";
// One footer for every portal. Replaces HentFooter / HempFooter / HecoFooter,
// which were identical apart from a colour and a source label.

import { getPortalTheme, type Portal } from "@/theme/portals";

export default function PortalFooter({
  portal,
  source,
  synced = "04 Jun 2026, EAT",
}: {
  portal: Portal;
  source: string;
  synced?: string;
}) {
  const theme = getPortalTheme(portal);
  const heroRgb = portal === "hent" ? "14,70,51" : "16,44,94";

  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: theme.hero, minHeight: 116, display: "flex", alignItems: "center" }}>
      {/* Faint triangle pattern */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

      {/* Edge artwork */}
      <img src="/images/design1.png" alt="" aria-hidden="true"
        style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
      <img src="/images/design2.png" alt="" aria-hidden="true"
        style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

      {/* Centre overlay keeps the text area solid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: `linear-gradient(90deg, rgba(${heroRgb},0) 0%, ${theme.hero} 34%, ${theme.hero} 66%, rgba(${heroRgb},0) 100%)` }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
        <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>
          Africa&apos;s Oasis for Health &amp; Education Transformation
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: theme.heroText }}>
            <span style={{ color: theme.heroAccent, fontWeight: 600 }}>Data Last Synced:</span> {synced}
          </span>
          <span style={{ fontSize: 11, color: theme.heroText, opacity: 0.6 }}>|</span>
          <span style={{ fontSize: 11, color: theme.heroText }}>
            <span style={{ color: theme.heroAccent, fontWeight: 600 }}>Source:</span> {source}
          </span>
          <span style={{ fontSize: 11, color: theme.heroText, opacity: 0.6 }}>|</span>
          <a href="mailto:insights@chii.org"
            style={{ fontSize: 11, fontWeight: 600, color: "white", border: `1px solid ${theme.heroAccent}66`, borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>
            Contact Analyst
          </a>
        </div>
      </div>
    </div>
  );
}
