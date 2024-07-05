"use client";
import React, { useState, useEffect } from "react";
import { Box, VStack, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const VoiceAI = () => {
  const [voiceAIResponse, setVoiceAIResponse] = useState<any[]>([]); // State to store the response data

  useEffect(() => {
    // Simulate an API call to get the response data
    const simulatedResponse = [
      {
        callId: "12345",
        agentId: "A1",
        recordingUrl: "https://example.com/recording1.mp3",
        disconnectionReason: "Call Ended",
        callSummary: "This is a summary of the call.",
        toNumber: "+1234567890",
        fromNumber: "+0987654321"
      }
    ];
    setVoiceAIResponse(simulatedResponse);
  }, []);

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {voiceAIResponse.length > 0 && (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Call ID</Th>
                <Th>Agent ID</Th>
                <Th>Recording</Th>
                <Th>Disconnection Reason</Th>
                <Th>Call Summary</Th>
                <Th>To Number</Th>
                <Th>From Number</Th>
              </Tr>
            </Thead>
            <Tbody>
              {voiceAIResponse.map((response, index) => (
                <Tr key={index}>
                  <Td>{response.callId}</Td>
                  <Td>{response.agentId}</Td>
                  <Td>
                    <audio controls>
                      <source src={response.recordingUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </Td>
                  <Td>{response.disconnectionReason}</Td>
                  <Td>{response.callSummary}</Td>
                  <Td>{response.toNumber}</Td>
                  <Td>{response.fromNumber}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Box>
  );
};

export default VoiceAI;
