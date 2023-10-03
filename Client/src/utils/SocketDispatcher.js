import SocketAPI from "../API/SocketAPI";
import { store } from "../ReduxStore";
import {
   addTab,
   addtodo,
   init,
   removeTodo,
   setOnlineParams,
   setToastMessage,
   updateTodo,
   updateDataFromServer,
   updateTab,
} from "../ReduxStore/todoDataReducer";
// const toast = useToast()

export default function SocketDispatcher(message) {
   switch (message.type) {
      case "FirstConnect":
         store.dispatch(setOnlineParams(message.userKey));
         SocketAPI.send({ type: "GetAllData" });
         break;

      case "NewUser":
         //store.dispatch(setOnlineParams(message.userKey))
         break;

      case "AllData":
         store.dispatch(updateDataFromServer(message.data));
         break;

      case "SendNewTabResponce":
         store.dispatch(addTab({ ...message.data, responce: true }));
         break;

      case "EditTabResponce":
         store.dispatch(updateTab({ ...message.data, responce: true }));
         break;

      case "SendNewPostResponce":
         store.dispatch(addtodo({ ...message.data, responce: true }));
         break;

      case "EditPostResponce":
         store.dispatch(updateTodo({ ...message.data, responce: true }));
         break;

      case "DeletePostResponce":
         store.dispatch(removeTodo({ ...message.data, responce: true }));
         break;

      case "ClientDisconect":
         store.dispatch(setOnlineParams(null));
         store.dispatch(init());
         
         break;

      case "ServerDisconect":
         store.dispatch(setOnlineParams(null));
         store.dispatch(init());
         if (message.errorCode === 1006) {
            store.dispatch(setToastMessage("1006"));
         }
         break;
      default:
         return;
   }
}
