"use client";
import {
  Card,
  Badge,
  ProgressBar,
  ProgressCircle,
  BarList,
  Title,
  Text,
  Metric,
  Grid,
  Flex,
  Callout,
} from "@tremor/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { ventures as ALL_VENTURES } from "@/data/ventures";
import { events as ALL_EVENTS } from "@/data/events";

const STAGE_COLORS: Record<string, "indigo" | "blue" | "cyan" | "teal" | "emerald" | "green"> = {
  Ideation: "indigo", Validation: "blue", "Prototype/MVP": "cyan",
  "Early Growth": "teal", Scaling: "emerald", "Investment/Funding": "green",
};
const STATUS_COLOR: Record<string, "emerald" | "amber" | "rose"> = {
  Active: "emerald", Dormant: "amber", Stalled: "rose",
};
function healthColor(s: number): "emerald" | "amber" | "rose" {
  return s >= 65 ? "emerald" : s >= 40 ? "amber" : "rose";
}

export default function VentureShowPage() {
  const { id } = useParams<{ id: string }>();
  const venture = ALL_VENTURES.find((v) => v.id === Number(id));

  if (!venture) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg font-medium">Venture not found</p>
        <Link href="/hent/ventures" className="text-sm text-hent-700 hover:underline mt-2 inline-block">
          ← Back to ventures
        </Link>
      </div>
    );
  }

  const ventureEvents = ALL_EVENTS.filter((e) => e.ventureId === venture.id);
  const interventionList = ventureEvents.map((e) => ({
    name: e.intervention,
    value: e.hours,
  }));

  const HEALTH_FORMULA = [
    { label: "Founder Engagement", weight: "25%", value: venture.founderEngagement },
    { label: "Milestone Rate", weight: "25%", value: venture.milestoneRate },
    { label: "Stage Progress", weight: "20%", value: Math.round((venture.stageIndex / 5) * 100) },
    { label: "Mentorship (cap 200h)", weight: "15%", value: Math.round(Math.min(venture.mentorshipHrs / 200, 1) * 100) },
    { label: "Funding (cap $500k)", weight: "15%", value: Math.round(Math.min(venture.funding / 500, 1) * 100) },
  ];

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        href="/hent/ventures"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-hent-700"
      >
        <ArrowLeft size={14} /> All ventures
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{venture.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge color={STAGE_COLORS[venture.stage]}>{venture.stage}</Badge>
            <Badge color={STATUS_COLOR[venture.status]}>{venture.status}</Badge>
            <span className="text-sm text-gray-500">
              Cohort {venture.cohort} · {venture.sector} · {venture.country}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={healthColor(venture.healthScore)} size="lg">
            Health {venture.healthScore}
          </Badge>
        </div>
      </div>

      {/* Top KPI row */}
      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        <Card>
          <Text>Funding Raised</Text>
          <Metric>${venture.funding.toLocaleString()}k</Metric>
          <Text className="text-xs text-gray-400 mt-1">{venture.fundingStatus}</Text>
        </Card>
        <Card>
          <Text>Jobs Created</Text>
          <Metric>{venture.jobsTotal}</Metric>
          <Text className="text-xs text-gray-400 mt-1">
            {venture.jobs6m} in first 6 mo. · {venture.jobsWomen} women
          </Text>
        </Card>
        <Card>
          <Text>Revenue</Text>
          <Metric>${venture.revenue}k/mo</Metric>
          <Text className="text-xs text-gray-400 mt-1">
            {venture.accelerator ? "Accelerator alum" : "No accelerator"}
          </Text>
        </Card>
        <Card>
          <Text>Partnerships</Text>
          <Metric>{venture.partnerships}</Metric>
          <Text className="text-xs text-gray-400 mt-1">
            {venture.founders} founder{venture.founders !== 1 ? "s" : ""} · {venture.teamGender}
          </Text>
        </Card>
      </Grid>

      {/* Scores + milestones */}
      <Grid numItemsLg={3} className="gap-4">
        {/* Milestone circle */}
        <Card className="flex flex-col items-center justify-center gap-3 py-6">
          <ProgressCircle
            value={venture.milestoneRate}
            size="xl"
            color="teal"
          >
            <span className="text-xl font-bold text-gray-900">{venture.milestoneRate}%</span>
          </ProgressCircle>
          <div className="text-center">
            <Text className="font-medium">Milestones</Text>
            <Text className="text-xs text-gray-400">
              {venture.milestonesDone} of {venture.milestonesTotal} completed
            </Text>
          </div>
        </Card>

        {/* Score bars */}
        <Card className="col-span-1 lg:col-span-2 space-y-4">
          <div>
            <Flex>
              <Text className="font-medium">Founder Engagement</Text>
              <Text>{venture.founderEngagement}/100</Text>
            </Flex>
            <ProgressBar value={venture.founderEngagement} color="teal" className="mt-1" />
          </div>
          <div>
            <Flex>
              <Text className="font-medium flex items-center gap-1">
                Health Score
                <span
                  title="Weighted composite: Engagement 25%, Milestones 25%, Stage 20%, Mentorship 15%, Funding 15%"
                  className="cursor-help"
                >
                  <Info size={12} className="text-gray-400" />
                </span>
              </Text>
              <Text>{venture.healthScore}/100</Text>
            </Flex>
            <ProgressBar value={venture.healthScore} color={healthColor(venture.healthScore)} className="mt-1" />
          </div>
          <div>
            <Flex>
              <Text className="font-medium">Predicted Success</Text>
              <Text>{venture.pSuccess}%</Text>
            </Flex>
            <ProgressBar value={venture.pSuccess} color="indigo" className="mt-1" />
          </div>
          <div>
            <Flex>
              <Text className="font-medium">Mentorship Hours</Text>
              <Text>{venture.mentorshipHrs}h</Text>
            </Flex>
            <ProgressBar value={Math.min((venture.mentorshipHrs / 350) * 100, 100)} color="cyan" className="mt-1" />
          </div>
        </Card>
      </Grid>

      {/* Health score legend */}
      <Callout
        title="Health Score formula"
        icon={Info}
        color="teal"
      >
        <div className="flex flex-wrap gap-4 mt-1">
          {HEALTH_FORMULA.map((f) => (
            <div key={f.label} className="text-xs">
              <span className="font-medium">{f.label}</span>{" "}
              <span className="text-gray-500">({f.weight})</span>{" "}
              → <span className="font-semibold text-hent-700">{f.value}</span>
            </div>
          ))}
        </div>
      </Callout>

      {/* Stage history + interventions */}
      <Grid numItemsLg={2} className="gap-4">
        <Card>
          <Title>Stage History</Title>
          {venture.stageHistory.length === 0 ? (
            <Text className="text-xs text-gray-400 mt-3">Entered programme at current stage.</Text>
          ) : (
            <div className="mt-3 space-y-2">
              {venture.stageHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-hent-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{h.stage}</p>
                    <p className="text-xs text-gray-400">
                      From {h.enteredOn} · {h.durationDays} days
                    </p>
                  </div>
                </div>
              ))}
              {/* Current stage */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-2 h-2 rounded-full bg-hent-700 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {venture.stage} <Badge color="teal" size="xs">Current</Badge>
                  </p>
                  <p className="text-xs text-gray-400">
                    {venture.daysInCurrentStage} days so far
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <Title>Interventions Engaged</Title>
          <Text className="text-xs text-gray-400 mt-0.5">Hours per programme touchpoint</Text>
          {interventionList.length > 0 ? (
            <BarList
              className="mt-4"
              data={interventionList}
              color="teal"
              valueFormatter={(v: number) => `${v}h`}
            />
          ) : (
            <Text className="text-xs text-gray-400 mt-4">No events recorded.</Text>
          )}
        </Card>
      </Grid>
    </div>
  );
}
