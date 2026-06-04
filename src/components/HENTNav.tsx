"use client";
import { LayoutGrid, Power } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVY = "#002147";
const RED  = "#D4264A";

export const HENT_NAV_ITEMS = [
  { label: "Overview",                 href: "/hent/overview"       },
  { label: "Ventures",                 href: "/hent/ventures"       },
  { label: "Masterclasses",            href: "/hent/masterclasses"  },
  { label: "Hackathons",               href: "/hent/hackathons"     },
  { label: "Mentorship & Fellowships", href: "/hent/mentorship"     },
  { label: "Field Visits",             href: "/hent/fieldvisits"    },
] as const;

export type HENTNavLabel = typeof HENT_NAV_ITEMS[number]["label"];

export function getActiveLabel(pathname: string): HENTNavLabel {
  if (pathname === "/hent/overview" || pathname === "/hent") return "Overview";
  return HENT_NAV_ITEMS.find(n => n.href === pathname)?.label ?? "Overview";
}

export default function HENTNav() {
  const pathname = usePathname();
  const activeLabel = getActiveLabel(pathname);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center h-14 gap-4">

          {/* CHII logo + wordmark */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <svg viewBox="0 0 200 200" width="40" height="40" aria-label="CHII logo">
              <rect width="200" height="200" rx="24" fill={NAVY} />
              <text x="100" y="97" textAnchor="middle" fill="white"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontWeight="900" fontSize="84">ALU</text>
              <text x="100" y="120" textAnchor="middle" fill="rgba(255,255,255,0.65)"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="12">CENTRE FOR HEALTH</text>
              <text x="100" y="136" textAnchor="middle" fill="rgba(255,255,255,0.65)"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="12">INNOVATION &amp;</text>
              <text x="100" y="152" textAnchor="middle" fill="rgba(255,255,255,0.65)"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="12">IMPACT</text>
            </svg>
            <div>
              <p className="text-sm font-bold leading-none" style={{ color: NAVY }}>HENT</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex items-stretch justify-center">

            {HENT_NAV_ITEMS.map(({ label, href }) => {
              const isActive = activeLabel === label;
              return (
                <Link key={label} href={href}
                  className="relative px-3 h-14 flex items-center text-sm font-medium transition-colors whitespace-nowrap"
                  style={{ color: isActive ? NAVY : "#6b7280" }}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full"
                      style={{ backgroundColor: RED }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors">
              <LayoutGrid size={11} /> HENT Portal
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
