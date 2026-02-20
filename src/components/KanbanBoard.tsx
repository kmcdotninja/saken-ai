import { useState } from "react";
import {
  MoreHorizontal, Plus, MessageSquare, CheckCircle2, Circle,
  Clock, AlertTriangle, ArrowUp, Flame, Bot, Sparkles,
  LayoutGrid, List as ListIcon
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { columns as initialColumns, agents, type KanbanCard as CardType, type KanbanColumn } from "@/data/kanban-data";
import IssueModal from "./IssueModal";

const priorityConfig = {
  urgent: { icon: Flame, cls: "text-destructive", bg: "bg-destructive/10" },
  high: { icon: ArrowUp, cls: "text-warning", bg: "bg-warning/10" },
  medium: { icon: Circle, cls: "text-muted-foreground", bg: "bg-muted" },
  low: { icon: Circle, cls: "text-muted-foreground", bg: "bg-muted" },
};

const columnStatusIcon: Record<string, React.ReactNode> = {
  backlog: <Circle size={14} className="text-muted-foreground" />,
  todo: <Circle size={14} className="text-muted-foreground" />,
  in_progress: <Clock size={14} className="text-warning" />,
  review: <AlertTriangle size={14} className="text-foreground" />,
  done: <CheckCircle2 size={14} className="text-success" />,
};

const columnAccent: Record<string, string> = {
  backlog: "border-t-muted-foreground/30",
  todo: "border-t-muted-foreground/50",
  in_progress: "border-t-warning",
  review: "border-t-foreground/50",
  done: "border-t-success",
};

function KanbanCardItem({ card, onClick }: { card: CardType; onClick: () => void }) {
  const agent = agents.find((a) => a.id === card.assignee);
  const prio = priorityConfig[card.priority];
  const PrioIcon = prio.icon;

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border p-3.5 hover:border-foreground/20 hover:bg-accent/30 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-muted-foreground">{card.id}</span>
        <div className="flex items-center gap-1.5">
          <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 ${prio.bg} ${prio.cls}`}>
            <PrioIcon size={10} />
            {card.priority}
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-medium text-foreground leading-snug mb-2">{card.title}</h4>

      <div className="flex flex-wrap gap-1 mb-3">
        {card.labels.map((l) => (
          <span key={l} className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">
            {l}
          </span>
        ))}
      </div>

      {card.agentAction && agent && (
        <div className="flex items-start gap-2 px-2.5 py-2 bg-muted/50 border border-border mb-3">
          <div className="relative shrink-0">
            <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full object-cover" />
            <Bot size={8} className="absolute -bottom-0.5 -right-0.5 text-foreground" />
          </div>
          <div className="min-w-0">
            <span className={`text-[10px] font-medium ${agent.color}`}>{agent.name}</span>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{card.agentAction}</p>
          </div>
          <Sparkles size={10} className="text-foreground animate-pulse-dot shrink-0 mt-0.5" />
        </div>
      )}

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
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-muted text-[10px]">
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

function ListRow({ card, onClick }: { card: CardType; onClick: () => void }) {
  const agent = agents.find((a) => a.id === card.assignee);
  const prio = priorityConfig[card.priority];
  const PrioIcon = prio.icon;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 border-b border-border hover:bg-accent/30 transition-colors cursor-pointer group"
    >
      <PrioIcon size={14} className={prio.cls} />
      <span className="text-[11px] font-mono text-muted-foreground w-20 shrink-0">{card.id}</span>
      <span className="text-sm text-foreground flex-1 truncate">{card.title}</span>
      <div className="flex gap-1 shrink-0">
        {card.labels.slice(0, 2).map((l) => (
          <span key={l} className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">{l}</span>
        ))}
      </div>
      {card.subtasks && (
        <span className="text-[11px] text-muted-foreground shrink-0">
          {card.subtasks.done}/{card.subtasks.total}
        </span>
      )}
      {card.points && (
        <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground shrink-0">{card.points}pts</span>
      )}
      {agent && (
        <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-border shrink-0" />
      )}
    </div>
  );
}

export default function KanbanBoard() {
  const [cols, setCols] = useState<KanbanColumn[]>(initialColumns);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const newCols = cols.map((c) => ({ ...c, cards: [...c.cards] }));
    const srcCol = newCols.find((c) => c.id === source.droppableId)!;
    const destCol = newCols.find((c) => c.id === destination.droppableId)!;

    const [moved] = srcCol.cards.splice(source.index, 1);
    destCol.cards.splice(destination.index, 0, moved);

    setCols(newCols);
  };

  const handleReassign = (cardId: string, agentId: string) => {
    setCols(cols.map((c) => ({
      ...c,
      cards: c.cards.map((card) => card.id === cardId ? { ...card, assignee: agentId } : card),
    })));
    if (selectedCard?.id === cardId) {
      setSelectedCard({ ...selectedCard, assignee: agentId });
    }
  };

  const allCards = cols.flatMap((c) => c.cards.map((card) => ({ ...card, columnTitle: c.title })));

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-background">
      {/* Board header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">Sprint 14 — Platform Core</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5">
            {cols.reduce((acc, c) => acc + c.cards.length, 0)} issues
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-success">3 agents active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0 bg-muted border border-border">
            <button
              onClick={() => setViewMode("board")}
              className={`p-1.5 ${viewMode === "board" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ListIcon size={14} />
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted border border-border">
            <Bot size={12} /> Assign Agent
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
            <Plus size={12} /> New Issue
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        /* List view */
        <div className="overflow-y-auto h-[calc(100%-49px)]">
          {cols.map((col) => (
            <div key={col.id}>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border sticky top-0">
                {columnStatusIcon[col.status]}
                <span className="text-xs font-medium text-foreground">{col.title}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5">{col.cards.length}</span>
              </div>
              {col.cards.map((card) => (
                <ListRow key={card.id} card={card} onClick={() => setSelectedCard(card)} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* Board view with DnD */
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 p-4 h-[calc(100%-49px)] overflow-x-auto">
            {cols.map((col) => (
              <div
                key={col.id}
                className={`flex flex-col w-[320px] min-w-[320px] bg-card/30 border border-border border-t-2 ${columnAccent[col.status]}`}
              >
                <div className="flex items-center justify-between px-4 py-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {columnStatusIcon[col.status]}
                    <span className="text-sm font-medium text-foreground">{col.title}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5">
                      {col.cards.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-muted-foreground hover:text-foreground"><Plus size={14} /></button>
                    <button className="p-1 text-muted-foreground hover:text-foreground"><MoreHorizontal size={14} /></button>
                  </div>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 transition-colors ${snapshot.isDraggingOver ? "bg-accent/20" : ""}`}
                    >
                      {col.cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "opacity-90" : ""}
                            >
                              <KanbanCardItem card={card} onClick={() => setSelectedCard(card)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Issue Modal */}
      {selectedCard && (
        <IssueModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onReassign={handleReassign}
        />
      )}
    </div>
  );
}
