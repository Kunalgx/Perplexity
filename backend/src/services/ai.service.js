import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai"
import {HumanMessage , SystemMessage,AIMessage }from "langchain"

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GEMINI_API_KEY,
});
const mistralModel = new ChatMistralAI({
  model:"mistral-small-latest",
  apiKey:process.env.MISTRAL_API_KEY
})

export async function generateResponse(messages) {

    console.log("AI function called");
    console.log("API KEY exists:", !!process.env.GEMINI_API_KEY);

    try {

        console.log("Calling Gemini...");

        const response = await geminiModel.invoke(messages.map(msg=>{
          if(msg.role=="user"){
            return new HumanMessage(msg.content)
          }else if(msg.role=="ai"){
            return new AIMessage(msg.content)
          }
        }));

        console.log("Gemini response received");

        return response.text;

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