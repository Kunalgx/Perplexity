import { Server } from "socket.io";

let io;

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL,
].filter(Boolean);

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV === "production" && origin)) {
                    callback(null, true);
                    return;
                }

                callback(new Error("Socket origin not allowed"));
            },
            credentials: true,
        },
    });

    console.log("Socket.io server is RUNNING");

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);
    });
}

export function getIo() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;
}