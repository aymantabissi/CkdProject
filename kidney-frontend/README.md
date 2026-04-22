# 🫘 NephroAI — Kidney Disease Risk Prediction System

> **PFE Project** · AI & Business Intelligence in Healthcare  
> Prediction of Acute or Chronic Kidney Disease using Machine Learning

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [ML Model](#ml-model)
- [Screenshots](#screenshots)

---

## 🎯 Overview

**NephroAI** is a clinical decision support system that predicts the risk of **Acute or Chronic Kidney Disease (CKD)** from patient clinical and biological data using a trained Machine Learning model.

The system provides healthcare professionals with an instant risk assessment based on 12 clinical features including blood tests, urine analysis, and medical history — helping improve early diagnosis and patient care.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔬 **Risk Prediction** | AI-powered CKD risk assessment from clinical data |
| 📊 **BI Dashboard** | Real-time statistics and charts from the dataset |
| 📄 **PDF Report** | Downloadable clinical report for each patient |
| 🔔 **Toast Notifications** | Real-time feedback on prediction results |
| ⚡ **Skeleton Loading** | Smooth loading states during API calls |
| 📱 **Responsive UI** | Clean medical-grade interface |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| Vite | 5.x | Build Tool |
| Tailwind CSS | 3.x | Styling |
| React Router | 6.x | Navigation |
| Chart.js + react-chartjs-2 | Latest | Data Visualization |
| react-hot-toast | Latest | Notifications |
| jsPDF | Latest | PDF Report Generation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Runtime |
| Flask | Latest | REST API |
| Flask-CORS | Latest | Cross-Origin Requests |
| Scikit-learn | Latest | ML Model |
| Pandas + NumPy | Latest | Data Processing |
| Joblib | Latest | Model Serialization |

### ML Model
| Property | Value |
|----------|-------|
| Algorithm | Random Forest Classifier |
| Dataset | Chronic Kidney Disease Dataset |
| Records | 1,659 patients |
| Features | 12 clinical features |
| Accuracy | **99.51%** |
| Balancing | Oversampling (minority class) |

---

## 📁 Project Structure

```
kidney-project/
│
├── kidney-frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── KidneyForm.jsx        # Main prediction form
│   │   │   └── Navbar.jsx            # Navigation bar
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Home page
│   │   │   ├── PredictionPage.jsx    # Prediction page
│   │   │   ├── DashboardPage.jsx     # BI Dashboard
│   │   │   └── AboutPage.jsx         # About page
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   └── App.jsx                   # Router setup
│   ├── package.json
│   └── index.html
│
└── kidney-backend/                   # Flask API
    ├── app.py                        # Flask application
    ├── train.py                      # Model training script
    ├── requirements.txt
    ├── Chronic_Kidney_Dsease_data.csv
    └── model/
        ├── kidney_model.pkl          # Trained RF model
        ├── scaler.pkl                # StandardScaler
        └── feature_map.pkl           # Feature mapping
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip

---

### 1. Clone / Setup

```bash
# Create project folders
mkdir kidney-project
cd kidney-project
```

---

### 2. Backend Setup

```bash
cd kidney-backend

# Install dependencies
pip install -r requirements.txt

# Place your dataset in this folder:
# Chronic_Kidney_Dsease_data.csv

# Train the model (run once)
python train.py

# Start the API server
python app.py
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd kidney-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

### 4. Verify Connection

Open browser → `http://localhost:5000`

Expected response:
```json
{
  "message": "NephroAI Backend is running 🚀",
  "status": "ok"
}
```

---

## 📡 API Documentation

### `GET /`
Health check.

**Response:**
```json
{ "status": "ok", "message": "NephroAI Backend is running 🚀" }
```

---

### `POST /predict`
Predict kidney disease risk for a patient.

**Request Body:**
```json
{
  "age":          "55",
  "bp":           "140",
  "creatinine":   "4.5",
  "urea":         "80",
  "hemoglobin":   "8.0",
  "sodium":       "135",
  "potassium":    "5.0",
  "protein":      "1",
  "glucose":      "1",
  "rbc":          "1",
  "diabetes":     "1",
  "hypertension": "1"
}
```

**Response:**
```json
{
  "prediction":   1,
  "label":        "High Risk",
  "confidence":   94.5,
  "risk_percent": 89.2
}
```

| Field | Type | Description |
|-------|------|-------------|
| `prediction` | int | `0` = Low Risk, `1` = High Risk |
| `label` | string | Human-readable label |
| `confidence` | float | Model confidence % |
| `risk_percent` | float | Probability of High Risk % |

---

### `GET /stats`
Get dataset statistics for the Dashboard.

**Response:**
```json
{
  "total_records":    1659,
  "high_risk":        1524,
  "low_risk":         135,
  "model_accuracy":   99.5,
  "features_count":   12,
  "age_distribution": [...],
  "risk_factors":     [...]
}
```

---

## 🤖 ML Model

### Feature Mapping

| Frontend Field | Dataset Column | Unit |
|---------------|----------------|------|
| age | Age | years |
| bp | SystolicBP | mmHg |
| creatinine | SerumCreatinine | mg/dL |
| urea | BUNLevels | mg/dL |
| hemoglobin | HemoglobinLevels | g/dL |
| sodium | SerumElectrolytesSodium | mEq/L |
| potassium | SerumElectrolytesPotassium | mEq/L |
| protein | ProteinInUrine | 0/1 |
| glucose | FastingBloodSugar | mg/dL |
| rbc | UrinaryTractInfections | 0/1 |
| diabetes | FamilyHistoryDiabetes | 0/1 |
| hypertension | FamilyHistoryHypertension | 0/1 |

### Training Pipeline

```
Raw Data (1659 rows)
      ↓
Feature Selection (12 features)
      ↓
Handle Imbalance (Oversampling minority class 135 → 1524)
      ↓
Train/Test Split (80% / 20%)
      ↓
StandardScaler
      ↓
Random Forest (200 trees, max_depth=15)
      ↓
Accuracy: 99.51%
```

### Prediction Threshold

The model uses a custom threshold of **0.65** (instead of default 0.50) to reduce false positives caused by the imbalanced original dataset.

---

## 👨‍💻 Author

| | |
|---|---|
| **Name** | *Your Name* |
| **Institution** | *Your University* |
| **Year** | 2024–2025 |
| **Project Type** | Final Year Project (PFE) |

---

## ⚠️ Disclaimer

> This system is intended for **academic and clinical decision support purposes only**.  
> It does **not** replace professional medical diagnosis or specialist consultation.  
> Always consult a qualified healthcare professional for medical decisions.

---

*NephroAI · Nephrology AI Module · v1.0*