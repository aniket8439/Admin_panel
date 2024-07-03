// components/SelectLLMAgent.tsx
export default function SelectLLMAgent({ onSelect }) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Select LLM Agent</h3>
        <div
          onClick={() => onSelect("single-prompt")}
          className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <h4 className="font-medium">Single-Prompt Agent</h4>
          <p className="text-sm text-gray-600">Create a single-prompt agent for your tasks</p>
        </div>
      </div>
    );
  }