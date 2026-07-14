import Link from "next/link";

// Must not call redirect() here — Next re-enters this boundary while resolving
// the redirect, which loops and makes even "/" return a 404.

const NAVY = "#102C5E";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#E6F1FB" }}>
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-black" style={{ color: NAVY }}>
          Page not found
        </h1>
        <p className="text-[13px] text-gray-500 mt-2">
          That page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block text-[12px] font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg text-white mt-6"
          style={{ backgroundColor: NAVY }}
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
