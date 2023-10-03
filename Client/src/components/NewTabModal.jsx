import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useState } from 'react';

const NewTabModal = ({callBack, isOpen, setModal}) => {   
   const [value, setValue] = useState('');

   const closeModal = ()=>{
      setValue('');
      setModal(false);
   }

   const callbackEvent = (value) =>{
      callBack(value);
   }

   return (
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Новый раздел</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h2 >Название нового раздела:</h2>
            <Input mt='2' placeholder='Название' 
               value={value} onChange={(e)=>{setValue(e.target.value)}}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>{
               closeModal();
               callbackEvent(value);
            }}>
              Добавить
            </Button>
            <Button variant='ghost' onClick={()=>{
               closeModal();
            }}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   );
};

export default NewTabModal;