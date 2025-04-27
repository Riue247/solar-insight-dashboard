import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Load your data
df = pd.read_csv("data_log.csv")

# 2. Add Labels: Good, Moderate, Poor based on solar radiation
def label_solar_condition(row):
    radiation = row['solar_radiation']
    if radiation > 600:
        return "Good"
    elif radiation > 300:
        return "Moderate"
    else:
        return "Poor"

df['solar_condition'] = df.apply(label_solar_condition, axis=1)

# 3. Features and Labels
X = df[['temperature', 'humidity', 'solar_radiation', 'cloud_cover']]
y = df['solar_condition']

# 4. Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train the Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate the model
accuracy = model.score(X_test, y_test)
print(f"\nModel Test Accuracy: {accuracy:.2f}")

# 7. Save the trained model
joblib.dump(model, "model.pkl")
print("\nModel saved as model.pkl ✅")
