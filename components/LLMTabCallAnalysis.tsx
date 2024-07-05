import React from 'react';

interface FormData {
  llmmodel: string;
}

interface LLMTabCallAnalysisProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LLMTabCallAnalysis: React.FC<LLMTabCallAnalysisProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">LLM Settings</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <select
          name="llmmodel"
          value={formData.llmmodel}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="nova-2">nova-2</option>
          <option value="enhanced">enhanced</option>
          <option value="whisper-cloud">whisper-cloud</option>
        </select>
      </div>
    </div>
  );
};

export default LLMTabCallAnalysis;
