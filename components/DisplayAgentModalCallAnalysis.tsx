import React, { useState } from 'react';
import { Box, Button, Flex, Heading, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";
import UploadAudioFile from './UploadAudioFile';

interface Agent {
  agent_name: string;
  prompt: string;
  llmmodel: string;
  language: string;
}

interface DisplayAgentDetailsProps {
  agent: Agent;
  onClose: () => void;
}

const DisplayAgentModalCallAnalysis: React.FC<DisplayAgentDetailsProps> = ({ agent, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editedAgent, setEditedAgent] = useState(agent);

  const handleEdit = () => {
    setIsEditing(true);
    setIsUploading(false);
  };

  const handleSave = () => {
    // Implement save logic
    console.log("Saved agent details:", editedAgent);
    setIsEditing(false);
  };

  const handleUploadAudio = () => {
    setIsEditing(false);
    setIsUploading(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAgent({ ...editedAgent, [name]: value });
  };

  const handleAudioSubmit = (file: File | null, doVoiceAnalysis: boolean) => {
    // Implement file upload and voice analysis logic
    console.log("File:", file);
    console.log("Do Voice Analysis:", doVoiceAnalysis);
    setIsUploading(false);
  };

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
              <Button onClick={onClose} colorScheme="red">
                Close
              </Button>
            </>
          ) : isEditing ? (
            <Button onClick={handleSave} colorScheme="blue" mr={2}>
              Save Agent
            </Button>
          ) : null}
        </Flex>
      </Flex>
      {isEditing && (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Agent Name</FormLabel>
            <Input
              type="text"
              name="agent_name"
              value={editedAgent.agent_name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Prompt</FormLabel>
            <Textarea
              name="prompt"
              value={editedAgent.prompt}
              onChange={handleInputChange}
              rows={6}
            />
          </FormControl>
          <FormControl>
            <FormLabel>LLM Model</FormLabel>
            <Input
              type="text"
              name="llmmodel"
              value={editedAgent.llmmodel}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Language</FormLabel>
            <Input
              type="text"
              name="language"
              value={editedAgent.language}
              onChange={handleInputChange}
            />
          </FormControl>
        </VStack>
      )}
      {isUploading && (
        <UploadAudioFile onSubmit={handleAudioSubmit} onClose={() => setIsUploading(false)} />
      )}
    </Box>
  );
};

export default DisplayAgentModalCallAnalysis;
