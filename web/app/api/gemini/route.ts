import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { Message } from "@ai-sdk/react";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const runtime = "edge";

const generateId = () => Math.random().toString(36).slice(2, 10);

const buildGoogleGenAIPrompt = (messages: Message[]): Message[] => [
  {
    id: generateId(),
    role: "user",
    content: messages.map((msg) => msg.content).join("\n"),
  },
  ...messages.map((msg) => ({
    id: msg.id || generateId(),
    role: msg.role,
    content: msg.content,
  })),
];

export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = await streamText({
    model: google("gemini-2.5-flash"),
    messages: buildGoogleGenAIPrompt(messages),
    temperature: 0.2,
  });
  return stream?.toDataStreamResponse();
}