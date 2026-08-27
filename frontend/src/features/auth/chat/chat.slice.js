import {createSlice} from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState:{
        chat:{},
        currentChatId:null,
        isLoading:false,
        error:null
    },
    reducers:{
        setChats:(state,action)=>{
            state.chats = action.payload
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId = action.payload
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload
        },
        setError:(state,action)=>{
            state.error = action.payload
        }
    }
})
export const { setChats, setCurrentChatId , setLoading,setError}=chatSlice.actions
export default chatSlice.reducer


// chats={
//     "docker and aws":{
//         messages:[
//             {
//                 role:"user",
//                 content:"Hi"
//             },
//             {
//                 role:"ai",
//                 content:"Hi there"
//             }
//         ],
//         id:"docker and aws",
//         lastUpdate:"2024-06"
//     }
// }