import { useMemo, useState, useEffect, useRef } from "react";
import PxIcon from "./PxIcon";
import type { Agent } from "@/data/kanban-data";

// ─── Simulated per-agent data ──────────────────────────────────

type ActivityType = "commit" | "task" | "comment" | "review" | "deploy" | "design";

interface AgentActivity {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
  // commit-specific
  hash?: string;
  filesChanged?: number;
  additions?: number;
  deletions?: number;
  // task-specific
  taskId?: string;
  from?: string;
  to?: string;
  // comment-specific
  target?: string;
}

interface AgentStats {
  totalCommits: number;
  linesWritten: string;
  prsOpened: number;
  prsMerged: number;
  avgResponseTime: string;
  uptime: string;
  tasksCompleted: number;
  currentStreak: number;
}

const agentActivitySeeds: Record<string, AgentActivity[]> = {
  vlad: [
    { id: "v1", type: "commit", message: "feat: implement WebSocket collaboration layer", time: "12m ago", hash: "a3f1c9e", filesChanged: 8, additions: 342, deletions: 47 },
    { id: "v2", type: "task", message: "Moved 'Auth middleware' to In Progress", time: "25m ago", taskId: "NEX-42", from: "Todo", to: "In Progress" },
    { id: "v3", type: "comment", message: "Left a comment on NEXUS-87", time: "45m ago", target: "NEXUS-87" },
    { id: "v4", type: "commit", message: "refactor: extract auth middleware to shared module", time: "1h ago", hash: "b7d2e4a", filesChanged: 5, additions: 128, deletions: 89 },
    { id: "v5", type: "review", message: "Approved PR #142 — dashboard refactor", time: "2h ago", target: "PR #142" },
    { id: "v6", type: "task", message: "Moved 'WebSocket sync' to Done", time: "3h ago", taskId: "NEX-38", from: "In Progress", to: "Done" },
    { id: "v7", type: "commit", message: "fix: resolve race condition in real-time sync", time: "3h ago", hash: "c9e8f3b", filesChanged: 3, additions: 67, deletions: 22 },
    { id: "v8", type: "comment", message: "Replied to thread on PR #139", time: "4h ago", target: "PR #139" },
    { id: "v9", type: "commit", message: "perf: optimize query batching for dashboard", time: "5h ago", hash: "d1a4b6c", filesChanged: 4, additions: 201, deletions: 156 },
  ],
  ivar: [
    { id: "i1", type: "task", message: "Moved 'Sprint planning' to In Progress", time: "10m ago", taskId: "AUR-12", from: "Todo", to: "In Progress" },
    { id: "i2", type: "comment", message: "Updated acceptance criteria on AUR-15", time: "20m ago", target: "AUR-15" },
    { id: "i3", type: "commit", message: "docs: update sprint planning template with velocity", time: "25m ago", hash: "i1a2b3c", filesChanged: 3, additions: 89, deletions: 15 },
    { id: "i4", type: "task", message: "Moved 'Backlog grooming' to Done", time: "1h ago", taskId: "AUR-09", from: "In Review", to: "Done" },
    { id: "i5", type: "review", message: "Requested changes on PR #98 — velocity calc", time: "2h ago", target: "PR #98" },
    { id: "i6", type: "commit", message: "feat: add burn-down chart to sprint dashboard", time: "2h ago", hash: "i4d5e6f", filesChanged: 4, additions: 156, deletions: 23 },
    { id: "i7", type: "comment", message: "Added note to sprint retro doc", time: "3h ago", target: "Sprint Retro" },
  ],
  bjorn: [
    { id: "b1", type: "deploy", message: "Deployed v2.4.1 to production", time: "5m ago", target: "production" },
    { id: "b2", type: "commit", message: "ops: configure auto-scaling for EU-West cluster", time: "8m ago", hash: "b1x2y3z", filesChanged: 4, additions: 112, deletions: 28 },
    { id: "b3", type: "task", message: "Moved 'SSL cert rotation' to Done", time: "30m ago", taskId: "PHN-22", from: "In Progress", to: "Done" },
    { id: "b4", type: "comment", message: "Commented on infra monitoring alert", time: "45m ago", target: "Alert #301" },
    { id: "b5", type: "commit", message: "feat: add zero-downtime deployment pipeline", time: "1h ago", hash: "b4w5v6u", filesChanged: 6, additions: 267, deletions: 89 },
    { id: "b6", type: "deploy", message: "Deployed hotfix to staging", time: "2h ago", target: "staging" },
    { id: "b7", type: "review", message: "Approved PR #155 — k8s helm chart update", time: "3h ago", target: "PR #155" },
    { id: "b8", type: "commit", message: "fix: resolve SSL certificate rotation issue", time: "3h ago", hash: "b7t8s9r", filesChanged: 2, additions: 45, deletions: 12 },
  ],
  agnes: [
    { id: "a1", type: "design", message: "Updated dark mode token palette in Figma", time: "15m ago", target: "Figma" },
    { id: "a2", type: "commit", message: "design: finalize dark mode token system", time: "18m ago", hash: "ag1b2c3", filesChanged: 12, additions: 456, deletions: 234 },
    { id: "a3", type: "comment", message: "Left feedback on onboarding flow mockup", time: "35m ago", target: "Figma comment" },
    { id: "a4", type: "task", message: "Moved 'Icon set v2' to In Review", time: "1h ago", taskId: "SEN-18", from: "In Progress", to: "In Review" },
    { id: "a5", type: "commit", message: "feat: create motion spec for page transitions", time: "2h ago", hash: "ag4d5e6", filesChanged: 4, additions: 189, deletions: 45 },
    { id: "a6", type: "review", message: "Approved PR #130 — component library update", time: "3h ago", target: "PR #130" },
    { id: "a7", type: "design", message: "Exported icon set v2 assets to shared drive", time: "4h ago", target: "Shared Drive" },
    { id: "a8", type: "task", message: "Moved 'Motion spec' to Done", time: "5h ago", taskId: "SEN-14", from: "In Progress", to: "Done" },
  ],
};

// Extra activity templates for infinite real-time feed per agent
const liveActivityTemplates: Record<string, Omit<AgentActivity, "id" | "time">[]> = {
  vlad: [
    { type: "commit", message: "feat: add optimistic updates for collaboration cursors", hash: randomHash(), filesChanged: 3, additions: 145, deletions: 23 },
    { type: "task", message: "Moved 'Undo/redo stack' to In Progress", taskId: "NEX-51", from: "Todo", to: "In Progress" },
    { type: "comment", message: "Replied to code review on PR #148", target: "PR #148" },
    { type: "commit", message: "fix: handle disconnection gracefully in WS client", hash: randomHash(), filesChanged: 2, additions: 67, deletions: 31 },
    { type: "review", message: "Approved PR #150 — editor plugin lazy loading", target: "PR #150" },
    { type: "task", message: "Moved 'Auth cookie migration' to Done", taskId: "NEX-44", from: "In Progress", to: "Done" },
    { type: "commit", message: "refactor: migrate auth tokens to HTTP-only cookies", hash: randomHash(), filesChanged: 4, additions: 198, deletions: 112 },
  ],
  ivar: [
    { type: "task", message: "Moved 'Capacity planning' to In Review", taskId: "AUR-20", from: "In Progress", to: "In Review" },
    { type: "commit", message: "feat: add capacity planning widget to dashboard", hash: randomHash(), filesChanged: 2, additions: 134, deletions: 12 },
    { type: "comment", message: "Updated sprint goals in project wiki", target: "Wiki" },
    { type: "task", message: "Moved 'Dependency graph' to In Progress", taskId: "AUR-22", from: "Todo", to: "In Progress" },
    { type: "review", message: "Requested changes on PR #101 — backlog sort", target: "PR #101" },
  ],
  bjorn: [
    { type: "deploy", message: "Deployed v2.4.2 to staging", target: "staging" },
    { type: "commit", message: "ops: add Prometheus metrics for pod autoscaler", hash: randomHash(), filesChanged: 3, additions: 156, deletions: 34 },
    { type: "task", message: "Moved 'Canary deploy' to In Progress", taskId: "PHN-28", from: "Todo", to: "In Progress" },
    { type: "comment", message: "Updated runbook for failover procedure", target: "Runbook" },
    { type: "deploy", message: "Deployed canary to 10% of traffic", target: "production-canary" },
    { type: "commit", message: "feat: implement canary deployment strategy", hash: randomHash(), filesChanged: 5, additions: 289, deletions: 67 },
  ],
  agnes: [
    { type: "design", message: "Published responsive grid tokens to Figma", target: "Figma" },
    { type: "commit", message: "design: create responsive grid breakpoint tokens", hash: randomHash(), filesChanged: 8, additions: 234, deletions: 89 },
    { type: "comment", message: "Left contrast ratio feedback on button styles", target: "Figma comment" },
    { type: "task", message: "Moved 'Illustration guide' to In Review", taskId: "SEN-25", from: "In Progress", to: "In Review" },
    { type: "review", message: "Approved PR #135 — micro-interaction library", target: "PR #135" },
    { type: "design", message: "Exported updated illustration assets", target: "Shared Drive" },
  ],
};

function randomHash(): string {
  return Math.random().toString(36).substring(2, 9);
}

const agentStats: Record<string, AgentStats> = {
  vlad: { totalCommits: 1247, linesWritten: "89.2k", prsOpened: 312, prsMerged: 298, avgResponseTime: "1.2s", uptime: "99.8%", tasksCompleted: 456, currentStreak: 14 },
  ivar: { totalCommits: 834, linesWritten: "42.1k", prsOpened: 189, prsMerged: 176, avgResponseTime: "2.1s", uptime: "99.5%", tasksCompleted: 623, currentStreak: 9 },
  bjorn: { totalCommits: 956, linesWritten: "61.7k", prsOpened: 245, prsMerged: 238, avgResponseTime: "0.8s", uptime: "99.9%", tasksCompleted: 389, currentStreak: 21 },
  agnes: { totalCommits: 678, linesWritten: "34.5k", prsOpened: 156, prsMerged: 149, avgResponseTime: "1.8s", uptime: "99.6%", tasksCompleted: 512, currentStreak: 7 },
};

const agentSpecialties: Record<string, string[]> = {
  vlad: ["TypeScript", "Go", "WebSockets", "Auth", "API Design"],
  ivar: ["Sprint Planning", "Backlog Mgmt", "Velocity Tracking", "Story Points"],
  bjorn: ["Docker", "Kubernetes", "CI/CD", "SSL/TLS", "Auto-scaling"],
  agnes: ["Design Systems", "Motion Design", "Figma", "Accessibility", "Icons"],
};

// ─── Activity heatmap generator ────────────────────────────────

function generateHeatmap(agentId: string): number[][] {
  // 7 days × 14 hours (09:00-22:00) grid
  const seed = agentId.charCodeAt(0) + agentId.charCodeAt(agentId.length - 1);
  const rows = 7;
  const cols = 14;
  const grid: number[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let col = 0; col < cols; col++) {
      // Pseudo-random based on seed, row, col
      const v = Math.sin(seed * 9301 + r * 49297 + col * 233) * 10000;
      const rand = v - Math.floor(v);
      // More active during work hours (cols 2-10)
      const workBoost = col >= 2 && col <= 10 ? 0.3 : 0;
      // Weekend reduction (rows 5-6)
      const weekendPenalty = r >= 5 ? 0.4 : 0;
      const activity = Math.max(0, rand + workBoost - weekendPenalty);
      row.push(activity > 0.7 ? 3 : activity > 0.45 ? 2 : activity > 0.25 ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourLabels = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];

const heatColors = [
  "bg-foreground/5",    // 0 - empty
  "bg-emerald-900/60",  // 1 - low
  "bg-emerald-600/70",  // 2 - medium
  "bg-emerald-400",     // 3 - high
];

// ─── Component ─────────────────────────────────────────────────

interface Props {
  agent: Agent;
  onBack: () => void;
}

export default function AgentDetailPanel({ agent, onBack }: Props) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const seedActivities = agentActivitySeeds[agent.id] || [];
  const templates = liveActivityTemplates[agent.id] || liveActivityTemplates.vlad;
  const stats = agentStats[agent.id] || agentStats.vlad;
  const specialties = agentSpecialties[agent.id] || [];
  const heatmap = useMemo(() => generateHeatmap(agent.id), [agent.id]);
  const totalActive = useMemo(() => heatmap.flat().filter((v) => v > 0).length, [heatmap]);
  const totalIdle = heatmap.flat().length - totalActive;

  const [activities, setActivities] = useState<AgentActivity[]>(seedActivities);
  const templateIdx = useRef(0);

  useEffect(() => {
    setActivities(agentActivitySeeds[agent.id] || []);
    templateIdx.current = 0;
  }, [agent.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const t = templates[templateIdx.current % templates.length];
      templateIdx.current++;
      const newActivity: AgentActivity = {
        ...t,
        id: randomHash(),
        time: "just now",
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 14)]);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [templates]);

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
        <button
          onClick={onBack}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <PxIcon icon="chevron-left" size={16} />
        </button>
        <span className="text-sm font-semibold text-foreground">Agent Details</span>
      </div>

      {/* Non-scrollable top sections */}
      <div className="shrink-0 overflow-y-auto max-h-[55%]">
        {/* Agent profile card */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card z-10 bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
              <p className="text-xs text-muted-foreground">{agent.role}</p>
              <span className={`text-[10px] px-1.5 py-0.5 mt-1 inline-block ${
                agent.status === "working"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}>
                {agent.status}
              </span>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {specialties.map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground border border-border">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="px-4 py-3 border-b border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Stats</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Commits", value: stats.totalCommits.toLocaleString() },
              { label: "Lines Written", value: stats.linesWritten },
              { label: "PRs Merged", value: `${stats.prsMerged}/${stats.prsOpened}` },
              { label: "Tasks Done", value: stats.tasksCompleted.toString() },
              { label: "Avg Response", value: stats.avgResponseTime },
              { label: "Uptime", value: stats.uptime },
              { label: "Streak", value: `${stats.currentStreak}d` },
              { label: "Active", value: `${totalActive} cells` },
            ].map((s) => (
              <div key={s.label} className="bg-muted px-2.5 py-2">
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
                <div className="text-sm font-semibold text-foreground">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity heatmap */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Activity</div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-muted-foreground">
                Active: <span className="text-emerald-400 font-semibold">{(totalActive * 137).toLocaleString()}</span>
              </span>
              <span className="text-muted-foreground">
                Idle: <span className="text-foreground">{(totalIdle * 89).toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Grid */}
          <div className="space-y-0.5">
            {heatmap.map((row, ri) => (
              <div key={ri} className="flex items-center gap-0.5">
                <span className="text-[9px] text-muted-foreground w-6 shrink-0">{dayLabels[ri]}</span>
                <div className="flex gap-[2px] flex-1">
                  {row.map((cell, ci) => {
                    const isHovered = hoveredCell?.row === ri && hoveredCell?.col === ci;
                    const activityLevel = cell === 0 ? "Idle" : cell === 1 ? "Low" : cell === 2 ? "Medium" : "High";
                    const commits = cell === 0 ? 0 : cell === 1 ? Math.floor(Math.random() * 3) + 1 : cell === 2 ? Math.floor(Math.random() * 5) + 4 : Math.floor(Math.random() * 8) + 8;
                    return (
                      <div
                        key={ci}
                        className="relative"
                        onMouseEnter={() => setHoveredCell({ row: ri, col: ci })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div
                          className={`w-[12px] h-[12px] ${heatColors[cell]} transition-all duration-150 cursor-pointer ${
                            isHovered ? "scale-[1.8] z-20 ring-1 ring-foreground/30" : "hover:scale-125"
                          }`}
                        />
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-background border border-border text-foreground text-[10px] whitespace-nowrap z-30 pointer-events-none animate-fade-in shadow-lg">
                            <div className="font-semibold">{dayLabels[ri]} {hourLabels[ci]}:00</div>
                            <div className="flex items-center gap-2 mt-0.5 text-muted-foreground">
                              <span>{activityLevel}</span>
                              <span>·</span>
                              <span>{commits} commits</span>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-border" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Hour labels */}
            <div className="flex items-center gap-0.5 mt-1">
              <span className="w-6 shrink-0" />
              <div className="flex gap-[2px] flex-1">
                {hourLabels.map((h, i) => (
                  <span key={i} className="w-[12px] text-[7px] text-muted-foreground/60 text-center">{i % 2 === 0 ? h : ""}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] text-muted-foreground">Less</span>
            {heatColors.map((c, i) => (
              <div key={i} className={`w-[10px] h-[10px] ${c}`} />
            ))}
            <span className="text-[9px] text-muted-foreground">More</span>
          </div>
        </div>
      </div>

      {/* Progress — independently scrollable */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider font-medium shrink-0 bg-card z-10 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Recent Progress <span className="text-foreground ml-1">{activities.length}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-1 space-y-0.5">
          {activities.map((a) => {
            const iconMap: Record<ActivityType, string> = {
              commit: "git-commit",
              task: "move",
              comment: "message",
              review: "check",
              deploy: "upload",
              design: "image",
            };
            const colorMap: Record<ActivityType, string> = {
              commit: "text-muted-foreground",
              task: "text-primary",
              comment: "text-sky-400",
              review: "text-success",
              deploy: "text-warning",
              design: "text-purple-400",
            };
            return (
              <div key={a.id} className="px-2 py-1.5 hover:bg-accent/50 transition-colors animate-slide-in-activity">
                <div className="flex items-start gap-2">
                  <PxIcon icon={iconMap[a.type]} size={12} className={`${colorMap[a.type]} mt-0.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed break-words whitespace-normal">{a.message}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground mt-0.5">
                      {a.hash && <span className="font-mono">{a.hash}</span>}
                      {a.hash && <span>·</span>}
                      {a.from && a.to && (
                        <>
                          <span className="text-muted-foreground">{a.from}</span>
                          <span>→</span>
                          <span className="text-foreground">{a.to}</span>
                          <span>·</span>
                        </>
                      )}
                      <span>{a.time}</span>
                    </div>
                    {a.type === "commit" && a.filesChanged != null && (
                      <div className="flex items-center gap-2 text-[10px] mt-1">
                        <span className="text-muted-foreground">{a.filesChanged} files</span>
                        <span className="text-emerald-400">+{a.additions}</span>
                        <span className="text-destructive">-{a.deletions}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
