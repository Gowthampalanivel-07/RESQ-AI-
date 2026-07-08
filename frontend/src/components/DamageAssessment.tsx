"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  Target, 
  Database, 
  Cpu, 
  Layers, 
  Eye, 
  Zap,
  Activity,
  RefreshCw,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DamageObject {
  id: number;
  label: string;
  damage_score: string;
  type: string;
  coordinates: { x: string; y: string };
}

interface DamageAssessmentData {
  mission_id: string;
  summary_impact: string;
  detections: DamageObject[];
}

export function DamageAssessment() {
  const [scanPos, setScanPos] = useState(0);
  const [activeDetections, setActiveDetections] = useState<number[]>([]);
  const [assessmentData, setAssessmentData] = useState<DamageAssessmentData | null>(null);
  const [isThermal, setIsThermal] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [isReScanning, setIsReScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDamage = async () => {
    setIsReScanning(true);
    try {
      const response = await fetch("http://localhost:8000/damage-assessment");
      const data = await response.json();
      setAssessmentData(data);
    } catch (error) {
      console.error("Neural Core Connection Error:", error);
    } finally {
      setTimeout(() => setIsReScanning(false), 2000);
    }
  };

  useEffect(() => {
    fetchDamage();
    const interval = setInterval(fetchDamage, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(prev => (prev >= 100 ? 0 : prev + 1));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!assessmentData) return;
    
    const currentActive = assessmentData.detections
      .filter(d => parseFloat(d.coordinates.y) < scanPos + 10 && parseFloat(d.coordinates.y) > scanPos - 10)
      .map(d => d.id);
    
    if (currentActive.length > 0) {
      setActiveDetections(prev => Array.from(new Set([...prev, ...currentActive])));
    }
  }, [scanPos, assessmentData]);

  return (
    <div className="glass-dark rounded-[2.5rem] border border-white/10 overflow-hidden relative group h-full flex flex-col">
      {/* HUD Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center">
            <Scan className="w-5 h-5 text-danger animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-[0.2em]">Recon HUD: {assessmentData?.mission_id || "Drone-04"}</h3>
            <p className="text-[9px] text-danger font-bold uppercase tracking-widest animate-pulse">Scanning Active Disaster Zone...</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/5 border border-brand/20">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[8px] text-brand font-black uppercase tracking-widest">Signal Active</span>
            </div>
            <Activity className="w-4 h-4 text-brand" />
        </div>
      </div>

      {/* Hero Image Container */}
      <div className="relative flex-1 w-full overflow-hidden min-h-[300px]">
        <img 
          src="/drone_flood_view.png" 
          alt="Mission View" 
          className={cn(
            "w-full h-full object-cover grayscale-[0.5] contrast-[1.2] transition-all duration-[10s] group-hover:scale-105",
            isThermal ? "invert hue-rotate-180 brightness-150 saturate-200" : "opacity-80"
          )}
        />
        
        {isReScanning && (
          <div className="absolute inset-0 bg-brand/10 backdrop-blur-[2px] z-30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-brand animate-spin" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em] animate-pulse">Re-calibrating Neural Sensors...</span>
            </div>
          </div>
        )}
        
        {/* Scanning Line */}
        <motion.div 
          style={{ top: `${scanPos}%` }}
          className="absolute left-0 w-full h-0.5 bg-brand/50 shadow-[0_0_20px_#10b981] z-10 pointer-events-none"
        />

        {/* Bounding Boxes */}
        {showLabels && assessmentData?.detections.map((d: DamageObject) => (
          <AnimatePresence key={d.id}>
            {activeDetections.includes(d.id) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ top: d.coordinates.y, left: d.coordinates.x, width: "80px", height: "60px" }}
                className={cn(
                  "absolute border-2 glass backdrop-blur-none pointer-events-none z-20 transition-all duration-500",
                  parseFloat(d.damage_score) >= 90 ? "border-danger shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "border-brand shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                )}
              >
                <div className="absolute -top-6 left-0 flex items-center gap-1.5 whitespace-nowrap bg-black/60 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-md">
                   <Target className="w-3 h-3 text-brand" />
                   <span className="text-[9px] font-black text-white uppercase">{d.label} : {d.damage_score}</span>
                </div>
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* HUD Data Overlays */}
        <div className="absolute bottom-4 left-4 z-20 space-y-2 pointer-events-none">
           <div className="glass px-3 py-2 rounded-xl border-white/5 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-brand" />
              <div>
                <p className="text-[9px] text-white/40 uppercase font-black">Neural Processor</p>
                <p className="text-[10px] text-white font-bold">ResQ-Vision v2.4 Active</p>
              </div>
           </div>
           <div className="glass px-3 py-2 rounded-xl border-white/5 flex items-center gap-3">
              <Database className="w-4 h-4 text-safe" />
              <div>
                <p className="text-[9px] text-white/40 uppercase font-black">Satellite Sync</p>
                <p className="text-[10px] text-white font-bold">Ready - 0.4s Latency</p>
              </div>
           </div>
        </div>

        <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
            <div className="glass-dark px-4 py-3 rounded-2xl border-white/10 text-right max-w-[200px]">
                <span className="text-[8px] text-danger uppercase font-black tracking-widest block mb-1">Impact Summary</span>
                <span className="text-[10px] font-bold text-white block leading-tight">{assessmentData?.summary_impact || "Analyzing structural impact..."}</span>
                <div className="h-1 bg-white/5 rounded-full mt-2 w-32 overflow-hidden ml-auto">
                    <motion.div 
                        animate={{ width: "85%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-danger animate-pulse shadow-[0_0_10px_#ef4444]" 
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
        <div className="flex gap-2">
            <button 
              onClick={() => setIsThermal(!isThermal)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all",
                isThermal ? "bg-brand text-white border-brand shadow-[0_0_15px_#10b981]" : "bg-white/5 text-white/40 border-white/10 hover:text-white"
              )}
            >
                <Layers className="w-3.5 h-3.5" />
                TOGGLE THERMAL
            </button>
            <button 
              onClick={() => setShowLabels(!showLabels)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all",
                showLabels ? "bg-white/10 text-white border-white/20" : "bg-white/5 text-white/40 border-white/10 hover:text-white"
              )}
            >
                <Eye className="w-3.5 h-3.5" />
                OBJECT LABELS
            </button>
        </div>
        <button 
          onClick={fetchDamage}
          disabled={isReScanning}
          className="px-6 py-2 rounded-xl bg-danger text-white text-[10px] font-black uppercase tracking-[0.2em] border border-danger/20 flex items-center gap-2 hover:bg-danger/80 transition-all shadow-[0_4px_15px_rgba(239,68,68,0.2)] disabled:opacity-50"
        >
            <Zap className={cn("w-3.5 h-3.5 text-white fill-white", isReScanning && "animate-bounce")} />
            RE-RUN ANALYSIS
        </button>
      </div>
    </div>
  );
}
