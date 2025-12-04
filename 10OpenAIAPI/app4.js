// 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
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv"
dotenv.config()
import rd from "readline-sync"
async function main() {
    let apiKey = process.env.claudeKey
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