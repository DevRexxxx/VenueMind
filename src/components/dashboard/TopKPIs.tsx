"use client";

import { Users, AlertTriangle, Brain, User, Bus, Sun, TrendingUp, AlertCircle } from "lucide-react";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cn } from "@/lib/utils";

export function TopKPIs() {
  return (
    <div className="flex w-full h-full gap-4">
      {/* Stadium Occupancy */}
      <div className="glass-card flex-1 p-3 flex flex-col justify-between group hover:glass-card-hover relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6]">
              <Users size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Stadium Occupancy</span>
          </div>
          <span className="text-xl font-bold text-[#10b981]">82%</span>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-wider">72,893</span>
            <span className="text-[10px] text-white/40">/ 88,966</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#10b981]">
            <TrendingUp size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">5.6% vs last 15 min</span>
          </div>
        </div>
      </div>

      {/* Active Incidents */}
      <div className="glass-card flex-1 p-3 flex flex-col justify-between group hover:glass-card-hover relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-500">
              <AlertTriangle size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Active Incidents</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold tracking-wider">11</span>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]"></div><span className="text-[9px] text-white/70">Critical: <span className="text-red-500 font-bold">3</span></span></div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div><span className="text-[9px] text-white/70">High: <span className="text-orange-500 font-bold">4</span></span></div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div><span className="text-[9px] text-white/70">Medium: <span className="text-yellow-500 font-bold">4</span></span></div>
          </div>
        </div>
      </div>

      {/* AI Decisions Today */}
      <div className="glass-card flex-1 p-3 flex flex-col justify-between group hover:glass-card-hover relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Brain size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">AI Decisions Today</span>
          </div>
        </div>
        <div>
          <span className="text-3xl font-bold tracking-wider">215</span>
          <div className="flex flex-col mt-1 gap-1">
            <span className="text-[10px] text-[#10b981] font-bold tracking-wider">98.2% Approved</span>
            <div className="flex items-center gap-1 text-[#10b981]">
              <TrendingUp size={12} />
              <span className="text-[9px] uppercase tracking-wider">12 vs last hour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteers Available */}
      <div className="glass-card flex-1 p-3 flex flex-col justify-between group hover:glass-card-hover relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#10b981]/20 text-[#10b981]">
              <User size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Volunteers Available</span>
          </div>
        </div>
        <div>
          <span className="text-3xl font-bold tracking-wider">362</span>
          <div className="flex flex-col mt-1 gap-1">
            <div className="flex items-center gap-1 text-[#10b981]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_5px_#10b981]"></div>
              <span className="text-[10px] font-bold tracking-wider">41 Nearby</span>
            </div>
            <span className="text-[9px] text-white/40 uppercase tracking-wider">Total Deployed: 1,254</span>
          </div>
        </div>
      </div>

      {/* Transit Health */}
      <div className="glass-card flex-1 p-3 flex flex-col justify-between group hover:glass-card-hover relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#0ea5e9]/20 text-[#0ea5e9]">
              <Bus size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Transit Health</span>
          </div>
        </div>
        <div>
          <span className="text-3xl font-bold tracking-wider text-white">79%</span>
          <div className="flex flex-col mt-1 gap-1">
            <div className="flex items-center gap-1 text-yellow-500">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <span className="text-[10px] font-bold tracking-wider uppercase">Slow</span>
            </div>
            <div className="flex items-center gap-1 text-[#10b981]">
              <TrendingUp size={12} />
              <span className="text-[9px] uppercase tracking-wider">4% vs last hour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Status */}
      <div className="glass-card flex-1 p-3 flex flex-col justify-between group hover:glass-card-hover relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
              <Sun size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Weather Status</span>
          </div>
        </div>
        <div>
          <span className="text-3xl font-bold tracking-wider text-white">26°C</span>
          <div className="flex flex-col mt-1 gap-1">
            <span className="text-[10px] text-white/70 tracking-wider">Clear Sky</span>
            <div className="flex items-center gap-1 text-[#10b981]">
              <AlertCircle size={10} />
              <span className="text-[9px] uppercase tracking-wider font-bold">No Alerts</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
