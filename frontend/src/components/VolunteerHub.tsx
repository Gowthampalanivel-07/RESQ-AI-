"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  HandHelping, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  Verified
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Volunteer {
  id: number;
  name: string;
  status: "active" | "standby";
  points: number;
  task: string;
}

const activeVolunteers: Volunteer[] = [
  { id: 1, name: "Arun K.", status: "active", points: 850, task: "Shelter Distribution" },
  { id: 2, name: "Sita R.", status: "standby", points: 1200, task: "Medical Support" },
  { id: 3, name: "Priya M.", status: "active", points: 420, task: "Route Coordination" }
];

export function VolunteerHub() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setIsRegistered(true);
    }, 2000);
  };

  return (
    <div className="glass-dark rounded-[2.5rem] border border-white/10 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
           <Heart className="w-4 h-4 text-brand" />
           Community Resilience Node
        </h3>
        <div className="flex items-center gap-1">
            <span className="text-[10px] text-brand font-bold">1.2k</span>
            <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">Online</span>
        </div>
      </div>

      {!isRegistered ? (
        <div className="bg-white/[0.02] border border-brand/20 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand/10 mx-auto flex items-center justify-center border border-brand/20 mb-2">
                <HandHelping className="w-6 h-6 text-brand" />
            </div>
            <h4 className="text-sm font-bold text-white">Lend a Hand</h4>
            <p className="text-xs text-white/50 px-4 leading-relaxed">
                Join our decentralized responder network and help coordinate relief in your local sector.
            </p>
            <button 
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand text-white text-[10px] font-black uppercase tracking-widest border border-brand/10 shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:bg-brand/90 transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? "PROVISIONING..." : (
                    <>
                        JOIN RESPONDER NETWORK
                        <Verified className="w-3 h-3" />
                    </>
                )}
            </button>
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
        >
            <div className="flex items-center gap-4 bg-brand/10 p-4 rounded-2xl border border-brand/20">
                <Verified className="w-6 h-6 text-brand" />
                <div>
                    <h4 className="text-[10px] text-brand font-black uppercase tracking-widest">Status: Ready</h4>
                    <p className="text-xs text-white font-bold">Sector 4 Responder - Active</p>
                </div>
            </div>

            <div className="space-y-4">
                <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Assigned Tasks</span>
                {activeVolunteers.map((v) => (
                    <div key={v.id} className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:border-white/10 transition-all cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white/20 group-hover:text-brand transition-colors" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">{v.task}</p>
                                <p className="text-[10px] text-white/40">{v.name} & You Nearby</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                           <Verified className="w-3 h-3 text-safe" />
                           <span className="text-[9px] text-white font-black">{v.points} XP</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-brand uppercase tracking-widest group">
                BROWSE ALL MISSIONS
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
      )}

      <div className="flex items-center gap-3 p-4 bg-danger/10 rounded-2xl border border-danger/20 animate-pulse">
        <ShieldAlert className="w-5 h-5 text-danger" />
        <div>
            <span className="text-[9px] text-danger font-black uppercase tracking-tighter block mb-0.5">Urgent Volunteer Need</span>
            <span className="text-[10px] text-white font-medium">Bottled Water Shortage @ Center 4</span>
        </div>
      </div>
    </div>
  );
}
