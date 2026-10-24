import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import prediction, history
from app.database.database import init_db


# ============================================================
# STARTUP / SHUTDOWN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database tables on startup."""
    init_db()
    yield


app = FastAPI(
    title="Crop Disease Detection API",
    description="AI-powered crop disease detection with EfficientNet-B0 and Groq LLM advisory.",
    version="1.0.0",
    lifespan=lifespan
)


# ============================================================
# CORS
# ============================================================

# Allow specific origins in production; fall back to wildcard for local dev.
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = (
    [o.strip() for o in _raw_origins.split(",") if o.strip()]
    if _raw_origins
    else ["https://sih-2026-green-phi.vercel.app/"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SERVE UPLOADED IMAGES
# ============================================================

import os as _os
_upload_dir = "uploads"
_os.makedirs(_upload_dir, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=_upload_dir),
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
        "message": "Crop Disease Detection API is running",
        "docs": "/docs",
        "health": "/api/health"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health endpoint for uptime monitoring and Render health checks."""
    return {
        "status": "ok",
        "service": "Crop Disease Detection API",
        "version": "1.0.0"
    }