import { DigitalTwin } from "@/components/dashboard/DigitalTwin";
import { SimulationMode } from "@/components/dashboard/SimulationMode";

export default function TwinPage() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 min-h-[500px]">
        <DigitalTwin />
      </div>
      <div className="h-[300px]">
        <SimulationMode />
      </div>
    </div>
  );
}

