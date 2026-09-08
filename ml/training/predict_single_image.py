import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from torchvision.models import efficientnet_b0


MODEL_PATH = "../models/best_crop_disease_model.pth"

IMAGE_PATH = "hgic-veg-septoria-leaf-spot-600.jpg"


device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# Load checkpoint
checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)


class_names = checkpoint["class_names"]

num_classes = checkpoint["num_classes"]


# Create model
model = efficientnet_b0(weights=None)

in_features = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(in_features, num_classes)
)


model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(device)

model.eval()


# Same preprocessing as training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# Load image
image = Image.open(IMAGE_PATH).convert("RGB")

image_tensor = transform(image)

image_tensor = image_tensor.unsqueeze(0)

image_tensor = image_tensor.to(device)


# Prediction
with torch.no_grad():

    output = model(image_tensor)

    probabilities = torch.softmax(
        output,
        dim=1
    )

    confidence, predicted = torch.max(
        probabilities,
        1
    )


print("\nPrediction Result")
print("=" * 40)

print(
    "Disease:",
    class_names[predicted.item()]
)

print(
    "Confidence:",
    f"{confidence.item() * 100:.2f}%"
)