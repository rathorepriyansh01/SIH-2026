def calculate_risk(
    disease,
    confidence,
    weather=None,
    farm_data=None
):
    """
    Deterministic crop disease risk calculation.

    Risk is calculated from:
    - ML confidence
    - disease type
    - humidity
    - rainfall
    - upcoming rain probability
    - farm conditions
    """

    weather = weather or {}
    farm_data = farm_data or {}

    score = 0
    risk_factors = []

    # =====================================================
    # 1. ML CONFIDENCE
    # =====================================================

    confidence = float(confidence or 0)

    if confidence > 1:
        confidence = confidence / 100

    if confidence >= 0.90:
        score += 30
        risk_factors.append(
            "High-confidence disease detection"
        )

    elif confidence >= 0.75:
        score += 22
        risk_factors.append(
            "Moderate-high confidence disease detection"
        )

    elif confidence >= 0.60:
        score += 15

    else:
        score += 8
        risk_factors.append(
            "Lower model confidence"
        )


    # =====================================================
    # 2. DISEASE SEVERITY
    # =====================================================

    disease_name = str(
        disease or ""
    ).lower()

    severe_keywords = [
        "late blight",
        "yellow leaf curl",
        "mosaic",
        "bacterial",
        "septoria"
    ]

    moderate_keywords = [
        "early blight",
        "leaf mold",
        "target spot",
        "spider mite"
    ]

    if any(
        keyword in disease_name
        for keyword in severe_keywords
    ):

        score += 20

        risk_factors.append(
            "Disease can spread rapidly under favorable conditions"
        )

    elif any(
        keyword in disease_name
        for keyword in moderate_keywords
    ):

        score += 14

        risk_factors.append(
            "Disease requires active monitoring"
        )

    else:

        score += 10


    # =====================================================
    # 3. CURRENT WEATHER
    # =====================================================

    current = weather.get(
        "current",
        {}
    )

    humidity = current.get(
        "humidity_percent"
    )

    temperature = current.get(
        "temperature_c"
    )

    rainfall = current.get(
        "precipitation_mm"
    )


    # Humidity
    if humidity is not None:

        if humidity >= 90:

            score += 15

            risk_factors.append(
                "Very high humidity favors disease development"
            )

        elif humidity >= 80:

            score += 10

            risk_factors.append(
                "High humidity increases disease pressure"
            )

        elif humidity >= 70:

            score += 5


    # Rainfall
    if rainfall is not None:

        if rainfall >= 5:

            score += 10

            risk_factors.append(
                "Recent rainfall increases leaf wetness and disease spread"
            )

        elif rainfall > 0:

            score += 5


    # =====================================================
    # 4. UPCOMING WEATHER
    # =====================================================

    next_days = weather.get(
        "next_5_days",
        []
    )

    high_rain_days = 0

    for day in next_days:

        probability = day.get(
            "rain_probability",
            0
        )

        try:
            probability = float(
                probability or 0
            )
        except (TypeError, ValueError):
            probability = 0

        if probability >= 70:
            high_rain_days += 1


    if high_rain_days >= 4:

        score += 15

        risk_factors.append(
            "Frequent rainfall is expected over the next few days"
        )

    elif high_rain_days >= 2:

        score += 10

        risk_factors.append(
            "Rain is expected on multiple upcoming days"
        )

    elif high_rain_days >= 1:

        score += 5


    # =====================================================
    # 5. TEMPERATURE
    # =====================================================

    if temperature is not None:

        try:

            temperature = float(
                temperature
            )

            if 20 <= temperature <= 30:

                score += 5

                risk_factors.append(
                    "Temperature is favorable for many tomato diseases"
                )

        except (
            TypeError,
            ValueError
        ):
            pass


    # =====================================================
    # 6. FARM CONDITIONS
    # =====================================================

    irrigation = str(
        farm_data.get(
            "irrigation",
            ""
        )
    ).lower()

    if (
        "overhead" in irrigation
        or "sprinkler" in irrigation
    ):

        score += 5

        risk_factors.append(
            "Overhead irrigation can increase leaf wetness"
        )


    # =====================================================
    # 7. LIMIT SCORE
    # =====================================================

    score = min(
        max(score, 0),
        100
    )


    # =====================================================
    # 8. RISK LEVEL
    # =====================================================

    if score >= 80:

        risk_level = "CRITICAL"

    elif score >= 60:

        risk_level = "HIGH"

    elif score >= 30:

        risk_level = "MODERATE"

    else:

        risk_level = "LOW"


    # =====================================================
    # 9. RESULT
    # =====================================================

    return {

        "risk_score": score,

        "risk_level": risk_level,

        "risk_factors": risk_factors,

        "weather_risk": (
            "HIGH"
            if high_rain_days >= 3
            or (
                humidity is not None
                and humidity >= 90
            )
            else "MODERATE"
        )

    }