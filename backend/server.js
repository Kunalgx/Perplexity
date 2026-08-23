import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectDb from "./src/config/database.js";
import { initSocket } from "./src/socket/server.soket.js";
import dns from "dns";


dns.setServers(["1.1.1.1",
    "8.8.8.8"
]);
const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);
initSocket(httpServer);

connectDb()
    .catch((error) => {
        console.error("MongoDB connection failed:", error.name);
        process.exit(1);
    });

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});