"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DisplayAgentModalCallAnalysis from './DisplayAgentModalCallAnalysis';

interface Agent {
  id: string;
  agent_name: string;
  begin_message: string;
  prompt: string;
  provider: string;
  llmmodel: string;
  voice_id: string;
}

interface AgentLayoutProps {
  agents: Agent[];
}

const AgentLayout: React.FC<AgentLayoutProps> = ({ agents }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleClose = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="flex">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleSidebar={handleToggleSidebar} agents={agents} onAgentSelect={handleAgentSelect} />
      <div className="flex-grow p-4">
        {selectedAgent ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedAgent.agent_name}</h2>
            <div className="mb-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => alert('Edit Agent Clicked')}>Edit Agent</button>
              <button className="bg-green-500 text-white py-2 px-4 rounded ml-2" onClick={() => alert('Upload Audio File Clicked')}>Upload Audio File</button>
            </div>
            <DisplayAgentModalCallAnalysis agent={selectedAgent} onClose={handleClose} />
          </div>
        ) : (
          <div>Select an agent to see details</div>
        )}
      </div>
    </div>
  );
};

export default AgentLayout;
