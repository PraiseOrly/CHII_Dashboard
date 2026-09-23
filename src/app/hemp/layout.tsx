import HEMPProviders from "./providers";

export const metadata = {
  title: "CHII Health Missions and HEMP Programme Dashboard",
  description:
    "Health Employment Pillar programme dashboard tracking student outcomes, career development, internships, and mission impact across 15 African countries.",
};

export default function HEMPLayout({ children }: { children: React.ReactNode }) {
  return <HEMPProviders>{children}</HEMPProviders>;
}
