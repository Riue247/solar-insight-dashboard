# predict.py
import joblib

# Load the saved model
model = joblib.load("models/model.pkl")

# Function the backend will call
def model_predict(data: dict):
    features = data.get("features", [])  # We expect {"features": [some numbers]}
    
    if not features:
        return {"error": "No features provided."}
    
    prediction = model.predict([features])
    return prediction.tolist()  # Return prediction as a list
