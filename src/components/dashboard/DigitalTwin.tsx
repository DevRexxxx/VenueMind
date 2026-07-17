"use client";

import { useState } from "react";
import { Plus, Minus, Layers, Move3D, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function DigitalTwin() {
  const [view, setView] = useState<"2D" | "3D">("3D");
  const [heatMap, setHeatMap] = useState(true);

  return (
    <div className="glass-card w-full h-full p-4 flex flex-col relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">Live Stadium Digital Twin</h2>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        
        {/* Left Toolbar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          <div className="glass-card flex flex-col p-1 gap-1 border-white/10">
            <button onClick={() => setView("2D")} className={cn("p-2 rounded-lg text-xs font-bold", view === "2D" ? "bg-[#3b82f6] text-white" : "text-white/50 hover:text-white hover:bg-white/5")}>2D</button>
            <button onClick={() => setView("3D")} className={cn("p-2 rounded-lg text-xs font-bold", view === "3D" ? "bg-[#3b82f6] text-white" : "text-white/50 hover:text-white hover:bg-white/5")}>3D</button>
          </div>
          <div className="glass-card flex flex-col p-1 gap-1 border-white/10 mt-4">
            <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"><Plus size={16} /></button>
            <div className="w-full h-px bg-white/10"></div>
            <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"><Minus size={16} /></button>
          </div>
        </div>

        {/* Isometric Stadium Visualization */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#3b82f6]/5 blur-[60px] pointer-events-none rounded-[100%]"></div>
          {heatMap && <div className="absolute top-[40%] right-[30%] w-[100px] h-[100px] bg-red-500/20 blur-[30px] pointer-events-none rounded-full"></div>}

          {/* Stadium Rings (Simulating 3D depth) */}
          <div className={cn("relative transition-transform duration-700 ease-in-out w-[85%] aspect-[2/1.1]", view === "3D" ? "rotate-x-[45deg] scale-110" : "")} style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-[50%] border-4 border-[#3b82f6]/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex items-center justify-center">
              {/* Colored Sectors */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 50 0 A 50 50 0 0 1 100 50 L 80 50 A 30 30 0 0 0 50 20 Z" fill="rgba(239, 68, 68, 0.4)" stroke="rgba(255,255,255,0.1)" /> {/* Red Section */}
                <path d="M 100 50 A 50 50 0 0 1 50 100 L 50 80 A 30 30 0 0 0 80 50 Z" fill="rgba(245, 158, 11, 0.4)" stroke="rgba(255,255,255,0.1)" /> {/* Orange Section */}
                <path d="M 50 100 A 50 50 0 0 1 0 50 L 20 50 A 30 30 0 0 0 50 80 Z" fill="rgba(16, 185, 129, 0.4)" stroke="rgba(255,255,255,0.1)" /> {/* Green Section */}
                <path d="M 0 50 A 50 50 0 0 1 50 0 L 50 20 A 30 30 0 0 0 20 50 Z" fill="rgba(168, 85, 247, 0.4)" stroke="rgba(255,255,255,0.1)" /> {/* Purple Section */}
              </svg>

              {/* Inner Pitch */}
              <div className="w-[55%] h-[45%] rounded-[50%] bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]" style={{ transform: view === "3D" ? "translateZ(20px)" : "" }}>
                {/* Pitch Lines */}
                <div className="w-px h-full bg-white/20 absolute"></div>
                <div className="w-[30%] h-[30%] border border-white/20 rounded-[50%] absolute"></div>
              </div>
            </div>

            {/* Markers (Need counter-rotation if 3D) */}
            <div className="absolute inset-0 pointer-events-none" style={{ transform: view === "3D" ? "translateZ(40px) rotate-x-[-45deg]" : "" }}>
               <Marker top="10%" left="30%" color="purple" label="GATE 1" />
               <Marker top="20%" right="20%" color="red" label="GATE 7" pulse />
               <Marker bottom="15%" left="40%" color="green" label="GATE 3" />
               <Marker bottom="25%" right="35%" color="orange" label="GATE 4" pulse />
            </div>

          </div>
        </div>

        {/* Right Stats Panel (North Stand) */}
        <div className="w-[200px] h-full ml-4 flex flex-col justify-center shrink-0 z-20">
          <div className="glass-card p-4 border-[#ef4444]/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <h3 className="text-sm font-bold text-white/90">North Stand</h3>
            <p className="text-[10px] text-white/50 mb-3">Section N15-N20</p>
            
            <div className="bg-[#ef4444]/20 text-[#ef4444] text-[9px] font-bold px-2 py-1 rounded w-max mb-4 uppercase tracking-wider border border-[#ef4444]/30">
              High Risk
            </div>

            <div className="space-y-2 mb-4">
              <StatRow label="Capacity" value="8,200" />
              <StatRow label="Current" value="7,950" />
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-white/60">Occupancy</span>
                <span className="font-bold text-[#ef4444]">97%</span>
              </div>
            </div>
            
            <div className="w-full h-px bg-white/10 mb-4"></div>

            <div className="space-y-2 mb-4">
              <StatRow label="Avg. Queue" value="15 min" />
              <StatRow label="Nearest Exit" value="Gate 5" />
              <StatRow label="Nearest Volunteers" value="12" />
              <StatRow label="Nearest Ambulance" value="2" />
            </div>
            
            <div className="flex justify-between items-center text-[11px] mb-4">
                <span className="text-white/60">Risk Score</span>
                <span className="font-bold text-[#ef4444]">83 <span className="text-white/30 font-normal">/100</span></span>
            </div>

            <button className="w-full py-2 bg-[#3b82f6]/20 hover:bg-[#3b82f6]/30 text-[#3b82f6] border border-[#3b82f6]/50 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">
              View Zone Details
            </button>
          </div>
        </div>

      </div>

      {/* Footer Legend & Controls */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5 z-10">
        <div className="flex gap-4">
          <LegendItem color="bg-[#10b981]" label="Normal" />
          <LegendItem color="bg-[#f59e0b]" label="Busy" />
          <LegendItem color="bg-[#f97316]" label="Heavy" />
          <LegendItem color="bg-[#ef4444]" label="Critical" />
          <LegendItem color="bg-[#3b82f6]" label="Medical" />
          <LegendItem color="bg-[#a855f7]" label="VIP" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Heat Map</span>
          <button 
            onClick={() => setHeatMap(!heatMap)}
            className={cn("w-8 h-4 rounded-full relative transition-colors", heatMap ? "bg-[#3b82f6]" : "bg-white/20")}
          >
            <div className={cn("w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all", heatMap ? "left-4.5" : "left-0.5")}></div>
          </button>
        </div>
      </div>
      
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="text-white/60">{label}</span>
      <span className="font-bold text-white/90">{value}</span>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-2 h-2 rounded-full", color)}></div>
      <span className="text-[10px] text-white/60 tracking-wider">{label}</span>
    </div>
  );
}

function Marker({ top, left, right, bottom, color, label, pulse }: any) {
  const colorMap: any = {
    green: "bg-[#10b981] shadow-[#10b981]/50",
    orange: "bg-[#f59e0b] shadow-[#f59e0b]/50",
    purple: "bg-[#a855f7] shadow-[#a855f7]/50",
    red: "bg-[#ef4444] shadow-[#ef4444]/50",
  };
  
  return (
    <div className="absolute flex flex-col items-center gap-1 pointer-events-auto" style={{ top, left, right, bottom }}>
      <div className="text-[9px] font-bold text-white/90 bg-black/80 px-2 py-0.5 rounded border border-white/10 whitespace-nowrap shadow-xl">
        {label}
      </div>
      <div className="relative flex h-2.5 w-2.5">
        {pulse && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", colorMap[color].split(" ")[0])}></span>
        )}
        <span className={cn("relative inline-flex rounded-full h-full w-full shadow-[0_0_10px_var(--tw-shadow-color)]", colorMap[color])}></span>
      </div>
    </div>
  );
}
