"use client";

import { Briefcase } from "lucide-react";
import ImpactPageShell from "@/components/ImpactPageShell";

export default function WageEmploymentPage() {
  return (
    <ImpactPageShell
      title="Wage Employment"
      subtitle="Formal employment conversions and earnings progression"
      bandLabel="Wage Employment"
      Icon={Briefcase}
    />
  );
}
