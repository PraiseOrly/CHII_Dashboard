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
}: {
  eyebrow?: string;
  name?: string;
  meta?: string;
  location?: string;
  quote?: string;
  body?: string;
} = {}) {
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#042C53", backgroundImage: "url('/images/impact.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Readability overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.45), rgba(4,44,83,0.15))", zIndex: 1 }} />

      {/* Content (profile left + story right, centered in blue zone) */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 28, maxWidth: 660, margin: "0 auto", padding: "30px 24px" }} className="fis-content">
        {/* Profile — left */}
        <div style={{ textAlign: "center", flexShrink: 0, width: 150 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(133,183,235,0.15)", border: "2px solid rgba(133,183,235,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Users size={26} color="#85B7EB" />
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
          <p style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.35, marginBottom: 10 }}>
            &ldquo;{quote}&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "#B5D4F4", lineHeight: 1.6 }}>{body}</p>
        </div>
      </div>
    </div>
  );
}
