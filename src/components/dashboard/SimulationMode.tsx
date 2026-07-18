"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, Activity, CheckCircle2, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from "zod";
import { SimulationResponseSchema } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";

interface SimResult {
  name: string;
  density: number;
  status: string;
}

export function SimulationMode() {
  const [isActive, setIsActive] = useState(false);
  const [scenario, setScenario] = useState("evacuation");
  const [running, setRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simResults, setSimResults] = useState<SimResult[] | null>(null);

  const runSimulation = async () => {
    setRunning(true);
    setToastMessage(null);
    setSimResults(null);
    
    try {
      const data = await apiFetch<unknown>('/simulate/', {
        method: "POST",
        body: JSON.stringify({ scenario })
      }, SimulationResponseSchema);
      
      const criticalSectors = data.simulated_sectors.filter((s: unknown) => s.status === 'critical' || s.status === 'warning');
      setSimResults(criticalSectors);
      setToastMessage(`Simulation complete. ${criticalSectors.length} sectors flagged as critical/warning in this scenario.`);
    } catch (err: unknown) {
      setToastMessage(`Simulation failed: ${err.message || "Backend error"}`);
    } finally {
      setRunning(false);
    }
  };

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className={cn("glass-card p-6 h-full flex flex-col transition-all relative overflow-hidden", isActive ? "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "")}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">Digital Twin Simulation</h2>
          <p className="text-xs text-white/50 tracking-wider">&quot;What-If&quot; Scenario Engine</p>
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={cn("text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border", 
            isActive ? "bg-purple-500/20 text-purple-300 border-purple-500/50" : "bg-white/5 hover:bg-white/10 text-white/70 border-white/10")}
        >
          {isActive ? "Disable Mode" : "Enable Mode"}
        </button>
      </div>

      {isActive ? (
        <div className="flex-1 flex flex-col space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 mb-2 block">Select Scenario</label>
            <select 
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white/90 outline-none focus:border-purple-500/50"
            >
              <option value="evacuation">Emergency Evacuation (Live Occupancy)</option>
              <option value="gate_closure">Unexpected Gate Closure</option>
              <option value="surge">Sudden Crowd Surge</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-black/20 p-4 overflow-y-auto">
            {running ? (
              <div className="flex flex-col items-center animate-pulse">
                <Activity className="text-purple-400 mb-2" size={24} />
                <span className="text-xs text-purple-400 font-mono">Running Agents...</span>
              </div>
            ) : simResults ? (
              <div className="w-full h-full flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Simulated Bottlenecks</span>
                {simResults.length === 0 ? (
                  <span className="text-xs text-white/30 font-mono text-center mt-4">No critical bottlenecks detected in this scenario.</span>
                ) : (
                  <div className="space-y-2">
                    {simResults.map((s, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={12} className={s.status === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                          <span className="text-xs font-bold text-white/90">Sector {s.name}</span>
                        </div>
                        <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded", s.status === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>
                          {s.density}% Density
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-white/30 font-mono text-center px-4">
                Simulation environment isolated from production DB. Ready to compute hypothetical agent responses.
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-auto shrink-0">
            <button 
              onClick={runSimulation}
              disabled={running}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Play size={14} /> Run Scenario
            </button>
            <button 
              onClick={() => { setSimResults(null); setToastMessage(null); }}
              className="flex items-center justify-center px-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-white/70"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-white/30 font-mono text-center max-w-[200px]">
            Enable Simulation Mode to run hypothetical scenarios against the current live stadium state.
          </span>
        </div>
      )}

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-card border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] p-4 flex gap-3 items-start z-50 rounded-xl"
          >
            <CheckCircle2 className="text-purple-400 shrink-0 mt-0.5" size={18} />
            <div className="flex-1 text-sm text-white/90 leading-snug">
              {toastMessage}
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-white/50 hover:text-white/90 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

