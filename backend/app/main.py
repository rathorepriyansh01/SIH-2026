from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import prediction, history


app = FastAPI(
    title="Crop Disease Detection API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SERVE UPLOADED IMAGES
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# ============================================================
# API ROUTES
# ============================================================

app.include_router(
    prediction.router,
    prefix="/api",
    tags=["Prediction"]
)

app.include_router(
    history.router,
    prefix="/api",
    tags=["History"]
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Crop Disease Detection API is running"
    }