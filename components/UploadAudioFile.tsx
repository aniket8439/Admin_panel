import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Checkbox, VStack } from "@chakra-ui/react";

interface UploadAudioFileProps {
  onSubmit: (file: File | null, doVoiceAnalysis: boolean) => void;
  onClose: () => void;
}

const UploadAudioFile: React.FC<UploadAudioFileProps> = ({ onSubmit, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [doVoiceAnalysis, setDoVoiceAnalysis] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedFile, doVoiceAnalysis);
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
