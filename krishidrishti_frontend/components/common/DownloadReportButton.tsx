"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DownloadReportButtonProps {
  reportTitle: string;
  getData: () => Record<string, unknown>;
  filename?: string;
  variant?: "outline" | "solid";
}

// Converts a public image URL to base64
async function getBase64FromUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Recursively flatten nested data into rows for the table
function flattenToRows(
  data: unknown,
  rows: { key: string; value: string }[] = [],
  prefix = ""
): { key: string; value: string }[] {
  if (data === null || data === undefined) return rows;

  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      const label = prefix ? `${prefix} [${i + 1}]` : `Item ${i + 1}`;
      if (typeof item === "object" && item !== null) {
        flattenToRows(item, rows, label);
      } else {
        rows.push({ key: label, value: String(item) });
      }
    });
  } else if (typeof data === "object") {
    Object.entries(data as Record<string, unknown>).forEach(([k, v]) => {
      const label = k.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
      const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
      const fullKey = prefix ? `${prefix} › ${capitalized}` : capitalized;
      if (typeof v === "object" && v !== null) {
        flattenToRows(v, rows, fullKey);
      } else {
        rows.push({ key: fullKey, value: v === null || v === undefined ? "—" : String(v) });
      }
    });
  } else {
    rows.push({ key: prefix || "Value", value: String(data) });
  }

  return rows;
}

export function DownloadReportButton({
  reportTitle,
  getData,
  filename,
  variant = "outline",
}: DownloadReportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const data = getData();
      const now = new Date();
      const generatedAt = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 14;

      // ── Header background ──
      doc.setFillColor(27, 67, 50); // dark emerald
      doc.rect(0, 0, pageW, 38, "F");

      // ── Logo ──
      try {
        const logoBase64 = await getBase64FromUrl("/logo.png");
        doc.addImage(logoBase64, "PNG", margin, 6, 22, 22);
      } catch {
        // logo failed silently
      }

      // ── Brand name ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("KrishiDrishti", margin + 26, 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(167, 243, 208); // emerald-200
      doc.text("AI-Powered Precision Agriculture Platform", margin + 26, 22);

      // ── Report title on right ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(reportTitle, pageW - margin, 16, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(167, 243, 208);
      doc.text(`Generated: ${generatedAt}`, pageW - margin, 22, { align: "right" });

      // ── Divider line under header ──
      doc.setDrawColor(52, 211, 153); // emerald-400
      doc.setLineWidth(0.5);
      doc.line(0, 38, pageW, 38);

      // ── Section title ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(27, 67, 50);
      doc.text(reportTitle, margin, 50);

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin, 53, pageW - margin, 53);

      // ── Flatten data into rows ──
      const rows = flattenToRows(data);

      autoTable(doc, {
        startY: 57,
        head: [["Field", "Value"]],
        body: rows.map((r) => [r.key, r.value]),
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3.5,
          valign: "middle",
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [27, 67, 50],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [240, 253, 244], // emerald-50
        },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [30, 30, 30], cellWidth: 70 },
          1: { textColor: [50, 50, 50] },
        },
        didDrawPage: (hookData) => {
          // Footer on every page
          const pageCount = (doc as any).internal.getNumberOfPages();
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(150, 150, 150);
          doc.text(
            "KrishiDrishti AI Platform  •  AI-generated report — verify with local agronomist before major interventions.",
            margin,
            pageH - 8
          );
          doc.text(
            `Page ${hookData.pageNumber} of ${pageCount}`,
            pageW - margin,
            pageH - 8,
            { align: "right" }
          );
          // footer line
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
        },
      });

      const safeFilename =
        filename ||
        `krishidrishti_${reportTitle.toLowerCase().replace(/\s+/g, "_")}_${now.toISOString().slice(0, 10)}.pdf`;

      doc.save(safeFilename);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  const baseClass = "inline-flex items-center gap-1.5 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-60 transition-colors";

  if (variant === "solid") {
    return (
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`${baseClass} bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800`}
      >
        {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        Download PDF
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`${baseClass} border border-stone-300 bg-white px-3.5 py-2 text-stone-700 hover:bg-stone-50`}
    >
      {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      Download PDF
    </button>
  );
}
