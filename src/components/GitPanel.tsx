import PxIcon from "./PxIcon";
import { projectViewData } from "@/data/project-data";

interface Props {
  projectId: string;
}

export default function GitPanel({ projectId }: Props) {
  const data = projectViewData[projectId] || projectViewData["nexus-platform"];
  const { branches, commits, changes } = data.git;

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Branch selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PxIcon icon="git-branch" size={18} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Source Control</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted text-muted-foreground hover:text-foreground border border-border">
              <PxIcon icon="arrow-down" size={12} /> Pull
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
              <PxIcon icon="arrow-up" size={12} /> Push
            </button>
          </div>
        </div>

        {/* Active branch */}
        <div className="bg-card border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Branches</div>
          <div className="space-y-1">
            {branches.map((b) => (
              <div key={b.name} className={`flex items-center gap-2 px-3 py-2 text-sm ${
                b.current ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent cursor-pointer"
              }`}>
                <PxIcon icon="git-branch" size={14} className={b.current ? "text-foreground" : ""} />
                <span className="font-mono text-xs">{b.name}</span>
                {b.current && <span className="ml-auto text-xs text-foreground">current</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Staged changes */}
        <div className="bg-card border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Changes <span className="text-foreground ml-1">{changes.length}</span>
          </div>
          <div className="space-y-1">
            {changes.map((c) => (
              <div key={c.file} className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent">
                <span className={`w-1.5 h-1.5 rounded-full ${c.status === "added" ? "bg-success" : c.status === "deleted" ? "bg-destructive" : "bg-warning"}`} />
                <span className="font-mono text-xs flex-1">{c.file}</span>
                <span className="text-xs">{c.status === "added" ? "A" : c.status === "deleted" ? "D" : "M"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent commits */}
        <div className="bg-card border border-border p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Recent Commits</div>
          <div className="space-y-0">
            {commits.map((c) => (
              <div key={c.hash} className="flex items-start gap-3 px-3 py-2.5 hover:bg-accent">
                <PxIcon icon="git-commit" size={14} className="text-muted-foreground mt-0.5 shrink-0" />
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
                <PxIcon icon="check" size={14} className="text-success shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
