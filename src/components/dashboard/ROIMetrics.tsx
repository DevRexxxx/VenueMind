"use client";

import { useEffect, useState } from "react";
import { DollarSign, Clock, ShieldCheck, Users, Brain, TrendingUp } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ROIData {
  total_incidents: number;
  resolved_incidents: number;
  active_incidents: number;
  prevention_rate_pct: number;
  avg_resolution_time_seconds: number | null;
  total_staff: number;
  active_staff: number;
  staff_utilisation_pct: number;
  ai_trust_score_pct: number | null;
  total_feedback: number;
  severity_breakdown: Record<string, number>;
}

function formatResolutionTime(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

export function ROIMetrics() {
  const [data, setData] = useState<ROIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchROI() {
      try {
        const result = await apiFetch<ROIData>("/roi-metrics/");
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load ROI metrics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchROI();
    // Refresh every 60 seconds so the metrics stay live without hammering the server
    const interval = setInterval(fetchROI, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const metrics = data
    ? [
        {
          icon: <ShieldCheck className="text-green-400 mb-2" size={20} />,
          value: `${data.prevention_rate_pct}%`,
          label: "Prevention Rate",
        },
        {
          icon: <Clock className="text-blue-400 mb-2" size={20} />,
          value: formatResolutionTime(data.avg_resolution_time_seconds),
          label: "Avg Resolution",
        },
        {
          icon: <Users className="text-purple-400 mb-2" size={20} />,
          value: `${data.staff_utilisation_pct}%`,
          label: "Staff Utilisation",
        },
        {
          icon: <Brain className="text-yellow-400 mb-2" size={20} />,
          value: data.ai_trust_score_pct !== null ? `${data.ai_trust_score_pct}%` : "—",
          label: "AI Trust Score",
        },
        {
          icon: <TrendingUp className="text-cyan-400 mb-2" size={20} />,
          value: data.resolved_incidents.toString(),
          label: "Incidents Resolved",
        },
        {
          icon: <DollarSign className="text-orange-400 mb-2" size={20} />,
          value: data.active_incidents.toString(),
          label: "Active Incidents",
        },
      ]
    : [];

  return (
    <div
      className="glass-card p-6 flex flex-col"
      role="region"
      aria-label="Business Viability and ROI metrics"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">
            Business Viability &amp; ROI
          </h2>
          <p className="text-xs text-white/50 tracking-wider">Live Value Generation</p>
        </div>
        {loading && (
          <span className="text-[10px] uppercase tracking-wider text-white/30 animate-pulse">
            Loading…
          </span>
        )}
        {error && !loading && (
          <span className="text-[10px] uppercase tracking-wider text-red-400" role="alert">
            {error}
          </span>
        )}
      </div>

      {loading && !data ? (
        // Skeleton loader — preserves layout height while data is in flight
        <div className="flex-1 grid grid-cols-3 gap-4 min-h-[100px]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-lg border border-white/10 animate-pulse"
              aria-hidden="true"
            >
              <div className="w-5 h-5 bg-white/10 rounded mb-2" />
              <div className="w-12 h-6 bg-white/10 rounded mb-1" />
              <div className="w-16 h-2 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-3 md:grid-cols-6 gap-4 min-h-[100px]">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              {m.icon}
              <span className="text-2xl font-bold text-white">{m.value}</span>
              <span className="text-[9px] uppercase tracking-widest text-white/50 text-center mt-1">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
