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
      <motion.div
        animate={{ paddingLeft: isCollapsed ? 68 : 256 }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="flex flex-col min-h-screen"
      >
        <TopNav
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onOpenMobile={() => setMobileOpen(true)}
          farmer={farmer}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
