"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Eye, EyeOff, ArrowRight } from "lucide-react";

const PORTAL_ROUTES: Record<string, string> = {
  HENT:   "/hent",
  HECO:   "/heco",
  HEMP:   "/hemp",
  EXECUTIVE: "/impact",
};

const HIGHLIGHTS = [
  { n: "1", text: "Reach and access across Africa" },
  { n: "2", text: "Youth employment and entrepreneurship outcomes" },
  { n: "3", text: "Impact stories and change pathways. Our MEL framework in action" },
  { n: "4", text: "Recent impact reports" },
];

// Executive dashboard palette — the sign-in page uses the same blues as the
// Impact dashboard header, so the product reads as one system.
const EXEC_NAVY  = "#102C5E"; // executive header fill
const EXEC_BLUE  = "#185FA5"; // executive blue 600 — accents
const EXEC_LIGHT = "#85B7EB"; // executive blue 200 — links / checkbox
const EXEC_TINT  = "#E6F1FB"; // executive blue 50  — button hover

// ─── Shared type scale ───────────────────────────────────────────────────────
// Both panels use one scale so the two halves read as a single page. The only
// difference between them is the colour ramp: the left sits on navy (white
// text at descending opacity), the right on white (navy → gray).
const TYPE = {
  heading: { fontSize: "26px", fontWeight: 600, lineHeight: 1.2 },
  body:    { fontSize: "13px", fontWeight: 400, lineHeight: 1.65 },
  label:   { fontSize: "12px", fontWeight: 500, lineHeight: 1.4 },
  caption: { fontSize: "11px", fontWeight: 400, lineHeight: 1.5 },
} as const;

/** Text colours: [primary, secondary, muted] on each background. */
const ON_NAVY  = { primary: "white",     secondary: "rgba(255,255,255,0.6)",  muted: "rgba(255,255,255,0.3)" };
const ON_WHITE = { primary: EXEC_NAVY,   secondary: "#6B7280",                muted: "#9CA3AF" };

/* Translucent inputs for dark background */
const FIELD_BASE: React.CSSProperties = {
  height: "40px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  fontSize: TYPE.body.fontSize,
  color: ON_NAVY.primary,
  padding: "0 12px",
  width: "100%",
  outline: "none",
  transition: "border 0.15s, box-shadow 0.15s, background 0.15s",
};

const FIELD_FOCUS: React.CSSProperties = {
  ...FIELD_BASE,
  border: "1.5px solid rgba(255,255,255,0.55)",
  boxShadow: "0 0 0 3px rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.15)",
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [portal, setPortal]             = useState("HENT");
  const [showPassword, setShowPassword] = useState(false);
  const [portalFocus, setPortalFocus]   = useState(false);
  const [emailFocus, setEmailFocus]     = useState(false);
  const [passFocus, setPassFocus]       = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(PORTAL_ROUTES[portal]), 600);
  }

  return (
    /* Mobile: outer bg matches the dark form panel for a seamless full-screen feel */
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full sm:max-w-4xl flex flex-col md:flex-row sm:rounded-lg sm:overflow-hidden sm:shadow-2xl">

        {/* ── Form panel — DARK, full-screen on mobile, left half on desktop ── */}
        <div
          className="w-full md:w-1/2 relative flex flex-col justify-center px-6 py-10 md:px-12 md:py-9"
          style={{ background: EXEC_NAVY }}
        >
          {/* Dot-grid texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.05,
          }} />
          {/* Ambient blobs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.03)", filter: "blur(50px)" }} />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "rgba(96,165,250,0.07)", filter: "blur(50px)" }} />

          <div className="relative z-10 w-full max-w-sm mx-auto">

            {/* Logo */}
            <div className="flex items-center justify-center mb-3">
              <img
                src="/logos/CHII-Logo.png"
                alt="Centre for Health Innovation and Impact"
                style={{ height: "58px", width: "auto", objectFit: "contain", display: "block" }}
              />
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "20px" }} />

            {/* Heading */}
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ ...TYPE.heading, color: ON_NAVY.primary, marginBottom: "4px" }}>
                Welcome back
              </h2>
              <p style={{ ...TYPE.body, color: ON_NAVY.secondary }}>
                Sign in to access your programme portals
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Portal */}
                <div>
                  <label style={{ ...TYPE.label, display: "block", color: ON_NAVY.secondary, marginBottom: "5px" }}>
                    Portal
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={portal}
                      onChange={(e) => setPortal(e.target.value)}
                      onFocus={() => setPortalFocus(true)}
                      onBlur={() => setPortalFocus(false)}
                      style={{ ...(portalFocus ? FIELD_FOCUS : FIELD_BASE), appearance: "none", WebkitAppearance: "none", paddingRight: "40px", cursor: "pointer", fontWeight: 500 }}
                    >
                      {Object.keys(PORTAL_ROUTES).map((p) => (
                        <option key={p} value={p} style={{ background: EXEC_NAVY, color: "white" }}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ ...TYPE.label, display: "block", color: ON_NAVY.secondary, marginBottom: "5px" }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@chii.alu.edu"
                    placeholder="your@email.com"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    style={emailFocus ? FIELD_FOCUS : FIELD_BASE}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{ ...TYPE.label, display: "block", color: ON_NAVY.secondary, marginBottom: "5px" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      defaultValue="password"
                      placeholder="••••••••"
                      onFocus={() => setPassFocus(true)}
                      onBlur={() => setPassFocus(false)}
                      style={{ ...(passFocus ? FIELD_FOCUS : FIELD_BASE), paddingRight: "42px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", padding: 0, display: "flex", alignItems: "center" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: EXEC_LIGHT, width: "13px", height: "13px" }} />
                    <span style={{ ...TYPE.label, color: ON_NAVY.secondary }}>Remember me</span>
                  </label>
                  <button type="button" className="hover:underline"
                    style={{ ...TYPE.label, color: EXEC_LIGHT, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Forgot password?
                  </button>
                </div>

                {/* CTA — white button on dark bg */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", height: "44px", borderRadius: "8px",
                    background: "white", color: EXEC_NAVY,
                    fontSize: TYPE.body.fontSize, fontWeight: 600,
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "background-color 0.18s, transform 0.18s",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = EXEC_TINT; e.currentTarget.style.transform = "scale(1.01)"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.transform = "scale(1)"; } }}
                >
                  {loading
                    ? <span className="animate-spin" style={{ width: "15px", height: "15px", border: "2px solid rgba(16,44,94,0.2)", borderTopColor: EXEC_NAVY, borderRadius: "50%", display: "inline-block" }} />
                    : <>{`Sign in to ${portal}`} <ArrowRight size={14} /></>}
                </button>

              </div>
            </form>

            {/* Footer */}
            <p style={{ ...TYPE.caption, color: ON_NAVY.muted, textAlign: "center", marginTop: "18px" }}>
              © 2026 CHII · ALU
            </p>

            {/* Partner logos — mobile only */}
            <div className="flex md:hidden items-center justify-between mt-6 rounded-lg px-4 py-3"
              style={{ background: "white" }}>
              <img src="/logos/alu.png"  alt="African Leadership University" style={{ height: "22px", width: "auto", objectFit: "contain" }} />
              <img src="/logos/ahc.jpg"  alt="Africa Health Collaborative"   style={{ height: "22px", width: "auto", objectFit: "contain" }} />
              <img src="/logos/mcf.png"  alt="Mastercard Foundation"         style={{ height: "22px", width: "auto", objectFit: "contain" }} />
            </div>

          </div>
        </div>

        {/* ── Brand panel — WHITE, desktop only ── */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col bg-white">

          {/* Partner logo bar */}
          <div className="absolute z-10" style={{ top: "16px", left: "24px", right: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <img src="/logos/alu.png" alt="African Leadership University" style={{ height: "36px", width: "auto", display: "block", objectFit: "contain" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img src="/logos/ahc.jpg" alt="Africa Health Collaborative" style={{ height: "36px", width: "auto", display: "block", objectFit: "contain" }} />
              <img src="/logos/mcf.png" alt="Mastercard Foundation"       style={{ height: "36px", width: "auto", display: "block", objectFit: "contain" }} />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full" style={{ padding: "76px 44px 32px" }}>
            <div className="flex-1 flex flex-col justify-center">

              <h1 style={{ ...TYPE.heading, color: ON_WHITE.primary, marginBottom: "16px" }}>
                Health Innovation &amp; <em style={{ color: EXEC_BLUE, fontStyle: "italic" }}>Impact.</em>
              </h1>

              <p style={{ ...TYPE.body, color: ON_WHITE.secondary, marginBottom: "28px" }}>
                CHII develops ethical and entrepreneurial health leaders through
                mission-driven, experiential learning enabling young Africans to
                access dignified work, build ventures, and drive lasting health
                impact across the continent.
              </p>

              <div>
                {HIGHLIGHTS.map(({ n, text }, i) => (
                  <div key={n}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", paddingBottom: "11px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `1.5px solid ${EXEC_LIGHT}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", background: EXEC_TINT }}>
                        <span style={{ ...TYPE.caption, fontWeight: 600, color: ON_WHITE.primary }}>{n}</span>
                      </div>
                      <p style={{ ...TYPE.body, color: ON_WHITE.secondary }}>{text}</p>
                    </div>
                    {i < HIGHLIGHTS.length - 1 && (
                      <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "11px" }} />
                    )}
                  </div>
                ))}
              </div>

            </div>

            <p style={{ ...TYPE.caption, color: ON_WHITE.muted }}>
              © 2026 African Leadership University
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
