import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models
from dataset_loader import get_data_loaders

def get_transfer_model(num_classes=5, pretrained=True):
    """Load MobileNetV3-Small model with transfer learning weights."""
    weights = models.MobileNet_V3_Small_Weights.DEFAULT if pretrained else None
    model = models.mobilenet_v3_small(weights=weights)
    
    # Replace last classifier layer for our 5 classes
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model

def train_transfer_learning(epochs=6, lr=0.0005, batch_size=16):
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../dataset"))
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models"))
    os.makedirs(models_dir, exist_ok=True)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device for transfer learning: {device}")
    
    train_loader, val_loader, _, stats = get_data_loaders(dataset_dir=dataset_dir, batch_size=batch_size)
    num_classes = len(stats["classes"])
    
    model = get_transfer_model(num_classes=num_classes, pretrained=True).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    
    print("\n=== STARTING TRANSFER LEARNING (MobileNetV3) TRAINING ===")
    best_val_acc = 0.0
    best_model_path = os.path.join(models_dir, "transfer_model.pth")
    
    for epoch in range(1, epochs + 1):
        # Training Phase
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
            
        scheduler.step()
        train_loss = running_loss / total
        train_acc = (correct / total) * 100.0
        
        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)
                
        val_loss = val_loss / val_total
        val_acc = (val_correct / val_total) * 100.0
        
        print(f"Epoch [{epoch}/{epochs}] - Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}% | Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), best_model_path)
            
    print(f"\nTransfer learning complete! Best Val Acc: {best_val_acc:.2f}%")
    print(f"Transfer model saved to: {best_model_path}\n")

if __name__ == "__main__":
    train_transfer_learning(epochs=6)
