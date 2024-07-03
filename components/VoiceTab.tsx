export default function VoiceTab({ formData, handleChange }) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Voice Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Voice ID</label>
          <select
            name="voice_id"
            value={formData.voice_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="11labs-Adrian">11labs-Adrian</option>
            <option value="custom-Shanaya">custom-Shanaya</option>
            <option value="deepgram-Luna">deepgram-Luna</option>
            <option value="openai-alloy">openai-alloy</option>
          </select>
        </div>
      </div>
    );
  }