"use client";
import React, { useState, useEffect } from "react";
import {
  useToast,
  Spinner,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Text,
  VStack,
  HStack,
  Heading,
} from "@chakra-ui/react";

interface AnalysisResponse {
  agent_id: string;
  ai_response: string;
  created_at: string;
  extraction: string;
  log_id: string;
  pitch_results: string;
  timestamp: string;
  transcript: string;
  updated_at: string;
}

const CallAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [analysisResponses, setAnalysisResponses] = useState<AnalysisResponse[]>([]);
  const toast = useToast();

  useEffect(() => {
    handleGetAnalysisResponse();
  }, []);

  const showToast = (title: string, status: "info" | "warning" | "success" | "error") => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleGetAnalysisResponse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analysis_routes/execution_logs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResponses(data);
      //showToast("Response received successfully", "success");
    } catch (error) {
      showToast("An error occurred while getting the response", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
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

  const PitchResultsBadges = ({ pitchResults }: { pitchResults: string }) => {
    const results = JSON.parse(pitchResults);
    return (
      <HStack spacing={2}>
        {Object.entries(results).map(([key, value]) => (
          <Badge key={key} colorScheme={value ? "red" : "green"}>
            {key.replace(/_/g, ' ')}: {value ? "Yes" : "No"}
          </Badge>
        ))}
      </HStack>
    );
  };

  const AIResponse = ({ aiResponse }: { aiResponse: string }) => {
    let parsedResponse: any;

    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      return <Text>Error parsing AI response</Text>;
    }

    const renderSection = (title: string, content: any) => (
      <Box>
        <Heading as="h3" size="sm">{title}</Heading>
        <Text whiteSpace="pre-wrap">{content}</Text>
      </Box>
    );

    return (
      <VStack align="stretch" spacing={4}>
        {parsedResponse.script_follow && renderSection("Script Follow", parsedResponse.script_follow)}
        {parsedResponse.sales_pitch && renderSection("Sales Pitch", parsedResponse.sales_pitch)}
        {parsedResponse.redflags && renderSection("Red Flags", parsedResponse.redflags)}
        {parsedResponse.info_extraction && renderSection("Info Extraction", parsedResponse.info_extraction)}
        {parsedResponse.final_result && renderSection("Final Result", parsedResponse.final_result)}
        {parsedResponse.actions && renderSection("Actions", parsedResponse.actions)}
        {parsedResponse.suggestions && renderSection("Suggestions", parsedResponse.suggestions)}
      </VStack>
    );
  };

  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={5}>Execution Logs</Heading>
      {loading ? (
        <Spinner size="xl" color="blue.500" />
      ) : (
        <Accordion allowMultiple>
          {analysisResponses.map((response, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Log ID: {response.log_id}</Text>
                    <Text fontSize="sm">{formatDateTime(response.timestamp)}</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading as="h3" size="sm">AI Response</Heading>
                    <AIResponse aiResponse={response.ai_response} />
                  </Box>
                  <Box>
                    <Heading as="h3" size="sm">Pitch Results</Heading>
                    <PitchResultsBadges pitchResults={response.pitch_results} />
                  </Box>
                  <Box>
                    <Heading as="h3" size="sm">Transcript</Heading>
                    <Text whiteSpace="pre-wrap">{response.transcript}</Text>
                  </Box>
                  {response.extraction && (
                    <Box>
                      <Heading as="h3" size="sm">Extraction</Heading>
                      <Text>{response.extraction}</Text>
                    </Box>
                  )}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Box>
  );
};

export default CallAnalysis;
