"use client";

import React from "react";
import Link from "next/link";
import {
  ScanLine,
  Compass,
  Droplets,
  CloudSun,
  Leaf,
  Activity,
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LayoutDashboard,
  ArrowUp,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "AI Crop Disease Detection",
      description: "Immediate computer vision classification of leaf necrosis, chlorosis, and fungal pathology with Grad-CAM explainability.",
      icon: ScanLine,
      href: "/diagnosis",
      badge: "Core AI",
    },
    {
      title: "Soil-Based Crop Recommendation",
      description: "Multi-parameter optimization matching regional NPK, pH, and precipitation with maximal yield & soil rejuvenation varieties.",
      icon: Compass,
      href: "/recommendations",
    },
    {
      title: "Precision Smart Irrigation",
      description: "Sensor-driven root zone moisture telemetry preventing water waste and crop wilting with solenoid automation.",
      icon: Droplets,
      href: "/irrigation",
    },
    {
      title: "Agro-Weather Intelligence",
      description: "Microclimate risk modeling quantifying fungal spore germination windows and precipitation alerts.",
      icon: CloudSun,
      href: "/weather",
    },
    {
      title: "Farm Sustainability Index",
      description: "Quantifying water conservation, carbon sequestration, and chemical rationalization with actionable ESG benchmarks.",
      icon: Leaf,
      href: "/sustainability",
    },
    {
      title: "IoT Sensor Telemetry",
      description: "Real-time telemetry and simulation mode across canopy temperature, relative humidity, and soil pH probes.",
      icon: Activity,
      href: "/monitoring",
    },
    {
      title: "AI Farmer Assistant",
      description: "Multilingual conversational agronomic co-pilot ready for regional dialects and precision fertigation advice.",
      icon: Bot,
      href: "/assistant",
    },
    {
      title: "Agentic Agricultural Advisor",
      description: "Autonomous reasoning engine synthesizing multi-source signals into prioritized, actionable farm briefings.",
      icon: Sparkles,
      href: "/advisor",
      badge: "Agentic",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#fbfaf8]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            title="Go to Top / Homepage"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="KrishiDrishti - SEE. PREDICT. PROTECT. GROW."
              className="h-12 sm:h-14 w-auto max-w-[240px] object-contain rounded-lg shadow-xs group-hover:scale-105 transition-transform"
              loading="eager"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-emerald-900 leading-none">
                Krishi<span className="text-emerald-600">Drishti</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-stone-500 uppercase mt-0.5">
                See • Predict • Protect • Grow
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-stone-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-100/80 hover:text-stone-900 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-700" />
              <span>Dashboard & Sidebar</span>
            </Link>

            <Link
              href="/diagnosis"
              className="rounded-xl bg-emerald-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
            >
              Analyze Your Crop
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>AI-Powered Intelligent Agriculture Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
            Intelligent Crop Health & Smart Agriculture
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            KrishiDrishti combines deep learning computer vision, IoT soil hydrology, agro-weather microclimate models, and agentic farm advising into one unified agricultural intelligence ecosystem.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/diagnosis"
              className="flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-900 transition-all active:scale-[0.99]"
            >
              <ScanLine className="h-4 w-4" />
              <span>Analyze Your Crop</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-800 shadow-xs hover:bg-stone-50 transition-all"
            >
              <span>Explore KrishiDrishti</span>
              <ArrowRight className="h-4 w-4 text-stone-500" />
            </Link>
          </div>
        </div>

        {/* Live Interface Preview Graphic */}
        <div className="mt-14 rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-6 shadow-lg max-w-5xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 font-medium text-stone-700">KrishiDrishti Unified Farm Telemetry & AI Diagnosis</span>
            </div>
            <span className="font-semibold text-emerald-800">Station Active • Karnal Hub</span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Last AI Foliage Scan
              </span>
              <div className="text-base font-bold text-stone-900">
                Tomato • Early Blight
              </div>
              <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                94% Confidence • Moderate
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Root Zone Moisture
              </span>
              <div className="text-base font-bold text-sky-900">
                38% Volumetric
              </div>
              <span className="inline-block rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                Next Cycle: 06:30 PM (1,420 L)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Ecological Sustainability
              </span>
              <div className="text-base font-bold text-emerald-900">
                84 / 100 • Grade A
              </div>
              <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                48,500 L Water Saved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="px-6 py-20 bg-stone-100/70 border-t border-stone-200/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Complete Agricultural Intelligence Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Modular agricultural intelligence platform with pluggable FastAPI backend contracts and responsive edge design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={feat.title}
                  href={feat.href}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      {feat.badge && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {feat.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-900 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-emerald-800 group-hover:translate-x-1 transition-transform">
                    <span>Explore Module</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strong Closing CTA Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Empower Agricultural Productivity?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Test our trained computer vision leaf pathology model or explore the multi-modal agentic agricultural briefing.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/diagnosis"
                className="rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-md transition-all"
              >
                Analyze Crop Health Now
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-stone-700 bg-stone-800 px-6 py-3.5 text-sm font-semibold text-white hover:bg-stone-700 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white px-6 py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            title="Scroll to top"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="KrishiDrishti"
              className="h-7 w-auto object-contain rounded-xs group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-stone-800 group-hover:text-emerald-800 transition-colors">
              KrishiDrishti
            </span>
            <span>•</span>
            <span className="hidden sm:inline">Intelligent Crop Health & Smart Agriculture</span>
          </Link>
          <div className="flex items-center gap-4">
            <span>Empowering Farmers with Artificial Intelligence</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
