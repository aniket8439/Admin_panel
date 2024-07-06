import React, { useState } from 'react';
import { Box, Button, Flex, Heading, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";

interface AgentConfig {
  begin_message: string;
  prompt: string;
  llmmodel: string;
  voice_id: string;
}

interface Agent {
  agent_id: string;
  agent_name: string;
  config: AgentConfig;
}

interface DisplayAgentDetailsProps {
  agent: Agent;
  onClose: () => void;
}

const DisplayAgentModal: React.FC<DisplayAgentDetailsProps> = ({ agent, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgent, setEditedAgent] = useState(agent);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you should save the changes to the server or state
    console.log("Saved agent details:", editedAgent);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAgent({
      ...editedAgent,
      config: {
        ...editedAgent.config,
        [name]: value
      }
    });
  };

  const handlePhoneCall = () => {
    console.log("Phone call option clicked");
    // Implement the logic for phone call
  };

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h2" size="lg" cursor="pointer" onClick={onClose}>
          {agent.agent_name}
        </Heading>
        <Flex>
          {!isEditing ? (
            <>
              <Button
                onClick={handleEdit}
                colorScheme="blue"
                mr={2}
              >
                Edit Agent
              </Button>
              <Button
                onClick={handlePhoneCall}
                colorScheme="green"
                mr={2}
              >
                Phone Call
              </Button>
              <Button
                onClick={onClose}
                colorScheme="red"
              >
                Close
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSave}
              colorScheme="blue"
              mr={2}
            >
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
            value={editedAgent.config.begin_message}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Prompt</FormLabel>
          <Textarea
            name="prompt"
            value={editedAgent.config.prompt}
            readOnly={!isEditing}
            onChange={handleInputChange}
            rows={6}
          />
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>LLM Model</FormLabel>
          <Input
            type="text"
            name="llmmodel"
            value={editedAgent.config.llmmodel}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isReadOnly={!isEditing}>
          <FormLabel>Voice ID</FormLabel>
          <Input
            type="text"
            name="voice_id"
            value={editedAgent.config.voice_id}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default DisplayAgentModal;
