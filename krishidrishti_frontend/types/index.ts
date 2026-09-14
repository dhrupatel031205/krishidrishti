// ==========================================
// CROP DISEASE DIAGNOSIS CONTRACTS
// ==========================================

export type SeverityLevel = "low" | "moderate" | "critical" | "healthy";

export interface ClassProbability {
  className: string;
  probability: number;
}

export interface DiseaseRecommendationSection {
  immediateActions: string[];
  treatmentPlan: string[];
  prevention: string[];
  monitoringAdvice: string[];
}

export interface PredictionResponse {
  id?: string;
  crop: string;
  disease: string;
  condition?: string;
  status?: string;
  confidence: number;
  confidence_pct?: string;
  healthy: boolean;
  severity?: SeverityLevel;
  recommendations?: DiseaseRecommendationSection;
  classProbabilities?: ClassProbability[];
  explanation?: string;
  heatmapUrl?: string | null;
  analyzedAt?: string;
  imageUrl?: string;
}

export interface DiagnosisHistoryItem {
  id: string;
  date: string;
  crop: string;
  diagnosis: string;
  confidence: number;
  severity: SeverityLevel;
  status: "active" | "treated" | "monitoring";
  imageUrl: string;
}

// ==========================================
// CROP RECOMMENDATION CONTRACTS
// ==========================================

export interface CropRecommendationInput {
  soilType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  location: string;
}

export interface CropRecommendationResult {
  id: string;
  cropName: string;
  suitabilityScore: number;
  expectedYield: string;
  waterRequirement: "Low" | "Medium" | "High";
  growthDurationDays: number;
  sustainabilityRating: number;
  reason: string;
  advantages: string[];
  risks: string[];
}

// ==========================================
// SMART IRRIGATION CONTRACTS
// ==========================================

export interface IrrigationStatus {
  currentMoisture: number; // percentage (0-100)
  targetMoistureMin: number;
  targetMoistureMax: number;
  waterRequirementLiters: number;
  nextIrrigationTime: string;
  status: "optimal" | "needs_water" | "saturated" | "scheduled";
  lastWatered: string;
  isSimulated: boolean;
  rainForecastMm?: number;
  irrigationReason?: string;
  history: {
    time: string;
    moisture: number;
    threshold: number;
  }[];
}

// ==========================================
// WEATHER INTELLIGENCE CONTRACTS
// ==========================================

export interface AgroWeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfallMm: number;
  windSpeedKmh: number;
  uvIndex: number;
  diseaseRiskScore: number; // 0-100
  diseaseRiskCategory: "Low" | "Moderate" | "High";
  agriculturalAlerts: {
    type: "warning" | "advisory" | "opportunity";
    message: string;
    action: string;
  }[];
  forecast: {
    day: string;
    tempMax: number;
    tempMin: number;
    humidity: number;
    rainChance: number;
    condition: string;
  }[];
  isSimulated: boolean;
}

// ==========================================
// SUSTAINABILITY SCORE CONTRACTS
// ==========================================

export interface SustainabilityPillar {
  title: string;
  score: number;
  weight: number;
  benchmark: number;
  status: "excellent" | "good" | "needs_attention";
  recommendations: string[];
}

export interface SustainabilityReport {
  overallScore: number;
  grade: "A" | "B" | "C" | "D";
  carbonOffsetEstimateKg: number;
  waterSavedLiters: number;
  pillars: {
    waterEfficiency: SustainabilityPillar;
    soilHealth: SustainabilityPillar;
    cropDiversity: SustainabilityPillar;
    chemicalUsage: SustainabilityPillar;
    resourceEfficiency: SustainabilityPillar;
  };
}

// ==========================================
// IOT & SENSOR MONITORING CONTRACTS
// ==========================================

export interface SensorTelemetry {
  id: string;
  name: string;
  type: "moisture" | "temperature" | "humidity" | "ph" | "light" | "tank";
  currentValue: number;
  unit: string;
  status: "online" | "warning" | "offline";
  batteryPercent: number;
  lastUpdated: string;
}

export interface SensorDashboardData {
  isSimulationMode: boolean;
  sensors: SensorTelemetry[];
  telemetryHistory: {
    timestamp: string;
    moisture: number;
    temperature: number;
    humidity: number;
    ph: number;
  }[];
}

// ==========================================
// AGENTIC ADVISOR CONTRACTS
// ==========================================

export interface AdvisoryBriefing {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  reason: string;
  dataSources: string[];
  recommendedAction: string;
  estimatedImpact: string;
  status: "pending" | "acknowledged" | "completed";
}

// ==========================================
// AI FARMER ASSISTANT CONTRACTS
// ==========================================

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  attachedImage?: string;
  suggestedFollowUps?: string[];
}
