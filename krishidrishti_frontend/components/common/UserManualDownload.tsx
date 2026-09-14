"use client";

import React, { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

export function UserManualDownload({ variant = "default" }: { variant?: "default" | "hero" | "navbar" }) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentW = W - margin * 2;
      let y = 0;

      const addPage = () => {
        doc.addPage();
        y = 20;
        // footer on each page
      };

      const checkY = (needed: number) => {
        if (y + needed > H - 18) addPage();
      };

      const drawHeader = () => {
        doc.setFillColor(27, 67, 50);
        doc.rect(0, 0, W, 44, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text("KrishiDrishti", margin, 18);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(52, 211, 153);
        doc.text("AI-Powered Precision Agriculture Platform", margin, 26);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("User Manual", W - margin, 18, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(52, 211, 153);
        doc.text("See • Predict • Protect • Grow", W - margin, 26, { align: "right" });
        y = 54;
      };

      const drawFooter = () => {
        const total = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
          doc.setPage(i);
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.3);
          doc.line(margin, H - 12, W - margin, H - 12);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(160, 160, 160);
          doc.text("KrishiDrishti User Manual  •  krishidrashtiai.vercel.app", margin, H - 7);
          doc.text(`Page ${i} of ${total}`, W - margin, H - 7, { align: "right" });
        }
      };

      const sectionTitle = (title: string) => {
        checkY(14);
        doc.setFillColor(27, 67, 50);
        doc.rect(margin, y, contentW, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + 3, y + 5.5);
        y += 12;
      };

      const subTitle = (title: string) => {
        checkY(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(27, 67, 50);
        doc.text(title, margin, y);
        y += 6;
      };

      const bodyText = (text: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(text, contentW);
        checkY(lines.length * 5);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 2;
      };

      const bullet = (text: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(text, contentW - 6);
        checkY(lines.length * 5);
        doc.setFillColor(27, 67, 50);
        doc.circle(margin + 1.5, y - 1, 1.2, "F");
        doc.text(lines, margin + 5, y);
        y += lines.length * 5 + 1;
      };

      const step = (num: number, text: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(text, contentW - 8);
        checkY(lines.length * 5 + 2);
        doc.setFillColor(27, 67, 50);
        doc.circle(margin + 2, y - 1, 2.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text(String(num), margin + 2, y + 0.5, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);
        doc.text(lines, margin + 7, y);
        y += lines.length * 5 + 3;
      };

      const gap = (n = 4) => { y += n; };

      // ── PAGE 1: Cover + Overview ──
      drawHeader();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      gap(8);

      sectionTitle("1. WHAT IS KRISHIDRISHTI?");
      bodyText(
        "KrishiDrishti is an AI-powered precision agriculture platform designed for Indian farmers. It combines deep learning computer vision, IoT soil sensors, agro-weather forecasting, and a multilingual AI assistant into one unified dashboard. The platform helps farmers detect crop diseases early, choose the right crops, manage irrigation efficiently, and get actionable farm advice — all from a smartphone or computer."
      );
      gap();

      sectionTitle("2. GETTING STARTED");
      subTitle("2.1  Access the Platform");
      bullet("Web App: https://krishidrashtiai.vercel.app");
      bullet("API Docs: https://krishidrishti-1-nva8.onrender.com/docs");
      gap(2);

      subTitle("2.2  Create an Account");
      step(1, "Click 'Get Started Free' on the homepage.");
      step(2, "Enter your name, email, farm name, and location.");
      step(3, "Set a password and click 'Create Account'.");
      step(4, "You will be redirected to your Dashboard automatically.");
      gap(2);

      subTitle("2.3  Sign In");
      step(1, "Click 'Sign In' on the homepage or navbar.");
      step(2, "Enter your registered email and password.");
      step(3, "Click 'Login' to access your farm dashboard.");
      gap();

      sectionTitle("3. DASHBOARD");
      bodyText(
        "The Dashboard is your farm's command centre. It shows a real-time summary of all modules: recent disease diagnoses, soil moisture, weather risk, sustainability score, and the top agentic advisory briefing."
      );
      bullet("Crop Health Score — overall foliage integrity percentage.");
      bullet("Active Disease Alerts — latest detected disease with severity.");
      bullet("Soil Moisture — current root zone moisture reading.");
      bullet("Sustainability Rating — your farm's eco-efficiency score out of 100.");
      bullet("Agentic Briefing — the highest-priority farm action for today.");
      bullet("Weather Risk — current temperature, humidity, and pathogen risk index.");
      bullet("Recent Foliage Inspections — last 3 AI diagnosis results with images.");
      bullet("Download Report button — exports a full dashboard summary as PDF.");
      gap();

      // ── PAGE 2: Core Modules ──
      sectionTitle("4. MODULE A — AI CROP DISEASE DETECTION (Core)");
      bodyText(
        "Upload a photo of a crop leaf and the AI model (EfficientNet-B0, trained on 54,305 PlantVillage images across 38 disease classes) will identify the disease, confidence level, severity, and provide treatment recommendations."
      );
      subTitle("How to use:");
      step(1, "Click 'AI Crop Disease Detection' in the sidebar or 'Scan Crop Leaf' in the dashboard.");
      step(2, "Drag & drop a leaf photo or click the upload box to browse files. Supported formats: JPG, PNG, WEBP up to 10 MB.");
      step(3, "Alternatively, click one of the 3 Quick Demo Samples to test instantly.");
      step(4, "Click 'Run AI Crop Diagnosis'. The model runs in seconds.");
      step(5, "Review the result: Crop name, Disease/Condition, Confidence %, Severity badge.");
      step(6, "Switch tabs — Immediate Actions / Treatment Plan / Prevention / Monitoring — for full agronomic protocol.");
      step(7, "Click 'Download Report' to save a PDF diagnosis report.");
      gap(2);
      subTitle("Supported Crops (38 classes):");
      bodyText("Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato — including both healthy and diseased variants.");
      gap(2);
      subTitle("Tips for best results:");
      bullet("Use a clear, well-lit close-up photo of a single leaf.");
      bullet("Avoid blurry, dark, or overexposed images.");
      bullet("If confidence is below 55%, the system will flag the result as uncertain — retake the photo.");
      gap();

      sectionTitle("5. MODULE B — CROP RECOMMENDATION");
      bodyText(
        "Enter your soil parameters and the RandomForest ML model recommends the best crops for your field, ranked by suitability score."
      );
      subTitle("How to use:");
      step(1, "Click 'Crop Recommendation' in the sidebar.");
      step(2, "Select your Soil Type from the dropdown (Loamy, Clayey Loam, Sandy Loam, Black Cotton).");
      step(3, "Adjust the NPK sliders: Nitrogen (N), Phosphorus (P), Potassium (K) in kg/ha.");
      step(4, "Enter Soil pH (4.5–9.0), Temperature (°C), Humidity (%), and Rainfall (mm).");
      step(5, "Click 'Calculate Best Crops'.");
      step(6, "Review ranked results showing: Suitability %, Expected Yield, Water Requirement, Growth Duration, and Advantages.");
      step(7, "Download the recommendation report as PDF.");
      gap();

      sectionTitle("6. MODULE C — SMART IRRIGATION");
      bodyText(
        "Real-time soil moisture monitoring with rain-aware irrigation scheduling. The system reads live sensor data and tells you exactly when and how much to irrigate."
      );
      subTitle("How to use:");
      step(1, "Click 'Smart Irrigation' in the sidebar.");
      step(2, "Select your crop's current Growth Stage: Seedling / Vegetative / Flowering / Maturity.");
      step(3, "The dashboard shows: Root Zone Moisture %, Water Required (litres), Next Cycle time, and Valve Status.");
      step(4, "A rain forecast notice appears automatically if rain ≥ 5mm is expected — irrigation is deferred.");
      step(5, "Click 'Manual Cycle' to start/stop a manual irrigation cycle and track elapsed time.");
      step(6, "View the Moisture Trend chart (last 6 readings, 10-min intervals) with threshold reference line.");
      gap();

      // ── PAGE 3: More Modules ──
      sectionTitle("7. MODULE D — AGRO-WEATHER INTELLIGENCE");
      bodyText(
        "Live weather data from Open-Meteo (no API key required) with disease risk scoring and 5-day microclimate forecast tailored to crop pathogen dynamics."
      );
      subTitle("How to use:");
      step(1, "Click 'Weather Intelligence' in the sidebar.");
      step(2, "Allow location access when prompted for your local weather, or click 'Use My Location'.");
      step(3, "View current Temperature, Humidity, Precipitation (next 24h), and Pathogen Risk Index (0–100).");
      step(4, "Read Agronomic Weather Advisories — specific actions like 'Delay irrigation' or 'Apply fungicide'.");
      step(5, "Check the 5-Day Microclimate Outlook for rain probability and temperature range.");
      step(6, "Download the weather report as PDF.");
      gap();

      sectionTitle("8. MODULE E — FARM SUSTAINABILITY INDEX");
      bodyText(
        "Calculates your farm's sustainability score using the formula: Score = 100 × (0.4 × Water Efficiency + 0.3 × Fertiliser Efficiency + 0.3 × Crop Health). Scores are graded A/B/C with improvement suggestions."
      );
      subTitle("How to use:");
      step(1, "Click 'Sustainability Score' in the sidebar.");
      step(2, "The score is calculated automatically from live sensor data.");
      step(3, "Review the breakdown: Water Conservation, Soil Vitality, Crop Diversity, Chemical Usage, Resource Efficiency.");
      step(4, "Follow the improvement suggestions shown for each pillar below the target benchmark.");
      gap();

      sectionTitle("9. MODULE F — IOT SENSOR MONITORING");
      bodyText(
        "Real-time telemetry dashboard showing live readings from 4 simulated sensors: Root Zone Moisture, Ambient Temperature, Relative Humidity, and Soil pH."
      );
      subTitle("How to use:");
      step(1, "Click 'Farm Monitoring' in the sidebar.");
      step(2, "View the 4 sensor cards with current values, battery %, and status (Online / Warning).");
      step(3, "Check the Telemetry History chart for trends over the last 6 readings.");
      step(4, "A warning badge appears on the moisture sensor when irrigation is needed.");
      gap();

      sectionTitle("10. MODULE G — AI FARMER ASSISTANT");
      bodyText(
        "A multilingual conversational AI assistant (powered by Groq Llama-3.3-70B) that answers farming questions in English, Hindi, Gujarati, Punjabi, and Telugu."
      );
      subTitle("How to use:");
      step(1, "Click 'AI Assistant' in the sidebar.");
      step(2, "Change language using the language selector in Settings (English / Hindi / Gujarati / Punjabi / Telugu).");
      step(3, "Type your question in the input box and press Send or hit Enter.");
      step(4, "Click any Suggested Follow-Up question bubble for quick follow-ups.");
      step(5, "Export the full conversation as PDF using the Download button.");
      gap(2);
      subTitle("Example questions:");
      bullet("'My tomato leaves have brown rings — what disease is this?'");
      bullet("'मेरी फसल में पानी कब देना चाहिए?' (Hindi: When should I irrigate?)");
      bullet("'Which fertilizer is best for chickpea?'");
      bullet("'What is the risk of blight in humid weather?'");
      gap();

      sectionTitle("11. MODULE H — AGENTIC AGRICULTURAL ADVISOR");
      bodyText(
        "An autonomous reasoning engine that combines disease data, weather forecast, soil moisture, and crop market windows into ranked, prioritised farm briefings — updated daily."
      );
      subTitle("How to use:");
      step(1, "Click 'Farm Advisor' in the sidebar.");
      step(2, "Read the Daily Farm Briefing hero banner — the most urgent action for today.");
      step(3, "Review Ranked Operational Recommendations sorted by priority: Critical → High → Medium → Low.");
      step(4, "Each briefing shows: Reason, Recommended Action, Estimated Impact, and Signal Sources.");
      step(5, "Click 'Acknowledge Action' once you have acted on a recommendation.");
      step(6, "Download all briefings as a PDF report.");
      gap();

      sectionTitle("12. MODEL METRICS");
      bodyText(
        "View the EfficientNet-B0 model's training performance: accuracy, macro-F1, per-class precision/recall, and training history charts."
      );
      bullet("Navigate to 'Model Metrics' in the sidebar.");
      bullet("Macro-averaged F1: 0.9634 on PlantVillage validation set (38 classes, 54,305 images).");
      bullet("Per-class F1 table and training loss/F1 curves are displayed interactively.");
      gap();

      // ── PAGE 4: Settings + Tips ──
      sectionTitle("13. SETTINGS");
      subTitle("Language");
      bodyText("Go to Settings → Language. Choose from English, Hindi, Gujarati, Punjabi, or Telugu. The entire app UI and AI assistant will switch to the selected language.");
      gap(2);
      subTitle("Profile");
      bodyText("Update your name, farm name, phone number, and location from the Settings page.");
      gap();

      sectionTitle("14. DIAGNOSIS HISTORY");
      bodyText("All past diagnoses are saved automatically when you are signed in. Access them via 'Diagnosis History' link on the Diagnosis page.");
      bullet("View crop, disease, confidence, severity, and date for each past scan.");
      bullet("Update the status of a diagnosis: Active / Treated / Monitoring.");
      bullet("Delete old records you no longer need.");
      gap();

      sectionTitle("15. DOWNLOADING REPORTS");
      bodyText("Every module has a 'Download Report' button (PDF icon) in the top-right corner. Reports include all current data, charts, and recommendations formatted for printing or sharing with agronomists.");
      gap();

      sectionTitle("16. TIPS & BEST PRACTICES");
      bullet("Always upload clear, well-lit leaf photos for the most accurate disease detection.");
      bullet("Run Crop Recommendation before each sowing season with updated soil test values.");
      bullet("Check the Agentic Advisor every morning for the day's top farm action.");
      bullet("Enable location access on the Weather page for your exact local forecast.");
      bullet("Use the AI Assistant in your preferred language for the most comfortable experience.");
      bullet("Download and share PDF reports with your local Krishi Vigyan Kendra (KVK) agronomist.");
      bullet("AI diagnosis should be verified with a local agronomist before major chemical interventions.");
      gap();

      sectionTitle("17. SUPPORTED BROWSERS & DEVICES");
      bullet("Desktop: Chrome, Firefox, Edge, Safari (latest versions).");
      bullet("Mobile: Android Chrome, iOS Safari — fully responsive design.");
      bullet("Minimum screen width: 320px. Recommended: 768px or wider for best experience.");
      gap();

      sectionTitle("18. CONTACT & SUPPORT");
      bullet("Web App: https://krishidrashtiai.vercel.app");
      bullet("API: https://krishidrishti-1-nva8.onrender.com/docs");
      bullet("Problem Statement: SIH 2026 Internal Hackathon — C-433");
      bullet("Institution: L. J. Institute of Engineering and Technology");

      drawFooter();
      doc.save("KrishiDrishti_User_Manual.pdf");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "navbar") {
    return (
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-100/80 transition-colors"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookOpen className="h-3.5 w-3.5 text-emerald-700" />}
        <span className="hidden sm:inline">User Manual</span>
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-800 shadow-xs hover:bg-stone-50 transition-all"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4 text-emerald-700" />}
        <span>{loading ? "Generating..." : "Download User Manual"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
      <span>{loading ? "Generating..." : "Download User Manual"}</span>
    </button>
  );
}
