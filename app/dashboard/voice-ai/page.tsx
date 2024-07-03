// "use client";

// import { useState } from "react";
// import CreateAgent from "../../../components/CreateAgent";

// export default function VoiceAI() {
//   const [agents, setAgents] = useState<any[]>([]);

//   const handleAgentCreated = (newAgent: any) => {
//     setAgents([...agents, newAgent]);
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Voice AI</h1>
//       <CreateAgent onAgentCreated={handleAgentCreated} />
//       {agents.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4">Created Agents</h2>
//           {agents.map((agent, index) => (
//             <div key={index} className="bg-gray-100 p-4 rounded mb-4">
//               <h3 className="font-bold">{agent.name}</h3>
//               <p>{agent.description}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// app/dashboard/voice-ai/page.tsx
"use client";

import { useState } from "react";
import AddAgentModal from "@/components/AddAgentModal";
import AgentDetails from "@/components/AgentDetails";

export default function VoiceAI() {
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleAddAgent = (newAgent) => {
    setAgents([...agents, newAgent]);
    setIsAddAgentModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Voice AI</h1>
        <button
          onClick={() => setIsAddAgentModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Agent
        </button>
      </div>

      {selectedAgent ? (
        <AgentDetails agent={selectedAgent} />
      ) : (
        <div className="text-center text-gray-500">Select an agent to view details</div>
      )}

      <AddAgentModal
        isOpen={isAddAgentModalOpen}
        onClose={() => setIsAddAgentModalOpen(false)}
        onAddAgent={handleAddAgent}
      />
    </div>
  );
}