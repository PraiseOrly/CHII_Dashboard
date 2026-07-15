"use client";
import PortalFooter from "@/components/layout/portal-footer";

import { useState, useMemo } from "react";
import { Search, Download, ArrowRight, FileText } from "lucide-react";
import FeaturedImpactStory from "@/components/layout/featured-impact-story";
import HeaderDesign from "@/components/layout/header-design";

/* ── palette (matches the rest of the dashboard) ─────── */
const NAVY = "#14306B";
const BAND = "#14306B";
const TICK = "#D17A86";
const ACCENT = "#102C5E";

/* ════════════════════════════════════════════════════════
   TYPES + DATA
═══════════════════════════════════════════════════════ */
type CardState = "default" | "coming" | "new";
type ResourceType = "HEMP" | "HENT" | "HECO" | "MELA";

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
    id: "hemp",
    title: "HEMP",
    type: "HEMP",
    range: "Health Employability & Mission Programme",
    cards: [
      { eyebrow: "HEMP", title: "HealthX report", tags: [fmtTag("PDF"), stTag("New")], desc: "Outcomes and reach across the HealthX programme.", href: "#", state: "new" },
      { eyebrow: "HEMP", title: "SIE cohort report", tags: [fmtTag("PDF")], desc: "Performance and progression of the SIE cohort.", href: "#", state: "default" },
      { eyebrow: "HEMP", title: "Mission Students report", tags: [fmtTag("PDF")], desc: "Engagement and impact of Mission Students.", href: "#", state: "default" },
      { eyebrow: "HEMP", title: "Internship funnel report", tags: [stTag("In Progress"), stTag("Due Q3 2026")], desc: "Applicant-to-placement funnel across the internship pipeline.", href: "#", state: "coming", statusLabel: "In progress – due Q3 2026" },
      { eyebrow: "HEMP", title: "Internship partnership performance report", tags: [fmtTag("PDF")], desc: "Performance of internship partners and placements.", href: "#", state: "default" },
      { eyebrow: "HEMP", title: "Courses enrollment & completion report", tags: [fmtTag("PDF")], desc: "Enrollment and completion rates across HEMP courses.", href: "#", state: "default" },
      { eyebrow: "HEMP", title: "Intro to Global Health course report", tags: [fmtTag("PDF")], desc: "Delivery and outcomes for the Intro to Global Health course.", href: "#", state: "default" },
      { eyebrow: "HEMP", title: "Ethics course report", tags: [fmtTag("PDF")], desc: "Delivery and outcomes for the Ethics course.", href: "#", state: "default" },
    ],
  },
  {
    id: "hent",
    title: "HENT",
    type: "HENT",
    range: "Health Entrepreneurship",
    cards: [
      { eyebrow: "HENT", title: "Hackathon report", tags: [fmtTag("PDF"), stTag("New")], desc: "Participation and outcomes from HENT hackathons.", href: "#", state: "new" },
      { eyebrow: "HENT", title: "Funding report", tags: [fmtTag("PDF")], desc: "Funding raised and disbursed across enterprises.", href: "#", state: "default" },
      { eyebrow: "HENT", title: "Enterprise portfolio report", tags: [stTag("In Progress"), stTag("Due Q4 2026")], desc: "Health of the enterprise portfolio and growth metrics.", href: "#", state: "coming", statusLabel: "In progress – due Q4 2026" },
      { eyebrow: "HENT", title: "Masterclasses report", tags: [fmtTag("PDF")], desc: "Attendance and impact of masterclass sessions.", href: "#", state: "default" },
      { eyebrow: "HENT", title: "Mentorship report", tags: [fmtTag("PDF")], desc: "Mentorship engagement and outcomes.", href: "#", state: "default" },
      { eyebrow: "HENT", title: "Application & selection report", tags: [fmtTag("PDF")], desc: "Application volumes and selection outcomes.", href: "#", state: "default" },
    ],
  },
  {
    id: "heco",
    title: "HECO",
    type: "HECO",
    range: "Health Community",
    cards: [
      { eyebrow: "HECO", title: "CRA report", tags: [stTag("In Progress"), stTag("Due Q3 2026")], desc: "Community Research Associate activity and outcomes.", href: "#", state: "coming", statusLabel: "In progress – due Q3 2026" },
    ],
  },
  {
    id: "mela",
    title: "MELA",
    type: "MELA",
    range: "Monitoring, Evaluation, Learning & Adaptation",
    cards: [
      { eyebrow: "MELA", title: "Cross-pillar performance report", tags: [fmtTag("PDF")], desc: "Performance rolled up across HEMP, HENT, and HECO.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "Data quality report", tags: [fmtTag("PDF")], desc: "Data completeness, accuracy, and timeliness assessment.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "Learning brief", tags: [fmtTag("PDF")], desc: "Key learnings distilled from programme data.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "Adaptation log", tags: [fmtTag("PDF")], desc: "Record of programme adaptations and decisions.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "Indicator health report", tags: [fmtTag("PDF")], desc: "Status of indicators against targets.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "Baseline / midterm / endline evaluation reports", tags: [stTag("In Progress"), stTag("Due Q4 2026")], desc: "Evaluation reports across the programme lifecycle.", href: "#", state: "coming", statusLabel: "In progress – due Q4 2026" },
      { eyebrow: "MELA", title: "MEL capacity report", tags: [fmtTag("PDF")], desc: "Assessment of monitoring and evaluation capacity.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "Framework alignment report", tags: [fmtTag("PDF")], desc: "Alignment of activities to the results framework.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "MCF Quarterly report", tags: [fmtTag("PDF"), stTag("New")], desc: "Quarterly reporting to the Mastercard Foundation.", href: "#", state: "new" },
      { eyebrow: "MELA", title: "MCF Bi-annual outcomes report", tags: [fmtTag("PDF")], desc: "Bi-annual outcomes reporting to the Mastercard Foundation.", href: "#", state: "default" },
      { eyebrow: "MELA", title: "Beneficiary feedback report", tags: [fmtTag("PDF")], desc: "Feedback gathered from programme beneficiaries.", href: "#", state: "default" },
    ],
  },
];

const HERO_META = ["26 report types", "4 pillars", "Updated June 2026"];
const SEGMENTS: ("All" | ResourceType)[] = ["All", "HEMP", "HENT", "HECO", "MELA"];

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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <HeaderDesign />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Impact reports</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>Reports across HEMP, HENT, HECO, and MELA documenting CHII&apos;s impact across pillars</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px]" style={{ color: "rgba(181,212,244,0.5)" }}>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Data source:</span> CHII MELA Consolidated Database</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Period:</span> 2022–2026</span>
              <span aria-hidden="true">·</span>
              <span>{SECTIONS.reduce((n, s) => n + s.cards.length, 0)} resources</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color: "rgba(181,212,244,0.8)", fontWeight: 600 }}>Last updated:</span> 18 June 2026, 16:30 CAT</span>
            </div>
          </div>
        </div>
      </header>
      </div>

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
          <PortalFooter portal="executive" />
        </div>
      </div>
    </div>
  );
}
