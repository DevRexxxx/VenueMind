"use client";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Bus, Train, Car, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

const TRANSPORT = [
  { id: "metro", label: "Metro Line 1", icon: Train, occupancy: 87, status: "On Time", color: "green" },
  { id: "metro2", label: "Metro Line 2", icon: Train, occupancy: 94, status: "Delayed 12min", color: "red" },
  { id: "shuttle", label: "Shuttle Bus A", icon: Bus, occupancy: 72, status: "On Time", color: "green" },
  { id: "shuttle2", label: "Shuttle Bus B", icon: Bus, occupancy: 65, status: "On Time", color: "green" },
  { id: "parking", label: "Parking Zone A", icon: Car, occupancy: 91, status: "Near Full", color: "orange" },
  { id: "parking2", label: "Parking Zone B", icon: Car, occupancy: 58, status: "Available", color: "green" },
];

export function TransportOverview() {
  const colorMap: Record<string, Record<string, string>> = {
    green: { bar: "bg-[#10b981]", text: "text-[#10b981]" },
    orange: { bar: "bg-[#f59e0b]", text: "text-[#f59e0b]" },
    red: { bar: "bg-[#ef4444]", text: "text-[#ef4444]" },
  };

  return (
    <div className="glass-card w-full h-full p-4 flex flex-col relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 shrink-0">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">Transport Overview</h2>
      </div>

      {/* Bars */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar" tabIndex={0}>
        {TRANSPORT.map((t) => {
          const style = colorMap[t.color];
          return (
            <div key={t.id} className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <t.icon size={12} className="text-white/40" />
                  <span className="text-[10px] font-bold text-white/80">{t.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[9px] font-bold", style.text)}>{t.status}</span>
                  <span className="text-[10px] font-bold text-white/70">{t.occupancy}%</span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", style.bar)}
                  style={{ width: `${t.occupancy}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
