import io
from PIL import Image

from app.ml.inference import predict_crop_disease
from app.services.llm_service import LLMService


# Create LLM service once
llm_service = LLMService()


async def process_prediction_request(file):

    # Read uploaded file
    image_bytes = await file.read()

    # Convert bytes to PIL Image
    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    # ML prediction
    result = predict_crop_disease(image)

    # Get ML prediction details
    disease = result.get("disease")
    confidence = result.get("confidence")
    top_predictions = result.get("top_predictions", [])

    # Generate AI advisory
    try:
        advisory = llm_service.generate_advisory(
            disease=disease,
            confidence=confidence,
            top_predictions=top_predictions
        )

    except Exception as e:
        print("LLM Advisory Error:", e)

        # Fallback if Groq fails
        advisory = {
            "summary": "AI advisory is currently unavailable.",
            "risk_level": "Unknown",
            "severity": "Unknown",
            "immediate_actions": [
                "Consult a local agricultural expert before treatment."
            ],
            "prevention_tips": [
                "Continue monitoring the affected plant."
            ],
            "monitoring_advice": "Monitor the plant regularly for changes.",
            "expert_consultation_required": True,
            "confidence_note": "AI advisory could not be generated."
        }

    # Final response
    return {
        "disease": disease,
        "confidence": confidence,
        "top_predictions": top_predictions,
        "advisory": advisory
    }