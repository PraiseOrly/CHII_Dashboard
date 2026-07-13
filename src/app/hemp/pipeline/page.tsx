"use client";
import HEMPNav from "@/components/HEMPNav";
import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/missionStudents";
import { Briefcase } from "lucide-react";

// â”€â”€â”€ Pipeline aggregates â”€â”€â”€
const hxPart         = healthXSessions.reduce((s, h) => s + h.participants, 0);
const intStudents    = internships.reduce((s, i) => s + i.students, 0);
const intConversions = internships.reduce((s, i) => s + i.employmentConversions, 0);
const totalStudents  = missionStudents.length;
const completed      = missionStudents.filter(s => s.status === "Completed");
const employed       = completed.filter(s => s.employment === "Employed" || s.employment === "Entrepreneur");
const employPct      = completed.length ? Math.round(employed.length / completed.length * 100) : 0;
const ventures       = missionStudents.filter(s => s.ventureCreated);

const pipelineSteps: { value: string; label: string; note: string }[] = [
  { value: String(totalStudents),    label: "Mission Students",       note: "Recruited into the programme" },
  { value: hxPart.toLocaleString(),  label: "HealthX Experiences",    note: "Experiential learning touchpoints" },
  { value: String(intStudents),      label: "Internship Placements",  note: "Placed with host organisations" },
  { value: String(intConversions),   label: "Employment Conversions", note: "Internships that led to a hire" },
  { value: String(completed.length), label: "Graduates",              note: "Completed the programme" },
  { value: `${employPct}%`,          label: "Employment Rate",        note: "Employed or running a venture" },
  { value: String(ventures.length),  label: "Ventures Created",       note: "Student-founded startups" },
];

export default function HEMPPipelinePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <HEMPNav />

      {/* â”€â”€ HEADER â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-2">
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#102C5E", borderRadius: 12, minHeight: 120, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
        <img src="/images/design1.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <img src="/images/design2.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
        <div className="px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>Programme Pipeline</h1>
            </div>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              HEMP&apos;s talent-development journey — from recruitment to employment and entrepreneurship
            </p>
          </div>
        </div>
      </header>
      </div>

      {/* â”€â”€ BODY â”€â”€â”€ */}
      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-8">

        {/* Section header */}
        <div className="flex items-center gap-2.5 mb-1">
          <span className="rounded-full flex-shrink-0" style={{ width: 4, height: 16, backgroundColor: "#185FA5" }} />
          <div>
            <h2 className="font-extrabold leading-tight" style={{ fontSize: 14, color: "#185FA5", letterSpacing: "0.01em" }}>Talent-Development Pipeline</h2>
            <p className="mt-0.5" style={{ fontSize: 11, color: "#6B7280" }}>Students are recruited, exposed to experiential learning, placed in internships, graduate, and transition into employment or entrepreneurship.</p>
          </div>
        </div>

        {/* Pipeline journey card */}
        <div className="overflow-hidden" style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)" }}>
          <div className="flex items-center gap-2.5" style={{ backgroundColor: "#14306B", padding: "11px 20px" }}>
            <div className="flex-shrink-0" style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86" }} />
            <p className="text-[12px] font-semibold uppercase leading-none text-white" style={{ letterSpacing: "0.04em" }}>Programme Pipeline</p>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap items-stretch justify-center gap-2">
              {pipelineSteps.map((s, i) => (
                <div key={s.label} className="flex items-stretch" style={{ flex: "1 1 120px" }}>
                  <div className="flex-1 rounded-lg text-center px-2 py-3" style={{ border: "1px solid rgba(20,48,107,0.12)", borderTop: "3px solid #14306B" }}>
                    <p className="font-black tabular-nums" style={{ fontSize: 20, color: "#14306B", lineHeight: 1 }}>{s.value}</p>
                    <p className="text-[9.5px] font-semibold text-gray-700 mt-1 leading-tight">{s.label}</p>
                    <p className="text-[8.5px] text-gray-400 mt-1 leading-tight">{s.note}</p>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex items-center px-0.5" style={{ color: "rgba(20,48,107,0.4)", fontSize: 16 }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* â”€â”€ FOOTER (executive style, HEMP violet header design) â”€â”€â”€ */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#102C5E", minHeight: 116, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: "url('/images/Pat.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat", backgroundPosition: "center", opacity: 0.05 }} />
          <img src="/images/design1.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <img src="/images/design2.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%) scaleX(-1)", height: "100%", width: "auto", zIndex: 1, pointerEvents: "none", userSelect: "none" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(90deg, rgba(16,44,94,0) 0%, #102C5E 34%, #102C5E 66%, rgba(16,44,94,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, padding: "18px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "white" }}>Africa&apos;s Oasis for Health &amp; Education Transformation</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.85)" }}><span style={{ color: "#85B7EB", fontWeight: 600 }}>Data Last Synced:</span> 04 Jun 2026, EAT</span>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.5)" }}>|</span>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.85)" }}><span style={{ color: "#85B7EB", fontWeight: 600 }}>Source:</span> HEMP Programmes M&amp;E</span>
              <span style={{ fontSize: 11, color: "rgba(181,212,244,0.5)" }}>|</span>
              <a href="mailto:insights@chii.org" style={{ fontSize: 11, fontWeight: 600, color: "white", border: "1px solid rgba(181,212,244,0.4)", borderRadius: 6, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>Contact Analyst</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
