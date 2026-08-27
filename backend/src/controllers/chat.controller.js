import { response } from "express"
import { generateResponse, generateChatTitle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body

        console.log("User message:", message)
        //Result and Title model
        let chat;
        let title = null;

        if (chatId) {

            // Existing chat find karo
            chat = await chatModel.findOne({
                _id: chatId,
                user: req.user.id
            });

            if (!chat) {
                return res.status(404).json({
                    message: "Chat not found"
                });
            }

        } else {

            // New chat
            title = await generateChatTitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title
            });
        }
        const userMessage = await messageModel.create({
            chat: chat._id,
            content: message,
            role: "user"
        })

        const messages = await messageModel.find({ chat: chat.id })
        const result = await generateResponse(messages)

        const aimessage = await messageModel.create({
            chat: chat._id || chat.id,
            content: result,
            role: 'ai'
        })

        // //messageModel
        // console.log("Gemini AI result:", result)
        // console.log("Mistral AI result:", title)
        console.log(messages)
        return res.status(200).json({

            title,
            chat,
            aimessage,
            userMessage
        })

    } catch (error) {
        console.error("AI Error:", error)

        return res.status(500).json({
            message: "AI response generate nahi ho paya",
            error: error.message
        })
    }
}
export async function getChats(req,res) {
    const user = req.user

    const chats = await chatModel.find({user:user.id})

    res.status(200).json({
        message:"Chat retrived successfully",
        chats
    })
}
export async function getMessages(req,res){
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })
    if(!chat){
        return res.status(404).json({
            message:"Chat not found !!"
        })
    }
    const messages = await messageModel.find({
        chat:chatId
    })

    res.status(200).json({
        message:"Message retrived sucessfully",
        messages
    })
}
export async function deleteChat(req,res){
    const {chatId}= req.params;

    const chat = await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })
    await messageModel.deleteMany({
        chat:chatId
    })
    if(!chat){
        return res.status(404).json({
            message:"Chat not Found"
        })
    }
    res.status(200).json({
        message:"Chat delete Successfully"
    })
}