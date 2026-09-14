"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchIrrigationStatus } from "@/lib/api/client";
import { IrrigationStatus } from "@/types";
import { StatCard, SimulationBadge } from "@/components/common/StatCard";
import {
  Droplets,
  Clock,
  Waves,
  Gauge,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function IrrigationPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<IrrigationStatus | null>(null);
  const [irrigationTriggered, setIrrigationTriggered] = useState(false);

  useEffect(() => {
    fetchIrrigationStatus().then(setData);
  }, []);

  if (!data) {
    return (
      <AppShell>
        <div className="p-12 text-center text-stone-400">Loading irrigation telemetry...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <Droplets className="h-6 w-6 text-sky-600" />
                {t("irrigationTitle")}
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {t("irrigationDesc")}
            </p>
          </div>

          <button
            onClick={() => setIrrigationTriggered(!irrigationTriggered)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
              irrigationTriggered
                ? "bg-rose-700 text-white hover:bg-rose-800"
                : "bg-emerald-700 text-white hover:bg-emerald-800"
            }`}
          >
            {irrigationTriggered ? (
              <>
                <PauseCircle className="h-4 w-4" />
                <span>{t("haltSolenoid")}</span>
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                <span>{t("manualCycle")}</span>
              </>
            )}
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("rootZoneMoisture")}
            value={`${data.currentMoisture}%`}
            subtitle={`${t("target")}: ${data.targetMoistureMin}% - ${data.targetMoistureMax}%`}
            icon={Gauge}
            accentColor="blue"
          />
          <StatCard
            title={t("waterRequired")}
            value={`${data.waterRequirementLiters.toLocaleString()} L`}
            subtitle={t("fieldCapacity")}
            icon={Droplets}
            accentColor="green"
          />
          <StatCard
            title={t("nextCycle")}
            value="06:30 PM"
            subtitle={t("eveningDrip")}
            icon={Clock}
            accentColor="amber"
          />
          <StatCard
            title={t("valveStatus")}
            value={irrigationTriggered ? t("valveRunning") : t("valveStandby")}
            subtitle={data.lastWatered}
            icon={Waves}
            accentColor={irrigationTriggered ? "green" : "earth"}
          />
        </div>

        {/* Visual Moisture Gauge Card & Hourly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gauge representation */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs lg:col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-1">
                {t("soilMoistureGauge")}
              </h3>
              <p className="text-xs text-stone-500 mb-6">{t("capacitiveDepth")}</p>

              <div className="flex flex-col items-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-stone-100 bg-sky-50/40">
                  <div
                    className="absolute inset-0 rounded-full border-8 border-sky-600 transition-all duration-1000"
                    style={{ clipPath: `inset(${100 - data.currentMoisture}% 0 0 0)` }}
                  />
                  <div className="text-center z-10">
                    <span className="text-3xl font-extrabold text-stone-900">
                      {data.currentMoisture}%
                    </span>
                    <span className="block text-[11px] font-medium text-stone-500">
                      {t("volumetricContent")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-amber-50/70 border border-amber-200/60 p-3 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="h-4 w-4 text-amber-700" />
                <span>{t("underMoistureTitle")}</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
                {t("underMoistureDesc")}
              </p>
            </div>
          </div>

          {/* Moisture Historical Trend Chart */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">
                  {t("moistureTrendTitle")}
                </h3>
                <p className="text-xs text-stone-500">{t("moistureTrendDesc")}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="flex h-2 w-2 rounded-full bg-sky-600" />
                <span>{t("moisturePercent")}</span>
                <span className="flex h-2 w-2 rounded-full bg-amber-500 ml-2" />
                <span>{t("targetMin")}</span>
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
                  <YAxis domain={[20, 70]} unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, "Soil Moisture"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <ReferenceLine y={45} stroke="#d97706" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#moistureGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
