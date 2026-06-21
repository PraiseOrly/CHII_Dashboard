"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;        // centered header phrase
  subtitle: string;     // supporting line under the title
  bandLabel: string;    // navy title-band label
  Icon: LucideIcon;
  children?: React.ReactNode;
}

export default function ImpactPageShell({ title, subtitle, bandLabel, Icon, children }: Props) {
  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* -- Page header (image background + overlay) -- */}
      <header style={{ position: "relative", overflow: "hidden", backgroundColor: "#042C53", backgroundImage: "url('/images/header.png')", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,44,83,0.45), rgba(4,44,83,0.15))", zIndex: 1, pointerEvents: "none" }} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-black leading-tight" style={{ color: "white", letterSpacing: "0.01em" }}>
              {title}
            </h1>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(181,212,244,0.78)" }}>
              {subtitle}
            </p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(181,212,244,0.5)" }}>
              Last updated: 18 June 2026, 16:30 CAT
            </p>
          </div>
        </div>
      </header>

      {/* -- Body -- */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7 space-y-10">

        {/* Themed card with navy title band */}
        <div style={{ backgroundColor: "white", borderRadius: 10, border: "1px solid rgba(0,33,71,0.08)", overflow: "hidden" }}>
          <div style={{ backgroundColor: "#0C447C", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#D17A86", flexShrink: 0 }} />
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white" }}>{bandLabel}</p>
          </div>

          <div style={{ padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {children ?? (
              <>
                <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(12,68,124,0.08)", border: "2px solid rgba(12,68,124,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={26} color="#0C447C" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Data coming soon</p>
                <p style={{ fontSize: 12, color: "#6B7280", maxWidth: 420, lineHeight: 1.6, marginBottom: 20 }}>
                  This section is being prepared. The {bandLabel.toLowerCase()} analytics will follow the same structure and theme as the Overview dashboard.
                </p>
                <Link href="/impact" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#042C53", padding: "8px 16px", borderRadius: 8 }}>
                  <ArrowLeft size={13} /> Back to Overview
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
