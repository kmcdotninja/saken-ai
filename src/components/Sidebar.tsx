import { useNavigate, useParams } from "react-router-dom";
import logoSaken from "@/assets/logo-saken.png";
import PxIcon from "./PxIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: "layout-sidebar-right", label: "Board", id: "board" },
  { icon: "message", label: "Team Chat", id: "chat" },
  { icon: "code", label: "Editor", id: "editor" },
  { icon: "git-branch", label: "Git", id: "git" },
  { icon: "cloud-upload", label: "Deployments", id: "deployments" },
];

interface OpenProject {
  id: string;
  name: string;
  initial: string;
}

const allProjects: OpenProject[] = [
  { id: "nexus-platform", name: "Nexus Platform", initial: "N" },
  { id: "aurora-analytics", name: "Aurora Analytics", initial: "A" },
  { id: "phantom-api", name: "Phantom API Gateway", initial: "P" },
  { id: "forge-design", name: "Forge Design System", initial: "F" },
  { id: "sentinel-monitor", name: "Sentinel Monitor", initial: "S" },
];

interface Props {
  active: string;
  onNavigate: (id: string) => void;
  openProjects?: string[];
  onOpenProjectsChange?: (projects: string[]) => void;
  onProfileClick?: () => void;
}

export default function Sidebar({ active, onNavigate, openProjects = [], onOpenProjectsChange, onProfileClick }: Props) {
  const navigate = useNavigate();
  const { id: currentProjectId } = useParams();

  // Derive open project objects
  const openProjectObjects = allProjects.filter((p) => openProjects.includes(p.id));

  const handleCloseProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (projectId === currentProjectId && openProjects.length > 1) {
      const remaining = openProjects.filter((id) => id !== projectId);
      navigate(`/project/${remaining[0]}`);
    }
    onOpenProjectsChange?.(openProjects.filter((id) => id !== projectId));
  };

  return (
    <div className="flex flex-col h-full w-14 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center h-14 border-b border-border">
        <img src={logoSaken} alt="Saken" className="w-7 h-7 object-contain cursor-pointer" onClick={() => navigate("/")} />
      </div>

      {/* Home */}
      <div className="flex flex-col items-center pt-3 pb-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <PxIcon icon="home" size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">All Projects</TooltipContent>
        </Tooltip>
      </div>

      {/* Open project tabs */}
      {openProjectObjects.length > 0 && (
        <>
          <div className="mx-3 border-t border-border" />
          <div className="flex flex-col items-center gap-1 py-2">
            {openProjectObjects.map((p) => (
              <Tooltip key={p.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(`/project/${p.id}`)}
                    className={`relative w-10 h-10 flex items-center justify-center text-xs font-bold font-mono transition-colors group ${
                      p.id === currentProjectId
                        ? "bg-accent text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {p.initial}
                    {openProjects.length > 1 && (
                      <span
                        onClick={(e) => handleCloseProject(e, p.id)}
                        className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-muted border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <PxIcon icon="close" size={8} />
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{p.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </>
      )}

      {/* Divider */}
      <div className="mx-3 border-t border-border" />

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 py-3">
        {navItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-10 h-10 flex items-center justify-center transition-colors ${
                  active === item.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <PxIcon icon={item.icon} size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1 py-3 border-t border-border">
        <button
          onClick={() => onNavigate("settings")}
          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Settings"
        >
          <PxIcon icon="sliders" size={20} />
        </button>
        <button
          onClick={onProfileClick}
          className="w-8 h-8 bg-accent flex items-center justify-center mt-1 hover:bg-foreground/20 transition-colors cursor-pointer"
        >
          <span className="text-foreground text-xs font-medium">JD</span>
        </button>
      </div>
    </div>
  );
}
