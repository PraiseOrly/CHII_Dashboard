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
import DignifiedWork from "./DignifiedWork";
import OutreachAccess from "./OutreachAccess";
import ProgramImpactMatrix from "./ProgramImpactMatrix";
import ProgramQuality from "./ProgramQuality";
import StatsKpiCard from "./StatsKpiCard";

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
const B900  = "#14306B";  // Blue 900  — chart headers · deep anchors
const KPI_NAVY = "#14306B";  // Executive KPI card fill (brand navy)
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
  const [yearFilter,   setYearFilter]   = useState<YearVal>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodVal>("all");
  const [catFilter,    setCatFilter]    = useState<HackCat>("all");
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


    const streamDist = [
      { name: "Health Education", value: hxPart + mcAtt + fvPart },
      { name: "Workforce Dev.",   value: intStudents + msTotal },
      { name: "Innovation",        value: hakPart },
      { name: "Leadership",        value: mfFel },
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
  }, [yearFilter, periodFilter, catFilter]);

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
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#042C53", backgroundImage: "url('/images/header_blue.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Readability overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.45), rgba(4,44,83,0.15))", zIndex: 1, pointerEvents: "none" }} />

        {/* Content */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "rgba(181,212,244,0.85)" }}>
              Executive &middot; CHII Analytics
            </p>
            <h1 className="text-lg font-black leading-tight mt-1" style={{ color: "white", letterSpacing: "0.01em" }}>
              Pan-African Impact Overview
            </h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              Consolidated analytics across CHII&apos;s HEMP &amp; HENT programs
            </p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>
              Last updated: 18 June 2026, 16:30 CAT
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">
        {/* L1 · KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <StatsKpiCard fill={KPI_NAVY} label="Total Beneficiaries" num={D.grandTotal} sub={yoyReach ? `+${yoyReach}% vs 2024` : "Across all programs"} Icon={Users} tooltip="Total individuals reached across all CHII programs — including HENT, HEMP, HECO and every other program under CHII." />
          <StatsKpiCard fill={KPI_NAVY} label="Youth in Work" num={D.employmentOut} sub="In employment or enterprise" Icon={Briefcase} tooltip="Graduates in work — wage employment or running their own venture — within 12 months of completing school." />
          <StatsKpiCard fill={KPI_NAVY} label="Wage Employment" num={D.msWageOnly} sub="In paid employment" Icon={Users} tooltip="Graduates in paid employment of any kind — formal and informal — with an employer." />
          <StatsKpiCard fill={KPI_NAVY} label="Entrepreneurs" num={D.msEntOnly} sub="Running own venture" Icon={TrendingUp} tooltip="All who have gone through a CHII program and are running their own venture or enterprise." />
          <StatsKpiCard fill={KPI_NAVY} label="Jobs Created" num={D.jobsFromVC} sub="Across all ventures" Icon={Zap} tooltip="All jobs created across the portfolio — not just those from alumni-led ventures." />
          <StatsKpiCard fill={KPI_NAVY} label="Further Education" num={D.msFurther} sub="Advanced to study" Icon={GraduationCap} tooltip="Graduates who progressed to further study or advanced qualifications." />
        </div>

        {/* L2 · Economic Multiplier + Jobs & Enterprise Trend */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>

          <OutreachAccess />

          {/* Geographic Reach */}
          <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
            <div style={{ backgroundColor: "#14306B", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>Geographic Reach</p>
            </div>
            <div style={{ padding: "16px 24px 20px" }}>
            <AfricaChoropleth />
            </div>
          </div>
        </div>

        {/* L3 · Employment & Enterprise + Pathway Growth */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>

          {/* Right — Jobs & Enterprise Trend (Stacked Area) */}
          <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
            <div style={{ backgroundColor: "#14306B", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>Jobs &amp; Enterprise Trend</p>
            </div>
            <div style={{ padding: "16px 24px 20px" }}>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 14 }}>Economic output progression across cohort years</p>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={economicTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,33,71,0.06)" />
                  <XAxis dataKey="Year" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    allowDecimals={false}
                    tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)}
                  />
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

          <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
            <div style={{ backgroundColor: "#14306B", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>Dignified Work Indicators</p>
            </div>
            <div style={{ padding: "16px 24px 20px" }}>
            <DignifiedWork />
            </div>
          </div>
        </div>

        {/* L4 · Impact Themes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          <ProgramImpactMatrix />

          <ProgramQuality />
        </div>

        {/* L7 · Strategic Insights */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[3px] h-4 rounded-full flex-shrink-0" style={{ backgroundColor: "#042C53" }} />
            <p className="text-[12px] font-medium uppercase tracking-[0.04em]" style={{ color: "#14306B" }}>Strategic Insights</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
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
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#042C53", backgroundImage: "url('/images/footer.png')", backgroundSize: "cover", backgroundPosition: "center" }}>

          {/* Readability overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.45), rgba(4,44,83,0.15))", zIndex: 1 }} />

          {/* -- Content (profile left + story right, centered in blue zone) -- */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 28, maxWidth: 660, margin: "0 auto", padding: "18px 24px" }}>
            {/* Profile — left */}
            <div style={{ textAlign: "center", flexShrink: 0, width: 150 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "rgba(133,183,235,0.15)", border: "2px solid rgba(133,183,235,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <Users size={22} color="#85B7EB" />
              </div>
              <p style={{ fontSize: 11, color: "#85B7EB", fontWeight: 600 }}>Featured Graduate</p>
              <p style={{ fontSize: 15, color: "white", fontWeight: 700, marginTop: 5 }}>Amara Diallo</p>
              <p style={{ fontSize: 10, color: "#B5D4F4", marginTop: 3, lineHeight: 1.5 }}>HEMP &middot; Cohort 2024<br/>Nairobi, Kenya</p>
            </div>

            {/* Divider */}
            <div style={{ width: 1, alignSelf: "stretch", background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent)", flexShrink: 0 }} />

            {/* Story — right */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#85B7EB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Impact Story</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.35, marginBottom: 10 }}>
                &ldquo;From healthcare worker to health-tech founder in 18 months&rdquo;
              </p>
              <p style={{ fontSize: 12, color: "#B5D4F4", lineHeight: 1.6 }}>
                After completing the HEMP HealthX program, Amara used her clinical experience and newly acquired digital health skills to launch a telemedicine platform serving rural communities in East Africa. Her venture now employs 12 graduates from the same cohort and has served over 4,200 patients.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
