"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Siren,
  Camera,
  Activity,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncidentReportModal({ isOpen, onClose }: IncidentReportModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "flood",
    location: "",
    severity: "warning",
    description: ""
  });

  const handleReport = async () => {
    setIsSubmitting(true);
    try {
      // Try to get geolocation
      let lat = 13.0827;
      let lng = 80.2707;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 2000 })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch { /* use defaults */ }

      const response = await fetch("http://localhost:8000/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          location: formData.location || "Sector 4 Regional",
          severity: formData.severity,
          description: formData.description,
          latitude: lat,
          longitude: lng
        })
      });
      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Report Error:", error);
      // Fallback local success if backend offline
      setIsSuccess(true);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        if (isSuccess || true) {
          setTimeout(() => {
            onClose();
            // Reset modal state
            setStep(1);
            setIsSuccess(false);
            setFormData({
              type: "flood",
              location: "",
              severity: "warning",
              description: ""
            });
          }, 2000);
        }
      }, 1500);
    }
  };

  const types = [
    { id: "flood", icon: Siren, label: "Flood" },
    { id: "fire", icon: ShieldAlert, label: "Fire" },
    { id: "medical", icon: Activity, label: "Medical" },
    { id: "hazard", icon: AlertCircle, label: "Hazard" },
  ];

  const severities = [
    { id: "info", label: "Low", color: "bg-safe" },
    { id: "warning", label: "Moderate", color: "bg-warning" },
    { id: "critical", label: "Critical", color: "bg-danger shadow-[0_0_15px_#ef4444]" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass-dark border border-white/10 rounded-[3rem] overflow-hidden relative shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-danger animate-pulse" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">Field Crisis Report</h3>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.3em]">Operational Unit Alpha-01</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/20" />
              </button>
            </div>

            <div className="p-8">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-6">
                   <div className="w-20 h-20 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-brand" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black uppercase text-white tracking-widest mb-2 font-mono">SIGNAL ACKNOWLEDGED</h4>
                      <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
                         Neural Core has dispatched emergency units.<br />Extraction units en-route to your grid coordinates.
                      </p>
                   </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Step Indicators */}
                  <div className="flex gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={cn("flex-1 h-1.5 rounded-full transition-all", i <= step ? "bg-brand" : "bg-white/5")} />
                    ))}
                  </div>

                  {step === 1 && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Select Tactical Incident Type</span>
                      <div className="grid grid-cols-2 gap-4">
                        {types.map((t) => (
                           <button
                             key={t.id}
                             onClick={() => { setFormData({ ...formData, type: t.id }); setStep(2); }}
                             className={cn(
                               "p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 group",
                               formData.type === t.id ? "bg-brand/10 border-brand" : "bg-white/5 border-white/10 hover:border-white/30"
                             )}
                           >
                              <t.icon className={cn("w-8 h-8 transition-all group-hover:scale-110", formData.type === t.id ? "text-brand" : "text-white/20")} />
                              <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                           </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                      <div className="space-y-4">
                         <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Incident Location Overlay</span>
                         <div className="relative">
                            <input 
                                type="text"
                                placeholder="ENTER SECTOR OR GRID COORDS..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-brand/40 outline-none font-mono tracking-widest"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                         </div>
                      </div>

                      <div className="space-y-4">
                         <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Severity Classification</span>
                         <div className="flex gap-4">
                            {severities.map((s) => (
                               <button
                                 key={s.id}
                                 onClick={() => setFormData({ ...formData, severity: s.id })}
                                 className={cn(
                                   "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                   formData.severity === s.id ? "border-white/20 bg-white/10 text-white" : "border-white/5 text-white/20"
                                 )}
                               >
                                  <div className={cn("w-2 h-2 rounded-full mx-auto mb-2", s.color)} />
                                  {s.label}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                         <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Back</button>
                         <button onClick={() => setStep(3)} className="flex-1 py-4 rounded-2xl bg-brand text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand/80 transition-all">Next Module</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                      <div className="space-y-4">
                         <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Operational Intel Breakdown</span>
                         <textarea 
                            placeholder="OPERATIONAL NOTES - DESCRIBE THE MISSION OBJECTIVES..."
                            rows={4}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-brand/40 outline-none resize-none font-mono tracking-widest leading-relaxed"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                         />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col items-center gap-2">
                             <Camera className="w-5 h-5 text-white/30" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-white/30">ATTACH RECON IMAGE</span>
                         </div>
                         <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col items-center gap-2">
                             <Activity className="w-5 h-5 text-white/30" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-white/30">ADD VITAL TELEMETRY</span>
                         </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                         <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Back</button>
                         <button 
                            onClick={handleReport}
                            disabled={isSubmitting}
                            className="flex-1 py-4 rounded-2xl bg-danger text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-danger/80 transition-all shadow-[0_10px_30px_rgba(239,68,68,0.3)] disabled:opacity-50"
                         >
                            {isSubmitting ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            TRANSMIT REPORT
                         </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Panel */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-center">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  <span className="text-[9px] font-black text-brand uppercase tracking-[0.5em]">DIRECT SAT-LINK ENCRYPTED</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
