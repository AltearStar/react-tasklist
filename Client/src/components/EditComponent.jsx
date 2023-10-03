import { Box, Button, Input, Textarea } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const EditComponent = ({onSave, onUndo, data, ...props}) => {
   const [taskHeaderTemp, setTaskHeaderTemp] = useState("");
   const [taskDescriptionTemp, setTaskDescriptionTemp] = useState("");

   useEffect(()=>{
      if (data){
         setTaskHeaderTemp(data.name);
         setTaskDescriptionTemp(data.desc);
      }
   },[data]);

   const onSaveEvent=(event)=>{
      event.stopPropagation();
      onSave({name: taskHeaderTemp, desc: taskDescriptionTemp});
      console.log(data);
      if (!data){
         setTaskHeaderTemp('');
         setTaskDescriptionTemp('');
      }
   }

   const onUndoEvent = (event)=>{
      event.stopPropagation();
      onUndo();
      if (!data){
         setTaskHeaderTemp('');
         setTaskDescriptionTemp('');
      }
   }

   return (
      <Box m="2" textAlign="left" {...props}>
      <h2>Название заметки</h2>
      <Input
         value={taskHeaderTemp}
         onChange={(e) => {
            setTaskHeaderTemp(e.target.value);
         }}
      />
      <h2>Текст заметки</h2>
      <Textarea
         value={taskDescriptionTemp}
         onChange={(e) => {
            setTaskDescriptionTemp(e.target.value);
         }}
      />
      <Button
         colorScheme="teal"
         variant="solid"
         mr="2"
         mt="2"
         onClick={onSaveEvent}
      >
         Сохранить
      </Button>
      <Button
         colorScheme="teal"
         variant="outline"
         mr="2"
         mt="2"
         onClick={onUndoEvent}
      >
         Отменить
      </Button>
   </Box>
   );
};

export default EditComponent;