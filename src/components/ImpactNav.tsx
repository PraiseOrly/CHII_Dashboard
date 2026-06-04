"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";

const NAVY = "#002147";

export const IMPACT_TABS = [
  { label: "CHII",  href: "/impact",       desc: "Ecosystem Overview",  color: "#002147", bg: "#EFF6FF" },
  { label: "HENT",  href: "/impact/hent",  desc: "Venture Ecosystem",   color: "#7C3AED", bg: "#F5F3FF" },
  { label: "HEMP",  href: "/impact/hemp",  desc: "Health Education",    color: "#0D9488", bg: "#F0FDFA" },
  { label: "HECO",  href: "/impact/heco",  desc: "Health Economics",    color: "#2563EB", bg: "#EFF6FF" },
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
  const pathname = usePathname();
  const activeLabel = getActiveTab(pathname);
  const activeTab = IMPACT_TABS.find((t) => t.label === activeLabel)!;

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
                  style={{
                    color: isActive ? tab.color : "#9CA3AF",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  {tab.desc}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-t-full"
                    style={{ backgroundColor: tab.color }}
                  />
                )}
                {/* Hover bg */}
                {!isActive && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                    style={{ backgroundColor: tab.bg }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Active programme pill */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0"
          style={{ backgroundColor: activeTab.bg, color: activeTab.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTab.color }} />
          {activeTab.desc}
        </div>

        {/* All portals link */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors flex-shrink-0 font-medium"
        >
          <LayoutGrid size={11} /> Portals
        </Link>
      </div>
    </div>
  );
}
