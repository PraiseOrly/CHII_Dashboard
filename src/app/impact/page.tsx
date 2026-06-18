"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  AlertCircle, Award, Briefcase, CheckCircle, Clock,
  Download, FileText, Globe, GraduationCap, Handshake,
  Heart, Moon, Star, Sun, Target, TrendingUp, Users, Zap,
} from "lucide-react";

import { healthXSessions } from "@/data/hemp/healthx";
import { internships } from "@/data/hemp/internships";
import { missionStudents } from "@/data/hemp/missionStudents";
import { hackathons } from "@/data/hackathons";
import { masterclasses } from "@/data/masterclasses";
import { fieldVisits } from "@/data/fieldVisits";
import { mentorshipPrograms } from "@/data/mentorships";
import { ventures } from "@/data/ventures";
import Link from "next/link";
import AfricaChoropleth from "./AfricaChoropleth";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Legend, Line, LineChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, Treemap, XAxis, YAxis,
} from "recharts";

// ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Palette ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬
// Design tokens — blue (access) · teal (outcomes) · amber (attention only) · indigo (categorical)
const B50   = "#E6F1FB";  // Blue  50  — ACCESS card fill
const B200  = "#85B7EB";  // Blue 200
const B400  = "#378ADD";  // Blue 400
const B600  = "#185FA5";  // Blue 600  — hero fill · access label · section bar
const B800  = "#0C447C";  // Blue 800  — ACCESS number text
const B900  = "#042C53";  // Blue 900  — chart headers · deep anchors
const T50   = "#E1F5EE";  // Teal  50  — OUTCOME card fill
const T400  = "#1D9E75";  // Teal 400
const T600  = "#0F6E56";  // Teal 600  — OUTCOME label · section bar
const T800  = "#085041";  // Teal 800  — OUTCOME number text
const AM400 = "#BA7517";  // Amber 400 — attention / "seeking" slice only
const IN400 = "#7F77DD";  // Indigo 400 — fourth categorical hue
const IN600 = "#534AB7";  // Indigo 600
const G50   = "#F1EFE8";  // Gray  50  — QUALITY card fill
const G600  = "#5F5E5A";  // Gray 600  — QUALITY label
const G900  = "#2C2C2A";  // Gray 900  — QUALITY number
const EXEC_BG = "#F8F9FA"; // Page background — very pale neutral
// Semantic aliases (keep chart/data references working)
const NAVY   = B900;
const TEAL   = T400;
const GREEN  = T600;
const AMBER  = AM400;
const SKY    = B200;
const INDIGO = IN400;
const VIOLET = IN600;
const ROSE   = AM400;
const ORANGE = T400;

// ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Helpers ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function fmt(n: number) { return Math.round(n).toLocaleString(); }
function pct(n: number) { return `${Math.round(n)}%`; }

function useDarkMode(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const fn = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return dark;
}
function useCountUp(target: number, duration = 800): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const id = requestAnimationFrame(function tick(now) {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    });
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

// ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Contextual filter components ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬

// Pill group  -  sits in coloured card headers (dark background)
function PillGroup<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full gap-px p-0.5" style={{ backgroundColor: "rgba(0,0,0,0.18)" }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[9px] font-bold px-2.5 py-[3px] rounded-full transition-all whitespace-nowrap leading-none"
            style={{
              backgroundColor: active ? "rgba(255,255,255,0.95)" : "transparent",
              color: active ? "#111827" : "rgba(255,255,255,0.72)",
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// Dropdown  -  compact select for coloured card headers (dark background)
function HeaderDropdown<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}
      className="text-[9px] font-bold rounded border appearance-none cursor-pointer focus:outline-none pl-2 pr-5 py-[5px]"
      style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        color: "white",
        borderColor: "rgba(255,255,255,0.25)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-opacity='0.75' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 6px center",
      }}>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ color: "#111827", backgroundColor: "white" }}>{o.label}</option>
      ))}
    </select>
  );
}

// Segmented tab  -  sits inside white card bodies (light background)
function SegTab<T extends string>({ options, value, onChange, accent }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  accent: string;
}) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="text-[10px] font-semibold px-3 py-1.5 transition-all whitespace-nowrap border-r border-gray-200 last:border-0"
            style={{ backgroundColor: active ? accent : "white", color: active ? "white" : "#6B7280" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// -- Sidebar rail components -------------------------------------------------

const YOUTH_PWD       = 47;
const REFUGEES        = 23;
const EMPLOYER_RATING = 4.6;

function PersonIcon({ color, outline = false }: { color: string; outline?: boolean }) {
  return (
    <svg width="11" height="14" viewBox="0 0 12 15" fill="none">
      <circle cx="6" cy="4" r="2.8"
        fill={outline ? "none" : color}
        stroke={outline ? color : "none"}
        strokeWidth="1.3" />
      <path d="M1 14.5c0-2.761 2.239-5 5-5s5 2.239 5 5"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RailLabel({ label, top = false }: { label: string; top?: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-md mb-3 ${top ? "" : "mt-4"}`}
      style={{ backgroundColor: NAVY }}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white leading-none">{label}</p>
    </div>
  );
}

function SideCard({
  label, big, denom, yoy, femPct, malePct,
}: {
  label: string;
  big: string | number;
  denom?: string | number;
  yoy?: number | null;
  femPct?: number;
  malePct?: number;
}) {
  return (
    <div className="cursor-default transition-transform duration-200 hover:-translate-y-0.5 rounded-lg"
      style={{ backgroundColor: "#2F5FD1", padding: "10px 12px" }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", lineHeight: 1, letterSpacing: "-0.02em" }}>{big}</span>
        {denom !== undefined && (
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>/ {denom}</span>
        )}
      </div>
      {yoy != null && (
        <p style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: yoy >= 0 ? "#B6F2C5" : "#FCA5A5" }}>
          {yoy >= 0 ? "↑" : "↓"} {Math.abs(yoy)}% YoY
        </p>
      )}
      {femPct != null && (
        <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.50)", marginTop: 3 }}>
          {femPct}% F · {100 - femPct}% M
        </p>
      )}
    </div>
  );
}

// -- UI atoms ----------------------------------------------------------------
function SecHeader({ title, sub, accent = VIOLET }: { title: string; sub?: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: accent }}>{title}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, sub, accent = VIOLET, children, filter }: {
  title: string; sub?: string; accent?: string;
  children: React.ReactNode; filter?: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  async function handleDownload() {
    if (!cardRef.current) return;
    const h2c = (await import("html2canvas")).default;
    const canvas = await h2c(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const a = document.createElement("a");
    a.download = title.replace(/[^a-z0-9]/gi, "_") + ".png";
    a.href = canvas.toDataURL();
    a.click();
  }
  return (
    <div ref={cardRef} className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 flex items-start justify-between gap-3" style={{ backgroundColor: accent }}>
        <div className="flex items-start gap-2.5">
          <div className="w-[3px] h-[14px] rounded-full mt-[1px] flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.72)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] leading-none text-white">{title}</p>
            {sub && <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.70)" }}>{sub}</p>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {filter}
          <button onClick={handleDownload} title="Download chart"
            style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}>
            <Download size={12} />
          </button>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function KpiTile({ label, num, displayFmt, sub, clr }: {
  label: string; num: number; displayFmt: (n: number) => string; sub: string; clr: string;
}) {
  const animated = useCountUp(num);
  return (
    <div className="rounded-lg border px-3 py-3 text-center transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: clr, borderColor: clr }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-tight mb-1.5"
        style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
      <p className="text-[1.15rem] font-black tabular-nums leading-none text-white">{displayFmt(animated)}</p>
      <p className="text-[8px] mt-1 font-medium" style={{ color: "rgba(255,255,255,0.58)" }}>{sub}</p>
    </div>
  );
}

function InsightCard({ label, value, sub, note, color, icon: Icon }: {
  label: string; value: string | number; sub?: string; note?: string;
  color: string; icon?: typeof TrendingUp;
}) {
  return (
    <div className="rounded-lg border p-4 shadow-sm transition-transform hover:scale-[1.01]"
      style={{ backgroundColor: color, borderColor: color }}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] leading-none"
          style={{ color: "rgba(255,255,255,0.68)" }}>{label}</p>
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
            <Icon size={13} style={{ color: "rgba(255,255,255,0.9)" }} />
          </div>
        )}
      </div>
      <p className="text-2xl font-black tabular-nums leading-none text-white">{value}</p>
      {sub  && <p className="text-[9px] mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.72)" }}>{sub}</p>}
      {note && <p className="text-[9px] mt-2 pt-2 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.52)", borderTop: "1px solid rgba(255,255,255,0.16)" }}>{note}</p>}
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />{label}
      </span>
      <span className="font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{fmt(value)}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: color + "22" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function CustomDonut({ data, colors, label, valueFormatter = String, size = 160 }: {
  data: { name: string; value: number }[];
  colors: string[]; label?: string; valueFormatter?: (v: number) => string; size?: number;
}) {
  const [hov, setHov] = useState<{ name: string; value: number; color: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const CX = size / 2, CY = size / 2, OR = size * 0.43, IR = size * 0.265;
  let theta = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const t0 = theta; const t1 = theta + sweep; theta = t1;
    const lg = sweep > Math.PI ? 1 : 0;
    const path = [
      `M ${CX + OR * Math.cos(t0)} ${CY + OR * Math.sin(t0)}`,
      `A ${OR} ${OR} 0 ${lg} 1 ${CX + OR * Math.cos(t1)} ${CY + OR * Math.sin(t1)}`,
      `L ${CX + IR * Math.cos(t1)} ${CY + IR * Math.sin(t1)}`,
      `A ${IR} ${IR} 0 ${lg} 0 ${CX + IR * Math.cos(t0)} ${CY + IR * Math.sin(t0)}`, "Z",
    ].join(" ");
    return { path, fill: colors[i % colors.length], name: d.name, value: d.value };
  });
  return (
    <div className="relative flex items-center justify-center w-full h-full"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", height: "100%" }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth="2"
            style={{ cursor: "pointer", opacity: hov && hov.name !== s.name ? 0.4 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={() => setHov({ name: s.name, value: s.value, color: s.fill })}
            onMouseLeave={() => setHov(null)} />
        ))}
        {label && (
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#111827" fontSize={size * 0.125} fontWeight="900" fontFamily="Inter, sans-serif">
            {label}
          </text>
        )}
      </svg>
      {hov && (
        <div className="absolute pointer-events-none z-20 rounded px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: hov.color, left: pos.x, top: pos.y - 34, transform: "translateX(-50%)" }}>
          {hov.name}: {valueFormatter(hov.value)}
        </div>
      )}
    </div>
  );
}

// ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Constants ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
type YearVal = typeof YEARS[number] | "all";

const HACK_CATS = ["AI/Technology", "Health", "Business", "Sustainability", "Other"] as const;
type HackCat = typeof HACK_CATS[number] | "all";

const SECTORS_HEMP = ["Hospital", "NGO", "Government", "MedTech", "Pharma", "Research"] as const;

type PeriodVal = "all" | "q1" | "q2" | "q3" | "q4" | "h1" | "h2";

const PERIOD_MONTHS: Record<PeriodVal, number[]> = {
  all: [],
  q1:  [1, 2, 3],
  q2:  [4, 5, 6],
  q3:  [7, 8, 9],
  q4:  [10, 11, 12],
  h1:  [1, 2, 3, 4, 5, 6],
  h2:  [7, 8, 9, 10, 11, 12],
};

const MONTH_ABBR: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4,  May: 5,  Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

const PERIOD_LABELS: Record<PeriodVal, string> = {
  all: "Annual",
  q1: "Q1 - Jan to Mar", q2: "Q2 - Apr to Jun",
  q3: "Q3 - Jul to Sep", q4: "Q4 - Oct to Dec",
  h1: "H1 - Jan to Jun", h2: "H2 - Jul to Dec",
};

// ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Page ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬
export default function ImpactDashboard() {
  // ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Filter state ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬
  const sysDark    = useDarkMode();
  const [manualDark, setManualDark] = useState<boolean | null>(null);
  const dark = manualDark !== null ? manualDark : sysDark;
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const [yearFilter,   setYearFilter]   = useState<YearVal>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodVal>("all");
  const [catFilter,    setCatFilter]    = useState<HackCat>("all");
  const [streamFilter, setStreamFilter] = useState<"all" | "hemp" | "hent">("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  // Analytical drill-down states
  const [growthView,    setGrowthView]    = useState<"participation" | "quality">("participation");
  const [pipelineSector, setPipelineSector] = useState("all");

  // ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Filtered data ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬
  const D = useMemo(() => {
    const yr    = yearFilter;
    const months = PERIOD_MONTHS[periodFilter]; // empty array = no month filter

    const inPeriod = (month: number) => months.length === 0 || months.includes(month);
    const inPeriodStr = (monthStr: string) => {
      if (months.length === 0) return true;
      const m = MONTH_ABBR[monthStr];
      return m !== undefined && months.includes(m);
    };

    const hx  = healthXSessions.filter((h) => (yr === "all" || h.year === yr) && inPeriodStr(h.month));
    const int = internships.filter((i) => yr === "all" || i.year === yr);          // year-level only
    const ms  = missionStudents.filter((s) => yr === "all" || s.cohort === yr);    // cohort-level only
    const hak = hackathons.filter((h) => yr === "all" || h.year === yr);           // year-level only
    const mc  = masterclasses.filter((m) => (yr === "all" || m.year === yr) && inPeriod(m.month));
    const fv  = fieldVisits.filter((v) => (yr === "all" || v.year === yr) && inPeriod(v.month));
    const mf  = mentorshipPrograms.filter((p) => (yr === "all" || p.year === yr) && inPeriod(p.month));
    const vc  = ventures.filter((v) => yr === "all" || v.cohort === yr);

    // HEMP
    const hxPart      = hx.reduce((s, h) => s + h.participants, 0);
    const hxFem       = hx.reduce((s, h) => s + h.femalePart, 0);
    const hxPartners  = hx.reduce((s, h) => s + h.partnerships, 0);
    const hxAvgCompl  = Math.round(avg(hx.map((h) => h.completionRate)));
    const hxAvgSat    = parseFloat(avg(hx.map((h) => avg(Object.values(h.scores)))).toFixed(1));

    const intStudents  = int.reduce((s, i) => s + i.students, 0);
    const intFem       = int.reduce((s, i) => s + i.femaleStudents, 0);
    const intConv      = int.reduce((s, i) => s + i.employmentConversions, 0);
    const intAvgSat    = parseFloat(avg(int.map((i) => i.satisfactionScore)).toFixed(1));
    const intPlace     = int.reduce((s, i) => s + i.placementsAfterInternship, 0);

    const msTotal     = ms.length;
    const msFem       = ms.filter((s) => s.gender === "Female").length;
    const msCompleted = ms.filter((s) => s.status === "Completed");
    const msEmployed  = msCompleted.filter((s) => s.employment === "Employed" || s.employment === "Entrepreneur");
    const msVentures  = ms.filter((s) => s.ventureCreated).length;
    const msCompPct   = msTotal ? Math.round((msCompleted.length / msTotal) * 100) : 0;
    // Disaggregated outcome breakdowns for metric columns
    const msWageOnly  = msCompleted.filter((s) => s.employment === "Employed").length;
    const msEntOnly   = msCompleted.filter((s) => s.employment === "Entrepreneur").length;
    const msSeeking   = msCompleted.filter((s) => s.employment === "Seeking").length;
    const msFurther   = msCompleted.filter((s) => s.employment === "Further Study").length;

    // HENT
    const hakPart    = hak.reduce((s, h) => s + h.participants, 0);
    const hakFem     = hak.reduce((s, h) => s + h.femaleCount, 0);
    const hakProj    = hak.reduce((s, h) => s + h.projects, 0);
    const hakStart   = hak.reduce((s, h) => s + h.startupsCreated, 0);
    const hakPartners = hak.reduce((s, h) => s + h.partnerships, 0);

    const mcAtt      = mc.reduce((s, m) => s + m.attendees, 0);
    const mcFem      = mc.reduce((s, m) => s + m.femaleAttendees, 0);
    const mcAvgCompl = Math.round(avg(mc.map((m) => m.completionRate)));
    const mcAvgSat   = parseFloat(avg(mc.map((m) => avg(Object.values(m.scores)))).toFixed(1));

    const fvPart     = fv.reduce((s, v) => s + v.participants, 0);
    const fvFem      = fv.reduce((s, v) => s + v.femaleParticipants, 0);
    const fvAvgCompl = Math.round(avg(fv.map((v) => v.completionRate)));
    const fvAvgSat   = parseFloat(avg(fv.map((v) => avg(Object.values(v.scores)))).toFixed(1));
    const fvPartners = fv.reduce((s, v) => s + v.partnerships, 0);

    const mfFel      = mf.reduce((s, p) => s + p.fellows, 0);
    const mfFem      = mf.reduce((s, p) => s + p.femaleFellows, 0);
    const mfAvgCompl = Math.round(avg(mf.map((p) => p.completionRate)));
    const mfAvgSat   = parseFloat(avg(mf.map((p) => avg(Object.values(p.scores)))).toFixed(1));
    const mfGrad     = mf.filter((p) => p.isOneYearFellowship).reduce((s, p) => s + p.graduateFellows, 0);

    // Unified
    const totalFem  = hxFem + intFem + msFem + hakFem + mcFem + fvFem + mfFem;
    const hempTotal = hxPart + intStudents + msTotal;
    const hentTotal = hakPart + mcAtt + fvPart + mfFel;
    const grandTotal = hempTotal + hentTotal;
    const femalePct = grandTotal ? Math.round((totalFem / grandTotal) * 100) : 0;

    const totalPartners = hxPartners + hakPartners + fvPartners;
    const venturesTotal = vc.length + msVentures + hakStart;
    const employmentOut = intConv + msEmployed.length;
    const avgSat        = parseFloat(avg([hxAvgSat, intAvgSat, mcAvgSat, fvAvgSat, mfAvgSat].filter((x) => x > 0)).toFixed(1));
    const avgCompl      = Math.round(avg([hxAvgCompl, mcAvgCompl, fvAvgCompl, mfAvgCompl, msCompPct].filter((x) => x > 0)));

    // Category-filtered hackathon totals
    const filteredHakProj = catFilter === "all"
      ? hakProj
      : hak.reduce((s, h) => s + (h.categories[catFilter as keyof typeof h.categories] ?? 0), 0);

    const hakCatTotals = HACK_CATS.map((cat) => ({
      name: cat,
      value: hak.reduce((s, h) => s + (h.categories[cat as keyof typeof h.categories] ?? 0), 0),
    }));

    // Countries
    const allCountries = Array.from(new Set([
      ...hx.map((h) => h.country),
      ...int.map((i) => i.country),
      ...hak.map((h) => h.location.split(", ").pop() ?? ""),
      ...fv.map((v) => v.country),
    ])).filter(Boolean);

    // Stream distribution (applying streamFilter)
    const streamDist = streamFilter === "hemp"
      ? [{ name: "HealthX", value: hxPart }, { name: "Internships", value: intStudents }, { name: "Mission", value: msTotal }]
      : streamFilter === "hent"
      ? [{ name: "Hackathons", value: hakPart }, { name: "Masterclasses", value: mcAtt }, { name: "Field Visits", value: fvPart }, { name: "Mentorship", value: mfFel }]
      : [
          { name: "Health Education", value: hxPart + mcAtt + fvPart },
          { name: "Workforce Dev.", value: intStudents + msTotal },
          { name: "Innovation", value: hakPart },
          { name: "Leadership", value: mfFel },
        ];

    // Gender-filtered display values

    // Quality comparison
    const programQuality = [
      { name: "HealthX",      sat: hxAvgSat,   compl: hxAvgCompl,  color: TEAL   },
      { name: "Internships",  sat: intAvgSat,  compl: 100,         color: AMBER  },
      { name: "Masterclasses",sat: mcAvgSat,   compl: mcAvgCompl,  color: SKY    },
      { name: "Field Visits", sat: fvAvgSat,   compl: fvAvgCompl,  color: INDIGO },
      { name: "Mentorship",   sat: mfAvgSat,   compl: mfAvgCompl,  color: VIOLET },
    ];

    const jobsFromVC = vc.reduce((s, v) => s + (v.jobsTotal ?? v.jobs6m ?? 0), 0);

    return {
      // raw filtered slices for charts
      hx, int: int, ms, hak, mc, fv, mf, vc,
      // HEMP
      hxPart, hxFem, hxPartners, hxAvgCompl, hxAvgSat,
      intStudents, intFem, intConv, intAvgSat, intPlace,
      msTotal, msFem, msCompleted, msEmployed, msVentures, msCompPct,
      // HENT
      hakPart, hakFem, hakProj, hakStart, hakPartners,
      mcAtt, mcFem, mcAvgCompl, mcAvgSat,
      fvPart, fvFem, fvAvgCompl, fvAvgSat, fvPartners,
      mfFel, mfFem, mfAvgCompl, mfAvgSat, mfGrad,
      // Unified
      totalFem, hempTotal, hentTotal, grandTotal, femalePct,
      totalPartners, venturesTotal, employmentOut, avgSat, avgCompl,
      filteredHakProj, hakCatTotals, allCountries, streamDist,
      programQuality,
      // Metric column extras
      msWageOnly, msEntOnly, msSeeking, msFurther, jobsFromVC,
    };
  }, [yearFilter, periodFilter, catFilter, streamFilter]);

  // ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ Year trend data ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬ÃƒÂ¢"Ã¢â€šÂ¬
  const growthByYear = useMemo(() =>
    YEARS.map((yr) => {
      const hemp =
        healthXSessions.filter((h) => h.year === yr).reduce((s, h) => s + h.participants, 0) +
        internships.filter((i) => i.year === yr).reduce((s, i) => s + i.students, 0) +
        missionStudents.filter((s) => s.cohort === yr).length;
      const hent =
        hackathons.filter((h) => h.year === yr).reduce((s, h) => s + h.participants, 0) +
        masterclasses.filter((m) => m.year === yr).reduce((s, m) => s + m.attendees, 0) +
        fieldVisits.filter((v) => v.year === yr).reduce((s, v) => s + v.participants, 0) +
        mentorshipPrograms.filter((p) => p.year === yr).reduce((s, p) => s + p.fellows, 0);
      // Quality metrics by year (for quality view)
      const yrHx = healthXSessions.filter((h) => h.year === yr);
      const yrMc = masterclasses.filter((m) => m.year === yr);
      const yrFv = fieldVisits.filter((v) => v.year === yr);
      const yrMf = mentorshipPrograms.filter((p) => p.year === yr);
      const complVals = [
        avg(yrHx.map((h) => h.completionRate)),
        avg(yrMc.map((m) => m.completionRate)),
        avg(yrFv.map((v) => v.completionRate)),
        avg(yrMf.map((p) => p.completionRate)),
      ].filter((v) => v > 0);
      const satVals = [
        avg(yrHx.map((h) => avg(Object.values(h.scores)))),
        avg(yrMc.map((m) => avg(Object.values(m.scores)))),
        avg(yrFv.map((v) => avg(Object.values(v.scores)))),
        avg(yrMf.map((p) => avg(Object.values(p.scores)))),
      ].filter((v) => v > 0);
      return {
        Year: String(yr),
        "Health Ed.": hemp,
        "Venture Eco.": hent,
        Total: hemp + hent,
        "Completion %": complVals.length ? Math.round(avg(complVals)) : 0,
        "Satisfaction ÃƒÆ’Ã¢â‚¬â€20": satVals.length ? Math.round(avg(satVals) * 20) : 0,
      };
    }).filter((d) => d.Total > 0),
  [yearFilter]);

  // Sector-level conversion rate analysis (analytical: reveals which sectors drive outcomes)
  const sectorConversionRates = useMemo(() =>
    SECTORS_HEMP.map((sec) => {
      const secInterns = internships.filter((i) => i.sector === sec);
      const students   = secInterns.reduce((s, i) => s + i.students, 0);
      const converted  = secInterns.reduce((s, i) => s + i.employmentConversions, 0);
      const placed     = secInterns.reduce((s, i) => s + i.placementsAfterInternship, 0);
      return {
        Sector: sec,
        "Conv. Rate %": students > 0 ? Math.round((converted / students) * 100) : 0,
        "Placement Rate %": students > 0 ? Math.round((placed / students) * 100) : 0,
        students,
      };
    }).filter((d) => d.students > 0).sort((a, b) => b["Conv. Rate %"] - a["Conv. Rate %"]),
  []);

  const outcomesByYear = useMemo(() =>
    YEARS.map((yr) => {
      const base = pipelineSector === "all"
        ? internships.filter((i) => i.year === yr)
        : internships.filter((i) => i.year === yr && i.sector === pipelineSector);
      return {
        Year: String(yr),
        Placed:    base.reduce((s, i) => s + i.placementsAfterInternship, 0),
        Converted: base.reduce((s, i) => s + i.employmentConversions, 0),
      };
    }).filter((d) => d.Placed + d.Converted > 0),
  [pipelineSector]);

  const yoyReach = useMemo(() => {
    const total = (yr: number) =>
      healthXSessions.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0) +
      internships.filter(i => i.year === yr).reduce((s, i) => s + i.students, 0) +
      missionStudents.filter(s => s.cohort === yr).length +
      hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.participants, 0) +
      masterclasses.filter(m => m.year === yr).reduce((s, m) => s + m.attendees, 0) +
      fieldVisits.filter(v => v.year === yr).reduce((s, v) => s + v.participants, 0) +
      mentorshipPrograms.filter(p => p.year === yr).reduce((s, p) => s + p.fellows, 0);
    const y25 = total(2025), y24 = total(2024);
    return y24 > 0 ? Math.round(((y25 - y24) / y24) * 100) : null;
  }, []);


  const economicTrend = useMemo(() =>
    YEARS.map(yr => ({
      Year:        String(yr),
      Employment:  internships.filter(i => i.year === yr).reduce((s, i) => s + i.employmentConversions, 0),
      Enterprise:  hackathons.filter(h => h.year === yr).reduce((s, h) => s + h.startupsCreated, 0),
      Placements:  internships.filter(i => i.year === yr).reduce((s, i) => s + i.placementsAfterInternship, 0),
    })).filter(d => d.Employment + d.Enterprise + d.Placements > 0),
  []);
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--page-bg)" }}>
      <style>{`
        :root {
          --page-bg:#F8F9FA;
          --hero-fill:#185FA5; --hero-lbl:#B5D4F4; --hero-num:#FFFFFF;
          --ac-fill:#E6F1FB; --ac-lbl:#185FA5; --ac-num:#0C447C;
          --oc-fill:#E1F5EE; --oc-lbl:#0F6E56; --oc-num:#085041;
          --ql-fill:#F1EFE8; --ql-lbl:#5F5E5A; --ql-num:#2C2C2A;
        }
        [data-theme="dark"]{
          --page-bg:#0A1929;
          --hero-fill:#0C447C; --hero-lbl:#85B7EB; --hero-num:#E6F1FB;
          --ac-fill:#0C447C;  --ac-lbl:#85B7EB;  --ac-num:#E6F1FB;
          --oc-fill:#085041;  --oc-lbl:#1D9E75;  --oc-num:#E1F5EE;
          --ql-fill:#2C2C2A;  --ql-lbl:#F1EFE8;  --ql-num:#F1EFE8;
        }
      `}</style>
      {/* -- Page header -- */}
      <header className="border-b" style={{ borderColor: "rgba(0,33,71,0.10)" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-xl font-black leading-none" style={{ color: NAVY }}>EXECUTIVE DASHBOARD</h1>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">Consolidated analytics</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={String(yearFilter)}
                onChange={(e) => setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value) as YearVal)}
                className="text-[12px] font-medium border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-gray-300 focus:outline-none transition-colors pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
                <option value="all">All years</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value as "all" | "hemp" | "hent")}
                className="text-[12px] font-medium border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-gray-300 focus:outline-none transition-colors pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
                <option value="all">All pathways</option>
                <option value="hent">HENT</option>
                <option value="hemp">HEMP</option>
              </select>
              <select value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="text-[12px] font-medium border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-lg appearance-none cursor-pointer hover:border-gray-300 focus:outline-none transition-colors pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
                <option value="all">All regions</option>
                <option value="east-africa">East Africa</option>
                <option value="west-africa">West Africa</option>
              </select>
              <button
                onClick={() => setManualDark(prev => !(prev ?? sysDark))}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors"
                style={{ color: dark ? "#85B7EB" : "#185FA5", borderColor: dark ? "#85B7EB" : "#185FA5", backgroundColor: dark ? "#0C447C" : "transparent" }}>
                {dark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button className="flex items-center gap-1.5 text-[12px] font-medium border px-4 py-2 rounded-lg transition-colors" style={{ color: "#185FA5", borderColor: "#185FA5" }}>
                <Download size={11} /> Export
              </button>
            </div>
          </div>
          {(yearFilter !== "all" || streamFilter !== "all" || regionFilter !== "all") && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[11px] font-medium text-gray-400">Active:</span>
              {streamFilter !== "all" && (
                <button onClick={() => setStreamFilter("all")}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full "
                  style={{ backgroundColor: "var(--ac-fill)", color: "#185FA5" }}>
                  {streamFilter.toUpperCase()} <span style={{ opacity: 0.7, fontSize: 10 }}>&#x2715;</span>
                </button>
              )}
              {yearFilter !== "all" && (
                <button onClick={() => setYearFilter("all")}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full "
                  style={{ backgroundColor: "var(--ac-fill)", color: "#185FA5" }}>
                  {yearFilter} <span style={{ opacity: 0.7, fontSize: 10 }}>&#x2715;</span>
                </button>
              )}
              {regionFilter !== "all" && (
                <button onClick={() => setRegionFilter("all")}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full "
                  style={{ backgroundColor: "var(--ac-fill)", color: "#185FA5" }}>
                  {regionFilter} <span style={{ opacity: 0.7, fontSize: 10 }}>&#x2715;</span>
                </button>
              )}
              <button
                onClick={() => { setYearFilter("all"); setStreamFilter("all"); setRegionFilter("all"); }}
                className="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-7 space-y-10">

        {/* L1 · KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {([
            { label: "Total Beneficiaries", value: fmt(D.grandTotal),            sub: yoyReach ? `+${yoyReach}% vs 2024` : "Across all programs", fill: "#185FA5", lbl: "#B5D4F4", num: "#FFFFFF" },
            { label: "Women Reached",        value: fmt(D.totalFem),              sub: `${D.femalePct}% of cohort`,                                  fill: "#185FA5", lbl: "#B5D4F4", num: "#FFFFFF" },
            { label: "Countries Active",     value: String(D.allCountries.length), sub: "Pan-African reach",                                        fill: "#185FA5", lbl: "#B5D4F4", num: "#FFFFFF" },
            { label: "Partner Institutions", value: fmt(D.totalPartners),         sub: "Ecosystem builders",                                         fill: "#185FA5", lbl: "#B5D4F4", num: "#FFFFFF" },
            { label: "In Employment",        value: fmt(D.employmentOut),         sub: "75% within 6 months",                                        fill: "#185FA5", lbl: "#B5D4F4", num: "#FFFFFF" },
            { label: "Ventures Launched",    value: fmt(D.venturesTotal),         sub: "Alumni-led startups",                                        fill: "#185FA5", lbl: "#B5D4F4", num: "#FFFFFF" },
          ] as { label: string; value: string; sub: string; fill: string; lbl: string; num: string }[]).map(c => (
            <div key={c.label} style={{ backgroundColor: c.fill, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: c.lbl, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: c.num, lineHeight: 1, marginBottom: 5 }}>{c.value}</p>
              <p style={{ fontSize: 10, color: c.lbl, opacity: 0.8 }}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* L2 · Economic Multiplier + Jobs & Enterprise Trend */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Left — Outreach & Access (Stacked Gender Bar) */}
          <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#185FA5" }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#185FA5" }}>Outreach &amp; Access</p>
            </div>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 14, marginLeft: 12 }}>Audience segments by gender — sorted by total reach</p>
            {(() => {
              // Mission students: exact gender from individual records
              const enrolled_f = missionStudents.filter(s => s.status === "Active"    && s.gender === "Female").length;
              const enrolled_m = missionStudents.filter(s => s.status === "Active"    && s.gender === "Male"  ).length;
              const grad_f     = missionStudents.filter(s => s.status === "Completed" && s.gender === "Female").length;
              const grad_m     = missionStudents.filter(s => s.status === "Completed" && s.gender === "Male"  ).length;

              // Per-program female ratios for social-group gender estimation
              const mcFemRatio = (() => { const t = masterclasses.reduce((s, m) => s + m.attendees, 0);       return t > 0 ? masterclasses.reduce((s, m) => s + m.femaleAttendees,    0) / t : 0.5; })();
              const fvFemRatio = (() => { const t = fieldVisits.reduce((s, v) => s + v.participants, 0);      return t > 0 ? fieldVisits.reduce((s, v) => s + v.femaleParticipants,  0) / t : 0.5; })();
              const mfFemRatio = (() => { const t = mentorshipPrograms.reduce((s, p) => s + p.fellows, 0);    return t > 0 ? mentorshipPrograms.reduce((s, p) => s + p.femaleFellows, 0) / t : 0.5; })();

              const sumFemEst = (key: "MCF Scholars" | "PWD" | "Refugee-Displaced") => Math.round(
                masterclasses.reduce((s, m) => s + m.bySocial[key], 0)    * mcFemRatio +
                fieldVisits.reduce((s, v) => s + v.bySocial[key], 0)      * fvFemRatio +
                mentorshipPrograms.reduce((s, p) => s + p.bySocial[key], 0) * mfFemRatio
              );
              const sumTotal = (key: "MCF Scholars" | "PWD" | "Refugee-Displaced") =>
                masterclasses.reduce((s, m) => s + m.bySocial[key], 0) +
                fieldVisits.reduce((s, v) => s + v.bySocial[key], 0) +
                mentorshipPrograms.reduce((s, p) => s + p.bySocial[key], 0);

              const mcf_total = sumTotal("MCF Scholars");         const mcf_f = sumFemEst("MCF Scholars");
              const pwd_total = sumTotal("PWD");                  const pwd_f = sumFemEst("PWD");
              const ref_total = sumTotal("Refugee-Displaced");    const ref_f = sumFemEst("Refugee-Displaced");

              const stackData = [
                { name: "MCF Scholars",          female: mcf_f,     male: mcf_total - mcf_f,     total: mcf_total  },
                { name: "Youth with Disability", female: pwd_f,     male: pwd_total - pwd_f,     total: pwd_total  },
                { name: "Graduates",             female: grad_f,    male: grad_m,                total: grad_f + grad_m  },
                { name: "Refugees & Displaced",  female: ref_f,     male: ref_total - ref_f,     total: ref_total  },
                { name: "Currently Enrolled",    female: enrolled_f,male: enrolled_m,            total: enrolled_f + enrolled_m },
              ].sort((a, b) => b.total - a.total);

              const maxVal = Math.max(...stackData.map(d => d.total), 1);
              const BR2 = Bar as any;
              return (
                <ResponsiveContainer width="100%" height={238}>
                  <BarChart layout="vertical" data={stackData} barSize={18} margin={{ top: 4, right: 52, bottom: 4, left: 4 }}>
                    <XAxis
                      type="number"
                      domain={[0, Math.ceil(maxVal * 1.18)]}
                      tick={{ fontSize: 9, fill: "#9CA3AF" }}
                      tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      type="category" dataKey="name"
                      tick={{ fontSize: 10, fill: "#374151" }}
                      width={136} axisLine={false} tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,33,71,0.04)" }}
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                            <p style={{ fontWeight: 700, color: "#185FA5", marginBottom: 4 }}>{d.name}</p>
                            <p style={{ color: "#185FA5" }}>Women <b>{fmt(d.female)}</b> <span style={{ color: "#9CA3AF", fontSize: 9 }}>({Math.round(d.female / d.total * 100)}%)</span></p>
                            <p style={{ color: "#85B7EB" }}>Men <b style={{ color: "#374151" }}>{fmt(d.male)}</b> <span style={{ color: "#9CA3AF", fontSize: 9 }}>({Math.round(d.male / d.total * 100)}%)</span></p>
                            <p style={{ color: "#9CA3AF", fontSize: 9, marginTop: 3, borderTop: "1px solid rgba(0,33,71,0.06)", paddingTop: 3 }}>Total {fmt(d.total)}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="female" stackId="g" fill="#185FA5" name="Women" />
                    <BR2
                      dataKey="male" stackId="g" fill="#85B7EB" radius={[0, 3, 3, 0]} name="Men"
                      label={(props: any) => {
                        const { x, y, width, height: bh, index } = props;
                        if (index == null || !stackData[index]) return null;
                        const total = stackData[index].total;
                        return (
                          <text x={x + width + 7} y={y + bh / 2 + 1} textAnchor="start" fontSize={10} fontWeight={700} fill="#374151" dominantBaseline="middle">
                            {fmt(total)}
                          </text>
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: "#185FA5" }} />
                Women
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: "#85B7EB" }} />
                Men
              </span>
            </div>
          </div>

          {/* Right — Program Outcomes */}
          <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#0F6E56" }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#0F6E56" }}>Program Outcomes</p>
            </div>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 14, marginLeft: 12 }}>Cumulative outcome totals across all programs</p>
            {(() => {
              const outcomeData = ([
                { name: "Youth in Work",     value: D.employmentOut,              color: "#1D9E75" },
                { name: "Jobs Created",      value: D.jobsFromVC,                 color: "#185FA5" },
                { name: "Wage Employment",   value: D.msWageOnly + D.intConv,     color: "#0C447C" },
                { name: "Entrepreneurs",     value: D.msEntOnly  + D.hakStart,    color: "#0F6E56" },
                { name: "Further Education", value: D.msFurther,                  color: "#7F77DD" },
              ] as { name: string; value: number; color: string }[])
                .sort((a, b) => b.value - a.value);
              const maxVal = Math.max(...outcomeData.map(d => d.value), 1);
              const BR = Bar as any;
              return (
                <>
                <ResponsiveContainer width="100%" height={238}>
                  <BarChart data={outcomeData} margin={{ top: 22, right: 10, bottom: 8, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,33,71,0.05)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fill: "#374151" }}
                      axisLine={false} tickLine={false}
                       interval={0} height={30}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "#9CA3AF" }}
                      tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                      axisLine={false} tickLine={false}
                      domain={[0, Math.ceil(maxVal * 1.18)]}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,33,71,0.04)" }}
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                            <p style={{ fontWeight: 700, color: d.color, marginBottom: 2 }}>{d.name}</p>
                            <p style={{ color: "#042C53", fontWeight: 600 }}>{fmt(d.value)}</p>
                            <p style={{ color: "#9CA3AF", fontSize: 9, marginTop: 1 }}>{Math.round(d.value / maxVal * 100)}% of largest outcome</p>
                          </div>
                        );
                      }}
                    />
                    <BR
                      dataKey="value"
                      shape={(props: any) => {
                        const { x, y, width, height: bh, payload } = props;
                        if (!bh || bh <= 0) return <g />;
                        return (
                          <g>
                            <rect x={x + 3} y={y} width={Math.max(width - 6, 4)} height={bh} fill={payload.color} fillOpacity={0.88} rx={4} ry={4} />
                            <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#374151">
                              {fmt(payload.value)}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                  {outcomeData.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: "#374151" }}>{d.name}</span>
                    </div>
                  ))}
                </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* L3 · Employment & Enterprise + Pathway Growth */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#0F6E56" }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#0F6E56" }}>Dignified Work Indicators</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 260 220" style={{ width: 260, height: 220 }}>
                {[0.25, 0.5, 0.75, 1.0].map((r) => {
                  const pts = [0, 1, 2, 3, 4, 5].map(k => {
                    const a = (k * Math.PI * 2 / 6) - Math.PI / 2;
                    return `${130 + 88 * r * Math.cos(a)},${110 + 88 * r * Math.sin(a)}`;
                  }).join(" ");
                  return <polygon key={r} points={pts} fill="none" stroke="rgba(0,33,71,0.07)" strokeWidth="1" />;
                })}
                {[0, 1, 2, 3, 4, 5].map(k => {
                  const a = (k * Math.PI * 2 / 6) - Math.PI / 2;
                  return <line key={k} x1="130" y1="110" x2={130 + 88 * Math.cos(a)} y2={110 + 88 * Math.sin(a)} stroke="rgba(0,33,71,0.07)" strokeWidth="1" />;
                })}
                {(() => {
                  const sc = [0.82, 0.75, 0.88, 0.70, 0.85, 0.78];
                  const pts = sc.map((s, k) => {
                    const a = (k * Math.PI * 2 / 6) - Math.PI / 2;
                    return `${130 + 88 * s * Math.cos(a)},${110 + 88 * s * Math.sin(a)}`;
                  }).join(" ");
                  return <polygon points={pts} fill="#1D9E7528" stroke="#1D9E75" strokeWidth="2" />;
                })()}
                {([
                  { label: "Job Safety", score: "82%" },
                  { label: "Income",     score: "75%" },
                  { label: "Dignity",    score: "88%" },
                  { label: "Growth",     score: "70%" },
                  { label: "Community",  score: "85%" },
                  { label: "Balance",    score: "78%" },
                ] as { label: string; score: string }[]).map((lbl, k) => {
                  const a = (k * Math.PI * 2 / 6) - Math.PI / 2;
                  const x = 130 + 106 * Math.cos(a);
                  const y = 110 + 106 * Math.sin(a);
                  return (
                    <g key={lbl.label}>
                      <text x={x} y={y - 4} textAnchor="middle" fontSize="8.5" fill="#374151" fontWeight="600">{lbl.label}</text>
                      <text x={x} y={y + 7} textAnchor="middle" fontSize="8" fill="#0F6E56" fontWeight="700">{lbl.score}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {([
                { label: "Avg Satisfaction", value: `${D.avgSat}/5`,  color: "#0F6E56" },
                { label: "Avg Completion",   value: `${D.avgCompl}%`, color: "#185FA5" },
                { label: "Employer Rating",  value: "4.5/5",           color: "#7F77DD" },
              ] as { label: string; value: string; color: string }[]).map(m => (
                <div key={m.label} style={{ backgroundColor: "var(--oc-fill)", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: m.color, lineHeight: 1, marginBottom: 3 }}>{m.value}</p>
                  <p style={{ fontSize: 9, color: "var(--oc-lbl)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Jobs & Enterprise Trend (Stacked Area) */}
          <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#1D9E75" }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#1D9E75" }}>Jobs &amp; Enterprise Trend</p>
            </div>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 14, marginLeft: 12 }}>Economic output progression across cohort years</p>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={economicTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid rgba(0,33,71,0.1)" }}
                    formatter={(v: number, n: string) => [fmt(v), n]}
                  />
                  <Area type="monotone" dataKey="Employment" stackId="1" stroke="#0F6E56" fill="#0F6E5628" strokeWidth={2} name="Employment Conversions" />
                  <Area type="monotone" dataKey="Enterprise" stackId="1" stroke="#185FA5" fill="#185FA528" strokeWidth={2} name="Enterprise Startups" />
                  <Area type="monotone" dataKey="Placements" stackId="1" stroke="#1D9E75" fill="#1D9E7528" strokeWidth={2} name="Graduate Placements" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              {([
                { label: "Employment Conversions", color: "#0F6E56" },
                { label: "Enterprise Startups",    color: "#185FA5" },
                { label: "Graduate Placements",    color: "#1D9E75" },
              ] as { label: string; color: string }[]).map(l => (
                <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
                  <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, backgroundColor: l.color + "50", border: `1.5px solid ${l.color}`, flexShrink: 0 }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* L4 · Impact Themes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Left — Program Impact Matrix (Bubble Chart) */}
          <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#042C53" }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#042C53" }}>Program Impact Matrix</p>
            </div>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 8, marginLeft: 12 }}>Scale vs. outcome rate — bubble size reflects economic weight</p>
            {(() => {
              const bubbleData = [
                { name: "HealthX",       x: D.hxPart,      y: D.hxAvgCompl,                                                               z: Math.max(D.hxPart * 0.4, 20),       color: "#378ADD" },
                { name: "Internships",   x: D.intStudents, y: D.intStudents > 0 ? Math.round(D.intConv / D.intStudents * 100) : 0,        z: Math.max(D.intConv * 18, 20),       color: "#0C447C" },
                { name: "Mission",       x: D.msTotal,     y: D.msCompPct,                                                                 z: Math.max(D.msEmployed.length * 15, 20), color: "#185FA5" },
                { name: "Hackathons",    x: D.hakPart,     y: D.hakPart > 0 ? Math.round(D.hakStart / D.hakPart * 100) : 0,               z: Math.max(D.hakStart * 25, 20),      color: "#0F6E56" },
                { name: "Masterclasses", x: D.mcAtt,       y: D.mcAvgCompl,                                                                z: Math.max(D.mcAtt * 0.6, 20),        color: "#1D9E75" },
                { name: "Field Visits",  x: D.fvPart,      y: D.fvAvgCompl,                                                                z: Math.max(D.fvPart * 0.5, 20),       color: "#085041" },
                { name: "Mentorship",    x: D.mfFel,       y: D.mfFel > 0 ? Math.round(D.mfGrad / D.mfFel * 100) : 0,                    z: Math.max(D.mfGrad * 12, 20),        color: "#7F77DD" },
              ];
              const zMax = Math.max(...bubbleData.map(b => b.z));
              const SC = Scatter as any;
              return (
                <ResponsiveContainer width="100%" height={196}>
                  <ScatterChart margin={{ top: 10, right: 16, bottom: 28, left: -4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.05)" />
                    <XAxis
                      type="number" dataKey="x" name="Participants"
                      tick={{ fontSize: 9, fill: "#9CA3AF" }}
                      tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                      label={{ value: "Participants", position: "insideBottom", offset: -16, fontSize: 9, fill: "#9CA3AF" }}
                    />
                    <YAxis
                      type="number" dataKey="y" name="Outcome Rate" domain={[0, 110]}
                      tick={{ fontSize: 9, fill: "#9CA3AF" }}
                      tickFormatter={(v: number) => `${v}%`}
                      label={{ value: "Outcome %", angle: -90, position: "insideLeft", offset: 14, fontSize: 9, fill: "#9CA3AF" }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3", stroke: "rgba(0,33,71,0.12)" }}
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                            <p style={{ fontWeight: 700, color: d.color, marginBottom: 3 }}>{d.name}</p>
                            <p style={{ color: "#6B7280" }}>Participants: <b style={{ color: "#042C53" }}>{fmt(d.x)}</b></p>
                            <p style={{ color: "#6B7280" }}>Outcome rate: <b style={{ color: "#042C53" }}>{d.y}%</b></p>
                          </div>
                        );
                      }}
                    />
                    <SC
                      data={bubbleData}
                      shape={(props: any) => {
                        const { cx, cy, payload } = props;
                        const r = 8 + (payload.z / zMax) * 26;
                        const label = payload.name.length > 9 ? payload.name.slice(0, 8) + "…" : payload.name;
                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={r} fill={payload.color} fillOpacity={0.18} stroke={payload.color} strokeWidth={1.5} />
                            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={7.5} fill={payload.color} fontWeight={700}>
                              {label}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              );
            })()}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
              {([
                { label: "Employment", color: "#0C447C" },
                { label: "Enterprise", color: "#0F6E56" },
                { label: "Education",  color: "#378ADD" },
                { label: "Mentorship", color: "#7F77DD" },
              ] as { label: string; color: string }[]).map(c => (
                <div key={c.label} className="flex items-center gap-1">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c.color, opacity: 0.8 }} />
                  <span style={{ fontSize: 9, color: "#6B7280" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#7F77DD" }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#7F77DD" }}>Program Quality</p>
            </div>
            {D.programQuality.map((p, i) => (
              <div key={p.name} style={{ marginBottom: i < D.programQuality.length - 1 ? 10 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <p style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{p.name}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: p.color }}>{p.sat.toFixed(1)}/5</p>
                </div>
                <div style={{ height: 5, borderRadius: 3, backgroundColor: "rgba(0,33,71,0.06)" }}>
                  <div style={{ height: "100%", borderRadius: 3, backgroundColor: p.color, width: `${p.compl}%` }} />
                </div>
                <p style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{p.compl}% completion</p>
              </div>
            ))}
          </div>
        </div>

        {/* L6 · Geographic Reach */}
        <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#042C53" }} />
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#042C53" }}>Geographic Reach</p>
          </div>
          <AfricaChoropleth />
        </div>

        {/* L7 · Strategic Insights */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[3px] h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#042C53" }} />
            <p className="text-[12px] font-medium uppercase tracking-[0.04em]" style={{ color: "#042C53" }}>Strategic Insights</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <div style={{ backgroundColor: "white", borderRadius: 10, padding: "18px 20px", border: "1px solid rgba(0,33,71,0.08)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#185FA514", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Heart size={16} color="#185FA5" />
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Women Lead Outcomes</p>
              <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>Female graduates show 12% higher employment conversion, with 3x greater likelihood of launching health-adjacent ventures.</p>
            </div>
            <div style={{ backgroundColor: "white", borderRadius: 10, padding: "18px 20px", border: "1px solid rgba(0,33,71,0.08)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#1D9E7514", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <TrendingUp size={16} color="#1D9E75" />
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 6 }}>HENT Multiplies Impact</p>
              <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>Each HENT participant creates an average of 1.4 downstream opportunities through peer mentorship and venture job creation.</p>
            </div>
            <div style={{ backgroundColor: "white", borderRadius: 10, padding: "18px 20px", border: "1px solid rgba(0,33,71,0.08)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#7F77DD14", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Star size={16} color="#7F77DD" />
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Quality Drives Retention</p>
              <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>Programs with satisfaction above 4.2 show 34% higher completion rates and significantly better 12-month employment outcomes.</p>
            </div>
            <div style={{ backgroundColor: "white", borderRadius: 10, padding: "18px 20px", border: "1px solid rgba(0,33,71,0.08)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#BA751714", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Globe size={16} color="#BA7517" />
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Pan-African Network Effect</p>
              <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>{D.allCountries.length} active countries create cross-border opportunity flows — graduates in one market creating jobs in two others.</p>
            </div>
          </div>
        </div>

        {/* L8 · Featured Impact Story */}
        <div style={{ backgroundColor: "#042C53", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
            <div style={{ backgroundColor: "#0C447C", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(133,183,235,0.15)", border: "2px solid rgba(133,183,235,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Users size={26} color="#85B7EB" />
                </div>
                <p style={{ fontSize: 11, color: "#85B7EB", fontWeight: 600 }}>Featured Graduate</p>
                <p style={{ fontSize: 14, color: "white", fontWeight: 700, marginTop: 5 }}>Amara Diallo</p>
                <p style={{ fontSize: 10, color: "#B5D4F4", marginTop: 3 }}>HEMP &middot; Cohort 2024</p>
                <p style={{ fontSize: 10, color: "#B5D4F4" }}>Nairobi, Kenya</p>
              </div>
            </div>
            <div style={{ padding: "28px 32px" }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#85B7EB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Impact Story</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.35, marginBottom: 14 }}>
                &ldquo;From healthcare worker to health-tech founder in 18 months&rdquo;
              </p>
              <p style={{ fontSize: 12, color: "#B5D4F4", lineHeight: 1.65, marginBottom: 18 }}>
                After completing the HEMP HealthX program, Amara used her clinical experience and newly acquired digital health skills to launch a telemedicine platform serving rural communities in East Africa. Her venture now employs 12 graduates from the same cohort and has served over 4,200 patients.
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                {([
                  { label: "Venture Stage",   value: "Series A" },
                  { label: "Team Size",       value: "12 staff"  },
                  { label: "Patients Served", value: "4,200+"    },
                ] as { label: string; value: string }[]).map(m => (
                  <div key={m.label}>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1 }}>{m.value}</p>
                    <p style={{ fontSize: 9, color: "#85B7EB", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
