import os
import json
import sys
from fastapi.testclient import TestClient

# Add backend directory to sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.main import app

client = TestClient(app)

def run_test_client():
    print("=== TESTING FASTAPI POST /api/v1/predict ===")
    test_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "dataset/early_blight/early_blight_001.jpg"))
    
    with open(test_img_path, "rb") as f:
        response = client.post(
            "/api/v1/predict",
            files={"image": ("early_blight_001.jpg", f, "image/jpeg")}
        )
        
    print(f"Status Code: {response.status_code}")
    print("Response JSON Payload:")
    print(json.dumps(response.json(), indent=2))
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["prediction"]["crop"] == "Tomato"
    print("\n[OK] Endpoint verification successful!")

if __name__ == "__main__":
    run_test_client()
