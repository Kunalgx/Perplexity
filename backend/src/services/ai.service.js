import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai"
import {HumanMessage , SystemMessage,AIMessage, tool,createAgent }from "langchain"
import *as z from "zod"
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-lite",
  apiKey: process.env.GEMINI_API_KEY,
});
const mistralModel = new ChatMistralAI({
  model:"mistral-small-latest",
  apiKey:process.env.MISTRAL_API_KEY
})
const searchInternetTool= tool(
  searchInternet,
  {
    name:"searchInternet",
    description:"Use this tools to get the a latest information from the internet",
    schema:z.object({
      query:z.string().describe("The search query to lok up on the internet")
    })
  }
)
const agent = createAgent({
  model:mistralModel,
  tools:[searchInternetTool]
})

export async function generateResponse(messages) {
    console.log("AI function called");
    console.log("API KEY exists:", !!process.env.GEMINI_API_KEY);

    try {
        console.log("Calling Gemini...");

        const formattedMessages = messages.map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            }

            if (msg.role === "ai") {
                return new AIMessage(msg.content);
            }

            if (msg.role === "system") {
                return new SystemMessage(msg.content);
            }

            return null;
        }).filter(Boolean);

        const response = await agent.invoke({
            messages: formattedMessages,
        });

        console.log("Gemini response received");

        return response.messages[response.messages.length - 1].text;

    } catch (error) {
        console.error("GEMINI ERROR:");
        console.error(error);

        throw error;
    }
}
export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistent that generate concise and description title for chat conversation .
      User will Provided you with the first message of a chat conversation and will genrate a title that capture the essence of the
      conversion in 2-4 Words . The title should be clear , relevent and , engaing, giving users a quicks understanding of the chat's topic.

      `),
      new HumanMessage(`
        Generate a title for a chat converstion based on the following first message :
        "${message}"
        `)
  ])
  return response.text
}