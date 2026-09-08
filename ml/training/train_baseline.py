import os
import torch
import torch.nn as nn
import torch.optim as optim
from dataset_loader import get_data_loaders

class BaselineCNN(nn.Module):
    """Simple baseline convolutional neural network for crop disease classification."""
    def __init__(self, num_classes=5):
        super(BaselineCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.AdaptiveAvgPool2d((1, 1))
        )
        self.classifier = nn.Linear(64, num_classes)

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

def train_baseline(epochs=5, lr=0.001, batch_size=16):
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../dataset"))
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models"))
    os.makedirs(models_dir, exist_ok=True)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device for baseline training: {device}")
    
    train_loader, val_loader, _, stats = get_data_loaders(dataset_dir=dataset_dir, batch_size=batch_size)
    num_classes = len(stats["classes"])
    
    model = BaselineCNN(num_classes=num_classes).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    
    print("\n=== STARTING BASELINE MODEL TRAINING ===")
    best_val_acc = 0.0
    
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
        
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            save_path = os.path.join(models_dir, "baseline_model.pth")
            torch.save(model.state_dict(), save_path)
            
    print(f"\nBaseline training complete! Best Val Acc: {best_val_acc:.2f}%")
    print(f"Baseline model saved to: {os.path.join(models_dir, 'baseline_model.pth')}\n")

if __name__ == "__main__":
    train_baseline(epochs=5)
