"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, Sun, Moon, Download } from "lucide-react";

const NAVY = "#14306B"; // executive navy

function useTheme(): [boolean, () => void] {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : sys;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);
  const toggle = () => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };
  return [dark, toggle];
}

export const HECO_NAV_ITEMS = [
  { label: "Overview", href: "/heco"     },
  { label: "CRA",      href: "/heco/cra" },
] as const;

export type HECONavLabel = typeof HECO_NAV_ITEMS[number]["label"];

export function getHECOActiveLabel(pathname: string): HECONavLabel {
  if (pathname === "/heco") return "Overview";
  return HECO_NAV_ITEMS.find(n => n.href !== "/heco" && pathname.startsWith(n.href))?.label ?? "Overview";
}

export default function HECONav() {
  const pathname = usePathname();
  const activeLabel = getHECOActiveLabel(pathname);
  const [dark, toggleTheme] = useTheme();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 flex items-center h-16 gap-2 sm:gap-3">

        {/* Logo lockup */}
        <Link href="/heco" className="flex items-center gap-2.5 flex-shrink-0 group">
          <span className="flex items-center gap-1.5" style={{ color: NAVY }}>
            <span className="text-[30px] font-semibold tracking-tight leading-none">HECO</span>
            {/* Three stacked lines must sit shorter than the 30px HECO wordmark */}
            <span className="flex flex-col" style={{ lineHeight: 1.05 }}>
              <span className="text-[9px] font-medium tracking-tight">HEALTH</span>
              <span className="text-[9px] font-medium tracking-tight whitespace-nowrap">ECOSYSTEMS</span>
              <span className="text-[9px] font-medium tracking-tight">PILLAR</span>
            </span>
          </span>
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

        {/* Tab navigation */}
        <nav className="flex items-stretch justify-center flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {HECO_NAV_ITEMS.map(({ label, href }) => {
            const isActive = label === activeLabel;
            return (
              <Link
                key={label}
                href={href}
                className="relative flex flex-col items-center justify-center px-2.5 sm:px-3 h-16 transition-colors group flex-shrink-0"
                style={{ color: isActive ? NAVY : "rgba(20,48,107,0.5)" }}
              >
                {!isActive && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: "#F1F5F9" }} />
                )}
                <span className="relative text-[12px] font-bold leading-tight whitespace-nowrap">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-t-full"
                    style={{ backgroundColor: NAVY }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right-aligned control group */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
          <button
            onClick={toggleTheme}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border transition-colors flex-shrink-0"
            style={{ borderColor: "#E5E7EB", color: "#6B7280", backgroundColor: "white" }}
          >
            {dark ? <Sun size={12} /> : <Moon size={12} />}
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
            style={{ borderColor: "#E5E7EB", color: NAVY, backgroundColor: "white" }}
          >
            <LayoutGrid size={11} />
            HECO Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
