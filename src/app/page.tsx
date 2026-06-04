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

function ChiiLogo({ size = 38 }: { size?: number }) {
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
  height: "40px",
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 sm:p-4">
      <div className="w-full sm:max-w-4xl flex flex-col md:flex-row sm:rounded-lg sm:overflow-hidden sm:shadow-2xl">

        {/* ── Form panel — white, full-screen on mobile, left half on desktop ── */}
        <div className="w-full md:w-1/2 relative flex flex-col justify-center bg-white px-6 py-10 md:px-12 md:py-9">

          <div className="w-full max-w-sm mx-auto">

            {/* Logo + name */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <ChiiLogo size={38} />
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: "#0F1F3D", textTransform: "uppercase", lineHeight: 1.5 }}>
                Centre for Health<br />Innovation and Impact
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#E5E7EB", marginBottom: "20px" }} />

            {/* Heading */}
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 600, color: "#0F1F3D", marginBottom: "4px", lineHeight: 1.2 }}>
                Welcome back
              </h2>
              <p style={{ fontSize: "13px", color: "#6B7280" }}>
                Sign in to access your programme portals
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Portal */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6B7280", marginBottom: "5px" }}>
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
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6B7280", marginBottom: "5px" }}>
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6B7280", marginBottom: "5px" }}>
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
                      style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, display: "flex", alignItems: "center" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "#1B3F8B", width: "13px", height: "13px" }} />
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>Remember me</span>
                  </label>
                  <button type="button" className="hover:underline"
                    style={{ fontSize: "12px", color: "#1B3F8B", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Forgot password?
                  </button>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", height: "44px", borderRadius: "8px",
                    background: "#0F1F3D", color: "white",
                    fontSize: "14px", fontWeight: 600,
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "background-color 0.18s, transform 0.18s",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "#1B3F8B"; e.currentTarget.style.transform = "scale(1.01)"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "#0F1F3D"; e.currentTarget.style.transform = "scale(1)"; } }}
                >
                  {loading
                    ? <span className="animate-spin" style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} />
                    : <>{`Sign in to ${portal}`} <ArrowRight size={14} /></>}
                </button>

              </div>
            </form>

            {/* Footer */}
            <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginTop: "18px" }}>
              © 2026 CHII · ALU
            </p>

            {/* Partner logos — mobile only */}
            <div className="flex md:hidden items-center justify-between mt-6 pt-5"
              style={{ borderTop: "1px solid #F3F4F6" }}>
              <img src="/logos/alu.png"  alt="African Leadership University" style={{ height: "22px", width: "auto", objectFit: "contain" }} />
              <img src="/logos/ahc.jpg"  alt="Africa Health Collaborative"   style={{ height: "22px", width: "auto", objectFit: "contain" }} />
              <img src="/logos/mcf.png"  alt="Mastercard Foundation"         style={{ height: "22px", width: "auto", objectFit: "contain" }} />
            </div>

          </div>
        </div>

        {/* ── Brand panel — dark, desktop only ── */}
        <div
          className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col"
          style={{ background: "linear-gradient(160deg, #0F1F3D 0%, #1B3F8B 100%)" }}
        >
          {/* Dot-grid texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.05,
          }} />
          {/* Ambient blobs */}
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.03)", filter: "blur(50px)" }} />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "rgba(96,165,250,0.07)", filter: "blur(50px)" }} />

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

              <h1 style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.2, color: "white", marginBottom: "16px", whiteSpace: "nowrap" }}>
                Health Innovation &amp; <em style={{ color: "#60A5FA", fontStyle: "italic" }}>Impact.</em>
              </h1>

              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: "28px" }}>
                CHII develops ethical and entrepreneurial health leaders through
                mission-driven, experiential learning enabling young Africans to
                access dignified work, build ventures, and drive lasting health
                impact across the continent.
              </p>

              <div>
                {HIGHLIGHTS.map(({ n, text }, i) => (
                  <div key={n}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", paddingBottom: "11px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                        <span style={{ color: "white", fontSize: "11px", fontWeight: 600 }}>{n}</span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", lineHeight: 1.5 }}>{text}</p>
                    </div>
                    {i < HIGHLIGHTS.length - 1 && (
                      <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "11px" }} />
                    )}
                  </div>
                ))}
              </div>

            </div>

            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
              © 2026 African Leadership University
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
