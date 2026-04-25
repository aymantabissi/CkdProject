# kidney-backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])
@app.after_request
def apply_headers(response):
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    return response
# ─── MongoDB — optional ───────────────────────────────────────────────────────
try:
    from db.mongo import db, users_collection, history_collection
    MONGO_ENABLED = db is not None
    print("✅ MongoDB ready!" if MONGO_ENABLED else "⚠️ MongoDB disabled")
except Exception as e:
    db = users_collection = history_collection = None
    MONGO_ENABLED = False
    print(f"⚠️ MongoDB disabled: {e}")

# ─── Auth routes ──────────────────────────────────────────────────────────────
try:
    from routes.auth import auth
    app.register_blueprint(auth, url_prefix="/auth")
except Exception as e:
    print(f"⚠️ Auth routes disabled: {e}")

# ─── Chat routes ──────────────────────────────────────────────────────────────
try:
    from routes.chat import chat_bp
    app.register_blueprint(chat_bp)
except Exception as e:
    print(f"⚠️ Chat routes disabled: {e}")

# ─── Load ML Model ───────────────────────────────────────────────────────────
MODEL_PATH  = "model/kidney_model.pkl"
SCALER_PATH = "model/scaler.pkl"
FMAP_PATH   = "model/feature_map.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("❌ Model not found! Run: python train.py first")

model         = joblib.load(MODEL_PATH)
scaler        = joblib.load(SCALER_PATH)
feature_map   = joblib.load(FMAP_PATH)
FORM_FEATURES = list(feature_map.keys())
print("✅ Gradient Boosting Model loaded!")

# ─── Helper ───────────────────────────────────────────────────────────────────
DEFAULTS = {
    "age": 50.0, "bp": 120.0, "creatinine": 3.5, "urea": 35.0,
    "hemoglobin": 13.5, "sodium": 138.0, "potassium": 4.0,
    "protein": 0.0, "glucose": 100.0, "rbc": 0.0,
    "diabetes": 0.0, "hypertension": 0.0,
}

def parse_input(data: dict) -> list:
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
    return jsonify({
        "status": "ok",
        "message": "NephroAI Backend is running 🚀",
        "mongodb": MONGO_ENABLED,
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400

        row      = parse_input(data)
        X_scaled = scaler.transform(np.array([row]))
        proba    = model.predict_proba(X_scaled)[0]

        risk_percent = round(float(proba[1]) * 100, 1)
        prediction   = 1 if proba[1] >= 0.50 else 0
        confidence   = round(float(proba[prediction]) * 100, 1)

        result = {
            "prediction":   prediction,
            "confidence":   confidence,
            "risk_percent": risk_percent,
            "label":        "High Risk" if prediction == 1 else "Low Risk",
            "model_type":   "Gradient Boosting",
        }

        # حفظ في MongoDB إذا متصل
        if MONGO_ENABLED and history_collection is not None:
            try:
                from datetime import datetime
                history_collection.insert_one({
                    **data, **result,
                    "date": datetime.utcnow().isoformat(),
                })
            except Exception:
                pass

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "Empty file"}), 400

        import pandas as pd
        df = pd.read_csv(file)
        if df.empty:
            return jsonify({"error": "Empty CSV file"}), 400

        raw         = df.iloc[0].to_dict()
        REVERSE_MAP = {v: k for k, v in feature_map.items()}
        inputs      = {}
        for dataset_col, form_key in REVERSE_MAP.items():
            val = raw.get(dataset_col, raw.get(form_key, ""))
            inputs[form_key] = str(val) if val != "" else ""

        row      = parse_input(inputs)
        X_scaled = scaler.transform(np.array([row]))
        proba    = model.predict_proba(X_scaled)[0]

        risk_percent = round(float(proba[1]) * 100, 1)
        prediction   = 1 if proba[1] >= 0.50 else 0
        confidence   = round(float(proba[prediction]) * 100, 1)

        return jsonify({
            "prediction":   prediction,
            "confidence":   confidence,
            "risk_percent": risk_percent,
            "label":        "High Risk" if prediction == 1 else "Low Risk",
            "inputs":       inputs,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def history():
    if not MONGO_ENABLED or history_collection is None:
        return jsonify({"error": "MongoDB not connected"}), 503
    try:
        records = list(history_collection.find({}, {"_id": 0}).sort("date", -1).limit(50))
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/stats", methods=["GET"])
def stats():
    try:
        import pandas as pd
        df = pd.read_csv("Chronic_Kidney_Dsease_data.csv")

        total     = len(df)
        high_risk = int(df["Diagnosis"].sum())
        low_risk  = total - high_risk

        bins   = [0, 20, 30, 40, 50, 60, 70, 200]
        labels = ["0-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71+"]
        df["age_group"] = pd.cut(df["Age"], bins=bins, labels=labels)
        age_dist = (
            df.groupby(["age_group", "Diagnosis"], observed=True)
              .size().unstack(fill_value=0).reset_index()
        )
        age_distribution = [
            {"age": str(r["age_group"]), "high": int(r.get(1, 0)), "low": int(r.get(0, 0))}
            for _, r in age_dist.iterrows()
        ]

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
            "model_accuracy":   81.0,
            "features_count":   12,
            "age_distribution": age_distribution,
            "risk_factors":     risk_factors,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/test-db")
def test_db():
    if not MONGO_ENABLED:
        return jsonify({"status": "disabled", "message": "MongoDB not connected"})
    try:
        db.command("ping")
        return jsonify({"status": "success", "message": "MongoDB is connected ✅"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)