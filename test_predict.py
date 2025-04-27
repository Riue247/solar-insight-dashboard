# test_predict.py
from predict import model_predict

# Example input data
test_data = {"features": [2]}  # [2] is your "example feature"

# Run prediction
result = model_predict(test_data)

print("Prediction:", result)
