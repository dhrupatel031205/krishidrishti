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

const E = [27, 67, 50] as const;   // emerald-900
const E2 = [52, 211, 153] as const; // emerald-400
const E3 = [240, 253, 244] as const; // emerald-50
const GRAY = [100, 100, 100] as const;
const DARK = [30, 30, 30] as const;

async function getLogo(): Promise<string | null> {
  try {
    const res = await fetch("/logo.png");
    const blob = await res.blob();
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch { return null; }
}

function drawHeader(doc: jsPDF, reportTitle: string, generatedAt: string, logo: string | null) {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...E);
  doc.rect(0, 0, W, 40, "F");
  if (logo) {
    try { doc.addImage(logo, "PNG", 14, 7, 22, 22); } catch {}
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text("KrishiDrishti", 40, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...E2);
  doc.text("AI-Powered Precision Agriculture Platform", 40, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle, W - 14, 17, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...E2);
  doc.text(`Generated: ${generatedAt}`, W - 14, 24, { align: "right" });
  doc.setDrawColor(...E2);
  doc.setLineWidth(0.5);
  doc.line(0, 40, W, 40);
}

function drawFooter(doc: jsPDF) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const pages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(14, H - 12, W - 14, H - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text("KrishiDrishti AI Platform  •  AI-generated — verify with local agronomist before major interventions.", 14, H - 7);
    doc.text(`Page ${i} of ${pages}`, W - 14, H - 7, { align: "right" });
  }
}

function sectionTitle(doc: jsPDF, text: string, y: number): number {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...E);
  doc.rect(14, y, W - 28, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(text.toUpperCase(), 18, y + 5);
  return y + 11;
}

function infoGrid(doc: jsPDF, items: { label: string; value: string }[], startY: number, cols = 2): number {
  const W = doc.internal.pageSize.getWidth();
  const colW = (W - 28) / cols;
  let x = 14; let y = startY;
  items.forEach((item, i) => {
    if (i > 0 && i % cols === 0) { y += 14; x = 14; }
    doc.setFillColor(248, 250, 248);
    doc.roundedRect(x, y, colW - 3, 12, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(item.label, x + 3, y + 4.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(String(item.value), x + 3, y + 10);
    x += colW;
  });
  const rows = Math.ceil(items.length / cols);
  return startY + rows * 14 + 4;
}

function statusBadge(doc: jsPDF, text: string, x: number, y: number, color: [number, number, number]) {
  const w = doc.getTextWidth(text) + 6;
  doc.setFillColor(...color);
  doc.roundedRect(x, y - 4, w, 6, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(text.toUpperCase(), x + 3, y);
}

function bulletList(doc: jsPDF, items: string[], startY: number, color: [number,number,number] = E): number {
  let y = startY;
  items.forEach((item) => {
    doc.setFillColor(...color);
    doc.circle(17, y - 1, 1, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(item, doc.internal.pageSize.getWidth() - 42);
    doc.text(lines, 21, y);
    y += lines.length * 5 + 2;
  });
  return y + 2;
}

export function DownloadReportButton({
  reportTitle,
  getData,
  filename = "report.pdf",
  variant = "outline",
}: DownloadReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const data = getData();
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const generatedAt = new Date().toLocaleString();
      const logo = await getLogo();

      drawHeader(doc, reportTitle, generatedAt, logo);

      let y = 50;

      // Render each top-level key as a section
      for (const [key, value] of Object.entries(data)) {
        if (y > 250) { doc.addPage(); drawHeader(doc, reportTitle, generatedAt, logo); y = 50; }

        const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          y = sectionTitle(doc, label, y);
          const cols = Object.keys(value[0] as object);
          autoTable(doc, {
            startY: y,
            head: [cols.map((c) => c.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase()))],
            body: (value as Record<string, unknown>[]).map((row) => cols.map((c) => String(row[c] ?? ""))),
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: E as unknown as [number, number, number] },
            margin: { left: 14, right: 14 },
          });
          y = (doc as any).lastAutoTable.finalY + 6;
        } else if (Array.isArray(value)) {
          y = sectionTitle(doc, label, y);
          y = bulletList(doc, value.map(String), y);
        } else if (typeof value === "object" && value !== null) {
          y = sectionTitle(doc, label, y);
          const items = Object.entries(value as Record<string, unknown>).map(([k, v]) => ({
            label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            value: String(v),
          }));
          y = infoGrid(doc, items, y);
        } else {
          y = sectionTitle(doc, label, y);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...DARK);
          const lines = doc.splitTextToSize(String(value), doc.internal.pageSize.getWidth() - 28);
          doc.text(lines, 14, y);
          y += lines.length * 5 + 4;
        }
      }

      drawFooter(doc);
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const styles =
    variant === "solid"
      ? `${base} bg-emerald-600 text-white hover:bg-emerald-700`
      : `${base} border border-emerald-600 text-emerald-700 hover:bg-emerald-50`;

  return (
    <button onClick={handleDownload} disabled={loading} className={styles}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? "Generating..." : "Download Report"}
    </button>
  );
}
