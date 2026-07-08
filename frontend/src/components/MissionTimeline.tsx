"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  MapPin, 
  Scan, 
  Truck, 
  Activity, 
  AlertCircle,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionEvent {
  id: string;
  type: 'recon' | 'dispatch' | 'status' | 'alert' | 'success';
  time: string;
  message: string;
  location?: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

const initialEvents: MissionEvent[] = [
  { id: '1', type: 'status', time: '12:42:01', message: 'Neural Core Alpha Initialized', severity: 'info' },
  { id: '2', type: 'recon', time: '12:45:34', message: 'Drone-04: Structural Scan Complete', location: 'Sector 7', severity: 'success' },
  { id: '3', type: 'dispatch', time: '12:48:12', message: 'Unit MED-01: Dispatched to Adyar Basin', location: 'Sector 4', severity: 'warning' },
];

const eventTemplates = [
  { type: 'recon', message: 'Drone-{X}: Bounding Box Syncing...', location: 'Sector {Y}', severity: 'info' },
  { type: 'dispatch', message: 'Unit {Z}: En-route to Casualty Zone', location: 'Sector {W}', severity: 'warning' },
  { type: 'status', message: 'Satellite Uplink: Signal Strength 98%', severity: 'success' },
  { type: 'alert', message: 'Anomalous Heat Signature Detected', location: 'Sector 12', severity: 'critical' },
  { type: 'success', message: 'Resource Drop: Successful Extraction', location: 'Sector 5', severity: 'success' },
];

export function MissionTimeline() {
  const [events, setEvents] = useState<MissionEvent[]>(initialEvents);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      const newEvent: MissionEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: template.type as any,
        time: new Date().toLocaleTimeString('en-GB'),
        message: template.message
          .replace('{X}', (Math.floor(Math.random() * 8) + 1).toString())
          .replace('{Y}', (Math.floor(Math.random() * 10) + 1).toString())
          .replace('{Z}', ['LOG-04', 'FIRE-02', 'MED-09'][Math.floor(Math.random() * 3)])
          .replace('{W}', (Math.floor(Math.random() * 15) + 1).toString()),
        location: template.location,
        severity: template.severity as any,
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 15));
    }, 12000); // New event every 12s

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'recon': return Scan;
      case 'dispatch': return Truck;
      case 'alert': return AlertCircle;
      case 'success': return CheckCircle2;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger bg-danger/10 border-danger/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'success': return 'text-brand bg-brand/10 border-brand/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex flex-col h-full glass-dark rounded-[3rem] border border-white/10 overflow-hidden relative group">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
             <History className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-[0.2em]">Mission Timeline</h3>
            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-3 h-3 text-brand animate-pulse" />
                Live Mission Oracle
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {events.map((event) => {
            const Icon = getIcon(event.type);
            const colorClass = getSeverityColor(event.severity);
            
            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group/item"
              >
                {/* Vertical Line Connector */}
                <div className="absolute left-4 top-10 bottom-[-16px] w-px bg-white/5 group-last/item:hidden" />
                
                <div className="flex gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 z-10 transition-all",
                    colorClass
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 pb-4 border-b border-white/5 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[10px] font-black text-white/30 tracking-widest">{mounted ? event.time : "--:--:--"}</span>
                       {event.location && (
                         <div className="flex items-center gap-1.5">
                            <MapPin className="w-2.5 h-2.5 text-white/20" />
                            <span className="text-[8px] font-black uppercase text-white/20 tracking-tighter">{event.location}</span>
                         </div>
                       )}
                    </div>
                    <p className="text-[11px] font-bold text-white/80 leading-tight group-hover/item:text-white transition-colors">
                      {event.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white/[0.01] flex items-center justify-center border-t border-white/5">
         <span className="text-[8px] text-white/20 uppercase font-black tracking-[0.4em] animate-pulse">Awaiting Operational Events...</span>
      </div>
    </div>
  );
}
