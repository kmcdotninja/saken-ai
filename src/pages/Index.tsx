import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import AgentPanel from "@/components/AgentPanel";
import AgentActivityBar from "@/components/AgentActivityBar";
import AgentCollapsedStrip from "@/components/AgentCollapsedStrip";
import TerminalPanel from "@/components/TerminalPanel";
import GitPanel from "@/components/GitPanel";
import DeploymentsPanel from "@/components/DeploymentsPanel";
import KanbanBoard from "@/components/KanbanBoard";
import TeamChat from "@/components/TeamChat";
import TopBar from "@/components/TopBar";
import CommandPalette from "@/components/CommandPalette";
import ProfileSettingsPanel from "@/components/ProfileSettingsPanel";
import NotificationPanel, { getUnreadSeverity } from "@/components/NotificationPanel";
import type { BellSeverity } from "@/components/TopBar";
import { projectViewData } from "@/data/project-data";

const Index = () => {
  const { id: projectId } = useParams();
  const currentProject = projectId || "nexus-platform";
  const viewData = projectViewData[currentProject] || projectViewData["nexus-platform"];

  const [activeView, setActiveView] = useState("board");
  const [activeFile, setActiveFile] = useState(viewData.defaultTabs[0]);
  const [tabs, setTabs] = useState(viewData.defaultTabs);
  const [activeTab, setActiveTab] = useState(viewData.defaultTabs[0]);
  const [currentBranch, setCurrentBranch] = useState(viewData.currentBranch);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [agentPanelOpen, setAgentPanelOpen] = useState(true);
  const [openProjects, setOpenProjects] = useState<string[]>(() => {
    const stored = sessionStorage.getItem("openProjects");
    const existing: string[] = stored ? JSON.parse(stored) : [];
    if (!existing.includes(currentProject)) {
      existing.push(currentProject);
    }
    sessionStorage.setItem("openProjects", JSON.stringify(existing));
    return existing;
  });

  // Reset editor state when project changes
  useEffect(() => {
    const data = projectViewData[currentProject] || projectViewData["nexus-platform"];
    setTabs(data.defaultTabs);
    setActiveTab(data.defaultTabs[0]);
    setActiveFile(data.defaultTabs[0]);
    setCurrentBranch(data.currentBranch);
  }, [currentProject]);

  const handleOpenProjectsChange = (projects: string[]) => {
    setOpenProjects(projects);
    sessionStorage.setItem("openProjects", JSON.stringify(projects));
  };

  const toggleCmd = useCallback(() => setCmdOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCmd();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleCmd]);

  useEffect(() => {
    if (window.innerWidth < 1280) setAgentPanelOpen(false);
  }, []);

  const handleSelectFile = (name: string) => {
    setActiveFile(name);
    setActiveTab(name);
    if (!tabs.includes(name)) {
      setTabs([...tabs, name]);
    }
  };

  const handleCloseTab = (tab: string) => {
    const newTabs = tabs.filter((t) => t !== tab);
    setTabs(newTabs);
    if (activeTab === tab && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "chat":
        return <TeamChat />;
      case "git":
        return <GitPanel projectId={currentProject} />;
      case "deployments":
        return <DeploymentsPanel projectId={currentProject} />;
      case "editor":
        return (
          <div className="flex flex-1 min-h-0">
            <FileExplorer activeFile={activeFile} onSelectFile={handleSelectFile} projectId={currentProject} />
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              <CodeEditor
                tabs={tabs}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onCloseTab={handleCloseTab}
                projectId={currentProject}
              />
              <TerminalPanel />
            </div>
          </div>
        );
      default:
        return <KanbanBoard projectId={currentProject} />;
    }
  };

  const renderRightPanel = () => {
    const showPanel = activeView === "board" || activeView === "editor";
    if (!showPanel) return null;

    if (!agentPanelOpen) {
      return <AgentCollapsedStrip onExpand={() => setAgentPanelOpen(true)} />;
    }

    if (activeView === "board") {
      return <AgentActivityBar onCollapse={() => setAgentPanelOpen(false)} />;
    }
    return <AgentPanel onCollapse={() => setAgentPanelOpen(false)} activeFile={activeTab} />;
  };

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar active={activeView} onNavigate={setActiveView} openProjects={openProjects} onOpenProjectsChange={handleOpenProjectsChange} onProfileClick={() => setProfileOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentBranch={currentBranch}
          activeView={activeView}
          onSearchClick={() => setCmdOpen(true)}
          onNotificationClick={() => setNotifOpen(true)}
          bellSeverity={(getUnreadSeverity() as BellSeverity) || "success"}
          projectId={currentProject}
          onBranchChange={setCurrentBranch}
        />
        <div className="flex flex-1 min-h-0">
          {renderMainContent()}
          {renderRightPanel()}
        </div>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      {profileOpen && <ProfileSettingsPanel onClose={() => setProfileOpen(false)} />}
    </div>
  );
};

export default Index;
