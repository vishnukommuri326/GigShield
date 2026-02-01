"""
Generate a sample Uber deactivation notice PDF for New Jersey
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime

# Create PDF
pdf_filename = "Sample_Uber_NJ_Deactivation_Notice.pdf"
doc = SimpleDocTemplate(pdf_filename, pagesize=letter)
story = []
styles = getSampleStyleSheet()

# Custom styles
title_style = styles['Heading1']
title_style.alignment = TA_CENTER

normal_style = styles['Normal']
normal_style.alignment = TA_LEFT

# Header
story.append(Spacer(1, 0.5*inch))
title = Paragraph("<b>Uber Account Deactivation Notice</b>", title_style)
story.append(title)
story.append(Spacer(1, 0.3*inch))

# Date
date_text = Paragraph(f"<b>Date:</b> January 29, 2026", normal_style)
story.append(date_text)
story.append(Spacer(1, 0.2*inch))

# Driver info
name_text = Paragraph("<b>Driver Name:</b> [Your Name]", normal_style)
story.append(name_text)
story.append(Spacer(1, 0.1*inch))

account_text = Paragraph("<b>Partner ID:</b> UBR-78945612", normal_style)
story.append(account_text)
story.append(Spacer(1, 0.1*inch))

location_text = Paragraph("<b>Location:</b> Newark, New Jersey", normal_style)
story.append(location_text)
story.append(Spacer(1, 0.3*inch))

# Body
body1 = Paragraph("Dear Uber Partner,", normal_style)
story.append(body1)
story.append(Spacer(1, 0.2*inch))

body2 = Paragraph(
    "This notice is to inform you that your Uber driver account has been deactivated "
    "effective January 29, 2026, due to your account rating falling below the minimum "
    "threshold for the Newark market.",
    normal_style
)
story.append(body2)
story.append(Spacer(1, 0.2*inch))

body3 = Paragraph(
    "<b>Deactivation Details:</b> Your current rating is 4.52, which is below the required "
    "minimum of 4.60 for the Newark metro area. Your rating has been declining over the past "
    "30 days due to multiple customer complaints regarding navigation issues, unprofessional "
    "behavior, and vehicle cleanliness concerns.",
    normal_style
)
story.append(body3)
story.append(Spacer(1, 0.2*inch))

body4 = Paragraph(
    "<b>Contributing Factors:</b> Our system flagged the following issues:",
    normal_style
)
story.append(body4)
story.append(Spacer(1, 0.1*inch))

issue1 = Paragraph("• 3 customer reports of unprofessional communication", normal_style)
story.append(issue1)
issue2 = Paragraph("• 2 reports of unclean vehicle interior", normal_style)
story.append(issue2)
issue3 = Paragraph("• Multiple instances of taking inefficient routes", normal_style)
story.append(issue3)
story.append(Spacer(1, 0.2*inch))

body5 = Paragraph(
    "<b>New Jersey Worker Protections:</b> Under New Jersey's gig worker protections, you have "
    "the right to appeal this decision within 30 days. Your appeal must include specific evidence "
    "addressing the concerns raised, such as dashcam footage, GPS logs, customer communication "
    "records, or proof of vehicle maintenance.",
    normal_style
)
story.append(body5)
story.append(Spacer(1, 0.2*inch))

body6 = Paragraph(
    "<b>Appeal Process:</b> To appeal this deactivation:",
    normal_style
)
story.append(body6)
story.append(Spacer(1, 0.1*inch))

step1 = Paragraph("1. Visit help.uber.com and select 'Account Issues'", normal_style)
story.append(step1)
step2 = Paragraph("2. Choose 'Appeal a deactivation'", normal_style)
story.append(step2)
step3 = Paragraph("3. Upload supporting documentation", normal_style)
story.append(step3)
step4 = Paragraph("4. Include detailed explanation of circumstances", normal_style)
story.append(step4)
story.append(Spacer(1, 0.2*inch))

body7 = Paragraph(
    "Appeals are typically reviewed within 7-10 business days. If you have questions about "
    "your deactivation, you may also visit an Uber Greenlight Hub in Newark at 550 Broad Street.",
    normal_style
)
story.append(body7)
story.append(Spacer(1, 0.3*inch))

# Closing
closing1 = Paragraph("Regards,", normal_style)
story.append(closing1)
story.append(Spacer(1, 0.1*inch))

closing2 = Paragraph("<b>Uber Partner Support Team</b>", normal_style)
story.append(closing2)
story.append(Spacer(1, 0.05*inch))

closing3 = Paragraph("support@uber.com", normal_style)
story.append(closing3)
story.append(Spacer(1, 0.3*inch))

# Footer
footer = Paragraph(
    "<i>This notification is sent in compliance with New Jersey gig worker notification requirements. "
    "For additional information about your rights under New Jersey law, contact the NJ Department of Labor.</i>",
    normal_style
)
story.append(footer)

# Build PDF
doc.build(story)
print(f"✓ Created {pdf_filename}")
print(f"Location: C:\\Users\\17325\\dev\\GigShield\\{pdf_filename}")
