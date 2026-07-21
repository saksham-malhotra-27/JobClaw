import type { ZodType } from "zod";

export interface StructuredGenerationRequest<T> {
  systemPrompt: string;
  userPrompt: string;
  schema: ZodType<T>;
  schemaName: string;
}

export interface StructuredGenerationOutput<T> {
  output: T;
  provider: string;
  model: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
}