def build_context(
    weather=None,
    location=None,
    farm_data=None
):
    """
    Combines all available information into one context
    for the AI advisory system.
    """

    context = {
        "weather": weather or {},
        "location": location or {},
        "farm": farm_data or {}
    }

    return context