import { TopKPIs } from "@/components/dashboard/TopKPIs";
import dynamic from "next/dynamic";

const DigitalTwin = dynamic(() => import("@/components/dashboard/DigitalTwin").then(mod => mod.DigitalTwin), { ssr: false });
const AgentNetwork = dynamic(() => import("@/components/dashboard/AgentNetwork").then(mod => mod.AgentNetwork), { ssr: false });
const IncidentTimeline = dynamic(() => import("@/components/dashboard/IncidentTimeline").then(mod => mod.IncidentTimeline), { ssr: false });
import { BottomAnalytics } from "@/components/dashboard/BottomAnalytics";
import { AIDecisionFeed } from "@/components/dashboard/AIDecisionFeed";
import { VolunteerDispatch } from "@/components/dashboard/VolunteerDispatch";
import { TransportOverview } from "@/components/dashboard/TransportOverview";
import { SystemLogs } from "@/components/dashboard/SystemLogs";
const CommandAssistant = dynamic(() => import("@/components/dashboard/CommandAssistant").then(mod => mod.CommandAssistant), { ssr: false });
const ROIMetrics = dynamic(() => import("@/components/dashboard/ROIMetrics").then(mod => mod.ROIMetrics), { ssr: false });
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-full h-max pb-4">
      
      {/* Top Row: 6 KPI Cards */}
      <div className="min-h-[100px] shrink-0">
        <ErrorBoundary fallbackName="Top KPIs">
          <TopKPIs />
        </ErrorBoundary>
      </div>

      {/* Middle Row: Digital Twin (Left 6) | Agent Network (Mid 3) | Live Incidents (Right 3) */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-[450px] shrink-0">
        <div className="col-span-12 xl:col-span-6 h-full">
          <ErrorBoundary fallbackName="Digital Twin">
            <DigitalTwin />
          </ErrorBoundary>
        </div>
        <div className="col-span-12 lg:col-span-6 xl:col-span-3 h-full">
          <ErrorBoundary fallbackName="Agent Network">
            <AgentNetwork />
          </ErrorBoundary>
        </div>
        <div className="col-span-12 lg:col-span-6 xl:col-span-3 h-full">
          <ErrorBoundary fallbackName="Incident Timeline">
            <IncidentTimeline />
          </ErrorBoundary>
        </div>
      </div>

      {/* Bottom Analytics Row: 4 Panels (3 cols each) */}
      <div className="grid grid-cols-12 gap-4 min-h-[250px] shrink-0">
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-full">
          <BottomAnalytics />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-full">
          <AIDecisionFeed />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-full">
          <VolunteerDispatch />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-full">
          <TransportOverview />
        </div>
      </div>

      {/* ROI Row */}
      <div className="shrink-0 mb-4">
        <ErrorBoundary fallbackName="ROI Metrics">
          <ROIMetrics />
        </ErrorBoundary>
      </div>

      {/* Footer: System Logs & AI Copilot */}
      <div className="flex gap-4 min-h-[60px] items-center shrink-0">
        <div className="flex-1 h-full">
          <SystemLogs />
        </div>
        <div className="w-[400px] h-full flex items-center justify-end">
          <CommandAssistant />
        </div>
      </div>
      
    </div>
  );
}
