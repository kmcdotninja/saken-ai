import { useState } from "react";
import {
  Code2, GitBranch, LayoutDashboard, Rocket, Settings,
  Search, Bell, ChevronDown, Plus, MoreHorizontal
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Board", id: "board" },
  { icon: Code2, label: "Editor", id: "editor" },
  { icon: GitBranch, label: "Git", id: "git" },
  { icon: Rocket, label: "Deployments", id: "deployments" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", id: "settings" },
];

interface Props {
  active: string;
  onNavigate: (id: string) => void;
}

export default function Sidebar({ active, onNavigate }: Props) {
  return (
    <div className="flex flex-col h-full w-14 bg-surface-1 border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center h-14 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">N</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              active === item.id
                ? "bg-surface-3 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
            }`}
            title={item.label}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1 py-3 border-t border-border">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
            title={item.label}
          >
            <item.icon size={20} />
          </button>
        ))}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-1">
          <span className="text-primary text-xs font-medium">JD</span>
        </div>
      </div>
    </div>
  );
}
