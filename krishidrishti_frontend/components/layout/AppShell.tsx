"use client";

import React, { useState } from "react";
import { Sidebar, TopNav } from "./Sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { farmer } = useAuth();

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      {/* On mobile sidebar is a drawer — no left padding needed */}
      <div className="flex flex-col min-h-screen lg:hidden">
        <TopNav
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onOpenMobile={() => setMobileOpen(true)}
          farmer={farmer}
        />
        <main className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      <motion.div
        animate={{ paddingLeft: isCollapsed ? 68 : 256 }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="hidden lg:flex flex-col min-h-screen"
      >
        <TopNav
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onOpenMobile={() => setMobileOpen(true)}
          farmer={farmer}
        />
        <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
