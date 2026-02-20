import { useMemo } from "react";
import PxIcon from "./PxIcon";
import type { Agent } from "@/data/kanban-data";

// ─── Simulated per-agent data ──────────────────────────────────

interface AgentCommit {
  hash: string;
  message: string;
  time: string;
  filesChanged: number;
  additions: number;
  deletions: number;
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

const agentCommits: Record<string, AgentCommit[]> = {
  vlad: [
    { hash: "a3f1c9e", message: "feat: implement WebSocket collaboration layer", time: "12m ago", filesChanged: 8, additions: 342, deletions: 47 },
    { hash: "b7d2e4a", message: "refactor: extract auth middleware to shared module", time: "1h ago", filesChanged: 5, additions: 128, deletions: 89 },
    { hash: "c9e8f3b", message: "fix: resolve race condition in real-time sync", time: "3h ago", filesChanged: 3, additions: 67, deletions: 22 },
    { hash: "d1a4b6c", message: "perf: optimize query batching for dashboard", time: "5h ago", filesChanged: 4, additions: 201, deletions: 156 },
    { hash: "e5c7d8f", message: "test: add integration tests for collab engine", time: "8h ago", filesChanged: 6, additions: 445, deletions: 12 },
    { hash: "f2b9a1d", message: "feat: add cursor presence indicators", time: "12h ago", filesChanged: 7, additions: 289, deletions: 34 },
  ],
  ivar: [
    { hash: "i1a2b3c", message: "docs: update sprint planning template with velocity", time: "25m ago", filesChanged: 3, additions: 89, deletions: 15 },
    { hash: "i4d5e6f", message: "feat: add burn-down chart to sprint dashboard", time: "2h ago", filesChanged: 4, additions: 156, deletions: 23 },
    { hash: "i7g8h9i", message: "refactor: restructure backlog priority algorithm", time: "4h ago", filesChanged: 2, additions: 78, deletions: 45 },
    { hash: "ij1k2l3", message: "feat: implement story point estimation helper", time: "7h ago", filesChanged: 5, additions: 234, deletions: 67 },
    { hash: "im4n5o6", message: "fix: correct velocity calculation for partial sprints", time: "11h ago", filesChanged: 2, additions: 34, deletions: 18 },
  ],
  bjorn: [
    { hash: "b1x2y3z", message: "ops: configure auto-scaling for EU-West cluster", time: "8m ago", filesChanged: 4, additions: 112, deletions: 28 },
    { hash: "b4w5v6u", message: "feat: add zero-downtime deployment pipeline", time: "1h ago", filesChanged: 6, additions: 267, deletions: 89 },
    { hash: "b7t8s9r", message: "fix: resolve SSL certificate rotation issue", time: "3h ago", filesChanged: 2, additions: 45, deletions: 12 },
    { hash: "bq1p2o3", message: "perf: optimize Docker layer caching strategy", time: "6h ago", filesChanged: 3, additions: 78, deletions: 56 },
    { hash: "bn4m5l6", message: "ops: implement health check cascade for microservices", time: "9h ago", filesChanged: 8, additions: 345, deletions: 123 },
    { hash: "bk7j8i9", message: "feat: add rollback automation on failure detection", time: "14h ago", filesChanged: 5, additions: 198, deletions: 67 },
  ],
  agnes: [
    { hash: "ag1b2c3", message: "design: finalize dark mode token system", time: "18m ago", filesChanged: 12, additions: 456, deletions: 234 },
    { hash: "ag4d5e6", message: "feat: create motion spec for page transitions", time: "2h ago", filesChanged: 4, additions: 189, deletions: 45 },
    { hash: "ag7f8g9", message: "refactor: update component library to new grid system", time: "4h ago", filesChanged: 9, additions: 312, deletions: 178 },
    { hash: "agh1i2j", message: "design: export icon set v2 with pixel-perfect variants", time: "7h ago", filesChanged: 24, additions: 567, deletions: 89 },
    { hash: "agk3l4m", message: "fix: resolve spacing inconsistencies in onboarding flow", time: "10h ago", filesChanged: 6, additions: 78, deletions: 56 },
  ],
};

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
  const commits = agentCommits[agent.id] || [];
  const stats = agentStats[agent.id] || agentStats.vlad;
  const specialties = agentSpecialties[agent.id] || [];
  const heatmap = useMemo(() => generateHeatmap(agent.id), [agent.id]);

  const totalActive = useMemo(() => {
    return heatmap.flat().filter((v) => v > 0).length;
  }, [heatmap]);
  const totalIdle = heatmap.flat().length - totalActive;

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

      <div className="flex-1 overflow-y-auto">
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
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      className={`w-[12px] h-[12px] ${heatColors[cell]} transition-colors`}
                      title={`${dayLabels[ri]} ${hourLabels[ci]}:00 — ${cell === 0 ? "Idle" : cell === 1 ? "Low" : cell === 2 ? "Medium" : "High"}`}
                    />
                  ))}
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

        {/* Commits */}
        <div className="px-4 py-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Recent Commits <span className="text-foreground ml-1">{commits.length}</span>
          </div>
          <div className="space-y-0.5">
            {commits.map((c) => (
              <div key={c.hash} className="px-2 py-2 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-2">
                  <PxIcon icon="git-commit" size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate leading-relaxed">{c.message}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span className="font-mono">{c.hash}</span>
                      <span>·</span>
                      <span>{c.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] mt-1">
                      <span className="text-muted-foreground">{c.filesChanged} files</span>
                      <span className="text-emerald-400">+{c.additions}</span>
                      <span className="text-destructive">-{c.deletions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
