"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchSensorDashboard } from "@/lib/api/client";
import { SensorDashboardData } from "@/types";
import { StatCard, StatusBadge, SimulationBadge } from "@/components/common/StatCard";
import {
  Activity,
  Radio,
  BatteryCharging,
  Clock,
  Sparkles,
  Thermometer,
  Droplets,
  Sun,
  ShieldCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MonitoringPage() {
  const [data, setData] = useState<SensorDashboardData | null>(null);
  const [isSimulatedMode, setIsSimulatedMode] = useState(true);

  useEffect(() => {
    fetchSensorDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <AppShell>
        <div className="p-12 text-center text-stone-400">Loading IoT sensor telemetry...</div>
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
                <Activity className="h-6 w-6 text-emerald-700" />
                IoT Sensor Telemetry & Field Nodes
              </h1>
              {isSimulatedMode && <SimulationBadge />}
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Live telemetry from LoRaWAN field probes, soil capacitive sensors, and canopy weather nodes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSimulatedMode(!isSimulatedMode)}
              className="text-xs font-semibold rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-700 shadow-xs hover:bg-stone-50"
            >
              Mode: {isSimulatedMode ? "Simulated Sensors" : "Hardware LoRa Gateway"}
            </button>
          </div>
        </div>

        {/* Active Node Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-stone-900">{sensor.name}</h3>
                  <span className="text-[10px] text-stone-400">Node ID: {sensor.id}</span>
                </div>
                <StatusBadge status={sensor.status} size="sm" />
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-3xl font-extrabold text-stone-900">
                  {sensor.currentValue}{" "}
                  <span className="text-base font-normal text-stone-500">{sensor.unit}</span>
                </span>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{sensor.batteryPercent}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {sensor.lastUpdated}
                </span>
                <span className="capitalize">{sensor.type} Node</span>
              </div>
            </div>
          ))}
        </div>

        {/* Telemetry Historical Trend Chart */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Multi-Sensor Telemetry Over Time
              </h3>
              <p className="text-xs text-stone-500">Temperature, relative humidity, and moisture correlation</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.telemetryHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#d97706" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#0284c7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#1b4332" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
