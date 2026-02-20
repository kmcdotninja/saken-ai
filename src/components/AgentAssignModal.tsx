import { useState } from "react";
import { agents, type KanbanCard, type KanbanColumn } from "@/data/kanban-data";
import PxIcon from "./PxIcon";

interface Props {
  columns: KanbanColumn[];
  onClose: () => void;
  onAssign: (cardIds: string[], agentId: string) => void;
}

export default function AgentAssignModal({ columns, onClose, onAssign }: Props) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const allCards = columns.flatMap((c) => c.cards);
  const unassignedOrReassignable = allCards.filter((c) => c.assignee !== selectedAgent);

  const toggleCard = (id: string) => {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };

  const handleAssign = () => {
    if (!selectedAgent || selectedCards.size === 0) return;
    onAssign(Array.from(selectedCards), selectedAgent);
    onClose();
  };

  const agent = agents.find((a) => a.id === selectedAgent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-card border border-border w-[480px] max-h-[75vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Assign Agent to Issues</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <PxIcon icon="close" size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Step 1: Pick agent */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2">1. Select Agent</label>
            <div className="flex gap-2">
              {agents.map((a) =>
              <button
                key={a.id}
                onClick={() => {setSelectedAgent(a.id);setSelectedCards(new Set());}}
                className={`flex items-center gap-2 px-3 py-2 border text-xs ${
                selectedAgent === a.id ?
                "border-foreground/30 bg-accent text-foreground" :
                "border-border bg-muted text-muted-foreground hover:text-foreground"}`
                }>

                  <img src={a.avatar} alt={a.name} className="w-5 h-5 rounded-full object-cover" />
                  <div className="text-left">
                    <div>{a.name}</div>
                    
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Pick issues */}
          {selectedAgent &&
          <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted-foreground">2. Select Issues to Assign to {agent?.name}</label>
                <button
                onClick={() => {
                  const ids = unassignedOrReassignable.map((c) => c.id);
                  setSelectedCards((prev) => prev.size === ids.length ? new Set() : new Set(ids));
                }}
                className="text-[10px] text-muted-foreground hover:text-foreground">

                  {selectedCards.size === unassignedOrReassignable.length ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {columns.map((col) =>
              col.cards.
              filter((c) => c.assignee !== selectedAgent).
              map((card) => {
                const currentAgent = agents.find((a) => a.id === card.assignee);
                return (
                  <button
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-left border ${
                    selectedCards.has(card.id) ?
                    "border-foreground/30 bg-accent/50" :
                    "border-border bg-muted/30 hover:bg-accent/20"}`
                    }>

                          <div className={`w-4 h-4 border flex items-center justify-center ${
                    selectedCards.has(card.id) ? "border-foreground bg-foreground" : "border-muted-foreground"}`
                    }>
                            {selectedCards.has(card.id) && <PxIcon icon="check" size={10} className="text-background" />}
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground w-20 shrink-0">{card.id}</span>
                          <span className="text-xs text-foreground flex-1 truncate">{card.title}</span>
                          {currentAgent &&
                    <img src={currentAgent.avatar} alt={currentAgent.name} className="w-4 h-4 rounded-full object-cover opacity-50" />
                    }
                        </button>);

              })
              )}
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <span className="text-[11px] text-muted-foreground">
            {selectedCards.size > 0 ? `${selectedCards.size} issue${selectedCards.size > 1 ? "s" : ""} selected` : "No issues selected"}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted border border-border">
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedAgent || selectedCards.size === 0}
              className="px-4 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed">

              Assign
            </button>
          </div>
        </div>
      </div>
    </div>);

}