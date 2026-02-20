import avatarVlad from "@/assets/avatar-vlad.png";
import avatarIvar from "@/assets/avatar-ivar.png";
import avatarBjorn from "@/assets/avatar-bjorn.png";
import avatarAgnes from "@/assets/avatar-agnes.png";

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  statusColor: string;
  status: "working" | "idle" | "reviewing";
}

export const agents: Agent[] = [
  {
    id: "vlad",
    name: "Vlad",
    role: "Code Agent",
    avatar: avatarVlad,
    color: "text-foreground",
    statusColor: "bg-foreground",
    status: "working",
  },
  {
    id: "ivar",
    name: "Ivar",
    role: "Product Dev Agent",
    avatar: avatarIvar,
    color: "text-success",
    statusColor: "bg-success",
    status: "working",
  },
  {
    id: "bjorn",
    name: "Bjorn",
    role: "Deployment Agent",
    avatar: avatarBjorn,
    color: "text-warning",
    statusColor: "bg-warning",
    status: "reviewing",
  },
  {
    id: "agnes",
    name: "Agnes",
    role: "Design Agent",
    avatar: avatarAgnes,
    color: "text-purple-400",
    statusColor: "bg-purple-400",
    status: "working",
  },
];

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  labels: string[];
  assignee: string;
  points?: number;
  subtasks?: { done: number; total: number };
  comments?: number;
  agentAction?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  cards: KanbanCard[];
}

export const columns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    status: "backlog",
    cards: [
      {
        id: "NEXUS-201",
        title: "Add WebSocket reconnection with exponential backoff",
        description: "Handle dropped connections gracefully",
        priority: "medium",
        labels: ["backend", "reliability"],
        assignee: "vlad",
        points: 5,
        subtasks: { done: 0, total: 3 },
      },
      {
        id: "NEXUS-202",
        title: "Design onboarding flow for new team members",
        description: "Multi-step wizard with role selection",
        priority: "low",
        labels: ["design", "ux"],
        assignee: "agnes",
        points: 8,
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    status: "todo",
    cards: [
      {
        id: "NEXUS-195",
        title: "Implement branch protection rules API",
        description: "Prevent force pushes to main, require PR reviews",
        priority: "high",
        labels: ["git", "security"],
        assignee: "vlad",
        points: 5,
        subtasks: { done: 1, total: 4 },
        comments: 3,
      },
      {
        id: "NEXUS-196",
        title: "Create deployment rollback mechanism",
        description: "One-click rollback to previous stable deployment",
        priority: "urgent",
        labels: ["deploy", "infra"],
        assignee: "bjorn",
        points: 8,
        comments: 5,
      },
      {
        id: "NEXUS-199",
        title: "Build notification preferences panel",
        description: "Per-channel notification controls",
        priority: "medium",
        labels: ["feature", "settings"],
        assignee: "agnes",
        points: 3,
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    status: "in_progress",
    cards: [
      {
        id: "NEXUS-189",
        title: "Real-time collaborative code editing",
        description: "CRDT-based sync with cursor presence",
        priority: "urgent",
        labels: ["feature", "editor", "p0"],
        assignee: "vlad",
        points: 13,
        subtasks: { done: 5, total: 8 },
        comments: 12,
        agentAction: "Implementing OT transform functions in collaboration.ts",
      },
      {
        id: "NEXUS-191",
        title: "Sprint retrospective dashboard with AI insights",
        description: "Auto-generate retro summaries from tickets and commits",
        priority: "high",
        labels: ["product", "ai"],
        assignee: "ivar",
        points: 8,
        subtasks: { done: 3, total: 5 },
        comments: 7,
        agentAction: "Analyzing sprint velocity data and drafting insight cards",
      },
      {
        id: "NEXUS-193",
        title: "Multi-region deployment pipeline",
        description: "Deploy to US-East, EU-West, AP-Southeast simultaneously",
        priority: "high",
        labels: ["deploy", "infra"],
        assignee: "bjorn",
        points: 13,
        subtasks: { done: 2, total: 6 },
        comments: 4,
        agentAction: "Configuring health checks for EU-West region",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    status: "review",
    cards: [
      {
        id: "NEXUS-185",
        title: "Add file diff viewer with syntax highlighting",
        description: "Side-by-side and unified diff views",
        priority: "high",
        labels: ["feature", "git"],
        assignee: "vlad",
        points: 8,
        subtasks: { done: 6, total: 6 },
        comments: 9,
        agentAction: "Awaiting code review — all tests passing",
      },
      {
        id: "NEXUS-187",
        title: "Auto-assign issues based on team capacity",
        description: "AI-powered workload balancing",
        priority: "medium",
        labels: ["product", "ai"],
        assignee: "ivar",
        points: 5,
        subtasks: { done: 4, total: 4 },
        comments: 6,
        agentAction: "PR ready — running final integration tests",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    status: "done",
    cards: [
      {
        id: "NEXUS-180",
        title: "Implement dark mode design system",
        description: "Complete token-based theming with CSS variables",
        priority: "high",
        labels: ["design", "frontend"],
        assignee: "agnes",
        points: 5,
        subtasks: { done: 4, total: 4 },
      },
      {
        id: "NEXUS-182",
        title: "SSL certificate auto-renewal",
        description: "Let's Encrypt integration with auto-renewal",
        priority: "high",
        labels: ["deploy", "security"],
        assignee: "bjorn",
        points: 3,
        subtasks: { done: 2, total: 2 },
      },
    ],
  },
];

// ─── Per-project kanban data ─────────────────────────────────

const auroraColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    status: "backlog",
    cards: [
      {
        id: "AURORA-110",
        title: "Add funnel analysis visualization",
        description: "Multi-step conversion funnel with drop-off percentages",
        priority: "medium",
        labels: ["analytics", "visualization"],
        assignee: "agnes",
        points: 8,
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    status: "todo",
    cards: [
      {
        id: "AURORA-105",
        title: "Implement custom metric builder",
        description: "Drag-and-drop metric composition with formula editor",
        priority: "high",
        labels: ["feature", "metrics"],
        assignee: "vlad",
        points: 8,
        subtasks: { done: 1, total: 5 },
        comments: 4,
      },
      {
        id: "AURORA-106",
        title: "Set up alerting rule templates",
        description: "Pre-built templates for common alerting scenarios",
        priority: "medium",
        labels: ["alerts", "ux"],
        assignee: "ivar",
        points: 5,
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    status: "in_progress",
    cards: [
      {
        id: "AURORA-101",
        title: "Real-time chart streaming via WebSocket",
        description: "Live-updating charts with sub-second latency",
        priority: "urgent",
        labels: ["feature", "realtime", "p0"],
        assignee: "vlad",
        points: 13,
        subtasks: { done: 4, total: 7 },
        comments: 9,
        agentAction: "Implementing WebSocket reconnection with backoff in useWebSocket.ts",
      },
      {
        id: "AURORA-102",
        title: "Team performance dashboard layout",
        description: "Configurable dashboard with drag-and-drop widgets",
        priority: "high",
        labels: ["dashboard", "ui"],
        assignee: "agnes",
        points: 8,
        subtasks: { done: 2, total: 4 },
        comments: 5,
        agentAction: "Designing responsive grid layout for metric cards",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    status: "review",
    cards: [
      {
        id: "AURORA-098",
        title: "Percentile calculation fix for P99 metrics",
        description: "Correct edge case in percentile aggregation",
        priority: "high",
        labels: ["bug", "metrics"],
        assignee: "vlad",
        points: 3,
        subtasks: { done: 3, total: 3 },
        comments: 7,
        agentAction: "Awaiting review — unit tests passing",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    status: "done",
    cards: [
      {
        id: "AURORA-095",
        title: "Migrate to TimescaleDB for time-series data",
        description: "Replace PostgreSQL with TimescaleDB hypertables",
        priority: "high",
        labels: ["backend", "database"],
        assignee: "bjorn",
        points: 8,
        subtasks: { done: 5, total: 5 },
      },
    ],
  },
];

const phantomColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    status: "backlog",
    cards: [
      {
        id: "PHNTM-310",
        title: "Add gRPC proxy support",
        description: "Transparent gRPC proxying with load balancing",
        priority: "medium",
        labels: ["feature", "protocol"],
        assignee: "vlad",
        points: 13,
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    status: "todo",
    cards: [
      {
        id: "PHNTM-305",
        title: "Implement circuit breaker pattern",
        description: "Automatic circuit breaking for failing upstream services",
        priority: "urgent",
        labels: ["reliability", "middleware"],
        assignee: "vlad",
        points: 8,
        comments: 6,
      },
      {
        id: "PHNTM-306",
        title: "Add API key rotation workflow",
        description: "Zero-downtime key rotation for consumers",
        priority: "high",
        labels: ["security", "auth"],
        assignee: "ivar",
        points: 5,
        subtasks: { done: 0, total: 3 },
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    status: "in_progress",
    cards: [
      {
        id: "PHNTM-301",
        title: "Sliding window rate limiter with Redis",
        description: "Replace token bucket with sliding window algorithm",
        priority: "urgent",
        labels: ["feature", "performance", "p0"],
        assignee: "vlad",
        points: 8,
        subtasks: { done: 5, total: 7 },
        comments: 11,
        agentAction: "Implementing Redis pipeline for atomic window operations",
      },
      {
        id: "PHNTM-302",
        title: "Request/response body transformation",
        description: "JSONPath-based request and response rewriting",
        priority: "high",
        labels: ["middleware", "feature"],
        assignee: "ivar",
        points: 8,
        subtasks: { done: 3, total: 5 },
        comments: 4,
        agentAction: "Building JSONPath expression evaluator for transform rules",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    status: "review",
    cards: [
      {
        id: "PHNTM-298",
        title: "Trie-based request routing optimization",
        description: "Replace linear route matching with trie lookup",
        priority: "high",
        labels: ["performance", "router"],
        assignee: "vlad",
        points: 5,
        subtasks: { done: 4, total: 4 },
        comments: 8,
        agentAction: "Benchmarks show 12x improvement — awaiting approval",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    status: "done",
    cards: [
      {
        id: "PHNTM-295",
        title: "Upgrade to Go 1.22",
        description: "Adopt new routing patterns and performance improvements",
        priority: "medium",
        labels: ["chore", "infra"],
        assignee: "bjorn",
        points: 3,
        subtasks: { done: 2, total: 2 },
      },
      {
        id: "PHNTM-293",
        title: "Cache invalidation fix",
        description: "Resolve race condition in distributed cache",
        priority: "urgent",
        labels: ["bug", "cache"],
        assignee: "vlad",
        points: 5,
        subtasks: { done: 3, total: 3 },
      },
    ],
  },
];

const forgeColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    status: "backlog",
    cards: [
      {
        id: "FORGE-060",
        title: "Create data table component",
        description: "Sortable, filterable data table with pagination",
        priority: "medium",
        labels: ["component", "data"],
        assignee: "agnes",
        points: 13,
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    status: "todo",
    cards: [
      {
        id: "FORGE-055",
        title: "Add motion/animation tokens",
        description: "Define standard easing curves and duration scales",
        priority: "medium",
        labels: ["tokens", "motion"],
        assignee: "agnes",
        points: 5,
      },
      {
        id: "FORGE-056",
        title: "Write accessibility audit checklist",
        description: "WCAG 2.1 AA compliance checklist for all components",
        priority: "high",
        labels: ["a11y", "docs"],
        assignee: "ivar",
        points: 3,
        comments: 2,
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    status: "in_progress",
    cards: [
      {
        id: "FORGE-051",
        title: "Semantic color tokens with dark mode support",
        description: "Generate dark mode palette from semantic token definitions",
        priority: "urgent",
        labels: ["tokens", "dark-mode", "p0"],
        assignee: "agnes",
        points: 8,
        subtasks: { done: 4, total: 6 },
        comments: 8,
        agentAction: "Mapping semantic tokens to dark palette values in dark-mode.ts",
      },
      {
        id: "FORGE-052",
        title: "New avatar component variants",
        description: "Add group, status indicator, and fallback variants",
        priority: "high",
        labels: ["component", "design"],
        assignee: "agnes",
        points: 5,
        subtasks: { done: 2, total: 4 },
        comments: 3,
        agentAction: "Implementing AvatarGroup with overlap and +N counter",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    status: "review",
    cards: [
      {
        id: "FORGE-048",
        title: "Button focus ring contrast improvement",
        description: "Ensure 3:1 contrast ratio for focus indicators",
        priority: "high",
        labels: ["a11y", "component"],
        assignee: "agnes",
        points: 3,
        subtasks: { done: 2, total: 2 },
        comments: 5,
        agentAction: "All contrast checks passing — PR ready",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    status: "done",
    cards: [
      {
        id: "FORGE-045",
        title: "Sync Figma tokens with codebase",
        description: "Automated pipeline from Figma variables to TypeScript",
        priority: "high",
        labels: ["tooling", "tokens"],
        assignee: "agnes",
        points: 5,
        subtasks: { done: 3, total: 3 },
      },
      {
        id: "FORGE-043",
        title: "Component usage documentation",
        description: "Interactive examples for all core components",
        priority: "medium",
        labels: ["docs"],
        assignee: "ivar",
        points: 5,
        subtasks: { done: 4, total: 4 },
      },
    ],
  },
];

const sentinelColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    status: "backlog",
    cards: [
      {
        id: "SNTL-220",
        title: "Add Datadog metrics exporter",
        description: "Export aggregated metrics to Datadog API",
        priority: "low",
        labels: ["integration", "metrics"],
        assignee: "bjorn",
        points: 5,
      },
      {
        id: "SNTL-221",
        title: "Build status page generator",
        description: "Auto-generate public status page from health checks",
        priority: "medium",
        labels: ["feature", "public"],
        assignee: "agnes",
        points: 8,
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    status: "todo",
    cards: [
      {
        id: "SNTL-215",
        title: "Implement composite alert conditions",
        description: "AND/OR logic for multi-metric alert rules",
        priority: "high",
        labels: ["alerts", "feature"],
        assignee: "vlad",
        points: 8,
        subtasks: { done: 1, total: 4 },
        comments: 5,
      },
      {
        id: "SNTL-216",
        title: "Create incident timeline view",
        description: "Chronological view of events during an incident",
        priority: "medium",
        labels: ["incidents", "ui"],
        assignee: "agnes",
        points: 5,
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    status: "in_progress",
    cards: [
      {
        id: "SNTL-210",
        title: "ML-based anomaly detection for CPU metrics",
        description: "Isolation forest model for detecting CPU spike anomalies",
        priority: "urgent",
        labels: ["feature", "ml", "p0"],
        assignee: "vlad",
        points: 13,
        subtasks: { done: 3, total: 6 },
        comments: 10,
        agentAction: "Training IsolationForest model on 30-day historical data",
      },
      {
        id: "SNTL-211",
        title: "Automated incident runbook execution",
        description: "Execute predefined remediation steps on alert trigger",
        priority: "high",
        labels: ["automation", "incidents"],
        assignee: "ivar",
        points: 8,
        subtasks: { done: 2, total: 5 },
        comments: 6,
        agentAction: "Building step executor with rollback support",
      },
      {
        id: "SNTL-212",
        title: "OpenTelemetry collector migration",
        description: "Replace custom collectors with OTel standard",
        priority: "high",
        labels: ["infra", "refactor"],
        assignee: "bjorn",
        points: 8,
        subtasks: { done: 4, total: 7 },
        comments: 3,
        agentAction: "Configuring OTel exporters for Prometheus and Jaeger",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    status: "review",
    cards: [
      {
        id: "SNTL-208",
        title: "Alert deduplication within time window",
        description: "Suppress duplicate alerts in 5-minute sliding window",
        priority: "high",
        labels: ["alerts", "reliability"],
        assignee: "vlad",
        points: 5,
        subtasks: { done: 3, total: 3 },
        comments: 4,
        agentAction: "All edge cases covered — awaiting final review",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    status: "done",
    cards: [
      {
        id: "SNTL-205",
        title: "PagerDuty integration",
        description: "Bi-directional sync with PagerDuty incidents",
        priority: "high",
        labels: ["integration", "alerts"],
        assignee: "bjorn",
        points: 5,
        subtasks: { done: 4, total: 4 },
      },
    ],
  },
];

export const projectColumns: Record<string, KanbanColumn[]> = {
  "nexus-platform": columns,
  "aurora-analytics": auroraColumns,
  "phantom-api": phantomColumns,
  "forge-design": forgeColumns,
  "sentinel-monitor": sentinelColumns,
};
