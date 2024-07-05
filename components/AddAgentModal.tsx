import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import CreateAgentForm from "./CreateAgentForm";

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgent: (agent: any) => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onAddAgent }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Agent</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateAgentForm onCreate={onAddAgent} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddAgentModal;
