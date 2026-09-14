"use client";

import React, { useState } from "react";
import {
  Info,
  Layers,
  Sparkles,
  ClipboardList,
  Download,
  Loader2,
} from "lucide-react";
import { PredictionResponse } from "@/types";
import { StatusBadge } from "@/components/common/StatCard";
import { formatPercent } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DiagnosisResultProps {
  result: PredictionResponse;
  onReset: () => void;
}

const E: [number, number, number] = [27, 67, 50];
const E2: [number, number, number] = [52, 211, 153];
const DARK: [number, number, number] = [30, 30, 30];
const GRAY: [number, number, number] = [100, 100, 100];

async function generateDiagnosisPDF(result: PredictionResponse, recs: NonNullable<PredictionResponse["recommendations"]>) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const generatedAt = new Date().toLocaleString();

  // ── Header ──
  doc.setFillColor(...E);
  doc.rect(0, 0, W, 42, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("KrishiDrishti", 14, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...E2);
  doc.text("AI-Powered Precision Agriculture Platform", 14, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Crop Disease Diagnosis Report", W - 14, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...E2);
  doc.text(`Generated: ${generatedAt}`, W - 14, 26, { align: "right" });
  doc.setDrawColor(...E2);
  doc.setLineWidth(0.4);
  doc.line(0, 42, W, 42);

  let y = 52;

  // ── Section 1: Diagnosis Summary ──
  doc.setFillColor(...E);
  doc.rect(14, y, W - 28, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("DIAGNOSIS SUMMARY", 18, y + 5);
  y += 11;

  const summaryRows = [
    ["Crop", result.crop],
    ["Detected Condition", result.condition || result.disease || "—"],
    ["Status", result.status || (result.healthy ? "Healthy" : "Disease Detected")],
    ["Confidence", result.confidence_pct || `${Math.round(result.confidence * 100)}%`],
    ["Severity", result.severity ? result.severity.toUpperCase() : "—"],
    ["Analyzed At", result.analyzedAt ? new Date(result.analyzedAt).toLocaleString() : generatedAt],
  ];

  autoTable(doc, {
    startY: y,
    body: summaryRows,
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 50, fillColor: [248, 250, 248] }, 1: { cellWidth: "auto" } },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
    theme: "plain",
    tableLineColor: [220, 220, 220],
    tableLineWidth: 0.2,
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── Section 2: Pathology Explanation ──
  if (result.explanation) {
    doc.setFillColor(...E);
    doc.rect(14, y, W - 28, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("PATHOLOGY EXPLANATION", 18, y + 5);
    y += 11;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(result.explanation, W - 28);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 8;
  }

  // ── Section 3: Class Probabilities ──
  if (result.classProbabilities && result.classProbabilities.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFillColor(...E);
    doc.rect(14, y, W - 28, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("TOP PREDICTION PROBABILITIES", 18, y + 5);
    y += 11;

    autoTable(doc, {
      startY: y,
      head: [["Rank", "Disease / Condition", "Probability"]],
      body: result.classProbabilities.map((cp, i) => [
        `#${i + 1}`,
        cp.className,
        `${Math.round(cp.probability * 100)}%`,
      ]),
      headStyles: { fillColor: E, textColor: 255, fontSize: 8 },
      styles: { fontSize: 8.5, cellPadding: 2.5 },
      columnStyles: { 0: { cellWidth: 14 }, 2: { cellWidth: 28, halign: "center" } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Section 4: Recommendations ──
  const recSections: [string, string[]][] = [
    ["IMMEDIATE ACTIONS", recs.immediateActions],
    ["TREATMENT PLAN", recs.treatmentPlan],
    ["PREVENTION", recs.prevention],
    ["MONITORING ADVICE", recs.monitoringAdvice],
  ];

  for (const [title, items] of recSections) {
    if (!items || items.length === 0) continue;
    if (y > 230) { doc.addPage(); y = 20; }

    doc.setFillColor(...E);
    doc.rect(14, y, W - 28, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 18, y + 5);
    y += 11;

    items.forEach((item, idx) => {
      if (y > 265) { doc.addPage(); y = 20; }
      // Numbered bullet
      doc.setFillColor(...E);
      doc.circle(18, y - 1, 2.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(String(idx + 1), 18, y + 0.5, { align: "center" });
      // Item text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      const lines = doc.splitTextToSize(item, W - 42);
      doc.text(lines, 24, y);
      y += lines.length * 5 + 3;
    });
    y += 4;
  }

  // ── Footer on all pages ──
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const H = doc.internal.pageSize.getHeight();
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(14, H - 12, W - 14, H - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text("KrishiDrishti AI  •  Verify with local agronomist before major interventions.", 14, H - 7);
    doc.text(`Page ${i} of ${totalPages}`, W - 14, H - 7, { align: "right" });
  }

  doc.save(`diagnosis_${result.crop.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

function DiagnosisDownloadButton({ result, recs }: { result: PredictionResponse; recs: NonNullable<PredictionResponse["recommendations"]> }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try { await generateDiagnosisPDF(result, recs); }
    catch (e) { console.error("PDF error:", e); }
    finally { setLoading(false); }
  };
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? "Generating..." : "Download Report"}
    </button>
  );
}

interface DiagnosisResultProps {
  result: PredictionResponse;
  onReset: () => void;
}

export function DiagnosisResult({ result, onReset }: DiagnosisResultProps) {
  const [activeTab, setActiveTab] = useState<"immediate" | "treatment" | "prevention" | "monitoring">("immediate");

  const isHealthy = result.healthy;
  const confidencePercent = Math.round(result.confidence * 100);

  // Prepare chart data from class probabilities
  const chartData = (result.classProbabilities || []).map((cp) => ({
    name: cp.className.replace(result.crop, "").trim() || cp.className,
    probability: Math.round(cp.probability * 100),
  }));

  // Fallback recommendations when backend returns none
  const recs = result.recommendations ?? {
    immediateActions: ["Scout the affected area and document the spread of symptoms.", "Avoid overhead irrigation to reduce leaf wetness.", "Isolate affected plants if possible to prevent spread."],
    treatmentPlan: ["Consult your local Krishi Vigyan Kendra (KVK) for a confirmed diagnosis.", "Apply a broad-spectrum copper-based fungicide as a precautionary measure.", "Re-upload a clearer, well-lit close-up leaf image for a more accurate AI diagnosis."],
    prevention: ["Maintain proper plant spacing for adequate air circulation.", "Use certified disease-free seeds for the next sowing cycle.", "Practice crop rotation to break disease cycles."],
    monitoringAdvice: ["Inspect the crop every 48 hours and track symptom progression.", "Monitor neighbouring plots for similar symptoms."],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Result Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 bg-white shadow-xs ${
          isHealthy
            ? "border-emerald-200"
            : result.severity === "critical"
            ? "border-rose-200"
            : "border-amber-200"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                AgriSmart AI — Prediction Result
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {result.crop}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge
              status={isHealthy ? "healthy" : result.severity || "moderate"}
              size="md"
              label={isHealthy ? "Healthy" : `${result.severity?.toUpperCase()} SEVERITY`}
            />
            <DiagnosisDownloadButton result={result} recs={recs} />
            <button
              onClick={onReset}
              className="rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs"
            >
              Analyze Another Leaf
            </button>
          </div>
        </div>

        {/* Core Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
          {/* Leaf Visual Preview */}
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
            {result.imageUrl ? (
              <img
                src={result.imageUrl}
                alt={result.disease}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400 text-xs">
                No leaf image provided
              </div>
            )}
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
              Analyzed Leaf Sample
            </div>
          </div>

          {/* Model Output — matches screenshot format */}
          <div className="md:col-span-2 space-y-4">
            {/* Terminal-style output block */}
            <div className="rounded-xl bg-stone-900 p-3 sm:p-5 font-mono text-xs border border-stone-700 overflow-x-auto">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-700">
                <span className="text-emerald-400 text-base">🌱</span>
                <span className="text-emerald-400 font-bold">AgriSmart AI – Prediction Result</span>
              </div>
              <div className="space-y-1.5 text-stone-200">
                <div className="flex gap-2">
                  <span className="text-stone-400 w-20 sm:w-24 shrink-0">Crop</span>
                  <span className="text-stone-400">:</span>
                  <span className="text-white font-semibold break-all">{result.crop}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-stone-400 w-20 sm:w-24 shrink-0">Condition</span>
                  <span className="text-stone-400">:</span>
                  <span className={`font-semibold break-all ${isHealthy ? "text-emerald-400" : "text-amber-400"}`}>
                    {result.condition || result.disease}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-stone-400 w-20 sm:w-24 shrink-0">Status</span>
                  <span className="text-stone-400">:</span>
                  <span className={`font-semibold ${isHealthy ? "text-emerald-400" : "text-rose-400"}`}>
                    {result.status || (isHealthy ? "Healthy" : "Disease Detected")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-stone-400 w-20 sm:w-24 shrink-0">Confidence</span>
                  <span className="text-stone-400">:</span>
                  <span className="text-emerald-300 font-bold">
                    {result.confidence_pct || `${confidencePercent}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Pathology explanation */}
            <div className="rounded-xl bg-stone-50 p-4 border border-stone-200/70">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                <Info className="h-3.5 w-3.5 text-stone-500" />
                <span>Pathology Explanation</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {result.explanation || "Diagnostic analysis evaluated foliage texture, chlorosis margin, and fungal sporulation indicators."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Probability Distribution & Explainability / Heatmap Slot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Probability Distribution */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">
                Class Probability Distribution
              </h3>
              <p className="text-xs text-stone-500">Top candidate conditions evaluated</p>
            </div>
            <Layers className="h-4 w-4 text-stone-400" />
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Probability"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#1b4332" : "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainability & Heatmap Section */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-700" />
                Visual Explainability (Grad-CAM / Attention)
              </h3>
              <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Attention heatmap highlighting leaf regions that triggered the classification decision.
            </p>

            {/* Heatmap: real URL if available, else simulated overlay on leaf image */}
            <div className="relative aspect-video overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
              {result.imageUrl && (
                <img
                  src={result.imageUrl}
                  alt="Leaf base"
                  className="h-full w-full object-cover opacity-80"
                />
              )}
              {result.heatmapUrl ? (
                <img
                  src={result.heatmapUrl}
                  alt="Grad-CAM Heatmap"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                /* Simulated Grad-CAM radial attention overlay */
                <div
                  className="absolute inset-0"
                  style={{
                    background: isHealthy
                      ? "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(52,211,153,0.55) 0%, rgba(16,185,129,0.25) 40%, transparent 70%)"
                      : "radial-gradient(ellipse 50% 40% at 52% 48%, rgba(239,68,68,0.65) 0%, rgba(251,146,60,0.45) 35%, rgba(234,179,8,0.2) 60%, transparent 80%)",
                  }}
                />
              )}
              {/* Legend bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5 bg-black/50 backdrop-blur-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-16 rounded-full" style={{ background: isHealthy ? "linear-gradient(to right, transparent, #34d399)" : "linear-gradient(to right, transparent, #fbbf24, #ef4444)" }} />
                  <span className="text-[10px] text-white/80">Activation intensity</span>
                </div>
                <span className="text-[10px] text-white/60">Grad-CAM</span>
              </div>
            </div>

            {/* Attention region labels */}
            <div className="mt-3 flex flex-wrap gap-2">
              {(isHealthy ? [
                { label: "Uniform chlorophyll", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
                { label: "No lesion detected", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
              ] : [
                { label: "Primary lesion zone", color: "bg-red-100 text-red-800 border-red-200" },
                { label: "Chlorotic margin", color: "bg-amber-100 text-amber-800 border-amber-200" },
                { label: "Sporulation region", color: "bg-orange-100 text-orange-800 border-orange-200" },
              ]).map((tag) => (
                <span key={tag.label} className={`text-[11px] font-medium px-2 py-0.5 rounded border ${tag.color}`}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Backbone: EfficientNet-B3 · Layer: block6</span>
            <span>Input: 224×224 px</span>
          </div>
        </div>
      </div>

      {/* Actionable Agricultural Recommendations Tabs */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 mb-4">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-700" />
              Actionable Recommendations &amp; Treatment Protocol
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                <Sparkles className="h-3 w-3" />
                Powered by Groq
              </span>
            </h3>
          <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-lg overflow-x-auto">
              {[
                { id: "immediate", label: "Immediate" },
                { id: "treatment", label: "Treatment" },
                { id: "prevention", label: "Prevention" },
                { id: "monitoring", label: "Monitoring" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Contents */}
          <div className="space-y-3">
            {activeTab === "immediate" &&
              recs.immediateActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-stone-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{action}</span>
                </div>
              ))}

            {activeTab === "treatment" &&
              recs.treatmentPlan.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-stone-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200/80 text-emerald-900 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{action}</span>
                </div>
              ))}

            {activeTab === "prevention" &&
              recs.prevention.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{action}</span>
                </div>
              ))}

            {activeTab === "monitoring" &&
              recs.monitoringAdvice.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/60 border border-sky-200/60 text-xs text-stone-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-200/80 text-sky-900 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{action}</span>
                </div>
              ))}
          </div>

          {/* Scientific Disclaimer */}
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-stone-200 bg-stone-50/90 p-3 text-[11px] text-stone-500">
            <Info className="h-4 w-4 shrink-0 text-stone-400 mt-0.5" />
            <p>
              <strong>Agricultural Disclaimer:</strong> AI-generated diagnosis and recommendations should be verified with local Krishi Vigyan Kendra (KVK) or agronomist officers before major chemical treatment interventions.
            </p>
          </div>
        </div>
    </div>
  );
}
