"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Power } from "lucide-react";

const NAVY   = "#002147";
const VIOLET = "#7C3AED";

export const HEMP_NAV_ITEMS = [
  { label: "Overview",         href: "/hemp"                  },
  { label: "HealthX",          href: "/hemp/healthx"          },
  { label: "Internships",      href: "/hemp/internships"      },
  { label: "Mission Students", href: "/hemp/mission-students" },
] as const;

export type HEMPNavLabel = typeof HEMP_NAV_ITEMS[number]["label"];

export function getHEMPActiveLabel(pathname: string): HEMPNavLabel {
  if (pathname === "/hemp") return "Overview";
  return (
    HEMP_NAV_ITEMS.find(n => n.href !== "/hemp" && pathname.startsWith(n.href))?.label ??
    "Overview"
  );
}

export default function HEMPNav() {
  const pathname = usePathname();
  const activeLabel = getHEMPActiveLabel(pathname);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center h-14 gap-4">

          {/* Logo + wordmark */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <svg viewBox="0 0 200 200" width="34" height="34" aria-label="CHII logo">
              <rect width="200" height="200" rx="24" fill={NAVY} />
              <text x="100" y="97" textAnchor="middle" fill="white"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontWeight="900" fontSize="74">ALU</text>
              <text x="100" y="120" textAnchor="middle"
                fill="rgba(255,255,255,0.65)"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12">CENTRE FOR HEALTH</text>
              <text x="100" y="136" textAnchor="middle"
                fill="rgba(255,255,255,0.65)"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12">INNOVATION &amp;</text>
              <text x="100" y="152" textAnchor="middle"
                fill="rgba(255,255,255,0.65)"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12">IMPACT</text>
            </svg>
            <div>
              <p className="text-sm font-bold leading-none" style={{ color: VIOLET }}>HEMP</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">CHII · ALU</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex items-stretch">
            {HEMP_NAV_ITEMS.map(({ label, href }) => {
              const isActive = activeLabel === label;
              return (
                <Link
                  key={label}
                  href={href}
                  className="relative px-3 h-14 flex items-center text-sm font-medium transition-colors whitespace-nowrap"
                  style={{ color: isActive ? NAVY : "#6b7280" }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full"
                      style={{ backgroundColor: VIOLET }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
            >
              <LayoutGrid size={11} /> Impact Portal
            </Link>
            <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
              <Power size={15} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
