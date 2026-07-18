"use client";

import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Users, AlertTriangle, MessageSquare, Shield, Activity, Sun, ShieldAlert } from "lucide-react";
import { cn, WS_BASE_URL } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { z } from "zod";
import { AgentStatusSchema } from "@/lib/schemas";

const INITIAL_AGENTS = [
  { id: "crowd", label: "Crowd Agent", icon: Users, status: "Healthy", color: "green" },
  { id: "gate", label: "Gate Agent", icon: AlertTriangle, status: "Healthy", color: "green" },
  { id: "comm", label: "Communication Agent", icon: MessageSquare, status: "Healthy", color: "green" },
  { id: "security", label: "Security Agent", icon: Shield, status: "Active", color: "blue" },
  { id: "medical", label: "Medical Agent", icon: Activity, status: "Warning", color: "orange" },
  { id: "weather", label: "Weather Agent", icon: Sun, status: "Healthy", color: "green" },
  { id: "emergency", label: "Emergency Agent", icon: ShieldAlert, status: "Standby", color: "gray" },
];

export function AgentNetwork() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const liveData = await apiFetch<any[]>('/agent-status/', {}, z.array(AgentStatusSchema));
        // Merge live data with icons
        const merged = INITIAL_AGENTS.map(base => {
          const live = liveData.find((a: any) => a.id === base.id);
          if (live) {
            return { ...base, status: live.status, color: live.color };
          }
          return base;
        });
        setAgents(merged);
      } catch (err) {
        console.error("Failed to fetch initial agent status", err);
      }
    };
    fetchStatus();
  }, []);

  // Listen for WebSocket updates
  const { lastJsonMessage } = useWebSocket(`${WS_BASE_URL}/dashboard/`, {
    share: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage && (lastJsonMessage as any).type === 'live_header') {
      const data = (lastJsonMessage as any).data;
      if (data && data.agent_network) {
        const liveData = data.agent_network;
        setAgents(prevAgents => prevAgents.map(base => {
          const live = liveData.find((a: any) => a.id === base.id);
          if (live) {
            return { ...base, status: live.status, color: live.color };
          }
          return base;
        }));
      }
    }
  }, [lastJsonMessage]);

  const colorMap: any = {
    green: { bg: "bg-[#10b981]/20", text: "text-[#10b981]", border: "border-[#10b981]/30", dot: "bg-[#10b981]", shadow: "shadow-[0_0_8px_#10b981]" },
    blue: { bg: "bg-[#3b82f6]/20", text: "text-[#3b82f6]", border: "border-[#3b82f6]/30", dot: "bg-[#3b82f6]", shadow: "shadow-[0_0_8px_#3b82f6]" },
    orange: { bg: "bg-[#f59e0b]/20", text: "text-[#f59e0b]", border: "border-[#f59e0b]/30", dot: "bg-[#f59e0b]", shadow: "shadow-[0_0_8px_#f59e0b]" },
    red: { bg: "bg-[#ef4444]/20", text: "text-[#ef4444]", border: "border-[#ef4444]/30", dot: "bg-[#ef4444]", shadow: "shadow-[0_0_8px_#ef4444]" },
    gray: { bg: "bg-white/5", text: "text-white/50", border: "border-white/10", dot: "bg-white/30", shadow: "" },
  };

  return (
    <div className="glass-card w-full h-full p-4 flex flex-col relative overflow-hidden group" role="region" aria-label="AI Agent network status">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 z-10 shrink-0">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">AI Agent Network</h2>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {agents.map((agent) => {
          const style = colorMap[agent.color];
          return (
            <div 
              key={agent.id}
              className="flex items-center justify-between p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", style?.bg, style?.text, style?.border)}>
                  <agent.icon size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/90">{agent.label}</span>
                  <span className={cn("text-[9px] font-bold uppercase tracking-wider", style?.text)}>{agent.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pr-2">
                <div className={cn("w-2 h-2 rounded-full", style?.dot, style?.shadow, agent.status !== "Standby" && "animate-pulse")} aria-hidden="true"></div>
                <span className="sr-only">{agent.status}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
