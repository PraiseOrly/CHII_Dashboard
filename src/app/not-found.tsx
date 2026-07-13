import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NAVY = "#102C5E";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="w-full max-w-md text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: NAVY }}>
          404
        </p>
        <h1 className="text-2xl font-black mt-2" style={{ color: NAVY }}>
          Page not found
        </h1>
        <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
          That page doesn&apos;t exist. It may have moved — the Impact portal is now the Executive
          portal, and its pages live under <span className="font-mono text-[12px]">/executive</span>.
        </p>

        <div className="flex items-center justify-center gap-2 mt-7">
          <Link
            href="/executive"
            className="text-[12px] font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg text-white"
            style={{ backgroundColor: NAVY }}
          >
            Executive dashboard
          </Link>
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
