import { CityWideView } from "@/components/dashboard/CityWideView";
import { ROIMetrics } from "@/components/dashboard/ROIMetrics";
import { IncidentTimeline } from "@/components/dashboard/IncidentTimeline";

export default function SituationRoomPage() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-12 gap-4 h-[350px]">
        <div className="col-span-12 lg:col-span-6 h-full">
          <CityWideView />
        </div>
        <div className="col-span-12 lg:col-span-6 h-full">
          <ROIMetrics />
        </div>
      </div>
      <div className="flex-1 min-h-[350px]">
        <IncidentTimeline />
      </div>
    </div>
  );
}

