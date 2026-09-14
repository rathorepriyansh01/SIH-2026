import requests


def get_current_weather(
    latitude: float,
    longitude: float
):
    """
    Fetch current, previous 5 days and next 5 days
    weather data using Open-Meteo.
    """

    url = "https://api.open-meteo.com/v1/forecast"

    params = {

        "latitude": latitude,
        "longitude": longitude,

        # ==========================
        # CURRENT WEATHER
        # ==========================

        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "rain,"
            "wind_speed_10m,"
            "wind_direction_10m,"
            "weather_code"
        ),

        # ==========================
        # HOURLY DATA
        # ==========================

        "hourly": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation_probability,"
            "precipitation,"
            "rain,"
            "wind_speed_10m,"
            "weather_code"
        ),

        # ==========================
        # DAILY DATA
        # ==========================

        "daily": (
            "weather_code,"
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_sum,"
            "rain_sum,"
            "precipitation_probability_max,"
            "wind_speed_10m_max,"
            "sunrise,"
            "sunset"
        ),

        # Previous 5 days
        "past_days": 5,

        # Today + next 5 days
        "forecast_days": 6,

        "timezone": "auto",

        "temperature_unit": "celsius",

        "wind_speed_unit": "kmh",

        "precipitation_unit": "mm"
    }


    try:

        response = requests.get(
            url,
            params=params,
            timeout=20
        )

        response.raise_for_status()

        data = response.json()

    except requests.exceptions.RequestException as e:

        print(
            "Open-Meteo API Error:",
            e
        )

        return {
            "available": False,
            "source": "Open-Meteo",
            "error": "Weather data unavailable",
            "current": {
                "temperature_c": None,
                "humidity_percent": None,
                "precipitation_mm": None,
                "rain_mm": None,
                "wind_speed_kmh": None,
                "wind_direction": None,
                "weather_code": None,
                "time": None
            },
            "previous_5_days": [],
            "next_5_days": [],
            "rain_summary": {
                "rain_expected": None,
                "rainy_days_count": 0,
                "rainy_days": []
            },
            "rain_prediction": {
                "summary": "Rain forecast data is unavailable.",
                "rain_expected": None
            },
            "disease_weather_risk": {
                "level": "Unknown",
                "summary": "Weather data is unavailable, so disease weather risk cannot be assessed."
            },
            "pest_weather_risk": {
                "level": "Unknown",
                "summary": "Weather data is unavailable, so pest weather risk cannot be assessed."
            },
            "spraying_advice": []
        }


    # ==================================================
    # CURRENT
    # ==================================================

    current = data.get(
        "current",
        {}
    )


    # ==================================================
    # DAILY
    # ==================================================

    daily = data.get(
        "daily",
        {}
    )


    dates = daily.get(
        "time",
        []
    )

    max_temp = daily.get(
        "temperature_2m_max",
        []
    )

    min_temp = daily.get(
        "temperature_2m_min",
        []
    )

    precipitation = daily.get(
        "precipitation_sum",
        []
    )

    rain = daily.get(
        "rain_sum",
        []
    )

    rain_probability = daily.get(
        "precipitation_probability_max",
        []
    )

    wind = daily.get(
        "wind_speed_10m_max",
        []
    )

    weather_codes = daily.get(
        "weather_code",
        []
    )

    sunrise = daily.get(
        "sunrise",
        []
    )

    sunset = daily.get(
        "sunset",
        []
    )


    # ==================================================
    # BUILD DAILY DATA
    # ==================================================

    daily_weather = []

    for i, date in enumerate(dates):

        daily_weather.append({

            "date": date,

            "max_temperature_c":
                max_temp[i]
                if i < len(max_temp)
                else None,

            "min_temperature_c":
                min_temp[i]
                if i < len(min_temp)
                else None,

            "precipitation_mm":
                precipitation[i]
                if i < len(precipitation)
                else None,

            "rain_mm":
                rain[i]
                if i < len(rain)
                else None,

            "rain_probability_percent":
                rain_probability[i]
                if i < len(rain_probability)
                else None,

            # Alias used by risk_service.py
            "rain_probability":
                rain_probability[i]
                if i < len(rain_probability)
                else 0,

            "max_wind_speed_kmh":
                wind[i]
                if i < len(wind)
                else None,

            "weather_code":
                weather_codes[i]
                if i < len(weather_codes)
                else None,

            "sunrise":
                sunrise[i]
                if i < len(sunrise)
                else None,

            "sunset":
                sunset[i]
                if i < len(sunset)
                else None
        })


    # ==================================================
    # PREVIOUS 5 DAYS
    # ==================================================

    previous_5_days = daily_weather[:5]


    # ==================================================
    # NEXT 5 DAYS
    # ==================================================

    # Index 5 onwards can include future days.
    # Today is normally around index 5 when past_days=5.

    next_5_days = daily_weather[6:11]


    # ==================================================
    # RAIN SUMMARY
    # ==================================================

    rainy_days = []

    for day in next_5_days:

        probability = (
            day.get(
                "rain_probability_percent"
            ) or 0
        )

        rainfall = (
            day.get(
                "precipitation_mm"
            ) or 0
        )

        if probability >= 40 or rainfall > 0:

            rainy_days.append(day)


    # ==================================================
    # SPRAYING ADVICE
    # ==================================================

    spray_advice = []

    for day in next_5_days:

        probability = (
            day.get(
                "rain_probability_percent"
            ) or 0
        )

        rainfall = (
            day.get(
                "precipitation_mm"
            ) or 0
        )

        wind_speed = (
            day.get(
                "max_wind_speed_kmh"
            ) or 0
        )


        if probability >= 60:

            spray_advice.append({

                "date":
                    day.get("date"),

                "suitable":
                    False,

                "reason":
                    "High probability of rain."
            })

        elif rainfall > 2:

            spray_advice.append({

                "date":
                    day.get("date"),

                "suitable":
                    False,

                "reason":
                    "Expected precipitation may reduce spray effectiveness."
            })

        elif wind_speed > 25:

            spray_advice.append({

                "date":
                    day.get("date"),

                "suitable":
                    False,

                "reason":
                    "High wind speed may cause spray drift."
            })

        else:

            spray_advice.append({

                "date":
                    day.get("date"),

                "suitable":
                    True,

                "reason":
                    "Weather conditions appear comparatively suitable, subject to label instructions and field conditions."
            })


    # ==================================================
    # WEATHER RISK
    # ==================================================

    current_humidity = current.get("relative_humidity_2m")
    current_temperature = current.get("temperature_2m")

    high_humidity = (
        current_humidity is not None
        and float(current_humidity) >= 80
    )

    favorable_temperature = (
        current_temperature is not None
        and 15 <= float(current_temperature) <= 30
    )

    upcoming_rain = len(rainy_days) > 0

    if high_humidity and (favorable_temperature or upcoming_rain):
        disease_weather_level = "HIGH"
        disease_weather_summary = (
            "High humidity with favorable temperature or upcoming rain "
            "may increase disease pressure."
        )
    elif high_humidity or favorable_temperature or upcoming_rain:
        disease_weather_level = "MODERATE"
        disease_weather_summary = (
            "Some weather conditions may support disease development."
        )
    else:
        disease_weather_level = "LOW"
        disease_weather_summary = (
            "Current weather conditions show relatively lower disease pressure."
        )

    if upcoming_rain:
        rain_prediction = {
            "summary": (
                f"Rain is expected on {len(rainy_days)} of the next "
                f"{len(next_5_days)} forecast days."
            ),
            "rain_expected": True
        }
    else:
        rain_prediction = {
            "summary": "No significant rain is expected in the available forecast.",
            "rain_expected": False
        }

    # A weather-only pest assessment. It does not claim a specific pest
    # diagnosis; it only describes whether weather may favor pest pressure.
    if high_humidity and favorable_temperature:
        pest_weather_level = "MODERATE"
        pest_weather_summary = (
            "Warm and humid conditions may support some pest activity; "
            "inspect the crop regularly."
        )
    elif favorable_temperature:
        pest_weather_level = "MODERATE"
        pest_weather_summary = (
            "Temperature may support pest activity; monitor the crop."
        )
    else:
        pest_weather_level = "LOW"
        pest_weather_summary = (
            "Weather conditions show relatively lower pest pressure."
        )

    # ==================================================
    # FINAL RESPONSE
    # ==================================================

    return {
        "available": True,

        "source":
            "Open-Meteo",

        "location": {

            "latitude":
                latitude,

            "longitude":
                longitude,

            "timezone":
                data.get("timezone"),

            "timezone_abbreviation":
                data.get(
                    "timezone_abbreviation"
                )
        },


        # ==========================
        # CURRENT
        # ==========================

        "current": {

            "temperature_c":
                current.get(
                    "temperature_2m"
                ),

            "humidity_percent":
                current.get(
                    "relative_humidity_2m"
                ),

            "precipitation_mm":
                current.get(
                    "precipitation"
                ),

            "rain_mm":
                current.get(
                    "rain"
                ),

            "wind_speed_kmh":
                current.get(
                    "wind_speed_10m"
                ),

            "wind_direction":
                current.get(
                    "wind_direction_10m"
                ),

            "weather_code":
                current.get(
                    "weather_code"
                ),

            "time":
                current.get(
                    "time"
                )
        },


        # ==========================
        # HISTORY
        # ==========================

        "previous_5_days":
            previous_5_days,


        # ==========================
        # FORECAST
        # ==========================

        "next_5_days":
            next_5_days,


        # ==========================
        # RAIN
        # ==========================

        "rain_summary": {

            "rain_expected":
                len(rainy_days) > 0,

            "rainy_days_count":
                len(rainy_days),

            "rainy_days":
                [
                    day.get("date")
                    for day in rainy_days
                ]
        },


        # ==========================
        # RAIN PREDICTION
        # ==========================

        "rain_prediction":
            rain_prediction,

        # ==========================
        # DISEASE WEATHER RISK
        # ==========================

        "disease_weather_risk": {
            "level": disease_weather_level,
            "summary": disease_weather_summary
        },

        # ==========================
        # PEST WEATHER RISK
        # ==========================

        "pest_weather_risk": {
            "level": pest_weather_level,
            "summary": pest_weather_summary
        },

        # ==========================
        # SPRAY
        # ==========================

        "spraying_advice":
            spray_advice
    }