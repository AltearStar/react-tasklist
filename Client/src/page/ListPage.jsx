import { AddIcon } from "@chakra-ui/icons";
import {
   Accordion,
   Box,
   Button,
   Heading,
   IconButton,
   Spinner,
   Switch,
   Tab,
   TabList,
   TabPanel,
   TabPanels,
   Tabs,
   useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SocketAPI from "../API/SocketAPI";
import { store } from "../ReduxStore";
import { addTab, addtodo, init, setActiveTab, setOnlinceConecting, setToastMessage, setUserName, updateTab } from "../ReduxStore/todoDataReducer";
import AccordionItemEditable from "../components/AccordionItemEditable";
import EditComponent from "../components/EditComponent";
import EditTabModal from "../components/EditTabModal";
import NewTabModal from "../components/NewTabModal";

const ListPage = () => {
   const [newRecordWriter, SetNewRecordWriter] = useState(false);
   const [ isModal, setModal ] = useState(false);
   const [ isEditModal, setEditModal ] = useState(false);
   const [ editTabValue, setEditTabValue ] = useState({});
   const todos = useSelector((store) => store.todos);
   const tabs = useSelector((store) => store.tab);
   const activeTab = useSelector((store) => store.activeTab);
   const onlineParams = useSelector((store) => store.onlineParams);
   const toastMessage = useSelector((store) => store.toastMessage);
   const onlinceConecting = useSelector((store) => store.onlinceConecting);
   const toast = useToast();
   
   useEffect(()=>{
      if (toastMessage.code === "1006"){
         toast({
            title: `Ошибка подключения к серверу!`,
            status: 'error',
            position: "top-right",
            isClosable: true,
          });
          store.dispatch(setToastMessage());
      }
   },[toastMessage.code])

   const newRecord = (record) => {
      store.dispatch(addtodo({ id: Date.now(), ...record, tab: activeTab.id, responce: false }));
      SetNewRecordWriter(false);
   };

   const undoRecord = () => {
      SetNewRecordWriter(false);
   };

   const newTabModal = (event) => {
      event.stopPropagation();
      setModal(true);
   };

   const creatTabEvent = (value) => {
      store.dispatch(addTab({ id: new Date().getTime(), name: value , responce: false}));
   };

   const editTab = (record) => {
      store.dispatch(updateTab({...record, responce: false}));
   }

   const onlineToggle = async (event) =>{
      event.stopPropagation();
      if (event.target.checked){
         store.dispatch(setOnlinceConecting(true));
         if (!onlineParams.userName){
            const newName = prompt("Введите имя пользователя");
            store.dispatch(setUserName(newName));
            SocketAPI.connect(newName);
         } else {
            SocketAPI.connect(onlineParams.userName);
         }
      } else {
         SocketAPI.close();
         store.dispatch(init());
      }
   }
   console.log("activeTab");
   console.log(activeTab);

   return (
      <div oncontextmenu="return false;" style={{ maxWidth: "800px", margin: "0 auto" }}>
         <Heading textAlign="center" size='lg' m="2">Записуличка</Heading>
         <Box m="2" display="flex" justifyContent="flex-end" >
            {onlinceConecting ? <Spinner ml="4" mr="4" /> : (onlineParams.status ? "Онлайн" : "Оффлайн")}
            <Switch ml="2" isChecked={onlineParams.status} isDisabled={onlinceConecting} id='online-switch' onChange={onlineToggle} size='lg' />
         </Box>
         <Tabs index={activeTab.index}>
            <TabList display="flex" justifyContent="space-between">
               <EditTabModal
                  callBack={editTab}
                  isOpen={isEditModal}
                  setModal={setEditModal}
                  itemValue={editTabValue}
               />
               <Box display="flex" overflowX="auto" overflowY='hidden' >
                  {tabs.map((item) => {
                     return (
                        <Tab
                           minWidth='120px'
                           key={item.id}
                           id={item.id}
                           panelId={item.id}
                           onClick={(event) => {
                              store.dispatch(setActiveTab({id: item.id, index: Number(event.target.dataset.index)}));
                           }}
                           onDoubleClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setEditTabValue(item);
                              setEditModal(true);
                              store.dispatch(setActiveTab({id: item.id, index: Number(event.target.dataset.index)}));
                           }}
                           onContextMenu={(event)=>{
                              event.preventDefault();
                              event.stopPropagation();
                              setEditTabValue(item);
                              setEditModal(true);
                              store.dispatch(setActiveTab({id: item.id, index: Number(event.target.dataset.index)}));
                           }}
                        >
                           {item.name}
                        </Tab>
                     );
                  })}
               </Box>
               <Box mr="2" ml="1" display="flex" alignItems="center">
                  <IconButton
                     m="0.5"
                     mr="2"
                     icon={<AddIcon />}
                     onClick={newTabModal}
                  />
                  <NewTabModal
                     callBack={creatTabEvent}
                     isOpen={isModal}
                     setModal={setModal}
                  />
               </Box>
            </TabList>
            <TabPanels>
               {tabs.map((item) => {
                  return (
                     <TabPanel key={item.id}>
                        <Box>
                           <Accordion allowMultiple>
                              {todos
                                 .filter((item) => {
                                    console.log("item")
                                    console.log(item)
                                    console.log("activeTab.id")
                                    console.log(activeTab.id)
                                    return item.tab === activeTab.id;
                                 })
                                 .map((item) => {
                                    return (
                                       <AccordionItemEditable
                                          key={item.id}
                                          data={item}
                                       />
                                    );
                                 })}
                           </Accordion>
                        </Box>
                     </TabPanel>
                  );
               })}
            </TabPanels>
            <Button
               hidden={newRecordWriter}
               colorScheme="teal"
               variant="solid"
               m="5"
               leftIcon={<AddIcon />}
               onClick={() => {
                  SetNewRecordWriter(true);
               }}
            >
               Новая заметка
            </Button>
            <EditComponent
               mr="5"
               ml="5"
               onSave={newRecord}
               onUndo={undoRecord}
               hidden={!newRecordWriter}
            />
         </Tabs>
      </div>
   );
};

export default ListPage;
