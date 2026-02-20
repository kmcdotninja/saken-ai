import { agents } from "./kanban-data";

export interface ChatMessage {
  agentId: string;
  content: string;
  timestamp: string;
}

export interface FileChat {
  messages: ChatMessage[];
  agentConversation: ChatMessage[]; // agents talking to each other
}

// Context-aware chat data keyed by filename
export const fileChatData: Record<string, FileChat> = {
  // Default / fallback
  _default: {
    messages: [
      { agentId: "vlad", content: "I've set up the project structure. Everything's looking good.", timestamp: "5m ago" },
      { agentId: "agnes", content: "The design tokens are all synced. Ready for implementation.", timestamp: "4m ago" },
      { agentId: "ivar", content: "Sprint backlog is prioritized. Let's focus on the core features first.", timestamp: "3m ago" },
      { agentId: "bjorn", content: "CI/CD pipeline is green. All environments are healthy.", timestamp: "2m ago" },
    ],
    agentConversation: [
      { agentId: "vlad", content: "Hey Agnes, I need the spacing tokens for the new grid layout.", timestamp: "1m ago" },
      { agentId: "agnes", content: "Sure! I'm using 8px base grid. Check the design-tokens.css file.", timestamp: "55s ago" },
      { agentId: "vlad", content: "Perfect, that aligns with the Tailwind config.", timestamp: "50s ago" },
      { agentId: "ivar", content: "Vlad, can you estimate the grid component? I'm updating the sprint.", timestamp: "45s ago" },
      { agentId: "vlad", content: "About 3 story points. Should be done by end of day.", timestamp: "40s ago" },
      { agentId: "bjorn", content: "I'll prep the staging deploy for when you're done.", timestamp: "35s ago" },
      { agentId: "agnes", content: "Also, the dark mode palette needs a contrast bump on muted colors.", timestamp: "30s ago" },
      { agentId: "vlad", content: "I noticed that too. Want me to adjust the HSL values?", timestamp: "25s ago" },
      { agentId: "agnes", content: "Yes please! Bump the lightness from 45% to 55% on muted-foreground.", timestamp: "20s ago" },
      { agentId: "ivar", content: "Good catch. I'll add a QA task for contrast checking.", timestamp: "15s ago" },
    ],
  },

  // TypeScript/React files
  "Dashboard.tsx": {
    messages: [
      { agentId: "vlad", content: "Found 3 type errors in Dashboard.tsx. The props interface is missing `onRefresh`.", timestamp: "3m ago" },
      { agentId: "agnes", content: "The dashboard layout needs more breathing room. I'd suggest 24px gaps between cards.", timestamp: "2m ago" },
      { agentId: "ivar", content: "Can we add a loading skeleton? It's in the acceptance criteria for NEXUS-142.", timestamp: "1m ago" },
    ],
    agentConversation: [
      { agentId: "vlad", content: "Agnes, the grid isn't responsive below 768px. Cards are overflowing.", timestamp: "45s ago" },
      { agentId: "agnes", content: "Switch to single column at `md` breakpoint. I'll update the Figma.", timestamp: "40s ago" },
      { agentId: "ivar", content: "This is blocking the mobile milestone. Priority bump?", timestamp: "35s ago" },
      { agentId: "vlad", content: "Already on it. Using CSS grid with auto-fit minmax.", timestamp: "30s ago" },
      { agentId: "bjorn", content: "Preview deploy is live if you want to test mobile.", timestamp: "25s ago" },
      { agentId: "agnes", content: "Looks great on iPhone 14 Pro. The card shadows need softening though.", timestamp: "20s ago" },
      { agentId: "vlad", content: "Done. Changed shadow-lg to shadow-md with 0.1 opacity.", timestamp: "15s ago" },
      { agentId: "ivar", content: "Moving NEXUS-142 to done. Nice work team! 🎉", timestamp: "10s ago" },
    ],
  },

  "index.tsx": {
    messages: [
      { agentId: "vlad", content: "The main entry point looks clean. I've added strict mode wrapping.", timestamp: "4m ago" },
      { agentId: "bjorn", content: "Bundle size is at 142kb gzipped. Within our target.", timestamp: "2m ago" },
    ],
    agentConversation: [
      { agentId: "vlad", content: "Should we lazy-load the routes? Current bundle is getting heavy.", timestamp: "50s ago" },
      { agentId: "bjorn", content: "Definitely. Code splitting would cut initial load by ~40%.", timestamp: "45s ago" },
      { agentId: "vlad", content: "I'll use React.lazy with Suspense boundaries.", timestamp: "40s ago" },
      { agentId: "ivar", content: "Add that to the performance epic. We need to track the improvement.", timestamp: "35s ago" },
      { agentId: "agnes", content: "Don't forget a nice loading spinner for the Suspense fallback!", timestamp: "30s ago" },
      { agentId: "vlad", content: "Already using our PixelSpinner component. Looks great.", timestamp: "25s ago" },
    ],
  },

  "styles.css": {
    messages: [
      { agentId: "agnes", content: "I've updated the CSS custom properties. All colors are now in HSL.", timestamp: "3m ago" },
      { agentId: "vlad", content: "The cascade looks clean. No specificity conflicts detected.", timestamp: "1m ago" },
    ],
    agentConversation: [
      { agentId: "agnes", content: "Vlad, I'm seeing a flash of unstyled content on first load.", timestamp: "50s ago" },
      { agentId: "vlad", content: "That's the font loading. We need font-display: swap with a fallback.", timestamp: "45s ago" },
      { agentId: "agnes", content: "Can we preload the critical fonts in the HTML head?", timestamp: "40s ago" },
      { agentId: "vlad", content: "Done. Added preload links for Geist Sans and Mono.", timestamp: "35s ago" },
      { agentId: "bjorn", content: "Lighthouse score jumped from 82 to 94. Nice.", timestamp: "30s ago" },
    ],
  },

  "main.go": {
    messages: [
      { agentId: "vlad", content: "The Go server is using chi router. Clean REST patterns.", timestamp: "4m ago" },
      { agentId: "bjorn", content: "Docker image builds in 12s. Multi-stage build is working well.", timestamp: "2m ago" },
    ],
    agentConversation: [
      { agentId: "vlad", content: "Bjorn, the health endpoint needs to check DB connectivity too.", timestamp: "50s ago" },
      { agentId: "bjorn", content: "Good point. I'll add a pg_isready check to /healthz.", timestamp: "45s ago" },
      { agentId: "ivar", content: "We should also expose readiness vs liveness probes separately.", timestamp: "40s ago" },
      { agentId: "vlad", content: "/healthz for liveness, /readyz for readiness. Standard k8s pattern.", timestamp: "35s ago" },
      { agentId: "bjorn", content: "Updated the Helm chart. Probes are configured.", timestamp: "30s ago" },
    ],
  },

  "app.py": {
    messages: [
      { agentId: "vlad", content: "FastAPI app is structured with dependency injection. Clean.", timestamp: "3m ago" },
      { agentId: "ivar", content: "The ML pipeline endpoint needs rate limiting. Adding to backlog.", timestamp: "2m ago" },
    ],
    agentConversation: [
      { agentId: "vlad", content: "The prediction endpoint is returning 200ms latency. Can we optimize?", timestamp: "50s ago" },
      { agentId: "bjorn", content: "We could add Redis caching for repeated predictions.", timestamp: "45s ago" },
      { agentId: "vlad", content: "Good idea. I'll add a TTL cache with 5min expiry.", timestamp: "40s ago" },
      { agentId: "ivar", content: "Make sure to add cache hit/miss metrics to the dashboard.", timestamp: "35s ago" },
      { agentId: "agnes", content: "The API docs page needs styling. It's default Swagger UI.", timestamp: "30s ago" },
    ],
  },

  "schema.prisma": {
    messages: [
      { agentId: "vlad", content: "Schema is normalized. Relations look correct.", timestamp: "3m ago" },
      { agentId: "ivar", content: "We need a soft-delete pattern for the User model.", timestamp: "2m ago" },
    ],
    agentConversation: [
      { agentId: "vlad", content: "Adding a deletedAt field with a partial unique index.", timestamp: "50s ago" },
      { agentId: "ivar", content: "Don't forget to update the API middleware to filter soft-deleted records.", timestamp: "45s ago" },
      { agentId: "vlad", content: "Using Prisma middleware for automatic filtering.", timestamp: "40s ago" },
      { agentId: "bjorn", content: "Migration is ready. Want me to apply to staging?", timestamp: "35s ago" },
      { agentId: "vlad", content: "Yes, let's test it on staging first.", timestamp: "30s ago" },
    ],
  },
};

// Simulated agent responses when user types in chat
export const agentResponsesByFile: Record<string, { agentId: string; content: string }[]> = {
  _default: [
    { agentId: "vlad", content: "I've reviewed the codebase. The component structure is clean and well-organized. I'd recommend memoizing the data transformations for better performance." },
    { agentId: "agnes", content: "The design system is consistent. I'm working on refining the spacing tokens to match the 8px grid more precisely." },
    { agentId: "ivar", content: "Sprint velocity is looking good. We're on track for the milestone deadline." },
    { agentId: "bjorn", content: "All deployments are healthy. Uptime is at 99.97% this month." },
    { agentId: "vlad", content: "I can scaffold that out. Want me to use the existing patterns or try a new approach?" },
    { agentId: "agnes", content: "I'll mock up a few variations and push them to the design branch." },
  ],
  "Dashboard.tsx": [
    { agentId: "vlad", content: "I can fix those type errors. The issue is the missing generic parameter on `useQuery`. I'll add `QueryResult<DashboardData>` typing." },
    { agentId: "agnes", content: "For the skeleton states, I'd suggest using our `Skeleton` primitive with matching dimensions to prevent layout shift." },
    { agentId: "ivar", content: "The acceptance criteria also mentions keyboard navigation. Let me check if that's implemented." },
    { agentId: "vlad", content: "Done! I've added error boundaries and loading states. All tests passing. ✓" },
  ],
  "index.tsx": [
    { agentId: "vlad", content: "The entry point is minimal and clean. I'd recommend adding a global error boundary here." },
    { agentId: "bjorn", content: "Tree-shaking is working well. No dead code detected in the bundle analysis." },
  ],
  "styles.css": [
    { agentId: "agnes", content: "I've prepared a contrast matrix for all color combinations. Everything passes WCAG AA." },
    { agentId: "vlad", content: "The CSS custom properties are well organized. No circular references detected." },
  ],
  "main.go": [
    { agentId: "vlad", content: "The Go handlers are clean. I'd suggest adding structured logging with zerolog." },
    { agentId: "bjorn", content: "Container health checks are configured. Kubernetes probes are ready." },
  ],
  "app.py": [
    { agentId: "vlad", content: "The FastAPI routes are well-structured. Type hints are comprehensive." },
    { agentId: "ivar", content: "Rate limiting is configured at 100 req/min per API key." },
  ],
};

// Get chat for a specific file, with fallback
export function getChatForFile(filename: string): FileChat {
  // Try exact match
  if (fileChatData[filename]) return fileChatData[filename];
  
  // Try matching by extension pattern
  const ext = filename.split('.').pop()?.toLowerCase();
  const extMap: Record<string, string> = {
    tsx: "Dashboard.tsx",
    ts: "index.tsx",
    css: "styles.css",
    go: "main.go",
    py: "app.py",
    prisma: "schema.prisma",
  };
  
  if (ext && extMap[ext] && fileChatData[extMap[ext]]) {
    return fileChatData[extMap[ext]];
  }
  
  return fileChatData._default;
}

export function getResponsesForFile(filename: string): { agentId: string; content: string }[] {
  if (agentResponsesByFile[filename]) return agentResponsesByFile[filename];
  
  const ext = filename.split('.').pop()?.toLowerCase();
  const extMap: Record<string, string> = {
    tsx: "Dashboard.tsx",
    ts: "index.tsx",
    css: "styles.css",
    go: "main.go",
    py: "app.py",
  };
  
  if (ext && extMap[ext] && agentResponsesByFile[extMap[ext]]) {
    return agentResponsesByFile[extMap[ext]];
  }
  
  return agentResponsesByFile._default;
}
