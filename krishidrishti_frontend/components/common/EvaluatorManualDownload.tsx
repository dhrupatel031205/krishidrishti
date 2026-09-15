"use client";
import React, { useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

export function EvaluatorManualDownload({ variant = "navbar" }: { variant?: "navbar" | "hero" }) {
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

      const header = () => {
        doc.setFillColor(27, 67, 50);
        doc.rect(0, 0, W, 44, "F");
        // Logo
        if (logoBase64) {
          doc.addImage(logoBase64, "PNG", M, 6, 14, 14);
        }
        const textX = logoBase64 ? M + 17 : M;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("KrishiDrishti – AgriSmart AI", textX, 17);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(52, 211, 153);
        doc.text("SIH 2026 Internal Hackathon | L. J. Institute of Engineering and Technology | Problem C-433", textX, 25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text("EVALUATOR / JUDGE MANUAL", W - M, 17, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(52, 211, 153);
        doc.text("Complete answers to all judging criteria", W - M, 25, { align: "right" });
        y = 54;
      };

      const footer = () => {
        const total = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
          doc.setPage(i);
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.3);
          doc.line(M, H - 12, W - M, H - 12);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(160, 160, 160);
          doc.text("KrishiDrishti Evaluator Manual  |  SIH 2026 C-433  |  krishidrashtiai.vercel.app", M, H - 7);
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

      const row = (label: string, value: string) => {
        chk(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(27, 67, 50);
        doc.text(label + ":", M, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(value, CW - 42);
        doc.text(lines, M + 42, y);
        y += Math.max(lines.length * 5, 5) + 2;
      };

      const scoreBox = (criterion: string, weight: string, answer: string) => {
        chk(24);
        doc.setFillColor(248, 250, 248);
        doc.setDrawColor(27, 67, 50);
        doc.setLineWidth(0.4);
        doc.roundedRect(M, y, CW, 20, 2, 2, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(27, 67, 50);
        doc.text(criterion, M + 3, y + 6);
        doc.setFillColor(27, 67, 50);
        doc.roundedRect(W - M - 20, y + 2, 18, 7, 1, 1, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(weight, W - M - 11, y + 7, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.8);
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(answer, CW - 6);
        doc.text(lines.slice(0, 2), M + 3, y + 13);
        y += 24;
      };

      // ── PAGE 1: COVER + QUICK REFERENCE ──
      header();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, M, y);
      gap(8);

      sec("QUICK REFERENCE — WHAT WAS BUILT");
      row("Team", "Team KrishiDrishti");
      row("Problem", "C-433 — AgriSmart AI: Intelligent Agriculture for a Sustainable Future");
      row("Institution", "L. J. Institute of Engineering and Technology");
      row("Core Task", "Crop Disease Detection — EfficientNet-B0, 38 classes, PlantVillage (54,305 images)");
      row("Bonus Modules", "A (Crop Rec) + B (Irrigation) + C (Weather) + D (Sustainability) + E (GenAI) + F (IoT) + G (Agentic)");
      row("Primary Metric", "Macro-F1 = 0.9634 on PlantVillage validation set (80/20 stratified split)");
      row("Live App", "https://krishidrashtiai.vercel.app");
      row("Backend API", "https://krishidrishti-1-nva8.onrender.com");
      row("API Docs", "https://krishidrishti-1-nva8.onrender.com/docs");
      row("Model Metrics API", "GET https://krishidrishti-1-nva8.onrender.com/api/model/metrics");
      row("Model Status", "GET https://krishidrishti-1-nva8.onrender.com/debug/model");
      row("PlantNet Status", "GET https://krishidrishti-1-nva8.onrender.com/debug/plantnet");
      row("Cold-start note", "Free-tier Render backend sleeps after 15 min. First request may take 30–60 s. Hit /health first.");
      gap();

      sec("SECTION 4.1 — PREDICT INTERFACE (MANDATORY REQUIREMENT)");
      body("The predict interface is in model/predict.py and satisfies the exact Section 4.1 requirement: a predict(image_path) Python function AND a CLI that prints the class label.");
      sub("CLI — minimal output (class label only):");
      body("python model/predict.py --image path/to/leaf.jpg");
      body("Expected output:  Corn_(maize)___Northern_Leaf_Blight");
      sub("CLI — full JSON output:");
      body("python model/predict.py --image path/to/leaf.jpg --json");
      body('Expected: { "class_label": "Corn_(maize)___Northern_Leaf_Blight", "crop": "Corn maize", "condition": "Northern Leaf Blight", "healthy": false, "confidence": 0.9704, "top5": [...] }');
      sub("Python API (importable):");
      body("from model.predict import predict\nlabel = predict('path/to/leaf.jpg')  # returns PlantVillage class string");
      sub("Model weights:");
      body("backend/models/krishidrishti_efficientnet_b0_final.pth  (loaded automatically, no manual steps)");
      sub("Reproduce in under 10 minutes:");
      bul("pip install torch torchvision Pillow  (~2 min on fast connection)");
      bul("python model/predict.py --image path/to/leaf.jpg");
      bul("No GPU required — runs on CPU.");
      gap();

      sec("SECTION 4.2 — PRIMARY METRIC: MACRO-F1 (REQUIRED)");
      row("Macro-averaged F1 (primary)", "0.9634");
      row("Accuracy", "96.34%");
      row("Classes", "38 PlantVillage disease + healthy classes across 14 crop species");
      row("Train images", "43,444 (80% stratified split of PlantVillage)");
      row("Validation images", "10,861 (20% stratified split — never trained on)");
      row("Test set", "Organiser held-out PlantDoc-style field images — evaluated via predict interface");
      row("Confusion matrix", "Full 38x38 matrix in ai model/core.ipynb (notebook output cells) and report/MODEL_REPORT.md");
      row("Per-class table", "All 38 classes with precision/recall/F1/support in report/MODEL_REPORT.md");
      gap();

      sec("SECTION 7.3 — MODEL REPORT (REQUIRED FIELDS)");
      sub("Task:");
      body("Multi-class crop disease image classification. 38 classes (disease + healthy variants) across 14 crop species from the PlantVillage dataset. Goal: given a leaf/crop photograph, output the correct disease class label.");
      sub("Dataset & Split:");
      body("Source: PlantVillage (spMohanty/PlantVillage-Dataset, CC BY 4.0). Total: 54,305 images. Train: 43,444 (80% stratified), Validation: 10,861 (20% stratified). Test: organiser held-out PlantDoc-style field images — never trained on, evaluated only via predict interface.");
      sub("Model / Approach:");
      body("Architecture: EfficientNet-B0 (torchvision). Backbone: ImageNet-pretrained. Classifier head: Linear(1280 → 38). Transfer learning: ImageNet weights frozen for first 3 epochs, full fine-tuning for epochs 4–10. Optimizer: Adam (lr=1e-3, weight_decay=1e-4). Scheduler: ReduceLROnPlateau (patience=3, factor=0.5). Loss: CrossEntropyLoss. Batch: 32. Hardware: Tesla T4 GPU (Google Colab). Augmentation: RandomHorizontalFlip, RandomRotation(15°), ColorJitter. Inference: TTA x5 (5 augmented views averaged: baseline, H-flip, ColorJitter, CenterCrop, Rotation).");
      sub("Metric & Result:");
      body("Macro-averaged F1 (primary): 0.9634. Accuracy: 96.34%. Training converged in 10 epochs (~45 min on T4). Full per-class precision/recall in ai model/core.ipynb and report/MODEL_REPORT.md.");
      sub("Baseline Comparison:");
      body("Problem statement baseline (EfficientNet-B3 on clean PlantVillage): ~0.96 macro-F1. Our EfficientNet-B0 achieves 0.9634 — matching the baseline with a lighter, faster architecture (fewer parameters, faster inference).");
      sub("Limitations (honest):");
      bul("Lab-to-field domain gap: PlantVillage has uniform backgrounds; real-field images with clutter, variable lighting, and occlusion will degrade accuracy. Expected field F1: ~0.75–0.85.");
      bul("38-class scope only: unsupported crops (wheat, rice) trigger an uncertainty guard rather than a silent wrong prediction.");
      bul("Single-leaf assumption: multi-leaf or whole-plant images reduce confidence.");
      bul("Post-model safety check flags predictions with cross-crop top-5 mismatch as 'Unsupported' — prevents silent misclassification.");
      gap();

      sec("SECTION 9 — EVALUATION CRITERIA (100 POINTS TOTAL)");
      gap(2);
      scoreBox("AI/ML Implementation — 25 pts", "25 pts", "Macro-F1 = 0.9634 on PlantVillage val set. Honest 80/20 stratified split, no data leakage. TTA x5 for field robustness. Post-model safety check prevents silent misclassification. Module A RandomForest: Accuracy ~99%, Macro-F1 ~0.99.");
      gap(2);
      scoreBox("Technical Implementation — 20 pts", "20 pts", "Fully reproducible from README in <10 min. FastAPI backend + Next.js frontend. All 7 bonus modules integrated and deployed. Vercel (frontend) + Render (backend). MongoDB Atlas for auth/history. CLI predict interface works with no manual steps.");
      gap(2);
      scoreBox("Innovation & Creativity — 15 pts", "15 pts", "TTA x5 for field generalisation. PlantNet API non-leaf validation guard. Post-model cross-crop safety check. Agentic multi-signal advisor (Module G). Full multilingual GenAI assistant (5 languages). PDF report generation for every module.");
      gap(2);
      scoreBox("Sustainability & Social Impact — 15 pts", "15 pts", "Module D formula published: score = 100*(0.4*water_eff + 0.3*fert_eff + 0.3*crop_health). Water savings quantified per irrigation session. Drip irrigation recommendations reduce water use 40-50%. Hindi/Gujarati/Punjabi/Telugu support for regional farmers.");
      gap(2);
      scoreBox("User Experience — 10 pts", "10 pts", "Farmer-friendly UI: drag-drop upload, severity badges, tabbed treatment protocol. Hindi/Gujarati/Punjabi/Telugu AI assistant. PDF download for every module. Mobile-responsive design. Auto-refresh with live timestamps on all dashboards.");
      gap(2);
      scoreBox("Problem Understanding — 10 pts", "10 pts", "All 7 bonus modules built and verified. Honest limitations documented in MODEL_REPORT.md. Lab-to-field gap explicitly addressed with TTA and safety checks. Correct macro-F1 metric used (not accuracy). Confusion matrix and per-class table in report.");
      gap(2);
      scoreBox("Presentation & Demo — 5 pts", "5 pts", "3-5 min demo video showing: leaf upload → disease result, crop recommendation, irrigation decision, weather advisory, sustainability score, Hindi AI assistant, IoT monitoring, agentic advisor. Link in README.");
      gap();

      sec("BONUS MODULES — VERIFICATION GUIDE");
      sub("Module A — Crop Recommendation");
      row("Endpoint", "POST /recommend-crop");
      row("Model", "RandomForest (scikit-learn, 200 estimators, crop_model.pkl)");
      row("Dataset", "Crop Recommendation Dataset — Atharva Ingle, Kaggle (CC0 Public Domain)");
      row("Inputs", "N, P, K (kg/ha), temperature (°C), humidity (%), pH, rainfall (mm)");
      row("Output", "recommended_crop, confidence, top_crops (top-3 with probabilities)");
      row("Metric", "Accuracy ~99%, Macro-F1 ~0.99 on 20% held-out test split");
      row("Reproduce", "python backend/train_crop.py --csv backend/crop_recommendation.csv");
      row("Swagger test", "POST /recommend-crop → select 'Rice (high humidity)' example → Execute → expect rice ~0.99");
      gap(2);

      sub("Module B — Smart Irrigation");
      row("Endpoint", "POST /irrigation");
      row("Logic", "Rule-based: soil_moisture vs growth-stage threshold; rain_forecast >= 5mm defers irrigation");
      row("Thresholds", "Seedling: 40%, Vegetative: 50%, Flowering: 60%, Maturity: 35%");
      row("Output", "irrigate (bool), reason, recommended_action with water volume in mm");
      row("Swagger test", "POST /irrigation → select 'Irrigate now' example → Execute → expect irrigate: true");
      row("Validation", "Logic verified against agronomic standards; integrated with live sensor feed");
      gap(2);

      sub("Module C — Weather Intelligence");
      row("Endpoint", "GET /weather?lat=&lon=");
      row("Data source", "Open-Meteo API (open-meteo.com, CC BY 4.0, no API key required)");
      row("Output", "temperature, humidity, rain_next_24h_mm, actions array (disease risk, irrigation delay)");
      row("Disease risk", "Fungal risk flagged when humidity >= 80% AND 18°C <= temp <= 30°C");
      row("Swagger test", "GET /weather?lat=23.0225&lon=72.5714 (Ahmedabad) → Execute → live weather data");
      gap(2);

      sub("Module D — Sustainability Score");
      row("Endpoint", "POST /sustainability-score");
      row("Formula", "score = 100 * (0.4 * water_eff + 0.3 * fert_eff + 0.3 * crop_health)");
      row("water_eff", "clamp(water_optimal / water_used, 0, 1)");
      row("fert_eff", "clamp(fert_recommended / fert_used, 0, 1)");
      row("Bands", "High >= 75, Medium >= 50, Low < 50. Improvement suggestions per pillar.");
      row("Swagger test", "POST /sustainability-score → 'Efficient farm' example → score ~95 (high). 'Inefficient farm' → score ~42 (low).");
      gap(2);

      sub("Module E — Farmer Assistant (GenAI)");
      row("Endpoint", "POST /assistant");
      row("LLM", "Groq API — Llama-3.3-70B-Versatile");
      row("Languages", "English (en), Hindi (hi), Gujarati (gu), Punjabi (pa), Telugu (te)");
      row("Fallback", "Curated agricultural KB (7 topics) when API key absent — llm_used: false in response");
      row("Grounding", "System prompt constrains to agronomy domain; last 10 conversation turns passed for context");
      row("Swagger test", "POST /assistant → 'Hindi query' example → Execute → Hindi response, check llm_used field");
      gap(2);

      sub("Module F — IoT Integration");
      row("Endpoint", "GET /sensor-feed?n=1..50");
      row("Sensors", "Soil moisture, temperature, humidity, pH — stateful simulation with day/night sinusoidal cycle");
      row("Architecture", "sensor(sim) → FastAPI → AI engine → recommendation engine → Next.js dashboard → farmer");
      row("Day/night cycle", "Temperature peaks ~15:00 UTC; humidity is inverse. Call at different times to verify.");
      row("Persistence", "Latest reading saved to MongoDB Atlas per authenticated user");
      row("Swagger test", "GET /sensor-feed?n=6 → 6 readings with soil_moisture, temperature, humidity, ph, needs_irrigation");
      gap(2);

      sub("Module G — Agentic Advisor");
      row("Endpoint", "GET /api/advisor/briefings?lat=&lon=");
      row("Decision loop", "Fetch live sensor → fetch Open-Meteo weather → apply 4 agronomic rules → rank by priority → return briefings");
      row("Rule 1", "humidity >= 75% + temp 18–32°C → fungal risk (critical if humidity >= 85%, else high)");
      row("Rule 2", "moisture < 50% + rain >= 5mm → hold irrigation (high). moisture < 50% + no rain → irrigate now (high)");
      row("Rule 3", "temp >= 36°C → heat stress (high)");
      row("Rule 4", "rain >= 5mm + moisture >= 40% → sowing window (medium)");
      row("Output", "hero_title, hero_description, ranked briefings with reason/action/impact/dataSources, generated_at");
      row("Verify live", "Call twice 60s apart — soil_moisture and humidity in data_sources will differ. generated_at changes.");
      row("Swagger test", "GET /api/advisor/briefings?lat=23.0225&lon=72.5714 → ranked briefings array");
      gap();

      sec("INPUT VALIDATION — NON-LEAF REJECTION (INNOVATION)");
      body("A key innovation: the system validates every uploaded image against the PlantNet API before running the disease model. Non-plant images are rejected with a clear error — no silent wrong prediction.");
      sub("Verify on frontend:");
      bul("Go to /diagnosis → upload a non-plant image (logo, person, object).");
      bul("Expected: red 'Invalid Image — Not a Plant' banner. No prediction made.");
      sub("Verify via API:");
      body("curl -X POST https://krishidrishti-1-nva8.onrender.com/api/predict -F file=@non_leaf.jpg");
      body("Expected: HTTP 422, { \"detail\": { \"type\": \"not_a_plant\", \"message\": \"...\" } }");
      sub("Verify PlantNet connection:");
      body("GET https://krishidrishti-1-nva8.onrender.com/debug/plantnet");
      body("Expected: { \"status\": \"OK — API reachable, key valid (404 = no plant found in test image, expected)\" }");
      gap();

      sec("MODEL LOADING VERIFICATION");
      body("GET https://krishidrishti-1-nva8.onrender.com/debug/model");
      body('Expected: { "status": "OK — model loaded and ready", "class_names_count": 38, "using_real_model": true }');
      gap();

      sec("REPRODUCIBILITY CHECKLIST (JUDGE STEPS — UNDER 10 MINUTES)");
      bul("Step 1 — Clone: git clone <repo-url> && cd krishidrishti");
      bul("Step 2 — Install: pip install torch torchvision Pillow  (or: cd backend && pip install -r requirements.txt)");
      bul("Step 3 — CLI predict: python model/predict.py --image path/to/leaf.jpg");
      bul("Step 4 — JSON predict: python model/predict.py --image path/to/leaf.jpg --json");
      bul("Step 5 — Train crop model: python backend/train_crop.py --csv backend/crop_recommendation.csv");
      bul("Step 6 — Set env: cp backend/.env.example backend/.env  (set MONGODB_URI, JWT_SECRET, LLM_API_KEY, PLANTNET_API_KEY)");
      bul("Step 7 — Start API: cd backend && uvicorn main:app --reload --port 8000  →  http://localhost:8000/docs");
      bul("Step 8 — Frontend: cd krishidrishti_frontend && npm install && npm run dev  →  http://localhost:3000");
      bul("Total time from clone to first prediction: < 10 minutes. No GPU required.");
      gap();

      sec("REPOSITORY STRUCTURE (SECTION 7.1 COMPLIANCE)");
      bul("README.md — entry point with all required sections (modules built, setup, dataset, metrics, architecture, limitations, demo link).");
      bul("backend/main.py — all 7 modules (A–G) in one FastAPI app.");
      bul("backend/models/krishidrishti_efficientnet_b0_final.pth — EfficientNet-B0 weights (38 classes).");
      bul("backend/models/crop_model.pkl — RandomForest crop recommendation model.");
      bul("backend/train_crop.py — Module A training script (run to reproduce metrics).");
      bul("backend/requirements.txt — all Python dependencies.");
      bul("backend/.env.example — environment variable template.");
      bul("model/predict.py — Section 4.1 CLI + Python API predict interface.");
      bul("report/MODEL_REPORT.md — Section 7.3 one-page model report.");
      bul("ai model/core.ipynb — training notebook with output cells (confusion matrix, per-class metrics).");
      bul("docs/USER_MANUAL.md — user manual (Markdown source).");
      bul("docs/EVALUATOR_MANUAL.md — evaluator manual (Markdown source).");
      bul("render.yaml — Render deployment config.");
      bul("runtime.txt — Python 3.11.9.");
      gap();

      sec("ENVIRONMENT VARIABLES");
      row("LLM_API_KEY", "Groq API key — Module E LLM responses. Falls back to curated KB if absent.");
      row("MONGODB_URI", "MongoDB Atlas connection string — auth + history persistence. Works without it.");
      row("JWT_SECRET", "JWT signing key — auth tokens.");
      row("PLANTNET_API_KEY", "PlantNet plant validation — non-leaf rejection. Fails open (allows prediction) if absent.");
      gap();

      sec("DATA & LICENCE COMPLIANCE");
      row("PlantVillage", "spMohanty/PlantVillage-Dataset — CC BY 4.0 — train/validation only, never test");
      row("Crop Recommendation", "Atharva Ingle, Kaggle — CC0 Public Domain — Module A training");
      row("Open-Meteo", "open-meteo.com — CC BY 4.0 — live weather, no API key required");
      row("PyTorch/torchvision", "BSD licence — model training and inference");
      row("FastAPI", "MIT licence — REST API framework");
      row("Next.js", "MIT licence — frontend framework");
      row("scikit-learn", "BSD licence — crop recommendation model");
      row("Groq API", "Llama-3.3-70B — LLM inference for assistant");
      row("Originality", "All model training, evaluation, and system integration performed by team. AI coding assistants used for boilerplate only. No public notebooks copied wholesale.");
      gap();

      sec("KNOWN LIMITATIONS (HONEST DISCLOSURE — SECTION 7.3)");
      bul("Lab-to-field domain gap: validation F1 = 0.9634 on clean PlantVillage; field-condition accuracy expected ~0.75–0.85 on PlantDoc-style images with clutter and variable lighting.");
      bul("38-class scope: only PlantVillage-supported crop/disease combinations. Unsupported crops trigger uncertainty guard, not silent wrong prediction.");
      bul("Single-leaf assumption: multi-leaf or whole-plant images reduce confidence.");
      bul("Groq LLM requires API key; system falls back to curated KB when key is absent (llm_used: false).");
      bul("IoT sensor feed is simulated (stateful, day/night cycle) — physical hardware not deployed.");
      bul("Render free-tier backend may have cold-start delay of ~30–60 seconds on first request after inactivity.");

      footer();
      doc.save("KrishiDrishti_Evaluator_Manual_C433.pdf");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "hero") {
    return (
      <button onClick={generate} disabled={loading} className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-800 shadow-xs hover:bg-stone-50 transition-all">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardList className="h-4 w-4 text-emerald-700" />}
        <span>{loading ? "Generating..." : "Evaluator Manual"}</span>
      </button>
    );
  }
  return (
    <button onClick={generate} disabled={loading} className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-100/80 transition-colors">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ClipboardList className="h-3.5 w-3.5 text-emerald-700" />}
      <span className="hidden sm:inline">Evaluator Manual</span>
    </button>
  );
}
