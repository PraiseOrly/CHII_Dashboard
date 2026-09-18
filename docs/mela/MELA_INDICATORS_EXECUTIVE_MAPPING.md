# MELA Indicators to Executive Dashboard Mapping

## Executive Dashboard Structure

The CHII Executive Dashboard has 8 main sections:
1. **At a Glance** - High-level summaries and KPIs
2. **Outreach** - Participation metrics by institution, pillar, intervention
3. **Youth in Work** - Employment/entrepreneurship outcomes
4. **Wage Employment** - Detailed employment metrics
5. **Entrepreneurship** - Venture portfolio metrics
6. **Further Education** - Education pathway outcomes
7. **Impact Reports** - Aggregated impact metrics
8. **Impact Stories** - Qualitative case studies

---

## MELA INDICATORS MAPPED TO DASHBOARD SECTIONS

### LEVEL 1: INTERVENTIONS (15 indicators)

#### INT-01: Number of programme interventions delivered per cohort
- **Dashboard Section**: At a Glance, Outreach
- **Data Collection Needed**: 
  - intervention_id, intervention_type, cohort_year, delivery_date_start, delivery_date_end, participants_count
- **Metrics**: Total count by cohort, by intervention type
- **GESI**: Track by gender, participant type

#### INT-02: Number of hackathons conducted
- **Dashboard Section**: Entrepreneurship, Outreach
- **Data Collection Needed**: 
  - hackathon_id, hackathon_name, year, country, participants, female_participants, teams, ventures_incubated
- **Metrics**: Total hackathons by year, participation rates
- **GESI**: Female participation %, teams with female leads

#### INT-03: Number of masterclasses delivered; total contact hours
- **Dashboard Section**: Outreach, At a Glance
- **Data Collection Needed**: 
  - masterclass_id, masterclass_name, cohort, delivery_date, facilitator, topic, participants, female_participants, hours_delivered
- **Metrics**: Count by cohort, total hours, reach metrics
- **GESI**: Female participation %, IDP/refugee participation

#### INT-04: Number of fellowships awarded; % awarded to women
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - fellowship_id, fellow_name, cohort, country, gender, institution, role, award_date, funding_amount
- **Metrics**: Total fellowships, % female fellows, funding distribution
- **GESI**: Gender breakdown required

#### INT-05: Number of mentorship sessions; total mentorship hours
- **Dashboard Section**: Entrepreneurship, Outreach
- **Data Collection Needed**: 
  - mentorship_session_id, mentor_name, mentee_name, session_date, duration_hours, focus_area, outcome_notes
- **Metrics**: Total sessions, hours by category
- **GESI**: Mentor gender distribution, female mentee participation

#### INT-06: Number of funding initiatives facilitated; USD value of funding linked
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - funding_initiative_id, initiative_name, year, amount_usd, recipients_count, funding_type
- **Metrics**: Total initiatives, total funding, average per recipient
- **GESI**: Funding to women-led ventures

#### INT-07: Number of innovation challenges held; number of submissions received
- **Dashboard Section**: Outreach, Entrepreneurship
- **Data Collection Needed**: 
  - challenge_id, challenge_name, year, launch_date, deadline, submissions_count, participants_count, female_participants, prizes_awarded
- **Metrics**: Participation rates, submission quality metrics
- **GESI**: Female submission rates

#### INT-08: Number of ventures in incubation; number in acceleration
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, venture_name, cohort, entry_stage, current_stage, incubation_start_date, acceleration_start_date
- **Metrics**: Pipeline by stage, progression rate
- **GESI**: Women-led ventures by stage

#### INT-09: Number of field study trips; number of participants
- **Dashboard Section**: Outreach, At a Glance
- **Data Collection Needed**: 
  - trip_id, trip_name, cohort, country, trip_date, participants, female_participants, institutions_visited, outcomes
- **Metrics**: Total trips, reach, outcomes
- **GESI**: Gender participation, diversity of participants

#### INT-10: Number of research interventions supported; outputs produced
- **Dashboard Section**: Impact Reports, At a Glance
- **Data Collection Needed**: 
  - research_id, research_title, researcher_name, year, institution_partner, funding_amount, outputs_count, publications, policy_briefs
- **Metrics**: Count by theme, outputs by type
- **GESI**: Female researcher participation

#### INT-11: Average participant satisfaction score (0–100)
- **Dashboard Section**: At a Glance, Outreach
- **Data Collection Needed**: 
  - survey_id, participant_id, intervention_id, satisfaction_score, feedback_date, intervention_type
- **Metrics**: Average by intervention, trend over time
- **GESI**: Satisfaction by gender, participant type

#### INT-12: Number of active mentors; % female mentors
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - mentor_id, mentor_name, gender, expertise_areas, active_status, mentees_count, hours_committed
- **Metrics**: Total active mentors, % female, expertise distribution
- **GESI**: Gender breakdown required

#### INT-13: Number of formal partnerships established
- **Dashboard Section**: At a Glance, Outreach
- **Data Collection Needed**: 
  - partnership_id, partner_organization, partner_type, establishment_date, focus_area, contact_person, mou_signed
- **Metrics**: Total partnerships by type, activation rate
- **GESI**: Partner diversity

#### INT-14: Value of non-financial resources mobilised for ventures (USD)
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - resource_id, resource_type, resource_description, venture_id, provision_date, estimated_value_usd
- **Metrics**: Total value by resource type
- **GESI**: Distribution to women-led ventures

#### INT-15: % of programme activities with explicit GESI integration
- **Dashboard Section**: At a Glance, Outreach
- **Data Collection Needed**: 
  - activity_id, activity_name, activity_date, gesi_integration_level, gesi_elements_implemented, reviewed_by
- **Metrics**: % with integration, by intervention type
- **GESI**: Tracking GESI mainstreaming

---

### LEVEL 2: IMMEDIATE OUTCOMES (15 indicators)

#### IMM-01: % of ventures with a complete, reviewed business plan
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort, business_plan_status, review_date, reviewer_name, completeness_score
- **Metrics**: % by cohort, trend
- **GESI**: % women-led

#### IMM-02: % of ventures achieving prototype or MVP stage
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort, prototype_status, mvp_status, completion_date, development_notes
- **Metrics**: % by cohort, time to MVP
- **GESI**: By gender composition

#### IMM-03: % of ventures with ≥2 co-founders; % with at least one female founder
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, founder_count, founder_names, founder_genders, founder_backgrounds
- **Metrics**: % with 2+ founders, % with female founder
- **GESI**: Gender breakdown

#### IMM-04: Pre/post knowledge assessment score improvement (avg %)
- **Dashboard Section**: At a Glance, Further Education
- **Data Collection Needed**: 
  - participant_id, intervention_id, pre_assessment_score, post_assessment_score, assessment_date
- **Metrics**: Average improvement %, by intervention
- **GESI**: By participant gender

#### IMM-05: % of ventures completing customer discovery interviews (≥20)
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort, interviews_completed, interview_start_date, interview_end_date, insights_notes
- **Metrics**: % with 20+ interviews
- **GESI**: By venture gender composition

#### IMM-06: % of founders rating financial literacy confidence ≥7/10
- **Dashboard Section**: At a Glance, Further Education
- **Data Collection Needed**: 
  - founder_id, venture_id, confidence_score, assessment_date, training_received
- **Metrics**: % scoring ≥7
- **GESI**: By founder gender

#### IMM-07: % of ventures with ≥1 documented external stakeholder meeting
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, stakeholder_name, meeting_date, stakeholder_type, outcome_notes, documented
- **Metrics**: % with stakeholder engagement
- **GESI**: Type of stakeholders engaged

#### IMM-08: Avg pitch score in programme demo day (0–100)
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, demo_day_date, pitch_score, judging_panel, feedback_summary
- **Metrics**: Average pitch score, distribution
- **GESI**: By venture gender composition

#### IMM-09: % of women founders rating access to resources as equitable
- **Dashboard Section**: At a Glance
- **Data Collection Needed**: 
  - founder_id, gender, equity_rating_score, survey_date, feedback_text
- **Metrics**: % rating ≥7 or equivalent threshold
- **GESI**: Female founders only

#### IMM-10: % of ventures with M&E-validated problem statement
- **Dashboard Section**: At a Glance, Entrepreneurship
- **Data Collection Needed**: 
  - venture_id, problem_statement, validation_date, validator_name, validation_score, validation_notes
- **Metrics**: % validated
- **GESI**: By venture gender composition

#### IMM-11: Avg number of MVP iterations per venture in programme period
- **Dashboard Section**: Entrepreneurship
- **Data Collection Needed**: 
  - venture_id, iteration_date, iteration_version, changes_made, user_feedback_incorporated
- **Metrics**: Average iterations count
- **GESI**: By venture gender composition

#### IMM-12: % of ventures with ≥1 formal partnership by end of cohort
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, partner_organization, partnership_date, partnership_type, mou_signed, active_status
- **Metrics**: % with partnership
- **GESI**: By venture gender composition

#### IMM-13: % of founders completing leadership self-assessment ≥70%
- **Dashboard Section**: At a Glance, Further Education
- **Data Collection Needed**: 
  - founder_id, venture_id, assessment_score, assessment_date, development_areas
- **Metrics**: % scoring ≥70%
- **GESI**: By founder gender

#### IMM-14: % of ventures with a reviewed go-to-market strategy
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, go_to_market_document, review_date, reviewer_name, review_score, feedback
- **Metrics**: % with reviewed strategy
- **GESI**: By venture gender composition

#### IMM-15: % of ventures participating in ≥3 cohort peer sessions
- **Dashboard Section**: Outreach, Entrepreneurship
- **Data Collection Needed**: 
  - venture_id, cohort, session_date, session_type, attendance, participation_quality
- **Metrics**: % attending ≥3 sessions
- **GESI**: By venture gender composition

---

### LEVEL 3: INTERMEDIATE OUTCOMES (15 indicators)

#### INT-O-01: % of ventures advancing ≥1 stage within 12 months of cohort end
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort_end_date, stage_at_end, stage_12m_followup, date_12m_followup, stage_progression
- **Metrics**: % advancing, average stages advanced
- **GESI**: By venture gender composition

#### INT-O-02: % of ventures generating revenue; median monthly revenue (USD)
- **Dashboard Section**: Entrepreneurship, Youth in Work, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort, revenue_generating_status, monthly_revenue_usd, revenue_start_date, revenue_month, revenue_source
- **Metrics**: % generating revenue, median/mean revenue
- **GESI**: Comparison women-led vs. male-led

#### INT-O-03: Total jobs created; % held by women; % held by youth (<35)
- **Dashboard Section**: Youth in Work, Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort, employee_id, employee_name, gender, age, hire_date, employment_type, salary
- **Metrics**: Total jobs, % female, % youth
- **GESI**: Gender and age breakdown

#### INT-O-04: Total external funding raised (USD); number of funding rounds
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort, funding_round, funder_name, funding_date, amount_usd, funding_type, valuation
- **Metrics**: Total raised, rounds count, average per round
- **GESI**: Funding to women-led ventures

#### INT-O-05: Number of active operational partnerships per venture
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, partner_organization, partnership_date, partnership_status, partnership_type, revenue_impact
- **Metrics**: Average partnerships per venture, by type
- **GESI**: Partner diversity

#### INT-O-06: Number of paying customers or patients reached per venture
- **Dashboard Section**: Entrepreneurship, Impact Reports
- **Data Collection Needed**: 
  - venture_id, reporting_period, customer_count, new_customers, customer_retention_rate, revenue_per_customer
- **Metrics**: Total customers reached, growth rate
- **GESI**: Reach to underserved populations

#### INT-O-07: % of ventures with documented product-market fit evidence
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, pmf_assessment_date, pmf_score, pmf_evidence_submitted, assessment_reviewer, confidence_level
- **Metrics**: % with PMF evidence
- **GESI**: By venture gender composition

#### INT-O-08: Number of countries/regions of operation per venture
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, country_of_operation, region, market_entry_date, expansion_type, revenue_by_country
- **Metrics**: Average countries per venture, expansion rate
- **GESI**: Regional diversity

#### INT-O-09: Avg team size at 12 months vs. programme entry
- **Dashboard Section**: Entrepreneurship, Youth in Work
- **Data Collection Needed**: 
  - venture_id, team_size_entry, team_size_12m, team_composition_entry, team_composition_12m
- **Metrics**: Average team size, growth rate
- **GESI**: Gender composition change

#### INT-O-10: Number of ventures with documented policy/regulator engagement
- **Dashboard Section**: Impact Reports, At a Glance
- **Data Collection Needed**: 
  - venture_id, policy_engagement_date, policy_actor_name, policy_actor_type, engagement_type, outcome
- **Metrics**: % with policy engagement
- **GESI**: Influence on equity policies

#### INT-O-11: % of digital ventures with active user growth (MoM)
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, venture_type, reporting_month, active_users, new_users, churn_rate, engagement_metrics
- **Metrics**: % with positive MoM growth
- **GESI**: By venture gender composition

#### INT-O-12: Number of ventures in due diligence with external investors
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, investor_name, investor_type, due_diligence_start_date, due_diligence_stage, expected_close_date
- **Metrics**: Count by investor type
- **GESI**: Women-led in pipeline

#### INT-O-13: % of revenue from earned income (non-grant)
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, reporting_period, total_revenue, earned_revenue, grant_revenue, other_revenue
- **Metrics**: % earned, trend
- **GESI**: By venture gender composition

#### INT-O-14: Revenue & stage progression gap: women-led vs. male-led ventures
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, gender_composition, revenue_usd, current_stage, stage_progression_months
- **Metrics**: Comparative metrics by gender
- **GESI**: Equity analysis required

#### INT-O-15: Number of publications, case studies, or media features per cohort
- **Dashboard Section**: Impact Reports, At a Glance
- **Data Collection Needed**: 
  - venture_id, publication_date, publication_type, publication_outlet, reach_estimate, featured_founders
- **Metrics**: Count by type, reach
- **GESI**: Featuring women entrepreneurs

---

### LEVEL 4: LONG TERM OUTCOMES (12 indicators)

#### LTO-01: Number of health system actors using HENT venture solutions
- **Dashboard Section**: Impact Reports, At a Glance
- **Data Collection Needed**: 
  - venture_id, health_actor_name, actor_type, adoption_date, scale_of_use, impact_metrics
- **Metrics**: Total actors, by type
- **GESI**: Reach to underserved populations

#### LTO-02: Estimated lives impacted or health outcomes improved (by venture)
- **Dashboard Section**: Impact Reports, Impact Stories
- **Data Collection Needed**: 
  - venture_id, reporting_period, lives_reached_estimate, health_outcome_metric, outcome_measurement_method
- **Metrics**: Total lives impacted
- **GESI**: Disaggregated by gender, geography

#### LTO-03: % of ventures still active 5 years after cohort graduation
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, cohort, graduation_date, 5y_followup_date, still_active_status, current_stage
- **Metrics**: % still active
- **GESI**: By venture gender composition

#### LTO-04: Number of HENT alumni serving as mentors, investors, or advisors
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - alumni_id, venture_id, role_type, mentees_advised, investments_made, advisory_positions
- **Metrics**: Total alumni in ecosystem roles
- **GESI**: Female alumni in leadership roles

#### LTO-05: % of women-led HENT ventures still operating at 3-year mark
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - venture_id, gender_composition, cohort_year, 3y_followup_date, still_active_status
- **Metrics**: % still operating
- **GESI**: Women-led comparison

#### LTO-06: Cumulative jobs created across all cohorts; % women; % youth
- **Dashboard Section**: Youth in Work, At a Glance
- **Data Collection Needed**: 
  - aggregate data from INT-O-03
- **Metrics**: Cumulative totals by cohort, % female, % youth
- **GESI**: Aggregated gender and age breakdown

#### LTO-07: Number of rural/low-income patients served by HENT venture solutions
- **Dashboard Section**: Impact Reports, At a Glance
- **Data Collection Needed**: 
  - venture_id, patient_location_type, patient_count, service_type, reporting_period
- **Metrics**: Total reach to underserved
- **GESI**: Geographic equity

#### LTO-08: Number of new ventures founded by HENT alumni outside the programme
- **Dashboard Section**: Entrepreneurship, At a Glance
- **Data Collection Needed**: 
  - alumni_id, new_venture_id, venture_name, founding_date, alumni_role, alumni_network_helped
- **Metrics**: Count of alumni-founded ventures
- **GESI**: Female alumni founders

#### LTO-09: Number of policy briefs, regulatory engagements, or policy changes influenced
- **Dashboard Section**: Impact Reports, At a Glance
- **Data Collection Needed**: 
  - venture_id, policy_brief_id, policy_actor, influence_date, policy_change_description, influence_type
- **Metrics**: Count by type
- **GESI**: Policy influence on equity

#### LTO-10: Estimated cumulative revenue and economic value generated (USD M)
- **Dashboard Section**: Entrepreneurship, Impact Reports, At a Glance
- **Data Collection Needed**: 
  - aggregate financial data from all ventures
- **Metrics**: Cumulative USD value
- **GESI**: Value distribution analysis

#### LTO-11: Number of ventures with documented SDG alignment and contribution narrative
- **Dashboard Section**: Impact Reports, At a Glance
- **Data Collection Needed**: 
  - venture_id, sdg_target, contribution_narrative, sdg_metrics_tracked, reporting_period
- **Metrics**: % with SDG alignment
- **GESI**: SDG 5 (Gender) alignment

#### LTO-12: ALU HENT ranking in African health innovation ecosystem indices
- **Dashboard Section**: At a Glance, Impact Reports
- **Data Collection Needed**: 
  - ranking_year, ranking_index_name, ranking_score, ranking_position, ranking_methodology
- **Metrics**: Ranking trend
- **GESI**: N/A (organizational metric)

---

## EXCEL WORKBOOK STRUCTURE

The workbook should have the following sheets:

### Sheet 1: INDICATORS_MASTER
- Indicator ID, Code, Name, Level, GESI Flag, Flagged Status, Data Source
- Maps all 57 indicators

### Sheet 2: AT_A_GLANCE_DATA
- Reporting Period, Metric Name, Value, Target, % Achievement, Last Updated
- Tracks: Total participants, Total ventures, Employment rate, Revenue generated, etc.

### Sheet 3: OUTREACH_INTERVENTIONS
- Intervention ID, Intervention Type, Programme, Activity Name, Cohort/Year
- Participants (Total, Female, Male, IDP, PWD), Satisfaction Score, Status

### Sheet 4: VENTURES_PORTFOLIO
- Venture ID, Venture Name, Cohort, Country, Sector, Founder Gender
- Stage, Funding (USD), Revenue, Jobs Created (Total, Female, Youth)
- Partnerships, Revenue Stage, 12m/3y/5y Status

### Sheet 5: EMPLOYMENT_OUTCOMES
- Participant ID, Name, Gender, Country, Programme, Intervention
- Employment Pathway, Employment Type, Employer Type, Sector
- Salary (if available), Employment Start Date, Status

### Sheet 6: ENTREPRENEURSHIP_OUTCOMES
- Venture ID, Venture Name, Business Plan Complete, MVP Status, Customer Discovery
- Pitch Score, Stakeholder Engagement, Partnerships, Stage Progression
- Revenue Start Date, Funding Rounds

### Sheet 7: FURTHER_EDUCATION_OUTCOMES
- Participant ID, Programme, Pre-Assessment Score, Post-Assessment Score
- Knowledge Improvement %, Confidence Score, Leadership Assessment
- Career Clarity Achieved, Further Study Status

### Sheet 8: RESEARCH_PARTNERSHIPS
- Partnership ID, Authority Name, Theme, Country, Year Established
- Studies Count, Publications, Policy Briefs, Data Agreement, Policy Adoptions

### Sheet 9: RESEARCH_INTERVENTIONS
- Research ID, Research Title, Researcher Name, Year, Partner Institution
- Theme, Funding (USD), Publications Count, Policy Brief Count, Outputs

### Sheet 10: GESI_TRACKING
- Record ID (Venture/Participant/Activity), Category
- Female %, Youth %, IDP/Refugee %, PWD %
- GESI Integration Elements, GESI Outcomes

### Sheet 11: FUNDING_TRACKING
- Initiative ID, Initiative Name, Funder, Year, Type
- Amount (USD), Recipients Count, Average per Recipient
- Women-Led Recipients, Distribution

### Sheet 12: FELLOWSHIPS_DATA
- Fellow ID, Name, Cohort, Country, Institution, Role, Gender
- Operational Funding (USD), Training Hours, Publication Stage
- Publications Count, Mentorship Hours, Hackathon Teams Mentored

### Sheet 13: HACKATHONS_DATA
- Hackathon ID, Name, Year, Country, Participants, Female Participants
- Teams Count, Fellow Mentors Count, Mentorship Hours
- Ventures Incubated, Ventures Still Active

### Sheet 14: DATA_QUALITY_FLAGS
- Indicator ID, Flagged Status, Issue Description, Reviewer Notes
- Data Source Validation, Attribution Clarity
- Standardization Needs

### Sheet 15: TREND_ANALYSIS
- Indicator ID, Year (2022-2026), Value, Target, Achievement %
- YoY Change %, Notes

---

## DATA POINTS BY INDICATOR CATEGORY

### Participant Demographics (GESI fields for all records)
- Gender (Female, Male, Non-binary)
- Age Group (Youth <35 vs. Adult)
- Country of Origin/Operation
- Institution (ALU, ALX, ALCHE, Other Partner)
- IDP/Refugee Status
- Person with Disability (PWD) Status
- Participant Type (Student, Professional, Entrepreneur)

### Programme/Activity Fields
- Programme (HEMP, HENT, HECO)
- Intervention Type (Hackathon, Masterclass, Mentorship, etc.)
- Activity/Intervention ID and Name
- Cohort/Year
- Delivery Country
- Start Date, End Date
- Hours/Duration

### Outcome Measurement Fields
- Target Value
- Actual Value
- Percentage Achievement
- Quality Metrics (Scores, Ratings)
- Date of Measurement
- Reviewer/Validator Name

### Financial Fields
- Amount (USD)
- Funding Type (Grant, Angel, VC, Revenue-Based, etc.)
- Funding Stage (Seed, Series A, etc.)
- Revenue (Monthly, Quarterly, Annual)
- Job Creation (Total, by Gender, by Age)

### Status/Timeline Fields
- Intervention Status (Completed, Active, In-Progress, Dropped)
- Venture Stage (Ideation, Validation, Prototype, Growth, Scaling, Funding)
- Employment Status (Employed, Entrepreneur, Further Study, Seeking)
- Engagement Status (Completed, Active, Deferred)

---

## PRIORITY DATA COLLECTION FOCUS

Based on dashboard sections, prioritize collection of:

1. **Immediate (for At a Glance)**
   - INT-01: Interventions delivered
   - INT-04: Fellowships awarded
   - INT-06: Funding facilitated
   - IMM-01, IMM-02, IMM-03: Venture readiness metrics
   - INT-O-01, INT-O-02, INT-O-03: Post-programme outcomes
   - INT-O-04: External funding raised

2. **High Value (for Outreach)**
   - INT-02, INT-03, INT-05, INT-09: Programme delivery
   - INT-11: Satisfaction
   - INT-12: Mentor pool
   - INT-13: Partnerships

3. **Impact Tracking (for Impact Reports)**
   - INT-10, INT-15: Research outputs, GESI integration
   - INT-O-10, INT-O-15: Policy engagement, publications
   - LTO-01 through LTO-12: Long-term impact

4. **Employment/Entrepreneurship**
   - INT-O-03: Job creation
   - INT-O-04: Funding raised
   - INT-O-06: Customer reach
   - INT-O-02: Revenue generation
   - INT-O-13: Earned income

---

## NOTES ON DATA QUALITY CHALLENGES

Flagged indicators requiring methodology standardization:

- **INT-06**: Attribution to HENT vs. external factors for funding
- **INT-14**: Valuation methodology for non-financial resources
- **IMM-11**: MVP iteration definition consistency
- **INT-O-07**: Product-market fit assessment framework
- **INT-O-14**: Sample size limits for gender comparison
- **LTO-02**: Attribution methodology for health outcome impact
- **LTO-10**: Economic impact calculation methodology
