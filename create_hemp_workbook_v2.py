#!/usr/bin/env python3
"""
HEMP Dashboard Workbook Generator - V2
Creates an updated HEMP_Dashboard workbook with Graduated Enrolment Funnel
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Create workbook
wb = openpyxl.Workbook()
wb.remove(wb.active)  # Remove default sheet

# Define styles
HEADER_FILL = PatternFill(start_color="14306B", end_color="14306B", fill_type="solid")
HEADER_FONT = Font(name="Calibri", size=12, bold=True, color="FFFFFF")
SUBHEADER_FILL = PatternFill(start_color="0C447C", end_color="0C447C", fill_type="solid")
SUBHEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
SECTION_FILL = PatternFill(start_color="479BD6", end_color="479BD6", fill_type="solid")
SECTION_FONT = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
DATA_FONT = Font(name="Calibri", size=10)
LABEL_FONT = Font(name="Calibri", size=10, bold=True, color="FF6B7280")
THIN_BORDER = Border(
    left=Side(style='thin', color='D1D5DB'),
    right=Side(style='thin', color='D1D5DB'),
    top=Side(style='thin', color='D1D5DB'),
    bottom=Side(style='thin', color='D1D5DB')
)

def add_sheet(name):
    return wb.create_sheet(name)

def add_header(ws, row, text):
    cell = ws.cell(row, 1, text)
    cell.font = HEADER_FONT
    cell.fill = HEADER_FILL
    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cell.border = THIN_BORDER
    ws.merge_cells(f'A{row}:F{row}')
    ws.row_dimensions[row].height = 25
    return row + 1

def add_subheader(ws, row, text):
    cell = ws.cell(row, 1, text)
    cell.font = SUBHEADER_FONT
    cell.fill = SUBHEADER_FILL
    cell.alignment = Alignment(horizontal="left", vertical="center")
    cell.border = THIN_BORDER
    ws.merge_cells(f'A{row}:F{row}')
    ws.row_dimensions[row].height = 22
    return row + 1

def add_table_row(ws, row, data, is_header=False):
    for col, value in enumerate(data, 1):
        cell = ws.cell(row, col, value)
        cell.font = LABEL_FONT if is_header else DATA_FONT
        cell.fill = SECTION_FILL if is_header else PatternFill(start_color="F3F4F6", end_color="F3F4F6", fill_type="solid")
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        cell.border = THIN_BORDER
    ws.row_dimensions[row].height = 20 if not is_header else 22

# SHEET 1: AT A GLANCE
ws_glance = add_sheet("At a Glance")
ws_glance.column_dimensions['A'].width = 35
ws_glance.column_dimensions['B'].width = 20
ws_glance.column_dimensions['C'].width = 35

row = 1
row = add_header(ws_glance, row, "MISSION STUDENTS OVERVIEW")

add_table_row(ws_glance, row, ["Metric", "Value", "Notes"], is_header=True)
row += 1

mission_data = [
    ["Total Enrolled", "2,450", "Primary KPI"],
    ["Female %", "35%", "Gender breakdown"],
    ["Male %", "65%", "Gender breakdown"],
    ["", "", ""],
    ["PROGRAMMES:", "", ""],
    ["BSE (Software Engineering)", "500", "BSc (Hons) Software Engineering"],
    ["BEL (Entrepreneurial Leadership)", "300", "BSc (Hons) Entrepreneurial Leadership"],
    ["IBT (International Business & Trade)", "40", "ALURW - International Business and Trade"],
    ["", "", ""],
    ["INCLUSION METRICS:", "", ""],
    ["PWD (Persons with Disabilities)", "[To Calculate]", "Persons with Disabilities"],
    ["Refugee Students", "[To Calculate]", "Humanitarian Status"],
    ["Countries Reached", "[Value]", "Geographic distribution"],
]

for data in mission_data:
    add_table_row(ws_glance, row, data)
    row += 1

row += 1
row = add_subheader(ws_glance, row, "PROGRAMME PERFORMANCE SUMMARY")

add_table_row(ws_glance, row, ["Programme", "Participants", "Health Interest %", "Academic Prog %", "Employment Rate", "Status"], is_header=True)
row += 1

programmes = [
    ["Career Development", "[Value]", "Chart Added", "Chart Added", "[Value]", "✓ Updated"],
    ["Exposure Events", "[Value]", "Chart Added", "Chart Added", "[Value]", "✓ Updated"],
    ["Internships", "[Value]", "N/A (Removed)", "Chart Updated", "[Value]", "✓ Updated"],
    ["SIE", "[Value]", "Chart Added", "Chart Updated", "[Value]", "✓ Updated"],
    ["Courses", "[Value]", "N/A (Removed)", "Chart Updated", "[Value]", "✓ Updated"],
]

for prog in programmes:
    add_table_row(ws_glance, row, prog)
    row += 1

# SHEET 2: CAREER DEVELOPMENT
ws_career = add_sheet("Career Development")
ws_career.column_dimensions['A'].width = 35
ws_career.column_dimensions['B'].width = 20
ws_career.column_dimensions['C'].width = 30

row = 1
row = add_header(ws_career, row, "CAREER DEVELOPMENT")

row = add_subheader(ws_career, row, "GROWTH & OUTCOMES - Charts")

add_table_row(ws_career, row, ["Chart Name", "Properties", "Value"], is_header=True)
row += 1

charts_career = [
    ["Participants by Health Interest Area", "Year Filter", "Yes (All Years, 2021-2026)"],
    ["", "YAxis Width", "130px"],
    ["", "Margins", "left: 0, right: 50, top: 6, bottom: 0"],
    ["", "Font Size", "10px"],
    ["", "Layout", "Vertical (layout='vertical')"],
    ["", "", ""],
    ["Participants by Academic Programmes", "Year Filter", "Yes (All Years, 2021-2026)"],
    ["", "YAxis Width", "210px"],
    ["", "Margins", "left: 0, right: 50, top: 6, bottom: 0"],
    ["", "Font Size", "10px"],
    ["", "Layout", "Vertical (layout='vertical')"],
    ["", "Note", "Both charts positioned SIDE-BY-SIDE"],
]

for chart in charts_career:
    add_table_row(ws_career, row, chart)
    row += 1

# SHEET 3: EXPOSURE EVENTS
ws_exposure = add_sheet("Exposure Events")
ws_exposure.column_dimensions['A'].width = 35
ws_exposure.column_dimensions['B'].width = 20
ws_exposure.column_dimensions['C'].width = 30

row = 1
row = add_header(ws_exposure, row, "EXPOSURE EVENTS")

row = add_subheader(ws_exposure, row, "REACH & ENGAGEMENT - Charts (NEW)")

add_table_row(ws_exposure, row, ["Chart Name", "Data Source", "Year Filter"], is_header=True)
row += 1

charts_exposure = [
    ["Participants by Health Interest Area", "Digital Health: 285, Mental Health: 245, etc.", "Yes"],
    ["", "", ""],
    ["Participants by Academic Programmes", "BSE: 312, BEL: 285, IBT: 198", "Yes"],
    ["", "ALCHE variants: 45, Teach-out: 42", ""],
    ["", "", ""],
    ["Layout", "SIDE-BY-SIDE in same row", "Grid: repeat(2, 1fr)"],
]

for chart in charts_exposure:
    add_table_row(ws_exposure, row, chart)
    row += 1

# SHEET 4: INTERNSHIPS
ws_intern = add_sheet("Internships")
ws_intern.column_dimensions['A'].width = 40
ws_intern.column_dimensions['B'].width = 20
ws_intern.column_dimensions['C'].width = 30

row = 1
row = add_header(ws_intern, row, "INTERNSHIPS")

row = add_subheader(ws_intern, row, "CHANGES MADE")

add_table_row(ws_intern, row, ["Item", "Action", "Status"], is_header=True)
row += 1

changes_intern = [
    ["Female Participation Trend", "REMOVED", "✓ Deleted"],
    ["Internship Placements by Programme", "MOVED to Student Feedback", "✓ Relocated"],
    ["Internship Placements Styling", "UPDATE chart styling", "✓ Updated"],
    ["", "", ""],
    ["Chart Styling Updates:", "", ""],
    ["YAxis Width", "Changed from 130px to 210px", "✓ Increased"],
    ["Margins", "Changed to left: 0, right: 50", "✓ Updated"],
    ["Font Size", "Maintained at 10px", "✓ Consistent"],
]

for change in changes_intern:
    add_table_row(ws_intern, row, change)
    row += 1

# SHEET 5: SIE
ws_sie = add_sheet("SIE")
ws_sie.column_dimensions['A'].width = 35
ws_sie.column_dimensions['B'].width = 20
ws_sie.column_dimensions['C'].width = 30

row = 1
row = add_header(ws_sie, row, "SIE (Student Internship Experience)")

row = add_subheader(ws_sie, row, "ENTREPRENEURSHIP PIPELINE - Chart Updates")

add_table_row(ws_sie, row, ["Chart", "Property", "Value"], is_header=True)
row += 1

charts_sie = [
    ["Participants by Health Interest Area", "Year Filter", "Yes (All Years, 2021-2026)"],
    ["", "YAxis Width", "130px"],
    ["", "Margins", "left: 0, right: 14, top: 6, bottom: 0"],
    ["", "Font Size", "10px"],
]

for chart in charts_sie:
    add_table_row(ws_sie, row, chart)
    row += 1

# SHEET 6: COURSES - WITH GRADUATED ENROLMENT FUNNEL
ws_courses = add_sheet("Courses")
ws_courses.column_dimensions['A'].width = 40
ws_courses.column_dimensions['B'].width = 25
ws_courses.column_dimensions['C'].width = 30

row = 1
row = add_header(ws_courses, row, "COURSES - Graduated Enrolment Funnel")

row = add_subheader(ws_courses, row, "COMPLETION JOURNEY TRACKING")

add_table_row(ws_courses, row, ["Metric", "Description", "Status"], is_header=True)
row += 1

completion_journey = [
    ["Enrolled", "Total students starting course", "KPI 1"],
    ["Completed", "Students finishing coursework", "KPI 2"],
    ["Graduated", "Students completing all requirements", "KPI 3"],
    ["", "", ""],
    ["Graduation Rate %", "(Graduated / Enrolled) × 100", "Key Metric"],
    ["Completion Rate %", "(Completed / Enrolled) × 100", "Key Metric"],
    ["", "", ""],
    ["Funnel Visualization", "Stage-by-stage progression", "Chart"],
    ["Filter Options", "Year, Cohort, Programme", "Interactive"],
]

for item in completion_journey:
    add_table_row(ws_courses, row, item)
    row += 1

row += 1
row = add_subheader(ws_courses, row, "CHANGES MADE")

add_table_row(ws_courses, row, ["Item", "Previous", "New", "Status"], is_header=True)
row += 1

changes_courses = [
    ["Certification Metric", "Certified (single metric)", "Graduated Enrolment Funnel", "✓ Replaced"],
    ["Health Interest Chart", "Participants by HI", "REMOVED", "✓ Deleted"],
    ["Chart Type", "Bar chart", "Funnel chart", "✓ New"],
    ["Data Tracked", "Pass/Fail only", "Enrolled → Completed → Graduated", "✓ Enhanced"],
    ["Visualization", "Single point metric", "Three-stage progression", "✓ Improved"],
]

for change in changes_courses:
    add_table_row(ws_courses, row, change)
    row += 1

row += 2
row = add_subheader(ws_courses, row, "CHART SPECIFICATIONS: GRADUATED ENROLMENT FUNNEL")

add_table_row(ws_courses, row, ["Property", "Value", "Notes"], is_header=True)
row += 1

funnel_specs = [
    ["Chart Type", "Funnel Chart", "Three-stage progression"],
    ["Stage 1", "Enrolled", "Total students entering programme"],
    ["Stage 2", "Completed", "Students finishing coursework"],
    ["Stage 3", "Graduated", "Students meeting all requirements"],
    ["", "", ""],
    ["Year Filter", "Yes", "All Years, 2021, 2022, 2023, 2024, 2025, 2026"],
    ["Programme Filter", "Yes", "BSE, BEL, IBT, ALCHE, Teach-out"],
    ["", "", ""],
    ["Primary Colour", "#14306B", "Dark Navy"],
    ["Secondary Colour", "#479BD6", "Light Blue"],
    ["Font Size (Labels)", "10px", "Stage names"],
    ["Font Size (Numbers)", "11px", "Count values"],
    ["Data Labels", "Both Count & %", "Show progression percentage"],
]

for spec in funnel_specs:
    add_table_row(ws_courses, row, spec)
    row += 1

# SHEET 7: DESIGN STANDARDS
ws_standards = add_sheet("Design Standards")
ws_standards.column_dimensions['A'].width = 35
ws_standards.column_dimensions['B'].width = 30
ws_standards.column_dimensions['C'].width = 25

row = 1
row = add_header(ws_standards, row, "DESIGN STANDARDS & SPECIFICATIONS")

row = add_subheader(ws_standards, row, "CHART DIMENSIONS")

add_table_row(ws_standards, row, ["Chart Type", "Property", "Value"], is_header=True)
row += 1

standards = [
    ["Health Interest Charts", "YAxis Width", "130px"],
    ["", "Margins (left)", "0"],
    ["", "Margins (right)", "50"],
    ["", "Font Size", "10px"],
    ["", "", ""],
    ["Academic Programmes Charts", "YAxis Width", "210px"],
    ["", "Margins (left)", "0"],
    ["", "Margins (right)", "50"],
    ["", "Font Size", "10px"],
    ["", "", ""],
    ["Graduated Enrolment Funnel", "Chart Type", "Funnel"],
    ["", "Stages", "3 (Enrolled, Completed, Graduated)"],
    ["", "Data Labels", "Count & Percentage"],
    ["", "Colour", "Brand Blue Gradient"],
]

for std in standards:
    add_table_row(ws_standards, row, std)
    row += 1

# SHEET 8: IMPLEMENTATION CHECKLIST
ws_checklist = add_sheet("Checklist")
ws_checklist.column_dimensions['A'].width = 50
ws_checklist.column_dimensions['B'].width = 15
ws_checklist.column_dimensions['C'].width = 30

row = 1
row = add_header(ws_checklist, row, "IMPLEMENTATION CHECKLIST")

add_table_row(ws_checklist, row, ["Task", "Status", "Notes"], is_header=True)
row += 1

checklist_items = [
    ["Rename sheet 'Overview' → 'At a Glance'", "[ ] To Do", ""],
    ["Add Mission Students Programmes section", "[ ] To Do", "BSE: 500, BEL: 300, IBT: 40"],
    ["Career Dev: Add health interest chart", "[ ] To Do", "Year filter enabled"],
    ["Exposure Events: Add 2 charts side-by-side", "[ ] To Do", "Layout adjustment"],
    ["Internships: Remove Female Participation Trend", "[ ] To Do", "Delete chart"],
    ["Internships: Update chart styling", "[ ] To Do", "YAxis 210px"],
    ["SIE: Add/update health interest chart", "[ ] To Do", "Year filter enabled"],
    ["Courses: Remove health interest chart", "[ ] To Do", "Delete chart"],
    ["Courses: Replace Certified with Graduated Funnel", "[ ] To Do", "NEW - Key update"],
    ["Courses: Create funnel chart (Enrolled→Completed→Graduated)", "[ ] To Do", "Three-stage visualization"],
    ["Courses: Add year and programme filters to funnel", "[ ] To Do", "Interactive features"],
    ["Apply colour standards", "[ ] To Do", "All sheets"],
    ["Apply font standards", "[ ] To Do", "All sheets"],
    ["Test all charts display properly", "[ ] To Do", "QA"],
    ["Verify all year filters functional", "[ ] To Do", "QA"],
    ["Final review", "[ ] To Do", "Sign-off"],
]

for item in checklist_items:
    add_table_row(ws_checklist, row, item)
    row += 1

# Save workbook
output_path = "/Users/user/Documents/CHII_Dashboard/HEMP_Dashboard_Updated.xlsx"
wb.save(output_path)

print(f"✓ Workbook created successfully!")
print(f"✓ Location: {output_path}")
print(f"✓ Sheets created: {len(wb.sheetnames)}")
print(f"✓ Sheet names: {', '.join(wb.sheetnames)}")
print(f"\n✓ KEY UPDATE: Courses sheet now includes Graduated Enrolment Funnel")
print(f"✓ REPLACED: Certified metric → Graduated Enrolment Funnel (3-stage)")
