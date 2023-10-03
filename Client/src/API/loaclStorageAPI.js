export default class loaclStorageAPI{
   static udateTabStorage(data){
      localStorage.setItem("TAB_DATA", JSON.stringify(data));
   }
   static getTabStorage(){
      return JSON.parse(localStorage.getItem("TAB_DATA"));
   }
   static staticUpdateTaskList(data){
      console.log('sadsad')
      localStorage.setItem("TASK_DATA", JSON.stringify(data));
   }
   static getTaskList(){
      return JSON.parse(localStorage.getItem("TASK_DATA"));
   }
   static saveUserData(data){
      localStorage.setItem("TASK_USERDATA", JSON.stringify(data));
   }
   static getUserData(){
      return JSON.parse(localStorage.getItem("TASK_USERDATA"));
   }
}