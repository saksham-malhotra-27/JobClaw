import { z } from "zod";

import { searchIntentSchema } from "@/schemas/agent/search-intent-schema";

export const generationMetadataSchema = z.object({
  provider: z.string().trim().min(1),
  model: z.string().trim().min(1),
  latencyMs: z.number().int().nonnegative(),
  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),
});

export const searchSuccessResponseSchema = z.object({
  success: z.literal(true),

  data: z.object({
    intent: searchIntentSchema,
    generation: generationMetadataSchema,
  }),
});

export const searchErrorResponseSchema = z.object({
  success: z.literal(false),

  error: z.object({
    code: z.string().trim().min(1),
    message: z.string().trim().min(1),
    details: z.unknown().optional(),
  }),
});

export const searchApiResponseSchema =
  z.discriminatedUnion("success", [
    searchSuccessResponseSchema,
    searchErrorResponseSchema,
  ]);

export type GenerationMetadata =
  z.infer<typeof generationMetadataSchema>;

export type SearchSuccessResponse =
  z.infer<typeof searchSuccessResponseSchema>;

export type SearchErrorResponse =
  z.infer<typeof searchErrorResponseSchema>;

export type SearchApiResponse =
  z.infer<typeof searchApiResponseSchema>;

export type SearchResultData =
  SearchSuccessResponse["data"];