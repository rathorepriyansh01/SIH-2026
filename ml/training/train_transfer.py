import os
import json
import copy

import torch
import torch.nn as nn

from tqdm import tqdm

from torchvision.models import (
    efficientnet_b0,
    EfficientNet_B0_Weights
)

from dataset_loader import get_data_loaders


# ==============================
# CONFIGURATION
# ==============================

EPOCHS = 15
LEARNING_RATE = 0.001

MODEL_DIR = "../models"

os.makedirs(MODEL_DIR, exist_ok=True)


# ==============================
# DEVICE
# ==============================

device = torch.device(

    "cuda"

    if torch.cuda.is_available()

    else

    "cpu"
)

print("\nUsing Device:", device)


# ==============================
# LOAD DATA
# ==============================

print("\nLoading dataset...")

train_loader, val_loader, test_loader, class_names = get_data_loaders()

num_classes = len(class_names)

print("Classes:", class_names)

print("Number of Classes:", num_classes)


# ==============================
# SAVE CLASS NAMES
# ==============================

class_mapping = {

    str(index): class_name

    for index, class_name

    in enumerate(class_names)
}


with open(
    os.path.join(MODEL_DIR, "class_names.json"),
    "w"
) as file:

    json.dump(
        class_mapping,
        file,
        indent=4
    )


# ==============================
# LOAD EFFICIENTNET
# ==============================

print("\nLoading EfficientNetB0...")

weights = EfficientNet_B0_Weights.DEFAULT

model = efficientnet_b0(
    weights=weights
)


# Freeze feature layers initially
for parameter in model.features.parameters():

    parameter.requires_grad = False


# Replace classifier

in_features = model.classifier[1].in_features


model.classifier = nn.Sequential(

    nn.Dropout(0.3),

    nn.Linear(
        in_features,
        num_classes
    )
)


model = model.to(device)


# ==============================
# LOSS + OPTIMIZER
# ==============================

criterion = nn.CrossEntropyLoss()


optimizer = torch.optim.AdamW(

    model.parameters(),

    lr=LEARNING_RATE,

    weight_decay=1e-4
)


scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(

    optimizer,

    mode="min",

    patience=2,

    factor=0.5
)


# ==============================
# TRAINING VARIABLES
# ==============================

best_val_loss = float("inf")

best_model_weights = copy.deepcopy(
    model.state_dict()
)


# ==============================
# TRAIN FUNCTION
# ==============================

for epoch in range(EPOCHS):

    print("\n" + "=" * 60)

    print(
        f"EPOCH {epoch + 1}/{EPOCHS}"
    )

    print("=" * 60)


    # --------------------------
    # TRAINING
    # --------------------------

    model.train()

    running_loss = 0

    correct = 0

    total = 0


    progress_bar = tqdm(

        train_loader,

        desc="Training"
    )


    for images, labels in progress_bar:

        images = images.to(device)

        labels = labels.to(device)


        optimizer.zero_grad()


        outputs = model(images)


        loss = criterion(
            outputs,
            labels
        )


        loss.backward()


        optimizer.step()


        running_loss += loss.item()


        _, predicted = torch.max(
            outputs,
            1
        )


        total += labels.size(0)


        correct += (

            predicted == labels

        ).sum().item()


    train_loss = running_loss / len(train_loader)

    train_accuracy = 100 * correct / total


    # --------------------------
    # VALIDATION
    # --------------------------

    model.eval()

    val_loss = 0

    val_correct = 0

    val_total = 0


    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)

            labels = labels.to(device)


            outputs = model(images)


            loss = criterion(
                outputs,
                labels
            )


            val_loss += loss.item()


            _, predicted = torch.max(
                outputs,
                1
            )


            val_total += labels.size(0)


            val_correct += (

                predicted == labels

            ).sum().item()


    val_loss = val_loss / len(val_loader)

    val_accuracy = 100 * val_correct / val_total


    # --------------------------
    # SCHEDULER
    # --------------------------

    scheduler.step(val_loss)


    # --------------------------
    # RESULTS
    # --------------------------

    print("\nTraining Results")

    print(
        f"Train Loss: {train_loss:.4f}"
    )

    print(
        f"Train Accuracy: {train_accuracy:.2f}%"
    )


    print("\nValidation Results")

    print(
        f"Validation Loss: {val_loss:.4f}"
    )

    print(
        f"Validation Accuracy: {val_accuracy:.2f}%"
    )


    # --------------------------
    # SAVE BEST MODEL
    # --------------------------

    if val_loss < best_val_loss:

        best_val_loss = val_loss

        best_model_weights = copy.deepcopy(
            model.state_dict()
        )


        model_path = os.path.join(

            MODEL_DIR,

            "best_crop_disease_model.pth"
        )


        torch.save(

            {
                "model_state_dict": model.state_dict(),

                "class_names": class_names,

                "num_classes": num_classes,

                "image_size": 224

            },

            model_path
        )


        print(
            "\nBest Model Saved!"
        )


# ==============================
# LOAD BEST MODEL
# ==============================

model.load_state_dict(
    best_model_weights
)


print("\nTraining Completed!")

print(
    f"Best Validation Loss: {best_val_loss:.4f}"
)


print(
    f"Model Saved At: {MODEL_DIR}"
)