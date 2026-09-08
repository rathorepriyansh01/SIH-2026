import torch

from PIL import Image
from torchvision import transforms

from .model_loader import (
    model,
    class_names,
    device
)


transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def predict_disease(image: Image.Image):

    image = image.convert("RGB")

    image_tensor = transform(image)

    image_tensor = image_tensor.unsqueeze(0)

    image_tensor = image_tensor.to(device)


    with torch.no_grad():

        output = model(image_tensor)

        probabilities = torch.softmax(
            output,
            dim=1
        )[0]


    top_probabilities, top_indices = torch.topk(
        probabilities,
        k=3
    )


    predictions = []


    for probability, index in zip(
        top_probabilities,
        top_indices
    ):

        predictions.append({

            "disease": class_names[index.item()],

            "confidence": round(
                probability.item() * 100,
                2
            )

        })


    best_prediction = predictions[0]


    return {

        "disease": best_prediction["disease"],

        "confidence": best_prediction["confidence"],

        "top_predictions": predictions

    }