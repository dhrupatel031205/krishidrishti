"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchAgroWeather } from "@/lib/api/client";
import { AgroWeatherData } from "@/types";
import { StatCard, SimulationBadge } from "@/components/common/StatCard";
import {
  CloudSun, Thermometer, Droplets, CloudRain,
  ShieldAlert, AlertCircle, LocateFixed, Loader2,
} from "lucide-react";

type LocationState = "idle" | "requesting" | "granted" | "denied" | "unsupported";

export default function WeatherPage() {
  const [weather, setWeather] = useState<AgroWeatherData | null>(null);
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const loadWeather = async (lat?: number, lon?: number) => {
    setLoading(true);
    try {
      const data = await fetchAgroWeather(lat, lon);
      setWeather(data);
    } finally {
      setLoading(false);
    }
  };

  // Reverse geocode coords to city name using Open-Meteo geocoding (free)
  const resolveCityName = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "";
      const state = data.address?.state || "";
      setCityName(city && state ? `${city}, ${state}` : city || state || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
    } catch {
      setCityName(`${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState("unsupported");
      loadWeather();
      return;
    }
    setLocationState("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
        setLocationState("granted");
        resolveCityName(lat, lon);
        loadWeather(lat, lon);
      },
      () => {
        setLocationState("denied");
        loadWeather(); // fallback to default
      },
      { timeout: 10000 }
    );
  };

  // On mount — load with default coords first, then ask for location
  useEffect(() => {
    loadWeather();
    requestLocation();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <CloudSun className="h-6 w-6 text-amber-600" />
                Agro-Weather Intelligence & Disease Risk
              </h1>
              <SimulationBadge />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Microclimate forecasting tailored to crop pathogen dynamics, spore development, and evapotranspiration rates.
            </p>
          </div>

          {/* Location pill */}
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-stone-600 bg-white border border-stone-200/80 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5">
              <LocateFixed className="h-3.5 w-3.5 text-emerald-600" />
              {locationState === "requesting" ? (
                <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Detecting location...</span>
              ) : cityName ? (
                `📍 ${cityName}`
              ) : weather ? (
                `📍 ${weather.location}`
              ) : (
                "📍 Loading..."
              )}
            </div>

            {(locationState === "denied" || locationState === "idle") && (
              <button
                onClick={requestLocation}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <LocateFixed className="h-3.5 w-3.5" />
                Use My Location
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && !weather && (
          <div className="p-12 text-center text-stone-400 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading agro-weather intelligence...
          </div>
        )}

        {weather && (
          <>
            {/* Real-Time Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Temperature"
                value={`${weather.temperature}°C`}
                subtitle="Current ambient temperature"
                icon={Thermometer}
                accentColor="amber"
              />
              <StatCard
                title="Relative Humidity"
                value={`${weather.humidity}%`}
                subtitle="Spore germination threshold: >75%"
                icon={Droplets}
                accentColor="blue"
              />
              <StatCard
                title="Precipitation"
                value={`${weather.rainfallMm} mm`}
                subtitle="Next 24 hours"
                icon={CloudRain}
                accentColor="blue"
              />
              <StatCard
                title="Pathogen Risk Index"
                value={`${weather.diseaseRiskScore}/100`}
                subtitle={`${weather.diseaseRiskCategory} Fungal Pressure`}
                icon={ShieldAlert}
                accentColor={weather.diseaseRiskScore > 70 ? "red" : "amber"}
              />
            </div>

            {/* Location denied notice */}
            {locationState === "denied" && (
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Location access was denied. Showing weather for default location (Karnal, Haryana). Click "Use My Location" to use your actual location.
              </div>
            )}

            {/* Agricultural Alerts */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-emerald-700" />
                Agronomic Weather Advisories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weather.agriculturalAlerts.map((alert, idx) => (
                  <div key={idx} className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
                      <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                      <span>{alert.type} Alert</span>
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-relaxed">{alert.message}</p>
                    <div className="pt-2 border-t border-stone-100 flex items-start gap-1.5 text-xs text-emerald-800 font-semibold">
                      <span>Action:</span>
                      <span>{alert.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">
                5-Day Microclimate Outlook & Rain Probability
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {weather.forecast.map((fc, i) => (
                  <div key={i} className="rounded-xl border border-stone-100 bg-stone-50/60 p-4 space-y-2">
                    <span className="text-xs font-bold text-stone-700">{fc.day}</span>
                    <div className="text-xl font-bold text-stone-900">
                      {fc.tempMax}° / <span className="text-stone-500 text-sm">{fc.tempMin}°</span>
                    </div>
                    <div className="text-xs text-stone-500">{fc.condition}</div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-800">
                      <CloudRain className="h-3 w-3" />
                      <span>{fc.rainChance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
