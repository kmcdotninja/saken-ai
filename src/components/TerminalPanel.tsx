import { useState, useRef, useCallback, useEffect } from "react";
import PxIcon from "./PxIcon";

interface TermLine {
  type: "cmd" | "info" | "success" | "error";
  text: string;
}

const initialLines: TermLine[] = [
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

const fakeResponses: Record<string, TermLine[]> = {
  "npm run dev": [
    { type: "info", text: "vite v5.4.0 dev server running at:" },
    { type: "success", text: "  ➜  Local:   http://localhost:5173/" },
    { type: "info", text: "  ➜  Network: http://192.168.1.42:5173/" },
    { type: "success", text: "  ready in 320ms." },
  ],
  "npm test": [
    { type: "info", text: "Running test suite..." },
    { type: "success", text: " PASS  src/lib/utils.test.ts (4 tests)" },
    { type: "success", text: " PASS  src/components/Dashboard.test.tsx (7 tests)" },
    { type: "success", text: "Tests: 11 passed, 11 total" },
    { type: "success", text: "Time:  1.42s" },
  ],
  "npm run lint": [
    { type: "info", text: "Running ESLint..." },
    { type: "info", text: "Checking 24 files..." },
    { type: "success", text: "✓ No issues found" },
  ],
  ls: [
    { type: "info", text: "README.md     node_modules/  public/   tsconfig.json" },
    { type: "info", text: "package.json  postcss.config  src/      vite.config.ts" },
  ],
  pwd: [
    { type: "info", text: "/home/dev/nexus-platform" },
  ],
  clear: [],
  help: [
    { type: "info", text: "Available commands: npm run dev, npm test, npm run lint," },
    { type: "info", text: "npm run build, ls, pwd, clear, git status, git log, help" },
  ],
  "git status": [
    { type: "info", text: "On branch feat/dashboard-redesign" },
    { type: "info", text: "Changes not staged for commit:" },
    { type: "info", text: "  modified:   src/components/Dashboard.tsx" },
    { type: "info", text: "  modified:   src/lib/api.ts" },
  ],
  "git log": [
    { type: "info", text: "b7e9f4a (HEAD -> feat/dashboard-redesign) Optimize data fetching" },
    { type: "info", text: "a3f2d1c Add error boundaries to Dashboard" },
    { type: "info", text: "f1c8e3b Implement skeleton loading states" },
    { type: "info", text: "d4a7b2e Initial dashboard component" },
  ],
};

const MIN_HEIGHT = 32;
const DEFAULT_HEIGHT = 176;
const MAX_HEIGHT = 500;

export default function TerminalPanel() {
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [collapsed, setCollapsed] = useState(false);
  const [lines, setLines] = useState<TermLine[]>(initialLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, []);

  useEffect(() => scrollToBottom(), [lines, scrollToBottom]);

  const handleSubmit = () => {
    const cmd = input.trim();
    if (!cmd) return;

    const newHistory = [...history, cmd];
    setHistory(newHistory);
    setHistoryIdx(-1);

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    const cmdLine: TermLine = { type: "cmd", text: `$ ${cmd}` };
    const response = fakeResponses[cmd] ?? [
      { type: "error" as const, text: `bash: ${cmd}: command not found` },
    ];

    setLines((prev) => [...prev, cmdLine, ...response]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx >= 0) {
        const idx = historyIdx + 1;
        if (idx >= history.length) {
          setHistoryIdx(-1);
          setInput("");
        } else {
          setHistoryIdx(idx);
          setInput(history[idx]);
        }
      }
    }
  };

  // Drag resize handler
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startH: height };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - ev.clientY;
      const newH = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT + 8, dragRef.current.startH + delta));
      setHeight(newH);
      if (newH <= MIN_HEIGHT + 8) setCollapsed(true);
      else setCollapsed(false);
    };

    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const toggleCollapse = () => {
    if (collapsed) {
      setCollapsed(false);
      setHeight(DEFAULT_HEIGHT);
    } else {
      setCollapsed(true);
      setHeight(MIN_HEIGHT);
    }
  };

  return (
    <div
      className="bg-card border-t border-border flex flex-col transition-[height] duration-75 shrink-0"
      style={{ height: collapsed ? MIN_HEIGHT : height }}
    >
      {/* Drag handle — only functional at ≥1400px */}
      <div
        onMouseDown={onMouseDown}
        className="hidden min-[1400px]:block h-1 cursor-ns-resize hover:bg-foreground/10 transition-colors"
      />

      {/* Header */}
      <button
        onClick={toggleCollapse}
        className="flex items-center gap-2 px-3 h-8 min-h-[2rem] text-xs text-muted-foreground hover:text-foreground border-b border-border shrink-0"
      >
        <PxIcon icon={collapsed ? "chevron-right" : "chevron-down"} size={12} />
        <PxIcon icon="terminal" size={12} />
        <span className="uppercase tracking-wider font-medium">Terminal</span>
        <span className="ml-auto text-xs text-muted-foreground">bash</span>
      </button>

      {!collapsed && (
        <div className="flex-1 flex flex-col min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-5">
            {lines.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === "cmd" ? "text-foreground font-medium" :
                  line.type === "error" ? "text-destructive" :
                  line.type === "success" ? "text-success" :
                  "text-muted-foreground"
                }
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-1 px-3 pb-2 font-mono text-xs text-foreground shrink-0">
            <span className="text-success">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground"
              spellCheck={false}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}
