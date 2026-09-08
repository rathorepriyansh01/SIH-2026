import os
import shutil
import torch
import torch.nn as nn
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from torchvision import models

from dataset_loader import get_data_loaders
from train_baseline import BaselineCNN
from train_transfer import get_transfer_model

def evaluate_model(model, test_loader, device):
    """Evaluate PyTorch model on test dataset and return predictions, targets, and metrics."""
    model.eval()
    all_preds = []
    all_targets = []
    
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.numpy())
            
    acc = accuracy_score(all_targets, all_preds) * 100.0
    precision, recall, f1, _ = precision_recall_fscore_support(all_targets, all_preds, average='weighted', zero_division=0)
    cm = confusion_matrix(all_targets, all_preds)
    
    return {
        "accuracy": acc,
        "precision": precision * 100.0,
        "recall": recall * 100.0,
        "f1_score": f1 * 100.0,
        "confusion_matrix": cm,
        "preds": all_preds,
        "targets": all_targets
    }

def run_evaluation():
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../dataset"))
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models"))
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device for model evaluation: {device}")
    
    _, _, test_loader, stats = get_data_loaders(dataset_dir=dataset_dir, batch_size=16)
    classes = stats["classes"]
    num_classes = len(classes)
    
    baseline_path = os.path.join(models_dir, "baseline_model.pth")
    transfer_path = os.path.join(models_dir, "transfer_model.pth")
    final_target_path = os.path.join(models_dir, "crop_disease_model.pth")
    
    results = {}
    
    # 1. Evaluate Baseline Model
    if os.path.exists(baseline_path):
        baseline_model = BaselineCNN(num_classes=num_classes).to(device)
        baseline_model.load_state_dict(torch.load(baseline_path, map_location=device))
        results["Baseline CNN"] = evaluate_model(baseline_model, test_loader, device)
        
    # 2. Evaluate Transfer Learning Model (MobileNetV3)
    if os.path.exists(transfer_path):
        transfer_model = get_transfer_model(num_classes=num_classes, pretrained=False).to(device)
        transfer_model.load_state_dict(torch.load(transfer_path, map_location=device))
        results["MobileNetV3 (Transfer Learning)"] = evaluate_model(transfer_model, test_loader, device)
        
    print("\n=======================================================")
    print("           MODEL EVALUATION SUMMARY REPORT             ")
    print("=======================================================")
    
    best_model_name = None
    best_f1 = -1.0
    
    for name, m in results.items():
        print(f"\nModel: {name}")
        print(f"  • Test Accuracy  : {m['accuracy']:.2f}%")
        print(f"  • Precision     : {m['precision']:.2f}%")
        print(f"  • Recall        : {m['recall']:.2f}%")
        print(f"  • F1 Score      : {m['f1_score']:.2f}%")
        print(f"  • Confusion Matrix:\n{m['confusion_matrix']}")
        
        if m['f1_score'] > best_f1:
            best_f1 = m['f1_score']
            best_model_name = name
            
    print("\n-------------------------------------------------------")
    print(f" Selected Best Model: {best_model_name}")
    
    # Copy best model to final production model location
    if best_model_name == "MobileNetV3 (Transfer Learning)" and os.path.exists(transfer_path):
        shutil.copy(transfer_path, final_target_path)
    elif os.path.exists(baseline_path):
        shutil.copy(baseline_path, final_target_path)
        
    print(f" Production model saved to: {final_target_path}")
    print("=======================================================\n")

if __name__ == "__main__":
    run_evaluation()
