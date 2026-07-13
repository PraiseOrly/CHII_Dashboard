import ImpactNav from "@/components/layout/portal-nav-impact";

export const metadata = {
  title: "CHII Impact — Analytics Platform",
  description: "Consolidated impact analytics across all CHII programmes — HENT, HEMP, and HECO.",
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ImpactNav />
      <div className="overflow-x-hidden">{children}</div>
    </>
  );
}
