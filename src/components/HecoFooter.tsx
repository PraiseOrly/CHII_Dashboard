"use client";

// Shared HECO footer strip — executive navy band, mirrored edge artwork,
// tagline, sync/source metadata and a Contact Analyst button.

export default function HecoFooter({
  source = "HECO Programmes M&E",
  synced = "04 Jun 2026, EAT",
}: {
  source?: string;
  synced?: string;
}) {
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#102C5E", minHeight: 116, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
      <img src="/images/design1.png" alt="" aria-hidden="true"
        style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
      <img src="/images/design2.png" alt="" aria-hidden="true"
        style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
        <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>
          Africa&apos;s Oasis for Health &amp; Education Transformation
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "rgba(181,212,244,0.85)" }}>
            <span style={{ color: "#85B7EB", fontWeight: 600 }}>Data Last Synced:</span> {synced}
          </span>
          <span style={{ fontSize: 11, color: "rgba(181,212,244,0.5)" }}>|</span>
          <span style={{ fontSize: 11, color: "rgba(181,212,244,0.85)" }}>
            <span style={{ color: "#85B7EB", fontWeight: 600 }}>Source:</span> {source}
          </span>
          <span style={{ fontSize: 11, color: "rgba(181,212,244,0.5)" }}>|</span>
          <a href="mailto:insights@chii.org"
            style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(181,212,244,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>
            Contact Analyst
          </a>
        </div>
      </div>
    </div>
  );
}
