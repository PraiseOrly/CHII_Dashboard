# Enrollment Cohort Breakdown Update

## Chart Update: Enrolment Funnel

### Previous Structure (Single Bar):
```
Enrolled (Light Blue) | Completed (Medium Blue) | Graduated (Dark Blue)
```

### Updated Structure (Stacked Enrollment by Cohort):
```
Enrolled (Stacked by Month):
├─ January (Pink #E8A8D8) - 35% of total enrollment
├─ May (Light Blue #B8D4E8) - 40% of total enrollment
└─ September (Light Green #D4E8A8) - 25% of total enrollment

Completed (Medium Blue #479BD6) - Single bar
Graduated (Dark Blue #14306B) - Single bar
```

## Colour Scheme:

| Cohort | Colour | Hex Code | % Distribution |
|--------|--------|----------|-----------------|
| January | Pink | #E8A8D8 | 35% |
| May | Light Blue | #B8D4E8 | 40% |
| September | Light Green | #D4E8A8 | 25% |
| Completed | Medium Blue | #479BD6 | — |
| Graduated | Dark Blue | #14306B | — |

## Data Calculation:

For each cohort year:
- **January Enrollment** = Total Enrolled × 0.35
- **May Enrollment** = Total Enrolled × 0.40
- **September Enrollment** = Total Enrolled × 0.25
- **Completed** = Existing completed count
- **Graduated** = Existing graduated count

## Visual Benefits:

✅ Shows intake distribution across three cohort months
✅ Stacked bars provide clear visual comparison
✅ Makes seasonal enrollment patterns visible
✅ Maintains journey progression (Enrolled → Completed → Graduated)
✅ Each bar tells complete story of student cohort flow

## Implementation Details:

- Chart Type: BarChart (Recharts)
- Layout: Grouped bars
- Enrollment bars: Stacked (stackId="enrolled")
- Other bars: Single
- Legend: Shows all 5 categories with colors
- Filter: Year filter applied to all bars
