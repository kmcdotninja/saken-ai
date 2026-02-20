import { useState } from "react";
import { agents, type KanbanCard } from "@/data/kanban-data";
import NewIssueModal from "./NewIssueModal";
import PxIcon from "./PxIcon";
import { toast } from "sonner";

interface Issue {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done" | "backlog";
  priority: "urgent" | "high" | "medium" | "low";
  assignee: string;
  labels: string[];
  created: string;
}

const defaultIssues: Issue[] = [
  { id: "ENG-142", title: "Implement real-time collaboration for code editor", status: "in_progress", priority: "high", assignee: "vlad", labels: ["feature", "editor"], created: "2h ago" },
  { id: "ENG-141", title: "Fix deployment pipeline timeout on large builds", status: "in_progress", priority: "urgent", assignee: "bjorn", labels: ["bug", "deploy"], created: "3h ago" },
  { id: "ENG-140", title: "Add branch protection rules UI", status: "todo", priority: "medium", assignee: "ivar", labels: ["feature", "git"], created: "5h ago" },
  { id: "ENG-139", title: "Design system — dark mode color contrast audit", status: "todo", priority: "medium", assignee: "agnes", labels: ["design"], created: "1d ago" },
  { id: "ENG-138", title: "Optimize WebSocket reconnection logic", status: "done", priority: "high", assignee: "vlad", labels: ["perf"], created: "1d ago" },
  { id: "ENG-137", title: "Add keyboard shortcuts for common actions", status: "todo", priority: "low", assignee: "agnes", labels: ["ux"], created: "2d ago" },
  { id: "ENG-136", title: "Implement file search with fuzzy matching", status: "done", priority: "high", assignee: "vlad", labels: ["feature", "editor"], created: "2d ago" },
];

const statusIconMap: Record<string, string> = {
  backlog: "circle",
  todo: "circle",
  in_progress: "clock",
  done: "check",
};

const statusColorMap: Record<string, string> = {
  backlog: "text-muted-foreground",
  todo: "text-muted-foreground",
  in_progress: "text-warning",
  done: "text-success",
};

const priorityColor: Record<string, string> = {
  urgent: "text-destructive",
  high: "text-warning",
  medium: "text-foreground",
  low: "text-muted-foreground",
};

const priorityIcon: Record<string, string> = {
  urgent: "▲",
  high: "▲",
  medium: "◆",
  low: "▽",
};

const statusFromColumn: Record<string, Issue["status"]> = {
  backlog: "backlog",
  todo: "todo",
  in_progress: "in_progress",
  review: "in_progress",
  done: "done",
};

export default function IssuesPanel() {
  const [issues, setIssues] = useState<Issue[]>(defaultIssues);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleNewIssue = (card: KanbanCard, columnId: string) => {
    const newIssue: Issue = {
      id: card.id,
      title: card.title,
      status: statusFromColumn[columnId] || "todo",
      priority: card.priority,
      assignee: card.assignee,
      labels: card.labels,
      created: "just now",
    };
    setIssues((prev) => [newIssue, ...prev]);
    toast.success("Issue created", {
      description: `${card.id} — ${card.title}`,
    });
  };

  const filtered = issues.filter((i) => {
    if (filterPriority && i.priority !== filterPriority) return false;
    if (filterStatus && i.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Issues</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border ${
              showFilters || filterPriority || filterStatus
                ? "text-foreground bg-accent border-foreground/20"
                : "text-muted-foreground hover:text-foreground bg-muted border-border"
            }`}
          >
            <PxIcon icon="sliders" size={12} /> Filter
            {(filterPriority || filterStatus) && (
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            )}
          </button>
          <button
            onClick={() => setShowNewIssue(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90"
          >
            <PxIcon icon="plus" size={12} /> New Issue
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="flex items-center gap-3 px-6 py-2 border-b border-border bg-muted/30">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Priority:</span>
          <div className="flex gap-1">
            {["urgent", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(filterPriority === p ? null : p)}
                className={`px-2 py-0.5 text-[11px] border ${
                  filterPriority === p
                    ? "border-foreground/20 bg-accent text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="text-border">|</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Status:</span>
          <div className="flex gap-1">
            {["todo", "in_progress", "done"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                className={`px-2 py-0.5 text-[11px] border ${
                  filterStatus === s
                    ? "border-foreground/20 bg-accent text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
          {(filterPriority || filterStatus) && (
            <button
              onClick={() => { setFilterPriority(null); setFilterStatus(null); }}
              className="text-[11px] text-muted-foreground hover:text-foreground ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table header */}
      <div className="flex items-center gap-4 px-6 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border bg-card/50">
        <span className="w-6" />
        <span className="w-20">ID</span>
        <span className="flex-1">Title</span>
        <span className="w-16">Priority</span>
        <span className="w-24">Assignee</span>
        <span className="w-20">Created</span>
      </div>

      {/* Issues list */}
      <div>
        {filtered.map((issue) => {
          const agent = agents.find((a) => a.id === issue.assignee);
          return (
            <div
              key={issue.id}
              className="flex items-center gap-4 px-6 py-3 border-b border-border/50 hover:bg-card/50 cursor-pointer transition-colors"
            >
              <span className="w-6">
                <PxIcon icon={statusIconMap[issue.status]} size={14} className={statusColorMap[issue.status]} />
              </span>
              <span className="w-20 text-xs font-mono text-muted-foreground">{issue.id}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-foreground truncate block">{issue.title}</span>
                <div className="flex gap-1.5 mt-1">
                  {issue.labels.map((l) => (
                    <span key={l} className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground">{l}</span>
                  ))}
                </div>
              </div>
              <span className={`w-16 text-xs ${priorityColor[issue.priority]}`}>
                {priorityIcon[issue.priority]} {issue.priority}
              </span>
              <span className="w-24 text-xs text-muted-foreground flex items-center gap-1.5">
                {agent && (
                  <img src={agent.avatar} alt={agent.name} className="w-4 h-4 rounded-full object-cover" />
                )}
                {agent?.name || issue.assignee}
              </span>
              <span className="w-20 text-xs text-muted-foreground">{issue.created}</span>
            </div>
          );
        })}
      </div>

      {showNewIssue && (
        <NewIssueModal
          onClose={() => setShowNewIssue(false)}
          onSubmit={handleNewIssue}
          projectPrefix="ENG"
        />
      )}
    </div>
  );
}
