import json
import os
from fastapi import HTTPException
from app.core.config import settings

class AdvisoryService:
    _advisory_data = None

    @classmethod
    def get_advisory(cls, disease_name: str) -> dict:
        """Fetch disease advisory information for predicted disease."""
        if cls._advisory_data is None:
            cls._load_advisory()
            
        advisory = cls._advisory_data.get(disease_name)
        if not advisory:
            # Fallback default advisory if class is missing
            return {
                "crop": "Unknown Crop",
                "disease": disease_name,
                "risk_level": "Moderate",
                "description": f"Information for {disease_name} in Unknown crops.",
                "symptoms": ["Leaf spotting or discoloration"],
                "possible_causes": ["Environmental or pathogen factors"],
                "recommended_actions": {
                    "immediate_actions": ["Prune affected leaves", "Monitor crop closely"],
                    "prevention": ["Maintain good field sanitation"],
                    "when_to_seek_expert_help": "Consult an agricultural specialist if symptoms spread."
                }
            }
        return advisory

    @classmethod
    def _load_advisory(cls):
        if not os.path.exists(settings.ADVISORY_PATH):
            raise FileNotFoundError(f"Advisory data file not found at {settings.ADVISORY_PATH}")
            
        with open(settings.ADVISORY_PATH, 'r', encoding='utf-8') as f:
            cls._advisory_data = json.load(f)
