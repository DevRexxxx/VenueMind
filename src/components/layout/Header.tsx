"use client";

import { useEffect, useState, useRef } from "react";
import { Cloud, Trophy, Activity, User, Sun, CloudRain } from "lucide-react";
import { WS_BASE_URL } from "@/lib/utils";

export function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [liveData, setLiveData] = useState({
    weather: { temp: "26°C", condition: "Clear Sky" },
    system_status: { text: "All Systems Operational", color: "#10b981" },
    match: { home: "ARG", away: "FRA", stage: "Group Stage", status: "Live" }
  });
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Time interval
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // WebSocket connection
    const connectWs = () => {
      ws.current = new WebSocket(`${WS_BASE_URL}/dashboard/`);
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'live_header') {
            setLiveData(data.data);
          }
        } catch (e) {
          console.error("Error parsing websocket message", e);
        }
      };
      ws.current.onclose = () => {
        // Reconnect after 3 seconds
        setTimeout(connectWs, 3000);
      };
    };
    connectWs();

    return () => {
      clearInterval(interval);
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <header role="banner" aria-label="Dashboard header" className="h-20 w-full flex items-center justify-between px-6 py-2 z-10 border-b border-white/5 bg-background/80 backdrop-blur-md">
      
      {/* Left: Event Logo */}
      <div className="flex items-center space-x-3 w-64">
        <Trophy className="text-[#f59e0b]" size={28} />
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-widest text-white/90 leading-tight">FIFA WORLD CUP</span>
          <span className="text-sm font-bold tracking-widest text-white/90 leading-tight">2026</span>
        </div>
      </div>

      {/* Center: Main Title */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          MULTI-AGENT AUTONOMOUS OPERATIONS HUB
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#3b82f6] font-semibold">POWERED BY GENAI</span>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse`} style={{ backgroundColor: liveData.system_status.color, boxShadow: `0 0 8px ${liveData.system_status.color}` }}></div>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: liveData.system_status.color }}>System Status: {liveData.system_status.text}</span>
          </div>
        </div>
      </div>

      {/* Right: Match, Time, Weather, User */}
      <div className="flex items-center space-x-6 justify-end w-[500px]">
        {/* Match Info */}
        <div className="flex flex-col items-end border-r border-white/10 pr-6">
          <span className="text-[10px] text-white/50 tracking-widest uppercase">MATCH</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-wider">{liveData.match.home}</span>
            <span className="text-xs text-white/50">vs</span>
            <span className="text-sm font-bold tracking-wider">{liveData.match.away}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] text-white/40 uppercase whitespace-nowrap">{liveData.match.stage}</span>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <span className="text-[9px] text-red-500 uppercase font-bold animate-pulse">{liveData.match.status}</span>
          </div>
        </div>

        {/* Time & Date */}
        <div className="flex flex-col items-end border-r border-white/10 pr-6" aria-live="polite" aria-label="Current time">
          <span className="text-lg font-mono font-light tracking-wider text-white/90 leading-none mb-1">{time}</span>
          <span className="text-[11px] text-white/50 tracking-wider uppercase">{date}</span>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-6">
          {liveData.weather.condition.includes("Rain") ? <CloudRain className="text-blue-400" size={24} /> : liveData.weather.condition.includes("Cloud") ? <Cloud className="text-gray-400" size={24} /> : <Sun className="text-[#f59e0b]" size={24} />}
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider">{liveData.weather.temp}</span>
            <span className="text-[10px] text-white/50 tracking-wider uppercase">{liveData.weather.condition}</span>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-purple-600 flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <User size={18} className="text-white/70" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-white/90">Ops Commander</span>
            <span className="text-[10px] text-white/50 tracking-wider">Super Admin</span>
          </div>
        </div>
      </div>
      
    </header>
  );
}
