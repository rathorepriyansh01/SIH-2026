"""
Agricultural Advisory Prompt

This prompt is designed to generate the complete advisory object
required by Result.jsx.

IMPORTANT:
- Do NOT convert this prompt into an f-string.
- JSON examples intentionally contain { } characters.
- Dynamic values are inserted using .replace().
- Never invent missing weather data.
- Never invent pesticide dosage.
"""


def build_advisory_prompt(
    disease: str,
    confidence: float,
    top_predictions: list,
    context: dict,
    language: str = "English"
):

    # =========================================================
    # 1. NORMALIZE INPUT
    # =========================================================

    language = str(language or "English").strip()

    if not language:
        language = "English"

    disease = str(disease or "Unknown")

    try:
        confidence = float(confidence or 0)
    except (TypeError, ValueError):
        confidence = 0.0


    # =========================================================
    # 2. CONFIDENCE LEVEL
    # =========================================================

    if confidence > 1:
        confidence_ratio = confidence / 100
    else:
        confidence_ratio = confidence

    if confidence_ratio >= 0.90:
        confidence_level = "High"

    elif confidence_ratio >= 0.75:
        confidence_level = "Moderate-High"

    elif confidence_ratio >= 0.60:
        confidence_level = "Moderate"

    else:
        confidence_level = "Low"


    # =========================================================
    # 3. FORMAT TOP PREDICTIONS
    # =========================================================

    formatted_predictions = []

    if isinstance(top_predictions, list):

        for prediction in top_predictions:

            if isinstance(prediction, dict):

                prediction_disease = prediction.get(
                    "disease",
                    "Unknown"
                )

                prediction_confidence = prediction.get(
                    "confidence",
                    0
                )

                formatted_predictions.append(
                    {
                        "disease": prediction_disease,
                        "confidence": prediction_confidence
                    }
                )

            else:

                formatted_predictions.append(
                    str(prediction)
                )


    # =========================================================
    # 4. CONTEXT
    # =========================================================

    context = context or {}

    weather = context.get(
        "weather",
        {}
    )

    location = context.get(
        "location",
        {}
    )

    farm = context.get(
        "farm",
        {}
    )


    # =========================================================
    # 5. OUTPUT SCHEMA
    # =========================================================

    output_schema = """
{
  "summary": "Short farmer-friendly final summary",

  "risk_level": "LOW | MODERATE | HIGH | CRITICAL | Unknown",

  "severity": "Low | Moderate | High | Critical | Unknown",

  "disease_analysis": {
    "name": "Disease name",

    "description": "Clear explanation of the detected disease",

    "symptoms": [
      "Symptom 1",
      "Symptom 2",
      "Symptom 3"
    ],

    "possible_causes": [
      "Possible cause 1",
      "Possible cause 2"
    ],

    "development": "How the disease develops",

    "spread": "How the disease spreads",

    "favorable_conditions": [
      "Condition 1",
      "Condition 2"
    ],

    "differential_notes": [
      "How this disease can be distinguished from the most relevant alternative diagnosis"
    ]
  },

  "pest_analysis": [
    {
      "identification": "Likely pest or pest risk",

      "plant_part_affected": "Plant part affected",

      "life_cycle_stage": "Relevant life-cycle stage",

      "damage_symptoms": [
        "Damage symptom 1",
        "Damage symptom 2"
      ],

      "early_warning_signs": [
        "Early warning sign 1",
        "Early warning sign 2"
      ],

      "ipm": {
        "cultural": [
          "Cultural management action"
        ],

        "mechanical": [
          "Mechanical or physical management action"
        ],

        "biological": [
          "Biological management action"
        ],

        "chemical": [
          "Safe chemical-management guidance"
        ]
      },

      "chemical_recommendations": [
        {
          "product": "Product or active ingredient only when sufficiently supported",
          "target": "Target pest",
          "dosage": null,
          "application": "Application method",
          "timing": "Recommended timing",
          "frequency": "Recommended frequency",
          "notes": "Follow registered product label and local agricultural guidance"
        }
      ]
    }
  ],

  "chemical_recommendations": [
    {
      "product": "Product or active ingredient",
      "target": "Disease or pest target",
      "dosage": null,
      "application": "Application method",
      "timing": "Recommended timing",
      "frequency": "Recommended frequency",
      "notes": "Safety and label guidance"
    }
  ],

  "weather": {
    "current_summary": "Current weather interpretation",

    "current": {
      "temperature_c": null,
      "humidity_percent": null,
      "rain_mm": null,
      "wind_speed_kmh": null
    },

    "rain_prediction": {
      "summary": "Rain forecast interpretation",
      "rain_expected": null
    },

    "previous_5_days": [
      {
        "date": "Date",
        "temperature_c": null,
        "humidity_percent": null,
        "rain_mm": null,
        "rain_probability": null
      }
    ],

    "next_5_days": [
      {
        "date": "Date",
        "temperature_c": null,
        "humidity_percent": null,
        "rain_mm": null,
        "rain_probability": null
      }
    ],

    "disease_weather_risk": {
      "level": "LOW | MODERATE | HIGH | Unknown",
      "summary": "Disease weather risk explanation"
    },

    "pest_weather_risk": {
      "level": "LOW | MODERATE | HIGH | Unknown",
      "summary": "Pest weather risk explanation"
    },

    "spraying_advice": [
      "Weather-aware spraying recommendation"
    ]
  },

  "monitoring_plan": {
    "frequency": "How often the farmer should monitor",

    "monitoring_frequency": "Farmer-friendly monitoring frequency",

    "priority_zone": "Most important part or area of the crop to inspect",

    "what_to_monitor": [
      "Item to monitor"
    ],

    "early_warning_signs": [
      "Early warning sign"
    ],

    "warning_signs": [
      "Warning sign"
    ],

    "inspection_interval": "Specific inspection interval",

    "next_check": "When the farmer should inspect again"
  },

  "risk_assessment": {
    "level": "LOW | MODERATE | HIGH | CRITICAL | Unknown",

    "severity": "Low | Moderate | High | Critical | Unknown",

    "spread_risk": "LOW | MODERATE | HIGH | Unknown",

    "reason": "Reason for the risk assessment"
  },

  "action_plan": {
    "now": [
      "Action to perform immediately"
    ],

    "next_24_hours": [
      "Action for the next 24 hours"
    ],

    "next_3_days": [
      "Action for the next 3 days"
    ],

    "next_5_days": [
      "Action for the next 5 days"
    ],

    "prevention": [
      "Preventive action"
    ],

    "long_term_management": [
      "Long-term management action"
    ]
  },

  "expert_consultation_required": false,

  "confidence_note": "Explain the ML confidence and diagnostic uncertainty"
}
"""


    # =========================================================
    # 6. MAIN PROMPT
    # =========================================================

    prompt = """
You are an agricultural advisory AI.

Your task is to analyze the crop disease prediction,
farm information, location and available weather information
and generate a complete practical advisory for the farmer.

The detected disease is:

<<<DISEASE>>>

The ML model confidence is:

<<<CONFIDENCE>>>

Confidence category:

<<<CONFIDENCE_LEVEL>>>

Top model predictions:

<<<FORMATTED_PREDICTIONS>>>

Farm information:

<<<FARM>>>

Location information:

<<<LOCATION>>>

Available weather information:

<<<WEATHER>>>


=========================================================
PRIMARY OBJECTIVE
=========================================================

Generate a complete agricultural advisory that can be directly
displayed in a farmer-facing web application.

The response MUST contain every required section from the
JSON schema below.

Do not omit fields.

Do not rename fields.

Do not replace fields with alternative names.

Do not return markdown.

Do not return explanations outside JSON.

Return ONLY one valid JSON object.


=========================================================
LANGUAGE
=========================================================

Generate all farmer-facing explanatory text in:

<<<LANGUAGE>>>

The JSON key names MUST remain in English exactly as specified.

Only the values/text intended for the farmer should be translated.

For example:

Correct:

{
  "summary": "translated farmer-facing summary"
}

Incorrect:

{
  "सारांश": "..."
}


=========================================================
MISSING DATA RULE
=========================================================

Never invent missing information.

If weather information is unavailable:

- Do not invent temperature.
- Do not invent humidity.
- Do not invent rainfall.
- Do not invent wind speed.
- Do not invent historical weather.
- Do not invent forecast values.

Use null for unavailable numeric weather values.

Use empty arrays only when there is genuinely no relevant
information available.

For explanatory weather fields, clearly state that the data
is unavailable.

However, do NOT leave the entire advisory empty just because
weather data is unavailable.

Disease analysis, monitoring guidance and general crop-management
guidance can still be generated from the disease prediction and
farm context.


=========================================================
DISEASE ANALYSIS
=========================================================

Provide:

- disease name
- disease description
- common symptoms
- possible causes
- disease development
- disease spread
- favorable environmental conditions
- differential diagnosis notes

The differential_notes field is REQUIRED.

Use the top model predictions to explain the most relevant
alternative diagnoses.

Do not claim that an alternative disease is definitely present.

Explain how the farmer can distinguish the predicted disease
from the closest alternatives using visible symptoms.


=========================================================
DIFFERENTIAL NOTES
=========================================================

The detected disease is:

<<<DISEASE>>>

The top predictions are:

<<<FORMATTED_PREDICTIONS>>>

Create at least one useful differential note whenever there are
alternative predictions.

For example, explain differences in:

- lesion appearance
- leaf location
- color
- pattern
- spread pattern
- environmental conditions
- other visible symptoms

Do not invent symptoms that contradict the disease.


=========================================================
PEST ANALYSIS
=========================================================

Analyze possible pest pressure relevant to the crop and
available information.

If a pest is reasonably relevant:

Return one or more objects inside:

"pest_analysis"

Each pest object MUST contain:

- identification
- plant_part_affected
- life_cycle_stage
- damage_symptoms
- early_warning_signs
- ipm
- chemical_recommendations

The IPM object MUST contain:

- cultural
- mechanical
- biological
- chemical


If no meaningful pest risk can be inferred:

Return an empty array:

"pest_analysis": []

Do not invent a pest merely to fill the section.

The frontend must be able to safely display an empty pest result.


=========================================================
CHEMICAL RECOMMENDATIONS
=========================================================

Provide chemical recommendations only when reasonably justified
by the disease or pest assessment.

Never invent a pesticide dosage.

The dosage field MUST remain:

null

unless an exact dosage is explicitly supplied by trusted input
data.

Do not fabricate concentrations.

Do not fabricate application rates.

Do not fabricate brand-specific instructions.

Where chemical management is mentioned:

- follow the registered product label
- follow local agricultural regulations
- use appropriate protective equipment
- respect pre-harvest intervals
- avoid unsafe application

The top-level field:

"chemical_recommendations"

MUST always exist.

If no chemical recommendation is appropriate, return:

[]


=========================================================
WEATHER ANALYSIS
=========================================================

Analyze available weather information.

The weather object MUST always contain:

- current_summary
- current
- rain_prediction
- previous_5_days
- next_5_days
- disease_weather_risk
- pest_weather_risk
- spraying_advice


=========================================================
CURRENT WEATHER
=========================================================

Use the supplied weather data exactly.

Map values to:

temperature_c

humidity_percent

rain_mm

wind_speed_kmh

Do not change units unless the supplied data requires it.

If the supplied weather data uses a different rainfall key,
map it to rain_mm in the final response.

If unavailable, use null.


=========================================================
RAINFALL PREDICTION
=========================================================

Analyze the available forecast.

The object MUST contain:

"summary"

and:

"rain_expected"

Use true when rain is clearly expected.

Use false when available forecast information indicates
no meaningful rain.

Use null when forecast information is unavailable.


=========================================================
PREVIOUS 5 DAYS
=========================================================

Use available previous weather data.

Do not invent missing days.

If no historical data is available:

"previous_5_days": []


=========================================================
NEXT 5 DAYS
=========================================================

Use available forecast data.

Do not invent missing forecast days.

If no forecast data is available:

"next_5_days": []


=========================================================
DISEASE WEATHER RISK
=========================================================

Determine disease weather risk from the actual available
weather information and known disease requirements.

Allowed levels:

LOW
MODERATE
HIGH
Unknown

Do not use CRITICAL for weather risk.

If weather data is unavailable:

"level": "Unknown"

and explain that the weather risk cannot be reliably assessed.

Do not invent weather conditions.


=========================================================
PEST WEATHER RISK
=========================================================

Determine pest weather risk only when sufficient weather
and crop/pest information exists.

Allowed levels:

LOW
MODERATE
HIGH
Unknown

If there is no meaningful pest information or insufficient
weather information:

Use:

"level": "Unknown"

Do not invent a pest outbreak.


=========================================================
SPRAYING ADVICE
=========================================================

Provide practical weather-aware spraying guidance.

Consider:

- rainfall
- humidity
- wind
- temperature
- disease pressure

If weather data is insufficient for a safe spraying decision,
say that spraying conditions cannot be reliably assessed.

Do not invent exact pesticide dosage.

Do not recommend spraying immediately merely because a disease
was detected.


=========================================================
RISK ASSESSMENT
=========================================================

Provide:

- level
- severity
- spread_risk
- reason

Use the disease prediction confidence and available farm/weather
conditions.

Allowed risk levels:

LOW
MODERATE
HIGH
CRITICAL
Unknown

Do not claim certainty when model confidence is low.

The deterministic risk calculation performed by the backend
may be used by the frontend as the authoritative numerical
risk score.

Do not invent a numerical risk_score here.

The risk assessment reason should explain:

- model confidence
- disease severity
- humidity
- rainfall
- temperature
- farm conditions
- likely spread conditions

Only mention factors that are actually available.


=========================================================
ACTION PLAN
=========================================================

The action_plan object is REQUIRED.

It MUST contain exactly these fields:

- now
- next_24_hours
- next_3_days
- next_5_days
- prevention
- long_term_management


-------------------------
NOW
-------------------------

Give practical actions that the farmer can perform immediately.

Examples:

- inspect affected plants
- remove severely affected leaves
- improve airflow
- check irrigation
- isolate severely affected plants
- remove infected plant debris

Choose actions appropriate to the actual disease.


-------------------------
NEXT 24 HOURS
-------------------------

Give actions specifically for the next 24 hours.

Examples:

- inspect surrounding plants
- check new symptoms
- review irrigation
- remove newly infected material
- inspect lower leaves


-------------------------
NEXT 3 DAYS
-------------------------

Give actions for the next three days.

Examples:

- continue scouting
- check whether symptoms are spreading
- maintain proper irrigation
- monitor plant vigor
- reassess disease progression


-------------------------
NEXT 5 DAYS
-------------------------

Give actions for the next five days.

Examples:

- reassess disease spread
- continue preventive management
- inspect new growth
- review weather-related risk
- reassess treatment needs


-------------------------
PREVENTION
-------------------------

Provide practical disease and pest prevention measures.


-------------------------
LONG TERM MANAGEMENT
-------------------------

Provide long-term crop-management recommendations.


=========================================================
MONITORING PLAN
=========================================================

The monitoring_plan object is REQUIRED.

It MUST contain:

- frequency
- monitoring_frequency
- priority_zone
- what_to_monitor
- early_warning_signs
- warning_signs
- inspection_interval
- next_check


-------------------------
FREQUENCY
-------------------------

Provide a practical monitoring frequency.

Examples:

Inspect daily

Inspect every 2 days

Inspect every 3 days

Inspect every 5 days


-------------------------
MONITORING FREQUENCY
-------------------------

Give the same recommendation in farmer-friendly language.


-------------------------
PRIORITY ZONE
-------------------------

Always identify the most important part of the crop to inspect.

Examples:

- lower leaves
- affected plants
- plants surrounding the infected area
- new growth
- low-airflow areas
- field edges


-------------------------
WHAT TO MONITOR
-------------------------

Provide specific things the farmer should inspect.


-------------------------
EARLY WARNING SIGNS
-------------------------

Always provide useful early warning signs.


-------------------------
WARNING SIGNS
-------------------------

Provide signs that indicate disease or pest pressure is increasing.


-------------------------
INSPECTION INTERVAL
-------------------------

Always provide a practical interval.

Examples:

Every 24 hours

Every 2 days

Every 3 days

Every 5 days


-------------------------
NEXT CHECK
-------------------------

Always tell the farmer when the next inspection should happen.


=========================================================
CONFIDENCE NOTE
=========================================================

Explain that the ML prediction is not a definitive diagnosis.

Mention the model confidence:

<<<CONFIDENCE>>>

and confidence category:

<<<CONFIDENCE_LEVEL>>>

If confidence is moderate or low, recommend visual verification
and expert consultation when appropriate.


=========================================================
EXPERT CONSULTATION
=========================================================

Set:

"expert_consultation_required": true

when:

- confidence is low
- symptoms are ambiguous
- disease could be confused with another serious disease
- treatment requires professional confirmation
- available data is insufficient for a safe recommendation

Otherwise use false.


=========================================================
OUTPUT REQUIREMENTS
=========================================================

Use EXACTLY the following JSON structure.

Do not rename any keys.

Do not remove any keys.

Do not add markdown.

Do not wrap JSON in ```.

Do not write anything before or after the JSON.

$output_schema


=========================================================
FINAL VALIDATION BEFORE RESPONSE
=========================================================

Before returning the JSON, verify that:

1. disease_analysis exists
2. disease_analysis.differential_notes exists
3. pest_analysis exists
4. chemical_recommendations exists
5. weather exists
6. weather.current exists
7. weather.rain_prediction exists
8. weather.previous_5_days exists
9. weather.next_5_days exists
10. weather.disease_weather_risk exists
11. weather.pest_weather_risk exists
12. weather.spraying_advice exists
13. risk_assessment exists
14. action_plan exists
15. action_plan.now exists
16. action_plan.next_24_hours exists
17. action_plan.next_3_days exists
18. action_plan.next_5_days exists
19. action_plan.prevention exists
20. action_plan.long_term_management exists
21. monitoring_plan exists
22. monitoring_plan.frequency exists
23. monitoring_plan.monitoring_frequency exists
24. monitoring_plan.priority_zone exists
25. monitoring_plan.early_warning_signs exists
26. monitoring_plan.inspection_interval exists
27. summary exists
28. confidence_note exists
29. JSON is valid
30. No invented weather data exists
31. No invented pesticide dosage exists


Return ONLY valid JSON.
"""


    # =========================================================
    # 7. INSERT OUTPUT SCHEMA SAFELY
    # =========================================================

    prompt = prompt.replace(
        "$output_schema",
        output_schema
    )


    # =========================================================
    # 8. INSERT DYNAMIC DATA SAFELY
    # =========================================================

    prompt = prompt.replace(
        "<<<LANGUAGE>>>",
        language
    )

    prompt = prompt.replace(
        "<<<DISEASE>>>",
        disease
    )

    prompt = prompt.replace(
        "<<<CONFIDENCE>>>",
        str(round(confidence, 2))
    )

    prompt = prompt.replace(
        "<<<CONFIDENCE_LEVEL>>>",
        confidence_level
    )

    prompt = prompt.replace(
        "<<<FORMATTED_PREDICTIONS>>>",
        json_safe_string(formatted_predictions)
    )

    prompt = prompt.replace(
        "<<<FARM>>>",
        json_safe_string(farm)
    )

    prompt = prompt.replace(
        "<<<LOCATION>>>",
        json_safe_string(location)
    )

    prompt = prompt.replace(
        "<<<WEATHER>>>",
        json_safe_string(weather)
    )


    # =========================================================
    # 9. RETURN FINAL PROMPT
    # =========================================================

    return prompt


def json_safe_string(value):
    """
    Convert Python data into a readable JSON string.

    This function is intentionally separate from the prompt so
    that the prompt itself never needs to be an f-string.
    """

    import json

    try:

        return json.dumps(
            value,
            ensure_ascii=False,
            indent=2,
            default=str
        )

    except Exception:

        return str(value)