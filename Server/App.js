const http = require("http");
const express = require( "express");
const ws = require( "ws");
const fs = require("fs");

let userList = [];
let fileContent = fs.readFileSync("Alt_AppData_Local.txt", "utf8");
let AppData = {};
if (fileContent){
   AppData = JSON.parse(fileContent);
}else{
   AppData = {
      tab: [
         { id: 0, name: "Общий список задач №1" },
         { id: 1, name: "Общий список задач №2" },
      ],
      todos: [
         { id: 1, name: "Задача общая 1", desc: "Описание задачи 1", tab: 0 },
         { id: 2, name: "Задача общая 2", desc: "Описание задачи 2", tab: 1 },
      ],
   };
}
let stateId;

const saveDataLocal = (data) => {
   fs.writeFileSync("Alt_AppData_Local.txt", JSON.stringify(data))
}

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

var index = fs.readFileSync('./public/index.html');

app.get('/', (req, res) => {
   //   res.send('Hello World!')
   res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
   res.end(index);
 })

const wss = new ws.Server(
   {
      server
   },
   () => console.log("Server start on 3001")
);

wss.on("connection", function connection(ws) {
   console.log("conecT!!!");
   ws.on("message", function (message) {
      message = JSON.parse(message);
      console.log(message);

      if (message.type) {
         switch (message.type) {
            case "FirstConnect":
               const userIndex = userList.findIndex((item) => {
                  item.name == message.name && item.id == message.id;
               });
               if (userIndex == -1) {
                  const newUserKey = Date.now();
                  userList.push({
                     id: message.id,
                     name: message.name,
                     key: newUserKey,
                  });
                  ws.send(
                     JSON.stringify({
                        type: "FirstConnect",
                        userKey: newUserKey,
                     })
                  );
                  wsBroadCast(
                     { type: "NewUser", newUserName: message.name },
                     ws
                  );
               } else {
                  ws.send(
                     JSON.stringify({
                        type: "FirstConnect",
                        userKey: userList[userIndex].key,
                     })
                  );
                  wsBroadCast(
                     { type: "NewUser", newUserName: userList[userIndex].name },
                     ws
                  );
               }
               break;
            case "GetAllData":
               ws.send(JSON.stringify({type: "AllData", data: AppData}));
               break;
            case "SendNewTab":
               AppData.tab.push(message.data);
               ws.send(JSON.stringify({type: "SendNewTabResponce", data: message.data}));
               wsBroadCast({type: "SendNewTabResponce", data: message.data}, ws);
               saveDataLocal(AppData);
               break;
            case "EditTab":
               stateId = AppData.tab.findIndex((item) => {
                  return item.id === message.data.id;
               });
               AppData.tab[stateId] = message.data;
               ws.send(JSON.stringify({type: "EditTabResponce", data: message.data}));
               wsBroadCast({type: "EditTabResponce", data: message.data}, ws);
               saveDataLocal(AppData);
               break;
            case "SendNewPost":
               AppData.todos.push(message.data);
               ws.send(JSON.stringify({type: "SendNewPostResponce", data: message.data}));
               wsBroadCast({type: "SendNewPostResponce", data: message.data}, ws);
               saveDataLocal(AppData);
               break;
            case "EditPost":
               stateId = AppData.todos.findIndex((item) => {
                  return item.id === message.data.id;
               });
               AppData.todos[stateId] = message.data;
               ws.send(JSON.stringify({type: "EditPostResponce", data: message.data}));
               wsBroadCast({type: "EditPostResponce", data: message.data}, ws);
               saveDataLocal(AppData);
               break;
            case "DeletePost":
               AppData.todos = AppData.todos.filter((item) => {
                  return item.id !==  message.data.id;
               });
               ws.send(JSON.stringify({type: "DeletePostResponce", data: message.data}));
               wsBroadCast({type: "DeletePostResponce", data: message.data}, ws);
               saveDataLocal(AppData);
               break;
            default:
               return;
         }
      }
   });
});

const wsBroadCast = (message, ws) => {
   console.log("Broadcast message");
   console.log(message);
   wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === ws.OPEN) {
         client.send(JSON.stringify(message));
      }
   });
};


server.listen(80, () => console.log("Server started"))