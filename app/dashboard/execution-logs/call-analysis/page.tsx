"use client";
import React, { useState } from "react";
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
} from "@chakra-ui/react";
import UploadAudioFile from "@/components/UploadAudioFile"; // Adjust the import path as necessary
import DisplayAgentModalCallAnalysis from "@/components/DisplayAgentModalCallAnalysis"; // Adjust the import path as necessary

const CallAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResponse, setAnalysisResponse] = useState<any>(null); // State to store the response data
  const [showTable, setShowTable] = useState(false); // State to manage table visibility
  const [fileDetails, setFileDetails] = useState<string | null>(null); // State to store file details
  const toast = useToast();
  const uploadModal = useDisclosure();
  const [responseTime, setResponseTime] = useState<Date | null>(null); // State to store response time
  const agent = {
    agent_name: "Sample Agent",
    prompt: "Sample Prompt",
    llmmodel: "Sample Model",
    language: "en",
  };
  const [showModal, setShowModal] = useState(false);

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
    // Optionally handle file upload logic here
  };

  const handleGetAnalysisResponse = async () => {
    try {
      setLoading(true);
      // Simulate an API call to get the response data
      const simulatedResponse = await new Promise((resolve) =>
        setTimeout(() => resolve({
          details: "Sample Details",
          aiResponse: "Sample AI Response",
          extraction: "Sample Extraction",
          transcript: "Sample Transcript"
        }), 2000)
      );
      setAnalysisResponse(simulatedResponse);
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
          <ModalHeader>Upload Audio File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UploadAudioFile onSubmit={handleUploadSubmit} onClose={uploadModal.onClose} />
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

      {showTable && analysisResponse && responseTime && (
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Just now</div>
                    <div className="text-sm text-gray-500">{formatDateTime(responseTime)}</div>
                    <div className="text-sm text-gray-500">{fileDetails || "Sample File Details"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{analysisResponse.aiResponse}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{analysisResponse.extraction}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{analysisResponse.transcript}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default CallAnalysis;
