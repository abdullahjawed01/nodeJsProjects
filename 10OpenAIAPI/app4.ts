
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv"
dotenv.config()
import rd from "readline-sync"
async function main(): Promise<void>{
    let apiKey = process.env.claudeKey  as string
  const anthropic = new Anthropic({apiKey});

  const msg = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: rd.question("What is your request:")
      }
    ]
  });
  console.log(msg);
}

main().catch(console.error);