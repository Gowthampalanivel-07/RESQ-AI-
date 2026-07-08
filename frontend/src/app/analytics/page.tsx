"use client";

import React from "react";
import { StrategicDataView } from "@/components/StrategicDataView";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 p-8 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent)] flex flex-col gap-8">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full flex flex-col gap-8"
      >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-brand" />
                </div>
                <div>
                     <h2 className="text-2xl font-black uppercase tracking-tighter italic">Strategic Data Core</h2>
                     <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Predictive Disaster Intelligence</p>
                </div>
            </div>
        </div>
        <div className="flex-1 glass-dark rounded-[3rem] border border-white/10 overflow-hidden">
            <StrategicDataView />
        </div>
      </motion.div>
    </div>
  );
}
