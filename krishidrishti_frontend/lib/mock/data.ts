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

// ==========================================
// MOCK DIAGNOSIS DATA
// ==========================================

export const sampleLeaves = [
  {
    id: "sample-1",
    label: "Tomato Early Blight",
    crop: "Tomato",
    condition: "Early Blight (Alternaria solani)",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80",
    prediction: {
      id: "diag-101",
      crop: "Tomato",
      disease: "Tomato Early Blight",
      condition: "Early Blight",
      status: "Disease Detected",
      confidence_pct: "94.20%",
      healthy: false,
      confidence: 0.942,
      severity: "moderate",
      explanation: "Concentric rings ('target board' pattern) detected on lower foliage with chlorotic yellow halo margins typical of Alternaria solani fungal pathology.",
      heatmapUrl: null, // Visual explainability placeholder
      classProbabilities: [
        { className: "Tomato Early Blight", probability: 0.942 },
        { className: "Tomato Septoria Leaf Spot", probability: 0.038 },
        { className: "Tomato Late Blight", probability: 0.015 },
        { className: "Tomato Healthy", probability: 0.005 },
      ],
      recommendations: {
        immediateActions: [
          "Prune and safely destroy lower leaves exhibiting concentric spots to prevent spore splash.",
          "Cease overhead sprinkler irrigation; convert to drip or ground-level watering.",
          "Sanitize pruning shears with 70% isopropyl alcohol between plants."
        ],
        treatmentPlan: [
          "Apply copper-based fungicide or Mancozeb 75% WP at 2.5g/L early morning.",
          "Alternative organic bio-control: Foliar spray of Bacillus subtilis or Trichoderma viride every 7 days.",
          "Ensure complete coverage of undersides of leaves."
        ],
        prevention: [
          "Practice a 3-year crop rotation avoiding Solanaceae family (potatoes, eggplants, peppers).",
          "Maintain at least 60 cm spacing between rows for adequate canopy aeration.",
          "Apply organic straw mulch around plant base to inhibit soil-borne spores."
        ],
        monitoringAdvice: [
          "Inspect secondary branches every 48 hours, especially following rainfall or high humidity events.",
          "Monitor upper canopy for any upward disease progression."
        ]
      }
    } as PredictionResponse
  },
  {
    id: "sample-2",
    label: "Potato Late Blight",
    crop: "Potato",
    condition: "Late Blight (Phytophthora infestans)",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    prediction: {
      id: "diag-102",
      crop: "Potato",
      disease: "Potato Late Blight",
      condition: "Late Blight",
      status: "Disease Detected",
      confidence_pct: "91.50%",
      healthy: false,
      confidence: 0.915,
      severity: "critical",
      explanation: "Water-soaked lesions with pale green borders that rapidly turn dark brown to purplish-black. White fungal fuzz visible along lesion margins under high humidity.",
      heatmapUrl: null,
      classProbabilities: [
        { className: "Potato Late Blight", probability: 0.915 },
        { className: "Potato Early Blight", probability: 0.062 },
        { className: "Potato Healthy", probability: 0.023 },
      ],
      recommendations: {
        immediateActions: [
          "Immediate emergency quarantine: remove and seal infected foliage in plastic bags; do not compost.",
          "Avoid entering wet fields to minimize mechanical pathogen transmission."
        ],
        treatmentPlan: [
          "Apply systemic translaminar fungicide such as Metalaxyl-M + Mancozeb (Ridomil Gold) at recommended dosage.",
          "Repeat at 7 to 10-day intervals if weather remains overcast and cool."
        ],
        prevention: [
          "Plant certified disease-free seed tubers.",
          "Hill soil properly over developing tubers to prevent spores washing down from foliage."
        ],
        monitoringAdvice: [
          "Check field daily during overcast, humid periods with nighttime temperatures between 10-15°C."
        ]
      }
    } as PredictionResponse
  },
  {
    id: "sample-3",
    label: "Healthy Bell Pepper",
    crop: "Bell Pepper",
    condition: "Healthy Foliage",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
    prediction: {
      id: "diag-103",
      crop: "Bell Pepper",
      disease: "Healthy Foliage",
      condition: "Healthy Foliage",
      status: "Healthy",
      confidence_pct: "98.50%",
      healthy: true,
      confidence: 0.985,
      severity: "healthy",
      explanation: "Uniform chlorophyll distribution, intact leaf margins, no fungal sporulation, chlorosis, or necrotic tissue detected.",
      heatmapUrl: null,
      classProbabilities: [
        { className: "Bell Pepper Healthy", probability: 0.985 },
        { className: "Bacterial Spot", probability: 0.011 },
        { className: "Cercospora Leaf Spot", probability: 0.004 },
      ],
      recommendations: {
        immediateActions: [
          "No therapeutic action required. Foliar integrity is optimal."
        ],
        treatmentPlan: [
          "Continue balanced fertigation (NPK 19:19:19) at vegetative dosage.",
          "Maintain regular neem oil preventive spray (0.5%) every 14 days."
        ],
        prevention: [
          "Ensure consistent root-zone moisture to prevent blossom end rot in upcoming flowering stage.",
          "Inspect underside of leaves for early thrips or aphid presence."
        ],
        monitoringAdvice: [
          "Standard weekly field scouting."
        ]
      }
    } as PredictionResponse
  }
];

export const mockDiagnosisHistory: DiagnosisHistoryItem[] = [
  {
    id: "diag-101",
    date: "2026-09-12T10:30:00Z",
    crop: "Tomato",
    diagnosis: "Tomato Early Blight",
    confidence: 0.942,
    severity: "moderate",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "diag-102",
    date: "2026-09-10T14:15:00Z",
    crop: "Potato",
    diagnosis: "Potato Late Blight",
    confidence: 0.915,
    severity: "critical",
    status: "treated",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "diag-103",
    date: "2026-09-08T09:00:00Z",
    crop: "Bell Pepper",
    diagnosis: "Healthy Foliage",
    confidence: 0.985,
    severity: "healthy",
    status: "monitoring",
    imageUrl: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "diag-104",
    date: "2026-09-04T16:45:00Z",
    crop: "Wheat",
    diagnosis: "Wheat Yellow Rust (Puccinia striiformis)",
    confidence: 0.892,
    severity: "moderate",
    status: "treated",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "diag-105",
    date: "2026-09-01T11:20:00Z",
    crop: "Apple",
    diagnosis: "Apple Scab (Venturia inaequalis)",
    confidence: 0.931,
    severity: "low",
    status: "monitoring",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80"
  }
];

// ==========================================
// MOCK CROP RECOMMENDATIONS
// ==========================================

export function calculateMockCropRecommendations(input: CropRecommendationInput): CropRecommendationResult[] {
  return [
    {
      id: "rec-1",
      cropName: "Chickpea (Gram / Chana)",
      suitabilityScore: 94,
      expectedYield: "2.2 - 2.8 Tonnes / Hectare",
      waterRequirement: "Low",
      growthDurationDays: 105,
      sustainabilityRating: 95,
      reason: `Highly aligned with current soil NPK (${input.nitrogen}:${input.phosphorus}:${input.potassium}) and pH ${input.ph}. Nitrogen-fixing nodules will actively enrich soil vitality for subsequent crop cycles.`,
      advantages: [
        "Biological Nitrogen Fixation restores soil nitrogen bank",
        "Deep taproot utilizes residual subsoil moisture efficiently",
        "High market price stability and MSP procurement support"
      ],
      risks: [
        "Excess moisture at flowering may trigger Ascochyta blight"
      ]
    },
    {
      id: "rec-2",
      cropName: "Mustard (Brassica juncea)",
      suitabilityScore: 88,
      expectedYield: "1.8 - 2.4 Tonnes / Hectare",
      waterRequirement: "Low",
      growthDurationDays: 115,
      sustainabilityRating: 86,
      reason: `Optimal for current thermal band (${input.temperature}°C) and soil pH ${input.ph}. Requires only 2-3 light irrigations during growth phase.`,
      advantages: [
        "Low input cost and minimal synthetic fertilizer need",
        "Natural bio-fumigant effect against soil pathogens"
      ],
      risks: [
        "Vulnerable to aphid attacks if temperatures spike early February"
      ]
    },
    {
      id: "rec-3",
      cropName: "Wheat (HD-2967 / PBW-502)",
      suitabilityScore: 81,
      expectedYield: "4.5 - 5.2 Tonnes / Hectare",
      waterRequirement: "Medium",
      growthDurationDays: 135,
      sustainabilityRating: 78,
      reason: "Solid staple yield potential given current potassium levels, though requires structured irrigation at Crown Root Initiation stage.",
      advantages: [
        "Reliable baseline economic returns",
        "Readily available mechanized harvesting support"
      ],
      risks: [
        "Sensitive to terminal heat stress during grain filling stage"
      ]
    }
  ];
}

// ==========================================
// MOCK IRRIGATION DATA
// ==========================================

export const mockIrrigationStatus: IrrigationStatus = {
  currentMoisture: 38,
  targetMoistureMin: 45,
  targetMoistureMax: 65,
  waterRequirementLiters: 1420,
  nextIrrigationTime: "Today at 06:30 PM (Evening Window)",
  status: "needs_water",
  lastWatered: "2 days ago (Sep 11, 07:00 AM)",
  isSimulated: true,
  history: [
    { time: "00:00", moisture: 46, threshold: 45 },
    { time: "04:00", moisture: 44, threshold: 45 },
    { time: "08:00", moisture: 42, threshold: 45 },
    { time: "12:00", moisture: 39, threshold: 45 },
    { time: "16:00", moisture: 38, threshold: 45 },
    { time: "20:00", moisture: 37, threshold: 45 },
  ]
};

// ==========================================
// MOCK AGRO-WEATHER DATA
// ==========================================

export const mockWeatherData: AgroWeatherData = {
  location: "Karnal Agri-Zone, Haryana",
  temperature: 28,
  humidity: 78,
  rainfallMm: 2.4,
  windSpeedKmh: 11,
  uvIndex: 6,
  diseaseRiskScore: 72,
  diseaseRiskCategory: "High",
  isSimulated: true,
  agriculturalAlerts: [
    {
      type: "warning",
      message: "Elevated humidity (78%) and warm nights accelerate fungal spore germination.",
      action: "Scout tomato and potato plots for Early/Late Blight lesions."
    },
    {
      type: "advisory",
      message: "Light convective showers predicted within 36 hours (60% probability).",
      action: "Defer scheduled field irrigation to conserve water and prevent waterlogging."
    }
  ],
  forecast: [
    { day: "Today", tempMax: 30, tempMin: 21, humidity: 78, rainChance: 35, condition: "Partly Cloudy" },
    { day: "Tomorrow", tempMax: 29, tempMin: 20, humidity: 82, rainChance: 65, condition: "Scattered Rain" },
    { day: "Tue", tempMax: 28, tempMin: 19, humidity: 75, rainChance: 40, condition: "Overcast" },
    { day: "Wed", tempMax: 31, tempMin: 22, humidity: 62, rainChance: 15, condition: "Sunny / Clear" },
    { day: "Thu", tempMax: 32, tempMin: 22, humidity: 58, rainChance: 10, condition: "Clear Sky" }
  ]
};

// ==========================================
// MOCK SUSTAINABILITY REPORT
// ==========================================

export const mockSustainabilityReport: SustainabilityReport = {
  overallScore: 84,
  grade: "A",
  carbonOffsetEstimateKg: 1420,
  waterSavedLiters: 48500,
  pillars: {
    waterEfficiency: {
      title: "Water Conservation & Precision",
      score: 88,
      weight: 25,
      benchmark: 70,
      status: "excellent",
      recommendations: [
        "Drip scheduling saved an estimated 48,500 Liters vs conventional flood methods.",
        "Maintain sub-surface moisture sensor calibration before next fertigation cycle."
      ]
    },
    soilHealth: {
      title: "Soil Vitality & Organic Carbon",
      score: 82,
      weight: 25,
      benchmark: 65,
      status: "good",
      recommendations: [
        "Topsoil organic matter measured at 0.72% (up from 0.61% last season).",
        "Consider intercropping legumes to fix biological nitrogen naturally."
      ]
    },
    cropDiversity: {
      title: "Crop Diversity & Rotation",
      score: 79,
      weight: 20,
      benchmark: 60,
      status: "good",
      recommendations: [
        "Current rotation includes 2 distinct botanical families.",
        "Add cover crop (e.g. Dhaincha / Sunn hemp) during fallow summer window."
      ]
    },
    chemicalUsage: {
      title: "Chemical & Pesticide Rationalization",
      score: 86,
      weight: 15,
      benchmark: 55,
      status: "excellent",
      recommendations: [
        "Targeted micro-spraying reduced synthetic fungicide by 34%.",
        "Continue utilizing bio-pesticides (Neem, Trichoderma) for initial pest thresholds."
      ]
    },
    resourceEfficiency: {
      title: "Energy & Resource Efficiency",
      score: 85,
      weight: 15,
      benchmark: 60,
      status: "excellent",
      recommendations: [
        "Solar pump utilization accounts for 74% of total irrigation kilowatt-hours."
      ]
    }
  }
};

// ==========================================
// MOCK IOT SENSOR DATA
// ==========================================

export const mockSensorData: SensorDashboardData = {
  isSimulationMode: true,
  sensors: [
    { id: "sen-1", name: "Plot A - Root Zone Moisture", type: "moisture", currentValue: 38, unit: "%", status: "warning", batteryPercent: 92, lastUpdated: "2 mins ago" },
    { id: "sen-2", name: "Plot A - Ambient Canopy Temp", type: "temperature", currentValue: 28.4, unit: "°C", status: "online", batteryPercent: 88, lastUpdated: "Just now" },
    { id: "sen-3", name: "Plot A - Relative Air Humidity", type: "humidity", currentValue: 78, unit: "%", status: "online", batteryPercent: 88, lastUpdated: "Just now" },
    { id: "sen-4", name: "Soil Horizon pH Probe", type: "ph", currentValue: 6.8, unit: "pH", status: "online", batteryPercent: 79, lastUpdated: "10 mins ago" },
    { id: "sen-5", name: "Photosynthetic Solar Radiation", type: "light", currentValue: 740, unit: "W/m²", status: "online", batteryPercent: 95, lastUpdated: "5 mins ago" },
    { id: "sen-6", name: "Farm Water Reservoir Level", type: "tank", currentValue: 64, unit: "%", status: "online", batteryPercent: 81, lastUpdated: "1 min ago" }
  ],
  telemetryHistory: [
    { timestamp: "06:00", moisture: 48, temperature: 22.1, humidity: 88, ph: 6.8 },
    { timestamp: "08:00", moisture: 46, temperature: 24.5, humidity: 84, ph: 6.8 },
    { timestamp: "10:00", moisture: 44, temperature: 27.2, humidity: 79, ph: 6.8 },
    { timestamp: "12:00", moisture: 41, temperature: 29.8, humidity: 72, ph: 6.9 },
    { timestamp: "14:00", moisture: 39, temperature: 30.4, humidity: 70, ph: 6.8 },
    { timestamp: "16:00", moisture: 38, temperature: 28.4, humidity: 78, ph: 6.8 },
  ]
};

// ==========================================
// MOCK AGENTIC ADVISOR BRIEFING
// ==========================================

export const mockAdvisories: AdvisoryBriefing[] = [
  {
    id: "adv-1",
    priority: "critical",
    title: "High Fungal Risk: Micro-climate Favors Early Blight",
    reason: "Relative humidity sustained >75% combined with nocturnal temperatures of 21°C. Plot A tomato canopy was recently diagnosed with Early Blight.",
    dataSources: ["Crop Diagnosis", "Plot A Humidity Sensor", "Agro-Weather Forecast"],
    recommendedAction: "Execute preventive bio-fungicidal spray (Bacillus subtilis or Copper Oxychloride at 2.5g/L) before tomorrow morning's forecasted drizzle.",
    estimatedImpact: "Prevents secondary infection spread across adjacent 1.5 hectares.",
    status: "pending"
  },
  {
    id: "adv-2",
    priority: "high",
    title: "Postpone Primary Irrigation: Showers Imminent",
    reason: "Soil moisture is at 38% (below target 45%), but radar indicates 65% probability of 12-18mm precipitation within 24 hours.",
    dataSources: ["Soil Moisture Sensor", "Precipitation Radar", "Smart Irrigation Engine"],
    recommendedAction: "Hold scheduled evening irrigation of 1,420L. Re-evaluate soil matric potential tomorrow at 08:00 AM post-rain.",
    estimatedImpact: "Saves 1,420 Liters of water and avoids root hypoxia/leaching.",
    status: "pending"
  },
  {
    id: "adv-3",
    priority: "medium",
    title: "Favorable Window for Rabi Crop Sowing Preparation",
    reason: "Soil pH 6.8 and moisture levels will be ideal post-precipitation for sowing high-suitability chickpea or mustard.",
    dataSources: ["Soil Chemistry Profile", "Crop Recommendation Engine"],
    recommendedAction: "Procure certified rhizobium-inoculated chickpea seeds (Pusa 362) to maximize biological nitrogen fixation.",
    estimatedImpact: "Potential yield uplift of 18% over un-inoculated varieties.",
    status: "acknowledged"
  },
  {
    id: "adv-4",
    priority: "low",
    title: "Solar Pump Battery Inverter Maintenance",
    reason: "Telemetry indicates 64% reservoir volume with sunny conditions expected Wednesday.",
    dataSources: ["IoT Reservoir Sensor", "Energy Monitor"],
    recommendedAction: "Wipe dust off solar PV panels during cool morning hours to maintain 95% charging efficiency.",
    estimatedImpact: "Ensures full reservoir recharge ahead of dry spell.",
    status: "acknowledged"
  }
];

// ==========================================
// MOCK CHAT MESSAGES
// ==========================================

export const mockInitialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "assistant",
    content: "Namaste! I am your **KrishiDrishti AI Farmer Assistant**. I am connected to your farm's crop diagnosis history, IoT sensors, soil metrics, and local weather station.\n\nHow can I assist your farming operations today?",
    timestamp: "10:00 AM",
    suggestedFollowUps: [
      "What disease does my tomato crop have and how to treat it?",
      "Should I irrigate today considering the rain forecast?",
      "Which crop is most profitable and sustainable for my soil?",
      "How do I prevent blight spread in humid weather?"
    ]
  }
];
