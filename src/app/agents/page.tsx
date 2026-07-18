"use client";

import { useState } from "react";
import { Brain, Activity, ShieldAlert, CloudRain, Users, Accessibility, Search, AlertCircle, ShoppingCart, X, Settings2, SlidersHorizontal, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

const AGENTS = [
  { name: "Orchestrator", icon: Brain, color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10", border: "border-[#0ea5e9]/20", role: "Central Routing & Synthesis", status: "Online", load: "42%" },
  { name: "Security Agent", icon: ShieldAlert, color: "text-[#ef4444]", bg: "bg-[#ef4444]/10", border: "border-[#ef4444]/20", role: "Anomaly & Threat Detection", status: "Online", load: "68%" },
  { name: "Medical Agent", icon: AlertCircle, color: "text-[#10b981]", bg: "bg-[#10b981]/10", border: "border-[#10b981]/20", role: "Health Triage & Dispatch", status: "Online", load: "12%" },
  { name: "Crowd Agent", icon: Users, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/20", role: "Density & Flow Optimization", status: "Online", load: "89%" },
  { name: "Weather Agent", icon: CloudRain, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20", role: "Climate Resilience & Heat Protocols", status: "Standby", load: "5%" },
  { name: "Accessibility", icon: Accessibility, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10", border: "border-[#8b5cf6]/20", role: "ADA Route & Sensory Monitoring", status: "Online", load: "22%" },
  { name: "Fraud Agent", icon: Search, color: "text-[#f43f5e]", bg: "bg-[#f43f5e]/10", border: "border-[#f43f5e]/20", role: "Ticket Scalping & Counterfeit Det.", status: "Online", load: "75%" },
  { name: "Vendor Agent", icon: ShoppingCart, color: "text-[#eab308]", bg: "bg-[#eab308]/10", border: "border-[#eab308]/20", role: "Concession Demand Forecasting", status: "Online", load: "34%" },
];

export default function AgentsPage() {
  const [configAgent, setConfigAgent] = useState<any>(null);
  
  // Modal State
  const [autonomyLevel, setAutonomyLevel] = useState("advisory");
  const [modelEngine, setModelEngine] = useState("gpt-4o-mini");
  const [temperature, setTemperature] = useState(20);
  const [confidence, setConfidence] = useState(92);
  const [isSaving, setIsSaving] = useState(false);

  const openConfig = async (agent: any) => {
    setConfigAgent(agent);
    
    // Fetch current config for this agent
    try {
      const agentId = agent.name.split(' ')[0]; // e.g., 'Security', 'Medical'
      const data = await apiFetch<any>(`/agent-config/${agentId}/`);
      if (data) {
        setAutonomyLevel(data.autonomy_level);
        setModelEngine(data.model_engine);
        setTemperature(Math.round(data.temperature * 100));
        setConfidence(data.confidence_threshold);
      }
    } catch (e) {
      console.error(e);
      setAutonomyLevel("advisory");
      setModelEngine("gpt-4o-mini");
      setTemperature(20);
      setConfidence(92);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const agentId = configAgent.name.split(' ')[0];
      const payload = {
        agent_id: agentId,
        autonomy_level: autonomyLevel,
        model_engine: modelEngine,
        temperature: temperature / 100,
        confidence_threshold: confidence
      };
      
      try {
        await apiFetch(`/agent-config/${agentId}/`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } catch (e) {
        await apiFetch(`/agent-config/`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
    setConfigAgent(null);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white/90">Agent Directory</h1>
          <p className="text-sm text-white/50 tracking-wider">Multi-Agent Autonomous Network Status</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">All Systems Nominal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto no-scrollbar pb-20">
        {AGENTS.map((agent, i) => (
          <div key={i} className={cn("glass-card p-5 flex flex-col relative overflow-hidden group border", agent.border)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full opacity-50"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={cn("p-2.5 rounded-lg", agent.bg)}>
                <agent.icon size={20} className={agent.color} />
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border", 
                agent.status === 'Online' ? "border-[#10b981]/30 text-[#10b981] bg-[#10b981]/10" : "border-white/20 text-white/50 bg-white/5"
              )}>
                {agent.status}
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-1">{agent.name}</h3>
              <p className="text-[11px] text-white/50 leading-relaxed h-8">{agent.role}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] uppercase tracking-widest text-white/40">Compute Load</span>
                <span className="text-[10px] font-mono font-bold text-white/70">{agent.load}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", agent.color.replace('text-', 'bg-'))} 
                  style={{ width: agent.load }}
                ></div>
              </div>
            </div>

            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
              <button className="text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-colors w-32" aria-label={`View logs for ${agent.name}`}>
                View Logs
              </button>
              <button 
                onClick={() => openConfig(agent)}
                className="text-[10px] font-bold uppercase tracking-widest bg-[#0ea5e9]/20 hover:bg-[#0ea5e9]/40 text-[#0ea5e9] border border-[#0ea5e9]/30 px-4 py-2 rounded-lg transition-colors w-32"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {configAgent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8" role="dialog" aria-modal="true" aria-label={`${configAgent.name} agent configuration`}>
          <div className="glass-card w-full max-w-2xl border border-white/10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", configAgent.bg)}>
                  <configAgent.icon size={20} className={configAgent.color} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">Agent Configuration</h2>
                  <p className="text-xs text-white/50">{configAgent.name} - Settings & Permissions</p>
                </div>
              </div>
              <button onClick={() => setConfigAgent(null)} aria-label="Close configuration modal" className="text-white/40 hover:text-white transition-colors p-1">
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6">
              
              {/* Autonomy Level */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Settings2 size={16} className="text-[#0ea5e9]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Autonomy Level</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setAutonomyLevel("advisory")}
                    className={cn("flex flex-col items-start gap-1 p-3 rounded border transition-colors", autonomyLevel === "advisory" ? "border-white/50 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/30")}
                  >
                    <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">Advisory Mode</span>
                    <span className="text-[10px] text-white/40 text-left">Agent suggests actions. Human approval required.</span>
                  </button>
                  <button 
                    onClick={() => setAutonomyLevel("autonomous")}
                    className={cn("flex flex-col items-start gap-1 p-3 rounded border transition-colors", autonomyLevel === "autonomous" ? "border-[#0ea5e9]/50 bg-[#0ea5e9]/10 shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]" : "border-[#0ea5e9]/20 bg-[#0ea5e9]/5 hover:border-[#0ea5e9]/30")}
                  >
                    <div className="flex justify-between w-full">
                      <span className="text-[11px] font-bold text-[#0ea5e9] uppercase tracking-widest">Autonomous</span>
                      {autonomyLevel === "autonomous" && <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shadow-[0_0_5px_#0ea5e9] animate-pulse"></span>}
                    </div>
                    <span className="text-[10px] text-[#0ea5e9]/70 text-left">Agent executes APIs and workflows automatically.</span>
                  </button>
                </div>
              </div>

              {/* Model Engine */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-[#8b5cf6]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Compute Engine</h3>
                </div>
                <div className="flex items-center gap-4 p-3 rounded border border-white/5 bg-white/[0.02]">
                  <select 
                    value={modelEngine}
                    onChange={(e) => setModelEngine(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white text-xs p-2 rounded outline-none flex-1 font-mono"
                  >
                    <option value="gpt-4o">GPT-4o (High Reasoning)</option>
                    <option value="gpt-4o-mini">GPT-4o-mini (Fast)</option>
                    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Balanced)</option>
                    <option value="llama-3-70b">Llama 3 70B (Fast Local)</option>
                  </select>
                  <div className="flex flex-col flex-1 gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-white/50">
                      <span>Temperature: {(temperature / 100).toFixed(2)}</span>
                      <span>(Deterministic)</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={temperature} 
                      onChange={(e) => setTemperature(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8b5cf6]" 
                    />
                  </div>
                </div>
              </div>

              {/* Confidence Threshold */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-[#10b981]" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Action Confidence Threshold</h3>
                  </div>
                  <span className="text-xs font-mono text-[#10b981]">{confidence}%</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-white/[0.02]">
                  <input 
                    type="range" 
                    min="50" max="99" 
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10b981]" 
                  />
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/40 mt-2">
                    <span>Low Strictness (50%)</span>
                    <span>High Strictness (99%)</span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end gap-3">
              <button 
                onClick={() => setConfigAgent(null)}
                className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white px-5 py-2.5 rounded transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={saveConfig}
                disabled={isSaving}
                className="text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded transition-colors shadow-lg"
              >
                {isSaving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
