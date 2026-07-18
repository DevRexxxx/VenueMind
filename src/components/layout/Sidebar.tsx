"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Map, 
  Network, 
  AlertTriangle, 
  Users, 
  Car, 
  ShieldAlert, 
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Activity,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Overview", icon: Home, href: "/" },
  { name: "Stadium View", icon: Map, href: "/twin" },
  { name: "Crowd Monitoring", icon: Users, href: "/crowd" },
  { name: "Incidents", icon: AlertTriangle, href: "/incidents" },
  { name: "AI Agents", icon: Network, href: "/agents" },
  { name: "Volunteers", icon: HeartHandshake, href: "/volunteers" },
  { name: "Transportation", icon: Car, href: "/transportation" },
  { name: "Communications", icon: MessageSquare, href: "/communications" },
  { name: "Medical", icon: Activity, href: "/medical" },
  { name: "Security", icon: ShieldAlert, href: "/security" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <motion.aside 
      animate={{ width: isExpanded ? 240 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-transparent flex flex-col relative z-20 m-4 mt-6 overflow-hidden"
    >
      <div className="flex items-center justify-end px-4 mb-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isExpanded}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2 space-y-1.5 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                isActive 
                  ? "bg-[#1e3a8a]/40 border border-[#3b82f6]/40 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "hover:bg-white/5 text-white/50 hover:text-white border border-transparent"
              )}
            >
              <item.icon 
                size={18} 
                className={cn("flex-shrink-0", isActive ? "text-[#3b82f6]" : "text-white/40")}
                strokeWidth={isActive ? 2.5 : 1.5}
                aria-hidden="true"
              />
              <motion.span 
                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
                className={cn("truncate font-medium text-sm tracking-wide", isExpanded ? "block font-semibold" : "hidden")}
              >
                {item.name}
              </motion.span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}

