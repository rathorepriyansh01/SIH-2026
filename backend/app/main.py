from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import prediction


app = FastAPI(
    title="Crop Disease Detection API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    prediction.router,
    prefix="/api",
    tags=["Prediction"]
)


@app.get("/")
def root():
    return {
        "message": "Crop Disease Detection API is running"
    }

