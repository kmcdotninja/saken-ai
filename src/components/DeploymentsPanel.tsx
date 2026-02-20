import PxIcon from "./PxIcon";

interface Deployment {
  id: string;
  env: "production" | "preview" | "staging";
  status: "ready" | "building" | "failed" | "queued";
  branch: string;
  commit: string;
  commitMsg: string;
  time: string;
  duration: string;
  url: string;
}

const deployments: Deployment[] = [
  { id: "dpl_1", env: "production", status: "ready", branch: "main", commit: "b7e9f4a", commitMsg: "feat: add project cards", time: "2 min ago", duration: "32s", url: "app.nexusdev.io" },
  { id: "dpl_2", env: "preview", status: "building", branch: "feat/dashboard-redesign", commit: "c4d2e1b", commitMsg: "wip: redesign dashboard layout", time: "just now", duration: "—", url: "preview-feat-dashboard.nexusdev.io" },
  { id: "dpl_3", env: "preview", status: "ready", branch: "fix/auth-flow", commit: "a1b2c3d", commitMsg: "fix: token refresh logic", time: "1h ago", duration: "28s", url: "preview-fix-auth.nexusdev.io" },
  { id: "dpl_4", env: "production", status: "failed", branch: "main", commit: "e5f6a7b", commitMsg: "chore: update build config", time: "3h ago", duration: "45s", url: "" },
  { id: "dpl_5", env: "staging", status: "ready", branch: "main", commit: "d8c9b0a", commitMsg: "feat: implement dark mode", time: "5h ago", duration: "38s", url: "staging.nexusdev.io" },
];

const statusConfig: Record<string, { icon: string; text: string; cls: string }> = {
  ready: { icon: "check", text: "Ready", cls: "text-success bg-success/10" },
  building: { icon: "clock", text: "Building", cls: "text-warning bg-warning/10" },
  failed: { icon: "close", text: "Failed", cls: "text-destructive bg-destructive/10" },
  queued: { icon: "clock", text: "Queued", cls: "text-muted-foreground bg-muted" },
};

const envBadge: Record<string, string> = {
  production: "bg-success/10 text-success border-success/20",
  preview: "bg-foreground/10 text-foreground border-foreground/20",
  staging: "bg-warning/10 text-warning border-warning/20",
};

export default function DeploymentsPanel() {
  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PxIcon icon="cloud-upload" size={18} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Deployments</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <PxIcon icon="globe" size={14} />
            <span className="font-mono">app.nexusdev.io</span>
            <PxIcon icon="open" size={12} className="text-foreground cursor-pointer" />
          </div>
        </div>

        <div className="space-y-3">
          {deployments.map((d) => {
            const badge = statusConfig[d.status];
            return (
              <div key={d.id} className="bg-card border border-border p-4 hover:border-foreground/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1.5 px-2 py-1 text-xs ${badge.cls}`}>
                    <PxIcon icon={badge.icon} size={12} className={d.status === "building" ? "animate-spin" : ""} />
                    {badge.text}
                  </div>
                  <span className={`text-xs px-2 py-0.5 border ${envBadge[d.env]}`}>{d.env}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground">{d.commitMsg}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-mono">{d.commit}</span>
                      <span>on</span>
                      <span className="font-mono text-foreground/70">{d.branch}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{d.duration}</span>
                    <span>{d.time}</span>
                    {d.status === "failed" && (
                      <button className="text-foreground hover:text-foreground/80"><PxIcon icon="reload" size={14} /></button>
                    )}
                    {d.url && (
                      <button className="text-foreground hover:text-foreground/80"><PxIcon icon="open" size={14} /></button>
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
