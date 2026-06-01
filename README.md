# HENT Venture Ecosystem Dashboard

An internal programme management and executive dashboard for **HENT** (Health Entrepreneurship — ALU's Centre for Health Innovation & Entrepreneurship).

## Quick start

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

No backend or external service is needed. All data is generated deterministically from seed files in `src/data/`.

---

## Stack

| Layer | Package |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| App shell / routing | Refine v4 (`@refinedev/core`, `@refinedev/nextjs-router`) |
| Data display | Tremor v3 (`@tremor/react`) |
| Styling | Tailwind CSS v3 |
| Global filter state | Zustand v4 |
| Icons | lucide-react |

---

## Pages

| Route | Description |
|---|---|
| `/` | **Overview** — KPI cards, funding by cohort, stage donut, sector/country rankings, computed insights |
| `/pipeline` | **Venture Pipeline** — stage bar charts, conversion summary, full sortable table with stuck-venture highlighting |
| `/ventures` | **Ventures list** — searchable, sortable table with CSV export |
| `/ventures/show/:id` | **Venture profile** — scores, milestone circle, stage history timeline, intervention BarList |
| `/analytics` | **Analytics** — intervention effectiveness, mentorship correlation, jobs over time, funding efficiency, cohort comparison, at-risk/high-potential tables |
| `/framework` | **M&E Framework** — HENT MELA register, results-chain summary, filterable indicator table with CSV export |

---

## Seed data

| File | Records | Notes |
|---|---|---|
| `src/data/ventures.ts` | 96 ventures | Cohorts 2022–2026, 10 sectors, 12 countries. Generated deterministically. |
| `src/data/events.ts` | 430 events | Linked to ventures via `ventureId`. Includes all 10 intervention types. |
| `src/data/framework.ts` | 57 indicators | Manually authored HENT MELA register across 4 results-chain levels. |

---

## Global filter

A filter bar in the top header drives **all pages simultaneously**. Filters: Cohort, Sector, Country, Stage, Intervention Type, Funding Status. Persisted in a Zustand store; no server round-trips.

---

## Health Score formula

The venture health score (0–100) is a transparent weighted composite:

| Component | Weight |
|---|---|
| Founder Engagement | 25% |
| Milestone Rate | 25% |
| Stage Progress (normalised) | 20% |
| Mentorship Hours (capped 200h) | 15% |
| Funding Mobilised (capped $500k) | 15% |

An in-app tooltip on every venture profile page displays this breakdown.

---

## Brand

Primary colour: **#0D6B72** (deep teal). Configured in `tailwind.config.ts` under `colors.hent` and the Tremor `brand` token override. To retheme, edit that file only.