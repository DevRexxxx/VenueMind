import { Users, TrendingUp, TrendingDown, Maximize2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CrowdPage() {
  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white/90">Crowd Intelligence</h1>
          <p className="text-sm text-white/50 tracking-wider">Predictive Density & Flow Analytics</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">Agent Analyzing Flow</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 shrink-0">
        <div className="glass-card p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Total Occupancy</h3>
            <Users size={14} className="text-[#0ea5e9]" />
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-mono text-white/90 tracking-tight">64,289</span>
            <span className="text-xs font-bold text-[#10b981] flex items-center gap-1 mb-1">
              <TrendingUp size={12} /> +2.4%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mt-2">78% of Maximum Capacity</p>
        </div>

        <div className="glass-card p-5 border border-[#f59e0b]/20 bg-[#f59e0b]/5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">Active Bottleneck</h3>
            <AlertTriangle size={14} className="text-[#f59e0b]" />
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-mono text-[#f59e0b] tracking-tight">Gate 7</span>
            <span className="text-xs font-bold text-[#ef4444] flex items-center gap-1 mb-1">
              <ArrowUpRight size={12} /> 120 pax/min
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#f59e0b]/60 mt-2">Predicted overload in 4 mins</p>
        </div>

        <div className="glass-card p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Avg Dwell Time</h3>
            <ClockIcon />
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-mono text-white/90 tracking-tight">14m</span>
            <span className="text-xs font-bold text-[#10b981] flex items-center gap-1 mb-1">
              <TrendingDown size={12} /> -1m
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mt-2">Concourse B & C</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        <div className="glass-card p-5 flex flex-col h-full border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Sector Density Heatmap</h3>
            <button className="text-white/40 hover:text-white/80 transition-colors"><Maximize2 size={14} /></button>
          </div>
          <div className="flex-1 border border-white/5 rounded-lg bg-black/40 flex items-end justify-between p-4 gap-2">
            {/* Mock Bar Chart */}
            {[45, 60, 35, 95, 80, 25, 40, 70, 85, 50].map((h, i) => (
              <div key={i} className="w-full flex flex-col justify-end items-center gap-2 h-full">
                <div 
                  className={cn("w-full rounded-t-sm transition-all duration-1000", 
                    h > 90 ? "bg-[#ef4444]" : h > 75 ? "bg-[#f59e0b]" : "bg-[#0ea5e9]"
                  )} 
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[8px] font-mono text-white/40">S{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col h-full border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Flow Predictions (Next 60m)</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6 px-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                <span className="text-white/50">North Gates Exit Rate</span>
                <span className="text-[#0ea5e9]">Projected: +45%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-gradient-to-r from-[#0ea5e9]/50 to-[#0ea5e9] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                <span className="text-white/50">South Concourse Density</span>
                <span className="text-[#10b981]">Projected: -15%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-gradient-to-r from-[#10b981]/50 to-[#10b981] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                <span className="text-white/50">VIP Zone Occupancy</span>
                <span className="text-[#f59e0b]">Projected: Max Capacity</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[95%] bg-gradient-to-r from-[#f59e0b]/50 to-[#f59e0b] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8b5cf6]">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
