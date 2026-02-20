import { useState } from "react";
import PxIcon from "./PxIcon";

const terminalLines = [
  { type: "cmd", text: "$ npm run build" },
  { type: "info", text: "vite v5.4.0 building for production..." },
  { type: "info", text: "✓ 142 modules transformed." },
  { type: "success", text: "✓ built in 1.23s" },
  { type: "cmd", text: "$ git push origin main" },
  { type: "info", text: "Enumerating objects: 12, done." },
  { type: "info", text: "Counting objects: 100% (12/12), done." },
  { type: "success", text: "To github.com:team/project.git" },
  { type: "success", text: "   a3f2d1c..b7e9f4a  main -> main" },
];

export default function TerminalPanel() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-card border-t border-border flex flex-col ${collapsed ? "h-8" : "h-44"} transition-all`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 px-3 h-8 min-h-[2rem] text-xs text-muted-foreground hover:text-foreground border-b border-border"
      >
        <PxIcon icon={collapsed ? "chevron-right" : "chevron-down"} size={12} />
        <PxIcon icon="terminal" size={12} />
        <span className="uppercase tracking-wider font-medium">Terminal</span>
        <span className="ml-auto text-xs text-muted-foreground">bash</span>
      </button>
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-5">
          {terminalLines.map((line, i) => (
            <div key={i} className={
              line.type === "cmd" ? "text-foreground font-medium" :
              line.type === "success" ? "text-success" :
              "text-muted-foreground"
            }>
              {line.text}
            </div>
          ))}
          <div className="flex items-center gap-1 mt-1 text-foreground">
            <span>$</span>
            <span className="w-2 h-4 bg-foreground/70 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
