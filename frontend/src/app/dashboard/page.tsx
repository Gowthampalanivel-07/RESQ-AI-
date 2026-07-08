"use client";

import React from "react";
import { CrisisMap } from "@/components/CrisisMap";
import { AlertFeed } from "@/components/AlertFeed";
import { SOSButton } from "@/components/SOSButton";
import { DamageAssessment } from "@/components/DamageAssessment";
import { TacticalAnalytics } from "@/components/TacticalAnalytics";
import { MissionTimeline } from "@/components/MissionTimeline";
import { NeuralCoreSync } from "@/components/NeuralCoreSync";
import { WeatherIntel } from "@/components/WeatherIntel";
import { IncidentReportModal } from "@/components/IncidentReportModal";
import { motion } from "framer-motion";
import { useState } from "react";

export default function DashboardPage() {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="flex-1 p-8 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-12 gap-8 h-full"
      >
        {/* Left Column: Analytics */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-8 h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-8">
                <TacticalAnalytics />
                <div className="flex-1 min-h-[300px]">
                    <MissionTimeline />
                </div>
            </div>
        </div>

        {/* Middle Column: Map & CV Recon */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-8 h-full">
            <div className="h-[60%] glass-dark rounded-[3rem] border border-white/10 relative overflow-hidden group shadow-2xl">
                <CrisisMap />
                <SOSButton />
                <div className="absolute top-8 left-8 z-10 hidden sm:flex flex-col gap-4">
                    <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl border-white/10">
                        <div className="w-2 h-2 bg-danger rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Recon</span>
                    </div>
                    <button 
                      onClick={() => setIsReportOpen(true)}
                      className="flex items-center gap-3 bg-danger/10 border border-danger/40 px-4 py-2 rounded-2xl hover:bg-danger/20 transition-all group shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    >
                        <div className="w-2 h-2 bg-danger rounded-full shadow-[0_0_10px_#ef4444]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-danger group-hover:text-white transition-colors">Emergency Report</span>
                    </button>
                </div>
                <div className="absolute top-8 right-8 z-10 w-64 hidden xl:block">
                    <WeatherIntel />
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <DamageAssessment />
            </div>
        </div>

        {/* Right Column: Intelligence & Bot */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-8 h-full overflow-hidden">
            <div className="h-[40%] xl:h-[45%] overflow-hidden">
                <AlertFeed />
            </div>
            <div className="flex-1 overflow-hidden">
                <NeuralCoreSync />
            </div>
        </div>
      </motion.div>

      <IncidentReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />
    </div>
  );
}
