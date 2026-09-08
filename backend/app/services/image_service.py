import os
import uuid
from PIL import Image
from app.core.config import settings

def save_uploaded_image(image: Image.Image, original_filename: str) -> str:
    """Save uploaded image to local storage and return relative path."""
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    image.save(file_path, quality=90)
    return f"/uploads/{unique_filename}"
