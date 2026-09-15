# KrishiDrishti – Evaluator / Judge Manual
**SIH 2026 Internal Hackathon | Problem C-433 | Team KrishiDrishti**

---

## Quick Links

| Resource | URL |
|---|---|
| Live Frontend | https://krishidrashtiai.vercel.app |
| Backend API | https://krishidrishti-1-nva8.onrender.com |
| Swagger UI (interactive) | https://krishidrishti-1-nva8.onrender.com/docs |
| Model Report | `report/MODEL_REPORT.md` |
| Training Notebook | `ai model/core.ipynb` |

> **Render cold-start note:** The free-tier backend sleeps after 15 min of inactivity.
> First request may take 30–60 seconds to wake up. Hit `/health` first if needed.

---

## Section 1 – Reproduce a Prediction in Under 10 Minutes (§4.1 requirement)

### Option A – CLI (fastest, no server needed)

```bash
git clone <repo-url>
cd krishidrishti
pip install torch torchvision Pillow   # ~2 min on fast connection

# Minimal output (class label only)
python model/predict.py --image path/to/leaf.jpg

# Full JSON output
python model/predict.py --image path/to/leaf.jpg --json
```

**Expected minimal output:**
```
Corn_(maize)___Northern_Leaf_Blight
```

**Expected JSON output:**
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

Model weights location: `backend/models/krishidrishti_efficientnet_b0_final.pth`

### Option B – Swagger UI (no local setup)

1. Open https://krishidrishti-1-nva8.onrender.com/docs
2. Find **POST /api/predict** under "Core - Crop Disease Detection"
3. Click **Try it out** → **Choose File** → upload any leaf image → **Execute**
4. Read the JSON response

### Option C – Live Frontend

1. Open https://krishidrashtiai.vercel.app
2. Go to **Diagnosis**
3. Upload a leaf image → result appears in ~3–5 seconds

---

## Section 2 – Verify Core Task Metrics (§7.3 requirement)

All metrics are in `report/MODEL_REPORT.md`:

| What to check | Where |
|---|---|
| Macro-F1 = **0.9634** | MODEL_REPORT.md → Metric & Result |
| Accuracy = **96.34%** | MODEL_REPORT.md → Metric & Result |
| Full 38-class precision/recall/F1 table | MODEL_REPORT.md → Full Per-Class Metrics |
| Confusion matrix with off-diagonal analysis | MODEL_REPORT.md → Confusion Matrix |
| 10-epoch training history | MODEL_REPORT.md → Training History |
| Baseline comparison | MODEL_REPORT.md → Baseline Comparison |

Also available via API (no local setup):
```
GET https://krishidrishti-1-nva8.onrender.com/api/model/metrics
```
Returns full training history + 38-class metrics as JSON.

---

## Section 3 – Verify Each Bonus Module

### Module A – Crop Recommendation

**Swagger UI test:**
1. Open `/docs` → **POST /recommend-crop** → Try it out
2. Select example **"Rice (high humidity)"** from the Examples dropdown → Execute
3. Expected: `recommended_crop: "rice"` with confidence ~0.99

**Frontend test:**
1. Go to `/recommendations` → enter N=90, P=42, K=43, Temp=20.8, Humidity=82, pH=6.5, Rainfall=202.9
2. Expected: Rice as top recommendation

**To see live training metrics:**
```bash
cd backend
python train_crop.py --csv crop_recommendation.csv
# Prints: accuracy ~99%, macro-F1 ~0.99
```

---

### Module B – Smart Irrigation

**Swagger UI test:**
1. Open `/docs` → **POST /irrigation** → Try it out
2. Select **"Irrigate now"** example → Execute
3. Expected: `irrigate: true` with water amount in mm

**Frontend test:**
1. Go to `/irrigation` → select **Vegetative** stage
2. Page fetches live sensor moisture + rain forecast automatically
3. Decision shown with reason and litres required

**Logic verification** (from `backend/main.py`):
```
Thresholds: seedling=40, vegetative=50, flowering=60, maturity=35
If moisture < threshold AND rain < 5mm  → irrigate
If moisture < threshold AND rain ≥ 5mm  → delay
If moisture ≥ threshold                 → no action
```

---

### Module C – Weather Intelligence

**Swagger UI test:**
1. Open `/docs` → **GET /weather** → Try it out
2. lat=23.0225, lon=72.5714 (Ahmedabad) → Execute
3. Expected: live temperature, humidity, rain_next_24h_mm, actions array

**Frontend test:**
1. Go to `/weather` → allow location or use default
2. Live temperature, humidity, disease risk score, 5-day forecast shown
3. Auto-refreshes every 5 minutes

**Data source:** Open-Meteo (https://open-meteo.com) — free, no API key required.

---

### Module D – Sustainability Score

**Swagger UI test:**
1. Open `/docs` → **POST /sustainability-score** → Try it out
2. Select **"Efficient farm"** example → Execute
3. Expected: score ~95, band "high"
4. Select **"Inefficient farm"** example → Execute
5. Expected: score ~42, band "low", suggestions array populated

**Formula verification:**
```
water_eff = min(1, water_optimal / water_used)
fert_eff  = min(1, fert_recommended / fert_used)
score     = 100 × (0.4 × water_eff + 0.3 × fert_eff + 0.3 × crop_health)
```

---

### Module E – Farmer Assistant (GenAI)

**Swagger UI test:**
1. Open `/docs` → **POST /assistant** → Try it out
2. Select **"Hindi query"** example → Execute
3. Expected: reply in Hindi, `llm_used: true` (if Groq key configured) or `false` (KB fallback)

**Frontend test:**
1. Go to `/assistant`
2. Select **हिंदी** language
3. Type: "मेरी फसल में कीड़े लग गए हैं, क्या करूं?"
4. Expected: Hindi response about pest management

**Fallback verification:** If `LLM_API_KEY` is not set, the system returns a curated KB response — `llm_used: false` in the API response confirms this.

---

### Module F – IoT Sensor Feed

**Swagger UI test:**
1. Open `/docs` → **GET /sensor-feed** → Try it out
2. n=6 → Execute
3. Expected: 6 readings with soil_moisture, temperature, humidity, ph, needs_irrigation, timestamp

**Verify day/night cycle:** Call the endpoint at different times — temperature peaks ~15:00 UTC, humidity is inverse.

**Frontend test:**
1. Go to `/monitoring`
2. 4 sensor cards update every 30 seconds
3. Multi-sensor telemetry chart shows last 6 readings

**Documented IoT architecture** (from `backend/main.py` docstring):
```
sensor(sim) → API → AI engine → recommendation engine → web app → farmer
```

---

### Module G – Agentic Advisor

**Swagger UI test:**
1. Open `/docs` → **GET /api/advisor/briefings** → Try it out
2. lat=23.0225, lon=72.5714 → Execute
3. Expected: briefings array sorted by priority, hero_title, hero_description, data_sources with live values

**Verify it's live (not static):**
- Call the endpoint twice 60 seconds apart — `data_sources.soil_moisture` and `data_sources.humidity` will differ
- `generated_at` timestamp changes on every call

**Frontend test:**
1. Go to `/advisor`
2. Briefings show live soil moisture %, live temperature, live rain forecast
3. "Updated HH:MM" timestamp in top-right updates every 60 seconds
4. Click **Refresh** — timestamp updates immediately

**Decision rules verified in code** (`backend/main.py`, `advisor_briefings` function):
- Rule 1: humidity ≥ 75% + temp 18–32°C → fungal risk
- Rule 2: moisture vs 50% threshold + rain forecast → irrigate/delay
- Rule 3: temp ≥ 36°C → heat stress
- Rule 4: rain ≥ 5mm + moisture ≥ 40% → sowing window

---

## Section 4 – Verify Non-Leaf Rejection (Input Validation)

1. Go to `/diagnosis` on the frontend
2. Upload a non-plant image (logo, photo of a person, etc.)
3. Expected: red "Invalid Image — Not a Plant" banner appears, no prediction made

**API-level verification:**
```bash
curl -X POST https://krishidrishti-1-nva8.onrender.com/api/predict \
  -F "file=@non_leaf_image.jpg"
# Expected: HTTP 422, {"detail": {"type": "not_a_plant", "message": "..."}}
```

**Verify PlantNet API is connected:**
```
GET https://krishidrishti-1-nva8.onrender.com/debug/plantnet
```
Expected: `"status": "OK — API reachable, key valid (404 = no plant found in test image, expected)"`

---

## Section 5 – Verify Model Loading

```
GET https://krishidrishti-1-nva8.onrender.com/debug/model
```
Expected:
```json
{
  "status": "OK — model loaded and ready",
  "class_names_count": 38,
  "using_real_model": true
}
```

---

## Section 6 – Evaluation Criteria Mapping

| Criterion | Weight | Where to verify |
|---|---|---|
| **AI/ML Implementation** | 25 | `report/MODEL_REPORT.md` — macro-F1 0.9634, confusion matrix, 38-class table. CLI predict in <2 min. |
| **Technical Implementation** | 20 | README setup works end-to-end. All 8 modules deployed and live. MongoDB auth + history. |
| **Innovation & Creativity** | 15 | PlantNet non-leaf validation. TTA×5 inference. Post-model cross-crop safety check. Agentic live advisor. |
| **Sustainability & Social Impact** | 15 | Module D formula published. Water savings quantified in irrigation briefings. Hindi/Gujarati support. |
| **User Experience** | 10 | Farmer-friendly result cards. Error banners. Auto-refresh with timestamps. Download reports. |
| **Problem Understanding** | 10 | `report/MODEL_REPORT.md` limitations section. Lab-to-field gap acknowledged. Fail-open policy documented. |
| **Presentation & Demo** | 5 | Demo video link in README. |

---

## Section 7 – Repository Structure Verification

```
krishidrishti/
├── ai model/core.ipynb          ← Training notebook with output cells
├── backend/
│   ├── models/
│   │   ├── krishidrishti_efficientnet_b0_final.pth  ← Model weights
│   │   └── crop_model.pkl                           ← Module A weights
│   ├── main.py                  ← All 7 modules in one FastAPI app
│   ├── train_crop.py            ← Module A training script
│   ├── requirements.txt
│   └── .env.example
├── model/predict.py             ← §4.1 CLI interface
├── report/MODEL_REPORT.md       ← §7.3 model report
├── docs/
│   ├── USER_MANUAL.md
│   └── EVALUATOR_MANUAL.md      ← This file
├── render.yaml
├── runtime.txt                  ← Python 3.11.9
└── README.md
```

---

## Section 8 – Environment Variables Required

| Variable | Purpose | Required for |
|---|---|---|
| `LLM_API_KEY` | Groq API key | Module E LLM responses (falls back to KB if absent) |
| `MONGODB_URI` | MongoDB Atlas connection string | Auth + history persistence (works without it) |
| `JWT_SECRET` | JWT signing key | Auth tokens |
| `PLANTNET_API_KEY` | Pl@ntNet plant validation | Non-leaf rejection (fails open if absent) |
