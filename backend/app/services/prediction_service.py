import io
from PIL import Image

from app.ml.inference import predict_crop_disease


async def process_prediction_request(file, db=None):

    # Read uploaded file
    image_bytes = await file.read()

    # Convert bytes to PIL Image
    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")


    # Directly send PIL Image
    result = predict_crop_disease(image)


    return result