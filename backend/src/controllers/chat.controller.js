import { response } from "express"
import { generateResponse } from "../services/ai.service.js"

// export async function sendMessage(req,res) {
//     const {message}= req.body
//     const result = await genrateResponse(message)

//     res.json({
//        Aimessage:result
//     })
// }
export async function sendMessage(req, res) {
    try {
        const { message } = req.body

        console.log("User message:", message)

        const result = await generateResponse(message)

        console.log("AI result:", result)

        return res.status(200).json({
            Aimessage: result
        })

    } catch (error) {
        console.error("AI Error:", error)

        return res.status(500).json({
            message: "AI response generate nahi ho paya",
            error: error.message
        })
    }
}