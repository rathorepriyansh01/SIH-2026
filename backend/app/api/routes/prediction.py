from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.prediction import PredictionResponse
from app.services.prediction_service import process_prediction_request
from app.database.database import get_db

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
async def predict_crop_disease_endpoint(
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Predict crop disease from uploaded leaf image.
    Accepts multipart/form-data with field 'image'. Saves scan to history.
    """
    if not image:
        raise HTTPException(status_code=400, detail="No image file provided.")
        
    try:
        contents = await image.read()
        result = process_prediction_request(contents, image.filename, db=db)
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred during prediction processing: {str(e)}"
        )
