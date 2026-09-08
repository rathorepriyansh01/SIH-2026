import os
import requests
import json

def test_prediction_api():
    url = "http://localhost:8000/api/v1/predict"
    test_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "dataset/early_blight/early_blight_001.jpg"))
    
    if not os.path.exists(test_img_path):
        print(f"Test image not found at {test_img_path}")
        return
        
    print(f"Sending test request to {url} with image: {test_img_path}")
    with open(test_img_path, "rb") as f:
        files = {"image": ("early_blight_001.jpg", f, "image/jpeg")}
        response = requests.post(url, files=files)
        
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    test_prediction_api()
