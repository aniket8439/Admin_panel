"use client";

import { useState, useEffect } from "react";
import { Box, Button, Heading, Text, Flex, Center, Spinner, useToast, VStack } from "@chakra-ui/react";
import AddAgentModalCallAnalysis from "@/components/AddAgentModalCallAnalysis";
import DisplayAgentModalCallAnalysis from "@/components/DisplayAgentModalCallAnalysis";

interface Agent {
  agent_id: string;
  agent_name: string;
  prompt?: string;
  llmmodel?: string;
  language?: string;
}

export default function CallAnalysis() {
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
      console.log('Fetched agents:', data); // Log the fetched data
      setAgents(data || []); // Ensure agents is always an array
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
    setSelectedAgentId(newAgent.agent_id);
    fetchAgents(); // Fetch agents after adding a new one
    setIsAddAgentModalOpen(false);
  };

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId); // Set the selected agent without toggling
  };

  return (
    <Flex direction="column" height="100vh" bg="gray.50">
      <Box p={4} bg="blue.500" borderBottom="1px solid" borderColor="gray.300">
        <Center>
          <Heading as="h1" size="lg" color="white">Call Analysis</Heading>
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
              {agents.map((agent, index) => (
                <Box
                  key={index}
                  bg={selectedAgentId === agent.agent_id ? "blue.100" : "gray.100"}
                  p={4}
                  rounded="md"
                  cursor="pointer"
                  _hover={{ bg: "gray.200" }}
                  onClick={() => handleSelectAgent(agent.agent_id)}
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

        {selectedAgentId && (
          <Box w="75%" p={4} overflowY="auto" bg="white">
            <DisplayAgentModalCallAnalysis
              agent_id={selectedAgentId}
              onClose={() => setSelectedAgentId(null)}
            />
          </Box>
        )}
      </Flex>

      <AddAgentModalCallAnalysis
        isOpen={isAddAgentModalOpen}
        onClose={() => setIsAddAgentModalOpen(false)}
        onAddAgent={handleAddAgent}
        onAgentCreated={fetchAgents} // Pass fetchAgents to fetch agents after creation
      />
    </Flex>
  );
}
