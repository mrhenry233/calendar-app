"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }: Props) => {
  return (
    <Modal isOpen={isOpen} hideCloseButton>
      <ModalContent>
        <ModalHeader>Delete confirmation</ModalHeader>
        <ModalBody>Are you sure to delete</ModalBody>
        <ModalFooter>
          <Button onPress={onConfirm}>ลบกิจกรรม</Button>
          <Button onPress={onCancel}>ยกเลิก</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmation;
