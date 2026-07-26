import { z } from "zod";

import { CONSTANTS } from "@/shared/constants";

export const llmProviderSchema = z.enum([
  CONSTANTS.LLM.PROVIDERS.OPENAI,
  CONSTANTS.LLM.PROVIDERS.OLLAMA,
  CONSTANTS.LLM.PROVIDERS.GEMINI,
]);

export const searchRequestSchema = z.object({
  provider: llmProviderSchema,

  systemPrompt: z
    .string()
    .trim()
    .min(1, "System prompt is required.")
    .max(10_000, "System prompt is too long."),

  userPrompt: z
    .string()
    .trim()
    .min(1, "User prompt is required.")
    .max(10_000, "User prompt is too long."),
});

export type LlmProviderName =
  z.infer<typeof llmProviderSchema>;

export type SearchRequest =
  z.infer<typeof searchRequestSchema>;