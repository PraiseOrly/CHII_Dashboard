import { Users } from "lucide-react";

/* Featured impact story banner — shared "impact section" used as the
   last section across the executive impact pages. */
export default function FeaturedImpactStory({
  eyebrow = "Featured Graduate",
  name = "Amara Diallo",
  meta = "HEMP · Cohort 2024",
  location = "Nairobi, Kenya",
  quote = "From healthcare worker to health-tech founder in 18 months",
  body = "After completing the HEMP HealthX program, Amara used her clinical experience and newly acquired digital health skills to launch a telemedicine platform serving rural communities in East Africa. Her venture now employs 12 graduates from the same cohort and has served over 4,200 patients.",
  footer = false,
  mission = "Africa's Oasis for Health & Education Transformation",
  dataSynced = "18 June 2026, 16:30 CAT",
  dataSource = "CHII Programs M&E",
  analystEmail = "insights@chii.org",
}: {
  eyebrow?: string;
  name?: string;
  meta?: string;
  location?: string;
  quote?: string;
  body?: string;
  footer?: boolean;
  mission?: string;
  dataSynced?: string;
  dataSource?: string;
  analystEmail?: string;
} = {}) {
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#042C53", backgroundImage: "url('/images/impact.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Readability overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.45), rgba(4,44,83,0.15))", zIndex: 1 }} />

      {/* Content (profile left + story right, centered in blue zone).
          In footer mode the content is kept for layout but hidden, so the banner
          stays the exact same size/shape while showing only the image. */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 22, maxWidth: 500, margin: "0 auto", padding: "13px 20px", visibility: footer ? "hidden" : "visible" }} className="fis-content" aria-hidden={footer}>
        {/* Profile — left */}
        <div style={{ textAlign: "center", flexShrink: 0, width: 130 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "rgba(133,183,235,0.15)", border: "2px solid rgba(133,183,235,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <Users size={22} color="#85B7EB" />
          </div>
          <p style={{ fontSize: 11, color: "#85B7EB", fontWeight: 600 }}>{eyebrow}</p>
          <p style={{ fontSize: 15, color: "white", fontWeight: 700, marginTop: 5 }}>{name}</p>
          <p style={{ fontSize: 10, color: "#B5D4F4", marginTop: 3, lineHeight: 1.5 }}>{meta}<br />{location}</p>
        </div>

        {/* Divider */}
        <div style={{ width: 1, alignSelf: "stretch", background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent)", flexShrink: 0 }} className="fis-divider" />

        {/* Story — right */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#85B7EB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Impact Story</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 8 }}>
            &ldquo;{quote}&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "#B5D4F4", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{body}</p>
        </div>
      </div>

      {/* Footer mode — executive footer centered in the blue zone, adapted to
          the CHII impact dashboard: mission anchor, data authority & support. */}
      {footer && (
        <div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "0 24px" }}>
          {/* Strategic anchor — mission */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>{mission}</span>
          </div>

          {/* Data authority & support */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#B5D4F4" }}>
              <span style={{ color: "#85B7EB", fontWeight: 600 }}>Data Last Synced:</span> {dataSynced}
            </span>
            <span style={{ fontSize: 11, color: "rgba(133,183,235,0.55)" }}>|</span>
            <span style={{ fontSize: 11, color: "#B5D4F4" }}>
              <span style={{ color: "#85B7EB", fontWeight: 600 }}>Source:</span> {dataSource}
            </span>
            <span style={{ fontSize: 11, color: "rgba(133,183,235,0.55)" }}>|</span>
            <a href={`mailto:${analystEmail}`} style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(133,183,235,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>
              Contact Analyst
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
