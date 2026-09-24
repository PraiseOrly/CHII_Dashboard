# HEMP Dashboard Redesign - Sheet Structure & Content

## SHEET NAMES (Rename in Excel)
1. **At a Glance** (formerly Overview)
2. **Career Development**
3. **Exposure Events**
4. **Internships**
5. **SIE**
6. **Courses**

---

## SHEET 1: AT A GLANCE

### Section: Mission Students Overview
| Metric | Value | Notes |
|--------|-------|-------|
| Total Enrolled | 2,450 | Primary KPI |
| Female % | 35% | Gender breakdown |
| Male % | 65% | Gender breakdown |
| **Programmes:** | | |
| BSE (Software Engineering) | 500 | BSc (Hons) Software Engineering |
| BEL (Entrepreneurial Leadership) | 300 | BSc (Hons) Entrepreneurial Leadership |
| IBT (International Business & Trade) | 40 | ALURW - International Business and Trade |
| **Inclusion Metrics:** | | |
| PWD (Persons with Disabilities) | [To be calculated] | |
| Refugee Students | [To be calculated] | |
| Countries Reached | [Value] | Geographic distribution |

### Section: Programme Performance Summary
| Programme | Participants | Health Interest % | Academic Prog % | Employment Rate |
|-----------|-------------|------------------|-----------------|-----------------|
| Career Development | [Value] | Chart Added | Chart Added | [Value] |
| Exposure Events | [Value] | Chart Added | Chart Added | [Value] |
| Internships | [Value] | Chart Updated | Chart Updated | [Value] |
| SIE | [Value] | Chart Added | Chart Updated | [Value] |
| Courses | [Value] | Chart Removed | Chart Updated | [Value] |

### Visual Notes
- Mission Students card displays on overview with programme breakdown
- All programme numbers should sum to Total Enrolled (2,450)
- Update quarterly with latest data

---

## SHEET 2: CAREER DEVELOPMENT

### Section Headers to Update
- ✅ "Participants by Academic Programmes" (renamed from "Academic Programmes")
- ✅ "Participants by Health Interest Area" (new chart)
- ✅ Both charts positioned side-by-side in same row

### Chart Specifications

#### Chart: Participants by Health Interest Area
| Property | Value |
|----------|-------|
| Data Source | Health interest aggregation by year |
| Year Filter | Yes (All Years, 2021, 2022, 2023, 2024, 2025, 2026) |
| YAxis Width | 130px |
| Margins | left: 0, right: 50, top: 6, bottom: 0 |
| Font Size | 10px |
| Bar Layout | Vertical (layout="vertical") |
| Colour | #122B5E (primary), #9FB4E0 (secondary) |

#### Chart: Participants by Academic Programmes
| Property | Value |
|----------|-------|
| Data Source | Programme aggregation (BSE, BEL, IBT, ALCHE, Teach-out variants) |
| Year Filter | Yes (All Years, 2021, 2022, 2023, 2024, 2025, 2026) |
| YAxis Width | 210px |
| Margins | left: 0, right: 50, top: 6, bottom: 0 |
| Font Size | 10px |
| Bar Layout | Vertical (layout="vertical") |
| Colour | #14306B (primary), #479BD6 (secondary) |

### Section Structure
```
CAREER DEVELOPMENT OVERVIEW
├── KPI Cards (Total Participants, Female %, Completion Rate, etc.)
├── GROWTH & OUTCOMES
│   ├── Chart: Participants by Health Interest Area [Year Filter]
│   └── Chart: Participants by Academic Programmes [Year Filter]
├── SKILLS & LEARNING
│   └── [Existing charts]
└── QUALITY & FEEDBACK
    └── [Existing charts]
```

---

## SHEET 3: EXPOSURE EVENTS

### Section Headers to Update
- ✅ "Participants by Health Interest Area" (new addition)
- ✅ "Participants by Academic Programmes" (new addition)
- ✅ Both charts positioned side-by-side in Reach & Engagement section

### Chart Specifications (Same as Career Development)

#### Chart: Participants by Health Interest Area
| Property | Value |
|----------|-------|
| Data Source | Digital Health, Mental Health, Maternal & Child Health, etc. |
| Count | 285, 245, 220, 198, 165, 142, 105 |
| Year Filter | Yes |
| YAxis Width | 130px |
| Margins | left: 0, right: 50, top: 6, bottom: 0 |

#### Chart: Participants by Academic Programmes
| Property | Value |
|----------|-------|
| Data Source | BSE: 312, BEL: 285, IBT: 198, ALCHE variants: 45, Teach-out: 42 |
| Year Filter | Yes |
| YAxis Width | 210px |
| Margins | left: 0, right: 50, top: 6, bottom: 0 |

### Section Structure
```
EXPOSURE EVENTS OVERVIEW
├── KPI Cards
├── REACH & ENGAGEMENT
│   ├── Chart: Participants by Health Interest Area [Year Filter]
│   └── Chart: Participants by Academic Programmes [Year Filter]
├── EVENT ANALYTICS
│   └── [Existing charts]
└── FEEDBACK & SATISFACTION
    └── [Existing charts]
```

---

## SHEET 4: INTERNSHIPS

### Removed Charts
- ❌ "Female Participation Trend" - REMOVED
- ❌ Old "Internship Placements by Programme" (old location) - MOVED

### Section Headers to Update
- ✅ Quality & Placements → Internship Placements moved to Student Feedback
- ✅ "Internship Placements by Programme" styling updated

### Chart Specifications

#### Chart: Internship Placements by Programme
| Property | Value |
|----------|-------|
| Data Source | Placements by programme (BSE: 95, BEL: 92, IBT: 38, ALCHE: 6, Teach-out: 9) |
| Location | Student Feedback section (expandable) |
| YAxis Width | 210px |
| Margins | left: 0, right: 50, top: 6, bottom: 0 |
| Font Size | 10px |
| Font Weight | 500 |
| Styling | Matches "Participants by Academic Programmes" |

### Section Structure
```
INTERNSHIPS OVERVIEW
├── KPI Cards (Total Participants, Female %, Employment Conversions, etc.)
├── PLACEMENTS & OUTCOMES
│   ├── Chart: [Existing placement charts]
│   └── [Other charts]
├── QUALITY & PLACEMENTS
│   └── [Employer feedback charts]
│       ├── Skills Assessment
│       ├── Health Sector Readiness
│       └── Employer Recommendation & Hiring
└── STUDENT FEEDBACK (Expandable)
    ├── Chart: Internship Placements by Programme [WITH STYLING UPDATE]
    ├── Student Satisfaction Trends
    └── [Other feedback charts]
```

---

## SHEET 5: SIE

### Section Headers to Update
- ✅ "Participants by Health Interest Area" (added/updated)
- ✅ Chart styling and filtering standardized

### Chart Specifications

#### Chart: Participants by Health Interest Area
| Property | Value |
|----------|-------|
| Year Filter | Yes (All Years, 2021, 2022, 2023, 2024, 2025, 2026) |
| YAxis Width | 130px |
| Margins | left: 0, right: 14, top: 6, bottom: 0 |
| Font Size | 10px |
| Colour | #122B5E (primary), #9FB4E0 (secondary) |

### Section Structure
```
SIE OVERVIEW
├── KPI Cards
├── ENTREPRENEURSHIP PIPELINE
│   ├── Chart: Participants by Health Interest Area [Year Filter]
│   ├── Chart: Ventures Created
│   └── [Other pipeline charts]
├── VENTURE PERFORMANCE
│   └── [Existing charts]
└── FEEDBACK & LEARNING
    └── [Existing charts]
```

---

## SHEET 6: COURSES

### Removed Charts
- ❌ "Participants by Health Interest Area" - REMOVED from this page
- ✅ Keep: All other course-specific charts

### Section Headers to Update
- ✅ Enrolment & Outcomes section simplified (health interest chart removed)
- ✅ Focus maintained on course completion and academic outcomes

### Section Structure
```
COURSES OVERVIEW
├── KPI Cards (Total Enrolment, Completion Rate, Female %, etc.)
├── ENROLMENT & OUTCOMES
│   ├── Chart: Course Enrolment by Programme
│   ├── Chart: Participants by Academic Programmes [if applicable]
│   └── Chart: Completion Trends
├── ACADEMIC PERFORMANCE
│   └── [Existing charts]
└── STUDENT FEEDBACK
    └── [Existing charts]
```

---

## DESIGN STANDARDS (Apply Across All Sheets)

### Chart Dimensions
```
Health Interest Charts:
- YAxis Width: 130px
- Margins: { left: 0, right: 50, top: 6, bottom: 0 }
- Font Size: 10px

Academic Programmes Charts:
- YAxis Width: 210px (accommodates full programme names)
- Margins: { left: 0, right: 50, top: 6, bottom: 0 }
- Font Size: 10px
```

### Colour Palette
```
Primary Brand: #14306B (Dark Navy Blue)
Secondary: #0C447C
Accent: #479BD6 (Light Blue)
Health Interest: #122B5E with #9FB4E0 secondary
```

### Font Standards
```
Chart Labels: 10px, weight 600
Percentages/Numbers: 9px, weight 600
Programme Text: 8px, weight 600
```

### Year Filtering
- Applied to: Health Interest charts, Academic Programmes charts
- Options: "All Years", "2021", "2022", "2023", "2024", "2025", "2026"
- Default: "All Years"

---

## SUMMARY OF CHANGES BY SHEET

| Sheet | Changes | Action |
|-------|---------|--------|
| At a Glance | NEW: Mission Students with programmes (BSE/BEL/IBT) | ADD |
| Career Development | RENAME charts, ADD health interest, UPDATE styling | MODIFY |
| Exposure Events | ADD 2 charts (health interest + academic), side-by-side layout | ADD |
| Internships | REMOVE Female Participation Trend, MOVE/UPDATE chart styling | MODIFY/REMOVE |
| SIE | ADD/UPDATE health interest chart with filtering | ADD/MODIFY |
| Courses | REMOVE health interest chart | REMOVE |

---

## IMPLEMENTATION CHECKLIST

- [ ] Rename sheet "Overview" → "At a Glance"
- [ ] Add Mission Students Programmes section (BSE: 500, BEL: 300, IBT: 40)
- [ ] Career Development: Rename and add charts
- [ ] Career Development: Apply new chart styling
- [ ] Exposure Events: Add 2 new charts with year filter
- [ ] Internships: Remove Female Participation Trend
- [ ] Internships: Update Internship Placements chart styling (YAxis 210px)
- [ ] SIE: Add/update health interest chart
- [ ] Courses: Remove health interest chart
- [ ] Apply colour standards across all sheets
- [ ] Apply font standards across all sheets
- [ ] Verify all year filters are functional
- [ ] Test that all charts display properly with new dimensions
