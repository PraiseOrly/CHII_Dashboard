"use client";
// One nav for every portal. Replaces HENTNav / HEMPNav / HECONav, which were
// identical apart from their colour, wordmark and nav items.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sun, Moon, Download, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getPortalTheme, type Portal } from "@/theme/portals";
import { PORTAL_NAVS } from "@/config/navigation";

export default function PortalNav({ portal }: { portal: Portal }) {
  const pathname = usePathname();
  const [isDark, toggleTheme] = useTheme();

  const theme = getPortalTheme(portal);
  const config = PORTAL_NAVS[portal];
  const accent = portal === "hent" ? theme.deep : theme.brand;
  const activeHref = resolveActiveHref(pathname, config.items.map(i => i.href), config.rootHref);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 flex items-center h-16 gap-2 sm:gap-3">

        {/* Wordmark */}
        <Link href={config.rootHref} className="flex items-center gap-2.5 flex-shrink-0 group">
          <span className="flex items-center gap-1.5" style={{ color: accent }}>
            <span className="text-[30px] font-semibold tracking-tight leading-none">{config.wordmark}</span>
            <span className="flex flex-col" style={{ lineHeight: 1.05 }}>
              {config.wordmarkLines.map(line => (
                <span key={line} className="text-[9px] font-medium tracking-tight whitespace-nowrap">{line}</span>
              ))}
            </span>
          </span>
        </Link>

        <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

        {/* Tabs */}
        <nav className="flex items-stretch justify-center flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {config.items.map(({ label, href }) => {
            const isActive = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center justify-center px-2.5 sm:px-3 h-16 transition-colors group flex-shrink-0"
                style={{ color: isActive ? accent : `${accent}80` }}
              >
                {!isActive && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "#F1F5F9" }} />
                )}
                <span className="relative text-[12px] font-bold leading-tight whitespace-nowrap">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-t-full" style={{ backgroundColor: accent }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border transition-colors flex-shrink-0"
            style={{ borderColor: "#E5E7EB", color: "#6B7280", backgroundColor: "white" }}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>

          <button
            title="Export"
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border transition-colors flex-shrink-0"
            style={{ borderColor: "#E5E7EB", color: "#6B7280", backgroundColor: "white" }}
          >
            <Download size={12} />
          </button>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border font-bold uppercase tracking-wide transition-colors flex-shrink-0"
            style={{ borderColor: "#E5E7EB", color: accent, backgroundColor: "white" }}
          >
            <LayoutGrid size={11} />
            {config.wordmark} Portal
          </Link>

          <Link
            href="/"
            title="Sign out"
            className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border font-bold uppercase tracking-wide transition-colors flex-shrink-0"
            style={{ borderColor: "#E5E7EB", color: "#6B7280", backgroundColor: "white" }}
          >
            <LogOut size={11} />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Longest matching href wins, so nested routes don't light up the root tab. */
function resolveActiveHref(pathname: string, hrefs: string[], rootHref: string): string {
  const matches = hrefs
    .filter(href => href !== rootHref && pathname.startsWith(href))
    .sort((a, b) => b.length - a.length);
  return matches[0] ?? rootHref;
}
