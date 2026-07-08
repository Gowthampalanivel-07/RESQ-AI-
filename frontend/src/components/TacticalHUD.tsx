"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Battery, 
  Radio,
  Crosshair,
  Satellite,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TacticalHUD() {
  const [coords, setCoords] = useState({ lat: "13.0827° N", lng: "80.2707° E" });
  const [signal, setSignal] = useState(4);
  const [battery, setBattery] = useState(88);
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Live clock
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const clockInterval = setInterval(tick, 1000);

    // Simulate telemetry
    const telemetryInterval = setInterval(() => {
      const latOffset = (Math.random() * 0.001 - 0.0005).toFixed(4);
      const lngOffset = (Math.random() * 0.001 - 0.0005).toFixed(4);
      setCoords({
        lat: `${(13.0827 + parseFloat(latOffset)).toFixed(4)}° N`,
        lng: `${(80.2707 + parseFloat(lngOffset)).toFixed(4)}° E`,
      });
      setBattery(prev => (prev > 5 ? parseFloat((prev - 0.05).toFixed(2)) : 100));
      if (Math.random() > 0.85) setSignal(Math.floor(Math.random() * 2) + 3);
    }, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-8 left-[50%] -translate-x-1/2 z-[90] flex items-center gap-4 pointer-events-none">
      {/* GPS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark px-5 py-3 rounded-2xl border border-white/10 flex flex-col items-center min-w-[150px]"
      >
        <div className="flex items-center gap-2 mb-1">
          <Crosshair className="w-3 h-3 text-brand animate-pulse" />
          <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">GPS Baseline</span>
        </div>
        <p className="text-[10px] font-mono text-white font-bold tabular-nums">{coords.lat}</p>
        <p className="text-[10px] font-mono text-white font-bold tabular-nums">{coords.lng}</p>
      </motion.div>

      {/* Main HUD Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark px-8 py-4 rounded-[2rem] border border-brand/20 flex items-center gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      >
        {/* Live Clock */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-brand" />
          <div className="flex flex-col">
            <span className="text-[8px] text-white/30 uppercase font-black">Mission Time</span>
            <span className="text-[11px] font-black text-white font-mono tabular-nums tracking-widest">{time}</span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/10" />

        {/* Bearing */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Compass className="w-6 h-6 text-brand animate-spin-slow" />
            <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-white/30 uppercase font-black">Bearing</span>
            <span className="text-[10px] font-black text-white italic">342° NW</span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/10" />

        {/* Signal */}
        <div className="flex items-center gap-3">
          <Satellite className="w-5 h-5 text-brand" />
          <div className="flex flex-col">
            <span className="text-[8px] text-white/30 uppercase font-black">Uplink</span>
            <div className="flex gap-0.5 items-end mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={cn("w-1 rounded-sm transition-all", 
                    i <= signal ? "bg-brand" : "bg-white/10",
                    `h-${i + 1}`
                  )}
                  style={{ height: `${(i + 1) * 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-px h-8 bg-white/10" />

        {/* Battery */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Battery className={cn("w-5 h-5", battery < 20 ? "text-danger" : "text-brand")} />
            {battery < 20 && <div className="absolute inset-0 bg-danger/20 blur-lg rounded-full animate-pulse" />}
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-white/30 uppercase font-black">Energy</span>
            <span className={cn("text-[10px] font-black italic tabular-nums", battery < 20 ? "text-danger" : "text-white")}>
              {Math.round(battery)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Latency */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark px-5 py-3 rounded-2xl border border-white/10 flex flex-col items-center min-w-[110px]"
      >
        <div className="flex items-center gap-2 mb-1">
          <Radio className="w-3 h-3 text-brand animate-pulse" />
          <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Pulse Delay</span>
        </div>
        <p className="text-[10px] font-mono text-brand font-bold">
          {8 + Math.floor(Math.random() * 8)}ms <span className="text-[8px] text-white/20 font-normal">SECURE</span>
        </p>
      </motion.div>
    </div>
  );
}
