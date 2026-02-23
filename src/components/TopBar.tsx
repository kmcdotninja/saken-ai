import { useState, useRef, useEffect } from "react";
import PxIcon from "./PxIcon";
import { projectViewData } from "@/data/project-data";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

type DeployState = "idle" | "deploying" | "deployed";

function DeployButton() {
  const [state, setState] = useState<DeployState>("idle");

  const handleClick = () => {
    if (state === "idle") {
      setState("deploying");
      setTimeout(() => {
        setState("deployed");
        toast.success("Deployed successfully", {
          description: "All services are live across regions",
          icon: "🚀",
        });
      }, 3000);
    } else if (state === "deployed") {
      setState("idle");
      toast("Undeployed", {
        description: "Services taken offline",
        icon: "⏹️",
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "deploying"}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-all duration-300 ${
        state === "idle"
          ? "bg-success/10 text-success hover:bg-success/20"
          : state === "deploying"
          ? "bg-warning/10 text-warning cursor-wait"
          : "bg-success text-background hover:bg-success/90"
      }`}
    >
      {state === "idle" && (
        <>
          <PxIcon icon="cloud-upload" size={12} /> Deploy
        </>
      )}
      {state === "deploying" && (
        <>
          <PxIcon icon="loader" size={12} className="animate-spin" /> Deploying...
        </>
      )}
      {state === "deployed" && (
        <>
          <PxIcon icon="close" size={12} /> Undeploy
        </>
      )}
    </button>
  );
}

export type BellSeverity = "success" | "error" | "warning";

interface Props {
  currentBranch: string;
  activeView: string;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  bellSeverity?: BellSeverity;
  projectId?: string;
  onBranchChange?: (branch: string) => void;
}

export default function TopBar({ currentBranch, activeView, onSearchClick, onNotificationClick, bellSeverity = "success", projectId, onBranchChange }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const viewData = projectId ? (projectViewData[projectId] || projectViewData["nexus-platform"]) : null;
  const branches = viewData?.git.branches.map((b) => b.name) || ["main", "develop", "feat/new-feature"];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBranchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBranchSelect = (branch: string) => {
    setBranchDropdownOpen(false);
    onBranchChange?.(branch);
  };

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-card border-b border-border">
      {/* Left: project + branch */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground">{projectId || "nexus-platform"}</span>
        <span className="text-border">/</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <PxIcon icon="git-branch" size={12} />
            <span className="font-mono">{currentBranch}</span>
            <PxIcon icon="chevron-down" size={10} className={`transition-transform ${branchDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {branchDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border shadow-lg z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Switch branch</span>
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => handleBranchSelect(branch)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors ${
                      branch === currentBranch
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <PxIcon icon="git-branch" size={12} />
                    <span className="font-mono text-xs">{branch}</span>
                    {branch === currentBranch && (
                      <PxIcon icon="check" size={12} className="ml-auto text-success" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: search */}
      <button onClick={onSearchClick} className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground w-80">
        <PxIcon icon="search" size={14} />
        <span className="text-xs flex-1 text-left">Search files, issues, commands...</span>
        <kbd className="text-[10px] bg-accent px-1.5 py-0.5 text-muted-foreground">⌘K</kbd>
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <PxIcon icon={theme === "dark" ? "sun" : "moon"} size={16} />
        </button>
        <DeployButton />
        <button
          onClick={onNotificationClick}
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
          title="Notifications"
        >
          <PxIcon icon="notification" size={16} />
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-success"
            style={{ zIndex: 10 }}
          />
        </button>
      </div>
    </div>
  );
}
