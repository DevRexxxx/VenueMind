"use client";

import { useEffect, useState } from "react";
import { Terminal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const LOG_ENTRIES = [
  { time: "15:12:04", msg: "Crowd Agent → Gate 7 redirect initiated", level: "info" },
  { time: "15:11:58", msg: "Security Agent → Anomaly cleared in Parking B", level: "success" },
  { time: "15:11:45", msg: "Medical Agent → Medic team dispatched to N15", level: "warning" },
  { time: "15:11:30", msg: "Transport Agent → Metro Line 2 delay detected (12 min)", level: "error" },
  { time: "15:11:22", msg: "Weather Agent → Heat index stable at 26°C", level: "info" },
];

export function SystemLogs() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % LOG_ENTRIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const entry = LOG_ENTRIES[activeIndex];
  const levelColor: unknown = {
    info: "text-[#3b82f6]",
    success: "text-[#10b981]",
    warning: "text-[#f59e0b]",
    error: "text-[#ef4444]",
  };

  return (
    <div className="w-full h-full flex items-center gap-3 px-4 py-2 glass-card">
      <div className="flex items-center gap-2 shrink-0">
        <Terminal size={14} className="text-white/30" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">System Log</span>
      </div>
      <div className="h-4 w-px bg-white/10 shrink-0"></div>
      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
        <Zap size={10} className={cn(levelColor[entry.level], "shrink-0")} />
        <span className="text-[10px] font-mono text-white/30 shrink-0">{entry.time}</span>
        <span className="text-[10px] text-white/60 truncate">{entry.msg}</span>
      </div>
    </div>
  );
}
