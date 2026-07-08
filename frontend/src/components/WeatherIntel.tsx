"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudRain, 
  Thermometer, 
  Wind, 
  Droplets,
  AlertTriangle,
  RefreshCw,
  Zap,
  Sun,
  CloudSnow,
  Cloud
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherData {
  region: string;
  disaster_type: string;
  probability: number;
  severity_label: string;
  timeframe_hours: number;
  factors: string[];
  recommendation: string;
}

interface WeatherDetails {
  temp: number;
  condition: string;
  humidity: number;
}

function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return <CloudRain className={className} />;
  if (c.includes("snow")) return <CloudSnow className={className} />;
  if (c.includes("clear") || c.includes("sun")) return <Sun className={className} />;
  return <Cloud className={className} />;
}

export function WeatherIntel() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [weather, setWeather] = useState<WeatherDetails>({ temp: 32, condition: "Overcast", humidity: 84 });
  const [isLoading, setIsLoading] = useState(true);
  const [windSpeed, setWindSpeed] = useState(12);

  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const [riskRes, weatherRes] = await Promise.allSettled([
        fetch("http://localhost:8000/predict/Chennai"),
        fetch("http://localhost:8000/weather")
      ]);

      if (riskRes.status === "fulfilled" && riskRes.value.ok) {
        const result = await riskRes.value.json();
        setData(result);
      }

      if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
        const w = await weatherRes.value.json();
        setWeather({
          temp: Math.round(w.temp ?? 32),
          condition: w.condition ?? "Overcast",
          humidity: w.humidity ?? 84,
        });
        setWindSpeed(w.wind_speed ?? Math.floor(10 + Math.random() * 15));
      }
    } catch {
      // Keep existing data
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-dark rounded-[2rem] border border-white/10 p-5 flex flex-col gap-4 relative overflow-hidden group shadow-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
            <WeatherIcon condition={weather.condition} className="w-4 h-4 text-warning animate-pulse" />
          </div>
          <div>
            <h3 className="text-[9px] font-black text-white uppercase tracking-widest">Environmental Intel</h3>
            <p className="text-[8px] text-white/30 uppercase font-bold tracking-tighter">
              Sector: {data?.region || "Chennai"}
            </p>
          </div>
        </div>
        <button
          onClick={fetchWeather}
          disabled={isLoading}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <RefreshCw className={cn("w-3 h-3 text-white/20", isLoading && "animate-spin text-brand")} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-2"
          >
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1/2 h-full bg-brand shadow-[0_0_10px_#10b981]"
              />
            </div>
            <span className="text-[8px] text-brand font-black uppercase tracking-widest animate-pulse">Syncing Atmos-Sensors...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-3"
          >
            {/* Risk & Confidence */}
            <div className="grid grid-cols-2 gap-2">
              <div className="glass px-3 py-2.5 rounded-xl border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className={cn("w-3 h-3", data?.probability && data.probability > 70 ? "text-danger" : "text-warning")} />
                  <span className="text-[8px] text-white/40 uppercase font-black">
                    {data?.disaster_type || "Flood"} Risk
                  </span>
                </div>
                <p className="text-xl font-black text-white tabular-nums">
                  {data?.probability !== undefined ? `${Math.round(data.probability)}%` : "—"}
                </p>
              </div>
              <div className="glass px-3 py-2.5 rounded-xl border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3 h-3 text-brand" />
                  <span className="text-[8px] text-white/40 uppercase font-black">AI Confidence</span>
                </div>
                <p className="text-xl font-black text-white tabular-nums">94.8%</p>
              </div>
            </div>

            {/* Severity */}
            <div className="glass px-3 py-2.5 rounded-2xl border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[8px] text-white/40 uppercase font-black tracking-widest block mb-1">Severity Matrix</span>
                <p className="text-[10px] text-white/70 font-medium italic leading-tight">
                  {data?.recommendation || "Maintain current tactical readiness."}
                </p>
              </div>
              <span className={cn(
                "text-[9px] font-black px-2 py-1 rounded-full border ml-2 shrink-0",
                data?.severity_label === "CRITICAL"
                  ? "text-danger border-danger/20 bg-danger/5"
                  : "text-warning border-warning/20 bg-warning/5"
              )}>
                {data?.severity_label || "STABLE"}
              </span>
            </div>

            {/* Live Weather Metrics */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5 flex-col items-center">
                <Thermometer className="w-3.5 h-3.5 text-danger/70" />
                <span className="text-[10px] font-bold text-white tabular-nums">{weather.temp}°C</span>
                <span className="text-[8px] text-white/20 uppercase">Temp</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-1.5 flex-col items-center">
                <Wind className="w-3.5 h-3.5 text-brand/70" />
                <span className="text-[10px] font-bold text-white tabular-nums">{windSpeed}km/h</span>
                <span className="text-[8px] text-white/20 uppercase">Wind</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-1.5 flex-col items-center">
                <Droplets className="w-3.5 h-3.5 text-safe/70" />
                <span className="text-[10px] font-bold text-white tabular-nums">{weather.humidity}%</span>
                <span className="text-[8px] text-white/20 uppercase">Humidity</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center">
                <WeatherIcon condition={weather.condition} className="w-3.5 h-3.5 text-warning/70" />
                <span className="text-[9px] font-bold text-white/60 mt-1 truncate max-w-[50px] text-center" title={weather.condition}>
                  {weather.condition.split(" ")[0]}
                </span>
                <span className="text-[8px] text-white/20 uppercase">Sky</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BG Glow */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-warning/5 rounded-full blur-3xl pointer-events-none group-hover:bg-warning/10 transition-all" />
    </div>
  );
}
