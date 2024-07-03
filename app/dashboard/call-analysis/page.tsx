"use client"
import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";

const CallAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const uploadModal = useDisclosure();

  const handleFile = (file: File) => {
    setFileName(file.name);
    setSelectedFile(file);
  };

  const handleClick = () => {
    if (hiddenFileInput.current !== null) hiddenFileInput.current.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0];
    if (fileUploaded) {
      handleFile(fileUploaded);
    }
  };

  const showToast = (title: string, status: "info" | "warning" | "success" | "error") => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleFileSubmit = async () => {
    if (!selectedFile) {
      showToast("Please select a file before submitting.", "warning");
      return;
    }

    try {
      setLoading(true);
      // Handle the file upload logic here, such as sending it to an API or processing it locally
      // Since we're not using any backend, we'll just simulate an upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast("File Uploaded Successfully", "success");
    } catch (error) {
      showToast("An error occurred during file upload", "error");
    } finally {
      setLoading(false);
      setFileName("");
      setSelectedFile(null);
      uploadModal.onClose();
    }
  };

  return (
    <>
      <div className="flex flex-col align-middle items-center justify-center gap-2">
        <div className="text-2xl font-bold">Upload Your Audio for Analysis</div>
        <div
          onClick={uploadModal.onOpen}
          className="flex gap-1 items-center p-2 cursor-pointer bg-blue-500 text-white text-center rounded-sm transition duration-300 ease-in-out"
        >
          <FiUpload className="text-xl" />
          <span>Upload Your File (Mp3, WAV, Mp4... Format)</span>
        </div>
      </div>
      <Modal isOpen={uploadModal.isOpen} onClose={uploadModal.onClose}>
        <ModalOverlay />
        <ModalContent className="flex mx-2 my-auto">
          <ModalHeader className="text-center text-base">
            Upload Your Audio for Analysis (Mp3, WAV, Mp4.. Format)
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="mb-4 space-y-2">
            <div
              onClick={handleClick}
              className="flex gap-1 items-center justify-center text-blue-500 p-2 cursor-pointer border-dashed border border-blue-500 text-center rounded-sm transition duration-300 ease-in-out"
            >
              <FiUpload className="text-xl" />
              <span>Upload File</span>
            </div>
            {fileName && <span className="text-sm text-gray-500">{fileName}</span>}
            <input
              type="file"
              onChange={handleChange}
              ref={hiddenFileInput}
              accept=".mp3, .wav, .mp4, .aac, .amr, .m4a"
              style={{ display: "none" }}
            />
          </ModalBody>

          {selectedFile && (
            <ModalFooter>
              <button
                onClick={handleFileSubmit}
                className="bg-blue-500 text-lg flex gap-2 mr-2 justify-center items-center align-middle mt-4 px-2 py-1 text-white rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading && <Spinner color="white" />} <span>Submit</span>
              </button>
              <button
                onClick={uploadModal.onClose}
                disabled={loading}
                className="bg-red-500 text-lg flex gap-2 justify-center items-center align-middle mt-4 px-2 py-1 text-white rounded-md hover:bg-blue-600"
              >
                Cancel
              </button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CallAnalysis;
