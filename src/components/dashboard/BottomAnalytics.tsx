"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

// Simple inline sparkline using SVG
function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  
  return (
    <svg width={width} height={height} className="w-full h-[30px]">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      <polyline fill={`${color}20`} stroke="none" points={`0,${height} ${points} ${width},${height}`} />
    </svg>
  );
}

const CROWD_DATA = [
  { time: "14:00", count: 45200, trend: "up" },
  { time: "14:15", count: 52300, trend: "up" },
  { time: "14:30", count: 58100, trend: "up" },
  { time: "14:45", count: 63800, trend: "up" },
  { time: "15:00", count: 68400, trend: "up" },
  { time: "15:15", count: 72893, trend: "up" },
];

export function BottomAnalytics() {
  const sparkData = CROWD_DATA.map(d => d.count);
  
  return (
    <div className="glass-card w-full h-full p-4 flex flex-col relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 shrink-0">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">Crowd Trends</h2>
        <div className="flex items-center gap-1 text-[#10b981]">
          <TrendingUp size={12} />
          <span className="text-[10px] font-bold">+12.4%</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1 flex items-end">
          <Sparkline data={sparkData} color="#3b82f6" />
        </div>
        
        {/* Timeline Labels */}
        <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
          {CROWD_DATA.map((d, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-white/30">{d.time}</span>
              <span className="text-[10px] font-bold text-white/60">{(d.count / 1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/5">
        <div>
          <span className="text-[9px] text-white/40 uppercase tracking-wider">Peak</span>
          <p className="text-sm font-bold text-white/90">72,893</p>
        </div>
        <div>
          <span className="text-[9px] text-white/40 uppercase tracking-wider">Avg Rate</span>
          <p className="text-sm font-bold text-white/90">+460/min</p>
        </div>
        <div>
          <span className="text-[9px] text-white/40 uppercase tracking-wider">Est. Full</span>
          <p className="text-sm font-bold text-[#f59e0b]">15:45</p>
        </div>
      </div>
      
    </div>
  );
}
