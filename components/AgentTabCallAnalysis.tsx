import React from 'react';

interface FormData {
  agent_name: string;
  prompt: string;
}

interface AgentTabCallAnalysisProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AgentTabCallAnalysis: React.FC<AgentTabCallAnalysisProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Agent Name</label>
        <input
          type="text"
          name="agent_name"
          value={formData.agent_name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <h2 className="text-xl font-bold mb-4">Agent Prompt</h2>
      <textarea
        name="prompt"
        value={formData.prompt}
        onChange={handleChange}
        rows={10}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default AgentTabCallAnalysis;
