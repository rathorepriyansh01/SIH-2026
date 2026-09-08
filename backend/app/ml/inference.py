import torch
import torch.nn.functional as F
from app.core.config import settings
from app.ml.model_loader import ModelLoader

def predict_crop_disease(image_tensor: torch.Tensor):
    """Run model inference and return predicted class, confidence, and confidence level."""
    model = ModelLoader.get_model()
    device = next(model.parameters()).device
    image_tensor = image_tensor.to(device)
    
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = F.softmax(outputs, dim=1)[0]
        
    top_prob, top_idx = torch.max(probabilities, dim=0)
    confidence = round(top_prob.item() * 100.0, 2)
    predicted_class = settings.CLASSES[top_idx.item()]
    
    # Confidence Threshold Handling
    if confidence >= settings.CONFIDENCE_HIGH:
        confidence_level = "High"
    elif confidence >= settings.CONFIDENCE_MODERATE:
        confidence_level = "Moderate"
    else:
        confidence_level = "Low"
        
    return {
        "crop": "Tomato",
        "disease": predicted_class,
        "confidence": confidence,
        "confidence_level": confidence_level
    }
