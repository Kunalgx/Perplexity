import { useDispatch } from "react-redux"
import { setCurrentChatId, setError, setLoading } from "../chat.slice"
import { getChats, getMessage, sendMessage, deleteChat } from "../pages/service/chat.api"
import { initializeSocketConnection } from "../pages/service/chat.socket"

export const useChat = () => {
    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await sendMessage({ message, chatId })
            dispatch(setCurrentChatId(data.chat._id))
            return data
        } catch (error) {
            const messageText = error.response?.data?.message || 'Unable to send your message.'
            dispatch(setError(messageText))
            throw new Error(messageText)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        return getChats()
    }

    async function handleGetMessages(chatId) {
        return getMessage(chatId)
    }

    async function handleDeleteChat(chatId) {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await deleteChat(chatId)
            return data
        } catch (error) {
            const messageText = error.response?.data?.message || 'Unable to delete this chat.'
            dispatch(setError(messageText))
            throw new Error(messageText)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return{
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleGetMessages,
        handleDeleteChat,
    }
}