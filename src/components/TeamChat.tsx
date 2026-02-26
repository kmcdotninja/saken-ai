import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import PxIcon from "./PxIcon";
import { agents } from "@/data/kanban-data";
import avatarYahaya from "@/assets/avatar-yahaya.png";

interface Message {
  id: string;
  author: string;
  text: string;
  time: string;
  attachments?: { name: string; size: string; type: "image" | "file" }[];
  reactions?: { emoji: string; count: number; reacted: boolean }[];
  thread?: number;
  threadMessages?: Message[];
  pinned?: boolean;
}

interface Channel {
  id: string;
  name: string;
  icon: string;
  unread: number;
  description: string;
  category: "channels" | "direct";
  members?: string[];
}

type UserStatus = "online" | "idle" | "dnd" | "offline";

interface UserPresence {
  id: string;
  status: UserStatus;
  customStatus?: string;
}

const SUPERVISOR = {
  id: "supervisor",
  name: "Yahaya M.",
  avatar: avatarYahaya,
  role: "Supervisor",
  color: "text-foreground",
};

const defaultChannels: Channel[] = [
  { id: "general", name: "general", icon: "message", unread: 3, description: "General team discussion", category: "channels", members: ["supervisor", "vlad", "agnes", "ivar", "bjorn"] },
  { id: "dev", name: "dev-frontend", icon: "code", unread: 1, description: "Frontend development chat", category: "channels", members: ["supervisor", "vlad", "ivar"] },
  { id: "design", name: "design-system", icon: "image", unread: 0, description: "Design tokens and components", category: "channels", members: ["supervisor", "agnes"] },
  { id: "deployments", name: "deployments", icon: "cloud-upload", unread: 2, description: "Deployment logs and alerts", category: "channels", members: ["supervisor", "bjorn", "ivar"] },
  { id: "standup", name: "daily-standup", icon: "calendar", unread: 0, description: "Daily standup notes", category: "channels", members: ["supervisor", "vlad", "agnes", "ivar", "bjorn"] },
  { id: "dm-vlad", name: "Vlad", icon: "user", unread: 0, description: "Direct message with Vlad", category: "direct" },
  { id: "dm-agnes", name: "Agnes", icon: "user", unread: 1, description: "Direct message with Agnes", category: "direct" },
];

const defaultPresences: UserPresence[] = [
  { id: "supervisor", status: "online", customStatus: "Managing the team" },
  { id: "vlad", status: "online", customStatus: "Coding" },
  { id: "agnes", status: "idle", customStatus: "In a meeting" },
  { id: "ivar", status: "online" },
  { id: "bjorn", status: "dnd", customStatus: "Deploying" },
];

const threadReplies: Record<string, Message[]> = {
  g8: [
    { id: "g8-t1", author: "vlad", text: "I'll have my notes ready. Mostly about the WebSocket race conditions.", time: "9:50 AM" },
    { id: "g8-t2", author: "agnes", text: "Adding my design review feedback too.", time: "9:55 AM" },
    { id: "g8-t3", author: "bjorn", text: "I'll cover the deployment pipeline improvements.", time: "10:00 AM" },
    { id: "g8-t4", author: "supervisor", text: "Great. Let's also discuss the demo prep.", time: "10:05 AM" },
  ],
};

const initialMessages: Record<string, Message[]> = {
  general: [
    { id: "g1", author: "ivar", text: "Good morning team! Sprint 14 starts today. I've updated the backlog.", time: "9:02 AM", reactions: [{ emoji: "🚀", count: 3, reacted: false }] },
    { id: "g2", author: "vlad", text: "Morning! Starting with the WebSocket implementation.", time: "9:05 AM" },
    { id: "g3", author: "agnes", text: "Pushed the new design tokens to `design-system` branch.", time: "9:08 AM", attachments: [{ name: "design-tokens-v3.json", size: "14 KB", type: "file" }] },
    { id: "g4", author: "supervisor", text: "Great progress everyone. Let's hit the Friday demo deadline. @bjorn can you prep staging?", time: "9:12 AM", reactions: [{ emoji: "👍", count: 2, reacted: false }, { emoji: "✅", count: 1, reacted: false }] },
    { id: "g5", author: "bjorn", text: "Already on it! Staging ETA ~15 min. URL in #deployments.", time: "9:14 AM" },
    { id: "g6", author: "vlad", text: "Heads up — found a race condition in event handler. Fixing now.", time: "9:22 AM", pinned: true },
    { id: "g7", author: "agnes", text: "Updated dark mode color palette. Thoughts?", time: "9:30 AM", attachments: [{ name: "dark-mode-palette.png", size: "245 KB", type: "image" }] },
    { id: "g8", author: "ivar", text: "Reminder: retro at 3 PM. Add notes to the board beforehand.", time: "9:45 AM", thread: 4, threadMessages: threadReplies.g8 },
  ],
  dev: [
    { id: "d1", author: "vlad", text: "OT algorithm working. Current implementation:", time: "10:02 AM", attachments: [{ name: "ot-engine.ts", size: "8.2 KB", type: "file" }] },
    { id: "d2", author: "vlad", text: "```typescript\ninterface Operation {\n  type: 'insert' | 'delete' | 'retain';\n  position: number;\n  content?: string;\n}\n```", time: "10:03 AM" },
    { id: "d3", author: "supervisor", text: "Nice. Can we add unit tests for concurrent edits?", time: "10:10 AM" },
    { id: "d4", author: "vlad", text: "Writing test cases for cursor convergence now.", time: "10:12 AM", reactions: [{ emoji: "🧪", count: 1, reacted: false }] },
  ],
  design: [
    { id: "ds1", author: "agnes", text: "New 12 Button variants added.", time: "8:30 AM", attachments: [{ name: "button-variants.fig", size: "1.2 MB", type: "file" }] },
    { id: "ds2", author: "supervisor", text: "These look great. Focus states accessible?", time: "8:45 AM" },
    { id: "ds3", author: "agnes", text: "All focus rings 2px with proper contrast. WCAG AA compliant.", time: "8:47 AM", reactions: [{ emoji: "♿", count: 2, reacted: false }] },
  ],
  deployments: [
    { id: "dep1", author: "bjorn", text: "🟢 **Staging deploy successful**\nBranch: `feat/realtime-collab`\nBuild: 42s", time: "9:30 AM" },
    { id: "dep2", author: "bjorn", text: "Preview: https://staging.nexus-platform.dev\nHealth checks ✅", time: "9:31 AM", pinned: true },
    { id: "dep3", author: "bjorn", text: "⚠️ **Alert**: Memory usage prod-02 at 78%. Investigating.", time: "10:15 AM", reactions: [{ emoji: "👀", count: 3, reacted: false }] },
  ],
  standup: [
    { id: "s1", author: "vlad", text: "**Yesterday**: WebSocket handshake\n**Today**: OT algorithm\n**Blockers**: None", time: "9:00 AM" },
    { id: "s2", author: "agnes", text: "**Yesterday**: Design token audit\n**Today**: Component library\n**Blockers**: Brand color approval", time: "9:01 AM" },
    { id: "s3", author: "bjorn", text: "**Yesterday**: CI/CD optimization\n**Today**: Staging + monitoring\n**Blockers**: None", time: "9:01 AM" },
    { id: "s4", author: "ivar", text: "**Yesterday**: Sprint planning\n**Today**: Stakeholder sync\n**Blockers**: Capacity estimates", time: "9:02 AM" },
  ],
  "dm-vlad": [
    { id: "dv1", author: "supervisor", text: "Hey Vlad, how's the OT engine?", time: "10:30 AM" },
    { id: "dv2", author: "vlad", text: "Going well! Transform functions handle basic cases. Testing 3+ users next.", time: "10:32 AM" },
    { id: "dv3", author: "supervisor", text: "Let me know if you need help. We can pair on merge scenarios.", time: "10:33 AM" },
  ],
  "dm-agnes": [
    { id: "da1", author: "agnes", text: "Yahaya, need your input on onboarding flow. Review the wireframes?", time: "11:00 AM" },
    { id: "da2", author: "supervisor", text: "Sure, send them over.", time: "11:05 AM" },
    { id: "da3", author: "agnes", text: "Here you go!", time: "11:06 AM", attachments: [{ name: "onboarding-wireframes.pdf", size: "3.4 MB", type: "file" }] },
  ],
};

function getAuthorInfo(authorId: string) {
  if (authorId === "supervisor") return SUPERVISOR;
  const agent = agents.find((a) => a.id === authorId);
  return agent || { id: authorId, name: authorId, avatar: "", role: "Unknown", color: "text-muted-foreground" };
}

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("```")) return null;
    const processed = line
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 text-[11px] font-mono">$1</code>')
      .replace(/@(\w+)/g, '<span class="text-foreground font-semibold bg-accent px-0.5">@$1</span>');
    return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />;
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const statusColors: Record<UserStatus, string> = {
  online: "bg-success",
  idle: "bg-warning",
  dnd: "bg-destructive",
  offline: "bg-muted-foreground/40",
};
const statusLabels: Record<UserStatus, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

// ─── Typing Indicator ────────────────────────────────────────────
function TypingIndicator({ typingAgents }: { typingAgents: string[] }) {
  if (typingAgents.length === 0) return null;
  const names = typingAgents.map((id) => getAuthorInfo(id).name);
  const label = names.length === 1 ? `${names[0]} is typing` : `${names[0]} and ${names.length - 1} others are typing`;
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-muted-foreground">
      <div className="flex -space-x-1">
        {typingAgents.slice(0, 3).map((id) => {
          const info = getAuthorInfo(id);
          return <img key={id} src={info.avatar} alt={info.name} className="w-4 h-4 rounded-full ring-1 ring-card" />;
        })}
      </div>
      <span>{label}</span>
      <span className="flex gap-0.5">
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </span>
    </div>
  );
}

// ─── @Mention Autocomplete ──────────────────────────────────────
function MentionAutocomplete({
  query,
  onSelect,
  presences,
}: {
  query: string;
  onSelect: (name: string) => void;
  presences: UserPresence[];
}) {
  const allUsers = useMemo(() => {
    return [SUPERVISOR, ...agents].map((u) => ({
      ...u,
      status: presences.find((p) => p.id === u.id)?.status || "offline" as UserStatus,
    }));
  }, [presences]);

  const filtered = allUsers.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) || u.id.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border shadow-lg max-h-48 overflow-y-auto z-20">
      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border">
        Members matching "{query}"
      </div>
      {filtered.map((u) => (
        <button
          key={u.id}
          onClick={() => onSelect(u.id)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors text-left"
        >
          <div className="relative">
            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-card ${statusColors[u.status]}`} />
          </div>
          <span className="font-medium text-foreground">{u.name}</span>
          <span className="text-muted-foreground">{"role" in u ? (u as any).role : ""}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────────
function MessageBubble({
  msg,
  sameAuthor,
  onReaction,
  onThreadClick,
  showThread = true,
  presences,
}: {
  msg: Message;
  sameAuthor: boolean;
  onReaction: (id: string, emoji: string) => void;
  onThreadClick?: (msg: Message) => void;
  showThread?: boolean;
  presences?: UserPresence[];
}) {
  const author = getAuthorInfo(msg.author);
  const status = presences?.find((p) => p.id === msg.author)?.status || "offline";

  return (
    <div className={`group flex gap-3 py-1 px-2 -mx-2 hover:bg-accent/40 transition-colors ${sameAuthor ? "mt-0" : "mt-3"} ${msg.pinned ? "border-l-2 border-muted-foreground/40 bg-accent/20" : ""}`}>
      {sameAuthor ? (
        <div className="w-8 shrink-0" />
      ) : (
        <div className="relative shrink-0 mt-0.5">
          <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full" />
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusColors[status]}`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {!sameAuthor && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-foreground">{author.name}</span>
            {msg.author === "supervisor" ? (
              <span className="text-[9px] px-1.5 py-0.5 bg-accent text-muted-foreground font-semibold uppercase tracking-wider">Supervisor</span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 bg-accent text-muted-foreground font-medium uppercase tracking-wider">{"role" in author ? (author as any).role : "Agent"}</span>
            )}
            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
            {msg.pinned && <PxIcon icon="pin" size={10} className="text-muted-foreground" />}
          </div>
        )}
        <div className="text-sm text-foreground/90">{renderMarkdown(msg.text)}</div>

        {msg.attachments?.map((att, ai) => (
          <div key={ai} className="mt-1.5 inline-flex items-center gap-2 px-3 py-2 bg-accent/50 border border-border text-xs max-w-xs">
            <PxIcon icon={att.type === "image" ? "image" : "file"} size={14} className="text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="font-medium truncate">{att.name}</div>
              <div className="text-muted-foreground text-[10px]">{att.size}</div>
            </div>
            <button className="ml-2 text-muted-foreground hover:text-foreground"><PxIcon icon="download" size={12} /></button>
          </div>
        ))}

        {msg.reactions && msg.reactions.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            {msg.reactions.map((r, ri) => (
              <button key={ri} onClick={() => onReaction(msg.id, r.emoji)} className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs border transition-colors ${r.reacted ? "bg-accent border-foreground/20 text-foreground" : "bg-accent/50 border-border text-muted-foreground hover:border-foreground/20"}`}>
                <span>{r.emoji}</span>
                <span className="text-[10px] font-medium">{r.count}</span>
              </button>
            ))}
            <button className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"><PxIcon icon="mood-happy" size={14} /></button>
          </div>
        )}

        {showThread && msg.thread && msg.thread > 0 && (
          <button onClick={() => onThreadClick?.(msg)} className="flex items-center gap-1.5 mt-1 text-muted-foreground text-xs hover:text-foreground hover:underline">
            <PxIcon icon="message" size={12} />
            {msg.thread} replies
          </button>
        )}
      </div>

      <div className="flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => onReaction(msg.id, "👍")} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"><span className="text-xs">👍</span></button>
        {showThread && (
          <button onClick={() => onThreadClick?.(msg)} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"><PxIcon icon="message" size={12} /></button>
        )}
      </div>
    </div>
  );
}

// ─── Thread Panel ────────────────────────────────────────────────
function ThreadPanel({
  parentMsg,
  onClose,
  onReaction,
  presences,
}: {
  parentMsg: Message;
  onClose: () => void;
  onReaction: (id: string, emoji: string) => void;
  presences: UserPresence[];
}) {
  const [replies, setReplies] = useState<Message[]>(parentMsg.threadMessages || []);
  const [threadInput, setThreadInput] = useState("");
  const [typingAgents, setTypingAgents] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies]);

  const handleSendReply = () => {
    if (!threadInput.trim()) return;
    setReplies((prev) => [...prev, { id: `tr-${Date.now()}`, author: "supervisor", text: threadInput, time: nowTime() }]);
    setThreadInput("");
    const responderId = ["vlad", "agnes", "ivar", "bjorn"][Math.floor(Math.random() * 4)];
    setTypingAgents([responderId]);
    setTimeout(() => {
      setTypingAgents([]);
      const responses = ["Good point, I'll look into that.", "Agreed! Updating now.", "Was thinking the same.", "On it!"];
      setReplies((prev) => [...prev, { id: `tr-${Date.now() + 1}`, author: responderId, text: responses[Math.floor(Math.random() * responses.length)], time: nowTime() }]);
    }, 1500 + Math.random() * 2000);
  };

  const author = getAuthorInfo(parentMsg.author);

  return (
    <div className="w-80 border-l border-border flex flex-col bg-card shrink-0 animate-in slide-in-from-right-5 duration-200">
      <div className="h-12 px-3 flex items-center gap-2 border-b border-border shrink-0">
        <PxIcon icon="message" size={16} className="text-foreground" />
        <span className="font-semibold text-sm">Thread</span>
        <span className="text-xs text-muted-foreground ml-1">{replies.length} replies</span>
        <button onClick={onClose} className="ml-auto w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <PxIcon icon="close" size={14} />
        </button>
      </div>

      <div className="px-3 py-3 border-b border-border bg-accent/20">
        <div className="flex items-center gap-2 mb-1">
          <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full" />
          <span className="text-xs font-semibold">{author.name}</span>
          <span className="text-[10px] text-muted-foreground">{parentMsg.time}</span>
        </div>
        <div className="text-xs text-foreground/80 ml-8">{renderMarkdown(parentMsg.text)}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="text-[10px] text-muted-foreground text-center py-2">{replies.length} replies</div>
        {replies.map((r, i) => {
          const prev = replies[i - 1];
          return <MessageBubble key={r.id} msg={r} sameAuthor={!!prev && prev.author === r.author} onReaction={onReaction} showThread={false} presences={presences} />;
        })}
        <TypingIndicator typingAgents={typingAgents} />
        <div ref={endRef} />
      </div>

      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center gap-2 bg-accent/30 border border-border px-2 py-1.5 focus-within:border-foreground/30 transition-colors">
          <input
            type="text"
            value={threadInput}
            onChange={(e) => setThreadInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
            placeholder="Reply in thread..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground min-w-0"
          />
          <button onClick={handleSendReply} disabled={!threadInput.trim()} className="w-6 h-6 flex items-center justify-center bg-foreground text-background disabled:opacity-30 hover:bg-foreground/80 transition-colors">
            <PxIcon icon="arrow-right" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pinned Messages Panel ──────────────────────────────────────
function PinnedPanel({ messages, onClose }: { messages: Message[]; onClose: () => void }) {
  const pinned = messages.filter((m) => m.pinned);
  return (
    <div className="w-72 border-l border-border flex flex-col bg-card shrink-0 animate-in slide-in-from-right-5 duration-200">
      <div className="h-12 px-3 flex items-center gap-2 border-b border-border shrink-0">
        <PxIcon icon="pin" size={16} className="text-muted-foreground" />
        <span className="font-semibold text-sm">Pinned Messages</span>
        <button onClick={onClose} className="ml-auto w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <PxIcon icon="close" size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {pinned.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-8">No pinned messages</div>
        ) : (
          pinned.map((msg) => {
            const author = getAuthorInfo(msg.author);
            return (
              <div key={msg.id} className="py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <img src={author.avatar} alt={author.name} className="w-5 h-5 rounded-full" />
                  <span className="text-xs font-semibold">{author.name}</span>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <div className="text-xs text-foreground/80 ml-7">{renderMarkdown(msg.text)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── New Channel Modal ──────────────────────────────────────────
function NewChannelModal({
  onClose,
  onCreate,
  presences,
}: {
  onClose: () => void;
  onCreate: (name: string, desc: string, members: string[]) => void;
  presences: UserPresence[];
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(["supervisor"]);
  const allUsers = [SUPERVISOR, ...agents];

  const toggleMember = (id: string) => {
    if (id === "supervisor") return;
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim().toLowerCase().replace(/\s+/g, "-"), desc, selectedMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[420px] bg-card border border-border shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Create Channel</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><PxIcon icon="close" size={14} /></button>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Channel Name</label>
            <div className="flex items-center border border-border bg-accent/30 px-2">
              <span className="text-muted-foreground text-sm">#</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="new-channel" className="flex-1 bg-transparent text-sm px-1.5 py-2 outline-none placeholder:text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Description (optional)</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What's this channel about?" className="w-full border border-border bg-accent/30 text-sm px-2.5 py-2 outline-none placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Add Members</label>
            <div className="border border-border max-h-40 overflow-y-auto">
              {allUsers.map((u) => {
                const st = presences.find((p) => p.id === u.id)?.status || "offline";
                return (
                  <button key={u.id} onClick={() => toggleMember(u.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left ${selectedMembers.includes(u.id) ? "bg-accent" : "hover:bg-accent/50"} ${u.id === "supervisor" ? "opacity-60 cursor-default" : ""}`}>
                    <div className="relative">
                      <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full" />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-card ${statusColors[st]}`} />
                    </div>
                    <span className="font-medium">{u.name}</span>
                    {u.id === "supervisor" && <span className="text-muted-foreground">(you)</span>}
                    {selectedMembers.includes(u.id) && <PxIcon icon="check" size={12} className="ml-auto text-foreground" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()} className="px-3 py-1.5 text-xs bg-foreground text-background hover:bg-foreground/80 disabled:opacity-30 transition-colors">Create Channel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main TeamChat ──────────────────────────────────────────────
export default function TeamChat() {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [channelsCollapsed, setChannelsCollapsed] = useState(false);
  const [directCollapsed, setDirectCollapsed] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [showPinned, setShowPinned] = useState(false);
  const [threadMsg, setThreadMsg] = useState<Message | null>(null);
  const [typingAgents, setTypingAgents] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ name: string; size: string; type: "image" | "file" }[]>([]);
  const [presences, setPresences] = useState<UserPresence[]>(defaultPresences);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showNewChannel, setShowNewChannel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    defaultChannels.forEach((c) => (counts[c.id] = c.unread));
    return counts;
  });

  // Simulate random status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPresences((prev) =>
        prev.map((p) => {
          if (p.id === "supervisor") return p;
          if (Math.random() > 0.85) {
            const statuses: UserStatus[] = ["online", "idle", "dnd", "offline"];
            return { ...p, status: statuses[Math.floor(Math.random() * statuses.length)] };
          }
          return p;
        })
      );
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannel, messages]);

  useEffect(() => {
    setThreadMsg(null);
    setShowPinned(false);
  }, [activeChannel]);

  // @mention detection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    const atIdx = val.lastIndexOf("@");
    if (atIdx >= 0 && atIdx === val.length - 1 || (atIdx >= 0 && !val.substring(atIdx).includes(" "))) {
      const query = val.substring(atIdx + 1);
      setMentionQuery(query);
      setShowMentionPopup(true);
    } else {
      setShowMentionPopup(false);
    }
  };

  const handleMentionSelect = (userId: string) => {
    const atIdx = inputText.lastIndexOf("@");
    const before = inputText.substring(0, atIdx);
    setInputText(before + `@${userId} `);
    setShowMentionPopup(false);
    inputRef.current?.focus();
  };

  const handleSend = useCallback(() => {
    if (!inputText.trim() && pendingFiles.length === 0) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: "supervisor",
      text: inputText || (pendingFiles.length > 0 ? `Shared ${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""}` : ""),
      time: nowTime(),
      attachments: pendingFiles.length > 0 ? [...pendingFiles] : undefined,
    };
    setMessages((prev) => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), newMsg] }));
    setInputText("");
    setPendingFiles([]);
    setShowMentionPopup(false);

    const channelAgents = activeChannel.startsWith("dm-")
      ? [activeChannel.replace("dm-", "")]
      : ["vlad", "agnes", "ivar", "bjorn"];
    const responderId = channelAgents[Math.floor(Math.random() * channelAgents.length)];
    setTimeout(() => setTypingAgents([responderId]), 500);
    setTimeout(() => {
      setTypingAgents([]);
      const responses = [
        "Got it, I'll look into that right away.",
        "Good point. Let me check the implementation.",
        "I'll update the ticket and get back to you.",
        "Working on it now.",
        "Thanks for the heads up.",
        "Already on it! Pushing a commit shortly.",
      ];
      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), { id: `msg-${Date.now() + 1}`, author: responderId, text: responses[Math.floor(Math.random() * responses.length)], time: nowTime() }],
      }));
    }, 2000 + Math.random() * 2000);
  }, [inputText, activeChannel, pendingFiles]);

  const handleReaction = useCallback((msgId: string, emoji: string) => {
    setMessages((prev) => {
      const channelMsgs = [...(prev[activeChannel] || [])];
      const idx = channelMsgs.findIndex((m) => m.id === msgId);
      if (idx === -1) return prev;
      const msg = { ...channelMsgs[idx] };
      const reactions = [...(msg.reactions || [])];
      const ri = reactions.findIndex((r) => r.emoji === emoji);
      if (ri >= 0) {
        reactions[ri] = { ...reactions[ri], count: reactions[ri].reacted ? reactions[ri].count - 1 : reactions[ri].count + 1, reacted: !reactions[ri].reacted };
      } else {
        reactions.push({ emoji, count: 1, reacted: true });
      }
      msg.reactions = reactions;
      channelMsgs[idx] = msg;
      return { ...prev, [activeChannel]: channelMsgs };
    });
  }, [activeChannel]);

  const handleCreateChannel = (name: string, desc: string, members: string[]) => {
    const newChannel: Channel = {
      id: name,
      name,
      icon: "message",
      unread: 0,
      description: desc || `Channel #${name}`,
      category: "channels",
      members,
    };
    setChannels((prev) => [...prev, newChannel]);
    setMessages((prev) => ({ ...prev, [name]: [] }));
    setUnreadCounts((prev) => ({ ...prev, [name]: 0 }));
    setActiveChannel(name);
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) { addFiles(Array.from(e.target.files)); e.target.value = ""; }
  };
  const addFiles = (files: File[]) => {
    const mapped = files.map((f) => ({
      name: f.name, size: formatFileSize(f.size),
      type: (f.type.startsWith("image/") ? "image" : "file") as "image" | "file",
    }));
    setPendingFiles((prev) => [...prev, ...mapped]);
  };
  const removePendingFile = (index: number) => setPendingFiles((prev) => prev.filter((_, i) => i !== index));

  const currentChannel = channels.find((c) => c.id === activeChannel)!;
  const currentMessages = messages[activeChannel] || [];
  const channelList = channels.filter((c) => c.category === "channels");
  const directList = channels.filter((c) => c.category === "direct");
  const onlineCount = presences.filter((p) => p.status === "online").length;

  return (
    <div className="flex flex-1 min-h-0 bg-background">
      {/* Channel sidebar */}
      <div className="w-56 flex flex-col border-r border-border bg-card shrink-0">
        <div className="h-12 px-3 flex items-center gap-2 border-b border-border">
          <div className="w-6 h-6 bg-accent flex items-center justify-center"><PxIcon icon="message" size={14} className="text-foreground" /></div>
          <span className="font-semibold text-sm truncate">Nexus Team</span>
          <span className="ml-auto text-[10px] text-muted-foreground">{onlineCount} online</span>
        </div>

        <div className="px-2 py-2">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-accent/50 text-muted-foreground text-xs">
            <PxIcon icon="search" size={12} /><span>Search messages...</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="flex items-center justify-between px-2 py-1">
            <button onClick={() => setChannelsCollapsed(!channelsCollapsed)} className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold hover:text-foreground transition-colors">
              <PxIcon icon={channelsCollapsed ? "chevron-right" : "chevron-down"} size={10} />Channels
            </button>
            <button onClick={() => setShowNewChannel(true)} className="text-muted-foreground hover:text-foreground" title="Create channel">
              <PxIcon icon="add-box" size={14} />
            </button>
          </div>
          {!channelsCollapsed && channelList.map((ch) => (
            <button key={ch.id} onClick={() => { setActiveChannel(ch.id); setUnreadCounts((p) => ({ ...p, [ch.id]: 0 })); }}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs transition-colors group ${activeChannel === ch.id ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
              <span className="text-[11px]">#</span>
              <span className="truncate">{ch.name}</span>
              {(unreadCounts[ch.id] || 0) > 0 && <span className="ml-auto min-w-[18px] h-[18px] bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCounts[ch.id]}</span>}
            </button>
          ))}

          <div className="flex items-center justify-between px-2 py-1 mt-3">
            <button onClick={() => setDirectCollapsed(!directCollapsed)} className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold hover:text-foreground transition-colors">
              <PxIcon icon={directCollapsed ? "chevron-right" : "chevron-down"} size={10} />Direct Messages
            </button>
          </div>
          {!directCollapsed && directList.map((ch) => {
            const agentId = ch.id.replace("dm-", "");
            const agent = agents.find((a) => a.id === agentId);
            const st = presences.find((p) => p.id === agentId)?.status || "offline";
            return (
              <button key={ch.id} onClick={() => { setActiveChannel(ch.id); setUnreadCounts((p) => ({ ...p, [ch.id]: 0 })); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs transition-colors ${activeChannel === ch.id ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                <div className="relative">
                  {agent && <img src={agent.avatar} alt={agent.name} className="w-4 h-4 rounded-full" />}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-card ${statusColors[st]}`} />
                </div>
                <span className="truncate">{ch.name}</span>
                {(unreadCounts[ch.id] || 0) > 0 && <span className="ml-auto min-w-[18px] h-[18px] bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCounts[ch.id]}</span>}
              </button>
            );
          })}
        </div>

        <div className="px-2 py-2 border-t border-border flex items-center gap-2">
          <div className="relative">
            <img src={avatarYahaya} alt="Yahaya M." className="w-7 h-7 rounded-full" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusColors["online"]}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium truncate">Yahaya M.</span>
            <span className="text-[10px] text-success">Online</span>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 px-4 flex items-center gap-3 border-b border-border shrink-0">
          <span className="font-semibold text-sm">{currentChannel.category === "direct" ? "" : "#"} {currentChannel.name}</span>
          <span className="text-xs text-muted-foreground hidden sm:block">{currentChannel.description}</span>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setShowMembers(!showMembers)}
              className={`w-8 h-8 flex items-center justify-center transition-colors ${showMembers ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <PxIcon icon="users" size={16} />
            </button>
            <button onClick={() => { setShowPinned(!showPinned); if (!showPinned) setThreadMsg(null); }}
              className={`w-8 h-8 flex items-center justify-center transition-colors ${showPinned ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <PxIcon icon="pin" size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Messages column */}
          <div
            className={`flex-1 flex flex-col min-w-0 relative ${isDragOver ? "ring-2 ring-foreground/20 ring-inset" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragOver && (
              <div className="absolute inset-0 bg-accent/30 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-card border-2 border-dashed border-foreground/20 px-8 py-6 text-center">
                  <PxIcon icon="cloud-upload" size={32} className="text-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Drop files to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">Files will be shared in the channel</p>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
              {currentMessages.map((msg, i) => {
                const prevMsg = currentMessages[i - 1];
                return (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    sameAuthor={!!prevMsg && prevMsg.author === msg.author}
                    onReaction={handleReaction}
                    onThreadClick={(m) => { setThreadMsg(m); setShowPinned(false); }}
                    presences={presences}
                  />
                );
              })}
              <TypingIndicator typingAgents={typingAgents} />
              <div ref={messagesEndRef} />
            </div>

            {/* Pending files */}
            {pendingFiles.length > 0 && (
              <div className="px-4 py-2 border-t border-border bg-accent/20">
                <div className="flex flex-wrap gap-2">
                  {pendingFiles.map((f, i) => (
                    <div key={i} className="inline-flex items-center gap-1.5 px-2 py-1 bg-card border border-border text-xs">
                      <PxIcon icon={f.type === "image" ? "image" : "file"} size={12} className="text-muted-foreground" />
                      <span className="truncate max-w-[120px]">{f.name}</span>
                      <span className="text-muted-foreground text-[10px]">{f.size}</span>
                      <button onClick={() => removePendingFile(i)} className="text-muted-foreground hover:text-destructive ml-0.5"><PxIcon icon="close" size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-border relative">
              {showMentionPopup && <MentionAutocomplete query={mentionQuery} onSelect={handleMentionSelect} presences={presences} />}
              <div className="flex items-end gap-2 bg-accent/30 border border-border px-3 py-2 focus-within:border-foreground/30 transition-colors">
                <input type="file" ref={fileInputRef} multiple onChange={handleFileSelect} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-muted-foreground hover:text-foreground shrink-0 pb-0.5" title="Upload files">
                  <PxIcon icon="add-box" size={18} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !showMentionPopup) handleSend();
                    if (e.key === "Escape") setShowMentionPopup(false);
                  }}
                  placeholder={`Message ${currentChannel.category === "direct" ? currentChannel.name : "#" + currentChannel.name}`}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
                />
                <div className="flex items-center gap-1 shrink-0 pb-0.5">
                  <button onClick={() => { setInputText((prev) => prev + "@"); setShowMentionPopup(true); setMentionQuery(""); inputRef.current?.focus(); }} className="text-muted-foreground hover:text-foreground" title="Mention someone"><PxIcon icon="at" size={16} /></button>
                  <button className="text-muted-foreground hover:text-foreground"><PxIcon icon="mood-happy" size={16} /></button>
                  <button onClick={handleSend} disabled={!inputText.trim() && pendingFiles.length === 0}
                    className="w-7 h-7 flex items-center justify-center bg-foreground text-background disabled:opacity-30 hover:bg-foreground/80 transition-colors ml-1">
                    <PxIcon icon="arrow-right" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thread panel */}
          {threadMsg && <ThreadPanel parentMsg={threadMsg} onClose={() => setThreadMsg(null)} onReaction={handleReaction} presences={presences} />}

          {/* Pinned panel */}
          {showPinned && !threadMsg && <PinnedPanel messages={currentMessages} onClose={() => setShowPinned(false)} />}

          {/* Members panel */}
          {showMembers && !threadMsg && !showPinned && (
            <div className="w-52 border-l border-border px-3 py-3 overflow-y-auto shrink-0 hidden lg:block">
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Members — {agents.length + 1}</h4>

              {/* Group by status */}
              {(["online", "idle", "dnd", "offline"] as UserStatus[]).map((statusGroup) => {
                const usersInGroup = [SUPERVISOR, ...agents].filter((u) => {
                  const st = presences.find((p) => p.id === u.id)?.status || "offline";
                  return st === statusGroup;
                });
                if (usersInGroup.length === 0) return null;
                return (
                  <div key={statusGroup} className="mb-3">
                    <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">{statusLabels[statusGroup]} — {usersInGroup.length}</p>
                    {usersInGroup.map((u) => {
                      const st = presences.find((p) => p.id === u.id)?.status || "offline";
                      const customStatus = presences.find((p) => p.id === u.id)?.customStatus;
                      return (
                        <div key={u.id} className="flex items-center gap-2 py-1.5 group">
                          <div className="relative">
                            <img src={u.avatar} alt={u.name} className={`w-7 h-7 rounded-full ${st === "offline" ? "opacity-40" : ""}`} />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusColors[st]}`} />
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs font-medium truncate ${st === "offline" ? "text-muted-foreground" : "text-foreground"}`}>{u.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{customStatus || ("role" in u ? (u as any).role : "")}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Channel Modal */}
      {showNewChannel && <NewChannelModal onClose={() => setShowNewChannel(false)} onCreate={handleCreateChannel} presences={presences} />}
    </div>
  );
}
