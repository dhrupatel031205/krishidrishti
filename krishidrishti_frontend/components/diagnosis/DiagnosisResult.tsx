"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
  ClipboardList,
  Calendar,
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
            <div className="rounded-xl bg-stone-900 p-5 font-mono text-sm border border-stone-700">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-700">
                <span className="text-emerald-400 text-base">🌱</span>
                <span className="text-emerald-400 font-bold">AgriSmart AI – Prediction Result</span>
              </div>
              <div className="space-y-1.5 text-stone-200">
                <div className="flex gap-2">
                  <span className="text-stone-400 w-24 shrink-0">Crop</span>
                  <span className="text-stone-400">:</span>
                  <span className="text-white font-semibold">{result.crop}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-stone-400 w-24 shrink-0">Condition</span>
                  <span className="text-stone-400">:</span>
                  <span className={`font-semibold ${isHealthy ? "text-emerald-400" : "text-amber-400"}`}>
                    {(result as any).condition || result.disease}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-stone-400 w-24 shrink-0">Status</span>
                  <span className="text-stone-400">:</span>
                  <span className={`font-semibold ${isHealthy ? "text-emerald-400" : "text-rose-400"}`}>
                    {(result as any).status || (isHealthy ? "Healthy" : "Disease Detected")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-stone-400 w-24 shrink-0">Confidence</span>
                  <span className="text-stone-400">:</span>
                  <span className="text-emerald-300 font-bold">
                    {(result as any).confidence_pct || `${confidencePercent}%`}
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

        {/* Explainability & Heatmap Section (Architecture Slot) */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-700" />
                Visual Explainability (Grad-CAM / Attention)
              </h3>
              <span className="text-[10px] uppercase font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                API Slot
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Visual attention highlighting leaf sections that triggered classification.
            </p>

            {result.heatmapUrl ? (
              <div className="aspect-16/9 overflow-hidden rounded-xl border border-stone-200">
                <img
                  src={result.heatmapUrl}
                  alt="Grad-CAM Heatmap"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50/70 p-8 text-center min-h-[140px]">
                <Layers className="h-8 w-8 text-stone-300 mb-2" />
                <p className="text-xs font-medium text-stone-600">
                  Visual explanation will appear here when enabled
                </p>
                <p className="text-[11px] text-stone-400 mt-1 max-w-xs">
                  Backend Grad-CAM activation map container ready for model output.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Model Backbone: ResNet50 / MobileNetV3</span>
            <span>Input Size: 224x224 px</span>
          </div>
        </div>
      </div>

      {/* Actionable Agricultural Recommendations Tabs */}
      {result.recommendations && (
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-700" />
              Actionable Recommendations & Treatment Protocol
            </h3>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
              {[
                { id: "immediate", label: "Immediate Actions" },
                { id: "treatment", label: "Treatment Plan" },
                { id: "prevention", label: "Prevention" },
                { id: "monitoring", label: "Monitoring" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
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
              result.recommendations.immediateActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-stone-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{action}</span>
                </div>
              ))}

            {activeTab === "treatment" &&
              result.recommendations.treatmentPlan.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-stone-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200/80 text-emerald-900 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{action}</span>
                </div>
              ))}

            {activeTab === "prevention" &&
              result.recommendations.prevention.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{action}</span>
                </div>
              ))}

            {activeTab === "monitoring" &&
              result.recommendations.monitoringAdvice.map((action, idx) => (
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
      )}
    </div>
  );
}
