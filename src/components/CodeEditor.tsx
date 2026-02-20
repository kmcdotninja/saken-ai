import PxIcon from "./PxIcon";
import { fileContents } from "@/data/file-contents";

const colorMap: Record<string, string> = {
  keyword: "text-[hsl(var(--code-keyword))]",
  string: "text-[hsl(var(--code-string))]",
  type: "text-[hsl(var(--code-type))]",
  comment: "text-[hsl(var(--code-comment))]",
  function: "text-[hsl(var(--code-function))]",
  variable: "text-[hsl(var(--code-variable))]",
  number: "text-[hsl(var(--code-number))]",
};

interface Props {
  tabs: string[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onCloseTab: (tab: string) => void;
}

export default function CodeEditor({ tabs, activeTab, onSelectTab, onCloseTab }: Props) {
  const file = fileContents[activeTab];
  const lines = file?.lines ?? [];
  const lang = file?.language ?? "Plain Text";
  const filePath = file?.path ?? activeTab;

  // Split path into segments for breadcrumb
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

      {/* Code area */}
      {lines.length > 0 ? (
        <div className="flex-1 overflow-auto font-mono text-sm leading-6">
          <div className="py-2">
            {lines.map((line) => (
              <div key={line.num} className="flex hover:bg-card/50 px-2">
                <span className="line-number text-xs leading-6">{line.num}</span>
                <pre className="flex-1">
                  {line.content.length === 0 ? "\n" : line.content.map((token, i) => (
                    <span key={i} className={colorMap[token.cls] || ""}>{token.text}</span>
                  ))}
                </pre>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          <div className="text-center">
            <PxIcon icon="file" size={32} className="mx-auto mb-2 opacity-30" />
            <p>No preview available for this file</p>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-6 bg-card border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{lang}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
