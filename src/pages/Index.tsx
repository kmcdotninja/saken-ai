import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import AgentPanel from "@/components/AgentPanel";
import TerminalPanel from "@/components/TerminalPanel";
import GitPanel from "@/components/GitPanel";
import IssuesPanel from "@/components/IssuesPanel";
import DeploymentsPanel from "@/components/DeploymentsPanel";
import TopBar from "@/components/TopBar";

const Index = () => {
  const [activeView, setActiveView] = useState("editor");
  const [activeFile, setActiveFile] = useState("Dashboard.tsx");
  const [tabs, setTabs] = useState(["Dashboard.tsx", "api.ts", "App.tsx"]);
  const [activeTab, setActiveTab] = useState("Dashboard.tsx");

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
      case "issues":
        return <IssuesPanel />;
      case "deployments":
        return <DeploymentsPanel />;
      default:
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
    }
  };

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar active={activeView} onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar currentBranch="feat/dashboard-redesign" activeView={activeView} />
        <div className="flex flex-1 min-h-0">
          {renderMainContent()}
          <AgentPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
