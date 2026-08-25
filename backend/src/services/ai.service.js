import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage}from "langchain"

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.7-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateResponse(message) {

    console.log("AI function called");
    console.log("API KEY exists:", !!process.env.GEMINI_API_KEY);

    try {

        console.log("Calling Gemini...");

        const response = await model.invoke([
            new HumanMessage(message)
        ]);

        console.log("Gemini response received");

        return response.text;

    } catch (error) {

        console.error("GEMINI ERROR:");
        console.error(error);

        throw error;
    }
}