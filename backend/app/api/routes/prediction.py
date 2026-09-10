import json
import os
import uuid
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import ScanHistory
from app.services.prediction_service import process_prediction_request


router = APIRouter()


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================
# PREDICT
# ============================================================

@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    farm_data: str = Form(...),
    db: Session = Depends(get_db)
):

    # ========================================================
    # VALIDATE IMAGE
    # ========================================================

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )


    # ========================================================
    # PARSE FARM DATA
    # ========================================================

    try:

        farm_data_dict = json.loads(farm_data)

    except json.JSONDecodeError:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid farm_data JSON. "
                "Example: "
                '{"area_acres":2.5,'
                '"crop_age_days":45,'
                '"growth_stage":"Flowering",'
                '"irrigation_method":"Drip",'
                '"previous_disease":false}'
            )
        )


    # ========================================================
    # VALIDATE FARM DATA
    # ========================================================

    if not isinstance(farm_data_dict, dict):

        raise HTTPException(
            status_code=400,
            detail="farm_data must be a JSON object."
        )


    # ========================================================
    # SAVE IMAGE
    # ========================================================

    extension = os.path.splitext(file.filename or "")[1].lower()

    if extension not in [".jpg", ".jpeg", ".png", ".webp"]:

        extension = ".jpg"


    filename = f"{uuid.uuid4().hex}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )


    try:

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save uploaded image: {str(e)}"
        )


    # ========================================================
    # PROCESS PREDICTION
    # ========================================================

    try:

        # Reset file position because image was already saved
        await file.seek(0)

        result = await process_prediction_request(
            file=file,
            farm_data=farm_data_dict
        )

    except Exception as e:

        # Remove image if prediction completely fails
        if os.path.exists(file_path):

            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


    # ========================================================
    # GET PREDICTION DATA
    # ========================================================

    crop = result.get(
        "crop",
        "Tomato"
    )

    detection = result.get(
        "detection",
        {}
    )

    disease = detection.get(
        "disease",
        "Unknown Disease"
    )

    confidence = detection.get(
        "confidence",
        0.0
    )

    advisory = result.get(
        "advisory",
        {}
    )

    risk_level = advisory.get(
        "risk_level",
        "Unknown"
    )


    # ========================================================
    # SAVE SCAN HISTORY
    # ========================================================

    try:

        scan = ScanHistory(

            image_path=f"/uploads/{filename}",

            crop=crop,

            disease=disease,

            confidence=float(confidence or 0.0),

            risk_level=risk_level

        )

        db.add(scan)

        db.commit()

        db.refresh(scan)

    except Exception as e:

        db.rollback()

        print(
            "Database Save Error:",
            e
        )


    # ========================================================
    # RETURN RESULT
    # ========================================================

    return result