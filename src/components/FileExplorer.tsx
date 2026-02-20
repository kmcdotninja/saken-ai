import { useState } from "react";
import PxIcon from "./PxIcon";
import { projectViewData, type FileNode } from "@/data/project-data";

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
          className="flex items-center gap-1.5 w-full px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <PxIcon icon={open ? "chevron-down" : "chevron-right"} size={14} />
          <PxIcon icon="folder" size={14} className="text-muted-foreground" />
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
      className={`flex items-center gap-1.5 w-full px-2 py-1 text-sm transition-colors ${
        isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
      style={{ paddingLeft: `${depth * 12 + 22}px` }}
    >
      <PxIcon icon="file" size={14} className={isActive ? "text-foreground" : ""} />
      <span>{node.name}</span>
    </button>
  );
}

interface Props {
  activeFile: string;
  onSelectFile: (name: string) => void;
  projectId: string;
}

export default function FileExplorer({ activeFile, onSelectFile, projectId }: Props) {
  const data = projectViewData[projectId] || projectViewData["nexus-platform"];
  const fileTree = data.fileTree;

  return (
    <div className="w-60 bg-card border-r border-border flex flex-col h-full">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Explorer</span>
        <div className="flex gap-1">
          <button className="p-1 text-muted-foreground hover:text-foreground"><PxIcon icon="plus" size={14} /></button>
          <button className="p-1 text-muted-foreground hover:text-foreground"><PxIcon icon="more-horizontal" size={14} /></button>
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
