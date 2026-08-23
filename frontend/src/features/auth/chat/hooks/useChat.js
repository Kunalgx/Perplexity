import { initializeSocketConnection } from "../pages/service/chat.socket";
export const useChat=()=>{
    return{
        initializeSocketConnection,
    }
}