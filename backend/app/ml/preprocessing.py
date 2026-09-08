import io
from PIL import Image
import torch
from torchvision import transforms
from fastapi import HTTPException

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'bmp', 'webp'}

def validate_image_file(file_bytes: bytes, filename: str) -> Image.Image:
    """Validate uploaded image file format, size, and corruption."""
    if not filename or '.' not in filename:
        raise HTTPException(status_code=400, detail="Invalid filename or missing extension.")
        
    ext = filename.rsplit('.', 1)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format '.{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.verify()  # Verify image integrity
        image = Image.open(io.BytesIO(file_bytes)) # Re-open after verify
        return image
    except Exception:
        raise HTTPException(status_code=400, detail="Corrupted or invalid image file.")

def preprocess_image(image: Image.Image) -> torch.Tensor:
    """Preprocess PIL Image for PyTorch model inference."""
    if image.mode != 'RGB':
        image = image.convert('RGB')
        
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    tensor = transform(image)
    return tensor.unsqueeze(0) # Add batch dimension
