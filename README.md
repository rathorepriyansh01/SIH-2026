# 🌿 Crop Health AI

> **Detect Early. Prevent Loss.**

An end-to-end AI-powered crop disease detection and management platform. Built for Smart India Hackathon (SIH 2026), this application enables farmers to photograph a leaf and instantly receive a disease diagnosis, risk assessment, weather-aware advisory, and multilingual treatment recommendations — all powered by deep learning and an LLM.

**Live Demo → [Frontend on Vercel](#) | [API Docs on Render](#)**

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔬 **Disease Detection** | EfficientNet-B0 fine-tuned on 10-class tomato plant disease dataset |
| 📊 **Confidence Scoring** | Top-3 predictions with % confidence; High / Moderate / Low thresholds |
| 🌦️ **Weather Integration** | Real-time + 5-day forecast from Open-Meteo; spraying-window advice |
| 📍 **Location Context** | Reverse geocoding via Nominatim (OpenStreetMap) |
| 🤖 **AI Advisory** | Groq LLM (Llama 3.3 70B) generates structured treatment recommendations |
| 🗂️ **Scan History** | PostgreSQL (production) / SQLite (dev) via SQLAlchemy ORM |
| 🌐 **Multilingual UI** | English + Hindi with context-aware language switching |
| ⚡ **Risk Assessment** | Deterministic risk scoring combining disease, confidence, weather, and farm data |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel (Frontend)                           │
│  React 18 + Vite + Tailwind CSS + React Router + Recharts        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS (Axios)
┌───────────────────────────▼─────────────────────────────────────┐
│                     Render (Backend)                             │
│  FastAPI + Uvicorn + SQLAlchemy                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ ML Inference│  │ Groq LLM     │  │ Weather + Location     │  │
│  │ EfficientNet│  │ Llama 3.3 70B│  │ Open-Meteo, Nominatim  │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────▼──────────┐
                │  PostgreSQL (Render)  │
                │  Scan history, IDs,  │
                │  risk levels         │
                └──────────────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS 3, Axios, React Router 6, Recharts, Lucide Icons |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 |
| **Machine Learning** | PyTorch 2, Torchvision, EfficientNet-B0, Pillow, OpenCV (headless) |
| **AI Advisory** | Groq API — Llama 3.3 70B Versatile |
| **Database** | SQLite (dev), PostgreSQL (production) via SQLAlchemy ORM |
| **External APIs** | Open-Meteo (weather), Nominatim / OpenStreetMap (geocoding) |
| **Deployment** | Vercel (frontend), Render (backend + PostgreSQL) |

---

## 🚀 Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com/keys)

### 1. Clone the Repository

```bash
git clone https://github.com/rathorepriyansh01/SIH-2026.git
cd SIH-2026
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Copy env template and add your GROQ_API_KEY
cp .env.example .env
# Edit .env and set GROQ_API_KEY=your_key_here

# Start the backend (from the project root)
uvicorn backend.app.main:app --reload --port 8000
```

- API Root: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy env template
cp .env.example .env
# .env content: VITE_API_BASE_URL=http://localhost:8000

# Start dev server
npm run dev
```

- Web App: http://localhost:3000

---

## ☁️ Production Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo: `rathorepriyansh01/SIH-2026`
3. Use these settings:

| Setting | Value |
|---|---|
| **Root Directory** | *(leave empty — repo root)* |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` |
| **Health Check Path** | `/api/health` |

4. Add a **PostgreSQL database** in Render (free tier)
5. Set environment variables in Render dashboard:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key (get from console.groq.com) |
| `DATABASE_URL` | Auto-filled by Render PostgreSQL add-on |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL, e.g. `https://crop-health-ai.vercel.app` |

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Framework: **Vite** (auto-detected)
4. Add environment variable:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Your Render backend URL, e.g. `https://crop-health-ai-backend.onrender.com` |

5. Deploy. The `vercel.json` handles SPA routing so `/scan`, `/history`, and `/result` don't 404 on refresh.

---

## 🔑 Environment Variables Reference

### Backend (`.env` / Render Dashboard)

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ | — | Groq API key for LLM advisory |
| `DATABASE_URL` | No | SQLite (local) | PostgreSQL connection string on Render |
| `ALLOWED_ORIGINS` | No | `*` | Comma-separated CORS allowed origins |
| `MODEL_PATH` | No | `ml/models/best_crop_disease_model.pth` | Override model file location |

### Frontend (`.env` / Vercel Dashboard)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | ✅ | `http://127.0.0.1:8000` | Backend API base URL |

---

## 🧠 Machine Learning Model

| Property | Value |
|---|---|
| **Architecture** | EfficientNet-B0 (Transfer Learning via Torchvision) |
| **Dataset** | PlantVillage — Tomato class subset |
| **Classes (10)** | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy |
| **Input** | 224×224 RGB, ImageNet normalization |
| **Output** | Softmax over 10 classes, Top-3 predictions |
| **Model File** | `ml/models/best_crop_disease_model.pth` (~16 MB) |

---

## 📁 Project Structure

```
SIH-2026/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # prediction.py, history.py
│   │   ├── core/             # config.py (env-aware settings)
│   │   ├── database/         # database.py, models.py (SQLAlchemy)
│   │   ├── ml/               # model_loader.py, inference.py, preprocessing.py
│   │   ├── services/         # prediction, llm, weather, location, risk, advisory
│   │   ├── prompts/          # advisory_prompt.py (Groq prompt builder)
│   │   └── main.py           # FastAPI app, CORS, startup, health endpoint
│   └── uploads/              # Runtime image storage (ephemeral on Render free tier)
├── ml/
│   ├── models/               # best_crop_disease_model.pth (committed to Git)
│   └── training/             # Training scripts (not needed at runtime)
├── data/
│   └── disease_advisory.json # Static disease knowledge base
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, ImageUploader, FarmContextForm, PredictionCard, ...
│   │   ├── pages/            # Home, Scan, Result, History
│   │   ├── services/         # api.js (Axios with env-var base URL)
│   │   └── i18n/             # LanguageContext (EN/HI)
│   ├── vercel.json           # SPA routing fix for Vercel
│   └── .env.example          # Frontend env template
├── render.yaml               # Render deployment config
├── requirements.txt          # Python dependencies
├── .env.example              # Backend env template
└── .gitignore
```

---

## ⚠️ Known Limitations

| Limitation | Detail |
|---|---|
| **Cold starts** | Render free tier sleeps after 15 min inactivity; first request takes ~30–60 s |
| **Image persistence** | Uploaded images on Render free tier are ephemeral (wiped on restart). History scan images may become broken links. |
| **Model scope** | Trained on tomato diseases only; confidence may be low for other crops |
| **Weather/location** | Optional — gracefully degraded if user denies location permission |

---

## 📸 Screenshots

> Add screenshots to a `screenshots/` folder and embed them here.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Priyansh Rathore** — Smart India Hackathon 2026
- GitHub: [@rathorepriyansh01](https://github.com/rathorepriyansh01)
