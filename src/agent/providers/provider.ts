import type {
  StructuredGenerationOutput,
  StructuredGenerationRequest,
} from "@/schemas/agent/structured-generation-schema";

export interface LlmProvider {
  readonly providerName: string;

  generateStructuredOutput<T>(
    request: StructuredGenerationRequest<T>,
  ): Promise<StructuredGenerationOutput<T>>;
}