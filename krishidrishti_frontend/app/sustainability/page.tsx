"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchSustainabilityReport } from "@/lib/api/client";
import { SustainabilityReport } from "@/types";
import { StatCard, SimulationBadge } from "@/components/common/StatCard";
import {
  Leaf,
  Droplets,
  Sprout,
  ShieldCheck,
  Zap,
  Info,
  Award,
  ChevronRight,
} from "lucide-react";

export default function SustainabilityPage() {
  const [report, setReport] = useState<SustainabilityReport | null>(null);

  useEffect(() => {
    fetchSustainabilityReport().then(setReport);
  }, []);

  if (!report) {
    return (
      <AppShell>
        <div className="p-12 text-center text-stone-400">Evaluating sustainability indices...</div>
      </AppShell>
    );
  }

  const pillars = Object.entries(report.pillars);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
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
              Quantifying ecological balance across water conservation, chemical rationalization, soil organic matter, and carbon offsets.
            </p>
          </div>
        </div>

        {/* Big Overall Score Card */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-stone-50 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <Award className="h-4 w-4" />
                <span>Overall Ecological Farm Rating</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black tracking-tight text-emerald-900">
                  {report.overallScore}
                </span>
                <span className="text-stone-500 font-medium">/ 100</span>
                <span className="rounded-md bg-emerald-700 text-white font-bold text-sm px-2.5 py-0.5">
                  Grade {report.grade}
                </span>
              </div>
              <p className="text-xs text-stone-600 max-w-md">
                Your farm ranks in the top 12% for precision resource management in the Karnal agricultural district.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-emerald-200/85 pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-xs text-stone-500 block">Water Conserved</span>
                <span className="text-xl font-bold text-stone-900">
                  {report.waterSavedLiters.toLocaleString()} L
                </span>
                <span className="text-[11px] text-emerald-700 font-medium block">vs Flood Baseline</span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">Carbon Sequestration</span>
                <span className="text-xl font-bold text-stone-900">
                  {report.carbonOffsetEstimateKg.toLocaleString()} kg
                </span>
                <span className="text-[11px] text-emerald-700 font-medium block">CO₂ Equivalent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown of the 5 Pillars */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-stone-900">
            Pillar Performance & Field Optimization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map(([key, pillar]) => (
              <div
                key={key}
                className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-900">
                    {pillar.title}
                  </h3>
                  <span className="text-sm font-bold text-emerald-800">
                    {pillar.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  {pillar.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
