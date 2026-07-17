"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const KPI_DATA = [
  {
    label: "OCCUPANCY",
    value: "68%",
    subtext: "+12% vs last hour",
    icon: Activity,
    color: "text-[#06b6d4]",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.2)]",
    border: "border-[#06b6d4]/30"
  },
  {
    label: "INCIDENTS PREVENTED",
    value: "14",
    subtext: "Today",
    icon: ShieldCheck,
    color: "text-[#22c55e]",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]",
    border: "border-[#22c55e]/30"
  },
  {
    label: "AVG RESPONSE TIME",
    value: "42s",
    subtext: "-18s vs target",
    icon: Zap,
    color: "text-[#FF5D00]",
    glow: "shadow-[0_0_15px_rgba(255,93,0,0.2)]",
    border: "border-[#FF5D00]/30"
  }
];

export function KPIs() {
  return (
    <div className="col-span-12 lg:col-span-4 row-span-2 flex flex-col gap-4">
      {KPI_DATA.map((kpi, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={cn(
            "glass-card hover:glass-card-hover flex-1 p-5 flex items-center justify-between relative overflow-hidden",
            kpi.border
          )}
        >
          <div className="relative z-10">
            <div className="text-xs font-bold tracking-widest text-white/50 mb-1">{kpi.label}</div>
            <div className="text-3xl font-light tracking-wider flex items-baseline gap-2">
              {kpi.value}
            </div>
            <div className={cn("text-xs font-medium mt-1", kpi.color)}>{kpi.subtext}</div>
          </div>
          <div className={cn("p-4 rounded-full bg-black/40 border border-white/5 relative z-10", kpi.glow)}>
            <kpi.icon size={24} className={kpi.color} />
          </div>
          <div className={cn("absolute -right-10 -bottom-10 w-32 h-32 blur-[40px] opacity-20 pointer-events-none", kpi.color.replace('text-', 'bg-'))}></div>
        </motion.div>
      ))}
    </div>
  );
}
