"use client";
// Last-resort boundary: catches errors thrown in the root layout itself, where
// error.tsx cannot run. It must render its own <html>/<body>.

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#F8F9FA" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#102C5E" }}>
              Application error
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#102C5E", margin: "8px 0 0" }}>
              The platform failed to start
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginTop: 12 }}>
              A critical error occurred outside of any page. Reloading usually clears it.
            </p>
            {error.digest && (
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 16, fontFamily: "monospace" }}>
                Reference: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{ marginTop: 28, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", padding: "10px 18px", borderRadius: 8, border: "none", color: "white", backgroundColor: "#102C5E", cursor: "pointer" }}
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
