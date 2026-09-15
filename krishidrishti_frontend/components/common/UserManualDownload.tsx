"use client";
import React, { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

export function UserManualDownload({ variant = "default" }: { variant?: "default" | "hero" | "navbar" }) {
  const [loading, setLoading] = useState(false);

  const loadLogoBase64 = async (): Promise<string | null> => {
    try {
      const res = await fetch("/logo.png");
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const generate = async () => {
    setLoading(true);
    try {
      const logoBase64 = await loadLogoBase64();
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const M = 14;
      const CW = W - M * 2;
      let y = 0;

      const newPage = () => { doc.addPage(); y = 20; };
      const chk = (n: number) => { if (y + n > H - 18) newPage(); };
      const gap = (n = 4) => { y += n; };

      const drawHeader = () => {
        doc.setFillColor(27, 67, 50);
        doc.rect(0, 0, W, 44, "F");
        // Logo
        if (logoBase64) {
          doc.addImage(logoBase64, "PNG", M, 6, 14, 14);
        }
        const textX = logoBase64 ? M + 17 : M;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text("KrishiDrishti – AgriSmart AI", textX, 17);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(52, 211, 153);
        doc.text("SIH 2026 Internal Hackathon | L. J. Institute of Engineering and Technology | Problem C-433", textX, 25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("USER MANUAL", W - M, 17, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(52, 211, 153);
        doc.text("See • Predict • Protect • Grow", W - M, 25, { align: "right" });
        y = 54;
      };

      const drawFooter = () => {
        const total = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
          doc.setPage(i);
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.3);
          doc.line(M, H - 12, W - M, H - 12);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(160, 160, 160);
          doc.text("KrishiDrishti User Manual  •  SIH 2026 C-433  •  krishidrashtiai.vercel.app", M, H - 7);
          doc.text(`Page ${i} of ${total}`, W - M, H - 7, { align: "right" });
        }
      };

      const sec = (t: string) => {
        chk(14);
        doc.setFillColor(27, 67, 50);
        doc.rect(M, y, CW, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(t, M + 3, y + 5.5);
        y += 12;
      };

      const sub = (t: string) => {
        chk(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(27, 67, 50);
        doc.text(t, M, y);
        y += 6;
      };

      const body = (t: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(t, CW);
        chk(lines.length * 5);
        doc.text(lines, M, y);
        y += lines.length * 5 + 2;
      };

      const bul = (t: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(t, CW - 6);
        chk(lines.length * 5);
        doc.setFillColor(27, 67, 50);
        doc.circle(M + 1.5, y - 1, 1.2, "F");
        doc.text(lines, M + 5, y);
        y += lines.length * 5 + 1;
      };

      const step = (num: number, t: string) => {
        const lines = doc.splitTextToSize(t, CW - 8);
        chk(lines.length * 5 + 2);
        doc.setFillColor(27, 67, 50);
        doc.circle(M + 2, y - 1, 2.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text(String(num), M + 2, y + 0.5, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);
        doc.text(lines, M + 7, y);
        y += lines.length * 5 + 3;
      };

      const infoBox = (label: string, value: string) => {
        chk(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(27, 67, 50);
        doc.text(label + ":", M, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(value, CW - 40);
        doc.text(lines, M + 40, y);
        y += Math.max(lines.length * 5, 5) + 2;
      };

      // ── COVER ──
      drawHeader();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, M, y);
      gap(8);

      // ── SECTION 1: WHAT IS KRISHIDRISHTI ──
      sec("1. WHAT IS KRISHIDRISHTI?");
      body("KrishiDrishti is an AI-powered precision agriculture platform built for SIH 2026 (Problem C-433). It addresses real farming challenges — crop diseases, water scarcity, unpredictable weather, and soil degradation — by combining deep learning computer vision, machine learning, IoT sensor feeds, live weather intelligence, and a multilingual GenAI assistant into one unified dashboard.");
      gap(2);
      infoBox("Live App", "https://krishidrashtiai.vercel.app");
      infoBox("Backend API", "https://krishidrishti-1-nva8.onrender.com");
      infoBox("API Docs", "https://krishidrishti-1-nva8.onrender.com/docs");
      infoBox("Cold-start note", "Free-tier backend may take 30–60 s to wake up on first request. Hit /health first.");
      gap();

      // ── SECTION 2: GETTING STARTED ──
      sec("2. GETTING STARTED");
      sub("2.1  Create an Account (optional — all modules work without login)");
      step(1, "Open https://krishidrashtiai.vercel.app and click 'Get Started Free'.");
      step(2, "Enter your name, email, farm name, location, and password.");
      step(3, "Click 'Create Account' — you are logged in automatically.");
      step(4, "With an account: diagnosis history, chat sessions, sensor readings, and crop recommendations are saved to MongoDB Atlas.");
      gap(2);
      sub("2.2  Sign In");
      step(1, "Click 'Sign In' on the homepage or navbar.");
      step(2, "Enter your registered email and password → click 'Login'.");
      gap();

      // ── SECTION 3: DASHBOARD ──
      sec("3. DASHBOARD (/dashboard)");
      body("The Dashboard is your farm command centre. It aggregates all 7 modules into one view and auto-refreshes every 60 seconds.");
      bul("Crop Health Score — overall foliage integrity % from latest diagnosis.");
      bul("Active Disease Alert — most recent detected disease with severity badge.");
      bul("Live Soil Moisture — current root-zone moisture % from IoT sensor feed.");
      bul("Sustainability Rating — your farm eco-efficiency score out of 100.");
      bul("Top Agentic Briefing — highest-priority farm action from Module G.");
      bul("Weather Risk — live temperature, humidity, and pathogen risk index.");
      bul("Recent Diagnoses — last 3 AI diagnosis results with thumbnail images.");
      bul("Download Report — exports full dashboard summary as PDF.");
      gap();

      // ── SECTION 4: CORE — DISEASE DETECTION ──
      sec("4. CORE TASK — AI CROP DISEASE DETECTION (/diagnosis)");
      body("Upload a crop leaf photo and the AI model (EfficientNet-B0, trained on 54,305 PlantVillage images, 38 disease classes, macro-F1 = 0.9634) identifies the disease, confidence %, severity, and generates a full treatment protocol.");
      gap(2);
      sub("Full pipeline (what happens when you upload):");
      bul("Step 1 — Content-type guard: only image/* files accepted.");
      bul("Step 2 — PlantNet API validation: checks the image contains a real plant. Non-plant images → red 'Not a Plant' banner, no prediction made.");
      bul("Step 3 — EfficientNet-B0 inference with TTA × 5: 5 augmented views (baseline, H-flip, ColorJitter, CenterCrop, Rotation) are averaged for field-condition robustness.");
      bul("Step 4 — Post-model safety check: if top-5 predictions span multiple crops (cross-crop mismatch) → 'Unsupported Crop' error instead of silent wrong prediction.");
      bul("Step 5 — Groq LLM (Llama-3.3-70B) generates farmer-friendly recommendations. Falls back to curated knowledge base if API key is absent.");
      bul("Step 6 — Result saved to MongoDB if user is authenticated.");
      gap(2);
      sub("How to use:");
      step(1, "Click 'AI Crop Disease Detection' in the sidebar.");
      step(2, "Drag & drop a leaf photo or click the upload box. Supported: JPG, PNG, WEBP up to 10 MB. Or click one of the 3 Quick Demo Samples.");
      step(3, "Click 'Run AI Crop Diagnosis'. Result appears in ~3–5 seconds.");
      step(4, "Read: Crop name, Disease/Condition, Confidence %, Severity badge (Healthy / Low / Moderate / Critical).");
      step(5, "Switch tabs — Immediate Actions / Treatment Plan / Prevention / Monitoring — for the full agronomic protocol.");
      step(6, "View Top-5 class probabilities to understand model confidence distribution.");
      step(7, "Click 'Download Report' to save a PDF diagnosis report.");
      gap(2);
      sub("Supported crops (38 PlantVillage classes):");
      body("Apple (Scab, Black Rot, Cedar Rust, Healthy), Blueberry (Healthy), Cherry (Powdery Mildew, Healthy), Corn/Maize (Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy), Grape (Black Rot, Esca, Leaf Blight, Healthy), Orange (Citrus Greening), Peach (Bacterial Spot, Healthy), Bell Pepper (Bacterial Spot, Healthy), Potato (Early Blight, Late Blight, Healthy), Raspberry (Healthy), Soybean (Healthy), Squash (Powdery Mildew), Strawberry (Leaf Scorch, Healthy), Tomato (Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy).");
      gap(2);
      sub("Tips for best results:");
      bul("Single leaf, close-up, good natural lighting — avoid blurry or dark images.");
      bul("If confidence < 55%, the safety check flags the result as uncertain — retake the photo.");
      bul("Non-leaf images (logos, people, objects) are rejected by PlantNet validation before inference.");
      gap();

      // ── SECTION 5: MODULE A ──
      sec("5. MODULE A — CROP RECOMMENDATION (/recommendations)");
      body("RandomForest ML model (trained on Crop Recommendation Dataset by Atharva Ingle, Kaggle CC0, ~99% accuracy, macro-F1 ~0.99) recommends the best crops for your soil and climate.");
      gap(2);
      sub("Pipeline:");
      bul("Inputs: N, P, K (kg/ha), temperature (°C), humidity (%), soil pH, rainfall (mm).");
      bul("Model: crop_model.pkl (RandomForest, 200 estimators, scikit-learn).");
      bul("Output: Top-3 crops with confidence scores, saved to MongoDB if authenticated.");
      gap(2);
      sub("How to use:");
      step(1, "Click 'Crop Recommendation' in the sidebar.");
      step(2, "Enter soil parameters: N, P, K, pH, Temperature, Humidity, Rainfall.");
      step(3, "Click 'Get Recommendation'.");
      step(4, "See top-3 crops with suitability %, yield estimate, water requirement, growth duration, advantages, and risks.");
      step(5, "Download the recommendation report as PDF.");
      gap(2);
      sub("Example inputs:");
      bul("Rice: N=90, P=42, K=43, Temp=20.8, Humidity=82, pH=6.5, Rainfall=202.9 → Expected: rice (~99% confidence).");
      bul("Chickpea: N=20, P=50, K=20, Temp=18, Humidity=65, pH=7.0, Rainfall=80 → Expected: chickpea.");
      gap();

      // ── SECTION 6: MODULE B ──
      sec("6. MODULE B — SMART IRRIGATION (/irrigation)");
      body("Rule-based engine using live soil moisture from the IoT sensor feed + Open-Meteo rain forecast + growth stage threshold to decide: Irrigate Now / Delay / No Action.");
      gap(2);
      sub("Decision logic:");
      bul("If soil_moisture < threshold AND rain_forecast < 5mm → Irrigate now (with water volume in litres).");
      bul("If soil_moisture < threshold AND rain_forecast >= 5mm → Delay irrigation — rain likely.");
      bul("If soil_moisture >= threshold → No irrigation needed.");
      gap(2);
      sub("Growth stage thresholds:");
      bul("Seedling: irrigate below 40% moisture.");
      bul("Vegetative: irrigate below 50% moisture.");
      bul("Flowering: irrigate below 60% moisture.");
      bul("Maturity: irrigate below 35% moisture.");
      gap(2);
      sub("How to use:");
      step(1, "Click 'Smart Irrigation' in the sidebar.");
      step(2, "Select your crop's current Growth Stage from the dropdown.");
      step(3, "Page auto-fetches live sensor moisture and Open-Meteo rain forecast.");
      step(4, "Read the decision: Irrigate / Delay / No Action with reason and water volume.");
      step(5, "Click 'Manual Cycle' to simulate valve open/close and track elapsed time.");
      step(6, "Click 'Refresh' for the latest sensor reading.");
      gap();

      // ── SECTION 7: MODULE C ──
      sec("7. MODULE C — WEATHER INTELLIGENCE (/weather)");
      body("Live weather from Open-Meteo API (free, no API key required, CC BY 4.0) with disease risk scoring and agronomic advisories. Auto-refreshes every 5 minutes.");
      gap(2);
      sub("Pipeline:");
      bul("Browser GPS (or default Karnal, Haryana) → Open-Meteo API → temperature, humidity, 24h precipitation.");
      bul("Rule engine: humidity >= 80% + temp 18–30°C → fungal risk advisory.");
      bul("Rule engine: rain >= 5mm → delay irrigation advisory.");
      bul("Rule engine: temp >= 38°C → heat stress advisory.");
      bul("Disease risk score (0–100) computed from combined conditions.");
      gap(2);
      sub("How to use:");
      step(1, "Click 'Weather Intelligence' in the sidebar.");
      step(2, "Allow location access for your local weather, or use the default location.");
      step(3, "Read: Temperature, Humidity, Precipitation (next 24h), Pathogen Risk Index.");
      step(4, "Follow the Agronomic Advisories — specific actions like 'Delay irrigation' or 'Apply fungicide'.");
      step(5, "Check the 5-day forecast with rain probability and temperature range.");
      gap();

      // ── SECTION 8: MODULE D ──
      sec("8. MODULE D — SUSTAINABILITY SCORE (/sustainability)");
      body("Formula-based 0–100 sustainability score measuring water efficiency, fertiliser efficiency, and crop health. Formula is fully published and reproducible as required by the problem statement.");
      gap(2);
      sub("Published formula (exact, reproducible):");
      bul("water_efficiency = min(1, water_optimal_litres / water_used_litres)");
      bul("fertiliser_efficiency = min(1, fertiliser_recommended_kg / fertiliser_used_kg)");
      bul("score = 100 × (0.4 × water_efficiency + 0.3 × fertiliser_efficiency + 0.3 × crop_health)");
      bul("Bands: High >= 75 | Medium >= 50 | Low < 50");
      gap(2);
      sub("How to use:");
      step(1, "Click 'Sustainability Score' in the sidebar.");
      step(2, "Enter: water used (L), water optimal (L), fertiliser used (kg), fertiliser recommended (kg), crop health (0.0–1.0).");
      step(3, "Click 'Calculate'.");
      step(4, "Read score, band, per-component breakdown, and improvement suggestions.");
      gap();

      // ── SECTION 9: MODULE E ──
      sec("9. MODULE E — FARMER ASSISTANT / GenAI (/assistant)");
      body("Conversational AI assistant powered by Groq Llama-3.3-70B with multilingual support. Grounded answers from agricultural knowledge base when LLM is unavailable.");
      gap(2);
      sub("Pipeline:");
      bul("User message + language code + last 10 conversation turns → Groq LLM (Llama-3.3-70B) with language-specific system prompt.");
      bul("Falls back to keyword-matched agricultural KB (7 topics: blight, irrigation, fertilizer, crop, disease, weather, soil) if LLM API key is absent.");
      bul("Chat sessions saved to MongoDB if authenticated.");
      gap(2);
      sub("Supported languages:");
      bul("English (en), Hindi (hi), Gujarati (gu), Punjabi (pa), Telugu (te).");
      gap(2);
      sub("How to use:");
      step(1, "Click 'AI Assistant' in the sidebar.");
      step(2, "Select your language from the language selector.");
      step(3, "Type your question and press Send or Enter.");
      step(4, "Click suggested follow-up bubbles for quick replies.");
      step(5, "Export the full conversation as PDF.");
      gap(2);
      sub("Example questions:");
      bul("'My tomato leaves have brown spots with yellow rings. What should I do?'");
      bul("'मेरी फसल में कीड़े लग गए हैं, क्या करूं?' (Hindi)");
      bul("'મારા ટામેટાના પાન પર ડાઘ છે, શું કરવું?' (Gujarati)");
      bul("'Which fertilizer is best for chickpea at vegetative stage?'");
      gap();

      // ── SECTION 10: MODULE F ──
      sec("10. MODULE F — IoT SENSOR MONITORING (/monitoring)");
      body("Real-time telemetry dashboard with 4 simulated sensors. The simulator is stateful (server-side), uses a day/night sinusoidal cycle, and drifts realistically — scored equally to physical hardware per the problem statement.");
      gap(2);
      sub("Simulator behaviour:");
      bul("Temperature: 26 + 6 × sin((hour-9)/24 × 2π) ± 0.5°C — peaks ~15:00 UTC.");
      bul("Humidity: 68 - 18 × sin(...) ± 2% — inverse of temperature (day/night cycle).");
      bul("Soil moisture: drifts down 0.2–0.8% per reading; auto-refills to 52–60% when it drops to 20% (simulated irrigation).");
      bul("pH: drifts ±0.02 per reading within [5.5, 7.5].");
      bul("IoT architecture: sensor(sim) → FastAPI → AI engine → recommendation engine → Next.js dashboard → farmer.");
      gap(2);
      sub("How to use:");
      step(1, "Click 'Farm Monitoring' in the sidebar.");
      step(2, "View 4 sensor cards: Root Zone Moisture %, Temperature °C, Humidity %, Soil pH.");
      step(3, "Check the Telemetry History chart (last 6 readings = 1 hour of data).");
      step(4, "Auto-refreshes every 30 seconds. Click 'Refresh' for immediate update.");
      step(5, "A warning badge appears on the moisture card when irrigation is needed (moisture < 35%).");
      gap();

      // ── SECTION 11: MODULE G ──
      sec("11. MODULE G — AGENTIC ADVISOR (/advisor)");
      body("Autonomous advisory engine that continuously analyses live sensor data + weather forecast and produces ranked farm briefings. Auto-refreshes every 60 seconds — no manual input required.");
      gap(2);
      sub("Decision rules (run on every request):");
      bul("Rule 1 — Fungal risk: humidity >= 75% AND temp 18–32°C → fungal disease briefing (critical if humidity >= 85%, else high).");
      bul("Rule 2 — Irrigation: soil_moisture < 50% AND rain >= 5mm → Hold irrigation briefing (high). soil_moisture < 50% AND rain < 5mm → Irrigate now briefing (high). soil_moisture >= 50% → Optimal briefing (low).");
      bul("Rule 3 — Heat stress: temperature >= 36°C → Heat stress briefing (high).");
      bul("Rule 4 — Sowing window: rain >= 5mm AND soil_moisture >= 40% → Favourable sowing window briefing (medium).");
      bul("Briefings sorted: critical → high → medium → low. Hero banner = top briefing.");
      gap(2);
      sub("How to use:");
      step(1, "Click 'Farm Advisor' in the sidebar.");
      step(2, "Read the hero banner — the most urgent farm action right now.");
      step(3, "Scroll ranked briefings — each shows reason, recommended action, estimated impact, and data sources.");
      step(4, "Click 'Acknowledge' once you have acted on a recommendation.");
      step(5, "Click 'Refresh' or wait 60 seconds for a live update.");
      step(6, "Click 'Download Report' to export all briefings as JSON/PDF.");
      gap();

      // ── SECTION 12: MODEL METRICS ──
      sec("12. MODEL METRICS (/model-metrics)");
      body("View the EfficientNet-B0 training performance: macro-F1, accuracy, per-class precision/recall/F1 for all 38 classes, and 10-epoch training history.");
      bul("Macro-averaged F1 (primary metric): 0.9634 on PlantVillage validation set.");
      bul("Accuracy: 96.34% on 10,861 validation images (20% stratified split).");
      bul("Training: 10 epochs, Tesla T4 GPU, ~45 minutes. Adam optimizer, lr=1e-3.");
      bul("Also available via API: GET /api/model/metrics");
      gap();

      // ── SECTION 13: DIAGNOSIS HISTORY ──
      sec("13. DIAGNOSIS HISTORY (/diagnosis/history)");
      body("All past diagnoses are saved automatically when signed in. Access via 'Diagnosis History' on the Diagnosis page.");
      bul("View crop, disease, confidence %, severity, and date for each past scan.");
      bul("Update status: Active / Treated / Monitoring.");
      bul("Delete old records you no longer need.");
      gap();

      // ── SECTION 14: SETTINGS ──
      sec("14. SETTINGS (/settings)");
      bul("Language: switch between English, Hindi, Gujarati, Punjabi, Telugu — affects the entire UI and AI assistant.");
      bul("Profile: update name, farm name, phone number, and location.");
      gap();

      // ── SECTION 15: DOWNLOAD REPORTS ──
      sec("15. DOWNLOAD REPORTS");
      body("Every module has a 'Download Report' button (PDF icon, top-right). Reports include all current data, charts, and recommendations formatted for printing or sharing with agronomists.");
      gap();

      // ── SECTION 16: TIPS ──
      sec("16. TIPS & BEST PRACTICES");
      bul("Upload clear, well-lit, single-leaf close-up photos for best disease detection accuracy.");
      bul("Run Crop Recommendation before each sowing season with updated soil test values.");
      bul("Check the Agentic Advisor every morning for the day's top farm action.");
      bul("Enable location access on the Weather page for your exact local forecast.");
      bul("Use the AI Assistant in your preferred language for the most comfortable experience.");
      bul("AI diagnosis should be verified with a local agronomist before major chemical interventions.");
      bul("The backend may take 30–60 seconds to respond on first load (Render free-tier cold start).");
      gap();

      // ── SECTION 17: LINKS ──
      sec("17. QUICK LINKS");
      infoBox("Web App", "https://krishidrashtiai.vercel.app");
      infoBox("Backend API", "https://krishidrishti-1-nva8.onrender.com");
      infoBox("API Docs (Swagger)", "https://krishidrishti-1-nva8.onrender.com/docs");
      infoBox("Health Check", "https://krishidrishti-1-nva8.onrender.com/health");
      infoBox("Model Status", "https://krishidrishti-1-nva8.onrender.com/debug/model");
      infoBox("Problem Statement", "SIH 2026 Internal Hackathon — C-433");
      infoBox("Institution", "L. J. Institute of Engineering and Technology");

      drawFooter();
      doc.save("KrishiDrishti_User_Manual.pdf");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "navbar") {
    return (
      <button onClick={generate} disabled={loading} className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-100/80 transition-colors">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookOpen className="h-3.5 w-3.5 text-emerald-700" />}
        <span className="hidden sm:inline">User Manual</span>
      </button>
    );
  }
  if (variant === "hero") {
    return (
      <button onClick={generate} disabled={loading} className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-800 shadow-xs hover:bg-stone-50 transition-all">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4 text-emerald-700" />}
        <span>{loading ? "Generating..." : "Download User Manual"}</span>
      </button>
    );
  }
  return (
    <button onClick={generate} disabled={loading} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
      <span>{loading ? "Generating..." : "Download User Manual"}</span>
    </button>
  );
}
