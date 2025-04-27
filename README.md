# Backend ML Model

## Files
- `ml_model.py` - Trains and saves the model
- `predict.py` - Loads model and predicts
- `test_predict.py` - Quick test script for prediction

## How to Use
1. Install requirements:
    ```
    pip install -r requirements.txt
    ```
2. To train model:
    ```
    python ml_model.py
    ```
3. To make predictions:
    ```python
    from predict import model_predict
    result = model_predict({"features": [2]})
    print(result)
    ```

Model expects input like:
```json
{"features": [number1, number2, ...]}
