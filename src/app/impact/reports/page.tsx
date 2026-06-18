"use client";

import { FileText } from "lucide-react";
import ImpactPageShell from "@/components/ImpactPageShell";

export default function ReportsPage() {
  return (
    <ImpactPageShell
      title="Impact Reports"
      subtitle="Downloadable analytics and donor-ready impact summaries"
      bandLabel="Impact Reports"
      Icon={FileText}
    />
  );
}
