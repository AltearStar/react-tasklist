import { ChakraProvider } from "@chakra-ui/react";
import ListPage from "./page/ListPage";
import { useEffect } from "react";
import { store } from "./ReduxStore";
import { init } from "./ReduxStore/todoDataReducer";

function App() {
   // const dispatch = useDispatch();
   // // store.subscribe(()=>{console.log(store.getState())});
   // dispatch(inctement());
   // dispatch(addtodo({id: 4, name: 'Задача 4'}));

   useEffect(()=>{
      store.dispatch(init());
   },[]);

   return (
      <div className="App">
         <ChakraProvider>
            <ListPage />
         </ChakraProvider>
      </div>
   );
}

export default App;
