"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";
import { ChevronDown, ArrowRight } from "lucide-react";

const display = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"] });

/** What the dashboard covers — the numbered list on the brand panel.
 *  Kept to one short line each: the panel has to fit beside the form without
 *  the page ever scrolling. */
const PILLARS = [
  {
    title: "Reach and access",
    body: "Who we serve, and how equitably we grow across countries and gender.",
  },
  {
    title: "Employment and entrepreneurship",
    body: "Internships secured, ventures launched, jobs created.",
  },
  {
    title: "Impact stories and change pathways",
    body: "The stories behind the numbers — our MEL framework in action.",
  },
  {
    title: "Impact reports",
    body: "Quarterly progress, annual outcomes, and pillar briefs to download.",
  },
] as const;

const PORTAL_ROUTES: Record<string, string> = {
  HENT:   "/hent",
  HECO:   "/heco",
  HEMP:   "/hemp",
  EXECUTIVE: "/executive",
};

// ─── Palette ─────────────────────────────────────────────────────────────────
// Every colour here is drawn from the executive dashboard — the warm cream and
// the neutral greys the form used to sit on have been replaced with its blues.
const NAVY   = "#102C5E"; // executive header fill — the container colour
const PANEL  = "#F8F9FA"; // executive page background — the right panel
const SECTION= "#185FA5"; // executive section blue — eyebrows and field labels
const BLUEY  = "#8FA9CE"; // supporting copy on navy
const RULE   = "rgba(16,44,94,0.15)"; // hairlines — navy at low opacity
const INK    = NAVY;      // input text

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
    <div className="min-h-screen flex items-center justify-center bg-[#E6F1FB] p-4">
      <div className="w-full sm:max-w-4xl flex flex-col md:flex-row sm:rounded-lg sm:overflow-hidden sm:shadow-2xl">

      {/* ══ LEFT — navy brand panel ══════════════════════════════════════════ */}
      <div
        className="relative w-full md:w-[50%] flex flex-col gap-4 overflow-hidden px-8 py-6 md:px-9 md:py-7"
        style={{ background: NAVY }}
      >
        {/* CHII logo */}
        <div className="relative z-10">
          <img
            src="/logos/CHII-Logo.png"
            alt="Centre for Health Innovation and Impact"
            style={{ height: "40px", width: "auto", objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Headline + mission */}
        <div className="relative z-10">
          <p style={{ fontSize: "10.5px", lineHeight: 1.6, color: BLUEY }}>
            We equip young Africans for dignified work, new ventures, and impact at scale across
            the continent&apos;s health systems. This dashboard tracks what each mission pillar —
            HEMP, HENT and HECO — contributes, with MELA turning the numbers into learning.
          </p>
        </div>

        {/* What the dashboard covers */}
        <ol className="relative z-10 flex flex-col gap-2.5" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {PILLARS.map((item, i) => (
            <li key={item.title} className="flex gap-2.5">
              <span
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  ...EYEBROW,
                  fontSize: "9px",
                  width: 18, height: 18, borderRadius: 999,
                  border: "1px solid rgba(143,169,206,0.4)",
                  color: BLUEY, marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "white", lineHeight: 1.35 }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "10px", lineHeight: 1.5, color: BLUEY, marginTop: 1 }}>
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Contact + copyright */}
        <div className="relative z-10 mt-auto pt-2">
          <p style={{ fontSize: "10px", lineHeight: 1.5, color: BLUEY, marginBottom: "8px" }}>
            For access, questions or suggestions, contact{" "}
            <a href="mailto:admin@chii.alu.edu" className="hover:underline" style={{ color: "white" }}>
              admin
            </a>
            .
          </p>
          <p style={{ ...EYEBROW, fontSize: "8.5px", color: "rgba(255,255,255,0.35)" }}>
            © 2026 CHII
          </p>
        </div>
      </div>

      {/* ══ RIGHT — form panel ═════════════════════════════════════════ */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-8 md:px-10 md:py-8"
        style={{ background: PANEL }}
      >
        <div className="w-full" style={{ maxWidth: "300px" }}>

          {/* Eyebrow + heading */}
          <p style={{ ...EYEBROW, color: SECTION, marginBottom: "10px" }}>Programme Portals</p>
          <h2
            className={display.className}
            style={{ fontSize: "24px", fontWeight: 400, color: NAVY, lineHeight: 1.2, marginBottom: "20px" }}
          >
            Welcome back
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Portal */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ ...EYEBROW, color: SECTION, display: "block", marginBottom: "6px" }}>Portal</label>
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
                  style={{ position: "absolute", right: 0, top: "8px", color: SECTION, pointerEvents: "none" }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ ...EYEBROW, color: SECTION, display: "block", marginBottom: "6px" }}>Email address</label>
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
              <label style={{ ...EYEBROW, color: SECTION, display: "block", marginBottom: "6px" }}>Password</label>
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
                    color: SECTION,
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
                <span style={{ ...EYEBROW, color: SECTION }}>Remember me</span>
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
          <p style={{ fontSize: "11px", color: SECTION, textAlign: "center", marginTop: "16px" }}>
            Need access?{" "}
            <a href="mailto:insights@chii.org" className="hover:underline" style={{ color: NAVY }}>
              Contact your programme lead
            </a>
          </p>

          {/* Partners */}
          <div style={{ borderTop: `1px solid ${RULE}`, marginTop: "20px", paddingTop: "14px" }}>
            <p style={{ ...EYEBROW, color: SECTION, textAlign: "center", marginBottom: "10px" }}>In partnership with</p>
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
