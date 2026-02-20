import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { agents, type KanbanCard as CardType, type KanbanColumn, projectColumns } from "@/data/kanban-data";
import { projectViewData } from "@/data/project-data";
import IssueModal from "./IssueModal";
import NewIssueModal from "./NewIssueModal";
import AgentAssignModal from "./AgentAssignModal";
import PxIcon from "./PxIcon";
import { toast } from "sonner";

const priorityConfig: Record<string, { icon: string; cls: string; bg: string }> = {
  urgent: { icon: "alert", cls: "text-destructive", bg: "bg-destructive/10" },
  high: { icon: "arrow-up", cls: "text-warning", bg: "bg-warning/10" },
  medium: { icon: "circle", cls: "text-muted-foreground", bg: "bg-muted" },
  low: { icon: "circle", cls: "text-muted-foreground", bg: "bg-muted" },
};

const columnStatusIcon: Record<string, { icon: string; cls: string }> = {
  backlog: { icon: "circle", cls: "text-muted-foreground" },
  todo: { icon: "circle", cls: "text-muted-foreground" },
  in_progress: { icon: "clock", cls: "text-warning" },
  review: { icon: "alert", cls: "text-foreground" },
  done: { icon: "check", cls: "text-success" },
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

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border p-3.5 hover:border-foreground/20 hover:bg-accent/30 transition-all duration-150 cursor-pointer group animate-slide-up"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-muted-foreground">{card.id}</span>
        <div className="flex items-center gap-1.5">
          <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 ${prio.bg} ${prio.cls}`}>
            <PxIcon icon={prio.icon} size={10} />
            {card.priority}
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity">
            <PxIcon icon="more-horizontal" size={14} />
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
            <PxIcon icon="cpu" size={8} className="absolute -bottom-0.5 -right-0.5 text-foreground" />
          </div>
          <div className="min-w-0">
            <span className={`text-[10px] font-medium ${agent.color}`}>{agent.name}</span>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{card.agentAction}</p>
          </div>
          <PxIcon icon="zap" size={10} className="text-foreground animate-pulse-dot shrink-0 mt-0.5" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {card.subtasks && (
            <span className="flex items-center gap-1">
              <PxIcon icon="check" size={11} />
              {card.subtasks.done}/{card.subtasks.total}
            </span>
          )}
          {card.comments && (
            <span className="flex items-center gap-1">
              <PxIcon icon="message" size={11} />
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

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 border-b border-border hover:bg-accent/30 transition-colors cursor-pointer group"
    >
      <PxIcon icon={prio.icon} size={14} className={prio.cls} />
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

interface Props {
  projectId: string;
}

export default function KanbanBoard({ projectId }: Props) {
  const initialColumns = projectColumns[projectId] || projectColumns["nexus-platform"];
  const viewData = projectViewData[projectId] || projectViewData["nexus-platform"];

  const [cols, setCols] = useState<KanbanColumn[]>(initialColumns);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [showAssignAgent, setShowAssignAgent] = useState(false);

  const projectPrefix = (projectColumns[projectId]?.[0]?.cards[0]?.id || "NEXUS-000").split("-")[0];

  const handleNewIssue = (card: CardType, columnId: string) => {
    setCols((prev) =>
      prev.map((c) =>
        c.id === columnId ? { ...c, cards: [...c.cards, card] } : c
      )
    );
    toast.success("Issue created", {
      description: `${card.id} — ${card.title}`,
    });
  };

  const handleBulkAssign = (cardIds: string[], agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    setCols((prev) =>
      prev.map((c) => ({
        ...c,
        cards: c.cards.map((card) =>
          cardIds.includes(card.id) ? { ...card, assignee: agentId } : card
        ),
      }))
    );
    toast.success("Agent assigned", {
      description: `${agent?.name || "Agent"} assigned to ${cardIds.length} issue${cardIds.length > 1 ? "s" : ""}`,
    });
  };

  // Reset when project changes
  useEffect(() => {
    setCols(projectColumns[projectId] || projectColumns["nexus-platform"]);
    setSelectedCard(null);
  }, [projectId]);

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

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-background">
      {/* Board header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">{viewData.sprintTitle}</h2>
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
              <PxIcon icon="layout-columns" size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <PxIcon icon="list" size={14} />
            </button>
          </div>
          <button
            onClick={() => setShowAssignAgent(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted border border-border"
          >
            <PxIcon icon="cpu" size={12} /> Assign Agent
          </button>
          <button
            onClick={() => setShowNewIssue(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90"
          >
            <PxIcon icon="plus" size={12} /> New Issue
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="overflow-y-auto h-[calc(100%-49px)]">
          {cols.map((col) => {
            const si = columnStatusIcon[col.status];
            return (
              <div key={col.id}>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border sticky top-0">
                  <PxIcon icon={si.icon} size={14} className={si.cls} />
                  <span className="text-xs font-medium text-foreground">{col.title}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5">{col.cards.length}</span>
                </div>
                {col.cards.map((card) => (
                  <ListRow key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 p-4 h-[calc(100%-49px)] overflow-x-auto">
            {cols.map((col) => {
              const si = columnStatusIcon[col.status];
              return (
                <div
                  key={col.id}
                  className={`flex flex-col w-[320px] min-w-[320px] bg-card/30 border border-border border-t-2 ${columnAccent[col.status]}`}
                >
                  <div className="flex items-center justify-between px-4 py-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <PxIcon icon={si.icon} size={14} className={si.cls} />
                      <span className="text-sm font-medium text-foreground">{col.title}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5">
                        {col.cards.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-muted-foreground hover:text-foreground"><PxIcon icon="plus" size={14} /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground"><PxIcon icon="more-horizontal" size={14} /></button>
                    </div>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 transition-all duration-200 ${
                          snapshot.isDraggingOver ? "bg-accent/20 ring-1 ring-inset ring-foreground/10" : ""
                        }`}
                      >
                        {col.cards.map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  animationDelay: `${index * 40}ms`,
                                }}
                                className={`transition-shadow duration-150 ${
                                  snapshot.isDragging ? "opacity-90 shadow-lg shadow-background/50" : ""
                                }`}
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
              );
            })}
          </div>
        </DragDropContext>
      )}

      {selectedCard && (
        <IssueModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onReassign={handleReassign}
        />
      )}

      {showNewIssue && (
        <NewIssueModal
          onClose={() => setShowNewIssue(false)}
          onSubmit={handleNewIssue}
          projectPrefix={projectPrefix}
        />
      )}

      {showAssignAgent && (
        <AgentAssignModal
          columns={cols}
          onClose={() => setShowAssignAgent(false)}
          onAssign={handleBulkAssign}
        />
      )}
    </div>
  );
}
