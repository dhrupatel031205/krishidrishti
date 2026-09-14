import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  accentColor?: "green" | "amber" | "red" | "blue" | "earth";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "green",
  className,
}: StatCardProps) {
  const colorStyles = {
    green: {
      iconBg: "bg-emerald-50 text-emerald-800",
      border: "hover:border-emerald-300",
    },
    amber: {
      iconBg: "bg-amber-50 text-amber-800",
      border: "hover:border-amber-300",
    },
    red: {
      iconBg: "bg-rose-50 text-rose-800",
      border: "hover:border-rose-300",
    },
    blue: {
      iconBg: "bg-sky-50 text-sky-800",
      border: "hover:border-sky-300",
    },
    earth: {
      iconBg: "bg-stone-100 text-stone-800",
      border: "hover:border-stone-300",
    },
  }[accentColor];

  return (
    <div
      className={cn(
        "rounded-xl bg-white p-5 border border-stone-200/80 shadow-xs transition-all duration-200",
        colorStyles.border,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
          {title}
        </span>
        <div className={cn("p-2 rounded-lg", colorStyles.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-stone-900">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              trend.neutral
                ? "bg-stone-100 text-stone-600"
                : trend.positive
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-stone-500 line-clamp-1">{subtitle}</p>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: "healthy" | "low" | "moderate" | "critical" | "online" | "warning" | "offline";
  label?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const config = {
    healthy: { bg: "bg-emerald-100/80", text: "text-emerald-800", dot: "bg-emerald-500", defaultLabel: "Healthy" },
    low: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", defaultLabel: "Low Risk" },
    moderate: { bg: "bg-amber-100/80", text: "text-amber-800", dot: "bg-amber-500", defaultLabel: "Moderate" },
    critical: { bg: "bg-rose-100/90", text: "text-rose-800", dot: "bg-rose-500", defaultLabel: "Critical Alert" },
    online: { bg: "bg-emerald-100/80", text: "text-emerald-800", dot: "bg-emerald-500", defaultLabel: "Active / Online" },
    warning: { bg: "bg-amber-100/80", text: "text-amber-800", dot: "bg-amber-500", defaultLabel: "Attention Needed" },
    offline: { bg: "bg-stone-100", text: "text-stone-600", dot: "bg-stone-400", defaultLabel: "Offline" },
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        config.bg,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {label || config.defaultLabel}
    </span>
  );
}

export function SimulationBadge() {
  let label = "Simulation Mode";
  try {
    const lang = typeof window !== "undefined" ? localStorage.getItem("krishidrishti_language") : "en";
    if (lang === "hi") label = "सिमुलेशन मोड";
    else if (lang === "pa") label = "ਸਿਮੂਲੇਸ਼ਨ ਮੋਡ";
    else if (lang === "te") label = "సిమ్యులేషన్ మోడ్";
  } catch (e) {}

  return (
    <span className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50/90 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      {label}
    </span>
  );
}
