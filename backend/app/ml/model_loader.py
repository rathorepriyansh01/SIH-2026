import os
import torch
import torch.nn as nn
from torchvision import models

from app.core.config import settings

class ModelLoader:
    _instance = None
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            cls._load_model()
        return cls._model

    @classmethod
    def _load_model(cls):
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = models.mobilenet_v3_small(weights=None)
        in_features = model.classifier[3].in_features
        model.classifier[3] = nn.Linear(in_features, len(settings.CLASSES))
        
        if not os.path.exists(settings.MODEL_PATH):
            raise FileNotFoundError(f"Trained model checkpoint not found at {settings.MODEL_PATH}")
            
        state_dict = torch.load(settings.MODEL_PATH, map_location=device)
        model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        cls._model = model
        print(f"Model successfully loaded from {settings.MODEL_PATH} on {device}")
