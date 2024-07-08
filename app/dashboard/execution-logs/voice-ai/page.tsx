"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Text,
  Heading,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FiPhone, FiUser, FiFileText, FiPlayCircle } from "react-icons/fi";

interface VoiceAILog {
  call_id: string;
  agent_id: string;
  recording_url: string;
  disconnection_reason: string;
  call_summary: string;
  to_number: string;
  from_number: string;
}

const VoiceAI = () => {
  const [voiceAIResponse, setVoiceAIResponse] = useState<VoiceAILog[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchVoiceAILogs = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/voice_ai_logs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch voice AI logs');
        }

        const data = await response.json();
        setVoiceAIResponse(data.data || []);
      } catch (error) {
        console.error('Error fetching voice AI logs:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        toast({
          title: "Error fetching logs",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVoiceAILogs();
  }, [toast]);

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color="blue.600">
          Voice AI Logs
        </Heading>
        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="blue.500" />
          </Box>
        ) : voiceAIResponse.length > 0 ? (
          <Accordion allowMultiple>
            {voiceAIResponse.map((response, index) => (
              <AccordionItem key={index} bg="white" borderRadius="md" mb={4} boxShadow="sm">
                <h2>
                  <AccordionButton _expanded={{ bg: "blue.50" }}>
                    <Box flex="1" textAlign="left">
                      <HStack spacing={4}>
                        <Badge colorScheme="blue">{response.call_id}</Badge>
                        <Text fontWeight="bold">{response.from_number} → {response.to_number}</Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={4}>
                    <HStack>
                      <FiUser />
                      <Text fontWeight="semibold">Agent ID:</Text>
                      <Text>{response.agent_id}</Text>
                    </HStack>
                    <Box>
                      <Text fontWeight="semibold" mb={2}>Recording:</Text>
                      <audio controls style={{ width: '100%' }}>
                        <source src={response.recording_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </Box>
                    <HStack>
                      <FiPhone />
                      <Text fontWeight="semibold">Disconnection Reason:</Text>
                      <Badge colorScheme={response.disconnection_reason === "completed" ? "green" : "red"}>
                        {response.disconnection_reason}
                      </Badge>
                    </HStack>
                    <Box>
                      <HStack alignItems="flex-start">
                        <FiFileText />
                        <Text fontWeight="semibold">Call Summary:</Text>
                      </HStack>
                      <Text mt={2} pl={6}>{response.call_summary}</Text>
                    </Box>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Box textAlign="center" py={10} bg="white" borderRadius="md" boxShadow="sm">
            <Text fontSize="lg" color="gray.600">No logs available</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default VoiceAI;