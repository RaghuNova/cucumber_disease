"""
PDF Report Generator for CucumberCare AI:
Generates an executive, botanical-themed PDF report using ReportLab.
Includes:
- Section A: Primary Disease or Health Classification (Classifier output & clinical guidance)
- Section B: Nutritional & Physiological Assessment (Separate differential assessment)
- Model Probability Distribution (Top candidates)
- Responsible AI Screening Disclaimer
"""

import io
from datetime import datetime
from typing import Dict, Any
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_pdf_report(data: Dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Botanical color palette
    c_forest = colors.HexColor("#071009")
    c_botanical = colors.HexColor("#1A5D2C")
    c_card_bg = colors.HexColor("#F4FAF5")
    c_card_amber = colors.HexColor("#FFFBEB")
    c_text_dark = colors.HexColor("#0F172A")
    c_text_muted = colors.HexColor("#475569")

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=c_forest
    )

    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=c_text_muted
    )

    section_heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=c_botanical
    )

    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=c_text_dark
    )

    bullet_style = ParagraphStyle(
        "BulletCustom",
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8
    )

    disclaimer_style = ParagraphStyle(
        "DisclaimerCustom",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=7.5,
        leading=10,
        textColor=c_text_muted
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("CUCUMBERCARE AI — LEAF HEALTH ASSESSMENT REPORT", title_style))
    story.append(Paragraph(
        f"Automated Agronomic Screening Assessment • Generated {datetime.now().strftime('%B %d, %Y at %H:%M UTC')} • Model: ConvNeXt Small (8 Classes)",
        subtitle_style
    ))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_botanical, spaceBefore=2, spaceAfter=10))

    # SECTION A: Primary Disease or Health Classification
    prediction = data.get("prediction", "Unknown Condition")
    confidence_pct = data.get("confidence_percentage", 0.0)
    confidence_level = data.get("confidence_level", "Standard")
    scientific_name = data.get("scientific_name", "Cucumis sativus condition")
    provider = data.get("provider", "Gemini 3.6 Flash")

    story.append(Paragraph("SECTION A: PRIMARY DISEASE OR HEALTH CLASSIFICATION (IMAGE CLASSIFIER OUTPUT)", section_heading_style))
    story.append(Spacer(1, 4))

    diag_data = [
        [
            Paragraph("<b>Predicted Condition:</b>", body_style),
            Paragraph(f"<font size='11' color='#071009'><b>{prediction}</b></font>", body_style)
        ],
        [
            Paragraph("<b>Scientific Designation:</b>", body_style),
            Paragraph(f"<i>{scientific_name}</i>", body_style)
        ],
        [
            Paragraph("<b>Model Confidence:</b>", body_style),
            Paragraph(f"<b>{confidence_pct}%</b> ({confidence_level})", body_style)
        ],
        [
            Paragraph("<b>Diagnostic Engine:</b>", body_style),
            Paragraph(f"PyTorch ConvNeXt (ixrbhii/cucumber-disease-convnext) + {provider.capitalize()} Advisor", body_style)
        ]
    ]

    diag_table = Table(diag_data, colWidths=[150, 390])
    diag_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_card_bg),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, colors.HexColor("#CBD5E1")),
        ('BOX', (0, 0), (-1, -1), 1, c_botanical),
    ]))
    story.append(diag_table)
    story.append(Spacer(1, 8))

    # What it is & Symptoms
    what_it_is = data.get("what_it_is", "")
    if what_it_is:
        story.append(Paragraph(f"<b>Pathology Overview:</b> {what_it_is}", body_style))
        story.append(Spacer(1, 4))

    distinguishing = data.get("distinguishing_features", "")
    if distinguishing:
        story.append(Paragraph(f"<b>Differential Identification:</b> {distinguishing}", body_style))
        story.append(Spacer(1, 6))

    # Visible symptoms list
    symptoms = data.get("common_visible_symptoms", data.get("symptoms", []))
    if symptoms:
        story.append(Paragraph("<b>Primary Visible Symptoms:</b>", body_style))
        for s in symptoms:
            story.append(Paragraph(f"• {s}", bullet_style))
        story.append(Spacer(1, 6))

    # Numbered Immediate Actions
    actions = data.get("immediate_actions", [])
    if actions:
        story.append(Paragraph("<b>Recommended Immediate Field Actions:</b>", body_style))
        for idx, act in enumerate(actions, 1):
            story.append(Paragraph(f"<b>{idx}.</b> {act}", bullet_style))
        story.append(Spacer(1, 6))

    # Prevention Checklist
    prevention = data.get("prevention_checklist", data.get("prevention", []))
    if prevention:
        story.append(Paragraph("<b>Long-Term Prevention & Cultural Practices:</b>", body_style))
        for p in prevention:
            story.append(Paragraph(f"• {p}", bullet_style))
        story.append(Spacer(1, 6))

    # Cautions and When to Seek Expert
    cautions = data.get("treatment_cautions", "")
    when_expert = data.get("when_to_seek_expert", "")
    if cautions or when_expert:
        caution_text = ""
        if cautions:
            caution_text += f"<b>Treatment Caution:</b> {cautions} "
        if when_expert:
            caution_text += f"<b>When to Seek Expert Consultation:</b> {when_expert}"
        story.append(Paragraph(caution_text, body_style))
        story.append(Spacer(1, 10))

    # SECTION B: Nutritional and Physiological Assessment
    story.append(Paragraph("SECTION B: NUTRITIONAL AND PHYSIOLOGICAL ASSESSMENT", section_heading_style))
    story.append(Spacer(1, 4))

    nutr_data = data.get("nutrient_assessment", {})
    context_note = nutr_data.get("context_note", (
        "Visual yellowing, necrotic margins, and foliage scorch can have multiple underlying causes. "
        "Visual inspection alone cannot definitively separate infectious disease from nutritional imbalances."
    ))
    story.append(Paragraph(f"<i>{context_note}</i>", body_style))
    story.append(Spacer(1, 6))

    nutr_rows = [["Nutrient Element", "Visual Foliar Symptom Pattern", "Differential from Infectious Disease"]]
    nutrients = nutr_data.get("nutrients", [
        {"nutrient": "Nitrogen (N)", "symptoms": "Uniform chlorosis on older lower leaves", "distinction": "Not vein-bounded like Downy Mildew"},
        {"nutrient": "Potassium (K)", "symptoms": "Marginal scorching along leaf perimeters", "distinction": "No bleeding stem cankers like Gummy Stem Blight"},
        {"nutrient": "Magnesium (Mg)", "symptoms": "Interveinal chlorosis on mature leaves", "distinction": "Veins stay green; no powdery fungal coating"},
        {"nutrient": "Iron (Fe)", "symptoms": "Interveinal chlorosis strictly on young top leaves", "distinction": "Restricted to new shoot apex; pH-dependent"}
    ])

    for n in nutrients:
        nutr_rows.append([
            n.get("nutrient", ""),
            n.get("symptoms", ""),
            n.get("distinction", "")
        ])

    nutr_table = Table(nutr_rows, colWidths=[90, 240, 210])
    nutr_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1A5D2C")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 4),
        ('TOPPADDING', (0, 0), (-1, 0), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 7.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_card_bg])
    ]))
    story.append(nutr_table)
    story.append(Spacer(1, 8))

    # Top 3 Candidates
    top_3 = data.get("top_3", [])
    if top_3:
        story.append(Paragraph("Model Probability Distribution (Top Candidates)", section_heading_style))
        story.append(Spacer(1, 3))
        
        prob_rows = [["Rank", "Candidate Condition", "Model Probability", "Classification Status"]]
        for rank, item in enumerate(top_3, 1):
            pct = f"{item.get('probability', 0) * 100:.1f}%"
            is_pri = "Primary Class" if item.get("is_primary") else "Supported Class"
            prob_rows.append([f"#{rank}", item.get("class_name", ""), pct, is_pri])

        prob_table = Table(prob_rows, colWidths=[40, 220, 130, 150])
        prob_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), c_forest),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 4),
            ('TOPPADDING', (0, 0), (-1, 0), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 7.5),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_card_bg])
        ]))
        story.append(prob_table)
        story.append(Spacer(1, 10))

    # Disclaimer
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#CBD5E1"), spaceBefore=4, spaceAfter=6))
    disclaimer_text = data.get(
        "disclaimer",
        "Screening Limitation Notice: This document is produced by an automated AI image classifier for preliminary decision support. "
        "Visual appearance alone cannot replace laboratory confirmation. Always perform a soil/tissue test and consult a certified agronomist "
        "before applying restricted chemical or fertility treatments."
    )
    story.append(Paragraph(f"<b>Responsible AI Notice & Limitation of Liability:</b> {disclaimer_text}", disclaimer_style))

    doc.build(story)
    return buffer.getvalue()
