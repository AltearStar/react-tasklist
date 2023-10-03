import { configureStore } from "@reduxjs/toolkit";
import todoData from "./todoDataReducer";

// const rootReducer = combineReducers({
//    toolkit: toolkitSlice
// });

export const store = configureStore({
   reducer: todoData
})