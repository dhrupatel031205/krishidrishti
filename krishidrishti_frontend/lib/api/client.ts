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
  mockInitialChatMessages,
} from "@/lib/mock/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const IS_SIMULATION_FORCED = !API_BASE_URL;
const IS_DIAGNOSIS_LIVE = !!API_BASE_URL;
const DEFAULT_LAT = process.env.NEXT_PUBLIC_DEFAULT_LAT || "29.6857";
const DEFAULT_LON = process.env.NEXT_PUBLIC_DEFAULT_LON || "76.9905";

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

  const response = await fetch(`${API_BASE_URL}/api/predict`, { method: "POST", body: formData });
  if (!response.ok) throw new Error(`Inference engine failed with status ${response.status}`);
  return response.json();
}

export async function fetchDiagnosisHistory(): Promise<DiagnosisHistoryItem[]> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 300));
    return mockDiagnosisHistory;
  }
  const response = await fetch(`${API_BASE_URL}/api/diagnosis/history`);
  if (!response.ok) throw new Error("Failed to fetch diagnosis history");
  return response.json();
}


// ==========================================
// 2. CROP RECOMMENDATIONS API
// ==========================================

export async function getCropRecommendations(input: CropRecommendationInput): Promise<CropRecommendationResult[]> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 800));
    return calculateMockCropRecommendations(input);
  }

  // Map frontend input to bonus backend SoilInput schema
  const payload = {
    N: input.nitrogen,
    P: input.phosphorus,
    K: input.potassium,
    temperature: input.temperature,
    humidity: input.humidity,
    ph: input.ph,
    rainfall: input.rainfall,
  };

  const response = await fetch(`${API_BASE_URL}/recommend-crop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Crop recommendation engine error");
  const data = await response.json();

  // Map bonus backend response to frontend CropRecommendationResult[]
  return [
    {
      id: "rec-live-1",
      cropName: data.recommended_crop,
      suitabilityScore: Math.round((data.confidence ?? 0.9) * 100),
      expectedYield: "Varies by region",
      waterRequirement: "Medium" as const,
      growthDurationDays: 120,
      sustainabilityRating: Math.round((data.confidence ?? 0.9) * 100),
      reason: `ML model recommends ${data.recommended_crop} with ${Math.round((data.confidence ?? 0.9) * 100)}% confidence based on your soil parameters.`,
      advantages: [`Best fit for N:${input.nitrogen} P:${input.phosphorus} K:${input.potassium} at pH ${input.ph}`],
      risks: [],
    },
  ];
}

// ==========================================
// 3. SMART IRRIGATION API
// ==========================================

export async function fetchIrrigationStatus(): Promise<IrrigationStatus> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return mockIrrigationStatus;
  }
  // Use sensor feed to get current soil moisture, then call irrigation endpoint
  const sensorRes = await fetch(`${API_BASE_URL}/sensor-feed?n=1`);
  if (!sensorRes.ok) throw new Error("Failed to fetch sensor data for irrigation");
  const sensorData = await sensorRes.json();
  const latest = sensorData.latest;

  const irrigRes = await fetch(`${API_BASE_URL}/irrigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      soil_moisture: latest.soil_moisture,
      growth_stage: "vegetative",
      rain_forecast_mm: 0,
      temperature: latest.temperature,
    }),
  });
  if (!irrigRes.ok) throw new Error("Failed to fetch irrigation status");
  const irrigData = await irrigRes.json();

  // Map to frontend IrrigationStatus shape
  return {
    currentMoisture: latest.soil_moisture,
    targetMoistureMin: 45,
    targetMoistureMax: 65,
    waterRequirementLiters: irrigData.irrigate ? 1200 : 0,
    nextIrrigationTime: irrigData.irrigate ? "As soon as possible" : "Not required",
    status: irrigData.irrigate ? "needs_water" : "optimal",
    lastWatered: latest.timestamp,
    isSimulated: false,
    history: sensorData.readings.map((r: { timestamp: string; soil_moisture: number }) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      moisture: r.soil_moisture,
      threshold: 45,
    })),
  };
}

// ==========================================
// 4. WEATHER INTELLIGENCE API
// ==========================================

export async function fetchAgroWeather(): Promise<AgroWeatherData> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return mockWeatherData;
  }
  const response = await fetch(`${API_BASE_URL}/weather?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`);
  if (!response.ok) throw new Error("Failed to fetch agro-weather");
  const data = await response.json();

  // Map Open-Meteo response to frontend AgroWeatherData shape
  const riskScore = Math.min(100, Math.round(
    (data.humidity > 75 ? 40 : 10) +
    (data.rain_next_24h_mm > 5 ? 20 : 0) +
    (data.temperature > 20 && data.temperature < 32 ? 20 : 0)
  ));

  return {
    location: `Lat ${DEFAULT_LAT}, Lon ${DEFAULT_LON}`,
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
    forecast: [],
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
  const sensorRes = await fetch(`${API_BASE_URL}/sensor-feed?n=1`);
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
  const response = await fetch(`${API_BASE_URL}/sensor-feed?n=6`);
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

export async function fetchAdvisoryBriefings(): Promise<AdvisoryBriefing[]> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 400));
    return mockAdvisories;
  }
  const response = await fetch(`${API_BASE_URL}/api/advisor/briefing`);
  if (!response.ok) throw new Error("Failed to fetch farm briefings");
  return response.json();
}

// ==========================================
// 8. AI FARMER ASSISTANT API
// ==========================================

export async function sendAssistantMessage(message: string, attachedImage?: string): Promise<ChatMessage> {
  if (IS_SIMULATION_FORCED) {
    await new Promise((r) => setTimeout(r, 1000));
    
    // Context-sensitive mock responses
    let reply = "Based on your farm's current data, your soil moisture is 38% and rainfall is expected within 36 hours. I recommend holding your scheduled evening irrigation to conserve water.";
    let followUps = [
      "Show me the 5-day precipitation probability",
      "What are the symptoms of Tomato Early Blight?",
      "How to prepare soil for Chickpea sowing?"
    ];

    if (message.toLowerCase().includes("blight") || message.toLowerCase().includes("disease")) {
      reply = "For Early Blight (Alternaria solani), prompt action is crucial:\n\n1. **Immediate Sanitation**: Remove infected lower leaves with concentric rings.\n2. **Therapy**: Spray Copper Oxychloride (2.5g/L) or biological Trichoderma viride.\n3. **Watering**: Switch strictly from overhead sprinklers to drip lines.\n\nWould you like me to inspect an uploaded leaf image?";
      followUps = ["Recommend organic fungicide brands", "Check weather risk for fungal spread"];
    } else if (message.toLowerCase().includes("crop") || message.toLowerCase().includes("soil")) {
      reply = "With your soil pH at 6.8 and balanced NPK reserves, **Chickpea (Gram)** or **Mustard** present the highest suitability index (94% and 88% respectively) for the upcoming rabi cycle.";
      followUps = ["Compare Chickpea vs Wheat returns", "What fertilizer dose is required for Chickpea?"];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: followUps,
    };
  }

  const response = await fetch(`${API_BASE_URL}/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      irrigation_action: message,
      language: "en",
    }),
  });

  if (!response.ok) throw new Error("Assistant service failure");
  const data = await response.json();

  return {
    id: `msg-${Date.now()}`,
    sender: "assistant",
    content: data.reply,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}
