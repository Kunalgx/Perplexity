import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL,
].filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV === "production" && origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRouter);

app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return next();
    }

    return res.sendFile(path.resolve("./public/index.html"));
});

export default app;