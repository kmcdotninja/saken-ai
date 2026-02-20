import PxIcon from "./PxIcon";

interface Issue {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done" | "backlog";
  priority: "urgent" | "high" | "medium" | "low";
  assignee: string;
  labels: string[];
  created: string;
}

const issues: Issue[] = [
  { id: "ENG-142", title: "Implement real-time collaboration for code editor", status: "in_progress", priority: "high", assignee: "AI Agent", labels: ["feature", "editor"], created: "2h ago" },
  { id: "ENG-141", title: "Fix deployment pipeline timeout on large builds", status: "in_progress", priority: "urgent", assignee: "You", labels: ["bug", "deploy"], created: "3h ago" },
  { id: "ENG-140", title: "Add branch protection rules UI", status: "todo", priority: "medium", assignee: "AI Agent", labels: ["feature", "git"], created: "5h ago" },
  { id: "ENG-139", title: "Design system — dark mode color contrast audit", status: "todo", priority: "medium", assignee: "You", labels: ["design"], created: "1d ago" },
  { id: "ENG-138", title: "Optimize WebSocket reconnection logic", status: "done", priority: "high", assignee: "AI Agent", labels: ["perf"], created: "1d ago" },
  { id: "ENG-137", title: "Add keyboard shortcuts for common actions", status: "todo", priority: "low", assignee: "You", labels: ["ux"], created: "2d ago" },
  { id: "ENG-136", title: "Implement file search with fuzzy matching", status: "done", priority: "high", assignee: "AI Agent", labels: ["feature", "editor"], created: "2d ago" },
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

export default function IssuesPanel() {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Issues</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5">{issues.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted border border-border">
            <PxIcon icon="sliders" size={12} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
            <PxIcon icon="plus" size={12} /> New Issue
          </button>
        </div>
      </div>

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
        {issues.map((issue) => (
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
            <span className="w-24 text-xs text-muted-foreground">{issue.assignee}</span>
            <span className="w-20 text-xs text-muted-foreground">{issue.created}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
