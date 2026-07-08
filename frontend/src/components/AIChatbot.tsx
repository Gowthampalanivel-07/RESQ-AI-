"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  Globe, 
  Bot, 
  User, 
  Volume2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Language } from "@/data/survivalGuides";

const LANG_CYCLE: Language[] = ["en", "hi", "ta"];
const LANG_LABELS: Record<Language, string> = { en: "EN", hi: "HI", ta: "TA" };

interface Message {
  role: "bot" | "user";
  text: string;
  timestamp: Date;
}

interface AIChatbotProps {
  isFocusMode?: boolean;
}

export function AIChatbot({ isFocusMode }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(isFocusMode || false);
  const [lang, setLang] = useState<Language>("en");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "bot", 
      text: "I am ResQAI Bot. How can I assist you with your safety today?", 
      timestamp: new Date() 
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const cycleLang = () => {
    setLang(prev => LANG_CYCLE[(LANG_CYCLE.indexOf(prev) + 1) % LANG_CYCLE.length]);
  };

  const handleSend = async (overrideText?: string) => {
    const msg = overrideText || input;
    if (!msg.trim() || isLoading) return;

    const userMessage: Message = { 
      role: "user", 
      text: msg, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, language: lang }),
      });
      if (!response.ok) throw new Error("Bad response");
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Neural Core connection lost. Please ensure the backend is running on port 8000.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };


  if (isFocusMode) {
    return (
      <div className="w-full h-full glass-dark flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Mission Expert</h3>
              <p className="text-[10px] text-brand font-bold uppercase tracking-tighter">Strategic Intelligence Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={cycleLang}
                className="px-4 py-2 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{LANG_LABELS[lang]}</span>
              </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col max-w-[70%]",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "px-6 py-4 rounded-[2rem] text-[13px] leading-relaxed shadow-xl",
                msg.role === "bot" 
                  ? "glass border-brand/20 text-white/90" 
                  : "bg-brand text-white font-black"
              )}>
                {msg.text.split("\n").map((line, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">{line}</div>
                ))}
              </div>
              <span className="text-[9px] text-white/20 mt-2 font-black uppercase tracking-widest px-4">
                {msg.role === 'bot' ? 'ResQ-Net' : 'Tactical Unit'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto">
              <div className="flex gap-1.5 px-6 py-4 glass border-brand/20 rounded-[2rem]">
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-white/10 bg-black/20">
          <div className="max-w-4xl mx-auto flex items-center gap-4 glass px-6 py-4 rounded-[2rem] border-white/10 group focus-within:border-brand/50 transition-all shadow-2xl">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Query the Neural Core for life-saving protocols..."
              className="bg-transparent border-none outline-none text-sm text-white/90 placeholder:text-white/20 flex-1 px-2"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-brand/10 hover:bg-brand flex items-center justify-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="text-white w-4 h-4 animate-spin" /> : <Send className="text-white w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-28 right-8 z-[90]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="w-80 h-[500px] mb-4 overflow-hidden rounded-3xl glass-dark shadow-2xl border border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">ResQAI Assistant</h3>
                  <p className="text-[10px] text-brand font-medium">Neural Expert Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={cycleLang}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 text-white/50 transition-all"
                >
                  <Globe className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase">{LANG_LABELS[lang]}</span>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-danger/20 text-white/50 hover:text-danger transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "bot" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-3 py-2 rounded-2xl text-[11px] leading-relaxed",
                    msg.role === "bot" 
                      ? "glass border-brand/20 text-white/90" 
                      : "bg-brand text-white font-medium"
                  )}>
                    {msg.text.split("\n").map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                  <span className="text-[9px] text-white/20 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto">
                  <div className="flex gap-1 px-3 py-2 glass border-brand/20 rounded-2xl">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border-white/5 group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask for safety advice..."
                  className="bg-transparent border-none outline-none text-xs text-white/90 placeholder:text-white/20 flex-1"
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="w-7 h-7 rounded-lg bg-brand/10 hover:bg-brand flex items-center justify-center transition-all disabled:opacity-40"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 text-brand animate-spin" /> : <Send className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[10px] text-white/30 uppercase tracking-tighter">Voice input ready</span>
                <Volume2 className="w-3 h-3 text-white/20 ml-auto cursor-pointer hover:text-white transition-all" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl",
          isOpen ? "bg-danger rotate-90" : "bg-brand"
        )}
      >
        <div className="absolute inset-0 rounded-2xl border border-white/20" />
        {isOpen ? (
          <X className="text-white w-6 h-6" />
        ) : (
          <MessageSquare className="text-white w-6 h-6" />
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full border-2 border-black flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">1</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
