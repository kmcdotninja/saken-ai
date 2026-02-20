import { useState, useEffect, useRef, useMemo } from "react";
import PxIcon from "./PxIcon";
import { columns, agents } from "@/data/kanban-data";

interface CommandItem {
  id: string;
  label: string;
  category: "file" | "issue" | "command" | "agent";
  icon: string;
  meta?: string;
  action?: () => void;
}

const fileItems: CommandItem[] = [
  { id: "f1", label: "Dashboard.tsx", category: "file", icon: "file", meta: "src/components" },
  { id: "f2", label: "Sidebar.tsx", category: "file", icon: "file", meta: "src/components" },
  { id: "f3", label: "Header.tsx", category: "file", icon: "file", meta: "src/components" },
  { id: "f4", label: "utils.ts", category: "file", icon: "file", meta: "src/lib" },
  { id: "f5", label: "api.ts", category: "file", icon: "file", meta: "src/lib" },
  { id: "f6", label: "App.tsx", category: "file", icon: "file", meta: "src" },
  { id: "f7", label: "main.tsx", category: "file", icon: "file", meta: "src" },
  { id: "f8", label: "index.css", category: "file", icon: "file", meta: "src" },
  { id: "f9", label: "package.json", category: "file", icon: "file", meta: "/" },
  { id: "f10", label: "tsconfig.json", category: "file", icon: "file", meta: "/" },
];

const commandItems: CommandItem[] = [
  { id: "c1", label: "New Issue", category: "command", icon: "plus", meta: "⌘N" },
  { id: "c2", label: "Deploy to Production", category: "command", icon: "cloud-upload", meta: "⌘⇧D" },
  { id: "c3", label: "Toggle Terminal", category: "command", icon: "terminal", meta: "⌘`" },
  { id: "c4", label: "Git: Commit Changes", category: "command", icon: "git-commit", meta: "" },
  { id: "c5", label: "Git: Push", category: "command", icon: "arrow-up", meta: "" },
  { id: "c6", label: "Git: Pull", category: "command", icon: "arrow-down", meta: "" },
  { id: "c7", label: "Switch Branch", category: "command", icon: "git-branch", meta: "" },
  { id: "c8", label: "Assign Agent", category: "command", icon: "cpu", meta: "" },
  { id: "c9", label: "Toggle Board/List View", category: "command", icon: "layout-columns", meta: "" },
];

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

const categoryLabels: Record<string, string> = {
  command: "Commands",
  file: "Files",
  issue: "Issues",
  agent: "Agents",
};

const categoryOrder = ["command", "file", "issue", "agent"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const issueItems: CommandItem[] = useMemo(
    () =>
      columns.flatMap((col) =>
        col.cards.map((card) => ({
          id: card.id,
          label: `${card.id} ${card.title}`,
          category: "issue" as const,
          icon: "circle",
          meta: col.title,
        }))
      ),
    []
  );

  const agentItems: CommandItem[] = useMemo(
    () =>
      agents.map((a) => ({
        id: `agent-${a.id}`,
        label: a.name,
        category: "agent" as const,
        icon: "cpu",
        meta: a.role,
      })),
    []
  );

  const allItems = useMemo(
    () => [...commandItems, ...fileItems, ...issueItems, ...agentItems],
    [issueItems, agentItems]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 20);
    return allItems.filter((item) => fuzzyMatch(query, item.label));
  }, [query, allItems]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return categoryOrder
      .filter((c) => groups[c])
      .map((c) => ({ category: c, items: groups[c] }));
  }, [filtered]);

  const flatList = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector("[data-selected='true']");
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useEffect(() => {
    function handleGlobal(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // toggled from parent
      }
    }
    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  }, [open, onClose]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatList[selectedIndex]) {
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!open) return null;

  let itemIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-[560px] bg-card border border-border shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <PxIcon icon="search" size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search files, issues, commands..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground border border-border font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {grouped.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results for "{query}"
            </div>
          )}
          {grouped.map((group) => (
            <div key={group.category}>
              <div className="px-4 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {categoryLabels[group.category]}
              </div>
              {group.items.map((item) => {
                const idx = itemIndex++;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    data-selected={isSelected}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                      isSelected ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <PxIcon icon={item.icon} size={14} className="shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.meta && (
                      <span className="text-[10px] text-muted-foreground shrink-0">{item.meta}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-muted border border-border font-mono">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-muted border border-border font-mono">↵</kbd> Open</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-muted border border-border font-mono">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
