import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Flex, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Select, 
  VStack, 
  Spinner, 
  useToast 
} from "@chakra-ui/react";
import UploadAudioFile from './UploadAudioFile';

interface Agent {
  agent_id: string;
  agent_name: string;
  configuration_log: {
    ai_prompt: string;
    LLMModel: string;
    language: string;
  };
}

interface DisplayAgentDetailsProps {
  agent_id: string;
  onAgentUpdated: () => void; // Add this prop
}

const DisplayAgentModalCallAnalysis: React.FC<DisplayAgentDetailsProps> = ({ agent_id, onAgentUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResponse, setAnalysisResponse] = useState<any>(null); // State to store the response data

  const toast = useToast();

  useEffect(() => {
    fetchAgentDetails();
  }, [agent_id]);

  const fetchAgentDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`https://ai-analysis1-woiveba7pq-as.a.run.app/analysis_routes/agent/${agent_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAgent(data);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      setError('Failed to fetch agent details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!agent) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`https://ai-analysis1-woiveba7pq-as.a.run.app/ui_routes/edit_agent/${agent_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          agent_name: agent.agent_name,
          configuration_log: {
            ai_prompt: agent.configuration_log.ai_prompt || "",
            LLMModel: agent.configuration_log.LLMModel || "",
            language: agent.configuration_log.language || "",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Agent updated",
        description: "The agent has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Re-fetch the updated agent details
      fetchAgentDetails();
      setIsEditing(false);
      onAgentUpdated(); // Trigger the callback to update the agent list
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Update failed",
        description: "Failed to update the agent. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUploadAudio = () => {
    setIsEditing(false);
    setIsUploading(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgent(prev => {
      if (!prev) return null;
      if (name === 'agent_name') {
        return { ...prev, agent_name: value };
      } else {
        return {
          ...prev,
          configuration_log: {
            ...prev.configuration_log,
            [name]: value,
          },
        };
      }
    });
  };

  const handleAudioSubmit = (file: File | null, doVoiceAnalysis: boolean) => {
    console.log("File:", file);
    console.log("Do Voice Analysis:", doVoiceAnalysis);
    setIsUploading(false);
  };

  const handleGetResponse = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://ai-analysis1-woiveba7pq-as.a.run.app/analysis_routes/logs/${agent_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResponse(data);
      toast({
        title: "Response received successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Failed to get response",
        description: "An error occurred while getting the response",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !agent) {
    return <Box>{error || 'Failed to load agent details.'}</Box>;
  }

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h2" size="lg">{agent.agent_name}</Heading>
        <Flex>
          {!isEditing && !isUploading ? (
            <>
              <Button onClick={handleEdit} colorScheme="blue" mr={2}>
                Edit Agent
              </Button>
              <Button onClick={handleUploadAudio} colorScheme="green" mr={2}>
                Upload Audio File
              </Button>
              <Button onClick={handleGetResponse} colorScheme="purple" mr={2}>
                Get Response
              </Button>
            </>
          ) : isEditing ? (
            <Button onClick={handleSave} colorScheme="blue" mr={2}>
              Save Agent
            </Button>
          ) : null}
        </Flex>
      </Flex>
      {isEditing ? (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Agent Name</FormLabel>
            <Input
              type="text"
              name="agent_name"
              value={agent.agent_name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Prompt</FormLabel>
            <Textarea
              name="ai_prompt"
              value={agent.configuration_log?.ai_prompt || ""}
              onChange={handleInputChange}
              rows={6}
            />
          </FormControl>
          <FormControl>
            <FormLabel>LLM Model</FormLabel>
            <Select
              name="LLMModel"
              value={agent.configuration_log?.LLMModel || ""}
              onChange={handleInputChange}
            >
              <option value="nova-2">nova-2</option>
              <option value="whisper-cloud">whisper-cloud</option>
              <option value="enhanced">enhanced</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Language</FormLabel>
            <Select
              name="language"
              value={agent.configuration_log?.language || ""}
              onChange={handleInputChange}
            >
              <option value="en">en - English</option>
              <option value="hi">hi - Hindi</option>
            </Select>
          </FormControl>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          <Box>
            <strong>Agent Name:</strong> {agent.agent_name}
          </Box>
          <Box>
            <strong>Prompt:</strong> {agent.configuration_log?.ai_prompt || ""}
          </Box>
          <Box>
            <strong>LLM Model:</strong> {agent.configuration_log?.LLMModel || ""}
          </Box>
          <Box>
            <strong>Language:</strong> {agent.configuration_log?.language || ""}
          </Box>
        </VStack>
      )}
      {isUploading && (
        <UploadAudioFile 
          agent_id={agent.agent_id} // Pass the agent_id to UploadAudioFile
          onSubmit={handleAudioSubmit} 
          onClose={() => setIsUploading(false)} 
        />
      )}
    </Box>
  );
};

export default DisplayAgentModalCallAnalysis;
