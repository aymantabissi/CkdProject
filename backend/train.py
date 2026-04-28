import os
import pandas as pd
import numpy as np

from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib

from imblearn.over_sampling import SMOTE

# XGBoost
from xgboost import XGBClassifier


# =========================
# CONFIG
# =========================

FEATURE_MAP = {
    "age":           "Age",
    "bp":            "SystolicBP",
    "creatinine":    "SerumCreatinine",
    "urea":          "BUNLevels",
    "hemoglobin":    "HemoglobinLevels",
    "sodium":        "SerumElectrolytesSodium",
    "potassium":     "SerumElectrolytesPotassium",
    "protein":       "ProteinInUrine",
    "glucose":       "FastingBloodSugar",
    "rbc":           "UrinaryTractInfections",
    "diabetes":      "FamilyHistoryDiabetes",
    "hypertension":  "FamilyHistoryHypertension",
}

DATA_FEATURES = list(FEATURE_MAP.values())


# =========================
# FUNCTION EVALUATION
# =========================

def evaluate_model(name, model, X_train, y_train, X_test, y_test):
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)

    print("\n" + "="*60)
    print(f"🤖 Model: {name}")
    print(f"📊 Accuracy: {acc * 100:.2f}%")
    print("="*60)

    print(classification_report(y_test, y_pred))

    return model, acc


# =========================
# TRAIN
# =========================

def train():

    # 1. Load dataset
    csv_path = "Chronic_Kidney_Dsease_data.csv"

    if not os.path.exists(csv_path):
        print("❌ Dataset introuvable")
        return

    df = pd.read_csv(csv_path)
    print(f"✅ Dataset loaded: {df.shape}")

    # 2. Features / target
    X = df[DATA_FEATURES].copy()
    y = df["Diagnosis"].astype(int)

    # 3. Missing values
    X = X.fillna(X.median())

    # 4. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # 5. Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 6. SMOTE
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)

    print(f"📊 After SMOTE: {len(y_train_res)} samples")

    # =========================
    # MODELS LIST
    # =========================

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),

        "Random Forest": RandomForestClassifier(
            n_estimators=200,
            max_depth=6,
            random_state=42
        ),

        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=150,
            learning_rate=0.05,
            max_depth=4,
            subsample=0.8,
            random_state=42
        ),

        "XGBoost": XGBClassifier(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=5,
            subsample=0.8,
            colsample_bytree=0.8,
            eval_metric="logloss",
            random_state=42
        )
    }

    # =========================
    # TRAIN ALL
    # =========================

    best_model = None
    best_score = 0
    best_name = ""

    results = {}

    for name, model in models.items():
        trained_model, acc = evaluate_model(
            name,
            model,
            X_train_res,
            y_train_res,
            X_test_scaled,
            y_test
        )

        results[name] = acc

        if acc > best_score:
            best_score = acc
            best_model = trained_model
            best_name = name

    # =========================
    # SUMMARY
    # =========================

    print("\n📊 FINAL COMPARISON")
    print("="*40)

    for k, v in results.items():
        print(f"{k}: {v*100:.2f}%")

    print("\n🏆 BEST MODEL:", best_name)
    print(f"📈 BEST ACCURACY: {best_score*100:.2f}%")

    # =========================
    # SAVE
    # =========================

    os.makedirs("model", exist_ok=True)

    joblib.dump(best_model, "model/kidney_model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    joblib.dump(FEATURE_MAP, "model/feature_map.pkl")

    print("\n✅ Model saved successfully!")


# =========================
# RUN
# =========================

if __name__ == "__main__":
<<<<<<< HEAD
    train()
||||||| 6e9ce79
    train()

"""
# kidney-backend/train.py
# Commande : python train.py
# Ce script entraîne un modèle Gradient Boosting avec SMOTE pour équilibrer les classes.

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib

# Utilisation d'imblearn pour le suréchantillonnage de la classe minoritaire
try:
    from imblearn.over_sampling import SMOTE
except ImportError:
    print("❌ Erreur : La bibliothèque 'imblearn' est absente.")
    print("👉 Exécutez : pip install imbalanced-learn")
    exit()

# Configuration des colonnes (Mapping Frontend -> Dataset)
FEATURE_MAP = {
    "age":           "Age",
    "bp":            "SystolicBP",
    "creatinine":    "SerumCreatinine",
    "urea":          "BUNLevels",
    "hemoglobin":    "HemoglobinLevels",
    "sodium":        "SerumElectrolytesSodium",
    "potassium":     "SerumElectrolytesPotassium",
    "protein":       "ProteinInUrine",
    "glucose":       "FastingBloodSugar",
    "rbc":           "UrinaryTractInfections",
    "diabetes":      "FamilyHistoryDiabetes",
    "hypertension":  "FamilyHistoryHypertension",
}

DATA_FEATURES = list(FEATURE_MAP.values())

def train():
    # 1. Chargement des données
    csv_path = "Chronic_Kidney_Dsease_data.csv"
    if not os.path.exists(csv_path):
        print(f"❌ Fichier introuvable : {csv_path}")
        return

    df = pd.read_csv(csv_path)
    print(f"✅ Dataset chargé : {df.shape[0]} lignes")

    # 2. Préparation des variables
    X = df[DATA_FEATURES].copy()
    y = df["Diagnosis"]

    # 3. Traitement des valeurs manquantes (médiane)
    X = X.fillna(X.median())

    # 4. Division des données (Stratified pour garder les proportions)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 5. Mise à l'échelle (Standardisation)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    # 6. Équilibrage des données avec SMOTE (Crucial pour votre dataset)
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)
    print(f"📊 Données équilibrées : {len(y_train_res)} échantillons d'entraînement")

    # 7. Entraînement du Gradient Boosting
    model = GradientBoostingClassifier(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        random_state=42
    )
    model.fit(X_train_res, y_train_res)

    # 8. Évaluation
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)

    print("\n" + "="*30)
    print(f"✅ Gradient Boosting (avec SMOTE) entraîné !")
    print(f"📊 Précision globale : {acc * 100:.2f}%")
    print("="*30)
    print(classification_report(y_test, y_pred, target_names=['Low Risk (0)', 'High Risk (1)']))

    # 9. Sauvegarde
    os.makedirs("model", exist_ok=True)
    joblib.dump(model,  "model/kidney_model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    joblib.dump(FEATURE_MAP, "model/feature_map.pkl")
    print("\n✅ Modèle sauvegardé avec succès dans le dossier /model/")

# التعديل المهم هنا: حيدنا الفراغ اللي كان مورا main
if __name__ == "__main__":
    train()
=======
    train()

"""
# kidney-backend/train.py
# Commande : python train.py
# Ce script entraîne un modèle Gradient Boosting avec SMOTE pour équilibrer les classes.

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib

# Utilisation d'imblearn pour le suréchantillonnage de la classe minoritaire
try:
    from imblearn.over_sampling import SMOTE
except ImportError:
    print("❌ Erreur : La bibliothèque 'imblearn' est absente.")
    print("👉 Exécutez : pip install imbalanced-learn")
    exit()

# Configuration des colonnes (Mapping Frontend -> Dataset)
FEATURE_MAP = {
    "age":           "Age",
    "bp":            "SystolicBP",
    "creatinine":    "SerumCreatinine",
    "urea":          "BUNLevels",
    "hemoglobin":    "HemoglobinLevels",
    "sodium":        "SerumElectrolytesSodium",
    "potassium":     "SerumElectrolytesPotassium",
    "protein":       "ProteinInUrine",
    "glucose":       "FastingBloodSugar",
    "rbc":           "UrinaryTractInfections",
    "diabetes":      "FamilyHistoryDiabetes",
    "hypertension":  "FamilyHistoryHypertension",
}

DATA_FEATURES = list(FEATURE_MAP.values())

def train():
    # 1. Chargement des données
    csv_path = "Chronic_Kidney_Dsease_data.csv"
    if not os.path.exists(csv_path):
        print(f"❌ Fichier introuvable : {csv_path}")
        return

    df = pd.read_csv(csv_path)
    print(f"✅ Dataset chargé : {df.shape[0]} lignes")

    # 2. Préparation des variables
    X = df[DATA_FEATURES].copy()
    y = df["Diagnosis"]

    # 3. Traitement des valeurs manquantes (médiane)
    X = X.fillna(X.median())

    # 4. Division des données (Stratified pour garder les proportions)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 5. Mise à l'échelle (Standardisation)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    # 6. Équilibrage des données avec SMOTE (Crucial pour votre dataset)
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)
    print(f"📊 Données équilibrées : {len(y_train_res)} échantillons d'entraînement")

    # 7. Entraînement du Gradient Boosting
    model = GradientBoostingClassifier(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        random_state=42
    )
    model.fit(X_train_res, y_train_res)

    # 8. Évaluation
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)

    print("\n" + "="*30)
    print(f"✅ Gradient Boosting (avec SMOTE) entraîné !")
    print(f"📊 Précision globale : {acc * 100:.2f}%")
    print("="*30)
    print(classification_report(y_test, y_pred, target_names=['Low Risk (0)', 'High Risk (1)']))

    # 9. Sauvegarde
    os.makedirs("model", exist_ok=True)
    joblib.dump(model,  "model/kidney_model.pkl")
    joblib.dump(scaler, "model/scaler.pkl")
    joblib.dump(FEATURE_MAP, "model/feature_map.pkl")
    print("\n✅ Modèle sauvegardé avec succès dans le dossier /model/")

# التعديل المهم هنا: حيدنا الفراغ اللي كان مورا main
if __name__ == "__main__":
    train()

>>>>>>> 7cf2bb361725bdac32384a83b480e0fedd012a24
