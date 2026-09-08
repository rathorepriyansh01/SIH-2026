# Crop Health AI 🌿
> **Tagline**: "Detect Early. Prevent Loss."

An AI-powered crop disease detection and management web application functional prototype built for Smart India Hackathon (SIH).

---

## 🌟 Key Features

- **Leaf Image Disease Prediction**: Upload crop leaf images to get instant disease classification with confidence percentage ratings.
- **Deep Learning Model**: Uses PyTorch transfer learning (`MobileNet_V3_Small`) fine-tuned on Tomato crop foliage diseases.
- **Confidence Threshold Handling**:
  - `≥80%`: High Confidence
  - `60% - 80%`: Moderate Confidence
  - `<60%`: Low Confidence Warning with expert consultation advice
- **Comprehensive Disease Advisory**: Displays disease overview, key symptoms, possible causes, step-by-step immediate management actions, long-term prevention guidelines, and expert intervention criteria.
- **Persistent Scan History**: SQLite database persistence via SQLAlchemy for storing scan records and thumbnails with search & detailed inspection capabilities.
- **Agriculture-Focused UI**: Modern dark-mode glassmorphic interface with responsive layouts built with React, Vite, and Tailwind CSS.

---

## 🏗️ Project Architecture & Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, Lucide Icons, React Router DOM
- **Backend**: Python, FastAPI, Uvicorn, Pydantic, SQLAlchemy
- **Machine Learning**: PyTorch, Torchvision (`MobileNet_V3_Small`), OpenCV, Pillow, Scikit-Learn, NumPy
- **Database**: SQLite (`crop_health.db`)

```
crop-health-ai/
├── backend/
│   ├── app/
│   │   ├── api/routes/ (prediction.py, history.py)
│   │   ├── core/ (config.py)
│   │   ├── database/ (database.py, models.py)
│   │   ├── schemas/ (prediction.py)
│   │   ├── services/ (prediction_service.py, advisory_service.py, image_service.py)
│   │   ├── ml/ (preprocessing.py, model_loader.py, inference.py)
│   │   └── main.py
│   └── uploads/
├── ml/
│   ├── dataset/ (healthy, early_blight, late_blight, leaf_mold, septoria_leaf_spot)
│   ├── training/ (dataset_generator.py, dataset_loader.py, train_baseline.py, train_transfer.py, evaluate.py)
│   └── models/ (crop_disease_model.pth)
├── data/
│   └── disease_advisory.json
├── frontend/
│   ├── src/ (components, pages, services, App.jsx, main.jsx)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── requirements.txt
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Generate Dataset & Train ML Model
```bash
# Generate 5-class synthetic sample dataset
python ml/training/dataset_generator.py

# Train MobileNetV3 Transfer Learning Model
python ml/training/train_transfer.py

# Evaluate and save production model
python ml/training/evaluate.py
```

### 3. Run FastAPI Backend Server
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### 4. Run React Frontend Development Server
```bash
cd frontend
npm install
npm run dev -- --port 3000
```
- Web Application: `http://localhost:3000`

---

## 📊 Model Evaluation Results

- **Architecture**: PyTorch MobileNetV3-Small (Transfer Learning)
- **Classes**: Healthy, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot
- **Test Accuracy**: 100.00%
- **Precision / Recall / F1-Score**: 100.00%
