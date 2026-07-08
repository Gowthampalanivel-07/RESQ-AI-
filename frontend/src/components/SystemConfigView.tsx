"use client";

import React from "react";
import { Settings, Shield, Cpu, Palette, Globe, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function SystemConfigView() {
  const sections = [
    { title: "Neural Core", icon: Cpu, desc: "Manage OpenAI API keys and model parameters." },
    { title: "Strategic UI", icon: Palette, desc: "Mission map styling and glassmorphism levels." },
    { title: "Connectivity", icon: Globe, desc: "Backend port mapping and regional weather sync." },
    { title: "Security", icon: Lock, desc: "Encryption standards and command authorization." },
  ];

  return (
    <div className="h-full flex flex-col gap-12 p-12 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand/10 group-hover:border-brand/30 transition-all">
                <section.icon className="w-6 h-6 text-white/40 group-hover:text-brand transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-brand transition-colors">{section.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed font-medium">{section.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8 glass-card p-10 rounded-[3rem] border-white/5 bg-black/20">
            <h3 className="text-lg font-bold">Active Protocol</h3>
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest block mb-4">Neural Engine Key</label>
                    <div className="relative group">
                        <input 
                            type="password" 
                            defaultValue="••••••••••••••••••••••••" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-white/60 outline-none focus:border-brand/40 focus:bg-white/10 transition-all" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <span className="text-[9px] font-black text-brand uppercase tracking-widest bg-brand/10 px-2 py-1 rounded-md border border-brand/20">VALIDATED</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest block mb-4">Satellite Intensity</label>
                    <div className="h-1.5 w-full bg-white/5 rounded-full relative">
                        <div className="absolute left-0 top-0 h-full w-2/3 bg-brand shadow-[0_0_15px_#10b981]" />
                        <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-xl cursor-pointer hover:scale-125 transition-transform" />
                    </div>
                    <div className="flex justify-between mt-3">
                        <span className="text-[9px] text-white/20 font-black">LEGIBILITY</span>
                        <span className="text-[9px] text-white/20 font-black">CONTRAST</span>
                    </div>
                </div>

                <div className="pt-8">
                    <button className="w-full py-4 rounded-2xl bg-brand text-white text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Synchronize All Mission Layers
                    </button>
                    <p className="text-center text-[9px] text-white/20 uppercase tracking-widest mt-6 font-medium">
                        System Version: 1.3.0 Rev Delta
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
