import {
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoSaken from "@/assets/logo-saken.png";
import PxIcon from "./PxIcon";

const navItems = [
  { icon: "layout-sidebar-right", label: "Board", id: "board" },
  { icon: "code", label: "Editor", id: "editor" },
  { icon: "git-branch", label: "Git", id: "git" },
  { icon: "cloud-upload", label: "Deployments", id: "deployments" },
];

interface Props {
  active: string;
  onNavigate: (id: string) => void;
}

export default function Sidebar({ active, onNavigate }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-14 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center h-14 border-b border-border">
        <img src={logoSaken} alt="Saken" className="w-7 h-7 object-contain cursor-pointer" onClick={() => navigate("/")} />
      </div>

      {/* Home */}
      <div className="flex flex-col items-center pt-3 pb-1">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="All Projects"
        >
          <PxIcon icon="home" size={20} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-border" />

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              active === item.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            title={item.label}
          >
            <PxIcon icon={item.icon} size={20} />
          </button>
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
        <div className="w-8 h-8 bg-accent flex items-center justify-center mt-1">
          <span className="text-foreground text-xs font-medium">JD</span>
        </div>
      </div>
    </div>
  );
}
