"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Settings, User, MapPin, Globe, Bell, Sliders, ShieldCheck, Check, Loader2 } from "lucide-react";
import { useLanguage, Language } from "@/lib/context/LanguageContext";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  const [profile, setProfile] = useState({
    name: "Ramesh Sharma",
    phone: "+91 98765 43210",
    farmName: "Karnal Precision Agro-Farm",
    location: "Karnal, Haryana, India",
    landArea: "4.2 Hectares",
    primaryCrop: "Tomato, Wheat & Mustard",
    language: language || "en",
    areaUnit: "Hectares (ha)",
    soilAlerts: true,
    weatherAlerts: true,
    diseaseAlerts: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync profile when context language changes or loads
  React.useEffect(() => {
    setProfile((prev) => ({ ...prev, language }));
  }, [language]);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("krishidrishti_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setProfile((prev) => ({ ...prev, ...parsed }));
        if (parsed.language) {
          setLanguage(parsed.language);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      localStorage.setItem("krishidrishti_settings", JSON.stringify(profile));
      setLanguage(profile.language as Language);
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }, 400);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-700" />
            {t("settingsTitle")}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {t("settingsDesc")}
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{t("settingsPersisted")}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile & Farm Location */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-700" />
              {t("farmerProfile")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">{t("farmerName")}</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">{t("contactPhone")}</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">{t("farmHolding")}</label>
                <input
                  type="text"
                  value={profile.farmName}
                  onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">{t("locationCoords")}</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Multilingual & Regional Standards */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-700" />
              {t("multilingual")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">{t("appLanguage")}</label>
                <select
                  value={profile.language}
                  onChange={(e) => {
                    const newLang = e.target.value as Language;
                    setProfile({ ...profile, language: newLang });
                    setLanguage(newLang);
                  }}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-900 bg-white focus:outline-hidden"
                >
                  <option value="en">English (Default)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  Ready for regional dialect audio synthesis and speech models.
                </p>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">{t("areaUnits")}</label>
                <select
                  value={profile.areaUnit}
                  onChange={(e) => setProfile({ ...profile, areaUnit: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-900 bg-white focus:outline-hidden"
                >
                  <option value="Hectares (ha)">Hectares (ha)</option>
                  <option value="Acres">Acres</option>
                  <option value="Bigha">Bigha</option>
                </select>
              </div>
            </div>
          </div>

          {/* Automated Notification Subscriptions */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-700" />
              {t("realtimeAlerts")}
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.diseaseAlerts}
                  onChange={(e) => setProfile({ ...profile, diseaseAlerts: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-700"
                />
                <div>
                  <span className="font-medium text-stone-800">{t("diseaseAlerts")}</span>
                  <span className="block text-[11px] text-stone-500">
                    {t("diseaseAlertsDesc")}
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.weatherAlerts}
                  onChange={(e) => setProfile({ ...profile, weatherAlerts: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-700"
                />
                <div>
                  <span className="font-medium text-stone-800">{t("weatherAlerts")}</span>
                  <span className="block text-[11px] text-stone-500">
                    {t("weatherAlertsDesc")}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white shadow-md transition-all cursor-pointer ${
                saved
                  ? "bg-emerald-800 hover:bg-emerald-900 ring-2 ring-emerald-400"
                  : "bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98]"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{t("savingSettings")}</span>
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span>{t("savedSuccess")}</span>
                </>
              ) : (
                <span>{t("saveSettings")}</span>
              )}
            </button>

            {saved && (
              <span className="text-xs font-semibold text-emerald-700 animate-fade-in flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {t("settingsPersisted")}
              </span>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}
