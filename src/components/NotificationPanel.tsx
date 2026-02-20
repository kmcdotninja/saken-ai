import { useState } from "react";
import PxIcon from "./PxIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import avatarVlad from "@/assets/avatar-vlad.png";
import avatarIvar from "@/assets/avatar-ivar.png";
import avatarBjorn from "@/assets/avatar-bjorn.png";

export type NotifSeverity = "success" | "error" | "warning";

interface Notification {
  id: string;
  type: "agent" | "deploy" | "git" | "system";
  severity: NotifSeverity;
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  icon?: string;
}

const severityDotColor: Record<NotifSeverity, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
};

const notifications: Notification[] = [
  {
    id: "n1",
    type: "agent",
    severity: "success",
    title: "Vlad completed code review",
    description: "PR #142 — Real-time collaborative editing passed all checks.",
    time: "2m ago",
    read: false,
    avatar: avatarVlad,
  },
  {
    id: "n2",
    type: "deploy",
    severity: "success",
    title: "Deployment to US-East succeeded",
    description: "v2.4.1 deployed by Bjorn. All health checks passing.",
    time: "8m ago",
    read: false,
    icon: "cloud-upload",
  },
  {
    id: "n3",
    type: "agent",
    severity: "success",
    title: "Ivar drafted sprint insights",
    description: "Sprint 14 retrospective summary generated with 4 action items.",
    time: "15m ago",
    read: false,
    avatar: avatarIvar,
  },
  {
    id: "n4",
    type: "git",
    severity: "success",
    title: "Branch merged: feat/diff-viewer",
    description: "Vlad merged feat/diff-viewer into main. 23 files changed.",
    time: "32m ago",
    read: true,
    icon: "git-merge",
  },
  {
    id: "n5",
    type: "deploy",
    severity: "warning",
    title: "EU-West deployment in progress",
    description: "Bjorn is configuring health checks for the EU-West region.",
    time: "45m ago",
    read: true,
    avatar: avatarBjorn,
  },
  {
    id: "n6",
    type: "system",
    severity: "success",
    title: "SSL certificate renewed",
    description: "Auto-renewal completed for nexus-platform.app",
    time: "1h ago",
    read: true,
    icon: "lock",
  },
  {
    id: "n7",
    type: "agent",
    severity: "success",
    title: "Vlad started NEXUS-189",
    description: "Implementing OT transform functions in collaboration.ts",
    time: "1.5h ago",
    read: true,
    avatar: avatarVlad,
  },
  {
    id: "n8",
    type: "deploy",
    severity: "error",
    title: "Staging build failed",
    description: "TypeScript error in DeploymentPipeline.tsx line 42.",
    time: "2h ago",
    read: true,
    icon: "alert-triangle",
  },
];

const filterTabs = [
  { label: "All", type: null },
  { label: "Agents", type: "agent" },
  { label: "Deploys", type: "deploy" },
  { label: "Git", type: "git" },
] as const;

type FilterType = null | "agent" | "deploy" | "git";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function getUnreadSeverity(): NotifSeverity | null {
  const unread = notifications.filter((n) => !n.read);
  if (unread.length === 0) return null;
  if (unread.some((n) => n.severity === "error")) return "error";
  if (unread.some((n) => n.severity === "warning")) return "warning";
  return "success";
}

export default function NotificationPanel({ open, onClose }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filtered = activeFilter
    ? notifications.filter((n) => n.type === activeFilter)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTabUnread = (type: FilterType) => {
    if (type === null) return notifications.filter((n) => !n.read).length;
    return notifications.filter((n) => !n.read && n.type === type).length;
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] max-w-[90vw] bg-card border-l border-border z-50 flex flex-col transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <PxIcon icon="notification" size={16} className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-foreground text-background font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title="Mark all read">
              <PxIcon icon="check-double" size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Close"
            >
              <PxIcon icon="close" size={14} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-0 px-4 py-2 border-b border-border text-[11px] shrink-0">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.type;
            const tabUnread = getTabUnread(tab.type);
            return (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.type)}
                className={`relative px-2.5 py-1 transition-colors ${
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {tab.label}
                {tabUnread > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-success text-success-foreground rounded-full animate-notif-blink">
                    {tabUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 px-4 py-3 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer ${
                  !n.read ? "bg-accent/20" : ""
                }`}
              >
                {/* Avatar / Icon */}
                <div className="shrink-0 mt-0.5">
                  {n.avatar ? (
                    <img src={n.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-7 h-7 bg-muted border border-border flex items-center justify-center">
                      <PxIcon icon={n.icon || "notification"} size={14} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs leading-snug ${!n.read ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className={`w-1.5 h-1.5 ${severityDotColor[n.severity]} rounded-full shrink-0 mt-1.5 animate-notif-blink`} />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                    {n.description}
                  </p>
                  <span className="text-[10px] text-muted-foreground/60 mt-1 block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-center py-3 border-t border-border shrink-0">
          <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
