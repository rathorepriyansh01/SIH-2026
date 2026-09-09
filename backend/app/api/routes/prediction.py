from fastapi import APIRouter, UploadFile, File

from app.services.prediction_service import process_prediction_request


router = APIRouter()


@router.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    result = await process_prediction_request(
        file=file
    )

    return result