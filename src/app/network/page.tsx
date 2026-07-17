import { AgentNetwork } from "@/components/dashboard/AgentNetwork";

export default function NetworkPage() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 min-h-[400px]">
        <AgentNetwork />
      </div>
    </div>
  );
}

