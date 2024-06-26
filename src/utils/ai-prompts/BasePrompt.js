import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export function generateSchemaPrompt(schema, depth = 0) {
  let prompt = "";

  schema.fields.forEach((field) => {
    prompt += "  ".repeat(depth);
    prompt += `- **${field.name}**: `;
    if (field.fields) {
      prompt += "A subgroup containing fields:\n";
      prompt += generateSchemaPrompt(field, depth + 1);
    } else {
      prompt += `TYPE: ${field.type}`;
      prompt += "\n";
    }
  });

  return prompt;
}

export class BasePrompt {
  static projectId = process.env.REACT_APP_PROJECT_ID;
  static datasetId = process.env.REACT_APP_DATASET_ID;

  constructor(table) {
    this.table = table;

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      model: "gemini-pro",
      maxOutputTokens: 2048,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });

    this.conversation = new ConversationChain({
      llm: model,
      memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
      prompt: ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
      ]),
    });
  }

  async callConversation(prompt) {
    const result = await this.conversation.invoke({ input: prompt });

    return result.response;
  }
}
