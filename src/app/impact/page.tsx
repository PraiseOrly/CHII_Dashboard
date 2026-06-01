"use client";
import Link from "next/link";
import { TrendingUp, ArrowLeft, Clock } from "lucide-react";

export default function IMPACTPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <TrendingUp size={36} className="text-white" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Clock size={11} />
          Coming soon
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IMPACT Portal</h1>
        <p className="text-gray-500 text-sm font-medium mb-1">Impact Intelligence</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Programme-wide impact measurement, MEL reporting, and SDG contribution tracking
          across all CHII initiatives. This portal is under active development.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-left mb-8 space-y-2">
          {["57 MELA indicators across 4 results levels", "SDG alignment reporting", "GESI-disaggregated outcomes", "Funder-ready impact narratives"].map((f) => (
            <div key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </div>
              {f}
            </div>
          ))}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to portals
        </Link>
      </div>
    </div>
  );
}
