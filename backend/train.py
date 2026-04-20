# kidney-backend/train.py
# شغّل مرة وحدة: python train.py
# يسيف الـ model في model/kidney_model.pkl

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib

# ─── Features اللي كيتطلبهم الفورم ديالنا ─────────────────────────────────────
# نربطوهم مع أعمدة الـ dataset الحقيقية
FEATURE_MAP = {
    "age":          "Age",
    "bp":           "SystolicBP",
    "creatinine":   "SerumCreatinine",
    "urea":         "BUNLevels",
    "hemoglobin":   "HemoglobinLevels",
    "sodium":       "SerumElectrolytesSodium",
    "potassium":    "SerumElectrolytesPotassium",
    "protein":      "ProteinInUrine",
    "glucose":      "FastingBloodSugar",
    "rbc":          "UrinaryTractInfections",
    "diabetes":     "FamilyHistoryDiabetes",
    "hypertension": "FamilyHistoryHypertension",
}

FORM_FEATURES = list(FEATURE_MAP.keys())     # أسماء الـ frontend
DATA_FEATURES = list(FEATURE_MAP.values())   # أسماء الـ dataset

def train():
    # 1. Load
    csv_path = "Chronic_Kidney_Dsease_data.csv"
    if not os.path.exists(csv_path):
        print(f"❌ File not found: {csv_path}")
        print("   ضع الـ CSV في نفس الفولدر مع train.py")
        return

    df = pd.read_csv(csv_path)
    print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"   Target distribution:\n{df['Diagnosis'].value_counts().to_string()}\n")

    # 2. Select features + target
    X = df[DATA_FEATURES].copy()
    y = df["Diagnosis"]

    # 3. Handle missing values (ما كاينش فالـ dataset ديالنا لكن للأمان)
    X = X.fillna(X.median())

    # 4. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 5. Scale
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    # 6. Train Random Forest
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        random_state=42,
        class_weight="balanced",  # مهم لأن الـ dataset imbalanced (1524 vs 135)
    )
    model.fit(X_train_scaled, y_train)

    # 7. Evaluate
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"✅ Model trained!")
    print(f"📊 Accuracy: {acc * 100:.2f}%")
    print(f"\n{classification_report(y_test, y_pred, target_names=['Low Risk (0)', 'High Risk (1)'])}")

    # 8. Save model + scaler + feature order
    os.makedirs("model", exist_ok=True)
    joblib.dump(model,  "model/kidney_model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    joblib.dump(FEATURE_MAP, "model/feature_map.pkl")
    print("✅ Saved: model/kidney_model.pkl")
    print("✅ Saved: model/scaler.pkl")
    print("✅ Saved: model/feature_map.pkl")
    print("")

if __name__ == "__main__":
    train()