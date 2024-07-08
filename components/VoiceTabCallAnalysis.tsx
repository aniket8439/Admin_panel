import React from 'react';

interface FormData {
  language: string;
}

interface VoiceTabCallAnalysisProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const VoiceTabCallAnalysis: React.FC<VoiceTabCallAnalysisProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Language Settings</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Language</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="en">en</option>
          <option value="hi">hi</option>
        </select>
      </div>
    </div>
  );
};

export default VoiceTabCallAnalysis;
