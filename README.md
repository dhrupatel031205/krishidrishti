# 🌿 KrishiDrishti – AgriSmart AI
**SIH 2026 Internal Hackathon | L. J. Institute of Engineering and Technology | Problem C-433**

> *Intelligent Agriculture for a Sustainable Future*

---

## 1. Modules Built

### ✅ Core Task
| Module | Description |
|---|---|
| **Crop Disease Detection** | EfficientNet-B0 trained on PlantVillage (38 classes, 54,305 images). Accepts a leaf image → returns disease class + confidence + farmer-friendly recommendations. |

### ✅ Bonus Modules
| Module | Description |
|---|---|
| **A – Crop Recommendation** | RandomForest ML model trained on soil NPK, pH, temperature, humidity, rainfall → recommends best crop. |
| **B – Smart Irrigation** | Rule-based engine using soil moisture, growth stage, rain forecast → irrigate / delay decision. |
| **C – Weather Intelligence** | Live weather via Open-Meteo (keyless) → disease risk alerts, irrigation delay advisories. |
| **D – Sustainability Score** | Formula-based score (water efficiency × 0.4 + fertiliser efficiency × 0.3 + crop health × 0.3) with improvement suggestions. |
| **E – Farmer Assistant (GenAI)** | Groq LLM (Llama-3.3-70B) conversational assistant with Hindi/Gujarati support and KB fallback. |
| **F – IoT Integration** | Simulated sensor stream (soil moisture, temperature, humidity, pH) with day/night cycle and irrigation refill logic. |
| **G – Agentic Advisor** | Autonomous advisory dashboard combining disease, weather, irrigation, and sensor data into unified farm recommendations. |

---

## 2. Setup & Run Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Step 1 – Clone the repository
```bash
git clone <your-repo-url>
cd krishidrishti
```

### Step 2 – Backend setup
```bash
cd backend
pip install -r requirements.txt

# Train the crop recommendation model (Module A)
python train_crop.py --csv crop_recommendation.csv

# Copy and fill in environment variables
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, LLM_API_KEY (Groq key)

# Start the API server
uvicorn main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Step 3 – Frontend setup
```bash
cd krishidrishti_frontend
npm install

# Copy and fill in environment variables
cp .env.local.example .env.local   # or edit .env.local directly
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
# App: http://localhost:3000
```

### Step 4 – Run a prediction (CLI – Section 4.1 requirement)
```bash
# Minimal output (class label only)
python model/predict.py --image path/to/leaf.jpg

# Full JSON output
python model/predict.py --image path/to/leaf.jpg --json
```

**Expected output (minimal):**
```
Corn_(maize)___Northern_Leaf_Blight
```

**Expected output (--json):**
```json
{
  "class_label": "Corn_(maize)___Northern_Leaf_Blight",
  "crop": "Corn maize",
  "condition": "Northern Leaf Blight",
  "healthy": false,
  "confidence": 0.9704,
  "top5": [...]
}
```

> ⏱ A judge can reproduce a prediction in under 2 minutes after `pip install`.

---

## 3. Dataset & Licence

| Dataset | Use | Source | Licence |
|---|---|---|---|
| **PlantVillage** | Core disease detection (train + validation) | [spMohanty/PlantVillage-Dataset](https://github.com/spMohanty/PlantVillage-Dataset) | CC BY 4.0 |
| **Crop Recommendation Dataset** | Module A – crop recommendation | [Atharva Ingle, Kaggle](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) | CC0 Public Domain |
| **Open-Meteo** | Module C – live weather | [open-meteo.com](https://open-meteo.com) | CC BY 4.0 (free, no key) |

---

## 4. Reported Metrics

### Core Task – Crop Disease Detection (EfficientNet-B0)

| Metric | Value |
|---|---|
| **Macro-averaged F1 (primary)** | **0.9634** |
| Accuracy | 96.34 % |
| Classes | 38 (PlantVillage) |
| Train images | 43,444 |
| Validation images | 10,861 |

Full confusion matrix and per-class precision/recall are in:
- `report/MODEL_REPORT.md`
- `ai model/core.ipynb` (notebook output cells)

### Module A – Crop Recommendation (RandomForest)

Run `python backend/train_crop.py --csv backend/crop_recommendation.csv` to see live metrics.
Typical results: Accuracy ~99 %, Macro-F1 ~0.99 on 20 % held-out test split.

---

## 5. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    KrishiDrishti Platform                    │
├──────────────────────┬──────────────────────────────────────┤
│   Frontend (Next.js) │         Backend (FastAPI)            │
│   ─────────────────  │  ──────────────────────────────────  │
│   /diagnosis         │  POST /api/predict  (EfficientNet-B0)│
│   /recommendations   │  POST /recommend-crop  (RandomForest)│
│   /irrigation        │  POST /irrigation  (rule-based)      │
│   /weather           │  GET  /weather  (Open-Meteo)         │
│   /sustainability    │  POST /sustainability-score          │
│   /assistant         │  POST /assistant  (Groq LLM)         │
│   /monitoring        │  GET  /sensor-feed  (simulated IoT)  │
│   /advisor           │  Agentic multi-module aggregation    │
│   /model-metrics     │  GET  /api/model/metrics             │
└──────────────────────┴──────────────────────────────────────┘
         │                            │
         └──────── MongoDB Atlas ─────┘
              (auth, history, sessions)
```

**Core model pipeline:**
```
Leaf image → Validation (MobileNetV3 guard) → EfficientNet-B0 inference
→ Post-model safety check → Groq LLM recommendations → JSON response
```

**Known limitations:**
- Lab-to-field domain gap: validation F1 = 0.9634 on clean PlantVillage;
  field-condition accuracy will be lower (expected ~0.75–0.85).
- Only 38 PlantVillage classes supported; unsupported crops trigger an
  "Uncertain" response rather than a silent wrong prediction.
- Groq LLM requires an API key; system falls back to a curated knowledge
  base when the key is absent.

---

## 6. Demo Video

📹 **[Watch Demo Video](<INSERT_YOUTUBE_OR_DRIVE_LINK_HERE>)**

The video demonstrates:
1. Uploading a leaf image → disease detection result with confidence
2. Crop recommendation with soil parameters
3. Smart irrigation decision
4. Weather advisory
5. Sustainability score
6. AI Farmer Assistant (Hindi response)
7. IoT sensor monitoring dashboard

---

## 7. Deployed App

🌐 **Frontend:** [https://krishidrashtiai.vercel.app](https://krishidrashtiai.vercel.app)  
🔌 **Backend API:** [https://krishidrishti-backend.onrender.com](<INSERT_RENDER_URL>)  
📖 **API Docs:** `<backend-url>/docs`

---

## Originality Declaration

This project was built entirely during the hackathon window (10–15 September).

**Third-party code / libraries referenced:**
- PyTorch & torchvision (BSD licence) – model training and inference
- FastAPI (MIT) – REST API framework
- Next.js (MIT) – frontend framework
- scikit-learn (BSD) – crop recommendation model
- Open-Meteo API – weather data (no key required)
- Groq API – LLM inference (Llama-3.3-70B)
- PlantVillage dataset (CC BY 4.0) – disease detection training data
- Crop Recommendation Dataset by Atharva Ingle (CC0) – Module A training

No public notebooks or pre-built solutions were copied wholesale.
AI coding assistants were used for boilerplate; all model training,
evaluation, and system integration were performed by the team.

---

## Repository Structure

```
krishidrishti/
├── ai model/
│   └── core.ipynb              # Training notebook (EfficientNet-B0)
├── backend/
│   ├── models/
│   │   ├── krishidrishti_efficientnet_b0_final.pth
│   │   └── crop_model.pkl
│   ├── main.py                 # FastAPI app (all modules A-F)
│   ├── train_crop.py           # Module A training script
│   ├── requirements.txt
│   └── .env.example
├── krishidrishti_frontend/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   ├── config/features.ts      # Feature flags
│   └── package.json
├── model/
│   └── predict.py              # ← CLI predict interface (Section 4.1)
├── report/
│   └── MODEL_REPORT.md         # ← One-page model report (Section 7.3)
├── render.yaml                 # Render deployment config
├── runtime.txt                 # Python 3.11.9
└── README.md                   # ← This file
```
