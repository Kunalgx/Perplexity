import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
    const socketURL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin);

    const socket = io(socketURL, {
        withCredentials: true,
    });

    socket.on("connect", () => {
        console.log(
            "Connected to socket server with ID:",
            socket.id
        );
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
    });

    return socket;
};