/**
 * KrishiDrishti API Client Layer
 * 
 * Provides a decoupled abstraction between UI components and backend services.
 * In development / demo mode, it responds with realistic agricultural simulation data.
 * When NEXT_PUBLIC_API_URL is configured, it points directly to the FastAPI server.
 */

import {
  PredictionResponse,
  DiagnosisHistoryItem,
  CropRecommendationInput,
  CropRecommendationResult,
  IrrigationStatus,
  AgroWeatherData,
  SustainabilityReport,
  SensorDashboardData,
  AdvisoryBriefing,
  ChatMessage,
} from "@/types";

import {
  sampleLeaves,
  mockDiagnosisHistory,
  calculateMockCropRecommendations,
  mockIrrigationStatus,
  mockWeatherData,
  mockSustainabilityReport,
  mockSensorData,
  mockAdvisories,
  getInitialChatMessages,
} from "@/lib/mock/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const IS_SIMULATION_FORCED = !API_BASE_URL;
const IS_DIAGNOSIS_LIVE = !!API_BASE_URL;
const DEFAULT_LAT = process.env.NEXT_PUBLIC_DEFAULT_LAT || "29.6857";
const DEFAULT_LON = process.env.NEXT_PUBLIC_DEFAULT_LON || "76.9905";

function getAuthHeaders(): Record<string, string> {
  try {
    const saved = localStorage.getItem("krishidrishti_auth");
    if (saved) {
      const { token } = JSON.parse(saved);
      if (token) return { Authorization: `Bearer ${token}` };
    }
  } catch {}
  return {};
}

// ==========================================
// 1. CROP DISEASE DETECTION API
// ==========================================

export async function predictCropDisease(fileOrSampleId: File | string): Promise<PredictionResponse> {
  // Sample leaf demo mode (string ID passed)
  if (typeof fileOrSampleId === "string") {
    const matched = sampleLeaves.find((s) => s.id === fileOrSampleId);
    await new Promise((r) => setTimeout(r, 1200));
    if (matched) {
      return { ...matched.prediction, analyzedAt: new Date().toISOString(), imageUrl: matched.image };
    }
  }

  // No backend configured — use mock
  if (!IS_DIAGNOSIS_LIVE) {
    await new Promise((r) => setTimeout(r, 1500));
    const previewUrl = URL.createObjectURL(fileOrSampleId as File);
    // Pick sample deterministically based on file size so different images vary
    const idx = (fileOrSampleId as File).size % sampleLeaves.length;
    const sample = sampleLeaves[idx];
    return { ...sample.prediction, analyzedAt: new Date().toISOString(), imageUrl: previewUrl };
  }

  // Real backend: POST /api/predict
  const formData = new FormData();
  if (typeof fileOrSampleId !== "string") {
    formData.append("file", fileOrSampleId);
  } else {
    // Fetch sample image and send as file
    const matched = sampleLeaves.find((s) => s.id === fileOrSampleId);
    const imgRes = await fetch(matched?.image || "");
    const blob = await imgRes.blob();
    formData.append("file", new File([blob], `${fileOrSampleId}.jpg`, { type: "image/jpeg" }));
  }

  const response = await fetch(`${API_BASE_URL}/api/predict`, { method: "POST", body: formData, headers: getAuthHeaders() });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // detail can be a string or an object like { type, message }
    const detail = err?.detail;
    const msg =
      (typeof detail === "object" && detail !== null ? detail.message : detail) ||
      `Inference engine failed with status ${response.status}`;
    throw new Error(String(msg));
  }
  return response.json();
}

export async function fetchDiagnosisHistory(): Promise<DiagnosisHistoryItem[]> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 300));
    return mockDiagnosisHistory;
  }
  const response = await fetch(`${API_BASE_URL}/api/diagnosis/history`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Failed to fetch diagnosis history");
  const data = await response.json();
  // If MongoDB returned real data use it, otherwise it's the static fallback array
  return data;
}


// ==========================================
// 2. CROP RECOMMENDATIONS API
// ==========================================

export async function getCropRecommendations(input: CropRecommendationInput): Promise<CropRecommendationResult[]> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 800));
    return calculateMockCropRecommendations(input);
  }

  // Map frontend input to backend SoilInput schema
  const payload = {
    N: input.nitrogen,
    P: input.phosphorus,
    K: input.potassium,
    temperature: input.temperature,
    humidity: input.humidity,
    ph: input.ph,
    rainfall: input.rainfall,
    soil_type: input.soilType,
  };

  const response = await fetch(`${API_BASE_URL}/recommend-crop`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Crop recommendation engine error");
  const data = await response.json();

  // Build top results — primary from model, extras from top_crops if returned
  const topCrops: Array<{ crop: string; confidence: number }> = data.top_crops || [
    { crop: data.recommended_crop, confidence: data.confidence ?? 0.9 },
  ];

  // Crop metadata lookup for richer results
  const CROP_META: Record<string, { yield: string; water: "Low" | "Medium" | "High"; days: number; advantages: string[]; risks: string[] }> = {
    rice:        { yield: "4.0–5.5 T/ha", water: "High",   days: 120, advantages: ["High caloric staple crop", "Strong MSP support"], risks: ["High water consumption"] },
    maize:       { yield: "3.5–5.0 T/ha", water: "Medium", days: 90,  advantages: ["Versatile industrial use", "Fast growing cycle"], risks: ["Susceptible to stem borer"] },
    chickpea:    { yield: "2.0–2.8 T/ha", water: "Low",    days: 105, advantages: ["Nitrogen-fixing, improves soil", "Low input cost"], risks: ["Sensitive to waterlogging"] },
    kidneybeans: { yield: "1.5–2.2 T/ha", water: "Low",    days: 95,  advantages: ["High protein value", "Good market price"], risks: ["Susceptible to bean mosaic virus"] },
    pigeonpeas:  { yield: "1.2–2.0 T/ha", water: "Low",    days: 150, advantages: ["Drought tolerant", "Deep root system"], risks: ["Long growing season"] },
    mothbeans:   { yield: "0.8–1.5 T/ha", water: "Low",    days: 75,  advantages: ["Extremely drought resistant", "Minimal inputs"], risks: ["Low yield potential"] },
    mungbean:    { yield: "1.0–1.8 T/ha", water: "Low",    days: 65,  advantages: ["Short cycle, fits rotation", "High protein"], risks: ["Susceptible to yellow mosaic virus"] },
    blackgram:   { yield: "0.8–1.4 T/ha", water: "Low",    days: 80,  advantages: ["Nitrogen fixer", "Good rabi crop"], risks: ["Sensitive to frost"] },
    lentil:      { yield: "1.0–1.8 T/ha", water: "Low",    days: 110, advantages: ["High protein, good export demand", "Improves soil nitrogen"], risks: ["Susceptible to rust"] },
    pomegranate: { yield: "8–12 T/ha",    water: "Low",    days: 180, advantages: ["High value fruit crop", "Drought tolerant once established"], risks: ["Long establishment period"] },
    banana:      { yield: "20–35 T/ha",   water: "High",   days: 300, advantages: ["High yield per hectare", "Year-round income"], risks: ["Requires consistent irrigation"] },
    mango:       { yield: "5–10 T/ha",    water: "Low",    days: 365, advantages: ["High export value", "Perennial income"], risks: ["Long time to first harvest"] },
    grapes:      { yield: "8–15 T/ha",    water: "Medium", days: 180, advantages: ["High market value", "Multiple harvests"], risks: ["Requires trellising and pruning"] },
    watermelon:  { yield: "20–30 T/ha",   water: "Medium", days: 80,  advantages: ["Fast growing, high demand", "Good summer crop"], risks: ["Susceptible to powdery mildew"] },
    muskmelon:   { yield: "15–25 T/ha",   water: "Medium", days: 75,  advantages: ["High market value in summer", "Short cycle"], risks: ["Sensitive to excess moisture"] },
    apple:       { yield: "10–20 T/ha",   water: "Medium", days: 180, advantages: ["High value fruit", "Long shelf life"], risks: ["Requires cold climate"] },
    orange:      { yield: "10–15 T/ha",   water: "Medium", days: 240, advantages: ["High vitamin C demand", "Perennial income"], risks: ["Susceptible to citrus greening"] },
    papaya:      { yield: "30–50 T/ha",   water: "Medium", days: 270, advantages: ["Very high yield", "Year-round fruiting"], risks: ["Susceptible to papaya ringspot virus"] },
    coconut:     { yield: "80–120 nuts/tree", water: "Medium", days: 365, advantages: ["Multiple uses (oil, water, fiber)", "Long productive life"], risks: ["Slow to establish"] },
    cotton:      { yield: "1.5–2.5 T/ha", water: "Medium", days: 160, advantages: ["High cash crop value", "Strong MSP"], risks: ["Susceptible to bollworm"] },
    jute:        { yield: "2.0–3.0 T/ha", water: "High",   days: 120, advantages: ["Eco-friendly fiber crop", "Good export demand"], risks: ["Requires high rainfall"] },
    coffee:      { yield: "0.5–1.5 T/ha", water: "Medium", days: 365, advantages: ["High value export crop", "Shade tolerant"], risks: ["Requires specific altitude and climate"] },
    blueberry:   { yield: "2–4 T/ha",     water: "Medium", days: 150, advantages: ["Premium health food market", "High antioxidant value"], risks: ["Requires acidic soil (pH 4.5–5.5)"] },
    raspberry:   { yield: "3–5 T/ha",     water: "Medium", days: 120, advantages: ["High market value", "Annual bearing"], risks: ["Susceptible to cane diseases"] },
  };

  return topCrops.map((item, idx) => {
    const cropKey = item.crop.toLowerCase().replace(/[^a-z]/g, "");
    const meta = CROP_META[cropKey] ?? { yield: "Varies by region", water: "Medium" as const, days: 120, advantages: [`Suited for N:${input.nitrogen} P:${input.phosphorus} K:${input.potassium} at pH ${input.ph}`], risks: [] };
    return {
      id: `rec-live-${idx + 1}`,
      cropName: item.crop,
      suitabilityScore: Math.round(item.confidence * 100),
      expectedYield: meta.yield,
      waterRequirement: meta.water,
      growthDurationDays: meta.days,
      sustainabilityRating: Math.round(item.confidence * 100),
      reason: `RandomForest model recommends ${item.crop} with ${Math.round(item.confidence * 100)}% confidence based on your soil parameters (N:${input.nitrogen} P:${input.phosphorus} K:${input.potassium}, pH:${input.ph}, Temp:${input.temperature}°C).`,
      advantages: meta.advantages,
      risks: meta.risks,
    };
  });
}

// ==========================================
// 3. SMART IRRIGATION API
// ==========================================

export async function fetchIrrigationStatus(growthStage: string = "vegetative"): Promise<IrrigationStatus> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return mockIrrigationStatus;
  }
  // Step 1: get current soil moisture from sensor
  const sensorRes = await fetch(`${API_BASE_URL}/sensor-feed?n=6`, { headers: getAuthHeaders() });
  if (!sensorRes.ok) throw new Error("Failed to fetch sensor data for irrigation");
  const sensorData = await sensorRes.json();
  const latest = sensorData.latest;

  // Step 2: get real rain forecast from weather API
  let rainForecastMm = 0;
  try {
    const weatherRes = await fetch(`${API_BASE_URL}/weather?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`);
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      rainForecastMm = weatherData.rain_next_24h_mm ?? 0;
    }
  } catch {}

  // Step 3: call irrigation decision engine
  const irrigRes = await fetch(`${API_BASE_URL}/irrigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({
      soil_moisture: latest.soil_moisture,
      growth_stage: growthStage,
      rain_forecast_mm: rainForecastMm,
      temperature: latest.temperature,
    }),
  });
  if (!irrigRes.ok) throw new Error("Failed to fetch irrigation status");
  const irrigData = await irrigRes.json();

  const THRESHOLDS: Record<string, number> = { seedling: 40, vegetative: 50, flowering: 60, maturity: 35 };
  const threshold = THRESHOLDS[growthStage] ?? 50;

  // Calculate next irrigation time
  const now = new Date();
  let nextTime = "Not required";
  if (irrigData.irrigate) {
    // Schedule next irrigation at next 6AM or 6PM window
    const next = new Date(now);
    const hour = now.getHours();
    if (hour < 6) { next.setHours(6, 0, 0, 0); }
    else if (hour < 18) { next.setHours(18, 0, 0, 0); }
    else { next.setDate(next.getDate() + 1); next.setHours(6, 0, 0, 0); }
    nextTime = next.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return {
    currentMoisture: latest.soil_moisture,
    targetMoistureMin: threshold - 10,
    targetMoistureMax: threshold + 15,
    waterRequirementLiters: irrigData.irrigate ? Math.round((threshold - latest.soil_moisture) * 0.5 * 100) : 0,
    nextIrrigationTime: nextTime,
    status: irrigData.irrigate ? "needs_water" : latest.soil_moisture > threshold + 15 ? "saturated" : "optimal",
    lastWatered: new Date(latest.timestamp).toLocaleString(),
    isSimulated: false,
    rainForecastMm,
    irrigationReason: irrigData.reason,
    history: sensorData.readings.map((r: { timestamp: string; soil_moisture: number }) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      moisture: r.soil_moisture,
      threshold,
    })),
  };
}

// ==========================================
// 4. WEATHER INTELLIGENCE API
// ==========================================

export async function fetchAgroWeather(lat?: number, lon?: number): Promise<AgroWeatherData> {
  const useLat = lat ?? parseFloat(DEFAULT_LAT);
  const useLon = lon ?? parseFloat(DEFAULT_LON);

  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return { ...mockWeatherData, location: lat ? `${useLat.toFixed(4)}, ${useLon.toFixed(4)}` : mockWeatherData.location };
  }
  const response = await fetch(`${API_BASE_URL}/weather?lat=${useLat}&lon=${useLon}`);
  if (!response.ok) throw new Error("Failed to fetch agro-weather");
  const data = await response.json();

  const riskScore = Math.min(100, Math.round(
    (data.humidity > 75 ? 40 : 10) +
    (data.rain_next_24h_mm > 5 ? 20 : 0) +
    (data.temperature > 20 && data.temperature < 32 ? 20 : 0)
  ));

  // Build a 5-day forecast from mock since Open-Meteo free tier doesn't return daily forecast
  const forecastDays = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];
  const baseForecast = mockWeatherData.forecast;
  const liveForecast = forecastDays.map((day, i) => ({
    day,
    tempMax: Math.round((data.temperature ?? 28) + (i * 0.5)),
    tempMin: Math.round((data.temperature ?? 28) - 7 + (i * 0.3)),
    humidity: Math.round((data.humidity ?? 70) - i * 2),
    rainChance: i === 0 ? Math.round((data.rain_next_24h_mm ?? 0) > 5 ? 65 : 20) : baseForecast[i]?.rainChance ?? 20,
    condition: baseForecast[i]?.condition ?? "Partly Cloudy",
  }));

  return {
    location: `${useLat.toFixed(4)}°N, ${useLon.toFixed(4)}°E`,
    temperature: data.temperature ?? 0,
    humidity: data.humidity ?? 0,
    rainfallMm: data.rain_next_24h_mm ?? 0,
    windSpeedKmh: 0,
    uvIndex: 0,
    diseaseRiskScore: riskScore,
    diseaseRiskCategory: riskScore > 70 ? "High" : riskScore > 40 ? "Moderate" : "Low",
    agriculturalAlerts: (data.actions as string[]).map((action: string) => ({
      type: "advisory" as const,
      message: action,
      action: action,
    })),
    forecast: liveForecast,
    isSimulated: false,
  };
}

// ==========================================
// 5. SUSTAINABILITY SCORE API
// ==========================================

export async function fetchSustainabilityReport(): Promise<SustainabilityReport> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return mockSustainabilityReport;
  }
  // Fetch sensor data to build a real sustainability payload
  const sensorRes = await fetch(`${API_BASE_URL}/sensor-feed?n=1`, { headers: getAuthHeaders() });
  if (!sensorRes.ok) throw new Error("Failed to fetch sensor data for sustainability");
  const sensorData = await sensorRes.json();
  const latest = sensorData.latest;

  const payload = {
    water_used_liters: 1800,
    water_optimal_liters: 1400,
    fertilizer_used_kg: 50,
    fertilizer_recommended_kg: 45,
    crop_health: latest.soil_moisture / 100,
  };

  const response = await fetch(`${API_BASE_URL}/sustainability-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to fetch sustainability score");
  const data = await response.json();

  // Map to frontend SustainabilityReport shape
  const grade = data.score >= 75 ? "A" : data.score >= 50 ? "B" : "C";
  return {
    overallScore: data.score,
    grade: grade as "A" | "B" | "C" | "D",
    carbonOffsetEstimateKg: Math.round(data.score * 16),
    waterSavedLiters: Math.round(data.breakdown.water_efficiency * 50000),
    pillars: {
      waterEfficiency: {
        title: "Water Conservation & Precision",
        score: Math.round(data.breakdown.water_efficiency * 100),
        weight: 40,
        benchmark: 70,
        status: data.breakdown.water_efficiency >= 0.8 ? "excellent" : "good",
        recommendations: data.suggestions,
      },
      soilHealth: {
        title: "Soil Vitality & Organic Carbon",
        score: Math.round(data.breakdown.crop_health * 100),
        weight: 25,
        benchmark: 65,
        status: data.breakdown.crop_health >= 0.8 ? "excellent" : "good",
        recommendations: ["Monitor soil organic matter regularly."],
      },
      cropDiversity: {
        title: "Crop Diversity & Rotation",
        score: 75,
        weight: 20,
        benchmark: 60,
        status: "good",
        recommendations: ["Consider adding a cover crop during fallow season."],
      },
      chemicalUsage: {
        title: "Chemical & Pesticide Rationalization",
        score: Math.round(data.breakdown.fertilizer_efficiency * 100),
        weight: 15,
        benchmark: 55,
        status: data.breakdown.fertilizer_efficiency >= 0.8 ? "excellent" : "good",
        recommendations: data.suggestions,
      },
      resourceEfficiency: {
        title: "Energy & Resource Efficiency",
        score: Math.round(data.score),
        weight: 15,
        benchmark: 60,
        status: data.score >= 75 ? "excellent" : "good",
        recommendations: ["Optimize pump scheduling for off-peak hours."],
      },
    },
  };
}

// ==========================================
// 6. IOT / SENSOR MONITORING API
// ==========================================

export async function fetchSensorDashboard(): Promise<SensorDashboardData> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return mockSensorData;
  }
  const response = await fetch(`${API_BASE_URL}/sensor-feed?n=6`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Failed to fetch sensor telemetry");
  const data = await response.json();
  const latest = data.latest;

  // Map simulated sensor feed to frontend SensorDashboardData shape
  return {
    isSimulationMode: true,
    sensors: [
      { id: "sen-1", name: "Root Zone Moisture", type: "moisture", currentValue: latest.soil_moisture, unit: "%", status: latest.needs_irrigation ? "warning" : "online", batteryPercent: 92, lastUpdated: "Just now" },
      { id: "sen-2", name: "Ambient Temperature", type: "temperature", currentValue: latest.temperature, unit: "°C", status: "online", batteryPercent: 88, lastUpdated: "Just now" },
      { id: "sen-3", name: "Relative Humidity", type: "humidity", currentValue: latest.humidity, unit: "%", status: "online", batteryPercent: 88, lastUpdated: "Just now" },
      { id: "sen-4", name: "Soil pH Probe", type: "ph", currentValue: latest.ph, unit: "pH", status: "online", batteryPercent: 79, lastUpdated: "Just now" },
    ],
    telemetryHistory: data.readings.map((r: { timestamp: string; soil_moisture: number; temperature: number; humidity: number; ph: number }) => ({
      timestamp: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      moisture: r.soil_moisture,
      temperature: r.temperature,
      humidity: r.humidity,
      ph: r.ph,
    })),
  };
}

// ==========================================
// 7. AGENTIC ADVISOR API
// ==========================================

export async function fetchAdvisoryBriefings(): Promise<{ briefings: AdvisoryBriefing[]; heroTitle: string; heroDescription: string }> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return {
      briefings: mockAdvisories,
      heroTitle: mockAdvisories[0]?.title ?? "Farm conditions are stable.",
      heroDescription: mockAdvisories[0]?.reason ?? "All monitored parameters are within normal ranges.",
    };
  }
  const response = await fetch(`${API_BASE_URL}/api/advisor/briefings?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`);
  if (!response.ok) throw new Error("Failed to fetch advisory briefings");
  const data = await response.json();
  return {
    briefings: data.briefings,
    heroTitle: data.hero_title,
    heroDescription: data.hero_description,
  };
}

// ==========================================
// 8. AI FARMER ASSISTANT API
// ==========================================

export async function sendAssistantMessage(message: string, attachedImage?: string, language: string = "en", history: ChatMessage[] = []): Promise<ChatMessage> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 1000));

    // Build context from last few messages for smarter mock replies
    const recentContext = history
      .slice(-6)
      .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const msgLower = message.toLowerCase();
    const contextLower = recentContext.toLowerCase();

    let reply = "Based on your farm's current data, your soil moisture is 38% and rainfall is expected within 36 hours. I recommend holding your scheduled evening irrigation to conserve water.";
    let followUps = [
      "Show me the 5-day precipitation probability",
      "What are the symptoms of Tomato Early Blight?",
      "How to prepare soil for Chickpea sowing?"
    ];

    if (msgLower.includes("blight") || msgLower.includes("disease") || contextLower.includes("blight")) {
      const isFollowUp = contextLower.includes("blight") && history.length > 2;
      reply = isFollowUp
        ? "As a follow-up to the blight treatment: ensure you re-inspect the field every 48 hours. If new lesions appear despite fungicide application, switch to a systemic fungicide like Metalaxyl-M. Also check neighboring plots — blight spreads via wind-borne spores."
        : "For Early Blight (Alternaria solani), prompt action is crucial:\n\n1. **Immediate Sanitation**: Remove infected lower leaves with concentric rings.\n2. **Therapy**: Spray Copper Oxychloride (2.5g/L) or biological Trichoderma viride.\n3. **Watering**: Switch strictly from overhead sprinklers to drip lines.\n\nWould you like me to inspect an uploaded leaf image?";
      followUps = ["Recommend organic fungicide brands", "Check weather risk for fungal spread", "How often should I re-apply fungicide?"];
    } else if (msgLower.includes("crop") || msgLower.includes("soil") || msgLower.includes("sow")) {
      reply = "With your soil pH at 6.8 and balanced NPK reserves, **Chickpea (Gram)** or **Mustard** present the highest suitability index (94% and 88% respectively) for the upcoming rabi cycle.";
      followUps = ["Compare Chickpea vs Wheat returns", "What fertilizer dose is required for Chickpea?"];
    } else if (msgLower.includes("irrigat") || msgLower.includes("water") || msgLower.includes("moisture")) {
      reply = "Current soil moisture is at **38%**, which is below the vegetative-stage target of 45%. However, with 65% rain probability in the next 24 hours, I recommend **holding irrigation** until tomorrow morning. Re-evaluate after the rain event.";
      followUps = ["What if it doesn't rain tomorrow?", "How much water does my crop need per cycle?"];
    } else if (msgLower.includes("fertilizer") || msgLower.includes("npk") || msgLower.includes("nutrient")) {
      reply = "For your current crop stage, apply **NPK 19:19:19** at 2.5g/L as a foliar spray. Your soil nitrogen (N:65) is moderate — a top-dress of Urea (46% N) at 25 kg/ha is recommended before the next irrigation cycle.";
      followUps = ["When is the best time to apply urea?", "Can I mix fertilizer with fungicide spray?"];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: followUps,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        language: language,
        history: history
          .filter((m) => m.sender !== "assistant" || !m.suggestedFollowUps) // exclude greeting meta
          .slice(-20) // last 20 messages = 10 turns
          .map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.content })),
      }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    const isAbort = err instanceof Error && err.name === "AbortError";
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      content: isAbort
        ? "The server is waking up from sleep (Render free tier). Please try again in 30 seconds."
        : "Unable to reach the assistant service. Please check your connection.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
  clearTimeout(timeout);

  if (!response.ok) throw new Error("Assistant service failure");
  const data = await response.json();

  // Generate context-aware follow-ups based on reply content
  const reply: string = data.reply;
  let followUps: string[] | undefined;
  const lower = reply.toLowerCase();
  if (lower.includes("blight") || lower.includes("disease") || lower.includes("fungal")) {
    followUps = ["What fungicide should I use?", "How do I prevent spread to other plants?"];
  } else if (lower.includes("irrigat") || lower.includes("moisture") || lower.includes("water")) {
    followUps = ["What is the optimal irrigation schedule?", "How much water does my crop need?"];
  } else if (lower.includes("crop") || lower.includes("soil") || lower.includes("fertilizer")) {
    followUps = ["What NPK ratio is best for my soil?", "When should I sow the next crop?"];
  }

  return {
    id: `msg-${Date.now()}`,
    sender: "assistant",
    content: reply,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    suggestedFollowUps: followUps,
  };
}
