// components/AgentDetails.tsx
export default function AgentDetails({ agent }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">{agent.name}</h2>
        <p className="text-gray-600 mb-2">Agent ID: {agent.id}</p>
        <p className="text-gray-600 mb-2">Provider: {agent.provider}</p>
        <p className="text-gray-600 mb-2">Model: {agent.model}</p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Begin Message</h3>
        <p>{agent.beginMessage}</p>
        <p className="text-gray-600 mb-2">Voice ID: {agent.voiceID}</p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Prompt</h3>
        <p>{agent.prompt}</p>
      </div>
    );
  }