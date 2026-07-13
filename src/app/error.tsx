"use client";
// Catches render errors inside any route. Without this, Next falls back to its
// own bare default page.

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, ArrowLeft } from "lucide-react";

const NAVY = "#102C5E";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="w-full max-w-md text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: NAVY }}>
          Something went wrong
        </p>
        <h1 className="text-2xl font-black mt-2" style={{ color: NAVY }}>
          This page failed to load
        </h1>
        <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
          An unexpected error occurred while rendering. Try again — if it keeps happening, the
          reference below will help track it down.
        </p>

        {error.digest && (
          <p className="text-[11px] text-gray-400 mt-4 font-mono">Reference: {error.digest}</p>
        )}

        <div className="flex items-center justify-center gap-2 mt-7">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg text-white"
            style={{ backgroundColor: NAVY }}
          >
            <RotateCw size={13} />
            Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg border bg-white"
            style={{ borderColor: "#E5E7EB", color: "#6B7280" }}
          >
            <ArrowLeft size={13} />
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
