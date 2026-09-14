import torch
import numpy as np

from tqdm import tqdm

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

from torchvision.models import efficientnet_b0
import torch.nn as nn

from dataset_loader import get_data_loaders


# ============================================================
# CONFIG
# ============================================================

MODEL_PATH = "../models/best_crop_disease_model.pth"


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("\nUsing device:", device)


# ============================================================
# LOAD DATA
# ============================================================

print("\nLoading dataset...")

train_loader, val_loader, test_loader, class_names = get_data_loaders()

num_classes = len(class_names)

print("Classes:", class_names)
print("Number of classes:", num_classes)


# ============================================================
# LOAD CHECKPOINT
# ============================================================

print("\nLoading model checkpoint...")

checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)

print("Checkpoint loaded successfully.")


# ============================================================
# CREATE EFFICIENTNET-B0
# ============================================================

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


# ============================================================
# LOAD TRAINED WEIGHTS
# ============================================================

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(device)

model.eval()

print("Model loaded successfully.")


# ============================================================
# EVALUATE TEST SET
# ============================================================

all_labels = []
all_predictions = []


print("\nEvaluating test dataset...\n")


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


# ============================================================
# BASIC COUNTS
# ============================================================

total_samples = len(all_labels)

correct_predictions = sum(
    1
    for actual, predicted in zip(
        all_labels,
        all_predictions
    )
    if actual == predicted
)

incorrect_predictions = (
    total_samples - correct_predictions
)


# ============================================================
# ACCURACY
# ============================================================

accuracy = accuracy_score(
    all_labels,
    all_predictions
)


# ============================================================
# PRECISION / RECALL / F1
# ============================================================

macro_precision = precision_score(
    all_labels,
    all_predictions,
    average="macro",
    zero_division=0
)

macro_recall = recall_score(
    all_labels,
    all_predictions,
    average="macro",
    zero_division=0
)

macro_f1 = f1_score(
    all_labels,
    all_predictions,
    average="macro",
    zero_division=0
)

weighted_f1 = f1_score(
    all_labels,
    all_predictions,
    average="weighted",
    zero_division=0
)


# ============================================================
# FINAL RESULTS
# ============================================================

print("\n")
print("=" * 70)
print("                 FINAL MODEL EVALUATION")
print("=" * 70)

print(
    f"\nTotal Test Images     : {total_samples}"
)

print(
    f"Correct Predictions   : {correct_predictions}"
)

print(
    f"Incorrect Predictions : {incorrect_predictions}"
)

print(
    f"\nTest Accuracy         : {accuracy * 100:.2f}%"
)

print(
    f"Macro Precision       : {macro_precision * 100:.2f}%"
)

print(
    f"Macro Recall          : {macro_recall * 100:.2f}%"
)

print(
    f"Macro F1 Score        : {macro_f1 * 100:.2f}%"
)

print(
    f"Weighted F1 Score     : {weighted_f1 * 100:.2f}%"
)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\n")
print("=" * 70)
print("                 PER-CLASS PERFORMANCE")
print("=" * 70)

labels = list(range(num_classes))

report = classification_report(
    all_labels,
    all_predictions,
    labels=labels,
    target_names=class_names,
    zero_division=0
)

print("\n")
print(report)


# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    all_labels,
    all_predictions,
    labels=labels
)

print("\n")
print("=" * 70)
print("                 CONFUSION MATRIX")
print("=" * 70)

print("\nRows = Actual")
print("Columns = Predicted\n")

print(
    "Classes:"
)

print(class_names)

print("\n")

print(cm)


# ============================================================
# CLASS-WISE ACCURACY
# ============================================================

print("\n")
print("=" * 70)
print("                 CLASS-WISE ACCURACY")
print("=" * 70)


for i, class_name in enumerate(class_names):

    total_actual = cm[i].sum()

    correct_actual = cm[i][i]

    if total_actual > 0:

        class_accuracy = (
            correct_actual /
            total_actual
        ) * 100

    else:

        class_accuracy = 0.0

    print(
        f"{class_name:<25} : "
        f"{class_accuracy:.2f}% "
        f"({correct_actual}/{total_actual})"
    )


print("\n")
print("=" * 70)
print("                 EVALUATION COMPLETE")
print("=" * 70)