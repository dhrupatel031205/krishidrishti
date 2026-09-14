"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getCropRecommendations } from "@/lib/api/client";
import { CropRecommendationInput, CropRecommendationResult } from "@/types";
import { SimulationBadge } from "@/components/common/StatCard";
import {
  Compass,
  Sparkles,
  Droplets,
  Calendar,
  ShieldAlert,
  CheckCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function RecommendationsPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<CropRecommendationInput>({
    soilType: "Loamy Soil",
    nitrogen: 65,
    phosphorus: 42,
    potassium: 38,
    ph: 6.8,
    temperature: 24,
    humidity: 68,
    rainfall: 140,
    location: "Karnal, Haryana",
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendationResult[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await getCropRecommendations(form);
      setRecommendations(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <Compass className="h-6 w-6 text-emerald-700" />
                {t("recTitle")}
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {t("recDesc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form Parameters */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs lg:col-span-1">
            <h2 className="font-semibold text-stone-900 text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-700" />
              {t("soilParamsTitle")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">{t("soilType")}</label>
                <select
                  value={form.soilType}
                  onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-800 bg-white focus:outline-hidden"
                >
                  <option value="Loamy Soil">{t("loamySoil")}</option>
                  <option value="Clayey Loam">{t("clayeyLoam")}</option>
                  <option value="Sandy Loam">{t("sandyLoam")}</option>
                  <option value="Black Cotton Soil">{t("blackCotton")}</option>
                </select>
              </div>

              {/* NPK Sliders */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex justify-between items-center text-stone-700 font-medium">
                  <span>{t("nitrogen")}: {form.nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="140"
                  value={form.nitrogen}
                  onChange={(e) => setForm({ ...form, nitrogen: Number(e.target.value) })}
                  className="w-full accent-emerald-700 cursor-pointer"
                />

                <div className="flex justify-between items-center text-stone-700 font-medium">
                  <span>{t("phosphorus")}: {form.phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={form.phosphorus}
                  onChange={(e) => setForm({ ...form, phosphorus: Number(e.target.value) })}
                  className="w-full accent-emerald-700 cursor-pointer"
                />

                <div className="flex justify-between items-center text-stone-700 font-medium">
                  <span>{t("potassium")}: {form.potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={form.potassium}
                  onChange={(e) => setForm({ ...form, potassium: Number(e.target.value) })}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              {/* pH & Thermal */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t("soilPh")} ({form.ph})</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.5"
                    max="9.0"
                    value={form.ph}
                    onChange={(e) => setForm({ ...form, ph: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t("temp")}</label>
                  <input
                    type="number"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t("humidity")}</label>
                  <input
                    type="number"
                    value={form.humidity}
                    onChange={(e) => setForm({ ...form, humidity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t("rainfall")}</label>
                  <input
                    type="number"
                    value={form.rainfall}
                    onChange={(e) => setForm({ ...form, rainfall: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 transition-colors mt-4 text-xs shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t("evaluatingBtn")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{t("calcBtn")}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recommendation Results List */}
          <div className="lg:col-span-2 space-y-4">
            {!recommendations ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <Compass className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-semibold text-stone-800 text-sm">
                  {t("awaitingTitle")}
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  {t("awaitingDesc")}
                </p>
              </div>
            ) : (
              recommendations.map((crop, idx) => (
                <div
                  key={crop.id}
                  className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs hover:border-emerald-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          #{idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-stone-900">
                          {crop.cropName}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {t("projectedYield")}: <strong className="text-stone-700">{crop.expectedYield}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-800">
                          {crop.suitabilityScore}%
                        </div>
                        <div className="text-[10px] text-stone-400 font-medium uppercase">
                          {t("suitability")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                    {crop.reason}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 rounded-xl text-[11px] text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-sky-600" />
                      <span>{t("waterReq")}: <strong>{crop.waterRequirement}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-amber-600" />
                      <span>{t("growthCycle")}: <strong>{crop.growthDurationDays} {t("days")}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{t("sustainabilityRating")}: <strong>{crop.sustainabilityRating}/100</strong></span>
                    </div>
                  </div>

                  {/* Advantages list */}
                  <div className="mt-3 space-y-1 text-xs">
                    {crop.advantages.map((adv, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2 text-stone-700">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
