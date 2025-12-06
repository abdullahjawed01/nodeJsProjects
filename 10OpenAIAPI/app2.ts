import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
dotenv.config()
const ai  = new GoogleGenAI({ apiKey: process.env.genKEY as string });

async function main(): Promise<void>{
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();