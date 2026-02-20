import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import AgentPanel from "@/components/AgentPanel";
import AgentActivityBar from "@/components/AgentActivityBar";
import TerminalPanel from "@/components/TerminalPanel";
import GitPanel from "@/components/GitPanel";
import DeploymentsPanel from "@/components/DeploymentsPanel";
import KanbanBoard from "@/components/KanbanBoard";
import TopBar from "@/components/TopBar";
import CommandPalette from "@/components/CommandPalette";

const Index = () => {
  const [activeView, setActiveView] = useState("board");
  const [activeFile, setActiveFile] = useState("Dashboard.tsx");
  const [tabs, setTabs] = useState(["Dashboard.tsx", "api.ts", "App.tsx"]);
  const [activeTab, setActiveTab] = useState("Dashboard.tsx");
  const [cmdOpen, setCmdOpen] = useState(false);

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
      case "git":
        return <GitPanel />;
      case "deployments":
        return <DeploymentsPanel />;
      case "editor":
        return (
          <div className="flex flex-1 min-h-0">
            <FileExplorer activeFile={activeFile} onSelectFile={handleSelectFile} />
            <div className="flex-1 flex flex-col min-w-0">
              <CodeEditor
                tabs={tabs}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onCloseTab={handleCloseTab}
              />
              <TerminalPanel />
            </div>
          </div>
        );
      default: // board
        return <KanbanBoard />;
    }
  };

  const renderRightPanel = () => {
    if (activeView === "board") return <AgentActivityBar />;
    if (activeView === "editor") return <AgentPanel />;
    return null;
  };

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar active={activeView} onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar currentBranch="feat/dashboard-redesign" activeView={activeView} onSearchClick={() => setCmdOpen(true)} />
        <div className="flex flex-1 min-h-0">
          {renderMainContent()}
          {renderRightPanel()}
        </div>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
};

export default Index;
