# 🫘 NephroAI — Kidney Disease Risk Prediction System

> **PFE Project** · AI & Business Intelligence in Healthcare  
> Advanced Prediction of Kidney Disease using Gradient Boosting & SMOTE

---

## 📋 Table of Contents

- [Overview](#overview)
- [ML Model Evolution](#-ml-model-evolution-latest-update)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)

---

## 🎯 Overview

**NephroAI** is a clinical decision support system designed to predict the risk of **Chronic Kidney Disease (CKD)**. By analyzing 12 key clinical features, the system provides healthcare professionals with an instant risk assessment to assist in early diagnosis and patient management.

---

## 🔬 ML Model Evolution (Latest Update)

In this version, we have significantly improved the diagnostic reliability by addressing the data imbalance issue found in the original dataset (1,524 High Risk vs 135 Low Risk).

| Property | Old Version | New Version (Current) |
|----------|-------------|-----------------------|
| **Algorithm** | Random Forest | **Gradient Boosting Classifier** |
| **Balancing** | Simple Oversampling | **SMOTE (Synthetic Minority Over-sampling)** |
| **Accuracy** | 99.5% (Overfitted) | **81.02% (Real-world Generalization)** |
| **Threshold** | 0.65 | **0.50 (Balanced)** |

### Why these changes?
* **SMOTE Implementation:** Used to generate synthetic samples for the minority class (Low Risk), enabling the model to actually recognize healthy patients instead of just "memorizing" the majority class.
* **Gradient Boosting:** Replaced Random Forest to better capture complex biological patterns through sequential tree building.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔬 **Risk Prediction** | AI-powered assessment using the new Gradient Boosting model |
| 📊 **BI Dashboard** | Real-time statistics and clinical trends visualization |
| 📄 **PDF Report** | Professional downloadable clinical reports for each prediction |
| 📱 **Responsive UI** | Clean, medical-grade interface built with React & Tailwind |

---

## 🛠 Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Chart.js, jsPDF.  
**Backend:** Python, Flask, Scikit-learn, Imbalanced-learn (SMOTE), Joblib.

---

## 🤖 ML Pipeline (Roadmap)

```text
Raw Data (1659 rows)
      ↓
Feature Selection (12 clinical features)
      ↓
SMOTE Balancing (Minority class 135 → 1524)
      ↓
StandardScaler (Data Normalization)
      ↓
Gradient Boosting Classifier (150 estimators)
      ↓
Diagnostic Accuracy: 81.02%
🚀 Getting Started
1. Backend Setup
Bash
cd kidney-backend
pip install -r requirements.txt
pip install imbalanced-learn  # Required for SMOTE
python train.py               # Trains the updated model
python app.py                 # Starts API on port 5000
2. Frontend Setup
Bash
cd kidney-frontend
npm install
npm run dev                   # Starts UI on port 5173
📡 API Documentation
POST /predict
Request Body:

JSON
{
  "age": "55", "bp": "140", "creatinine": "4.5", "urea": "80", 
  "hemoglobin": "8.0", "sodium": "135", "potassium": "5.0", 
  "protein": "1", "glucose": "1", "rbc": "1", "diabetes": "1", "hypertension": "1"
}
Response:

JSON
{
  "prediction": 1,
  "label": "High Risk",
  "confidence": 85.4,
  "risk_percent": 81.0,
  "model_type": "Gradient Boosting"
}
