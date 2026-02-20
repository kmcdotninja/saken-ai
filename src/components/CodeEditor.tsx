import { useState, useRef, useEffect, useCallback } from "react";
import PxIcon from "./PxIcon";
import { projectViewData } from "@/data/project-data";

const colorMap: Record<string, string> = {
  keyword: "text-[hsl(var(--code-keyword))]",
  string: "text-[hsl(var(--code-string))]",
  type: "text-[hsl(var(--code-type))]",
  comment: "text-[hsl(var(--code-comment))]",
  function: "text-[hsl(var(--code-function))]",
  variable: "text-[hsl(var(--code-variable))]",
  number: "text-[hsl(var(--code-number))]",
};

// Simple syntax keywords for autocomplete suggestions
const syntaxSuggestions: Record<string, string[]> = {
  tsx: ["import", "export", "default", "function", "const", "let", "return", "useState", "useEffect", "useCallback", "useMemo", "useRef", "interface", "type", "React", "className", "onClick", "onChange", "children", "props", "<div>", "<span>", "<button>", "async", "await"],
  ts: ["import", "export", "default", "function", "const", "let", "interface", "type", "async", "await", "return", "class", "extends", "implements", "private", "public", "protected", "readonly"],
  css: ["display", "flex", "grid", "margin", "padding", "color", "background", "border", "font-size", "font-weight", "position", "absolute", "relative", "width", "height", "gap", "align-items", "justify-content", "@media", "@keyframes", "transition", "transform", "opacity"],
  go: ["func", "package", "import", "return", "struct", "interface", "type", "var", "const", "if", "else", "for", "range", "defer", "go", "chan", "select", "switch", "case", "nil", "err", "fmt.Println", "http.HandleFunc"],
  py: ["def", "class", "import", "from", "return", "self", "if", "elif", "else", "for", "while", "try", "except", "finally", "with", "async", "await", "yield", "lambda", "print", "__init__", "__name__"],
  prisma: ["model", "datasource", "generator", "String", "Int", "Boolean", "DateTime", "@id", "@default", "@unique", "@relation", "enum"],
};

function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function getSuggestions(ext: string): string[] {
  return syntaxSuggestions[ext] || syntaxSuggestions.ts;
}

interface Props {
  tabs: string[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onCloseTab: (tab: string) => void;
  projectId: string;
}

export default function CodeEditor({ tabs, activeTab, onSelectTab, onCloseTab, projectId }: Props) {
  const data = projectViewData[projectId] || projectViewData["nexus-platform"];
  const fileContents = data.fileContents;

  // Editable text state per file
  const [editBuffers, setEditBuffers] = useState<Record<string, string>>({});
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize buffer from file content
  const getBuffer = useCallback((tab: string): string => {
    if (editBuffers[tab] !== undefined) return editBuffers[tab];
    const file = fileContents[tab];
    if (!file?.lines) return "";
    return file.lines.map((line) =>
      line.content.map((token) => token.text).join("")
    ).join("\n");
  }, [editBuffers, fileContents]);

  const currentBuffer = getBuffer(activeTab);
  const lines = currentBuffer.split("\n");

  const updateBuffer = (tab: string, value: string) => {
    setEditBuffers((prev) => ({ ...prev, [tab]: value }));
  };

  // Cursor position tracking
  const updateCursorPos = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = ta.value.substring(0, pos);
    const linesBefore = textBefore.split("\n");
    setCursorLine(linesBefore.length);
    setCursorCol(linesBefore[linesBefore.length - 1].length + 1);
  };

  // Autocomplete logic
  const handleInput = (value: string) => {
    updateBuffer(activeTab, value);
    
    // Get current word for suggestions
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = value.substring(0, pos);
    const match = textBefore.match(/(\w+)$/);
    const currentWord = match ? match[1] : "";

    if (currentWord.length >= 2) {
      const ext = getExtension(activeTab);
      const allSuggestions = getSuggestions(ext);
      const filtered = allSuggestions.filter(
        (s) => s.toLowerCase().startsWith(currentWord.toLowerCase()) && s.toLowerCase() !== currentWord.toLowerCase()
      );
      if (filtered.length > 0) {
        setSuggestions(filtered.slice(0, 6));
        setSelectedSuggestion(0);
        setShowSuggestions(true);
        return;
      }
    }
    setShowSuggestions(false);
  };

  const applySuggestion = (suggestion: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const text = ta.value;
    const textBefore = text.substring(0, pos);
    const match = textBefore.match(/(\w+)$/);
    const wordStart = match ? pos - match[1].length : pos;
    const newText = text.substring(0, wordStart) + suggestion + text.substring(pos);
    updateBuffer(activeTab, newText);
    setShowSuggestions(false);
    
    // Restore cursor position
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const newPos = wordStart + suggestion.length;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestion((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applySuggestion(suggestions[selectedSuggestion]);
        return;
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
        return;
      }
    }

    // Tab key inserts 2 spaces
    if (e.key === "Tab" && !showSuggestions) {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = ta.value;
      const newText = text.substring(0, start) + "  " + text.substring(end);
      updateBuffer(activeTab, newText);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  // Close suggestions on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (tabs.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-background min-w-0 min-h-0 overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <PxIcon icon="file" size={48} className="mx-auto text-muted-foreground/20" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">No files open</p>
              <p className="text-xs text-muted-foreground/60">Open a file from the explorer or use <kbd className="px-1.5 py-0.5 bg-muted border border-border text-[10px]">⌘K</kbd> to search</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 h-6 bg-card border-t border-border text-xs text-muted-foreground">
          <span>No file selected</span>
        </div>
      </div>
    );
  }

  const file = fileContents[activeTab];
  const lang = file?.language ?? "Plain Text";
  const filePath = file?.path ?? activeTab;
  const pathParts = filePath.split("/");

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0 min-h-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center h-9 bg-card border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`group flex items-center gap-2 px-3 h-full text-sm cursor-pointer border-r border-border whitespace-nowrap transition-colors ${
              tab === activeTab
                ? "bg-background text-foreground border-t-2 border-t-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            }`}
          >
            <PxIcon icon="file" size={12} className="shrink-0" />
            <span>{tab}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onCloseTab(tab); }}
              className="opacity-0 group-hover:opacity-100 hover:bg-accent p-0.5 transition-opacity"
            >
              <PxIcon icon="close" size={10} />
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center px-4 h-7 text-xs text-muted-foreground bg-background border-b border-border">
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && <span className="mx-1 text-border">/</span>}
            <span className={i === pathParts.length - 1 ? "text-foreground" : ""}>{part}</span>
          </span>
        ))}
      </div>

      {/* Editable code area */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex min-h-full">
          {/* Line numbers */}
          <div className="py-2 select-none shrink-0">
            {lines.map((_, i) => (
              <div key={i} className="px-2 text-right">
                <span className="line-number text-xs leading-6">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Textarea overlay */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={currentBuffer}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={updateCursorPos}
              onClick={updateCursorPos}
              spellCheck={false}
              className="absolute inset-0 w-full h-full py-2 font-mono text-sm leading-6 bg-transparent text-foreground resize-none outline-none caret-foreground z-10"
              style={{ 
                tabSize: 2,
                caretColor: "hsl(var(--foreground))",
                color: "transparent",
              }}
            />
            {/* Syntax-colored overlay (read-only visual) */}
            <div className="py-2 pointer-events-none font-mono text-sm leading-6 whitespace-pre-wrap break-all" aria-hidden>
              {lines.map((line, i) => (
                <div key={i} className="min-h-[1.5rem]">
                  {highlightLine(line, getExtension(activeTab))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-20 bg-popover border border-border shadow-lg min-w-[200px]"
            style={{
              top: `${cursorLine * 24 + 8}px`,
              left: `${Math.min(cursorCol * 7.8 + 40, 300)}px`,
            }}
          >
            {suggestions.map((s, i) => (
              <button
                key={s}
                onClick={() => applySuggestion(s)}
                className={`w-full px-3 py-1.5 text-left text-sm font-mono flex items-center gap-2 ${
                  i === selectedSuggestion
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                <PxIcon icon="code" size={12} className="text-muted-foreground shrink-0" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-6 bg-card border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{lang}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {cursorLine}, Col {cursorCol}</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}

// Basic syntax highlighting by extension
function highlightLine(text: string, ext: string): React.ReactNode {
  if (!text) return "\n";

  const rules: { pattern: RegExp; cls: string }[] = [];

  if (ext === "tsx" || ext === "ts" || ext === "jsx" || ext === "js") {
    rules.push(
      { pattern: /(\/\/.*$)/gm, cls: "comment" },
      { pattern: /\b(import|export|default|from|return|const|let|var|function|if|else|switch|case|break|new|throw|try|catch|async|await|class|extends|typeof|instanceof)\b/g, cls: "keyword" },
      { pattern: /\b(interface|type|enum|namespace|declare|as|is|keyof|readonly)\b/g, cls: "type" },
      { pattern: /("[^"]*"|'[^']*'|`[^`]*`)/g, cls: "string" },
      { pattern: /\b(\d+\.?\d*)\b/g, cls: "number" },
      { pattern: /\b([A-Z]\w*)\b/g, cls: "type" },
    );
  } else if (ext === "css") {
    rules.push(
      { pattern: /(\/\*[\s\S]*?\*\/)/g, cls: "comment" },
      { pattern: /(@\w+)/g, cls: "keyword" },
      { pattern: /("[^"]*"|'[^']*')/g, cls: "string" },
      { pattern: /(#[0-9a-fA-F]{3,8})/g, cls: "number" },
      { pattern: /(\d+\.?\d*(px|em|rem|%|vh|vw|s|ms))/g, cls: "number" },
    );
  } else if (ext === "go") {
    rules.push(
      { pattern: /(\/\/.*$)/gm, cls: "comment" },
      { pattern: /\b(package|import|func|return|var|const|type|struct|interface|if|else|for|range|defer|go|chan|select|switch|case|nil|map|make|append)\b/g, cls: "keyword" },
      { pattern: /("[^"]*")/g, cls: "string" },
      { pattern: /\b(\d+\.?\d*)\b/g, cls: "number" },
    );
  } else if (ext === "py") {
    rules.push(
      { pattern: /(#.*$)/gm, cls: "comment" },
      { pattern: /\b(def|class|import|from|return|self|if|elif|else|for|while|try|except|finally|with|as|async|await|yield|lambda|pass|raise|True|False|None|and|or|not|in|is)\b/g, cls: "keyword" },
      { pattern: /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, cls: "string" },
      { pattern: /\b(\d+\.?\d*)\b/g, cls: "number" },
    );
  } else if (ext === "prisma") {
    rules.push(
      { pattern: /(\/\/.*$)/gm, cls: "comment" },
      { pattern: /\b(model|datasource|generator|enum)\b/g, cls: "keyword" },
      { pattern: /\b(String|Int|Boolean|DateTime|Float|Json|BigInt|Decimal|Bytes)\b/g, cls: "type" },
      { pattern: /(@\w+)/g, cls: "function" },
      { pattern: /("[^"]*")/g, cls: "string" },
    );
  }

  if (rules.length === 0) return text;

  // Simple token-based highlighting
  const tokens: { start: number; end: number; cls: string }[] = [];
  
  for (const rule of rules) {
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      tokens.push({ start: match.index, end: match.index + match[0].length, cls: rule.cls });
    }
  }

  // Sort by position, remove overlaps
  tokens.sort((a, b) => a.start - b.start);
  const filtered: typeof tokens = [];
  let lastEnd = 0;
  for (const t of tokens) {
    if (t.start >= lastEnd) {
      filtered.push(t);
      lastEnd = t.end;
    }
  }

  if (filtered.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let pos = 0;
  for (const t of filtered) {
    if (pos < t.start) parts.push(text.slice(pos, t.start));
    parts.push(
      <span key={t.start} className={colorMap[t.cls] || ""}>{text.slice(t.start, t.end)}</span>
    );
    pos = t.end;
  }
  if (pos < text.length) parts.push(text.slice(pos));

  return <>{parts}</>;
}
