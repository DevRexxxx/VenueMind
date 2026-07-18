"use client";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MapPin, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

const VOLUNTEERS = [
  { id: 1, name: "Maria G.", zone: "Gate 7", task: "Crowd guidance", eta: "1 min", status: "en_route" },
  { id: 2, name: "Ahmed K.", zone: "Section N15", task: "Medical assist", eta: "3 min", status: "en_route" },
  { id: 3, name: "Priya S.", zone: "Gate 3", task: "Accessibility help", eta: "—", status: "on_site" },
  { id: 4, name: "Lucas R.", zone: "VIP Lounge", task: "Guest escort", eta: "—", status: "on_site" },
  { id: 5, name: "Fatima H.", zone: "Parking B", task: "Directional aid", eta: "5 min", status: "en_route" },
];

export function VolunteerDispatch() {
  return (
    <div className="glass-card w-full h-full p-4 flex flex-col relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 shrink-0">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">Volunteer Dispatch</h2>
        <span className="text-[10px] font-bold text-[#10b981]">{VOLUNTEERS.length} Active</span>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {VOLUNTEERS.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-purple-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                {v.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white/90">{v.name}</span>
                <div className="flex items-center gap-2 text-[9px] text-white/40">
                  <div className="flex items-center gap-0.5"><MapPin size={8} />{v.zone}</div>
                  <span>•</span>
                  <span>{v.task}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className={cn("text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                v.status === "on_site" 
                  ? "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10" 
                  : "text-[#3b82f6] border-[#3b82f6]/30 bg-[#3b82f6]/10"
              )}>
                {v.status === "on_site" ? "On Site" : "En Route"}
              </span>
              {v.eta !== "—" && (
                <div className="flex items-center gap-0.5 text-[9px] text-white/40">
                  <Clock size={8} />
                  <span>ETA {v.eta}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
