import { useState } from "react";
import {
  X, Bot, MessageSquare, Clock, CheckCircle2, Circle, ArrowUp,
  Flame, Sparkles, Send, User, ChevronDown
} from "lucide-react";
import { agents, type KanbanCard, type Agent } from "@/data/kanban-data";

interface Props {
  card: KanbanCard;
  onClose: () => void;
  onReassign: (cardId: string, agentId: string) => void;
}

const priorityConfig = {
  urgent: { icon: Flame, cls: "text-destructive", label: "Urgent" },
  high: { icon: ArrowUp, cls: "text-warning", label: "High" },
  medium: { icon: Circle, cls: "text-muted-foreground", label: "Medium" },
  low: { icon: Circle, cls: "text-muted-foreground", label: "Low" },
};

const mockComments = [
  { author: "vlad", text: "Started working on the core implementation. The OT algorithm needs careful handling of concurrent edits.", time: "2h ago" },
  { author: "ivar", text: "Updated the acceptance criteria based on user feedback from the beta group.", time: "4h ago" },
  { author: "bjorn", text: "Infrastructure is ready for the new service. Deployed staging environment.", time: "6h ago" },
];

const mockActivityLog = [
  { agent: "vlad", action: "Pushed commit", detail: "fix: resolve merge conflict in transform.ts", time: "30s ago" },
  { agent: "vlad", action: "Running tests", detail: "42/42 passing", time: "1m ago" },
  { agent: "ivar", action: "Updated task", detail: "Added subtask: Write migration guide", time: "5m ago" },
  { agent: "bjorn", action: "Health check", detail: "All regions healthy", time: "8m ago" },
];

export default function IssueModal({ card, onClose, onReassign }: Props) {
  const [showReassign, setShowReassign] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "activity">("comments");

  const agent = agents.find((a) => a.id === card.assignee);
  const prio = priorityConfig[card.priority];
  const PrioIcon = prio.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-card border border-border w-[720px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">{card.id}</span>
            <span className={`flex items-center gap-1 text-[11px] ${prio.cls}`}>
              <PrioIcon size={12} />
              {prio.label}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">{card.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.description}</p>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 mb-5 text-xs">
              {/* Assignee */}
              <div className="relative">
                <span className="text-muted-foreground block mb-1">Assignee</span>
                <button
                  onClick={() => setShowReassign(!showReassign)}
                  className="flex items-center gap-2 px-2 py-1.5 bg-muted border border-border hover:border-foreground/20"
                >
                  {agent && (
                    <>
                      <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-foreground">{agent.name}</span>
                    </>
                  )}
                  <ChevronDown size={10} className="text-muted-foreground" />
                </button>
                {showReassign && (
                  <div className="absolute top-full left-0 mt-1 bg-card border border-border z-10 w-48">
                    {agents.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { onReassign(card.id, a.id); setShowReassign(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-accent"
                      >
                        <img src={a.avatar} alt={a.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{a.name}</span>
                        <span className="text-muted-foreground ml-auto">{a.role}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Labels */}
              <div>
                <span className="text-muted-foreground block mb-1">Labels</span>
                <div className="flex gap-1">
                  {card.labels.map((l) => (
                    <span key={l} className="px-1.5 py-0.5 bg-muted border border-border text-muted-foreground">{l}</span>
                  ))}
                </div>
              </div>

              {/* Points */}
              {card.points && (
                <div>
                  <span className="text-muted-foreground block mb-1">Points</span>
                  <span className="px-2 py-1 bg-muted border border-border text-foreground">{card.points}</span>
                </div>
              )}

              {/* Subtasks */}
              {card.subtasks && (
                <div>
                  <span className="text-muted-foreground block mb-1">Subtasks</span>
                  <span className="px-2 py-1 bg-muted border border-border text-foreground">
                    {card.subtasks.done}/{card.subtasks.total}
                  </span>
                </div>
              )}
            </div>

            {/* Agent action banner */}
            {card.agentAction && agent && (
              <div className="flex items-start gap-3 px-4 py-3 bg-muted border border-border mb-5">
                <div className="relative shrink-0">
                  <img src={agent.avatar} alt={agent.name} className="w-7 h-7 rounded-full object-cover" />
                  <Bot size={10} className="absolute -bottom-0.5 -right-0.5 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-medium ${agent.color}`}>{agent.name}</span>
                  <p className="text-sm text-muted-foreground mt-0.5">{card.agentAction}</p>
                </div>
                <Sparkles size={14} className="text-foreground animate-pulse-dot shrink-0 mt-1" />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-t border-border">
            <div className="flex px-5 gap-0">
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-3 py-2 text-xs border-b-2 ${activeTab === "comments" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                <MessageSquare size={12} className="inline mr-1" />
                Comments
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-3 py-2 text-xs border-b-2 ${activeTab === "activity" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                <Bot size={12} className="inline mr-1" />
                Agent Activity
              </button>
            </div>

            <div className="px-5 py-3">
              {activeTab === "comments" ? (
                <div className="space-y-3">
                  {mockComments.map((c, i) => {
                    const commentAgent = agents.find((a) => a.id === c.author);
                    return (
                      <div key={i} className="flex gap-3">
                        {commentAgent ? (
                          <img src={commentAgent.avatar} alt={commentAgent.name} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-6 h-6 bg-accent flex items-center justify-center shrink-0 mt-0.5">
                            <User size={12} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${commentAgent?.color || "text-foreground"}`}>
                              {commentAgent?.name || c.author}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{c.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* Comment input */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-muted border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button className="px-3 py-2 bg-foreground text-background text-xs hover:bg-foreground/90">
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {mockActivityLog.map((entry, i) => {
                    const actAgent = agents.find((a) => a.id === entry.agent);
                    return (
                      <div key={i} className="flex gap-2.5 px-2 py-2 hover:bg-accent/50 transition-colors">
                        {actAgent && (
                          <img src={actAgent.avatar} alt={actAgent.name} className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            <span className={`font-medium ${actAgent?.color || ""}`}>{actAgent?.name}</span>{" "}
                            {entry.action} — <span className="text-foreground font-mono text-[11px]">{entry.detail}</span>
                          </p>
                          <span className="text-[10px] text-muted-foreground/60">{entry.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
