"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Clock } from "lucide-react";

const COLOR   = "#F59E0B";
const NAVY    = "#002147";
const EXEC_BG = "#f8fafc";

export default function WageEmploymentPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: EXEC_BG }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border"
              style={{ backgroundColor: COLOR + "12", borderColor: COLOR + "33", color: COLOR }}>
              <Clock size={11} />
              Coming soon
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #D97706 100%)` }}>
            <Briefcase size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Wage Employment</h1>
          <p className="text-[13px] text-gray-400 font-medium mb-6">CHII Impact Dashboard</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/impact"
              className="flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-lg text-white shadow-sm transition-all hover:shadow-md"
              style={{ backgroundColor: NAVY }}>
              <ArrowRight size={14} /> Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
