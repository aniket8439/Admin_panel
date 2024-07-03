export default function AgentTab({ formData, handleChange }) {
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
        <h2 className="text-xl font-bold mb-4">Agent Welcome Message</h2>
        <input
          type="text"
          name="begin_message"
          value={formData.begin_message}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />
        <p className="text-sm text-gray-600 mb-4">
          This will be the initial message from the agent. You can use variables here using {"{variable_name}"}
        </p>
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
  }