import { agents, type Agent } from "@/data/kanban-data";
import { Bot, Sparkles, Code2, Package, Rocket } from "lucide-react";

const agentIcons: Record<string, typeof Code2> = {
  vlad: Code2,
  ivar: Package,
  bjorn: Rocket,
};

const activityLog = [
  { agentId: "vlad", action: "Pushed 3 commits to", target: "feat/collab-editing", time: "30s ago" },
  { agentId: "ivar", action: "Updated sprint board with", target: "velocity insights", time: "1m ago" },
  { agentId: "bjorn", action: "Health check passed for", target: "EU-West deploy", time: "2m ago" },
  { agentId: "vlad", action: "Resolved merge conflict in", target: "collaboration.ts", time: "4m ago" },
  { agentId: "ivar", action: "Created sub-task for", target: "NEXUS-191", time: "5m ago" },
  { agentId: "bjorn", action: "Scaled up instances for", target: "US-East region", time: "8m ago" },
];

export default function AgentActivityBar() {
  return (
    <div className="w-72 bg-surface-1 border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
        <Sparkles size={16} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">AI Agents</span>
        <span className="ml-auto text-xs text-success flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
          3 active
        </span>
      </div>

      {/* Agent cards */}
      <div className="px-3 py-3 space-y-2 border-b border-border shrink-0">
        {agents.map((agent) => {
          const Icon = agentIcons[agent.id];
          return (
            <div
              key={agent.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
            >
              <div className="relative shrink-0">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-border"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${agent.statusColor} border-2 border-surface-2`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground">{agent.name}</span>
                  <Icon size={12} className={agent.color} />
                </div>
                <span className="text-xs text-muted-foreground truncate block">{agent.role}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                agent.status === "working"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}>
                {agent.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Live activity feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider font-medium sticky top-0 bg-surface-1">
          Live Activity
        </div>
        <div className="px-3 space-y-1 pb-3">
          {activityLog.map((entry, i) => {
            const agent = agents.find((a) => a.id === entry.agentId)!;
            return (
              <div
                key={i}
                className="flex gap-2.5 px-2 py-2 rounded-md hover:bg-surface-2/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className={`font-medium ${agent.color}`}>{agent.name}</span>{" "}
                    {entry.action}{" "}
                    <span className="text-foreground font-mono text-[11px]">{entry.target}</span>
                  </p>
                  <span className="text-[10px] text-muted-foreground/60">{entry.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
