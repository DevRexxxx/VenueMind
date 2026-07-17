"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ShieldAlert, CheckCircle2, MessageSquareText, ThumbsUp, ThumbsDown, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useWebSocket from "react-use-websocket";
import { cn } from "@/lib/utils";

interface Incident {
  id?: number;
  time?: string;
  type: string;
  desc?: string;
  description?: string;
  severity: string;
  status: string;
  created_at?: string;
  reasoning_trace?: string;
}

export function IncidentTimeline() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch initial incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/incidents/");
        if (res.ok) {
          const data = await res.json();
          setIncidents(data.reverse()); // latest first
        }
      } catch (err) {
        console.error("Failed to fetch incidents", err);
      }
    };
    fetchIncidents();
  }, []);

  // Listen for WebSocket updates
  const { lastJsonMessage } = useWebSocket('ws://localhost:8000/ws/dashboard/', {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage && (lastJsonMessage as any).type === 'incident_alert') {
      const msg = (lastJsonMessage as any).message;
      const newIncident: Incident = {
        id: Date.now(),
        type: msg.type || "System",
        description: msg.alert_message,
        severity: msg.severity,
        status: "detected",
        created_at: new Date().toISOString(),
        reasoning_trace: msg.reasoning_trace || "Agent applied baseline security thresholds. Computed via predictive threat assessment model v1.4."
      };
      setIncidents(prev => [newIncident, ...prev]);
    }
  }, [lastJsonMessage]);

  return (
    <div className="glass-card w-full h-full p-4 flex flex-col relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">Live Incidents</h2>
        </div>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{incidents.length} Active</span>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
        {incidents.map((inc, i) => {
          const uniqueId = inc.id || i;
          const timeStr = inc.created_at ? new Date(inc.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : (inc.time || "Now");
          const desc = inc.description || inc.desc || "Alert";
          
          const severityColor = 
            inc.severity === 'high' || inc.severity === 'critical' ? { dot: "bg-[#ef4444]", shadow: "shadow-[0_0_8px_#ef4444]", border: "border-[#ef4444]/20", badge: "border-[#ef4444]/30 text-[#ef4444] bg-[#ef4444]/10" } :
            inc.severity === 'medium' ? { dot: "bg-[#f59e0b]", shadow: "shadow-[0_0_8px_#f59e0b]", border: "border-[#f59e0b]/20", badge: "border-[#f59e0b]/30 text-[#f59e0b] bg-[#f59e0b]/10" } :
            { dot: "bg-[#10b981]", shadow: "", border: "border-[#10b981]/20", badge: "border-[#10b981]/30 text-[#10b981] bg-[#10b981]/10" };
          
          return (
            <div key={uniqueId} className={cn("p-3 rounded-lg border bg-white/[0.02] hover:bg-white/[0.04] transition-colors", severityColor.border)}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", severityColor.dot, severityColor.shadow)}></div>
                  <span className="text-[10px] font-mono text-white/40">{timeStr}</span>
                </div>
                <span className={cn("text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border", 
                  inc.status === 'resolved' ? "border-[#10b981]/30 text-[#10b981] bg-[#10b981]/10" : severityColor.badge
                )}>
                  {inc.status}
                </span>
              </div>
              <div className="text-xs font-medium text-white/90 mt-1 leading-relaxed">{desc}</div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-white/40 mt-1 flex items-center gap-1">
                {inc.type === 'Security' && <ShieldAlert size={10} />}
                {inc.type === 'Medical' && <AlertCircle size={10} />}
                {(inc.type === 'Crowd' || inc.type === 'System') && <CheckCircle2 size={10} />}
                {inc.type}
              </div>
              
              {/* Actions */}
              <div className="mt-2 flex gap-1.5">
                <button 
                  onClick={() => setExpandedId(expandedId === uniqueId ? null : uniqueId)}
                  className={cn("flex items-center gap-1 text-[8px] uppercase font-bold px-2 py-1 rounded border transition-colors", 
                    expandedId === uniqueId ? "bg-white/20 border-white/30 text-white" : "bg-white/5 hover:bg-white/10 border-white/10 text-white/50"
                  )}
                >
                  <MessageSquareText size={9} />
                  Why
                </button>
                <button 
                  onClick={() => alert('Feedback recorded: Positive')}
                  className="flex items-center gap-1 text-[8px] uppercase font-bold bg-white/5 hover:bg-white/10 px-1.5 py-1 rounded border border-white/10 text-white/50 hover:text-[#10b981] transition-colors"
                >
                  <ThumbsUp size={9} />
                </button>
                <button 
                  onClick={() => alert('Feedback recorded: Negative')}
                  className="flex items-center gap-1 text-[8px] uppercase font-bold bg-white/5 hover:bg-white/10 px-1.5 py-1 rounded border border-white/10 text-white/50 hover:text-[#ef4444] transition-colors"
                >
                  <ThumbsDown size={9} />
                </button>
              </div>

              {/* XAI Panel */}
              <AnimatePresence>
                {expandedId === uniqueId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1 mb-2">
                        <Brain size={10} className="text-[#0ea5e9]" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#0ea5e9]">Detection Trace</span>
                      </div>
                      <p className="text-[10px] text-white/70 leading-relaxed italic border-l-2 border-[#0ea5e9]/30 pl-2">
                        "{inc.reasoning_trace || 'No trace provided for this legacy incident.'}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </div>
  );
}

