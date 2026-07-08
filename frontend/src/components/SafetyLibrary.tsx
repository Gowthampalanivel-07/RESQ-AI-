"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Info,
  Play,
  ArrowRight,
  Shield,
  Zap,
  Activity,
  Droplets,
  Flame,
  Wind
} from "lucide-react";
import { safetyVideos, SafetyVideo } from "../data/safetyVideos";
import { cn } from "@/lib/utils";

const disasterIcons = {
  flood: Droplets,
  earthquake: Activity,
  cyclone: Wind,
  wildfire: Flame
};

export function SafetyLibrary() {
  const [selectedType, setSelectedType] = useState<SafetyVideo['disasterType']>('flood');

  const filteredVideos = safetyVideos.filter(v => v.disasterType === selectedType);

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {(['flood', 'earthquake', 'cyclone', 'wildfire'] as const).map((type) => {
          const Icon = disasterIcons[type];
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 rounded-2xl border transition-all whitespace-nowrap",
                isActive 
                  ? "bg-brand/20 border-brand text-brand shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "animate-pulse" : "")} />
              <span className="text-[11px] font-black uppercase tracking-widest">{type} Mission Library</span>
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            {filteredVideos.map((video) => (
              <div key={video.id} className="group flex flex-col gap-4">
                 <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            video.phase === 'before' ? "bg-warning/10 border-warning/30 text-warning" : "bg-safe/10 border-safe/30 text-safe"
                        )}>
                            Mission: {video.phase === 'before' ? 'PRE-IMPACT' : 'POST-IMPACT'}
                        </span>
                    </div>
                 </div>

                 <div className="relative aspect-video rounded-3xl overflow-hidden glass border border-white/10 group-hover:border-brand/40 transition-all shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {/* HUD Overlay when not playing would be cool but iframe covers it */}
                 </div>

                 <div className="px-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand transition-colors">{video.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">
                        {video.description}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-brand font-black uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-lg border border-brand/10">
                            <Shield className="w-3.5 h-3.5" />
                            Validated Protocol
                        </div>
                    </div>
                 </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Resilience Checklist Section */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-[2.5rem] p-8 mt-12 border-white/5 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Quick Mission Checklist</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-black">Strategic Response Protocol</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "KNOWLEDGE BEYOND TACTICS", desc: "Understanding the science of the hazard leads to better situational awareness." },
                        { title: "COMMUNITY RESILIENCE", desc: "Coordinating with the Volunteer Hub ensures distributed resource allocation." },
                        { title: "NEURAL CORE ANALYTICS", desc: "Use the Live AI Chatbot for localized safety protocols in 10+ languages." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-2 p-4 glass rounded-2xl border-white/5 hover:border-white/20 transition-all group">
                            <h4 className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                {item.title}
                            </h4>
                            <p className="text-[11px] text-white/50 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
