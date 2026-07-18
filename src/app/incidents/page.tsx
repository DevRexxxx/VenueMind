"use client";

   
   
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, MessageSquareText, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const KANBAN_DATA = {
  "Detected (AI)": [
    { id: "INC-942", type: "Security", desc: "Perimeter breach attempt at Gate 12", severity: "high", time: "2 min ago", agent: "Security Agent" },
    { id: "INC-943", type: "Crowd", desc: "Density spike in Concourse C", severity: "medium", time: "4 min ago", agent: "Crowd Agent" },
    { id: "INC-944", type: "Weather", desc: "Lightning strike within 10km radius", severity: "critical", time: "5 min ago", agent: "Weather Agent" }
  ],
  "Investigating": [
    { id: "INC-939", type: "Medical", desc: "Heat exhaustion reported in Sector N15", severity: "medium", time: "12 min ago", agent: "Medical Agent" },
    { id: "INC-940", type: "Fraud", desc: "Duplicate ticket scans detected", severity: "medium", time: "18 min ago", agent: "Fraud Agent" }
  ],
  "Resolved": [
    { id: "INC-931", type: "Vendor", desc: "Water restocked at Block A", severity: "low", time: "1 hr ago", agent: "Vendor Agent" },
    { id: "INC-932", type: "Accessibility", desc: "Elevator 4 maintenance completed", severity: "medium", time: "2 hrs ago", agent: "Accessibility Agent" }
  ]
};

export default function IncidentsPage() {
  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white/90">Autonomous Triage Board</h1>
          <p className="text-sm text-white/50 tracking-wider">AI-Detected Incidents & Case Management</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors border border-white/10">
            <AlertTriangle size={14} className="text-[#f59e0b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">Trigger Global Alert</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto no-scrollbar pb-4">
        {Object.entries(KANBAN_DATA).map(([columnId, incidents]) => (
          <div key={columnId} className="flex-1 min-w-[320px] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">{columnId}</h3>
              </div>
              <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">{incidents.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
              {incidents.map((inc) => (
                <div key={inc.id} className="glass-card p-4 flex flex-col gap-3 group hover:border-white/20 transition-colors border border-white/5 bg-white/[0.02]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-white/40">{inc.id}</span>
                    <button className="text-white/30 hover:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  
                  <p className="text-sm font-medium text-white/90 leading-snug">{inc.desc}</p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border", 
                      inc.severity === 'critical' || inc.severity === 'high' ? "border-[#ef4444]/30 text-[#ef4444] bg-[#ef4444]/10" :
                      inc.severity === 'medium' ? "border-[#f59e0b]/30 text-[#f59e0b] bg-[#f59e0b]/10" :
                      "border-[#10b981]/30 text-[#10b981] bg-[#10b981]/10"
                    )}>
                      {inc.severity} Priority
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-1 rounded">
                      {inc.agent}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Clock size={10} />
                      <span className="text-[9px] font-mono">{inc.time}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="text-[9px] font-bold uppercase tracking-widest text-white/50 bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors flex items-center gap-1">
                        <MessageSquareText size={10} /> XAI
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
