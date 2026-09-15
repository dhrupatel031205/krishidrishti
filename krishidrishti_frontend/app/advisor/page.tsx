"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchAdvisoryBriefings } from "@/lib/api/client";
import { AdvisoryBriefing } from "@/types";
import { SimulationBadge } from "@/components/common/StatCard";
import {
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Brain,
} from "lucide-react";
import { DownloadReportButton } from "@/components/common/DownloadReportButton";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function AdvisorPage() {
  const { t } = useLanguage();
  const [briefings, setBriefings] = useState<AdvisoryBriefing[]>([]);
  const [heroTitle, setHeroTitle] = useState("Loading farm briefing...");
  const [heroDescription, setHeroDescription] = useState("");

  useEffect(() => {
    fetchAdvisoryBriefings().then(({ briefings, heroTitle, heroDescription }) => {
      setBriefings(briefings);
      setHeroTitle(heroTitle);
      setHeroDescription(heroDescription);
    });
  }, []);

  const handleAcknowledge = (id: string) => {
    setBriefings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "acknowledged" } : b))
    );
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-rose-300 bg-rose-50/50 text-rose-900";
      case "high":
        return "border-amber-300 bg-amber-50/50 text-amber-900";
      case "medium":
        return "border-emerald-300 bg-emerald-50/50 text-emerald-900";
      default:
        return "border-stone-300 bg-stone-50 text-stone-800";
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
                <Brain className="h-6 w-6 text-emerald-700" />
                {t("advisorTitle")}
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {t("advisorDesc")}
            </p>
          </div>
          {briefings.length > 0 && (
            <DownloadReportButton
              reportTitle="Agentic Advisor Briefings"
              getData={() => ({
                dailyBriefing: heroTitle,
                recommendations: briefings.map((b) => ({
                  priority: b.priority,
                  title: b.title,
                  reason: b.reason,
                  recommendedAction: b.recommendedAction,
                  estimatedImpact: b.estimatedImpact,
                  dataSources: b.dataSources,
                  status: b.status,
                })),
              })}
            />
          )}
        </div>

        {/* Daily Farm Briefing Hero Banner */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 sm:p-8 text-white shadow-md">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">
            <Sparkles className="h-4 w-4" />
            <span>{t("todaysFarmBriefing")}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight break-words">
            {heroTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            {heroDescription || t("advisorFallbackDesc")}
          </p>
        </div>

        {/* Briefings List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-stone-900">
            {t("rankedRecommendations")}
          </h3>

          <div className="space-y-4">
            {briefings.map((briefing) => (
              <div
                key={briefing.id}
                className={`rounded-2xl border p-6 bg-white shadow-xs transition-all ${
                  briefing.priority === "critical"
                    ? "border-rose-200"
                    : briefing.priority === "high"
                    ? "border-amber-200"
                    : "border-stone-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityStyle(
                          briefing.priority
                        )}`}
                      >
                        {briefing.priority} {t("priority")}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-stone-900">
                        {briefing.title}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mt-1">
                      {briefing.reason}
                    </p>
                  </div>

                  <div>
                    {briefing.status === "acknowledged" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t("acknowledged")}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(briefing.id)}
                        className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
                      >
                        {t("acknowledgeAction")}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-stone-50 p-3.5 border border-stone-200/80 text-xs">
                  <div className="font-semibold text-stone-800 mb-1">
                    {t("recommendedAction")}
                  </div>
                  <p className="text-stone-700 leading-relaxed">{briefing.recommendedAction}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-stone-400" />
                    <span>{t("signalInputs")}: {briefing.dataSources.join(" • ")}</span>
                  </div>
                  <span className="font-medium text-emerald-800">
                    {t("impact")}: {briefing.estimatedImpact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
