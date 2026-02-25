import { useState, useRef, useEffect, useCallback } from "react";
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
}

const SUPERVISOR = {
  id: "supervisor",
  name: "Yahaya M.",
  avatar: avatarYahaya,
  role: "Supervisor",
  color: "text-primary",
};

const channels: Channel[] = [
  { id: "general", name: "general", icon: "message", unread: 3, description: "General team discussion", category: "channels" },
  { id: "dev", name: "dev-frontend", icon: "code", unread: 1, description: "Frontend development chat", category: "channels" },
  { id: "design", name: "design-system", icon: "image", unread: 0, description: "Design tokens and components", category: "channels" },
  { id: "deployments", name: "deployments", icon: "cloud-upload", unread: 2, description: "Deployment logs and alerts", category: "channels" },
  { id: "standup", name: "daily-standup", icon: "calendar", unread: 0, description: "Daily standup notes", category: "channels" },
  { id: "dm-vlad", name: "Vlad", icon: "user", unread: 0, description: "Direct message with Vlad", category: "direct" },
  { id: "dm-agnes", name: "Agnes", icon: "user", unread: 1, description: "Direct message with Agnes", category: "direct" },
];

// Thread reply data for messages that have threads
const threadReplies: Record<string, Message[]> = {
  g8: [
    { id: "g8-t1", author: "vlad", text: "I'll have my notes ready. Mostly about the WebSocket race conditions.", time: "9:50 AM" },
    { id: "g8-t2", author: "agnes", text: "Adding my design review feedback too. The spacing inconsistencies need discussion.", time: "9:55 AM" },
    { id: "g8-t3", author: "bjorn", text: "I'll cover the deployment pipeline improvements we made this sprint.", time: "10:00 AM" },
    { id: "g8-t4", author: "supervisor", text: "Great. Let's also discuss the upcoming demo prep during retro.", time: "10:05 AM" },
  ],
};

const initialMessages: Record<string, Message[]> = {
  general: [
    { id: "g1", author: "ivar", text: "Good morning team! Sprint 14 starts today. I've updated the backlog with the prioritized items.", time: "9:02 AM", reactions: [{ emoji: "🚀", count: 3, reacted: false }] },
    { id: "g2", author: "vlad", text: "Morning! I'll start with the WebSocket implementation. The real-time collab feature is top priority.", time: "9:05 AM" },
    { id: "g3", author: "agnes", text: "I've pushed the new design tokens to the `design-system` branch. Please review when you get a chance.", time: "9:08 AM", attachments: [{ name: "design-tokens-v3.json", size: "14 KB", type: "file" }] },
    { id: "g4", author: "supervisor", text: "Great progress everyone. Let's make sure we hit the demo deadline on Friday. @Bjorn can you prep the staging environment?", time: "9:12 AM", reactions: [{ emoji: "👍", count: 2, reacted: false }, { emoji: "✅", count: 1, reacted: false }] },
    { id: "g5", author: "bjorn", text: "Already on it! Staging is being provisioned. ETA ~15 minutes. I'll post the URL in #deployments.", time: "9:14 AM" },
    { id: "g6", author: "vlad", text: "Quick heads up — I found a race condition in the event handler. Fixing now before it causes issues in production.", time: "9:22 AM", pinned: true },
    { id: "g7", author: "agnes", text: "Here's the updated color palette for dark mode. Let me know what you think!", time: "9:30 AM", attachments: [{ name: "dark-mode-palette.png", size: "245 KB", type: "image" }] },
    { id: "g8", author: "ivar", text: "Reminder: retro is at 3 PM today. Please add your notes to the board beforehand.", time: "9:45 AM", thread: 4, threadMessages: threadReplies.g8 },
  ],
  dev: [
    { id: "d1", author: "vlad", text: "The OT algorithm is working. Here's the current implementation:", time: "10:02 AM", attachments: [{ name: "ot-engine.ts", size: "8.2 KB", type: "file" }] },
    { id: "d2", author: "vlad", text: "```typescript\ninterface Operation {\n  type: 'insert' | 'delete' | 'retain';\n  position: number;\n  content?: string;\n  length?: number;\n}\n```", time: "10:03 AM" },
    { id: "d3", author: "supervisor", text: "Nice work Vlad. Can we add unit tests for the edge cases — concurrent edits at the same position?", time: "10:10 AM" },
    { id: "d4", author: "vlad", text: "Already on it. Writing test cases for cursor convergence scenarios.", time: "10:12 AM", reactions: [{ emoji: "🧪", count: 1, reacted: false }] },
  ],
  design: [
    { id: "ds1", author: "agnes", text: "New component library update: I've added 12 new variants for the Button component.", time: "8:30 AM", attachments: [{ name: "button-variants.fig", size: "1.2 MB", type: "file" }] },
    { id: "ds2", author: "supervisor", text: "These look great Agnes. Can we make sure the focus states are accessible?", time: "8:45 AM" },
    { id: "ds3", author: "agnes", text: "Absolutely. All focus rings use 2px outline with proper contrast ratios. WCAG AA compliant.", time: "8:47 AM", reactions: [{ emoji: "♿", count: 2, reacted: false }] },
  ],
  deployments: [
    { id: "dep1", author: "bjorn", text: "🟢 **Staging deploy successful**\nBranch: `feat/realtime-collab`\nCommit: `a3f2c1d`\nBuild time: 42s", time: "9:30 AM" },
    { id: "dep2", author: "bjorn", text: "Preview URL: https://staging.nexus-platform.dev\nAll health checks passing ✅", time: "9:31 AM", pinned: true },
    { id: "dep3", author: "bjorn", text: "⚠️ **Alert**: Memory usage on prod-02 spiked to 78%. Investigating.", time: "10:15 AM", reactions: [{ emoji: "👀", count: 3, reacted: false }] },
  ],
  standup: [
    { id: "s1", author: "vlad", text: "**Yesterday**: Completed WebSocket handshake layer\n**Today**: OT algorithm implementation\n**Blockers**: None", time: "9:00 AM" },
    { id: "s2", author: "agnes", text: "**Yesterday**: Design token audit + dark mode palette\n**Today**: Component library updates\n**Blockers**: Waiting on brand color approval", time: "9:01 AM" },
    { id: "s3", author: "bjorn", text: "**Yesterday**: CI/CD pipeline optimization\n**Today**: Staging environment + monitoring\n**Blockers**: None", time: "9:01 AM" },
    { id: "s4", author: "ivar", text: "**Yesterday**: Sprint planning + backlog grooming\n**Today**: Stakeholder sync + retro prep\n**Blockers**: Need capacity estimates from team", time: "9:02 AM" },
  ],
  "dm-vlad": [
    { id: "dv1", author: "supervisor", text: "Hey Vlad, how's the OT engine coming along?", time: "10:30 AM" },
    { id: "dv2", author: "vlad", text: "Going well! The transform functions handle all basic cases. Still need to test with 3+ concurrent users.", time: "10:32 AM" },
    { id: "dv3", author: "supervisor", text: "Let me know if you need any help. We can pair on the complex merge scenarios.", time: "10:33 AM" },
  ],
  "dm-agnes": [
    { id: "da1", author: "agnes", text: "Yahaya, I need your input on the onboarding flow. Can you review the wireframes?", time: "11:00 AM" },
    { id: "da2", author: "supervisor", text: "Sure, send them over. I'll review this afternoon.", time: "11:05 AM" },
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
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 text-[11px] font-mono rounded">$1</code>')
      .replace(/@(\w+)/g, '<span class="text-primary font-medium">@$1</span>');
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

// ─── Typing Indicator Component ──────────────────────────────────
function TypingIndicator({ typingAgents }: { typingAgents: string[] }) {
  if (typingAgents.length === 0) return null;
  const names = typingAgents.map((id) => getAuthorInfo(id).name);
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]} and ${names.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-muted-foreground">
      <div className="flex gap-0.5">
        {typingAgents.slice(0, 3).map((id) => {
          const info = getAuthorInfo(id);
          return <img key={id} src={info.avatar} alt={info.name} className="w-4 h-4 rounded-full" />;
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

// ─── Message Renderer (shared between main chat and thread) ─────
function MessageBubble({
  msg,
  sameAuthor,
  onReaction,
  onThreadClick,
  showThread = true,
}: {
  msg: Message;
  sameAuthor: boolean;
  onReaction: (id: string, emoji: string) => void;
  onThreadClick?: (msg: Message) => void;
  showThread?: boolean;
}) {
  const author = getAuthorInfo(msg.author);
  return (
    <div className={`group flex gap-3 py-1 px-2 -mx-2 rounded hover:bg-muted/30 transition-colors ${sameAuthor ? "mt-0" : "mt-3"} ${msg.pinned ? "border-l-2 border-amber-500/60 bg-amber-500/5" : ""}`}>
      {sameAuthor ? (
        <div className="w-8 shrink-0" />
      ) : (
        <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        {!sameAuthor && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-sm font-semibold ${msg.author === "supervisor" ? "text-primary" : author.color}`}>{author.name}</span>
            {msg.author === "supervisor" ? (
              <span className="text-[9px] px-1.5 py-0.5 bg-primary/15 text-primary font-semibold uppercase tracking-wider rounded">Supervisor</span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 bg-muted text-muted-foreground font-medium uppercase tracking-wider rounded">{"role" in author ? (author as any).role : "Agent"}</span>
            )}
            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
            {msg.pinned && <PxIcon icon="pin" size={10} className="text-amber-500" />}
          </div>
        )}
        <div className="text-sm text-foreground/90">{renderMarkdown(msg.text)}</div>

        {msg.attachments?.map((att, ai) => (
          <div key={ai} className="mt-1.5 inline-flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded text-xs max-w-xs">
            <PxIcon icon={att.type === "image" ? "image" : "file"} size={14} className="text-primary shrink-0" />
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
              <button key={ri} onClick={() => onReaction(msg.id, r.emoji)} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border transition-colors ${r.reacted ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:border-primary/30"}`}>
                <span>{r.emoji}</span>
                <span className="text-[10px] font-medium">{r.count}</span>
              </button>
            ))}
            <button className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"><PxIcon icon="mood-happy" size={14} /></button>
          </div>
        )}

        {showThread && msg.thread && msg.thread > 0 && (
          <button onClick={() => onThreadClick?.(msg)} className="flex items-center gap-1.5 mt-1 text-primary text-xs hover:underline">
            <PxIcon icon="message" size={12} />
            {msg.thread} replies
          </button>
        )}
      </div>

      <div className="flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => onReaction(msg.id, "👍")} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded"><span className="text-xs">👍</span></button>
        {showThread && (
          <button onClick={() => onThreadClick?.(msg)} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded"><PxIcon icon="message" size={12} /></button>
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
}: {
  parentMsg: Message;
  onClose: () => void;
  onReaction: (id: string, emoji: string) => void;
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
    const newReply: Message = { id: `tr-${Date.now()}`, author: "supervisor", text: threadInput, time: nowTime() };
    setReplies((prev) => [...prev, newReply]);
    setThreadInput("");

    // Agent typing then reply
    const channelAgents = ["vlad", "agnes", "ivar", "bjorn"];
    const responderId = channelAgents[Math.floor(Math.random() * channelAgents.length)];
    setTypingAgents([responderId]);
    setTimeout(() => {
      setTypingAgents([]);
      const responses = ["Good point, I'll look into that.", "Agreed! Let me update the implementation.", "I was thinking the same thing.", "On it! Will have an update shortly."];
      setReplies((prev) => [...prev, { id: `tr-${Date.now() + 1}`, author: responderId, text: responses[Math.floor(Math.random() * responses.length)], time: nowTime() }]);
    }, 1500 + Math.random() * 2000);
  };

  const author = getAuthorInfo(parentMsg.author);

  return (
    <div className="w-80 border-l border-border flex flex-col bg-card shrink-0 animate-in slide-in-from-right-5 duration-200">
      {/* Header */}
      <div className="h-12 px-3 flex items-center gap-2 border-b border-border shrink-0">
        <PxIcon icon="message" size={16} className="text-primary" />
        <span className="font-semibold text-sm">Thread</span>
        <span className="text-xs text-muted-foreground ml-1">{replies.length} replies</span>
        <button onClick={onClose} className="ml-auto w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
          <PxIcon icon="close" size={14} />
        </button>
      </div>

      {/* Parent message */}
      <div className="px-3 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2 mb-1">
          <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full" />
          <span className="text-xs font-semibold">{author.name}</span>
          <span className="text-[10px] text-muted-foreground">{parentMsg.time}</span>
        </div>
        <div className="text-xs text-foreground/80 ml-8">{renderMarkdown(parentMsg.text)}</div>
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="text-[10px] text-muted-foreground text-center py-2">{replies.length} replies</div>
        {replies.map((r, i) => {
          const prev = replies[i - 1];
          return <MessageBubble key={r.id} msg={r} sameAuthor={!!prev && prev.author === r.author} onReaction={onReaction} showThread={false} />;
        })}
        <TypingIndicator typingAgents={typingAgents} />
        <div ref={endRef} />
      </div>

      {/* Reply input */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center gap-2 bg-muted/30 border border-border rounded px-2 py-1.5 focus-within:border-primary/50 transition-colors">
          <input
            type="text"
            value={threadInput}
            onChange={(e) => setThreadInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
            placeholder="Reply in thread..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground min-w-0"
          />
          <button onClick={handleSendReply} disabled={!threadInput.trim()} className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded disabled:opacity-30 hover:bg-primary/80 transition-colors">
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
        <PxIcon icon="pin" size={16} className="text-amber-500" />
        <span className="font-semibold text-sm">Pinned Messages</span>
        <button onClick={onClose} className="ml-auto w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
          <PxIcon icon="close" size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {pinned.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-8">No pinned messages in this channel</div>
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

// ─── Main TeamChat ──────────────────────────────────────────────
export default function TeamChat() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    channels.forEach((c) => (counts[c.id] = c.unread));
    return counts;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannel, messages]);

  // Close thread when switching channels
  useEffect(() => {
    setThreadMsg(null);
    setShowPinned(false);
  }, [activeChannel]);

  const handleSend = useCallback(() => {
    if (!inputText.trim() && pendingFiles.length === 0) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: "supervisor",
      text: inputText || (pendingFiles.length > 0 ? `Shared ${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""}` : ""),
      time: nowTime(),
      attachments: pendingFiles.length > 0 ? [...pendingFiles] : undefined,
    };
    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setInputText("");
    setPendingFiles([]);

    // Typing indicator then agent response
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
        "Working on it now. Should be done in a few minutes.",
        "Thanks for the heads up. I'll prioritize that.",
        "Interesting approach. Let me think about it.",
        "Already on it! Will push a commit shortly.",
      ];
      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [
          ...(prev[activeChannel] || []),
          { id: `msg-${Date.now() + 1}`, author: responderId, text: responses[Math.floor(Math.random() * responses.length)], time: nowTime() },
        ],
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

  // ─── Drag & Drop ────────────────
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };
  const addFiles = (files: File[]) => {
    const mapped = files.map((f) => ({
      name: f.name,
      size: formatFileSize(f.size),
      type: (f.type.startsWith("image/") ? "image" : "file") as "image" | "file",
    }));
    setPendingFiles((prev) => [...prev, ...mapped]);
  };
  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const currentChannel = channels.find((c) => c.id === activeChannel)!;
  const currentMessages = messages[activeChannel] || [];
  const channelList = channels.filter((c) => c.category === "channels");
  const directList = channels.filter((c) => c.category === "direct");

  return (
    <div className="flex flex-1 min-h-0 bg-background">
      {/* Channel sidebar */}
      <div className="w-56 flex flex-col border-r border-border bg-card shrink-0">
        <div className="h-12 px-3 flex items-center gap-2 border-b border-border">
          <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center"><PxIcon icon="message" size={14} className="text-primary" /></div>
          <span className="font-semibold text-sm truncate">Nexus Team</span>
          <span className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--primary))" }} />
        </div>

        <div className="px-2 py-2">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded text-muted-foreground text-xs">
            <PxIcon icon="search" size={12} /><span>Search messages...</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1">
          <button onClick={() => setChannelsCollapsed(!channelsCollapsed)} className="flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold w-full hover:text-foreground transition-colors">
            <PxIcon icon={channelsCollapsed ? "chevron-right" : "chevron-down"} size={10} />Channels
          </button>
          {!channelsCollapsed && channelList.map((ch) => (
            <button key={ch.id} onClick={() => { setActiveChannel(ch.id); setUnreadCounts((p) => ({ ...p, [ch.id]: 0 })); }}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors group ${activeChannel === ch.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <span className="text-[11px]">#</span>
              <span className="truncate">{ch.name}</span>
              {(unreadCounts[ch.id] || 0) > 0 && <span className="ml-auto min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCounts[ch.id]}</span>}
            </button>
          ))}

          <button onClick={() => setDirectCollapsed(!directCollapsed)} className="flex items-center gap-1 px-2 py-1 mt-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold w-full hover:text-foreground transition-colors">
            <PxIcon icon={directCollapsed ? "chevron-right" : "chevron-down"} size={10} />Direct Messages
          </button>
          {!directCollapsed && directList.map((ch) => {
            const agentId = ch.id.replace("dm-", "");
            const agent = agents.find((a) => a.id === agentId);
            return (
              <button key={ch.id} onClick={() => { setActiveChannel(ch.id); setUnreadCounts((p) => ({ ...p, [ch.id]: 0 })); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors ${activeChannel === ch.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                {agent && <img src={agent.avatar} alt={agent.name} className="w-4 h-4 rounded-full" />}
                <span className="truncate">{ch.name}</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-foreground/40" />
                {(unreadCounts[ch.id] || 0) > 0 && <span className="min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCounts[ch.id]}</span>}
              </button>
            );
          })}
        </div>

        <div className="px-2 py-2 border-t border-border flex items-center gap-2">
          <img src={avatarYahaya} alt="Yahaya M." className="w-7 h-7 rounded-full ring-2 ring-primary/30" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium truncate">Yahaya M.</span>
            <span className="text-[10px] text-primary">Online</span>
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
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${showMembers ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <PxIcon icon="users" size={16} />
            </button>
            <button onClick={() => { setShowPinned(!showPinned); if (!showPinned) setThreadMsg(null); }}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${showPinned ? "bg-amber-500/10 text-amber-500" : "text-muted-foreground hover:text-foreground"}`}>
              <PxIcon icon="pin" size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Messages column */}
          <div
            className={`flex-1 flex flex-col min-w-0 relative ${isDragOver ? "ring-2 ring-primary ring-inset" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-primary/5 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-card border-2 border-dashed border-primary rounded-lg px-8 py-6 text-center">
                  <PxIcon icon="cloud-upload" size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-primary">Drop files to upload</p>
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
                  />
                );
              })}
              <TypingIndicator typingAgents={typingAgents} />
              <div ref={messagesEndRef} />
            </div>

            {/* Pending files */}
            {pendingFiles.length > 0 && (
              <div className="px-4 py-2 border-t border-border bg-muted/20">
                <div className="flex flex-wrap gap-2">
                  {pendingFiles.map((f, i) => (
                    <div key={i} className="inline-flex items-center gap-1.5 px-2 py-1 bg-card border border-border rounded text-xs">
                      <PxIcon icon={f.type === "image" ? "image" : "file"} size={12} className="text-primary" />
                      <span className="truncate max-w-[120px]">{f.name}</span>
                      <span className="text-muted-foreground text-[10px]">{f.size}</span>
                      <button onClick={() => removePendingFile(i)} className="text-muted-foreground hover:text-destructive ml-0.5"><PxIcon icon="close" size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-end gap-2 bg-muted/30 border border-border rounded-lg px-3 py-2 focus-within:border-primary/50 transition-colors">
                <input type="file" ref={fileInputRef} multiple onChange={handleFileSelect} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-muted-foreground hover:text-foreground shrink-0 pb-0.5" title="Upload files">
                  <PxIcon icon="add-box" size={18} />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={`Message ${currentChannel.category === "direct" ? currentChannel.name : "#" + currentChannel.name}`}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
                />
                <div className="flex items-center gap-1 shrink-0 pb-0.5">
                  <button className="text-muted-foreground hover:text-foreground"><PxIcon icon="at" size={16} /></button>
                  <button className="text-muted-foreground hover:text-foreground"><PxIcon icon="mood-happy" size={16} /></button>
                  <button onClick={handleSend} disabled={!inputText.trim() && pendingFiles.length === 0}
                    className="w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded disabled:opacity-30 hover:bg-primary/80 transition-colors ml-1">
                    <PxIcon icon="arrow-right" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thread panel */}
          {threadMsg && <ThreadPanel parentMsg={threadMsg} onClose={() => setThreadMsg(null)} onReaction={handleReaction} />}

          {/* Pinned panel */}
          {showPinned && !threadMsg && <PinnedPanel messages={currentMessages} onClose={() => setShowPinned(false)} />}

          {/* Members panel */}
          {showMembers && !threadMsg && !showPinned && (
            <div className="w-52 border-l border-border px-3 py-3 overflow-y-auto shrink-0 hidden lg:block">
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Members — {agents.length + 1}</h4>
              <div className="mb-3">
                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Supervisor</p>
                <div className="flex items-center gap-2 py-1.5">
                  <div className="relative">
                    <img src={SUPERVISOR.avatar} alt={SUPERVISOR.name} className="w-7 h-7 rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">{SUPERVISOR.name}</div>
                    <div className="text-[10px] text-muted-foreground">Supervisor</div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">AI Agents</p>
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-2 py-1.5">
                    <div className="relative">
                      <img src={agent.avatar} alt={agent.name} className="w-7 h-7 rounded-full" />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${agent.status === "working" ? "bg-primary" : agent.status === "reviewing" ? "bg-accent" : "bg-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{agent.name}</div>
                      <div className="text-[10px] text-muted-foreground">{agent.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
