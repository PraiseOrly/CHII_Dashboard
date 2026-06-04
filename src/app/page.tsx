"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Eye, EyeOff, ArrowRight } from "lucide-react";

const PORTAL_ROUTES: Record<string, string> = {
  HENT:   "/hent",
  HECO:   "/heco",
  HEMP:   "/hemp",
  IMPACT: "/impact",
};

const HIGHLIGHTS = [
  { n: "1", text: "Reach and access across Africa" },
  { n: "2", text: "Youth employment and entrepreneurship outcomes" },
  { n: "3", text: "Impact stories and change pathways. Our MEL framework in action" },
  { n: "4", text: "Recent impact reports" },
];

function ChiiLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="24" fill="#0F1F3D" />
      <text x="100" y="97" textAnchor="middle" fill="white" fontSize="74" fontWeight="900"
        fontFamily="'Arial Black', Impact, Arial, sans-serif" letterSpacing="-2">ALU</text>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">CENTER FOR</text>
      <text x="100" y="137" textAnchor="middle" fill="white" fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">HEALTH INNOVATION</text>
      <text x="100" y="154" textAnchor="middle" fill="white" fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">AND IMPACT</text>
    </svg>
  );
}

const FIELD_BASE: React.CSSProperties = {
  height: "44px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#F9FAFB",
  fontSize: "14px",
  color: "#111827",
  padding: "0 12px",
  width: "100%",
  outline: "none",
  transition: "border 0.15s, box-shadow 0.15s, background 0.15s",
};

const FIELD_FOCUS: React.CSSProperties = {
  ...FIELD_BASE,
  border: "1.5px solid #1B3F8B",
  boxShadow: "0 0 0 3px rgba(27,63,139,0.12)",
  background: "#FFFFFF",
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [portal, setPortal] = useState("HENT");
  const [showPassword, setShowPassword] = useState(false);
  const [portalFocus, setPortalFocus] = useState(false);
  const [emailFocus, setEmailFocus]     = useState(false);
  const [passFocus, setPassFocus]       = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(PORTAL_ROUTES[portal]), 600);
  }

  return (
    /* flex-col-reverse so on mobile: compact brand banner sits at top, form below */
    <div className="min-h-screen flex flex-col-reverse md:flex-row">

      {/* ── Left panel — login form ── */}
      <div
        className="flex-1 md:w-[40%] bg-white flex flex-col justify-center"
        style={{ padding: "48px 64px" }}
      >
        <div style={{ maxWidth: "380px", width: "100%", margin: "0 auto" }}>

          {/* Logo row */}
          <div className="flex items-center gap-3 mb-4">
            <ChiiLogo size={40} />
            <span style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "#0F1F3D",
              textTransform: "uppercase",
            }}>
              CHII
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#E5E7EB", marginBottom: "28px" }} />

          {/* Heading */}
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#0F1F3D", marginBottom: "6px", lineHeight: 1.2 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>
              Sign in to access your programme portals
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Portal selector */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#6B7280", marginBottom: "6px" }}>
                  Portal
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={portal}
                    onChange={(e) => setPortal(e.target.value)}
                    onFocus={() => setPortalFocus(true)}
                    onBlur={() => setPortalFocus(false)}
                    style={{
                      ...(portalFocus ? FIELD_FOCUS : FIELD_BASE),
                      appearance: "none",
                      WebkitAppearance: "none",
                      paddingRight: "40px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    {Object.keys(PORTAL_ROUTES).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", pointerEvents: "none" }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#6B7280", marginBottom: "6px" }}>
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
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#6B7280", marginBottom: "6px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    defaultValue="password"
                    placeholder="••••••••"
                    onFocus={() => setPassFocus(true)}
                    onBlur={() => setPassFocus(false)}
                    style={{ ...(passFocus ? FIELD_FOCUS : FIELD_BASE), paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
                      padding: 0, display: "flex", alignItems: "center",
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ accentColor: "#1B3F8B", width: "14px", height: "14px", borderRadius: "4px" }}
                  />
                  <span style={{ fontSize: "13px", color: "#6B7280" }}>Remember me</span>
                </label>
                <button
                  type="button"
                  className="hover:underline"
                  style={{ fontSize: "13px", color: "#1B3F8B", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>

              {/* CTA button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "10px",
                  background: "#0F1F3D",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 500,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background-color 0.18s, transform 0.18s",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#1B3F8B";
                    e.currentTarget.style.transform = "scale(1.01)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#0F1F3D";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                {loading ? (
                  <span className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} />
                ) : (
                  <>Sign in to {portal} <ArrowRight size={15} /></>
                )}
              </button>

            </div>
          </form>

          {/* Footer */}
          <p style={{ fontSize: "12px", color: "#9CA3AF", textAlign: "center", marginTop: "24px" }}>
            © 2026 Centre for Health Innovation &amp; Impact · ALU
          </p>
        </div>
      </div>

      {/* ── Right panel — brand ── */}
      <div
        className="md:w-[60%] relative overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(160deg, #0F1F3D 0%, #1B3F8B 100%)",
          minHeight: "120px",
        }}
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.05,
          }}
        />

        {/* Ambient blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.03)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "rgba(96,165,250,0.08)", filter: "blur(60px)" }} />

        {/* ALU badge pill */}
        <div className="absolute z-10" style={{ top: "24px", right: "24px" }}>
          <span style={{
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: "999px",
            padding: "3px 12px",
            fontSize: "11px",
            color: "white",
            letterSpacing: "0.08em",
            background: "transparent",
          }}>
            ALU
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full" style={{ padding: "56px 56px 40px" }}>

          {/* Headline — always visible */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 style={{ fontSize: "38px", fontWeight: 700, lineHeight: 1.2, color: "white", marginBottom: "20px" }}>
              Health Innovation &amp;<br />
              <em style={{ color: "#60A5FA", fontStyle: "italic" }}>Impact.</em>
            </h1>

            {/* Body + feature items — hidden on mobile compact banner */}
            <p className="hidden md:block" style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              maxWidth: "420px",
              marginBottom: "36px",
            }}>
              CHII develops ethical and entrepreneurial health leaders through
              mission-driven, experiential learning enabling young Africans to
              access dignified work, build ventures, and drive lasting health
              impact across the continent.
            </p>

            <div className="hidden md:block">
              {HIGHLIGHTS.map(({ n, text }, i) => (
                <div key={n}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", paddingBottom: "14px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: "1px",
                    }}>
                      <span style={{ color: "white", fontSize: "12px", fontWeight: 600 }}>{n}</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", lineHeight: 1.55 }}>{text}</p>
                  </div>
                  {i < HIGHLIGHTS.length - 1 && (
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: "14px" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom copyright — desktop only */}
          <p className="hidden md:block" style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>
            © 2026 African Leadership University
          </p>
        </div>
      </div>

    </div>
  );
}
