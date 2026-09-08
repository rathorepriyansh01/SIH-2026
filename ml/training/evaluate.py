import os

import torch
import numpy as np

from tqdm import tqdm

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score
)

from torchvision.models import efficientnet_b0

import torch.nn as nn

from dataset_loader import get_data_loaders


MODEL_PATH = "../models/best_crop_disease_model.pth"


device = torch.device(

    "cuda"

    if torch.cuda.is_available()

    else

    "cpu"
)


# Load data
train_loader, val_loader, test_loader, class_names = get_data_loaders()


num_classes = len(class_names)


# Load checkpoint
checkpoint = torch.load(

    MODEL_PATH,

    map_location=device
)


# Create model
model = efficientnet_b0(
    weights=None
)


in_features = model.classifier[1].in_features


model.classifier = nn.Sequential(

    nn.Dropout(0.3),

    nn.Linear(
        in_features,
        num_classes
    )
)


model.load_state_dict(
    checkpoint["model_state_dict"]
)


model = model.to(device)

model.eval()


all_labels = []

all_predictions = []


with torch.no_grad():

    for images, labels in tqdm(
        test_loader,
        desc="Evaluating"
    ):

        images = images.to(device)

        labels = labels.to(device)


        outputs = model(images)


        _, predicted = torch.max(
            outputs,
            1
        )


        all_labels.extend(
            labels.cpu().numpy()
        )


        all_predictions.extend(
            predicted.cpu().numpy()
        )


# Accuracy

accuracy = accuracy_score(

    all_labels,

    all_predictions
)


print("\n" + "=" * 60)

print("FINAL TEST RESULTS")

print("=" * 60)

print(
    f"\nTest Accuracy: {accuracy * 100:.2f}%"
)


# Classification Report

print("\nClassification Report:\n")

print(

    classification_report(

        all_labels,

        all_predictions,

        target_names=class_names
    )
)


# Confusion Matrix

cm = confusion_matrix(

    all_labels,

    all_predictions
)


print("\nConfusion Matrix:\n")

print(cm)


from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score
)

# ==========================================
# ACCURACY
# ==========================================

accuracy = accuracy_score(
    all_labels,
    all_predictions
)


print("\n" + "=" * 60)
print("FINAL TEST RESULTS")
print("=" * 60)

print(
    f"\nTest Accuracy: {accuracy * 100:.2f}%"
)


# ==========================================
# CLASSIFICATION REPORT
# ==========================================

print("\nClassification Report:\n")


labels = list(range(len(class_names)))


print(

    classification_report(

        all_labels,

        all_predictions,

        labels=labels,

        target_names=class_names,

        zero_division=0

    )
)


# ==========================================
# CONFUSION MATRIX
# ==========================================

cm = confusion_matrix(

    all_labels,

    all_predictions,

    labels=labels
)


print("\nConfusion Matrix:\n")

print(cm)