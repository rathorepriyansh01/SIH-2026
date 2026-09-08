import os

class Settings:
    PROJECT_NAME: str = "Crop Health AI"
    TAGLINE: str = "Detect Early. Prevent Loss."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "backend", "uploads")
    MODEL_PATH: str = os.path.join(BASE_DIR, "ml", "models", "crop_disease_model.pth")
    ADVISORY_PATH: str = os.path.join(DATA_DIR, "disease_advisory.json")
    
    DATABASE_URL: str = f"sqlite:///{os.path.join(BASE_DIR, 'backend', 'crop_health.db')}"
    
    CLASSES: list = [
        "Healthy",
        "Early Blight",
        "Late Blight",
        "Leaf Mold",
        "Septoria Leaf Spot"
    ]
    
    # Confidence Thresholds
    CONFIDENCE_HIGH: float = 80.0
    CONFIDENCE_MODERATE: float = 60.0

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
