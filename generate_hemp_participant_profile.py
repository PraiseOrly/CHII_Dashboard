#!/usr/bin/env python3
"""
Generate HEMP Participant Profile Workbook
Individual participant records across all programmes
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Create workbook
wb = openpyxl.Workbook()
wb.remove(wb.active)

# Define styles
header_fill = PatternFill(start_color="0D9488", end_color="0D9488", fill_type="solid")
header_font = Font(bold=True, color="FFFFFF", size=11)
border = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin')
)

def style_header(sheet, num_cols):
    """Apply styling to header row"""
    for col in range(1, num_cols + 1):
        cell = sheet.cell(row=1, column=col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = border
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

def style_data(sheet, num_rows, num_cols):
    """Apply styling to data rows"""
    for row in range(2, num_rows + 1):
        for col in range(1, num_cols + 1):
            cell = sheet.cell(row=row, column=col)
            cell.border = border
            cell.alignment = Alignment(vertical="center")

# ==================== MISSION STUDENTS ====================
ws = wb.create_sheet("Mission Students", 0)

ms_headers = [
    "Student Name", "Student ID", "Cohort Year", "Country", "Gender",
    "Track", "Completion Status", "GPA",
    "Participated in Internship", "Participated in HealthX", "Created Venture"
]

for col, header in enumerate(ms_headers, 1):
    ws.cell(row=1, column=col, value=header)

ms_data = [
    ["Alice Mbatha", "ms001", 2021, "Rwanda", "Female", "Health Innovation", "Completed", 3.72, "Yes", "Yes", "No"],
    ["Blessing Okafor", "ms002", 2021, "Nigeria", "Male", "Health Management", "Completed", 3.45, "Yes", "No", "Yes"],
    ["Chioma Nwankwo", "ms003", 2021, "Uganda", "Female", "Digital Health", "Active", 3.89, "Yes", "Yes", "No"],
    ["David Kipchoge", "ms004", 2022, "Kenya", "Male", "Health Policy", "Completed", 3.21, "No", "Yes", "No"],
    ["Emma Mwangi", "ms005", 2022, "Kenya", "Female", "Health Innovation", "Completed", 3.56, "Yes", "Yes", "Yes"],
    ["Fatima Hassan", "ms006", 2022, "Tanzania", "Female", "Health Management", "Active", 3.34, "Yes", "No", "No"],
]

for row_idx, row_data in enumerate(ms_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(ms_headers))
style_data(ws, len(ms_data) + 1, len(ms_headers))
for col in range(1, len(ms_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 18

# ==================== CAREER EXPOSURE ====================
ws = wb.create_sheet("Career Exposure", 1)

ce_headers = [
    "Participant Name", "Participant ID", "HealthX Event", "Event Year", "Country",
    "Institution/Organization", "Gender", "Registered for Readiness", "Attended Readiness",
    "Readiness Topic Attended", "Attended Main Exhibition"
]

for col, header in enumerate(ce_headers, 1):
    ws.cell(row=1, column=col, value=header)

ce_data = [
    ["Alice Mbatha", "ce001", "HealthX 2023", 2023, "Rwanda", "University of Rwanda", "Female", "Yes", "Yes", "CV & Portfolio Clinic", "Yes"],
    ["Blessing Okafor", "ce002", "HealthX 2024", 2024, "Rwanda", "IPRC Kigali", "Male", "Yes", "No", "", "Yes"],
    ["David Kipchoge", "ce003", "HealthX 2025", 2025, "Rwanda", "Aston University Rwanda", "Male", "Yes", "Yes", "Interview Preparation", "Yes"],
    ["Emma Mwangi", "ce004", "HealthX 2026", 2026, "Kenya", "KCA University", "Female", "Yes", "Yes", "Career Pathways in Health", "Yes"],
]

for row_idx, row_data in enumerate(ce_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(ce_headers))
style_data(ws, len(ce_data) + 1, len(ce_headers))
for col in range(1, len(ce_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 18

# ==================== INTERNSHIPS ====================
ws = wb.create_sheet("Internships", 2)

int_headers = [
    "Intern Name", "Intern ID", "Year", "Organization", "Department", "Country",
    "Duration (weeks)", "Gender", "IDP/Refugee", "PLWD",
    "Converted to Employment", "Had Mentor"
]

for col, header in enumerate(int_headers, 1):
    ws.cell(row=1, column=col, value=header)

int_data = [
    ["Alice Mbatha", "i001", 2021, "SFH", "Finance Hub", "Rwanda", 8, "Female", "No", "No", "Yes", "Yes"],
    ["Blessing Okafor", "i002", 2021, "CHII Internal", "HEMP", "Rwanda", 10, "Male", "No", "Yes", "Yes", "Yes"],
    ["Chioma Nwankwo", "i003", 2022, "KASHA", "Health Enterprise Operations", "Kenya", 12, "Female", "Yes", "No", "Yes", "Yes"],
    ["David Kipchoge", "i004", 2023, "SFH", "IT and Digital Health", "Kenya", 8, "Male", "Yes", "No", "Yes", "Yes"],
    ["Emma Mwangi", "i005", 2024, "CHII Internal", "HENT", "Kenya", 10, "Female", "No", "Yes", "Yes", "Yes"],
]

for row_idx, row_data in enumerate(int_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(int_headers))
style_data(ws, len(int_data) + 1, len(int_headers))
for col in range(1, len(int_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 18

# ==================== SIE ====================
ws = wb.create_sheet("SIE", 3)

sie_headers = [
    "Participant Name", "Participant ID", "SIE Cohort", "Cohort Year", "Country", "Region",
    "Academic Discipline", "Gender", "PWD", "IDP/Refugee",
    "Virtual Phase Completed", "In-Country Travel", "Full Programme Completed"
]

for col, header in enumerate(sie_headers, 1):
    ws.cell(row=1, column=col, value=header)

sie_data = [
    ["Alice Mbatha", "sie001", "SIE Pilot Cohort", 2024, "Rwanda", "East Africa", "Business & Entrepreneurship", "Female", "No", "No", "Yes", "Yes", "Yes"],
    ["Blessing Okafor", "sie002", "SIE Cohort II", 2025, "Rwanda", "East Africa", "Computer Science", "Male", "No", "Yes", "Yes", "Yes", "Yes"],
    ["Chioma Nwankwo", "sie003", "SIE Cohort III Kenya", 2024, "Kenya", "East Africa", "Engineering", "Female", "Yes", "No", "Yes", "Yes", "Yes"],
    ["David Kipchoge", "sie004", "SIE Cohort IV Ghana", 2025, "Ghana", "West Africa", "Social Sciences", "Male", "No", "No", "Yes", "Yes", "Yes"],
]

for row_idx, row_data in enumerate(sie_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(sie_headers))
style_data(ws, len(sie_data) + 1, len(sie_headers))
for col in range(1, len(sie_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 18

# ==================== COURSES ====================
ws = wb.create_sheet("Courses", 4)

courses_headers = [
    "Student Name", "Student ID", "Cohort Year", "Gender", "Academic Discipline",
    "Completed Virtual Module", "Completed In-Person Module", "Full Course Completed", "Certified"
]

for col, header in enumerate(courses_headers, 1):
    ws.cell(row=1, column=col, value=header)

courses_data = [
    ["Alice Mbatha", "gh001", 2022, "Female", "Business & Entrepreneurship", "Yes", "Yes", "Yes", "Yes"],
    ["Blessing Okafor", "gh002", 2022, "Male", "Computer Science", "Yes", "No", "No", "No"],
    ["Chioma Nwankwo", "gh003", 2023, "Female", "Engineering", "Yes", "Yes", "Yes", "Yes"],
    ["David Kipchoge", "gh004", 2024, "Male", "Social Sciences", "Yes", "Yes", "Yes", "Yes"],
    ["Emma Mwangi", "gh005", 2025, "Female", "International Business & Trade", "Yes", "Yes", "Yes", "Yes"],
]

for row_idx, row_data in enumerate(courses_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(courses_headers))
style_data(ws, len(courses_data) + 1, len(courses_headers))
for col in range(1, len(courses_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 18

# Save workbook
output_path = "HEMP_Participant_Profile.xlsx"
wb.save(output_path)
print(f"✓ Created {output_path}")
print(f"  Sheets: Mission Students, Career Exposure, Internships, SIE, Courses")
