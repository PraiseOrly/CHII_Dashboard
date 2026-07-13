"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";
import { ChevronDown, ArrowRight } from "lucide-react";

const display = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"] });

const PORTAL_ROUTES: Record<string, string> = {
  HENT:   "/hent",
  HECO:   "/heco",
  HEMP:   "/hemp",
  EXECUTIVE: "/impact",
};

// ─── Palette ─────────────────────────────────────────────────────────────────
// Container colours are kept: the executive navy on the left, with a warm
// off-white on the right.
const NAVY   = "#102C5E"; // executive header fill — the container colour
const CREAM  = "#FBFAF7"; // right panel
const GOLD   = "#A98B62"; // eyebrow / accent
const BLUEY  = "#8FA9CE"; // supporting copy on navy
const RULE   = "#DCD8D1"; // hairlines on cream
const LABEL  = "#8A8681"; // small-caps field labels
const INK    = "#1F2937"; // input text on cream

/** Small-caps, wide-tracked label — used for every eyebrow and field label. */
const EYEBROW: React.CSSProperties = {
  fontSize: "9px",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

/** Underline-only field — no box, just a hairline. */
const FIELD: React.CSSProperties = {
  width: "100%",
  height: "34px",
  border: "none",
  borderBottom: `1px solid ${RULE}`,
  background: "transparent",
  fontSize: "13px",
  color: INK,
  outline: "none",
  padding: "0 0 4px",
  transition: "border-color 0.15s",
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [portal, setPortal]             = useState("HENT");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]           = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(PORTAL_ROUTES[portal]), 600);
  }

  const fieldStyle = (name: string): React.CSSProperties => ({
    ...FIELD,
    borderBottomColor: focused === name ? NAVY : RULE,
  });

  return (
    /* Centered container — the design sits inside the card, as before */
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full sm:max-w-4xl flex flex-col md:flex-row sm:rounded-lg sm:overflow-hidden sm:shadow-2xl">

      {/* ══ LEFT — navy brand panel ══════════════════════════════════════════ */}
      <div
        className="relative w-full md:w-[42%] flex flex-col justify-between overflow-hidden px-8 py-7 md:px-10 md:py-8"
        style={{ background: NAVY, minHeight: "400px" }}
      >
        {/* CHII logo */}
        <div className="relative z-10">
          <img
            src="/logos/CHII-Logo.png"
            alt="Centre for Health Innovation and Impact"
            style={{ height: "46px", width: "auto", objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Headline */}
        <div className="relative z-10 max-w-[300px] py-8 md:py-0">
          <h1
            className={display.className}
            style={{ fontSize: "25px", fontWeight: 400, lineHeight: 1.3, color: "white", marginBottom: "14px" }}
          >
            Developing Africa&apos;s next generation of health leaders.
          </h1>
          <p style={{ fontSize: "11.5px", lineHeight: 1.7, color: BLUEY }}>
            Mission-driven, experiential learning for dignified work,
            new ventures, and lasting health impact across the continent.
          </p>
        </div>

        {/* Copyright */}
        <p className="relative z-10" style={{ ...EYEBROW, fontSize: "8.5px", color: "rgba(255,255,255,0.35)" }}>
          © 2026 CHII · African Leadership University
        </p>
      </div>

      {/* ══ RIGHT — cream form panel ═════════════════════════════════════════ */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-8 md:px-10 md:py-8"
        style={{ background: CREAM }}
      >
        <div className="w-full" style={{ maxWidth: "300px" }}>

          {/* Eyebrow + heading */}
          <p style={{ ...EYEBROW, color: GOLD, marginBottom: "10px" }}>Programme Portals</p>
          <h2
            className={display.className}
            style={{ fontSize: "24px", fontWeight: 400, color: NAVY, lineHeight: 1.2, marginBottom: "20px" }}
          >
            Welcome back
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Portal */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ ...EYEBROW, color: LABEL, display: "block", marginBottom: "6px" }}>Portal</label>
              <div style={{ position: "relative" }}>
                <select
                  value={portal}
                  onChange={(e) => setPortal(e.target.value)}
                  onFocus={() => setFocused("portal")}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...fieldStyle("portal"),
                    appearance: "none",
                    WebkitAppearance: "none",
                    paddingRight: "24px",
                    cursor: "pointer",
                  }}
                >
                  {Object.keys(PORTAL_ROUTES).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  style={{ position: "absolute", right: 0, top: "8px", color: LABEL, pointerEvents: "none" }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ ...EYEBROW, color: LABEL, display: "block", marginBottom: "6px" }}>Email address</label>
              <input
                type="email"
                defaultValue="admin@chii.alu.edu"
                placeholder="your@email.com"
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                style={fieldStyle("email")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ ...EYEBROW, color: LABEL, display: "block", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="password"
                  placeholder="••••••••"
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  style={{ ...fieldStyle("password"), paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    ...EYEBROW,
                    position: "absolute",
                    right: 0,
                    top: "6px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: LABEL,
                    padding: 0,
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between" style={{ marginBottom: "18px" }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ accentColor: NAVY, width: "12px", height: "12px" }}
                />
                <span style={{ ...EYEBROW, color: LABEL }}>Remember me</span>
              </label>
              <button
                type="button"
                className="hover:underline"
                style={{ fontSize: "11px", color: NAVY, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Forgot password?
              </button>
            </div>

            {/* CTA — square navy bar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
              style={{
                ...EYEBROW,
                height: "42px",
                background: NAVY,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.18s",
              }}
            >
              {loading ? (
                <span
                  className="animate-spin"
                  style={{
                    width: "13px", height: "13px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
              ) : (
                <>Sign in <ArrowRight size={12} /></>
              )}
            </button>
          </form>

          {/* Need access */}
          <p style={{ fontSize: "11px", color: LABEL, textAlign: "center", marginTop: "16px" }}>
            Need access?{" "}
            <a href="mailto:insights@chii.org" className="hover:underline" style={{ color: NAVY }}>
              Contact your programme lead
            </a>
          </p>

          {/* Partners */}
          <div style={{ borderTop: `1px solid ${RULE}`, marginTop: "20px", paddingTop: "14px" }}>
            <p style={{ ...EYEBROW, color: LABEL, textAlign: "center", marginBottom: "10px" }}>In partnership with</p>
            <div className="flex items-center justify-center gap-6">
              {[
                { src: "/logos/alu.png", alt: "African Leadership University" },
                { src: "/logos/ahc.jpg", alt: "Africa Health Collaborative" },
                { src: "/logos/mcf.png", alt: "Mastercard Foundation" },
              ].map((p) => (
                <img
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  style={{ height: "24px", width: "auto", objectFit: "contain", display: "block" }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      </div>
    </div>
  );
}
