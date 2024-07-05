import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, Checkbox, VStack, useToast } from "@chakra-ui/react";

interface UploadAudioFileProps {
  onSubmit: (file: File | null, doVoiceAnalysis: boolean) => void;
  onClose: () => void;
}

const UploadAudioFile: React.FC<UploadAudioFileProps> = ({ onSubmit, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [doVoiceAnalysis, setDoVoiceAnalysis] = useState(false);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('agent_id', '53aeee63-9703-476a-8b05-d4b99d6472a3');
    formData.append('callback_url', 'https://ai-analysis-woiveba7pq-el.a.run.app/analysis_routes/callback');
    formData.append('audio_file', selectedFile);

    try {
      const response = await axios.post('https://ai-call-progression-analysis-woiveba7pq-as.a.run.app/analysis_routes/call_analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: "Success",
        description: "File uploaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onSubmit(selectedFile, doVoiceAnalysis);
    } catch (error) {
      toast({
        title: "Error",
        description: "File upload failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" w="full" boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Upload Audio File</FormLabel>
          <Input type="file" accept="audio/*" onChange={handleFileChange} />
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <Checkbox isChecked={doVoiceAnalysis} onChange={(e) => setDoVoiceAnalysis(e.target.checked)}>
            Perform Voice Analysis
          </Checkbox>
        </FormControl>
        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit
        </Button>
        <Button colorScheme="red" onClick={onClose}>
          Cancel
        </Button>
      </VStack>
    </Box>
  );
};

export default UploadAudioFile;
