"use client";

import React from "react";
import { SafetyLibrary } from "@/components/SafetyLibrary";
import { motion } from "framer-motion";
import { Library } from "lucide-react";
import Link from "next/link";

export default function LibraryPage() {
  return (
    <div className="flex-1 p-8 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent)] flex flex-col gap-8">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full flex flex-col gap-8"
      >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <Library className="w-6 h-6 text-brand" />
                </div>
                <div>
                     <h2 className="text-2xl font-black uppercase tracking-tighter italic">Strategic Safety Library</h2>
                     <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Mission Readiness & Recovery Protocols</p>
                </div>
            </div>
            <Link 
                href="/dashboard"
                className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
                Return to Command HUD
            </Link>
        </div>
        <div className="flex-1 overflow-hidden">
            <SafetyLibrary />
        </div>
      </motion.div>
    </div>
  );
}
