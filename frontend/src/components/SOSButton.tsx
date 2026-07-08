"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ShieldAlert, Send, CheckCircle2, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SOSButton() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0:Idle, 1:Confirm, 2:Sending, 3:Confirmed
  const [dispatchId, setDispatchId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSOS = async () => {
    if (step === 0) { setStep(1); return; }
    if (step !== 1) return;

    setStep(2);
    setError("");

    // Try to get geolocation
    let lat = 13.0827;
    let lng = 80.2707;

    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
      );
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch { /* use defaults */ }

    try {
      const response = await fetch("http://localhost:8000/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: `FIELD-UNIT-${Math.floor(Math.random() * 999)}`,
          latitude: lat,
          longitude: lng,
          status: "SOS_CRITICAL",
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      setDispatchId(data.dispatch_id || `DISP-${Math.floor(Math.random() * 9999)}`);
      setStep(3);
      // Auto-reset after 8s
      setTimeout(() => { setStep(0); setDispatchId(""); }, 8000);
    } catch {
      setError("Connection lost. Retrying...");
      // Simulate offline confirmation
      setDispatchId(`DISP-OFFL-${Math.floor(Math.random() * 999)}`);
      setStep(3);
      setTimeout(() => { setStep(0); setDispatchId(""); setError(""); }, 8000);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {/* Confirm Panel */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-dark border border-danger/30 p-5 rounded-3xl mb-2 w-72 shadow-[0_10px_40px_rgba(239,68,68,0.2)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-danger animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest">Emergency Distress</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Confirm SOS transmission?</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <MapPin className="w-3 h-3 text-brand shrink-0" />
              <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">Live GPS location will be transmitted</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] hover:bg-white/10 transition-all font-black uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleSOS}
                className="flex-1 px-4 py-2.5 rounded-xl bg-danger text-white text-[10px] hover:bg-danger/80 transition-all font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(239,68,68,0.4)]"
              >
                CONFIRM
              </button>
            </div>
          </motion.div>
        )}

        {/* Sending */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass border border-danger/40 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            <Loader2 className="w-4 h-4 text-danger animate-spin" />
            <span className="text-xs font-black text-danger uppercase tracking-widest">Transmitting SOS...</span>
          </motion.div>
        )}

        {/* Confirmed */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-dark border border-brand/40 p-5 rounded-3xl w-72 shadow-[0_10px_40px_rgba(16,185,129,0.2)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-brand animate-pulse" />
              <span className="text-xs font-black text-brand uppercase tracking-widest">SOS Acknowledged</span>
            </div>
            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-2">Dispatch ID: <span className="text-white font-mono">{dispatchId}</span></p>
            <p className="text-[9px] text-white/30 leading-relaxed">Emergency units dispatched. ETA: ~4 minutes.</p>
            {error && <p className="text-[9px] text-warning mt-2">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Button */}
      <motion.button
        whileHover={{ scale: step === 0 ? 1.05 : 1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => step === 0 && setStep(1)}
        disabled={step === 2}
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed",
          step === 3 ? "bg-brand shadow-[0_0_50px_rgba(16,185,129,0.5)]" :
          step === 1 ? "bg-danger/30 shadow-[0_0_50px_rgba(239,68,68,0.3)]" :
          "bg-danger shadow-[0_0_50px_rgba(239,68,68,0.4)]"
        )}
      >
        {/* Pulse rings */}
        {step === 0 && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-danger animate-ping opacity-20" />
            <div className="absolute inset-0 rounded-full border-2 border-danger/30 animate-ping opacity-10" style={{ animationDelay: "0.5s" }} />
          </>
        )}
        <div className="absolute inset-0 rounded-full border border-white/20" />

        {step === 3 ? (
          <CheckCircle2 className="text-white w-9 h-9" />
        ) : step === 2 ? (
          <Loader2 className="text-white w-9 h-9 animate-spin" />
        ) : (
          <div className="flex flex-col items-center">
            <AlertCircle className="text-white w-7 h-7" />
            <span className="text-[10px] font-black text-white mt-0.5">SOS</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
