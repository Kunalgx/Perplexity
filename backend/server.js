import "dotenv/config"
import app from "./src/app.js"
import connectDb from "./src/config/database.js"
import dns from "dns"

dns.setServers(["1.1.1.1",
    "8.8.8.8"
])
const PORT = process.env.port || 8000;

connectDb()
    .catch((err)=>{
        console.error("MOngoDb connection faild :",err)
        process.exit(1)
    })

app.listen(PORT ,()=>{
    console.log(`Server running on port ${PORT}`)
})