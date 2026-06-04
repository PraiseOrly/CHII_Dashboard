"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutGrid, ChevronDown } from "lucide-react";

const NAVY = "#002147";

export const IMPACT_TABS = [
  { label: "CHII",  href: "/impact",       desc: "Ecosystem Overview",       color: "#002147", bg: "#EFF6FF" },
  { label: "HENT",  href: "/impact/hent",  desc: "Entrepreneurship Pillar",  color: "#7C3AED", bg: "#F5F3FF" },
  { label: "HEMP",  href: "/impact/hemp",  desc: "Employment Pillar",        color: "#0D9488", bg: "#F0FDFA" },
  { label: "HECO",  href: "/impact/heco",  desc: "Ecosystems Pillar",        color: "#2563EB", bg: "#EFF6FF" },
] as const;

const PORTAL_LINKS = [
  { label: "HENT",   desc: "Entrepreneurship Pillar",  href: "/hent/overview", color: "#7C3AED", bg: "#F5F3FF" },
  { label: "HEMP",   desc: "Employment Pillar",        href: "/hemp",          color: "#0D9488", bg: "#F0FDFA" },
  { label: "HECO",   desc: "Ecosystems Pillar",        href: "/heco",          color: "#2563EB", bg: "#EFF6FF" },
] as const;

export type ImpactTabLabel = typeof IMPACT_TABS[number]["label"];

function getActiveTab(pathname: string): ImpactTabLabel {
  if (pathname === "/impact") return "CHII";
  if (pathname.startsWith("/impact/hent")) return "HENT";
  if (pathname.startsWith("/impact/hemp")) return "HEMP";
  if (pathname.startsWith("/impact/heco")) return "HECO";
  return "CHII";
}

export default function ImpactNav() {
  const pathname    = usePathname();
  const activeLabel = getActiveTab(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-6 flex items-center h-14 gap-4">

        {/* Logo + wordmark */}
        <Link href="/impact" className="flex items-center gap-2.5 flex-shrink-0 group">
          <svg viewBox="0 0 200 200" width="34" height="34" aria-label="CHII">
            <rect width="200" height="200" rx="22" fill={NAVY} />
            <text x="100" y="95" textAnchor="middle" fill="white"
              fontFamily="Inter, ui-sans-serif, sans-serif" fontWeight="900" fontSize="82">ALU</text>
            <text x="100" y="118" textAnchor="middle" fill="rgba(255,255,255,0.6)"
              fontFamily="Inter, ui-sans-serif, sans-serif" fontSize="11.5">CENTRE FOR HEALTH</text>
            <text x="100" y="134" textAnchor="middle" fill="rgba(255,255,255,0.6)"
              fontFamily="Inter, ui-sans-serif, sans-serif" fontSize="11.5">INNOVATION &amp;</text>
            <text x="100" y="150" textAnchor="middle" fill="rgba(255,255,255,0.6)"
              fontFamily="Inter, ui-sans-serif, sans-serif" fontSize="11.5">IMPACT</text>
          </svg>
          <div className="hidden sm:block">
            <p className="text-[13px] font-black leading-none" style={{ color: NAVY }}>Impact</p>
            <p className="text-[9px] text-gray-400 mt-0.5 font-medium tracking-wide">CHII Analytics Platform</p>
          </div>
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

        {/* Tab navigation — centered */}
        <nav className="flex items-stretch flex-1 justify-center">
          {IMPACT_TABS.map((tab) => {
            const isActive = tab.label === activeLabel;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="relative flex flex-col items-center justify-center px-5 h-14 transition-colors group"
                style={{ color: isActive ? tab.color : "#6B7280" }}
              >
                <span className="text-[13px] font-bold leading-tight">{tab.label}</span>
                <span
                  className="text-[9px] font-medium mt-0.5 transition-opacity"
                  style={{ color: isActive ? tab.color : "#9CA3AF", opacity: isActive ? 1 : 0 }}
                >
                  {tab.desc}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-t-full"
                    style={{ backgroundColor: tab.color }} />
                )}
                {!isActive && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                    style={{ backgroundColor: tab.bg }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Portals dropdown */}
        <div className="relative flex-shrink-0" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="hidden sm:flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded border font-medium transition-colors"
            style={{
              borderColor: open ? "#9CA3AF" : "#E5E7EB",
              color: open ? "#111827" : "#6B7280",
              backgroundColor: open ? "#F9FAFB" : "white",
            }}
          >
            <LayoutGrid size={11} />
            Portals
            <ChevronDown size={10} className="transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-gray-50">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Switch Portal</p>
              </div>
              {PORTAL_LINKS.map((p) => (
                <Link
                  key={p.label}
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: p.bg }}>
                    <span className="text-[10px] font-black" style={{ color: p.color }}>{p.label[0]}</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900 leading-none">{p.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
