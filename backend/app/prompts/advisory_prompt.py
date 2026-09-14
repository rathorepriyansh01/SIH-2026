def build_advisory_prompt(
    disease: str,
    confidence: float,
    top_predictions: list,
    context: dict
):

    confidence_level = get_confidence_level(confidence)

    weather = context.get("weather", {})
    location = context.get("location", {})
    farm = context.get("farm", {})

    # JSON schema is kept outside the f-string
    # so Python does not treat { } as format specifiers.

    output_schema = """
{
  "summary": "",
  "disease_analysis": {
    "name": "",
    "category": "",
    "description": "",
    "symptoms": [],
    "development": "",
    "spread": "",
    "favorable_conditions": [],
    "severity": "",
    "differential_notes": []
  },

  "pest_analysis": [
    {
      "name": "",
      "scientific_name": "",
      "identification": "",
      "damage_symptoms": [],
      "plant_part_affected": "",
      "life_cycle_stage": "",
      "favorable_conditions": [],
      "early_warning_signs": [],
      "ipm": {
        "monitoring": [],
        "sanitation": [],
        "cultural_control": [],
        "mechanical_control": [],
        "biological_control": [],
        "chemical_control": []
      }
    }
  ],

  "chemical_recommendations": [
    {
      "target": "",
      "active_ingredient": "",
      "formulation": "",
      "dose_per_hectare": null,
      "water_per_hectare": null,
      "application_method": "",
      "applications": null,
      "interval": "",
      "pre_harvest_interval": "",
      "precautions": [],
      "verification_status": ""
    }
  ],

  "weather": {
    "current_summary": "",
    "previous_5_days": [],
    "next_5_days": [],
    "rain_prediction": "",
    "disease_weather_risk": "",
    "pest_weather_risk": "",
    "spraying_advice": ""
  },

  "monitoring_plan": {
    "priority_zone": "",
    "zones": [],
    "monitoring_frequency": "",
    "early_warning_signs": []
  },

  "risk_assessment": {
    "overall_risk": "",
    "reason": "",
    "risk_factors": []
  },

  "action_plan": {
    "now": [],
    "next_24_hours": [],
    "next_3_days": [],
    "next_5_days": [],
    "expert_consultation": ""
  },

  "confidence_note": ""
}
"""

    prompt = f"""
You are an expert agricultural decision-support assistant.

Generate a detailed, practical and farmer-friendly crop health advisory.

IMPORTANT:
Do NOT override the ML prediction.

Detected disease:
{disease}

ML confidence:
{confidence:.2f}%

Confidence level:
{confidence_level}

Alternative predictions:
{format_predictions(top_predictions)}

FARM CONTEXT:
{farm}

LOCATION:
{location}

WEATHER DATA:
{weather}


==================================================
1. DISEASE ANALYSIS
==================================================

Explain the detected disease in simple language.

Include:

- Disease name
- Disease category
- Detailed description
- Common symptoms
- Leaf symptoms
- Stem symptoms
- Fruit symptoms when applicable
- Disease development
- Disease spread
- Conditions that favor disease
- Expected severity
- Difference from similar diseases


==================================================
2. PEST ANALYSIS
==================================================

Identify important pests that may affect the crop based on the crop,
disease and available farm/weather context.

For every relevant pest explain:

- Pest name
- Scientific name if reliably known
- How to identify it
- Damage symptoms
- Plant part affected
- Important life-cycle stage
- Conditions that favor the pest
- Early warning signs

Give Integrated Pest Management advice.

Prioritize:

1. Monitoring
2. Sanitation
3. Cultural control
4. Mechanical control
5. Biological control
6. Chemical control


==================================================
3. CHEMICAL / MEDICINE RECOMMENDATION
==================================================

This section is safety critical.

NEVER invent pesticide or fungicide dosage.

Only provide numerical dosage if it is supported by reliable,
verified agricultural information available in the context.

When verified information exists, provide:

- Target disease/pest
- Active ingredient
- Formulation
- Dose per hectare
- Water requirement per hectare
- Application method
- Number of applications
- Interval
- Pre-harvest interval
- Safety precautions

If dosage is not verified, write:

"Exact dosage should be confirmed from the registered product label
or local agricultural authority."

Do NOT guess a numerical dose.


==================================================
4. CURRENT WEATHER
==================================================

Analyze the available current weather.

Consider:

- Temperature
- Humidity
- Rainfall
- Rain
- Wind
- Weather conditions
- Other available parameters

Explain the effect on:

- Disease development
- Pest activity
- Fungal infection risk
- Bacterial infection risk
- Irrigation
- Spray effectiveness
- Field accessibility
- Crop stress


==================================================
5. PREVIOUS 5 DAYS
==================================================

Use ONLY the historical weather data actually provided.

For each available day mention:

- Date
- Temperature
- Rainfall
- Rain probability if available
- Other important weather conditions
- Possible effect on crop health

Then provide a:

"5-Day Historical Crop Risk Summary"

If historical data is unavailable, explicitly say:

"Historical weather data unavailable."


==================================================
6. NEXT 5 DAYS FORECAST
==================================================

Use ONLY the forecast data actually provided.

For each available day mention:

- Date
- Temperature
- Rain probability
- Expected rainfall
- Wind
- Important weather conditions
- Crop-health implications

Identify:

- Expected rainy days
- Higher rainfall periods
- High humidity periods
- Disease-favorable periods
- Pest-favorable periods
- Potential spraying windows
- Periods when spraying should be avoided


==================================================
7. RAIN PREDICTION
==================================================

Clearly explain:

- Whether rain is expected
- Expected date/day
- Rain probability
- Expected rainfall if available
- Possible crop impact
- Whether spraying should be postponed

Never claim certainty.

Use wording such as:

"forecast indicates"
"probability suggests"
"conditions may favor"


==================================================
8. SPRAYING ADVISORY
==================================================

Based on the available forecast:

Explain:

- Best available spraying period
- Why it is suitable
- When spraying should be avoided
- Rain-related precautions
- Wind-related precautions
- Humidity considerations

Do not invent a spraying window when weather data is insufficient.


==================================================
9. SMART FIELD MONITORING
==================================================

The farmer should NOT be required to photograph the entire farm every day.

Create a practical zone-based monitoring strategy.

Divide the farm into logical zones such as:

Zone A
Zone B
Zone C
Zone D

For each zone recommend:

- Monitoring priority
- What symptoms to check
- Whether RGB image inspection is useful
- Whether thermal/IR/sensor monitoring could help
- When the zone should be inspected again

If risk increases in one zone, recommend targeted inspection
instead of inspecting the entire farm.


==================================================
10. EARLY WARNING
==================================================

Identify warning conditions such as:

- Increasing disease confidence
- Repeated disease detection
- Increasing humidity
- Recent rainfall
- Favorable disease weather
- Increasing pest activity
- Abnormal plant stress
- Rapid disease progression

Classify overall risk as:

LOW
MODERATE
HIGH
CRITICAL

Explain why.


==================================================
11. FARMER ACTION PLAN
==================================================

Provide a practical timeline.

NOW:
What should the farmer do immediately?

NEXT 24 HOURS:
What should be monitored?

NEXT 3 DAYS:
What should be done?

NEXT 5 DAYS:
What should be watched?

WHEN TO CONTACT AN EXPERT:
Specify the conditions requiring expert help.


==================================================
12. CONFIDENCE
==================================================

The ML prediction has confidence:

{confidence:.2f}%

Confidence category:

{confidence_level}

If confidence is low, clearly explain that the prediction should
not be treated as a confirmed diagnosis and recommend verification.


==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do not add:

- Markdown
- ```json
- Explanations outside JSON
- Comments outside JSON

Use exactly this JSON structure:

{output_schema}

CRITICAL RULES:

1. Never fabricate weather data.
2. Never fabricate pesticide dosage.
3. Never fabricate disease facts.
4. Never present low-confidence predictions as confirmed diagnoses.
5. Clearly distinguish uncertainty.
6. Keep advice practical for farmers.
7. Use the supplied weather data whenever available.
8. Do not invent missing weather information.
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