#!/usr/bin/env python3
"""
Generate HEMP Database Template Excel workbook
Individual-level data collection for all HEMP programmes
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import datetime

# Create workbook
wb = openpyxl.Workbook()
wb.remove(wb.active)  # Remove default sheet

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

mission_headers = [
    "Student Name", "Student ID", "Cohort Year", "Country", "Gender",
    "Track", "Completion Status", "GPA", "Has Internship", "Has HealthX",
    "Venture Created", "Post-Graduation Employment"
]

for col, header in enumerate(mission_headers, 1):
    ws.cell(row=1, column=col, value=header)

# Sample data
mission_data = [
    ["Alice Mbatha", "ms001", 2021, "Rwanda", "Female", "Health Innovation", "Completed", 3.72, "Yes", "Yes", "No", "Employed"],
    ["Blessing Okafor", "ms002", 2021, "Nigeria", "Male", "Health Management", "Completed", 3.45, "Yes", "No", "Yes", "Entrepreneur"],
    ["Chioma Nwankwo", "ms003", 2021, "Uganda", "Female", "Digital Health", "Active", 3.89, "Yes", "Yes", "No", ""],
    ["David Kipchoge", "ms004", 2022, "Kenya", "Male", "Health Policy", "Completed", 3.21, "No", "Yes", "No", "Further Study"],
    ["Emma Mwangi", "ms005", 2022, "Kenya", "Female", "Health Innovation", "Completed", 3.56, "Yes", "Yes", "Yes", "Entrepreneur"],
    ["Fatima Hassan", "ms006", 2022, "Tanzania", "Female", "Health Management", "Active", 3.34, "Yes", "No", "No", ""],
]

for row_idx, row_data in enumerate(mission_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(mission_headers))
style_data(ws, len(mission_data) + 1, len(mission_headers))
for col in range(1, len(mission_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 18

# ==================== CAREER EXPOSURE (HealthX) ====================
ws = wb.create_sheet("Career Exposure", 1)

career_headers = [
    "Participant Name", "Participant ID", "HealthX Event", "Event Year", "Country", "Institution",
    "Registered for Readiness", "Readiness Attended", "Readiness Topic", "Exhibition Attended",
    "Internship Leads", "Employment Leads", "Project Leads", "Leads Converted",
    "Employer Sector Engaged", "Partnership Outcome", "Overall Usefulness (1-5)",
    "Relevance Score (1-5)", "Quality Score (1-5)", "Confidence Score (1-5)",
    "Recommendation Score (0-10)", "Follow-up Status"
]

for col, header in enumerate(career_headers, 1):
    ws.cell(row=1, column=col, value=header)

career_data = [
    ["Alice Mbatha", "ce001", "HealthX 2023", 2023, "Rwanda", "University of Rwanda", "Yes", "Yes", "CV & Portfolio Clinic", "Yes", 1, 0, 0, "Yes", "Health Startups", "New Partnership", 4.2, 4, 4, 4, 8, "Pursuing Internship"],
    ["Blessing Okafor", "ce002", "HealthX 2024", 2024, "Rwanda", "IPRC Kigali", "Yes", "No", "", "Yes", 0, 1, 0, "Yes", "Hospitals & Clinics", "Partnership Renewed", 4.5, 4.5, 4.5, 4.5, 9, "Secured Employment"],
    ["David Kipchoge", "ce003", "HealthX 2025", 2025, "Rwanda", "Aston University Rwanda", "Yes", "Yes", "Interview Preparation", "Yes", 1, 1, 1, "No", "Health Startups", "New Partnership", 4.8, 5, 5, 5, 10, "Pursuing Project"],
    ["Emma Mwangi", "ce004", "HealthX 2026", 2026, "Kenya", "KCA University", "Yes", "Yes", "Career Pathways in Health", "Yes", 2, 0, 0, "Yes", "NGOs & Global Health", "Partnership Renewed", 4.6, 4.5, 4.5, 4.5, 9, "Secured Internship"],
]

for row_idx, row_data in enumerate(career_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(career_headers))
style_data(ws, len(career_data) + 1, len(career_headers))
for col in range(1, len(career_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 16

# ==================== INTERNSHIPS ====================
ws = wb.create_sheet("Internships", 2)

internship_headers = [
    "Intern Name", "Intern ID", "Year", "Organization", "Department", "Country",
    "Duration (weeks)", "Gender", "IDP/Refugee", "PLWD", "Employment Conversion",
    "Overall Satisfaction (1-5)", "Student Feedback (1-5)", "Partner Feedback (1-5)",
    "Had Mentor", "Placements After Internship",
    "Asks Clarifying Questions (1-5)", "Communicates Professionally (1-5)",
    "Meets Deadlines (1-5)", "Works in Teams (1-5)",
    "Health Systems Understanding (1-5)", "Applies to Health Problems (1-5)",
    "Performance vs Non-ALU (1-5)", "Recommendation Score (0-10)", "Likely to Hire (1-5)",
    "Relevance to Career (1-5)", "Overall Quality (1-5)", "Clarity of Role (1-5)",
    "Support & Supervision (1-5)", "Real-World Skill Application (1-5)",
    "Intern Recommendation (0-10)", "Completion Rate (%)"
]

for col, header in enumerate(internship_headers, 1):
    ws.cell(row=1, column=col, value=header)

internship_data = [
    ["Alice Mbatha", "i001", 2021, "SFH", "Finance Hub", "Rwanda", 8, "Female", "No", "No", "Yes", 4.4, 4.3, 4.2, "Yes", 1, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
    ["Blessing Okafor", "i002", 2021, "CHII Internal", "HEMP", "Rwanda", 10, "Male", "No", "Yes", "Yes", 4.6, 4.5, 4.4, "Yes", 2, 5, 5, 5, 5, 4, 5, 5, 9, 5, 5, 5, 5, 5, 5, 9, 100],
    ["Chioma Nwankwo", "i003", 2022, "KASHA", "Health Enterprise Operations", "Kenya", 12, "Female", "Yes", "No", "Yes", 4.5, 4.4, 4.3, "Yes", 2, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
    ["David Kipchoge", "i004", 2023, "SFH", "IT and Digital Health", "Kenya", 8, "Male", "Yes", "No", "Yes", 4.5, 4.4, 4.3, "Yes", 2, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
    ["Emma Mwangi", "i005", 2024, "CHII Internal", "HENT", "Kenya", 10, "Female", "No", "Yes", "Yes", 4.6, 4.5, 4.4, "Yes", 3, 4, 5, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 8, 100],
]

for row_idx, row_data in enumerate(internship_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(internship_headers))
style_data(ws, len(internship_data) + 1, len(internship_headers))
for col in range(1, len(internship_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 14

# ==================== SIE ====================
ws = wb.create_sheet("SIE", 3)

sie_headers = [
    "Participant Name", "Participant ID", "SIE Cohort", "Cohort Year", "Country", "Region",
    "Academic Discipline", "Gender", "Application Status", "Virtual Phase Completed",
    "In-Country Travel", "Full Programme Completed",
    "PWD", "IDP/Refugee",
    "Health System Exposure (1-5)", "Innovation Exposure (1-5)", "Employment Pathways Exposure (1-5)",
    "Relevance (1-5)", "Quality (1-5)", "Usefulness (1-5)", "Confidence (1-5)",
    "NPS Score (0-10)", "Career Clarity Gained", "Employment Leads Generated",
    "Employment Placement Post-SIE", "Internship Placement Post-SIE",
    "Site Visits Attended", "Partner Projects Participated", "Reflection Sessions Attended",
    "Overall Engagement (1-5)", "Learning Outcome Achievement (1-5)", "Notes"
]

for col, header in enumerate(sie_headers, 1):
    ws.cell(row=1, column=col, value=header)

sie_data = [
    ["Alice Mbatha", "sie001", "SIE Pilot Cohort", 2024, "Rwanda", "East Africa", "Business & Entrepreneurship", "Female", "Selected", "Yes", "Yes", "Yes", "No", "No", 4.1, 4.0, 3.7, 4.0, 4.1, 3.9, 4.0, 7.8, "Yes", 1, "Yes", "No", 6, "Yes", 8, 4.2, 4.1, "Excellent engagement"],
    ["Blessing Okafor", "sie002", "SIE Cohort II", 2025, "Rwanda", "East Africa", "Computer Science", "Male", "Selected", "Yes", "Yes", "Yes", "No", "Yes", 4.4, 4.3, 4.0, 4.3, 4.4, 4.2, 4.3, 8.1, "Yes", 2, "Yes", "Yes", 9, "Yes", 12, 4.5, 4.4, "Strong performance"],
    ["Chioma Nwankwo", "sie003", "SIE Cohort III Kenya", 2024, "Kenya", "East Africa", "Engineering", "Female", "Selected", "Yes", "Yes", "Yes", "Yes", "No", 4.2, 4.1, 3.9, 4.1, 4.2, 4.0, 4.1, 8.0, "Yes", 1, "No", "Yes", 7, "Yes", 10, 4.3, 4.2, "Good progress"],
    ["David Kipchoge", "sie004", "SIE Cohort IV Ghana", 2025, "Ghana", "West Africa", "Social Sciences", "Male", "Selected", "Yes", "Yes", "Yes", "No", "No", 4.3, 4.2, 4.0, 4.2, 4.3, 4.1, 4.2, 8.0, "Yes", 2, "Yes", "No", 8, "Yes", 11, 4.4, 4.3, "Engaged learner"],
]

for row_idx, row_data in enumerate(sie_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(sie_headers))
style_data(ws, len(sie_data) + 1, len(sie_headers))
for col in range(1, len(sie_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 15

# ==================== COURSES (Global Health) ====================
ws = wb.create_sheet("Courses", 4)

courses_headers = [
    "Student Name", "Student ID", "Cohort Year", "Gender", "Academic Discipline",
    "Completed Virtual", "Completed In-Person", "Full Course Completed",
    "Assessment Score (%)", "Certified", "Module: Foundations (%)", "Module: Health Systems (%)",
    "Module: Epidemiology (%)", "Module: Health Equity (%)", "Module: Innovation (%)",
    "Overall Satisfaction (1-5)", "Relevance (1-5)", "Quality (1-5)",
    "Usefulness (1-5)", "Confidence Gain (1-5)", "Recommendation (0-10)",
    "Progressed to Venture", "Progressed to Research", "Progressed to Internship",
    "Notes"
]

for col, header in enumerate(courses_headers, 1):
    ws.cell(row=1, column=col, value=header)

courses_data = [
    ["Alice Mbatha", "gh001", 2022, "Female", "Business & Entrepreneurship", "Yes", "Yes", "Yes", 72, "Yes", 97, 88, 74, 81, 76, 4.0, 4, 4, 4, 4, 8, "No", "No", "Yes", "Strong performer"],
    ["Blessing Okafor", "gh002", 2022, "Male", "Computer Science", "Yes", "No", "No", 65, "No", 95, 82, 58, 72, 61, 3.8, 3.5, 3.5, 3.5, 3.5, 7, "No", "No", "No", "Did not complete"],
    ["Chioma Nwankwo", "gh003", 2023, "Female", "Engineering", "Yes", "Yes", "Yes", 78, "Yes", 98, 91, 80, 86, 84, 4.2, 4, 4, 4, 4, 8, "Yes", "No", "No", "Excellent engagement"],
    ["David Kipchoge", "gh004", 2024, "Male", "Social Sciences", "Yes", "Yes", "Yes", 74, "Yes", 99, 93, 82, 88, 86, 4.4, 4.5, 4.5, 4.5, 4.5, 9, "No", "Yes", "Yes", "Very engaged learner"],
    ["Emma Mwangi", "gh005", 2025, "Female", "International Business & Trade", "Yes", "Yes", "Yes", 82, "Yes", 99, 95, 85, 90, 89, 4.5, 4.5, 4.5, 4.5, 4.5, 9, "Yes", "No", "Yes", "Top performer"],
]

for row_idx, row_data in enumerate(courses_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        ws.cell(row=row_idx, column=col_idx, value=value)

style_header(ws, len(courses_headers))
style_data(ws, len(courses_data) + 1, len(courses_headers))
for col in range(1, len(courses_headers) + 1):
    ws.column_dimensions[get_column_letter(col)].width = 14

# Save workbook
output_path = "HEMP_Database_Template.xlsx"
wb.save(output_path)
print(f"✓ Created {output_path}")
print(f"  - Mission Students: {len(mission_data)} records")
print(f"  - Career Exposure: {len(career_data)} records")
print(f"  - Internships: {len(internship_data)} records")
print(f"  - SIE: {len(sie_data)} records")
print(f"  - Courses: {len(courses_data)} records")
