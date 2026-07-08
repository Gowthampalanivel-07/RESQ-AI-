"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AIChatbot } from "@/components/AIChatbot";
import { TacticalHUD } from "@/components/TacticalHUD";
import { Search, Bell, Shield, Activity, Radio, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen w-full relative bg-black overflow-hidden font-sans selection:bg-brand/30 selection:text-white">
      {/* --- Permanent Tactical Background Interface (Pure CSS/Code) --- */}
      
      {/* 1. Base Digital Neural Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] select-none scale-110" 
           style={{ backgroundImage: 'radial-gradient(#10b981 0.8px, transparent 0.8px)', backgroundSize: '40px 40px' }} />
      
      {/* 2. Tactical Strategic Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] select-none" 
           style={{ backgroundImage: 'linear-gradient(#10b981 0.5px, transparent 0.5px), linear-gradient(90deg, #10b981 0.5px, transparent 0.5px)', backgroundSize: '120px 120px' }} />
      
      {/* 3. Neural Sync Radial Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_75%)] animate-pulse" />

      {/* 4. Strategic Scanning Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(16,185,129,0)_50%,rgba(16,185,129,0.1)_50%)] bg-[length:100%_4px]" />

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Real-time Strategic Header - Persistent across all mission layers */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/60 backdrop-blur-3xl z-30">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Cpu className="w-6 h-6 text-brand animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 uppercase italic text-white">
                  RESQ<span className="text-brand">AI</span> 
                  <span className="text-[10px] bg-brand/10 text-brand px-3 py-1 rounded-full border border-brand/20 ml-2 animate-pulse tracking-widest non-italic font-black">
                    STRATEGIC COMMAND
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl px-12 hidden xl:block text-white">
             <div className="flex items-center gap-16 justify-center">
                <div className="flex flex-col items-center group cursor-help">
                   <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1 group-hover:text-danger">Active Crises</span>
                   <span className="text-lg font-black text-danger animate-pulse">04</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center group cursor-help">
                   <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1 group-hover:text-safe">Lives Saved</span>
                   <span className="text-lg font-black text-safe tabular-nums">1,240</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center group cursor-help">
                   <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1 group-hover:text-brand">Mission Efficacy</span>
                   <span className="text-lg font-black text-brand tracking-tighter">98.2%</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                <Activity className="w-4 h-4 text-brand animate-bounce" />
                <span className="text-[10px] font-black text-white italic uppercase tracking-widest">Neural Link Active</span>
            </div>
            <div className="flex items-center gap-6">
                <Search className="w-5 h-5 text-white/30 hover:text-white transition-colors cursor-pointer" />
                <div className="relative">
                  <Bell className="w-5 h-5 text-white/30 hover:text-white transition-colors cursor-pointer" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full shadow-[0_0_15px_#ef4444] animate-ping" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center hover:bg-brand transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Shield className="w-5 h-5 text-white" />
                </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden flex flex-col">
          {mounted && children}
        </main>
      </div>

      <AIChatbot />
      <TacticalHUD />

      {/* Persistent Scan-lines Effect */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] select-none overflow-hidden h-full w-full">
         <div className="h-1 bg-white/10 w-full animate-scan-line shadow-[0_0_20px_white]" />
      </div>
    </div>
  );
}
