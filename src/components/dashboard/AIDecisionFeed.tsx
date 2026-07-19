"use client";

import { useState } from "react";
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Brain, CheckCircle2, Clock, ChevronDown, ChevronUp, Activity, Database, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DECISIONS = [
  { 
    id: 1, 
    agent: "Crowd Agent", 
    action: "Redirect flow from Gate 7 → Gate 3", 
    reason: "Gate 7 at 97% capacity", 
    status: "approved", 
    time: "2 min ago",
    confidence: 94,
    xai: {
      data_sources: ["CCTV Feed #42", "Turnstile Metrics Gate 7"],
      rules: ["Rule: Max Capacity > 95% -> Redirect Protocol"],
      trace: "Analyzed incoming rate at Gate 7 (120 pax/min). Projected to exceed safety limits in 4 mins. Gate 3 currently operating at 40% capacity. Safe to redirect."
    }
  },
  { 
    id: 2, 
    agent: "Medical Agent", 
    action: "Deploy 2 additional medics to Section N15", 
    reason: "Heat index rising + 3 prior incidents", 
    status: "approved", 
    time: "5 min ago",
    confidence: 91,
    xai: {
      data_sources: ["Weather API (Microclimate)", "MedTent Log N15"],
      rules: ["Protocol: Heat Index > 32C + Incident Spike"],
      trace: "Local heat index in Section N15 reached 33C. Correlated with 3 syncope incidents in last 15 mins. Proactive deployment minimizes response time."
    }
  },
  { 
    id: 3, 
    agent: "Security Agent", 
    action: "Increase patrol density in Parking Zone B", 
    reason: "Anomaly detected via CCTV feed #47", 
    status: "pending", 
    time: "8 min ago",
    confidence: 87,
    xai: {
      data_sources: ["CV Model v4 (Anomaly Detection)", "Staff GPS"],
      rules: ["Protocol: Suspicious Loitering > 5 mins"],
      trace: "Computer vision flagged unusual loitering behavior between vehicles in Zone B. Confidence 87%. Nearest patrol unit is 1.2 mins away."
    }
  },
  { 
    id: 4, 
    agent: "Transport Agent", 
    action: "Request 5 additional shuttle buses", 
    reason: "Metro Line 2 delayed by 12 min", 
    status: "approved", 
    time: "12 min ago",
    confidence: 96,
    xai: {
      data_sources: ["City Transit API", "Stadium Exit Flow"],
      rules: ["Rule: Transit Delay > 10m -> Augment Fleet"],
      trace: "City API reported signals failure on Metro Line 2. Current exit flow is 500 pax/min. Existing shuttle fleet will reach capacity in 8 mins without augmentation."
    }
  },
];

export function AIDecisionFeed() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="glass-card w-full h-full p-4 flex flex-col relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 shrink-0">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">AI Decision Feed</h2>
        <div className="flex items-center gap-1">
          <Brain size={12} className="text-purple-400" />
          <span className="text-[10px] font-bold text-purple-400">Live</span>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar pr-1" tabIndex={0}>
        {DECISIONS.map((d) => (
          <div key={d.id} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            
            <div className="flex justify-between items-start mb-1 cursor-pointer" onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">{d.agent}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-white/30">{d.time}</span>
                {expandedId === d.id ? <ChevronUp size={12} className="text-white/40" /> : <ChevronDown size={12} className="text-white/40" />}
              </div>
            </div>
            
            <p className="text-[11px] font-medium text-white/90 leading-relaxed">{d.action}</p>
            <p className="text-[9px] text-white/40 mt-0.5">{d.reason}</p>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1.5">
                {d.status === "approved" ? (
                  <CheckCircle2 size={10} className="text-[#10b981]" />
                ) : (
                  <Clock size={10} className="text-[#f59e0b]" />
                )}
                <span className={cn("text-[8px] font-bold uppercase tracking-wider", 
                  d.status === "approved" ? "text-[#10b981]" : "text-[#f59e0b]"
                )}>{d.status}</span>
              </div>
              <span className="text-[9px] text-white/40">Confidence: <span className="text-white/70 font-bold">{d.confidence}%</span></span>
            </div>

            {/* Explainable AI (XAI) Panel */}
            <AnimatePresence>
              {expandedId === d.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Brain size={10} className="text-[#0ea5e9]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#0ea5e9]">Reasoning Trace (XAI)</span>
                    </div>
                    
                    <p className="text-[10px] text-white/70 leading-relaxed italic border-l-2 border-[#0ea5e9]/30 pl-2">
                      &quot;{d.xai.trace}&quot;
                    </p>

                    <div className="grid grid-cols-1 gap-1.5 mt-1">
                      <div className="flex items-start gap-1.5">
                        <Database size={10} className="text-white/30 mt-0.5 shrink-0" />
                        <span className="text-[9px] text-white/50"><strong className="text-white/70 font-medium">Data:</strong> {d.xai.data_sources.join(", ")}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ShieldCheck size={10} className="text-white/30 mt-0.5 shrink-0" />
                        <span className="text-[9px] text-white/50"><strong className="text-white/70 font-medium">Rules:</strong> {d.xai.rules.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ))}
      </div>
      
    </div>
  );
}

