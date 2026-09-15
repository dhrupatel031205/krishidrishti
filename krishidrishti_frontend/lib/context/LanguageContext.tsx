"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "pa" | "te" | "gu";

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    cropDiagnosis: "Crop Diagnosis",
    cropRecommendation: "Crop Recommendation",
    smartIrrigation: "Smart Irrigation",
    weatherIntelligence: "Weather Intelligence",
    sustainabilityScore: "Sustainability Score",
    farmMonitoring: "Farm Monitoring (IoT)",
    aiAssistant: "AI Farmer Assistant",
    farmAdvisor: "Farm Advisor",
    settings: "Settings",

    // Badges & Common Header
    activeStation: "Active Station",
    quickDiagnosis: "Quick Diagnosis",
    stationName: "Northern Agri-Hub (Haryana)",
    plotInfo: "Plot A (Karnal Hub)",
    plotDetails: "4.2 Hectares • Drip Active",
    smartAgri: "Smart Agriculture",
    simulationMode: "Simulation Mode",
    coreAi: "Core AI",
    agentic: "Agentic",

    // Smart Irrigation Page
    irrigationTitle: "Smart Irrigation & Soil Hydration",
    irrigationDesc: "Sensor-driven root zone moisture telemetry, evapotranspiration modeling, and weather-synchronized watering schedules.",
    manualCycle: "Manual Cycle Override",
    haltSolenoid: "Halt Active Solenoid",
    rootZoneMoisture: "Root Zone Moisture",
    target: "Target",
    waterRequired: "Water Required",
    fieldCapacity: "To achieve field capacity",
    nextCycle: "Next Cycle",
    eveningDrip: "Evening drip irrigation slot",
    valveStatus: "Valve Status",
    valveRunning: "Running (Drip)",
    valveStandby: "Standby",
    soilMoistureGauge: "Soil Moisture Gauge",
    capacitiveDepth: "Capacitive probe telemetry at 20cm depth",
    volumetricContent: "Volumetric Water Content",
    underMoistureTitle: "Under Recommended Moisture",
    underMoistureDesc: "Soil moisture is 7% below lower comfort threshold. Irrigation is advised before nighttime transpiration.",
    moistureTrendTitle: "24-Hour Soil Moisture Trend",
    moistureTrendDesc: "Hourly probe readings vs permanent wilting point",
    moisturePercent: "Moisture %",
    targetMin: "Target Minimum (45%)",

    // Recommendations Page
    recTitle: "Intelligent Crop Recommendation",
    recDesc: "Input soil chemistry parameters and microclimate conditions to receive AI-ranked crop varieties optimized for yield, water-efficiency, and soil rejuvenation.",
    soilParamsTitle: "Soil & Climate Parameters",
    soilType: "Soil Type",
    loamySoil: "Loamy Soil (Balanced)",
    clayeyLoam: "Clayey Loam (High Moisture Retention)",
    sandyLoam: "Sandy Loam (Rapid Drainage)",
    blackCotton: "Black Cotton Soil (High Clay Content)",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    soilPh: "Soil pH",
    temp: "Temp (°C)",
    humidity: "Humidity (%)",
    rainfall: "Rainfall (mm)",
    calcBtn: "Calculate Recommended Crops",
    evaluatingBtn: "Evaluating Agronomic Match...",
    awaitingTitle: "Awaiting Soil & Microclimate Evaluation",
    awaitingDesc: "Adjust your farm's NPK values and climate estimates on the left and click \"Calculate Recommended Crops\" to view ranked suitability scores.",
    projectedYield: "Projected Yield",
    suitability: "Suitability",
    waterReq: "Water",
    growthCycle: "Cycle",
    days: "Days",
    sustainabilityRating: "Sustainability",

    // Diagnosis Page
    diagnosisTitle: "AI Crop Disease Detection",
    diagnosisDesc: "Upload leaf imagery for computer vision diagnostic analysis, severity grading, and actionable agronomic protocols.",
    diagnosisHistory: "Diagnosis History",
    scanLeafBtn: "Scan Crop Leaf",

    // Dashboard Page
    dashboardTitle: "Karnal Precision Agro-Hub",
    dashboardDesc: "Operational synthesis across crop pathology, root zone hydrology, microclimate indices, and agentic briefings.",
    overallCropHealth: "Overall Crop Health",
    foliageIntegrity: "Plot A foliage integrity",
    activeDiseaseAlerts: "Active Disease Alerts",

    // Settings Page
    settingsTitle: "Farm Preferences & Configuration",
    settingsDesc: "Manage land geometry, localized agro-climatic region, unit standards, and multilingual delivery.",
    farmerProfile: "Farmer & Plot Profile",
    farmerName: "Farmer Name",
    contactPhone: "Contact Phone",
    farmHolding: "Farm / Holding Name",
    locationCoords: "Location Coordinates",
    multilingual: "Multilingual & Unit Localization",
    appLanguage: "Application Language",
    areaUnits: "Area Units",
    realtimeAlerts: "Real-time Agro Alerts",
    diseaseAlerts: "Critical Crop Disease Alerts",
    diseaseAlertsDesc: "Instant alerts when neighboring plots or weather triggers fungal sporulation warnings.",
    weatherAlerts: "Precipitation & Frost Warnings",
    weatherAlertsDesc: "Advise postponement of scheduled irrigation or chemical foliar sprays.",
    saveSettings: "Save Farm Settings",
    savingSettings: "Saving Preferences...",
    savedSuccess: "Saved Successfully!",
    settingsPersisted: "Settings saved and persisted locally.",

    // Quick Actions / Prompts
    analyzeCrop: "Analyze Your Crop",
    explorePlatform: "Explore KrishiDrishti",
  },
  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    cropDiagnosis: "फसल रोग निदान",
    cropRecommendation: "फसल सिफारिश",
    smartIrrigation: "स्मार्ट सिंचाई",
    weatherIntelligence: "मौसम पूर्वानुमान",
    sustainabilityScore: "सतत कृषि स्कोर",
    farmMonitoring: "खेत निगरानी (IoT)",
    aiAssistant: "एआई किसान सहायक",
    farmAdvisor: "कृषि सलाहकार",
    settings: "सेटिंग्स",

    // Badges & Common Header
    activeStation: "सक्रिय केंद्र",
    quickDiagnosis: "त्वरित जांच",
    stationName: "उत्तरी कृषि केंद्र (हरियाणा)",
    plotInfo: "खेत A (करनाल हब)",
    plotDetails: "4.2 हेक्टेयर • ड्रिप सिंचाई सक्रिय",
    smartAgri: "स्मार्ट कृषि",
    simulationMode: "सिमुलेशन मोड",
    coreAi: "मुख्य एआई",
    agentic: "स्वायत्त एजेंट",

    // Smart Irrigation Page
    irrigationTitle: "स्मार्ट सिंचाई एवं मृदा जल प्रबंधन",
    irrigationDesc: "सेंसर-आधारित जड़ क्षेत्र नमी टेलीमेट्री, वाष्पोत्सर्जन मॉडलिंग और मौसम-अनुकूलित सिंचाई कार्यक्रम।",
    manualCycle: "मैन्युअल सिंचाई चक्र चालू करें",
    haltSolenoid: "सक्रिय सोलेनोइड रोकें",
    rootZoneMoisture: "जड़ क्षेत्र में नमी",
    target: "लक्ष्य",
    waterRequired: "आवश्यक जल मात्रा",
    fieldCapacity: "खेत की क्षमता तक लाने हेतु",
    nextCycle: "अगला चक्र",
    eveningDrip: "शाम का ड्रिप सिंचाई समय",
    valveStatus: "वाल्व की स्थिति",
    valveRunning: "चालू (ड्रिप सिंचाई)",
    valveStandby: "स्टैंडबाय (प्रतीक्षारत)",
    soilMoistureGauge: "मृदा नमी मीटर (गेज)",
    capacitiveDepth: "20 सेमी गहराई पर कैपेसिटिव जांच टेलीमेट्री",
    volumetricContent: "आयतनिक जल मात्रा",
    underMoistureTitle: "अनुशंसित सीमा से कम नमी",
    underMoistureDesc: "मिट्टी की नमी अनुशंसित न्यूनतम स्तर से 7% कम है। रात के वाष्पोत्सर्जन से पूर्व सिंचाई की सलाह दी जाती है।",
    moistureTrendTitle: "24 घंटे का मृदा नमी रुझान",
    moistureTrendDesc: "प्रति घंटा सेंसर रीडिंग बनाम न्यूनतम मुरझाने का बिंदु",
    moisturePercent: "नमी %",
    targetMin: "न्यूनतम लक्ष्य (45%)",

    // Recommendations Page
    recTitle: "बुद्धिमान फसल सिफारिश प्रणाली",
    recDesc: "मिट्टी के पोषक तत्वों और सूक्ष्म-जलवायु स्थिति दर्ज करें और पैदावार, जल-बचत तथा मिट्टी सुधार के आधार पर एआई-अनुशंसित फसलें प्राप्त करें।",
    soilParamsTitle: "मिट्टी एवं जलवायु मापदंड",
    soilType: "मिट्टी का प्रकार",
    loamySoil: "दोमट मिट्टी (संतुलित)",
    clayeyLoam: "चिकनी दोमट (अधिक नमी रोकने वाली)",
    sandyLoam: "बलुई दोमट (तेज़ जल निकासी)",
    blackCotton: "काली कपास मिट्टी (उच्च चिकनी सामग्री)",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फास्फोरस (P)",
    potassium: "पोटेशियम (K)",
    soilPh: "मिट्टी का pH",
    temp: "तापमान (°C)",
    humidity: "नमी (%)",
    rainfall: "वर्षा (मिमी)",
    calcBtn: "अनुशंसित फसलों की गणना करें",
    evaluatingBtn: "कृषि डेटा का मिलान किया जा रहा है...",
    awaitingTitle: "मिट्टी एवं जलवायु मूल्यांकन की प्रतीक्षा है",
    awaitingDesc: "बाईं ओर अपनी मिट्टी के NPK मान और जलवायु अनुमान सेट करें और उपयुक्त फसलें देखने के लिए 'अनुशंसित फसलों की गणना करें' पर क्लिक करें।",
    projectedYield: "अनुमानित पैदावार",
    suitability: "उपयुक्तता",
    waterReq: "पानी की आवश्यकता",
    growthCycle: "अवधि",
    days: "दिन",
    sustainabilityRating: "स्थिरता रेटिंग",

    // Diagnosis Page
    diagnosisTitle: "एआई फसल रोग पहचान एवं निदान",
    diagnosisDesc: "पत्ती की तस्वीर अपलोड करें और कंप्यूटर विज़न द्वारा रोग की पहचान, गंभीरता और सटीक उपचार पाएँ।",
    diagnosisHistory: "निदान इतिहास",
    scanLeafBtn: "पत्ती स्कैन करें",

    // Dashboard Page
    dashboardTitle: "करनाल प्रिसिजन एग्रो-हब",
    dashboardDesc: "फसल रोग, जड़ नमी जल विज्ञान, मौसम सूचकांक और कृषि सलाह का समग्र विश्लेषण।",
    overallCropHealth: "समग्र फसल स्वास्थ्य",
    foliageIntegrity: "खेत A की पत्ती अखंडता",
    activeDiseaseAlerts: "सक्रिय रोग अलर्ट",

    // Settings Page
    settingsTitle: "फार्म प्राथमिकताएं एवं विन्यास",
    settingsDesc: "खेत का क्षेत्रफल, स्थानीय जलवायु क्षेत्र, मापक इकाइयां और बहुभाषी भाषा प्रबंधित करें।",
    farmerProfile: "किसान एवं खेत का विवरण",
    farmerName: "किसान का नाम",
    contactPhone: "संपर्क फोन नंबर",
    farmHolding: "खेत / जोत का नाम",
    locationCoords: "स्थान / निर्देशांक",
    multilingual: "बहुभाषी एवं क्षेत्रीय मानक",
    appLanguage: "एप्लिकेशन भाषा",
    areaUnits: "क्षेत्रफल की इकाई",
    realtimeAlerts: "रीयल-टाइम कृषि अलर्ट",
    diseaseAlerts: "गंभीर फसल रोग चेतावनी",
    diseaseAlertsDesc: "मौसम या पड़ोसी खेतों में संक्रमण का जोखिम बढ़ने पर तुरंत चेतावनी।",
    weatherAlerts: "वर्षा एवं पाला चेतावनी",
    weatherAlertsDesc: "अनुसूचित सिंचाई या कीटनाशक छिड़काव स्थगित करने की सलाह।",
    saveSettings: "फार्म सेटिंग्स सहेजें",
    savingSettings: "सेटिंग्स सहेजी जा रही हैं...",
    savedSuccess: "सफलतापूर्वक सहेजा गया!",
    settingsPersisted: "सेटिंग्स सुरक्षित रूप से सहेजी गईं।",

    // Quick Actions / Prompts
    analyzeCrop: "फसल की जांच करें",
    explorePlatform: "कृषि दृष्टि देखें",
  },
  pa: {
    // Navigation
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    cropDiagnosis: "ਫ਼ਸਲ ਰੋਗ ਨਿਦਾਨ",
    cropRecommendation: "ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
    smartIrrigation: "ਸਮਾਰਟ ਸਿੰਚਾਈ",
    weatherIntelligence: "ਮੌਸਮ ਜਾਣਕਾਰੀ",
    sustainabilityScore: "ਟਿਕਾਊ ਖੇਤੀ ਸਕੋਰ",
    farmMonitoring: "ਖੇਤ ਨਿਗਰਾਨੀ (IoT)",
    aiAssistant: "ਏਆਈ ਕਿਸਾਨ ਸਹਾਇਕ",
    farmAdvisor: "ਖੇਤੀ ਸਲਾਹਕਾਰ",
    settings: "ਸੈਟਿੰਗਾਂ",

    // Badges & Common Header
    activeStation: "ਸਰਗਰਮ ਸਟੇਸ਼ਨ",
    quickDiagnosis: "ਤੁਰੰਤ ਜਾਂਚ",
    stationName: "ਉੱਤਰੀ ਖੇਤੀ ਹੱਬ (ਹਰਿਆਣਾ)",
    plotInfo: "ਪਲਾਟ A (ਕਰਨਾਲ ਹੱਬ)",
    plotDetails: "4.2 ਹੈਕਟੇਅਰ • ਡ੍ਰਿੱਪ ਚਾਲੂ",
    smartAgri: "ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ",
    simulationMode: "ਸਿਮੂਲੇਸ਼ਨ ਮੋਡ",
    coreAi: "ਕੋਰ ਏਆਈ",
    agentic: "ਏਜੰਟਿਕ",

    // Smart Irrigation Page
    irrigationTitle: "ਸਮਾਰਟ ਸਿੰਚਾਈ ਅਤੇ ਮਿੱਟੀ ਨਮੀ",
    irrigationDesc: "ਸੈਂਸਰ-ਅਧਾਰਤ ਜੜ੍ਹਾਂ ਦੀ ਨਮੀ ਅਤੇ ਮੌਸਮ ਅਨੁਸਾਰ ਸਿੰਚਾਈ ਯੋਜਨਾ।",
    manualCycle: "ਮੈਨੂਅਲ ਸਿੰਚਾਈ ਚੱਕਰ ਚਲਾਓ",
    haltSolenoid: "ਸਿੰਚਾਈ ਰੋਕੋ",
    rootZoneMoisture: "ਜੜ੍ਹ ਖੇਤਰ ਨਮੀ",
    target: "ਟੀਚਾ",
    waterRequired: "ਲੋੜੀਂਦਾ ਪਾਣੀ",
    fieldCapacity: "ਖੇਤ ਦੀ ਸਮਰੱਥਾ ਲਈ",
    nextCycle: "ਅਗਲਾ ਗੇੜ",
    eveningDrip: "ਸ਼ਾਮ ਦੀ ਤੁਪਕਾ ਸਿੰਚਾਈ",
    valveStatus: "ਵਾਲਵ ਸਥਿਤੀ",
    valveRunning: "ਚਾਲੂ (ਤੁਪਕਾ)",
    valveStandby: "ਸਟੈਂਡਬਾਏ",
    soilMoistureGauge: "ਮਿੱਟੀ ਨਮੀ ਮੀਟਰ",
    capacitiveDepth: "20 ਸੈਂਟੀਮੀਟਰ ਡੂੰਘਾਈ ਤੇ ਸੈਂਸਰ",
    volumetricContent: "ਪਾਣੀ ਦੀ ਮਾਤਰਾ",
    underMoistureTitle: "ਲੋੜੀਂਦੀ ਨਮੀ ਤੋਂ ਘੱਟ",
    underMoistureDesc: "ਮਿੱਟੀ ਦੀ ਨਮੀ ਘੱਟ ਹੈ, ਸਿੰਚਾਈ ਕਰਨ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।",
    moistureTrendTitle: "24-ਘੰਟੇ ਦਾ ਨਮੀ ਰੁਝਾਨ",
    moistureTrendDesc: "ਪ੍ਰਤੀ ਘੰਟਾ ਰੀਡਿੰਗ",
    moisturePercent: "ਨਮੀ %",
    targetMin: "ਘੱਟੋ-ਘੱਟ ਟੀਚਾ (45%)",

    // Recommendations Page
    recTitle: "ਸੂਝਵਾਨ ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
    recDesc: "ਮਿੱਟੀ ਦੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਅਤੇ ਜਲਵਾਯੂ ਸਥਿਤੀਆਂ ਦੇ ਆਧਾਰ ਤੇ ਏਆਈ ਦੁਆਰਾ ਸਭ ਤੋਂ ਢੁਕਵੀਆਂ ਫ਼ਸਲਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
    soilParamsTitle: "ਮਿੱਟੀ ਅਤੇ ਜਲਵਾਯੂ ਮਾਪਦੰਡ",
    soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
    loamySoil: "ਦੋਮਟ ਮਿੱਟੀ (ਸੰਤੁਲਿਤ)",
    clayeyLoam: "ਚੀਕਣੀ ਦੋਮਟ ਮਿੱਟੀ",
    sandyLoam: "ਰੇਤਲੀ ਦੋਮਟ ਮਿੱਟੀ",
    blackCotton: "ਕਾਲੀ ਕਪਾਹ ਮਿੱਟੀ",
    nitrogen: "ਨਾਈਟ੍ਰੋਜਨ (N)",
    phosphorus: "ਫਾਸਫੋਰਸ (P)",
    potassium: "ਪੋਟਾਸ਼ੀਅਮ (K)",
    soilPh: "ਮਿੱਟੀ ਦਾ pH",
    temp: "ਤਾਪਮਾਨ (°C)",
    humidity: "ਨਮੀ (%)",
    rainfall: "ਮੀਂਹ (ਮਿਮੀ)",
    calcBtn: "ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫ਼ਸਲਾਂ ਜਾਣੋ",
    evaluatingBtn: "ਮੁਲਾਂਕਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    awaitingTitle: "ਮਿੱਟੀ ਦੇ ਮੁਲਾਂਕਣ ਦੀ ਉਡੀਕ ਹੈ",
    awaitingDesc: "ਖੱਬੇ ਪਾਸੇ ਆਪਣੇ ਖੇਤ ਦੇ ਮੁੱਲ ਚੁਣੋ ਅਤੇ ਨਤੀਜੇ ਦੇਖੋ।",
    projectedYield: "ਅਨੁਮਾਨਿਤ ਝਾੜ",
    suitability: "ਢੁਕਵਾਂਪਣ",
    waterReq: "ਪਾਣੀ ਦੀ ਲੋੜ",
    growthCycle: "ਸਮਾਂ",
    days: "ਦਿਨ",
    sustainabilityRating: "ਸਥਿਰਤਾ ਰੇਟਿੰਗ",

    // Diagnosis Page
    diagnosisTitle: "ਏਆਈ ਫ਼ਸਲ ਰੋਗ ਨਿਦਾਨ",
    diagnosisDesc: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਇਲਾਜ ਪ੍ਰਾਪਤ ਕਰੋ।",
    diagnosisHistory: "ਨਿਦਾਨ ਇਤਿਹਾਸ",
    scanLeafBtn: "ਪੱਤਾ ਸਕੈਨ ਕਰੋ",

    // Dashboard Page
    dashboardTitle: "ਕਰਨਾਲ ਪ੍ਰਿਸਿਜ਼ਨ ਐਗਰੋ-ਹੱਬ",
    dashboardDesc: "ਖੇਤੀਬਾੜੀ ਦੇ ਸਮੁੱਚੇ ਕੰਮਾਂ ਦਾ ਕੇਂਦਰ।",
    overallCropHealth: "ਕੁੱਲ ਫ਼ਸਲ ਸਿਹਤ",
    foliageIntegrity: "ਪਲਾਟ A ਪੱਤੇ ਦੀ ਸਥਿਤੀ",
    activeDiseaseAlerts: "ਸਰਗਰਮ ਰੋਗ ਚੇਤਾਵਨੀਆਂ",

    // Settings Page
    settingsTitle: "ਖੇਤ ਤਰਜੀਹਾਂ ਅਤੇ ਸੰਰਚਨਾ",
    settingsDesc: "ਜ਼ਮੀਨ ਦਾ ਖੇਤਰਫਲ, ਸਥਾਨਕ ਜਲਵਾਯੂ, ਇਕਾਈਆਂ ਅਤੇ ਬਹੁ-ਭਾਸ਼ਾਈ ਸੇਵਾਵਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।",
    farmerProfile: "ਕਿਸਾਨ ਅਤੇ ਪਲਾਟ ਪ੍ਰੋਫਾਈਲ",
    farmerName: "ਕਿਸਾਨ ਦਾ ਨਾਮ",
    contactPhone: "ਸੰਪਰਕ ਨੰਬਰ",
    farmHolding: "ਖੇਤ ਦਾ ਨਾਮ",
    locationCoords: "ਸਥਾਨ",
    multilingual: "ਬਹੁ-ਭਾਸ਼ਾਈ ਅਤੇ ਯੂਨਿਟ",
    appLanguage: "ਐਪਲੀਕੇਸ਼ਨ ਭਾਸ਼ਾ",
    areaUnits: "ਖੇਤਰਫਲ ਇਕਾਈਆਂ",
    realtimeAlerts: "ਰੀਅਲ-ਟਾਈਮ ਚੇਤਾਵਨੀਆਂ",
    diseaseAlerts: "ਫ਼ਸਲ ਰੋਗ ਚੇਤਾਵਨੀਆਂ",
    diseaseAlertsDesc: "ਜਦੋਂ ਗੁਆਂਢੀ ਖੇਤਾਂ ਵਿੱਚ ਫੰਗਸ ਜਾਂ ਬਿਮਾਰੀ ਦਾ ਖਤਰਾ ਹੋਵੇ ਤਾਂ ਤੁਰੰਤ ਸੁਚੇਤ ਕਰੋ।",
    weatherAlerts: "ਮੀਂਹ ਅਤੇ ਕੋਹਰਾ ਚੇਤਾਵਨੀ",
    weatherAlertsDesc: "ਸਿੰਚਾਈ ਜਾਂ ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ ਮੁਲਤਵੀ ਕਰਨ ਦੀ ਸਲਾਹ।",
    saveSettings: "ਸੈਟਿੰਗਾਂ ਸੁਰੱਖਿਅਤ ਕਰੋ",
    savingSettings: "ਸੁਰੱਖਿਅਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    savedSuccess: "ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤਾ ਗਿਆ!",
    settingsPersisted: "ਸੈਟਿੰਗਾਂ ਸੁਰੱਖਿਅਤ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।",

    // Quick Actions / Prompts
    analyzeCrop: "ਫ਼ਸਲ ਦੀ ਜਾਂਚ ਕਰੋ",
    explorePlatform: "ਖੇਤੀ ਦ੍ਰਿਸ਼ਟੀ ਵੇਖੋ",
  },
  te: {
    // Navigation
    dashboard: "డాష్‌బోర్డ్",
    cropDiagnosis: "పంట వ్యాధి నిర్ధారణ",
    cropRecommendation: "పంట సిఫార్సులు",
    smartIrrigation: "స్మార్ట్ నీటిపారుదల",
    weatherIntelligence: "వాతావరణ సమాచారం",
    sustainabilityScore: "సుస్థిర వ్యవసాయ స్కోరు",
    farmMonitoring: "పొలం పర్యవేక్షణ (IoT)",
    aiAssistant: "ఏఐ రైతు సహాయకుడు",
    farmAdvisor: "వ్యవసాయ సలహాదారు",
    settings: "సెట్టింగ్‌లు",

    // Badges & Common Header
    activeStation: "యాక్టివ్ స్టేషన్",
    quickDiagnosis: "త్వరిత నిర్ధారణ",
    stationName: "ఉత్తర వ్యవసాయ కేంద్రం (హర్యానా)",
    plotInfo: "ప్లాట్ A (కర్నాల్ హబ్)",
    plotDetails: "4.2 హెక్టార్లు • డ్రిప్ యాక్టివ్",
    smartAgri: "స్మార్ట్ వ్యవసాయం",
    simulationMode: "సిమ్యులేషన్ మోడ్",
    coreAi: "కోర్ ఏఐ",
    agentic: "ఏజెంటిక్",

    // Smart Irrigation Page
    irrigationTitle: "స్మార్ట్ నీటిపారుదల & నేల తేమ నిర్వహణ",
    irrigationDesc: "సెన్సార్ ఆధారిత తేమ విశ్లేషణ మరియు నీటి సరఫరా షెడ్యూల్.",
    manualCycle: "మాన్యువల్ సైకిల్ ప్రారంభించండి",
    haltSolenoid: "నీటి ప్రవాహాన్ని ఆపండి",
    rootZoneMoisture: "వేరు మండలంలో తేమ",
    target: "లక్ష్యం",
    waterRequired: "అవసరమైన నీరు",
    fieldCapacity: "ఫీల్డ్ సామర్థ్యం కోసం",
    nextCycle: "తదుపరి సైకిల్",
    eveningDrip: "సాయంత్రం డ్రిప్ స్లాట్",
    valveStatus: "వాల్వ్ స్థితి",
    valveRunning: "రన్నింగ్ (డ్రిప్)",
    valveStandby: "స్టాండ్‌బై",
    soilMoistureGauge: "నేల తేమ గేజ్",
    capacitiveDepth: "20 సెం.మీ లోతులో సెన్సార్ డేటా",
    volumetricContent: "నీటి శాతం",
    underMoistureTitle: "సిఫార్సు చేసిన దానికంటే తక్కువ తేమ",
    underMoistureDesc: "నేలలో తేమ తక్కువగా ఉంది, నీటిపారుదల అవసరం.",
    moistureTrendTitle: "24-గంటల నేల తేమ ట్రెండ్",
    moistureTrendDesc: "గంటవారీ రీడింగ్‌లు",
    moisturePercent: "తేమ %",
    targetMin: "కనిష్ట లక్ష్యం (45%)",

    // Recommendations Page
    recTitle: "స్మార్ట్ పంట సిఫార్సు విధానం",
    recDesc: "నేల రకం, వాతావరణం ఆధారంగా దిగుబడిని పెంచే పంటలను ఏఐ ద్వారా ఎంపిక చేసుకోండి.",
    soilParamsTitle: "నేల మరియు వాతావరణ పారామితులు",
    soilType: "నేల రకం",
    loamySoil: "ఒండ్రు నేల (సమతుల్య)",
    clayeyLoam: "బంకమట్టి ఒండ్రు",
    sandyLoam: "ఇసుక ఒండ్రు",
    blackCotton: "నల్లరేగడి నేల",
    nitrogen: "నైట్రోజన్ (N)",
    phosphorus: "భాస్వరం (P)",
    potassium: "పొటాషియం (K)",
    soilPh: "నేల pH",
    temp: "ఉష్ణోగ్రత (°C)",
    humidity: "తేమ శాతం (%)",
    rainfall: "వర్షపాతం (మి.మీ)",
    calcBtn: "సిఫార్సు చేయబడిన పంటలను లెక్కించండి",
    evaluatingBtn: "విశ్లేషణ జరుగుతోంది...",
    awaitingTitle: "నేల విశ్లేషణ కోసం వేచి ఉంది",
    awaitingDesc: "వివరాలను నమోదు చేసి పంటల జాబితాను పొందండి.",
    projectedYield: "అంచనా దిగుబడి",
    suitability: "అనుకూలత",
    waterReq: "నీటి అవసరం",
    growthCycle: "వ్యవధి",
    days: "రోజులు",
    sustainabilityRating: "స్థిరత్వ రేటింగ్",

    // Diagnosis Page
    diagnosisTitle: "ఏఐ పంట వ్యాధి గుర్తింపు",
    diagnosisDesc: "ఆకు ఫోటోను అప్‌లోడ్ చేసి వ్యాధి వివరాలను పొందండి.",
    diagnosisHistory: "నిర్ధారణ చరిత్ర",
    scanLeafBtn: "ఆకును స్కాన్ చేయండి",

    // Dashboard Page
    dashboardTitle: "కర్నాల్ ప్రెసిషన్ అగ్రో హబ్",
    dashboardDesc: "పంట ఆరోగ్యం మరియు సమాచార కేంద్రం.",
    overallCropHealth: "మొత్తం పంట ఆరోగ్యం",
    foliageIntegrity: "ప్లాట్ A ఆరోగ్యం",
    activeDiseaseAlerts: "సక్రియ వ్యాధి హెచ్చరికలు",

    // Settings Page
    settingsTitle: "వ్యవసాయ ప్రాధాన్యతలు & కాన్ఫిగరేషన్",
    settingsDesc: "భూమి విస్తీర్ణం, వాతావరణ సమాచారం, యూనిట్లు మరియు భాషలను నిర్వహించండి.",
    farmerProfile: "రైతు & ప్లాట్ ప్రొఫైల్",
    farmerName: "రైతు పేరు",
    contactPhone: "ఫోన్ నంబర్",
    farmHolding: "వ్యవసాయ క్షేత్రం పేరు",
    locationCoords: "ప్రాంతం వివరాలు",
    multilingual: "భాష & యూనిట్ల వివరాలు",
    appLanguage: "యాప్ భాష",
    areaUnits: "విస్తీర్ణ యూనిట్లు",
    realtimeAlerts: "వ్యవసాయ హెచ్చరికలు",
    diseaseAlerts: "కీలక పంట వ్యాధి హెచ్చరికలు",
    diseaseAlertsDesc: "వాతావరణం లేదా పొరుగు ప్రాంతాలలో తెగుళ్లు వ్యాపించే ప్రమాదం ఉన్నప్పుడు హెచ్చరికలు.",
    weatherAlerts: "వర్షం & మంచు హెచ్చరికలు",
    weatherAlertsDesc: "నీటిపారుదల లేదా మందుల పిచికారీ వాయిదా వేయడానికి సూచనలు.",
    saveSettings: "సెట్టింగ్‌లను సేవ్ చేయండి",
    savingSettings: "సేవ్ చేయబడుతోంది...",
    savedSuccess: "విజయవంతంగా సేవ్ చేయబడింది!",
    settingsPersisted: "సెట్టింగ్‌లు భద్రపరచబడ్డాయి.",

    // Quick Actions / Prompts
    analyzeCrop: "పంటను విశ్లేషించండి",
    explorePlatform: "వ్యవసాయ దర్శిని చూడండి",
  },
  gu: {
    dashboard: "ડેશબોર્ડ",
    cropDiagnosis: "પાક રોગ નિદાન",
    cropRecommendation: "પાક ભલામણ",
    smartIrrigation: "સ્માર્ટ સિંચાઈ",
    weatherIntelligence: "હવામાન માહિતી",
    sustainabilityScore: "ટકાઉ ખેતી સ્કોર",
    farmMonitoring: "ખેત દેખરેખ (IoT)",
    aiAssistant: "AI ખેડૂત સહાયક",
    farmAdvisor: "ખેતી સલાહકાર",
    settings: "સેટિંગ્સ",
    activeStation: "સક્રિય સ્ટેશન",
    quickDiagnosis: "ઝડપી તપાસ",
    stationName: "ઉત્તર કૃષિ કેન્દ્ર (હરિયાણા)",
    plotInfo: "પ્લોટ A (કરનાલ હબ)",
    plotDetails: "4.2 હેક્ટર • ડ્રિપ સક્રિય",
    smartAgri: "સ્માર્ટ ખેતી",
    simulationMode: "સિમ્યુલેશન મોડ",
    coreAi: "કોર AI",
    agentic: "એજન્ટિક",
    irrigationTitle: "સ્માર્ટ સિંચાઈ અને જમીન ભેજ વ્યવસ્થાપન",
    irrigationDesc: "સેન્સર-આધારિત મૂળ ઝોન ભેજ ટેલિમેટ્રી, બાષ્પોત્સર્જન મોડેલિંગ અને હવામાન-સુમેળ સિંચાઈ સમયપત્રક.",
    manualCycle: "મેન્યુઅલ સિંચાઈ ચક્ર શરૂ કરો",
    haltSolenoid: "સક્રિય સોલેનોઇડ બંધ કરો",
    rootZoneMoisture: "મૂળ ઝોન ભેજ",
    target: "લક્ષ્ય",
    waterRequired: "જરૂરી પાણી",
    fieldCapacity: "ખેત ક્ષમતા માટે",
    nextCycle: "આગળનું ચક્ર",
    eveningDrip: "સાંજની ડ્રિપ સ્લોટ",
    valveStatus: "વાલ્વ સ્થિતિ",
    valveRunning: "ચાલુ (ડ્રિપ)",
    valveStandby: "સ્ટેન્ડબાય",
    soilMoistureGauge: "જમીન ભેજ ગેજ",
    capacitiveDepth: "20 સે.મી. ઊંડાઈ પર સેન્સર ડેટા",
    volumetricContent: "પાણીનું પ્રમાણ",
    underMoistureTitle: "ભલામણ કરેલ ભેજ કરતાં ઓછું",
    underMoistureDesc: "જમીનનો ભેજ ઓછો છે, સિંચાઈ કરવાની સલાહ છે.",
    moistureTrendTitle: "24-કલાક જમીન ભેજ ટ્રેન્ડ",
    moistureTrendDesc: "કલાકદીઠ રીડિંગ",
    moisturePercent: "ભેજ %",
    targetMin: "લઘુત્તમ લક્ષ્ય (45%)",
    recTitle: "બુદ્ધિશાળી પાક ભલામણ",
    recDesc: "જમીનના પોષક તત્વો અને આબોહવા સ્થિતિ દાખલ કરો અને AI દ્વારા શ્રેષ્ઠ પાક મેળવો.",
    soilParamsTitle: "જમીન અને આબોહવા પ્રાચલ",
    soilType: "જમીનનો પ્રકાર",
    loamySoil: "ગોરાડુ જમીન (સંતુલિત)",
    clayeyLoam: "ચીકણી ગોરાડુ",
    sandyLoam: "રેતાળ ગોરાડુ",
    blackCotton: "કાળી કપાસ જમીન",
    nitrogen: "નાઇટ્રોજન (N)",
    phosphorus: "ફોસ્ફરસ (P)",
    potassium: "પોટેશિયમ (K)",
    soilPh: "જમીન pH",
    temp: "તાપમાન (°C)",
    humidity: "ભેજ (%)",
    rainfall: "વરસાદ (મિ.મી)",
    calcBtn: "ભલામણ કરેલ પાક ગણો",
    evaluatingBtn: "મૂલ્યાંકન થઈ રહ્યું છે...",
    awaitingTitle: "જમીન મૂલ્યાંકનની રાહ",
    awaitingDesc: "ડાબી બાજુ NPK અને આબોહવા મૂલ્યો સેટ કરો અને પરિણામ જુઓ.",
    projectedYield: "અંદાજિત ઉત્પાદન",
    suitability: "યોગ્યતા",
    waterReq: "પાણીની જરૂર",
    growthCycle: "સમયગાળો",
    days: "દિવસ",
    sustainabilityRating: "ટકાઉ રેટિંગ",
    diagnosisTitle: "AI પાક રોગ શોધ",
    diagnosisDesc: "પાંદડાની છબી અપલોડ કરો અને રોગ વિગતો મેળવો.",
    diagnosisHistory: "નિદાન ઇતિહાસ",
    scanLeafBtn: "પાંદડું સ્કેન કરો",
    dashboardTitle: "કરનાલ પ્રિસિઝન એગ્રો-હબ",
    dashboardDesc: "પાક આરોગ્ય અને માહિતી કેન્દ્ર.",
    overallCropHealth: "કુલ પાક આરોગ્ય",
    foliageIntegrity: "પ્લોટ A ની સ્થિતિ",
    activeDiseaseAlerts: "સક્રિય રોગ ચેતવણીઓ",
    settingsTitle: "ખેત પ્રાધાન્યતાઓ અને રૂપરેખા",
    settingsDesc: "જમીન વિસ્તાર, સ્થાનિક આબોહવા, એકમો અને બહુભાષી સેવાઓ સંચાલિત કરો.",
    farmerProfile: "ખેડૂત અને પ્લોટ પ્રોફાઇલ",
    farmerName: "ખેડૂતનું નામ",
    contactPhone: "સંપર્ક ફોન",
    farmHolding: "ખેતરનું નામ",
    locationCoords: "સ્થાન",
    multilingual: "બહુભાષી અને એકમ",
    appLanguage: "એપ્લિકેશન ભાષા",
    areaUnits: "વિસ્તાર એકમો",
    realtimeAlerts: "રીઅલ-ટાઇમ ચેતવણીઓ",
    diseaseAlerts: "પાક રોગ ચેતવણીઓ",
    diseaseAlertsDesc: "પડોશી ખેતરોમાં ફૂગ અથવા રોગ ફેલાવાનો ખતરો હોય ત્યારે ચેતવણી.",
    weatherAlerts: "વરસાદ અને હિમ ચેતવણી",
    weatherAlertsDesc: "સિંચાઈ અથવા જંતુનાશક છંટકાવ મોકૂફ રાખવાની સૂચના.",
    saveSettings: "સેટિંગ્સ સાચવો",
    savingSettings: "સાચવી રહ્યા છીએ...",
    savedSuccess: "સફળતાપૂર્વક સાચવ્યું!",
    settingsPersisted: "સેટિંગ્સ સુરક્ષિત રીતે સાચવ્યા.",
    analyzeCrop: "પાકની તપાસ કરો",
    explorePlatform: "કૃષિ દૃષ્ટિ જુઓ",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations["en"]) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => translations["en"][key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("krishidrishti_language");
      const validLangs = ["en", "hi", "pa", "te", "gu"];
      if (saved && validLangs.includes(saved)) {
        setLanguageState(saved as Language);
      } else {
        const settings = localStorage.getItem("krishidrishti_settings");
        if (settings) {
          const parsed = JSON.parse(settings);
          if (parsed.language && validLangs.includes(parsed.language)) {
            setLanguageState(parsed.language);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("krishidrishti_language", lang);
      const settings = localStorage.getItem("krishidrishti_settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        parsed.language = lang;
        localStorage.setItem("krishidrishti_settings", JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: keyof typeof translations["en"]): string => {
    const currentDict = translations[language] || translations["en"];
    return currentDict[key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
