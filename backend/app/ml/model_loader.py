import os
import torch
import torch.nn as nn

from torchvision.models import efficientnet_b0


class ModelLoader:

    def __init__(self):

        # Device
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )


        # Project root path
        BASE_DIR = os.path.abspath(
            os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        ".."
    )
)


        # Model path
        MODEL_PATH = os.path.join(
            BASE_DIR,
            "ml",
            "models",
            "best_crop_disease_model.pth"
        )


        print("\nLoading Crop Disease Model...")
        print("Model Path:", MODEL_PATH)


        # Check model exists
        if not os.path.exists(MODEL_PATH):

            raise FileNotFoundError(
                f"Model not found at:\n{MODEL_PATH}"
            )


        # Load checkpoint
        checkpoint = torch.load(
            MODEL_PATH,
            map_location=self.device
        )


        # Class names
        self.class_names = checkpoint["class_names"]

        num_classes = checkpoint["num_classes"]


        print(
            f"Number of Classes: {num_classes}"
        )


        # Create EfficientNet-B0 model
        self.model = efficientnet_b0(
            weights=None
        )


        # Replace classifier
        in_features = self.model.classifier[1].in_features


        self.model.classifier = nn.Sequential(

            nn.Dropout(0.3),

            nn.Linear(
                in_features,
                num_classes
            )

        )


        # Load trained weights
        self.model.load_state_dict(
            checkpoint["model_state_dict"]
        )


        # Move model to device
        self.model.to(
            self.device
        )


        # Evaluation mode
        self.model.eval()


        print(
            "Crop Disease Model Loaded Successfully!\n"
        )


    def get_model(self):

        return self.model


    def get_class_names(self):

        return self.class_names


    def get_device(self):

        return self.device