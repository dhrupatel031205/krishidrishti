# 🌿 KrishiDrishti – AgriSmart AI
**SIH 2026 Internal Hackathon | L. J. Institute of Engineering and Technology | Problem C-433**

> *Intelligent Agriculture for a Sustainable Future*

---

## 1. Modules Built

### ✅ Core Task
| Module | Description |
|---|---|
| **Crop Disease Detection** | EfficientNet-B0 trained on PlantVillage (38 classes, 54,305 images). Accepts a leaf image → PlantNet plant validation → EfficientNet-B0 inference with TTA×5 → post-model safety check → Groq LLM recommendations. |

### ✅ Bonus Modules
| Module | Description |
|---|---|
| **A – Crop Recommendation** | RandomForest ML model trained on soil NPK, pH, temperature, humidity, rainfall → top-3 crops with confidence scores. |
| **B – Smart Irrigation** | Rule-based engine using soil moisture, growth stage, rain forecast → irrigate / delay decision. |
| **C – Weather Intelligence** | Live weather via Open-Meteo (keyless) → disease risk alerts, irrigation delay advisories. |
| **D – Sustainability Score** | Formula-based score (water efficiency × 0.4 + fertiliser efficiency × 0.3 + crop health × 0.3) with improvement suggestions. |
| **E – Farmer Assistant (GenAI)** | Groq LLM (Llama-3.3-70B) conversational assistant with Hindi/Gujarati/Punjabi/Telugu support and KB fallback. Full conversation history (last 10 turns). |
| **F – IoT Integration** | Simulated sensor stream (soil moisture, temperature, humidity, pH) with day/night cycle and irrigation refill logic. |
| **G – Agentic Advisor** | Autonomous advisory dashboard combining disease, weather, irrigation, and sensor data into ranked farm briefings. |

### ✅ Auth & Persistence
| Feature | Description |
|---|---|
| **Auth** | JWT-based register/login + Clerk integration. Diagnosis history, crop recommendations, chat sessions, and sensor readings persisted to MongoDB per user. |

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
# Edit .env: set MONGODB_URI, JWT_SECRET, LLM_API_KEY (Groq key), PLANTNET_API_KEY

# Start the API server
uvicorn main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Step 3 – Frontend setup
```bash
cd krishidrishti_frontend
npm install

# Edit .env.local directly (already present)
# Set NEXT_PUBLIC_API_URL=http://localhost:8000
# Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY (from https://dashboard.clerk.com)

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
| **Pl@ntNet API** | Non-leaf image rejection | [my-api.plantnet.org](https://my-api.plantnet.org) | Free tier (500 req/day) |

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
- `GET /api/model/metrics` (live API endpoint)

### Module A – Crop Recommendation (RandomForest)

Run `python backend/train_crop.py --csv backend/crop_recommendation.csv` to see live metrics.
Typical results: Accuracy ~99 %, Macro-F1 ~0.99 on 20 % held-out test split.

---

## 5. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      KrishiDrishti Platform                          │
├──────────────────────────┬──────────────────────────────────────────┤
│   Frontend (Next.js 16)  │         Backend (FastAPI)                │
│   ──────────────────     │  ────────────────────────────────────    │
│   /dashboard             │  POST /api/predict  (EfficientNet-B0)   │
│   /diagnosis             │  POST /recommend-crop  (RandomForest)   │
│   /recommendations       │  POST /irrigation  (rule-based)         │
│   /irrigation            │  GET  /weather  (Open-Meteo)            │
│   /weather               │  POST /sustainability-score             │
│   /sustainability        │  POST /assistant  (Groq LLM)            │
│   /assistant             │  GET  /sensor-feed  (simulated IoT)     │
│   /monitoring            │  GET  /api/advisor/briefings            │
│   /advisor               │  GET  /api/model/metrics                │
│   /model-metrics         │  POST /api/auth/register                │
│   /settings              │  POST /api/auth/login                   │
│   /login  /signup        │  GET|PUT /api/auth/me                   │
└──────────────────────────┴──────────────────────────────────────────┘
         │                              │
         └──────── MongoDB Atlas ───────┘
    (users, diagnosis_history, recommendations,
     chat_history, sensor_readings)
```

**Core disease detection pipeline:**
```
Leaf image upload
  → [1] Content-type guard (image/* only)
  → [2] Pl@ntNet API validation (HTTP 404 = not a plant → reject with banner)
  → [3] EfficientNet-B0 inference with TTA × 5 (5 augmented views averaged)
  → [4] Post-model safety check (cross-crop top-5 mismatch → "Unsupported" error)
  → [5] Groq LLM recommendations (falls back to curated KB if no API key)
  → [6] Result saved to MongoDB (if user authenticated)
  → JSON response to frontend
```

**Module A – Crop Recommendation pipeline:**
```
Soil inputs (N, P, K, pH, temp, humidity, rainfall)
  → RandomForest model (crop_model.pkl)
  → Top-3 crops with confidence scores
  → Saved to MongoDB recommendations collection (if authenticated)
```

**Module B – Smart Irrigation pipeline:**
```
Sensor feed (latest soil moisture) + Open-Meteo rain forecast
  → Rule engine: moisture vs growth-stage threshold
  → If moisture < threshold AND rain < 5mm → irrigate
  → If moisture < threshold AND rain ≥ 5mm → delay
  → If moisture ≥ threshold → no action
```

**Module C – Weather Intelligence pipeline:**
```
GPS coordinates (browser geolocation or default Karnal)
  → Open-Meteo API (free, no key) → temperature, humidity, 24h precipitation
  → Rule engine → disease risk score + agro-advisories
  → Auto-refreshes every 5 minutes on frontend
```

**Module D – Sustainability Score pipeline:**
```
Sensor feed (soil moisture as crop_health proxy) + fixed farm inputs
  → Formula: score = 100 × (0.4 × water_eff + 0.3 × fert_eff + 0.3 × crop_health)
  → Band: High ≥75, Medium ≥50, Low <50
  → Improvement suggestions if any component < 0.8
```

**Module E – Farmer Assistant pipeline:**
```
User message + language code + conversation history (last 10 turns)
  → Groq LLM (Llama-3.3-70B) with system prompt in selected language
  → Falls back to keyword-matched KB (blight/irrigation/fertilizer/weather/soil)
  → Supports: en, hi, gu, pa, te
  → Chat sessions saved to MongoDB (if authenticated)
```

**Module F – IoT Sensor Feed pipeline:**
```
Stateful simulator (server-side _sensor_state dict)
  → Day/night sinusoidal cycle for temperature & humidity
  → Soil moisture drifts down 0.2–0.8% per reading; refills at 20%
  → pH drifts ±0.02 per reading within [5.5, 7.5]
  → Returns n readings (10-min intervals); auto-refreshes every 30s on frontend
```

**Module G – Agentic Advisor pipeline:**
```
On each request (auto-refresh every 60s):
  → Fetch live sensor reading (soil moisture, temp, humidity)
  → Fetch live weather from Open-Meteo (rain_24h, temp override)
  → Rule 1: humidity ≥75% + temp 18–32°C → fungal risk briefing
  → Rule 2: moisture < 50% + rain forecast → irrigate / delay briefing
  → Rule 3: temp ≥36°C → heat stress briefing
  → Rule 4: rain ≥5mm + moisture ≥40% → sowing window briefing
  → Sort by priority (critical > high > medium > low)
  → Return ranked briefings + hero banner from top briefing
```

**Known limitations:**
- Lab-to-field domain gap: validation F1 = 0.9634 on clean PlantVillage;
  field-condition accuracy will be lower (expected ~0.75–0.85).
- Only 38 PlantVillage classes supported; unsupported crops trigger an
  "Uncertain" response rather than a silent wrong prediction.
- Groq LLM requires an API key; system falls back to a curated knowledge
  base when the key is absent.
- PlantNet validation requires `PLANTNET_API_KEY` env var; fails open
  (allows prediction) if key is missing or API is unreachable.

---

## 6. Demo Video

📹 **[Watch Demo Video](https://screenrec.com/share/u7yNjHSrtz)**

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
🔌 **Backend API:** [https://krishidrishti-1-nva8.onrender.com](https://krishidrishti-1-nva8.onrender.com)  
📖 **API Docs:** [https://krishidrishti-1-nva8.onrender.com/docs](https://krishidrishti-1-nva8.onrender.com/docs)

> **Render cold-start note:** Free-tier backend sleeps after 15 min of inactivity. First request may take 30–60 seconds. Hit `/health` first if needed.

---

## Originality Declaration

This project was built entirely during the hackathon window (10–15 September).

**Third-party code / libraries referenced:**
- PyTorch & torchvision (BSD licence) – model training and inference
- FastAPI (MIT) – REST API framework
- Next.js 16 (MIT) – frontend framework
- Clerk (SaaS) – authentication
- scikit-learn (BSD) – crop recommendation model
- Open-Meteo API – weather data (no key required)
- Groq API – LLM inference (Llama-3.3-70B)
- Pl@ntNet API – plant/leaf image validation
- PlantVillage dataset (CC BY 4.0) – disease detection training data
- Crop Recommendation Dataset by Atharva Ingle (CC0) – Module A training
- MongoDB Atlas – database (free tier)
- Recharts, Framer Motion, TanStack Query, jsPDF – frontend libraries

No public notebooks or pre-built solutions were copied wholesale.
AI coding assistants were used for boilerplate; all model training,
evaluation, and system integration were performed by the team.

---

## Repository Structure

```
krishidrishti/
├── ai model/
│   ├── core.ipynb              # Training notebook (EfficientNet-B0)
│   └── stage1-2.ipynb          # Stage 1-2 experiments
├── backend/
│   ├── models/
│   │   ├── krishidrishti_efficientnet_b0_final.pth
│   │   ├── best_agri_model.pth
│   │   └── crop_model.pkl
│   ├── main.py                 # FastAPI app (all modules A-G + Auth)
│   ├── train_crop.py           # Module A training script
│   ├── start.py                # Render production entry point
│   ├── start.bat               # Windows dev helper
│   ├── crop_recommendation.csv
│   ├── requirements.txt
│   ├── runtime.txt             # Python 3.11.9
│   └── .env.example
├── krishidrishti_frontend/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/
│   │   ├── diagnosis/
│   │   ├── recommendations/
│   │   ├── irrigation/
│   │   ├── weather/
│   │   ├── sustainability/
│   │   ├── assistant/
│   │   ├── monitoring/
│   │   ├── advisor/
│   │   ├── model-metrics/
│   │   ├── settings/
│   │   ├── login/
│   │   └── signup/
│   ├── components/
│   ├── config/features.ts      # Feature flags
│   ├── lib/api/client.ts       # API client layer (live + mock)
│   ├── .env.local              # API URL + Clerk keys + default coordinates
│   └── package.json
├── model/
│   └── predict.py              # ← CLI predict interface (Section 4.1)
├── report/
│   └── MODEL_REPORT.md         # ← One-page model report (Section 7.3)
├── docs/
│   ├── EVALUATOR_MANUAL.md     # Judge/evaluator step-by-step guide
│   ├── USER_MANUAL.md
│   └── KrishiDrishti_Model_Report.pdf
├── render.yaml                 # Render deployment config
├── runtime.txt                 # Python 3.11.9
└── README.md                   # ← This file
```
