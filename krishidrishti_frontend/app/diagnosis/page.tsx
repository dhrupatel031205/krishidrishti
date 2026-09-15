"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ImageUploader } from "@/components/diagnosis/ImageUploader";
import { DiagnosisResult } from "@/components/diagnosis/DiagnosisResult";
import { predictCropDisease } from "@/lib/api/client";
import { PredictionResponse } from "@/types";
import { ScanLine, History, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function DiagnosisPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleAnalyze = async (fileOrSampleId: File | string, previewUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictCropDisease(fileOrSampleId);
      setResult({
        ...response,
        imageUrl: previewUrl,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to analyze the image right now.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <ScanLine className="h-6 w-6 text-emerald-700" />
                {t("diagnosisTitle")}
              </h1>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {t("coreModule")}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {t("diagnosisDesc")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/diagnosis/history"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs"
            >
              <History className="h-4 w-4" />
              <span>{t("diagnosisHistory")}</span>
            </Link>
          </div>
        </div>

        {/* Primary Diagnosis Flow */}
        {!result ? (
          <ImageUploader onAnalyze={handleAnalyze} isLoading={loading} validationError={error} />
        ) : (
          <DiagnosisResult result={result} onReset={handleReset} />
        )}
      </div>
    </AppShell>
  );
}
