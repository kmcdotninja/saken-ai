import avatarVlad from "@/assets/avatar-vlad.png";
import avatarIvar from "@/assets/avatar-ivar.png";
import avatarBjorn from "@/assets/avatar-bjorn.png";

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
    color: "text-primary",
    statusColor: "bg-primary",
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
];

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  labels: string[];
  assignee: string; // agent id
  points?: number;
  subtasks?: { done: number; total: number };
  comments?: number;
  agentAction?: string; // what the agent is currently doing
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
        assignee: "ivar",
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
        assignee: "ivar",
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
        assignee: "vlad",
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
