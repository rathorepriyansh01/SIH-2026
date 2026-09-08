from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
import uuid
from app.database.database import Base

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    image_path = Column(String(255), nullable=False)
    crop = Column(String(100), nullable=False, default="Tomato")
    disease = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    risk_level = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
