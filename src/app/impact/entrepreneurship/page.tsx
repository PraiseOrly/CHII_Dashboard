"use client";

import { Zap } from "lucide-react";
import ImpactPageShell from "@/components/ImpactPageShell";

export default function EntrepreneurshipPage() {
  return (
    <ImpactPageShell
      title="Entrepreneurship"
      subtitle="Ventures launched, jobs created, and enterprise growth"
      bandLabel="Entrepreneurship"
      Icon={Zap}
    />
  );
}
