# HEMP — Data Dictionary

**Health Employment Pillar** · MELA reference · read-only audit

Students into dignified work. HEMP is the broadest pillar by programme count — six distinct interventions from a careers platform to an immersive field programme — but the shallowest in shared structure: each page has its own dataset and its own vocabulary.

| | |
|---|---|
| Pages | **6** |
| KPI cards | **44** |
| Charts | **35** |
| Datasets | **6** |
| Brand colour | Navy `#185FA5` |
| Route root | `/hemp` |

---

## 1. Purpose & navigation

**Business objective:** move health students from exposure, through structured placement and immersion, into wage employment — and evidence the placement rate.

```
/hemp  (content at root, no redirect stub)
├── Overview                    /hemp
├── HealthX                     /hemp/healthx
├── Internships                 /hemp/internships
├── Mission Students            /hemp/mission-students
├── SIE                         /hemp/sie                ◄ Signature Immersive Experience
└── Intro to Global Health      /hemp/global-health      ◄ replaced the old "Pipeline" page
```

**Layout:** `app/hemp/layout.tsx` — mounts `PortalNav portal="hemp"` and the Refine provider (inert; see §7).

---

## 2. Data sources

| Page | Datasets imported |
|---|---|
| Overview | `hemp/healthx` · `hemp/internships` · `hemp/mission-students` |
| HealthX | `hemp/healthx` · `hemp/healthx-careers` |
| Internships | `hemp/internships` |
| Mission Students | `hemp/mission-students` |
| SIE | `hemp/sie` |
| Intro to Global Health | `hemp/global-health` |

**Three of these six datasets are entirely fabricated.** `hemp/sie.ts`, `hemp/healthx-careers.ts` and `hemp/global-health.ts` were authored as plausible fiction when those pages were built — there was no source data. `hemp/healthx.ts`, `hemp/internships.ts` and `hemp/mission-students.ts` are also static literals.

> **The HEMP Overview aggregates only 3 of the 6 datasets.** SIE, Global Health and HealthX-careers are *not* rolled into "Total Reach". The pillar headline therefore under-reports its own programmes.

---

## 3. KPI catalog

| Page | KPI | Formula | Unit |
|---|---|---|---|
| **Overview** | Total Reach | `Σ across healthx + internships + missionStudents` ⚠ *excludes SIE, GH* | Integer |
| | Mission Students | `count(missionStudents)` | Integer |
| | Female Reach | `Σ female participants` | Integer |
| | Partnerships | `count(distinct orgs)` | Integer |
| | **Employment Rate** | `employed / total × 100` | % |
| | HealthX Sessions | `count(healthXSessions)` | Integer |
| | Internship Orgs | `count(distinct orgs)` | Integer |
| | Mission Cohorts | `count(distinct cohorts)` | Integer |
| | Countries | `count(distinct countries)` | Integer |
| **HealthX** | Health Hub Visits Completed | `count(visits)` | Integer |
| | Active Partnerships (MOUs Signed) | `count(mou = signed)` | Integer |
| | Students with Field Exposure | `Σ students` | Integer |
| | Institutions · Students Reached · Employers | `count()` | Integer |
| | Leads Generated · Leads Converted | `count(leads)` | Integer |
| | Partnerships | `count(partnerships)` | Integer |
| **Internships** | Host Organisations | `count(distinct orgs)` | Integer |
| | Students Placed | `count(internships)` | Integer |
| | Employment Conv. | `converted / placed × 100` | % |
| | Countries | `count(distinct countries)` | Integer |
| | Mentor-led Orgs | `count(orgs with mentor)` | Integer |
| | Avg Satisfaction | `mean(score)` | Decimal 1–5 |
| **Mission Students** | Health Mission Students Active | `count(status = active)` | Integer |
| | Courses Completed (Canvas / Coursera) | `Σ courses` | Integer |
| | Resources by Mission Curators | `Σ resources` | Integer |
| | Mentors Recruited · Lectures Held | `count()` | Integer |
| | Programme Feedback Collected | `count(feedback)` | Integer |
| | Career Centre Events · Training Courses · 1-on-1 Sessions | `count()` | Integer |
| **SIE** | Students Selected · Completed Programme | `count()` | Integer |
| | Site Visits · Partner Projects | `count()` | Integer |
| | Employment Leads | `count(leads)` | Integer |
| | Satisfaction | `mean(score)` | Decimal 1–5 |
| **Global Health** | Enrolled · Completed · Certified | `count()` | Integer |
| | Avg Score | `mean(assessmentScore)` | Decimal |
| | Progressed On | `count(destination ≠ none)` | Integer |
| | Satisfaction | `mean(score)` | Decimal 1–5 |

### The naming problem inside HEMP

HEMP alone uses **four different words for a participant**: *Students* (SIE, Global Health), *Interns* (Internships), *Mission Students* (Mission Students), and *Participants* (Overview). The Overview's "Total Reach" is the same concept the Executive dashboard calls "Total Beneficiaries".

---

## 4. Charts

35 charts. None are clickable.

| Page | Charts |
|---|---|
| Overview | Delivery per Year · Participants per Year · Gender Distribution · Participants by Programme · Reach by Region (Africa map) · HealthX satisfaction by dimension (radar) · Satisfaction by programme · Programme Performance (table) |
| HealthX | Partnership Pipeline (table) · Student Feedback · Visits by Organisation Type · Sessions by Organisation Type · Participant Reach by Org Type · Sessions Delivered per Year · Student Reach per Year · Satisfaction Heatmap (Session Type × Dimension) · Country Reach · Leads Generated vs Converted |
| Internships | Students by Sector · Diversity & Mentoring · Organisations per Year · Students Placed per Year · Satisfaction by Sector · Conversion Rate by Sector · Interns by Cohort · Cohort Distribution · Yearly Cohort Growth · Placement Conversion · Placement Lifecycle Funnel · Supervision Coverage · Students Placed by Country · Country Placement Distribution |
| Mission Students | Mentorship Activity by Year · Mentorship Program Indicators · Guest Faculty Sessions per Year · Curator Resources Delivered per Year · Courses Completed per Year · Survey & Data Status |
| SIE | Delivery Hours by Phase · Participation Funnel · Exposure Gain by Area · Site Visits by Host Type · Participants by Discipline · Activity Pillars Delivered · Cohort Growth · Highest-Rated Site Visits (table) |
| Global Health | Course Funnel · Module Completion — Where Learners Drop Off · Onward Destinations · Progression per Cohort · Cross-Disciplinary Intake · Enrolment & Assessment Score by Cohort |

---

## 5. Filters

| Filter | Values | Default | Pages |
|---|---|---|---|
| Year | 2022–2026 | `All` | All 6 pages |
| Country | Enum | `All` | Overview · HealthX · Internships · SIE |
| Region | Enum | `All` | Overview |
| Sector | Enum | `All` | Internships |
| Type | Session type | `All` | HealthX |

HEMP has the **thinnest filter set** of the four dashboards. Notably absent: **gender** — despite every HEMP page reporting gender splits in its charts, no HEMP page lets you *filter* by gender. HENT and Executive both do.

---

## 6. Data dictionary

### `MissionStudent` — `hemp/mission-students.ts`

| Field | Definition | Type | Feeds |
|---|---|---|---|
| `id` | Student identifier | Text | — |
| `track` | Study track | Enum `StudentTrack` | Track distribution |
| `cohort` | Intake year | Integer | Mission Cohorts KPI |
| `completionStatus` | Completion state | Enum | Courses Completed |
| `employmentStatus` | Employment state | Enum | **Employment Rate** |

### `Internship` — `hemp/internships.ts`

| Field | Definition | Type | Feeds |
|---|---|---|---|
| `sector` | Placement sector | Enum `InternshipSector` | Students by Sector · Satisfaction by Sector |
| `cohort` | Internal · SFH · WAG · KASHA | Enum `InternshipCohort` | Cohort Outcomes |
| `year` | Placement year | Integer | Placements per Year |
| `org` | Host organisation | Text | Organisations per Year |

### `HealthXSession` — `hemp/healthx.ts`

| Field | Definition | Type | Feeds |
|---|---|---|---|
| `type` | Session type | Enum `HealthXType` | Sessions by Type |
| `orgType` | Host org type | Enum `OrgType` | Visits by Org Type |
| `year` · `month` | When | Integer | Annual activity |
| `attendees` | Participants | Integer | Student Reach |

### `SieCohort` · `SieSiteVisit` — `hemp/sie.ts` *(synthetic)*

| Field | Definition | Type |
|---|---|---|
| `phase` | Enum `SiePhase` | Delivery Hours by Phase |
| `activity` | Enum `SieActivity` | Activity Pillars |
| `exposureArea` | Enum `SieExposureArea` | Exposure Gain |
| `discipline` | Enum `SieDiscipline` | Participants by Discipline |

### `GHCohort` — `hemp/global-health.ts` *(synthetic)*

| Field | Definition | Type |
|---|---|---|
| `module` | Enum `GHModule` | Module Completion funnel |
| `programme` | Enum `GHProgramme` | Cross-Disciplinary Intake |
| `enrolment` | Integer | Enrolment by Cohort |

---

## 7. Known issues specific to HEMP

| Issue | Detail |
|---|---|
| **Overview under-reports** | "Total Reach" aggregates only 3 of 6 HEMP datasets. SIE, Global Health and HealthX-careers are excluded. |
| **Half the data is invented** | `sie.ts`, `healthx-careers.ts` and `global-health.ts` were written as plausible fiction with no source data. |
| **No gender filter** | Every page charts gender splits; no page lets you filter by gender. |
| **Four words for one participant** | Students · Interns · Mission Students · Participants. |
| **`Employment Rate` is the only rate KPI** | It is HEMP's headline outcome metric but has no target to measure against. |
| **Refine is mounted but inert** | `hemp/providers.tsx` wires a stub provider returning empty arrays. |
| **`hemp/internships` is 942 lines** | Second-largest page file in the codebase. |
| **Cohort means two things** | On Internships it is an org (`Internal · SFH · WAG · KASHA`); on Mission Students it is a year. |

---

## 8. Recommendations — HEMP

1. **Fix the Overview rollup.** "Total Reach" must include SIE, Global Health and HealthX-careers, or the pillar under-reports itself.
2. **Replace the three synthetic datasets** with real programme data before any external use.
3. **Add a gender filter** to every HEMP page — the data supports it, the UI does not expose it.
4. **Standardise on "Participant"** with a role enum (`student` / `intern` / `mission-student`).
5. **Disambiguate `cohort`.** Rename the Internships one to `hostOrg` or `partnerCohort`.
6. **Give `Employment Rate` a target.** It is the pillar's headline outcome and currently floats without a benchmark.
7. **Break up `hemp/internships`** (942 lines).

---

*Read-only audit · no source files modified · Companion documents: [HENT](./hent-data-dictionary.md) · [HECO](./heco-data-dictionary.md) · [Executive](./executive-data-dictionary.md) · [Architecture](./architecture-audit.md)*
