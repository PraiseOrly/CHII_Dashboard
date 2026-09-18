"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Fraunces, Playfair_Display } from "next/font/google";
import {
  ChevronDown, ArrowRight,
  BarChart3, TrendingUp, Zap, FileText,
} from "lucide-react";

/** Premium serif fonts for executive branding */
const serif = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });

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
  { icon: BarChart3,  title: "Real Outcomes",       body: "Monitor progress toward your mission." },
  { icon: TrendingUp, title: "Impact Evidence",     body: "Data that proves change happens." },
  { icon: Zap,        title: "Strategic Insights",  body: "Evidence guiding better decisions." },
  { icon: FileText,   title: "Transform Stories",   body: "Reports that inspire action." },
] as const;

const PARTNERS = [
  { src: "/logos/alu.png", alt: "African Leadership University" },
  { src: "/logos/ahc.jpg", alt: "Africa Health Collaborative" },
  { src: "/logos/mcf.png", alt: "Mastercard Foundation" },
];

const LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#6B7280",
  display: "block",
  marginBottom: 8,
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [portal, setPortal]             = useState<string>("HENT");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]           = useState<string | null>(null);
  const [hovered, setHovered]           = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (focused === "portal") {
        const target = e.target as HTMLElement;
        if (!target.closest("div[data-dropdown]")) {
          setFocused(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [focused]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const target = PORTALS.find(p => p.id === portal)?.href ?? "/executive";
    setTimeout(() => router.push(target), 600);
  }

  const field = (name: string): React.CSSProperties => ({
    width: "100%",
    height: 36,
    fontSize: 13,
    fontWeight: 500,
    color: TEXT,
    background: "white",
    border: `1px solid ${focused === name ? PRIMARY : "#D5D8E0"}`,
    boxShadow: focused === name
      ? `0 0 0 2px rgba(20,48,107,0.1), inset 0 0 0 1px ${PRIMARY}`
      : "none",
    borderRadius: 6,
    padding: "0 12px",
    outline: "none",
    transition: "border-color .15s, box-shadow .15s",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "white" }}
    >
      <div
        className="w-full flex flex-col lg:flex-row overflow-hidden"
        style={{
          maxWidth: "55rem",
          maxHeight: "620px",
          borderRadius: 14,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 8px 32px rgba(20,48,107,0.10), 0 1px 2px rgba(0,0,0,0.02)",
          background: "white",
        }}
      >

        {/* ══ LEFT (form panel) ════════════════════════════════════════ */}
        <div className="relative w-full lg:w-[50%] flex flex-col px-11 py-8 justify-between">
          <div style={{ maxWidth: "19rem", width: "100%", margin: "0 auto" }}>

            <h1 className={playfair.className} style={{ fontSize: 34, fontWeight: 600, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.015em", marginBottom: 6 }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: 14, color: SECONDARY, marginTop: 8, lineHeight: 1.5, marginBottom: 0, fontWeight: 400 }}>
              Please sign in to access the dashboard
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>

              <div style={{ marginBottom: 14 }}>
                <label style={{...LABEL, marginBottom: 6}}>Programme</label>
                <div style={{ position: "relative" }} data-dropdown="portal">
                  <button
                    type="button"
                    onClick={() => setFocused(focused === "portal" ? null : "portal")}
                    style={{
                      ...field("portal"),
                      paddingRight: 44,
                      cursor: "pointer",
                      background: "white",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{PORTALS.find(p => p.id === portal)?.label || portal}</span>
                  </button>
                  <ChevronDown size={18} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: SECONDARY, pointerEvents: "none" }} />

                  {focused === "portal" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: 4,
                        background: "white",
                        border: `1px solid #D5D8E0`,
                        borderRadius: 6,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        zIndex: 10,
                        overflow: "hidden",
                      }}
                    >
                      {PORTALS.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPortal(p.id);
                            setFocused(null);
                          }}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            textAlign: "left",
                            background: portal === p.id ? "#F3F7FF" : "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                            color: TEXT,
                            fontWeight: 500,
                            transition: "background .15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F3F7FF"}
                          onMouseLeave={e => e.currentTarget.style.background = portal === p.id ? "#F3F7FF" : "white"}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{...LABEL, marginBottom: 6}}>Email address</label>
                <input
                  type="email"
                  defaultValue="admin@chii.alu.edu"
                  placeholder="you@chii.alu.edu"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  style={field("email")}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{...LABEL, marginBottom: 6}}>Password</label>
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
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      fontSize: 13, fontWeight: 500, color: "#9CA3AF",
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
                  style={{ fontSize: 13, fontWeight: 500, color: PRIMARY, background: "none", border: "none", cursor: "pointer", padding: 0 }}
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
                  height: 40,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  color: "white",
                  background: hovered && !loading ? "#0B2145" : PRIMARY,
                  border: "none",
                  borderRadius: 8,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transform: hovered && !loading ? "translateY(-0.5px)" : "none",
                  boxShadow: hovered && !loading
                    ? "0 4px 12px rgba(20,48,107,0.18)"
                    : "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "background .15s, transform .15s, box-shadow .15s",
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
            <p style={{ fontSize: 13, color: SECONDARY, textAlign: "center", marginTop: 18 }}>
              Need access?{" "}
              <a href="mailto:admin@chii.alu.edu" className="hover:underline" style={{ color: PRIMARY, fontWeight: 500 }}>
                Contact your programme lead
              </a>
            </p>

            {/* Partners — centred under a rule. They sit on the white panel because
                the logo files have an opaque white background baked in. */}
            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 14 }}>
              <p style={{ ...LABEL, textAlign: "center", marginBottom: 12 }}>
                In partnership with
              </p>
              <div className="flex items-center justify-center gap-8">
                {PARTNERS.map(p => (
                  <img
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    className="chii-partner-logo"
                    style={{ height: 48, width: "auto", objectFit: "contain", display: "block" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT (brand panel) ═══════════════════════════════════════ */}
        <div
          className="relative w-full lg:w-[50%] flex flex-col overflow-hidden px-12 py-10"
          style={{ background: "#102C5E" }}
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Logo */}
            <img
              src="/logos/CHII-Logo.png"
              alt="Centre for Health Innovation and Impact"
              style={{ height: 40, width: "auto", objectFit: "contain", display: "block", flexShrink: 0, marginBottom: 28 }}
            />

            {/* Mission narrative */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "white", fontWeight: 500, maxWidth: "340px", margin: 0 }}>
                Explore how CHII builds the evidence base for health innovation across Africa, tracking how young people move through programmes into dignified work, ventures, and lasting impact on health systems across the continent.
              </p>
            </div>

            {/* Capabilities — enhanced visual treatment */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
                Platform Capabilities
              </p>
              <ul className="flex flex-col" style={{ listStyle: "none", margin: 0, padding: 0, gap: 18, maxWidth: "340px" }}>
                {CAPABILITIES.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        minWidth: 32,
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1,
                      }}
                    >
                      <Icon size={16} color="white" strokeWidth={1.5} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1.3, margin: 0, marginBottom: 2 }}>{title}</p>
                      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: 0 }}>{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Copyright */}
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0, margin: 0 }}>
              © 2026 CHII · African Leadership University
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
