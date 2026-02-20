import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import PxIcon from "./PxIcon";
import { agents } from "@/data/kanban-data";
import { getChatForFile, getResponsesForFile } from "@/data/agent-chat-data";

interface Message {
  role: "user" | "agent";
  agentId?: string;
  content: string;
  timestamp: string;
}

function getTimestamp(): string {
  return "just now";
}

interface Props {
  onCollapse?: () => void;
  activeFile?: string;
}

export default function AgentPanel({ onCollapse, activeFile }: Props) {
  const currentFile = activeFile || "_default";
  const fileChat = useMemo(() => getChatForFile(currentFile), [currentFile]);
  const responses = useMemo(() => getResponsesForFile(currentFile), [currentFile]);

  // Build initial messages from file-specific chat data
  const initialMessages = useMemo<Message[]>(() => {
    return fileChat.messages.map((m) => ({
      role: "agent" as const,
      agentId: m.agentId,
      content: m.content,
      timestamp: m.timestamp,
    }));
  }, [fileChat]);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingAgentId, setTypingAgentId] = useState<string | null>(null);
  const [displayedContent, setDisplayedContent] = useState("");
  const [agentConvoMessages, setAgentConvoMessages] = useState<Message[]>([]);
  const [agentConvoIdx, setAgentConvoIdx] = useState(0);
  const [agentTyping, setAgentTyping] = useState<string | null>(null); // agent id currently "typing"
  const scrollRef = useRef<HTMLDivElement>(null);
  const responseIdx = useRef(0);
  const agentConvoTimer = useRef<ReturnType<typeof setTimeout>>();

  // Reset messages when file changes
  useEffect(() => {
    setMessages(initialMessages);
    setAgentConvoMessages([]);
    setAgentConvoIdx(0);
    responseIdx.current = 0;
  }, [initialMessages]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, []);

  useEffect(() => scrollToBottom(), [messages, displayedContent, agentConvoMessages, scrollToBottom]);

  // Auto agent-to-agent conversation
  useEffect(() => {
    const convo = fileChat.agentConversation;
    if (agentConvoIdx >= convo.length) return;

    const delay = 3000 + Math.random() * 4000; // 3-7 seconds
    agentConvoTimer.current = setTimeout(() => {
      const nextMsg = convo[agentConvoIdx];
      // Show typing indicator for 1-2 seconds
      setAgentTyping(nextMsg.agentId);
      
      setTimeout(() => {
        setAgentTyping(null);
        setAgentConvoMessages((prev) => [
          ...prev,
          {
            role: "agent",
            agentId: nextMsg.agentId,
            content: nextMsg.content,
            timestamp: getTimestamp(),
          },
        ]);
        setAgentConvoIdx((i) => i + 1);
      }, 1000 + Math.random() * 1500);
    }, delay);

    return () => clearTimeout(agentConvoTimer.current);
  }, [agentConvoIdx, fileChat.agentConversation]);

  const simulateTyping = useCallback((fullText: string, agentId: string) => {
    setIsTyping(true);
    setTypingAgentId(agentId);
    setDisplayedContent("");
    let i = 0;
    const speed = 12;

    const tick = () => {
      if (i < fullText.length) {
        const chunk = Math.min(Math.floor(Math.random() * 3) + 1, fullText.length - i);
        i += chunk;
        setDisplayedContent(fullText.slice(0, i));
        setTimeout(tick, speed + Math.random() * 15);
      } else {
        setIsTyping(false);
        setTypingAgentId(null);
        setMessages((prev) => [
          ...prev,
          { role: "agent", agentId, content: fullText, timestamp: getTimestamp() },
        ]);
        setDisplayedContent("");
      }
    };

    setTimeout(tick, 600);
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: getTimestamp() },
    ]);
    setInput("");

    const response = responses[responseIdx.current % responses.length];
    responseIdx.current++;
    simulateTyping(response.content, response.agentId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getAgent = (id: string) => agents.find((a) => a.id === id);
  const allMessages = [...messages, ...agentConvoMessages];

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent flex items-center justify-center">
            <PxIcon icon="human-handsup" size={14} className="text-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
            Active
          </span>
          {onCollapse && (
            <button onClick={onCollapse} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent border border-border rounded transition-colors" title="Hide panel">
              <PxIcon icon="chevron-right" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* File context indicator */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/50 shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <PxIcon icon="file" size={14} />
          <span>
            Context: <span className="text-foreground font-mono">{currentFile === "_default" ? "Project" : currentFile}</span>
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {allMessages.map((msg, i) => {
          const agent = msg.agentId ? getAgent(msg.agentId) : null;
          return (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-fade-in`}>
              {/* Agent avatar + name */}
              {msg.role === "agent" && agent && (
                <div className="flex items-center gap-1.5 mb-1">
                  <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className={`text-xs font-medium ${agent.color}`}>{agent.name}</span>
                </div>
              )}
              <div className={`max-w-[90%] px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* User-triggered typing indicator */}
        {isTyping && displayedContent && (
          <div className="flex flex-col items-start">
            {typingAgentId && (() => {
              const a = getAgent(typingAgentId);
              return a ? (
                <div className="flex items-center gap-1.5 mb-1">
                  <img src={a.avatar} alt={a.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className={`text-xs font-medium ${a.color}`}>{a.name}</span>
                </div>
              ) : null;
            })()}
            <div className="max-w-[90%] px-3 py-2 text-sm bg-muted text-foreground">
              <p className="whitespace-pre-wrap">{displayedContent}<span className="inline-block w-1.5 h-4 bg-foreground/70 animate-pulse ml-0.5 align-text-bottom" /></p>
            </div>
          </div>
        )}

        {/* Loading dots before response text starts */}
        {isTyping && !displayedContent && typingAgentId && (() => {
          const a = getAgent(typingAgentId);
          return (
            <div className="flex flex-col items-start">
              {a && (
                <div className="flex items-center gap-1.5 mb-1">
                  <img src={a.avatar} alt={a.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className={`text-xs font-medium ${a.color}`}>{a.name}</span>
                </div>
              )}
              <div className="px-3 py-2.5 bg-muted rounded">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Agent-to-agent typing bubble */}
        {agentTyping && !isTyping && (() => {
          const a = getAgent(agentTyping);
          return a ? (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="flex items-center gap-1.5 mb-1">
                <img src={a.avatar} alt={a.name} className="w-5 h-5 rounded-full object-cover" />
                <span className={`text-xs font-medium ${a.color}`}>{a.name}</span>
                <span className="text-[10px] text-muted-foreground">is typing...</span>
              </div>
              <div className="px-3 py-2.5 bg-muted rounded">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          ) : null;
        })()}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2 bg-muted px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "Agent is responding..." : "Ask the agent..."}
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="text-foreground hover:text-foreground/80 disabled:opacity-30 transition-opacity"
          >
            <PxIcon icon="mail" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
