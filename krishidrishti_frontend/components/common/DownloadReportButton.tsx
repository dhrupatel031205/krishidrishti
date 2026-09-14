"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadReportButtonProps {
  reportTitle: string;
  getData: () => Record<string, unknown>;
  filename?: string;
  variant?: "outline" | "solid";
}

export function DownloadReportButton({
  reportTitle,
  getData,
  filename,
  variant = "outline",
}: DownloadReportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    try {
      const data = getData();
      const now = new Date();
      const report = {
        title: reportTitle,
        generatedAt: now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        generatedBy: "KrishiDrishti AI Platform",
        ...data,
      };

      const lines: string[] = [];
      lines.push("=".repeat(60));
      lines.push(`  ${report.title}`);
      lines.push(`  KrishiDrishti AI Platform`);
      lines.push(`  Generated: ${report.generatedAt}`);
      lines.push("=".repeat(60));
      lines.push("");

      const formatValue = (val: unknown, indent = 0): string => {
        const pad = "  ".repeat(indent);
        if (val === null || val === undefined) return `${pad}—`;
        if (typeof val === "string" || typeof val === "number" || typeof val === "boolean")
          return `${pad}${val}`;
        if (Array.isArray(val)) {
          if (val.length === 0) return `${pad}(none)`;
          return val
            .map((item, i) =>
              typeof item === "object" && item !== null
                ? `${pad}${i + 1}. \n${formatValue(item, indent + 1)}`
                : `${pad}${i + 1}. ${item}`
            )
            .join("\n");
        }
        if (typeof val === "object") {
          return Object.entries(val as Record<string, unknown>)
            .map(([k, v]) => {
              const label = k.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
              const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
              if (typeof v === "object" && v !== null && !Array.isArray(v)) {
                return `${pad}${capitalized}:\n${formatValue(v, indent + 1)}`;
              }
              if (Array.isArray(v)) {
                return `${pad}${capitalized}:\n${formatValue(v, indent + 1)}`;
              }
              return `${pad}${capitalized}: ${v}`;
            })
            .join("\n");
        }
        return `${pad}${String(val)}`;
      };

      // Skip meta fields already in header
      const { title, generatedAt, generatedBy, ...rest } = report;
      void title; void generatedAt; void generatedBy;

      Object.entries(rest).forEach(([section, value]) => {
        const label = section.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
        const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
        lines.push(`── ${capitalized} ${"─".repeat(Math.max(0, 54 - capitalized.length))}`);
        lines.push(formatValue(value, 1));
        lines.push("");
      });

      lines.push("=".repeat(60));
      lines.push("  Disclaimer: AI-generated report. Verify with local agronomist.");
      lines.push("=".repeat(60));

      const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeFilename =
        filename ||
        `krishidrishti_${reportTitle.toLowerCase().replace(/\s+/g, "_")}_${now.toISOString().slice(0, 10)}.txt`;
      a.href = url;
      a.download = safeFilename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  if (variant === "solid") {
    return (
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 disabled:opacity-60 transition-colors"
      >
        {downloading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        Download Report
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs disabled:opacity-60 transition-colors"
    >
      {downloading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      Download Report
    </button>
  );
}
