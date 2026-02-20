import PxIcon from "./PxIcon";
import { projectViewData } from "@/data/project-data";

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

interface Props {
  projectId: string;
}

export default function DeploymentsPanel({ projectId }: Props) {
  const data = projectViewData[projectId] || projectViewData["nexus-platform"];
  const deployments = data.deployments;
  const domainLabel = data.domainLabel;

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
            <span className="font-mono">{domainLabel}</span>
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
