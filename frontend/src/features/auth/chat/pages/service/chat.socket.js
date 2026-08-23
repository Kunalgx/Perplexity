import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
    const socket = io("http://localhost:3000", {
        withCredentials: true,
    });

    socket.on("connect", () => {
        console.log("Connected to socket server with ID:");
    }
    );
    // socket.on("disconnect", () => {
    //     console.log("Disconnected from socket server");
    // });
}