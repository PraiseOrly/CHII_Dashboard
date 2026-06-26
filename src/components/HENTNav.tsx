"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutGrid, ChevronDown, Sun, Moon, Download } from "lucide-react";

const GREEN = "#0E4633";

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

export const HENT_NAV_ITEMS = [
  { label: "Overview",                 href: "/hent/overview"       },
  { label: "Ventures",                 href: "/hent/ventures"       },
  { label: "Masterclasses",            href: "/hent/masterclasses"  },
  { label: "Hackathons",               href: "/hent/hackathons"     },
  { label: "Mentorship & Fellowships", href: "/hent/mentorship"     },
  { label: "Field Visits",             href: "/hent/fieldvisits"    },
] as const;

export type HENTNavLabel = typeof HENT_NAV_ITEMS[number]["label"];

const PORTAL_LINKS = [
  { label: "HEMP", desc: "Employment Pillar",       href: "/hemp",    color: "#0D9488", bg: "#F0FDFA" },
  { label: "HECO", desc: "Ecosystems Pillar",       href: "/heco",    color: "#2563EB", bg: "#EFF6FF" },
  { label: "Executive", desc: "Impact Dashboard",   href: "/impact",  color: "#14306B", bg: "#EFF6FF" },
] as const;

export function getActiveLabel(pathname: string): HENTNavLabel {
  if (pathname === "/hent/overview" || pathname === "/hent") return "Overview";
  return HENT_NAV_ITEMS.find(n => n.href === pathname)?.label ?? "Overview";
}

export default function HENTNav() {
  const pathname = usePathname();
  const activeLabel = getActiveLabel(pathname);
  const [open, setOpen] = useState(false);
  const [dark, toggleTheme] = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 flex items-center h-16 gap-2 sm:gap-3">

        {/* Logo lockup */}
        <Link href="/hent/overview" className="flex items-center gap-2.5 flex-shrink-0 group">
          <span className="flex items-center gap-1.5" style={{ color: "#0E4633" }}>
            <span className="text-[30px] font-semibold tracking-tight leading-none">HEALTH</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">ENTREPRENEURSHIP</span>
              <span className="text-[13px] font-medium tracking-tight">PILLAR</span>
            </span>
          </span>
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

        {/* Tab navigation — horizontally scrollable */}
        <nav className="flex items-stretch justify-center flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {HENT_NAV_ITEMS.map(({ label, href }) => {
            const isActive = label === activeLabel;
            return (
              <Link
                key={label}
                href={href}
                className="relative flex flex-col items-center justify-center px-2.5 sm:px-3 h-16 transition-colors group flex-shrink-0"
                style={{ color: isActive ? GREEN : "rgba(14,70,51,0.5)" }}
              >
                {!isActive && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: "#F1F5F9" }} />
                )}
                <span className="relative text-[12px] font-bold leading-tight whitespace-nowrap">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-t-full"
                    style={{ backgroundColor: GREEN }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right-aligned control group */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border transition-colors flex-shrink-0"
            style={{ borderColor: "#E5E7EB", color: "#6B7280", backgroundColor: "white" }}
          >
            {dark ? <Sun size={12} /> : <Moon size={12} />}
          </button>

          {/* Export */}
          <button
            title="Export"
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border transition-colors flex-shrink-0"
            style={{ borderColor: "#E5E7EB", color: "#6B7280", backgroundColor: "white" }}
          >
            <Download size={12} />
          </button>

          {/* Portals dropdown */}
          <div className="relative flex-shrink-0" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-md border font-medium transition-colors"
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
    </div>
  );
}
