import React from 'react';
import { FaMicrophone, FaPhone } from 'react-icons/fa';

interface Agent {
  id: string;
  agent_name: string;
  type: 'voice-ai' | 'call-analysis';
}

interface AgentSidebarProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onAgentSelect: (agentId: string) => void;
  type: 'voice-ai' | 'call-analysis';
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ agents, selectedAgentId, onAgentSelect, type }) => {
  const filteredAgents = agents.filter(agent => agent.type === type);

  return (
    <div className="w-64 bg-gray-100 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">
          {type === 'voice-ai' ? (
            <><FaMicrophone className="inline-block mr-2" /> Voice AI Agents</>
          ) : (
            <><FaPhone className="inline-block mr-2" /> Call Analysis Agents</>
          )}
        </h2>
        <ul>
          {filteredAgents.map(agent => (
            <li key={agent.id} className="mb-2">
              <button
                onClick={() => onAgentSelect(agent.id)}
                className={`w-full text-left py-2 px-4 rounded ${
                  selectedAgentId === agent.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                {agent.agent_name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgentSidebar;