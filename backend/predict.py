import joblib
import numpy as np
import pandas as pd

# =========================
# LOAD MODEL
# =========================

model = joblib.load("model/kidney_model.pkl")
scaler = joblib.load("model/scaler.pkl")
feature_map = joblib.load("model/feature_map.pkl")


# =========================
# FUNCTION PREDICT
# =========================

def predict(input_data):
    """
    input_data = dict coming from frontend
    """

    # ترتيب الأعمدة حسب التدريب
    features = list(feature_map.values())

    # تحويل dict إلى DataFrame
    data = pd.DataFrame([input_data])

    # إعادة ترتيب الأعمدة
    data = data.reindex(columns=features)

    # scaling
    data_scaled = scaler.transform(data)

    # prediction
    prediction = model.predict(data_scaled)[0]

    return prediction


# =========================
# TEST MANUAL
# =========================

if __name__ == "__main__":

    sample_input = {
        "age": 45,
        "bp": 130,
        "creatinine": 1.2,
        "urea": 40,
        "hemoglobin": 13,
        "sodium": 140,
        "potassium": 4.5,
        "protein": 1,
        "glucose": 110,
        "rbc": 0,
        "diabetes": 1,
        "hypertension": 1
    }

    result = predict(sample_input)

    print("\n====================")
    print("🧠 Prediction Result:", result)
    print("====================")

    if result == 1:
        print("⚠️ High Risk Kidney Disease")
    else:
        print("✅ Low Risk (Healthy)")