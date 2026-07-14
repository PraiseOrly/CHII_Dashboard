# CHII — Dashboard Data Dictionary

**MELA reference · read-only audit · no source files were modified**

Every KPI, chart, filter and calculation across HEMP, HENT, HECO and Executive, extracted from source rather than inferred. Intended as the single reference for standardising metric definitions and designing the backend data model.

| | |
|---|---|
| KPI cards | **106** |
| Charts | **118** |
| Tables | **7** |
| Filter types | **14** |
| Targets defined | **1** (hardcoded) |
| Data exports | **0** |
| Drill-downs | **1** |

---

## 0. Read this first

Three findings reframe the rest of this document. For a MELA system in particular, they are the difference between a dashboard and a monitoring instrument.

### There are no targets, so there is no variance

Your brief asks for *Targets · Actuals · Variance*. The application tracks **actuals only**. There is exactly one benchmark mechanism in the entire codebase — `benchColor(pct, benchmark)` in `theme/tokens.ts`, which colours a figure red/amber/green against a threshold — and the thresholds are passed ad hoc at call sites, not stored anywhere.

The single visible "target" KPI, **Pace of Target** on HENT Ventures, is `num={5.5}` — a hardcoded literal. It is not computed from anything. **Without a target store, no MELA dashboard here can report performance against plan.**

### "Export" does not export data

The Export button in every nav is **inert** — it has no click handler. The only working export is *right-click a chart → PNG screenshot* (via `html2canvas`). There is no CSV, no Excel, no PDF, no API. On `/executive/reports`, all 26 report cards link to `href="#"`.

### The same metric has different names on different dashboards

**Total Reach** (HEMP, HENT) · **Total Beneficiaries** (Executive) · **Total Participants** (Outreach) · **Participants** (Youth in Work) · **Students Reached** (HECO) — five labels, one concept. Section 11 catalogues the rest. This is the core standardisation problem.

---

## 1. Dashboard inventory

| Dashboard | Business objective | Sections | Primary user |
|---|---|---|---|
| **Executive** | Cross-pillar performance. Answers "is the mission working?" | Overview · Outreach · Youth in Work · Wage Employment · Entrepreneurship · Further Education · Reports · Stories | Leadership, funders, MELA lead |
| **HENT** | Health Entrepreneurship — ventures from idea to scale | Overview · Ventures · Venture Funding · Masterclasses · Hackathons · Mentorship · Study Trips · Exposure & Networking | HENT programme managers |
| **HEMP** | Health Employment — students into dignified work | Overview · HealthX · Internships · Mission Students · SIE · Intro to Global Health | HEMP programme managers |
| **HECO** | Health Ecosystems — public-sector capacity via 3 pillars | Overview · CRA (Fellowship · Hackathons · Research) | HECO programme managers |

> **On "primary users":** these are *inferred from content*, not enforced. The application has no roles and no permissions — every user sees every dashboard. The Permissions column your brief requests would read "all / none / none" for all 106 KPIs, so it is stated once here rather than repeated 106 times.

---

## 2. Component inventory

| Component | Count | Status | Notes |
|---|---|---|---|
| KPI cards | 106 | Working | Two implementations: `StatCard` and `StatsKpiCard` |
| Charts | 118 | Working | Recharts. Bar, line, area, pie, donut, radar, funnel, heatmap, scatter |
| Maps | 3 | Duplicated | `AfricaMap` · `AfricaChoropleth` · `StoriesMap` (Leaflet) |
| Filters | 14 types | Working | Popover + section pills + inline selects |
| Tables | 7 | Static | Display-only. No sort, no search, no pagination, no export |
| Funnels | 8 | Working | Conversion between pipeline stages |
| Search | 1 | Partial | Only on `/executive/reports`. No global search. |
| **Export (data)** | **0** | **Missing** | Nav Export button has no handler. PNG screenshot only. |
| **Drill-down** | **1** | **Near-zero** | Only `/hent/ventures → /show/[id]`. No chart is clickable. |
| **Alerts / notifications** | **0** | **Missing** | No threshold breach, no flag, no exception reporting |
| **Progress vs target** | **0** | **Missing** | Progress rings show % of a total, never % of a target |

---

## 3. KPI catalog

All 106 KPI cards. **Formula** is what the code actually computes. **Target** is empty for all but one — that is a finding, not an omission.

### Executive — Overview

| KPI | Definition | Formula | Unit | Target |
|---|---|---|---|---|
| Total Beneficiaries | All individuals reached across every CHII programme | `Σ healthX + internships + missionStudents + hackathons + masterclasses + studyTrips + mentorships + ventures` | Integer | — |
| Youth in Work | In employment or enterprise within 12 months of completion | `count(youth.pathway ∈ EMPLOYED ∪ VENTURE)` | Integer | — |
| Wage Employment | In paid employment, formal or informal | `count(worker.employmentType ≠ null)` | Integer | — |
| Entrepreneurs | Running own enterprise | `count(youth.pathway ∈ VENTURE_PATHWAYS)` | Integer | — |
| Jobs Created | All jobs across the portfolio | `Σ ventures.jobsTotal` | Integer | — |
| Further Education | Progressed to advanced study | `count(feStudent.status = enrolled)` | Integer | — |

### Executive — pillar pages

| Page | KPIs | Unit |
|---|---|---|
| Outreach | Total Participants · Interventions · Institutions · Female Share · Mission Students · Completion Rate | Int · % |
| Youth in Work | Participants · In Employment · In Internships · Enterprise · Jobs Created · Female · Based in Africa · Primary Jobs · Secondary Jobs · Jobs by Enterprises · Youth Employed by Enterprises | Integer |
| Wage Employment | Wage Employed · Female Wage Employed · 12-Month Placement · Decent Work Rate · Tech Roles · Median Time to Job | Int · % · Months |
| Entrepreneurship | Entrepreneurs · Active Enterprises · Jobs Created · Female-led · Capital Secured · Revenue Growth · Market Expansion | Int · USD · % |
| Further Education | In Further Study · Currently Enrolled · Further Study Rate · Female Share · Scholarship/Funded · Countries of Study · Active Students · Scholars Progressing · Talents Progressing · Female Participation · Male Participation | Int · % |
| Stories | Stories (364) · Countries (29) · Video Stories (15) · Written Stories (349) | Integer |

### HENT

| Page | KPIs | Notes |
|---|---|---|
| Overview | Total Reach · Active Ventures · Female Reach · Partnerships · Jobs Created · Hackathons · Masterclasses · Mentorships · Study Trips | "Total Reach" = Executive's "Total Beneficiaries", scoped to HENT |
| Ventures | Health Ventures · Jobs Created · Funds Deployed · Active Founders · **Pace of Target** | ⚠ **Pace of Target is hardcoded `5.5`** |
| Venture Funding | Capital Deployed · Ventures Funded · Milestone Rate · Progressed to Scale · Jobs Created | Jobs Created appears here *and* on Ventures *and* on Overview |
| Masterclasses | Female · Male · Student · Alumni Participants | Demographic splits only — no headline KPI |
| Hackathons | *none* | ⚠ Only HENT page with no KPI cards |
| Mentorship | Female Fellows · Male Fellows · Student Fellows · Alumni Fellows | "Fellows" here ≠ HECO "Fellows" |
| Study Trips | Female · Male · Student · Alumni Participants | |
| Exposure & Networking | Events Held · Founder Placements · Investors Engaged · Connections Made · Agreements Signed · **Visibility Score** | ⚠ **Visibility Score is undefined — no formula anywhere** |

### HEMP

| Page | KPIs |
|---|---|
| Overview | Total Reach · Mission Students · Female Reach · Partnerships · **Employment Rate** · HealthX Sessions · Internship Orgs · Mission Cohorts · Countries |
| HealthX | Health Hub Visits Completed · Active Partnerships (MOUs Signed) · Students with Field Exposure · Institutions · Students Reached · Employers · Leads Generated · Leads Converted · Partnerships |
| Internships | Total Interns |
| Mission Students | Health Mission Students Active · Courses Completed (Canvas/Coursera) · Resources by Mission Curators · Mentors Recruited · Programme Feedback Collected · Lectures Held · Career Centre Events · Training Courses · 1-on-1 Sessions |
| SIE | Students Selected · Completed Programme · Site Visits · Partner Projects · Employment Leads · Satisfaction |
| Global Health | Enrolled · Completed · Certified · Avg Score · Progressed On · Satisfaction |

### HECO

| Page | KPIs |
|---|---|
| Overview | Fellows · Funding Awarded · Students Reached · Ventures Incubated · Research Studies · Partnerships |
| CRA | Fellows · Operational Funding · Publications · Ventures Incubated · Research Studies · Partnerships |

> **Owner and frequency cannot be documented.** Your brief asks for each KPI's owner and update frequency. Neither exists anywhere in the codebase — there is no metadata layer, no indicator registry, no ownership field. Every figure recomputes on page load from a static file. **Update frequency is therefore "on deploy" for all 106.**

---

## 4. Chart inventory

118 charts. Every one is **read-only**: no chart in the application is clickable, and none supports drill-down.

| Type | Typical X | Typical Y | Aggregation | Used for |
|---|---|---|---|---|
| Grouped bar | Year / Programme / Sector | Count | `count / sum, grouped` | Participants by programme, jobs by country |
| Stacked bar | Year | Count by category | `sum by group` | Gender splits, contract-type composition |
| Line / area | Year (2022–2026) | Count / cumulative | `sum, running total` | Trends, cumulative reach, capital deployed |
| Pie / donut | — | Share | `count → %` | Gender distribution, sector mix, status |
| Funnel | — | Stage volume | `count per stage; conv = s[i]/s[i-1]` | Pipeline, lifecycle, research-to-policy |
| Radar | Criterion | Score 1–5 | `mean` | Satisfaction by dimension |
| Heatmap | Session type | Criterion | `mean score` | Satisfaction matrices |
| Choropleth | Country | Intensity | `count by country` | Geographic reach |
| Horizontal bar list | Value | Category | `sum, sorted desc` | Top performers, capital by sector |

> **The trend axis is hardcoded to 2022–2026.** Nearly every time series runs a fixed `[2022, 2023, 2024, 2025, 2026]` array. 2025 and 2026 are *future or partial* periods, but they are plotted identically to complete years — with no "partial period" marker. A reader cannot tell a real dip from an incomplete year.

---

## 5. Table inventory

7 tables. None of them are tables in the interactive sense.

| Table | Page | Sort | Search | Paginate | Export |
|---|---|---|---|---|---|
| Top Masterclasses / Engaged Ventures | `hent/masterclasses` | Pre-sorted | No | No | No |
| Milestone Delivery — Top Funded | `hent/venture-funding` | Pre-sorted | No | No | No |
| Platform Comparison | `hent/exposure-networking` | Pre-sorted | No | No | No |
| Satisfaction Matrix | `hent/mentorship` | No | No | No | No |
| Programme Performance | `hent/overview` · `hemp` | No | No | No | No |
| Partnership Pipeline | `hemp/healthx` | No | No | No | No |
| Highest-Rated Site Visits | `hemp/sie` | Pre-sorted | No | No | No |

Sorting where it exists is done **at build time in the data layer** (`.sort()` inside a `useMemo`), not by the user. There is no venture list, no participant list, no exportable roster anywhere — which is what a MELA officer would most need.

---

## 6. Filter inventory

| Filter | Type | Default | Appears on |
|---|---|---|---|
| Year | Enum 2022–2026 | `"All"` | Nearly every page |
| Gender | Enum | `"All"` | HENT ×4 · Exec ×3 |
| Country | Enum | `"All"` | HENT · HEMP · HECO · Exec |
| Cohort | Integer year | `"All"` | HENT ventures/funding · Exec ×3 · HECO |
| Sector | Enum | `"All"` | HENT funding · HEMP internships |
| Stage | Expose · Build · Scale | `"All"` | HENT ventures · Exec entrepreneurship |
| Programme | Enum | `"All"` | Exec ×4 |
| Participant Type | Student · Alumni · Scholar | `"All"` | Exec youth-in-work · wage-employment |
| Region | Enum | `"All"` | HEMP overview · HENT study-trips |
| Type | Context-dependent | `"All"` | HENT mentorship/study-trips/exposure · HEMP healthx |
| Topic | Enum | `"All"` | HENT masterclasses |
| Instrument | Enum | `"All"` | HENT venture-funding |
| Employment Status | Enum | `"All"` | Exec youth-in-work |
| Institution | Enum | `"All"` | Exec outreach |

> **Filters are page-local and do not persist.** Every filter is a `useState` inside its page. Select *2024 + Rwanda* on HENT Overview, navigate to Masterclasses, and everything resets to "All". There is a Zustand store (`GlobalFilters`) that would solve this — it is used by exactly **one** page.
>
> **Missing filters a MELA system would expect:** date range (only whole years exist), age group, partner/organisation, district/sub-national, outcome status, and reporting period.

---

## 7. Business metrics

Against the metric list in your brief — what exists, and what does not.

| Metric | Status | Where |
|---|---|---|
| Beneficiaries / Participants / Youth Reached | ⚠ 3 names | Exec · HEMP · HENT · Outreach — same concept |
| Youth in Work | ✔ Present | Executive |
| Wage Employment | ✔ Present | Executive |
| Self Employment | ⚠ Implicit | Folded into "Entrepreneurs" — not separately reported |
| Entrepreneurship | ✔ Present | Exec · HENT |
| Businesses Created | ⚠ Ambiguous | "Active Ventures" / "Active Enterprises" / "Health Ventures" — 3 names |
| Jobs Created | ⚠ 4 locations | Exec · HENT overview · ventures · venture-funding · youth-in-work |
| Businesses Supported | ✔ Present | "Ventures Funded" (HENT) · "Ventures Incubated" (HECO) |
| Revenue | ⚠ Partial | "Revenue Growth" on Exec entrepreneurship only. No revenue figures. |
| Funding | ⚠ 4 names | Capital Deployed · Funds Deployed · Capital Secured · Funding Awarded · Operational Funding |
| Training Completion | ✔ Present | Completion Rate · Courses Completed · Completed Programme |
| Certifications | ✔ Present | HEMP Global Health only ("Certified") |
| Outreach | ✔ Present | Executive Outreach page |
| Programme Completion | ✔ Present | Multiple |
| Partner Performance | ⚠ Weak | Partner counts exist; no performance scoring |
| Regional Performance | ✔ Present | Choropleths + region filters |
| **Targets** | ✖ **Missing** | One hardcoded value. No target store. |
| **Actuals** | ✔ Present | This is all the app has |
| **Variance** | ✖ **Impossible** | Requires targets |
| **Forecast** | ✖ **Missing** | No projection anywhere |
| **Risk indicators** | ✖ **Missing** | No flags, no exceptions, no thresholds |

### Metrics found that your brief did not list

- **Decent Work Rate** — Executive wage employment. Aligns with SDG 8; arguably a headline metric.
- **Median Time to Job** — months from completion to placement. The only duration metric in the app.
- **Social Inclusion splits** — MCF Scholars · PWD · Refugee/Displaced. Present on 4 HENT pages and Outreach. **This is your equity story and it is under-used.**
- **Satisfaction / rating scores** — 1–5 scales across masterclasses, mentorship, study trips, SIE, HealthX.
- **Leads Generated / Converted** — HealthX careers funnel.
- **Publication Pipeline · Research-to-Policy funnel** — HECO. The only policy-influence metrics.
- **Visibility Score** — HENT exposure. ✖ **No definition exists.**

---

## 8. Executive rollup

```
HEMP                    HENT                    HECO
healthXSessions         ventures                fellows
internships             masterclasses           craHackathons
missionStudents         hackathons              researchPartnerships
sieCohorts              mentorships
ghCohorts               studyTrips
                        exposureEvents
    │                       │                       │
    └───────────────────────┼───────────────────────┘
                            ▼
        EXECUTIVE — re-imports the pillar datasets directly
                            │
   ┌────────────────────────┼────────────────────────┐
   ▼                        ▼                        ▼
Total Beneficiaries    Youth in Work           Jobs Created
Σ across 8 datasets    count(pathway ∈         Σ ventures.jobsTotal
                       EMPLOYED ∪ VENTURE)

⚠ The Executive dashboard ALSO has its own parallel datasets:
  data/executive/{youth-in-work, wage-employment, entrepreneurship,
                  further-education, outreach, stories}.ts
  These define their OWN Venture, Gender, Stage types — they do not
  aggregate the pillar data, they duplicate it.
```

> **The rollup is not a rollup.** This is the most consequential data finding. The Executive dashboard does **not** consistently aggregate HEMP/HENT/HECO. Its overview page imports the pillar datasets, but its six sub-pages read from **six separate `data/executive/*` files** that re-declare `Venture`, `Gender` and `Stage` with different fields.
>
> **Executive "Entrepreneurs" and HENT "Health Ventures" are computed from different source data.** They can disagree, and nothing in the system would detect it. Any MELA claim of a "single source of truth" is currently false.

---

## 9. Data relationship map

```
┌─ RAW DATA ─────────────────────────────────────────────────────┐
   23 static .ts files · no DB · no API · procedurally generated
   ventures.ts · masterclasses.ts · hackathons.ts · mentorships.ts
   study-trips.ts · exposure.ts · hemp/*.ts · heco/cra.ts
   executive/*.ts  ◄ parallel, not derived
└────────────────────────────┬───────────────────────────────────┘
                             ▼
┌─ FILTER (page-local useState) ─────────────────────────────────┐
   year · gender · country · cohort · sector · stage · programme
   "All" sentinel = no filter · resets on every navigation
└────────────────────────────┬───────────────────────────────────┘
                             ▼
┌─ CALCULATED METRICS (useMemo, in-browser) ─────────────────────┐
   count() · sum() · mean() · running total · pct of parent
   conversion = step[i] / step[i-1]
└────────────────────────────┬───────────────────────────────────┘
                             ▼
┌─ KPI (106) ────────────┬─ CHART (118) ─┬─ TABLE (7) ───────────┐
   StatCard/StatsKpiCard    Recharts         static divs
   useCountUp animation     read-only        no sort/export
└────────────────────────┴───────────────┴───────────────────────┘
                             ▼
┌─ EXECUTIVE SUMMARY ────────────────────────────────────────────┐
   6 headline KPIs — partially re-derived, not aggregated
└────────────────────────────────────────────────────────────────┘

NOT PRESENT ANYWHERE IN THIS CHAIN:
  targets · variance · forecast · thresholds · alerts
  data export · audit trail · indicator ownership · refresh cadence
```

---

## 10. Master data dictionary

The canonical fields. Columns your brief requested that are constant across every row — **Database Field** (none), **API Endpoint** (none), **Permissions** (all users, view-only) — are stated once rather than repeated.

| Field | Definition | Type | Source file | Feeds | Validation |
|---|---|---|---|---|---|
| `venture.id` | Venture identifier | Text | `ventures.ts` | Drill-down route | None |
| `venture.sector` | Health sub-sector | Enum | `ventures.ts` | Sector mix · Capital by sector | `Sector` union |
| `venture.stage` | Expose · Build · Scale | Enum | `ventures.ts` | Stage funnel · Milestone rate | `Stage` union |
| `venture.country` | Country of operation | Enum | `ventures.ts` | Choropleth · Jobs by country | `Country` union |
| `venture.cohort` | Year admitted | Integer | `ventures.ts` | Every HENT trend · "Tracking since" | None |
| `venture.funding` | Capital received (USD) | Currency | `ventures.ts` | Capital Deployed · Cumulative | None — no ≥ 0 check |
| `venture.jobsTotal` | Jobs created to date | Integer | `ventures.ts` | **Jobs Created** (Exec + 3 HENT pages) | None |
| `venture.jobsWomen` | Of which held by women | Integer | `ventures.ts` | Gender-disaggregated jobs | ✖ Not checked ≤ `jobsTotal` |
| `venture.teamGender` | Male · Female · Mixed | Enum | `ventures.ts` | Female-led share | `TeamGender` union |
| `*.gender` | Participant gender | Enum | **5 different files** | Every gender chart | ✖ **5 conflicting definitions** |
| `*.year` | Activity year | Integer | most files | Every trend chart | Hardcoded 2022–2026 range |
| `*.attendees` | Participants at a session | Integer | `masterclasses` · `healthx` | Reach KPIs | None |
| `*.femaleAttendees` | Of which female | Integer | `masterclasses` | Female Reach | ✖ Not checked ≤ `attendees` |
| `*.completionRate` | % completing | Percentage | `masterclasses` · `hemp` | Completion KPIs | ⚠ 0–100 not enforced |
| `*.scores` | Rating per criterion | Decimal 1–5 | `masterclasses` · `mentorships` · `study-trips` | Radar · heatmap | ⚠ Range not enforced |
| `*.bySocial` | MCF Scholars · PWD · Refugee | `Record<string,int>` | 4 HENT files | Social Inclusion charts | None |
| `story.*` | 364 impact stories | Text · Enum | `executive/stories.ts` | Stories page · Leaflet map | None |
| `fellow.publicationStage` | Research pipeline stage | Enum | `heco/cra.ts` | Publication funnel | `PublicationStage` union |

> **No validation exists anywhere.** Not one field is validated. Nothing enforces `jobsWomen ≤ jobsTotal`, `femaleAttendees ≤ attendees`, `0 ≤ completionRate ≤ 100`, or `1 ≤ score ≤ 5`. TypeScript checks the *shape* at compile time; it cannot check that a number is sane. A typo in a data file yields a chart that renders happily and is wrong.

---

## 11. Conflicts, duplicates & gaps

### Same concept, different names

| Concept | Names in use | Recommend |
|---|---|---|
| People reached | Total Beneficiaries · Total Reach · Total Participants · Participants · Students Reached | `Total Beneficiaries` |
| Female participation | Female Reach · Female Share · Female Participation · Female · Female-led | `Female Share (%)` + `Female Beneficiaries (n)` |
| Money out the door | Capital Deployed · Funds Deployed · Capital Secured · Funding Awarded · Operational Funding | `Capital Deployed` |
| A supported business | Active Ventures · Active Enterprises · Health Ventures · Ventures Incubated | `Ventures Supported` |
| Programme partner | Partnerships · Active Partnerships (MOUs Signed) · Partner Projects | `Active Partnerships` |
| A person in the programme | Participant · Attendee · Fellow · Student · Beneficiary · Intern | `Participant` (with a role enum) |

> **"Fellows" means two different things.** **HECO Fellows** are public-sector professionals in the CRA fellowship. **HENT Fellows** (on the Mentorship page) are mentees in a mentorship programme. Same word, different populations, both counted. Any cross-pillar sum of "Fellows" would be nonsense.

### Missing for a MELA system

- **Targets and variance** — the core of MELA. Absent.
- **Indicator metadata** — no owner, no definition field, no baseline, no data-collection method, no reporting frequency.
- **Disaggregation is inconsistent** — gender is everywhere; age, disability and refugee status appear on only some pages. Equity reporting cannot be done consistently.
- **No data export** — a MELA officer cannot get the numbers out. PNG screenshots only.
- **No date-range filter** — only whole years. Quarterly reporting is impossible.
- **No sub-national geography** — country is the finest grain. No district, no facility.
- **No audit trail** — no record of who changed a figure or when.
- **No data-quality flags** — no "provisional", no "estimated", no "not yet reported".
- **Undefined metric** — `Visibility Score` ships with no formula.

---

## 12. Standardisation plan

| # | Action | Why |
|---|---|---|
| 1 | **Build an indicator registry.** One table: `id · name · definition · formula · unit · baseline · target · frequency · owner · disaggregations`. Every KPI card reads from it. | Turns 106 hardcoded labels into governed indicators. This single change enables targets, variance, ownership and consistent naming at once — it is the highest-value item in this document. |
| 2 | **Adopt one shared dimension vocabulary.** One `Gender`, one `Country`, one `Programme`, one `ParticipantType`, in `types/`. | Gender is defined 5 times. Cross-pillar aggregation is unsafe until this is fixed. |
| 3 | **Make Executive a genuine rollup.** Delete the parallel `data/executive/*` entities; derive every Executive figure from the pillar data. | Executive and HENT can currently disagree about the same number with nothing detecting it. |
| 4 | **Rename to the canonical set** in section 11. | Five names for "people reached" makes every report ambiguous. |
| 5 | **Add targets + variance** to the registry and render them: actual vs target vs % variance, with `benchColor` already available to drive the RAG status. | The mechanism exists; only the data is missing. |
| 6 | **Add data export** (CSV per chart, plus a full participant roster). | A MELA officer cannot currently retrieve a single number as data. |
| 7 | **Add validation at the data boundary** (Zod or equivalent): `jobsWomen ≤ jobsTotal`, `0 ≤ rate ≤ 100`, `1 ≤ score ≤ 5`. | Nothing is validated today; a bad figure renders as a confident chart. |
| 8 | **Standardise disaggregation.** Every participant metric should carry gender, age band, disability and displacement status. | The equity data is the most fundable story CHII has, and it is currently partial. |
| 9 | **Define or delete `Visibility Score`.** | An undefined KPI on a leadership dashboard is a liability. |
| 10 | **Mark partial periods.** 2025–2026 are plotted as if complete. | Readers cannot distinguish a real decline from an unfinished year. |

> **The good news:** the presentation layer is ready for all of this. `StatCard` already accepts a tooltip and a sub-label; `benchColor` already implements RAG status; the filter components are already shared. An indicator registry could be wired into the existing components without redesigning a single chart.

---

*Read-only data audit · no source files modified · 106 KPI cards · 118 charts · 7 tables · 14 filter types · 23 datasets · 0 targets · 0 data exports*
