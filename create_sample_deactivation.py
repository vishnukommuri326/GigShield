"""
Generate a sample DoorDash deactivation notice PDF
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime

# Create PDF
pdf_filename = "Sample_DoorDash_Deactivation_Notice.pdf"
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
title = Paragraph("<b>DoorDash Account Deactivation Notice</b>", title_style)
story.append(title)
story.append(Spacer(1, 0.3*inch))

# Date
date_text = Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", normal_style)
story.append(date_text)
story.append(Spacer(1, 0.2*inch))

# Dasher name (placeholder)
name_text = Paragraph("<b>Dasher Name:</b> [Your Name]", normal_style)
story.append(name_text)
story.append(Spacer(1, 0.1*inch))

account_text = Paragraph("<b>Account ID:</b> DASH-123456789", normal_style)
story.append(account_text)
story.append(Spacer(1, 0.3*inch))

# Body
body1 = Paragraph(
    "Dear Dasher,",
    normal_style
)
story.append(body1)
story.append(Spacer(1, 0.2*inch))

body2 = Paragraph(
    "We are writing to inform you that your DoorDash Dasher account has been deactivated "
    "effective immediately due to multiple reports of incomplete deliveries.",
    normal_style
)
story.append(body2)
story.append(Spacer(1, 0.2*inch))

body3 = Paragraph(
    "<b>Reason for Deactivation:</b> Our records indicate that on January 28, 2026, we received "
    "two customer reports stating that orders were not delivered. These incidents are in violation "
    "of our Community Guidelines and Independent Contractor Agreement, specifically Section 4.2 "
    "regarding completion of accepted deliveries.",
    normal_style
)
story.append(body3)
story.append(Spacer(1, 0.2*inch))

body4 = Paragraph(
    "<b>Appeal Process:</b> If you believe this decision was made in error, you may submit an "
    "appeal through your Dasher app or by visiting help.doordash.com/dashers. Appeals must be "
    "submitted within 7-10 days of this notice and should include any supporting documentation "
    "such as delivery photos, GPS data, or customer communication records.",
    normal_style
)
story.append(body4)
story.append(Spacer(1, 0.2*inch))

body5 = Paragraph(
    "Please note that deactivation decisions are final unless successfully appealed. During the "
    "appeal review process, your account will remain inactive.",
    normal_style
)
story.append(body5)
story.append(Spacer(1, 0.3*inch))

# Closing
closing1 = Paragraph("Sincerely,", normal_style)
story.append(closing1)
story.append(Spacer(1, 0.1*inch))

closing2 = Paragraph("<b>DoorDash Deactivation Team</b>", normal_style)
story.append(closing2)
story.append(Spacer(1, 0.05*inch))

closing3 = Paragraph("support@doordash.com", normal_style)
story.append(closing3)
story.append(Spacer(1, 0.3*inch))

# Footer
footer = Paragraph(
    "<i>This is an automated notice. For questions, contact support through the Dasher app.</i>",
    normal_style
)
story.append(footer)

# Build PDF
doc.build(story)
print(f"✓ Created {pdf_filename}")
print(f"Location: C:\\Users\\17325\\dev\\GigShield\\{pdf_filename}")
