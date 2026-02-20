import { useState } from "react";
import { agents, type KanbanCard } from "@/data/kanban-data";
import PxIcon from "./PxIcon";

interface Props {
  onClose: () => void;
  onSubmit: (issue: KanbanCard, columnId: string) => void;
  projectPrefix?: string;
}

const priorities = [
  { value: "urgent", label: "Urgent", icon: "alert", cls: "text-destructive" },
  { value: "high", label: "High", icon: "arrow-up", cls: "text-warning" },
  { value: "medium", label: "Medium", icon: "circle", cls: "text-muted-foreground" },
  { value: "low", label: "Low", icon: "circle", cls: "text-muted-foreground" },
] as const;

const columnOptions = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "In Review" },
];

const labelOptions = ["feature", "bug", "ui", "backend", "frontend", "security", "deploy", "infra", "design", "ux", "performance", "ai", "editor", "git"];

export default function NewIssueModal({ onClose, onSubmit, projectPrefix = "NEXUS" }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low">("medium");
  const [assignee, setAssignee] = useState(agents[0].id);
  const [column, setColumn] = useState("todo");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [points, setPoints] = useState<number | "">("");
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  const toggleLabel = (l: string) => {
    setSelectedLabels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const id = `${projectPrefix}-${Math.floor(Math.random() * 900) + 100}`;
    const card: KanbanCard = {
      id,
      title: title.trim(),
      description: description.trim() || "No description provided.",
      priority,
      labels: selectedLabels.length > 0 ? selectedLabels : ["feature"],
      assignee,
      ...(points ? { points: Number(points) } : {}),
    };
    onSubmit(card, column);
    onClose();
  };

  const selectedAgent = agents.find((a) => a.id === assignee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-card border border-border w-[560px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Create New Issue</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <PxIcon icon="close" size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title..."
              className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
              className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 resize-none"
            />
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Priority</label>
              <div className="flex gap-1">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`flex items-center gap-1 px-2 py-1.5 text-[11px] border ${
                      priority === p.value
                        ? "border-foreground/30 bg-accent text-foreground"
                        : "border-border bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <PxIcon icon={p.icon} size={10} className={p.cls} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Status</label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full bg-muted border border-border px-3 py-1.5 text-xs text-foreground outline-none"
              >
                {columnOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Assignee</label>
            <div className="flex gap-2">
              {agents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAssignee(a.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 border text-xs ${
                    assignee === a.id
                      ? "border-foreground/30 bg-accent text-foreground"
                      : "border-border bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <img src={a.avatar} alt={a.name} className="w-5 h-5 rounded-full object-cover" />
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Labels</label>
            <div className="flex flex-wrap gap-1">
              {selectedLabels.map((l) => (
                <span
                  key={l}
                  onClick={() => toggleLabel(l)}
                  className="text-[11px] px-2 py-1 bg-accent text-foreground border border-foreground/20 cursor-pointer hover:bg-destructive/20"
                >
                  {l} ×
                </span>
              ))}
              <button
                onClick={() => setShowLabelPicker(!showLabelPicker)}
                className="text-[11px] px-2 py-1 bg-muted border border-border text-muted-foreground hover:text-foreground"
              >
                + Add label
              </button>
            </div>
            {showLabelPicker && (
              <div className="flex flex-wrap gap-1 mt-2 p-2 bg-muted border border-border">
                {labelOptions
                  .filter((l) => !selectedLabels.includes(l))
                  .map((l) => (
                    <button
                      key={l}
                      onClick={() => { toggleLabel(l); }}
                      className="text-[11px] px-2 py-1 bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                    >
                      {l}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Points */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Story Points</label>
            <div className="flex gap-1">
              {[1, 2, 3, 5, 8, 13].map((p) => (
                <button
                  key={p}
                  onClick={() => setPoints(points === p ? "" : p)}
                  className={`w-8 h-8 text-xs border ${
                    points === p
                      ? "border-foreground/30 bg-accent text-foreground"
                      : "border-border bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted border border-border"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-4 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Issue
          </button>
        </div>
      </div>
    </div>
  );
}
