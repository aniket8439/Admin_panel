"use client";

import { useState, useEffect } from "react";
import { Box, Button, Heading, Text, Flex, Center, Spinner, useToast, VStack } from "@chakra-ui/react";
import AddAgentModal from "@/components/AddAgentModal";
import DisplayAgentModal from "@/components/DisplayAgentModal";

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

export default function VoiceAI() {
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/agents/3a6529f1-06d2-448c-8899-6feeff886f13');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(data.agents);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = (newAgent: Agent) => {
    setAgents([newAgent, ...agents]);
    setSelectedAgent(newAgent);
    setIsAddAgentModalOpen(false);
  };

  const handleSelectAgent = (agent: Agent) => {
    if (selectedAgent && selectedAgent.agent_id === agent.agent_id) {
      setSelectedAgent(null); // Toggle off if the same agent is clicked again
    } else {
      setSelectedAgent(agent); // Set the selected agent
    }
  };

  return (
    <Flex direction="column" height="100vh" bg="gray.50">
      <Box p={4} bg="blue.500" borderBottom="1px solid" borderColor="gray.300">
        <Center>
          <Heading as="h1" size="lg" color="white">Voice AI</Heading>
        </Center>
      </Box>
      <Flex flex="1" overflow="hidden">
        <Box w="25%" p={4} overflowY="auto" borderRight="1px solid" borderColor="gray.300" bg="white">
          <Button
            colorScheme="blue"
            onClick={() => setIsAddAgentModalOpen(true)}
            mb={4}
            w="full"
          >
            Add Agent
          </Button>
          {loading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : agents.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {agents.map((agent) => (
                <Box
                  key={agent.agent_id}
                  bg={selectedAgent?.agent_id === agent.agent_id ? "blue.100" : "gray.100"}
                  p={4}
                  rounded="md"
                  cursor="pointer"
                  _hover={{ bg: "gray.200" }}
                  onClick={() => handleSelectAgent(agent)}
                  boxShadow="sm"
                >
                  <Heading as="h3" size="sm" fontWeight="bold">{agent.agent_name}</Heading>
                </Box>
              ))}
            </VStack>
          ) : (
            <Center>
              <Text color="gray.500">No agents found</Text>
            </Center>
          )}
        </Box>

        {selectedAgent && (
          <Box w="75%" p={4} overflowY="auto" bg="white">
            <DisplayAgentModal
              agent={selectedAgent}
              onClose={() => setSelectedAgent(null)}
            />
          </Box>
        )}
      </Flex>

      <AddAgentModal
        isOpen={isAddAgentModalOpen}
        onClose={() => setIsAddAgentModalOpen(false)}
        onAddAgent={handleAddAgent}
      />
    </Flex>
  );
}
