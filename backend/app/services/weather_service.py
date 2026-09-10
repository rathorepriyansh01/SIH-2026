import requests


def get_current_weather(
    latitude: float,
    longitude: float
):
    """
    Fetch current weather data using Open-Meteo.
    """

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "rain,"
            "wind_speed_10m,"
            "weather_code"
        ),
        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    current = data.get("current", {})

    return {
        "temperature_c": current.get(
            "temperature_2m"
        ),

        "humidity_percent": current.get(
            "relative_humidity_2m"
        ),

        "precipitation_mm": current.get(
            "precipitation"
        ),

        "rain_mm": current.get(
            "rain"
        ),

        "wind_speed_kmh": current.get(
            "wind_speed_10m"
        ),

        "weather_code": current.get(
            "weather_code"
        ),

        "time": current.get(
            "time"
        )
    }