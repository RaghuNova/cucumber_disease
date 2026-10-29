"""
FastAPI Backend Application for CucumberCare AI
Serves:
- /api/health
- /api/diseases
- /api/predict
- /api/speak
- /api/report
"""

import os
import io
import logging
from typing import Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from classifier import get_classifier, PRIMARY_CLASSES
from advisor import get_advisor, STATIC_PATHOLOGY_DATABASE
from tts import generate_kannada_audio
from report import generate_pdf_report

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cucumbercare-api")

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CucumberCare AI services...")
    classifier = get_classifier()
    logger.info(f"Loaded classifier with {len(classifier.labels)} labels.")
    advisor = get_advisor()
    logger.info("Agronomic Advisor initialized.")
    yield

app = FastAPI(
    title="CucumberCare AI API",
    description="High-precision cucumber leaf disease classification and botanical agronomic guidance.",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    classifier = get_classifier()
    return {
        "status": "healthy",
        "service": "CucumberCare AI Diagnostic Engine",
        "model": "hf-hub:ixrbhii/cucumber-disease-convnext",
        "architecture": "ConvNeXt Small",
        "num_classes": len(classifier.labels),
        "classes": classifier.labels,
        "primary_classes": list(PRIMARY_CLASSES),
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "groq_configured": bool(os.getenv("GROQ_API_KEY"))
    }

@app.get("/api/diseases")
def get_all_diseases():
    """
    Returns verified botanical and pathological metadata for all 8 categories.
    """
    diseases = []
    for name, data in STATIC_PATHOLOGY_DATABASE.items():
        diseases.append({
            "name": name,
            "scientific_name": data.get("scientific_name", ""),
            "summary": data.get("summary", ""),
            "symptoms": data.get("symptoms", []),
            "contributing_factors": data.get("contributing_factors", []),
            "immediate_actions": data.get("immediate_actions", []),
            "prevention": data.get("prevention", []),
            "is_primary": name in PRIMARY_CLASSES
        })
    return {"categories": diseases}

@app.post("/api/predict")
async def predict_leaf(file: UploadFile = File(...)):
    """
    Receives leaf photograph, runs ConvNeXt inference, and returns diagnosis
    with Gemini agronomic advice.
    """
    # Validate mime type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be a valid image (JPEG, PNG, WEBP)."
        )

    try:
        image_bytes = await file.read()
        if len(image_bytes) > 15 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image file exceeds maximum allowable size (15 MB)."
            )

        # 1. Run classifier
        classifier = get_classifier()
        prediction_result = classifier.predict(image_bytes)

        # 2. Get botanical guidance from Agronomic Advisor
        advisor = get_advisor()
        advice_result = advisor.get_advice(
            predicted_class=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            top_3=prediction_result["top_3"]
        )

        response_payload = {
            "prediction": prediction_result["prediction"],
            "confidence": prediction_result["confidence"],
            "confidence_percentage": prediction_result["confidence_percentage"],
            "confidence_level": prediction_result["confidence_level"],
            "confidence_note": prediction_result["confidence_note"],
            "is_primary": prediction_result["is_primary"],
            "top_3": prediction_result["top_3"],
            "all_probabilities": prediction_result["all_probabilities"],
            "is_plausible_leaf": prediction_result["is_plausible_leaf"],
            "warning": prediction_result["warning"],
            "image_dimensions": prediction_result["image_dimensions"],
            
            # Advisor clinical details (Section A)
            "scientific_name": advice_result["scientific_name"],
            "provider": advice_result["provider"],
            "narrative": advice_result["narrative"],
            "what_it_is": advice_result.get("what_it_is", ""),
            "common_visible_symptoms": advice_result.get("common_visible_symptoms", []),
            "likely_causes": advice_result.get("likely_causes", []),
            "distinguishing_features": advice_result.get("distinguishing_features", ""),
            "immediate_actions": advice_result.get("immediate_actions", []),
            "prevention_checklist": advice_result.get("prevention_checklist", []),
            "when_to_seek_expert": advice_result.get("when_to_seek_expert", ""),
            "treatment_cautions": advice_result.get("treatment_cautions", ""),
            "kannada_audio_text": advice_result["kannada_audio_text"],
            
            # Section B: Nutritional & Physiological Assessment
            "nutrient_assessment": advice_result.get("nutrient_assessment", {}),
            
            "disclaimer": advice_result["disclaimer"],
            "filename": file.filename
        }

        return JSONResponse(content=response_payload)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Prediction pipeline error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while analyzing the leaf image. Please try again with a clearer photograph."
        )

@app.get("/api/speak")
def stream_kannada_speech(text: str = None, condition: str = None):
    """
    Streams Kannada audio MP3. Either from explicit text or default condition summary.
    """
    if not text and condition:
        static_info = STATIC_PATHOLOGY_DATABASE.get(condition, {})
        text = static_info.get("kannada_summary", "")

    if not text:
        text = "ಸೌತೆಕಾಯಿ ಎಲೆಗಳ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ."

    audio_bytes = generate_kannada_audio(text)
    if not audio_bytes:
        raise HTTPException(status_code=500, detail="Could not generate spoken audio.")

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={"Content-Disposition": "inline; filename=cucumber_advice.mp3"}
    )

class ReportRequest(BaseModel):
    prediction: str
    confidence_percentage: float
    confidence_level: str
    scientific_name: str = ""
    provider: str = "Gemini 3.6 Flash"
    top_3: list = []
    what_it_is: str = ""
    common_visible_symptoms: list = []
    likely_causes: list = []
    distinguishing_features: str = ""
    immediate_actions: list = []
    prevention_checklist: list = []
    when_to_seek_expert: str = ""
    treatment_cautions: str = ""
    nutrient_assessment: dict = {}
    disclaimer: str = ""

@app.post("/api/report")
def download_pdf_report(payload: ReportRequest):
    """
    Generates downloadable PDF diagnostic report.
    """
    try:
        pdf_bytes = generate_pdf_report(payload.model_dump())
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=CucumberCare_Report_{payload.prediction.replace(' ', '_')}.pdf"
            }
        )
    except Exception as e:
        logger.error(f"Failed to generate PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to compile PDF report.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
