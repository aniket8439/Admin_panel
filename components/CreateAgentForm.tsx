import { useState } from "react";
import AgentTab from "./AgentTab";
import LLMTab from "./LLMTab";
import VoiceTab from "./VoiceTab";

interface CreateAgentFormProps {
  onClose: () => void;
  onCreate: (result: any) => void;
}

interface FormData {
  agent_name: string;
  begin_message: string;
  prompt: string;
  provider: string;
  llmmodel: string;
  voice_id: string;
}

export default function CreateAgentForm({ onClose, onCreate }: CreateAgentFormProps) {
  const [activeTab, setActiveTab] = useState("Agent");
  const [formData, setFormData] = useState<FormData>({
    agent_name: "",
    begin_message: "Hello",
    prompt: `You are Nancy, a sophisticated AI voice agent representing UniScholars. Your task is to reach out to prospective students interested in studying abroad. Your goals are to identify their needs, provide information, guide them through the application process, and schedule counseling sessions if necessary. Maintain a polite, respectful, and empathetic tone throughout the interaction.`,
    provider: "retell",
    llmmodel: "gpt-3.5-turbo",
    voice_id: "custom-Shanaya",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/create_voice_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Agent created successfully:', result);
      const newAgent = {
        agent_id: result.agent_id,
        agent_name: formData.agent_name,
        config: {
          begin_message: formData.begin_message,
          prompt: formData.prompt,
          llmmodel: formData.llmmodel,
          voice_id: formData.voice_id,
          dynamic_variables: [],
        }
      };
      onCreate(newAgent); // Call the onCreate callback with the newly created agent
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating agent:', error);
      // You might want to show an error message to the user here
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Agent":
        return <AgentTab formData={formData} handleChange={handleChange} />;
      case "Model":
        return <LLMTab formData={formData} handleChange={handleChange} />;
      case "Voice":
        return <VoiceTab formData={formData} handleChange={handleChange} />;
      default:
        return <div>Tab content not available</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex space-x-4 mb-6">
        {["Agent", "Model", "Voice"].map((tab) => (
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
