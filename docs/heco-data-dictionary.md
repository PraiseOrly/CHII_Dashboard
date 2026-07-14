# HECO — Data Dictionary

**Health Ecosystems Pillar** · MELA reference · read-only audit

Public-sector capacity through three linked pillars. HECO is the newest and smallest dashboard — two pages, one dataset — and the only pillar whose theory of change is explicitly modelled as a chain rather than a set of parallel programmes.

| | |
|---|---|
| Pages | **2** |
| KPI cards | **12** |
| Charts | **13** |
| Datasets | **1** |
| Brand colour | Navy `#0C447C` |
| Route root | `/heco` |

---

## 1. Purpose & navigation

**Business objective:** build health-system capacity by placing fellows inside public institutions, having those fellows mentor student hackathons, and channelling both into public-health research with regional health authorities.

```
/heco  (content at root)
├── Overview   /heco
└── CRA        /heco/cra     ◄ the Collaborative Research & Action programme
```

**Layout:** ✖ **HECO has no `layout.tsx`.** HENT, HEMP and Executive each have one mounting their nav; HECO's two pages import the nav themselves. Adding a third HECO page means remembering to do it again.

---

## 2. The three-pillar model

HECO is the only dashboard built around an explicit causal chain, and the UI reflects it ("The Ecosystem Chain" on the Overview):

```
PILLAR 1 — Public Sector Fellowship
  Fellows placed in health ministries and authorities
  → gain executive-level access
  → publish research
              │
              ▼  fellows mentor students
PILLAR 2 — Student Hackathons
  Students form teams under fellow mentorship
  → ventures incubated
              │
              ▼  both feed research
PILLAR 3 — Public Health Research
  Structural partnerships with regional health authorities
  → research studies → publications → policy influence
```

This chain is HECO's distinguishing asset. **It is also the only place in the application where policy influence is measured at all** (`Research-to-Policy Funnel`, `Publication Pipeline`).

---

## 3. Data sources

| Page | Dataset |
|---|---|
| Overview | `heco/cra` |
| CRA | `heco/cra` |

**One dataset serves both pages.** `heco/cra.ts` (155 lines) exports three entities:

| Entity | Volume | Purpose |
|---|---|---|
| `fellows` | 20 | Pillar 1 — public-sector fellowship |
| `craHackathons` | 6 | Pillar 2 — student hackathons |
| `researchPartnerships` | 12 | Pillar 3 — research partnerships |

> **The entire HECO dataset is synthetic.** `heco/cra.ts` was authored from the three-pillar description when the pillar was built — there was no source data. Every HECO figure is invented.

---

## 4. KPI catalog

| Page | KPI | Formula | Unit |
|---|---|---|---|
| **Overview** | Fellows | `count(fellows)` | Integer |
| | Funding Awarded | `Σ funding` | USD |
| | Students Reached | `Σ hackathon participants` | Integer |
| | Ventures Incubated | `Σ ventures from hackathons` | Integer |
| | Research Studies | `count(researchPartnerships)` | Integer |
| | Partnerships | `count(distinct authorities)` | Integer |
| **CRA** | Fellows | `count(fellows)` | Integer |
| | **Operational Funding** | `Σ funding` | USD |
| | Publications | `count(publicationStage = published)` | Integer |
| | Ventures Incubated | `Σ ventures` | Integer |
| | Research Studies | `count(researchPartnerships)` | Integer |
| | Partnerships | `count(distinct authorities)` | Integer |

### The two pages report the same six things

Overview and CRA are **near-duplicates**: both read the same dataset and both surface Fellows, Ventures Incubated, Research Studies and Partnerships. The only differences are *Funding Awarded* vs *Operational Funding* (the same figure under two names) and *Students Reached* vs *Publications*.

This is the clearest metric-naming defect in the application: **one number, two labels, two pages.**

---

## 5. Charts

| Page | Charts |
|---|---|
| **Overview** | The Three Pillars · Reach by Pillar · The Ecosystem Chain · Headline Output per Pillar · Pillar Activity per Year · Cumulative Ecosystem Output · Ecosystem Footprint by Country (Africa map) |
| **CRA** | Publication Pipeline (funnel) · Executive Roles Reached · Fellowship Growth per Cohort · Venture Incubation Funnel · Fellow Mentorship Driving Ventures · Research-to-Policy Funnel · Partner Authorities by Type · Research by Theme |

**Three funnels** — Publication Pipeline, Venture Incubation, Research-to-Policy. HECO uses funnels more heavily than any other dashboard, which suits a pillar defined by progression rather than volume.

---

## 6. Filters

| Filter | Values | Default | Pages |
|---|---|---|---|
| Year | 2022–2026 | `All` | Overview |
| Cohort | Year | `All` | CRA |
| Country | Enum | `All` | Overview · CRA |

**HECO has the thinnest filter set in the application — three filters across two pages.** No gender filter, no pillar filter, no theme filter, despite the data carrying `CraPillar`, `ResearchTheme` and `ExecRole` enums that would all make useful filters.

---

## 7. Data dictionary — `heco/cra.ts`

### `Fellow` (Pillar 1)

| Field | Definition | Type | Feeds |
|---|---|---|---|
| `pillar` | Which CRA pillar | Enum `CraPillar` | Reach by Pillar |
| `support` | Fellowship support type | Enum `FellowshipSupport` | — |
| `execRole` | Executive role reached | Enum `ExecRole` | **Executive Roles Reached** |
| `publicationStage` | Research pipeline stage | Enum `PublicationStage` | **Publication Pipeline funnel** |
| `cohort` | Intake year | Integer | Fellowship Growth per Cohort |
| `country` | Placement country | Enum | Ecosystem Footprint |
| `funding` | Operational funding | Currency (USD) | Funding Awarded / Operational Funding |

### `CraHackathon` (Pillar 2)

| Field | Definition | Type | Feeds |
|---|---|---|---|
| `participants` | Students attending | Integer | Students Reached |
| `venturesIncubated` | Ventures formed | Integer | Venture Incubation Funnel |
| `mentoredByFellows` | Fellow involvement | Boolean/Int | **Fellow Mentorship Driving Ventures** |
| `year` | When | Integer | Pillar Activity per Year |

### `ResearchPartnership` (Pillar 3)

| Field | Definition | Type | Feeds |
|---|---|---|---|
| `theme` | Research theme | Enum `ResearchTheme` | **Research by Theme** |
| `partnershipType` | Authority type | Enum `PartnershipType` | **Partner Authorities by Type** |
| `year` | When | Integer | Cumulative Ecosystem Output |

**No validation on any field.** No range checks, no referential integrity between a hackathon's `mentoredByFellows` and the `fellows` array.

---

## 8. Known issues specific to HECO

| Issue | Detail |
|---|---|
| **No layout** | The only portal without `layout.tsx`. Both pages mount the nav themselves. |
| **Two pages, one dataset, duplicated KPIs** | Overview and CRA report the same six figures. `Funding Awarded` and `Operational Funding` are the same number. |
| **The entire dataset is synthetic** | 20 fellows, 6 hackathons, 12 partnerships — all invented. |
| **`ui/heco.tsx` barrel is unused** | A themed barrel was built for HECO and has **zero importers** — both pages still import raw from `@/components/ui` and wrap in `PortalThemeProvider`. |
| **"Fellows" collides with HENT** | HECO Fellows are public-sector professionals. HENT Fellows are mentorship mentees. Never sum them. |
| **Rich enums, no filters** | `CraPillar`, `ResearchTheme`, `ExecRole`, `PartnershipType` all exist in the data and none are exposed as filters. |
| **Absent from the Executive rollup** | The Executive Overview aggregates HEMP and HENT datasets. **It does not import `heco/cra` at all.** HECO contributes nothing to "Total Beneficiaries". |

> **The last point is the most serious.** HECO is invisible to the Executive dashboard. `executive/page.tsx` imports `hemp/healthx`, `hemp/internships`, `hemp/mission-students`, `hackathons`, `masterclasses`, `study-trips`, `mentorships` and `ventures` — but **no HECO data**. Every cross-pillar total silently excludes the third pillar.

---

## 9. Recommendations — HECO

1. **Add HECO to the Executive rollup.** It is currently excluded from every cross-pillar total. This is a correctness bug, not a nice-to-have.
2. **Merge Overview and CRA, or differentiate them.** Two pages reporting the same six KPIs from the same dataset is not a dashboard, it is a duplicate.
3. **Settle on one funding label** — `Funding Awarded` and `Operational Funding` are the same figure.
4. **Rename HECO "Fellows"** or HENT's, to end the collision. `Public Sector Fellows` would be unambiguous.
5. **Give HECO a `layout.tsx`** so the nav is mounted once.
6. **Adopt the `ui/heco` barrel** that already exists, or delete it.
7. **Expose the enums as filters** — pillar, theme, executive role and partnership type are all in the data and all useful.
8. **Replace the synthetic dataset** with real fellowship and partnership records.
9. **Protect the policy-influence metrics.** The Research-to-Policy funnel is the only measure of policy impact anywhere in CHII's dashboards — it deserves more prominence than a single chart on a sub-page.

---

*Read-only audit · no source files modified · Companion documents: [HENT](./hent-data-dictionary.md) · [HEMP](./hemp-data-dictionary.md) · [Executive](./executive-data-dictionary.md) · [Architecture](./architecture-audit.md)*
