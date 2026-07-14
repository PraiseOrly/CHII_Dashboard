# HENT — Data Dictionary

**Health Entrepreneurship Pillar** · MELA reference · read-only audit

Ventures from idea to scale. HENT is the deepest of the four dashboards: 8 pages, the only drill-down route in the application, and the only portal with its own venture portfolio.

| | |
|---|---|
| Pages | **8** (+1 drill-down) |
| KPI cards | **31** |
| Charts | **44** |
| Datasets | **7** |
| Brand colour | Green `#2D6A4F` |
| Route root | `/hent` → `/hent/overview` |

---

## 1. Purpose & navigation

**Business objective:** track health ventures from first exposure through build to scale — who is founding them, what support they received, how much capital they absorbed, and how many jobs they created.

```
/hent → /hent/overview
├── Overview               /hent/overview
├── Ventures               /hent/ventures
│   └── Venture detail     /hent/ventures/show/[id]   ◄ the only drill-down in the app
├── Venture Funding        /hent/venture-funding
├── Masterclasses          /hent/masterclasses
├── Hackathons             /hent/hackathons
├── Mentorship             /hent/mentorship
├── Study Trips            /hent/study-trips          ◄ 301 redirect from /hent/fieldvisits
└── Exposure & Networking  /hent/exposure-networking
```

**Layout:** `app/hent/layout.tsx` — mounts `PortalNav portal="hent"` and the Refine provider (which does nothing; see §7).

---

## 2. Data sources

| Page | Datasets imported |
|---|---|
| Overview | `study-trips` · `founders` · `hackathons` · `masterclasses` · `mentorships` · `ventures` |
| Ventures | `ventures` · `founders` · `venture-labs` |
| Venture detail `[id]` | `ventures` · `events` |
| Venture Funding | `ventures` |
| Masterclasses | `masterclasses` · `ventures` |
| Hackathons | `hackathons` |
| Mentorship | `mentorships` |
| Study Trips | `study-trips` |
| Exposure & Networking | `exposure` |

**All seven datasets are static TypeScript literals.** `ventures.ts` is *procedurally generated* — it ends with `Array.from({ length: 96 }, (_, i) => buildVenture(i))`. Every HENT figure is therefore synthetic.

---

## 3. KPI catalog

| Page | KPI | Formula | Unit |
|---|---|---|---|
| **Overview** | Total Reach | `Σ participants across 5 programme datasets` | Integer |
| | Active Ventures | `count(ventures.status = Active)` | Integer |
| | Female Reach | `Σ female participants` | Integer |
| | Partnerships | `count(distinct partners)` | Integer |
| | Jobs Created | `Σ ventures.jobsTotal` | Integer |
| | Hackathons · Masterclasses · Mentorships · Study Trips | `count(events)` per type | Integer |
| **Ventures** | Health Ventures | `count(ventures)` | Integer |
| | Jobs Created | `Σ ventures.jobsTotal` | Integer |
| | Funds Deployed | `Σ ventures.funding` | USD |
| | Active Founders | `count(founders)` | Integer |
| | ⚠ **Pace of Target** | **`5.5` — hardcoded literal** | % |
| **Venture Funding** | Capital Deployed | `Σ ventures.funding where funded` | USD |
| | Ventures Funded | `count(ventures.fundingStatus = funded)` | Integer |
| | Milestone Rate | `% of funded ventures hitting milestone` | % |
| | Progressed to Scale | `count(stage = Scale)` | Integer |
| | Jobs Created | `Σ ventures.jobsTotal` | Integer |
| **Masterclasses** | Female · Male · Student · Alumni Participants | `Σ attendee splits` | Integer |
| **Hackathons** | *none* | — | — |
| **Mentorship** | Female · Male · Student · Alumni **Fellows** | `Σ fellow splits` | Integer |
| **Study Trips** | Female · Male · Student · Alumni Participants | `Σ participant splits` | Integer |
| **Exposure & Networking** | Events Held | `count(exposureEvents)` | Integer |
| | Founder Placements | `Σ placements` | Integer |
| | Investors Engaged | `Σ investors` | Integer |
| | Connections Made | `Σ connections` | Integer |
| | Agreements Signed | `Σ agreements` | Integer |
| | ⚠ **Visibility Score** | **No formula exists anywhere** | ? |

### Two defects in this catalog

- **`Pace of Target` is `num={5.5}`** — a literal, not a calculation. It is the only "target" KPI in the entire application and it is fake.
- **`Visibility Score` has no definition.** No formula, no comment, no documentation. An undefined KPI on a leadership dashboard is a liability.
- **`Jobs Created` appears on three HENT pages** (Overview, Ventures, Venture Funding) — all three compute `Σ ventures.jobsTotal`, so they agree, but the duplication means a future change must be made in three places.

---

## 4. Charts

44 charts. None are clickable; there is no chart-level drill-down.

| Page | Charts |
|---|---|
| Overview | Programmes per Year · Participants per Year · Gender Distribution · Participants by Programme · Reach by Region (Africa map) · Satisfaction by dimension (radar) · Programme Performance (table) |
| Ventures | Engagement Trend · Jobs Created · Ventures by Sector · Gender Distribution · Ventures by Country · Jobs by Country · Sector by Stage · Programme Events Attendance |
| Venture Funding | Capital by Milestone (horizontal bar) · Catalytic Funding Funnel · Capital Deployed per Cohort · Cumulative Capital Deployed · Funding Instrument Mix · Capital by Sector · Milestone Delivery — Top Funded (table) |
| Masterclasses | Rating Distribution by Criterion · Ratings by Gender · Age Group · Geographic Region · Venture Stage · Social Inclusion Groups · Attendance by Session · Attendance by Gender per Year · Cumulative Attendee Growth · Completion Rate by Session · Top Performing Masterclasses (table) |
| Hackathons | Gender Composition · Student vs Alumni · Annual Hackathon Frequency · Participant Reach per Year · Participation by Gender · Projects by Category · Lifecycle Conversion Funnel · Idea-to-Venture Conversion per Year |
| Mentorship | Rating Distribution · Ratings by Gender · % Rating High/Very High · Qualitative Feedback by Area · Age Group · Geographic Region · Venture Stage · Social Inclusion · Programme × Criterion Satisfaction Matrix (heatmap) · Fellows per Programme |
| Study Trips | Rating Distribution · Ratings by Gender · Age Group · Visit Type Breakdown · Venture Stage · Social Inclusion · Visits by Country · Regional Distribution · Participants per Study Trip · Participation by Gender per Year |
| Exposure & Networking | Relationship Funnel · Stakeholder Mix · Events & Founder Placements per Year · Connections Brokered per Year · Deals Opened per Event by Platform Type · Platform Comparison (table) |

**Trend axis:** all HENT time series run a fixed `[2022, 2023, 2024, 2025, 2026]`. 2025–2026 are partial or future periods but plotted as if complete.

---

## 5. Filters

| Filter | Values | Default | Pages |
|---|---|---|---|
| Year | 2022–2026 | `All` | Overview · Masterclasses · Mentorship · Study Trips · Exposure · Ventures |
| Gender | Female · Male | `All` | Masterclasses · Mentorship · Study Trips |
| Country | Enum | `All` | Overview · Exposure |
| Cohort | Year | `All` | Ventures · Venture Funding |
| Stage | Expose · Build · Scale | `All` | Ventures |
| Sector | Enum | `All` | Venture Funding |
| Instrument | Enum | `All` | Venture Funding |
| Topic | Enum | `All` | Masterclasses |
| Type | Context-dependent | `All` | Mentorship · Study Trips · Exposure |
| Region | Enum | `All` | Study Trips |

**Filters are page-local `useState` and reset on navigation.** HENT Ventures is the *only page in the entire application* that uses the Zustand `GlobalFilters` store — and even there it does not persist across pages.

---

## 6. Data dictionary — `Venture` (the core entity)

| Field | Definition | Type | Feeds | Validation |
|---|---|---|---|---|
| `id` | Venture identifier | Text | Drill-down route `/show/[id]` | None |
| `name` | Venture name | Text | Portfolio table, detail page | None |
| `sector` | Health sub-sector | Enum | Sector mix · Capital by Sector | `Sector` union |
| `stage` | Expose · Build · Scale | Enum | Stage funnel · Milestone rate · Sector by Stage | `Stage` union |
| `country` | Country of operation | Enum | Ventures by Country · Jobs by Country | `Country` union |
| `cohort` | Year admitted | Integer | Every trend chart · Capital per Cohort | None |
| `funding` | Capital received | Currency (USD) | Capital Deployed · Cumulative · Funds Deployed | ✖ no `≥ 0` check |
| `fundingStatus` | Funded / unfunded | Enum | Ventures Funded · Funding funnel | `FundingStatus` union |
| `jobsTotal` | Jobs created to date | Integer | **Jobs Created** (×3 pages + Executive) | None |
| `jobs6m` | Jobs in last 6 months | Integer | Job velocity | None |
| `jobsWomen` | Of which held by women | Integer | Gender-disaggregated jobs | ✖ **not checked ≤ `jobsTotal`** |
| `teamGender` | Male · Female · Mixed | Enum | Female-led share | `TeamGender` union |
| `status` | Active · Dormant · Stalled | Enum | Active Ventures KPI | `VentureStatus` union |

### Shared programme fields (masterclasses · mentorships · study-trips)

| Field | Definition | Type | Validation |
|---|---|---|---|
| `year` · `month` | When it ran | Integer | Hardcoded 2022–2026 |
| `attendees` | Participants | Integer | None |
| `femaleAttendees` | Of which female | Integer | ✖ **not checked ≤ `attendees`** |
| `completionRate` | % completing | Percentage | ⚠ 0–100 not enforced |
| `scores` | Rating per criterion | Decimal 1–5 | ⚠ range not enforced |
| `byAge` | 18-25 · 26-35 · 36-45 · 46+ | `Record<string,int>` | None |
| `byRegion` | East · West · South · North Africa · Other | `Record<string,int>` | None |
| `byStage` | Expose · Build · Scale | `Record<string,int>` | None |
| `bySocial` | **MCF Scholars · PWD · Refugee-Displaced** | `Record<string,int>` | None |

> `bySocial` is HENT's equity data and appears on four pages. It is the most fundable story in the pillar and it is currently only shown as a single small chart per page.

---

## 7. Known issues specific to HENT

| Issue | Detail |
|---|---|
| **Pace of Target is fake** | `num={5.5}` hardcoded. The only target KPI in the app. |
| **Visibility Score is undefined** | Ships on the Exposure page with no formula. |
| **Hackathons has no KPI cards** | The only HENT page without any. Charts only. |
| **"Fellows" collides with HECO** | HENT Fellows = mentorship mentees. HECO Fellows = public-sector professionals. Same word, different populations. Never sum them. |
| **`hent/overview` is 991 lines** | The largest file in the codebase — filter state, data shaping and ~10 charts in one component. |
| **Refine is mounted but inert** | `hent/providers.tsx` wires up Refine with a stub provider returning `{ data: [], total: 0 }`. |
| **Only portal with a redirect stub** | `/hent` is a 5-line page pointing at `/hent/overview`. HEMP and HECO put content at the root. |
| **Masterclasses started in 2023** | Two 2022 sessions were added synthetically to make the timeline start in 2022 like the other programmes. |

---

## 8. Recommendations — HENT

1. **Define or delete `Visibility Score`.** An undefined KPI on a dashboard is worse than no KPI.
2. **Replace `Pace of Target` with a real calculation** against a stored target — or remove it until targets exist.
3. **Rename HENT "Fellows" to "Mentees"** to end the collision with HECO.
4. **Validate `jobsWomen ≤ jobsTotal` and `femaleAttendees ≤ attendees`** at the data boundary.
5. **Promote `bySocial`** — the MCF Scholars / PWD / Refugee splits deserve a dedicated equity view, not one chart per page.
6. **Break up `hent/overview`** (991 lines) into section components.
7. **Add KPI cards to Hackathons** for consistency with the other seven pages.
8. **Extract the shared programme shape.** Masterclasses, mentorships and study-trips have near-identical fields (`year`, `attendees`, `scores`, `byAge`, `byRegion`, `bySocial`) declared three times.

---

*Read-only audit · no source files modified · Companion documents: [HEMP](./hemp-data-dictionary.md) · [HECO](./heco-data-dictionary.md) · [Executive](./executive-data-dictionary.md) · [Architecture](./architecture-audit.md)*
