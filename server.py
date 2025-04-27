from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import model_predict
import pandas as pd
import os
from datetime import datetime
import joblib
import numpy as np

# Create FastAPI app (ONLY ONCE)
app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home route (optional)
@app.get("/")
async def root():
    return {"message": "Server is running!"}

# Define expected input format
class PredictRequest(BaseModel):
    features: list  # e.g., {"features": [2]}

# Prediction route
@app.post("/predict")
async def predict_route(request: PredictRequest):
    prediction = model_predict(request.dict())
    return {"prediction": prediction}

# NEW: log-data route
@app.post("/log-data")
async def log_data(request: Request):
    data = await request.json()

    # Add timestamp automatically
    data['timestamp'] = datetime.now().isoformat()

    df_new = pd.DataFrame([data])

    if os.path.exists("data_log.csv"):
        df_new.to_csv("data_log.csv", mode='a', header=False, index=False)
    else:
        df_new.to_csv("data_log.csv", mode='w', header=True, index=False)

    return {"status": "success"}

# Load the trained model
model = joblib.load("model.pkl")

@app.post("/predict-insight")
async def predict_insight(request: Request):
    data = await request.json()
    
    features = np.array([
        data['temperature'],
        data['humidity'],
        data['solar_radiation'],
        data['cloud_cover']
    ]).reshape(1, -1)

    prediction = model.predict(features)[0]

    return {"solar_condition": prediction}
