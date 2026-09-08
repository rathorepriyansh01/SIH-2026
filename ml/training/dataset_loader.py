import torch

from torch.utils.data import DataLoader, Subset
from torchvision import datasets, transforms
from sklearn.model_selection import train_test_split


IMAGE_SIZE = 224
BATCH_SIZE = 32

TRAIN_DIR = "../dataset/train"
TEST_DIR = "../dataset/test"


train_transform = transforms.Compose([
    transforms.Resize((256, 256)),

    transforms.RandomResizedCrop(
        IMAGE_SIZE,
        scale=(0.8, 1.0)
    ),

    transforms.RandomHorizontalFlip(),

    transforms.RandomRotation(15),

    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2,
        saturation=0.1
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


validation_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def get_data_loaders():

    # Base dataset for stratified splitting
    base_dataset = datasets.ImageFolder(TRAIN_DIR)

    targets = base_dataset.targets
    indices = list(range(len(base_dataset)))


    train_indices, val_indices = train_test_split(
        indices,
        test_size=0.15,
        stratify=targets,
        random_state=42
    )


    # Training dataset with augmentation
    train_dataset = datasets.ImageFolder(
        TRAIN_DIR,
        transform=train_transform
    )


    # Validation dataset without augmentation
    val_dataset = datasets.ImageFolder(
        TRAIN_DIR,
        transform=validation_transform
    )


    # Test dataset
    test_dataset = datasets.ImageFolder(
        TEST_DIR,
        transform=validation_transform
    )


    train_subset = Subset(
        train_dataset,
        train_indices
    )


    val_subset = Subset(
        val_dataset,
        val_indices
    )


    train_loader = DataLoader(
        train_subset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0,
        pin_memory=torch.cuda.is_available()
    )


    val_loader = DataLoader(
        val_subset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0,
        pin_memory=torch.cuda.is_available()
    )


    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0,
        pin_memory=torch.cuda.is_available()
    )


    class_names = train_dataset.classes


    print("\nTRAIN CLASSES:")
    for idx, name in enumerate(class_names):
        print(f"{idx} → {name}")


    print("\nTEST CLASSES:")
    for idx, name in enumerate(test_dataset.classes):
        print(f"{idx} → {name}")


    # Safety check
    if class_names != test_dataset.classes:

        raise ValueError(
            "\nERROR: Train and Test class mappings are different!\n"
            f"Train: {class_names}\n"
            f"Test: {test_dataset.classes}"
        )


    return (
        train_loader,
        val_loader,
        test_loader,
        class_names
    )