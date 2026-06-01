import HENTProviders from "./providers";

export const metadata = {
  title: "HENT — Venture Dashboard",
  description: "HENT venture tracking, pipeline, analytics, and M&E framework.",
};

export default function HENTLayout({ children }: { children: React.ReactNode }) {
  return <HENTProviders>{children}</HENTProviders>;
}
