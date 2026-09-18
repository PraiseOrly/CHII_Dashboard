# MELA Data Collection Workbook - Column Specifications

## Sheet 1: INDICATORS_MASTER

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| indicator_id | Integer | Yes | 1 | Unique indicator number (1-57) |
| indicator_code | Text | Yes | INT-01 | Framework code (INT, IMM, INT-O, LTO) |
| indicator_name | Text | Yes | Number of programme interventions delivered per cohort | Full indicator statement |
| level | Text | Yes | Interventions | Level in framework (Interventions, Immediate Outcomes, Intermediate Outcomes, Long Term Outcome) |
| group | Text | Yes | Programme Delivery | Indicator group/category |
| data_source | Text | Yes | Programme MIS | Source system for data collection |
| users | Text | No | Programme Manager | Primary user role |
| timing | Text | Yes | Per cohort | Reporting frequency |
| gesi_flag | Boolean | Yes | FALSE | Is this a GESI-relevant indicator? |
| flagged_status | Boolean | Yes | FALSE | Data quality concern flagged? |
| reviewer_notes | Text | No | Track gender breakdown consistently | Notes from framework review |
| dashboard_section | Text | Yes | At a Glance, Outreach | Which dashboard section(s) to display |
| calculation_type | Text | No | Count | How to calculate (Count, Sum, Average, Percentage, etc.) |
| disaggregation_fields | Text | No | gender, country, participant_type | Fields to disaggregate by |

---

## Sheet 2: AT_A_GLANCE_DATA

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| record_id | Text | Yes | AAG-001 | Unique record identifier |
| reporting_period | Text | Yes | 2026-Q3 | Quarter and year (YYYY-QN) |
| reporting_date | Date | Yes | 2026-09-18 | Data entry/validation date |
| metric_code | Text | Yes | INT-01 | Related indicator code |
| metric_name | Text | Yes | Total Interventions Delivered | KPI name |
| target_value | Decimal | No | 50 | Target for period |
| actual_value | Decimal | Yes | 48 | Actual achievement |
| percentage_achieved | Decimal | Calculated | 96 | (actual/target)*100 |
| notes | Text | No | Includes 12 hackathons, 8 masterclasses | Contextual notes |
| last_updated_by | Text | Yes | Programme Manager | Person entering data |
| data_source | Text | Yes | Programme MIS | Where data came from |
| verification_status | Text | Yes | Verified | Pending, Verified, Reviewed |

---

## Sheet 3: OUTREACH_INTERVENTIONS

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| intervention_id | Text | Yes | INT-20240915-001 | Unique intervention ID |
| intervention_code | Text | Yes | INT-03 | Related MELA indicator |
| intervention_type | Text | Yes | Masterclass | Type (Hackathon, Masterclass, Mentorship, etc.) |
| intervention_name | Text | Yes | Financial Literacy Masterclass | Full intervention name |
| programme | Text | Yes | HEMP | Pillar (HEMP, HENT, HECO) |
| cohort_year | Integer | Yes | 2025 | Cohort/Academic year |
| delivery_country | Text | Yes | Kenya | Country of delivery |
| delivery_date_start | Date | Yes | 2025-09-15 | Start date |
| delivery_date_end | Date | Yes | 2025-09-17 | End date |
| facilitator_name | Text | No | Dr. Jane Kipchoge | Primary facilitator |
| participants_total | Integer | Yes | 45 | Total participants |
| participants_female | Integer | Yes | 27 | Female participants |
| participants_male | Integer | Yes | 17 | Male participants |
| participants_non_binary | Integer | No | 1 | Non-binary participants |
| participants_pwd | Integer | No | 2 | Persons with disability |
| participants_idp_refugee | Integer | No | 3 | IDP/Refugee participants |
| participants_mission_student | Integer | No | 28 | Mission student participants |
| contact_hours | Decimal | Yes | 18 | Total contact hours delivered |
| satisfaction_score | Decimal | No | 4.3 | 0-5 satisfaction rating |
| status | Text | Yes | Completed | Completed, In-progress, Cancelled |
| notes | Text | No | High engagement, discussed market validation | Session notes |
| entered_by | Text | Yes | Programme Manager | Data entry person |
| entry_date | Date | Yes | 2025-09-18 | Date entered into system |

---

## Sheet 4: VENTURES_PORTFOLIO

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| venture_id | Text | Yes | VENT-2024-045 | Unique venture identifier |
| venture_name | Text | Yes | HealthLink Africa | Venture trading name |
| cohort_year | Integer | Yes | 2023 | Entry cohort year |
| country | Text | Yes | Kenya | Country of registration |
| sector | Text | Yes | Digital Health | Health sub-sector |
| stage_at_entry | Text | Yes | Ideation | Entry stage |
| current_stage | Text | Yes | Early Growth | Current stage |
| founder_count | Integer | Yes | 2 | Number of founders |
| founder_names | Text | No | John Kipchoge, Sarah Mwangi | Comma-separated founder names |
| founder_gender_composition | Text | Yes | Mixed | Mixed, Female-led, Male-led |
| founder_female_count | Integer | Yes | 1 | Number of female founders |
| business_plan_complete | Boolean | Yes | TRUE | Business plan completed? |
| business_plan_reviewed | Boolean | Yes | TRUE | Business plan reviewed? |
| mvp_status | Text | Yes | Complete | Ideation, In-Development, Complete, Deployed |
| mvp_iterations | Integer | No | 4 | Number of iterations |
| customer_discovery_interviews | Integer | No | 25 | Number of interviews conducted |
| pitch_score | Decimal | No | 78 | Demo day pitch score (0-100) |
| partnerships_count | Integer | Yes | 2 | Number of active partnerships |
| partnership_names | Text | No | County Health Department, NGO Partner | Partner names |
| problem_statement_validated | Boolean | Yes | TRUE | Problem statement validated? |
| go_to_market_reviewed | Boolean | Yes | TRUE | GTM strategy reviewed? |
| funding_amount_usd | Decimal | Yes | 50000 | Total funding received |
| funding_type | Text | Yes | Grant | Grant, Angel, VC, Revenue-Based |
| funding_rounds | Integer | No | 1 | Number of funding rounds |
| external_funding_usd | Decimal | No | 0 | External funding beyond HENT |
| monthly_revenue_usd | Decimal | No | 5000 | Current monthly revenue |
| employees_total | Integer | No | 5 | Total employees |
| employees_female | Integer | No | 2 | Female employees |
| employees_youth | Integer | No | 3 | Employees under 35 |
| jobs_created_cumulative | Integer | No | 7 | Cumulative jobs from ventures |
| countries_of_operation | Integer | No | 1 | Number of countries operating in |
| customers_reached | Integer | No | 2500 | Total paying customers/patients |
| active_users_mom_growth | Boolean | No | TRUE | Positive MoM growth? |
| venture_health_score | Decimal | No | 72 | Overall health score (0-100) |
| success_probability | Decimal | No | 78 | Probability of success (0-100) |
| status | Text | Yes | Active | Active, Dormant, Stalled |
| 12m_still_active | Boolean | No | TRUE | Still active at 12 months? |
| 3y_still_active | Boolean | No | TRUE | Still active at 3 years? |
| 5y_still_active | Boolean | No | TRUE | Still active at 5 years? |
| notes | Text | No | Demonstrated PMF, securing Series A | Key observations |
| last_updated_date | Date | Yes | 2026-03-15 | Last update date |
| entered_by | Text | Yes | Cohort Manager | Data entry person |

---

## Sheet 5: EMPLOYMENT_OUTCOMES

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| employment_record_id | Text | Yes | EMP-2025-0042 | Unique employment outcome ID |
| participant_id | Text | Yes | PART-2023-156 | Participant identifier |
| participant_name | Text | No | Ruth Wanjiku | Full name |
| gender | Text | Yes | Female | Female, Male, Non-binary |
| age_group | Text | No | Youth (<35) | Youth, Adult |
| country | Text | Yes | Kenya | Country of origin/operation |
| programme | Text | Yes | HEMP | HEMP, HENT, HECO |
| intervention_attended | Text | Yes | Internships | Primary intervention |
| cohort_year | Integer | Yes | 2024 | Cohort year |
| institution | Text | Yes | ALU | ALU, ALX, ALCHE, Other |
| programme_status | Text | Yes | Completed | Completed, Active, Deferred |
| employment_pathway | Text | Yes | Wage Employment | Wage Employment, Enterprise, Freelance, Internship |
| employment_status | Text | Yes | Employed | Employed, Entrepreneur, Further Study, Seeking |
| employment_type | Text | No | Full-time | Full-time, Part-time, Contract, Freelance |
| employer_name | Text | No | KASHA Health | Employer organization |
| employer_type | Text | No | Social Enterprise | Corporate, NGO, Government, Social Enterprise, Self |
| sector | Text | No | Health | Industry sector |
| employment_date | Date | Yes | 2025-03-15 | Employment start date |
| salary_annual_usd | Decimal | No | 18000 | Annual salary (if available) |
| employment_arrangement | Text | No | On-site | Remote, On-site, Hybrid |
| role_level | Text | No | Entry-level | Entry, Mid, Senior, Leadership |
| permanent_contract | Boolean | No | TRUE | Permanent or temporary? |
| venture_employee | Boolean | No | FALSE | Employed by a CHII venture? |
| venture_id | Text | No | VENT-2024-045 | Venture ID if applicable |
| internship_converted | Boolean | No | TRUE | Internship converted to employment? |
| employment_quality_score | Decimal | No | 7 | Employment quality score (0-10) |
| employment_satisfaction | Decimal | No | 8 | Satisfaction rating (0-10) |
| pwd_status | Boolean | Yes | FALSE | Person with disability? |
| idp_refugee_status | Boolean | Yes | FALSE | IDP/Refugee? |
| notes | Text | No | Secured role through internship placement | Notes |
| reported_date | Date | Yes | 2025-03-20 | Date employment reported |
| entered_by | Text | Yes | M&E Officer | Data entry person |

---

## Sheet 6: ENTREPRENEURSHIP_OUTCOMES

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| entrepreneurship_record_id | Text | Yes | ENT-2025-0078 | Unique entrepreneurship record ID |
| venture_id | Text | Yes | VENT-2024-045 | Venture identifier |
| venture_name | Text | Yes | HealthLink Africa | Venture name |
| cohort_year | Integer | Yes | 2023 | Cohort year |
| founder_primary | Text | Yes | John Kipchoge | Primary founder name |
| founder_gender | Text | Yes | Male | Primary founder gender |
| venture_stage | Text | Yes | Early Growth | Current stage |
| months_in_programme | Integer | No | 12 | Months since cohort start |
| business_plan_score | Decimal | No | 85 | Business plan quality score (0-100) |
| prototype_complete | Boolean | Yes | TRUE | Prototype/MVP completed? |
| prototype_iterations | Integer | No | 4 | Iterations completed |
| customer_interviews_count | Integer | No | 25 | Discovery interviews completed |
| pitch_score | Decimal | No | 78 | Pitch score at demo day (0-100) |
| pitching_confidence | Decimal | No | 8 | Founder pitching confidence (0-10) |
| partnerships_active | Integer | No | 2 | Number of active partnerships |
| stakeholder_meetings_documented | Boolean | Yes | TRUE | Documented stakeholder engagement? |
| problem_statement_validated | Boolean | Yes | TRUE | Problem statement validated? |
| go_to_market_documented | Boolean | Yes | TRUE | GTM strategy documented? |
| go_to_market_reviewed | Boolean | Yes | TRUE | GTM strategy reviewed? |
| funding_received_usd | Decimal | No | 50000 | Total funding received |
| funding_type_primary | Text | No | Grant | Primary funding type |
| external_funding_raised_usd | Decimal | No | 0 | External funding raised |
| funding_stage | Text | No | Seed | Seed, Series A, Series B |
| investor_count | Integer | No | 0 | Number of investors |
| revenue_generating | Boolean | No | TRUE | Generating revenue? |
| monthly_revenue_usd | Decimal | No | 5000 | Current monthly revenue |
| monthly_revenue_trend | Text | No | Growing | Stable, Growing, Declining |
| employees_count | Integer | No | 5 | Total employees |
| employees_female | Integer | No | 2 | Female employees |
| employees_youth | Integer | No | 3 | Employees under 35 |
| customers_reached | Integer | No | 2500 | Total customers/patients |
| customer_retention_rate | Decimal | No | 75 | Retention rate (%) |
| countries_operating | Integer | No | 1 | Countries of operation |
| product_market_fit_evidence | Boolean | No | TRUE | Evidence of PMF? |
| user_growth_mom | Decimal | No | 15 | Monthly user growth (%) |
| team_size_change | Integer | No | 2 | Net team change since entry |
| peer_engagement | Boolean | No | TRUE | Engaged in 3+ peer sessions? |
| due_diligence_status | Text | No | Not Started | Not Started, In Progress, Advanced, Completed |
| earned_revenue_percentage | Decimal | No | 80 | % of revenue from earned (non-grant) |
| venture_health_score | Decimal | No | 72 | Overall health score (0-100) |
| success_probability | Decimal | No | 78 | Success probability (0-100) |
| venture_status | Text | Yes | Active | Active, Dormant, Stalled |
| publications_count | Integer | No | 1 | Publications/media features |
| knowledge_contribution | Text | No | Case study published in TechCrunch | Knowledge sharing output |
| reporting_period | Text | Yes | 2026-Q3 | Reporting period |
| notes | Text | No | Strong market traction, preparing Series A | Key notes |
| entered_by | Text | Yes | Cohort Manager | Data entry person |
| entry_date | Date | Yes | 2025-09-20 | Data entry date |

---

## Sheet 7: FURTHER_EDUCATION_OUTCOMES

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| education_record_id | Text | Yes | EDU-2025-0156 | Unique education record ID |
| participant_id | Text | Yes | PART-2023-156 | Participant identifier |
| participant_name | Text | No | Ruth Wanjiku | Participant name |
| gender | Text | Yes | Female | Female, Male, Non-binary |
| country | Text | Yes | Kenya | Country |
| programme | Text | Yes | HEMP | HEMP, HENT, HECO |
| intervention_attended | Text | Yes | SIE | Specific intervention |
| cohort_year | Integer | Yes | 2024 | Cohort year |
| pre_assessment_score | Decimal | No | 62 | Pre-programme assessment score (0-100) |
| post_assessment_score | Decimal | No | 85 | Post-programme assessment score (0-100) |
| knowledge_improvement_pct | Decimal | Calculated | 37 | (post-pre)/pre * 100 |
| financial_literacy_confidence | Decimal | No | 8 | Financial literacy confidence (0-10) |
| financial_literacy_threshold_met | Boolean | Calculated | TRUE | Confidence >= 7? |
| leadership_self_assessment_score | Decimal | No | 72 | Leadership assessment score (0-100) |
| leadership_threshold_met | Boolean | Calculated | TRUE | Score >= 70%? |
| business_knowledge_improvement | Decimal | No | 28 | Business knowledge improvement (%) |
| health_sector_knowledge_improvement | Decimal | No | 35 | Health sector knowledge improvement (%) |
| career_clarity_gained | Boolean | No | TRUE | Gained clarity on career direction? |
| career_goals_clarity | Text | No | Entrepreneurship pathway | Identified career goal |
| employment_interest | Text | No | Enterprise | Employment, Enterprise, Further Study |
| further_study_interest | Boolean | No | FALSE | Interest in further education? |
| further_study_plan | Text | No | N/A | Masters programme or field |
| confidence_score_overall | Decimal | No | 8 | Overall confidence (0-10) |
| skills_gained_count | Integer | No | 5 | Number of skills gained |
| skills_gained_list | Text | No | Business Planning, Market Validation, Financial Management | Skills learned |
| mentorship_quality_rating | Decimal | No | 4.5 | Mentorship quality (0-5) |
| programme_relevance_rating | Decimal | No | 4.3 | Programme relevance (0-5) |
| overall_satisfaction_rating | Decimal | No | 4.2 | Overall satisfaction (0-5) |
| nps_score | Integer | No | 8 | Net Promoter Score (0-10) |
| would_recommend | Boolean | Yes | TRUE | Would recommend programme? |
| engagement_level | Text | No | High | High, Medium, Low |
| completion_status | Text | Yes | Completed | Completed, In-progress, Deferred |
| assessment_date | Date | Yes | 2024-12-15 | Assessment completion date |
| follow_up_date | Date | No | 2025-09-15 | Follow-up assessment date (if applicable) |
| notes | Text | No | Strong improvement, pursuing enterprise pathway | Additional notes |
| entered_by | Text | Yes | M&E Officer | Data entry person |

---

## Sheet 8: RESEARCH_PARTNERSHIPS

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| partnership_id | Text | Yes | RP-001 | Unique partnership ID |
| authority_name | Text | Yes | Rwanda Biomedical Centre | Partner authority name |
| authority_type | Text | Yes | Regional Health Authority | Partner type |
| country | Text | Yes | Rwanda | Partner country |
| year_established | Integer | Yes | 2023 | Year partnership formalized |
| research_theme | Text | Yes | Health Systems Strengthening | Research focus area |
| formal_agreement | Boolean | Yes | TRUE | Formal MOU signed? |
| data_sharing_agreement | Boolean | Yes | TRUE | Data-sharing agreement in place? |
| studies_count | Integer | Yes | 5 | Number of studies undertaken |
| publications_count | Integer | Yes | 4 | Publications produced |
| policy_briefs_count | Integer | Yes | 3 | Policy briefs produced |
| policy_adoptions_count | Integer | Yes | 2 | Policy adoptions influenced |
| active_studies_count | Integer | No | 1 | Currently active studies |
| ongoing_status | Text | Yes | Active | Active, Concluded, Inactive |
| contact_person | Text | No | Dr. Jean Nkurunziza | Primary contact at partner |
| partnership_achievements | Text | No | Evidence informed 2 policy changes | Key achievements |
| revenue_share_arrangement | Boolean | No | FALSE | Any revenue-sharing arrangement? |
| notes | Text | No | Strong partnership, multiple outputs | Additional notes |
| last_updated_date | Date | Yes | 2026-03-15 | Last update date |
| entered_by | Text | Yes | Partnerships Lead | Data entry person |

---

## Sheet 9: RESEARCH_INTERVENTIONS

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| research_id | Text | Yes | RES-2024-012 | Unique research ID |
| research_title | Text | Yes | Health System Strengthening in East Africa | Research title |
| researcher_name | Text | Yes | Dr. Peter Kamau | Lead researcher |
| researcher_gender | Text | Yes | Male | Researcher gender |
| researcher_institution | Text | Yes | Kenyatta National Hospital | Primary institution |
| partner_institution | Text | Yes | Ministry of Health Kenya | Implementation partner |
| research_theme | Text | Yes | Health Systems Strengthening | Thematic area |
| year_started | Integer | Yes | 2024 | Research start year |
| year_completed | Integer | No | 2025 | Research completion year |
| cohort | Text | No | HECO 2024 | Related cohort |
| countries_covered | Text | No | Kenya, Rwanda, Uganda | Geographic scope |
| funding_amount_usd | Decimal | Yes | 45000 | Research funding |
| funding_source | Text | No | CHII | Funding source |
| outputs_count | Integer | Yes | 6 | Total outputs produced |
| publications_count | Integer | Yes | 2 | Peer-reviewed publications |
| policy_briefs_count | Integer | Yes | 1 | Policy briefs produced |
| case_studies_count | Integer | No | 2 | Case studies produced |
| media_features_count | Integer | No | 1 | Media/press features |
| policy_adoptions | Integer | No | 1 | Policy changes influenced |
| beneficiaries_reached | Integer | No | 5000 | Estimated beneficiaries |
| health_outcome_metrics | Text | No | 45% improvement in health facility efficiency | Key health outcomes |
| gender_analysis_included | Boolean | Yes | FALSE | Gender analysis included? |
| equity_focus | Boolean | Yes | FALSE | Equity focus? |
| sustainable_development_goal | Text | No | SDG 3 (Good Health) | Related SDG |
| status | Text | Yes | Completed | Completed, In-Progress, Not Started |
| dissemination_plan | Boolean | No | TRUE | Dissemination plan in place? |
| notes | Text | No | Strong policy relevance, being scaled | Research notes |
| entered_by | Text | Yes | Research Lead | Data entry person |
| entry_date | Date | Yes | 2025-09-15 | Data entry date |

---

## Sheet 10: GESI_TRACKING

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| gesi_record_id | Text | Yes | GESI-2026-0045 | Unique GESI tracking ID |
| record_type | Text | Yes | Intervention | Type: Intervention, Venture, Participant, Activity |
| related_record_id | Text | Yes | INT-20240915-001 | ID of related record |
| reporting_period | Text | Yes | 2026-Q3 | Reporting period |
| total_count | Integer | Yes | 45 | Total participants/records |
| female_count | Integer | Yes | 27 | Female participants/records |
| female_percentage | Decimal | Calculated | 60 | Female % |
| male_count | Integer | Yes | 17 | Male participants/records |
| male_percentage | Decimal | Calculated | 38 | Male % |
| non_binary_count | Integer | No | 1 | Non-binary participants |
| non_binary_percentage | Decimal | Calculated | 2 | Non-binary % |
| youth_count | Integer | No | 22 | Youth (<35) participants |
| youth_percentage | Decimal | Calculated | 49 | Youth % |
| pwd_count | Integer | Yes | 2 | Persons with disability |
| pwd_percentage | Decimal | Calculated | 4 | PWD % |
| idp_refugee_count | Integer | Yes | 3 | IDP/Refugee participants |
| idp_refugee_percentage | Decimal | Calculated | 7 | IDP/Refugee % |
| mission_student_count | Integer | No | 28 | Mission student participants |
| mission_student_percentage | Decimal | Calculated | 62 | Mission student % |
| gesi_integration_level | Text | Yes | High | High, Medium, Low, None |
| gesi_elements_implemented | Text | No | Gender parity discussions, accessibility accommodations | Specific elements |
| gender_responsive_activities | Boolean | Yes | TRUE | Gender-responsive activities? |
| accessibility_accommodations | Boolean | Yes | TRUE | Accessibility accommodations? |
| livelihoods_impact_documented | Text | No | 85% of women report improved livelihoods | Impact documentation |
| safety_concerns_documented | Boolean | No | FALSE | Any safety concerns? |
| safety_notes | Text | No | N/A | Safety-related notes |
| followup_support_provided | Text | No | Mentorship on work-life balance | Support provided |
| gesi_outcome_score | Decimal | No | 8.5 | GESI outcome quality score (0-10) |
| reviewer_name | Text | Yes | GESI Officer | GESI reviewer |
| review_date | Date | Yes | 2026-09-25 | GESI review date |
| notes | Text | No | Exceeded GESI targets, strong gender parity | Reviewer notes |
| entered_by | Text | Yes | GESI Officer | Data entry person |

---

## Sheet 11: FUNDING_TRACKING

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| funding_initiative_id | Text | Yes | FUND-2024-006 | Unique funding initiative ID |
| initiative_name | Text | Yes | CHII Venture Fund Round 2 | Initiative name |
| funding_type | Text | Yes | Grant | Grant, Angel, VC, Revenue-Based |
| funder_name | Text | Yes | British Council | Funder organization |
| funder_country | Text | No | United Kingdom | Funder country |
| year_launched | Integer | Yes | 2024 | Year launched |
| launch_date | Date | Yes | 2024-03-15 | Initiative launch date |
| deadline | Date | No | 2024-12-31 | Application deadline |
| total_fund_amount_usd | Decimal | Yes | 500000 | Total fund size |
| recipients_count | Integer | Yes | 10 | Number of recipients |
| average_per_recipient_usd | Decimal | Calculated | 50000 | Average funding per recipient |
| women_led_recipients_count | Integer | No | 4 | Women-led ventures funded |
| women_led_percentage | Decimal | Calculated | 40 | % women-led |
| sectors_covered | Text | No | Digital Health, Diagnostics, Medical Devices | Sector focus |
| countries_supported | Text | No | Kenya, Rwanda, Uganda | Geographic coverage |
| selection_criteria | Text | No | Business readiness, innovation, market potential | Selection criteria |
| applications_received | Integer | No | 125 | Total applications |
| application_conversion_rate | Decimal | Calculated | 8 | % of applications funded |
| disbursement_status | Text | Yes | Completed | Pending, In-Progress, Completed |
| outcomes_tracking | Boolean | No | TRUE | Outcomes being tracked? |
| fund_performance | Text | No | Portfolio performing above expectations | Fund performance notes |
| notes | Text | No | Highly competitive, strong outcomes | Additional notes |
| entered_by | Text | Yes | Programme Manager | Data entry person |
| entry_date | Date | Yes | 2024-04-01 | Data entry date |

---

## Sheet 12: FELLOWSHIPS_DATA

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| fellow_id | Text | Yes | F01 | Unique fellow ID |
| fellow_name | Text | Yes | Dr. Amina Nkurunziza | Fellow name |
| gender | Text | Yes | Female | Fellow gender |
| cohort_year | Integer | Yes | 2023 | Fellowship cohort year |
| country | Text | Yes | Rwanda | Fellow country |
| institution | Text | Yes | King Faisal Hospital | Fellow institution |
| role_title | Text | Yes | Hospital Director | Role/Position |
| fellowship_start_date | Date | Yes | 2023-01-15 | Fellowship start date |
| fellowship_end_date | Date | No | 2024-01-15 | Fellowship end date |
| operational_funding_usd | Decimal | Yes | 18000 | Operational funding awarded |
| training_hours | Integer | Yes | 96 | Research training hours completed |
| training_topics | Text | No | Research methodology, publication writing | Training focus areas |
| publication_stage_current | Text | Yes | Published | In Progress, Under Review, Published |
| publications_count | Integer | Yes | 2 | Number of publications |
| publication_titles | Text | No | Health System Analysis in East Africa | Publication titles |
| policy_briefs_count | Integer | No | 1 | Policy briefs authored |
| policy_brief_titles | Text | No | Policy recommendations for health equity | Brief titles |
| hackathon_teams_mentored | Integer | Yes | 3 | Hackathon teams mentored |
| mentorship_hours | Integer | Yes | 42 | Total mentorship hours |
| mentees_count | Integer | No | 5 | Number of mentees |
| fellowship_completion_status | Text | Yes | Completed | Completed, In-Progress, Deferred |
| competency_improvement_areas | Text | No | Research design, policy engagement | Improved competencies |
| sustainability_plan | Text | No | Continuing research, training others | Sustainability approach |
| impact_outcome | Text | No | 2 policy briefs influenced ministry decisions | Documented impact |
| sustainability_score | Decimal | No | 8.5 | Sustainability of outcomes (0-10) |
| continued_engagement | Boolean | No | TRUE | Continued engagement with CHII? |
| alumni_network_contribution | Text | No | Mentoring new fellows | Contribution to ecosystem |
| notes | Text | No | Excellent research output, strong policy influence | Reviewer notes |
| follow_up_date | Date | No | 2026-01-15 | Follow-up/post-fellowship date |
| entered_by | Text | Yes | HECO Programme Manager | Data entry person |

---

## Sheet 13: HACKATHONS_DATA

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| hackathon_id | Text | Yes | CH01 | Unique hackathon ID |
| hackathon_name | Text | Yes | CRA Health Systems Hackathon I | Hackathon name |
| year | Integer | Yes | 2023 | Year held |
| country | Text | Yes | Rwanda | Country of venue |
| venue_name | Text | No | King Faisal Hospital | Specific venue |
| event_date_start | Date | Yes | 2023-05-15 | Event start date |
| event_date_end | Date | Yes | 2023-05-17 | Event end date |
| participants_total | Integer | Yes | 52 | Total participants |
| participants_female | Integer | Yes | 23 | Female participants |
| participants_male | Integer | Yes | 28 | Male participants |
| participants_non_binary | Integer | No | 1 | Non-binary participants |
| participants_pwd | Integer | No | 2 | Participants with disabilities |
| participants_youth | Integer | No | 38 | Participants under 35 |
| teams_count | Integer | Yes | 11 | Number of teams |
| average_team_size | Decimal | Calculated | 4.7 | Average participants per team |
| fellow_mentors_count | Integer | Yes | 4 | Number of fellow mentors |
| total_mentorship_hours | Integer | Yes | 68 | Total mentorship hours |
| mentorship_hours_per_team | Decimal | Calculated | 6.2 | Average mentorship per team |
| ventures_incubated | Integer | Yes | 3 | Ventures incubated from hackathon |
| venture_names | Text | No | Venture1, Venture2, Venture3 | Names of incubated ventures |
| ventures_still_active | Integer | Yes | 2 | Ventures still operating |
| ventures_funding_raised_usd | Decimal | No | 85000 | Total funding raised by ventures |
| ventures_jobs_created | Integer | No | 12 | Jobs created by ventures |
| winning_team_name | Text | No | Team Alpha | Winning team |
| winning_team_prize_usd | Decimal | No | 5000 | Prize awarded |
| innovation_quality_score | Decimal | No | 8.5 | Innovation quality (0-10) |
| problem_relevance_score | Decimal | No | 9.2 | Problem relevance (0-10) |
| implementation_feasibility_score | Decimal | No | 7.8 | Implementation feasibility (0-10) |
| participant_satisfaction | Decimal | No | 4.4 | Satisfaction rating (0-5) |
| media_coverage | Boolean | No | TRUE | Media coverage obtained? |
| media_outlets | Text | No | TechCrunch Africa, Local Radio | Media outlets |
| sustainability_efforts | Text | No | Continued incubation support, mentorship | Post-hackathon support |
| notes | Text | No | Excellent participation, strong policy alignment | Event notes |
| entered_by | Text | Yes | HECO Programme Manager | Data entry person |
| entry_date | Date | Yes | 2023-05-30 | Data entry date |

---

## Sheet 14: DATA_QUALITY_FLAGS

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| flag_id | Text | Yes | DQF-001 | Unique flag ID |
| indicator_id | Integer | Yes | 6 | Related indicator (1-57) |
| indicator_code | Text | Yes | INT-06 | Indicator code |
| flagged_status | Boolean | Yes | TRUE | Is this flagged for quality concerns? |
| issue_category | Text | Yes | Attribution Clarity | Category (Attribution, Valuation, Definition, Methodology, Data Gap) |
| issue_description | Text | Yes | Attribution to HENT intervention vs external factors unclear | Detailed issue description |
| severity_level | Text | Yes | Medium | Low, Medium, High, Critical |
| affected_data_elements | Text | No | Funding amount field | Which elements affected |
| impact_assessment | Text | No | Unable to accurately report funding contribution | Impact of issue |
| reviewer_name | Text | Yes | Programme Manager | Person identifying issue |
| reviewer_date | Date | Yes | 2024-09-15 | Date identified |
| suggested_resolution | Text | No | Develop attribution framework, track funding source type | Suggested fix |
| resolution_status | Text | Yes | Open | Open, In Progress, Resolved |
| resolution_date | Date | No | 2025-03-15 | Date resolved |
| standardization_needed | Boolean | Yes | TRUE | Does this need standardization? |
| standardization_note | Text | No | All funding initiatives should track contribution attribution | Standardization requirement |
| data_quality_score_impact | Decimal | No | -15 | % impact on overall data quality score |
| workaround_available | Boolean | Yes | TRUE | Is there a temporary workaround? |
| workaround_description | Text | No | Report gross funding, separately track non-HENT sources | Workaround description |
| priority_for_resolution | Integer | No | 2 | Priority ranking (1=urgent, 5=low) |
| escalation_needed | Boolean | No | FALSE | Escalate to leadership? |
| notes | Text | No | Framework development in progress, target Q4 2025 | Additional notes |

---

## Sheet 15: TREND_ANALYSIS

| Column Name | Data Type | Required | Example | Description |
|---|---|---|---|---|
| trend_record_id | Text | Yes | TREND-INT-01 | Unique trend record ID |
| indicator_id | Integer | Yes | 1 | Related indicator (1-57) |
| indicator_code | Text | Yes | INT-01 | Indicator code |
| indicator_name | Text | Yes | Number of programme interventions delivered per cohort | Indicator name |
| reporting_year | Integer | Yes | 2022 | Reporting year |
| target_value | Decimal | No | 40 | Target for year |
| actual_value | Decimal | Yes | 38 | Actual achievement |
| achievement_percentage | Decimal | Calculated | 95 | (actual/target)*100 |
| yoy_change_value | Decimal | No | 2 | Year-over-year absolute change |
| yoy_change_percentage | Decimal | No | 5.6 | YoY % change |
| trend_direction | Text | Calculated | Up | Up, Stable, Down |
| target_achievement_status | Text | Calculated | Met | Met, Nearly Met, Missed |
| data_quality_notes | Text | No | Data verified by Programme Manager | Quality assurance notes |
| comparison_vs_peers | Text | No | Slightly above regional average | Benchmark comparison |
| contextual_factors | Text | No | Additional cohorts added, extended delivery | Factors affecting performance |
| forecast_next_year | Decimal | No | 45 | Forecast for following year |
| forecast_method | Text | No | Linear trend projection | Forecasting method |
| analysis_notes | Text | No | Consistent growth trajectory, expect to reach 50 by 2026 | Analysis summary |
| entered_by | Text | Yes | M&E Officer | Data entry person |
| analysis_date | Date | Yes | 2023-01-15 | Analysis completion date |

---

## REFERENCE VALUES

### Controlled Drop-down Lists

**Gender**: Female, Male, Non-binary

**Programme**: HEMP, HENT, HECO

**Intervention Types**: Hackathon, Masterclass, Mentorship Program, Funding Initiative, Innovation Challenge, Incubation, Acceleration, Field Study Trip, Research Intervention, HealthX, Internships, Mission, Community Outreach, STEM Clubs

**Countries**: Nigeria, Kenya, Rwanda, Ghana, Ethiopia, Uganda, Tanzania, South Africa, Senegal, Côte d'Ivoire, Zimbabwe, Zambia, Malawi, Mozambique, Cameroon

**Sectors**: Digital Health, Medical Devices, Diagnostics, Health Logistics, Pharma & Biotech, Mental Health, Maternal & Child Health, Health Financing, Community Health, Health Data & AI

**Venture Stages**: Ideation, Validation, Prototype/MVP, Early Growth, Scaling, Investment/Funding

**Employment Types**: Full-time, Part-time, Contract, Freelance, Temporary

**Employment Status**: Employed, Entrepreneur, Further Study, Seeking

**Status Options**: Active, Dormant, Stalled, Completed, Deferred, In-Progress, Dropped

**Institutions**: ALU, ALX, ALCHE, Other

**Funding Types**: Grant, Angel, VC, Revenue-Based, Bootstrapped, None

**Verification Status**: Pending, Verified, Reviewed, Flagged
