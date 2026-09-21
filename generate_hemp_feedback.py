#!/usr/bin/env python3
"""
Generate HEMP Feedback Workbook
Feedback, assessments, and learning outcomes across all programmes
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Create workbook
wb = openpyxl.Workbook()
wb.remove(wb.active)

# Define styles
header_fill = PatternFill(start_color="7C3AED", end_color="7C3AED", fill_type="solid")
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

# ==================== MISSION STUDENTS FEEDBACK ====================
ws = wb.create_sheet("Mission Students Feedback", 0)

ms_feedback_headers = [
    "Student Name", "Student ID", "Cohort Year",
    "Post-Graduation Employment Status", "Employment Sector",
    "Date of Employment", "Notes"
]

for col, header in enumerate(ms_feedback_headers, 1):
    ws.cell(row=1, column=col, value=header)

ms_feedback_data = [
    ["Alice Mbatha", "ms001", 2021, "Employed", "Health Startups", "2021-06", "Working in digital health"],
    ["Blessing Okafor", "ms002", 2021, "Entrepreneur", "Self-employed", "2021-09", "Launched health venture"],
    ["Chioma Nwankwo", "ms003", 2021, "", "", "", "Still studying"],
    ["David Kipchoge", "ms004", 2022, "Further Study", "University", "2022-08", "Pursuing Master's"],
    ["Emma Mwangi", "ms005", 2022, "Entrepreneur", "Self-employed", "2022-11", "Co-founded startup"],
    ["Fatima Hassan", "ms006", 2022, "", "", "", "Actively seeking"],
]

for row_idx, row_data in enumerate(ms_feedback_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(ms_feedback_headers))
style_data(ws, len(ms_feedback_data) + 1, len(ms_feedback_headers))
for col in range(1, len(ms_feedback_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 18

# ==================== CAREER EXPOSURE FEEDBACK ====================
ws = wb.create_sheet("Career Exposure Feedback", 1)

ce_feedback_headers = [
    "Participant Name", "Participant ID", "HealthX Event",
    "Internship Leads Generated", "Employment Leads Generated", "Project Leads Generated",
    "Any Leads Converted", "Employer Sector Engaged", "Partnership Outcome",
    "Overall Usefulness (1-5)", "Relevance Score (1-5)", "Quality Score (1-5)",
    "Confidence Score (1-5)", "Recommendation Score (0-10)", "Would Recommend"
]

for col, header in enumerate(ce_feedback_headers, 1):
    ws.cell(row=1, column=col, value=header)

ce_feedback_data = [
    ["Alice Mbatha", "ce001", "HealthX 2023", 1, 0, 0, "Yes", "Health Startups", "New Partnership", 4.2, 4, 4, 4, 8, "Yes"],
    ["Blessing Okafor", "ce002", "HealthX 2024", 0, 1, 0, "Yes", "Hospitals & Clinics", "Partnership Renewed", 4.5, 4.5, 4.5, 4.5, 9, "Yes"],
    ["David Kipchoge", "ce003", "HealthX 2025", 1, 1, 1, "No", "Health Startups", "New Partnership", 4.8, 5, 5, 5, 10, "Yes"],
    ["Emma Mwangi", "ce004", "HealthX 2026", 2, 0, 0, "Yes", "NGOs & Global Health", "Partnership Renewed", 4.6, 4.5, 4.5, 4.5, 9, "Yes"],
]

for row_idx, row_data in enumerate(ce_feedback_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(ce_feedback_headers))
style_data(ws, len(ce_feedback_data) + 1, len(ce_feedback_headers))
for col in range(1, len(ce_feedback_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 16

# ==================== INTERNSHIPS FEEDBACK ====================
ws = wb.create_sheet("Internships Feedback", 2)

int_feedback_headers = [
    "Intern Name", "Intern ID", "Organization", "Year",
    "Overall Satisfaction (1-5)", "Student Feedback Score (1-5)", "Partner Feedback Score (1-5)",
    "Asks Clarifying Qs (1-5)", "Communicates Professionally (1-5)", "Meets Deadlines (1-5)",
    "Works in Teams (1-5)", "Health Systems Understanding (1-5)", "Applies to Health (1-5)",
    "Performance vs Non-ALU (1-5)", "Employer Recommendation (0-10)", "Likely to Hire (1-5)",
    "Relevance to Career (1-5)", "Internship Quality (1-5)", "Clarity of Role (1-5)",
    "Support & Supervision (1-5)", "Real-World Skills (1-5)", "Intern Recommendation (0-10)",
    "Completion Rate (%)"
]

for col, header in enumerate(int_feedback_headers, 1):
    ws.cell(row=1, column=col, value=header)

int_feedback_data = [
    ["Alice Mbatha", "i001", "SFH", 2021, 4.4, 4.3, 4.2, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
    ["Blessing Okafor", "i002", "CHII Internal", 2021, 4.6, 4.5, 4.4, 5, 5, 5, 5, 4, 5, 5, 9, 5, 5, 5, 5, 5, 5, 9, 100],
    ["Chioma Nwankwo", "i003", "KASHA", 2022, 4.5, 4.4, 4.3, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
    ["David Kipchoge", "i004", "SFH", 2023, 4.5, 4.4, 4.3, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
    ["Emma Mwangi", "i005", "CHII Internal", 2024, 4.6, 4.5, 4.4, 4, 5, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
]

for row_idx, row_data in enumerate(int_feedback_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(int_feedback_headers))
style_data(ws, len(int_feedback_data) + 1, len(int_feedback_headers))
for col in range(1, len(int_feedback_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 14

# ==================== SIE FEEDBACK ====================
ws = wb.create_sheet("SIE Feedback", 3)

sie_feedback_headers = [
    "Participant Name", "Participant ID", "SIE Cohort",
    "Health System Exposure (1-5)", "Innovation Exposure (1-5)", "Employment Exposure (1-5)",
    "Relevance (1-5)", "Quality (1-5)", "Usefulness (1-5)", "Confidence (1-5)",
    "NPS Score (0-10)", "Career Clarity Gained", "Employment Leads Generated",
    "Site Visits Attended", "Partner Projects Participated", "Reflection Sessions",
    "Employment Placement Post-SIE", "Internship Placement Post-SIE",
    "Overall Engagement (1-5)", "Learning Outcomes (1-5)"
]

for col, header in enumerate(sie_feedback_headers, 1):
    ws.cell(row=1, column=col, value=header)

sie_feedback_data = [
    ["Alice Mbatha", "sie001", "SIE Pilot Cohort", 4.1, 4.0, 3.7, 4.0, 4.1, 3.9, 4.0, 7.8, "Yes", 1, 6, "Yes", 8, "Yes", "No", 4.2, 4.1],
    ["Blessing Okafor", "sie002", "SIE Cohort II", 4.4, 4.3, 4.0, 4.3, 4.4, 4.2, 4.3, 8.1, "Yes", 2, 9, "Yes", 12, "Yes", "Yes", 4.5, 4.4],
    ["Chioma Nwankwo", "sie003", "SIE Cohort III Kenya", 4.2, 4.1, 3.9, 4.1, 4.2, 4.0, 4.1, 8.0, "Yes", 1, 7, "Yes", 10, "No", "Yes", 4.3, 4.2],
    ["David Kipchoge", "sie004", "SIE Cohort IV Ghana", 4.3, 4.2, 4.0, 4.2, 4.3, 4.1, 4.2, 8.0, "Yes", 2, 8, "Yes", 11, "Yes", "No", 4.4, 4.3],
]

for row_idx, row_data in enumerate(sie_feedback_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(sie_feedback_headers))
style_data(ws, len(sie_feedback_data) + 1, len(sie_feedback_headers))
for col in range(1, len(sie_feedback_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 15

# ==================== COURSES FEEDBACK ====================
ws = wb.create_sheet("Courses Feedback", 4)

courses_feedback_headers = [
    "Student Name", "Student ID", "Cohort Year",
    "Assessment Score (%)", "Certified", "Foundations Module (%)", "Health Systems Module (%)",
    "Epidemiology Module (%)", "Health Equity Module (%)", "Innovation Module (%)",
    "Overall Satisfaction (1-5)", "Relevance (1-5)", "Quality (1-5)",
    "Usefulness (1-5)", "Confidence Gain (1-5)", "Recommendation (0-10)",
    "Progressed to Venture", "Progressed to Research", "Progressed to Internship"
]

for col, header in enumerate(courses_feedback_headers, 1):
    ws.cell(row=1, column=col, value=header)

courses_feedback_data = [
    ["Alice Mbatha", "gh001", 2022, 72, "Yes", 97, 88, 74, 81, 76, 4.0, 4, 4, 4, 4, 8, "No", "No", "Yes"],
    ["Blessing Okafor", "gh002", 2022, 65, "No", 95, 82, 58, 72, 61, 3.8, 3.5, 3.5, 3.5, 3.5, 7, "No", "No", "No"],
    ["Chioma Nwankwo", "gh003", 2023, 78, "Yes", 98, 91, 80, 86, 84, 4.2, 4, 4, 4, 4, 8, "Yes", "No", "No"],
    ["David Kipchoge", "gh004", 2024, 74, "Yes", 99, 93, 82, 88, 86, 4.4, 4.5, 4.5, 4.5, 4.5, 9, "No", "Yes", "Yes"],
    ["Emma Mwangi", "gh005", 2025, 82, "Yes", 99, 95, 85, 90, 89, 4.5, 4.5, 4.5, 4.5, 4.5, 9, "Yes", "No", "Yes"],
]

for row_idx, row_data in enumerate(courses_feedback_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(courses_feedback_headers))
style_data(ws, len(courses_feedback_data) + 1, len(courses_feedback_headers))
for col in range(1, len(courses_feedback_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 14

# Save workbook
output_path = "HEMP_Feedback.xlsx"
wb.save(output_path)
print(f"✓ Created {output_path}")
print(f"  Sheets: Mission Students Feedback, Career Exposure Feedback, Internships Feedback, SIE Feedback, Courses Feedback")
