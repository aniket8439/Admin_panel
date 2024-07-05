// components/GetAgentDetails.tsx
import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  agent_name: string;
  // Add other properties as needed
}

export default function GetAgentDetails() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/get_voice_agents');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Voice Agents</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent.id} className="mb-2">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {/* Handle click to show agent details */}}
            >
              {agent.agent_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}