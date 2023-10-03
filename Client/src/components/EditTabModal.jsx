import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const EditTabModal = ({callBack, isOpen, setModal, itemValue}) => {   
   const [value, setValue] = useState('');

   console.log(itemValue);
   const closeModal = ()=>{
      setModal(false);
   }

   const callbackEvent = (value) =>{
      callBack({...itemValue, name: value});
   }

   useEffect(()=>{
      setValue(itemValue.name);
   },[itemValue])

   return (
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Изменение названия раздела</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h2 >Название раздела:</h2>
            <Input mt='2' placeholder='Название' 
               value={value} onChange={(e)=>{setValue(e.target.value)}}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>{
               closeModal();
               callbackEvent(value);
            }}>
              Сохранить
            </Button>
            <Button variant='ghost' onClick={()=>{
               closeModal();
            }}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   );
};

export default EditTabModal;