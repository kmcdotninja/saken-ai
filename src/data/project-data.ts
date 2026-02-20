import type { CodeLine, FileData } from "./file-contents";

// ─── Shared types ───────────────────────────────────────────────

export interface GitBranch {
  name: string;
  current: boolean;
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  time: string;
  status: string;
}

export interface GitChange {
  file: string;
  status: "modified" | "added" | "deleted";
}

export interface GitData {
  branches: GitBranch[];
  commits: GitCommit[];
  changes: GitChange[];
}

export interface DeploymentItem {
  id: string;
  env: "production" | "preview" | "staging";
  status: "ready" | "building" | "failed" | "queued";
  branch: string;
  commit: string;
  commitMsg: string;
  time: string;
  duration: string;
  url: string;
}

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  language?: string;
}

export interface ProjectViewData {
  git: GitData;
  deployments: DeploymentItem[];
  domainLabel: string;
  fileTree: FileNode[];
  fileContents: Record<string, FileData>;
  defaultTabs: string[];
  sprintTitle: string;
  currentBranch: string;
}

// ─── Token helpers ──────────────────────────────────────────────

const k = "keyword";
const s = "string";
const t = "type";
const f = "function";
const v = "variable";
const c = "comment";
const n = "number";

function ln(num: number, content: { text: string; cls: string }[]): CodeLine {
  return { num, content };
}

// ─── nexus-platform (default — imported from existing files) ────

// Uses existing data from file-contents.ts and the component-level defaults.

// ─── aurora-analytics ──────────────────────────────────────────

const auroraGit: GitData = {
  branches: [
    { name: "main", current: false },
    { name: "feat/realtime-charts", current: true },
    { name: "fix/metric-aggregation", current: false },
    { name: "feat/alerting-rules", current: false },
  ],
  commits: [
    { hash: "e4c1a9b", message: "feat: add real-time chart streaming with WebSocket", author: "AI Agent", time: "1m ago", status: "pushed" },
    { hash: "d2f8b3a", message: "fix: correct percentile calculation in metrics", author: "You", time: "15m ago", status: "pushed" },
    { hash: "c9e7d4f", message: "feat: implement custom alerting rule builder", author: "AI Agent", time: "1h ago", status: "pushed" },
    { hash: "b1a6c5e", message: "chore: migrate to TimescaleDB for time-series", author: "You", time: "3h ago", status: "pushed" },
    { hash: "a8d3f2c", message: "feat: add team performance dashboard", author: "AI Agent", time: "5h ago", status: "pushed" },
  ],
  changes: [
    { file: "src/components/RealtimeChart.tsx", status: "modified" },
    { file: "src/lib/metrics.ts", status: "modified" },
    { file: "src/hooks/useWebSocket.ts", status: "added" },
    { file: "src/components/AlertBuilder.tsx", status: "added" },
  ],
};

const auroraDeployments: DeploymentItem[] = [
  { id: "dpl_a1", env: "production", status: "ready", branch: "main", commit: "d2f8b3a", commitMsg: "fix: percentile calculation", time: "20 min ago", duration: "41s", url: "analytics.auroradev.io" },
  { id: "dpl_a2", env: "preview", status: "building", branch: "feat/realtime-charts", commit: "e4c1a9b", commitMsg: "feat: real-time chart streaming", time: "just now", duration: "—", url: "preview-charts.auroradev.io" },
  { id: "dpl_a3", env: "staging", status: "ready", branch: "main", commit: "c9e7d4f", commitMsg: "feat: alerting rule builder", time: "2h ago", duration: "39s", url: "staging.auroradev.io" },
  { id: "dpl_a4", env: "production", status: "ready", branch: "main", commit: "b1a6c5e", commitMsg: "chore: migrate to TimescaleDB", time: "4h ago", duration: "52s", url: "analytics.auroradev.io" },
];

const auroraFileTree: FileNode[] = [
  {
    name: "src", type: "folder", children: [
      {
        name: "components", type: "folder", children: [
          { name: "RealtimeChart.tsx", type: "file", language: "tsx" },
          { name: "MetricCard.tsx", type: "file", language: "tsx" },
          { name: "AlertBuilder.tsx", type: "file", language: "tsx" },
        ],
      },
      {
        name: "hooks", type: "folder", children: [
          { name: "useWebSocket.ts", type: "file", language: "ts" },
          { name: "useMetrics.ts", type: "file", language: "ts" },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "metrics.ts", type: "file", language: "ts" },
          { name: "timescale.ts", type: "file", language: "ts" },
        ],
      },
      { name: "App.tsx", type: "file", language: "tsx" },
      { name: "main.tsx", type: "file", language: "tsx" },
    ],
  },
  { name: "package.json", type: "file", language: "json" },
  { name: "README.md", type: "file", language: "md" },
];

const auroraFileContents: Record<string, FileData> = {
  "RealtimeChart.tsx": {
    name: "RealtimeChart.tsx",
    path: "src/components/RealtimeChart.tsx",
    language: "TypeScript React",
    lines: [
      ln(1, [{ text: "import", cls: k }, { text: " { ", cls: v }, { text: "useEffect", cls: f }, { text: ", ", cls: v }, { text: "useRef", cls: f }, { text: " } ", cls: v }, { text: "from", cls: k }, { text: " ", cls: "" }, { text: '"react"', cls: s }, { text: ";", cls: v }]),
      ln(2, [{ text: "import", cls: k }, { text: " { ", cls: v }, { text: "useWebSocket", cls: f }, { text: " } ", cls: v }, { text: "from", cls: k }, { text: " ", cls: "" }, { text: '"@/hooks/useWebSocket"', cls: s }, { text: ";", cls: v }]),
      ln(3, []),
      ln(4, [{ text: "interface", cls: k }, { text: " ", cls: "" }, { text: "ChartProps", cls: t }, { text: " {", cls: v }]),
      ln(5, [{ text: "  metricId", cls: v }, { text: ": ", cls: "" }, { text: "string", cls: t }, { text: ";", cls: v }]),
      ln(6, [{ text: "  refreshRate", cls: v }, { text: ": ", cls: "" }, { text: "number", cls: t }, { text: ";", cls: v }]),
      ln(7, [{ text: "  timeWindow", cls: v }, { text: ": ", cls: "" }, { text: '"1h"', cls: s }, { text: " | ", cls: v }, { text: '"6h"', cls: s }, { text: " | ", cls: v }, { text: '"24h"', cls: s }, { text: ";", cls: v }]),
      ln(8, [{ text: "}", cls: v }]),
      ln(9, []),
      ln(10, [{ text: "export", cls: k }, { text: " ", cls: "" }, { text: "default", cls: k }, { text: " ", cls: "" }, { text: "function", cls: k }, { text: " ", cls: "" }, { text: "RealtimeChart", cls: f }, { text: "({ metricId, refreshRate, timeWindow }: ", cls: v }, { text: "ChartProps", cls: t }, { text: ") {", cls: v }]),
      ln(11, [{ text: "  ", cls: "" }, { text: "const", cls: k }, { text: " canvasRef = ", cls: v }, { text: "useRef", cls: f }, { text: "<", cls: v }, { text: "HTMLCanvasElement", cls: t }, { text: ">(", cls: v }, { text: "null", cls: k }, { text: ");", cls: v }]),
      ln(12, [{ text: "  ", cls: "" }, { text: "const", cls: k }, { text: " { data, status } = ", cls: v }, { text: "useWebSocket", cls: f }, { text: "(metricId);", cls: v }]),
      ln(13, []),
      ln(14, [{ text: "  ", cls: "" }, { text: "useEffect", cls: f }, { text: "(() => {", cls: v }]),
      ln(15, [{ text: "    ", cls: "" }, { text: "// Render streaming data on canvas", cls: c }]),
      ln(16, [{ text: "    ", cls: "" }, { text: "const", cls: k }, { text: " ctx = canvasRef.current?.", cls: v }, { text: "getContext", cls: f }, { text: "(", cls: v }, { text: '"2d"', cls: s }, { text: ");", cls: v }]),
      ln(17, [{ text: "    ", cls: "" }, { text: "if", cls: k }, { text: " (!ctx || !data.length) ", cls: v }, { text: "return", cls: k }, { text: ";", cls: v }]),
      ln(18, [{ text: "    ", cls: "" }, { text: "drawTimeSeries", cls: f }, { text: "(ctx, data, timeWindow);", cls: v }]),
      ln(19, [{ text: "  }, [data, timeWindow]);", cls: v }]),
      ln(20, []),
      ln(21, [{ text: "  ", cls: "" }, { text: "return", cls: k }, { text: " <", cls: v }, { text: "canvas", cls: k }, { text: " ", cls: "" }, { text: "ref", cls: t }, { text: "={canvasRef} ", cls: v }, { text: "className", cls: t }, { text: "=", cls: v }, { text: '"w-full h-64"', cls: s }, { text: " />;", cls: v }]),
      ln(22, [{ text: "}", cls: v }]),
    ],
  },
  "MetricCard.tsx": {
    name: "MetricCard.tsx",
    path: "src/components/MetricCard.tsx",
    language: "TypeScript React",
    lines: [
      ln(1, [{ text: "interface", cls: k }, { text: " ", cls: "" }, { text: "MetricCardProps", cls: t }, { text: " {", cls: v }]),
      ln(2, [{ text: "  label", cls: v }, { text: ": ", cls: "" }, { text: "string", cls: t }, { text: ";", cls: v }]),
      ln(3, [{ text: "  value", cls: v }, { text: ": ", cls: "" }, { text: "number", cls: t }, { text: ";", cls: v }]),
      ln(4, [{ text: "  trend", cls: v }, { text: ": ", cls: "" }, { text: '"up"', cls: s }, { text: " | ", cls: v }, { text: '"down"', cls: s }, { text: " | ", cls: v }, { text: '"flat"', cls: s }, { text: ";", cls: v }]),
      ln(5, [{ text: "  unit", cls: v }, { text: "?: ", cls: "" }, { text: "string", cls: t }, { text: ";", cls: v }]),
      ln(6, [{ text: "}", cls: v }]),
      ln(7, []),
      ln(8, [{ text: "export", cls: k }, { text: " ", cls: "" }, { text: "default", cls: k }, { text: " ", cls: "" }, { text: "function", cls: k }, { text: " ", cls: "" }, { text: "MetricCard", cls: f }, { text: "({ label, value, trend, unit }: ", cls: v }, { text: "MetricCardProps", cls: t }, { text: ") {", cls: v }]),
      ln(9, [{ text: "  ", cls: "" }, { text: "return", cls: k }, { text: " (", cls: v }]),
      ln(10, [{ text: "    <", cls: v }, { text: "div", cls: k }, { text: " ", cls: "" }, { text: "className", cls: t }, { text: "=", cls: v }, { text: '"p-4 border rounded-lg"', cls: s }, { text: ">", cls: v }]),
      ln(11, [{ text: "      <", cls: v }, { text: "span", cls: k }, { text: " ", cls: "" }, { text: "className", cls: t }, { text: "=", cls: v }, { text: '"text-sm text-muted"', cls: s }, { text: ">{label}</", cls: v }, { text: "span", cls: k }, { text: ">", cls: v }]),
      ln(12, [{ text: "      <", cls: v }, { text: "h3", cls: k }, { text: ">{value}{unit}</", cls: v }, { text: "h3", cls: k }, { text: ">", cls: v }]),
      ln(13, [{ text: "    </", cls: v }, { text: "div", cls: k }, { text: ">", cls: v }]),
      ln(14, [{ text: "  );", cls: v }]),
      ln(15, [{ text: "}", cls: v }]),
    ],
  },
  "metrics.ts": {
    name: "metrics.ts",
    path: "src/lib/metrics.ts",
    language: "TypeScript",
    lines: [
      ln(1, [{ text: "// Metrics aggregation and calculation engine", cls: c }]),
      ln(2, []),
      ln(3, [{ text: "export", cls: k }, { text: " ", cls: "" }, { text: "interface", cls: k }, { text: " ", cls: "" }, { text: "DataPoint", cls: t }, { text: " {", cls: v }]),
      ln(4, [{ text: "  timestamp", cls: v }, { text: ": ", cls: "" }, { text: "number", cls: t }, { text: ";", cls: v }]),
      ln(5, [{ text: "  value", cls: v }, { text: ": ", cls: "" }, { text: "number", cls: t }, { text: ";", cls: v }]),
      ln(6, [{ text: "}", cls: v }]),
      ln(7, []),
      ln(8, [{ text: "export", cls: k }, { text: " ", cls: "" }, { text: "function", cls: k }, { text: " ", cls: "" }, { text: "percentile", cls: f }, { text: "(data: ", cls: v }, { text: "number", cls: t }, { text: "[], p: ", cls: v }, { text: "number", cls: t }, { text: "): ", cls: v }, { text: "number", cls: t }, { text: " {", cls: v }]),
      ln(9, [{ text: "  ", cls: "" }, { text: "const", cls: k }, { text: " sorted = [...data].", cls: v }, { text: "sort", cls: f }, { text: "((a, b) => a - b);", cls: v }]),
      ln(10, [{ text: "  ", cls: "" }, { text: "const", cls: k }, { text: " idx = ", cls: v }, { text: "Math", cls: t }, { text: ".", cls: "" }, { text: "ceil", cls: f }, { text: "((p / ", cls: v }, { text: "100", cls: n }, { text: ") * sorted.length) - ", cls: v }, { text: "1", cls: n }, { text: ";", cls: v }]),
      ln(11, [{ text: "  ", cls: "" }, { text: "return", cls: k }, { text: " sorted[", cls: v }, { text: "Math", cls: t }, { text: ".", cls: "" }, { text: "max", cls: f }, { text: "(", cls: v }, { text: "0", cls: n }, { text: ", idx)];", cls: v }]),
      ln(12, [{ text: "}", cls: v }]),
    ],
  },
};

// ─── phantom-api ───────────────────────────────────────────────

const phantomGit: GitData = {
  branches: [
    { name: "main", current: false },
    { name: "feat/rate-limiter-v2", current: true },
    { name: "fix/cache-invalidation", current: false },
  ],
  commits: [
    { hash: "f1d2e3a", message: "feat: sliding window rate limiter with Redis", author: "AI Agent", time: "3m ago", status: "pushed" },
    { hash: "a9b8c7d", message: "perf: optimize request routing with trie lookup", author: "You", time: "30m ago", status: "pushed" },
    { hash: "e6f5d4c", message: "fix: cache invalidation race condition", author: "AI Agent", time: "2h ago", status: "pushed" },
    { hash: "b3c2a1f", message: "feat: add request/response transformation middleware", author: "You", time: "4h ago", status: "pushed" },
    { hash: "d0e9f8a", message: "chore: upgrade to Go 1.22", author: "You", time: "1d ago", status: "pushed" },
  ],
  changes: [
    { file: "src/middleware/rate-limiter.go", status: "modified" },
    { file: "src/router/trie.go", status: "modified" },
    { file: "src/middleware/transform.go", status: "added" },
  ],
};

const phantomDeployments: DeploymentItem[] = [
  { id: "dpl_p1", env: "production", status: "ready", branch: "main", commit: "a9b8c7d", commitMsg: "perf: optimize request routing", time: "35 min ago", duration: "18s", url: "api.phantom-gw.io" },
  { id: "dpl_p2", env: "preview", status: "building", branch: "feat/rate-limiter-v2", commit: "f1d2e3a", commitMsg: "feat: sliding window rate limiter", time: "just now", duration: "—", url: "preview-ratelimit.phantom-gw.io" },
  { id: "dpl_p3", env: "staging", status: "ready", branch: "main", commit: "e6f5d4c", commitMsg: "fix: cache invalidation race", time: "3h ago", duration: "15s", url: "staging.phantom-gw.io" },
  { id: "dpl_p4", env: "production", status: "ready", branch: "main", commit: "b3c2a1f", commitMsg: "feat: request transformation", time: "5h ago", duration: "19s", url: "api.phantom-gw.io" },
  { id: "dpl_p5", env: "production", status: "failed", branch: "main", commit: "d0e9f8a", commitMsg: "chore: upgrade to Go 1.22", time: "1d ago", duration: "22s", url: "" },
];

const phantomFileTree: FileNode[] = [
  {
    name: "src", type: "folder", children: [
      {
        name: "middleware", type: "folder", children: [
          { name: "rate-limiter.go", type: "file", language: "go" },
          { name: "auth.go", type: "file", language: "go" },
          { name: "transform.go", type: "file", language: "go" },
          { name: "cache.go", type: "file", language: "go" },
        ],
      },
      {
        name: "router", type: "folder", children: [
          { name: "trie.go", type: "file", language: "go" },
          { name: "handler.go", type: "file", language: "go" },
        ],
      },
      { name: "main.go", type: "file", language: "go" },
      { name: "config.go", type: "file", language: "go" },
    ],
  },
  { name: "go.mod", type: "file", language: "mod" },
  { name: "Dockerfile", type: "file", language: "docker" },
  { name: "README.md", type: "file", language: "md" },
];

const phantomFileContents: Record<string, FileData> = {
  "rate-limiter.go": {
    name: "rate-limiter.go",
    path: "src/middleware/rate-limiter.go",
    language: "Go",
    lines: [
      ln(1, [{ text: "package", cls: k }, { text: " middleware", cls: v }]),
      ln(2, []),
      ln(3, [{ text: "import", cls: k }, { text: " (", cls: v }]),
      ln(4, [{ text: '  "context"', cls: s }]),
      ln(5, [{ text: '  "time"', cls: s }]),
      ln(6, [{ text: '  "github.com/redis/go-redis/v9"', cls: s }]),
      ln(7, [{ text: ")", cls: v }]),
      ln(8, []),
      ln(9, [{ text: "type", cls: k }, { text: " ", cls: "" }, { text: "SlidingWindowLimiter", cls: t }, { text: " ", cls: "" }, { text: "struct", cls: k }, { text: " {", cls: v }]),
      ln(10, [{ text: "  client  *redis.", cls: v }, { text: "Client", cls: t }]),
      ln(11, [{ text: "  window  time.", cls: v }, { text: "Duration", cls: t }]),
      ln(12, [{ text: "  maxReqs ", cls: v }, { text: "int64", cls: t }]),
      ln(13, [{ text: "}", cls: v }]),
      ln(14, []),
      ln(15, [{ text: "func", cls: k }, { text: " (l *", cls: v }, { text: "SlidingWindowLimiter", cls: t }, { text: ") ", cls: v }, { text: "Allow", cls: f }, { text: "(ctx ", cls: v }, { text: "context.Context", cls: t }, { text: ", key ", cls: v }, { text: "string", cls: t }, { text: ") ", cls: v }, { text: "bool", cls: t }, { text: " {", cls: v }]),
      ln(16, [{ text: "  now := time.", cls: v }, { text: "Now", cls: f }, { text: "().", cls: v }, { text: "UnixNano", cls: f }, { text: "()", cls: v }]),
      ln(17, [{ text: "  windowStart := now - l.window.", cls: v }, { text: "Nanoseconds", cls: f }, { text: "()", cls: v }]),
      ln(18, [{ text: "  ", cls: "" }, { text: "// Remove expired entries and count", cls: c }]),
      ln(19, [{ text: "  pipe := l.client.", cls: v }, { text: "Pipeline", cls: f }, { text: "()", cls: v }]),
      ln(20, [{ text: "  pipe.", cls: v }, { text: "ZRemRangeByScore", cls: f }, { text: "(ctx, key, ", cls: v }, { text: '"0"', cls: s }, { text: ", fmt.", cls: v }, { text: "Sprint", cls: f }, { text: "(windowStart))", cls: v }]),
      ln(21, [{ text: "  count := pipe.", cls: v }, { text: "ZCard", cls: f }, { text: "(ctx, key)", cls: v }]),
      ln(22, [{ text: "  pipe.", cls: v }, { text: "Exec", cls: f }, { text: "(ctx)", cls: v }]),
      ln(23, [{ text: "  ", cls: "" }, { text: "return", cls: k }, { text: " count.", cls: v }, { text: "Val", cls: f }, { text: "() < l.maxReqs", cls: v }]),
      ln(24, [{ text: "}", cls: v }]),
    ],
  },
  "trie.go": {
    name: "trie.go",
    path: "src/router/trie.go",
    language: "Go",
    lines: [
      ln(1, [{ text: "package", cls: k }, { text: " router", cls: v }]),
      ln(2, []),
      ln(3, [{ text: "type", cls: k }, { text: " ", cls: "" }, { text: "TrieNode", cls: t }, { text: " ", cls: "" }, { text: "struct", cls: k }, { text: " {", cls: v }]),
      ln(4, [{ text: "  children ", cls: v }, { text: "map", cls: k }, { text: "[", cls: v }, { text: "string", cls: t }, { text: "]*", cls: v }, { text: "TrieNode", cls: t }]),
      ln(5, [{ text: "  handler  ", cls: v }, { text: "Handler", cls: t }]),
      ln(6, [{ text: "  param    ", cls: v }, { text: "string", cls: t }]),
      ln(7, [{ text: "}", cls: v }]),
      ln(8, []),
      ln(9, [{ text: "func", cls: k }, { text: " ", cls: "" }, { text: "NewTrie", cls: f }, { text: "() *", cls: v }, { text: "TrieNode", cls: t }, { text: " {", cls: v }]),
      ln(10, [{ text: "  ", cls: "" }, { text: "return", cls: k }, { text: " &", cls: v }, { text: "TrieNode", cls: t }, { text: "{children: ", cls: v }, { text: "make", cls: f }, { text: "(", cls: v }, { text: "map", cls: k }, { text: "[", cls: v }, { text: "string", cls: t }, { text: "]*", cls: v }, { text: "TrieNode", cls: t }, { text: ")}", cls: v }]),
      ln(11, [{ text: "}", cls: v }]),
    ],
  },
  "main.go": {
    name: "main.go",
    path: "src/main.go",
    language: "Go",
    lines: [
      ln(1, [{ text: "package", cls: k }, { text: " main", cls: v }]),
      ln(2, []),
      ln(3, [{ text: "import", cls: k }, { text: " (", cls: v }]),
      ln(4, [{ text: '  "log"', cls: s }]),
      ln(5, [{ text: '  "net/http"', cls: s }]),
      ln(6, [{ text: '  "phantom/router"', cls: s }]),
      ln(7, [{ text: '  "phantom/middleware"', cls: s }]),
      ln(8, [{ text: ")", cls: v }]),
      ln(9, []),
      ln(10, [{ text: "func", cls: k }, { text: " ", cls: "" }, { text: "main", cls: f }, { text: "() {", cls: v }]),
      ln(11, [{ text: "  r := router.", cls: v }, { text: "New", cls: f }, { text: "()", cls: v }]),
      ln(12, [{ text: "  r.", cls: v }, { text: "Use", cls: f }, { text: "(middleware.", cls: v }, { text: "RateLimit", cls: f }, { text: "())", cls: v }]),
      ln(13, [{ text: "  r.", cls: v }, { text: "Use", cls: f }, { text: "(middleware.", cls: v }, { text: "Cache", cls: f }, { text: "())", cls: v }]),
      ln(14, [{ text: "  r.", cls: v }, { text: "Use", cls: f }, { text: "(middleware.", cls: v }, { text: "Auth", cls: f }, { text: "())", cls: v }]),
      ln(15, []),
      ln(16, [{ text: "  log.", cls: v }, { text: "Fatal", cls: f }, { text: "(http.", cls: v }, { text: "ListenAndServe", cls: f }, { text: "(", cls: v }, { text: '":8080"', cls: s }, { text: ", r))", cls: v }]),
      ln(17, [{ text: "}", cls: v }]),
    ],
  },
};

// ─── forge-design ──────────────────────────────────────────────

const forgeGit: GitData = {
  branches: [
    { name: "main", current: false },
    { name: "feat/color-tokens-v2", current: true },
    { name: "fix/button-a11y", current: false },
  ],
  commits: [
    { hash: "c2d3e4f", message: "feat: add semantic color tokens with dark mode", author: "Agnes", time: "5m ago", status: "pushed" },
    { hash: "b1a2c3d", message: "fix: improve button focus ring contrast", author: "You", time: "45m ago", status: "pushed" },
    { hash: "a0b1c2d", message: "docs: update component usage examples", author: "Agnes", time: "2h ago", status: "pushed" },
    { hash: "f9e8d7c", message: "feat: add new avatar component variants", author: "You", time: "6h ago", status: "pushed" },
    { hash: "e8d7c6b", message: "chore: sync Figma tokens with codebase", author: "Agnes", time: "1d ago", status: "pushed" },
  ],
  changes: [
    { file: "src/tokens/colors.ts", status: "modified" },
    { file: "src/components/Button.tsx", status: "modified" },
    { file: "src/tokens/dark-mode.ts", status: "added" },
  ],
};

const forgeDeployments: DeploymentItem[] = [
  { id: "dpl_f1", env: "production", status: "ready", branch: "main", commit: "b1a2c3d", commitMsg: "fix: button focus ring contrast", time: "50 min ago", duration: "24s", url: "forge.designsystem.dev" },
  { id: "dpl_f2", env: "preview", status: "ready", branch: "feat/color-tokens-v2", commit: "c2d3e4f", commitMsg: "feat: semantic color tokens", time: "10 min ago", duration: "22s", url: "preview-tokens.designsystem.dev" },
  { id: "dpl_f3", env: "staging", status: "ready", branch: "main", commit: "a0b1c2d", commitMsg: "docs: component usage examples", time: "3h ago", duration: "21s", url: "staging.designsystem.dev" },
];

const forgeFileTree: FileNode[] = [
  {
    name: "src", type: "folder", children: [
      {
        name: "components", type: "folder", children: [
          { name: "Button.tsx", type: "file", language: "tsx" },
          { name: "Avatar.tsx", type: "file", language: "tsx" },
          { name: "Input.tsx", type: "file", language: "tsx" },
          { name: "Card.tsx", type: "file", language: "tsx" },
        ],
      },
      {
        name: "tokens", type: "folder", children: [
          { name: "colors.ts", type: "file", language: "ts" },
          { name: "spacing.ts", type: "file", language: "ts" },
          { name: "typography.ts", type: "file", language: "ts" },
          { name: "dark-mode.ts", type: "file", language: "ts" },
        ],
      },
      { name: "index.ts", type: "file", language: "ts" },
    ],
  },
  {
    name: "docs", type: "folder", children: [
      { name: "getting-started.md", type: "file", language: "md" },
      { name: "components.md", type: "file", language: "md" },
    ],
  },
  { name: "package.json", type: "file", language: "json" },
];

const forgeFileContents: Record<string, FileData> = {
  "Button.tsx": {
    name: "Button.tsx",
    path: "src/components/Button.tsx",
    language: "TypeScript React",
    lines: [
      ln(1, [{ text: "import", cls: k }, { text: " { ", cls: v }, { text: "cva", cls: f }, { text: ", ", cls: v }, { text: "type", cls: k }, { text: " ", cls: "" }, { text: "VariantProps", cls: t }, { text: " } ", cls: v }, { text: "from", cls: k }, { text: " ", cls: "" }, { text: '"class-variance-authority"', cls: s }, { text: ";", cls: v }]),
      ln(2, []),
      ln(3, [{ text: "const", cls: k }, { text: " buttonVariants = ", cls: v }, { text: "cva", cls: f }, { text: "(", cls: v }]),
      ln(4, [{ text: '  "inline-flex items-center justify-center font-medium transition-all"', cls: s }, { text: ",", cls: v }]),
      ln(5, [{ text: "  {", cls: v }]),
      ln(6, [{ text: "    variants: {", cls: v }]),
      ln(7, [{ text: "      variant: {", cls: v }]),
      ln(8, [{ text: "        primary: ", cls: v }, { text: '"bg-primary text-primary-foreground hover:bg-primary/90"', cls: s }, { text: ",", cls: v }]),
      ln(9, [{ text: "        outline: ", cls: v }, { text: '"border border-input bg-transparent hover:bg-accent"', cls: s }, { text: ",", cls: v }]),
      ln(10, [{ text: "        ghost: ", cls: v }, { text: '"hover:bg-accent hover:text-accent-foreground"', cls: s }, { text: ",", cls: v }]),
      ln(11, [{ text: "      },", cls: v }]),
      ln(12, [{ text: "      size: {", cls: v }]),
      ln(13, [{ text: "        sm: ", cls: v }, { text: '"h-8 px-3 text-xs"', cls: s }, { text: ",", cls: v }]),
      ln(14, [{ text: "        md: ", cls: v }, { text: '"h-10 px-4 text-sm"', cls: s }, { text: ",", cls: v }]),
      ln(15, [{ text: "        lg: ", cls: v }, { text: '"h-12 px-6 text-base"', cls: s }, { text: ",", cls: v }]),
      ln(16, [{ text: "      },", cls: v }]),
      ln(17, [{ text: "    },", cls: v }]),
      ln(18, [{ text: "  }", cls: v }]),
      ln(19, [{ text: ");", cls: v }]),
    ],
  },
  "colors.ts": {
    name: "colors.ts",
    path: "src/tokens/colors.ts",
    language: "TypeScript",
    lines: [
      ln(1, [{ text: "// Forge Design System — Color Tokens", cls: c }]),
      ln(2, []),
      ln(3, [{ text: "export", cls: k }, { text: " ", cls: "" }, { text: "const", cls: k }, { text: " colors = {", cls: v }]),
      ln(4, [{ text: "  neutral: {", cls: v }]),
      ln(5, [{ text: "    ", cls: "" }, { text: "50", cls: n }, { text: ": ", cls: v }, { text: '"#fafafa"', cls: s }, { text: ",", cls: v }]),
      ln(6, [{ text: "    ", cls: "" }, { text: "900", cls: n }, { text: ": ", cls: v }, { text: '"#0a0a0a"', cls: s }, { text: ",", cls: v }]),
      ln(7, [{ text: "  },", cls: v }]),
      ln(8, [{ text: "  primary: {", cls: v }]),
      ln(9, [{ text: "    base: ", cls: v }, { text: '"hsl(220, 90%, 56%)"', cls: s }, { text: ",", cls: v }]),
      ln(10, [{ text: "    hover: ", cls: v }, { text: '"hsl(220, 90%, 48%)"', cls: s }, { text: ",", cls: v }]),
      ln(11, [{ text: "  },", cls: v }]),
      ln(12, [{ text: "  semantic: {", cls: v }]),
      ln(13, [{ text: "    success: ", cls: v }, { text: '"hsl(142, 71%, 45%)"', cls: s }, { text: ",", cls: v }]),
      ln(14, [{ text: "    warning: ", cls: v }, { text: '"hsl(38, 92%, 50%)"', cls: s }, { text: ",", cls: v }]),
      ln(15, [{ text: "    error: ", cls: v }, { text: '"hsl(0, 84%, 60%)"', cls: s }, { text: ",", cls: v }]),
      ln(16, [{ text: "  },", cls: v }]),
      ln(17, [{ text: "} ", cls: v }, { text: "as const", cls: k }, { text: ";", cls: v }]),
    ],
  },
  "Avatar.tsx": {
    name: "Avatar.tsx",
    path: "src/components/Avatar.tsx",
    language: "TypeScript React",
    lines: [
      ln(1, [{ text: "interface", cls: k }, { text: " ", cls: "" }, { text: "AvatarProps", cls: t }, { text: " {", cls: v }]),
      ln(2, [{ text: "  src", cls: v }, { text: ": ", cls: "" }, { text: "string", cls: t }, { text: ";", cls: v }]),
      ln(3, [{ text: "  alt", cls: v }, { text: ": ", cls: "" }, { text: "string", cls: t }, { text: ";", cls: v }]),
      ln(4, [{ text: "  size", cls: v }, { text: "?: ", cls: "" }, { text: '"sm"', cls: s }, { text: " | ", cls: v }, { text: '"md"', cls: s }, { text: " | ", cls: v }, { text: '"lg"', cls: s }, { text: ";", cls: v }]),
      ln(5, [{ text: "  status", cls: v }, { text: "?: ", cls: "" }, { text: '"online"', cls: s }, { text: " | ", cls: v }, { text: '"offline"', cls: s }, { text: ";", cls: v }]),
      ln(6, [{ text: "}", cls: v }]),
      ln(7, []),
      ln(8, [{ text: "export", cls: k }, { text: " ", cls: "" }, { text: "default", cls: k }, { text: " ", cls: "" }, { text: "function", cls: k }, { text: " ", cls: "" }, { text: "Avatar", cls: f }, { text: "({ src, alt, size = ", cls: v }, { text: '"md"', cls: s }, { text: " }: ", cls: v }, { text: "AvatarProps", cls: t }, { text: ") {", cls: v }]),
      ln(9, [{ text: "  ", cls: "" }, { text: "const", cls: k }, { text: " sizes = { sm: ", cls: v }, { text: '"w-6 h-6"', cls: s }, { text: ", md: ", cls: v }, { text: '"w-8 h-8"', cls: s }, { text: ", lg: ", cls: v }, { text: '"w-12 h-12"', cls: s }, { text: " };", cls: v }]),
      ln(10, [{ text: "  ", cls: "" }, { text: "return", cls: k }, { text: " <", cls: v }, { text: "img", cls: k }, { text: " src={src} alt={alt} ", cls: v }, { text: "className", cls: t }, { text: "={sizes[size]} />;", cls: v }]),
      ln(11, [{ text: "}", cls: v }]),
    ],
  },
};

// ─── sentinel-monitor ──────────────────────────────────────────

const sentinelGit: GitData = {
  branches: [
    { name: "main", current: false },
    { name: "feat/anomaly-detection", current: true },
    { name: "fix/alert-dedup", current: false },
    { name: "feat/incident-runbooks", current: false },
  ],
  commits: [
    { hash: "a1b2c3d", message: "feat: ML-based anomaly detection for CPU spikes", author: "AI Agent", time: "8m ago", status: "pushed" },
    { hash: "d4e5f6a", message: "fix: deduplicate alerts within 5-minute window", author: "You", time: "1h ago", status: "pushed" },
    { hash: "b7c8d9e", message: "feat: automated incident runbook execution", author: "AI Agent", time: "3h ago", status: "pushed" },
    { hash: "f0a1b2c", message: "refactor: migrate to OpenTelemetry collector", author: "You", time: "6h ago", status: "pushed" },
    { hash: "c3d4e5f", message: "feat: add PagerDuty integration", author: "You", time: "1d ago", status: "pushed" },
  ],
  changes: [
    { file: "src/detectors/anomaly.py", status: "modified" },
    { file: "src/alerts/dedup.py", status: "modified" },
    { file: "src/runbooks/executor.py", status: "added" },
    { file: "src/integrations/pagerduty.py", status: "added" },
  ],
};

const sentinelDeployments: DeploymentItem[] = [
  { id: "dpl_s1", env: "production", status: "ready", branch: "main", commit: "d4e5f6a", commitMsg: "fix: alert deduplication", time: "1h ago", duration: "45s", url: "sentinel.monitorops.io" },
  { id: "dpl_s2", env: "preview", status: "building", branch: "feat/anomaly-detection", commit: "a1b2c3d", commitMsg: "feat: ML anomaly detection", time: "just now", duration: "—", url: "preview-anomaly.monitorops.io" },
  { id: "dpl_s3", env: "staging", status: "ready", branch: "main", commit: "b7c8d9e", commitMsg: "feat: incident runbook execution", time: "4h ago", duration: "51s", url: "staging.monitorops.io" },
  { id: "dpl_s4", env: "production", status: "failed", branch: "main", commit: "f0a1b2c", commitMsg: "refactor: OpenTelemetry migration", time: "7h ago", duration: "1m 12s", url: "" },
  { id: "dpl_s5", env: "production", status: "ready", branch: "main", commit: "c3d4e5f", commitMsg: "feat: PagerDuty integration", time: "1d ago", duration: "39s", url: "sentinel.monitorops.io" },
];

const sentinelFileTree: FileNode[] = [
  {
    name: "src", type: "folder", children: [
      {
        name: "detectors", type: "folder", children: [
          { name: "anomaly.py", type: "file", language: "py" },
          { name: "threshold.py", type: "file", language: "py" },
          { name: "composite.py", type: "file", language: "py" },
        ],
      },
      {
        name: "alerts", type: "folder", children: [
          { name: "dedup.py", type: "file", language: "py" },
          { name: "router.py", type: "file", language: "py" },
        ],
      },
      {
        name: "runbooks", type: "folder", children: [
          { name: "executor.py", type: "file", language: "py" },
          { name: "templates.py", type: "file", language: "py" },
        ],
      },
      {
        name: "integrations", type: "folder", children: [
          { name: "pagerduty.py", type: "file", language: "py" },
          { name: "slack.py", type: "file", language: "py" },
          { name: "otel.py", type: "file", language: "py" },
        ],
      },
      { name: "main.py", type: "file", language: "py" },
      { name: "config.py", type: "file", language: "py" },
    ],
  },
  { name: "requirements.txt", type: "file", language: "txt" },
  { name: "Dockerfile", type: "file", language: "docker" },
  { name: "README.md", type: "file", language: "md" },
];

const sentinelFileContents: Record<string, FileData> = {
  "anomaly.py": {
    name: "anomaly.py",
    path: "src/detectors/anomaly.py",
    language: "Python",
    lines: [
      ln(1, [{ text: "import", cls: k }, { text: " numpy ", cls: v }, { text: "as", cls: k }, { text: " np", cls: v }]),
      ln(2, [{ text: "from", cls: k }, { text: " sklearn.ensemble ", cls: v }, { text: "import", cls: k }, { text: " IsolationForest", cls: t }]),
      ln(3, []),
      ln(4, [{ text: "class", cls: k }, { text: " ", cls: "" }, { text: "AnomalyDetector", cls: t }, { text: ":", cls: v }]),
      ln(5, [{ text: '    """ML-based anomaly detection for infrastructure metrics."""', cls: c }]),
      ln(6, []),
      ln(7, [{ text: "    ", cls: "" }, { text: "def", cls: k }, { text: " ", cls: "" }, { text: "__init__", cls: f }, { text: "(self, contamination=", cls: v }, { text: "0.05", cls: n }, { text: ", window_size=", cls: v }, { text: "60", cls: n }, { text: "):", cls: v }]),
      ln(8, [{ text: "        self.model = ", cls: v }, { text: "IsolationForest", cls: t }, { text: "(contamination=contamination)", cls: v }]),
      ln(9, [{ text: "        self.window_size = window_size", cls: v }]),
      ln(10, [{ text: "        self.history = []", cls: v }]),
      ln(11, []),
      ln(12, [{ text: "    ", cls: "" }, { text: "def", cls: k }, { text: " ", cls: "" }, { text: "detect", cls: f }, { text: "(self, metrics: ", cls: v }, { text: "list", cls: t }, { text: "[", cls: v }, { text: "float", cls: t }, { text: "]) -> ", cls: v }, { text: "list", cls: t }, { text: "[", cls: v }, { text: "bool", cls: t }, { text: "]:", cls: v }]),
      ln(13, [{ text: "        self.history.", cls: v }, { text: "extend", cls: f }, { text: "(metrics)", cls: v }]),
      ln(14, [{ text: "        window = self.history[-self.window_size:]", cls: v }]),
      ln(15, [{ text: "        X = np.", cls: v }, { text: "array", cls: f }, { text: "(window).", cls: v }, { text: "reshape", cls: f }, { text: "(-", cls: v }, { text: "1", cls: n }, { text: ", ", cls: v }, { text: "1", cls: n }, { text: ")", cls: v }]),
      ln(16, [{ text: "        predictions = self.model.", cls: v }, { text: "fit_predict", cls: f }, { text: "(X)", cls: v }]),
      ln(17, [{ text: "        ", cls: "" }, { text: "return", cls: k }, { text: " [p == -", cls: v }, { text: "1", cls: n }, { text: " ", cls: "" }, { text: "for", cls: k }, { text: " p ", cls: v }, { text: "in", cls: k }, { text: " predictions]", cls: v }]),
    ],
  },
  "dedup.py": {
    name: "dedup.py",
    path: "src/alerts/dedup.py",
    language: "Python",
    lines: [
      ln(1, [{ text: "from", cls: k }, { text: " datetime ", cls: v }, { text: "import", cls: k }, { text: " datetime, timedelta", cls: v }]),
      ln(2, [{ text: "from", cls: k }, { text: " collections ", cls: v }, { text: "import", cls: k }, { text: " defaultdict", cls: v }]),
      ln(3, []),
      ln(4, [{ text: "class", cls: k }, { text: " ", cls: "" }, { text: "AlertDeduplicator", cls: t }, { text: ":", cls: v }]),
      ln(5, [{ text: "    WINDOW = timedelta(minutes=", cls: v }, { text: "5", cls: n }, { text: ")", cls: v }]),
      ln(6, []),
      ln(7, [{ text: "    ", cls: "" }, { text: "def", cls: k }, { text: " ", cls: "" }, { text: "__init__", cls: f }, { text: "(self):", cls: v }]),
      ln(8, [{ text: "        self.seen = ", cls: v }, { text: "defaultdict", cls: f }, { text: "(", cls: v }, { text: "list", cls: t }, { text: ")", cls: v }]),
      ln(9, []),
      ln(10, [{ text: "    ", cls: "" }, { text: "def", cls: k }, { text: " ", cls: "" }, { text: "should_alert", cls: f }, { text: "(self, alert_key: ", cls: v }, { text: "str", cls: t }, { text: ") -> ", cls: v }, { text: "bool", cls: t }, { text: ":", cls: v }]),
      ln(11, [{ text: "        now = datetime.", cls: v }, { text: "utcnow", cls: f }, { text: "()", cls: v }]),
      ln(12, [{ text: "        self.seen[alert_key] = [", cls: v }]),
      ln(13, [{ text: "            t ", cls: v }, { text: "for", cls: k }, { text: " t ", cls: v }, { text: "in", cls: k }, { text: " self.seen[alert_key]", cls: v }]),
      ln(14, [{ text: "            ", cls: "" }, { text: "if", cls: k }, { text: " now - t < self.WINDOW", cls: v }]),
      ln(15, [{ text: "        ]", cls: v }]),
      ln(16, [{ text: "        ", cls: "" }, { text: "if", cls: k }, { text: " self.seen[alert_key]:", cls: v }]),
      ln(17, [{ text: "            ", cls: "" }, { text: "return", cls: k }, { text: " ", cls: "" }, { text: "False", cls: k }]),
      ln(18, [{ text: "        self.seen[alert_key].", cls: v }, { text: "append", cls: f }, { text: "(now)", cls: v }]),
      ln(19, [{ text: "        ", cls: "" }, { text: "return", cls: k }, { text: " ", cls: "" }, { text: "True", cls: k }]),
    ],
  },
  "executor.py": {
    name: "executor.py",
    path: "src/runbooks/executor.py",
    language: "Python",
    lines: [
      ln(1, [{ text: "import", cls: k }, { text: " asyncio", cls: v }]),
      ln(2, [{ text: "from", cls: k }, { text: " typing ", cls: v }, { text: "import", cls: k }, { text: " ", cls: "" }, { text: "Dict", cls: t }, { text: ", ", cls: v }, { text: "Any", cls: t }]),
      ln(3, []),
      ln(4, [{ text: "class", cls: k }, { text: " ", cls: "" }, { text: "RunbookExecutor", cls: t }, { text: ":", cls: v }]),
      ln(5, [{ text: '    """Executes automated incident response runbooks."""', cls: c }]),
      ln(6, []),
      ln(7, [{ text: "    ", cls: "" }, { text: "async", cls: k }, { text: " ", cls: "" }, { text: "def", cls: k }, { text: " ", cls: "" }, { text: "execute", cls: f }, { text: "(self, runbook_id: ", cls: v }, { text: "str", cls: t }, { text: ", context: ", cls: v }, { text: "Dict", cls: t }, { text: "[", cls: v }, { text: "str", cls: t }, { text: ", ", cls: v }, { text: "Any", cls: t }, { text: "]):", cls: v }]),
      ln(8, [{ text: "        steps = ", cls: v }, { text: "await", cls: k }, { text: " self.", cls: v }, { text: "load_steps", cls: f }, { text: "(runbook_id)", cls: v }]),
      ln(9, [{ text: "        ", cls: "" }, { text: "for", cls: k }, { text: " step ", cls: v }, { text: "in", cls: k }, { text: " steps:", cls: v }]),
      ln(10, [{ text: "            ", cls: "" }, { text: "await", cls: k }, { text: " self.", cls: v }, { text: "run_step", cls: f }, { text: "(step, context)", cls: v }]),
    ],
  },
};

// ─── Lookup map ─────────────────────────────────────────────────

import { fileContents as nexusFileContents } from "./file-contents";

// Nexus uses original file-contents and the hardcoded data from components.
// We provide it here too for uniformity.

const nexusGit: GitData = {
  branches: [
    { name: "main", current: false },
    { name: "feat/dashboard-redesign", current: true },
    { name: "fix/auth-flow", current: false },
  ],
  commits: [
    { hash: "b7e9f4a", message: "feat: add project cards with deployment status", author: "You", time: "2m ago", status: "pushed" },
    { hash: "a3f2d1c", message: "fix: resolve type error in useProjects hook", author: "AI Agent", time: "5m ago", status: "pushed" },
    { hash: "8d2c1b0", message: "chore: update dependencies", author: "You", time: "1h ago", status: "pushed" },
    { hash: "f4a9e2d", message: "feat: implement dark mode design system", author: "AI Agent", time: "2h ago", status: "pushed" },
    { hash: "c1b8d3e", message: "initial commit", author: "You", time: "3h ago", status: "pushed" },
  ],
  changes: [
    { file: "src/components/Dashboard.tsx", status: "modified" },
    { file: "src/lib/api.ts", status: "modified" },
    { file: "src/components/ErrorBoundary.tsx", status: "added" },
  ],
};

const nexusDeployments: DeploymentItem[] = [
  { id: "dpl_1", env: "production", status: "ready", branch: "main", commit: "b7e9f4a", commitMsg: "feat: add project cards", time: "2 min ago", duration: "32s", url: "app.nexusdev.io" },
  { id: "dpl_2", env: "preview", status: "building", branch: "feat/dashboard-redesign", commit: "c4d2e1b", commitMsg: "wip: redesign dashboard layout", time: "just now", duration: "—", url: "preview-feat-dashboard.nexusdev.io" },
  { id: "dpl_3", env: "preview", status: "ready", branch: "fix/auth-flow", commit: "a1b2c3d", commitMsg: "fix: token refresh logic", time: "1h ago", duration: "28s", url: "preview-fix-auth.nexusdev.io" },
  { id: "dpl_4", env: "production", status: "failed", branch: "main", commit: "e5f6a7b", commitMsg: "chore: update build config", time: "3h ago", duration: "45s", url: "" },
  { id: "dpl_5", env: "staging", status: "ready", branch: "main", commit: "d8c9b0a", commitMsg: "feat: implement dark mode", time: "5h ago", duration: "38s", url: "staging.nexusdev.io" },
];

const nexusFileTree: FileNode[] = [
  {
    name: "src", type: "folder", children: [
      {
        name: "components", type: "folder", children: [
          { name: "Dashboard.tsx", type: "file", language: "tsx" },
          { name: "Sidebar.tsx", type: "file", language: "tsx" },
          { name: "Header.tsx", type: "file", language: "tsx" },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "utils.ts", type: "file", language: "ts" },
          { name: "api.ts", type: "file", language: "ts" },
        ],
      },
      { name: "App.tsx", type: "file", language: "tsx" },
      { name: "main.tsx", type: "file", language: "tsx" },
      { name: "index.css", type: "file", language: "css" },
    ],
  },
  {
    name: "public", type: "folder", children: [
      { name: "favicon.ico", type: "file" },
    ],
  },
  { name: "package.json", type: "file", language: "json" },
  { name: "tsconfig.json", type: "file", language: "json" },
  { name: "README.md", type: "file", language: "md" },
];

export const projectViewData: Record<string, ProjectViewData> = {
  "nexus-platform": {
    git: nexusGit,
    deployments: nexusDeployments,
    domainLabel: "app.nexusdev.io",
    fileTree: nexusFileTree,
    fileContents: nexusFileContents,
    defaultTabs: ["Dashboard.tsx", "api.ts", "App.tsx"],
    sprintTitle: "Sprint 14 — Platform Core",
    currentBranch: "feat/dashboard-redesign",
  },
  "aurora-analytics": {
    git: auroraGit,
    deployments: auroraDeployments,
    domainLabel: "analytics.auroradev.io",
    fileTree: auroraFileTree,
    fileContents: auroraFileContents,
    defaultTabs: ["RealtimeChart.tsx", "metrics.ts", "MetricCard.tsx"],
    sprintTitle: "Sprint 9 — Real-time Insights",
    currentBranch: "feat/realtime-charts",
  },
  "phantom-api": {
    git: phantomGit,
    deployments: phantomDeployments,
    domainLabel: "api.phantom-gw.io",
    fileTree: phantomFileTree,
    fileContents: phantomFileContents,
    defaultTabs: ["rate-limiter.go", "trie.go", "main.go"],
    sprintTitle: "Sprint 22 — Gateway Performance",
    currentBranch: "feat/rate-limiter-v2",
  },
  "forge-design": {
    git: forgeGit,
    deployments: forgeDeployments,
    domainLabel: "forge.designsystem.dev",
    fileTree: forgeFileTree,
    fileContents: forgeFileContents,
    defaultTabs: ["Button.tsx", "colors.ts", "Avatar.tsx"],
    sprintTitle: "Sprint 6 — Token System v2",
    currentBranch: "feat/color-tokens-v2",
  },
  "sentinel-monitor": {
    git: sentinelGit,
    deployments: sentinelDeployments,
    domainLabel: "sentinel.monitorops.io",
    fileTree: sentinelFileTree,
    fileContents: sentinelFileContents,
    defaultTabs: ["anomaly.py", "dedup.py", "executor.py"],
    sprintTitle: "Sprint 18 — Anomaly & Automation",
    currentBranch: "feat/anomaly-detection",
  },
};
