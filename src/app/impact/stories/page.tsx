"use client";

import { BookOpen } from "lucide-react";
import ImpactPageShell from "@/components/ImpactPageShell";

export default function StoriesPage() {
  return (
    <ImpactPageShell
      title="Impact Stories"
      subtitle="Graduate journeys and venture spotlights across Africa"
      bandLabel="Impact Stories"
      Icon={BookOpen}
    />
  );
}
