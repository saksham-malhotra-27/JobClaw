import { z } from "zod";

import { CONSTANTS } from "@/shared/constants";

export const llmProviderSchema = z.enum([
  CONSTANTS.LLM.PROVIDERS.OPENAI,
  CONSTANTS.LLM.PROVIDERS.OLLAMA,
  CONSTANTS.LLM.PROVIDERS.GEMINI,
]);

export const executionPreferencesSchema =
  z.object({
    maxParallelAgents: z
      .number()
      .int()
      .positive()
      .max(10)
      .default(2),

    maxLlmCallsPerMinute: z
      .number()
      .int()
      .positive()
      .max(100)
      .default(5),

    batchSize: z
      .number()
      .int()
      .positive()
      .max(20)
      .default(5),
  });

export const searchRequestSchema = z.object({
  provider: llmProviderSchema,

  systemPrompt: z
    .string()
    .trim()
    .min(1)
    .max(10_000),

  userPrompt: z
    .string()
    .trim()
    .min(1)
    .max(10_000),

  execution: executionPreferencesSchema.default({
    maxParallelAgents: 2,
    maxLlmCallsPerMinute: 5,
    batchSize: 5,
  }),
});

export type LlmProviderName =
  z.infer<typeof llmProviderSchema>;

export type SearchRequest =
  z.infer<typeof searchRequestSchema>;

export type ExecutionPreferences =
  z.infer<typeof executionPreferencesSchema>;