"use client";

// Shared HENT footer strip — the design used on the HENT Overview.
// Green band, faint triangle pattern, mirrored edge artwork, centre gradient
// overlay, tagline, sync/source metadata and a Contact Analyst button.

export default function HentFooter({
  source = "HENT Programmes M&E",
  synced = "01 Jun 2026, EAT",
}: {
  source?: string;
  synced?: string;
}) {
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#2D6A4F", minHeight: 116, display: "flex", alignItems: "center" }}>

      {/* Faint triangle pattern */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />

      {/* Design elements anchored to the left & right edges */}
      <img src="/images/design1.png" alt="" aria-hidden="true"
        style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
      <img src="/images/design1.png" alt="" aria-hidden="true"
        style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />

      {/* Center overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(14,70,51,0) 0%, #2D6A4F 34%, #2D6A4F 66%, rgba(14,70,51,0) 100%)" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
        <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>
          Africa&apos;s Oasis for Health &amp; Education Transformation
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}>
            <span style={{ color: "#7FD0B6", fontWeight: 600 }}>Data Last Synced:</span> {synced}
          </span>
          <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
          <span style={{ fontSize: 11, color: "rgba(190,228,214,0.85)" }}>
            <span style={{ color: "#7FD0B6", fontWeight: 600 }}>Source:</span> {source}
          </span>
          <span style={{ fontSize: 11, color: "rgba(190,228,214,0.5)" }}>|</span>
          <a href="mailto:insights@chii.org"
            style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(190,228,214,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>
            Contact Analyst
          </a>
        </div>
      </div>
    </div>
  );
}
