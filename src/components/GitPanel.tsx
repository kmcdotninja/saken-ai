import {
  GitBranch, GitCommit, GitPullRequest, ArrowUp, ArrowDown,
  Check, Clock, AlertCircle
} from "lucide-react";

const branches = [
  { name: "main", current: false },
  { name: "feat/dashboard-redesign", current: true },
  { name: "fix/auth-flow", current: false },
];

const commits = [
  { hash: "b7e9f4a", message: "feat: add project cards with deployment status", author: "You", time: "2m ago", status: "pushed" },
  { hash: "a3f2d1c", message: "fix: resolve type error in useProjects hook", author: "AI Agent", time: "5m ago", status: "pushed" },
  { hash: "8d2c1b0", message: "chore: update dependencies", author: "You", time: "1h ago", status: "pushed" },
  { hash: "f4a9e2d", message: "feat: implement dark mode design system", author: "AI Agent", time: "2h ago", status: "pushed" },
  { hash: "c1b8d3e", message: "initial commit", author: "You", time: "3h ago", status: "pushed" },
];

const changes = [
  { file: "src/components/Dashboard.tsx", status: "modified" },
  { file: "src/lib/api.ts", status: "modified" },
  { file: "src/components/ErrorBoundary.tsx", status: "added" },
];

export default function GitPanel() {
  return (
    <div className="flex-1 overflow-y-auto bg-surface-0 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Branch selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Source Control</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-surface-2 rounded-md text-muted-foreground hover:text-foreground border border-border">
              <ArrowDown size={12} /> Pull
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              <ArrowUp size={12} /> Push
            </button>
          </div>
        </div>

        {/* Active branch */}
        <div className="bg-surface-1 rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Branches</div>
          <div className="space-y-1">
            {branches.map((b) => (
              <div key={b.name} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                b.current ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:bg-surface-2 cursor-pointer"
              }`}>
                <GitBranch size={14} className={b.current ? "text-primary" : ""} />
                <span className="font-mono text-xs">{b.name}</span>
                {b.current && <span className="ml-auto text-xs text-primary">current</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Staged changes */}
        <div className="bg-surface-1 rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Changes <span className="text-foreground ml-1">{changes.length}</span>
          </div>
          <div className="space-y-1">
            {changes.map((c) => (
              <div key={c.file} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-surface-2">
                <span className={`w-1.5 h-1.5 rounded-full ${c.status === "added" ? "bg-success" : "bg-warning"}`} />
                <span className="font-mono text-xs flex-1">{c.file}</span>
                <span className="text-xs">{c.status === "added" ? "A" : "M"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent commits */}
        <div className="bg-surface-1 rounded-lg border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Recent Commits</div>
          <div className="space-y-0">
            {commits.map((c, i) => (
              <div key={c.hash} className="flex items-start gap-3 px-3 py-2.5 hover:bg-surface-2 rounded-md">
                <GitCommit size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{c.message}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-mono">{c.hash}</span>
                    <span>·</span>
                    <span>{c.author}</span>
                    <span>·</span>
                    <span>{c.time}</span>
                  </div>
                </div>
                <Check size={14} className="text-success shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
