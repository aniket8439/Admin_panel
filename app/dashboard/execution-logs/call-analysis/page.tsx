"use client";
import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Select,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import UploadAudioFile from "@/components/UploadAudioFile"; // Adjust the import path as necessary

interface Agent {
  agent_id: string;
  agent_name: string;
  configuration_log?: {
    ai_prompt?: string;
    LLMModel?: string;
    language?: string;
  };
}

const CallAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResponses, setAnalysisResponses] = useState<any[]>([]); // State to store the response data
  const [showTable, setShowTable] = useState(false); // State to manage table visibility
  const [fileDetails, setFileDetails] = useState<string | null>(null); // State to store file details
  const toast = useToast();
  const uploadModal = useDisclosure();
  const [responseTime, setResponseTime] = useState<Date | null>(null); // State to store response time
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null); // State to manage selected agent
  const [agents, setAgents] = useState<Agent[]>([]); // State to store list of agents

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/analysis_routes/agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Error fetching agents",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const showToast = (title: string, status: "info" | "warning" | "success" | "error") => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleUploadSubmit = (file: File | null, doVoiceAnalysis: boolean) => {
    if (!file) {
      showToast("Please select a file before submitting.", "warning");
      return;
    }
    setFileDetails(`File: ${file.name}, Voice Analysis: ${doVoiceAnalysis ? "Yes" : "No"}`);
    uploadModal.onClose();
  };

  const handleGetAnalysisResponse = async () => {
    if (!selectedAgentId) {
      showToast("No agent selected", "warning");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`https://ai-analysis1-woiveba7pq-as.a.run.app/analysis_routes/logs/${selectedAgentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResponses(data); // Store the response data in state
      showToast("Response received successfully", "success");
      setResponseTime(new Date()); // Set the response time
      setShowTable(true); // Show the table after getting the response
    } catch (error) {
      showToast("An error occurred while getting the response", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <>
      <div className="flex flex-col align-middle items-center justify-center gap-2">
        <div className="text-2xl font-bold">Get Analysis Response</div>
        <div
          onClick={uploadModal.onOpen}
          className="flex gap-1 items-center p-2 cursor-pointer bg-blue-500 text-white text-center rounded-sm transition duration-300 ease-in-out"
        >
          <FiUpload className="text-xl" />
          <span>Upload Audio File</span>
        </div>
      </div>
      <Modal isOpen={uploadModal.isOpen} onClose={uploadModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Agent and Upload Audio File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl id="agent">
                <FormLabel>Select Agent</FormLabel>
                <Select
                  placeholder="Select Agent"
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                >
                  {agents.map((agent) => (
                    <option key={agent.agent_id} value={agent.agent_id}>
                      {agent.agent_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {selectedAgentId && (
                <UploadAudioFile
                  agent_id={selectedAgentId}
                  onSubmit={handleUploadSubmit}
                  onClose={uploadModal.onClose}
                />
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className="flex flex-col align-middle items-center justify-center gap-2 mt-4">
        <button
          onClick={handleGetAnalysisResponse}
          className="flex gap-1 items-center p-2 cursor-pointer bg-blue-500 text-white text-center rounded-sm transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading && <Spinner color="white" />}
          <span>Get Response</span>
        </button>
      </div>

      {showTable && analysisResponses.length > 0 && responseTime && (
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    DETAILS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    AI Response
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Extraction
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transcript
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analysisResponses.map((response, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Just now</div>
                      <div className="text-sm text-gray-500">{formatDateTime(new Date(response.timestamp))}</div>
                      <div className="text-sm text-gray-500">{fileDetails || "Sample File Details"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{JSON.parse(response.ai_response).script_follow}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{response.extraction}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{response.transcript}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default CallAnalysis;
