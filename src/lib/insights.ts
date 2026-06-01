import type { Venture, VentureEvent } from "@/types";

export interface Insight {
  title: string;
  body: string;
  color: "teal" | "amber" | "rose" | "indigo";
}

function fmt(n: number, prefix = "", suffix = ""): string {
  return `${prefix}${n.toLocaleString()}${suffix}`;
}

export function computeInsights(
  ventures: Venture[],
  events: VentureEvent[],
): Insight[] {
  if (ventures.length === 0) return [];

  const insights: Insight[] = [];

  // Best cohort by avg health score
  const cohortMap: Record<number, number[]> = {};
  for (const v of ventures) {
    if (!cohortMap[v.cohort]) cohortMap[v.cohort] = [];
    cohortMap[v.cohort].push(v.healthScore);
  }
  let bestCohort = 0;
  let bestAvg = 0;
  for (const [c, scores] of Object.entries(cohortMap)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > bestAvg) { bestAvg = avg; bestCohort = Number(c); }
  }
  insights.push({
    title: `Cohort ${bestCohort} leads`,
    body: `Cohort ${bestCohort} has the highest average health score at ${Math.round(bestAvg)}/100 — the strongest overall portfolio.`,
    color: "teal",
  });

  // Bottleneck stage (most ventures + most avg days)
  const stageMap: Record<string, { count: number; days: number }> = {};
  for (const v of ventures) {
    if (!stageMap[v.stage]) stageMap[v.stage] = { count: 0, days: 0 };
    stageMap[v.stage].count++;
    stageMap[v.stage].days += v.daysInCurrentStage;
  }
  let bottleneck = "";
  let maxDays = 0;
  for (const [stage, info] of Object.entries(stageMap)) {
    const avgDays = info.days / info.count;
    if (avgDays > maxDays) { maxDays = avgDays; bottleneck = stage; }
  }
  insights.push({
    title: `"${bottleneck}" is stalling`,
    body: `Ventures spend an average of ${Math.round(maxDays)} days in ${bottleneck} — the longest stage dwell time across the portfolio.`,
    color: "amber",
  });

  // Funding per job
  const totalFunding = ventures.reduce((a, v) => a + v.funding, 0);
  const totalJobs = ventures.reduce((a, v) => a + v.jobsTotal, 0);
  const fPerJob = totalJobs > 0 ? Math.round(totalFunding / totalJobs) : 0;
  insights.push({
    title: `$${fPerJob.toLocaleString()}k per job`,
    body: `Across funded ventures, every ${fmt(fPerJob, "$", "k")} of capital mobilised corresponds to one job created — a key cost-efficiency signal.`,
    color: "indigo",
  });

  // At-risk ventures
  const atRisk = ventures.filter((v) => v.healthScore < 45 || v.status !== "Active");
  insights.push({
    title: `${atRisk.length} ventures need attention`,
    body: `${atRisk.length} venture${atRisk.length !== 1 ? "s" : ""} have a health score below 45 or are Dormant/Stalled — prioritise for intervention.`,
    color: "rose",
  });

  // Mentorship correlation (bonus if events available)
  if (events.length > 0) {
    const mentored = ventures.filter((v) => v.mentorshipHrs >= 100);
    const unmentored = ventures.filter((v) => v.mentorshipHrs < 100);
    if (mentored.length > 0 && unmentored.length > 0) {
      const avgM = mentored.reduce((a, v) => a + v.stageIndex, 0) / mentored.length;
      const avgU = unmentored.reduce((a, v) => a + v.stageIndex, 0) / unmentored.length;
      if (avgM > avgU + 0.3) {
        insights.push({
          title: "Mentorship drives progression",
          body: `Ventures with 100+ mentorship hours average stage ${avgM.toFixed(1)} vs. ${avgU.toFixed(1)} for less-mentored peers — a ${((avgM - avgU) / avgU * 100).toFixed(0)}% progression lift.`,
          color: "teal",
        });
      }
    }
  }

  return insights.slice(0, 5);
}
