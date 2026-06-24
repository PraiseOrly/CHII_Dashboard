"use client";

import { useState, useMemo } from "react";
import { Search, Download, ArrowRight, FileText } from "lucide-react";
import FeaturedImpactStory from "@/components/FeaturedImpactStory";

/* ── palette (matches the rest of the dashboard) ─────── */
const NAVY = "#14306B";
const BAND = "#14306B";
const TICK = "#D17A86";
const ACCENT = "#102C5E";

/* ════════════════════════════════════════════════════════
   TYPES + DATA
═══════════════════════════════════════════════════════ */
type CardState = "default" | "coming" | "new";
type ResourceType = "Annual Reports" | "Key Facts" | "Evaluations";

interface Tag { label: string; kind: "format" | "status"; }
interface ResourceCard {
  eyebrow: string;
  title: string;
  tags: Tag[];
  desc: string;
  href: string;
  state: CardState;
  statusLabel?: string; // for coming-soon button
}
interface Section {
  id: string;
  title: string;
  type: ResourceType;
  range: string;
  cards: ResourceCard[];
}

const fmtTag = (label: string): Tag => ({ label, kind: "format" });
const stTag = (label: string): Tag => ({ label, kind: "status" });

const SECTIONS: Section[] = [
  {
    id: "annual",
    title: "Annual impact reports",
    type: "Annual Reports",
    range: "2022–2025",
    cards: [
      { eyebrow: "ALU Impact Report", title: "2022 Annual Report", tags: [fmtTag("PDF"), fmtTag("English")], desc: "Full-year impact across outreach, employment, and entrepreneurship.", href: "#", state: "default" },
      { eyebrow: "ALU Impact Report", title: "2023 Annual Report", tags: [fmtTag("Google Slides"), fmtTag("Interactive")], desc: "Interactive review of cohort outcomes and programme reach.", href: "#", state: "default" },
      { eyebrow: "ALU Impact Report", title: "2024 Annual Report", tags: [fmtTag("Docsend"), fmtTag("Interactive")], desc: "Latest annual results with sector and geography breakdowns.", href: "#", state: "default" },
      { eyebrow: "ALU Impact Report", title: "2025 Annual Report", tags: [stTag("In Progress"), stTag("Due Q2 2025")], desc: "The 2025 annual report is being compiled and will publish next quarter.", href: "#", state: "coming", statusLabel: "In progress – due Q2 2025" },
      { eyebrow: "ALG Year in Review", title: "2022 Year in Review", tags: [fmtTag("Google Slides")], desc: "Highlights and milestones from the 2022 academic year.", href: "#", state: "default" },
      { eyebrow: "ALG Year in Review", title: "2023 Year in Review", tags: [fmtTag("Google Slides")], desc: "A visual recap of 2023 achievements and alumni stories.", href: "#", state: "default" },
      { eyebrow: "ALG Year in Review", title: "2024 Year in Review", tags: [fmtTag("PDF")], desc: "Year-end summary of programme outcomes and growth.", href: "#", state: "default" },
      { eyebrow: "ALG Year in Review", title: "2025 Year in Review", tags: [fmtTag("PDF"), stTag("New")], desc: "The newest year-in-review, just published with 2025 figures.", href: "#", state: "new" },
    ],
  },
  {
    id: "keyfacts",
    title: "Key facts",
    type: "Key Facts",
    range: "2023–2025",
    cards: [
      { eyebrow: "Key Facts", title: "Key facts 2024", tags: [fmtTag("PDF"), fmtTag("English")], desc: "One-page snapshot of headline impact metrics for 2024.", href: "#", state: "default" },
      { eyebrow: "Key Facts", title: "Key facts 2025", tags: [fmtTag("PDF"), stTag("New")], desc: "Updated at-a-glance metrics for the current year.", href: "#", state: "new" },
      { eyebrow: "Key Facts", title: "Gender & inclusion brief", tags: [fmtTag("PDF")], desc: "Inclusion metrics across cohorts — gender, refugees, and PwD.", href: "#", state: "default" },
      { eyebrow: "Key Facts", title: "Employment fact sheet", tags: [stTag("In Progress"), stTag("Due Q3 2025")], desc: "A focused fact sheet on wage-employment outcomes is in progress.", href: "#", state: "coming", statusLabel: "In progress – due Q3 2025" },
    ],
  },
  {
    id: "evaluations",
    title: "Evaluations",
    type: "Evaluations",
    range: "2021–2025",
    cards: [
      { eyebrow: "External Evaluation", title: "Outcomes evaluation 2023", tags: [fmtTag("PDF"), fmtTag("English")], desc: "Independent evaluation of programme outcomes and effectiveness.", href: "#", state: "default" },
      { eyebrow: "External Evaluation", title: "Tracer study 2024", tags: [fmtTag("Docsend"), fmtTag("Interactive")], desc: "Alumni tracer study tracking longer-term employment and ventures.", href: "#", state: "default" },
      { eyebrow: "Internal Review", title: "Mid-term review 2022", tags: [fmtTag("PDF")], desc: "Mid-term review of programme delivery and learnings.", href: "#", state: "default" },
      { eyebrow: "External Evaluation", title: "Impact evaluation 2025", tags: [stTag("In Progress"), stTag("Due Q4 2025")], desc: "A full impact evaluation for 2025 is underway.", href: "#", state: "coming", statusLabel: "In progress – due Q4 2025" },
    ],
  },
];

const HERO_META = ["12 published resources", "3 in progress", "Updated June 2026"];
const SEGMENTS: ("All" | ResourceType)[] = ["All", "Annual Reports", "Key Facts", "Evaluations"];

/* ════════════════════════════════════════════════════════
   REUSABLE PILL
═══════════════════════════════════════════════════════ */
function Pill({ children, onClick, glyph }: { children: React.ReactNode; onClick?: () => void; glyph?: boolean }) {
  return (
    <button onClick={onClick} disabled={!onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600,
        color: "rgba(255,255,255,0.92)", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 999, padding: "5px 12px", cursor: onClick ? "pointer" : "default" }}>
      {glyph && <Download size={11} />}
      {children}
    </button>
  );
}

/* ── tag pill (format vs status) ─────────────────────── */
function TagPill({ tag }: { tag: Tag }) {
  const isStatus = tag.kind === "status";
  return (
    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.02em", borderRadius: 5, padding: "2px 7px",
      color: isStatus ? "#8A5A00" : ACCENT,
      backgroundColor: isStatus ? "rgba(224,164,88,0.16)" : "rgba(24,95,165,0.1)",
      border: `1px solid ${isStatus ? "rgba(224,164,88,0.4)" : "rgba(24,95,165,0.2)"}` }}>
      {tag.label}
    </span>
  );
}

/* ════════════════════════════════════════════════════════
   RESOURCE CARD (one component, three state variants)
═══════════════════════════════════════════════════════ */
function Card({ card }: { card: ResourceCard }) {
  const coming = card.state === "coming";
  const isNew = card.state === "new";
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%",
      backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden",
      opacity: coming ? 0.72 : 1 }}>

      {isNew && (
        <span style={{ position: "absolute", top: 8, right: 8, zIndex: 2, fontSize: 8.5, fontWeight: 800, letterSpacing: "0.06em",
          color: "white", backgroundColor: TICK, borderRadius: 5, padding: "2px 7px" }}>NEW</span>
      )}

      {/* header strip */}
      <div style={{ padding: "13px 15px 12px",
        background: coming ? "#E9EDF2" : isNew ? "linear-gradient(135deg, #102C5E, #102C5E)" : BAND }}>
        <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
          color: coming ? "#6B7280" : "rgba(181,212,244,0.85)" }}>{card.eyebrow}</p>
        <p style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.25, marginTop: 3, color: coming ? "#374151" : "white" }}>{card.title}</p>
      </div>

      {/* body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "12px 15px 15px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 9 }}>
          {card.tags.map(t => <TagPill key={t.label} tag={t} />)}
        </div>
        <p style={{ fontSize: 11.5, color: "#6B7280", lineHeight: 1.55, flex: 1 }}>{card.desc}</p>

        {coming ? (
          <button disabled
            style={{ marginTop: 13, width: "100%", fontSize: 11.5, fontWeight: 700, color: "#9CA3AF",
              backgroundColor: "#F1F3F6", border: "1px solid rgba(0,33,71,0.08)", borderRadius: 7, padding: "9px 10px", cursor: "not-allowed" }}>
            {card.statusLabel ?? "Coming soon"}
          </button>
        ) : (
          <a href={card.href} target="_blank" rel="noopener noreferrer"
            style={{ marginTop: 13, width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontSize: 11.5, fontWeight: 700, color: "white", backgroundColor: NAVY, borderRadius: 7, padding: "9px 10px", textDecoration: "none" }}>
            View report <ArrowRight size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function ImpactReportsPage() {
  const [query, setQuery] = useState("");
  const [seg, setSeg] = useState<"All" | ResourceType>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTIONS
      .filter(s => seg === "All" || s.type === seg)
      .map(s => ({
        ...s,
        cards: s.cards.filter(c =>
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.eyebrow.toLowerCase().includes(q) ||
          c.tags.some(t => t.label.toLowerCase().includes(q))
        ),
      }))
      .filter(s => s.cards.length > 0);
  }, [query, seg]);

  const jumpTo = (id: string) => {
    setSeg("All");
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: NAVY, backgroundImage: "url('/images/header_blue.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.55), rgba(4,44,83,0.2))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Impact reports</h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Annual reports, key facts, and evaluations documenting CHII&apos;s impact across programmes</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>Last updated: 18 June 2026, 16:30 CAT</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-9">

        {/* ── Controls bar ─────────────────────────────── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 360 }}>
            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search reports…"
              style={{ width: "100%", fontSize: 12.5, color: NAVY, backgroundColor: "white", border: "1px solid rgba(0,33,71,0.14)",
                borderRadius: 8, padding: "9px 12px 9px 32px", outline: "none" }} />
          </div>

          <div style={{ display: "flex", backgroundColor: "#EEF3F8", borderRadius: 8, padding: 3, gap: 3, flexWrap: "wrap" }}>
            {SEGMENTS.map(s => {
              const active = s === seg;
              return (
                <button key={s} onClick={() => setSeg(s)}
                  style={{ fontSize: 11, fontWeight: 700, padding: "7px 13px", borderRadius: 6, border: "none", cursor: "pointer",
                    backgroundColor: active ? NAVY : "transparent", color: active ? "white" : "#6B7280" }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Sections ─────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 24px", color: "#9CA3AF" }}>
            <FileText size={26} style={{ opacity: 0.5 }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginTop: 10 }}>No reports match your search</p>
            <p style={{ fontSize: 11.5, marginTop: 4 }}>Try a different term or reset the filter.</p>
          </div>
        ) : filtered.map(section => (
          <section key={section.id} id={`sec-${section.id}`} style={{ scrollMarginTop: 16 }}>
            {/* section header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 22, borderRadius: 999, backgroundColor: TICK, flexShrink: 0 }} />
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: NAVY, lineHeight: 1.2 }}>{section.title}</h2>
                  <p style={{ fontSize: 10.5, color: "#9CA3AF", marginTop: 1 }}>
                    {section.cards.length} {section.cards.length === 1 ? "resource" : "resources"} · {section.range}
                  </p>
                </div>
              </div>
            </div>

            {/* card grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14, alignItems: "stretch" }}>
              {section.cards.map(c => <Card key={c.title} card={c} />)}
            </div>
          </section>
        ))}

        <div style={{ marginTop: 24 }}>
          <FeaturedImpactStory footer />
        </div>
      </div>
    </div>
  );
}
