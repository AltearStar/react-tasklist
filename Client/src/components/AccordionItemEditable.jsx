import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
   AccordionButton,
   AccordionIcon,
   AccordionItem,
   AccordionPanel,
   Box
} from "@chakra-ui/react";
import React, { useState } from "react";
import { store } from "../ReduxStore";
import { removeTodo, updateTodo } from "../ReduxStore/todoDataReducer";
import EditComponent from "./EditComponent";

const AccordionItemEditable = ({ data }) => {
   const [taskWriteble, setTaskWriteble] = useState(false);
   
   const updateRecord = (newData) => {
      setTaskWriteble(false);
      store.dispatch(updateTodo({...data, ...newData, responce: false}));
   };

   const undoRecord = () => {
      setTaskWriteble(false);
   };

   const editRecord = (event) => {
      event.stopPropagation();
      setTaskWriteble(true);
   };

   const deleteRecord = (event) => {
      event.stopPropagation();
      store.dispatch(removeTodo({id: data.id}))
   };

   return (
      <>
         <AccordionItem>
            <Box hidden={taskWriteble}>
               <h2>
                  <AccordionButton>
                     <Box fontWeight="500" as="span" flex="1" textAlign="left">
                        {data.name}
                     </Box>
                     <AccordionIcon />
                     <EditIcon ml="2" onClick={editRecord} />
                     <DeleteIcon ml="2" onClick={deleteRecord} />
                  </AccordionButton>
               </h2>
               <AccordionPanel textAlign="left" pb={4}>
                  {/* <plaintext style={{fontStyle: "16px"}}>{data.desc}</plaintext> */}
                  {data.desc}
               </AccordionPanel>
            </Box>
           <EditComponent onSave={updateRecord} onUndo={undoRecord} data={data} hidden={!taskWriteble}/>
         </AccordionItem>
      </>
   );
};

export default AccordionItemEditable;
