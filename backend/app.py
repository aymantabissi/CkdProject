# kidney-backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # يسمح للـ React frontend يكلمو

# ─── Load model + scaler عند بداية السيرفر ────────────────────────────────────
MODEL_PATH  = "model/kidney_model.pkl"
SCALER_PATH = "model/scaler.pkl"
FMAP_PATH   = "model/feature_map.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "❌ Model not found! Run: python train.py first"
    )

model      = joblib.load(MODEL_PATH)
scaler     = joblib.load(SCALER_PATH)
feature_map = joblib.load(FMAP_PATH)

# ترتيب الـ features كما في الـ training
FORM_FEATURES = list(feature_map.keys())

print("✅ Model loaded successfully!")
print(f"   Features: {FORM_FEATURES}")


# ─── Helper: parse + validate input ──────────────────────────────────────────
def parse_input(data: dict) -> list:
    """
    يحوّل الـ JSON من الـ frontend لـ array جاهز للـ model
    كل قيمة ناقصة تتعوض بالـ median
    """
    # Medians من الـ dataset (fallback إذا خلاو حقل فارغ)
    DEFAULTS = {
        "age":          50.0,
        "bp":           120.0,
        "creatinine":   3.5,
        "urea":         35.0,
        "hemoglobin":   13.5,
        "sodium":       138.0,
        "potassium":    4.0,
        "protein":      0.0,
        "glucose":      100.0,
        "rbc":          0.0,
        "diabetes":     0.0,
        "hypertension": 0.0,
    }

    row = []
    for feat in FORM_FEATURES:
        val = data.get(feat, "")
        try:
            row.append(float(val))
        except (ValueError, TypeError):
            row.append(DEFAULTS.get(feat, 0.0))
    return row


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "NephroAI Backend is running 🚀"})


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        # Parse input
        row = parse_input(data)
        X   = np.array([row])

        # Scale
        X_scaled = scaler.transform(X)

        # Predict
        proba        = model.predict_proba(X_scaled)[0]
        risk_percent = round(float(proba[1]) * 100, 1)

        # Threshold 0.65 — يقلل false positives
        THRESHOLD  = 0.65
        prediction = 1 if proba[1] >= THRESHOLD else 0
        confidence = round(float(proba[prediction]) * 100, 1)

        return jsonify({
            "prediction":   prediction,
            "confidence":   confidence,
            "risk_percent": risk_percent,
            "label":        "High Risk" if prediction == 1 else "Low Risk",
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/stats", methods=["GET"])
def stats():
    """
    بيانات للـ Dashboard — إذا بغيت تجيبهم من الـ API
    """
    return jsonify({
        "total_records":   1659,
        "high_risk":       1524,
        "low_risk":        135,
        "model_accuracy":  97.0,
        "features_count":  12,
    })


# ─── Run ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)