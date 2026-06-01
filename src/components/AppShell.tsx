"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Building2,
  BarChart2,
  ClipboardList,
  Menu,
  X,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import GlobalFilterBar from "./GlobalFilterBar";

const NAV = [
  { href: "/hent",               label: "Overview",                icon: LayoutDashboard },
  { href: "/hent/ventures",      label: "Ventures",                icon: Building2       },
  { href: "/hent/hackathons",    label: "Hackathons",              icon: GitBranch       },
  { href: "/hent/mentorship",    label: "Mentorship & Fellowships",icon: BarChart2       },
  { href: "/hent/fieldvisits",   label: "Field Visits",            icon: ClipboardList   },
];

export default function AppShell({ children, hideSidebar = false }: { children: React.ReactNode; hideSidebar?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={clsx(
        "flex flex-col bg-hent-700 text-white",
        mobile
          ? "w-64 h-full"
          : "hidden lg:flex w-56 min-h-screen flex-shrink-0",
      )}
    >
      {/* Wordmark */}
      <div className="px-5 py-5 border-b border-hent-600 flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center">
          <span className="text-white font-bold text-xs">H</span>
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight tracking-wide">HENT</p>
          <p className="text-[10px] text-hent-200 leading-tight">Venture Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/hent" ? pathname === "/hent" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-hent-100 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-hent-600 space-y-2">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-[11px] text-hent-300 hover:text-white transition-colors"
        >
          <LayoutGrid size={12} />
          Switch portal
        </Link>
        <p className="text-[10px] text-hent-400">
          CHII · ALU · {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — hidden when hideSidebar=true */}
      {!hideSidebar && <Sidebar />}

      {/* Mobile overlay — hidden when hideSidebar=true */}
      {!hideSidebar && mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:px-6">
          {!hideSidebar && (
            <button
              className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          <div className="flex-1">
            <GlobalFilterBar />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
