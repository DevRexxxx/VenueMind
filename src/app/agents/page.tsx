"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, MessageSquare, Database, History, 
  Folder, BookOpen, Briefcase, Mic, 
  Sparkles, Settings, Send, Paperclip
} from "lucide-react";
import { cn } from "@/lib/utils";

const BENTO_CARDS = [
  { name: "Conversation Stats", icon: MessageSquare, value: "1,248", colSpan: "col-span-1 md:col-span-2" },
  { name: "AI Models", icon: Brain, value: "GPT-4o, Claude 3.5", colSpan: "col-span-1 md:col-span-2" },
  { name: "Memory", icon: Database, value: "Optimized", colSpan: "col-span-1" },
  { name: "Recent Chats", icon: History, value: "12 Active", colSpan: "col-span-1" },
  { name: "Files", icon: Folder, value: "48 Indexed", colSpan: "col-span-1 md:col-span-2" },
  { name: "Knowledge Base", icon: BookOpen, value: "Syncing...", colSpan: "col-span-1" },
  { name: "Workspace", icon: Briefcase, value: "VenueMind HQ", colSpan: "col-span-1 md:col-span-2" },
  { name: "Voice Assistant", icon: Mic, value: "Ready", colSpan: "col-span-1" },
  { name: "Prompt Library", icon: Sparkles, value: "124 Saved", colSpan: "col-span-1" },
  { name: "Settings", icon: Settings, value: "Configured", colSpan: "col-span-1 md:col-span-2" },
];

export default function BentoChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello. I am the VenueMind Orchestrator. How can I assist you with stadium operations today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "I've processed your request through the agent network. The recommended course of action has been documented in the incident timeline." }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col relative bg-[#0D0101] text-white overflow-hidden p-6 gap-8">
      {/* Subtle Background Grid & Glows */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF5D00] rounded-full blur-[150px] opacity-[0.08] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] rounded-full blur-[150px] opacity-[0.08] pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-[#3b82f6] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />

      {/* Bento Grid Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 z-10 shrink-0">
        {BENTO_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "glass-card p-4 rounded-3xl flex flex-col gap-2 justify-between group hover:shadow-[0_0_30px_rgba(255,93,0,0.1)] transition-all cursor-pointer border border-white/5 hover:border-white/20 bg-black/40 backdrop-blur-xl",
              card.colSpan
            )}
          >
            <div className="flex items-center justify-between">
              <card.icon size={18} className="text-white/40 group-hover:text-[#FF5D00] transition-colors" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#FF5D00] group-hover:shadow-[0_0_8px_#FF5D00] transition-all"></span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">{card.name}</p>
              <p className="text-sm font-semibold tracking-wide text-white/90">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 z-10 flex flex-col max-w-4xl w-full mx-auto relative min-h-0 bg-black/20 backdrop-blur-3xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar" aria-live="polite">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] p-5 rounded-[24px] text-[15px] leading-relaxed shadow-lg",
                  msg.role === "user" 
                    ? "bg-[#FF5D00]/90 text-white rounded-br-sm shadow-[0_4px_20px_rgba(255,93,0,0.2)]" 
                    : "bg-white/5 border border-white/10 text-white/90 rounded-bl-sm backdrop-blur-md"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full justify-start"
              >
                <div className="bg-white/5 border border-white/10 text-white/90 p-5 rounded-[24px] rounded-bl-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5D00] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#FF5D00] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#FF5D00] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6 shrink-0 relative">
          {/* Animated gradient border container */}
          <div className="relative rounded-[32px] p-[2px] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5D00] via-[#8b5cf6] to-[#3b82f6] opacity-30 group-hover:opacity-60 transition-opacity animate-pulse" />
            
            <form onSubmit={handleSubmit} className="relative bg-[#0D0101]/90 backdrop-blur-xl rounded-[30px] flex items-center px-4 py-3 gap-3">
              <button type="button" aria-label="Attach file" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <Paperclip size={20} />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30 text-[15px]"
              />
              
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Voice input" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5">
                  <Mic size={20} />
                </button>
                <button 
                  type="submit" 
                  aria-label="Send message"
                  disabled={!input.trim()}
                  className="p-2.5 bg-white/10 hover:bg-[#FF5D00] text-white transition-colors rounded-full disabled:opacity-50 disabled:hover:bg-white/10"
                >
                  <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
