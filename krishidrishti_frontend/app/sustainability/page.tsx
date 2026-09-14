"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SimulationBadge } from "@/components/common/StatCard";
import { PageLoader } from "@/components/common/Loader";
import {
  Leaf, Award, Droplets, FlaskConical, Sprout, Zap, RefreshCw, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { DownloadReportButton } from "@/components/common/DownloadReportButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface PillarData {
  title: string;
  score: number;
  icon: React.ElementType;
  color: string;
  recommendations: string[];
}

interface ReportState {
  overallScore: number;
  grade: string;
  waterSavedLiters: number;
  carbonOffsetKg: number;
  pillars: PillarData[];
  band: string;
}

const DEFAULT_FORM = {
  water_used_liters: 1800,
  water_optimal_liters: 1400,
  fertilizer_used_kg: 50,
  fertilizer_recommended_kg: 45,
};

export default function SustainabilityPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [report, setReport] = useState<ReportState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch live soil moisture for crop_health
      let cropHealth = 0.65; // fallback
      try {
        const sensorRes = await fetch(`${API_BASE_URL}/sensor-feed?n=1`);
        if (sensorRes.ok) {
          const sensorData = await sensorRes.json();
          cropHealth = Math.min(1, sensorData.latest.soil_moisture / 100);
        }
      } catch {}

      const payload = {
        water_used_liters: form.water_used_liters,
        water_optimal_liters: form.water_optimal_liters,
        fertilizer_used_kg: form.fertilizer_used_kg,
        fertilizer_recommended_kg: form.fertilizer_recommended_kg,
        crop_health: cropHealth,
      };

      const res = await fetch(`${API_BASE_URL}/sustainability-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      const waterEff: number = data.breakdown.water_efficiency;
      const fertEff: number = data.breakdown.fertilizer_efficiency;
      const health: number = data.breakdown.crop_health;

      const waterSaved = Math.max(0, form.water_used_liters - form.water_optimal_liters);
      const fertSaved = Math.max(0, form.fertilizer_used_kg - form.fertilizer_recommended_kg);

      const pillars: PillarData[] = [
        {
          title: "Water Conservation & Precision",
          score: Math.round(waterEff * 100),
          icon: Droplets,
          color: "sky",
          recommendations: waterEff >= 0.8
            ? [`Water usage is efficient — ${waterSaved.toLocaleString()}L saved vs optimal baseline.`, "Maintain current drip/scheduled irrigation practices."]
            : [`Water used (${form.water_used_liters.toLocaleString()}L) exceeds optimal (${form.water_optimal_liters.toLocaleString()}L) by ${waterSaved.toLocaleString()}L.`, "Switch to drip irrigation or timed solenoid scheduling to reduce waste.", ...data.suggestions.filter((s: string) => s.toLowerCase().includes("water"))],
        },
        {
          title: "Chemical & Fertilizer Rationalization",
          score: Math.round(fertEff * 100),
          icon: FlaskConical,
          color: "amber",
          recommendations: fertEff >= 0.8
            ? [`Fertilizer application (${form.fertilizer_used_kg}kg) is close to recommended (${form.fertilizer_recommended_kg}kg).`, "Continue soil-test-based precision fertilization."]
            : [`Fertilizer over-applied by ${fertSaved}kg vs recommended dose.`, "Reduce synthetic inputs — use split application and soil testing.", ...data.suggestions.filter((s: string) => s.toLowerCase().includes("fertilizer"))],
        },
        {
          title: "Soil & Crop Health Index",
          score: Math.round(health * 100),
          icon: Sprout,
          color: "emerald",
          recommendations: health >= 0.8
            ? [`Live soil moisture at ${Math.round(health * 100)}% — crop health is optimal.`, "Maintain consistent root-zone moisture monitoring."]
            : [`Soil moisture at ${Math.round(health * 100)}% — below optimal crop health threshold.`, "Improve irrigation scheduling and monitor for disease stress.", ...data.suggestions.filter((s: string) => s.toLowerCase().includes("health") || s.toLowerCase().includes("crop"))],
        },
        {
          title: "Crop Diversity & Rotation",
          score: 75,
          icon: Leaf,
          color: "green",
          recommendations: ["Maintain rotation across at least 2 distinct botanical families.", "Add a cover crop (Dhaincha / Sunn hemp) during fallow season to fix nitrogen."],
        },
        {
          title: "Energy & Resource Efficiency",
          score: Math.round(data.score),
          icon: Zap,
          color: "violet",
          recommendations: ["Optimize pump scheduling for off-peak solar hours.", "Solar-powered irrigation reduces carbon footprint significantly."],
        },
      ];

      const grade = data.score >= 75 ? "A" : data.score >= 60 ? "B" : data.score >= 45 ? "C" : "D";

      setReport({
        overallScore: data.score,
        grade,
        band: data.band,
        waterSavedLiters: waterSaved,
        carbonOffsetKg: Math.round(data.score * 16),
        pillars,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to calculate sustainability score.");
    } finally {
      setLoading(false);
    }
  };

  const colorMap: Record<string, string> = {
    sky: "bg-sky-600",
    amber: "bg-amber-500",
    emerald: "bg-emerald-600",
    green: "bg-green-600",
    violet: "bg-violet-600",
  };

  const iconBgMap: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    green: "bg-green-50 text-green-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <Leaf className="h-6 w-6 text-emerald-700" />
                Farm Sustainability & ESG Indices
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Enter your actual resource usage to compute a live sustainability score from the backend engine.
            </p>
          </div>
          {report && (
            <DownloadReportButton
              reportTitle="Farm Sustainability Report"
              getData={() => ({
                overallScore: `${report.overallScore}/100`,
                grade: report.grade,
                band: report.band,
                waterSaved: `${report.waterSavedLiters.toLocaleString()} L`,
                carbonOffsetEstimate: `${report.carbonOffsetKg.toLocaleString()} kg CO₂`,
                inputs: form,
                pillars: report.pillars.map((p) => ({
                  title: p.title,
                  score: `${p.score}%`,
                  recommendations: p.recommendations,
                })),
              })}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Input Form */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
            <h2 className="font-semibold text-stone-900 text-sm mb-4 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-emerald-700" />
              Resource Usage Inputs
            </h2>

            <form onSubmit={calculate} className="space-y-4 text-xs">
              <div className="space-y-3 pb-3 border-b border-stone-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Water</p>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Water Used (Liters): <span className="text-sky-700 font-bold">{form.water_used_liters.toLocaleString()}</span>
                  </label>
                  <input
                    type="range" min="500" max="5000" step="100"
                    value={form.water_used_liters}
                    onChange={(e) => setForm({ ...form, water_used_liters: Number(e.target.value) })}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Optimal Water (Liters): <span className="text-sky-700 font-bold">{form.water_optimal_liters.toLocaleString()}</span>
                  </label>
                  <input
                    type="range" min="300" max="4000" step="100"
                    value={form.water_optimal_liters}
                    onChange={(e) => setForm({ ...form, water_optimal_liters: Number(e.target.value) })}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3 pb-3 border-b border-stone-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Fertilizer</p>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Fertilizer Used (kg): <span className="text-amber-700 font-bold">{form.fertilizer_used_kg}</span>
                  </label>
                  <input
                    type="range" min="10" max="150" step="1"
                    value={form.fertilizer_used_kg}
                    onChange={(e) => setForm({ ...form, fertilizer_used_kg: Number(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Recommended Dose (kg): <span className="text-amber-700 font-bold">{form.fertilizer_recommended_kg}</span>
                  </label>
                  <input
                    type="range" min="10" max="150" step="1"
                    value={form.fertilizer_recommended_kg}
                    onChange={(e) => setForm({ ...form, fertilizer_recommended_kg: Number(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <p className="text-[11px] text-stone-400 italic">
                Crop health is fetched live from the IoT sensor feed.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 transition-colors text-xs shadow-xs cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Calculating...</>
                ) : (
                  <><Leaf className="h-4 w-4" /> Calculate Score</>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            {loading && !report && (
              <PageLoader message="Evaluating sustainability indices..." />
            )}

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!report && !loading && !error && (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <Leaf className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-semibold text-stone-800 text-sm">Awaiting Input</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Enter your water and fertilizer usage on the left, then click Calculate Score.
                </p>
              </div>
            )}

            {report && (
              <>
                {/* Overall Score */}
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-stone-50 p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                        <Award className="h-4 w-4" />
                        <span>Overall Ecological Farm Rating</span>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="text-5xl font-black tracking-tight text-emerald-900">
                          {report.overallScore}
                        </span>
                        <span className="text-stone-500 font-medium">/ 100</span>
                        <span className="rounded-md bg-emerald-700 text-white font-bold text-sm px-2.5 py-0.5">
                          Grade {report.grade}
                        </span>
                        <span className={`rounded-md text-white font-bold text-xs px-2 py-0.5 ${
                          report.band === "high" ? "bg-emerald-600" : report.band === "medium" ? "bg-amber-500" : "bg-rose-600"
                        }`}>
                          {report.band.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 max-w-md">
                        Score computed live from your resource inputs and real-time IoT soil moisture sensor.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t sm:border-t-0 sm:border-l border-emerald-200/85 pt-4 sm:pt-0 sm:pl-6">
                      <div>
                        <span className="text-xs text-stone-500 block">Water Saved</span>
                        <span className="text-xl font-bold text-stone-900">
                          {report.waterSavedLiters.toLocaleString()} L
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium block">vs Your Usage</span>
                      </div>
                      <div>
                        <span className="text-xs text-stone-500 block">Carbon Offset Est.</span>
                        <span className="text-xl font-bold text-stone-900">
                          {report.carbonOffsetKg.toLocaleString()} kg
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium block">CO₂ Equivalent</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.pillars.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <div key={pillar.title} className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBgMap[pillar.color]}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <h3 className="text-sm font-semibold text-stone-900">{pillar.title}</h3>
                          </div>
                          <span className="text-sm font-bold text-emerald-800">{pillar.score}%</span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${colorMap[pillar.color]}`}
                            style={{ width: `${pillar.score}%` }}
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {pillar.recommendations.map((rec, i) => (
                            <div key={i} className="text-xs text-stone-600 flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
