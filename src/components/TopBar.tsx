import {
  Search, Bell, GitBranch, Play, ChevronDown,
  Command, Zap
} from "lucide-react";
import logoSaken from "@/assets/logo-saken.png";

interface Props {
  currentBranch: string;
  activeView: string;
}

export default function TopBar({ currentBranch, activeView }: Props) {
  return (
    <div className="flex items-center justify-between h-12 px-4 bg-card border-b border-border">
      {/* Left: project + branch */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">nexus-platform</span>
        </div>
        <span className="text-border">/</span>
        <button className="flex items-center gap-1.5 px-2 py-1 text-xs bg-muted border border-border text-muted-foreground hover:text-foreground">
          <GitBranch size={12} />
          <span className="font-mono">{currentBranch}</span>
          <ChevronDown size={10} />
        </button>
      </div>

      {/* Center: search */}
      <button className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground w-80">
        <Search size={14} />
        <span className="text-xs flex-1 text-left">Search files, issues, commands...</span>
        <kbd className="text-[10px] bg-accent px-1.5 py-0.5 text-muted-foreground">
          <Command size={10} className="inline mr-0.5" />K
        </kbd>
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-success/10 text-success hover:bg-success/20">
          <Play size={12} /> Deploy
        </button>
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-foreground rounded-full" />
        </button>
      </div>
    </div>
  );
}
