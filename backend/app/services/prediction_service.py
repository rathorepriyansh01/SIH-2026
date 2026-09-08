import uuid
from datetime import datetime
from PIL import Image
from sqlalchemy.orm import Session

from app.ml.preprocessing import validate_image_file, preprocess_image
from app.ml.inference import predict_crop_disease
from app.services.advisory_service import AdvisoryService
from app.services.image_service import save_uploaded_image
from app.database.models import ScanHistory

def process_prediction_request(file_bytes: bytes, filename: str, db: Session = None) -> dict:
    """Complete pipeline: validate, preprocess, infer, fetch advisory, save image & DB history."""
    # 1. Validate Image
    pil_image = validate_image_file(file_bytes, filename)
    
    # 2. Save Image locally
    relative_image_path = save_uploaded_image(pil_image, filename)
    
    # 3. Preprocess Image
    image_tensor = preprocess_image(pil_image)
    
    # 4. Model Inference
    pred_res = predict_crop_disease(image_tensor)
    
    # 5. Fetch Disease Advisory
    advisory = AdvisoryService.get_advisory(pred_res["disease"])
    
    scan_id = uuid.uuid4().hex
    created_dt = datetime.utcnow()
    timestamp = created_dt.isoformat() + "Z"
    risk_level = advisory.get("risk_level", "Moderate")
    
    # 6. Save Scan History in DB if session is provided
    if db is not None:
        db_record = ScanHistory(
            id=scan_id,
            image_path=relative_image_path,
            crop=pred_res["crop"],
            disease=pred_res["disease"],
            confidence=pred_res["confidence"],
            risk_level=risk_level,
            created_at=created_dt
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
    
    warning = None
    if pred_res["confidence_level"] == "Low":
        warning = "Unable to confidently identify the disease. Please upload a clearer leaf image or consult an agriculture expert."
        
    response_data = {
        "success": True,
        "prediction": {
            "crop": pred_res["crop"],
            "disease": pred_res["disease"],
            "confidence": pred_res["confidence"],
            "risk_level": risk_level,
            "confidence_level": pred_res["confidence_level"]
        },
        "disease_information": {
            "description": advisory.get("description", ""),
            "symptoms": advisory.get("symptoms", []),
            "possible_causes": advisory.get("possible_causes", [])
        },
        "recommended_actions": advisory.get("recommended_actions", {
            "immediate_actions": [],
            "prevention": [],
            "when_to_seek_expert_help": ""
        }),
        "scan_metadata": {
            "scan_id": scan_id,
            "timestamp": timestamp,
            "image_path": relative_image_path
        },
        "warning_message": warning
    }
    
    return response_data
