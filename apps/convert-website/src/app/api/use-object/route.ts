import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { IAdaptiveCardSchema } from "./schema";
import { APIRequestSchema } from "./api-request";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const reqBody = APIRequestSchema.parse(await req.json());

  const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const result = await streamObject({
    model: openai("gpt-4o-mini"),
    schema: IAdaptiveCardSchema,
    maxTokens: 1000,
    prompt:
      `You are a json convert expert. You receive a Microsoft MessageCard as JSON and you need to convert it to an AdaptiveCard.
      DO NOT add more content to the card. The card should be as close as possible to the original MessageCard.
      MessageCard JSON:\n` +
      JSON.stringify(reqBody.json) +
      `\nThe user can add additional instructions to help you with the conversion. The instructions:\n` +
      reqBody.instructions,
  });

  return result.toTextStreamResponse();
}
