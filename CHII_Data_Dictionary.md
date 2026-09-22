# CHII Consolidated Data Dictionary
**Master Schema & Data Structure Guide for HEMP, HENT, and HECO Pillars**

Version 1.0 | Last Updated: 22 September 2026

---

## Table of Contents
1. [Overview](#overview)
2. [HEMP Pillar Data Structure](#hemp-pillar-data-structure)
3. [HENT Pillar Data Structure](#hent-pillar-data-structure)
4. [HECO Pillar Data Structure](#heco-pillar-data-structure)
5. [Cross-Pillar Relationships](#cross-pillar-relationships)
6. [KPI & Metric Definitions](#kpi--metric-definitions)
7. [Data Collection Methods](#data-collection-methods)
8. [Sample Data & Examples](#sample-data--examples)

---

## Overview

### Purpose
This master data dictionary documents the complete data structures, schemas, and relationships across CHII's three impact pillars: HEMP (Health Employment), HENT (Health Entrepreneurship), and HECO (Health Ecosystems). It serves both technical teams (for API/database design) and business stakeholders (for understanding data flow and metrics).

### Scope
- **HEMP**: Healthcare employment programmes and outcomes
- **HENT**: Venture creation, development, and funding
- **HECO**: Ecosystem partnership and health innovation infrastructure
- **Health Missions**: Cross-cutting student cohort data serving all pillars

### Key Principles
- **Single Source of Truth**: Each entity has one primary home and is referenced elsewhere
- **Temporal Tracking**: All entities include year/cohort tracking for trend analysis
- **Gender & Inclusion**: Demographic breakdowns included in all people-focused entities
- **Outcome Orientation**: Structures designed to capture outcomes, not just activities
- **Relationships**: Cross-pillar links enable unified reporting and strategic planning

---

## HEMP Pillar Data Structure

### 1. Mission Students Entity

**Purpose**: Track healthcare students across all cohorts and their engagement with HEMP programmes.

**Primary Key**: `id` (e.g., `ms001`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Unique student identifier | `ms001` | Format: `ms` + zero-padded number |
| cohort | Integer | Yes | Academic cohort year | `2022` | Range: 2021–2026 |
| country | String | Yes | Country of origin | `Rwanda` | From CHII operational countries |
| gender | Enum | Yes | Student gender | `Female` \| `Male` | For gender parity tracking |
| track | Enum | Yes | Academic specialization track | `Health Innovation` \| `Health Management` \| `Health Policy` \| `Digital Health` | Defines focus area |
| status | Enum | Yes | Completion status | `Active` \| `Completed` \| `Deferred` | Current programme status |
| gpa | Decimal | Yes | Grade point average | `3.72` | Scale: 0.0–4.0 |
| hasInternship | Boolean | Yes | HEMP internship participation | `true` | Links to Internships entity |
| hasHealthX | Boolean | Yes | Career Exposure participation | `true` | Links to HealthX Symposia |
| ventureCreated | Boolean | Yes | HENT venture creation | `false` | Cross-pillar indicator |
| employment | Enum | Optional | Post-graduation outcome | `Employed` \| `Entrepreneur` \| `Further Study` \| `Seeking` | Null if status = `Active` |
| dateCreated | DateTime | Yes | Record creation timestamp | `2021-09-15T10:30:00Z` | Audit trail |
| dateModified | DateTime | Yes | Last update timestamp | `2026-09-21T14:20:00Z` | For change tracking |

**Relationships**:
- → `Internships` (many-to-many via `hasInternship` flag + cross-reference)
- → `HealthXSymposia` (many-to-many via `hasHealthX` flag)
- → `Ventures` (one-to-many if `ventureCreated = true`)
- → `GHCohorts` (many-to-many for course enrollment)

**Key Metrics**:
- Total students: `COUNT(*)`
- Female representation: `COUNT(WHERE gender = 'Female') / COUNT(*)`
- Cohort size: `COUNT(WHERE cohort = YEAR)`
- Geographic coverage: `COUNT(DISTINCT country)`
- HEMP participation rate: `COUNT(WHERE hasInternship OR hasHealthX) / COUNT(*)`

**Data Quality Rules**:
- `cohort` must be within valid range (2021–2026)
- `country` must be in approved CHII operational list
- `gpa` must be 0.0–4.0
- If `status = 'Active'`, `employment` must be NULL
- If `status = 'Completed'` or `'Deferred'`, `employment` must be set

---

### 2. Career Exposure Entity

**Purpose**: Track HealthX symposium events, participation, and employment leads generated.

**Primary Key**: `id` (e.g., `HX01`)

#### HealthXSymposium (Aggregate)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Event identifier | `HX01` | Format: `HX` + sequential number |
| name | String | Yes | Event name | `HealthX 2025 — Explore What's Next` | Marketing name |
| year | Integer | Yes | Event year | `2025` | Used for filtering/grouping |
| country | String | Yes | Host country | `Rwanda` | Event location |
| city | String | Yes | Host city | `Kigali` | Specific location |
| institutions | Integer | Yes | Participating universities | `7` | Number of partner institutions |
| studentsAttending | Integer | Yes | Total participants | `340` | All attendees |
| femaleStudents | Integer | Yes | Female participants | `181` | Subset of `studentsAttending` |
| readinessSessions | Integer | Yes | Pre-event workshops | `8` | Number of readiness training sessions |
| readinessAttendees | Integer | Yes | Workshop registrations | `271` | Total registered (may exceed attendance) |
| readinessCompletion | Integer | Yes | Completion rate | `80` | Percentage (0–100) |
| employersExhibiting | Integer | Yes | Employer count | `28` | Organizations at careers fair |
| leads | Object | Yes | Opportunities generated | See nested structure below | Breakdown by type |
| conversions | Object | Yes | Leads converted | See nested structure below | Confirmed placements |
| partnershipsFormed | Integer | Yes | New partnerships | `9` | Newly established relationships |
| partnershipsRenewed | Integer | Yes | Renewed partnerships | `6` | Extended existing relationships |
| usefulness | Decimal | Yes | Student satisfaction | `4.5` | Scale: 1–5 |
| completionRate | Integer | Yes | Activity completion | `92` | Percentage (0–100) |
| relevanceScore | Decimal | Yes | Content relevance | `5` | Scale: 1–5 |
| qualityScore | Decimal | Yes | Programme quality | `5` | Scale: 1–5 |
| usefulnessScore | Decimal | Yes | Overall usefulness | `5` | Scale: 1–5 |
| confidenceScore | Decimal | Yes | Career confidence gain | `5` | Scale: 1–5 |
| recommendationScore | Integer | Yes | NPS-style recommendation | `9` | Scale: 0–10 |

**Nested: `leads` Object**
```
{
  "Internship": 98,        // Internship opportunities
  "Employment": 41,        // Job opportunities
  "Project-Based": 33      // Project/contract opportunities
}
```

**Nested: `conversions` Object**
```
{
  "Internship": 49,        // Converted to actual internships
  "Employment": 17,        // Converted to jobs
  "Project-Based": 15      // Converted to projects
}
```

**Relationships**:
- → `ReadinessSessions` (one-to-many: multiple sessions per event)
- → `EmployerSectors` (many-to-many: sector breakdown of exhibitors)
- ← `MissionStudents` (many-to-many: student attendance)

**Key Metrics**:
- Lead conversion rate: `SUM(conversions.*) / SUM(leads.*)`
- Female participation rate: `femaleStudents / studentsAttending`
- Leads per event: `SUM(leads.*) / COUNT(events)`
- Readiness completion rate: `readinessCompletion` (already %)

---

#### ReadinessSessions (Detail)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | String | Yes | Session identifier | `R01` |
| symposiumId | String | Yes | Parent event FK | `HX01` |
| year | Integer | Yes | Event year | `2023` |
| topic | Enum | Yes | Session topic | `CV & Portfolio Clinic` \| `Interview Preparation` \| `Career Pathways in Health` \| `Networking & Personal Brand` |
| registered | Integer | Yes | Sign-ups | `92` |
| attended | Integer | Yes | Actual attendance | `76` |
| rating | Decimal | Yes | Participant satisfaction | `4.5` | Scale: 1–5 |

---

### 3. Internships Entity

**Purpose**: Track individual internship placements, employer feedback, and student outcomes.

**Primary Key**: `id` (e.g., `i01`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Internship ID | `i01` | Format: `i` + zero-padded number |
| year | Integer | Yes | Internship year | `2023` | When placement occurred |
| organization | Enum | Yes | Host organization | `CHII Internal` \| `SFH` \| `KASHA` \| `Heza` \| `RCR` \| `mIndora Health` | Partner organization |
| department | String | Yes | Department/team | `One Health Research` | Where intern works |
| country | String | Yes | Placement country | `Rwanda` | Location of internship |
| durationWeeks | Integer | Yes | Length of internship | `12` | Number of weeks |
| students | Integer | Yes | Interns placed | `7` | Total interns in this placement |
| femaleStudents | Integer | Yes | Female interns | `4` | Subset of `students` |
| idpParticipants | Integer | Yes | IDP/refugee interns | `1` | Inclusion metric |
| plwdParticipants | Integer | Yes | Interns with disabilities | `1` | Accessibility metric |
| employmentConversions | Integer | Yes | To full-time jobs | `3` | Interns hired post-internship |
| satisfactionScore | Decimal | Yes | Overall satisfaction | `4.8` | Scale: 1–5 |
| studentFeedbackScore | Decimal | Yes | Student feedback | `4.7` | Scale: 1–5 |
| partnerFeedbackScore | Decimal | Yes | Employer feedback | `4.6` | Scale: 1–5 |
| hasMentor | Boolean | Yes | Formal mentorship | `true` | Was a mentor assigned |
| placementsAfterInternship | Integer | Yes | Total outcomes | `3` | Employment, further engagement |
| **Employer Assessment (Workplace Skills)** | | | | | |
| asksClarifyingQuestions | Decimal | Yes | Question-asking ability | `5` | Scale: 1–5 (Never to Consistently) |
| communicatesProfessionally | Decimal | Yes | Communication skill | `5` | Scale: 1–5 |
| meetsDeadlines | Decimal | Yes | Deadline management | `5` | Scale: 1–5 |
| worksInTeams | Decimal | Yes | Teamwork ability | `5` | Scale: 1–5 |
| **Health Sector Readiness** | | | | | |
| healthSystemsUnderstanding | Decimal | Yes | Health systems knowledge | `5` | Scale: 1–5 (Not at all to Extremely) |
| appliesToHealthProblems | Decimal | Yes | Problem-solving in health | `5` | Scale: 1–5 |
| **Comparative Performance** | | | | | |
| performanceBetterThanNonALU | Decimal | Yes | vs. non-ALU interns | `5` | Scale: 1–5 (Strongly Disagree to Strongly Agree) |
| **Employer Intent** | | | | | |
| recommendationScore | Integer | Yes | Would recommend ALU interns | `10` | Scale: 0–10 (NPS-style) |
| likelyToHire | Decimal | Yes | Likelihood to hire ALU grad | `5` | Scale: 1–5 (Very Unlikely to Very Likely) |
| **Student Feedback (Intern Experience)** | | | | | |
| relevanceToCareer | Decimal | Yes | Relevance to career goals | `5` | Scale: 1–5 |
| overallQuality | Decimal | Yes | Programme quality | `5` | Scale: 1–5 |
| clarityOfRole | Decimal | Yes | Role clarity | `5` | Scale: 1–5 |
| supportSupervision | Decimal | Yes | Mentor/supervisor support | `5` | Scale: 1–5 |
| skillApplicationToRealWorld | Decimal | Yes | Skill application | `5` | Scale: 1–5 (Not at all to Very great extent) |
| internRecommendationScore | Integer | Yes | Would recommend internship | `10` | Scale: 0–10 (NPS-style) |
| completionRate | Integer | Yes | % who completed | `100` | Percentage (0–100) |

**Relationships**:
- → `Organization` (many-to-one: FK to employer master)
- → `Department` (many-to-one: FK to department master)
- ← `MissionStudents` (many-to-many via placement records)

**Key Metrics**:
- Conversion rate: `SUM(employmentConversions) / SUM(students)` across all placements
- Female representation: `SUM(femaleStudents) / SUM(students)`
- Average satisfaction: `AVG(satisfactionScore)` across placements
- Inclusion index: `(SUM(idpParticipants) + SUM(plwdParticipants)) / SUM(students)`
- Employer satisfaction: `AVG(partnerFeedbackScore)`

---

### 4. SIE (Signature Immersive Experience) Entity

**Purpose**: Track cohort-level immersive learning experiences across virtual and in-country phases.

**Primary Key**: `id` (e.g., `SIE01`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Cohort identifier | `SIE01` | Format: `SIE` + zero-padded |
| name | String | Yes | Cohort name | `SIE Pilot Cohort` | Marketing name |
| year | Integer | Yes | Cohort year | `2024` | When programme ran |
| country | String | Yes | Immersion country | `Rwanda` | In-country location |
| region | Enum | Optional | Geographic region | `East Africa` \| `West Africa` \| `Southern Africa` \| `Central Africa` | For regional analysis |
| **Recruitment & Selection** | | | | | |
| applied | Integer | Yes | Total applicants | `64` | Application funnel |
| selected | Integer | Yes | Selected candidates | `24` | Advanced to programme |
| **Virtual Phase** | | | | | |
| completedVirtual | Integer | Yes | Virtual completion | `22` | Finished online module |
| virtualPhaseHours | Integer | Yes | Contact hours (virtual) | `40` | Total hours delivered |
| **In-Country Phase** | | | | | |
| travelledInCountry | Integer | Yes | Travelled for immersion | `20` | Participated in-person |
| inCountryHours | Integer | Yes | Contact hours (in-country) | `72` | Total hours delivered |
| **Programme Completion** | | | | | |
| completedProgramme | Integer | Yes | Full completion | `19` | Finished both phases |
| female | Integer | Yes | Female participants | `11` | Gender breakdown |
| **Activities** | | | | | |
| siteVisits | Integer | Yes | Field visits | `6` | Number of site visits |
| partnerOrgs | Integer | Yes | Partner organizations | `5` | Organizations engaged |
| partnerProjects | Integer | Yes | Projects undertaken | `5` | Student-led projects |
| reflectionSessions | Integer | Yes | Reflection workshops | `8` | Structured learning sessions |
| **Exposure Learning (1–5 scale)** | | | | | |
| exposure_healthSystem | Decimal | Yes | Health system exposure | `4.1` | Understanding of systems |
| exposure_innovation | Decimal | Yes | Innovation exposure | `4.0` | Exposure to innovation |
| exposure_employment | Decimal | Yes | Employment pathways | `3.7` | Career pathway clarity |
| **Participant Discipline Breakdown** | | | | | |
| disciplines | Object | Yes | Academic disciplines | See nested structure | Breakdown by major |
| **Feedback & Satisfaction** | | | | | |
| satisfaction | Decimal | Yes | Overall satisfaction | `4.2` | Scale: 1–5 |
| relevance | Decimal | Yes | Relevance to goals | `4.0` | Scale: 1–5 |
| quality | Decimal | Yes | Programme quality | `4.1` | Scale: 1–5 |
| usefulness | Decimal | Yes | Content usefulness | `3.9` | Scale: 1–5 |
| confidence | Decimal | Yes | Confidence gain | `4.0` | Scale: 1–5 |
| nps | Decimal | Yes | Net Promoter Score | `7.8` | Scale: 0–10 |
| completionFullProgramme | Integer | Yes | % completing both phases | `79` | Percentage (0–100) |
| careerClarityPct | Integer | Yes | % with career clarity | `74` | Gained direction |
| **NPS Distribution** | | | | | |
| npsPromoters | Integer | Yes | % scoring 9–10 | `47` | Percentage (0–100) |
| npsPassives | Integer | Yes | % scoring 7–8 | `42` | Percentage (0–100) |
| npsDetractors | Integer | Yes | % scoring 0–6 | `11` | Percentage (0–100) |
| **Inclusion** | | | | | |
| pwd | Integer | Yes | Participants with disabilities | `2` | Accessibility metric |
| idpRefugees | Integer | Yes | IDP/refugee participants | `1` | Inclusion metric |
| **Outcomes** | | | | | |
| employmentLeads | Integer | Yes | Employment opportunities | `6` | Generated during programme |
| projectsAdopted | Integer | Yes | Partner projects adopted | `2` | Projects taken forward by orgs |
| employmentPlacements | Integer | Yes | Post-programme jobs | `5` | Hired after SIE |
| internshipPlacements | Integer | Yes | Post-programme internships | `8` | Internship placements |
| placementConversionRate | Integer | Yes | % placed | `68` | Percentage (0–100) |
| **Performance Metrics** | | | | | |
| overallPerformanceScore | Integer | Yes | Programme performance | `78` | Scale: 0–100 |
| learningOutcomesScore | Integer | Yes | Learning achievement | `82` | Scale: 0–100 |
| participantEngagement | Integer | Yes | Engagement level | `75` | Scale: 0–100 |
| targetAchievementRate | Integer | Yes | % targets met | `85` | Percentage (0–100) |

**Nested: `disciplines` Object**
```
{
  "Business & Entrepreneurship": 7,
  "Computer Science": 4,
  "Engineering": 3,
  "Social Sciences": 4,
  "Public Policy": 3,
  "Data Science": 3
}
```

**Key Metrics**:
- Completion rate (both phases): `completionFullProgramme` (%)
- Placement rate: `placementConversionRate` (%)
- Female representation: `female / selected` (%)
- NPS: `npsPromoters - npsDetractors` (scale: -100 to +100)

---

### 5. Global Health Courses Entity

**Purpose**: Track foundational course enrollment, module completion, and progression outcomes.

**Primary Key**: `id` (e.g., `GH2022`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Cohort ID | `GH2022` | Format: `GH` + year |
| cohortYear | Integer | Yes | Academic year | `2022` | Course offering year |
| enrolled | Integer | Yes | Total enrollments | `34` | Starting cohort size |
| female | Integer | Yes | Female students | `18` | Gender breakdown |
| completed | Integer | Yes | Course completion | `26` | Finished all modules |
| certified | Integer | Yes | Passed assessment | `22` | Met certification threshold |
| avgScore | Decimal | Yes | Assessment score | `71` | Percentage (0–100) |
| satisfaction | Decimal | Yes | Overall satisfaction | `4.0` | Scale: 1–5 |
| **Module Completion (%)** | | | | | |
| moduleCompletion | Object | Yes | Module completion rates | See nested | Percentage by module |
| **Participant Background** | | | | | |
| byProgramme | Object | Yes | Academic programme breakdown | See nested | Enrollment by major |
| **Progression Outcomes** | | | | | |
| progressedToVenture | Integer | Yes | Moved to venture creation | `5` | HENT pathway |
| progressedToResearch | Integer | Yes | Moved to research | `4` | Further education pathway |
| progressedToInternship | Integer | Yes | Moved to internship | `9` | HEMP pathway |

**Nested: `moduleCompletion` Object**
```
{
  "Global Health Foundations": 97,
  "Health Systems & Financing": 88,
  "Epidemiology Basics": 74,
  "Health Equity & Policy": 81,
  "Innovation in Global Health": 76
}
```

**Nested: `byProgramme` Object**
```
{
  "Business & Entrepreneurship": 12,
  "Computer Science": 7,
  "Engineering": 5,
  "Social Sciences": 6,
  "International Business & Trade": 4
}
```

**Key Metrics**:
- Completion rate: `completed / enrolled` (%)
- Certification rate: `certified / completed` (%)
- Female representation: `female / enrolled` (%)
- Module completion (weak link): `MIN(moduleCompletion.*)`
- Progression rate: `(progressedToVenture + progressedToResearch + progressedToInternship) / certified`

---

## HENT Pillar Data Structure

### 1. Ventures Entity

**Purpose**: Track individual venture records, funding, stage, and outcomes.

**Primary Key**: `id` (e.g., `v001`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Venture ID | `v001` | Unique identifier |
| name | String | Yes | Venture name | `HealthTech Solutions` | Legal/trading name |
| cohort | Integer | Yes | Entry cohort year | `2021` | When admitted to HENT |
| country | String | Yes | Operational country | `Rwanda` | Primary location |
| sector | String | Yes | Health sector | `Digital Health` \| `Medical Devices` \| `Wellness` \| etc | Business category |
| stage | Enum | Yes | Venture stage | `Ideation` \| `Validation` \| `Prototype/MVP` \| `Early Growth` \| `Scaling` \| `Investment/Funding` | Development stage |
| status | Enum | Yes | Current status | `Active` \| `Stalled` \| `Exited` | Portfolio health |
| teamGender | Enum | Yes | Founding team gender | `Female` \| `Male` \| `Mixed` | Founder diversity |
| revenue | Decimal | Optional | Annual revenue | `150000.00` | USD equivalent |
| funding | Decimal | Optional | Total funding raised | `250000.00` | Cumulative capital |
| fundType | Enum | Optional | Funding source | `Charitable` \| `Venture Fund` \| `Catalytic` | Fund category (if funded) |
| jobsTotal | Integer | Yes | Total jobs created | `12` | Direct employment |
| jobsWomen | Integer | Optional | Jobs held by women | `4` | Gender breakdown |
| jobsYouth | Integer | Optional | Jobs for youth | `3` | Age breakdown |
| healthScore | Integer | Optional | Portfolio health | `72` | Scale: 0–100 |
| recommended | Boolean | Optional | Featured venture | `true` | Strategic highlight |
| accelerator | Boolean | Optional | In accelerator | `true` | External support |
| dateCreated | DateTime | Yes | Record creation | `2021-05-20T09:00:00Z` | Audit trail |
| dateModified | DateTime | Yes | Last update | `2026-09-21T14:00:00Z` | Change tracking |

**Relationships**:
- → `Founders` (one-to-many: founding team)
- → `Funding` (one-to-many: funding rounds)
- → `ExposureEvents` (many-to-many: hackathons, pitches, etc.)

**Key Metrics**:
- Portfolio size: `COUNT(WHERE status = 'Active')`
- Total jobs: `SUM(jobsTotal WHERE status = 'Active')`
- Female founder %: `COUNT(WHERE teamGender = 'Female') / COUNT(*)`
- Average revenue: `AVG(revenue WHERE revenue > 0)`
- Funding deployed: `SUM(funding)`

---

### 2. Founders Entity

**Purpose**: Track individual founder information and attributes.

**Primary Key**: `id` (e.g., `f001`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Founder ID | `f001` | Unique identifier |
| ventureId | String | Yes | Associated venture FK | `v001` | Links to Ventures |
| name | String | Yes | Full name | `Jane Doe` | Legal name |
| gender | Enum | Yes | Gender | `Female` \| `Male` \| `Other` | Demographics |
| country | String | Yes | Country of origin | `Rwanda` | Citizenship/residence |
| education | String | Optional | Educational background | `BSc Computer Science` | Qualifications |
| isPWD | Boolean | Optional | Person with disability | `false` | Inclusion metric |
| isRefugee | Boolean | Optional | Refugee/IDP status | `false` | Inclusion metric |
| npsScore | Integer | Optional | NPS feedback | `9` | Scale: 0–10 |

**Key Metrics**:
- Female founder %: `COUNT(WHERE gender = 'Female') / COUNT(*)`
- Inclusion %: `COUNT(WHERE isPWD = true OR isRefugee = true) / COUNT(*)`

---

### 3. Hackathons Entity

**Purpose**: Track hackathon events and participant outcomes.

**Primary Key**: `id` (e.g., `hck01`)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | String | Yes | Event ID | `hck01` |
| name | String | Yes | Event name | `Health Innovation Hackathon 2024` |
| year | Integer | Yes | Event year | `2024` |
| country | String | Yes | Location | `Kenya` |
| participants | Integer | Yes | Total participants | `150` |
| femaleParticipants | Integer | Yes | Female attendees | `70` |
| ideasSubmitted | Integer | Yes | Pitches received | `24` |
| projectsLaunched | Integer | Yes | Ideas advanced to projects | `8` |
| venturesCreated | Integer | Yes | Ventures formed post-hackathon | `3` |
| avgSatisfaction | Decimal | Yes | Participant satisfaction | `4.3` | Scale: 1–5 |

---

### 4. Masterclasses Entity

**Purpose**: Track masterclass sessions and learning outcomes.

**Primary Key**: `id` (e.g., `mc01`)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | String | Yes | Session ID | `mc01` |
| topic | String | Yes | Class topic | `Business Model Canvas` |
| year | Integer | Yes | Delivery year | `2024` |
| country | String | Yes | Location | `Rwanda` |
| attendees | Integer | Yes | Participants | `45` |
| femaleAttendees | Integer | Yes | Female participants | `20` |
| completionRate | Decimal | Yes | % completion | `88` | Scale: 0–100 |
| avgScore | Decimal | Yes | Learning assessment | `75` | Scale: 0–100 |
| avgSatisfaction | Decimal | Yes | Satisfaction rating | `4.2` | Scale: 1–5 |

---

### 5. Mentorship Entity

**Purpose**: Track mentorship relationships and participant outcomes.

**Primary Key**: `id` (e.g., `ment01`)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | String | Yes | Relationship ID | `ment01` |
| menteeVentureId | String | Yes | Mentee venture FK | `v001` |
| mentorName | String | Yes | Mentor name | `John Smith` |
| mentorBackground | String | Yes | Mentor expertise | `Serial entrepreneur, 15 years` |
| year | Integer | Yes | Mentorship year | `2024` |
| durationMonths | Integer | Yes | Engagement length | `6` | Months active |
| frequency | Enum | Yes | Meeting cadence | `Weekly` \| `Bi-weekly` \| `Monthly` | Contact frequency |
| ventureMilestones | Integer | Yes | Milestones achieved | `3` | Business milestones reached |
| avgMenteeScore | Decimal | Yes | Mentee satisfaction | `4.6` | Scale: 1–5 |
| avgMentorScore | Decimal | Yes | Mentor satisfaction | `4.4` | Scale: 1–5 |

---

## HECO Pillar Data Structure

### 1. Partners Entity

**Purpose**: Track ecosystem partner organizations and engagement.

**Primary Key**: `id` (e.g., `partner01`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Partner ID | `partner01` | Unique identifier |
| name | String | Yes | Organization name | `Ministry of Health` | Legal name |
| partnerType | Enum | Yes | Partner category | `Government` \| `Healthcare Provider` \| `NGO` \| `Research Institution` \| `Private Sector` | Organizational type |
| country | String | Yes | Operational country | `Rwanda` | Primary location |
| sector | String | Yes | Focus area | `Policy` \| `Implementation` \| `Research` \| `Service Delivery` | Business focus |
| relationshipStartYear | Integer | Yes | Partnership inception | `2020` | When relationship began |
| relationshipStatus | Enum | Yes | Current status | `Active` \| `Dormant` \| `Ended` | Partnership health |
| engagementType | String | Yes | Nature of partnership | `Policy Advocacy` \| `Service Integration` \| `Co-Research` \| `Capacity Building` | Type of collaboration |
| contactName | String | Yes | Primary contact | `Dr. Jane Mwangi` | Partnership POC |
| contactEmail | String | Yes | Contact email | `jane@example.org` | Communication channel |

---

### 2. Pilot Programs Entity

**Purpose**: Track pilot health innovation programmes and scale potential.

**Primary Key**: `id` (e.g., `pilot01`)

| Field | Type | Required | Description | Example | Notes |
|-------|------|----------|-------------|---------|-------|
| id | String | Yes | Programme ID | `pilot01` | Unique identifier |
| name | String | Yes | Programme name | `Rural Telemedicine Pilot` | Project title |
| description | Text | Yes | What it tests | `Testing remote diagnostics in low-connectivity areas` | Innovation hypothesis |
| year | Integer | Yes | Launch year | `2024` | When pilot started |
| country | String | Yes | Pilot location | `Uganda` | Geography |
| partnerIds | Array | Yes | Partner organizations FK | `['partner01', 'partner02']` | Collaborating orgs |
| ventureIds | Array | Optional | Ventures involved FK | `['v015', 'v023']` | HENT ventures |
| participants | Integer | Yes | People reached | `250` | Direct beneficiaries |
| femaleParticipants | Integer | Yes | Female participants | `125` | Gender breakdown |
| durationMonths | Integer | Yes | Pilot length | `12` | Months of operation |
| objectives | Array | Yes | What success looks like | `['80% diagnostic accuracy', 'Cost <$5/visit']` | KPIs |
| outcomesAchieved | Array | Yes | Actual results | `['85% accuracy', '$4.20/visit']` | Measured results |
| readinessToScale | Enum | Yes | Scale potential | `Ready` \| `Promising` \| `Needs Iteration` \| `Not Viable` | Scalability assessment |
| estimatedReplicationCost | Decimal | Optional | Cost to scale | `500000.00` | USD per country |

---

### 3. Infrastructure & Systems Entity

**Purpose**: Track shared digital infrastructure and tools.

**Primary Key**: `id` (e.g., `infra01`)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | String | Yes | Infrastructure ID | `infra01` |
| name | String | Yes | System name | `Health Data Exchange Platform` |
| purpose | String | Yes | What it enables | `Interoperable health data sharing` |
| operationalYear | Integer | Yes | Launch year | `2023` |
| operatingCountries | Array | Yes | Active in | `['Rwanda', 'Kenya', 'Uganda']` |
| integrations | Array | Yes | Connected systems | `['EMR_System_A', 'Lab_Platform_B']` | Number of integrations |
| users | Integer | Yes | Active users | `1250` | Monthly active |
| uptime | Decimal | Yes | System availability | `99.5` | Percentage |

---

## Cross-Pillar Relationships

### Mission Student Engagement Map

```
Mission Student
  ├── HEMP Career Exposure (hasHealthX = true)
  │   └── HealthX Symposium → Leads → Internship/Employment
  │
  ├── HEMP Internship (hasInternship = true)
  │   └── Internship Placement → Employment Outcome
  │
  ├── HEMP SIE (implicit via attendance records)
  │   └── SIE Cohort → Employment/Internship
  │
  ├── HEMP Courses
  │   └── GH Cohort → Progression (Venture, Research, or Internship)
  │
  └── HENT Ventures (ventureCreated = true)
      └── Founder Record → Venture → Funding → Jobs
```

### Employment Outcome Attribution

**Flow**: Mission Student → (Programme) → Job/Entrepreneur → Jobs Created

For each student with `employment != NULL`:
- **Employed via HEMP**: Internship conversion
- **Entrepreneur via HENT**: Venture creation → jobs created
- **Further Study**: Progression from HEMP course → GH progression fields
- **Seeking**: Actively job hunting (tracked for programme effectiveness)

---

## KPI & Metric Definitions

### HEMP KPIs

| KPI | Calculation | Frequency | Business Use |
|-----|-----------|-----------|--------------|
| **Career Exposure Reach** | `SUM(studentsAttending)` across all HealthX events | Annual | Marketing, partnership justification |
| **Internship Placement Rate** | `SUM(conversions.Internship) / SUM(leads.Internship)` | Annual | Programme effectiveness |
| **Internship → Job Conversion** | `COUNT(employmentConversions) / SUM(students)` across internships | Annual | Employment pillar success |
| **SIE Completion Rate** | `SUM(completedProgramme) / SUM(selected)` across cohorts | Per-cohort | Cohort quality assessment |
| **Course Certification Rate** | `SUM(certified) / SUM(enrolled)` across all cohorts | Annual | Learning rigour |
| **Female Participation** | `SUM(femaleStudents) / SUM(totalStudents)` across all HEMP | Annual | Gender equity |
| **Employment Outcome Rate** | `COUNT(students with employment != NULL) / SUM(totalMissionStudents)` | Annual | Overall impact |

### HENT KPIs

| KPI | Calculation | Frequency | Business Use |
|-----|-----------|-----------|--------------|
| **Ventures Created** | `COUNT(ventures WHERE cohort = YEAR)` | Annual | Entrepreneurship pipeline |
| **Jobs Created** | `SUM(jobsTotal WHERE status = 'Active')` | Quarterly | Economic impact |
| **Female Founder %** | `COUNT(teamGender = 'Female') / COUNT(ventures)` | Annual | Founder diversity |
| **Average Funding/Venture** | `SUM(funding) / COUNT(ventures WHERE funding > 0)` | Annual | Capital efficiency |
| **Funding Deployed** | `SUM(funding)` across all active ventures | Quarterly | Capital deployment |
| **Health Score** | `AVG(healthScore)` across portfolio | Quarterly | Portfolio health |

### HECO KPIs

| KPI | Calculation | Frequency | Business Use |
|-----|-----------|-----------|--------------|
| **Active Partnerships** | `COUNT(partners WHERE relationshipStatus = 'Active')` | Annual | Ecosystem health |
| **Pilot Scale-Readiness** | `COUNT(pilotPrograms WHERE readinessToScale IN ('Ready', 'Promising'))` | Per-pilot | Innovation pipeline |
| **Replication Potential** | `SUM(participants)` across 'Ready' pilots | Annual | Scale opportunity |

---

## Data Collection Methods

### Primary Data Sources

**HEMP**:
- Mission Student data: Annual intake + during programme tracking
- Career Exposure: Post-event surveys + lead tracking + employer feedback
- Internships: Placement agreements + mid-/end-of-term surveys (student + employer)
- SIE: Pre/post assessments + employer surveys + post-placement tracking
- Courses: Module assessments + end-of-course surveys + alumni tracking

**HENT**:
- Ventures: Intake form + quarterly check-ins + annual tax records for revenue
- Founders: Intake form + optional annual updates
- Hackathons: Participant registration + exit survey
- Masterclasses: Attendance records + assessments + post-class survey
- Mentorship: Relationship initiation + mid-/end-of-term surveys

**HECO**:
- Partners: Partner agreement + quarterly touchbase
- Pilots: Project initiation + quarterly reports + end-of-pilot assessment
- Infrastructure: System logs + user analytics + uptime monitoring

---

## Sample Data & Examples

### HEMP Sample: Mission Student Progression

```json
{
  "studentId": "ms042",
  "name": "Amara Okonkwo",
  "cohort": 2024,
  "country": "Nigeria",
  "gender": "Female",
  "track": "Digital Health",
  "status": "Completed",
  "gpa": 3.87,
  "hasHealthX": true,
  "hasInternship": true,
  "employment": "Employed",
  "hemp_journey": [
    {
      "programme": "Career Exposure (HealthX 2024)",
      "year": 2024,
      "outcome": "3 internship leads"
    },
    {
      "programme": "Internship (SFH Data Hub)",
      "year": 2025,
      "duration_weeks": 10,
      "outcome": "Hired full-time as Data Analyst"
    },
    {
      "programme": "Global Health Courses",
      "year": 2024,
      "modules_completed": 5,
      "certification": "Passed"
    }
  ],
  "employment_outcome": {
    "status": "Employed",
    "employer": "SFH Health Analytics",
    "title": "Data Analyst",
    "salary_estimate": "$18,000 USD/year",
    "job_creation": "N/A (not entrepreneur)"
  }
}
```

### HENT Sample: Venture Progression

```json
{
  "ventureId": "v142",
  "name": "DiagnoticAI",
  "cohort": 2022,
  "country": "Kenya",
  "sector": "Digital Health",
  "stage": "Scaling",
  "status": "Active",
  "founder": {
    "name": "Dr. Peter Kipchoge",
    "gender": "Male",
    "country": "Kenya"
  },
  "funding_history": [
    {
      "year": 2023,
      "amount": 50000,
      "type": "Catalytic"
    },
    {
      "year": 2024,
      "amount": 150000,
      "type": "Venture Fund"
    }
  ],
  "current_metrics": {
    "totalFunding": 200000,
    "jobsCreated": 15,
    "jobsForWomen": 6,
    "revenue": 75000,
    "healthScore": 82
  }
}
```

---

## Data Quality & Governance

### Validation Rules

- **Temporal consistency**: `dateModified >= dateCreated`
- **Logical consistency**: `femaleStudents <= totalStudents`
- **Range constraints**: Scores 0–100, ratings 1–5 or 0–10
- **Required hierarchies**: Every internship student must exist in MissionStudents
- **Uniqueness**: Primary keys must be unique within entity

### Privacy & Sensitivity

- Individual names are collected for attribution but reported in aggregates
- PII (email, detailed health info) is not part of this dictionary
- Gender/inclusion data reported in aggregates, not individuals
- Salary/revenue figures are estimates or ranges, not precise actuals

---

## Migration & System Design Notes

- **Normalization**: Entities are designed for SQL implementation (3NF)
- **Extensibility**: Array and Object fields allow for future sub-attributes without schema rewrites
- **Temporal tracking**: `dateCreated` and `dateModified` on all entities enable audit trails and change detection
- **Aggregation readiness**: Structure enables efficient rollups (cohort, country, year, programme type)

---

**Document Version**: 1.0
**Last Updated**: 22 September 2026
**Audience**: Technical (developers, data engineers) and business stakeholders (programme managers, analysts)

