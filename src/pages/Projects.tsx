import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSaken from "@/assets/logo-saken.png";
import ProfileSettingsPanel from "@/components/ProfileSettingsPanel";
import PxIcon from "@/components/PxIcon";

const statusConfig: Record<string, { icon: string; cls: string; bg: string; label: string }> = {
  active: { icon: "check", cls: "text-success", bg: "bg-success/10", label: "Active" },
  paused: { icon: "clock", cls: "text-warning", bg: "bg-warning/10", label: "Paused" },
  archived: { icon: "archive", cls: "text-muted-foreground", bg: "bg-muted", label: "Archived" },
  inactive: { icon: "circle", cls: "text-muted-foreground", bg: "bg-muted", label: "Inactive" },
};

interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  agents: number;
  branches: number;
  deploys: number;
  status: "active" | "paused" | "archived";
}

const projects: Project[] = [
  {
    id: "nexus-platform",
    name: "Nexus Platform",
    description: "AI-powered development platform with real-time collaboration, CI/CD, and project management.",
    lastUpdated: "2 minutes ago",
    agents: 3,
    branches: 12,
    deploys: 47,
    status: "active",
  },
  {
    id: "aurora-analytics",
    name: "Aurora Analytics",
    description: "Real-time analytics dashboard with custom metrics, alerting, and team insights.",
    lastUpdated: "1 hour ago",
    agents: 2,
    branches: 8,
    deploys: 23,
    status: "active",
  },
  {
    id: "phantom-api",
    name: "Phantom API Gateway",
    description: "High-performance API gateway with rate limiting, caching, and request transformation.",
    lastUpdated: "3 hours ago",
    agents: 1,
    branches: 5,
    deploys: 89,
    status: "active",
  },
  {
    id: "forge-design",
    name: "Forge Design System",
    description: "Component library and design tokens for consistent UI across all products.",
    lastUpdated: "1 day ago",
    agents: 0,
    branches: 3,
    deploys: 15,
    status: "paused",
  },
  {
    id: "sentinel-monitor",
    name: "Sentinel Monitor",
    description: "Infrastructure monitoring with anomaly detection and automated incident response.",
    lastUpdated: "2 days ago",
    agents: 0,
    branches: 6,
    deploys: 31,
    status: "archived",
  },
];

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border p-5 hover:border-foreground/20 hover:bg-accent/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent border border-border flex items-center justify-center">
            <span className="text-foreground font-mono text-xs font-bold">
              {project.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
            {(() => {
              const s = statusConfig[project.status] || statusConfig.inactive;
              return (
                <span className={`inline-flex items-center gap-1 text-[10px] leading-none px-1 py-[3px] ${s.bg} ${s.cls}`}>
                  <PxIcon icon={s.icon} size={10} />
                  {s.label}
                </span>
              );
            })()}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity">
          <PxIcon icon="more-horizontal" size={14} />
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <PxIcon icon="git-branch" size={11} />
            {project.branches}
          </span>
          <span className="flex items-center gap-1">
            <PxIcon icon="cloud-upload" size={11} />
            {project.deploys}
          </span>
          {project.agents > 0 && (
            <span className="flex items-center gap-1 text-success">
              <PxIcon icon="cpu" size={11} />
              {project.agents} agents
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <PxIcon icon="clock" size={10} />
          {project.lastUpdated}
        </span>
      </div>
    </div>
  );
}

function ProjectRow({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-3 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer group"
    >
      <div className="w-7 h-7 bg-accent border border-border flex items-center justify-center shrink-0">
        <span className="text-foreground font-mono text-xs font-bold">
          {project.name.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{project.name}</span>
          {(() => {
            const s = statusConfig[project.status] || statusConfig.inactive;
            return (
              <span className={`inline-flex items-center gap-1 text-[10px] leading-none px-1 py-[3px] ${s.bg} ${s.cls}`}>
                <PxIcon icon={s.icon} size={10} />
                {s.label}
              </span>
            );
          })()}
        </div>
        <p className="text-xs text-muted-foreground truncate">{project.description}</p>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground shrink-0">
        {project.agents > 0 && (
          <span className="flex items-center gap-1 text-success">
            <PxIcon icon="cpu" size={11} />
            {project.agents}
          </span>
        )}
        <span className="flex items-center gap-1">
          <PxIcon icon="git-branch" size={11} />
          {project.branches}
        </span>
        <span className="flex items-center gap-1">
          <PxIcon icon="cloud-upload" size={11} />
          {project.deploys}
        </span>
        <span className="flex items-center gap-1 w-24 text-right justify-end">
          <PxIcon icon="clock" size={10} />
          {project.lastUpdated}
        </span>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity">
        <PxIcon icon="more-horizontal" size={14} />
      </button>
    </div>
  );
}

export default function Projects() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - minimal */}
      <div className="flex flex-col h-full w-14 bg-card border-r border-border">
        <div className="flex items-center justify-center h-14 border-b border-border">
          <img src={logoSaken} alt="Saken" className="w-7 h-7 object-contain" />
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-1 py-3 border-t border-border">
          <button
            onClick={() => setProfileOpen(true)}
            className="w-8 h-8 bg-accent flex items-center justify-center hover:bg-foreground/20 transition-colors cursor-pointer"
          >
            <span className="text-foreground text-xs font-medium">JD</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between h-12 px-6 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <PxIcon icon="zap" size={16} className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">Projects</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5">{projects.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0 bg-muted border border-border">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <PxIcon icon="layout-columns" size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <PxIcon icon="list" size={14} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
              <PxIcon icon="plus" size={12} /> New Project
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted border border-border text-muted-foreground w-80">
            <PxIcon icon="search" size={14} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none flex-1"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />
              ))}
            </div>
          ) : (
            <div className="border border-border bg-card">
              {filtered.map((p) => (
                <ProjectRow key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>
      {profileOpen && <ProfileSettingsPanel onClose={() => setProfileOpen(false)} />}
    </div>
  );
}
