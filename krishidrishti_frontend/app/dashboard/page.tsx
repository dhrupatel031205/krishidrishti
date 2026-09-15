"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, StatusBadge, SimulationBadge } from "@/components/common/StatCard";
import { PageLoader } from "@/components/common/Loader";
import { featureFlags } from "@/config/features";
import {
  fetchDiagnosisHistory,
  fetchIrrigationStatus,
  fetchAgroWeather,
  fetchSustainabilityReport,
  fetchSensorDashboard,
  fetchAdvisoryBriefings,
} from "@/lib/api/client";
import {
  ScanLine,
  Droplets,
  CloudSun,
  Leaf,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DownloadReportButton } from "@/components/common/DownloadReportButton";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [irrigation, setIrrigation] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [sustainability, setSustainability] = useState<any>(null);
  const [sensors, setSensors] = useState<any>(null);
  const [briefings, setBriefings] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    Promise.all([
      fetchDiagnosisHistory().then(setHistory),
      featureFlags.irrigation ? fetchIrrigationStatus().then(setIrrigation) : Promise.resolve(),
      featureFlags.weather ? fetchAgroWeather().then(setWeather) : Promise.resolve(),
      featureFlags.sustainability ? fetchSustainabilityReport().then(setSustainability) : Promise.resolve(),
      featureFlags.monitoring ? fetchSensorDashboard().then(setSensors) : Promise.resolve(),
      featureFlags.advisor ? fetchAdvisoryBriefings().then(({ briefings }) => setBriefings(briefings)) : Promise.resolve(),
    ]).finally(() => setPageLoading(false));
  }, []);

  if (pageLoading) {
    return (
      <AppShell>
        <PageLoader message="Loading farm dashboard..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Farm Overview Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                {t("dashboardTitle")}
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-xs sm:text-sm text-stone-500">
              {t("dashboardDesc")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DownloadReportButton
              reportTitle="Farm Dashboard Summary"
              getData={() => ({
                ...(irrigation && {
                  irrigation: {
                    currentMoisture: `${irrigation.currentMoisture}%`,
                    status: irrigation.status,
                    nextIrrigation: irrigation.nextIrrigationTime,
                  },
                }),
                ...(weather && {
                  weather: {
                    temperature: `${weather.temperature}°C`,
                    humidity: `${weather.humidity}%`,
                    diseaseRisk: `${weather.diseaseRiskCategory} (${weather.diseaseRiskScore}/100)`,
                  },
                }),
                ...(sustainability && {
                  sustainability: {
                    score: `${sustainability.overallScore}/100`,
                    grade: sustainability.grade,
                  },
                }),
                recentDiagnoses: history.slice(0, 5).map((item: any) => ({
                  crop: item.crop,
                  diagnosis: item.diagnosis,
                  severity: item.severity,
                  confidence: `${Math.round(item.confidence * 100)}%`,
                })),
                ...(briefings.length > 0 && {
                  topAdvisory: {
                    priority: briefings[0]?.priority,
                    title: briefings[0]?.title,
                    action: briefings[0]?.recommendedAction,
                  },
                }),
              })}
            />
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
            >
              <ScanLine className="h-4 w-4" />
              <span>{t("scanCropLeaf")}</span>
            </Link>
          </div>
        </div>

        {/* Modular Stat Cards Grid (Conditionally adapts to feature flags) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("overallCropHealth")}
            value="89%"
            subtitle={t("foliageIntegrity")}
            icon={ShieldCheck}
            trend={{ value: "+2.4% vs last cycle", positive: true }}
            accentColor="green"
          />

          <StatCard
            title={t("activeDiseaseAlerts")}
            value="1 Alert"
            subtitle="Tomato Early Blight (Moderate)"
            icon={AlertTriangle}
            accentColor="amber"
          />

          {featureFlags.irrigation && irrigation && (
            <StatCard
              title={t("soilMoisture")}
              value={`${irrigation.currentMoisture}%`}
              subtitle={`Deficit: ${irrigation.targetMoistureMin - irrigation.currentMoisture}% below min`}
              icon={Droplets}
              accentColor="blue"
            />
          )}

          {featureFlags.sustainability && sustainability && (
            <StatCard
              title={t("sustainabilityRating2")}
              value={`${sustainability.overallScore}/100`}
              subtitle={`Grade ${sustainability.grade} • Top Tier`}
              icon={Leaf}
              accentColor="green"
            />
          )}
        </div>

        {/* Middle Section: Agentic Farm Briefing + Weather Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agentic Advisor Widget */}
          {featureFlags.advisor && briefings.length > 0 && (
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <h3 className="font-semibold text-stone-900 text-sm">
                    {t("todaysBriefing")}
                  </h3>
                </div>
                <Link
                  href="/advisor"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>{t("viewAllSignals")}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>{briefings[0]?.priority} Priority: {briefings[0]?.title}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {briefings[0]?.reason}
                </p>
                <div className="pt-2 border-t border-amber-200/60 text-xs font-semibold text-stone-800">
                  Recommended Action: {briefings[0]?.recommendedAction}
                </div>
              </div>
            </div>
          )}

          {/* Agro-Weather Widget */}
          {featureFlags.weather && weather && (
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudSun className="h-4 w-4 text-amber-600" />
                  <h3 className="font-semibold text-stone-900 text-sm">
                    {t("microclimatRisk")}
                  </h3>
                </div>
                <Link
                  href="/weather"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {t("fullRadar")}
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500">{t("currentTemp")}</span>
                  <span className="font-bold text-stone-900">{weather.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500">{t("airHumidity")}</span>
                  <span className="font-bold text-stone-900">{weather.humidity}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500">{t("pathogenRisk")}</span>
                  <span className="font-bold text-amber-800">{weather.diseaseRiskCategory} ({weather.diseaseRiskScore}/100)</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 leading-relaxed">
                {weather.agriculturalAlerts[0]?.message}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Recent Crop Analyses Archive */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">
                {t("recentFoliageInspections")}
              </h3>
              <p className="text-xs text-stone-500">{t("diagnosisDesc")}</p>
            </div>
            <Link
              href="/diagnosis/history"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{t("fullAuditHistory")}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-emerald-300 transition-colors bg-stone-50/50"
              >
                <img
                  src={item.imageUrl}
                  alt={item.diagnosis}
                  className="h-12 w-12 rounded-lg object-cover border border-stone-200 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="font-semibold text-xs text-stone-900 truncate">
                    {item.crop} • {item.diagnosis}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={item.severity} size="sm" />
                    <span className="text-[11px] text-stone-500 font-medium">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
