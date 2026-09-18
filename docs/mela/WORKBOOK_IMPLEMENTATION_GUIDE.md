# MELA Workbook Implementation Guide

## Overview

This guide explains how to implement the Consolidated MELA data collection workbook for the CHII Executive Dashboard. The workbook tracks all 57 MELA framework indicators across three pillars (HEMP, HENT, HECO) and maps them to 8 dashboard sections.

---

## Workbook Structure: 15 Sheets

### CORE TRACKING SHEETS (Must populate for all indicators)

#### 1. **INDICATORS_MASTER** ⭐
- **Purpose**: Central reference for all 57 MELA indicators
- **Who Updates**: M&E Lead (once at setup)
- **Frequency**: Update when framework changes
- **Key Info**:
  - Indicator code, name, level, data source
  - GESI relevance flag, quality concerns
  - Dashboard mapping
- **Dependencies**: Referenced by all other sheets

#### 2. **AT_A_GLANCE_DATA** ⭐
- **Purpose**: High-level KPIs for executive summary
- **Who Updates**: Programme Managers, M&E Officer
- **Frequency**: Quarterly
- **Feeds**: Executive Dashboard "At a Glance" section
- **Key Metrics to Track**:
  - Total participants reached
  - Ventures in portfolio
  - Employment rate
  - Revenue generated
  - Top outcomes by programme

---

### PROGRAMME-SPECIFIC TRACKING SHEETS

#### 3. **OUTREACH_INTERVENTIONS**
- **Purpose**: Track every intervention delivery (INT-01 through INT-15)
- **Who Updates**: Facilitators, Programme Managers
- **Frequency**: After each intervention (real-time entry)
- **Feeds**: Outreach section
- **Examples**: Masterclasses, hackathons, mentorship sessions, field trips
- **GESI Required**: Always disaggregate by gender, PWD, IDP

#### 4. **VENTURES_PORTFOLIO**
- **Purpose**: Central venture database for HENT
- **Who Updates**: Cohort Manager, HENT Programme Manager
- **Frequency**: Monthly/Quarterly updates
- **Feeds**: Entrepreneurship, At a Glance sections
- **Tracks**: 96 ventures across 5 cohorts (2022-2026)
- **Critical Fields**: Stage progression, funding, revenue, employment

#### 5. **EMPLOYMENT_OUTCOMES**
- **Purpose**: Track employment/internship outcomes (IMM-06, INT-O-03, etc.)
- **Who Updates**: M&E Officer, Programme Manager
- **Frequency**: Monthly/As outcomes reported
- **Feeds**: Youth in Work, Wage Employment sections
- **Tracks**: Pathway (wage, enterprise, freelance), type, quality, salary

#### 6. **ENTREPRENEURSHIP_OUTCOMES**
- **Purpose**: Post-cohort venture success metrics (INT-O series)
- **Who Updates**: Cohort Manager, HENT PM
- **Frequency**: 12-month, 3-year, 5-year follow-ups
- **Feeds**: Entrepreneurship section
- **Key Milestones**: Stage progression, revenue generation, funding rounds

#### 7. **FURTHER_EDUCATION_OUTCOMES**
- **Purpose**: Knowledge and career progression (IMM-04, IMM-06, IMM-13)
- **Who Updates**: M&E Officer, Facilitators
- **Frequency**: Pre/post-intervention, 6-month follow-up
- **Feeds**: Further Education section
- **Tracks**: Knowledge gain %, confidence, career clarity, employment status

---

### RESEARCH & PARTNERSHIPS SHEETS

#### 8. **RESEARCH_PARTNERSHIPS**
- **Purpose**: Track formal research partnerships (INT-13, INT-O-10, LTO-09)
- **Who Updates**: Partnerships Lead, HECO PM
- **Frequency**: Annual/As milestones achieved
- **Feeds**: Impact Reports section
- **Tracks**: 12 research partnerships, outputs, policy influence

#### 9. **RESEARCH_INTERVENTIONS**
- **Purpose**: Individual research project tracking (INT-10, LTO-02)
- **Who Updates**: Research Lead, researchers
- **Frequency**: Quarterly or upon completion
- **Feeds**: Impact Reports section
- **Tracks**: Publications, policy briefs, health outcomes

---

### LEADERSHIP & FUNDING SHEETS

#### 10. **GESI_TRACKING**
- **Purpose**: Disaggregation for all gender/equity metrics
- **Who Updates**: GESI Officer, all programme managers
- **Frequency**: Real-time with other entries
- **Feeds**: All dashboard sections
- **Required For**: Every intervention, venture, participant record
- **Tracks**: Gender %, youth %, IDP/refugee %, PWD %, GESI integration

#### 11. **FUNDING_TRACKING**
- **Purpose**: Track funding initiatives, grants, investments (INT-06, INT-O-04)
- **Who Updates**: Programme Manager, Finance Lead
- **Frequency**: Upon initiative launch, quarterly updates
- **Feeds**: Entrepreneurship, At a Glance sections
- **Tracks**: Total fund size, recipients, women-led %, performance

#### 12. **FELLOWSHIPS_DATA**
- **Purpose**: Track all fellows in CRA programme (INT-04, plus HECO tracking)
- **Who Updates**: HECO PM, Fellows administrator
- **Frequency**: Quarterly
- **Feeds**: Entrepreneurship, Impact Reports
- **Tracks**: 20 fellows, training hours, publications, mentorship

#### 13. **HACKATHONS_DATA**
- **Purpose**: Track CRA hackathon events (INT-02, INT-07, HECO tracking)
- **Who Updates**: Event coordinator, HECO PM
- **Frequency**: Per hackathon event
- **Feeds**: Entrepreneurship, Outreach sections
- **Tracks**: Participation, ventures incubated, outcomes

---

### QUALITY ASSURANCE SHEETS

#### 14. **DATA_QUALITY_FLAGS**
- **Purpose**: Identify and track data quality issues
- **Who Updates**: M&E Officer, reviewers
- **Frequency**: Ongoing as issues identified
- **Flags**: 7 indicators with known methodological challenges
- **Example Issues**:
  - INT-06: Attribution clarity on funding
  - INT-14: Valuation methodology for resources
  - INT-O-07: PMF assessment standardization
  - LTO-02: Health outcome attribution
  - LTO-10: Economic impact calculation

#### 15. **TREND_ANALYSIS**
- **Purpose**: Year-over-year trend tracking (2022-2026)
- **Who Updates**: M&E Officer, Analyst
- **Frequency**: Annual review
- **Shows**: Target achievement, YoY change, forecast

---

## Implementation Timeline

### Phase 1: Setup (Month 1)
- [ ] Create Excel workbook with 15 sheets
- [ ] Enter INDICATORS_MASTER data
- [ ] Set up controlled drop-downs for all reference values
- [ ] Define data entry roles and permissions
- [ ] Create data entry guidelines document

### Phase 2: Initial Data Entry (Month 2-3)
- [ ] Populate historical data (2022-2024) for established programmes
- [ ] Enter current cohort data (2025-2026)
- [ ] Backfill venture portfolio data
- [ ] Review data quality, flag issues

### Phase 3: Ongoing Operations (Month 4+)
- [ ] Real-time intervention logging
- [ ] Monthly outcome reporting
- [ ] Quarterly dashboard refreshes
- [ ] Annual trend analysis

---

## Data Entry Priority Levels

### CRITICAL (Must have for dashboard to function)

**Week 1 Priority:**
1. Ventures Portfolio (HENT ventures)
2. Employment Outcomes (all programmes)
3. Interventions (all delivery)
4. GESI Tracking (gender disaggregation)

**Week 2-3 Priority:**
5. Entrepreneurship Outcomes (post-cohort)
6. Research Partnerships (HECO)
7. Funding Tracking (visibility into financial support)

### HIGH (Important for complete picture)

**Month 2:**
8. Further Education Outcomes
9. Fellowships Data (HECO)
10. Hackathons Data (HECO)

### MEDIUM (Important for compliance)

**Month 3:**
11. Research Interventions
12. Data Quality Flags
13. Trend Analysis

---

## Key Metrics by Dashboard Section

### At a Glance
- Total participants reached (by gender, country, institution)
- Number of ventures in portfolio
- Total funding mobilised
- Estimated jobs created
- Revenue generated by ventures
- % with gender parity in team

**Primary Indicators Feeding This Section:**
INT-01, INT-04, INT-06, IMM-01/02/03, INT-O-02/03/04, LTO-06

---

### Outreach
- Participants by institution (ALU, ALX, ALCHE, Other)
- Participants by pillar (HEMP, HENT, HECO)
- Participants by intervention type
- Completion rates by programme
- Satisfaction scores
- Reach demographics (gender, youth, PWD, IDP)

**Primary Indicators Feeding This Section:**
INT-01, INT-03, INT-05, INT-09, INT-11, INT-12, INT-13, INT-15, IMM-15

---

### Youth in Work
- Total youth in work outcomes
- Pathway breakdown (wage employment, enterprise, freelance, internship)
- Employment type distribution
- Gender splits
- Venture vs. employment ratio
- Salary ranges (if available)

**Primary Indicators Feeding This Section:**
INT-O-03, INT-O-02, INT-O-06

---

### Wage Employment
- Detailed employment quality metrics
- Salary distribution
- Employment type (full-time, part-time, contract)
- Arrangement (remote, hybrid, on-site)
- Role level distribution
- Employer diversity

**Primary Indicators Feeding This Section:**
INT-O-03, Employment Outcomes sheet

---

### Entrepreneurship
- Venture portfolio overview (96 ventures)
- Stage distribution
- Funding overview (amount, type)
- Revenue-generating ventures
- External funding rounds
- Job creation by ventures
- Women-led vs. male-led comparison
- Growth metrics (customers, team size)

**Primary Indicators Feeding This Section:**
INT-02, INT-04, INT-05, INT-06, INT-08, INT-14, IMM-01/02/03/08/09/14, INT-O-01/02/03/04/06/07/08/11/12/13/14, LTO-03/04/05

---

### Further Education
- Knowledge improvement scores
- Confidence gains (financial literacy, leadership)
- Career clarity achieved
- Further study pursuit
- Skills developed
- Programme satisfaction

**Primary Indicators Feeding This Section:**
IMM-04, IMM-06, IMM-13, Further Education Outcomes sheet

---

### Impact Reports
- Health system adoption (LTO-01)
- Lives impacted (LTO-02)
- Policy engagement outcomes (INT-O-10, LTO-09)
- Publications and media features (INT-O-15)
- Research outputs (INT-10)
- SDG alignment (LTO-11)
- Alumni ecosystem contribution (LTO-04, LTO-08)

**Primary Indicators Feeding This Section:**
INT-10, INT-15, INT-O-10, INT-O-15, LTO-01/02/04/08/09/11/12

---

### Impact Stories
- Qualitative case studies
- Featured founder/venture narratives
- Health system transformation stories
- Policy change stories
- Employment success stories
- Research impact stories

**Source Sheets:**
Narrative notes fields across all sheets + dedicated case study documentation

---

## GESI Disaggregation Requirements

### MANDATORY for All Sheets:

**Gender:**
- Female (%)
- Male (%)
- Non-binary (%)

**Age:**
- Youth <35 (%)
- Adult ≥35 (%)

**Equity Status:**
- Person with Disability (PWD) - %
- IDP/Refugee - %
- Mission Student - %

### By Sheet:

| Sheet | Gender | Age | PWD | IDP | Mission |
|---|---|---|---|---|---|
| Outreach Interventions | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ventures Portfolio | ✓ (lead) | ✓ | ✗ | ✗ | ✗ |
| Employment Outcomes | ✓ | ✓ | ✓ | ✓ | ✗ |
| Entrepreneurship Outcomes | ✓ (lead) | ✗ | ✗ | ✗ | ✗ |
| Further Education Outcomes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fellowships Data | ✓ | ✗ | ✗ | ✗ | ✗ |
| Hackathons Data | ✓ | ✓ | ✓ | ✗ | ✗ |

---

## Data Validation Rules

### Mandatory Fields (Cannot be blank)
- All ID fields
- Record type / category fields
- Dates (entry date, reporting period)
- One key metric (count, score, or amount)
- Data entry person
- Indicator code (for relevant sheets)

### Conditional Validations
- If venture is "revenue-generating", monthly_revenue_usd must be > 0
- If employment_type is specified, employment_status should be "Employed"
- If fellows completed_status = "Completed", at least one output expected (publication, mentorship, etc.)
- If intervention_type = "Hackathon", ventures_incubated field required

### Range Validations
- Satisfaction scores: 0-5 or 0-10 (standardized)
- Percentages: 0-100%
- Ages: 18-80
- Dates: Cannot be in future

### Calculated Fields (Auto-populate)
- Achievement percentage = (actual / target) × 100
- Female percentage = (female_count / total_count) × 100
- Average funding per recipient = total_amount / recipients_count
- YoY change = (current_year - prior_year) / prior_year × 100
- Trend direction = if change > 0 then "Up", etc.

---

## Monthly Data Entry Checklist

**By 15th of each month:**
- [ ] Outreach Interventions - Log all completed interventions
- [ ] Ventures Portfolio - Update stage, revenue, team size
- [ ] Employment Outcomes - Record new employment placements
- [ ] Fellowships - Update publication progress, mentorship hours

**By end of each quarter:**
- [ ] Run completeness audit
- [ ] Review flagged data quality issues
- [ ] Update At a Glance metrics
- [ ] Export data for dashboard refresh

**By end of each year:**
- [ ] Complete Trend Analysis sheet for all indicators
- [ ] Conduct 12/36/60-month follow-ups where applicable
- [ ] Validate cumulative metrics
- [ ] Prepare annual report data

---

## Common Data Entry Mistakes to Avoid

1. **Forgetting GESI Disaggregation**
   - ALWAYS include gender breakdown for every record
   - Even if total is small, document percentages

2. **Duplicate Entries**
   - Check if venture/participant already exists
   - Use consistent naming conventions

3. **Incorrect Date Formats**
   - Use YYYY-MM-DD for consistency
   - Flag impossible dates (future dates, out-of-order sequences)

4. **Mixing Currencies**
   - All monetary amounts in USD
   - Use conversion rate at transaction date

5. **Incomplete Follow-ups**
   - Don't leave 12m/3y/5y status blank for graduated cohorts
   - Set explicit "Not Tracked" if genuinely unavailable

6. **Vague Notes**
   - Avoid "Good progress" - be specific
   - Include dates and names where relevant

7. **Unverified Data**
   - Don't guess satisfaction scores
   - Only enter data you can source

---

## Integration with Executive Dashboard

### Data Flow:
1. **Source Data Entry** → Individual intervention/venture sheets
2. **Aggregation** → AT_A_GLANCE_DATA sheet calculates totals
3. **Dashboard Pull** → Executive dashboard queries this sheet
4. **Visualization** → 8 dashboard sections display metrics

### Refresh Frequency:
- **Real-time**: Intervention logging (At a Glance updated daily)
- **Weekly**: Dashboard summary metrics
- **Monthly**: Full programme metrics refresh
- **Quarterly**: Detailed analysis and trend updates
- **Annual**: Historical data validation and trend analysis

### Manual Dashboard Updates:
- Impact Stories: Qualitative case studies (separate process)
- Recommendations/Highlights: Programme Manager discretion

---

## Roles and Responsibilities

| Role | Sheet Primary | Sheet Secondary | Frequency |
|---|---|---|---|
| **M&E Lead** | Indicators Master, Data Quality Flags, Trend Analysis | All sheets (review) | Monthly/Quarterly |
| **Programme Manager (HEMP/HENT/HECO)** | Outreach Interventions, Ventures, Fellowships | At a Glance, Funding | Real-time, Quarterly |
| **Cohort Manager** | Ventures Portfolio, Entrepreneurship Outcomes | GESI Tracking | Monthly |
| **GESI Officer** | GESI Tracking | All sheets (GESI review) | Real-time |
| **M&E Officer** | Employment Outcomes, Further Education | At a Glance | Monthly |
| **Finance Lead** | Funding Tracking, Ventures (revenue) | At a Glance | Quarterly |
| **Research Lead** | Research Interventions, Research Partnerships | Data Quality (research) | Quarterly |
| **Dashboard Admin** | At a Glance (pull), Trend Analysis | All sheets (monitor) | Weekly |

---

## Support & Training

### First-Time User Training:
- 2-hour onboarding on workbook structure
- 30-min role-specific training per sheet
- Template with example data
- Data dictionary reference guide

### Ongoing Support:
- Monthly office hours (Tuesdays 2pm)
- Slack channel for questions
- Quick reference guides for common tasks
- Annual recalibration session (January)

### Quality Assurance:
- Weekly data completeness report
- Monthly validation checks
- Quarterly accuracy audit
- Annual data quality review

---

## FAQ

**Q: Can multiple people edit the same sheet?**
A: Yes, but use row-level locking to prevent conflicts. Recommend one primary person per sheet type (e.g., one Programme Manager for HEMP Interventions).

**Q: What if we don't have data for a metric?**
A: Leave blank OR enter "Not Available" note. Never guess. Flag in Data Quality sheet if should have data.

**Q: How do we handle ventures that failed/are inactive?**
A: Keep in database with status "Stalled" or "Dormant". Still track any employment created or learning outputs.

**Q: Can we modify the column structure?**
A: Only through M&E Lead approval. Changing columns can break dashboard feeds. Document any changes in Data Quality Flags sheet.

**Q: How far back should we go with historical data?**
A: Minimum: 2022 (Programme start). Ideal: Complete historical data for all cohorts with available records.

---

## Success Metrics for Implementation

**First 3 Months:**
- ✓ 80%+ data completeness across core sheets
- ✓ All 2024+ cohort data entered
- ✓ Zero critical validation errors
- ✓ Dashboard populated with all 8 sections

**6-Month Mark:**
- ✓ Historical data (2022-2023) completed
- ✓ GESI disaggregation on all records
- ✓ Zero duplicate entries
- ✓ Data quality flags reviewed quarterly

**12-Month Mark:**
- ✓ 95%+ data completeness
- ✓ Seamless monthly updates with <2 hours effort
- ✓ Trend analysis shows meaningful insights
- ✓ Executive dashboard used in monthly reviews

---

## Troubleshooting

### Dashboard shows "No Data"
→ Check AT_A_GLANCE_DATA sheet has entries for reporting_period
→ Verify data_source field is populated

### Numbers don't match previous report
→ Check for new entries in GESI_TRACKING that might change totals
→ Verify date range filters on dashboard
→ Review Data Quality Flags for any corrections made

### GESI percentages don't add to 100%
→ Check for non-binary or missing gender entries
→ Verify demographic data is complete
→ Some participants may have unreported demographics

---

## Next Steps

1. **Week 1**: Create Excel workbook using provided column specifications
2. **Week 2**: Populate INDICATORS_MASTER and set up drop-downs
3. **Week 3**: Train data entry staff on their assigned sheets
4. **Week 4**: Begin historical data entry and validation
5. **Month 2**: Integrate with Executive Dashboard
6. **Month 3**: Full operational deployment
