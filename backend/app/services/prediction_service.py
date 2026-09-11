import io
from PIL import Image

from app.ml.inference import predict_crop_disease
from app.services.llm_service import LLMService
from app.services.context_service import build_context
from app.services.weather_service import get_current_weather
from app.services.location_service import reverse_geocode


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

    # =========================
    # LOCATION
    # =========================

    location = farm_data.get(
        "location",
        {}
    )

    latitude = location.get(
        "latitude"
    )

    longitude = location.get(
        "longitude"
    )


    # =========================
    # REVERSE GEOCODING
    # =========================

    if latitude is not None and longitude is not None:

        try:

            location = reverse_geocode(
                latitude=latitude,
                longitude=longitude
            )

        except Exception as e:

            print(
                "Location API Error:",
                e
            )

            # Keep coordinates if reverse
            # geocoding fails

            location = {
                "latitude": latitude,
                "longitude": longitude
            }


    # =========================
    # WEATHER
    # =========================

    weather = {}

    if latitude is not None and longitude is not None:

        try:

            weather = get_current_weather(
                latitude=latitude,
                longitude=longitude
            )

        except Exception as e:

            print(
                "Weather API Error:",
                e
            )

            weather = {}


    # =========================
    # CLEAN FARM DATA
    # =========================

    clean_farm_data = {
        key: value
        for key, value in farm_data.items()
        if key != "location"
    }


    # =========================
    # BUILD CONTEXT
    # =========================

    context = build_context(
        weather=weather,
        location=location,
        farm_data=clean_farm_data
    )

    latitude = location.get(
        "latitude"
    )

    longitude = location.get(
        "longitude"
    )

    weather = {}

    if latitude is not None and longitude is not None:

        try:

            weather = get_current_weather(
                latitude=latitude,
                longitude=longitude
            )

        except Exception as e:

            print(
                "Weather API Error:",
                e
            )

            weather = {}


    # Remove location from farm data
    clean_farm_data = {
        key: value
        for key, value in farm_data.items()
        if key != "location"
    }


    context = build_context(
        weather=weather,
        location=location,
        farm_data=clean_farm_data
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

        "crop": "unknown",

        "detection": {

            "disease": disease,

            "confidence": confidence,

            "top_predictions": top_predictions

        },

        "context": context,

        "advisory": advisory

    }