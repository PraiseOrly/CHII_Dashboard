#!/usr/bin/env python3
"""
HEMP Dashboard Workbook Generator
Creates an updated HEMP_Dashboard workbook with all redesigned sheets
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import datetime

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
    """Add a new sheet and return it"""
    return wb.create_sheet(name)

def add_header(ws, row, text):
    """Add a section header"""
    cell = ws.cell(row, 1, text)
    cell.font = HEADER_FONT
    cell.fill = HEADER_FILL
    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cell.border = THIN_BORDER
    ws.merge_cells(f'A{row}:F{row}')
    ws.row_dimensions[row].height = 25
    return row + 1

def add_subheader(ws, row, text):
    """Add a subsection header"""
    cell = ws.cell(row, 1, text)
    cell.font = SUBHEADER_FONT
    cell.fill = SUBHEADER_FILL
    cell.alignment = Alignment(horizontal="left", vertical="center")
    cell.border = THIN_BORDER
    ws.merge_cells(f'A{row}:F{row}')
    ws.row_dimensions[row].height = 22
    return row + 1

def add_table_row(ws, row, data, is_header=False):
    """Add a table row"""
    for col, value in enumerate(data, 1):
        cell = ws.cell(row, col, value)
        cell.font = LABEL_FONT if is_header else DATA_FONT
        cell.fill = SECTION_FILL if is_header else PatternFill(start_color="F3F4F6", end_color="F3F4F6", fill_type="solid")
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        cell.border = THIN_BORDER
    ws.row_dimensions[row].height = 20 if not is_header else 22

# ============================================================================
# SHEET 1: AT A GLANCE
# ============================================================================
ws_glance = add_sheet("At a Glance")
ws_glance.column_dimensions['A'].width = 35
ws_glance.column_dimensions['B'].width = 20
ws_glance.column_dimensions['C'].width = 35

row = 1
row = add_header(ws_glance, row, "MISSION STUDENTS OVERVIEW")

# Mission Students Data
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

# ============================================================================
# SHEET 2: CAREER DEVELOPMENT
# ============================================================================
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

row += 1
row = add_subheader(ws_career, row, "DATA AGGREGATION")

add_table_row(ws_career, row, ["Health Interest Areas", "Count", "Status"], is_header=True)
row += 1

health_interests = [
    ["Digital Health", "[Value]", "Chart displays"],
    ["Mental Health", "[Value]", "Chart displays"],
    ["Maternal & Child Health", "[Value]", "Chart displays"],
    ["Infectious Diseases", "[Value]", "Chart displays"],
    ["Non-Communicable Diseases", "[Value]", "Chart displays"],
    ["Health Systems", "[Value]", "Chart displays"],
]

for hi in health_interests:
    add_table_row(ws_career, row, hi)
    row += 1

# ============================================================================
# SHEET 3: EXPOSURE EVENTS
# ============================================================================
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

# ============================================================================
# SHEET 4: INTERNSHIPS
# ============================================================================
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
    ["Font Weight", "Updated to 500", "✓ Updated"],
    ["", "", ""],
    ["Placement Data by Programme:", "", ""],
    ["BSc Software Engineering", "95 placements", "Included"],
    ["BSc Entrepreneurial Leadership", "92 placements", "Included"],
    ["ALURW - IBT", "38 placements", "Included"],
    ["ALCHE Variants", "6 placements", "Included"],
    ["Teach-out Variants", "9 placements", "Included"],
]

for change in changes_intern:
    add_table_row(ws_intern, row, change)
    row += 1

# ============================================================================
# SHEET 5: SIE
# ============================================================================
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
    ["", "Colour - Primary", "#122B5E"],
    ["", "Colour - Secondary", "#9FB4E0"],
    ["", "Status", "✓ Added/Updated"],
]

for chart in charts_sie:
    add_table_row(ws_sie, row, chart)
    row += 1

# ============================================================================
# SHEET 6: COURSES
# ============================================================================
ws_courses = add_sheet("Courses")
ws_courses.column_dimensions['A'].width = 40
ws_courses.column_dimensions['B'].width = 20
ws_courses.column_dimensions['C'].width = 30

row = 1
row = add_header(ws_courses, row, "COURSES")

row = add_subheader(ws_courses, row, "CHANGES MADE")

add_table_row(ws_courses, row, ["Item", "Action", "Status"], is_header=True)
row += 1

changes_courses = [
    ["Participants by Health Interest Area", "REMOVED", "✓ Deleted"],
    ["Reason", "Streamline course-specific focus", "Chart simplified"],
    ["", "", ""],
    ["Remaining Sections:", "", ""],
    ["Enrolment & Outcomes", "Active - focus on programmes", "✓ Updated"],
    ["Academic Performance", "Maintained", "✓ Keep"],
    ["Student Feedback", "Maintained", "✓ Keep"],
    ["", "", ""],
    ["Note:", "All other course charts remain unchanged", ""],
]

for change in changes_courses:
    add_table_row(ws_courses, row, change)
    row += 1

# ============================================================================
# SHEET 7: DESIGN STANDARDS
# ============================================================================
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
    ["", "Margins (top)", "6"],
    ["", "Margins (bottom)", "0"],
    ["", "Font Size", "10px"],
    ["", "", ""],
    ["Academic Programmes Charts", "YAxis Width", "210px"],
    ["", "Margins (left)", "0"],
    ["", "Margins (right)", "50"],
    ["", "Margins (top)", "6"],
    ["", "Margins (bottom)", "0"],
    ["", "Font Size", "10px"],
    ["", "Note", "210px accommodates full names"],
]

for std in standards:
    add_table_row(ws_standards, row, std)
    row += 1

row += 1
row = add_subheader(ws_standards, row, "COLOUR PALETTE")

add_table_row(ws_standards, row, ["Element", "Hex Code", "Description"], is_header=True)
row += 1

colours = [
    ["Primary Brand", "#14306B", "Dark Navy Blue"],
    ["Secondary Brand", "#0C447C", "Darker Navy"],
    ["Accent", "#479BD6", "Light Blue"],
    ["Health Interest Primary", "#122B5E", "Deep Navy"],
    ["Health Interest Secondary", "#9FB4E0", "Light Blue"],
    ["Text Primary", "#6B7280", "Dark Grey"],
    ["Text Secondary", "#9CA3AF", "Medium Grey"],
    ["Border", "#D1D5DB", "Light Grey"],
    ["Background", "#F3F4F6", "Very Light Grey"],
]

for colour in colours:
    add_table_row(ws_standards, row, colour)
    row += 1

row += 1
row = add_subheader(ws_standards, row, "FONT STANDARDS")

add_table_row(ws_standards, row, ["Element", "Size", "Weight", "Usage"], is_header=True)
row += 1

fonts = [
    ["Chart Labels", "10px", "600", "Programme/Area names"],
    ["Percentages", "9px", "600", "Gender %, values"],
    ["Programme Text", "8px", "600", "BSE, BEL, IBT breakdown"],
    ["Headers", "12px", "700", "Section headers"],
    ["Subheaders", "11px", "700", "Subsection headers"],
]

for font in fonts:
    add_table_row(ws_standards, row, font)
    row += 1

row += 1
row = add_subheader(ws_standards, row, "FILTERING STANDARDS")

add_table_row(ws_standards, row, ["Chart Type", "Filter Available", "Options"], is_header=True)
row += 1

filters = [
    ["Health Interest", "Yes", "All Years, 2021, 2022, 2023, 2024, 2025, 2026"],
    ["Academic Programmes", "Yes", "All Years, 2021, 2022, 2023, 2024, 2025, 2026"],
    ["Default", "All Years", "Always start with complete dataset"],
]

for filt in filters:
    add_table_row(ws_standards, row, filt)
    row += 1

# ============================================================================
# SHEET 8: IMPLEMENTATION CHECKLIST
# ============================================================================
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
    ["Career Dev: Rename charts", "[ ] To Do", "Match new naming conventions"],
    ["Career Dev: Add health interest chart", "[ ] To Do", "Year filter enabled"],
    ["Career Dev: Position charts side-by-side", "[ ] To Do", "Same row layout"],
    ["Career Dev: Apply new styling", "[ ] To Do", "Dimensions and colours"],
    ["Exposure Events: Add health interest chart", "[ ] To Do", "Year filter enabled"],
    ["Exposure Events: Add academic programmes chart", "[ ] To Do", "Year filter enabled"],
    ["Exposure Events: Position side-by-side", "[ ] To Do", "Same row layout"],
    ["Internships: Remove Female Participation Trend", "[ ] To Do", "Delete chart"],
    ["Internships: Move Placements chart", "[ ] To Do", "Move to Student Feedback section"],
    ["Internships: Update chart styling", "[ ] To Do", "YAxis 210px, new margins"],
    ["SIE: Add/update health interest chart", "[ ] To Do", "Year filter enabled"],
    ["SIE: Apply styling", "[ ] To Do", "YAxis 130px, new margins"],
    ["Courses: Remove health interest chart", "[ ] To Do", "Delete chart"],
    ["Apply colour standards", "[ ] To Do", "All sheets"],
    ["Apply font standards", "[ ] To Do", "All sheets"],
    ["Verify year filters functional", "[ ] To Do", "Test each chart"],
    ["Test chart display", "[ ] To Do", "Check dimensions, readability"],
    ["Final review", "[ ] To Do", "Ensure all updates applied"],
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
