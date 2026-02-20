import { useState, useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { rawFileContents } from "@/data/file-raw-contents";
import PxIcon from "./PxIcon";

// Custom dark theme matching the app's design tokens
const sakenTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "hsl(0 0% 5%)",
      color: "hsl(0 0% 85%)",
      fontFamily: "'Geist Mono', 'Fira Code', monospace",
      fontSize: "13px",
    },
    ".cm-content": {
      caretColor: "hsl(0 0% 90%)",
      padding: "8px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "hsl(0 0% 90%)",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "hsl(0 0% 25%) !important",
    },
    ".cm-activeLine": {
      backgroundColor: "hsl(0 0% 10%)",
    },
    ".cm-gutters": {
      backgroundColor: "hsl(0 0% 5%)",
      color: "hsl(0 0% 35%)",
      border: "none",
      paddingRight: "8px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "hsl(0 0% 10%)",
      color: "hsl(0 0% 55%)",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      minWidth: "2.5rem",
      textAlign: "right",
      paddingRight: "12px",
      fontSize: "12px",
    },
    ".cm-foldGutter": {
      width: "12px",
    },
    ".cm-matchingBracket": {
      backgroundColor: "hsl(0 0% 20%)",
      outline: "1px solid hsl(0 0% 30%)",
    },
    ".cm-searchMatch": {
      backgroundColor: "hsl(38 92% 50% / 0.3)",
    },
    ".cm-tooltip": {
      backgroundColor: "hsl(0 0% 12%)",
      border: "1px solid hsl(0 0% 16%)",
      color: "hsl(0 0% 85%)",
    },
    ".cm-panels": {
      backgroundColor: "hsl(0 0% 8%)",
      color: "hsl(0 0% 85%)",
    },
  },
  { dark: true }
);

// Syntax highlighting colors matching the code tokens
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const sakenHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: "hsl(0 0% 70%)" },
  { tag: tags.string, color: "hsl(142 71% 55%)" },
  { tag: tags.typeName, color: "hsl(38 92% 60%)" },
  { tag: tags.comment, color: "hsl(0 0% 35%)", fontStyle: "italic" },
  { tag: tags.function(tags.variableName), color: "hsl(0 0% 80%)" },
  { tag: tags.variableName, color: "hsl(0 0% 85%)" },
  { tag: tags.number, color: "hsl(0 0% 60%)" },
  { tag: tags.bool, color: "hsl(0 0% 70%)" },
  { tag: tags.operator, color: "hsl(0 0% 60%)" },
  { tag: tags.propertyName, color: "hsl(0 0% 80%)" },
  { tag: tags.tagName, color: "hsl(0 0% 70%)" },
  { tag: tags.attributeName, color: "hsl(38 92% 60%)" },
  { tag: tags.definition(tags.variableName), color: "hsl(0 0% 85%)" },
  { tag: tags.bracket, color: "hsl(0 0% 55%)" },
  { tag: tags.punctuation, color: "hsl(0 0% 55%)" },
  { tag: tags.meta, color: "hsl(0 0% 50%)" },
  { tag: tags.regexp, color: "hsl(142 71% 55%)" },
  { tag: tags.className, color: "hsl(38 92% 60%)" },
  { tag: tags.self, color: "hsl(0 0% 70%)" },
  { tag: tags.null, color: "hsl(0 0% 70%)" },
]);

function getExtensions(language: string): Extension[] {
  const base = [sakenTheme, syntaxHighlighting(sakenHighlight)];
  if (language === "JSON") return [...base, json()];
  if (language.includes("TypeScript") || language.includes("React"))
    return [...base, javascript({ jsx: true, typescript: true })];
  return base;
}

interface Props {
  tabs: string[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onCloseTab: (tab: string) => void;
}

export default function CodeEditor({ tabs, activeTab, onSelectTab, onCloseTab }: Props) {
  // Store editable content per file
  const [fileBuffers, setFileBuffers] = useState<Record<string, string>>(() => {
    const buffers: Record<string, string> = {};
    Object.entries(rawFileContents).forEach(([key, file]) => {
      buffers[key] = file.content;
    });
    return buffers;
  });

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const handleChange = useCallback(
    (value: string) => {
      setFileBuffers((prev) => ({ ...prev, [activeTab]: value }));
    },
    [activeTab]
  );

  const handleStatUpdate = useMemo(
    () =>
      EditorView.updateListener.of((update) => {
        if (update.selectionSet) {
          const pos = update.state.selection.main.head;
          const line = update.state.doc.lineAt(pos);
          setCursorPos({ line: line.number, col: pos - line.from + 1 });
        }
      }),
    []
  );

  if (tabs.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-background min-w-0 min-h-0 overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <PxIcon icon="file" size={48} className="mx-auto text-muted-foreground/20" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">No files open</p>
              <p className="text-xs text-muted-foreground/60">
                Open a file from the explorer or use{" "}
                <kbd className="px-1.5 py-0.5 bg-muted border border-border text-[10px]">⌘K</kbd> to search
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 pt-2 text-xs text-muted-foreground/50">
              <div className="flex items-center gap-2">
                <PxIcon icon="folder" size={14} />
                <span>Browse files in the explorer</span>
              </div>
              <div className="flex items-center gap-2">
                <PxIcon icon="search" size={14} />
                <span>Search files, issues, commands</span>
              </div>
              <div className="flex items-center gap-2">
                <PxIcon icon="git-branch" size={14} />
                <span>Switch branches or view history</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 h-6 bg-card border-t border-border text-xs text-muted-foreground">
          <span>No file selected</span>
        </div>
      </div>
    );
  }

  const file = rawFileContents[activeTab];
  const lang = file?.language ?? "Plain Text";
  const filePath = file?.path ?? activeTab;
  const pathParts = filePath.split("/");
  const content = fileBuffers[activeTab] ?? "";
  const extensions = getExtensions(lang);

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
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab);
              }}
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

      {/* CodeMirror editor */}
      <div className="flex-1 overflow-auto min-h-0">
        <CodeMirror
          value={content}
          onChange={handleChange}
          extensions={[...extensions, handleStatUpdate]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            indentOnInput: true,
            tabSize: 2,
          }}
          theme="dark"
          height="100%"
          style={{ height: "100%" }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-6 bg-card border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{lang}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
