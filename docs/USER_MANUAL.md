# KrishiDrishti – User Manual
**AgriSmart AI | SIH 2026 | Problem C-433**

🌐 Live App: https://krishidrashtiai.vercel.app

---

## Getting Started

### Create an Account
1. Click **Sign Up** on the app
2. Enter name, email, password, phone, farm name, location
3. You are logged in automatically — history and chat sessions are now saved to MongoDB

### Without an Account
All modules work without logging in. Data is not persisted between visits.

---

## Core – Crop Disease Detection (`/diagnosis`)

**What it does:** Upload a crop leaf photo → AI diagnosis with confidence, severity, and treatment plan.

**Actual pipeline:**
```
Upload image
  → Content-type guard (image/* only)
  → PlantNet API: is this a plant? (HTTP 404 = reject)
  → EfficientNet-B0 inference with TTA × 5 (5 augmented views averaged)
  → Post-model safety check (cross-crop top-5 mismatch → "Unsupported")
  → Groq LLM generates recommendations (KB fallback if no key)
  → Saved to MongoDB if authenticated
  → Result shown to user
```

**Steps:**
1. Go to **Diagnosis** → click **Upload Leaf Image**
2. Wait ~3–5 seconds
3. Read: crop, disease, confidence %, severity, immediate actions, treatment plan, prevention, top-5 probabilities

**Tips:**
- Single leaf, close-up, good lighting
- Supported: Tomato, Potato, Corn, Apple, Grape, Pepper, Peach, Strawberry + 6 more (38 classes)
- Non-leaf images → red "Not a Plant" banner
- Unsupported crop → "Unsupported Crop" error with explanation

---

## Module A – Crop Recommendation (`/recommendations`)

**What it does:** RandomForest ML model recommends the best crop from soil + climate inputs.

**Pipeline:**
```
N, P, K, pH, temperature, humidity, rainfall
  → crop_model.pkl (RandomForest, ~99% accuracy)
  → Top-3 crops with confidence scores
  → Saved to MongoDB if authenticated
```

**Steps:**
1. Go to **Recommendations** → enter soil parameters
2. Click **Get Recommendation**
3. See top-3 crops with yield, water requirement, growth duration, advantages, risks

**Example – Rice:** N=90, P=42, K=43, Temp=20.8, Humidity=82, pH=6.5, Rainfall=202.9
**Example – Chickpea:** N=20, P=50, K=20, Temp=18, Humidity=65, pH=7.0, Rainfall=80

---

## Module B – Smart Irrigation (`/irrigation`)

**What it does:** Decides irrigate / delay / skip using live sensor moisture + rain forecast + growth stage threshold.

**Pipeline:**
```
GET /sensor-feed → latest soil_moisture
GET /weather → rain_next_24h_mm
POST /irrigation → rule engine:
  moisture < threshold AND rain < 5mm  → irrigate (amount in litres)
  moisture < threshold AND rain ≥ 5mm  → delay
  moisture ≥ threshold                 → no action
```

**Thresholds by growth stage:**

| Stage | Irrigate below |
|---|---|
| Seedling | 40 % |
| Vegetative | 50 % |
| Flowering | 60 % |
| Maturity | 35 % |

**Steps:**
1. Go to **Irrigation** → select growth stage
2. Page auto-fetches sensor + weather data
3. Read decision + water amount in litres
4. Use **Manual Cycle** button to simulate valve open/close
5. Click **Refresh** for latest reading

---

## Module C – Weather Intelligence (`/weather`)

**What it does:** Live weather from Open-Meteo (no API key) → disease risk score + agro-advisories.

**Pipeline:**
```
Browser GPS (or default Karnal lat/lon)
  → Open-Meteo API → temperature, humidity, 24h precipitation
  → Rule engine:
      humidity ≥ 80% + temp 18–30°C → fungal risk advisory
      rain ≥ 5mm                    → delay irrigation advisory
      temp ≥ 38°C                   → heat stress advisory
  → Disease risk score (0–100)
  → Auto-refreshes every 5 minutes
```

**Steps:**
1. Go to **Weather** → allow location or use default
2. Read temperature, humidity, precipitation, pathogen risk index
3. Follow agronomic advisories
4. Check 5-day forecast with rain probability

---

## Module D – Sustainability Score (`/sustainability`)

**What it does:** Formula-based 0–100 score from water efficiency, fertilizer use, and crop health.

**Formula (published):**
```
water_eff  = min(1, water_optimal / water_used)
fert_eff   = min(1, fert_recommended / fert_used)
score      = 100 × (0.4 × water_eff + 0.3 × fert_eff + 0.3 × crop_health)
```

**Bands:** High ≥ 75 | Medium ≥ 50 | Low < 50

**Steps:**
1. Go to **Sustainability** → enter water used/optimal, fertilizer used/recommended, crop health (0–1)
2. Click **Calculate**
3. Read score, band, breakdown per component, improvement suggestions

---

## Module E – Farmer Assistant (`/assistant`)

**What it does:** Conversational AI in English / Hindi / Gujarati / Punjabi / Telugu.

**Pipeline:**
```
User message + language + last 10 conversation turns
  → Groq LLM (Llama-3.3-70B) with language-specific system prompt
  → Falls back to keyword-matched KB if LLM unavailable
      (keywords: blight, irrigat, fertilizer, crop, disease, weather, soil)
  → Chat session saved to MongoDB if authenticated
```

**Steps:**
1. Go to **Assistant** → select language
2. Type question → press Send
3. Click suggested follow-ups for quick replies

**Example questions:**
- "My tomato leaves have brown spots with yellow rings. What should I do?"
- "मेरी फसल में कीड़े लग गए हैं, क्या करूं?"
- "મારા ટામેટાના પાન પર ડાઘ છે, શું કરવું?"

---

## Module F – IoT Sensor Monitoring (`/monitoring`)

**What it does:** Live dashboard of simulated sensor readings with historical trend chart.

**Simulator behaviour:**
```
_sensor_state = { soil_moisture: 42.0, ph: 6.6 }  (server-side, persistent)

Each reading:
  temperature = 26 + 6 × sin((hour-9)/24 × 2π) ± 0.5   (day/night cycle)
  humidity    = 68 - 18 × sin(...) ± 2                   (inverse of temp)
  soil_moisture -= random(0.2, 0.8) per reading
  if moisture ≤ 20% → refill to 52–60%                   (simulated irrigation)
  ph drifts ±0.02 per reading within [5.5, 7.5]
```

**Steps:**
1. Go to **Monitoring**
2. View 4 sensor cards: moisture, temperature, humidity, pH
3. View multi-sensor telemetry chart (last 6 readings = 1 hour)
4. Auto-refreshes every 30 seconds — click **Refresh** for immediate update

---

## Module G – Agentic Advisor (`/advisor`)

**What it does:** Autonomous advisory engine combining live sensor + weather into ranked briefings. Auto-refreshes every 60 seconds.

**Decision rules (run on every request):**
```
Rule 1: humidity ≥ 75% AND temp 18–32°C
        → Fungal risk briefing (critical if humidity ≥ 85%, else high)

Rule 2: soil_moisture < 50%
        AND rain ≥ 5mm  → Hold irrigation briefing (high)
        AND rain < 5mm  → Irrigate now briefing (high)
        soil_moisture ≥ 50% → Optimal briefing (low)

Rule 3: temperature ≥ 36°C
        → Heat stress briefing (high)

Rule 4: rain ≥ 5mm AND soil_moisture ≥ 40%
        → Favourable sowing window briefing (medium)

Sort: critical → high → medium → low
Hero banner = top briefing title + reason
```

**Steps:**
1. Go to **Advisor**
2. Read hero banner (most urgent action)
3. Scroll ranked briefings — each shows reason, recommended action, estimated impact, data sources
4. Click **Acknowledge** once acted on
5. Click **Refresh** or wait 60 seconds for live update
6. Click **Download Report** to export as JSON

---

## Dashboard (`/dashboard`)

Aggregates all modules. Auto-refreshes every 60 seconds.

Shows: crop health overview, active disease alert, live soil moisture, sustainability score, top advisory briefing, weather risk, last 3 diagnoses.

---

## Diagnosis History (`/diagnosis/history`)

All past diagnoses with crop, disease, confidence, severity. Update status (Active / Treated / Monitoring) or delete entries.

---

## Download Reports

Every page has a **Download Report** button (top-right). Exports current data as structured JSON.
