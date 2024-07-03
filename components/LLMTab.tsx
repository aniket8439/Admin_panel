export default function LLMTab({ formData, handleChange }) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">LLM Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Provider</label>
          <select
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="retell">Retell</option>
            <option value="bolna">Bolna</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            name="llmmodel"
            value={formData.llmmodel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="claude-3.5-sonnet">claude-3.5-sonnet</option>
            <option value="claude-3-haiku">claude-3-haiku</option>
          </select>
        </div>
      </div>
    );
  }