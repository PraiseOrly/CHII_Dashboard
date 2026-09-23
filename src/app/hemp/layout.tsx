import HEMPProviders from "./providers";

export const metadata = {
  title: "HEMP — Health Employment Pillar",
  description:
    "Health Employment Pillar — student analytics, career development, internships, and mission outcomes across Africa.",
};

export default function HEMPLayout({ children }: { children: React.ReactNode }) {
  return <HEMPProviders>{children}</HEMPProviders>;
}
