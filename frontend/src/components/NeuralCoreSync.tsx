"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Terminal, 
  Cpu, 
  Sparkles,
  RefreshCw,
  Globe,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickCommands = [
  "Flood evacuation protocol",
  "Medical emergency steps",
  "Cyclone safety checklist",
  "Current threat level",
];

const LANG_LABELS: Record<string, string> = { en: "EN", hi: "हिं", ta: "த" };
const LANG_CYCLE: string[] = ["en", "hi", "ta"];

export function NeuralCoreSync() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Neural Core Online. Standing by for strategic tactical queries. How can I assist in mission coordination?",
      timestamp: ""
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setMessages(prev => prev.map((m, i) => i === 0 ? { ...m, timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }) } : m));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: msg,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, language: lang })
      });
      if (!response.ok) throw new Error("Bad response");
      const data = await response.json();

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response || "Neural Core Sync Interrupted.",
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Backend connection interrupted. Please ensure the server is running on port 8000.",
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const cycleLang = () => {
    setLang(prev => LANG_CYCLE[(LANG_CYCLE.indexOf(prev) + 1) % LANG_CYCLE.length]);
  };

  return (
    <div className="flex flex-col h-full glass-dark rounded-[3rem] border border-white/10 overflow-hidden relative group shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-brand animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-[0.2em]">Neural Core Sync</h3>
            <p className="text-[9px] text-brand/60 font-black uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Strategic AI Active
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={cycleLang}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-brand hover:border-brand/40 transition-all flex items-center gap-1.5"
          >
            <Globe className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">{LANG_LABELS[lang]}</span>
          </button>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Commands - only show when single message */}
      {messages.length === 1 && (
        <div className="px-5 py-3 shrink-0">
          <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-2">Quick Commands</p>
          <div className="grid grid-cols-2 gap-2">
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleSend(cmd)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand/30 hover:bg-brand/5 transition-all group/cmd text-left"
              >
                <ChevronRight className="w-3 h-3 text-brand/40 group-hover/cmd:text-brand shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-wider text-white/40 group-hover/cmd:text-white transition-colors leading-tight">{cmd}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar min-h-0"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex flex-col gap-1.5 max-w-[92%]",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "flex items-center gap-2 mb-0.5",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                {msg.role === "assistant" ? (
                  <div className="w-5 h-5 rounded-md bg-brand/20 flex items-center justify-center border border-brand/30 shrink-0">
                    <Bot className="w-3 h-3 text-brand" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <User className="w-3 h-3 text-white/40" />
                  </div>
                )}
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
                  {mounted && msg.timestamp ? msg.timestamp : ""}
                </span>
              </div>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-[11px] leading-relaxed shadow-lg",
                msg.role === "user"
                  ? "bg-brand text-white font-medium rounded-tr-none border border-white/10"
                  : "glass-dark text-white/80 rounded-tl-none border border-white/5"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-brand/60 mr-auto"
          >
            <div className="w-5 h-5 rounded-md bg-brand/10 flex items-center justify-center border border-brand/30">
              <Sparkles className="w-3 h-3 text-brand animate-pulse" />
            </div>
            <div className="flex gap-1.5 px-4 py-3 glass-dark rounded-2xl rounded-tl-none border border-white/5">
              {[0, 0.2, 0.4].map((delay, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-brand/60 animate-bounce"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-5 bg-white/[0.02] border-t border-white/5 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="TYPE COMMAND OR QUERY..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-14 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all font-mono tracking-widest"
          />
          <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white disabled:opacity-30 disabled:grayscale transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
