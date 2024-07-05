import { useState } from "react";
import AgentTabCallAnalysis from "./AgentTabCallAnalysis";
import LLMTabCallAnalysis from "./LLMTabCallAnalysis";
import VoiceTabCallAnalysis from "./VoiceTabCallAnalysis";

interface CreateAgentFormProps {
  onClose: () => void;
  onCreate: (result: any) => void;
}

interface FormData {
  agent_name: string;
  prompt: string;
  llmmodel: string;
  language: string;
}

export default function CreateAgentFormCallAnalysis({ onClose, onCreate }: CreateAgentFormProps) {
  const [activeTab, setActiveTab] = useState("Agent");
  const [formData, setFormData] = useState<FormData>({
    agent_name: "",
    prompt: "",
    llmmodel: "",
    language: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/ui_routes/add_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_uuid: "d752bf64-4240-4414-89bb-37d830d3c263",
          agent_name: formData.agent_name,
          configuration_log: {
            ai_prompt: formData.prompt,
            LLMModel: formData.llmmodel,
            language: formData.language,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Agent created successfully:', result);
      onCreate(result); // Call the onCreate callback with the newly created agent
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating agent:', error);
      // You might want to show an error message to the user here
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Agent":
        return <AgentTabCallAnalysis formData={formData} handleChange={handleChange} />;
      case "Model":
        return <LLMTabCallAnalysis formData={formData} handleChange={handleChange} />;
      case "Language":
        return <VoiceTabCallAnalysis formData={formData} handleChange={handleChange} />;
      default:
        return <div>Tab content not available</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex space-x-4 mb-6">
        {["Agent", "Model", "Language"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {renderTabContent()}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Agent
          </button>
        </div>
      </form>
    </div>
  );
}
