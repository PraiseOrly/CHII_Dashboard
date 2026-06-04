"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const PORTAL_ROUTES: Record<string, string> = {
  HENT:   "/hent",
  HECO:   "/heco",
  HEMP:   "/hemp",
  IMPACT: "/impact",
};

const NAVY = "#002147";
const NAVY_HOVER = "#0d2d5e";

const HIGHLIGHTS = [
  { n: "1", text: "Reach and access across Africa" },
  { n: "2", text: "Youth employment and entrepreneurship outcomes" },
  { n: "3", text: "Impact stories and change pathways. Our MEL framework in action" },
  { n: "4", text: "Recent impact reports" },
];

function ChiiLogo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="200" rx="24" fill="#002147" />
      <text
        x="100"
        y="97"
        textAnchor="middle"
        fill="white"
        fontSize="74"
        fontWeight="900"
        fontFamily="'Arial Black', Impact, Arial, sans-serif"
        letterSpacing="-2"
      >
        ALU
      </text>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="13" fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">CENTER FOR</text>
      <text x="100" y="137" textAnchor="middle" fill="white" fontSize="13" fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">HEALTH INNOVATION</text>
      <text x="100" y="154" textAnchor="middle" fill="white" fontSize="13" fontFamily="Arial, Helvetica, sans-serif" fontWeight="400" letterSpacing="2">AND IMPACT</text>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [portal, setPortal] = useState("HENT");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(PORTAL_ROUTES[portal]), 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      {/* Centered card — both panels contained, not full-viewport */}
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl">

        {/* ── Left panel: login form ── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-8 lg:px-12">
          {/* CHII Logo */}
          <div className="mb-4">
            <ChiiLogo size={48} />
          </div>

          {/* Welcome header */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Sign in to access your programme portals
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portal
              </label>
              <select
                value={portal}
                onChange={(e) => setPortal(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {Object.keys(PORTAL_ROUTES).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                defaultValue="admin@chii.alu.edu"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                defaultValue="password"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded border-gray-300"
                  style={{ accentColor: NAVY }}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium hover:underline"
                style={{ color: NAVY }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 text-white rounded-lg text-sm font-semibold active:scale-[0.99] transition-all disabled:opacity-70"
              style={{ backgroundColor: NAVY }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = NAVY_HOVER; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in to {portal}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-5">
            © {new Date().getFullYear()} Centre for Health Innovation &amp; Entrepreneurship · ALU
          </p>
        </div>

        {/* ── Right panel: CHII branding ── */}
        <div className="hidden lg:flex w-[54%] relative overflow-hidden flex-col">
          {/* CHII navy gradient */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(145deg, #001228 0%, #002147 50%, #0a2d6e 100%)" }}
          />

          {/* Decorative blobs */}
          <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] bg-blue-500/[0.07] rounded-full blur-3xl pointer-events-none" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-10 py-8">
            {/* Centered main content */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-white leading-[1.2] mb-3">
                Health<br />
                Innovation &amp;<br />
                <span className="text-blue-300">Impact.</span>
              </h1>
              <p className="text-blue-100/75 text-sm leading-relaxed mb-5">
                CHII develops ethical and entrepreneurial health leaders through
                mission-driven, experiential learning enabling young Africans to
                access dignified work, build ventures, and drive lasting health
                impact across the continent.
              </p>

              <div className="space-y-3">
                {HIGHLIGHTS.map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      <span className="text-white text-[10px] font-bold">{n}</span>
                    </div>
                    <p className="text-blue-100/85 text-sm leading-snug">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom copyright */}
            <p className="text-blue-300/40 text-xs">
              © {new Date().getFullYear()} African Leadership University
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
