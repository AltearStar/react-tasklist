import { createSlice } from "@reduxjs/toolkit";
import loaclStorageAPI from "../API/loaclStorageAPI";
import SocketAPI from "../API/SocketAPI";

const todosDefault =  [
   { id: 1, name: "Задача 1", desc: "Описание задачи 1", tab: 0 },
   { id: 2, name: "Задача 2", desc: "Описание задачи 2", tab: 0 },
   { id: 3, name: "Задача 3", desc: "Описание задачи 3", tab: 0 },
   { id: 4, name: "Задача 4", desc: "Описание задачи 4", tab: 1 },
];
const tabsDefault = [
   { id: 0, name: "Список задач №1" },
   { id: 1, name: "Список задач №2" },
]

const todoData = createSlice({
   name: "toolkit",
   initialState: {
      activeTab: {id: 0, index: 0},
      toastMessage: {
         code: null,
      },
      onlinceConecting: false,
      tab: tabsDefault,
      todos: todosDefault,
      onlineParams: {
         status: false,
         userId: null,
         userName: "",
         key: null,
      },
   },
   reducers: {
      setActiveTab(state, action) {
         state.activeTab = action.payload;
      },
      addTab(state, action) {
         if (state.onlineParams.status && !action.payload.responce) {
               SocketAPI.send({ type: "SendNewTab", data: action.payload });
         } else {
            state.tab.push(action.payload);
            !state.onlineParams.status && loaclStorageAPI.udateTabStorage(state.tab);
         }
      },
      updateTab(state, action) {
         console.log("EditTab");
         console.log(action.payload);
         if (state.onlineParams.status && !action.payload.responce) {
            console.log("Send!!")
            SocketAPI.send({ type: "EditTab", data: action.payload });
         } else {
            const stateId = state.tab.findIndex((item) => {
               return item.id === action.payload.id;
            });
            state.tab[stateId] = action.payload;
            !state.onlineParams.status && loaclStorageAPI.udateTabStorage(state.tab);
         }
      },
      addtodo(state, action) {
         console.log(action.payload)
         if (state.onlineParams.status && !action.payload.responce) {
            SocketAPI.send({ type: "SendNewPost", data: action.payload });
         } else {
            state.todos.push(action.payload);
            !state.onlineParams.status && loaclStorageAPI.staticUpdateTaskList(state.todos);
         }
      },
      updateTodo(state, action) {
         if (state.onlineParams.status && !action.payload.responce) {
            SocketAPI.send({ type: "EditPost", data: action.payload });
         } else {
            const stateId = state.todos.findIndex((item) => {
               return item.id === action.payload.id;
            });
            state.todos[stateId] = action.payload;
            !state.onlineParams.status && loaclStorageAPI.staticUpdateTaskList(state.todos);
         }
      },
      removeTodo(state, action) {
         if (state.onlineParams.status && !action.payload.responce) {
            SocketAPI.send({ type: "DeletePost", data: action.payload });
         } else {
            state.todos = state.todos.filter((item) => {
               return item.id !== action.payload.id;
            });
            !state.onlineParams.status && loaclStorageAPI.staticUpdateTaskList(state.todos);
         }
      },
      setUserName(state, action) {
         state.onlineParams.userName = action.payload;
         state.onlineParams.userId = Date.now();
         loaclStorageAPI.saveUserData({
            userId: state.onlineParams.userId,
            userName: state.onlineParams.userName,
         });
      },
      setOnlineParams(state, action) {
         if (action.payload) {
            state.onlineParams.key = action.payload;
            state.onlineParams.status = true;
         } else {
            state.onlineParams.key = null;
            state.onlineParams.status = false;
         }
         state.onlinceConecting = false;
      },
      setToastMessage(state, action) {
         state.toastMessage.code = action.payload;
      },
      setOnlinceConecting(state, action) {
         state.onlinceConecting = action.payload;
      },
      updateDataFromServer(state, action) {
         state.tab = action.payload.tab;
         state.todos = action.payload.todos;
         state.activeTab = {id: 0, index: 0};
      },
      init(state) {
         const storageData = {
            todos: loaclStorageAPI.getTaskList(),
            tabs: loaclStorageAPI.getTabStorage(),
            userData: loaclStorageAPI.getUserData(),
         };
         if (storageData.todos) {
            state.todos = storageData.todos;
         } else {
            state.todos = todosDefault;
         }
         if (storageData.tabs) {
            state.tab = storageData.tabs;
         } else {
            state.tab = tabsDefault;
         }
         if (storageData.userData) {
            state.onlineParams.userName = storageData.userData.userName;
            state.onlineParams.userId = storageData.userData.userId;
         }
         state.activeTab = {id: 0, index: 0};
      },
   },
});

export default todoData.reducer;
export const {
   setActiveTab,
   addTab,
   updateTab,
   addtodo,
   removeTodo,
   updateTodo,
   setUserName,
   setOnlineParams,
   setToastMessage,
   updateDataFromServer,
   setOnlinceConecting,
   init,
} = todoData.actions;
