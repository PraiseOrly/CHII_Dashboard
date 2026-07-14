# Executive — Data Dictionary

**Cross-pillar dashboard** · MELA reference · read-only audit

The leadership view. Eight pages answering "is the mission working?" — and the one dashboard whose numbers a funder will actually see.

It is also the one with the most serious data defect in the application: **it is not a rollup.**

| | |
|---|---|
| Pages | **8** |
| KPI cards | **25** |
| Charts | **26** |
| Datasets | **6 own + 8 pillar** |
| Brand colour | Navy `#102C5E` |
| Route root | `/executive` |

---

## 0. The headline finding

The Executive dashboard has **two incompatible data strategies running side by side**.

```
/executive  (Overview)
   imports:  hemp/healthx · hemp/internships · hemp/mission-students
             hackathons · masterclasses · study-trips · mentorships · ventures
   ✔ a genuine rollup of HEMP + HENT
   ✖ but HECO is entirely absent

/executive/youth-in-work        imports: executive/youth-in-work
/executive/wage-employment      imports: executive/wage-employment
/executive/entrepreneurship     imports: executive/entrepreneurship
/executive/further-education    imports: executive/further-education
/executive/outreach             imports: executive/outreach
/executive/stories              imports: executive/stories
   ⚠ six SEPARATE datasets — an outcomes layer, not a copy of the pillars.
     They carry fields no pillar dataset has (salaryBand, roleLevel,
     timeToEmployment, qualification), so they cannot simply be derived
     away. What WAS wrong — a shared Gender type declared 5 times with
     two incompatible spellings — is now FIXED.
```

**Consequences:**

1. **HECO contributes nothing.** The Overview imports no HECO data. "Total Beneficiaries" silently excludes the entire third pillar.
2. **Executive and HENT can disagree.** Executive "Entrepreneurs" comes from `executive/entrepreneurship.ts`. HENT "Health Ventures" comes from `ventures.ts`. They are different source data describing the same population. Nothing in the system would detect a divergence.
3. **Any claim of a single source of truth is currently false.**

---

## 1. Purpose & navigation

**Business objective:** aggregate HEMP, HENT and HECO into a defensible cross-pillar picture of reach, employment, entrepreneurship and further study — the view that goes to leadership, funders and the MELA lead.

```
/executive
├── Overview             /executive                    ◄ 6 headline KPIs
├── Outreach             /executive/outreach
├── Youth in Work        /executive/youth-in-work
├── Wage Employment      /executive/wage-employment
├── Entrepreneurship     /executive/entrepreneurship
├── Further Education    /executive/further-education
├── Impact Reports       /executive/reports            ◄ downloads not wired
└── Impact Stories       /executive/stories
```

**Layout:** `app/executive/layout.tsx` — mounts `ImpactNav` (still named for the old "Impact" portal). This is the **only nav in the application with a cross-portal dropdown**; HENT, HEMP and HECO have no link out.

---

## 2. Headline KPIs (Overview)

| KPI | Business definition | Formula | Unit | Target |
|---|---|---|---|---|
| **Total Beneficiaries** | All individuals reached across every CHII programme | `Σ healthX + internships + missionStudents + hackathons + masterclasses + studyTrips + mentorships + ventures` ⚠ **excludes HECO** | Integer | — |
| **Youth in Work** | In employment or enterprise within 12 months of completing | `count(youth.pathway ∈ EMPLOYED_PATHWAYS ∪ VENTURE_PATHWAYS)` | Integer | — |
| **Wage Employment** | In paid employment of any kind, formal or informal | `count(worker.employmentType ≠ null)` | Integer | — |
| **Entrepreneurs** | Running their own enterprise | `count(youth.pathway ∈ VENTURE_PATHWAYS)` | Integer | — |
| **Jobs Created** | All jobs created across the portfolio | `Σ ventures.jobsTotal` | Integer | — |
| **Further Education** | Progressed to further study or advanced qualification | `count(feStudent.status = enrolled)` | Integer | — |

**No target exists for any of them.** These six figures are what leadership sees, and none can be reported against plan.

---

## 3. KPI catalog — sub-pages

| Page | KPIs | Unit |
|---|---|---|
| **Outreach** | Total Participants · Interventions · Institutions · Female Share · Mission Students · Completion Rate | Int · % |
| **Youth in Work** | Participants · In Employment · In Internships · Enterprise · Jobs Created · Female · Based in Africa · Primary Jobs · Secondary Jobs · Jobs by Enterprises · Youth Employed by Enterprises | Integer |
| **Wage Employment** | Wage Employed · Female Wage Employed · 12-Month Placement · **Decent Work Rate** · Tech Roles · **Median Time to Job** | Int · % · Months |
| **Entrepreneurship** | Entrepreneurs · Active Enterprises · Jobs Created · Female-led · Capital Secured · Revenue Growth · Market Expansion | Int · USD · % |
| **Further Education** | In Further Study · Currently Enrolled · Further Study Rate · Female Share · Scholarship/Funded · Countries of Study · Active Students · Scholars Progressing · Talents Progressing · Female Participation · Male Participation | Int · % |
| **Stories** | Stories (364) · Countries (29) · Video Stories (15) · Written Stories (349) | Integer |

### Two metrics worth protecting

- **Decent Work Rate** — aligns directly with SDG 8. It is the only decent-work measure in the application and is buried on a sub-page.
- **Median Time to Job** — the only *duration* metric anywhere. Every other figure is a count or a share.

---

## 4. Charts

| Page | Charts |
|---|---|
| **Overview** | Programme Impact Matrix · Programme Quality · Dignified Work · Outreach Access · Africa Choropleth · Impact Themes · Featured Impact Story |
| **Outreach** | Participants by Program (gender-split) · Participation by Intervention · Participation Trend (annual vs cumulative 2022–2026) · Gender Distribution · Inclusion by Program · Student Population Profile |
| **Youth in Work** | Work Pathway Distribution · Participant Group Comparison (Students · Alumni · Scholars) · Employment Outcomes by Program · Employment Pathway Trend · Primary & Secondary Jobs |
| **Wage Employment** | Gender Distribution · Role Level · Contract Type · Employer Type & Working Arrangement · Yearly Wage Jobs Trend · Job Type Evolution · 12-Month Placement Rate · Average Monthly Income |
| **Entrepreneurship** | Enterprise Stage Distribution · Enterprise Status · Enterprises Started per Year · Enterprise Survival Rate · Formal vs Informal · Founder Gender · Capital Raised Over Time |
| **Further Education** | Further Study Rate: Scholars vs Talents · Active vs Completed Programmes · Enrolment Trend by Year · Student Profile |
| **Stories** | Leaflet map (`StoriesMap`) · story cards with 6-facet filter |

---

## 5. Filters

| Filter | Values | Default | Pages |
|---|---|---|---|
| Year | 2022–2026 | `All` | Outreach · Wage Employment · Further Education · Entrepreneurship |
| Gender | Enum | `All` | Wage Employment · Youth in Work · Stories |
| Country | Enum | `All` | Wage Employment · Youth in Work |
| Cohort | Year | `All` | Wage Employment · Youth in Work · Further Education |
| Programme | Enum | `All` | Outreach · Wage Employment · Youth in Work |
| Participant Type | Student · Alumni · Scholar | `All` | Wage Employment · Youth in Work |
| Employment Status | Enum | `All` | Youth in Work |
| Institution | Enum | `All` | Outreach |
| Intervention | Enum | `All` | Outreach |
| Stage · Status · Funding Source | Enum | `All` | Entrepreneurship |
| Qualification · Field · Destination | Enum | `All` | Further Education |
| Story type · Mission area · Humanitarian status · Nationality · Disability | Enum | `All` | Stories |

The Executive dashboard has the **richest filter set** in the application. The `/executive/outreach` popover is the design that was subsequently adopted across HENT and HEMP.

---

## 6. Data dictionary — the six parallel datasets

> ⚠ These entities **re-declare** `Gender`, `Stage` and `Venture` rather than importing the shared types. This is the root of the divergence risk in §0.

### `executive/youth-in-work.ts` — `Youth` · `Venture`

| Field | Type | Feeds |
|---|---|---|
| `gender` | Enum *(own definition)* | Gender charts |
| `program` | Enum `Program` | Employment Outcomes by Program |
| `participantType` | Student · Alumni · Scholar | Participant Group Comparison |
| `pathway` | Enum `Pathway` | **Work Pathway Distribution · Youth in Work KPI** |
| `employmentType` | Enum | Employment charts |
| `employerType` | Enum | Employer breakdown |
| `cohort` · `country` · `sector` | — | Filters |

### `executive/wage-employment.ts` — `Worker`

| Field | Type | Feeds |
|---|---|---|
| `employmentType` | Full-time · Part-time · Temporary · Contract | Contract Type |
| `roleLevel` | Enum `RoleLevel` | Role Level (seniority) |
| `arrangement` | On-site · Hybrid · Remote | Working Arrangement |
| `orgType` | Enum | Employer Type |
| `salaryBand` | Enum `SALARY_BANDS` | **Average Monthly Income** |
| `participantType` · `sector` · `country` · `cohort` | — | Filters |

### `executive/entrepreneurship.ts` — `Venture` *(a third `Venture` type)*

| Field | Type | Feeds |
|---|---|---|
| `gender` | Enum *(own definition)* | Founder Gender |
| `stage` | Enum *(own definition)* | Enterprise Stage Distribution |
| `status` | Enum `Status` | Enterprise Status |
| `fundingSource` | Enum `FundingSource` | Capital Raised |
| `PIPELINE` | const | Pipeline funnel |

### `executive/further-education.ts` — `FeStudent`

| Field | Type | Feeds |
|---|---|---|
| `qualification` · `field` · `destination` | Enum | Student Profile · filters |
| `fundingSource` | Enum | Scholarship / Funded |
| `relevance` | Enum | — |

### `executive/outreach.ts` — `OutreachParticipant`

| Field | Type | Feeds |
|---|---|---|
| `institution` | Enum `Institution` | Institutions KPI |
| `pillar` | HEMP · HENT · HECO | **Participants by Program** |
| `intervention` | Enum, keyed by pillar | Participation by Intervention |
| `engagementStatus` | Enum | Completion Rate |

> This is the **only Executive dataset that models the three pillars explicitly** (`Pillar` enum, `INTERVENTIONS_BY_PILLAR`). It is the closest thing to a real cross-pillar model and could be the template for fixing the rollup.

### `executive/stories.ts` — `Story`

| Field | Type | Feeds |
|---|---|---|
| `type` | Video · Written | Video / Written Stories KPIs |
| `program` · `missionArea` · `nationality` · `disability` · `gender` · `humanitarian` | Enum | 6-facet filter · Leaflet map |
| `SUMMARY` | const `{ stories: 364, countries: 29, video: 15, written: 349 }` | ⚠ **hardcoded summary, not derived from `STORIES`** |

---

## 7. Known issues specific to Executive

| Issue | Severity | Detail |
|---|---|---|
| **HECO is excluded from every total** | **Critical** | `executive/page.tsx` imports no HECO data. Cross-pillar figures are wrong. |
| **Six separate outcome datasets** | Medium | Sub-pages read their own datasets, which carry fields (salary, role level, time-to-job) that no pillar dataset has. They are an outcomes layer, not a duplicate — but nothing reconciles them against the pillars. |
| **`Venture` declared a third time** | High | `types/index.ts`, `executive/entrepreneurship.ts` and `executive/youth-in-work.ts` all define `Venture` with different fields. |
| ~~`Gender` declared 5 times~~ | ✔ **FIXED** | Was `"Other"` in 4 files and `"Non-binary"` in 2 — incompatible. Now one `Gender` in `types/index.ts`, canonical `"Non-binary"`. |
| **No targets** | **Critical** | Six headline KPIs, zero targets. Leadership cannot see performance against plan. |
| **`SUMMARY` is hardcoded** | High | `stories.ts` exports `{ stories: 364, … }` as a literal rather than deriving it from the `STORIES` array. They can drift apart. |
| **Report downloads are dead** | High | All 26 cards on `/executive/reports` link to `href="#"`. |
| **Export button is inert** | High | No click handler. Only right-click → PNG works. |
| **`ImpactNav` / `IMPACT_TABS`** | Medium | Still named for the old "Impact" portal after the rename to Executive. |
| **`executive/youth-in-work` is 970 lines** | Medium | Second-largest file in the codebase. |

---

## 8. Executive metric map — how it *should* derive from the pillars

```
                    HEMP                 HENT                 HECO
                     │                     │                    │
  Total Beneficiaries ◄────── Σ participants across all three ──┘
                                                     ⚠ HECO currently missing

  Youth in Work      ◄─ HEMP employmentStatus + HENT venture founders
  Wage Employment    ◄─ HEMP employmentStatus = employed
  Entrepreneurs      ◄─ HENT ventures (founders running enterprises)
  Jobs Created       ◄─ Σ HENT ventures.jobsTotal  +  HECO ventures incubated
                                                     ⚠ HECO currently missing
  Further Education  ◄─ HEMP mission students progressing to study
  Decent Work Rate   ◄─ HEMP wage employment quality
  Policy Influence   ◄─ HECO research-to-policy    ⚠ NOT SURFACED AT ALL
```

**`Policy Influence` is the gap.** HECO measures research-to-policy conversion — the only policy metric in CHII's dashboards — and the Executive view does not show it.

---

## 9. Recommendations — Executive

1. **Add HECO to the rollup.** Every cross-pillar total is currently wrong. This is a correctness bug.
2. **Reconcile the six `executive/*` outcome datasets against the pillars.** Do NOT delete them — they hold salary, role level and time-to-job, which no pillar dataset has. Instead, make participant identity shared so an Executive worker can be traced back to a HEMP student.
3. **Add targets to the six headline KPIs.** `benchColor()` already implements RAG status — only the target data is missing.
4. **Derive `SUMMARY` from `STORIES`** instead of hardcoding `{ stories: 364, … }`.
5. **Wire the report downloads,** or remove the 26 dead cards.
6. **Make the Export button work** — CSV per chart, plus a participant roster.
7. **Surface policy influence** from HECO on the Executive view.
8. **Promote `Decent Work Rate`** to the Overview — it is the SDG 8 measure and it is buried.
9. **Rename `ImpactNav` → `ExecutiveNav`** and `IMPACT_TABS` → `EXECUTIVE_TABS`.
10. **Use `executive/outreach.ts` as the model.** Its `Pillar` enum and `INTERVENTIONS_BY_PILLAR` map are the only genuine cross-pillar structure in the codebase — build the rollup on that shape.

---

*Read-only audit · no source files modified · Companion documents: [HENT](./hent-data-dictionary.md) · [HEMP](./hemp-data-dictionary.md) · [HECO](./heco-data-dictionary.md) · [Architecture](./architecture-audit.md)*
