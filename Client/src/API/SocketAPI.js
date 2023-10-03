import { useSelector } from "react-redux";
import SocketDispatcher from "../utils/SocketDispatcher";

export default class SocketAPI {
   // static serverData = "ws://213.140.231.15:2244";
   static serverData = "ws://localhost:3001";
   static socket;

   static connect(userName) {
      console.log("userName")
      console.log(userName)
      this.socket = new WebSocket(this.serverData);

      this.socket.onopen = function () {
         console.log("Соединение установлено.");
         this.send(JSON.stringify({type: 'FirstConnect', id: Date.now(), name: userName}));
      };

      this.socket.onclose = function (event) {
         if (event.wasClean) {
            console.log("Соединение закрыто чисто");
            SocketDispatcher({type: 'ClientDisconect'});
         } else {
            console.log("Обрыв соединения");
            SocketDispatcher({type: 'ServerDisconect', errorCode: event.code});
         }
         console.log("Код: " + event.code + " причина: " + event.reason);
      };

      this.socket.onmessage = function (event) {
         console.log("Получены данные " + event.data);
         SocketDispatcher(JSON.parse(event.data));
      };

      this.socket.onerror = function (error) {
         console.log("Ошибка " + error.message);
      };

      return true;
   }

   static send(message){
      console.log("Send" + JSON.stringify(message))
      this.socket.send(JSON.stringify(message))
   }

   static close(){
      this.socket.close(1000, 'client-disconect');
   }
}
