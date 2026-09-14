"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchIrrigationStatus } from "@/lib/api/client";
import { IrrigationStatus } from "@/types";
import { StatCard, SimulationBadge } from "@/components/common/StatCard";
import {
  Droplets, Clock, Waves, Gauge, AlertTriangle,
  PlayCircle, PauseCircle, RefreshCw, CloudRain, Sprout,
} from "lucide-react";
import { PageLoader, InlineLoader } from "@/components/common/Loader";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

const GROWTH_STAGES = [
  { value: "seedling",   label: "Seedling",   threshold: 40, desc: "0–2 weeks" },
  { value: "vegetative", label: "Vegetative", threshold: 50, desc: "2–6 weeks" },
  { value: "flowering",  label: "Flowering",  threshold: 60, desc: "6–10 weeks" },
  { value: "maturity",   label: "Maturity",   threshold: 35, desc: "10+ weeks" },
];

export default function IrrigationPage() {
  const [data, setData] = useState<IrrigationStatus | null>(null);
  const [growthStage, setGrowthStage] = useState("vegetative");
  const [loading, setLoading] = useState(false);
  const [irrigationActive, setIrrigationActive] = useState(false);
  const [irrigationTimer, setIrrigationTimer] = useState(0);

  const dataRef = React.useRef<IrrigationStatus | null>(null);

  const load = useCallback(async (stage: string, forceRefresh = false) => {
    // If only the stage changed (not a manual refresh), keep existing moisture
    // and just recalculate thresholds locally — avoids random sensor drift on stage switch
    if (!forceRefresh && dataRef.current) {
      const threshold = GROWTH_STAGES.find((s) => s.value === stage)!.threshold;
      setData((prev) =>
        prev
          ? {
              ...prev,
              targetMoistureMin: threshold - 10,
              targetMoistureMax: threshold + 15,
              status:
                prev.currentMoisture < threshold
                  ? "needs_water"
                  : prev.currentMoisture > threshold + 15
                  ? "saturated"
                  : "optimal",
              history: prev.history.map((h) => ({ ...h, threshold })),
            }
          : prev
      );
      return;
    }
    setLoading(true);
    try {
      const result = await fetchIrrigationStatus(stage);
      dataRef.current = result;
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(growthStage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [growthStage]);

  // Irrigation timer — counts up seconds when active
  useEffect(() => {
    if (!irrigationActive) { setIrrigationTimer(0); return; }
    const interval = setInterval(() => setIrrigationTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [irrigationActive]);

  const currentStage = GROWTH_STAGES.find((s) => s.value === growthStage)!;

  const statusColor = {
    needs_water: "amber",
    optimal: "green",
    saturated: "blue",
    scheduled: "sky",
  }[data?.status ?? "optimal"];

  const statusLabel = {
    needs_water: "⚠️ Needs Irrigation",
    optimal: "✅ Optimal",
    saturated: "💧 Saturated",
    scheduled: "🕐 Scheduled",
  }[data?.status ?? "optimal"];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <Droplets className="h-6 w-6 text-sky-600" />
                Smart Irrigation Intelligence
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Precision soil moisture management with real-time sensor telemetry and rain-aware scheduling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => load(growthStage, true)}
              disabled={loading}
              className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            {loading && data && <InlineLoader message="Refreshing..." />}

            <button
              onClick={() => setIrrigationActive((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-colors ${
                irrigationActive
                  ? "bg-rose-700 text-white hover:bg-rose-800"
                  : "bg-emerald-700 text-white hover:bg-emerald-800"
              }`}
            >
              {irrigationActive ? (
                <><PauseCircle className="h-4 w-4" /> Halt Solenoid ({irrigationTimer}s)</>
              ) : (
                <><PlayCircle className="h-4 w-4" /> Manual Cycle</>
              )}
            </button>
          </div>
        </div>

        {/* Growth Stage Selector */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="h-4 w-4 text-emerald-700" />
            <span className="text-sm font-semibold text-stone-900">Crop Growth Stage</span>
            <span className="text-xs text-stone-500">— threshold changes based on stage</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GROWTH_STAGES.map((stage) => (
              <button
                key={stage.value}
                onClick={() => setGrowthStage(stage.value)}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  growthStage === stage.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-stone-200 bg-stone-50 text-stone-700 hover:border-emerald-300"
                }`}
              >
                <div className="text-xs font-bold">{stage.label}</div>
                <div className="text-[10px] text-stone-500">{stage.desc}</div>
                <div className="text-[10px] font-semibold text-sky-700 mt-0.5">
                  Threshold: {stage.threshold}%
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Loading — first load */}
        {loading && !data && (
          <PageLoader message="Loading irrigation telemetry..." />
        )}

        {/* Loading overlay — stage switch */}
        {loading && data && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white px-8 py-6 shadow-xl">
              <span className="h-8 w-8 rounded-full border-4 border-stone-200 border-t-emerald-600 animate-spin" />
              <span className="text-sm font-medium text-stone-600">Loading irrigation telemetry...</span>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Rain forecast notice */}
            {(data.rainForecastMm ?? 0) >= 5 && (
              <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                <CloudRain className="h-4 w-4 shrink-0" />
                <span>
                  <strong>{data.rainForecastMm}mm</strong> of rain forecast in the next 24 hours —
                  irrigation has been automatically deferred.
                </span>
              </div>
            )}

            {/* Backend reason */}
            {data.irrigationReason && (
              <div className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                data.status === "needs_water"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}>
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{data.irrigationReason}</span>
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Root Zone Moisture"
                value={`${data.currentMoisture}%`}
                subtitle={`Target: ${data.targetMoistureMin}% – ${data.targetMoistureMax}%`}
                icon={Gauge}
                accentColor="blue"
              />
              <StatCard
                title="Water Required"
                value={data.waterRequirementLiters > 0 ? `${data.waterRequirementLiters.toLocaleString()} L` : "None"}
                subtitle={`Stage: ${currentStage.label} (${currentStage.threshold}% threshold)`}
                icon={Droplets}
                accentColor="green"
              />
              <StatCard
                title="Next Cycle"
                value={data.nextIrrigationTime}
                subtitle={data.status === "needs_water" ? "Irrigation recommended" : "No action needed"}
                icon={Clock}
                accentColor="amber"
              />
              <StatCard
                title="Valve Status"
                value={irrigationActive ? "🟢 Running" : statusLabel}
                subtitle={`Last reading: ${data.lastWatered}`}
                icon={Waves}
                accentColor={irrigationActive ? "green" : statusColor as "green"}
              />
            </div>

            {/* Gauge + Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Circular Gauge */}
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-1">Soil Moisture Gauge</h3>
                  <p className="text-xs text-stone-500 mb-6">Capacitive sensor at 30cm depth</p>
                  <div className="flex flex-col items-center">
                    <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-stone-100 bg-sky-50/40">
                      <div
                        className="absolute inset-0 rounded-full border-8 border-sky-600 transition-all duration-1000"
                        style={{ clipPath: `inset(${100 - data.currentMoisture}% 0 0 0)` }}
                      />
                      <div className="text-center z-10">
                        <span className="text-3xl font-extrabold text-stone-900">{data.currentMoisture}%</span>
                        <span className="block text-[11px] font-medium text-stone-500">Volumetric</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`mt-6 rounded-xl p-3 text-xs border ${
                  data.status === "needs_water"
                    ? "bg-amber-50/70 border-amber-200/60 text-amber-900"
                    : "bg-emerald-50/70 border-emerald-200/60 text-emerald-900"
                }`}>
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {data.status === "needs_water" ? "Below threshold" : "Moisture optimal"}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    {data.status === "needs_water"
                      ? `Moisture ${data.currentMoisture}% is below the ${currentStage.label} stage threshold of ${currentStage.threshold}%.`
                      : `Moisture ${data.currentMoisture}% is within the optimal range for ${currentStage.label} stage.`}
                  </p>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">Moisture Trend</h3>
                    <p className="text-xs text-stone-500">Last 6 sensor readings · 10 min intervals</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-600 inline-block" /> Moisture</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Threshold</span>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis domain={[20, 80]} unit="%" tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val: number) => [`${val}%`, "Soil Moisture"]}
                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <ReferenceLine y={currentStage.threshold} stroke="#d97706" strokeDasharray="3 3" label={{ value: `${currentStage.threshold}%`, fontSize: 10, fill: "#d97706" }} />
                      <Area type="monotone" dataKey="moisture" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#moistureGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
