import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/config/database.js";
import dns from "dns";


dns.setServers(["1.1.1.1",
    "8.8.8.8"
]);
const PORT = process.env.PORT || 3000;

connectDb()
    .catch((error) => {
        console.error("MongoDB connection failed:", error.name);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});