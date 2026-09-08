import os
import torch
from torch.utils.data import DataLoader, Dataset, random_split
from torchvision import transforms
from PIL import Image

class CropDiseaseDataset(Dataset):
    """Custom PyTorch Dataset for Crop Leaf Images."""
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.classes = sorted([d for d in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, d))])
        self.class_to_idx = {cls_name: i for i, cls_name in enumerate(self.classes)}
        self.samples = []
        
        for cls_name in self.classes:
            cls_dir = os.path.join(root_dir, cls_name)
            for fname in os.listdir(cls_dir):
                if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                    self.samples.append((os.path.join(cls_dir, fname), self.class_to_idx[cls_name]))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, target = self.samples[idx]
        with open(path, 'rb') as f:
            img = Image.open(f).convert('RGB')
        
        if self.transform is not None:
            img = self.transform(img)
            
        return img, target

def get_transforms():
    """Get training and validation image transformations."""
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    return train_transform, val_transform

def get_data_loaders(dataset_dir="ml/dataset", batch_size=16, train_ratio=0.7, val_ratio=0.15):
    """Load dataset and return train, val, test DataLoaders along with statistics."""
    train_tf, val_tf = get_transforms()
    
    full_dataset = CropDiseaseDataset(root_dir=dataset_dir, transform=train_tf)
    total_count = len(full_dataset)
    
    if total_count == 0:
        raise ValueError(f"No images found in dataset directory: {dataset_dir}")
        
    train_size = int(total_count * train_ratio)
    val_size = int(total_count * val_ratio)
    test_size = total_count - train_size - val_size
    
    train_set, val_set, test_set = random_split(
        full_dataset, 
        [train_size, val_size, test_size],
        generator=torch.Generator().manual_seed(42)
    )
    
    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_set, batch_size=batch_size, shuffle=False)
    
    stats = {
        "total_images": total_count,
        "classes": full_dataset.classes,
        "class_to_idx": full_dataset.class_to_idx,
        "splits": {
            "train": train_size,
            "val": val_size,
            "test": test_size
        }
    }
    
    return train_loader, val_loader, test_loader, stats

if __name__ == "__main__":
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../dataset"))
    if os.path.exists(dataset_dir):
        _, _, _, stats = get_data_loaders(dataset_dir=dataset_dir)
        print("\n=== DATASET ANALYSIS & SUMMARY ===")
        print(f"Total Samples  : {stats['total_images']}")
        print(f"Classes Found  : {stats['classes']}")
        print(f"Train Split    : {stats['splits']['train']} samples")
        print(f"Val Split      : {stats['splits']['val']} samples")
        print(f"Test Split     : {stats['splits']['test']} samples")
        print("==================================\n")
    else:
        print(f"Dataset path {dataset_dir} does not exist. Run dataset_generator.py first.")
