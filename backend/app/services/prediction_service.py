import io
from PIL import Image

from app.ml.inference import predict_crop_disease
from app.services.llm_service import LLMService
from app.services.context_service import build_context


llm_service = LLMService()


async def process_prediction_request(
    file,
    farm_data
):

    # =========================
    # READ IMAGE
    # =========================

    image_bytes = await file.read()

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")


    # =========================
    # ML PREDICTION
    # =========================

    result = predict_crop_disease(image)

    disease = result.get("disease")

    confidence = result.get("confidence")

    top_predictions = result.get(
        "top_predictions",
        []
    )


    # =========================
    # CONTEXT
    # =========================

    context = build_context(
        weather={},
        location={},
        farm_data=farm_data
    )


    # =========================
    # AI ADVISORY
    # =========================

    try:

        advisory = llm_service.generate_advisory(
            disease=disease,
            confidence=confidence,
            top_predictions=top_predictions,
            context=context
        )

    except Exception as e:

        print("LLM Advisory Error:", e)

        advisory = {
            "summary": "AI advisory is currently unavailable.",

            "risk_level": "Unknown",

            "severity": "Unknown",

            "immediate_actions": [
                "Consult a local agricultural expert."
            ],

            "prevention_tips": [
                "Continue monitoring the affected plant."
            ],

            "monitoring_advice": (
                "Monitor the crop regularly for changes."
            ),

            "expert_consultation_required": True,

            "confidence_note": (
                "AI advisory could not be generated."
            )
        }


    # =========================
    # FINAL RESPONSE
    # =========================

    return {

        "crop": "Tomato",

        "detection": {

            "disease": disease,

            "confidence": confidence,

            "top_predictions": top_predictions

        },

        "context": context,

        "advisory": advisory

    }