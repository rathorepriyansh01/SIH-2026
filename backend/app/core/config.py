import os

class Settings:
    PROJECT_NAME: str = "Crop Health AI"
    TAGLINE: str = "Detect Early. Prevent Loss."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "backend", "uploads")
    MODEL_PATH: str = os.environ.get(
        "MODEL_PATH",
        os.path.join(BASE_DIR, "ml", "models", "best_crop_disease_model.pth")
    )
    ADVISORY_PATH: str = os.path.join(DATA_DIR, "disease_advisory.json")
    
    # Supports SQLite for local dev, PostgreSQL on Render via DATABASE_URL env var
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'backend', 'crop_health.db')}"
    )
    
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

# Fix: Render provides DATABASE_URL with "postgres://" but SQLAlchemy needs "postgresql://"
if settings.DATABASE_URL.startswith("postgres://"):
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://", 1)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
