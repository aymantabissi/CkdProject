# kidney-backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from db.mongo import db
from routes.auth import auth

import numpy as np
from routes.chat import chat_bp
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)  # يسمح للـ React frontend بالتواصل مع السيرفر

# ─── تحميل الموديل الجديد (Gradient Boosting) عند بداية السيرفر ──────────────
MODEL_PATH  = "model/kidney_model.pkl"
SCALER_PATH = "model/scaler.pkl"
FMAP_PATH   = "model/feature_map.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "❌ Model not found! Run: python train.py first"
    )

model       = joblib.load(MODEL_PATH)
scaler      = joblib.load(SCALER_PATH)
feature_map = joblib.load(FMAP_PATH)

# ترتيب الـ features كما تم استخدامه في التدريب
FORM_FEATURES = list(feature_map.keys())

print("✅ Gradient Boosting Model loaded successfully!")


# ─── Helper: parse + validate input ──────────────────────────────────────────
def parse_input(data: dict) -> list:
    """
    يحوّل الـ JSON من الـ frontend لـ array جاهز للـ model
    """
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
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(chat_bp)

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "NephroAI Backend is running 🚀"})

# تحديث الـ API ليتناسب مع Gradient Boosting
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        # تحضير البيانات
        row = parse_input(data)
        X   = np.array([row])

        # الـ Scaling (ضروري جداً لـ Gradient Boosting)
        X_scaled = scaler.transform(X)

        # حساب الاحتمالات
        proba        = model.predict_proba(X_scaled)[0]
        risk_percent = round(float(proba[1]) * 100, 1)

        # تعديل الـ THRESHOLD ليكون 0.50 بدلاً من 0.65
        # بما أننا استخدمنا SMOTE، الموديل أصبح متوازناً ولا نحتاج لعتبة عالية جداً
        THRESHOLD  = 0.50
        prediction = 1 if proba[1] >= THRESHOLD else 0
        confidence = round(float(proba[prediction]) * 100, 1)

        return jsonify({
            "prediction":   prediction,
            "confidence":   confidence,
            "risk_percent": risk_percent,
            "label":        "High Risk" if prediction == 1 else "Low Risk",
            "model_type":   "Gradient Boosting"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/stats", methods=["GET"])
def stats():
    import pandas as pd
    df = pd.read_csv("Chronic_Kidney_Dsease_data.csv")

    total      = len(df)
    high_risk  = int(df["Diagnosis"].sum())
    low_risk   = total - high_risk

    # توزيع الأعمار (للرسم البياني في الـ Dashboard)
    bins   = [0, 20, 30, 40, 50, 60, 70, 200]
    labels = ["0-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71+"]
    df["age_group"] = pd.cut(df["Age"], bins=bins, labels=labels)
    age_dist = (
        df.groupby(["age_group", "Diagnosis"], observed=True)
          .size()
          .unstack(fill_value=0)
          .reset_index()
    )
    age_distribution = [
        {
            "age":  str(row["age_group"]),
            "high": int(row.get(1, 0)),
            "low":  int(row.get(0, 0)),
        }
        for _, row in age_dist.iterrows()
    ]

    # عوامل الخطر بناءً على تحليل الـ Dataset
    risk_factors = [
        {"factor": "High Creatinine",  "impact": round(float((df["SerumCreatinine"] > 3).mean() * 100), 1)},
        {"factor": "Diabetes History", "impact": round(float(df[df["FamilyHistoryDiabetes"] == 1]["Diagnosis"].mean() * 100), 1)},
        {"factor": "Hypertension",     "impact": round(float(df[df["FamilyHistoryHypertension"] == 1]["Diagnosis"].mean() * 100), 1)},
        {"factor": "High BUN Levels",  "impact": round(float((df["BUNLevels"] > 60).mean() * 100), 1)},
        {"factor": "UTI History",      "impact": round(float(df[df["UrinaryTractInfections"] == 1]["Diagnosis"].mean() * 100), 1)},
        {"factor": "Low Hemoglobin",   "impact": round(float((df["HemoglobinLevels"] < 10).mean() * 100), 1)},
    ]

    return jsonify({
        "total_records":    total,
        "high_risk":        high_risk,
        "low_risk":         low_risk,
        "model_accuracy":   81.0,  # التحديث بناءً على النتيجة الجديدة للـ Gradient Boosting
        "features_count":   12,
        "age_distribution": age_distribution,
        "risk_factors":     risk_factors,
    })

@app.route("/test-db")
def test_db():
    try:
        db.command("ping")
        return {"status": "success", "message": "MongoDB is connected ✅"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ─── Run ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)