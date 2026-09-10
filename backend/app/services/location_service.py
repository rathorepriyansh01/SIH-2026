import requests


def reverse_geocode(
    latitude: float,
    longitude: float
):
    """
    Convert latitude and longitude into
    human-readable location information.
    """

    url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "json",
        "addressdetails": 1,
        "zoom": 10
    }

    headers = {
        "User-Agent": "Maatiputra/1.0"
    }

    response = requests.get(
        url,
        params=params,
        headers=headers,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    address = data.get(
        "address",
        {}
    )

    return {
        "latitude": latitude,
        "longitude": longitude,

        "city": (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or ""
        ),

        "district": (
            address.get("state_district")
            or address.get("district")
            or ""
        ),

        "state": address.get(
            "state",
            ""
        ),

        "country": address.get(
            "country",
            ""
        ),

        "postcode": address.get(
            "postcode",
            ""
        )
    }