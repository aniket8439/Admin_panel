"use client"

import React from 'react';
import CreateAgentFormCallAnalysis from "./CreateAgentFormCallAnalysis";

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgent: (agent: any) => void;
}

const AddAgentModalCallAnalysis: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onAddAgent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Create New Agent</h2>
        <CreateAgentFormCallAnalysis
          onCreate={onAddAgent}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default AddAgentModalCallAnalysis;
