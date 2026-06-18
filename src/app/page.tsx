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

function ChiiLogo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="24" fill="white" />
      <text x="100" y="97" textAnchor="middle" fill="#0F1F3D" fontSize="74" fontWeight="900"
        fontFamily="'Arial Black', Impact, Arial, sans-serif" letterSpacing="-2">ALU</text>
      <text x="100" y="120" textAnchor="middle" fill="#0F1F3D" fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">CENTER FOR</text>
      <text x="100" y="137" textAnchor="middle" fill="#0F1F3D" fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">HEALTH INNOVATION</text>
      <text x="100" y="154" textAnchor="middle" fill="#0F1F3D" fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">AND IMPACT</text>
    </svg>
  );
}

/* Translucent inputs for dark background */
const FIELD_BASE: React.CSSProperties = {
  height: "40px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  fontSize: "14px",
  color: "white",
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
          style={{ background: "linear-gradient(160deg, #0F1F3D 0%, #1B3F8B 100%)" }}
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

            {/* Logo + name */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <ChiiLogo size={38} />
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: "white", textTransform: "uppercase", lineHeight: 1.5 }}>
                Centre for Health<br />Innovation and Impact
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "20px" }} />

            {/* Heading */}
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 600, color: "white", marginBottom: "4px", lineHeight: 1.2 }}>
                Welcome back
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                Sign in to access your programme portals
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Portal */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: "5px" }}>
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
                        <option key={p} value={p} style={{ background: "#0F1F3D", color: "white" }}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: "5px" }}>
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: "5px" }}>
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
                    <input type="checkbox" defaultChecked style={{ accentColor: "#93C5FD", width: "13px", height: "13px" }} />
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>Remember me</span>
                  </label>
                  <button type="button" className="hover:underline"
                    style={{ fontSize: "12px", color: "#93C5FD", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Forgot password?
                  </button>
                </div>

                {/* CTA — white button on dark bg */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", height: "44px", borderRadius: "8px",
                    background: "white", color: "#0F1F3D",
                    fontSize: "14px", fontWeight: 600,
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "background-color 0.18s, transform 0.18s",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "#E0E7FF"; e.currentTarget.style.transform = "scale(1.01)"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.transform = "scale(1)"; } }}
                >
                  {loading
                    ? <span className="animate-spin" style={{ width: "15px", height: "15px", border: "2px solid rgba(15,31,61,0.2)", borderTopColor: "#0F1F3D", borderRadius: "50%", display: "inline-block" }} />
                    : <>{`Sign in to ${portal}`} <ArrowRight size={14} /></>}
                </button>

              </div>
            </form>

            {/* Footer */}
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "18px" }}>
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

              <h1 style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.2, color: "#0F1F3D", marginBottom: "16px", whiteSpace: "nowrap" }}>
                Health Innovation &amp; <em style={{ color: "#1B3F8B", fontStyle: "italic" }}>Impact.</em>
              </h1>

              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.65, marginBottom: "28px" }}>
                CHII develops ethical and entrepreneurial health leaders through
                mission-driven, experiential learning enabling young Africans to
                access dignified work, build ventures, and drive lasting health
                impact across the continent.
              </p>

              <div>
                {HIGHLIGHTS.map(({ n, text }, i) => (
                  <div key={n}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", paddingBottom: "11px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1.5px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", background: "#F9FAFB" }}>
                        <span style={{ color: "#0F1F3D", fontSize: "11px", fontWeight: 600 }}>{n}</span>
                      </div>
                      <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.5 }}>{text}</p>
                    </div>
                    {i < HIGHLIGHTS.length - 1 && (
                      <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "11px" }} />
                    )}
                  </div>
                ))}
              </div>

            </div>

            <p style={{ color: "#9CA3AF", fontSize: "11px" }}>
              © 2026 African Leadership University
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
