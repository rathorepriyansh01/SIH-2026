from pydantic import BaseModel
from typing import List, Optional

class PredictionDetails(BaseModel):
    crop: str
    disease: str
    confidence: float
    risk_level: str
    confidence_level: str

class DiseaseInformation(BaseModel):
    description: str
    symptoms: List[str]
    possible_causes: List[str]

class RecommendedActions(BaseModel):
    immediate_actions: List[str]
    prevention: List[str]
    when_to_seek_expert_help: str

class ScanMetadata(BaseModel):
    scan_id: str
    timestamp: str
    image_path: str

class PredictionResponse(BaseModel):
    success: bool
    prediction: PredictionDetails
    disease_information: DiseaseInformation
    recommended_actions: RecommendedActions
    scan_metadata: ScanMetadata
    warning_message: Optional[str] = None
