"use client";

import { Activity, Users, ShieldAlert } from "lucide-react";

export function CityWideView() {
  const venues = [
    { name: "MetLife Stadium", occupancy: "85%", status: "Nominal", incidents: 2 },
    { name: "Lumen Field", occupancy: "92%", status: "Warning", incidents: 5 },
    { name: "Azteca Stadium", occupancy: "40%", status: "Nominal", incidents: 0 },
  ];

  return (
    <div className="glass-card p-6 h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">City-Wide Dashboard</h2>
          <p className="text-xs text-white/50 tracking-wider">Multi-Venue Aggregation</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {venues.map((venue, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div>
              <div className="text-sm font-bold text-white/90">{venue.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2 mt-1">
                <Users size={10} /> Occupancy: {venue.occupancy}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-white/40">Active Incidents</span>
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  {venue.incidents > 0 && <ShieldAlert size={12} className="text-red-400" />}
                  {venue.incidents}
                </span>
              </div>
              <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                venue.status === 'Nominal' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
              }`}>
                {venue.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 uppercase tracking-widest">
        <span>Federated Learning Node: Syncing</span>
        <Activity size={12} className="animate-pulse text-purple-400" />
      </div>
    </div>
  );
}
