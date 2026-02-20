import { useState } from "react";
import {
  FolderOpen, FileText, ChevronRight, ChevronDown, Folder,
  MoreHorizontal, Plus
} from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  language?: string;
}

const fileTree: FileNode[] = [
  {
    name: "src", type: "folder", children: [
      {
        name: "components", type: "folder", children: [
          { name: "Dashboard.tsx", type: "file", language: "tsx" },
          { name: "Sidebar.tsx", type: "file", language: "tsx" },
          { name: "Header.tsx", type: "file", language: "tsx" },
        ]
      },
      {
        name: "lib", type: "folder", children: [
          { name: "utils.ts", type: "file", language: "ts" },
          { name: "api.ts", type: "file", language: "ts" },
        ]
      },
      { name: "App.tsx", type: "file", language: "tsx" },
      { name: "main.tsx", type: "file", language: "tsx" },
      { name: "index.css", type: "file", language: "css" },
    ]
  },
  {
    name: "public", type: "folder", children: [
      { name: "favicon.ico", type: "file" },
    ]
  },
  { name: "package.json", type: "file", language: "json" },
  { name: "tsconfig.json", type: "file", language: "json" },
  { name: "README.md", type: "file", language: "md" },
];

function TreeItem({ node, depth = 0, activeFile, onSelect }: {
  node: FileNode; depth?: number; activeFile: string; onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(depth < 1);
  const isActive = node.name === activeFile;

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 w-full px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={14} className="text-primary/60" />
          <span>{node.name}</span>
        </button>
        {open && node.children?.map((child) => (
          <TreeItem key={child.name} node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.name)}
      className={`flex items-center gap-1.5 w-full px-2 py-1 text-sm rounded transition-colors ${
        isActive ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
      }`}
      style={{ paddingLeft: `${depth * 12 + 22}px` }}
    >
      <FileText size={14} className={isActive ? "text-primary" : ""} />
      <span>{node.name}</span>
    </button>
  );
}

interface Props {
  activeFile: string;
  onSelectFile: (name: string) => void;
}

export default function FileExplorer({ activeFile, onSelectFile }: Props) {
  return (
    <div className="w-60 bg-surface-1 border-r border-border flex flex-col h-full">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Explorer</span>
        <div className="flex gap-1">
          <button className="p-1 text-muted-foreground hover:text-foreground rounded"><Plus size={14} /></button>
          <button className="p-1 text-muted-foreground hover:text-foreground rounded"><MoreHorizontal size={14} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {fileTree.map((node) => (
          <TreeItem key={node.name} node={node} activeFile={activeFile} onSelect={onSelectFile} />
        ))}
      </div>
    </div>
  );
}
