"use client";

import React from "react";
import { SystemConfigView } from "@/components/SystemConfigView";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 p-8 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent)] flex flex-col gap-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col gap-8"
      >
        <div className="flex items-center gap-4 mb-4 px-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter italic">System Configuration</h2>
                 <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Neural Core & UI Preferences</p>
            </div>
        </div>
        <div className="flex-1 glass-dark rounded-[3rem] border border-white/10 overflow-hidden">
            <SystemConfigView />
        </div>
      </motion.div>
    </div>
  );
}
