"use client";

import { MessageSquare } from "lucide-react";
import ImpactPageShell from "@/components/ImpactPageShell";

export default function FeedbackPage() {
  return (
    <ImpactPageShell
      title="Program Feedback Experience"
      subtitle="Satisfaction, completion, and quality signals across programs"
      bandLabel="Program Feedback Experience"
      Icon={MessageSquare}
    />
  );
}
