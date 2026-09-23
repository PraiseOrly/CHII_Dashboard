"use client";
// One nav for every portal. Replaces HENTNav / HEMPNav / HECONav, which were
// identical apart from their colour, wordmark and nav items.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, LogOut, Menu, X } from "lucide-react";
import { getPortalTheme, type Portal } from "@/theme/portals";
import { PORTAL_NAVS } from "@/config/navigation";

export default function PortalNav({ portal }: { portal: Portal }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = getPortalTheme(portal);
  const config = PORTAL_NAVS[portal];
  const accent = portal === "hent" ? theme.deep : theme.brand;
  // HEMP's tab labels match the executive dashboard's navy exactly.
  const tabAccent = portal === "hemp" ? "#042C53" : accent;
  const activeHref = resolveActiveHref(pathname, config.items.map(i => i.href), config.rootHref);

  // Route changes should close any open mobile menu.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="border-b border-gray-200 sticky top-0 z-50" style={{ backgroundColor: "var(--bg-surface)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 flex items-center h-16 gap-2 sm:gap-3">

        {/* Wordmark */}
        <Link href={config.rootHref} className="flex items-center gap-2.5 flex-shrink-0 group">
          {portal === "hemp" ? (
            <span className="flex items-center gap-4" style={{ color: accent }}>
              <span className="flex items-center gap-1.5">
                <span className="text-[30px] font-semibold tracking-tight leading-none">HM</span>
                <span className="flex flex-col" style={{ lineHeight: 1.05 }}>
                  <span className="text-[9px] font-medium tracking-tight whitespace-nowrap">HEALTH</span>
                  <span className="text-[9px] font-medium tracking-tight whitespace-nowrap">MISSIONS</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[30px] font-semibold tracking-tight leading-none">HEMP</span>
                <span className="flex flex-col" style={{ lineHeight: 1.05 }}>
                  <span className="text-[9px] font-medium tracking-tight whitespace-nowrap">HEALTH</span>
                  <span className="text-[9px] font-medium tracking-tight whitespace-nowrap">EMPLOYMENT</span>
                </span>
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5" style={{ color: accent }}>
              <span className="text-[30px] font-semibold tracking-tight leading-none">{config.wordmark}</span>
              <span className="flex flex-col" style={{ lineHeight: 1.05 }}>
                {config.wordmarkLines.map(line => (
                  <span key={line} className="text-[9px] font-medium tracking-tight whitespace-nowrap">{line}</span>
                ))}
              </span>
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

        {/* Tabs — full row once there's room for the longest portal's items, collapses to a hamburger menu below */}
        <nav className="hidden xl:flex items-stretch justify-center flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {config.items.map(({ label, href }) => {
            const isActive = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center justify-center px-2.5 sm:px-3 h-16 transition-colors group flex-shrink-0"
                style={{ color: isActive ? tabAccent : `${tabAccent}80` }}
              >
                {!isActive && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "var(--bg-surface-raised)" }} />
                )}
                <span className="relative text-[12px] font-bold leading-tight whitespace-nowrap">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-t-full" style={{ backgroundColor: tabAccent }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
          <button
            onClick={() => setMenuOpen(open => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="xl:hidden flex items-center justify-center w-8 h-8 rounded-md border transition-colors flex-shrink-0"
            style={{ borderColor: "var(--border-default)", color: accent, backgroundColor: "var(--bg-surface)" }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <button
            title="Export"
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border transition-colors flex-shrink-0"
            style={{ borderColor: "var(--border-default)", color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}
          >
            <Download size={12} />
          </button>

          <Link
            href="/"
            title="Sign out"
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border font-bold uppercase tracking-wide transition-colors flex-shrink-0"
            style={{ borderColor: "var(--border-default)", color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}
          >
            <LogOut size={10} />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>

      {/* Mobile/tablet menu — mirrors the desktop tabs as a vertical list */}
      {menuOpen && (
        <nav className="xl:hidden border-t border-gray-200 px-3 py-2 flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ backgroundColor: "var(--bg-surface)" }}>
          {config.items.map(({ label, href }) => {
            const isActive = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center px-3 py-3 rounded-md text-[13px] font-bold transition-colors"
                style={{
                  color: isActive ? tabAccent : "var(--text-secondary)",
                  backgroundColor: isActive ? `${tabAccent}14` : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
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
