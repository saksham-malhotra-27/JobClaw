import { z } from "zod";

import { llmProviderSchema } from "@/schemas/agent/search-request-schema";

export const providerDetailsSchema = z.object({
  id: llmProviderSchema,
  label: z.string().trim().min(1),
  available: z.boolean(),
});

export const providersSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(providerDetailsSchema),
});

export const providersErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string().trim().min(1),
    message: z.string().trim().min(1),
  }),
});

export const providersApiResponseSchema =
  z.discriminatedUnion("success", [
    providersSuccessResponseSchema,
    providersErrorResponseSchema,
  ]);

export type ProviderDetails =
  z.infer<typeof providerDetailsSchema>;

export type ProvidersApiResponse =
  z.infer<typeof providersApiResponseSchema>;