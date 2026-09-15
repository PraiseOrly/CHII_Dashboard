"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Fraunces } from "next/font/google";
import {
  ChevronDown, ArrowRight,
  LineChart, Target, Briefcase, FileBarChart,
} from "lucide-react";

/** Editorial serif for the headline only. Paired with Inter (from the root layout)
 *  for all UI text — the pairing reads considered rather than startup-generic. */
const serif = Fraunces({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });

// ─── Palette ─────────────────────────────────────────────────────────────────
// Blues matched to the Executive page header/KPI navy (#102C5E / #14306B / #85B7EB).
const NAVY      = "#102C5E"; // left panel — gradient top (Executive header navy)
const NAVY_DEEP = "#0B2145"; // left panel — gradient bottom (darker shade of the same navy)
const PRIMARY   = "#14306B"; // buttons, focus (Executive KPI navy)
const HOVER     = "#0B2145";
const ICON      = "#85B7EB"; // capability icons on navy (Executive header accent blue)
const BODY      = "#D8E4F3"; // supporting copy on navy
const BORDER    = "#E3E0DA"; // warm neutral grey
const TEXT      = "#172B4D";
const SECONDARY = "#5E6C84"; // 5.3:1 on white — passes WCAG AA

const PORTALS = [
  { id: "HEMP",      label: "HEMP",      href: "/hemp" },
  { id: "HENT",      label: "HENT",      href: "/hent" },
  { id: "HECO",      label: "HECO",      href: "/heco" },
  { id: "EXECUTIVE", label: "EXECUTIVE", href: "/executive" },
] as const;

/** What the platform does — four capabilities, not a description of the org. */
const CAPABILITIES = [
  { icon: LineChart,    title: "Programme Analytics",           body: "Track participation, reach, and completion." },
  { icon: Target,       title: "Impact Measurement",            body: "Monitor outcomes using MEL indicators." },
  { icon: Briefcase,    title: "Venture & Employment Tracking", body: "Follow ventures, internships, and employment." },
  { icon: FileBarChart, title: "Reports & Insights",            body: "Generate programme reports and export data." },
] as const;

const PARTNERS = [
  { src: "/logos/alu.png", alt: "African Leadership University" },
  { src: "/logos/ahc.jpg", alt: "Africa Health Collaborative" },
  { src: "/logos/mcf.png", alt: "Mastercard Foundation" },
];

const LABEL: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: SECONDARY,
  display: "block",
  marginBottom: 9,
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [portal, setPortal]             = useState<string>("HENT");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]           = useState<string | null>(null);
  const [hovered, setHovered]           = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const target = PORTALS.find(p => p.id === portal)?.href ?? "/executive";
    setTimeout(() => router.push(target), 600);
  }

  const field = (name: string): React.CSSProperties => ({
    width: "100%",
    height: 40,
    fontSize: 14,
    fontWeight: 500,
    color: TEXT,
    background: "white",
    border: `1px solid ${focused === name ? PRIMARY : BORDER}`,
    boxShadow: focused === name
      ? `0 0 0 2px ${PRIMARY}2E, 0 1px 2px rgba(16,32,64,0.04)`
      : "0 1px 2px rgba(16,32,64,0.03)",
    borderRadius: 8,
    padding: "0 14px",
    outline: "none",
    transition: "border-color .15s, box-shadow .15s",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(165deg, #F8FAFC 0%, #EEF2F8 55%, #F7F8FA 100%)" }}
    >
      <div
        className="w-full flex flex-col lg:flex-row overflow-hidden"
        style={{
          maxWidth: "62rem",
          maxHeight: "680px",
          borderRadius: 16,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(16,32,64,0.10)",
          background: "white",
        }}
      >

        {/* ══ LEFT (50%) — the form ════════════════════════════════════════ */}
        <div className="relative w-full lg:w-[50%] flex flex-col px-12 py-8 overflow-y-auto">
          <div style={{ maxWidth: "21.25rem", width: "100%" }}>

            <h1 className={serif.className} style={{ fontSize: 36, fontWeight: 600, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: SECONDARY, marginTop: 8, lineHeight: 1.4, marginBottom: 0 }}>
              Sign in to access CHII programme dashboards.
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>

              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Programme</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={portal}
                    onChange={e => setPortal(e.target.value)}
                    onFocus={() => setFocused("portal")}
                    onBlur={() => setFocused(null)}
                    style={{ ...field("portal"), appearance: "none", WebkitAppearance: "none", paddingRight: 44, cursor: "pointer" }}
                  >
                    {PORTALS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  <ChevronDown size={18} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: SECONDARY, pointerEvents: "none" }} />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Email address</label>
                <input
                  type="email"
                  defaultValue="admin@chii.alu.edu"
                  placeholder="you@chii.alu.edu"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  style={field("email")}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    defaultValue="password"
                    placeholder="••••••••"
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    style={{ ...field("password"), paddingRight: 66 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                      fontSize: 14, fontWeight: 600, color: SECONDARY,
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked style={{ accentColor: PRIMARY, width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, color: SECONDARY }}>Remember me</span>
                </label>
                <button
                  type="button"
                  className="hover:underline"
                  style={{ fontSize: 13, fontWeight: 600, color: PRIMARY, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  background: hovered && !loading ? HOVER : PRIMARY,
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.75 : 1,
                  transform: hovered && !loading ? "translateY(-2px)" : "none",
                  boxShadow: hovered && !loading
                    ? "0 10px 24px rgba(20,61,122,0.30)"
                    : "0 4px 14px rgba(20,61,122,0.20)",
                  transition: "background .16s, transform .16s, box-shadow .16s",
                }}
              >
                {loading ? (
                  <span
                    className="animate-spin"
                    style={{
                      width: 18, height: 18,
                      border: "2px solid rgba(255,255,255,0.35)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                ) : (
                  <>Sign in <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            {/* Need access — centred under the button */}
            <p style={{ fontSize: 13, color: SECONDARY, textAlign: "center", marginTop: 14 }}>
              Need access?{" "}
              <a href="mailto:admin@chii.alu.edu" className="hover:underline" style={{ color: PRIMARY, fontWeight: 600 }}>
                Contact your programme lead
              </a>
            </p>

            {/* Partners — centred under a rule. They sit on the white panel because
                the logo files have an opaque white background baked in. */}
            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 14 }}>
              <p style={{ ...LABEL, textAlign: "center", marginBottom: 12 }}>
                In partnership with
              </p>
              <div className="flex items-center justify-center gap-10">
                {PARTNERS.map(p => (
                  <img
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    className="chii-partner-logo"
                    style={{ height: 28, width: "auto", objectFit: "contain", display: "block" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT (50%) — brand and capabilities ═══════════════════════════ */}
        <div
          className="relative w-full lg:w-[50%] flex flex-col overflow-hidden px-12 py-12"
          style={{ background: `linear-gradient(165deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(720px 380px at 0% 0%, rgba(133,183,235,0.12), transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Logo + tagline + capabilities as one vertically centered block */}
            <div className="flex flex-col flex-1 justify-center">
              <img
                src="/logos/CHII-Logo.png"
                alt="Centre for Health Innovation and Impact"
                style={{ height: 44, width: "auto", objectFit: "contain", display: "block", flexShrink: 0, marginBottom: 24 }}
              />

              <p style={{ fontSize: 18, lineHeight: 1.6, color: BODY, marginBottom: 24 }}>
                Access programme data, monitor outcomes, and generate insights across HENT,
                HEMP, and HECO.
              </p>

              {/* Capabilities — left-aligned horizontal layout */}
              <ul className="flex flex-col gap-5" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {CAPABILITIES.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(133,183,235,0.12)", border: "1px solid rgba(133,183,235,0.28)" }}
                    >
                      <Icon size={18} color={ICON} strokeWidth={1.5} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 17, fontWeight: 600, color: "white", lineHeight: 1.3, margin: 0 }}>{title}</p>
                      <p style={{ fontSize: 15, color: BODY, opacity: 0.75, lineHeight: 1.5, marginTop: 4 }}>{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Copyright — pinned to the bottom of the panel */}
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", flexShrink: 0, paddingTop: 24 }}>
              © 2026 CHII · African Leadership University
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
