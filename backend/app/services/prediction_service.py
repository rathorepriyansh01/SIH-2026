import io
from PIL import Image

from app.ml.inference import predict_crop_disease
from app.services.llm_service import LLMService
from app.services.context_service import build_context
from app.services.weather_service import get_current_weather
from app.services.location_service import reverse_geocode
from app.services.risk_service import calculate_risk


llm_service = LLMService()


async def process_prediction_request(
    file,
    farm_data
):

    # =====================================================
    # 1. READ IMAGE
    # =====================================================

    image_bytes = await file.read()

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")


    # =====================================================
    # 2. ML PREDICTION
    # =====================================================

    result = predict_crop_disease(image)

    disease = result.get("disease")

    confidence = result.get("confidence")

    top_predictions = result.get(
        "top_predictions",
        []
    )


    # =====================================================
    # 3. LOCATION
    # =====================================================

    location_data = farm_data.get(
        "location",
        {}
    )

    latitude = location_data.get(
        "latitude"
    )

    longitude = location_data.get(
        "longitude"
    )


    # =====================================================
    # 4. REVERSE GEOCODING
    # =====================================================

    location = {
        "latitude": latitude,
        "longitude": longitude
    }

    if latitude is not None and longitude is not None:

        try:

            location = reverse_geocode(
                latitude=latitude,
                longitude=longitude
            )

            # Make sure coordinates are preserved
            location["latitude"] = latitude
            location["longitude"] = longitude

        except Exception as e:

            print(
                "Location API Error:",
                e
            )


    # =====================================================
    # 5. WEATHER
    # =====================================================

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

            weather = {
                "available": False,
                "error": "Weather data unavailable"
            }


    # =====================================================
    # 6. CLEAN FARM DATA
    # =====================================================

    clean_farm_data = {
        key: value
        for key, value in farm_data.items()
        if key != "location"
    }


    # =====================================================
    # 7. BUILD AI CONTEXT
    # =====================================================

    context = build_context(
        weather=weather,
        location=location,
        farm_data=clean_farm_data
    )

    # =====================================================
    # 8. DETERMINISTIC RISK CALCULATION
    # =====================================================

    risk_assessment = calculate_risk(
    disease=disease,
    confidence=confidence,
    weather=weather,
    farm_data=clean_farm_data
)


    # =====================================================
    # 8. AI ADVISORY
    # =====================================================

    try:

        advisory = llm_service.generate_advisory(
            disease=disease,
            confidence=confidence,
            top_predictions=top_predictions,
            context=context
        )

    except Exception as e:

        print(
            "LLM Advisory Error:",
            e
        )

        advisory = {

            "summary":
                "AI advisory is currently unavailable.",

            "risk_level":
                "Unknown",

            "severity":
                "Unknown",

            "immediate_actions": [
                "Consult a local agricultural expert."
            ],

            "prevention_tips": [
                "Continue monitoring the affected plant."
            ],

            "monitoring_advice":
                "Monitor the crop regularly for changes.",

            "expert_consultation_required":
                True,

            "confidence_note":
                "AI advisory could not be generated."

        }

    


    # =====================================================
    # 9. FINAL RESPONSE
    # =====================================================

    return {

    "success": True,

    "crop": farm_data.get(
        "crop",
        "Tomato"
    ),

    "detection": {

        "disease": disease,

        "confidence": confidence,

        "top_predictions":
            top_predictions

    },

    "risk_assessment": risk_assessment,

    "context": context,

    "advisory": advisory

}