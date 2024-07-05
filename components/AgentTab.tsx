import React from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Text, Heading } from "@chakra-ui/react";

interface FormData {
  agent_name: string;
  prompt: string;
  begin_message: string;
  [key: string]: string; // This allows for other string fields
}

interface AgentTabProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AgentTab: React.FC<AgentTabProps> = ({ formData, handleChange }) => {
  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>Agent Name</Heading>
      <FormControl mb={4}>
        <Input
          type="text"
          name="agent_name"
          value={formData.agent_name}
          onChange={handleChange}
          focusBorderColor="blue.500"
          className="w-full p-2 border rounded"
          required
        />
      </FormControl>
      <Heading as="h2" size="md" mb={4}>Agent Welcome Message</Heading>
      <FormControl mb={4}>
        <Input
          type="text"
          name="begin_message"
          value={formData.begin_message}
          onChange={handleChange}
          focusBorderColor="blue.500"
          className="w-full p-2 border rounded"
        />
      </FormControl>
      <Text fontSize="sm" color="gray.600" mb={4}>
        This will be the initial message from the agent. You can use variables here using {"{{variable_name}}"}
      </Text>
      <Heading as="h2" size="md" mb={4}>Agent Prompt</Heading>
      <FormControl mb={4}>
        <Textarea
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          rows={10}
          focusBorderColor="blue.500"
          className="w-full p-2 border rounded"
        />
      </FormControl>
    </Box>
  );
};

export default AgentTab;
