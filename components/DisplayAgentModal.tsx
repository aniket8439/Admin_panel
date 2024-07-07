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
  VStack, 
  useToast,
  Spinner,
  Select 
} from "@chakra-ui/react";
import PlaceCallModal from './PlaceCallModal'; // Import the new component

interface AgentConfig {
  begin_message?: string;
  prompt?: string;
  llmmodel?: string;
  voice_id?: string;
  dynamic_variables?: string[];
}

interface Agent {
  agent_id: string;
  agent_name: string;
  config?: AgentConfig;
}

interface DisplayAgentDetailsProps {
  agent: Agent;
  onClose: () => void;
  onAgentUpdated: () => void;
}

const DisplayAgentModal: React.FC<DisplayAgentDetailsProps> = ({ agent: initialAgent, onClose, onAgentUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [agent, setAgent] = useState<Agent>(initialAgent);
  const [isPlacingCall, setIsPlacingCall] = useState(false); // State for placing call
  const toast = useToast();

  useEffect(() => {
    setAgent(initialAgent);
  }, [initialAgent]);

  const handleSave = async () => {
    if (!agent) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/update_agent/${agent.agent_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(agent),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgent(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: value
      }
    }));
  };

  const handleAgentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!agent) {
    return (
      <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
        <Spinner />
      </Box>
    );
  }

  const dynamicVariables = agent.config?.dynamic_variables ?? [];

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
      <PlaceCallModal
        agentId={agent.agent_id}
        dynamicVariables={dynamicVariables}
        isOpen={isPlacingCall}
        onClose={() => setIsPlacingCall(false)}
      />
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h2" size="lg">{isEditing ? (
          <Input
            type="text"
            name="agent_name"
            value={agent.agent_name}
            onChange={handleAgentNameChange}
          />
        ) : (
          agent.agent_name
        )}</Heading>
        <Flex>
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} colorScheme="blue" mr={2}>
                Edit Agent
              </Button>
              <Button onClick={() => setIsPlacingCall(true)} colorScheme="green" mr={2}>
                Place Call
              </Button>
              <Button onClick={onClose} colorScheme="red">
                Close
              </Button>
            </>
          ) : (
            <Button onClick={handleSave} colorScheme="blue" mr={2}>
              Save Agent
            </Button>
          )}
        </Flex>
      </Flex>
      <VStack spacing={4} align="stretch">
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Begin Message</FormLabel>
          <Input
            type="text"
            name="begin_message"
            value={agent.config?.begin_message ?? ''}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Prompt</FormLabel>
          <Textarea
            name="prompt"
            value={agent.config?.prompt ?? ''}
            readOnly={!isEditing}
            onChange={handleInputChange}
            rows={6}
          />
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>LLM Model</FormLabel>
          {isEditing ? (
            <Select
              name="llmmodel"
              value={agent.config?.llmmodel ?? ''}
              onChange={handleInputChange}
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              <option value="gpt-4-turbo" disabled>gpt-4-turbo</option>
              <option value="gpt-4o" disabled>gpt-4o</option>
              <option value="claude-3.5-sonnet" disabled>claude-3.5-sonnet</option>
              <option value="claude-3-haiku" disabled>claude-3-haiku</option>
            </Select>
          ) : (
            <Input
              type="text"
              name="llmmodel"
              value={agent.config?.llmmodel ?? ''}
              readOnly
            />
          )}
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Voice ID</FormLabel>
          {isEditing ? (
            <Select
              name="voice_id"
              value={agent.config?.voice_id ?? ''}
              onChange={handleInputChange}
            >
              <option value="11labs-Adrian">11labs-Adrian</option>
              <option value="custom-Shanaya">custom-Shanaya</option>
              <option value="deepgram-Luna">deepgram-Luna</option>
              <option value="openai-alloy">openai-alloy</option>
            </Select>
          ) : (
            <Input
              type="text"
              name="voice_id"
              value={agent.config?.voice_id ?? ''}
              readOnly
            />
          )}
        </FormControl>
      </VStack>
    </Box>
  );
};

export default DisplayAgentModal;
