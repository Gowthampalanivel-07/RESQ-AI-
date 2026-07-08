"use client";

import React from "react";
import { 
  AlertTriangle, 
  Map as MapIcon, 
  Shield, 
  Zap, 
  MessageSquare, 
  Settings,
  Bell,
  Activity,
  Library
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { id: 'dashboard', icon: MapIcon, label: "Tactical Hub", href: "/dashboard" },
    { id: 'library', icon: Library, label: "Mission Library", href: "/library" },
    { id: 'alerts', icon: AlertTriangle, label: "Live Alerts", href: "/alerts" },
    { id: 'analytics', icon: Activity, label: "Strategic Data", href: "/analytics" },
    { id: 'chat', icon: MessageSquare, label: "AI Guidance", href: "/chat" },
    { id: 'settings', icon: Settings, label: "System Config", href: "/settings" },
  ];

  return (
    <div className="h-screen w-64 glass-dark border-r border-white/10 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          <Shield className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">ResQAI</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand font-black">Tactical Layer</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.id} href={item.href}>
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group text-xs font-black uppercase tracking-widest mb-2",
                  isActive 
                    ? "bg-brand/10 text-brand border border-brand/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                    : "text-white/30 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-brand" : "group-hover:text-white")} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_10px_#10b981]" 
                  />
                )}
              </motion.button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
        <Link 
          href="/dashboard"
          className="block glass px-4 py-3 rounded-2xl mt-4 cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase text-white/40 font-black tracking-widest">Core Status</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-white/70 uppercase">Mission Ready</p>
        </Link>
      </div>
    </div>
  );
}
