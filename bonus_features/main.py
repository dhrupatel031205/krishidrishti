"""
AgriSmart AI - Full Bonus Backend (Modules A-F) in one file.

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload
Docs:
    http://localhost:8000/docs

Modules:
    A  POST /recommend-crop       Crop recommendation (ML, RandomForest)
    B  POST /irrigation           Smart irrigation (rule-based)
    C  GET  /weather              Weather intelligence (Open-Meteo, keyless)
    D  POST /sustainability-score Sustainability score (formula)
    E  POST /assistant            LLM farmer assistant (Hindi/Gujarati)
    F  GET  /sensor-feed          Simulated IoT sensor stream
"""
import math
import os
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

import joblib
import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AgriSmart AI - Bonus Backend (A-F)", version="1.1.0")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://*.vercel.app",
]
_extra = os.getenv("ALLOWED_ORIGIN")
if _extra:
    ALLOWED_ORIGINS.append(_extra)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "AgriSmart AI bonus backend",
        "modules": {
            "A": "POST /recommend-crop", "B": "POST /irrigation",
            "C": "GET /weather?lat=&lon=", "D": "POST /sustainability-score",
            "E": "POST /assistant", "F": "GET /sensor-feed",
        },
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# =====================================================================
# MODULE A - Crop Recommendation  (ML)
# =====================================================================
_CROP_PATHS = [
    Path(__file__).resolve().parent / "models" / "crop_model.pkl",
    Path(__file__).resolve().parent / "crop_model.pkl",
]
_crop_bundle = None


def _load_crop():
    global _crop_bundle
    if _crop_bundle is None:
        for p in _CROP_PATHS:
            if p.exists():
                _crop_bundle = joblib.load(p)
                break
        else:
            raise FileNotFoundError("crop_model.pkl not found. Run: python train_crop.py")
    return _crop_bundle


class SoilInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@app.post("/recommend-crop", tags=["A - Crop Recommendation"])
def recommend_crop(data: SoilInput):
    try:
        bundle = _load_crop()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    model, features = bundle["model"], bundle["features"]
    row = [[getattr(data, f) for f in features]]
    pred = model.predict(row)[0]
    result = {"recommended_crop": str(pred)}
    if hasattr(model, "predict_proba"):
        result["confidence"] = round(float(max(model.predict_proba(row)[0])), 3)
    return result


# =====================================================================
# MODULE B - Smart Irrigation  (rule-based)
# =====================================================================
STAGE_THRESHOLD = {"seedling": 40, "vegetative": 50, "flowering": 60, "maturity": 35}


class IrrigationInput(BaseModel):
    soil_moisture: float
    growth_stage: str
    rain_forecast_mm: float = 0
    temperature: float = 28


@app.post("/irrigation", tags=["B - Smart Irrigation"])
def irrigation(data: IrrigationInput):
    stage = data.growth_stage.strip().lower()
    threshold = STAGE_THRESHOLD.get(stage)
    if threshold is None:
        raise HTTPException(422, f"growth_stage must be one of {list(STAGE_THRESHOLD)}")
    if data.soil_moisture >= threshold:
        return {"irrigate": False,
                "reason": f"Soil moisture {data.soil_moisture}% at/above {stage} target ({threshold}%).",
                "recommended_action": "No irrigation needed."}
    if data.rain_forecast_mm >= 5:
        return {"irrigate": False,
                "reason": f"Soil dry but {data.rain_forecast_mm}mm rain expected in 24h.",
                "recommended_action": "Delay irrigation - rain likely."}
    deficit = threshold - data.soil_moisture
    return {"irrigate": True,
            "reason": f"Soil moisture {data.soil_moisture}% below {stage} target ({threshold}%), no rain.",
            "recommended_action": f"Irrigate now (~{round(deficit * 0.5, 1)} mm to reach target)."}


# =====================================================================
# MODULE C - Weather Intelligence  (Open-Meteo, keyless)
# =====================================================================
def _derive_weather_actions(temp, humidity, rain_24h):
    actions = []
    if rain_24h >= 5:
        actions.append("Delay irrigation - rain likely in next 24h.")
    if humidity >= 80 and 18 <= temp <= 30:
        actions.append("Raised fungal/blight disease risk (warm + humid) - monitor leaves.")
    if temp >= 38:
        actions.append("Heat stress risk - irrigate early morning or evening.")
    if not actions:
        actions.append("Conditions normal - no special action.")
    return actions


@app.get("/weather", tags=["C - Weather Intelligence"])
def weather(lat: float = Query(...), lon: float = Query(...)):
    url = ("https://api.open-meteo.com/v1/forecast"
           f"?latitude={lat}&longitude={lon}"
           "&current=temperature_2m,relative_humidity_2m,precipitation"
           "&hourly=precipitation&forecast_days=1")
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        raise HTTPException(502, f"Weather source error: {e}")
    cur = data.get("current", {})
    temp = cur.get("temperature_2m")
    humidity = cur.get("relative_humidity_2m")
    rain_24h = round(sum(data.get("hourly", {}).get("precipitation", []) or [0]), 2)
    return {"source": "Open-Meteo", "temperature": temp, "humidity": humidity,
            "rain_next_24h_mm": rain_24h,
            "actions": _derive_weather_actions(temp or 0, humidity or 0, rain_24h)}


# =====================================================================
# MODULE D - Sustainability Score  (formula)
# =====================================================================
def _clamp01(x):
    return max(0.0, min(1.0, x))


class SustainabilityInput(BaseModel):
    water_used_liters: float
    water_optimal_liters: float
    fertilizer_used_kg: float
    fertilizer_recommended_kg: float
    crop_health: float


@app.post("/sustainability-score", tags=["D - Sustainability Score"])
def sustainability_score(d: SustainabilityInput):
    water_eff = _clamp01(d.water_optimal_liters / d.water_used_liters) if d.water_used_liters else 0
    fert_eff = _clamp01(d.fertilizer_recommended_kg / d.fertilizer_used_kg) if d.fertilizer_used_kg else 0
    health = _clamp01(d.crop_health)
    score = round(100 * (0.4 * water_eff + 0.3 * fert_eff + 0.3 * health), 1)
    band = "high" if score >= 75 else "medium" if score >= 50 else "low"
    suggestions = []
    if water_eff < 0.8:
        suggestions.append("Reduce water use (drip/scheduled irrigation).")
    if fert_eff < 0.8:
        suggestions.append("Apply fertilizer closer to the recommended dose.")
    if health < 0.8:
        suggestions.append("Improve crop health (disease control, monitoring).")
    if not suggestions:
        suggestions.append("Great - resource use and crop health are efficient.")
    return {"score": score, "band": band,
            "breakdown": {"water_efficiency": round(water_eff, 3),
                          "fertilizer_efficiency": round(fert_eff, 3),
                          "crop_health": round(health, 3)},
            "formula": "100*(0.4*water_eff + 0.3*fertilizer_eff + 0.3*crop_health)",
            "suggestions": suggestions}


# =====================================================================
# MODULE E - Farmer Assistant  (LLM, Hindi/Gujarati, grounded)
# =====================================================================
# Uses an LLM to reply in Hindi or Gujarati, grounded strictly on the
# facts the other modules produced. Default provider = Groq (free,
# OpenAI-compatible). Set ONE env var to enable it:
#     LLM_API_KEY = <your free Groq key from console.groq.com>
# Optional overrides: LLM_BASE_URL, LLM_MODEL.
# If no key is set, it falls back to a grounded reply already written
# in the requested language (so output is ALWAYS Hindi/Gujarati).

LANG_NAME = {"hi": "Hindi", "gu": "Gujarati"}
GREETING = {"hi": "आपकी खेती की सलाह:", "gu": "તમારી ખેતી સલાહ:"}
LABEL_CROP = {"hi": "अनुशंसित फसल", "gu": "ભલામણ કરેલ પાક"}
LABEL_IRRIG = {"hi": "सिंचाई", "gu": "સિંચાઈ"}
LABEL_DISEASE = {"hi": "रोग", "gu": "રોગ"}

# disease -> {hi, gu} precaution
DISEASE_KB = {
    "tomato early blight": {
        "hi": "प्रभावित निचली पत्तियाँ हटाएँ, ऊपर से पानी न डालें, ताँबा-आधारित फफूँदनाशक छिड़कें।",
        "gu": "અસરગ્રસ્ત નીચેનાં પાન દૂર કરો, ઉપરથી પાણી ન આપો, તાંબા-આધારિત ફૂગનાશક છાંટો."},
    "tomato late blight": {
        "hi": "संक्रमित पौधे नष्ट करें, हवा का आवागमन बनाए रखें, तुरंत अनुशंसित फफूँदनाशक छिड़कें।",
        "gu": "ચેપગ્રસ્ત છોડ નાશ કરો, હવાની અવરજવર જાળવો, તરત ભલામણ કરેલ ફૂગનાશક છાંટો."},
    "potato early blight": {
        "hi": "फसल चक्र अपनाएँ, खेत का कचरा हटाएँ, प्रमाणित बीज व समय पर फफूँदनाशक प्रयोग करें।",
        "gu": "પાક ફેરબદલી કરો, ખેતરનો કચરો દૂર કરો, પ્રમાણિત બિયારણ અને સમયસર ફૂગનાશક વાપરો."},
    "corn common rust": {
        "hi": "प्रतिरोधी किस्में लगाएँ, नमी पर नज़र रखें, अधिक होने पर फफूँदनाशक छिड़कें।",
        "gu": "પ્રતિરોધક જાત વાવો, ભેજ પર નજર રાખો, વધુ હોય તો ફૂગનાશક છાંટો."},
    "apple scab": {
        "hi": "हवादार बनाने हेतु छँटाई करें, गिरी पत्तियाँ हटाएँ, कली फूटते समय फफूँदनाशक लगाएँ।",
        "gu": "હવાની અવરજવર માટે કાપણી કરો, ખરેલાં પાન દૂર કરો, કળી ફૂટતી વખતે ફૂગનાશક લગાવો."},
    "healthy": {
        "hi": "कोई रोग नहीं मिला — नियमित निगरानी और संतुलित पोषण जारी रखें।",
        "gu": "કોઈ રોગ મળ્યો નથી — નિયમિત દેખરેખ અને સંતુલિત પોષણ ચાલુ રાખો."},
}
DEFAULT_CARE = {"hi": "उपचार हेतु स्थानीय कृषि सलाह लें।",
                "gu": "સારવાર માટે સ્થાનિક કૃષિ સલાહ લો."}


class AssistantInput(BaseModel):
    disease: Optional[str] = None
    recommended_crop: Optional[str] = None
    irrigation_action: Optional[str] = None
    language: str = "hi"          # hi | gu


def _facts(d: AssistantInput, lang: str) -> str:
    lines = []
    if d.disease:
        care = DISEASE_KB.get(d.disease.strip().lower(), DEFAULT_CARE)[lang]
        lines.append(f"{LABEL_DISEASE[lang]}: {d.disease} - {care}")
    if d.recommended_crop:
        lines.append(f"{LABEL_CROP[lang]}: {d.recommended_crop}")
    if d.irrigation_action:
        lines.append(f"{LABEL_IRRIG[lang]}: {d.irrigation_action}")
    return "\n".join(lines) if lines else "-"


def _grounded_reply(d: AssistantInput, lang: str) -> str:
    return GREETING[lang] + "\n" + _facts(d, lang)


def _llm_reply(facts: str, lang: str) -> Optional[str]:
    api_key = os.getenv("LLM_API_KEY")
    if not api_key:
        return None
    base = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1")
    model = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
    lang_name = LANG_NAME.get(lang, "Hindi")
    try:
        r = requests.post(
            f"{base}/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"model": model, "temperature": 0.4, "messages": [
                {"role": "system",
                 "content": (f"You are a helpful farm advisor. Reply ONLY in {lang_name}. "
                             f"Use ONLY the facts given below - do not invent anything. "
                             f"Write 3-5 short, simple, friendly lines a farmer can follow.")},
                {"role": "user", "content": facts},
            ]},
            timeout=25,
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        return None


@app.post("/assistant", tags=["E - Farmer Assistant"])
def assistant(d: AssistantInput):
    lang = d.language if d.language in LANG_NAME else "hi"
    facts = _facts(d, lang)
    llm = _llm_reply(facts, lang)
    return {
        "reply": llm if llm else _grounded_reply(d, lang),
        "language": lang,
        "llm_used": llm is not None,
    }


# =====================================================================
# MODULE F - IoT Integration  (simulated sensor stream)
# =====================================================================
# A stateful simulator: readings drift smoothly over time, temperature &
# humidity follow a day/night cycle, soil dries gradually then refills
# (simulated irrigation). This mimics a real logging sensor, not random
# noise. Architecture: sensor(sim) -> API -> AI engine -> recommendation.

_sensor_state = {"soil_moisture": 42.0, "ph": 6.6}


def _reading_at(dt: datetime, state: dict) -> dict:
    hour = dt.hour + dt.minute / 60
    cycle = math.sin((hour - 9) / 24 * 2 * math.pi)   # peak ~15:00
    temp = round(26 + 6 * cycle + random.uniform(-0.5, 0.5), 1)
    humidity = round(max(30, min(98, 68 - 18 * cycle + random.uniform(-2, 2))), 1)

    state["soil_moisture"] = max(18, state["soil_moisture"] - random.uniform(0.2, 0.8))
    if state["soil_moisture"] <= 20:                  # simulated irrigation refill
        state["soil_moisture"] = random.uniform(52, 60)
    state["ph"] = round(max(5.5, min(7.5, state["ph"] + random.uniform(-0.02, 0.02))), 2)

    sm = round(state["soil_moisture"], 1)
    needs = sm < 35
    return {
        "timestamp": dt.isoformat(),
        "soil_moisture": sm,
        "temperature": temp,
        "humidity": humidity,
        "ph": state["ph"],
        "needs_irrigation": needs,
        "status": "Soil dry - irrigation may be needed" if needs else "Soil moisture OK",
    }


@app.get("/sensor-feed", tags=["F - IoT (simulated)"])
def sensor_feed(n: int = Query(1, ge=1, le=50)):
    """Returns the last n readings, 10 min apart, ending now (a live stream)."""
    now = datetime.now(timezone.utc)
    readings = [_reading_at(now - timedelta(minutes=10 * (n - 1 - i)), _sensor_state)
                for i in range(n)]
    return {"source": "simulated", "interval_minutes": 10,
            "latest": readings[-1], "readings": readings}