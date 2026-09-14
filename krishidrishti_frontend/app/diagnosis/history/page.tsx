"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchDiagnosisHistory } from "@/lib/api/client";
import { DiagnosisHistoryItem } from "@/types";
import { StatusBadge, SimulationBadge } from "@/components/common/StatCard";
import { formatDate } from "@/lib/utils";
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function DiagnosisHistoryPage() {
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiagnosisHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const filteredItems = history.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <History className="h-6 w-6 text-emerald-700" />
                Diagnosis Archive & Field Audits
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Longitudinal repository of leaf inspections, pathology progression, and applied treatments across all plots.
            </p>
          </div>

          <Link
            href="/diagnosis"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800"
          >
            New Foliage Scan
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by crop, disease, or pathology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-stone-400 shrink-0" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-sm text-stone-700 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Severities</option>
              <option value="healthy">Healthy Only</option>
              <option value="low">Low Severity</option>
              <option value="moderate">Moderate Severity</option>
              <option value="critical">Critical Severity</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="rounded-2xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-stone-50/80 text-xs uppercase font-semibold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3.5">Foliage Sample</th>
                  <th className="px-6 py-3.5">Crop & Condition</th>
                  <th className="px-6 py-3.5">Inspection Date</th>
                  <th className="px-6 py-3.5">Confidence</th>
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5">Action Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                      Loading diagnosis archive...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.diagnosis}
                            className="h-12 w-12 rounded-lg object-cover border border-stone-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                            }}
                          />
                        ) : null}
                        <div className={`h-12 w-12 rounded-lg border border-stone-200 bg-stone-100 flex items-center justify-center ${item.imageUrl ? "hidden" : ""}`}>
                          <span className="text-xs text-stone-400">N/A</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-stone-900">{item.crop}</div>
                        <div className="text-xs text-stone-500">{item.diagnosis}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-500">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-stone-800">
                        {Math.round(item.confidence * 100)}%
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.severity} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-700 capitalize">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
