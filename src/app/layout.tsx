import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHII Platform",
  description:
    "Centre for Health Innovation & Entrepreneurship — ALU's integrated programme management and impact intelligence platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
