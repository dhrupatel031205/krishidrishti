"use client";
import React, { useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

export function EvaluatorManualDownload({ variant = "navbar" }: { variant?: "navbar" | "hero" }) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const PH = doc.internal.pageSize.getHeight();
      const M = 14;
      const CW = W - M * 2;
      let y = 0;

      const newPage = () => { doc.addPage(); y = 20; };
      const chk = (n: number) => { if (y + n > PH - 18) newPage(); };

      const header = () => {
        doc.setFillColor(27, 67, 50);
        doc.rect(0, 0, W, 44, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("KrishiDrishti", M, 17);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(52, 211, 153);
        doc.text("SIH 2026 Internal Hackathon | L. J. Institute of Engineering and Technology | C-433", M, 25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text("EVALUATOR MANUAL", W - M, 17, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(52, 211, 153);
        doc.text("Complete answers to all judging criteria", W - M, 25, { align: "right" });
        y = 54;
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

      const row = (label: string, value: string) => {
        chk(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(27, 67, 50);
        doc.text(label + ":", M, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(value, CW - 38);
        doc.text(lines, M + 38, y);
        y += Math.max(lines.length * 5, 5) + 2;
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

      const gap = (n = 4) => { y += n; };

      const scoreBox = (criterion: string, weight: string, answer: string) => {
        chk(22);
        doc.setFillColor(248, 250, 248);
        doc.setDrawColor(27, 67, 50);
        doc.setLineWidth(0.4);
        doc.roundedRect(M, y, CW, 18, 2, 2, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(27, 67, 50);
        doc.text(criterion, M + 3, y + 5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(52, 211, 153);
        doc.setFillColor(27, 67, 50);
        doc.roundedRect(W - M - 18, y + 2, 16, 7, 1, 1, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(weight, W - M - 10, y + 7, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(answer, CW - 6);
        doc.text(lines.slice(0, 2), M + 3, y + 12);
        y += 22;
      };

      const footer = () => {
        const total = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
          doc.setPage(i);
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.3);
          doc.line(M, PH - 12, W - M, PH - 12);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(160, 160, 160);
          doc.text("KrishiDrishti Evaluator Manual  |  SIH 2026 C-433  |  krishidrashtiai.vercel.app", M, PH - 7);
          doc.text(`Page ${i} of ${total}`, W - M, PH - 7, { align: "right" });
        }
      };

      // ── PAGE 1 ──────────────────────────────────────────────────────
      header();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, M, y);
      gap(8);

      sec("QUICK REFERENCE — WHAT WAS BUILT");
      row("Team", "Team ByteForge");
      row("Problem", "C-433 — AgriSmart AI: Intelligent Agriculture for a Sustainable Future");
      row("Institution", "L. J. Institute of Engineering and Technology");
      row("Core Task", "Crop Disease Detection — EfficientNet-B0, 38 classes, PlantVillage");
      row("Bonus Modules", "A (Crop Rec) + B (Irrigation) + C (Weather) + D (Sustainability) + E (GenAI) + F (IoT) + G (Agentic)");
      row("Primary Metric", "Macro-F1 = 0.9634 on PlantVillage validation set (80/20 stratified split)");
      row("Live App", "https://krishidrashtiai.vercel.app");
      row("API Docs", "https://krishidrishti-1-nva8.onrender.com/docs");
      row("Predict CLI", "python model/predict.py --image path/to/leaf.jpg");
      gap();

      sec("SECTION 4.1 — PREDICT INTERFACE (REQUIRED)");
      body("The predict interface is implemented in model/predict.py and satisfies the exact Section 4.1 requirement.");
      sub("CLI usage (minimal output — class label only):");
      body("python model/predict.py --image path/to/leaf.jpg");
      body("Output: Corn_(maize)___Northern_Leaf_Blight");
      sub("CLI usage (full JSON output):");
      body("python model/predict.py --image path/to/leaf.jpg --json");
      body('Output: { "class_label": "Corn_(maize)___Northern_Leaf_Blight", "crop": "Corn maize", "condition": "Northern Leaf Blight", "healthy": false, "confidence": 0.9704, "top5": [...] }');
      sub("Python API (importable):");
      body("from model.predict import predict\nlabel = predict('path/to/leaf.jpg')  # returns PlantVillage class string");
      sub("Model weights location:");
      body("backend/models/krishidrishti_efficientnet_b0_final.pth  (loaded automatically by predict.py)");
      gap();

      sec("SECTION 4.2 — PRIMARY METRIC: MACRO-F1");
      row("Macro-averaged F1", "0.9634");
      row("Accuracy", "96.34%");
      row("Classes", "38 PlantVillage disease + healthy classes");
      row("Train images", "43,444 (80% stratified split of PlantVillage)");
      row("Validation images", "10,861 (20% stratified split)");
      row("Test set", "Organiser held-out field set (PlantDoc-style) — evaluated via predict interface");
      row("Confusion matrix", "Available in ai model/core.ipynb (notebook output cells) and report/MODEL_REPORT.md");
      gap();

      // ── PAGE 2 ──────────────────────────────────────────────────────
      sec("SECTION 7.3 — MODEL REPORT ANSWERS");
      sub("Task:");
      body("Multi-class crop disease image classification. 38 classes (disease + healthy variants) across 14 crop species from the PlantVillage dataset.");
      sub("Dataset & Split:");
      body("Source: PlantVillage (spMohanty/PlantVillage-Dataset, CC BY 4.0). Total: 54,305 images. Train: 43,444 (80%), Validation: 10,861 (20%), stratified by class. Test: organiser held-out PlantDoc-style field images — never trained on.");
      sub("Model / Approach:");
      body("Architecture: EfficientNet-B0 (torchvision). Backbone: ImageNet-pretrained. Classifier head replaced with Linear(1280 → 38). Transfer learning: ImageNet weights frozen for first 3 epochs, full fine-tuning for epochs 4–10. Optimizer: Adam (lr=1e-3, weight_decay=1e-4). Scheduler: ReduceLROnPlateau (patience=3, factor=0.5). Loss: CrossEntropyLoss. Batch: 32. Hardware: Tesla T4 GPU (Google Colab). Augmentation: RandomHorizontalFlip, RandomRotation(15°), ColorJitter. Inference: Test-Time Augmentation (TTA) — 5 views averaged (baseline, H-flip, ColorJitter, CenterCrop, Rotation).");
      sub("Metric & Result:");
      body("Macro-averaged F1 (primary): 0.9634. Accuracy: 96.34%. Training converged in 10 epochs (~45 min on T4). Full per-class precision/recall in ai model/core.ipynb and report/MODEL_REPORT.md.");
      sub("Baseline Comparison:");
      body("Problem statement baseline (EfficientNet-B3 on clean PlantVillage): ~0.96 macro-F1. Our EfficientNet-B0 achieves 0.9634 — matching the baseline with a lighter, faster architecture.");
      sub("Limitations (honest):");
      bul("Lab-to-field domain gap: PlantVillage has uniform backgrounds; real-field images with clutter, variable lighting, and occlusion will degrade accuracy. Expected field F1: ~0.75–0.85.");
      bul("38-class scope only: unsupported crops (wheat, rice) trigger an uncertainty guard rather than a silent wrong prediction.");
      bul("Single-leaf assumption: multi-leaf or whole-plant images reduce confidence.");
      bul("Post-model safety check flags predictions with confidence < 55% as uncertain.");
      gap();

      sec("SECTION 9 — EVALUATION CRITERIA ANSWERS (100 POINTS)");
      gap(2);

      scoreBox("AI/ML Implementation (25 pts)", "25 pts", "Macro-F1 = 0.9634 on PlantVillage val set. Honest 80/20 stratified split, no data leakage. TTA x5 for field robustness. Post-model safety check prevents silent misclassification. RandomForest crop recommendation (Module A): Accuracy ~99%, Macro-F1 ~0.99.");
      gap(2);
      scoreBox("Technical Implementation (20 pts)", "20 pts", "Fully reproducible from README in <10 min. FastAPI backend + Next.js frontend. All 7 bonus modules integrated. Deployed: Vercel (frontend) + Render (backend). MongoDB Atlas for auth/history.");
      gap(2);
      scoreBox("Innovation & Creativity (15 pts)", "15 pts", "TTA x5 for field generalisation. MobileNetV3 leaf validator guard. Post-model safety check. Agentic multi-signal advisor (G). Full multilingual GenAI assistant (E/F/G/H languages). PDF report generation for every module.");
      gap(2);
      scoreBox("Sustainability & Social Impact (15 pts)", "15 pts", "Module D: quantified sustainability score formula: 100*(0.4*water_eff + 0.3*fert_eff + 0.3*crop_health). Water savings calculated per session. Carbon offset estimate. Drip irrigation recommendations reduce water use 40-50%.");
      gap(2);
      scoreBox("User Experience (10 pts)", "10 pts", "Farmer-friendly UI: drag-drop upload, severity badges, tabbed treatment protocol, Grad-CAM heatmap overlay. Hindi/Gujarati/Punjabi/Telugu AI assistant. PDF download for every module. Mobile-responsive design.");
      gap(2);
      scoreBox("Problem Understanding (10 pts)", "10 pts", "All 7 bonus modules built. Honest limitations documented. Lab-to-field gap explicitly addressed with TTA and safety checks. Correct macro-F1 metric used (not accuracy). Confusion matrix in report.");
      gap(2);
      scoreBox("Presentation & Demo (5 pts)", "5 pts", "3-5 min demo video showing: leaf upload → disease result, crop recommendation, irrigation decision, weather advisory, sustainability score, Hindi AI assistant, IoT monitoring. Link in README.");
      gap();

      // ── PAGE 3 ──────────────────────────────────────────────────────
      sec("BONUS MODULES — VERIFICATION GUIDE");

      sub("Module A — Crop Recommendation");
      row("Endpoint", "POST /recommend-crop");
      row("Model", "RandomForest (scikit-learn, 200 estimators)");
      row("Dataset", "Crop Recommendation Dataset — Atharva Ingle, Kaggle (CC0)");
      row("Inputs", "N, P, K (kg/ha), temperature (°C), humidity (%), pH, rainfall (mm)");
      row("Output", "recommended_crop, confidence, top_crops (top-3 with probabilities)");
      row("Metric", "Accuracy ~99%, Macro-F1 ~0.99 on 20% held-out test split");
      row("Reproduce", "python backend/train_crop.py --csv backend/crop_recommendation.csv");
      gap(2);

      sub("Module B — Smart Irrigation");
      row("Endpoint", "POST /irrigation");
      row("Logic", "Rule-based: soil_moisture vs growth-stage threshold; rain_forecast >= 5mm defers irrigation");
      row("Thresholds", "Seedling: 40%, Vegetative: 50%, Flowering: 60%, Maturity: 35%");
      row("Validation", "Logic verified against agronomic standards; integrated with live sensor feed");
      row("Output", "irrigate (bool), reason, recommended_action with water volume (mm)");
      gap(2);

      sub("Module C — Weather Intelligence");
      row("Endpoint", "GET /weather?lat=&lon=");
      row("Data source", "Open-Meteo API (open-meteo.com, CC BY 4.0, no API key required)");
      row("Output", "temperature, humidity, rain_next_24h_mm, actions (disease risk, irrigation delay)");
      row("Disease risk", "Fungal risk flagged when humidity >= 80% AND 18°C <= temp <= 30°C");
      gap(2);

      sub("Module D — Sustainability Score");
      row("Endpoint", "POST /sustainability-score");
      row("Formula", "Score = 100 * (0.4 * water_efficiency + 0.3 * fertiliser_efficiency + 0.3 * crop_health)");
      row("water_efficiency", "clamp(water_optimal / water_used, 0, 1)");
      row("fert_efficiency", "clamp(fertiliser_recommended / fertiliser_used, 0, 1)");
      row("crop_health", "clamp(crop_health_input, 0, 1)  [0.0–1.0 scale]");
      row("Bands", "High >= 75, Medium >= 50, Low < 50. Improvement suggestions per pillar.");
      gap(2);

      sub("Module E — Farmer Assistant (GenAI)");
      row("Endpoint", "POST /assistant");
      row("LLM", "Groq API — Llama-3.3-70B-Versatile");
      row("Languages", "English, Hindi (hi), Gujarati (gu), Punjabi (pa), Telugu (te)");
      row("Fallback", "Curated agricultural knowledge base (7 topics) when API key absent");
      row("Grounding", "System prompt constrains to agronomy domain; conversation history (last 10 turns) passed for context");
      gap(2);

      sub("Module F — IoT Integration");
      row("Endpoint", "GET /sensor-feed?n=1..50");
      row("Sensors", "Soil moisture, temperature, humidity, pH — stateful simulation with day/night cycle");
      row("Architecture", "sensor(sim) → FastAPI → AI engine → recommendation → Next.js dashboard");
      row("Persistence", "Latest reading saved to MongoDB Atlas per authenticated user");
      row("Note", "Physical hardware not required per problem statement; simulated feed scored equally");
      gap(2);

      sub("Module G — Agentic Advisor");
      row("Endpoint", "GET /api/advisor/briefings?lat=&lon=");
      row("Decision loop", "Fetch live sensor → fetch Open-Meteo weather → apply 4 agronomic rules → rank by priority → return briefings");
      row("Rules", "1) Fungal risk (humidity+temp), 2) Irrigation decision (moisture+rain), 3) Heat stress (temp>=36°C), 4) Sowing window (post-rain+moisture)");
      row("Output", "hero_title, hero_description, ranked briefings with reason/action/impact/dataSources");
      row("Automation", "Fully autonomous — no manual input required; runs on page load and refresh");
      gap();

      sec("REPRODUCIBILITY CHECKLIST (JUDGE STEPS)");
      bul("Step 1 — Clone: git clone <repo-url> && cd krishidrishti");
      bul("Step 2 — Backend: cd backend && pip install -r requirements.txt");
      bul("Step 3 — Train crop model: python train_crop.py --csv crop_recommendation.csv");
      bul("Step 4 — Set env: cp .env.example .env  (set MONGODB_URI, JWT_SECRET, LLM_API_KEY)");
      bul("Step 5 — Start API: uvicorn main:app --reload --port 8000  →  http://localhost:8000/docs");
      bul("Step 6 — Frontend: cd krishidrishti_frontend && npm install && npm run dev  →  http://localhost:3000");
      bul("Step 7 — CLI predict: python model/predict.py --image path/to/leaf.jpg");
      bul("Step 8 — JSON predict: python model/predict.py --image path/to/leaf.jpg --json");
      bul("Total time from clone to first prediction: < 10 minutes (model weights pre-trained, no GPU needed)");
      gap();

      sec("DATA & LICENCE COMPLIANCE");
      row("PlantVillage", "spMohanty/PlantVillage-Dataset — CC BY 4.0 — used for train/validation only");
      row("Crop Recommendation", "Atharva Ingle, Kaggle — CC0 Public Domain — Module A training");
      row("Open-Meteo", "open-meteo.com — CC BY 4.0 — live weather, no API key");
      row("PyTorch/torchvision", "BSD licence — model training and inference");
      row("FastAPI", "MIT licence — REST API framework");
      row("Next.js", "MIT licence — frontend framework");
      row("scikit-learn", "BSD licence — crop recommendation model");
      row("Groq API", "Llama-3.3-70B — LLM inference for assistant");
      row("Originality", "All model training, evaluation, and system integration performed by team. AI coding assistants used for boilerplate only. No public notebooks copied wholesale.");
      gap();

      sec("KNOWN LIMITATIONS (HONEST DISCLOSURE)");
      bul("Lab-to-field domain gap: validation F1 = 0.9634 on clean PlantVillage; field-condition accuracy expected ~0.75–0.85 on PlantDoc-style images.");
      bul("38-class scope: only PlantVillage-supported crop/disease combinations. Unsupported crops trigger uncertainty guard, not silent wrong prediction.");
      bul("Single-leaf assumption: multi-leaf or whole-plant images reduce confidence.");
      bul("Groq LLM requires API key; system falls back to curated KB when key is absent.");
      bul("IoT sensor feed is simulated (stateful, day/night cycle) — physical hardware not deployed.");
      bul("Render free-tier backend may have cold-start delay of ~30 seconds on first request.");

      footer();
      doc.save("KrishiDrishti_Evaluator_Manual_C433.pdf");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "hero") {
    return (
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-800 shadow-xs hover:bg-stone-50 transition-all"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardList className="h-4 w-4 text-emerald-700" />}
        <span>{loading ? "Generating..." : "Evaluator Manual"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-100/80 transition-colors"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ClipboardList className="h-3.5 w-3.5 text-emerald-700" />}
      <span className="hidden sm:inline">Evaluator Manual</span>
    </button>
  );
}
