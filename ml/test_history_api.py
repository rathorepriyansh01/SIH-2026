import os
import json
import sys
from fastapi.testclient import TestClient

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.main import app

client = TestClient(app)

def test_history_flow():
    print("=== TESTING PREDICTION & SCAN HISTORY DATABASE FLOW ===")
    
    # 1. Perform a prediction to store scan in DB
    test_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "dataset/early_blight/early_blight_001.jpg"))
    with open(test_img_path, "rb") as f:
        pred_res = client.post(
            "/api/v1/predict",
            files={"image": ("early_blight_001.jpg", f, "image/jpeg")}
        )
    assert pred_res.status_code == 200
    scan_id = pred_res.json()["scan_metadata"]["scan_id"]
    print(f"Prediction successful! Created scan_id: {scan_id}")
    
    # 2. Test GET /api/v1/history
    hist_res = client.get("/api/v1/history")
    assert hist_res.status_code == 200
    history_data = hist_res.json()
    print(f"GET /api/v1/history count: {history_data['count']}")
    print("First item in history list:")
    print(json.dumps(history_data["history"][0], indent=2))
    
    # 3. Test GET /api/v1/history/{scan_id}
    detail_res = client.get(f"/api/v1/history/{scan_id}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    print(f"GET /api/v1/history/{scan_id} detail response:")
    print(json.dumps(detail_data, indent=2))
    
    print("\n[OK] History DB flow verified successfully!")

if __name__ == "__main__":
    test_history_flow()
