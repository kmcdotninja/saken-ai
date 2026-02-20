import { useState, useRef, useEffect, useCallback } from "react";
import PxIcon from "./PxIcon";

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

const agentResponses = [
  "I've reviewed the code and here's my analysis:\n\n1. The component structure looks clean\n2. I'd recommend memoizing the data transformation\n3. Adding a retry mechanism would improve reliability\n\nWant me to implement these changes?",
  "Done! I've made the following updates:\n\n- Added `React.memo` to `ProjectCard`\n- Wrapped API calls with `useCallback`\n- Implemented exponential backoff for retries\n\nAll tests passing ✓",
  "Good question. The best approach here would be to:\n\n1. Extract the logic into a custom hook\n2. Use `useSyncExternalStore` for the state management\n3. Add proper TypeScript generics for type safety\n\nI can scaffold this out for you.",
  "I found a potential performance issue. The `useEffect` dependency array is causing unnecessary re-renders. I'll optimize it by:\n\n- Moving the callback outside the effect\n- Using a ref to track the previous value\n- Adding proper cleanup\n\nFixing now...",
  "Here's a breakdown of the deployment pipeline:\n\n1. Build → TypeScript compilation + Vite bundling\n2. Test → Unit + Integration test suite\n3. Stage → Preview environment validation\n4. Deploy → Multi-region rollout with health checks\n\nEverything looks healthy ✓",
  "I've set up the error boundaries:\n\n```tsx\n<ErrorBoundary fallback={<ErrorFallback />}>\n  <Dashboard />\n</ErrorBoundary>\n```\n\nThis will catch rendering errors and display a friendly error message with a retry button.",
];

function getTimestamp(): string {
  return "just now";
}

export default function AgentPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const responseIdx = useRef(0);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, []);

  useEffect(() => scrollToBottom(), [messages, displayedContent, scrollToBottom]);

  const simulateTyping = useCallback((fullText: string) => {
    setIsTyping(true);
    setDisplayedContent("");
    let i = 0;
    const speed = 12; // ms per character

    const tick = () => {
      if (i < fullText.length) {
        // Add 1-3 chars at a time for natural feel
        const chunk = Math.min(Math.floor(Math.random() * 3) + 1, fullText.length - i);
        i += chunk;
        setDisplayedContent(fullText.slice(0, i));
        setTimeout(tick, speed + Math.random() * 15);
      } else {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: fullText, timestamp: getTimestamp() },
        ]);
        setDisplayedContent("");
      }
    };

    // Brief "thinking" delay
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

    const response = agentResponses[responseIdx.current % agentResponses.length];
    responseIdx.current++;
    simulateTyping(response);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        <span className="flex items-center gap-1.5 text-xs text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
          Active
        </span>
      </div>

      {/* Agent status */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/50 shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <PxIcon icon="cpu" size={14} />
          <span>
            {isTyping ? (
              <span className="text-foreground">Generating response...</span>
            ) : (
              <>Working on <span className="text-foreground">Dashboard.tsx</span></>
            )}
          </span>
        </div>
        <div className="mt-1.5 h-1 bg-accent overflow-hidden">
          <div
            className={`h-full bg-foreground transition-all duration-300 ${
              isTyping ? "animate-pulse w-full" : "w-3/5"
            }`}
          />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-fade-in`}>
            <div className={`max-w-[90%] px-3 py-2 text-sm ${
              msg.role === "user"
                ? "bg-foreground text-background"
                : "bg-muted text-foreground"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{msg.timestamp}</span>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && displayedContent && (
          <div className="flex flex-col items-start">
            <div className="max-w-[90%] px-3 py-2 text-sm bg-muted text-foreground">
              <p className="whitespace-pre-wrap">{displayedContent}<span className="inline-block w-1.5 h-4 bg-foreground/70 animate-pulse ml-0.5 align-text-bottom" /></p>
            </div>
          </div>
        )}

        {/* Loading dots before text starts */}
        {isTyping && !displayedContent && (
          <div className="flex flex-col items-start">
            <div className="px-3 py-2 bg-muted">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
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
