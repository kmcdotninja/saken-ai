import { useState } from "react";
import { Bot, Send, Paperclip, Sparkles, X } from "lucide-react";

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    role: "agent",
    content: "I've analyzed the codebase and found 3 issues in the Dashboard component. I'll fix the type errors and optimize the data fetching pattern.",
    timestamp: "2 min ago",
  },
  {
    role: "user",
    content: "Can you also add error boundaries and loading states?",
    timestamp: "1 min ago",
  },
  {
    role: "agent",
    content: "On it! I'm implementing:\n\n1. ErrorBoundary wrapper component\n2. Skeleton loading states for ProjectCard\n3. Toast notifications for API errors\n\nUpdating 3 files...",
    timestamp: "just now",
  },
];

export default function AgentPanel() {
  const [messages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  return (
    <div className="w-80 bg-surface-1 border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <Sparkles size={14} className="text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
            Active
          </span>
        </div>
      </div>

      {/* Agent status */}
      <div className="px-4 py-2.5 border-b border-border bg-surface-2/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Bot size={14} />
          <span>Working on <span className="text-foreground">Dashboard.tsx</span></span>
        </div>
        <div className="mt-1.5 h-1 bg-surface-3 rounded-full overflow-hidden">
          <div className="h-full w-3/5 bg-primary rounded-full transition-all" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-surface-2 text-foreground"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-surface-2 rounded-lg px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="text-muted-foreground hover:text-foreground"><Paperclip size={16} /></button>
          <button className="text-primary hover:text-primary/80"><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}
