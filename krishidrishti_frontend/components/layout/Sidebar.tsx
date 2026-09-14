"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  Compass,
  Droplets,
  CloudSun,
  Leaf,
  Activity,
  Bot,
  Sparkles,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  User,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { featureFlags } from "@/config/features";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useAuth, Farmer } from "@/lib/context/AuthContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  badge?: string;
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { farmer, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      title: t("dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
      enabled: true,
    },
    {
      title: t("cropDiagnosis"),
      href: "/diagnosis",
      icon: ScanLine,
      enabled: featureFlags.diagnosis,
      badge: t("coreAi"),
    },
    {
      title: t("cropRecommendation"),
      href: "/recommendations",
      icon: Compass,
      enabled: featureFlags.recommendations,
    },
    {
      title: t("smartIrrigation"),
      href: "/irrigation",
      icon: Droplets,
      enabled: featureFlags.irrigation,
    },
    {
      title: t("weatherIntelligence"),
      href: "/weather",
      icon: CloudSun,
      enabled: featureFlags.weather,
    },
    {
      title: t("sustainabilityScore"),
      href: "/sustainability",
      icon: Leaf,
      enabled: featureFlags.sustainability,
    },
    {
      title: t("farmMonitoring"),
      href: "/monitoring",
      icon: Activity,
      enabled: featureFlags.monitoring,
    },
    {
      title: t("aiAssistant"),
      href: "/assistant",
      icon: Bot,
      enabled: featureFlags.assistant,
    },
    {
      title: t("farmAdvisor"),
      href: "/advisor",
      icon: Sparkles,
      enabled: featureFlags.advisor,
      badge: t("agentic"),
    },
    {
      title: "Model Metrics",
      href: "/model-metrics",
      icon: Brain,
      enabled: true,
      badge: "EfficientNet",
    },
    {
      title: t("settings"),
      href: "/settings",
      icon: Settings,
      enabled: true,
    },
  ];

  const activeNavItems = navItems.filter((item) => item.enabled);

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-stone-900 text-stone-100 p-3 overflow-hidden select-none">
      <div>
        {/* Brand Header & Toggle Button */}
        <div className="flex items-center justify-between pb-4 pt-2 border-b border-stone-800/80 min-h-[64px] px-1 overflow-hidden">
          <Link
            href="/"
            title="Go to Homepage"
            className="flex items-center gap-2.5 overflow-hidden group cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-950/70 border border-emerald-800/60 p-1 group-hover:border-emerald-400 group-hover:scale-105 transition-all shadow-xs">
              <img
                src="/logo.png"
                alt="KrishiDrishti Logo"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  key="brand-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex flex-col whitespace-nowrap overflow-hidden"
                >
                  <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                    <span>Krishi</span>
                    <span className="text-emerald-400">Drishti</span>
                  </span>
                  <span className="text-[9px] font-semibold tracking-wider text-stone-400 uppercase">
                    Smart Agriculture
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Collapse/Expand Toggle Button on Desktop */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close button */}
          {setMobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Floating Expand button when sidebar is collapsed */}
        {isCollapsed && (
          <div className="pt-2 pb-1 flex justify-center">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              title="Expand sidebar"
              className="w-full py-1.5 flex items-center justify-center rounded-lg bg-stone-800/80 text-emerald-400 hover:bg-stone-700 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation links */}
        <nav className="mt-5 space-y-1.5">
          {activeNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  "flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors group relative overflow-hidden px-2 w-full",
                  isActive
                    ? "bg-emerald-800/90 text-white shadow-xs"
                    : "text-stone-300 hover:bg-stone-800/70 hover:text-white"
                )}
              >
                <div className="flex items-center justify-center shrink-0 w-10 h-6">
                  <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-emerald-300" : "text-stone-400 group-hover:text-stone-200")} />
                </div>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-center justify-between overflow-hidden whitespace-nowrap pl-2"
                    >
                      <span className="whitespace-nowrap font-medium text-stone-200">{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded ml-2 shrink-0",
                            isActive
                              ? "bg-emerald-950 text-emerald-200"
                              : "bg-stone-800 text-stone-400"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Farmer Profile & Logout */}
      <div className="mt-4 border-t border-stone-800/80 pt-3">
        <AnimatePresence initial={false}>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="rounded-xl bg-stone-800/70 p-3 border border-stone-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white text-xs font-bold">
                    {farmer ? farmer.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-200 truncate">
                      {farmer ? farmer.name : "Guest Farmer"}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {farmer ? farmer.farmName : "Not signed in"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    title="Sign out"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-700 transition-colors shrink-0 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 py-1"
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-800 text-white text-xs font-bold"
                title={farmer ? farmer.name : "Guest"}
              >
                {farmer ? farmer.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
              </div>
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop collapsible sidebar with spring-smooth motion.aside */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 256 }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="hidden lg:flex flex-col fixed inset-y-0 z-30 border-r border-stone-800/90 bg-stone-900 overflow-hidden"
      >
        {navContent}
      </motion.aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative flex w-72 max-w-xs flex-1 flex-col">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

export function TopNav({
  isCollapsed,
  setIsCollapsed,
  onOpenMobile,
  farmer,
}: {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  onOpenMobile: () => void;
  farmer?: Farmer | null;
}) {
  const { t } = useLanguage();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-stone-50/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-200/60 transition-colors"
          title="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar toggle button */}
        {setIsCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 transition-colors cursor-pointer border border-stone-200/70 shadow-2xs"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4 text-emerald-700" />
            ) : (
              <PanelLeftClose className="h-4 w-4 text-stone-600" />
            )}
          </button>
        )}

        <div className="text-sm font-medium text-stone-800 flex items-center gap-2">
          <span className="hidden sm:inline text-stone-500">{t("activeStation")}:</span>
          <span className="bg-stone-200/80 text-stone-900 px-2.5 py-1 rounded-md text-xs font-semibold">
            {t("stationName")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/diagnosis"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
        >
          <ScanLine className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("quickDiagnosis")}</span>
        </Link>

        {farmer && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-stone-800 leading-none">{farmer.name}</span>
              <span className="text-[10px] text-stone-500 leading-none mt-0.5">{farmer.farmName}</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-white text-xs font-bold shrink-0">
              {farmer.name.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        <Link
          href="/"
          title="Go to Homepage"
          className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-stone-200/60 transition-colors"
        >
          <img
            src="/logo.png"
            alt="KrishiDrishti"
            className="h-8 w-auto max-w-[100px] object-contain rounded-sm"
          />
        </Link>
      </div>
    </header>
  );
}
