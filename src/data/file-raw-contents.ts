export interface RawFileData {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const rawFileContents: Record<string, RawFileData> = {
  "Dashboard.tsx": {
    name: "Dashboard.tsx",
    path: "src/components/Dashboard.tsx",
    language: "TypeScript React",
    content: `import { useState, useEffect } from "react";
import { fetchProjects } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  status: "active" | "archived";
  deployments: Deployment[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="grid gap-4 p-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}`,
  },
  "api.ts": {
    name: "api.ts",
    path: "src/lib/api.ts",
    language: "TypeScript",
    content: `// API client for project management
import axios from "axios";

const API_BASE = "https://api.nexus.dev/v1";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchProjects() {
  const { data } = await client.get("/projects");
  return data;
}

export async function createDeployment(projectId: string) {
  const { data } = await client.post(\`/projects/\${projectId}/deploy\`);
  return data;
}

export async function fetchMetrics(projectId: string) {
  const { data } = await client.get(\`/projects/\${projectId}/metrics\`);
  return data;
}`,
  },
  "App.tsx": {
    name: "App.tsx",
    path: "src/App.tsx",
    language: "TypeScript React",
    content: `import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}`,
  },
  "Sidebar.tsx": {
    name: "Sidebar.tsx",
    path: "src/components/Sidebar.tsx",
    language: "TypeScript React",
    content: `import { NavLink } from "react-router-dom";
import { Home, Settings, Users } from "lucide-react";

const links = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/team", icon: Users, label: "Team" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <nav className="w-64 bg-card border-r p-4">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to}>
          <link.icon size={18} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}`,
  },
  "Header.tsx": {
    name: "Header.tsx",
    path: "src/components/Header.tsx",
    language: "TypeScript React",
    content: `import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-6 border-b">
      <h1 className="text-lg font-bold">Nexus Platform</h1>
      <div className="flex gap-3">
        <Search size={18} />
        <Bell size={18} />
      </div>
    </header>
  );
}`,
  },
  "utils.ts": {
    name: "utils.ts",
    path: "src/lib/utils.ts",
    language: "TypeScript",
    content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric"
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}`,
  },
  "main.tsx": {
    name: "main.tsx",
    path: "src/main.tsx",
    language: "TypeScript React",
    content: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(<App />);`,
  },
  "index.css": {
    name: "index.css",
    path: "src/index.css",
    language: "CSS",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 5%;
  --foreground: 0 0% 90%;
  --card: 0 0% 8%;
  --primary: 0 0% 90%;
  --muted: 0 0% 12%;
}`,
  },
  "package.json": {
    name: "package.json",
    path: "package.json",
    language: "JSON",
    content: `{
  "name": "nexus-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}`,
  },
  "tsconfig.json": {
    name: "tsconfig.json",
    path: "tsconfig.json",
    language: "JSON",
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx"
  }
}`,
  },
  "README.md": {
    name: "README.md",
    path: "README.md",
    language: "Markdown",
    content: `# Nexus Platform

AI-powered project management and deployment platform.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\``,
  },
};
