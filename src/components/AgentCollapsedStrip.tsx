import { agents } from "@/data/kanban-data";
import PxIcon from "./PxIcon";

const agentIcons: Record<string, string> = {
  vlad: "code",
  ivar: "briefcase-minus",
  bjorn: "cloud-upload",
};

interface Props {
  onExpand: () => void;
}

export default function AgentCollapsedStrip({ onExpand }: Props) {
  return (
    <div className="w-12 bg-card border-l border-border flex flex-col items-center py-2 gap-2 shrink-0">
      {/* Expand button */}
      <button
        onClick={onExpand}
        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent border border-border rounded transition-colors"
        title="Show AI Agents"
      >
        <PxIcon icon="chevron-left" size={16} />
      </button>

      <div className="w-6 border-t border-border" />

      {/* Agent avatars with pulse */}
      {agents.map((agent) => {
        const isWorking = agent.status === "working";
        return (
          <div key={agent.id} className="relative group" title={`${agent.name} — ${agent.role}`}>
            <div className="relative">
              {isWorking && (
                <span className="absolute inset-0 rounded-full animate-agent-pulse ring-2 ring-primary" />
              )}
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-border relative z-10"
              />
              {/* Status dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card z-20 bg-emerald-500"
              />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50">
              <div className="bg-popover border border-border px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg">
                <span className="font-medium text-foreground">{agent.name}</span>
                <span className="text-muted-foreground ml-1">· {agent.status}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
