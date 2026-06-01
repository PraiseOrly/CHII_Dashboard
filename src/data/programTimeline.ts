export type Phase = "Expose" | "Build" | "Scale";
export type ActivityStatus = "Completed" | "In Progress" | "Upcoming";

export interface TimelineActivity {
  id: string;
  name: string;
  phase: Phase;
  startDate: string;
  endDate: string;
  status: ActivityStatus;
}

export const timeline2026: TimelineActivity[] = [
  { id: "T01", name: "AFYAFEST",                  phase: "Expose", startDate: "2026-01-15", endDate: "2026-01-17", status: "Completed"   },
  { id: "T02", name: "Cohort Onboarding",           phase: "Expose", startDate: "2026-01-20", endDate: "2026-01-24", status: "Completed"   },
  { id: "T03", name: "Africa Health Tech Summit",   phase: "Expose", startDate: "2026-02-05", endDate: "2026-02-07", status: "Completed"   },
  { id: "T04", name: "AIMS Workshop Series",        phase: "Expose", startDate: "2026-02-15", endDate: "2026-03-15", status: "Completed"   },
  { id: "T05", name: "Venture Ideation Sprint",     phase: "Expose", startDate: "2026-03-01", endDate: "2026-03-05", status: "Completed"   },
  { id: "T06", name: "ALX Venture Academy",         phase: "Build",  startDate: "2026-03-10", endDate: "2026-04-10", status: "Completed"   },
  { id: "T07", name: "Venture Labs Launch",         phase: "Build",  startDate: "2026-04-01", endDate: "2026-04-03", status: "Completed"   },
  { id: "T08", name: "1-on-1 Coaching Programme",   phase: "Build",  startDate: "2026-04-15", endDate: "2026-09-15", status: "In Progress" },
  { id: "T09", name: "HENT Venture Fund Round 1",   phase: "Build",  startDate: "2026-05-01", endDate: "2026-05-31", status: "In Progress" },
  { id: "T10", name: "Mid-Year Review",             phase: "Build",  startDate: "2026-06-15", endDate: "2026-06-17", status: "Upcoming"    },
  { id: "T11", name: "Impact Measurement Audit",    phase: "Build",  startDate: "2026-06-20", endDate: "2026-06-25", status: "Upcoming"    },
  { id: "T12", name: "Scale Accelerator Intake",    phase: "Scale",  startDate: "2026-07-01", endDate: "2026-07-05", status: "Upcoming"    },
  { id: "T13", name: "Demo Day Rwanda",             phase: "Scale",  startDate: "2026-08-10", endDate: "2026-08-11", status: "Upcoming"    },
  { id: "T14", name: "HENT Venture Fund Round 2",   phase: "Scale",  startDate: "2026-09-01", endDate: "2026-09-30", status: "Upcoming"    },
  { id: "T15", name: "Africa Health Innovation Wk", phase: "Scale",  startDate: "2026-10-05", endDate: "2026-10-10", status: "Upcoming"    },
  { id: "T16", name: "Annual Review & Graduation",  phase: "Scale",  startDate: "2026-11-20", endDate: "2026-11-22", status: "Upcoming"    },
  { id: "T17", name: "2027 Planning Workshop",      phase: "Scale",  startDate: "2026-12-01", endDate: "2026-12-05", status: "Upcoming"    },
];
