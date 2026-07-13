import ExecutiveNav from "@/components/layout/portal-nav-executive";

export const metadata = {
  title: "CHII Executive — Analytics Platform",
  description: "Consolidated impact analytics across all CHII programmes — HENT, HEMP, and HECO.",
};

export default function ExecutiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ExecutiveNav />
      <div className="overflow-x-hidden">{children}</div>
    </>
  );
}
