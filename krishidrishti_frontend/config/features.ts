/**
 * KrishiDrishti Modular Feature Configuration
 * 
 * Each module in KrishiDrishti can be enabled or disabled here.
 * The Sidebar navigation, TopNav, Dashboard widgets, and routes automatically
 * adapt when a module is disabled without breaking the core diagnosis platform.
 */

export interface FeatureFlags {
  diagnosis: boolean;      // Core AI Crop Disease Detection (Always true)
  recommendations: boolean;// Soil-based Crop Recommendation
  irrigation: boolean;     // Smart Irrigation Intelligence
  weather: boolean;        // Agro-Weather Intelligence
  sustainability: boolean; // Farm Sustainability Score
  monitoring: boolean;     // IoT / Sensor Telemetry
  assistant: boolean;      // AI Farmer Assistant
  advisor: boolean;        // Agentic Agricultural Advisor
}

export const featureFlags: FeatureFlags = {
  diagnosis: true,
  recommendations: true,
  irrigation: true,
  weather: true,
  sustainability: true,
  monitoring: true,
  assistant: true,
  advisor: true,
};

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return !!featureFlags[feature];
}
