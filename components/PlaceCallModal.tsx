import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

interface PlaceCallModalProps {
  agentId: string;
  dynamicVariables: string[];
  isOpen: boolean;
  onClose: () => void;
}

const PlaceCallModal: React.FC<PlaceCallModalProps> = ({ agentId, dynamicVariables, isOpen, onClose }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const callData = {
        agent_id: agentId,
        callee_data: [
          {
            ...formData
          }
        ]
      };

      const response = await fetch('https://ai-analysis1-woiveba7pq-as.a.run.app/voice_ai/create_phone_call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Call initiated",
        description: "The outbound call has been initiated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error initiating call:', error);
      toast({
        title: "Call initiation failed",
        description: "Failed to initiate the call. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Place Outbound Call</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {dynamicVariables.map((variable) => (
                <FormControl key={variable}>
                  <FormLabel>{variable}</FormLabel>
                  <Input
                    type="text"
                    name={variable}
                    value={formData[variable] || ''}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              ))}
              <FormControl>
                <FormLabel>To Number</FormLabel>
                <Input
                  type="tel"
                  name="to_number"
                  value={formData.to_number || ''}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={2}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Call
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PlaceCallModal;
