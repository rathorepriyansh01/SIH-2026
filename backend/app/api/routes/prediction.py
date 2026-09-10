import json

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from app.services.prediction_service import process_prediction_request


router = APIRouter()


@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    farm_data: str = Form(...)
):

    # ==============================
    # Parse farm data
    # ==============================

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


    # ==============================
    # Validate farm data
    # ==============================

    if not isinstance(farm_data_dict, dict):

        raise HTTPException(
            status_code=400,
            detail="farm_data must be a JSON object."
        )


    # ==============================
    # Process prediction
    # ==============================

    result = await process_prediction_request(
        file=file,
        farm_data=farm_data_dict
    )

    return result