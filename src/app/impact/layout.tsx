import ImpactNav from "@/components/ImpactNav";

export const metadata = {
  title: "CHII Impact — Analytics Platform",
  description: "Consolidated impact analytics across all CHII programmes — HENT, HEMP, and HECO.",
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-hidden">
      <ImpactNav />
      {children}
    </div>
  );
}
