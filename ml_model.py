# ml_model.py
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Train a small dummy model
def train_model():
    X = [[0], [1], [2], [3], [4], [5]]  # Example features (e.g., temperatures, pixel values)
    y = [0, 1, 0, 1, 0, 1]              # Example labels (0 = cool zone, 1 = hot zone)
    
    model = RandomForestClassifier()
    model.fit(X, y)

    # Save model
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/model.pkl")
    print("Model trained and saved!")

# Run training immediately when you run this script
if __name__ == "__main__":
    train_model()
