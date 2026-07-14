# CHII Dashboard — Architecture Audit

**Read-only audit · no source files were modified**

A Next.js 14 App Router application presenting four analytics portals over the CHII programme data. This is a complete inventory of its structure, data and behaviour — the blueprint to refactor against.

| | |
|---|---|
| Routes | **27** |
| Components | **26** |
| Datasets | **23** |
| Lines of TypeScript | **23,432** |
| API routes | **0** |
| Auth checks | **0** |

---

## 0. The verdict, up front

Four of the fifteen requested sections describe things this application does not have. That is the most important finding, and everything else follows from it.

### There is no backend

Zero API routes (`route.ts`), zero `middleware.ts`, zero environment variables, no database, no ORM, no schema. Every figure on every chart is computed in the browser from **static TypeScript literals** committed to `src/data/`. The APIs and database-models sections have nothing to document because nothing exists.

This is not necessarily wrong. As a prototype it is fast, versionable and has no infrastructure. But it means the app cannot ingest real programme data without a data layer being built first.

### There is no authentication

The sign-in form calls `setTimeout(() => router.push(target), 600)`. It validates nothing, sets no session, issues no token. Credentials are pre-filled in the markup as `defaultValue="admin@chii.alu.edu"` and `defaultValue="password"`. Every route is reachable by typing its URL. The "Logout" button is a link to `/`.

**There are no roles and no permissions** — so the role matrix and the auth columns of the route map are uniformly "none / public". If this is deployed anywhere public, all programme data is public.

### What is genuinely healthy

The presentation layer is in good shape after the recent standardisation: one shared primitive set, one theme token file, one nav, one footer, per-portal barrels, and a `Portal` union that makes adding a fifth portal a config change. Type safety is complete — `tsc --noEmit` passes clean.

---

## 1. Project structure

```
CHII_Dashboard/
├── next.config.mjs          Redirects only: /impact/* → /executive/*, /hent/fieldvisits → /hent/study-trips
├── tailwind.config.ts       Tailwind is loaded but most styling is inline style={{}}
├── tsconfig.json            Path alias: @/* → src/*
├── public/logos/            CHII, ALU, AHC, MCF — all with opaque white backgrounds baked in
│
└── src/
    ├── app/                 ROUTES ONLY (27 pages, 4 layouts)
    │   ├── layout.tsx       Root: html/body, Inter font, metadata
    │   ├── page.tsx         Sign-in (the only form in the app)
    │   ├── error.tsx · global-error.tsx · not-found.tsx
    │   ├── executive/       8 pages — cross-pillar analytics
    │   │   └── stories/StoriesMap.tsx   ◄ component living in a route dir
    │   ├── hent/            9 pages — entrepreneurship pillar
    │   │   ├── providers.tsx            ◄ Refine, mounted with a stub data provider
    │   │   └── ventures/show/[id]/      The ONLY dynamic route in the app
    │   ├── hemp/            6 pages — employment pillar
    │   └── heco/            2 pages — ecosystems pillar
    │
    ├── components/          All shared UI
    │   ├── ui/              index.tsx = the primitives; hent/hemp/heco/executive = themed barrels
    │   │   └── heco.tsx                 ◄ 0 importers — HECO pages never adopted it
    │   ├── charts/          6 reusable chart components
    │   ├── executive/       5 executive-only compositions
    │   ├── filters/         filter-popover, filter-select, section-pills
    │   └── layout/          portal-nav, portal-nav-executive, portal-footer, header-design
    │
    ├── data/                THE ENTIRE DATA LAYER — 23 static .ts files
    │   ├── executive/       6 datasets (moved out of route dirs)
    │   ├── hemp/  heco/     6 + 1 datasets
    │   ├── ventures.ts      96 procedurally generated ventures
    │   └── framework.ts                 ◄ 410 lines, 0 importers — DEAD
    │
    ├── theme/               tokens.ts (COLORS/CHART/TYPE) + portals.ts (Portal union, PORTAL_THEMES)
    ├── styles/palette.ts                ◄ a SECOND palette, 6 importers — competes with theme/tokens
    ├── config/navigation.ts PORTAL_NAVS — single source of nav truth
    ├── hooks/use-theme.ts   Dark-mode toggle (localStorage)
    ├── lib/
    │   ├── store.ts         Zustand filter store — used by exactly 1 page
    │   ├── filter.ts        Used by exactly 1 page
    │   └── insights.ts                  ◄ 0 importers — DEAD
    └── types/index.ts       Venture, Stage, Sector, Country, GlobalFilters…
```

### Folder assessment

| Folder | Purpose | Verdict |
|---|---|---|
| `app/` | Routes and layouts only | ✔ Clean — one stray component (`StoriesMap.tsx`) |
| `components/ui/` | Primitives + per-portal themed barrels | ✔ Strong — the barrel pattern is the best idea in the codebase |
| `components/charts/` | Reusable chart building blocks | ✔ Clean |
| `components/executive/` | Executive-only compositions | ✔ Fine — portal-scoped by design |
| `data/` | Static datasets standing in for a database | ⚠ Fragile — no schema, no validation, duplicated types |
| `theme/` | Design tokens + portal themes | ⚠ Split — `styles/palette.ts` duplicates its job |
| `lib/` | Store, filter helpers, insights | ✖ Mostly dead — 1 of 3 files unused; other 2 used once each |
| `types/` | Shared domain types | ✖ Bypassed — data files redefine `Venture`, `Gender` locally |

### Configuration & environment

- **Environment variables: none.** No `.env`, no `process.env` reference anywhere in `src/`. Nothing to configure per-environment — which also means nothing can be.
- **Build config:** `next.config.mjs` contains `reactStrictMode: false` and three redirects. No custom webpack, no image config.
- **Unused dependencies:** `topojson-client` and `clsx` are in `package.json` with **zero** imports. `@tremor/react` and `leaflet` are each used by exactly one file.

---

## 2. Routes

27 pages across four portals. **Every route is public** — no auth guard, no role check, no redirect.

| URL | Layout | Data source | Purpose |
|---|---|---|---|
| `/` | root | — | Sign-in. The only form. |
| `/executive` | executive | 12 datasets | Cross-pillar overview, all KPIs |
| `/executive/outreach` | executive | `executive/outreach` | Reach by gender, institution, pillar |
| `/executive/youth-in-work` | executive | `executive/youth-in-work` | Employment + venture pathways |
| `/executive/wage-employment` | executive | `executive/wage-employment` | Salaries, roles, sectors |
| `/executive/entrepreneurship` | executive | `executive/entrepreneurship` | Venture pipeline & funding |
| `/executive/further-education` | executive | `executive/further-education` | Progression to study |
| `/executive/reports` | executive | inline | Report list. **Downloads are not wired.** |
| `/executive/stories` | executive | `executive/stories` | 364 impact stories + Leaflet map |
| `/hent` | hent | — | 5-line stub → redirects to overview |
| `/hent/overview` | hent | 6 datasets | Pillar overview. **991 lines — largest file.** |
| `/hent/ventures` | hent | `ventures`, `founders` | Portfolio. Only page using Zustand. |
| `/hent/ventures/show/[id]` | hent | `ventures` | **Only dynamic route.** Uses Tremor. |
| `/hent/venture-funding` | hent | `ventures` | Capital deployed by cohort |
| `/hent/masterclasses` | hent | `masterclasses` | Sessions, ratings, attendance |
| `/hent/hackathons` | hent | `hackathons` | Events, teams, projects |
| `/hent/mentorship` | hent | `mentorships` | Programmes, mentors, testimonials |
| `/hent/study-trips` | hent | `study-trips` | Trips. Renamed from "field visits". |
| `/hent/exposure-networking` | hent | `exposure` | Events, stakeholders |
| `/hemp` | hemp | 4 datasets | Employment pillar overview |
| `/hemp/healthx` | hemp | `hemp/healthx` | HealthX sessions |
| `/hemp/internships` | hemp | `hemp/internships` | Placements by sector |
| `/hemp/mission-students` | hemp | `hemp/mission-students` | Tracks, completion, employment |
| `/hemp/sie` | hemp | `hemp/sie` | Signature Immersive Experience |
| `/hemp/global-health` | hemp | `hemp/global-health` | Intro to Global Health course |
| `/heco` | **none** | `heco/cra` | Ecosystems overview |
| `/heco/cra` | **none** | `heco/cra` | CRA programme: fellows, hackathons, research |

> **Route inconsistencies.** **HECO has no layout** — HENT, HEMP and Executive each have a `layout.tsx` mounting their nav; HECO pages import the nav themselves. **HENT is the only portal with a redirect stub** — its root `/hent` is a 5-line page pointing at `/hent/overview`; HEMP and HECO put content at the root directly. Two patterns for the same job.

---

## 3. Components

| Component | Location | Purpose | Reuse |
|---|---|---|---|
| `ChartCard` | `ui/index` | White card, brand header, right-click → PNG | ~60 |
| `SectionHeader` | `ui/index` | Rule + uppercase section title | ~50 |
| `StatCard` | `ui/index` | Filled KPI tile with count-up | high |
| `StatsKpiCard` | `ui/stat-kpi-card` | **A second KPI card** | 15 |
| `InfoDot` | `ui/index` | Hover "i" tooltip | high |
| `Funnel` | `ui/index` | Conversion funnel bars | low |
| `BarList` | `ui/index` | Horizontal bar list | med |
| `ChartTip` / `ChartLegend` | `ui/index` | Recharts tooltip + legend | high |
| `useCountUp` | `ui/index` | Eased number animation (hook) | high |
| `createPortalUi` | `ui/create-portal-ui` | Binds primitives to a portal theme | 4 |
| `AfricaMap` | `charts/africa-map` | Choropleth, configurable colours | med |
| `DonutChart` | `charts/donut-chart` | Donut, 314 lines | med |
| `BulletChart` · `ProgressRing` | `charts/` | Benchmark + ring gauges | low |
| `SatisfactionBars` · `SatisfactionRadar` | `charts/` | Rating displays | low |
| `AfricaChoropleth` | `executive/` | **A second Africa map** | 1 |
| `StoriesMap` | `app/executive/stories/` | Leaflet map — **in a route dir** | 1 |
| `DignifiedWork` · `OutreachAccess` · `ProgramImpactMatrix` · `ProgramQuality` | `executive/` | Executive page sections | 1 each |
| `PortalNav` | `layout/portal-nav` | Nav for HENT/HEMP/HECO | 3 |
| `ImpactNav` | `layout/portal-nav-executive` | **A second nav**, for Executive | 1 |
| `PortalFooter` | `layout/portal-footer` | Footer for all portals | high |
| `FilterPopover` · `FilterSelect` · `InlineFilterSelect` · `SectionPills` | `filters/` | Filter controls | high |

### Duplicates worth merging

| Pair | Problem | Recommendation |
|---|---|---|
| `StatCard` / `StatsKpiCard` | Two KPI tiles with different prop names (`value/label/fill` vs `num/label/Icon`). Both render a filled card with a number. | **Merge.** Keep `StatCard`; migrate the 15 `StatsKpiCard` call sites. |
| `AfricaMap` / `AfricaChoropleth` | Two Africa maps, two implementations, both `react-simple-maps`. | **Merge.** `AfricaMap` already takes colour props — absorb the choropleth. |
| `PortalNav` / `ImpactNav` | Executive's nav has a Portals dropdown and its own `useTheme` copy; otherwise identical structure. | **Merge.** Make the dropdown an optional prop. |
| `StoriesMap` | Component living in `app/executive/stories/`. | **Move** → `components/executive/stories-map.tsx` |
| `ui/heco.tsx` | Themed barrel with **zero importers** — HECO pages still import raw from `@/components/ui`. | **Adopt or delete** |

---

## 4. Layouts

| Layout | Wraps | Provides |
|---|---|---|
| `app/layout.tsx` | Everything | `<html>/<body>`, Inter font, metadata. No nav — so the sign-in page is chrome-free. |
| `app/executive/layout.tsx` | 8 executive pages | `ImpactNav` |
| `app/hent/layout.tsx` | 9 HENT pages | `PortalNav portal="hent"` + Refine provider |
| `app/hemp/layout.tsx` | 6 HEMP pages | `PortalNav portal="hemp"` + Refine provider |
| **heco** | — | ✖ **Missing.** Each HECO page mounts its own nav. |

**Interaction:** root layout → portal layout → page. The nav is sticky at `z-50`; the footer is rendered *by each page* rather than by the layout, which is why some pages have one and others do not. Moving `PortalFooter` into the portal layouts would fix that class of bug permanently.

---

## 5. Data architecture

23 TypeScript modules exporting frozen literals. There is no persistence, no fetching and no mutation anywhere — data flows in exactly one direction.

```
Static .ts literal  →  import  →  useMemo(filter + aggregate)  →  Recharts / StatCard
                                        ▲
                                   useState filters
                                   (per page, never shared)
```

| Entity | File | Volume | Key fields |
|---|---|---|---|
| Venture | `data/ventures.ts` | 96 | id, name, sector, stage, country, cohort, funding, jobsTotal, jobs6m, jobsWomen, teamGender, status |
| Founder | `data/founders.ts` | — | id, name, gender, venture, programme events |
| Masterclass | `data/masterclasses.ts` | ~14 | id, topic, year, month, attendees, femaleAttendees, completionRate, scores, byAge, byRegion, byStage, bySocial |
| Hackathon | `data/hackathons.ts` | ~10 | id, name, year, location, teams, projects, category |
| MentorshipProgram | `data/mentorships.ts` | ~8 | id, type, year, mentors, mentees, criteria scores, testimonials |
| StudyTrip | `data/study-trips.ts` | ~10 | id, type, year, month, region, participants, criteria |
| ExposureEvent | `data/exposure.ts` | 18 | id, name, year, type, stakeholderGroups |
| MissionStudent | `data/hemp/mission-students.ts` | — | id, track, cohort, completionStatus, employmentStatus |
| Internship | `data/hemp/internships.ts` | — | id, sector, cohort, year, org |
| HealthXSession | `data/hemp/healthx.ts` | — | id, type, orgType, year, month, attendees |
| SieCohort · SieSiteVisit | `data/hemp/sie.ts` | 3 · 27 | phase, activity, exposureArea, discipline |
| GHCohort | `data/hemp/global-health.ts` | 5 | module, programme, enrolment |
| Fellow · CraHackathon · ResearchPartnership | `data/heco/cra.ts` | 20 · 6 · 12 | pillar, support, execRole, publicationStage, theme, partnershipType |
| Story | `data/executive/stories.ts` | 364 | type, programme, missionArea, nationality, gender, disability |
| Youth · Worker · OutreachParticipant · FeStudent | `data/executive/*` | — | gender, pathway, employmentType, salary, cohort, country |

> **The data is synthetic.** `ventures.ts` ends with `Array.from({ length: 96 }, (_, i) => buildVenture(i))` — the portfolio is *procedurally generated*, not recorded. The HEMP SIE / HealthX-careers / global-health and HECO CRA datasets were authored as plausible fiction, as were the two 2022 masterclasses added to make that timeline start in 2022.
>
> Every number this application displays is currently invented. That is fine for a prototype and dangerous in front of a funder.

---

## 6. Data dictionary

See the companion document, [`dashboard-data-dictionary.md`](./dashboard-data-dictionary.md), for the full MELA data dictionary: 106 KPIs, 118 charts, 14 filter types, formulas, validation and the standardisation plan.

### The dimensions are defined 5 times over

`Gender` is declared as a type in **5 separate data files**; `GENDERS` as a const in **6**. `Venture` is declared **3 times** (`types/index.ts`, `executive/entrepreneurship.ts`, `executive/youth-in-work.ts`) with *different fields each time*. `COUNTRIES` exists in 4 files.

A gender category added to one module silently fails to appear in the others. This is the highest-value fix in the codebase.

---

## 7. Forms

There is exactly one `<form>` element in the entire application.

| Aspect | Sign-in — `app/page.tsx` |
|---|---|
| Fields | `portal` (select), `email`, `password`, `remember` (checkbox) |
| Validation | ✖ **None.** Not even `required`. Empty submit succeeds. |
| Endpoint | ✖ **None.** No network call is made. |
| Submission | `setTimeout(() => router.push(PORTAL_ROUTES[portal]), 600)` — a cosmetic 600 ms spinner, then navigate. |
| Success flow | Redirect to the selected portal. Email and password are ignored entirely. |
| Error handling | ✖ **None.** No failure path exists. |
| Credentials | `defaultValue="admin@chii.alu.edu"` / `defaultValue="password"` — hardcoded into the markup. |

---

## 8. APIs

**None exist.** No `route.ts` anywhere under `src/app/`. No `fetch`, no `axios`, no server actions, no `middleware.ts`. The application makes **zero network requests** after the initial page load.

The one thing that *looks* like a data layer is a trap: `hent/providers.tsx` and `hemp/providers.tsx` mount **Refine** with a stub provider whose every method returns empty — `getList: async () => ({ data: [], total: 0 })`. Refine is a 2-dependency, fully-wired admin framework that is currently doing nothing at all. Either build on it or remove it.

---

## 9. Database & data models

**No database, no ORM, no schema.** No Prisma, no Drizzle, no SQL, no migrations, no connection string. The "models" are TypeScript `interface` declarations colocated with the literals they type.

**Relationships are implicit and unenforced.** A `Founder` holds a venture name as a string; a `Story` holds a programme name as a string. Nothing validates that the referenced entity exists — there are no foreign keys, so a typo in a data file produces a silently empty chart rather than an error.

### Enums that exist (as union types in `types/index.ts`)

`Stage`, `Sector`, `VentureStatus`, `FundingStatus`, `TeamGender`, `Country`, `InterventionType`, `FrameworkLevel`. These are the *intended* shared vocabulary — but the data files largely bypass them.

---

## 10. State management

| Mechanism | Where | Holds | Assessment |
|---|---|---|---|
| `useState` | Every page | Filter selections, active section, hover, popover open | Dominant. Local to each page, never shared. |
| `useMemo` | Every page | All derived aggregates — every chart series | ✔ Correct. Recomputed on filter change. |
| React Context | `PortalThemeProvider` | The active portal's theme | ✔ Good. Keeps colours out of call sites. |
| Zustand | `lib/store.ts` | `GlobalFilters`: cohort, sector, country, interventionType, fundingStatus, stage | ⚠ Vestigial. Used by **one page**. Named "global", isn't. |
| localStorage | `hooks/use-theme.ts` | Dark-mode preference | ✔ Fine |
| Server state | — | None. No fetching, no cache, no revalidation. | ✖ Absent |

**The consequence:** filters do not survive navigation. Selecting 2024 + Rwanda on HENT Overview and clicking through to Masterclasses resets everything. Every page re-implements its own filter state from scratch — which is also why `FilterSelect` had been copy-pasted into 15 files.

---

## 11. Business logic

All business logic is *presentational* — it decides how a number is coloured or bucketed, never what may happen. There are no workflows, no status transitions and no approvals in the codebase.

| Rule | Where | Definition |
|---|---|---|
| Benchmark colouring | `theme/tokens.ts → benchColor()` | Maps a percentage against a target to green / amber / red. The one genuinely shared rule. |
| Active-nav resolution | `portal-nav → resolveActiveHref()` | Longest matching href wins, so nested routes don't light up the root tab. |
| Conversion rates | `ui/index → Funnel` | `step[i] / step[i-1] × 100`; bars scaled against the largest step. |
| Count-up animation | `ui/index → useCountUp` | Cubic ease-out over 750 ms. |
| Filter application | each page's `useMemo` | `"All"` sentinel means no filter. Re-implemented per page. |
| Salary / age / region banding | scattered in data files | Bucket boundaries are hardcoded inside individual datasets — not shared, not documented. |

---

## 12. Roles & permissions

**The role matrix is empty.** There is **one role: anonymous**, and it can reach everything. No role field, no permission check, no conditional rendering based on identity, no protected route, no redirect for unauthenticated users.

The Portal selector on the sign-in page *looks* like an access control — pick HENT, land on HENT. It is not. It is a navigation convenience: choosing "HENT" and then typing `/executive` works exactly as well.

If roles are coming, the natural seams already exist: the `Portal` union in `theme/portals.ts` and `PORTAL_NAVS` in `config/navigation.ts` are the obvious places to attach a permission list, and the portal layouts are where a guard would sit.

---

## 13. Navigation map

```
/  Sign-in — portal selector, no auth
│
├─ EXECUTIVE  /executive — navy · nav has a Portals dropdown (the only cross-portal link)
│  ├─ Outreach              /executive/outreach
│  ├─ Youth in Work         /executive/youth-in-work
│  ├─ Wage Employment       /executive/wage-employment
│  ├─ Entrepreneurship      /executive/entrepreneurship
│  ├─ Further Education     /executive/further-education
│  ├─ Impact Reports        /executive/reports          (downloads not wired)
│  └─ Impact Stories        /executive/stories
│
├─ HENT  /hent → /hent/overview — green
│  ├─ Overview              /hent/overview
│  ├─ Ventures              /hent/ventures
│  │   └─ Detail            /hent/ventures/show/[id]    (only dynamic route)
│  ├─ Venture Funding       /hent/venture-funding
│  ├─ Masterclasses         /hent/masterclasses
│  ├─ Hackathons            /hent/hackathons
│  ├─ Mentorship            /hent/mentorship
│  ├─ Study Trips           /hent/study-trips           (301 from /hent/fieldvisits)
│  └─ Exposure & Networking /hent/exposure-networking
│
├─ HEMP  /hemp — navy
│  ├─ HealthX               /hemp/healthx
│  ├─ Internships           /hemp/internships
│  ├─ Mission Students      /hemp/mission-students
│  ├─ SIE                   /hemp/sie
│  └─ Intro to Global Health /hemp/global-health
│
└─ HECO  /heco — navy · no layout
   └─ CRA                   /heco/cra

Dead end: Logout (every nav) → / — a plain link. No session to clear.
Dead end: HENT/HEMP/HECO navs have NO link to any other portal. Only
          Executive can navigate across pillars.
```

> **The graph is not strongly connected.** Since the "HENT PORTAL" buttons were removed, a user inside HENT has no way to reach HEMP, HECO or Executive except by signing out or editing the URL. Executive's Portals dropdown is now the only cross-portal edge in the entire navigation graph, and it points one way.

---

## 14. Naming audit

| Issue | Evidence | Severity |
|---|---|---|
| One concept, many types | `Gender` ×5 · `Venture` ×3 · `Stage` ×2 · `ParticipantType` ×2 · `OrgType` ×2 · `EmploymentType` ×2 | **Critical** |
| One concept, many consts | `GENDERS` ×6 · `COUNTRIES` ×4 · `YEARS` ×3 · `SECTORS` ×3 · `PROGRAMS` ×3 | **Critical** |
| Two palettes | `theme/tokens.ts → COLORS` (14 importers) vs `styles/palette.ts → PALETTE` (6 importers) | **Critical** |
| Component named for a dead concept | `portal-nav-executive.tsx` still exports `ImpactNav` and `IMPACT_TABS`; the portal was renamed to Executive. | Medium |
| Two KPI cards | `StatCard` (`value/label/fill`) vs `StatsKpiCard` (`num/label/Icon`) | Medium |
| Misleading name | `GlobalFilters` / `useFilterStore` — global in name, used by one page | Medium |
| US/UK spelling mix | `PROGRAMS` (data) vs "Programme" (all UI copy) | Low |

### Recommended convention

| Kind | Convention | Example |
|---|---|---|
| Files | kebab-case | `portal-nav.tsx` · `study-trips.ts` |
| Components | PascalCase, noun | `ChartCard` · `PortalNav` |
| Hooks | camelCase, `use` prefix | `useCountUp` · `usePortalTheme` |
| Types & interfaces | PascalCase, singular | `Venture` · `Portal` |
| Const collections | SCREAMING_SNAKE, plural | `PORTAL_NAVS` · `SECTORS` |
| Data exports | camelCase, plural | `ventures` · `studyTrips` |
| Domain spelling | UK English throughout, to match the UI | `PROGRAMMES`, not `PROGRAMS` |

---

## 15. Recommendations

Ordered by value, not by effort. The first two are the only ones that change what the application *is*.

| # | Action | Why it matters | Size |
|---|---|---|---|
| 1 | **Decide what this app is.** Either commit to it as a static prototype and delete Refine, or build the data layer it is pretending to have. | Everything downstream depends on this. Right now it is neither, and the Refine stub is a promise the codebase does not keep. | Fundamental |
| 2 | **Add real authentication** — or state explicitly that this is public. Hardcoded credentials in `defaultValue` should not survive a deploy. | Every route is currently open. If programme data is sensitive, it is not protected. | Critical |
| 3 | **Unify the domain vocabulary.** One `Gender`, one `Venture`, one `COUNTRIES`, in `types/`; have every data file import them. | Kills a whole class of silent bug where a new category appears in one chart and not another. | Large |
| 4 | **Replace the synthetic data** with real programme figures. | Every number displayed is currently invented. This is a data task, not a code task — the structure is ready. | Large |
| 5 | **Delete the dead code.** `lib/insights.ts` (0 importers), `data/framework.ts` (410 lines, 0 importers), `components/ui/heco.tsx` (0 importers), and the unused `topojson-client` / `clsx` dependencies. | Free. Nothing references any of it. | Small |
| 6 | **Collapse the second palette.** Fold `styles/palette.ts` into `theme/tokens.ts`. | Two sources of colour truth means colours drift apart over time. | Small |
| 7 | **Merge the duplicate pairs:** `StatCard`/`StatsKpiCard`, `AfricaMap`/`AfricaChoropleth`, `PortalNav`/`ImpactNav`. | Three concepts with two implementations each. | Medium |
| 8 | **Give HECO a layout** and move `PortalFooter` into all four portal layouts. | Stops "I forgot the footer" bugs permanently. | Small |
| 9 | **Restore cross-portal navigation.** HENT, HEMP and HECO currently have no link to anywhere else. | Users are stranded inside a pillar. | Small |
| 10 | **Break up the giant pages.** Six page files exceed 700 lines; `hent/overview` is 991. | Each one mixes data shaping, filter state and ~10 chart definitions in a single component. | Medium |
| 11 | **Either use the Zustand store everywhere or delete it.** Lift filters into it so they survive navigation. | `GlobalFilters` is used by one page. Shared filters would be a genuine UX win. | Medium |
| 12 | **Wire the report downloads** on `/executive/reports`, or remove the buttons. | Controls that do nothing erode trust in the whole dashboard. | Small |

---

*Read-only audit · no source files were modified · CHII Dashboard, Next.js 14.2.29 App Router · 27 routes · 26 components · 23 datasets · 23,432 lines of TypeScript*
