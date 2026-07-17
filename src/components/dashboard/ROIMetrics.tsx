"use client";

import { DollarSign, Clock, ShieldCheck } from "lucide-react";

export function ROIMetrics() {
  return (
    <div className="glass-card p-6 h-[200px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">Business Viability & ROI</h2>
          <p className="text-xs text-white/50 tracking-wider">Live Value Generation</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4">
        <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Clock className="text-blue-400 mb-2" size={20} />
          <span className="text-2xl font-bold text-white">124</span>
          <span className="text-[9px] uppercase tracking-widest text-white/50 text-center">Staff Hours Saved</span>
        </div>
        
        <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-lg border border-white/10">
          <ShieldCheck className="text-green-400 mb-2" size={20} />
          <span className="text-2xl font-bold text-white">42</span>
          <span className="text-[9px] uppercase tracking-widest text-white/50 text-center">Incidents Prevented</span>
        </div>
        
        <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-lg border border-white/10">
          <DollarSign className="text-yellow-400 mb-2" size={20} />
          <span className="text-2xl font-bold text-white">$14.2k</span>
          <span className="text-[9px] uppercase tracking-widest text-white/50 text-center">Estimated Savings</span>
        </div>
      </div>
    </div>
  );
}
