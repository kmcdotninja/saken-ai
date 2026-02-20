import PxIcon from "./PxIcon";

const codeLines = [
  { num: 1, content: [{ text: "import", cls: "keyword" }, { text: " { ", cls: "variable" }, { text: "useState", cls: "function" }, { text: ", ", cls: "variable" }, { text: "useEffect", cls: "function" }, { text: " } ", cls: "variable" }, { text: "from", cls: "keyword" }, { text: " ", cls: "" }, { text: '"react"', cls: "string" }, { text: ";", cls: "variable" }] },
  { num: 2, content: [{ text: "import", cls: "keyword" }, { text: " { ", cls: "variable" }, { text: "fetchProjects", cls: "function" }, { text: " } ", cls: "variable" }, { text: "from", cls: "keyword" }, { text: " ", cls: "" }, { text: '"@/lib/api"', cls: "string" }, { text: ";", cls: "variable" }] },
  { num: 3, content: [] },
  { num: 4, content: [{ text: "interface", cls: "keyword" }, { text: " ", cls: "" }, { text: "Project", cls: "type" }, { text: " {", cls: "variable" }] },
  { num: 5, content: [{ text: "  id", cls: "variable" }, { text: ": ", cls: "" }, { text: "string", cls: "type" }, { text: ";", cls: "variable" }] },
  { num: 6, content: [{ text: "  name", cls: "variable" }, { text: ": ", cls: "" }, { text: "string", cls: "type" }, { text: ";", cls: "variable" }] },
  { num: 7, content: [{ text: "  status", cls: "variable" }, { text: ": ", cls: "" }, { text: '"active"', cls: "string" }, { text: " | ", cls: "variable" }, { text: '"archived"', cls: "string" }, { text: ";", cls: "variable" }] },
  { num: 8, content: [{ text: "  deployments", cls: "variable" }, { text: ": ", cls: "" }, { text: "Deployment", cls: "type" }, { text: "[];", cls: "variable" }] },
  { num: 9, content: [{ text: "}", cls: "variable" }] },
  { num: 10, content: [] },
  { num: 11, content: [{ text: "export", cls: "keyword" }, { text: " ", cls: "" }, { text: "default", cls: "keyword" }, { text: " ", cls: "" }, { text: "function", cls: "keyword" }, { text: " ", cls: "" }, { text: "Dashboard", cls: "function" }, { text: "() {", cls: "variable" }] },
  { num: 12, content: [{ text: "  ", cls: "" }, { text: "const", cls: "keyword" }, { text: " [projects, setProjects] = ", cls: "variable" }, { text: "useState", cls: "function" }, { text: "<", cls: "variable" }, { text: "Project", cls: "type" }, { text: "[]>([]);", cls: "variable" }] },
  { num: 13, content: [{ text: "  ", cls: "" }, { text: "const", cls: "keyword" }, { text: " [loading, setLoading] = ", cls: "variable" }, { text: "useState", cls: "function" }, { text: "(", cls: "variable" }, { text: "true", cls: "keyword" }, { text: ");", cls: "variable" }] },
  { num: 14, content: [] },
  { num: 15, content: [{ text: "  ", cls: "" }, { text: "useEffect", cls: "function" }, { text: "(() => {", cls: "variable" }] },
  { num: 16, content: [{ text: "    ", cls: "" }, { text: "fetchProjects", cls: "function" }, { text: "()", cls: "variable" }] },
  { num: 17, content: [{ text: "      .", cls: "variable" }, { text: "then", cls: "function" }, { text: "((data) => {", cls: "variable" }] },
  { num: 18, content: [{ text: "        ", cls: "" }, { text: "setProjects", cls: "function" }, { text: "(data);", cls: "variable" }] },
  { num: 19, content: [{ text: "        ", cls: "" }, { text: "setLoading", cls: "function" }, { text: "(", cls: "variable" }, { text: "false", cls: "keyword" }, { text: ");", cls: "variable" }] },
  { num: 20, content: [{ text: "      })", cls: "variable" }] },
  { num: 21, content: [{ text: "      .", cls: "variable" }, { text: "catch", cls: "function" }, { text: "((err) => ", cls: "variable" }, { text: "console", cls: "variable" }, { text: ".", cls: "" }, { text: "error", cls: "function" }, { text: "(err));", cls: "variable" }] },
  { num: 22, content: [{ text: "  }, []);", cls: "variable" }] },
  { num: 23, content: [] },
  { num: 24, content: [{ text: "  ", cls: "" }, { text: "return", cls: "keyword" }, { text: " (", cls: "variable" }] },
  { num: 25, content: [{ text: "    <", cls: "variable" }, { text: "div", cls: "keyword" }, { text: " ", cls: "" }, { text: "className", cls: "type" }, { text: "=", cls: "variable" }, { text: '"grid gap-4 p-6"', cls: "string" }, { text: ">", cls: "variable" }] },
  { num: 26, content: [{ text: "      {projects.", cls: "variable" }, { text: "map", cls: "function" }, { text: "((project) => (", cls: "variable" }] },
  { num: 27, content: [{ text: "        <", cls: "variable" }, { text: "ProjectCard", cls: "type" }, { text: " ", cls: "" }, { text: "key", cls: "type" }, { text: "={project.id} ", cls: "variable" }, { text: "project", cls: "type" }, { text: "={project} />", cls: "variable" }] },
  { num: 28, content: [{ text: "      ))}", cls: "variable" }] },
  { num: 29, content: [{ text: "    </", cls: "variable" }, { text: "div", cls: "keyword" }, { text: ">", cls: "variable" }] },
  { num: 30, content: [{ text: "  );", cls: "variable" }] },
  { num: 31, content: [{ text: "}", cls: "variable" }] },
];

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
  return (
    <div className="flex-1 flex flex-col bg-background min-w-0">
      {/* Tabs */}
      <div className="flex items-center h-9 bg-card border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`flex items-center gap-2 px-3 h-full text-sm cursor-pointer border-r border-border whitespace-nowrap ${
              tab === activeTab
                ? "bg-background text-foreground border-t-2 border-t-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onCloseTab(tab); }}
              className="opacity-0 group-hover:opacity-100 hover:bg-accent p-0.5"
            >
              <PxIcon icon="close" size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center px-4 h-7 text-xs text-muted-foreground bg-background border-b border-border">
        <span>src</span>
        <span className="mx-1">/</span>
        <span>components</span>
        <span className="mx-1">/</span>
        <span className="text-foreground">{activeTab}</span>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto font-mono text-sm leading-6">
        <div className="py-2">
          {codeLines.map((line) => (
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

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-6 bg-card border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>TypeScript React</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln 15, Col 4</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
