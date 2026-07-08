"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Clock, MapPin, CheckCircle2, Siren, Activity, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: number;
  type: string;
  location: string;
  intensity: "critical" | "warning" | "info";
  time: string;
  status: string;
  description: string;
}

interface AlertFeedProps {
  isFocusMode?: boolean;
}

const intensityConfig = {
  critical: { color: "text-danger", bar: "bg-danger shadow-[0_0_10px_#ef4444]", badge: "bg-danger/10 border-danger/30 text-danger" },
  warning: { color: "text-warning", bar: "bg-warning shadow-[0_0_10px_#f59e0b]", badge: "bg-warning/10 border-warning/30 text-warning" },
  info: { color: "text-safe", bar: "bg-safe", badge: "bg-safe/10 border-safe/30 text-safe" },
};

function AlertSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="flex justify-between">
            <div className="h-2 w-20 skeleton rounded-full" />
            <div className="h-2 w-12 skeleton rounded-full" />
          </div>
          <div className="h-3 w-40 skeleton rounded-full" />
          <div className="h-2 w-full skeleton rounded-full" />
          <div className="h-6 w-32 skeleton rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function AlertFeed({ isFocusMode }: AlertFeedProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"all" | "critical" | "warning">("all");
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/alerts");
      if (!response.ok) throw new Error("Bad response");
      const data = await response.json();
      setAlerts(data);
      setIsConnected(true);
      setLastUpdated(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    } catch (error) {
      setIsConnected(false);
      // Fallback data so the UI isn't empty
      if (alerts.length === 0) {
        setAlerts([
          { id: 1, type: "flood", location: "Adyar River Basin", intensity: "critical", time: "Just now", status: "Rescue units dispatched", description: "Water levels exceeded safety thresholds by 2.4m." },
          { id: 2, type: "cyclone", location: "Marina Beach Coastal", intensity: "warning", time: "15 mins ago", status: "Evacuation in progress", description: "Wind speeds gusting up to 95 km/h. High wave warning." },
          { id: 3, type: "medical", location: "OMR Sector 4", intensity: "info", time: "32 mins ago", status: "Monitoring active", description: "Neural Core detected anomalous activity. Units on standby." },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLive) return;
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, [isLive, fetchAlerts]);

  const filteredAlerts = alerts.filter(a => filter === "all" ? true : a.intensity === filter);

  const containerClass = cn(
    "h-full glass-dark flex flex-col transition-all duration-500",
    isFocusMode ? "w-full rounded-none p-8" : "rounded-[3rem] border border-white/10 p-5"
  );

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <Siren className="w-4 h-4 text-danger animate-pulse-danger" />
          Live Crisis Feed
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <Wifi className="w-3 h-3 text-brand" />
            ) : (
              <WifiOff className="w-3 h-3 text-danger" />
            )}
            <span className={cn("text-[9px] font-black uppercase tracking-widest", isConnected ? "text-brand" : "text-danger")}>
              {isConnected ? "SYNCED" : "OFFLINE"}
            </span>
          </div>
          <button
            onClick={() => { setIsLoading(true); fetchAlerts(); }}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/30 hover:text-white"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-brand")} />
          </button>
        </div>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-4">
          Last sync: {lastUpdated}
        </p>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 bg-black/20 p-1.5 rounded-2xl border border-white/5">
        {(["all", "critical", "warning"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
              filter === f
                ? f === "critical" ? "bg-danger/10 text-danger shadow-xl border border-danger/20"
                  : f === "warning" ? "bg-warning/10 text-warning shadow-xl border border-warning/20"
                  : "bg-white/10 text-white shadow-xl border border-white/10"
                : "text-white/20 hover:text-white/40"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar overflow-x-hidden">
        {isLoading ? (
          <AlertSkeleton />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length > 0 ? filteredAlerts.map((alert: Alert, idx) => {
              const cfg = intensityConfig[alert.intensity];
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group transition-all duration-500"
                >
                  {/* Intensity Bar */}
                  <div className={cn(
                    "absolute -left-2 top-0 w-0.5 h-full rounded-full opacity-60 transition-all group-hover:opacity-100",
                    cfg.bar
                  )} />

                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border text-xs", cfg.badge)}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-white/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-white/30 mt-0.5 shrink-0" />
                      <h3 className="text-sm font-bold text-white group-hover:text-brand transition-colors cursor-default">{alert.location}</h3>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed mb-3 line-clamp-2 pl-5">{alert.description}</p>

                    <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg border-white/5 group-hover:border-white/20 transition-all w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                      <span className="text-[10px] font-bold text-brand uppercase tracking-tighter">{alert.status}</span>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <Activity className="w-8 h-8 text-white/5 mb-4 animate-pulse" />
                <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">No active alerts in this sector</span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 space-y-3">
        {/* Regional Risk Level */}
        <div className="glass px-4 py-3 rounded-2xl border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-white/30 uppercase font-black">Regional Risk Level</span>
            <span className="text-[10px] text-danger font-bold">
              {alerts.filter(a => a.intensity === "critical").length > 0 ? "88%" : "42%"}
            </span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: alerts.filter(a => a.intensity === "critical").length > 0 ? "88%" : "42%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn("h-full", alerts.filter(a => a.intensity === "critical").length > 0 ? "bg-danger shadow-[0_0_10px_#ef4444]" : "bg-brand")}
            />
          </div>
        </div>

        <button
          onClick={() => setIsLive(!isLive)}
          className={cn(
            "w-full py-2.5 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2",
            isLive
              ? "border-brand/30 text-brand bg-brand/5 hover:bg-brand/10"
              : "border-white/10 text-white/40 hover:text-white"
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-brand animate-pulse" : "bg-white/20")} />
          {isLive ? "PAUSE LIVE STREAM" : "RESUME LIVE STREAM"}
        </button>
      </div>
    </div>
  );
}
