import HEMPProviders from "./providers";

export const metadata = {
  title: "HEMP — Programme Management Dashboard",
  description:
    "Health Management Programme — student analytics, HealthX experiences, internships, and mission outcomes.",
};

export default function HEMPLayout({ children }: { children: React.ReactNode }) {
  return <HEMPProviders>{children}</HEMPProviders>;
}
