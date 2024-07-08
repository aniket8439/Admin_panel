import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  VStack,
  useToast,
  Progress,
  Text,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface UploadAudioFileProps {
  agent_id: string;
  onSubmit: (file: File | null, doVoiceAnalysis: boolean) => void;
  onClose: () => void;
}

const UploadAudioFile: React.FC<UploadAudioFileProps> = ({ agent_id, onSubmit, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [doVoiceAnalysis, setDoVoiceAnalysis] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('idle');
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

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('agent_id', agent_id);
    formData.append('callback_url', 'https://ai-analysis-woiveba7pq-el.a.run.app/analysis_routes/callback');
    formData.append('audio_file', selectedFile);

    try {
      const response = await axios.post(
        'https://ai-call-progression-analysis-woiveba7pq-as.a.run.app/analysis_routes/call_analysis',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
            setUploadProgress(percentCompleted);
          },
        }
      );
      setUploadStatus('success');
      toast({
        title: "Success",
        description: "File uploaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onSubmit(selectedFile, doVoiceAnalysis);
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Error",
        description: "File upload failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box bg={bgColor} p={6} rounded="md" shadow="md" w="full" boxShadow="lg" borderWidth={1} borderColor={borderColor}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Upload Audio File</FormLabel>
          <Flex
            border="2px dashed"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            cursor="pointer"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Icon as={FiUpload} w={8} h={8} color="blue.500" mb={2} />
            <Text>{selectedFile ? selectedFile.name : 'Click or drag file to upload'}</Text>
            <Input
              id="file-input"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              hidden
            />
          </Flex>
        </FormControl>
        
        {uploadStatus === 'uploading' && (
          <Box>
            <Text mb={2}>Uploading: {uploadProgress}%</Text>
            <Progress value={uploadProgress} size="sm" colorScheme="blue" />
          </Box>
        )}
        
        {uploadStatus === 'success' && (
          <Flex align="center" color="green.500">
            <Icon as={FiCheckCircle} mr={2} />
            <Text>File uploaded successfully</Text>
          </Flex>
        )}
        
        {uploadStatus === 'error' && (
          <Flex align="center" color="red.500">
            <Icon as={FiXCircle} mr={2} />
            <Text>File upload failed</Text>
          </Flex>
        )}

        <FormControl display="flex" alignItems="center">
          <Checkbox
            isChecked={doVoiceAnalysis}
            onChange={(e) => setDoVoiceAnalysis(e.target.checked)}
            colorScheme="blue"
          >
            Perform Voice Analysis
          </Checkbox>
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={isUploading}
          loadingText="Uploading"
          isDisabled={!selectedFile || isUploading}
        >
          Submit
        </Button>
        <Button colorScheme="red" onClick={onClose} isDisabled={isUploading}>
          Cancel
        </Button>
      </VStack>
    </Box>
  );
};

export default UploadAudioFile;