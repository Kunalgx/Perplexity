import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin);

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
    const response = await api.post("/api/chats/message", {
        message,
        chatId,
    });

    return response.data;
};

export const getChats = async () => {
    const response = await api.get("/api/chats");

    return response.data.chats;
};

export const getMessage = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`);

    return response.data.messages;
};

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`);

    return response.data;
};