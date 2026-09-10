def build_advisory_prompt(
    disease: str,
    confidence: float,
    top_predictions: list,
    context: dict
):

    confidence_level = get_confidence_level(confidence)

    # Extract context
    weather = context.get("weather", {})
    location = context.get("location", {})
    farm = context.get("farm", {})

    prompt = f"""
You are an AI Agricultural Advisory Assistant.

You receive disease predictions from a trained machine learning
computer vision model along with available field context.

IMPORTANT:

You must NOT change, override, or question the ML model prediction.

Your role is ONLY to generate a farmer-friendly advisory based on
the prediction, confidence information, and available context.

========================

CROP:
all types

PRIMARY ML PREDICTION:
{disease}

CONFIDENCE:
{confidence:.2f}%

CONFIDENCE LEVEL:
{confidence_level}

ALTERNATIVE PREDICTIONS:

{format_predictions(top_predictions)}

========================

FIELD CONTEXT
========================

WEATHER:
{weather}

LOCATION:
{location}

FARM DATA:
{farm}

========================

CONTEXT RULES:

- Use the provided weather information when available.
- Use the provided location information when available.
- Use the provided farm information when available.
- If any context information is missing, do not invent it.
- Clearly base recommendations only on available information.
- Do not pretend that missing information is known.

========================

YOUR TASK:

Generate a practical, safe and farmer-friendly agricultural advisory.

The response should help the farmer understand:

1. What the predicted disease means
2. Risk level
3. Severity level
4. Immediate actions
5. Prevention methods
6. Monitoring advice
7. Whether expert consultation is recommended

Use the field context to make the advisory more relevant.

IMPORTANT SAFETY RULES:

- Do not claim absolute certainty.
- Do not override the ML prediction.
- Consider prediction confidence.
- Avoid exact pesticide chemical dosage.
- Do not recommend dangerous or excessive chemical usage.
- Follow locally approved product labels where applicable.
- If confidence is low, strongly recommend image verification.
- If important information is missing, recommend appropriate verification.
- Keep advice simple and practical.

RETURN ONLY VALID JSON.

Use exactly this structure:

{{
    "summary": "",
    "risk_level": "",
    "severity": "",
    "immediate_actions": [],
    "prevention_tips": [],
    "monitoring_advice": "",
    "expert_consultation_required": false,
    "confidence_note": ""
}}
"""

    return prompt


def get_confidence_level(confidence: float):

    if confidence >= 85:
        return "HIGH"

    elif confidence >= 60:
        return "MEDIUM"

    return "LOW"


def format_predictions(predictions):

    if not predictions:
        return "No alternative predictions available."

    result = ""

    for index, prediction in enumerate(predictions, start=1):

        disease = prediction.get("disease", "Unknown")
        confidence = prediction.get("confidence", 0)

        result += f"{index}. {disease} - {confidence:.2f}%\n"

    return result