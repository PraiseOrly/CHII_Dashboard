#!/usr/bin/env python3
"""Generate Word documents for HEMP, HENT, HECO data dictionaries."""

from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from datetime import datetime

def add_heading_with_style(doc, text, level=1):
    """Add a heading with proper formatting."""
    heading = doc.add_heading(text, level=level)
    return heading

def add_table_from_data(doc, headers, rows):
    """Add a formatted table to document."""
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Light Grid Accent 1'

    # Header row
    hdr_cells = table.rows[0].cells
    for i, header in enumerate(headers):
        hdr_cells[i].text = header
        # Bold header
        for paragraph in hdr_cells[i].paragraphs:
            for run in paragraph.runs:
                run.bold = True

    # Data rows
    for row_data in rows:
        row_cells = table.add_row().cells
        for i, cell_data in enumerate(row_data):
            row_cells[i].text = str(cell_data)

    return table

def create_hemp_doc():
    """Create HEMP Data Dictionary Word document."""
    doc = Document()

    # Title
    title = doc.add_heading('HEMP Data Dictionary', 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    subtitle = doc.add_paragraph('Health Employment Pillar')
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_format = subtitle.runs[0]
    subtitle_format.italic = True

    meta = doc.add_paragraph(f'Complete data structures, entities, relationships, and KPI definitions')
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

    date_para = doc.add_paragraph(f'Last Updated: {datetime.now().strftime("%d %B %Y")}')
    date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph()  # Spacing

    # Overview
    add_heading_with_style(doc, 'Purpose & Scope', 2)
    doc.add_paragraph(
        'The Health Employment (HEMP) pillar focuses on connecting healthcare students with '
        'employment opportunities through four core programmes: Career Exposure (HealthX), Internships, '
        'Signature Immersive Experiences (SIE), and foundational Global Health Courses. This document defines '
        'the complete data structure, relationships, and metrics for tracking student engagement, programme outcomes, '
        'and employment impact.'
    )

    # Mission Students
    add_heading_with_style(doc, 'Mission Students Entity', 2)
    doc.add_paragraph('Tracks healthcare students (2021–2026 cohorts) and their engagement with HEMP programmes.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: ms001, ms002, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    hemp_fields = [
        ('cohort', 'Integer', 'Academic year (2021–2026)', 'Yes', '2024'),
        ('country', 'String', 'Country of origin', 'Yes', 'Rwanda'),
        ('gender', 'Enum', 'Female | Male', 'Yes', 'Female'),
        ('track', 'Enum', 'Health Innovation | Health Management | Policy | Digital Health', 'Yes', 'Digital Health'),
        ('status', 'Enum', 'Active | Completed | Deferred', 'Yes', 'Completed'),
        ('gpa', 'Decimal', 'Grade point average (0.0–4.0)', 'Yes', '3.72'),
        ('hasHealthX', 'Boolean', 'Career Exposure participation', 'Yes', 'true'),
        ('hasInternship', 'Boolean', 'Internship participation', 'Yes', 'true'),
        ('ventureCreated', 'Boolean', 'HENT venture creation (cross-pillar)', 'Yes', 'false'),
        ('employment', 'Enum', 'Employed | Entrepreneur | Further Study | Seeking', 'No*', 'Employed'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], hemp_fields)

    doc.add_paragraph('*Null if status = Active; must be set if Completed/Deferred').style = 'Normal'

    add_heading_with_style(doc, 'Relationships', 3)
    doc.add_paragraph('→ HealthX Symposia (many-to-many via hasHealthX)')
    doc.add_paragraph('→ Internships (many-to-many via hasInternship)')
    doc.add_paragraph('→ SIE Cohorts (implicit via attendance)')
    doc.add_paragraph('→ Global Health Courses (many-to-many via enrollment)')
    doc.add_paragraph('→ Ventures (one-to-many if ventureCreated = true)')

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Total students: COUNT(*)')
    doc.add_paragraph('Female representation: COUNT(gender="Female") / COUNT(*)')
    doc.add_paragraph('Geographic coverage: COUNT(DISTINCT country)')
    doc.add_paragraph('HEMP participation rate: COUNT(hasInternship OR hasHealthX) / COUNT(*)')

    # Career Exposure
    add_heading_with_style(doc, 'Career Exposure Entity (HealthX Symposia)', 2)
    doc.add_paragraph('Annual events generating employment leads for students.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: HX01, HX02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    healthx_fields = [
        ('year', 'Integer', 'Event year', 'Yes', '2025'),
        ('country', 'String', 'Host country', 'Yes', 'Rwanda'),
        ('city', 'String', 'Host city', 'Yes', 'Kigali'),
        ('studentsAttending', 'Integer', 'Total participants', 'Yes', '340'),
        ('femaleStudents', 'Integer', 'Female participants', 'Yes', '181'),
        ('institutions', 'Integer', 'Partner universities', 'Yes', '7'),
        ('employersExhibiting', 'Integer', 'Organizations present', 'Yes', '28'),
        ('leads.Internship', 'Integer', 'Internship opportunities', 'Yes', '98'),
        ('leads.Employment', 'Integer', 'Job opportunities', 'Yes', '41'),
        ('leads.Project-Based', 'Integer', 'Project opportunities', 'Yes', '33'),
        ('conversions.Internship', 'Integer', 'Converted to internships', 'Yes', '49'),
        ('conversions.Employment', 'Integer', 'Converted to jobs', 'Yes', '17'),
        ('usefulness', 'Decimal', 'Student satisfaction (1–5)', 'Yes', '4.5'),
        ('relevanceScore', 'Decimal', 'Content relevance (1–5)', 'Yes', '5'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], healthx_fields)

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Lead conversion rate: SUM(conversions.*) / SUM(leads.*)')
    doc.add_paragraph('Female participation: femaleStudents / studentsAttending')
    doc.add_paragraph('Leads per event: SUM(leads.*) / COUNT(events)')

    # Internships
    add_heading_with_style(doc, 'Internships Entity', 2)
    doc.add_paragraph('Individual internship placements, employer feedback, and student outcomes.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: i001, i002, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    internship_fields = [
        ('year', 'Integer', 'Internship year', 'Yes', '2023'),
        ('organization', 'Enum', 'CHII Internal | SFH | KASHA | Heza | RCR | mIndora', 'Yes', 'SFH'),
        ('country', 'String', 'Placement location', 'Yes', 'Rwanda'),
        ('durationWeeks', 'Integer', 'Length of internship', 'Yes', '12'),
        ('students', 'Integer', 'Interns placed', 'Yes', '7'),
        ('femaleStudents', 'Integer', 'Female interns', 'Yes', '4'),
        ('employmentConversions', 'Integer', 'Hired post-internship', 'Yes', '3'),
        ('satisfactionScore', 'Decimal', 'Overall satisfaction (1–5)', 'Yes', '4.8'),
        ('studentFeedbackScore', 'Decimal', 'Student feedback (1–5)', 'Yes', '4.7'),
        ('partnerFeedbackScore', 'Decimal', 'Employer feedback (1–5)', 'Yes', '4.6'),
        ('meetsDeadlines', 'Decimal', 'Workplace skill (1–5)', 'Yes', '5'),
        ('worksInTeams', 'Decimal', 'Teamwork ability (1–5)', 'Yes', '5'),
        ('recommendationScore', 'Integer', 'NPS score (0–10)', 'Yes', '9'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], internship_fields)

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Conversion rate: SUM(employmentConversions) / SUM(students)')
    doc.add_paragraph('Female representation: SUM(femaleStudents) / SUM(students)')
    doc.add_paragraph('Employer satisfaction: AVG(partnerFeedbackScore)')

    # SIE
    add_heading_with_style(doc, 'SIE (Signature Immersive Experience) Entity', 2)
    doc.add_paragraph('Cohort-level immersive learning with virtual and in-country phases.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: SIE01, SIE02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    sie_fields = [
        ('year', 'Integer', 'Cohort year', 'Yes', '2024'),
        ('country', 'String', 'Immersion country', 'Yes', 'Rwanda'),
        ('selected', 'Integer', 'Selected candidates', 'Yes', '24'),
        ('completedVirtual', 'Integer', 'Virtual phase completion', 'Yes', '22'),
        ('travelledInCountry', 'Integer', 'In-country participants', 'Yes', '20'),
        ('completedProgramme', 'Integer', 'Both phases completed', 'Yes', '19'),
        ('satisfaction', 'Decimal', 'Overall satisfaction (1–5)', 'Yes', '4.2'),
        ('npsPromoters', 'Integer', '% scoring 9–10', 'Yes', '47'),
        ('npsPassives', 'Integer', '% scoring 7–8', 'Yes', '42'),
        ('npsDetractors', 'Integer', '% scoring 0–6', 'Yes', '11'),
        ('employmentLeads', 'Integer', 'Employment opportunities', 'Yes', '6'),
        ('employmentPlacements', 'Integer', 'Post-SIE jobs', 'Yes', '5'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], sie_fields)

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Completion rate: (completedProgramme / selected) × 100%')
    doc.add_paragraph('Placement rate: (employmentPlacements / selected) × 100%')
    doc.add_paragraph('NPS: (Promoters% − Detractors%)')

    # Courses
    add_heading_with_style(doc, 'Global Health Courses Entity', 2)
    doc.add_paragraph('Foundational course enrollment, module completion, and progression outcomes.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: GH2022, GH2023, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    course_fields = [
        ('cohortYear', 'Integer', 'Academic year', 'Yes', '2022'),
        ('enrolled', 'Integer', 'Total enrollments', 'Yes', '34'),
        ('female', 'Integer', 'Female enrollment', 'Yes', '18'),
        ('completed', 'Integer', 'Course completion', 'Yes', '26'),
        ('certified', 'Integer', 'Passed assessment', 'Yes', '22'),
        ('avgScore', 'Decimal', 'Assessment score (%)', 'Yes', '71'),
        ('satisfaction', 'Decimal', 'Overall satisfaction (1–5)', 'Yes', '4.0'),
        ('progressedToVenture', 'Integer', 'Advanced to HENT', 'Yes', '5'),
        ('progressedToInternship', 'Integer', 'Advanced to HEMP', 'Yes', '9'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], course_fields)

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Completion rate: (completed / enrolled) × 100%')
    doc.add_paragraph('Certification rate: (certified / completed) × 100%')
    doc.add_paragraph('Female representation: (female / enrolled) × 100%')
    doc.add_paragraph('Progression rate: ((progressedToVenture + progressedToInternship) / certified) × 100%')

    # KPIs
    add_heading_with_style(doc, 'HEMP KPI Definitions', 2)
    kpi_data = [
        ('Career Exposure Reach', 'SUM(studentsAttending)', 'Annual', 'Programme scale'),
        ('Internship Conversion', 'SUM(conversions.Internship) / SUM(leads.Internship)', 'Annual', 'Placement effectiveness'),
        ('Job Conversion', 'COUNT(employmentConversions) / SUM(students)', 'Annual', 'Employment outcome'),
        ('SIE Completion', 'SUM(completedProgramme) / SUM(selected)', 'Per-cohort', 'Programme quality'),
        ('Course Cert Rate', 'SUM(certified) / SUM(enrolled)', 'Annual', 'Learning rigour'),
        ('Female Participation', 'SUM(femaleStudents) / SUM(totalStudents)', 'Annual', 'Gender equity'),
        ('Employment Rate', 'COUNT(employed) / totalMissionStudents', 'Annual', 'Overall impact'),
    ]
    add_table_from_data(doc, ['KPI', 'Calculation', 'Frequency', 'Purpose'], kpi_data)

    # Data Collection
    add_heading_with_style(doc, 'Data Collection Methods', 2)
    doc.add_paragraph('Mission Students: Annual intake forms + during-programme tracking')
    doc.add_paragraph('Career Exposure: Post-event surveys, lead tracking systems, employer feedback forms')
    doc.add_paragraph('Internships: Placement agreements, mid-/end-term surveys (student + employer), post-placement tracking')
    doc.add_paragraph('SIE: Pre/post assessments, employer surveys, 6-month alumni employment tracking')
    doc.add_paragraph('Courses: Module assessments, end-of-course surveys, 12-month progression tracking')

    # Validation
    add_heading_with_style(doc, 'Data Quality & Validation Rules', 2)
    doc.add_paragraph('cohort must be within 2021–2026')
    doc.add_paragraph('femaleStudents ≤ students')
    doc.add_paragraph('If status = "Active", employment must be NULL')
    doc.add_paragraph('If status = "Completed" or "Deferred", employment must be set')
    doc.add_paragraph('Completion/satisfaction percentages must be 0–100')
    doc.add_paragraph('Scores must be in valid range (1–5 or 0–10 for NPS)')

    return doc

def create_hent_doc():
    """Create HENT Data Dictionary Word document."""
    doc = Document()

    # Title
    title = doc.add_heading('HENT Data Dictionary', 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    subtitle = doc.add_paragraph('Health Entrepreneurship Pillar')
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_format = subtitle.runs[0]
    subtitle_format.italic = True

    meta = doc.add_paragraph(f'Complete data structures, entities, relationships, and KPI definitions')
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

    date_para = doc.add_paragraph(f'Last Updated: {datetime.now().strftime("%d %B %Y")}')
    date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph()  # Spacing

    # Overview
    add_heading_with_style(doc, 'Purpose & Scope', 2)
    doc.add_paragraph(
        'The Health Entrepreneurship (HENT) pillar focuses on identifying, supporting, and funding '
        'health ventures across their lifecycle. This document defines the complete data structure for tracking '
        'ventures, founders, programmes (hackathons, masterclasses, mentorship), and entrepreneurial outcomes.'
    )

    # Ventures
    add_heading_with_style(doc, 'Ventures Entity', 2)
    doc.add_paragraph('Individual venture records, funding, stage progression, and employment/revenue outcomes.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: v001, v002, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    venture_fields = [
        ('name', 'String', 'Venture name', 'Yes', 'DiagnosticAI'),
        ('cohort', 'Integer', 'Entry cohort year', 'Yes', '2021'),
        ('country', 'String', 'Operational country', 'Yes', 'Rwanda'),
        ('sector', 'String', 'Health sector', 'Yes', 'Digital Health'),
        ('stage', 'Enum', 'Ideation | Validation | Prototype/MVP | Early Growth | Scaling', 'Yes', 'Scaling'),
        ('status', 'Enum', 'Active | Stalled | Exited', 'Yes', 'Active'),
        ('teamGender', 'Enum', 'Female | Male | Mixed', 'Yes', 'Mixed'),
        ('revenue', 'Decimal', 'Annual revenue (USD)', 'No', '75000.00'),
        ('funding', 'Decimal', 'Total funding raised', 'No', '250000.00'),
        ('fundType', 'Enum', 'Charitable | Venture Fund | Catalytic', 'No', 'Venture Fund'),
        ('jobsTotal', 'Integer', 'Total jobs created', 'Yes', '12'),
        ('jobsWomen', 'Integer', 'Jobs held by women', 'No', '4'),
        ('jobsYouth', 'Integer', 'Jobs for youth', 'No', '3'),
        ('healthScore', 'Integer', 'Portfolio health (0–100)', 'No', '82'),
        ('recommended', 'Boolean', 'Featured venture', 'No', 'true'),
        ('accelerator', 'Boolean', 'In accelerator programme', 'No', 'true'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], venture_fields)

    add_heading_with_style(doc, 'Relationships', 3)
    doc.add_paragraph('→ Founders (one-to-many: founding team members)')
    doc.add_paragraph('→ Funding (one-to-many: funding rounds by year/type)')
    doc.add_paragraph('→ Exposure Events (many-to-many: hackathons, pitches, competitions)')

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Portfolio size: COUNT(status = "Active")')
    doc.add_paragraph('Total jobs: SUM(jobsTotal WHERE status = "Active")')
    doc.add_paragraph('Female founder %: COUNT(teamGender = "Female") / COUNT(*)')
    doc.add_paragraph('Average revenue: AVG(revenue WHERE revenue > 0)')
    doc.add_paragraph('Funding deployed: SUM(funding)')

    # Founders
    add_heading_with_style(doc, 'Founders Entity', 2)
    doc.add_paragraph('Individual founder information and attributes.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: f001, f002, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    founder_fields = [
        ('ventureId', 'String', 'Associated venture FK', 'Yes', 'v001'),
        ('name', 'String', 'Full name', 'Yes', 'Jane Doe'),
        ('gender', 'Enum', 'Female | Male | Other', 'Yes', 'Female'),
        ('country', 'String', 'Country of origin', 'Yes', 'Rwanda'),
        ('education', 'String', 'Educational background', 'No', 'BSc Computer Science'),
        ('isPWD', 'Boolean', 'Person with disability', 'No', 'false'),
        ('isRefugee', 'Boolean', 'Refugee/IDP status', 'No', 'false'),
        ('npsScore', 'Integer', 'NPS feedback (0–10)', 'No', '9'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], founder_fields)

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Female founder %: COUNT(gender = "Female") / COUNT(*)')
    doc.add_paragraph('Inclusion %: COUNT(isPWD OR isRefugee) / COUNT(*)')

    # Hackathons
    add_heading_with_style(doc, 'Hackathons Entity', 2)
    doc.add_paragraph('Hackathon events and participant outcomes (ideas → projects → ventures).').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: hck01, hck02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    hackathon_fields = [
        ('name', 'String', 'Event name', 'Yes', 'Health Innovation Hackathon 2024'),
        ('year', 'Integer', 'Event year', 'Yes', '2024'),
        ('country', 'String', 'Location', 'Yes', 'Kenya'),
        ('participants', 'Integer', 'Total participants', 'Yes', '150'),
        ('femaleParticipants', 'Integer', 'Female attendees', 'Yes', '70'),
        ('ideasSubmitted', 'Integer', 'Pitches received', 'Yes', '24'),
        ('projectsLaunched', 'Integer', 'Ideas advanced to projects', 'Yes', '8'),
        ('venturesCreated', 'Integer', 'Ventures formed post-hackathon', 'Yes', '3'),
        ('avgSatisfaction', 'Decimal', 'Participant satisfaction (1–5)', 'Yes', '4.3'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], hackathon_fields)

    # Masterclasses
    add_heading_with_style(doc, 'Masterclasses Entity', 2)
    doc.add_paragraph('Masterclass sessions and learning outcomes.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: mc01, mc02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    masterclass_fields = [
        ('topic', 'String', 'Class topic', 'Yes', 'Business Model Canvas'),
        ('year', 'Integer', 'Delivery year', 'Yes', '2024'),
        ('country', 'String', 'Location', 'Yes', 'Rwanda'),
        ('attendees', 'Integer', 'Participants', 'Yes', '45'),
        ('femaleAttendees', 'Integer', 'Female participants', 'Yes', '20'),
        ('completionRate', 'Decimal', 'Completion % (0–100)', 'Yes', '88'),
        ('avgScore', 'Decimal', 'Learning assessment (0–100)', 'Yes', '75'),
        ('avgSatisfaction', 'Decimal', 'Satisfaction (1–5)', 'Yes', '4.2'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], masterclass_fields)

    # Mentorship
    add_heading_with_style(doc, 'Mentorship Entity', 2)
    doc.add_paragraph('Mentorship relationships and participant outcomes.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: ment01, ment02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    mentorship_fields = [
        ('menteeVentureId', 'String', 'Mentee venture FK', 'Yes', 'v001'),
        ('mentorName', 'String', 'Mentor name', 'Yes', 'John Smith'),
        ('mentorBackground', 'String', 'Mentor expertise', 'Yes', 'Serial entrepreneur, 15 years'),
        ('year', 'Integer', 'Mentorship year', 'Yes', '2024'),
        ('durationMonths', 'Integer', 'Engagement length', 'Yes', '6'),
        ('frequency', 'Enum', 'Weekly | Bi-weekly | Monthly', 'Yes', 'Weekly'),
        ('ventureMilestones', 'Integer', 'Milestones achieved', 'Yes', '3'),
        ('avgMenteeScore', 'Decimal', 'Mentee satisfaction (1–5)', 'Yes', '4.6'),
        ('avgMentorScore', 'Decimal', 'Mentor satisfaction (1–5)', 'Yes', '4.4'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], mentorship_fields)

    # KPIs
    add_heading_with_style(doc, 'HENT KPI Definitions', 2)
    kpi_data = [
        ('Ventures Created', 'COUNT(ventures WHERE cohort = YEAR)', 'Annual', 'Entrepreneurship pipeline'),
        ('Jobs Created', 'SUM(jobsTotal WHERE status = "Active")', 'Quarterly', 'Economic impact'),
        ('Female Founder %', 'COUNT(teamGender = "Female") / COUNT(*)', 'Annual', 'Founder diversity'),
        ('Avg Funding/Venture', 'SUM(funding) / COUNT(funded ventures)', 'Annual', 'Capital efficiency'),
        ('Funding Deployed', 'SUM(funding)', 'Quarterly', 'Capital deployment'),
        ('Health Score', 'AVG(healthScore)', 'Quarterly', 'Portfolio health'),
    ]
    add_table_from_data(doc, ['KPI', 'Calculation', 'Frequency', 'Purpose'], kpi_data)

    # Data Collection
    add_heading_with_style(doc, 'Data Collection Methods', 2)
    doc.add_paragraph('Ventures: Intake form + quarterly check-ins + annual tax records for revenue')
    doc.add_paragraph('Founders: Intake form + optional annual updates')
    doc.add_paragraph('Hackathons: Participant registration + exit survey')
    doc.add_paragraph('Masterclasses: Attendance records + assessments + post-class survey')
    doc.add_paragraph('Mentorship: Relationship initiation + mid-/end-of-term surveys')

    # Validation
    add_heading_with_style(doc, 'Data Quality & Validation Rules', 2)
    doc.add_paragraph('jobsTotal, revenue, funding must be ≥ 0')
    doc.add_paragraph('healthScore must be 0–100')
    doc.add_paragraph('Satisfaction/completion percentages must be 0–100')
    doc.add_paragraph('All founder records must reference valid venture via ventureId')
    doc.add_paragraph('stage must be one of the valid enum values')

    return doc

def create_heco_doc():
    """Create HECO Data Dictionary Word document."""
    doc = Document()

    # Title
    title = doc.add_heading('HECO Data Dictionary', 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    subtitle = doc.add_paragraph('Health Ecosystems Pillar')
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_format = subtitle.runs[0]
    subtitle_format.italic = True

    meta = doc.add_paragraph(f'Complete data structures, entities, relationships, and KPI definitions')
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

    date_para = doc.add_paragraph(f'Last Updated: {datetime.now().strftime("%d %B %Y")}')
    date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph()  # Spacing

    # Overview
    add_heading_with_style(doc, 'Purpose & Scope', 2)
    doc.add_paragraph(
        'The Health Ecosystems (HECO) pillar focuses on strengthening health innovation ecosystems '
        'through strategic partnerships and pilot programmes. This document defines the complete data structure for tracking '
        'partner organizations, pilot programmes, infrastructure investments, and ecosystem readiness.'
    )

    # Partners
    add_heading_with_style(doc, 'Partners Entity', 2)
    doc.add_paragraph('Ecosystem partner organizations and engagement tracking.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: partner01, partner02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    partner_fields = [
        ('name', 'String', 'Organization name', 'Yes', 'Ministry of Health'),
        ('partnerType', 'Enum', 'Government | Healthcare Provider | NGO | Research | Private Sector', 'Yes', 'Government'),
        ('country', 'String', 'Operational country', 'Yes', 'Rwanda'),
        ('sector', 'String', 'Focus area', 'Yes', 'Policy'),
        ('relationshipStartYear', 'Integer', 'Partnership inception', 'Yes', '2020'),
        ('relationshipStatus', 'Enum', 'Active | Dormant | Ended', 'Yes', 'Active'),
        ('engagementType', 'String', 'Nature of partnership', 'Yes', 'Policy Advocacy'),
        ('contactName', 'String', 'Primary contact', 'Yes', 'Dr. Jane Mwangi'),
        ('contactEmail', 'String', 'Contact email', 'Yes', 'jane@example.org'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], partner_fields)

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Active partnerships: COUNT(relationshipStatus = "Active")')
    doc.add_paragraph('Partnership by type: COUNT(*) grouped by partnerType')
    doc.add_paragraph('Engagement types: COUNT(DISTINCT engagementType)')

    # Pilot Programs
    add_heading_with_style(doc, 'Pilot Programs Entity', 2)
    doc.add_paragraph('Pilot health innovation programmes and scale potential assessment.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: pilot01, pilot02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    pilot_fields = [
        ('name', 'String', 'Programme name', 'Yes', 'Rural Telemedicine Pilot'),
        ('description', 'Text', 'What it tests/innovates', 'Yes', 'Testing remote diagnostics'),
        ('year', 'Integer', 'Launch year', 'Yes', '2024'),
        ('country', 'String', 'Pilot location', 'Yes', 'Uganda'),
        ('partnerIds', 'Array', 'Partner organizations FK', 'Yes', '["partner01", "partner02"]'),
        ('ventureIds', 'Array', 'Ventures involved FK', 'No', '["v015", "v023"]'),
        ('participants', 'Integer', 'People reached', 'Yes', '250'),
        ('femaleParticipants', 'Integer', 'Female participants', 'Yes', '125'),
        ('durationMonths', 'Integer', 'Pilot length', 'Yes', '12'),
        ('readinessToScale', 'Enum', 'Ready | Promising | Needs Iteration | Not Viable', 'Yes', 'Ready'),
        ('estimatedReplicationCost', 'Decimal', 'Cost to scale per country (USD)', 'No', '500000.00'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], pilot_fields)

    add_heading_with_style(doc, 'Nested: Objectives & Outcomes', 3)
    doc.add_paragraph('objectives: Array of target metrics (e.g., ["80% diagnostic accuracy", "Cost <$5/visit"])')
    doc.add_paragraph('outcomesAchieved: Array of actual results (e.g., ["85% accuracy", "$4.20/visit"])')
    doc.add_paragraph('successRate: Derived as COUNT(achieved) / COUNT(objectives)')

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Scale-ready pilots: COUNT(readinessToScale IN ("Ready", "Promising"))')
    doc.add_paragraph('Total reach: SUM(participants)')
    doc.add_paragraph('Female participation: SUM(femaleParticipants) / SUM(participants)')
    doc.add_paragraph('Replication potential: SUM(participants) × estimatedReplicationCost')

    # Infrastructure
    add_heading_with_style(doc, 'Infrastructure & Systems Entity', 2)
    doc.add_paragraph('Shared digital infrastructure and tools enabling ecosystem collaboration.').style = 'Intense Quote'

    add_heading_with_style(doc, 'Primary Key', 3)
    doc.add_paragraph('id (format: infra01, infra02, etc.)')

    add_heading_with_style(doc, 'Core Fields', 3)
    infrastructure_fields = [
        ('name', 'String', 'System name', 'Yes', 'Health Data Exchange Platform'),
        ('purpose', 'String', 'What it enables', 'Yes', 'Interoperable health data sharing'),
        ('operationalYear', 'Integer', 'Launch year', 'Yes', '2023'),
        ('operatingCountries', 'Array', 'Active in', 'Yes', '["Rwanda", "Kenya", "Uganda"]'),
        ('integrations', 'Array', 'Connected systems', 'Yes', '["EMR_System_A", "Lab_Platform_B"]'),
        ('users', 'Integer', 'Active monthly users', 'Yes', '1250'),
        ('uptime', 'Decimal', 'System availability (%)', 'Yes', '99.5'),
    ]
    add_table_from_data(doc, ['Field', 'Type', 'Description', 'Required', 'Example'], infrastructure_fields)

    add_heading_with_style(doc, 'Key Metrics', 3)
    doc.add_paragraph('Integration breadth: COUNT(integrations)')
    doc.add_paragraph('User adoption: COUNT(activeUsers)')
    doc.add_paragraph('System reliability: uptime (%)')

    # KPIs
    add_heading_with_style(doc, 'HECO KPI Definitions', 2)
    kpi_data = [
        ('Active Partnerships', 'COUNT(relationshipStatus = "Active")', 'Annual', 'Ecosystem health'),
        ('Scale-Ready Pilots', 'COUNT(readinessToScale IN ("Ready", "Promising"))', 'Per-pilot', 'Innovation pipeline'),
        ('Pilot Replication Potential', 'SUM(participants WHERE ready)', 'Annual', 'Scale opportunity'),
        ('Partnership Value', 'Engagement type diversity + relationship stability', 'Quarterly', 'Partnership strength'),
    ]
    add_table_from_data(doc, ['KPI', 'Calculation', 'Frequency', 'Purpose'], kpi_data)

    # Data Collection
    add_heading_with_style(doc, 'Data Collection Methods', 2)
    doc.add_paragraph('Partners: Partner agreement + quarterly touchbase meetings + annual partnership reviews')
    doc.add_paragraph('Pilot Programs: Project initiation workshop + quarterly progress reports + end-of-pilot assessment')
    doc.add_paragraph('Infrastructure: System logs + user analytics dashboards + monthly uptime monitoring')

    # Validation
    add_heading_with_style(doc, 'Data Quality & Validation Rules', 2)
    doc.add_paragraph('relationshipStartYear must be ≤ current year')
    doc.add_paragraph('durationMonths must be > 0')
    doc.add_paragraph('participants ≥ femaleParticipants')
    doc.add_paragraph('readinessToScale must be one of valid enum values')
    doc.add_paragraph('uptime must be 0–100%')
    doc.add_paragraph('All referenced partner/venture IDs must exist in respective entities')

    return doc

if __name__ == '__main__':
    print("Generating HEMP Data Dictionary...")
    hemp_doc = create_hemp_doc()
    hemp_doc.save('/Users/user/Documents/CHII_Dashboard/HEMP_Data_Dictionary.docx')
    print("✓ HEMP_Data_Dictionary.docx created")

    print("Generating HENT Data Dictionary...")
    hent_doc = create_hent_doc()
    hent_doc.save('/Users/user/Documents/CHII_Dashboard/HENT_Data_Dictionary.docx')
    print("✓ HENT_Data_Dictionary.docx created")

    print("Generating HECO Data Dictionary...")
    heco_doc = create_heco_doc()
    heco_doc.save('/Users/user/Documents/CHII_Dashboard/HECO_Data_Dictionary.docx')
    print("✓ HECO_Data_Dictionary.docx created")

    print("\nAll Word documents generated successfully!")
