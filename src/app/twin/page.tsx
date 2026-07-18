"use client";

import dynamic from "next/dynamic";

const DigitalTwin = dynamic(() => import("@/components/dashboard/DigitalTwin").then(mod => mod.DigitalTwin), { ssr: false });
const SimulationMode = dynamic(() => import("@/components/dashboard/SimulationMode").then(mod => mod.SimulationMode), { ssr: false });

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

