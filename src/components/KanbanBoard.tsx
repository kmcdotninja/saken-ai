import { useState } from "react";
import {
  MoreHorizontal, Plus, MessageSquare, CheckCircle2, Circle,
  Clock, AlertTriangle, ArrowUp, Flame, Bot, Sparkles, GripVertical
} from "lucide-react";
import { columns, agents, type KanbanCard as CardType, type KanbanColumn } from "@/data/kanban-data";

const priorityConfig = {
  urgent: { icon: Flame, cls: "text-destructive", bg: "bg-destructive/10" },
  high: { icon: ArrowUp, cls: "text-warning", bg: "bg-warning/10" },
  medium: { icon: Circle, cls: "text-foreground/60", bg: "bg-surface-3" },
  low: { icon: Circle, cls: "text-muted-foreground", bg: "bg-surface-3" },
};

const columnStatusIcon: Record<string, React.ReactNode> = {
  backlog: <Circle size={14} className="text-muted-foreground" />,
  todo: <Circle size={14} className="text-muted-foreground" />,
  in_progress: <Clock size={14} className="text-warning" />,
  review: <AlertTriangle size={14} className="text-primary" />,
  done: <CheckCircle2 size={14} className="text-success" />,
};

const columnAccent: Record<string, string> = {
  backlog: "border-t-muted-foreground/30",
  todo: "border-t-muted-foreground/50",
  in_progress: "border-t-warning",
  review: "border-t-primary",
  done: "border-t-success",
};

function KanbanCardItem({ card }: { card: CardType }) {
  const agent = agents.find((a) => a.id === card.assignee);
  const prio = priorityConfig[card.priority];
  const PrioIcon = prio.icon;

  return (
    <div className="bg-surface-2 rounded-lg border border-border p-3.5 hover:border-border/80 hover:bg-surface-3/50 transition-all cursor-pointer group">
      {/* Top row: ID + priority */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-muted-foreground">{card.id}</span>
        <div className="flex items-center gap-1.5">
          <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${prio.bg} ${prio.cls}`}>
            <PrioIcon size={10} />
            {card.priority}
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground leading-snug mb-2">{card.title}</h4>

      {/* Labels */}
      <div className="flex flex-wrap gap-1 mb-3">
        {card.labels.map((l) => (
          <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-3 text-muted-foreground border border-border/50">
            {l}
          </span>
        ))}
      </div>

      {/* Agent action banner */}
      {card.agentAction && agent && (
        <div className="flex items-start gap-2 px-2.5 py-2 rounded-md bg-surface-0/50 border border-border/30 mb-3">
          <div className="relative shrink-0">
            <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full object-cover" />
            <Bot size={8} className="absolute -bottom-0.5 -right-0.5 text-primary" />
          </div>
          <div className="min-w-0">
            <span className={`text-[10px] font-medium ${agent.color}`}>{agent.name}</span>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{card.agentAction}</p>
          </div>
          <Sparkles size={10} className="text-primary animate-pulse-dot shrink-0 mt-0.5" />
        </div>
      )}

      {/* Bottom row: meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {card.subtasks && (
            <span className="flex items-center gap-1">
              <CheckCircle2 size={11} />
              {card.subtasks.done}/{card.subtasks.total}
            </span>
          )}
          {card.comments && (
            <span className="flex items-center gap-1">
              <MessageSquare size={11} />
              {card.comments}
            </span>
          )}
          {card.points && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-3 text-[10px]">
              {card.points} pts
            </span>
          )}
        </div>
        {agent && (
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
            title={`${agent.name} — ${agent.role}`}
          />
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-surface-0">
      {/* Board header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-1/50">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">Sprint 14 — Platform Core</h2>
          <span className="text-xs text-muted-foreground bg-surface-2 px-2 py-0.5 rounded-full">
            {columns.reduce((acc, c) => acc + c.cards.length, 0)} issues
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-success">3 agents active</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-surface-2 rounded-md border border-border">
            <Bot size={12} /> Assign Agent
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Plus size={12} /> New Issue
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-4 p-4 h-[calc(100%-49px)] overflow-x-auto">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`flex flex-col w-[320px] min-w-[320px] bg-surface-1/30 rounded-xl border border-border/50 border-t-2 ${columnAccent[col.status]}`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                {columnStatusIcon[col.status]}
                <span className="text-sm font-medium text-foreground">{col.title}</span>
                <span className="text-xs text-muted-foreground bg-surface-3 px-1.5 py-0.5 rounded-full">
                  {col.cards.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-muted-foreground hover:text-foreground rounded"><Plus size={14} /></button>
                <button className="p-1 text-muted-foreground hover:text-foreground rounded"><MoreHorizontal size={14} /></button>
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5">
              {col.cards.map((card) => (
                <KanbanCardItem key={card.id} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
